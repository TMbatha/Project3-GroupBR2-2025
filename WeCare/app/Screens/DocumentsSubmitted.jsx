import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
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

  const [checkItems, setCheckItems] = useState([
    { id: 1, label: "Reference", status: "-- Upload --", uploaded: false, fileName: null },
    { id: 2, label: "Police Clearance", status: "-- Upload --", uploaded: false, fileName: null },
    { id: 3, label: "Driver Test", status: "-- Upload --", uploaded: false, fileName: null },
    { id: 4, label: "Drivers License", status: "-- Upload --", uploaded: false, fileName: null },
    { id: 5, label: "Background Check Status", status: "-- Pending --", uploaded: false, fileName: null, disabled: true }
  ]);

  const handleFileUpload = async (itemId) => {
    const result = await DocumentPicker.getDocumentAsync({
      type: ["application/pdf", "image/*", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const file = result.assets[0];
      setCheckItems(prev =>
        prev.map(item =>
          item.id === itemId
            ? { ...item, status: "Uploaded ✓", uploaded: true, fileName: file.name }
            : item
        )
      );
    }
  };

  const canSubmit = () => {
    const uploadableItems = checkItems.filter(item => !item.disabled);
    return uploadableItems.every(item => item.uploaded);
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      router.push("/Screens/DocumentsSubmitted");
    }
  };

  const renderCheckItem = (item) => (
    <View key={item.id} style={styles.checkItem}>
      <View style={styles.labelContainer}>
        <Text style={styles.checkLabel}>{item.label}</Text>
      </View>
      <TouchableOpacity
        style={[
          styles.statusButton,
          item.uploaded && styles.statusButtonUploaded,
          item.disabled && styles.statusButtonDisabled
        ]}
        onPress={() => !item.disabled && handleFileUpload(item.id)}
        disabled={item.disabled}
      >
        <View style={styles.statusContent}>
          {item.uploaded && !item.disabled && (
            <Ionicons name="checkmark-circle" size={16} color="#4CAF50" style={styles.checkIcon} />
          )}
          <Text style={[
            styles.statusText,
            item.uploaded && !item.disabled && styles.statusTextUploaded,
            item.disabled && styles.statusTextDisabled
          ]}>
            {item.status}
          </Text>
        </View>
        {item.fileName && (
          <Text style={styles.fileName} numberOfLines={1}>
            {item.fileName}
          </Text>
        )}
      </TouchableOpacity>
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
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.checkList}>
              {checkItems.map(renderCheckItem)}
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  canSubmit() && styles.submitButtonEnabled
                ]}
                onPress={handleSubmit}
              >
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
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 25 },
  content: { flex: 1 },
  checkList: { marginBottom: 80, paddingTop: 50 },
  checkItem: { flexDirection: "row", alignItems: "center", marginBottom: 20, minHeight: 60 },
  labelContainer: {
    backgroundColor: "rgba(199, 67, 162, 0.7)",
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    flex: 1,
    justifyContent: "center",
  },
  checkLabel: { fontSize: 16, fontWeight: "500", color: "#FFF" },
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
  statusButtonUploaded: { backgroundColor: "#E8F5E8" },
  statusButtonDisabled: { backgroundColor: "#F5F5F5", opacity: 0.7 },
  statusContent: { flexDirection: "row", alignItems: "center", justifyContent: "center" },
  checkIcon: { marginRight: 5 },
  statusText: { fontSize: 14, fontWeight: "400", color: "#999", textAlign: "center" },
  statusTextUploaded: { color: "#4CAF50", fontWeight: "600" },
  statusTextDisabled: { color: "#BBB" },
  fileName: { fontSize: 11, color: "#666", marginTop: 2, maxWidth: 120 },
  buttonContainer: { gap: 15, paddingBottom: 40 },
  submitButton: {
    backgroundColor: "rgba(199, 67, 162, 0.5)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonEnabled: { backgroundColor: "rgba(199, 67, 162, 0.8)" },
  submitButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF" },
  cancelButton: {
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  cancelButtonText: { fontSize: 16, fontWeight: "600", color: "#FFF", letterSpacing: 1 },
});
