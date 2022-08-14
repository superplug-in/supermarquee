import { Core } from "./Core.js";
import { Configuration } from "./Configuration.js";

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

export default SuperMarquee;
