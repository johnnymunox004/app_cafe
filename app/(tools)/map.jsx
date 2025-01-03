import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GlobalStyles, COLORS, SIZES, SHADOWS } from '../../utils/styles';

const { width } = Dimensions.get('window');

// Datos de ejemplo de cafeterías
const coffeeShops = [
  {
    id: 1,
    name: "Café Especial",
    coordinate: {
      latitude: -12.0464,
      longitude: -77.0428,
    },
    rating: 4.5,
    specialty: "Café de especialidad",
  },
  {
    id: 2,
    name: "Coffee Lab",
    coordinate: {
      latitude: -12.0464,
      longitude: -77.0328,
    },
    rating: 4.8,
    specialty: "Métodos de preparación",
  },
];

export default function CoffeeShopMap() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [region, setRegion] = useState({
    latitude: -12.0464,
    longitude: -77.0428,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Se requiere permiso para acceder a la ubicación');
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        setLocation(location.coords);
        setRegion({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      } catch (error) {
        setErrorMsg('Error al obtener la ubicación');
        console.error(error);
      }
    })();
  }, []);

  const centerOnUser = () => {
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  };

  return (
    <View style={GlobalStyles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}
        showsUserLocation={true}
        showsMyLocationButton={false}
      >
        {coffeeShops.map((shop) => (
          <Marker
            key={shop.id}
            coordinate={shop.coordinate}
            title={shop.name}
          >
            <View style={styles.markerContainer}>
              <Ionicons name="cafe" size={24} color={COLORS.accent} />
            </View>
            <Callout>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{shop.name}</Text>
                <Text style={styles.calloutText}>Rating: {shop.rating}⭐</Text>
                <Text style={styles.calloutText}>{shop.specialty}</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      {/* Botón para centrar en la ubicación del usuario */}
      <TouchableOpacity 
        style={styles.centerButton}
        onPress={centerOnUser}
      >
        <LinearGradient
          colors={[COLORS.accent, COLORS.secondary]}
          style={styles.centerButtonGradient}
        >
          <Ionicons name="location" size={24} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>

      {/* Mensaje de error */}
      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: '100%',
    height: '100%',
  },
  markerContainer: {
    backgroundColor: COLORS.white,
    padding: SIZES.base,
    borderRadius: SIZES.radius,
    ...SHADOWS.medium,
  },
  callout: {
    width: width * 0.6,
    padding: SIZES.base,
  },
  calloutTitle: {
    fontSize: SIZES.medium,
    fontWeight: 'bold',
    color: COLORS.text.primary,
    marginBottom: SIZES.base / 2,
  },
  calloutText: {
    fontSize: SIZES.small,
    color: COLORS.text.secondary,
  },
  centerButton: {
    position: 'absolute',
    bottom: SIZES.padding * 2,
    right: SIZES.padding,
    ...SHADOWS.medium,
  },
  centerButtonGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    position: 'absolute',
    top: SIZES.padding,
    left: SIZES.padding,
    right: SIZES.padding,
    backgroundColor: COLORS.error,
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    ...SHADOWS.light,
  },
  errorText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: SIZES.font,
  },
}); 