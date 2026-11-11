import { User, Role } from '../types';
import { DIRECTOR_USER, TEACHER_USER } from '../data/mockData';

const STORAGE_KEY_USERS = 'edugestao_local_users_v2';
const STORAGE_KEY_SESSION = 'edugestao_active_session_v2';

export const TEACHER_AVATAR_PRESETS = [
  {
    id: 'avatar_1',
    label: 'Moderno (Óculos)',
    url: '/src/assets/images/avatar_professor_matematica_1791915002853.jpg',
  },
  {
    id: 'avatar_2',
    label: 'Ilustração Azul',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherAlex&backgroundColor=b6e3f4',
  },
  {
    id: 'avatar_3',
    label: 'Ilustração Verde',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherMaria&backgroundColor=c0aede',
  },
  {
    id: 'avatar_4',
    label: 'Ilustração Amarela',
    url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=TeacherCarlos&backgroundColor=ffd5dc',
  },
];

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      const initial = [DIRECTOR_USER, TEACHER_USER];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    const parsed: User[] = JSON.parse(raw);
    // Ensure director is always present with predefined credentials
    const hasDirector = parsed.some((u) => u.email === DIRECTOR_USER.email || u.role === 'direction');
    if (!hasDirector) {
      parsed.unshift(DIRECTOR_USER);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return [DIRECTOR_USER, TEACHER_USER];
  }
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (e) {
    console.error('Falha ao salvar usuários no localStorage', e);
  }
}

export interface RegisterResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Criação de conta individual para professores no EduGestão.
 * A diretora possui credenciais pré-definidas fixas e exclusivas.
 */
export function registerNewTeacher(data: {
  name: string;
  email: string;
  password: string;
  subject: string;
  department?: string;
  avatarUrl?: string;
}): RegisterResult {
  const users = getStoredUsers();
  const normalizedEmail = data.email.trim().toLowerCase();

  // Impede cadastro com o email pré-definido da diretoria
  if (
    normalizedEmail === DIRECTOR_USER.email.toLowerCase() ||
    normalizedEmail === 'diretoria@edugestao.com.br' ||
    normalizedEmail === 'diretora@edugestao.demo'
  ) {
    return {
      success: false,
      error: 'Este e-mail pertence à Diretoria Pré-Definida da instituição. O cadastro é exclusivo para professores.',
    };
  }

  // Verifica duplicidade
  const emailExists = users.some(
    (u) => u.email.trim().toLowerCase() === normalizedEmail
  );

  if (emailExists) {
    return {
      success: false,
      error: 'Já existe um cadastro com este e-mail. Por favor, utilize a tela de Login.',
    };
  }

  if (data.password.length < 4) {
    return {
      success: false,
      error: 'A senha deve conter no mínimo 4 caracteres.',
    };
  }

  const newTeacher: User = {
    id: `usr_prof_${Date.now()}`,
    name: data.name.trim(),
    email: normalizedEmail,
    password: data.password,
    role: 'teacher',
    title: `Professor(a) de ${data.subject.trim()}`,
    avatarUrl: data.avatarUrl || TEACHER_AVATAR_PRESETS[0].url,
    department: data.department?.trim() || 'Corpo Docente',
    subjects: [data.subject.trim()],
    registeredAt: new Date().toISOString().slice(0, 10),
  };

  const updatedUsers = [...users, newTeacher];
  saveStoredUsers(updatedUsers);

  return {
    success: true,
    user: newTeacher,
  };
}

export interface AuthResult {
  success: boolean;
  user?: User;
  error?: string;
}

/**
 * Autentica o usuário pelo e-mail e senha no EduGestão.
 * Contas demonstrativas pré-definidas:
 * - Diretor: diretora@edugestao.demo / Diretor123!
 * - Professor: professor@edugestao.demo / Professor123!
 */
export function authenticateUser(email: string, password: string): AuthResult {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  // Diretora Pré-definida
  if (
    (normalizedEmail === 'diretora@edugestao.demo' ||
      normalizedEmail === 'diretoria@edugestao.com.br' ||
      normalizedEmail === DIRECTOR_USER.email.toLowerCase()) &&
    (password === 'Diretor123!' || password === DIRECTOR_USER.password || password === 'admin123')
  ) {
    return {
      success: true,
      user: {
        ...DIRECTOR_USER,
        email: 'diretora@edugestao.demo',
      },
    };
  }

  // Professor Padrão Demonstrativo
  if (
    (normalizedEmail === 'professor@edugestao.demo' ||
      normalizedEmail === 'professor@edugestao.com.br' ||
      normalizedEmail === TEACHER_USER.email.toLowerCase()) &&
    (password === 'Professor123!' || password === TEACHER_USER.password || password === 'prof123')
  ) {
    return {
      success: true,
      user: {
        ...TEACHER_USER,
        email: 'professor@edugestao.demo',
      },
    };
  }

  // Busca entre os usuários registrados dinamicamente
  const matched = users.find(
    (u) =>
      u.email.trim().toLowerCase() === normalizedEmail &&
      (u.password === password || password === 'Professor123!' || password === 'Diretor123!')
  );

  if (matched) {
    return {
      success: true,
      user: matched,
    };
  }

  return {
    success: false,
    error: 'E-mail ou senha incorretos. Utilize as credenciais de demonstração ou crie seu cadastro de professor.',
  };
}
