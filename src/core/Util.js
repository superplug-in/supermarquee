const Util = {
    forceNbspInHtml : function( htmlString )
    {
        var searchWord = ' ';
        var regEx = new RegExp("(" + searchWord + ")(?!([^<]+)?>)", "gi");
        var output = htmlString.replace(regEx, "&nbsp;");
        return output;
    }
};

export { Util };
