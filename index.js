/**
 * Created by anderson.santos on 22/02/2017.
 */
var bb          = require('./Bitbucket');
var jira        = require('./Jira');
var confluence  = require('./Confluence');
var bamboo      = require('./Bamboo');

module.exports = {
    bitbucket:  bb.getInterface(),
    jira:       jira.getInterface(),
    confluence: confluence.getInterface(),
    bamboo: bamboo.getInterface()
};
