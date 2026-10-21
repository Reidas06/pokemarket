
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

  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('Inicio');
  const [carrito, setCarrito] = useState<ArticuloCarrito[]>([]);
  const eliminarCarta = (id: string) => {
    setCarrito((carritoActual) => carritoActual.filter((articulo) => articulo.carta.id !== id));
  };


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


      <BottomBar
        pantallaActual={pantallaActual}
        alCambiarPantalla={(pantalla) => {
          setPantallaActual(pantalla);

          if (pantalla === 'Inicio') {
            setCartaSeleccionada(null);
          }
        }}
      />

    </SafeAreaView>
  );

}
