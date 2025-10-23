import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Platform,
  Modal,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function BookSession() {
  const router = useRouter();
  
  // Form state
  const [parentId, setParentId] = useState(null);
  const [children, setChildren] = useState([]);
  const [selectedChildren, setSelectedChildren] = useState([]);
  const [nannies, setNannies] = useState([]);
  const [selectedNanny, setSelectedNanny] = useState('');
  const [drivers, setDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [sessionDate, setSessionDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  // Add Child Form state
  const [showAddChildForm, setShowAddChildForm] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildSurname, setNewChildSurname] = useState('');
  const [newChildAge, setNewChildAge] = useState('');

  useEffect(() => {
    getParentIdAndFetchData();
  }, []);

  const getParentIdAndFetchData = async () => {
    try {
      const storedParentId = await AsyncStorage.getItem('userId');
      console.log('Stored parent ID from AsyncStorage:', storedParentId);
      
      if (storedParentId) {
        const parsedId = parseInt(storedParentId);
        setParentId(parsedId);
        console.log('Parent ID set to:', parsedId);
        await fetchChildren(storedParentId);
      } else {
        Alert.alert('Error', 'No parent session found. Please login again.');
      }
    } catch (error) {
      console.error('Error getting parent ID:', error);
    }
    
    // Fetch nannies and drivers regardless
    fetchNannies();
    fetchDrivers();
  };

  const fetchChildren = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/api/child/parent/${id}`);
      const result = await response.json();
      console.log('Children fetched:', result);
      // Ensure result is always an array
      setChildren(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching children:', error);
      setChildren([]); // Reset to empty array on error
      Alert.alert('Error', 'Could not load children. Make sure backend is running.');
    }
  };

  const handleAddChild = async () => {
    if (!newChildName || !newChildSurname || !newChildAge) {
      Alert.alert('Error', 'Please fill in all child details');
      return;
    }

    if (parseInt(newChildAge) <= 0 || parseInt(newChildAge) > 18) {
      Alert.alert('Error', 'Please enter a valid age (1-18)');
      return;
    }

    if (!parentId) {
      Alert.alert('Error', 'Parent session not found. Please login again.');
      return;
    }

    setLoading(true);

    try {
      const childData = {
        childName: newChildName,
        childSurname: newChildSurname,
        childAge: parseInt(newChildAge),
        parentId: parseInt(parentId) // Send parentId directly
      };

      console.log('Adding child with data:', JSON.stringify(childData));

      const response = await fetch(`http://localhost:8080/api/child/create?parentId=${parseInt(parentId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(childData),
      });

      if (response.ok) {
        const newChild = await response.json();
        console.log('Child added:', newChild);
        
        // Clear form
        setNewChildName('');
        setNewChildSurname('');
        setNewChildAge('');
        setShowAddChildForm(false);
        
        // Refresh children list
        await fetchChildren(parentId);
        
        Alert.alert('Success', `Child added successfully!`);
      } else {
        const errorData = await response.text();
        console.error('Error response:', errorData);
        Alert.alert('Error', 'Failed to add child');
      }
    } catch (error) {
      console.error('Error adding child:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const fetchNannies = async () => {
    try {
      console.log('Fetching nannies from: http://localhost:8080/api/nanny/all');
      const response = await fetch('http://localhost:8080/api/nanny/all');
      console.log('Nanny response status:', response.status);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const text = await response.text();
      console.log('Nanny response text:', text);
      
      const result = JSON.parse(text);
      console.log('Nannies fetched:', result);
      console.log('Number of nannies:', result.length);
      
      // Ensure result is always an array
      setNannies(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching nannies:', error);
      setNannies([]); // Reset to empty array on error
      Alert.alert('Error', `Could not load nannies: ${error.message}. Make sure backend is running.`);
    }
  };

  const fetchDrivers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/driver/all');
      const result = await response.json();
      console.log('Drivers fetched:', result);
      // Ensure result is always an array
      setDrivers(Array.isArray(result) ? result : []);
    } catch (error) {
      console.error('Error fetching drivers:', error);
      setDrivers([]); // Reset to empty array on error
      Alert.alert('Error', 'Could not load drivers. Make sure backend is running.');
    }
  };

  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const toggleChildSelection = (childId) => {
    if (selectedChildren.includes(childId)) {
      setSelectedChildren(selectedChildren.filter(id => id !== childId));
    } else {
      setSelectedChildren([...selectedChildren, childId]);
    }
  };

  const handleBookSession = async () => {
    console.log('=== BOOK SESSION BUTTON CLICKED ===');
    console.log('Selected Children:', selectedChildren);
    console.log('Session Date:', sessionDate);
    console.log('Start Time:', startTime);
    console.log('End Time:', endTime);
    console.log('Selected Nanny:', selectedNanny);
    console.log('Payment Amount:', paymentAmount);
    
    // Validation
    if (selectedChildren.length === 0) {
      console.log('❌ Validation failed: No children selected');
      Alert.alert('Error', 'Please select at least one child');
      return;
    }
    console.log('✓ Children validation passed');
    
    if (!sessionDate) {
      console.log('❌ Validation failed: No session date');
      Alert.alert('Error', 'Please select a session date');
      return;
    }
    console.log('✓ Session date validation passed');
    
    if (!startTime) {
      console.log('❌ Validation failed: No start time');
      Alert.alert('Error', 'Please select a start time');
      return;
    }
    console.log('✓ Start time validation passed');
    
    if (!endTime) {
      console.log('❌ Validation failed: No end time');
      Alert.alert('Error', 'Please select an end time');
      return;
    }
    console.log('✓ End time validation passed');
    
    if (!selectedNanny) {
      console.log('❌ Validation failed: No nanny selected');
      Alert.alert('Error', 'Please select a nanny');
      return;
    }
    console.log('✓ Nanny validation passed');
    
    if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
      console.log('❌ Validation failed: Invalid payment amount');
      Alert.alert('Error', 'Please enter a valid payment amount');
      return;
    }
    console.log('✓ Payment amount validation passed');
    console.log('✓ All validations passed - preparing confirmation dialog');

    console.log('✓ Payment amount validation passed');
    console.log('✓ All validations passed - preparing confirmation dialog');

    // Get selected children names
    const selectedChildrenNames = children
      .filter(child => selectedChildren.includes(child.childId))
      .map(child => `${child.childName} ${child.childSurname}`)
      .join(', ');
    
    console.log('Selected children names:', selectedChildrenNames);

    // Get selected nanny name
    const selectedNannyObj = nannies.find(n => n.nannyId === parseInt(selectedNanny));
    const nannyName = selectedNannyObj 
      ? `${selectedNannyObj.nannyName} ${selectedNannyObj.nannySurname}` 
      : 'Unknown';
    
    console.log('Selected nanny name:', nannyName);

    // Get selected driver name (if any)
    let driverName = 'No driver';
    if (selectedDriver) {
      const selectedDriverObj = drivers.find(d => d.driverId === parseInt(selectedDriver));
      driverName = selectedDriverObj 
        ? `${selectedDriverObj.driverName} ${selectedDriverObj.driverSurname}` 
        : 'Unknown';
    }
    
    console.log('Selected driver name:', driverName);
    console.log('📋 Showing confirmation dialog...');

    // Store confirmation data for modal
    const confirmData = {
      date: formatDate(sessionDate),
      time: `${formatTime(startTime)} - ${formatTime(endTime)}`,
      children: selectedChildrenNames,
      nanny: nannyName,
      driver: driverName,
      payment: parseFloat(paymentAmount).toFixed(2),
      bookingData: {
        parentId: parseInt(parentId),
        childIds: selectedChildren,
        sessionDate: formatDate(sessionDate),
        sessionStartTime: formatTime(startTime),
        sessionEndTime: formatTime(endTime),
        nannyId: parseInt(selectedNanny),
        driverId: selectedDriver ? parseInt(selectedDriver) : null,
        paymentAmount: parseFloat(paymentAmount),
      }
    };

    setConfirmationData(confirmData);
    setShowConfirmationModal(true);
  };

  const proceedWithBooking = async () => {
    console.log('✅ User clicked Confirm - starting booking process...');
    setShowConfirmationModal(false);
    setLoading(true);

    try {
      const bookingData = confirmationData.bookingData;

      console.log('=== BOOKING SESSION ===');
      console.log('Booking data:', JSON.stringify(bookingData, null, 2));
      console.log('API URL:', 'http://localhost:8080/api/child-sitting-session/book');
      console.log('📡 Sending booking request to backend...');

      const response = await fetch('http://localhost:8080/api/child-sitting-session/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      console.log('📦 Response received from backend:');
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Backend returned error:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Response result:', JSON.stringify(result, null, 2));

      if (response.ok && result.success) {
        // Clear form
        setSelectedChildren([]);
        setSessionDate(null);
        setStartTime(null);
        setEndTime(null);
        setSelectedNanny('');
        setSelectedDriver('');
        setPaymentAmount('');
        
        Alert.alert(
          'Success',
          `Session booked successfully!\n\nSession ID: ${result.sessionId}\nNanny: ${result.nannyName}\n${result.driverName ? `Driver: ${result.driverName}` : ''}\n\nYour session has been added to upcoming sessions.`,
          [
            {
              text: 'View Sessions',
              onPress: () => {
                console.log('Redirecting to Sessions page...');
                console.log('Session should be visible with status: UPCOMING');
                router.push('/Screens/Sessions');
              },
            },
          ]
        );
      } else {
        console.error('Booking failed:', result.message);
        Alert.alert('Error', result.message || 'Failed to book session');
      }
    } catch (error) {
      console.error('Error booking session:', error);
      Alert.alert('Error', 'Could not connect to server. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Session</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Select Children */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.label, selectedChildren.length === 0 && styles.requiredField]}>
              Select Child(ren) * {selectedChildren.length === 0 && '(Required)'}
            </Text>
            <TouchableOpacity
              style={[styles.addChildButton, !parentId && styles.addChildButtonDisabled]}
              onPress={() => parentId && setShowAddChildForm(!showAddChildForm)}
              disabled={!parentId}
            >
              <Text style={styles.addChildButtonText}>
                {showAddChildForm ? '− Cancel' : '+ Add Child'}
              </Text>
            </TouchableOpacity>
          </View>
          
          {/* Selection Summary */}
          {selectedChildren.length > 0 && (
            <View style={styles.selectionSummary}>
              <Text style={styles.selectionText}>
                ✓ {selectedChildren.length} child{selectedChildren.length > 1 ? 'ren' : ''} selected
              </Text>
            </View>
          )}

          {/* Add Child Form */}
          {showAddChildForm && (
            <View style={styles.addChildForm}>
              <Text style={styles.formTitle}>Add New Child</Text>
              
              <TextInput
                style={styles.input}
                placeholder="Child's First Name"
                value={newChildName}
                onChangeText={setNewChildName}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Child's Last Name"
                value={newChildSurname}
                onChangeText={setNewChildSurname}
              />
              
              <TextInput
                style={styles.input}
                placeholder="Child's Age (1-18)"
                keyboardType="numeric"
                value={newChildAge}
                onChangeText={setNewChildAge}
              />
              
              <TouchableOpacity
                style={[styles.submitChildButton, loading && styles.bookButtonDisabled]}
                onPress={handleAddChild}
                disabled={loading}
              >
                <Text style={styles.bookButtonText}>
                  {loading ? 'Adding...' : 'Add Child'}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Children List */}
          {!children || children.length === 0 ? (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyText}>
                No children added yet. Click "+ Add Child" above to add a child.
              </Text>
            </View>
          ) : (
            Array.isArray(children) && children.map((child) => (
              <TouchableOpacity
                key={child.childId}
                style={[
                  styles.checkbox,
                  selectedChildren.includes(child.childId) && styles.checkboxSelected,
                ]}
                onPress={() => toggleChildSelection(child.childId)}
              >
                <Text style={styles.checkboxText}>
                  {child.childName} {child.childSurname} ({child.childAge} years old)
                </Text>
                {selectedChildren.includes(child.childId) && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* Session Date */}
        <View style={styles.section}>
          <Text style={styles.label}>Session Date *</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              placeholder="Select Session Date"
              value={sessionDate ? formatDate(sessionDate) : ''}
              onFocus={(e) => {
                e.target.type = 'date';
                e.target.min = formatDate(new Date());
              }}
              onChange={(e) => {
                const dateStr = e.target.value;
                if (dateStr) {
                  const [year, month, day] = dateStr.split('-');
                  const newDate = new Date(year, month - 1, day);
                  setSessionDate(newDate);
                  console.log('Date selected:', formatDate(newDate));
                }
              }}
            />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dateButton, !sessionDate && styles.dateButtonEmpty]}
                onPress={() => {
                  console.log('Opening date picker...');
                  setShowDatePicker(true);
                }}
              >
                <Text style={[styles.dateButtonText, !sessionDate && styles.placeholderText]}>
                  {sessionDate ? `📅 ${formatDate(sessionDate)}` : 'Tap to Select Session Date'}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={sessionDate || new Date()}
                  mode="date"
                  display="default"
                  onChange={(event, selectedDate) => {
                    console.log('Date picker onChange - event.type:', event.type);
                    setShowDatePicker(false);
                    
                    if (event.type === 'set' && selectedDate) {
                      setSessionDate(selectedDate);
                      console.log('Date updated to:', formatDate(selectedDate));
                    }
                  }}
                  minimumDate={new Date()}
                />
              )}
            </>
          )}
        </View>

        {/* Start Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Start Time *</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              placeholder="Select Start Time"
              value={startTime ? formatTime(startTime) : ''}
              onFocus={(e) => {
                e.target.type = 'time';
              }}
              onChange={(e) => {
                const timeStr = e.target.value;
                if (timeStr) {
                  const [hours, minutes] = timeStr.split(':');
                  const newTime = new Date();
                  newTime.setHours(parseInt(hours), parseInt(minutes), 0);
                  setStartTime(newTime);
                  console.log('Start time selected:', formatTime(newTime));
                }
              }}
            />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dateButton, !startTime && styles.dateButtonEmpty]}
                onPress={() => {
                  console.log('Opening start time picker...');
                  setShowStartTimePicker(true);
                }}
              >
                <Text style={[styles.dateButtonText, !startTime && styles.placeholderText]}>
                  {startTime ? `🕐 ${formatTime(startTime)}` : 'Tap to Select Start Time'}
                </Text>
              </TouchableOpacity>
              {showStartTimePicker && (
                <DateTimePicker
                  value={startTime || new Date()}
                  mode="time"
                  display="default"
                  is24Hour={true}
                  onChange={(event, selectedTime) => {
                    console.log('Start time picker onChange - event.type:', event.type);
                    setShowStartTimePicker(false);
                    
                    if (event.type === 'set' && selectedTime) {
                      setStartTime(selectedTime);
                      console.log('Start time updated to:', formatTime(selectedTime));
                    }
                  }}
                />
              )}
            </>
          )}
        </View>

        {/* End Time */}
        <View style={styles.section}>
          <Text style={styles.label}>End Time *</Text>
          {Platform.OS === 'web' ? (
            <TextInput
              style={styles.input}
              placeholder="Select End Time"
              value={endTime ? formatTime(endTime) : ''}
              onFocus={(e) => {
                e.target.type = 'time';
              }}
              onChange={(e) => {
                const timeStr = e.target.value;
                if (timeStr) {
                  const [hours, minutes] = timeStr.split(':');
                  const newTime = new Date();
                  newTime.setHours(parseInt(hours), parseInt(minutes), 0);
                  setEndTime(newTime);
                  console.log('End time selected:', formatTime(newTime));
                }
              }}
            />
          ) : (
            <>
              <TouchableOpacity
                style={[styles.dateButton, !endTime && styles.dateButtonEmpty]}
                onPress={() => {
                  console.log('Opening end time picker...');
                  setShowEndTimePicker(true);
                }}
              >
                <Text style={[styles.dateButtonText, !endTime && styles.placeholderText]}>
                  {endTime ? `🕐 ${formatTime(endTime)}` : 'Tap to Select End Time'}
                </Text>
              </TouchableOpacity>
              {showEndTimePicker && (
                <DateTimePicker
                  value={endTime || new Date()}
                  mode="time"
                  display="default"
                  is24Hour={true}
                  onChange={(event, selectedTime) => {
                    console.log('End time picker onChange - event.type:', event.type);
                    setShowEndTimePicker(false);
                    
                    if (event.type === 'set' && selectedTime) {
                      setEndTime(selectedTime);
                      console.log('End time updated to:', formatTime(selectedTime));
                    }
                  }}
                />
              )}
            </>
          )}
        </View>

        {/* Select Nanny */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Nanny *</Text>
          {nannies.length === 0 ? (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyText}>No nannies available. Make sure backend is running and nannies are registered.</Text>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedNanny}
                onValueChange={(value) => setSelectedNanny(value)}
                style={styles.picker}
              >
                <Picker.Item label="-- Select a Nanny --" value="" />
                {Array.isArray(nannies) && nannies.map((nanny) => (
                  <Picker.Item
                    key={nanny.nannyId}
                    label={`${nanny.nannyName} ${nanny.nannySurname}`}
                    value={nanny.nannyId.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Select Driver (Optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>Select Driver (Optional)</Text>
          {drivers.length === 0 ? (
            <View style={styles.emptyMessage}>
              <Text style={styles.emptyText}>No drivers available. You can proceed without a driver.</Text>
            </View>
          ) : (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedDriver}
                onValueChange={(value) => setSelectedDriver(value)}
                style={styles.picker}
              >
                <Picker.Item label="-- No Driver --" value="" />
                {Array.isArray(drivers) && drivers.map((driver) => (
                  <Picker.Item
                    key={driver.driverId}
                    label={`${driver.driverName} ${driver.driverSurname}`}
                    value={driver.driverId.toString()}
                  />
                ))}
              </Picker>
            </View>
          )}
        </View>

        {/* Payment Amount */}
        <View style={styles.section}>
          <Text style={styles.label}>Payment Amount (R) *</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter amount"
            keyboardType="decimal-pad"
            value={paymentAmount}
            onChangeText={setPaymentAmount}
          />
        </View>

        {/* Book Button */}
        <TouchableOpacity
          style={[styles.bookButton, loading && styles.bookButtonDisabled]}
          onPress={handleBookSession}
          disabled={loading}
        >
          <Text style={styles.bookButtonText}>
            {loading ? 'Booking...' : 'Book Session'}
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Custom Confirmation Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmationModal}
        onRequestClose={() => setShowConfirmationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Confirm Booking</Text>
            
            {confirmationData && (
              <View style={styles.modalContent}>
                <Text style={styles.modalText}>Please confirm your session booking:</Text>
                
                <View style={styles.confirmationDetails}>
                  <Text style={styles.detailItem}>📅 Date: {confirmationData.date}</Text>
                  <Text style={styles.detailItem}>🕐 Time: {confirmationData.time}</Text>
                  <Text style={styles.detailItem}>👶 Children: {confirmationData.children}</Text>
                  <Text style={styles.detailItem}>👤 Nanny: {confirmationData.nanny}</Text>
                  <Text style={styles.detailItem}>🚗 Driver: {confirmationData.driver}</Text>
                  <Text style={styles.detailItem}>💰 Payment: R{confirmationData.payment}</Text>
                </View>
                
                <Text style={styles.modalQuestion}>Do you want to proceed with this booking?</Text>
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  console.log('❌ Booking cancelled by user');
                  setShowConfirmationModal(false);
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={proceedWithBooking}
              >
                <Text style={styles.confirmButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    backgroundColor: '#D81B60',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  backButton: {
    marginBottom: 12,
  },
  backButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  addChildButton: {
    backgroundColor: '#34C759',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  addChildButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.1,
  },
  addChildButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  addChildForm: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#34C759',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#34C759',
    marginBottom: 16,
  },
  submitChildButton: {
    backgroundColor: '#34C759',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: '#34C759',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  checkbox: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  checkboxSelected: {
    borderColor: '#D81B60',
    backgroundColor: '#FCE4EC',
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkboxText: {
    fontSize: 15,
    color: '#1F2937',
    flex: 1,
    fontWeight: '500',
  },
  checkmark: {
    fontSize: 22,
    color: '#D81B60',
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  dateButtonEmpty: {
    borderColor: '#D1D5DB',
    borderStyle: 'dashed',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#9CA3AF',
    fontStyle: 'italic',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  picker: {
    height: 50,
    color: '#1F2937',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  bookButton: {
    backgroundColor: '#D81B60',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 40,
    shadowColor: '#D81B60',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  bookButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0.2,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  emptyMessage: {
    backgroundColor: '#FEF3C7',
    padding: 18,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#FCD34D',
  },
  emptyText: {
    fontSize: 14,
    color: '#92400E',
    textAlign: 'center',
    fontWeight: '500',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalContent: {
    marginBottom: 24,
  },
  modalText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '500',
  },
  confirmationDetails: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  detailItem: {
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 8,
    fontWeight: '500',
  },
  modalQuestion: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#E5E7EB',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: '#D81B60',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  requiredField: {
    color: '#DC2626',
    fontWeight: '600',
  },
  selectionSummary: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#34C759',
  },
  selectionText: {
    color: '#166534',
    fontSize: 14,
    fontWeight: '600',
  },
});
