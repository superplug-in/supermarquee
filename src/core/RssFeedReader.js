const RssFeedReader =
{
    getFeed : function getFeed( url )
    {
        let xmlHttp = new XMLHttpRequest();
        try
        {
            xmlHttp.open( "GET", url, false ); // in sync mode
            xmlHttp.send( null );
        }
        catch (e )
        {
            console.error( e );
            xmlHttp = null;
        }
        return xmlHttp ? xmlHttp.responseXML : null;
    },

    getFeedItemData : function( url )
    {
        const feedXml = this.getFeed( url ),
              items = feedXml ? feedXml.getElementsByTagName( 'item' ) : null,
              feedData = [];

        if ( items && items.length > 0 )
        {
            for ( let i = 0; i < items.length; i++ )
            {
                feedData.push(
                    {
                        "title" : 0 < items[ i ].getElementsByTagName( 'title' ).length ? items[ i ].getElementsByTagName( 'title' )[ 0 ].innerHTML : null,
                        "link" : 0 < items[ i ].getElementsByTagName( 'link' ).length ? items[ i ].getElementsByTagName( 'link' )[ 0 ].innerHTML : null,
                        "pubDate" : 0 < items[ i ].getElementsByTagName( 'pubDate' ).length ? new Date( items[ i ].getElementsByTagName( 'pubDate' )[ 0 ].innerHTML ) : null,
                        "description" : 0 < items[ i ].getElementsByTagName( 'description' ).length && items[ i ].getElementsByTagName( 'description' )[ 0 ].firstChild ? items[ i ].getElementsByTagName( 'description' )[ 0 ].firstChild.wholeText.trim() : null,
                        "content" : 0 < items[ i ].getElementsByTagName( 'content' ).length ? items[ i ].getElementsByTagName( 'content' )[ 0 ].innerHTML : null
                    }
                )
            }
        }

        return feedData;
    },

    getScrollContentOfFeed : function( url, spacer = '&nbsp;' )
    {
        const feedXml = this.getFeed( url ),
              items = feedXml ? feedXml.getElementsByTagName( 'item' ) : null;

        let feedContent = '';

        if ( items && items.length > 0 )
        {
            for ( let i = 0; i < items.length; i++ )
            {
                feedContent += '<a href="' + items[ i ].getElementsByTagName( 'link' )[ 0 ].innerHTML + '" target="_blank">';
                feedContent += items[ i ].getElementsByTagName( 'title' )[ 0 ].innerHTML + '</a>';
                feedContent += spacer;
            }
        }

        return feedContent;
    }
};

export { RssFeedReader };
