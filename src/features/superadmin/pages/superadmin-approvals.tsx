import { useState, useEffect, useMemo } from 'react'
import {
  Building2,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Download,
  FileText,
  User,
  MapPin,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  RotateCw,
  AlertTriangle,
  Send,
  X,
  Phone,
  Mail,
  Calendar,
  Plus,
} from 'lucide-react'
import {
  Button,
  Input,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Spinner,
} from '@/components/ui'
import { toast } from 'sonner'
import { OrgOnboardingWizard } from '@/features/onboarding/components/org-onboarding-wizard'
import { API_GATEWAY_URL } from '@/config/api.config'

export interface OrganizationRecord {
  id: string
  organization_name: string
  organization_email: string
  organization_mobile: string
  organization_type: string
  address?: string
  city?: string
  district?: string
  state?: string
  pincode?: string
  country?: string
  pan_number?: string
  pan_file_id?: string
  gst_number?: string
  gst_file_id?: string
  reg_cert_number?: string
  reg_cert_file_id?: string
  head_first_name?: string
  head_middle_name?: string
  head_last_name?: string
  head_email?: string
  head_mobile?: string
  head_aadhar_number?: string
  head_aadhar_file_id?: string
  status: 'pending' | 'approved' | 'rejected'
  rejection_reason?: string
  reviewed_at?: string
  registered_at: string
  uploaded_at: string
  created_at?: string
  updated_at?: string
  documentUrls?: {
    pan?: string | null
    gst?: string | null
    regCert?: string | null
    headAadhar?: string | null
  }
}

