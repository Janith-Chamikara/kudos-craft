using System.Collections.ObjectModel;
using System.Windows.Input;
using CommunityToolkit.Mvvm.ComponentModel;
using CommunityToolkit.Mvvm.Input;
using System.Net.Http;
using System.Net.Http.Json;
using System.Threading.Tasks;
using System.Collections.Generic;
using System;
using KudosCraft.Services;
using System.Diagnostics;
using System.Net.Http.Headers;
using Avalonia.Controls.ApplicationLifetimes;
using Avalonia.Controls;
using KudosCraft.Views;
using Avalonia;
using System.Text;
using System.Text.Json;

namespace KudosCraft.ViewModels;

public partial class UsersViewModel : ViewModelBase
{
    private readonly HttpClient _httpClient;

    [ObservableProperty]
    private bool _isLoading;

    [ObservableProperty]
    private ObservableCollection<UserModel> _users = new();

    public UsersViewModel()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("http://localhost:3001")
        };
        LoadDataAsync();
    }

    public UsersViewModel(HttpClient httpClient)
    {
        _httpClient = httpClient;
        LoadDataAsync();
    }

    [RelayCommand]
    private async Task Refresh()
    {
        await LoadDataAsync();
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

            try
            {
                // Fetch users from the API
                var users = await _httpClient.GetFromJsonAsync<List<UserModel>>("api/user/admin/get-all");

                // Debug output to check what we received
                Debug.WriteLine($"Received users: {users?.Count ?? 0}");

                if (users != null && users.Count > 0)
                {
                    Users = new ObservableCollection<UserModel>(users);
                    Debug.WriteLine($"Set Users collection with {Users.Count} items");

                    foreach (var user in Users)
                    {
                        Debug.WriteLine($"User: {user.Id}, {user.FirstName} {user.LastName}, {user.Email}, {user.Role}");
                    }
                }
                else
                {
                    Debug.WriteLine("No users received or empty list, adding sample data");
                    // Add sample data for testing
                    Users = new ObservableCollection<UserModel>
                    {
                        new UserModel
                        {
                            Id = Guid.NewGuid().ToString(),
                            FirstName = "John",
                            LastName = "Doe",
                            Email = "john.doe@example.com",
                            Role = "Admin",
                            SubscriptionPlan = "Premium",
                            CreatedAt = DateTime.Now.AddDays(-30)
                        },
                        new UserModel
                        {
                            Id = Guid.NewGuid().ToString(),
                            FirstName = "Jane",
                            LastName = "Smith",
                            Email = "jane.smith@example.com",
                            Role = "User",
                            SubscriptionPlan = "Basic",
                            CreatedAt = DateTime.Now.AddDays(-15)
                        },
                        new UserModel
                        {
                            Id = Guid.NewGuid().ToString(),
                            FirstName = "Bob",
                            LastName = "Johnson",
                            Email = "bob.johnson@example.com",
                            Role = "Manager",
                            SubscriptionPlan = "Enterprise",
                            CreatedAt = DateTime.Now.AddDays(-5)
                        }
                    };
                }
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching users from API: {ex.Message}");
                Debug.WriteLine("Adding sample data instead");

                // Add sample data for testing
                Users = new ObservableCollection<UserModel>
                {
                    new UserModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        FirstName = "John",
                        LastName = "Doe",
                        Email = "john.doe@example.com",
                        Role = "Admin",
                        SubscriptionPlan = "Premium",
                        CreatedAt = DateTime.Now.AddDays(-30)
                    },
                    new UserModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        FirstName = "Jane",
                        LastName = "Smith",
                        Email = "jane.smith@example.com",
                        Role = "User",
                        SubscriptionPlan = "Basic",
                        CreatedAt = DateTime.Now.AddDays(-15)
                    },
                    new UserModel
                    {
                        Id = Guid.NewGuid().ToString(),
                        FirstName = "Bob",
                        LastName = "Johnson",
                        Email = "bob.johnson@example.com",
                        Role = "Manager",
                        SubscriptionPlan = "Enterprise",
                        CreatedAt = DateTime.Now.AddDays(-5)
                    }
                };
            }
        }
        catch (Exception ex)
        {
            // Handle error appropriately
            Debug.WriteLine($"Error loading users: {ex.Message}");
            Debug.WriteLine($"Stack trace: {ex.StackTrace}");

            if (ex.InnerException != null)
            {
                Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }

            // Create an empty collection on error
            Users = new ObservableCollection<UserModel>();

            // Show error message if we have a window
            ShowErrorMessage("Error Loading Data", $"Failed to load users: {ex.Message}");
        }
        finally
        {
            IsLoading = false;
        }
    }

    [RelayCommand]
    private async Task AddNew()
    {
        try
        {
            // Get the main window to use as owner for the dialog
            Window mainWindow = GetMainWindow();
            if (mainWindow == null) return;

            // Create a new user model
            var newUser = new UserModel
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = string.Empty,
                LastName = string.Empty,
                Email = string.Empty,
                Role = "user", // Default role
                SubscriptionPlan = "Free", // Default subscription plan
                CreatedAt = DateTime.Now
            };

            // Create and show the add dialog
            var addWindow = new AddUserWindow(mainWindow);
            await addWindow.ShowDialog(mainWindow);

            // Check if changes were made
            if (addWindow.DataContext is AddUserViewModel viewModel && viewModel.HasChanges)
            {
                // Get the created user
                var createdUser = viewModel.CreatedUser;

                // Create the user on the server
                bool success = await CreateUserAsync(createdUser);

                if (success)
                {
                    // Show success message
                    ShowSuccessMessage("Success", "User created successfully!");

                    // Refresh the data
                    await LoadDataAsync();
                }
                else
                {
                    // Show error message
                    ShowErrorMessage("Creation Failed", "Failed to create the user. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error adding user: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while adding the user: {ex.Message}");
        }
    }

    [RelayCommand]
    private async Task Edit(UserModel user)
    {
        if (user == null) return;

        try
        {
            // Get the main window to use as owner for the dialog
            Window mainWindow = GetMainWindow();

            // Create and show the edit dialog
            var editWindow = new EditUserWindow(user);

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
            if (editWindow.DataContext is EditUserViewModel viewModel && viewModel.HasChanges)
            {
                // Update the user on the server
                bool success = await UpdateUserAsync(user);

                if (success)
                {
                    // Show success message
                    ShowSuccessMessage("Success", "User updated successfully!");

                    // Refresh the data
                    await LoadDataAsync();
                }
                else
                {
                    // Show error message
                    ShowErrorMessage("Update Failed", "Failed to update the user. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error editing user: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while editing the user: {ex.Message}");
        }
    }

    private async Task<bool> UpdateUserAsync(UserModel user)
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
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                role = user.Role,
                subscriptionPlan = user.SubscriptionPlan
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PutAsync($"api/user/update?userId={user.Id}", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine($"User updated successfully: {user.Id}");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to update user. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error updating user: {ex.Message}");
            return false;
        }
    }

    private async Task<bool> CreateUserAsync(UserModel user)
    {
        try
        {
            var accessToken = SessionService.Instance.AccessToken;
            if (string.IsNullOrEmpty(accessToken))
            {
                Debug.WriteLine("No access token available for create");
                return false;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var requiredData = new
            {
                firstName = user.FirstName,
                lastName = user.LastName,
                email = user.Email,
                role = user.Role,
                subscriptionPlan = user.SubscriptionPlan
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync("api/auth/sign-up", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine("User created successfully");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to create user. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error creating user: {ex.Message}");
            return false;
        }
    }

    [RelayCommand]
    private async Task Delete(UserModel user)
    {
        try
        {
            var accessToken = SessionService.Instance.AccessToken;
            if (string.IsNullOrEmpty(accessToken))
            {
                Debug.WriteLine("No access token available for delete");
                return;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.DeleteAsync($"api/user/delete?userId={user.Id}");
            if (response.IsSuccessStatusCode)
            {
                Users.Remove(user);
                ShowSuccessMessage("Success", "User deleted successfully!");
            }
            else
            {
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error deleting user: {errorContent}");
                ShowErrorMessage("Deletion Failed", "Failed to delete the user. Please try again.");
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error deleting user: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while deleting the user: {ex.Message}");
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

public class UserModel
{
    public string Id { get; set; } = string.Empty;

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string Role { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.Now;

    public string Usage { get; set; } = string.Empty;

    public string SubscriptionPlan { get; set; } = string.Empty;
}