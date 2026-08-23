// app/EduSchoolsScreen.js

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import {
  deleteSchool as apiDeleteSchool,
  getSchools,
} from "../src/services/EduschoolService";

import { colors } from "../theme/colors";

export default function EduSchoolsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // States
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Pagination
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Delete Modal
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch schools
  useEffect(() => {
    fetchSchoolsData();
  }, []);

  const fetchSchoolsData = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSchools();

      if (Array.isArray(data)) {
        setSchools(data);
      } else {
        setSchools([]);
      }
    } catch (err) {
      console.error("Error fetching schools:", err);

      setSchools([]);
      setError(err?.message || "Unable to load schools from the database.");
    } finally {
      setLoading(false);
    }
  };

  // Filter & Search
  const filteredSchools = useMemo(() => {
    return schools.filter((school) => {
      const query = searchQuery.trim().toLowerCase();

      const matchesSearch =
        !query ||
        school.name?.toLowerCase().includes(query) ||
        school.district?.toLowerCase().includes(query) ||
        school.code?.toLowerCase().includes(query);

      if (!matchesSearch) {
        return false;
      }

      if (filterType === "Active") {
        return school.active === true || school.status === "Active";
      }

      if (filterType === "Inactive") {
        return school.active === false || school.status === "Inactive";
      }

      if (filterType === "National") {
        return school.type?.toLowerCase() === "national";
      }

      if (filterType === "Private") {
        return school.type?.toLowerCase() === "private";
      }

      return true;
    });
  }, [schools, searchQuery, filterType]);

  // Pagination
  const totalPages = Math.max(
    1,
    Math.ceil(filteredSchools.length / itemsPerPage),
  );

  const displayedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredSchools.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchools, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  // Action handlers

  const handleBack = () => {
    router.back();
  };

  const handleView = (school) => {
    router.push({
      pathname: "/EduSchoolDetailsScreen",
      params: {
        id: school.id,
      },
    });
  };

  const handleEdit = (school) => {
    router.push({
      pathname: "/EditSchoolScreen",
      params: {
        id: school.id,
      },
    });
  };

  const handleAddSchool = () => {
    router.push("/AddSchoolScreen");
  };

  const promptDeleteSchool = (school) => {
    setSchoolToDelete(school);
    setDeleteModalVisible(true);
  };

  const confirmDelete = async () => {
    if (!schoolToDelete) {
      return;
    }

    setIsDeleting(true);

    try {
      await apiDeleteSchool(schoolToDelete.id);

      setSchools((prev) =>
        prev.filter((school) => school.id !== schoolToDelete.id),
      );

      setDeleteModalVisible(false);
      setSchoolToDelete(null);
    } catch (err) {
      console.error("Delete school error:", err);

      setError(err?.message || "Unable to delete school.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Status helper
  const isSchoolActive = (school) => {
    if (typeof school.active === "boolean") {
      return school.active;
    }

    return school.status === "Active";
  };

  const renderStatusBadge = (school) => {
    const active = isSchoolActive(school);

    return (
      <View
        style={[
          styles.badge,
          {
            backgroundColor: active
              ? colors.status.activeBg
              : colors.status.inactiveBg,
          },
        ]}
      >
        <Text
          style={[
            styles.badgeText,
            {
              color: active
                ? colors.status.activeText
                : colors.status.inactiveText,
            },
          ]}
        >
          {active ? "Active" : "Inactive"}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* Header */}

          <View style={styles.headerRow}>
            <View style={styles.headerLeftSection}>
              {/* Back Button */}

              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="arrow-back"
                  size={20}
                  color={colors.text.secondary}
                />
              </TouchableOpacity>

              <View style={styles.headerTextGroup}>
                <Text style={styles.screenTitle}>Schools</Text>

                <View style={styles.breadcrumbRow}>
                  <Text style={styles.breadcrumbMuted}>Dashboard</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={colors.text.muted}
                    style={styles.breadcrumbIcon}
                  />

                  <Text style={styles.breadcrumbActive}>Schools</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addSchoolBtn}
              onPress={handleAddSchool}
              activeOpacity={0.85}
            >
              <Ionicons
                name="add"
                size={18}
                color="#FFFFFF"
                style={styles.addBtnIcon}
              />

              <Text style={styles.addSchoolBtnText}>Add New School</Text>
            </TouchableOpacity>
          </View>

          {/* Search & Filter */}

          <View style={styles.controlsRow}>
            <View style={styles.searchBarContainer}>
              <Ionicons
                name="search-outline"
                size={18}
                color={colors.text.placeholder}
                style={styles.searchIcon}
              />

              <TextInput
                style={styles.searchInput}
                placeholder="Search schools..."
                placeholderTextColor={colors.text.placeholder}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setCurrentPage(1);
                }}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => setSearchQuery("")}
                  style={styles.clearSearchBtn}
                >
                  <Ionicons
                    name="close-circle"
                    size={16}
                    color={colors.text.placeholder}
                  />
                </TouchableOpacity>
              )}
            </View>

            <View style={styles.filterDropdownWrapper}>
              <TouchableOpacity
                style={[
                  styles.filterBtn,
                  filterType !== "All" && styles.filterBtnActive,
                ]}
                onPress={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="filter-outline"
                  size={17}
                  color={
                    filterType !== "All"
                      ? colors.primary
                      : colors.text.secondary
                  }
                />

                <Text
                  style={[
                    styles.filterBtnText,
                    filterType !== "All" && styles.filterBtnTextActive,
                  ]}
                >
                  {filterType === "All" ? "Filter" : `Filter: ${filterType}`}
                </Text>

                <Ionicons
                  name={isFilterDropdownOpen ? "chevron-up" : "chevron-down"}
                  size={14}
                  color={
                    filterType !== "All" ? colors.primary : colors.text.muted
                  }
                />
              </TouchableOpacity>

              {isFilterDropdownOpen && (
                <View style={styles.dropdownMenu}>
                  {["All", "Active", "Inactive", "National", "Private"].map(
                    (option) => (
                      <TouchableOpacity
                        key={option}
                        style={[
                          styles.dropdownItem,
                          filterType === option && styles.dropdownItemActive,
                        ]}
                        onPress={() => {
                          setFilterType(option);
                          setIsFilterDropdownOpen(false);
                          setCurrentPage(1);
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownItemText,
                            filterType === option &&
                              styles.dropdownItemTextActive,
                          ]}
                        >
                          {option}
                        </Text>

                        {filterType === option && (
                          <Ionicons
                            name="checkmark"
                            size={16}
                            color={colors.primary}
                          />
                        )}
                      </TouchableOpacity>
                    ),
                  )}
                </View>
              )}
            </View>
          </View>

          {/* Loading */}

          {loading && (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.loadingText}>Loading schools data...</Text>
            </View>
          )}

          {/* Error */}

          {!loading && error && (
            <View style={styles.stateContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={colors.status.inactiveText}
              />

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                style={styles.retryBtn}
                onPress={fetchSchoolsData}
                activeOpacity={0.8}
              >
                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Empty */}

          {!loading && !error && displayedSchools.length === 0 && (
            <View style={styles.stateContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons
                  name="business-outline"
                  size={38}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>No schools found</Text>

              <Text style={styles.emptySubtitle}>
                Try changing your search keywords or filter criteria.
              </Text>
            </View>
          )}

          {/* School Data */}

          {!loading && !error && displayedSchools.length > 0 && (
            <>
              {isDesktop ? (
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thCell, styles.colIndex]}>#</Text>

                    <Text style={[styles.thCell, styles.colName]}>
                      School Name
                    </Text>

                    <Text style={[styles.thCell, styles.colDistrict]}>
                      District
                    </Text>

                    <Text style={[styles.thCell, styles.colType]}>Type</Text>

                    <Text style={[styles.thCell, styles.colStatus]}>
                      Status
                    </Text>

                    <Text style={[styles.thCell, styles.colActions]}>
                      Actions
                    </Text>
                  </View>

                  {displayedSchools.map((school, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <View key={school.id || index} style={styles.tableRow}>
                        <Text
                          style={[
                            styles.tdCell,
                            styles.colIndex,
                            styles.indexText,
                          ]}
                        >
                          {rowNumber}
                        </Text>

                        <Text
                          style={[
                            styles.tdCell,
                            styles.colName,
                            styles.schoolNameText,
                          ]}
                        >
                          {school.name}
                        </Text>

                        <Text
                          style={[
                            styles.tdCell,
                            styles.colDistrict,
                            styles.secondaryText,
                          ]}
                        >
                          {school.district}
                        </Text>

                        <Text
                          style={[
                            styles.tdCell,
                            styles.colType,
                            styles.secondaryText,
                          ]}
                        >
                          {school.type}
                        </Text>

                        <View style={[styles.colStatus, styles.statusCell]}>
                          {renderStatusBadge(school)}
                        </View>

                        <View style={[styles.colActions, styles.actionsRow]}>
                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleView(school)}
                          >
                            <Ionicons
                              name="eye-outline"
                              size={18}
                              color={colors.actions.view}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleEdit(school)}
                          >
                            <Ionicons
                              name="create-outline"
                              size={18}
                              color={colors.actions.edit}
                            />
                          </TouchableOpacity>

                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => promptDeleteSchool(school)}
                          >
                            <Ionicons
                              name="trash-outline"
                              size={18}
                              color={colors.actions.delete}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.mobileCardsList}>
                  {displayedSchools.map((school, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <View key={school.id || index} style={styles.mobileCard}>
                        <View style={styles.mobileCardHeader}>
                          <View style={styles.mobileCardTitleGroup}>
                            <View style={styles.mobileIndexBadge}>
                              <Text style={styles.mobileIndexText}>
                                #{rowNumber}
                              </Text>
                            </View>

                            <Text style={styles.mobileSchoolName}>
                              {school.name}
                            </Text>
                          </View>

                          <View style={styles.mobileCardActions}>
                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => handleView(school)}
                            >
                              <Ionicons
                                name="eye-outline"
                                size={18}
                                color={colors.actions.view}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => handleEdit(school)}
                            >
                              <Ionicons
                                name="create-outline"
                                size={18}
                                color={colors.actions.edit}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => promptDeleteSchool(school)}
                            >
                              <Ionicons
                                name="trash-outline"
                                size={18}
                                color={colors.actions.delete}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>

                        <View style={styles.mobileCardDivider} />

                        <View style={styles.mobileCardMetaRow}>
                          <View style={styles.mobileMetaItem}>
                            <Ionicons
                              name="location-outline"
                              size={14}
                              color={colors.text.muted}
                            />

                            <Text style={styles.mobileMetaText}>
                              {school.district}
                            </Text>
                          </View>

                          <View style={styles.mobileMetaItem}>
                            <Ionicons
                              name="school-outline"
                              size={14}
                              color={colors.text.muted}
                            />

                            <Text style={styles.mobileMetaText}>
                              {school.type}
                            </Text>
                          </View>

                          <View style={styles.mobileStatusWrapper}>
                            {renderStatusBadge(school)}
                          </View>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Pagination */}

              <View style={styles.paginationContainer}>
                <Text style={styles.paginationSummary}>
                  Showing{" "}
                  {Math.min(
                    (currentPage - 1) * itemsPerPage + 1,
                    filteredSchools.length,
                  )}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredSchools.length)}{" "}
                  of {filteredSchools.length.toLocaleString()} schools
                </Text>

                <View style={styles.paginationButtonsRow}>
                  <TouchableOpacity
                    style={[
                      styles.pageNavBtn,
                      currentPage === 1 && styles.pageNavBtnDisabled,
                    ]}
                    disabled={currentPage === 1}
                    onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    <Ionicons
                      name="chevron-back"
                      size={16}
                      color={
                        currentPage === 1
                          ? colors.text.placeholder
                          : colors.text.secondary
                      }
                    />
                  </TouchableOpacity>

                  {Array.from({ length: totalPages }, (_, index) => index + 1)
                    .slice(0, Math.min(totalPages, 3))
                    .map((page) => (
                      <TouchableOpacity
                        key={page}
                        style={[
                          styles.pageBtn,
                          currentPage === page && styles.pageBtnActive,
                        ]}
                        onPress={() => setCurrentPage(page)}
                      >
                        <Text
                          style={[
                            styles.pageBtnText,
                            currentPage === page && styles.pageBtnTextActive,
                          ]}
                        >
                          {page}
                        </Text>
                      </TouchableOpacity>
                    ))}

                  {totalPages > 3 && (
                    <>
                      <Text style={styles.pageEllipsis}>...</Text>

                      <TouchableOpacity
                        style={[
                          styles.pageBtn,
                          currentPage === totalPages && styles.pageBtnActive,
                        ]}
                        onPress={() => setCurrentPage(totalPages)}
                      >
                        <Text
                          style={[
                            styles.pageBtnText,
                            currentPage === totalPages &&
                              styles.pageBtnTextActive,
                          ]}
                        >
                          {totalPages}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}

                  <TouchableOpacity
                    style={styles.pageNavBtn}
                    disabled={currentPage === totalPages}
                    onPress={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                  >
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color={
                        currentPage === totalPages
                          ? colors.text.placeholder
                          : colors.text.secondary
                      }
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </>
          )}
        </View>
      </ScrollView>

      {/* Delete Confirmation Modal */}

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="trash-outline" size={28} color={colors.danger} />
            </View>

            <Text style={styles.modalTitle}>Delete School</Text>

            <Text style={styles.modalDescription}>
              Are you sure you want to delete{" "}
              <Text style={styles.modalTargetName}>
                "{schoolToDelete?.name || "this school"}"
              </Text>
              ? This action cannot be undone.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={() => setDeleteModalVisible(false)}
                disabled={isDeleting}
              >
                <Text style={styles.modalCancelBtnText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={confirmDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.modalDeleteBtnText}>Delete</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },

  scrollContainer: {
    padding: 24,
    flexGrow: 1,
  },

  mainCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: colors.border,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },

      android: {
        elevation: 2,
      },

      web: {
        boxShadow: "0 4px 16px rgba(0, 0, 0, 0.03)",
      },
    }),
  },

  // Header

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    marginBottom: 24,
  },

  headerLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  headerTextGroup: {
    flexDirection: "column",
  },

  screenTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: colors.text.primary,
    letterSpacing: -0.5,
  },

  breadcrumbRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },

  breadcrumbMuted: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "400",
  },

  breadcrumbIcon: {
    marginHorizontal: 4,
  },

  breadcrumbActive: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "500",
  },

  addSchoolBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },

  addBtnIcon: {
    marginRight: -2,
  },

  addSchoolBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // Controls

  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
    zIndex: 10,
  },

  searchBarContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 44,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text.primary,
    height: "100%",
  },

  clearSearchBtn: {
    padding: 4,
  },

  filterDropdownWrapper: {
    position: "relative",
    zIndex: 20,
  },

  filterBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    height: 44,
    gap: 8,
  },

  filterBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },

  filterBtnText: {
    fontSize: 14,
    color: colors.text.secondary,
    fontWeight: "500",
  },

  filterBtnTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  dropdownMenu: {
    position: "absolute",
    top: 50,
    right: 0,
    width: 170,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 6,

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 10,
      },

      android: {
        elevation: 6,
      },

      web: {
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
      },
    }),
  },

  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  dropdownItemActive: {
    backgroundColor: colors.primaryLight,
  },

  dropdownItemText: {
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: "500",
  },

  dropdownItemTextActive: {
    color: colors.primary,
    fontWeight: "600",
  },

  // Table

  tableContainer: {
    width: "100%",
    marginTop: 8,
  },

  tableHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  thCell: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text.primary,
  },

  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },

  tdCell: {
    fontSize: 14,
    color: colors.text.primary,
  },

  colIndex: {
    width: 45,
    textAlign: "left",
  },

  colName: {
    flex: 3,
    paddingRight: 12,
  },

  colDistrict: {
    flex: 2,
    paddingRight: 12,
  },

  colType: {
    flex: 2,
    paddingRight: 12,
  },

  colStatus: {
    flex: 1.8,
  },

  colActions: {
    width: 110,
    alignItems: "flex-end",
  },

  indexText: {
    color: colors.text.secondary,
    fontWeight: "500",
  },

  schoolNameText: {
    fontWeight: "500",
    color: colors.text.primary,
  },

  secondaryText: {
    color: colors.text.secondary,
  },

  statusCell: {
    flexDirection: "row",
    alignItems: "center",
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },

  badgeText: {
    fontSize: 12,
    fontWeight: "600",
  },

  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 12,
  },

  actionIconBtn: {
    padding: 4,
  },

  // Mobile

  mobileCardsList: {
    gap: 12,
    marginTop: 8,
  },

  mobileCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },

  mobileCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  mobileCardTitleGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flex: 1,
  },

  mobileIndexBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },

  mobileIndexText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.text.muted,
  },

  mobileSchoolName: {
    fontSize: 15,
    fontWeight: "600",
    color: colors.text.primary,
    flex: 1,
  },

  mobileCardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  mobileActionBtn: {
    padding: 4,
  },

  mobileCardDivider: {
    height: 1,
    backgroundColor: colors.borderLight,
    marginVertical: 12,
  },

  mobileCardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 8,
  },

  mobileMetaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },

  mobileMetaText: {
    fontSize: 13,
    color: colors.text.secondary,
  },

  mobileStatusWrapper: {
    marginLeft: "auto",
  },

  // Pagination

  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginTop: 28,
    paddingTop: 12,
    gap: 16,
  },

  paginationSummary: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "400",
  },

  paginationButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  pageNavBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  pageNavBtnDisabled: {
    opacity: 0.4,
  },

  pageBtn: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },

  pageBtnActive: {
    backgroundColor: colors.primary,
  },

  pageBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: colors.text.secondary,
  },

  pageBtnTextActive: {
    color: "#FFFFFF",
    fontWeight: "700",
  },

  pageEllipsis: {
    color: colors.text.placeholder,
    fontSize: 13,
    paddingHorizontal: 4,
  },

  // States

  stateContainer: {
    paddingVertical: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },

  loadingText: {
    fontSize: 14,
    color: colors.text.muted,
    marginTop: 8,
  },

  errorText: {
    fontSize: 15,
    color: colors.danger,
    fontWeight: "500",
    textAlign: "center",
  },

  retryBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },

  retryBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  emptyIconBg: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.text.primary,
  },

  emptySubtitle: {
    fontSize: 14,
    color: colors.text.muted,
    textAlign: "center",
    maxWidth: 320,
  },

  // Modal

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 420,
    alignItems: "center",

    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 6,
        },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },

      android: {
        elevation: 8,
      },

      web: {
        boxShadow: "0 12px 32px rgba(0,0,0,0.18)",
      },
    }),
  },

  modalIconWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text.primary,
    marginBottom: 8,
  },

  modalDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },

  modalTargetName: {
    fontWeight: "600",
    color: colors.text.primary,
  },

  modalButtonsRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },

  modalCancelBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },

  modalCancelBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.text.secondary,
  },

  modalDeleteBtn: {
    flex: 1,
    height: 42,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.danger,
  },

  modalDeleteBtnText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFFFFF",
  },
});
