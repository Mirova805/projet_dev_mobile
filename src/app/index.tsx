import { useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Image, Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { getAllEnseignants, searchEnseignants, deleteEnseignant, Enseignant } from '../database/enseignant';

export default function ListScreen() {
  const router = useRouter();
  const [enseignants, setEnseignants] = useState<Enseignant[]>([]);
  const [searchText, setSearchText] = useState('');

  const loadData = async () => {
    const data = await getAllEnseignants();
    setEnseignants(data);
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    if (text.trim() === '') {
      await loadData();
    } else {
      const result = await searchEnseignants(text);
      setEnseignants(result);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleDelete = (id: number) => {
    Alert.alert(
      'Confirmation',
      'Voulez-vous vraiment supprimer cet enseignant ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            await deleteEnseignant(id);
            await loadData();
          }
        }
      ]
    );
  };

  const renderItem = ({ item }: { item: Enseignant }) => (
    <View style={styles.itemContainer}>
      <Image
        source={item.photo ? { uri: item.photo } : require('../../assets/default-avatar.png')}
        style={styles.avatar}
      />
      <View style={styles.info}>
        <Text style={styles.nom}>{item.nom}</Text>
        <Text style={styles.date}>{item.datenais}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => router.push(`/edit?id=${item.idens}`)}>
          <Text style={styles.editBtn}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.idens)}>
          <Text style={styles.deleteBtn}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchBar}
        placeholder="Rechercher par nom..."
        value={searchText}
        onChangeText={handleSearch}
      />
      <FlatList
        data={enseignants}
        keyExtractor={(item) => item.idens.toString()}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>Aucun enseignant</Text>}
      />
      <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/add')}>
        <Text style={styles.addBtnText}>+ Ajouter</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  searchBar: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  itemContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
  avatar: { width: 50, height: 50, borderRadius: 25, marginRight: 12 },
  info: { flex: 1 },
  nom: { fontSize: 16, fontWeight: 'bold' },
  date: { fontSize: 14, color: '#666' },
  actions: { flexDirection: 'row' },
  editBtn: { fontSize: 20, marginRight: 12 },
  deleteBtn: { fontSize: 20 },
  addBtn: {
    backgroundColor: '#2196F3',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  empty: { textAlign: 'center', marginTop: 20, color: '#888' },
});