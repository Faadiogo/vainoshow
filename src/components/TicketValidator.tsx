
import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle2, XCircle, Search, QrCode } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import QRCode from '@/components/QRCode';

type TicketValidationStatus = 'valid' | 'used' | 'invalid' | null;

export default function TicketValidator() {
  const [code, setCode] = useState('');
  const [scanning, setScanning] = useState(false);
  const [validationStatus, setValidationStatus] = useState<TicketValidationStatus>(null);
  const [ticketInfo, setTicketInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const validateTicket = async () => {
    if (!code) return;
    
    setLoading(true);
    try {
      const { data: ticket, error } = await supabase
        .from('tickets')
        .select(`
          *,
          event:event_id(title, location),
          batch:batch_id(name, price),
          sector:sector_id(name),
          event_date:event_date_id(date, artist, start_time)
        `)
        .eq('qr_code', code)
        .maybeSingle();
      
      if (error) throw error;
      
      if (!ticket) {
        setValidationStatus('invalid');
        setTicketInfo(null);
        toast({
          title: 'Ingresso não encontrado',
          description: 'O código QR não corresponde a nenhum ingresso válido.',
          variant: 'destructive',
        });
      } else if (ticket.is_used) {
        setValidationStatus('used');
        setTicketInfo(ticket);
        toast({
          title: 'Ingresso já utilizado',
          description: 'Este ingresso já foi utilizado anteriormente.',
          variant: 'destructive',
        });
      } else {
        setValidationStatus('valid');
        setTicketInfo(ticket);
        toast({
          title: 'Ingresso válido',
          description: 'O ingresso é válido e pode ser utilizado.',
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Erro ao validar ingresso:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao validar o ingresso.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsUsed = async () => {
    if (!ticketInfo) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('tickets')
        .update({ is_used: true })
        .eq('id', ticketInfo.id);
      
      if (error) throw error;
      
      setValidationStatus('used');
      toast({
        title: 'Ingresso utilizado',
        description: 'O ingresso foi marcado como utilizado com sucesso.',
        variant: 'default',
      });
    } catch (error) {
      console.error('Erro ao marcar ingresso como utilizado:', error);
      toast({
        title: 'Erro',
        description: 'Ocorreu um erro ao marcar o ingresso como utilizado.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Validar Ingresso</CardTitle>
          <CardDescription>
            Digite ou escaneie o código QR de um ingresso para validação
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Digite o código do ingresso"
              disabled={loading}
            />
            <Button onClick={validateTicket} disabled={!code || loading}>
              <Search className="mr-2 h-4 w-4" />
              Validar
            </Button>
          </div>
        </CardContent>
      </Card>

      {validationStatus && (
        <Card>
          <CardHeader className={
            validationStatus === 'valid' ? 'bg-green-50 dark:bg-green-900/20' : 
            validationStatus === 'used' ? 'bg-amber-50 dark:bg-amber-900/20' : 
            'bg-red-50 dark:bg-red-900/20'
          }>
            <CardTitle className="flex items-center">
              {validationStatus === 'valid' && <CheckCircle2 className="mr-2 h-5 w-5 text-green-500" />}
              {validationStatus === 'used' && <CheckCircle2 className="mr-2 h-5 w-5 text-amber-500" />}
              {validationStatus === 'invalid' && <XCircle className="mr-2 h-5 w-5 text-red-500" />}
              
              {validationStatus === 'valid' && 'Ingresso Válido'}
              {validationStatus === 'used' && 'Ingresso Já Utilizado'}
              {validationStatus === 'invalid' && 'Ingresso Inválido'}
            </CardTitle>
          </CardHeader>
          
          {ticketInfo && (
            <CardContent className="pt-4">
              <div className="grid gap-2">
                <div>
                  <p className="font-semibold">Evento:</p>
                  <p>{ticketInfo.event?.title}</p>
                </div>
                {ticketInfo.event_date && (
                  <div>
                    <p className="font-semibold">Data:</p>
                    <p>
                      {new Date(ticketInfo.event_date.date).toLocaleDateString('pt-BR')} - {ticketInfo.event_date.artist}
                      {ticketInfo.event_date.start_time && ` às ${ticketInfo.event_date.start_time}`}
                    </p>
                  </div>
                )}
                {ticketInfo.batch && (
                  <div>
                    <p className="font-semibold">Lote:</p>
                    <p>{ticketInfo.batch.name}</p>
                  </div>
                )}
                {ticketInfo.sector && (
                  <div>
                    <p className="font-semibold">Setor:</p>
                    <p>{ticketInfo.sector.name}</p>
                  </div>
                )}
              </div>
            </CardContent>
          )}
          
          {validationStatus === 'valid' && (
            <CardFooter>
              <Button onClick={markAsUsed} disabled={loading}>
                Marcar como Utilizado
              </Button>
            </CardFooter>
          )}
        </Card>
      )}
    </div>
  );
}
