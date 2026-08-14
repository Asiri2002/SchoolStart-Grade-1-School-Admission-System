import { useCallback, useEffect, useState } from "react";

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

import { router } from "expo-router";

import ApplicationCard from "../component/ApplicationCard";
import ApplicationSummaryCard from "../component/ApplicationSummaryCard";
import BottomNavigation from "../component/BottomNavigation";
import ChildCard from "../component/ChildCard";
import DashboardHeader from "../component/DashboardHeader";

import { COLORS } from "../theme/colors";

import { logoutUser } from "../src/services/authService";
import { getAuthData } from "../src/storage/authStorage";

import { fetchParentDashboard } from "../src/services/parentService";

/*
|--------------------------------------------------------------------------
| Section Header
|--------------------------------------------------------------------------
*/

const SectionHeader = ({ title, actionLabel, onAction }) => {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>

      {actionLabel && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
          <Text style={styles.sectionAction}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

/*
|--------------------------------------------------------------------------
| Parent Dashboard
|--------------------------------------------------------------------------
*/

export default function ParentDashboardScreen() {
  const [userData, setUserData] = useState(null);

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState(null);

  const [activeTab, setActiveTab] = useState("Home");

  /*
  |--------------------------------------------------------------------------
  | Load Logged-in User
  |--------------------------------------------------------------------------
  */

  const loadUser = useCallback(async () => {
    try {
      const stored = await getAuthData();

      if (stored) {
        setUserData(stored);
      }

      return stored;
    } catch (error) {
      console.error("Failed to load user data:", error);

      return null;
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Fetch Dashboard Data
  |--------------------------------------------------------------------------
  */

  const fetchData = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      try {
        // Get logged-in user
        const storedUser = await loadUser();

        // Get dashboard data from Spring Boot
        const data = await fetchParentDashboard();

        // Save dashboard data
        setDashboardData({
          ...data,

          parentName:
            data?.parentName ||
            storedUser?.username ||
            storedUser?.firstName ||
            "Parent",
        });
      } catch (err) {
        console.error("Dashboard fetch error:", err);

        setError("Unable to load dashboard. Please try again.");
      } finally {
        setLoading(false);

        setRefreshing(false);
      }
    },
    [loadUser],
  );

  /*
  |--------------------------------------------------------------------------
  | Load Dashboard
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /*
  |--------------------------------------------------------------------------
  | Open Add Child Screen
  |--------------------------------------------------------------------------
  */

  const handleAddChild = () => {
    router.push("/AddChildScreen");
  };

  /*
  |--------------------------------------------------------------------------
  | Open School Search Screen
  |--------------------------------------------------------------------------
  */

  const handleChildPress = (child) => {
    router.push({
      pathname: "/search-schools",

      params: {
        childId: child.id,
        childName: `${child.firstName || ""} ${child.lastName || ""}`.trim(),
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Logout
  |--------------------------------------------------------------------------
  */

  const handleLogout = async () => {
    try {
      await logoutUser();

      router.replace("/LoginScreen");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Loading Screen
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading your dashboard...</Text>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error Screen
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchData()}
          activeOpacity={0.8}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Dashboard Data
  |--------------------------------------------------------------------------
  */

  const {
    parentName,
    totalApplications = 0,
    children = [],
    recentApplications = [],
  } = dashboardData || {};

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchData(true)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Dashboard Header */}

          <DashboardHeader
            parentName={parentName}
            onBellPress={() =>
              Alert.alert("Notifications", "No new notifications.")
            }
          />

          {/* Total Applications */}

          <ApplicationSummaryCard
            totalApplications={totalApplications}
            onViewAll={() => setActiveTab("Applications")}
          />

          {/* Dashboard Body */}

          <View style={styles.body}>
            {/* Children */}

            <SectionHeader
              title="Children"
              actionLabel="+ Add Child"
              onAction={handleAddChild}
            />

            {children.length === 0 ? (
              <Text style={styles.emptyText}>No children added yet.</Text>
            ) : (
              children.map((child, index) => (
                <ChildCard
                  key={child.id || index}
                  child={child}
                  index={index}
                  onPress={() => handleChildPress(child)}
                />
              ))
            )}

            {/* Recent Applications */}

            <SectionHeader
              title="Recent Applications"
              actionLabel="See All"
              onAction={() => setActiveTab("Applications")}
            />

            {recentApplications.length === 0 ? (
              <Text style={styles.emptyText}>
                No applications submitted yet.
              </Text>
            ) : (
              recentApplications.map((application) => (
                <ApplicationCard
                  key={application.applicationId}
                  application={application}
                  onPress={() =>
                    Alert.alert(
                      "Application",
                      `School: ${application.schoolName}\nStatus: ${application.status}`,
                    )
                  }
                />
              ))
            )}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}

        <BottomNavigation activeTab="Home" />
      </View>
    </SafeAreaView>
  );
}

/*
|--------------------------------------------------------------------------
| Styles
|--------------------------------------------------------------------------
*/

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.primary,
  },

  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 20,
  },

  body: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  /*
  |--------------------------------------------------------------------------
  | Section Header
  |--------------------------------------------------------------------------
  */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginBottom: 12,
    marginTop: 8,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },

  sectionAction: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.primary,
  },

  /*
  |--------------------------------------------------------------------------
  | Empty State
  |--------------------------------------------------------------------------
  */

  emptyText: {
    fontSize: 14,
    color: COLORS.textMuted,

    fontStyle: "italic",

    marginBottom: 20,
    marginLeft: 4,
  },

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  centeredContainer: {
    flex: 1,

    alignItems: "center",
    justifyContent: "center",

    backgroundColor: COLORS.background,

    padding: 24,
  },

  loadingText: {
    marginTop: 16,

    fontSize: 15,

    color: COLORS.textSecondary,
  },

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  errorIcon: {
    fontSize: 48,

    marginBottom: 12,
  },

  errorText: {
    fontSize: 15,

    color: COLORS.textSecondary,

    textAlign: "center",

    marginBottom: 24,
  },

  retryButton: {
    backgroundColor: COLORS.primary,

    paddingHorizontal: 36,
    paddingVertical: 14,

    borderRadius: 12,
  },

  retryButtonText: {
    color: COLORS.white,

    fontWeight: "700",

    fontSize: 15,
  },
});
