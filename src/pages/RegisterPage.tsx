
import { Helmet } from 'react-helmet-async';

const RegisterPage = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Registrar - VaiNoShow</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Criar Conta</h1>
      
      <div className="bg-card p-6 rounded-lg shadow max-w-md mx-auto">
        <p className="text-center text-muted-foreground mb-4">
          Funcionalidade em desenvolvimento. 
          Em breve você poderá criar sua conta no VaiNoShow.
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
