'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Video, Square, Play, Pause, Trash2, Download } from 'lucide-react'

export function Recorder() {
  const [recordingType, setRecordingType] = useState<'audio' | 'video'>('audio')
  const [isRecording, setIsRecording] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [recordings, setRecordings] = useState<Array<{ id: string; blob: Blob; duration: number; type: 'audio' | 'video' }>>([])
  const [currentPlayingId, setCurrentPlayingId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const mediaRef = useRef<HTMLAudioElement | HTMLVideoElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const [recordingTime, setRecordingTime] = useState(0)

  const startRecording = async () => {
    try {
      const constraints = recordingType === 'video' 
        ? { audio: true, video: { width: 1280, height: 720 } }
        : { audio: true }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream
      chunksRef.current = []
      setRecordingTime(0)

      if (recordingType === 'video' && videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        chunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const mimeType = recordingType === 'video' ? 'video/webm' : 'audio/webm'
        const blob = new Blob(chunksRef.current, { type: mimeType })
        const id = Date.now().toString()
        const duration = recordingTime

        setRecordings((prev) => [
          { id, blob, duration, type: recordingType },
          ...prev,
        ])
        chunksRef.current = []

        if (videoRef.current) {
          videoRef.current.srcObject = null
        }
      }

      mediaRecorder.start()
      setIsRecording(true)

      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error('Error accessing media devices:', error)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      streamRef.current?.getTracks().forEach((track) => track.stop())
      setIsRecording(false)
      setIsPaused(false)
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const playRecording = (blob: Blob, id: string, type: 'audio' | 'video') => {
    if (mediaRef.current) {
      mediaRef.current.pause()
    }

    const url = URL.createObjectURL(blob)
    
    let media: HTMLAudioElement | HTMLVideoElement
    if (type === 'video') {
      media = document.createElement('video')
      media.controls = true
    } else {
      media = document.createElement('audio')
      media.controls = true
    }

    media.src = url
    mediaRef.current = media

    setCurrentPlayingId(id)
    setIsPlaying(true)

    media.onended = () => {
      setIsPlaying(false)
      setCurrentPlayingId(null)
      URL.revokeObjectURL(url)
    }

    media.play()
  }

  const stopPlayback = () => {
    if (mediaRef.current) {
      mediaRef.current.pause()
      mediaRef.current.currentTime = 0
      setIsPlaying(false)
      setCurrentPlayingId(null)
    }
  }

  const deleteRecording = (id: string) => {
    if (currentPlayingId === id) {
      stopPlayback()
    }
    setRecordings((prev) => prev.filter((r) => r.id !== id))
  }

  const downloadRecording = (blob: Blob, id: string, type: 'audio' | 'video') => {
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    const ext = type === 'video' ? 'webm' : 'webm'
    a.download = `recording-${id}.${ext}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex h-screen min-w-screen items-center justify-center dark:bg-[#0a1303] bg-[#f9fafb] font-sans">
      <div className="h-full w-[92.4%] border border-[#34412d] flex flex-col">
        <div className="border-b border-[#34412d] px-8 py-6">
          <h1 className="text-2xl font-semibold dark:text-[#f9fafb] text-[#0a1303]">
            Record
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Capture and manage your audio and video recordings
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-8 py-8">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="flex gap-3">
              <button
                onClick={() => !isRecording && setRecordingType('audio')}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  recordingType === 'audio'
                    ? 'dark:bg-[#34412d] bg-[#34412d] dark:text-[#f9fafb] text-[#f9fafb] border-[#34412d]'
                    : 'dark:bg-transparent bg-transparent dark:text-[#f9fafb] text-[#0a1303] border-[#34412d] dark:hover:bg-[#1a2818] hover:bg-white'
                } disabled:opacity-50`}
              >
                <Mic size={16} />
                Audio
              </button>
              <button
                onClick={() => !isRecording && setRecordingType('video')}
                disabled={isRecording}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
                  recordingType === 'video'
                    ? 'dark:bg-[#34412d] bg-[#34412d] dark:text-[#f9fafb] text-[#f9fafb] border-[#34412d]'
                    : 'dark:bg-transparent bg-transparent dark:text-[#f9fafb] text-[#0a1303] border-[#34412d] dark:hover:bg-[#1a2818] hover:bg-white'
                } disabled:opacity-50`}
              >
                <Video size={16} />
                Video
              </button>
            </div>

            <div className="space-y-4">
              <h2 className="text-lg font-semibold dark:text-[#f9fafb] text-[#0a1303]">
                New Recording
              </h2>

              <div className="dark:bg-[#1a2818] bg-white border border-[#34412d] rounded-lg p-6 space-y-6">
                {recordingType === 'video' && (
                  <div className="rounded-lg overflow-hidden dark:bg-black bg-black">
                    <video
                      ref={videoRef}
                      className="w-full aspect-video object-cover"
                      playsInline
                    />
                  </div>
                )}

                <div className="text-center">
                  <div className="text-4xl font-mono font-semibold dark:text-[#f9fafb] text-[#0a1303] mb-2">
                    {formatTime(recordingTime)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {isRecording ? `${recordingType === 'video' ? 'Recording' : 'Recording'} in progress...` : 'Ready to record'}
                  </div>
                </div>

                <div className="flex gap-3 justify-center">
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      className="flex items-center gap-2 px-6 py-3 dark:bg-[#34412d] bg-[#34412d] dark:text-[#f9fafb] text-[#f9fafb] rounded-lg hover:opacity-90 transition-opacity"
                    >
                      {recordingType === 'video' ? <Video size={18} /> : <Mic size={18} />}
                      Start {recordingType === 'video' ? 'Video' : 'Audio'}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="flex items-center gap-2 px-6 py-3 dark:bg-red-900 bg-red-600 dark:text-[#f9fafb] text-white rounded-lg hover:opacity-90 transition-opacity"
                    >
                      <Square size={18} />
                      Stop Recording
                    </button>
                  )}
                </div>
              </div>
            </div>

            {recordings.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold dark:text-[#f9fafb] text-[#0a1303]">
                  Recordings ({recordings.length})
                </h2>

                <div className="space-y-3">
                  {recordings.map((recording) => (
                    <div
                      key={recording.id}
                      className="dark:bg-[#1a2818] bg-white border border-[#34412d] rounded-lg p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <button
                          onClick={() =>
                            currentPlayingId === recording.id && isPlaying
                              ? stopPlayback()
                              : playRecording(recording.blob, recording.id, recording.type)
                          }
                          className="flex-shrink-0 p-2 rounded-full dark:hover:bg-[#2d3a24] hover:bg-gray-100 transition-colors"
                        >
                          {currentPlayingId === recording.id && isPlaying ? (
                            <Pause size={20} className="dark:text-[#f9fafb] text-[#0a1303]" />
                          ) : (
                            <Play size={20} className="dark:text-[#f9fafb] text-[#0a1303]" />
                          )}
                        </button>

                        <div className="flex-1">
                          <p className="text-sm font-medium dark:text-[#f9fafb] text-[#0a1303]">
                            {recording.type === 'video' ? '🎥' : '🎙️'} Recording {recordings.indexOf(recording) + 1}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {recording.type === 'video' ? 'Video' : 'Audio'} • Duration: {formatTime(recording.duration)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => downloadRecording(recording.blob, recording.id, recording.type)}
                          className="p-2 rounded-full dark:hover:bg-[#2d3a24] hover:bg-gray-100 transition-colors"
                          title="Download recording"
                        >
                          <Download
                            size={18}
                            className="dark:text-[#f9fafb] text-[#0a1303]"
                          />
                        </button>

                        <button
                          onClick={() => deleteRecording(recording.id)}
                          className="p-2 rounded-full dark:hover:bg-red-900 hover:bg-red-100 transition-colors"
                          title="Delete recording"
                        >
                          <Trash2 size={18} className="dark:text-red-400 text-red-600" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {recordings.length === 0 && !isRecording && (
              <div className="text-center py-12">
                <div className="text-muted-foreground">
                  <p className="text-sm">No recordings yet. Start recording to create one.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
