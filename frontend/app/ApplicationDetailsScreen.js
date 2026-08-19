import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
    ActivityIndicator,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import apiClient from "../src/api/apiClient";

export default function ApplicationDetailsScreen() {
  const router = useRouter();

  const { applicationId, schoolName, childName, dateOfBirth } =
    useLocalSearchParams();

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (applicationId) {
      fetchApplicationDetails();
    } else {
      setLoading(false);
    }
  }, [applicationId]);

  const fetchApplicationDetails = async () => {
    try {
      setLoading(true);

      const response = await apiClient.get(`/applications/${applicationId}`);

      console.log("Application Details:", response.data);

      setApplication(response.data);
    } catch (error) {
      console.error(
        "Failed to load application details:",
        error.response?.data || error.message,
      );
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return String(date);
    }

    return parsedDate.toLocaleDateString();
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2563EB" />

          <Text style={styles.loadingText}>Loading application details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#EF4444" />

          <Text style={styles.errorText}>Application details not found</Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  /*
  |--------------------------------------------------------------------------
  | Display Values
  |--------------------------------------------------------------------------
  */

  const displaySchoolName =
    application.schoolName ||
    application.school?.name ||
    application.school?.schoolName ||
    schoolName ||
    "N/A";

  const displayChildName =
    application.childFullName ||
    application.childName ||
    application.child?.fullName ||
    application.child?.name ||
    childName ||
    "N/A";

  const displayDateOfBirth =
    application.birthDate ||
    application.childDateOfBirth ||
    application.dateOfBirth ||
    application.child?.birthDate ||
    application.child?.dateOfBirth ||
    dateOfBirth ||
    null;
  const applicationDisplayId =
    application.applicationId || application.id || applicationId;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.headerButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Application Details</Text>

        <View style={styles.headerButton} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Application Status */}

        <View style={styles.statusCard}>
          <Ionicons name="document-text-outline" size={40} color="#2563EB" />

          <Text style={styles.schoolTitle}>{displaySchoolName}</Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {application.status || "SUBMITTED"}
            </Text>
          </View>
        </View>

        {/* Application Information */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Information</Text>

          <DetailRow
            icon="calendar-outline"
            label="Application Date"
            value={formatDate(application.submissionDate)}
          />

          <DetailRow
            icon="document-text-outline"
            label="Application ID"
            value={applicationDisplayId}
          />

          <DetailRow
            icon="school-outline"
            label="School"
            value={displaySchoolName}
          />
        </View>

        {/* Child Information */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Child Information</Text>

          <DetailRow
            icon="person-outline"
            label="Child Name"
            value={displayChildName}
          />

          <DetailRow
            icon="calendar-outline"
            label="Date of Birth"
            value={formatDate(displayDateOfBirth)}
          />

          {application.gender && (
            <DetailRow
              icon="male-female-outline"
              label="Gender"
              value={application.gender}
            />
          )}
        </View>

        {/* Parent Information */}

        {(application.parentFullName ||
          application.relationship ||
          application.parentNicNumber) && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Parent Information</Text>

            {application.parentFullName && (
              <DetailRow
                icon="person-outline"
                label="Parent Name"
                value={application.parentFullName}
              />
            )}

            {application.relationship && (
              <DetailRow
                icon="people-outline"
                label="Relationship"
                value={application.relationship}
              />
            )}

            {application.parentNicNumber && (
              <DetailRow
                icon="card-outline"
                label="NIC Number"
                value={application.parentNicNumber}
              />
            )}
          </View>
        )}

        {/* Submitted Documents */}

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Submitted Documents</Text>

          {application.documentIds?.length > 0 ? (
            application.documentIds.map((document, index) => (
              <View
                key={document?.id || document || index}
                style={styles.documentRow}
              >
                <View style={styles.documentIcon}>
                  <Ionicons name="document-outline" size={22} color="#2563EB" />
                </View>

                <Text style={styles.documentText}>
                  {document?.name || `Document ${index + 1}`}
                </Text>

                <Ionicons name="checkmark-circle" size={22} color="#22C55E" />
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No documents found</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Ionicons name={icon} size={20} color="#2563EB" />
      </View>

      <View style={styles.detailContent}>
        <Text style={styles.detailLabel}>{label}</Text>

        <Text style={styles.detailValue}>{value || "N/A"}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FB",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
  },

  errorText: {
    marginTop: 12,
    fontSize: 16,
    color: "#374151",
  },

  header: {
    height: 60,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  headerButton: {
    width: 40,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1F2937",
  },

  scrollContent: {
    padding: 16,
    paddingBottom: 30,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 16,
  },

  schoolTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1F2937",
    marginTop: 12,
    textAlign: "center",
  },

  statusBadge: {
    backgroundColor: "#E0F2FE",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },

  statusText: {
    color: "#0369A1",
    fontWeight: "700",
    fontSize: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 16,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  detailIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  detailContent: {
    flex: 1,
  },

  detailLabel: {
    fontSize: 12,
    color: "#9CA3AF",
    marginBottom: 4,
  },

  detailValue: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "500",
  },

  documentRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  documentIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  documentText: {
    flex: 1,
    fontSize: 15,
    color: "#374151",
  },

  emptyText: {
    color: "#9CA3AF",
    textAlign: "center",
    paddingVertical: 10,
  },

  backButton: {
    marginTop: 20,
    backgroundColor: "#2563EB",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
  },
});
