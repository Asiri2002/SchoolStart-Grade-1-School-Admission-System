// app/AddSchoolAdminScreen.js

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";

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

export default function AddSchoolAdminScreen() {
  // ======================================================
  // FORM STATE
  // ======================================================

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolId, setSchoolId] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [saving, setSaving] = useState(false);

  // ======================================================
  // BACK
  // ======================================================

  const handleBack = () => {
    router.replace("/EduSchoolAdminsScreen");
  };

  // ======================================================
  // VALIDATION
  // ======================================================

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "Name is required.");
      return false;
    }

    if (!username.trim()) {
      Alert.alert("Validation Error", "Username is required.");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required.");
      return false;
    }

    // FIXED EMAIL REGEX
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone is required.");
      return false;
    }

    if (!schoolId.trim()) {
      Alert.alert("Validation Error", "School ID is required.");
      return false;
    }

    if (!schoolName.trim()) {
      Alert.alert("Validation Error", "School name is required.");
      return false;
    }

    if (!password.trim()) {
      Alert.alert("Validation Error", "Password is required.");
      return false;
    }

    if (password.trim().length < 6) {
      Alert.alert(
        "Validation Error",
        "Password must be at least 6 characters.",
      );
      return false;
    }

    if (!confirmPassword.trim()) {
      Alert.alert("Validation Error", "Please confirm the password.");
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert("Validation Error", "Passwords do not match.");
      return false;
    }

    return true;
  };

  // ======================================================
  // ADD SCHOOL ADMIN
  // ======================================================

  const handleSubmit = async () => {
    // Prevent double click
    if (saving) {
      return;
    }

    // Validate form
    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      // ==================================================
      // ADMIN DATA
      // ==================================================

      const adminData = {
        username: username.trim(),
        email: email.trim(),
        name: name.trim(),
        phone: phone.trim(),
        schoolId: schoolId.trim(),
        schoolName: schoolName.trim(),
        password: password.trim(),
      };

      // ==================================================
      // DEBUG
      // ==================================================

      console.log("=================================");
      console.log("CREATING SCHOOL ADMIN");
      console.log("Admin data:", {
        ...adminData,
        password: "********",
      });
      console.log("=================================");

      // ==================================================
      // CREATE ADMIN
      // ==================================================

      const response = await apiClient.post("/school-admins", adminData);

      console.log("=================================");
      console.log("SCHOOL ADMIN CREATED SUCCESSFULLY");
      console.log("Create response:", response.data);
      console.log("=================================");

      // ==================================================
      // IMPORTANT
      // SAVE SUCCESSFULLY
      // THEN GO TO SCHOOL ADMINS SCREEN
      // ==================================================

      router.replace("/EduSchoolAdminsScreen");
    } catch (error) {
      // ==================================================
      // ERROR
      // ==================================================

      console.error("=================================");
      console.error("CREATE SCHOOL ADMIN ERROR");
      console.error(error);
      console.error("Response:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      console.error("=================================");

      const responseData = error?.response?.data;

      let message = "Unable to create school admin.";

      if (responseData?.errors) {
        message = Object.values(responseData.errors).join("\n");
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert("Creation Failed", message);
    } finally {
      setSaving(false);
    }
  };

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
            {/* ==================================================
                HEADER
            ================================================== */}

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
                <Text style={styles.title}>Add School Admin</Text>

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

                  <Text style={styles.breadcrumbActive}>Add</Text>
                </View>
              </View>
            </View>

            {/* ==================================================
                ADMINISTRATOR INFORMATION
            ================================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Administrator Information</Text>

              {/* Name / Username */}

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Name *</Text>

                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter admin name"
                    placeholderTextColor={colors.text.placeholder}
                    autoCapitalize="words"
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

              {/* Email / Phone */}

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
            </View>

            {/* ==================================================
                ASSIGNED SCHOOL
            ================================================== */}

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
                    autoCapitalize="none"
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
                    autoCapitalize="words"
                    editable={!saving}
                  />
                </View>
              </View>
            </View>

            {/* ==================================================
                LOGIN CREDENTIALS
            ================================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Login Credentials</Text>

              {/* Password */}

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Password *</Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter password"
                    placeholderTextColor={colors.text.placeholder}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                  />

                  <TouchableOpacity
                    style={styles.passwordIconButton}
                    onPress={() => setShowPassword((previous) => !previous)}
                    disabled={saving}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>

                <Text style={styles.helperText}>
                  Password must be at least 6 characters.
                </Text>
              </View>

              {/* Confirm Password */}

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Confirm Password *</Text>

                <View style={styles.passwordContainer}>
                  <TextInput
                    style={styles.passwordInput}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.text.placeholder}
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    editable={!saving}
                  />

                  <TouchableOpacity
                    style={styles.passwordIconButton}
                    onPress={() =>
                      setShowConfirmPassword((previous) => !previous)
                    }
                    disabled={saving}
                  >
                    <Ionicons
                      name={
                        showConfirmPassword ? "eye-off-outline" : "eye-outline"
                      }
                      size={20}
                      color={colors.text.secondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* ==================================================
                SECURITY INFORMATION
            ================================================== */}

            <View style={styles.securityBox}>
              <View style={styles.securityIcon}>
                <Ionicons
                  name="lock-closed-outline"
                  size={22}
                  color={colors.primary}
                />
              </View>

              <View style={styles.securityContent}>
                <Text style={styles.securityTitle}>Account Security</Text>

                <Text style={styles.securityText}>
                  A password is required when creating a new School Admin
                  account. The password should be kept secure and should not be
                  shared with other users.
                </Text>
              </View>
            </View>

            {/* ==================================================
                BUTTONS
            ================================================== */}

            <View style={styles.buttonDivider} />

            <View style={styles.buttonsRow}>
              {/* Cancel */}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={handleBack}
                disabled={saving}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Add Admin */}

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

                    <Text style={styles.updateButtonText}>Creating...</Text>
                  </>
                ) : (
                  <>
                    <Ionicons
                      name="person-add-outline"
                      size={17}
                      color="#FFFFFF"
                    />

                    <Text style={styles.updateButtonText}>Add Admin</Text>
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

  // HEADER

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

  // SECTIONS

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

  // PASSWORD

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

  // SECURITY

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

  // BUTTONS

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
});
