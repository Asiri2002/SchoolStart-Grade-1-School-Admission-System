// app/EduSchoolDetailsScreen.js

import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import apiClient from "../src/api/apiClient";
import { colors } from "../theme/colors";

export default function EduSchoolDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);

  // --------------------------------
  // Load school details
  // --------------------------------

  useEffect(() => {
    if (id) {
      loadSchool();
    }
  }, [id]);

  const loadSchool = async () => {
    try {
      setLoading(true);

      console.log("Loading school details:", id);

      const response = await apiClient.get(`/schools/${id}`);

      console.log(
        "School details response:",
        JSON.stringify(response.data, null, 2),
      );

      setSchool(response.data);
    } catch (error) {
      console.error("Load school details error:", error);

      const responseData = error?.response?.data;

      Alert.alert(
        "Error",
        responseData?.message ||
          responseData?.error ||
          error?.message ||
          "Unable to load school details.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Format value
  // --------------------------------

  const displayValue = (value, fallback = "Not provided") => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return fallback;
    }

    return String(value);
  };

  // --------------------------------
  // Information row
  // --------------------------------

  const InfoRow = ({ icon, label, value, fullWidth = false }) => (
    <View style={[styles.infoItem, fullWidth && styles.infoItemFull]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={18} color={colors.primary} />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>

        <Text style={styles.infoValue}>{displayValue(value)}</Text>
      </View>
    </View>
  );

  // --------------------------------
  // Loading
  // --------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading school details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------
  // No school
  // --------------------------------

  if (!school) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="school-outline" size={50} color={colors.text.muted} />

          <Text style={styles.emptyTitle}>School not found</Text>

          <Text style={styles.emptyText}>
            The requested school could not be found.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to Schools</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------
  // Main screen
  // --------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* Back */}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />

            <Text style={styles.backText}>Back to Schools</Text>
          </TouchableOpacity>

          {/* Header */}

          <View style={styles.header}>
            <View style={styles.schoolIcon}>
              <Ionicons name="school" size={30} color={colors.primary} />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.title}>
                {displayValue(school.name, "School")}
              </Text>

              <Text style={styles.subtitle}>
                School Code: {displayValue(school.code)}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: "/EditSchoolScreen",
                  params: {
                    id: school.id,
                  },
                })
              }
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />

              <Text style={styles.editButtonText}>Edit School</Text>
            </TouchableOpacity>
          </View>

          {/* -------------------------------- */}
          {/* School Information */}
          {/* -------------------------------- */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>School Information</Text>

            <View style={styles.infoGrid}>
              <InfoRow
                icon="school-outline"
                label="School Name"
                value={school.name}
              />

              <InfoRow
                icon="barcode-outline"
                label="School Code"
                value={school.code}
              />

              <InfoRow
                icon="location-outline"
                label="District"
                value={school.district}
              />

              <InfoRow
                icon="business-outline"
                label="School Type"
                value={school.type}
              />

              <InfoRow
                icon="map-outline"
                label="Address"
                value={school.address}
                fullWidth
              />
            </View>
          </View>

          {/* -------------------------------- */}
          {/* Contact Information */}
          {/* -------------------------------- */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Information</Text>

            <View style={styles.infoGrid}>
              <InfoRow icon="mail-outline" label="Email" value={school.email} />

              <InfoRow icon="call-outline" label="Phone" value={school.phone} />
            </View>
          </View>

          {/* -------------------------------- */}
          {/* Administration */}
          {/* -------------------------------- */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administration</Text>

            <View style={styles.infoGrid}>
              <InfoRow
                icon="person-outline"
                label="Principal"
                value={school.principalName}
              />
            </View>
          </View>

          {/* -------------------------------- */}
          {/* Capacity */}
          {/* -------------------------------- */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>School Capacity</Text>

            <View style={styles.capacityGrid}>
              <View style={styles.capacityCard}>
                <View style={styles.capacityIcon}>
                  <Ionicons
                    name="people-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.capacityLabel}>Total Capacity</Text>

                <Text style={styles.capacityValue}>
                  {displayValue(school.capacity, "0")}
                </Text>

                <Text style={styles.capacityDescription}>Maximum students</Text>
              </View>

              <View style={styles.capacityCard}>
                <View style={styles.capacityIcon}>
                  <Ionicons
                    name="person-add-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.capacityLabel}>Available Seats</Text>

                <Text style={styles.capacityValue}>
                  {displayValue(school.availableSeats, "0")}
                </Text>

                <Text style={styles.capacityDescription}>
                  Seats currently available
                </Text>
              </View>

              <View style={styles.capacityCard}>
                <View style={styles.capacityIcon}>
                  <Ionicons
                    name="people-circle-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.capacityLabel}>Occupied Seats</Text>

                <Text style={styles.capacityValue}>
                  {Math.max(
                    0,
                    Number(school.capacity || 0) -
                      Number(school.availableSeats || 0),
                  )}
                </Text>

                <Text style={styles.capacityDescription}>
                  Currently occupied
                </Text>
              </View>
            </View>
          </View>

          {/* -------------------------------- */}
          {/* Status */}
          {/* -------------------------------- */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>School Status</Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  school.active ? styles.statusActive : styles.statusInactive,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  school.active
                    ? styles.statusTextActive
                    : styles.statusTextInactive,
                ]}
              >
                {school.active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* -------------------------------- */}
          {/* Image URL */}
          {/* -------------------------------- */}

          {school.imageUrl ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>School Image</Text>

              <View style={styles.urlBox}>
                <Ionicons
                  name="image-outline"
                  size={20}
                  color={colors.primary}
                />

                <Text style={styles.urlText} numberOfLines={2}>
                  {school.imageUrl}
                </Text>
              </View>
            </View>
          ) : null}

          {/* -------------------------------- */}
          {/* Description */}
          {/* -------------------------------- */}

          {school.description ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Description</Text>

              <View style={styles.descriptionBox}>
                <Text style={styles.descriptionText}>{school.description}</Text>
              </View>
            </View>
          ) : null}

          {/* -------------------------------- */}
          {/* Created Date */}
          {/* -------------------------------- */}

          {school.createdDate ? (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Record Information</Text>

              <View style={styles.createdRow}>
                <Ionicons
                  name="calendar-outline"
                  size={18}
                  color={colors.text.muted}
                />

                <Text style={styles.createdLabel}>Created Date:</Text>

                <Text style={styles.createdValue}>{school.createdDate}</Text>
              </View>
            </View>
          ) : null}

          {/* Bottom Action */}

          <View style={styles.bottomActions}>
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="arrow-back-outline"
                size={18}
                color={colors.text.secondary}
              />

              <Text style={styles.secondaryButtonText}>Back</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() =>
                router.push({
                  pathname: "/EditSchoolScreen",
                  params: {
                    id: school.id,
                  },
                })
              }
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />

              <Text style={styles.primaryButtonText}>Edit School</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContent: {
    padding: 24,
    flexGrow: 1,
  },

  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 28,
    borderWidth: 1,
    borderColor: colors.border,
    width: "100%",
    maxWidth: 1100,
    alignSelf: "center",
  },

  backBtn: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    gap: 8,
    alignSelf: "flex-start",
  },

  backText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },

  schoolIcon: {
    width: 64,
    height: 64,
    borderRadius: 14,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
  },

  headerContent: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text.primary,
  },

  subtitle: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: 5,
  },

  editButton: {
    height: 44,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },

  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  infoItem: {
    flex: 1,
    minWidth: 280,
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  infoItemFull: {
    flexBasis: "100%",
  },

  infoIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: colors.text.muted,
    marginBottom: 5,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
  },

  capacityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  capacityCard: {
    flex: 1,
    minWidth: 220,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  capacityIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  capacityLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: "500",
  },

  capacityValue: {
    fontSize: 28,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 4,
  },

  capacityDescription: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 3,
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 8,
  },

  statusActive: {
    backgroundColor: "#22C55E",
  },

  statusInactive: {
    backgroundColor: "#EF4444",
  },

  statusText: {
    fontSize: 13,
    fontWeight: "600",
  },

  statusTextActive: {
    color: "#16A34A",
  },

  statusTextInactive: {
    color: "#DC2626",
  },

  urlBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    gap: 10,
  },

  urlText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
  },

  descriptionBox: {
    padding: 18,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: colors.text.secondary,
  },

  createdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  createdLabel: {
    fontSize: 13,
    color: colors.text.muted,
  },

  createdValue: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  bottomActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  secondaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  primaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.text.secondary,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 30,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 16,
  },

  emptyText: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },

  backButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
