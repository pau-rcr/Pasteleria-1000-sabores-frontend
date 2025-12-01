import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "@/components/molecules/ProductCard";
import type { Product } from "@/models/product";

const makeProduct = (overrides: Partial<Product> = {}): Product => ({
    id: 1,
    name: "Torta de Frutilla",
    description: "Torta con frutilla fresca",
    price: 15000,
    stock: 10,
    ...overrides,
});

describe("ProductCard", () => {
    it("muestra el nombre, descripción y precio del producto", () => {
        const product = makeProduct();

        render(<ProductCard product={product} />);

        expect(
            screen.getByText("Torta de Frutilla", { exact: false })
        ).toBeInTheDocument();
        expect(
            screen.getByText("Torta con frutilla fresca", { exact: false })
        ).toBeInTheDocument();
        // Solo validamos que aparezca el monto formateado de alguna forma
        expect(
            screen.getByText(/15\.000|15 000|15000/, { exact: false })
        ).toBeInTheDocument();
    });

    it("deshabilita el botón y muestra 'Sin Stock' cuando stock = 0", () => {
        const product = makeProduct({ stock: 0 });

        render(<ProductCard product={product} />);

        expect(screen.getByText(/sin stock/i)).toBeInTheDocument();

        expect(
            screen.queryByRole("button", { name: /agregar/i })
        ).not.toBeInTheDocument();
    });

    it("llama a onAddToCart cuando se presiona el botón", () => {
        const product = makeProduct({ stock: 3 });
        const onAddToCart = vi.fn();

        render(<ProductCard product={product} onAddToCart={onAddToCart} />);

        const button = screen.getByRole("button", { name: /agregar/i });
        fireEvent.click(button);

        expect(onAddToCart).toHaveBeenCalledTimes(1);
        expect(onAddToCart).toHaveBeenCalledWith(product);
    });

    it("dispara onClick cuando se hace click en la tarjeta", () => {
        const product = makeProduct();
        const onClick = vi.fn();

        const { container } = render(
            <ProductCard product={product} onClick={onClick} />
        );

        fireEvent.click(container.firstChild as HTMLElement);
        expect(onClick).toHaveBeenCalledTimes(1);
    });
});
