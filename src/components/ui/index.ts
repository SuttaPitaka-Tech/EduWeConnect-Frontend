/**
 * EduConnect UI Component Library — Public Barrel
 * Import ALL UI primitives from '@/components/ui'
 *
 * RULE: Never import from individual files directly.
 *   ❌ import { Button } from '@/components/ui/button'
 *   ✅ import { Button } from '@/components/ui'
 */

// ── Loading & Feedback ──────────────────────────────────────────
export { Spinner }                               from './spinner'
export { Toaster, toast }                        from './toaster'
export { Alert }                                 from './alert'
export { Skeleton, SkeletonRow, SkeletonCard }   from './skeleton'
export { Progress }                              from './progress'

// ── Actions ─────────────────────────────────────────────────────
export { Button }                                from './button'
export { ActionIconButton }                      from './action-icon-button'

// ── Form Controls ───────────────────────────────────────────────
export { Input }                                 from './input'
export { SearchInput, type SearchInputProps }     from './search-input'
export { Textarea }                              from './textarea'
export { Label, FormError }                      from './label'
export { Checkbox }                              from './checkbox'
export { Switch }                                from './switch'
export { RadioGroup }                            from './radio-group'

// ── Layout & Surfaces ───────────────────────────────────────────
export { Card, CardHeader, CardTitle, CardContent, CardFooter } from './card'
export { Separator }                             from './separator'
export { ScrollArea }                            from './scroll-area'
export { Divider, StatCard, EmptyState }         from './utils-ui'

// ── Data Display ─────────────────────────────────────────────────
export { Badge }                                 from './badge'
export { Avatar, AvatarImage, InitialsAvatar }   from './avatar'
export {
  Table, TableHead, TableBody,
  TableRow, TableHeader, TableCell,
}                                                from './table'

// ── Navigation ──────────────────────────────────────────────────
export { Tabs, TabPanel }                        from './tabs'
export { Breadcrumb }                            from './breadcrumb'
export {
  Pagination,
  AppPagination,
  MasterCodePagination,
  type PaginationProps,
  type AppPaginationProps,
  type MasterCodePaginationProps,
}                                                from './pagination'

// ── Overlays ────────────────────────────────────────────────────
export {
  Dialog, DialogContent, DialogClose,
  DialogHeader, DialogTitle, DialogDescription, DialogFooter,
}                                                from './dialog'
export {
  Sheet, SheetContent,
  SheetHeader, SheetTitle, SheetFooter,
}                                                from './sheet'
export { Dropdown, type DropdownOption, type DropdownProps, type DropdownFooterAction } from './dropdown'
export { SearchDropdown, type SearchDropdownProps } from './search-dropdown'
export { MultiSelectDropdown, type MultiSelectDropdownProps } from './multi-select-dropdown'
export { Popover, PopoverTrigger, PopoverContent } from './popover'
export { Tooltip }                               from './tooltip'
