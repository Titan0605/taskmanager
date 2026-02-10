using DotNetEnv;
using TaskManagerApi.Data;
using TaskManagerApi.Services;

// Load environment variables from .env file
Env.Load();

var builder = WebApplication.CreateBuilder(args);

// ===== SECURE CONFIGURATION =====
// Priority: Environment Variables > .env file > appsettings.json
var mongoSettings = new MongoSettings
{
    ConnectionString = Environment.GetEnvironmentVariable("MONGODB_CONNECTION_STRING") 
        ?? builder.Configuration["MongoSettings:ConnectionString"] 
        ?? throw new InvalidOperationException("MongoDB connection string not configured"),
    DatabaseName = Environment.GetEnvironmentVariable("MONGODB_DATABASE_NAME") 
        ?? builder.Configuration["MongoSettings:DatabaseName"] 
        ?? "TaskManagerDb"
};

builder.Services.Configure<MongoSettings>(options =>
{
    options.ConnectionString = mongoSettings.ConnectionString;
    options.DatabaseName = mongoSettings.DatabaseName;
});

// ===== SERVICES =====
builder.Services.AddSingleton<MongoService>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<DbSeeder>();

// ===== CONTROLLERS =====
builder.Services.AddControllers();

// ===== CORS - Allow React frontend =====
var allowedOrigins = new List<string>
{
    "http://localhost:5173",  // Vite dev server
    "http://localhost:3000"   // Alternative port
};

// Add production origin from environment variable if set
var productionOrigin = Environment.GetEnvironmentVariable("ALLOWED_ORIGIN");
if (!string.IsNullOrEmpty(productionOrigin))
    allowedOrigins.Add(productionOrigin);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins(allowedOrigins.ToArray())
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// ===== SWAGGER =====
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// ===== SEED DATABASE =====
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<DbSeeder>();
    await seeder.SeedAsync();
}

// ===== MIDDLEWARE =====
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowReactApp");

// Serve React frontend from wwwroot
app.UseDefaultFiles();
app.UseStaticFiles();

app.UseAuthorization();
app.MapControllers();

// SPA Fallback: serve index.html for any non-API, non-file route
app.MapFallbackToFile("index.html");

// ===== START SERVER =====
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
app.Urls.Add($"http://0.0.0.0:{port}");

Console.WriteLine($"🚀 Task Manager API running on http://localhost:{port}");
Console.WriteLine($"📚 Swagger UI: http://localhost:{port}/swagger");

app.Run();
