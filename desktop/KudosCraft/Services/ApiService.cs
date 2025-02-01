using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using KudosCraft.Interfaces;
using KudosCraft.ResponseTypes;

namespace KudosCraft.Services
{
    public class ApiService : IApiService
    {
        private readonly HttpClient _httpClient;
        private readonly ITokenService _tokenService;
        private const string BaseUrl = "http://localhost:3001/api";
        public ApiService(HttpClient httpClient, ITokenService tokenService)
        {
            _httpClient = httpClient;
            _tokenService = tokenService;
            _httpClient.BaseAddress = new Uri(BaseUrl);
        }

        private void AddAuthenticationHeader()
        {
            _httpClient.DefaultRequestHeaders.Authorization = _tokenService.HasToken()
                ? new AuthenticationHeaderValue("Bearer", _tokenService.AccessToken)
                : null;
        }

        private StringContent CreateJsonContent(object data)
        {
            return new StringContent(
                JsonSerializer.Serialize(data),
                Encoding.UTF8,
                "application/json");
        }

        public async Task<LoginResponse> LoginAsync(string email, string password)
        {
            try
            {
                var loginData = new
                {
                    email = email,
                    password = password
                };

                var response = await _httpClient.PostAsync(
                    "/auth/login",
                    CreateJsonContent(loginData)
                );

                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var loginResponse = JsonSerializer.Deserialize<LoginResponse>(content,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (loginResponse != null)
                    {
                        return loginResponse;
                    }
                }

               
                return new LoginResponse
                {
                    Success = false,
                    Error = response.IsSuccessStatusCode
                        ? "Invalid response from server"
                        : $"Server error: {response.StatusCode}"
                };
            }
            catch (Exception ex)
            {
                return new LoginResponse
                {
                    Success = false,
                    Error = $"Connection error: {ex.Message}"
                };
            }
        }

        public async Task<DashboardResponse> GetDashboardDataAsync()
        {
            try
            {
                AddAuthenticationHeader();

                var response = await _httpClient.GetAsync("/dashboard");
                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var dashboardData = JsonSerializer.Deserialize<DashboardResponse>(content,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    if (dashboardData != null)
                    {
                        return dashboardData;
                    }
                }

                // If we get here, return default data
                return new DashboardResponse
                {
                    TotalWorkspaces = 0,
                    TotalTestimonials = 0,
                    AverageRating = 0,
                    MonthlyGrowth = "0%"
                };
            }
            catch (Exception)
            {
                return new DashboardResponse
                {
                    TotalWorkspaces = 0,
                    TotalTestimonials = 0,
                    AverageRating = 0,
                    MonthlyGrowth = "0%"
                };
            }
        }

        public async Task<ApiResponse<T>> GetAsync<T>(string endpoint)
        {
            try
            {
                AddAuthenticationHeader();

                var response = await _httpClient.GetAsync(endpoint);
                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var data = JsonSerializer.Deserialize<T>(content,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    return new ApiResponse<T>
                    {
                        Success = true,
                        Data = data
                    };
                }

                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Server error: {response.StatusCode}"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Connection error: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<T>> PostAsync<T>(string endpoint, object data)
        {
            try
            {
                AddAuthenticationHeader();

                var response = await _httpClient.PostAsync(
                    endpoint,
                    CreateJsonContent(data)
                );

                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<T>(content,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    return new ApiResponse<T>
                    {
                        Success = true,
                        Data = result
                    };
                }

                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Server error: {response.StatusCode}"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Connection error: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<T>> PutAsync<T>(string endpoint, object data)
        {
            try
            {
                AddAuthenticationHeader();

                var response = await _httpClient.PutAsync(
                    endpoint,
                    CreateJsonContent(data)
                );

                var content = await response.Content.ReadAsStringAsync();

                if (response.IsSuccessStatusCode)
                {
                    var result = JsonSerializer.Deserialize<T>(content,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });

                    return new ApiResponse<T>
                    {
                        Success = true,
                        Data = result
                    };
                }

                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Server error: {response.StatusCode}"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<T>
                {
                    Success = false,
                    Error = $"Connection error: {ex.Message}"
                };
            }
        }

        public async Task<ApiResponse<bool>> DeleteAsync(string endpoint)
        {
            try
            {
                AddAuthenticationHeader();

                var response = await _httpClient.DeleteAsync(endpoint);

                return new ApiResponse<bool>
                {
                    Success = response.IsSuccessStatusCode,
                    Data = response.IsSuccessStatusCode,
                    Error = response.IsSuccessStatusCode ? null : $"Server error: {response.StatusCode}"
                };
            }
            catch (Exception ex)
            {
                return new ApiResponse<bool>
                {
                    Success = false,
                    Data = false,
                    Error = $"Connection error: {ex.Message}"
                };
            }
        }
    }
}
