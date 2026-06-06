namespace AjudaLaServices.Api.Models
{
    public class Agendamento
    {
        public int Id {get; set; }
        public DateTime Datahora {get; set; }
        public string Status {get; set; } = "Pendente";

        public int PrestadorId {get; set; }
        public Usuario? Prestador {get; set; }

        public int ContratanteId {get; set; }
        public Usuario? Contratante {get; set;}
    }
}