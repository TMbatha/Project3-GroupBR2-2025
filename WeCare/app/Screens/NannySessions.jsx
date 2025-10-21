import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert, Platform, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function NannySessions() {
  const router = useRouter();
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [completedSessions, setCompletedSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [nannyId, setNannyId] = useState(null);
  const [activeTab, setActiveTab] = useState('upcoming');

  useEffect(() => {
    getNannyIdAndFetchSessions();
  }, []);

  const getNannyIdAndFetchSessions = async () => {
    try {
      // Get nanny ID from AsyncStorage
      const storedNannyId = await AsyncStorage.getItem('userId');
      if (storedNannyId) {
        setNannyId(storedNannyId);
        await fetchAllNannySessions(storedNannyId);
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

  const fetchAllNannySessions = async (id) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      
      // Fetch sessions by status
      const [upcomingResponse, activeResponse, completedResponse] = await Promise.all([
        fetch(`${baseUrl}/api/nanny/sessions/${id}/status/UPCOMING`),
        fetch(`${baseUrl}/api/nanny/sessions/${id}/status/ACTIVE`),
        fetch(`${baseUrl}/api/nanny/sessions/${id}/status/COMPLETED`)
      ]);
      
      if (upcomingResponse.ok) {
        const upcoming = await upcomingResponse.json();
        setUpcomingSessions(upcoming);
      }
      
      if (activeResponse.ok) {
        const active = await activeResponse.json();
        setActiveSessions(active);
      }
      
      if (completedResponse.ok) {
        const completed = await completedResponse.json();
        setCompletedSessions(completed);
      }
      
    } catch (error) {
      console.error('Error fetching sessions:', error);
      Alert.alert('Error', 'Could not connect to server');
    } finally {
      setLoading(false);
    }
  };

  const activateSession = async (sessionId) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/child-sitting-session/activate/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        Alert.alert('Success', 'Session activated successfully!');
        // Refresh sessions
        await fetchAllNannySessions(nannyId);
      } else {
        Alert.alert('Error', result.message || 'Failed to activate session');
      }
    } catch (error) {
      console.error('Error activating session:', error);
      Alert.alert('Error', 'Could not connect to server');
    }
  };

  const completeSession = async (sessionId) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/child-sitting-session/complete/${sessionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const result = await response.json();
      
      if (response.ok && result.success) {
        Alert.alert('Success', 'Session completed successfully!');
        // Refresh sessions
        await fetchAllNannySessions(nannyId);
      } else {
        Alert.alert('Error', result.message || 'Failed to complete session');
      }
    } catch (error) {
      console.error('Error completing session:', error);
      Alert.alert('Error', 'Could not connect to server');
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
        <Text style={styles.headerTitle}>My Sessions</Text>
      </View>
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'upcoming' && styles.activeTab]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming ({upcomingSessions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'active' && styles.activeTab]}
          onPress={() => setActiveTab('active')}
        >
          <Text style={[styles.tabText, activeTab === 'active' && styles.activeTabText]}>
            Active ({activeSessions.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'completed' && styles.activeTab]}
          onPress={() => setActiveTab('completed')}
        >
          <Text style={[styles.tabText, activeTab === 'completed' && styles.activeTabText]}>
            Completed ({completedSessions.length})
          </Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollView}>
        {renderSessionList()}
      </ScrollView>
    </View>
  );

  function renderSessionList() {
    let currentSessions = [];
    let emptyMessage = '';
    
    switch (activeTab) {
      case 'upcoming':
        currentSessions = upcomingSessions;
        emptyMessage = 'No upcoming sessions';
        break;
      case 'active':
        currentSessions = activeSessions;
        emptyMessage = 'No active sessions';
        break;
      case 'completed':
        currentSessions = completedSessions;
        emptyMessage = 'No completed sessions';
        break;
    }

    if (currentSessions.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>{emptyMessage}</Text>
          <Text style={styles.emptySubtext}>Check back later for new assignments</Text>
        </View>
      );
    }

    return currentSessions.map((session, index) => (
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
        
        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          {activeTab === 'upcoming' && (
            <TouchableOpacity 
              style={styles.activateButton}
              onPress={() => activateSession(session.id)}
            >
              <Text style={styles.buttonText}>Start Session</Text>
            </TouchableOpacity>
          )}
          
          {activeTab === 'active' && (
            <TouchableOpacity 
              style={styles.completeButton}
              onPress={() => completeSession(session.id)}
            >
              <Text style={styles.buttonText}>Complete Session</Text>
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
