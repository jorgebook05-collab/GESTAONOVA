import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  MapPin, 
  Layers,
  X
} from 'lucide-react';
import { Booking, Resource, User } from '../../types';

interface InteractiveCalendarProps {
  bookings: Booking[];
  resources: Resource[];
  currentUser: User;
  onOpenBookingModal: (initialDate?: string, initialResourceId?: string) => void;
  onApproveBooking: (id: string) => void;
  onRejectBooking: (id: string, reason?: string) => void;
  onCancelBooking: (id: string) => void;
}

type CalendarView = 'month' | 'week' | 'day';

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  bookings,
  resources,
  currentUser,
  onOpenBookingModal,
  onApproveBooking,
  onRejectBooking,
  onCancelBooking,
}) => {
  const isDirection = currentUser.role === 'direction';
  const [view, setView] = useState<CalendarView>('month');
  
  // Base date: 2026-10-20 (Tuesday)
  const [selectedDate, setSelectedDate] = useState<string>('2026-10-20');
  const [resourceFilter, setResourceFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeBookingDetail, setActiveBookingDetail] = useState<Booking | null>(null);

  // Month days generator for October 2026
  // October 2026 starts on Thursday (1st), has 31 days
  const monthDays = useMemo(() => {
    const days = [];
    // Padding for Sunday to Wednesday (4 empty days before Oct 1)
    for (let i = 0; i < 4; i++) {
      days.push({ dayNumber: null, dateStr: null });
    }
    for (let d = 1; d <= 31; d++) {
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      days.push({
        dayNumber: d,
        dateStr: `2026-10-${dayStr}`,
        isToday: d === 20,
      });
    }
    return days;
  }, []);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchResource = resourceFilter === 'all' || b.resourceId === resourceFilter;
      const matchStatus = statusFilter === 'all' || b.status === statusFilter;
      return matchResource && matchStatus;
    });
  }, [bookings, resourceFilter, statusFilter]);

  // Bookings grouped by date
  const bookingsByDate = useMemo(() => {
    const map = new Map<string, Booking[]>();
    filteredBookings.forEach((b) => {
      const current = map.get(b.date) || [];
      current.push(b);
      map.set(b.date, current);
    });
    return map;
  }, [filteredBookings]);

  // Bookings for selected date (Day / Detail view)
  const dayBookings = useMemo(() => {
    return filteredBookings
      .filter((b) => b.date === selectedDate)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }, [filteredBookings, selectedDate]);

  // Week days for current week (October 19 to 23, 2026 - Segunda a Sexta)
  const weekDays = [
    { name: 'Segunda-feira', dateStr: '2026-10-19', dayNumber: 19 },
    { name: 'Terça-feira (Hoje)', dateStr: '2026-10-20', dayNumber: 20, isToday: true },
    { name: 'Quarta-feira', dateStr: '2026-10-21', dayNumber: 21 },
    { name: 'Quinta-feira', dateStr: '2026-10-22', dayNumber: 22 },
    { name: 'Sexta-feira', dateStr: '2026-10-23', dayNumber: 23 },
  ];

  return (
    <div className="space-y-5">
      {/* Top Calendar Toolbar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <CalendarIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F] flex items-center gap-2.5">
              <span>Central de Agendamentos & Recursos</span>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-200">
                Outubro 2026
              </span>
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Controle unificado de DataShows, Laboratórios STEM, Auditório e Kits de Mídia
            </p>
          </div>
        </div>

        {/* View Switcher & Action */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Segmented View Mode */}
          <div className="flex items-center p-1 bg-[#F5F7FB] rounded-xl border border-slate-200">
            <button
              onClick={() => setView('month')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                view === 'month'
                  ? 'bg-white text-[#16324F] shadow-xs'
                  : 'text-[#64748B] hover:text-[#16324F]'
              }`}
            >
              Mês
            </button>
            <button
              onClick={() => setView('week')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                view === 'week'
                  ? 'bg-white text-[#16324F] shadow-xs'
                  : 'text-[#64748B] hover:text-[#16324F]'
              }`}
            >
              Semana
            </button>
            <button
              onClick={() => setView('day')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                view === 'day'
                  ? 'bg-white text-[#16324F] shadow-xs'
                  : 'text-[#64748B] hover:text-[#16324F]'
              }`}
            >
              Dia
            </button>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={() => onOpenBookingModal(selectedDate)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isDirection ? 'Nova Reserva / Bloqueio' : 'Nova Solicitação'}</span>
          </button>
        </div>
      </div>

      {/* Filter Strip */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs space-y-3 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            {/* Quick Category Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setResourceFilter('all')}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  resourceFilter === 'all'
                    ? 'bg-[#16324F] text-white shadow-xs'
                    : 'bg-[#F5F7FB] text-[#64748B] hover:text-[#16324F] hover:bg-slate-200/70 border border-slate-200'
                }`}
              >
                Todos Recursos
              </button>
              {resources.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setResourceFilter(r.id)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    resourceFilter === r.id
                      ? 'bg-[#2563EB] text-white shadow-xs'
                      : 'bg-[#F5F7FB] text-[#64748B] hover:text-[#16324F] hover:bg-slate-200/70 border border-slate-200'
                  }`}
                >
                  {r.code} · {r.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Jump to today */}
          <button
            type="button"
            onClick={() => setSelectedDate('2026-10-20')}
            className="px-3 py-1 text-xs font-bold text-[#2563EB] bg-[#EFF6FF] hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors cursor-pointer shrink-0"
          >
            📍 Ir para Hoje (20/10)
          </button>
        </div>

        <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-[#64748B] font-semibold">
              <span>Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-2.5 py-1 text-[#16324F] font-bold text-xs focus:outline-[#2563EB]"
              >
                <option value="all">Todos os status</option>
                <option value="approved">Aprovados</option>
                <option value="pending">Pendentes</option>
                <option value="cancelled">Cancelados</option>
              </select>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3.5 text-[11px] font-semibold text-[#64748B]">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] inline-block" />
              <span>Aprovado</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#2563EB] inline-block" />
              <span>Bloqueio Direção</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#EAB308] inline-block" />
              <span>Pendente</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calendar Views */}
      {view === 'month' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          {/* Header weekdays */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-[#F5F7FB] text-center text-xs font-bold text-[#16324F] py-3 uppercase tracking-wider text-[11px]">
            <div>Dom</div>
            <div>Seg</div>
            <div>Ter</div>
            <div>Qua</div>
            <div>Qui</div>
            <div>Sex</div>
            <div>Sáb</div>
          </div>

          {/* Month Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 min-h-[540px]">
            {monthDays.map((cell, idx) => {
              if (!cell.dayNumber) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="bg-[#F5F7FB]/40 p-2 min-h-[95px]"
                  />
                );
              }

              const dayList = bookingsByDate.get(cell.dateStr || '') || [];
              const isSelected = selectedDate === cell.dateStr;

              return (
                <div
                  key={cell.dateStr}
                  onClick={() => setSelectedDate(cell.dateStr || '2026-10-20')}
                  className={`p-2.5 transition-colors cursor-pointer relative min-h-[100px] flex flex-col justify-between ${
                    isSelected
                      ? 'bg-blue-50/60 ring-2 ring-inset ring-[#2563EB]'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-extrabold tabular-nums ${
                        cell.isToday
                          ? 'w-6 h-6 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold'
                          : 'text-[#16324F]'
                      }`}
                    >
                      {cell.dayNumber}
                    </span>

                    {dayList.length > 0 && (
                      <span className="text-[10px] text-[#64748B] tabular-nums font-semibold">
                        {dayList.length} res.
                      </span>
                    )}
                  </div>

                  {/* Day Bookings Preview */}
                  <div className="mt-1.5 space-y-1 overflow-hidden max-h-[64px]">
                    {dayList.slice(0, 2).map((b) => {
                      const res = resources.find((r) => r.id === b.resourceId);
                      return (
                        <div
                          key={b.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveBookingDetail(b);
                          }}
                          className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold truncate transition-opacity hover:opacity-80 ${
                            b.isPriorityLock
                              ? 'bg-blue-100 text-[#16324F] border border-blue-300'
                              : b.status === 'pending'
                              ? 'bg-amber-100 text-amber-950 border border-amber-200'
                              : 'bg-green-100 text-[#16A34A] border border-green-200'
                          }`}
                        >
                          <span className="font-mono text-[9px] mr-1">{b.startTime}</span>
                          {res?.code || 'Recurso'} - {b.userName}
                        </div>
                      );
                    })}

                    {dayList.length > 2 && (
                      <span className="text-[10px] text-[#2563EB] font-bold block text-center">
                        +{dayList.length - 2} outros
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Week View */}
      {view === 'week' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-slate-200">
            {weekDays.map((wd) => {
              const list = bookingsByDate.get(wd.dateStr) || [];
              return (
                <div key={wd.dateStr} className="p-4 flex flex-col min-h-[460px]">
                  <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold text-[#16324F] block">
                        {wd.name}
                      </span>
                      <span className="text-[11px] text-[#64748B] font-mono">
                        {wd.dateStr}
                      </span>
                    </div>
                    {wd.isToday && (
                      <span className="text-[10px] font-bold text-[#2563EB] bg-[#EFF6FF] px-2 py-0.5 rounded-md border border-blue-200">
                        Hoje
                      </span>
                    )}
                  </div>

                  <div className="mt-3.5 space-y-2.5 flex-1">
                    {list.length === 0 ? (
                      <div className="h-full flex items-center justify-center text-center text-xs text-[#64748B] py-12">
                        Nenhum agendamento para este dia
                      </div>
                    ) : (
                      list.map((b) => {
                        const res = resources.find((r) => r.id === b.resourceId);
                        return (
                          <div
                            key={b.id}
                            onClick={() => setActiveBookingDetail(b)}
                            className={`p-3 rounded-xl border cursor-pointer hover:shadow-xs transition-all ${
                              b.isPriorityLock
                                ? 'bg-blue-50 border-blue-300 text-[#16324F]'
                                : b.status === 'pending'
                                ? 'bg-amber-50 border-amber-200 text-amber-950'
                                : 'bg-green-50 border-green-200 text-[#16A34A]'
                            }`}
                          >
                            <div className="flex items-center justify-between text-[11px] font-bold mb-1">
                              <span className="font-mono">
                                {b.startTime} - {b.endTime}
                              </span>
                              {b.isPriorityLock && (
                                <span className="text-[9px] bg-[#16324F] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                                  PRIORIDADE
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-bold text-[#16324F] block truncate">
                              {res?.name}
                            </span>
                            <span className="text-[11px] text-[#64748B] block mt-0.5 truncate">
                              {b.userName} · {b.className || 'Uso Geral'}
                            </span>
                          </div>
                        );
                      })
                    )}
                  </div>

                  <button
                    onClick={() => onOpenBookingModal(wd.dateStr)}
                    className="w-full mt-3 py-2 text-xs font-bold text-[#2563EB] hover:bg-blue-50 border border-dashed border-blue-200 rounded-xl flex items-center justify-center gap-1 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Reservar dia</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Day View */}
      {view === 'day' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
          <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-200 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-extrabold text-[#16324F]">
                  Agenda Detalhada do Dia
                </h2>
                <span className="font-mono text-xs bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded-md border border-blue-200 font-bold">
                  {selectedDate}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                Linha do tempo de recursos, horários de aula e ocupação
              </p>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#16324F] font-mono"
              />
              <button
                onClick={() => onOpenBookingModal(selectedDate)}
                className="px-4 py-2 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar para esta data</span>
              </button>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            {dayBookings.length === 0 ? (
              <div className="text-center py-12 text-[#64748B] text-xs">
                Nenhum agendamento marcado para esta data. Todos os recursos estão 100% disponíveis!
              </div>
            ) : (
              dayBookings.map((b) => {
                const res = resources.find((r) => r.id === b.resourceId);
                return (
                  <div
                    key={b.id}
                    className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] hover:bg-slate-100 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-white border border-slate-200 text-[#2563EB] shrink-0 font-mono text-xs font-bold text-center">
                        <div>{b.startTime}</div>
                        <div className="text-[10px] text-[#64748B]">às</div>
                        <div>{b.endTime}</div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-extrabold text-[#16324F]">
                            {res?.name}
                          </span>
                          {b.isPriorityLock && (
                            <span className="text-[10px] font-bold text-[#16324F] bg-blue-100 px-2 py-0.5 rounded-md border border-blue-200">
                              BLOQUEIO PRIORITÁRIO
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                              b.status === 'approved'
                                ? 'bg-green-100 text-[#16A34A]'
                                : b.status === 'pending'
                                ? 'bg-amber-100 text-[#EAB308]'
                                : 'bg-red-100 text-[#DC2626]'
                            }`}
                          >
                            {b.status === 'approved' ? 'Aprovado' : b.status === 'pending' ? 'Pendente' : 'Cancelado'}
                          </span>
                        </div>

                        <p className="text-xs text-[#16324F] mt-1 font-medium">
                          {b.purpose}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] text-[#64748B] mt-1">
                          <span>Responsável: <strong>{b.userName}</strong></span>
                          {b.className && (
                            <>
                              <span aria-hidden="true">·</span>
                              <span>Turma: <strong>{b.className}</strong></span>
                            </>
                          )}
                          <span aria-hidden="true">·</span>
                          <span>Local: {res?.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions for Direction or Owner */}
                    <div className="flex items-center gap-2 shrink-0">
                      {isDirection && b.status === 'pending' && (
                        <>
                          <button
                            onClick={() => onRejectBooking(b.id, 'Recusado pela Diretoria.')}
                            className="px-3 py-1.5 text-xs font-bold text-[#DC2626] hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                          >
                            Recusar
                          </button>
                          <button
                            onClick={() => onApproveBooking(b.id)}
                            className="px-3.5 py-1.5 text-xs font-bold text-white bg-[#16A34A] hover:bg-green-700 rounded-xl transition-colors cursor-pointer"
                          >
                            Aprovar
                          </button>
                        </>
                      )}

                      {(isDirection || b.userId === currentUser.id) && b.status !== 'cancelled' && (
                        <button
                          onClick={() => onCancelBooking(b.id)}
                          className="px-3 py-1.5 text-xs font-bold text-[#DC2626] hover:bg-red-50 border border-red-200 rounded-xl transition-colors cursor-pointer"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Booking Details Modal */}
      {activeBookingDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                  Detalhes da Reserva
                </span>
                <h3 className="text-base font-extrabold text-[#16324F] mt-0.5">
                  {resources.find((r) => r.id === activeBookingDetail.resourceId)?.name}
                </h3>
              </div>
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="text-[#64748B] hover:text-[#16324F] p-1 text-xs font-semibold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3.5 bg-[#F5F7FB] rounded-2xl border border-slate-200/80">
                <div>
                  <span className="text-[#64748B] block font-medium">Data e Horário</span>
                  <span className="font-bold text-[#16324F] font-mono">
                    {activeBookingDetail.date} ({activeBookingDetail.startTime} - {activeBookingDetail.endTime})
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Status Atual</span>
                  <span className="font-extrabold text-[#2563EB] uppercase">
                    {activeBookingDetail.status}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Solicitante</span>
                  <span className="font-bold text-[#16324F]">
                    {activeBookingDetail.userName}
                  </span>
                </div>
                <div>
                  <span className="text-[#64748B] block font-medium">Turma / Destino</span>
                  <span className="font-bold text-[#16324F]">
                    {activeBookingDetail.className || 'Evento Geral'}
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[#64748B] block font-bold">Finalidade Pedagógica:</span>
                <p className="mt-1 text-[#16324F] text-xs bg-[#F5F7FB] p-3 rounded-xl border border-slate-200">
                  {activeBookingDetail.purpose}
                </p>
              </div>

              {activeBookingDetail.notes && (
                <div>
                  <span className="text-[#64748B] block font-bold">Observações:</span>
                  <p className="mt-1 text-[#64748B] text-xs italic bg-[#F5F7FB] p-2.5 rounded-xl border border-slate-200">
                    {activeBookingDetail.notes}
                  </p>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setActiveBookingDetail(null)}
                className="px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-slate-100 rounded-xl transition-colors"
              >
                Fechar
              </button>
              {isDirection && activeBookingDetail.status === 'pending' && (
                <>
                  <button
                    onClick={() => {
                      onRejectBooking(activeBookingDetail.id, 'Recusado pela Diretoria.');
                      setActiveBookingDetail(null);
                    }}
                    className="px-3.5 py-2 text-xs font-bold text-[#DC2626] bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
                  >
                    Recusar
                  </button>
                  <button
                    onClick={() => {
                      onApproveBooking(activeBookingDetail.id);
                      setActiveBookingDetail(null);
                    }}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-green-700 rounded-xl shadow-xs transition-colors"
                  >
                    Aprovar Agendamento
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
