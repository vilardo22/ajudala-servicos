using AjudaLaServices.Api.Data;
using AjudaLaServices.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ajudala.db"));

builder.Services.AddCors(options => options.AddPolicy("PermitirTudo", policy => policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()));


var app = builder.Build();
app.UseCors("PermitirTudo");
app.MapPost("/api/categorias", async (AppDbContext db, Categoria categoria) =>
{
    db.Categorias.Add(categoria);
    await db.SaveChangesAsync();
    return Results.Created($"/api/categorias/{categoria.Id}", categoria);
});

app.MapGet("/api/categorias", async (AppDbContext db) =>
{
    var categorias = await db.Categorias.ToListAsync();
    return Results.Ok(categorias);
});

app.MapGet("/api/categorias/{id}", async (int id, AppDbContext db) =>
{
    var categoria = await db.Categorias.FindAsync(id);
    return categoria is null ? Results.NotFound() : Results.Ok(categoria);
});

app.MapPut("/api/categorias/{id}", async (int id, Categoria categoriaAtualizada, AppDbContext db) =>
{
    var categoria = await db.Categorias.FindAsync(id);
    if (categoria is null) return Results.NotFound();

    categoria.Nome = categoriaAtualizada.Nome;
    categoria.Descricao = categoriaAtualizada.Descricao;

    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.MapDelete("/api/categorias/{id}", async (int id, AppDbContext db) =>
{
    var categoria = await db.Categorias.FindAsync(id);
    if (categoria is null) return Results.NotFound();

    db.Categorias.Remove(categoria);
    await db.SaveChangesAsync();
    return Results.NoContent();
});
// ==========================================
// CRUD DE USUÁRIOS
// ==========================================

app.MapPost("/api/usuarios", async (AppDbContext db, Usuario usuario) =>
{
    db.Usuarios.Add(usuario);
    await db.SaveChangesAsync();
    return Results.Created($"/api/usuarios/{usuario.Id}", usuario);
});

app.MapGet("/api/usuarios", async (AppDbContext db) =>
{
    return await db.Usuarios.ToListAsync();
});

// ==========================================
// ROTAS DE AGENDAMENTO
// ==========================================

// 1. Criar um novo agendamento (O que o Contratante faz)
app.MapPost("/api/agendamentos", async (AppDbContext db, Agendamento agendamento) =>
{
    // Forçamos o status inicial por segurança
    agendamento.Status = "Pendente"; 
    
    db.Agendamentos.Add(agendamento);
    await db.SaveChangesAsync();
    return Results.Created($"/api/agendamentos/{agendamento.Id}", agendamento);
});

// 2. Listar os agendamentos de um Prestador específico (Para a tela do Prestador)
app.MapGet("/api/agendamentos/prestador/{prestadorId}", async (int prestadorId, AppDbContext db) =>
{
    // Aqui nós buscamos os agendamentos e já "puxamos" os dados do contratante junto
    var agendamentos = await db.Agendamentos
        .Where(a => a.PrestadorId == prestadorId)
        .Select(a => new {
            a.Id,
            a.Datahora,
            a.Status,
            ContratanteNome = a.Contratante != null ? a.Contratante.Nome : "Desconhecido",
            ContratanteEmail = a.Contratante != null ? a.Contratante.Email : ""
        })
        .ToListAsync();

    return Results.Ok(agendamentos);
});
// Atualizar o status de um agendamento
app.MapPut("/api/agendamentos/{id}/status/{novoStatus}", async (int id, string novoStatus, AppDbContext db) =>
{
    var agendamento = await db.Agendamentos.FindAsync(id);
    if (agendamento is null) return Results.NotFound();

    agendamento.Status = novoStatus;
    await db.SaveChangesAsync();

    return Results.NoContent();
});
app.MapGet("/api/prestadores/categoria/{categoriaId}", async (int categoriaId, AppDbContext db) =>
{
    var prestadores = await db.Usuarios
        .Where(u => u.TipoPerfil == "Prestador" && u.CategoriaId == categoriaId)
        .Select(u => new { u.Id, u.Nome, u.WhatsApp }) // Retorna só o necessário por segurança
        .ToListAsync();
        
    return Results.Ok(prestadores);
});
app.MapGet("/api/usuarios/login/{email}", async (string email, AppDbContext db) =>
{
    var usuario = await db.Usuarios.FirstOrDefaultAsync(u => u.Email == email);
    return usuario is null ? Results.NotFound(new { mensagem = "Usuário não encontrado." }) : Results.Ok(usuario);
});
app.Run();


