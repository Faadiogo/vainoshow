
import { Helmet } from 'react-helmet-async';

const ProfilePage = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Meu Perfil - VaiNoShow</title>
      </Helmet>
      <h1 className="text-2xl font-bold mb-6">Meu Perfil</h1>
      
      <div className="bg-card p-6 rounded-lg shadow max-w-md mx-auto">
        <p className="text-center text-muted-foreground mb-4">
          Perfil em desenvolvimento. 
          Em breve você poderá gerenciar seus dados no VaiNoShow.
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;
