import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import { useStyled } from 'hooks';
import { TextVariant } from 'types';

import { variantStyles } from './Text.styles';

interface TextProps extends RNTextProps {
  variant?: TextVariant;
}

export const Text: React.FC<TextProps> = ({
  variant = 'body1',
  style,
  ...props
}) => {
  const { colors } = useStyled();

  return (
    <RNText
      style={[{ color: colors.onSurface }, variantStyles[variant], style]}
      {...props}
    />
  );
};
