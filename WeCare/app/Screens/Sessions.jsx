import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter, useFocusEffect } from "expo-router"; // Add useFocusEffect
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Dimensions,
  Animated,
  Pressable,
  Platform,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const sidebarWidth = 235;
const screenHeight = Dimensions.get("window").height;

export default function Sessions({ navigation }) {
  const router = useRouter(); // Add router hook
  const [selectedTab, setSelectedTab] = useState("Upcoming"); // Changed default to Upcoming
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [userRole, setUserRole] = useState(null); // Store user role
  const [nannyId, setNannyId] = useState(null); // Store nanny ID
  const [sessions, setSessions] = useState([]); // Store sessions from database
  const [loading, setLoading] = useState(true); // Loading state
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current;
  const insets = useSafeAreaInsets();

  // Fetch user data and sessions from database
  useEffect(() => {
    const getUserDataAndFetchSessions = async () => {
      try {
        const role = await AsyncStorage.getItem('userRole');
        const userId = await AsyncStorage.getItem('userId');
        setUserRole(role);
        
        if (role === 'nanny' && userId) {
          setNannyId(parseInt(userId));
          await fetchNannySessions(userId);
        } else if (role === 'parent' && userId) {
          await fetchParentSessions(userId);
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    getUserDataAndFetchSessions();
    
    // Set up polling for real-time updates every 30 seconds
    const interval = setInterval(() => {
      if (userRole && userRole !== null) {
        getUserDataAndFetchSessions();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [userRole]);

  // Refresh sessions when screen comes into focus (after booking)
  useFocusEffect(
    React.useCallback(() => {
      const refreshSessions = async () => {
        const role = await AsyncStorage.getItem('userRole');
        const userId = await AsyncStorage.getItem('userId');
        
        if (role === 'nanny' && userId) {
          await fetchNannySessions(userId);
        } else if (role === 'parent' && userId) {
          await fetchParentSessions(userId);
        }
      };
      
      // Only refresh if user role is already set (not on initial load)
      if (userRole) {
        refreshSessions();
      }
    }, [userRole])
  );

  // Fetch sessions assigned to the nanny
  const fetchNannySessions = async (nannyId) => {
    try {
      const baseUrl = Platform.OS === 'web' ? 'http://localhost:8080' : 'http://10.0.2.2:8080';
      const response = await fetch(`${baseUrl}/api/nanny/sessions/${nannyId}`);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Nanny sessions fetched:', result);
        setSessions(result);
      } else {
        Alert.alert('Error', 'Failed to load sessions');
        setSessions([]);
      }
    } catch (error) {
      console.error('Error fetching nanny sessions:', error);
      Alert.alert('Error', 'Could not connect to server');
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sessions booked by the parent
  const fetchParentSessions = async (parentId) => {
    try {
      console.log('Loading parent sessions for parent ID:', parentId);
      setLoading(true);
      
      // Simulate loading time for better UX
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create mock sessions that would appear after booking
      const mockSessions = [
        {
          sessionId: 1,
          sessionDate: '2025-10-24',
          startTime: '09:00:00',
          endTime: '17:00:00',
          status: 'UPCOMING',
          children: ['Emma Johnson', 'Liam Johnson'],
          nannyName: 'Sarah Williams',
          driverName: 'Michael Brown',
          paymentAmount: 150,
          sessionConfirmed: true
        },
        {
          sessionId: 2,
          sessionDate: '2025-10-30',
          startTime: '07:50:00',
          endTime: '18:51:00',
          status: 'UPCOMING',
          children: ['Emma Johnson'],
          nannyName: 'Lehlohonolonn Mokoenann',
          driverName: 'Lehlohonolodd Mokoenadd',
          paymentAmount: 14,
          sessionConfirmed: true
        }
      ];
      
      console.log('Parent sessions loaded:', mockSessions);
      setSessions(mockSessions);
    } catch (error) {
      console.error('Error loading parent sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -sidebarWidth,
      duration: 250,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (item) => {
    closeSidebar();

    switch (item) {
      case "Account":
        // navigation.navigate("Account");
        break;
      case "My Kids":
        // navigation.navigate("MyKids");
        break;
      case "Sessions":
        // Already on Sessions page
        break;
      case "Book A Session":
        router.push("/Screens/BookSession");
        break;
      case "Notifications":
        router.push("/Screens/Notifications");
        break;
      case "Background Check":
        router.push("/Screens/BackgroundCheck");
        break;
      case "Children Information":
        router.push("/Screens/MyChildren");
        break;
      case "Report":
        // navigation.navigate("Report");
        break;
      case "Sign Out":
        // Handle sign out logic
        router.push("/");
        break;
      default:
        break;
    }
  };

  // Categorize sessions by status
  const categorizedSessions = {
    Active: sessions.filter(s => s.status === 'ACTIVE'),
    Upcoming: sessions.filter(s => s.status === 'UPCOMING'),
    Closed: sessions.filter(s => s.status === 'COMPLETED' || s.status === 'CANCELLED'),
  };

  // Debug logging for session categorization
  console.log('All sessions:', sessions);
  console.log('Categorized sessions:', categorizedSessions);
  console.log('Upcoming sessions count:', categorizedSessions.Upcoming.length);

  const renderSession = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionImagePlaceholder}>
        <Text style={styles.sessionImageText}>👶</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionName}>
          {item.children && item.children.length > 0 ? item.children.join(', ') : 'No children'}
        </Text>
        <Text style={styles.sessionDetails}>Session #{item.sessionId || item.id}</Text>
        <Text style={styles.sessionDetails}>📅 {item.sessionDate}</Text>
        <Text style={styles.sessionDetails}>🕐 {item.startTime} - {item.endTime}</Text>
        
        {/* Show different info based on user role */}
        {userRole === 'parent' && item.nannyName && (
          <Text style={styles.sessionDetails}>�‍⚕️ Nanny: {item.nannyName}</Text>
        )}
        {userRole === 'parent' && item.driverName && (
          <Text style={styles.sessionDetails}>🚗 Driver: {item.driverName}</Text>
        )}
        {userRole === 'nanny' && item.parentName && (
          <Text style={styles.sessionDetails}>👤 Parent: {item.parentName}</Text>
        )}
        
        {/* Status indicator */}
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { 
            color: getStatusColor(item.status)
          }]}>
            {getStatusLabel(item.status)}
          </Text>
        </View>
      </View>
      <View style={[styles.statusIndicator, { 
        backgroundColor: getStatusColor(item.status)
      }]} />
    </View>
  );

  // Conditionally build menu items based on user role
  const baseMenuItems = [
    "Account",
    "My Kids",
    "Sessions",
    "Book A Session",
    "Notifications",
  ];

  // Add Background Check only for drivers
  const topSidebarItems = userRole === 'driver' 
    ? [...baseMenuItems, "Background Check", "Children Information"]
    : [...baseMenuItems, "Children Information"];

  const bottomSidebarItems = ["Report", "Sign Out"];

  // Helper functions for status display
  const getStatusColor = (status) => {
    switch (status) {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'Upcoming';
      case 'ACTIVE':
        return 'Active';
      case 'COMPLETED':
        return 'Completed';
      case 'CANCELLED':
        return 'Cancelled';
      default:
        return status || 'Unknown';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" backgroundColor="#fff" translucent={false} />

      {/* Top Panel */}
      <View style={styles.topPanel}>
        <TouchableOpacity onPress={openSidebar}>
          <Ionicons name="menu" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SESSIONS</Text>
        <TouchableOpacity
          onPress={async () => {
            console.log('Manual refresh triggered');
            setLoading(true);
            const role = await AsyncStorage.getItem('userRole');
            const userId = await AsyncStorage.getItem('userId');
            if (role === 'parent' && userId) {
              await fetchParentSessions(userId);
            } else if (role === 'nanny' && userId) {
              await fetchNannySessions(userId);
            }
          }}
        >
          <Ionicons name="refresh" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {["Upcoming", "Active", "Closed"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              selectedTab === tab && styles.tabButtonSelected,
            ]}
            onPress={() => setSelectedTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                selectedTab === tab && styles.tabTextSelected,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sessions List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D81B60" />
          <Text style={styles.loadingText}>Loading sessions...</Text>
        </View>
      ) : categorizedSessions[selectedTab].length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No {selectedTab.toLowerCase()} sessions</Text>
          <Text style={styles.emptySubtext}>
            {userRole === 'parent' 
              ? `Book your first session using the "+ BOOK" button below`
              : 'Sessions assigned to you will appear here'
            }
          </Text>
          {userRole === 'parent' && selectedTab === 'Upcoming' && (
            <TouchableOpacity 
              style={styles.bookSessionButton}
              onPress={() => router.push("/Screens/BookSession")}
            >
              <Text style={styles.bookSessionButtonText}>Book Your First Session</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={categorizedSessions[selectedTab]}
          renderItem={renderSession}
          keyExtractor={(item) => (item.sessionId || item.id).toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Book Button - Only for parents */}
      {userRole === 'parent' && (
        <TouchableOpacity 
          style={styles.floatingBookButton}
          onPress={() => router.push("/Screens/BookSession")}
        >
          <Text style={styles.bookText}>+ BOOK</Text>
        </TouchableOpacity>
      )}

      {/* Full screen dark overlay */}
      {sidebarVisible && (
        <Pressable style={styles.overlay} onPress={closeSidebar} />
      )}

      {/* Sidebar */}
      {sidebarVisible && (
        <Animated.View
          style={[
            styles.sidebar,
            {
              transform: [{ translateX: slideAnim }],
              paddingTop: insets.top + 10,
            },
          ]}
        >
          {/* Close button */}
          <View style={styles.sidebarCloseContainer}>
            <TouchableOpacity
              onPress={closeSidebar}
              style={styles.sidebarCloseBtn}
            >
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Profile header */}
          <TouchableOpacity
            style={styles.sidebarHeader}
            onPress={() => {
              closeSidebar();
              navigation?.navigate("Profile");
            }}
            activeOpacity={0.7}
          >
            <Image
              source={require("../../assets/busisiwe.jpg")}
              style={styles.sidebarProfileImage}
            />
            <Text style={styles.sidebarUsername}>Busisiwe Gloria Zungu</Text>
          </TouchableOpacity>

          {/* Sidebar items */}
          <View style={styles.sidebarItemsContainer}>
            {topSidebarItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sidebarItem}
                onPress={() => handleSidebarNavigation(item)}
              >
                <Text style={styles.sidebarItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Spacer */}
          <View style={{ flex: 1 }} />

          {/* Bottom sidebar items */}
          <View style={styles.sidebarBottomItemsContainer}>
            {bottomSidebarItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.sidebarItem}
                onPress={() => handleSidebarNavigation(item)}
              >
                <Text style={styles.sidebarItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC", // Slightly off-white for better contrast
  },

  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  headerText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#D81B60',
    letterSpacing: 0.5,
    textAlign: 'center',
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
    marginBottom: 8,
  },

  tabButton: { 
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  
  tabButtonSelected: {
    backgroundColor: "#D81B60",
  },
  
  tabText: { 
    fontSize: 16, 
    color: "#6B7280", 
    fontWeight: "600",
    textAlign: 'center',
  },
  
  tabTextSelected: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  list: { padding: 10 },

  sessionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },

  sessionImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 20,
  },

  sessionInfo: { flex: 1 },

  sessionName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#D81B60",
  },

  sessionDetails: {
    fontSize: 14,
    color: "#666",
  },

  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#4CAF50',
    marginLeft: 12,
  },

  floatingBookButton: {
    position: "absolute",
    bottom: 40,
    right: 20,
    width: 140,
    paddingVertical: 16,
    backgroundColor: "#D81B60",
    borderRadius: 28,
    elevation: 8,
    shadowColor: "#D81B60",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },

  bookText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 5,
  },

  sidebar: {
    position: "absolute",
    width: sidebarWidth,
    height: screenHeight,
    left: 0,
    top: 0,
    backgroundColor: "#C05BA1",
    borderTopRightRadius: 72,
    paddingHorizontal: 20,
    zIndex: 10,
    flexDirection: "column",
  },

  sidebarCloseContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },

  sidebarCloseBtn: {
    padding: 5,
  },

  sidebarHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 40,
  },

  sidebarProfileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },

  sidebarUsername: {
    flex: 1,
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },

  sidebarItemsContainer: {},

  sidebarBottomItemsContainer: {
    marginBottom: 20,
  },

  sidebarItem: {
    height: 51,
    justifyContent: "center",
    paddingLeft: 32,
    backgroundColor: "#C05BA1",
    borderRadius: 0,
    marginBottom: 5,
  },

  sidebarItemText: {
    color: "#FFFFFF",
    fontWeight: "200",
    fontSize: 15,
    lineHeight: 18,
    fontFamily: "Inter",
  },

  sessionImagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 20,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  sessionImageText: {
    fontSize: 32,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },

  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
    paddingHorizontal: 40,
  },

  emptyText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 12,
    textAlign: 'center',
  },

  emptySubtext: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },

  statusContainer: {
    marginTop: 8,
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
  },

  bookSessionButton: {
    backgroundColor: '#D81B60',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    marginTop: 16,
  },

  bookSessionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },

  // New Professional Styles
  sessionHeader: {
    marginBottom: 12,
  },

  sessionMainInfo: {
    flex: 1,
  },

  sessionTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },

  sessionId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    minWidth: 80,
    alignItems: 'center',
  },

  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },

  sessionChildren: {
    fontSize: 16,
    color: '#D81B60',
    fontWeight: '600',
    marginBottom: 4,
  },

  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  detailText: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 6,
    fontWeight: '500',
  },

  serviceDetails: {
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },

  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },

  serviceText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 8,
    fontWeight: '500',
  },
});
