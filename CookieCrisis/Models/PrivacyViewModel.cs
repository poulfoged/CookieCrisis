using System.Collections.Generic;

namespace CookieCrisis.Models
{
    public class PrivacyScriptViewModel
    {
        public IEnumerable<PrivacySettingViewModel> Policies { get; set; }
        public string Script { get; set; }
        public IEnumerable<PrivacySettingViewModel> UserSettings { get; set; }
    }
}