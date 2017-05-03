/**
 * Created by anderson.santos on 22/02/2017.
 */
var bb          = require('./Bitbucket');
var jira        = require('./Jira');
var confluence  = require('./Confluence');

module.exports = {
    bitbucket:  bb.getInterface(),
    jira:       jira.getInterface(),
    confluence: confluence.getInterface()
};
