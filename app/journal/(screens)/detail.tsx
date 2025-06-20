import { useCurrentUser, useJournalEntries } from "@/app/journal/_hooks";
import { JournalEntry } from "@/app/journal/_types";
import { storage } from "@/storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import Header from "../../../components/Header";

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user, isLoading: userLoading } = useCurrentUser();
  const currentUser = JSON.parse(storage.getString("user") || "{}");
  const { getEntry, deleteEntry, isLoading } = useJournalEntries(
    currentUser?.user?.id || ""
  );
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoadingEntry, setIsLoadingEntry] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      if (id && typeof id === "string") {
        const result = await getEntry(id);
        if (result.success && result.data) {
          setEntry(result.data);
          console.log(result.data);
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to load journal entry",
          });
        }
      }
      setIsLoadingEntry(false);
    };

    fetchEntry();
  }, [id, getEntry]);

  const handleDelete = async () => {
    if (!entry) return;

    const result = await deleteEntry(entry.id);
    if (result.success) {
      router.back();
    }
  };

  if (userLoading || isLoadingEntry) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-400 text-center mt-4">Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400 text-center">
          Please sign in to view journal entries.
        </Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400 text-center mt-10">
          Entry not found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title="Entry Details" className="px-5" />
      <View className="flex-1 px-6 pb-4">
        <View className="items-center mt-6 mb-4">
          <View className="bg-purple-100 rounded-full p-4 mb-2">
            <Ionicons name="book-outline" size={32} color="#a78bfa" />
          </View>
          <Text className="text-gray-500 text-base">
            Here&apos;s what you wrote:
          </Text>
        </View>

        <View className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100 shadow-sm">
          <View className="flex-row justify-between">
            <Text className="text-lg font-medium text-gray-900 mb-4 leading-6 flex-1">
              {entry.text}
            </Text>
            <TouchableOpacity onPress={handleDelete}>
              <Ionicons name="trash-outline" size={20} color="red" />
            </TouchableOpacity>
          </View>
          <View className="border-t border-gray-200 pt-4">
            <Text className="text-gray-700 font-semibold mb-3">
              Mood Analysis
            </Text>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {Object.entries(entry.mood).map(([emotion, score]) => {
                if (score > 0) {
                  const colors = {
                    happiness: "bg-green-200 text-green-800",
                    sadness: "bg-blue-200 text-blue-800",
                    anger: "bg-red-200 text-red-800",
                    fear: "bg-purple-200 text-purple-800",
                    surprise: "bg-yellow-200 text-yellow-800",
                    disgust: "bg-gray-200 text-gray-800",
                  };

                  return (
                    <Text
                      key={emotion}
                      className={`${
                        colors[emotion as keyof typeof colors] ||
                        "bg-gray-200 text-gray-800"
                      } px-3 py-1 rounded-full text-sm font-medium`}
                    >
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                      {Math.round(score * 100)}%
                    </Text>
                  );
                }
                return null;
              })}
            </View>

            {entry.mood_confidence && (
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-medium">
                  Confidence: {Math.round(entry.mood_confidence * 100)}%
                </Text>
              </View>
            )}

            {entry.mood_summary && (
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-medium mb-1">
                  Analysis Summary:
                </Text>
                <Text className="text-gray-600 text-sm leading-5">
                  {entry.mood_summary}
                </Text>
              </View>
            )}

            {entry.mood_keywords && entry.mood_keywords.length > 0 && (
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-medium mb-1">
                  Keywords:
                </Text>
                <Text className="text-gray-600 text-sm">
                  {entry.mood_keywords.join(", ")}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
