import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useLayoutEffect, useMemo } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { MapInfo } from '../(types)/MapInfo';

export default function MapScreen() {
  const { lat, lng, address, title } = useLocalSearchParams<MapInfo>();
  const navigation = useNavigation();

  const coordinates = useMemo(() => {
    const parsedLat = parseFloat(lat as string);
    const parsedLng = parseFloat(lng as string);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      console.warn('Invalid latitude or longitude:', lat, lng);
      return null;
    }

    return {
      latitude: parsedLat,
      longitude: parsedLng,
    };
  }, [lat, lng]);

  useLayoutEffect(() => {
    if (title) {
      navigation.setOptions({ title });
    }
  }, [navigation, title]);

  if (!coordinates) {
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>Invalid coordinates</Text>
      </View>
    );
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css" />
      <style> html, body, #map { height: 100%; margin: 0; padding: 0; } </style>
    </head>
    <body>
      <div id="map"></div>
      <script src="https://unpkg.com/leaflet@1.9.3/dist/leaflet.js"></script>
      <script>
        var map = L.map('map').setView([${coordinates.latitude}, ${coordinates.longitude}], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19
        }).addTo(map);
        L.marker([${coordinates.latitude}, ${coordinates.longitude}])
          .addTo(map)
          .bindPopup("${title || 'Lokasi'}<br>${address || ''}")
          .openPopup();
      </script>
    </body>
    </html>
  `;

  return (
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={styles.map}
      startInLoadingState
      renderLoading={() => (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
