using MongoDB.Driver;
using TaskManagerApi.Models;
using TaskManagerApi.Views;

namespace TaskManagerApi.Services;

/// <summary>
/// Authentication Service - Business logic for user authentication
/// </summary>
public class AuthService
{
    private readonly MongoService _mongoService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(MongoService mongoService, ILogger<AuthService> logger)
    {
        _mongoService = mongoService;
        _logger = logger;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            var user = await _mongoService.Users
                .Find(u => u.Username == request.Username && u.Password == request.Password)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                _logger.LogWarning("Failed login attempt for user: {Username}", request.Username);
                return new LoginResponse
                {
                    Success = false,
                    Message = "Usuario o contraseña incorrectos"
                };
            }

            _logger.LogInformation("Successful login for user: {Username}", request.Username);
            return new LoginResponse
            {
                Success = true,
                Message = "Login exitoso",
                Username = user.Username,
                Token = Guid.NewGuid().ToString() // Placeholder - implement JWT later
            };
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return new LoginResponse
            {
                Success = false,
                Message = "Error en el servidor"
            };
        }
    }
}
