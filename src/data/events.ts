
import { Event, TicketBatch, Sector, EventDate } from '@/types';

export const allEvents: Event[] = [
  // 3 eventos em destaque
  {
    id: '1',
    title: 'Festival de Verão 2025',
    description: 'O maior festival de música do verão com as melhores bandas!',
    location: 'Praia de Copacabana, Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=2070&auto=format&fit=crop',
    mapImage: 'https://i.imgur.com/L8qNrJG.png',
    featured: true,
    start_date: '2025-01-15',
    end_date: '2025-01-18',
    ticketBatches: [
      {
        id: 'batch1',
        name: '1º Lote',
        eventId: '1',
        price: 120,
        quantity: 1000,
        available: 500,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-15'),
      },
      {
        id: 'batch2',
        name: '2º Lote',
        eventId: '1',
        price: 150,
        quantity: 1000,
        available: 1000,
        startDate: new Date('2024-11-16'),
        endDate: new Date('2024-12-31'),
      },
    ],
    sectors: [
      {
        id: 'sector1',
        name: 'VIP',
        eventId: '1',
        price: 250,
        capacity: 500,
        available: 300,
        color: '#E5B80B',
      },
      {
        id: 'sector2',
        name: 'Pista Premium',
        eventId: '1',
        price: 180,
        capacity: 1000,
        available: 800,
        color: '#9333EA',
      },
      {
        id: 'sector3',
        name: 'Pista',
        eventId: '1',
        price: 120,
        capacity: 2000,
        available: 1200,
        color: '#0891B2',
      },
      {
        id: 'sector4',
        name: 'Arquibancada',
        eventId: '1',
        price: 100,
        capacity: 1500,
        available: 900,
        color: '#4ADE80',
      }
    ],
    eventDates: [
      {
        id: 'date1',
        eventId: '1',
        date: new Date('2025-01-15T18:00:00'),
        artist: 'Ivete Sangalo',
        startTime: '18:00',
      },
      {
        id: 'date2',
        eventId: '1',
        date: new Date('2025-01-16T18:00:00'),
        artist: 'Claudia Leitte',
        startTime: '18:00',
      },
      {
        id: 'date3',
        eventId: '1',
        date: new Date('2025-01-17T18:00:00'),
        artist: 'Bell Marques',
        startTime: '18:00',
      }
    ]
  },
  {
    id: '2',
    title: 'Rock in Rio 2025',
    description: 'O maior festival de rock do mundo!',
    location: 'Cidade do Rock, Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=2070&auto=format&fit=crop',
    mapImage: 'https://i.imgur.com/XYZ5rFd.png',
    featured: true,
    start_date: '2025-02-20',
    end_date: '2025-03-02',
    ticketBatches: [
      {
        id: 'batch3',
        name: '1º Lote',
        eventId: '2',
        price: 250,
        quantity: 2000,
        available: 250,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-30'),
      },
      {
        id: 'batch4',
        name: '2º Lote',
        eventId: '2',
        price: 300,
        quantity: 2000,
        available: 1500,
        startDate: new Date('2024-12-01'),
        endDate: new Date('2025-01-31'),
      },
    ],
    sectors: [
      {
        id: 'sector5',
        name: 'Front Stage',
        eventId: '2',
        price: 800,
        capacity: 500,
        available: 100,
        color: '#DC2626',
      },
      {
        id: 'sector6',
        name: 'VIP',
        eventId: '2',
        price: 600,
        capacity: 1000,
        available: 600,
        color: '#F59E0B',
      },
      {
        id: 'sector7',
        name: 'Pista Premium',
        eventId: '2',
        price: 450,
        capacity: 3000,
        available: 1800,
        color: '#2563EB',
      },
      {
        id: 'sector8',
        name: 'Pista',
        eventId: '2',
        price: 350,
        capacity: 5000,
        available: 2500,
        color: '#10B981',
      }
    ],
    eventDates: [
      {
        id: 'date4',
        eventId: '2',
        date: new Date('2025-02-20T16:00:00'),
        artist: 'Guns N\' Roses',
        startTime: '16:00',
      },
      {
        id: 'date5',
        eventId: '2',
        date: new Date('2025-02-21T16:00:00'),
        artist: 'Metallica',
        startTime: '16:00',
      },
      {
        id: 'date6',
        eventId: '2',
        date: new Date('2025-02-22T16:00:00'),
        artist: 'Iron Maiden',
        startTime: '16:00',
      }
    ]
  },
  {
    id: '3',
    title: 'Show da Taylor Swift',
    description: 'Taylor Swift traz sua turnê mundial para o Brasil!',
    location: 'Allianz Parque, São Paulo',
    image: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2070&auto=format&fit=crop',
    featured: true,
    start_date: '2025-03-10',
    end_date: '2025-03-10',
    ticketBatches: [
      {
        id: 'batch5',
        name: '1º Lote - Pista',
        eventId: '3',
        price: 400,
        quantity: 5000,
        available: 2000,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-01-31'),
      },
      {
        id: 'batch6',
        name: '1º Lote - Cadeira',
        eventId: '3',
        price: 300,
        quantity: 3000,
        available: 1000,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-01-31'),
      },
    ],
    sectors: [
      {
        id: 'sector9',
        name: 'Pista Premium',
        eventId: '3',
        price: 990,
        capacity: 3000,
        available: 500,
        color: '#7C3AED',
      },
      {
        id: 'sector10',
        name: 'Pista',
        eventId: '3',
        price: 650,
        capacity: 8000,
        available: 2000,
        color: '#2DD4BF',
      },
      {
        id: 'sector11',
        name: 'Cadeira Inferior',
        eventId: '3',
        price: 550,
        capacity: 6000,
        available: 3500,
        color: '#F97316',
      },
      {
        id: 'sector12',
        name: 'Cadeira Superior',
        eventId: '3',
        price: 400,
        capacity: 10000,
        available: 6000,
        color: '#84CC16',
      }
    ],
    eventDates: [
      {
        id: 'date7',
        eventId: '3',
        date: new Date('2025-03-10T20:00:00'),
        artist: 'Taylor Swift',
        startTime: '20:00',
      }
    ]
  },
  {
    id: '4',
    title: 'Tributo ao Queen',
    description: 'Uma noite de homenagem à lendária banda Queen.',
    location: 'Teatro Municipal, São Paulo',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=2066&auto=format&fit=crop',
    start_date: '2024-11-25',
    end_date: '2024-11-25',
    ticketBatches: [
      {
        id: 'batch8',
        name: '1º Lote',
        eventId: '4',
        price: 100,
        quantity: 500,
        available: 100,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-15'),
      },
    ],
    sectors: [],
    eventDates: []
  },
  {
    id: '5',
    title: 'FASBRA - Santa Branca',
    description: 'Rodeio de Santa Branca com várias atrações e comidas típicas.',
    location: ' Praça de Eventos - SANTA BRANCA/SP',
    image: 'https://s3.guicheweb.com.br/imagenseventos/24-05-2024_18-18-33.jpg',
    mapImage: 'https://cdn.guicheweb.com.br/gw-bucket/mapas/27-05-2024_15-17-28.jpeg',
    start_date: '2025-06-06',
    end_date: '2025-06-06',
    ticketBatches: [
      {
        id: 'batch8_event5',
        name: '1º Lote',
        eventId: '5',
        price: 100,
        quantity: 500,
        available: 250,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-15'),
      },
    ],
    sectors: [
      {
        id: 'sector5_event5',
        name: 'Front Stage',
        eventId: '5',
        price: 800,
        capacity: 500,
        available: 100,
        color: '#DC2626',
      },
      {
        id: 'sector6_event5',
        name: 'VIP',
        eventId: '5',
        price: 600,
        capacity: 1000,
        available: 600,
        color: '#F59E0B',
      },
      {
        id: 'sector7_event5',
        name: 'Pista Premium',
        eventId: '5',
        price: 450,
        capacity: 3000,
        available: 1800,
        color: '#2563EB',
      },
      {
        id: 'sector8_event5',
        name: 'Pista',
        eventId: '5',
        price: 350,
        capacity: 5000,
        available: 2500,
        color: '#10B981',
      }
    ],
    eventDates: []
  },
  {
    id: '6',
    title: 'Arujá Fest - Festa das Nações',
    description: 'Festa de aniversário de Arujá com várias atrações e comidas típicas.',
    location: 'Arujá, São Paulo',
    image: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?q=80&w=2066&auto=format&fit=crop',
    start_date: '2024-06-08',
    end_date: '2024-06-08',
    ticketBatches: [
      {
        id: 'batch8_event6',
        name: '1º Lote',
        eventId: '6',
        price: 100,
        quantity: 500,
        available: 300,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-15'),
      },
    ],
    sectors: [],
    eventDates: []
  },
  {
    id: '7',
    title: 'Stand-up Comedy Night',
    description: 'Uma noite de risadas com os melhores comediantes do Brasil.',
    location: 'Teatro Rival, Rio de Janeiro',
    image: 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=2071&auto=format&fit=crop',
    start_date: '2025-05-07',
    end_date: '2025-05-07',
    ticketBatches: [
      {
        id: 'batch12',
        name: 'Lote Único',
        eventId: '7',
        price: 60,
        quantity: 300,
        available: 150,
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-11-30'),
      },
    ],
    sectors: [],
    eventDates: []
  },
];

