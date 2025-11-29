'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres.'),
  area: z.string().min(3, 'La ubicación debe tener al menos 3 caracteres.'),
  macAddress: z.string().regex(/^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/, 'La dirección MAC no es válida.'),
});

type FormValues = z.infer<typeof formSchema>;

export function AddSensorDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      area: '',
      macAddress: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    // Simulate API call to add a sensor
    await new Promise(resolve => setTimeout(resolve, 1500));
    console.log('Nuevo dispositivo añadido:', values);
    setLoading(false);
    setOpen(false);
    form.reset();
    toast({
        title: "Dispositivo Añadido",
        description: `El dispositivo "${values.name}" ha sido añadido correctamente.`,
    })
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
            {children}
        </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline text-2xl">Añadir Nuevo Dispositivo ESP</DialogTitle>
          <DialogDescription>
            Introduce los detalles del nuevo dispositivo para conectarlo a la red de AquaGuard.
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
            <FormField
              control={form.control}
              name="macAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección MAC del ESP</FormLabel>
                  <FormControl>
                    <Input placeholder="00:1B:44:11:3A:B7" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={loading}>
                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                Añadir Dispositivo
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
