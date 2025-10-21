import React, { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router"; // ✅ Expo Router hook
import AsyncStorage from '@react-native-async-storage/async-storage';
import wecareLogo from "../assets/wecare_logo.png";
import {
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

const API_BASE_URL = "http://localhost:8080/api";

export default function App() {
  const router = useRouter(); // ✅ Router instance for navigation

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = async () => {
    try {
      if (!form.email || !form.password) {
        Alert.alert("Validation", "Please enter email and password");
        return;
      }

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();
      console.log("Login result:", result);

      if (response.ok && result.success) {
        // Store user info in AsyncStorage for session persistence
        console.log("User logged in:", result.role, result.firstName);
        
        try {
          await AsyncStorage.setItem('userId', result.id.toString());
          await AsyncStorage.setItem('userRole', result.role);
          await AsyncStorage.setItem('userName', result.firstName);
          console.log("User info saved to AsyncStorage:", result.id, result.role);
        } catch (storageError) {
          console.error("Error saving to AsyncStorage:", storageError);
        }
        
        // Role-based navigation
        let navigationPath = "/Screens/Sessions"; // Default for parent
        let welcomeMessage = `Welcome back, ${result.firstName}!`;
        
        switch (result.role) {
          case "driver":
            navigationPath = "/Screens/DriverTrips"; // Driver sees assigned trips
            welcomeMessage = `Welcome back, ${result.firstName}! View your assigned trips.`;
            break;
          case "nanny":
            navigationPath = "/Screens/NannySessions"; // Nanny sees assigned sessions
            welcomeMessage = `Welcome back, ${result.firstName}! View your assigned sessions.`;
            break;
          case "parent":
          default:
            navigationPath = "/Screens/Sessions"; // Parent books sessions
            welcomeMessage = `Welcome back, ${result.firstName}! Book a session for your child.`;
            break;
        }
        
        // Show success message and navigate
        Alert.alert("Success", welcomeMessage);
        setTimeout(() => {
          router.push(navigationPath);
        }, 500);
      } else {
        Alert.alert("Error", result.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Could not connect to server. Please try again.");
    }
  };

  return (
    <LinearGradient
      colors={["#CAC5C2", "#C743A2"]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={{ flex: 1 }}
    >
      <View
        style={[
          StyleSheet.absoluteFillObject,
          { backgroundColor: "rgba(255, 255, 255, 0.65)" },
        ]}
      />

      <SafeAreaView style={{ flex: 1, backgroundColor: "transparent" }}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Image
              alt="App Logo"
              resizeMode="contain"
              style={styles.headerImg}
              source={wecareLogo}
            />

            <Text style={styles.title}>
              Sign in to <Text style={{ color: "#FF87E1" }}>WeCare</Text>
            </Text>

            <Text style={styles.subtitle}>
              Get access to your portfolio and more
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.input}>
              <Text style={styles.inputLabel}>Email address</Text>

              <TextInput
                autoCapitalize="none"
                autoCorrect={false}
                clearButtonMode="while-editing"
                keyboardType="email-address"
                onChangeText={(email) => setForm({ ...form, email })}
                placeholder="john@example.com"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                value={form.email}
              />
            </View>

            <View style={styles.input}>
              <Text style={styles.inputLabel}>Password</Text>

              <TextInput
                autoCorrect={false}
                clearButtonMode="while-editing"
                onChangeText={(password) => setForm({ ...form, password })}
                placeholder="********"
                placeholderTextColor="#6b7280"
                style={styles.inputControl}
                secureTextEntry={true}
                value={form.password}
              />
            </View>

            <View style={styles.formAction}>
              <TouchableOpacity onPress={handleLogin}>
                <View style={styles.btn}>
                  <Text style={styles.btnText}>Sign in</Text>
                </View>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => {
                // TODO: Add forgot password logic
              }}
            >
              <Text style={styles.formLink}>Forgot password?</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={() => {
            router.push("/Screens/Registration");
          }}
        >
          <Text style={styles.formFooter}>
            Don't have an account?{" "}
            <Text style={{ textDecorationLine: "underline" }}>Sign up</Text>
          </Text>
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
    padding: 24,
  },
  title: {
    fontSize: 31,
    fontWeight: "700",
    color: "#1D2A32",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#929292",
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 36,
  },
  headerImg: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginBottom: 36,
  },
  form: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  formAction: {
    marginTop: 4,
    marginBottom: 16,
  },
  formLink: {
    fontSize: 16,
    fontWeight: "600",
    color: "#075eec",
    textAlign: "center",
  },
  formFooter: {
    paddingVertical: 24,
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
    letterSpacing: 0.15,
  },
  input: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 8,
  },
  inputControl: {
    height: 50,
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    borderWidth: 1,
    borderColor: "#C9D3DB",
    borderStyle: "solid",
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,
    backgroundColor: "#FF87E1",
    borderColor: "#FF87E1",
  },
  btnText: {
    fontSize: 18,
    lineHeight: 26,
    fontWeight: "600",
    color: "#fff",
  },
});
