"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState, useEffect } from "react";
import { tickets, Ticket } from "../types";
import Car from "./Car";
import { useRouter } from "next/navigation";

const DesertDrive: React.FC = () => {
  const [validTickets, setValidTickets] = useState<
    { ticket: Ticket; approved: Boolean }[]
  >([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(
    tickets[currentTicketIndex]
  );
  const router = useRouter();

  // Handle approving or denying ticket
  const handleApproveDenny = (approved: boolean) => {
    const ticketToApprove = tickets[currentTicketIndex];
    
    // Update the valid tickets state
    setValidTickets((prevValidTickets) => {
      const updatedTickets = [...prevValidTickets, { ticket: ticketToApprove, approved }];
      
      // Update localStorage immediately to store the updated tickets
      localStorage.setItem("validTickets", JSON.stringify(updatedTickets));
      console.log("Updated Tickets in localStorage: ", updatedTickets);

      return updatedTickets;
    });
  
    // Move to the next ticket
    moveToNextTicket();
  };

  // Move to next ticket
  const moveToNextTicket = () => {
    console.log("Moving to next ticket, current index:", currentTicketIndex);
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex((prevIndex) => prevIndex + 1);
    } else {
      console.log("Last ticket processed, redirecting...");
      router.push("/protected/summary");
    }
  };

  // Initialize the first ticket
  useEffect(() => {
    setCurrentTicket(tickets[currentTicketIndex]);
  }, [currentTicketIndex]);

  return (
    <div className={styles.scene}>
      {/* TODO move to container & redo */}
      <div className={styles.sky}>
        <div className={styles.cloud}></div>
        <div className={styles.cloud} style={{ animationDelay: "-15s" }}></div>
        <div className={styles.cloud} style={{ animationDelay: "-30s" }}></div>
      </div>
      <div className={styles.desert}>
        {/* TODO move to container & redo */}
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
        <Car />
      </div>

      {/* TODO move this to right of screen in empty space*/}
      <div className={styles.ticketApprovalContainer}>
        {currentTicket && (
          <div className={styles.ticketInfo}>
            <h2>{currentTicket.name}</h2>
            <p>
              <strong>Assignee:</strong> {currentTicket.assignee}
            </p>
            <p>
              <strong>Label:</strong> {currentTicket.label}
            </p>
            <p>{currentTicket.description}</p>
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
  );
};

export default DesertDrive;
