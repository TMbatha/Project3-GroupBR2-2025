import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function Payment() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#E3DFDD"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          <Text style={styles.pageTitle}>PAYMENT</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>BREAKDOWN</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Hourly Rate</Text>
              <Text style={styles.value}>R120.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Hours booked</Text>
              <Text style={styles.value}>4</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Babysitter fee</Text>
              <Text style={styles.value}>R100.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Driver fee</Text>
              <Text style={styles.value}>R60.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Service fee</Text>
              <Text style={styles.value}>R50.00</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Tax (15%)</Text>
              <Text style={styles.value}>R49.50</Text>
            </View>

            {/* Total */}
            <View style={[styles.row, { marginTop: 10 }]}>
              <Text style={[styles.label, { fontWeight: "700", color: "#FF4DA6" }]}>
                Total
              </Text>
              <Text style={[styles.value, { fontWeight: "700", color: "#FF4DA6" }]}>
                R739.50
              </Text>
            </View>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity
            onPress={() => router.push("/Screens/PaymentDetails")}
            style={{ marginTop: 20 }}
          >
            <LinearGradient
              colors={["#D81B60"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>PROCEED TO CHECKOUT</Text>
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
    color: "#D81B60",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
    color: "#444",
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
