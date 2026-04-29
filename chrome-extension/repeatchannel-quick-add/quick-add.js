const DECADES = ['80s', '90s', '2000s', 'Not Sure'];

const CHANNELS = [
  { label: 'Stores', category: 'STORES', subs: ['Big Box', 'Toy Stores', 'Electronics', 'Grocery', 'Department', 'Video Stores'] },
  { label: 'Mall', category: 'MALLS', subs: ['Mall Interiors', 'Food Courts', 'Anchor Stores', 'Specialty Shops', 'Kiosks', 'Mall Events'] },
  { label: 'Restaurants', category: 'RESTAURANTS', subs: ['Fast Food', 'Pizza Places', 'Casual Dining', 'Play Places', 'Buffets', 'Drive-Thru'] },
  { label: 'Theme Parks', category: 'THEME PARKS', subs: ['Rides', 'Park Areas', 'Resorts', 'Food & Dining', 'Queues', 'Maps & Signage'] },
  { label: 'Schools', category: 'SCHOOLS', subs: ['Classrooms', 'Cafeterias', 'Hallways', 'Playgrounds', 'Libraries', 'School Events'] },
  { label: 'Home', category: 'HOME LIFE', subs: ['Living Rooms', 'Bedrooms', 'Kitchens', 'Basements', 'Game Rooms', 'Home Computers'] },
  { label: 'Outside', category: 'OUTDOORS', subs: ['Parks', 'Neighborhoods', 'Pools', 'Playgrounds', 'Campgrounds', 'Skate Parks'] },
  { label: 'Cars', category: 'CARS & ROAD LIFE', subs: ['Car Interiors', 'Road Trips', 'Parking Lots', 'Dealerships', 'Dashboard Views', 'Car Culture'] },
  { label: 'Arcades & Gaming', category: 'ARCADES & GAMING', subs: ['Arcades', 'Store Kiosks', 'LAN Setups', 'Console Rooms', 'Prize Areas', 'Game Corners'] },
  { label: 'Movies & Entertainment', category: 'MOVIES & ENTERTAINMENT', subs: ['Movie Theaters', 'Drive-Ins', 'Video Rentals', 'Home Media', 'Concessions', 'Lobby Spaces'] },
  { label: 'Travel & Vacation', category: 'TRAVEL & VACATION', subs: ['Airports', 'Airplanes', 'Hotels', 'Motels', 'Roadside Stops', 'Travel Interiors'] },
];

const els = {
  settingsToggle: document.getElementById('settingsToggle'),
  settingsPanel: document.getElementById('settingsPanel'),
  apiEndpoint: document.getElementById('apiEndpoint'),
  adminSecret: document.getElementById('adminSecret'),
  saveSettings: document.getElementById('saveSettings'),
  preview: document.getElementById('preview'),
  emptyPreview: document.getElementById('emptyPreview'),
  imageUrl: document.getElementById('imageUrl'),
  sourceUrl: document.getElementById('sourceUrl'),
  form: document.getElementById('quickAddForm'),
  title: document.getElementById('title'),
  decade: document.getElementById('decade'),
  category: document.getElementById('category'),
  subTagChips: document.getElementById('subTagChips'),
  customTags: document.getElementById('customTags'),
  notes: document.getElementById('notes'),
  saveButton: document.getElementById('saveButton'),
  status: document.getElementById('status'),
};

let pendingImage = null;
let selectedSubTags = [];

function setStatus(message, type = '') {
  els.status.textContent = message;
  els.status.className = `status ${type}`.trim();
}

function fillSelect(select, options, getValue = (value) => value, getLabel = (value) => value) {
  select.innerHTML = '';
  options.forEach((option) => {
    const node = document.createElement('option');
    node.value = getValue(option);
    node.textContent = getLabel(option);
    select.append(node);
  });
}

function currentChannel() {
  return CHANNELS.find((channel) => channel.category === els.category.value) || CHANNELS[0];
}

