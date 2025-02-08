"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { tickets, ticket } from "../app/tickets/types";

export default function TranscriptUpload() {
  const [files, setFiles] = useState<File[]>([]);
  const [userInput, setUserInput] = useState<string>("");
  const [responseData, setResponseData] = useState<any>(null);
  const [parsedResponse, setParsedResponse] = useState<any>(null);


  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    acceptedFiles.forEach((file) => {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
          const fileContent = reader.result as string;
          setUserInput(fileContent);
          console.log(`File: ${file.name}\nContent:\n${userInput}`);
        };
        reader.readAsText(file);
      } else {
        console.log(`File: ${file.name} is not a valid text file`);
      }
    });
  }, []);


  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".txt"],
    },
  });

  const handleContinueClick = async () => {
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
          setResponseData(data);
          const rawResponse = data.data;
          const fixedResponse = `[${rawResponse}]`;
          try {
            const parsedJson = JSON.parse(fixedResponse);

            const newTickets: ticket[] = parsedJson.map((item: any) => {
              return {
                assignee: item.assignee || "Unassigned",
                name: item.name || "TBD",
                label: item.label || "Unknown",
                description: item.description || "TBD",
              };
            });

            tickets.push(...newTickets);
  
            setParsedResponse(parsedJson); 
          } catch (error) {
            console.error("Failed to parse JSON:", error);
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

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center">
      <div
        {...getRootProps()}
        className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors ${
          isDragActive
            ? "border-primary bg-primary/10"
            : "border-gray-300 hover:border-primary"
        }`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some text files here, or click to select files</p>
        )}
        {files.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Uploaded files:</h4>
            <ul className="list-disc list-inside">
              {files.map((file) => (
                <li key={file.name} className="text-sm">
                  {file.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button 
        onClick={handleContinueClick}
        className="mt-8 px-6 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-primary"
      >
        Continue
      </button>

      {parsedResponse && (
        <div className="mt-8 p-4 bg-gray-100 rounded-lg shadow-md max-h-96 overflow-y-auto">
          <h4 className="text-lg font-semibold">Parsed Response:</h4>
          <pre className="whitespace-pre-wrap break-all">{JSON.stringify(parsedResponse, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}