namespace TaskManagerApi.Views;

/// <summary>
/// Login request DTO - View layer (V in MVC)
/// </summary>
public class LoginRequest
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}

/// <summary>
/// Login response DTO - View layer (V in MVC)
/// </summary>
public class LoginResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public string? Username { get; set; }
    public string? Token { get; set; }
}
