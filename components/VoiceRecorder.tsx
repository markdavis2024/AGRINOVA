"use client";

import { useState, useRef, useEffect } from "react";
import { Mic, Square, Play, Pause, Trash2, Loader2, Check } from "lucide-react";

interface VoiceRecorderProps {
  onRecordingComplete: (audioBlob: Blob, audioUrl: string) => void;
  onDelete?: () => void;
  maxDuration?: number; // in seconds
}

export default function VoiceRecorder({
  onRecordingComplete,
  onDelete,
  maxDuration = 120, // 2 minutes default
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
    };
  }, [audioUrl]);

  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioBlob(audioBlob);
        setAudioUrl(audioUrl);
        setIsRecording(false);
        setIsPaused(false);
        setRecordingTime(0);
        if (timerRef.current) clearInterval(timerRef.current);
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start(1000); // Collect data every second
      setIsRecording(true);
      setRecordingTime(0);
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
            return maxDuration;
          }
          return newTime;
        });
      }, 1000);

    } catch (error) {
      console.error("Error accessing microphone:", error);
      alert("Please allow microphone access to record voice notes.");
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  // Toggle recording
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    if (!audioUrl) return;
    
    if (!audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
    }

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  // Delete recording
  const deleteRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setAudioBlob(null);
    setIsPlaying(false);
    setIsComplete(false);
    if (onDelete) onDelete();
  };

  // Confirm and upload
  const confirmRecording = () => {
    if (audioBlob && audioUrl) {
      setIsComplete(true);
      onRecordingComplete(audioBlob, audioUrl);
    }
  };

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="voice-recorder">
      <div className="voice-recorder-container">
        {/* Recording Status */}
        {isRecording && (
          <div className="voice-recording-status">
            <div className="voice-recording-dot">
              <span className="voice-pulse"></span>
            </div>
            <span className="voice-recording-time">
              {formatTime(recordingTime)}
            </span>
            <span className="voice-recording-label">Recording...</span>
            {recordingTime >= maxDuration - 5 && (
              <span className="voice-recording-warning">
                ⚠️ Time limit: {formatTime(maxDuration)}
              </span>
            )}
          </div>
        )}

        {/* Audio Player (when recording is complete) */}
        {audioUrl && !isRecording && !isComplete && (
          <div className="voice-player">
            <button
              type="button"
              className="voice-play-btn"
              onClick={togglePlay}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <div className="voice-player-info">
              <span className="voice-player-label">Voice Note</span>
              <span className="voice-player-duration">
                {formatTime(audioRef.current?.duration || 0)}
              </span>
            </div>
            <button
              type="button"
              className="voice-delete-btn"
              onClick={deleteRecording}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {/* Upload Confirmation */}
        {isComplete && (
          <div className="voice-complete">
            <Check size={20} className="voice-check-icon" />
            <span className="voice-complete-label">Voice note added ✓</span>
            <button
              type="button"
              className="voice-delete-btn"
              onClick={deleteRecording}
            >
              <Trash2 size={18} />
            </button>
          </div>
        )}

        {/* Record Button */}
        {!audioUrl && !isRecording && (
          <button
            type="button"
            className="voice-record-btn"
            onClick={toggleRecording}
          >
            <Mic size={24} />
            <span>Record Voice Note</span>
            <small className="voice-btn-hint">(max {maxDuration}s)</small>
          </button>
        )}

        {/* Stop Recording Button */}
        {isRecording && (
          <button
            type="button"
            className="voice-stop-btn"
            onClick={toggleRecording}
          >
            <Square size={20} />
            <span>Stop Recording</span>
          </button>
        )}

        {/* Confirm Button */}
        {audioUrl && !isRecording && !isComplete && (
          <button
            type="button"
            className="voice-confirm-btn"
            onClick={confirmRecording}
          >
            <Check size={20} />
            <span>Add Voice Note</span>
          </button>
        )}
      </div>
    </div>
  );
}