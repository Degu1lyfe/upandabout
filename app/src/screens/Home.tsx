import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Linking, Button, Alert } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadPreferences } from '../storage/preferences';
import { fetchEvents } from '../services/api';
import { EventItem } from '../logic/score';
import { rankEvents } from '../logic/score';
import fallback from '../data/fallbackEvents.json';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

function EventCard({ item }: { item: EventItem }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.meta}>
        {new Date(item.startsAt).toLocaleString()} • {item.venue.name} • {'$'.repeat(item.priceTier)}
      </Text>
      <Text style={styles.tags}>{item.tags.join(' • ')}</Text>
      <View style={{ height: 8 }} />
      <Button title="Open tickets/maps" onPress={() => Linking.openURL(item.url)} />
    </View>
  );
}

export default function Home({ navigation }: Props) {
  const [items, setItems] = useState<EventItem[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [seeMore, setSeeMore] = useState(false);

  const load = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const prefs = await loadPreferences();
      if (!prefs) { navigation.replace('Onboarding'); return; }
      const list = await fetchEvents({
        city: prefs.city || 'Tampa, FL',
        lat: prefs.lat, lon: prefs.lon,
        interests: prefs.interests, limit: 10
      }).catch(()=> fallback.items as EventItem[]);

      const ranked = rankEvents(list, {
        interests: prefs.interests,
        maxPriceTier: prefs.maxPriceTier,
        familyMode: prefs.familyMode,
        lat: prefs.lat, lon: prefs.lon, city: prefs.city
      });

      setItems(ranked);
    } catch (e:any) {
      setError(e.message);
      setItems((fallback as any).items);
    } finally {
      setRefreshing(false);
    }
  }, [navigation]);

  useEffect(() => { load(); }, [load]);

  const top = seeMore ? items.slice(0, 10) : items.slice(0, 3);

  return (
    <View style={styles.container}>
      <Text style={styles.h1}>Top Picks</Text>
      {error && <Text style={styles.error}>Offline or error fetching events — showing a safe demo list.</Text>}
      {top.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ textAlign: 'center' }}>No events found. Try different interests or refresh.</Text>
          <View style={{ height: 8 }} />
          <Button title="Refresh" onPress={load} />
        </View>
      ) : (
        <FlatList
          data={top}
          keyExtractor={(it)=>it.id}
          renderItem={({ item }) => <EventCard item={item} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={load} />}
          ListFooterComponent={
            <View style={{ padding: 8 }}>
              <Button title={seeMore ? 'Show 3' : 'See more'} onPress={()=>setSeeMore(v=>!v)} />
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  h1: { fontSize: 24, fontWeight: '800', marginBottom: 8 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 12, padding: 16, marginVertical: 8, backgroundColor: 'white' },
  title: { fontSize: 18, fontWeight: '700' },
  meta: { marginTop: 4, color: '#333' },
  tags: { marginTop: 4, color: '#666' },
  error: { color: '#b71c1c', marginBottom: 8 },
  empty: { alignItems: 'center', justifyContent: 'center', padding: 24 }
});
