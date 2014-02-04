using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Text;
using CookieCrisis.Services;
using NUnit.Framework;

namespace CookieCrisisTests.Services
{
    [TestFixture]
    public class PrivacyParserTests
    {
        [Test]
        public void Can_parse()
        {
            //Arrange
            var privacy = @"
                share info with third party: no
                track for statistical: yes
                track for advertisement: no";


            IDictionary<string, bool> result;
            
            
            //Act
            using (var reader = new PrivacyReader(privacy))
                result = reader.ReadAll();
            

            //Assert
            Assert.That(result["track for statistical"]);
        }
    }
}
