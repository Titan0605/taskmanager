using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using TaskManagerApi.Models;
using TaskManagerApi.Services;
using TaskManagerApi.Views;

namespace TaskManagerApi.Controllers;

/// <summary>
/// Projects Controller - C in MVC pattern
/// Handles CRUD operations for projects
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProjectsController : ControllerBase
{
    private readonly MongoService _mongoService;
    private readonly ILogger<ProjectsController> _logger;

    public ProjectsController(MongoService mongoService, ILogger<ProjectsController> logger)
    {
        _mongoService = mongoService;
        _logger = logger;
    }

    /// <summary>
    /// GET api/projects - Get all projects
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<ProjectListResponse>> GetAll()
    {
        try
        {
            var projects = await _mongoService.Projects.Find(_ => true).ToListAsync();
            var projectDtos = projects.Select(p => new ProjectDto
            {
                Id = p.Id,
                Nombre = p.Nombre,
                Descripcion = p.Descripcion
            }).ToList();

            return Ok(new ProjectListResponse
            {
                Projects = projectDtos,
                Total = projectDtos.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching projects");
            return StatusCode(500, new { Message = "Error al obtener proyectos" });
        }
    }

    /// <summary>
    /// GET api/projects/{id} - Get project by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<ProjectDto>> GetById(string id)
    {
        try
        {
            var project = await _mongoService.Projects.Find(p => p.Id == id).FirstOrDefaultAsync();

            if (project == null)
            {
                return NotFound(new { Message = "Proyecto no encontrado" });
            }

            return Ok(new ProjectDto
            {
                Id = project.Id,
                Nombre = project.Nombre,
                Descripcion = project.Descripcion
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching project {Id}", id);
            return StatusCode(500, new { Message = "Error al obtener proyecto" });
        }
    }

    /// <summary>
    /// POST api/projects - Create new project
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<ProjectDto>> Create([FromBody] ProjectDto dto)
    {
        try
        {
            var project = new Project
            {
                Nombre = dto.Nombre,
                Descripcion = dto.Descripcion,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            await _mongoService.Projects.InsertOneAsync(project);
            _logger.LogInformation("Created project: {Name}", project.Nombre);

            dto.Id = project.Id;
            return CreatedAtAction(nameof(GetById), new { id = project.Id }, dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error creating project");
            return StatusCode(500, new { Message = "Error al crear proyecto" });
        }
    }

    /// <summary>
    /// PUT api/projects/{id} - Update project
    /// </summary>
    [HttpPut("{id}")]
    public async Task<ActionResult<ProjectDto>> Update(string id, [FromBody] ProjectDto dto)
    {
        try
        {
            var update = Builders<Project>.Update
                .Set(p => p.Nombre, dto.Nombre)
                .Set(p => p.Descripcion, dto.Descripcion)
                .Set(p => p.UpdatedAt, DateTime.UtcNow);

            var result = await _mongoService.Projects.UpdateOneAsync(p => p.Id == id, update);

            if (result.MatchedCount == 0)
            {
                return NotFound(new { Message = "Proyecto no encontrado" });
            }

            dto.Id = id;
            return Ok(dto);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating project {Id}", id);
            return StatusCode(500, new { Message = "Error al actualizar proyecto" });
        }
    }

    /// <summary>
    /// DELETE api/projects/{id} - Delete project
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult> Delete(string id)
    {
        try
        {
            var result = await _mongoService.Projects.DeleteOneAsync(p => p.Id == id);

            if (result.DeletedCount == 0)
            {
                return NotFound(new { Message = "Proyecto no encontrado" });
            }

            return Ok(new { Message = "Proyecto eliminado exitosamente" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error deleting project {Id}", id);
            return StatusCode(500, new { Message = "Error al eliminar proyecto" });
        }
    }
}
