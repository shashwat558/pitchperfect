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
  const streamRef = useRef<MediaStream>(null);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  let timer: number;

  const handleStartRecording = async () => {
    if(recordingState === "ready"){
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          audio: options.audio, 
          video: {
            frameRate: options.frameRate,

          }  
        })
        streamRef.current = mediaStream
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

        recorder.onstop = handleStop

        recorder.start();
        setRecordingState(State.Recording);
        console.log("mediaRecorder Started");


        
    }
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

  const deleteMedia = () => {
    chunks.current = [];
    videoRef.current = null;

    recorderRef.current?.stop()
    setMediaUrl(null);
    setRecordingState(State.Ready)
    
  }


  




  return (
    
      <div className="h-[90%] aspect-video border dark:border-white/20 border-black/20 corner-border">
        <div className="cb-2"></div>
        <div className="cb-3"></div>
        {recordingState === State.Ready ? (<button onClick={handleStartRecording}>Start</button>): (<button onClick={handleStop}>Stop </button>)}
        {(recordingState === State.Ready || recordingState === State.Recording) && (
          <video ref={videoRef} autoPlay muted className="scale-x-[-1]"></video>
        )}
        {mediaUrl && <video autoPlay src={mediaUrl}></video>}
        {mediaUrl && <button onClick={deleteMedia}>delete</button>}
      </div>


    
  )
}
