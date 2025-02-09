"use client";

import { Button } from "@/components/ui/button";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useRouter, useSearchParams } from "next/navigation";

export default function Success() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const githubLink = searchParams.get("githubLink");

  return (
    <div className="h-screen bg-gradient-to-b from-[#F7E3E1] to-[#FF3C68] flex flex-col items-center justify-center font-retro">
      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <FaMapMarkerAlt className="text-white text-6xl animate-bounce" />
          <div className="absolute -right-2 -top-2">
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-12 tracking-wider">
          SUCCESSFULLY EXPORTED!
        </h1>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-100 text-gray-800"
            onClick={() => router.push("/protected/repositories")}
          >
            CONVERT ANOTHER TRANSCRIPT
          </Button>
          <Button className="bg-[#1a2e44] hover:bg-[#15253a] text-white" onClick={() => githubLink && router.push(githubLink)}>
            VIEW IN GITHUB
          </Button>
        </div>
      </div>
    </div>
  );
}
