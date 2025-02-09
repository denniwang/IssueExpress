"use client";

import TranscriptUpload from "@/app/components/transcript-upload";
import { useEffect } from "react";
import { validTickets } from "../tickets/types";
import { IoReturnUpBackOutline } from "react-icons/io5";
import RoadFooter from "@/app/components/RoadFooter";
import HangingHeader from "@/app/components/HangingHeader";

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
      <HangingHeader title="UPLOAD TRANSCRIPT" ropeColor="bg-white" circleColor="bg-[#0C3E67]" />
      <div className="mt-20 bg-[#0F2E4A] pt-3 rounded-lg px-1 pb-1" style={{ width: "550px" }}>
        <TranscriptUpload />
      </div>
      <RoadFooter />
    </div>
  );
}
