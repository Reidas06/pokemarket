import { useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Modal, Pressable, Animated } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

export type BotonAlerta = {
    texto: string;
    estilo?: 'cancelar' | 'peligro' | 'primario';
    onPress?: () => void;
};

type Props = {
    visible: boolean;
    tipo?: 'exito' | 'error' | 'peligro' | 'info';
    titulo: string;
    mensaje: string;
    alCerrar: () => void;
    botones?: BotonAlerta[];
};

export default function CustomAlert({
    visible,
    tipo = 'info',
    titulo,
    mensaje,
    alCerrar,
    botones,
}: Props) {
    const escala = useRef(new Animated.Value(0.8)).current;
    const opacidad = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            escala.setValue(0.8);
            opacidad.setValue(0);

            Animated.parallel([
                Animated.spring(escala, {
                    toValue: 1,
                    friction: 6,
                    useNativeDriver: true,
                }),
                Animated.timing(opacidad, {
                    toValue: 1,
                    duration: 180,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, [visible]);

    if (!visible) return null;

    // Configuración de icono y color según el tipo
    const obtenerIcono = () => {
        switch (tipo) {
            case 'exito':
                return { nombre: 'checkmark-circle-outline' as const, color: '#2E7D32', fondo: '#E8F5E9' };
            case 'error':
                return { nombre: 'close-circle-outline' as const, color: '#D32F2F', fondo: '#FFEBEE' };
            case 'peligro':
                return { nombre: 'trash-outline' as const, color: '#D32F2F', fondo: '#FFEBEE' };
            default:
                return { nombre: 'information-circle-outline' as const, color: 'red', fondo: '#FCE8E8' };
        }
    };

    const icono = obtenerIcono();

    const botonesAMostrar: BotonAlerta[] = botones && botones.length > 0
        ? botones
        : [{ texto: 'Aceptar', estilo: 'primario', onPress: alCerrar }];

    return (
        <Modal
            transparent
            visible={visible}
            animationType="none"
            statusBarTranslucent
            onRequestClose={alCerrar}
        >
            <View style={styles.fondo}>
                {/* Al pulsar fuera del recuadro, se cierra automáticamente */}
                <Pressable style={styles.capaClicableFuera} onPress={alCerrar} />

                <Animated.View
                    style={[
                        styles.tarjeta,
                        {
                            opacity: opacidad,
                            transform: [{ scale: escala }],
                        },
                    ]}
                >
                    <View style={[styles.contenedorIcono, { backgroundColor: icono.fondo }]}>
                        <Icon name={icono.nombre} size={36} color={icono.color} />
                    </View>

                    <Text style={styles.titulo}>{titulo}</Text>
                    <Text style={styles.mensaje}>{mensaje}</Text>

                    <View style={styles.filaBotones}>
                        {botonesAMostrar.map((boton, index) => {
                            const esCancelar = boton.estilo === 'cancelar';
                            const esPeligro = boton.estilo === 'peligro';

                            return (
                                <Pressable
                                    key={index}
                                    style={[
                                        styles.boton,
                                        esCancelar && styles.botonCancelar,
                                        esPeligro && styles.botonPeligro,
                                        !esCancelar && !esPeligro && styles.botonPrimario,
                                    ]}
                                    onPress={() => {
                                        alCerrar();
                                        if (boton.onPress) {
                                            boton.onPress();
                                        }
                                    }}
                                >
                                    <Text
                                        style={[
                                            styles.textoBoton,
                                            esCancelar && styles.textoBotonCancelar,
                                        ]}
                                    >
                                        {boton.texto}
                                    </Text>
                                </Pressable>
                            );
                        })}
                    </View>
                </Animated.View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    fondo: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 24,
    },
    capaClicableFuera: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    tarjeta: {
        width: '100%',
        maxWidth: 320,
        backgroundColor: 'white',
        borderRadius: 20,
        paddingVertical: 24,
        paddingHorizontal: 22,
        alignItems: 'center',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 10,
    },
    contenedorIcono: {
        width: 60,
        height: 60,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 14,
    },
    titulo: {
        color: 'black',
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    mensaje: {
        color: '#555',
        fontSize: 15,
        textAlign: 'center',
        marginTop: 8,
        lineHeight: 22,
    },
    filaBotones: {
        flexDirection: 'row',
        marginTop: 22,
        gap: 12,
        width: '100%',
    },
    boton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    botonPrimario: {
        backgroundColor: 'red',
    },
    botonPeligro: {
        backgroundColor: '#D32F2F',
    },
    botonCancelar: {
        backgroundColor: '#F0F0F0',
    },
    textoBoton: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold',
    },
    textoBotonCancelar: {
        color: '#444',
    },
});

