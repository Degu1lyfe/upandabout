import AsyncStorage from '@react-native-async-storage/async-storage';
import { Preferences, Interest } from '../logic/score';

const KEY = 'prefs_v1';

export async function savePreferences(p: Preferences) {
  await AsyncStorage.setItem(KEY, JSON.stringify(p));
}

export async function loadPreferences(): Promise<Preferences | null> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) as Preferences : null;
}

export const ALL_INTERESTS: Interest[] = ['live-music','food','arts','family','sports','outdoors','nightlife'];
