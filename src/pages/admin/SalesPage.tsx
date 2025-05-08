
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { Event, Ticket } from '@/types';

interface SalesData {
  event: string;
  eventId: string;
  amount: number;
  count: number;
}

interface TicketWithDetails extends Ticket {
  user_name?: string;
  user_email?: string;
  event_title?: string;
  batch_name?: string;
  sector_name?: string;
}

const SalesPage = () => {
  const { toast } = useToast();
  const [tickets, setTickets] = useState<TicketWithDetails[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<TicketWithDetails[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<string>('7days');
  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<SalesData[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
  
  useEffect(() => {
    fetchEventsAndTickets();
  }, []);
  
  useEffect(() => {
    filterTickets();
  }, [tickets, selectedEventId, selectedPeriod]);
  
  const fetchEventsAndTickets = async () => {
    setLoading(true);
    try {
      // Buscar todos os eventos
      const { data: eventData, error: eventError } = await supabase
        .from('events')
        .select('*')
        .order('title');
      
      if (eventError) throw eventError;
      setEvents(eventData || []);
      
      // Buscar todos os tickets com join nas outras tabelas
      const { data: ticketData, error: ticketError } = await supabase
        .from('tickets')
        .select(`
          *,
          profiles:user_id (name, email),
          events:event_id (title),
          ticket_batches:batch_id (name, price),
          sectors:sector_id (name, price)
        `)
        .order('purchase_date', { ascending: false });
      
      if (ticketError) throw ticketError;
      
      const formattedTickets: TicketWithDetails[] = (ticketData || []).map((ticket: any) => ({
        id: ticket.id,
        userId: ticket.user_id,
        eventId: ticket.event_id,
        batchId: ticket.batch_id,
        sectorId: ticket.sector_id,
        eventDateId: ticket.event_date_id,
        purchaseDate: new Date(ticket.purchase_date),
        qrCode: ticket.qr_code,
        customCode: ticket.custom_code,
        used: ticket.is_used,
        user_name: ticket.profiles?.name,
        user_email: ticket.profiles?.email,
        event_title: ticket.events?.title,
        batch_name: ticket.ticket_batches?.name,
        sector_name: ticket.sectors?.name,
        price: ticket.sectors?.price || ticket.ticket_batches?.price || 0,
      }));
      
      setTickets(formattedTickets);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os dados de vendas.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filterTickets = () => {
    let filtered = [...tickets];
    
    // Filtrar por evento
    if (selectedEventId !== 'all') {
      filtered = filtered.filter(ticket => ticket.eventId === selectedEventId);
    }
    
    // Filtrar por período
    const today = new Date();
    switch (selectedPeriod) {
      case '7days':
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);
        filtered = filtered.filter(ticket => ticket.purchaseDate >= sevenDaysAgo);
        break;
      case '30days':
        const thirtyDaysAgo = new Date(today);
        thirtyDaysAgo.setDate(today.getDate() - 30);
        filtered = filtered.filter(ticket => ticket.purchaseDate >= thirtyDaysAgo);
        break;
      case '90days':
        const ninetyDaysAgo = new Date(today);
        ninetyDaysAgo.setDate(today.getDate() - 90);
        filtered = filtered.filter(ticket => ticket.purchaseDate >= ninetyDaysAgo);
        break;
      case 'all':
      default:
        // Não filtra por data
        break;
    }
    
    setFilteredTickets(filtered);
    
    // Gerar dados para os gráficos
    generateSalesData(filtered);
  };
  
  const generateSalesData = (tickets: TicketWithDetails[]) => {
    // Agrupar por evento
    const salesByEvent: Record<string, { eventId: string, event: string, amount: number, count: number }> = {};
    
    let total = 0;
    
    tickets.forEach(ticket => {
      if (!ticket.event_title) return;
      
      const eventTitle = ticket.event_title;
      const price = ticket.price || 0;
      
      if (!salesByEvent[eventTitle]) {
        salesByEvent[eventTitle] = {
          eventId: ticket.eventId,
          event: eventTitle,
          amount: 0,
          count: 0
        };
      }
      
      salesByEvent[eventTitle].amount += price;
      salesByEvent[eventTitle].count += 1;
      total += price;
    });
    
    const salesDataArray = Object.values(salesByEvent);
    setSalesData(salesDataArray);
    setTotalSales(total);
    setTotalTickets(tickets.length);
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  return (
    <div className="p-6">
      <Helmet>
        <title>Vendas - VaiNoShow</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Relatório de Vendas</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Total de Vendas</CardTitle>
            <CardDescription>No período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatCurrency(totalSales)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Ingressos Vendidos</CardTitle>
            <CardDescription>No período selecionado</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{totalTickets}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">Ticket Médio</CardTitle>
            <CardDescription>Valor médio por ingresso</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {totalTickets > 0 ? formatCurrency(totalSales / totalTickets) : formatCurrency(0)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-2">Evento</label>
          <Select value={selectedEventId} onValueChange={setSelectedEventId}>
            <SelectTrigger>
              <SelectValue placeholder="Todos os eventos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os eventos</SelectItem>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id}>
                  {event.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-64">
          <label className="block text-sm font-medium mb-2">Período</label>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Últimos 7 dias</SelectItem>
              <SelectItem value="30days">Últimos 30 dias</SelectItem>
              <SelectItem value="90days">Últimos 90 dias</SelectItem>
              <SelectItem value="all">Todos os tempos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Vendas por Evento</CardTitle>
            <CardDescription>
              Comparação de vendas entre eventos
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="event" tick={false} />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="amount" fill="#8884d8" name="Valor Total">
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
                <Legend />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Vendas</CardTitle>
            <CardDescription>
              Participação de cada evento no total de vendas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData}
                  dataKey="amount"
                  nameKey="event"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={(entry) => entry.event}
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Vendas</CardTitle>
          <CardDescription>
            Lista de todos os ingressos vendidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Carregando dados...</p>
          ) : filteredTickets.length === 0 ? (
            <p className="text-center py-4">Não há vendas registradas para os filtros selecionados.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Evento</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Lote/Setor</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTickets.map((ticket) => (
                    <TableRow key={ticket.id}>
                      <TableCell>
                        {format(ticket.purchaseDate, 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>{ticket.event_title || '-'}</TableCell>
                      <TableCell>
                        <div className="font-medium">{ticket.user_name || '-'}</div>
                        <div className="text-muted-foreground text-xs">{ticket.user_email || '-'}</div>
                      </TableCell>
                      <TableCell>
                        {ticket.sector_name ? (
                          <div>
                            <div className="font-medium">Setor: {ticket.sector_name}</div>
                            <div className="text-muted-foreground text-xs">Lote: {ticket.batch_name || '-'}</div>
                          </div>
                        ) : (
                          <div>Lote: {ticket.batch_name || '-'}</div>
                        )}
                      </TableCell>
                      <TableCell>{formatCurrency(ticket.price || 0)}</TableCell>
                      <TableCell>
                        {ticket.used ? (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">Utilizado</Badge>
                        ) : (
                          <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100">Válido</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesPage;
