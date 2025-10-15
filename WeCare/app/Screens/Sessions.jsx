import React, { useState, useRef } from "react";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router"; // Add this import
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const sidebarWidth = 235;
const screenHeight = Dimensions.get("window").height;
const router = useRouter();

const sessionsData = {
  Active: [
    {
      id: "1",
      name: "Buhle Zungu",
      session: "#1124",
      date: "12 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/buhle.jpg"),
    },
    {
      id: "2",
      name: "Mbali Zungu",
      session: "#1124",
      date: "22 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/mbali.jpg"),
    },
    {
      id: "3",
      name: "Buhle Zungu",
      session: "#1124",
      date: "12 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/buhle.jpg"),
    },
    {
      id: "4",
      name: "Mbali Zungu",
      session: "#1124",
      date: "22 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/mbali.jpg"),
    },
    {
      id: "5",
      name: "Buhle Zungu",
      session: "#1124",
      date: "12 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/buhle.jpg"),
    },
    {
      id: "6",
      name: "Mbali Zungu",
      session: "#1124",
      date: "22 May 2025",
      nanny: "Miss SiphoKazi",
      driver: "Mr Davids",
      image: require("../../assets/mbali.jpg"),
    },
  ],
  Upcoming: [
    {
      id: "3",
      name: "Thabo Mokoena",
      session: "#1125",
      date: "15 May 2025",
      nanny: "Mrs Ndlovu",
      driver: "Mr Smith",
      image: require("../../assets/thabo.jpg"),
    },
  ],
  Closed: [
    {
      id: "4",
      name: "Lindiwe Ngcobo",
      session: "#1123",
      date: "10 May 2025",
      nanny: "Miss Dlamini",
      driver: "Mr Jones",
      image: require("../../assets/lindiwe.jpg"),
    },
  ],
};

export default function Sessions({ navigation }) {
  const router = useRouter(); // Add router hook
  const [selectedTab, setSelectedTab] = useState("Active");
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-sidebarWidth)).current;
  const insets = useSafeAreaInsets();

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

  const renderSession = ({ item }) => (
    <View style={styles.sessionCard}>
      <Image source={item.image} style={styles.sessionImage} />
      <View style={styles.sessionInfo}>
        <Text style={styles.sessionName}>{item.name}</Text>
        <Text style={styles.sessionDetails}>Session {item.session}</Text>
        <Text style={styles.sessionDetails}>{item.date}</Text>
        <Text style={styles.sessionDetails}>Nanny: {item.nanny}</Text>
        <Text style={styles.sessionDetails}>Driver: {item.driver}</Text>
      </View>
      <View style={styles.statusIndicator} />
    </View>
  );

  const topSidebarItems = [
    "Account",
    "My Kids",
    "Sessions",
    "Book A Session",
    "Notifications",
    "Background Check", // Added Background Check here
    "Children Information", // Added Children Information here
  ];

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
      <FlatList
        data={sessionsData[selectedTab]}
        renderItem={renderSession}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />

      {/* Floating Book Button */}
      <TouchableOpacity style={styles.floatingBookButton}>
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
    fontSize: 25,
    fontWeight: "bold",
    color: "#D81B60",
  },

  tabBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },

  tabButton: { padding: 10 },
  tabButtonSelected: {
    borderBottomWidth: 2,
    borderBottomColor: "#D81B60",
  },
  tabText: { fontSize: 16, color: "#666" },
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
    borderColor: "#e0e0e0", // light border for definition
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
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4CAF50",
    marginLeft: 10,
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    alignItems: "center",
    justifyContent: "center",
    transform: [{ translateX: -60 }],
    zIndex: 10,
  },

  bookText: {
    color: "#fff",
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
    color: "#fff",
    fontWeight: "200",
    fontSize: 15,
    lineHeight: 18,
    fontFamily: "Inter",
  },
});
