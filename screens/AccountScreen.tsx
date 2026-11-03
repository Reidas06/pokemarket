import { StyleSheet, Text, View } from 'react-native';
import Icon from '@expo/vector-icons/Ionicons';

export default function AccountScreen() {
    return (
        <View style={styles.contenedor}>
            <View style={styles.cabecera}>
                <Text style={styles.titulo}>
                    Cuenta <Icon name="person-outline" size={24} color="white" />
                </Text>
            </View>

            <Text style={styles.texto}>
                Inicia sesión o crea una cuenta para acceder a todas las funciones de PokéMarket.
            </Text>
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
    texto: {
        fontSize: 16,
        color: 'black',
        textAlign: 'center',
    },
});