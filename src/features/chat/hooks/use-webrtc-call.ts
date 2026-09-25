import { useState, useRef, useEffect, useCallback } from 'react'
import type { Socket } from 'socket.io-client'
import { toast } from 'sonner'

export type CallState = 'idle' | 'calling' | 'incoming' | 'connected' | 'ended'
export type CallMediaType = 'audio' | 'video'

export interface ActiveCallData {
  callId: string
  peerId: string
  peerName: string
  peerRole?: string
  peerAvatar?: string
  conversationId?: string
  callType: CallMediaType
  isCaller: boolean
}

interface UseWebRTCCallProps {
  socket: Socket | null
  currentUserId?: string
  currentUserName?: string
  currentUserRole?: string
}

const ICE_SERVERS: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },
    { urls: 'stun:stun3.l.google.com:19302' },
  ],
}

/**
 * Audio tone generator using Web Audio API (cross-browser, no missing mp3 assets)
 */
class TonePlayer {
  private ctx: AudioContext | null = null
  private timer: any = null

  private getContext() {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
      if (AudioCtx) this.ctx = new AudioCtx()
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  playOutgoingRinging() {
    this.stop()
    const ctx = this.getContext()
    if (!ctx) return

    const ring = () => {
      try {
        if (!this.ctx || this.ctx.state === 'closed') return
        const now = this.ctx.currentTime
        const osc1 = this.ctx.createOscillator()
        const osc2 = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc1.frequency.setValueAtTime(440, now) // US/Standard ring frequency 1
        osc2.frequency.setValueAtTime(480, now) // US/Standard ring frequency 2

        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.08, now + 0.05)
        gain.gain.setValueAtTime(0.08, now + 1.2)
        gain.gain.linearRampToValueAtTime(0, now + 1.3)

        osc1.connect(gain)
        osc2.connect(gain)
        gain.connect(this.ctx.destination)

        osc1.start(now)
        osc2.start(now)
        osc1.stop(now + 1.3)
        osc2.stop(now + 1.3)
      } catch (e) {}
    }

    ring()
    this.timer = setInterval(ring, 3000)
  }

