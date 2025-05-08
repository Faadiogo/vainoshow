
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import TicketValidator from '@/components/TicketValidator';

const TicketValidationPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Validação de Ingressos - VaiNoShow</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Validação de Ingressos</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Instruções</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p>
                  Utilize esta ferramenta para validar os ingressos no momento da entrada no evento.
                </p>
                <ol className="list-decimal list-inside space-y-2">
                  <li>Digite ou escaneie o código QR do ingresso</li>
                  <li>Verifique se o ingresso é válido e os detalhes do evento</li>
                  <li>Marque o ingresso como utilizado após a entrada do usuário</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                  Ingressos marcados como utilizados não poderão ser usados novamente, garantindo a segurança do seu evento.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div>
          <TicketValidator />
        </div>
      </div>
    </div>
  );
};

export default TicketValidationPage;
