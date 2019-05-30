//Use this area to create Bamboo operations shortcuts

exports.register = function(instance){
    instance.registerOperation("getBuildInfo","/rest/api/latest/result/{planKey}/{buildNum}.json","GET");
}