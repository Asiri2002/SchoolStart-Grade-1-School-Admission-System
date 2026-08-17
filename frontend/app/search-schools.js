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

import {
  fetchSchools,
  getSchoolsByDistrict,
  getSchoolsByType,
  searchSchools,
} from "../src/services/schoolService";

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

  // Filter states
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedType, setSelectedType] = useState("");

  // ------------------------------------------------------------------
  // Load all schools from backend
  // GET /api/schools
  // ------------------------------------------------------------------

  const loadSchools = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Fetching schools from backend...");

      const data = await fetchSchools();

      console.log("Schools received:", data);

      setSchools(data || []);

      // Reset filters
      setSelectedDistrict("");
      setSelectedType("");
    } catch (err) {
      console.error("School fetch error:", err);

      setError("Unable to load schools.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Load schools when screen opens
  // ------------------------------------------------------------------

  useEffect(() => {
    loadSchools();
  }, [loadSchools]);

  // ------------------------------------------------------------------
  // Search schools
  // GET /api/schools/search?query={query}
  // ------------------------------------------------------------------

  const handleSearch = useCallback(async (text) => {
    setQuery(text);

    try {
      setError(null);

      // If search box is empty, load all schools
      if (!text.trim()) {
        setLoading(true);

        const data = await fetchSchools();

        setSchools(data || []);

        setSelectedDistrict("");
        setSelectedType("");

        return;
      }

      setLoading(true);

      console.log("Searching schools:", text);

      const data = await searchSchools(text);

      console.log("Search results:", data);

      setSchools(data || []);

      setSelectedDistrict("");
      setSelectedType("");
    } catch (err) {
      console.error("School search error:", err);

      setError("Unable to search schools.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Filter schools by district
  // GET /api/schools/district/{district}
  // ------------------------------------------------------------------

  const handleDistrictFilter = useCallback(async (district) => {
    try {
      setLoading(true);
      setError(null);

      setSelectedDistrict(district);
      setSelectedType("");
      setQuery("");

      console.log("Filtering schools by district:", district);

      const data = await getSchoolsByDistrict(district);

      console.log("District schools:", data);

      setSchools(data || []);
    } catch (err) {
      console.error("District filter error:", err);

      setError("Unable to filter schools by district.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Filter schools by type
  // GET /api/schools/type/{type}
  // ------------------------------------------------------------------

  const handleTypeFilter = useCallback(async (type) => {
    try {
      setLoading(true);
      setError(null);

      setSelectedType(type);
      setSelectedDistrict("");
      setQuery("");

      console.log("Filtering schools by type:", type);

      const data = await getSchoolsByType(type);

      console.log("School type results:", data);

      setSchools(data || []);
    } catch (err) {
      console.error("School type filter error:", err);

      setError("Unable to filter schools by type.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ------------------------------------------------------------------
  // Clear all filters
  // ------------------------------------------------------------------

  const handleShowAll = useCallback(async () => {
    setQuery("");
    setSelectedDistrict("");
    setSelectedType("");

    await loadSchools();
  }, [loadSchools]);

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
  // Navigate to SchoolDetailsScreen
  // ------------------------------------------------------------------

  const handleSchoolPress = useCallback(
    (school) => {
      console.log("Selected Child:", childId);
      console.log("Selected School:", school.id);

      router.push({
        pathname: "/SchoolDetailsScreen",

        params: {
          childId: childId,
          childName: childName,
          schoolId: school.id,
        },
      });
    },
    [router, childId, childName],
  );

  // ------------------------------------------------------------------
  // Render School Card
  // ------------------------------------------------------------------

  const renderItem = ({ item }) => (
    <SchoolCard
      school={item}
      isFavorite={favorites.includes(item.id)}
      onFavoritePress={() => toggleFavorite(item.id)}
      onPress={() => handleSchoolPress(item)}
    />
  );

  // ------------------------------------------------------------------
  // Empty List
  // ------------------------------------------------------------------

  const ListEmpty = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search-outline" size={48} color="#C8C8C8" />

      <Text style={styles.emptyText}>No schools found</Text>

      <Text style={styles.emptySubText}>
        Try a different school name, district, or type.
      </Text>
    </View>
  );

  // ------------------------------------------------------------------
  // Initial Loading
  // ------------------------------------------------------------------

  if (loading && schools.length === 0) {
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

  if (error && schools.length === 0) {
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
            placeholder="Search by school name or code..."
            placeholderTextColor="#B0B0B0"
            value={query}
            onChangeText={handleSearch}
            returnKeyType="search"
          />

          {query.length > 0 && (
            <TouchableOpacity onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={18} color="#9E9E9E" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Filters */}

      <View style={styles.filterContainer}>
        {/* All */}

        <TouchableOpacity
          style={[
            styles.filterButton,
            !selectedDistrict && !selectedType && !query && styles.activeFilter,
          ]}
          onPress={handleShowAll}
        >
          <Text
            style={[
              styles.filterText,
              !selectedDistrict &&
                !selectedType &&
                !query &&
                styles.activeFilterText,
            ]}
          >
            All
          </Text>
        </TouchableOpacity>

        {/* Colombo District */}

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedDistrict === "Colombo" && styles.activeFilter,
          ]}
          onPress={() => handleDistrictFilter("Colombo")}
        >
          <Text
            style={[
              styles.filterText,
              selectedDistrict === "Colombo" && styles.activeFilterText,
            ]}
          >
            Colombo
          </Text>
        </TouchableOpacity>

        {/* National Type */}

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === "National" && styles.activeFilter,
          ]}
          onPress={() => handleTypeFilter("National")}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === "National" && styles.activeFilterText,
            ]}
          >
            National
          </Text>
        </TouchableOpacity>

        {/* Provincial Type */}

        <TouchableOpacity
          style={[
            styles.filterButton,
            selectedType === "Provincial" && styles.activeFilter,
          ]}
          onPress={() => handleTypeFilter("Provincial")}
        >
          <Text
            style={[
              styles.filterText,
              selectedType === "Provincial" && styles.activeFilterText,
            ]}
          >
            Provincial
          </Text>
        </TouchableOpacity>
      </View>

      {/* Loading while searching/filtering */}

      {loading && schools.length > 0 && (
        <View style={styles.smallLoading}>
          <ActivityIndicator size="small" color="#388E3C" />
        </View>
      )}

      {/* School List */}

      <FlatList
        data={schools}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={schools.length === 0 && styles.emptyList}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />

      {/* Footer */}

      <View style={styles.footer}>
        <Text style={styles.footerText}>Can't find your school?</Text>

        <TouchableOpacity onPress={() => router.push("/request-school")}>
          <Text style={styles.footerLink}> Request to Add</Text>
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

  smallLoading: {
    paddingBottom: 8,
    alignItems: "center",
  },

  errorText: {
    marginTop: 15,
    fontSize: 15,
    color: "#E53935",
    textAlign: "center",
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
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 0,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: "#1A1A1A",
    paddingVertical: 0,

    // Remove blue focus line on web
    outlineStyle: "none",
    borderWidth: 0,
  },

  filterContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },

  filterButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },

  activeFilter: {
    backgroundColor: "#388E3C",
    borderColor: "#388E3C",
  },

  filterText: {
    fontSize: 12,
    color: "#666",
    fontWeight: "600",
  },

  activeFilterText: {
    color: "#FFFFFF",
  },

  emptyList: {
    flexGrow: 1,
  },

  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 60,
    paddingHorizontal: 20,
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
    textAlign: "center",
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
