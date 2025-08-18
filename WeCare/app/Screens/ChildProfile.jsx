import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";

const childData = {
    "1": {
        name: "Buhle Zungu",
        age: 3,
        gender: "Female",
        allergies: "Peanuts",
        notes: "Loves painting and outdoor play.",
        image: require("../../assets/buhle.jpg"),
    },
    "2": {
        name: "Mbali Zungu",
        age: 3,
        gender: "Female",
        allergies: "None",
        notes: "Enjoys storytime and music.",
        image: require("../../assets/mbali.jpg"),
    },
};

export default function ChildProfile() {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const child = childData[id] || {};

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Panel */}
            <View style={styles.topPanel}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>CHILD PROFILE</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Profile */}
            <View style={styles.profileContainer}>
                <Image source={child.image} style={styles.childImage} />
                <Text style={styles.name}>{child.name}</Text>
                <Text style={styles.detail}>Age: {child.age}</Text>
                <Text style={styles.detail}>Gender: {child.gender}</Text>
                <Text style={styles.detail}>Allergies: {child.allergies}</Text>
                <Text style={styles.notes}>Notes: {child.notes}</Text>
            </View>

            {/* Buttons */}
            <TouchableOpacity style={styles.button} onPress={() => alert("Edit functionality coming soon")}>
                <Text style={styles.buttonText}>EDIT INFO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, { backgroundColor: "#e0e0e0" }]} onPress={() => router.push("/Screens/MyChildren")}>
                <Text style={[styles.buttonText, { color: "#000" }]}>BACK TO LIST</Text>
            </TouchableOpacity>
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
    profileContainer: { alignItems: "center", padding: 20 },
    childImage: { width: 120, height: 120, borderRadius: 60, marginBottom: 15 },
    name: { fontSize: 22, fontWeight: "bold", color: "#D81B60" },
    detail: { fontSize: 16, color: "#555", marginTop: 5 },
    notes: { fontSize: 14, color: "#777", marginTop: 10, textAlign: "center" },
    button: {
        backgroundColor: "#f3d4e6",
        marginHorizontal: 20,
        marginTop: 15,
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: "center",
    },
    buttonText: { color: "#D81B60", fontWeight: "bold", fontSize: 16 },
});
