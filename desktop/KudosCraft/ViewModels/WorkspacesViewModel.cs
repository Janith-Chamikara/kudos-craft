using System.Collections.ObjectModel;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;
using KudosCraft.Services;
using System.Diagnostics;
using KudosCraft.Views;
using Avalonia.Controls;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia;
using System.Text;
using System.Net.Http.Headers;
using System.Text.Json;

namespace KudosCraft.ViewModels;

public partial class WorkspacesViewModel : ViewModelBase
{
    private readonly HttpClient _httpClient;

    [ObservableProperty]
    private bool _isLoading = true;

    [ObservableProperty]
    private ObservableCollection<WorkspaceModel> _workspaces = new();

    public WorkspacesViewModel()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("http://localhost:3001")
        };
        LoadDataAsync();
    }

    public WorkspacesViewModel(HttpClient httpClient)
    {
        _httpClient = httpClient;
        LoadDataAsync();
    }

    private async Task LoadDataAsync()
    {
        try
        {
            IsLoading = true;

            // Get the access token from the session
            var accessToken = SessionService.Instance.AccessToken;
            Debug.WriteLine($"Access Token: {accessToken}");

            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            }

            // Add a small delay to ensure UI updates
            await Task.Delay(500);

            // Fetch workspaces from the API
            var workspaces = await _httpClient.GetFromJsonAsync<List<WorkspaceModel>>("api/workspace/admin/get-all");

            // Debug output to check what we received
            Debug.WriteLine($"Received workspaces: {workspaces?.Count ?? 0}");

            if (workspaces != null && workspaces.Count > 0)
            {
                Workspaces = new ObservableCollection<WorkspaceModel>(workspaces);
                Debug.WriteLine($"Set Workspaces collection with {Workspaces.Count} items");

                foreach (var workspace in Workspaces)
                {
                    Debug.WriteLine($"Workspace: {workspace.Id}, {workspace.Name}, {workspace.CreatedAt}, {workspace.Description}");
                }
            }
            else
            {
                Debug.WriteLine("No workspaces received or empty list");
                Workspaces = new ObservableCollection<WorkspaceModel>();
            }
        }
        catch (Exception ex)
        {
            // Handle error appropriately
            Debug.WriteLine($"Error loading workspaces: {ex.Message}");
            Debug.WriteLine($"Stack trace: {ex.StackTrace}");

            if (ex.InnerException != null)
            {
                Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }

            // Create an empty collection on error
            Workspaces = new ObservableCollection<WorkspaceModel>();

            // Show error message if we have a window
            ShowErrorMessage("Error Loading Data", $"Failed to load workspaces: {ex.Message}");
        }
        finally
        {
            IsLoading = false;
        }
    }

    // Command properties
    private RelayCommand _addNewCommand;
    public ICommand AddNewCommand => _addNewCommand ??= new RelayCommand(AddNew);

    private RelayCommand<WorkspaceModel> _editCommand;
    public ICommand EditCommand => _editCommand ??= new RelayCommand<WorkspaceModel>(Edit);

    private RelayCommand<WorkspaceModel> _deleteCommand;
    public ICommand DeleteCommand => _deleteCommand ??= new RelayCommand<WorkspaceModel>(Delete);

    private async void AddNew()
    {
        try
        {
            // Get the main window to use as owner for the dialog
            Window mainWindow = GetMainWindow();
            if (mainWindow == null) return;

            // Create and show the add dialog
            var addWindow = new AddWorkspaceWindow(mainWindow);
            await addWindow.ShowDialog(mainWindow);

            // Check if changes were made
            if (addWindow.DataContext is AddWorkspaceViewModel viewModel && viewModel.HasChanges)
            {
                // Get the created workspace
                var newWorkspace = viewModel.CreatedWorkspace;

                // Create the workspace on the server
                bool success = await CreateWorkspaceAsync(newWorkspace);

                if (success)
                {
                    // Show success message
                    ShowSuccessMessage("Success", "Workspace created successfully!");

                    // Refresh the data
                    await LoadDataAsync();
                }
                else
                {
                    // Show error message
                    ShowErrorMessage("Creation Failed", "Failed to create the workspace. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error adding workspace: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while adding the workspace: {ex.Message}");
        }
    }

    private async void Edit(WorkspaceModel workspace)
    {
        if (workspace == null) return;

        try
        {
            // Get the main window to use as owner for the dialog
            Window mainWindow = GetMainWindow();

            // Create and show the edit dialog
            var editWindow = new EditWorkspaceWindow(workspace);

            if (mainWindow != null)
            {
                // Show as dialog with owner
                await editWindow.ShowDialog(mainWindow);
            }
            else
            {
                // Show as regular window if no owner
                editWindow.Show();
            }

            // Check if changes were made
            if (editWindow.DataContext is EditWorkspaceViewModel viewModel && viewModel.HasChanges)
            {
                // Update the workspace on the server
                bool success = await UpdateWorkspaceAsync(workspace);

                if (success)
                {
                    // Show success message
                    ShowSuccessMessage("Success", "Workspace updated successfully!");

                    // Refresh the data
                    await LoadDataAsync();
                }
                else
                {
                    // Show error message
                    ShowErrorMessage("Update Failed", "Failed to update the workspace. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error editing workspace: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while editing the workspace: {ex.Message}");
        }
    }

    private async Task<bool> UpdateWorkspaceAsync(WorkspaceModel workspace)
    {
        try
        {
            var accessToken = SessionService.Instance.AccessToken;
            if (string.IsNullOrEmpty(accessToken))
            {
                Debug.WriteLine("No access token available for update");
                return false;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var requiredData = new
            {
                name = workspace.Name,
                description = workspace.Description,
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PutAsync($"api/workspace/update?workspaceId={workspace.Id}", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Workspace updated successfully: {workspace.Id}");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to update workspace. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error updating workspace: {ex.Message}");
            if (ex.InnerException != null)
            {
                Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
            return false;
        }
    }

    private async Task<bool> CreateWorkspaceAsync(WorkspaceModel workspace)
    {
        try
        {
            var accessToken = SessionService.Instance.AccessToken;
            if (string.IsNullOrEmpty(accessToken))
            {
                Debug.WriteLine("No access token available for update");
                return false;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var requiredData = new
            {
                name = workspace.Name,
                description = workspace.Description,
                ownerId = workspace.OwnerId
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync($"api/workspace/create", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Workspace created successfully");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to create workspace. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error creating workspace: {ex.Message}");
            if (ex.InnerException != null)
            {
                Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }
            return false;
        }
    }

    private async void Delete(WorkspaceModel workspace)
    {
        if (workspace == null) return;

        try
        {

            var response = await _httpClient.DeleteAsync($"api/workspace/delete?workspaceId={workspace.Id}");
            if (response.IsSuccessStatusCode)
            {
                ShowSuccessMessage("Success", "Workspace deleted successfully!");

                // Refresh the data
                await LoadDataAsync();
            }

        }
        catch (Exception ex)
        {
            // Handle error appropriately
            Debug.WriteLine($"Error deleting workspace: {ex.Message}");
        }
    }

    private Window GetMainWindow()
    {
        if (Application.Current?.ApplicationLifetime is IClassicDesktopStyleApplicationLifetime desktop)
        {
            return desktop.MainWindow;
        }
        return null;
    }

    private void ShowSuccessMessage(string title, string message)
    {
        var mainWindow = GetMainWindow();
        if (mainWindow != null)
        {
            MessageBoxWindow.Show(mainWindow, title, message);
        }
    }

    private void ShowErrorMessage(string title, string message)
    {
        var mainWindow = GetMainWindow();
        if (mainWindow != null)
        {
            MessageBoxWindow.Show(mainWindow, title, message);
        }
    }
}

public class WorkspaceModel
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public string OwnerId { get; set; } = string.Empty;
}