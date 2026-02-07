namespace TaskManagerApi.Views;

/// <summary>
/// Comment DTO - View layer for comments
/// </summary>
public class CommentDto
{
    public string? Id { get; set; }
    public string Texto { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
    public DateTime FechaCreacion { get; set; } = DateTime.UtcNow;
}

/// <summary>
/// Request DTO for adding a comment
/// </summary>
public class AddCommentRequest
{
    public string Texto { get; set; } = string.Empty;
    public string Autor { get; set; } = string.Empty;
}

/// <summary>
/// Tarea DTO - View layer (V in MVC)
/// Used for API requests and responses
/// </summary>
public class TareaDto
{
    public string? Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
    public string Estado { get; set; } = "Pendiente";
    public string Prioridad { get; set; } = "Media";
    public string ProyectoId { get; set; } = string.Empty;
    public string? ProyectoNombre { get; set; }
    public string AsignadoA { get; set; } = "Sin asignar";
    public DateTime? FechaVencimiento { get; set; }
    public double HorasEstimadas { get; set; }
    public List<CommentDto> Comentarios { get; set; } = new();
    public List<string> Historial { get; set; } = new();
}

/// <summary>
/// Task list response with statistics (matching legacy app)
/// </summary>
public class TareaListResponse
{
    public List<TareaDto> Tareas { get; set; } = new();
    public TareaEstadisticas Estadisticas { get; set; } = new();
}

/// <summary>
/// Statistics matching legacy app footer
/// </summary>
public class TareaEstadisticas
{
    public int Total { get; set; }
    public int Completadas { get; set; }
    public int Pendientes { get; set; }
    public int AltaPrioridad { get; set; }
    public int Vencidas { get; set; }
}

