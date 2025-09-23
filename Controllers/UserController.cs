using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JogoDaVelha.Data;
using JogoDaVelha.Models;

[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActiveUsers()
    {
        var users = await _context.Users
            .Where(u => u.IsActive)
            .Select(u => new { u.Id, u.Name, u.Email, u.CreatedAt })
            .OrderBy(u => u.Name)
            .ToListAsync();

        return Ok(users);
    }

    [HttpGet("{id}/profile")]
    public async Task<IActionResult> GetUserProfile(Guid id)
    {
        var user = await _context.Users
            .Where(u => u.Id == id && u.IsActive)
            .FirstOrDefaultAsync();

        if (user == null)
            return NotFound("Usuário não encontrado");

        var victories = await _context.Games
            .Where(g => (g.PlayerXId == id && g.Winner == "X") || (g.PlayerOId == id && g.Winner == "O"))
            .CountAsync();

        var lastMatches = await _context.Games
            .Where(g => g.PlayerXId == id || g.PlayerOId == id)
            .OrderByDescending(g => g.CreatedAt)
            .Take(5)
            .Select(g => new
            {
                g.Id,
                OpponentName = g.PlayerXId == id
                    ? _context.Users.Where(u => u.Id == g.PlayerOId).Select(u => u.Name).FirstOrDefault()
                    : _context.Users.Where(u => u.Id == g.PlayerXId).Select(u => u.Name).FirstOrDefault(),
                Result = g.Winner == "DRAW" ? "Empate" :
                        (g.PlayerXId == id && g.Winner == "X") || (g.PlayerOId == id && g.Winner == "O") ? "Vitória" : "Derrota",
                g.CreatedAt
            })
            .ToListAsync();

        return Ok(new
        {
            user.Id,
            user.Name,
            user.Email,
            user.CreatedAt,
            Stats = new
            {
                TotalVictories = victories,
                RecentMatches = lastMatches
            }
        });
    }

    [HttpPost("register")]
    public async Task<IActionResult> RegisterUser([FromBody] User newUser)
    {
        if (await _context.Users.AnyAsync(u => u.Name == newUser.Name && u.IsActive))
            return BadRequest("Já existe um usuário ativo com este nome");

        newUser.Id = Guid.NewGuid();
        newUser.CreatedAt = DateTime.UtcNow;
        newUser.IsActive = true;

        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            newUser.Id,
            newUser.Name,
            newUser.Email,
            newUser.CreatedAt,
            Message = "Usuário cadastrado com sucesso!"
        });
    }

    [HttpPatch("{id}/deactivate")]
    public async Task<IActionResult> DeactivateUser(Guid id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return NotFound();

        user.IsActive = false;
        await _context.SaveChangesAsync();

        return Ok(new { Message = $"Usuário {user.Name} desativado" });
    }
}