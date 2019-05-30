/**
 * Created by anderson.santos on 28/04/2017.
 */
var extensions = require('./WebRequestHelpers.Extensions');
var impl = {
    resolveAuthMethod : function(connectionData){
        if(connectionData.oauthAccessToken && connectionData.oauthAccessTokenSecret) return "OAuth";
        if(connectionData.userName && connectionData.password) return "BasicAuthentication";
        return 'unknown';
    },
    getAtlassianData: function(apiUrl,connectionData,success,fail){
        return extensions[impl.resolveAuthMethod(connectionData) + 'GET'](apiUrl,connectionData,success,fail);
    },
    changeAtlassianData:function(method, apiUrl,data,connectionData,success,fail){
        return extensions[impl.resolveAuthMethod(connectionData) + 'CHANGE'](method,apiUrl,data,connectionData,success,fail);
    },
    postAtlassianData:function(apiUrl,data,connectionData,success,fail){
        impl.changeAtlassianData("POST",apiUrl,data,connectionData,success,fail);
    },
    putAtlassianData:function(apiUrl,data,connectionData,success,fail){
        impl.changeAtlassianData("PUT",apiUrl,data,connectionData,success,fail);
    },
    deleteAtlassianData:function(apiUrl,data,connectionData,success,fail){
        impl.changeAtlassianData("DELETE",apiUrl,data,connectionData,success,fail);
    }
};
module.exports = {
    getAtlassianData:impl.getAtlassianData,
    postAtlassianData:impl.postAtlassianData,
    putAtlassianData:impl.putAtlassianData,
    deleteAtlassianData:impl.deleteAtlassianData
};