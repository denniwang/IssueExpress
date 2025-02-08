"use client";

import { useState, useCallback } from "react";
import { createWorker } from "tesseract.js";
import { useRouter } from "next/navigation";
import React from "react";
import { Ticket, tickets } from "@/app/protected/tickets/types"; // Import the Ticket type
import { Button } from "@/components/ui/button";
import { SiConvertio } from "react-icons/si";
import { MdOutlineFileUpload } from "react-icons/md";

const TranscriptUpload = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>("");
  const router = useRouter();

  const handleFileChange = (file: File) => {
    setSelectedImage(file);
    setOcrResult(""); // Reset OCR result

    // Check if the file is an image or a text file
    if (file.type.startsWith("image/")) {
      readImageText(file); // Perform OCR if it's an image
    } else if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = () => {
        const fileContent = reader.result as string;
        setOcrResult(fileContent); // Store the text content
        console.log(`File: ${file.name}\nContent:\n${fileContent}`);
      };
      reader.readAsText(file);
    } else {
      console.log(`File: ${file.name} is not a valid text or image file`);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const readImageText = async (file: File) => {
    const worker = await createWorker("eng", 1, {
      logger: (m) => console.log(m), // Add logger here
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(file);

      setOcrResult(text);
    } catch (error) {
      console.error(error);
    } finally {
      await worker.terminate();
    }
  };

  const handleSubmit = async (data: FormData) => {
    // Proceed with the submission regardless of OCR result validity
    const userInput = ocrResult || ""; // Use OCR result or empty string if not available

    if (userInput) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userInput }),
        });

        if (response.ok) {
          const data = await response.json();
          const rawResponse = data.data;

          // Validate and fix the JSON response
          const fixedResponse = rawResponse.startsWith("[")
            ? rawResponse
            : `[${rawResponse}]`;

          try {
            // Check if the response is valid JSON
            const parsedJson = JSON.parse(fixedResponse);
            console.log(parsedJson);

            const newTickets: Ticket[] = parsedJson.map((item: any) => {
              return {
                assignee: item.assignee || "Unassigned",
                name: item.name || "TBD",
                label: item.label || "Unknown",
                description: item.description || "TBD",
              };
            });

            tickets.push(...newTickets); // Save the new tickets
            router.push("/protected/tickets"); // Navigate to the tickets page
          } catch (error) {
            console.error("Failed to parse JSON:", error);
            // Optionally, you can still navigate even if parsing fails
            router.push("/protected/tickets");
          }
        } else {
          console.error("Error:", response.statusText);
        }
      } catch (error) {
        console.error("Request failed", error);
      }
    } else {
      console.error("No content to send!");
    }
  };

  // Reference to the hidden file input
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const userInput = ocrResult || "";

  const handleSubmitCallback = useCallback(() => {
    // ...
  }, [userInput]);

  return (
    <div className="flex flex-col items-center p-5 rounded-lg bg-white">
      <p className="text-lg text-[#FF3C68]">UPLOADING FOR</p>
      <h1 className="text-2xl font-bold mb-4 text-[#0F2E4A]">PROJECT NAME</h1>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()} // Trigger file input on click
        className="bg-white border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary mb-4 flex flex-col justify-center items-center w-full"
        style={{ height: "200px" }}
      >
        <Button className="bg-[#F7F7F7] text-[#0F2E4A] hover:bg-[#F7F7F7] hover:text-black rounded-none">
          Upload File <MdOutlineFileUpload className="inlined-block ml-2" />{" "}
        </Button>
        <input
          type="file"
          accept=".txt,image/*"
          onChange={(e) =>
            e.target.files && handleFileChange(e.target.files[0])
          }
          style={{ display: "none" }} // Hide the default file input
          ref={fileInputRef} // Attach ref to the input
        />
        {selectedImage && (
          <div className="mt-4">
            <p>Selected File: {selectedImage.name}</p>
            {selectedImage.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(selectedImage)}
                alt="Uploaded content"
                style={{ marginTop: "15px", maxWidth: "100%" }}
              />
            )}
          </div>
        )}
      </div>
      <Button onClick={handleSubmitCallback} className="w-full text-white rounded bg-[#0F2E4A]">
        CONVERT <SiConvertio className="inline-block ml-2" />
      </Button>
    </div>
  );
};

export default TranscriptUpload;
