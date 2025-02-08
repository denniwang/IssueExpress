export type Ticket = {
    assignee?: string;
    name: string;
    label: string;
    description: string;
    startDate?: Date;
    endDate?: Date;
    approved?: boolean;
}

export const tickets: Ticket[] = [];

export const validTickets: { ticket: Ticket; approved: Boolean }[] = [];