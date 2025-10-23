import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, Platform, RefreshControl } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function AdminDashboard() {
  const router = useRouter();
  const [adminName, setAdminName] = useState('');
  const [stats, setStats] = useState({});
  const [sessions, setSessions] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [nannies, setNannies] = useState([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [deletingItems, setDeletingItems] = useState({});

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    try {
      const userType = await AsyncStorage.getItem('userType');
      const adminFullName = await AsyncStorage.getItem('adminFullName');
      
      if (userType !== 'admin') {
        Alert.alert('Access Denied', 'You must be logged in as an administrator to access this page.');
        router.push('/');
        return;
      }
      
      setAdminName(adminFullName || 'Administrator');
      await fetchAllData();
    } catch (error) {
      console.error('Auth check error:', error);
      router.push('/');
    }
  };

  const fetchAllData = async () => {
    try {
      await Promise.all([
        fetchDashboardStats(),
        fetchSessions(),
        fetchDrivers(),
        fetchNannies()
      ]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/admin/dashboard/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchSessions = async () => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/admin/sessions`);
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  const fetchDrivers = async () => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/admin/drivers`);
      if (response.ok) {
        const data = await response.json();
        setDrivers(data);
      }
    } catch (error) {
      console.error('Error fetching drivers:', error);
    }
  };

  const fetchNannies = async () => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/admin/nannies`);
      if (response.ok) {
        const data = await response.json();
        setNannies(data);
      }
    } catch (error) {
      console.error('Error fetching nannies:', error);
    }
  };

  const deleteSession = async (sessionId) => {
    Alert.alert(
      'Delete Session',
      'Are you sure you want to delete this session? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingItems(prev => ({ ...prev, [`session-${sessionId}`]: true }));
            try {
              const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
              const response = await fetch(`${baseUrl}/api/admin/sessions/${sessionId}`, {
                method: 'DELETE',
              });
              
              const result = await response.json();
              if (response.ok && result.success) {
                Alert.alert('Success', 'Session deleted successfully');
                await fetchSessions();
                await fetchDashboardStats();
              } else {
                Alert.alert('Error', result.message || 'Failed to delete session');
              }
            } catch (error) {
              console.error('Error deleting session:', error);
              Alert.alert('Error', 'Could not connect to server');
            } finally {
              setDeletingItems(prev => ({ ...prev, [`session-${sessionId}`]: false }));
            }
          }
        }
      ]
    );
  };

  const deleteDriver = async (driverId) => {
    Alert.alert(
      'Delete Driver',
      'Are you sure you want to delete this driver? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingItems(prev => ({ ...prev, [`driver-${driverId}`]: true }));
            try {
              const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
              const response = await fetch(`${baseUrl}/api/admin/drivers/${driverId}`, {
                method: 'DELETE',
              });
              
              const result = await response.json();
              if (response.ok && result.success) {
                Alert.alert('Success', 'Driver deleted successfully');
                await fetchDrivers();
                await fetchDashboardStats();
              } else {
                Alert.alert('Error', result.message || 'Failed to delete driver');
              }
            } catch (error) {
              console.error('Error deleting driver:', error);
              Alert.alert('Error', 'Could not connect to server');
            } finally {
              setDeletingItems(prev => ({ ...prev, [`driver-${driverId}`]: false }));
            }
          }
        }
      ]
    );
  };

  const deleteNanny = async (nannyId) => {
    Alert.alert(
      'Delete Nanny',
      'Are you sure you want to delete this nanny? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setDeletingItems(prev => ({ ...prev, [`nanny-${nannyId}`]: true }));
            try {
              const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
              const response = await fetch(`${baseUrl}/api/admin/nannies/${nannyId}`, {
                method: 'DELETE',
              });
              
              const result = await response.json();
              if (response.ok && result.success) {
                Alert.alert('Success', 'Nanny deleted successfully');
                await fetchNannies();
                await fetchDashboardStats();
              } else {
                Alert.alert('Error', result.message || 'Failed to delete nanny');
              }
            } catch (error) {
              console.error('Error deleting nanny:', error);
              Alert.alert('Error', 'Could not connect to server');
            } finally {
              setDeletingItems(prev => ({ ...prev, [`nanny-${nannyId}`]: false }));
            }
          }
        }
      ]
    );
  };

  const logout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          onPress: async () => {
            await AsyncStorage.removeItem('adminId');
            await AsyncStorage.removeItem('adminUsername');
            await AsyncStorage.removeItem('adminFullName');
            await AsyncStorage.removeItem('userType');
            router.push('/');
          }
        }
      ]
    );
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllData();
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1F2937" />
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Admin Dashboard</Text>
          <Text style={styles.headerSubtitle}>Welcome, {adminName}</Text>
        </View>
        <TouchableOpacity onPress={logout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'dashboard' && styles.activeTab]}
          onPress={() => setActiveTab('dashboard')}
        >
          <Text style={[styles.tabText, activeTab === 'dashboard' && styles.activeTabText]}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'sessions' && styles.activeTab]}
          onPress={() => setActiveTab('sessions')}
        >
          <Text style={[styles.tabText, activeTab === 'sessions' && styles.activeTabText]}>Sessions</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'drivers' && styles.activeTab]}
          onPress={() => setActiveTab('drivers')}
        >
          <Text style={[styles.tabText, activeTab === 'drivers' && styles.activeTabText]}>Drivers</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'nannies' && styles.activeTab]}
          onPress={() => setActiveTab('nannies')}
        >
          <Text style={[styles.tabText, activeTab === 'nannies' && styles.activeTabText]}>Nannies</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {activeTab === 'dashboard' && (
          <View style={styles.dashboardContent}>
            <Text style={styles.sectionTitle}>System Overview</Text>
            <View style={styles.statsGrid}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalSessions || 0}</Text>
                <Text style={styles.statLabel}>Total Sessions</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalDrivers || 0}</Text>
                <Text style={styles.statLabel}>Total Drivers</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{stats.totalNannies || 0}</Text>
                <Text style={styles.statLabel}>Total Nannies</Text>
              </View>
            </View>
            
            <Text style={styles.sectionTitle}>Session Status</Text>
            <View style={styles.statusGrid}>
              <View style={[styles.statusCard, { backgroundColor: '#FEF3C7' }]}>
                <Text style={[styles.statusNumber, { color: '#D97706' }]}>{stats.upcomingSessions || 0}</Text>
                <Text style={[styles.statusLabel, { color: '#D97706' }]}>Upcoming</Text>
              </View>
              <View style={[styles.statusCard, { backgroundColor: '#DBEAFE' }]}>
                <Text style={[styles.statusNumber, { color: '#2563EB' }]}>{stats.activeSessions || 0}</Text>
                <Text style={[styles.statusLabel, { color: '#2563EB' }]}>Active</Text>
              </View>
              <View style={[styles.statusCard, { backgroundColor: '#D1FAE5' }]}>
                <Text style={[styles.statusNumber, { color: '#059669' }]}>{stats.completedSessions || 0}</Text>
                <Text style={[styles.statusLabel, { color: '#059669' }]}>Completed</Text>
              </View>
            </View>
          </View>
        )}

        {activeTab === 'sessions' && (
          <View style={styles.listContent}>
            <Text style={styles.sectionTitle}>Manage Sessions ({sessions.length})</Text>
            {sessions.map((session) => (
              <View key={session.sessionId} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>Session #{session.sessionId}</Text>
                  <View style={styles.itemActions}>
                    <Text style={[styles.statusBadge, { backgroundColor: getStatusColor(session.status) }]}>
                      {session.status}
                    </Text>
                    <TouchableOpacity
                      style={[styles.deleteButton, deletingItems[`session-${session.sessionId}`] && styles.buttonDisabled]}
                      onPress={() => deleteSession(session.sessionId)}
                      disabled={deletingItems[`session-${session.sessionId}`]}
                    >
                      {deletingItems[`session-${session.sessionId}`] ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.deleteButtonText}>Delete</Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.itemDetail}>📅 {session.sessionDate}</Text>
                <Text style={styles.itemDetail}>🕐 {session.startTime} - {session.endTime}</Text>
                {session.nannyName && <Text style={styles.itemDetail}>👩‍⚕️ {session.nannyName}</Text>}
                {session.driverName && <Text style={styles.itemDetail}>🚗 {session.driverName}</Text>}
                <Text style={styles.itemDetail}>👶 Children: {session.childrenCount}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'drivers' && (
          <View style={styles.listContent}>
            <Text style={styles.sectionTitle}>Manage Drivers ({drivers.length})</Text>
            {drivers.map((driver) => (
              <View key={driver.driverId} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{driver.driverName} {driver.driverSurname}</Text>
                  <TouchableOpacity
                    style={[styles.deleteButton, deletingItems[`driver-${driver.driverId}`] && styles.buttonDisabled]}
                    onPress={() => deleteDriver(driver.driverId)}
                    disabled={deletingItems[`driver-${driver.driverId}`]}
                  >
                    {deletingItems[`driver-${driver.driverId}`] ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemDetail}>📧 {driver.email}</Text>
                <Text style={styles.itemDetail}>🆔 Driver ID: {driver.driverId}</Text>
              </View>
            ))}
          </View>
        )}

        {activeTab === 'nannies' && (
          <View style={styles.listContent}>
            <Text style={styles.sectionTitle}>Manage Nannies ({nannies.length})</Text>
            {nannies.map((nanny) => (
              <View key={nanny.nannyId} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle}>{nanny.nannyName} {nanny.nannySurname}</Text>
                  <TouchableOpacity
                    style={[styles.deleteButton, deletingItems[`nanny-${nanny.nannyId}`] && styles.buttonDisabled]}
                    onPress={() => deleteNanny(nanny.nannyId)}
                    disabled={deletingItems[`nanny-${nanny.nannyId}`]}
                  >
                    {deletingItems[`nanny-${nanny.nannyId}`] ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={styles.deleteButtonText}>Delete</Text>
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemDetail}>📧 {nanny.email}</Text>
                <Text style={styles.itemDetail}>� Contacts: {nanny.contactsCount || 0}</Text>
                <Text style={styles.itemDetail}>⭐ Reviews: {nanny.reviewsCount || 0}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'UPCOMING': return '#F59E0B';
    case 'ACTIVE': return '#3B82F6';
    case 'COMPLETED': return '#10B981';
    default: return '#6B7280';
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#1F2937',
    paddingTop: 60,
    paddingBottom: 24,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#D1D5DB',
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
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
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: '#1F2937',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  activeTabText: {
    color: '#1F2937',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  statusGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statusCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statusNumber: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statusLabel: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    flex: 1,
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  itemDetail: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  dashboardContent: {
    paddingBottom: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
});