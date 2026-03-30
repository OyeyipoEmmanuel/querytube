import { refineQueryWithGemini } from '../clients/geminiClient';
import { searchTopVideosOnYouTube } from '../clients/youtubeClient';
import { type VideoSearchResult } from '../types';

export async function searchVideos(params: { userQuery: string }): Promise<VideoSearchResult> {
  const { userQuery } = params;

  let refinedQuery = userQuery.trim();
  let aiSummary = 'Top picks based on your learning intent.';

  try {
    const refined = await refineQueryWithGemini({ userQuery });
    refinedQuery = refined.refinedQuery || refinedQuery;
    aiSummary = refined.aiSummary || aiSummary;
  } catch (error) {
    // Fall back to original query if Groq is unavailable.
    const reason = error instanceof Error ? error.message : 'Unknown error';
  }

  const videos = await searchTopVideosOnYouTube({ refinedQuery, maxResults: 12 });

  return {
    query: refinedQuery,
    aiSummary,
    videos,
  };
}

