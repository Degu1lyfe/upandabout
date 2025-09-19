import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as Location from 'expo-location';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { ALL_INTERESTS, savePreferences } from '../storage/preferences';
import type { Interest } from '../logic/score';

type Props = NativeStackScreenProps<RootStackParamList, 'Onboarding'>;

export default function Onboarding({ navigation }: Props) {
  const [city, setCity] = useState('');
  const [coords, setCoords] = useState<{lat?:number; lon?:number}>({});
  const [interests, setInterests] = useState<Interest[]>(['live-music','food']);
  const [maxPriceTier, setMaxPriceTier] = useState<1|2|3>(2);
  const [familyMode, setFamilyMode] = useState<boolean>(false);

  async function useGPS() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'You can still type a city manually.');
      return;
    }
    const loc = await Location.getCurrentPositionAsync({});
    setCoords({ lat: loc.coords.latitude, lon: loc.coords.longitude });
  }

  function toggleInterest(i: Interest) {
    setInterests(prev => prev.includes(i) ? prev.filter(x=>x!==i) : [...prev, i]);
  }

  async function onContinue() {
    if (!city && (!coords.lat || !coords.lon)) {
      Alert.alert('Missing location', 'Enter a city or allow GPS.');
      return;
    }
    await savePreferences({
      city, lat: coords.lat, lon: coords.lon,
      interests, maxPriceTier, familyMode
    });
    navigation.replace('Home');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.h1}>Let’s personalize your picks</Text>

      <Text style={styles.label}>City (or use GPS)</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput placeholder="Tampa, FL" value={city} onChangeText={setCity} style={styles.input} />
        <Button title="Use GPS" onPress={useGPS} />
      </View>
      {coords.lat && <Text>✓ Using GPS: {coords.lat?.toFixed(3)}, {coords.lon?.toFixed(3)}</Text>}

      <Text style={styles.label}>Interests</Text>
      <View style={styles.chips}>
        {ALL_INTERESTS.map(i => (
          <TouchableOpacity key={i} onPress={()=>toggleInterest(i)} style={[styles.chip, interests.includes(i) && styles.chipActive]}>
            <Text style={[styles.chipText, interests.includes(i) && styles.chipTextActive]}>{i}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Max price tier</Text>
      <View style={styles.chips}>
        {[1,2,3].map(tier => (
          <TouchableOpacity key={tier} onPress={()=>setMaxPriceTier(tier as 1|2|3)} style={[styles.chip, maxPriceTier===tier && styles.chipActive]}>
            <Text style={[styles.chipText, maxPriceTier===tier && styles.chipTextActive]}>{'$'.repeat(tier)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity onPress={()=>setFamilyMode(v=>!v)} style={[styles.toggle, familyMode && styles.toggleOn]}>
        <Text style={{ fontWeight: '600' }}>{familyMode ? '✓ Family mode ON' : 'Family mode OFF'}</Text>
      </TouchableOpacity>

      <View style={{ height: 12 }} />
      <Button title="Continue" onPress={onContinue} />
      <View style={{ height: 24 }} />
      <Text style={styles.smallPrint}>
        We only use your location to rank events nearby and never resell your data.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 12 },
  h1: { fontSize: 24, fontWeight: '800' },
  label: { marginTop: 12, fontWeight: '700' },
  input: { borderWidth: 1, borderColor: '#ccc', flex: 1, padding: 10, borderRadius: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 8 },
  chip: { borderWidth: 1, borderColor: '#ddd', paddingVertical: 6, paddingHorizontal: 10, borderRadius: 999 },
  chipActive: { backgroundColor: '#111', borderColor: '#111' },
  chipText: { color: '#111' },
  chipTextActive: { color: 'white' },
  toggle: { marginTop: 8, padding: 12, borderRadius: 10, borderWidth: 1, borderColor: '#ddd', alignItems: 'center' },
  toggleOn: { backgroundColor: '#e8f5e9', borderColor: '#2e7d32' },
  smallPrint: { color: '#666', fontSize: 12 }
});
