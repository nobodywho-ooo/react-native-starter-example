export enum AiRole {
  user = 'user',
  assistant = 'assistant',
  system = 'system',
  tool = 'tool',
}

export interface AiMessage {
  content: string;
  role: AiRole;
}
