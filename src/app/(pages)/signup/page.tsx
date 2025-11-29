import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SignupForm } from '@/components/auth/signup-form';
import Image from 'next/image';

export default function SignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md mx-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
             <Image src="/logo.png" alt="AquaGuard Logo" width={64} height={64} />
          </div>
          <CardTitle className="font-headline text-3xl">Crear una Cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para comenzar con AquaGuard.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignupForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{' '}
            <Link href="/login" className="font-semibold text-primary underline-offset-4 hover:underline">
              Inicia sesión
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
