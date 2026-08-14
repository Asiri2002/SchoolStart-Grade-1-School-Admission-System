import { StyleSheet, Text, TextInput, View } from "react-native";

import { COLORS, RADIUS, SPACING, TYPOGRAPHY } from "../theme";

/**
 * FormInput – reusable labeled text input.
 *
 * Props:
 *  label       {string}   – field label shown above the input
 *  value       {string}
 *  onChangeText{function}
 *  placeholder {string}
 *  error       {string}   – validation error message
 *  rightIcon   {node}     – optional element rendered on the right side
 *  editable    {boolean}  – defaults to true
 *  style       {object}   – extra style for the outer container
 *  inputStyle  {object}   – extra style for the TextInput
 *  ...rest                – forwarded to TextInput
 */
const FormInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  rightIcon,
  editable = true,
  style,
  inputStyle,
  ...rest
}) => {
  return (
    <View style={[styles.container, style]}>
      {/* Label */}
      {label ? <Text style={styles.label}>{label}</Text> : null}

      {/* Input */}
      <View
        style={[styles.inputWrapper, error ? styles.inputWrapperError : null]}
      >
        <TextInput
          style={[
            styles.input,
            rightIcon ? styles.inputWithIcon : null,
            inputStyle,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.placeholder}
          editable={editable}
          {...rest}
        />

        {/* Right Icon */}
        {rightIcon ? <View style={styles.iconWrapper}>{rightIcon}</View> : null}
      </View>

      {/* Error */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
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

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",

    backgroundColor: COLORS.inputBg,

    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,

    height: 50,

    paddingHorizontal: SPACING.lg,
  },

  inputWrapperError: {
    borderColor: COLORS.error,
  },

  input: {
    flex: 1,

    fontSize: TYPOGRAPHY.base,
    color: COLORS.textPrimary,

    padding: 0,
  },

  inputWithIcon: {
    paddingRight: SPACING.sm,
  },

  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",

    paddingLeft: SPACING.sm,
  },

  errorText: {
    marginTop: SPACING.xs,

    fontSize: TYPOGRAPHY.xs,
    color: COLORS.error,
  },
});

export default FormInput;
