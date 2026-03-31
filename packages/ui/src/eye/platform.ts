import { Platform, type ViewStyle, type TextStyle } from 'react-native';

/** Web parity: button / pressable shows pointer without changing layout */
export const eyePressableWeb: ViewStyle =
  Platform.OS === 'web' ? ({ cursor: 'pointer' } as ViewStyle) : {};

/** Prevent optotype / chart text from being selected on desktop web */
export const eyeTextNoSelectWeb: TextStyle =
  Platform.OS === 'web'
    ? ({
        userSelect: 'none',
        WebkitUserSelect: 'none',
      } as TextStyle)
    : {};

/** Text inputs: remove default browser focus ring; RN ignores on native */
export const eyeInputWeb: ViewStyle =
  Platform.OS === 'web' ? ({ outlineStyle: 'none' } as unknown as ViewStyle) : {};
