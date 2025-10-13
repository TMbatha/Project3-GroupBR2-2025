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
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function BackgroundCheck() {
  const router = useRouter();

  const [checkItems, setCheckItems] = useState([
    {
      id: 1,
      label: "Reference",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
    },
    {
      id: 2,
      label: "Police Clearance",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
    },
    {
      id: 3,
      label: "Driver Test",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
    },
    {
      id: 4,
      label: "Drivers License",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
    },
    {
      id: 5,
      label: "Background Check Status",
      status: "-- Pending --",
      uploaded: false,
      fileName: null,
      disabled: true, // This item is not uploadable
    },
  ]);

  const handleFileUpload = async (itemId) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "application/pdf",
          "image/*",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        setCheckItems((prevItems) =>
          prevItems.map((item) =>
            item.id === itemId
              ? {
                  ...item,
                  status: "Uploaded ✓",
                  uploaded: true,
                  fileName: file.name,
                }
              : item
          )
        );

        Alert.alert(
          "File Selected",
          `${file.name} has been selected for upload.`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.log("Upload error:", error);
      Alert.alert(
        "Upload Error",
        "There was an error selecting the file. Please try again.",
        [{ text: "OK" }]
      );
    }
  };

  // For testing purposes, add a function to simulate uploads
  const simulateAllUploads = () => {
    setCheckItems((prevItems) =>
      prevItems.map((item) =>
        item.disabled ? item : {
          ...item,
          status: "Uploaded ✓",
          uploaded: true,
          fileName: `${item.label.replace(/\s+/g, '_')}.pdf`,
        }
      )
    );
  };

  const canSubmit = () => {
    const uploadableItems = checkItems.filter((item) => !item.disabled);
    const allUploaded = uploadableItems.every((item) => item.uploaded);
    console.log("Can submit check:", { uploadableItems: uploadableItems.length, allUploaded });
    return allUploaded;
  };

  const handleSubmit = () => {
    console.log("Submit button pressed");
    console.log("Can submit:", canSubmit());
    
    if (canSubmit()) {
      console.log("Navigating to DocumentsSubmitted");
      
      // Update the background check status
      setCheckItems((prevItems) =>
        prevItems.map((item) =>
          item.id === 5 ? { ...item, status: "Submitted ✓" } : item
        )
      );

      // Try multiple navigation approaches
      try {
        // First try the Screens path
        router.push("/Screens/DocumentsSubmitted");
      } catch (error) {
        console.log("Navigation error with /Screens/DocumentsSubmitted:", error);
        try {
          // Fallback to root level
          router.push("/DocumentsSubmitted");
        } catch (error2) {
          console.log("Navigation error with /DocumentsSubmitted:", error2);
          // Final fallback - just show an alert
          Alert.alert(
            "Success!",
            "Documents submitted successfully! Background check is now under review.",
            [
              {
                text: "OK",
                onPress: () => router.push("/Screens/Sessions")
              }
            ]
          );
        }
      }
    } else {
      const uploadableItems = checkItems.filter((item) => !item.disabled);
      const uploadedCount = uploadableItems.filter((item) => item.uploaded).length;
      
      Alert.alert(
        "Incomplete Submission",
        `Please upload all required documents before submitting. ${uploadedCount}/${uploadableItems.length} documents uploaded.`,
        [
          { text: "Cancel" },
          { 
            text: "Simulate Uploads (Testing)", 
            onPress: simulateAllUploads,
            style: "default"
          }
        ]
      );
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
          item.disabled && styles.statusButtonDisabled,
        ]}
        onPress={() => !item.disabled && handleFileUpload(item.id)}
        disabled={item.disabled}
        activeOpacity={item.disabled ? 1 : 0.7}
      >
        <View style={styles.statusContent}>
          {item.uploaded && !item.disabled && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#4CAF50"
              style={styles.checkIcon}
            />
          )}
          <Text
            style={[
              styles.statusText,
              item.uploaded && !item.disabled && styles.statusTextUploaded,
              item.disabled && styles.statusTextDisabled,
            ]}
          >
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
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Header for testing */}
          <View style={styles.debugHeader}>
            <TouchableOpacity
              style={styles.testButton}
              onPress={simulateAllUploads}
            >
              <Text style={styles.testButtonText}>
                Test: Simulate All Uploads
              </Text>
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            <View style={styles.checkList}>{checkItems.map(renderCheckItem)}</View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.submitButton,
                  canSubmit() && styles.submitButtonEnabled,
                ]}
                onPress={handleSubmit}
              >
                <Text style={styles.submitButtonText}>
                  Submit {canSubmit() ? "✓" : `(${checkItems.filter(item => !item.disabled && item.uploaded).length}/${checkItems.filter(item => !item.disabled).length})`}
                </Text>
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
  container: {
    flex: 1,
    paddingHorizontal: 25,
  },
  debugHeader: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
  },
  testButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  testButtonText: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "500",
  },
  content: {
    flex: 1,
  },
  checkList: {
    marginBottom: 80,
    paddingTop: 30,
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
  statusButtonUploaded: {
    backgroundColor: "#E8F5E8",
  },
  statusButtonDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
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
  statusTextUploaded: {
    color: "#4CAF50",
    fontWeight: "600",
  },
  statusTextDisabled: {
    color: "#BBB",
  },
  fileName: {
    fontSize: 11,
    color: "#666",
    marginTop: 2,
    maxWidth: 120,
  },
  buttonContainer: {
    gap: 15,
    paddingBottom: 40,
  },
  submitButton: {
    backgroundColor: "rgba(199, 67, 162, 0.5)",
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: "center",
  },
  submitButtonEnabled: {
    backgroundColor: "rgba(199, 67, 162, 0.8)",
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