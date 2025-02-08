"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../tickets/types";
import { MapPin, Info, Trash2, ArrowLeftCircle, ChevronDown } from "lucide-react";
import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

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
    <div className="flex h-screen bg-[url('/desert-bg.jpg')] bg-cover bg-center">
      {/* Main Roadmap */}
      <div className="flex-1 p-8 overflow-y-auto bg-amber-50/80 backdrop-blur-sm">
        <h1 className="text-5xl font-bold mb-16 text-center text-brown-800 font-western drop-shadow-lg">
          Wild West Road Trip Map 🗺️
        </h1>

        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Road */}
          <div className="absolute left-1/2 top-0 w-6 h-full bg-brown-400/90 transform -translate-x-1/2 rounded-full shadow-lg" />

          {/* Tickets as Stops */}
          <div className="relative py-16 space-y-48">
            {approvedTickets.map((ticket, index) => (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger>
                    <div className="relative">
                      {/* Connecting Line to Previous Node */}
                      {index !== 0 && (
                        <div className="absolute left-1/2 -top-24 transform -translate-x-1/2 w-8 h-48">
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2 h-full bg-brown-600/70" />
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <ChevronDown className="text-brown-600" size={32} />
                          </div>
                        </div>
                      )}

                      <div className={`flex items-center gap-24 ${
                        index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                      }`}>
                        {/* Stop Point */}
                        <div className="w-16 h-16 bg-brown-600 rounded-full flex items-center justify-center border-4 border-amber-200 hover:border-amber-400 transition-all cursor-pointer z-20 shadow-lg hover:shadow-xl transform hover:scale-110">
                          <MapPin className="text-amber-200" size={32} />
                        </div>
                        {/* Ticket Info */}
                        <div className="w-72 bg-white/80 p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
                          <h3 className="font-western text-xl text-brown-800">
                            {ticket.name}
                          </h3>
                          <span className="text-sm text-brown-600">
                            {new Date(ticket.startDate || '').toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <div className="w-80 p-6 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg border-2 border-brown-300">
                      <div className="space-y-3">
                        <h4 className="font-bold text-brown-800">{ticket.name}</h4>
                        <p className="text-sm text-brown-600">{ticket.description}</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="px-2 py-1 bg-amber-100 rounded-full text-brown-700">
                            {ticket.label}
                          </span>
                          {ticket.assignee && (
                            <span className="text-brown-600">
                              🤠 {ticket.assignee}
                            </span>
                          )}
                        </div>
                        {ticket.startDate && ticket.endDate && (
                          <div className="text-xs text-brown-500">
                            {new Date(ticket.startDate).toLocaleDateString()} -
                            {new Date(ticket.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </div>
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
  );
}
