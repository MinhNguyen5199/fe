'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Summary } from '../../../lib/types';

interface WordTimestamp {
  word: string;
  start: number | null;
  end: number | null;
  status: 'ok' | 'missing';
}

interface AudioSummary {
  audio_file_url: string;
  word_timestamps: WordTimestamp[];
  signed_audio_url: string;
}

interface AudioSummaryProps {
  summary: Summary | undefined;
}

export default function AudioSummarySection({ summary }: AudioSummaryProps) {
  const { session } = useAuth();
  const [audioSummary, setAudioSummary] = useState<AudioSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [activeWordIndex, setActiveWordIndex] = useState(-1);
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

  const activeIndexRef = useRef(activeWordIndex);
  activeIndexRef.current = activeWordIndex;

  useEffect(() => {
    if (!summary) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    fetch(`${apiBaseUrl}/summaries/${summary.summary_id}/audio`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch audio summary.');
        return res.json();
      })
      .then((result) => {
        setAudioSummary(result.data);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setIsLoading(false));
  }, [summary, session, apiBaseUrl]);

  const wordsToHighlight = useMemo(() => {
    if (!audioSummary?.word_timestamps) return [];
    return audioSummary.word_timestamps.filter(
      (w) => typeof w.start === 'number' && typeof w.end === 'number'
    );
  }, [audioSummary]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || wordsToHighlight.length === 0) return;

    let frameId: number;
    const BUFFER = 0.03;

    function syncHighlight() {
      const currentTime = audio?.currentTime;
      if (currentTime === undefined) return;

      const currentIndex = wordsToHighlight.findIndex(
        (word) =>
          currentTime >= (word.start! - BUFFER) && currentTime <= (word.end! + BUFFER)
      );

      if (currentIndex !== activeIndexRef.current) {
        setActiveWordIndex(currentIndex);
      }

      if (!audio?.paused && !audio?.ended) {
        frameId = requestAnimationFrame(syncHighlight);
      }
    }

    function onPlay() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(syncHighlight);
    }

    function onPauseOrEnded() {
      cancelAnimationFrame(frameId);
      setActiveWordIndex(-1);
    }

    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPauseOrEnded);
    audio.addEventListener('ended', onPauseOrEnded);

    return () => {
      cancelAnimationFrame(frameId);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPauseOrEnded);
      audio.removeEventListener('ended', onPauseOrEnded);
    };
  }, [wordsToHighlight]);

  const handleGenerate = async () => {
    if (!summary) return;
    setIsGenerating(true);
    setError(null);
    try {
      const response = await fetch(`${apiBaseUrl}/summaries/${summary.summary_id}/audio`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.access_token}`,
        },
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message);
      setAudioSummary(result.data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!summary) return null;
  if (isLoading) return <div className="mt-8 text-gray-600">Loading Audio...</div>;

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900">🎧 Audio Summary</h2>

      {audioSummary ? (
        <>
        <div className="p-6 border border-gray-300 rounded-xl bg-white shadow-lg">
          <div className="mb-6 text-xl leading-relaxed text-gray-800 select-text">
            {wordsToHighlight.map((word, index) => (
              <span
                key={index}
                className={`
                  inline-block px-1 rounded
                  transition-colors duration-300 ease-in-out
                  cursor-pointer
                  ${
                    index === activeWordIndex
                      ? 'bg-yellow-300 text-yellow-900 underline decoration-yellow-600 decoration-2 font-semibold scale-110 shadow-[0_0_10px_rgb(234,179,8)]'
                      : 'text-gray-700 hover:bg-yellow-100 hover:text-yellow-800'
                  }
                `}
                aria-current={index === activeWordIndex ? 'true' : undefined}
              >
                {word.word}{' '}
              </span>
            ))}
          </div>
        </div>

        <div className="h-20" />

        <audio
          ref={audioRef}
          controls
          src={audioSummary.signed_audio_url}
          preload="auto"
          className="fixed bottom-0 left-0 w-full z-50 bg-white shadow-md border-t border-gray-300"
        />
      </>
      ) : (
        <div className="p-6 border border-gray-300 rounded-lg bg-gray-50 text-center">
          <p className="mb-4 text-gray-600">
            An audio version is not yet available.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
          {error && <p className="mt-4 text-red-600 font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}