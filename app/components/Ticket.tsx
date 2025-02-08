import { FaEdit } from "react-icons/fa";
import type { Ticket } from "../protected/tickets/types";

interface TicketProps {
  step: number;
  totalSteps: number;
  ticket: Ticket;
  onAccept: () => void;
  onRemove: () => void;
  handleTicketChange: (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  handleDateChange: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "startDate" | "endDate"
  ) => void;
  getRandomFutureDate: () => string;
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
}) => {
  return (
    <div className="flex bg-white shadow-lg rounded-2xl w-full max-w-3xl z-50 fixed font-retro">
      {/* Sidebar */}
      <div className="bg-gray-500 text-white flex flex-col items-center justify-center px-3 py-6 rounded-l-2xl">
        <span className="text-md font-bold tracking-widest">
          {Array.from("HACKBEANPOT").map((char, index) => (
            <span key={index} className="block">
              {char}
            </span>
          ))}
        </span>
      </div>

      <div className="flex-1 p-6 relative">
        <div className="bg-gray-300 text-xs font-bold px-3 py-1 rounded-md inline-block">
          STOP {step} OUT OF {totalSteps}
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
            className="text-lg text-gray-600 mt-4 w-full focus:outline-none"
            value={ticket.description}
            onChange={handleTicketChange}
            name="description"
          ></textarea>
        </div>

        <div className="mt-4 flex gap-4">
          <button
            onClick={onAccept}
            className="border border-black px-4 py-1 rounded-md hover:bg-black hover:text-white font-bold"
          >
            ACCEPT
          </button>
          <button
            onClick={onRemove}
            className="text-gray-500 hover:text-black font-bold"
          >
            REMOVE
          </button>
        </div>
      </div>

      <div className="relative">
        {/* TODO change color of semi circles to match background to give ticket appearance */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-gray-300 w-10 h-5 rounded-b-full"></div>
        <div className="border-l-2 border-dashed border-black h-full mx-6"></div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-gray-300 w-10 h-5 rounded-t-full"></div>
      </div>

      <div className="bg-white p-6 rounded-r-2xl">
        <div>
          <label className="text-xs text-gray-500" htmlFor="assignee">
            ASSIGNEE
          </label>
          <div className="font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full inline-block"></span>
            <input
              type="text"
              className="bg-transparent border-none p-0 m-0 focus:outline-none"
              value={ticket.assignee}
              onChange={handleTicketChange}
              name="assignee"
            />
          </div>
        </div>

        <div className="flex flex-col mt-2">
          <label className="text-xs text-gray-500" htmlFor="label">
            LABEL
          </label>
          <div className="bg-gray-400 text-white px-3 py-1 rounded-md font-bold inline-block">
            <input
              type="text"
              className="bg-transparent border-none p-0 m-0 focus:outline-none text-white"
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
          className="text-black px-3 py-1 rounded-md font-bold border-none focus:outline-none"
          value={
            ticket.startDate
              ? ticket.startDate.toISOString().split("T")[0]
              : getRandomFutureDate()
          }
          onChange={(event) => handleDateChange(event, "startDate")}
          name="startDate"
        />

        <label className="text-xs text-gray-500 mt-2" htmlFor="endDate">
          END DATE
        </label>
        <input
          type="datetime"
          className="text-black px-3 py-1 rounded-md font-bold border-none focus:outline-none"
          value={
            ticket.endDate
              ? ticket.endDate.toISOString().split("T")[0]
              : getRandomFutureDate()
          }
          onChange={(event) => handleDateChange(event, "endDate")}
          name="endDate"
        />
      </div>
    </div>
  );
};

export default Ticket;
