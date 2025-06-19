import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, Smile, Clock, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

// Define emotion types
type Emotion = 'happy' | 'neutral' | 'sad' | 'sleepy' | 'focused';

// Simplified props for easier integration
interface SimpleFacialTrackerProps {
  onEmotionDetected?: (emotion: Emotion, confidence: number) => void;
  captureInterval?: number; // in milliseconds, default will be 20000 (20 seconds)
}

const SimpleFacialTracker: React.FC<SimpleFacialTrackerProps> = ({
  onEmotionDetected,
  captureInterval = 20000
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<Emotion>('neutral');
  const [confidenceLevel, setConfidenceLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  
  // References to hold important state
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Map emotions to emojis for display
  const emotionEmojis: Record<Emotion, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    sleepy: '😴',
    focused: '🧐'
  };

  // Cleanup when component unmounts
  useEffect(() => {
    return () => {
      stopCapturing();
    };
  }, []);
  
  // Start capturing
  const startCapturing = async () => {
    try {
      setError(null);
      
      // Check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported in this browser');
      }

      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user' // Use front camera
        } 
      });
      
      // Set the stream as source for video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraPermission(true);
        
        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
          }
        };
      }
      
      // Start capturing at intervals
      setIsCapturing(true);
      
      // Set interval for capturing emotions (simplified emotion detection)
      captureIntervalRef.current = setInterval(() => {
        captureSimpleEmotion();
      }, captureInterval);
      
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission(false);
      
      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          setError('Camera access denied. Please grant camera permissions and try again.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera found. Please connect a camera and try again.');
        } else if (err.name === 'NotSupportedError') {
          setError('Camera access is not supported in this browser.');
        } else {
          setError(`Camera error: ${err.message}`);
        }
      } else {
        setError('An unknown error occurred while accessing the camera.');
      }
    }
  };
  
  // Stop capturing
  const stopCapturing = () => {
    // Clear the capturing interval
    if (captureIntervalRef.current) {
      clearInterval(captureIntervalRef.current);
      captureIntervalRef.current = null;
    }
    
    // Stop the stream tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    // Reset video element
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCapturing(false);
    setCameraPermission(null);
  };
  
  // Simple emotion detection without face-api.js (for demonstration)
  const captureSimpleEmotion = () => {
    if (!videoRef.current || !isCapturing) {
      return;
    }
    
    try {
      // Simulate emotion detection with random values for demonstration
      // In a real implementation, you would use actual face detection
      const emotions: Emotion[] = ['happy', 'neutral', 'sad', 'sleepy', 'focused'];
      const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];
      const randomConfidence = 0.6 + Math.random() * 0.4; // 60-100% confidence
      
      // Update the state with detected emotion
      setCurrentEmotion(randomEmotion);
      setConfidenceLevel(randomConfidence);
      
      // Call the callback with detected emotion
      if (onEmotionDetected) {
        onEmotionDetected(randomEmotion, randomConfidence);
      }
      
      console.log(`Simulated emotion detected: ${randomEmotion} (${Math.round(randomConfidence * 100)}%)`);
      
    } catch (err) {
      console.error('Error in emotion detection:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Engagement Tracker</h3>
        
        {isCapturing ? (
          <button 
            onClick={stopCapturing}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm flex items-center hover:bg-red-600 transition-colors"
          >
            <X className="h-4 w-4 mr-1" />
            Stop
          </button>
        ) : (
          <button 
            onClick={startCapturing}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center hover:bg-blue-600 transition-colors"
          >
            <Camera className="h-4 w-4 mr-1" />
            Start Tracking
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {cameraPermission === false && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg">
          <p className="text-sm">
            Camera access is required for engagement tracking. Please:
            <br />1. Click the camera icon in your browser's address bar
            <br />2. Select "Allow" for camera access
            <br />3. Try starting the tracker again
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Emotion */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Status</div>
          <div className="flex items-center text-2xl">
            <span className="mr-2">{emotionEmojis[currentEmotion]}</span>
            <span className="text-gray-800 capitalize">{currentEmotion}</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Confidence: {Math.round(confidenceLevel * 100)}%
          </div>
        </div>
        
        {/* Camera Feed */}
        <div className="md:col-span-2">
          <div className="relative">
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              playsInline
              className="rounded-lg w-full h-auto bg-gray-100"
              style={{ 
                maxHeight: "240px", 
                display: isCapturing ? 'block' : 'none',
                transform: 'scaleX(-1)' // Mirror the video for better UX
              }}
            />
            
            {!isCapturing && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: "240px" }}>
                <div className="text-center text-gray-500">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p>Click 'Start Tracking' to begin</p>
                  {cameraPermission === false && (
                    <p className="text-sm text-red-500 mt-1">Camera access denied</p>
                  )}
                </div>
              </div>
            )}
            
            {isCapturing && (
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs py-1 px-2 rounded">
                {emotionEmojis[currentEmotion]} {currentEmotion}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Hidden canvas for processing (if needed in future) */}
      <canvas 
        ref={canvasRef}
        className="hidden"
      />
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>
          {isCapturing 
            ? "Tracking your engagement in real-time. Data is processed locally." 
            : "Facial data is processed locally and is not stored permanently."
          }
        </p>
      </div>
    </div>
  );
};

export default SimpleFacialTracker;