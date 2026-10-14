import { StyleSheet, Text, View } from "react-native";
import Icon from '@expo/vector-icons/Ionicons';

export default function CartScreen() {
    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>Carrito <Icon name="cart-outline" size={24} color="white" /></Text>
                <Text style={styles.subtitulo}>0 artículos · 0,00 €</Text>
            </View>
            <View style={styles.contenido}>
                <Text style={styles.mensaje}>
                    Tu carrito está vacío
                </Text>
                <Text style={styles.descripcion}>
                    Añade cartas desde el catálogo y aparecerán aquí.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: 'white',
    },
    cabecera: {
        backgroundColor: 'red',
        paddingTop: 25,
        paddingHorizontal: 20,
        paddingBottom: 18,
    },
    titulo: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    subtitulo: {
        color: 'white',
        fontSize: 14,
        marginTop: 4,
    },
    contenido: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 25,
    },
    mensaje: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
    },
    descripcion: {
        color: '#666666',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
    },
});