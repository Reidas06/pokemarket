import { StyleSheet, Text, View, Image, ScrollView, Alert, Pressable } from "react-native";
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
    carrito: ArticuloCarrito[]
    alEliminarCarta: (id: string) => void;
    alCambiarCantidad: (id: string, cambio: number) => void;
};

type ArticuloCarrito = {
    carta: Carta;
    cantidad: number;
};

export default function CartScreen({ carrito, alEliminarCarta, alCambiarCantidad }: Props) {

    const confirmarEliminacion = (id: string, nombre: string) => {
        Alert.alert(
            `Eliminar carta`,
            `¿Estas seguro de que quieres eliminar ${nombre}?`,
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Eliminar',
                    onPress: () => alEliminarCarta(id),
                },
            ]
        );
    }


    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>
                    Carrito <Icon name="cart-outline" size={24} color="white" />
                </Text>

                <Text style={styles.subtitulo}>
                    {carrito.reduce((total, articulo) => total + articulo.cantidad, 0)} artículos · {carrito.reduce((total, articulo) => total + articulo.carta.precio * articulo.cantidad, 0).toFixed(2).replace('.', ',')} €
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
                // ScrollIndicator en false para que no se vea la barra del scroll
                <ScrollView contentContainerStyle={styles.listaCarrito} showsVerticalScrollIndicator={false}>
                    {/*Bucle que recorre el array carrito*/}
                    {carrito.map((articulo, indice) => (
                        <View key={`${articulo.carta.id}-${indice}`} style={styles.itemCarta}>
                            <Image
                                source={{ uri: articulo.carta.imagen }}
                                style={styles.imagenCarta}
                                resizeMode="contain"
                            />

                            <View style={styles.infoCarta}>
                                <Pressable
                                    style={styles.botonEliminar}
                                    onPress={() => confirmarEliminacion(articulo.carta.id, articulo.carta.nombre)}
                                >
                                    <Icon name="trash-outline" size={22} color="red" />
                                </Pressable>

                                <Text style={styles.nombreCarta}>
                                    {articulo.carta.nombre}
                                </Text>

                                <Text style={styles.precioCarta}>
                                    {articulo.carta.precio.toFixed(2).replace('.', ',')} €
                                </Text>

                                <Text style={styles.detalleCarta}>
                                    Expansión: {articulo.carta.expansion}
                                </Text>

                                <View style={styles.cantidadControles}>
                                    <Pressable
                                        style={[styles.botonCantidad, styles.botonMas]}
                                        onPress={() => alCambiarCantidad(articulo.carta.id, 1)}
                                    >
                                        <Text style={styles.textoCantidad}>+</Text>
                                    </Pressable>

                                    <Text style={styles.numeroCantidad}>{articulo.cantidad}</Text>

                                    <Pressable
                                        style={[styles.botonCantidad, styles.botonMenos]}
                                        onPress={() => alCambiarCantidad(articulo.carta.id, -1)}
                                    >
                                        <Text style={styles.textoCantidad}>−</Text>
                                    </Pressable>
                                </View>

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
    listaCarrito: {
        padding: 16,
        paddingBottom: 30,
    },
    botonEliminar: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#FCE8E8',
    },

    cantidadControles: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        gap: 12,
    },

    botonCantidad: {
        width: 32,
        height: 32,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },

    botonMenos: {
        backgroundColor: 'red',
    },

    botonMas: {
        backgroundColor: 'black',
    },

    textoCantidad: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
    },

    numeroCantidad: {
        color: 'black',
        fontSize: 16,
        fontWeight: 'bold',
        minWidth: 18,
        textAlign: 'center',
    },

});