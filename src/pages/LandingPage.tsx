import React, { JSX, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../components/Logo";

export function LandingPage(): JSX.Element {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const disabled = useMemo(() => query.trim().length === 0, [query]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    const trimmed = query.trim();
    if (trimmed.length === 0) return;
    navigate(`/chat?query=${encodeURIComponent(trimmed)}`);
  }

  return (
    <div className="px-3 ">
      <div className="py-4">
        <div className="flex justify-between">
          <Logo />
        </div>
      </div>

      {/* HERO */}
      <section className="max-w-lg md:max-w-4xl mx-auto ">
        <div className="w-full flex flex-col items-center justify-center">
          <h1 className="text-2xl text-center font-bold md:text-6xl md:tracking-wide md:pb-3">
            Describe what you want to watch.
          </h1>
          <h1 className="text-[#FF7E6D] text-2xl font-bold md:text-6xl md:tracking-wide">
            We'll find it.
          </h1>
          <p className="pt-4 text-center text-[#C29B95] text-sm font-light md:text-lg md:tracking-wide md:w-[70%]">
            The next generation of video search. No more endless scrolling, just
            cinematic answers
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 max-w-lg mx-auto flex flex-col md:flex-row items-center justify-between space-x-3 bg-[#363635] rounded-lg p-2 md:px-4 md:py-2"
        >
          <div className="flex flex-row items-center w-full px-1">
            {/* Search Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FF7361"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-search-icon lucide-search"
            >
              <path d="m21 21-4.34-4.34" />
              <circle cx="11" cy="11" r="8" />
            </svg>

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Start Describing..."
              className="w-full p-2 rounded-md focus:outline-none"
            />
          </div>

          <button
            className="border border-[#ff2d2d59] bg-[#ff2d2d24] px-6 py-1 mt-4 md:mt-0 md:py-3 md:w-fit rounded-lg transition-all text-sm hover:-translate-y-0.5 duration-200 hover:bg-[#ff2d2d33] w-full"
            type="submit"
            disabled={disabled}
            aria-disabled={disabled}
          >
            Search{" "}
          </button>
        </form>

        {/* Try searching for */}
        <div>
          <div className="mt-10 flex flex-col items-center">
            <span className="uppercase text-xs font-light tracking-widest text-[#737373] mb-3">
              Try searching for
            </span>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              {[
                '"Need to watch something that screams AI generated"',
                '"Do cats even love dogs? it seems they are always fighting"',
                '"Do i even need to work hard to make money? Cant i just sleep and money will be coming?"',
              ].map((rec, idx) => (
                <button
                  key={idx}
                  type="button"
                  className={`rounded-full px-4 py-1.5  font-medium hover:border hover:border-[#FF7E6D]/30 transition-colors duration-150 ${idx == 2 && "md:col-span-2 md:justify-self-center"}`}
                  onClick={() => setQuery(rec)}
                >
                  <p className="text-xs text-[#FF7E6D] ">{rec}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
