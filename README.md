# PokéMarket

Aplicación móvil desarrollada con **React Native** y **Expo** para la exploración, consulta y compra simulada de cartas coleccionables Pokémon. La aplicación implementa navegación personalizada sin dependencias externas pesadas, filtrado reactivo en tiempo real, persistencia en memoria del carrito de compras y animaciones fluidas con la API nativa de React Native.

---

## Índice

1. [Arquitectura y Modelado de Datos](#arquitectura-y-modelado-de-datos)
2. [Funcionalidades Principales](#funcionalidades-principales)
   - [Catálogo y Búsqueda en Tiempo Real](#1-catálogo-y-búsqueda-en-tiempo-real)
   - [Detalle de Carta y Notificación Animada (Popup)](#2-detalle-de-carta-y-notificación-animada-popup)
   - [Gestión Integral del Carrito](#3-gestión-integral-del-carrito)
   - [Barra de Navegación Inferior Dinámica](#4-barra-de-navegación-inferior-dinámica)
3. [Implementaciones Técnicas Destacadas](#implementaciones-técnicas-destacadas)
   - [Animación del Popup (Animated API + Modal)](#implementación-técnica-popup-animado-con-animated-y-modal)
   - [Lógica de Control del Carrito y Totales](#lógica-de-control-del-carrito-y-totales-con-reduce)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Tecnologías Utilizadas](#tecnologías-utilizadas)
6. [Instalación y Puesta en Funcionamiento](#instalación-y-puesta-en-funcionamiento)
7. [Formato de Datos de las Cartas](#formato-de-datos-de-las-cartas)

---

## Arquitectura y Modelado de Datos

El proyecto se basa en una arquitectura de estado centralizado en `App.tsx`, siguiendo el flujo unidireccional de datos de React:

* **Estado de navegación (`pantallaActual`)**: Controla qué pantalla principal se renderiza (`'Inicio'`, `'Colección'`, `'Carrito'`, `'Cuenta'`).
* **Estado de selección (`cartaSeleccionada`)**: Permite abrir y cerrar la vista detallada de una carta (`Carta | null`).
* **Estado del carrito (`carrito`)**: Lista de artículos agregados (`ArticuloCarrito[]`), vinculando cada carta con su número de unidades seleccionadas.

### Tipos TypeScript principales

```typescript
// Modelo representativo de cada carta Pokémon
type Carta = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  expansion: string;
  numero: string;
  imagen: string;
};

// Elemento individual dentro de la cesta de la compra
type ArticuloCarrito = {
  carta: Carta;
  cantidad: number;
};

// Rutas disponibles en la barra inferior
type Pantalla = 'Inicio' | 'Colección' | 'Carrito' | 'Cuenta';
```

---

## Funcionalidades Principales

### 1. Catálogo y Búsqueda en Tiempo Real
* **Grid interactivo**: Muestra las cartas cargadas desde `data/cartas.json` con su imagen oficial, nombre, precio formateado en euros, expansión y número de serie.
* **Filtro multicampo en vivo**: Al escribir en el buscador, se filtran las cartas instantáneamente evaluando coincidencias tanto en el nombre como en la descripción (`.toLowerCase()` para asegurar insensibilidad a mayúsculas/minúsculas).
* **Feedback de búsqueda vacía**: Si ninguna carta coincide con el texto ingresado, se despliega un mensaje amigable indicándolo.
* **Scroll optimizado**: La lista se renderiza con `showsVerticalScrollIndicator={false}` para mantener una interfaz limpia y moderna.

### 2. Detalle de Carta y Notificación Animada (Popup)
* Al seleccionar una carta del catálogo, se muestra una pantalla con su imagen ampliada y ficha técnica completa.
* **Botón Añadir al Carrito**: Comunica con el estado global para añadir el artículo. Si el artículo ya existía en la cesta, incrementa su contador en vez de crear una fila duplicada.
* **Notificación emergente no intrusiva**: Un aviso flotante animado confirma la adición exitosa sin necesidad de cambiar de pantalla ni interrumpir la navegación.
* **Retorno fluido**: Botón directo para regresar al catálogo conservando la posición y la búsqueda anterior.

### 3. Gestión Integral del Carrito
* **Cálculo de totales en tiempo real**: La cabecera calcula automáticamente el total de artículos y el precio final acumulado mediante el método `.reduce()`.
* **Controles de cantidad (+ / −)**: Cada tarjeta del carrito cuenta con botones interactivos para sumar o restar unidades de manera inmediata.
* **Auto-eliminación por umbral**: Si las unidades de un artículo bajan a `0`, se descarta automáticamente del carrito.
* **Eliminación con confirmación nativa**: El botón de papelera ejecuta `Alert.alert()`, solicitando confirmación del usuario para evitar borrados accidentales.
* **Estado de carrito vacío**: Si no hay cartas añadidas, se visualiza una vista con diseño especial informando al usuario y animándole a explorar el catálogo.

### 4. Barra de Navegación Inferior Dinámica
* Componente modular (`BottomBar.tsx`) anclado en la parte inferior.
* Mapeo dinámico de las 4 rutas principales con iconos vectoriales de `@expo/vector-icons/Ionicons`.
* Resaltado visual en color rojo y tipografía en negrita para la sección actualmente activa.
* **Reseteo inteligente**: Al pulsar sobre "Inicio" cuando se está visualizando el detalle de una carta, se cierra el detalle automáticamente volviendo al catálogo general.

---

## Implementaciones Técnicas Destacadas

### Implementación Técnica: Popup Animado con `Animated` y `Modal`

Para brindar una experiencia de usuario (UX) pulida al añadir una carta al carrito, se utiliza la API nativa `Animated` de React Native combinada con un `Modal`.

#### 1. Lógica de la animación encadenada (`CardDetailScreen.tsx`):

```typescript
const escala = useRef(new Animated.Value(0.8)).current;
const opacidad = useRef(new Animated.Value(0)).current;

const mostrarPopup = () => {
    setPopupVisible(true);

    // Valores iniciales
    escala.setValue(0.8);
    opacidad.setValue(0);

    Animated.sequence([
        // 1. Entrada con efecto resorte (spring) y desvanecimiento
        Animated.parallel([
            Animated.spring(escala, {
                toValue: 1,
                friction: 6,
                useNativeDriver: true,
            }),
            Animated.timing(opacidad, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]),
        // 2. Pausa visible durante 1.6 segundos
        Animated.delay(400),
        // 3. Salida suave desvaneciéndose
        Animated.parallel([
            Animated.timing(escala, {
                toValue: 0.85,
                duration: 120,
                useNativeDriver: true,
            }),
            Animated.timing(opacidad, {
                toValue: 0,
                duration: 120,
                useNativeDriver: true,
            }),
        ]),
    ]).start(({ finished }) => {
        if (finished) {
            setPopupVisible(false);
        }
    });
};
```

#### 2. Renderizado del Modal con `Animated.View`:

```tsx
<Modal
    transparent
    visible={popupVisible}
    animationType="none"
    statusBarTranslucent
    onRequestClose={() => setPopupVisible(false)}
>
    <View style={styles.fondoPopup}>
        <Animated.View
            style={[
                styles.tarjetaPopup,
                {
                    opacity: opacidad,
                    transform: [{ scale: escala }],
                },
            ]}
        >
            <View style={styles.iconoPopup}>
                <Text style={styles.checkPopup}>✓</Text>
            </View>
            <Text style={styles.tituloPopup}>¡Añadida al carrito!</Text>
            <Text style={styles.textoPopup}>
                {carta.nombre} se ha añadido correctamente.
            </Text>
        </Animated.View>
    </View>
</Modal>
```

---

### Lógica de Control del Carrito y Totales con `reduce`

#### Actualización inmutable sin duplicados (`App.tsx`):

```typescript
alAñadirCarrito={(carta) => {
  setCarrito((carritoActual) => {
    const articuloExistente = carritoActual.find(
      (articulo) => articulo.carta.id === carta.id
    );

    // Si ya existe, incrementamos cantidad
    if (articuloExistente) {
      return carritoActual.map((articulo) =>
        articulo.carta.id === carta.id
          ? { ...articulo, cantidad: articulo.cantidad + 1 }
          : articulo
      );
    }

    // Si es nuevo, lo añadimos con cantidad inicial de 1
    return [...carritoActual, { carta, cantidad: 1 }];
  });
}}
```

#### Cálculo acumulativo dinámico (`CartScreen.tsx`):

```tsx
<Text style={styles.subtitulo}>
  {carrito.reduce((total, articulo) => total + articulo.cantidad, 0)} artículos · 
  {carrito
    .reduce((total, articulo) => total + articulo.carta.precio * articulo.cantidad, 0)
    .toFixed(2)
    .replace('.', ',')} €
</Text>
```

---

## Estructura del Proyecto

```
pokemarket/
├── App.tsx                        # Componente raíz: gestor de estados globales y enrutador condicional
├── app.json                       # Metadatos y configuración de Expo
├── package.json                   # Dependencias y scripts de ejecución
├── tsconfig.json                  # Configuración del compilador TypeScript
├── components/
│   └── BottomBar.tsx              # Barra inferior fija de navegación con Ionicons
├── screens/
│   ├── CatalogScreen.tsx          # Catálogo con buscador en tiempo real y listado de cartas
│   ├── CardDetailScreen.tsx       # Ficha de detalle, botón de compra y notificación animada
│   └── CartScreen.tsx             # Carrito con control de unidades, totales y confirmación de borrado
└── data/
    └── cartas.json                # Fichero JSON local con el catálogo de cartas Pokémon
```

---

## Tecnologías Utilizadas

| Tecnología | Versión | Propósito |
|---|---|---|
| **Expo SDK** | ~57.0.27 | Plataforma y herramientas de desarrollo para React Native |
| **React** | 19.2.3 | Biblioteca base para la gestión declarativa de interfaces y estados |
| **React Native** | 0.86.3 | Framework para aplicaciones móviles nativas multiplataforma |
| **TypeScript** | ~6.0.3 | Tipado estático para mayor robustez y prevención de errores |
| **react-native-safe-area-context** | ~5.7.0 | Adaptación a bordes, barras de estado y *notches* de dispositivos |
| **@expo/vector-icons** | ^15.0.2 | Iconografía vectorial nativa (*Ionicons*) |

---

## Instalación y Puesta en Funcionamiento

### 1. Requisitos previos
* **Node.js** 18 o superior.
* **npm** 9 o superior.
* Aplicación **Expo Go** instalada en tu dispositivo móvil (Android / iOS) o un emulador configurado.

### 2. Clonación e instalación

```bash
# Clonar el repositorio
git clone <url-del-repositorio>
cd pokemarket

# Instalar dependencias
npm install
```

### 3. Iniciar el entorno de desarrollo

```bash
npx expo start
```

* **Dispositivo físico**: Abre Expo Go en tu teléfono y escanea el código QR mostrado en la terminal.
* **Emulador Android**: Pulsa la tecla `a` en la terminal (requiere Android Studio).
* **Simulador iOS**: Pulsa la tecla `i` en la terminal (requiere macOS y Xcode).

---

## Formato de Datos de las Cartas

El archivo `data/cartas.json` almacena el catálogo de cartas. Cada objeto cumple con la estructura:

```json
{
  "id": "1",
  "nombre": "Charizard ex",
  "precio": 89.99,
  "descripcion": "Carta holográfica de Charizard ex con acabado brillante y gran poder de ataque.",
  "expansion": "151",
  "numero": "199/165",
  "imagen": "https://images.pokemontcg.io/sv3pt5/199_hires.png"
}
```

Para incorporar nuevas cartas a la tienda, simplemente añade un nuevo objeto respetando este formato dentro del array en `data/cartas.json`.