import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {
  LiquidGlassView,
  isLiquidGlassSupported,
} from '@callstack/liquid-glass';
import { useStyled } from 'hooks';

import { styles, INPUT_BAR_HEIGHT } from './InputBar.styles';

const getInputWrapperProps = (isLiquidGlassSupported: Boolean) =>
  isLiquidGlassSupported
    ? {
        effect: 'regular' as const,
        interactive: true,
      }
    : {};

interface InputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InputBar: React.FC<InputBarProps> & { height: number } = ({
  value,
  onChangeText,
  onSend,
  style,
}) => {
  const { colors } = useStyled();
  const InputWrapper = isLiquidGlassSupported ? LiquidGlassView : View;

  return (
    <View style={[styles.inputBarOuter, style]}>
      <InputWrapper
        style={[
          styles.inputBarInner,
          !isLiquidGlassSupported && {
            boxShadow: [
              {
                offsetX: 0,
                offsetY: 0,
                blurRadius: '15px',
                spreadDistance: '4px',
                color: colors.shadow,
                inset: false,
              },
            ],
          },
          !isLiquidGlassSupported && {
            backgroundColor: colors.surfaceSecondary,
          },
        ]}
        {...getInputWrapperProps(isLiquidGlassSupported)}
      >
        <TextInput
          style={[styles.textInput, { color: colors.onSurface }]}
          placeholder="Type a message..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <Pressable onPress={onSend} style={styles.sendButton}>
          <Text
            style={[
              styles.sendButtonText,
              {
                color: value === '' ? colors.onSurfaceVariant : colors.primary,
              },
            ]}
          >
            Send
          </Text>
        </Pressable>
      </InputWrapper>
    </View>
  );
};

InputBar.height = INPUT_BAR_HEIGHT;
