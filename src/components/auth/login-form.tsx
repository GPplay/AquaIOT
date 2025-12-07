'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { login } from '@/services/api';

const formSchema = z.object({
  email: z.string().email('Dirección de correo electrónico inválida.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
});

export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
        localStorage.setItem('userId', '1');
        // Add a test device for the admin user
        const testDevice = {
          name: 'Dispositivo de Prueba (Admin)',
          address: 'Oficina Principal',
          id: 'AA:BB:CC:DD:EE:FF',
          user_id: 1,
          status: 'OFF'
        };
        localStorage.setItem('testDevice', JSON.stringify(testDevice));
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
      // Clear test device if it exists
      if (typeof window !== 'undefined') {
        localStorage.removeItem('testDevice');
      }

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
              <div className="relative">
                <FormControl>
                  <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">{showPassword ? 'Ocultar' : 'Mostrar'} contraseña</span>
                </Button>
              </div>
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
