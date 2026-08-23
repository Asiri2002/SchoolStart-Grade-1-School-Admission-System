import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import apiClient from "../src/api/apiClient";
import { clearAuthData, getAccessToken } from "../src/storage/authStorage";

export default function EducationAdminDashboardScreen() {
  const [dashboard, setDashboard] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboard = async () => {
    try {
      const token = await getAccessToken();

      if (!token) {
        router.replace("/LoginScreen");
        return;
      }

      console.log("Education Admin token exists:", !!token);

      const response = await apiClient.get("/education-admin/profile");

      console.log("Education Admin dashboard:", response.data);

      setDashboard(response.data);
    } catch (error) {
      console.error(
        "Education Admin dashboard error:",
        error?.response?.data || error.message,
      );

      if (error?.response?.status === 401) {
        await clearAuthData();
        router.replace("/LoginScreen");
        return;
      }

      if (error?.response?.status === 403) {
        Alert.alert(
          "Access Denied",
          "You do not have permission to access the Education Admin dashboard.",
        );
        return;
      }

      Alert.alert("Error", "Unable to load the Education Admin dashboard.");
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await clearAuthData();
          } catch (error) {
            console.error("Logout error:", error);
          }

          router.replace("/LoginScreen");
        },
      },
    ]);
  };

  const getValue = (key, fallback = 0) => {
    if (!dashboard) {
      return fallback;
    }

    return dashboard[key] ?? fallback;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />

        <Text style={styles.loadingText}>
          Loading Education Admin Dashboard...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Education Admin</Text>

            <Text style={styles.headerSubtitle}>
              SchoolStart Administration
            </Text>
          </View>

          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color="#DC2626" />
          </TouchableOpacity>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeIcon}>
            <Ionicons name="school-outline" size={32} color="#FFFFFF" />
          </View>

          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>Welcome, Education Admin</Text>

            <Text style={styles.welcomeSubtitle}>
              Manage schools, school administrators, applications and
              admissions.
            </Text>
          </View>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Overview</Text>

        <View style={styles.statsGrid}>
          {/* Schools */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="business-outline" size={26} color="#2563EB" />
            </View>

            <Text style={styles.statNumber}>{getValue("totalSchools")}</Text>

            <Text style={styles.statLabel}>Total Schools</Text>
          </View>

          {/* School Admins */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="people-outline" size={26} color="#16A34A" />
            </View>

            <Text style={styles.statNumber}>
              {getValue("totalSchoolAdmins")}
            </Text>

            <Text style={styles.statLabel}>School Admins</Text>
          </View>

          {/* Applications */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#FFF7ED" }]}>
              <Ionicons
                name="document-text-outline"
                size={26}
                color="#EA580C"
              />
            </View>

            <Text style={styles.statNumber}>
              {getValue("totalApplications")}
            </Text>

            <Text style={styles.statLabel}>Applications</Text>
          </View>

          {/* Admissions */}
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: "#F5F3FF" }]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={26}
                color="#7C3AED"
              />
            </View>

            <Text style={styles.statNumber}>{getValue("totalAdmissions")}</Text>

            <Text style={styles.statLabel}>Admissions</Text>
          </View>
        </View>

        {/* Management */}
        <Text style={styles.sectionTitle}>Management</Text>

        <View style={styles.menuContainer}>
          {/* Schools */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/EduSchoolsScreen")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#EFF6FF" }]}>
              <Ionicons name="business-outline" size={28} color="#2563EB" />
            </View>

            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Manage Schools</Text>

              <Text style={styles.menuDescription}>
                Add, view and manage schools
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </TouchableOpacity>

          {/* School Admins */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/SchoolAdminsScreen")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#F0FDF4" }]}>
              <Ionicons name="people-outline" size={28} color="#16A34A" />
            </View>

            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>School Administrators</Text>

              <Text style={styles.menuDescription}>
                Create and manage school admins
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </TouchableOpacity>

          {/* Applications */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/ApplicationsScreen")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#FFF7ED" }]}>
              <Ionicons
                name="document-text-outline"
                size={28}
                color="#EA580C"
              />
            </View>

            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Applications</Text>

              <Text style={styles.menuDescription}>
                View and monitor admission applications
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </TouchableOpacity>

          {/* Admissions */}
          <TouchableOpacity
            style={styles.menuCard}
            activeOpacity={0.8}
            onPress={() => router.push("/AdmissionsScreen")}
          >
            <View style={[styles.menuIcon, { backgroundColor: "#F5F3FF" }]}>
              <Ionicons
                name="checkmark-circle-outline"
                size={28}
                color="#7C3AED"
              />
            </View>

            <View style={styles.menuText}>
              <Text style={styles.menuTitle}>Admissions</Text>

              <Text style={styles.menuDescription}>
                Monitor completed admissions
              </Text>
            </View>

            <Ionicons name="chevron-forward" size={22} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/AddSchoolScreen")}
          >
            <Ionicons name="add-circle-outline" size={24} color="#2563EB" />

            <Text style={styles.quickActionText}>Add School</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => router.push("/AddSchoolAdminScreen")}
          >
            <Ionicons name="person-add-outline" size={24} color="#16A34A" />

            <Text style={styles.quickActionText}>Add School Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  scrollContent: {
    padding: 20,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#64748B",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1E293B",
  },

  headerSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },

  logoutButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  welcomeCard: {
    backgroundColor: "#2563EB",
    borderRadius: 18,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 26,
  },

  welcomeIcon: {
    width: 58,
    height: 58,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.18)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  welcomeTextContainer: {
    flex: 1,
  },

  welcomeTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 6,
  },

  welcomeSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: "#DBEAFE",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 14,
  },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 26,
  },

  statCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "700",
    color: "#1E293B",
  },

  statLabel: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 3,
  },

  menuContainer: {
    marginBottom: 26,
  },

  menuCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  menuIcon: {
    width: 52,
    height: 52,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  menuText: {
    flex: 1,
  },

  menuTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },

  menuDescription: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },

  quickActions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  quickActionButton: {
    width: "48%",
    minHeight: 90,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  quickActionText: {
    marginTop: 8,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
});
