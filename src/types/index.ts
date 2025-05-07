
export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin?: boolean;
  image?: string;
};

export type TicketBatch = {
  id: string;
  name: string;
  eventId: string;
  price: number;
  quantity: number;
  available: number;
  startDate: Date;
  endDate: Date;  
};

export type Sector = {
  id: string;
  name: string;
  eventId: string;
  price: number;
  capacity: number;
  available: number;
  color: string;
  position?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  mapImage?: string;
  start_date?: string; // ← novo campo
  end_date?: string;   // ← novo campo
  featured?: boolean;
  ticketBatches?: TicketBatch[];
  sectors?: Sector[];
  created_at?: string;
  updated_at?: string;
};


export type Ticket = {
  id: string;
  userId: string;
  eventId: string;
  batchId: string;
  sectorId?: string;
  purchaseDate: Date;
  qrCode: string;
  used: boolean;
  batch?: TicketBatch;
  sector?: Sector;
  event?: Event;
};
