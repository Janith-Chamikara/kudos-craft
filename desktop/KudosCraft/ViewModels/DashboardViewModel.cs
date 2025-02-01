using CommunityToolkit.Mvvm.ComponentModel;
using Avalonia.Controls;
using System;
using System.Net.Http;

namespace KudosCraft.ViewModels
{
    public partial class DashboardViewModel : ViewModelBase
    {
        private readonly HttpClient _httpClient;

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
        }

        partial void OnSelectedMenuItemChanged(ListBoxItem? value)
        {
            if (value != null)
            {
                CurrentView = (value.Tag as string) switch
                {
                    "workspaces" => new WorkspacesViewModel(),
                    "testimonials" => new TestimonialsViewModel(),
                    "users" => new UsersViewModel(),
                    "analytics" => new AnalyticsViewModel(),
                    _ => null
                };
            }
        }
    }
}