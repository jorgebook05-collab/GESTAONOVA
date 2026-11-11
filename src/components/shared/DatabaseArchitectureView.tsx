import React, { useState } from 'react';
import { 
  Database, 
  Code, 
  Layers, 
  ShieldCheck, 
  Copy, 
  Check, 
  Table, 
  Workflow, 
  Zap,
  Server
} from 'lucide-react';

export const DatabaseArchitectureView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'erd' | 'ddl' | 'flow'>('erd');
  const [copied, setCopied] = useState(false);

  const postgresDDL = `-- ========================================================
-- SISTEMA INTEGRADO DE GESTÃO ESCOLAR EDUGESTÃO - ESQUEMA RELACIONAL
-- SGBD Recomendado: PostgreSQL 15+ (Compatível com Cloud SQL / Supabase)
-- Extensão para prevenção atômica de sobreposição temporal (Anti-Choque)
-- ========================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "btree_gist";

-- 1. TABELA DE USUÁRIOS & PERMISSÕES (RBAC)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('direction', 'teacher', 'admin')),
    title VARCHAR(150),
    department VARCHAR(150),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE RECURSOS PEDAGÓGICOS & EQUIPAMENTOS
CREATE TABLE resources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('datashow', 'lab_informatica', 'auditorio', 'lab_ciencias', 'kit_midia')),
    code VARCHAR(50) UNIQUE NOT NULL,
    location VARCHAR(200) NOT NULL,
    capacity INT,
    description TEXT,
    status VARCHAR(30) DEFAULT 'available' CHECK (status IN ('available', 'in_use', 'maintenance')),
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE TURMAS & INDICADORES ACADÊMICOS
CREATE TABLE school_classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    grade_level VARCHAR(100) NOT NULL,
    period VARCHAR(30) NOT NULL CHECK (period IN ('manha', 'tarde', 'integral')),
    academic_year INT NOT NULL DEFAULT 2026,
    total_students INT NOT NULL DEFAULT 0,
    attendance_rate NUMERIC(5, 2) DEFAULT 100.0,
    average_grade NUMERIC(4, 2) DEFAULT 0.0,
    default_room VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE AGENDAMENTOS (COM CONSTRAINT ATÔMICA ANTI-CONFLITO)
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    resource_id UUID NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    class_id UUID REFERENCES school_classes(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    purpose TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('approved', 'pending', 'rejected', 'cancelled')),
    is_priority_lock BOOLEAN DEFAULT FALSE,
    notes TEXT,
    rejection_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_time_range CHECK (end_time > start_time),
    -- Garante que nenhuma reserva ativa se sobreponha no mesmo recurso e data:
    CONSTRAINT no_booking_overlap EXCLUDE USING gist (
        resource_id WITH =,
        booking_date WITH =,
        tsrange(
            (booking_date + start_time)::timestamp,
            (booking_date + end_time)::timestamp
        ) WITH &&
    ) WHERE (status IN ('approved', 'pending'))
);

-- 5. TABELA DA GRADE MASTER DE HORÁRIOS DA ESCOLA
CREATE TABLE master_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    subject VARCHAR(150) NOT NULL,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 1 AND 5), -- 1=Segunda, 5=Sexta
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room VARCHAR(100) NOT NULL,
    CONSTRAINT check_schedule_times CHECK (end_time > start_time),
    -- Evita choque: mesmo professor em duas turmas no mesmo horário
    CONSTRAINT no_teacher_clash EXCLUDE USING gist (
        teacher_id WITH =,
        day_of_week WITH =,
        tsrange(
            ('2000-01-01'::date + start_time)::timestamp,
            ('2000-01-01'::date + end_time)::timestamp
        ) WITH &&
    ),
    -- Evita choque: mesma turma com dois professores no mesmo horário
    CONSTRAINT no_class_clash EXCLUDE USING gist (
        class_id WITH =,
        day_of_week WITH =,
        tsrange(
            ('2000-01-01'::date + start_time)::timestamp,
            ('2000-01-01'::date + end_time)::timestamp
        ) WITH &&
    )
);

-- 6. TABELA DE DIÁRIO DE CLASSE SIMPLIFICADO
CREATE TABLE class_diaries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES school_classes(id) ON DELETE CASCADE,
    diary_date DATE NOT NULL,
    topic VARCHAR(255) NOT NULL,
    lesson_plan TEXT NOT NULL,
    absent_students_count INT DEFAULT 0,
    assessment_date DATE,
    assessment_title VARCHAR(200),
    homework_assigned TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. TABELA DE COMUNICADOS & MURAL DE AVISOS
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_audience VARCHAR(50) DEFAULT 'teachers' CHECK (target_audience IN ('all', 'teachers')),
    category VARCHAR(50) DEFAULT 'institucional' CHECK (category IN ('institucional', 'pedagogico', 'urgente', 'evento')),
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ÍNDICES PARA ALTA PERFORMANCE DE CONSULTA TEMPORAL
CREATE INDEX idx_bookings_date_resource ON bookings(booking_date, resource_id);
CREATE INDEX idx_bookings_user ON bookings(user_id);
CREATE INDEX idx_schedules_day_teacher ON master_schedules(day_of_week, teacher_id);
CREATE INDEX idx_diaries_class_date ON class_diaries(class_id, diary_date);`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postgresDDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-[#EFF6FF] text-[#2563EB] border border-blue-100">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold tracking-tight text-[#16324F]">
              Arquitetura de Dados & Modelagem de Backend (TCC)
            </h1>
            <p className="text-xs text-[#64748B] mt-0.5">
              Modelagem relacional completa, validações atômicas de concorrência e diagrama ERD
            </p>
          </div>
        </div>

        <div className="flex items-center p-1 bg-[#F5F7FB] rounded-2xl border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('erd')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'erd'
                ? 'bg-white text-[#16324F] shadow-xs'
                : 'text-[#64748B] hover:text-[#16324F]'
            }`}
          >
            Diagrama ERD & Entidades
          </button>
          <button
            onClick={() => setActiveTab('ddl')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'ddl'
                ? 'bg-white text-[#16324F] shadow-xs'
                : 'text-[#64748B] hover:text-[#16324F]'
            }`}
          >
            Script SQL DDL (PostgreSQL)
          </button>
          <button
            onClick={() => setActiveTab('flow')}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'flow'
                ? 'bg-white text-[#16324F] shadow-xs'
                : 'text-[#64748B] hover:text-[#16324F]'
            }`}
          >
            Fluxos & Validação Anti-Choque
          </button>
        </div>
      </div>

      {/* Tab 1: ERD & Entities */}
      {activeTab === 'erd' && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-base font-extrabold text-[#16324F]">
                  Entidades do Domínio e Relacionamentos
                </h2>
                <p className="text-xs text-[#64748B] mt-0.5">
                  Mapeamento conceitual conforme diretrizes de arquitetura limpa (Clean Architecture)
                </p>
              </div>
              <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-1 rounded-md border border-blue-200">
                7 Tabelas Centrais
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-5 text-xs">
              {/* Entidade 1 */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB]">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Table className="w-4 h-4 text-[#2563EB]" />
                  <span>Users (Usuários)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Gerencia autenticação e RBAC (Direção vs Professor).
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div>name: VARCHAR(255)</div>
                  <div>email: VARCHAR(255) UNIQUE</div>
                  <div className="font-bold text-[#16324F]">role: &apos;direction&apos; | &apos;teacher&apos;</div>
                  <div>department: VARCHAR(150)</div>
                </div>
              </div>

              {/* Entidade 2 */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB]">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Table className="w-4 h-4 text-[#2563EB]" />
                  <span>Resources (Recursos)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Espaços físicos e equipamentos multimídia móveis.
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div>name: VARCHAR(255)</div>
                  <div>code: VARCHAR(50) UNIQUE</div>
                  <div>category: ENUM (datashow, lab, ...)</div>
                  <div>location: VARCHAR(200)</div>
                </div>
              </div>

              {/* Entidade 3 */}
              <div className="p-4 rounded-2xl border border-blue-200 bg-blue-50/50 ring-2 ring-blue-100">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Zap className="w-4 h-4 text-[#2563EB]" />
                  <span>Bookings (Agendamentos)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Tabela crítica com constraint EXCLUDE anti-colisão.
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div className="text-blue-900 font-bold">FK resource_id: UUID</div>
                  <div className="text-blue-900 font-bold">FK user_id: UUID</div>
                  <div>booking_date: DATE</div>
                  <div>start_time / end_time: TIME</div>
                  <div className="font-bold text-amber-900">is_priority_lock: BOOLEAN</div>
                </div>
              </div>

              {/* Entidade 4 */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB]">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Table className="w-4 h-4 text-[#2563EB]" />
                  <span>SchoolClasses (Turmas)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Turmas, segmentos, indicadores de desempenho e evasão.
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div>name: VARCHAR(100)</div>
                  <div>period: &apos;manha&apos; | &apos;tarde&apos; | &apos;integral&apos;</div>
                  <div>attendance_rate: NUMERIC(5,2)</div>
                  <div>average_grade: NUMERIC(4,2)</div>
                </div>
              </div>

              {/* Entidade 5 */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB]">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Table className="w-4 h-4 text-[#2563EB]" />
                  <span>MasterSchedules (Grade)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Alocação semanal de professores e turmas sem choques.
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div className="text-blue-900 font-bold">FK teacher_id: UUID</div>
                  <div className="text-blue-900 font-bold">FK class_id: UUID</div>
                  <div>day_of_week: INT (1-5)</div>
                  <div>start_time / end_time: TIME</div>
                </div>
              </div>

              {/* Entidade 6 */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-[#F5F7FB]">
                <div className="flex items-center gap-2 text-[#16324F] font-extrabold mb-2">
                  <Table className="w-4 h-4 text-[#2563EB]" />
                  <span>ClassDiaries (Diários)</span>
                </div>
                <p className="text-[11px] text-[#64748B] mb-2.5">
                  Anotações de aula, faltas e calendário de provas.
                </p>
                <div className="font-mono text-[11px] space-y-1 text-slate-700">
                  <div className="font-bold text-[#2563EB]">PK id: UUID</div>
                  <div className="text-blue-900 font-bold">FK teacher_id: UUID</div>
                  <div className="text-blue-900 font-bold">FK class_id: UUID</div>
                  <div>topic: VARCHAR(255)</div>
                  <div>lesson_plan: TEXT</div>
                  <div>assessment_date: DATE</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SQL DDL */}
      {activeTab === 'ddl' && (
        <div className="bg-[#0F2036] text-slate-100 rounded-3xl p-6 shadow-xl border border-slate-800 relative">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-800 mb-3.5">
            <div className="flex items-center gap-2">
              <Code className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-mono font-bold text-blue-400">
                schema_edugestao_postgresql.sql
              </span>
            </div>

            <button
              onClick={copyToClipboard}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white rounded-xl transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Copiado com Sucesso!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar SQL</span>
                </>
              )}
            </button>
          </div>

          <pre className="text-xs font-mono overflow-x-auto p-3 leading-relaxed text-slate-300 max-h-[500px]">
            {postgresDDL}
          </pre>
        </div>
      )}

      {/* Tab 3: Fluxos e Validação Anti-Choque */}
      {activeTab === 'flow' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-extrabold text-[#16324F] flex items-center gap-2">
              <Workflow className="w-5 h-5 text-[#2563EB]" />
              <span>Mecanismo de Validação em Duas Camadas (Frontend & Banco de Dados)</span>
            </h2>
            <p className="text-xs text-[#64748B] mt-1">
              Garantia matemática e transacional de que nenhum recurso seja reservado duplamente no mesmo instante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-5 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] space-y-2.5">
              <span className="font-bold text-[#16324F] block text-xs">
                1. Camada Frontend (Feedback em Tempo Real / 0ms Latência)
              </span>
              <p className="text-[#64748B] leading-relaxed text-[11px]">
                O cliente avalia a função <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">validateBookingConflict()</code> a cada toque no formulário:
              </p>
              <div className="p-3 bg-[#16324F] text-white rounded-xl font-mono text-[10px]">
                a_start &lt; b_end AND a_end &gt; b_start
              </div>
              <p className="text-[#64748B] leading-relaxed text-[11px]">
                Se o professor escolher um intervalo com sobreposição, o botão de submissão é bloqueado imediatamente e uma mensagem de alerta detalhada aponta quem já ocupa a sala e até que horário.
              </p>
            </div>

            <div className="p-5 rounded-2xl border border-slate-200/80 bg-[#F5F7FB] space-y-2.5">
              <span className="font-bold text-[#16324F] block text-xs">
                2. Camada Banco de Dados (Transacional / Concorrência Atômica)
              </span>
              <p className="text-[#64748B] leading-relaxed text-[11px]">
                Utilização da restrição de exclusão do PostgreSQL (<code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">EXCLUDE USING gist</code> com operadores de intervalo temporal <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[10px] border border-slate-200">&amp;&amp;</code>).
              </p>
              <p className="text-[#64748B] leading-relaxed text-[11px]">
                Mesmo sob requisições de rede concorrentes e milissegundos idênticos, o SGBD rejeita com rollback automático qualquer colisão de agendamento no mesmo recurso.
              </p>
            </div>
          </div>

          {/* Hierarquia de Prioridade da Direção */}
          <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/70 space-y-2 text-xs">
            <span className="font-bold text-amber-950 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-800" />
              <span>Hierarquia de Reserva Prioritária (Regra de Negócio RBAC)</span>
            </span>
            <p className="text-amber-900 text-[11px] leading-relaxed">
              Quando a Direção agenda um evento institucional com a flag <code className="bg-amber-200/80 px-1.5 py-0.5 rounded font-mono text-[10px]">is_priority_lock = true</code> (ex: Reunião Pedagógica Bimestral ou Simulado ENEM), o sistema confere precedência máxima ao espaço. Solicitações de professores para o mesmo horário são notificadas e mantidas em estado pendente/rejeitado com a justificativa oficial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
