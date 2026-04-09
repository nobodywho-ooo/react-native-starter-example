import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EmbeddingsScreen, MoreScreen, RagScreen } from '../screens';
import { useStyled } from 'hooks';

const Stack = createNativeStackNavigator();

export const MoreStackNavigator = () => {
  const { colors } = useStyled();

  return (
    <Stack.Navigator
      initialRouteName="MoreScreen"
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    >
      <Stack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          title: 'More',
          headerLargeTitleEnabled: true,
        }}
      />
      <Stack.Screen
        name="EmbeddingsScreen"
        component={EmbeddingsScreen}
        options={{ title: 'Embeddings' }}
      />
      <Stack.Screen
        name="RagScreen"
        component={RagScreen}
        options={{ title: 'RAG' }}
      />
    </Stack.Navigator>
  );
};
