"use client";

export function PrintActions() {
  return (
    <div className="print:hidden sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3">
      <div className="max-w-3xl mx-auto flex items-center justify-between">
        <p className="text-sm text-gray-500">Your birthday report — ready to download or print</p>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="rounded-full bg-black px-5 py-2 text-sm text-white hover:bg-gray-800 transition-colors"
          >
            Print / Save as PDF
          </button>
          <button
            onClick={() => window.history.back()}
            className="rounded-full border border-gray-300 px-5 py-2 text-sm text-gray-600 hover:text-black transition-colors"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
