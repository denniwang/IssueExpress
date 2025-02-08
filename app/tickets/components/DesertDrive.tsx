"use client"

import type React from "react"
import styles from "./DesertDrive.module.css"
import { useState } from "react"
import { tickets } from "../types"

const DesertDrive: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const [validTickets, setValidTickets] = useState<typeof tickets>([])
  const [currentTicketIndex, setCurrentTicketIndex] = useState(0)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Here you would typically send the data to a server
    alert("Form submitted successfully!")
    console.log(tickets);
  }

  // Approve ticket
  const handleApprove = () => {
    const ticketToApprove = tickets[currentTicketIndex]
    setValidTickets((prevValidTickets) => [...prevValidTickets, ticketToApprove])
    moveToNextTicket()
  }

  // Deny ticket
  const handleDeny = () => {
    moveToNextTicket()
  }

  // Move to next ticket
  const moveToNextTicket = () => {
    if (currentTicketIndex < tickets.length - 1) {
      setCurrentTicketIndex((prevIndex) => prevIndex + 1)
    } else {
      alert("All tickets have been processed!")
    }
  }

  const currentTicket = tickets[currentTicketIndex]

  console.log("Tickets:", tickets);
  console.log("Current Ticket Index:", currentTicketIndex);

  return (
    <div className={styles.scene}>
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
        <svg width="200" height="120" viewBox="0 0 200 120">
          <rect x="20" y="40" width="160" height="50" fill="#ff4d4d" />
          <rect x="10" y="70" width="180" height="30" fill="#ff4d4d" />
          <rect x="40" y="30" width="80" height="40" fill="#87ceeb" />
          <circle cx="50" cy="100" r="20" fill="#333" />
          <circle cx="150" cy="100" r="20" fill="#333" />
          <circle cx="50" cy="100" r="15" fill="#666" />
          <circle cx="150" cy="100" r="15" fill="#666" />
        </svg>
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
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Ticket Name</h2>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Your Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Your Email"
            required
          />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Your Message"
            required
          ></textarea>
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  )
}

export default DesertDrive

