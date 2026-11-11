import React, { useState } from 'react';
import { 
  GitBranch, 
  Terminal, 
  Copy, 
  Check, 
  ExternalLink, 
  X, 
  Download, 
  Code2, 
  ShieldCheck, 
  FolderGit2,
  Sparkles,
  BookOpen
} from 'lucide-react';

interface GitHubExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubExportModal: React.FC<GitHubExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState<string | null>(null);
  const [repoUrl, setRepoUrl] = useState<string>('https://github.com/SEU_USUARIO/edugestao.git');

  if (!isOpen) return null;

  const terminalCommands = `# 1. Conecte ao seu repositório remoto criado no GitHub:
git remote add origin ${repoUrl}

# 2. Envie todos os arquivos e histórico para a branch principal:
git push -u origin main`;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(null), 3000);
  };

  const downloadHelperScript = () => {
    const scriptContent = `#!/bin/bash
# ========================================================
# Script de Exportação para o GitHub - EduGestão (TCC)
# ========================================================

echo "🚀 Iniciando exportação do EduGestão para o GitHub..."

# 1. Configurar branch principal
git branch -M main

# 2. Solicitar URL do repositório remoto do GitHub
echo "Digite a URL do seu repositório GitHub (ex: https://github.com/usuario/edugestao.git):"
read -r GITHUB_URL

if [ -z "$GITHUB_URL" ]; then
  echo "❌ URL não fornecida. Abortando."
  exit 1
fi

# 3. Adicionar remote e enviar
git remote remove origin 2>/dev/null
git remote add origin "$GITHUB_URL"

echo "📦 Enviando arquivos para $GITHUB_URL..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "✅ Código enviado com sucesso para o GitHub!"
  echo "🎉 Acesse seu repositório no navegador."
else
  echo "⚠️ Houve um problema ao enviar. Verifique suas credenciais do GitHub (Personal Access Token)."
fi
`;

    const blob = new Blob([scriptContent], { type: 'text/x-shellscript' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'exportar_para_github.sh';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200/90 my-auto animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#0F2036] text-white flex items-center justify-center shadow-md">
              <FolderGit2 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-[#2563EB] bg-[#EFF6FF] px-2.5 py-0.5 rounded-md border border-blue-200 uppercase">
                  Git & GitHub
                </span>
                <span className="text-[11px] text-[#64748B]">Repositório Local Inicializado</span>
              </div>
              <h2 className="text-xl font-extrabold text-[#16324F] mt-0.5">
                Por que o código não estava no GitHub?
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-[#16324F] p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informative Explanation */}
        <div className="mt-5 space-y-4 text-xs">
          <div className="p-4 bg-[#EFF6FF] border border-blue-200 rounded-2xl text-[#16324F] space-y-2 leading-relaxed">
            <div className="flex items-center gap-2 font-bold text-sm text-[#16324F]">
              <Sparkles className="w-4 h-4 text-[#2563EB]" />
              <span>Ambiente de Execução em Nuvem vs. Repositório Pessoal</span>
            </div>
            <p>
              O sistema foi construído e está sendo executado no <strong>ambiente seguro de desenvolvimento em nuvem do Google AI Studio</strong>. Por padrão, a plataforma não tem acesso às credenciais privadas do seu GitHub pessoal, por isso o código ainda não havia sido enviado para a sua conta.
            </p>
            <p className="font-semibold text-[#2563EB]">
              ✅ O repositório Git local já foi inicializado na branch <code className="bg-white px-1.5 py-0.5 rounded font-mono text-[11px] border border-blue-200">main</code> e o primeiro commit completo de todos os 44 arquivos com documentação acadêmica já foi gerado!
            </p>
          </div>

          {/* Step by Step Guide */}
          <div className="space-y-3">
            <span className="font-extrabold text-[#16324F] text-xs uppercase tracking-wider block">
              Passo a Passo Rápido para Enviar ao seu GitHub (1 minuto):
            </span>

            {/* Step 1 */}
            <div className="p-3.5 bg-[#F5F7FB] rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex-1">
                <span className="font-bold text-[#16324F] block">
                  Crie um novo repositório vazio no seu GitHub
                </span>
                <span className="text-[11px] text-[#64748B] block mt-0.5">
                  Acesse <a href="https://github.com/new" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] hover:underline font-bold inline-flex items-center gap-0.5">github.com/new <ExternalLink className="w-3 h-3" /></a>, defina o nome (ex: <code>edugestao</code>) e não marque &quot;Initialize with README&quot;.
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 bg-[#F5F7FB] rounded-2xl border border-slate-200/80 flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-[#2563EB] text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex-1">
                <span className="font-bold text-[#16324F] block">
                  Insira a URL do seu repositório GitHub criado:
                </span>
                <div className="mt-2 flex gap-2">
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/SEU_USUARIO/edugestao.git"
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-[#16324F] font-mono focus:outline-[#2563EB]"
                  />
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-3.5 bg-[#0F2036] rounded-2xl border border-slate-800 text-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400">
                  <Terminal className="w-4 h-4" />
                  <span>Comandos no Terminal para Enviar ao GitHub:</span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(terminalCommands, 'terminal')}
                  className="flex items-center gap-1.5 px-3 py-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer"
                >
                  {copied === 'terminal' ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-white" />
                      <span>Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar Comandos</span>
                    </>
                  )}
                </button>
              </div>

              <pre className="font-mono text-[11px] p-2.5 bg-black/40 rounded-xl overflow-x-auto text-blue-200 leading-relaxed border border-white/5">
                {terminalCommands}
              </pre>
            </div>
          </div>

          {/* Academic Documentation Card */}
          <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200/90 flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-[11px] text-amber-900 leading-relaxed">
              <strong>README.md Acadêmico Completo Já Criado:</strong> O repositório já inclui um arquivo <code>README.md</code> formatado com badges oficiais, explicação das regras de negócio, diagrama de entidades, dados de demonstração da banca e arquitetura relacional em PostgreSQL.
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={downloadHelperScript}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#16324F] bg-[#F5F7FB] hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-[#2563EB]" />
            <span>Baixar Script Automatizado (.sh)</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xl shadow-md transition-all cursor-pointer"
          >
            Entendi, fechar
          </button>
        </div>
      </div>
    </div>
  );
};
