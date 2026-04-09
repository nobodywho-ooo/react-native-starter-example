import React from 'react';
import {
  View,
  StyleSheet,
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

const INPUT_BAR_HEIGHT = 48;

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
          <Text style={[styles.sendButtonText, { color: colors.primary }]}>
            Send
          </Text>
        </Pressable>
      </InputWrapper>
    </View>
  );
};

InputBar.height = INPUT_BAR_HEIGHT;

const styles = StyleSheet.create({
  inputBarOuter: {
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 12,
  },
  inputBarInner: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: INPUT_BAR_HEIGHT,
  },
  inputBarFallback: {
    boxShadow: [
      {
        offsetX: 0,
        offsetY: 0,
        blurRadius: '15px',
        spreadDistance: '4px',
        inset: false,
      },
    ],
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
  },
  sendButton: {
    marginLeft: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    justifyContent: 'center',
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
