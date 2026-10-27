import { Content } from 'react-native-nobodywho';

export const getContentText = (content: Content): string => {
  if (typeof content === 'string') {
    return content;
  }
  if (Array.isArray(content)) {
    return content
      .map(part => (part.type === 'text' ? part.text : ''))
      .join('');
  }
  return content.json;
};
