import { Ionicons } from '@expo/vector-icons';
import clsx from 'clsx';
import { router } from 'expo-router';
import React from 'react';
import { Text, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

export interface HeaderProps {
  title: string;
  onBack?: () => void;
  className?: string;
  style?: ViewStyle;
  titleClassName?: string;
  titleStyle?: TextStyle;
}

const Header: React.FC<HeaderProps> = ({
  title,
  onBack,
  className = '',
  style,
  titleClassName = '',
  titleStyle,
  ...props
}) => {
  return (
    <View
      className={clsx('flex-row items-center bg-white border-b border-gray-100 pt-safe', className)}
      style={style}
      {...props}
    >
      <TouchableOpacity
        onPress={onBack ? onBack : () => router.back()}
      >
        <Ionicons name="chevron-back" size={26} color="black" />
      </TouchableOpacity>
      <View className="flex-1 items-center">
        <Text className={clsx('text-2xl font-bold text-gray-900', titleClassName)} style={titleStyle} numberOfLines={1}>
          {title}
        </Text>
      </View>
    </View>
  );
};

export default Header;
