using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KudosCraft.Models
{
  
        public class User
        {
            public int Id { get; set; }
            public string Email { get; set; }
            public object Bio { get; set; }
            public string FirstName { get; set; }
            public string LastName { get; set; }
            public string SubscriptionPlan { get; set; }
            public string Role { get; set; }
            public bool IsInitialSetupCompleted { get; set; }
            public DateTime CreatedAt { get; set; }
            public DateTime UpdatedAt { get; set; }
        }

        public class TokenInfo
        {
            public string AccessToken { get; set; }
            public string RefreshToken { get; set; }
            public int AccessTokenExpiresIn { get; set; }
            public int RefreshTokenExpiresIn { get; set; }
            public DateTime AccessTokenExpiresAt { get; set; }
            public DateTime RefreshTokenExpiresAt { get; set; }
        }

        public class AuthState
        {
            public User User { get; set; }
            public TokenInfo TokenInfo { get; set; }
        }
    
}
