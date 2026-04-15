import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Chat,
  Encoder,
  CrossEncoder,
  loadModel,
  SamplerConfigInterface,
  Tool,
} from 'react-native-nobodywho';
import { devLog, getAssetPath } from 'helpers';

export enum AiModelState {
  NotLoaded = 'notLoaded',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

enum ModelName {
  Chat = 'chat-model.gguf',
  Projection = 'projection-model.gguf',
  Embedding = 'embedding-model.gguf',
  Reranker = 'reranker-model.gguf',
}

interface AiServiceState {
  chatState: AiModelState;
  chatWithToolCallingState: AiModelState;
  visionChatState: AiModelState;
  encoderState: AiModelState;
  crossEncoderState: AiModelState;
}

interface AiServiceContextValue extends AiServiceState {
  chat: React.RefObject<Chat | undefined>;
  chatWithToolCalling: React.RefObject<Chat | undefined>;
  visionChat: React.RefObject<Chat | undefined>;
  encoder: React.RefObject<Encoder | undefined>;
  crossEncoder: React.RefObject<CrossEncoder | undefined>;

  createChat: (opts?: {
    useGpu?: boolean;
    systemPrompt?: string;
    sampler?: SamplerConfigInterface;
    contextSize?: number;
  }) => Promise<void>;
  createToolCallingChat: (opts?: {
    useGpu?: boolean;
    tools?: Tool[];
    systemPrompt?: string;
    sampler?: SamplerConfigInterface;
    contextSize?: number;
  }) => Promise<void>;
  createVisionChat: (opts?: {
    useGpu?: boolean;
    systemPrompt?: string;
    contextSize?: number;
  }) => Promise<void>;
  createEncoder: (opts?: {
    useGpu?: boolean;
    contextSize?: number;
  }) => Promise<void>;
  createCrossEncoder: (opts?: {
    useGpu?: boolean;
    contextSize?: number;
  }) => Promise<void>;
  dispose: () => void;
}

const AiServiceContext = createContext<AiServiceContextValue | undefined>(
  undefined,
);

const _initialState: AiServiceState = {
  chatState: AiModelState.NotLoaded,
  chatWithToolCallingState: AiModelState.NotLoaded,
  visionChatState: AiModelState.NotLoaded,
  encoderState: AiModelState.NotLoaded,
  crossEncoderState: AiModelState.NotLoaded,
};

export const AiServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AiServiceState>(_initialState);

  // Guard to prevent duplicate loading of the same model. For e.g if createChat is called twice quickly
  const inFlight = useRef({
    chat: false,
    chatWithToolCalling: false,
    visionChat: false,
    encoder: false,
    crossEncoder: false,
  });

  const chatRef = useRef<Chat | undefined>(undefined);
  const chatWithToolCallingRef = useRef<Chat | undefined>(undefined);
  const visionChatRef = useRef<Chat | undefined>(undefined);
  const encoderRef = useRef<Encoder | undefined>(undefined);
  const crossEncoderRef = useRef<CrossEncoder | undefined>(undefined);

