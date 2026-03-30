export type YouTubeVideo = {
  id: string;
  title: string;
  channel: string;
  publishedAt: Date | undefined
  link: string;
  thumbnailUrl: string;
  snippet: string;
};

export type VideoSearchResult = {
  query: string;
  aiSummary: string;
  videos: YouTubeVideo[];
};

