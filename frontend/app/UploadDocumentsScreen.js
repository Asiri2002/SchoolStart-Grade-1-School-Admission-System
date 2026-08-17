import { useState } from "react";

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

import { Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

import apiClient from "../src/api/apiClient";

const DOCUMENTS = [
  {
    id: "birthCertificate",
    name: "Birth Certificate",
    description: "Upload birth certificate",
    note: "Required",
    icon: "document-text-outline",
    type: "document",
  },
  {
    id: "parentNic",
    name: "Parent NIC",
    description: "Upload parent NIC",
    note: "Required",
    icon: "card-outline",
    type: "document",
  },
  {
    id: "utilityBill",
    name: "Utility Bill",
    description: "Upload utility bill",
    note: "Not more than 3 months",
    icon: "receipt-outline",
    type: "document",
  },
  {
    id: "childPhoto",
    name: "Child Photo",
    description: "Upload child photo",
    note: "Required",
    icon: "person-outline",
    type: "image",
  },
];

export default function UploadDocumentsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const applicationId = Array.isArray(params.applicationId)
    ? params.applicationId[0]
    : params.applicationId;

  const [documents, setDocuments] = useState({
    birthCertificate: null,
    parentNic: null,
    utilityBill: null,
    childPhoto: null,
  });

  const [uploading, setUploading] = useState(null);
  const [completing, setCompleting] = useState(false);

  // ============================
  // UPLOAD DOCUMENT
  // ============================

  const uploadDocument = async (documentType, selectedFile) => {
    if (!selectedFile) {
      Alert.alert("Error", "No file was selected.");
      return;
    }

    if (!applicationId) {
      Alert.alert(
        "Error",
        "Application ID is missing. Please go back and try again.",
      );
      return;
    }

    try {
      setUploading(documentType);

      const documentInfo = DOCUMENTS.find((item) => item.id === documentType);

      if (!documentInfo) {
        throw new Error("Invalid document type.");
      }

      const formData = new FormData();

      // WEB
      if (typeof window !== "undefined") {
        let webFile = selectedFile.file || null;

        if (!webFile) {
          const response = await fetch(selectedFile.uri);
          const blob = await response.blob();

          const fileName =
            selectedFile.name ||
            selectedFile.fileName ||
            `document-${Date.now()}`;

          const mimeType =
            selectedFile.mimeType ||
            selectedFile.type ||
            blob.type ||
            "application/octet-stream";

          webFile = new File([blob], fileName, {
            type: mimeType,
          });
        }

        formData.append("file", webFile);
      } else {
        // ANDROID / IOS

        const fileName =
          selectedFile.name ||
          selectedFile.fileName ||
          `document-${Date.now()}`;

        const mimeType =
          selectedFile.mimeType ||
          selectedFile.type ||
          "application/octet-stream";

        formData.append("file", {
          uri: selectedFile.uri,
          name: fileName,
          type: mimeType,
        });
      }

      formData.append("name", documentInfo.name);
      formData.append("applicationId", String(applicationId));

      const response = await apiClient.post("/documents/upload", formData);

      console.log("Upload successful:", response.data);

      setDocuments((previous) => ({
        ...previous,
        [documentType]: {
          ...selectedFile,
          uploaded: true,
          response: response.data,
        },
      }));

      Alert.alert(
        "Upload Successful",
        `${documentInfo.name} uploaded successfully.`,
      );
    } catch (error) {
      console.log("DOCUMENT UPLOAD ERROR:", error);

      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload the document.";

      Alert.alert("Upload Failed", message);
    } finally {
      setUploading(null);
    }
  };

  // ============================
  // PICK DOCUMENT
  // ============================

  const pickDocument = async (documentType) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/jpeg", "image/png"],
        copyToCacheDirectory: true,
        multiple: false,
      });

      if (result.canceled) {
        return;
      }

      const file = result.assets?.[0];

      if (!file) {
        Alert.alert("Error", "No document was selected.");
        return;
      }

      await uploadDocument(documentType, file);
    } catch (error) {
      console.log("Document picker error:", error);
      Alert.alert("Error", "Unable to select the document.");
    }
  };

  // ============================
  // PICK CHILD PHOTO
  // ============================

  const pickChildPhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission Required",
          "Please allow photo library access.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return;
      }

      const asset = result.assets?.[0];

      if (!asset) {
        Alert.alert("Error", "No photo was selected.");
        return;
      }

      const file = {
        uri: asset.uri,
        name: asset.fileName || `child-photo-${Date.now()}.jpg`,
        mimeType: asset.mimeType || "image/jpeg",
        file: asset.file || null,
      };

      await uploadDocument("childPhoto", file);
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Unable to select the photo.");
    }
  };

  // ============================
  // HANDLE UPLOAD
  // ============================

  const handleUpload = async (documentItem) => {
    if (uploading || completing) {
      return;
    }

    if (documentItem.type === "image") {
      await pickChildPhoto();
    } else {
      await pickDocument(documentItem.id);
    }
  };

  // ============================
  // CHECK UPLOAD STATUS
  // ============================

  const isUploaded = (documentId) => {
    return !!documents[documentId]?.uploaded;
  };

  const allDocumentsUploaded = DOCUMENTS.every((document) =>
    isUploaded(document.id),
  );

  // ============================
  // COMPLETE APPLICATION
  // ============================

  const handleCompleteApplication = () => {
    if (!allDocumentsUploaded) {
      Alert.alert(
        "Documents Required",
        "Please upload all required documents before completing the application.",
      );
      return;
    }

    router.replace("/ParentDashboardScreen");
  };

  // ============================
  // BACK BUTTON
  // ============================

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/ApplicationsScreen");
    }
  };

  // ============================
  // UI
  // ============================

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
          disabled={!!uploading || completing}
        >
          <Ionicons name="arrow-back" size={22} color="#1F2937" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Upload Documents</Text>

        <View style={{ width: 40 }} />
      </View>

      {/* CONTENT */}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.successBox}>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="#087F5B"
          />

          <View style={styles.successTextContainer}>
            <Text style={styles.successTitle}>
              Application Created Successfully
            </Text>

            <Text style={styles.successDescription}>
              Please upload all required documents to complete your application.
            </Text>
          </View>
        </View>

        <Text style={styles.instruction}>
          Please upload all required documents
        </Text>

        {/* DOCUMENT LIST */}

        {DOCUMENTS.map((document) => {
          const uploaded = isUploaded(document.id);
          const isCurrentlyUploading = uploading === document.id;

          return (
            <TouchableOpacity
              key={document.id}
              style={[styles.documentCard, uploaded && styles.uploadedCard]}
              activeOpacity={0.7}
              disabled={!!uploading || uploaded || completing}
              onPress={() => handleUpload(document)}
            >
              <View
                style={[
                  styles.documentIconContainer,
                  uploaded && styles.uploadedIconContainer,
                ]}
              >
                <Ionicons
                  name={uploaded ? "checkmark" : document.icon}
                  size={22}
                  color={uploaded ? "#0BAF7A" : "#315FE9"}
                />
              </View>

              <View style={styles.documentInfo}>
                <Text style={styles.documentName}>{document.name}</Text>

                <Text style={styles.documentDescription}>
                  {uploaded
                    ? "Document uploaded successfully"
                    : document.description}
                </Text>

                {!uploaded && (
                  <Text style={styles.documentNote}>{document.note}</Text>
                )}
              </View>

              <View style={styles.rightIcon}>
                {isCurrentlyUploading ? (
                  <ActivityIndicator size="small" color="#1468C7" />
                ) : uploaded ? (
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  </View>
                ) : (
                  <Ionicons
                    name="cloud-upload-outline"
                    size={22}
                    color="#526DA5"
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* COMPLETE BUTTON */}

      <View style={styles.bottomContainer}>
        <TouchableOpacity
          style={[
            styles.completeButton,
            (!allDocumentsUploaded || !!uploading || completing) &&
              styles.disabledButton,
          ]}
          onPress={handleCompleteApplication}
          disabled={!allDocumentsUploaded || !!uploading || completing}
        >
          {completing ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={18}
                color="#FFFFFF"
              />

              <Text style={styles.completeButtonText}>
                Complete Application
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },

  header: {
    height: 56,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },

  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  content: {
    padding: 14,
    paddingBottom: 100,
  },

  successBox: {
    backgroundColor: "#E8F6EA",
    borderRadius: 10,
    padding: 12,
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },

  successTextContainer: {
    flex: 1,
    marginLeft: 8,
  },

  successTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#087F5B",
    marginBottom: 3,
  },

  successDescription: {
    fontSize: 9,
    color: "#5A8D70",
  },

  instruction: {
    fontSize: 10,
    color: "#4B5563",
    marginBottom: 10,
  },

  documentCard: {
    minHeight: 70,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 9,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E8ECF2",
    elevation: 1,
  },

  uploadedCard: {
    backgroundColor: "#D6F7E8",
    borderColor: "#10B981",
  },

  documentIconContainer: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: "#EEF3FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  uploadedIconContainer: {
    backgroundColor: "#E8FFF4",
  },

  documentInfo: {
    flex: 1,
  },

  documentName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 3,
  },

  documentDescription: {
    fontSize: 10,
    color: "#7890A8",
  },

  documentNote: {
    fontSize: 8,
    color: "#7890A8",
    marginTop: 2,
  },

  rightIcon: {
    width: 32,
    alignItems: "center",
    justifyContent: "center",
  },

  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#0BAF7A",
    alignItems: "center",
    justifyContent: "center",
  },

  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#F5F7FA",
    padding: 14,
    paddingTop: 8,
  },

  completeButton: {
    height: 45,
    backgroundColor: "#1769C2",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },

  disabledButton: {
    opacity: 0.5,
  },

  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
    marginLeft: 7,
  },
});
