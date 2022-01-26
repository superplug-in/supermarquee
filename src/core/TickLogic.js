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

export { TickLogic };