import SuperMarquee from "./../core/SuperMarquee.js";

(function($, window, document, undefined) {

    //
    // Plugin name variable
    //
    var pluginName = 'supermarquee';

    //
    // The actual plugin constructor
    //
    function Plugin(element, options) {
        this.el = element;
        this.$el = $(element);
        this.options = $.extend({}, $.fn[ pluginName ].defaults, options);
        this.options.system = 'jquery';

        // opt. public propertys
        // this.id = ...

        // Initialize the plugin instance
        this.init( this.options );
    }

    //
    // Plugin prototype
    //
    Plugin.prototype = {
        init: function()
        {
            this.ssInstance = new SuperMarquee( this.el, this.options );
        },
        play : function()
        {
            this.ssInstance.play();
        },
        pause : function()
        {
            this.ssInstance.pause();
        },
        setScrollContent : function( content )
        {
            this.ssInstance.setScrollContent( content );
        },
        setScrollSpeed : function( speed )
        {
            this.ssInstance.setScrollSpeed( speed );
        },
        setPosition : function( position )
        {
            this.ssInstance.setPosition( position );
        },
        setPauseOnHover : function( pauseonhover )
        {
            this.ssInstance.setPauseOnHover( pauseonhover );
        },
        setPerspective : function( perspective )
        {
            this.ssInstance.setPerspective( perspective );
        },
        setPingPongDelay : function( ppd )
        {
            this.ssInstance.setPingPongDelay( ppd );
        },
        destroy: function()
        {
            this.ssInstance.destroy();
        }
    };

    //
    // Plugin wrapper around the constructor,
    // preventing against multiple instantiations and allowing any
    // public function (whose name doesn't start with an underscore) to be
    // called via the jQuery plugin:
    // e.g. $(element).defaultPluginName('functionName', arg1, arg2)
    //
    $.fn[ pluginName ] = function( options )
    {
        var args = arguments;

        if (options === undefined || typeof options === 'object') {
            // Create a plugin instance for each selected element.
            return this.each(function() {
                if (!$.data(this, 'plugin_' + pluginName)) {
                    $.data(this, 'plugin_' + pluginName, new Plugin(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            // Call a pluguin method for each selected element.
            if (Array.prototype.slice.call(args, 1).length == 0 && $.inArray(options, $.fn[pluginName].getters) != -1) {
                // If the user does not pass any arguments and the method allows to
                // work as a getter then break the chainability
                var instance = $.data(this[0], 'plugin_' + pluginName);
                return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
            } else {
                // Invoke the speficied method on each selected element
                return this.each(function() {
                    var instance = $.data(this, 'plugin_' + pluginName);
                    if (instance instanceof Plugin && typeof instance[options] === 'function') {
                        instance[options].apply(instance, Array.prototype.slice.call(args, 1));
                    }
                });
            }
        }
    };

    //
    // Names of the pluguin methods that can act as a getter method.
    //
    $.fn[ pluginName ].getters = [];

    //
    // Default options
    //
    $.fn[ pluginName ].defaults = SuperMarquee.getDefaultConfiguration();

})(jQuery, window, document);
