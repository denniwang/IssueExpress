"use client";

import { useState } from "react";
import { createWorker } from "tesseract.js";
import { useRouter } from "next/navigation";
import React from "react";
import { Ticket, tickets } from "@/app/protected/tickets/types"; // Import the Ticket type

const TranscriptUpload = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [ocrResult, setOcrResult] = useState<string>("");
  const [ocrStatus, setOcrStatus] = useState<string>("");
  const router = useRouter();

  const handleFileChange = (file: File) => {
    setSelectedFile(file);
    setOcrResult(""); // Reset OCR result
    setOcrStatus(""); // Reset status

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
    setOcrStatus("Processing...");
    const worker = await createWorker("eng", 1, {
      logger: (m) => console.log(m), // Add logger here
    });

    try {
      const {
        data: { text },
      } = await worker.recognize(file);

      setOcrResult(text);
      setOcrStatus("Completed");
    } catch (error) {
      console.error(error);
      setOcrStatus("Error occurred during processing.");
    } finally {
      await worker.terminate();
    }
  };

  const handleSubmit = async () => {
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

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4">Upload Transcript or Image</h2>
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()} // Trigger file input on click
        className="border-2 border-dashed border-gray-400 rounded-lg p-8 text-center cursor-pointer transition-colors hover:border-primary"
        style={{ width: "300px", height: "200px" }}
      >
        <p>Drag and drop a file here, or click to select</p>
        <input
          type="file"
          accept=".txt,image/*"
          onChange={(e) =>
            e.target.files && handleFileChange(e.target.files[0])
          }
          style={{ display: "none" }} // Hide the default file input
          ref={fileInputRef} // Attach ref to the input
        />
        {selectedFile && (
          <div className="mt-4">
            <p>Selected File: {selectedFile.name}</p>
            {selectedFile.type.startsWith("image/") && (
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Uploaded content"
                style={{ marginTop: "15px", maxWidth: "100%" }}
              />
            )}
          </div>
        )}
      </div>
      <button
        onClick={handleSubmit}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Submit for Processing
      </button>

      <p className="mt-4 font-semibold">Status: {ocrStatus}</p>
      <h3 className="mt-4 font-semibold">Extracted Text:</h3>
      <pre className="bg-gray-100 p-2 rounded border">{ocrResult}</pre>
    </div>
  );
};

export default TranscriptUpload;
