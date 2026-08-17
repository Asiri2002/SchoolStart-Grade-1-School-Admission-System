import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { fetchSchoolById } from "../src/services/schoolService";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.33;

const COLORS = {
  primary: "#1E5AA8",
  background: "#FFFFFF",
  surface: "#F7F9FC",
  textPrimary: "#1A1A1A",
  textSecondary: "#6B6B6B",
  textMuted: "#9CA3AF",
  border: "#E8E8E8",
  favorite: "#E53E3E",
  shadow: "#000000",
  statsBg: "#F0F4FF",
  white: "#FFFFFF",
};

export default function SchoolDetailsScreen() {
  const router = useRouter();
  const { childId, childName, schoolId } = useLocalSearchParams();

  const [school, setSchool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const loadSchool = useCallback(async () => {
    if (!schoolId) {
      setError("No school ID provided.");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await fetchSchoolById(schoolId);
      setSchool(data);
    } catch (err) {
      console.error("Failed to fetch school:", err);
      setError("Unable to load school details.");
    } finally {
      setLoading(false);
    }
  }, [schoolId]);

  useEffect(() => {
    loadSchool();
  }, [loadSchool]);

  const handleApplyNow = () => {
    router.push({
      pathname: "/ApplicationFormScreen",
      params: {
        childId: childId,
        childName: childName,
        schoolId: school?.id,
        schoolName: school?.name,
      },
    });
  };

  const resolveImageUrl = (s) => {
    if (!s) return null;
    return s.image || s.imageUrl || s.schoolImage || s.logo || null;
  };

  // ── Loading State ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Loading school details...</Text>
      </SafeAreaView>
    );
  }

  // ── Error State ──────────────────────────────────────────────────────────
  if (error) {
    return (
      <SafeAreaView style={styles.centeredContainer}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={COLORS.background}
        />
        <Ionicons name="alert-circle-outline" size={56} color="#E53E3E" />
        <Text style={styles.errorTitle}>Oops!</Text>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadSchool}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.backTextButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backTextButtonLabel}>← Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const imageUrl = resolveImageUrl(school);
  const description =
    school?.description || school?.about || school?.schoolDescription || null;

  const distanceVal =
    school?.distance != null ? `${school.distance} km` : "N/A";
  const capacityVal = school?.capacity != null ? `${school.capacity}` : "N/A";
  const availableVal =
    school?.availableSeats != null ? `${school.availableSeats}` : "N/A";

  // ── Main Screen ──────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* ── Hero Image ── */}
        <View style={styles.heroContainer}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.schoolImage}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons
                name="school-outline"
                size={64}
                color={COLORS.textMuted}
              />
              <Text style={styles.imagePlaceholderText}>No School Image</Text>
            </View>
          )}

          {/* Back Button */}
          <TouchableOpacity
            style={[styles.overlayButton, styles.backButton]}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.overlayButton, styles.favoriteButton]}
            onPress={() => setIsFavorite((prev) => !prev)}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={22}
              color={isFavorite ? COLORS.favorite : COLORS.textPrimary}
            />
          </TouchableOpacity>
        </View>

        {/* ── Info Card ── */}
        <View style={styles.infoCard}>
          {/* School Name & Location */}
          <View style={styles.titleSection}>
            <Text style={styles.schoolName}>
              {school?.name || "Unknown School"}
            </Text>
            <View style={styles.locationRow}>
              <Ionicons
                name="location-sharp"
                size={14}
                color={COLORS.primary}
              />
              <Text style={styles.locationText}>
                {school?.district || school?.address || "Location unavailable"}
              </Text>
            </View>
          </View>

          {/* ── Stats Row ── */}
          <View style={styles.statsContainer}>
            <StatItem
              icon="location-outline"
              value={distanceVal}
              label="Distance"
            />
            <View style={styles.statsDivider} />
            <StatItem
              icon="people-outline"
              value={capacityVal}
              label="Capacity"
            />
            <View style={styles.statsDivider} />
            <StatItem
              icon="person-add-outline"
              value={availableVal}
              label="Available"
            />
          </View>

          {/* ── Section Divider ── */}
          <View style={styles.sectionDivider} />

          {/* ── About School ── */}
          <View style={styles.aboutSection}>
            <Text style={styles.sectionTitle}>About School</Text>
            <Text style={styles.descriptionText}>
              {description || "No description available for this school."}
            </Text>
          </View>

          {/* ── Extra Detail Chips ── */}
          <View style={styles.extraDetailsContainer}>
            <DetailChip
              icon="business-outline"
              label="Type"
              value={school?.type}
            />
            <DetailChip
              icon="call-outline"
              label="Phone"
              value={school?.phone}
            />
            <DetailChip
              icon="mail-outline"
              label="Email"
              value={school?.email}
            />
            <DetailChip
              icon="person-outline"
              label="Principal"
              value={school?.principalName}
            />
          </View>

          {/* Spacing so content isn't hidden behind fixed button */}
          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* ── Fixed Apply Now Button ── */}
      <View style={styles.applyButtonWrapper}>
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApplyNow}
          activeOpacity={0.85}
        >
          <Text style={styles.applyButtonText}>Apply Now</Text>
          <Ionicons
            name="arrow-forward"
            size={20}
            color={COLORS.white}
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/* ─── Sub-components ─────────────────────────────────────────────────────── */

