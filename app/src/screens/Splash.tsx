import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';
import { loadPreferences } from '../storage/preferences';

type Props = NativeStackScreenProps<RootStackParamList, 'Splash'>;

export default function Splash({ navigation }: Props) {
  useEffect(() => {
    (async () => {
      const prefs = await loadPreferences();
      setTimeout(() => {
        if (!prefs) navigation.replace('Onboarding');
        else navigation.replace('Home');
      }, 500);
    })();
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Up & About</Text>
      <ActivityIndicator size="large" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 8 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 8 }
});
