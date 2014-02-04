using System;
using System.Net.Http;
using System.Web;
using WebGrease.Css.Ast.Selectors;

namespace CookieCrisis.Services
{
    public class PrivacyLoader
    {
        private Uri url;

        public PrivacyLoader(HttpRequestBase source)
        {
            Uri baseUrl = null;
            if (HttpContext.Current != null)
            {
                var b = HttpContext.Current.Request["url"];
                Uri.TryCreate(b, UriKind.Absolute, out baseUrl);
            }

            baseUrl = source.UrlReferrer ?? baseUrl;

            if (baseUrl == null)
                return;

            url = new UriBuilder(baseUrl) {Path = "privacy.txt", Port = baseUrl.Port == 80 ? -1 : baseUrl.Port}.Uri;
        }

        public string Load()
        {
            if (url == null)
                return null;


            var client = new HttpClient();
            try
            {
                return client.GetStringAsync(url).Result;
            }
            catch (Exception)
            {
                return null;
            }

        }
    }
}