import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { User } from '../(types)/User';


export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then(setUsers)
      .catch((err) => console.error('Failed to fetch users:', err))
      .finally(() => setLoading(false));
  }, []);

  const renderItem = ({ item }: { item: User }) => (
    <Link
      href={{
        pathname: '/(pages)/map',
        params: {
          lat: item.address.geo.lat,
          lng: item.address.geo.lng,
          address: `${item.address.street}, ${item.address.city}`,
          title: item.name
        },
      }}
      asChild
    >
      <Pressable
        android_ripple={{ color: "#ccc" }}
        style={styles.card}
      >
        <Image source={{ uri: 'https://ui-avatars.com/api/?name=' + item.username }} style={styles.img} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: "bold", fontSize: 20, opacity: 0.9 }}>{item.username}</Text>
          <Text style={{opacity: 0.7}}><MaterialIcons name="lock"/> ID: {item.id}</Text>
          <Text style={{opacity: 0.7}}><MaterialIcons name="person"/> {item.name}</Text>
          <Text style={{opacity: 0.7}}><MaterialIcons name="mail"/> {item.email}
          </Text>
          <Text style={{opacity: 0.7}}><MaterialIcons name="location-pin"/> {item.address.street}, {item.address.city}
          </Text>
        </View>
      </Pressable>
    </Link>
  );

  if (loading) return <Text style={{ textAlign: 'center', marginTop: 40 }}>Loading...</Text>;

  return <FlatList data={users} keyExtractor={(u) => u.id.toString()} renderItem={renderItem} />;
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    padding: 12,
    gap: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  img: {
    width: 80,
    height: 80,
    backgroundColor: '#eee',
  },
  link: {
    color: 'blue',
    marginTop: 5,
    textDecorationLine: 'underline',
  },
});
