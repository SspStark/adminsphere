import Button from './button';

type PaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button disabled={page === 1} onClick={() => onPageChange(page - 1)}>
        Previous
      </Button>

      <span>
        Page {page} of {totalPages}
      </span>

      <Button disabled={page === totalPages} onClick={() => onPageChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}
