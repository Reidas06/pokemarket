# PokéMarket

Aplicación móvil desarrollada con React Native y Expo para explorar y consultar cartas Pokémon. Permite navegar por un catálogo, buscar cartas y ver el detalle de cada una.

---

## Funcionalidades

### Catálogo de cartas

La pantalla principal muestra todas las cartas disponibles cargadas desde un archivo local de datos. Cada tarjeta presenta la imagen oficial de la carta, su nombre, la expansión a la que pertenece, el número de colección y el precio en euros.

### Búsqueda en tiempo real

En la pantalla del catálogo hay un campo de búsqueda que filtra las cartas a medida que el usuario escribe. La búsqueda tiene en cuenta tanto el nombre de la carta como su descripción.

### Detalle de carta

Al pulsar sobre cualquier carta del catálogo, se navega a una pantalla de detalle que muestra la imagen a mayor tamaño, el nombre, el precio, la descripción completa, la expansión y el número de colección. Desde esta pantalla se puede volver al catálogo mediante un botón.

### Barra de navegación inferior

La aplicación incluye una barra de navegación fija en la parte inferior de la pantalla con cuatro secciones: Inicio, Colección, Carrito y Cuenta. Cada sección muestra un icono de Ionicons y su etiqueta de texto. La sección activa se resalta en rojo tanto en el icono como en el texto.

---

## Tecnologias utilizadas

| Tecnologia | Version |
|---|---|
| Expo SDK | ~57.0.27 |
| React | 19.2.3 |
| React Native | 0.86.3 |
| TypeScript | ~6.0.3 |
| react-native-safe-area-context | ~5.7.0 |
| @expo/vector-icons (Ionicons) | ^15.0.2 |

---

## Estructura del proyecto

```
pokemarket/
├── App.tsx                        # Componente raiz, gestiona el estado de navegacion
├── app.json                       # Configuracion de Expo
├── package.json
├── index.ts
├── components/
│   └── BottomBar.tsx              # Barra de navegacion inferior
├── screens/
│   ├── CatalogScreen.tsx          # Pantalla del catalogo con buscador
│   ├── CardDetailScreen.tsx       # Pantalla de detalle de carta
│   └── CartScreen.tsx             # Pantalla del carrito (en desarrollo)
└── data/
    └── cartas.json                # Datos locales de las cartas
```

---

## Requisitos previos

- Node.js 18 o superior
- npm 9 o superior
- Expo Go instalado en el dispositivo movil (iOS o Android), o un emulador configurado localmente

---

## Instalacion

1. Clona el repositorio:

```bash
git clone <url-del-repositorio>
cd pokemarket
```

2. Instala las dependencias:

```bash
npm install
```

---

## Puesta en funcionamiento

Inicia el servidor de desarrollo de Expo:

```bash
npm start
```

Esto abre la interfaz de Expo en el navegador y muestra un codigo QR. A partir de aqui tienes tres opciones:

- **Dispositivo fisico**: Abre la aplicacion Expo Go en tu movil y escanea el codigo QR.
- **Emulador Android**: Pulsa la tecla `a` en la terminal para abrir el emulador de Android (requiere Android Studio y un AVD configurado).
- **Simulador iOS**: Pulsa la tecla `i` en la terminal para abrir el simulador de iOS (solo disponible en macOS con Xcode instalado).

---

## Datos de las cartas

Las cartas se cargan desde `data/cartas.json`. Cada entrada tiene la siguiente estructura:

```json
{
  "id": "string",
  "nombre": "string",
  "precio": 0.00,
  "descripcion": "string",
  "expansion": "string",
  "numero": "string",
  "imagen": "url de la imagen"
}
```

Para añadir nuevas cartas basta con agregar entradas al array de ese archivo siguiendo el mismo formato.