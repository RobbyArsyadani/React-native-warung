// screens/AddBarangScreen.tsx
import { addDoc, collection } from "firebase/firestore";
import React, { useState } from "react";
import { Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";
import { db } from "../firebaseConfig";

export default function AddBarangScreen({ navigation }: any) {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");

  const handleAdd = async () => {
    if (!nama || !harga) {
      Alert.alert("Validasi", "Nama dan harga harus diisi");
      return;
    }

    try {
      const hargaNumber = parseInt(harga);
      await addDoc(collection(db, "Barang"), {
        nama,
        harga: hargaNumber,
      });
      Alert.alert("Sukses", "Barang berhasil ditambahkan");
      setNama("");
      setHarga("");
      //   navigation.goBack(); // Kembali ke halaman sebelumnya
    } catch (error) {
      console.error("Gagal menambahkan barang:", error);
      Alert.alert("Error", "Gagal menambahkan barang");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nama Barang:</Text>
      <TextInput
        style={styles.input}
        value={nama}
        onChangeText={setNama}
        placeholder="Contoh: Indomie"
      />
      <Text style={styles.label}>Harga:</Text>
      <TextInput
        style={styles.input}
        value={harga}
        onChangeText={setHarga}
        keyboardType="numeric"
        placeholder="Contoh: 3000"
      />
      <Button title="Tambah Barang" onPress={handleAdd} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
});

