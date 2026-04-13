import {
  Asset,
  Chat,
  CrossEncoder,
  Encoder,
  Message,
  Model,
  PromptPart,
  Role,
  SamplerBuilder,
  SamplerPresets,
  Prompt,
  Tool,
  ToolCall,
} from 'react-native-nobodywho';

export type AiChatModel = Model;
export type AiEncoder = Encoder;
export type AiCrossEncoder = CrossEncoder;

export type AiChat = Chat;

export type AiTool = Tool;
export type AiToolCall = ToolCall;
export type AiAsset = Asset;

export type AiSamplerPresets = typeof SamplerPresets;
export type AiSamplerBuilder = SamplerBuilder;
export type AiPrompt = Prompt;

export type AiRole = Role;
export const AiRole = {
  user: Role.User,
  assistant: Role.Assistant,
  system: Role.System,
  tool: Role.Tool,
};

export type AiDefaultMessage = InstanceType<typeof Message.Message>;
export type AiToolCallsMessage = InstanceType<typeof Message.ToolCalls>;
export type AiToolRespMessage = InstanceType<typeof Message.ToolResp>;

export type AiMessage = Message;
export const AiMessage = {
  message: (args: {
    role: AiRole;
    content: string;
    assets?: AiAsset[];
  }): AiDefaultMessage =>
    new Message.Message({
      role: args.role,
      content: args.content,
      assets: args.assets ?? [],
    }),
  toolCalls: (args: {
    role: AiRole;
    content: string;
    toolCalls: AiToolCall[];
  }): AiToolCallsMessage => new Message.ToolCalls(args),
  toolResp: (args: {
    role: AiRole;
    name: string;
    content: string;
  }): AiToolRespMessage => new Message.ToolResp(args),
};

export type AiTextPart = InstanceType<typeof PromptPart.Text>;
export const AiTextPart = (args: { content: string }): AiTextPart =>
  new PromptPart.Text(args);

export type AiImagePart = InstanceType<typeof PromptPart.Image>;
export const AiImagePart = (args: { path: string }): AiImagePart =>
  new PromptPart.Image(args);
