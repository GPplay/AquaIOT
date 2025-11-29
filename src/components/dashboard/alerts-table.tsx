import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { id: 'ALRT001', risk: 'alto', device: 'Dispositivo Boca del Río', area: 'Barrio Chino', timestamp: '2024-07-29 14:30' },
  { id: 'ALRT002', risk: 'medio', device: 'Dispositivo Canal Getsemaní', area: 'Getsemaní', timestamp: '2024-07-29 12:15' },
  { id: 'ALRT003', risk: 'bajo', device: 'Muelle Bocagrande', area: 'Bocagrande', timestamp: '2024-07-29 09:00' },
  { id: 'ALRT004', risk: 'alto', device: 'Puente El Pozón', area: 'El Pozón', timestamp: '2024-07-28 22:45' },
  { id: 'ALRT005', risk: 'medio', device: 'Bahía de Manga', area: 'Manga', timestamp: '2024-07-28 18:00' },
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
                <TableHead>Dispositivo ESP</TableHead>
                <TableHead>Área Afectada</TableHead>
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
                  <TableCell>{alert.device}</TableCell>
                  <TableCell>{alert.area}</TableCell>
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
