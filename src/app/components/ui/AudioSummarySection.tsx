'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Summary } from '../../lib/types';

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
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

  const activeIndexRef = useRef(activeWordIndex);
  activeIndexRef.current = activeWordIndex;

  // New state to control audio player visibility
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState(true);

  // Effect to handle scroll events for hiding the audio player
  useEffect(() => {
    const handleScroll = () => {
      // Check if the user has scrolled to the bottom of the page
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1; // subtracted 1 for buffer
      setIsAudioPlayerVisible(!isAtBottom);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


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
      if (audio) {
        audio.removeEventListener('play', onPlay);
        audio.removeEventListener('pause', onPauseOrEnded);
        audio.removeEventListener('ended', onPauseOrEnded);
      }
      cancelAnimationFrame(frameId);
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
  if (isLoading) return <div className="mt-8 text-gray-600 dark:text-gray-400">Loading Audio...</div>;

  return (
    <div className="mt-8 max-w-4xl mx-auto px-4">
      <h2 className="text-3xl font-extrabold mb-6 text-gray-900 dark:text-gray-100">🎧 Audio Summary</h2>

      {audioSummary ? (
        <>
        <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800/50 shadow-lg">
          <div className="mb-6 text-xl leading-relaxed text-gray-800 dark:text-gray-200 select-text">
            {wordsToHighlight.map((word, index) => (
              <span
                key={index}
                className={`
                  inline-block px-1 rounded
                  transition-colors duration-300 ease-in-out
                  cursor-pointer
                  ${
                    index === activeWordIndex
                      ? 'bg-yellow-300 text-yellow-900'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-yellow-100 dark:hover:bg-yellow-800/20'
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
  className={`fixed bottom-0 left-0 w-full z-50 bg-white dark:bg-gray-800 shadow-md border-t border-gray-300 dark:border-gray-700 transition-transform duration-300 ${isAudioPlayerVisible ? 'translate-y-0' : 'translate-y-full'}`}
/>
      </>
      ) : (
        <div className="p-6 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-center">
          <p className="mb-4 text-gray-600 dark:text-gray-400">
            An audio version is not yet available.
          </p>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 disabled:bg-gray-400 transition-colors duration-200"
          >
            {isGenerating ? 'Generating...' : 'Generate Audio'}
          </button>
          {error && <p className="mt-4 text-red-600 dark:text-red-400 font-medium">{error}</p>}
        </div>
      )}
    </div>
  );
}