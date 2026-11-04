# 🎴 PokéMarket

> Aplicación móvil de compraventa de cartas Pokémon TCG desarrollada con **React Native + Expo** y backend en **Supabase**.

---

## 📋 Índice

1. [Descripción General](#-descripción-general)
2. [Tecnologías Utilizadas](#-tecnologías-utilizadas)
3. [Arquitectura del Proyecto](#-arquitectura-del-proyecto)
4. [Integración con Supabase](#-integración-con-supabase)
   - [Configuración del Cliente](#configuración-del-cliente)
   - [Esquema de Base de Datos](#esquema-de-base-de-datos)
   - [Autenticación de Usuarios](#autenticación-de-usuarios)
   - [Trigger Automático de Perfiles](#trigger-automático-de-perfiles)
5. [Funcionalidades Principales](#-funcionalidades-principales)
   - [Catálogo con Filtros](#1-catálogo-con-filtros)
   - [Detalle de Carta](#2-detalle-de-carta)
   - [Carrito de Compra](#3-carrito-de-compra)
   - [Sistema de Cuentas](#4-sistema-de-cuentas)
6. [Implementaciones Técnicas Destacadas](#-implementaciones-técnicas-destacadas)
7. [Estructura del Proyecto](#-estructura-del-proyecto)
8. [Instalación y Puesta en Marcha](#-instalación-y-puesta-en-marcha)
9. [Variables de Entorno](#-variables-de-entorno)

---

## 🧩 Descripción General

**PokéMarket** es una aplicación móvil multiplataforma (Android / iOS) que permite explorar un catálogo de cartas Pokémon TCG, ver el detalle de cada carta, gestionar un carrito de compra y registrarse o iniciar sesión con una cuenta de usuario.

El catálogo y los datos de usuario se almacenan y gestionan en **Supabase** (PostgreSQL en la nube), mientras que la interfaz está construida enteramente con componentes nativos de **React Native** sin librerías de navegación de terceros.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **Expo SDK** | ~57.0.27 | Plataforma de desarrollo y build para React Native |
| **React** | 19.2.3 | Gestión declarativa de interfaces y estado |
| **React Native** | 0.86.3 | Framework de UI nativa multiplataforma |
| **TypeScript** | ~6.0.3 | Tipado estático para mayor robustez |
| **Supabase JS** | ^2.118.0 | Cliente para base de datos, auth y API REST |
| **react-native-safe-area-context** | ~5.7.0 | Adaptación a notches y barras del sistema |
| **@expo/vector-icons** | ^15.0.2 | Iconografía vectorial (Ionicons) |

---

## 🏗️ Arquitectura del Proyecto

El estado global vive en `App.tsx` y fluye hacia abajo mediante props siguiendo el patrón unidireccional de React:

```
App.tsx  (estado global: carta seleccionada, carrito, pantalla activa)
├── CatalogScreen    ← carga cartas de Supabase, filtros, paginación
├── CardDetailScreen ← detalle + añadir al carrito
├── CartScreen       ← gestión de unidades y totales
├── AccountScreen    ← registro e inicio de sesión con Supabase Auth
└── BottomBar        ← navegación entre pestañas
```

### Tipos TypeScript principales

```typescript
// src/types/card.ts

export type Carta = {
  id: string;
  nombre: string;
  precio: number | null;
  descripcion: string;
  expansion: string;   // nombre del set, obtenido por JOIN con la tabla sets
  numero: string;
  imagen: string | null;
};

export type ArticuloCarrito = {
  carta: Carta;
  cantidad: number;
};
```

---

## ☁️ Integración con Supabase

### Configuración del Cliente

El cliente de Supabase se inicializa una sola vez en `src/services/supabase.ts` y se importa desde cualquier pantalla que necesite datos:

```typescript
// src/services/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabasePublishableKey = process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

export const supabase = createClient(supabaseUrl, supabasePublishableKey);
```

Las credenciales se leen de variables de entorno con el prefijo `EXPO_PUBLIC_` para que Expo las exponga de forma segura en el cliente.

---

### Esquema de Base de Datos

El proyecto utiliza dos tablas principales en Supabase:

#### Tabla `sets` — Expansiones Pokémon TCG
```sql
CREATE TABLE public.sets (
  id   TEXT PRIMARY KEY,
  name TEXT NOT NULL
);
```

#### Tabla `cards` — Cartas del catálogo
```sql
CREATE TABLE public.cards (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name             TEXT NOT NULL,
  description      TEXT,
  collector_number TEXT,
  image_url        TEXT,
  selling_price    NUMERIC(10, 2),
  is_active        BOOLEAN DEFAULT true,
  set_id           TEXT REFERENCES public.sets(id)
);
```

#### Tabla `profiles` — Datos públicos de usuario
```sql
CREATE TABLE public.profiles (
  id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username  TEXT UNIQUE NOT NULL,
  email     TEXT NOT NULL,
  nombre    TEXT,
  apellidos TEXT,
  creado_en TIMESTAMPTZ DEFAULT NOW()
);
```

---

### Autenticación de Usuarios

Se usa **Supabase Auth** (sistema nativo) que gestiona contraseñas hasheadas, sesiones JWT y confirmación por email de forma automática.

#### Registro de nueva cuenta
```typescript
const { data, error } = await supabase.auth.signUp({
  email: correo.trim(),
  password: contrasena,
  options: {
    data: {
      // Se guardan en auth.users → raw_user_meta_data
      // y el trigger los copia automáticamente a la tabla profiles
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      username: usuario.trim(),
      acepta_comunicaciones: aceptaComunicaciones,
    },
  },
});
```

#### Inicio de sesión (con email o nombre de usuario)
```typescript
// Si el identificador no es un email, buscamos el email por username en profiles
const { data: perfiles } = await supabase
  .from('profiles')
  .select('email')
  .eq('username', identificador)
  .limit(1);

const emailFinal = esEmail ? identificador : perfiles[0].email;

// Login estándar con email + contraseña
const { error } = await supabase.auth.signInWithPassword({
  email: emailFinal,
  password: contrasena,
});
```

---

### Trigger Automático de Perfiles

Cuando un usuario se registra, un **trigger de PostgreSQL** copia automáticamente sus datos a la tabla pública `profiles` sin necesidad de hacer una segunda llamada desde la app:

```sql
-- Función que se ejecuta en cada nuevo registro
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, email, nombre, apellidos)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'username',
      'usuario_' || substring(NEW.id::text, 1, 8)
    ),
    NEW.email,
    NEW.raw_user_meta_data->>'nombre',
    NEW.raw_user_meta_data->>'apellidos'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger que llama a la función tras cada INSERT en auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

**Flujo completo del registro:**
```
App → supabase.auth.signUp()
         ↓
   INSERT en auth.users  ──→  Trigger se dispara
         ↓                           ↓
   Sesión creada          INSERT automático en profiles
                          (username, email, nombre, apellidos)
```

#### Permisos con Row Level Security (RLS)
```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Lectura pública (necesario para buscar email por username en el login)
CREATE POLICY "Lectura pública de perfiles"
  ON public.profiles FOR SELECT USING (true);

-- Solo el propio usuario puede editar su perfil
CREATE POLICY "Edición propia del perfil"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);
```

---

## ✨ Funcionalidades Principales

### 1. Catálogo con Filtros

Las cartas se cargan desde Supabase con un JOIN a la tabla `sets` para obtener el nombre de la expansión:

```typescript
const { data, error } = await supabase
  .from('cards')
  .select(`
    id,
    name,
    description,
    collector_number,
    image_url,
    selling_price,
    sets (
      name
    )
  `)
  .eq('is_active', true)
  .order('collector_number');

// La relación many-to-one devuelve sets como objeto, no como array
const cartasAdaptadas: Carta[] = data.map((carta) => ({
  id: carta.id,
  nombre: carta.name,
  precio: carta.selling_price,
  descripcion: carta.description ?? '',
  expansion: (carta.sets as any)?.name ?? 'Sin expansión',
  numero: carta.collector_number,
  imagen: carta.image_url,
}));
```

> **Nota importante:** Supabase devuelve relaciones many-to-one como un objeto `{}`, no como un array `[]`. Usar `sets?.[0]?.name` daría siempre `undefined`.

- **Búsqueda en tiempo real** por nombre y descripción (insensible a mayúsculas).
- **Selector de expansión** con desplegable animado construido con componentes nativos.
- **Paginación** de 6 cartas por página con scroll automático al cambiar de página.

---

### 2. Detalle de Carta

- Imagen ampliada, nombre, expansión, número de colección y precio formateado en euros.
- Botón **Añadir al carrito** con popup animado de confirmación usando `Animated API` + `Modal`.

```typescript
// Popup de confirmación animado
const opacidad = useRef(new Animated.Value(0)).current;
const escala   = useRef(new Animated.Value(0.8)).current;

Animated.parallel([
  Animated.timing(opacidad, { toValue: 1, duration: 250, useNativeDriver: true }),
  Animated.spring(escala,   { toValue: 1, useNativeDriver: true }),
]).start();
```

---

### 3. Carrito de Compra

- **Sin duplicados**: si la carta ya está en el carrito se incrementa su cantidad.
- **Controles +/−**: ajuste de unidades; al llegar a 0 la carta se elimina automáticamente.
- **Total en tiempo real** calculado con `reduce`:

```typescript
// Total de artículos y precio acumulado
const totalArticulos = carrito.reduce((acc, art) => acc + art.cantidad, 0);
const totalPrecio    = carrito.reduce(
  (acc, art) => acc + (art.carta.precio ?? 0) * art.cantidad, 0
);
```

- **Eliminación con confirmación nativa** mediante `Alert.alert()`.

---

### 4. Sistema de Cuentas

Formulario con dos modos (selector tipo tab) gestionado con un único estado booleano `modoRegistro`:

| Modo | Campos | Acción |
|---|---|---|
| **Registro** | Nombre, Apellidos, Usuario, Email, Contraseña ×2, Teléfono, Dirección, Checkboxes | `supabase.auth.signUp()` |
| **Login** | Usuario o Email, Contraseña | `supabase.auth.signInWithPassword()` |

- Validación local de todos los campos antes de llamar a Supabase.
- Spinner `ActivityIndicator` mientras espera respuesta.
- Mensajes de error traducidos al español (ej: `"Invalid login credentials"` → `"Usuario o contraseña incorrectos"`).

---

## 🔬 Implementaciones Técnicas Destacadas

### Inmutabilidad del carrito

La actualización del carrito nunca muta el array original; devuelve siempre un nuevo array:

```typescript
// En App.tsx
const alAñadirCarrito = (carta: Carta) => {
  setCarrito((carritoActual) => {
    const existe = carritoActual.find((art) => art.carta.id === carta.id);

    if (existe) {
      // La carta ya estaba: incrementamos cantidad
      return carritoActual.map((art) =>
        art.carta.id === carta.id
          ? { ...art, cantidad: art.cantidad + 1 }
          : art
      );
    }

    // Nueva carta: la añadimos con cantidad 1
    return [...carritoActual, { carta, cantidad: 1 }];
  });
};
```

### Navegación sin librería externa

La navegación entre pantallas se implementa con renderizado condicional, eliminando la dependencia de React Navigation para mantener la app ligera:

```typescript
// App.tsx — enrutador condicional
{pantallaActual === 'Carrito' ? (
  <CartScreen ... />
) : pantallaActual === 'Cuenta' ? (
  <AccountScreen />
) : cartaSeleccionada === null ? (
  <CatalogScreen ... />
) : (
  <CardDetailScreen ... />
)}
```

---

## 📁 Estructura del Proyecto

```
pokemarket/
├── App.tsx                        # Raíz: estado global y enrutador condicional
├── index.ts                       # Punto de entrada de Expo
├── app.json                       # Metadatos y configuración de Expo
├── package.json                   # Dependencias y scripts
├── tsconfig.json                  # Configuración TypeScript
├── .env                           # Variables de entorno (NO subir a git)
│
├── src/
│   ├── services/
│   │   └── supabase.ts            # Inicialización del cliente Supabase
│   └── types/
│       └── card.ts                # Tipos TypeScript: Carta, ArticuloCarrito
│
├── screens/
│   ├── CatalogScreen.tsx          # Catálogo con búsqueda, expansiones y paginación
│   ├── CardDetailScreen.tsx       # Detalle de carta + popup animado
│   ├── CartScreen.tsx             # Carrito con totales y confirmación de borrado
│   └── AccountScreen.tsx          # Registro e inicio de sesión con Supabase Auth
│
├── components/
│   └── BottomBar.tsx              # Barra inferior de navegación con Ionicons
│
└── assets/                        # Iconos e imágenes estáticas de la app
```

---

## 🚀 Instalación y Puesta en Marcha

### Requisitos previos

- **Node.js** 18 o superior
- **npm** 9 o superior
- App **Expo Go** en tu dispositivo móvil (Android / iOS) o un emulador configurado
- Proyecto creado en [supabase.com](https://supabase.com) con las tablas del esquema

### 1. Clonar e instalar dependencias

```bash
git clone <url-del-repositorio>
cd pokemarket
npm install
```

### 2. Configurar las variables de entorno

```bash
# Crea el fichero .env en la raíz del proyecto
cp .env.example .env   # o créalo manualmente
```

Edita `.env` con tus credenciales de Supabase (ver sección siguiente).

### 3. Iniciar el servidor de desarrollo

```bash
npx expo start
```

| Dispositivo | Instrucción |
|---|---|
| **Físico** | Abre Expo Go y escanea el QR de la terminal |
| **Emulador Android** | Pulsa `a` en la terminal (requiere Android Studio) |
| **Simulador iOS** | Pulsa `i` en la terminal (requiere macOS + Xcode) |

---

## 🔐 Variables de Entorno

Crea un fichero `.env` en la raíz del proyecto con estas variables. Encuéntralas en tu proyecto de Supabase bajo **Project Settings → API**:

```env
EXPO_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

> ⚠️ **Nunca subas el fichero `.env` a un repositorio público.** Asegúrate de que está en `.gitignore`.

El prefijo `EXPO_PUBLIC_` es obligatorio para que Expo exponga la variable en el bundle del cliente de forma segura.

---

## 📝 Notas de Desarrollo

- **Email rate limit**: Supabase limita a **2 emails/hora** en el plan gratuito. Para desarrollo, desactiva la confirmación por email en **Authentication → Providers → Email → Confirm email: OFF**.
- **Confirmación manual**: Para confirmar usuarios existentes sin esperar email, ejecuta en el SQL Editor de Supabase:
  ```sql
  UPDATE auth.users SET email_confirmed_at = NOW() WHERE email_confirmed_at IS NULL;
  ```
- **SMTP propio**: Para producción, configura un servidor SMTP externo (Resend, Mailgun, etc.) en **Authentication → Settings → SMTP** para eliminar el límite de emails.
