"use client";

import { useEffect, useState } from "react";
import { validTickets, Ticket } from "../tickets/types";
import { MapPin, CheckCircle, XCircle } from 'lucide-react';
import React from 'react';

export default function SummaryPage() {
  const [approvedTickets, setApprovedTickets] = useState<Ticket[]>([]);
  const [rejectedTickets, setRejectedTickets] = useState<Ticket[]>([]);

  useEffect(() => {
    const parsedTickets = validTickets;
    const approved = parsedTickets.filter(t => t.approved).map(t => t.ticket);
    const rejected = parsedTickets.filter(t => !t.approved).map(t => t.ticket);

    setApprovedTickets(approved);
    setRejectedTickets(rejected);
  }, []);

  return (
    <div className="container mx-auto p-4 bg-amber-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-brown-800 font-western">Wild West Road Trip Summary</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <TicketList title="Approved Destinations" tickets={approvedTickets} icon={<CheckCircle className="text-green-600" />} />
        <TicketList title="Rejected Saloons" tickets={rejectedTickets} icon={<XCircle className="text-red-600" />} />
      </div>
    </div>
  );
}

function TicketList({ title, tickets, icon }: { title: string, tickets: Ticket[], icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-brown-600">
      <h2 className="text-2xl font-bold mb-4 text-brown-800 flex items-center gap-2">
        {icon}
        {title}
      </h2>
      <div className="space-y-4">
        {tickets.map((ticket, index) => (
          <TicketCard key={index} ticket={ticket} />
        ))}
      </div>
    </div>
  );
}

function TicketCard({ ticket }: { ticket: Ticket }) {
  return (
    <div className="bg-amber-100 p-4 rounded-md shadow border border-brown-300 hover:shadow-md transition-shadow">
      <h3 className="text-xl font-semibold text-brown-700">{ticket.name}</h3>
      <p className="text-brown-600 flex items-center gap-1 mt-2">
        <MapPin size={16} />
        {ticket.label}
      </p>
    </div>
  );
}
