'use client'

import { useRef, useState } from "react";

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
  Stopped = "stopped"
}

const options = {
  mimeType: "video/mp4",
  frameRate: 60,
  audioBitsPerSecond: 2_500_000,
  videoBitsPerSecond: 2_500_000,
  audio: true,
}

export function Recorder({duration}: {duration: number}) {

 
  const [recordingState, setRecordingState] = useState<State>(State.Ready);
  const videoRef = useRef<HTMLVideoElement>(null);
  const recorderRef = useRef<MediaRecorder>(null);
  const chunks = useRef<Blob[]>([]);
  const [mediaUrl, setMediaUrl] = useState("");
  let timer: number;

  const handleStartRecording = async () => {
    if(recordingState === "ready"){
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio, 
          video: {
            frameRate: options.frameRate,

          }  
        })
        if(videoRef.current){
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play()
        }

        const recorder = new MediaRecorder(mediaStream, {
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

        recorder.onstop = (e) => {
          const blob = new Blob(chunks.current, {type: "video/mp4"});
          const url = URL.createObjectURL(blob);
          setMediaUrl(url)
        }
        setRecordingState(State.Recording);
        console.log("mediaRecorder Started");


        
    }
  }


  




  return (
    
      <div className="h-[90%] aspect-video border dark:border-white/20 border-black/20 corner-border">
        <div className="cb-2"></div>
        <div className="cb-3"></div>

        <video ref={videoRef}></video>
        
      </div>

    
  )
}
