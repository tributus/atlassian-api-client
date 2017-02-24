/**
 * Created by anderson.santos on 24/02/2017.
 */
var bitbucket = require('./index').bitbucket({
    host:'bitbucket.yourserver.com.br',
    userName:'yourUserName',
    password:'yourPassword'
});
var jira = require('./index').jira({
    host:'jira.yourserver.com.br',
    userName:'yourUserName',
    password:'yourUserName'
});

var writeResult = function(r){
    console.log(r);
};

var writeError = function(err){
    console.error(err);
};

var start = function(){
    jira.getIssueByID('10461',writeResult,writeError);
    bitbucket.getInboxPullRequests(writeResult,writeError);
    bitbucket.getPullRequestMergeCondition({projectKey:"PRJK",repositorySlug:"REPO",pullRequestId:"28"},writeResult,writeError);
};

start();