import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, TextInput, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons"; // for lock icon

export default function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  return (
    <LinearGradient
      colors={["#E3DFDD", "#C0B8B6"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          <Text style={styles.pageTitle}>PAYMENT</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>DETAILS</Text>

            {/* Card Number */}
            <Text style={styles.label}>CARD NUMBER</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="Valid Card Number"
                keyboardType="numeric"
                value={form.cardNumber}
                onChangeText={(cardNumber) => setForm({ ...form, cardNumber })}
              />
              <Ionicons name="lock-closed-outline" size={20} color="#555" style={{ marginLeft: 8 }} />
            </View>

            {/* Expiry & CV Code */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.label}>EXPIRY DATE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="numeric"
                  value={form.expiry}
                  onChangeText={(expiry) => setForm({ ...form, expiry })}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.label}>CV CODE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="CV"
                  keyboardType="numeric"
                  secureTextEntry
                  value={form.cvv}
                  onChangeText={(cvv) => setForm({ ...form, cvv })}
                />
              </View>
            </View>
          </View>

          {/* Payment Amount */}
          <View style={styles.paymentRow}>
            <Text style={styles.paymentLabel}>PAYMENT AMOUNT</Text>
            <Text style={styles.paymentValue}>R739.50</Text>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={() => {
              if (form.cardNumber && form.expiry && form.cvv) {
                alert("Payment Confirmed ✅");
                router.push("/Screens/PaymentComplete"); // you can create success page
              } else {
                alert("Please fill all details");
              }
            }}
            style={{ marginTop: 20 }}
          >
            <LinearGradient
              colors={["#FFB6E9", "#F18ECF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>CONFIRM PAYMENT</Text>
            </LinearGradient>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#444",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    color: "#FF4DA6",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#f9f9f9",
    fontSize: 14,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FF4DA6",
  },
  button: {
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    width: 260,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
    textTransform: "uppercase",
  },
});
