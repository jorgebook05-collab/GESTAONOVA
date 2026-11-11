import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Laptop, 
  Calendar, 
  Users, 
  Clock, 
  BookMarked, 
  FileSpreadsheet, 
  Database, 
  FolderGit2, 
  ShieldAlert, 
  Plus, 
  X, 
  ArrowRight,
  GraduationCap,
  Sparkles,
  School
} from 'lucide-react';
import { Resource, SchoolClass, Role } from '../../types';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  resources: Resource[];
  classes: SchoolClass[];
  currentRole: Role;
  onNavigate: (path: string) => void;
  onOpenBookingModal: (initialDate?: string, initialResourceId?: string) => void;
  onOpenGitHubModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  resources,
  classes,
  currentRole,
  onNavigate,
  onOpenBookingModal,
  onOpenGitHubModal,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const isDirector = currentRole === 'direction';

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Command items pool
  const items = useMemo(() => {
    const list: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: 'Ações Rápidas' | 'Equipamentos & Recursos' | 'Turmas Escolares' | 'Navegação';
      icon: any;
      action: () => void;
    }> = [];

    // Quick Actions
    list.push({
      id: 'act-book',
      title: isDirector ? 'Novo Bloqueio Prioritário de Sala' : 'Solicitar Reserva de DataShow / Equipamento',
      subtitle: 'Validação de conflitos em 0ms com mapa de horários',
      category: 'Ações Rápidas',
      icon: isDirector ? ShieldAlert : Plus,
      action: () => {
        onClose();
        onOpenBookingModal();
      },
    });

    list.push({
      id: 'act-github',
      title: 'Exportar Projeto para o GitHub (TCC)',
      subtitle: 'Instruções de envio git, commit inicial e documentação README.md',
      category: 'Ações Rápidas',
      icon: FolderGit2,
      action: () => {
        onClose();
        onOpenGitHubModal();
      },
    });

    // Navigation items
    if (isDirector) {
      list.push(
        {
          id: 'nav-dir-dash',
          title: 'Painel Executivo da Diretoria',
          subtitle: 'Indicadores de governança, alunos e reservas de hoje',
          category: 'Navegação',
          icon: Users,
          action: () => {
            onClose();
            onNavigate('/diretor/dashboard');
          },
        },
        {
          id: 'nav-dir-bookings',
          title: 'Central de Reservas & Calendário Geral',
          subtitle: 'Visão mensal, semanal e deliberação de solicitações',
          category: 'Navegação',
          icon: Calendar,
          action: () => {
            onClose();
            onNavigate('/diretor/agendamentos');
          },
        },
        {
          id: 'nav-dir-equipment',
          title: 'Catálogo de Equipamentos & Manutenção',
          subtitle: '156 equipamentos catalogados e status de disponibilidade',
          category: 'Navegação',
          icon: Laptop,
          action: () => {
            onClose();
            onNavigate('/diretor/equipamentos');
          },
        },
        {
          id: 'nav-dir-reports',
          title: 'Relatórios Gerenciais & Exportação CSV',
          subtitle: 'Auditoria de salas, taxa de ocupação e download Excel',
          category: 'Navegação',
          icon: FileSpreadsheet,
          action: () => {
            onClose();
            onNavigate('/diretor/relatorios');
          },
        },
        {
          id: 'nav-dir-arch',
          title: 'Esquema de Banco de Dados PostgreSQL (TCC)',
          subtitle: 'Diagrama ERD, chaves estrangeiras e scripts SQL DDL',
          category: 'Navegação',
          icon: Database,
          action: () => {
            onClose();
            onNavigate('/diretor/arquitetura');
          },
        }
      );
    } else {
      list.push(
        {
          id: 'nav-prof-dash',
          title: 'Painel Docente Individual',
          subtitle: 'Minhas aulas de hoje e recursos confirmados',
          category: 'Navegação',
          icon: GraduationCap,
          action: () => {
            onClose();
            onNavigate('/professor/dashboard');
          },
        },
        {
          id: 'nav-prof-diary',
          title: 'Diário de Classe Simplificado',
          subtitle: 'Registro de conteúdo ministrado, faltas e avaliações',
          category: 'Navegação',
          icon: BookMarked,
          action: () => {
            onClose();
            onNavigate('/professor/diario');
          },
        },
        {
          id: 'nav-prof-schedule',
          title: 'Minha Grade Horária Semanal',
          subtitle: 'Horários de aula e salas fixadas no semestre',
          category: 'Navegação',
          icon: Clock,
          action: () => {
            onClose();
            onNavigate('/professor/horarios');
          },
        },
        {
          id: 'nav-prof-bookings',
          title: 'Minhas Reservas Solicitadas',
          subtitle: 'Acompanhamento do status de deliberação',
          category: 'Navegação',
          icon: Calendar,
          action: () => {
            onClose();
            onNavigate('/professor/minhas-reservas');
          },
        }
      );
    }

    // Resources items
    resources.forEach((r) => {
      list.push({
        id: `res-${r.id}`,
        title: r.name,
        subtitle: `${r.code} · ${r.location} (${r.status === 'available' ? 'Disponível' : r.status === 'in_use' ? 'Em Uso' : 'Manutenção'})`,
        category: 'Equipamentos & Recursos',
        icon: Laptop,
        action: () => {
          onClose();
          onOpenBookingModal(undefined, r.id);
        },
      });
    });

    // Classes items
    classes.forEach((c) => {
      list.push({
        id: `cls-${c.id}`,
        title: `Turma ${c.name}`,
        subtitle: `${c.gradeLevel} · ${c.period === 'manha' ? 'Manhã' : 'Tarde'} · ${c.totalStudents} alunos · Sala ${c.defaultRoom}`,
        category: 'Turmas Escolares',
        icon: School,
        action: () => {
          onClose();
          if (isDirector) {
            onNavigate('/diretor/turmas-professores');
          } else {
            onNavigate('/professor/diario');
          }
        },
      });
    });

    return list;
  }, [resources, classes, isDirector, onOpenBookingModal, onOpenGitHubModal, onNavigate, onClose]);

  // Filter based on query
  const filtered = useMemo(() => {
    if (!query.trim()) return items.slice(0, 8);
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
    );
  }, [items, query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filtered.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + (filtered.length || 1)) % (filtered.length || 1));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      filtered[selectedIndex].action();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-start justify-center pt-16 sm:pt-24 p-4 animate-in fade-in duration-150"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200/90 overflow-hidden text-xs text-[#16324F] flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100 bg-[#F5F7FB]">
          <Search className="w-5 h-5 text-[#2563EB] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Digite para buscar equipamentos, salas, turmas, ações ou GitHub..."
            className="w-full bg-transparent border-none text-sm font-semibold text-[#16324F] placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <span className="hidden sm:inline-block text-[10px] font-mono font-bold text-slate-400 bg-white px-2 py-0.5 rounded border border-slate-200">
            ESC
          </span>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-xs">Nenhum resultado encontrado para &quot;{query}&quot;</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Tente buscar por DataShow, Laboratório, Turma ou GitHub.</p>
            </div>
          ) : (
            filtered.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#EFF6FF] text-[#16324F] shadow-2xs border border-blue-200'
                      : 'hover:bg-slate-50 text-slate-700 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#2563EB] text-white'
                          : 'bg-slate-100 text-[#2563EB]'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs block truncate text-[#16324F]">
                          {item.title}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 bg-white px-1.5 py-0.2 rounded border border-slate-200 shrink-0">
                          {item.category}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#64748B] block truncate mt-0.5">
                        {item.subtitle}
                      </span>
                    </div>
                  </div>

                  <ArrowRight
                    className={`w-4 h-4 shrink-0 transition-transform ${
                      isSelected ? 'text-[#2563EB] translate-x-0.5' : 'text-slate-300'
                    }`}
                  />
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-5 py-3 border-t border-slate-100 bg-[#F5F7FB] flex items-center justify-between text-[11px] text-[#64748B]">
          <div className="flex items-center gap-3">
            <span>
              <strong className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 mr-1">↑↓</strong>
              Navegar
            </span>
            <span>
              <strong className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 mr-1">↵</strong>
              Executar
            </span>
            <span>
              <strong className="font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-200 mr-1">ESC</strong>
              Fechar
            </span>
          </div>
          <span className="font-bold text-[#2563EB]">EduGestão Spotlight</span>
        </div>
      </div>
    </div>
  );
};
