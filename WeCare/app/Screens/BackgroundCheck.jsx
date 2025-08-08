import React, { useState } from "react";
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

export default function BackgroundCheck() {
  const router = useRouter();

  const [checkItems] = useState([
    {
      id: 1,
      label: "Reference",
      status: "-- Upload --"
    },
    {
      id: 2,
      label: "Police Clearance",
      status: "-- Upload --"
    },
    {
      id: 3,
      label: "Driver Test",
      status: "-- Upload --"
    },
    {
      id: 4,
      label: "Drivers License",
      status: "-- upload --"
    },
    {
      id: 5,
      label: "Background Check Status",
      status: "-- Pending --"
    }
  ]);

  const renderCheckItem = (item) => (
    <View key={item.id} style={styles.checkItem}>
      <View style={styles.labelContainer}>
        <Text style={styles.checkLabel}>{item.label}</Text>
      </View>
      <TouchableOpacity style={styles.statusButton}>
        <Text style={styles.statusText}>{item.status}</Text>
      </TouchableOpacity>
    </View>
  );

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

        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.checkList}>
              {checkItems.map(renderCheckItem)}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.submitButton}>
                <Text style={styles.submitButtonText}>Submit</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={() => router.back()}
              >
                <Text style={styles.cancelButtonText}>CANCEL</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
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
    paddingHorizontal: 25,
  },
  content: {
    flex: 1,
  },
  checkList: {
    marginBottom: 80,
  },
  checkItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    height: 60,
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
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    minWidth: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "400",
    color: "#999",
  },
  buttonContainer: {
    gap: 15,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: "rgba(199, 67, 162, 0.8)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
  },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFF",
    letterSpacing: 1,
  },
});