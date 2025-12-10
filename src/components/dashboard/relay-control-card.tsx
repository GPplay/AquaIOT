'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDevices } from "@/hooks/use-devices";
import { Zap } from "lucide-react";

export function RelayControlCard() {
    const { selectedDevice, deviceData, sendCommand, loading } = useDevices();
    
    const isDisabled = !selectedDevice || loading;
    const relayStatus = deviceData[selectedDevice?.macAddress || '']?.relayStatus === 'ON';

    const handleSwitchChange = (isChecked: boolean) => {
        if (isDisabled) return;
        const command = isChecked ? 'ON' : 'OFF';
        sendCommand(command);
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Control de Relé</CardTitle>
                <Zap className="text-muted-foreground h-5 w-5"/>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-between py-2">
                    <Label htmlFor="relay-switch" className="font-bold text-lg">
                        Actuador
                    </Label>
                    <Switch
                        id="relay-switch"
                        checked={relayStatus}
                        onCheckedChange={handleSwitchChange}
                        disabled={isDisabled}
                        aria-label="Relay Switch"
                    />
                </div>
                <p className="text-xs text-muted-foreground">
                    {isDisabled ? "Seleccione un dispositivo" : `El relé está ${relayStatus ? 'encendido' : 'apagado'}.`}
                </p>
            </CardContent>
        </Card>
    );
}
