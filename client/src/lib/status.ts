export const statusStyles: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700",
  approved: "bg-blue-50 text-blue-600",
  rejected: "bg-red-50 text-red-500",
  completed: "bg-emerald-50 text-emerald-600",
  open: "bg-gray-50 text-gray-700",
  in_progress: "bg-blue-50 text-blue-600",
  active: "bg-emerald-50 text-emerald-600",
  unpaid: "bg-amber-50 text-amber-700",
  paid: "bg-emerald-50 text-emerald-600",
  suspended: "bg-red-50 text-red-500",
};

export function formatStatus(status: string) {
  return status.replace(/_/g, " ");
}