  const createChat = useCallback(
    async (opts?: {
      useGpu?: boolean;
      systemPrompt?: string;
      sampler?: SamplerConfigInterface;
      contextSize?: number;
    }) => {
      if (inFlight.current.chat || chatRef.current) return;
      inFlight.current.chat = true;
      setState(s => ({ ...s, chatState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.Chat);
        const chat = await Chat.fromPath({
          modelPath,
          useGpu: opts?.useGpu ?? true,
          systemPrompt: opts?.systemPrompt,
          sampler: opts?.sampler,
          contextSize: opts?.contextSize,
        });
        chatRef.current = chat;
        setState(s => ({ ...s, chatState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService error', error);
        setState(s => ({ ...s, chatState: AiModelState.Error }));
      } finally {
        inFlight.current.chat = false;
      }
    },
    [],
  );

  const createToolCallingChat = useCallback(
    async (opts?: {
      useGpu?: boolean;
      tools?: Tool[];
      systemPrompt?: string;
      sampler?: SamplerConfigInterface;
      contextSize?: number;
    }) => {
      if (inFlight.current.chatWithToolCalling || chatWithToolCallingRef.current)
        return;
      inFlight.current.chatWithToolCalling = true;
      setState(s => ({
        ...s,
        chatWithToolCallingState: AiModelState.Loading,
      }));
      try {
        const modelPath = await getAssetPath(ModelName.Chat);
        const chat = await Chat.fromPath({
          modelPath: modelPath,
          useGpu: opts?.useGpu ?? true,
          tools: opts?.tools ?? [],
          systemPrompt: opts?.systemPrompt,
          sampler: opts?.sampler,
          contextSize: opts?.contextSize,
        });
        chatWithToolCallingRef.current = chat;
        setState(s => ({
          ...s,
          chatWithToolCallingState: AiModelState.Ready,
        }));
      } catch (error) {
        devLog('AiService error', error);
        setState(s => ({
          ...s,
          chatWithToolCallingState: AiModelState.Error,
        }));
      } finally {
        inFlight.current.chatWithToolCalling = false;
      }
    },
    [],
  );

  const createVisionChat = useCallback(
    async (opts?: {
      useGpu?: boolean;
      systemPrompt?: string;
      contextSize?: number;
    }) => {
      if (inFlight.current.visionChat || visionChatRef.current) return;
      inFlight.current.visionChat = true;
      setState(s => ({ ...s, visionChatState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.Chat);
        const imageModelPath = await getAssetPath(ModelName.Projection);
        const chat = await Chat.fromPath({
          modelPath,
          imageModelPath,
          useGpu: opts?.useGpu ?? true,
          systemPrompt: opts?.systemPrompt,
          contextSize: opts?.contextSize,
        });
        visionChatRef.current = chat;
        setState(s => ({ ...s, visionChatState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService error', error);
        setState(s => ({ ...s, visionChatState: AiModelState.Error }));
      } finally {
        inFlight.current.visionChat = false;
      }
    },
    [],
  );

  // Embeddings
  const createEncoder = useCallback(
    async (opts?: { useGpu?: boolean; contextSize?: number }) => {
      if (inFlight.current.encoder || encoderRef.current) return;
      inFlight.current.encoder = true;
      setState(s => ({ ...s, encoderState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.Embedding);
        const model = await loadModel(
          modelPath,
          opts?.useGpu ?? true,
          undefined,
        );
        const encoder = new Encoder(model, opts?.contextSize);
        encoderRef.current = encoder;
        setState(s => ({ ...s, encoderState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService error', error);
        setState(s => ({ ...s, encoderState: AiModelState.Error }));
      } finally {
        inFlight.current.encoder = false;
      }
    },
    [],
  );

  // ReRanker
  const createCrossEncoder = useCallback(
    async (opts?: { useGpu?: boolean; contextSize?: number }) => {
      if (inFlight.current.crossEncoder || crossEncoderRef.current) return;
      inFlight.current.crossEncoder = true;
      setState(s => ({ ...s, crossEncoderState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.Reranker);
        const model = await loadModel(
          modelPath,
          opts?.useGpu ?? true,
          undefined,
        );
        const crossEncoder = new CrossEncoder(model, opts?.contextSize);
        crossEncoderRef.current = crossEncoder;
        setState(s => ({ ...s, crossEncoderState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService error', error);
        setState(s => ({ ...s, crossEncoderState: AiModelState.Error }));
      } finally {
        inFlight.current.crossEncoder = false;
      }
    },
    [],
  );

  const dispose = useCallback(() => {
    chatRef.current = undefined;
    chatWithToolCallingRef.current = undefined;
    visionChatRef.current = undefined;

    // Encoder/CrossEncoder expose uniffiDestroy for deterministic cleanup
    encoderRef.current?.uniffiDestroy();
    encoderRef.current = undefined;
    crossEncoderRef.current?.uniffiDestroy();
    crossEncoderRef.current = undefined;

    // Reset in-flight flags so a subsequent createX() isn't silently skipped
    // if dispose ran while a load was pending.
    inFlight.current.chat = false;
    inFlight.current.chatWithToolCalling = false;
    inFlight.current.visionChat = false;
    inFlight.current.encoder = false;
    inFlight.current.crossEncoder = false;

    setState(_initialState);
  }, []);

  const value = useMemo<AiServiceContextValue>(
    () => ({
      ...state,
      chat: chatRef,
      chatWithToolCalling: chatWithToolCallingRef,
      visionChat: visionChatRef,
      encoder: encoderRef,
      crossEncoder: crossEncoderRef,
      createChat,
      createToolCallingChat,
      createVisionChat,
      createEncoder,
      createCrossEncoder,
      dispose,
    }),
    [
      state,
      createChat,
      createToolCallingChat,
      createVisionChat,
      createEncoder,
      createCrossEncoder,
      dispose,
    ],
  );

  return (
    <AiServiceContext.Provider value={value}>
      {children}
    </AiServiceContext.Provider>
  );
};

export const useAiService = (): AiServiceContextValue => {
  const ctx = useContext(AiServiceContext);
  if (!ctx) {
    throw new Error('useAiService must be used within an AiServiceProvider');
  }
  return ctx;
};
