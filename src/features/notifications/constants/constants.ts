import type { NotificationItem } from '../types/types'

export const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: '1',
    title: 'New Organization Registered',
    organizationName: 'St. Xavier International School',
    description: 'Completed Step 1 institutional profile and registered admin credentials.',
    timestamp: '5 min ago',
    isRead: false,
    type: 'registration',
    tag: 'New Registration',
  },
  {
    id: '2',
    title: 'Documents Pending Verification',
    organizationName: 'Nalanda Global Academy',
    description: 'Submitted PAN Card and Registration Certificate for superadmin review.',
    timestamp: '42 min ago',
    isRead: false,
    type: 'documents',
    tag: 'Pending Review',
  },
  {
    id: '3',
    title: 'Head of Organization Updated',
    organizationName: 'Delhi Public School',
    description: 'Updated head administrator credentials and uploaded Aadhar verification.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'update',
    tag: 'Org Head',
  },
  {
    id: '4',
    title: 'Organization Account Approved',
    organizationName: 'Vidya Mandir PU College',
    description: 'Organization onboarding application verified and approved successfully.',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'approval',
    tag: 'Approved',
  },
]
