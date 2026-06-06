using Microsoft.EntityFrameworkCore;
using AjudaLaServices.Api.Models;

namespace AjudaLaServices.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Categoria> Categorias => Set<Categoria>();
        public DbSet<Usuario> Usuarios => Set<Usuario>();
        public DbSet<Agendamento> Agendamentos => Set<Agendamento>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Agendamento>()
            .HasOne(a => a.Prestador)
            .WithMany(u => u.ServicosPrestados)
            .HasForeignKey(a => a.PrestadorId)
            .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Agendamento>()
            .HasOne(a => a.Contratante)
                .WithMany(u => u.ServicosContratados)
                .HasForeignKey(a => a.ContratanteId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}