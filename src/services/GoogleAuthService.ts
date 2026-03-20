/**
 * Google OAuth Authentication Service
 * Credentials loaded from .env — never hardcode secrets here.
 */

const GOOGLE_CONFIG = {
  client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID as string,
  project_id: "erp-490705",
  client_secret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET as string,
  token_uri: "https://oauth2.googleapis.com/token",
};

interface GoogleTokenPayload {
  iss: string; azp: string; aud: string; sub: string;
  email: string; email_verified: boolean; at_hash: string;
  name: string; picture: string; given_name: string;
  family_name: string; locale: string; iat: number; exp: number;
}

export const decodeGoogleToken = (token: string): GoogleTokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join('')
    );
    return JSON.parse(jsonPayload);
  } catch { return null; }
};

export const verifyGoogleToken = async (token: string): Promise<GoogleTokenPayload | null> => {
  try {
    const res = await fetch('https://oauth2.googleapis.com/tokeninfo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `id_token=${token}`,
    });
    if (!res.ok) throw new Error('Token verification failed');
    const data = await res.json();
    if (data.aud !== GOOGLE_CONFIG.client_id) throw new Error('Audience mismatch');
    return data as GoogleTokenPayload;
  } catch { return null; }
};

export const getUserRoleFromEmail = (email: string): 'super_admin' | 'admin' =>
  email.toLowerCase().includes('superadmin') ? 'super_admin' : 'admin';

export const handleGoogleSignInResponse = async (response: any) => {
  if (!response.credential) throw new Error('No credential');
  const payload = decodeGoogleToken(response.credential);
  if (!payload) throw new Error('Failed to decode token');
  return {
    token: response.credential,
    user: {
      id: payload.sub, email: payload.email, name: payload.name,
      picture: payload.picture, givenName: payload.given_name, familyName: payload.family_name,
    },
    role: getUserRoleFromEmail(payload.email),
  };
};

export default { decodeGoogleToken, verifyGoogleToken, getUserRoleFromEmail, handleGoogleSignInResponse };
