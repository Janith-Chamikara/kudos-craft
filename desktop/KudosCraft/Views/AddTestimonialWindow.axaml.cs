using Avalonia;
using Avalonia.Controls;
using Avalonia.Markup.Xaml;
using KudosCraft.ViewModels;

namespace KudosCraft.Views
{
    public partial class AddTestimonialWindow : Window
    {
        public AddTestimonialWindow()
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
        }

        public AddTestimonialWindow(Window parent)
        {
            InitializeComponent();
#if DEBUG
            this.AttachDevTools();
#endif
            var testimonial = new TestimonialModel();
            DataContext = new AddTestimonialViewModel(testimonial, this);
        }

        private void InitializeComponent()
        {
            AvaloniaXamlLoader.Load(this);
        }
    }
}