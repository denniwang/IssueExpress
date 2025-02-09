"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState, useEffect } from "react";
import { tickets as defaultTickets, Ticket } from "../types";
import { TentTree, Car, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import Background from "./Background";
import TicketComponent from "@/app/components/Ticket";

const DesertDrive: React.FC = () => {
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [validTickets, setValidTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>(defaultTickets);
  const [animationClass, setAnimationClass] = useState("");
  const [carAnimationClass, setCarAnimationClass] = useState("");
  const [showTicket, setShowTicket] = useState(true);
  const router = useRouter();

  // Derive currentTicket from currentTicketIndex and tickets
  const currentTicket = tickets[currentTicketIndex];

  const progress = (currentTicketIndex / (tickets.length - 1)) * 100;

  useEffect(() => {
    // Load validTickets and currentTicketIndex from localStorage on component mount
    const storedValidTickets = localStorage.getItem("validTickets");
    if (storedValidTickets) {
      setValidTickets(JSON.parse(storedValidTickets));
    }

    const storedTicketIndex = localStorage.getItem("currentTicketIndex");
    if (storedTicketIndex) {
      const ticketIndex = Number(storedTicketIndex);
      setCurrentTicketIndex(ticketIndex);
    }

    // Load tickets from localStorage if available
    const storedTickets = localStorage.getItem("tickets");
    if (storedTickets) {
      setTickets(JSON.parse(storedTickets));
    }
  }, []);

  useEffect(() => {
    // Save validTickets and currentTicketIndex to localStorage whenever they change
    localStorage.setItem("validTickets", JSON.stringify(validTickets));
    localStorage.setItem("currentTicketIndex", String(currentTicketIndex));

    // Save tickets to localStorage whenever it changes
    localStorage.setItem("tickets", JSON.stringify(tickets));
  }, [validTickets, currentTicketIndex, tickets]);

  useEffect(() => {
    // Save validTickets to localStorage whenever they change
    localStorage.setItem("validTickets", JSON.stringify(validTickets));
  }, [validTickets]);

  // Approve or deny ticket
  const handleApproveDenny = (approved: boolean) => {
    if (!currentTicket) return;

    // Trigger the animation
    if (currentTicketIndex < tickets.length - 1) {
      setAnimationClass(styles.slideOutAndBack);
    } else {
      setAnimationClass(styles.slideOut);
      setCarAnimationClass(styles.slideRight)
      setShowTicket(false);
    }

    setTimeout(() => {
      // Update the current ticket with the approval status
      const updatedTickets = tickets.map((ticket, index) =>
        index === currentTicketIndex ? { ...ticket, approved } : ticket
      );

      // Update validTickets if approved
      if (approved) {
        setValidTickets([...validTickets, currentTicket]);
      }

      localStorage.setItem("tickets", JSON.stringify(updatedTickets));
      setTickets(updatedTickets); // Ensure state reflects updates

      // Move to the next ticket
      moveToNextTicket();

      // Reset the animation class
      setAnimationClass("");
    }, 1500); // Duration of the slide-out animation
  };

  // Move to next ticket
  const moveToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      const newIndex = currentTicketIndex + 1;
      setCurrentTicketIndex(newIndex);
      localStorage.setItem("currentTicketIndex", String(newIndex));
    } else {
      // Redirect to the summary page when all tickets are processed
      router.push("/protected/summary");
    }
  };

  const handleTicketChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const updatedTickets = tickets.map((ticket, index) =>
      index === currentTicketIndex
        ? { ...ticket, [e.target.name]: e.target.value }
        : ticket
    );
    setTickets(updatedTickets);
  };

  const handleDateChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate"
  ) => {
    const newDate = new Date(e.target.value);
    const updatedTickets = tickets.map((ticket, index) =>
      index === currentTicketIndex ? { ...ticket, [field]: newDate } : ticket
    );
    setTickets(updatedTickets);
  };

  const getRandomFutureDate = () => {
    const daysFromNow = Math.floor(Math.random() * 5) + 1;
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString().split("T")[0];
  };

  return (
    <div className={styles.scene}>
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
              <div
                className="absolute top-1/2 -translate-y-1/2 z-10 transition-all duration-300"
                style={{ left: `${progress}%` }}
              >
                <Car className="w-6 h-6 text-white -translate-x-1/2" />
              </div>
            </div>

            <div className="p-2 rounded-lg bg-gray-700">
              <MapPin className="w-5 h-5 text-white" />
            </div>
          </div>
        </div>
      </div>

      <Background carAnimationClass={carAnimationClass} />

      {/* Render current ticket */}
      {currentTicket && showTicket && (
        <div className={`${styles.ticketApprovalContainer} ${animationClass}`}>
          <TicketComponent
            step={currentTicketIndex + 1}
            totalSteps={tickets.length}
            ticket={currentTicket}
            onAccept={() => handleApproveDenny(true)}
            onRemove={() => handleApproveDenny(false)}
            handleTicketChange={handleTicketChange}
            handleDateChange={handleDateChange}
            getRandomFutureDate={getRandomFutureDate}
          />
        </div>
      )}
    </div>
  );
};

export default DesertDrive;
