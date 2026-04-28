import { NextResponse } from 'next/server';
import {
  approveSubmissionItem,
  createSubmissionItem,
  deleteSubmissionItem,
  listSubmissionItems,
  normalizeTagInput,
  uploadPendingImage,
} from '@/app/lib/storage';
import { requireAdmin, validateUploadImage } from '@/app/lib/safety';

export async function GET(request: Request) {
  const unauthorized = requireAdmin(request);
  if (unauthorized) return unauthorized;

  const submissions = await listSubmissionItems();

  return NextResponse.json(submissions, {
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}

export async function POST(request: Request) {
  const formData = await request.formData().catch(() => null);

  if (!formData) {
    return NextResponse.json({ error: 'Missing submission form.' }, { status: 400 });
  }

  const file = formData.get('image');

  const uploadError = validateUploadImage(file);

  if (uploadError || !(file instanceof File)) {
    return NextResponse.json({ error: uploadError || 'Please upload an image file.' }, { status: 400 });
  }

  const id = crypto.randomUUID();
  const publicUrl = await uploadPendingImage(file, id);
  const submission = await createSubmissionItem({
    id,
    title: typeof formData.get('title') === 'string' && formData.get('title') ? String(formData.get('title')) : 'Untitled memory',
    imageUrl: publicUrl,
    thumbUrl: publicUrl,
    source: 'Community upload',
    sourceUrl: '',
    originalQuery: 'Community upload',
    decade: typeof formData.get('decade') === 'string' ? String(formData.get('decade')) : 'Not Sure',
    category: typeof formData.get('category') === 'string' ? String(formData.get('category')) : 'Unsorted',
    subTags: normalizeTagInput(formData.get('subTags')),
    extraTags: normalizeTagInput(formData.get('extraTags')),
    submittedAt: new Date().toLocaleString(),
    status: 'pending',
  });

  return NextResponse.json(submission, { status: 201 });
}

export async function PATCH(request: Request) {
  try {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;

    const body = await request.json().catch(() => null);
    const id = body && typeof body === 'object' && 'id' in body ? String(body.id) : '';

    if (!id) {
      return NextResponse.json({ error: 'Missing submission id.' }, { status: 400 });
    }

    const archiveItem = await approveSubmissionItem(id);

    if (!archiveItem) {
      return NextResponse.json({ error: 'Submission not found.' }, { status: 404 });
    }

    return NextResponse.json(archiveItem);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not approve submission.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const unauthorized = requireAdmin(request);
    if (unauthorized) return unauthorized;

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing submission id.' }, { status: 400 });
    }

    await deleteSubmissionItem(id);

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not reject submission.';

    return NextResponse.json({ error: message }, { status: 500 });
  }
}
