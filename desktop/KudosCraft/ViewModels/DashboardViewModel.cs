using CommunityToolkit.Mvvm.ComponentModel;
using Avalonia.Controls;
using System;

namespace KudosCraft.ViewModels
{
    public partial class DashboardViewModel : ViewModelBase
    {
        [ObservableProperty]
        private int _totalWorkspaces = 1;

        [ObservableProperty]
        private int _totalTestimonials = 5;

        [ObservableProperty]
        private double _averageRating = 3.4;

        [ObservableProperty]
        private string _monthlyGrowth = "+28%";

        [ObservableProperty]
        private ViewModelBase? _currentView;

        [ObservableProperty]
        private ListBoxItem? _selectedMenuItem;

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