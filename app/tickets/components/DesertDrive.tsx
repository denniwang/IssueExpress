"use client";

import type React from "react";
import styles from "./DesertDrive.module.css";
import { useState } from "react";
import Car from "./Car";
import { Ticket } from "../types";

const DesertDrive: React.FC = () => {
  // TODO pull tickets when got from chat, edit the type to match
  const tickets: Ticket[] = [];
  const [currentTicket, setCurrentTicket] = useState(
    tickets.length > 0
      ? tickets[0]
      : {
          // TODO replace w real data?
          name: "Ticket Nitle",
          description: "Ticket Description",
          label: "dev"
        }
  );

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
          <div
            className={styles.cactus}
            style={{ animationDelay: "-20s" }}
          />
          <div
            className={styles.cactus}
            style={{ animationDelay: "-40s" }}
          ></div>
        </div>
        <div className={styles.road}></div>
      </div>
      <div className={styles.car}><Car /></div>
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
