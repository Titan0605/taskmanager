using Microsoft.Extensions.Options;
using MongoDB.Driver;
using TaskManagerApi.Data;
using TaskManagerApi.Models;

namespace TaskManagerApi.Services;

/// <summary>
/// MongoDB Service - Handles database connections and collection access
/// </summary>
public class MongoService
{
    private readonly IMongoDatabase _database;
    private readonly ILogger<MongoService> _logger;

    public MongoService(IOptions<MongoSettings> settings, ILogger<MongoService> logger)
    {
        _logger = logger;

        try
        {
            var client = new MongoClient(settings.Value.ConnectionString);
            _database = client.GetDatabase(settings.Value.DatabaseName);
            _logger.LogInformation("Successfully connected to MongoDB: {DatabaseName}", settings.Value.DatabaseName);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to connect to MongoDB");
            throw;
        }
    }

    public IMongoCollection<User> Users => _database.GetCollection<User>("users");
    public IMongoCollection<Project> Projects => _database.GetCollection<Project>("projects");
    public IMongoCollection<Tarea> Tareas => _database.GetCollection<Tarea>("tareas");
    public IMongoCollection<Notification> Notifications => _database.GetCollection<Notification>("notifications");
}
