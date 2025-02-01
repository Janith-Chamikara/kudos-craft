using System;

namespace KudosCraft.Services
{
    public class SessionService
    {
        private static SessionService _instance;
        public static SessionService Instance => _instance ??= new SessionService();

        // User Info
        public string UserId { get; private set; }
        public string Email { get; private set; }
        public string FirstName { get; private set; }
        public string LastName { get; private set; }
        public string Role { get; private set; }
        public string CompanyName { get; private set; }

        // Token Info
        public string AccessToken { get; private set; }
        public long AccessTokenExpiresIn { get; private set; }
        public string RefreshToken { get; private set; }
        public long RefreshTokenExpiresIn { get; private set; }

        public void SetSession(
            string userId, string email, string firstName, string lastName,
            string role, string companyName,
            string accessToken, long accessTokenExpiresIn,
            string refreshToken, long refreshTokenExpiresIn)
        {
            UserId = userId;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            Role = role;
            CompanyName = companyName;

            AccessToken = accessToken;
            AccessTokenExpiresIn = accessTokenExpiresIn;
            RefreshToken = refreshToken;
            RefreshTokenExpiresIn = refreshTokenExpiresIn;
        }

        public void ClearSession()
        {
            UserId = null;
            Email = null;
            FirstName = null;
            LastName = null;
            Role = null;
            CompanyName = null;

            AccessToken = null;
            AccessTokenExpiresIn = 0;
            RefreshToken = null;
            RefreshTokenExpiresIn = 0;
        }
    }
}
