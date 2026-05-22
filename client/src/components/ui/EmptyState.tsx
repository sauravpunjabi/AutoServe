import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionTo,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-12 text-center">
      <Icon className="mx-auto h-8 w-8 text-gray-300" />
      <h3 className="mt-4 text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-400">{description}</p>
      {actionLabel && actionTo && (
        <Link
          to={actionTo}
          className="mt-6 inline-block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
