export type Ticket = {
    assignee?: string;
    name: string;
    label: string;
    description: string;
}

export const tickets: Ticket[] = [];