import React from 'react';
import { Platform, View, type ViewStyle } from 'react-native';
import { theme } from '@healthscan/ui';
import { WEB_SHELL_MAX_WIDTH } from '@/lib/webLayout';

/**
 * Web-only: full-viewport backdrop + centered max-width “app panel” (dashboard style).
 * Native: fragment — no layout change.
 */
export function WebViewportShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS !== 'web') {
    return <>{children}</>;
  }

  return (
    <View style={outerStyle}>
      <View style={[innerStyle, innerWebLift]}>{children}</View>
    </View>
  );
}

const outerStyle: ViewStyle = {
  flex: 1,
  alignItems: 'center',
  backgroundColor: '#E2E8F0',
  minHeight: '100%',
};

const innerStyle: ViewStyle = {
  flex: 1,
  width: '100%',
  maxWidth: WEB_SHELL_MAX_WIDTH,
  backgroundColor: theme.colors.bg,
};

const innerWebLift = {
  boxShadow:
    '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 0 0 1px rgba(15, 23, 42, 0.06)',
} as ViewStyle;
