using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KudosCraft.Interfaces
{
    public interface ITokenService
    {
        string? AccessToken { get; }
        void SetToken(string token);
        void ClearToken();
        bool HasToken();
    }
}
