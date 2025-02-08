"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState } from "react";
import { tickets, Ticket } from "../types";
import CAR from "./Car";
import { useRouter } from "next/navigation";
import { TentTree, Car, MapPin } from "lucide-react"

const DesertDrive: React.FC = () => {
  const [validTickets, setValidTickets] = useState<
    { ticket: Ticket; approved: Boolean }[]
  >([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [currentTicket, setCurrentTicket] = useState<Ticket>(
    tickets[currentTicketIndex]
  );
  const router = useRouter();

  // Calculate progress percentage
  const progress = (currentTicketIndex / (tickets.length - 1)) * 100;

  // Approve ticket
  const handleApproveDenny = (approved: boolean) => {
    setValidTickets((prevValidTickets) => [
      ...prevValidTickets,
      { ticket: currentTicket, approved },
    ]);
    moveToNextTicket();
  };

  // Move to next ticket
  const moveToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex((prevIndex) => prevIndex + 1);
      setCurrentTicket(tickets[currentTicketIndex + 1]);
    } else {
      // Store tickets in session storage
      sessionStorage.setItem("tickets", JSON.stringify(validTickets));

      // Redirect to the summary page
      router.push("/protected/summary");
    }
  };

  const handleTicketChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setCurrentTicket((prevTicket) => {
      if (!prevTicket) return prevTicket;
      return {
        ...prevTicket,
        [e.target.name]: e.target.value,
      };
    });
  };

  return (
    <div className="relative w-full">
      {/* Progress Bar */}
<div className="w-full bg-gray-800 fixed top-0 left-0 z-50 p-4">
  <div className="flex items-center justify-between max-w-6xl mx-auto relative">
    <div className="p-2 rounded-lg bg-gray-700">
      <TentTree className="w-5 h-5 text-white" />
    </div>

    <div className="flex-1 mx-8 relative h-1">
      <div 
        className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-300"
        style={{ width: `${progress}%` }}
      />
      
      <div className="absolute top-0 left-0 w-full h-full bg-gray-600" />

      <div className="absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
        style={{ left: `${progress}%` }}>
        <Car className="w-6 h-6 text-white -translate-x-1/2" />
      </div>
    </div>

    <div className="p-2 rounded-lg bg-gray-700">
      <MapPin className="w-5 h-5 text-white" />
    </div>
  </div>
</div>
      <div className={styles.scene}>
        <div className={styles.sky}>
          <div className={styles.cloud}></div>
          <div className={styles.cloud} style={{ animationDelay: "-15s" }}></div>
          <div className={styles.cloud} style={{ animationDelay: "-30s" }}></div>
        </div>
        <div className={styles.desert}>
          <div className={styles.cactusContainer}>
            <div className={styles.cactus}></div>
            <div
              className={styles.cactus}
              style={{ animationDelay: "-20s" }}
            ></div>
            <div
              className={styles.cactus}
              style={{ animationDelay: "-40s" }}
            ></div>
          </div>
          <div className={styles.road}></div>
        </div>
        <div className={styles.car}>
          <CAR />
        </div>

        <div className={styles.ticketApprovalContainer}>
          {currentTicket && (
            <div className={styles.ticketInfo}>
              <h2>
                <input
                  type="text"
                  name="name"
                  value={currentTicket.name}
                  onChange={handleTicketChange}
                />
              </h2>
              <p>
                <strong>Assignee:</strong>
                <input
                  type="text"
                  name="assignee"
                  value={currentTicket.assignee}
                  onChange={handleTicketChange}
                />
              </p>
              <p>
                <strong>Label:</strong>
                <input
                  type="text"
                  name="label"
                  value={currentTicket.label}
                  onChange={handleTicketChange}
                />
              </p>
              <textarea
                name="description"
                value={currentTicket.description}
                onChange={handleTicketChange}
              />
              <div className={styles.ticketActions}>
                <button
                  onClick={() => handleApproveDenny(true)}
                  className={styles.approveButton}
                >
                  Approve
                </button>
                <button
                  onClick={() => handleApproveDenny(false)}
                  className={styles.denyButton}
                >
                  Deny
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DesertDrive;