namespace TaskManagerApi.Views;

/// <summary>
/// Project DTO - View layer (V in MVC)
/// Used for API requests and responses
/// </summary>
public class ProjectDto
{
    public string? Id { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public string Descripcion { get; set; } = string.Empty;
}

/// <summary>
/// Project list response with metadata
/// </summary>
public class ProjectListResponse
{
    public List<ProjectDto> Projects { get; set; } = new();
    public int Total { get; set; }
}
