import React, { useState, useMemo } from 'react'
import {
  Users,
  MessageSquare,
  Search,
  Globe,
  Lock,
  Check,
  Loader2,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogClose,
  Input,
  Button,
} from '@/components/ui'
import { toast } from 'sonner'
import type { ChatContact as ApiChatContact } from '../api/chat.api'
import { createGroupApi, createDirectChatApi } from '../api/chat.api'
import { getInitials, getAvatarStyle } from '../chat-utils'

interface NewChatDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contacts: ApiChatContact[]
  isLoadingContacts?: boolean
  onConversationCreated: (conversationId: string) => void
}

export const NewChatDialog: React.FC<NewChatDialogProps> = ({
  open,
  onOpenChange,
  contacts,
  isLoadingContacts,
  onConversationCreated,
}) => {
  const [tab, setTab] = useState<'direct' | 'group'>('direct')

  // Direct Chat search
  const [directSearch, setDirectSearch] = useState('')

  // Group creation state
  const [groupName, setGroupName] = useState('')
  const [groupTopic, setGroupTopic] = useState('')
  const [groupType, setGroupType] = useState<'public' | 'private'>('public')
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([])
  const [groupMemberSearch, setGroupMemberSearch] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Filter contacts for Direct Chat
  const filteredDirectContacts = useMemo(() => {
    if (!directSearch.trim()) return contacts
    const q = directSearch.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    )
  }, [contacts, directSearch])

  // Filter contacts for Group member selection
  const filteredGroupContacts = useMemo(() => {
    if (!groupMemberSearch.trim()) return contacts
    const q = groupMemberSearch.toLowerCase()
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.role.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
    )
  }, [contacts, groupMemberSearch])

  const toggleMember = (id: string) => {
    setSelectedMemberIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    )
  }

  // Handle direct message click
  const handleStartDirect = async (contact: ApiChatContact) => {
    setIsSubmitting(true)
    const toastId = toast.loading(`Opening chat with ${contact.name}...`)
    try {
      const res = await createDirectChatApi({
        recipient_id: contact.id || contact.userId,
        recipient_name: contact.name,
        recipient_role: contact.role,
      })
      toast.success(`Chat ready!`, { id: toastId })
      onOpenChange(false)
      onConversationCreated(res.id)
    } catch (err: any) {
      toast.error(err.message || 'Failed to start direct chat', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle group creation
  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!groupName.trim()) {
      toast.error('Please enter a group name')
      return
    }

    const cleanName = groupName
      .trim()
      .replace(/^#/, '')
      .toLowerCase()
      .replace(/\s+/g, '-')

    setIsSubmitting(true)
    const toastId = toast.loading('Creating group...')
    try {
      const created = await createGroupApi({
        name: cleanName,
        topic: groupTopic.trim() || undefined,
        is_private: groupType === 'private',
        member_ids: selectedMemberIds,
      })

      toast.success(`Group #${cleanName} created!`, { id: toastId })
      setGroupName('')
      setGroupTopic('')
      setSelectedMemberIds([])
      onOpenChange(false)
      onConversationCreated(created.id)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create group', { id: toastId })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        maxWidth="max-w-2xl"
        className="p-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl flex flex-col h-[600px] max-h-[90vh]"
      >
        <DialogClose onClose={() => onOpenChange(false)} />

        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 via-white to-slate-50 shrink-0">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-[#0B1F33] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              💬
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-800 tracking-tight">New Conversation</h2>
              <p className="text-xs text-slate-400">Message colleagues, teachers, students, or create a group channel</p>
            </div>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100/80 rounded-xl w-full">
            <button
              type="button"
              onClick={() => setTab('direct')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                tab === 'direct'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Direct Message</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('group')}
              className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                tab === 'group'
                  ? 'bg-white text-slate-800 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Create Channel / Group</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Direct Message (Contact list) */}
        {tab === 'direct' && (
          <div className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="p-3 border-b border-slate-100">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Search registered members by name, role, or email..."
                  value={directSearch}
                  onChange={(e) => setDirectSearch(e.target.value)}
                  className="pl-9 h-9 text-xs bg-slate-50 border-slate-200/90 rounded-xl focus:bg-white"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 sleek-scrollbar">
              {isLoadingContacts ? (
                <div className="p-8 text-center text-xs text-slate-400">Loading contacts...</div>
              ) : filteredDirectContacts.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-400">No members found matching your search.</div>
              ) : (
                filteredDirectContacts.map((contact) => {
                  const avatarStyle = getAvatarStyle(contact.role || contact.name)
                  return (
                    <button
                      key={contact.id || contact.userId}
                      type="button"
                      disabled={isSubmitting}
                      onClick={() => handleStartDirect(contact)}
                      className="w-full p-3.5 flex items-center justify-between gap-3 text-left hover:bg-slate-50 transition-colors cursor-pointer group disabled:opacity-50"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-[2px] rounded-full border-2 ${avatarStyle.ringBorder} shrink-0 transition-all`}>
                          <div
                            className={`w-9 h-9 rounded-full ${avatarStyle.bg} ${avatarStyle.text} font-semibold text-xs flex items-center justify-center select-none shadow-2xs`}
                          >
                            {getInitials(contact.name)}
                          </div>
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-[#0B1F33]">
                            {contact.name}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">{contact.email || contact.role}</p>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-md border capitalize shrink-0 ${avatarStyle.badge}`}
                      >
                        {contact.role}
                      </span>
                    </button>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Create Group / Channel */}
        {tab === 'group' && (
          <form onSubmit={handleCreateGroup} className="flex-1 flex flex-col min-h-0 bg-white">
            <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-4 sleek-scrollbar">
              {/* Group Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Channel Name *</span>
                  <span className="text-[11px] font-mono text-slate-400 font-normal">
                    #{groupName ? groupName.trim().replace(/^#/, '').toLowerCase().replace(/\s+/g, '-') : 'name'}
                  </span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm select-none">
                    #
                  </span>
                  <Input
                    required
                    placeholder="e.g. physics-revision"
                    value={groupName}
                    onChange={(e) => setGroupName(e.target.value)}
                    className="pl-8 h-9 text-xs sm:text-sm rounded-xl bg-slate-50 border-slate-200 focus:bg-white"
                  />
                </div>
              </div>

              {/* Topic */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Topic / Purpose (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Notes, schedules, and exam discussions..."
                  value={groupTopic}
                  onChange={(e) => setGroupTopic(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-800 focus:bg-white focus:outline-none resize-none transition-colors"
                />
              </div>

              {/* Privacy Radio */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Privacy Setting</label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setGroupType('public')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      groupType === 'public'
                        ? 'border-[#0B1F33] bg-blue-50/40 ring-1 ring-[#0B1F33]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Public</span>
                      <span className="text-[10px] text-slate-400 block">Anyone in organization</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setGroupType('private')}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      groupType === 'private'
                        ? 'border-[#0B1F33] bg-blue-50/40 ring-1 ring-[#0B1F33]'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <Lock className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-semibold text-slate-800 block">Private</span>
                      <span className="text-[10px] text-slate-400 block">Invited members only</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Add Members Selection */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700 flex items-center justify-between">
                  <span>Add Members ({selectedMemberIds.length} selected)</span>
                </label>
                <Input
                  type="text"
                  placeholder="Filter members..."
                  value={groupMemberSearch}
                  onChange={(e) => setGroupMemberSearch(e.target.value)}
                  className="h-8 text-xs bg-slate-50 border-slate-200 rounded-lg mb-1"
                />
                <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-xl divide-y divide-slate-100 p-1 sleek-scrollbar">
                  {filteredGroupContacts.map((c) => {
                    const isSelected = selectedMemberIds.includes(c.id || c.userId)
                    return (
                      <div
                        key={c.id || c.userId}
                        onClick={() => toggleMember(c.id || c.userId)}
                        className="p-2 flex items-center justify-between hover:bg-slate-50 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <div className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 font-semibold text-[10px] flex items-center justify-center shrink-0">
                            {getInitials(c.name)}
                          </div>
                          <span className="text-xs text-slate-700 truncate">{c.name}</span>
                          <span className="text-[10px] text-slate-400 capitalize">({c.role})</span>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border flex items-center justify-center ${
                            isSelected ? 'bg-[#0B1F33] border-[#0B1F33] text-white' : 'border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t border-slate-100 flex items-center justify-end gap-2 bg-slate-50/50 shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !groupName.trim()}
                className="h-9 text-xs bg-[#0B1F33] hover:bg-[#142f4c] text-white"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    Creating...
                  </>
                ) : (
                  'Create Channel'
                )}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
