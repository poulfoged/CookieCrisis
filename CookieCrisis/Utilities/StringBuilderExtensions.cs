using System;
using System.IO;
using System.Text;
using System.Web;

namespace CookieCrisis.Utilities
{
    public static class StringBuilderExtensions
    {
        public static StringBuilder AddRelative(this StringBuilder builder, string relativePath)
        {
            if ( HttpContext.Current == null)
                throw new ApplicationException("Only works in web context");

            var path = HttpContext.Current.Server.MapPath(relativePath);
            var scriptFile = new FileInfo(path);

            string script;
            using (var fileStream = scriptFile.OpenRead())
            using (var reader = new StreamReader(fileStream))
                builder.Append(reader.ReadToEnd());
            
            return builder;
        }
    }
}