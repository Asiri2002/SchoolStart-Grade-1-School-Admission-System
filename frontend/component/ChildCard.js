import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { COLORS } from "../theme/colors";

const ChildCard = ({ child, index = 0, onPress }) => {
  const avatarBgColor = COLORS.avatarBg[index % COLORS.avatarBg.length];

  const avatarFgColor = COLORS.avatarFg[index % COLORS.avatarFg.length];

  const initials =
    `${child.firstName?.[0] ?? ""}${child.lastName?.[0] ?? ""}`.toUpperCase();

  const fullName = `${child.firstName ?? ""} ${child.lastName ?? ""}`.trim();

  const hasProfileImage =
    child?.profileImage &&
    typeof child.profileImage === "string" &&
    child.profileImage.trim().length > 0;

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.75}
      accessibilityLabel={`View details for ${fullName}`}
    >
      {/* Avatar */}
      {hasProfileImage ? (
        <Image
          source={{ uri: child.profileImage }}
          style={styles.avatarImage}
        />
      ) : (
        <View style={[styles.avatar, { backgroundColor: avatarBgColor }]}>
          <Text style={[styles.avatarText, { color: avatarFgColor }]}>
            {initials}
          </Text>
        </View>
      )}

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{fullName}</Text>

        <Text style={styles.dob}>DOB: {child.dateOfBirth}</Text>
      </View>

      {/* Chevron */}
      <Ionicons name="chevron-forward" size={20} color={COLORS.textMuted} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.card,
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,

    elevation: 3,
  },

  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  avatarImage: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 14,
  },

  avatarText: {
    fontSize: 16,
    fontWeight: "700",
  },

  info: {
    flex: 1,
  },

  name: {
    fontSize: 15,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 3,
  },

  dob: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
});

export default ChildCard;
