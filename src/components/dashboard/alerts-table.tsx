import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { id: 'ALRT001', risk: 'alto', area: 'Barrio Chino', timestamp: '2024-07-29 14:30', sensor_val: '4.6m' },
  { id: 'ALRT002', risk: 'medio', area: 'Getsemaní', timestamp: '2024-07-29 12:15', sensor_val: '3.2m' },
  { id: 'ALRT003', risk: 'bajo', area: 'Bocagrande', timestamp: '2024-07-29 09:00', sensor_val: '2.1m' },
  { id: 'ALRT004', risk: 'alto', area: 'El Pozón', timestamp: '2024-07-28 22:45', sensor_val: '4.8m' },
  { id: 'ALRT005', risk: 'medio', area: 'Manga', timestamp: '2024-07-28 18:00', sensor_val: '3.5m' },
];

const riskVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined } = {
  bajo: 'secondary',
  medio: 'default',
  alto: 'destructive',
};

export function AlertsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Alertas Recientes</CardTitle>
        <CardDescription>Un registro de las alertas de riesgo de inundación recientes emitidas por el sistema.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID de Alerta</TableHead>
                <TableHead>Nivel de Riesgo</TableHead>
                <TableHead>Área Afectada</TableHead>
                <TableHead>Lectura del Dispositivo</TableHead>
                <TableHead>Fecha y Hora</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell className="font-medium">{alert.id}</TableCell>
                  <TableCell>
                    <Badge variant={riskVariants[alert.risk]} className="capitalize">{alert.risk}</Badge>
                  </TableCell>
                  <TableCell>{alert.area}</TableCell>
                  <TableCell>{alert.sensor_val}</TableCell>
                  <TableCell>{alert.timestamp}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
