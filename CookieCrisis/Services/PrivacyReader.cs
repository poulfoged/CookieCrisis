using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace CookieCrisis.Services
{
    public class PrivacyReader : StringReader
    {
        public PrivacyReader(string source) : base(source) { }

        public IDictionary<string, bool> ReadAll()
        {
            return ReadPrivacy().ToDictionary(d => d.Key, f => f.Value);
        }

        private IEnumerable<KeyValuePair<string, bool>> ReadPrivacy()
        {
            while (Peek() != -1)
            {
                var line = ReadLine();

                var parts = line.Split(':');

                if (parts.Length != 2)
                    continue;


                var selector = parts[1].Trim();
                if (selector == "yes")
                    yield return new KeyValuePair<string, bool>(parts[0].Trim(), true);
                else
                    yield return new KeyValuePair<string, bool>(parts[0].Trim(), false);
            }
        }
    }
}