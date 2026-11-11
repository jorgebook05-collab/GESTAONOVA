import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  LayoutDashboard, 
  CalendarDays, 
  Laptop, 
  Users, 
  FileSpreadsheet, 
  Bell, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  Search, 
  Menu, 
  X, 
  BookmarkCheck, 
  Clock, 
  BookMarked, 
  ShieldCheck, 
  BookOpen,
  CalendarPlus,
  CheckCircle2,
  Database,
  SlidersHorizontal,
  ChevronDown,
  FolderGit2,
  Sparkles
} from 'lucide-react';
import { User, Role, Announcement, Resource, SchoolClass } from '../../types';
import { CommandPalette } from '../common/CommandPalette';
import { GitHubExportModal } from '../common/GitHubExportModal';

interface AppLayoutProps {
  currentUser: User;
  currentRole: Role;
  activePath: string;
  onNavigate: (path: string) => void;
  onLogout: () => void;
  announcements: Announcement[];
  resources?: Resource[];
  classes?: SchoolClass[];
  onOpenBookingModal?: (initialDate?: string, initialResourceId?: string) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentUser,
  currentRole,
  activePath,
  onNavigate,
  onLogout,
  announcements,
  resources = [],
  classes = [],
  onOpenBookingModal = () => {},
  children,
}) => {
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [isMobileOpen, setIsMobileOpen] = useState<boolean>(false);
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);

  // Command Palette & GitHub Modals
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  const isDirector = currentRole === 'direction';

  // Global Keyboard Shortcut: ⌘K or Ctrl+K for Spotlight search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Navigation Links for Director
  const directorNavItems = [
    { path: '/diretor/dashboard', label: 'Painel Executivo', icon: LayoutDashboard },
    { path: '/diretor/agendamentos', label: 'Central de Reservas', icon: CalendarDays },
    { path: '/diretor/equipamentos', label: 'Equipamentos & Recursos', icon: Laptop },
    { path: '/diretor/turmas-professores', label: 'Turmas & Grade Master', icon: Users },
    { path: '/diretor/comunicados', label: 'Mural Institucional', icon: Bell },
    { path: '/diretor/relatorios', label: 'Relatórios & Auditoria', icon: FileSpreadsheet },
    { path: '/diretor/arquitetura', label: 'Esquema de Banco (TCC)', icon: Database },
  ];

  // Navigation Links for Teacher
  const teacherNavItems = [
    { path: '/professor/dashboard', label: 'Meu Painel Docente', icon: LayoutDashboard },
    { path: '/professor/reservar', label: 'Solicitar Equipamento', icon: CalendarPlus },
    { path: '/professor/minhas-reservas', label: 'Minhas Reservas', icon: BookmarkCheck },
    { path: '/professor/horarios', label: 'Grade de Aulas', icon: Clock },
    { path: '/professor/diario', label: 'Diário de Classe', icon: BookMarked },
    { path: '/professor/comunicados', label: 'Avisos da Direção', icon: Bell },
    { path: '/professor/arquitetura', label: 'Esquema de Banco (TCC)', icon: Database },
  ];

  const navItems = isDirector ? directorNavItems : teacherNavItems;

  const currentNav = navItems.find((item) => item.path === activePath);
  const pageTitle = currentNav?.label || 'EduGestão';
  const currentDateFormatted = 'Quarta-feira, 11 de Novembro de 2026';

  return (
    <div className="min-h-screen bg-[#F5F7FB] flex flex-col font-sans text-[#16324F] antialiased">
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden"
        />
      )}

      <div className="flex-1 flex w-full">
        {/* ======================================================== */}
        {/* SIDEBAR NAVIGATION (Executive Navy Architecture) */}
        {/* ======================================================== */}
        <aside
          className={`fixed md:sticky top-0 left-0 z-40 h-screen bg-gradient-to-b from-[#0e243b] via-[#16324F] to-[#0d1d2f] text-white flex flex-col justify-between transition-all duration-300 ease-in-out border-r border-slate-700/50 shadow-xl ${
            isMobileOpen
              ? 'translate-x-0 w-64'
              : '-translate-x-full md:translate-x-0'
          } ${isCollapsed ? 'md:w-20' : 'md:w-64'}`}
        >
          <div className="flex flex-col">
            {/* Logo Bar */}
            <div className="flex items-center justify-between p-4.5 border-b border-white/10">
              <div
                onClick={() => onNavigate(isDirector ? '/diretor/dashboard' : '/professor/dashboard')}
                className="flex items-center gap-3 cursor-pointer overflow-hidden"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-400 text-white flex items-center justify-center shrink-0 shadow-md ring-2 ring-white/10">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                {!isCollapsed && (
                  <div className="truncate">
                    <span className="text-base font-extrabold tracking-tight text-white block">
                      EduGestão
                    </span>
                    <span className="text-[10px] text-blue-200/80 block -mt-0.5 font-medium tracking-wide">
                      Gestão Escolar Integrada
                    </span>
                  </div>
                )}
              </div>

              {/* Mobile Close Button */}
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden text-slate-300 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Profile Card inside Sidebar */}
            <div className={`p-3 m-3 rounded-2xl bg-white/[0.06] border border-white/10 backdrop-blur-md flex items-center gap-3 ${isCollapsed ? 'justify-center p-2 m-2' : ''}`}>
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.name}
                  className="w-10 h-10 rounded-full object-cover border-2 border-[#2563EB] shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#16A34A] ring-2 ring-[#16324F]" />
              </div>

              {!isCollapsed && (
                <div className="overflow-hidden">
                  <span className="text-xs font-bold text-white block truncate leading-tight">
                    {currentUser.name}
                  </span>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-md inline-block leading-none ${
                      isDirector ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-[#2563EB] text-white font-medium'
                    }`}>
                      {isDirector ? 'Diretoria' : 'Docente'}
                    </span>
                    <span className="text-[10px] text-slate-300 truncate">
                      {isDirector ? 'Geral' : currentUser.subjects?.[0] || 'Professor'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Section */}
            <nav className="px-3 py-2 space-y-1.5 overflow-y-auto max-h-[calc(100vh-310px)]">
              {!isCollapsed && (
                <div className="px-3 pt-2 pb-1 text-[10px] font-bold text-slate-400/90 uppercase tracking-wider">
                  {isDirector ? 'Administração & Controle' : 'Painel do Educador'}
                </div>
              )}

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activePath === item.path;

                return (
                  <button
                    key={item.path}
                    onClick={() => {
                      onNavigate(item.path);
                      setIsMobileOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all text-left group relative ${
                      isActive
                        ? 'bg-gradient-to-r from-[#2563EB] to-blue-600 text-white shadow-md font-semibold'
                        : 'text-slate-300 hover:text-white hover:bg-white/[0.08]'
                    } ${isCollapsed ? 'justify-center px-0' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
                    )}
                    <Icon className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-blue-300'}`} />
                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </button>
                );
              })}

              {/* GitHub Export Button in Sidebar */}
              <button
                onClick={() => {
                  setIsGitHubModalOpen(true);
                  setIsMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold text-blue-200 hover:text-white hover:bg-blue-600/30 border border-blue-500/30 transition-all text-left group ${
                  isCollapsed ? 'justify-center px-0' : ''
                }`}
                title={isCollapsed ? 'Exportar para GitHub' : undefined}
              >
                <FolderGit2 className="w-4 h-4 shrink-0 text-blue-400 group-hover:scale-110 transition-transform" />
                {!isCollapsed && (
                  <div className="truncate">
                    <span className="block leading-tight font-extrabold text-white">Exportar p/ GitHub</span>
                    <span className="text-[10px] text-blue-300 block leading-tight font-medium">Instruções de envio TCC</span>
                  </div>
                )}
              </button>
            </nav>
          </div>

          {/* Sidebar Footer */}
          <div className="p-3 border-t border-white/10 space-y-2">
            {/* Collapse Button (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden md:flex w-full items-center justify-center gap-2 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] text-xs transition-colors"
              title={isCollapsed ? 'Expandir menu lateral' : 'Recolher menu lateral'}
            >
              {isCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <>
                  <ChevronLeft className="w-4 h-4" />
                  <span>Recolher Menu</span>
                </>
              )}
            </button>

            {/* Logout Button */}
            <button
              onClick={onLogout}
              className={`w-full flex items-center gap-2 p-2.5 rounded-xl text-rose-300 hover:text-white hover:bg-rose-500/20 text-xs font-medium transition-all ${
                isCollapsed ? 'justify-center' : ''
              }`}
              title="Encerrar sessão"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span>Sair do Sistema</span>}
            </button>
          </div>
        </aside>

        {/* ======================================================== */}
        {/* TOPBAR (Barra Superior Elegante com Busca e Exportação) */}
        {/* ======================================================== */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-4 px-4 md:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
            {/* Left Zone: Hamburger + Page Breadcrumb */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMobileOpen(true)}
                className="md:hidden p-2 text-slate-600 hover:text-[#16324F] rounded-xl hover:bg-slate-100"
                aria-label="Abrir navegação"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                  <span className="font-medium">EduGestão</span>
                  <span aria-hidden="true" className="text-slate-300">/</span>
                  <span className="capitalize">{isDirector ? 'Diretoria Geral' : 'Espaço Docente'}</span>
                </div>
                <h1 className="text-base font-extrabold tracking-tight text-[#16324F] leading-tight">
                  {pageTitle}
                </h1>
              </div>
            </div>

            {/* Center Zone: Interactive Command Palette Trigger */}
            <div 
              onClick={() => setIsCommandPaletteOpen(true)}
              className="hidden lg:flex items-center relative max-w-sm w-full cursor-pointer group"
            >
              <Search className="w-4 h-4 text-slate-400 group-hover:text-[#2563EB] absolute left-3 top-2.5 transition-colors" />
              <input
                type="text"
                readOnly
                placeholder="Pesquisar salas, DataShows, turmas ou ações..."
                className="w-full bg-[#F5F7FB] border border-slate-200/90 group-hover:border-blue-300 group-hover:bg-blue-50/30 rounded-xl py-2 pl-9 pr-14 text-xs text-[#16324F] cursor-pointer transition-all"
              />
              <span className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200 group-hover:text-[#2563EB] group-hover:border-blue-200">
                ⌘K
              </span>
            </div>

            {/* Right Zone: GitHub Export + Date + Notifications + User Avatar */}
            <div className="flex items-center gap-3 shrink-0">
              {/* GitHub Export Quick Action */}
              <button
                onClick={() => setIsGitHubModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#0F2036] hover:bg-[#16324F] text-white text-xs font-bold shadow-xs hover:shadow-md transition-all cursor-pointer border border-slate-700"
                title="Ver instruções e comandos de envio para o GitHub"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-blue-400" />
                <span className="hidden sm:inline">GitHub (TCC)</span>
              </button>

              {/* Formatted Date Badge */}
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-[#64748B] font-semibold bg-[#F5F7FB] px-3 py-1.5 rounded-xl border border-slate-200/80">
                <Clock className="w-3.5 h-3.5 text-[#2563EB]" />
                <span>{currentDateFormatted}</span>
              </div>

              {/* Notifications Icon with Popover */}
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 text-slate-600 hover:text-[#16324F] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
                  aria-label="Avisos institucionais"
                >
                  <Bell className="w-4 h-4" />
                  {announcements.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DC2626] ring-2 ring-white" />
                  )}
                </button>

                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-2">
                      <span className="font-extrabold text-[#16324F]">Mural Institucional</span>
                      <span className="text-[10px] text-[#2563EB] font-bold bg-[#EFF6FF] px-2 py-0.5 rounded-md">
                        {announcements.length} comunicados
                      </span>
                    </div>
                    <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                      {announcements.map((anc) => (
                        <div key={anc.id} className="p-3 rounded-2xl bg-[#F5F7FB] border border-slate-100 hover:border-slate-200 transition-colors">
                          <span className="font-bold text-[#16324F] block truncate">{anc.title}</span>
                          <p className="text-[11px] text-[#64748B] line-clamp-2 mt-0.5 leading-relaxed">{anc.content}</p>
                          <span className="text-[10px] text-slate-400 mt-1.5 block font-mono font-medium">{anc.createdAt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar & Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-[#2563EB] shadow-2xs"
                    referrerPolicy="no-referrer"
                  />
                  <div className="hidden xl:block text-left text-xs">
                    <span className="font-extrabold text-[#16324F] block leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-[#64748B] block leading-tight font-medium">
                      {isDirector ? 'Diretoria Geral' : 'Docente'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden xl:block" />
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-3xl shadow-2xl border border-slate-200 p-3.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="pb-3 border-b border-slate-100 mb-2.5">
                      <span className="font-extrabold text-[#16324F] block text-sm">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono block truncate mt-0.5">{currentUser.email}</span>
                      <span className="text-[10px] font-bold text-[#2563EB] uppercase mt-1.5 inline-block bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-100">
                        {isDirector ? 'Diretora Pedagógica' : 'Professor Autenticado'}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          onNavigate(isDirector ? '/diretor/dashboard' : '/professor/dashboard');
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-50 text-[#16324F] font-semibold flex items-center justify-between"
                      >
                        <span>Meu Dashboard</span>
                        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                      </button>
                      <button
                        onClick={() => {
                          setIsGitHubModalOpen(true);
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-blue-50 text-[#2563EB] font-bold flex items-center justify-between"
                      >
                        <span className="flex items-center gap-1.5">
                          <FolderGit2 className="w-3.5 h-3.5" />
                          <span>Exportar para GitHub</span>
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-blue-400" />
                      </button>
                      <button
                        onClick={() => {
                          onLogout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left p-2 rounded-xl hover:bg-rose-50 text-[#DC2626] font-bold flex items-center gap-2 mt-1 border-t border-slate-100 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Sair do Sistema</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* ======================================================== */}
          {/* MAIN PAGE CONTAINER */}
          {/* ======================================================== */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
            {children}
          </main>
        </div>
      </div>

      {/* Global Interactive Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        resources={resources}
        classes={classes}
        currentRole={currentRole}
        onNavigate={onNavigate}
        onOpenBookingModal={onOpenBookingModal}
        onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
      />

      {/* Global GitHub Export Modal */}
      <GitHubExportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />
    </div>
  );
};
