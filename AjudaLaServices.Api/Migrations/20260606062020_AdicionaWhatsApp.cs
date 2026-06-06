using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AjudaLaServices.Api.Migrations
{
    /// <inheritdoc />
    public partial class AdicionaWhatsApp : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "WhatsApp",
                table: "Usuarios",
                type: "TEXT",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WhatsApp",
                table: "Usuarios");
        }
    }
}
