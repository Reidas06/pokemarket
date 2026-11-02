
import { useState, useRef } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, View, Pressable } from 'react-native';

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

type Props = {
    alSeleccionarCarta: (carta: Carta) => void;
};

export default function CatalogScreen({ alSeleccionarCarta }: Props) {
    // Texto que escribe el usuario en el buscador
    const [busqueda, setBusqueda] = useState('');

    const [expansionSeleccionada, setExpansionSeleccionada] = useState('Todas las expansiones');

    const [desplegableAbierto, setDesplegableAbierto] = useState(false);

    // Página actual del catálogo
    const [paginaActual, setPaginaActual] = useState(1);

    // Número de cartas que se mostrarán por página
    const cartasPorPagina = 6;

    const scrollRef = useRef<ScrollView>(null);

    // Filtra las cartas en tiempo real comparando por nombre o descripción (en minúsculas para ignorar mayúsculas)
    const cartasFiltradas = (cartas as Carta[]).filter((carta) =>
        (expansionSeleccionada === 'Todas las expansiones' || carta.expansion === expansionSeleccionada) &&
        (carta.nombre.toLowerCase().includes(busqueda.toLowerCase()) || carta.descripcion.toLowerCase().includes(busqueda.toLowerCase()))
    );

    // Índice de la primera carta de la página actual
    const indiceInicial = (paginaActual - 1) * cartasPorPagina;

    // Cartas que se mostrarán en la página actual
    const cartasPaginadas = cartasFiltradas.slice(
        indiceInicial,
        indiceInicial + cartasPorPagina
    );

    // Número total de páginas
    const totalPaginas = Math.ceil(
        cartasFiltradas.length / cartasPorPagina
    );

    //Seleccionador de expansiones reactivo
    const expansiones = [
        'Todas las expansiones',
        ...Array.from(
            new Set((cartas as Carta[]).map((carta) => carta.expansion))
        ).sort((a, b) => a.localeCompare(b)),
    ];


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
                    onChangeText={(texto) => {
                        setBusqueda(texto);
                        setPaginaActual(1);
                    }}
                />


                <Pressable
                    style={styles.selectorExpansion}
                    onPress={() => setDesplegableAbierto(!desplegableAbierto)}
                >
                    <Text style={styles.textoSelector}>
                        {expansionSeleccionada}
                    </Text>

                    <Text style={styles.iconoSelector}>
                        {desplegableAbierto ? '▲' : '▼'}
                    </Text>
                </Pressable>

                {desplegableAbierto && (
                    <ScrollView
                        style={styles.listaExpansiones}
                        nestedScrollEnabled={true}
                        showsVerticalScrollIndicator={true}
                    >
                        {expansiones.map((expansion) => (
                            <Pressable
                                key={expansion}
                                style={[
                                    styles.opcionExpansion,
                                    expansionSeleccionada === expansion &&
                                    styles.opcionSeleccionada,
                                ]}
                                onPress={() => {
                                    setExpansionSeleccionada(expansion);
                                    setPaginaActual(1);
                                    setDesplegableAbierto(false);
                                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                                }}
                            >
                                <Text
                                    style={[
                                        styles.textoOpcion,
                                        expansionSeleccionada === expansion &&
                                        styles.textoOpcionSeleccionada,
                                    ]}
                                >
                                    {expansion}
                                </Text>
                            </Pressable>
                        ))}
                    </ScrollView>
                )}


                {/* ScrollIndicator en false para que no se vea la barra del scroll*/}
                <ScrollView
                    ref={scrollRef}
                    contentContainerStyle={styles.lista}
                    showsVerticalScrollIndicator={false}
                >
                    {/*Bucle que recorre el array cartasFiltradas*/}
                    {cartasPaginadas.map((carta) => (
                        <Pressable key={carta.id} style={styles.tarjeta} onPress={() => alSeleccionarCarta(carta)}>
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
                        </Pressable>
                    ))}

                    {cartasFiltradas.length === 0 && (
                        <Text style={styles.sinResultados}>
                            No se han encontrado cartas.
                        </Text>
                    )}

                    {cartasFiltradas.length > 0 && (
                        <View style={styles.paginacion}>
                            <Pressable
                                style={[
                                    styles.botonPagina,
                                    paginaActual === 1 && styles.botonDesactivado,
                                ]}
                                disabled={paginaActual === 1}
                                onPress={() => {
                                    setPaginaActual(paginaActual - 1);
                                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                                }}
                            >
                                <Text style={styles.textoBotonPagina}>Anterior</Text>
                            </Pressable>

                            <Text style={styles.textoPagina}>
                                Página {paginaActual} de {totalPaginas}
                            </Text>

                            <Pressable
                                style={[
                                    styles.botonPagina,
                                    paginaActual === totalPaginas && styles.botonDesactivado,
                                ]}
                                disabled={paginaActual === totalPaginas}
                                onPress={() => {
                                    setPaginaActual(paginaActual + 1);
                                    scrollRef.current?.scrollTo({ y: 0, animated: true });
                                }}
                            >
                                <Text style={styles.textoBotonPagina}>Siguiente</Text>
                            </Pressable>
                        </View>
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
        paddingTop: 24,
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
    paginacion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 20,
    },
    botonPagina: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 20,
    },
    botonDesactivado: {
        backgroundColor: '#CCCCCC',
    },
    textoBotonPagina: {
        color: 'white',
        fontWeight: 'bold',
    },
    textoPagina: {
        color: 'black',
        fontWeight: 'bold',
    },
    selectorExpansion: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        backgroundColor: 'white',
    },
    textoSelector: {
        color: 'black',
        fontSize: 15,
        fontWeight: 'bold',
    },
    iconoSelector: {
        color: 'red',
        fontSize: 14,
    },
    listaExpansiones: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 16,
        backgroundColor: 'white',
        marginBottom: 16,
        overflow: 'hidden',
    },
    opcionExpansion: {
        padding: 14,
        borderBottomWidth: 1,
        borderBottomColor: '#EEEEEE',
    },
    opcionSeleccionada: {
        backgroundColor: '#FFE5E5',
    },
    textoOpcion: {
        color: 'black',
        fontSize: 14,
    },
    textoOpcionSeleccionada: {
        color: 'red',
        fontWeight: 'bold',
    },

});

