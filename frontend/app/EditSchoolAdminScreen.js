import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import apiClient from "../src/api/apiClient";
import { colors } from "../theme/colors";

export default function EditSchoolAdminScreen() {
  const { id } = useLocalSearchParams();

  const adminId = Array.isArray(id) ? id[0] : id;

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // New password only
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ======================================================
  // LOAD SCHOOL ADMIN
  // ======================================================

  useEffect(() => {
    if (!adminId) {
      setLoading(false);

      Alert.alert("Error", "School Admin ID is missing.", [
        {
          text: "OK",
          onPress: () => router.replace("/EduSchoolAdminsScreen"),
        },
      ]);

      return;
    }

    loadSchoolAdmin();
  }, [adminId]);

  const loadSchoolAdmin = async () => {
    try {
      setLoading(true);

      console.log("=================================");
      console.log("LOADING SCHOOL ADMIN");
      console.log("Admin ID:", adminId);
      console.log("=================================");

      const response = await apiClient.get(`/school-admins/${adminId}`);

      console.log("School Admin response:", response.data);

      const admin = response.data;

      setName(admin.name ?? "");
      setUsername(admin.username ?? "");
      setEmail(admin.email ?? "");
      setPhone(admin.phone ?? "");
      setSchoolId(admin.schoolId ?? "");
      setSchoolName(admin.schoolName ?? "");

      // IMPORTANT:
      // Never load the existing password from backend.
      //
      // The backend stores a BCrypt encrypted password.
      // This field is ONLY for entering a NEW password.
      setPassword("");
    } catch (error) {
      console.error("=================================");
      console.error("LOAD SCHOOL ADMIN ERROR");
      console.error(error);
      console.error("Response:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      console.error("=================================");

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to load school admin details.";

      Alert.alert("Error", message, [
        {
          text: "OK",
          onPress: () => router.replace("/EduSchoolAdminsScreen"),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // BACK
  // ======================================================

  const handleBack = () => {
    if (saving) {
      return;
    }

    router.replace("/EduSchoolAdminsScreen");
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    // Name
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required.");
      return false;
    }

    // Username
    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }

    // Email
    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required.");
      return false;
    }

    // ==================================================
    // CORRECT EMAIL REGEX
    // ==================================================

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    // Phone
    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone is required.");
      return false;
    }

    // School ID
    if (!schoolId.trim()) {
      Alert.alert("Validation Error", "School ID is required.");
      return false;
    }

    // School Name
    if (!schoolName.trim()) {
      Alert.alert("Validation Error", "School name is required.");
      return false;
    }

    // Password is optional.
    // Only validate when a new password is entered.
    if (password.trim() !== "" && password.trim().length < 6) {
      Alert.alert(
        "Validation Error",
        "New password must be at least 6 characters.",
      );

      return false;
    }

    return true;
  };

  // ======================================================
  // UPDATE SCHOOL ADMIN
  // ======================================================

  const handleSubmit = async () => {
    // Prevent double click
    if (saving) {
      return;
    }

    // Check admin ID
    if (!adminId) {
      Alert.alert("Error", "School Admin ID is missing.");
      return;
    }

    // Validate
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // ==================================================
      // PREPARE UPDATE DATA
      // ==================================================

      const trimmedPassword = password.trim();

      const adminData = {
        username: username.trim(),
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        schoolId: schoolId.trim(),
        schoolName: schoolName.trim(),

        // IMPORTANT:
        // Only send password when user entered
        // a new password.
        ...(trimmedPassword
          ? {
              password: trimmedPassword,
            }
          : {}),
      };

      console.log("=================================");
      console.log("UPDATING SCHOOL ADMIN");
      console.log("Admin ID:", adminId);

      console.log("Update data:", {
        ...adminData,
        password: trimmedPassword ? "********" : "(unchanged)",
      });

      console.log("=================================");

      // ==================================================
      // PUT REQUEST
      // ==================================================

      const response = await apiClient.put(
        `/school-admins/${adminId}`,
        adminData,
      );

      console.log("=================================");
      console.log("UPDATE SUCCESSFUL");
      console.log("Response:", response.data);
      console.log("=================================");

      // ==================================================
      // SUCCESSFUL UPDATE
      // ==================================================

      console.log("Navigating to EduSchoolAdminDetailsScreen...");

      console.log("Admin ID:", adminId);

      // IMPORTANT:
      //
      // Do NOT use:
      //
      // router.replace("/EduSchoolAdminsScreen");
      //
      // because that goes to the list.
      //
      // Instead, navigate directly to the
      // School Admin Details screen.

      router.replace({
        pathname: "/EduSchoolAdminDetailsScreen",

        params: {
          id: adminId,

          // Only pass the new password
          // when the user actually changed it.
          ...(trimmedPassword
            ? {
                updatedPassword: trimmedPassword,
              }
            : {}),
        },
      });
    } catch (error) {
      console.error("=================================");
      console.error("UPDATE SCHOOL ADMIN ERROR");
      console.error(error);
      console.error("Response:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      console.error("=================================");

      const responseData = error?.response?.data;

      let message = "Unable to update school admin.";

      // ==================================================
      // VALIDATION ERRORS
      // ==================================================

      if (responseData?.errors) {
        if (typeof responseData.errors === "object") {
          message = Object.values(responseData.errors).join("\n");
        } else {
          message = String(responseData.errors);
        }
      }

      // ==================================================
      // BACKEND MESSAGE
      // ==================================================
      else if (responseData?.message) {
        message = responseData.message;
      }

      // ==================================================
      // BACKEND ERROR
      // ==================================================
      else if (responseData?.error) {
        message = responseData.error;
      }

      // ==================================================
      // AXIOS ERROR
      // ==================================================
      else if (error?.message) {
        message = error.message;
      }

      // ==================================================
      // DUPLICATE USERNAME
      // ==================================================

      const backendMessage =
        responseData?.message?.toString()?.toLowerCase() || "";

      if (
        backendMessage.includes("username already exists") ||
        backendMessage.includes("username already taken") ||
        backendMessage.includes("duplicate username")
      ) {
        message =
          "Username already exists. Please choose a different username.";
      }

      // ==================================================
      // DUPLICATE EMAIL
      // ==================================================

      if (
        backendMessage.includes("email already exists") ||
        backendMessage.includes("email already taken") ||
        backendMessage.includes("duplicate email")
      ) {
        message = "Email already exists. Please use a different email address.";
      }

      Alert.alert("Update Failed", message);
    } finally {
      setSaving(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>
            Loading school admin details...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.mainCard}>
            {/* HEADER */}

            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>

              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Edit School Admin</Text>

                <View style={styles.breadcrumbRow}>
                  <Text style={styles.breadcrumbMuted}>Dashboard</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={colors.text.muted}
                    style={styles.breadcrumbIcon}
                  />

                  <Text style={styles.breadcrumbMuted}>School Admins</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={colors.text.muted}
                    style={styles.breadcrumbIcon}
                  />

                  <Text style={styles.breadcrumbActive}>Edit</Text>
                </View>
              </View>
            </View>

            {/* ADMIN INFORMATION */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Administrator Information</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name *</Text>

                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter admin name"
                    placeholderTextColor={colors.text.placeholder}
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Username *</Text>

                  <TextInput
                    style={styles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="Enter username"
                    placeholderTextColor={colors.text.placeholder}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email *</Text>

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="admin@example.com"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Phone *</Text>

                  <TextInput
                    style={styles.input}
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="Enter phone number"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="phone-pad"
                    editable={!saving}
                  />
                </View>
              </View>

              {/* PASSWORD */}

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>New Password</Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter new password"
                    placeholderTextColor={colors.text.placeholder}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                  />

                  <TouchableOpacity
                    style={styles.passwordIconButton}
                    onPress={() => setShowPassword((prev) => !prev)}
                    disabled={saving}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.helperText}>
                  Leave empty to keep the current password.
                </Text>
              </View>
            </View>

            {/* ASSIGNED SCHOOL */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Assigned School</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>School ID *</Text>

                  <TextInput
                    style={styles.input}
                    value={schoolId}
                    onChangeText={setSchoolId}
                    placeholder="Enter school ID"
                    placeholderTextColor={colors.text.placeholder}
                    editable={!saving}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>School Name *</Text>

                  <TextInput
                    style={styles.input}
                    value={schoolName}
                    onChangeText={setSchoolName}
                    placeholder="Enter school name"
                    placeholderTextColor={colors.text.placeholder}
                    editable={!saving}
                  />
                </View>
              </View>
            </View>

            {/* PASSWORD INFORMATION */}

            <View style={styles.securityBox}>
              <View style={styles.securityIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Password</Text>

                <Text style={styles.securityText}>
                  Enter a new password only if you want to change the existing
                  password. Leave the field empty to keep the current password.
                </Text>
              </View>
            </View>

            {/* BUTTONS */}

            <View style={styles.buttonDivider} />

            <View style={styles.buttonsRow}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBack}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.updateButton,
                  saving && styles.updateButtonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={saving}
                activeOpacity={0.8}
              >
                {saving ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />

                    <Text style={styles.updateButtonText}>Updating...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="save-outline" size={17} color="#FFFFFF" />

                    <Text style={styles.updateButtonText}>Update Admin</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ======================================================
// STYLES
// ======================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  keyboardContainer: {
    flex: 1,
  },

  scrollContainer: {
    padding: 24,
    flexGrow: 1,
  },

  mainCard: {
    width: "100%",
    maxWidth: 1000,
    alignSelf: "center",
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },

      android: {
        elevation: 2,
      },

      web: {
        boxShadow: "0 4px 16px rgba(0,0,0,0.03)",
      },
    }),
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  headerTextContainer: {
    flex: 1,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },

  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  breadcrumbMuted: {
    fontSize: 13,
    color: colors.text.muted,
  },

  breadcrumbActive: {
    fontSize: 13,
    color: colors.primary,
    fontWeight: "500",
  },

  breadcrumbIcon: {
    marginHorizontal: 4,
  },

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 14,
  },

  formRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  formGroup: {
    flex: 1,
  },

  formGroupFull: {
    width: "100%",
    marginBottom: 16,
  },

  label: {
    fontSize: 12,
    fontWeight: "500",
    color: colors.text.primary,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    height: 38,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text.primary,
  },

  passwordContainer: {
    width: "100%",
    height: 38,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    backgroundColor: "#FFFFFF",
  },

  passwordInput: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 12,
    fontSize: 13,
    color: colors.text.primary,
  },

  passwordIconButton: {
    width: 42,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },

  helperText: {
    fontSize: 11,
    color: colors.text.muted,
    marginTop: 6,
  },

  securityBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 16,
    marginBottom: 24,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
  },

  securityIcon: {
    width: 42,
    height: 42,
    borderRadius: 9,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  securityContent: {
    flex: 1,
  },

  securityTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 4,
  },

  securityText: {
    fontSize: 12,
    lineHeight: 18,
    color: colors.text.secondary,
  },

  buttonDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginBottom: 8,
  },

  buttonsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
    paddingTop: 0,
  },

  cancelButton: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelButtonText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },

  updateButton: {
    height: 36,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  updateButtonDisabled: {
    opacity: 0.65,
  },

  updateButtonText: {
    fontSize: 13,
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
    color: colors.text.muted,
  },
});
