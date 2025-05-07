
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from '@/components/ui/input';
import { Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';
import { TicketBatch, Sector, Event } from '@/types';
import { User } from '@/types';
import QRCode from '@/components/QRCode';

interface TicketPurchaseProps {
  event: Event;
  user: User | null;
}

const TicketPurchase: React.FC<TicketPurchaseProps> = ({ event, user }) => {
  const { toast } = useToast();
  
  const [selectedBatchId, setSelectedBatchId] = useState<string | null>(null);
  const [selectedSectorId, setSelectedSectorId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showQrCode, setShowQrCode] = useState(false);
  const [qrValue, setQrValue] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);
  
  // Filtrar lotes disponíveis (com ingressos e dentro do período de validade)
  const availableBatches = event.ticketBatches.filter(batch => {
    const now = new Date();
    return batch.available > 0 && 
           batch.startDate <= now && 
           batch.endDate >= now;
  });

  // Filtrar setores com ingressos disponíveis
  const availableSectors = event.sectors?.filter(sector => sector.available > 0) || [];
  
  const handleBatchSelect = (batchId: string) => {
    setSelectedBatchId(batchId);
    // Reset setor selecionado quando troca o lote
    setSelectedSectorId(null);
  };

  const handleSectorSelect = (sectorId: string) => {
    setSelectedSectorId(sectorId);
  };
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else {
      setQuantity(1);
    }
  };
  
  const handlePurchase = () => {
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

    if (availableSectors.length > 0 && !selectedSectorId) {
      toast({
        title: "Selecione um setor",
        description: "Escolha um setor para continuar.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedBatch = event.ticketBatches.find(b => b.id === selectedBatchId);
    if (!selectedBatch) return;
    
    const selectedSector = selectedSectorId ? event.sectors?.find(s => s.id === selectedSectorId) : null;
    
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
    
    // Simulação de processamento de pagamento
    setTimeout(() => {
      // Gerar QR Code PIX
      const totalValue = selectedSector 
        ? selectedSector.price * quantity 
        : selectedBatch.price * quantity;

      const pixData = {
        eventId: event.id,
        eventName: event.title,
        batchId: selectedBatch.id,
        batchName: selectedBatch.name,
        sectorId: selectedSector?.id,
        sectorName: selectedSector?.name,
        userId: user.id,
        quantity,
        totalValue,
        timestamp: new Date().toISOString()
      };
      
      // Simular QR Code Pix
      setQrValue(JSON.stringify(pixData));
      setShowQrCode(true);
      setIsPurchasing(false);
    }, 1500);
  };
  
  const formatDate = (date: Date) => {
    return format(date, "d 'de' MMMM 'de' Y", { locale: ptBR });
  };

  // Verificar preço baseado na seleção do lote e setor
  const getPrice = () => {
    if (selectedSectorId) {
      const sector = event.sectors?.find(s => s.id === selectedSectorId);
      return sector?.price || 0;
    } 
    
    if (selectedBatchId) {
      const batch = event.ticketBatches.find(b => b.id === selectedBatchId);
      return batch?.price || 0;
    }

    return 0;
  };
  
  return (
    <>
      {!showQrCode ? (
        <Card>
          <CardHeader>
            <CardTitle>Ingressos</CardTitle>
            <CardDescription>
              Selecione o tipo de ingresso e a quantidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

                {/* Mostrar seleção de setores se existirem */}
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
        </ul>
      </div>
    </>
  );
};

export default TicketPurchase;
