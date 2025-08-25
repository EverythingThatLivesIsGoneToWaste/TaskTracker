using Microsoft.EntityFrameworkCore;

namespace TaskTracker.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<Models.Task> Tasks => Set<Models.Task>();
        public DbSet<Models.User> Users => Set<Models.User>();
    }
}
