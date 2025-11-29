export const mockWeeklyWaterLevel = [
  { day: 'Dom', level: 1.8 },
  { day: 'Lun', level: 1.9 },
  { day: 'Mar', level: 2.1 },
  { day: 'Mié', level: 2.0 },
  { day: 'Jue', level: 2.4 },
  { day: 'Vie', level: 2.3 },
  { day Tarea', level: 2.5 },
];

export const mockDeviceData: { [key: string]: any } = {
  esp001: {
    currentMetrics: {
      waterLevel: 2.5,
      temperature: 28.5,
      pressure: 1012,
    },
    realtimeData: [
      { time: '14:30:00', waterLevel: 2.2, temperature: 28.1, pressure: 1012 },
      { time: '14:30:10', waterLevel: 2.3, temperature: 28.2, pressure: 1013 },
      { time: '14:30:20', waterLevel: 2.4, temperature: 28.3, pressure: 1012 },
      { time: '14:30:30', waterLevel: 2.5, temperature: 28.5, pressure: 1011 },
    ],
  },
  esp002: {
    currentMetrics: {
      waterLevel: 1.8,
      temperature: 27.9,
      pressure: 1015,
    },
    realtimeData: [
      { time: '14:30:00', waterLevel: 1.5, temperature: 27.6, pressure: 1014 },
      { time: '14:30:10', waterLevel: 1.6, temperature: 27.7, pressure: 1015 },
      { time: '14:30:20', waterLevel: 1.7, temperature: 27.8, pressure: 1015 },
      { time: '14:30:30', waterLevel: 1.8, temperature: 27.9, pressure: 1016 },
    ],
  },
  esp003: {
    currentMetrics: {
      waterLevel: 3.1,
      temperature: 29.1,
      pressure: 1009,
    },
    realtimeData: [
        { time: '14:30:00', waterLevel: 2.8, temperature: 28.8, pressure: 1010 },
        { time: '14:30:10', waterLevel: 2.9, temperature: 28.9, pressure: 1009 },
        { time: '14:30:20', waterLevel: 3.0, temperature: 29.0, pressure: 1009 },
        { time: '14:30:30', waterLevel: 3.1, temperature: 29.1, pressure: 1008 },
    ],
  },
};
