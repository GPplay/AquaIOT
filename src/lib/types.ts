export type Alert = {
  id: number;
  value: number;
  checked: boolean;
  user_id: number;
  address: string;
  level: 'HIGH' | 'MEDIUM' | 'LOW';
  date: string;
  device_id: string;
  description: string;
};
