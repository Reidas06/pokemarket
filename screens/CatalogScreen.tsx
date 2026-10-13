
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View, } from 'react-native';

import cartas from '../data/cartas.json';

type Carta = {
    id: string;
    nombre: string;
    precio: number;
    descripcion: string;
    expansion: string;
    numero: string;
    imagen: string;
};

export default function CatalogScreen() {
    const [busqueda, setBusqueda] = useState('');

    const cartasFiltradas = (cartas as Carta[]).filter((carta) =>
        carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        carta.descripcion.toLowerCase().includes(busqueda.toLowerCase())
    );

    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.logo}>POKÉMARKET</Text>
                <Text style={styles.subtitulo}>Tu colección Pokémon</Text>
            </View>

            <View style={styles.contenido}>
                <Text style={styles.titulo}>Cartas Pokémon</Text>
                <Text style={styles.descripcion}>
                    Descubre cartas y encuentra tu próxima favorita.
                </Text>

                <TextInput
                    style={styles.busqueda}
                    placeholder="Buscar cartas..."
                    value={busqueda}
                    onChangeText={setBusqueda}
                />

                <ScrollView contentContainerStyle={styles.lista}>
                    {cartasFiltradas.map((carta) => (
                        <View key={carta.id} style={styles.tarjeta}>
                            <Image
                                source={{ uri: carta.imagen }}
                                style={styles.imagen}
                                resizeMode="contain"
                            />

                            <Text style={styles.nombre}>{carta.nombre}</Text>
                            <Text style={styles.detalle}>
                                Expansión: {carta.expansion}
                            </Text>
                            <Text style={styles.detalle}>
                                Número: {carta.numero}
                            </Text>
                            <Text style={styles.precio}>
                                {carta.precio.toFixed(2)} €
                            </Text>
                        </View>
                    ))}

                    {cartasFiltradas.length === 0 && (
                        <Text style={styles.sinResultados}>
                            No se han encontrado cartas.
                        </Text>
                    )}
                </ScrollView>
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
        paddingTop: 55,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    logo: {
        color: 'white',
        fontSize: 26,
        fontWeight: 'bold',
    },
    subtitulo: {
        color: 'black',
        fontSize: 14,
        marginTop: 4,
    },
    contenido: {
        flex: 1,
        padding: 20,
    },
    titulo: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
    },
    descripcion: {
        fontSize: 14,
        color: 'black',
        marginTop: 6,
        marginBottom: 16,
    },
    busqueda: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        color: 'black',
    },
    lista: {
        paddingBottom: 30,
    },
    tarjeta: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 24,
        padding: 16,
        marginBottom: 16,
        alignItems: 'center',
        backgroundColor: 'white',
    },
    imagen: {
        width: 180,
        height: 230,
    },
    nombre: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 10,
    },
    detalle: {
        fontSize: 14,
        color: 'black',
        marginTop: 4,
    },
    precio: {
        color: 'red',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 10,
    },
    sinResultados: {
        textAlign: 'center',
        color: 'black',
        padding: 20,
    },
});

