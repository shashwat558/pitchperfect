'use client'

import { PauseIcon, PlayIcon, Trash, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import {FaceDetector, FaceLandmarker, FilesetResolver} from "@mediapipe/tasks-vision";

type RecordingProps  = {
  options?:{
    frameRate: number,
    audioBitsPerSecond: number,
    videoBitsPerSecond: number,
    audio: boolean
  }
}

enum State {
  Ready="ready",
  Recording = "recording",
  pause = "pause",
  Stopped = "stopped",
  CountDown = "ready.countdown",
  
}

const options = {
  mimeType: "video/mp4",
  frameRate: 60,
  audioBitsPerSecond: 2_500_000,
  videoBitsPerSecond: 2_500_000,
  audio: true,
}

export function Recorder({duration}: {duration: number}) {
   
  console.log(duration)
  const [recordingState, setRecordingState] = useState<State>(State.Ready);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder>(null);
  const chunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(3);
  const [hasConsent, setHasConsent] = useState(false);
  const [faceDetector, setFaceDetector] = useState<FaceLandmarker | null>(null);
  const [detectionRunning, setDetectionRunning] = useState(false);
  



  console.log(recordingState)

 

  useEffect(() => {
    const initializeFaceDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        )

        const FaceLandmarkerInstance = await FaceLandmarker.createFromOptions(
          vision,
          {
            baseOptions: {
              modelAssetPath: "/models/blaze_face_short_range.tflite",
              delegate: "GPU",


            },
            runningMode: 'VIDEO',
            numFaces: 1
            
            
          }
        )
        setFaceDetector(FaceLandmarkerInstance);
        console.log("Face landmarker initiated",FaceLandmarkerInstance)
        console.log("Face detector initialized")
      } catch (error) {
        console.error("Error initializing FaceDetector", error)
        
      }
    }
    initializeFaceDetector();
  },[])
  useEffect(() => {
    if(faceDetector){
    const consent = async () => {
      if(recordingState === State.Ready){
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio,
          video: {
            frameRate: options.frameRate
          }
        })
        
        streamRef.current = mediaStream
        setHasConsent(true)
        setDetectionRunning(true)
        if(videoRef.current && streamRef.current){
          videoRef.current.srcObject = streamRef.current;
          videoRef.current.play()
        }
      }
    }

    consent()
  }
  }, [recordingState, faceDetector])

  const handleStartRecording = async () => {  
        
        await countdown()

        const recorder = new MediaRecorder(streamRef.current!, {
          mimeType: options.mimeType,
          audioBitsPerSecond: options.audioBitsPerSecond,
          videoBitsPerSecond: options.videoBitsPerSecond
        })

        recorderRef.current = recorder;
        chunks.current = [];

        recorder.ondataavailable = (e) => {
          if(e.data.size > 0){
            chunks.current.push(e.data)
          }
        };

        recorder.onstop = handleStop
        recorder.onpause = handlePause

        recorder.start();
        setRecordingState(State.Recording);
        console.log("mediaRecorder Started");


        
    }
  

  const handleStop = () => {
    if(recordingState === State.Recording){
      recorderRef.current?.stop();
    }
    streamRef.current?.getTracks().forEach(track => track.stop())
    const blob = new Blob(chunks.current, {type: options.mimeType});
    const url = URL.createObjectURL(blob);
    setMediaUrl(url);
    setRecordingState(State.Stopped);
  }

  const handlePause = () => {
    if(recordingState === State.Recording){
      recorderRef.current?.pause();
      setRecordingState(State.pause);
    }
    if(recordingState === State.pause){
      recorderRef.current?.resume();
      setRecordingState(State.Recording)
    }

    
  }

  const deleteMedia = () => {
    chunks.current = [];
    videoRef.current = null;

    recorderRef.current?.stop()
    setMediaUrl(null);
    setRecordingState(State.Ready)
    
  }

  const detect = async () => {
    if(!faceDetector || !videoRef.current || !detectionRunning){
      console.log("Detection not happening");
      return;
    };

    if(
      videoRef.current.width === 0 ||
      videoRef.current.videoWidth === 0
    ) {
      console.log("Invalid video dimensions.");
      return;

    }

    const result = faceDetector.detectForVideo(videoRef.current, performance.now());
    if(result.faceLandmarks && result.faceLandmarks.length > 0){
      result.faceLandmarks.forEach(landmarks => {
        console.log("Detected Landmarks:", landmarks);
      })
    } else {
      console.log("No landmark detected in this frame.");
    }

    if(recordingState === State.Recording){
      requestAnimationFrame(detect)
    }

  }

  function countdown() {
  setSeconds(3);
  setRecordingState(State.CountDown);

  return new Promise<void>((resolve) => {
    let current = 3;

    const interval = setInterval(() => {
      current -= 1;
      setSeconds(current);

      if (current <= 0) {
        clearInterval(interval);
        setRecordingState(State.Ready);
        resolve();
      }
    }, 1000);
  });
}


  return (
    <div className="relative w-full h-full flex flex-col justify-start items-start gap-2">
      {recordingState === State.CountDown && (
          <div
            className="
              absolute inset-0 
              left-[70%] top-0
              flex items-center justify-center
              bg-black/40 backdrop-blur-sm
              text-8xl font-extrabold
              animate-pulse
            "
          >
            {seconds}
          </div>
        )}
      <div className="h-[85%] aspect-video border dark:border-white/20 border-black/20 corner-border p-0.5">
      <div className="cb-2"></div>
      <div className="cb-3"></div>
      
           
        {hasConsent && !mediaUrl && (
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            className="scale-x-[-1] w-full h-full object-cover"
          />
        )}
        {mediaUrl && <video controls autoPlay src={mediaUrl} className="w-full h-full object-cover"></video>}
        
         
       
        
        
      </div>
      <div className="flex justify-around items-center gap-3 relative">

        {recordingState === State.Ready ? (
          <button
            className="
              dark:bg-black 
              font-semibold 
              dark:text-white 
              border 
              dark:border-white/55 
              px-4 py-2 
              transition-all duration-150
              shadow-[5px_4px_0px_0px_rgba(66,68,90,1)]
              active:translate-x-0.5 active:translate-y-0.5
              active:shadow-[3px_2px_0px_0px_rgba(66,68,90,1)]
            "
            onClick={handleStartRecording}
            
          >
            Start
          </button>
        ) : (

         <div>
          <button
            className="
              bg-red-500 
              font-semibold 
              dark:text-white 
              border 
              dark:border-white/55 
              px-5 py-2 
              transition-all duration-150
              shadow-[5px_4px_0px_0px_rgba(66,68,90,1)]
              active:translate-x-0.5 active:translate-y-0.5
              active:shadow-[3px_2px_0px_0px_rgba(66,68,90,1)]
            "
            onClick={handleStop}
          >
            {<div className="w-4 h-4 bg-white"></div>}
          </button>
          <button
            className="
              dark:bg-black 
              font-semibold 
              dark:text-white 
              border 
              dark:border-white/55 
              px-5 py-2 
              transition-all duration-150
              shadow-[5px_4px_0px_0px_rgba(66,68,90,1)]
              active:translate-x-0.5 active:translate-y-0.5
              active:shadow-[3px_2px_0px_0px_rgba(66,68,90,1)]
            "
            onClick={handlePause}
          >
            {recordingState === State.pause ?(<PlayIcon className="w-4 h-4"/>):(<PauseIcon className="w-4 h-4"/>) }
          </button>

          </div>
        )}


        



      {mediaUrl && <button  className="dark:bg-black flex items-center gap-1 dark:text-white border dark:border-white/55 px-4 py-2 transition-all duration-150 shadow-[5px_4px_0px_0px_rgba(66,68,90,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_2px_0px_0px_rgba(66,68,90,1)]" onClick={deleteMedia}>Delete <Trash2 className="font-light w-4 h-4"/></button>}

      </div>
    </div>

    
  )
}




