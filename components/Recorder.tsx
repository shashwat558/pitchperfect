/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { PauseIcon, PlayIcon, Trash, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { FaceDetector, FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type RecordingProps = {
  options?: {
    frameRate: number,
    audioBitsPerSecond: number,
    videoBitsPerSecond: number,
    audio: boolean
  }
}

enum State {
  Ready = "ready",
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

const getScore = (categories: any, name: any) => {
  return categories.find((c:any) => c.categoryName === name)?.score ?? 0;

}



export function Recorder({ duration, pitchId }: { duration: number, pitchId:string }) {

  console.log(duration)
  const [recordingState, setRecordingState] = useState<State>(State.Ready);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder>(null);
  const videoChunks = useRef<Blob[]>([]);
  const audioChunks = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(3);
  const [hasConsent, setHasConsent] = useState(false);
  const detectionRunningRef = useRef(false);
  const faceDetectorRef = useRef<FaceLandmarker | null>(null);
  const chunkStartTime = useRef<number>(0);
  const eyeContactSum = useRef<number>(0);
  const smileSum = useRef<number>(0);
  const eyeContactSamples = useRef<number>(0);
  const currentChunkIndex = useRef<number>(0);
  const pendingFacialData = useRef<any[]>([]);
  const form = new FormData();
  const audioRecorderRef = useRef<MediaRecorder | null>(null)




  console.log(recordingState)
  console.log("hi my name is tony soprano")


  useEffect(() => {
    const initializeFaceDetector = async () => {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );

        const detector = await FaceLandmarker.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "/mediapipe/face_landmarker.task",
            delegate: "GPU",
          },
          
          runningMode: "VIDEO",
          numFaces: 1,
          minFacePresenceConfidence: 0.7,
          outputFaceBlendshapes: true,
          outputFacialTransformationMatrixes: true,
          
        });

        faceDetectorRef.current = detector;
        console.log("Face detector initialized");
      } catch (error) {
        console.error("Error initializing FaceDetector", error);
      }
    };

    initializeFaceDetector();
  }, []);


  const detect = () => {
    const detector = faceDetectorRef.current;
    const video = videoRef.current;

    if (!detector || !video || !detectionRunningRef.current) return;

    if (video.videoWidth === 0 || video.videoHeight === 0) {
      return requestAnimationFrame(detect);
    }

    const now = performance.now();
    const result = detector.detectForVideo(video, now);

    const faceBlendShape = result.faceBlendshapes[0];

    const b = faceBlendShape.categories;

    const eyeLookOutLeft = getScore(b, "eyeLookOutLeft");
    const eyeLookOutRight = getScore(b, "eyeLookOutRight");
    const eyeLookUp = getScore(b, "eyeLookUpLeft") + getScore(b, "eyeLookUpRight");
    const eyeLookDown = getScore(b, "eyeLookDownLeft") + getScore(b, "eyeLookDownRight");

    const gazeDeviation =
    getScore(b, "eyeLookOutLeft")   + getScore(b, "eyeLookOutRight") +
    getScore(b, "eyeLookUpLeft")    + getScore(b, "eyeLookUpRight") +
    getScore(b, "eyeLookDownLeft")  + getScore(b, "eyeLookDownRight");


    const isLookingAtCamera = gazeDeviation < 0.65;

    const smileIntensity = getScore(b, "mouthSmileLeft") + getScore(b, "mouthSmileRight") * 0.5;

    // const rotation = result.facialTransformationMatrixes[0].data;



   

    if( now - chunkStartTime.current < 1000) {
      eyeContactSum.current += isLookingAtCamera ? 1 : 0
      smileSum.current+= smileIntensity;
      eyeContactSamples.current++
    }

    

    
    requestAnimationFrame(detect);
  };

  const startDetectionLoop = () => {
    if (!faceDetectorRef.current || !hasConsent) return;

    if (!detectionRunningRef.current) {
      detectionRunningRef.current = true;
      console.log("Detection loop started");
      requestAnimationFrame(detect);
    }
  };



  useEffect(() => {
    if (recordingState === State.Ready) {
      const getStream = async () => {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: options.audio,
            video: { frameRate: options.frameRate },
          });

          
          streamRef.current = mediaStream;
          setHasConsent(true);

          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;

            videoRef.current.onloadedmetadata = () => {
              videoRef.current?.play();
              console.log("Video metadata loaded, starting detection…");

            };
          }
        } catch (err) {
          console.error("Error accessing media devices:", err);
        }
      };

      getStream();
    }
  }, [recordingState]);




  useEffect(() => {
    if (faceDetectorRef.current && hasConsent && videoRef.current?.readyState === 4) {
      startDetectionLoop();
    }
  }, [hasConsent]);


  const handleStartRecording = async () => {

    await countdown()

    chunkStartTime.current = performance.now();
    currentChunkIndex.current = 0;
    eyeContactSamples.current = 0;
    smileSum.current = 0;
    eyeContactSum.current = 0;


    const videoRecorder = new MediaRecorder(streamRef.current!, {
      mimeType: options.mimeType,
      audioBitsPerSecond: options.audioBitsPerSecond,
      videoBitsPerSecond: options.videoBitsPerSecond
    });

    const audioStream = new MediaStream();
    audioStream.addTrack(streamRef.current!.getAudioTracks()[0]);

    const audioRecorder = new MediaRecorder(audioStream, {
      mimeType: 'audio/webm;codec=opus',
      audioBitsPerSecond: 64000
    });
    audioRecorderRef.current = audioRecorder 
    
    recorderRef.current = videoRecorder;
    videoChunks.current = [];
    audioChunks.current = [];

    startDetectionLoop();

    videoRecorder.ondataavailable = (e) => {
    if (e.data.size > 0) {
      videoChunks.current.push(e.data);
    }
  };

    audioRecorder.ondataavailable = async (e) => {
       if (!detectionRunningRef.current) return; 
      console.log("RECORDED MIME TYPE:", e.data.type);
      if (e.data.size > 0) {
        audioChunks.current.push(e.data)     
         

        const arrayBuffer =await e.data.arrayBuffer();

        const eyeContactPct = eyeContactSamples.current > 0 
        ? eyeContactSum.current / eyeContactSamples.current
        : 0
        console.log(eyeContactSamples.current)
        const avgSmile = eyeContactSamples.current > 0 
        ? smileSum.current / eyeContactSamples.current : 0

        form.append("pitchId", pitchId);
        form.append("eyeContact", String(eyeContactPct));
        form.append("smileIntensity", String(avgSmile));
        form.append("audio", new Blob([arrayBuffer], {type: e.data.type || "audi/webm"}));


        await fetch("/api/pitch/stream", {
          method: "POST",        
          body: form          
        })
        console.log(avgSmile, eyeContactPct)
        
        
        eyeContactSum.current = 0;
        smileSum.current = 0;
        eyeContactSamples.current = 0;
        chunkStartTime.current = performance.now()
        currentChunkIndex.current++ 
      }
    };

    videoRecorder.onstop = handleStop
    videoRecorder.onpause = handlePause
    audioRecorder.start(2000)
    videoRecorder.start(2000);

    setRecordingState(State.Recording);
    console.log("mediaRecorder Started");

  }


  const handleStop = () => {
    if (recordingState === State.Recording) {
      recorderRef.current?.stop();
    }
    detectionRunningRef.current = false
    audioRecorderRef.current?.stop();
    streamRef.current?.getTracks().forEach(track => track.stop());
    const blob = new Blob(videoChunks.current, { type: options.mimeType });
    const url = URL.createObjectURL(blob);
    setMediaUrl(url);
    setRecordingState(State.Stopped);
  }

  const handlePause = () => {
    if (recordingState === State.Recording) {
      recorderRef.current?.pause();
      audioRecorderRef.current?.pause();
      detectionRunningRef.current = false
      setRecordingState(State.pause);
    }
    if (recordingState === State.pause) {
      recorderRef.current?.resume();
      audioRecorderRef.current?.resume();
      detectionRunningRef.current = true
      setRecordingState(State.Recording)
    }


  }

  const deleteMedia = () => {
    videoChunks.current = [];
    videoRef.current = null;
    audioChunks.current = [];
    audioRecorderRef.current = null;

    recorderRef.current?.stop()
    setMediaUrl(null);

    setRecordingState(State.Ready)

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
              {recordingState === State.pause ? (<PlayIcon className="w-4 h-4" />) : (<PauseIcon className="w-4 h-4" />)}
            </button>

          </div>
        )}






        {mediaUrl && <button className="dark:bg-black flex items-center gap-1 dark:text-white border dark:border-white/55 px-4 py-2 transition-all duration-150 shadow-[5px_4px_0px_0px_rgba(66,68,90,1)] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[3px_2px_0px_0px_rgba(66,68,90,1)]" onClick={deleteMedia}>Delete <Trash2 className="font-light w-4 h-4" /></button>}

      </div>
    </div>


  )
}




