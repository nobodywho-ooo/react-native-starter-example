import { MarkdownStyle } from 'react-native-enriched-markdown';

export const getMarkdownStyle = (
  isDarkMode: boolean,
  color: string,
): MarkdownStyle => {
  if (!isDarkMode) return {};

  return {
    h1: { color },
    h2: { color },
    h3: { color },
    paragraph: { color },
    strong: { color },
    em: { color },
    strikethrough: { color },
    underline: { color },
    link: { color },
    code: { color },
    codeBlock: { color },
    blockquote: { color },
    list: { color },
    math: { color },
    inlineMath: { color },
  };
};
