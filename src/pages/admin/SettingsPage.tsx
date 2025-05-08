
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface SiteSettings {
  site_name: string;
  site_description: string;
  contact_email: string;
  enable_tickets: boolean;
  enable_registrations: boolean;
  maintenance_mode: boolean;
  privacy_policy: string;
  terms_of_service: string;
}

const defaultSettings: SiteSettings = {
  site_name: 'VaiNoShow',
  site_description: 'Plataforma de venda de ingressos para shows e eventos',
  contact_email: 'contato@vainoshow.com',
  enable_tickets: true,
  enable_registrations: true,
  maintenance_mode: false,
  privacy_policy: '',
  terms_of_service: '',
};

const SettingsPage = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    fetchSettings();
  }, []);
  
  const fetchSettings = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      if (data) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível carregar as configurações do site.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .upsert([
          {
            id: 1, // Usamos ID fixo para facilitar atualizações
            ...settings,
            updated_at: new Date().toISOString()
          }
        ])
        .select();
      
      if (error) throw error;
      
      toast({
        title: 'Sucesso',
        description: 'Configurações salvas com sucesso.',
      });
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: 'Erro',
        description: 'Não foi possível salvar as configurações.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleToggle = (name: string, checked: boolean) => {
    setSettings(prev => ({ ...prev, [name]: checked }));
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }
  
  return (
    <div className="p-6">
      <Helmet>
        <title>Configurações - VaiNoShow</title>
      </Helmet>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Configurações do Sistema</h1>
      </div>
      
      <Tabs defaultValue="general" className="max-w-4xl">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="features">Funcionalidades</TabsTrigger>
          <TabsTrigger value="legal">Legal</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Configurações Gerais</CardTitle>
              <CardDescription>
                Configure as informações básicas do seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="site_name">Nome do Site</Label>
                <Input 
                  id="site_name"
                  name="site_name"
                  value={settings.site_name}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="site_description">Descrição do Site</Label>
                <Textarea 
                  id="site_description"
                  name="site_description"
                  value={settings.site_description}
                  onChange={handleChange}
                  rows={3}
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="contact_email">Email de Contato</Label>
                <Input 
                  id="contact_email"
                  name="contact_email"
                  type="email"
                  value={settings.contact_email}
                  onChange={handleChange}
                  className="mt-1"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="features">
          <Card>
            <CardHeader>
              <CardTitle>Funcionalidades</CardTitle>
              <CardDescription>
                Habilite ou desabilite recursos do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_tickets">Venda de Ingressos</Label>
                  <p className="text-sm text-muted-foreground">
                    Habilita a funcionalidade de compra de ingressos no site
                  </p>
                </div>
                <Switch
                  id="enable_tickets"
                  checked={settings.enable_tickets}
                  onCheckedChange={(checked) => handleToggle("enable_tickets", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enable_registrations">Cadastro de Usuários</Label>
                  <p className="text-sm text-muted-foreground">
                    Permite que novos usuários se cadastrem no site
                  </p>
                </div>
                <Switch
                  id="enable_registrations"
                  checked={settings.enable_registrations}
                  onCheckedChange={(checked) => handleToggle("enable_registrations", checked)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenance_mode" className="text-yellow-600">Modo Manutenção</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibe mensagem de manutenção e bloqueia o acesso ao site
                  </p>
                </div>
                <Switch
                  id="maintenance_mode"
                  checked={settings.maintenance_mode}
                  onCheckedChange={(checked) => handleToggle("maintenance_mode", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Documentos Legais</CardTitle>
              <CardDescription>
                Configure os documentos legais do seu site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="privacy_policy">Política de Privacidade</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Este conteúdo será exibido na página de política de privacidade
                </p>
                <Textarea 
                  id="privacy_policy"
                  name="privacy_policy"
                  value={settings.privacy_policy}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Insira sua política de privacidade aqui..."
                />
              </div>
              
              <div>
                <Label htmlFor="terms_of_service">Termos de Uso</Label>
                <p className="text-sm text-muted-foreground mb-2">
                  Este conteúdo será exibido na página de termos de uso
                </p>
                <Textarea 
                  id="terms_of_service"
                  name="terms_of_service"
                  value={settings.terms_of_service}
                  onChange={handleChange}
                  rows={10}
                  placeholder="Insira seus termos de uso aqui..."
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6 max-w-4xl flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving}>
          {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <Save className="mr-2 h-4 w-4" />
          Salvar Configurações
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
