import { useState, FormEvent } from "react";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { isValidEmail } from "@/utils/validators";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const expired = searchParams.get("expired");

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!isValidEmail(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.password) {
      newErrors.password = "La contraseña es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate("/");
    } catch (error: any) {
      setErrors({
        submit:
          error.response?.data?.message ||
          "Error al iniciar sesión. Verifica tus credenciales.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-display text-primary">Bienvenido</h1>
          <p className="text-muted-foreground">
            Ingresa a tu cuenta para acceder a tus beneficios
          </p>
        </div>

        {expired && (
          <Alert variant="destructive">
            <AlertDescription>Tu sesión ha expirado. Por favor inicia sesión nuevamente.</AlertDescription>
          </Alert>
        )}

        {errors.submit && (
          <Alert variant="destructive">
            <AlertDescription>{errors.submit}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            label="Contraseña"
            type="password"
            required
            error={errors.password}
            inputProps={{
              name: "password",
              value: formData.password,
              onChange: (e) => setFormData({ ...formData, password: e.target.value }),
              placeholder: "••••••••",
            }}
          />

          <Button
            type="submit"
            variant="hero"
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Ingresando..." : "Iniciar Sesión"}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">¿No tienes cuenta? </span>
          <button
            onClick={() => navigate("/registro")}
            className="text-primary font-medium hover:underline"
          >
            Regístrate aquí
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}
