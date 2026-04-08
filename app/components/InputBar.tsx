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

export const InputBar: React.FC<InputBarProps> = ({
  value,
  onChangeText,
  onSend,
  style,
}) => {
  const { colors } = useStyled();
  const InputWrapper = isLiquidGlassSupported ? LiquidGlassView : View;

  return (
    <View
      style={[
        styles.inputBarOuter,
        !isLiquidGlassSupported && { backgroundColor: colors.surface },
        style,
      ]}
    >
      <InputWrapper
        style={[
          styles.inputBarInner,
          !isLiquidGlassSupported && styles.inputBarFallback,
        ]}
        {...getInputWrapperProps(isLiquidGlassSupported)}
      >
        <TextInput
          style={styles.textInput}
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
    minHeight: 48,
  },
  inputBarFallback: {
    backgroundColor: 'rgba(240, 240, 240, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 4,
    color: '#000',
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
