using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;

namespace KudosCraft.Views
{
    public partial class WorkspacesView : UserControl
    {
        public WorkspacesView()
        {
            InitializeComponent();
           
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}
