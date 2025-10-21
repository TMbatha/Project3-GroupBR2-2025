import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function DriverTrips() {
  const router = useRouter();
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    getDriverIdAndFetchTrips();
  }, []);

  const getDriverIdAndFetchTrips = async () => {
    try {
      // Get driver ID from AsyncStorage
      const storedDriverId = await AsyncStorage.getItem('userId');
      if (storedDriverId) {
        setDriverId(storedDriverId);
        await fetchAllDriverTrips(storedDriverId);
      } else {
        Alert.alert('Error', 'No driver session found. Please login again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error getting driver ID:', error);
      Alert.alert('Error', 'Could not retrieve driver information');
      setLoading(false);
    }
  };

  const fetchAllDriverTrips = async (id) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      
      // Fetch trips by status
      const [upcomingResponse, activeResponse, completedResponse] = await Promise.all([
        fetch(`${baseUrl}/api/driver/trips/${id}/status/UPCOMING`),
        fetch(`${baseUrl}/api/driver/trips/${id}/status/ACTIVE`),
        fetch(`${baseUrl}/api/driver/trips/${id}/status/COMPLETED`)
      ]);
      
      if (upcomingResponse.ok) {
        const upcoming = await upcomingResponse.json();
        setUpcomingTrips(upcoming);
      }
      
      if (activeResponse.ok) {
        const active = await activeResponse.json();
        setActiveTrips(active);
      }
      
      if (completedResponse.ok) {
        const completed = await completedResponse.json();
        setCompletedTrips(completed);
      }
      
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const activateTrip = async (tripId) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/child-sitting-session/activate/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        Alert.alert('Success', 'Trip started successfully!');
        // Refresh trips
        await fetchAllDriverTrips(driverId);
      } else {
        Alert.alert('Error', result.message || 'Failed to start trip');
      }
    } catch (error) {
      console.error('Error starting trip:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  const completeTrip = async (tripId) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/child-sitting-session/complete/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        Alert.alert('Success', 'Trip completed successfully!');
        // Refresh trips
        await fetchAllDriverTrips(driverId);
      } else {
        Alert.alert('Error', result.message || 'Failed to complete trip');
      }
    } catch (error) {
      console.error('Error completing trip:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D81B60" />
        <Text style={styles.loadingText}>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Trips</Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeTrips.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedTrips.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {renderTripList()}
      </ScrollView>
    </View>
  );

  function renderTripList() {
    let currentTrips = [];
    let emptyMessage = '';
    
    switch (activeTab) {
      case 'upcoming':
        currentTrips = upcomingTrips;
        emptyMessage = 'No upcoming trips';
        break;
      case 'active':
        currentTrips = activeTrips;
        emptyMessage = 'No active trips';
        break;
      case 'completed':
        currentTrips = completedTrips;
        emptyMessage = 'No completed trips';
        break;
    }

    if (currentTrips.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
          <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
        </View>
      );
    }

    return currentTrips.map((trip, index) => (
      <View key={trip.id || index} style={styles.tripCard}>
        <View style={styles.tripHeader}>
          <Text style={styles.tripTitle}>Trip #{trip.id}</Text>
          <Text style={[styles.tripStatus, { 
            color: getStatusColor(trip.status),
            backgroundColor: getStatusBackgroundColor(trip.status)
          }]}>
            {trip.status}
          </Text>
        </View>
        
        <View style={styles.divider} />
        
        <Text style={styles.tripDetail}>📅 Date: {trip.sessionDate}</Text>
        <Text style={styles.tripDetail}>🕐 Start: {trip.startTime}</Text>
        <Text style={styles.tripDetail}>🕐 End: {trip.endTime}</Text>
        
        {trip.nannyName && (
          <Text style={styles.tripDetail}>👤 Nanny: {trip.nannyName}</Text>
        )}
        
        {trip.children && trip.children.length > 0 && (
          <View style={styles.childrenSection}>
            <Text style={styles.childrenLabel}>👶 Children:</Text>
            {trip.children.map((childName, idx) => (
              <Text key={idx} style={styles.childName}>• {childName}</Text>
            ))}
          </View>
        )}
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {activeTab === 'upcoming' && (
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={() => activateTrip(trip.id)}
            >
              <Text style={styles.buttonText}>Start Trip</Text>
            </TouchableOpacity>
          )}
          
          {activeTab === 'active' && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => completeTrip(trip.id)}
            >
              <Text style={styles.buttonText}>Complete Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    ));
  }
}

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'UPCOMING':
      return '#FF9500';
    case 'ACTIVE':
      return '#007AFF';
    case 'COMPLETED':
      return '#34C759';
    case 'CANCELLED':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const getStatusBackgroundColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'UPCOMING':
      return '#FEF3C7';
    case 'ACTIVE':
      return '#DBEAFE';
    case 'COMPLETED':
      return '#D1FAE5';
    case 'CANCELLED':
      return '#FEE2E2';
    default:
      return '#F3F4F6';
  }
};

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  tripDetail: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  tripStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginBottom: 12,
  },
  childrenSection: {
    marginTop: 12,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#D81B60',
  },
  childrenLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  childName: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  // Tab styles
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  activeTab: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#D81B60',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#D81B60',
    fontWeight: 'bold',
  },
  // Action button styles
  actionButtons: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 12,
  },
  activateButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  completeButton: {
    flex: 1,
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
