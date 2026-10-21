
import { Image, ScrollView, StyleSheet, Text, View, Pressable, Modal, Animated } from 'react-native';
import { useState, useEffect, useRef } from 'react';

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

    const [popupVisible, setPopupVisible] = useState(false);

    const escala = useRef(new Animated.Value(0.8)).current;
    const opacidad = useRef(new Animated.Value(0)).current;

    //Animación do popup das compras de cartas
    const mostrarPopup = () => {
        setPopupVisible(true);

        escala.setValue(0.8);
        opacidad.setValue(0);

        Animated.sequence([
            Animated.parallel([
                Animated.spring(escala, {
                    toValue: 1,
                    useNativeDriver: true,
                    friction: 6,
                }),
                Animated.timing(opacidad, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true,
                }),
            ]),
            Animated.delay(400),
            Animated.parallel([
                Animated.timing(escala, {
                    toValue: 0.85,
                    duration: 120,
                    useNativeDriver: true,
                }), Animated.timing(opacidad, {
                    toValue: 0,
                    duration: 120,
                    useNativeDriver: true,
                }),
            ]),
        ]).start(({ finished }) => {
            if (finished) {
                setPopupVisible(false);
            }
        });
    };


    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.logo}>POKÉMARKET</Text>
            </View>

            {/* ScrollIndicator en false para que no se vea la barra del scroll*/}
            <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
                {/*Imagen de la carta*/}
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
                    //Al pulsar añádese a carta ao carrito e mostra o popup
                    onPress={() => {
                        alAñadirCarrito(carta);
                        mostrarPopup();
                    }}
                    style={styles.botonCarrito}>
                    <Text style={styles.textoBotonCarrito}>
                        Añadir al carrito
                    </Text>
                </Pressable>

            </ScrollView>

            {/*Botón para volver ao catálogo*/}
            <Pressable onPress={volver} style={styles.botonVolver}>
                <Text style={styles.textoVolver}>‹ Volver al catálogo</Text>
            </Pressable>

            {/*Modal para que aparezca la notificación cuando se añade al carrito*/}
            <Modal
                transparent
                visible={popupVisible}
                animationType="none"
                statusBarTranslucent
                onRequestClose={() => setPopupVisible(false)}>

                <View style={styles.fondoPopup}>
                    <Animated.View
                        style={[
                            styles.tarjetaPopup,
                            {
                                opacity: opacidad,
                                transform: [{ scale: escala }],
                            },
                        ]}
                    >
                        <View style={styles.iconoPopup}>
                            <Text style={styles.checkPopup}>✓</Text>
                        </View>

                        <Text style={styles.tituloPopup}>
                            ¡Añadida al carrito!
                        </Text>

                        <Text style={styles.textoPopup}>
                            {carta.nombre} se ha añadido correctamente.
                        </Text>
                    </Animated.View>
                </View>
            </Modal>

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

    // Estilos del popup
    fondoPopup: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    tarjetaPopup: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: 'white',
        borderRadius: 18,
        paddingVertical: 26,
        paddingHorizontal: 22,
        alignItems: 'center',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    iconoPopup: {
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: '#FCE8E8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    checkPopup: {
        color: 'red',
        fontSize: 36,
        fontWeight: 'bold',
    },
    tituloPopup: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textoPopup: {
        color: '#555',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },

});
