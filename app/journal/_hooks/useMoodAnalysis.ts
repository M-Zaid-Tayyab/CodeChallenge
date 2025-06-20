import { useState } from "react";
import Toast from "react-native-toast-message";
import { moodAnalysisService } from "../_services";
import { MoodAnalysisResult } from "../_types";
import { useCurrentUser } from "./useCurrentUser";

export const useMoodAnalysis = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useCurrentUser();

  const analyzeText = async (
    text: string
  ): Promise<MoodAnalysisResult | null> => {
    if (!text.trim()) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Please enter some text to analyze",
      });
      return null;
    }

    if (!user?.id) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "You must be logged in to analyze mood",
      });
      return null;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await moodAnalysisService.analyzeMood(text, user.id);

      if (!result.success || !result.data) {
        throw new Error(result.error || "Failed to analyze mood");
      }

      return result.data;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to analyze mood";
      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
      setError(errorMessage);
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmotionColor = (emotion: string): string => {
    const colors: Record<string, string> = {
      happiness: "#10B981", // green
      sadness: "#60A5FA", // blue
      anger: "#EF4444", // red
      fear: "#8B5CF6", // purple
      surprise: "#F59E0B", // yellow
      disgust: "#6B7280", // gray
    };
    return colors[emotion] || "#6B7280";
  };

  const getDominantEmotion = (
    mood: MoodAnalysisResult["mood"]
  ): { emotion: string; score: number } => {
    const emotions = Object.entries(mood);
    const dominant = emotions.reduce((a, b) => (a[1] > b[1] ? a : b));
    return {
      emotion: dominant[0],
      score: dominant[1],
    };
  };

  return {
    analyzeText,
    isAnalyzing,
    error,
    getEmotionColor,
    getDominantEmotion,
  };
};