function StatItem({ icon, value, label }) {
  return (
    <View style={styles.statItem}>
      <View style={styles.statIconCircle}>
        <Ionicons name={icon} size={20} color={COLORS.primary} />
      </View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function DetailChip({ icon, label, value }) {
  if (!value) return null;
  return (
    <View style={styles.chipRow}>
      <Ionicons
        name={icon}
        size={15}
        color={COLORS.primary}
        style={{ marginRight: 8 }}
      />
      <Text style={styles.chipLabel}>{label}: </Text>
      <Text style={styles.chipValue} numberOfLines={1}>
        {value}
      </Text>
    </View>
  );
}

/* ─── Styles ─────────────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // Centered states (loading / error)
  centeredContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 15,
    color: COLORS.textSecondary,
    fontWeight: "500",
  },
  errorTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 22,
  },
  retryButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginBottom: 12,
  },
  retryButtonText: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "700",
  },
  backTextButton: {
    paddingVertical: 10,
  },
  backTextButtonLabel: {
    fontSize: 15,
    color: COLORS.primary,
    fontWeight: "600",
  },

  // Scroll
  scrollView: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  // Hero image
  heroContainer: {
    width: SCREEN_WIDTH,
    height: IMAGE_HEIGHT,
    backgroundColor: COLORS.surface,
  },
  schoolImage: {
    width: "100%",
    height: "100%",
  },
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EEF2F7",
  },
  imagePlaceholderText: {
    marginTop: 10,
    fontSize: 14,
    color: COLORS.textMuted,
    fontWeight: "500",
  },

  // Overlay buttons
  overlayButton: {
    position: "absolute",
    top: 44,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 5,
  },
  backButton: { left: 16 },
  favoriteButton: { right: 16 },

  // Info card (rounded top corners, slides over image)
  infoCard: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  // Title
  titleSection: { marginBottom: 20 },
  schoolName: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: 0.2,
    marginBottom: 6,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginLeft: 4,
    fontWeight: "500",
  },

  // Stats
  statsContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.statsBg,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    marginBottom: 20,
    alignItems: "center",
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 6,
  },
  statValue: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textSecondary,
    fontWeight: "500",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statsDivider: {
    width: 1,
    height: 50,
    backgroundColor: COLORS.border,
  },

  // Divider
  sectionDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginBottom: 20,
  },

  // About
  aboutSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },

  // Detail chips
  extraDetailsContainer: { gap: 10 },
  chipRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
  },
  chipLabel: {
    fontSize: 13,
    color: COLORS.textSecondary,
    fontWeight: "600",
  },
  chipValue: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textPrimary,
    fontWeight: "500",
  },

  // Apply button
  applyButtonWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: COLORS.background,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  applyButton: {
    flexDirection: "row",
    backgroundColor: COLORS.primary,
    height: 54,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  applyButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
});
