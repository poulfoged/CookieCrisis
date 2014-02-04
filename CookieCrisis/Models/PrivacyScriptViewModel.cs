using System;
using System.Collections.Generic;

namespace CookieCrisis.Models
{
    public class PrivacytViewModel
    {
        public IEnumerable<PrivacySettingViewModel> Policies { get; set; }
        public IEnumerable<PrivacySettingViewModel> UserSettings { get; set; }
        public IEnumerable<string> BaseSettings { get; set; }
        public Uri Site { get; set; }
    }
}