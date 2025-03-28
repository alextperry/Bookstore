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

        [HttpGet("AllProjects")]
        public IActionResult GetProjects(int pageSize = 5, int pageNum = 1)
        {
            var list = _bookContext.Books
            .Skip((pageNum - 1) * pageSize)
            .Take(pageSize)
            .ToList();

            var totalNumProjects = _bookContext.Books.Count();

            var newObject = new
            {
                Projects = list,
                TotalNumProjects = totalNumProjects
            };

            return Ok(newObject);
        }

        [HttpGet("GetProjectTypes")]
        public IActionResult GetProjectTypes()
        {
            var projectTypes = _bookContext.Books
                .Select(p => p.Category)
                .Distinct()
                .ToList();

            return Ok(projectTypes);
        }
    }
}
