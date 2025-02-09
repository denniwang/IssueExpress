import { FaEdit, FaPlus } from "react-icons/fa";
import { FaCircleMinus } from "react-icons/fa6";
import type { Ticket } from "../protected/tickets/types";
import { useState, useEffect } from "react";

interface TicketProps {
  step: number;
  totalSteps: number;
  ticket: Ticket;
  onAccept?: () => void;
  onRemove: () => void;
  handleTicketChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleDateChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate"
  ) => void;
  getRandomFutureDate?: () => string;
  isSummary?: boolean;
  editExport?: (ticket: Ticket) => void;
}

const Ticket: React.FC<TicketProps> = ({
  step,
  totalSteps,
  ticket,
  onAccept,
  onRemove,
  handleTicketChange,
  handleDateChange,
  getRandomFutureDate,
  isSummary = false,
  editExport = (ticket: Ticket) => {
    ticket.approved = !ticket.approved;
  },
}) => {
  const [randomEndDate, setRandomEndDate] = useState<string>("");

  // Generate random end date once when the component mounts or when ticket.id changes
  useEffect(() => {
    if (!ticket.endDate && getRandomFutureDate) {
      setRandomEndDate(getRandomFutureDate());
    }
  }, [ticket.name]);

  return (
    <div className="flex bg-white rounded-2xl w-full max-w-3xl z-50 fixed font-retro">
      <div
        className={`${isSummary && !ticket.approved ? "bg-[#FF3C68] text-[#FCCDD5]" : "bg-[#0F2E4A] text-white"} flex flex-col items-center justify-center px-3 py-6 rounded-l-2xl`}
      >
        <span className="text-md font-bold tracking-widest">
          {Array.from("HACKBEANPOT").map((char, index) => (
            <span key={index} className="block">
              {char}
            </span>
          ))}
        </span>
      </div>

      <div className="flex-1 p-6 relative">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-[#FCCDD5] text-xs font-bold px-3 py-1 rounded-md inline-block text-[#FF3C68]">
              STOP {step} OUT OF {totalSteps}
            </div>
            {isSummary && (
              <button
                className={`text-xs text-white px-3 py-1 font-bold ${ticket.approved ? "bg-[#0F2E4A]" : "bg-[#FF3C68]"}`}
                onClick={onRemove}
              >
                {ticket.approved ? "APPROVED" : "REMOVED"}
              </button>
            )}
          </div>
          {isSummary && (
            <button
              className="text-xs text-[#0F2E4A] hover:text-[#FF3C68] font-bold"
              onClick={() => {
                editExport(ticket);
                setRandomEndDate((prev) => prev + " "); // Trigger re-render
              }}
            >
              {ticket.approved ? (
                <FaCircleMinus className="inline mr-1 my-auto" />
              ) : (
                <FaPlus className="inline mr-1 my-auto" />
              )}
              {ticket.approved ? "REMOVE FROM EXPORT" : "ADD TO EXPORT"}
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col justify-between items-start border p-6">
          <div className="flex flex-row justify-between w-full">
            <input
              type="text"
              className="font-bold text-2xl bg-transparent border-none p-0 m-0 focus:outline-none flex-grow truncate"
              value={ticket.name}
              onChange={handleTicketChange}
              name="name"
              style={{ maxWidth: "80%" }}
            />
            <FaEdit size={30} />
          </div>
          <textarea
            className="text-md text-gray-600 mt-4 w-full focus:outline-none"
            value={ticket.description}
            onChange={handleTicketChange}
            name="description"
          ></textarea>
        </div>

        {!isSummary && (
          <div className="mt-4 flex gap-4">
            <button
              onClick={onAccept}
              className="border border-black px-4 py-1 rounded-md hover:bg-black hover:text-white font-bold"
            >
              ACCEPT
            </button>
            <button
              onClick={onRemove}
              className="text-black hover:text-[#FF3C68] font-bold"
            >
              REMOVE
            </button>
          </div>
        )}
      </div>

      <div className="relative">
        <div
          className={`absolute top-0 left-1/2 transform -translate-x-1/2 ${isSummary ? "bg-[#F7E3E1]" : "bg-[#87ceeb]"} w-10 h-5 rounded-b-full`}
        ></div>
        <div className="border-l-2 border-dashed border-black h-full mx-6"></div>
        <div
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 ${isSummary ? "bg-[#F7E3E1]" : "bg-[#ffd700]"} w-10 h-5 rounded-t-full`}
        ></div>
      </div>

      <div className="bg-white p-6 rounded-r-2xl">
        <div>
          <label className="text-xs text-gray-500" htmlFor="assignee">
            ASSIGNEE
          </label>
          <div className="font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-[#0F2E4A] rounded-full inline-block"></span>
            <input
              type="text"
              className="bg-transparent border-none p-0 m-0 focus:outline-none text-[#FF3C68]"
              value={ticket.assignee}
              onChange={handleTicketChange}
              name="assignee"
            />
          </div>
        </div>

        <div className="mt-2">
          <label className="text-xs text-gray-500" htmlFor="label">
            LABEL
          </label>
          <div className="bg-[#FCCDD5] text-white px-3 py-1 rounded-md font-bold inline-block">
            <input
              type="text"
              className="bg-transparent border-none p-0 m-0 focus:outline-none text-[#FF3C68]"
              value={ticket.label}
              onChange={handleTicketChange}
              name="label"
            />
          </div>
        </div>

        <label className="text-xs text-gray-500 mt-2" htmlFor="startDate">
          START DATE
        </label>
        <input
          type="datetime"
          className="text-[#FF3C68] px-3 py-1 rounded-md font-bold border-none focus:outline-none"
          value={
            ticket.startDate
              ? ticket.startDate.toISOString().split("T")[0]
              : new Date().toISOString().split("T")[0]
          }
          onChange={(event) => handleDateChange(event, "startDate")}
          name="startDate"
        />

        <label className="text-xs text-gray-500 mt-2" htmlFor="endDate">
          END DATE
        </label>
        <input
          type="datetime"
          className="text-[#FF3C68] px-3 py-1 rounded-md font-bold border-none focus:outline-none"
          value={randomEndDate}
          onChange={(event) => handleDateChange(event, "endDate")}
          name="endDate"
        />
      </div>
    </div>
  );
};

export default Ticket;
