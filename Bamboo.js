var request = require('./WebRequestHelpers');
module.exports = {
    getInterface:function(){
        return function(connection){
            return new (function(connection){
                connection.protocol = connection.protocol || 'http';
                connection.port = connection.port || '80';
                connection.options = connection.options || {};
                connection.options.allowNoJsonResponse = connection.options.allowNoJsonResponse || false;

                this.get = function(url,params, success, fail){
                    request.getAtlassianData(request.buildApiUrl(params,url),connection,success,fail);
                };

                this.post = function(url,params,data, success, fail){
                    request.postAtlassianData(request.buildApiUrl(params,url),data,connection,success,fail);
                };
                this.put = function(url,params,data, success, fail){
                    request.putAtlassianData(request.buildApiUrl(params,url),data,connection,success,fail);
                };

                this.delete = function(url,params,data, success, fail){
                    request.deleteAtlassianData(request.buildApiUrl(params,url),data,connection,success,fail);
                };

                this.getBuildInfo = function(planKey,buildNum,success,fail){
                    var url = "/rest/api/latest/result/*/*.json"
                    .replace("*",planKey)
                    .replace("*",stbuildNumart);
                    this.get(url,undefined,success,fail);
                };
                
            })(connection);
        }
    }
};