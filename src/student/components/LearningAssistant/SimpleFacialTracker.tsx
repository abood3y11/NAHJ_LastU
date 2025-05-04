import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, Smile, Clock, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import * as faceapi from 'face-api.js';

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
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  
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

  // Load models on component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Check if models are already loaded
        if (faceapi.nets.tinyFaceDetector.isLoaded && 
            faceapi.nets.faceExpressionNet.isLoaded && 
            faceapi.nets.faceLandmark68Net.isLoaded) {
          setModelsLoaded(true);
          return;
        }
        
        setLoadingModels(true);
        setError(null);
        
        // Load from CDN instead of local files
        const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
        
        // Load the required models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        setModelsLoaded(true);
        console.log('Face-API models loaded successfully from CDN');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load facial analysis models. Please check console for details.');
      } finally {
        setLoadingModels(false);
      }
    };
    
    loadModels();
    
    // Cleanup when component unmounts
    return () => {
      stopCapturing();
    };
  }, []);
  
  // Start capturing
  const startCapturing = async () => {
    if (!modelsLoaded) {
      setError('Models are still loading. Please wait...');
      return;
    }
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 320,
          height: 240,
          facingMode: 'user' // Use front camera
        } 
      });
      
      // Set the stream as source for video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
      
      // Start capturing at intervals
      setIsCapturing(true);
      
      // Set interval for capturing emotions
      captureIntervalRef.current = setInterval(captureEmotion, captureInterval);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('Camera access denied. Please grant camera permissions and try again.');
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
    
    setIsCapturing(false);
  };
  
  // Capture and analyze emotion
  const captureEmotion = async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) {
      return;
    }
    
    try {
      // Draw the current video frame on the canvas
      const videoEl = videoRef.current;
      const canvas = canvasRef.current;
      
      // Match canvas dimensions to video
      canvas.width = videoEl.videoWidth;
      canvas.height = videoEl.videoHeight;
      
      // Draw video to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
      }
      
      // Detect faces and expressions
      const detections = await faceapi.detectSingleFace(
        canvas,
        new faceapi.TinyFaceDetectorOptions()
      ).withFaceLandmarks().withFaceExpressions();
      
      if (detections) {
        // Get the most prominent emotion
        const expressions = detections.expressions;
        let maxEmotion: Emotion = 'neutral';
        let maxConfidence = expressions.neutral;
        
        if (expressions.happy > maxConfidence) {
          maxEmotion = 'happy';
          maxConfidence = expressions.happy;
        }
        
        if (expressions.sad > maxConfidence) {
          maxEmotion = 'sad';
          maxConfidence = expressions.sad;
        }
        
        // Check for sleepiness using eye aspect ratio (simplified)
        const landmarks = detections.landmarks;
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        
        // Calculate average eye height and width
        const getEyeAspectRatio = (eye: faceapi.Point[]) => {
          const height = Math.abs(eye[1].y - eye[5].y);
          const width = Math.abs(eye[0].x - eye[3].x);
          return height / width;
        };
        
        const leftEAR = getEyeAspectRatio(leftEye);
        const rightEAR = getEyeAspectRatio(rightEye);
        const avgEAR = (leftEAR + rightEAR) / 2;
        
        // Low eye aspect ratio indicates closed eyes (sleepiness)
        if (avgEAR < 0.2) {
          maxEmotion = 'sleepy';
          maxConfidence = 0.8;
        }
        
        // High attention with neutral expression might indicate focus
        if (maxEmotion === 'neutral' && avgEAR > 0.25) {
          maxEmotion = 'focused';
          maxConfidence = 0.7;
        }
        
        // Update the state with detected emotion
        setCurrentEmotion(maxEmotion);
        setConfidenceLevel(maxConfidence);
        
        // Call the callback with detected emotion
        if (onEmotionDetected) {
          onEmotionDetected(maxEmotion, maxConfidence);
        }
      }
    } catch (err) {
      console.error('Error capturing emotion:', err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Engagement Tracker</h3>
        
        {isCapturing ? (
          <button 
            onClick={stopCapturing}
            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm flex items-center"
          >
            <X className="h-4 w-4 mr-1" />
            Stop
          </button>
        ) : (
          <button 
            onClick={startCapturing}
            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm flex items-center"
            disabled={!modelsLoaded || loadingModels}
          >
            <Camera className="h-4 w-4 mr-1" />
            {loadingModels ? 'Loading Models...' : 'Start Tracking'}
          </button>
        )}
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
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
              style={{ maxHeight: "240px", display: isCapturing ? 'block' : 'none' }}
            />
            
            {!isCapturing && (
              <div className="bg-gray-100 rounded-lg flex items-center justify-center" style={{ height: "240px" }}>
                <div className="text-center text-gray-500">
                  <Camera className="h-8 w-8 mx-auto mb-2" />
                  <p>{loadingModels ? "Loading models..." : modelsLoaded ? "Click 'Start Tracking' to begin" : "Failed to load models"}</p>
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
      
      {/* Hidden canvas for processing */}
      <canvas 
        ref={canvasRef}
        className="hidden"
      />
      
      <div className="mt-4 text-center text-xs text-gray-500">
        <p>Facial data is processed locally and is not stored permanently.</p>
      </div>
    </div>
  );
};

export default SimpleFacialTracker;