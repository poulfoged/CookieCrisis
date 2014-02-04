using System;
using System.Web;
using CookieCrisis.Services;
using NUnit.Framework;

namespace CookieCrisisTests.Services
{
    [TestFixture]
    public class PrivacyLoaderTests
    {
        [Test]
        public void Can_load()
        {
            //Arrange
            var privacyLoader = new PrivacyLoader(new RequestMock());

            //Act
            var load = privacyLoader.Load();

            //Assert
            Assert.That(!String.IsNullOrWhiteSpace(load));
        }

        private class RequestMock : HttpRequestBase
        {
            public override Uri UrlReferrer
            {
                get { return new Uri(@"http://localhost:49284/default.htm"); }
            }
        }
    }

    

}
