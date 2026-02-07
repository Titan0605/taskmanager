using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TaskManagerApi.Models;
using TaskManagerApi.Services;
using TaskManagerApi.Views;

namespace TaskManagerApi.Controllers;

/// <summary>
/// Tareas Controller - C in MVC pattern
/// Handles CRUD operations for tasks
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class TareasController : ControllerBase
{
    private readonly MongoService _mongoService;
    private readonly ILogger<TareasController> _logger;

    public TareasController(MongoService mongoService, ILogger<TareasController> logger)
    {
        _mongoService = mongoService;
        _logger = logger;
    }

    /// <summary>
    /// GET api/tareas - Get all tasks with statistics
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<TareaListResponse>> GetAll()
    {
        try
        {
            var tareas = await _mongoService.Tareas.Find(_ => true).ToListAsync();
            var projects = await _mongoService.Projects.Find(_ => true).ToListAsync();
            var projectDict = projects.ToDictionary(p => p.Id, p => p.Nombre);

            var tareaDtos = tareas.Select(t => new TareaDto
            {
                Id = t.Id,
                Titulo = t.Titulo,
                Descripcion = t.Descripcion,
                Estado = t.Estado,
                Prioridad = t.Prioridad,
                ProyectoId = t.ProyectoId,
                ProyectoNombre = projectDict.TryGetValue(t.ProyectoId, out var nombre) ? nombre : "Sin proyecto",
                AsignadoA = t.AsignadoA,
                FechaVencimiento = t.FechaVencimiento,
                HorasEstimadas = t.HorasEstimadas,
                Comentarios = t.Comentarios.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Texto = c.Texto,
                    Autor = c.Autor,
                    FechaCreacion = c.FechaCreacion
                }).ToList()
            }).ToList();

            // Calculate statistics matching legacy app
            var estadisticas = new TareaEstadisticas
            {
                Total = tareas.Count,
                Completadas = tareas.Count(t => t.Estado == "Completada"),
                Pendientes = tareas.Count(t => t.Estado == "Pendiente"),
                AltaPrioridad = tareas.Count(t => t.Prioridad == "Alta"),
                Vencidas = tareas.Count(t => t.FechaVencimiento.HasValue && t.FechaVencimiento < DateTime.UtcNow && t.Estado != "Completada")
            };

            return Ok(new TareaListResponse
            {
                Tareas = tareaDtos,
                Estadisticas = estadisticas
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching tasks");
            return StatusCode(500, new { Message = "Error al obtener tareas" });
        }
    }

    /// <summary>
    /// GET api/tareas/{id} - Get task by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TareaDto>> GetById(string id)
    {
        try
        {
            var tarea = await _mongoService.Tareas.Find(t => t.Id == id).FirstOrDefaultAsync();

            if (tarea == null)
            {
                return NotFound(new { Message = "Tarea no encontrada" });
            }

            return Ok(new TareaDto
            {
                Id = tarea.Id,
                Titulo = tarea.Titulo,
                Descripcion = tarea.Descripcion,
                Estado = tarea.Estado,
                Prioridad = tarea.Prioridad,
                ProyectoId = tarea.ProyectoId,
                AsignadoA = tarea.AsignadoA,
                FechaVencimiento = tarea.FechaVencimiento,
                HorasEstimadas = tarea.HorasEstimadas,
                Comentarios = tarea.Comentarios.Select(c => new CommentDto
                {
                    Id = c.Id,
                    Texto = c.Texto,
                    Autor = c.Autor,
                    FechaCreacion = c.FechaCreacion
                }).ToList()
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching task {Id}", id);
            return StatusCode(500, new { Message = "Error al obtener tarea" });
        }
    }

    /// <summary>
    /// POST api/tareas - Create new task
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TareaDto>> Create([FromBody] TareaDto dto)
    {
        try
        {
            var tarea = new Tarea
            {
                Titulo = dto.Titulo,
                Descripcion = dto.Descripcion,
                Estado = dto.Estado,
                Prioridad = dto.Prioridad,
                ProyectoId = dto.ProyectoId,
                AsignadoA = dto.AsignadoA,
                FechaVencimiento = dto.FechaVencimiento,
                HorasEstimadas = dto.HorasEstimadas,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _mongoService.Tareas.InsertOneAsync(tarea);
            _logger.LogInformation("Created task: {Title}", tarea.Titulo);

            dto.Id = tarea.Id;
            return CreatedAtAction(nameof(GetById), new { id = tarea.Id }, dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating task");
            return StatusCode(500, new { Message = "Error al crear tarea" });
        }
    }

    /// <summary>
    /// PUT api/tareas/{id} - Update task
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<TareaDto>> Update(string id, [FromBody] TareaDto dto)
    {
        try
        {
            var update = Builders<Tarea>.Update
                .Set(t => t.Titulo, dto.Titulo)
                .Set(t => t.Descripcion, dto.Descripcion)
                .Set(t => t.Estado, dto.Estado)
                .Set(t => t.Prioridad, dto.Prioridad)
                .Set(t => t.ProyectoId, dto.ProyectoId)
                .Set(t => t.AsignadoA, dto.AsignadoA)
                .Set(t => t.FechaVencimiento, dto.FechaVencimiento)
                .Set(t => t.HorasEstimadas, dto.HorasEstimadas)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var result = await _mongoService.Tareas.UpdateOneAsync(t => t.Id == id, update);

            if (result.MatchedCount == 0)
            {
                return NotFound(new { Message = "Tarea no encontrada" });
            }

            dto.Id = id;
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating task {Id}", id);
            return StatusCode(500, new { Message = "Error al actualizar tarea" });
        }
    }

    /// <summary>
    /// DELETE api/tareas/{id} - Delete task
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var result = await _mongoService.Tareas.DeleteOneAsync(t => t.Id == id);

            if (result.DeletedCount == 0)
            {
                return NotFound(new { Message = "Tarea no encontrada" });
            }

            return Ok(new { Message = "Tarea eliminada exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting task {Id}", id);
            return StatusCode(500, new { Message = "Error al eliminar tarea" });
        }
    }

    /// <summary>
    /// POST api/tareas/{id}/comentarios - Add comment to task
    /// </summary>
    [HttpPost("{id}/comentarios")]
    public async Task<ActionResult<CommentDto>> AddComment(string id, [FromBody] AddCommentRequest request)
    {
        try
        {
            var comment = new Comment
            {
                Texto = request.Texto,
                Autor = request.Autor,
                FechaCreacion = DateTime.UtcNow
            };

            var update = Builders<Tarea>.Update
                .Push(t => t.Comentarios, comment)
                .Set(t => t.UpdatedAt, DateTime.UtcNow);

            var result = await _mongoService.Tareas.UpdateOneAsync(t => t.Id == id, update);

            if (result.MatchedCount == 0)
            {
                return NotFound(new { Message = "Tarea no encontrada" });
            }

            _logger.LogInformation("Added comment to task {Id} by {Author}", id, request.Autor);

            return Ok(new CommentDto
            {
                Id = comment.Id,
                Texto = comment.Texto,
                Autor = comment.Autor,
                FechaCreacion = comment.FechaCreacion
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding comment to task {Id}", id);
            return StatusCode(500, new { Message = "Error al agregar comentario" });
        }
    }
}
