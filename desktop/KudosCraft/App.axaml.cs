using System.Linq;
using Avalonia;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Data.Core;
using Avalonia.Data.Core.Plugins;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;
using KudosCraft.Views;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Net.Http;

namespace KudosCraft
{
    public partial class App : Application
    {
        public IServiceProvider? Services { get; private set; }

        public override void Initialize()
        {
            AvaloniaXamlLoader.Load(this);

            var services = new ServiceCollection();

            // Register HttpClient
            services.AddSingleton<HttpClient>(sp => new HttpClient
            {
                BaseAddress = new Uri("http://localhost:3001")
            });

            // Register ViewModels
            services.AddTransient<MainWindowViewModel>();
            services.AddTransient<LoginViewModel>();
            services.AddTransient<DashboardViewModel>(sp => new DashboardViewModel(sp));
            services.AddTransient<WorkspacesViewModel>();
            //services.AddTransient<TestimonialsViewModel>();
            services.AddTransient<UsersViewModel>();
            //services.AddTransient<AnalyticsViewModel>();
            //services.AddTransient<SubscriptionsViewModel>();
            //services.AddTransient<PaymentsViewModel>();

            Services = services.BuildServiceProvider();
        }

        public override void OnFrameworkInitializationCompleted()
        {
            if (ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
            {
                // Avoid duplicate validations from both Avalonia and the CommunityToolkit. 
                // More info: https://docs.avaloniaui.net/docs/guides/development-guides/data-validation#manage-validationplugins
                DisableAvaloniaDataAnnotationValidation();
                desktop.MainWindow = new MainWindow
                {
                    DataContext = Services?.GetRequiredService<MainWindowViewModel>(),
                };
            }

            base.OnFrameworkInitializationCompleted();
        }

        private void DisableAvaloniaDataAnnotationValidation()
        {
            // Get an array of plugins to remove
            var dataValidationPluginsToRemove =
                BindingPlugins.DataValidators.OfType<DataAnnotationsValidationPlugin>().ToArray();

            // remove each entry found
            foreach (var plugin in dataValidationPluginsToRemove)
            {
                BindingPlugins.DataValidators.Remove(plugin);
            }
        }
    }
}