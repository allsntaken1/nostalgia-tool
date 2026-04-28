import { NextResponse } from 'next/server';

export const MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXTENSIONS = new Set(['jpg', 'jpeg', 'png', 'webp']);

export function getAdminSecret() {
  return process.env.ADMIN_SECRET || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'nostalgia';
}

export function isAdminRequest(request: Request) {
  const expected = getAdminSecret();
  const provided = request.headers.get('x-admin-secret') || '';

  return Boolean(expected) && provided === expected;
}

export function requireAdmin(request: Request) {
  if (isAdminRequest(request)) return null;

  return NextResponse.json({ error: 'Admin authorization required.' }, { status: 401 });
}

function extensionForFile(file: File) {
  return file.name.includes('.') ? file.name.split('.').pop()?.toLowerCase() ?? '' : '';
}

export function validateUploadImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File)) {
    return 'Please upload an image file.';
  }

  if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
    return 'Images must be JPG, PNG, or WebP.';
  }

  if (!ALLOWED_EXTENSIONS.has(extensionForFile(file))) {
    return 'Images must use a .jpg, .jpeg, .png, or .webp extension.';
  }

  if (file.size <= 0) {
    return 'The selected image is empty.';
  }

  if (file.size > MAX_UPLOAD_BYTES) {
    return 'Images must be 8 MB or smaller.';
  }

  return '';
}
