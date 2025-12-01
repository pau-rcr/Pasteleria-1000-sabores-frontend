# 🍰 Pastelería 1000 Sabores – Frontend

Este es el frontend del proyecto **Pastelería 1000 Sabores**, desarrollado con **React + Vite + TypeScript** y organizado siguiendo la filosofía de **Atomic Design**.  
El objetivo es crear una experiencia web moderna para una pastelería con más de 50 años de tradición.

---

## 🧁 Descripción General

El proyecto incluye navegación de productos, carrito de compras con descuentos, autenticación con roles, secciones informativas y un pequeño sistema de blog.  
La prioridad es mantener una estructura limpia y escalable, integrándose sin problemas a un backend en Spring Boot.

---

## ✨ Funcionalidades Principales

- Catálogo de productos y detalle individual
- Carrito de compras persistente
- Cálculo de descuentos según edad, beneficios o códigos promocionales
- Autenticación con roles (cliente / vendedor / administrador)
- Perfil del usuario y su historial de pedidos
- Formulario de contacto
- Blog con listado y visualización de entradas

---

## 🛠️ Tecnologías Utilizadas

- **React 18**
- **TypeScript**
- **Vite**
- **TailwindCSS**
- **React Router DOM**
- **Axios** (HTTP)
- **Shadcn/UI**

---

## 📂 Estructura del Proyecto

La arquitectura se diseñó con Atomic Design en mente, distribuyendo los componentes por nivel de abstracción.

src/
├── components/
│ ├── ui/ # Componentes Shadcn
│ ├── atoms/ # Elementos básicos
│ ├── molecules/ # Combinaciones de átomos
│ ├── organisms/ # Secciones completas
│ └── templates/ # Estructuras de página
├── pages/ # Vistas por ruta
├── router/ # Rutas de la aplicación
├── context/ # Auth, carrito, usuario
├── hooks/ # Custom hooks
├── services/ # Integración con la API
├── utils/ # Funciones auxiliares
├── models/ # Tipos e interfaces
└── lib/ # Configuración y helpers

---

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Configurar variables de entorno

En la raíz del proyecto, crear un archivo .env:

VITE_API_BASE_URL=http://localhost:8080/api

### 3. Ejecutar en modo desarrollo
```bash
npm run dev
```

La app estará disponible en:
http://localhost:5173

### 4. Compilar para producción
```bash
npm run build
```
---

## 🔌 Integración con Backend (Spring Boot)

El frontend se comunica con un backend mediante API REST. Los endpoints esperados incluyen:

### Autenticación

POST /api/auth/login

POST /api/auth/register

GET /api/auth/me

### Productos

GET /api/products

GET /api/products/:id

### Pedidos

POST /api/orders

GET /api/orders/my

### Blog

GET /api/blogs

GET /api/blogs/:id

### Contacto

POST /api/contact

---

## 🛒 Sistema de Carrito y Descuentos

El proyecto incluye un carrito persistente con:

- Control de cantidades

- Personalización para tortas

- Descuentos aplicados en tiempo real

- Beneficios por edad y códigos promocionales

---

## 🎨 Diseño

La identidad visual sigue tonos cálidos y pasteleros:

- Chocolate

- Rosa pastel

- Crema

La combinación de TailwindCSS + Shadcn/UI permite mantener estilos consistentes sin sacrificar flexibilidad.

---

## Notas
Proyecto Pastelería 1000 Sabores. Este frontend fue desarrollado por Paula Caro. Dirigirse al repositorio de 
Valentina Ruiz para ver el repositorio de backend.