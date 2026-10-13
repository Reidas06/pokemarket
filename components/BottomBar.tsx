import { Pressable, Text, View, StyleSheet } from 'react-native';

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
            {(['Inicio', 'Colección', 'Carrito', 'Cuenta'] as Pantalla[]).map(
                (pantalla) => (
                    <Pressable
                        key={pantalla}
                        style={styles.boton}
                        onPress={() => alCambiarPantalla(pantalla)}
                    >
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
        borderTopWidth: 1,
        borderTopColor: '#dddddd',
        paddingVertical: 12,
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
