"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Ticket } from "@/app/tickets/types";


export default function SummaryPage() {
  const searchParams = useSearchParams();
  const [approvedTickets, setApprovedTickets] = useState<Ticket[]>([]);
  const [rejectedTickets, setRejectedTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const ticketsFromSession = sessionStorage.getItem("tickets");
    const parsedTickets = ticketsFromSession
      ? JSON.parse(ticketsFromSession)
      : [];

    const approved = [];
    const rejected = [];

    for (const ticket of parsedTickets) {
      if (ticket.approved) {
        approved.push(ticket.ticket);
      } else {
        rejected.push(ticket.ticket);
      }
    }

    // Set state after accumulating the tickets
    setApprovedTickets(approved);
    setRejectedTickets(rejected);

    console.log(approved);
    console.log(rejected);
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Approved Tickets</h1>
      <div className="space-y-4">
        {approvedTickets.map((ticket: Ticket, index: number) => (
          <h2 key={index}>{ticket.name}</h2>
        ))}

      </div>
      <h1 className="text-2xl font-bold mb-6">Rejected Tickets</h1>
      <div className="space-y-4">
        {rejectedTickets.map((ticket: Ticket, index: number) => (
          <h2 key={index}>{ticket.name}</h2>
        ))}
      </div>
    </div>

  );
}
