using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System;
using System.Net.Http;
using System.Text.Json;
using System.Text;
using System.Threading.Tasks;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia;
using KudosCraft.Views;

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

                var response = await _httpClient.PostAsync("/api/auth/sign-in", new StringContent(
                    JsonSerializer.Serialize(new { email = Email, password = Password }),
                    Encoding.UTF8,
                    "application/json"));

                if (response.IsSuccessStatusCode)
                {
                    var result = await response.Content.ReadAsStringAsync();
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