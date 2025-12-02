'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/services/api';

const formSchema = z.object({
  email: z.string().email('Dirección de correo electrónico inválida.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: '', password: '' },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    if (values.email === 'admin@aquaguard.com' && values.password === 'admin123') {
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', 'mock-admin-token');
        // For testing purposes, let's set a mock user ID
        localStorage.setItem('userId', '1');
      }
      toast({
        title: "Inicio de Sesión de Administrador",
        description: "¡Bienvenido, Administrador de Pruebas!",
      });
      router.push('/dashboard');
      setLoading(false);
      return;
    }
    
    try {
      const { token, userId } = await login(values.email, values.password);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('authToken', token);
        localStorage.setItem('userId', userId);
      }
      
      toast({
        title: "Inicio de Sesión Exitoso",
        description: "¡Bienvenido de nuevo!",
      });

      router.push('/dashboard');

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falló el inicio de sesión",
        description: error.message || "El correo electrónico o la contraseña son incorrectos.",
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo Electrónico</FormLabel>
              <FormControl>
                <Input placeholder="tu.email@ejemplo.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Iniciar Sesión
        </Button>
      </form>
    </Form>
  );
}
