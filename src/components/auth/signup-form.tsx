'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres.'),
  email: z.string().email('Dirección de correo electrónico inválida.'),
  phonePrefix: z.string(),
  phoneNumber: z.string().min(7, 'El número de teléfono debe tener al menos 7 dígitos.').regex(/^\d+$/, 'Solo se permiten números.'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
  confirmPassword: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres.'),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
})
.refine((data) => {
    if (data.phonePrefix === '+57') {
        return data.phoneNumber.startsWith('3') && data.phoneNumber.length === 10;
    }
    return true;
    }, {
    message: "Para Colombia (+57), el número debe empezar por 3 y tener 10 dígitos.",
    path: ["phoneNumber"],
})
.refine((data) => {
    if (data.phonePrefix === '+1') {
        return data.phoneNumber.length === 10;
    }
    return true;
    }, {
    message: "Para USA (+1), el número debe tener 10 dígitos.",
    path: ["phoneNumber"],
})
.refine((data) => {
    if (data.phonePrefix === '+52') {
        return data.phoneNumber.length === 10;
    }
    return true;
    }, {
    message: "Para México (+52), el número debe tener 10 dígitos.",
    path: ["phoneNumber"],
});


export function SignupForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: '', email: '', phonePrefix: '+57', phoneNumber: '', password: '', confirmPassword: '' },
  });
  
  const selectedPrefix = form.watch('phonePrefix');

  const placeholder = useMemo(() => {
    switch (selectedPrefix) {
      case '+57':
        return '3001234567';
      case '+1':
        return '2025550123';
      case '+52':
        return '5512345678';
      default:
        return 'Tu número de teléfono';
    }
  }, [selectedPrefix]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    
    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        // As requested, show a specific error message if registration fails
        throw new Error("No se pudo registrar revise sus datos");
      }

      // Handle successful registration
      toast({
        title: "Registro Exitoso",
        description: "¡Bienvenido a AquaGuard! Serás redirigido para iniciar sesión.",
      });
      router.push('/login');

    } catch (error: any) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Falló el Registro",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu Nombre" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
        <div className="flex gap-2">
            <FormField
            control={form.control}
            name="phonePrefix"
            render={({ field }) => (
                <FormItem className="w-1/3">
                <FormLabel>Prefijo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Prefijo" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="+57">+57 (COL)</SelectItem>
                        <SelectItem value="+1">+1 (USA)</SelectItem>
                        <SelectItem value="+52">+52 (MEX)</SelectItem>
                    </SelectContent>
                </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
                <FormItem className="w-2/3">
                <FormLabel>Número de Teléfono</FormLabel>
                <FormControl>
                    <Input type="tel" inputMode='numeric' placeholder={placeholder} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar Contraseña</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                </FormControl>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 text-muted-foreground"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff /> : <Eye />}
                  <span className="sr-only">{showConfirmPassword ? 'Ocultar' : 'Mostrar'} contraseña</span>
                </Button>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Registrarse
        </Button>
      </form>
    </Form>
  );
}
