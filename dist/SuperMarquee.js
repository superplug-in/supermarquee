(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = global || self, global.SuperMarquee = factory());
}(this, (function () { 'use strict';

	const templateHorizontal = document.createElement( 'template' );
	const templateVertical = document.createElement( 'template' );

	templateHorizontal.innerHTML = `
    <style>
        .supermarquee-container
        {
            width: 100%;
            display: block;
            pointer-events: all;
            overflow: hidden;
            visibility: hidden;
        }

        .supermarquee-perspective
        {
        }
                
        .supermarquee-outer-wrapper
        {
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            overflow: hidden;
            box-sizing: content-box;
        }
        
        .supermarquee-outer-wrapper .supermarquee-inner-container
        {
            display: flex;
            flex: 0 0 auto;
            white-space: nowrap;
            height: inherit;
        }
        
        .supermarquee-inner-container .supermarquee-item
        {
            display: flex;
            flex: 0 0 auto;
        }
        
        .supermarquee-inner-container .supermarquee-item-clone
        {
            display: flex;
            flex: 0 0 auto;
        }        
    </style>
    
    <div class="supermarquee-container">
        <div class="supermarquee-perspective">
            <div class="supermarquee-outer-wrapper">
                <div class="supermarquee-inner-container">
                    <div class="supermarquee-item"></div>
                    <div class="supermarquee-item-clone"></div>
                </div>
            </div>
        </div>
    </div>
`;


	templateVertical.innerHTML = `
    <style>
        .supermarquee-container
        {
            width: 100%;
            display: block;
            pointer-events: all;
            height: inherit;
            overflow: hidden;
            visibility: hidden;
        }        
       .supermarquee-perspective
        {
        }        
        .supermarquee-outer-wrapper
        {
            transform-style: preserve-3d;
            -webkit-transform-style: preserve-3d;
            overflow: hidden;
            box-sizing: content-box;
            width: inherit;
            height: inherit;
        }
        .supermarquee-outer-wrapper .supermarquee-inner-container
        {
            display: inline-block;
            width: inherit;
            max-height: 100%;
            height: inherit;
        }
        
        .supermarquee-inner-container .supermarquee-item
        {        
            display: block;
        }
        
        .supermarquee-inner-container .supermarquee-item-clone
        {
            display: block;
        }        
    </style>
    
    <div class="supermarquee-container">
        <div class="supermarquee-perspective">        
            <div class="supermarquee-outer-wrapper">
                <div class="supermarquee-inner-container">
                    <div class="supermarquee-item"></div>
                    <div class="supermarquee-item-clone"></div>
                </div>
            </div>
        </div>
    </div>
`;

	const Util = {
	    forceNbspInHtml : function( htmlString )
	    {
	        var searchWord = ' ';
	        var regEx = new RegExp("(" + searchWord + ")(?!([^<]+)?>)", "gi");
	        var output = htmlString.replace(regEx, "&nbsp;");
	        return output;
	    }
	};

	function Configuration( cd = {} )
	{
	    // Helper flag for gapped mode
	    this._gappedScrollingEnabled = false;

	    this.easingValue = 0.025;
	    this._currentSpeed = 0;
	    this.setSpeed = function( speed )
	    {
	        if ( this.type === Configuration.TYPE_HORIZONTAL )
	        {
	            if ( -1 < Object.keys( Configuration.SPEED_HORIZONTAL ).indexOf( speed ) )
	            {
	                this.speed = +Configuration.SPEED_HORIZONTAL[ speed ];
	            }
	            else if ( +speed > 0 )
	            {
	                this.speed = +speed;
	            }
	            else
	            {
	                this.speed = +Configuration.SPEED_HORIZONTAL[ Configuration.DEFAULT.speed ];
	            }
	        }
	        else
	        {
	            if ( -1 < Object.keys( Configuration.SPEED_VERTICAL ).indexOf( speed ) )
	            {
	                this.speed = +Configuration.SPEED_VERTICAL[ speed ];
	            }
	            else if ( +speed > 0 )
	            {
	                this.speed = +speed;
	            }
	            else
	            {
	                this.speed = +Configuration.SPEED_VERTICAL[ Configuration.DEFAULT.speed ];
	            }
	        }
	    };

	    this.hasLicense = function()
	    {
	        return ( this.license !== null && this.license !== undefined );
	    };

	    this.getSpeedNoEasing = function()
	    {
	        return this.speed;
	    }.bind( this );

	    this.getSpeedWithEasing = function()
	    {
	        if ( 1 > this.easingValue )
	        {
	            this._currentSpeed = ( 1 - this.easingValue ) * this._currentSpeed + this.easingValue * this.speed;
	        }
	        return this._currentSpeed;

	    }.bind( this );

	    // Default
	    this.getSpeed = this.getSpeedNoEasing;

	    this.setContent = function( content )
	    {
	        if ( content && content.length > 0 )
	        {
	            this.content = content;
	        }
	        else
	        {
	            this.content = "SuperMarquee by SuperPlug.in !!!";
	        }

	        this.content = this.content.replaceAll( "> ", ">&nbsp;" );
	        this.content = this.content.replaceAll( " <", "&nbsp;<" );
	        if ( Configuration.MODE_PINGPONG === this.mode && Configuration.TYPE_HORIZONTAL === this.type )
	        {
	            this.content = this.spacer + this.content;
	        }
	        this.content += this.spacer;
	    };

	    this.setPerspective = function( perspectiveSettings = null )
	    {
	        const props = Object.keys( Configuration.PERSPECTIVE_DEFAULT );

	        let userSettings = {};
	        if ( perspectiveSettings )
	        {
	            try
	            {
	                userSettings = JSON.parse( perspectiveSettings );
	            }
	            catch( e )
	            {
	                userSettings = {};
	            }
	        }

	        for ( let pi = 0; pi < props.length; pi++ )
	        {
	            if ( userSettings.hasOwnProperty( props[ pi ] ) )
	            {
	                this.perspective[ props[ pi ] ] = userSettings[ props[ pi ] ];
	            }
	            else
	            {
	                this.perspective[ props[ pi ] ] = Configuration.PERSPECTIVE_DEFAULT[ props[ pi ] ];
	            }
	        }
	    };

	    this.setPosition = function( position )
	    {
	        if ( -1 < Configuration.POSITIONS.indexOf( position ) )
	        {
	            this.position = position;
	        }
	        else
	        {
	            this.position = Configuration.DEFAULT.position;
	        }
	    };

	    this.setPauseOnHover = function( pauseonhover )
	    {
	        if ( pauseonhover && ( 'true' === pauseonhover || '1' === pauseonhover || true === pauseonhover ) )
	        {
	            this.pauseonhover = true;
	        }
	        else
	        {
	            // Default
	            this.pauseonhover = false;
	        }
	    };

	    // Resolve system
	    let system = cd.hasOwnProperty( 'system' ) ? cd.system : null;
	    if ( -1 < Configuration.SYSTEMS.indexOf( system ) )
	    {
	        this.system = system;
	    }
	    else
	    {
	        this.system = Configuration.DEFAULT.system;
	    }

	    // Resolve license
	    let license = cd.hasOwnProperty( 'license' ) ? cd.license : null;
	    this.license = null;
	    if ( license && license.length >= 4 )
	    {
	        this.license = cd.license;
	    }

	    // Resolve type
	    let type = cd.hasOwnProperty( 'type' ) ? cd.type : null;
	    if ( -1 < Configuration.TYPES.indexOf( type ) )
	    {
	        this.type = type;
	    }
	    else
	    {
	        this.type = Configuration.DEFAULT.type;
	    }

	    // Resolve spacer
	    this.spacer = cd.hasOwnProperty( 'spacer' ) ? cd.spacer : null;
	    if ( this.type === Configuration.TYPE_HORIZONTAL )
	    {
	        if ( !this.spacer )
	        {
	            this.spacer = '&nbsp;';
	        }
	        else
	        {
	            this.spacer = Util.forceNbspInHtml( this.spacer );
	        }
	    }
	    else
	    {
	        if ( !this.spacer )
	        {
	            this.spacer = '<br />';
	        }
	    }

	    // Resolve direction
	    let direction = cd.hasOwnProperty( 'direction' ) ? cd.direction : null;
	    if ( -1 < Configuration.DIRECTIONS.indexOf( direction ) )
	    {
	        this.direction = direction;
	    }
	    else
	    {
	        this.direction = Configuration.DEFAULT.direction;
	    }

	    // Resolve mode
	    let mode = cd.hasOwnProperty( 'mode' ) ? cd.mode : null;
	    if ( -1 < Configuration.MODES.indexOf( mode ) )
	    {
	        this.mode = mode;
	    }
	    else
	    {
	        this.mode = Configuration.MODE_CONTINOUS;
	    }

	    // Set pingpongdelay
	    this.pingPongDelay = cd.hasOwnProperty( 'pingpongdelay' ) ? +cd.pingpongdelay : Configuration.PINGPONG_DELAY_DEFAULT;

	    // Resolve position
	    let position = cd.hasOwnProperty( 'position' ) ? cd.position : null;
	    this.setPosition( position );

	    // Resolve perspective
	    this.perspective = {};
	    this.setPerspective( cd.hasOwnProperty( 'perspective' ) ? cd.perspective : null );

	    // Resolve speed
	    let speed = cd.hasOwnProperty( 'speed' ) ? cd.speed : null;
	    this.setSpeed( speed );
	    this._currentSpeed = this.speed;

	    // Resolve content
	    this.setContent( cd.hasOwnProperty( 'content' ) ? cd.content : null );

	    // Resolve continuous mode
	    let pauseonhover = cd.hasOwnProperty( 'pauseonhover' ) ? cd.pauseonhover : null;
	    this.setPauseOnHover( pauseonhover );

	    // Resolve autostart
	    let autostart = cd.hasOwnProperty( 'autostart' ) ? cd.autostart : null;
	    if ( autostart && ( 'false' === autostart || '0' === autostart ) )
	    {
	        this.autostart = false;
	    }
	    else
	    {
	        // Default
	        this.autostart = true;
	    }

	    // Resolve easing
	    let easing = cd.hasOwnProperty( 'easing' ) ? cd.easing : null;
	    if ( easing && ( 'true' === easing || '1' === easing || true === easing ) )
	    {
	        this.easing = true;
	        this.getSpeed = this.getSpeedWithEasing;
	    }
	    else
	    {
	        // Default
	        this.easing = false;
	        this.getSpeed = this.getSpeedNoEasing;
	    }

	    // Resolve rssFeedUrl
	    this.rssFeedUrl = cd.hasOwnProperty( 'rssFeedUrl' ) ? cd.rssFeedUrl : null;
	    this.rssFeedTemplate = cd.hasOwnProperty( 'rssFeedTemplate' ) ? Util.forceNbspInHtml( cd.rssFeedTemplate ) : this.rssFeedTemplate;
	}

	Configuration.SYSTEM_WEBCOMPONENT = 'webcomponent';
	Configuration.SYSTEM_JQUERY = 'jquery';
	Configuration.SYSTEM_VANILLA = 'vanilla';
	Configuration.SYSTEMS = [ Configuration.SYSTEM_WEBCOMPONENT, Configuration.SYSTEM_JQUERY, Configuration.SYSTEM_VANILLA ];

	Configuration.TYPE_HORIZONTAL = 'horizontal';
	Configuration.TYPE_VERTICAL = 'vertical';
	Configuration.TYPES = [ Configuration.TYPE_HORIZONTAL, Configuration.TYPE_VERTICAL ];

	Configuration.DIRECTION_LTR = 'ltr';
	Configuration.DIRECTION_RTL = 'rtl';
	Configuration.DIRECTION_BTT = 'btt';
	Configuration.DIRECTION_TTB = 'ttb';
	Configuration.DIRECTIONS = [ Configuration.DIRECTION_LTR, Configuration.DIRECTION_RTL, Configuration.DIRECTION_BTT, Configuration.DIRECTION_TTB ];

	Configuration.POSITION_CUSTOM = 'custom';
	Configuration.POSITION_FIXEDTOP = 'fixedTop';
	Configuration.POSITION_FIXEDBOTTOM = 'fixedBottom';
	Configuration.POSITIONS = [ Configuration.POSITION_CUSTOM, Configuration.POSITION_FIXEDTOP, Configuration.POSITION_FIXEDBOTTOM ];

	Configuration.MODE_CONTINOUS = 'continuous';
	Configuration.MODE_GAPPED = 'gapped';
	Configuration.MODE_PINGPONG = 'pingpong';
	Configuration.MODES = [ Configuration.MODE_CONTINOUS, Configuration.MODE_GAPPED, Configuration.MODE_PINGPONG ];

	Configuration.SPEED_SUPERSLOW = "superslow";
	Configuration.SPEED_SLOW = "slow";
	Configuration.SPEED_MEDIUM = "medium";
	Configuration.SPEED_FAST = "fast";
	Configuration.SPEED_SUPERFAST = "superfast";

	Configuration.SPEED_HORIZONTAL = {
	    "superslow" : 0.0125,
	    "slow"      : 0.03,
	    "medium"    : 0.05,
	    "fast"      : 0.125,
	    "superfast" : 0.2
	};

	Configuration.SPEED_VERTICAL = {
	    "superslow" : 0.0125,
	    "slow"      : 0.03,
	    "medium"    : 0.05,
	    "fast"      : 0.125,
	    "superfast" : 0.2
	};

	Configuration.PERSPECTIVE_DEFAULT =  {
	    "z" : "none",       // "none" or integer in pixels
	    "originX" : 50,
	    "originY" : 50,
	    "rotateX" : 0,
	    "rotateY" : 0,
	    "rotateZ" : 0
	};

	Configuration.PINGPONG_DELAY_DEFAULT = 2000;

	Configuration.DEFAULT = {
	    "license" : null,
	    "system" : Configuration.SYSTEM_VANILLA,
	    "type" : Configuration.TYPE_HORIZONTAL,
	    "speed" : Configuration.SPEED_MEDIUM,
	    "direction" : Configuration.DIRECTION_LTR,
	    "mode" : Configuration.MODE_CONTINOUS,
	    "position" : Configuration.POSITION_CUSTOM,
	    "perspective" : Configuration.PERSPECTIVE_DEFAULT,
	    "pauseonhover" : false,
	    "autostart" : true,
	    "easing" : false,
	    "content" : "SuperMarquee By SuperPlug.in Is Super !!!",
	    "rssFeedUrl" : null,
	    "rssFeedTemplate" : '<a href="${link}" target="_blank">${title}</a>',
	    "pingPongDelay" : Configuration.PINGPONG_DELAY_DEFAULT,
	    "spacer" : null
	};

	function Event( i )
	{
	    const inst = i;

	    this.getInstance = function()
	    {
	        return inst;
	    };
	}

	Event.prototype.triggerInit = function()
	{
	    let elem = this.getInstance().getRootElement();
	    elem.dispatchEvent( new Event( "init" ) );
	};

	Event.prototype.triggerStart = function()
	{
	    let elem = this.getInstance().getRootElement();
	    elem.dispatchEvent( new Event( "start" ) );
	};

	Event.prototype.triggerLoop = function()
	{
	    let elem = this.getInstance().getRootElement();
	    elem.dispatchEvent( new Event( "loop" ) );
	};

	Event.prototype.triggerPause = function()
	{
	    let elem = this.getInstance().getRootElement();
	    elem.dispatchEvent( new Event( "pause" ) );
	};

	Event.prototype.triggerResume = function()
	{
	    let elem = this.getInstance().getRootElement();
	    elem.dispatchEvent( new Event( "resume" ) );
	};

	const TickLogic = {

	    fnNoScroll : function( dt )
	    {
	        // Nothing to do
	    },

	    /*
	    // Gets set during ticker initialisation
	    _pingPongCurrentDirection : null,
	    _pingPongNextDirection : null,
	    _pingPongPauseDelay : null,
	*/
	    fnHorizontalLtrPingPong : function( dt )
	    {
	        if ( +1 === this._pingPongCurrentDirection )
	        {
	            this._currentXPos += ( dt * this.config.getSpeed() );

	            if ( ( this._currentXPos + this.dimensions.visibleWidth ) > this.dimensions.totalScrollItemWidth )
	            {
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = -1;
	            }
	        }
	        else if ( -1 === this._pingPongCurrentDirection )
	        {
	            this._currentXPos -= ( dt * this.config.getSpeed() );

	            if ( this._currentXPos <= 0 )
	            {
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = 1;
	            }
	        }
	        else
	        {
	            this._pingPongPauseDelay -= dt;
	            if ( this._pingPongPauseDelay < 0 )
	            {
	                this._pingPongCurrentDirection = this._pingPongNextDirection;
	                this._pingPongPauseDelay = this.config.pingPongDelay;
	            }
	        }

	        this.elems.innerContainer.style.transform = 'translate3d(-' + this._currentXPos + 'px,0,0)';
	    },

	    fnHorizontalRtlPingPong : function( dt )
	    {
	        if ( +1 === this._pingPongCurrentDirection )
	        {
	            this._currentXPos -= ( dt * this.config.getSpeed() );

	            if ( this._currentXPos < 0 )
	            {
	                this._currentXPos = 0;
	                this._pingPongCurrentDirection = 0;
	                TickLogic._pingPongNextDirection = -1;
	            }
	        }
	        else if ( -1 === this._pingPongCurrentDirection )
	        {
	            this._currentXPos += ( dt * this.config.getSpeed() );

	            if ( this._currentXPos > ( this.dimensions.totalScrollItemWidth - this.dimensions.visibleWidth ) )
	            {
	                this._currentXPos = ( this.dimensions.totalScrollItemWidth - this.dimensions.visibleWidth );
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = 1;
	            }
	        }
	        else
	        {
	            this._pingPongPauseDelay -= dt;
	            if ( this._pingPongPauseDelay < 0 )
	            {
	                this._pingPongCurrentDirection = this._pingPongNextDirection;
	                this._pingPongPauseDelay = this.config.pingPongDelay;
	            }
	        }

	        this.elems.innerContainer.style.transform = 'translate3d(-' + this._currentXPos + 'px,0,0)';
	    },

	    fnHorizontalTtbPingPong : function( dt )
	    {

	        if ( +1 === this._pingPongCurrentDirection )
	        {
	            this._currentYPos -= ( dt * this.config.getSpeed() );
	            if ( this._currentYPos < -(this.dimensions.totalScrollItemHeight - this.dimensions.visibleHeight) )
	            {
	                this._currentYPos = -(this.dimensions.totalScrollItemHeight - this.dimensions.visibleHeight);
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = -1;
	            }
	        }
	        else if ( -1 === this._pingPongCurrentDirection )
	        {
	            this._currentYPos += ( dt * this.config.getSpeed() );
	            if ( this._currentYPos > 0 )
	            {
	                this._currentYPos = 0;
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = 1;
	            }
	        }
	        else
	        {
	            this._pingPongPauseDelay -= dt;
	            if ( this._pingPongPauseDelay < 0 )
	            {
	                this._pingPongCurrentDirection = this._pingPongNextDirection;
	                this._pingPongPauseDelay = this.config.pingPongDelay;
	            }
	        }

	        this.elems.innerContainer.style.transform = 'translate3d(0,' +  this._currentYPos + 'px, 0)';
	    },


	    fnHorizontalBttPingPong : function( dt )
	    {

	        if ( +1 === this._pingPongCurrentDirection )
	        {
	            this._currentYPos += ( dt * this.config.getSpeed() );
	            if ( this._currentYPos > 0 )
	            {
	                this._currentYPos = 0;
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = -1;
	            }
	        }
	        else if ( -1 === this._pingPongCurrentDirection )
	        {
	            this._currentYPos -= ( dt * this.config.getSpeed() );
	            if ( this._currentYPos < -(this.dimensions.totalScrollItemHeight - this.dimensions.visibleHeight) )
	            {
	                this._currentYPos = -(this.dimensions.totalScrollItemHeight - this.dimensions.visibleHeight);
	                this._pingPongCurrentDirection = 0;
	                this._pingPongNextDirection = 1;
	            }
	        }
	        else
	        {
	            this._pingPongPauseDelay -= dt;
	            if ( this._pingPongPauseDelay < 0 )
	            {
	                this._pingPongCurrentDirection = this._pingPongNextDirection;
	                this._pingPongPauseDelay = this.config.pingPongDelay;
	            }
	        }

	        this.elems.innerContainer.style.transform = 'translate3d(0,' +  this._currentYPos + 'px, 0)';
	    },

	    /**
	     * Horizontal scroll logic, left to right
	     * @param dt
	     */
	    fnHorizontalLtr : function( dt )
	    {
	        this._currentXPos += ( dt * this.config.getSpeed() );

	        if ( this._currentXPos > this.dimensions.totalScrollItemWidth )
	        {
	            this._currentXPos = this.dimensions.totalScrollItemWidth - this._currentXPos;
	        }
	        this.elems.innerContainer.style.transform = 'translate3d(-' + this._currentXPos + 'px,0,0)';
	    },

	    /**
	     * Horizontal scroll logic, right to left
	     * @param dt
	     */
	    fnHorizontalRtl : function( dt )
	    {
	        this._currentXPos -= ( dt * this.config.getSpeed() );

	        if ( this._currentXPos < this.dimensions.totalScrollItemWidth )
	        {
	            this._currentXPos = this.dimensions.totalScrollItemWidth + this._currentXPos;
	        }
	        this.elems.innerContainer.style.transform = 'translate3d(-' + ( this._currentXPos -  this.dimensions.totalScrollItemWidth ) + 'px,0,0)';
	    },

	    /**
	     * Vertical scroll logic, bottom to top
	     * @param dt
	     */
	    fnVerticalBtt: function( dt )
	    {
	        this._currentYPos += ( dt * this.config.getSpeed() );

	        if ( this._currentYPos > this.dimensions.totalScrollItemHeight )
	        {
	            this._currentYPos = this.dimensions.totalScrollItemHeight - this._currentYPos;
	        }
	        this.elems.innerContainer.style.transform = 'translate3d(0, -' + this._currentYPos + 'px,0)';
	    },

	    /**
	     * Vertical scroll logic, top to bottom
	     * @param dt
	     */
	    fnVerticalTtb : function( dt )
	    {
	        this._currentYPos -= ( dt * this.config.getSpeed() );

	        if ( this._currentYPos < this.dimensions.totalScrollItemHeight )
	        {
	            this._currentYPos = this.dimensions.totalScrollItemHeight + this._currentYPos;
	        }
	        this.elems.innerContainer.style.transform = 'translate3d(0, -' + ( this._currentYPos - this.dimensions.totalScrollItemHeight ) + 'px,0)';
	    }
	};

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
	                console.log( items[ i ] );
	                feedData.push(
	                    {
	                        "title" : 0 < items[ i ].getElementsByTagName( 'title' ).length ? items[ i ].getElementsByTagName( 'title' )[ 0 ].innerHTML : null,
	                        "link" : 0 < items[ i ].getElementsByTagName( 'link' ).length ? items[ i ].getElementsByTagName( 'link' )[ 0 ].innerHTML : null,
	                        "pubDate" : 0 < items[ i ].getElementsByTagName( 'pubDate' ).length ? new Date( items[ i ].getElementsByTagName( 'pubDate' )[ 0 ].innerHTML ) : null,
	                        "description" : 0 < items[ i ].getElementsByTagName( 'description' ).length && items[ i ].getElementsByTagName( 'description' )[ 0 ].hasOwnProperty( 'firstChild' ) ? items[ i ].getElementsByTagName( 'description' )[ 0 ].firstChild.wholeText.trim() : null,
	                        "content" : 0 < items[ i ].getElementsByTagName( 'content' ).length ? items[ i ].getElementsByTagName( 'content' )[ 0 ].innerHTML : null
	                    }
	                );
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

	let hasLicenseTextBeenShown = false;

	function Core( root, config )
	{
	    const self = this,
	          events = new Event( this );

	    let fnTick = TickLogic.fnNoScroll.bind( this );
	    this.elems = {
	        rootElement : root,
	        shadowRoot : null,
	        container : null,
	        outerWrapper : null,
	        innerContainer : null,
	        scrollItem : null,
	        scrollItemClone : null
	    };
	    this.config = config;
	    this.dimensions = {};

	    this._time = Date.now();
	    this._rafId = null;
	    this._shouldPlay = false;
	    this._wasPlaying = false;
	    this._isInView = true;

	    this._previousDimensions = { width: this.elems.rootElement.offsetWidth, height: this.elems.rootElement.offsetHeight };

	    const listenerWindowResize = () =>
	        {
	            if ( this.elems.rootElement.offsetWidth === this._previousDimensions.width &&
	                 this.elems.rootElement.offsetHeight === this._previousDimensions.height )
	            {
	                // Do nothing
	                return false;
	            }
	            else
	            {
	                this._previousDimensions = { width: this.elems.rootElement.offsetWidth, height: this.elems.rootElement.offsetHeight };
	            }

	            let wasRunning = false;
	            if ( this._rafId )
	            {
	                wasRunning = true;
	                window.cancelAnimationFrame( this._rafId );
	                this._rafId = null;
	            }
	            this.init();
	            if ( wasRunning )
	            {
	                this.tick();
	            }
	        },
	        listenerDocumentVisibilityChange = () =>
	        {
	            if ( true === document.hidden )
	            {
	                this.onOutOfView();
	            }
	            else
	            {
	                this.onIntoView();
	            }
	        },
	        listenerElemsContainerMouseEnter = () =>
	        {
	            if ( true === this.config.pauseonhover )
	            {
	                this.pause();
	            }
	        },
	        listenerElemsContainerMouseLeave = () =>
	        {
	            if ( true === this.config.pauseonhover )
	            {
	                this.play();
	            }
	        };

	    // Make sure scrolling is inly active, if element is in viewport
	    const observer = new IntersectionObserver((entries, observer) => {
	        let entry = entries.length ? entries[ 0 ] : null;
	        if ( entry )
	        {
	            if ( true === entry.isIntersecting )
	            {
	                this.onIntoView();
	            }
	            else
	            {
	                this.onOutOfView();
	            }
	        }

	    }, {rootMargin: "0px 0px 20px 0px"});

	    setup();

	    this.init = function()
	    {
	        this.elems.container.style.visibility = 'hidden';
	        let prevPosition = this.elems.rootElement.style.position;
	        this.elems.rootElement.style.position = 'initial';

	        this.elems.scrollItem.innerHTML = "";
	        this.elems.scrollItemClone.innerHTML = "";

	        let scrollContent = this.config.content;

	        if ( this.config.rssFeedUrl )
	        {
	            const feedItemData = RssFeedReader.getFeedItemData( this.config.rssFeedUrl );
	            if ( feedItemData && feedItemData.length > 0 )
	            {

	                let title, link, pubDate, description, content;
	                for ( let fi = 0; fi < feedItemData.length; fi++ )
	                {
	                    title = feedItemData[ fi ].hasOwnProperty( 'title' ) && feedItemData[ fi ].title ? feedItemData[ fi ].title : '';
	                    link = feedItemData[ fi ].hasOwnProperty( 'link' ) && feedItemData[ fi ][ 'link' ] ? feedItemData[ fi ][ 'link' ] : '#';
	                    pubDate = feedItemData[ fi ].hasOwnProperty( 'pubDate' ) && feedItemData[ fi ].pubDate ? feedItemData[ fi ].pubDate : new Date();
	                    description = feedItemData[ fi ].hasOwnProperty( 'description' ) && feedItemData[ fi ].description ? feedItemData[ fi ].description : '';
	                    content = feedItemData[ fi ].hasOwnProperty( 'content' ) && feedItemData[ fi ].content ? feedItemData[ fi ].content : '';

	                    scrollContent += eval( "`" + this.config.rssFeedTemplate + "`" );
	                    scrollContent += this.config.spacer;
	                }
	            }

	            /*

	            const rssFeedContent = RssFeedReader.getScrollContentOfFeed( this.config.rssFeedUrl, this.config.spacer );
	            if( rssFeedContent && rssFeedContent.length > 0 )
	            {
	                scrollContent += rssFeedContent;
	            }
	             */
	        }

	        if ( Configuration.TYPE_HORIZONTAL === this.config.type )
	        {
	            let maxWidth;
	            // Add same content to clone item
	            switch ( this.config.mode  )
	            {
	                case Configuration.MODE_PINGPONG:
	                    this.elems.scrollItem.innerHTML += scrollContent;
	                    this.elems.scrollItemClone.innerHTML = "";
	                    maxWidth = ( prevPosition === 'fixed' ) ? window.innerWidth : this.elems.container.clientWidth;
	                    this.config._gappedScrollingEnabled = ( maxWidth < this.elems.scrollItem.clientWidth );
	                break;

	                case Configuration.MODE_GAPPED:
	                    this.elems.scrollItem.innerHTML += scrollContent;
	                    this.elems.scrollItem.style.paddingLeft = this.elems.container.clientWidth + 'px';
	                    this.elems.scrollItemClone.innerHTML = "";
	                break;

	                default:
	                case Configuration.MODE_CONTINOUS:
	                    // Fill up the space of complete window
	                    maxWidth = ( prevPosition === 'fixed' ) ? window.innerWidth : this.elems.container.clientWidth;
	                    while ( maxWidth > this.elems.scrollItem.clientWidth )
	                    {
	                        this.elems.scrollItem.innerHTML += scrollContent;
	                    }
	                    this.elems.scrollItemClone.innerHTML = this.elems.scrollItem.innerHTML;
	                break;
	            }
	        }
	        // Vertical
	        else
	        {
	            if ( 0 <= this.elems.scrollItem.getBoundingClientRect().height )
	            {
	                this.elems.scrollItem.innerHTML = "&nbsp;";
	            }

	            let maxHeight = ( prevPosition === 'fixed' ) ? window.innerHeight : this.elems.container.clientHeight;
	            this.elems.outerWrapper.style.maxHeight = maxHeight + 'px';
	            this.elems.scrollItem.innerHTML = "";

	            switch ( this.config.mode )
	            {
	                case Configuration.MODE_PINGPONG:
	                    this.elems.scrollItem.innerHTML += scrollContent;
	                    this.elems.scrollItemClone.innerHTML = "";
	                    maxHeight = ( prevPosition === 'fixed' ) ? window.innerHeight : this.elems.container.clientHeight;
	                    this.config._gappedScrollingEnabled = ( maxHeight < this.elems.scrollItem.clientHeight );
	                break;

	                case Configuration.MODE_GAPPED:
	                    this.elems.scrollItem.innerHTML += scrollContent;
	                    this.elems.scrollItem.style.paddingTop = this.elems.container.clientHeight + 'px';
	                    this.elems.scrollItemClone.innerHTML = "";
	                break;

	                default:
	                case Configuration.MODE_CONTINOUS:
	                    maxHeight = ( prevPosition === 'fixed' ) ? window.innerHeight : this.elems.container.clientHeight;
	                    // Fill up the space of scroll container
	                    while ( maxHeight > this.elems.scrollItem.clientHeight )
	                    {
	                        this.elems.scrollItem.innerHTML += scrollContent;
	                    }
	                    this.elems.scrollItemClone.innerHTML = this.elems.scrollItem.innerHTML;
	                break;
	            }
	        }

	        this.updatePerspective();

	        // Set dimensions
	        // Note:
	        // Timeout is required to make sure that dimensions calculations work as expected.
	        // Timeout delay needs to be in sync with SuperMarquee.setup timeout.
	        setTimeout( () =>
	        {
	            this.updateDimensions();
	            this.updateTickLogic();
	            this.elems.container.style.visibility = 'visible';
	            this.onIntoView();
	        }, 100 );

	        // Init
	        this._currentXPos = 0;
	        this._currentYPos = 0;
	        this._pingPongCurrentDirection = 0;
	        this._pingPongNextDirection = -1;
	        this._pingPongPauseDelay = self.config.pingPongDelay;
	        this._time = Date.now();

	        //this.elems.container.style.visibility = 'visible';
	        this.elems.rootElement.style.position = prevPosition;

	        // Hello
	        if ( false === this.config.hasLicense() && window.console && false === hasLicenseTextBeenShown )
	        {
	            hasLicenseTextBeenShown = true;
	            console.log( "%c»SuperMarquee« by SuperPlug.in. Unlicensed version for non commercial use only.", "font-family: monospace sans-serif; background-color: #8089ff; color: white;" );
	        }
	    }.bind ( this );

	    this.updatePerspective = function()
	    {
	        this.elems.perspective.style.perspective = this.config.perspective.z + 'px';
	        this.elems.perspective.style.perspectiveOrigin = this.config.perspective.originX + '% ' + this.config.perspective.originY + '%';
	        this.elems.outerWrapper.style.transform = 'rotateX(' + this.config.perspective.rotateX + 'deg) rotateY(' + this.config.perspective.rotateY + 'deg) rotateZ(' + this.config.perspective.rotateZ + 'deg)';

	    }.bind( this );

	    this.updateTickLogic = function()
	    {
	        if ( Configuration.MODE_PINGPONG === self.config.mode )
	        {
	            if ( false === self.config._gappedScrollingEnabled )
	            {
	                fnTick = TickLogic.fnNoScroll.bind( self );
	            }
	            else
	            {
	                if ( Configuration.TYPE_HORIZONTAL === self.config.type )
	                {
	                    switch ( self.config.direction )
	                    {
	                        case Configuration.DIRECTION_RTL:
	                            this._currentXPos = this.dimensions.totalScrollItemWidth - this.dimensions.visibleWidth;
	                            this._pingPongCurrentDirection = 0;
	                            this._pingPongNextDirection = -1;
	                            this._pingPongPauseDelay = self.config.pingPongDelay;
	                            fnTick = TickLogic.fnHorizontalRtlPingPong.bind( self );
	                        break;

	                        default:
	                        case Configuration.DIRECTION_LTR:
	                            this._currentXPos = 0;
	                            this._pingPongCurrentDirection = 0;
	                            this._pingPongNextDirection = 1;
	                            this._pingPongPauseDelay = self.config.pingPongDelay;
	                            fnTick = TickLogic.fnHorizontalLtrPingPong.bind( self );
	                        break;
	                    }
	                }
	                else
	                {
	                    switch ( self.config.direction )
	                    {
	                        case Configuration.DIRECTION_TTB:
	                            this._currentYPos = -(this.dimensions.totalScrollItemHeight - this.dimensions.visibleHeight);
	                            this._pingPongCurrentDirection = 0;
	                            this._pingPongNextDirection = -1;
	                            this._pingPongPauseDelay = self.config.pingPongDelay;
	                            fnTick = TickLogic.fnHorizontalTtbPingPong.bind( self );
	                        break;

	                        case Configuration.DIRECTION_BTT:
	                            this._currentYPos = 0;
	                            this._pingPongCurrentDirection = 0;
	                            this._pingPongNextDirection = -1;
	                            this._pingPongPauseDelay = self.config.pingPongDelay;
	                            fnTick = TickLogic.fnHorizontalBttPingPong.bind( self );
	                        break;
	                    }
	                }
	            }
	        }
	        else
	        {
	            if ( Configuration.TYPE_HORIZONTAL === self.config.type )
	            {

	                switch ( self.config.direction )
	                {
	                    case Configuration.DIRECTION_RTL:
	                        fnTick = TickLogic.fnHorizontalRtl.bind( self );
	                        break;

	                    default:
	                    case Configuration.DIRECTION_LTR:
	                        fnTick = TickLogic.fnHorizontalLtr.bind( self );
	                        break;
	                }
	            }
	            else
	            {
	                switch ( self.config.direction )
	                {
	                    case Configuration.DIRECTION_TTB:
	                        fnTick = TickLogic.fnVerticalTtb.bind( self );
	                        break;

	                    default:
	                    case Configuration.DIRECTION_BTT:
	                        fnTick = TickLogic.fnVerticalBtt.bind( self );
	                        break;
	                }
	            }
	        }
	    }.bind( this );

	    this.updateDimensions = function()
	    {
	        // Set dimensions
	        this.dimensions.visibleWidth = this.elems.container.clientWidth;
	        this.dimensions.visibleHeight = this.elems.container.clientHeight;
	        this.dimensions.totalScrollItemWidth = this.elems.scrollItem.offsetWidth;
	        this.dimensions.totalScrollItemHeight = this.elems.scrollItem.offsetHeight;
	    }.bind( this );

	    this.tick = function()
	    {
	        const currentTime = Date.now();
	        const deltaTime = currentTime - this._time;
	        this._time = currentTime;

	        fnTick( deltaTime );

	        this._rafId = window.requestAnimationFrame( this.tick );
	    }.bind ( this );

	    this.getRootElement = function()
	    {
	        return this.elems.rootElement;
	    }.bind( this );


	    this.getEvents = function()
	    {
	        return events;
	    };

	    this.destroy = function()
	    {
	        if ( this._rafId )
	        {
	            window.cancelAnimationFrame( this._rafId );
	            this._rafId = null;
	        }

	        window.removeEventListener( 'resize', listenerWindowResize );
	        document.removeEventListener( 'visibilitychange', listenerDocumentVisibilityChange );
	        this.elems.container.removeEventListener( 'mouseenter', listenerElemsContainerMouseEnter );
	        this.elems.container.removeEventListener( 'mouseleave', listenerElemsContainerMouseLeave );

	        observer.unobserve( this.elems.container );

	        this.elems.rootElement.innerHTML = "";

	    };

	    this.getScrollContent = function()
	    {
	        return this.config.content;
	    };

	    function setup()
	    {
	        switch ( self.config.system )
	        {
	            case Configuration.SYSTEM_JQUERY:
	            case Configuration.SYSTEM_VANILLA:
	            case Configuration.SYSTEM_WEBCOMPONENT:
	                self.elems.shadowRoot = self.elems.rootElement;//self.elems.rootElement.attachShadow( { mode : 'open' } );
	                if ( self.config.type === Configuration.TYPE_VERTICAL )
	                {
	                    self.elems.shadowRoot.appendChild( templateVertical.content.cloneNode( true ) );
	                }
	                else
	                {
	                    self.elems.shadowRoot.appendChild( templateHorizontal.content.cloneNode( true ) );
	                }
	                self.elems.container = self.elems.shadowRoot.querySelector( 'div.supermarquee-container' );
	                self.elems.perspective = self.elems.shadowRoot.querySelector( 'div.supermarquee-perspective:first-child' );
	                self.elems.outerWrapper = self.elems.shadowRoot.querySelector( 'div.supermarquee-outer-wrapper:first-child' );
	                self.elems.innerContainer = self.elems.shadowRoot.querySelector( 'div.supermarquee-inner-container:first-child' );
	            break;
	        }

	        self.elems.scrollItem = self.elems.innerContainer.querySelector( 'div.supermarquee-item:first-child' );
	        self.elems.scrollItemClone = self.elems.innerContainer.querySelector( 'div.supermarquee-item-clone' );

	        window.addEventListener( 'resize', listenerWindowResize );
	        document.addEventListener( 'visibilitychange', listenerDocumentVisibilityChange );
	        self.elems.container.addEventListener( 'mouseenter', listenerElemsContainerMouseEnter );
	        self.elems.container.addEventListener( 'mouseleave', listenerElemsContainerMouseLeave );
	        observer.observe( self.elems.container );
	    }
	}

	Core.prototype.VERSION = "2.0";

	Core.prototype.play = function()
	{
	    this._shouldPlay = true;
	    if ( false === this._isInView ) return;

	    if ( !this._rafId )
	    {
	        this._time = Date.now();
	        this.tick();
	        this._wasPlaying = true;
	    }
	};

	Core.prototype.pause = function()
	{
	    this._shouldPlay = false;
	    if ( this._rafId )
	    {
	        window.cancelAnimationFrame( this._rafId );
	        this._rafId = null;
	        this._wasPlaying = true;
	    }
	    else
	    {
	        this._wasPlaying = false;
	    }
	};

	Core.prototype.setScrollContent = function( content )
	{
	    this.config.setContent( content );
	    this.init();
	};

	Core.prototype.setScrollSpeed = function( speed )
	{
	    this.config.setSpeed( speed );
	};

	Core.prototype.setPosition = function( position )
	{
	    this.config.setPosition( position );
	    switch( this.config.position )
	    {
	        case Configuration.POSITION_FIXEDTOP:
	            this.elems.rootElement.style.position = 'fixed';
	            this.elems.rootElement.style.removeProperty( 'left' );
	            this.elems.rootElement.style.removeProperty( 'top' );
	            this.elems.rootElement.style.removeProperty( 'bottom' );
	            this.elems.rootElement.style.width = "100%";
	            this.elems.rootElement.style.top = 0;
	            this.elems.rootElement.style.left = 0;
	            break;

	        case Configuration.POSITION_FIXEDBOTTOM:
	            this.elems.rootElement.style.position = 'fixed';
	            this.elems.rootElement.style.removeProperty( 'left' );
	            this.elems.rootElement.style.removeProperty( 'top' );
	            this.elems.rootElement.style.removeProperty( 'bottom' );
	            this.elems.rootElement.style.width = "100%";
	            this.elems.rootElement.style.bottom = 0;
	            this.elems.rootElement.style.left = 0;
	            break;

	        default:
	        case Configuration.POSITION_CUSTOM:
	            this.elems.rootElement.style.removeProperty( 'position' );
	            this.elems.rootElement.style.removeProperty( 'left' );
	            this.elems.rootElement.style.removeProperty( 'top' );
	            this.elems.rootElement.style.removeProperty( 'bottom' );
	        break;
	    }
	    this.init();
	};

	Core.prototype.setPauseOnHover = function( pauseonhover )
	{
	    this.config.setPauseOnHover( pauseonhover );
	};

	Core.prototype.setPerspective  = function( perspective )
	{
	    this.config.setPerspective( perspective );
	    this.updatePerspective();
	};

	Core.prototype.onIntoView = function()
	{
	    this._isInView = true;
	    // @todo Fix this
	    //if ( true === this._wasPlaying || true === this._shouldPlay )
	    {
	        this.play();
	    }
	};

	Core.prototype.onOutOfView = function()
	{
	    this._isInView = false;
	    this.pause();
	};

	Core.prototype.destroy = function(){};

	Core.prototype.Log = function( message, level = 'info' )
	{
	    console[ level ]( message );
	};

	function SuperMarquee( rootElement, cfg = {} )
	{
	    if ( !rootElement || false === ( rootElement instanceof HTMLElement ) )
	    {
	        throw new Error( 'Missing/invalid rootElement: ', rootElement );
	    }

	    const configData = JSON.parse( JSON.stringify( Configuration.DEFAULT ) );
	    let config;

	    for ( let k in configData )
	    {
	        if ( cfg.hasOwnProperty( k ) )
	        {
	            configData[ k ] = cfg[ k ];
	        }
	        else if ( rootElement.hasAttribute( 'data-' + k ) )
	        {
	            configData[ k ] = rootElement.getAttribute( 'data-' + k );
	        }
	    }

	    configData.system = Configuration.SYSTEM_VANILLA;
	    config = new Configuration( configData );
	    this._core = new Core( rootElement, config );
	    this._core.init();
	    setTimeout( () =>
	    {
	        if ( this._core.config.autostart )
	        {
	            this._core.tick();
	        }
	    }, 150 );

	    return this;
	}

	SuperMarquee.getDefaultConfiguration = function()
	{
	    return JSON.parse( JSON.stringify( Configuration.DEFAULT ) );
	};

	// Public core methods
	SuperMarquee.prototype.play = function()
	{
	    this._core.play();
	};

	SuperMarquee.prototype.pause = function()
	{
	    this._core.pause();
	};

	SuperMarquee.prototype.setScrollContent = function( content )
	{
	    this._core.setScrollContent( content );
	};

	SuperMarquee.prototype.setScrollSpeed = function( speed )
	{
	    this._core.setScrollSpeed( speed);
	};

	SuperMarquee.prototype.getScrollSpeed = function()
	{
	    return +this._core.config.speed;
	};

	SuperMarquee.prototype.setPosition = function( position )
	{
	    this._core.setPosition( position );
	};

	SuperMarquee.prototype.setPauseOnHover = function( pauseonhover )
	{
	    this._core.setPauseOnHover( pauseonhover );
	};

	SuperMarquee.prototype.setPerspective = function( perspective )
	{
	    this._core.setPerspective( perspective );
	};

	SuperMarquee.prototype.destroy = function()
	{
	    this._core.destroy();
	};

	return SuperMarquee;

})));
