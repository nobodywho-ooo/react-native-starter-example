import React from 'react';
import { View } from 'react-native';
import { useStyled } from 'hooks';
import { Text } from 'components';

import styles from './ScoreAxis.styles';

const SUCCESS_COLOR = '#34C759';

interface ScoreAxisProps {
  levels: string[];
  score?: number;
}

export const ScoreAxis: React.FC<ScoreAxisProps> = ({ levels, score }) => {
  const { colors } = useStyled();
  const lastIndex = levels.length - 1;

  const textAlign = (index: number) =>
    index === 0 ? 'left' : index === lastIndex ? 'right' : 'center';

  return (
    <View>
      <View style={styles.axisContainer}>
        <View
          style={[styles.lineContainer, { backgroundColor: colors.border }]}
        />
        {levels.map((level, index) => (
          <View
            key={level}
            style={[
              styles.tickContainer,
              {
                left: `${(index / lastIndex) * 100}%`,
                backgroundColor: colors.border,
              },
            ]}
          />
        ))}
        {score !== undefined && (
          <View
            style={[
              styles.dotContainer,
              {
                left: `${(score / lastIndex) * 100}%`,
                backgroundColor: SUCCESS_COLOR,
              },
            ]}
          />
        )}
      </View>
      <View style={styles.labelsContainer}>
        {levels.map((level, index) => (
          <Text
            key={level}
            variant="caption"
            style={[styles.label, { textAlign: textAlign(index) }]}
          >
            {level.charAt(0).toUpperCase() + level.slice(1)}
          </Text>
        ))}
      </View>
    </View>
  );
};
