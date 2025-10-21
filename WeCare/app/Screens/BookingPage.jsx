import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BookingPage() {
  const router = useRouter();
  
  // State management
  const [selectedChild, setSelectedChild] = useState(null);
  const [sessionDate, setSessionDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [sessionNotes, setSessionNotes] = useState("");
  const [showChildDropdown, setShowChildDropdown] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  // Mock data - replace with your actual children data
  const children = [
    { id: "1", name: "Buhle Zungu", age: 5 },
    { id: "2", name: "Mbali Zungu", age: 3 },
    { id: "3", name: "Thabo Zungu", age: 7 },
  ];

  // Date and time formatting functions
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  // Handler functions
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSessionDate(selectedDate);
    }
  };

  const handleStartTimeChange = (event, selectedTime) => {
    setShowStartTimePicker(false);
    if (selectedTime) {
      setStartTime(selectedTime);
      // Auto-set end time to 1 hour after start time
      const end = new Date(selectedTime);
      end.setHours(end.getHours() + 1);
      setEndTime(end);
    }
  };

  const handleEndTimeChange = (event, selectedTime) => {
    setShowEndTimePicker(false);
    if (selectedTime) {
      setEndTime(selectedTime);
    }
  };

  const handleProceedToPayment = () => {
    // Validate all fields are filled
    if (!selectedChild || !sessionDate || !startTime || !endTime) {
      alert("Please fill in all required fields");
      return;
    }

    // Validate end time is after start time
    if (endTime <= startTime) {
      alert("End time must be after start time");
      return;
    }

    // Navigate to payment page with booking data
    router.push({
      pathname: "/Screens/payment",
      params: {
        childId: selectedChild.id,
        childName: selectedChild.name,
        date: sessionDate.toISOString(),
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        notes: sessionNotes,
      },
    });
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>BOOKINGS</Text>
        </View>

        {/* Select Child */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Child</Text>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowChildDropdown(true)}
          >
            <Text style={selectedChild ? styles.dropdownTextSelected : styles.dropdownTextPlaceholder}>
              {selectedChild ? selectedChild.name : "-Select-"}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Session Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Session Date</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formatDate(sessionDate)}
            </Text>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Start Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Start Time</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowStartTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formatTime(startTime)}
            </Text>
            <Ionicons name="time" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* End Time */}
        <View style={styles.section}>
          <Text style={styles.label}>End Time</Text>
          <TouchableOpacity
            style={styles.dateTimeButton}
            onPress={() => setShowEndTimePicker(true)}
          >
            <Text style={styles.dateTimeText}>
              {formatTime(endTime)}
            </Text>
            <Ionicons name="time" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        {/* Session Notes */}
        <View style={styles.section}>
          <Text style={styles.label}>Session Notes</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Type Here..."
            placeholderTextColor="#999"
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            value={sessionNotes}
            onChangeText={setSessionNotes}
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.proceedButton}
            onPress={() => router.push("/Screens/Childsitting_session")}
          >
            <Text style={styles.proceedButtonText}>PROCEED TO PAYMENT</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>CANCEL</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Child Selection Modal */}
      <Modal
        visible={showChildDropdown}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowChildDropdown(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowChildDropdown(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.dropdownModal}>
              {children.map((child) => (
                <TouchableOpacity
                  key={child.id}
                  style={styles.childOption}
                  onPress={() => {
                    setSelectedChild(child);
                    setShowChildDropdown(false);
                  }}
                >
                  <Text style={styles.childOptionText}>{child.name}</Text>
                  <Text style={styles.childAgeText}>Age: {child.age}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Date and Time Pickers */}
      {showDatePicker && (
        <DateTimePicker
          value={sessionDate}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showStartTimePicker && (
        <DateTimePicker
          value={startTime}
          mode="time"
          display="spinner"
          onChange={handleStartTimeChange}
        />
      )}

      {showEndTimePicker && (
        <DateTimePicker
          value={endTime}
          mode="time"
          display="spinner"
          onChange={handleEndTimeChange}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#D81B60",
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  dropdown: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  dropdownTextSelected: {
    fontSize: 16,
    color: "#333",
  },
  dropdownTextPlaceholder: {
    fontSize: 16,
    color: "#999",
  },
  dateTimeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: "#fff",
  },
  dateTimeText: {
    fontSize: 16,
    color: "#333",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#333",
    minHeight: 100,
    textAlignVertical: "top",
  },
  buttonContainer: {
    marginTop: 20,
  },
  proceedButton: {
    backgroundColor: "#D81B60",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 15,
  },
  proceedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownModal: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 10,
    width: "80%",
    maxHeight: "60%",
  },
  childOption: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  childOptionText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  childAgeText: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
});