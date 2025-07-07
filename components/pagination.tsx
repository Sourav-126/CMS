"use client";

import { useRouter } from "next/navigation";

export default function Pagination({
  currentPage,
  totalItems,
  perPage,
  ...props
}: {
  currentPage: number;
  totalItems: number;
  perPage: number;
  className?: string;
}) {
  const router = useRouter();
  const totalPages = Math.ceil(totalItems / perPage);
  const handlePageChange = (page:number) => {
    console.log(page, " page no");
    if (page < 1 || page > totalPages) return;
    router.push(`?page=${page}`);
  };

  return (
    <div {...props}>
      <div className="flex justify-center gap-2">
        <button
          disabled={currentPage == 0}
          onClick={() => handlePageChange(currentPage - 1)}
          className={`px-2 py-1 border rounded-md text-gray-200 flex gap-2 items-center ${
            currentPage == 1 ? "text-gray-400 cursor-not-allowed" : ""
          }`}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, index) => {
          return (
            <button
              onClick={() => handlePageChange(index + 1)}
              className={`px-2 py-1 text-sm border rounded-md ${
                currentPage == index + 1 ? "bg-gray-600/40 " : "bg-transparent"
              }`}
            >
              {index + 1}
            </button>
          );
        })}
        <button
          disabled={currentPage == totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className={`px-2 py-1 border rounded-md text-gray-200 flex gap-2 items-center ${
            currentPage == totalPages ? "text-gray-400 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}
