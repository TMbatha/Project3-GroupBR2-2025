import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function DriverTrips() {
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
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your trips...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Assigned Trips</Text>
      
      <ScrollView style={styles.scrollView}>
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No trips assigned yet</Text>
            <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
          </View>
        ) : (
          trips.map((trip, index) => (
            <View key={index} style={styles.tripCard}>
              <View style={styles.tripHeader}>
                <Text style={styles.tripTitle}>Session #{trip.id}</Text>
                <Text style={[styles.tripStatus, { color: getStatusColor(trip.status) }]}>
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
      return '#FF9500';
    case 'confirmed':
      return '#34C759';
    case 'in-progress':
      return '#007AFF';
    case 'completed':
      return '#34C759';
    case 'cancelled':
      return '#FF3B30';
    default:
      return '#8E8E93';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
    padding: 20,
    paddingTop: 60,
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  tripCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#000',
  },
  tripDetail: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  tripStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5E5',
    marginBottom: 12,
  },
  childrenSection: {
    marginTop: 8,
    padding: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  childrenLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  childName: {
    fontSize: 14,
    color: '#666',
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
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
