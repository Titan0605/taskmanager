using MongoDB.Driver;
using TaskManagerApi.Models;
using TaskManagerApi.Services;

namespace TaskManagerApi.Data;

/// <summary>
/// Database Seeder - Inserts default data ONLY if database is empty
/// </summary>
public class DbSeeder
{
    private readonly MongoService _mongoService;
    private readonly ILogger<DbSeeder> _logger;

    public DbSeeder(MongoService mongoService, ILogger<DbSeeder> logger)
    {
        _mongoService = mongoService;
        _logger = logger;
    }

    public async Task SeedAsync()
    {
        _logger.LogInformation("Checking if database needs seeding...");

        // Seed users if empty
        var userCount = await _mongoService.Users.CountDocumentsAsync(_ => true);
        if (userCount == 0)
        {
            _logger.LogInformation("Seeding default users...");
            var defaultUsers = new List<User>
            {
                new User
                {
                    Username = "admin",
                    Password = "admin", // In production, use hashed passwords!
                    Email = "admin@taskmanager.com"
                }
            };
            await _mongoService.Users.InsertManyAsync(defaultUsers);
            _logger.LogInformation("Created {Count} default users", defaultUsers.Count);
        }

        // Seed projects if empty
        var projectCount = await _mongoService.Projects.CountDocumentsAsync(_ => true);
        if (projectCount == 0)
        {
            _logger.LogInformation("Seeding default projects...");
            var defaultProjects = new List<Project>
            {
                new Project { Nombre = "Proyecto Demo", Descripcion = "Proyecto de ejemplo" },
                new Project { Nombre = "Proyecto Alpha", Descripcion = "Proyecto importante" },
                new Project { Nombre = "Proyecto Beta", Descripcion = "Proyecto secundario" }
            };
            await _mongoService.Projects.InsertManyAsync(defaultProjects);
            _logger.LogInformation("Created {Count} default projects", defaultProjects.Count);

            // Seed some tasks for the demo project
            var demoProject = await _mongoService.Projects
                .Find(p => p.Nombre == "Proyecto Demo")
                .FirstOrDefaultAsync();

            if (demoProject != null)
            {
                var tareaCount = await _mongoService.Tareas.CountDocumentsAsync(_ => true);
                if (tareaCount == 0)
                {
                    _logger.LogInformation("Seeding default tasks...");
                    var defaultTareas = new List<Tarea>
                    {
                        new Tarea
                        {
                            Titulo = "Configurar ambiente de desarrollo",
                            Descripcion = "Instalar todas las dependencias necesarias",
                            Estado = "Completada",
                            Prioridad = "Alta",
                            ProyectoId = demoProject.Id,
                            AsignadoA = "admin",
                            HorasEstimadas = 4
                        },
                        new Tarea
                        {
                            Titulo = "Diseñar base de datos",
                            Descripcion = "Crear esquema MongoDB para la aplicación",
                            Estado = "En Progreso",
                            Prioridad = "Alta",
                            ProyectoId = demoProject.Id,
                            AsignadoA = "admin",
                            HorasEstimadas = 8
                        },
                        new Tarea
                        {
                            Titulo = "Implementar autenticación",
                            Descripcion = "Sistema de login y logout",
                            Estado = "Pendiente",
                            Prioridad = "Media",
                            ProyectoId = demoProject.Id,
                            FechaVencimiento = DateTime.UtcNow.AddDays(7),
                            HorasEstimadas = 16
                        }
                    };
                    await _mongoService.Tareas.InsertManyAsync(defaultTareas);
                    _logger.LogInformation("Created {Count} default tasks", defaultTareas.Count);
                }
            }
        }

        _logger.LogInformation("Database seeding completed");
    }
}
