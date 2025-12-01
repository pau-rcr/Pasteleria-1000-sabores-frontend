import "@testing-library/jest-dom";
import { expect, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Limpia el DOM después de cada test
afterEach(() => {
    cleanup();
});

// Polyfill básico de fetch por si se necesitaara
if (!globalThis.fetch) {
    // @ts-ignore
    globalThis.fetch = () =>
        Promise.reject(new Error("fetch not implemented in test env"));
}
