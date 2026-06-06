namespace AjudaLaServices.Api.Models
{
    public class Categoria
    {
        public int Id {get; set; }
        public string Nome {get; set; } = string.Empty;
        public string Descricao {get; set; } = string.Empty;

        public ICollection<Usuario>? Prestadores {get; set; }
    }
}