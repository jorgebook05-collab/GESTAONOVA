import React from 'react';
import { 
  CalendarDays, 
  Clock, 
  Laptop, 
  BookMarked, 
  BellRing, 
  Plus, 
  CheckCircle2, 
  MapPin,
  ArrowRight,
  Sparkles,
  CalendarCheck,
  Building2
} from 'lucide-react';
import { User, Booking, Resource, MasterScheduleItem, Announcement } from '../../types';
import { StatsCard } from '../common/StatsCard';

interface TeacherDashboardProps {
  currentUser: User;
  bookings: Booking[];
  resources: Resource[];
  scheduleItems: MasterScheduleItem[];
  announcements: Announcement[];
  onOpenBookingModal: () => void;
  onNavigateTab: (tab: string) => void;
}

export const TeacherDashboard: React.FC<TeacherDashboardProps> = ({
  currentUser,
  bookings,
  resources,
  scheduleItems,
  announcements,
  onOpenBookingModal,
  onNavigateTab,
}) => {
  // Aulas de hoje do professor (Hoje = Terça-feira / dia 2)
  const todayClasses = scheduleItems
    .filter((s) => s.teacherId === currentUser.id && s.dayOfWeek === 2)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  // Meus agendamentos
  const myBookings = bookings.filter((b) => b.userId === currentUser.id);
  const myApprovedBookings = myBookings.filter((b) => b.status === 'approved');

  return (
    <div className="space-y-6">
      {/* Welcome Banner - Deep Navy & Royal Blue Aesthetic */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#0F2036] via-[#16324F] to-[#1E3A5F] text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-white/10">
        <div className="absolute -right-16 -top-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-48 -bottom-16 w-60 h-60 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 text-blue-200 text-xs font-semibold backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>Espaço Docente Individual · Terça-feira, 20 de Outubro de 2026</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              Olá, {currentUser.name}!
            </h1>
            <p className="text-slate-300 text-xs md:text-sm max-w-xl leading-relaxed">
              Você tem {todayClasses.length} aulas programadas para hoje e {myApprovedBookings.length} recursos multimídia confirmados.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={onOpenBookingModal}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all hover:scale-[1.02] cursor-pointer"
            >
              <Laptop className="w-4 h-4" />
              <span>Solicitar Equipamento / DataShow</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Aulas Programadas Hoje"
          value={todayClasses.length}
          subtitle="Terça-feira (Manhã e Tarde)"
          icon={Clock}
          variant="blue"
        />
        <StatsCard
          title="Recursos Confirmados"
          value={myApprovedBookings.length}
          subtitle="DataShows e Salas no mês"
          icon={CalendarCheck}
          variant="green"
        />
        <StatsCard
          title="Comunicados da Direção"
          value={announcements.length}
          subtitle="Avisos oficiais em aberto"
          icon={BellRing}
          variant="navy"
        />
      </div>

      {/* 2-Column Split: Aulas de Hoje & Próximas Reservas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aulas de Hoje */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#16324F]">
                  Minha Grade Horária de Hoje
                </h2>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-100">
                Terça-feira
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {todayClasses.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  Nenhuma aula agendada para hoje.
                </div>
              ) : (
                todayClasses.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-[#F5F7FB] hover:bg-blue-50/40 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 text-center">
                        <span className="text-xs font-mono font-bold text-[#16324F] block">
                          {item.startTime}
                        </span>
                        <span className="text-[10px] text-[#64748B] font-mono block">
                          {item.endTime}
                        </span>
                      </div>
                      <div className="h-8 w-px bg-slate-200" />
                      <div>
                        <span className="text-xs font-bold text-[#16324F] block">
                          {item.subject}
                        </span>
                        <span className="text-[11px] text-[#64748B] flex items-center gap-1.5 mt-0.5">
                          <span className="font-semibold text-[#2563EB]">{item.className}</span>
                          <span>•</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {item.room}
                          </span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTab('/professor/diario')}
                      className="px-2.5 py-1 text-[11px] font-bold text-[#2563EB] hover:text-[#1D4ED8] bg-white hover:bg-blue-50 rounded-lg border border-blue-200 transition-colors shrink-0 shadow-2xs"
                    >
                      Diário
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <button
            onClick={() => onNavigateTab('/professor/horarios')}
            className="w-full mt-4 py-2.5 text-xs font-bold text-[#16324F] hover:text-[#2563EB] bg-[#F5F7FB] hover:bg-blue-50/70 rounded-xl border border-slate-200/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Ver Grade Semanal Completa</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Minhas Reservas Recentes */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-[#2563EB]" />
                <h2 className="text-sm font-bold text-[#16324F]">
                  Minhas Reservas de Equipamentos
                </h2>
              </div>
              <button
                onClick={() => onNavigateTab('/professor/minhas-reservas')}
                className="text-xs text-[#2563EB] hover:underline font-bold flex items-center gap-1"
              >
                <span>Ver todas</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {myBookings.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#64748B]">
                  Você ainda não possui solicitações de agendamento.
                </div>
              ) : (
                myBookings.slice(0, 3).map((booking) => {
                  const res = resources.find((r) => r.id === booking.resourceId);
                  return (
                    <div
                      key={booking.id}
                      className="p-3.5 rounded-xl border border-slate-200/80 bg-[#F5F7FB] flex items-center justify-between gap-3"
                    >
                      <div className="overflow-hidden">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#16324F] truncate">
                            {res?.name || 'Equipamento'}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              booking.status === 'approved'
                                ? 'bg-green-100 text-[#16A34A]'
                                : booking.status === 'pending'
                                ? 'bg-amber-100 text-[#EAB308]'
                                : 'bg-red-100 text-[#DC2626]'
                            }`}
                          >
                            {booking.status === 'approved'
                              ? 'Aprovado'
                              : booking.status === 'pending'
                              ? 'Aguardando Aprovação'
                              : 'Recusado'}
                          </span>
                        </div>
                        <p className="text-[11px] text-[#64748B] mt-0.5 truncate">
                          {booking.date} · {booking.startTime} às {booking.endTime}
                        </p>
                      </div>

                      {booking.className && (
                        <span className="text-[11px] font-semibold text-[#16324F] bg-white px-2 py-1 rounded-md border border-slate-200 shrink-0">
                          {booking.className}
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <button
            onClick={onOpenBookingModal}
            className="w-full mt-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nova Solicitação de Agendamento</span>
          </button>
        </div>
      </div>
    </div>
  );
};
