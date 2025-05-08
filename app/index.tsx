import { useFocusEffect, useRouter } from "expo-router";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import {
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

export default function HomeScreen() {
  const [barangList, setBarangList] = useState<Barang[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

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

  // Filter berdasarkan keyword
  const filteredBarangList = barangList.filter((barang) =>
    barang.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Daftar Barang</Text>

      {/* Tombol Navigasi */}
      <View style={styles.navContainer}>
        <Button title="Tambah Data" onPress={() => router.push("/add")} />
        <Button title="Modify Data" onPress={() => router.push("/modify")} />
      </View>

      {/* Search Input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Cari barang..."
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* List Barang */}
      <FlatList
        data={filteredBarangList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <Text style={styles.itemName}>{item.nama}</Text>
            <Text style={styles.itemPrice}>Rp {item.harga}</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
    marginBottom: 10,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  itemCard: {
    padding: 12,
    marginBottom: 10,
    borderRadius: 8,
    backgroundColor: "#f3f3f3",
  },
  itemName: {
    fontSize: 18,
  },
  itemPrice: {
    fontSize: 16,
    color: "gray",
  },
  listContent: {
    paddingBottom: 20,
  },
});

