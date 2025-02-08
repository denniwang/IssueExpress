"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState } from "react";
import { tickets, Ticket } from "../types";
import Car from "./Car";
import { useRouter } from "next/navigation";

const DesertDrive: React.FC = () => {
  const [validTickets, setValidTickets] = useState<
    { ticket: Ticket; approved: Boolean }[]
  >([]);
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0);
  const [currentTicket, setCurrentTicket] = useState<Ticket>(
    tickets[currentTicketIndex]
  );
  const router = useRouter();

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

  const handleTicketChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCurrentTicket((prevTicket) => {
      if (!prevTicket) return prevTicket;
      return {
        ...prevTicket,
        [e.target.name]: e.target.value,
      };
    });
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
                value={currentTicket.assignee}
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
                  currentTicket?.startDate
                    ? currentTicket.startDate.toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setCurrentTicket((prevTicket) => ({
                    ...prevTicket,
                    startDate: new Date(e.target.value),
                  }))
                }
              />
            </div>
            <div>
              <strong>End Date:&nbsp;</strong>
              <input
                type="date"
                name="endDate"
                value={
                  currentTicket?.endDate
                    ? currentTicket.endDate.toISOString().split("T")[0]
                    : new Date().toISOString().split("T")[0]
                }
                onChange={(e) =>
                  setCurrentTicket((prevTicket) => ({
                    ...prevTicket,
                    endDate: new Date(e.target.value),
                  }))
                }
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
