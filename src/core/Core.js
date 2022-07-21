import { templateVertical, templateHorizontal } from "./Template.js";
import { Configuration } from "./Configuration.js";
import { Event } from "./Event.js";
import { TickLogic } from "./TickLogic.js";
import { RssFeedReader } from "./RssFeedReader.js";
import { Util } from "./Util.js";

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

Core.prototype.VERSION = "1.5";

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

export { Core };
