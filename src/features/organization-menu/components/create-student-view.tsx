import { useState, useEffect, useCallback } from 'react'
import {
  ArrowLeft,
  Check,
  GraduationCap,
  Loader2,
  UserPlus,
  FileCheck,
  ExternalLink,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/auth-context'
import { studentService, StudentMember } from '../services/student.service'
import { CreateStudentForm } from './create-student-form'
import { StudentDetailView } from './student-detail-view'

interface CreateStudentViewProps {
  onBack?: () => void
  onSelectStandard?: (standard: string) => void
  onCreateStudent?: (standard: string) => void
}

export function CreateStudentView({ onBack, onSelectStandard, onCreateStudent }: CreateStudentViewProps) {
  const { user } = useAuth()
  const [standards, setStandards] = useState<string[]>([])
  const [selectedStandard, setSelectedStandard] = useState<string | null>(null)
  const [isLoadingStandards, setIsLoadingStandards] = useState(true)
  const [isCreatingStudent, setIsCreatingStudent] = useState(false)
  const [viewingStudent, setViewingStudent] = useState<StudentMember | null>(null)
  const [editingStudent, setEditingStudent] = useState<StudentMember | null>(null)
  const [confirmDeleteStudentId, setConfirmDeleteStudentId] = useState<string | null>(null)
  const [deletingStudentId, setDeletingStudentId] = useState<string | null>(null)

  // Students state for the active standard
  const [students, setStudents] = useState<StudentMember[]>([])
  const [isStudentsLoading, setIsStudentsLoading] = useState(false)

  const orgId = user?.institutionId || localStorage.getItem('lastRegisteredOrgId') || undefined

  const handleDeleteStudent = async (student: StudentMember) => {
    setDeletingStudentId(student.id)
    try {
      await studentService.delete(student.id)
      toast.success(`Student "${student.student_name}" deleted successfully`)
      if (selectedStandard) {
        fetchStudentsForStandard(selectedStandard)
      }
    } catch (err: any) {
      console.error('Failed to delete student:', err)
      toast.error(err.response?.data?.message || 'Failed to delete student')
    } finally {
      setDeletingStudentId(null)
      setConfirmDeleteStudentId(null)
    }
  }

  // Fetch approved standards from DB
  useEffect(() => {
    let isMounted = true

    async function loadStandards() {
      setIsLoadingStandards(true)
      try {
        const data = await studentService.getApprovedStandards(orgId)
        if (isMounted) {
          setStandards(data)
          if (data.length > 0) {
            setSelectedStandard(data[0])
            onSelectStandard?.(data[0])
          }
        }
      } catch (err) {
        console.error('Failed to load standards from database:', err)
        if (isMounted) {
          setStandards([])
        }
      } finally {
        if (isMounted) {
          setIsLoadingStandards(false)
        }
      }
    }

    loadStandards()

    return () => {
      isMounted = false
    }
  }, [orgId, onSelectStandard])

  // Fetch students for the currently selected standard
  const fetchStudentsForStandard = useCallback(async (std: string) => {
    setIsStudentsLoading(true)
    try {
      const records = await studentService.list(orgId, std)
      setStudents(records)
    } catch (err) {
      console.error(`Failed to load students for standard ${std}:`, err)
      setStudents([])
    } finally {
      setIsStudentsLoading(false)
    }
  }, [orgId])

  useEffect(() => {
    if (selectedStandard) {
      fetchStudentsForStandard(selectedStandard)
    }
  }, [selectedStandard, fetchStudentsForStandard])

  const handleStandardClick = (std: string) => {
    setSelectedStandard(std)
    onSelectStandard?.(std)
  }

  const handleCreateSuccess = () => {
    setIsCreatingStudent(false)
    if (selectedStandard) {
      fetchStudentsForStandard(selectedStandard)
    }
  }

  if (viewingStudent) {
    return (
      <StudentDetailView
        student={viewingStudent}
        onBack={() => setViewingStudent(null)}
        onEdit={(st) => {
          setViewingStudent(null)
          setEditingStudent(st)
        }}
        onDelete={() => {
          setViewingStudent(null)
          if (selectedStandard) fetchStudentsForStandard(selectedStandard)
        }}
      />
    )
  }

  if (editingStudent) {
    return (
      <CreateStudentForm
        mode="edit"
        initialData={editingStudent}
        standard={selectedStandard || editingStudent.standard}
        onBack={() => setEditingStudent(null)}
        onSuccess={() => {
          setEditingStudent(null)
          if (selectedStandard) fetchStudentsForStandard(selectedStandard)
        }}
      />
    )
  }

  if (isCreatingStudent && selectedStandard) {
    return (
      <CreateStudentForm
        mode="create"
        standard={selectedStandard}
        onBack={() => setIsCreatingStudent(false)}
        onSuccess={handleCreateSuccess}
      />
    )
  }

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn pb-12">
      {/* ── Top Card: Creating Student & Standards Approved ───────────── */}
      <div className="bg-white/95 rounded-2xl p-6 lg:p-8 border border-[var(--border)] shadow-sm flex flex-col gap-6">
        {/* Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
          <div className="flex items-center gap-4">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="w-10 h-10 rounded-xl border border-[var(--border)] bg-white hover:bg-[var(--cream)]/60 text-[var(--navy)] flex items-center justify-center shadow-2xs active:scale-95 transition-all cursor-pointer shrink-0"
                title="Back to Users Directory"
              >
                <ArrowLeft className="w-5 h-5 text-[var(--navy)]" />
              </button>
            )}
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl lg:text-2xl font-serif font-bold text-[var(--navy)]">
                  Creating Student
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                  Admissions
                </span>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5 font-medium">
                Select an approved educational grade to onboard students for this standard.
              </p>
            </div>
          </div>

          {onBack && (
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="h-10 px-4 rounded-xl border border-[var(--border)] bg-white text-[var(--navy)] hover:bg-[var(--cream)]/60 font-semibold text-xs gap-2 shadow-2xs cursor-pointer self-start sm:self-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Users</span>
            </Button>
          )}
        </div>

        {/* Sub Header: Standards Approved */}
        <div className="flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--navy)]">
                Standards Approved
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[var(--cream)] text-[var(--navy)] border border-[var(--gold)]/30 font-mono">
                {standards.length} Available
              </span>
            </div>

            {selectedStandard && (
              <div className="text-xs text-[var(--text-secondary)] font-medium hidden sm:flex items-center gap-1.5">
                <span>Selected:</span>
                <span className="font-bold text-[var(--navy)] bg-[var(--gold)]/15 px-2 py-0.5 rounded-md border border-[var(--gold)]/30">
                  {selectedStandard}
                </span>
              </div>
            )}
          </div>

          {/* Standards Buttons List (100% strictly from Database) */}
          {isLoadingStandards ? (
            <div className="flex items-center gap-3 py-4 text-xs text-[var(--text-secondary)]">
              <Loader2 className="w-4 h-4 animate-spin text-[var(--gold)]" />
              <span>Loading approved institution standards from database...</span>
            </div>
          ) : standards.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {standards.map((std) => {
                const isSelected = selectedStandard === std
                return (
                  <button
                    key={std}
                    type="button"
                    onClick={() => handleStandardClick(std)}
                    className={`h-10 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-[var(--navy)] text-white border-[var(--navy)] shadow-sm scale-[1.02] ring-2 ring-[var(--gold)]/40'
                        : 'bg-white text-[var(--navy)] border-[var(--border)] hover:border-[var(--gold)] hover:bg-[var(--cream)]/50 active:scale-95'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-[var(--gold)]" />}
                    <span>{std}</span>
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="py-6 px-4 rounded-xl border border-dashed border-[var(--border)] bg-[#FCFBF7] text-center">
              <p className="text-xs text-[var(--text-secondary)] font-medium">
                No approved standards found for this institution in the database.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* ── Table for Selected Standard ───────── */}
      {selectedStandard && (
        <div className="bg-white/95 rounded-2xl p-6 border border-[var(--border)] shadow-sm flex flex-col gap-4 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-serif font-bold text-[var(--navy)]">
                  Students — {selectedStandard}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30 font-mono">
                  {students.length} Records
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs text-[var(--text-secondary)] font-medium hidden sm:inline">
                  Standard: <strong className="text-[var(--navy)]">{selectedStandard}</strong>
                </span>

                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setIsCreatingStudent(true)
                    onCreateStudent?.(selectedStandard)
                  }}
                  className="h-9 px-4 rounded-xl bg-[var(--navy)] hover:bg-[var(--deep-navy)] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5 text-[var(--gold)]" />
                  <span>Create Student</span>
                </Button>
              </div>
            </div>

            <div className="w-full overflow-x-auto rounded-xl border border-[var(--border)]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[var(--cream)]/60 border-b border-[var(--border)] text-[11px] font-bold uppercase tracking-wider text-[var(--navy)]">
                    <th className="py-3 px-4">Student ID</th>
                    <th className="py-3 px-4">Student Name</th>
                    <th className="py-3 px-4">Roll Number</th>
                    <th className="py-3 px-4">STD</th>
                    <th className="py-3 px-4">Aadhaar Verified</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)] text-xs text-[var(--text-secondary)] font-medium">
                  {isStudentsLoading ? (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <div className="flex items-center justify-center gap-2.5 text-xs text-[var(--text-secondary)]">
                          <Loader2 className="w-4 h-4 animate-spin text-[var(--gold)]" />
                          <span>Loading enrolled students for {selectedStandard}...</span>
                        </div>
                      </td>
                    </tr>
                  ) : students.length > 0 ? (
                    students.map((st) => (
                      <tr key={st.id} className="hover:bg-[var(--cream)]/30 transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[var(--navy)] text-xs">
                          {st.id.slice(0, 8).toUpperCase()}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-[var(--navy)]">{st.student_name}</span>
                            <span className="text-[11px] text-[var(--text-secondary)] font-mono">
                              {st.contact_mobile || st.contact_email || 'No direct contact'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-mono font-bold text-[var(--navy)]">
                          <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200/80 font-bold">
                            {st.roll_number || '—'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded-md bg-[var(--gold)]/15 text-[var(--navy)] font-bold text-[11px] border border-[var(--gold)]/30">
                            {st.standard}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {st.student_aadhar_file_id ? (
                            <button
                              type="button"
                              onClick={async () => {
                                try {
                                  const url = await studentService.getDownloadUrl(st.student_aadhar_file_id!)
                                  window.open(url, '_blank')
                                } catch (err) {
                                  console.error('Failed to open Aadhaar document:', err)
                                  toast.error('Unable to retrieve Aadhaar file from storage.')
                                }
                              }}
                              className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-md border border-emerald-200 transition-colors cursor-pointer shadow-2xs group/btn"
                              title="Click to view Aadhaar document stored in MinIO"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                              <span>View Doc</span>
                              <ExternalLink className="w-3 h-3 text-emerald-600 opacity-60 group-hover/btn:opacity-100 transition-opacity" />
                            </button>
                          ) : (
                            <span className="text-[11px] text-gray-400 italic">None</span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10.5px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                            {st.status || 'Active'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 whitespace-nowrap text-right">
                          {confirmDeleteStudentId === st.id ? (
                            <div className="inline-flex items-center gap-1.5 bg-rose-50 border border-rose-200 p-1 rounded-xl animate-fadeIn">
                              <span className="text-[11px] font-bold text-rose-700 px-1">Delete?</span>
                              <button
                                type="button"
                                disabled={deletingStudentId === st.id}
                                onClick={() => handleDeleteStudent(st)}
                                className="px-2.5 py-1 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-2xs"
                              >
                                {deletingStudentId === st.id ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Trash2 className="w-3 h-3" />
                                )}
                                <span>Yes</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStudentId(null)}
                                className="px-2 py-1 rounded-lg text-gray-500 hover:bg-gray-200 text-[11px] font-medium cursor-pointer"
                              >
                                No
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Option */}
                              <button
                                type="button"
                                onClick={() => setViewingStudent(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--navy)] bg-[var(--cream)]/70 hover:bg-[var(--gold)]/20 border border-[var(--gold)]/35 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                                title="View Student Details"
                              >
                                <Eye className="w-3.5 h-3.5 text-[var(--gold)]" />
                                <span>View</span>
                              </button>

                              {/* Edit Option */}
                              <button
                                type="button"
                                onClick={() => setEditingStudent(st)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold text-[var(--navy)] bg-white hover:bg-blue-50/80 hover:text-blue-700 border border-[var(--border)] hover:border-blue-300 shadow-2xs hover:shadow-xs active:scale-95 transition-all cursor-pointer"
                                title="Edit Student"
                              >
                                <Pencil className="w-3.5 h-3.5 text-blue-600" />
                                <span>Edit</span>
                              </button>

                              {/* Delete Option */}
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteStudentId(st.id)}
                                className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
                                title="Delete Student"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-12 px-4 text-center">
                        <p className="text-xs text-[var(--text-secondary)] font-medium">
                          No students enrolled in <strong className="text-[var(--navy)]">{selectedStandard}</strong> yet.
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
    </div>
  )
}
