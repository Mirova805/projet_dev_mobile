import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { getEnseignantById, updateEnseignant } from '../database/enseignant';

export default function EditScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>(); // Les params sont toujours des strings
  const [idens, setIdens] = useState<number | null>(null);
  const [nom, setNom] = useState('');
  const [datenais, setDatenais] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      const parsedId = parseInt(id, 10);
      getEnseignantById(parsedId).then((enseignant) => {
        if (enseignant) {
          setIdens(enseignant.idens);
          setNom(enseignant.nom);
          setDatenais(enseignant.datenais);
          setPhoto(enseignant.photo);
        }
      });
    }
  }, [id]);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission refusée', 'Autorisez l’accès à la galerie.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const handleUpdate = async () => {
    if (!nom.trim() || !datenais.trim() || idens === null) {
      Alert.alert('Erreur', 'Le nom et la date de naissance sont obligatoires.');
      return;
    }
    try {
      await updateEnseignant(idens, nom, datenais, photo);
      router.back();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de mettre à jour.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Text style={styles.placeholder}>Choisir une photo</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        placeholder="Nom complet"
        value={nom}
        onChangeText={setNom}
      />
      <TextInput
        style={styles.input}
        placeholder="Date de naissance (ex: 1990-05-15)"
        value={datenais}
        onChangeText={setDatenais}
      />
      <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
        <Text style={styles.saveBtnText}>Mettre à jour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  imagePicker: {
    alignSelf: 'center',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  photo: { width: 120, height: 120, borderRadius: 60 },
  placeholder: { color: '#888' },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: '#4CAF50',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});