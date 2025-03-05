using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;

namespace KudosCraft.ViewModels
{
    public partial class EditUserViewModel : ViewModelBase
    {
        private readonly UserModel _originalUser;
        private readonly Window _window;

        [ObservableProperty]
        private string _firstName;

        [ObservableProperty]
        private string _lastName;

        [ObservableProperty]
        private string _email;

        // For ComboBox binding
        private object _roleItem;
        public object RoleItem
        {
            get => _roleItem;
            set
            {
                if (SetProperty(ref _roleItem, value))
                {
                    if (value is ComboBoxItem comboBoxItem)
                    {
                        Role = comboBoxItem.Content?.ToString() ?? string.Empty;
                    }
                    else if (value is string strValue)
                    {
                        Role = strValue;
                    }
                }
            }
        }

        // Actual string value
        [ObservableProperty]
        private string _role;

        // For ComboBox binding
        private object _subscriptionPlanItem;
        public object SubscriptionPlanItem
        {
            get => _subscriptionPlanItem;
            set
            {
                if (SetProperty(ref _subscriptionPlanItem, value))
                {
                    if (value is ComboBoxItem comboBoxItem)
                    {
                        SubscriptionPlan = comboBoxItem.Content?.ToString() ?? string.Empty;
                    }
                    else if (value is string strValue)
                    {
                        SubscriptionPlan = strValue;
                    }
                }
            }
        }

        // Actual string value
        [ObservableProperty]
        private string _subscriptionPlan;

        [ObservableProperty]
        private string _firstNameError = string.Empty;

        [ObservableProperty]
        private string _lastNameError = string.Empty;

        [ObservableProperty]
        private string _emailError = string.Empty;

        [ObservableProperty]
        private string _roleError = string.Empty;

        [ObservableProperty]
        private bool _hasValidationErrors;

        public bool HasChanges { get; private set; }

        public EditUserViewModel(UserModel user, Window window)
        {
            _originalUser = user;
            _window = window;

            // Initialize with values from the user
            FirstName = user.FirstName;
            LastName = user.LastName;
            Email = user.Email;
            Role = user.Role;
            SubscriptionPlan = user.SubscriptionPlan;

            // Initial validation
            ValidateFirstName();
            ValidateLastName();
            ValidateEmail();
            ValidateRole();
            UpdateValidationState();

            Debug.WriteLine($"Initial state - FirstName: '{FirstName}', LastName: '{LastName}', Email: '{Email}', Role: '{Role}', HasValidationErrors: {HasValidationErrors}");
        }

        partial void OnFirstNameChanged(string value)
        {
            Debug.WriteLine($"FirstName changed to: '{value}'");
            ValidateFirstName();
            UpdateValidationState();
        }

        partial void OnLastNameChanged(string value)
        {
            Debug.WriteLine($"LastName changed to: '{value}'");
            ValidateLastName();
            UpdateValidationState();
        }

        partial void OnEmailChanged(string value)
        {
            Debug.WriteLine($"Email changed to: '{value}'");
            ValidateEmail();
            UpdateValidationState();
        }

        partial void OnRoleChanged(string value)
        {
            Debug.WriteLine($"Role changed to: '{value}'");
            ValidateRole();
            UpdateValidationState();
        }

        private void UpdateValidationState()
        {
            HasValidationErrors = !string.IsNullOrEmpty(FirstNameError) ||
                                 !string.IsNullOrEmpty(LastNameError) ||
                                 !string.IsNullOrEmpty(EmailError) ||
                                 !string.IsNullOrEmpty(RoleError);

            Debug.WriteLine($"Validation state updated - FirstNameError: '{FirstNameError}', LastNameError: '{LastNameError}', " +
                           $"EmailError: '{EmailError}', RoleError: '{RoleError}', HasValidationErrors: {HasValidationErrors}");
        }

        private void ValidateFirstName()
        {
            if (string.IsNullOrWhiteSpace(FirstName))
            {
                FirstNameError = "First name is required";
            }
            else if (FirstName.Length < 2)
            {
                FirstNameError = "First name must be at least 2 characters";
            }
            else
            {
                FirstNameError = string.Empty;
            }
        }

        private void ValidateLastName()
        {
            if (string.IsNullOrWhiteSpace(LastName))
            {
                LastNameError = "Last name is required";
            }
            else if (LastName.Length < 2)
            {
                LastNameError = "Last name must be at least 2 characters";
            }
            else
            {
                LastNameError = string.Empty;
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

        private void ValidateRole()
        {
            if (string.IsNullOrWhiteSpace(Role))
            {
                RoleError = "Role is required";
            }
            else
            {
                RoleError = string.Empty;
            }
        }

        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        [RelayCommand]
        private void Cancel()
        {
            // Close the window without saving changes
            _window.Close();
        }

        [RelayCommand]
        private void Save()
        {
            Debug.WriteLine("Save command executed");

            // Validate before saving
            ValidateFirstName();
            ValidateLastName();
            ValidateEmail();
            ValidateRole();
            UpdateValidationState();

            if (HasValidationErrors)
            {
                Debug.WriteLine("Save aborted due to validation errors");
                return;
            }

            // Update the original user with entered values
            _originalUser.FirstName = FirstName;
            _originalUser.LastName = LastName;
            _originalUser.Email = Email;
            _originalUser.Role = Role;
            _originalUser.SubscriptionPlan = SubscriptionPlan;

            // Set flag to indicate changes were made
            HasChanges = true;
            Debug.WriteLine("Changes saved successfully");

            // Close the window
            _window.Close();
        }
    }
}