import { StyleSheet, Text, View, Image, ScrollView } from "react-native";
import Icon from '@expo/vector-icons/Ionicons';


type Carta = {
    id: string;
    nombre: string;
    precio: number;
    descripcion: string;
    expansion: string;
    numero: string;
    imagen: string;
};

type Props = {
    carrito: Carta[];
};

export default function CartScreen({ carrito }: Props) {

    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>
                    Carrito <Icon name="cart-outline" size={24} color="white" />
                </Text>

                <Text style={styles.subtitulo}>
                    {carrito.length} artículos · {carrito.reduce((total, carta) => total + carta.precio, 0).toFixed(2).replace('.', ',')} €
                </Text>
            </View>

            {carrito.length === 0 ? (
                <View style={styles.contenido}>
                    <Text style={styles.mensaje}>
                        Tu carrito está vacío
                    </Text>
                    <Text style={styles.descripcion}>
                        Añade cartas desde el catálogo y aparecerán aquí.
                    </Text>
                </View>
            ) : (
                <ScrollView contentContainerStyle={styles.contenido}>
                    {carrito.map((carta, indice) => (
                        <View key={`${carta.id}-${indice}`} style={styles.itemCarta}>
                            <Image
                                source={{ uri: carta.imagen }}
                                style={styles.imagenCarta}
                                resizeMode="contain"
                            />

                            <View style={styles.infoCarta}>
                                <Text style={styles.nombreCarta}>
                                    {carta.nombre}
                                </Text>

                                <Text style={styles.precioCarta}>
                                    {carta.precio.toFixed(2).replace('.', ',')} €
                                </Text>

                                <Text style={styles.detalleCarta}>
                                    Expansión: {carta.expansion}
                                </Text>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
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
        color: 'gray',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 10,
    },

    itemCarta: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        marginBottom: 12,
        padding: 12,
        borderRadius: 12,
        elevation: 2,
    },
    imagenCarta: {
        width: 90,
        height: 125,
    },
    infoCarta: {
        flex: 1,
        marginLeft: 14,
        justifyContent: 'center',
    },
    nombreCarta: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    precioCarta: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'red',
        marginBottom: 6,
    },
    detalleCarta: {
        fontSize: 13,
        color: 'gray',
    },

});