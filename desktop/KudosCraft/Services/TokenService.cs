using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KudosCraft.Services
{
    public class TokenService
    {

        private string? _accessToken;

        public string? AccessToken => _accessToken;

        public void SetToken(string token)
        {
            _accessToken = token;
        }

        public void ClearToken()
        {
            _accessToken = null;
        }

        public bool HasToken()
        {
            return !string.IsNullOrEmpty(_accessToken);
        }

    }
}
