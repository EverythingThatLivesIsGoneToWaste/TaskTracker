using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TaskTracker.Data;

namespace TaskTracker.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TasksController : ControllerBase
    {
        private readonly AppDbContext _db;

        public TasksController(AppDbContext db)
        {
            _db = db;
        }

        // GET:
        [Authorize]
        [HttpGet]
        public async Task<IActionResult> GetAllTasks()
        {
            var tasks = await _db.Tasks.ToListAsync();
            return Ok(tasks);
        }

        // POST:
        [Authorize]
        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] Models.Task task)
        {
            await _db.Tasks.AddAsync(task);
            await _db.SaveChangesAsync();
            return Ok(task);
        }

        // PUT:
        [Authorize]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTask(int id, [FromBody] bool isCompleted)
        {
            var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
                return NotFound($"Задача с ID {id} не найдена");

            task.IsCompleted = isCompleted;

            await _db.SaveChangesAsync();

            return Ok(task);
        }

        // DELETE:
        [Authorize]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == id);

            if (task == null)
                return NotFound($"Задача с ID {id} не найдена");

            _db.Tasks.Remove(task);
            await _db.SaveChangesAsync();
            return Ok(task);
        }
    }
}
