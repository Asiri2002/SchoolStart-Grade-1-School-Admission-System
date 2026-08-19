import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
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
import BottomNavigation from "../component/BottomNavigation";

import { COLORS } from "../theme/colors";

import { fetchParentDashboard } from "../src/services/parentService";

export default function ApplicationsScreen() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /*
  |--------------------------------------------------------------------------
  | Fetch Applications
  |--------------------------------------------------------------------------
  */

  const fetchApplications = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await fetchParentDashboard();

      const allApplications = Array.isArray(data?.applications)
        ? data.applications
        : [];

      // Sort newest applications first
      const sortedApplications = [...allApplications].sort(
        (a, b) => new Date(b.submissionDate) - new Date(a.submissionDate),
      );

      setApplications(sortedApplications);
    } catch (error) {
      console.error(
        "Failed to load applications:",
        error?.response?.data || error.message,
      );

      setError("Unable to load applications. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Load Applications
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  /*
  |--------------------------------------------------------------------------
  | Handle Application Click
  |--------------------------------------------------------------------------
  */

  const handleApplicationPress = (application) => {
    const applicationId = application.applicationId || application.id;

    console.log("Opening application:", applicationId);

    if (!applicationId) {
      console.error("Application ID not found:", application);
      return;
    }

    router.push({
      pathname: "/ApplicationDetailsScreen",
      params: {
        applicationId: applicationId,
      },
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Loading
  |--------------------------------------------------------------------------
  */

  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading applications...</Text>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Error
  |--------------------------------------------------------------------------
  */

  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => fetchApplications()}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Main UI
  |--------------------------------------------------------------------------
  */

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.screen}>
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
            <Text style={styles.backButton}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Applications</Text>

          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchApplications(true)}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
            />
          }
        >
          {/* Application Count */}

          <View style={styles.summary}>
            <Text style={styles.summaryLabel}>Total Applications</Text>

            <Text style={styles.summaryCount}>{applications.length}</Text>
          </View>

          {/* Applications */}

          {applications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>📄</Text>

              <Text style={styles.emptyTitle}>No Applications</Text>

              <Text style={styles.emptyText}>
                You have not submitted any applications yet.
              </Text>
            </View>
          ) : (
            applications.map((application, index) => (
              <ApplicationCard
                key={application.applicationId || application.id || index}
                application={application}
                onPress={() => handleApplicationPress(application)}
              />
            ))
          )}
        </ScrollView>

        {/* Bottom Navigation */}

        <BottomNavigation activeTab="Applications" />
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

  header: {
    height: 64,
    backgroundColor: COLORS.primary,

    flexDirection: "row",
    alignItems: "center",

    paddingHorizontal: 20,
  },

  backButton: {
    color: COLORS.white,
    fontSize: 40,
    fontWeight: "300",
    lineHeight: 40,
  },

  headerTitle: {
    flex: 1,

    textAlign: "center",

    color: COLORS.white,

    fontSize: 19,
    fontWeight: "700",
  },

  headerSpacer: {
    width: 30,
  },

  scroll: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 100,
  },

  summary: {
    backgroundColor: COLORS.white,

    borderRadius: 14,

    padding: 18,

    marginBottom: 20,

    elevation: 2,
  },

  summaryLabel: {
    fontSize: 13,
    color: COLORS.textMuted,
  },

  summaryCount: {
    marginTop: 4,

    fontSize: 28,
    fontWeight: "800",

    color: COLORS.textPrimary,
  },

  emptyContainer: {
    alignItems: "center",

    paddingVertical: 60,
    paddingHorizontal: 30,
  },

  emptyIcon: {
    fontSize: 45,
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",

    color: COLORS.textPrimary,

    marginBottom: 8,
  },

  emptyText: {
    fontSize: 14,

    color: COLORS.textMuted,

    textAlign: "center",
  },

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
