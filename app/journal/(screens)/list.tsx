import Header from '@/components/Header';
import { router } from 'expo-router';
import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import PrimaryButton from '../../../components/PrimaryButton';

const mockEntries = [
  { id: '1', text: 'Had a great day!', mood: { happiness: 8, fear: 1 } },
  { id: '2', text: 'Felt anxious about work.', mood: { happiness: 3, fear: 7 } },
];

const moods = ['all', 'happiness', 'fear'];

export default function JournalListScreen() {
  const [filter, setFilter] = useState<string | null>(null);

  const filteredEntries = useMemo(() => filter
    ? mockEntries.filter(entry => filter in entry.mood && (entry.mood as any)[filter] > 5)
    : mockEntries, [filter]);

  const renderItem = useCallback(({ item }) => (
    <TouchableOpacity
      onPress={() => router.push({ pathname: '/journal/detail', params: { id: item.id } })}
      className="bg-gray-50 rounded-xl p-5 shadow-sm border border-gray-100 mx-6 my-3"
      activeOpacity={0.8}
    >
      <Text className="text-base text-gray-900 mb-1">{item.text}</Text>
      <View className="flex-row space-x-4 mt-1">
        <Text className="text-xs text-purple-600">Happiness: {item.mood.happiness}</Text>
        <Text className="text-xs text-blue-500">Fear: {item.mood.fear}</Text>
      </View>
    </TouchableOpacity>
  ), []);

  const ListEmptyComponent = useCallback(() => (
    <View className="flex-1 items-center justify-center">
      <Text className="text-gray-400 text-center mt-10">No entries found.</Text>
    </View>
  ), []);

  return (
    <View className="flex-1 bg-white pb-4 pb-safe">
      <Header title="Journal Entries" className='px-5' />
      <View className="flex-row space-x-3 mt-6 px-6">
        {moods.map(mood => (
          <TouchableOpacity
            key={mood}
            onPress={() => setFilter(mood === 'all' ? null : mood)}
            className={`px-4 py-2 rounded-full border mr-4 ${filter === mood || (filter === null && mood === 'all') ? 'bg-purple-600 border-purple-600' : 'bg-gray-100 border-gray-200'}`}
          >
            <Text className={filter === mood || (filter === null && mood === 'all') ? 'text-white font-semibold' : 'text-gray-700'}>{mood.charAt(0).toUpperCase() + mood.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList
        data={filteredEntries}
        keyExtractor={item => item.id}
        className="flex-1 mt-4"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
      />
      <PrimaryButton title="New Entry" onPress={() => router.push('/journal/create')} className="mt-6 mx-6" />
    </View>
  );
} 