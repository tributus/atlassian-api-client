/**
 * Created by anderson.santos on 22/02/2017.
 */
var request = require('./WebRequestHelpers');
module.exports = {
    
    get:function (url,params,data, connectionData ,success, fail) {
        request.getAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    post:function(url,params,data, connectionData ,success, fail){
        request.postAtlassianData(request.buildApiUrl(params,url),data,connectionData,success,fail);
    },
    getInterface:function($this){
        return function(connection){
            connection.protocol = connection.protocol || 'http';
            connection.port = connection.port || '80';
            connection.options = connection.options || {};
            connection.options.allowNoJsonResponse = connection.options.allowNoJsonResponse || false;

            this.get = function(url,params,data, success, fail){
                $this.get(url,params,data,connection,success,fail);
            };

            this.post = function(url,params,data, success, fail){
                $this.post(url,params,data,connection,success,fail);
            };

            this.getInboxPullRequests = function(success,fail){
                $this.get("/rest/api/1.0/inbox/pull-requests?limit=25",undefined,undefined,connection,success,fail);
            };

            this.getPullRequestMergeCondition = function(projectKey,repositorySlug,pullRequestId,success,fail){
                var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId};
                $this.get("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge",params,undefined,connection,success,fail);
            };

            this.approvePullRequest = function(projectKey,repositorySlug,pullRequestId,success,fail){
                var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId};
                $this.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve",params,undefined,connection,success,fail);
            };
            this.mergePullRequest = function(projectKey,repositorySlug,pullRequestId,version,success,fail){
                var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId,version:version};
                $this.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge?version={version}",params,{close_source_branch:true},connection,success,fail);
            };

            this.setBranchRestrictions = function(projectKey,repositorySlug,restrictions,success,fail){
                var params={projectKey:projectKey,repositorySlug:repositorySlug};
                $this.post("/rest/branch-permissions/2.0/projects/{projectKey}/repos/{repositorySlug}/restrictions",params,restrictions,connection,success,fail);
            };
            this.setDefaultPullRequestRules = function(projectKey,repositorySlug,params,rules,success,fail){
                var params={projectKey:projectKey,repositorySlug:repositorySlug};
                $this.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests",params,rules,connection,success,fail);
            };

            return this;
        }
    }
};