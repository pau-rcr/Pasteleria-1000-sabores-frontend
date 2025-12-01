import { MainLayout } from "@/components/templates/MainLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { getAge, isBirthdayToday } from "@/utils/date";
import { ROLES } from "@/config/roles";
import { Gift, Cake, Sparkles, User, Mail, Calendar } from "lucide-react";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const age = getAge(user.dateOfBirth);
  const isBirthday = isBirthdayToday(user.dateOfBirth);
  const hasAge50Discount = age >= 50;

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-display text-primary mb-8">
            Mi Perfil
          </h1>

          {/* User Info */}
          <Card className="p-8 mb-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold mb-2">{user.name}</h2>
                <Badge variant="secondary">{ROLES[user.role]}</Badge>
              </div>
              <div className="w-20 h-20 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-3xl font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Fecha de Nacimiento</p>
                  <p className="font-medium">
                    {new Date(user.dateOfBirth).toLocaleDateString("es-CL")} ({age} años)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Estudiante Duoc</p>
                  <p className="font-medium">{user.isDuocStudent ? "Sí" : "No"}</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Benefits */}
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Tus Beneficios Activos</h2>

            {isBirthday && user.isDuocStudent && (
              <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center shrink-0">
                    <Cake className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      ¡Feliz Cumpleaños! 🎉
                    </h3>
                    <p className="text-muted-foreground mb-2">
                      Como estudiante de Duoc UC, tienes una torta gratis hoy. ¡Disfruta tu día especial!
                    </p>
                    <Badge variant="default">Activo Hoy</Badge>
                  </div>
                </div>
              </Card>
            )}

            {hasAge50Discount && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                    <Gift className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">50% de Descuento</h3>
                    <p className="text-muted-foreground mb-2">
                      Por ser mayor de 50 años, disfrutas de un 50% de descuento en todas tus compras.
                    </p>
                    <Badge variant="secondary">Permanente</Badge>
                  </div>
                </div>
              </Card>
            )}

            {user.hasFelices50 && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                    <Sparkles className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Código FELICES50</h3>
                    <p className="text-muted-foreground mb-2">
                      Tienes activo el código promocional FELICES50 que te da un 10% de descuento adicional.
                    </p>
                    <Badge variant="secondary">De por vida</Badge>
                  </div>
                </div>
              </Card>
            )}

            {user.isDuocStudent && !isBirthday && (
              <Card className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                    <Cake className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">Beneficio Cumpleaños Duoc</h3>
                    <p className="text-muted-foreground mb-2">
                      Como estudiante de Duoc UC, recibirás una torta gratis el día de tu cumpleaños.
                    </p>
                    <Badge variant="secondary">En tu cumpleaños</Badge>
                  </div>
                </div>
              </Card>
            )}

            {!hasAge50Discount && !user.hasFelices50 && !user.isDuocStudent && (
              <Card className="p-6 text-center">
                <p className="text-muted-foreground">
                  No tienes beneficios activos actualmente. Sigue disfrutando de nuestros productos
                  y mantente atento a nuevas promociones.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
