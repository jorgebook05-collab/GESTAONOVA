# EduGestão — Sistema Integrado de Gestão Escolar

[![React](https://img.shields.io/badge/React-19.0-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.x-purple?logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Academic Project](https://img.shields.io/badge/TCC-Engenharia_de_Software-16324F.svg)]()

> Sistema web moderno e responsivo voltado para a governança institucional, central de agendamento de equipamentos pedagógicos (DataShows, laboratórios STEM, auditórios) e controle da rotina docente/administrativa.

---

## 🏫 Visão Geral do Projeto

O **EduGestão** foi concebido como projeto acadêmico de conclusão de curso (TCC) de alto padrão, visando resolver um dos principais gargalos operacionais das instituições de ensino: o **conflito de horários no uso de recursos didáticos**, a **gestão de salas especiais** e o **acompanhamento em tempo real da rotina pedagógica**.

O sistema implementa **Controle de Acesso Baseado em Papéis (RBAC)** com dois perfis estritamente delimitados:
1. **Perfil Direção / Gestão Geral (Acesso Total):** Panorama de turmas, indicadores de evasão/frequência, aprovação de reservas, bloqueio prioritário institucional, grade horária master de professores e relatórios com exportação CSV.
2. **Perfil Professor (Espaço Docente):** Solicitação rápida de equipamentos, verificação de disponibilidade em 0ms (validação anti-choque), histórico próprio, grade semanal pessoal e diário de classe simplificado com registro de faltas e avaliações.

---

## 🚀 Principais Funcionalidades

### 1. Central de Agendamento & Validação Anti-Choque
- **Detecção de Conflitos em Tempo Real:** Avaliação contínua `(startA < endB && endA > startB)` para impedir duplicações no mesmo equipamento.
- **Bloqueio Prioritário da Direção:** Reserva com precedência institucional máxima para reuniões de colegiado, simulados ENEM ou manutenções.
- **Visualização em 3 Modos:** Calendário interativo mensal, semanal e agenda detalhada do dia.
- **Fluxo de Aprovação:** Docente solicita $\rightarrow$ Notificação para Direção $\rightarrow$ Aprovação ou recusa com justificativa formal.

### 2. Painel Executivo & Indicadores (Diretoria)
- Indicadores em tempo real: total de alunos (1.248), corpo docente (87), turmas (42), equipamentos catalogados (156), reservas para hoje e manutenções ativas.
- Gráficos analíticos de distribuição de recursos e volume semanal de uso.
- Tabela detalhada de turmas com índice de frequência, média de notas e salas fixas.

### 3. Gestão de Equipamentos & Patrimônio
- Cadastro completo de recursos: código patrimonial, marca, número de série, localização física e capacidade.
- Alternância rápida de status em 1 clique: `Disponível`, `Em Uso` e `Manutenção`.
- Filtros por categoria: DataShows / Projetores 4K, Laboratórios STEM, Tablets Educacionais, Kits Mídia / Podcast e Auditório.

### 4. Gestão de Corpo Docente & Grade Master
- Monitoramento de choques de horário na grade geral da escola (evita mesmo professor em duas turmas ou mesma turma com duas aulas simultâneas).
- Filtros por professor, dia da semana e turma.

### 5. Diário de Classe & Rotina Docente
- Registro simplificado de conteúdo ministrado e metodologia realizada.
- Modelos rápidos em 1 clique (Aula Expositiva, Laboratório Prático, Revisão Geral, Simulado/Avaliação).
- Registro de faltas e agendamento de datas de provas com tarefas de casa.

### 6. Relatórios Gerenciais & Exportação
- Exportação nativa para formato Excel (`.csv`).
- Layout otimizado para impressão / PDF institucional.
- Auditoria de taxas de ocupação por recurso e métricas por turma.

### 7. Paleta Visual & Design System
Construído com base nas diretrizes visuais institucionais:
- **Azul-marinho (`#16324F`):** Cabeçalhos executivos, barra lateral e contrastes estruturais.
- **Azul Principal (`#2563EB`):** Botões de ação primária, estados ativos e links.
- **Azul-claro (`#EFF6FF`):** Superfícies de seleção, cards de apoio e badges.
- **Fundo Neutro (`#F5F7FB`):** Interface limpa, descansada e responsiva.
- **Cores Semânticas:** Verde (`#16A34A` para disponível/aprovado), Amarelo (`#EAB308` para pendente/alertas) e Vermelho (`#DC2626` para conflitos/manutenções).

---

## 🔑 Credenciais de Demonstração (TCC)

| Perfil | E-mail Institucional | Senha | Nível de Permissão |
|---|---|---|---|
| **Diretora Geral** | `diretora@edugestao.demo` | `Diretor123!` | Acesso Total (Governança, Bloqueios e Aprovações) |
| **Professor(a)** | `professor@edugestao.demo` | `Professor123!` | Acesso Docente (Reservas, Diário e Grade) |

> 💡 **Auto-cadastro de Professores:** O sistema conta com uma aba **"Cadastrar Professor"** na tela de login, permitindo que qualquer membro da banca ou avaliador crie um perfil individual que é salvo localmente no navegador (`localStorage`).

---

## 💻 Como Rodar Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) versão 18 ou superior.
- Gerenciador de pacotes `npm` ou `yarn`.

### Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/SEU_USUARIO/edugestao.git

# 2. Acesse a pasta do projeto
cd edugestao

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Abra no seu navegador o endereço indicado (normalmente `http://localhost:3000` ou `http://localhost:5173`).

---

## 📤 Como Subir este Código para o seu GitHub Pessoal

Se você estiver exportando este projeto para a sua própria conta do GitHub, execute no terminal da pasta do projeto:

```bash
# 1. Inicie o repositório Git local (se ainda não iniciado)
git init
git branch -M main

# 2. Adicione todos os arquivos e faça o commit
git add .
git commit -m "feat: EduGestão - Sistema Integrado de Gestão Escolar (TCC)"

# 3. Crie um novo repositório vazio no seu GitHub (ex: edugestao)
# 4. Conecte ao seu repositório remoto:
git remote add origin https://github.com/SEU_USUARIO/edugestao.git

# 5. Envie para o GitHub:
git push -u origin main
```

---

## 🗄️ Arquitetura de Dados (PostgreSQL)

O projeto inclui o script SQL DDL completo compatível com **PostgreSQL 15+** e extensões `uuid-ossp` e `btree_gist` para exclusão atômica de sobreposição temporal (`EXCLUDE USING gist`):

- `users`: Usuários e papéis RBAC (`direction`, `teacher`).
- `resources`: Equipamentos multimídia e salas de aula especiais.
- `school_classes`: Turmas, anos letivos e indicadores de desempenho.
- `bookings`: Reservas e bloqueios prioritários com constraint anti-conflito.
- `master_schedules`: Matriz horária semanal sem choques docentes.
- `class_diaries`: Diário de classe simplificado, faltas e avaliações.
- `announcements`: Comunicados institucionais com marcação de destaque.

O script SQL completo pode ser visualizado e copiado diretamente na aba **"Esquema de Banco (TCC)"** dentro do sistema.

---

## 👨‍💻 Autor & Direitos Acadêmicos

Desenvolvido por **Jorge Manoel**  
Projeto de Conclusão de Curso (TCC) — Gestão Escolar e Tecnologia Educacional  
Instituto de Educação / Universidade  
Piauí, Brasil · 2026
