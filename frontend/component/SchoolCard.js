import { Ionicons } from "@expo/vector-icons";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const SchoolCard = ({ school, isFavorite, onFavoritePress, onPress }) => {
  const imageUrl =
    school?.image ||
    school?.imageUrl ||
    school?.schoolImage ||
    school?.logo ||
    null;

  const location =
    school?.location ||
    school?.district ||
    school?.address ||
    "Location unavailable";

  const distance = school?.distance != null ? `${school.distance} km` : null;

  const availableSeats =
    school?.availableSeats != null ? school.availableSeats : "N/A";

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={onPress}>
      {/* School Image */}

      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
          onError={(error) => {
            console.log("School image failed:", imageUrl, error.nativeEvent);
          }}
        />
      ) : (
        <View style={styles.imagePlaceholder}>
          <Ionicons name="school-outline" size={32} color="#9E9E9E" />
        </View>
      )}

      {/* School Information */}

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {school?.name || "Unknown School"}
        </Text>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#6B6B6B" />

          <Text style={styles.location} numberOfLines={1}>
            {location}
          </Text>
        </View>

        {distance && <Text style={styles.distance}>{distance}</Text>}

        <Text style={styles.seats}>
          Available Seats:{" "}
          <Text style={styles.seatsCount}>{availableSeats}</Text>
        </Text>
      </View>

      {/* Favorite */}

      <TouchableOpacity
        style={styles.heartBtn}
        onPress={(event) => {
          event.stopPropagation();

          if (onFavoritePress) {
            onFavoritePress();
          }
        }}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
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

  imagePlaceholder: {
    width: 72,
    height: 72,
    borderRadius: 10,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 3,
  },

  location: {
    flex: 1,
    fontSize: 13,
    color: "#6B6B6B",
    marginLeft: 4,
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
