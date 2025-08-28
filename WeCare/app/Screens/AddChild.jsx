import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function AddChild() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        age: "",
        allergies: "",
        notes: "",
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Panel */}
            <View style={styles.topPanel}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>ADD CHILD</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Form */}
            <ScrollView contentContainerStyle={{ padding: 20 }}>
                {[
                    { key: "name", placeholder: "First Name" },
                    { key: "surname", placeholder: "Surname" },
                    { key: "gender", placeholder: "Gender" },
                    { key: "age", placeholder: "Age" },
                    { key: "allergies", placeholder: "Allergies" },
                    { key: "notes", placeholder: "Additional Notes" },
                ].map((field, idx) => (
                    <TextInput
                        key={idx}
                        placeholder={field.placeholder}
                        value={form[field.key]}
                        onChangeText={(text) => handleChange(field.key, text)}
                        style={styles.input}
                    />
                ))}

                <TouchableOpacity style={styles.addButton} onPress={() => alert("Child added!")}>
                    <Text style={styles.addButtonText}>ADD</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.addButton, { backgroundColor: "#e0e0e0" }]} onPress={() => router.push("/Screens/MyChildren")}>
                    <Text style={[styles.addButtonText, { color: "#000" }]}>CANCEL</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    topPanel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    headerText: { fontSize: 20, fontWeight: "bold", color: "#D81B60" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        marginBottom: 15,
    },
    addButton: {
        backgroundColor: "#f3d4e6",
        marginVertical: 10,
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: "center",
    },
    addButtonText: { color: "#D81B60", fontWeight: "bold", fontSize: 16 },
});
