//Use this area to create Bitbucket operations shortcuts
exports.register = function(instance){
    instance.registerOperation("getInboxPullRequests","/rest/api/1.0/inbox/pull-requests?limit={limit}&start={start}");
    instance.registerOperation("getPullRequestMergeCondition","/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge");
    instance.registerOperation("approvePullRequest","/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/approve", "post");
    instance.registerOperation("mergePullRequest","/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/pull-requests/{pullRequestId}/merge?version={version}", "post");
    instance.registerOperation("setBranchRestrictions","/rest/branch-permissions/2.0/projects/{projectKey}/repos/{repositorySlug}/restrictions", "post");
    instance.registerOperation("setDefaultPullRequestRules","/rest/api/1.0/projects/{projectKey}/repos/{repositorySlug}/settings/pull-requests", "post");
}

