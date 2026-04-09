import React from 'react';
import { Pressable, PressableProps, Text } from 'react-native';
import { useStyled } from 'hooks';
import { ButtonVariant } from 'types';

import { styles, getVariantStyles } from './Button.styles';

interface ButtonProps extends Omit<PressableProps, 'children'> {
  title: string;
  variant?: ButtonVariant;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = 'primary',
  style,
  ...props
}) => {
  const { colors } = useStyled();
  const variantStyle = getVariantStyles(variant, colors);

  return (
    <Pressable
      style={[styles.button, variantStyle.button, style as any]}
      {...props}
    >
      <Text style={[styles.text, variantStyle.text]}>{title}</Text>
    </Pressable>
  );
};
