import React, { JSX } from "react";
import { type YouTubeVideo } from "../types/video";

export function VideoCard({ video }: { video: YouTubeVideo }): JSX.Element {
  return (
    <a
      className="bg-[#2A2A2A] rounded-lg p-4 flex flex-col space-x-0 space-y-3 md:flex-row md:space-x-6 w-full min-h-[220px]"
      href={video.link}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="md:w-[30%] rounded-lg" aria-hidden="true">
        <img
          src={video.thumbnailUrl}
          alt=""
          loading="lazy"
          
          className="rounded-lg aspect-video h-full w-full"
        />
      </div>
      <div className="flex flex-col space-y-4 justify-between md:w-[70%] md:pt-2">
        <div className="">
          <h1 className="font-semibold md:text-xl">{video.title}</h1>
          <ul className="flex space-x-12 items-center list-disc text-sm pt-1">
            <li className="list-none font-semibold text-[#EBBBB4]">{video.channel}</li>
            <li className="text-[#EBBBB4] font-light">{video.publishedAt?.toLocaleDateString()}</li>
          </ul>
          
          
        </div>

        <div className="bg-[#1C1B1B] rounded-lg border-l-[6px] border-[#775853] px-4 py-2 flex flex-col space-y-3 mt-3 md:mt-0 wrap-break-word">
          <h3 className="text-blue-300 font-semibold">Desc:</h3>
          <p className="text-[#EBBBB4] text-sm">{video.snippet}</p>
        </div>
      </div>
    </a>
  );
}
