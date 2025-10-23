import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AddChild() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({
        name: "",
        surname: "",
        gender: "",
        age: "",
        allergies: "",
        notes: "",
        photoUrl: "",
    });

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const handleAddChild = async () => {
        // Validate required fields
        if (!form.name || !form.surname || !form.age) {
            Alert.alert('Error', 'Please fill in the required fields: Name, Surname, and Age');
            return;
        }

        const age = parseInt(form.age);
        if (isNaN(age) || age <= 0 || age > 18) {
            Alert.alert('Error', 'Please enter a valid age between 1 and 18');
            return;
        }

        setLoading(true);

        try {
            // Get parent ID from AsyncStorage
            const parentId = await AsyncStorage.getItem('userId');
            if (!parentId) {
                Alert.alert('Error', 'No parent session found. Please login again.');
                return;
            }

            const childData = {
                childName: form.name,
                childSurname: form.surname,
                childAge: age,
                parentId: parseInt(parentId)
            };

            const response = await fetch(`http://localhost:8080/api/child/create?parentId=${parentId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(childData),
            });

            if (response.ok) {
                const newChild = await response.json();
                Alert.alert(
                    'Success', 
                    'Child added successfully! You can now book sessions.',
                    [
                        {
                            text: 'Go to Sessions',
                            onPress: () => router.push('/Screens/Sessions')
                        }
                    ]
                );
            } else {
                const errorData = await response.text();
                Alert.alert('Error', 'Failed to add child. Please try again.');
            }
        } catch (error) {
            console.error('Error adding child:', error);
            Alert.alert('Error', 'Could not connect to server. Please try again.');
        } finally {
            setLoading(false);
        }
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
                    { key: "photoUrl", placeholder: "Photo URL (optional)" },
                    { key: "allergies", placeholder: "Allergies" },
                    { key: "notes", placeholder: "Additional Notes" },
                ].map((field, idx) => (
                    <TextInput
                        key={idx}
                        placeholder={field.placeholder + (field.key === 'name' || field.key === 'surname' || field.key === 'age' ? ' *' : '')}
                        value={form[field.key]}
                        onChangeText={(text) => handleChange(field.key, text)}
                        keyboardType={field.key === 'age' ? 'numeric' : 'default'}
                        style={styles.input}
                    />
                ))}

                <TouchableOpacity 
                    style={[styles.addButton, loading && styles.disabledButton]} 
                    onPress={handleAddChild}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#D81B60" />
                    ) : (
                        <Text style={styles.addButtonText}>ADD CHILD</Text>
                    )}
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
    disabledButton: {
        backgroundColor: "#e0e0e0",
        opacity: 0.6,
    },
    addButtonText: { color: "#D81B60", fontWeight: "bold", fontSize: 16 },
});
