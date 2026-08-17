import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import apiClient from "../src/api/apiClient";

export default function ApplicationFormScreen() {
  const router = useRouter();

  // --------------------------------------------------
  // Receive data from SchoolDetailsScreen
  // --------------------------------------------------

  const { childId, childName, schoolId, schoolName } = useLocalSearchParams();

  // --------------------------------------------------
  // Child details
  // --------------------------------------------------

  const [loadedChildName, setLoadedChildName] = useState(childName || "");

  const [birthDate, setBirthDate] = useState("");
  const [gender, setGender] = useState("");

  // --------------------------------------------------
  // Parent details
  // --------------------------------------------------

  const [parentFullName, setParentFullName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [nicNumber, setNicNumber] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [address, setAddress] = useState("");

  // --------------------------------------------------
  // Loading states
  // --------------------------------------------------

  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // --------------------------------------------------
  // Load child and parent details
  // --------------------------------------------------

  useEffect(() => {
    loadPreviousDetails();
  }, [childId]);

  const loadPreviousDetails = async () => {
    try {
      setDataLoading(true);

      // ----------------------------------------------
      // Load selected child
      // ----------------------------------------------

      if (childId) {
        const childResponse = await apiClient.get(`/children/${childId}`);

        const child = childResponse.data;

        setLoadedChildName(
          child.firstName && child.lastName
            ? `${child.firstName} ${child.lastName}`
            : child.name || childName || "",
        );

        setBirthDate(child.dateOfBirth || child.birthDate || "");

        setGender(child.gender || "");
      }

      // ----------------------------------------------
      // Load parent profile
      // ----------------------------------------------

      const parentResponse = await apiClient.get("/parent/profile");

      const parent = parentResponse.data;

      setParentFullName(
        parent.firstName && parent.lastName
          ? `${parent.firstName} ${parent.lastName}`
          : parent.firstName || "",
      );

      setContactNumber(parent.phone || "");
      setAddress(parent.address || "");
      setNicNumber(parent.nicNumber || "");
      setRelationship(parent.relationship || "");
    } catch (error) {
      console.error(
        "Error loading previous details:",
        error.response?.data || error.message,
      );

      Alert.alert("Error", "Unable to load child or parent details.");
    } finally {
      setDataLoading(false);
    }
  };

  // --------------------------------------------------
  // Submit application
  // --------------------------------------------------

  const handleSubmit = async () => {
    // ----------------------------------------------
    // Prevent multiple submissions
    // ----------------------------------------------

    if (loading) {
      return;
    }

    // ----------------------------------------------
    // Validate required fields
    // ----------------------------------------------

    if (!loadedChildName.trim()) {
      Alert.alert("Missing Information", "Child name is required.");
      return;
    }

    if (!birthDate.trim()) {
      Alert.alert("Missing Information", "Date of birth is required.");
      return;
    }

    if (!gender) {
      Alert.alert("Missing Information", "Gender is required.");
      return;
    }

    if (!parentFullName.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter the parent's full name.",
      );
      return;
    }

    if (!relationship.trim()) {
      Alert.alert(
        "Missing Information",
        "Please enter the relationship with the child.",
      );
      return;
    }

    if (!nicNumber.trim()) {
      Alert.alert("Missing Information", "Please enter the NIC number.");
      return;
    }

    if (!contactNumber.trim()) {
      Alert.alert("Missing Information", "Please enter the contact number.");
      return;
    }

    if (!childId || !schoolId) {
      Alert.alert(
        "Application Error",
        "Child or school information is missing. Please go back and try again.",
      );
      return;
    }

    try {
      setLoading(true);

      // ----------------------------------------------
      // Split parent full name
      // ----------------------------------------------

      const nameParts = parentFullName.trim().split(/\s+/);

      const firstName = nameParts[0] || "";

      const lastName = nameParts.slice(1).join(" ") || "";

      // ----------------------------------------------
      // Update parent profile
      // ----------------------------------------------

      const parentUpdateData = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: contactNumber.trim(),
        address: address.trim(),
      };

      console.log("Updating parent profile:", parentUpdateData);

      await apiClient.put("/parent/profile", parentUpdateData);

      // ----------------------------------------------
      // Create application data
      // ----------------------------------------------

      const applicationData = {
        childId: String(childId),

        schoolId: String(schoolId),

        childFullName: loadedChildName || childName || "",

        birthDate: birthDate.trim(),

        gender: gender,

        parentFullName: parentFullName.trim(),

        relationship: relationship.trim(),

        nicNumber: nicNumber.trim(),

        contactNumber: contactNumber.trim(),
      };

      console.log("Creating application:", applicationData);

      // ----------------------------------------------
      // Create application
      // ----------------------------------------------

      const response = await apiClient.post("/applications", applicationData);

      console.log("Application created:", response.data);

      // ----------------------------------------------
      // Get application ID
      // ----------------------------------------------

      const applicationId = response.data?.applicationId || response.data?.id;

      // ----------------------------------------------
      // Check application ID
      // ----------------------------------------------

      if (!applicationId) {
        console.error("Application ID not found:", response.data);

        Alert.alert(
          "Submission Error",
          "Application was created, but the application ID was not returned.",
        );

        return;
      }

      console.log("Navigating to Upload Documents:", applicationId);

      // ----------------------------------------------
      // Navigate to Upload Documents
      // ----------------------------------------------

      router.push({
        pathname: "/UploadDocumentsScreen",

        params: {
          applicationId: String(applicationId),
        },
      });
    } catch (error) {
      console.error("Application submission error:", error);

      const backendData = error.response?.data;

      console.log("Backend error:", backendData);

      const errorMessage =
        backendData?.message || "Unable to continue. Please try again.";

      // ==================================================
      // 400 - ALREADY APPLIED
      // ==================================================

      if (
        error.response?.status === 400 &&
        errorMessage.toLowerCase().includes("already applied")
      ) {
        Alert.alert(
          "Already Applied",
          `You have already submitted an application for ${
            loadedChildName || childName || "this child"
          } to ${schoolName || "this school"}.`,
          [
            {
              text: "View Applications",
              onPress: () => {
                router.replace("/ApplicationsScreen");
              },
            },
            {
              text: "OK",
              style: "cancel",
            },
          ],
          {
            cancelable: true,
          },
        );

        return;
      }

      // ==================================================
      // 400 - OTHER BAD REQUEST
      // ==================================================

      if (error.response?.status === 400) {
        Alert.alert("Invalid Application", errorMessage);

        return;
      }

      // ==================================================
      // 401 - UNAUTHORIZED
      // ==================================================

      if (error.response?.status === 401) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please log in again.",
          [
            {
              text: "OK",
              onPress: () => {
                router.replace("/login");
              },
            },
          ],
        );

        return;
      }

      // ==================================================
      // 403 - FORBIDDEN
      // ==================================================

      if (error.response?.status === 403) {
        Alert.alert(
          "Access Denied",
          "You do not have permission to submit this application.",
        );

        return;
      }

      // ==================================================
      // 404 - NOT FOUND
      // ==================================================

      if (error.response?.status === 404) {
        Alert.alert(
          "Not Found",
          "The requested information could not be found.",
        );

        return;
      }

      // ==================================================
      // 409 - CONFLICT
      // ==================================================

      if (error.response?.status === 409) {
        Alert.alert(
          "Application Conflict",
          errorMessage || "An application already exists.",
        );

        return;
      }

      // ==================================================
      // 500+ - SERVER ERROR
      // ==================================================

      if (error.response?.status >= 500) {
        Alert.alert(
          "Server Error",
          "Something went wrong on the server. Please try again later.",
        );

        return;
      }

      // ==================================================
      // NETWORK ERROR
      // ==================================================

      if (!error.response) {
        Alert.alert(
          "Connection Error",
          "Unable to connect to the server. Please check your connection and try again.",
        );

        return;
      }

      // ==================================================
      // DEFAULT ERROR
      // ==================================================

      Alert.alert("Unable to Continue", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // Loading screen
  // --------------------------------------------------

  if (dataLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#388E3C" />

          <Text style={styles.loadingText}>Loading application details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // --------------------------------------------------
  // Main UI
  // --------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/SchoolDetailsScreen");
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>School Application</Text>

        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Selected Child */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="person-outline" size={24} color="#388E3C" />
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Applying for</Text>

            <Text style={styles.summaryValue}>
              {loadedChildName || childName || "Selected Child"}
            </Text>
          </View>
        </View>

        {/* Selected School */}

        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons name="school-outline" size={24} color="#388E3C" />
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryLabel}>Selected School</Text>

            <Text style={styles.summaryValue}>
              {schoolName || "Selected School"}
            </Text>
          </View>
        </View>

        {/* Child Information */}

        <Text style={styles.sectionTitle}>Child Information</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Child Name</Text>

          <View style={styles.disabledInput}>
            <Text style={styles.disabledText}>
              {loadedChildName || childName || "Not available"}
            </Text>
          </View>

          <Text style={styles.label}>Date of Birth</Text>

          <TextInput
            style={styles.disabledInput}
            value={birthDate}
            editable={false}
          />

          <Text style={styles.label}>Gender</Text>

          <View style={styles.genderContainer}>
            <View
              style={[
                styles.genderButton,
                gender === "MALE" && styles.genderButtonActive,
              ]}
            >
              <Ionicons
                name="male-outline"
                size={20}
                color={gender === "MALE" ? "#FFFFFF" : "#666"}
              />

              <Text
                style={[
                  styles.genderText,
                  gender === "MALE" && styles.genderTextActive,
                ]}
              >
                Male
              </Text>
            </View>

            <View
              style={[
                styles.genderButton,
                gender === "FEMALE" && styles.genderButtonActive,
              ]}
            >
              <Ionicons
                name="female-outline"
                size={20}
                color={gender === "FEMALE" ? "#FFFFFF" : "#666"}
              />

              <Text
                style={[
                  styles.genderText,
                  gender === "FEMALE" && styles.genderTextActive,
                ]}
              >
                Female
              </Text>
            </View>
          </View>
        </View>

        {/* Parent Information */}

        <Text style={styles.sectionTitle}>Parent Information</Text>

        <View style={styles.formCard}>
          <Text style={styles.label}>Parent Full Name</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter parent full name"
            placeholderTextColor="#A0A0A0"
            value={parentFullName}
            onChangeText={setParentFullName}
          />

          <Text style={styles.label}>Relationship</Text>

          <TextInput
            style={styles.input}
            placeholder="Example: Mother or Father"
            placeholderTextColor="#A0A0A0"
            value={relationship}
            onChangeText={setRelationship}
          />

          <Text style={styles.label}>NIC Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter NIC number"
            placeholderTextColor="#A0A0A0"
            value={nicNumber}
            onChangeText={setNicNumber}
            autoCapitalize="characters"
          />

          <Text style={styles.label}>Contact Number</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter contact number"
            placeholderTextColor="#A0A0A0"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
        </View>

        {/* Application Details */}

        <Text style={styles.sectionTitle}>Application Details</Text>

        <View style={styles.applicationInfo}>
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#388E3C"
          />

          <Text style={styles.applicationInfoText}>
            Your application will be created for{" "}
            <Text style={styles.boldText}>{schoolName}</Text>. You will upload
            your documents in the next step.
          </Text>
        </View>

        {/* Upload Documents Button */}

        <TouchableOpacity
          style={[styles.submitButton, loading && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
          activeOpacity={0.8}
        >
          {loading ? (
            <>
              <ActivityIndicator size="small" color="#FFFFFF" />

              <Text style={styles.submitText}>Submitting...</Text>
            </>
          ) : (
            <>
              <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />

              <Text style={styles.submitText}>Upload Documents</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.note}>
          Please make sure all information is correct before continuing to
          upload documents.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

// --------------------------------------------------
// Styles
// --------------------------------------------------

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    color: "#666",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  backButton: {
    width: 35,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  headerRight: {
    width: 35,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  summaryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  summaryIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#E8F5E9",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  summaryInfo: {
    flex: 1,
  },

  summaryLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 3,
  },

  summaryValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
    marginTop: 20,
    marginBottom: 10,
  },

  formCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#444",
    marginBottom: 7,
    marginTop: 10,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#1A1A1A",
    backgroundColor: "#FFFFFF",
  },

  disabledInput: {
    height: 48,
    borderRadius: 10,
    paddingHorizontal: 14,
    justifyContent: "center",
    backgroundColor: "#F2F2F2",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  disabledText: {
    fontSize: 14,
    color: "#666",
  },

  genderContainer: {
    flexDirection: "row",
    gap: 10,
  },

  genderButton: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  genderButtonActive: {
    backgroundColor: "#388E3C",
    borderColor: "#388E3C",
  },

  genderText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },

  genderTextActive: {
    color: "#FFFFFF",
  },

  applicationInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },

  applicationInfoText: {
    flex: 1,
    fontSize: 13,
    color: "#356B38",
    lineHeight: 19,
  },

  boldText: {
    fontWeight: "700",
  },

  submitButton: {
    height: 54,
    marginTop: 24,
    borderRadius: 12,
    backgroundColor: "#388E3C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  submitButtonDisabled: {
    opacity: 0.7,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  note: {
    textAlign: "center",
    fontSize: 12,
    color: "#999",
    marginTop: 12,
    lineHeight: 18,
  },
});
