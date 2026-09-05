import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Music, Mail, Lock, User, ArrowRight, Check } from 'lucide-react';
import { Button } from '../../components/ui/button';
import './AuthPage.css';

export function AuthPage() {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg(true);
    
    setTimeout(() => {
      navigate('/perfil');
    }, 1200);
  };

  return (
    <div className="auth-container">
      {/* Fundo Animado com GIF (Luzes de Show/Pop) */}
      <div className="auth-bg-gif" />
      <div className="auth-overlay" />

      <div className="auth-card">
        
        {/* Cabeçalho do Card */}
        <div className="auth-header text-center">
          <Link to="/" className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-3 shadow-sm border border-primary/20">
            <Music className="h-6 w-6" />
          </Link>
          <h1 className="text-2xl font-black text-foreground tracking-tight">Musicpostr</h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isLogin ? 'Entre na sua conta para avaliar e compartilhar discos.' : 'Crie sua conta e comece a sua jornada de críticas musicais.'}
          </p>
        </div>

        {successMsg && (
          <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs rounded-xl font-semibold flex items-center justify-center gap-2">
            <Check className="h-4 w-4" /> {isLogin ? 'Login realizado com sucesso!' : 'Conta criada com sucesso!'}
          </div>
        )}

        {/* Abas Alternadoras (Login / Cadastro) */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Cadastrar
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {!isLogin && (
            <>
              <div>
                <label className="auth-label">Nome Completo</label>
                <div className="auth-input-wrapper">
                  <User className="auth-input-icon" />
                  <input
                    type="text"
                    required
                    placeholder="Ana Beatriz"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>

              <div>
                <label className="auth-label">Username (@)</label>
                <div className="auth-input-wrapper">
                  <span className="auth-input-icon flex items-center justify-center font-bold text-xs">@</span>
                  <input
                    type="text"
                    required
                    placeholder="anabeat"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="auth-input"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="auth-label">E-mail</label>
            <div className="auth-input-wrapper">
              <Mail className="auth-input-icon" />
              <input
                type="email"
                required
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          <div>
            <label className="auth-label">Senha</label>
            <div className="auth-input-wrapper">
              <Lock className="auth-input-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
              />
            </div>
          </div>

          {isLogin && (
            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-muted-foreground">
                <input type="checkbox" className="accent-primary rounded" /> Lembre de mim
              </label>
              <a href="#recuperar" onClick={(e) => { e.preventDefault(); alert('Instruções enviadas para o e-mail.'); }} className="text-primary hover:underline font-medium">
                Esqueceu a senha?
              </a>
            </div>
          )}

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl h-10 text-xs font-semibold mt-2 shadow-md flex items-center justify-center gap-2">
            {isLogin ? 'Entrar no Musicpostr' : 'Criar Conta Gratuita'} <ArrowRight className="h-4 w-4" />
          </Button>

        </form>

        {/* Divisor Social */}
        <div className="auth-divider">
          <span>ou continue com</span>
        </div>

        {/* Botão de Login Social (Google) */}
        <button
          type="button"
          onClick={() => {
            setSuccessMsg(true);
            setTimeout(() => navigate('/perfil'), 1000);
          }}
          className="auth-social-btn"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.11-6.72-4.94H1.2v3.15C3.18 21.32 7.25 24 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.26c-.25-.72-.38-1.49-.38-2.26s.13-1.54.38-2.26V6.59H1.2C.44 8.12 0 9.99 0 12s.44 3.88 1.2 5.41l4.08-3.15z"/>
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.25 0 3.18 2.68 1.2 6.59l4.08 3.15c.95-2.83 3.6-4.99 6.72-4.99z"/>
          </svg>
          Google
        </button>

        {/* Rodapé do Card */}
        <div className="auth-footer text-center mt-6 pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {isLogin ? "Ainda não tem uma conta? " : "Já possui uma conta? "}
            <button 
              type="button" 
              onClick={() => setIsLogin(!isLogin)} 
              className="text-primary font-semibold hover:underline"
            >
              {isLogin ? 'Cadastre-se' : 'Faça login'}
            </button>
          </p>
        </div>

      </div>
    </div>
  );
}