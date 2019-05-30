var fnBodyTemplates = {
    "change":`
    var requestParams = {
        @REQ_PARAMS
    };
    this.@METHOD("@APIURL",requestParams,requestBody,success,fail)
    `,
    "get": `
    var requestParams = {
        @REQ_PARAMS
    };
    this.get("@APIURL",requestParams,success,fail)
    `
}

exports.createFn = function(instance,name, apiUrl,method){
    method = method || "get";
    var methodclass = method.toLowerCase() === "get" ? "get":"change";
    var keys = (apiUrl.match(/\{[a-zA-Z]+}/g) || []).map(function(k){return k.replace(/\{(.+)\}/g,"$1")});
    
    //fn body
    var body = fnBodyTemplates[methodclass]
    .replace(/@REQ_PARAMS/g,keys.map(function(k){return `${k}:${k}`}).join(','))
    .replace(/@APIURL/g,apiUrl)
    .replace(/@METHOD/g,method);
    if(method.toLowerCase() !== "get"){
        keys.push("requestBody");
    }
    keys = keys.concat(["success","fail"])
    instance[name] = new Function(keys,body);
};

exports.prepareUrl = function(data,url){
    if(data){
        var keys = url.match(/\{[a-zA-Z]+}/g);
        if(keys){
            keys.forEach(function(key){
                url = url.replace(key,data[key.replace(/\{|}/g,"")]);
            });
            return url
        }
        else{
            return url;
        }
    }
    else{
        return url;
    }
}