function renderSubTags() {
  const channel = currentChannel();
  selectedSubTags = selectedSubTags.filter((tag) => channel.subs.includes(tag));
  els.subTagChips.innerHTML = '';

  channel.subs.forEach((tag) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = selectedSubTags.includes(tag) ? 'chip active' : 'chip';
    button.textContent = tag;
    button.addEventListener('click', () => {
      selectedSubTags = selectedSubTags.includes(tag)
        ? selectedSubTags.filter((savedTag) => savedTag !== tag)
        : [...selectedSubTags, tag];
      renderSubTags();
    });
    els.subTagChips.append(button);
  });
}

function splitTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function loadState() {
  fillSelect(els.decade, DECADES);
  fillSelect(els.category, CHANNELS, (channel) => channel.category, (channel) => channel.label);
  els.decade.value = 'Not Sure';
  els.category.value = 'STORES';

  const stored = await chrome.storage.local.get([
    'pendingRepeatChannelImage',
    'repeatChannelEndpoint',
    'repeatChannelAdminSecret',
  ]);

  els.apiEndpoint.value = stored.repeatChannelEndpoint || 'https://repeatchannel.com/api/extension-save';
  els.adminSecret.value = stored.repeatChannelAdminSecret || '';
  pendingImage = stored.pendingRepeatChannelImage || null;

  if (pendingImage?.imageUrl) {
    els.preview.src = pendingImage.imageUrl;
    els.preview.style.display = 'block';
    els.emptyPreview.style.display = 'none';
    els.imageUrl.textContent = pendingImage.imageUrl;
    els.sourceUrl.textContent = pendingImage.sourceUrl || '';
    els.title.value = pendingImage.altText || pendingImage.pageTitle || '';
  }

  renderSubTags();
}

async function saveSettings() {
  await chrome.storage.local.set({
    repeatChannelEndpoint: els.apiEndpoint.value.trim() || 'https://repeatchannel.com/api/extension-save',
    repeatChannelAdminSecret: els.adminSecret.value,
  });
  setStatus('Settings saved.', 'ok');
}

async function saveImage(event) {
  event.preventDefault();

  if (!pendingImage?.imageUrl) {
    setStatus('Right-click an image first.', 'error');
    return;
  }

  const endpoint = els.apiEndpoint.value.trim();
  const adminSecret = els.adminSecret.value;

  if (!endpoint || !adminSecret) {
    setStatus('Add endpoint and admin passcode in API settings.', 'error');
    els.settingsPanel.classList.remove('hidden');
    return;
  }

  els.saveButton.disabled = true;
  setStatus('Saving...');

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-secret': adminSecret,
      },
      body: JSON.stringify({
        imageUrl: pendingImage.imageUrl,
        sourceUrl: pendingImage.sourceUrl,
        pageTitle: pendingImage.pageTitle,
        altText: pendingImage.altText,
        title: els.title.value,
        decade: els.decade.value,
        category: els.category.value,
        subTags: selectedSubTags,
        customTags: splitTags(els.customTags.value),
        notes: els.notes.value,
        savedBy: 'admin',
      }),
    });
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (response.status === 409) {
      setStatus('Duplicate: already in RepeatChannel.', 'error');
      return;
    }

    if (!response.ok) {
      throw new Error(data?.error || `Save failed: ${response.status}`);
    }

    await chrome.storage.local.remove('pendingRepeatChannelImage');
    setStatus('Saved to RepeatChannel.', 'ok');
  } catch (error) {
    setStatus(error instanceof Error ? error.message : 'Save failed.', 'error');
  } finally {
    els.saveButton.disabled = false;
  }
}

els.settingsToggle.addEventListener('click', () => {
  els.settingsPanel.classList.toggle('hidden');
});
els.saveSettings.addEventListener('click', saveSettings);
els.category.addEventListener('change', () => {
  selectedSubTags = [];
  renderSubTags();
});
els.form.addEventListener('submit', saveImage);

loadState();
