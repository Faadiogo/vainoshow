
import { Helmet } from 'react-helmet-async';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQPage = () => {
  const faqItems = [
    {
      question: "Como comprar ingressos?",
      answer: "Para comprar ingressos, basta selecionar o evento desejado, escolher a data, setor e quantidade de ingressos. Em seguida, efetue o pagamento via PIX e o ingresso será enviado para seu e-mail e ficará disponível na seção 'Meus Ingressos'."
    },
    {
      question: "Posso transferir meu ingresso para outra pessoa?",
      answer: "Sim, você pode transferir seu ingresso para outra pessoa até 24 horas antes do evento. Para isso, acesse a seção 'Meus Ingressos' e selecione a opção de transferência."
    },
    {
      question: "O que fazer se eu perder meu QR Code?",
      answer: "Não se preocupe! Você pode acessar a seção 'Meus Ingressos' a qualquer momento para visualizar ou baixar novamente seus QR Codes."
    },
    {
      question: "Existe reembolso em caso de cancelamento?",
      answer: "Em caso de cancelamento do evento pelo organizador, o valor do ingresso será reembolsado integralmente. Cancelamentos por parte do comprador não são reembolsáveis, mas podem ser transferidos para outra pessoa."
    },
    {
      question: "Como verificar a autenticidade do meu ingresso?",
      answer: "Todos os ingressos comprados na VaiNoShow possuem um QR Code único e criptografado que garante sua autenticidade. Na entrada do evento, este código será validado pelos organizadores."
    },
    {
      question: "O que é um código personalizado?",
      answer: "O código personalizado é uma opção que permite que você escolha um texto específico para ser codificado no QR Code do seu ingresso. É uma funcionalidade opcional e caso não seja preenchido, um código aleatório será gerado automaticamente."
    },
    {
      question: "Posso comprar ingressos para várias pessoas?",
      answer: "Sim, você pode selecionar a quantidade de ingressos que deseja comprar. Todos ficarão disponíveis na sua conta, e você poderá transferi-los individualmente para outras pessoas."
    },
    {
      question: "Como faço para editar meu perfil?",
      answer: "Para editar seu perfil, faça login na sua conta e clique no seu nome no canto superior direito. Em seguida, selecione a opção 'Editar Perfil'."
    }
  ];

  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Perguntas Frequentes - VaiNoShow</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Perguntas Frequentes</h1>
      
      <div className="max-w-3xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-4">
          {faqItems.map((item, index) => (
            <AccordionItem value={`item-${index}`} key={index} className="border rounded-lg p-1">
              <AccordionTrigger className="px-4 py-2 text-left font-medium">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3 pt-1 text-gray-700">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-3">Não encontrou o que procura?</h3>
          <p className="text-gray-700 mb-6">
            Entre em contato conosco através do nosso suporte ao cliente.
          </p>
          <a href="mailto:suporte@vainoshow.com" className="bg-primary text-primary-foreground px-6 py-2 rounded-md hover:bg-primary/90">
            Contate o Suporte
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
