import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../api/BooksApi';
import Pagination from './Pagination';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        const data = await fetchBooks(pageSize, pageNum, selectedCategories);

        setBooks(data.books);
        setTotalPages(Math.ceil(data.totalNumBooks / pageSize));
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
  }, [pageSize, pageNum, selectedCategories]);

  if (loading) return <p>Loading Books...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  // Sorting function from chatgpt
  const sortedBooks = [...books].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.title.localeCompare(b.title);
    } else {
      return b.title.localeCompare(a.title);
    }
  });

  return (
    <div className="container mt-4">
      {/* Sorting dropdown */}
      <div className="mb-3">
        <label className="form-label me-2">Sort by Title:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">A-Z</option>
          <option value="desc">Z-A</option>
        </select>
      </div>

      {sortedBooks.map((b) => (
        <div className="card mb-3" id="bookCard" key={b.bookId}>
          <div className="card-header bg-dark text-white">
            <h3 className="card-title">{b.title}</h3>
          </div>
          <div className="card-body">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <strong>Author: </strong>
                {b.author}
              </li>
              <li className="list-group-item">
                <strong>Publisher: </strong>
                {b.publisher}
              </li>
              <li className="list-group-item">
                <strong>ISBN: </strong>
                {b.isbn}
              </li>
              <li className="list-group-item">
                <strong>Category: </strong>
                {b.category}
              </li>
              <li className="list-group-item">
                <strong>Pages: </strong>
                {b.pageCount}
              </li>
              <li className="list-group-item">
                <strong>Price: $</strong>
                {b.price}
              </li>
            </ul>

            <button
              className="btn btn-primary"
              onClick={() =>
                navigate(`/purchase/${b.title}/${b.bookId}`, {
                  state: { price: b.price },
                })
              }
            >
              Purchase
            </button>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={pageNum}
        totalPages={totalPages}
        pageSize={pageSize}
        onPageChange={setPageNum}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setPageNum(1);
        }}
      />
    </div>
  );
}

export default BookList;
