// app/EduSchoolAdminDetailsScreen.js

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

export default function EduSchoolAdminDetailsScreen() {
  const { id } = useLocalSearchParams();

  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // =========================================================
  // LOAD SCHOOL ADMIN
  // =========================================================

  useEffect(() => {
    if (id) {
      loadSchoolAdmin();
    }
  }, [id]);

  const loadSchoolAdmin = async () => {
    try {
      setLoading(true);

      console.log("Loading school admin details:", id);

      const response = await apiClient.get(`/school-admins/${id}`);

      console.log(
        "School admin details response:",
        JSON.stringify(response.data, null, 2),
      );

      setAdmin(response.data);
    } catch (error) {
      console.error("Load school admin details error:", error);

      const responseData = error?.response?.data;

      Alert.alert(
        "Error",
        responseData?.message ||
          responseData?.error ||
          error?.message ||
          "Unable to load school admin details.",
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

  // =========================================================
  // DISPLAY VALUE
  // =========================================================

  const displayValue = (value, fallback = "Not provided") => {
    if (value === null || value === undefined || String(value).trim() === "") {
      return fallback;
    }

    return String(value);
  };

  // =========================================================
  // PASSWORD
  // =========================================================

  const getPassword = () => {
    if (
      admin?.password === null ||
      admin?.password === undefined ||
      String(admin.password).trim() === ""
    ) {
      return "Not provided";
    }

    return String(admin.password);
  };

  // =========================================================
  // STATUS
  // =========================================================

  const isAdminEnabled = () => {
    if (typeof admin?.enabled === "boolean") {
      return admin.enabled;
    }

    return String(admin?.status || "").toLowerCase() === "active";
  };

  // =========================================================
  // INFORMATION ROW
  // =========================================================

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

  // =========================================================
  // PASSWORD ROW
  // =========================================================

  const PasswordRow = () => {
    const password = getPassword();
    const hasPassword = password !== "Not provided";

    return (
      <View style={styles.infoItem}>
        <View style={styles.infoIcon}>
          <Ionicons
            name="lock-closed-outline"
            size={18}
            color={colors.primary}
          />
        </View>

        <View style={styles.infoContent}>
          <Text style={styles.infoLabel}>Password</Text>

          <View style={styles.passwordContainer}>
            <Text
              style={styles.passwordText}
              numberOfLines={1}
              ellipsizeMode="middle"
            >
              {hasPassword
                ? showPassword
                  ? password
                  : "••••••••"
                : "Not provided"}
            </Text>

            {hasPassword && (
              <TouchableOpacity
                style={styles.passwordToggle}
                onPress={() => setShowPassword((previous) => !previous)}
              >
                <Ionicons
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    );
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>
            Loading school admin details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // =========================================================
  // ADMIN NOT FOUND
  // =========================================================

  if (!admin) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <Ionicons name="person-outline" size={50} color={colors.text.muted} />

          <Text style={styles.emptyTitle}>School Admin not found</Text>

          <Text style={styles.emptyText}>
            The requested school administrator could not be found.
          </Text>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Back to School Admins</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const active = isAdminEnabled();

  // =========================================================
  // MAIN SCREEN
  // =========================================================

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          {/* =================================================
              BACK
          ================================================= */}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={colors.text.primary} />

            <Text style={styles.backText}>Back to School Admins</Text>
          </TouchableOpacity>

          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.header}>
            <View style={styles.adminIcon}>
              <Ionicons name="person" size={30} color={colors.primary} />
            </View>

            <View style={styles.headerContent}>
              <Text style={styles.title}>
                {displayValue(admin.name, "School Admin")}
              </Text>

              <Text style={styles.subtitle}>School Administrator</Text>
            </View>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                router.push({
                  pathname: "/EditSchoolAdminScreen",
                  params: {
                    id: String(admin.id),
                  },
                })
              }
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />

              <Text style={styles.editButtonText}>Edit Admin</Text>
            </TouchableOpacity>
          </View>

          {/* =================================================
              ADMIN INFORMATION
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Administrator Information</Text>

            <View style={styles.infoGrid}>
              <InfoRow icon="person-outline" label="Name" value={admin.name} />

              <InfoRow icon="mail-outline" label="Email" value={admin.email} />

              <InfoRow icon="call-outline" label="Phone" value={admin.phone} />

              <PasswordRow />

              <InfoRow
                icon="finger-print-outline"
                label="Admin ID"
                value={admin.id}
                fullWidth
              />
            </View>
          </View>

          {/* =================================================
              SCHOOL INFORMATION
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Assigned School</Text>

            <View style={styles.infoGrid}>
              <InfoRow
                icon="school-outline"
                label="School Name"
                value={admin.schoolName}
              />

              <InfoRow
                icon="business-outline"
                label="School ID"
                value={admin.schoolId}
              />
            </View>
          </View>

          {/* =================================================
              ACCOUNT STATUS
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Status</Text>

            <View style={styles.statusRow}>
              <View
                style={[
                  styles.statusDot,
                  active ? styles.statusActive : styles.statusInactive,
                ]}
              />

              <Text
                style={[
                  styles.statusText,
                  active ? styles.statusTextActive : styles.statusTextInactive,
                ]}
              >
                {active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* =================================================
              ACCOUNT SUMMARY
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Summary</Text>

            <View style={styles.summaryGrid}>
              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Ionicons
                    name="person-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.summaryLabel}>Account Type</Text>

                <Text style={styles.summaryValue}>School Admin</Text>

                <Text style={styles.summaryDescription}>
                  School administrator account
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Ionicons
                    name="school-outline"
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.summaryLabel}>Assigned School</Text>

                <Text style={styles.summaryValue} numberOfLines={2}>
                  {displayValue(admin.schoolName, "Not assigned")}
                </Text>

                <Text style={styles.summaryDescription}>
                  Current school assignment
                </Text>
              </View>

              <View style={styles.summaryCard}>
                <View style={styles.summaryIcon}>
                  <Ionicons
                    name={
                      active
                        ? "checkmark-circle-outline"
                        : "close-circle-outline"
                    }
                    size={24}
                    color={colors.primary}
                  />
                </View>

                <Text style={styles.summaryLabel}>Account Status</Text>

                <Text style={styles.summaryValue}>
                  {active ? "Active" : "Inactive"}
                </Text>

                <Text style={styles.summaryDescription}>
                  Current account state
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              PERMISSIONS
          ================================================= */}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Permissions</Text>

            <View style={styles.permissionBox}>
              <View style={styles.permissionIcon}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.permissionContent}>
                <Text style={styles.permissionTitle}>School Administrator</Text>

                <Text style={styles.permissionDescription}>
                  This account manages operations for the assigned school.
                </Text>
              </View>
            </View>
          </View>

          {/* =================================================
              BOTTOM ACTIONS
          ================================================= */}

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
                  pathname: "/EditSchoolAdminScreen",
                  params: {
                    id: String(admin.id),
                  },
                })
              }
            >
              <Ionicons name="create-outline" size={18} color="#FFFFFF" />

              <Text style={styles.primaryButtonText}>Edit Admin</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// =========================================================
// STYLES
// =========================================================

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

  // =========================================================
  // BACK
  // =========================================================

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

  // =========================================================
  // HEADER
  // =========================================================

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },

  adminIcon: {
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

  // =========================================================
  // SECTION
  // =========================================================

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },

  // =========================================================
  // INFO GRID
  // =========================================================

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

  // =========================================================
  // PASSWORD
  // =========================================================

  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: 22,
  },

  passwordText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.primary,
    marginRight: 8,
  },

  passwordToggle: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primaryLight,
  },

  // =========================================================
  // STATUS
  // =========================================================

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

  // =========================================================
  // SUMMARY
  // =========================================================

  summaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  summaryCard: {
    flex: 1,
    minWidth: 220,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  summaryIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },

  summaryLabel: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: "500",
  },

  summaryValue: {
    fontSize: 20,
    fontWeight: "700",
    color: colors.text.primary,
    marginTop: 5,
  },

  summaryDescription: {
    fontSize: 12,
    color: colors.text.muted,
    marginTop: 5,
  },

  // =========================================================
  // PERMISSIONS
  // =========================================================

  permissionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  permissionIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  permissionContent: {
    flex: 1,
  },

  permissionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 5,
  },

  permissionDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: colors.text.secondary,
  },

  // =========================================================
  // BOTTOM ACTIONS
  // =========================================================

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

  // =========================================================
  // LOADING
  // =========================================================

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

  // =========================================================
  // EMPTY
  // =========================================================

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
