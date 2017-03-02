/**
 * Created by anderson.santos on 24/02/2017.
 */
//todo refatorar e unificar este módulo com o Bitbucket

var jiraClientServicesHelper = {
    buildApiUrl:function(data,url){

        if(data){
            var keys = url.match(/\{[a-zA-Z]+}/g);
            if(keys){
                keys.forEach(function(key){
                    url = url.replace(key,data[key.replace(/\{|}/g,"")]);
                });
                return url
            }
            else{
                return url;
            }
        }
        else{
            return url;
        }
    },
    getJiraData: function(apiUrl,bodyData,connectionData,success,fail){
        var options = {
            host: connectionData.host,
            port: connectionData.port,
            path: apiUrl,
            headers:{
                "Authorization": "Basic " + new Buffer(connectionData.userName +":" + connectionData.password).toString('base64')
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
                    success(JSON.parse(data));
                }
                catch(ex){
                    console.log(data);
                    fail(data,ex);
                }

            });
        }).on("error", function(e){
            fail(e);
        });
    },
    postJiraData:function(apiUrl,data,connectionData,success,fail){
        var api = apiUrl;
        var body = JSON.stringify(data||{});
        var options = {
            host: connectionData.host,
            port:  connectionData.port,
            path: api,
            method:"POST",
            headers:{
                "X-Atlassian-Token":" no-check",
                "content-type": "application/json",
                "Content-Length": Buffer.byteLength(body),
                'Accept': 'application/json',
                "Authorization": "Basic " + new Buffer(connectionData.userName +":" + connectionData.password).toString('base64')
            }
        };
        var post_req = require(connectionData.protocol).request(options, function(resp){
            var data = '';
            resp.on('data', function(chunk){
                data = data + chunk.toString();
            });
            resp.on("end", function(){
                try{
                    success(JSON.parse(data));
                }
                catch(ex){
                    console.log(ex,data);
                }
            });
            resp.on("error", function(e){
                fail(e);
            })
        });
        post_req.end(body);
    }
};
module.exports = {

    get:function (url,params,data, connectionData ,success, fail) {
        jiraClientServicesHelper.getJiraData(jiraClientServicesHelper.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    post:function(url,params,data, connectionData ,success, fail){
        jiraClientServicesHelper.postJiraData(jiraClientServicesHelper.buildApiUrl(params,url),data,connectionData,success,fail);
    }
};