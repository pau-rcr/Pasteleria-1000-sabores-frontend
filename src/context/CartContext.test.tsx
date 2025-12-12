import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/models/product";
import type { User } from "@/models/user";
import * as discounts from "@/utils/discounts";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <CartProvider>{children}</CartProvider>
);

const sampleProduct: Product = {
    id: 1,
    name: "Torta de Vainilla",
    description: "Deliciosa torta",
    price: 12000,
    stock: 10,
};

const user: User = {
    id: 1,
    name: "Usuario",
    email: "user@example.com",
    role: "CLIENT" as any,
    dateOfBirth: "1990-01-01",
    isDuocStudent: false,
    hasFelices50: false,
};

describe("CartContext", () => {
    const setItemSpy = vi.spyOn(window.localStorage.__proto__, "setItem");
    const getItemSpy = vi.spyOn(window.localStorage.__proto__, "getItem");

    beforeEach(() => {
        window.localStorage.clear();
        setItemSpy.mockClear();
        getItemSpy.mockClear();
    });

    it("agrega items al carrito y acumula cantidades", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct);
            result.current.addItem(sampleProduct, 2);
        });

        expect(result.current.items).toHaveLength(1);
        expect(result.current.items[0].quantity).toBe(3);
        expect(result.current.itemCount).toBe(3);
    });

    it("elimina items del carrito", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct);
            result.current.removeItem(sampleProduct.id);
        });

        expect(result.current.items).toHaveLength(0);
        expect(result.current.itemCount).toBe(0);
    });

    it("actualiza la cantidad de un item", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct, 1);
            result.current.updateQuantity(sampleProduct.id, 5);
        });

        expect(result.current.items[0].quantity).toBe(5);
        expect(result.current.itemCount).toBe(5);
    });

    it("actualiza el mensaje de dedicatoria", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct, 1, "Feliz cumpleaños");
            result.current.updateMessage(sampleProduct.id, "Te quiero mucho");
        });

        expect(result.current.items[0].messageForCake).toBe("Te quiero mucho");
    });

    it("guarda el carrito en localStorage cuando cambia", () => {
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct, 1);
        });

        expect(setItemSpy).toHaveBeenCalledWith(
            "cartItems",
            JSON.stringify(result.current.items)
        );
    });

    it("usa calculateOrderTotals en getSummary", () => {
        const spy = vi.spyOn(discounts, "calculateOrderTotals");
        const { result } = renderHook(() => useCart(), { wrapper });

        act(() => {
            result.current.addItem(sampleProduct, 2);
        });

        const summary = result.current.getSummary(user);

        expect(spy).toHaveBeenCalledWith(result.current.items, user);
        expect(summary.subtotal).toBeDefined();
    });

    it("lanza error si useCart se usa fuera de CartProvider", () => {
        const { result } = renderHook(() => {
            // no provider
            return () => {};
        });

        expect(() => renderHook(() => useCart())).toThrowError(
            "useCart must be used within a CartProvider"
        );
    });
});
