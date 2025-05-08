import { createClient } from '@supabase/supabase-js';

// Use hardcoded values for development if environment variables are not available
// In a production environment, these should be properly set
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cciioosucdrcdnebohag.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjaWlvb3N1Y2RyY2RuZWJvaGFnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NTcxOTAsImV4cCI6MjA2MjEzMzE5MH0.kX3PjRewRjbiDyjfr_x5RtbuIufv-0oUuxxQkUWwgiA';

// Initialize the Supabase client with proper configuration
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});

// Database setup function (keeping existing functionality)
export const setupDatabase = async () => {
  // Verificar se a tabela site_settings existe
  const { error: checkError } = await supabase
    .from('site_settings')
    .select('id')
    .limit(1);
  
  // Se a tabela não existir, criaremos
  if (checkError && checkError.code === 'PGRST116') {
    try {
      // Criar a tabela site_settings
      await supabase.rpc('create_site_settings_table');
      
      console.log('Tabela site_settings criada com sucesso');
      
      // Inserir configurações iniciais
      await supabase
        .from('site_settings')
        .insert([
          {
            id: 1,
            site_name: 'VaiNoShow',
            site_description: 'Plataforma de venda de ingressos para shows e eventos',
            contact_email: 'contato@vainoshow.com',
            enable_tickets: true,
            enable_registrations: true,
            maintenance_mode: false,
            privacy_policy: '',
            terms_of_service: ''
          }
        ]);
      
      console.log('Configurações iniciais inseridas com sucesso');
    } catch (error) {
      console.error('Erro ao configurar o banco de dados:', error);
    }
  }
};

// Chamar a função de setup
setupDatabase();
