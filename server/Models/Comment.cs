using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace TaskManagerApi.Models;

/// <summary>
/// Comment entity - Embedded document for task comments
/// </summary>
public class Comment
{
    [BsonElement("id")]
    public string Id { get; set; } = ObjectId.GenerateNewId().ToString();

    [BsonElement("texto")]
    public string Texto { get; set; } = string.Empty;

    [BsonElement("autor")]
    public string Autor { get; set; } = string.Empty;

    [BsonElement("fechaCreacion")]
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}
