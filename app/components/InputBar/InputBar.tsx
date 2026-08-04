import React from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
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
  isRecording: boolean;
  isTranscribing: boolean;
  onChangeText: (text: string) => void;
  onSend: () => void;
  onStop: () => void;
  onToggleSpeechToText: () => void;
  style?: StyleProp<ViewStyle>;
}

export const InputBar: React.FC<InputBarProps> & { height: number } = ({
  value,
  isStreaming,
  isRecording,
  isTranscribing,
  onChangeText,
  onSend,
  onStop,
  onToggleSpeechToText,
  style,
}) => {
  const { colors } = useStyled();
  const InputWrapper = isLiquidGlassSupported ? LiquidGlassView : View;

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
        <TextInput
          style={[styles.textInput, { color: colors.onSurface }]}
          placeholder="Ask something..."
          placeholderTextColor="#999"
          value={value}
          onChangeText={onChangeText}
          multiline
        />
        <View style={styles.actionsContainer}>
          <SpeechToTextButton
            isRecording={isRecording}
            isTranscribing={isTranscribing}
            onPress={onToggleSpeechToText}
          />
          <SendButton
            isStreaming={isStreaming}
            value={value}
            onSend={onSend}
            onStop={onStop}
          />
        </View>
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
  isRecording: boolean;
  isTranscribing: boolean;
  onPress: () => void;
}

const SpeechToTextButton: React.FC<SpeechToTextButtonProps> = ({
  isRecording,
  isTranscribing,
  onPress,
}) => {
  const { colors } = useStyled();

  if (isTranscribing) {
    return <ActivityIndicator size="small" color={colors.primary} />;
  }

  return (
    <IconButton
      icon={
        isRecording
          ? { iosIconName: 'stop.fill', androidIconName: 'stop' }
          : { iosIconName: 'microphone.fill', androidIconName: 'mic' }
      }
      onPress={onPress}
      size={20}
      color={isRecording ? colors.danger : colors.primary}
      backgroundColor="transparent"
    />
  );
};
