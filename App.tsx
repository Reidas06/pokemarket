
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CatalogScreen from './screens/CatalogScreen';
import CardDetailScreen from './screens/CardDetailScreen';
import CartScreen from './screens/CartScreen';
import BottomBar from './components/BottomBar';


type Pantalla = 'Inicio' | 'Colección' | 'Carrito' | 'Cuenta';

type Carta = {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  expansion: string;
  numero: string;
  imagen: string;
};

type ArticuloCarrito = {
  carta: Carta;
  cantidad: number;
};

export default function App() {

  // Guarda la carta que el usuario pulsa para ver su detalle (null si estamos en la lista general)
  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  // Controla qué pestaña de la barra de abajo está activa
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('Inicio');
  // Lista de cartas metidas en el carrito con su cantidad
  const [carrito, setCarrito] = useState<ArticuloCarrito[]>([]);
  // Elimina una carta del carrito filtrando por su id
  const eliminarCarta = (id: string) => {
    setCarrito((carritoActual) => carritoActual.filter((articulo) => articulo.carta.id !== id));
  };

  // Modifica la cantidad (+1 o -1); si baja a 0 o menos la quita del carrito
  const cambiarCantidad = (id: string, cambio: number) => {
    setCarrito((carritoActual) =>
      carritoActual
        .map((articulo) =>
          articulo.carta.id === id
            ? {
              ...articulo,
              cantidad: articulo.cantidad + cambio,
            }
            : articulo
        )
        .filter((articulo) => articulo.cantidad > 0)
    );
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />

      {/* Vista principal: renderizado condicional según la pestaña o si hay carta abierta */}
      <View style={{ flex: 1 }}>
        {pantallaActual === 'Carrito' ? (
          <CartScreen
            carrito={carrito} alEliminarCarta={eliminarCarta} alCambiarCantidad={cambiarCantidad}
          />
        ) : cartaSeleccionada === null ? (
          <CatalogScreen
            alSeleccionarCarta={(carta) => setCartaSeleccionada(carta)}
          />
        ) : (
          <CardDetailScreen
            carta={cartaSeleccionada}
            volver={() => setCartaSeleccionada(null)}
            alAñadirCarrito={(carta) => {
              // Si la carta ya está en el carrito le sumamos 1, si no la añadimos con cantidad 1
              setCarrito((carritoActual) => {
                const articuloExistente = carritoActual.find(
                  (articulo) => articulo.carta.id === carta.id
                );

                if (articuloExistente) {
                  return carritoActual.map((articulo) =>
                    articulo.carta.id === carta.id
                      ? { ...articulo, cantidad: articulo.cantidad + 1 }
                      : articulo
                  );
                }

                return [...carritoActual, { carta, cantidad: 1 }];
              });
            }}

          />
        )}
      </View>


      {/* Barra de navegación inferior */}
      <BottomBar
        pantallaActual={pantallaActual}
        alCambiarPantalla={(pantalla) => {
          setPantallaActual(pantalla);

          // Si volvemos a Inicio, cerramos el detalle de la carta para volver a ver el catálogo
          if (pantalla === 'Inicio') {
            setCartaSeleccionada(null);
          }
        }}
      />

    </SafeAreaView>
  );

}
