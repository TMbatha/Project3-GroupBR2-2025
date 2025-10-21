import React, { useState, useRef, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router"; // Add this import
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
  const [selectedTab, setSelectedTab] = useState("Active");
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
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    getUserDataAndFetchSessions();
  }, []);

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
        // navigation.navigate("BookSession");
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

  // Categorize sessions by status/date
  const categorizedSessions = {
    Active: sessions.filter(s => s.status === 'Confirmed' && new Date(s.sessionDate) >= new Date()),
    Upcoming: sessions.filter(s => s.status === 'Pending'),
    Closed: sessions.filter(s => new Date(s.sessionDate) < new Date() && s.status === 'Confirmed'),
  };

  const renderSession = ({ item }) => (
    <View style={styles.sessionCard}>
      <View style={styles.sessionImagePlaceholder}>
        <Text style={styles.sessionImageText}>👶</Text>
      </View>
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionName}>
          {item.children && item.children.length > 0 ? item.children.join(', ') : 'No children'}
        </Text>
        <Text style={styles.sessionDetails}>Session #{item.id}</Text>
        <Text style={styles.sessionDetails}>📅 {item.sessionDate}</Text>
        <Text style={styles.sessionDetails}>🕐 {item.startTime} - {item.endTime}</Text>
        {item.parentName && (
          <Text style={styles.sessionDetails}>👤 Parent: {item.parentName}</Text>
        )}
        {item.driverName && (
          <Text style={styles.sessionDetails}>🚗 Driver: {item.driverName}</Text>
        )}
      </View>
      <View style={[styles.statusIndicator, { 
        backgroundColor: item.status === 'Confirmed' ? '#4CAF50' : '#FF9500' 
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
          onPress={() => router.push("/Screens/BackgroundCheck")}
        >
          <Ionicons name="notifications" size={28} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {["Active", "Upcoming", "Closed"].map((tab) => (
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
          <Text style={styles.emptySubtext}>Sessions assigned to you will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={categorizedSessions[selectedTab]}
          renderItem={renderSession}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
        />
      )}

      {/* Floating Book Button */}
      <TouchableOpacity 
        style={styles.floatingBookButton}
        onPress={() => router.push("/Screens/BookSession")}
      >
        <Text style={styles.bookText}>+ BOOK</Text>
      </TouchableOpacity>

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
    backgroundColor: "#fff", // must be white to match top system UI
  },

  topPanel: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  headerText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#D81B60',
    letterSpacing: 0.5,
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  tabButton: { padding: 10 },
  tabButtonSelected: {
    borderBottomWidth: 3,
    borderBottomColor: "#D81B60",
  },
  tabText: { fontSize: 16, color: "#666", fontWeight: "600" },
  tabTextSelected: {
    color: "#D81B60",
    fontWeight: "bold",
  },

  list: { padding: 10 },

  sessionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
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
    left: "50%",
    width: 120,
    paddingVertical: 12,
    backgroundColor: "#D81B60",
    borderRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -60 }],
    zIndex: 10,
  },

  bookText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
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
    textAlign: 'center',
  },
});
