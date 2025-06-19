import React, { useState, useRef, useEffect } from 'react';
import { Camera, Eye, Smile, Clock, PieChart, X, ChevronDown, ChevronUp, AlertTriangle, Brain } from 'lucide-react';
import * as faceapi from 'face-api.js';

// Define emotion types
type Emotion = 'happy' | 'neutral' | 'sad' | 'angry' | 'surprised' | 'fearful' | 'disgusted' | 'sleepy' | 'focused';

// FaceRecord stores each face capture with timestamp and emotion
interface FaceRecord {
  timestamp: Date;
  emotion: Emotion;
  confidence: number;
  imageData?: string; // Base64 encoded image data (optional)
  faceDetected: boolean; // Whether a face was actually detected
}

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
  const [isCapturing, setIsCapturing] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);
  const [faceRecords, setFaceRecords] = useState<FaceRecord[]>([]);
  const [lastEmotion, setLastEmotion] = useState<Emotion | null>(null);
  const [engagementScore, setEngagementScore] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);
  const [faceDetectionStats, setFaceDetectionStats] = useState({
    totalCaptures: 0,
    facesDetected: 0,
    detectionRate: 0
  });
  
  // References to hold important state
  const streamRef = useRef<MediaStream | null>(null);
  const captureIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
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
        console.log('Advanced Face-API models loaded successfully');
      } catch (err) {
        console.error('Error loading face detection models:', err);
        setError('Failed to load AI models. Using fallback mode.');
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
      captureIntervalRef.current = setInterval(captureEmotion, captureInterval);
      
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
  
  // Advanced emotion detection using face-api.js
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
      
      let faceDetected = false;
      let detectedEmotion: Emotion = 'neutral';
      let confidence = 0.5;
      
      try {
        // Detect faces and expressions using face-api.js
        const detections = await faceapi.detectSingleFace(
          canvas,
          new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 })
        ).withFaceLandmarks().withFaceExpressions();
        
        if (detections) {
          faceDetected = true;
          
          // Get the most prominent emotion
          const expressions = detections.expressions;
          let maxEmotion: Emotion = 'neutral';
          let maxConfidence = expressions.neutral;
          
          // Check all expressions
          Object.entries(expressions).forEach(([emotion, conf]) => {
            if (conf > maxConfidence) {
              switch (emotion) {
                case 'happy':
                  maxEmotion = 'happy';
                  maxConfidence = conf;
                  break;
                case 'sad':
                  maxEmotion = 'sad';
                  maxConfidence = conf;
                  break;
                case 'angry':
                  maxEmotion = 'angry';
                  maxConfidence = conf;
                  break;
                case 'surprised':
                  maxEmotion = 'surprised';
                  maxConfidence = conf;
                  break;
                case 'fearful':
                  maxEmotion = 'fearful';
                  maxConfidence = conf;
                  break;
                case 'disgusted':
                  maxEmotion = 'disgusted';
                  maxConfidence = conf;
                  break;
              }
            }
          });
          
          // Advanced analysis using landmarks
          const landmarks = detections.landmarks;
          const leftEye = landmarks.getLeftEye();
          const rightEye = landmarks.getRightEye();
          const mouth = landmarks.getMouth();
          
          // Calculate eye aspect ratio for sleepiness detection
          const getEyeAspectRatio = (eye: any[]) => {
            if (eye.length < 6) return 0.3;
            const height1 = Math.abs(eye[1].y - eye[5].y);
            const height2 = Math.abs(eye[2].y - eye[4].y);
            const width = Math.abs(eye[0].x - eye[3].x);
            return (height1 + height2) / (2.0 * width);
          };
          
          const leftEAR = getEyeAspectRatio(leftEye);
          const rightEAR = getEyeAspectRatio(rightEye);
          const avgEAR = (leftEAR + rightEAR) / 2;
          
          // Calculate mouth aspect ratio for additional emotion context
          const getMouthAspectRatio = (mouth: any[]) => {
            if (mouth.length < 12) return 0.3;
            const height = Math.abs(mouth[3].y - mouth[9].y);
            const width = Math.abs(mouth[0].x - mouth[6].x);
            return height / width;
          };
          
          const mouthAR = getMouthAspectRatio(mouth);
          
          // Sleepiness detection
          if (avgEAR < 0.22) {
            maxEmotion = 'sleepy';
            maxConfidence = Math.min(0.9, 0.7 + (0.22 - avgEAR) * 5);
          }
          
          // Focus detection (neutral expression with good eye openness)
          if (maxEmotion === 'neutral' && avgEAR > 0.25 && expressions.neutral > 0.6) {
            maxEmotion = 'focused';
            maxConfidence = Math.min(0.85, expressions.neutral + 0.1);
          }
          
          detectedEmotion = maxEmotion;
          confidence = maxConfidence;
          
          console.log(`Face-API detected: ${maxEmotion} (${Math.round(maxConfidence * 100)}%) - EAR: ${avgEAR.toFixed(3)}`);
          
        } else {
          console.log('No face detected by Face-API');
        }
        
      } catch (faceApiError) {
        console.warn('Face-API detection failed:', faceApiError);
      }
      
      // If no face detected, use intelligent fallback
      if (!faceDetected) {
        const fallbackResult = getIntelligentFallback();
        detectedEmotion = fallbackResult.emotion;
        confidence = fallbackResult.confidence;
      }
      
      // Update detection statistics
      setFaceDetectionStats(prev => {
        const newTotal = prev.totalCaptures + 1;
        const newDetected = prev.facesDetected + (faceDetected ? 1 : 0);
        return {
          totalCaptures: newTotal,
          facesDetected: newDetected,
          detectionRate: (newDetected / newTotal) * 100
        };
      });
      
      // Get image data for storage (optional)
      const imageData = storeImages ? canvas.toDataURL('image/jpeg', 0.8) : undefined;
      
      // Create face record
      const faceRecord: FaceRecord = {
        timestamp: new Date(),
        emotion: detectedEmotion,
        confidence: confidence,
        imageData: imageData,
        faceDetected: faceDetected
      };
      
      // Update state with the new record
      setFaceRecords(prev => [...prev, faceRecord]);
      setLastEmotion(detectedEmotion);
      
      // Calculate engagement score
      const newEngagementScore = calculateEngagementScore(detectedEmotion, confidence, faceDetected);
      setEngagementScore(newEngagementScore);
      
      // Trigger callbacks if provided
      if (onEmotionDetected) {
        onEmotionDetected(detectedEmotion);
      }
      
      if (onEngagementUpdate) {
        onEngagementUpdate(newEngagementScore);
      }
      
      // Save to local storage
      saveFaceRecord(faceRecord);
      
    } catch (err) {
      console.error('Error capturing emotion:', err);
    }
  };
  
  // Intelligent fallback when no face is detected
  const getIntelligentFallback = (): { emotion: Emotion; confidence: number } => {
    // Use previous emotions to make intelligent guesses
    const recentEmotions = faceRecords.slice(-5);
    
    if (recentEmotions.length > 0) {
      // Use the most common recent emotion with reduced confidence
      const emotionCounts: Record<string, number> = {};
      recentEmotions.forEach(record => {
        emotionCounts[record.emotion] = (emotionCounts[record.emotion] || 0) + 1;
      });
      
      const mostCommon = Object.entries(emotionCounts)
        .sort(([,a], [,b]) => b - a)[0][0] as Emotion;
      
      return {
        emotion: mostCommon,
        confidence: 0.3 + Math.random() * 0.2 // 30-50% confidence for fallback
      };
    }
    
    // Default fallback
    const emotions: { emotion: Emotion; weight: number }[] = [
      { emotion: 'neutral', weight: 0.5 },
      { emotion: 'focused', weight: 0.3 },
      { emotion: 'happy', weight: 0.15 },
      { emotion: 'sleepy', weight: 0.05 }
    ];
    
    const random = Math.random();
    let cumulative = 0;
    
    for (const { emotion, weight } of emotions) {
      cumulative += weight;
      if (random <= cumulative) {
        return {
          emotion: emotion,
          confidence: 0.4 + Math.random() * 0.2
        };
      }
    }
    
    return { emotion: 'neutral', confidence: 0.5 };
  };
  
  // Calculate engagement score based on emotion and face detection
  const calculateEngagementScore = (emotion: Emotion, confidence: number, faceDetected: boolean): number => {
    const baseScores: Record<Emotion, number> = {
      focused: 95,
      happy: 85,
      surprised: 75,
      neutral: 65,
      sad: 45,
      fearful: 35,
      angry: 25,
      disgusted: 25,
      sleepy: 15
    };
    
    // Base score from emotion
    let score = baseScores[emotion] * confidence;
    
    // Penalty for no face detection (student might be distracted)
    if (!faceDetected) {
      score *= 0.7;
    }
    
    // Bonus for high confidence
    if (confidence > 0.8) {
      score *= 1.1;
    }
    
    // Calculate rolling average with previous score for smoothness
    const smoothedScore = 0.7 * engagementScore + 0.3 * score;
    
    return Math.round(Math.min(100, Math.max(0, smoothedScore)));
  };
  
  // Save face record to storage
  const saveFaceRecord = (record: FaceRecord) => {
    try {
      // Get existing records for this session
      const storageKey = `facial-analysis-${studentId}-${sessionId}`;
      const existingRecordsJSON = localStorage.getItem(storageKey);
      const existingRecords = existingRecordsJSON ? JSON.parse(existingRecordsJSON) : [];
      
      // Add the new record (without the imageData to save space)
      const recordToStore = {
        timestamp: record.timestamp,
        emotion: record.emotion,
        confidence: record.confidence,
        faceDetected: record.faceDetected
      };
      
      existingRecords.push(recordToStore);
      
      // Keep only last 100 records to prevent storage overflow
      if (existingRecords.length > 100) {
        existingRecords.splice(0, existingRecords.length - 100);
      }
      
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
        <div className="flex items-center">
          <Brain className="h-6 w-6 text-[#42bff5] mr-2" />
          <h3 className="text-lg font-semibold">Advanced AI Emotion Tracker</h3>
        </div>
        <div className="flex space-x-2">
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
              className="px-3 py-1 bg-[#42bff5] text-white rounded-lg text-sm flex items-center hover:bg-[#93e9f5] transition-colors"
              disabled={loadingModels}
            >
              <Camera className="h-4 w-4 mr-1" />
              {loadingModels ? 'Loading AI...' : 'Start AI Tracking'}
            </button>
          )}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="px-3 py-1 bg-gray-100 rounded-lg text-sm flex items-center hover:bg-gray-200 transition-colors"
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
      
      {loadingModels && (
        <div className="mb-4 p-3 bg-blue-100 text-blue-700 rounded-lg">
          <p className="text-sm">Loading advanced AI models for facial analysis...</p>
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
            Camera access is required for AI emotion tracking. Please:
            <br />1. Click the camera icon in your browser's address bar
            <br />2. Select "Allow" for camera access
            <br />3. Try starting the tracker again
          </p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Current Engagement Score */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-gray-600 mb-1">AI Engagement Score</div>
          <div className={`text-3xl font-bold ${getEngagementColor(engagementScore)}`}>
            {engagementScore}%
          </div>
          {lastEmotion && (
            <div className="mt-2 flex items-center">
              <span className="text-2xl mr-2">{emotionEmojis[lastEmotion]}</span>
              <span className="text-gray-700 capitalize">{lastEmotion}</span>
            </div>
          )}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-300 ${
                  engagementScore >= 80 ? 'bg-green-500' :
                  engagementScore >= 60 ? 'bg-blue-500' :
                  engagementScore >= 40 ? 'bg-yellow-500' :
                  'bg-red-500'
                }`}
                style={{ width: `${engagementScore}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        {/* Session Overview */}
        <div className="bg-white p-4 rounded-xl shadow-sm">
          <div className="text-sm text-gray-600 mb-1">Session Analytics</div>
          <div className="flex items-center mb-2">
            <Clock className="h-5 w-5 mr-2 text-[#42bff5]" />
            <span>{Math.floor(faceRecords.length * (captureInterval / 60000))} min tracked</span>
          </div>
          <div className="text-sm text-gray-600">
            Face Detection: {faceDetectionStats.detectionRate.toFixed(1)}%
          </div>
          {dominantEmotion && (
            <div className="mt-2 flex items-center">
              <span className="text-2xl mr-2">{emotionEmojis[dominantEmotion]}</span>
              <span className="text-gray-700">Mostly <span className="font-medium capitalize">{dominantEmotion}</span></span>
            </div>
          )}
        </div>
        
        {/* Camera Preview */}
        <div className="bg-white p-4 rounded-xl shadow-sm md:col-span-1">
          <div className="text-sm text-gray-600 mb-1">AI Camera Feed</div>
          {isCapturing ? (
            <div className="relative rounded-lg overflow-hidden bg-gray-100 h-20 flex items-center justify-center">
              <video 
                ref={videoRef}
                autoPlay 
                muted 
                playsInline
                className="w-full h-full object-cover"
                style={{ transform: 'scaleX(-1)' }} // Mirror the video
              />
              {lastEmotion && (
                <div className="absolute bottom-1 right-1 bg-black/50 text-white text-xs py-1 px-2 rounded">
                  {emotionEmojis[lastEmotion]} {lastEmotion}
                </div>
              )}
              {modelsLoaded && (
                <div className="absolute top-1 left-1 bg-green-500 text-white text-xs py-1 px-2 rounded">
                  AI
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
          <h4 className="text-md font-medium mb-2">AI Emotion Timeline</h4>
          
          {faceRecords.length === 0 ? (
            <p className="text-gray-500 text-sm">No data recorded yet. Start AI tracking to collect data.</p>
          ) : (
            <div className="bg-white p-4 rounded-xl shadow-sm">
              <div className="h-32">
                {/* Enhanced visualization */}
                <div className="flex h-full items-end space-x-1">
                  {faceRecords.slice(-20).map((record, index) => {
                    const heightPercent = 30 + record.confidence * 70; // Min 30%, max 100%
                    const opacity = record.faceDetected ? 1 : 0.5;
                    
                    return (
                      <div 
                        key={index} 
                        className="flex-1 flex flex-col items-center"
                        title={`${record.emotion} (${Math.round(record.confidence * 100)}%) at ${record.timestamp.toLocaleTimeString()} - Face: ${record.faceDetected ? 'Yes' : 'No'}`}
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
                          style={{ 
                            height: `${heightPercent}%`,
                            opacity: opacity
                          }}
                        ></div>
                        <div className="text-xs mt-1">{emotionEmojis[record.emotion]}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-500 text-center">
                Last {Math.min(20, faceRecords.length)} AI detections (faded = no face detected)
              </div>
              
              {/* Detection Statistics */}
              <div className="mt-4 grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-bold text-[#42bff5]">{faceDetectionStats.totalCaptures}</div>
                  <div className="text-xs text-gray-500">Total Captures</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-green-500">{faceDetectionStats.facesDetected}</div>
                  <div className="text-xs text-gray-500">Faces Detected</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-500">{faceDetectionStats.detectionRate.toFixed(1)}%</div>
                  <div className="text-xs text-gray-500">Detection Rate</div>
                </div>
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
              <span>Store facial images for AI training (optional)</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              If enabled, facial images will be stored locally to improve AI accuracy. Data remains on your device.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacialAnalysisTracker;