import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";

import {
  Alert,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import FormDropdown from "../component/FormDropdown";
import FormInput from "../component/FormInput";

import { getAccessToken } from "../src/storage/authStorage";

import { COLORS } from "../theme";

const API_URL = "http://localhost:8080/api";

// =========================================================
// Convert Image URI to Base64
// =========================================================

const imageUriToBase64 = async (uri) => {
  try {
    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error("Unable to read selected image.");
    }

    const blob = await response.blob();

    return await new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Unable to convert image to Base64."));
        }
      };

      reader.onerror = () => {
        reject(new Error("Failed to read image file."));
      };

      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Image Base64 conversion error:", error);
    throw error;
  }
};

// =========================================================
// Add Child Screen
// =========================================================

const AddChildScreen = () => {
  // =========================================================
  // Form State
  // =========================================================

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [birthCertificateNumber, setBirthCertificateNumber] = useState("");

  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState(null);
  const [bloodGroup, setBloodGroup] = useState(null);

  const [profileImage, setProfileImage] = useState(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // =========================================================
  // Errors
  // =========================================================

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    birthCertificateNumber: "",
    dateOfBirth: "",
    gender: "",
  });

  // =========================================================
  // Back
  // =========================================================

  const handleBack = () => {
    router.replace("/ParentDashboardScreen");
  };

  // =========================================================
  // Image Picker
  // =========================================================

  const handlePickImage = async () => {
    try {
      if (Platform.OS !== "web") {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
          Alert.alert(
            "Permission Required",
            "Please allow photo library access.",
          );

          return;
        }
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const selectedImage = result.assets[0];

        console.log("Selected image:", selectedImage.uri);

        setProfileImage(selectedImage.uri);
      }
    } catch (error) {
      console.error("Image picker error:", error);

      Alert.alert(
        "Image Error",
        "Unable to select the image. Please try again.",
      );
    }
  };

  // =========================================================
  // Date Helpers
  // =========================================================

  const isValidDate = (date) => {
    return date instanceof Date && !Number.isNaN(date.getTime());
  };

  // =========================================================
  // Native Date Picker
  // =========================================================

  const handleDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
    }

    if (event?.type === "dismissed") {
      setShowDatePicker(false);
      return;
    }

    if (selectedDate && isValidDate(selectedDate)) {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const selected = new Date(selectedDate);

      selected.setHours(0, 0, 0, 0);

      if (selected > today) {
        setDateOfBirth(null);

        setErrors((previous) => ({
          ...previous,
          dateOfBirth: "Date of birth cannot be in the future.",
        }));

        return;
      }

      setDateOfBirth(selectedDate);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "",
      }));
    }
  };

  // =========================================================
  // Web Date Picker
  // =========================================================

  const handleWebDateChange = (event) => {
    const value = event.target.value;

    if (!value) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Date of birth is required.",
      }));

      return;
    }

    const parts = value.split("-");

    if (parts.length !== 3) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Please select a valid date.",
      }));

      return;
    }

    const year = Number(parts[0]);
    const month = Number(parts[1]);
    const day = Number(parts[2]);

    if (
      !Number.isInteger(year) ||
      !Number.isInteger(month) ||
      !Number.isInteger(day) ||
      month < 1 ||
      month > 12 ||
      day < 1 ||
      day > 31
    ) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Please select a valid date.",
      }));

      return;
    }

    const selectedDate = new Date(year, month - 1, day);

    if (!isValidDate(selectedDate)) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Please select a valid date.",
      }));

      return;
    }

    // Prevent JavaScript from correcting invalid dates

    if (
      selectedDate.getFullYear() !== year ||
      selectedDate.getMonth() !== month - 1 ||
      selectedDate.getDate() !== day
    ) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Please select a valid date.",
      }));

      return;
    }

    // Prevent future dates

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    if (selectedDate > today) {
      setDateOfBirth(null);

      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Date of birth cannot be in the future.",
      }));

      return;
    }

    setDateOfBirth(selectedDate);

    setErrors((previous) => ({
      ...previous,
      dateOfBirth: "",
    }));
  };

  // =========================================================
  // Date Formatting
  // =========================================================

  const formatDate = (date) => {
    if (!isValidDate(date)) {
      return "";
    }

    const day = String(date.getDate()).padStart(2, "0");

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  };

  const formatDateForWeb = (date) => {
    if (!isValidDate(date)) {
      return "";
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // Backend LocalDate Format
  // YYYY-MM-DD
  // =========================================================

  const formatDateForApi = (date) => {
    if (!isValidDate(date)) {
      return null;
    }

    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // =========================================================
  // Validation
  // =========================================================

  const validateForm = () => {
    const newErrors = {
      firstName: "",
      lastName: "",
      birthCertificateNumber: "",
      dateOfBirth: "",
      gender: "",
    };

    let valid = true;

    // First Name

    if (!firstName.trim()) {
      newErrors.firstName = "First name is required.";

      valid = false;
    }

    // Last Name

    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required.";

      valid = false;
    }

    // Birth Certificate Number

    const normalizedBirthCertificateNumber = birthCertificateNumber
      .trim()
      .toUpperCase();

    if (!normalizedBirthCertificateNumber) {
      newErrors.birthCertificateNumber =
        "Birth certificate number is required.";

      valid = false;
    }

    // Date of Birth

    if (!isValidDate(dateOfBirth)) {
      newErrors.dateOfBirth = "Date of birth is required.";

      valid = false;
    } else {
      const today = new Date();

      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(dateOfBirth);

      selectedDate.setHours(0, 0, 0, 0);

      if (selectedDate > today) {
        newErrors.dateOfBirth = "Date of birth cannot be in the future.";

        valid = false;
      }
    }

    // Gender

    if (!gender) {
      newErrors.gender = "Please select gender.";

      valid = false;
    }

    setErrors(newErrors);

    return valid;
  };

  // =========================================================
  // Save Child
  // =========================================================

  const handleSaveChild = async () => {
    if (isSaving) {
      return;
    }

    // Validate form

    if (!validateForm()) {
      return;
    }

    // Format date

    const formattedDate = formatDateForApi(dateOfBirth);

    if (!formattedDate) {
      setErrors((previous) => ({
        ...previous,
        dateOfBirth: "Please select a valid date of birth.",
      }));

      return;
    }

    // Normalize birth certificate number

    const normalizedBirthCertificateNumber = birthCertificateNumber
      .trim()
      .toUpperCase();

    try {
      setIsSaving(true);

      // =====================================================
      // Get JWT Token
      // =====================================================

      const token = await getAccessToken();

      console.log("JWT token exists:", !!token);

      if (!token) {
        Alert.alert(
          "Authentication Error",
          "Your login session has expired. Please login again.",
        );

        return;
      }

      // =====================================================
      // Convert Profile Image
      // =====================================================

      let profileImageBase64 = null;

      if (profileImage) {
        try {
          console.log("Converting profile image...");

          profileImageBase64 = await imageUriToBase64(profileImage);

          console.log("Profile image converted:", !!profileImageBase64);
        } catch (imageError) {
          console.error("Image conversion error:", imageError);

          Alert.alert(
            "Image Error",
            "Unable to process the selected profile image.",
          );

          return;
        }
      }

      // =====================================================
      // Child Data
      // =====================================================

      const childData = {
        firstName: firstName.trim(),

        lastName: lastName.trim(),

        birthCertificateNumber: normalizedBirthCertificateNumber,

        dateOfBirth: formattedDate,

        gender: gender,

        profileImage: profileImageBase64,
      };

      console.log("Sending Child Data:", {
        firstName: childData.firstName,

        lastName: childData.lastName,

        birthCertificateNumber: childData.birthCertificateNumber,

        dateOfBirth: childData.dateOfBirth,

        gender: childData.gender,

        profileImage: profileImageBase64 ? "[BASE64 IMAGE]" : null,
      });

      // =====================================================
      // Create Child
      // =====================================================

      const response = await fetch(`${API_URL}/children`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(childData),
      });

      const responseText = await response.text();

      console.log("Child API Status:", response.status);

      console.log("Child API Response:", responseText);

      // =====================================================
      // API ERROR
      // =====================================================

      if (!response.ok) {
        let errorMessage = "Failed to save child.";

        try {
          const errorData = JSON.parse(responseText);

          errorMessage =
            errorData.message ||
            errorData.error ||
            errorData.detail ||
            errorMessage;
        } catch {
          if (responseText) {
            errorMessage = responseText;
          }
        }

        // ===================================================
        // DUPLICATE BIRTH CERTIFICATE
        // ===================================================

        if (response.status === 409) {
          setErrors((previous) => ({
            ...previous,

            birthCertificateNumber:
              "This birth certificate number is already registered.",
          }));

          Alert.alert(
            "Duplicate Birth Certificate",
            "A child with this birth certificate number already exists. Please enter a different birth certificate number.",
          );

          return;
        }

        // ===================================================
        // Bad Request
        // ===================================================

        if (response.status === 400) {
          Alert.alert("Invalid Information", errorMessage);

          return;
        }

        // ===================================================
        // Unauthorized
        // ===================================================

        if (response.status === 401) {
          Alert.alert(
            "Session Expired",
            "Your login session has expired. Please login again.",
          );

          return;
        }

        // ===================================================
        // Forbidden
        // ===================================================

        if (response.status === 403) {
          Alert.alert(
            "Access Denied",
            "You do not have permission to add a child.",
          );

          return;
        }

        // ===================================================
        // Other Errors
        // ===================================================

        Alert.alert("Save Failed", errorMessage);

        return;
      }

      // =====================================================
      // SUCCESS
      // =====================================================

      Alert.alert("Success", "Child information has been saved successfully.", [
        {
          text: "OK",

          onPress: () => {
            router.replace("/ParentDashboardScreen");
          },
        },
      ]);
    } catch (error) {
      console.error("Save child error:", error);

      Alert.alert(
        "Connection Error",
        "Unable to connect to the server. Please check that your backend is running and that the API URL is correct.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* =================================================
            Header
        ================================================= */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Go to Parent Dashboard"
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Add Child</Text>
        </View>

        {/* =================================================
            Content
        ================================================= */}

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* =================================================
              Profile Image
          ================================================= */}

          <View style={styles.profileSection}>
            <View style={styles.avatarContainer}>
              {profileImage ? (
                <Image
                  source={{
                    uri: profileImage,
                  }}
                  style={styles.avatar}
                />
              ) : (
                <View style={styles.defaultAvatar}>
                  <Ionicons
                    name="person"
                    size={64}
                    color={COLORS.textSecondary}
                  />
                </View>
              )}

              <TouchableOpacity
                style={styles.cameraButton}
                onPress={handlePickImage}
                activeOpacity={0.8}
              >
                <Ionicons name="camera" size={20} color={COLORS.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* =================================================
              First Name
          ================================================= */}

          <FormInput
            label="First Name"
            placeholder="Enter first name"
            value={firstName}
            onChangeText={(text) => {
              setFirstName(text);

              if (errors.firstName) {
                setErrors((previous) => ({
                  ...previous,
                  firstName: "",
                }));
              }
            }}
            error={errors.firstName}
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* =================================================
              Last Name
          ================================================= */}

          <FormInput
            label="Last Name"
            placeholder="Enter last name"
            value={lastName}
            onChangeText={(text) => {
              setLastName(text);

              if (errors.lastName) {
                setErrors((previous) => ({
                  ...previous,
                  lastName: "",
                }));
              }
            }}
            error={errors.lastName}
            autoCapitalize="words"
            autoCorrect={false}
          />

          {/* =================================================
              Birth Certificate Number
          ================================================= */}

          <FormInput
            label="Birth Certificate Number"
            placeholder="Enter birth certificate number"
            value={birthCertificateNumber}
            onChangeText={(text) => {
              // Remove spaces at beginning
              const cleanedValue = text.trimStart();

              setBirthCertificateNumber(cleanedValue);

              if (errors.birthCertificateNumber) {
                setErrors((previous) => ({
                  ...previous,

                  birthCertificateNumber: "",
                }));
              }
            }}
            error={errors.birthCertificateNumber}
            autoCapitalize="characters"
            autoCorrect={false}
          />

          {/* =================================================
              Date of Birth
          ================================================= */}

          <View style={styles.fieldContainer}>
            <Text style={styles.label}>Date of Birth</Text>

            {Platform.OS === "web" ? (
              <View
                style={[
                  styles.webDateInputWrapper,

                  errors.dateOfBirth && styles.inputError,
                ]}
              >
                <input
                  type="date"
                  value={formatDateForWeb(dateOfBirth)}
                  max={formatDateForWeb(new Date())}
                  onChange={handleWebDateChange}
                  style={{
                    flex: 1,
                    height: "48px",
                    border: "none",
                    outline: "none",
                    backgroundColor: "transparent",
                    fontSize: "14px",
                    color: COLORS.textPrimary,
                    fontFamily: "inherit",
                    minWidth: 0,
                  }}
                />

                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={COLORS.textSecondary}
                  style={styles.webCalendarIcon}
                />
              </View>
            ) : (
              <>
                <TouchableOpacity
                  style={[
                    styles.dateInput,

                    errors.dateOfBirth && styles.inputError,
                  ]}
                  onPress={() => setShowDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.dateText,

                      !isValidDate(dateOfBirth) && styles.placeholderText,
                    ]}
                  >
                    {isValidDate(dateOfBirth)
                      ? formatDate(dateOfBirth)
                      : "Select date"}
                  </Text>

                  <Ionicons
                    name="calendar-outline"
                    size={20}
                    color={COLORS.textSecondary}
                  />
                </TouchableOpacity>

                {showDatePicker && (
                  <DateTimePicker
                    value={isValidDate(dateOfBirth) ? dateOfBirth : new Date()}
                    mode="date"
                    display={Platform.OS === "ios" ? "spinner" : "default"}
                    maximumDate={new Date()}
                    onChange={handleDateChange}
                  />
                )}
              </>
            )}

            {errors.dateOfBirth ? (
              <Text style={styles.errorText}>{errors.dateOfBirth}</Text>
            ) : null}
          </View>

          {/* =================================================
              Gender
          ================================================= */}

          <FormDropdown
            label="Gender"
            placeholder="Select gender"
            value={gender}
            options={["Male", "Female", "Other"]}
            onSelect={(value) => {
              setGender(value);

              setErrors((previous) => ({
                ...previous,
                gender: "",
              }));
            }}
            error={errors.gender}
          />

          {/* =================================================
              Blood Group
          ================================================= */}

          <FormDropdown
            label="Blood Group (Optional)"
            placeholder="Select blood group"
            value={bloodGroup}
            options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
            onSelect={setBloodGroup}
          />

          {/* =================================================
              Save Button
          ================================================= */}

          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSaveChild}
            activeOpacity={0.8}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? "Saving..." : "Save Child"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// =========================================================
