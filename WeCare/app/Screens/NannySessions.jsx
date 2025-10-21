import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function NannySessions() {
  const router = useRouter();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nannyId, setNannyId] = useState(null);

  useEffect(() => {
    getNannyIdAndFetchSessions();
  }, []);

  const getNannyIdAndFetchSessions = async () => {
    try {
      // Get nanny ID from AsyncStorage
      const storedNannyId = await AsyncStorage.getItem('userId');
      if (storedNannyId) {
        setNannyId(storedNannyId);
        await fetchNannySessions(storedNannyId);
      } else {
        Alert.alert('Error', 'No nanny session found. Please login again.');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error getting nanny ID:', error);
      Alert.alert('Error', 'Could not retrieve nanny information');
      setLoading(false);
    }
  };

  const fetchNannySessions = async (id) => {
    try {
      // Use correct URL based on platform
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/nanny/sessions/${id}`);
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
        <ActivityIndicator size="large" color="#D81B60" />
        <Text style={styles.loadingText}>Loading your sessions...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Assigned Sessions</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {sessions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No sessions assigned yet</Text>
            <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
          </View>
        ) : (
          sessions.map((session, index) => (
            <View key={session.id || index} style={styles.sessionCard}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionTitle}>Session #{session.id}</Text>
                <Text style={[styles.sessionStatus, { color: getStatusColor(session.status) }]}>
                  {session.status}
                </Text>
              </View>
              
              <View style={styles.divider} />
              
              <Text style={styles.sessionDetail}>📅 Date: {session.sessionDate}</Text>
              <Text style={styles.sessionDetail}>🕐 Start: {session.startTime}</Text>
              <Text style={styles.sessionDetail}>🕐 End: {session.endTime}</Text>
              
              {session.driverName && (
                <Text style={styles.sessionDetail}>🚗 Driver: {session.driverName}</Text>
              )}
              
              {session.children && session.children.length > 0 && (
                <View style={styles.childrenSection}>
                  <Text style={styles.childrenLabel}>👶 Children:</Text>
                  {session.children.map((childName, idx) => (
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
  sessionCard: {
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
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sessionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  sessionDetail: {
    fontSize: 15,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  sessionStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
