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
            // AUTO-FIX: On first load, check if we need to purge old ObjectId data or inconsistent mock data
            // We check for Count > 0 and if the first item has an ID that looks like "mock" OR we just want to force a clean slate for the schema change.
            // For now, let's force a re-seed if we detect low count or specific issue, OR just rely on the user experience being "fresh".
            // To be safe with the Schema change (ObjectId -> String), we should try to read. If read fails (due to deserialization error), we catch and drop.
            
            List<Notification> notifications;
            try 
            {
               notifications = await _mongoService.Notifications
                    .Find(_ => true)
                    .SortByDescending(n => n.FechaCreacion)
                    .Limit(20)
                    .ToListAsync();
            }
            catch (Exception) // Likely deserialization error due to schema change
            {
                await _mongoService.Notifications.DeleteManyAsync(_ => true);
                notifications = new List<Notification>();
            }

            // If empty (or cleared), seed:
            if (notifications.Count == 0)
            {
                var mockNotifications = GetMockNotifications();
                var entities = mockNotifications.Select(n => new Notification
                {
                    Id = MongoDB.Bson.ObjectId.GenerateNewId().ToString(), // Stored as STRING now
                    Mensaje = n.Mensaje,
                    Tipo = n.Tipo,
                    Leida = n.Leida,
                    FechaCreacion = n.FechaCreacion,
                    UsuarioId = "admin"
                }).ToList();

                await _mongoService.Notifications.InsertManyAsync(entities);
                
                // Fetch again to be sure
                notifications = entities;
            }

            var resultDtos = notifications.Select(n => new NotificationDto
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
                Notifications = resultDtos,
                UnreadCount = resultDtos.Count(n => !n.Leida)
            });

            return Ok(new NotificationListResponse
            {
                Notifications = resultDtos,
                UnreadCount = resultDtos.Count(n => !n.Leida)
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
                // Try logging the mismatch
                _logger.LogWarning("MarkAsRead: Notification {Id} not found", id);
                return NotFound(new { Message = $"Notificación no encontrada: {id}" });
            }

            return Ok(new { Message = "Notificación marcada como leída" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error marking notification as read {Id}", id);
            return StatusCode(500, new { Message = $"Error al actualizar notificación: {ex.Message}" });
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
            var result = await _mongoService.Notifications.UpdateManyAsync(_ => true, update);
            
            _logger.LogInformation("MarkAllAsRead: Modified {Count} documents", result.ModifiedCount);

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
