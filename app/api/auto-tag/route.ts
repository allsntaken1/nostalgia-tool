import { NextResponse } from 'next/server';
import { requireAdmin, validateUploadImage } from '@/app/lib/safety';

const DECADES = ['80s', '90s', '2000s', 'Not Sure'] as const;

const CHANNELS = [
  {
    category: 'STORES',
    title: 'Stores',
    subs: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'],
  },
  {
    category: 'MALLS',
    title: 'Malls',
    subs: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'],
  },
  {
    category: 'THEME PARKS',
    title: 'Theme Parks',
    subs: ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'],
  },
  {
    category: 'RESTAURANTS',
    title: 'Restaurants',
    subs: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'],
  },
  {
    category: 'HOME LIFE',
    title: 'Home Life',
    subs: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'],
  },
  {
    category: 'SCHOOLS',
    title: 'Schools',
    subs: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'],
  },
  {
    category: 'ARCADES & GAMING',
    title: 'Arcades & Gaming',
    subs: ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'],
  },
  {
    category: 'MOVIES & ENTERTAINMENT',
    title: 'Movies & Entertainment',
    subs: ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'],
  },
  {
    category: 'TRAVEL & VACATION',
    title: 'Travel & Vacation',
    subs: ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'],
  },
  {
    category: 'OUTDOORS',
    title: 'Outside',
    subs: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'],
  },
  {
    category: 'CARS & ROAD LIFE',
    title: 'Cars',
    subs: ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'],
  },
] as const;

const CATEGORY_OPTIONS = [...CHANNELS.map((channel) => channel.category), 'Unsorted'];
const SUBTAG_OPTIONS = CHANNELS.flatMap((channel) => channel.subs);
const SUBTAG_OPTION_SET = new Set<string>(SUBTAG_OPTIONS);
const LOW_CONFIDENCE = 0.55;

type AutoTagSuggestion = {
  decade: string;
  category: string;
  subTags: string[];
  extraTags: string[];
  confidence: number;
  note: string;
};

function cleanTags(tags: unknown, allowed?: readonly string[]) {
  if (!Array.isArray(tags)) return [];
  const allowedSet = allowed ? new Set(allowed) : null;

  return Array.from(
    new Set(
      tags
        .filter((tag): tag is string => typeof tag === 'string')
        .map((tag) => tag.trim())
        .filter((tag) => tag && (!allowedSet || allowedSet.has(tag)))
    )
  ).slice(0, 8);
}

function normalizeSuggestion(value: unknown): AutoTagSuggestion {
  const item = value && typeof value === 'object' ? (value as Record<string, unknown>) : {};
  const confidence = typeof item.confidence === 'number' ? Math.max(0, Math.min(1, item.confidence)) : 0;
  const requestedDecade = typeof item.decade === 'string' ? item.decade : 'Not Sure';
  const requestedCategory = typeof item.category === 'string' ? item.category : 'Unsorted';
  const decade = confidence < LOW_CONFIDENCE || !DECADES.includes(requestedDecade as (typeof DECADES)[number])
    ? 'Not Sure'
    : requestedDecade;
  const category = confidence < LOW_CONFIDENCE || !CATEGORY_OPTIONS.includes(requestedCategory)
    ? 'Unsorted'
    : requestedCategory;

  return {
    decade,
    category,
    subTags: category === 'Unsorted' ? [] : cleanTags(item.subTags, SUBTAG_OPTIONS),
    extraTags: cleanTags(item.extraTags).filter((tag) => !SUBTAG_OPTION_SET.has(tag)),
    confidence,
    note: typeof item.note === 'string' && item.note.trim()
      ? item.note.trim().slice(0, 240)
      : 'The model did not provide a clear explanation.',
  };
}

function extractOutputText(data: unknown) {
  if (!data || typeof data !== 'object') return '';
  const response = data as Record<string, unknown>;

  if (typeof response.output_text === 'string') return response.output_text;

  const output = Array.isArray(response.output) ? response.output : [];
  for (const item of output) {
    if (!item || typeof item !== 'object') continue;
    const content = Array.isArray((item as Record<string, unknown>).content)
      ? ((item as Record<string, unknown>).content as unknown[])
      : [];
    for (const contentItem of content) {
      if (!contentItem || typeof contentItem !== 'object') continue;
      const text = (contentItem as Record<string, unknown>).text;
      if (typeof text === 'string') return text;
    }
  }

  return '';
}

