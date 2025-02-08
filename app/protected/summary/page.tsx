"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Ticket {
  id: string;
  title: string;
  price: number;
  quantity: number;
}

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
    for (const ticket of parsedTickets) {
      if (ticket.approved) {
        setApprovedTickets((prev) => [...prev, ticket.ticket]);
      } else {
        setRejectedTickets((prev) => [...prev, ticket.ticket]);
      }
    }
    console.log(approvedTickets);
    console.log(rejectedTickets);
  }, []); // Empty dependency array to run only on mount

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
      <div className="space-y-4">
        {approvedTickets.map((ticket: Ticket, index: number) => (
          <div key={index}>
            <h2>{ticket.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
