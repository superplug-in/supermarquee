const templateHorizontal = document.createElement( 'template' );
const templateVertical = document.createElement( 'template' );

// Refer to: https://medium.com/@mrg101/this-is-great-thinking-2153c8982152
function interpolate (template, params)
{
    const replaceTags = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '(': '%28', ')': '%29' };
    const safeInnerHTML = text => text.toString().replace(/[&<>\(\)]/g, tag => replaceTags[tag] || tag);
    const keys = Object.keys(params);
    const keyVals = Object.values(params).map(safeInnerHTML);
    return new Function(...keys, `return \`${template}\``)(...keyVals);
}


const instanceId="dummy";
templateHorizontal.innerHTML = `
    <style>
        .fader-hori-${instanceId}::before,
        .fader-hori-${instanceId}::after {
            display: block;
            content: '';
            width: 30%;
            height: 100%;
            position: absolute;
            top: 0;
            z-index: 1;
            pointer-events: none;
        }
        .fader-hori-${instanceId}::before {
            left: 0;
            background-image: linear-gradient(to right, #ffffff, transparent);
        }
    </style>
    <div class="supermarquee-container"
         data-instance-id="${instanceId}"    
         style="width: 100%; display: block;pointer-events: all; overflow: hidden;visibility: hidden;">
        <div class="supermarquee-perspective">
            <div class="supermarquee-outer-wrapper"
                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;">
                <div class="supermarquee-inner-container"
                     style="display: flex;flex: 0 0 auto;white-space: nowrap;height: inherit;">
                    <div class="supermarquee-item"
                         style="display: flex;flex: 0 0 auto;"></div>
                    <div class="supermarquee-item-clone"
                         style="display: flex;flex: 0 0 auto;"></div>
                </div>
            </div>
        </div>
    </div>
`;
/**

 <style>
 <div class="supermarquee-container"
 style="width: 100%; display: block;pointer-events: all; overflow: hidden;visibility: hidden;">
 <div class="supermarquee-perspective">
 <div class="supermarquee-outer-wrapper"
 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;">
 <div class="supermarquee-inner-container"
 style="display: flex;flex: 0 0 auto;white-space: nowrap;height: inherit;">
 <div class="supermarquee-item"
 style="display: flex;flex: 0 0 auto;"></div>
 <div class="supermarquee-item-clone"
 style="display: flex;flex: 0 0 auto;"></div>
 </div>
 </div>
 </div>
 </div>


 */
const tmplHori = '    <style>\n        .fader-hori-${instanceId}::before,\n        .fader-hori-${instanceId}::after {\n            display: block;\n            content: \'\';\n            width: 30%;\n            height: 100%;\n            position: absolute;\n            top: 0;\n            z-index: 1;\n            pointer-events: none;\n        }\n        .fader-hori-${instanceId}::before {\n            left: 0;\n            background-image: linear-gradient(to right, #ffffff, transparent);\n        }\n    </style>\n    <div class="supermarquee-container"\n         data-instance-id="${instanceId}"    \n         style="width: 100%; display: block;pointer-events: all; overflow: hidden;visibility: hidden;">\n        <div class="supermarquee-perspective">\n            <div class="supermarquee-outer-wrapper"\n                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;">\n                <div class="supermarquee-inner-container"\n                     style="display: flex;flex: 0 0 auto;white-space: nowrap;height: inherit;">\n                    <div class="supermarquee-item"\n                         style="display: flex;flex: 0 0 auto;"></div>\n                    <div class="supermarquee-item-clone"\n                         style="display: flex;flex: 0 0 auto;"></div>\n                </div>\n            </div>\n        </div>\n    </div>';

function getHorizontal( data )
{
    const ih = interpolate( tmplHori.toString().trim(), data );
    const tmpl = document.createElement( 'template' );
    tmpl.innerHTML = ih;
    return tmpl;
}


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

export { templateHorizontal, templateVertical, getHorizontal };
