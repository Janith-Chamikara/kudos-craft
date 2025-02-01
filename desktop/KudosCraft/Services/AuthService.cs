using System;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using KudosCraft.Models;

namespace KudosCraft.services
{
    public class AuthService
    {
        private readonly SecureStorage _secureStorage;
        private readonly HttpClient _httpClient;
        private AuthState _currentAuthState;
        private readonly string _apiBaseUrl = "http://localhost:3001/api";

        public AuthService()
        {
            _secureStorage = new SecureStorage();
            _httpClient = new HttpClient();
            _currentAuthState = _secureStorage.LoadData<AuthState>();
        }

        public bool IsAuthenticated => _currentAuthState?.TokenInfo?.AccessToken != null;

        public User CurrentUser => _currentAuthState?.User;

        public async Task<string> GetAccessTokenAsync()
        {
            if (_currentAuthState?.TokenInfo == null)
                return null;

            if (DateTime.UtcNow.AddMinutes(5) >= _currentAuthState.TokenInfo.AccessTokenExpiresAt)
            {
                await RefreshTokenAsync();
            }

            return _currentAuthState?.TokenInfo?.AccessToken;
        }

        public async Task LoginAsync(string email, string password)
        {
            var response = await _httpClient.PostAsJsonAsync($"{_apiBaseUrl}/auth/sign-in", new
            {
                email,
                password
            });

            response.EnsureSuccessStatusCode();
            var loginResponse = await response.Content.ReadFromJsonAsync<AuthState>();

            loginResponse.TokenInfo.AccessTokenExpiresAt =
                DateTime.UtcNow.AddSeconds(loginResponse.TokenInfo.AccessTokenExpiresIn);
            loginResponse.TokenInfo.RefreshTokenExpiresAt =
                DateTime.UtcNow.AddSeconds(loginResponse.TokenInfo.RefreshTokenExpiresIn);

            _currentAuthState = loginResponse;
            _secureStorage.SaveData(_currentAuthState);
        }

        public async Task RefreshTokenAsync()
        {
            if (_currentAuthState?.TokenInfo?.RefreshToken == null)
                throw new UnauthorizedAccessException("No refresh token available");

            if (DateTime.UtcNow >= _currentAuthState.TokenInfo.RefreshTokenExpiresAt)
            {
                await LogoutAsync();
                throw new UnauthorizedAccessException("Refresh token has expired");
            }

            var response = await _httpClient.PostAsJsonAsync($"{_apiBaseUrl}/auth/refresh", new
            {
                refreshToken = _currentAuthState.TokenInfo.RefreshToken
            });

            response.EnsureSuccessStatusCode();
            var refreshResponse = await response.Content.ReadFromJsonAsync<AuthState>();

            // Update expiration times
            refreshResponse.TokenInfo.AccessTokenExpiresAt =
                DateTime.UtcNow.AddSeconds(refreshResponse.TokenInfo.AccessTokenExpiresIn);
            refreshResponse.TokenInfo.RefreshTokenExpiresAt =
                DateTime.UtcNow.AddSeconds(refreshResponse.TokenInfo.RefreshTokenExpiresIn);

            _currentAuthState = refreshResponse;
            _secureStorage.SaveData(_currentAuthState);
        }

        public async Task LogoutAsync()
        {
            _currentAuthState = null;
            _secureStorage.ClearData();
        }
    }
}