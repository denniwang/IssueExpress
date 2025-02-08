"use client";

import { useState, useEffect } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";

interface Project {
  id: number;
  name: string;
  organization: string;
}

// Mock data for repositories
const allProjects: Project[] = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `PROJECT\nJOHTO ${i + 1}`,
  organization: "HACKBEANPOT",
}));

export default function ProjectSelector({ projects }: { projects: Repository[] }) {
  const [visibleProjects, setVisibleProjects] = useState<Project[]>([]);
  const [startIndex, setStartIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setVisibleProjects(allProjects.slice(startIndex, startIndex + 3));
  }, [startIndex]);

  const slideLeft = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const slideRight = () => {
    setStartIndex((prevIndex) =>
      Math.min(allProjects.length - 3, prevIndex + 1)
    );
  };

  const handleConfirm = () => {
    window.location.href = "/protected/uploadTranscript";
  };

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center h-screen bg-gradient-to-b from-[#145D98] to-[#F7E3E1]">
      <div className="absolute top-4 left-4">
        <IoReturnUpBackOutline
          className="text-white text-4xl cursor-pointer"
          onClick={() => history.back()}
        />
      </div>
      {/* Header with hanging effect */}
      <div className="relative">
        <div className="absolute left-1/2 -translate-x-1/2 flex justify-center w-full">
          <div className="w-[1px] h-16 bg-white mx-32" />
          <div className="w-[1px] h-16 bg-white mx-32" />
        </div>
        <div className="bg-[#145D98] px-16 py-4 mt-16 shadow-lg drop-shadow-xs">
          <h1 className="text-3xl font-retro text-white tracking-[0.2em]">
            SELECT YOUR PROJECT
          </h1>
        </div>
      </div>

      {/* Projects carousel */}
      <div className="relative w-full max-w-[900px] flex items-center justify-center mt-24 mb-16">
        {/* Left Arrow */}
        <button
          onClick={slideLeft}
          className="absolute -left-24 z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Previous projects"
        >
          <div
            className="w-0 h-0 
            border-t-[20px] border-t-transparent 
            border-r-[32px] border-r-white 
            border-b-[20px] border-b-transparent
            transition-transform hover:scale-110"
          />
        </button>

        {/* Projects Container */}
        <div className="flex gap-16 overflow-hidden">
          {visibleProjects.map((project) => (
            <div
              key={project.id}
              className="shield-container w-[240px] h-[240px] flex-shrink-0 transition-transform duration-300 hover:scale-105"
              style={{ backgroundImage: "url('/Shield.png')",    backgroundSize: "contain",    backgroundRepeat: "no-repeat",
                backgroundPosition: "center", }}
            >
              <div className="shield relative  w-full h-full flex flex-col items-center justify-center text-center">
                <div className="absolute top-5 left-0 right-0  py-3 shield-header">
                  <span className="font-retro text-white text-sm tracking-wider">
                    {project.organization}
                  </span>
                </div>
                <span className="font-retro text-white text-xl mt-8 whitespace-pre-line leading-relaxed">
                  {project.name}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={slideRight}
          className="absolute -right-24 z-10 w-12 h-12 flex items-center justify-center"
          aria-label="Next projects"
        >
          <div
            className="w-0 h-0 
            border-t-[20px] border-t-transparent 
            border-l-[32px] border-l-white 
            border-b-[20px] border-b-transparent
            transition-transform hover:scale-110"
          />
        </button>
      </div>

      {/* Confirm button */}
      <button
        className="bg-[#0F2E4A] hover:bg-gray-900 text-white font-retro px-12 py-3 text-lg tracking-wider"
        onClick={handleConfirm}
      >
        CONFIRM
      </button>
    </div>
  );
}
