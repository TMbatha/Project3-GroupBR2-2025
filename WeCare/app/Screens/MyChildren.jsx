import React, { useState, useRef } from "react";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet,
    Dimensions,
    Animated,
    Pressable
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const sidebarWidth = 235;
const screenHeight = Dimensions.get("window").height;

const childrenData = [
    {
        id: "1",
        name: "Buhle Zungu",
        age: 3,
        image: require("../../assets/buhle.jpg"),
    },
    {
        id: "2",
        name: "Mbali Zungu",
        age: 3,
        image: require("../../assets/mbali.jpg"),
    },
];

export default function MyChildren() {
    const router = useRouter();
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

    const handleSidebarNavigation = (item) => {
        closeSidebar();
        if (item === "Children Information") router.push("/Screens/MyChildren");
        if (item === "Sessions") router.push("/Screens/Sessions");
        if (item === "Sign Out") router.push("/");
    };

    const renderChild = ({ item }) => (
        <View style={styles.childCard}>
            <Image source={item.image} style={styles.childImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.childName}>{item.name}</Text>
                <Text style={styles.childAge}>{item.age} years old</Text>
                <TouchableOpacity
                    onPress={() => router.push({ pathname: "/Screens/ChildProfile", params: { id: item.id } })}
                >
                    <Text style={styles.viewProfile}>View Profile</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const topSidebarItems = [
        "Account",
        "My Kids",
        "Sessions",
        "Book A Session",
        "Notifications",
        "Background Check",
        "Children Information",
    ];

    const bottomSidebarItems = ["Report", "Sign Out"];

    return (
        <SafeAreaView style={styles.container}>
            {/* Top Panel */}
            <View style={styles.topPanel}>
                <TouchableOpacity onPress={openSidebar}>
                    <Ionicons name="menu" size={28} color="#000" />
                </TouchableOpacity>
                <Text style={styles.headerText}>MY CHILDREN</Text>
                <TouchableOpacity>
                    <Ionicons name="notifications" size={28} color="#000" />
                </TouchableOpacity>
            </View>

            {/* List */}
            <FlatList
                data={childrenData}
                renderItem={renderChild}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 10 }}
            />

            {/* Add Child Button */}
            <TouchableOpacity style={styles.addChildButton} onPress={() => router.push("/Screens/AddChild")}>
                <Text style={styles.addChildText}>ADD CHILD</Text>
            </TouchableOpacity>

            {/* Overlay */}
            {sidebarVisible && <Pressable style={styles.overlay} onPress={closeSidebar} />}

            {/* Sidebar */}
            {sidebarVisible && (
                <Animated.View
                    style={[styles.sidebar, { transform: [{ translateX: slideAnim }], paddingTop: insets.top + 10 }]}
                >
                    {/* Close Button */}
                    <View style={styles.sidebarCloseContainer}>
                        <TouchableOpacity onPress={closeSidebar}>
                            <Ionicons name="close" size={28} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Profile */}
                    <View style={styles.sidebarHeader}>
                        <Image source={require("../../assets/busisiwe.jpg")} style={styles.sidebarProfileImage} />
                        <Text style={styles.sidebarUsername}>Busisiwe Gloria Zungu</Text>
                    </View>

                    {/* Menu */}
                    {topSidebarItems.map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.sidebarItem} onPress={() => handleSidebarNavigation(item)}>
                            <Text style={styles.sidebarItemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}

                    <View style={{ flex: 1 }} />

                    {bottomSidebarItems.map((item, idx) => (
                        <TouchableOpacity key={idx} style={styles.sidebarItem} onPress={() => handleSidebarNavigation(item)}>
                            <Text style={styles.sidebarItemText}>{item}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#fff" },
    topPanel: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 15,
    },
    headerText: { fontSize: 20, fontWeight: "bold", color: "#D81B60" },
    childCard: {
        flexDirection: "row",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        alignItems: "center",
        borderWidth: 1,
        borderColor: "#e0e0e0",
    },
    childImage: { width: 70, height: 70, borderRadius: 10, marginRight: 20 },
    childName: { fontSize: 16, fontWeight: "bold", color: "#D81B60" },
    childAge: { fontSize: 14, color: "#666" },
    viewProfile: { color: "#D81B60", marginTop: 5 },
    addChildButton: {
        backgroundColor: "#f3d4e6",
        margin: 15,
        borderRadius: 30,
        paddingVertical: 12,
        alignItems: "center",
    },
    addChildText: { color: "#D81B60", fontWeight: "bold", fontSize: 16 },
    overlay: {
        position: "absolute",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
    },
    sidebar: {
        position: "absolute",
        width: sidebarWidth,
        height: screenHeight,
        backgroundColor: "#C05BA1",
        borderTopRightRadius: 72,
        paddingHorizontal: 20,
        zIndex: 10,
    },
    sidebarCloseContainer: { alignItems: "flex-end", marginBottom: 20 },
    sidebarHeader: { flexDirection: "row", alignItems: "center", marginBottom: 40 },
    sidebarProfileImage: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
    sidebarUsername: { color: "#fff", fontWeight: "600", fontSize: 15 },
    sidebarItem: { height: 51, justifyContent: "center", paddingLeft: 32 },
    sidebarItemText: { color: "#fff", fontSize: 15 },
});
