import { useState } from 'react';
import { Settings, User, Shield, Bell, Info, Mail, Lock, Phone, Globe, Save, Image as ImageIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';

export function SettingsPage() {
  // Informações de Perfil
  const [name, setName] = useState('Ana Beatriz');
  const [username, setUsername] = useState('anabeat');
  const [bio, setBio] = useState('Amante de música pop, indie e crítica sonora.');
  const [bannerUrl, setBannerUrl] = useState('');

  // Redes Sociais e Links Individuais
  const [instagram, setInstagram] = useState('');
  const [tiktok, setTiktok] = useState('');
  const [twitter, setTwitter] = useState('');
  const [lastfm, setLastfm] = useState('');
  const [facebook, setFacebook] = useState('');
  const [youtube, setYoutube] = useState('');
  const [threads, setThreads] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [website, setWebsite] = useState('');

  // Informações da Conta
  const [email, setEmail] = useState('anabeat@musicpostr.com');
  const [phone, setPhone] = useState('+55 (48) 99999-9999');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLinkedGoogle, setIsLinkedGoogle] = useState(true);

  // Privacidade e Notificações
  const [profileVisibility, setProfileVisibility] = useState<'public' | 'private'>('public');
  const [emailNotif, setEmailNotif] = useState(true);
  const [communityNotif, setCommunityNotif] = useState(true);
  const [releasesNotif, setReleasesNotif] = useState(false);

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setSavedSuccess(false), 3500);
  };

  return (
    <div className="page-container max-w-4xl pb-16">
      <div className="page-header-wrapper mb-8">
        <h1 className="page-title text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-white stroke-[2.5]" /> Configurações
        </h1>
        <p className="page-subtitle">
          Gerencie centralizadamente as informações do seu perfil, redes sociais, dados de acesso e privacidade.
        </p>
      </div>

      {savedSuccess && (
        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-semibold flex items-center gap-2">
          ✨ Todas as alterações e redes sociais foram salvas com sucesso!
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-8">
        
        {/* 1. INFORMAÇÕES DE PERFIL E REDES SOCIAIS */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <User className="h-4 w-4 text-primary" /> Informações de Perfil & Redes Sociais
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Nome de Exibição</label>
              <input 
                type="text" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" 
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Username (@)</label>
              <input 
                type="text" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" 
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-1">
              <ImageIcon className="h-3.5 w-3.5" /> URL do Banner de Fundo
            </label>
            <input 
              type="text" 
              placeholder="https://exemplo.com/banner.jpg" 
              value={bannerUrl} 
              onChange={(e) => setBannerUrl(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" 
            />
          </div>

          <div>
            <label className="text-xs font-medium text-zinc-400 block mb-1">Biografia</label>
            <textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary h-20 resize-none" 
            />
          </div>

          <div className="pt-2 border-t border-zinc-800">
            <h3 className="text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Links para Redes Sociais e Streaming</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Instagram</label>
                <input type="text" placeholder="https://instagram.com/..." value={instagram} onChange={e => setInstagram(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">TikTok</label>
                <input type="text" placeholder="https://tiktok.com/@..." value={tiktok} onChange={e => setTiktok(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Twitter (X)</label>
                <input type="text" placeholder="https://twitter.com/..." value={twitter} onChange={e => setTwitter(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Last.fm</label>
                <input type="text" placeholder="https://last.fm/user/..." value={lastfm} onChange={e => setLastfm(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Facebook</label>
                <input type="text" placeholder="https://facebook.com/..." value={facebook} onChange={e => setFacebook(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">YouTube</label>
                <input type="text" placeholder="https://youtube.com/@..." value={youtube} onChange={e => setYoutube(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Threads</label>
                <input type="text" placeholder="https://threads.net/@..." value={threads} onChange={e => setThreads(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">LinkedIn</label>
                <input type="text" placeholder="https://linkedin.com/in/..." value={linkedin} onChange={e => setLinkedin(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
              <div className="md:col-span-2">
                <label className="text-[11px] text-zinc-400 block mb-1">Site Pessoal / Outro Link</label>
                <input type="text" placeholder="https://meusite.com" value={website} onChange={e => setWebsite(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* 2. INFORMAÇÕES DA CONTA */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-5">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Shield className="h-4 w-4 text-primary" /> Informações da Conta & Segurança
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                <Mail className="h-3.5 w-3.5" /> E-mail
              </label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                <Phone className="h-3.5 w-3.5" /> Telefone
              </label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> Senha Atual
              </label>
              <input type="password" placeholder="••••••••" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1 flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" /> Nova Senha
              </label>
              <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-xs text-white outline-none focus:border-primary" />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white rounded-lg text-black">
                <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.8 14.8 1 12 1 7.4 1 3.5 3.6 1.6 7.4l3.7 2.9C6.2 7.1 8.9 5 12 5zm6.5 7c0-.4 0-.8-.1-1.2H12v2.4h3.6c-.2 1-.8 1.9-1.7 2.5l2.7 2.1c1.6-1.5 2.7-3.8 2.7-6.8zM5.3 10.3C5.1 10.8 5 11.4 5 12s.1 1.2.3 1.7L1.6 16.6C1 15.2 0.7 13.6 0.7 12s.3-3.2.9-4.6l3.7 2.9zM12 19c-3.1 0-5.8-2.1-6.7-5.3L1.6 16.6C3.5 20.4 7.4 23 12 23c4.7 0 8.6-2.6 10.5-6.4l-3.7-2.9c-.9 2.1-3 3.5-6.8 3.5z"/></svg>
              </div>
              <div>
                <p className="text-xs font-semibold text-white">Conta Google Vinculada</p>
                <p className="text-[11px] text-zinc-400">Sua conta está conectada para login rápido.</p>
              </div>
            </div>
            <Button type="button" variant="outline" onClick={() => setIsLinkedGoogle(!isLinkedGoogle)} className="text-xs border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 h-8">
              {isLinkedGoogle ? 'Desvincular' : 'Vincular Google'}
            </Button>
          </div>
        </div>

        {/* 3. PRIVACIDADE */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Globe className="h-4 w-4 text-primary" /> Privacidade da Conta
          </h2>

          <div className="space-y-3 pt-1">
            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${profileVisibility === 'public' ? 'border-primary/50 bg-primary/5' : 'border-zinc-800 bg-zinc-950'}`}>
              <input type="radio" name="visibility" checked={profileVisibility === 'public'} onChange={() => setProfileVisibility('public')} className="mt-0.5 accent-primary" />
              <div>
                <p className="text-xs font-semibold text-white">Perfil Público</p>
                <p className="text-[11px] text-zinc-400">Qualquer usuário pode ver suas avaliações, notas e redes sociais na comunidade.</p>
              </div>
            </label>

            <label className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${profileVisibility === 'private' ? 'border-primary/50 bg-primary/5' : 'border-zinc-800 bg-zinc-950'}`}>
              <input type="radio" name="visibility" checked={profileVisibility === 'private'} onChange={() => setProfileVisibility('private')} className="mt-0.5 accent-primary" />
              <div>
                <p className="text-xs font-semibold text-white">Perfil Privado</p>
                <p className="text-[11px] text-zinc-400">Suas avaliações, favoritos e redes sociais ficam ocultos para outros membros.</p>
              </div>
            </label>
          </div>
        </div>

        {/* 4. NOTIFICAÇÕES */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-4">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Bell className="h-4 w-4 text-primary" /> Preferências de Notificações
          </h2>

          <div className="space-y-3 pt-1">
            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <div>
                <p className="text-xs font-medium text-white">Notificações por E-mail</p>
                <p className="text-[11px] text-zinc-400">Boletins semanais de álbuns avaliados.</p>
              </div>
              <input type="checkbox" checked={emailNotif} onChange={(e) => setEmailNotif(e.target.checked)} className="accent-primary w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-800/60">
              <div>
                <p className="text-xs font-medium text-white">Atividade da Comunidade</p>
                <p className="text-[11px] text-zinc-400">Avisos de curtidas e comentários em suas reviews.</p>
              </div>
              <input type="checkbox" checked={communityNotif} onChange={(e) => setCommunityNotif(e.target.checked)} className="accent-primary w-4 h-4 cursor-pointer" />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-xs font-medium text-white">Lançamentos Musicais</p>
                <p className="text-[11px] text-zinc-400">Alertas de novos álbuns.</p>
              </div>
              <input type="checkbox" checked={releasesNotif} onChange={(e) => setReleasesNotif(e.target.checked)} className="accent-primary w-4 h-4 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* 5. SOBRE */}
        <div className="bg-zinc-900/70 border border-zinc-800/80 p-6 rounded-2xl space-y-3">
          <h2 className="text-sm font-semibold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Info className="h-4 w-4 text-primary" /> Sobre o Musicpostr
          </h2>
          <div className="text-xs text-zinc-400 space-y-2 leading-relaxed">
            <p><strong className="text-white">Versão da Aplicação:</strong> 1.2.0-beta</p>
            <p>O Musicpostr é uma plataforma interativa de crítica e avaliação de álbuns musicais.</p>
            <p className="text-[11px] text-zinc-500 pt-1">© 2026 Musicpostr. Todos os direitos reservados.</p>
          </div>
        </div>

        {/* Botão Salvar Global */}
        <div className="flex justify-end pt-2">
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 text-xs font-semibold py-2.5">
            <Save className="h-4 w-4 mr-2" /> Salvar Todas as Alterações
          </Button>
        </div>

      </form>
    </div>
  );
}