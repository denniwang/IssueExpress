"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../tickets/types";
import {
  MapPin,
  Info,
  Trash2,
  ArrowLeftCircle,
  ChevronDown,
} from "lucide-react";
import React from "react";
import { handleSubmit } from "@/app/actions";

// Update the SVG path components with precise node connections
const LeftToRightPath = () => (
  <svg className="absolute w-full h-48 " viewBox="0 0 800 200">
    <path
      // Start from center of left node (x: node radius), curve to center of right node
      d="M 12 12 C 250 12, 550 188, 788 188"
      stroke="#8B4513"
      strokeWidth="4"
      fill="none"
      strokeDasharray="10,10"
      className="opacity-60 animate-draw-line"
    />
  </svg>
);

const RightToLeftPath = () => (
  <svg className="absolute w-full h-48 -z-10" viewBox="0 0 800 200">
    <path
      // Start from center of right node, curve to center of left node
      d="M 788 12 C 550 12, 250 188, 12 188"
      stroke="#8B4513"
      strokeWidth="4"
      fill="none"
      strokeDasharray="10,10"
      className="opacity-60 animate-draw-line"
    />
  </svg>
);

// Add these styles to your global CSS or create them inline
const styles = `
  @keyframes drawLine {
    from {
      stroke-dashoffset: 1000;
    }
    to {
      stroke-dashoffset: 0;
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: scale(0.9);
    }
    to {
      opacity: 1;
      transform: scale(1);
    }
  }

  .animate-draw-line {
    animation: drawLine 1.5s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }
`;

export default function SummaryPage() {
  const [approvedTickets, setApprovedTickets] = useState<Ticket[]>([]);
  const [rejectedTickets, setRejectedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    // Retrieve the tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");

    // Filter the tickets based on approval status
    const approved = storedTickets.filter((t: Ticket) => t.approved);
    const rejected = storedTickets.filter((t: Ticket) => !t.approved);

    // Update the state with the filtered tickets
    setApprovedTickets(approved);
    setRejectedTickets(rejected);
  }, []);

  const handleDelete = (ticketToDelete: Ticket) => {
    setRejectedTickets((prev) =>
      prev.filter((t) => t.name !== ticketToDelete.name)
    );
    const allTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updatedTickets = allTickets.filter(
      (t: Ticket) => t.name !== ticketToDelete.name
    );
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  };

  const handleRestore = (ticketToRestore: Ticket) => {
    const updatedTicket = { ...ticketToRestore, approved: true };
    setRejectedTickets((prev) =>
      prev.filter((t) => t.name !== ticketToRestore.name)
    );
    setApprovedTickets((prev) => [...prev, updatedTicket]);

    const allTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    const updatedTickets = allTickets.map((t: Ticket) =>
      t.name === ticketToRestore.name ? updatedTicket : t
    );
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));
  };

  return (
    <>
      <style jsx global>
        {styles}
      </style>
      <div className="flex h-screen bg-[url('/desert-bg.jpg')] bg-cover bg-center">
        <div className="flex-1 p-8 overflow-y-auto bg-amber-50/80 backdrop-blur-sm">
          <h1 className="text-5xl font-bold mb-16 text-center text-brown-800 font-western drop-shadow-lg">
            TRANSCRIPT OVERVIEW
          </h1>

          <div className="relative max-w-4xl mx-auto">
            {/* Tickets as Stops */}
            <div className="relative py-8">
              {approvedTickets.map((ticket, index) => (
                <div
                  key={index}
                  className="relative mb-[6rem]"
                  style={{
                    animation: `fadeIn 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0,
                  }}
                >
                  {/* Path connecting nodes */}
                  {index !== 0 && (
                    <div
                      className="absolute -top-36 left-0 right-0 h-72 overflow-visible" // Adjusted height and positioning
                      style={{
                        animation: `fadeIn 0.8s ease-out forwards`,
                        animationDelay: `${index * 0.2}s`,
                        opacity: 0,
                      }}
                    >
                      {index % 2 === 1 ? (
                        <LeftToRightPath />
                      ) : (
                        <RightToLeftPath />
                      )}
                    </div>
                  )}

                  {/* Node content */}
                  <div
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className="relative group w-24">
                      <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-4 border-amber-200 hover:border-amber-400 transition-all cursor-pointer z-20 shadow-lg hover:shadow-xl transform hover:scale-105">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-amber-200 text-2xl font-bold"></span>
                        </div>
                        <MapPin className="text-amber-200" size={48} />
                      </div>

                      {/* Ticket Info Card - show on hover */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 mt-32 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-30">
                        <div className="w-80 bg-white/95 p-6 rounded-lg shadow-xl">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm text-gray-500">
                              {index + 1} of {approvedTickets.length}
                            </span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded">
                              Accepted
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {ticket.name}
                          </h3>
                          <p className="text-sm text-gray-600 mb-3">
                            {ticket.description}
                          </p>
                          {ticket.label && (
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-amber-100 text-brown-700 text-sm rounded-full">
                                {ticket.label}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px] max-w-[400px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Add Submit Button */}
          <div className="flex justify-center mb-8">
            <button
              onClick={() => {
                const selectedProject = JSON.parse(
                  localStorage.getItem("selectedProject") || "{}"
                );
                handleSubmit(approvedTickets, selectedProject);
              }}
              className="px-6 py-2 bg-brown-600 text-amber-200 rounded-lg hover:bg-brown-700 transition-colors font-western text-lg shadow-md hover:shadow-lg"
            >
              Submit Roadmap
            </button>
          </div>
        </div>

        {/* Rejected Tickets Sidebar */}
        <div className="w-80 bg-brown-800 p-4 overflow-y-auto">
          <h2 className="text-xl font-western text-amber-200 mb-4">
            Rejected Saloons
          </h2>
          <div className="space-y-4">
            {rejectedTickets.map((ticket, index) => (
              <div
                key={index}
                className="bg-brown-700 rounded-lg p-3 text-amber-100"
              >
                <h3 className="font-semibold">{ticket.name}</h3>
                <p className="text-sm text-amber-200 mt-1">{ticket.label}</p>
                <div className="flex justify-end gap-2 mt-2">
                  <button
                    onClick={() => handleRestore(ticket)}
                    className="p-1 hover:text-green-400 transition-colors"
                    title="Restore"
                  >
                    <ArrowLeftCircle size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(ticket)}
                    className="p-1 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
