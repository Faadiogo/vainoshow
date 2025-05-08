
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { v4 as uuidv4 } from 'uuid';
import QRCode from '@/components/QRCode';
import { Event, TicketBatch, Sector, EventDate } from '@/types';

const TicketCreationPage = () => {
  const { toast } = useToast();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedEventId, setSelectedEventId] = useState<string>('');
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('');
  const [selectedDateId, setSelectedDateId] = useState<string>('');
  const [ticketBatches, setTicketBatches] = useState<TicketBatch[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [eventDates, setEventDates] = useState<EventDate[]>([]);
  const [quantity, setQuantity] = useState<number>(1);
  const [customCode, setCustomCode] = useState<string>('');
  const [generatedTickets, setGeneratedTickets] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('bulk');
  
  useEffect(() => {
    fetchEvents();
  }, []);
  
  useEffect(() => {
    if (selectedEventId) {
      fetchTicketBatches(selectedEventId);
      fetchSectors(selectedEventId);
      fetchEventDates(selectedEventId);
    } else {
      setTicketBatches([]);
      setSectors([]);
      setEventDates([]);
    }
  }, [selectedEventId]);
  
  const fetchEvents = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('title');
      
      if (error) throw error;
      setEvents(data || []);
      
      if (data && data.length > 0) {
        setSelectedEventId(data[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os eventos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const fetchTicketBatches = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('ticket_batches')
        .select('*')
        .eq('event_id', eventId)
        .order('start_sales_date');
      
      if (error) throw error;
      
      const formattedBatches = data?.map(batch => ({
        id: batch.id,
        name: batch.name,
        eventId: batch.event_id,
        price: batch.price,
        quantity: batch.quantity,
        available: batch.available,
        startDate: new Date(batch.start_sales_date),
        endDate: new Date(batch.end_sales_date)
      })) || [];
      
      setTicketBatches(formattedBatches);
      if (formattedBatches.length > 0) {
        setSelectedBatchId(formattedBatches[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar lotes:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os lotes.',
        variant: 'destructive',
      });
    }
  };
  
  const fetchSectors = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('sectors')
        .select('*')
        .eq('event_id', eventId);
      
      if (error) throw error;
      
      const formattedSectors = data?.map(sector => ({
        id: sector.id,
        name: sector.name,
        eventId: sector.event_id,
        price: sector.price,
        capacity: sector.capacity,
        available: sector.available,
        color: sector.color,
        position: sector.position
      })) || [];
      
      setSectors(formattedSectors);
      if (formattedSectors.length > 0) {
        setSelectedSectorId(formattedSectors[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar setores:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar os setores.',
        variant: 'destructive',
      });
    }
  };
  
  const fetchEventDates = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('event_dates')
        .select('*')
        .eq('event_id', eventId)
        .order('date');
      
      if (error) throw error;
      
      const formattedDates = data?.map(date => ({
        id: date.id,
        eventId: date.event_id,
        date: new Date(date.date),
        artist: date.artist,
        startTime: date.start_time
      })) || [];
      
      setEventDates(formattedDates);
      if (formattedDates.length > 0) {
        setSelectedDateId(formattedDates[0].id);
      }
    } catch (error) {
      console.error('Erro ao carregar datas:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as datas do evento.',
        variant: 'destructive',
      });
    }
  };
  
  const generateBulkTickets = async () => {
    if (!selectedEventId || !selectedBatchId || quantity <= 0) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar disponibilidade no lote
      const selectedBatch = ticketBatches.find(batch => batch.id === selectedBatchId);
      if (!selectedBatch || selectedBatch.available < quantity) {
        toast({
          title: 'Lote com ingressos insuficientes',
          description: `O lote selecionado possui apenas ${selectedBatch?.available || 0} ingressos disponíveis.`,
          variant: 'destructive',
        });
        return;
      }
      
      const tickets = [];
      
      for (let i = 0; i < quantity; i++) {
        const qrCode = uuidv4();
        tickets.push({
          event_id: selectedEventId,
          batch_id: selectedBatchId,
          sector_id: selectedSectorId || null,
          event_date_id: selectedDateId || null,
          qr_code: qrCode,
          is_used: false,
          purchase_date: new Date().toISOString()
        });
      }
      
      const { data, error } = await supabase
        .from('tickets')
        .insert(tickets)
        .select();
      
      if (error) throw error;
      
      // Atualizar a quantidade disponível no lote
      if (selectedBatch) {
        const newAvailable = selectedBatch.available - quantity;
        
        const { error: updateError } = await supabase
          .from('ticket_batches')
          .update({ available: newAvailable })
          .eq('id', selectedBatchId);
        
        if (updateError) throw updateError;
      }
      
      setGeneratedTickets(data || []);
      
      toast({
        title: 'Ingressos gerados',
        description: `${quantity} ingressos foram gerados com sucesso.`,
        variant: 'default',
      });
    } catch (error) {
      console.error('Erro ao gerar ingressos:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao gerar os ingressos.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const generateCustomTicket = async () => {
    if (!selectedEventId || !customCode || !selectedBatchId) {
      toast({
        title: 'Campos obrigatórios',
        description: 'Preencha todos os campos obrigatórios.',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      setLoading(true);
      
      // Verificar disponibilidade no lote
      const selectedBatch = ticketBatches.find(batch => batch.id === selectedBatchId);
      if (!selectedBatch || selectedBatch.available < 1) {
        toast({
          title: 'Lote sem ingressos disponíveis',
          description: 'O lote selecionado não possui ingressos disponíveis.',
          variant: 'destructive',
        });
        return;
      }
      
      // Verificar se o código já existe
      const { data: existingTicket, error: checkError } = await supabase
        .from('tickets')
        .select('id')
        .eq('qr_code', customCode)
        .maybeSingle();
      
      if (checkError) throw checkError;
      
      if (existingTicket) {
        toast({
          title: 'Código já utilizado',
          description: 'Este código QR já foi utilizado em outro ingresso. Por favor, escolha outro código.',
          variant: 'destructive',
        });
        return;
      }
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([{
          event_id: selectedEventId,
          batch_id: selectedBatchId,
          sector_id: selectedSectorId || null,
          event_date_id: selectedDateId || null,
          qr_code: customCode,
          custom_code: customCode,
          is_used: false,
          purchase_date: new Date().toISOString()
        }])
        .select();
      
      if (error) throw error;
      
      // Atualizar a quantidade disponível no lote
      if (selectedBatch) {
        const newAvailable = selectedBatch.available - 1;
        
        const { error: updateError } = await supabase
          .from('ticket_batches')
          .update({ available: newAvailable })
          .eq('id', selectedBatchId);
        
        if (updateError) throw updateError;
      }
      
      setGeneratedTickets(data || []);
      
      toast({
        title: 'Ingresso personalizado gerado',
        description: 'O ingresso com código personalizado foi gerado com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erro ao gerar ingresso personalizado:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao gerar o ingresso personalizado.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-6">
      <Helmet>
        <title>Criar Ingressos - VaiNoShow</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Criar Ingressos</h1>
      </div>
      
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Configurações do Ingresso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div>
                  <Label htmlFor="event">Evento</Label>
                  <Select value={selectedEventId} onValueChange={setSelectedEventId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um evento" />
                    </SelectTrigger>
                    <SelectContent>
                      {events.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="batch">Lote</Label>
                  <Select value={selectedBatchId} onValueChange={setSelectedBatchId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um lote" />
                    </SelectTrigger>
                    <SelectContent>
                      {ticketBatches.map((batch) => (
                        <SelectItem key={batch.id} value={batch.id}>
                          {batch.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(batch.price)}
                          {batch.available > 0 ? ` (${batch.available} disponíveis)` : ' (ESGOTADO)'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {sectors.length > 0 && (
                  <div>
                    <Label htmlFor="sector">Setor (opcional)</Label>
                    <Select value={selectedSectorId} onValueChange={setSelectedSectorId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um setor" />
                      </SelectTrigger>
                      <SelectContent>
                        {sectors.map((sector) => (
                          <SelectItem key={sector.id} value={sector.id}>
                            {sector.name} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(sector.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                {eventDates.length > 0 && (
                  <div>
                    <Label htmlFor="date">Data (opcional)</Label>
                    <Select value={selectedDateId} onValueChange={setSelectedDateId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma data" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventDates.map((date) => (
                          <SelectItem key={date.id} value={date.id}>
                            {date.date.toLocaleDateString('pt-BR')} - {date.artist}
                            {date.startTime ? ` às ${date.startTime}` : ''}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="bulk">Gerar Múltiplos</TabsTrigger>
                    <TabsTrigger value="custom">Código Personalizado</TabsTrigger>
                  </TabsList>
                  <TabsContent value="bulk" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="quantity">Quantidade</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                      />
                    </div>
                    
                    <Button onClick={generateBulkTickets} disabled={loading || !selectedEventId || !selectedBatchId || quantity <= 0}>
                      Gerar Ingressos
                    </Button>
                  </TabsContent>
                  <TabsContent value="custom" className="space-y-4 pt-4">
                    <div>
                      <Label htmlFor="customCode">Código Personalizado</Label>
                      <Input
                        id="customCode"
                        value={customCode}
                        onChange={(e) => setCustomCode(e.target.value)}
                        placeholder="Ex: EVENTO2023"
                      />
                    </div>
                    
                    <Button onClick={generateCustomTicket} disabled={loading || !selectedEventId || !selectedBatchId || !customCode}>
                      Gerar Ingresso Personalizado
                    </Button>
                  </TabsContent>
                </Tabs>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Ingressos Gerados</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedTickets.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nenhum ingresso gerado</p>
                </div>
              ) : (
                <div className="grid gap-4">
                  {generatedTickets.map((ticket) => (
                    <Card key={ticket.id}>
                      <CardContent className="p-4">
                        <div className="flex flex-col items-center">
                          <p className="mb-2 text-sm text-muted-foreground">QR Code do Ingresso:</p>
                          <div className="mb-2">
                            <QRCode value={ticket.qr_code} size={120} />
                          </div>
                          <p className="text-xs overflow-hidden text-ellipsis max-w-full text-center">
                            {ticket.qr_code}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TicketCreationPage;
