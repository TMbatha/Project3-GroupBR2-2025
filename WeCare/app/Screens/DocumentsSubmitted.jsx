import React from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function DocumentsSubmitted() {
  const router = useRouter();

  const submittedItems = [
    {
      id: 1,
      label: "Reference",
      status: "Submitted ✓",
    },
    {
      id: 2,
      label: "Police Clearance",
      status: "Submitted ✓",
    },
    {
      id: 3,
      label: "Driver Test",
      status: "Submitted ✓",
    },
    {
      id: 4,
      label: "Drivers License",
      status: "Submitted ✓",
    },
    {
      id: 5,
      label: "Background Check Status",
      status: "Under Review",
    },
  ];

  const renderCheckItem = (item) => (
    <View key={item.id} style={styles.checkItem}>
      <View style={styles.labelContainer}>
        <Text style={styles.checkLabel}>{item.label}</Text>
      </View>
      <View style={[styles.statusButton, styles.statusButtonSubmitted]}>
        <View style={styles.statusContent}>
          {item.status.includes("✓") && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#4CAF50"
              style={styles.checkIcon}
            />
          )}
          {item.status === "Under Review" && (
            <Ionicons
              name="time-outline"
              size={16}
              color="#FF9800"
              style={styles.checkIcon}
            />
          )}
          <Text style={[
            styles.statusText,
            item.status.includes("✓") && styles.statusTextSubmitted,
            item.status === "Under Review" && styles.statusTextReview,
          ]}>
            {item.status}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#D4C4C1" }}>
      <LinearGradient
        colors={["#D4C4C1", "#C05BA1"]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ flex: 1 }}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Success Header */}
          <View style={styles.header}>
            <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
            <Text style={styles.headerTitle}>Documents Submitted!</Text>
            <Text style={styles.headerSubtitle}>
              Your background check documents have been submitted successfully.
              We'll review them and get back to you soon.
            </Text>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.checkList}>
              {submittedItems.map(renderCheckItem)}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => router.push("/Screens/Sessions")}
              >
                <Text style={styles.backButtonText}>Back to Dashboard</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.sessionsButton}
                onPress={() => router.push("/Screens/Sessions")}
              >
                <Text style={styles.sessionsButtonText}>VIEW SESSIONS</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  header: {
    alignItems: "center",
    paddingTop: 50,
    paddingBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFF",
    marginTop: 20,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#FFF",
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  checkList: {
    marginBottom: 40,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    minHeight: 60,
  },
  labelContainer: {
    backgroundColor: "rgba(199, 67, 162, 0.7)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    flex: 1,
    justifyContent: "center",
  },
  checkLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#FFF",
  },
  statusButton: {
    backgroundColor: "#FFF",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  statusButtonSubmitted: {
    backgroundColor: "#E8F5E8",
  },
  statusContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkIcon: {
    marginRight: 5,
  },
  statusText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#999",
    textAlign: "center",
  },
  statusTextSubmitted: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  statusTextReview: {
    color: "#FF9800",
    fontWeight: "600",
  },
  buttonContainer: {
    gap: 15,
    paddingBottom: 40,
  },
  backButton: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#C743A2",
  },
  sessionsButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  sessionsButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: 1,
  },
});