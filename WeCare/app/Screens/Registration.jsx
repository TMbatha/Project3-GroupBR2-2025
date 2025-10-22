import React, { useState } from "react";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

const API_BASE_URL = "http://localhost:8080/api";

export default function Registration() {
  const router = useRouter();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone1: "",
    phone2: "",
    houseNumber: "",
    streetName: "",
    postalCode: "",
    role: "parent", // parent, nanny, driver
  });

  const handleRegister = async () => {
    try {
      // Basic validation
      if (!form.firstName || !form.lastName) {
        Alert.alert("Validation", "Please enter first and last name.");
        return;
      }

      const payload = { ...form };

      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log("Registration result:", result);

      if (response.ok && result.success) {
        console.log("Registration successful, preparing to redirect...");
        
        // Clear form
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          phone1: "",
          phone2: "",
          houseNumber: "",
          streetName: "",
          postalCode: "",
          role: "parent",
        });
        
        // Show success message and navigate
        Alert.alert(
          "Success", 
          "Registration complete! Please login with your credentials."
        );
        
        // Navigate after showing alert (give a small delay for alert to show)
        setTimeout(() => {
          console.log("Navigating to login page...");
          router.push("/");
        }, 500);
        
      } else {
        Alert.alert("Error", result.message || "Registration failed.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert("Error", "Could not connect to server. Please try again.");
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.heading}>Register</Text>

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
          placeholder="Email"
          placeholderTextColor="#a97f9c"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
          onChangeText={(text) => setForm({ ...form, email: text })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#a97f9c"
          secureTextEntry
          autoCapitalize="none"
          value={form.password}
          onChangeText={(text) => setForm({ ...form, password: text })}
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

        <View style={styles.roleRow}>
          <TouchableOpacity
            style={[styles.roleButton, form.role === "parent" && styles.roleSelected]}
            onPress={() => setForm({ ...form, role: "parent" })}
          >
            <Text style={styles.roleText}>Parent</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, form.role === "nanny" && styles.roleSelected]}
            onPress={() => setForm({ ...form, role: "nanny" })}
          >
            <Text style={styles.roleText}>Nanny</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.roleButton, form.role === "driver" && styles.roleSelected]}
            onPress={() => setForm({ ...form, role: "driver" })}
          >
            <Text style={styles.roleText}>Driver</Text>
          </TouchableOpacity>
        </View>

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
  safeArea: { flex: 1, backgroundColor: "#d8d0d3" },
  container: { padding: 24 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 20, color: "#fff", textAlign: "center" },
  input: { borderRadius: 25, padding: 14, marginBottom: 16, backgroundColor: "#fff", fontSize: 15, color: "#222" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
  button: { flex: 1, paddingVertical: 12, borderRadius: 30, alignItems: "center", marginHorizontal: 5, backgroundColor: "#fff" },
  buttonText: { color: "#222", fontSize: 16, fontWeight: "600" },
  roleRow: { flexDirection: "row", justifyContent: "space-around", marginVertical: 12 },
  roleButton: { padding: 10, borderRadius: 8, backgroundColor: "#fff" },
  roleSelected: { backgroundColor: "#a97f9c" },
  roleText: { color: "#222", fontWeight: "600" },
});
