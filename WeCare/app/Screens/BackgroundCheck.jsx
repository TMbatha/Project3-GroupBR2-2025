import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Backend API URL - Update this to your backend URL
const API_BASE_URL = "http://localhost:8080/api"; // Change this to your actual backend URL
const IS_WEB = Platform.OS === "web";

export default function BackgroundCheck() {
  const router = useRouter();
  
  // This should be passed from the previous screen or retrieved from AsyncStorage
  const [backgroundCheckId, setBackgroundCheckId] = useState(null); // Will be fetched or created
  const [userId, setUserId] = useState("user123"); // Replace with actual user ID
  const [isLoadingBackgroundCheck, setIsLoadingBackgroundCheck] = useState(false);

  const [checkItems, setCheckItems] = useState([
    {
      id: 1,
      label: "Reference",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
      fileUri: null,
      documentType: "Reference",
    },
    {
      id: 2,
      label: "Police Clearance",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
      fileUri: null,
      documentType: "Police Clearance",
    },
    {
      id: 3,
      label: "Driver Test",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
      fileUri: null,
      documentType: "Driver Test",
    },
    {
      id: 4,
      label: "Drivers License",
      status: "-- Upload --",
      uploaded: false,
      fileName: null,
      fileUri: null,
      documentType: "Drivers License",
    },
    {
      id: 5,
      label: "Background Check Status",
      status: "-- Pending --",
      uploaded: false,
      fileName: null,
      fileUri: null,
      disabled: true, // This item is not uploadable
    },
  ]);

  // Get or create background check on component mount
  React.useEffect(() => {
    const getOrCreateBackgroundCheck = async () => {
      if (backgroundCheckId) return; // Already have one
      
      setIsLoadingBackgroundCheck(true);
      try {
        // Add timeout to fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch(
          `${API_BASE_URL}/documents/get-or-create-background-check?userId=${userId}`,
          {
            method: "POST",
            signal: controller.signal,
          }
        );
        
        clearTimeout(timeoutId);
        
        const result = await response.json();
        
        if (result.success && result.backgroundCheckId) {
          setBackgroundCheckId(result.backgroundCheckId);
          console.log("Background check created with ID:", result.backgroundCheckId);
        } else {
          console.error("Failed to create background check:", result.message);
          // Don't show alert, just log it - user can still proceed
        }
      } catch (error) {
        console.error("Error creating background check:", error);
        // Don't show alert on component load, just log it
        // User will get error when trying to upload if backend is down
      } finally {
        setIsLoadingBackgroundCheck(false);
      }
    };
    
    getOrCreateBackgroundCheck();
  }, []);

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
                  fileUri: file.uri,
                  mimeType: file.mimeType,
                  fileSize: file.size,
                }
              : item
          )
        );

        Alert.alert(
          "File Selected",
          `${file.name} has been selected. Click Submit to upload all documents.`,
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
          fileUri: null, // Simulated upload
        }
      )
    );
  };

  // Upload documents to backend
  const uploadDocumentsToBackend = async () => {
    try {
      // Check if backgroundCheckId is available, if not try to create one
      let currentBackgroundCheckId = backgroundCheckId;
      
      if (!currentBackgroundCheckId) {
        console.log("No background check ID found, attempting to create one...");
        try {
          const response = await fetch(
            `${API_BASE_URL}/documents/get-or-create-background-check?userId=${userId}`,
            {
              method: "POST",
            }
          );
          
          const result = await response.json();
          
          if (result.success && result.backgroundCheckId) {
            currentBackgroundCheckId = result.backgroundCheckId;
            setBackgroundCheckId(currentBackgroundCheckId);
            console.log("Created background check with ID:", currentBackgroundCheckId);
          } else {
            Alert.alert("Error", "Could not create background check. Please try again.");
            return false;
          }
        } catch (error) {
          console.error("Error creating background check:", error);
          Alert.alert("Error", "Could not connect to server. Please ensure backend is running.");
          return false;
        }
      }

      const uploadableItems = checkItems.filter(
        (item) => !item.disabled && item.uploaded && item.fileUri
      );

      if (uploadableItems.length === 0) {
        Alert.alert("No Documents", "No documents to upload.");
        return false;
      }

      // Upload each document
      for (const item of uploadableItems) {
        try {
          console.log(`Preparing to upload: ${item.fileName}`);
          console.log(`Document type: ${item.documentType}`);
          console.log(`File URI: ${item.fileUri}`);
          console.log(`Background Check ID: ${currentBackgroundCheckId}`);
          
          const formData = new FormData();
          
          // Platform-specific file handling
          if (IS_WEB) {
            console.log("Using WEB upload method");
            // For web, directly use the file from the URI
            const response = await fetch(item.fileUri);
            const blob = await response.blob();
            
            console.log(`Blob size: ${blob.size} bytes, type: ${blob.type}`);
            
            formData.append("file", blob, item.fileName);
            formData.append("documentType", item.documentType);
            formData.append("backgroundCheckId", currentBackgroundCheckId.toString());
            formData.append("uploadedBy", userId);
          } else {
            console.log("Using NATIVE upload method");
            // For native mobile (Android/iOS)
            const fileInfo = await FileSystem.getInfoAsync(item.fileUri);
            
            console.log(`File info:`, fileInfo);
            
            if (!fileInfo.exists) {
              throw new Error(`File not found: ${item.fileName}`);
            }

            // Create file object for upload
            const file = {
              uri: item.fileUri,
              type: item.mimeType || "application/pdf",
              name: item.fileName,
            };

            formData.append("file", file);
            formData.append("documentType", item.documentType);
            formData.append("backgroundCheckId", currentBackgroundCheckId.toString());
            formData.append("uploadedBy", userId);
          }

          // Upload to backend
          console.log(`Sending upload request to: ${API_BASE_URL}/documents/upload`);
          const response = await fetch(`${API_BASE_URL}/documents/upload`, {
            method: "POST",
            body: formData,
          });

          console.log(`Upload response status: ${response.status}`);
          const result = await response.json();
          console.log(`Upload result:`, result);

          if (!result.success) {
            throw new Error(result.message || "Upload failed");
          }

          console.log(`Uploaded ${item.fileName}:`, result);
        } catch (error) {
          console.error(`Error uploading ${item.fileName}:`, error);
          Alert.alert(
            "Upload Error",
            `Failed to upload ${item.fileName}: ${error.message}`
          );
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error("Upload error:", error);
      Alert.alert("Upload Error", `Error uploading documents: ${error.message}`);
      return false;
    }
  };

  const canSubmit = () => {
    const uploadableItems = checkItems.filter((item) => !item.disabled);
    const allUploaded = uploadableItems.every((item) => item.uploaded);
    console.log("Can submit check:", { uploadableItems: uploadableItems.length, allUploaded });
    return allUploaded;
  };

  const handleSubmit = async () => {
    console.log("Submit button pressed");
    console.log("Can submit:", canSubmit());
    
    if (canSubmit()) {
      console.log("Uploading documents to backend...");
      
      // Show loading alert
      Alert.alert("Uploading", "Please wait while we upload your documents...");
      
      // Upload documents to backend
      const uploadSuccess = await uploadDocumentsToBackend();
      
      if (uploadSuccess) {
        // Update the background check status
        setCheckItems((prevItems) =>
          prevItems.map((item) =>
            item.id === 5 ? { ...item, status: "Submitted ✓" } : item
          )
        );

        // Show success message
        Alert.alert(
          "Success!",
          "All documents have been uploaded successfully! Background check is now under review.",
          [
            {
              text: "OK",
              onPress: () => {
                try {
                  router.push("/Screens/DocumentsSubmitted");
                } catch (error) {
                  console.log("Navigation error:", error);
                  router.push("/Screens/Sessions");
                }
              }
            }
          ]
        );
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