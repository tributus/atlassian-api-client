//Use this area to create Bitbucket operations shortcuts
exports.register = function(instance){
    var fn = {
        createRemoteLink : function(issueKeyOrID,url,title,success,fail){
            var RequestBody = {object: {url:url,title:title}};
            instance.post("/rest/api/latest/issue/{issuekey}/remotelink",{issuekey:issueKeyOrID},RequestBody,success,fail);
        },
        linkIssues : function(linkTypeName,inwardIssueKey,outwardIssueKey,comment, success,fail){
            var LinkRequestBody = {
                type: {
                    name: linkTypeName
                },
                inward: {
                    key: inwardIssueKey
                },
                outwardIssue: {
                    key: outwardIssueKey
                }
            };
            if(comment){
                LinkRequestBody.comment = {body:comment};
            }
            instance.post("/rest/api/2/issueLink",null,LinkRequestBody,success,fail);
        },
        addIssueComment : function(issueIdOrKey,comment, success,fail){
            var requestBody = {"body": comment};
            instance.post("/rest/api/2/issue/{issueIdOrKey}/comment",{issueIdOrKey:issueIdOrKey},requestBody,success,fail);
        },
        changeIssueStatus : function(issueIdOrKey,transitionIDOrRequestBody,success,fail){
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
            instance.post("/rest/api/2/issue/{issueIdOrKey}/transitions?expand=transitions.fields",reqParams,requestBody,success,fail)
        },
        search : function(jql,success,fail){
            instance.get("/rest/api/2/search?jql={jql}",{jql:encodeURIComponent(jql)},success,fail);
        },
        changeAssignee : function(issueKey,userName,success,fail){
            var params = {issueKey:issueKey};
            var body={
                name:userName
            }
            instance.put("/rest/api/2/issue/{issueKey}/assignee",params,body,success,fail);
        },
        removeAssignee: function(issueKey,success,fail){
            fn.changeAssignee(issueKey,"-1",success,fail);
        },
        getReleaseContent : function(projectid,versionid,success,fail){
            var query = "project = * AND fixVersion = * ORDER BY priority DESC, key ASC".replace("*",projectid).replace("*",versionid);
            fn.search(query,success,fail);
        }
    }
    
    instance.registerOperation("getIssueByID","/rest/api/2/issue/{issueid}?expand={expand}&fields={fields}");
    instance.registerOperation("createIssue","/rest/api/2/issue/","post");
    instance.registerOperation("getIssueAvailableTransitions","/rest/api/latest/issue/{issueIdOrKey}?expand=transitions&fields=transitions");
    instance.registerOperation("getIssueStatus","/rest/api/2/issue/{issueKey}?fields=status");
    instance.registerOperation("advancedSearch","/rest/api/2/search","post");
    instance.registerOperation("createRemoteLink",fn.createRemoteLink);
    instance.registerOperation("linkIssues",fn.linkIssues);
    instance.registerOperation("addIssueComment",fn.addIssueComment);
    instance.registerOperation("changeIssueStatus",fn.changeIssueStatus);
    instance.registerOperation("search",fn.search);
    instance.registerOperation("changeAssignee",fn.changeAssignee);
    instance.registerOperation("removeAssignee",fn.removeAssignee);
    instance.registerOperation("getReleaseContent",fn.getReleaseContent);
}