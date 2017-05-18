/**
 * Created by anderson.santos on 24/02/2017.
 */
var request = require('./WebRequestHelpers');
module.exports = {
    getInterface:function(){
        return function(connection){
            return new (function(connection){
                connection.protocol = connection.protocol || 'http';
                connection.port = connection.port || '80';
                connection.options = connection.options || {};
                connection.options.allowNoJsonResponse = connection.options.allowNoJsonResponse || false;

                this.get = function(url,params,data, success, fail){
                    request.getAtlassianData(request.buildApiUrl(params,url),data,connection,success,fail);
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
                this.getIssueByID = function(issueid,success,fail){
                    var params ={issueid:issueid};
                    this.get("/rest/api/2/issue/{issueid}",params,undefined,success,fail);

                };
                this.createIssue = function(issueData,success,fail){
                    this.post("/rest/api/2/issue/",undefined,issueData,success,fail);
                };

                this.linkIssues = function(linkTypeName,inwardIssueKey,outwardIssueKey,commentBody, success,fail){
                    var LinkRequestBody = {
                        type: {
                            name: linkTypeName
                        }    ,
                        inward: {
                            key: inwardIssueKey
                        },
                        outwardIssue: {
                            key: outwardIssueKey
                        }
                    };
                    if(commentBody){
                        LinkRequestBody.comment ={body:commentBody};
                    }
                    this.post("/rest/api/2/issueLink",undefined,LinkRequestBody,success,fail);
                };

                this.createRemoteLink = function(issueKeyOrID,url,title,success,fail){
                    var RequestBody = {object: {url:url,title:title}};
                    this.post("/rest/api/latest/issue/{issuekey}/remotelink",{issuekey:issueKeyOrID},RequestBody,success,fail);
                };

                this.addIssueComment = function(issueIdOrKey,comment, success,fail){
                    var requestBody = {"body": comment};
                    this.post("/rest/api/2/issue/{issueIdOrKey}/comment",{issueIdOrKey:issueIdOrKey},requestBody,success,fail);
                };
                this.changeIssueStatus = function(issueIdOrKey,transitionIDOrRequestBody,success,fail){
                    var reqParams = {
                        issueIdOrKey:issueIdOrKey
                    };
                    var requestBody = undefined;
                    if(typeof transitionIDOrRequestBody =="string"){
                        requestBody = {
                            "transition": {
                                "id": transitionIDOrRequestBody
                            }
                        }
                    }
                    else{
                        requestBody = transitionIDOrRequestBody
                    }
                    this.post("/rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields",reqParams,requestBody,success,fail)
                };
                this.getAllowedTransitions = function(issueIdOrKey,success,fail){
                    this.get("/rest/api/latest/issue/{issueIdOrKey}?expand=transitions&fields=transitions",{issueIdOrKey:issueIdOrKey},undefined,success,fail)
                };
                this.search = function(query,success,fail){
                    this.get("/rest/api/2/search?jql={jql}",{jql:query},undefined,success,fail);
                };
                this.advancedSearch = function(requestBody,success,fail){
                    this.post("/rest/api/2/search",undefined,requestBody,success,fail);
                };
                /**
                 * @param {string} issueKey
                 * @param {string} userName
                 * @param {function} success the request success delegate
                 * @param {function} fail the request fail delegate
                 * @description Changes the issue's assignee
                 */
                this.changeAssignee = function(issueKey,userName,success,fail){
                    var params = {issueKey:issueKey};
                    var body={
                        name:userName
                    }
                    this.put("/rest/api/2/issue/{issueKey}/assignee",params,body,success,fail);
                };
                 /**
                 * @param {string} issueKey
                 * @param {string} userName
                 * @param {function} success the request success delegate
                 * @param {function} fail the request fail delegate
                 * @description Clear the issue's assignee (this a shortland for changeAssignee(ISSUE-KEY,"-1"...) method)
                 */
                this.removeAssignee = function(issueKey,success,fail){
                    this.changeAssignee(issueKey,"-1",success,fail);
                }
            })(connection);
        }
    }
};