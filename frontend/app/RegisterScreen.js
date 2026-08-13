import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

import authStyles, { COLORS } from '../src/style/authStyles';
import { registerUser } from '../src/services/authService';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateEmail = (emailStr) => {
    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailRegex.test(emailStr);
  };

  const validateForm = () => {
    const errors = {};

    if (!username.trim()) {
      errors.username = 'Username is required';
    } else if (
      username.trim().length < 3 ||
      username.trim().length > 20
    ) {
      errors.username =
        'Username must be between 3 and 20 characters';
    }

    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!validateEmail(email.trim())) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password =
        'Password must be at least 6 characters';
    }

    if (!confirmPassword) {
      errors.confirmPassword =
        'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword =
        'Passwords do not match';
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const message = await registerUser({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      Alert.alert(
        'Registration Successful',
        typeof message === 'string'
          ? message
          : 'Parent account created successfully! Please login.',
        [
          {
            text: 'OK',
            onPress: () =>
              router.replace('/LoginScreen'),
          },
        ]
      );
    } catch (error) {
      setErrorMessage(
        error?.message ||
          'Registration failed. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        contentContainerStyle={authStyles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo */}
        <View style={authStyles.headerSection}>
          <View style={authStyles.logoContainer}>
            <Ionicons
              name="school-outline"
              size={42}
              color={COLORS.white}
            />
          </View>

          <Text style={authStyles.brandTitle}>
            SchoolStart
          </Text>

          <Text style={authStyles.brandSubtitle}>
            Grade 1 Admission
          </Text>
        </View>

        {/* Welcome */}
        <View style={authStyles.welcomeSection}>
          <Text style={authStyles.welcomeTitle}>
            Create Account
          </Text>

          <Text style={authStyles.welcomeSubtitle}>
            Register as a parent to apply
          </Text>
        </View>

        {/* Error */}
        {errorMessage ? (
          <View style={authStyles.errorBanner}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons
                name="alert-circle-outline"
                size={20}
                color={COLORS.error}
              />

              <Text
                style={[
                  authStyles.errorBannerText,
                  {
                    marginLeft: 8,
                    flex: 1,
                  },
                ]}
              >
                {errorMessage}
              </Text>
            </View>
          </View>
        ) : null}

        <View style={authStyles.formContainer}>
          {/* Username */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>
              Username
            </Text>

            <View
              style={[
                authStyles.inputWrapper,
                fieldErrors.username &&
                  authStyles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={COLORS.textMuted}
              />

              <TextInput
                style={[
                  authStyles.input,
                  { marginLeft: 10 },
                ]}
                placeholder="Username (3-20 characters)"
                placeholderTextColor={
                  COLORS.textPlaceholder
                }
                value={username}
                onChangeText={(text) => {
                  setUsername(text);

                  if (fieldErrors.username) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      username: null,
                    }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />
            </View>

            {fieldErrors.username && (
              <Text style={authStyles.fieldErrorText}>
                {fieldErrors.username}
              </Text>
            )}
          </View>

          {/* Email */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>
              Email
            </Text>

            <View
              style={[
                authStyles.inputWrapper,
                fieldErrors.email &&
                  authStyles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={COLORS.textMuted}
              />

              <TextInput
                style={[
                  authStyles.input,
                  { marginLeft: 10 },
                ]}
                placeholder="Email address"
                placeholderTextColor={
                  COLORS.textPlaceholder
                }
                value={email}
                onChangeText={(text) => {
                  setEmail(text);

                  if (fieldErrors.email) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      email: null,
                    }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            {fieldErrors.email && (
              <Text style={authStyles.fieldErrorText}>
                {fieldErrors.email}
              </Text>
            )}
          </View>

          {/* Password */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>
              Password
            </Text>

            <View
              style={[
                authStyles.inputWrapper,
                fieldErrors.password &&
                  authStyles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
              />

              <TextInput
                style={[
                  authStyles.input,
                  { marginLeft: 10 },
                ]}
                placeholder="Password (min 6 characters)"
                placeholderTextColor={
                  COLORS.textPlaceholder
                }
                value={password}
                onChangeText={(text) => {
                  setPassword(text);

                  if (fieldErrors.password) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      password: null,
                    }));
                  }
                }}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={authStyles.iconButton}
                onPress={() =>
                  setShowPassword((prev) => !prev)
                }
              >
                <Ionicons
                  name={
                    showPassword
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {fieldErrors.password && (
              <Text style={authStyles.fieldErrorText}>
                {fieldErrors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>
              Confirm Password
            </Text>

            <View
              style={[
                authStyles.inputWrapper,
                fieldErrors.confirmPassword &&
                  authStyles.inputWrapperError,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={COLORS.textMuted}
              />

              <TextInput
                style={[
                  authStyles.input,
                  { marginLeft: 10 },
                ]}
                placeholder="Confirm password"
                placeholderTextColor={
                  COLORS.textPlaceholder
                }
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);

                  if (fieldErrors.confirmPassword) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      confirmPassword: null,
                    }));
                  }
                }}
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
              />

              <TouchableOpacity
                style={authStyles.iconButton}
                onPress={() =>
                  setShowConfirmPassword(
                    (prev) => !prev
                  )
                }
              >
                <Ionicons
                  name={
                    showConfirmPassword
                      ? 'eye-outline'
                      : 'eye-off-outline'
                  }
                  size={22}
                  color={COLORS.textMuted}
                />
              </TouchableOpacity>
            </View>

            {fieldErrors.confirmPassword && (
              <Text style={authStyles.fieldErrorText}>
                {fieldErrors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Register */}
          <TouchableOpacity
            style={[
              authStyles.primaryButton,
              isLoading &&
                authStyles.primaryButtonDisabled,
              { marginTop: 12 },
            ]}
            onPress={handleRegister}
            disabled={isLoading}
          >
            {isLoading ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator
                  size="small"
                  color={COLORS.white}
                  style={{ marginRight: 8 }}
                />

                <Text
                  style={authStyles.primaryButtonText}
                >
                  Creating Account...
                </Text>
              </View>
            ) : (
              <Text
                style={authStyles.primaryButtonText}
              >
                Register
              </Text>
            )}
          </TouchableOpacity>

          {/* Login */}
          <View style={authStyles.footerContainer}>
            <Text style={authStyles.footerText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                router.replace('/LoginScreen')
              }
              disabled={isLoading}
            >
              <Text style={authStyles.footerLink}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}