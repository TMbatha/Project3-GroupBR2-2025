import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

export default function DriverTrips() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDriverTrips();
  }, []);

  const fetchDriverTrips = async () => {
    try {
      // TODO: Replace with actual driver ID from login session
      const driverId = 1; // You'll need to store this from login
      
      const response = await fetch(`http://10.0.2.2:8080/api/driver/trips/${driverId}`);
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
              <Text style={styles.tripTitle}>Trip #{trip.id}</Text>
              <Text style={styles.tripDetail}>Pickup: {trip.pickupLocation}</Text>
              <Text style={styles.tripDetail}>Dropoff: {trip.dropoffLocation}</Text>
              <Text style={styles.tripDetail}>Time: {trip.scheduledTime}</Text>
              <Text style={[styles.tripStatus, { color: getStatusColor(trip.status) }]}>
                Status: {trip.status}
              </Text>
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
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tripTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  tripDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  tripStatus: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 8,
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
