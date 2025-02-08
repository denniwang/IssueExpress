export type Ticket = {
    assignee?: string;
    name: string;
    label: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
}

export const tickets: Ticket[] = [];