export const featuredEvents: Event[] = allEvents.filter(event => event.featured);

export const upcomingEvents: Event[] = allEvents.filter(event => !event.featured);

// Mock data for tickets
export const mockTickets = [
  {
    id: 'ticket1',
    userId: 'user1',
    eventId: '1',
    batchId: 'batch1',
    sectorId: 'sector1',
    eventDateId: 'date1',
    purchaseDate: new Date('2024-05-10'),
    qrCode: 'TICKET-TEST-123456',
    used: false,
    event: allEvents[0],
    batch: allEvents[0].ticketBatches?.[0],
    sector: allEvents[0].sectors?.[0],
    eventDate: allEvents[0].eventDates?.[0]
  },
  {
    id: 'ticket2',
    userId: 'user1',
    eventId: '2',
    batchId: 'batch3',
    sectorId: 'sector5',
    purchaseDate: new Date('2024-05-15'),
    qrCode: 'TICKET-TEST-789012',
    used: false,
    event: allEvents[1],
    batch: allEvents[1].ticketBatches?.[0],
    sector: allEvents[1].sectors?.[0]
  },
  {
    id: 'ticket3',
    userId: 'user1',
    eventId: '3',
    batchId: 'batch5',
    sectorId: 'sector9',
    purchaseDate: new Date('2024-04-20'),
    qrCode: 'TICKET-TEST-345678',
    used: true,
    event: allEvents[2],
    batch: allEvents[2].ticketBatches?.[0],
    sector: allEvents[2].sectors?.[0]
  }
];
