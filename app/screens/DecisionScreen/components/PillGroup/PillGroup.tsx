import React from 'react';
import { View } from 'react-native';
import { Pill } from '../Pill/Pill';

import styles from './PillGroup.styles';

interface PillGroupProps {
  options: { label: string; probability?: number }[];
}

export const PillGroup: React.FC<PillGroupProps> = ({ options }) => {
  const best = options.reduce<number | undefined>(
    (max, { probability }) =>
      probability !== undefined && (max === undefined || probability > max)
        ? probability
        : max,
    undefined,
  );

  return (
    <View style={styles.container}>
      {options.map(({ label, probability }) => (
        <Pill
          key={label}
          label={label}
          probability={probability}
          highlighted={best !== undefined && probability === best}
        />
      ))}
    </View>
  );
};
