import { Util } from "./Util.js";

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
                this.speed = +Configuration.SPEED_HORIZONTAL[ speed ]
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
                this.speed = +Configuration.SPEED_VERTICAL[ speed ]
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
            this.content = "SuperMarquee by SuperPlug.in is Super !!!";
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

    this.setFader = function( faderSettings = null )
    {
        const props = Object.keys( this.fader );
        let fs = null;
        if ( typeof faderSettings === 'string' || faderSettings instanceof String )
        {
            try
            {
                faderSettings = JSON.parse( faderSettings )
            }
            catch ( e )
            {
                faderSettings = null;
            }
        }

        if ( typeof faderSettings === 'object' && !Array.isArray( faderSettings ) && faderSettings !== null )
        {
            fs = faderSettings;
        }

        if ( fs === null )
        {
            return false;
        }

        for ( let pi = 0; pi < props.length; pi++ )
        {
            if ( fs.hasOwnProperty( props[ pi ] ) )
            {
                if ( fs[ props[ pi ] ].hasOwnProperty( "size" ) )
                {
                    this.fader[ props[ pi ] ].size = parseFloat( fs[ props[ pi ] ].size );
                }

                if ( fs[ props[ pi ] ].hasOwnProperty( "colorFrom" ) )
                {
                    this.fader[ props[ pi ] ].colorFrom = fs[ props[ pi ] ].colorFrom;
                }

                if ( fs[ props[ pi ] ].hasOwnProperty( "colorFromAlpha" ) )
                {
                    this.fader[ props[ pi ] ].colorFromAlpha = fs[ props[ pi ] ].colorFromAlpha;
                }

                if ( fs[ props[ pi ] ].hasOwnProperty( "colorTo" ) )
                {
                    this.fader[ props[ pi ] ].colorTo = fs[ props[ pi ] ].colorTo;
                }

                if ( fs[ props[ pi ] ].hasOwnProperty( "colorToAlpha" ) )
                {
                    this.fader[ props[ pi ] ].colorToAlpha = fs[ props[ pi ] ].colorToAlpha;
                }
            }
        }
    }

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

    this.fader = JSON.parse( JSON.stringify( Configuration.FADER_DEFAULT ) );
    this.setFader( cd.hasOwnProperty( 'fader' ) ? cd.fader : null );

    // Set cssClass
    this.cssClass = null;
    if ( cd.hasOwnProperty( 'cssClass') && ( typeof cd.cssClass === 'string' || cd.cssClass instanceof String ) && cd.cssClass.length > 0 )
    {
        this.cssClass = cd.cssClass;
    }
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

Configuration.FADER_DEFAULT = {
    "left" : {
        "size" : 0,
        "colorFrom" : "rgba( 255, 255, 255, 1 )",
        "colorTo" : "rgba( 255, 255, 255, 0 )"
    },
    "right" : {
        "size" : 0,
        "colorFrom" : "rgba( 255, 255, 255, 255 )",
        "colorTo" : "rgba( 255, 255, 255, 0 )"
    },
    "top" : {
        "size" : 0,
        "colorFrom" : "rgba( 255, 255, 255, 255 )",
        "colorTo" : "rgba( 255, 255, 255, 0 )"
    },
    "bottom" : {
        "size" : 0,
        "colorFrom" : "rgba( 255, 255, 255, 255 )",
        "colorTo" : "rgba( 255, 255, 255, 0 )"
    }
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
    "spacer" : null,
    "fader" : Configuration.FADER_DEFAULT,
    "cssClass" : null
};

export { Configuration };
