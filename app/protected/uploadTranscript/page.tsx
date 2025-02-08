"use client";

import TranscriptUpload from "@/app/components/transcript-upload";
import { useEffect } from "react";
import { validTickets } from "../tickets/types";
import { IoReturnUpBackOutline } from "react-icons/io5";
import RoadFooter from "@/app/components/RoadFooter";

export default function TranscriptPage() {
  useEffect(() => {
    // Clear valid tickets
    validTickets.length = 0;
  }, []);
  return (
    <div className="h-screen bg-gradient-to-b from-[#145D98] to-[#F7E3E1] flex flex-col items-center font-retro">
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
        <div className="bg-[#145D98] px-16 py-4 mt-16 shadow-lg">
          <h1 className="text-3xl font-retro text-white tracking-[0.2em]">UPLOAD TRANSCRIPT</h1>
        </div>
      </div>
      <div className="mt-20 bg-[#0F2E4A] pt-3 rounded-lg px-1 pb-1" style={{ width: "550px" }}>
        <TranscriptUpload />
      </div>
      <RoadFooter />
    </div>
  );
}
