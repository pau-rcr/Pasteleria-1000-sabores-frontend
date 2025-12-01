import { MainLayout } from "@/components/templates/MainLayout";
import { ContactForm } from "@/components/organisms/ContactForm";
import { Card } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-display text-primary mb-4">
              Contáctanos
            </h1>
            <p className="text-lg text-muted-foreground">
              Estamos aquí para responder tus preguntas y recibir tus pedidos especiales
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div>
              <ContactForm />
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              <Card className="p-6">
                <h2 className="text-2xl font-bold mb-6">Información de Contacto</h2>
                
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Dirección</h3>
                      <p className="text-muted-foreground">
                        Av. Principal 1234
                        <br />
                        Santiago, Chile
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Teléfono</h3>
                      <p className="text-muted-foreground">+56 9 1234 5678</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">contacto@1000sabores.cl</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center shrink-0">
                      <Clock className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Horario</h3>
                      <p className="text-muted-foreground">
                        Lunes a Viernes: 9:00 - 20:00
                        <br />
                        Sábados: 10:00 - 18:00
                        <br />
                        Domingos: 10:00 - 14:00
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-primary/5 to-secondary/10 border-none">
                <h3 className="font-bold text-lg mb-2">Pedidos Especiales</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Para tortas personalizadas o pedidos grandes, contáctanos con al menos 48 horas
                  de anticipación. ¡Hacemos realidad tus ideas más dulces!
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
