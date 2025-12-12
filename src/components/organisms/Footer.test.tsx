// Mock de useNavigate y generamos un snapshot del footer
import React from "react";
import { describe, it, expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";
import { Footer } from "@/components/organisms/Footer";

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual<any>("react-router-dom");
    return {
        ...actual,
        useNavigate: () => vi.fn(),
    };
});

describe("Footer", () => {
    it("renderiza correctamente (snapshot) y muestra el año actual", () => {
        const { container, getByText } = render(
            <MemoryRouter>
                <Footer />
            </MemoryRouter>
        );

        const year = new Date().getFullYear().toString();
        expect(
            getByText(new RegExp(`© ${year} Pastelería 1000 Sabores`, "i"))
        ).toBeInTheDocument();

        expect(container.firstChild).toMatchSnapshot();
    });
});
