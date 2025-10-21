import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';

export default function NannySessions() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNannySessions();
  }, []);

  const fetchNannySessions = async () => {
    try {
      // TODO: Replace with actual nanny ID from login session
      const nannyId = 1; // You'll need to store this from login
      
      const response = await fetch(`http://10.0.2.2:8080/api/nanny/sessions/${nannyId}`);
      const result = await response.json();
      
      if (response.ok) {
        setSessions(result);
      } else {
        Alert.alert('Error', 'Failed to load sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading your sessions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>My Assigned Sessions</Text>
      
      <ScrollView style={styles.scrollView}>
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions assigned yet</Text>
            <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
          </View>
        ) : (
          sessions.map((session, index) => (
            <View key={index} style={styles.sessionCard}>
              <Text style={styles.sessionTitle}>Session #{session.id}</Text>
              <Text style={styles.sessionDetail}>Child: {session.childName}</Text>
              <Text style={styles.sessionDetail}>Date: {session.sessionDate}</Text>
              <Text style={styles.sessionDetail}>Time: {session.startTime} - {session.endTime}</Text>
              <Text style={styles.sessionDetail}>Location: {session.location}</Text>
              <Text style={[styles.sessionStatus, { color: getStatusColor(session.status) }]}>
                Status: {session.status}
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
    case 'scheduled':
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
  sessionCard: {
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
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  sessionDetail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  sessionStatus: {
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
