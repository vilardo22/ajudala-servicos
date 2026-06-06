namespace AjudaLaServices.Api.Models
{
    public class Usuario
    {
        public int Id {get; set; }
        public string Nome {get; set; } = string.Empty;
        public string Email {get;set; }= string.Empty;

        public string TipoPerfil {get; set; } = string.Empty;

        public string WhatsApp { get; set; } = string.Empty;
        public int? CategoriaId {get; set; }
        public Categoria? Categoria {get; set; }

        public ICollection<Agendamento>? ServicosPrestados { get; set; }
        public ICollection<Agendamento>? ServicosContratados {get; set; }

    }
}