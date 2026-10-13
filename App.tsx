
import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import CatalogScreen from './screens/CatalogScreen';
import CardDetailScreen from './screens/CardDetailScreen';

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
  return (
    <>
      <StatusBar style="dark" />

      {cartaSeleccionada === null ? (
        <CatalogScreen />
      ) : (
        <CardDetailScreen
          carta={cartaSeleccionada}
          volver={() => setCartaSeleccionada(null)}
        />
      )}
    </>
  );
}
