/**
 * Created by anderson.santos on 22/02/2017.
 */
var bb      = require('./Bitbucket');
var jira    = require('./Jira');

module.exports = {
    bitbucket:function(connection){
        connection.protocol = connection.protocol || 'http';
        connection.port = connection.port || '80';

        this.get = function(url,params,data, success, fail){
            bb.get(url,params,data,connection,success,fail);
        };

        this.post = function(url,params,data, success, fail){
            bb.post(url,params,data,connection,success,fail);
        };

        this.getInboxPullRequests = function(success,fail){
            bb.get("/rest/api/1.0/inbox/pull-requests?limit=25",undefined,undefined,connection,success,fail);
        };

        this.getPullRequestMergeCondition = function(projectKey,repositorySlug,pullRequestId,success,fail){
            var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId};
            bb.get("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge",params,undefined,connection,success,fail);
        };

        this.approvePullRequest = function(projectKey,repositorySlug,pullRequestId,success,fail){
            var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId};
            bb.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve",params,undefined,connection,success,fail);
        };
        this.mergePullRequest = function(projectKey,repositorySlug,pullRequestId,version,success,fail){
            var params = {projectKey:projectKey,repositorySlug:repositorySlug,pullRequestId:pullRequestId,version:version};
            bb.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge?version={version}",params,{close_source_branch:true},connection,success,fail);
        };

        this.setBranchRestrictions = function(projectKey,repositorySlug,restrictions,success,fail){
            var params={projectKey:projectKey,repositorySlug:repositorySlug};
            bb.post("/rest/branch-permissions/2.0/projects/{projectKey}/repos/{repositorySlug}/restrictions",params,restrictions,connection,success,fail);
        };
        this.setDefaultPullRequestRules = function(projectKey,repositorySlug,params,rules,success,fail){
            var params={projectKey:projectKey,repositorySlug:repositorySlug};
            bb.post("/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests",params,rules,connection,success,fail);
        };

        return this;
    },
    jira:function(connection){
        connection.protocol = connection.protocol || 'http';
        connection.port = connection.port || '80';

        this.get = function(url,params,data, success, fail){
            jira.get(url,params,data,connection,success,fail);
        };

        this.post = function(url,params,data, success, fail){
            jira.post(url,params,data,connection,success,fail);
        };
        this.getIssueByID = function(issueid,success,fail){
            var params ={issueid:issueid};
            jira.get("/rest/api/2/issue/{issueid}",params,undefined,connection,success,fail);

        };
        
        return this;
    }
};
