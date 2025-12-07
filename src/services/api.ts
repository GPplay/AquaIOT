'use client';
// This file is intended to house all the backend API communication logic.

import type { Alert } from "@/lib/types";
import { API_BASE_URL } from '@/config';

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
    console.error("Connection error during login:", error);
    throw new Error('No se pudo conectar con el servidor.');
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


/**
 * Fetches the list of alerts from the backend.
 * @returns A promise that resolves to an array of alerts.
 */
export async function getAlerts(): Promise<Alert[]> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;

  if (!token) {
    // Return empty array if no token is found, as user might not be logged in.
    return [];
  }

  let response;
  try {
    response = await fetch(`${API_BASE_URL}/alert/`, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Connection error fetching alerts:", error);
    throw new Error("No se pudo conectar con el servidor para obtener las alertas.");
  }


  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error al cargar las alertas.' }));
    throw new Error(errorData.message || `Error ${response.status}: Falló la carga de alertas`);
  }

  const result = await response.json();
  return result.data;
}


/**
 * Marks an alert as checked.
 * @param alertId The ID of the alert to mark as checked.
 * @returns A promise that resolves to the updated alert.
 */
export async function checkAlert(alertId: number): Promise<Alert> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
        throw new Error('No se encontró el token de autenticación.');
    }

    const response = await fetch(`${API_BASE_URL}/alert/${alertId}/check`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Error al actualizar la alerta.' }));
        throw new Error(errorData.message || `Error ${response.status}: Falló la actualización de la alerta`);
    }

    const result = await response.json();
    return result.data;
}


// Device Management API functions

async function getAuthToken() {
    const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
    if (!token) {
        throw new Error('No se encontró el token de autenticación.');
    }
    return token;
}

export async function getDevices() {
    const token = await getAuthToken();
    let response;
    try {
        response = await fetch(`${API_BASE_URL}/device/`, {
            method: 'GET',
            headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
    } catch (error) {
        console.error("Connection error fetching devices:", error);
        throw new Error("No se pudo conectar con el servidor.");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al obtener los dispositivos.');
    }
    const result = await response.json();
    return result;
}

export async function addDevice(deviceData: { id: string; name: string; address: string; }) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/device/`, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al añadir el dispositivo.');
    }
    const result = await response.json();
    return result.data;
}

export async function updateDevice(macAddress: string, deviceData: { name: string; address: string }) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/device/${macAddress}`, {
        method: 'PUT',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceData),
    });
    if (!response.ok) {
        throw new Error('Error al actualizar el dispositivo.');
    }
    const result = await response.json();
    return result.data;
}

export async function deleteDevice(macAddress: string) {
    const token = await getAuthToken();
    const response = await fetch(`${API_BASE_URL}/device/${macAddress}`, {
        method: 'DELETE',
        headers: {
            'accept': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
    });
    if (!response.ok) {
        throw new Error('Error al eliminar el dispositivo.');
    }
    const result = await response.json();
    return result.data;
}
