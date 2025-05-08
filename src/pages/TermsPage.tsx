
import { Helmet } from 'react-helmet-async';

const TermsPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Termos de Uso - VaiNoShow</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Termos de Uso</h1>
      
      <div className="max-w-4xl mx-auto prose prose-slate">
        <p className="text-gray-500 mb-6">Última atualização: 08 de Maio de 2025</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Aceitação dos Termos</h2>
          <p>
            Ao acessar ou usar o serviço VaiNoShow, você concorda com estes Termos de Uso. Se você não concordar com qualquer parte destes termos, 
            não poderá acessar ou usar nosso serviço.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Descrição do Serviço</h2>
          <p>
            A VaiNoShow é uma plataforma online que permite aos usuários comprar ingressos para eventos, shows e espetáculos. 
            Oferecemos serviços de geração de QR Codes para validação de ingressos e gerenciamento de eventos.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Cadastro e Conta</h2>
          <p>
            Para utilizar alguns recursos da nossa plataforma, você precisará criar uma conta. Você é responsável por manter a confidencialidade 
            de suas credenciais e por todas as atividades que ocorrem sob sua conta.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Compra de Ingressos</h2>
          <p>
            4.1. Todos os ingressos vendidos são finais e não reembolsáveis, exceto em casos de cancelamento do evento pelo organizador.
          </p>
          <p>
            4.2. Os ingressos podem ser transferidos para outra pessoa até 24 horas antes do evento.
          </p>
          <p>
            4.3. A VaiNoShow não se responsabiliza por eventos cancelados ou adiados pelos organizadores.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Uso do QR Code</h2>
          <p>
            5.1. Cada QR Code é único e válido apenas para uma entrada.
          </p>
          <p>
            5.2. A reprodução ou tentativa de falsificação de QR Codes é estritamente proibida e pode resultar em ações legais.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Limitação de Responsabilidade</h2>
          <p>
            A VaiNoShow não será responsável por danos indiretos, incidentais, especiais, consequenciais ou punitivos, incluindo perda de lucros, 
            dados, uso, boa vontade ou outras perdas intangíveis, resultantes do uso ou incapacidade de uso do serviço.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Alterações nos Termos</h2>
          <p>
            Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entrarão em vigor imediatamente após a publicação 
            dos termos atualizados. O uso contínuo do serviço após tais alterações constitui sua aceitação dos novos termos.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Lei Aplicável</h2>
          <p>
            Estes termos serão regidos e interpretados de acordo com as leis do Brasil, independentemente de seus princípios de conflito de leis.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
