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
  Decision,
  Tool,
  SamplerConfig,
  TextToSpeech,
  TextToSpeechOptions,
  SpeechToText,
  SpeechToTextOptions,
} from 'react-native-nobodywho';
import { devLog, getAssetPath } from 'helpers';

export enum AiModelState {
  NotLoaded = 'notLoaded',
  Loading = 'loading',
  Ready = 'ready',
  Error = 'error',
}

enum ModelName {
  ChatModel = 'chat-model.gguf',
  ProjectionModel = 'projection-model.gguf',
  EmbeddingModel = 'embedding-model.gguf',
  RerankerModel = 'reranker-model.gguf',
}

interface AiServiceState {
  chatState: AiModelState;
  chatWithToolCallingState: AiModelState;
  visionHearingChatState: AiModelState;
  encoderState: AiModelState;
  crossEncoderState: AiModelState;
  decisionState: AiModelState;
  ttsState: AiModelState;
  sttState: AiModelState;
}

interface AiServiceContextValue extends AiServiceState {
  chat: React.RefObject<Chat | undefined>;
  chatWithToolCalling: React.RefObject<Chat | undefined>;
  visionHearingChat: React.RefObject<Chat | undefined>;
  encoder: React.RefObject<Encoder | undefined>;
  crossEncoder: React.RefObject<CrossEncoder | undefined>;
  decision: React.RefObject<Decision | undefined>;
  tts: React.RefObject<TextToSpeech | undefined>;
  stt: React.RefObject<SpeechToText | undefined>;

  createChat: (opts?: {
    useGpu?: boolean;
    systemPrompt?: string;
    sampler?: SamplerConfig;
    contextSize?: number;
  }) => Promise<void>;
  createToolCallingChat: (opts?: {
    useGpu?: boolean;
    tools?: Tool[];
    systemPrompt?: string;
    sampler?: SamplerConfig;
    contextSize?: number;
  }) => Promise<void>;
  createVisionHearingChat: (opts?: {
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
  createDecision: (opts?: {
    useGpu?: boolean;
    contextSize?: number;
  }) => Promise<void>;
  createTts: (opts?: Partial<TextToSpeechOptions>) => Promise<void>;
  createStt: (opts?: Partial<SpeechToTextOptions>) => void;
  dispose: () => void;
}

const AiServiceContext = createContext<AiServiceContextValue | undefined>(
  undefined,
);

const _initialState: AiServiceState = {
  chatState: AiModelState.NotLoaded,
  chatWithToolCallingState: AiModelState.NotLoaded,
  visionHearingChatState: AiModelState.NotLoaded,
  encoderState: AiModelState.NotLoaded,
  crossEncoderState: AiModelState.NotLoaded,
  decisionState: AiModelState.NotLoaded,
  ttsState: AiModelState.NotLoaded,
  sttState: AiModelState.NotLoaded,
};

export const AiServiceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, setState] = useState<AiServiceState>(_initialState);

  // Guard to prevent duplicate loading of the same model. For e.g if createChat is called twice quickly
  const inFlight = useRef({
    chat: false,
    chatWithToolCalling: false,
    visionHearingChat: false,
    encoder: false,
    crossEncoder: false,
    decision: false,
    tts: false,
  });

  const chatRef = useRef<Chat | undefined>(undefined);
  const chatWithToolCallingRef = useRef<Chat | undefined>(undefined);
  const visionHearingChatRef = useRef<Chat | undefined>(undefined);
  const encoderRef = useRef<Encoder | undefined>(undefined);
  const crossEncoderRef = useRef<CrossEncoder | undefined>(undefined);
  const decisionRef = useRef<Decision | undefined>(undefined);
  const ttsRef = useRef<TextToSpeech | undefined>(undefined);
  const sttRef = useRef<SpeechToText | undefined>(undefined);

