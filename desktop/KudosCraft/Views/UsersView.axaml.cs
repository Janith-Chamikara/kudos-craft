using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;
using System.Diagnostics;

namespace KudosCraft.Views
{
    public partial class UsersView : UserControl
    {
        public UsersView()
        {
            InitializeComponent();
            // Don't create a new ViewModel here, it will be set by the DashboardViewModel
            Debug.WriteLine("UsersView initialized");
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
            Debug.WriteLine("UsersView components loaded");
        }
    }
}