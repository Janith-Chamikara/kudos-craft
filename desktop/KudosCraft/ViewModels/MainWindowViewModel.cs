using CommunityToolkit.Mvvm.ComponentModel;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace KudosCraft.ViewModels;

public partial class MainWindowViewModel : ViewModelBase
{
    private readonly IServiceProvider _serviceProvider;

    [ObservableProperty]
    private ViewModelBase? _currentView;

    [ObservableProperty]
    private string? _selectedMenuItem;

    [ObservableProperty]
    private bool _isLoggedIn;

    public MainWindowViewModel(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;

        // Start with the login view
        CurrentView = _serviceProvider.GetRequiredService<LoginViewModel>();

        // Set up the login view to navigate to dashboard on successful login
        if (CurrentView is LoginViewModel loginViewModel)
        {
            loginViewModel.LoginSuccessful += OnLoginSuccessful;
        }
    }

    private void OnLoginSuccessful(object? sender, EventArgs e)
    {
        IsLoggedIn = true;

        // Navigate to the dashboard view after successful login
        CurrentView = _serviceProvider.GetRequiredService<DashboardViewModel>();
    }

    partial void OnSelectedMenuItemChanged(string? value)
    {
        if (!IsLoggedIn)
            return;

        CurrentView = value switch
        {
            "workspaces" => _serviceProvider.GetRequiredService<WorkspacesViewModel>(),
            //"testimonials" => _serviceProvider.GetRequiredService<TestimonialsViewModel>(),
            "users" => _serviceProvider.GetRequiredService<UsersViewModel>(),
            //"analytics" => _serviceProvider.GetRequiredService<AnalyticsViewModel>(),
            //"subscriptions" => _serviceProvider.GetRequiredService<SubscriptionsViewModel>(),
            //"payments" => _serviceProvider.GetRequiredService<PaymentsViewModel>(),
            _ => CurrentView
        };
    }
}
