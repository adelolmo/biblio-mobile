var http = {
    getHeader: function(headers, name){
        var arrayOfLines = headers.match(/[^\r\n]+/g);
        for(var i = 0; i < arrayOfLines.length; i++){
            if(arrayOfLines[i].indexOf(name) == 0){
                return arrayOfLines[i].substr(name.length + 2).trim();
            }
        }
    }
};