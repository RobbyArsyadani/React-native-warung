// app/edit/[id].tsx
import { useLocalSearchParams, useRouter } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../../firebaseConfig";

export default function EditBarang() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  useEffect(() => {
    const fetchBarang = async () => {
      try {
        const docRef = doc(db, "Barang", id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setNama(data.nama);
          setHarga(data.harga.toString());
        } else {
          Alert.alert("Data tidak ditemukan");
          router.back();
        }
      } catch (error) {
        console.error("Error:", error);
        Alert.alert("Terjadi kesalahan");
      }
    };

    fetchBarang();
  }, [id, router]);

  const handleUpdate = async () => {
    try {
      await updateDoc(doc(db, "Barang", id as string), {
        nama,
        harga: parseInt(harga),
      });
      Alert.alert("Data berhasil diperbarui");
      router.push("/"); // kembali ke home
    } catch (error) {
      console.error("Error updating document:", error);
      Alert.alert("Gagal memperbarui data");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Barang</Text>
      <TextInput
        style={styles.input}
        placeholder="Nama Barang"
        value={nama}
        onChangeText={setNama}
      />
      <TextInput
        style={styles.input}
        placeholder="Harga"
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
      />
      <Button title="Simpan Perubahan" onPress={handleUpdate} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
});

