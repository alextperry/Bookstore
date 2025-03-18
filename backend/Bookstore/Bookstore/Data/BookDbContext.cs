using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Bookstore.Data;

public partial class BookDbContext : DbContext
{
    public BookDbContext()
    {
    }

    public BookDbContext(DbContextOptions<BookDbContext> options)
        : base(options)
    {

    }

    public DbSet<Book> Books { get; set; }
}
