using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using CookieCrisis.Models;
using CookieCrisis.Services;
using CookieCrisis.Utilities;
using Newtonsoft.Json;

namespace CookieCrisis.Controllers
{
    public class PrivacyController : Controller
    {
        private IEnumerable<string> expectedPrivacies = new List<string>
                                                        {
                                                            "share info with third party",
                                                            "track for statistical",
                                                            "track for advertisement"
                                                        }; 

        public ActionResult Index()
        {
            var script = new StringBuilder()
                .AddRelative("~/scripts/privacyController.js");

            Response.ContentType = "text/javascript";

            IDictionary<string, bool> result = new Dictionary<string, bool>();
            var loader = new PrivacyLoader(Request);
            var source = loader.Load();

            if (!string.IsNullOrWhiteSpace(source))
                using (var reader = new PrivacyReader(source))
                    result = reader.ReadAll();

            var policies = expectedPrivacies.Select(e =>
                                                    new PrivacySettingViewModel
                                                    {
                                                        Name = e,
                                                        Setting = result.ContainsKey(e) ? result[e] : (bool?)null
                                                    });


            var userPolicies = GetSettings().Select(e =>
                                                   new PrivacySettingViewModel
                                                   {
                                                       Name = e.Key,
                                                       Setting = e.Value
                                                   });


            return View(new PrivacyScriptViewModel { Policies = policies, Script = script.ToString(), UserSettings = userPolicies });
        }

        public ActionResult SiteInfo(Uri url)
        {

            if (url == null)
                return HttpNotFound();

            IDictionary<string, bool> result;
            var loader = new PrivacyLoader(Request);
            var source = loader.Load();

            if (string.IsNullOrWhiteSpace(source))
            {
                result = new Dictionary<string, bool>();
            }
            else
            {
                using (var reader = new PrivacyReader(source))
                    result = reader.ReadAll();
            }
            

            var policies = expectedPrivacies.Select(e =>
                                                    new PrivacySettingViewModel
                                                    {
                                                        Name = e,
                                                        Setting = result.ContainsKey(e) ? result[e] : (bool?)null
                                                    });


            var userPolicies = GetSettings().Select(e =>
                                                   new PrivacySettingViewModel
                                                   {
                                                       Name = e.Key,
                                                       Setting = e.Value
                                                   });

            return View(new PrivacytViewModel {Policies = policies, UserSettings = userPolicies, BaseSettings = expectedPrivacies, Site = url});
        }

        public ActionResult Setting(string name, bool setting)
        {
            Dictionary<string, bool> settings;

            settings = GetSettings();

            if (settings.ContainsKey(name))
                settings[name] = setting;
            else
                settings.Add(name, setting);

            var serialized = JsonConvert.SerializeObject(settings);
            Response.Cookies.Add(new HttpCookie("settings", HttpUtility.UrlEncode(serialized)));

            
            return new JsonpResult{ Data = true };
        }

        private Dictionary<string, bool> GetSettings()
        {
            Dictionary<string, bool> settings;
            var source = Request.Cookies["settings"];

            if (source != null && !string.IsNullOrWhiteSpace(source.Value))
            {
                settings = JsonConvert.DeserializeObject<Dictionary<string, bool>>(HttpUtility.UrlDecode(source.Value));
            }
            else
            {
                settings = new Dictionary<string, bool>();
            }
            return settings;
        }
    }
}