// Styles
// =========================================================

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: COLORS.background,
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "flex-start",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginLeft: 4,
  },

  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },

  profileSection: {
    alignItems: "center",
    marginBottom: 28,
  },

  avatarContainer: {
    width: 112,
    height: 112,
    position: "relative",
  },

  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
  },

  defaultAvatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: COLORS.avatarBg[0],
    alignItems: "center",
    justifyContent: "center",
  },

  cameraButton: {
    position: "absolute",
    right: -4,
    bottom: 0,

    width: 36,
    height: 36,

    borderRadius: 18,

    backgroundColor: COLORS.white,

    alignItems: "center",
    justifyContent: "center",

    borderWidth: 1,
    borderColor: COLORS.border,

    shadowColor: "#000",

    shadowOffset: {
      width: 0,
      height: 2,
    },

    shadowOpacity: 0.15,
    shadowRadius: 4,

    elevation: 3,
  },

  fieldContainer: {
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 8,
  },

  dateInput: {
    height: 50,

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "space-between",

    backgroundColor: COLORS.card,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 10,

    paddingHorizontal: 16,
  },

  dateText: {
    flex: 1,

    fontSize: 14,

    color: COLORS.textPrimary,
  },

  webDateInputWrapper: {
    height: 50,

    flexDirection: "row",

    alignItems: "center",

    backgroundColor: COLORS.card,

    borderWidth: 1,

    borderColor: COLORS.border,

    borderRadius: 10,

    paddingLeft: 16,

    paddingRight: 12,

    overflow: "hidden",
  },

  webCalendarIcon: {
    marginLeft: 8,
  },

  placeholderText: {
    color: COLORS.textMuted,
  },

  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    marginTop: 4,

    fontSize: 12,

    color: COLORS.error,
  },

  saveButton: {
    height: 50,

    backgroundColor: COLORS.primary,

    borderRadius: 10,

    alignItems: "center",

    justifyContent: "center",

    marginTop: 4,

    marginBottom: 20,
  },

  saveButtonDisabled: {
    opacity: 0.6,
  },

  saveButtonText: {
    fontSize: 15,

    fontWeight: "700",

    color: COLORS.white,
  },
});

export default AddChildScreen;
