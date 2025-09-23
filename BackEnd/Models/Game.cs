using System.ComponentModel.DataAnnotations;

namespace JogoDaVelha.Models
{
    public class Game
    {
        public Guid Id { get; set; }
        public Guid PlayerXId { get; set; }
        public Guid PlayerOId { get; set; }

        public string? Winner { get; set; } = null;

        public string? BoardState { get; set; }
        public DateTime CreatedAt { get; set; }
        public int MovesCount { get; set; }
    }
}