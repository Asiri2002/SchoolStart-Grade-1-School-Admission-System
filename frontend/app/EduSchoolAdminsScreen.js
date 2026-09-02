import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
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
    deleteSchoolAdmin,
    getSchoolAdmins,
} from "../src/services/EduschoolAdminService";

import { colors } from "../theme/colors";

export default function SchoolAdminsScreen() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  // =========================================================
  // STATES
  // =========================================================

  const [schoolAdmins, setSchoolAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search
  const [searchQuery, setSearchQuery] = useState("");

  // Filter
  const [filterType, setFilterType] = useState("All");
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Pagination
  const itemsPerPage = 7;
  const [currentPage, setCurrentPage] = useState(1);

  // Delete
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [adminToDelete, setAdminToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // =========================================================
  // FETCH SCHOOL ADMINS
  // =========================================================

  const fetchSchoolAdmins = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getSchoolAdmins();

      console.log("School admins loaded:", data);

      if (Array.isArray(data)) {
        setSchoolAdmins(data);
      } else {
        setSchoolAdmins([]);
      }

      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching school admins:", err);

      setSchoolAdmins([]);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to load school admins from the database.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================================================
  // REFRESH WHEN SCREEN GETS FOCUS
  // =========================================================

  useFocusEffect(
    useCallback(() => {
      fetchSchoolAdmins();
    }, [fetchSchoolAdmins]),
  );

  // =========================================================
  // SEARCH & FILTER
  // =========================================================

  const filteredAdmins = useMemo(() => {
    return schoolAdmins.filter((admin) => {
      const query = searchQuery.trim().toLowerCase();

      const name = String(
        admin?.name || admin?.fullName || admin?.username || "",
      ).toLowerCase();

      const email = String(admin?.email || "").toLowerCase();

      const phone = String(admin?.phone || "").toLowerCase();

      const schoolName = String(admin?.schoolName || "").toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        email.includes(query) ||
        phone.includes(query) ||
        schoolName.includes(query);

      if (!matchesSearch) {
        return false;
      }

      // Active filter
      if (filterType === "Active") {
        return (
          admin?.enabled === true ||
          admin?.active === true ||
          String(admin?.status || "").toLowerCase() === "active"
        );
      }

      // Inactive filter
      if (filterType === "Inactive") {
        return (
          admin?.enabled === false ||
          admin?.active === false ||
          String(admin?.status || "").toLowerCase() === "inactive"
        );
      }

      return true;
    });
  }, [schoolAdmins, searchQuery, filterType]);

  // =========================================================
  // PAGINATION
  // =========================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredAdmins.length / itemsPerPage),
  );

  const displayedAdmins = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;

    return filteredAdmins.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAdmins, currentPage]);

  // =========================================================
  // ACTIONS
  // =========================================================

  const handleBack = () => {
    router.back();
  };

  const handleView = (admin) => {
    if (!admin?.id) {
      console.error("School Admin ID is missing:", admin);
      return;
    }

    router.push({
      pathname: "/EduSchoolAdminDetailsScreen",
      params: {
        id: String(admin.id),
      },
    });
  };

  const handleEdit = (admin) => {
    if (!admin?.id) {
      console.error("School Admin ID is missing:", admin);
      return;
    }

    console.log("Editing school admin ID:", admin.id);

    router.push({
      pathname: "/EditSchoolAdminScreen",
      params: {
        id: String(admin.id),
      },
    });
  };

  const handleAddSchoolAdmin = () => {
    router.push("/AddSchoolAdminScreen");
  };

  // =========================================================
  // DELETE
  // =========================================================

  const promptDeleteAdmin = (admin) => {
    if (!admin?.id) {
      console.error("Cannot delete school admin without ID:", admin);
      return;
    }

    setAdminToDelete(admin);
    setDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    if (isDeleting) {
      return;
    }

    setDeleteModalVisible(false);
    setAdminToDelete(null);
  };

  const confirmDelete = async () => {
    if (!adminToDelete?.id) {
      return;
    }

    setIsDeleting(true);
    setError(null);

    try {
      console.log("Deleting school admin:", adminToDelete.id);

      await deleteSchoolAdmin(String(adminToDelete.id));

      // Remove immediately from UI
      setSchoolAdmins((previous) =>
        previous.filter(
          (admin) => String(admin?.id) !== String(adminToDelete.id),
        ),
      );

      setDeleteModalVisible(false);
      setAdminToDelete(null);

      // Refresh from backend
      await fetchSchoolAdmins();
    } catch (err) {
      console.error("Delete school admin error:", err);

      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Unable to delete school admin.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  // =========================================================
  // STATUS
  // =========================================================

  const isAdminActive = (admin) => {
    if (typeof admin?.enabled === "boolean") {
      return admin.enabled;
    }

    if (typeof admin?.active === "boolean") {
      return admin.active;
    }

    return String(admin?.status || "").toLowerCase() === "active";
  };

  const renderStatusBadge = (admin) => {
    const active = isAdminActive(admin);

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

  // =========================================================
  // ADMIN NAME
  // =========================================================

  const getAdminName = (admin) => {
    return admin?.name || admin?.fullName || admin?.username || "Unnamed Admin";
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.mainCard}>
          {/* =================================================
              HEADER
          ================================================= */}

          <View style={styles.headerRow}>
            <View style={styles.headerLeftSection}>
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
                <Text style={styles.screenTitle}>School Admins</Text>

                <View style={styles.breadcrumbRow}>
                  <Text style={styles.breadcrumbMuted}>Dashboard</Text>

                  <Ionicons
                    name="chevron-forward"
                    size={13}
                    color={colors.text.muted}
                    style={styles.breadcrumbIcon}
                  />

                  <Text style={styles.breadcrumbActive}>School Admins</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.addAdminBtn}
              onPress={handleAddSchoolAdmin}
              activeOpacity={0.85}
            >
              <Ionicons name="add" size={18} color="#FFFFFF" />

              <Text style={styles.addAdminBtnText}>Add School Admin</Text>
            </TouchableOpacity>
          </View>

          {/* =================================================
              SEARCH & FILTER
          ================================================= */}

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
                placeholder="Search school admins..."
                placeholderTextColor={colors.text.placeholder}
                value={searchQuery}
                onChangeText={(text) => {
                  setSearchQuery(text);
                  setCurrentPage(1);
                }}
              />

              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
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
                onPress={() => setIsFilterDropdownOpen((previous) => !previous)}
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
                  {["All", "Active", "Inactive"].map((option) => (
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
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* =================================================
              LOADING
          ================================================= */}

          {loading && (
            <View style={styles.stateContainer}>
              <ActivityIndicator size="large" color={colors.primary} />

              <Text style={styles.loadingText}>Loading school admins...</Text>
            </View>
          )}

          {/* =================================================
              ERROR
          ================================================= */}

          {!loading && error && (
            <View style={styles.stateContainer}>
              <View style={styles.errorIconBg}>
                <Ionicons
                  name="alert-circle-outline"
                  size={40}
                  color={colors.status.inactiveText}
                />
              </View>

              <Text style={styles.errorTitle}>
                Unable to load school admins
              </Text>

              <Text style={styles.errorText}>{error}</Text>

              <TouchableOpacity
                style={styles.retryBtn}
                onPress={fetchSchoolAdmins}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh-outline" size={17} color="#FFFFFF" />

                <Text style={styles.retryBtnText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* =================================================
              EMPTY
          ================================================= */}

          {!loading && !error && displayedAdmins.length === 0 && (
            <View style={styles.stateContainer}>
              <View style={styles.emptyIconBg}>
                <Ionicons
                  name="people-outline"
                  size={38}
                  color={colors.primary}
                />
              </View>

              <Text style={styles.emptyTitle}>No school admins found</Text>

              <Text style={styles.emptySubtitle}>
                Try changing your search keywords or filter criteria.
              </Text>

              <TouchableOpacity
                style={styles.emptyAddBtn}
                onPress={handleAddSchoolAdmin}
                activeOpacity={0.8}
              >
                <Ionicons name="add" size={17} color="#FFFFFF" />

                <Text style={styles.emptyAddBtnText}>Add School Admin</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* =================================================
              ADMIN DATA
          ================================================= */}

          {!loading && !error && displayedAdmins.length > 0 && (
            <>
              {/* DESKTOP TABLE */}

              {isDesktop ? (
                <View style={styles.tableContainer}>
                  <View style={styles.tableHeaderRow}>
                    <Text style={[styles.thCell, styles.colIndex]}>#</Text>

                    <Text style={[styles.thCell, styles.colName]}>Name</Text>

                    <Text style={[styles.thCell, styles.colEmail]}>Email</Text>

                    <Text style={[styles.thCell, styles.colSchool]}>
                      School
                    </Text>

                    <Text style={[styles.thCell, styles.colStatus]}>
                      Status
                    </Text>

                    <Text style={[styles.thCell, styles.colActions]}>
                      Actions
                    </Text>
                  </View>

                  {displayedAdmins.map((admin, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <View
                        key={admin?.id || `admin-${index}`}
                        style={styles.tableRow}
                      >
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
                            styles.adminNameText,
                          ]}
                          numberOfLines={1}
                        >
                          {getAdminName(admin)}
                        </Text>

                        <Text
                          style={[
                            styles.tdCell,
                            styles.colEmail,
                            styles.secondaryText,
                          ]}
                          numberOfLines={1}
                        >
                          {admin?.email || "N/A"}
                        </Text>

                        <Text
                          style={[
                            styles.tdCell,
                            styles.colSchool,
                            styles.secondaryText,
                          ]}
                          numberOfLines={1}
                        >
                          {admin?.schoolName || "N/A"}
                        </Text>

                        <View style={[styles.colStatus, styles.statusCell]}>
                          {renderStatusBadge(admin)}
                        </View>

                        <View style={[styles.colActions, styles.actionsRow]}>
                          {/* VIEW */}

                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleView(admin)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="eye-outline"
                              size={18}
                              color={colors.actions.view}
                            />
                          </TouchableOpacity>

                          {/* EDIT */}

                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => handleEdit(admin)}
                            activeOpacity={0.7}
                          >
                            <Ionicons
                              name="create-outline"
                              size={18}
                              color={colors.actions.edit}
                            />
                          </TouchableOpacity>

                          {/* DELETE */}

                          <TouchableOpacity
                            style={styles.actionIconBtn}
                            onPress={() => promptDeleteAdmin(admin)}
                            activeOpacity={0.7}
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
                /* MOBILE CARDS */

                <View style={styles.mobileCardsList}>
                  {displayedAdmins.map((admin, index) => {
                    const rowNumber =
                      (currentPage - 1) * itemsPerPage + index + 1;

                    return (
                      <View
                        key={admin?.id || `mobile-admin-${index}`}
                        style={styles.mobileCard}
                      >
                        <View style={styles.mobileCardHeader}>
                          <View style={styles.mobileCardTitleGroup}>
                            <View style={styles.mobileIndexBadge}>
                              <Text style={styles.mobileIndexText}>
                                #{rowNumber}
                              </Text>
                            </View>

                            <Text
                              style={styles.mobileAdminName}
                              numberOfLines={2}
                            >
                              {getAdminName(admin)}
                            </Text>
                          </View>

                          <View style={styles.mobileCardActions}>
                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => handleView(admin)}
                            >
                              <Ionicons
                                name="eye-outline"
                                size={18}
                                color={colors.actions.view}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => handleEdit(admin)}
                            >
                              <Ionicons
                                name="create-outline"
                                size={18}
                                color={colors.actions.edit}
                              />
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={styles.mobileActionBtn}
                              onPress={() => promptDeleteAdmin(admin)}
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

                        <View style={styles.mobileInfoRow}>
                          <Ionicons
                            name="mail-outline"
                            size={15}
                            color={colors.text.muted}
                          />

                          <Text style={styles.mobileInfoText} numberOfLines={1}>
                            {admin?.email || "N/A"}
                          </Text>
                        </View>

                        <View style={styles.mobileInfoRow}>
                          <Ionicons
                            name="business-outline"
                            size={15}
                            color={colors.text.muted}
                          />

                          <Text style={styles.mobileInfoText} numberOfLines={1}>
                            {admin?.schoolName || "School not assigned"}
                          </Text>
                        </View>

                        <View style={styles.mobileStatusRow}>
                          {renderStatusBadge(admin)}
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* =================================================
                    PAGINATION
                ================================================= */}

              <View style={styles.paginationContainer}>
                <Text style={styles.paginationSummary}>
                  Showing{" "}
                  {filteredAdmins.length === 0
                    ? 0
                    : (currentPage - 1) * itemsPerPage + 1}{" "}
                  to{" "}
                  {Math.min(currentPage * itemsPerPage, filteredAdmins.length)}{" "}
                  of {filteredAdmins.length.toLocaleString()} school admins
                </Text>

                <View style={styles.paginationButtonsRow}>
                  {/* PREVIOUS */}

                  <TouchableOpacity
                    style={[
                      styles.pageNavBtn,
                      currentPage === 1 && styles.pageNavBtnDisabled,
                    ]}
                    disabled={currentPage === 1}
                    onPress={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
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

                  {/* PAGES */}

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

                  {/* NEXT */}

                  <TouchableOpacity
                    style={[
                      styles.pageNavBtn,
                      currentPage === totalPages && styles.pageNavBtnDisabled,
                    ]}
                    disabled={currentPage === totalPages}
                    onPress={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
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

      {/* =====================================================
          DELETE MODAL
      ===================================================== */}

      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeDeleteModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalIconWrapper}>
              <Ionicons name="trash-outline" size={28} color={colors.danger} />
            </View>

            <Text style={styles.modalTitle}>Delete School Admin</Text>

            <Text style={styles.modalDescription}>
              Are you sure you want to delete{" "}
              <Text style={styles.modalTargetName}>
                "{getAdminName(adminToDelete)}"
              </Text>
              ? This action cannot be undone.
            </Text>

            <View style={styles.modalButtonsRow}>
              <TouchableOpacity
                style={styles.modalCancelBtn}
                onPress={closeDeleteModal}
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

// =========================================================
// STYLES
// =========================================================

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

  // =========================================================
  // HEADER
  // =========================================================

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
  },

  breadcrumbIcon: {
    marginHorizontal: 4,
  },

  breadcrumbActive: {
    fontSize: 13,
    color: colors.text.muted,
    fontWeight: "500",
  },

  addAdminBtn: {
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 6,
  },

  addAdminBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // =========================================================
  // CONTROLS
  // =========================================================

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

  // =========================================================
  // TABLE
  // =========================================================

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
  },

  colName: {
    flex: 2,
    paddingRight: 12,
  },

  colEmail: {
    flex: 2.5,
    paddingRight: 12,
  },

  colSchool: {
    flex: 2,
    paddingRight: 12,
  },

  colStatus: {
    flex: 1.2,
  },

  colActions: {
    width: 110,
    alignItems: "flex-end",
  },

  indexText: {
    color: colors.text.secondary,
    fontWeight: "500",
  },

  adminNameText: {
    fontWeight: "600",
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

  // =========================================================
  // MOBILE
  // =========================================================

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

  mobileAdminName: {
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

  mobileInfoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },

  mobileInfoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text.secondary,
  },

  mobileStatusRow: {
    marginTop: 4,
  },

  // =========================================================
  // PAGINATION
  // =========================================================

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

  // =========================================================
  // STATES
  // =========================================================

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

  errorIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.dangerBg,
    alignItems: "center",
    justifyContent: "center",
  },

  errorTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: colors.danger,
  },

  errorText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: "center",
    maxWidth: 360,
    lineHeight: 20,
  },

  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
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

  emptyAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },

  emptyAddBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  // =========================================================
  // DELETE MODAL
  // =========================================================

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
