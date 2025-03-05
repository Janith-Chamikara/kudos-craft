using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Diagnostics;

namespace KudosCraft.ViewModels
{
    public partial class AddWorkspaceViewModel : ViewModelBase
    {
        private readonly WorkspaceModel _newWorkspace;
        private readonly Window _window;

        [ObservableProperty]
        private string _name = string.Empty;

        [ObservableProperty]
        private string _description = string.Empty;

        [ObservableProperty]
        private string _ownerId = string.Empty;

        [ObservableProperty]
        private string _nameError = string.Empty;

        [ObservableProperty]
        private string _ownerIdError = string.Empty;

        [ObservableProperty]
        private bool _hasValidationErrors;

        public bool HasChanges { get; private set; }

        public WorkspaceModel CreatedWorkspace => _newWorkspace;

        public AddWorkspaceViewModel(WorkspaceModel workspace, Window window)
        {
            _newWorkspace = workspace;
            _window = window;

            // Initialize with values from the workspace
            Name = string.Empty;
            Description = string.Empty;
            OwnerId = workspace.OwnerId; // Use the OwnerId from the workspace

            // Initial validation
            ValidateName();
            ValidateOwnerId();
            UpdateValidationState();

            Debug.WriteLine($"Initial state - Name: '{Name}', OwnerId: '{OwnerId}', HasValidationErrors: {HasValidationErrors}");
        }

        partial void OnNameChanged(string value)
        {
            Debug.WriteLine($"Name changed to: '{value}'");
            ValidateName();
            UpdateValidationState();
        }

        partial void OnOwnerIdChanged(string value)
        {
            Debug.WriteLine($"OwnerId changed to: '{value}'");
            ValidateOwnerId();
            UpdateValidationState();
        }

        private void UpdateValidationState()
        {
            HasValidationErrors = !string.IsNullOrEmpty(NameError) || !string.IsNullOrEmpty(OwnerIdError);
            Debug.WriteLine($"Validation state updated - NameError: '{NameError}', OwnerIdError: '{OwnerIdError}', HasValidationErrors: {HasValidationErrors}");
        }

        private void ValidateName()
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

        private void ValidateOwnerId()
        {
            if (string.IsNullOrWhiteSpace(OwnerId))
            {
                OwnerIdError = "Owner ID is required";
            }
            else
            {
                OwnerIdError = string.Empty;
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
            ValidateName();
            ValidateOwnerId();
            UpdateValidationState();

            if (HasValidationErrors)
            {
                Debug.WriteLine("Save aborted due to validation errors");
                return;
            }

            // Update the new workspace with entered values
            _newWorkspace.Name = Name;
            _newWorkspace.OwnerId = OwnerId;
            _newWorkspace.Description = Description;

            // Set flag to indicate changes were made
            HasChanges = true;
            Debug.WriteLine("Changes saved successfully");

            // Close the window
            _window.Close();
        }
    }
}