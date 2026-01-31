using Microsoft.AspNetCore.Mvc;
using TaskManagerApi.Services;
using TaskManagerApi.Views;

namespace TaskManagerApi.Controllers;

/// <summary>
/// Authentication Controller - C in MVC pattern
/// Handles login and authentication endpoints
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(AuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// POST api/auth/login
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponse>> Login([FromBody] LoginRequest request)
    {
        if (string.IsNullOrEmpty(request.Username) || string.IsNullOrEmpty(request.Password))
        {
            return BadRequest(new LoginResponse
            {
                Success = false,
                Message = "Usuario y contraseña son requeridos"
            });
        }

        var response = await _authService.LoginAsync(request);

        if (!response.Success)
        {
            return Unauthorized(response);
        }

        return Ok(response);
    }

    /// <summary>
    /// POST api/auth/logout
    /// </summary>
    [HttpPost("logout")]
    public ActionResult Logout()
    {
        _logger.LogInformation("User logged out");
        return Ok(new { Success = true, Message = "Sesión cerrada exitosamente" });
    }
}
