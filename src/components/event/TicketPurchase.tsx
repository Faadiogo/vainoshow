
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { TicketBatch, Sector, Event, EventDate } from '@/types';
import { User } from '@/types';
import QRCode from '@/components/QRCode';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

interface TicketPurchaseProps {
  event: Event;
  user: User | null;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({ event, user }) => {
  const { toast } = useToast();
  
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [selectedDateId, setSelectedDateId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [customQrCode, setCustomQrCode] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [eventDates, setEventDates] = useState<EventDate[]>([]);
  const [ticketBatches, setTicketBatches] = useState<TicketBatch[]>([]);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchEventDetails = async () => {
      setLoading(true);
      
      try {
        // Buscar datas do evento
        const { data: datesData, error: datesError } = await supabase
          .from('event_dates')
          .select('*')
          .eq('event_id', event.id)
          .order('date', { ascending: true });
        
        if (datesError) throw datesError;
        
        // Buscar lotes disponíveis
        const now = new Date();
        const { data: batchesData, error: batchesError } = await supabase
          .from('ticket_batches')
          .select('*')
          .eq('event_id', event.id)
          .gt('available', 0)
          .lte('start_date', now.toISOString())
          .gte('end_date', now.toISOString())
          .order('price', { ascending: true });
        
        if (batchesError) throw batchesError;
        
        // Buscar setores disponíveis
        const { data: sectorsData, error: sectorsError } = await supabase
          .from('sectors')
          .select('*')
          .eq('event_id', event.id)
          .gt('available', 0)
          .order('price', { ascending: true });
        
        if (sectorsError) throw sectorsError;
        
        const formattedDates: EventDate[] = datesData?.map(date => ({
          id: date.id,
          eventId: date.event_id,
          date: new Date(date.date),
          artist: date.artist,
          startTime: date.start_time
        })) || [];
        
        const formattedBatches: TicketBatch[] = batchesData?.map(batch => ({
          id: batch.id,
          name: batch.name,
          eventId: batch.event_id,
          price: batch.price,
          quantity: batch.quantity,
          available: batch.available,
          startDate: new Date(batch.start_date),
          endDate: new Date(batch.end_date)
        })) || [];
        
        const formattedSectors: Sector[] = sectorsData?.map(sector => ({
          id: sector.id,
          name: sector.name,
          eventId: sector.event_id,
          price: sector.price,
          capacity: sector.capacity,
          available: sector.available,
          color: sector.color,
          position: sector.position
        })) || [];
        
        setEventDates(formattedDates);
        setTicketBatches(formattedBatches);
        setSectors(formattedSectors);
        
      } catch (error) {
        console.error('Erro ao carregar detalhes do evento:', error);
        toast({
          title: 'Erro',
          description: 'Não foi possível carregar informações do evento.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (event?.id) {
      fetchEventDetails();
    }
  }, [event?.id, toast]);
  
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    // Reset setor selecionado quando troca o lote
    setSelectedSectorId(null);
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSectorId(sectorId);
  };
  
  const handleDateSelect = (dateId: string) => {
    setSelectedDateId(dateId);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };
  
  const generateQRCode = () => {
    // Se tiver um código personalizado, usamos ele, senão geramos um aleatório
    if (customQrCode.trim()) {
      return customQrCode.trim();
    }
    
    // Gerar um UUID aleatório para o QR Code
    return uuidv4();
  };
  
  const handlePurchase = async () => {
    if (!user) {
      toast({
        title: "Você precisa estar logado",
        description: "Faça login para comprar ingressos.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedBatchId) {
      toast({
        title: "Selecione um lote",
        description: "Escolha um lote de ingressos para continuar.",
        variant: "destructive",
      });
      return;
    }

    if (sectors.length > 0 && !selectedSectorId) {
      toast({
        title: "Selecione um setor",
        description: "Escolha um setor para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    if (eventDates.length > 0 && !selectedDateId) {
      toast({
        title: "Selecione uma data",
        description: "Escolha uma data do evento para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedBatch = ticketBatches.find(b => b.id === selectedBatchId);
    if (!selectedBatch) return;
    
    const selectedSector = selectedSectorId ? sectors.find(s => s.id === selectedSectorId) : null;
    
    let availableQuantity = selectedBatch.available;
    if (selectedSector) {
      availableQuantity = Math.min(availableQuantity, selectedSector.available);
    }

    if (availableQuantity < quantity) {
      toast({
        title: "Quantidade indisponível",
        description: `Só temos ${availableQuantity} ingressos disponíveis.`,
        variant: "destructive",
      });
      return;
    }
    
    setIsPurchasing(true);
    
    try {
      // Gerar código QR
      const qrCode = generateQRCode();
      
      // Inserir ticket no banco de dados
      const ticketData = {
        user_id: user.id,
        event_id: event.id,
        batch_id: selectedBatchId,
        sector_id: selectedSectorId || null,
        event_date_id: selectedDateId || null,
        qr_code: qrCode,
        custom_code: customQrCode.trim() || null,
        is_used: false
      };
      
      const { data, error } = await supabase
        .from('tickets')
        .insert([ticketData])
        .select();
      
      if (error) throw error;
      
      // Atualizar quantidade disponível no lote
      const { error: batchError } = await supabase
        .from('ticket_batches')
        .update({ available: selectedBatch.available - quantity })
        .eq('id', selectedBatchId);
      
      if (batchError) throw batchError;
      
      // Se tiver setor selecionado, atualizar quantidade disponível no setor
      if (selectedSector) {
        const { error: sectorError } = await supabase
          .from('sectors')
          .update({ available: selectedSector.available - quantity })
          .eq('id', selectedSectorId);
        
        if (sectorError) throw sectorError;
      }
      
      // Exibir QR Code
      setQrValue(qrCode);
      setShowQrCode(true);
      
      // Atualizar dados locais
      if (selectedBatch) {
        const updatedBatch = {...selectedBatch, available: selectedBatch.available - quantity};
        setTicketBatches(ticketBatches.map(b => b.id === selectedBatchId ? updatedBatch : b));
      }
      
      if (selectedSector) {
        const updatedSector = {...selectedSector, available: selectedSector.available - quantity};
        setSectors(sectors.map(s => s.id === selectedSectorId ? updatedSector : s));
      }
      
    } catch (error) {
      console.error('Erro ao comprar ingresso:', error);
      toast({
        title: "Erro na compra",
        description: "Não foi possível processar a compra. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsPurchasing(false);
    }
  };
  
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' Y", { locale: ptBR });
  };

  // Verificar preço baseado na seleção do lote e setor
  const getPrice = () => {
    if (selectedSectorId) {
      const sector = sectors.find(s => s.id === selectedSectorId);
      return sector?.price || 0;
    } 
    
    if (selectedBatchId) {
      const batch = ticketBatches.find(b => b.id === selectedBatchId);
      return batch?.price || 0;
    }

    return 0;
  };

  // Filter available batches (with tickets and within valid period)
  const availableBatches = ticketBatches.filter(batch => batch.available > 0);

  // Filter available sectors with tickets
  const availableSectors = sectors.filter(sector => sector.available > 0);
  
  return (
    <>
      {!showQrCode ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingressos</CardTitle>
            <CardDescription>
              Selecione o tipo de ingresso, data e a quantidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {eventDates.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2">Selecione uma Data</h3>
                <Select 
                  value={selectedDateId || undefined} 
                  onValueChange={handleDateSelect}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma data" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventDates.map(date => (
                      <SelectItem key={date.id} value={date.id}>
                        {formatDate(date.date)} - {date.artist} ({date.startTime})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {availableBatches.length > 0 ? (
              <>
                <div>
                  <h3 className="text-sm font-medium mb-2">Lotes Disponíveis</h3>
                  <RadioGroup 
                    value={selectedBatchId || undefined}
                    onValueChange={handleBatchSelect}
                  >
                    {availableBatches.map((batch) => (
                      <div key={batch.id} className="flex items-center space-x-2 border p-4 rounded-md">
                        <RadioGroupItem value={batch.id} id={batch.id} />
                        <div className="grid gap-1 flex-1">
                          <Label htmlFor={batch.id} className="font-medium">
                            {batch.name}
                          </Label>
                          <div className="text-muted-foreground text-sm">
                            <span>Válido até {formatDate(batch.endDate)}</span>
                          </div>
                        </div>
                        <div className="font-medium text-right">
                          R$ {batch.price.toFixed(2).replace('.', ',')}
                        </div>
                      </div>
                    ))}
                  </RadioGroup>
                </div>

                {availableSectors.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Setores Disponíveis</h3>
                    <RadioGroup 
                      value={selectedSectorId || undefined}
                      onValueChange={handleSectorSelect}
                    >
                      {availableSectors.map((sector) => (
                        <div 
                          key={sector.id} 
                          className="flex items-center space-x-2 border p-4 rounded-md"
                          style={{borderLeftColor: sector.color, borderLeftWidth: '4px'}}
                        >
                          <RadioGroupItem value={sector.id} id={`sector-${sector.id}`} />
                          <div className="grid gap-1 flex-1">
                            <Label htmlFor={`sector-${sector.id}`} className="font-medium">
                              {sector.name}
                            </Label>
                            <div className="text-muted-foreground text-sm">
                              <span>{sector.available} ingressos disponíveis</span>
                            </div>
                          </div>
                          <div className="font-medium text-right">
                            R$ {sector.price.toFixed(2).replace('.', ',')}
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                    
                    {selectedBatchId && !selectedSectorId && availableSectors.length > 0 && (
                      <p className="text-sm text-amber-500 mt-2">
                        Por favor, selecione um setor para continuar
                      </p>
                    )}
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantidade</Label>
                  <div className="flex items-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <Input 
                      id="quantity" 
                      type="number" 
                      min="1"
                      className="w-16 mx-2 text-center" 
                      value={quantity}
                      onChange={handleQuantityChange}
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="customQrCode">Código Personalizado (opcional)</Label>
                  <Input 
                    id="customQrCode" 
                    value={customQrCode}
                    onChange={(e) => setCustomQrCode(e.target.value)}
                    placeholder="Deixe em branco para gerar um código automaticamente"
                  />
                  <p className="text-xs text-muted-foreground">
                    Você pode personalizar o código QR do seu ingresso ou deixar em branco para gerar um automático.
                  </p>
                </div>
                
                {selectedBatchId && (
                  <div className="text-sm">
                    <div className="flex justify-between py-1">
                      <span>Preço unitário:</span>
                      <span>
                        R$ {getPrice().toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span>Quantidade:</span>
                      <span>{quantity}</span>
                    </div>
                    <div className="flex justify-between py-1 font-bold">
                      <span>Total:</span>
                      <span>
                        R$ {(getPrice() * quantity).toFixed(2).replace('.', ',')}
                      </span>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">
                  Não há ingressos disponíveis para este evento no momento.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button 
              className="w-full" 
              onClick={handlePurchase}
              disabled={
                !selectedBatchId || 
                (availableSectors.length > 0 && !selectedSectorId) ||
                (eventDates.length > 0 && !selectedDateId) ||
                isPurchasing || 
                availableBatches.length === 0
              }
            >
              {isPurchasing ? 'Processando...' : 'Comprar Agora'}
            </Button>
            
            <Button variant="outline" className="w-full">
              <Share2 className="mr-2 h-4 w-4" />
              Compartilhar
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Pagamento via PIX</CardTitle>
            <CardDescription>
              Escaneie o QR Code abaixo com o app do seu banco para pagar
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center space-y-4">
            <QRCode 
              value={qrValue}
              size={200}
              logoImage="https://upload.wikimedia.org/wikipedia/commons/3/33/Pix_logo.svg"
            />
            
            <div className="text-center">
              <p className="font-medium text-lg">
                Total: R$ {(getPrice() * quantity).toFixed(2).replace('.', ',')}
              </p>
              <p className="text-sm text-muted-foreground">
                Após o pagamento, seu ingresso será enviado para seu email e 
                também ficará disponível na seção "Meus Ingressos".
              </p>
              {customQrCode && (
                <p className="mt-2 text-sm">
                  Código personalizado: <span className="font-bold">{customQrCode}</span>
                </p>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowQrCode(false)}
            >
              Voltar
            </Button>
          </CardFooter>
        </Card>
      )}
      
      {/* Informações adicionais */}
      <div className="mt-6 space-y-4 bg-muted/30 p-4 rounded-lg">
        <h3 className="font-medium">Informações importantes</h3>
        <ul className="text-sm space-y-2 text-muted-foreground">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Os ingressos não são reembolsáveis.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>É possível transferir ingressos para outras pessoas até 24h antes do evento.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Apresente o QR code na entrada do evento para validação.</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Para eventos com múltiplas datas, certifique-se de escolher a data correta.</span>
          </li>
        </ul>
      </div>
    </>
  );
};

export default TicketPurchase;
