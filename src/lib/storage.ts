/** Public URL for a file in a public Supabase Storage bucket. No signing needed. */
export function getPublicStorageUrl(bucket: string, path: string): string {
  return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${bucket}/${path}`;
}

export function getGuideCoverUrl(path: string): string {
  return getPublicStorageUrl("guide-covers", path);
}

export function getStoryPhotoUrl(path: string): string {
  return getPublicStorageUrl("story-photos", path);
}
