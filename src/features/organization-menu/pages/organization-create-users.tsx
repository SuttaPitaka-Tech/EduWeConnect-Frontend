import { useState } from 'react'
import { UserCheck, GraduationCap, Users } from 'lucide-react'
import { Button } from '@/components/ui'
import { toast } from 'sonner'
import { CreateStaffForm } from '../components/create-staff-form'
import { UsersListTable, StaffMember, StudentMember } from '../components/users-list-table'
import { StaffDetailView } from '../components/staff-detail-view'
import { CreateStudentView } from '../components/create-student-view'
import { StudentDetailView } from '../components/student-detail-view'
import { CreateStudentForm } from '../components/create-student-form'

export default function OrganizationCreateUsers() {
  const [activeView, setActiveView] = useState<
    'main' | 'create-staff' | 'edit-staff' | 'view-staff' | 'create-student' | 'view-student' | 'edit-student'
  >('main')
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentMember | null>(null)

  const handleAction = (type: string) => {
    if (type === 'Staff') {
      setSelectedStaff(null)
      setSelectedStudent(null)
      setActiveView('create-staff')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else if (type === 'Student') {
      setSelectedStaff(null)
      setSelectedStudent(null)
      setActiveView('create-student')
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      toast.info(`Create ${type} form will be configured next.`)
    }
  }

  const handleViewStaff = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setActiveView('view-staff')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditStaff = (staff: StaffMember) => {
    setSelectedStaff(staff)
    setActiveView('edit-staff')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleViewStudent = (student: StudentMember) => {
    setSelectedStudent(student)
    setActiveView('view-student')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleEditStudent = (student: StudentMember) => {
    setSelectedStudent(student)
    setActiveView('edit-student')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex-1 w-full p-5 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto animate-fadeIn">
      {/* ── 1. Create Staff Form (Inline) ─────────────────────────────────── */}
      {activeView === 'create-staff' && (
        <CreateStaffForm
          mode="create"
          onBack={() => {
            setSelectedStaff(null)
            setActiveView('main')
          }}
        />
      )}

      {/* ── 2. Edit Staff Form (Inline) ───────────────────────────────────── */}
      {activeView === 'edit-staff' && selectedStaff && (
        <CreateStaffForm
          mode="edit"
          initialData={selectedStaff}
          onBack={() => {
            setSelectedStaff(null)
            setActiveView('main')
          }}
        />
      )}

      {/* ── 3. Staff Detail View (Inline - No Popup) ──────────────────────── */}
      {activeView === 'view-staff' && selectedStaff && (
        <StaffDetailView
          staff={selectedStaff}
          onBack={() => {
            setSelectedStaff(null)
            setActiveView('main')
          }}
          onEdit={(staff) => {
            setSelectedStaff(staff)
            setActiveView('edit-staff')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onDelete={() => {
            setSelectedStaff(null)
            setActiveView('main')
          }}
        />
      )}

      {/* ── 4. Create Student View (Inline Welcome Page) ──────────────────── */}
      {activeView === 'create-student' && (
        <CreateStudentView
          onBack={() => {
            setActiveView('main')
          }}
        />
      )}

      {/* ── 5. View Student Profile (Inline) ───────────────────────────────── */}
      {activeView === 'view-student' && selectedStudent && (
        <StudentDetailView
          student={selectedStudent}
          onBack={() => {
            setSelectedStudent(null)
            setActiveView('main')
          }}
          onEdit={(student) => {
            setSelectedStudent(student)
            setActiveView('edit-student')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          onDelete={() => {
            setSelectedStudent(null)
            setActiveView('main')
          }}
        />
      )}

      {/* ── 6. Edit Student Form (Inline) ──────────────────────────────────── */}
      {activeView === 'edit-student' && selectedStudent && (
        <CreateStudentForm
          mode="edit"
          initialData={selectedStudent}
          standard={selectedStudent.standard}
          onBack={() => {
            setSelectedStudent(null)
            setActiveView('main')
          }}
          onSuccess={() => {
            setSelectedStudent(null)
            setActiveView('main')
          }}
        />
      )}

      {/* ── 7. Main View: Header + Registered Institutional Users Table ───── */}
      {activeView === 'main' && (
        <>
          {/* Page Header & Action Buttons Bar */}
          <div className="bg-white/95 rounded-2xl p-5 lg:p-6 border border-[var(--border)] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl lg:text-3xl font-serif font-bold text-[var(--navy)]">
                  Create Users
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[var(--gold)]/15 text-[var(--navy)] border border-[var(--gold)]/30">
                  User Management
                </span>
              </div>
              <p className="text-xs lg:text-sm text-[var(--text-secondary)] font-medium mt-1">
                Choose a role below to onboard new staff members, students, or parents to your institution.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0">
              <Button
                variant="outline"
                size="md"
                onClick={() => handleAction('Staff')}
                className="h-10 px-4 rounded-xl border border-[var(--gold)] bg-white text-[var(--navy)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs sm:text-sm gap-2 shadow-xs hover:shadow active:scale-[0.98] transition-all cursor-pointer"
              >
                <UserCheck className="w-4 h-4 text-[var(--gold)]" />
                <span>Create Staff</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleAction('Student')}
                className="h-10 px-4 rounded-xl border border-[var(--gold)] bg-white text-[var(--navy)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs sm:text-sm gap-2 shadow-xs hover:shadow active:scale-[0.98] transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-[var(--gold)]" />
                <span>Create Student</span>
              </Button>

              <Button
                variant="outline"
                size="md"
                onClick={() => handleAction('Parents')}
                className="h-10 px-4 rounded-xl border border-[var(--gold)] bg-white text-[var(--navy)] hover:bg-[var(--gold)]/10 hover:border-[var(--gold)] font-bold text-xs sm:text-sm gap-2 shadow-xs hover:shadow active:scale-[0.98] transition-all cursor-pointer"
              >
                <Users className="w-4 h-4 text-[var(--gold)]" />
                <span>Create Parents</span>
              </Button>
            </div>
          </div>

          {/* Registered Users Table (Staff, Students, Parents) */}
          <UsersListTable
            onCreateStaffClick={() => handleAction('Staff')}
            onCreateStudentClick={() => handleAction('Student')}
            onCreateParentsClick={() => handleAction('Parents')}
            onViewStaff={handleViewStaff}
            onEditStaff={handleEditStaff}
            onViewStudent={handleViewStudent}
            onEditStudent={handleEditStudent}
          />
        </>
      )}
    </div>
  )
}

