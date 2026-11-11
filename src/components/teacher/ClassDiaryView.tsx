import React, { useState } from 'react';
import { 
  BookMarked, 
  Plus, 
  Calendar, 
  CheckCircle2, 
  FileText, 
  GraduationCap, 
  Users,
  AlertCircle,
  X
} from 'lucide-react';
import { ClassDiaryEntry, SchoolClass, User } from '../../types';

interface ClassDiaryViewProps {
  diaryEntries: ClassDiaryEntry[];
  classes: SchoolClass[];
  currentUser: User;
  onAddDiaryEntry: (entry: Omit<ClassDiaryEntry, 'id'>) => void;
}

export const ClassDiaryView: React.FC<ClassDiaryViewProps> = ({
  diaryEntries,
  classes,
  currentUser,
  onAddDiaryEntry,
}) => {
  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('all');
  const [showModal, setShowModal] = useState<boolean>(false);

  // Form states
  const [classId, setClassId] = useState<string>(classes[0]?.id || '');
  const [date, setDate] = useState<string>('2026-10-20');
  const [topic, setTopic] = useState<string>('');
  const [lessonPlan, setLessonPlan] = useState<string>('');
  const [absentStudentsCount, setAbsentStudentsCount] = useState<number>(0);
  const [assessmentDate, setAssessmentDate] = useState<string>('');
  const [assessmentTitle, setAssessmentTitle] = useState<string>('');
  const [homeworkAssigned, setHomeworkAssigned] = useState<string>('');

  // Filtragem
  const filteredEntries = diaryEntries
    .filter((e) => selectedClassFilter === 'all' || e.classId === selectedClassFilter)
    .sort((a, b) => b.date.localeCompare(a.date));

  // Quick pedagogical templates
  const applyTemplate = (type: 'expositiva' | 'lab' | 'grupo' | 'revisao') => {
    switch (type) {
      case 'expositiva':
        setTopic('Aprofundamento Teórico e Resolução de Problemas');
        setLessonPlan('Apresentação conceitual no quadro e lousa digital; discussão guiada com a turma; resolução de exercícios modelo em conjunto; fixação individual com acompanhamento.');
        break;
      case 'lab':
        setTopic('Aula Prática em Laboratório / Plataforma Digital');
        setLessonPlan('Prática orientada utilizando equipamentos multimídia e computadores; análise de experimentos virtuais e simulações; registro de dados e conclusões em duplas.');
        break;
      case 'grupo':
        setTopic('Metodologia Ativa e Aprendizagem Baseada em Projetos');
        setLessonPlan('Divisão em grupos de estudo colaborativo; debate orientado sobre estudo de caso real; elaboração de síntese conceitual e mini-apresentação oral ao final da aula.');
        break;
      case 'revisao':
        setTopic('Revisão Geral e Plantão de Dúvidas para Avaliação');
        setLessonPlan('Revisão dos pontos críticos do bimestre; resolução de simulado estruturado; esclarecimento de dúvidas frequentes e orientação para estudos complementares.');
        break;
    }
  };

  const handleStepAbsences = (delta: number) => {
    setAbsentStudentsCount((prev) => Math.max(0, (Number(prev) || 0) + delta));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim() || !lessonPlan.trim()) return;

    const matchedClass = classes.find((c) => c.id === classId);

    onAddDiaryEntry({
      teacherId: currentUser.id,
      classId,
      className: matchedClass?.name || 'Turma',
      date,
      topic,
      lessonPlan,
      absentStudentsCount: Number(absentStudentsCount) || 0,
      assessmentDate: assessmentDate || undefined,
      assessmentTitle: assessmentTitle || undefined,
      homeworkAssigned: homeworkAssigned || undefined,
    });

    // Reset form
    setTopic('');
    setLessonPlan('');
    setAbsentStudentsCount(0);
    setAssessmentDate('');
    setAssessmentTitle('');
    setHomeworkAssigned('');
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
              Diário de Classe Simplificado
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Registro de conteúdo pedagógico ministrado, controle de faltas e agendamento de avaliações.
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Aula de Hoje</span>
        </button>
      </div>

      {/* Filter by class */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-xs">
        <div className="flex items-center gap-2.5 text-[#16324F]">
          <span className="font-bold text-[#16324F]">Filtrar por Turma:</span>
          <select
            value={selectedClassFilter}
            onChange={(e) => setSelectedClassFilter(e.target.value)}
            className="bg-[#F5F7FB] border border-slate-200 rounded-xl px-3 py-1.5 text-[#16324F] font-semibold text-xs focus:outline-[#2563EB]"
          >
            <option value="all">Todas as turmas</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <span className="text-[#64748B] font-semibold">
          {filteredEntries.length} aulas registradas no período
        </span>
      </div>

      {/* Entries List */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200/90 p-12 text-center text-[#64748B] text-xs shadow-xs">
            Nenhum registro no diário de classe com este filtro.
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-3.5 hover:border-slate-300 transition-all"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-[#16324F] bg-[#EFF6FF] text-[#2563EB] px-2.5 py-1 rounded-md border border-blue-100">
                    {entry.className}
                  </span>
                  <span aria-hidden="true" className="text-slate-300">·</span>
                  <span className="font-mono text-xs text-[#64748B]">
                    {entry.date}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 text-[#64748B] bg-[#F5F7FB] px-2.5 py-1 rounded-md border border-slate-200/80">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>Faltas: <strong className="text-[#16324F] tabular-nums font-bold">{entry.absentStudentsCount} alunos</strong></span>
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#2563EB] uppercase tracking-wider block">
                  Conteúdo Ministrado:
                </span>
                <p className="text-sm font-extrabold text-[#16324F] mt-0.5">
                  {entry.topic}
                </p>
              </div>

              <div>
                <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider block">
                  Metodologia & Plano de Aula:
                </span>
                <p className="text-xs text-[#16324F] mt-1 leading-relaxed bg-[#F5F7FB] p-3.5 rounded-xl border border-slate-200/80">
                  {entry.lessonPlan}
                </p>
              </div>

              {entry.assessmentDate && (
                <div className="p-3 bg-amber-50/90 rounded-xl border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-amber-950 font-medium">
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                    <span>
                      Avaliação Agendada: <strong>{entry.assessmentTitle}</strong>
                    </span>
                  </div>
                  <span className="font-mono text-amber-900 font-bold bg-white px-2 py-0.5 rounded border border-amber-200">
                    {entry.assessmentDate}
                  </span>
                </div>
              )}

              {entry.homeworkAssigned && (
                <div className="text-xs text-[#64748B] flex items-center gap-2 pt-1">
                  <span className="font-bold text-[#16324F]">Tarefa de Casa:</span>
                  <span>{entry.homeworkAssigned}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal to Add Diary Entry */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="text-base font-extrabold text-[#16324F]">
                Registrar Aula no Diário de Classe
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#64748B] hover:text-[#16324F] text-xs font-semibold p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
              {/* Quick Template Selector */}
              <div className="bg-[#EFF6FF] border border-blue-200/80 rounded-2xl p-3">
                <span className="text-[11px] font-bold text-[#2563EB] block mb-1.5 flex items-center justify-between">
                  <span>⚡ Modelos Rápidos de Plano Pedagógico:</span>
                  <span className="text-[10px] text-blue-500 font-normal">Preenche com 1 clique</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => applyTemplate('expositiva')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-[#16324F] hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    📖 Aula Teórica / Exercícios
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('lab')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-[#16324F] hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    💻 Laboratório / Prática
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('grupo')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-[#16324F] hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    👥 Metodologia Ativa
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('revisao')}
                    className="px-2.5 py-1 text-[11px] font-semibold bg-white text-[#16324F] hover:bg-blue-100/60 rounded-lg border border-blue-200 transition-colors cursor-pointer"
                  >
                    🎯 Revisão / Simulado
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Turma *
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Data da Aula *
                  </label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Conteúdo / Tópico Ministrado *
                </label>
                <input
                  type="text"
                  required
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Ex: Introdução à Trigonometria e Funções Senoidais"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Plano de Aula e Metodologia *
                </label>
                <textarea
                  rows={3}
                  required
                  value={lessonPlan}
                  onChange={(e) => setLessonPlan(e.target.value)}
                  placeholder="Descreva as atividades, teoria e exercícios trabalhados em sala..."
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Alunos Ausentes (Faltas)
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleStepAbsences(-1)}
                      className="w-8 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm flex items-center justify-center cursor-pointer transition-colors"
                      title="Diminuir faltas"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={0}
                      value={absentStudentsCount}
                      onChange={(e) => setAbsentStudentsCount(Number(e.target.value))}
                      className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2 text-center text-xs text-[#16324F] font-bold focus:outline-[#2563EB] tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={() => handleStepAbsences(1)}
                      className="w-8 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 text-sm flex items-center justify-center cursor-pointer transition-colors"
                      title="Aumentar faltas"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Data de Avaliação (Opcional)
                  </label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  />
                </div>
              </div>

              {assessmentDate && (
                <div>
                  <label className="block text-[#16324F] font-bold mb-1">
                    Título / Objeto da Avaliação
                  </label>
                  <input
                    type="text"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    placeholder="Ex: Prova Bimestral de Geometria Espacial"
                    className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                  />
                </div>
              )}

              <div>
                <label className="block text-[#16324F] font-bold mb-1">
                  Tarefa de Casa / Orientação de Estudo (Opcional)
                </label>
                <input
                  type="text"
                  value={homeworkAssigned}
                  onChange={(e) => setHomeworkAssigned(e.target.value)}
                  placeholder="Ex: Exercícios 1 a 10 da apostila"
                  className="w-full bg-[#F5F7FB] border border-slate-200 rounded-xl p-2.5 text-xs text-[#16324F] focus:outline-[#2563EB]"
                />
              </div>

              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-[#64748B] hover:bg-slate-100 rounded-xl font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md cursor-pointer"
                >
                  Salvar Registro no Diário
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
