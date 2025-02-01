﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KudosCraft.ResponseTypes
{
    public class LoginResponse
    {
        public bool Success { get; set; }
        public string Token { get; set; } = string.Empty;
        public string? Error { get; set; }
    }
}
