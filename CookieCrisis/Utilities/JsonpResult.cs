using System;
using System.Web.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace CookieCrisis.Utilities
{
    public class JsonpResult : JsonResult
    {
        public override void ExecuteResult(ControllerContext context)
        {
            if (context == null)
                throw new ArgumentNullException("context");
            
            var response = context.HttpContext.Response;

            response.ContentType = !String.IsNullOrEmpty(ContentType) ? ContentType : "application/javascript";
            
            if (ContentEncoding != null)
                response.ContentEncoding = ContentEncoding;
            
            if (Data == null) 
                return;

            var settings = new JsonSerializerSettings
                               {
                                   ContractResolver = new CamelCasePropertyNamesContractResolver()
                               };

            response.Write(string.Format("{0}({1})", context.HttpContext.Request.Params["callback"], JsonConvert.SerializeObject(Data, settings)));
        }
    }
}