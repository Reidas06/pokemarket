
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View } from 'react-native';
import CatalogScreen from './screens/CatalogScreen';
import CardDetailScreen from './screens/CardDetailScreen';
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

export default function App() {

  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('Inicio');

  return (
    <>
      <StatusBar style="dark" />

      {cartaSeleccionada === null ? (
        <CatalogScreen
          alSeleccionarCarta={(carta) => setCartaSeleccionada(carta)}
        />
      ) : (
        <CardDetailScreen
          carta={cartaSeleccionada}
          volver={() => setCartaSeleccionada(null)}
        />
      )}

      <View>
        <BottomBar
          pantallaActual={pantallaActual}
          alCambiarPantalla={setPantallaActual}
        />
      </View>
    </>
  );
}
