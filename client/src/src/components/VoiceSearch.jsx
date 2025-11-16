import { useState, useEffect, useCallback } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:4000';

const VoiceSearch = ({ onResults }) => {
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState(null);

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  const performSearch = useCallback(async (query) => {
    try {
      setError(null);
      const response = await axios.post(`${API_BASE_URL}/api/voice-search/text`, { query });
      if (onResults) {
        onResults(response.data.results);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Voice search error:', err);
    }
  }, [onResults, setError]);

  useEffect(() => {
    if (!listening && transcript && transcript.trim().length > 0) {
      performSearch(transcript);
    }
  }, [listening, transcript, performSearch]);

  const startListening = () => {
    if (!browserSupportsSpeechRecognition) {
      setError('Your browser does not support speech recognition.');
      return;
    }
    resetTranscript();
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
  };

  const stopListening = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        className={`p-2 rounded-full transition-colors ${
          isListening
            ? 'bg-red-500 text-white animate-pulse'
            : 'hover:bg-gray-100'
        }`}
        aria-label="Voice Search"
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </button>

      {isListening && (
        <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-lg p-4 min-w-[200px] z-50">
          <p className="text-sm text-gray-600 mb-2">Listening...</p>
          <p className="text-sm font-medium">{transcript || 'Say something...'}</p>
        </div>
      )}

      {error && (
        <div className="absolute top-full right-0 mt-2 bg-red-100 text-red-700 rounded-lg p-2 text-sm z-50">
          {error}
        </div>
      )}
    </div>
  );
};

export default VoiceSearch;
