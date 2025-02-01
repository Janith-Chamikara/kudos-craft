using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KudosCraft.ResponseTypes
{
    public class DashboardResponse
    {
        public int TotalWorkspaces { get; set; }
        public int TotalTestimonials { get; set; }
        public double AverageRating { get; set; }
        public string MonthlyGrowth { get; set; } = string.Empty;
    }
}
