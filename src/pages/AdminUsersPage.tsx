import { useState, useEffect } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/molecules/FormField";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { getUsers, createUser } from "@/services/usersService";
import { CreateUserPayload, User } from "@/models/user";
import { UserRole, ROLES } from "@/config/roles";
import { formatDate } from "@/utils/date";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        dateOfBirth: "",
        isDuocStudent: false,
        role: "CLIENT" as UserRole,
    });

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setIsLoading(true);
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            toast.error("Error al cargar usuarios");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: CreateUserPayload = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                dateOfBirth: formData.dateOfBirth,
                isDuocStudent: formData.isDuocStudent,
                role: formData.role,
            };

            await createUser(payload);
            toast.success("Usuario creado exitosamente");
            setIsDialogOpen(false);
            setFormData({
                name: "",
                email: "",
                password: "",
                dateOfBirth: "",
                isDuocStudent: false,
                role: "CLIENT",
            });
            loadUsers();
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error al crear usuario");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <MainLayout>
            <div className="container mx-auto px-4 py-12">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-4xl font-display text-primary mb-2">
                            Gestión de Usuarios
                        </h1>
                        <p className="text-muted-foreground">
                            Administra los usuarios del sistema
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Usuario
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Usuario</DialogTitle>
                                <DialogDescription>
                                    Completa los datos del nuevo usuario
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormField
                                    label="Nombre completo"
                                    required
                                    inputProps={{
                                        name: "name",
                                        value: formData.name,
                                        onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                        required: true,
                                    }}
                                />

                                <FormField
                                    label="Email"
                                    type="email"
                                    required
                                    inputProps={{
                                        name: "email",
                                        value: formData.email,
                                        onChange: (e) => setFormData({ ...formData, email: e.target.value }),
                                        required: true,
                                    }}
                                />

                                <FormField
                                    label="Contraseña"
                                    type="password"
                                    required
                                    inputProps={{
                                        name: "password",
                                        value: formData.password,
                                        onChange: (e) => setFormData({ ...formData, password: e.target.value }),
                                        required: true,
                                        minLength: 6,
                                    }}
                                />

                                <FormField
                                    label="Fecha de nacimiento"
                                    type="date"
                                    required
                                    inputProps={{
                                        name: "dateOfBirth",
                                        value: formData.dateOfBirth,
                                        onChange: (e) => setFormData({ ...formData, dateOfBirth: e.target.value }),
                                        required: true,
                                    }}
                                />

                                <div className="space-y-2">
                                    <Label htmlFor="role">
                                        Rol <span className="text-destructive">*</span>
                                    </Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                                    >
                                        <SelectTrigger id="role">
                                            <SelectValue placeholder="Selecciona un rol" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="CLIENT">{ROLES.CLIENT}</SelectItem>
                                            <SelectItem value="SELLER">{ROLES.SELLER}</SelectItem>
                                            <SelectItem value="ADMIN">{ROLES.ADMIN}</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="isDuocStudent"
                                        checked={formData.isDuocStudent}
                                        onCheckedChange={(checked) =>
                                            setFormData({ ...formData, isDuocStudent: checked as boolean })
                                        }
                                    />
                                    <Label htmlFor="isDuocStudent">
                                        ¿Es estudiante de Duoc?
                                    </Label>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Creando..." : "Crear Usuario"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Lista de Usuarios
                        </CardTitle>
                        <CardDescription>
                            {users.length} usuario{users.length !== 1 ? "s" : ""} registrado{users.length !== 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Cargando usuarios...
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay usuarios registrados
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Fecha Nacimiento</TableHead>
                                        <TableHead>Duoc</TableHead>
                                        <TableHead>Felices50</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="font-medium">{user.id}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                        <span className="px-2 py-1 rounded-md text-xs font-medium bg-secondary text-secondary-foreground">
                          {user.role}
                        </span>
                                            </TableCell>
                                            <TableCell>{formatDate(user.dateOfBirth)}</TableCell>
                                            <TableCell>{user.isDuocStudent ? "Sí" : "No"}</TableCell>
                                            <TableCell>{user.hasFelices50 ? "Sí" : "No"}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </MainLayout>
    );
}
