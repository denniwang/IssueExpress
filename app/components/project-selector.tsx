"use client";

import { useState, useEffect } from "react";
import { IoReturnUpBackOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";

export interface Project {
  description: string;
  id: string;
  isPrivate: boolean;
  name: string;
  url: string;
  visibility: string;
}

export default function ProjectSelector({ repos }: { repos: Project[] }) {
  const [visibleProjects, setVisibleProjects] = useState<Project[]>(repos);
  const [startIndex, setStartIndex] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    setVisibleProjects(repos ? repos.slice(startIndex, startIndex + 3) : []);
  }, [startIndex]);

  const slideLeft = () => {
    setStartIndex((prevIndex) => Math.max(0, prevIndex - 1));
  };

  const slideRight = () => {
    if (repos) {
      setStartIndex((prevIndex) => Math.min(repos.length - 3, prevIndex + 1));
    }
  };

  const handleConfirm = () => {
    if (selectedProject) {
      localStorage.setItem("selectedProject", JSON.stringify(selectedProject));
      localStorage.setItem("selectedProjectName", selectedProject.name);
      router.push("/protected/uploadTranscript");
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  if (!isClient) return null;

  return (
    <div className="w-full flex flex-col items-center h-screen bg-gradient-to-b from-[#145D98] to-[#F7E3E1] font-retro">
      <div className="absolute top-4 left-4">
        <IoReturnUpBackOutline
          className="text-white text-4xl cursor-pointer"
          onClick={() => history.back()}
        />
      </div>

      {/* Header */}
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

      {/* Projects Carousel */}
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
          {visibleProjects.length === 0 && (
            <>
              <div>
                <h1 className="text-white text-3xl">
                  You have no visible projects at this time.
                </h1>
              </div>
            </>
          )}
          {visibleProjects.map((project, index) => (
            <div className="w-[350px] h-[300px]" key={index}>
              <div
                key={project.id}
                className={`shield-container w-[240px] h-[240px] flex-shrink-0 transition-transform duration-300 ${selectedProject === project ? "w-[300px] h-[300px]" : ""} cursor-pointer flex items-center justify-center`}
                style={{
                  backgroundImage: "url('/shield.png')",
                  backgroundSize: "contain",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
                onClick={() => handleSelectProject(project)}
              >
                <div className="shield relative w-full h-full flex flex-col items-center justify-center text-center ">
                  <div
                    className={`absolute ${selectedProject === project ? "top-7" : "top-5"} left-0 right-0 py-3 shield-header`}
                  >
                    <span
                      className={`font-retro text-[#FF3C68] ${selectedProject === project ? "text-lg" : "text-sm"} tracking-wider`}
                    >
                      HACKBEANPOT
                    </span>
                  </div>
                  <span className="font-retro text-white text-xl mt-8 whitespace-pre-line leading-relaxed">
                    {project.name}
                  </span>
                </div>
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

      {/* Confirm Button */}
      <button
        className={`px-12 py-3 text-lg tracking-wider font-retro text-white ${
          selectedProject
            ? "bg-[#0F2E4A] hover:bg-gray-900"
            : "bg-gray-400 cursor-not-allowed"
        }`}
        onClick={handleConfirm}
        disabled={!selectedProject}
      >
        CONFIRM
      </button>
    </div>
  );
}
