import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, Smile, Clock, PieChart, X, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';
import * as faceapi from 'face-api.js';

// Define emotion types
type Emotion = 'happy' | 'neutral' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'sleepy' | 'focused';

// FaceRecord stores each face capture with timestamp and emotion
interface FaceRecord {
  timestamp: Date;
  emotion: Emotion;
  confidence: number;
  imageData?: string; // Base64 encoded image data (optional)
}

// Define a type for the interval to fix the NodeJS namespace error
type IntervalType = ReturnType<typeof setInterval>;

interface FacialAnalysisTrackerProps {
  studentId: string;
  sessionId?: string;
  captureInterval?: number; // in milliseconds, default will be 20000 (20 seconds)
  onEmotionDetected?: (emotion: Emotion) => void;
  onEngagementUpdate?: (engagementScore: number) => void;
}

const FacialAnalysisTracker: React.FC<FacialAnalysisTrackerProps> = ({
  studentId,
  sessionId = `session-${Date.now()}`,
  captureInterval = 20000,
  onEmotionDetected,
  onEngagementUpdate
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [faceRecords, setFaceRecords] = useState<FaceRecord[]>([]);
  const [lastEmotion, setLastEmotion] = useState<Emotion | null>(null);
  const [engagementScore, setEngagementScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // References to hold important state
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<IntervalType | null>(null);
  
  // Map emotions to emojis for display
  const emotionEmojis: Record<Emotion, string> = {
    happy: '😊',
    neutral: '😐',
    sad: '😢',
    angry: '😠',
    surprised: '😲',
    fearful: '😨',
    disgusted: '🤢',
    sleepy: '😴',
    focused: '🧐'
  };
  
  // Engagement score colors
  const getEngagementColor = (score: number): string => {
    if (score >= 80) return 'text-green-500';
    if (score >= 60) return 'text-blue-500';
    if (score >= 40) return 'text-yellow-500';
    if (score >= 20) return 'text-orange-500';
    return 'text-red-500';
  };

  // Load models at component mount
  useEffect(() => {
    const loadModels = async () => {
      try {
        // Set the path to the models directory
        const MODEL_URL = '/models';
        
        // Load the required models
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL)
        ]);
        
        setIsModelLoaded(true);
        console.log('Face-API models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load facial analysis models. Please refresh the page and try again.');
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
    if (!isModelLoaded) {
      setError('Models are still loading. Please wait...');
      return;
    }
    
    try {
      // Request camera permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: 640,
          height: 480,
          facingMode: 'user' // Use front camera
        } 
      });
      
      // Set the stream as source for video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setCameraPermission(true);
      }
      
      // Start capturing at intervals
      setIsCapturing(true);
      
      // Set interval for capturing emotions
      captureIntervalRef.current = setInterval(captureEmotion, captureInterval);
    } catch (err) {
      console.error('Error accessing camera:', err);
      setCameraPermission(false);
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
    if (!videoRef.current || !canvasRef.current || !isModelLoaded) {
      console.warn('Video or canvas reference not available, or models not loaded');
      return;
    }
    
    try {
      // Draw the current video frame on the canvas
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;
      
      ctx.drawImage(
        videoRef.current, 
        0, 0, 
        canvasRef.current.width, 
        canvasRef.current.height
      );
      
      // Get image data for analysis
      const imageData = canvasRef.current.toDataURL('image/jpeg', 0.8);
      
      // Detect faces and expressions
      const detections = await faceapi.detectSingleFace(
        canvasRef.current,
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
        
        if (expressions.angry > maxConfidence) {
          maxEmotion = 'angry';
          maxConfidence = expressions.angry;
        }
        
        if (expressions.surprised > maxConfidence) {
          maxEmotion = 'surprised';
          maxConfidence = expressions.surprised;
        }
        
        if (expressions.fearful > maxConfidence) {
          maxEmotion = 'fearful';
          maxConfidence = expressions.fearful;
        }
        
        if (expressions.disgusted > maxConfidence) {
          maxEmotion = 'disgusted';
          maxConfidence = expressions.disgusted;
        }
        
        // Extra custom analysis for sleepy/focused states
        // For simplicity, we're using some heuristics based on landmarks
        const landmarks = detections.landmarks;
        const eyePoints = [...landmarks.getLeftEye(), ...landmarks.getRightEye()];
        const eyeAspectRatio = calculateEyeAspectRatio(eyePoints);
        
        // Low eye aspect ratio could indicate sleepiness
        if (eyeAspectRatio < 0.2) {
          maxEmotion = 'sleepy';
          maxConfidence = 0.8; // Arbitrary confidence value
        }
        
        // High attention combined with neutral expression might indicate focus
        if (maxEmotion === 'neutral' && eyeAspectRatio > 0.25) {
          maxEmotion = 'focused';
          maxConfidence = 0.7; // Arbitrary confidence value
        }
        
        // Save the face record
        const faceRecord: FaceRecord = {
          timestamp: new Date(),
          emotion: maxEmotion,
          confidence: maxConfidence,
          imageData: storeImages ? imageData : undefined
        };
        
        // Update state with the new record
        setFaceRecords(prev => [...prev, faceRecord]);
        setLastEmotion(maxEmotion);
        
        // Calculate engagement score
        const newEngagementScore = calculateEngagementScore(maxEmotion, maxConfidence);
        setEngagementScore(newEngagementScore);
        
        // Trigger callbacks if provided
        if (onEmotionDetected) {
          onEmotionDetected(maxEmotion);
        }
        
        if (onEngagementUpdate) {
          onEngagementUpdate(newEngagementScore);
        }
        
        // Save to local storage or send to server
        saveFaceRecord(faceRecord);
      } else {
        console.log('No face detected in current frame');
      }
    } catch (err) {
      console.error('Error capturing emotion:', err);
    }
  };
  
  // Calculate eye aspect ratio to detect sleepiness
  const calculateEyeAspectRatio = (eyePoints: faceapi.Point[]): number => {
    // Simplified EAR calculation
    // In a real implementation, you'd use the proper anatomical landmarks
    const eyeHeight = Math.abs(eyePoints[1].y - eyePoints[5].y);
    const eyeWidth = Math.abs(eyePoints[0].x - eyePoints[3].x);
    
    return eyeHeight / eyeWidth;
  };
  
  // Calculate engagement score based on emotion
  const calculateEngagementScore = (emotion: Emotion, confidence: number): number => {
    const baseScores: Record<Emotion, number> = {
      focused: 90,
      happy: 80,
      surprised: 70,
      neutral: 60,
      sad: 40,
      fearful: 30,
      angry: 20,
      disgusted: 20,
      sleepy: 10
    };
    
    // Weight the score by confidence
    const score = baseScores[emotion] * confidence;
    
    // Calculate a rolling average with previous score for smoothness
    return Math.round(0.7 * engagementScore + 0.3 * score);
  };
  
  // Save face record to storage
  const saveFaceRecord = (record: FaceRecord) => {
    // In a real application, you would either:
    // 1. Send this data to your server
    // 2. Store it in local storage temporarily
    
    try {
      // Get existing records for this session
      const storageKey = `facial-analysis-${studentId}-${sessionId}`;
      const existingRecordsJSON = localStorage.getItem(storageKey);
      const existingRecords = existingRecordsJSON ? JSON.parse(existingRecordsJSON) : [];
      
      // Add the new record (without the imageData to save space)
      const recordToStore = {
        timestamp: record.timestamp,
        emotion: record.emotion,
        confidence: record.confidence
      };
      
      existingRecords.push(recordToStore);
      
      // Save back to local storage
      localStorage.setItem(storageKey, JSON.stringify(existingRecords));
    } catch (err) {
      console.error('Error saving face record:', err);
    }
  };
  
  // For privacy considerations, option to store images or not
  const [storeImages, setStoreImages] = useState(false);
  
  // Get a summary of emotions
  const getEmotionSummary = (): Record<Emotion, number> => {
    const summary: Record<Emotion, number> = {
      happy: 0,
      neutral: 0,
      sad: 0,
      angry: 0,
      surprised: 0,
      fearful: 0,
      disgusted: 0,
      sleepy: 0,
      focused: 0
    };
    
    faceRecords.forEach(record => {
      summary[record.emotion]++;
    });
    
    return summary;
  };
  
  // Calculate dominant emotion
  const getDominantEmotion = (): Emotion | null => {
    if (faceRecords.length === 0) return null;
    
    const summary = getEmotionSummary();
    let maxCount = 0;
    let dominantEmotion: Emotion | null = null;
    
    Object.entries(summary).forEach(([emotion, count]) => {
      if (count > maxCount) {
        maxCount = count;
        dominantEmotion = emotion as Emotion;
      }
    });
    
    return dominantEmotion;
  };
  
  const dominantEmotion = getDominantEmotion();
  
  return (
    <div className="glass-card rounded-2xl p-6 mt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Engagement Tracker</h3>
        <div className="flex space-x-2">
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
              className="px-3 py-1 bg-[#42bff5] text-white rounded-lg text-sm flex items-center"
              disabled={!isModelLoaded}
            >
              <Camera className="h-4 w-4 mr-1" />
              Start Tracking
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center"
          >
            {showDetails ? (
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {showDetails ? 'Hide Details' : 'Show Details'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Engagement Score */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Current Engagement</div>
          <div className={`text-3xl font-bold ${getEngagementColor(engagementScore)}`}>
            {engagementScore}%
          </div>
          {lastEmotion && (
            <div className="mt-2 flex items-center">
              <span className="text-2xl mr-2">{emotionEmojis[lastEmotion]}</span>
              <span className="text-gray-700 capitalize">{lastEmotion}</span>
            </div>
          )}
        </div>
        
        {/* Session Overview */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Session Overview</div>
          <div className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-[#42bff5]" />
            <span>{Math.floor(faceRecords.length * (captureInterval / 60000))} minutes tracked</span>
          </div>
          {dominantEmotion && (
            <div className="mt-2 flex items-center">
              <span className="text-2xl mr-2">{emotionEmojis[dominantEmotion]}</span>
              <span className="text-gray-700">Mostly <span className="font-medium capitalize">{dominantEmotion}</span></span>
            </div>
          )}
        </div>
        
        {/* Visualization */}
        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-1">
          <div className="text-sm text-gray-600 mb-1">Camera Preview</div>
          {isCapturing ? (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 h-20 flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
              {lastEmotion && (
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs py-1 px-2 rounded">
                  {emotionEmojis[lastEmotion]} {lastEmotion}
                </div>
              )}
            </div>
          ) : (
            <div className="h-20 flex items-center justify-center bg-gray-100 rounded-lg">
              <Camera className="h-8 w-8 text-gray-400" />
            </div>
          )}
        </div>
      </div>
      
      {/* Hidden canvas for processing */}
      <canvas 
        ref={canvasRef}
        width="640"
        height="480"
        className="hidden"
      />
      
      {/* Details Section */}
      {showDetails && (
        <div className="mt-6">
          <h4 className="text-md font-medium mb-2">Emotion Timeline</h4>
          
          {faceRecords.length === 0 ? (
            <p className="text-gray-500 text-sm">No data recorded yet. Start tracking to collect data.</p>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="h-32">
                {/* Simple visualization - in a real app, use a charting library */}
                <div className="flex h-full items-end space-x-1">
                  {faceRecords.slice(-20).map((record, index) => {
                    const heightPercent = 30 + record.confidence * 70; // Min 30%, max 100%
                    
                    return (
                      <div 
                        key={index} 
                        className="flex-1 flex flex-col items-center"
                        title={`${record.emotion} (${Math.round(record.confidence * 100)}%) at ${record.timestamp.toLocaleTimeString()}`}
                      >
                        <div 
                          className={`w-full rounded-t-sm ${
                            record.emotion === 'happy' || record.emotion === 'focused' 
                              ? 'bg-green-400' 
                              : record.emotion === 'neutral' 
                                ? 'bg-blue-400'
                                : record.emotion === 'sleepy'
                                  ? 'bg-red-400'
                                  : 'bg-yellow-400'
                          }`}
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                        <div className="text-xs mt-1">{emotionEmojis[record.emotion]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Last {Math.min(20, faceRecords.length)} recordings (most recent on right)
              </div>
            </div>
          )}
          
          {/* Privacy Settings */}
          <div className="mt-4">
            <label className="flex items-center space-x-2 text-sm">
              <input 
                type="checkbox" 
                checked={storeImages} 
                onChange={() => setStoreImages(!storeImages)}
                className="rounded text-[#42bff5]"
              />
              <span>Store facial images (for tutor review)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If enabled, facial images will be stored along with emotion data. This can help tutors better understand your engagement patterns.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacialAnalysisTracker;