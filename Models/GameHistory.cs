using System;
using System.ComponentModel.DataAnnotations;

namespace JogoDaVelha.Models
{
    public class GameHistory
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(30)]
        public string PlayerXName { get; set; } = string.Empty;

        [Required]
        [StringLength(30)]
        public string PlayerOName { get; set; } = string.Empty;

        [Required]
        [StringLength(5)]
        public string Result { get; set; } = string.Empty;

        public DateTime PlayedAt { get; set; }
    }
}