﻿using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia;
using KudosCraft.Views;
using KudosCraft.Services;
using KudosCraft.ResponseTypes;

namespace KudosCraft.ViewModels
{
    public partial class LoginViewModel : ViewModelBase
    {
        private readonly HttpClient _httpClient;

        [ObservableProperty]
        private string _email = "";

        [ObservableProperty]
        private string _password = "";

        [ObservableProperty]
        private string _errorMessage = "";

        [ObservableProperty]
        private string _successMessage = "";

        [ObservableProperty]
        private bool _hasError;

        [ObservableProperty]
        private bool _hasSuccess;

        public LoginViewModel()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:3001")
            };
        }

        [RelayCommand]
        private async Task LoginAsync()
        {
            try
            {
                ErrorMessage = "";
                SuccessMessage = "";
                HasError = false;
                HasSuccess = false;

                var requestBody = new
                {
                    email = Email,
                    password = Password
                };

                var response = await _httpClient.PostAsync("/api/auth/sign-in", new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"));

                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var result = JsonSerializer.Deserialize<LoginResponse>(jsonResponse,
                        new JsonSerializerOptions { PropertyNameCaseInsensitive = true });
                    Console.Write(result);

                    if (result != null && result.User != null)
                    {
                        
                        SessionService.Instance.SetSession(
                            result.User.Id,
                            result.User.Email,
                            result.User.FirstName,
                            result.User.LastName,
                            result.User.Role,
                            result.User.CompanyName,
                            result.AccessToken,
                            result.AccessTokenExpiresIn,
                            result.RefreshToken,
                            result.RefreshTokenExpiresIn
                        );

                        SuccessMessage = "Login successful!";
                        HasSuccess = true;

                        await Task.Delay(1000);
                        

                        if (Application.Current?.ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
                        {
                            var mainWindow = desktop.MainWindow;
                            if (mainWindow != null)
                            {
                                var dashboardViewModel = new DashboardViewModel();
                                var dashboardView = new DashboardView
                                {
                                    DataContext = dashboardViewModel
                                };
                                mainWindow.Content = dashboardView;
                            }
                        }
                    }
                    else
                    {
                        ErrorMessage = "Invalid response from server.";
                        HasError = true;
                    }
                }
                else
                {
                    ErrorMessage = "Invalid email or password";
                    HasError = true;
                }
            }
            catch (Exception ex)
            {
                ErrorMessage = "Connection error. Please try again.";
                HasError = true;
            }
        }
    }

   
}
