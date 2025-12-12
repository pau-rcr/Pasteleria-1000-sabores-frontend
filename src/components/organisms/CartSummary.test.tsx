// Testeo de estados de los descuentos, loadig y botón
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { CartSummary } from "@/components/organisms/CartSummary";
import type { OrderSummary, DiscountDetails } from "@/models/order";

const makeSummary = (
    overrides: Partial<OrderSummary & { discountDetails: DiscountDetails }> = {}
): OrderSummary & { discountDetails: DiscountDetails } => ({
    subtotal: 20000,
    discountByAge: 0,
    discountByCode: 0,
    birthdayBenefit: 0,
    total: 20000,
    discountDetails: {
        age50Plus: false,
        felices50: false,
        birthday: false,
        amountBirthday: 0,
        amountByAge: 0,
        amountByCode: 0
    },
    ...overrides,
});

describe("CartSummary", () => {
    it("muestra el subtotal y el total", () => {
        const summary = makeSummary();

        render(
            <CartSummary summary={summary} onCheckout={() => {}} />
        );
        expect(screen.getByText(/subtotal/i)).toBeInTheDocument();
        // Solo "Total"
        expect(screen.getByText(/^total$/i)).toBeInTheDocument();

    });

    it("muestra badges de descuentos cuando existen", () => {
        const summary = makeSummary({
            discountByAge: 5000,
            discountByCode: 2000,
            birthdayBenefit: 3000,
            discountDetails: {
                age50Plus: true,
                felices50: true,
                birthday: true,
                amountBirthday: 3000,
                amountByAge: 5000,
                amountByCode: 0
            },
        });

        render(<CartSummary summary={summary} onCheckout={() => {}} />);

        // Descuento por edad
        expect(screen.getByText("50+")).toBeInTheDocument();
        expect(screen.getByText(/descuento 50%/i)).toBeInTheDocument();

        // Código FELICES50
        expect(screen.getByText(/felices50/i)).toBeInTheDocument();
        expect(screen.getByText(/descuento 10%/i)).toBeInTheDocument();

        // Beneficio cumpleaños
        expect(screen.getByText(/cumpleaños duoc/i)).toBeInTheDocument();

        // Mensaje de ahorro total
        expect(screen.getByText(/has ahorrado/i)).toBeInTheDocument();
    });

    it("ejecuta onCheckout cuando se hace click en el botón", () => {
        const summary = makeSummary();
        const onCheckout = vi.fn();

        render(<CartSummary summary={summary} onCheckout={onCheckout} />);

        const button = screen.getByRole("button", { name: /confirmar pedido/i });
        fireEvent.click(button);

        expect(onCheckout).toHaveBeenCalledTimes(1);
    });

    it("muestra estado de cargando cuando isLoading = true", () => {
        const summary = makeSummary();
        render(
            <CartSummary summary={summary} onCheckout={() => {}} isLoading />
        );

        expect(screen.getByText(/procesando/i)).toBeInTheDocument();
    });
});