  const createChat = useCallback(
    async (opts?: {
      useGpu?: boolean;
      systemPrompt?: string;
      sampler?: SamplerConfig;
      contextSize?: number;
    }) => {
      if (inFlight.current.chat || chatRef.current) return;
      inFlight.current.chat = true;
      setState(s => ({ ...s, chatState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.ChatModel);
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
        devLog('AiService chat error', error);
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
      sampler?: SamplerConfig;
      contextSize?: number;
    }) => {
      if (
        inFlight.current.chatWithToolCalling ||
        chatWithToolCallingRef.current
      )
        return;
      inFlight.current.chatWithToolCalling = true;
      setState(s => ({
        ...s,
        chatWithToolCallingState: AiModelState.Loading,
      }));
      try {
        const modelPath = await getAssetPath(ModelName.ChatModel);
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
        devLog('AiService chatWithToolCalling error', error);
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

  const createVisionHearingChat = useCallback(
    async (opts?: {
      useGpu?: boolean;
      systemPrompt?: string;
      contextSize?: number;
    }) => {
      if (inFlight.current.visionHearingChat || visionHearingChatRef.current)
        return;
      inFlight.current.visionHearingChat = true;
      setState(s => ({ ...s, visionHearingChatState: AiModelState.Loading }));
      try {
        const modelPath = await getAssetPath(ModelName.ChatModel);
        const projectionModelPath = await getAssetPath(
          ModelName.ProjectionModel,
        );
        const chat = await Chat.fromPath({
          modelPath,
          projectionModelPath,
          useGpu: opts?.useGpu ?? true,
          systemPrompt: opts?.systemPrompt,
          contextSize: opts?.contextSize,
        });
        visionHearingChatRef.current = chat;
        setState(s => ({ ...s, visionHearingChatState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService visionHearingChat error', error);
        setState(s => ({ ...s, visionHearingChatState: AiModelState.Error }));
      } finally {
        inFlight.current.visionHearingChat = false;
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
        const modelPath = await getAssetPath(ModelName.EmbeddingModel);
        const encoder = await Encoder.fromPath({
          modelPath,
          useGpu: opts?.useGpu ?? true,
          contextSize: opts?.contextSize,
        });
        encoderRef.current = encoder;
        setState(s => ({ ...s, encoderState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService encoder error', error);
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
        const modelPath = await getAssetPath(ModelName.RerankerModel);
        const crossEncoder = await CrossEncoder.fromPath({
          modelPath,
          useGpu: opts?.useGpu ?? true,
          contextSize: opts?.contextSize,
        });
        crossEncoderRef.current = crossEncoder;
        setState(s => ({ ...s, crossEncoderState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService crossEncoder error', error);
        setState(s => ({ ...s, crossEncoderState: AiModelState.Error }));
      } finally {
        inFlight.current.crossEncoder = false;
      }
    },
    [],
  );

  // Decision
  const createDecision = useCallback(
    async (opts?: { useGpu?: boolean; contextSize?: number }) => {
      if (inFlight.current.decision || decisionRef.current) return;
      inFlight.current.decision = true;
      setState(s => ({ ...s, decisionState: AiModelState.Loading }));
      try {
        const decision = await Decision.fromPath({
          modelPath: 'hf://ggml-org/Laya-GGUF/Laya-Q8_0.gguf',
          useGpu: opts?.useGpu ?? true,
          contextSize: opts?.contextSize,
        });
        decisionRef.current = decision;
        setState(s => ({ ...s, decisionState: AiModelState.Ready }));
      } catch (error) {
        devLog('AiService decision error', error);
        setState(s => ({ ...s, decisionState: AiModelState.Error }));
      } finally {
        inFlight.current.decision = false;
      }
    },
    [],
  );

  // Text-to-speech
  const createTts = useCallback(async (opts?: Partial<TextToSpeechOptions>) => {
    if (inFlight.current.tts || ttsRef.current) {
      return;
    }

    inFlight.current.tts = true;
    setState(s => ({ ...s, ttsState: AiModelState.Loading }));

    try {
      const tts = await TextToSpeech.load({
        source: 'hf://NobodyWho/Kokoro-82M',
        voice: 'bf_emma',
        language: 'en-gb',
        ...opts,
      });

      ttsRef.current = tts;
      setState(s => ({ ...s, ttsState: AiModelState.Ready }));
    } catch (error) {
      devLog('AiService tts error', error);
      setState(s => ({ ...s, ttsState: AiModelState.Error }));
    } finally {
      inFlight.current.tts = false;
    }
  }, []);

  // Speech-to-text
  const createStt = useCallback(async (opts?: Partial<SpeechToTextOptions>) => {
    if (sttRef.current) return;
    try {
      const stt = await SpeechToText.load({
        source: 'hf://onnx-community/whisper-base',
        ...opts,
      });
      sttRef.current = stt;
      setState(s => ({ ...s, sttState: AiModelState.Ready }));
    } catch (error) {
      devLog('AiService stt error', error);
      setState(s => ({ ...s, sttState: AiModelState.Error }));
    }
  }, []);

  const dispose = useCallback(() => {
    sttRef.current = undefined;
    ttsRef.current = undefined;
    chatRef.current = undefined;
    chatWithToolCallingRef.current = undefined;
    visionHearingChatRef.current = undefined;
    encoderRef.current = undefined;
    crossEncoderRef.current = undefined;
    decisionRef.current = undefined;

    // Reset in-flight flags so a subsequent createX() isn't silently skipped
    // if dispose ran while a load was pending.
    inFlight.current.chat = false;
    inFlight.current.chatWithToolCalling = false;
    inFlight.current.visionHearingChat = false;
    inFlight.current.encoder = false;
    inFlight.current.crossEncoder = false;
    inFlight.current.decision = false;
    inFlight.current.tts = false;

    setState(_initialState);
  }, []);

  const value = useMemo<AiServiceContextValue>(
    () => ({
      ...state,
      chat: chatRef,
      chatWithToolCalling: chatWithToolCallingRef,
      visionHearingChat: visionHearingChatRef,
      encoder: encoderRef,
      crossEncoder: crossEncoderRef,
      decision: decisionRef,
      tts: ttsRef,
      stt: sttRef,
      createChat,
      createToolCallingChat,
      createVisionHearingChat,
      createEncoder,
      createCrossEncoder,
      createDecision,
      createTts,
      createStt,
      dispose,
    }),
    [
      state,
      createChat,
      createToolCallingChat,
      createVisionHearingChat,
      createEncoder,
      createCrossEncoder,
      createDecision,
      createTts,
      createStt,
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
