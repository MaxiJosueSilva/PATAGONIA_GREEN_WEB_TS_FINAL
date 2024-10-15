// import jwt_decode from 'jwt-decode';

// interface DecodedToken {
//   username: string;
//   role: string;
//   level: number;
//   exp: number;
// }

// export const getToken = (): string | null => {
//   return localStorage.getItem('token');
// };

// export const decodeToken = (token: string): DecodedToken | null => {
//   try {
//     return jwt_decode(token);
//   } catch (error) {
//     console.error('Error decoding token:', error);
//     return null;
//   }
// };

// export const isTokenValid = (token: string): boolean => {
//   const decodedToken = decodeToken(token);
//   if (!decodedToken) return false;
  
//   const currentTime = Date.now() / 1000;
//   return decodedToken.exp > currentTime;
// };

// export const getUserInfo = (): { username: string; role: string; level: number } | null => {
//   const token = getToken();
//   if (!token) return null;

//   const decodedToken = decodeToken(token);
//   if (!decodedToken) return null;

//   return {
//     username: decodedToken.username,
//     role: decodedToken.role,
//     level: decodedToken.level
//   };
// };