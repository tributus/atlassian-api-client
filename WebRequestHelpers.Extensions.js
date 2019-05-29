var OAuth = require('oauth').OAuth;

//consts
var OAUTH_DEFAULT_VERSION           = "1.0";
var OAUTH_DEFAULT_SIGNATURE_METHOD  = "RSA-SHA1";
var OAUTH_DEFAULT_GET_CONTENT_TYPE  = "application/json";


var getOauthConnector = function(connectionData){
    var consumer = new OAuth(connectionData.OAuthParams.requestURL,
        connectionData.OAuthParams.accessUrl,
        connectionData.OAuthParams.consumerKey,
        connectionData.OAuthParams.privateKeyData,
        connectionData.OAuthParams.version || OAUTH_DEFAULT_VERSION,
        connectionData.OAuthParams.authorizeCallBackURL,
        connectionData.OAuthParams.signatureMethod || OAUTH_DEFAULT_SIGNATURE_METHOD
    );

    //the original "get" method was overriden here because in it's implementation
    //it calls "_performSecureRequest" with a null value for "post_content_type"
    //argument. When this argument is null, the value "application/x-www-form-urlencoded"
    //is assumed. This behavior causes a 415 error when calling Jira APIS even when 
    //content-type header is "application/json";
    //This behavior was detected since v. 0.9.15 of oauth module
    consumer.get = function(url,accessToken,acessTokenSecret,contentType,callback){
        consumer._performSecureRequest(accessToken,acessTokenSecret,"GET",url,null,null,contentType||OAUTH_DEFAULT_GET_CONTENT_TYPE,callback);
    }

    return consumer; 
}

//module interface
exports.unknownGET = function(apiUrl,connectionData,success,fail){
    return fail({connection:connectionData}, new Error("UNKOWN authentication method"));
}

exports.unknownCHANGE = function(method, apiUrl,data,connectionData,success,fail){
    return fail({connection:connectionData}, new Error("UNKOWN authentication method"));
}

exports.BasicAuthenticationGET = function(apiUrl,connectionData,success,fail){
    var options = {
        host: connectionData.host,
        port: connectionData.port,
        path: apiUrl,
        headers:{
            "Authorization": "Basic " + Buffer.from(connectionData.userName +":" + connectionData.password).toString('base64')
        }
    };
    var protocol = require(connectionData.protocol);
    protocol.get(options, function(resp){
        var data = '';
        resp.on('data', function(chunk){
            data = data + chunk.toString();
        });
        resp.on("end", function(){
            try{
                var objData = JSON.parse(data);
                return success(objData);
            }
            catch(ex){
                if(connectionData.options.allowNoJsonResponse){
                    return success(data,ex);
                }
                else{
                    return fail({
                        status: "error",
                        rawErrorData:data
                    },ex);
                }
            }

        });
    }).on("error", function(e){
        return fail(e);
    });
}

exports.BasicAuthenticationCHANGE = function(method, apiUrl,data,connectionData,success,fail){
    method = method || "POST";
    var api = apiUrl;
    var body = JSON.stringify(data||{});
    var options = {
        host: connectionData.host,
        port:  connectionData.port,
        path: api,
        method:method,
        headers:{
            "X-Atlassian-Token":" no-check",
            "content-type": "application/json",
            "Content-Length": Buffer.byteLength(body),
            'Accept': 'application/json',
            "Authorization": "Basic " + Buffer.from(connectionData.userName +":" + connectionData.password).toString('base64')
        }
    };
    var post_req = require(connectionData.protocol).request(options, function(resp){
        var data = '';
        resp.on('data', function(chunk){
            data = data + chunk.toString();
        });
        resp.on("end", function(){
            try{
                if(data){
                    var jsonData = JSON.parse(data);
                    return success(jsonData);
                }
                else{
                    return success({status:"success", tag:"void-response"});
                }
            }
            catch(ex){
                if(connectionData.options.allowNoJsonResponse){
                    success(data,ex);
                }
                else{
                    return fail({
                        status: "error",
                        rawErrorData:data
                    },ex);
                }
            }
        });
        resp.on("error", function(e){
            return fail(e);
        })
    });
    post_req.end(body);
}

exports.OAuthGET = function(apiUrl,connectionData,success,fail){
    var consumer = getOauthConnector(connectionData);
    var fullUrl = connectionData.host + apiUrl;
    
    consumer.get(fullUrl,connectionData.oauthAccessToken,connectionData.oauthAccessTokenSecret,"application/json",
        function(error,data){
            if(error) return fail(error);
            try{
                if(data){
                    var jsonData = JSON.parse(data);
                    return success(jsonData);
                }
                else{
                    return success({status:"success", tag:"void-response"});
                }
            }
            catch(ex){
                if(connectionData.options.allowNoJsonResponse){
                    success(data,ex);
                }
                else{
                    return fail({
                        status: "error",
                        rawErrorData:data
                    },ex);
                }
            }
        }
    );
}

exports.OAuthCHANGE = function(method, apiUrl,data,connectionData,success,fail){
    var consumer = getOauthConnector(connectionData);
    var fullUrl = connectionData.host + apiUrl;
    
    method = method || "POST";
    var body = JSON.stringify(data||{});
    consumer._performSecureRequest(connectionData.oauthAccessToken,connectionData.oauthAccessTokenSecret,method,fullUrl,null,body,OAUTH_DEFAULT_GET_CONTENT_TYPE,
        function(error,data){
            if(error) return fail(error);
            try{
                if(data){
                    var jsonData = JSON.parse(data);
                    return success(jsonData);
                }
                else{
                    return success({status:"success", tag:"void-response"});
                }
            }
            catch(ex){
                if(connectionData.options.allowNoJsonResponse){
                    success(data,ex);
                }
                else{
                    return fail({
                        status: "error",
                        rawErrorData:data
                    },ex);
                }
            }
        }
    );
}