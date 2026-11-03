import React from 'react';
import { View } from 'react-native';
import { useStyled } from 'hooks';
import { Text } from 'components';

import styles from './Pill.styles';

const SUCCESS_COLOR = '#34C759';

const pct = (p: number) => `${(p * 100).toFixed(1)}%`;

export interface PillProps {
  label: string;
  probability?: number;
  highlighted: boolean;
}

export const Pill: React.FC<PillProps> = ({
  label,
  probability,
  highlighted,
}) => {
  const { colors } = useStyled();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: highlighted
            ? SUCCESS_COLOR
            : colors.surfaceContainer,
        },
      ]}
    >
      <Text variant="body2" bold style={highlighted && styles.highlightedText}>
        {label.charAt(0).toUpperCase() + label.slice(1)}
      </Text>
      {probability !== undefined && (
        <Text variant="caption" style={highlighted && styles.highlightedText}>
          {pct(probability)}
        </Text>
      )}
    </View>
  );
};
