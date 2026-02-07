namespace TaskManagerApi.Views;

/// <summary>
/// Notification DTO - View layer
/// </summary>
public class NotificationDto
{
    public string Id { get; set; } = string.Empty;
    public string Mensaje { get; set; } = string.Empty;
    public string Tipo { get; set; } = "info";
    public bool Leida { get; set; } = false;
    public string? TareaId { get; set; }
    public DateTime FechaCreacion { get; set; }
}

/// <summary>
/// Notification list response with unread count
/// </summary>
public class NotificationListResponse
{
    public List<NotificationDto> Notifications { get; set; } = new();
    public int UnreadCount { get; set; }
}
