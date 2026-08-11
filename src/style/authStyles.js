import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#0B57D0',
  primaryHover: '#0842A0',
  secondary: '#2563EB',

  textDark: '#1E293B',
  textMuted: '#64748B',
  textPlaceholder: '#94A3B8',

  inputBorder: '#E2E8F0',
  inputBg: '#FFFFFF',

  background: '#FFFFFF',
  backgroundLight: '#F8FAFC',
  cardBg: '#FFFFFF',

  error: '#DC2626',
  errorBg: '#FEF2F2',

  success: '#16A34A',

  white: '#FFFFFF',
};

const authStyles = StyleSheet.create({
  // Main containers
  safeContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  keyboardView: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },

  // Header / Logo
  headerSection: {
    alignItems: 'center',
    marginBottom: 32,
  },

  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,

    elevation: 8,
  },

  logoTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },

  logoSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 4,
  },

  // Keep these names too in case another screen uses them
  brandTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.primary,
    letterSpacing: -0.5,
  },

  brandSubtitle: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.secondary,
    marginTop: 4,
  },

  // Welcome
  welcomeSection: {
    alignItems: 'center',
    marginBottom: 28,
  },

  welcomeTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 6,
  },

  welcomeSubtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  // Form
  formContainer: {
    width: '100%',
  },

  inputGroup: {
    marginBottom: 16,
  },

  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 52,

    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 12,

    backgroundColor: COLORS.inputBg,
    paddingHorizontal: 16,
  },

  inputWrapperError: {
    borderColor: COLORS.error,
  },

  input: {
    flex: 1,
    height: '100%',
    fontSize: 15,
    color: COLORS.textDark,
    marginLeft: 10,
  },

  iconButton: {
    padding: 6,
  },

  // Forgot password
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 24,
    marginTop: -4,
  },

  forgotPasswordText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  // Primary button
  primaryButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 14,

    justifyContent: 'center',
    alignItems: 'center',

    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,

    elevation: 4,
    marginBottom: 24,
  },

  primaryButtonDisabled: {
    backgroundColor: '#93C5FD',
    shadowOpacity: 0,
    elevation: 0,
  },

  primaryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.white,
  },

  // Footer
  footerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },

  footerText: {
    fontSize: 14,
    color: COLORS.textMuted,
  },

  footerLink: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.secondary,
    marginLeft: 4,
  },

  // Errors
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: COLORS.errorBg,
    borderRadius: 10,

    padding: 12,
    marginBottom: 20,

    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
  },

  errorBannerText: {
    color: COLORS.error,
    fontSize: 13,
    fontWeight: '500',
    marginLeft: 8,
    flex: 1,
  },

  fieldErrorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default authStyles;

