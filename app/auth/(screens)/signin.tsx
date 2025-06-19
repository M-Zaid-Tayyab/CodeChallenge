import PrimaryButton from '@/components/PrimaryButton';
import PrimaryInput from '@/components/PrimaryInput';
import { Ionicons } from '@expo/vector-icons';
import { yupResolver } from '@hookform/resolvers/yup';
import { Link } from 'expo-router';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  Alert,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as yup from 'yup';

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().email('Invalid email').required('Email is required'),
    password: yup.string().required('Password is required'),
  });

  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    // Simulate async sign in
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert('Success', 'Signed in!');
    }, 1000);
  };

  return (
    <KeyboardAwareScrollView
    className='flex-1 bg-white'
    contentContainerClassName='pt-safe'
    showsVerticalScrollIndicator={false}
    >
        <View className="flex-1 px-8 pb-8">
          <View className="items-center mb-16">
            <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center mb-6">
              <Ionicons name="journal" size={32} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back
            </Text>
            <Text className="text-gray-500 text-center">
              Sign in to your account
            </Text>
          </View>

          <View className="space-y-6">
            <View>
              <Text className="text-gray-700 font-medium mb-2">
                Email
              </Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, value } }) => (
                  <PrimaryInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              {errors.email && (
                <Text className="text-red-500 text-sm mt-1">{errors.email.message}</Text>
              )}
            </View>

            <View className='mt-4'>
              <Text className="text-gray-700 font-medium mb-2">
                Password
              </Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, value } }) => (
                    <PrimaryInput
                      value={value}
                      onChangeText={onChange}
                      placeholder="Enter your password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 pr-12"
                      placeholderTextColor="#9CA3AF"
                    />
                  )}
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
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
              )}
            </View>

            <TouchableOpacity className="items-end mt-3">
              <Text className="text-purple-600 font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
            <PrimaryButton
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              className="mt-6"
              title={isLoading ? 'Signing in…' : 'Sign In'}
            />
            <View className="flex-row justify-center mt-8">
              <Text className="text-gray-500">Don&apos;t have an account? </Text>
              <Link href="/auth/signup" asChild replace>
                <TouchableOpacity>
                  <Text className="text-purple-600 font-semibold">
                    Sign up
                  </Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
    </KeyboardAwareScrollView>
  );
} 