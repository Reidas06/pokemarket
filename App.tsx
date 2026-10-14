
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

export default function App() {

  const [cartaSeleccionada, setCartaSeleccionada] = useState<Carta | null>(null);
  const [pantallaActual, setPantallaActual] = useState<Pantalla>('Inicio');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <StatusBar style="dark" />

      <View style={{ flex: 1 }}>
        {pantallaActual === 'Carrito' ? (
          <CartScreen />
        ) : cartaSeleccionada === null ? (
          <CatalogScreen
            alSeleccionarCarta={(carta) => setCartaSeleccionada(carta)}
          />
        ) : (
          <CardDetailScreen
            carta={cartaSeleccionada}
            volver={() => setCartaSeleccionada(null)}
          />
        )}
      </View>

      <BottomBar
        pantallaActual={pantallaActual}
        alCambiarPantalla={setPantallaActual}
      />
    </SafeAreaView>
  );

}
