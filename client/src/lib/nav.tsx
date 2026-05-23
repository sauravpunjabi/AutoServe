import {
  LayoutDashboard,
  Car,
  Calendar,
  FileText,
  Search,
  Briefcase,
  Users,
  Package,
  Star,
  Building2,
  User,
} from 'lucide-react';

export const customerNav = [
  { name: 'Overview', path: '/customer/dashboard', icon: LayoutDashboard },
  { name: 'My Vehicles', path: '/customer/vehicles', icon: Car },
  { name: 'Appointments', path: '/customer/bookings', icon: Calendar },
  { name: 'Invoices', path: '/customer/invoices', icon: FileText },
  { name: 'Find Center', path: '/customer/service-centers', icon: Search },
];

export const managerNav = [
  { name: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
  { name: 'Schedule', path: '/manager/bookings', icon: Calendar },
  { name: 'Job Cards', path: '/manager/job-cards', icon: Briefcase },
  { name: 'Mechanics', path: '/manager/mechanics', icon: Users },
  { name: 'Inventory', path: '/manager/inventory', icon: Package },
  { name: 'Invoices', path: '/manager/invoices', icon: FileText },
  { name: 'Reviews', path: '/manager/reviews', icon: Star },
  { name: 'Service Center', path: '/manager/service-center/manage', icon: Building2 },
  { name: 'Profile', path: '/manager/profile', icon: User },
];

export const mechanicNav = [
  { name: 'Dashboard', path: '/mechanic/dashboard', icon: LayoutDashboard },
  { name: 'Job Cards', path: '/mechanic/job-cards', icon: Briefcase },
  { name: 'Service Centers', path: '/mechanic/service-centers', icon: Building2 },
  { name: 'Profile', path: '/mechanic/profile', icon: User },
];

export const adminNav = [
  { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Users', path: '/admin/users', icon: Users },
  { name: 'Service Centers', path: '/admin/service-centers', icon: Building2 },
];
