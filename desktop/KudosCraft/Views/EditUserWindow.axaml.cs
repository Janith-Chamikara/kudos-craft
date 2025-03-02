using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;
using System.Diagnostics;

namespace KudosCraft.Views
{
    public partial class EditUserWindow : Window
    {
        public EditUserWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        public EditUserWindow(UserModel user) : this()
        {
            // Set the DataContext
            DataContext = new EditUserViewModel(user, this);

            // Log the DataContext
            if (DataContext is EditUserViewModel vm)
            {
                Debug.WriteLine($"EditUserViewModel initialized - FirstName: '{vm.FirstName}', LastName: '{vm.LastName}', Email: '{vm.Email}', Role: '{vm.Role}'");
            }
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}