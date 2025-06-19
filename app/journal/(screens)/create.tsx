import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import Header from '../../../components/Header';
import PrimaryButton from '../../../components/PrimaryButton';
import PrimaryInput from '../../../components/PrimaryInput';

function fakeAnalyzeMood(text: string) {
  // Simulate LLM mood analysis
  if (text.includes('happy')) return { happiness: 9, fear: 1 };
  if (text.includes('anxious')) return { happiness: 2, fear: 8 };
  return { happiness: 5, fear: 5 };
}

export default function CreateJournalEntryScreen() {
  const [entry, setEntry] = useState('');
  const [mood, setMood] = useState<{ happiness: number; fear: number } | null>(null);

  const handleAnalyze = () => {
    setMood(fakeAnalyzeMood(entry));
  };

  return (
    <View className="flex-1 bg-white">
      <Header title="New Entry" className='px-5' />
      <View className="flex-1 pb-4">
        <View className="items-center mt-6">
          <View className="bg-purple-100 rounded-full p-4 mb-2">
            <Ionicons name="book-outline" size={32} color="#a78bfa" />
          </View>
          <Text className="text-gray-500 text-base">What's on your mind today?</Text>
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
        <PrimaryButton title="Analyze Mood" onPress={handleAnalyze} className="mt-8 mx-6" />
        {mood && (
          <View className="bg-purple-50 rounded-xl p-4 mt-4 border border-purple-100 items-center">
            <Text className="text-purple-700 font-semibold mb-2">Mood Analysis</Text>
            <View className="flex-row space-x-6">
              <Text className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full">Happiness: {mood.happiness}</Text>
              <Text className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full">Fear: {mood.fear}</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
} 