
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
};

export default function CardDetailScreen({ carta, volver }: Props) {
    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Pressable onPress={volver} style={styles.botonVolver}>
                    <Text style={styles.textoVolver}>‹ Volver al catálogo</Text>
                </Pressable>

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
            </ScrollView>
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
        paddingTop: 55,
        paddingHorizontal: 20,
        paddingBottom: 18,
    },
    botonVolver: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        marginBottom: 8,
    },
    textoVolver: {
        color: 'white',
        fontSize: 16,
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
        width: 250,
        height: 330,
    },
    nombre: {
        color: 'black',
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
        textAlign: 'center',
    },
    precio: {
        color: 'red',
        fontSize: 25,
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
});
