import React, { useState, useMemo } from 'react';
import { 
  Laptop, 
  Clock, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  Sparkles,
  Info,
  MapPin,
  X
} from 'lucide-react';
import { Resource, Booking, SchoolClass, User } from '../../types';
import { 
  validateBookingConflict, 
  getResourceSlotsStatus, 
  TIME_SLOTS 
} from '../../services/bookingService';

interface TeacherBookingFormProps {
  resources: Resource[];
  classes: SchoolClass[];
  allBookings: Booking[];
  currentUser: User;
  onSaveBooking: (newBooking: Omit<Booking, 'id' | 'createdAt'>) => void;
  onClose?: () => void;
  initialDate?: string;
  initialResourceId?: string;
}

export const TeacherBookingForm: React.FC<TeacherBookingFormProps> = ({
  resources,
  classes,
  allBookings,
  currentUser,
  onSaveBooking,
  onClose,
  initialDate = '2026-10-20',
  initialResourceId,
}) => {
  const isDirection = currentUser.role === 'direction';

  // Form states
  const [selectedResource, setSelectedResource] = useState<string>(
    initialResourceId || resources[0]?.id || ''
  );
  const [date, setDate] = useState<string>(initialDate);
  const [startTime, setStartTime] = useState<string>('07:30');
  const [endTime, setEndTime] = useState<string>('09:10');
  const [purpose, setPurpose] = useState<string>('');
  const [selectedClass, setSelectedClass] = useState<string>(classes[0]?.id || '');
  const [notes, setNotes] = useState<string>('');
  const [isPriorityLock, setIsPriorityLock] = useState<boolean>(isDirection);

  // Real-time conflict evaluation
  const conflictResult = useMemo(() => {
    return validateBookingConflict(
      date,
      startTime,
      endTime,
      selectedResource,
      allBookings
    );
  }, [date, startTime, endTime, selectedResource, allBookings]);

  // Selected resource details
  const activeResource = useMemo(() => {
    return resources.find((r) => r.id === selectedResource);
  }, [resources, selectedResource]);

  // Visual status of standard daily slots for this resource and date
  const slotStatuses = useMemo(() => {
    if (!selectedResource || !date) return [];
    return getResourceSlotsStatus(selectedResource, date, allBookings);
  }, [selectedResource, date, allBookings]);

  const handleQuickSlotSelect = (slotStart: string, slotEnd: string) => {
    setStartTime(slotStart);
    setEndTime(slotEnd);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // If teacher and has conflict, strictly block
    if (!isDirection && conflictResult.hasConflict) {
      return;
    }

    const cls = classes.find((c) => c.id === selectedClass);

    onSaveBooking({
      resourceId: selectedResource,
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      date,
      startTime,
      endTime,
      purpose,
      classId: selectedClass || undefined,
      className: cls?.name,
      status: isDirection ? 'approved' : 'pending',
      isPriorityLock: isDirection ? isPriorityLock : false,
      notes: notes || undefined,
    });

    if (onClose) onClose();
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xl max-w-3xl mx-auto">
      <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
              isDirection 
                ? 'bg-amber-100 text-amber-900 border-amber-200' 
                : 'bg-[#EFF6FF] text-[#2563EB] border-blue-200'
            }`}>
              {isDirection ? 'Módulo Direção' : 'Módulo Docente'}
            </span>
            <span className="text-xs text-[#64748B] font-medium">Validação Anti-Choque em Tempo Real</span>
          </div>
          <h2 className="text-xl font-extrabold text-[#16324F] mt-1.5">
            {isDirection ? 'Reserva ou Bloqueio Prioritário de Recurso' : 'Solicitar Agendamento de Equipamento'}
          </h2>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-xs font-semibold text-[#64748B] hover:text-[#16324F] p-2 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
        {/* Recurso Picker */}
        <div>
          <label className="block text-[#16324F] font-bold mb-2">
            1. Selecione o Equipamento / Sala *
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {resources.map((res) => {
              const isSelected = selectedResource === res.id;
              return (
                <button
                  type="button"
                  key={res.id}
                  onClick={() => setSelectedResource(res.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#2563EB] bg-[#EFF6FF] ring-2 ring-blue-100 shadow-xs'
                      : 'border-slate-200/80 bg-[#F5F7FB] hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] text-[#64748B] font-bold">
                      {res.code}
                    </span>
                    <span className="text-[10px] text-[#2563EB] font-bold uppercase">
                      {res.category.replace('_', ' ')}
                    </span>
                  </div>
                  <span className="text-xs font-bold text-[#16324F] block truncate">
                    {res.name}
                  </span>
                  <span className="text-[11px] text-[#64748B] flex items-center gap-1 mt-1 truncate">
                    <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                    {res.location}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Date and Times */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[#16324F] font-bold mb-1.5">
              Data do Agendamento *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] font-mono focus:outline-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[#16324F] font-bold mb-1.5">
              Horário Início *
            </label>
            <input
              type="time"
              required
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] font-mono focus:outline-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[#16324F] font-bold mb-1.5">
              Horário Término *
            </label>
            <input
              type="time"
              required
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] font-mono focus:outline-[#2563EB]"
            />
          </div>
        </div>

        {/* Real-time Conflict Banner */}
        <div
          className={`p-4 rounded-2xl border transition-all ${
            conflictResult.hasConflict
              ? 'bg-red-50/90 border-red-200 text-[#DC2626]'
              : 'bg-green-50/90 border-green-200 text-[#16A34A]'
          }`}
        >
          <div className="flex items-start gap-3">
            {conflictResult.hasConflict ? (
              <AlertTriangle className="w-5 h-5 text-[#DC2626] shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wide">
                  {conflictResult.hasConflict
                    ? 'Conflito de Horário Detectado!'
                    : 'Horário 100% Disponível'}
                </span>
                <span className="text-[10px] font-mono bg-white/80 px-2 py-0.5 rounded border border-current">
                  {date} · {startTime} - {endTime}
                </span>
              </div>
              <p className="mt-1 text-xs opacity-90 leading-relaxed">
                {conflictResult.message}
              </p>

              {conflictResult.conflictingBooking && (
                <div className="mt-2.5 p-2.5 rounded-xl bg-white/90 border border-current/20 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span>Ocupado por: {conflictResult.conflictingBooking.userName}</span>
                    <span className="font-mono">
                      {conflictResult.conflictingBooking.startTime} às {conflictResult.conflictingBooking.endTime}
                    </span>
                  </div>
                  <span className="block mt-0.5 text-[11px] opacity-80">
                    Finalidade: {conflictResult.conflictingBooking.purpose}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Purpose and Class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[#16324F] font-bold mb-1.5">
              Finalidade Pedagógica *
            </label>
            <input
              type="text"
              required
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="Ex: Projeção de documentário de História, Apresentação de TCC"
              className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
            />
          </div>

          <div>
            <label className="block text-[#16324F] font-bold mb-1.5">
              Turma Beneficiada
            </label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.gradeLevel} - {c.period === 'manha' ? 'Manhã' : c.period === 'tarde' ? 'Tarde' : 'Integral'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Priority Lock Option (for Direction) */}
        {isDirection && (
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              <div>
                <span className="font-bold text-amber-950 block text-xs">
                  Bloqueio Prioritário Institucional
                </span>
                <span className="text-[11px] text-amber-800">
                  Garante prioridade máxima sobre qualquer outra solicitação para eventos da diretoria.
                </span>
              </div>
            </div>
            <input
              type="checkbox"
              checked={isPriorityLock}
              onChange={(e) => setIsPriorityLock(e.target.checked)}
              className="rounded text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
            />
          </div>
        )}

        {/* Submit Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#64748B] hover:text-[#16324F] bg-[#F5F7FB] hover:bg-slate-200 rounded-xl transition-colors"
            >
              Cancelar
            </button>
          )}

          <button
            type="submit"
            disabled={!isDirection && conflictResult.hasConflict}
            className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ${
              !isDirection && conflictResult.hasConflict
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white hover:scale-[1.01]'
            }`}
          >
            <span>
              {isDirection
                ? isPriorityLock
                  ? 'Confirmar Bloqueio Prioritário'
                  : 'Registrar Reserva Direta'
                : 'Enviar Solicitação de Reserva'}
            </span>
          </button>
        </div>
      </form>
    </div>
  );
};
