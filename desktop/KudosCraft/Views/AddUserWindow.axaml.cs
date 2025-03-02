using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;
using KudosCraft.Services;
using System;
using System.Diagnostics;

namespace KudosCraft.Views
{
    public partial class AddUserWindow : Window
    {
        public AddUserWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        public AddUserWindow(Window owner) : this()
        {
            // Create a new user model for adding
            var user = new UserModel
            {
                
                FirstName = string.Empty,
                LastName = string.Empty,
                Email = string.Empty,
                Role = "user", // Default role
                SubscriptionPlan = "free", // Default subscription plan
                CreatedAt = DateTime.Now
            };

            // Set the DataContext
            DataContext = new AddUserViewModel(user, this);

            // Log the DataContext
            if (DataContext is AddUserViewModel vm)
            {
                Debug.WriteLine($"ViewModel initialized - FirstName: '{vm.FirstName}', LastName: '{vm.LastName}', Email: '{vm.Email}', Role: '{vm.Role}'");
            }
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}