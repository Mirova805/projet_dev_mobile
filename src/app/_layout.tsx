import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { initDB } from '../database/db';

export default function Layout() {
  useEffect(() => {
    initDB().catch(console.error);
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Enseignants' }} />
      <Stack.Screen name="add" options={{ title: 'Ajouter un enseignant' }} />
      <Stack.Screen name="edit" options={{ title: 'Modifier un enseignant' }} />
    </Stack>
  );
}