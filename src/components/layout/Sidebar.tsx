import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Clock,
  BellRing,
  FileSpreadsheet,
  Database,
  BookmarkCheck,
  BookMarked,
  UserCheck,
  Laptop,
  X
} from 'lucide-react';
import { User } from '../../types';

interface SidebarProps {
  currentUser: User;
  activeTab: string;
  onSelectTab: (tabId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  activeTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const isDirection = currentUser.role === 'direction';

  const directionItems = [
    { id: 'dashboard', label: 'Panorama Geral', icon: LayoutDashboard },
    { id: 'calendar', label: 'Central de Agendamentos', icon: CalendarDays },
    { id: 'master_schedule', label: 'Grade Master & Docentes', icon: Clock },
    { id: 'announcements', label: 'Mural de Avisos Globais', icon: BellRing },
    { id: 'reports', label: 'Relatórios Gerenciais', icon: FileSpreadsheet },
    { id: 'architecture', label: 'Arquitetura & Banco de Dados', icon: Database },
  ];

  const teacherItems = [
    { id: 'teacher_dashboard', label: 'Meu Painel Docente', icon: LayoutDashboard },
    { id: 'calendar', label: 'Agendar Recurso (Live)', icon: Laptop },
    { id: 'my_bookings', label: 'Meus Agendamentos', icon: BookmarkCheck },
    { id: 'teacher_schedule', label: 'Minha Grade Semanal', icon: Clock },
    { id: 'class_diary', label: 'Diário de Classe', icon: BookMarked },
    { id: 'announcements', label: 'Mural de Comunicados', icon: BellRing },
    { id: 'architecture', label: 'Arquitetura do Sistema', icon: Database },
  ];

  const items = isDirection ? directionItems : teacherItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header Mobile Close */}
          <div className="flex items-center justify-between p-4 border-b border-slate-100 md:hidden">
            <span className="text-sm font-bold text-[#16324F]">Menu Principal</span>
            <button
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-[#16324F] rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Role Card inside sidebar */}
          <div className="p-4 mx-3 mt-3 mb-2 rounded-2xl bg-[#F5F7FB] border border-slate-200/80">
            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-[#2563EB] shadow-2xs"
                referrerPolicy="no-referrer"
              />
              <div className="overflow-hidden">
                <span className="text-xs font-bold text-[#16324F] block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-[#2563EB] font-bold block truncate">
                  {currentUser.title}
                </span>
              </div>
            </div>

            <div className="mt-2.5 pt-2 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-[#64748B]">
              <span>Nível de Acesso:</span>
              <span className="font-bold text-[#16324F] uppercase tracking-wider text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                {isDirection ? 'Diretoria (Total)' : 'Professor (Docente)'}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            <div className="px-3 py-1 text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
              {isDirection ? 'Administração & Pedagógico' : 'Rotina Pedagógica'}
            </div>

            {items.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap text-left ${
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'text-[#64748B] hover:text-[#16324F] hover:bg-[#F5F7FB]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-slate-400'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* School System Status Info */}
        <div className="p-4 border-t border-slate-100">
          <div className="p-3 bg-[#F5F7FB] rounded-xl border border-slate-200/80 text-xs">
            <div className="flex items-center gap-2 text-[#16324F] font-bold mb-1">
              <UserCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Ano Letivo 2026 · Ativo</span>
            </div>
            <p className="text-[11px] text-[#64748B] leading-relaxed">
              Base oficial integrada com diário online e controle anti-conflito de salas.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
