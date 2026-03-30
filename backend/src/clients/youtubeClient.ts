import { type YouTubeVideo } from '../types';

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

function truncate(input: string, maxLen: number): string {
  if (input.length <= maxLen) return input;
  return `${input.slice(0, Math.max(0, maxLen - 1)).trim()}…`;
}

export async function searchTopVideosOnYouTube(params: {
  refinedQuery: string;
  maxResults: number;
}): Promise<YouTubeVideo[]> {
  const { refinedQuery, maxResults } = params;
  if (!YOUTUBE_API_KEY) {
    throw new Error('Missing YOUTUBE_API_KEY');
  }

  const endpoint = 'https://www.googleapis.com/youtube/v3/search';
  const url = new URL(endpoint);
  url.searchParams.set('part', 'snippet');
  url.searchParams.set('type', 'video');
  url.searchParams.set('maxResults', String(maxResults));
  url.searchParams.set('q', refinedQuery);
  url.searchParams.set('order', 'relevance');
  url.searchParams.set('key', YOUTUBE_API_KEY);

  const res = await fetch(url.toString(), { method: 'GET' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`YouTube API error (${res.status}): ${body || res.statusText}`);
  }

  const data = (await res.json()) as {
    items?: Array<{
      id?: { videoId?: string };
      snippet?: {
        title?: string;
        channelTitle?: string;
        publishedAt?: Date | undefined;
        thumbnails?: {
          default?: { url?: string };
          medium?: { url?: string };
          high?: { url?: string };
        };
        description?: string;
      };
    }>;
  };

  const items = data.items || [];
  const videos: YouTubeVideo[] = [];

  for (const item of items) {
    const videoId = item.id?.videoId;
    const title = item.snippet?.title;
    const channel = item.snippet?.channelTitle;
    const publishedAt = item.snippet?.publishedAt
    const thumbnailUrl =
      item.snippet?.thumbnails?.high?.url ||
      item.snippet?.thumbnails?.medium?.url ||
      item.snippet?.thumbnails?.default?.url;
    const description = item.snippet?.description || '';

    if (!videoId || !title || !channel || !thumbnailUrl) continue;

    videos.push({
      id: videoId,
      title,
      channel,
      publishedAt,
      link: `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`,
      thumbnailUrl,
      snippet: description || 'Beginner-friendly walkthrough and practical examples.',
    });
  }

  return videos.slice(0, maxResults);
}

