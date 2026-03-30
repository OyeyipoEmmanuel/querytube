import React, { JSX, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Logo } from "../components/Logo";
import { VideoCard } from "../components/VideoCard";
import { searchTopVideos } from "../services/videoSearchService";
import { type VideoSearchResult } from "../types/video";

export function ChatPage(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryFromUrl = useMemo(() => {
    const fromUrl = searchParams.get("query");
    return fromUrl ? fromUrl.replace(/^"|"$/g, "") : "";
  }, [searchParams]);

  const [query, setQuery] = useState<string>(queryFromUrl);
  const [headerText, setHeaderText] = useState<string>(queryFromUrl)
  const [result, setResult] = useState<VideoSearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const didInitialSearch = useRef<boolean>(false);

  useEffect(() => {
    setQuery(queryFromUrl);
  }, [queryFromUrl]);

  async function onSearch(nextQuery: string): Promise<void> {
    const trimmed = nextQuery.trim();
    if (trimmed.length === 0) return;

    setHeaderText(trimmed)


    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await searchTopVideos(trimmed);
      setResult(res);

      
    } catch {
      setError("Something went wrong while searching. Please try again.");
    } finally {
      setLoading(false);
      setQuery("");
      // setSearchParams({});
    }
  }

  useEffect(() => {
    if (didInitialSearch.current) return;
    didInitialSearch.current = true;
    if (queryFromUrl.trim().length > 0) void onSearch(queryFromUrl);
  }, [queryFromUrl]);

  const disabled = useMemo(
    () => query.trim().length === 0 || loading,
    [query, loading],
  );


  //Spliting the query to show a different color for the last word
  const queryWordsWithoutLastWord = headerText
    .split(" ")
    .slice(0, -1)
    .join(" ");
  const lastWordFromQuery = headerText.split(" ").pop();

  return (
    <div className="pageChat">
      <div className="py-4">
        <div
          className="md:px-8 px-3"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Logo />
          <button
            className="cursor-pointer "
            type="button"
            onClick={() => navigate("/")}
            aria-label="Back to Landing Page"
          >
            Back
          </button>
        </div>
      </div>

      <div className="chatBody">
        <div className="container">
          {!loading && !error && !result && (
            <div className="emptyState fadeIn">
              <div
                style={{
                  fontWeight: 720,
                  color: "rgba(255,255,255,0.82)",
                  marginBottom: 6,
                }}
              >
                Ask for a watch
              </div>
              <div>
                Describe what you want to learn or watch, then submit.
                We&apos;ll fetch the top 5 videos and show them as cards.
              </div>
            </div>
          )}

          {loading && (
            <div className="emptyState fadeIn">
              Searching for videos matching{" "}
              <span style={{ color: "rgba(255,255,255,0.9)" }}>
                {query.trim() || "your query"}
              </span>
              ...
            </div>
          )}

          {error && (
            <div
              className="emptyState fadeIn"
              style={{
                borderStyle: "solid",
                borderColor: "rgba(255,45,45,0.4)",
              }}
            >
              {error}
            </div>
          )}

          {result && (
            // <div className="fadeIn">
            //   <div className="resultsSummary">
            //     <div className="resultsSummaryTitle">
            //       <span className="pulseDot" aria-hidden="true" />
            //       AI summary
            //     </div>
            //     <div style={{ marginTop: 10, color: 'rgba(255,255,255,0.78)', lineHeight: 1.35 }}>
            //       {result.aiSummary}
            //     </div>
            //     <div className="hint" style={{ marginTop: 10 }}>
            //       Showing top 5 results for your search.
            //     </div>
            //   </div>

            //   <div className="gridCards" aria-label="Top YouTube video results">
            //     {result.videos.map((video) => (
            //       <VideoCard key={video.id} video={video} />
            //     ))}
            //   </div>
            // </div>

            <div>
              <div>
                <p className="text-[#869AC4] font-extrabold text-sm tracking-wide">
                  AI Insight
                </p>
                <h1 className="text-[24px] md:text-[48px] font-semibold capitalize py-4 leading-tight tracking-tighter">
                  {queryWordsWithoutLastWord + " "}{" "}
                  <span className="text-[#FFB4A8]">{lastWordFromQuery}</span>
                </h1>
              </div>

              <div className="grid grid-cols-1 gap-y-6">
                {result.videos.map((video, idx) => {
                  const updatedVideo = {
                    ...video,
                    publishedAt: video.publishedAt
                      ? new Date(video.publishedAt)
                      : undefined,
                  };

                  return (
                    <div key={idx}>
                      <VideoCard video={updatedVideo} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="chatInputBar">
        <div className="container">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void onSearch(query);
            }}
            className="chatInputRow"
          >
            <input
              className="chatInput"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Describe what you want to watch..."
              aria-label="Video search query"
            />
            <button
              className="btn btnPrimary"
              type="submit"
              disabled={disabled}
              aria-disabled={disabled}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
