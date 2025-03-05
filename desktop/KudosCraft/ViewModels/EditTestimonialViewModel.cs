using System;
using System.Windows.Input;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;

namespace KudosCraft.ViewModels
{
    public partial class EditTestimonialViewModel : ViewModelBase
    {
        private readonly TestimonialModel _originalTestimonial;
        private readonly Window _window;

        [ObservableProperty]
        private string _name;

        [ObservableProperty]
        private string _content;

        [ObservableProperty]
        private float _ratings;

        [ObservableProperty]
        private string _nameError = string.Empty;

        [ObservableProperty]
        private string _contentError = string.Empty;

        [ObservableProperty]
        private string _ratingError = string.Empty;

        [ObservableProperty]
        private bool _hasValidationErrors;

        public bool HasChanges { get; private set; }

        public EditTestimonialViewModel(TestimonialModel testimonial, Window window)
        {
            _originalTestimonial = testimonial;
            _window = window;

            // Initialize with values from the testimonial
            Name = testimonial.Name;
            Content = testimonial.Review;
            Ratings = testimonial.Ratings;

            // Initial validation
            ValidateTitle();
            ValidateContent();
            ValidateRating();
            UpdateValidationState();

            Debug.WriteLine($"Initial state - Title: '{Name}', Content: '{Content}', Rating: {Ratings}, HasValidationErrors: {HasValidationErrors}");
        }

        partial void OnNameChanged(string value)
        {
            Debug.WriteLine($"Title changed to: '{value}'");
            ValidateTitle();
            UpdateValidationState();
        }

        partial void OnContentChanged(string value)
        {
            Debug.WriteLine($"Content changed to: '{value}'");
            ValidateContent();
            UpdateValidationState();
        }

        partial void OnRatingsChanged(float value)
        {
            Debug.WriteLine($"Rating changed to: {value}");
            ValidateRating();
            UpdateValidationState();
        }

        private void UpdateValidationState()
        {
            HasValidationErrors = !string.IsNullOrEmpty(NameError) ||
                                !string.IsNullOrEmpty(ContentError) ||
                                !string.IsNullOrEmpty(RatingError);

            Debug.WriteLine($"Validation state updated - TitleError: '{NameError}', ContentError: '{ContentError}', " +
                           $"RatingError: '{RatingError}', HasValidationErrors: {HasValidationErrors}");
        }

        private void ValidateTitle()
        {
            if (string.IsNullOrWhiteSpace(Name))
            {
                NameError = "Name is required";
            }
            else if (Name.Length < 3)
            {
                NameError = "Name must be at least 3 characters";
            }
            else
            {
                NameError = string.Empty;
            }
        }

        private void ValidateContent()
        {
            if (string.IsNullOrWhiteSpace(Content))
            {
                ContentError = "Content is required";
            }
            else if (Content.Length < 10)
            {
                ContentError = "Content must be at least 10 characters";
            }
            else
            {
                ContentError = string.Empty;
            }
        }

        private void ValidateRating()
        {
            if (Ratings < 1 || Ratings > 5)
            {
                RatingError = "Rating must be between 1 and 5";
            }
            else
            {
                RatingError = string.Empty;
            }
        }

        [RelayCommand]
        private void Cancel()
        {
            _window.Close();
        }

        [RelayCommand]
        private void Save()
        {
            Debug.WriteLine("Save command executed");

            ValidateTitle();
            ValidateContent();
            ValidateRating();
            UpdateValidationState();

            if (HasValidationErrors)
            {
                Debug.WriteLine("Save aborted due to validation errors");
                return;
            }

            _originalTestimonial.Name = Name;
            _originalTestimonial.Review = Content;
            _originalTestimonial.Ratings = Ratings;
            _originalTestimonial.UpdatedAt = DateTime.Now;

            HasChanges = true;
            Debug.WriteLine("Changes saved successfully");

            _window.Close();
        }
    }
}