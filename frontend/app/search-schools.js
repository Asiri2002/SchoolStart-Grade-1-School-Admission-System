import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";

import {
    ActivityIndicator,
    FlatList,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

import SchoolCard from "../component/SchoolCard";

import { fetchSchools } from "../src/services/schoolService";

export default function SearchSchoolsScreen() {
  const router = useRouter();

  // Get selected child from Parent Dashboard
  const { childId, childName } = useLocalSearchParams();

  // ------------------------------------------------------------------
  // State
  // ------------------------------------------------------------------

  const [schools, setSchools] = useState([]);

  const [query, setQuery] = useState("");

  const [favorites, setFavorites] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  // ------------------------------------------------------------------
  // Load schools from backend
  // ------------------------------------------------------------------

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching schools from backend...");

      const data = await fetchSchools();

      console.log("Schools received:", data);

      setSchools(data || []);
    } catch (err) {
      console.error("School fetch error:", err);

      setError("Unable to load schools.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Load when screen opens
  // ------------------------------------------------------------------

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  // ------------------------------------------------------------------
  // Filter schools
  // ------------------------------------------------------------------

  const filtered = schools.filter((school) => {
    const q = query.toLowerCase().trim();

    if (!q) return true;

    return (
      school.name?.toLowerCase().includes(q) ||
      school.location?.toLowerCase().includes(q)
    );
  });

  // ------------------------------------------------------------------
  // Toggle favorite
  // ------------------------------------------------------------------

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) =>
      prev.includes(id)
        ? prev.filter((favoriteId) => favoriteId !== id)
        : [...prev, id],
    );
  }, []);

  // ------------------------------------------------------------------
  // Select school
  // ------------------------------------------------------------------

  const handleSchoolPress = useCallback(
    (school) => {
      console.log("Selected Child:", childId);
      console.log("Selected School:", school.id);

      // Later navigate to application form
      router.push({
        pathname: "/ApplicationFormScreen",

        params: {
          childId: childId,
          childName: childName,
          schoolId: school.id,
          schoolName: school.name,
        },
      });
    },
    [router, childId, childName],
  );

  // ------------------------------------------------------------------
  // Render School
  // ------------------------------------------------------------------

  const renderItem = ({ item }) => (
    <SchoolCard
      school={item}
      isFavorite={favorites.includes(item.id)}
      onFavoritePress={() => toggleFavorite(item.id)}
      onPress={() => handleSchoolPress(item)}
    />
  );

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color="#C8C8C8" />

      <Text style={styles.emptyText}>No schools found</Text>

      <Text style={styles.emptySubText}>Try a different name or area.</Text>
    </View>
  );

  // ------------------------------------------------------------------
  // Loading
  // ------------------------------------------------------------------

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#388E3C" />

        <Text style={styles.loadingText}>Loading schools...</Text>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------------------
  // Error
  // ------------------------------------------------------------------

  if (error) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Ionicons name="alert-circle-outline" size={50} color="#E53935" />

        <Text style={styles.errorText}>{error}</Text>

        <TouchableOpacity style={styles.retryButton} onPress={loadSchools}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  // ------------------------------------------------------------------
  // UI
  // ------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          hitSlop={{
            top: 10,
            bottom: 10,
            left: 10,
            right: 10,
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Search Schools</Text>

        <View style={styles.headerRight} />
      </View>

      {/* Selected Child */}

      {childName && (
        <View style={styles.childInfo}>
          <Text style={styles.childInfoText}>Schools for: {childName}</Text>
        </View>
      )}

      {/* Search Bar */}

      <View style={styles.searchWrapper}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search-outline"
            size={18}
            color="#9E9E9E"
            style={styles.searchIcon}
          />

          <TextInput
            style={styles.searchInput}
            placeholder="Search by school name or area..."
            placeholderTextColor="#B0B0B0"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* School List */}

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={filtered.length === 0 && styles.emptyList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Can't find your school? </Text>

        <TouchableOpacity onPress={() => router.push("/request-school")}>
          <Text style={styles.footerLink}>Request to Add</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  loadingText: {
    marginTop: 15,
    fontSize: 15,
    color: "#666",
  },

  errorText: {
    marginTop: 15,
    fontSize: 15,
    color: "#E53935",
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: "#388E3C",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E8E8",
  },

  backBtn: {
    padding: 2,
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 17,
    fontWeight: "700",
    color: "#1A1A1A",
  },

  headerRight: {
    width: 28,
  },

  childInfo: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  childInfoText: {
    fontSize: 14,
    color: "#388E3C",
    fontWeight: "600",
  },

  searchWrapper: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },

  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EBEBEB",
    paddingHorizontal: 12,
    height: 44,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    paddingVertical: 0,
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#6B6B6B",
    marginTop: 12,
  },

  emptySubText: {
    fontSize: 13,
    color: "#B0B0B0",
    marginTop: 6,
  },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8E8E8",
    backgroundColor: "#FFFFFF",
  },

  footerText: {
    fontSize: 13,
    color: "#6B6B6B",
  },

  footerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: "#388E3C",
  },
});
