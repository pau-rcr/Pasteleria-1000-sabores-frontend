import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import { calculateOrderTotals } from "@/utils/discounts";
import { DISCOUNT_PERCENTAGES } from "@/config/constants";
import type { CartItem } from "@/models/order";
import type { User } from "@/models/user";

const baseProduct = {
    id: 1,
    name: "Torta de Chocolate",
    description: "Rica torta",
    price: 10000,
    stock: 10,
};

const createUser = (overrides: Partial<User> = {}): User => ({
    id: 1,
    name: "Usuario Test",
    email: "test@example.com",
    role: "CLIENT" as any,
    dateOfBirth: "1980-01-01",
    isDuocStudent: false,
    hasFelices50: false,
    ...overrides,
});

const createItems = (qty = 1): CartItem[] => [
    {
        product: baseProduct,
        quantity: qty,
    },
];

describe("calculateOrderTotals", () => {
    let realDate: DateConstructor;

    beforeAll(() => {
        realDate = Date;
        // Fijamos la fecha de hoy para tests de edad/cumpleaños
        const fixedDate = new Date("2035-01-02T00:00:00Z");
        // @ts-ignore
        global.Date = class extends Date {
            constructor(value?: any) {
                super(value ?? fixedDate);
            }
            static now() {
                return fixedDate.getTime();
            }
        } as DateConstructor;
    });

    afterAll(() => {
        global.Date = realDate;
    });

    it("calcula subtotal sin descuentos cuando no hay usuario", () => {
        const items = createItems(2); // 2 * 10000 = 20000
        const result = calculateOrderTotals(items, null);

        expect(result.subtotal).toBe(20000);
        expect(result.discountByAge).toBe(0);
        expect(result.discountByCode).toBe(0);
        expect(result.birthdayBenefit).toBe(0);
        expect(result.total).toBe(20000);
    });

    it("aplica descuento por edad (50+)", () => {
        // con la fecha fija, alguien nacido en 1970 tiene mas de 50
        const user = createUser({ dateOfBirth: "1970-01-01" });
        const items = createItems(1);

        const result = calculateOrderTotals(items, user);

        const expectedAgeDiscount = baseProduct.price * DISCOUNT_PERCENTAGES.AGE_50_PLUS;
        expect(result.discountByAge).toBeCloseTo(expectedAgeDiscount, 0);
        expect(result.total).toBeCloseTo(
            result.subtotal - result.discountByAge,
            0
        );
        expect(result.discountDetails.age50Plus).toBe(true);
    });

    it("aplica descuento por código FELICES50", () => {
        const user = createUser({ hasFelices50: true });
        const items = createItems(1);

        const result = calculateOrderTotals(items, user);

        const expectedCodeDiscount = baseProduct.price * DISCOUNT_PERCENTAGES.FELICES50;
        expect(result.discountByCode).toBeCloseTo(expectedCodeDiscount, 0);
        expect(result.discountDetails.felices50).toBe(true);
    });

    it("aplica beneficio de cumpleaños para estudiantes DUOC", () => {
        // Cumpleaños el 2 de enero, que coincide con la fecha fija
        const user = createUser({
            isDuocStudent: true,
            dateOfBirth: "2010-01-02",
        });
        const items = [
            {
                product: { ...baseProduct, price: 8000 },
                quantity: 1,
            },
            {
                product: { ...baseProduct, id: 2, price: 5000 },
                quantity: 1,
            },
        ];

        const result = calculateOrderTotals(items, user);

        // Debería usar el producto más barato como beneficio
        expect(result.birthdayBenefit).toBe(5000);
        expect(result.discountDetails.birthday).toBe(true);
        expect(result.discountDetails.amountBirthday).toBe(5000);
    });

    it("nunca devuelve total negativo aunque los descuentos superen el subtotal", () => {
        const user = createUser({
            isDuocStudent: true,
            hasFelices50: true,
            dateOfBirth: "1950-01-02", // mayor de 50 y cumpleaños
        });
        const items = createItems(1);

        const result = calculateOrderTotals(items, user);

        expect(result.total).toBeGreaterThanOrEqual(0);
    });
});
