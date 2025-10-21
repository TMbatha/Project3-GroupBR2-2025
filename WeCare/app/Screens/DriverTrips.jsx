import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function DriverTrips() {
  const router = useRouter();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [driverId, setDriverId] = useState(null);

  useEffect(() => {
    getDriverIdAndFetchTrips();
  }, []);

  const getDriverIdAndFetchTrips = async () => {
    try {
      // Get driver ID from AsyncStorage
      const storedDriverId = await AsyncStorage.getItem('userId');
      if (storedDriverId) {
        setDriverId(storedDriverId);
        await fetchDriverTrips(storedDriverId);
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

  const fetchDriverTrips = async (id) => {
    try {
      // Use correct URL based on platform
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/driver/trips/${id}`);
      const result = await response.json();
      
      if (response.ok) {
        setTrips(result);
      } else {
        Alert.alert('Error', 'Failed to load trips');
      }
    } catch (error) {
      console.error('Error fetching trips:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
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
        <Text style={styles.headerTitle}>My Assigned Trips</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips assigned yet</Text>
            <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
          </View>
        ) : (
          trips.map((trip, index) => (
            <View key={trip.id || index} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripTitle}>Session #{trip.id}</Text>
                <Text style={[styles.tripStatus, { 
                  color: getStatusColor(trip.status),
                  backgroundColor: getStatusBackgroundColor(trip.status)
                }]}>
                  {trip.status}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.tripDetail}>📅 Date: {trip.sessionDate}</Text>
              <Text style={styles.tripDetail}>🕐 Start Time: {trip.startTime}</Text>
              <Text style={styles.tripDetail}>🕐 End Time: {trip.endTime}</Text>
              
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
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '#D97706';
    case 'confirmed':
      return '#059669';
    case 'in-progress':
      return '#2563EB';
    case 'completed':
      return '#059669';
    case 'cancelled':
      return '#DC2626';
    default:
      return '#6B7280';
  }
};

const getStatusBackgroundColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending':
      return '#FEF3C7';
    case 'confirmed':
      return '#D1FAE5';
    case 'in-progress':
      return '#DBEAFE';
    case 'completed':
      return '#D1FAE5';
    case 'cancelled':
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
});
