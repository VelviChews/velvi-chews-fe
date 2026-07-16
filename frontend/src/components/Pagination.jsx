
export default function Pagination({ page, setPage, total, pageSize }) {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <span className="text-sm text-gray-500">
        Page {page} of {totalPages} ({total} total)
      </span>
      <div className="flex gap-2">
        <button
          disabled={page === 1}
          onClick={() => setPage(p => p - 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40"
        >
          Previous
        </button>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(p => p + 1)}
          className="px-3 py-1 text-sm border rounded disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}