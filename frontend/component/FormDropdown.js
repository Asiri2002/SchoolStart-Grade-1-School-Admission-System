import { Ionicons } from "@expo/vector-icons";
import { useCallback, useState } from "react";
import {
    FlatList,
    Modal,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { COLORS, RADIUS, SHADOWS, SPACING, TYPOGRAPHY } from "../theme";

/**
 * FormDropdown – reusable labeled dropdown using a Modal sheet.
 *
 * Props:
 *  label       {string}          – field label
 *  placeholder {string}          – shown when no value selected
 *  options     {string[]}        – list of option strings
 *  value       {string|null}     – selected value
 *  onSelect    {function}        – called with selected string
 *  error       {string}          – validation error
 *  style       {object}          – extra container style
 */
const FormDropdown = ({
  label,
  placeholder,
  options = [],
  value,
  onSelect,
  error,
  style,
}) => {
  const [visible, setVisible] = useState(false);

  const open = useCallback(() => {
    setVisible(true);
  }, []);

  const close = useCallback(() => {
    setVisible(false);
  }, []);

  const handleSelect = useCallback(
    (item) => {
      onSelect(item);
      close();
    },
    [onSelect, close],
  );

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Dropdown Trigger */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={open}
        style={[styles.trigger, error ? styles.triggerError : null]}
        accessibilityRole="button"
        accessibilityLabel={label || placeholder}
      >
        <Text style={[styles.triggerText, !value && styles.placeholderText]}>
          {value || placeholder}
        </Text>

        <Ionicons name="chevron-down" size={18} color={COLORS.textSecondary} />
      </TouchableOpacity>

      {/* Validation Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Options Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={close}
      >
        <Pressable style={styles.backdrop} onPress={close}>
          <View style={styles.sheet}>
            {/* Sheet Header */}
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label || placeholder}</Text>

              <TouchableOpacity onPress={close} hitSlop={12}>
                <Ionicons name="close" size={22} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Options */}
            <FlatList
              data={options}
              keyExtractor={(item) => item}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => {
                const selected = item === value;

                return (
                  <TouchableOpacity
                    style={[styles.option, selected && styles.optionSelected]}
                    onPress={() => handleSelect(item)}
                    activeOpacity={0.6}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        selected && styles.optionTextSelected,
                      ]}
                    >
                      {item}
                    </Text>

                    {selected && (
                      <Ionicons
                        name="checkmark"
                        size={18}
                        color={COLORS.primary}
                      />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.lg,
  },

  label: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },

  trigger: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    backgroundColor: COLORS.inputBg,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,

    height: 50,

    paddingHorizontal: SPACING.lg,
  },

  triggerError: {
    borderColor: COLORS.error,
  },

  triggerText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
    flex: 1,
  },

  placeholderText: {
    color: COLORS.placeholder,
  },

  errorText: {
    marginTop: SPACING.xs,
    fontSize: TYPOGRAPHY.xs,
    color: COLORS.error,
  },

  // ───────────────────────────────────────────────────────────────────────────
  // Modal
  // ───────────────────────────────────────────────────────────────────────────

  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
    justifyContent: "flex-end",
  },

  sheet: {
    backgroundColor: COLORS.white,

    borderTopLeftRadius: RADIUS.lg,
    borderTopRightRadius: RADIUS.lg,

    paddingBottom: Platform.OS === "ios" ? 34 : SPACING.xxl,

    maxHeight: "60%",

    ...SHADOWS.md,
  },

  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,

    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  sheetTitle: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.semiBold,
    color: COLORS.textPrimary,
  },

  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: SPACING.xxl,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    paddingHorizontal: SPACING.xxl,
    paddingVertical: SPACING.lg,
  },

  optionSelected: {
    backgroundColor: COLORS.primaryLight,
  },

  optionText: {
    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,
  },

  optionTextSelected: {
    color: COLORS.primary,
    fontWeight: TYPOGRAPHY.semiBold,
  },
});

export default FormDropdown;
