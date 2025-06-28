'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Summary } from '../../lib/types';

interface VideoData {
    summary_id: string;
    tavus_video_id: string;
    video_file_url: string | null;
    status: 'processing' | 'active' | 'ended';
}

interface VideoSummarySectionProps {
    summary: Summary | undefined;
}

const PlayIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>
);

const FullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
);

const ExitFullscreenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"></path></svg>
);


const LoadingSpinner = ({ size = 'h-8 w-8' }: { size?: string }) => (
    <div className="flex justify-center items-center">
        <svg className={`animate-spin text-blue-600 dark:text-blue-400 ${size}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
    </div>
);

const ErrorDisplay = ({ error, onRetry }: { error: string; onRetry: () => void }) => (
    <div className="w-full p-4 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-700 rounded-lg text-center transition-all duration-300">
        <p className="font-semibold mb-2">An Error Occurred</p>
        <p className="text-sm mb-4">{error}</p>
        <button onClick={onRetry} className="px-6 py-2 bg-red-600 text-white font-bold rounded-md hover:bg-red-700 transition-colors">
            Try Again
        </button>
    </div>
);

const IdleState = ({ onGenerate, isSubmitting }: { onGenerate: () => void; isSubmitting: boolean }) => (
    <div className="text-center transition-opacity duration-500">
        <p className="mb-4 text-gray-600 dark:text-gray-400">Bring this summary to life with a personalized video walkthrough.</p>
        <button
            onClick={onGenerate}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5 disabled:bg-blue-400 disabled:cursor-not-allowed"
        >
            {isSubmitting ? <><LoadingSpinner size="h-5 w-5" /> Generating...</> : <><PlayIcon /> Generate Video</>}
        </button>
    </div>
);

const ProcessingState = () => (
    <div className="text-center transition-opacity duration-500">
        <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">Your video is being created...</p>
        <p className="text-gray-500 dark:text-gray-400 mb-6">This may take a moment. Our AI is warming up!</p>
        <LoadingSpinner />
    </div>
);

const ActiveState = ({ iframeRef, videoData, onEndSession, onToggleFullScreen, isSubmitting, isFullscreen }: { iframeRef: React.RefObject<HTMLIFrameElement>; videoData: VideoData; onEndSession: () => void; onToggleFullScreen: () => void; isSubmitting: boolean; isFullscreen: boolean; }) => (
     <div className="w-full text-center transition-opacity duration-500">
        <div className="relative aspect-video bg-slate-900 rounded-lg overflow-hidden shadow-2xl mb-4 border border-gray-200 dark:border-gray-700">
             <iframe
                ref={iframeRef}
                key={videoData.tavus_video_id}
                className="w-full h-full"
                src={videoData.video_file_url!}
                title="Tavus AI Video Host"
                allow="camera; microphone; fullscreen; picture-in-picture; display-capture"
                allowFullScreen
            ></iframe>
        </div>
        <div className="flex justify-center items-center space-x-4">
            <button
                onClick={onEndSession}
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors disabled:bg-red-300 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <><LoadingSpinner size="h-5 w-5" /> Ending...</> : <><StopIcon /> End & Delete</>}
            </button>
            <button
                 onClick={onToggleFullScreen}
                 className="inline-flex items-center gap-2 px-5 py-2 bg-gray-600 text-white font-bold rounded-full hover:bg-gray-700 transition-colors"
                 aria-label={isFullscreen ? "Exit fullscreen" : "View video in fullscreen"}
             >
                {isFullscreen ? <ExitFullscreenIcon /> : <FullscreenIcon />}
                <span>{isFullscreen ? "Exit" : "Fullscreen"}</span>
             </button>
        </div>
    </div>
);

const EndedState = ({ onGenerate }: { onGenerate: () => void }) => (
    <div className="text-center transition-opacity duration-500">
        <p className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-4">This video session has ended.</p>
        <button
            onClick={onGenerate}
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-md"
        >
             <PlayIcon />
             Generate a New Video
        </button>
    </div>
);

export default function VideoSummaryPage({ summary }: VideoSummarySectionProps) {
    const { session } = useAuth();
    const accessToken = session?.access_token || null;

    const [videoData, setVideoData] = useState<VideoData | null>(null);
    const [uiStatus, setUiStatus] = useState<'idle' | 'loading' | 'processing' | 'active' | 'ended'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    // Handle fullscreen change event
    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(document.fullscreenElement !== null);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
        };
    }, []);

    // Fetch initial video status
    useEffect(() => {
        if (!summary?.summary_id || !accessToken) return;

        const fetchInitialVideoState = async () => {
            setUiStatus('loading');
            setError(null);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${summary.summary_id}/status`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (response.status === 404) {
                    setUiStatus('idle');
                    return;
                }
                if (!response.ok) throw new Error('Failed to fetch initial video status.');
                const data: VideoData = await response.json();
                setVideoData(data);
                setUiStatus(data.status);
            } catch (err) {
                setError((err as Error).message);
                setUiStatus('idle');
            }
        };

        fetchInitialVideoState();

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, [summary, accessToken]);

    // Polling for video status if processing
    useEffect(() => {
        const pollStatus = async () => {
            if (!summary?.summary_id || !accessToken) return;
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${summary.summary_id}/status`, {
                    headers: { 'Authorization': `Bearer ${accessToken}` },
                });
                if (!response.ok) {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    throw new Error('Could not verify video status. Please try again.');
                }
                const data: VideoData = await response.json();
                if (data.status !== 'processing') {
                    if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                    setVideoData(data);
                    setUiStatus(data.status);
                }
            } catch (err) {
                if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
                setError((err as Error).message);
                setUiStatus('idle');
            }
        };

        if (uiStatus === 'processing') {
            pollingIntervalRef.current = setInterval(pollStatus, 5000);
        } else {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        }

        return () => {
            if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
        };
    }, [uiStatus, summary, accessToken]);

    const handleGenerateVideo = async () => {
        if (!summary?.summary_id || !accessToken) return;
        setIsSubmitting(true);
        setError(null);
        setUiStatus('processing');
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/summaries/${summary.summary_id}/video`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'An unknown error occurred during generation.' }));
                throw new Error(errorData.message);
            }
            const responseData: VideoData = await response.json();
            setVideoData(responseData);
            setUiStatus(responseData.status);
        } catch (err) {
            setError((err as Error).message);
            setUiStatus('idle');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEndSession = async () => {
        if (!summary?.summary_id || !accessToken) return;
        if (!window.confirm("Are you sure you want to end this session? The video will be permanently deleted.")) return;
        setIsSubmitting(true);
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${summary.summary_id}/end`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${summary.summary_id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${accessToken}` }
            });
            setUiStatus('idle');
            setVideoData(null);
            setError(null);
        } catch (err) {
            setError("Could not end the session. Please refresh and try again.");
            // Refetch initial state to sync UI
            if (summary?.summary_id && accessToken) {
                const retryFetch = async () => {
                    try {
                        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/videos/${summary.summary_id}/status`, {
                            headers: { 'Authorization': `Bearer ${accessToken}` },
                        });
                        if (response.ok) {
                            const data: VideoData = await response.json();
                            setVideoData(data);
                            setUiStatus(data.status);
                        } else {
                            setUiStatus('idle');
                            setVideoData(null);
                        }
                    } catch {
                        setUiStatus('idle');
                        setVideoData(null);
                    }
                };
                retryFetch();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleFullScreen = () => {
        if (!iframeRef.current) return;

        if (isFullscreen) {
            document.exitFullscreen().catch(err => console.error(err));
        } else {
            iframeRef.current.requestFullscreen().catch(err => {
                console.error("Fullscreen failed:", err);
                alert('Fullscreen mode was blocked by your browser.');
            });
        }
    };

    const renderContent = () => {
        if (error) return <ErrorDisplay error={error} onRetry={handleGenerateVideo} />;
        switch (uiStatus) {
            case 'idle':
                return <IdleState onGenerate={handleGenerateVideo} isSubmitting={isSubmitting} />;
            case 'loading':
            case 'processing':
                return <ProcessingState />;
            case 'active':
                return videoData?.video_file_url ? (
                    <ActiveState
                        iframeRef={iframeRef as React.RefObject<HTMLIFrameElement>}
                        videoData={videoData}
                        onEndSession={handleEndSession}
                        onToggleFullScreen={handleToggleFullScreen}
                        isSubmitting={isSubmitting}
                        isFullscreen={isFullscreen}
                    />
                ) : <ProcessingState />;
            case 'ended':
                return <EndedState onGenerate={handleGenerateVideo} />;
            default:
                return <IdleState onGenerate={handleGenerateVideo} isSubmitting={isSubmitting} />;
        }
    };

    if (!summary) {
        return (
            <div className="mt-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                <p className="text-yellow-700 dark:text-yellow-300 text-center">A text summary is required to generate a video.</p>
            </div>
        );
    }

    return (
        <section className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4 pb-3 border-b border-gray-200 dark:border-gray-700">AI Video Host</h2>
            <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800/50 shadow-sm text-center min-h-[300px] flex flex-col justify-center items-center">
                {renderContent()}
            </div>
        </section>
    );
}
