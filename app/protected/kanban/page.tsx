"use client";

import { useState } from "react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import styled from "styled-components";
import { Ticket } from "../tickets/types"; // Import the existing Ticket type

// Dummy data
const initialTickets = {
  todo: [
    {
      id: "1",
      name: "Task #123 - Fix Login Bug",
      assignee: "Sheriff John",
      label: "bug fix",
      description: "Users are getting locked out at high noon",
      startDate: "2024-02-08T00:00:00.000Z",
      endDate: "2024-02-09T00:00:00.000Z",
      approved: false,
    },
    {
      id: "2",
      name: "Task #456 - Add Saloon Entrance",
      assignee: "Deputy Mike",
      label: "feature",
      description: "Design western-style landing page",
      startDate: "2024-02-08T00:00:00.000Z",
      endDate: "2024-02-09T00:00:00.000Z",
      approved: false,
    },
  ],
  inProgress: [
    {
      id: "3",
      name: "Task #789 - Optimize Horse Power",
      assignee: "Doc Brown",
      label: "developer work",
      description: "Performance improvements needed",
      startDate: "2024-02-08T00:00:00.000Z",
      endDate: "2024-02-09T00:00:00.000Z",
      approved: false,
    },
  ],
  done: [
    {
      id: "4",
      name: "Task #321 - Design Wanted Posters",
      assignee: "Miss Kate",
      label: "design",
      description: "Create template for user profiles",
      startDate: "2024-02-08T00:00:00.000Z",
      endDate: "2024-02-09T00:00:00.000Z",
      approved: true,
    },
  ],
};

type ColumnType = {
  [key in "todo" | "inProgress" | "done"]: Ticket[];
};

// Create a sortable task card component
const SortableTaskCard = ({ task }: { task: Ticket }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <TaskCard ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskTitle>{task.name}</TaskTitle>
      <TaskAssignee>🤠 {task.assignee}</TaskAssignee>
      <TaskLabel label={task.label}>{task.label}</TaskLabel>
      <TaskDescription>{task.description}</TaskDescription>
    </TaskCard>
  );
};

const KanbanBoard = () => {
  const [tickets, setTickets] = useState<ColumnType>(initialTickets);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    setTickets((tickets) => {
      const activeColumn = Object.entries(tickets).find(([_, items]) =>
        items.find((item) => item.id === activeId)
      )?.[0] as keyof ColumnType;

      const overColumn = Object.entries(tickets).find(([_, items]) =>
        items.find((item) => item.id === overId)
      )?.[0] as keyof ColumnType;

      if (!activeColumn || !overColumn) return tickets;

      const activeItems = [...tickets[activeColumn]];
      const overItems = [...tickets[overColumn]];

      const activeIndex = activeItems.findIndex((item) => item.id === activeId);
      const overIndex = overItems.findIndex((item) => item.id === overId);

      if (activeColumn === overColumn) {
        // Same column
        const newItems = arrayMove(activeItems, activeIndex, overIndex);
        return {
          ...tickets,
          [activeColumn]: newItems,
        };
      } else {
        // Different columns
        const [movedItem] = activeItems.splice(activeIndex, 1);
        overItems.splice(overIndex, 0, movedItem);

        return {
          ...tickets,
          [activeColumn]: activeItems,
          [overColumn]: overItems,
        };
      }
    });

    setActiveId(null);
  };

  return (
    <BoardContainer>
      <h1>🤠 Wild West Kanban Board 🐎</h1>
      <BoardWrapper>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          {Object.entries(tickets).map(([columnId, tasks]) => (
            <Column key={columnId}>
              <ColumnTitle>
                {columnId === "todo" && "🌵 Wanted Tasks"}
                {columnId === "inProgress" && "🔫 In The Shootout"}
                {columnId === "done" && "🌟 Ride Into Sunset"}
              </ColumnTitle>
              <SortableContext items={tasks.map((task) => task.id)}>
                <TaskList>
                  {tasks.map((task) => (
                    <SortableTaskCard key={task.id} task={task} />
                  ))}
                </TaskList>
              </SortableContext>
            </Column>
          ))}
          <DragOverlay>
            {activeId ? (
              <TaskCard>
                {tickets.todo.find((task) => task.id === activeId)?.name}
              </TaskCard>
            ) : null}
          </DragOverlay>
        </DndContext>
      </BoardWrapper>
    </BoardContainer>
  );
};

// Styled Components
const BoardContainer = styled.div`
  padding: 2rem;
  background: #f4d03f;
  min-height: 100vh;

  h1 {
    text-align: center;
    color: #5d4037;
    font-family: "Playfair Display", serif;
    margin-bottom: 2rem;
  }
`;

const BoardWrapper = styled.div`
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  padding: 1rem;
`;

const Column = styled.div`
  background: #8d6e63;
  border-radius: 8px;
  padding: 1rem;
  width: 300px;
  min-height: 500px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid #5d4037;
`;

const ColumnTitle = styled.h2`
  color: #f4d03f;
  font-size: 1.2rem;
  margin-bottom: 1rem;
  text-align: center;
  font-family: "Playfair Display", serif;
`;

const TaskList = styled.div`
  min-height: 100px;
`;

const TaskCard = styled.div`
  background: #fff;
  border-radius: 4px;
  padding: 1rem;
  margin-bottom: 0.8rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #5d4037;
  cursor: grab;
  touch-action: none;
`;

const TaskTitle = styled.h3`
  color: #5d4037;
  font-size: 1rem;
  margin-bottom: 0.5rem;
`;

const TaskAssignee = styled.div`
  color: #795548;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TaskDescription = styled.p`
  color: #6d4c41;
  font-size: 0.8rem;
  margin-top: 0.5rem;
`;

const TaskLabel = styled.span<{ label: string }>`
  display: inline-block;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-size: 0.8rem;
  background: ${({ label }) => {
    switch (label) {
      case "bug fix":
        return "#ffcdd2";
      case "feature":
        return "#c8e6c9";
      case "developer work":
        return "#bbdefb";
      case "design":
        return "#e1bee7";
      default:
        return "#f5f5f5";
    }
  }};
  color: #5d4037;
`;

export default KanbanBoard;
