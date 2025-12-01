import { useState, FormEvent } from "react";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Send } from "lucide-react";
import { sendContactMessage } from "@/services/contactService";
import { isValidEmail } from "@/utils/validators";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "El mensaje es requerido";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "El mensaje debe tener al menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await sendContactMessage(formData);
      setIsSuccess(true);
      setFormData({ name: "", email: "", message: "" });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSuccess(false), 5000);
    } catch (error) {
      setErrors({ submit: "Error al enviar el mensaje. Por favor intenta de nuevo." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 md:p-8">
      {isSuccess ? (
        <Alert className="bg-primary/10 border-primary">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <AlertDescription className="text-primary font-medium">
            ¡Mensaje enviado con éxito! Te responderemos pronto.
          </AlertDescription>
        </Alert>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Nombre"
            required
            error={errors.name}
            inputProps={{
              name: "name",
              value: formData.name,
              onChange: (e) => setFormData({ ...formData, name: e.target.value }),
              placeholder: "Tu nombre completo",
            }}
          />

          <FormField
            label="Email"
            type="email"
            required
            error={errors.email}
            inputProps={{
              name: "email",
              value: formData.email,
              onChange: (e) => setFormData({ ...formData, email: e.target.value }),
              placeholder: "tu@email.com",
            }}
          />

          <FormField
            label="Mensaje"
            required
            multiline
            error={errors.message}
            textareaProps={{
              name: "message",
              value: formData.message,
              onChange: (e) => setFormData({ ...formData, message: e.target.value }),
              placeholder: "Cuéntanos cómo podemos ayudarte...",
              rows: 5,
            }}
          />

          {errors.submit && (
            <Alert variant="destructive">
              <AlertDescription>{errors.submit}</AlertDescription>
            </Alert>
          )}

          <Button
            type="submit"
            variant="hero"
            size="lg"
            className="w-full"
            disabled={isSubmitting}
          >
            <Send className="mr-2 h-5 w-5" />
            {isSubmitting ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </form>
      )}
    </Card>
  );
}
