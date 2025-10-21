import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  TextInput, 
  ScrollView,
  Alert 
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Checkout() {
  const router = useRouter();
  const [form, setForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const handleConfirmPayment = () => {
    // Basic validation
    if (!form.cardNumber || !form.expiry || !form.cvv) {
      Alert.alert("Missing Information", "Please fill all payment details");
      return;
    }

    // Card number validation (basic)
    if (form.cardNumber.replace(/\s/g, '').length !== 16) {
      Alert.alert("Invalid Card", "Please enter a valid 16-digit card number");
      return;
    }

    // Expiry date validation (basic)
    if (!form.expiry.includes('/') || form.expiry.length !== 5) {
      Alert.alert("Invalid Expiry", "Please use MM/YY format");
      return;
    }

    // CVV validation
    if (form.cvv.length < 3) {
      Alert.alert("Invalid CVV", "Please enter a valid CVV code");
      return;
    }

    // If all validations pass
    Alert.alert(
      "Payment Confirmed", 
      "Your payment of R739.50 has been processed successfully! ✅",
      [
        {
          text: "OK",
          onPress: () => router.push("/Screens/PaymentComplete")
        }
      ]
    );
  };

  // Format card number with spaces
  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})/g, '$1 ').trim();
    return formatted.slice(0, 19); // 16 digits + 3 spaces
  };

  // Format expiry date
  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <LinearGradient
      colors={["#E3DFDD", "#C0B8B6"]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.container}>
          {/* Title */}
        

          {/* Payment Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>PAYMENT DETAILS</Text>

            {/* Card Number */}
            <Text style={styles.label}>CARD NUMBER</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, { flex: 1 }]}
                placeholder="1234 5678 9012 3456"
                placeholderTextColor="#999"
                keyboardType="numeric"
                maxLength={19}
                value={form.cardNumber}
                onChangeText={(text) => setForm({ ...form, cardNumber: formatCardNumber(text) })}
              />
              <Ionicons name="lock-closed-outline" size={20} color="#555" style={styles.lockIcon} />
            </View>

            {/* Expiry & CVV */}
            <View style={styles.row}>
              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>EXPIRY DATE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={5}
                  value={form.expiry}
                  onChangeText={(text) => setForm({ ...form, expiry: formatExpiry(text) })}
                />
              </View>

              <View style={styles.halfInputContainer}>
                <Text style={styles.label}>CVV CODE</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  maxLength={4}
                  secureTextEntry
                  value={form.cvv}
                  onChangeText={(text) => setForm({ ...form, cvv: text.replace(/\D/g, '') })}
                />
              </View>
            </View>
          </View>

          {/* Payment Amount Section */}
          <View style={styles.paymentSection}>
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Payment Amount</Text>
              <Text style={styles.paymentValue}>R739.50</Text>
            </View>
            
            <View style={styles.paymentRow}>
              <Text style={styles.paymentLabel}>Service Fee</Text>
              <Text style={styles.paymentValue}>R50.00</Text>
            </View>
            
            <View style={[styles.paymentRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>TOTAL</Text>
              <Text style={styles.totalValue}>R789.50</Text>
            </View>
          </View>

          {/* Confirm Button */}
          <TouchableOpacity
            onPress={() => router.push("/Screens/PaymentComplete")}
            style={styles.buttonContainer}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#D81B60"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.button}
            >
              <Text style={styles.buttonText}>CONFIRM PAYMENT</Text>
              <Ionicons name="checkmark-circle-outline" size={20} color="#fff" style={styles.buttonIcon} />
            </LinearGradient>
          </TouchableOpacity>

          {/* Cancel Button */}
          <TouchableOpacity
            onPress={() => router.push("/Screens/Payment")}
            style={styles.cancelButton}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    paddingTop: 40,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#D81B60",
    marginBottom: 30,
    textAlign: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 20,
    color: "#D81B60",
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    color: "#333",
  },
  lockIcon: {
    marginLeft: 12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  halfInputContainer: {
    flex: 1,
    marginHorizontal: 5,
  },
  paymentSection: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    width: "100%",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  paymentValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 12,
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D81B60",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D81B60",
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  button: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    width: "100%",
    maxWidth: 300,
    flexDirection: "row",
    justifyContent: "center",
    shadowColor: "#D81B60",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginRight: 8,
  },
  buttonIcon: {
    marginLeft: 4,
  },
  cancelButton: {
    marginTop: 15,
    padding: 16,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
    textDecorationLine: "underline",
  },
});