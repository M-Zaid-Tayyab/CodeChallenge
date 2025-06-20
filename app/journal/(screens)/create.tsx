import { useJournalEntries, useMoodAnalysis } from "@/app/journal/_hooks";
import { MoodAnalysisResult } from "@/app/journal/_types";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import Header from "../../../components/Header";
import PrimaryButton from "../../../components/PrimaryButton";
import PrimaryInput from "../../../components/PrimaryInput";

export default function CreateJournalEntryScreen() {
  const { createEntry, isLoading: isCreating } = useJournalEntries();
  const {
    analyzeText,
    isAnalyzing,
    error,
    getEmotionColor,
    getDominantEmotion,
  } = useMoodAnalysis();
  const [entry, setEntry] = useState("");
  const [analysisResult, setAnalysisResult] =
    useState<MoodAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!entry.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter some text to analyze",
      });
      return;
    }

    const result = await analyzeText(entry);
    if (result) {
      setAnalysisResult(result);
    }
  };

  const clearAnalysis = () => {
    setAnalysisResult(null);
  };

  const handleSave = async () => {
    if (!entry.trim()) {
      Toast.show({
        type: "error",
        text1: "Please enter some text for your journal entry",
      });
      return;
    }

    const result = await createEntry({
      text: entry,
      mood: analysisResult?.mood,
      mood_confidence: analysisResult?.confidence,
      mood_keywords: analysisResult?.keywords,
      mood_summary: analysisResult?.summary,
    });

    if (result.success) {
      setEntry("");
      clearAnalysis();
      router.back();
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pb-safe"
      showsVerticalScrollIndicator={false}
    >
      <Header justTitle title="New Entry" className="px-5" />
      <View className="flex-1 pb-4">
        <View className="items-center mt-6">
          <View className="bg-purple-100 rounded-full p-4 mb-2">
            <Ionicons name="book-outline" size={32} color="#a78bfa" />
          </View>
          <Text className="text-gray-500 text-base">
            What&apos;s on your mind today?
          </Text>
        </View>

        <View className="bg-gray-50 border border-gray-200 rounded-xl shadow-sm mt-4 mx-6">
          <PrimaryInput
            value={entry}
            onChangeText={setEntry}
            placeholder="Write your thoughts..."
            multiline
            className="px-4 py-4 text-gray-900 min-h-[200px]"
            placeholderTextColor="#9CA3AF"
          />
        </View>

        <PrimaryButton
          title={isAnalyzing ? "Analyzing..." : "Analyze Mood"}
          onPress={handleAnalyze}
          disabled={isAnalyzing || !entry.trim()}
          className="mt-8 mx-6"
        />

        {error && (
          <View className="bg-red-50 rounded-xl p-4 mt-4 mx-6 border border-red-100">
            <Text className="text-red-700 text-sm">{error}</Text>
          </View>
        )}

        {analysisResult && (
          <View className="bg-purple-50 rounded-xl p-4 mt-4 mx-6 border border-purple-100">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-purple-700 font-semibold">
                Mood Analysis
              </Text>
              <Text
                onPress={clearAnalysis}
                className="text-black text-sm underline"
              >
                Clear
              </Text>
            </View>
            <View className="flex-row flex-wrap gap-2 mb-3">
              {Object.entries(analysisResult.mood).map(([emotion, score]) => {
                if (score > 0) {
                  const color = getEmotionColor(emotion);
                  const bgColor = color + "20"; // 20% opacity
                  const textColor = color;

                  return (
                    <Text
                      key={emotion}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                      }}
                      className="px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                      {Math.round(score * 100)}%
                    </Text>
                  );
                }
                return null;
              })}
            </View>

            {analysisResult.confidence && (
              <View className="mb-2">
                <Text className="text-purple-700 text-sm font-medium">
                  Confidence: {Math.round(analysisResult.confidence * 100)}%
                </Text>
              </View>
            )}

            {analysisResult.summary && (
              <Text className="text-purple-700 text-sm mb-2">
                {analysisResult.summary}
              </Text>
            )}

            {analysisResult.keywords.length > 0 && (
              <View className="mt-2">
                <Text className="text-purple-700 text-sm font-medium mb-1">
                  Keywords:
                </Text>
                <Text className="text-purple-600 text-sm">
                  {analysisResult.keywords.join(", ")}
                </Text>
              </View>
            )}
          </View>
        )}

        <PrimaryButton
          title={isCreating ? "Saving..." : "Save Entry"}
          onPress={handleSave}
          disabled={isCreating || !entry.trim()}
          className={`mt-6 mx-6 ${analysisResult ? "bg-green-600" : ""}`}
        />
      </View>
    </ScrollView>
  );
}
