// app/EditSchoolScreen.js

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

export default function EditSchoolScreen() {
  const { id } = useLocalSearchParams();

  const schoolId = Array.isArray(id) ? id[0] : id;

  // --------------------------------------------------
  // Form states
  // --------------------------------------------------

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [district, setDistrict] = useState("");
  const [type, setType] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [principalName, setPrincipalName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [availableSeats, setAvailableSeats] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");

  // --------------------------------------------------
  // Loading states
  // --------------------------------------------------

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // --------------------------------------------------
  // Load school
  // --------------------------------------------------

  useEffect(() => {
    if (!schoolId) {
      setLoading(false);
      Alert.alert("Error", "School ID is missing.");
      return;
    }

    loadSchool();
  }, [schoolId]);

  const loadSchool = async () => {
    try {
      setLoading(true);

      console.log("Loading school:", schoolId);

      const response = await apiClient.get(`/schools/${schoolId}`);

      console.log("School response:", response.data);

      const school = response.data;

      setName(school.name ?? "");
      setCode(school.code ?? "");
      setDistrict(school.district ?? "");
      setType(school.type ?? "");
      setAddress(school.address ?? "");
      setEmail(school.email ?? "");
      setPhone(school.phone ?? "");
      setPrincipalName(school.principalName ?? "");
      setCapacity(
        school.capacity !== undefined && school.capacity !== null
          ? String(school.capacity)
          : "",
      );
      setAvailableSeats(
        school.availableSeats !== undefined && school.availableSeats !== null
          ? String(school.availableSeats)
          : "",
      );
      setImageUrl(school.imageUrl ?? "");
      setDescription(school.description ?? "");
    } catch (error) {
      console.error("Load school error:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        "Unable to load school details.";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Back
  // --------------------------------------------------

  const handleBack = () => {
    router.replace("/EduSchoolsScreen");
  };

  // --------------------------------------------------
  // Validation
  // --------------------------------------------------

  const validateForm = () => {
    if (!name.trim()) {
      Alert.alert("Validation Error", "School name is required.");
      return false;
    }

    if (!code.trim()) {
      Alert.alert("Validation Error", "School code is required.");
      return false;
    }

    if (!district.trim()) {
      Alert.alert("Validation Error", "District is required.");
      return false;
    }

    if (!type.trim()) {
      Alert.alert("Validation Error", "School type is required.");
      return false;
    }

    if (!address.trim()) {
      Alert.alert("Validation Error", "Address is required.");
      return false;
    }

    if (!email.trim()) {
      Alert.alert("Validation Error", "Email is required.");
      return false;
    }

    if (!phone.trim()) {
      Alert.alert("Validation Error", "Phone is required.");
      return false;
    }

    if (!principalName.trim()) {
      Alert.alert("Validation Error", "Principal name is required.");
      return false;
    }

    if (!capacity.trim()) {
      Alert.alert("Validation Error", "Capacity is required.");
      return false;
    }

    if (Number(capacity) <= 0) {
      Alert.alert("Validation Error", "Capacity must be greater than 0.");
      return false;
    }

    if (!availableSeats.trim()) {
      Alert.alert("Validation Error", "Available seats are required.");
      return false;
    }

    if (Number(availableSeats) < 0) {
      Alert.alert("Validation Error", "Available seats cannot be negative.");
      return false;
    }

    if (Number(availableSeats) > Number(capacity)) {
      Alert.alert(
        "Validation Error",
        "Available seats cannot be greater than capacity.",
      );
      return false;
    }

    return true;
  };

  // --------------------------------------------------
  // Update school
  // --------------------------------------------------

  const handleSubmit = async () => {
    if (saving) {
      return;
    }

    if (!schoolId) {
      Alert.alert("Error", "School ID is missing.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSaving(true);

    try {
      const schoolData = {
        name: name.trim(),
        code: code.trim(),
        district: district.trim(),
        type: type.trim(),
        address: address.trim(),
        email: email.trim(),
        phone: phone.trim(),
        principalName: principalName.trim(),
        capacity: Number(capacity),
        availableSeats: Number(availableSeats),
        imageUrl: imageUrl.trim(),
        description: description.trim(),
      };

      console.log("=================================");
      console.log("UPDATING SCHOOL");
      console.log("School ID:", schoolId);
      console.log("Update data:", schoolData);
      console.log("=================================");

      const response = await apiClient.put(`/schools/${schoolId}`, schoolData);

      console.log("Update response:", response.data);

      // ----------------------------------------------
      // IMPORTANT
      // Navigate immediately after successful update.
      // ----------------------------------------------

      router.replace("/EduSchoolsScreen");
    } catch (error) {
      console.error("=================================");
      console.error("UPDATE SCHOOL ERROR");
      console.error(error);
      console.error("Response:", error?.response?.data);
      console.error("Status:", error?.response?.status);
      console.error("=================================");

      const responseData = error?.response?.data;

      let message = "Unable to update school.";

      if (responseData?.errors) {
        message = Object.values(responseData.errors).join("\n");
      } else if (responseData?.message) {
        message = responseData.message;
      } else if (responseData?.error) {
        message = responseData.error;
      } else if (error?.message) {
        message = error.message;
      }

      Alert.alert("Update Failed", message);
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />

          <Text style={styles.loadingText}>Loading school details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

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
            {/* ==========================================
                HEADER
            ========================================== */}

            <View style={styles.headerRow}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>

              <View style={styles.headerTextContainer}>
                <Text style={styles.title}>Edit School</Text>

                <View style={styles.breadcrumbRow}>
                  <Text style={styles.breadcrumbMuted}>Dashboard</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={colors.text.muted}
                    style={styles.breadcrumbIcon}
                  />

                  <Text style={styles.breadcrumbMuted}>Schools</Text>

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

            {/* ==========================================
                BASIC INFORMATION
            ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Basic Information</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>School Name *</Text>

                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Enter school name"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>School Code *</Text>

                  <TextInput
                    style={styles.input}
                    value={code}
                    onChangeText={setCode}
                    placeholder="Enter school code"
                    placeholderTextColor={colors.text.placeholder}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>District *</Text>

                  <TextInput
                    style={styles.input}
                    value={district}
                    onChangeText={setDistrict}
                    placeholder="Enter district"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>School Type *</Text>

                  <TextInput
                    style={styles.input}
                    value={type}
                    onChangeText={setType}
                    placeholder="e.g. National, Private"
                    placeholderTextColor={colors.text.placeholder}
                  />
                </View>
              </View>

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Address *</Text>

                <TextInput
                  style={styles.input}
                  value={address}
                  onChangeText={setAddress}
                  placeholder="Enter school address"
                  placeholderTextColor={colors.text.placeholder}
                />
              </View>
            </View>

            {/* ==========================================
                CONTACT INFORMATION
            ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Email *</Text>

                  <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                    placeholder="school@example.com"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="email-address"
                    autoCapitalize="none"
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
                  />
                </View>
              </View>
            </View>

            {/* ==========================================
                ADMINISTRATION
            ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Administration</Text>

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Principal Name *</Text>

                <TextInput
                  style={styles.input}
                  value={principalName}
                  onChangeText={setPrincipalName}
                  placeholder="Enter principal name"
                  placeholderTextColor={colors.text.placeholder}
                />
              </View>
            </View>

            {/* ==========================================
                SCHOOL CAPACITY
            ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>School Capacity</Text>

              <View style={styles.formRow}>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Capacity *</Text>

                  <TextInput
                    style={styles.input}
                    value={capacity}
                    onChangeText={(text) => {
                      setCapacity(text.replace(/[^0-9]/g, ""));
                    }}
                    placeholder="Enter capacity"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Available Seats *</Text>

                  <TextInput
                    style={styles.input}
                    value={availableSeats}
                    onChangeText={(text) => {
                      setAvailableSeats(text.replace(/[^0-9]/g, ""));
                    }}
                    placeholder="Enter available seats"
                    placeholderTextColor={colors.text.placeholder}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>

            {/* ==========================================
                ADDITIONAL INFORMATION
            ========================================== */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Image URL</Text>

                <TextInput
                  style={styles.input}
                  value={imageUrl}
                  onChangeText={setImageUrl}
                  placeholder="https://example.com/image.jpg"
                  placeholderTextColor={colors.text.placeholder}
                  autoCapitalize="none"
                  keyboardType="url"
                />
              </View>

              <View style={styles.formGroupFull}>
                <Text style={styles.label}>Description</Text>

                <TextInput
                  style={[styles.input, styles.descriptionInput]}
                  value={description}
                  onChangeText={setDescription}
                  placeholder="Enter school description"
                  placeholderTextColor={colors.text.placeholder}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </View>

            {/* ==========================================
                BUTTONS
            ========================================== */}

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

                    <Text style={styles.updateButtonText}>Update School</Text>
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

  // Header

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

  // Sections

  section: {
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 14,
  },

  // Forms

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

  descriptionInput: {
    height: 80,
    paddingTop: 10,
    paddingBottom: 10,
  },

  // Buttons

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

  // Loading

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
