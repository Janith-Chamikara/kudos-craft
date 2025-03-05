using System;
using System.Windows.Input;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;
using System.Text.RegularExpressions;

namespace KudosCraft.ViewModels
{
    public partial class AddTestimonialViewModel : ViewModelBase
    {
        private readonly TestimonialModel _newTestimonial;
        private readonly Window _window;

        [ObservableProperty]
        private string _workspaceId = string.Empty;

        [ObservableProperty]
        private string _name = string.Empty;

        [ObservableProperty]
        private string _email = string.Empty;

        [ObservableProperty]
        private string _review = string.Empty;

        [ObservableProperty]
        private int _rating = 1;

        [ObservableProperty]
        private string _workspaceIdError = string.Empty;

        [ObservableProperty]
        private string _nameError = string.Empty;

        [ObservableProperty]
        private string _emailError = string.Empty;

        [ObservableProperty]
        private string _contentError = string.Empty;

        [ObservableProperty]
        private string _ratingError = string.Empty;

        [ObservableProperty]
        private bool _hasValidationErrors;

        public bool HasChanges { get; private set; }

        public TestimonialModel CreatedTestimonial => _newTestimonial;

        public AddTestimonialViewModel(TestimonialModel testimonial, Window window)
        {
            _newTestimonial = testimonial;
            _window = window;

            // Initialize with default values
            WorkspaceId = string.Empty;
            Name = string.Empty;
            Email = string.Empty;
            Review = string.Empty;
            Rating = 1;

            // Initial validation
            ValidateWorkspaceId();
            ValidateName();
            ValidateEmail();
            ValidateContent();
            ValidateRating();
            UpdateValidationState();

            Debug.WriteLine($"Initial state - WorkspaceId: '{WorkspaceId}', Name: '{Name}', Email: '{Email}', Content: '{Review}', Rating: {Rating}, HasValidationErrors: {HasValidationErrors}");
        }

        partial void OnWorkspaceIdChanged(string value)
        {
            Debug.WriteLine($"WorkspaceId changed to: '{value}'");
            ValidateWorkspaceId();
            UpdateValidationState();
        }

        partial void OnNameChanged(string value)
        {
            Debug.WriteLine($"Name changed to: '{value}'");
            ValidateName();
            UpdateValidationState();
        }

        partial void OnEmailChanged(string value)
        {
            Debug.WriteLine($"Email changed to: '{value}'");
            ValidateEmail();
            UpdateValidationState();
        }

        partial void OnReviewChanged(string value)
        {
            Debug.WriteLine($"Content changed to: '{value}'");
            ValidateContent();
            UpdateValidationState();
        }

        partial void OnRatingChanged(int value)
        {
            Debug.WriteLine($"Rating changed to: {value}");
            ValidateRating();
            UpdateValidationState();
        }

        private void UpdateValidationState()
        {
            HasValidationErrors = !string.IsNullOrEmpty(WorkspaceIdError) ||
                                !string.IsNullOrEmpty(NameError) ||
                                !string.IsNullOrEmpty(EmailError) ||
                                !string.IsNullOrEmpty(ContentError) ||
                                !string.IsNullOrEmpty(RatingError);

            Debug.WriteLine($"Validation state updated - WorkspaceIdError: '{WorkspaceIdError}', NameError: '{NameError}', EmailError: '{EmailError}', ContentError: '{ContentError}', " +
                           $"RatingError: '{RatingError}', HasValidationErrors: {HasValidationErrors}");
        }

        private void ValidateWorkspaceId()
        {
            if (string.IsNullOrWhiteSpace(WorkspaceId))
            {
                WorkspaceIdError = "Workspace ID is required";
            }
            else
            {
                WorkspaceIdError = string.Empty;
            }
        }

        private void ValidateName()
        {
            if (string.IsNullOrWhiteSpace(Name))
            {
                NameError = "Name is required";
            }
            else if (Name.Length < 2)
            {
                NameError = "Name must be at least 2 characters";
            }
            else
            {
                NameError = string.Empty;
            }
        }

        private void ValidateEmail()
        {
            if (string.IsNullOrWhiteSpace(Email))
            {
                EmailError = "Email is required";
            }
            else if (!IsValidEmail(Email))
            {
                EmailError = "Please enter a valid email address";
            }
            else
            {
                EmailError = string.Empty;
            }
        }

        private bool IsValidEmail(string email)
        {
            string pattern = @"^[^@\s]+@[^@\s]+\.[^@\s]+$";
            return Regex.IsMatch(email, pattern);
        }

        private void ValidateContent()
        {
            if (string.IsNullOrWhiteSpace(Review))
            {
                ContentError = "Review is required";
            }
            else if (Review.Length < 10)
            {
                ContentError = "Review must be at least 10 characters";
            }
            else
            {
                ContentError = string.Empty;
            }
        }

        private void ValidateRating()
        {
            if (Rating < 1 || Rating > 5)
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

            ValidateWorkspaceId();
            ValidateName();
            ValidateEmail();
            ValidateContent();
            ValidateRating();
            UpdateValidationState();

            if (HasValidationErrors)
            {
                Debug.WriteLine("Save aborted due to validation errors");
                return;
            }

            _newTestimonial.WorkspaceId = WorkspaceId;
            _newTestimonial.Name = Name;
            _newTestimonial.Email = Email;
            _newTestimonial.Review = Review;
            _newTestimonial.Ratings = Rating;
            _newTestimonial.CreatedAt = DateTime.Now;

            HasChanges = true;
            Debug.WriteLine("Changes saved successfully");

            _window.Close();
        }
    }
}