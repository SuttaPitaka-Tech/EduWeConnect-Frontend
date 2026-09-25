import React, { useState, useRef, useEffect } from 'react'
import {
  Phone,
  PhoneOff,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Share2,
  Grid3X3,
  LayoutGrid,
  PlusSquare,
  MoreHorizontal,
  Maximize2,
  X,
} from 'lucide-react'
import type { CallState, ActiveCallData } from '../hooks/use-webrtc-call'
import { formatDuration } from '../hooks/use-webrtc-call'
import { getInitials } from '../chat-utils'
import { toast } from 'sonner'

interface CallModalProps {
  callState: CallState
  activeCall: ActiveCallData | null
  statusMessage: string
  callDuration: number
  isMuted: boolean
  remoteAudioRef: React.RefObject<HTMLAudioElement | null>
  remoteVideoRef?: React.RefObject<HTMLVideoElement | null>
  remoteStream?: MediaStream | null
  isCameraOn?: boolean
  isPeerCameraOn?: boolean
  localCameraStream?: MediaStream | null
  onToggleCamera?: () => void
  currentUser?: {
    name?: string
    role?: string
    organization?: string
  }
  onAccept: () => void
  onReject: () => void
  onEnd: () => void
  onToggleMute: () => void
}

export const CallModal: React.FC<CallModalProps> = ({
  callState,
  activeCall,
  statusMessage,
  callDuration,
  isMuted,
  remoteAudioRef,
  remoteVideoRef,
  remoteStream,
  isCameraOn = false,
  isPeerCameraOn = false,
  localCameraStream,
  onToggleCamera,
  currentUser,
  onAccept,
  onReject,
  onEnd,
  onToggleMute,
}) => {
  const [isMinimized, setIsMinimized] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [showDialpad, setShowDialpad] = useState(false)
  const [dialpadValue, setDialpadValue] = useState('')

  const localVideoRef = useRef<HTMLVideoElement | null>(null)

  // Attach local camera stream to local video element in PiP
  useEffect(() => {
    if (isCameraOn && localCameraStream && localVideoRef.current) {
      localVideoRef.current.srcObject = localCameraStream
      localVideoRef.current.play().catch((err) => {
        console.warn('Local video autoPlay:', err)
      })
    }
  }, [isCameraOn, localCameraStream])

  // Ensure remote stream is attached to remote video element
  useEffect(() => {
    if (remoteStream && remoteVideoRef?.current) {
      if (remoteVideoRef.current.srcObject !== remoteStream) {
        remoteVideoRef.current.srcObject = remoteStream
      }
      if (isPeerCameraOn) {
        remoteVideoRef.current.play().catch(() => {})
      }
    }
  }, [remoteStream, isPeerCameraOn, remoteVideoRef])

  // Ensure remote audio element is connected
  useEffect(() => {
    if (remoteStream && remoteAudioRef?.current) {
      if (remoteAudioRef.current.srcObject !== remoteStream) {
        remoteAudioRef.current.srcObject = remoteStream
      }
      remoteAudioRef.current.play().catch(() => {})
    }
  }, [remoteStream, remoteAudioRef])

  const toggleScreenShare = async () => {
    if (isSharing) {
      setIsSharing(false)
      toast.info('Screen share ended')
    } else {
      try {
        if (!navigator.mediaDevices?.getDisplayMedia) {
          toast.info('Screen share is not supported in this environment')
          return
        }
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true })
        setIsSharing(true)
        toast.success('Screen sharing active')
        stream.getVideoTracks()[0].onended = () => {
          setIsSharing(false)
        }
      } catch (err: any) {
        if (err.name !== 'NotAllowedError') {
          toast.error('Screen sharing error: ' + err.message)
        }
      }
    }
  }

  if (callState === 'idle' || !activeCall) {
    return null
  }

  const isIncoming = callState === 'incoming'
  const isConnected = callState === 'connected'
  const isCalling = callState === 'calling'
  const isPeerVideoVisible = isConnected && isPeerCameraOn
  const peerName = activeCall.peerName || 'Participant'
  const peerInitials = getInitials(peerName)
  const currentUserName = currentUser?.name || 'Me'
  const userInitials = getInitials(currentUserName)
  const organizationName = currentUser?.organization || 'EduWeConnect'

  // Minimized Floating Widget Mode (Allows browsing chat while remaining in call)
  if (isMinimized) {
    return (
      <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-4 duration-200">
        <audio ref={remoteAudioRef as any} autoPlay playsInline className="hidden" />
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-white border border-slate-200 shadow-2xl">
          {/* Traffic light restore */}
          <div className="flex items-center gap-1.5 mr-1">
            <button
              type="button"
              onClick={isIncoming ? onReject : onEnd}
              className="w-3 h-3 rounded-full bg-[#ff5f56] hover:opacity-80 transition-opacity cursor-pointer"
              title="End call"
            />
            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="w-3 h-3 rounded-full bg-[#27c93f] hover:opacity-80 transition-opacity cursor-pointer"
              title="Restore call window"
            />
          </div>

          {/* Peer Avatar & Info */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#d5f0e4] text-[#136449] font-bold text-xs flex items-center justify-center">
              {peerInitials}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">
                {peerName}
              </p>
              <p className="text-[11px] text-slate-500 font-mono">
                {isConnected ? formatDuration(callDuration) : statusMessage || 'Calling...'}
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-2">
            <button
              type="button"
              onClick={onToggleMute}
              className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                isMuted
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={isIncoming ? onReject : onEnd}
              className="p-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
              title="Leave call"
            >
              <PhoneOff className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsMinimized(false)}
              className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Expand window"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Full Microsoft Teams-style Desktop Window Calling UI
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/40 backdrop-blur-xs animate-in fade-in duration-200">
      {/* Hidden audio element for receiving WebRTC remote audio stream */}
      <audio ref={remoteAudioRef as any} autoPlay playsInline className="hidden" />

      {/* Main Teams-style Window */}
      <div
        className={`relative bg-white rounded-xl border border-slate-300 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 ${
          isMaximized
            ? 'w-full h-full max-w-none max-h-none rounded-none'
            : 'w-full max-w-4xl h-[560px] sm:h-[620px]'
        }`}
      >
        {/* 1. Window Title Bar (macOS / Teams header) */}
        <div className="h-10 bg-[#f3f4f6] border-b border-slate-200/90 px-3 sm:px-4 flex items-center justify-between select-none shrink-0">
          {/* Window Traffic Light Controls & Peer Name */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={isIncoming ? onReject : onEnd}
                className="w-3 h-3 rounded-full bg-[#ff5f56] border border-[#e0443e] hover:opacity-80 transition-opacity cursor-pointer"
                title="Close / End Call"
              />
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                className="w-3 h-3 rounded-full bg-[#ffbd2e] border border-[#dea123] hover:opacity-80 transition-opacity cursor-pointer"
                title="Minimize Call Window"
              />
              <button
                type="button"
                onClick={() => setIsMaximized((prev) => !prev)}
                className="w-3 h-3 rounded-full bg-[#27c93f] border border-[#1aab29] hover:opacity-80 transition-opacity cursor-pointer"
                title="Toggle Maximize"
              />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-700 truncate max-w-[200px] sm:max-w-xs">
              {peerName}
            </span>
          </div>

          {/* Right Window Meta: Organization & User Avatar */}
          <div className="flex items-center gap-2 text-slate-500 text-xs">
            <span className="hidden sm:inline font-normal text-slate-500 truncate max-w-[220px]">
              {organizationName}
            </span>
            <div
              className="w-6 h-6 rounded-full bg-emerald-100 border border-emerald-200 text-emerald-800 font-bold text-[11px] flex items-center justify-center shrink-0"
              title={currentUserName}
            >
              {userInitials}
            </div>
          </div>
        </div>

        {/* 2. Top Action Controls Bar (Teams Toolbar) */}
        <div className="h-14 sm:h-16 bg-[#fafafa] border-b border-slate-200 px-3 sm:px-5 flex items-center justify-between shrink-0 select-none">
          {/* Left: Call Timer */}
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-mono font-medium text-slate-700 tracking-wider">
              {isConnected ? formatDuration(callDuration) : '--:--'}
            </span>
            {isConnected && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            )}
          </div>

          {/* Right: Functional Action Buttons matching Microsoft Teams */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Dialpad */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDialpad((prev) => !prev)}
                className={`flex flex-col items-center justify-center px-2 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                  showDialpad ? 'bg-slate-200/80 text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                }`}
                title="Dialpad"
              >
                <Grid3X3 className="w-4 h-4 mb-0.5" />
                <span className="hidden sm:inline">Dialpad</span>
              </button>

              {/* Dialpad Popover */}
              {showDialpad && (
                <div className="absolute right-0 top-12 z-50 w-52 p-3 bg-white rounded-xl border border-slate-200 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="text-xs font-semibold text-slate-700">Dialpad</span>
                    <button
                      type="button"
                      onClick={() => setShowDialpad(false)}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="h-7 px-2 mb-2 bg-slate-50 border border-slate-200 rounded text-right text-xs font-mono font-bold flex items-center justify-end text-slate-800">
                    {dialpadValue || '0'}
                  </div>
                  <div className="grid grid-cols-3 gap-1.5 text-center">
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((k) => (
                      <button
                        key={k}
                        type="button"
                        onClick={() => setDialpadValue((prev) => (prev + k).slice(0, 15))}
                        className="py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 active:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors cursor-pointer"
                      >
                        {k}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* View */}
            <button
              type="button"
              onClick={() => toast.info('Layout set to Speaker Gallery')}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-md text-[11px] text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="View Layout"
            >
              <LayoutGrid className="w-4 h-4 mb-0.5" />
              <span className="hidden sm:inline">View</span>
            </button>

            {/* Apps */}
            <button
              type="button"
              onClick={() => toast.info('Meeting apps and notes')}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-md text-[11px] text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Apps"
            >
              <PlusSquare className="w-4 h-4 mb-0.5" />
              <span className="hidden sm:inline">Apps</span>
            </button>

            {/* More */}
            <button
              type="button"
              onClick={() => toast.info('Device settings: Default microphone & speaker')}
              className="flex flex-col items-center justify-center px-2 py-1 rounded-md text-[11px] text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="More Options"
            >
              <MoreHorizontal className="w-4 h-4 mb-0.5" />
              <span className="hidden sm:inline">More</span>
            </button>

            {/* Vertical Divider */}
            <div className="h-6 w-[1px] bg-slate-200 mx-0.5 sm:mx-1" />

            {/* Camera Toggle Button */}
            <button
              type="button"
              onClick={onToggleCamera}
              className={`flex flex-col items-center justify-center px-2 sm:px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                isCameraOn
                  ? 'bg-slate-200/90 text-slate-900 border border-slate-300'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isCameraOn ? 'Turn off camera' : 'Turn on camera'}
            >
              {isCameraOn ? (
                <Video className="w-4 h-4 mb-0.5 text-[#5B5FC7]" />
              ) : (
                <VideoOff className="w-4 h-4 mb-0.5" />
              )}
              <span className="hidden sm:inline">Camera</span>
            </button>

            {/* Mic (With border indicator like Teams) */}
            <button
              type="button"
              onClick={onToggleMute}
              className={`flex flex-col items-center justify-center px-2.5 sm:px-3 py-1 rounded-md text-[11px] border transition-all cursor-pointer ${
                isMuted
                  ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-2xs'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50 shadow-2xs'
              }`}
              title={isMuted ? 'Unmute microphone' : 'Mute microphone'}
            >
              {isMuted ? (
                <MicOff className="w-4 h-4 mb-0.5 text-rose-600" />
              ) : (
                <Mic className="w-4 h-4 mb-0.5 text-slate-800" />
              )}
              <span className="hidden sm:inline font-medium">{isMuted ? 'Muted' : 'Mic'}</span>
            </button>

            {/* Share Screen */}
            <button
              type="button"
              onClick={toggleScreenShare}
              className={`flex flex-col items-center justify-center px-2 sm:px-2.5 py-1 rounded-md text-[11px] transition-colors cursor-pointer ${
                isSharing
                  ? 'bg-indigo-50 text-[#5B5FC7] border border-indigo-200'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
              title={isSharing ? 'Stop sharing' : 'Share screen'}
            >
              <Share2 className="w-4 h-4 mb-0.5" />
              <span className="hidden sm:inline">{isSharing ? 'Sharing' : 'Share'}</span>
            </button>

            {/* Leave / End Call Button (Red Teams-style button) */}
            <button
              type="button"
              onClick={isIncoming ? onReject : onEnd}
              className="ml-1 sm:ml-2 px-3 sm:px-4 py-1.5 rounded-md bg-[#c4314b] hover:bg-[#a6253c] active:scale-95 text-white flex items-center gap-1.5 font-semibold text-xs transition-all shadow-xs cursor-pointer"
              title="Leave call"
            >
              <PhoneOff className="w-3.5 h-3.5" />
              <span>Leave</span>
            </button>
          </div>
        </div>

        {/* 3. Main Video / Canvas Stage */}
        <div className="flex-1 relative bg-gradient-to-b from-[#f8f9fa] to-[#eceef1] flex items-center justify-center overflow-hidden">
          {/* Remote Peer Video Stream (Full canvas when call is connected AND remote peer has camera on) */}
          <video
            ref={remoteVideoRef as any}
            autoPlay
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              isPeerVideoVisible ? 'opacity-100 block' : 'opacity-0 hidden'
            }`}
          />

          {/* Centered Large Avatar (shown whenever remote video is not active) */}
          {!isPeerVideoVisible && (
            <div className="flex flex-col items-center justify-center z-10 animate-in fade-in duration-200">
              <div className="relative mb-5">
                {/* Animated soft outer rings during calling */}
                {(isCalling || isIncoming) && (
                  <>
                    <span className="absolute -inset-4 rounded-full bg-emerald-200/50 animate-ping opacity-60 pointer-events-none" />
                    <span className="absolute -inset-2 rounded-full border border-emerald-300/80 animate-pulse pointer-events-none" />
                  </>
                )}

                {/* Large Soft Green Avatar matching Teams screenshot ("HS") */}
                <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full bg-[#d5f0e4] text-[#136449] font-medium text-4xl sm:text-5xl flex items-center justify-center shadow-sm select-none border-4 border-white/60">
                  {peerInitials}
                </div>
              </div>

              {/* Status with Phone Icon */}
              <div className="flex items-center gap-2 text-slate-700 select-none">
                <Phone className="w-4 h-4 text-slate-700 animate-pulse" />
                <span className="text-sm sm:text-base font-medium text-slate-800">
                  {isConnected
                    ? 'Connected'
                    : isIncoming
                    ? 'Incoming call...'
                    : isCalling
                    ? 'Calling...'
                    : statusMessage || 'Connecting...'}
                </span>
              </div>
            </div>
          )}

          {/* Incoming Call Answer/Decline Prompts (Always rendered and clickable during incoming call) */}
          {isIncoming && (
            <div className="absolute inset-x-0 bottom-16 sm:bottom-20 z-30 flex items-center justify-center gap-4 animate-in fade-in duration-200">
              <button
                type="button"
                onClick={onReject}
                className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
              >
                <PhoneOff className="w-4 h-4" />
                <span>Decline</span>
              </button>
              <button
                type="button"
                onClick={onAccept}
                className="px-6 py-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer animate-pulse"
              >
                <Phone className="w-4 h-4" />
                <span>Accept Call</span>
              </button>
            </div>
          )}

          {/* Bottom-Left Participant Name Tag */}
          <div className="absolute bottom-4 left-4 z-20">
            <div className="px-2.5 py-1 rounded bg-slate-700/80 backdrop-blur-xs text-white text-xs font-normal tracking-wide shadow-xs select-none max-w-[240px] truncate">
              {peerName}
            </div>
          </div>

          {/* Bottom-Right Floating Self Picture-in-Picture (PiP) Tile */}
          <div className="absolute bottom-4 right-4 z-20 w-36 h-24 sm:w-44 sm:h-28 rounded-lg bg-[#e9ecef]/90 border border-slate-300 shadow-md flex items-center justify-center overflow-hidden transition-all select-none">
            {/* Self Video Stream */}
            <video
              ref={localVideoRef}
              autoPlay
              muted
              playsInline
              className={`w-full h-full object-cover scale-x-[-1] bg-black ${isCameraOn ? 'block' : 'hidden'}`}
            />
            {!isCameraOn && (
              <div className="flex flex-col items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-[#d5f0e4] text-[#136449] font-bold text-sm flex items-center justify-center shadow-xs border border-white/80">
                  {userInitials}
                </div>
              </div>
            )}

            {/* Small 'You' Pill */}
            <div className="absolute bottom-1.5 right-1.5 px-1.5 py-0.5 rounded bg-slate-800/70 text-[10px] text-white font-medium pointer-events-none">
              You
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
