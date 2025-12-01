import { useState, FormEvent } from "react";
import { AuthLayout } from "@/components/templates/AuthLayout";
import { FormField } from "@/components/molecules/FormField";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { isValidEmail, isValidPassword } from "@/utils/validators";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        dateOfBirth: "",
        isDuocStudent: false,
        promoCode: "",
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

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

        if (!formData.password) {
            newErrors.password = "La contraseña es requerida";
        } else if (!isValidPassword(formData.password)) {
            newErrors.password = "La contraseña debe tener al menos 6 caracteres";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Las contraseñas no coinciden";
        }

        if (!formData.dateOfBirth) {
            newErrors.dateOfBirth = "La fecha de nacimiento es requerida";
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
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
                isDuocStudent: formData.isDuocStudent,
                code: formData.promoCode || undefined,
            });

            navigate("/login?registered=true");
        } catch (error: any) {
            setErrors({
                submit:
                    error?.response?.data?.message ||
                    "Error al registrarse. Por favor intenta de nuevo.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <AuthLayout>
            <div className="space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-display text-primary">
                        Crea tu cuenta
                    </h1>
                    <p className="text-muted-foreground">
                        Regístrate para aprovechar los beneficios de Pastelería 1000
                        Sabores.
                    </p>
                </div>

                {errors.submit && (
                    <Alert variant="destructive">
                        <AlertDescription>{errors.submit}</AlertDescription>
                    </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <FormField
                        label="Nombre Completo"
                        required
                        error={errors.name}
                        inputProps={{
                            name: "name",
                            value: formData.name,
                            onChange: (e) =>
                                setFormData({ ...formData, name: e.target.value }),
                            placeholder: "Juan Pérez",
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
                            onChange: (e) =>
                                setFormData({ ...formData, email: e.target.value }),
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
                            onChange: (e) =>
                                setFormData({ ...formData, password: e.target.value }),
                            placeholder: "Mínimo 6 caracteres",
                        }}
                    />

                    <FormField
                        label="Confirmar Contraseña"
                        type="password"
                        required
                        error={errors.confirmPassword}
                        inputProps={{
                            name: "confirmPassword",
                            value: formData.confirmPassword,
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    confirmPassword: e.target.value,
                                }),
                            placeholder: "Repite tu contraseña",
                        }}
                    />

                    <FormField
                        label="Fecha de Nacimiento"
                        type="date"
                        required
                        error={errors.dateOfBirth}
                        inputProps={{
                            name: "dateOfBirth",
                            value: formData.dateOfBirth,
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    dateOfBirth: e.target.value,
                                }),
                        }}
                    />

                    <FormField
                        label="Código promocional (opcional)"
                        error={errors.promoCode}
                        inputProps={{
                            name: "promoCode",
                            value: formData.promoCode,
                            onChange: (e) =>
                                setFormData({
                                    ...formData,
                                    promoCode: e.target.value,
                                }),
                            placeholder: "FELICES50",
                        }}
                    />

                    <div className="flex items-center space-x-2">
                        <Checkbox
                            id="isDuocStudent"
                            checked={formData.isDuocStudent}
                            onCheckedChange={(checked) =>
                                setFormData({
                                    ...formData,
                                    isDuocStudent: !!checked,
                                })
                            }
                        />
                        <Label
                            htmlFor="isDuocStudent"
                            className="text-sm font-normal cursor-pointer"
                        >
                            Soy estudiante de Duoc UC
                        </Label>
                    </div>

                    <Button
                        type="submit"
                        variant="hero"
                        className="w-full"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Registrando..." : "Crear Cuenta"}
                    </Button>
                </form>

                <div className="text-center text-sm">
                    <span className="text-muted-foreground">¿Ya tienes cuenta? </span>
                    <button
                        onClick={() => navigate("/login")}
                        className="text-primary font-medium hover:underline"
                    >
                        Inicia sesión
                    </button>
                </div>
            </div>
        </AuthLayout>
    );
}
