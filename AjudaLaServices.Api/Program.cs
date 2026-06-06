using AjudaLaServices.Api.Data;
using AjudaLaServices.Api.Models;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=ajudala.db"));

var app = builder.Build();

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

app.Run();


