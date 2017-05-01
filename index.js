/**
 * Created by anderson.santos on 22/02/2017.
 */
var bb          = require('./Bitbucket');
var jira        = require('./Jira');
var confluence  = require('./Confluence');

module.exports = {
    bitbucket:  bb.getInterface(bb),
    jira:       jira.getInterface(jira),
    confluence: confluence.getInterface(confluence)
};
