using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

/// <summary>
/// Tarea entity - Model layer (M in MVC)
/// Matches the legacy Task Manager form fields
/// </summary>
public class Tarea
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = string.Empty;

    [BsonElement("titulo")]
    public string Titulo { get; set; } = string.Empty;

    [BsonElement("descripcion")]
    public string Descripcion { get; set; } = string.Empty;

    [BsonElement("estado")]
    public string Estado { get; set; } = "Pendiente"; // Pendiente, En Progreso, Completada

    [BsonElement("prioridad")]
    public string Prioridad { get; set; } = "Media"; // Baja, Media, Alta

    [BsonElement("proyectoId")]
    [BsonRepresentation(BsonType.ObjectId)]
    public string ProyectoId { get; set; } = string.Empty;

    [BsonElement("asignadoA")]
    public string AsignadoA { get; set; } = "Sin asignar";

    [BsonElement("fechaVencimiento")]
    public DateTime? FechaVencimiento { get; set; }

    [BsonElement("horasEstimadas")]
    public double HorasEstimadas { get; set; }

    [BsonElement("createdAt")]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("updatedAt")]
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    [BsonElement("comentarios")]
    public List<Comment> Comentarios { get; set; } = new();
}
