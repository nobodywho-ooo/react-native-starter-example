import { useCallback, useEffect, useRef, useState } from 'react';
import Sound from 'react-native-nitro-sound';
import { fromByteArray } from 'base64-js';
import { CachesDirectoryPath, writeFile } from '@dr.pogodin/react-native-fs';
import { TextToSpeech } from 'react-native-nobodywho';

import { devLog } from 'helpers';
import { useAiService } from 'services';

interface TtsPlayback {
  loadingIndex: number | null;
  playingIndex: number | null;
  play: (index: number, text: string) => Promise<void>;
  stop: () => Promise<void>;
}

const MAX_CHUNK_CHARS = 350; // The Kokoro model rejects any synthesize() call over 509 phonemes

const isPhonemeCapError = (error: unknown): boolean =>
  String((error as { message?: string })?.message ?? error).includes(
    'phonemes',
  );

const splitIntoChunks = (text: string): string[] => {
  const clean = text.trim();
  if (!clean) {
    return [];
  }
  if (clean.length <= MAX_CHUNK_CHARS) {
    return [clean];
  }

  const segments = clean.match(/[^.!?\n]+[.!?]*\s*|\n+/g) ?? [clean];
  const chunks: string[] = [];
  let current = '';

  const flush = () => {
    const trimmed = current.trim();
    if (trimmed) {
      chunks.push(trimmed);
    }
    current = '';
  };

  const pushWords = (segment: string) => {
    let buffer = '';
    for (const word of segment.split(/\s+/)) {
      const next = buffer ? `${buffer} ${word}` : word;
      if (next.length > MAX_CHUNK_CHARS && buffer) {
        chunks.push(buffer);
        buffer = word;
      } else {
        buffer = next;
      }
    }
    if (buffer.trim()) {
      chunks.push(buffer.trim());
    }
  };

  for (const segment of segments) {
    if (segment.trim().length > MAX_CHUNK_CHARS) {
      flush();
      pushWords(segment);
    } else if ((current + segment).length > MAX_CHUNK_CHARS) {
      flush();
      current = segment;
    } else {
      current += segment;
    }
  }
  flush();

  return chunks;
};

const synthesizeChunk = async (
  synth: TextToSpeech,
  text: string,
): Promise<Uint8Array[]> => {
  try {
    return [await synth.synthesize(text)];
  } catch (error) {
    const words = text.trim().split(/\s+/);
    if (!isPhonemeCapError(error) || words.length < 2) {
      throw error;
    }
    const mid = Math.ceil(words.length / 2);
    const left = await synthesizeChunk(synth, words.slice(0, mid).join(' '));
    const right = await synthesizeChunk(synth, words.slice(mid).join(' '));
    return [...left, ...right];
  }
};

/** Locate a RIFF subchunk by id, walking word-aligned subchunk headers. */
const findChunk = (
  bytes: Uint8Array,
  view: DataView,
  id: string,
): { offset: number; size: number } | null => {
  let p = 12; // Skip "RIFF" + size + "WAVE".
  while (p + 8 <= bytes.length) {
    const cid = String.fromCharCode(
      bytes[p],
      bytes[p + 1],
      bytes[p + 2],
      bytes[p + 3],
    );
    const size = view.getUint32(p + 4, true);
    if (cid === id) {
      return { offset: p + 8, size };
    }
    p += 8 + size + (size % 2);
  }
  return null;
};

/** Concatenate the PCM payloads of several WAVs (same format) into one WAV. */
const concatWavs = (wavs: Uint8Array[]): Uint8Array => {
  if (wavs.length === 1) {
    return wavs[0];
  }

  const first = wavs[0];
  const firstView = new DataView(
    first.buffer,
    first.byteOffset,
    first.byteLength,
  );
  const fmt = findChunk(first, firstView, 'fmt ');
  if (!fmt) {
    throw new Error('Invalid WAV: missing fmt chunk');
  }
  const fmtBytes = first.subarray(fmt.offset, fmt.offset + fmt.size);

  const payloads: Uint8Array[] = [];
  let dataLength = 0;
  for (const wav of wavs) {
    const view = new DataView(wav.buffer, wav.byteOffset, wav.byteLength);
    const data = findChunk(wav, view, 'data');
    if (!data) {
      continue;
    }
    const payload = wav.subarray(data.offset, data.offset + data.size);
    payloads.push(payload);
    dataLength += payload.length;
  }

  const headerLength = 12 + (8 + fmtBytes.length) + 8;
  const out = new Uint8Array(headerLength + dataLength);
  const outView = new DataView(out.buffer);
  const writeTag = (offset: number, tag: string) => {
    for (let i = 0; i < tag.length; i++) {
      out[offset + i] = tag.charCodeAt(i);
    }
  };

  writeTag(0, 'RIFF');
  outView.setUint32(4, headerLength - 8 + dataLength, true);
  writeTag(8, 'WAVE');
  writeTag(12, 'fmt ');
  outView.setUint32(16, fmtBytes.length, true);
  out.set(fmtBytes, 20);
  let p = 20 + fmtBytes.length;
  writeTag(p, 'data');
  outView.setUint32(p + 4, dataLength, true);
  p += 8;
  for (const payload of payloads) {
    out.set(payload, p);
    p += payload.length;
  }

  return out;
};

export const useTtsPlayback = (): TtsPlayback => {
  const busyRef = useRef<boolean>(false);
  const { tts, createTts } = useAiService();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);

  const stop = useCallback(async () => {
    Sound.removePlayBackListener();
    await Sound.stopPlayer();
    setPlayingIndex(null);
  }, []);

  const play = useCallback(
    async (index: number, text: string) => {
      if (busyRef.current) {
        return;
      }
      busyRef.current = true;
      setLoadingIndex(index);

      try {
        if (!tts.current) {
          await createTts();
        }
        const synth = tts.current;
        if (!synth) {
          throw new Error('TTS model unavailable');
        }

        const chunks = splitIntoChunks(text);
        if (chunks.length === 0) {
          return;
        }

        const wavs: Uint8Array[] = [];
        for (const chunk of chunks) {
          wavs.push(...(await synthesizeChunk(synth, chunk)));
        }

        const path = `${CachesDirectoryPath}/tts-playback.wav`;
        await writeFile(path, fromByteArray(concatWavs(wavs)), 'base64');

        Sound.addPlayBackListener(({ currentPosition, duration }) => {
          if (duration > 0 && currentPosition >= duration) {
            Sound.removePlayBackListener();
            setPlayingIndex(null);
          }
        });

        await Sound.stopPlayer();
        setPlayingIndex(index);
        await Sound.startPlayer(path);
      } catch (error) {
        Sound.removePlayBackListener();
        setPlayingIndex(null);
        devLog('useTtsPlayback error:', error);
      } finally {
        setLoadingIndex(null);
        busyRef.current = false;
      }
    },
    [tts, createTts],
  );

  useEffect(() => {
    return () => {
      Sound.removePlayBackListener();
      Sound.stopPlayer();
    };
  }, []);

  return { loadingIndex, playingIndex, play, stop };
};
