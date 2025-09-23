using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using JogoDaVelha.Models;

namespace JogoDaVelha.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Game> Games { get; set; }
        public DbSet<GameHistory> GameHistories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.ToTable("users");
                entity.HasKey(u => u.Id);
                entity.Property(u => u.Id).HasColumnName("id");
                entity.HasIndex(u => u.Name).IsUnique();
                entity.Property(u => u.Name).HasColumnName("name");
                entity.Property(u => u.Email).HasColumnName("email");
                entity.Property(u => u.CreatedAt).HasColumnName("created_at");
                entity.Property(u => u.IsActive).HasColumnName("is_active");
            });

            modelBuilder.Entity<Game>(entity =>
            {
                entity.ToTable("games");
                entity.HasKey(g => g.Id);
                entity.Property(g => g.Id).HasColumnName("id");
                entity.Property(g => g.PlayerXId).HasColumnName("player_x_id");
                entity.Property(g => g.PlayerOId).HasColumnName("player_o_id");
                entity.Property(g => g.Winner).HasColumnName("winner");
                entity.Property(g => g.BoardState).HasColumnName("board_state");
                entity.Property(g => g.CreatedAt).HasColumnName("created_at");
                entity.Property(g => g.MovesCount).HasColumnName("moves_count");
            });

            modelBuilder.Entity<GameHistory>(entity =>
            {
                entity.ToTable("game_history");
                entity.HasKey(h => h.Id);
                entity.Property(h => h.PlayerXName).HasColumnName("player_x_name");
                entity.Property(h => h.PlayerOName).HasColumnName("player_o_name");
                entity.Property(h => h.Result).HasColumnName("result");
                entity.Property(h => h.PlayedAt).HasColumnName("played_at");
            });

        }

    }
}