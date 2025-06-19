import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SignUp() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);
    // Simple mock registration
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/(tabs)');
    }, 1500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-8 pt-16 pb-8">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="journal" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Create account
            </Text>
            <Text className="text-gray-500 text-center">
              Start your journaling journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5">
            {/* Full Name Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Full Name
              </Text>
              <TextInput
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                autoCapitalize="words"
                autoCorrect={false}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Email Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Password
              </Text>
              <View className="relative">
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Create a password"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 pr-12"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password Input */}
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Confirm Password
              </Text>
              <View className="relative">
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirm your password"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 pr-12"
                  placeholderTextColor="#9CA3AF"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-4"
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    size={20}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Sign Up Button */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={isLoading}
              className={`bg-purple-600 rounded-xl py-4 items-center mt-6 ${
                isLoading ? 'opacity-70' : ''
              }`}
            >
              {isLoading ? (
                <View className="flex-row items-center">
                  <View className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  <Text className="text-white font-semibold">
                    Creating account...
                  </Text>
                </View>
              ) : (
                <Text className="text-white font-semibold text-lg">
                  Create Account
                </Text>
              )}
            </TouchableOpacity>

            {/* Sign In Link */}
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Already have an account? </Text>
              <Link href="/auth/signin" asChild>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-semibold">
                    Sign in
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 