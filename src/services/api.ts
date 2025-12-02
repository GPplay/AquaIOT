'use client';
// This file is intended to house all the backend API communication logic.

const API_BASE_URL = 'http://localhost:9001';

/**
 * Decodes a JWT token to extract its payload.
 * @param token The JWT token string.
 * @returns The decoded payload object or null if decoding fails.
 */
function decodeJwt(token: string): { [key: string]: any } | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Failed to decode JWT:", error);
    return null;
  }
}

/**
 * Logs in a user by sending their credentials to the backend.
 * @param email The user's email.
 * @param password The user's password.
 * @returns An object containing the authentication token and user ID.
 */
export async function login(email: string, password: string): Promise<{ token: string; userId: string }> {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
  } catch (error) {
    console.log('no se encontro base de datos');
    throw new Error('no se encontro servidor');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de autenticación. Por favor, verifica tus credenciales.' }));
    throw new Error(errorData.message || `Error ${response.status}: Falló el inicio de sesión`);
  }

  const token = response.headers.get('Authorization');
  if (!token) {
    throw new Error('No se encontró el token de autenticación en la respuesta.');
  }

  const decodedPayload = decodeJwt(token);
  const userId = decodedPayload?.user_id;

  if (!userId) {
    throw new Error('No se pudo encontrar el user_id en el token.');
  }

  return { token, userId: String(userId) };
}
