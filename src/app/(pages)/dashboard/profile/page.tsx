import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit, AtSign, Phone } from "lucide-react";
import Link from "next/link";

// Placeholder user data
const user = {
  name: 'Juan Pérez',
  email: 'juan.perez@example.com',
  phone: '+57 300 123 4567',
  avatarUrl: 'https://picsum.photos/seed/user-avatar/128/128',
  initials: 'JP',
};

export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-headline text-3xl font-semibold">Perfil de Usuario</h1>
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="flex flex-col items-center text-center p-6">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatarUrl} alt={user.name} data-ai-hint="person face" />
            <AvatarFallback>{user.initials}</AvatarFallback>
          </Avatar>
          <CardTitle className="font-headline text-2xl">{user.name}</CardTitle>
          <CardDescription>Usuario de AquaGuard</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <AtSign className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm">{user.email}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-4">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <span className="flex-1 text-sm">{user.phone}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-6 border-t">
          <Button asChild className="w-full">
            <Link href="/dashboard/settings">
              <Edit className="mr-2" />
              Editar Perfil
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
