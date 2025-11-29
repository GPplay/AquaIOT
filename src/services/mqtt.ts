// Este archivo está destinado a configurar y gestionar la conexión del cliente MQTT.
// Debido al entorno de desarrollo, no es posible establecer una conexión MQTT real aquí.
// En su lugar, hemos preparado el código para que pueda integrarlo fácilmente.

// PASO 1: Instale la biblioteca MQTT
// La dependencia 'mqtt' ya ha sido añadida a su package.json.
// Simplemente ejecute `npm install` en su terminal para instalarla.

import mqtt from 'mqtt';

// PASO 2: Configure los detalles de su broker MQTT
const MQTT_BROKER_URL = 'mqtt://your_broker_address'; // Reemplace con la URL de su broker
const MQTT_TOPIC_PREFIX = 'devices/esp'; // Prefijo del topic para los dispositivos ESP

/**
 * Representa los datos que se esperan de un dispositivo ESP.
 */
export interface DeviceData {
  waterLevel: number;
  temperature: number;
  pressure: number;
  timestamp: string;
}

/**
 * Función para conectar al broker MQTT y suscribirse a los topics.
 * 
 * @param onMessageCallback - Una función que se llamará cada vez que se reciba un mensaje.
 *                            Toma el topic y el payload (como objeto DeviceData) como argumentos.
 */
export function connectToMqtt(onMessageCallback: (topic: string, data: DeviceData) => void) {
  console.log('Intentando conectar al broker MQTT...');

  const client = mqtt.connect(MQTT_BROKER_URL);

  client.on('connect', () => {
    console.log('¡Conectado al broker MQTT!');
    // Suscribirse a los topics de todos los dispositivos. 
    // El wildcard '+' se usa para coincidir con cualquier ID de dispositivo.
    const topicToSubscribe = `${MQTT_TOPIC_PREFIX}/+/data`;
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
      const data: DeviceData = JSON.parse(messageString);
      
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

// Ejemplo de cómo podría usar esta función en un componente de React (por ejemplo, en su layout principal o proveedor de contexto):
/*
useEffect(() => {
  const handleNewData = (topic, data) => {
    // Aquí actualiza el estado de su aplicación con los nuevos datos.
    // Puede usar un store de estado como Zustand, Redux, o el Context API de React.
    console.log('Actualizando UI con:', data);
  };

  const mqttClient = connectToMqtt(handleNewData);

  // Limpieza: asegúrese de cerrar la conexión cuando el componente se desmonte.
  return () => {
    if (mqttClient) {
      mqttClient.end();
    }
  };
}, []);
*/