function findJsonText(value: unknown): string {
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.includes('{')) return trimmed;
    return '';
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findJsonText(item);
      if (found) return found;
    }
    return '';
  }

  if (!value || typeof value !== 'object') return '';

  const record = value as Record<string, unknown>;
  for (const key of ['parsed', 'json', 'text', 'output_text']) {
    const found = findJsonText(record[key]);
    if (found) return found;
  }

  for (const child of Object.values(record)) {
    const found = findJsonText(child);
    if (found) return found;
  }

  return '';
}

function parseJsonCandidate(text: string) {
  const trimmed = text.trim();
  if (!trimmed) return null;

  try {
    return JSON.parse(trimmed);
  } catch {
    const start = trimmed.indexOf('{');
    const end = trimmed.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) return null;

    return JSON.parse(trimmed.slice(start, end + 1));
  }
}

async function fileToDataUrl(file: File) {
  const buffer = Buffer.from(await file.arrayBuffer());
  return `data:${file.type};base64,${buffer.toString('base64')}`;
}

async function readImageInput(request: Request) {
  const contentType = request.headers.get('content-type') || '';

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const file = form.get('image');
    const validationError = validateUploadImage(file);
    if (validationError) return { error: validationError };

    return {
      imageUrl: await fileToDataUrl(file as File),
      title: typeof form.get('title') === 'string' ? String(form.get('title')) : '',
    };
  }

  const body = await request.json().catch(() => null);
  const imageUrl = body && typeof body.imageUrl === 'string' ? body.imageUrl : '';

  if (!imageUrl) return { error: 'Missing image URL.' };

  return {
    imageUrl,
    title: body && typeof body.title === 'string' ? body.title : '',
  };
}

export async function POST(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'OPENAI_API_KEY is not configured.' }, { status: 500 });
  }

  const imageInput = await readImageInput(request);
  if ('error' in imageInput) {
    return NextResponse.json({ error: imageInput.error }, { status: 400 });
  }

  const channelGuide = CHANNELS.map((channel) => `${channel.category}: ${channel.subs.join(', ')}`).join('\n');

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_AUTOTAG_MODEL || 'gpt-5-mini',
      input: [
        {
          role: 'system',
          content: [
            {
              type: 'input_text',
              text: `You are RepeatChannel's admin-only archive tag assistant. Return JSON only. Suggest tags; do not decide publication. Use only these categories and sub-tags:
${channelGuide}

Use OUTDOORS for outside/outdoor scenes and CARS & ROAD LIFE for cars. If uncertain or the image is too vague, use decade "Not Sure", category "Unsorted", no subTags, and confidence below ${LOW_CONFIDENCE}. Confidence must be 0 to 1.`,
            },
          ],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text: `Analyze this nostalgia archive image${imageInput.title ? ` titled "${imageInput.title}"` : ''}. Return JSON with decade, category, subTags, extraTags, confidence, and note.`,
            },
            {
              type: 'input_image',
              image_url: imageInput.imageUrl,
              detail: 'low',
            },
          ],
        },
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'repeat_channel_auto_tag',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              decade: { type: 'string', enum: [...DECADES] },
              category: { type: 'string', enum: CATEGORY_OPTIONS },
              subTags: {
                type: 'array',
                items: { type: 'string', enum: SUBTAG_OPTIONS },
                maxItems: 4,
              },
              extraTags: {
                type: 'array',
                items: { type: 'string' },
                maxItems: 6,
              },
              confidence: { type: 'number', minimum: 0, maximum: 1 },
              note: { type: 'string' },
            },
            required: ['decade', 'category', 'subTags', 'extraTags', 'confidence', 'note'],
          },
        },
      },
      max_output_tokens: 1200,
    }),
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data && typeof data === 'object' && 'error' in data
      ? JSON.stringify((data as Record<string, unknown>).error)
      : `OpenAI request failed: ${response.status}`;

    return NextResponse.json({ error: message }, { status: 500 });
  }

  const responseStatus = data && typeof data === 'object' ? (data as Record<string, unknown>).status : '';
  const outputText = extractOutputText(data) || findJsonText(data);
  let parsed: unknown = null;

  try {
    parsed = parseJsonCandidate(outputText);
  } catch {
    return NextResponse.json({ error: 'OpenAI returned malformed tag JSON.' }, { status: 502 });
  }

  if (!parsed) {
    const details = data && typeof data === 'object'
      ? JSON.stringify({
          status: responseStatus,
          incomplete_details: (data as Record<string, unknown>).incomplete_details,
        })
      : 'No response body.';

    return NextResponse.json(
      { error: `OpenAI did not return tag JSON. ${details}` },
      { status: 502 }
    );
  }

  return NextResponse.json(normalizeSuggestion(parsed));
}
