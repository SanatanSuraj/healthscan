import { Platform, StyleSheet } from 'react-native';

/** Outer dashboard shell width (browser canvas). */
export const WEB_SHELL_MAX_WIDTH = 960;

/** Main reading / form column inside the shell. */
export const WEB_PAGE_COLUMN_MAX_WIDTH = 680;

/**
 * Extra contentContainerStyle for ScrollView on web — centered column, no full-bleed stretch.
 * Merge with existing padding; use `paddingTop` / horizontal from here on web.
 */
export const webScrollContent = StyleSheet.create({
  centeredColumn: Platform.select({
    web: {
      width: '100%',
      maxWidth: WEB_PAGE_COLUMN_MAX_WIDTH,
      alignSelf: 'center',
      paddingHorizontal: 40,
      paddingTop: 16,
      paddingBottom: 56,
    },
    default: {},
  }),
});
