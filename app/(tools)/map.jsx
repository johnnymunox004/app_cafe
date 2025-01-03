import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, ScrollView } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

// Datos de ejemplo de cafeterías
const coffeeShops = [
  {
    id: 1,
    name: "Café Especial",
    coordinate: {
      latitude: 19.4326,
      longitude: -99.1332,
    },
    rating: 4.5,
    specialty: "Café de especialidad",
  },
  {
    id: 2,
    name: "Coffee Lab",
    coordinate: {
      latitude: 19.4200,
      longitude: -99.1679,
    },
    rating: 4.8,
    specialty: "Métodos de preparación",
  },
];

export default function CoffeeShopMap() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 19.4326,
          longitude: -99.1332,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Tu ubicación"
            pinColor="blue"
          />
        )}
        
        {coffeeShops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={shop.coordinate}
            title={shop.name}
          >
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{shop.name}</Text>
                <Text style={styles.calloutText}>Rating: {shop.rating}</Text>
                <Text style={styles.calloutText}>{shop.specialty}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  callout: {
    padding: 10,
    width: 150,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 12,
    color: '#666',
  },
}); 