import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  Text,
} from 'react-native';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
}

/**
 * Reusable button component with loading states and variants.
 * Uses NativeWind for styling with dark mode support.
 */
export function Button({
  title,
  variant = 'primary',
  loading = false,
  disabled = false,
  onPress,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;

  const baseClasses = 'px-6 py-3 rounded-lg items-center justify-center';
  const variantClasses = {
    primary: 'bg-blue-600 active:bg-blue-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    danger: 'bg-red-600 active:bg-red-700',
  };
  const disabledClasses = 'opacity-50';

  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${
    isDisabled ? disabledClasses : ''
  }`;

  return (
    <Pressable
      className={buttonClasses}
      onPress={onPress}
      disabled={isDisabled}
      style={loading ? { minWidth: 180 } : undefined}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <Text className="text-white font-semibold text-base">{title}</Text>
      )}
    </Pressable>
  );
}
