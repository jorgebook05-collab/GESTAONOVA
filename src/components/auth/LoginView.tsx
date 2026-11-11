import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  UserPlus, 
  KeyRound, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Mail,
  Lock,
  UserCheck,
  GraduationCap,
  Sparkles,
  Info
} from 'lucide-react';
import { User as UserType } from '../../types';
import { 
  authenticateUser, 
  registerNewTeacher, 
  getStoredUsers, 
  TEACHER_AVATAR_PRESETS 
} from '../../services/authService';

interface LoginViewProps {
  onLoginSuccess: (user: UserType) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login Form State
  const [email, setEmail] = useState<string>('diretora@edugestao.demo');
  const [password, setPassword] = useState<string>('Diretor123!');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Register Form State (For Teachers)
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regPasswordConfirm, setRegPasswordConfirm] = useState<string>('');
  const [regSubject, setRegSubject] = useState<string>('Matemática');
  const [regDepartment, setRegDepartment] = useState<string>('Ciências Exatas e Tecnológicas');
  const [selectedAvatarUrl, setSelectedAvatarUrl] = useState<string>(TEACHER_AVATAR_PRESETS[0].url);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);

  // Registered Teachers from localStorage
  const [storedTeachers, setStoredTeachers] = useState<UserType[]>([]);

  useEffect(() => {
    try {
      const users = getStoredUsers();
      const teachers = users.filter((u) => u.role === 'teacher');
      setStoredTeachers(teachers);
    } catch {
      setStoredTeachers([]);
    }
  }, [activeTab]);

  // Preenchimento exclusivo para a Diretora (Conta pré-definida fixa)
  const fillDirectorCredentials = () => {
    setEmail('diretora@edugestao.demo');
    setPassword('Diretor123!');
    setErrorMessage(null);
  };

  const fillTeacherCredentials = (teacher: UserType) => {
    setEmail(teacher.email);
    setPassword(teacher.password || 'Professor123!');
    setErrorMessage(null);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = authenticateUser(email, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setErrorMessage(
          result.error || 'Credenciais inválidas. Verifique o e-mail institucional e senha.'
        );
      }
    }, 450);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (regPassword !== regPasswordConfirm) {
      setRegError('As senhas digitadas não coincidem.');
      return;
    }

    if (regPassword.length < 4) {
      setRegError('A senha precisa ter no mínimo 4 caracteres.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const result = registerNewTeacher({
        name: regName,
        email: regEmail,
        password: regPassword,
        subject: regSubject,
        department: regDepartment,
        avatarUrl: selectedAvatarUrl,
      });

      setIsLoading(false);

      if (result.success && result.user) {
        setRegSuccess(true);
        setTimeout(() => {
          onLoginSuccess(result.user!);
        }, 700);
      } else {
        setRegError(result.error || 'Não foi possível concluir o cadastro.');
      }
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col justify-between p-4 sm:p-6 md:p-10 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Academic Banner */}
      <div className="max-w-4xl mx-auto w-full mb-4">
        <div className="p-3 bg-white border border-slate-200/90 rounded-2xl shadow-xs text-xs text-[#16324F] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-[#16324F]">EduGestão — Sistema Integrado de Gestão Escolar</span>
              <span className="block text-[11px] text-[#64748B]">
                Autenticação RBAC · Acesso restrito para Direção e Corpo Docente
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded-md border border-blue-100">
              TCC Acadêmico
            </span>
          </div>
        </div>
      </div>

      {/* Main Authentication Card */}
      <div className="relative w-full max-w-lg mx-auto bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-8 my-auto">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#16324F] text-white shadow-md mb-3 ring-4 ring-blue-50">
            <GraduationCap className="w-7 h-7 text-[#2563EB]" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#16324F]">
            EduGestão
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            Sistema Integrado de Gestão Escolar
          </p>
        </div>

        {/* Tab switch: Entrar vs Criar Cadastro de Professor */}
        <div className="p-1 bg-[#EFF6FF] rounded-2xl border border-blue-100 mb-6 flex items-center">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'login'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#16324F]'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Acessar o Sistema</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('register');
              setRegError(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'register'
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'text-[#64748B] hover:text-[#16324F]'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Cadastrar Professor</span>
          </button>
        </div>

        {/* TAB 1: LOGIN */}
        {activeTab === 'login' && (
          <div className="space-y-4">
            {/* Dedicated Box: Diretoria Geral (Acesso Pré-definido Oficial) */}
            <div className="p-3.5 bg-gradient-to-r from-blue-50/80 to-slate-50 rounded-2xl border border-blue-100/90 shadow-2xs">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#2563EB]" />
                  <span className="text-xs font-bold text-[#16324F]">
                    Diretoria Geral (Acesso Pré-definido)
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                  Acesso Total
                </span>
              </div>
              <p className="text-[11px] text-[#64748B] leading-relaxed mb-2.5">
                Acesso institucional fixo da <strong>Dra. Helena Martins</strong> para controle de agendamentos, bloqueios prioritários e gestão pedagógica.
              </p>
              <button
                type="button"
                onClick={fillDirectorCredentials}
                className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-bold text-[#16324F] bg-white hover:bg-blue-50/60 rounded-xl border border-blue-200 transition-colors shadow-2xs"
              >
                <span>Usar Credenciais da Diretoria (1 Clique)</span>
              </button>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[#DC2626] text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div>
                <label className="block text-[#16324F] font-bold mb-1.5">
                  E-mail Institucional *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ex: diretora@edugestao.demo ou professor@escola.br"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl py-2.5 pl-10 pr-3 text-xs text-[#16324F] focus:outline-[#2563EB] focus:ring-2 focus:ring-blue-100 font-mono transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[#16324F] font-bold">Senha de Acesso *</label>
                  <span className="text-[11px] text-[#2563EB] hover:underline cursor-pointer font-medium">
                    Esqueceu a senha?
                  </span>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#64748B] absolute left-3.5 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl py-2.5 pl-10 pr-10 text-xs text-[#16324F] focus:outline-[#2563EB] focus:ring-2 focus:ring-blue-100 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                    title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 text-[#64748B]" />
                    ) : (
                      <Eye className="w-4 h-4 text-[#64748B]" />
                    )}
                  </button>
                </div>
              </div>

              {/* Lembrar de mim */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-[#16324F]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded text-[#2563EB] focus:ring-[#2563EB] border-slate-300 w-4 h-4"
                  />
                  <span className="font-medium">Lembrar de mim neste dispositivo</span>
                </label>
              </div>

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando credenciais...</span>
                  </>
                ) : (
                  <>
                    <span>Entrar no EduGestão</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Se houver professores cadastrados, lista rápida de teste */}
            {storedTeachers.length > 0 && (
              <div className="pt-3 border-t border-slate-100">
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block mb-2">
                  Professores Cadastrados no Sistema ({storedTeachers.length}):
                </span>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {storedTeachers.map((prof) => (
                    <button
                      key={prof.id}
                      type="button"
                      onClick={() => fillTeacherCredentials(prof)}
                      className="w-full flex items-center justify-between p-2 rounded-xl bg-[#F5F7FB] hover:bg-blue-50/70 border border-slate-200/80 transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 overflow-hidden">
                        <img
                          src={prof.avatarUrl}
                          alt={prof.name}
                          className="w-6 h-6 rounded-full object-cover border border-[#2563EB]"
                        />
                        <div className="truncate">
                          <span className="font-bold text-[#16324F] block text-[11px] truncate leading-tight">
                            {prof.name}
                          </span>
                          <span className="text-[10px] text-[#64748B] block truncate">
                            {prof.subjects?.[0] || 'Docente'} · {prof.email}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-semibold text-[#2563EB] shrink-0">
                        Selecionar
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: REGISTER TEACHER */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div className="p-3 bg-[#EFF6FF] border border-blue-200 rounded-2xl text-[#16324F] text-[11px] leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>Criação de Login Individual para Professores</span>
              </div>
              Cada educador cria seu login personalizado para solicitar recursos pedagógicos, agendar DataShows e registrar diários de classe.
            </div>

            {regError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[#DC2626] text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-[#DC2626]" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-3 bg-green-50 border border-green-300 rounded-xl text-[#16A34A] text-xs flex items-center gap-2 font-semibold">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-[#16A34A]" />
                <span>Cadastro realizado com sucesso! Redirecionando...</span>
              </div>
            )}

            <div>
              <label className="block text-[#16324F] font-bold mb-1">
                Nome Completo do Docente *
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Ex: Prof. Jorge Manoel da Silva"
                className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB] focus:ring-2 focus:ring-blue-100"
              />
            </div>

            <div>
              <label className="block text-[#16324F] font-bold mb-1">
                E-mail Institucional *
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="ex: jorge.silva@escola.edu.br"
                className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB] focus:ring-2 focus:ring-blue-100 font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Disciplina Principal *
                </label>
                <select
                  value={regSubject}
                  onChange={(e) => setRegSubject(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                >
                  <option value="Matemática">Matemática</option>
                  <option value="Física">Física</option>
                  <option value="Química">Química</option>
                  <option value="Biologia">Biologia</option>
                  <option value="História">História</option>
                  <option value="Geografia">Geografia</option>
                  <option value="Língua Portuguesa">Língua Portuguesa</option>
                  <option value="Robótica STEM">Robótica STEM</option>
                  <option value="Artes">Artes</option>
                  <option value="Educação Física">Educação Física</option>
                </select>
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Departamento
                </label>
                <select
                  value={regDepartment}
                  onChange={(e) => setRegDepartment(e.target.value)}
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                >
                  <option value="Ciências Exatas e Tecnológicas">Exatas e Tecnologia</option>
                  <option value="Ciências Humanas e Sociais">Ciências Humanas</option>
                  <option value="Ciências da Natureza">Ciências da Natureza</option>
                  <option value="Linguagens e Códigos">Linguagens e Códigos</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Senha *
                </label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="Mínimo 4 dígitos"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  required
                  value={regPasswordConfirm}
                  onChange={(e) => setRegPasswordConfirm(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || regSuccess}
              className="w-full mt-2 py-3 px-4 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Cadastrar e Acessar Painel Docente</span>
                </>
              )}
            </button>
          </form>
        )}
      </div>

      {/* Footer */}
      <div className="text-center text-[11px] text-[#64748B] mt-6">
        EduGestão — Sistema Integrado de Gestão Escolar · Projeto Acadêmico de Conclusão de Curso (TCC)
      </div>
    </div>
  );
};
