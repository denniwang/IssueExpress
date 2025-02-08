"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState } from "react";
import Car from "./Car";
import { Ticket } from "../types";

const DesertDrive: React.FC = () => {
  const tickets: Ticket[] = [];
  const [currentTicket, setCurrentTicket] = useState(
    tickets.length > 0
      ? tickets[0]
      : {
          // TODO replace w real data?
          name: "Ticket Nitle",
          description: "Ticket Description",
          label: "dev",
        }
  );
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [validTickets, setValidTickets] = useState<Ticket[]>([]);


  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentTicket((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Form submitted:", currentTicket);
    // Here you would typically send the data to a server
    alert("Form submitted successfully!");
  };

  // Approve ticket
  const handleApprove = () => {
    const ticketToApprove = currentTicket;
    setValidTickets((prevValidTickets) => [...prevValidTickets, ticketToApprove]);
    moveToNextTicket();
  };

  // Deny ticket
  const handleDeny = () => {
    moveToNextTicket();
  };

  // Move to the next ticket
  const moveToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("All tickets have been processed!");
    }
  };

  return (
    <div className={styles.scene}>
      <div className={styles.sky}>
        {/* Randomize positions make component */}
        <div className={styles.cloud}></div>
        <div className={styles.cloud} style={{ animationDelay: "-15s" }}></div>
        <div className={styles.cloud} style={{ animationDelay: "-30s" }}></div>
      </div>
      <div className={styles.desert}>
        {/* Randomize positions make component -> split css, add more above and below road but cannot be road*/}
        <div className={styles.cactusContainer}>
          <div className={styles.cactus}></div>
          <div className={styles.cactus} style={{ animationDelay: "-20s" }} />
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

      <div className={styles.ticketApprovalContainer}>
          {currentTicket ? (
          <div className={styles.ticketInfo}>
            <h2>{currentTicket.name}</h2>
            <p><strong>Assignee:</strong> {currentTicket.assignee}</p>
            <p><strong>Label:</strong> {currentTicket.label}</p>
            <p>{currentTicket.description}</p>
            <div className={styles.ticketActions}>
              <button onClick={handleApprove} className={styles.approveButton}>Approve</button>
              <button onClick={handleDeny} className={styles.denyButton}>Deny</button>
            </div>
          </div>
        ) : (
          <p>No tickets to process.</p>
        )}
      </div>

      <div className={styles.formContainer}>
        {/* Make bigger */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Project Name</h2>
          <input
            type="text"
            name="name"
            value={currentTicket.name}
            onChange={handleInputChange}
            placeholder="Ticket Name"
            required
          />
          <textarea
            name="description"
            value={currentTicket.description}
            onChange={handleInputChange}
            placeholder="Ticket Description"
            required
          ></textarea>
          <input
            type="text"
            name="label"
            value={currentTicket.label}
            onChange={handleInputChange}
            placeholder="Ticket Label"
            required
          />
          <button type="submit">Confirm Ticket</button>
        </form>
      </div>
    </div>
  );
};

export default DesertDrive;
