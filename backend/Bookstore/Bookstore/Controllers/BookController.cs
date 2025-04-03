using Bookstore.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Bookstore.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private BookDbContext _bookContext;

        public BookController(BookDbContext temp)
        {
            _bookContext = temp;
        }

        [HttpGet("allbooks")]
        public IActionResult GetBooks(int pageSize = 5, int pageNum = 1, [FromQuery] List<string>? bookTypes = null)
        {
            var query = _bookContext.Books.AsQueryable();

            // Apply category filtering if projectTypes are provided
            if (bookTypes != null && bookTypes.Any())
            {
                query = query.Where(b => bookTypes.Contains(b.Category));
            }

            var totalNumBooks = query.Count(); // Count AFTER filtering

            var list = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var newObject = new
            {
                Books = list,
                TotalNumBooks = totalNumBooks
            };

            return Ok(newObject);
        }


        [HttpGet("GetBookTypes")]
        public IActionResult GetProjectTypes()
        {
            var bookTypes = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(bookTypes);
        }

        [HttpPost("addbook")]
        public IActionResult AddBook([FromBody]Book newBook) {
            _bookContext.Books.Add(newBook);
            _bookContext.SaveChanges();
            return Ok(newBook);
        }


        [HttpPut("updatebook/{bookId}")]
        public IActionResult UpdateBook(int bookId, [FromBody] Book updatedBook) {
            var existingBook = _bookContext.Books.Find(bookId);
            
            if (existingBook == null) {
                return NotFound($"Project with ID {bookId} not found.");
            }

            // Update the book fields
            existingBook.Title = updatedBook.Title;
            existingBook.Author = updatedBook.Author;
            existingBook.Publisher = updatedBook.Publisher;
            existingBook.Isbn = updatedBook.Isbn;
            existingBook.Category = updatedBook.Category;
            existingBook.PageCount = updatedBook.PageCount;
            existingBook.Price = updatedBook.Price;


            // Save the changes to the database
            _bookContext.SaveChanges();

            // Return a success response
            return Ok(existingBook);
        }


        [HttpDelete("deletebook/{bookId}")]
        public IActionResult DeleteBook(int bookId) {
            var book = _bookContext.Books.Find(bookId);

            if (book == null) {
                return NotFound(new {message = "Project not found"});
            }
            _bookContext.Books.Remove(book);
            _bookContext.SaveChanges();

            return NoContent();
        }
    }
}
