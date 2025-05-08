import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Criaremos a tabela de configurações do site quando a aplicação inicializar (apenas para desenvolvimento)
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
