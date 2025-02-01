using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KudosCraft.ResponseTypes;

namespace KudosCraft.Interfaces
{
    public interface IApiService
    {
        Task<LoginResponse> LoginAsync(string email, string password);
        Task<DashboardResponse> GetDashboardDataAsync();
        Task<ApiResponse<T>> GetAsync<T>(string endpoint);
        Task<ApiResponse<T>> PostAsync<T>(string endpoint, object data);
        Task<ApiResponse<T>> PutAsync<T>(string endpoint, object data);
        Task<ApiResponse<bool>> DeleteAsync(string endpoint);
    }
}
