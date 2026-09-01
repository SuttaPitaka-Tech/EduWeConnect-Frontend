import * as React from 'react'
import {
  Sparkles,
  Users,
  Calendar,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Sliders,
  Eye,
  Pencil,
  Trash2,
} from 'lucide-react'
import {
  toast,
  Button,
  ActionIconButton,
  Input,
  SearchInput,
  Textarea,
  Label,
  FormError,
  Dropdown,
  SearchDropdown,
  MultiSelectDropdown,
  Checkbox,
  Switch,
  RadioGroup,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Separator,
  Divider,
  StatCard,
  EmptyState,
  Badge,
  Avatar,
  InitialsAvatar,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeader,
  TableCell,
  Tabs,
  TabPanel,
  Breadcrumb,
  AppPagination,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Spinner,
  Alert,
  Skeleton,
  SkeletonCard,
  Progress,
  type DropdownOption,
} from '@/components/ui'

const SAMPLE_DROPDOWN_OPTIONS: DropdownOption[] = [
  { value: '', label: 'Select option...' },
  { value: 'option_1', label: 'Mathematics - Grade 10' },
  { value: 'option_2', label: 'Physics - Grade 11' },
  { value: 'option_3', label: 'Chemistry - Grade 12' },
  { value: 'option_4', label: 'Biology - Grade 10 (Disabled)', disabled: true },
]

