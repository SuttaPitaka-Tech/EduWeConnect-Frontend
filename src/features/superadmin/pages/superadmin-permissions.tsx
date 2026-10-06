import { useState, useEffect } from 'react'
import { 
  ShieldCheck, ArrowLeft, Search, 
  Mail, Phone, ArrowRight, Building2
} from 'lucide-react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { API_GATEWAY_URL } from '@/config/api.config'
import { toast } from 'sonner'
import { OrganizationRecord } from './superadmin-approvals'

export default function SuperAdminPermissions() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedOrgId = searchParams.get('orgId') || ''
  const setSelectedOrgId = (id: string) => {
    if (id) {
      setSearchParams({ orgId: id })
    } else {
      setSearchParams({})
    }
  }
  const [organizations, setOrganizations] = useState<OrganizationRecord[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  const [permissions, setPermissions] = useState<Record<string, boolean>>({})
  const [roleModules, setRoleModules] = useState<{ role: string, modules: string[] }[]>([])
  const [isSaving, setIsSaving] = useState(false)
  const [confirmModal, setConfirmModal] = useState<{ isOpen: boolean; role: string; module: string; action: 'enable' | 'disable' } | null>(null)
  const [batchConfirmModal, setBatchConfirmModal] = useState<{ isOpen: boolean; title: string; message: string; newPermissions: Record<string, boolean> } | null>(null)

  const handleToggleClick = (role: string, module: string) => {
    const key = `${role}-${module}`
    const isGranted = !!permissions[key]
    setConfirmModal({
      isOpen: true,
      role,
      module,
      action: isGranted ? 'disable' : 'enable'
    })
  }

  const confirmToggle = async () => {
    if (!confirmModal || !selectedOrgId) return
    const { role, module } = confirmModal
    const key = `${role}-${module}`
    
    // Predict the new state
    const newPermissions = {
      ...permissions,
      [key]: !permissions[key]
    }
    
    setIsSaving(true)
    try {
      const res = await fetch(`${API_GATEWAY_URL}/menus/permissions/${selectedOrgId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPermissions)
      })
      if (!res.ok) throw new Error('Failed to save permission')
      
      // Update local state if successful
      setPermissions(newPermissions)
      toast.success(`Permission ${confirmModal.action}d successfully!`)
    } catch (err: any) {
      toast.error('Could not save permission')
    } finally {
      setIsSaving(false)
      setConfirmModal(null)
    }
  }

  const handleToggleAllRole = (role: string) => {
    const roleGroup = roleModules.find(r => r.role === role);
    if (!roleGroup) return;
    
    const roleKeys = roleGroup.modules.map(mod => `${role}-${mod}`);
    const allGranted = roleKeys.length > 0 && roleKeys.every(key => permissions[key]);
    
    const newPermissions = { ...permissions };
    roleKeys.forEach(key => {
      newPermissions[key] = !allGranted;
    });

    setBatchConfirmModal({
      isOpen: true,
      title: `Confirm ${allGranted ? 'Disable' : 'Enable'} All for ${role}`,
      message: `Are you sure you want to ${allGranted ? 'disable' : 'enable'} all permissions for ${role}?`,
      newPermissions
    });
  }

  const handleToggleMasterAll = () => {
    const allKeys = roleModules.flatMap(r => r.modules.map(m => `${r.role}-${m}`));
    const allGranted = allKeys.length > 0 && allKeys.every(key => permissions[key]);
    
    const newPermissions = { ...permissions };
    allKeys.forEach(key => {
      newPermissions[key] = !allGranted;
    });

    setBatchConfirmModal({
      isOpen: true,
      title: `Confirm ${allGranted ? 'Disable' : 'Enable'} All`,
      message: `Are you sure you want to ${allGranted ? 'disable' : 'enable'} all permissions across all roles?`,
      newPermissions
    });
  }

  const confirmBatchToggle = async () => {
    if (!batchConfirmModal || !selectedOrgId) return
    setIsSaving(true)
    try {
      const res = await fetch(`${API_GATEWAY_URL}/menus/permissions/${selectedOrgId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchConfirmModal.newPermissions)
      })
      if (!res.ok) throw new Error('Failed to save permissions')
      
      setPermissions(batchConfirmModal.newPermissions)
      toast.success('Permissions updated successfully!')
    } catch (err: any) {
      toast.error('Could not save permissions')
    } finally {
      setIsSaving(false)
      setBatchConfirmModal(null)
    }
  }


  useEffect(() => {
    const fetchApprovedOrgs = async () => {
      try {
        const res = await fetch(`${API_GATEWAY_URL}/organization-details`)
        if (!res.ok) throw new Error('Failed to fetch organizations')
        const data: OrganizationRecord[] = await res.json()
        
        const approvedOrgs = data.filter((org) => org.status === 'approved')
        setOrganizations(approvedOrgs)
      } catch (err: any) {
        toast.error('Could not load organizations for permissions')
      } finally {
        setIsLoading(false)
      }
    }
    fetchApprovedOrgs()
  }, [])

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        const res = await fetch(`${API_GATEWAY_URL}/menus/schema`)
        if (res.ok) {
          const data = await res.json()
          setRoleModules(data)
        }
      } catch (err) {
        console.error('Failed to fetch menu schema', err)
      }
    }
    fetchSchema()
  }, [])

  useEffect(() => {
    if (!selectedOrgId) return
    const fetchOrgPermissions = async () => {
      try {
        const res = await fetch(`${API_GATEWAY_URL}/menus/permissions/${selectedOrgId}`, {
          cache: 'no-store'
        })
        if (!res.ok) throw new Error('Failed to fetch permissions')
        const data = await res.json()
        setPermissions(data)
      } catch (err: any) {
        toast.error('Could not load permissions for the selected organization')
      }
    }
    fetchOrgPermissions()
  }, [selectedOrgId])

  const handleBack = () => {
    if (selectedOrgId) {
      setSelectedOrgId('')
    } else {
      navigate(-1)
    }
  }

  const filteredOrgs = organizations.filter(org => 
    org.organization_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    org.organization_email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedOrg = organizations.find(o => o.id === selectedOrgId)

  return (
    <div className="flex-1 w-full flex flex-col gap-6 max-w-[1600px] mx-auto overflow-y-auto pb-10">
      {/* ── Header Section ─────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-black/5 text-[var(--navy)] font-semibold text-sm transition-colors group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back</span>
            </button>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-[var(--navy)] flex items-center gap-2">
              Permissions & Access
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--gold)] border border-[var(--gold)]/30 hidden sm:inline-block">
              Super Admin Control
            </span>
          </div>
          <p className="text-xs md:text-sm text-[var(--text-secondary)] mt-2 ml-10">
            {selectedOrgId 
              ? `Configuring access controls for ${selectedOrg?.organization_name}.`
              : 'Select an organization below to configure their sidebars, modules, and access controls.'
            }
          </p>
        </div>

        {!selectedOrgId && (
          <div className="flex items-center bg-white border border-[var(--border)] rounded-2xl px-4 py-2.5 shadow-sm w-full md:max-w-[280px] shrink-0">
            <Search className="w-4 h-4 text-[var(--text-secondary)] mr-3 shrink-0" />
            <input
              type="text"
              placeholder="Search organizations..."
              className="flex-1 bg-transparent border-none outline-none text-sm text-[var(--navy)] placeholder-[var(--text-tertiary)] font-medium w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* ── Main Content Area ──────────────────────────────────────────────── */}
      {!selectedOrgId ? (
        <div className="flex flex-col gap-6 animate-in fade-in duration-300 ml-8 pr-8">
          {isLoading ? (
            <div className="flex items-center justify-center p-10 text-[var(--text-secondary)]">
              Loading organizations...
            </div>
          ) : filteredOrgs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 bg-white/40 border border-dashed border-[var(--border)] rounded-3xl">
              <Building2 className="w-12 h-12 text-[var(--text-tertiary)] mb-4 opacity-50" />
              <p className="text-sm font-semibold text-[var(--text-secondary)]">No organizations found matching your search.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredOrgs.map(org => (
                <div 
                  key={org.id} 
                  className="bg-white rounded-2xl p-5 border border-[var(--border)] shadow-sm hover:shadow-md hover:border-[var(--gold)]/50 hover:-translate-y-1 transition-all duration-300 group flex flex-col cursor-pointer relative overflow-hidden"
                  onClick={() => setSelectedOrgId(org.id)}
                >
                  <div className="absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br from-[var(--gold)]/10 to-transparent rounded-full blur-2xl pointer-events-none transition-all duration-500 group-hover:scale-150 group-hover:bg-[var(--gold)]/20" />
                  
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4 relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--navy)]/5 border border-[var(--navy)]/10 flex items-center justify-center shrink-0">
                        <span className="text-[var(--navy)] font-bold text-sm">
                          {org.organization_name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <h3 className="text-lg font-serif font-bold text-[var(--navy)] line-clamp-1 group-hover:text-[var(--gold)] transition-colors" title={org.organization_name}>
                        {org.organization_name}
                      </h3>
                    </div>
                    <button className="flex items-center justify-center w-8 h-8 rounded-full bg-[var(--gold)]/10 text-[var(--gold)] group-hover:bg-[var(--gold)] group-hover:text-white transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {/* Middle: Contact Info */}
                  <div className="flex items-center gap-6 py-3 border-y border-[var(--border)]/60 relative z-10">
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] truncate flex-1" title={org.organization_email}>
                      <Mail className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span className="truncate">{org.organization_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] shrink-0" title={org.organization_mobile}>
                      <Phone className="w-4 h-4 text-[var(--gold)] shrink-0" />
                      <span>{org.organization_mobile}</span>
                    </div>
                  </div>
                  
                  {/* Footer: Dates */}
                  <div className="flex items-center justify-between pt-4 mt-auto relative z-10">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[var(--text-tertiary)]">Applied:</span>
                      <span className="text-xs font-bold text-[var(--navy)]">
                        {org.registered_at ? new Date(org.registered_at).toLocaleDateString('en-GB') : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-medium text-[var(--text-tertiary)]">Approved:</span>
                      <span className="text-xs font-bold text-green-600">
                        {org.reviewed_at ? new Date(org.reviewed_at).toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col gap-4 animate-in slide-in-from-right-4 duration-300 ml-8 pr-8">
          <div className="flex items-center justify-between mb-2 bg-white p-4 rounded-2xl border border-[var(--border)] shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[var(--gold)]/20 to-[var(--gold)]/5 flex items-center justify-center border border-[var(--gold)]/20 shadow-sm">
                <Building2 className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[var(--navy)]">{selectedOrg?.organization_name}</h2>
                <p className="text-xs font-medium text-[var(--text-secondary)]">Manage Role Permissions</p>
              </div>
            </div>

            {/* Master Select All Toggle */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-[var(--navy)]">Select All</span>
              <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 shadow-inner cursor-pointer ${
                (() => {
                  const allKeys = roleModules.flatMap(r => r.modules.map(m => `${r.role}-${m}`));
                  const isAllGranted = allKeys.length > 0 && allKeys.every(key => permissions[key]);
                  return isAllGranted ? 'bg-[var(--gold)]' : 'bg-gray-300';
                })()
              }`} onClick={handleToggleMasterAll}>
                <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out pointer-events-none ${
                  (() => {
                    const allKeys = roleModules.flatMap(r => r.modules.map(m => `${r.role}-${m}`));
                    const isAllGranted = allKeys.length > 0 && allKeys.every(key => permissions[key]);
                    return isAllGranted ? 'translate-x-[1.125rem]' : 'translate-x-1';
                  })()
                }`} />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roleModules.map((roleGroup) => (
              <div key={roleGroup.role} className="bg-white/80 backdrop-blur-md rounded-2xl border-2 border-[var(--border)] shadow-sm hover:shadow-[0_8px_30px_rgba(184,134,44,0.1)] hover:border-[var(--gold)]/30 transition-all duration-300 p-5 flex flex-col relative overflow-hidden group/card">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-[var(--gold)]/10 to-transparent rounded-full blur-2xl pointer-events-none transition-transform duration-500 group-hover/card:scale-125" />
                
                <div className="flex items-center justify-between mb-3 pb-3 border-b border-[var(--border)]/60 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[var(--gold)]/20 to-[var(--gold)]/5 flex items-center justify-center border border-[var(--gold)]/20 shadow-sm">
                      <ShieldCheck className="w-4 h-4 text-[var(--gold)] drop-shadow-sm" />
                    </div>
                    <h3 className="text-sm font-bold text-[var(--navy)] tracking-wide">{roleGroup.role}</h3>
                  </div>

                  {/* Role Select All Toggle */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-[var(--text-secondary)]">Select All</span>
                    <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 shadow-inner cursor-pointer ${
                      (() => {
                        const roleKeys = roleGroup.modules.map(m => `${roleGroup.role}-${m}`);
                        const isAllGranted = roleKeys.length > 0 && roleKeys.every(key => permissions[key]);
                        return isAllGranted ? 'bg-[var(--gold)]' : 'bg-gray-300';
                      })()
                    }`} onClick={() => handleToggleAllRole(roleGroup.role)}>
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out pointer-events-none ${
                        (() => {
                          const roleKeys = roleGroup.modules.map(m => `${roleGroup.role}-${m}`);
                          const isAllGranted = roleKeys.length > 0 && roleKeys.every(key => permissions[key]);
                          return isAllGranted ? 'translate-x-[1.125rem]' : 'translate-x-1';
                        })()
                      }`} />
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 relative z-10">
                  {roleGroup.modules.map((mod) => {
                    const isGranted = permissions[`${roleGroup.role}-${mod}`]
                    return (
                      <label 
                        key={mod} 
                        className="flex items-center justify-between cursor-pointer group py-1.5 px-2 -mx-2 rounded-md hover:bg-black/5 transition-colors"
                      >
                        <span className={`text-xs font-semibold transition-colors ${isGranted ? 'text-[var(--navy)]' : 'text-[var(--text-secondary)]'}`}>
                          {mod}
                        </span>
                        
                        <div className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-300 shadow-inner ${isGranted ? 'bg-[var(--gold)]' : 'bg-gray-300'}`}>
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={isGranted || false}
                            onChange={() => handleToggleClick(roleGroup.role, mod)}
                          />
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${isGranted ? 'translate-x-[1.125rem]' : 'translate-x-1'}`} />
                        </div>
                      </label>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Confirmation Modal */}
          {confirmModal && confirmModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 border border-[var(--gold)]/20 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">Confirm Action</h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to <strong>{confirmModal.action}</strong> the <strong>{confirmModal.module}</strong> menu for <strong>{confirmModal.role}</strong>?
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setConfirmModal(null)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--navy)] hover:bg-[var(--navy)]/90 rounded-lg transition-colors flex items-center gap-2"
                    onClick={confirmToggle}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Yes, Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Batch Confirmation Modal */}
          {batchConfirmModal && batchConfirmModal.isOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 shadow-xl max-w-sm w-full mx-4 border border-[var(--gold)]/20 animate-in zoom-in-95 duration-200">
                <h3 className="text-lg font-semibold text-[var(--navy)] mb-2">{batchConfirmModal.title}</h3>
                <p className="text-sm text-gray-600 mb-6">
                  {batchConfirmModal.message}
                </p>
                <div className="flex justify-end gap-3">
                  <button 
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    onClick={() => setBatchConfirmModal(null)}
                    disabled={isSaving}
                  >
                    Cancel
                  </button>
                  <button 
                    className="px-4 py-2 text-sm font-medium text-white bg-[var(--navy)] hover:bg-[var(--navy)]/90 rounded-lg transition-colors flex items-center gap-2"
                    onClick={confirmBatchToggle}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Yes, Confirm'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
