import { useState, useEffect } from "react";
import { MainLayout } from "@/components/templates/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormField } from "@/components/molecules/FormField";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Package, Plus, Pencil, AlertTriangle } from "lucide-react";
import { toast } from "sonner";
import { getProducts, createProduct, updateProduct } from "@/services/productsService";
import { Product, CreateProductPayload, UpdateProductPayload } from "@/models/product";
import { formatCurrency } from "@/utils/formatters";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setIsLoading(true);
        try {
            const data = await getProducts();
            setProducts(data);

            // Mostrar notificación si hay productos con stock bajo
            const lowStockProducts = data.filter(p => p.stock <= 2);
            if (lowStockProducts.length > 0) {
                const productNames = lowStockProducts.map(p => p.name).join(", ");
                toast.warning(
                    `Alerta: ${lowStockProducts.length} producto${lowStockProducts.length > 1 ? 's' : ''} con stock crítico`,
                    { description: productNames }
                );
            }
        } catch (error) {
            toast.error("Error al cargar productos");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload: CreateProductPayload = {
                name: formData.name,
                description: formData.description,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
            };

            await createProduct(payload);
            toast.success("Producto creado exitosamente");
            setIsDialogOpen(false);
            setFormData({ name: "", description: "", price: "", stock: "" });
            loadProducts();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Error al crear producto";

            if (errorMessage.includes("restricción única") || errorMessage.includes("constraint") || errorMessage.includes("Duplicate")) {
                toast.error("Ya existe un producto con ese nombre. Por favor, usa un nombre diferente.");
            } else if (errorMessage.includes("ORA-00001")) {
                toast.error("Error: Producto duplicado o problema con la base de datos. Contacta al administrador del sistema.");
            } else {
                toast.error(errorMessage);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsEditDialogOpen(true);
    };

    const handleUpdateSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProduct) return;

        setIsSubmitting(true);

        try {
            const payload: UpdateProductPayload = {
                name: editingProduct.name,
                description: editingProduct.description,
                price: editingProduct.price,
                stock: editingProduct.stock,
            };

            await updateProduct(editingProduct.id, payload);
            toast.success("Producto actualizado exitosamente");
            setIsEditDialogOpen(false);
            setEditingProduct(null);
            loadProducts();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || "Error al actualizar producto";

            if (errorMessage.includes("restricción única") || errorMessage.includes("constraint") || errorMessage.includes("Duplicate")) {
                toast.error("Ya existe un producto con ese nombre. Por favor, usa un nombre diferente.");
            } else {
                toast.error(errorMessage);
            }
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
                            Gestión de Productos
                        </h1>
                        <p className="text-muted-foreground">
                            Administra el catálogo de productos
                        </p>
                    </div>

                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="w-4 h-4 mr-2" />
                                Crear Producto
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md">
                            <DialogHeader>
                                <DialogTitle>Crear Nuevo Producto</DialogTitle>
                                <DialogDescription>
                                    Completa los datos del nuevo producto
                                </DialogDescription>
                            </DialogHeader>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <FormField
                                    label="Nombre del producto"
                                    required
                                    inputProps={{
                                        name: "name",
                                        value: formData.name,
                                        onChange: (e) => setFormData({ ...formData, name: e.target.value }),
                                        required: true,
                                    }}
                                />

                                <FormField
                                    label="Descripción"
                                    required
                                    multiline
                                    textareaProps={{
                                        name: "description",
                                        value: formData.description,
                                        onChange: (e) => setFormData({ ...formData, description: e.target.value }),
                                        required: true,
                                        rows: 3,
                                    }}
                                />

                                <FormField
                                    label="Precio"
                                    type="number"
                                    required
                                    inputProps={{
                                        name: "price",
                                        value: formData.price,
                                        onChange: (e) => setFormData({ ...formData, price: e.target.value }),
                                        required: true,
                                        min: "0",
                                        step: "0.01",
                                    }}
                                />

                                <FormField
                                    label="Stock"
                                    type="number"
                                    required
                                    inputProps={{
                                        name: "stock",
                                        value: formData.stock,
                                        onChange: (e) => setFormData({ ...formData, stock: e.target.value }),
                                        required: true,
                                        min: "0",
                                        step: "1",
                                    }}
                                />

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
                                        {isSubmitting ? "Creando..." : "Crear Producto"}
                                    </Button>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {/* Alert for low stock products */}
                {products.filter(p => p.stock <= 2).length > 0 && (
                    <Alert variant="destructive" className="mb-6">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Stock Crítico</AlertTitle>
                        <AlertDescription>
                            {products.filter(p => p.stock <= 2).length} producto{products.filter(p => p.stock <= 2).length > 1 ? 's tienen' : ' tiene'} stock igual o inferior a 2 unidades:
                            <ul className="mt-2 list-disc list-inside">
                                {products.filter(p => p.stock <= 2).map(p => (
                                    <li key={p.id}>
                                        <span className="font-medium">{p.name}</span> - Stock: {p.stock}
                                    </li>
                                ))}
                            </ul>
                        </AlertDescription>
                    </Alert>
                )}

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Package className="w-5 h-5" />
                            Catálogo de Productos
                        </CardTitle>
                        <CardDescription>
                            {products.length} producto{products.length !== 1 ? "s" : ""} registrado{products.length !== 1 ? "s" : ""}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">
                                Cargando productos...
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-8 text-muted-foreground">
                                No hay productos registrados
                            </div>
                        ) : (
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>ID</TableHead>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Descripción</TableHead>
                                        <TableHead className="text-right">Precio</TableHead>
                                        <TableHead className="text-center">Stock</TableHead>
                                        <TableHead>Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.id}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell className="max-w-md truncate">
                                                {product.description}
                                            </TableCell>
                                            <TableCell className="text-right font-semibold">
                                                {formatCurrency(product.price)}
                                            </TableCell>
                                            <TableCell className="text-center">
                        <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                            product.stock === 0
                                ? 'bg-destructive/10 text-destructive'
                                : product.stock < 10
                                    ? 'bg-yellow-500/10 text-yellow-700 dark:text-yellow-500'
                                    : 'bg-green-500/10 text-green-700 dark:text-green-500'
                        }`}>
                          {product.stock}
                        </span>
                                            </TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleEdit(product)}
                                                >
                                                    <Pencil className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )}
                    </CardContent>
                </Card>

                {/* Edit Product Dialog */}
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                    <DialogContent className="max-w-md">
                        <DialogHeader>
                            <DialogTitle>Editar Producto</DialogTitle>
                            <DialogDescription>
                                Actualiza los datos del producto
                            </DialogDescription>
                        </DialogHeader>

                        {editingProduct && (
                            <form onSubmit={handleUpdateSubmit} className="space-y-4">
                                <FormField
                                    label="Nombre del producto"
                                    required
                                    inputProps={{
                                        name: "name",
                                        value: editingProduct.name,
                                        onChange: (e) => setEditingProduct({ ...editingProduct, name: e.target.value }),
                                        required: true,
                                    }}
                                />

                                <FormField
                                    label="Descripción"
                                    required
                                    multiline
                                    textareaProps={{
                                        name: "description",
                                        value: editingProduct.description,
                                        onChange: (e) => setEditingProduct({ ...editingProduct, description: e.target.value }),
                                        required: true,
                                        rows: 3,
                                    }}
                                />

                                <FormField
                                    label="Precio"
                                    type="number"
                                    required
                                    inputProps={{
                                        name: "price",
                                        value: editingProduct.price.toString(),
                                        onChange: (e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) }),
                                        required: true,
                                        min: "0",
                                        step: "0.01",
                                    }}
                                />

                                <FormField
                                    label="Stock"
                                    type="number"
                                    required
                                    inputProps={{
                                        name: "stock",
                                        value: editingProduct.stock.toString(),
                                        onChange: (e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) }),
                                        required: true,
                                        min: "0",
                                        step: "1",
                                    }}
                                />

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setIsEditDialogOpen(false);
                                            setEditingProduct(null);
                                        }}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
        </MainLayout>
    );
}