export default function UiShowcasePage() {
  // Form states
  const [searchValue, setSearchValue] = React.useState('Aarav Sharma')
  const [dropdownValue, setDropdownValue] = React.useState('option_1')
  const [searchDropdownVal, setSearchDropdownVal] = React.useState('option_2')
  const [multiSelectVal, setMultiSelectVal] = React.useState<string[]>(['option_1', 'option_2'])
  const [checkboxVal, setCheckboxVal] = React.useState(true)
  const [switchVal, setSwitchVal] = React.useState(true)
  const [radioVal, setRadioVal] = React.useState('student')
  const [progressVal] = React.useState(68)

  // Overlay states
  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [sheetOpen, setSheetOpen] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState('overview')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(10)

  return (
    <div className="space-y-8 pb-16">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-1 border-b pb-4" style={{ borderColor: 'var(--border, #DED5C5)' }}>
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--navy,#102A43)] text-white shadow">
            <Sparkles className="size-5 text-[var(--gold,#B8862C)]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--navy,#102A43)]">
              EduWeConnect Design System & UI Showcase
            </h1>
            <p className="text-xs text-[var(--text-muted,#7C8794)]">
              Interactive preview of all 31 design tokens and UI primitives in <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[11px]">src/components/ui/</code>
            </p>
          </div>
        </div>
      </div>

      {/* ── Section 1: Brand Color Tokens ── */}
      <div className="space-y-3">
        <h2 className="text-sm font-bold text-[var(--navy,#102A43)]">1. Brand Design Tokens</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 md:grid-cols-7">
          {[
            { name: '--navy', hex: '#102A43', text: 'text-white' },
            { name: '--deep-navy', hex: '#0B1F33', text: 'text-white' },
            { name: '--gold', hex: '#B8862C', text: 'text-white' },
            { name: '--light-gold', hex: '#D6A84F', text: 'text-slate-900' },
            { name: '--cream', hex: '#F7F1E3', text: 'text-slate-900' },
            { name: '--warm-white', hex: '#FFFDF8', text: 'text-slate-900' },
            { name: '--border', hex: '#DED5C5', text: 'text-slate-900' },
          ].map((token) => (
            <div
              key={token.name}
              className="flex flex-col gap-1.5 rounded-xl border p-3 shadow-sm"
              style={{ backgroundColor: token.hex, borderColor: 'var(--border, #DED5C5)' }}
            >
              <span className={`font-mono text-xs font-bold ${token.text}`}>{token.name}</span>
              <span className={`text-[11px] opacity-80 ${token.text}`}>{token.hex}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Buttons & Actions ── */}
      <Card>
        <CardHeader>
          <CardTitle>2. Buttons & Action Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary Button</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="primary" disabled>Disabled</Button>
          </div>

          <Divider label="Button Loading States (All Variants with Right-aligned Spinners)" />

          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" isLoading>
              Primary Loading
            </Button>
            <Button variant="outline" isLoading>
              Outline Loading
            </Button>
            <Button variant="secondary" isLoading>
              Secondary Loading
            </Button>
            <Button variant="danger" isLoading>
              Danger Loading
            </Button>
            <Button variant="ghost" isLoading>
              Ghost Loading
            </Button>
            <Button variant="gold" isLoading>
              Gold Loading
            </Button>
          </div>

          <Divider label="Icon Action Buttons" />

          <div className="flex items-center gap-2">
            <ActionIconButton variant="view" icon={Eye} label="View Record" />
            <ActionIconButton variant="edit" icon={Pencil} label="Edit Record" />
            <ActionIconButton variant="delete" icon={Trash2} label="Delete Record" />
          </div>
        </CardContent>
      </Card>

      {/* ── Section 3: Form Controls ── */}
      <Card>
        <CardHeader>
          <CardTitle>3. Form Controls & Inputs</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Text Input & Search */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="demo-input">Standard Input (Label + Focus State)</Label>
              <Input id="demo-input" placeholder="Enter full name..." defaultValue="Aarav Sharma" />
            </div>

            <div className="space-y-1.5">
              <Label>SearchInput (with instant clear X button)</Label>
              <SearchInput
                placeholder="Search students, faculty..."
                value={searchValue}
                onChange={setSearchValue}
                onClear={() => setSearchValue('')}
              />
              <p className="text-[11px] text-slate-500">Current value: "{searchValue}"</p>
            </div>

            <div className="space-y-1.5">
              <Label>Custom Dropdown (Standard, clearable X)</Label>
              <Dropdown
                value={dropdownValue}
                onChange={setDropdownValue}
                options={SAMPLE_DROPDOWN_OPTIONS}
                placeholder="Choose subject..."
                clearable={true}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Search Dropdown (With live search filter inside popup)</Label>
              <SearchDropdown
                value={searchDropdownVal}
                onChange={setSearchDropdownVal}
                options={SAMPLE_DROPDOWN_OPTIONS}
                placeholder="Search & choose subject..."
                searchPlaceholder="Type to filter subjects..."
                clearable={true}
              />
            </div>

            <div className="space-y-1.5">
              <Label>Multi-Select Dropdown (Search + Checkboxes + Badges)</Label>
              <MultiSelectDropdown
                value={multiSelectVal}
                onChange={setMultiSelectVal}
                options={SAMPLE_DROPDOWN_OPTIONS.filter((o) => o.value)}
                placeholder="Select multiple subjects..."
                searchPlaceholder="Filter subjects..."
                clearable={true}
              />
            </div>
          </div>

          {/* Selection & Toggles */}
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Textarea</Label>
              <Textarea placeholder="Type administrative notes or remarks here..." rows={3} />
              <FormError message="Sample inline validation error state" />
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Checkbox
                id="demo-chk"
                label="Send SMS notification"
                checked={checkboxVal}
                onCheckedChange={(checked) => setCheckboxVal(checked === true)}
              />

              <Switch
                id="demo-sw"
                label="Active Status"
                checked={switchVal}
                onChange={(e) => setSwitchVal(e.target.checked)}
              />
            </div>

            <div className="space-y-1.5 pt-1">
              <Label>RadioGroup</Label>
              <RadioGroup
                name="user-type"
                direction="row"
                value={radioVal}
                onChange={setRadioVal}
                options={[
                  { value: 'student', label: 'Student' },
                  { value: 'faculty', label: 'Faculty' },
                  { value: 'parent', label: 'Parent' },
                ]}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 4: Stat Cards & Progress ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        <StatCard
          label="Total Enrolled"
          value="1,420"
          icon={<Users className="size-4 text-[var(--navy,#102A43)]" />}
          trend="up"
          trendValue="+12% this month"
        />
        <StatCard
          label="Today's Attendance"
          value="94.6%"
          icon={<CheckCircle className="size-4 text-green-600" />}
          trend="up"
          trendValue="+2.1% vs avg"
        />
        <StatCard
          label="Pending Fees"
          value="₹ 4.8 L"
          icon={<AlertCircle className="size-4 text-amber-600" />}
          trend="down"
          trendValue="-8% collection"
        />
        <StatCard
          label="Upcoming Exams"
          value="18"
          icon={<Calendar className="size-4 text-[var(--navy,#102A43)]" />}
          trend="neutral"
          trendValue="Scheduled"
        />
      </div>

      {/* ── Section 5: Badges, Avatars, Alerts, Skeletons ── */}
      <Card>
        <CardHeader>
          <CardTitle>4. Badges, Avatars, Alerts & Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Badges & Avatars */}
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-2">
              <Badge variant="success">Present</Badge>
              <Badge variant="danger">Absent</Badge>
              <Badge variant="warning">Late</Badge>
              <Badge variant="gold">Honor Roll</Badge>
              <Badge variant="outline">Draft</Badge>
              <Badge variant="default">Standard</Badge>
            </div>

            <div className="flex items-center gap-2 border-l pl-6" style={{ borderColor: 'var(--border, #DED5C5)' }}>
              <InitialsAvatar name="Aarav Sharma" size="md" />
              <InitialsAvatar name="Priya Nair" size="md" />
              <Avatar size="md">
                <span className="font-semibold text-xs">SC</span>
              </Avatar>
            </div>

            <div className="flex items-center gap-5 border-l pl-6" style={{ borderColor: 'var(--border, #DED5C5)' }}>
              <div className="flex items-center gap-2">
                <Spinner size={18} />
                <span className="text-[11px] text-slate-500 font-medium">18px</span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size={24} />
                <span className="text-[11px] text-slate-500 font-medium">24px (Standard)</span>
              </div>
              <div className="flex items-center gap-2">
                <Spinner size={34} />
                <span className="text-[11px] text-slate-500 font-medium">34px (Large Loader)</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-slate-700">Course Completion Progress</span>
              <span className="font-bold text-[var(--navy,#102A43)]">{progressVal}%</span>
            </div>
            <Progress value={progressVal} />
          </div>

          {/* Alerts */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Alert variant="info" title="System Notice">
              End-of-term examinations commence next Monday. Hall tickets are available.
            </Alert>
            <Alert variant="success" title="Backup Complete">
              Database snapshot synchronized successfully with cloud backup.
            </Alert>
            <Alert variant="warning" title="Fee Due Reminder">
              12 students have overdue installments for Term 2.
            </Alert>
            <Alert variant="danger" title="Unauthorized Entry Alert">
              Security gateway flagged an unverified RFID badge at North Gate.
            </Alert>
          </div>

          {/* Skeletons */}
          <div className="space-y-2">
            <Label>Skeleton Loading Placeholders</Label>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <SkeletonCard />
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <SkeletonCard />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 6: Interactive Overlays & Modals ── */}
      <Card>
        <CardHeader>
          <CardTitle>5. Modals, Drawers, Popovers & Toast Triggers</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-center gap-4">
          {/* Dialog Button */}
          <Button variant="primary" onClick={() => setDialogOpen(true)}>
            Open Dialog Modal
          </Button>

          {/* Sheet Drawer Button */}
          <Button variant="outline" onClick={() => setSheetOpen(true)}>
            Open Side Sheet Drawer
          </Button>

          {/* Popover */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="secondary">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-[var(--navy,#102A43)]">Popover Header</h4>
                <p className="text-xs text-slate-600">
                  Solid opaque white background with smooth Radix fade & zoom micro-animations.
                </p>
              </div>
            </PopoverContent>
          </Popover>

          {/* Tooltip */}
          <Tooltip content="Tooltip with dark navy background & micro-animation">
            <button className="flex h-9 items-center gap-1.5 rounded-lg border bg-white px-3 text-xs text-slate-700 hover:bg-slate-50">
              <HelpCircle className="size-3.5 text-slate-400" />
              Hover for Tooltip
            </button>
          </Tooltip>

          {/* Toast Notification Triggers */}
          <div className="w-full pt-2">
            <Divider label="Toast Notifications (All Variants)" />
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <Button
                variant="outline"
                className="border-green-300 text-green-700 hover:bg-green-50"
                onClick={() =>
                  toast.success('Attendance Marked Successfully', {
                    description: 'Student attendance saved and synced with cloud.',
                  })
                }
              >
                ✅ Success Toast
              </Button>

              <Button
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={() =>
                  toast.error('Failed to Save Record', {
                    description: 'Unable to connect to server. Please try again.',
                  })
                }
              >
                ❌ Error Toast
              </Button>

              <Button
                variant="outline"
                className="border-amber-300 text-amber-700 hover:bg-amber-50"
                onClick={() =>
                  toast.warning('Fee Installment Overdue', {
                    description: 'Term 2 fee deadline expires in 2 days.',
                  })
                }
              >
                ⚠️ Warning Toast
              </Button>

              <Button
                variant="outline"
                className="border-blue-300 text-blue-700 hover:bg-blue-50"
                onClick={() =>
                  toast.info('New Timetable Published', {
                    description: 'Final examination schedule is now available.',
                  })
                }
              >
                ℹ️ Info Toast
              </Button>

              <Button
                variant="outline"
                className="border-[var(--navy,#102A43)] text-[var(--navy,#102A43)] hover:bg-slate-50"
                onClick={() => {
                  const promise = new Promise((resolve) => setTimeout(resolve, 2000))
                  toast.promise(promise, {
                    loading: 'Generating Report Card PDF...',
                    success: 'Report Card downloaded successfully!',
                    error: 'Error generating PDF.',
                  })
                }}
              >
                ⏳ Loading / Promise Toast
              </Button>

              <Button
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                onClick={() =>
                  toast('Student Record Archived', {
                    description: 'Item removed from active roster.',
                    action: {
                      label: 'Undo',
                      onClick: () => toast.success('Action reversed! Record restored.'),
                    },
                  })
                }
              >
                ↩️ Action (Undo) Toast
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── Section 7: Data Table & Navigation ── */}
      <Card>
        <CardHeader>
          <CardTitle>6. Data Table, Tabs, Breadcrumb & Pagination</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* Breadcrumb */}
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Administration' },
              { label: 'UI Showcase' },
            ]}
          />

          {/* Tabs */}
          <Tabs
            items={[
              { key: 'overview', label: 'Class Overview' },
              { key: 'students', label: 'Student Directory' },
              { key: 'reports', label: 'Academic Reports' },
            ]}
            activeKey={activeTab}
            onChange={setActiveTab}
          />
          <TabPanel tabKey="overview" activeKey={activeTab}>
            <p className="text-xs text-slate-600">Active Tab Panel: Class Overview Metrics & Summary</p>
          </TabPanel>
          <TabPanel tabKey="students" activeKey={activeTab}>
            <p className="text-xs text-slate-600">Active Tab Panel: Full Student Roster & Demographics</p>
          </TabPanel>
          <TabPanel tabKey="reports" activeKey={activeTab}>
            <p className="text-xs text-slate-600">Active Tab Panel: Published Examination Gradebooks</p>
          </TabPanel>

          {/* Sample Table */}
          <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'var(--border, #DED5C5)' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>#</TableHeader>
                  <TableHeader>Student Name</TableHeader>
                  <TableHeader>Class / Section</TableHeader>
                  <TableHeader>Attendance Status</TableHeader>
                  <TableHeader className="text-right">Actions</TableHeader>
                </TableRow>
              </TableHead>
              <TableBody>
                {[
                  { id: '1', name: 'Aarav Sharma', class: 'Class 10 - A', status: 'present' },
                  { id: '2', name: 'Priya Nair', class: 'Class 10 - A', status: 'absent' },
                  { id: '3', name: 'Rohan Patel', class: 'Class 10 - A', status: 'late' },
                ].map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-mono text-xs text-slate-400">{row.id}</TableCell>
                    <TableCell className="font-medium text-[var(--navy,#102A43)]">{row.name}</TableCell>
                    <TableCell>{row.class}</TableCell>
                    <TableCell>
                      <Badge variant={row.status === 'present' ? 'success' : row.status === 'absent' ? 'danger' : 'warning'}>
                        {row.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <ActionIconButton variant="edit" icon={Pencil} label="Edit" />
                      <ActionIconButton variant="delete" icon={Trash2} label="Delete" className="ml-1" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Master AppPagination Component */}
          <AppPagination
            totalItems={142}
            currentPage={currentPage}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[5, 10, 20, 50]}
          />
        </CardContent>
      </Card>

      {/* ── Section 8: Empty State ── */}
      <Card>
        <CardContent className="pt-6">
          <EmptyState
            icon={<Sliders className="size-6 text-[var(--navy,#102A43)]" />}
            title="No Records Found"
            description="Try adjusting your filter criteria or search query to find records."
            action={
              <Button variant="primary" className="mt-2" onClick={() => toast.info('Resetting filters...')}>
                Reset Filter Parameters
              </Button>
            }
          />
        </CardContent>
      </Card>

      {/* ── Dialog Component Modal ── */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmation Dialog Modal</DialogTitle>
            <DialogDescription>
              This modal uses WAI-ARIA accessible focus traps and smooth animations.
            </DialogDescription>
          </DialogHeader>
          <div className="py-3 text-xs text-slate-600">
            Are you sure you want to approve the annual fee schedule for this academic year?
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                setDialogOpen(false)
                toast.success('Fee schedule approved!')
              }}
            >
              Confirm Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Sheet Component Drawer ── */}
      <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
        <SheetHeader>
          <SheetTitle>Student Details Drawer</SheetTitle>
        </SheetHeader>
        <SheetContent className="space-y-4">
          <div className="flex items-center gap-3">
            <InitialsAvatar name="Aarav Sharma" size="lg" />
            <div>
              <h3 className="text-sm font-bold text-[var(--navy,#102A43)]">Aarav Sharma</h3>
              <p className="text-xs text-slate-500">Roll No: 1042 · Class 10 - A</p>
            </div>
          </div>
          <Separator />
          <div className="space-y-2 text-xs">
            <p><strong className="text-slate-700">Guardian:</strong> Rajesh Sharma</p>
            <p><strong className="text-slate-700">Contact:</strong> +91 98765 43210</p>
            <p><strong className="text-slate-700">Attendance:</strong> 96.4% (Present)</p>
          </div>
        </SheetContent>
        <SheetFooter>
          <Button variant="outline" className="w-full" onClick={() => setSheetOpen(false)}>
            Close Drawer
          </Button>
        </SheetFooter>
      </Sheet>
    </div>
  )
}
