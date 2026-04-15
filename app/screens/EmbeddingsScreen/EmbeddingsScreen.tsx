import React, { useCallback, useState } from 'react';
import { ActivityIndicator, ScrollView } from 'react-native';
import { cosineSimilarity } from 'react-native-nobodywho';
import { useStyled } from 'hooks';
import { Text, Button } from 'components';
import { useAiService } from 'services';
import { devLog } from 'helpers';

import styles from './EmbeddingsScreen.styles';

const documents = [
  'Python supports multiple programming paradigms including object-oriented and functional',
  'JavaScript is primarily used for web development and runs in browsers',
  'SQL is a domain-specific language for managing relational databases',
  'Git is a version control system for tracking changes in source code',
];

const query = 'What language should I use for database queries?';

export const EmbeddingsScreen: React.FC = () => {
  const { encoder } = useAiService();
  const { colors } = useStyled();
  const [isProcessing, setIsProcessing] = useState(false);
  const [bestMatch, setBestMatch] = useState('');

  const runEmbeddings = useCallback(async () => {
    const activeEncoder = encoder.current;
    devLog('addd', activeEncoder);
    if (!activeEncoder) return;

    setBestMatch('');
    setIsProcessing(true);
    try {
      // Pre-compute document embeddings
      const docEmbeddings: number[][] = [];
      for (const doc of documents) {
        docEmbeddings.push(await activeEncoder.encode(doc));
      }

      // Search query
      const queryEmbedding = await activeEncoder.encode(query);

      // Find the most relevant document
      let maxSimilarity = -1;
      let bestIdx = 0;
      for (let i = 0; i < docEmbeddings.length; i++) {
        const similarity = cosineSimilarity(queryEmbedding, docEmbeddings[i]);
        if (similarity > maxSimilarity) {
          maxSimilarity = similarity;
          bestIdx = i;
        }
      }
      setBestMatch(documents[bestIdx]);
    } catch (error) {
      devLog('EmbeddingsScreen error', error);
    } finally {
      setIsProcessing(false);
    }
  }, [encoder]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={[styles.container, { backgroundColor: colors.surface }]}
    >
      <Text variant="h3">Example</Text>

      {documents.map((doc, i) => (
        <Text key={i} style={styles.document}>
          {doc}
        </Text>
      ))}

      <Button
        style={styles.button}
        title={isProcessing ? 'Running...' : 'Run Embeddings'}
        variant="primary"
        onPress={runEmbeddings}
        disabled={isProcessing}
      />

      {isProcessing && bestMatch === '' ? (
        <ActivityIndicator size="large" style={styles.spinner} />
      ) : bestMatch !== '' ? (
        <>
          <Text style={styles.queryLabel}>Query: {query}</Text>
          <Text style={styles.bestMatch}>Best match: {bestMatch}</Text>
        </>
      ) : null}
    </ScrollView>
  );
};
