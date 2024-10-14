// // Simulación de una base de datos de usuarios
// const users = {
//   "Maxi": { password: "MAXI", role: "admin", level: 10 }
// };

// export const login = (username: string, password: string): Promise<any> => {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       const user = users[username as keyof typeof users];
//       if (user && user.password === password) {
//         resolve({
//           access_token: "fake_token_for_" + username,
//           username: username,
//           role: user.role,
//           level: user.level
//         });
//       } else {
//         reject(new Error("Credenciales inválidas"));
//       }
//     }, 300); // Simulamos un pequeño retraso para imitar una llamada a la red
//   });
// };

import bcrypt from 'bcryptjs';
import { fetchUsers, fetchActiveSessions, createSession, logLogin, deleteSession } from '../redux/slices/userSlice';
import { store } from '../redux/store';

const ONE_HOUR = 60 * 60 * 1000;

export const login = async (username: string, password: string): Promise<string> => {
  await store.dispatch(fetchUsers());
  await store.dispatch(fetchActiveSessions());
  const users = store.getState().users.users;
  const activeSessions = store.getState().users.activeSessions;

  const user = users.find((user: any) => user.username === username);
  
  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      const token = btoa(encodeURIComponent(JSON.stringify({
        username: user.username,
        level: user.level,
        role: user.role,
        exp: Math.floor(Date.now() / 1000) + (60 * 60)
      })));

      await store.dispatch(createSession({ userId: user.id, token, expiresAt: new Date(Date.now() + ONE_HOUR) }));

      await store.dispatch(logLogin({
        user_id: user.id,
        login_time: new Date().toISOString(),
      }));

      localStorage.setItem('token', token);
      localStorage.setItem('username', user.username);
      localStorage.setItem('userLevel', user.level.toString());
      localStorage.setItem('userRole', user.role);
      return token;
    }
  }
  throw new Error('Credenciales inválidas');
};

export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

export const decodeToken = (): any | null => {
  const token = getToken();
  if (!token) return null;
  try {
    const decoded = JSON.parse(decodeURIComponent(atob(token)));
    return decoded;
  } catch (error) {
    console.error('Error al decodificar el token:', error);
    return null;
  }
};

export const isAuthenticated = (): boolean => {
  const token = getToken();
  if (!token) {
    return false;
  }
  const decoded = decodeToken();
  if (!decoded) {
    return false;
  }
  const isExpired = decoded.exp <= Math.floor(Date.now() / 1000);
  if (isExpired) {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('userLevel');
    localStorage.removeItem('userRole');
    store.dispatch(deleteSession(token));
    return false;
  }

  return true;
};

export const logout = async (): Promise<void> => {
  const token = getToken();
  if (token) {
    const decoded = decodeToken();
    if (decoded) {
      await store.dispatch(deleteSession(token));
    }
  }
  localStorage.removeItem('token');
  localStorage.removeItem('username');
  localStorage.removeItem('userLevel');
  localStorage.removeItem('userRole');
};

export const getActiveUsers = async (): Promise<Array<{userId: string, token: string, createdAt: string, expiresAt: string}>> => {
  await store.dispatch(fetchActiveSessions());
  const activeSessions = store.getState().users.activeSessions;
  return activeSessions.map((session: any) => ({
    userId: session.user_id,
    token: session.token,
    createdAt: session.created_at,
    expiresAt: session.expires_at,
  }));
};