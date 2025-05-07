import { Link } from 'react-router-dom';
import { Ticket } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="border-t bg-background">
      <div className="container py-5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Logo e descrição */}
          <div className="flex flex-col justify-start">
            <div className="flex items-center space-x-2">
              <img src="https://i.ibb.co/ynfY6q7V/vainoshow-icon-bco.png" alt="VaiNoShow" className="h-8" />
              <span className="font-bold text-lg">VaiNoShow</span>
            </div>
            <p className="text-base text-muted-foreground max-w-xs">
              A maneira mais fácil e rápida de comprar ingressos para seus eventos favoritos.
            </p>
          </div>

          {/* Informações */}
          <div>
            <h4 className="font-semibold">Informações</h4>
            <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
              <Link to="/about" className="hover:underline">Sobre Nós</Link>
              <Link to="/faq" className="hover:underline">FAQ</Link>
              <Link to="/terms" className="hover:underline">Termos de Uso</Link>
              <Link to="/privacy" className="hover:underline">Privacidade</Link>
            </div>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold">Contato</h4>
            <div className="grid grid-cols-2 gap-1 text-sm text-muted-foreground">
              <p>Email: suporte@vainoshow.com</p>
              <p></p>
              <p>Telefone: (11) 96187-0728</p>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p><strong>© 2025 VaiNoShow.</strong> Todos os direitos reservados. Desenvolvido por Fabrício Diogo.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

