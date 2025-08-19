import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DocumentsSubmitted() {
  const router = useRouter();

  return (
    <LinearGradient
      colors={["#D4C4C1", "#C05BA1"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Background Check</Text>
        </View>

        {/* Main Content */}
        <View style={styles.container}>
          <View style={styles.successContainer}>
            {/* Success Card */}
            <View style={styles.successCard}>
              <View style={styles.checkmarkContainer}>
                <Ionicons name="checkmark" size={40} color="#FFF" />
              </View>
              <Text style={styles.successTitle}>Documents Submitted</Text>
            </View>

            {/* Done Button */}
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => router.push("/Screens/Sessions")}
            >
              <Text style={styles.doneButtonText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 30,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#FFF",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  successContainer: {
    alignItems: "center",
    width: "100%",
  },
  successCard: {
    backgroundColor: "rgba(199, 67, 162, 0.8)",
    borderRadius: 20,
    paddingVertical: 40,
    paddingHorizontal: 30,
    alignItems: "center",
    marginBottom: 60,
    width: "100%",
    maxWidth: 280,
  },
  checkmarkContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
  doneButton: {
    backgroundColor: "rgba(199, 67, 162, 0.8)",
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 25,
    minWidth: 120,
  },
  doneButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    textAlign: "center",
  },
});