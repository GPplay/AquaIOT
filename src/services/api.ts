'use client';
// This file is intended to house all the backend API communication logic.

const API_BASE_URL = 'http://localhost:9001/api';

/**
 * Logs in a user by sending their credentials to the backend.
 * @param email The user's email.
 * @param password The user's password.
 * @returns An object containing the authentication token and user data.
 */
export async function login(email: string, password: string): Promise<{ token: string, user: any }> {
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
    // This will catch network errors (e.g., server is down)
    console.error('Network error:', error);
    throw new Error('No hay servidores disponibles.');
  }


  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error de autenticación. Por favor, verifica tus credenciales.' }));
    throw new Error(errorData.message || `Error ${response.status}: Falló el inicio de sesión`);
  }

  const token = response.headers.get('Authorization');
  if (!token) {
    throw new Error('No se encontró el token de autenticación en la respuesta.');
  }

  const user = await response.json();
  
  return { token, user };
}
