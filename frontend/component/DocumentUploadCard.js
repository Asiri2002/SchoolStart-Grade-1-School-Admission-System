import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { COLORS } from "../theme/colors";

const DocumentUploadCard = ({
  title,
  description,
  extraText,
  icon,
  uploaded,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.card, uploaded && styles.uploadedCard]}
      activeOpacity={0.7}
      onPress={onPress}
    >
      <View style={styles.iconContainer}>
        <Ionicons
          name={uploaded ? "checkmark-circle" : icon}
          size={24}
          color={uploaded ? COLORS.success : COLORS.iconColor}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.description}>
          {uploaded ? "Document uploaded" : description}
        </Text>

        {extraText && !uploaded && (
          <Text style={styles.extraText}>{extraText}</Text>
        )}
      </View>

      <Ionicons
        name={uploaded ? "checkmark-circle" : "cloud-upload-outline"}
        size={24}
        color={uploaded ? COLORS.success : COLORS.textSecondary}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  uploadedCard: {
    borderColor: "#10B981",
    backgroundColor: "#D1FAE5",
  },

  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  textContainer: {
    flex: 1,
  },

  title: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 4,
  },

  description: {
    fontSize: 12,
    color: COLORS.textSecondary,
  },

  extraText: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 3,
  },
});

export default DocumentUploadCard;
