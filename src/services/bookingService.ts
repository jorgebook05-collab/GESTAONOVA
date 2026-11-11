import { Booking, Resource } from '../types';

export const TIME_SLOTS = [
  { label: '1ª e 2ª Aula (Manhã)', start: '07:30', end: '09:10' },
  { label: '3ª Aula (Manhã)', start: '09:10', end: '10:00' },
  { label: 'Intervalo / Recreio', start: '10:00', end: '10:15', isBreak: true },
  { label: '4ª e 5ª Aula (Manhã)', start: '10:15', end: '11:55' },
  { label: 'Almoço / Transição', start: '11:55', end: '13:30', isBreak: true },
  { label: '1ª e 2ª Aula (Tarde)', start: '13:30', end: '15:10' },
  { label: 'Intervalo Tarde', start: '15:10', end: '15:25', isBreak: true },
  { label: '3ª e 4ª Aula (Tarde)', start: '15:25', end: '17:05' },
  { label: 'Plantão / Evento Noturno', start: '17:30', end: '19:30' },
];

export function timeToMinutes(timeStr: string): number {
  if (!timeStr) return 0;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return (hours || 0) * 60 + (minutes || 0);
}

export function isTimeOverlapping(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  const aStart = timeToMinutes(startA);
  const aEnd = timeToMinutes(endA);
  const bStart = timeToMinutes(startB);
  const bEnd = timeToMinutes(endB);

  return aStart < bEnd && aEnd > bStart;
}

export interface ConflictValidationResult {
  hasConflict: boolean;
  conflictingBooking?: Booking;
  isPriorityLockConflict?: boolean;
  message?: string;
}

/**
 * Validação rigorosa de conflito de agendamento em tempo real.
 * Garante que nunca ocorra agendamento duplicado no mesmo recurso e mesmo intervalo de data/hora.
 */
export function validateBookingConflict(
  date: string,
  startTime: string,
  endTime: string,
  resourceId: string,
  allBookings: Booking[],
  excludeBookingId?: string
): ConflictValidationResult {
  if (!date || !startTime || !endTime || !resourceId) {
    return { hasConflict: false };
  }

  const sMin = timeToMinutes(startTime);
  const eMin = timeToMinutes(endTime);

  if (eMin <= sMin) {
    return {
      hasConflict: true,
      message: 'O horário de término deve ser posterior ao horário de início.',
    };
  }

  const conflicting = allBookings.find((b) => {
    if (excludeBookingId && b.id === excludeBookingId) return false;
    if (b.status === 'rejected' || b.status === 'cancelled') return false;
    if (b.date !== date) return false;
    if (b.resourceId !== resourceId) return false;

    return isTimeOverlapping(startTime, endTime, b.startTime, b.endTime);
  });

  if (conflicting) {
    const isPriority = conflicting.isPriorityLock;
    return {
      hasConflict: true,
      conflictingBooking: conflicting,
      isPriorityLockConflict: isPriority,
      message: isPriority
        ? `Bloqueio prioritário institucional da Direção (${conflicting.startTime} às ${conflicting.endTime}): "${conflicting.purpose}".`
        : `Horário já reservado por ${conflicting.userName} (${conflicting.startTime} às ${conflicting.endTime}) para ${conflicting.purpose}.`,
    };
  }

  return { hasConflict: false };
}

/**
 * Retorna os slots e seus status de ocupação para um recurso específico em determinada data
 */
export function getResourceSlotsStatus(
  resourceId: string,
  date: string,
  allBookings: Booking[]
) {
  const activeBookings = allBookings.filter(
    (b) =>
      b.resourceId === resourceId &&
      b.date === date &&
      b.status !== 'rejected' &&
      b.status !== 'cancelled'
  );

  return TIME_SLOTS.filter(s => !s.isBreak).map((slot) => {
    const matchedBooking = activeBookings.find((b) =>
      isTimeOverlapping(slot.start, slot.end, b.startTime, b.endTime)
    );

    return {
      ...slot,
      isBooked: !!matchedBooking,
      booking: matchedBooking,
    };
  });
}
