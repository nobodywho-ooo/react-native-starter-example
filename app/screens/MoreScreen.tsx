import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useStyled } from 'hooks';

export const MoreScreen: React.FC = () => {
  const { colors } = useStyled();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={{ color: colors.onSurface }}>More</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
