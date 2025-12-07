'use client';

// Este archivo está destinado a configurar y gestionar la conexión del cliente MQTT.

import mqtt from 'mqtt';
import { MQTT_BROKER_URL } from '@/config';

/**
 * Representa los datos que se esperan de un dispositivo ESP.
 */
export interface MqttMessage {
  device_id: string;
  event: 'data' | 'alert';
  level: number | 'HIGH' | 'MEDIUM' | 'LOW';
  temp?: number;
  atm?: number;
  data?: string; // For alert descriptions
}


/**
 * Función para conectar al broker MQTT y suscribirse a los topics dinámicos del usuario.
 * 
 * @param userId - El ID del usuario para construir el topic.
 * @param onMessageCallback - Una función que se llamará cada vez que se reciba un mensaje.
 *                            Toma el topic y el payload (como objeto DeviceData) como argumentos.
 */
export function connectToMqtt(userId: string, onMessageCallback: (topic: string, data: MqttMessage) => void) {
  console.log(`Intentando conectar al broker MQTT en ${MQTT_BROKER_URL}...`);

  const client = mqtt.connect(MQTT_BROKER_URL);

  client.on('connect', () => {
    console.log('¡Conectado al broker MQTT!');
    // Suscribirse al topic dinámico del usuario.
    // El wildcard '#' se usa para coincidir con todos los sub-topics de los dispositivos.
    const topicToSubscribe = `${userId}/esp/#`;
    client.subscribe(topicToSubscribe, (err) => {
      if (!err) {
        console.log(`Suscrito exitosamente al topic: ${topicToSubscribe}`);
      } else {
        console.error('Error en la suscripción:', err);
      }
    });
  });

  client.on('message', (topic, payload) => {
    try {
      // El payload llega como un Buffer, así que lo convertimos a string y luego a JSON.
      const messageString = payload.toString();
      const data: MqttMessage = JSON.parse(messageString);
      
      console.log(`Mensaje recibido en el topic [${topic}]:`, data);

      // Llamar al callback con los datos procesados.
      onMessageCallback(topic, data);

    } catch (error) {
      console.error('Error al procesar el mensaje MQTT:', error);
    }
  });

  client.on('error', (err) => {
    console.error('Error de conexión MQTT:', err);
    client.end(); // Cierra la conexión en caso de error
  });

  client.on('reconnect', () => {
    console.log('Reconectando al broker MQTT...');
  });

  client.on('close', () => {
    console.log('Conexión MQTT cerrada.');
  });

  // Devolvemos el cliente para que pueda ser utilizado en otros lugares si es necesario,
  // por ejemplo, para publicar mensajes o cerrar la conexión manualmente.
  return client;
}
