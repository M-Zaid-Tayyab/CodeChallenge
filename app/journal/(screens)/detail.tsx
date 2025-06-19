import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';
import Header from '../../../components/Header';

const mockEntries = [
  { id: '1', text: 'Had a great day!', mood: { happiness: 8, fear: 1 } },
  { id: '2', text: 'Felt anxious about work.', mood: { happiness: 3, fear: 7 } },
];

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const entry = mockEntries.find(e => e.id === id);

  if (!entry) return <Text className="text-gray-400 text-center mt-10">Entry not found.</Text>;

  return (
    <View className="flex-1 bg-white">
      <Header title="Entry Details" className='px-5' />
      <View className="flex-1 px-6 pb-4">
        <View className="items-center mt-6 mb-4">
          <View className="bg-purple-100 rounded-full p-4 mb-2">
            <Ionicons name="book-outline" size={32} color="#a78bfa" />
          </View>
          <Text className="text-gray-500 text-base">Here&apos;s what you wrote:</Text>
        </View>
        <View className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-100 shadow-sm">
          <Text className="text-base text-gray-900 mb-2">{entry.text}</Text>
          <View className="mt-4">
            <Text className="text-gray-700 font-semibold mb-2">Mood Analysis</Text>
            <View className="flex-row space-x-6">
              <Text className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full">Happiness: {entry.mood.happiness}</Text>
              <Text className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full">Fear: {entry.mood.fear}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
} 