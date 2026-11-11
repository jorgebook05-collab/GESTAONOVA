import React from 'react';
import { 
  Building2, 
  CalendarPlus, 
  Menu,
  LogOut,
  Clock
} from 'lucide-react';
import { User } from '../../types';

interface HeaderProps {
  currentUser: User;
  onOpenNewBookingModal: () => void;
  onToggleSidebar: () => void;
  activeTab: string;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onOpenNewBookingModal,
  onToggleSidebar,
  activeTab,
  onLogout,
}) => {
  const isDirection = currentUser.role === 'direction';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3.5 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Zone 1: Brand Wordmark */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onToggleSidebar}
          className="md:hidden p-1.5 -ml-1 text-[#64748B] hover:text-[#16324F] rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="Abrir menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#2563EB] to-blue-400 text-white flex items-center justify-center shadow-xs">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-base font-extrabold tracking-tight text-[#16324F] whitespace-nowrap">
                EduGestão
              </span>
              <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-1.5 py-0.5 rounded border border-blue-200 uppercase">
                {isDirection ? 'Diretoria' : 'Docente'}
              </span>
            </div>
            <span className="text-[11px] text-[#64748B] block -mt-0.5">Sistema Integrado de Gestão Escolar</span>
          </div>
        </div>
      </div>

      {/* Zone 2: Navigation / Breadcrumbs context */}
      <div className="hidden lg:flex items-center gap-2 text-xs text-[#64748B] whitespace-nowrap">
        <span>EduGestão</span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="font-medium text-[#16324F] capitalize">
          {isDirection ? 'Diretoria Geral' : 'Espaço Docente'}
        </span>
        <span aria-hidden="true" className="text-slate-300">/</span>
        <span className="font-bold text-[#2563EB] capitalize">
          {activeTab.replace('_', ' ')}
        </span>
      </div>

      {/* Zone 3: Primary Action + User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onOpenNewBookingModal}
          className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs hover:shadow transition-all whitespace-nowrap cursor-pointer"
        >
          <CalendarPlus className="w-3.5 h-3.5" />
          <span>{isDirection ? 'Novo Bloqueio Prioritário' : 'Solicitar Reserva'}</span>
        </button>

        {/* User Mini Profile */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover border border-[#2563EB] shadow-2xs"
            referrerPolicy="no-referrer"
          />
          <div className="hidden xl:block text-left">
            <span className="text-xs font-bold text-[#16324F] block leading-tight">
              {currentUser.name}
            </span>
            <span className="text-[10px] text-[#64748B] block leading-tight font-medium">
              {isDirection ? 'Diretora Pedagógica' : 'Professor'}
            </span>
          </div>

          <button
            onClick={onLogout}
            title="Encerrar sessão"
            className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-rose-50 rounded-xl transition-colors ml-1 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
