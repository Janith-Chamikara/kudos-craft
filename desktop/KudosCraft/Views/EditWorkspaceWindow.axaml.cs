using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;

namespace KudosCraft.Views
{
    public partial class EditWorkspaceWindow : Window
    {
        public EditWorkspaceWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        public EditWorkspaceWindow(WorkspaceModel workspace) : this()
        {
            DataContext = new EditWorkspaceViewModel(workspace, this);
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}