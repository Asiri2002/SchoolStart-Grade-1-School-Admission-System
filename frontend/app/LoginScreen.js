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
import { loginUser } from '../src/services/authService';

export default function LoginScreen() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!usernameOrEmail.trim()) {
      errors.usernameOrEmail = 'Username or Email is required';
    }

    if (!password) {
      errors.password = 'Password is required';
    }

    setFieldErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    setErrorMessage('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await loginUser(
        usernameOrEmail.trim(),
        password
      );

      router.replace('/ParentDashboardScreen');
    } catch (error) {
      setErrorMessage(
        error?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    Alert.alert(
      'Forgot Password',
      'Please contact your school administration or system administrator to reset your password.'
    );
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
            Welcome Back!
          </Text>

          <Text style={authStyles.welcomeSubtitle}>
            Please login to continue
          </Text>
        </View>

        {/* Server Error */}
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

        {/* Form */}
        <View style={authStyles.formContainer}>
          {/* Username / Email */}
          <View style={authStyles.inputGroup}>
            <Text style={authStyles.inputLabel}>
              Username or Email
            </Text>

            <View
              style={[
                authStyles.inputWrapper,
                fieldErrors.usernameOrEmail &&
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
                placeholder="Enter username or email"
                placeholderTextColor={COLORS.textPlaceholder}
                value={usernameOrEmail}
                onChangeText={(text) => {
                  setUsernameOrEmail(text);

                  if (fieldErrors.usernameOrEmail) {
                    setFieldErrors((prev) => ({
                      ...prev,
                      usernameOrEmail: null,
                    }));
                  }
                }}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>

            {fieldErrors.usernameOrEmail && (
              <Text style={authStyles.fieldErrorText}>
                {fieldErrors.usernameOrEmail}
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
                placeholder="Enter your password"
                placeholderTextColor={COLORS.textPlaceholder}
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

          {/* Forgot Password */}
          <View style={authStyles.forgotPasswordContainer}>
            <TouchableOpacity
              onPress={handleForgotPassword}
            >
              <Text style={authStyles.forgotPasswordText}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            style={[
              authStyles.primaryButton,
              isLoading &&
                authStyles.primaryButtonDisabled,
            ]}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
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
                  Logging in...
                </Text>
              </View>
            ) : (
              <Text
                style={authStyles.primaryButtonText}
              >
                Login
              </Text>
            )}
          </TouchableOpacity>

          {/* Register */}
          <View style={authStyles.footerContainer}>
            <Text style={authStyles.footerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() => router.push('/RegisterScreen')}
              disabled={isLoading}
            >
              <Text style={authStyles.footerLink}>
                Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}