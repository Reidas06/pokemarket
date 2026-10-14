
import { Image, ScrollView, StyleSheet, Text, View, Pressable, } from 'react-native';

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
    carta: Carta;
    volver: () => void;
    alAñadirCarrito: (carta: Carta) => void;
};

export default function CardDetailScreen({ carta, volver, alAñadirCarrito }: Props) {
    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.logo}>POKÉMARKET</Text>
            </View>

            <ScrollView contentContainerStyle={styles.contenido}>
                <Image
                    source={{ uri: carta.imagen }}
                    style={styles.imagen}
                    resizeMode="contain"
                />

                <Text style={styles.nombre}>{carta.nombre}</Text>

                <Text style={styles.precio}>
                    {carta.precio.toFixed(2)} €
                </Text>

                <Text style={styles.descripcion}>{carta.descripcion}</Text>

                <View style={styles.informacion}>
                    <Text style={styles.etiqueta}>Expansión</Text>
                    <Text style={styles.valor}>{carta.expansion}</Text>

                    <Text style={styles.etiqueta}>Número de colección</Text>
                    <Text style={styles.valor}>{carta.numero}</Text>
                </View>

                <Pressable
                    onPress={() => alAñadirCarrito(carta)}
                    style={styles.botonCarrito}>
                    <Text style={styles.textoBotonCarrito}>
                        Añadir al carrito
                    </Text>
                </Pressable>

            </ScrollView>

            <Pressable onPress={volver} style={styles.botonVolver}>
                <Text style={styles.textoVolver}>‹ Volver al catálogo</Text>
            </Pressable>
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
    botonVolver: {
        backgroundColor: 'red',
        paddingVertical: 15,
        alignItems: 'center',
    },
    textoVolver: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    logo: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
    },
    contenido: {
        padding: 20,
        alignItems: 'center',
        paddingBottom: 35,
    },
    imagen: {
        width: 200,
        height: 280,
    },
    nombre: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    precio: {
        color: 'red',
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    descripcion: {
        color: 'black',
        fontSize: 16,
        marginTop: 18,
        textAlign: 'center',
    },
    informacion: {
        width: '100%',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 10,
        padding: 16,
        marginTop: 24,
    },
    etiqueta: {
        color: 'black',
        fontSize: 14,
        marginTop: 8,
    },
    valor: {
        color: 'black',
        fontSize: 17,
        fontWeight: 'bold',
        marginTop: 3,
    },
    botonCarrito: {
        backgroundColor: 'black',
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
        marginTop: 40,
        borderRadius: 10,
    },
    textoBotonCarrito: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
