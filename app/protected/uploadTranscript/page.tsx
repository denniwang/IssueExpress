"use client";

import TranscriptUpload from "@/app/components/transcript-upload";
import { useEffect } from "react";
import { validTickets } from "../tickets/types";

export default function TranscriptPage() {
  useEffect(() => {
    // Clear valid tickets
    validTickets.length = 0;
  }, []);
  return (
    <div>
      <TranscriptUpload />
    </div>
  );
}
