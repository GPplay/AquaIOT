'use client';

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal, Trash2, Edit, Wifi, WifiOff } from "lucide-react";
import { useState } from "react";

const initialSensors = [
  { id: 'SNS001', name: 'River Mouth Sensor', area: 'Barrio Chino', type: 'Water Level', status: 'online', last_reading: '4.6m', battery: 95 },
  { id: 'SNS002', name: 'Getsemaní Canal Sensor', area: 'Getsemaní', type: 'Water Level', status: 'online', last_reading: '3.2m', battery: 80 },
  { id: 'SNS003', name: 'Bocagrande Pier', area: 'Bocagrande', type: 'Tide Gauge', status: 'offline', last_reading: '2.1m', battery: 20 },
  { id: 'SNS004', name: 'El Pozón Bridge', area: 'El Pozón', type: 'Flow Rate', status: 'online', last_reading: '25 m³/s', battery: 100 },
  { id: 'SNS005', name: 'Manga Bay Sensor', area: 'Manga', type: 'Water Level', status: 'maintenance', last_reading: '3.5m', battery: 55 },
  { id: 'SNS006', name: 'Laguna del Cabrero', area: 'Marbella', type: 'Salinity', status: 'online', last_reading: '30 PSU', battery: 72 },
];

const statusConfig: { [key: string]: { variant: 'default' | 'secondary' | 'destructive' | 'outline' | null | undefined, icon: React.ReactNode, label: string } } = {
  online: { variant: 'default', icon: <Wifi className="h-3 w-3" />, label: 'Online' },
  offline: { variant: 'destructive', icon: <WifiOff className="h-3 w-3" />, label: 'Offline' },
  maintenance: { variant: 'secondary', icon: <Edit className="h-3 w-3" />, label: 'Maintenance' },
};

export function SensorsTable() {
    const [sensors, setSensors] = useState(initialSensors);

    const handleDelete = (id: string) => {
        setSensors(sensors.filter(sensor => sensor.id !== id));
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Sensors</CardTitle>
        <CardDescription>A list of all active and inactive sensors in the network.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative w-full overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sensor ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Battery</TableHead>
                <TableHead>Last Reading</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sensors.map((sensor) => (
                <TableRow key={sensor.id}>
                  <TableCell className="font-mono text-xs">{sensor.id}</TableCell>
                  <TableCell className="font-medium">{sensor.name}</TableCell>
                  <TableCell>{sensor.area}</TableCell>
                  <TableCell>{sensor.type}</TableCell>
                  <TableCell>
                    <Badge variant={statusConfig[sensor.status]?.variant} className="capitalize gap-1.5">
                        {statusConfig[sensor.status]?.icon}
                        {statusConfig[sensor.status]?.label}
                    </Badge>
                  </TableCell>
                  <TableCell>{sensor.battery}%</TableCell>
                  <TableCell>{sensor.last_reading}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                                <Edit className="mr-2" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive" onClick={() => handleDelete(sensor.id)}>
                                <Trash2 className="mr-2" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
