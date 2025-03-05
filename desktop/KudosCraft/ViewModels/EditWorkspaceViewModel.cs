using System;
using System.Threading.Tasks;
using System.Windows.Input;
using Avalonia.Controls;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;

namespace KudosCraft.ViewModels
{
    public partial class EditWorkspaceViewModel : ViewModelBase
    {
        private readonly WorkspaceModel _originalWorkspace;
        private readonly Window _window;

        [ObservableProperty]
        private string _id;

        [ObservableProperty]
        private string _name;

        [ObservableProperty]
        private string _description;

        [ObservableProperty]
        private DateTime _createdAt;

        [ObservableProperty]
        private string _ownerId;

        [ObservableProperty]
        private string _nameError;

        public bool HasValidationErrors => !string.IsNullOrEmpty(NameError);

        public bool HasChanges { get; private set; }

        public EditWorkspaceViewModel(WorkspaceModel workspace, Window window)
        {
            _originalWorkspace = workspace;
            _window = window;

            // Initialize properties with values from the workspace
            Id = workspace.Id;
            Name = workspace.Name;
            Description = workspace.Description ?? string.Empty;
            CreatedAt = workspace.CreatedAt;
            OwnerId = workspace.OwnerId;

            // Initialize with empty error
            NameError = string.Empty;
        }

        partial void OnNameChanged(string value)
        {
            ValidateName();
            OnPropertyChanged(nameof(HasValidationErrors));
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

        [RelayCommand]
        private void Cancel()
        {
            // Close the window without saving changes
            _window.Close();
        }

        [RelayCommand(CanExecute = nameof(CanSave))]
        private void Save()
        {
            // Validate before saving
            ValidateName();

            if (HasValidationErrors)
            {
                return;
            }

            // Update the original workspace with edited values
            _originalWorkspace.Name = Name;
            _originalWorkspace.Description = Description;

            // Set flag to indicate changes were made
            HasChanges = true;

            // Close the window
            _window.Close();
        }

        private bool CanSave()
        {
            return !string.IsNullOrWhiteSpace(Name) && !HasValidationErrors;
        }
    }
}