"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState } from "react";
import { tickets, Ticket } from "../types";
import Car from "./Car";

const DesertDrive: React.FC = () => {

  const [validTickets, setValidTickets] = useState<{ticket: Ticket, approved: Boolean}[]>([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
 
  // Approve ticket
  const handleApproveDenny = (approved: boolean) => {
    setValidTickets((prevValidTickets) => [...prevValidTickets, { ticket: tickets[currentTicketIndex], approved }]);
    moveToNextTicket();
  };

  // Move to next ticket
  const moveToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("All tickets have been processed!");
    }
  };

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
          <div className={styles.cactus} style={{ animationDelay: "-20s" }}></div>
          <div className={styles.cactus} style={{ animationDelay: "-40s" }}></div>
        </div>
        <div className={styles.road}></div>
      </div>
      <div className={styles.car}>
        <Car />
      </div>

      {/* TODO move this to right of screen in empty space*/}
      <div className={styles.ticketApprovalContainer}>
        {tickets[currentTicketIndex] && (
          <div className={styles.ticketInfo}>
            <h2>{tickets[currentTicketIndex].name}</h2>
            <p><strong>Assignee:</strong> {tickets[currentTicketIndex].assignee}</p>
            <p><strong>Label:</strong> {tickets[currentTicketIndex].label}</p>
            <p>{tickets[currentTicketIndex].description}</p>
            <div className={styles.ticketActions}>
              <button onClick={() => handleApproveDenny(true)} className={styles.approveButton}>
                Approve
              </button>
              <button onClick={() => handleApproveDenny(false)} className={styles.denyButton}>
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
