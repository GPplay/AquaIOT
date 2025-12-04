'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateDevice } from '@/services/api';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  area: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres.'),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSensorDialogProps {
  sensor: { name: string; area: string; macAddress: string; };
  onUpdate: () => void;
  children: React.ReactNode;
}

export function EditSensorDialog({ sensor, onUpdate, children }: EditSensorDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: sensor.name,
      area: sensor.area,
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
          name: sensor.name,
          area: sensor.area,
      });
    }
  }, [open, sensor, form]);

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
        await updateDevice(sensor.macAddress, values);
        toast({
            title: "Dispositivo Actualizado",
            description: `El dispositivo "${values.name}" ha sido actualizado correctamente.`,
        });
        onUpdate();
        setLoading(false);
        setOpen(false);
    } catch (error: any) {
        setLoading(false);
        toast({
            variant: "destructive",
            title: "Error",
            description: error.message || 'No se pudo actualizar el dispositivo.',
        });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild onClick={(e) => { e.stopPropagation(); setOpen(true); }}>
            {children}
        </DialogTrigger>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Editar Dispositivo</DialogTitle>
          <DialogDescription>
            Actualiza los detalles del dispositivo. La dirección MAC no se puede cambiar.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Dispositivo</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Dispositivo Boca del Río" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="area"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación / Área</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Barrio Chino" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormItem>
                <FormLabel>Dirección MAC</FormLabel>
                <FormControl>
                    <Input readOnly disabled value={sensor.macAddress} />
                </FormControl>
                <FormMessage />
            </FormItem>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
