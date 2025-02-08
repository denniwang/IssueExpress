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
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const ticketsParam = searchParams.get("tickets");
    if (ticketsParam) {
      try {
        const parsedTickets = JSON.parse(decodeURIComponent(ticketsParam));
        setTickets(parsedTickets);
        const sum = parsedTickets.reduce((acc: number, ticket: Ticket) => {
          return acc + ticket.price * ticket.quantity;
        }, 0);
        setTotal(sum);
      } catch (error) {
        console.error("Error parsing tickets:", error);
      }
    }
  }, [searchParams]);

  const ticketsFromSession = sessionStorage.getItem("tickets");
  const parsedTickets = ticketsFromSession
    ? JSON.parse(ticketsFromSession)
    : [];
  console.log(parsedTickets);
  


  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Order Summary</h1>
      <div className="space-y-4">
        {parsedTickets.map((ticket: Ticket) => (
          <div key={ticket.title}>
            <h2>{ticket.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
}
