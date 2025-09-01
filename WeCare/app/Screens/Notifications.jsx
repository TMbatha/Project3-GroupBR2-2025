// app/Screens/Notifications.jsx
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Platform,
  Pressable,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const COLORS = {
  bg: "#d7cfcb",
  pill: "#ece7e5",
  white: "#ffffff",
  text: "#5c5451",
  pink: "#e7b0d3",
  pinkLink: "#cc78bd",
  pinkLinkDim: "#b05aa2",
  danger: "#d33a2c",
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const RAW = [
  { id: "1", title: "Session Ended", date: "22 May 2025", read: true },
  { id: "2", title: "Payment Request", date: "22 May 2025", read: false },
  { id: "3", title: "Nanny has Arrived", date: "22 May 2025", read: false },
  { id: "4", title: "Session Booked", date: "12 May 2025", read: true },
  { id: "5", title: "Child on Route", date: "22 April 2025", read: true },
  { id: "6", title: "Nanny on Route", date: "22 March 2025", read: true },
  { id: "7", title: "Driver on Route", date: "22 March 2025", read: true },
];

const TABS = ["All", "Read", "Unread"];

export default function NotificationsScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("All");
  const [items, setItems] = useState(RAW);
  const [perm, setPerm] = useState("checking...");
  const [selected, setSelected] = useState(null); // <- detail view

  useEffect(() => {
    (async () => {
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          sound: "default",
          vibrationPattern: [0, 200, 200, 200],
        });
      }
      if (Device.isDevice) {
        const { status } = await Notifications.requestPermissionsAsync();
        setPerm(status);
      } else {
        setPerm("granted");
      }
    })();
  }, []);

  const data = useMemo(() => {
    if (tab === "Read") return items.filter((n) => n.read);
    if (tab === "Unread") return items.filter((n) => !n.read);
    return items;
  }, [tab, items]);

  const openDetail = (item) => {
    // mark read when opening
    setItems((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, read: true } : n))
    );
    setSelected(item);
  };

  const bodyFor = (item) => {
    switch (item.title) {
      case "Session Ended":
        return `The session with nanny, Emma Watson, and your child, Robert Downey, has now concluded.

Please ensure that someone has acknowledged the end of the session and formally released the nanny from their duties.

If you have any questions or need to schedule the next session, feel free to get in touch.

Thank you for your continued trust and support.`;
      case "Payment Request":
        return `A new payment request is available for your recent session. Please review the invoice and complete payment at your earliest convenience.`;
      case "Nanny has Arrived":
        return `Your nanny has arrived at the pickup location and is ready to begin the session.`;
      case "Session Booked":
        return `Your booking is confirmed. You’ll receive reminders before the session starts.`;
      default:
        return `This is a notification related to your WeCare sessions.`;
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.item}
      onPress={() => openDetail(item)}
    >
      <Text
        style={[
          styles.itemTitle,
          { color: item.read ? COLORS.pinkLinkDim : COLORS.pinkLink },
        ]}
        numberOfLines={1}
      >
        {item.title}
      </Text>
      <View style={styles.datePill}>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe}>
      {/* Top bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={() => router.back()}>
          <Feather name="menu" size={20} color={COLORS.white} />
        </TouchableOpacity>

        <Text style={styles.heading}>NOTIFICATIONS</Text>

        <View style={{ flexDirection: "row", gap: 10 }}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="lock" size={16} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.bookBtn}>
            <Text style={styles.bookText}>+ BOOK</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((t) => {
          const active = tab === t;
          return (
            <TouchableOpacity
              key={t}
              onPress={() => setTab(t)}
              activeOpacity={0.9}
              style={[styles.tab, active ? styles.tabActive : styles.tabIdle]}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Permission (tiny) */}
      <Text style={styles.perm}>Permission: {perm}</Text>

      {/* List */}
      <FlatList
        contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 8 }}
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => <View style={{ height: 14 }} />}
        showsVerticalScrollIndicator={false}
      />

      {/* Trash icon */}
      <View style={styles.trashWrap}>
        <Ionicons name="trash-bin-outline" size={28} color={COLORS.danger} />
      </View>

      {/* ---------- Detail overlay ---------- */}
      {selected && (
        <>
          <Pressable style={styles.overlay} onPress={() => setSelected(null)} />
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <Text style={styles.detailTitle}>{selected.title}</Text>
              <Text style={styles.detailDate}>{selected.date}</Text>
            </View>

            <Text style={styles.detailBody}>{bodyFor(selected)}</Text>

            <View style={styles.detailButtons}>
              <TouchableOpacity
                style={styles.chatBtn}
                onPress={() => {
                  setSelected(null);
                  router.push("/Screens/Chat"); // adjust if you have a chat route
                }}
              >
                <Text style={styles.chatText}>CHAT</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.reportBtn}
                onPress={() => {
                  setSelected(null);
                  router.push("/Screens/Report"); // adjust if you have a report route
                }}
              >
                <Text style={styles.reportText}>REPORT</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },

  topBar: {
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconBtn: {
    height: 34,
    width: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  heading: {
    flex: 1,
    marginHorizontal: 12,
    fontSize: 26,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 1,
  },
  bookBtn: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
  },
  bookText: { fontWeight: "700", color: COLORS.text },

  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 10,
    gap: 10,
    paddingVertical: 8,
  },
  tab: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 16 },
  tabActive: { backgroundColor: COLORS.pink },
  tabIdle: { backgroundColor: "rgba(255,255,255,0.35)" },
  tabText: { color: COLORS.white, fontWeight: "700" },
  tabTextActive: { color: COLORS.white },

  perm: { marginLeft: 18, color: COLORS.text, opacity: 0.7, fontSize: 12 },

  item: {
    backgroundColor: COLORS.pill,
    borderRadius: 22,
    paddingVertical: 14,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  itemTitle: { flex: 1, fontSize: 16, fontWeight: "800" },
  datePill: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    marginLeft: 10,
  },
  dateText: { color: COLORS.text, fontSize: 12, fontWeight: "700" },

  trashWrap: {
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 18,
  },

  // Overlay + detail card
  overlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0,0,0,0.15)",
  },
  detailCard: {
    position: "absolute",
    left: 20,
    right: 20,
    top: 160,
    backgroundColor: COLORS.white,
    borderRadius: 22,
    padding: 18,
    elevation: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
  },
  detailHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  detailTitle: { fontSize: 18, fontWeight: "800", color: COLORS.pinkLink },
  detailDate: {
    color: COLORS.text,
    opacity: 0.8,
    fontSize: 12,
    fontWeight: "700",
  },
  detailBody: { color: COLORS.text, lineHeight: 20, marginBottom: 16 },

  detailButtons: { alignItems: "center", gap: 10 },
  chatBtn: {
    backgroundColor: COLORS.pink,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chatText: { color: COLORS.white, fontWeight: "700" },
  reportBtn: {
    backgroundColor: "#ef4b43",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },
  reportText: { color: COLORS.white, fontWeight: "700" },
});
