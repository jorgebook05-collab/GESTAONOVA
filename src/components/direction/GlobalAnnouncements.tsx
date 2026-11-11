import React, { useState } from 'react';
import { 
  BellRing, 
  Pin, 
  Plus, 
  Calendar, 
  Send, 
  AlertCircle,
  Tag,
  X
} from 'lucide-react';
import { Announcement, User } from '../../types';

interface GlobalAnnouncementsProps {
  announcements: Announcement[];
  currentUser: User;
  onAddAnnouncement: (newAnc: Omit<Announcement, 'id' | 'createdAt'>) => void;
}

export const GlobalAnnouncements: React.FC<GlobalAnnouncementsProps> = ({
  announcements,
  currentUser,
  onAddAnnouncement,
}) => {
  const isDirection = currentUser.role === 'direction';
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'institucional' | 'pedagogico' | 'urgente' | 'evento'>('institucional');
  const [targetAudience, setTargetAudience] = useState<'all' | 'teachers'>('teachers');
  const [isPinned, setIsPinned] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    onAddAnnouncement({
      title,
      content,
      authorName: currentUser.name,
      authorRole: currentUser.role,
      targetAudience,
      isPinned,
      category,
    });

    // Reset form
    setTitle('');
    setContent('');
    setIsPinned(false);
    setShowCreateModal(false);
  };

  // Sort pinned first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return b.createdAt.localeCompare(a.createdAt);
  });

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <BellRing className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
              Mural de Comunicados & Avisos Institucionais
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Canal oficial de alinhamento pedagógico, cronogramas e deliberações da Diretoria
            </p>
          </div>
        </div>

        {isDirection && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Publicar Novo Comunicado</span>
          </button>
        )}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {sortedAnnouncements.map((anc) => (
          <div
            key={anc.id}
            className={`p-6 rounded-3xl border transition-all ${
              anc.isPinned
                ? 'bg-amber-50/50 border-amber-200 shadow-xs'
                : 'bg-white border-slate-200/90 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                {anc.isPinned && (
                  <div className="p-2 bg-amber-100 text-amber-900 rounded-xl shrink-0 mt-0.5">
                    <Pin className="w-4 h-4 fill-amber-700 text-amber-800" />
                  </div>
                )}
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-100">
                      {anc.category}
                    </span>
                    <span className="text-xs text-[#64748B] font-medium">
                      Público: {anc.targetAudience === 'teachers' ? 'Corpo Docente' : 'Toda a Escola'}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-xs font-mono text-[#64748B]">{anc.createdAt}</span>
                  </div>

                  <h3 className="text-base font-extrabold text-[#16324F]">
                    {anc.title}
                  </h3>

                  <p className="mt-2 text-xs md:text-sm text-[#16324F]/90 leading-relaxed whitespace-pre-line">
                    {anc.content}
                  </p>

                  <div className="mt-3.5 flex items-center gap-2 text-xs text-[#64748B] pt-2 border-t border-slate-100">
                    <span className="font-bold text-[#16324F]">Por: {anc.authorName}</span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="italic">
                      {anc.authorRole === 'direction' ? 'Diretoria Pedagógica' : 'Coordenação'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Announcement Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#16324F]">
                Novo Comunicado Oficial da Direção
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#64748B] hover:text-[#16324F] text-xs font-semibold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Título do Comunicado *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Prazos de Fechamento de Notas do Bimestre"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Categoria
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  >
                    <option value="institucional">Institucional</option>
                    <option value="pedagogico">Pedagógico</option>
                    <option value="urgente">Urgente</option>
                    <option value="evento">Evento</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Destinatários
                  </label>
                  <select
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value as any)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  >
                    <option value="teachers">Apenas Corpo Docente</option>
                    <option value="all">Comunidade Escolar (Todos)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Conteúdo da Mensagem *
                </label>
                <textarea
                  rows={4}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Descreva as orientações, datas e detalhes do comunicado com clareza..."
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="pinNotice"
                  checked={isPinned}
                  onChange={(e) => setIsPinned(e.target.checked)}
                  className="rounded text-[#2563EB] focus:ring-[#2563EB] w-4 h-4"
                />
                <label htmlFor="pinNotice" className="text-[#16324F] font-semibold cursor-pointer">
                  Fixar no topo do mural com destaque prioritário
                </label>
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-[#64748B] hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md cursor-pointer"
                >
                  Publicar Comunicado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
