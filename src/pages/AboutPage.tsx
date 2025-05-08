
import { Helmet } from 'react-helmet-async';

const AboutPage = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <Helmet>
        <title>Sobre Nós - VaiNoShow</title>
      </Helmet>
      
      <h1 className="text-3xl font-bold mb-6">Sobre Nós</h1>
      
      <div className="space-y-6">
        <section>
          <h2 className="text-2xl font-semibold mb-3">Nossa História</h2>
          <p className="text-gray-700 leading-relaxed">
            A VaiNoShow nasceu da paixão por eventos e da necessidade de tornar a compra de ingressos mais simples e transparente. 
            Fundada em 2023, nossa plataforma surgiu para conectar fãs aos seus artistas favoritos de forma rápida e segura.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">Nossa Missão</h2>
          <p className="text-gray-700 leading-relaxed">
            Acreditamos que momentos especiais merecem ser vividos sem complicações. Por isso, nossa missão é democratizar o acesso à cultura 
            e ao entretenimento, oferecendo uma plataforma intuitiva, segura e transparente para a compra de ingressos.
          </p>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">Nossos Valores</h2>
          <ul className="list-disc pl-5 text-gray-700 space-y-2">
            <li><span className="font-medium">Transparência:</span> Preços justos e sem taxas ocultas.</li>
            <li><span className="font-medium">Segurança:</span> Proteção de dados e transações seguras.</li>
            <li><span className="font-medium">Inovação:</span> Buscamos constantemente melhorar nossa plataforma.</li>
            <li><span className="font-medium">Paixão:</span> Amamos o que fazemos e queremos proporcionar experiências incríveis.</li>
          </ul>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold mb-3">Nossa Equipe</h2>
          <p className="text-gray-700 leading-relaxed">
            Somos um time diverso de profissionais apaixonados por tecnologia, música e entretenimento. 
            Trabalhamos juntos para oferecer a melhor experiência possível para nossos usuários.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {/* Aqui podem ser adicionados cards da equipe no futuro */}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
