
export type User = {
  id: string;
  name: string;
  email: string;
  is_admin?: boolean;
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

export type EventDate = {
  id: string;
  eventId: string;
  date: Date;
  artist: string;
  startTime: string;
};

export type Event = {
  id: string;
  title: string;
  description: string;
  location: string;
  image: string;
  mapImage?: string;
  start_date?: string;
  end_date?: string;
  featured?: boolean;
  ticketBatches?: TicketBatch[];
  sectors?: Sector[];
  eventDates?: EventDate[];
  created_at?: string;
  updated_at?: string;
};

export type Ticket = {
  id: string;
  userId: string;
  eventId: string;
  batchId: string;
  sectorId?: string;
  eventDateId?: string;
  purchaseDate: Date;
  qrCode: string;
  customCode?: string;
  used: boolean;
  batch?: TicketBatch;
  sector?: Sector;
  event?: Event;
  eventDate?: EventDate;
};

export type TicketWithDetails = Ticket & {
  event: Event;
  batch?: TicketBatch;
  sector?: Sector;
  eventDate?: EventDate;
};
