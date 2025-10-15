import React from "react";         
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function SessionDetails() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#E3DFDD", "#b3007dff"]}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
          <Text style={styles.pageTitle}>Session Details</Text>

          {/* Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>BREAKDOWN</Text>

            <View style={styles.row}>
              <Text style={styles.label}>Session ID:</Text>
              <Text style={styles.value}>321</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>2026/08/22</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Start time:</Text>
              <Text style={styles.value}>1:00 pm</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>End Time:</Text>
              <Text style={styles.value}>5:00 pm</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Driver ID:</Text>
              <Text style={styles.value}>JEFF52521</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>Nanny ID:</Text>
              <Text style={styles.value}>MARY293</Text>
            </View>
          </View>

          {/* Proceed Button */}
          <TouchableOpacity
            onPress={() => router.push("/Screens/Payment")}
            style={{ marginTop: 20 }}
          >
            <LinearGradient
              colors={["#FFB6E9", "#F18ECF"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>PROCEED TO PAYMENT</Text>
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
    color: "#f0499cff",
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
    color: "#f1459bff",
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
