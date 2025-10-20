import React, { useState } from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
} from "react-native";

export default function DriverRegistration() {
    const [form, setForm] = useState({
        firstName: "",
        lastName: "",
        phone1: "",
        phone2: "",
        houseNumber: "",
        streetName: "",
        postalCode: "",
    });

    const handleRegister = () => {
        console.log("Registering user:", form);
    };

    const handleCancel = () => {
        setForm({
            firstName: "",
            lastName: "",
            phone1: "",
            phone2: "",
            houseNumber: "",
            streetName: "",
            postalCode: "",
        });
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                {/* Driver Registration Heading */}
                <Text style={styles.heading}>Driver Registration</Text>

                {/* Inputs */}
                <TextInput
                    style={styles.input}
                    placeholder="First Name"
                    placeholderTextColor="#a97f9c"
                    value={form.firstName}
                    onChangeText={(text) => setForm({ ...form, firstName: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Last Name"
                    placeholderTextColor="#a97f9c"
                    value={form.lastName}
                    onChangeText={(text) => setForm({ ...form, lastName: text })}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Phone Num 1"
                    placeholderTextColor="#a97f9c"
                    keyboardType="phone-pad"
                    value={form.phone1}
                    onChangeText={(text) => setForm({ ...form, phone1: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Phone Num 2"
                    placeholderTextColor="#a97f9c"
                    keyboardType="phone-pad"
                    value={form.phone2}
                    onChangeText={(text) => setForm({ ...form, phone2: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="House Number"
                    placeholderTextColor="#a97f9c"
                    value={form.houseNumber}
                    onChangeText={(text) => setForm({ ...form, houseNumber: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Street Name"
                    placeholderTextColor="#a97f9c"
                    value={form.streetName}
                    onChangeText={(text) => setForm({ ...form, streetName: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Postal Code"
                    placeholderTextColor="#a97f9c"
                    keyboardType="numeric"
                    value={form.postalCode}
                    onChangeText={(text) => setForm({ ...form, postalCode: text })}
                />

                {/* Buttons */}
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.button} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>Register</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#d8d0d3",
    },
    container: {
        padding: 24,
    },
    heading: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 20,
        color: "#fff",
        textAlign: "center",
    },
    input: {
        borderRadius: 25,
        padding: 14,
        marginBottom: 16,
        backgroundColor: "#fff",
        fontSize: 15,
        fontWeight: "500",
        color: "#222",
    },
    buttonRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 30,
    },
    button: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 30,
        alignItems: "center",
        marginHorizontal: 5,
        backgroundColor: "#fff",
    },
    buttonText: {
        color: "#222",
        fontSize: 16,
        fontWeight: "600",
    },
});
