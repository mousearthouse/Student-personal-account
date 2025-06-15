import './pagination.scss';

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
    console.log('Pagination props:', { currentPage, pageCount });

    const pages = getPages();
    const lastInWindow = pages[pages.length - 1];

    return (
    <div className="pagination">
        <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lt;
        </button>

        {/* Первая страница (если не видна) */}
        {pages[0] > 1 && (
            <>
                <button
                    onClick={() => onPageChange(1)}
                    className={currentPage === 1 ? 'active' : ''}
                >
                    1
                </button>
                {/* Многоточие после первой страницы, если она не соседняя */}
                {pages[0] > 2 && <span>...</span>}
            </>
        )}

        {/* Основные страницы */}
        {pages.map((page) => (
            <button
                key={page}
                className={page === currentPage ? 'active' : ''}
                onClick={() => onPageChange(page)}
            >
                {page}
            </button>
        ))}

        {/* Последняя страница (если не видна) */}
        {pages[pages.length - 1] < pageCount && (
            <>
                {/* Многоточие перед последней страницей, если она не соседняя */}
                {pages[pages.length - 1] < pageCount - 1 && <span>...</span>}
                <button
                    onClick={() => onPageChange(pageCount)}
                    className={currentPage === pageCount ? 'active' : ''}
                >
                    {pageCount}
                </button>
            </>
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
