
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Text style={styles.logo}>POKÉMARKET</Text>
        <Text style={styles.subtitle}>Tu colección, a otro nivel</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>Cartas Pokémon</Text>

        <Text style={styles.description}>
          Descubre cartas, explora expansiones y encuentra tu próxima favorita.
        </Text>

        <View style={styles.catalog}>
          <Text style={styles.catalogTitle}>
            Próximamente en el catálogo
          </Text>

          <Text style={styles.catalogDescription}>
            Aquí encontrarás las cartas disponibles y podrás consultar sus
            detalles.
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    backgroundColor: '#ec3535ff',
    paddingTop: 64,
    paddingHorizontal: 24,
    paddingBottom: 28,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  logo: {
    color: 'white',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  subtitle: {
    color: 'black',
    fontSize: 15,
    marginTop: 6,
  },
  content: {
    padding: 24,
  },
  title: {
    color: 'black',
    fontSize: 24,
    fontWeight: '800',
  },
  description: {
    color: 'black',
    fontSize: 15,
    lineHeight: 22,
    marginTop: 8,
  },
  catalog: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#c13131ff',
  },
  catalogTitle: {
    color: '#c13131ff',
    fontSize: 17,
    fontWeight: '700',
  },
  catalogDescription: {
    color: 'black',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
});
