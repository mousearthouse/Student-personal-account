import "./pagination.scss";

interface PaginationProps {
    currentPage: number;
    pageCount: number;
    onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, pageCount, onPageChange }: PaginationProps) => {
    const getPages = () => {
        const pages = [];

        const visiblePages = 5;
        let start = Math.max(1, currentPage - 2);
        let end = Math.min(pageCount, start + visiblePages - 1);

        if (end - start < visiblePages - 1) {
        start = Math.max(1, end - visiblePages + 1);
        }

        for (let i = start; i <= end; i++) {
        pages.push(i);
        }

        return pages;
    };

    return (
        <div className="pagination">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
        >
            &lt;
        </button>

        {getPages().map((page, index) => (
            <button
            key={index}
            className={page === currentPage ? "active" : ""}
            onClick={() => onPageChange(page)}
            >
            {page}
            </button>
        ))}

        {currentPage < pageCount - 2 && <span>...</span>}

        {currentPage < pageCount && (
            <button onClick={() => onPageChange(pageCount)}>{pageCount}</button>
        )}

        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === pageCount}
        >
            &gt;
        </button>
        </div>
    );
};

export default Pagination;
