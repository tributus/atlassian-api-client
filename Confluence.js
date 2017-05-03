/**
 * Created by anderson.santos on 28/04/2017.
 */
var request = require('./WebRequestHelpers');
module.exports = {
    get:function (url,params,data, connectionData ,success, fail) {
        request.getAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    // post:function(url,params,data, connectionData ,success, fail){
    //     request.postAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    // },
    put:function(url,params,data, connectionData ,success, fail){
        request.putAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    delete:function(url,params,data, connectionData ,success, fail){
        request.deleteAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    getInterface:function($this){
        return function(connection){
            return new (function(connection){
                connection.protocol = connection.protocol || 'http';
                connection.port = connection.port || '80';
                connection.options = connection.options || {};

                this.get = function(url,params,data, success, fail){
                    $this.get(url,params,data,connection,success,fail);
                };

                this.post = function(url,params,data, success, fail){
                    request.postAtlassianData(request.buildApiUrl(params,url),data,connection,success,fail);
                    //$this.postAtlassianData(url,params,data,connection,success,fail);
                };
                this.put = function(url,params,data, success, fail){
                    $this.put(url,params,data,connection,success,fail);
                };

                this.delete = function(url,params,data, success, fail){
                    $this.delete(url,params,data,connection,success,fail);
                };

                this.getContentById = function(itemid,expand,success,fail){
                    var params ={
                        itemid:itemid,
                        expand:expand || ""
                    };
                    $this.get("/rest/api/content/{itemid}?expand={expand}",params,undefined,connection,success,fail);
                };

                this.postContent = function(requestbody,success,fail){
                    this.post("/rest/api/content",undefined,requestbody,connection,success,fail);
                };
                this.updatePageById = function(pageid,requestbody,success,fail){
                    $this.put("/rest/api/content/{pageid}",{pageid:pageid},requestbody,connection,success,fail);
                };
            })(connection);
            //return this;
        }
    }

};