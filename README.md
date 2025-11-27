# AquaGuard - Sistema de Alerta Temprana de Inundaciones

AquaGuard es una aplicación web moderna construida con Next.js, diseñada para proporcionar un sistema de alerta temprana de inundaciones. Utiliza inteligencia artificial para evaluar los riesgos basándose en datos de sensores, datos históricos y pronósticos meteorológicos.

## Características Principales

- **Panel de Control (Dashboard):** Visualización en tiempo real de las métricas clave, como el nivel del agua y la precipitación.
- **Gestión de Sensores:** Permite agregar, ver y administrar los sensores de monitoreo de inundaciones.
- **Evaluación de Riesgos con IA:** Un formulario para introducir datos y obtener una evaluación de riesgo de inundación generada por IA a través de Genkit.
- **Historial de Alertas:** Una página para ver todas las alertas de inundación pasadas.
- **Autenticación de Usuarios:** Páginas de inicio de sesión y registro para el acceso de usuarios.
- **Interfaz Responsiva:** Diseño moderno y adaptable a diferentes dispositivos, construido con ShadCN y Tailwind CSS.

## Pila Tecnológica

- **Framework Frontend:** [Next.js](https://nextjs.org/) (con App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **UI/Componentes:** [React](https://react.dev/), [ShadCN UI](https://ui.shadcn.com/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Inteligencia Artificial:** [Genkit (Google AI)](https://firebase.google.com/docs/genkit)
- **Formularios:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## Estructura del Proyecto

El proyecto está organizado de la siguiente manera:

```
/
├── src/
│   ├── app/                # Rutas y páginas de Next.js
│   │   ├── (pages)/        # Agrupación de rutas para las páginas principales
│   │   ├── api/            # Rutas de API (backend)
│   │   └── layout.tsx      # Layout principal de la aplicación
│   ├── components/         # Componentes reutilizables de React
│   │   ├── auth/           # Componentes de autenticación
│   │   ├── dashboard/      # Componentes del panel de control
│   │   ├── sensors/        # Componentes para la gestión de sensores
│   │   └── ui/             # Componentes de UI de ShadCN
│   ├── ai/                 # Lógica de IA con Genkit
│   │   ├── flows/          # Flujos de Genkit
│   │   └── genkit.ts       # Configuración de Genkit
│   ├── hooks/              # Hooks personalizados de React
│   ├── lib/                # Utilidades y funciones auxiliares
│   └── services/           # Lógica para la comunicación con APIs externas
├── public/                 # Archivos estáticos
└── tailwind.config.ts      # Configuración de Tailwind CSS
```

## Primeros Pasos

Para comenzar a trabajar con el proyecto, puedes explorar el código a partir de `src/app/(pages)/dashboard/page.tsx`, que es la página principal del panel de control.
