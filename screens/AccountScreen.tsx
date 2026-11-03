import { StyleSheet, Text, View, TextInput, Pressable, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import Icon from '@expo/vector-icons/Ionicons';

export default function AccountScreen() {

    // Inicio de sesión    
    const [modoRegistro, setModoRegistro] = useState(false);

    // Checkboxes 
    const [aceptaCondiciones, setAceptaCondiciones] = useState(false);
    const [aceptaComunicaciones, setAceptaComunicaciones] = useState(false);

    // Datos del formulario de registro
    const [nombre, setNombre] = useState('');
    const [apellidos, setApellidos] = useState('');
    const [usuario, setUsuario] = useState('');
    const [correo, setCorreo] = useState('');
    const [contrasena, setContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');

    // Errores de validación del formulario
    const [errores, setErrores] = useState({
        nombre: '',
        apellidos: '',
        usuario: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        condiciones: '',
    });

    const mostrarError = (mensaje: string) => {
        if (!mensaje) return null;

        return (
            <Text style={styles.textoError}>
                {mensaje}
            </Text>
        );
    };

    const validarRegistro = () => {
        const nuevosErrores = {
            nombre: '',
            apellidos: '',
            usuario: '',
            correo: '',
            contrasena: '',
            confirmarContrasena: '',
            condiciones: '',
        };

        // Comprobar campos obligatorios
        if (!nombre.trim()) {
            nuevosErrores.nombre = 'Introduce tu nombre.';
        }

        if (!apellidos.trim()) {
            nuevosErrores.apellidos = 'Introduce tus apellidos.';
        }

        if (!usuario.trim()) {
            nuevosErrores.usuario = 'Introduce un nombre de usuario.';
        }

        // Comprobar formato del correo
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!correo.trim()) {
            nuevosErrores.correo = 'Introduce tu correo electrónico.';
        } else if (!formatoCorreo.test(correo.trim())) {
            nuevosErrores.correo = 'Introduce un correo electrónico válido.';
        }

        // Comprobar contraseña
        if (!contrasena) {
            nuevosErrores.contrasena = 'Introduce una contraseña.';
        } else if (contrasena.length < 8) {
            nuevosErrores.contrasena = 'Debe tener al menos 8 caracteres.';
        }

        // Comprobar confirmación
        if (!confirmarContrasena) {
            nuevosErrores.confirmarContrasena = 'Confirma tu contraseña.';
        } else if (contrasena !== confirmarContrasena) {
            nuevosErrores.confirmarContrasena = 'Las contraseñas no coinciden.';
        }

        // Comprobar aceptación de condiciones
        if (!aceptaCondiciones) {
            nuevosErrores.condiciones = 'Debes aceptar los términos y la política de privacidad.';
        }

        setErrores(nuevosErrores);

        // Comprobar si existe algún error
        const hayErrores = Object.values(nuevosErrores).some(
            mensaje => mensaje !== ''
        );

        if (hayErrores) {
            return;
        }

        Alert.alert(
            'Registro',
            '¡Todos los datos son correctos! El registro está preparado.'
        );
    };

    const limpiarErrores = () => {
        setErrores({
            nombre: '',
            apellidos: '',
            usuario: '',
            correo: '',
            contrasena: '',
            confirmarContrasena: '',
            condiciones: '',
        });
    };

    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>
                    Cuenta <Icon name="person-outline" size={24} color="white" />
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.contenido} showsVerticalScrollIndicator={false}>
                <View style={styles.formulario}>

                    {/* Selector entre inicio de sesión y registro */}
                    <View style={styles.selector}>
                        <Pressable
                            style={modoRegistro ? styles.opcionInactiva : styles.opcionActiva}
                            onPress={() => {
                                limpiarErrores();
                                setModoRegistro(false);
                            }}
                        >
                            <Text style={modoRegistro ? styles.textoInactivo : styles.textoActivo}>
                                Iniciar sesión
                            </Text>
                        </Pressable>

                        <Pressable
                            style={modoRegistro ? styles.opcionActiva : styles.opcionInactiva}
                            onPress={() => {
                                limpiarErrores();
                                setModoRegistro(true);
                            }}
                        >
                            <Text style={modoRegistro ? styles.textoActivo : styles.textoInactivo}>
                                Registrarse
                            </Text>
                        </Pressable>
                    </View>

                    {/* Campos del inicio de sesión */}
                    {modoRegistro ? (
                        <>
                            {/* Campos del registro */}
                            <Text style={styles.etiqueta}>Nombre</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu nombre"
                                value={nombre}
                                onChangeText={setNombre}
                            />
                            {mostrarError(errores.nombre)}

                            <Text style={styles.etiqueta}>Apellidos</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tus apellidos"
                                value={apellidos}
                                onChangeText={setApellidos}
                            />
                            {mostrarError(errores.apellidos)}

                            <Text style={styles.etiqueta}>Nombre de usuario</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Elige un nombre de usuario"
                                autoCapitalize="none"
                                value={usuario}
                                onChangeText={setUsuario}
                            />
                            {mostrarError(errores.usuario)}

                            <Text style={styles.etiqueta}>Correo electrónico</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu correo electrónico"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={correo}
                                onChangeText={setCorreo}
                            />
                            {mostrarError(errores.correo)}

                            <Text style={styles.etiqueta}>Contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Crea una contraseña"
                                secureTextEntry
                                value={contrasena}
                                onChangeText={setContrasena}
                            />
                            {mostrarError(errores.contrasena)}

                            <Text style={styles.etiqueta}>Confirmar contraseña</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Repite tu contraseña"
                                secureTextEntry
                                value={confirmarContrasena}
                                onChangeText={setConfirmarContrasena}
                            />
                            {mostrarError(errores.confirmarContrasena)}

                            <Text style={styles.etiqueta}>Teléfono (opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu teléfono"
                                keyboardType="phone-pad"
                            />

                            <Text style={styles.etiqueta}>Nacionalidad (opcional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu nacionalidad"
                            />

                            <Text style={styles.etiqueta}>Dirección</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Calle y número"
                            />

                            <Text style={styles.etiqueta}>Código postal</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu código postal"
                                keyboardType="numeric"
                            />

                            <Text style={styles.etiqueta}>Ciudad</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu ciudad"
                            />

                            <Text style={styles.etiqueta}>País</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu país"
                            />

                            {/* Aceptación de condiciones obligatoria */}
                            <Pressable
                                style={styles.filaCasilla}
                                onPress={() => setAceptaCondiciones(!aceptaCondiciones)}
                            >
                                <View style={styles.casilla}>
                                    {aceptaCondiciones && <Text style={styles.marcaCasilla}>✓</Text>}
                                </View>
                                <Text style={styles.textoCasilla}>
                                    He leído y acepto los Términos y Condiciones y la Política de Privacidad.
                                </Text>
                            </Pressable>

                            {/* Comunicaciones comerciales opcionales */}
                            <Pressable
                                style={styles.filaCasilla}
                                onPress={() => setAceptaComunicaciones(!aceptaComunicaciones)}
                            >
                                <View style={styles.casilla}>
                                    {aceptaComunicaciones && <Text style={styles.marcaCasilla}>✓</Text>}
                                </View>
                                <Text style={styles.textoCasilla}>
                                    Deseo recibir novedades y comunicaciones comerciales.
                                </Text>
                            </Pressable>

                            <Pressable
                                style={styles.boton}
                                onPress={validarRegistro}
                            >
                                <Text style={styles.textoBoton}>Crear cuenta</Text>
                            </Pressable>
                        </>
                    ) : (
                        <>
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

                            <Text style={styles.etiqueta}>Contraseña</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Introduce tu contraseña"
                                secureTextEntry
                            />

                            <Pressable style={styles.boton}>
                                <Text style={styles.textoBoton}>Iniciar sesión</Text>
                            </Pressable>
                        </>
                    )}
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
        flexGrow: 1,
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
        borderRadius: 40,
        padding: 16,
        backgroundColor: 'white',
    },
    selector: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 24,
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
        borderRadius: 24,
        padding: 12,
        marginBottom: 16,
        color: 'black',
    },
    boton: {
        backgroundColor: 'red',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 24,
        marginTop: 4,
    },
    textoBoton: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    filaCasilla: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 16,
        gap: 10,
    },
    casilla: {
        width: 22,
        height: 22,
        borderWidth: 1,
        borderColor: 'red',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    marcaCasilla: {
        color: 'red',
        fontWeight: 'bold',
    },
    textoCasilla: {
        flex: 1,
        color: 'black',
        fontSize: 14,
    },
    textoError: {
        color: 'red',
        fontSize: 13,
        marginTop: -12,
        marginBottom: 14,
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
});