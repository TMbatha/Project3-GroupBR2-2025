import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function PaymentComplete() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>PAYMENT</Text>
          <View style={styles.statusDot}>
            <Text style={styles.dotText}>●</Text>
          </View>
        </View>

        {/* Dots */}
        <View style={styles.dotsContainer}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>

        {/* Payment Complete Box */}
        <View style={styles.paymentBox}>
          <View style={styles.successBadge}>
            <Text style={styles.successText}>PAYMENT COMPLETE</Text>
            <Ionicons name="checkmark-circle" size={48} color="#fff" style={styles.successIcon} />
          </View>
          
          {/* Additional success message */}
          <Text style={styles.successMessage}>
            Your payment has been processed successfully!
          </Text>
          <Text style={styles.amountText}>R789.50</Text>
        </View>

        {/* Done Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.doneButton}
            onPress={() => router.push("/Screens/Sessions")}
          >
            <Text style={styles.doneButtonText}>DONE</Text>
          </TouchableOpacity>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#e7e7e7ff",
  },
  content: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: 30,
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "#fff",
    fontSize: 20,
  },
  statusDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  dotText: {
    color: "#D81B60",
    fontSize: 16,
    fontWeight: "bold",
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 60,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#000",
  },
  paymentBox: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    alignItems: "center",
    marginBottom: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  successBadge: {
    backgroundColor: "#646464ff",
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  successText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 8,
  },
  successIcon: {
    marginTop: 4,
  },
  successMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 12,
  },
  amountText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D81B60",
  },
  buttonContainer: {
    width: "100%",
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: "#D81B60",
    borderRadius: 30,
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
    shadowColor: "#D81B60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  doneButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  continueButton: {
    paddingVertical: 16,
    alignItems: "center",
    width: "100%",
  },
  continueButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textDecorationLine: "underline",
  },
});