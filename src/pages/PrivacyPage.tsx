
import { Helmet } from 'react-helmet-async';

const PrivacyPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Política de Privacidade - VaiNoShow</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Política de Privacidade</h1>
      
      <div className="max-w-4xl mx-auto prose prose-slate">
        <p className="text-gray-500 mb-6">Última atualização: 08 de Maio de 2025</p>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">1. Coleta de Informações</h2>
          <p>
            Coletamos informações pessoais que você nos fornece diretamente ao se cadastrar, comprar ingressos ou interagir com nossos serviços.
            Estas informações podem incluir:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome completo</li>
            <li>Endereço de e-mail</li>
            <li>Informações de pagamento (processadas por serviços de pagamento seguros)</li>
            <li>Histórico de compras de ingressos</li>
            <li>Dados de uso e preferências</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">2. Uso das Informações</h2>
          <p>
            Utilizamos suas informações pessoais para os seguintes fins:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Processar transações e enviar ingressos</li>
            <li>Gerenciar sua conta e proporcionar suporte ao cliente</li>
            <li>Enviar atualizações sobre eventos e ingressos adquiridos</li>
            <li>Melhorar nossos serviços e desenvolver novos recursos</li>
            <li>Prevenir fraudes e garantir a segurança da plataforma</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">3. Compartilhamento de Informações</h2>
          <p>
            Podemos compartilhar suas informações pessoais com:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Organizadores de eventos (apenas informações necessárias para verificação de ingressos)</li>
            <li>Prestadores de serviços que nos ajudam a operar nossa plataforma</li>
            <li>Autoridades legais quando exigido por lei</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">4. Segurança de Dados</h2>
          <p>
            Implementamos medidas técnicas e organizacionais adequadas para proteger suas informações pessoais contra acesso 
            não autorizado, perda acidental ou alteração. Utilizamos criptografia para proteger dados sensíveis e mantemos práticas 
            rigorosas de segurança em nossas instalações físicas e sistemas.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">5. Cookies e Tecnologias Semelhantes</h2>
          <p>
            Utilizamos cookies e tecnologias semelhantes para melhorar sua experiência, analisar o tráfego e personalizar conteúdo. 
            Você pode controlar o uso de cookies através das configurações do seu navegador.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">6. Seus Direitos</h2>
          <p>
            Você tem o direito de:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Acessar suas informações pessoais</li>
            <li>Retificar informações incorretas</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Restringir ou opor-se ao processamento de seus dados</li>
            <li>Solicitar a portabilidade de seus dados</li>
          </ul>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">7. Alterações nesta Política</h2>
          <p>
            Podemos atualizar esta política periodicamente. Notificaremos você sobre alterações significativas através de um aviso 
            em nossa plataforma ou por outros meios. O uso continuado de nossos serviços após tais alterações constitui sua aceitação 
            da política atualizada.
          </p>
        </section>
        
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-3">8. Contato</h2>
          <p>
            Se você tiver dúvidas ou preocupações sobre esta política de privacidade ou nossas práticas de dados, entre em contato 
            conosco em <a href="mailto:privacidade@vainoshow.com" className="text-primary hover:underline">privacidade@vainoshow.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
