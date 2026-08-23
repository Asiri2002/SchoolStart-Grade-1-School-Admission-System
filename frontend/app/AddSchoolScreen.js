// app/AddSchoolScreen.js

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

export default function AddSchoolScreen() {
  const [form, setForm] = useState({
    name: "",
    code: "",
    district: "",
    type: "",
    address: "",
    email: "",
    phone: "",
    principalName: "",
    capacity: "",
    availableSeats: "",
    imageUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(false);

  // --------------------------------
  // Update form field
  // --------------------------------
  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // --------------------------------
  // Submit school
  // --------------------------------
  const handleSubmit = async () => {
    // --------------------------------
    // Required field validation
    // --------------------------------

    if (!form.name.trim()) {
      Alert.alert("Validation Error", "School name is required.");
      return;
    }

    if (!form.code.trim()) {
      Alert.alert("Validation Error", "School code is required.");
      return;
    }

    if (!form.district.trim()) {
      Alert.alert("Validation Error", "District is required.");
      return;
    }

    if (!form.type.trim()) {
      Alert.alert("Validation Error", "School type is required.");
      return;
    }

    if (!form.address.trim()) {
      Alert.alert("Validation Error", "School address is required.");
      return;
    }

    if (!form.email.trim()) {
      Alert.alert("Validation Error", "School email is required.");
      return;
    }

    // --------------------------------
    // Email validation
    // --------------------------------

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email.trim())) {
      Alert.alert("Validation Error", "Please enter a valid email address.");
      return;
    }

    if (!form.phone.trim()) {
      Alert.alert("Validation Error", "School phone number is required.");
      return;
    }

    if (!form.principalName.trim()) {
      Alert.alert("Validation Error", "Principal name is required.");
      return;
    }

    // --------------------------------
    // Capacity validation
    // --------------------------------

    const capacity = Number(form.capacity);
    const availableSeats = Number(form.availableSeats);

    if (form.capacity.trim() === "" || Number.isNaN(capacity) || capacity < 1) {
      Alert.alert("Validation Error", "Capacity must be at least 1.");
      return;
    }

    if (
      form.availableSeats.trim() === "" ||
      Number.isNaN(availableSeats) ||
      availableSeats < 0
    ) {
      Alert.alert("Validation Error", "Available seats cannot be negative.");
      return;
    }

    if (availableSeats > capacity) {
      Alert.alert(
        "Validation Error",
        "Available seats cannot be greater than capacity.",
      );
      return;
    }

    // --------------------------------
    // Request payload
    // --------------------------------

    const schoolData = {
      name: form.name.trim(),
      code: form.code.trim().toUpperCase(),
      district: form.district.trim(),
      type: form.type.trim(),
      address: form.address.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      principalName: form.principalName.trim(),
      capacity: capacity,
      availableSeats: availableSeats,
      imageUrl: form.imageUrl.trim() || null,
      description: form.description.trim() || null,
    };

    try {
      setLoading(true);

      console.log("Creating school:", JSON.stringify(schoolData, null, 2));

      // --------------------------------
      // Save school to backend
      // --------------------------------

      const response = await apiClient.post("/schools", schoolData);

      console.log(
        "School created successfully:",
        JSON.stringify(response.data, null, 2),
      );

      // --------------------------------
      // Navigate to EduSchoolsScreen
      // after successful save
      // --------------------------------

      router.replace("/EduSchoolsScreen");
    } catch (error) {
      console.error("Add school error:", error);

      const responseData = error?.response?.data;

      console.error("Backend response:", JSON.stringify(responseData, null, 2));

      // --------------------------------
      // Spring Boot validation errors
      // --------------------------------

      if (responseData?.errors) {
        console.error(
          "Validation errors:",
          JSON.stringify(responseData.errors, null, 2),
        );

        const validationMessage = Object.entries(responseData.errors)
          .map(([field, message]) => {
            return `${field}: ${message}`;
          })
          .join("\n");

        Alert.alert(
          "Validation Failed",
          validationMessage || "Please check the entered information.",
        );

        return;
      }

      // --------------------------------
      // Other backend errors
      // --------------------------------

      const message =
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        "Unable to create school.";

      Alert.alert("Error", message);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Reusable input
  // --------------------------------

  const renderInput = ({
    label,
    field,
    placeholder,
    keyboardType = "default",
    multiline = false,
    autoCapitalize = "sentences",
  }) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={[styles.input, multiline && styles.textArea]}
        value={form[field]}
        onChangeText={(value) => updateField(field, value)}
        placeholder={placeholder}
        placeholderTextColor={colors.text.placeholder}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
        editable={!loading}
      />
    </View>
  );

  // --------------------------------
  // Screen
  // --------------------------------

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {/* Back */}

            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.text.primary}
              />

              <Text style={styles.backText}>Back to Schools</Text>
            </TouchableOpacity>

            {/* Header */}

            <Text style={styles.title}>Add New School</Text>

            <Text style={styles.subtitle}>
              Create a new school in the education admission system.
            </Text>

            {/* School Information */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>School Information</Text>

              <View style={styles.formGrid}>
                {renderInput({
                  label: "School Name *",
                  field: "name",
                  placeholder: "Enter school name",
                  autoCapitalize: "words",
                })}

                {renderInput({
                  label: "School Code *",
                  field: "code",
                  placeholder: "e.g. SCH001",
                  autoCapitalize: "characters",
                })}

                {renderInput({
                  label: "District *",
                  field: "district",
                  placeholder: "e.g. Vavuniya",
                  autoCapitalize: "words",
                })}

                {renderInput({
                  label: "School Type *",
                  field: "type",
                  placeholder: "e.g. Government",
                  autoCapitalize: "words",
                })}
              </View>
            </View>

            {/* Contact Information */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Information</Text>

              {renderInput({
                label: "Address *",
                field: "address",
                placeholder: "Enter school address",
                multiline: true,
              })}

              <View style={styles.formGrid}>
                {renderInput({
                  label: "Email *",
                  field: "email",
                  placeholder: "school@example.com",
                  keyboardType: "email-address",
                  autoCapitalize: "none",
                })}

                {renderInput({
                  label: "Phone *",
                  field: "phone",
                  placeholder: "+94 XX XXX XXXX",
                  keyboardType: "phone-pad",
                  autoCapitalize: "none",
                })}
              </View>
            </View>

            {/* Administration */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Administration</Text>

              {renderInput({
                label: "Principal Name *",
                field: "principalName",
                placeholder: "Enter principal name",
                autoCapitalize: "words",
              })}
            </View>

            {/* Capacity */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>School Capacity</Text>

              <View style={styles.formGrid}>
                {renderInput({
                  label: "Capacity *",
                  field: "capacity",
                  placeholder: "e.g. 1000",
                  keyboardType: "numeric",
                  autoCapitalize: "none",
                })}

                {renderInput({
                  label: "Available Seats *",
                  field: "availableSeats",
                  placeholder: "e.g. 50",
                  keyboardType: "numeric",
                  autoCapitalize: "none",
                })}
              </View>
            </View>

            {/* Additional Information */}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>

              {renderInput({
                label: "Image URL",
                field: "imageUrl",
                placeholder: "https://example.com/school.jpg",
                keyboardType: "url",
                autoCapitalize: "none",
              })}

              {renderInput({
                label: "Description",
                field: "description",
                placeholder: "Enter school description",
                multiline: true,
              })}
            </View>

            {/* Actions */}

            <View style={styles.actions}>
              {/* Cancel */}

              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => router.back()}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              {/* Add School */}

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.8}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Ionicons
                      name="add-circle-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text style={styles.saveButtonText}>Add School</Text>
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

// --------------------------------
// Styles
// --------------------------------

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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
    marginBottom: 18,
    gap: 8,
    alignSelf: "flex-start",
  },

  backText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
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
    marginBottom: 28,
  },

  section: {
    marginBottom: 26,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 16,
  },

  formGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },

  inputGroup: {
    flex: 1,
    minWidth: 260,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text.primary,
    marginBottom: 7,
  },

  input: {
    width: "100%",
    height: 46,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 9,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    fontSize: 14,
    color: colors.text.primary,
  },

  textArea: {
    minHeight: 100,
    paddingTop: 12,
    paddingBottom: 12,
  },

  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },

  cancelButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  saveButton: {
    height: 44,
    paddingHorizontal: 22,
    borderRadius: 8,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    minWidth: 130,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
