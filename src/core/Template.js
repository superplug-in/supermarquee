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

export { templateHorizontal, templateVertical };
