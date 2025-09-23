using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using JogoDaVelha.Data;
using JogoDaVelha.Models;

[Route("api/[controller]")]
[ApiController]
public class GameController : ControllerBase
{
    private readonly AppDbContext _context;

    public GameController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("start-match")]
    public async Task<IActionResult> StartMatch([FromBody] Game match)
    {
        var playerX = await _context.Users.FirstOrDefaultAsync(u => u.Id == match.PlayerXId && u.IsActive);
        var playerO = await _context.Users.FirstOrDefaultAsync(u => u.Id == match.PlayerOId && u.IsActive);

        if (playerX == null || playerO == null)
            return BadRequest("Um ou ambos jogadores não foram encontrados ou estão inativos.");

        if (match.PlayerXId == match.PlayerOId)
            return BadRequest("Os jogadores devem ser diferentes.");

        match.Id = Guid.NewGuid();
        match.CreatedAt = DateTime.UtcNow;
        match.MovesCount = 0;
        match.Winner = null;
        match.BoardState = "---------";

        _context.Games.Add(match);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            match.Id,
            PlayerX = playerX.Name,
            PlayerO = playerO.Name,
            match.BoardState,
            match.MovesCount
        });
    }

    [HttpGet("match-profile/{gameId}")]
    public async Task<IActionResult> GetMatchProfile(Guid gameId)
    {

        var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == gameId);

        if (game == null)
            return NotFound("Partida não encontrada.");

        var playerX = await _context.Users.FindAsync(game.PlayerXId);
        var playerO = await _context.Users.FindAsync(game.PlayerOId);

        if (playerX == null || playerO == null)
            return BadRequest("Um ou ambos os jogadores não foram encontrados.");

        return Ok(new
        {
            GameId = game.Id,
            PlayerX = playerX.Name,
            PlayerO = playerO.Name,
            Result = string.IsNullOrEmpty(game.Winner) ? "Em andamento" : game.Winner,
            PlayedAt = game.CreatedAt
        });
    }

    [HttpGet("matches")]
    public async Task<IActionResult> GetAllMatches()
    {
        var games = await _context.Games
            .OrderByDescending(g => g.CreatedAt)
            .ToListAsync();

        var result = new List<object>();

        foreach (var game in games)
        {
            var playerX = await _context.Users.FindAsync(game.PlayerXId);
            var playerO = await _context.Users.FindAsync(game.PlayerOId);

            result.Add(new
            {
                GameId = game.Id,
                PlayerX = playerX?.Name ?? "Desconhecido",
                PlayerO = playerO?.Name ?? "Desconhecido",
                Result = string.IsNullOrEmpty(game.Winner) ? "Em andamento" :
                         game.Winner == "DRAW" ? "Empate" : game.Winner,
                PlayedAt = game.CreatedAt
            });
        }

        return Ok(result);
    }


    [HttpPost("make-move")]
    public async Task<IActionResult> MakeMove([FromBody] MoveInput input)
    {
        var game = await _context.Games.FirstOrDefaultAsync(g => g.Id == input.GameId);
        if (game == null)
            return BadRequest("Partida não encontrada.");

        if (!string.IsNullOrEmpty(game.Winner))
            return BadRequest("Partida já finalizada.");

        if (input.PlayerId != game.PlayerXId && input.PlayerId != game.PlayerOId)
            return BadRequest("Jogador não participa desta partida.");

        char playerChar = input.PlayerId == game.PlayerXId ? 'X' : 'O';

        if (input.Position < 0 || input.Position > 8)
            return BadRequest("Posição inválida (0 a 8).");

        if (game.BoardState[input.Position] != '-')
            return BadRequest("Posição já ocupada.");

        var board = game.BoardState.ToCharArray();
        board[input.Position] = playerChar;
        game.BoardState = new string(board);
        game.MovesCount++;

        game.Winner = CheckWinner(game.BoardState);

        await _context.SaveChangesAsync();

        if (!string.IsNullOrEmpty(game.Winner))
        {
            var playerX = await _context.Users.FindAsync(game.PlayerXId);
            var playerO = await _context.Users.FindAsync(game.PlayerOId);

            if (playerX != null && playerO != null)
            {
                var history = new GameHistory
                {
                    Id = Guid.NewGuid(),
                    PlayerXName = playerX.Name,
                    PlayerOName = playerO.Name,
                    Result = game.Winner,
                    PlayedAt = DateTime.UtcNow
                };

                _context.GameHistories.Add(history);
                await _context.SaveChangesAsync();
            }
        }

        return Ok(new
        {
            game.Id,
            game.BoardState,
            game.MovesCount,
            game.Winner
        });
    }

    private string CheckWinner(string board)
    {
        int[][] lines = new int[][]
        {
            new int[]{0,1,2}, new int[]{3,4,5}, new int[]{6,7,8},
            new int[]{0,3,6}, new int[]{1,4,7}, new int[]{2,5,8},
            new int[]{0,4,8}, new int[]{2,4,6}                    
        };

        foreach (var line in lines)
        {
            if (board[line[0]] != '-' && board[line[0]] == board[line[1]] && board[line[1]] == board[line[2]])
                return board[line[0]].ToString();
        }

        return board.Contains('-') ? string.Empty : "DRAW";
    }
}

public class MoveInput
{
    public Guid GameId { get; set; }
    public Guid PlayerId { get; set; }
    public int Position { get; set; }
}
