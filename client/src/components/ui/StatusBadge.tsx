import { statusStyles, formatStatus } from "../../lib/status";
import { cn } from "../../lib/utils";

export default function StatusBadge({ status }: { status: string }) {
  const key = status?.toLowerCase() || "pending";
  return (
    <span
      className={cn(
        "inline-flex px-2 py-0.5 text-xs font-medium rounded-md capitalize",
        statusStyles[key] || "bg-gray-50 text-gray-700"
      )}
    >
      {formatStatus(key)}
    </span>
  );
}
