import { type VideoSearchResult } from '../types/video';

export async function searchTopVideos(query: string): Promise<VideoSearchResult> {
  const res = await fetch('/api/video-search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    const message = await res.text().catch(() => '');
    throw new Error(`Backend error (${res.status}): ${message || res.statusText}`);
  }

  const data = (await res.json()) as VideoSearchResult;
  return data;
}

