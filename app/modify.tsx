// screens/HomeScreen.tsx
import { useFocusEffect, useRouter } from "expo-router";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "../firebaseConfig";

type Barang = {
  id: string;
  nama: string;
  harga: number;
};

export default function Modify() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  function confirmDelete(id: string) {
    Alert.alert(
      "Konfirmasi",
      "Apakah kamu yakin ingin menghapus barang ini?",
      [
        {
          text: "Batal",
          style: "cancel",
        },
        {
          text: "Hapus",
          style: "destructive",
          onPress: () => deleteData(id),
        },
      ],
      { cancelable: true }
    );
  }

  function handleEdit(id: string) {
    router.push(`/edit/${id}`);
  }

  async function deleteData(id: string) {
    try {
      await deleteDoc(doc(db, "Barang", id));
      // Refresh data setelah hapus
      const querySnapshot = await getDocs(collection(db, "Barang"));
      const data: Barang[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Barang[];
      setBarangList(data);
    } catch (error) {
      console.error("Gagal menghapus:", error);
    }
  }

  const fetchBarang = async () => {
    try {
      const q = query(collection(db, "Barang"), orderBy("nama"));
      const querySnapshot = await getDocs(q);
      const data: Barang[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Barang[];
      setBarangList(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBarang();
    }, [])
  );

  const filteredBarangList = barangList.filter((barang) =>
    barang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Datar Barang</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Cari barang..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />
      <FlatList
        data={filteredBarangList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.nama}</Text>
            <Text style={styles.itemPrice}>Rp {item.harga}</Text>
            <View style={styles.buttonCard}>
              <Button
                title="Edit"
                color="#A86523"
                onPress={() => handleEdit(item.id)}
              />
              <Button
                title="Delete"
                color="#C5172E"
                onPress={() => confirmDelete(item.id)}
              />
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  itemCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  itemName: { fontSize: 18 },
  itemPrice: { fontSize: 16, color: "gray" },
  buttonCard: { flex: 1, flexDirection: "row", gap: 10, marginTop: 5 },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
});

