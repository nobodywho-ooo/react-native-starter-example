import { useCallback, useEffect, useRef, useState } from 'react';
import { Buffer } from 'buffer';
import {
  AUDIO_FORMATS,
  AUDIO_SOURCES,
  CHANNEL_CONFIGS,
  InputAudioStream,
} from '@dr.pogodin/react-native-audio';

import { devLog } from 'helpers';
import { useAiService } from 'services';

const SAMPLE_RATE = 44100;
const SAMPLING_SIZE = 4096;

// Strip non-speech audio from Whisper, like "[BLANK_AUDIO]", "[MUSIC]", "[NOISE]"...
const cleanTranscript = (text: string): string =>
  text
    .replace(/\[[^\]]*\]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

interface SttRecording {
  isRecording: boolean;
  isTranscribing: boolean;
  toggle: () => Promise<void>;
}

/**
 * Records microphone audio as PCM and transcribes it with the STT model from
 * `useAiService`. `onTranscribed` receives the final text once recording stops.
 */
export const useSttRecording = (
  onTranscribed: (text: string) => void,
): SttRecording => {
  const { stt, createStt } = useAiService();
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [isTranscribing, setIsTranscribing] = useState<boolean>(false);

  const streamRef = useRef<InputAudioStream | null>(null);
  const chunksRef = useRef<Buffer[]>([]);
  const busyRef = useRef<boolean>(false);

  const onTranscribedRef = useRef(onTranscribed);
  onTranscribedRef.current = onTranscribed;

  const cleanupStream = useCallback(async () => {
    const stream = streamRef.current;
    streamRef.current = null;

    if (!stream) {
      return;
    }

    try {
      await stream.stop();
      await stream.destroy();
    } catch (error) {
      devLog('useSttRecording cleanup error:', error);
    }
  }, []);

  const startRecording = useCallback(async () => {
    chunksRef.current = [];

    const stream = new InputAudioStream(
      AUDIO_SOURCES.VOICE_RECOGNITION,
      SAMPLE_RATE,
      CHANNEL_CONFIGS.MONO,
      AUDIO_FORMATS.PCM_16BIT,
      SAMPLING_SIZE,
    );

    stream.addChunkListener(chunk => {
      chunksRef.current.push(Buffer.from(chunk));
    });
    stream.addErrorListener(error =>
      devLog('useSttRecording stream error:', error),
    );

    streamRef.current = stream;
    const started = await stream.start();

    if (!started) {
      await cleanupStream();
      throw new Error('Microphone unavailable or permission denied');
    }
    setIsRecording(true);
  }, [cleanupStream]);

  const stopAndTranscribe = useCallback(async () => {
    await cleanupStream();
    setIsRecording(false);

    const merged = Buffer.concat(chunksRef.current);
    chunksRef.current = [];

    const sampleCount = Math.floor(merged.length / 2);

    if (sampleCount === 0) {
      return;
    }

    // PCM16 little-endian bytes -> Int16 samples. Reading explicitly avoids
    // TypedArray byte-alignment pitfalls from Buffer pooling.
    const samples = new Int16Array(sampleCount);
    for (let i = 0; i < sampleCount; i++) {
      samples[i] = merged.readInt16LE(i * 2);
    }

    setIsTranscribing(true);
    try {
      createStt();
      const model = stt.current;

      if (!model) {
        throw new Error('STT model unavailable');
      }

      const raw = await model.transcribePcm(samples, SAMPLE_RATE).completed();
      const text = cleanTranscript(raw);

      if (text) {
        onTranscribedRef.current(text);
      }
    } finally {
      setIsTranscribing(false);
    }
  }, [cleanupStream, stt, createStt]);

  const toggle = useCallback(async () => {
    if (busyRef.current || isTranscribing) {
      return;
    }

    busyRef.current = true;

    try {
      if (streamRef.current) {
        await stopAndTranscribe();
      } else {
        await startRecording();
      }
    } catch (error) {
      devLog('useSttRecording error:', error);
      await cleanupStream();
      setIsRecording(false);
      setIsTranscribing(false);
    } finally {
      busyRef.current = false;
    }
  }, [isTranscribing, startRecording, stopAndTranscribe, cleanupStream]);

  useEffect(() => {
    return () => {
      cleanupStream();
    };
  }, [cleanupStream]);

  return { isRecording, isTranscribing, toggle };
};
