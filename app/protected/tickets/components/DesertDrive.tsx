"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState, useEffect } from "react";
import { tickets as defaultTickets, Ticket } from "../types";
import Car from "./Car";
import { useRouter } from "next/navigation";

const DesertDrive: React.FC = () => {
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [validTickets, setValidTickets] = useState<Ticket[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>(defaultTickets);
  const router = useRouter();

  // Derive currentTicket from currentTicketIndex and tickets
  const currentTicket = tickets[currentTicketIndex];

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
      {/* Render scene */}
      <div className={styles.sky}>
        <div className={styles.cloud}></div>
        <div className={styles.cloud} style={{ animationDelay: "-15s" }}></div>
        <div className={styles.cloud} style={{ animationDelay: "-30s" }}></div>
      </div>
      <div className={styles.desert}>
        <div className={styles.cactusContainer}>
          <div className={styles.cactus}></div>
          <div className={styles.cactus} style={{ animationDelay: "-20s" }}></div>
          <div className={styles.cactus} style={{ animationDelay: "-40s" }}></div>
        </div>
        <div className={styles.road}></div>
      </div>
      <div className={styles.car}>
        <Car />
      </div>

      {/* Render current ticket */}
      {currentTicket && (
        <div className={styles.ticketApprovalContainer}>
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
              <strong>Assignee:&nbsp;</strong>
              <input
                type="text"
                name="assignee"
                value={currentTicket.assignee || ""}
                onChange={handleTicketChange}
              />
            </p>
            <p>
              <strong>Label:&nbsp;</strong>
              <input
                type="text"
                name="label"
                value={currentTicket.label}
                onChange={handleTicketChange}
              />
            </p>
            <div>
              <strong>Description:&nbsp;</strong>
              <br />
              <textarea
                name="description"
                value={currentTicket.description}
                onChange={handleTicketChange}
                className="w-full"
                rows={4}
              />
            </div>
            <div>
              <strong>Start Date:&nbsp;</strong>
              <input
                type="date"
                name="startDate"
                value={
                  currentTicket.startDate
                    ? currentTicket.startDate.toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                onChange={(e) => handleDateChange(e, "startDate")}
              />
            </div>
            <div>
              <strong>End Date:&nbsp;</strong>
              <input
                type="date"
                name="endDate"
                value={
                  currentTicket.endDate
                    ? currentTicket.endDate.toISOString().split("T")[0]
                    : getRandomFutureDate()
                }
                onChange={(e) => handleDateChange(e, "endDate")}
              />
            </div>
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
        </div>
      )}
    </div>
  );
};

export default DesertDrive;