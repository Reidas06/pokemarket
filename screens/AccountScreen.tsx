import { StyleSheet, Text, View, TextInput, Pressable } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

export default function AccountScreen() {
    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>
                    Cuenta <Icon name="person-outline" size={24} color="white" />
                </Text>
            </View>

            <View style={styles.contenido}>
                <View style={styles.formulario}>

                    {/* Selector entre inicio de sesión y registro */}
                    <View style={styles.selector}>
                        <Pressable style={styles.opcionActiva}>
                            <Text style={styles.textoActivo}>
                                Iniciar sesión
                            </Text>
                        </Pressable>

                        <Pressable style={styles.opcionInactiva}>
                            <Text style={styles.textoInactivo}>
                                Registrarse
                            </Text>
                        </Pressable>
                    </View>

                    {/* Campos del inicio de sesión */}
                    <Text style={styles.etiqueta}>
                        Nombre de usuario o correo electrónico
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Introduce tu usuario o correo"
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={styles.etiqueta}>
                        Contraseña
                    </Text>

                    <TextInput
                        style={styles.input}
                        placeholder="Introduce tu contraseña"
                        secureTextEntry
                    />
                </View>
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
    titulo: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
    },
    contenido: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    formulario: {
        width: '100%',
        maxWidth: 340,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 16,
        padding: 16,
        backgroundColor: 'white',
    },
    selector: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 24,
    },
    opcionActiva: {
        flex: 1,
        backgroundColor: 'red',
        paddingVertical: 12,
        alignItems: 'center',
    },
    opcionInactiva: {
        flex: 1,
        backgroundColor: 'white',
        paddingVertical: 12,
        alignItems: 'center',
    },
    textoActivo: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15,
    },
    textoInactivo: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 15,
    },
    etiqueta: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
        backgroundColor: 'white',
    },
});