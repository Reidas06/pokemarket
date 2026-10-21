import { Pressable, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Pantalla = 'Inicio' | 'Colección' | 'Carrito' | 'Cuenta';

type Props = {
    pantallaActual: Pantalla;
    alCambiarPantalla: (pantalla: Pantalla) => void;
};

export default function BottomBar({
    pantallaActual,
    alCambiarPantalla,
}: Props) {
    return (

        <View style={styles.barra}>
            {/* Recorremos las pestañas para crear cada botón de la barra */}
            {(['Inicio', 'Colección', 'Carrito', 'Cuenta'] as Pantalla[]).map(
                (pantalla) => (
                    <Pressable
                        key={pantalla}
                        style={styles.boton}
                        onPress={() => alCambiarPantalla(pantalla)}
                    >
                        {/* Icono dinámico según la pestaña y en rojo si es la seleccionada */}
                        <Ionicons
                            name={
                                pantalla === 'Inicio'
                                    ? 'home-outline'
                                    : pantalla === 'Colección'
                                        ? 'wallet-outline'
                                        : pantalla === 'Carrito'
                                            ? 'cart-outline'
                                            : 'person-outline'
                            }
                            size={24}
                            color={pantallaActual === pantalla ? 'red' : 'black'}
                        />

                        <Text
                            style={[
                                styles.textoBoton,
                                pantallaActual === pantalla && styles.seleccionado,
                            ]}
                        >
                            {pantalla}
                        </Text>
                    </Pressable>
                )
            )}
        </View>

    );
}

const styles = StyleSheet.create({
    barra: {
        flexDirection: 'row',
        backgroundColor: 'white',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    boton: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 6,
    },
    textoBoton: {
        color: 'black',
        fontSize: 12,
    },
    seleccionado: {
        color: 'red',
        fontWeight: 'bold',
    },
});
