const fs = require('fs');
const path = require('path');
const dirs = ['src/pages/customer', 'src/pages/mechanic', 'src/pages/manager', 'src/pages/admin'];
dirs.forEach(d => fs.mkdirSync(path.join(__dirname, d), { recursive: true }));

const components = [
  ['src/pages/customer/Dashboard.tsx', 'CustomerDashboard'],
  ['src/pages/customer/Vehicles.tsx', 'CustomerVehicles'],
  ['src/pages/customer/BookService.tsx', 'CustomerBookService'],
  ['src/pages/customer/Bookings.tsx', 'CustomerBookings'],
  ['src/pages/customer/JobTracker.tsx', 'CustomerJobTracker'],
  ['src/pages/customer/Invoices.tsx', 'CustomerInvoices'],
  ['src/pages/customer/ServiceCenters.tsx', 'CustomerServiceCenters'],
  
  ['src/pages/mechanic/Dashboard.tsx', 'MechanicDashboard'],
  ['src/pages/mechanic/ServiceCenters.tsx', 'MechanicServiceCenters'],
  ['src/pages/mechanic/JobCards.tsx', 'MechanicJobCards'],
  ['src/pages/mechanic/JobCardDetail.tsx', 'MechanicJobCardDetail'],
  
  ['src/pages/manager/Dashboard.tsx', 'ManagerDashboard'],
  ['src/pages/manager/CreateServiceCenter.tsx', 'ManagerCreateServiceCenter'],
  ['src/pages/manager/ManageServiceCenter.tsx', 'ManagerManageServiceCenter'],
  ['src/pages/manager/Mechanics.tsx', 'ManagerMechanics'],
  ['src/pages/manager/Bookings.tsx', 'ManagerBookings'],
  ['src/pages/manager/BookingDetail.tsx', 'ManagerBookingDetail'],
  ['src/pages/manager/JobCards.tsx', 'ManagerJobCards'],
  ['src/pages/manager/JobCardDetail.tsx', 'ManagerJobCardDetail'],
  ['src/pages/manager/Inventory.tsx', 'ManagerInventory'],
  ['src/pages/manager/Invoices.tsx', 'ManagerInvoices'],
  ['src/pages/manager/Reviews.tsx', 'ManagerReviews'],
  
  ['src/pages/admin/Dashboard.tsx', 'AdminDashboard'],
  ['src/pages/admin/Users.tsx', 'AdminUsers'],
  ['src/pages/admin/ServiceCenters.tsx', 'AdminServiceCenters']
];

components.forEach(([file, name]) => {
  const filePath = path.join(__dirname, file);
  fs.writeFileSync(filePath, `export default function ${name}() { return <div className="p-8"><h1 className="text-2xl font-bold">${name}</h1></div>; }`);
});
console.log("Pages generated!");
