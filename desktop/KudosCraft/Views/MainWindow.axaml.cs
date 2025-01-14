using Avalonia.Controls;

namespace KudosCraft.Views
{
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        public void NavigateToView(Control view)
        {
            Content = view;
        }
    }
}