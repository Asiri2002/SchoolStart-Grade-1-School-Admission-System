import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

/**
 * SchoolCard
 *
 * Props:
 *  - school   : { id, name, location, distance, availableSeats, image }
 *  - isFavorite : boolean
 *  - onFavoritePress : () => void
 *  - onPress  : () => void   (future — navigate to school detail)
 */
const SchoolCard = ({ school, isFavorite, onFavoritePress, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* School thumbnail */}
      <Image
        source={{ uri: school.image }}
        style={styles.image}
        resizeMode="cover"
      />

      {/* Info block */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {school.name}
        </Text>
        <Text style={styles.location}>{school.location}</Text>
        <Text style={styles.distance}>{school.distance}</Text>
        <Text style={styles.seats}>
          Available Seats:{" "}
          <Text style={styles.seatsCount}>{school.availableSeats}</Text>
        </Text>
      </View>

      {/* Favorite icon */}
      <TouchableOpacity
        style={styles.heartBtn}
        onPress={onFavoritePress}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons
          name={isFavorite ? "heart" : "heart-outline"}
          size={22}
          color={isFavorite ? "#E53935" : "#9E9E9E"}
        />
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
  },

  image: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#E0E0E0",
  },

  info: {
    flex: 1,
    marginLeft: 14,
    justifyContent: "center",
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1A1A1A",
    marginBottom: 2,
  },

  location: {
    fontSize: 13,
    color: "#6B6B6B",
    marginBottom: 1,
  },

  distance: {
    fontSize: 12,
    color: "#9E9E9E",
    marginBottom: 4,
  },

  seats: {
    fontSize: 13,
    color: "#4CAF50",
    fontWeight: "500",
  },

  seatsCount: {
    fontWeight: "700",
    color: "#388E3C",
  },

  heartBtn: {
    paddingLeft: 10,
    alignSelf: "flex-start",
    paddingTop: 2,
  },

  divider: {
    position: "absolute",
    bottom: 0,
    left: 16,
    right: 16,
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E0E0E0",
  },
});

export default SchoolCard;
