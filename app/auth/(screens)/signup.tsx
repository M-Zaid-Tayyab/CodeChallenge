import PrimaryButton from "@/components/PrimaryButton";
import PrimaryInput from "@/components/PrimaryInput";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";
import { yupResolver } from "@hookform/resolvers/yup";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import * as yup from "yup";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const schema = yup.object().shape({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup
      .string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords do not match")
      .required("Confirm password is required"),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: data.email,
          password: data.password,
        });
      if (signUpError) {
        Toast.show({
          type: "error",
          text1: signUpError.message,
        });
        return;
      }
      const user = signUpData?.user;
      if (!user) {
        return;
      }
      const { error: profileError, data: profileData } = await supabase
        .from("profiles")
        .insert({
          id: user?.id,
          name: data.fullName,
        });
      if (!signUpData?.session) {
        Toast.show({
          type: "success",
          text1: "Check your email to confirm sign-up!",
        });
        return;
      }
    } catch (error) {
      console.log({ error });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pt-safe"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-8 pb-8">
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

        <View className="space-y-5">
          <View>
            <Text className="text-gray-700 font-medium mb-2">Full Name</Text>
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onChange, value } }) => (
                <PrimaryInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Enter your full name"
                  autoCapitalize="words"
                  autoCorrect={false}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              )}
            />
            {errors.fullName && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.fullName.message}
              </Text>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Email</Text>
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
              <Text className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </Text>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">Password</Text>
            <View className="relative">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <PrimaryInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Create a password"
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
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </Text>
            )}
          </View>

          <View className="mt-4">
            <Text className="text-gray-700 font-medium mb-2">
              Confirm Password
            </Text>
            <View className="relative">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <PrimaryInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                    autoCapitalize="none"
                    autoCorrect={false}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 pr-12"
                    placeholderTextColor="#9CA3AF"
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-4"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6"
            title={isLoading ? "Signing up…" : "Sign Up"}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/auth/signin" asChild replace>
              <TouchableOpacity>
                <Text className="text-purple-600 font-semibold">Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
