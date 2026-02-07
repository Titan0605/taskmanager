using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TaskManagerApi.Models;
using TaskManagerApi.Services;
using TaskManagerApi.Views;

namespace TaskManagerApi.Controllers;

/// <summary>
/// Notifications Controller - C in MVC pattern
/// Handles notification operations
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class NotificationsController : ControllerBase
{
    private readonly MongoService _mongoService;
    private readonly ILogger<NotificationsController> _logger;

    public NotificationsController(MongoService mongoService, ILogger<NotificationsController> logger)
    {
        _mongoService = mongoService;
        _logger = logger;
    }

    /// <summary>
    /// GET api/notifications - Get all notifications for current user
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<NotificationListResponse>> GetAll()
    {
        try
        {
            var notifications = await _mongoService.Notifications
                .Find(_ => true)
                .SortByDescending(n => n.FechaCreacion)
                .Limit(20)
                .ToListAsync();

            // If no notifications exist, return mock data for demo
            if (notifications.Count == 0)
            {
                var mockNotifications = GetMockNotifications();
                return Ok(new NotificationListResponse
                {
                    Notifications = mockNotifications,
                    UnreadCount = mockNotifications.Count(n => !n.Leida)
                });
            }

            var notificationDtos = notifications.Select(n => new NotificationDto
            {
                Id = n.Id,
                Mensaje = n.Mensaje,
                Tipo = n.Tipo,
                Leida = n.Leida,
                TareaId = n.TareaId,
                FechaCreacion = n.FechaCreacion
            }).ToList();

            return Ok(new NotificationListResponse
            {
                Notifications = notificationDtos,
                UnreadCount = notificationDtos.Count(n => !n.Leida)
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching notifications");
            return StatusCode(500, new { Message = "Error al obtener notificaciones" });
        }
    }

    /// <summary>
    /// PUT api/notifications/{id}/read - Mark notification as read
    /// </summary>
    [HttpPut("{id}/read")]
    public async Task<ActionResult> MarkAsRead(string id)
    {
        try
        {
            var update = Builders<Notification>.Update.Set(n => n.Leida, true);
            var result = await _mongoService.Notifications.UpdateOneAsync(n => n.Id == id, update);

            if (result.MatchedCount == 0)
            {
                return NotFound(new { Message = "Notificación no encontrada" });
            }

            return Ok(new { Message = "Notificación marcada como leída" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read {Id}", id);
            return StatusCode(500, new { Message = "Error al actualizar notificación" });
        }
    }

    /// <summary>
    /// PUT api/notifications/read-all - Mark all notifications as read
    /// </summary>
    [HttpPut("read-all")]
    public async Task<ActionResult> MarkAllAsRead()
    {
        try
        {
            var update = Builders<Notification>.Update.Set(n => n.Leida, true);
            await _mongoService.Notifications.UpdateManyAsync(_ => true, update);

            return Ok(new { Message = "Todas las notificaciones marcadas como leídas" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking all notifications as read");
            return StatusCode(500, new { Message = "Error al actualizar notificaciones" });
        }
    }

    /// <summary>
    /// Mock notifications for demo purposes
    /// </summary>
    private List<NotificationDto> GetMockNotifications()
    {
        var now = DateTime.UtcNow;
        return new List<NotificationDto>
        {
            new NotificationDto
            {
                Id = "mock1",
                Mensaje = "La tarea 'Diseño de interfaz' ha sido completada",
                Tipo = "success",
                Leida = false,
                FechaCreacion = now.AddMinutes(-5)
            },
            new NotificationDto
            {
                Id = "mock2",
                Mensaje = "Tienes 3 tareas pendientes con vencimiento hoy",
                Tipo = "warning",
                Leida = false,
                FechaCreacion = now.AddHours(-1)
            },
            new NotificationDto
            {
                Id = "mock3",
                Mensaje = "Carlos comentó en 'Revisión de código'",
                Tipo = "info",
                Leida = false,
                FechaCreacion = now.AddHours(-2)
            },
            new NotificationDto
            {
                Id = "mock4",
                Mensaje = "Se te asignó la tarea 'Implementar login'",
                Tipo = "info",
                Leida = true,
                FechaCreacion = now.AddDays(-1)
            },
            new NotificationDto
            {
                Id = "mock5",
                Mensaje = "El proyecto 'Portal Web' fue actualizado",
                Tipo = "info",
                Leida = true,
                FechaCreacion = now.AddDays(-2)
            }
        };
    }
}
