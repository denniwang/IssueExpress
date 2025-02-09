"use client";

import { useEffect, useState } from "react";
import { Ticket } from "../tickets/types";
import { default as TicketCard } from "@/app/components/Ticket";
import { MapPin } from "lucide-react";
import React from "react";
import { handleSubmit } from "@/app/actions";
import { useRouter } from "next/navigation";
import HangingHeader from "@/app/components/HangingHeader";

// Update the SVG path components with precise node connections
const LeftToRightPath = () => (
  <svg
    className="absolute w-full h-48 -z-10 pointer-events-none"
    viewBox="0 0 800 200"
  >
    <path
      // Start from center of left node (x: node radius), curve to center of right node
      d="M 12 12 C 250 12, 550 188, 788 188"
      stroke="#0F2E4A"
      strokeWidth="24"
      fill="none"
      className="opacity-60"
    />
    <path
      // Start from center of left node (x: node radius), curve to center of right node
      d="M 12 12 C 250 12, 550 188, 788 188"
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="none"
      strokeDasharray="10,10"
      className="opacity-100"
    />
  </svg>
);

const RightToLeftPath = () => (
  <svg
    className="absolute w-full h-48 -z-10 pointer-events-none"
    viewBox="0 0 800 200"
  >
    <path
      // Start from center of right node, curve to center of left node
      d="M 788 12 C 550 12, 250 188, 12 188"
      stroke="#0F2E4A"
      strokeWidth="24"
      fill="none"
      className="opacity-60"
    />
    <path
      // Start from center of right node, curve to center of left node
      d="M 788 12 C 550 12, 250 188, 12 188"
      stroke="#FFFFFF"
      strokeWidth="2"
      fill="none"
      strokeDasharray="10,10"
      className="opacity-100"
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

  @keyframes rejectNode {
    0% {
      transform: scale(1);
      opacity: 1;
    }
    50% {
      transform: scale(1.2) rotate(10deg);
      opacity: 0.5;
    }
    100% {
      transform: scale(0.8) rotate(-10deg);
      opacity: 0;
    }
  }

  .animate-draw-line {
    animation: drawLine 1.5s ease-out forwards;
  }

  .animate-fade-in {
    animation: fadeIn 0.5s ease-out forwards;
  }

  .animate-reject {
    animation: rejectNode 0.5s ease-in-out forwards;
  }
`;

export default function SummaryPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicket, setActiveTicket] = useState<{
    ticket: Ticket;
    index: number;
    position: "left" | "right";
    rect: DOMRect;
    isClicked?: boolean;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Retrieve the tickets from localStorage
    const storedTickets = JSON.parse(localStorage.getItem("tickets") || "[]");
    setTickets(storedTickets);
    if (storedTickets.length > 0) {
      setActiveTicket({
        ticket: storedTickets[0],
        index: 0,
        position: "left",
        rect: {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          x: 0,
          y: 0,
          bottom: 0,
          right: 0,
          toJSON: () => "",
        },
      });
    }
  }, []);

  const handleSave = (updatedTicket: Ticket) => {
    // Update the ticket in the array
    const updatedTickets = tickets.map((t) =>
      t.name === updatedTicket.name ? updatedTicket : t
    );

    setTickets(updatedTickets);
    localStorage.setItem("tickets", JSON.stringify(updatedTickets));

    // Update the active ticket if it exists
    if (activeTicket) {
      setActiveTicket({
        ...activeTicket,
        ticket: updatedTicket,
      });
    }
  };

  const handleToggleApproval = (ticketToToggle: Ticket) => {
    const updatedTicket = {
      ...ticketToToggle,
      approved: !ticketToToggle.approved,
    };

    handleSave(updatedTicket);
  };

  const handleNodeHover = (
    ticket: Ticket,
    index: number,
    event: React.MouseEvent,
    isEntering: boolean
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setActiveTicket({
      ticket,
      index,
      position: index % 2 === 0 ? "right" : "left",
      rect,
    });
  };

  console.log("Active Ticket", activeTicket);
  console.log("Tickets", tickets);
  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate"
  ) => {
    const newDate = new Date(e.target.value);
    const updatedTickets = tickets.map((ticket, index) =>
      index === activeTicket?.index ? { ...ticket, [field]: newDate } : ticket
    );
    setTickets(updatedTickets);
  };
  return (
    <>
      <style jsx global>
        {styles}
      </style>
      <div className="h-full bg-[#F7E3E1]">
        <div className="flex grow" onClick={() => setActiveTicket(null)}>
          <div className="w-[50%] relative max-w-2xl">
            <div className="m-16 relative">
              {tickets.map((ticket, index) => (
                <div
                  key={index}
                  className={`relative mb-[6rem] ${
                    !ticket.approved ? "animate-reject" : ""
                  }`}
                  style={{
                    animation: `fadeIn 0.5s ease-out forwards`,
                    animationDelay: `${index * 0.2}s`,
                    opacity: 0,
                  }}
                >
                  {index !== 0 && (
                    <div
                      className="absolute -top-36 left-0 right-0 h-72 overflow-visible pointer-events-none"
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

                  <div
                    className={`flex items-center ${
                      index % 2 === 0 ? "flex-row" : "flex-row-reverse"
                    }`}
                  >
                    <div className="block group w-24">
                      <div
                        className={`w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center border-4 ${
                          ticket.approved
                            ? "border-[#145D98] hover:border-[#145D98]"
                            : "border-[#FF3C68] hover:border-[#FF3C68]"
                        } transition-all z-20 shadow-lg hover:shadow-xl transform hover:scale-105`}
                        onMouseEnter={(e) =>
                          handleNodeHover(ticket, index, e, true)
                        }
                        onMouseLeave={(e) =>
                          handleNodeHover(ticket, index, e, false)
                        }
                      >
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-amber-200 text-2xl font-bold"></span>
                        </div>
                        <MapPin
                          className={
                            ticket.approved
                              ? "text-[#145D98]"
                              : "text-[#FF3C68]"
                          }
                          size={48}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-[200px] max-w-[400px]" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-[50%] mr-16 relative overflow-hidden flex flex-col items-center gap-8">
            <div className="fixed w-full max-w-4xl ml-2">
              <HangingHeader
                title="TRANSCRIPT OVERVIEW         "
                ropeColor="bg-white"
                circleColor="#0F2E4A"
              />
            </div>
            <div className="w-full h-full overflow-auto mt-48 flex justify-center">
              {activeTicket && (
                <TicketCard
                  isSummary={true}
                  ticket={activeTicket.ticket}
                  onRemove={() => handleToggleApproval(activeTicket.ticket)}
                  handleTicketChange={() => handleSave}
                  handleDateChange={handleDateChange}
                  step={activeTicket.index + 1}
                  totalSteps={tickets.length}
                />
              )}
            </div>
            <div className="fixed bottom-24">
              <button
                onClick={async () => {
                  setIsLoading(true);
                  const selectedProject = JSON.parse(
                    localStorage.getItem("selectedProject") || "{}"
                  );

                  const approvedTickets = tickets.filter((t) => t.approved);
                  const result = await handleSubmit(
                    approvedTickets,
                    selectedProject
                  );

                  if (result) {
                    router.push(
                      `/protected/success?githubLink=${result.success.link}`
                    );
                    setIsLoading(false);
                  }
                }}
                className="font-retro h-16  px-56 py-2 bg-[#0F2E4A] text-white hover:bg-[#0F2E4A]-700 transition-colors font-western text-lg shadow-md hover:shadow-lg"
              >
                {isLoading ? "Submitting..." : "EXPORT TO GITHUB"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
