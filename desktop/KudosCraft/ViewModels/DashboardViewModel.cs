using CommunityToolkit.Mvvm.ComponentModel;
using Avalonia.Controls;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.DependencyInjection;
using System.Diagnostics;

namespace KudosCraft.ViewModels
{
    public partial class DashboardViewModel : ViewModelBase
    {
        private readonly HttpClient _httpClient;
        private readonly IServiceProvider? _serviceProvider;

        [ObservableProperty]
        private bool _isLoading = true;

        [ObservableProperty]
        private int _totalWorkspaces = 0;

        [ObservableProperty]
        private int _totalTestimonials = 0;

        [ObservableProperty]
        private double _averageRating = 0;

        [ObservableProperty]
        private string _monthlyGrowth = "+0%";

        [ObservableProperty]
        private ViewModelBase? _currentView;

        [ObservableProperty]
        private ListBoxItem? _selectedMenuItem;

        public DashboardViewModel()
        {
            _httpClient = new HttpClient
            {
                BaseAddress = new Uri("http://localhost:3001")
            };

            // Load dashboard data
            LoadDashboardDataAsync();
        }

        public DashboardViewModel(IServiceProvider serviceProvider) : this()
        {
            _serviceProvider = serviceProvider;
        }

        private async Task LoadDashboardDataAsync()
        {
            try
            {
                IsLoading = true;

                // Simulate loading data
                await Task.Delay(1000);

                // For demo purposes, set some sample data
                TotalWorkspaces = 12;
                TotalTestimonials = 48;
                AverageRating = 4.7;
                MonthlyGrowth = "+15%";

                // In a real app, you would fetch this data from your API
                // var dashboardData = await _httpClient.GetFromJsonAsync<DashboardData>("api/dashboard");
                // if (dashboardData != null)
                // {
                //     TotalWorkspaces = dashboardData.TotalWorkspaces;
                //     TotalTestimonials = dashboardData.TotalTestimonials;
                //     AverageRating = dashboardData.AverageRating;
                //     MonthlyGrowth = dashboardData.MonthlyGrowth;
                // }
            }
            catch (Exception ex)
            {
                // Handle error
                Debug.WriteLine($"Error loading dashboard data: {ex.Message}");
            }
            finally
            {
                IsLoading = false;
            }
        }

        partial void OnSelectedMenuItemChanged(ListBoxItem? value)
        {
            if (value == null) return;

            var tag = value.Tag as string;
            Debug.WriteLine($"Selected menu item: {tag}");

            try
            {
                if (_serviceProvider != null)
                {
                    // Use dependency injection if available
                    Debug.WriteLine("Using service provider to get view model");
                    CurrentView = tag switch
                    {
                        "workspaces" => _serviceProvider.GetRequiredService<WorkspacesViewModel>(),
                        //"testimonials" => _serviceProvider.GetRequiredService<TestimonialsViewModel>(),
                        "users" => _serviceProvider.GetRequiredService<UsersViewModel>(),
                        //"analytics" => _serviceProvider.GetRequiredService<AnalyticsViewModel>(),
                        //"subscriptions" => _serviceProvider.GetRequiredService<SubscriptionsViewModel>(),
                        //"payments" => _serviceProvider.GetRequiredService<PaymentsViewModel>(),
                        _ => null
                    };
                }
                else
                {
                    // Create instances directly if DI is not available
                    Debug.WriteLine("Creating view model directly");
                    CurrentView = tag switch
                    {
                        "workspaces" => new WorkspacesViewModel(_httpClient),
                        //"testimonials" => new WorkspacesViewModel(_httpClient), // Replace with TestimonialsViewModel when available
                        "users" => new UsersViewModel(_httpClient),
                        //"analytics" => new AnalyticsViewModel(),
                        //"subscriptions" => new SubscriptionsViewModel(),
                        //"payments" => new PaymentsViewModel(),
                        _ => null
                    };
                }

                Debug.WriteLine($"Current view set to: {CurrentView?.GetType().Name ?? "null"}");
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error setting current view: {ex.Message}");
                if (ex.InnerException != null)
                {
                    Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
                }
            }

            // If null is selected or an invalid option, show the dashboard
            if (CurrentView == null)
            {
                // Reset to show dashboard summary
                value.IsSelected = false;
                Debug.WriteLine("Reset to dashboard summary");
            }
        }
    }
}