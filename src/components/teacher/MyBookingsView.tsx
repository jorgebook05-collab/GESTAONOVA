import React, { useState } from 'react';
import { 
  BookmarkCheck, 
  Plus, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  Laptop,
  MapPin,
  Filter
} from 'lucide-react';
import { Booking, Resource, User } from '../../types';

interface MyBookingsViewProps {
  bookings: Booking[];
  resources: Resource[];
  currentUser: User;
  onCancelBooking: (id: string) => void;
  onOpenNewBookingModal: () => void;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  resources,
  currentUser,
  onCancelBooking,
  onOpenNewBookingModal,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filter only this user's bookings
  const myBookings = bookings.filter((b) => b.userId === currentUser.id);

  const filtered = myBookings.filter((b) => {
    if (filterStatus === 'all') return true;
    return b.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
              <BookmarkCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
                Minhas Solicitações de Agendamento
              </h1>
              <p className="text-xs text-[#64748B] mt-0.5">
                Acompanhe o status de aprovação de DataShows, laboratórios STEM e equipamentos reservados.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onOpenNewBookingModal}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Solicitar Novo Equipamento</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'all'
              ? 'bg-[#16324F] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Todas ({myBookings.length})
        </button>
        <button
          onClick={() => setFilterStatus('approved')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'approved'
              ? 'bg-[#16A34A] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Aprovadas ({myBookings.filter((b) => b.status === 'approved').length})
        </button>
        <button
          onClick={() => setFilterStatus('pending')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'pending'
              ? 'bg-[#EAB308] text-slate-900 shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Aguardando Aprovação ({myBookings.filter((b) => b.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilterStatus('cancelled')}
          className={`px-4 py-2 rounded-xl font-bold transition-all ${
            filterStatus === 'cancelled'
              ? 'bg-[#DC2626] text-white shadow-xs'
              : 'bg-white text-[#64748B] hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          Canceladas ({myBookings.filter((b) => b.status === 'cancelled').length})
        </button>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center shadow-xs">
          <Laptop className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-[#16324F]">Nenhuma reserva encontrada</h3>
          <p className="text-xs text-[#64748B] mt-1 max-w-sm mx-auto">
            Você não possui reservas com o filtro selecionado. Clique em &quot;Solicitar Novo Equipamento&quot; para agendar.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((booking) => {
            const resource = resources.find((r) => r.id === booking.resourceId);
            const isApproved = booking.status === 'approved';
            const isPending = booking.status === 'pending';
            const isCancelled = booking.status === 'cancelled';
            const isRejected = booking.status === 'rejected';

            return (
              <div
                key={booking.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-[#EFF6FF] text-[#2563EB] rounded-2xl font-mono text-xs font-bold text-center shrink-0 border border-blue-100">
                    <span className="block text-[10px] text-[#64748B] uppercase">Dia</span>
                    <span className="text-base text-[#16324F] font-extrabold">{booking.date.slice(8, 10)}</span>
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-extrabold text-[#16324F]">
                        {resource?.name || 'Equipamento'}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isApproved
                            ? 'bg-green-100 text-[#16A34A]'
                            : isPending
                            ? 'bg-amber-100 text-[#EAB308]'
                            : 'bg-red-100 text-[#DC2626]'
                        }`}
                      >
                        {isApproved
                          ? 'Aprovado'
                          : isPending
                          ? 'Em Análise pela Direção'
                          : isCancelled
                          ? 'Cancelado'
                          : 'Recusado'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-[#64748B] mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {booking.startTime} às {booking.endTime}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {resource?.location || 'Campus Geral'}
                      </span>
                      {booking.className && (
                        <>
                          <span>•</span>
                          <span className="font-semibold text-[#16324F]">
                            {booking.className}
                          </span>
                        </>
                      )}
                    </div>

                    <p className="text-xs text-[#16324F] font-medium mt-1.5">
                      Finalidade: <span className="text-[#64748B]">{booking.purpose}</span>
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  {!isCancelled && !isRejected && (
                    <button
                      onClick={() => onCancelBooking(booking.id)}
                      className="px-3.5 py-2 text-xs font-bold text-[#DC2626] hover:bg-red-50 rounded-xl border border-red-200 transition-colors cursor-pointer"
                    >
                      Cancelar Reserva
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
