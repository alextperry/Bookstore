import { useEffect, useState } from 'react';
import { Book } from '../types/Book';
import { Navigate, useNavigate } from 'react-router-dom';

function BookList({ selectedCategories }: { selectedCategories: string[] }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [pageSize, setPageSize] = useState<number>(5);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [sortOrder, setSortOrder] = useState<string>('asc');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjects = async () => {
      const categoryParams = selectedCategories
        .map((cat) => `projectTypes=${encodeURIComponent(cat)}`)
        .join(`&`);

      const response = await fetch(
        `https://localhost:5000/api/Book/AllProjects?pageSize=${pageSize}&pageNum=${pageNum}${selectedCategories.length ? `&${categoryParams}` : ``}`,
      );
      const data = await response.json();
      setBooks(data.projects);
      setTotalItems(data.totalNumProjects);
      setTotalPages(Math.ceil(totalItems / pageSize));
    };

    fetchProjects();
  }, [pageSize, pageNum, totalItems, selectedCategories]);

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
          <div className="card-header bg-primary text-white">
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
              className=" btn btn-primary" 
              onClick={() => navigate(`/purchase/${b.title}/${b.bookId}`)}
            >
              Purchase
            </button>
          </div>
        </div>
      ))}

      <div className="d-flex justify-content-between mt-4">
        <button
          className="btn btn-outline-primary btn-lg"
          disabled={pageNum === 1}
          onClick={() => setPageNum(pageNum - 1)}
        >
          Previous
        </button>
        <div>
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              className={`btn btn-outline-primary mx-1 ${pageNum === index + 1 ? 'active' : ''}`}
              onClick={() => setPageNum(index + 1)}
              disabled={pageNum === index + 1}
            >
              {index + 1}
            </button>
          ))}
        </div>
        <button
          className="btn btn-secondary"
          disabled={pageNum === totalPages}
          onClick={() => setPageNum(pageNum + 1)}
        >
          Next
        </button>
      </div>

      <div className="mt-3">
        <label className="form-label me-2">Results per page:</label>
        <select
          className="form-select d-inline-block w-auto"
          value={pageSize}
          onChange={(p) => {
            setPageSize(Number(p.target.value));
            setPageNum(1);
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
}

export default BookList;
