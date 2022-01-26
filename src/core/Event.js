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

export { Event };