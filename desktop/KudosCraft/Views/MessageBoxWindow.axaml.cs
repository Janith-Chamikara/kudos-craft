using Avalonia;
using Avalonia.Controls;
using Avalonia.Interactivity;
using Avalonia.Markup.Xaml;
using System.ComponentModel;

namespace KudosCraft.Views
{
    public partial class MessageBoxWindow : Window, INotifyPropertyChanged
    {
        private string _title = string.Empty;
        private string _message = string.Empty;

        public new string Title
        {
            get => _title;
            private set
            {
                if (_title != value)
                {
                    _title = value;
                    base.Title = value;
                    OnPropertyChanged(nameof(Title));
                }
            }
        }

        public string Message
        {
            get => _message;
            private set
            {
                if (_message != value)
                {
                    _message = value;
                    OnPropertyChanged(nameof(Message));
                }
            }
        }

        public new event PropertyChangedEventHandler? PropertyChanged;

        protected virtual void OnPropertyChanged(string propertyName)
        {
            PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
        }

        public MessageBoxWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
            DataContext = this;
        }

        public MessageBoxWindow(string title, string message) : this()
        {
            Title = title;
            Message = message;
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }

        private void OkButton_Click(object sender, RoutedEventArgs e)
        {
            Close();
        }

        public static async void Show(Window owner, string title, string message)
        {
            var messageBox = new MessageBoxWindow(title, message);
            await messageBox.ShowDialog(owner);
        }
    }
}