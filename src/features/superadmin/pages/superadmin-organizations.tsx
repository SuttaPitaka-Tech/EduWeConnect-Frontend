import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Building2,
  CheckCircle2,
  Eye,
  Download,
  MapPin,
  FileText,
  UserCheck,
  ShieldCheck,
  Phone,
  Mail,
  Calendar,
  GraduationCap,
  Layers,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react'
import { Button, Spinner } from '@/components/ui'
import { toast } from 'sonner'
import { API_GATEWAY_URL } from '@/config/api.config'
import type { OrganizationRecord } from './superadmin-approvals'

export default function SuperAdminOrganizations() {
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Selected Organization for In-Page Details View (No Popups)
  const [selectedOrg, setSelectedOrg] = useState<OrganizationRecord | null>(null)
  const [activeTab, setActiveTab] = useState<'profile' | 'head' | 'docs' | 'std'>('profile')

  const [loadingDocId, setLoadingDocId] = useState<string | null>(null)

  const hasMountedRef = useRef(false)
  const isFetchingRef = useRef(false)

  // ── Fetch Organizations ──────────────────────────────────────────────────
  const fetchOrganizations = async () => {
    if (isFetchingRef.current) return
    isFetchingRef.current = true
    setIsLoading(true)

    try {
      const res = await fetch(`${API_GATEWAY_URL}/organization-details`)
      if (!res.ok) throw new Error('Failed to fetch organizations')
      const data: OrganizationRecord[] = await res.json()
      setOrganizations(data)

      if (selectedOrg) {
        const refreshed = data.find((o) => o.id === selectedOrg.id)
        if (refreshed) setSelectedOrg(refreshed)
      }
    } catch (err: any) {
      toast.error(err.message || 'Error loading organizations')
    } finally {
      setIsLoading(false)
      isFetchingRef.current = false
    }
  }

  useEffect(() => {
    if (hasMountedRef.current) return
    hasMountedRef.current = true
    fetchOrganizations()
  }, [])

  // ── Filter for ONLY APPROVED organizations ───────────────────────────────
  const approvedOrganizations = useMemo(() => {
    return organizations.filter((org) => org.status === 'approved')
  }, [organizations])

  // Format Helpers
  const formatOrgType = (type?: string) => {
    if (!type) return 'Institution'
    return type
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase())
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'N/A'
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatAadhar = (aadhar?: string) => {
    if (!aadhar) return 'N/A'
    const clean = aadhar.replace(/[\s-]+/g, '')
    if (clean.length === 12) {
      return `${clean.slice(0, 4)} ${clean.slice(4, 8)} ${clean.slice(8, 12)}`
    }
    return aadhar
  }

  // ── Document Handlers ────────────────────────────────────────────────────
  const handleOpenDocInNewTab = async (fileId?: string) => {
    if (!fileId) {
      toast.error('Document file not available')
      return
    }
    try {
      setLoadingDocId(fileId)
      const res = await fetch(`${API_GATEWAY_URL}/files/download/${fileId}`)
      if (!res.ok) throw new Error('Failed to retrieve document URL')
      const data = await res.json()
      if (data.url) {
        window.open(data.url, '_blank')
      } else {
        throw new Error('Document URL not returned')
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not open document')
    } finally {
      setLoadingDocId(null)
    }
  }

  const handleDownloadDoc = async (fileId?: string) => {
    if (!fileId) {
      toast.error('Document file not available')
      return
    }
    try {
      setLoadingDocId(fileId)
      const res = await fetch(`${API_GATEWAY_URL}/files/download/${fileId}`)
      if (!res.ok) throw new Error('Failed to retrieve document download URL')
      const data = await res.json()
      if (data.url) {
        const a = document.createElement('a')
        a.href = data.url
        a.download = fileId
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }
    } catch (err: any) {
      toast.error(err.message || 'Could not download document')
    } finally {
      setLoadingDocId(null)
    }
  }

  // ── VIEW 1: In-Page Full Details View (Compact, Professional, Structured) ─
  if (selectedOrg) {
    return (
      <div className="w-full p-4 sm:p-6 flex flex-col gap-3.5 max-w-[1300px] mx-auto animate-fadeIn">
        {/* Top Navigation & Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedOrg(null)}
            className="h-8 px-3 rounded-lg text-xs font-bold border-[var(--gold)]/50 text-[var(--navy)] hover:bg-[var(--gold)]/15 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[var(--gold)]" />
            <span>Back to Approved Organizations</span>
          </Button>

          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-[var(--gold)] font-semibold bg-white px-2.5 py-1 rounded-md border border-[var(--gold)]/30 shadow-2xs">
              #EDU-ORG-{selectedOrg.id.slice(0, 8).toUpperCase()}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Approved Institution
            </span>
          </div>
        </div>

        {/* Master Corporate Card */}
        <div className="bg-white rounded-xl border border-[var(--gold)]/30 shadow-sm overflow-hidden">
          {/* Company Name Header (Moved UP, unified, compact) */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-[var(--cream)]/30 via-white to-transparent border-b border-[var(--border)]/80">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center shrink-0 shadow-2xs">
                  <Building2 className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <h1 className="text-xl sm:text-2xl font-serif font-bold text-[var(--navy)] tracking-tight">
                      {selectedOrg.organization_name}
                    </h1>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30 uppercase tracking-wider">
                      {formatOrgType(selectedOrg.organization_type)}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--text-secondary)] mt-1.5 font-medium">
                    <span className="flex items-center gap-1 text-[var(--navy)]">
                      <Mail className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedOrg.organization_email}
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[var(--navy)]">
                      <Phone className="w-3.5 h-3.5 text-[var(--gold)]" />
                      {selectedOrg.organization_mobile}
                    </span>
                    {(selectedOrg.city || selectedOrg.state) && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[var(--gold)]" />
                        {[selectedOrg.city, selectedOrg.state].filter(Boolean).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="text-xs text-[var(--text-secondary)] font-medium md:text-right shrink-0 border-t md:border-t-0 pt-2 md:pt-0 border-gray-100 flex md:flex-col gap-3 md:gap-0.5">
                <div>Registered: <strong className="text-[var(--navy)]">{formatDate(selectedOrg.registered_at || selectedOrg.created_at)}</strong></div>
                {selectedOrg.reviewed_at && (
                  <div>Approved: <strong className="text-emerald-700">{formatDate(selectedOrg.reviewed_at)}</strong></div>
                )}
              </div>
            </div>
          </div>

          {/* Integrated Sub-Navigation Tabs */}
          <div className="flex border-b border-[var(--border)]/80 bg-gray-50/60 px-4 sm:px-6 gap-2 sm:gap-4 overflow-x-auto">
            <button
              type="button"
              onClick={() => setActiveTab('profile')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'profile'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <Building2 className="w-4 h-4 text-[var(--gold)]" />
              <span>Profile & Location</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('head')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'head'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <UserCheck className="w-4 h-4 text-[var(--gold)]" />
              <span>Authorized Head</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('docs')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'docs'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <FileText className="w-4 h-4 text-[var(--gold)]" />
              <span>Statutory Documents</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('std')}
              className={`py-3 px-3 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'std'
                  ? 'border-[var(--navy)] text-[var(--navy)] bg-white -mb-px'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--navy)]'
              }`}
            >
              <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
              <span>STD</span>
            </button>
          </div>

          {/* Tab Body: Structured Info Panels */}
          <div className="p-4 sm:p-6 bg-white">
            {/* Tab 1: Profile & Location */}
            {activeTab === 'profile' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                {/* Institutional Info Card */}
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-[var(--gold)]" />
                      <span>Institutional Details</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white">
                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Institution Name
                      </span>
                      <p className="font-bold text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.organization_name}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Institution Type
                      </span>
                      <p className="font-semibold text-[var(--navy)] text-[13px] mt-1">
                        {formatOrgType(selectedOrg.organization_type)}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Official Email
                      </span>
                      <p className="font-semibold text-[var(--navy)] text-[13px] truncate mt-1" title={selectedOrg.organization_email}>
                        {selectedOrg.organization_email}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Contact Mobile
                      </span>
                      <p className="font-mono font-semibold text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.organization_mobile}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Registered Campus Location Section */}
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[var(--gold)]" />
                      <span>Registered Campus Address</span>
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white border-b border-[var(--border)]/60">
                    <div className="sm:col-span-2 p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Street Address
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.address || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        City / Village
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.city || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        District
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.district || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60 bg-white">
                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        State
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.state || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        PIN Code
                      </span>
                      <p className="font-mono font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.pincode || 'N/A'}
                      </p>
                    </div>

                    <div className="p-3.5">
                      <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                        Country
                      </span>
                      <p className="font-medium text-[var(--navy)] text-[13px] mt-1">
                        {selectedOrg.country || 'India'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Authorized Head */}
            {activeTab === 'head' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-[var(--gold)]" />
                      <span>Authorized Head of Institution</span>
                    </h3>
                    <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Verified Signatory
                    </span>
                  </div>

                  <div className="divide-y divide-[var(--border)]/60 bg-white">
                    {/* Row 1: Name, Email, Mobile */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60">
                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Full Name
                        </span>
                        <p className="font-bold text-[var(--navy)] text-[14px] mt-1">
                          {[selectedOrg.head_first_name, selectedOrg.head_middle_name, selectedOrg.head_last_name]
                            .filter(Boolean)
                            .join(' ') || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Official / Personal Email
                        </span>
                        <p className="font-semibold text-[var(--navy)] text-[13px] break-all mt-1" title={selectedOrg.head_email}>
                          {selectedOrg.head_email || 'N/A'}
                        </p>
                      </div>

                      <div className="p-4">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Mobile Number
                        </span>
                        <p className="font-mono font-semibold text-[var(--navy)] text-[13px] mt-1">
                          {selectedOrg.head_mobile || 'N/A'}
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Completely Visible Aadhar Number & Document */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--border)]/60">
                      {/* Completely Visible Aadhar Number */}
                      <div className="p-4 bg-[var(--cream)]/10">
                        <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                          Aadhar Identification Number (Full)
                        </span>
                        <div className="flex items-center gap-3 mt-1.5">
                          <span className="font-mono font-bold text-[var(--navy)] text-base tracking-wider bg-white px-3 py-1 rounded-md border border-[var(--gold)]/40 shadow-2xs inline-block">
                            {selectedOrg.head_aadhar_number ? formatAadhar(selectedOrg.head_aadhar_number) : 'Not Provided'}
                          </span>
                        </div>
                      </div>

                      {/* Aadhar Document Actions */}
                      <div className="p-4 bg-[var(--cream)]/10 flex items-center justify-between gap-3">
                        <div>
                          <span className="text-[10.5px] uppercase font-bold text-[var(--text-muted)] block tracking-wider">
                            Aadhar Card Document
                          </span>
                          <p className="text-xs text-[var(--navy)] font-semibold mt-1">
                            {selectedOrg.head_aadhar_file_id ? 'Uploaded File Verified' : 'No File Uploaded'}
                          </p>
                        </div>

                        {selectedOrg.head_aadhar_file_id && (
                          <div className="flex items-center gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.head_aadhar_file_id)}
                              disabled={loadingDocId === selectedOrg.head_aadhar_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.head_aadhar_file_id)}
                              disabled={loadingDocId === selectedOrg.head_aadhar_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 3: Statutory Documents */}
            {activeTab === 'docs' && (
              <div className="space-y-3 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-2.5 bg-[var(--cream)]/30 border-b border-[var(--border)]/70">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[var(--gold)]" />
                      <span>Statutory & Compliance Certificates</span>
                    </h3>
                  </div>

                  <div className="divide-y divide-[var(--border)]/60 bg-white">
                    {/* PAN Card */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 text-[var(--gold)] flex items-center justify-center shrink-0 border border-[var(--gold)]/30">
                          <ShieldCheck className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            PAN Identification Card
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            PAN: <strong className="text-[var(--navy)]">{selectedOrg.pan_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.pan_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.pan_file_id)}
                              disabled={loadingDocId === selectedOrg.pan_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.pan_file_id)}
                              disabled={loadingDocId === selectedOrg.pan_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>

                    {/* GST Certificate */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            GST Registration Certificate
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            GSTIN: <strong className="text-[var(--navy)]">{selectedOrg.gst_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.gst_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.gst_file_id)}
                              disabled={loadingDocId === selectedOrg.gst_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.gst_file_id)}
                              disabled={loadingDocId === selectedOrg.gst_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>

                    {/* Registration Certificate */}
                    <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
                          <Layers className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--navy)] text-sm">
                            Educational Institution Registration Certificate
                          </h4>
                          <p className="text-xs text-[var(--text-secondary)] font-mono mt-0.5">
                            Certificate Number: <strong className="text-[var(--navy)]">{selectedOrg.reg_cert_number || 'N/A'}</strong>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {selectedOrg.reg_cert_file_id ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleOpenDocInNewTab(selectedOrg.reg_cert_file_id)}
                              disabled={loadingDocId === selectedOrg.reg_cert_file_id}
                              className="h-8 px-3 text-xs rounded-lg border-[var(--gold)] text-[var(--navy)] hover:bg-[var(--gold)]/10 font-bold"
                            >
                              <Eye className="w-3.5 h-3.5 mr-1 text-[var(--gold)]" /> View Document
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDownloadDoc(selectedOrg.reg_cert_file_id)}
                              disabled={loadingDocId === selectedOrg.reg_cert_file_id}
                              className="h-8 px-2.5 text-xs rounded-lg"
                              title="Download"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </Button>
                          </>
                        ) : (
                          <span className="text-xs text-gray-400 italic">No File Uploaded</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: STD (Organization Standards) */}
            {activeTab === 'std' && (
              <div className="space-y-4 animate-fadeIn text-xs sm:text-sm">
                <div className="border border-[var(--border)]/80 rounded-xl overflow-hidden shadow-2xs">
                  <div className="px-4 py-3 bg-[var(--cream)]/30 border-b border-[var(--border)]/70 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-[var(--navy)] uppercase tracking-wider flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
                      <span>Approved Organization Standards (STD)</span>
                    </h3>
                    <span className="text-[11px] font-bold text-[var(--navy)] bg-[var(--gold)]/20 px-2.5 py-0.5 rounded-full border border-[var(--gold)]/40">
                      {Array.isArray(selectedOrg.organization_std) ? selectedOrg.organization_std.length : 0} Standards Offered
                    </span>
                  </div>

                  <div className="p-5 bg-white">
                    {Array.isArray(selectedOrg.organization_std) && selectedOrg.organization_std.length > 0 ? (
                      <div className="space-y-4">
                        <p className="text-xs text-[var(--text-secondary)]">
                          The following standards and educational grades are approved and active for <strong className="text-[var(--navy)]">{selectedOrg.organization_name}</strong>:
                        </p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                          {selectedOrg.organization_std.map((std: string, idx: number) => (
                            <div
                              key={std}
                              className="p-3 rounded-xl bg-[var(--cream)]/30 border border-[var(--gold)]/30 hover:border-[var(--gold)] hover:bg-[var(--cream)]/60 transition-all shadow-2xs flex items-center gap-2.5"
                            >
                              <div className="w-7 h-7 rounded-lg bg-[var(--navy)] text-[var(--gold)] flex items-center justify-center shrink-0 font-bold text-xs">
                                {idx + 1}
                              </div>
                              <div className="min-w-0">
                                <p className="font-bold text-[var(--navy)] text-xs truncate">
                                  {std}
                                </p>
                                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                                  <CheckCircle2 className="w-2.5 h-2.5" /> Approved
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-12 text-center flex flex-col items-center justify-center max-w-sm mx-auto">
                        <div className="w-12 h-12 rounded-xl bg-gray-50 text-gray-400 flex items-center justify-center mb-2 border border-gray-200">
                          <GraduationCap className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-[var(--navy)] text-sm">No Standards Configured</h4>
                        <p className="text-xs text-[var(--text-muted)] mt-1">
                          No educational standards or classes have been recorded for this institution yet.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── VIEW 2: Cards Grid (Default view) ─────────────────────────────────────
  return (
    <div className="w-full min-h-full p-6 md:p-8 lg:p-10 flex flex-col gap-6 max-w-[1600px] mx-auto animate-fadeIn pb-16">
      {isLoading ? (
        <div className="py-28 flex flex-col items-center justify-center gap-3">
          <Spinner className="w-9 h-9 text-[var(--gold)]" />
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] font-medium">
            Loading approved organizations...
          </p>
        </div>
      ) : approvedOrganizations.length === 0 ? (
        <div className="py-24 px-6 text-center bg-white/70 border border-dashed border-[var(--gold)]/35 rounded-3xl flex flex-col items-center justify-center max-w-lg mx-auto shadow-2xs">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 text-[var(--gold)] flex items-center justify-center mb-3.5 border border-[var(--gold)]/20 shadow-2xs">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-serif font-bold text-[var(--navy)]">No Approved Organizations Found</h3>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)] max-w-sm mt-1.5 leading-relaxed">
            There are currently no approved organizations. Pending registrations can be reviewed and approved in the Approval section.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {approvedOrganizations.map((org: OrganizationRecord) => {
            const standards = Array.isArray(org.organization_std) ? org.organization_std : []

            return (
              <div
                key={org.id}
                onClick={() => {
                  setSelectedOrg(org)
                  setActiveTab('profile')
                  window.scrollTo({ top: 0, behavior: 'smooth' })
                }}
                className="group relative bg-white border border-[var(--gold)]/25 hover:border-[var(--gold)] rounded-2xl p-6 shadow-xs hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Top: Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30 uppercase tracking-wider">
                      {formatOrgType(org.organization_type)}
                    </span>
                    <span className="px-3 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80 flex items-center gap-1.5 shadow-2xs">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      Approved
                    </span>
                  </div>

                  {/* Institution Name */}
                  <h3 className="text-lg font-serif font-bold text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors line-clamp-1">
                    {org.organization_name}
                  </h3>

                  {/* Reference ID */}
                  <div className="mt-1 mb-4">
                    <span className="font-mono text-[11px] text-[var(--gold)] font-semibold bg-[var(--cream)] px-2.5 py-0.5 rounded-md inline-block border border-[var(--gold)]/20">
                      #EDU-ORG-{org.id.slice(0, 8).toUpperCase()}
                    </span>
                  </div>

                  {/* Contact details */}
                  <div className="space-y-2.5 pt-3 border-t border-[var(--border)]/70 text-xs">
                    {/* Email */}
                    <div className="flex items-center gap-2.5 text-[var(--navy)]">
                      <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                        <Mail className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-medium truncate text-xs" title={org.organization_email}>
                        {org.organization_email}
                      </span>
                    </div>

                    {/* Mobile */}
                    <div className="flex items-center gap-2.5 text-[var(--navy)]">
                      <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                        <Phone className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-mono font-medium text-xs">
                        {org.organization_mobile}
                      </span>
                    </div>

                    {/* Location */}
                    {(org.city || org.state) && (
                      <div className="flex items-center gap-2.5 text-[var(--text-secondary)]">
                        <div className="w-7 h-7 rounded-xl bg-[var(--cream)] flex items-center justify-center shrink-0 text-[var(--gold)] border border-[var(--gold)]/20">
                          <MapPin className="w-3.5 h-3.5" />
                        </div>
                        <span className="text-xs truncate font-medium">
                          {[org.city, org.state].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Standards Offered */}
                  {standards.length > 0 && (
                    <div className="mt-4 pt-3 border-t border-[var(--border)]/70">
                      <div className="flex items-center gap-1.5 mb-2 text-[10.5px] font-bold text-[var(--text-muted)] uppercase tracking-wider">
                        <GraduationCap className="w-3.5 h-3.5 text-[var(--gold)]" />
                        <span>Standards Offered ({standards.length})</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {standards.slice(0, 4).map((std: string) => (
                          <span
                            key={std}
                            className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-[var(--cream)] text-[var(--navy)] border border-[var(--gold)]/25"
                          >
                            {std}
                          </span>
                        ))}
                        {standards.length > 4 && (
                          <span className="px-2 py-0.5 rounded-lg text-xs font-semibold bg-gray-100 text-gray-600">
                            +{standards.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Footer */}
                <div className="mt-5 pt-3.5 border-t border-[var(--border)]/70 flex items-center justify-between text-xs">
                  <span className="text-xs text-[var(--text-muted)] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[var(--gold)]" />
                    {formatDate(org.reviewed_at || org.registered_at || org.created_at)}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--gold)] group-hover:translate-x-1 transition-transform">
                    <span>View Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
