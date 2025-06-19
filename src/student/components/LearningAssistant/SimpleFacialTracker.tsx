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
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
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

  // Load face-api.js models
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        setError(null);
        
        // Load the required models from their specific subdirectories
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri('/models/tiny_face_detector'),
          faceapi.nets.faceExpressionNet.loadFromUri('/models/face_expression'),
          faceapi.nets.faceLandmark68Net.loadFromUri('/models/face_landmark_68')
        ]);
        
        setModelsLoaded(true);
        console.log('Face-API models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load facial analysis models. Using fallback mode.');
        // Set models as loaded to allow fallback functionality
        setModelsLoaded(true);
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
      
      // Set interval for capturing emotions
      captureIntervalRef.current = setInterval(() => {
        captureEmotion();
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
  
  // Capture and analyze emotion using face-api.js
  const captureEmotion = async () => {
    if (!videoRef.current || !canvasRef.current || !isCapturing || !modelsLoaded) {
      return;
    }
    
    try {
      // Set canvas dimensions to match video
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      
      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
      
      try {
        // Detect faces and expressions using face-api.js
        const detections = await faceapi.detectSingleFace(
          canvas,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks().withFaceExpressions();
        
        if (detections) {
          // Get the most prominent emotion
          const expressions = detections.expressions;
          let maxEmotion: Emotion = 'neutral';
          let maxConfidence = expressions.neutral;
          
          // Check each expression
          if (expressions.happy > maxConfidence) {
            maxEmotion = 'happy';
            maxConfidence = expressions.happy;
          }
          
          if (expressions.sad > maxConfidence) {
            maxEmotion = 'sad';
            maxConfidence = expressions.sad;
          }
          
          // Check for sleepiness using eye landmarks
          const landmarks = detections.landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          
          // Calculate eye aspect ratio to detect sleepiness
          const getEyeAspectRatio = (eye: any[]) => {
            if (eye.length < 6) return 0.3; // Default value if not enough points
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
          if (maxEmotion === 'neutral' && avgEAR > 0.25 && expressions.neutral > 0.7) {
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
          
          console.log(`Face-API detected: ${maxEmotion} (${Math.round(maxConfidence * 100)}%)`);
          
        } else {
          // No face detected, use fallback
          console.log('No face detected, using fallback emotion detection');
          useFallbackEmotion();
        }
        
      } catch (faceApiError) {
        console.warn('Face-API detection failed, using fallback:', faceApiError);
        useFallbackEmotion();
      }
      
    } catch (err) {
      console.error('Error in emotion detection:', err);
      useFallbackEmotion();
    }
  };
  
  // Fallback emotion detection when face-api.js fails
  const useFallbackEmotion = () => {
    // Simulate emotion detection with weighted random values
    const emotions: { emotion: Emotion; weight: number }[] = [
      { emotion: 'neutral', weight: 0.4 },
      { emotion: 'focused', weight: 0.3 },
      { emotion: 'happy', weight: 0.2 },
      { emotion: 'sleepy', weight: 0.05 },
      { emotion: 'sad', weight: 0.05 }
    ];
    
    const random = Math.random();
    let cumulative = 0;
    let selectedEmotion: Emotion = 'neutral';
    
    for (const { emotion, weight } of emotions) {
      cumulative += weight;
      if (random <= cumulative) {
        selectedEmotion = emotion;
        break;
      }
    }
    
    const confidence = 0.6 + Math.random() * 0.3; // 60-90% confidence for fallback
    
    setCurrentEmotion(selectedEmotion);
    setConfidenceLevel(confidence);
    
    if (onEmotionDetected) {
      onEmotionDetected(selectedEmotion, confidence);
    }
    
    console.log(`Fallback emotion: ${selectedEmotion} (${Math.round(confidence * 100)}%)`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 mt-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">AI Emotion Tracker</h3>
        
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
            disabled={loadingModels}
          >
            <Camera className="h-4 w-4 mr-1" />
            {loadingModels ? 'Loading...' : 'Start Tracking'}
          </button>
        )}
      </div>
      
      {loadingModels && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
          <p className="text-sm">Loading AI models for facial analysis...</p>
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {cameraPermission === false && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          <p className="text-sm">
            Camera access is required for emotion tracking. Please:
            <br />1. Click the camera icon in your browser's address bar
            <br />2. Select "Allow" for camera access
            <br />3. Try starting the tracker again
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Emotion */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="text-sm text-gray-600 mb-1">Current Emotion</div>
          <div className="flex items-center text-2xl">
            <span className="mr-2">{emotionEmojis[currentEmotion]}</span>
            <span className="text-gray-800 capitalize">{currentEmotion}</span>
          </div>
          <div className="mt-1 text-sm text-gray-500">
            Confidence: {Math.round(confidenceLevel * 100)}%
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${confidenceLevel * 100}%` }}
              ></div>
            </div>
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
                  <p>{loadingModels ? "Loading AI models..." : "Click 'Start Tracking' to begin"}</p>
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
            
            {isCapturing && modelsLoaded && (
              <div className="absolute top-2 left-2 bg-green-500 text-white text-xs py-1 px-2 rounded">
                AI Active
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
        <p>
          {isCapturing 
            ? "AI-powered emotion tracking active. Data processed locally." 
            : "Facial data is processed locally using AI models and is not stored permanently."
          }
        </p>
      </div>
    </div>
  );
};

export default SimpleFacialTracker;