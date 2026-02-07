using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

/// <summary>
/// Notification entity - Model layer (M in MVC)
/// Represents system notifications for users
/// </summary>
public class Notification
{
    [BsonId]
    public string Id { get; set; } = string.Empty;

    [BsonElement("mensaje")]
    public string Mensaje { get; set; } = string.Empty;

    [BsonElement("tipo")]
    public string Tipo { get; set; } = "info"; // info, warning, success, error

    [BsonElement("leida")]
    public bool Leida { get; set; } = false;

    [BsonElement("usuarioId")]
    public string UsuarioId { get; set; } = string.Empty;

    [BsonElement("tareaId")]
    public string? TareaId { get; set; }

    [BsonElement("fechaCreacion")]
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
