import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const alerts = [
  { id: 'ALRT001', risk: 'high', area: 'Barrio Chino', timestamp: '2024-07-29 14:30', sensor_val: '4.6m' },
  { id: 'ALRT002', risk: 'medium', area: 'Getsemaní', timestamp: '2024-07-29 12:15', sensor_val: '3.2m' },
  { id: 'ALRT003', risk: 'low', area: 'Bocagrande', timestamp: '2024-07-29 09:00', sensor_val: '2.1m' },
  { id: 'ALRT004', risk: 'high', area: 'El Pozón', timestamp: '2024-07-28 22:45', sensor_val: '4.8m' },
  { id: 'ALRT005', risk: 'medium', area: 'Manga', timestamp: '2024-07-28 18:00', sensor_val: '3.5m' },
];

const riskVariants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined } = {
  low: 'secondary',
  medium: 'default',
  high: 'destructive',
};

export function AlertsTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Alerts</CardTitle>
        <CardDescription>A log of recent flood risk alerts issued by the system.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Alert ID</TableHead>
                <TableHead>Risk Level</TableHead>
                <TableHead>Affected Area</TableHead>
                <TableHead>Sensor Reading</TableHead>
                <TableHead>Timestamp</TableHead>
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
