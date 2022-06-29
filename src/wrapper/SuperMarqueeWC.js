import { Core } from "./../core/Core.js";
import { Configuration } from "./../core/Configuration.js";

class SuperMarquee extends HTMLElement
{
    constructor()
    {
        // Setup
        super();

        let configData = {},
            config,
            configAttributes = [ 'type', 'direction', 'mode', 'speed', 'content', 'rssFeedUrl', 'rssFeedTemplate', 'pauseonhover', 'autostart', 'easing', 'perspective' ];

        for ( let ci = 0; ci < configAttributes.length; ci++ )
        {
            if ( this.hasAttribute( configAttributes[ ci ] ) )
            {
                configData[ configAttributes[ ci ] ] = this.getAttribute( configAttributes[ ci ] );
            }
        }

        configData.system = Configuration.SYSTEM_WEBCOMPONENT;
        config = new Configuration( configData );

        console.log( config );

        this._core = new Core( this, config );
    }

    connectedCallback()
    {
        this._core.init();
        if ( this._core.config.autostart )
        {
            this._core.tick();
        }
    }

    static get observedAttributes()
    {
        return [ 'speed', 'content', 'position', 'pauseonhover', 'perspective' ];
    }

    attributeChangedCallback( name, oldVal, newVal )
    {
        switch ( name )
        {
            case 'content':
                this.setScrollContent( newVal );
                break;

            case 'speed':
                this.setScrollSpeed( newVal );
                break;

            case 'position':
                this.setPosition( newVal );
                break;

            case 'pauseonhover':
                this.setPauseOnHover( newVal );
            break;

            case 'perspective':
                this.setPerspective( newVal );
            break;

        }
    }

    disconnectedCallback()
    {
        this._core.destroy();
    }


    // Public core methods
    play()
    {
        this._core.play();
    }

    pause()
    {
        this._core.pause();
    }

    setScrollContent( content )
    {
        this._core.setScrollContent( content );
    }

    setScrollSpeed( speed )
    {
        this._core.setScrollSpeed( speed);
    }

    setPosition( position )
    {
        this._core.setPosition( position );
    }

    setPauseOnHover( pauseonhover )
    {
        this._core.setPauseOnHover( pauseonhover );
    }

}

window.customElements.define( 'super-marquee', SuperMarquee );
