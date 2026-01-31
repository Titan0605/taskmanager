namespace TaskManagerApi.Data;

/// <summary>
/// Configuration class for MongoDB settings - Maps from appsettings.json or environment variables
/// </summary>
public class MongoSettings
{
    public string ConnectionString { get; set; } = string.Empty;
    public string DatabaseName { get; set; } = string.Empty;
}
