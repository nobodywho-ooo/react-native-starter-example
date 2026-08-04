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
import { IconButton } from 'components';

import { styles, getBoxShadow, INPUT_BAR_HEIGHT } from './InputBar.styles';

const getInputWrapperProps = (isLiquidGlassEffectSupported: boolean) =>
  isLiquidGlassEffectSupported
    ? {
        effect: 'regular' as const,
        interactive: true,
      }
    : {};

interface InputBarProps {
  value: string;
  isStreaming: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InputBar: React.FC<InputBarProps> & { height: number } = ({
  value,
  isStreaming,
  onChangeText,
  onSend,
  onStop,
  style,
}) => {
  const { colors } = useStyled();
  const InputWrapper = isLiquidGlassSupported ? LiquidGlassView : View;

  const onPressSpeechToText = () => {};

  return (
    <View style={[styles.inputBarOuter, style]}>
      <InputWrapper
        style={[
          styles.inputBarInner,
          !isLiquidGlassSupported && getBoxShadow(colors.shadow),
          !isLiquidGlassSupported && {
            backgroundColor: colors.surfaceSecondary,
          },
        ]}
        {...getInputWrapperProps(isLiquidGlassSupported)}
      >
        <SpeechToTextButton onPress={onPressSpeechToText} />
        <TextInput
          style={[styles.textInput, { color: colors.onSurface }]}
          placeholder="Ask something..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <SendButton
          isStreaming={isStreaming}
          value={value}
          onSend={onSend}
          onStop={onStop}
        />
      </InputWrapper>
    </View>
  );
};

InputBar.height = INPUT_BAR_HEIGHT;

interface SendButtonProps {
  isStreaming: boolean;
  value: string;
  onSend: () => void;
  onStop: () => void;
}

const SendButton: React.FC<SendButtonProps> = ({
  isStreaming,
  value,
  onSend,
  onStop,
}) => {
  const { colors } = useStyled();

  if (isStreaming) {
    return (
      <IconButton
        icon={{ iosIconName: 'stop.circle', androidIconName: 'stop_circle' }}
        onPress={onStop}
        size={28}
        color={colors.danger}
        backgroundColor="transparent"
      />
    );
  }

  let color = colors.primary;
  let fontWeight: '500' | '600' = '500';

  if (value === '') {
    color = colors.onSurfaceVariant;
    fontWeight = '600';
  }

  return (
    <Pressable onPress={onSend} style={styles.sendButton}>
      <Text
        style={[
          styles.sendButtonText,
          {
            color: color,
            fontWeight: fontWeight,
          },
        ]}
      >
        Send
      </Text>
    </Pressable>
  );
};

interface SpeechToTextButtonProps {
  onPress: () => void;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({ onPress }) => {
  const { colors } = useStyled();

  return (
    <IconButton
      icon={{ iosIconName: 'microphone.fill', androidIconName: 'mic' }}
      onPress={onPress}
      size={20}
      color={colors.primary}
      backgroundColor="transparent"
    />
  );
};
