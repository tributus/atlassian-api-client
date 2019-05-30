/**
 * Created by anderson.santos on 24/02/2017.
 */
var request = require('./WebRequestHelpers');
var helpers = require('./genericHelpers');
var shortcuts = require('./OperationsShortcuts/Jira.Shortcuts');

module.exports = {
    getInterface:function(){
        return function(connection){
            return new (function(connection){
                connection.protocol = connection.protocol || 'http';
                connection.port = connection.port || '80';
                connection.options = connection.options || {};
                connection.options.allowNoJsonResponse = connection.options.allowNoJsonResponse || false;

                this.get = function(url,params,success,fail){
                    request.getAtlassianData(helpers.prepareUrl(params,url),connection,success,fail);
                };

                this.post = function(url,params,data, success, fail){
                    request.postAtlassianData(helpers.prepareUrl(params,url),data,connection,success,fail);
                };
                this.put = function(url,params,data, success, fail){
                    request.putAtlassianData(helpers.prepareUrl(params,url),data,connection,success,fail);
                };

                this.delete = function(url,params,data, success, fail){
                    request.deleteAtlassianData(helpers.prepareUrl(params,url),data,connection,success,fail);
                };

                this.registerOperation = function(name,apiUrl,method){
                    if(typeof apiUrl === "function"){
                        this[name] = apiUrl;
                    }
                    else{
                        helpers.createFn(this,name,apiUrl,method)
                    }
                };
                
                shortcuts.register(this);

            })(connection);
        }
    }
};