  playIncomingRinging() {
    this.stop()
    const ctx = this.getContext()
    if (!ctx) return

    const chime = () => {
      try {
        if (!this.ctx || this.ctx.state === 'closed') return
        const now = this.ctx.currentTime
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()

        osc.type = 'sine'
        osc.frequency.setValueAtTime(659.25, now) // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2) // G5
        osc.frequency.setValueAtTime(987.77, now + 0.4) // B5

        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(0.12, now + 0.05)
        gain.gain.setValueAtTime(0.12, now + 0.8)
        gain.gain.linearRampToValueAtTime(0, now + 1.1)

        osc.connect(gain)
        gain.connect(this.ctx.destination)

        osc.start(now)
        osc.stop(now + 1.1)
      } catch (e) {}
    }

    chime()
    this.timer = setInterval(chime, 2500)
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}

/**
 * Safely retrieve the audio sender from RTCPeerConnection
 */
function getAudioSender(pc: RTCPeerConnection): RTCRtpSender | null {
  const transceivers = pc.getTransceivers()
  const at = transceivers.find(
    (t) => t.receiver?.track?.kind === 'audio' || t.sender?.track?.kind === 'audio',
  )
  if (at && at.sender) return at.sender
  return pc.getSenders().find((s) => s.track?.kind === 'audio') || null
}

/**
 * Safely retrieve the video sender from RTCPeerConnection transceivers
 */
function getVideoSender(pc: RTCPeerConnection): RTCRtpSender | null {
  const transceivers = pc.getTransceivers()
  const vt = transceivers.find(
    (t) => t.receiver?.track?.kind === 'video' || t.sender?.track?.kind === 'video',
  )
  if (vt && vt.sender) return vt.sender
  return pc.getSenders().find((s) => s.track?.kind === 'video') || null
}

export function useWebRTCCall({
  socket,
  currentUserId,
  currentUserName,
  currentUserRole,
}: UseWebRTCCallProps) {
  const [callState, setCallState] = useState<CallState>('idle')
  const [activeCall, setActiveCall] = useState<ActiveCallData | null>(null)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [callDuration, setCallDuration] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isCameraOn, setIsCameraOn] = useState<boolean>(false)
  const [isPeerCameraOn, setIsPeerCameraOn] = useState<boolean>(false)
  const [localCameraStream, setLocalCameraStream] = useState<MediaStream | null>(null)
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null)

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const localStreamRef = useRef<MediaStream | null>(null)
  const localCameraStreamRef = useRef<MediaStream | null>(null)
  const remoteStreamRef = useRef<MediaStream | null>(null)
  const remoteAudioRef = useRef<HTMLAudioElement | null>(null)
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null)
  const tonePlayerRef = useRef<TonePlayer>(new TonePlayer())
  const durationTimerRef = useRef<any>(null)
  const pendingCandidatesRef = useRef<RTCIceCandidateInit[]>([])
  const incomingOfferRef = useRef<any>(null)
  const callIdRef = useRef<string>('')

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      tonePlayerRef.current.stop()
      if (durationTimerRef.current) clearInterval(durationTimerRef.current)
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((t) => t.stop())
        localStreamRef.current = null
      }
      if (localCameraStreamRef.current) {
        localCameraStreamRef.current.getTracks().forEach((t) => t.stop())
        localCameraStreamRef.current = null
      }
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }
    }
  }, [])

  // Call duration counter
  useEffect(() => {
    if (callState === 'connected') {
      setCallDuration(0)
      durationTimerRef.current = setInterval(() => {
        setCallDuration((prev) => prev + 1)
      }, 1000)
    } else {
      if (durationTimerRef.current) {
        clearInterval(durationTimerRef.current)
        durationTimerRef.current = null
      }
    }
  }, [callState])

  /**
   * Safe teardown of peer connection and audio/video streams
   */
  const teardownCall = useCallback((finalStatus?: string, autoCloseMs = 1500) => {
    tonePlayerRef.current.stop()
    if (durationTimerRef.current) {
      clearInterval(durationTimerRef.current)
      durationTimerRef.current = null
    }

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop())
      localStreamRef.current = null
    }

    if (localCameraStreamRef.current) {
      localCameraStreamRef.current.getTracks().forEach((track) => track.stop())
      localCameraStreamRef.current = null
    }
    setLocalCameraStream(null)

    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    remoteStreamRef.current = null
    setRemoteStream(null)
    setIsCameraOn(false)
    setIsPeerCameraOn(false)
    pendingCandidatesRef.current = []
    incomingOfferRef.current = null
    callIdRef.current = ''
    setIsMuted(false)

    if (finalStatus) {
      setStatusMessage(finalStatus)
      setCallState('ended')
      setTimeout(() => {
        setCallState('idle')
        setActiveCall(null)
        setStatusMessage('')
        setCallDuration(0)
      }, autoCloseMs)
    } else {
      setCallState('idle')
      setActiveCall(null)
      setStatusMessage('')
      setCallDuration(0)
    }
  }, [])

  /**
   * Helper to create RTCPeerConnection and bind event listeners.
   * isCaller = true will add transceiver upfront to negotiate bidirectional video SDP.
   * isCaller = false (receiver) must NOT add transceiver before setRemoteDescription(offer).
   */
  const createPeerConnection = useCallback(
    (targetUserId: string, callId: string, isCaller: boolean) => {
      if (peerConnectionRef.current) {
        peerConnectionRef.current.close()
        peerConnectionRef.current = null
      }

      const pc = new RTCPeerConnection(ICE_SERVERS)

      // Add bidirectional video transceiver upfront ONLY for caller
      if (isCaller) {
        try {
          pc.addTransceiver('video', { direction: 'sendrecv' })
        } catch (err) {
          console.warn('[WebRTC] addTransceiver video error:', err)
        }
      }

      pc.onicecandidate = (event) => {
        if (event.candidate && socket) {
          const effectiveCallId = callIdRef.current || callId
          socket.emit('call_ice_candidate', {
            callId: effectiveCallId,
            targetUserId,
            candidate: event.candidate.toJSON(),
          })
        }
      }

      pc.ontrack = (event) => {
        const stream = event.streams[0] || new MediaStream([event.track])
        if (remoteStreamRef.current) {
          if (!remoteStreamRef.current.getTracks().includes(event.track)) {
            remoteStreamRef.current.addTrack(event.track)
          }
        } else {
          remoteStreamRef.current = stream
        }

        setRemoteStream(remoteStreamRef.current)

        if (remoteAudioRef.current) {
          remoteAudioRef.current.srcObject = remoteStreamRef.current
          remoteAudioRef.current
            .play()
            .catch((err) => console.warn('[WebRTC] Remote audio autoplay blocked:', err))
        }

        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current
          remoteVideoRef.current
            .play()
            .catch((err) => console.warn('[WebRTC] Remote video autoplay blocked:', err))
        }

        if (event.track.kind === 'video') {
          if (!event.track.muted && event.track.readyState === 'live') {
            setIsPeerCameraOn(true)
          }
          event.track.onmute = () => {
            setIsPeerCameraOn(false)
          }
          event.track.onunmute = () => {
            setIsPeerCameraOn(true)
            if (remoteVideoRef.current && remoteStreamRef.current) {
              remoteVideoRef.current.srcObject = remoteStreamRef.current
              remoteVideoRef.current.play().catch(() => {})
            }
          }
          event.track.onended = () => {
            setIsPeerCameraOn(false)
          }
        }
      }

      pc.onconnectionstatechange = () => {
        if (pc.connectionState === 'disconnected' || pc.connectionState === 'failed') {
          teardownCall('Connection lost')
        }
      }

      peerConnectionRef.current = pc
      return pc
    },
    [socket, teardownCall],
  )

  /**
   * START OUTGOING CALL
   */
  const startCall = useCallback(
    async ({
      targetUserId,
      targetUserName,
      targetUserRole,
      targetUserAvatar,
      conversationId,
      callType = 'audio',
    }: {
      targetUserId: string
      targetUserName: string
      targetUserRole?: string
      targetUserAvatar?: string
      conversationId?: string
      callType?: CallMediaType
    }) => {
      if (!socket) {
        toast.error('Cannot connect to calling service')
        return
      }

      try {
        setCallState('calling')
        setStatusMessage(`Calling ${targetUserName}...`)
        setActiveCall({
          callId: '',
          peerId: targetUserId,
          peerName: targetUserName,
          peerRole: targetUserRole,
          peerAvatar: targetUserAvatar,
          conversationId,
          callType,
          isCaller: true,
        })

        tonePlayerRef.current.playOutgoingRinging()

        // 1. Get user microphone stream
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
          },
          video: false,
        })
        localStreamRef.current = audioStream

        // 2. If video call, acquire camera immediately
        let videoStream: MediaStream | null = null
        if (callType === 'video') {
          try {
            videoStream = await navigator.mediaDevices.getUserMedia({
              video: {
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: 'user',
              },
              audio: false,
            })
            localCameraStreamRef.current = videoStream
            setLocalCameraStream(videoStream)
            setIsCameraOn(true)
          } catch (e) {
            console.warn('[WebRTC] Camera access failed on video call init:', e)
          }
        }

        // 3. Create RTCPeerConnection (as caller)
        const tempCallId = `call_${Date.now()}`
        const pc = createPeerConnection(targetUserId, tempCallId, true)

        // 4. Add audio track (m=audio line)
        audioStream.getAudioTracks().forEach((track) => pc.addTrack(track, audioStream))

        // 5. If video stream is available, attach to video sender
        if (videoStream && videoStream.getVideoTracks().length > 0) {
          const videoTrack = videoStream.getVideoTracks()[0]
          const videoSender = getVideoSender(pc)
          if (videoSender) {
            await videoSender.replaceTrack(videoTrack)
          }
        }

        // 6. Create offer
        const offer = await pc.createOffer()
        await pc.setLocalDescription(offer)

        // 7. Emit call_initiate
        socket.emit(
          'call_initiate',
          {
            targetUserId,
            targetUserName,
            targetUserRole,
            targetUserAvatar,
            conversationId,
            callType,
            callerId: currentUserId,
            callerName: currentUserName,
            callerRole: currentUserRole,
            offer,
          },
          (res: any) => {
            if (res?.error) {
              teardownCall(res.error, 2000)
            } else if (res?.callId) {
              callIdRef.current = res.callId
              setActiveCall((prev) => (prev ? { ...prev, callId: res.callId } : prev))
              setStatusMessage('Ringing...')
            }
          },
        )
      } catch (err: any) {
        console.error('[WebRTC] Start call error:', err)
        teardownCall(err.message || 'Microphone access denied', 2500)
        toast.error('Could not access microphone: ' + (err.message || 'Permission denied'))
      }
    },
    [socket, currentUserId, currentUserName, currentUserRole, createPeerConnection, teardownCall],
  )

  /**
   * ACCEPT INCOMING CALL
   */
  const acceptCall = useCallback(async () => {
    if (!socket || !activeCall || !incomingOfferRef.current) return

    try {
      tonePlayerRef.current.stop()
      setStatusMessage('Connecting...')

      // 1. Get microphone stream
      const audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
        video: false,
      })
      localStreamRef.current = audioStream

      // 2. If it is a video call (or user already turned camera on), get camera stream
      let videoStream = localCameraStreamRef.current
      if (activeCall.callType === 'video' && !videoStream) {
        try {
          videoStream = await navigator.mediaDevices.getUserMedia({
            video: {
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: 'user',
            },
            audio: false,
          })
          localCameraStreamRef.current = videoStream
          setLocalCameraStream(videoStream)
          setIsCameraOn(true)
        } catch (e) {
          console.warn('[WebRTC] Receiver camera access failed:', e)
        }
      }

      // 3. Create peer connection as CALLEE (isCaller = false, does NOT add transceiver upfront)
      const pc = createPeerConnection(activeCall.peerId, activeCall.callId, false)

      // 4. Set remote description from caller's offer FIRST!
      // This automatically constructs transceivers matching the caller's offer.
      await pc.setRemoteDescription(new RTCSessionDescription(incomingOfferRef.current))

      // 5. Attach receiver's audio track to audio transceiver
      const audioTrack = audioStream.getAudioTracks()[0]
      const audioSender = getAudioSender(pc)
      if (audioSender) {
        await audioSender.replaceTrack(audioTrack)
      } else {
        pc.addTrack(audioTrack, audioStream)
      }

      // 6. If receiver camera stream is available, attach to video transceiver
      if (videoStream && videoStream.getVideoTracks().length > 0) {
        const videoTrack = videoStream.getVideoTracks()[0]
        const videoSender = getVideoSender(pc)
        if (videoSender) {
          await videoSender.replaceTrack(videoTrack)
        }
      }

      // 7. Drain pending ICE candidates
      while (pendingCandidatesRef.current.length > 0) {
        const candidate = pendingCandidatesRef.current.shift()
        if (candidate) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(candidate))
          } catch (e) {
            console.warn('[WebRTC] addIceCandidate error:', e)
          }
        }
      }

      // 8. Create SDP answer
      const answer = await pc.createAnswer()
      await pc.setLocalDescription(answer)

      // 9. Emit call_accept
      socket.emit('call_accept', {
        callId: activeCall.callId,
        targetUserId: activeCall.peerId,
        answer,
      })

      setCallState('connected')
      setStatusMessage('Connected')

      // 10. If receiver camera is on, notify caller
      if (videoStream && videoStream.getVideoTracks().length > 0) {
        socket.emit('call_toggle_video', {
          callId: activeCall.callId,
          targetUserId: activeCall.peerId,
          isVideoOff: false,
        })
      }

      if (remoteVideoRef.current && remoteStreamRef.current) {
        remoteVideoRef.current.srcObject = remoteStreamRef.current
        remoteVideoRef.current.play().catch(() => {})
      }
      if (remoteAudioRef.current && remoteStreamRef.current) {
        remoteAudioRef.current.srcObject = remoteStreamRef.current
        remoteAudioRef.current.play().catch(() => {})
      }
    } catch (err: any) {
      console.error('[WebRTC] Accept call error:', err)
      teardownCall('Failed to connect call', 2000)
      toast.error('Could not accept call: ' + (err.message || 'Microphone error'))
    }
  }, [socket, activeCall, createPeerConnection, teardownCall])

  /**
   * REJECT INCOMING CALL
   */
  const rejectCall = useCallback(() => {
    if (socket && activeCall) {
      socket.emit('call_reject', {
        callId: activeCall.callId,
        targetUserId: activeCall.peerId,
        reason: 'declined',
      })
    }
    teardownCall('Call declined', 500)
  }, [socket, activeCall, teardownCall])

  /**
   * END ACTIVE CALL
   */
  const endCall = useCallback(() => {
    if (socket && activeCall) {
      const callId = activeCall.callId || callIdRef.current || ''
      socket.emit('call_end', {
        callId,
        targetUserId: activeCall.peerId,
        reason: activeCall.isCaller ? 'caller_cancelled' : 'receiver_hangup',
      })
    }
    teardownCall('Call ended', 1500)
  }, [socket, activeCall, teardownCall])

  /**
   * TOGGLE MICROPHONE MUTE
   */
  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsMuted(!audioTrack.enabled)

        const activeCallId = activeCall?.callId || callIdRef.current
        const targetUserId = activeCall?.peerId
        if (socket && activeCallId && targetUserId) {
          socket.emit('call_toggle_mute', {
            callId: activeCallId,
            targetUserId,
            isMuted: !audioTrack.enabled,
          })
        }
      }
    }
  }, [socket, activeCall])

  /**
   * TOGGLE CAMERA (TWO-WAY VIDEO TRANSMISSION)
   */
  const toggleCamera = useCallback(async () => {
    if (isCameraOn) {
      // 1. Turn off local camera tracks
      if (localCameraStreamRef.current) {
        localCameraStreamRef.current.getTracks().forEach((t) => t.stop())
        localCameraStreamRef.current = null
      }
      setLocalCameraStream(null)
      setIsCameraOn(false)

      // 2. Replace video track with null on RTCPeerConnection sender
      const pc = peerConnectionRef.current
      if (pc) {
        const videoSender = getVideoSender(pc)
        if (videoSender) {
          try {
            await videoSender.replaceTrack(null)
          } catch (e) {
            console.warn('[WebRTC] replaceTrack null error:', e)
          }
        }
      }

      // 3. Notify remote peer that video is turned off
      const activeCallId = activeCall?.callId || callIdRef.current
      const targetUserId = activeCall?.peerId
      if (socket && activeCallId && targetUserId) {
        socket.emit('call_toggle_video', {
          callId: activeCallId,
          targetUserId,
          isVideoOff: true,
        })
      }
      toast.info('Camera turned off')
    } else {
      // Turn on local camera
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user',
          },
          audio: false,
        })
        const videoTrack = stream.getVideoTracks()[0]
        localCameraStreamRef.current = stream
        setLocalCameraStream(stream)
        setIsCameraOn(true)

        const pc = peerConnectionRef.current
        if (pc) {
          const videoSender = getVideoSender(pc)
          if (videoSender) {
            await videoSender.replaceTrack(videoTrack)
          } else if (pc.signalingState === 'stable') {
            pc.addTrack(videoTrack, stream)
          }
        }

        // Notify remote peer that video is turned on
        const activeCallId = activeCall?.callId || callIdRef.current
        const targetUserId = activeCall?.peerId
        if (socket && activeCallId && targetUserId) {
          socket.emit('call_toggle_video', {
            callId: activeCallId,
            targetUserId,
            isVideoOff: false,
          })
        }
        toast.success('Camera turned on')
      } catch (err: any) {
        console.error('[WebRTC] Camera access error:', err)
        toast.error('Could not access camera: ' + (err.message || 'Permission denied'))
      }
    }
  }, [isCameraOn, socket, activeCall])

  /**
   * BIND SOCKET CALL EVENTS
   */
  useEffect(() => {
    if (!socket) return

    // INCOMING CALL
    const handleIncomingCall = (data: any) => {
      tonePlayerRef.current.playIncomingRinging()
      incomingOfferRef.current = data.offer
      callIdRef.current = data.callId || ''

      setActiveCall({
        callId: data.callId,
        peerId: data.callerId,
        peerName: data.callerName || 'Caller',
        peerRole: data.callerRole || 'User',
        peerAvatar: data.callerAvatar,
        conversationId: data.conversationId,
        callType: data.callType || 'audio',
        isCaller: false,
      })
      setStatusMessage(data.callType === 'video' ? 'Incoming video call...' : 'Incoming audio call...')
      setIsPeerCameraOn(false)
      setCallState('incoming')
    }

    // CALL ACCEPTED BY RECEIVER
    const handleCallAccepted = async (data: any) => {
      tonePlayerRef.current.stop()
      const pc = peerConnectionRef.current
      if (pc && data.answer) {
        try {
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer))

          // Process queued ICE candidates
          while (pendingCandidatesRef.current.length > 0) {
            const candidate = pendingCandidatesRef.current.shift()
            if (candidate) {
              try {
                await pc.addIceCandidate(new RTCIceCandidate(candidate))
              } catch (e) {
                console.warn('[WebRTC] addIceCandidate error:', e)
              }
            }
          }

          if (data.callId) {
            callIdRef.current = data.callId
            setActiveCall((prev) => (prev ? { ...prev, callId: data.callId } : prev))
          }

          setCallState('connected')
          setStatusMessage('Connected')

          // If caller has active camera, ensure video track is attached and notify receiver
          const localCam = localCameraStreamRef.current
          if (localCam && localCam.getVideoTracks().length > 0) {
            const videoTrack = localCam.getVideoTracks()[0]
            const videoSender = getVideoSender(pc)
            if (videoSender) {
              await videoSender.replaceTrack(videoTrack)
            }
            const activeCallId = data.callId || callIdRef.current || ''
            const peerId = data.recipientId || activeCall?.peerId
            if (socket && activeCallId && peerId) {
              socket.emit('call_toggle_video', {
                callId: activeCallId,
                targetUserId: peerId,
                isVideoOff: false,
              })
            }
          }

          if (remoteVideoRef.current && remoteStreamRef.current) {
            remoteVideoRef.current.srcObject = remoteStreamRef.current
            remoteVideoRef.current.play().catch(() => {})
          }
          if (remoteAudioRef.current && remoteStreamRef.current) {
            remoteAudioRef.current.srcObject = remoteStreamRef.current
            remoteAudioRef.current.play().catch(() => {})
          }
        } catch (err: any) {
          console.error('[WebRTC] Set remote answer error:', err)
        }
      }
    }

    // CALL REJECTED
    const handleCallRejected = () => {
      teardownCall('Call declined', 2000)
    }

    // CALL BUSY
    const handleCallBusy = () => {
      teardownCall('User is on another call', 2500)
    }

    // CALL NO ANSWER / TIMEOUT
    const handleCallNoAnswer = () => {
      teardownCall('No answer', 2000)
    }

    // CALL MISSED (FOR RECEIVER)
    const handleCallMissed = () => {
      teardownCall('Missed call', 2000)
    }

    // CALL ENDED BY OTHER PARTY
    const handleCallEnded = (data: any) => {
      const durText = data?.duration ? ` (${formatDuration(data.duration)})` : ''
      teardownCall(`Call ended${durText}`, 1800)
    }

    // ICE CANDIDATE RELAY
    const handleIceCandidate = async (data: any) => {
      const pc = peerConnectionRef.current
      if (data.candidate) {
        if (pc && pc.remoteDescription && pc.remoteDescription.type) {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          } catch (e) {
            console.warn('[WebRTC] Error adding ICE candidate:', e)
          }
        } else {
          pendingCandidatesRef.current.push(data.candidate)
        }
      }
    }

    // PEER MUTED / UNMUTED / VIDEO TOGGLED
    const handlePeerMediaToggle = (data: any) => {
      if (data.mediaType === 'audio') {
        toast.info(data.isEnabled ? 'Peer unmuted microphone' : 'Peer muted microphone')
      } else if (data.mediaType === 'video') {
        const isEnabled = Boolean(data.isEnabled)
        setIsPeerCameraOn(isEnabled)
        toast.info(isEnabled ? 'Peer turned on camera' : 'Peer turned off camera')

        if (isEnabled && remoteVideoRef.current && remoteStreamRef.current) {
          remoteVideoRef.current.srcObject = remoteStreamRef.current
          remoteVideoRef.current.play().catch(() => {})
        }
      }
    }

    socket.on('call_incoming', handleIncomingCall)
    socket.on('call_accepted', handleCallAccepted)
    socket.on('call_rejected', handleCallRejected)
    socket.on('call_busy', handleCallBusy)
    socket.on('call_no_answer', handleCallNoAnswer)
    socket.on('call_missed', handleCallMissed)
    socket.on('call_ended', handleCallEnded)
    socket.on('call_ice_candidate', handleIceCandidate)
    socket.on('call_peer_media_toggle', handlePeerMediaToggle)

    return () => {
      socket.off('call_incoming', handleIncomingCall)
      socket.off('call_accepted', handleCallAccepted)
      socket.off('call_rejected', handleCallRejected)
      socket.off('call_busy', handleCallBusy)
      socket.off('call_no_answer', handleCallNoAnswer)
      socket.off('call_missed', handleCallMissed)
      socket.off('call_ended', handleCallEnded)
      socket.off('call_ice_candidate', handleIceCandidate)
      socket.off('call_peer_media_toggle', handlePeerMediaToggle)
    }
  }, [socket, teardownCall])

  return {
    callState,
    activeCall,
    statusMessage,
    callDuration,
    isMuted,
    remoteAudioRef,
    remoteVideoRef,
    remoteStream,
    isCameraOn,
    isPeerCameraOn,
    localCameraStream,
    toggleCamera,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
  }
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
}
