"use client";
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

export default function TranscriptUpload() {
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);

    acceptedFiles.forEach((file) => {
      if (file.type === "text/plain") {
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;
          console.log(`File: ${file.name}\nContent:\n${content}`);
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

  return (
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
  );
}
