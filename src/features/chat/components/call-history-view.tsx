import React, { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Phone,
  PhoneIncoming,
  PhoneOutgoing,
  PhoneMissed,
  Video,
  Search,
  X,
  RotateCcw,
  MessageSquare,
  Clock,
  Calendar,
  Filter,
  ShieldCheck,
  Building2,
  GraduationCap,
  Briefcase,
} from 'lucide-react'
import { fetchCallHistoryApi, type CallHistoryItem } from '../api/chat.api'
import { getInitials } from '../chat-utils'
import { formatDuration } from '../hooks/use-webrtc-call'
import { normalizeRole } from '../chat-permissions'
import { toast } from 'sonner'

interface CallHistoryViewProps {
  currentUserId?: string
  onClose?: () => void
  onInitiateCall: (
    targetUserId: string,
    targetUserName: string,
    targetUserRole?: string,
    callType?: 'audio' | 'video',
  ) => void
  onOpenChat: (
    targetUserId: string,
    targetUserName: string,
    targetUserRole?: string,
  ) => void
}

type RoleFilter = 'all' | 'student' | 'superadmin' | 'organization' | 'staff'
type DirectionFilter = 'all' | 'incoming' | 'outgoing' | 'missed'

export const CallHistoryView: React.FC<CallHistoryViewProps> = ({
  currentUserId,
  onClose,
  onInitiateCall,
  onOpenChat,
}) => {
  const [calls, setCalls] = useState<CallHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all')
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all')

  const loadHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await fetchCallHistoryApi({ limit: 100 })
      setCalls(data?.calls || [])
    } catch (err: any) {
      console.error('[CallHistory] Failed to load history:', err)
      toast.error('Could not load call history')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadHistory()
  }, [loadHistory])

  // Compute call metadata relative to current user
  const processedCalls = useMemo(() => {
    const currentId = String(currentUserId || '').toLowerCase()

    return calls.map((c) => {
      const isCaller =
        String(c.caller_id || '').toLowerCase() === currentId ||
        (!c.receiver_id && !currentId)

      // Peer is the other participant
      const peerId = isCaller ? c.receiver_id : c.caller_id
      const peerName = isCaller ? c.receiver_name : c.caller_name
      const peerRole = isCaller ? c.receiver_role : c.caller_role
      const peerAvatar = isCaller ? c.receiver_avatar : c.caller_avatar

      const isMissed =
        c.status === 'missed' ||
        c.status === 'rejected' ||
        c.status === 'busy' ||
        c.status === 'failed' ||
        (c.duration_seconds === 0 && c.status !== 'ongoing')

      const direction: 'incoming' | 'outgoing' = isCaller ? 'outgoing' : 'incoming'

      return {
        ...c,
        isCaller,
        peerId,
        peerName: peerName || 'User',
        peerRole: (peerRole || 'student').toLowerCase(),
        peerAvatar,
        isMissed,
        direction,
      }
    })
  }, [calls, currentUserId])

  // Filter calls by search query, role, and direction
  const filteredCalls = useMemo(() => {
    return processedCalls.filter((c) => {
      // 1. Direction Filter
      if (directionFilter === 'incoming') {
        if (c.direction !== 'incoming') return false
      } else if (directionFilter === 'outgoing') {
        if (c.direction !== 'outgoing') return false
      } else if (directionFilter === 'missed') {
        if (!c.isMissed) return false
      }

      // 2. Role Filter using standardized normalizeRole
      if (roleFilter !== 'all') {
        const norm = normalizeRole(c.peerRole)
        if (roleFilter === 'student' && norm !== 'student') return false
        if (roleFilter === 'superadmin' && norm !== 'super_admin') return false
        if (roleFilter === 'organization' && norm !== 'institution_admin') return false
        if (roleFilter === 'staff' && norm !== 'staff') return false
      }

      // 3. Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const norm = normalizeRole(c.peerRole)
        const roleLabel =
          norm === 'super_admin'
            ? 'super admin'
            : norm === 'institution_admin'
            ? 'organization admin'
            : norm
        const matchesName = c.peerName.toLowerCase().includes(q)
        const matchesRole =
          c.peerRole.toLowerCase().includes(q) || roleLabel.includes(q)
        const matchesDate = new Date(c.created_at)
          .toLocaleDateString()
          .toLowerCase()
          .includes(q)
        return matchesName || matchesRole || matchesDate
      }

      return true
    })
  }, [processedCalls, directionFilter, roleFilter, searchQuery])

  // Quick statistics
  const stats = useMemo(() => {
    let incoming = 0
    let outgoing = 0
    let missed = 0

    processedCalls.forEach((c) => {
      if (c.isMissed) missed++
      else if (c.direction === 'incoming') incoming++
      else outgoing++
    })

    return { total: processedCalls.length, incoming, outgoing, missed }
  }, [processedCalls])

  const formatDateLabel = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      const now = new Date()
      const isToday = d.toDateString() === now.toDateString()

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const isYesterday = d.toDateString() === yesterday.toDateString()

      const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })

      if (isToday) return `Today, ${time}`
      if (isYesterday) return `Yesterday, ${time}`

      return `${d.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: d.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      })}, ${time}`
    } catch {
      return dateStr
    }
  }

  const getRoleBadgeStyle = (role: string) => {
    const norm = normalizeRole(role)
    if (norm === 'super_admin') {
      return {
        label: 'Super Admin',
        bg: 'bg-purple-50 text-purple-700 border-purple-200',
        icon: ShieldCheck,
      }
    }
    if (norm === 'institution_admin') {
      return {
        label: 'Organization Admin',
        bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
        icon: Building2,
      }
    }
    if (norm === 'staff') {
      return {
        label: 'Staff / Teacher',
        bg: 'bg-amber-50 text-amber-700 border-amber-200',
        icon: Briefcase,
      }
    }
    return {
      label: 'Student',
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      icon: GraduationCap,
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 overflow-hidden select-none">
      {/* 1. Header with Title & Summary Counters */}
      <div className="bg-white border-b border-slate-200/90 px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center shadow-xs">
            <Phone className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
                Call History
              </h2>
              <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                {stats.total} {stats.total === 1 ? 'Call' : 'Calls'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review and manage incoming, outgoing, and missed audio and video calls
            </p>
          </div>
        </div>

        {/* Top Actions: Refresh & Back to Chat */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={loadHistory}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors cursor-pointer disabled:opacity-50"
            title="Refresh Call History"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0B1F33] hover:bg-[#142f4c] text-white text-xs font-medium transition-colors cursor-pointer shadow-2xs"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Back to Chat</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Controls Bar: Search & Role / Direction Filters */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-6 py-3 flex flex-col gap-3 shrink-0">
        {/* Row 1: Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by participant name, role, date..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-9 h-9 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0B1F33] focus:ring-1 focus:ring-[#0B1F33] outline-hidden transition-all text-slate-800 placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Row 2: Role Filters & Direction Filter Pills */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Role Filters */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1 mr-1 shrink-0">
              <Filter className="w-3 h-3 text-slate-400" /> Role:
            </span>

            {[
              { id: 'all', label: 'All Roles' },
              { id: 'student', label: 'Students' },
              { id: 'organization', label: 'Organizations' },
              { id: 'superadmin', label: 'Super Admins' },
              { id: 'staff', label: 'Staff & Teachers' },
            ].map((rf) => (
              <button
                key={rf.id}
                type="button"
                onClick={() => setRoleFilter(rf.id as RoleFilter)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  roleFilter === rf.id
                    ? 'bg-[#0B1F33] text-white shadow-2xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {rf.label}
              </button>
            ))}
          </div>

          {/* Direction Filter Pills */}
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Type:
            </span>
            {[
              { id: 'all', label: 'All', count: stats.total },
              { id: 'incoming', label: 'Incoming', count: stats.incoming },
              { id: 'outgoing', label: 'Outgoing', count: stats.outgoing },
              { id: 'missed', label: 'Missed', count: stats.missed },
            ].map((df) => (
              <button
                key={df.id}
                type="button"
                onClick={() => setDirectionFilter(df.id as DirectionFilter)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                  directionFilter === df.id
                    ? 'bg-slate-200/90 text-slate-900 font-semibold'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span>{df.label}</span>
                <span className="text-[10px] font-mono opacity-80">({df.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Calls List Area */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-2.5">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <RotateCcw className="w-8 h-8 animate-spin text-slate-400 mb-2" />
            <p className="text-xs font-medium">Loading call records...</p>
          </div>
        ) : filteredCalls.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 mb-3">
              <Phone className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-800">
              {searchQuery || roleFilter !== 'all' || directionFilter !== 'all'
                ? 'No matching calls found'
                : 'No call history yet'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {searchQuery || roleFilter !== 'all' || directionFilter !== 'all'
                ? 'Try adjusting your search terms or clearing your role and type filters.'
                : 'When you initiate or receive voice and video calls through EduChat, your logs will appear here.'}
            </p>
            {(searchQuery || roleFilter !== 'all' || directionFilter !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('')
                  setRoleFilter('all')
                  setDirectionFilter('all')
                }}
                className="mt-4 px-3.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium cursor-pointer transition-colors shadow-2xs"
              >
                Reset All Filters
              </button>
            )}
          </div>
        ) : (
          filteredCalls.map((call) => {
            const roleBadge = getRoleBadgeStyle(call.peerRole)
            const RoleIcon = roleBadge.icon

            return (
              <div
                key={call.id}
                className="bg-white border border-slate-200 rounded-xl p-3.5 sm:p-4 hover:shadow-md hover:border-slate-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                {/* Left: Contact Info & Direction Icon */}
                <div className="flex items-center gap-3.5 min-w-0">
                  {/* Avatar with Direction Icon Badge */}
                  <div className="relative shrink-0">
                    <div className="w-11 h-11 rounded-full bg-[#d5f0e4] text-[#136449] font-bold text-sm flex items-center justify-center shadow-2xs border border-white">
                      {getInitials(call.peerName)}
                    </div>
                    {/* Small Call Direction Badge */}
                    <div
                      className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-2xs ${
                        call.isMissed
                          ? 'bg-rose-600 text-white'
                          : call.direction === 'incoming'
                          ? 'bg-emerald-600 text-white'
                          : 'bg-indigo-600 text-white'
                      }`}
                      title={
                        call.isMissed
                          ? 'Missed call'
                          : call.direction === 'incoming'
                          ? 'Incoming call'
                          : 'Outgoing call'
                      }
                    >
                      {call.isMissed ? (
                        <PhoneMissed className="w-2.5 h-2.5" />
                      ) : call.direction === 'incoming' ? (
                        <PhoneIncoming className="w-2.5 h-2.5" />
                      ) : (
                        <PhoneOutgoing className="w-2.5 h-2.5" />
                      )}
                    </div>
                  </div>

                  {/* Contact Name & Role Badge */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-semibold text-sm text-slate-800 truncate">
                        {call.peerName}
                      </h4>

                      {/* Role Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold border ${roleBadge.bg}`}
                      >
                        <RoleIcon className="w-3 h-3" />
                        <span>{roleBadge.label}</span>
                      </span>

                      {/* Audio vs Video Type Badge */}
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {call.call_type === 'video' ? (
                          <>
                            <Video className="w-2.5 h-2.5 text-indigo-600" />
                            <span>Video</span>
                          </>
                        ) : (
                          <>
                            <Phone className="w-2.5 h-2.5 text-slate-500" />
                            <span>Audio</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Subtitle: Date & Duration */}
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        {formatDateLabel(call.created_at)}
                      </span>

                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {call.isMissed ? (
                          <span className="text-rose-600 font-semibold font-sans">
                            {call.status === 'rejected'
                              ? 'Declined'
                              : call.status === 'busy'
                              ? 'User Busy'
                              : 'Missed Call'}
                          </span>
                        ) : (
                          <span>
                            Duration:{' '}
                            <strong className="text-slate-700">
                              {formatDuration(call.duration_seconds || 0)}
                            </strong>
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Quick Call & Message Actions */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100 w-full sm:w-auto justify-end">
                  {/* Start Voice Call */}
                  <button
                    type="button"
                    onClick={() =>
                      onInitiateCall(
                        call.peerId,
                        call.peerName,
                        call.peerRole,
                        'audio',
                      )
                    }
                    className="p-2 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                    title={`Audio call ${call.peerName}`}
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Call</span>
                  </button>

                  {/* Start Video Call */}
                  <button
                    type="button"
                    onClick={() =>
                      onInitiateCall(
                        call.peerId,
                        call.peerName,
                        call.peerRole,
                        'video',
                      )
                    }
                    className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                    title={`Video call ${call.peerName}`}
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Video</span>
                  </button>

                  {/* Message / Chat */}
                  <button
                    type="button"
                    onClick={() =>
                      onOpenChat(call.peerId, call.peerName, call.peerRole)
                    }
                    className="p-2 rounded-lg bg-slate-100 hover:bg-[#0B1F33] hover:text-white text-slate-700 text-xs font-medium transition-colors cursor-pointer shadow-2xs flex items-center gap-1"
                    title={`Open direct chat with ${call.peerName}`}
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="sm:hidden">Chat</span>
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