export default function SuperAdminApprovals() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [isCreatingOrg, setIsCreatingOrg] = useState(false)

  // Review Modal State
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRecord | null>(null)
  const [activeStep, setActiveStep] = useState<1 | 2>(1)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  // Rejection Feedback Modal State
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')

  // Document Preview Modal State
  const [previewDoc, setPreviewDoc] = useState<{ title: string; url: string; fileName: string } | null>(null)

  // ── Fetch Organizations ──────────────────────────────────────────────────
  const fetchOrganizations = async (isManual = false) => {
    if (isManual) setIsRefreshing(true)
    else setIsLoading(true)

    try {
      const res = await fetch(`${API_GATEWAY_URL}/organization-details`)

      if (!res.ok) throw new Error('Failed to fetch organization applications')
      const data: OrganizationRecord[] = await res.json()
      setOrganizations(data)

      // If review modal is open, keep selectedOrg fresh
      if (selectedOrg) {
        const refreshed = data.find((o) => o.id === selectedOrg.id)
        if (refreshed) setSelectedOrg(refreshed)
      }
    } catch (err: any) {
      toast.error(err.message || 'Error loading organization applications')
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [])

  // ── Status Update Handler ────────────────────────────────────────────────
  const handleUpdateStatus = async (
    orgId: string,
    newStatus: 'approved' | 'rejected',
    reason?: string
  ) => {
    try {
      setIsUpdatingStatus(true)
      const payload = { status: newStatus, rejectionReason: reason || null }

      const res = await fetch(`${API_GATEWAY_URL}/organization-details/${orgId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || `Failed to update status to ${newStatus}`)
      }

      const updated: OrganizationRecord = await res.json()

      // Update local state
      setOrganizations((prev) => prev.map((o) => (o.id === updated.id ? updated : o)))
      setSelectedOrg(updated)

      if (newStatus === 'approved') {
        toast.success(`Application for "${updated.organization_name}" has been approved!`)
      } else {
        toast.error(`Application for "${updated.organization_name}" has been rejected.`)
        setIsRejectModalOpen(false)
        setRejectionReason('')
      }
    } catch (err: any) {
      toast.error(err.message || 'Error updating application status')
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  // ── Filtered Applications ────────────────────────────────────────────────
  const filteredOrgs = useMemo(() => {
    return organizations.filter((org) => {
      const matchesStatus = statusFilter === 'all' ? true : org.status === statusFilter
      const query = searchQuery.toLowerCase().trim()
      if (!query) return matchesStatus

      const matchesSearch =
        org.organization_name.toLowerCase().includes(query) ||
        org.organization_email.toLowerCase().includes(query) ||
        org.organization_mobile.toLowerCase().includes(query) ||
        (org.city && org.city.toLowerCase().includes(query)) ||
        (org.state && org.state.toLowerCase().includes(query)) ||
        (org.head_first_name && org.head_first_name.toLowerCase().includes(query)) ||
        (org.head_last_name && org.head_last_name.toLowerCase().includes(query))

      return matchesStatus && matchesSearch
    })
  }, [organizations, searchQuery, statusFilter])

  // ── Metric Counts ────────────────────────────────────────────────────────
  const counts = useMemo(() => {
    return {
      total: organizations.length,
      pending: organizations.filter((o) => o.status === 'pending').length,
      approved: organizations.filter((o) => o.status === 'approved').length,
      rejected: organizations.filter((o) => o.status === 'rejected').length,
    }
  }, [organizations])

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    try {
      const d = new Date(dateStr)
      return d.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      })
    } catch {
      return dateStr
    }
  }

  const formatOrgType = (type?: string) => {
    if (!type) return 'Institution'
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  return (
    <div className="w-full p-4 md:p-8 bg-[#FDFBF7] flex flex-col gap-6">
      {isCreatingOrg ? (
        <OrgOnboardingWizard
          isSuperAdmin={true}
          onSuccess={() => {
            setIsCreatingOrg(false)
            fetchOrganizations(true)
          }}
          onCancel={() => setIsCreatingOrg(false)}
        />
      ) : (
        <>
          {/* ── Page Header ──────────────────────────────────────────────────── */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--navy)]">
                  Organization Approvals
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30">
                  Super Admin Control
                </span>
              </div>
              <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-1">
                Review statutory documentation, verify campus credentials, and approve or reject organization onboarding applications.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchOrganizations(true)}
                disabled={isRefreshing}
                className="h-10 px-4 rounded-xl text-xs font-semibold bg-white/80 border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)] shadow-xs"
              >
                <RotateCw className={`w-3.5 h-3.5 mr-2 ${isRefreshing ? 'animate-spin text-[var(--gold)]' : ''}`} />
                Refresh
              </Button>

              <Button
                size="sm"
                onClick={() => setIsCreatingOrg(true)}
                className="h-10 px-4 rounded-xl text-xs font-bold bg-[var(--navy)] text-white hover:bg-[var(--navy)]/90 active:scale-98 transition-all shadow-md flex items-center gap-2"
              >
                <Plus className="w-4 h-4 text-[var(--gold)]" />
                Create Organization
              </Button>
            </div>
          </div>

      {/* ── KPI Metric Cards ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5">
        {/* Total */}
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'all'
              ? 'bg-white border-[var(--navy)] shadow-md'
              : 'bg-white/80 border-[var(--border)] hover:border-[var(--navy)]/40 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider">
              Total Applied
            </span>
            <div className="w-8 h-8 rounded-xl bg-[var(--navy)]/10 text-[var(--navy)] flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-[var(--navy)]">{counts.total}</div>
          <p className="text-[11px] text-[var(--text-secondary)] mt-0.5">All registered organizations</p>
        </div>

        {/* Pending */}
        <div
          onClick={() => setStatusFilter('pending')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'pending'
              ? 'bg-amber-50/70 border-amber-500 shadow-md'
              : 'bg-white/80 border-[var(--border)] hover:border-amber-400 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-amber-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              Pending
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-amber-900">{counts.pending}</div>
          <p className="text-[11px] text-amber-700/80 mt-0.5">Awaiting verification</p>
        </div>

        {/* Approved */}
        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'approved'
              ? 'bg-emerald-50/70 border-emerald-500 shadow-md'
              : 'bg-white/80 border-[var(--border)] hover:border-emerald-400 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
              Approved
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-emerald-900">{counts.approved}</div>
          <p className="text-[11px] text-emerald-700/80 mt-0.5">Verified & active</p>
        </div>

        {/* Rejected */}
        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-xs ${
            statusFilter === 'rejected'
              ? 'bg-rose-50/70 border-rose-500 shadow-md'
              : 'bg-white/80 border-[var(--border)] hover:border-rose-400 hover:bg-white'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
              Rejected
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold font-serif text-rose-900">{counts.rejected}</div>
          <p className="text-[11px] text-rose-700/80 mt-0.5">With feedback sent</p>
        </div>
      </div>

      {/* ── Table & Search Container ─────────────────────────────────────── */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl border border-[var(--border)] shadow-md p-5 md:p-6 flex flex-col gap-4">
        {/* Filters & Search Header */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 pb-3 border-b border-[var(--border)]/70">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[var(--warm-white)] border border-[var(--border)] w-full md:w-auto overflow-x-auto">
            {(
              [
                { key: 'all', label: 'All Applications', count: counts.total },
                { key: 'pending', label: 'Pending Review', count: counts.pending },
                { key: 'approved', label: 'Approved', count: counts.approved },
                { key: 'rejected', label: 'Rejected', count: counts.rejected },
              ] as const
            ).map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setStatusFilter(tab.key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                  statusFilter === tab.key
                    ? 'bg-[var(--navy)] text-white shadow-sm'
                    : 'text-[var(--text-secondary)] hover:text-[var(--navy)] hover:bg-white/60'
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10.5px] px-1.5 py-0.2 rounded-full ${
                    statusFilter === tab.key
                      ? 'bg-white/20 text-white'
                      : 'bg-[var(--border)]/80 text-[var(--navy)]'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none" />
            <Input
              type="text"
              placeholder="Search by name, email, mobile, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 pl-9.5 pr-8 rounded-xl text-xs bg-[var(--warm-white)] border-[var(--border)] focus:border-[var(--gold)] transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--navy)]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Applications Table */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Spinner size={32} color="#B8862C" />
            <span className="text-xs font-semibold text-[var(--text-secondary)]">Loading organization applications...</span>
          </div>
        ) : filteredOrgs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] flex items-center justify-center mb-3">
              <Building2 className="w-7 h-7" />
            </div>
            <h3 className="text-base font-serif font-bold text-[var(--navy)]">No Organizations Found</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1 max-w-sm">
              {searchQuery
                ? `No organizations match "${searchQuery}" under ${statusFilter} filter.`
                : `There are currently no organizations in the ${statusFilter} list.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-[var(--border)]/70">
            <table className="w-full text-left text-xs">
              <thead className="bg-[var(--warm-white)] border-b border-[var(--border)]/70 text-[11px] uppercase tracking-wider text-[var(--navy)] font-bold">
                <tr>
                  <th className="py-3.5 px-4">Organization Name</th>
                  <th className="py-3.5 px-4">Official Email</th>
                  <th className="py-3.5 px-4">Mobile Number</th>
                  <th className="py-3.5 px-4">Campus Location</th>
                  <th className="py-3.5 px-4">Applied Date & Time</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]/40 bg-white">
                {filteredOrgs.map((org) => {
                  const isPending = org.status === 'pending'
                  const isApproved = org.status === 'approved'
                  const isRejected = org.status === 'rejected'

                  return (
                    <tr
                      key={org.id}
                      className="hover:bg-[var(--cream)]/40 transition-colors group cursor-pointer"
                      onClick={() => {
                        setSelectedOrg(org)
                        setActiveStep(1)
                      }}
                    >
                      {/* Organization Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center font-bold text-sm shrink-0">
                            {org.organization_name.charAt(0).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold text-[13px] text-[var(--navy)] truncate group-hover:text-[var(--gold)] transition-colors">
                              {org.organization_name}
                            </div>
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[var(--navy)]/5 text-[var(--navy)] border border-[var(--navy)]/10">
                              {formatOrgType(org.organization_type)}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 font-medium text-[var(--navy)]">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span className="whitespace-nowrap">{org.organization_email}</span>
                        </div>
                      </td>

                      {/* Mobile */}
                      <td className="py-3.5 px-4 font-mono font-medium text-[var(--navy)]">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span>{org.organization_mobile}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span className="truncate max-w-[140px]">
                            {org.city || 'N/A'}, {org.state || ''}
                          </span>
                        </div>
                      </td>

                      {/* Applied Date & Time */}
                      <td className="py-3.5 px-4 text-[var(--text-secondary)] font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)] shrink-0" />
                          <span>{formatDate(org.registered_at || org.created_at)}</span>
                        </div>
                      </td>

                      {/* Status Badge */}
                      <td className="py-3.5 px-4 text-center">
                        {isPending && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                            Pending
                          </span>
                        )}
                        {isApproved && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Approved
                          </span>
                        )}
                        {isRejected && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Rejected
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedOrg(org)
                            setActiveStep(1)
                          }}
                          className="h-8 px-3 rounded-xl text-xs font-bold border-[var(--border)] text-[var(--navy)] bg-[var(--warm-white)] hover:bg-[var(--gold)] hover:text-white transition-all shadow-2xs"
                        >
                          <Eye className="w-3.5 h-3.5 mr-1.5" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Review Organization Details Modal ────────────────────────────── */}
      <Dialog
        open={Boolean(selectedOrg)}
        onOpenChange={(open) => {
          if (!open) setSelectedOrg(null)
        }}
      >
        <DialogContent maxWidth="max-w-4xl" className="rounded-3xl p-6 border border-[var(--border)] max-h-[90vh] overflow-y-auto">
          {selectedOrg && (
            <div className="flex flex-col gap-4">
              {/* Modal Top Header */}
              <DialogHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[var(--border)]/70 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-[var(--gold)]/15 text-[var(--gold)] flex items-center justify-center font-bold text-lg">
                    {selectedOrg.organization_name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <DialogTitle className="text-xl font-serif font-bold text-[var(--navy)]">
                        {selectedOrg.organization_name}
                      </DialogTitle>
                      <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--navy)]/10 text-[var(--navy)]">
                        {formatOrgType(selectedOrg.organization_type)}
                      </span>
                    </div>
                    <DialogDescription className="text-xs text-[var(--text-secondary)] mt-0.5 flex items-center gap-2">
                      <span>App Ref: <strong className="font-mono text-[var(--navy)]">#EDU-ORG-{selectedOrg.id.slice(0, 8).toUpperCase()}</strong></span>
                      <span>•</span>
                      <span>Registered: {formatDate(selectedOrg.registered_at || selectedOrg.created_at)}</span>
                    </DialogDescription>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="flex items-center gap-2 self-start sm:self-center">
                  {selectedOrg.status === 'pending' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      Pending Review
                    </span>
                  )}
                  {selectedOrg.status === 'approved' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Approved
                    </span>
                  )}
                  {selectedOrg.status === 'rejected' && (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-600" />
                      Rejected
                    </span>
                  )}
                </div>
              </DialogHeader>

              {/* Status Alert Banner (if reviewed) */}
              {selectedOrg.status === 'rejected' && selectedOrg.rejection_reason && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Application Previously Rejected</div>
                    <div className="mt-0.5 text-rose-800">
                      Reason given: &ldquo;{selectedOrg.rejection_reason}&rdquo;
                    </div>
                  </div>
                </div>
              )}

              {selectedOrg.status === 'approved' && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div>
                    <span className="font-bold">Application Verified & Approved.</span>{' '}
                    <span>This institution has full authorized access to the EduWeConnect platform.</span>
                  </div>
                </div>
              )}

              {/* ── Multi-Step Arrow Navigation Tabs ────────────────────────── */}
              <div className="flex items-center justify-between bg-[var(--warm-white)] p-1.5 rounded-2xl border border-[var(--border)]/70">
                <button
                  type="button"
                  onClick={() => setActiveStep(1)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeStep === 1
                      ? 'bg-[var(--navy)] text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  <span>1. Organization Profile & Address</span>
                </button>

                <div className="w-6 flex items-center justify-center text-[var(--gold)]">
                  <ArrowRight className="w-4 h-4" />
                </div>

                <button
                  type="button"
                  onClick={() => setActiveStep(2)}
                  className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    activeStep === 2
                      ? 'bg-[var(--navy)] text-white shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--navy)]'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>2. Head of Org & Statutory Documents</span>
                </button>
              </div>

              {/* ── Step 1: Organization Profile & Address ─────────────────── */}
              {activeStep === 1 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  {/* Card: Primary Details */}
                  <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--border)]/70 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                      <Building2 className="w-4 h-4 text-[var(--gold)]" />
                      <span>Primary Contact & Institution Profile</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Institution Name:</span>
                        <span className="font-bold text-[var(--navy)] text-[13px]">{selectedOrg.organization_name}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Official Email:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.organization_email}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Mobile Number:</span>
                        <span className="font-mono font-medium text-[var(--navy)]">{selectedOrg.organization_mobile}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card: Location & Address */}
                  <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--border)]/70 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                      <MapPin className="w-4 h-4 text-[var(--gold)]" />
                      <span>Registered Campus Address</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div className="md:col-span-2">
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Street Address:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.address || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">City / Village:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.city || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">District:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.district || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">State:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.state || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Postal Code:</span>
                        <span className="font-mono font-medium text-[var(--navy)]">{selectedOrg.pincode || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Country:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.country || 'India'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card: Statutory Identification Numbers */}
                  <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--border)]/70 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                      <FileText className="w-4 h-4 text-[var(--gold)]" />
                      <span>Statutory Registration Numbers</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">PAN Number:</span>
                        <span className="font-mono font-bold text-[var(--navy)]">{selectedOrg.pan_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">GSTIN Number:</span>
                        <span className="font-mono font-bold text-[var(--navy)]">{selectedOrg.gst_number || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Registration Certificate No:</span>
                        <span className="font-mono font-bold text-[var(--navy)]">{selectedOrg.reg_cert_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Arrow to Next Step */}
                  <div className="flex justify-end pt-2">
                    <Button
                      type="button"
                      variant="gold"
                      onClick={() => setActiveStep(2)}
                      className="h-10 px-5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm"
                    >
                      Next: Authorized Head & Documents
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* ── Step 2: Head of Org & Statutory Documents ──────────────── */}
              {activeStep === 2 && (
                <div className="flex flex-col gap-4 animate-fadeIn">
                  {/* Authorized Head Card */}
                  <div className="p-4 rounded-2xl bg-[var(--warm-white)] border border-[var(--border)]/70 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--navy)] uppercase tracking-wider">
                        <User className="w-4 h-4 text-[var(--gold)]" />
                        <span>Authorized Head of Organization</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveStep(1)}
                        className="text-[11px] font-semibold text-[var(--gold)] hover:underline flex items-center gap-1"
                      >
                        <ArrowLeft className="w-3 h-3" /> Back to Profile
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Full Name:</span>
                        <span className="font-bold text-[var(--navy)]">
                          {`${selectedOrg.head_first_name || ''} ${selectedOrg.head_middle_name || ''} ${selectedOrg.head_last_name || ''}`.trim() || 'N/A'}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Official Email:</span>
                        <span className="font-medium text-[var(--navy)]">{selectedOrg.head_email || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Mobile Number:</span>
                        <span className="font-mono font-medium text-[var(--navy)]">{selectedOrg.head_mobile || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[var(--text-muted)] block mb-0.5">Aadhar Number:</span>
                        <span className="font-mono font-bold text-[var(--navy)]">{selectedOrg.head_aadhar_number || 'N/A'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Statutory Documents Grid */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Uploaded Compliance Documents in MinIO Storage
                      </h4>
                      <span className="text-[11px] text-[var(--text-muted)]">Bucket: <code className="text-[var(--gold)] font-mono">organization-details</code></span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {/* Document 1: PAN Card */}
                      <DocumentCard
                        title="PAN Card Document"
                        docNumber={selectedOrg.pan_number}
                        docNumberLabel="PAN"
                        fileId={selectedOrg.pan_file_id}
                        url={selectedOrg.documentUrls?.pan}
                        onPreview={() => {
                          if (selectedOrg.documentUrls?.pan) {
                            setPreviewDoc({
                              title: `PAN Card (${selectedOrg.pan_number || 'Document'})`,
                              url: selectedOrg.documentUrls.pan,
                              fileName: selectedOrg.pan_file_id || 'pan_card.pdf',
                            })
                          } else {
                            toast.error('PAN file URL not available.')
                          }
                        }}
                      />

                      {/* Document 2: GST Certificate */}
                      <DocumentCard
                        title="GST Certificate"
                        docNumber={selectedOrg.gst_number}
                        docNumberLabel="GSTIN"
                        fileId={selectedOrg.gst_file_id}
                        url={selectedOrg.documentUrls?.gst}
                        onPreview={() => {
                          if (selectedOrg.documentUrls?.gst) {
                            setPreviewDoc({
                              title: `GST Certificate (${selectedOrg.gst_number || 'Document'})`,
                              url: selectedOrg.documentUrls.gst,
                              fileName: selectedOrg.gst_file_id || 'gst_cert.pdf',
                            })
                          } else {
                            toast.error('GST certificate URL not available.')
                          }
                        }}
                      />

                      {/* Document 3: Registration Certificate */}
                      <DocumentCard
                        title="Registration Certificate"
                        docNumber={selectedOrg.reg_cert_number}
                        docNumberLabel="Reg No"
                        fileId={selectedOrg.reg_cert_file_id}
                        url={selectedOrg.documentUrls?.regCert}
                        onPreview={() => {
                          if (selectedOrg.documentUrls?.regCert) {
                            setPreviewDoc({
                              title: `Registration Certificate (${selectedOrg.reg_cert_number || 'Document'})`,
                              url: selectedOrg.documentUrls.regCert,
                              fileName: selectedOrg.reg_cert_file_id || 'registration_certificate.pdf',
                            })
                          } else {
                            toast.error('Registration Certificate URL not available.')
                          }
                        }}
                      />

                      {/* Document 4: Head Aadhar */}
                      <DocumentCard
                        title="Authorized Head Aadhar"
                        docNumber={selectedOrg.head_aadhar_number}
                        docNumberLabel="Aadhar"
                        fileId={selectedOrg.head_aadhar_file_id}
                        url={selectedOrg.documentUrls?.headAadhar}
                        onPreview={() => {
                          if (selectedOrg.documentUrls?.headAadhar) {
                            setPreviewDoc({
                              title: `Authorized Head Aadhar (${selectedOrg.head_aadhar_number || 'Document'})`,
                              url: selectedOrg.documentUrls.headAadhar,
                              fileName: selectedOrg.head_aadhar_file_id || 'head_aadhar.pdf',
                            })
                          } else {
                            toast.error('Aadhar file URL not available.')
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── Dialog Decision Footer ───────────────────────────────── */}
              <DialogFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[var(--border)]/70 mt-2">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setSelectedOrg(null)}
                    className="h-10 px-4 rounded-xl text-xs font-semibold border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
                  >
                    Close
                  </Button>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Reject Button */}
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdatingStatus}
                    onClick={() => {
                      setRejectionReason('')
                      setIsRejectModalOpen(true)
                    }}
                    className="h-10 px-4 rounded-xl text-xs font-bold border-rose-300 text-rose-700 bg-rose-50/50 hover:bg-rose-100 hover:text-rose-800 transition-all shadow-xs"
                  >
                    <XCircle className="w-4 h-4 mr-1.5 text-rose-600" />
                    {selectedOrg.status === 'rejected' ? 'Update Rejection Reason' : 'Reject Application'}
                  </Button>

                  {/* Approve Button */}
                  <Button
                    type="button"
                    disabled={isUpdatingStatus}
                    onClick={() => handleUpdateStatus(selectedOrg.id, 'approved')}
                    className="h-10 px-6 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 active:scale-98 transition-all shadow-md flex items-center gap-1.5"
                  >
                    {isUpdatingStatus ? (
                      <Spinner size={14} color="#FFFFFF" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4" />
                    )}
                    {selectedOrg.status === 'approved' ? 'Re-approve & Reissue Password' : 'Approve & Activate'}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Rejection Feedback Reason Modal ───────────────────────────────── */}
      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent maxWidth="max-w-md" className="rounded-3xl p-6 border border-[var(--border)]">
          <DialogHeader className="flex flex-col items-center text-center pb-2 border-b border-[var(--border)]/70">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <XCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-serif font-bold text-[var(--navy)]">
              Reject Organization Application
            </DialogTitle>
            <DialogDescription className="text-xs text-[var(--text-secondary)] mt-1">
              Please enter the specific reason for rejection. This feedback will be recorded in the system and communicated to the institution.
            </DialogDescription>
          </DialogHeader>

          <div className="my-3 space-y-2">
            <label className="block text-[11px] font-semibold text-[var(--navy)] uppercase">
              Rejection Reason / Feedback *
            </label>
            <textarea
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. GST certificate mismatch or invalid registration document. Please upload official statutory certificate with clear seal."
              className="w-full p-3 text-xs rounded-xl border border-[var(--border)] bg-[var(--input-bg)] text-[var(--navy)] focus:outline-none focus:border-rose-400 placeholder:text-[var(--text-muted)]"
            />
          </div>

          <DialogFooter className="flex justify-end gap-2.5">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsRejectModalOpen(false)}
              className="h-10 px-4 rounded-xl text-xs font-semibold border-[var(--border)]"
            >
              Cancel
            </Button>
            <Button
              type="button"
              disabled={!rejectionReason.trim() || isUpdatingStatus}
              onClick={() => {
                if (selectedOrg) {
                  handleUpdateStatus(selectedOrg.id, 'rejected', rejectionReason.trim())
                }
              }}
              className="h-10 px-5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-md flex items-center gap-1.5"
            >
              {isUpdatingStatus ? (
                <Spinner size={14} color="#FFFFFF" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Document Preview Modal ────────────────────────────────────────── */}
      <Dialog
        open={Boolean(previewDoc)}
        onOpenChange={(open) => {
          if (!open) setPreviewDoc(null)
        }}
      >
        <DialogContent maxWidth="max-w-4xl" className="rounded-3xl p-5 border border-[var(--border)] max-h-[92vh] flex flex-col">
          {previewDoc && (
            <>
              <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-[var(--border)]/70">
                <div>
                  <DialogTitle className="text-base font-serif font-bold text-[var(--navy)] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[var(--gold)]" />
                    {previewDoc.title}
                  </DialogTitle>
                  <DialogDescription className="text-xs text-[var(--text-secondary)] font-mono truncate max-w-md mt-0.5">
                    {previewDoc.fileName}
                  </DialogDescription>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={previewDoc.url}
                    download={previewDoc.fileName}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 h-8 px-3 rounded-xl text-xs font-bold bg-[var(--gold)] text-white hover:opacity-90 transition-opacity shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                </div>
              </DialogHeader>

              {/* Preview Body */}
              <div className="flex-1 my-3 bg-neutral-100 rounded-2xl overflow-hidden border border-[var(--border)]/70 min-h-[450px] flex items-center justify-center">
                {previewDoc.fileName.toLowerCase().endsWith('.pdf') ? (
                  <iframe
                    src={`${previewDoc.url}#toolbar=0`}
                    title={previewDoc.title}
                    className="w-full h-[550px] border-none"
                  />
                ) : (
                  <img
                    src={previewDoc.url}
                    alt={previewDoc.title}
                    className="max-w-full max-h-[550px] object-contain"
                  />
                )}
              </div>

              <DialogFooter className="flex justify-end pt-1">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPreviewDoc(null)}
                  className="h-9 px-4 rounded-xl text-xs font-semibold border-[var(--border)]"
                >
                  Close Preview
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  )}
</div>
  )
}

// ── Document Card Component ──────────────────────────────────────────────────
function DocumentCard({
  title,
  docNumber,
  docNumberLabel,
  fileId,
  url,
  onPreview,
}: {
  title: string
  docNumber?: string
  docNumberLabel?: string
  fileId?: string
  url?: string | null
  onPreview: () => void
}) {
  const hasFile = Boolean(fileId && url)
  const isPdf = fileId?.toLowerCase().endsWith('.pdf')

  return (
    <div className="p-3.5 rounded-2xl bg-white border border-[var(--border)]/70 hover:border-[var(--gold)]/50 transition-all shadow-2xs flex flex-col justify-between gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-[var(--warm-white)] text-[var(--navy)] border border-[var(--border)] flex items-center justify-center shrink-0">
            {isPdf ? (
              <span className="text-[10px] font-black font-mono text-rose-600">PDF</span>
            ) : (
              <span className="text-[10px] font-black font-mono text-blue-600">IMG</span>
            )}
          </div>
          <div className="min-w-0">
            <h5 className="font-bold text-[12.5px] text-[var(--navy)] truncate">{title}</h5>
            <p className="text-[11.5px] text-[var(--navy)] font-mono font-bold truncate mt-0.5" title={docNumber || 'Not provided'}>
              {docNumber ? `${docNumberLabel ? docNumberLabel + ': ' : ''}${docNumber}` : 'Document attached'}
            </p>
          </div>
        </div>

        {hasFile ? (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            Available
          </span>
        ) : (
          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-neutral-100 text-neutral-500 shrink-0">
            Missing
          </span>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 pt-1 border-t border-[var(--border)]/40">
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={!hasFile}
          onClick={onPreview}
          className="h-7 px-2.5 rounded-lg text-[11px] font-bold border-[var(--border)] text-[var(--navy)] hover:bg-[var(--beige)]"
        >
          <Eye className="w-3 h-3 mr-1 text-[var(--gold)]" /> View
        </Button>

        {hasFile && url && (
          <a
            href={url}
            download={fileId || 'document'}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center h-7 px-2.5 rounded-lg text-[11px] font-bold bg-[var(--warm-white)] border border-[var(--border)] text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white transition-colors"
          >
            <Download className="w-3 h-3 mr-1" /> Download
          </a>
        )}
      </div>
    </div>
  )
}
