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
using System.Xml.Linq;

namespace KudosCraft.ViewModels;

public partial class TestimonialsViewModel : ViewModelBase
{
    private readonly HttpClient _httpClient;

    [ObservableProperty]
    private bool _isLoading = true;

    [ObservableProperty]
    private ObservableCollection<TestimonialModel> _testimonials = new();

    public TestimonialsViewModel()
    {
        _httpClient = new HttpClient
        {
            BaseAddress = new Uri("http://localhost:3001")
        };
        LoadDataAsync();
    }

    public TestimonialsViewModel(HttpClient httpClient)
    {
        _httpClient = httpClient;
        LoadDataAsync();
    }

    private async Task LoadDataAsync()
    {
        try
        {
            IsLoading = true;

            var accessToken = SessionService.Instance.AccessToken;
            Debug.WriteLine($"Access Token: {accessToken}");

            if (!string.IsNullOrEmpty(accessToken))
            {
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            }

            await Task.Delay(500);

            var testimonials = await _httpClient.GetFromJsonAsync<List<TestimonialModel>>("api/testimonial/admin/get-all");

            Debug.WriteLine($"Received testimonials: {testimonials?.Count ?? 0}");

            if (testimonials != null && testimonials.Count > 0)
            {
                Testimonials = new ObservableCollection<TestimonialModel>(testimonials);
                Debug.WriteLine($"Set Testimonials collection with {Testimonials.Count} items");

                foreach (var testimonial in Testimonials)
                {
                    Debug.WriteLine($"Testimonial: {testimonial.Id}, {testimonial.Title}, {testimonial.CreatedAt}");
                }
            }
            else
            {
                Debug.WriteLine("No testimonials received or empty list");
                Testimonials = new ObservableCollection<TestimonialModel>();
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error loading testimonials: {ex.Message}");
            Debug.WriteLine($"Stack trace: {ex.StackTrace}");

            if (ex.InnerException != null)
            {
                Debug.WriteLine($"Inner exception: {ex.InnerException.Message}");
            }

            Testimonials = new ObservableCollection<TestimonialModel>();
            ShowErrorMessage("Error Loading Data", $"Failed to load testimonials: {ex.Message}");
        }
        finally
        {
            IsLoading = false;
        }
    }

    private RelayCommand _addNewCommand;
    public ICommand AddNewCommand => _addNewCommand ??= new RelayCommand(AddNew);

    private RelayCommand<TestimonialModel> _editCommand;
    public ICommand EditCommand => _editCommand ??= new RelayCommand<TestimonialModel>(Edit);

    private RelayCommand<TestimonialModel> _deleteCommand;
    public ICommand DeleteCommand => _deleteCommand ??= new RelayCommand<TestimonialModel>(Delete);

    private async void AddNew()
    {
        try
        {
            Window mainWindow = GetMainWindow();
            if (mainWindow == null) return;

            var addWindow = new AddTestimonialWindow(mainWindow);
            await addWindow.ShowDialog(mainWindow);

            if (addWindow.DataContext is AddTestimonialViewModel viewModel && viewModel.HasChanges)
            {
                var newTestimonial = viewModel.CreatedTestimonial;
                bool success = await CreateTestimonialAsync(newTestimonial);

                if (success)
                {
                    ShowSuccessMessage("Success", "Testimonial created successfully!");
                    await LoadDataAsync();
                }
                else
                {
                    ShowErrorMessage("Creation Failed", "Failed to create the testimonial. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error adding testimonial: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while adding the testimonial: {ex.Message}");
        }
    }

    private async void Edit(TestimonialModel testimonial)
    {
        if (testimonial == null) return;

        try
        {
            Window mainWindow = GetMainWindow();

            var editWindow = new EditTestimonialWindow(testimonial);

            if (mainWindow != null)
            {
                await editWindow.ShowDialog(mainWindow);
            }
            else
            {
                editWindow.Show();
            }

            if (editWindow.DataContext is EditTestimonialViewModel viewModel && viewModel.HasChanges)
            {
                bool success = await UpdateTestimonialAsync(testimonial);

                if (success)
                {
                    ShowSuccessMessage("Success", "Testimonial updated successfully!");
                    await LoadDataAsync();
                }
                else
                {
                    ShowErrorMessage("Update Failed", "Failed to update the testimonial. Please try again.");
                }
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error editing testimonial: {ex.Message}");
            ShowErrorMessage("Error", $"An error occurred while editing the testimonial: {ex.Message}");
        }
    }

    private async Task<bool> UpdateTestimonialAsync(TestimonialModel testimonial)
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
                name = testimonial.Name,
                review = testimonial.Review,
                ratings = testimonial.Ratings
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PutAsync($"api/testimonial/update?testimonialId={testimonial.Id}", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine($"Testimonial updated successfully: {testimonial.Id}");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to update testimonial. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error updating testimonial: {ex.Message}");
            return false;
        }
    }

    private async Task<bool> CreateTestimonialAsync(TestimonialModel testimonial)
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
                email = testimonial.Email,
                name = testimonial.Name,
                review = testimonial.Review,
                ratings = testimonial.Ratings,
                workspaceId = testimonial.WorkspaceId,
            };

            var content = new StringContent(
                JsonSerializer.Serialize(requiredData),
                Encoding.UTF8,
                "application/json");

            var response = await _httpClient.PostAsync("api/testimonial/create", content);

            if (response.IsSuccessStatusCode)
            {
                Debug.WriteLine("Testimonial created successfully");
                return true;
            }
            else
            {
                Debug.WriteLine($"Failed to create testimonial. Status: {response.StatusCode}");
                var errorContent = await response.Content.ReadAsStringAsync();
                Debug.WriteLine($"Error content: {errorContent}");
                return false;
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error creating testimonial: {ex.Message}");
            return false;
        }
    }

    private async void Delete(TestimonialModel testimonial)
    {
        try
        {
            var accessToken = SessionService.Instance.AccessToken;
            if (string.IsNullOrEmpty(accessToken))
            {
                ShowErrorMessage("Error", "No access token available");
                return;
            }

            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

            var response = await _httpClient.DeleteAsync($"api/testimonial/delete?testimonialId={testimonial.Id}");

            if (response.IsSuccessStatusCode)
            {
                ShowSuccessMessage("Success", "Testimonial deleted successfully!");
                await LoadDataAsync();
            }
            else
            {
                ShowErrorMessage("Delete Failed", "Failed to delete the testimonial. Please try again.");
            }
        }
        catch (Exception ex)
        {
            Debug.WriteLine($"Error deleting testimonial: {ex.Message}");
            ShowErrorMessage("Error",$"An error occurred while deleting the testimonial: {ex.Message}");
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

public class TestimonialModel
{
    public string Id { get; set; } = string.Empty;
    public string Title { get; set; } = string.Empty;
    public string Email { get; set;} = string.Empty;

    public string Name { get;set; } = string.Empty;
    public string Review { get; set; } = string.Empty;
    public float Ratings { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public DateTime UpdatedAt { get; set; } = DateTime.Now;
    public string UserId { get; set; } = string.Empty;

    public string WorkspaceId { get; set;} = string.Empty;
}