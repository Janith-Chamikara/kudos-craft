using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;
using KudosCraft.Services;
using System;
using System.Diagnostics;

namespace KudosCraft.Views
{
    public partial class AddWorkspaceWindow : Window
    {
        public AddWorkspaceWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        public AddWorkspaceWindow(Window owner) : this()
        {
            // Get the current user ID
            string userId = SessionService.Instance.UserId;
            Debug.WriteLine($"Creating new workspace with owner ID: {userId}");

            // Create a new workspace model for adding
            var workspace = new WorkspaceModel
            {
                Id = Guid.NewGuid().ToString(),
                Name = string.Empty,
                Description = string.Empty,
                CreatedAt = DateTime.Now,
                OwnerId = userId // Default to current user
            };

            // Set the DataContext
            DataContext = new AddWorkspaceViewModel(workspace, this);

            // Log the DataContext
            if (DataContext is AddWorkspaceViewModel vm)
            {
                Debug.WriteLine($"ViewModel initialized - OwnerId: '{vm.OwnerId}'");
            }
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}