import React, { ReactNode } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';

interface KeyboardSafeViewProps {
  children: ReactNode;
  className?: string;
  offset?: number;
}

/**
 * Shared KeyboardSafeView wrapper component.
 * Abstracts platform-specific KeyboardAvoidingView behavior.
 * Automatically applies correct behavior for iOS (padding) and Android (height).
 */
export function KeyboardSafeView({
  children,
  className = 'flex-1',
  offset = 100,
}: KeyboardSafeViewProps) {
  return (
    <KeyboardAvoidingView
      className={className}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={offset}
    >
      {children}
    </KeyboardAvoidingView>
  );
}
