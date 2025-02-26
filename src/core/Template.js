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

const instanceId = 'not-used';

// Instruction
// 1. Edit HTML below
// 2. Copy paste it to template string below
templateHorizontal.innerHTML = `
    <style>
        .fader-left-${instanceId} {
            --faderLeft: 0%;
            --faderLeftGradient : linear-gradient(to right, #ffffff, transparent);
        }
        .fader-left-${instanceId}::before {
            display: block;
            content: '';
            width: var(--faderLeft);
            height: 100%;
            position: absolute;
            top: 0;
            z-index: 1;
            pointer-events: none;
            left: 0;
            background-image:  var( --faderLeftGradient );
        }
        .fader-right-${instanceId} {
            --faderRight: 0%;
            --faderRightGradient : linear-gradient(to right, #ffffff, transparent);
        }
        .fader-right-${instanceId}::after {
            display: block;
            content: '';
            width: var(--faderRight);
            height: 100%;
            position: absolute;
            top: 0;
            z-index: 1;
            pointer-events: none;
            right: 0;
            background-image:  var( --faderRightGradient );
        }
    </style>
    <div data-id="supermarquee-container"
         data-instance-id="${instanceId}"    
         style="width: 100%; display: block;pointer-events: all; overflow: hidden;visibility: hidden;">
        <div data-id="supermarquee-perspective">
            <div data-id="supermarquee-outer-wrapper"
                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;">
                <div data-id="supermarquee-inner-container"
                     style="display: flex;flex: 0 0 auto;white-space: nowrap;height: inherit;">
                    <div data-id="supermarquee-item"
                         style="display: flex;flex: 0 0 auto;"></div>
                    <div data-id="supermarquee-item-clone"
                         style="display: flex;flex: 0 0 auto;"></div>
                </div>
            </div>
        </div>
    </div>
`;
const tmplHori = '<style>\n        .fader-left-${instanceId} {\n            --faderLeft: 0%;\n            --faderLeftGradient : linear-gradient(to right, #ffffff, transparent);\n        }\n        .fader-left-${instanceId}::before {\n            display: block;\n            content: \'\';\n            width: var(--faderLeft);\n            height: 100%;\n            position: absolute;\n            top: 0;\n            z-index: 1;\n            pointer-events: none;\n            left: 0;\n            background-image:  var( --faderLeftGradient );\n        }\n        .fader-right-${instanceId} {\n            --faderRight: 0%;\n            --faderRightGradient : linear-gradient(to right, #ffffff, transparent);\n        }\n        .fader-right-${instanceId}::after {\n            display: block;\n            content: \'\';\n            width: var(--faderRight);\n            height: 100%;\n            position: absolute;\n            top: 0;\n            z-index: 1;\n            pointer-events: none;\n            right: 0;\n            background-image:  var( --faderRightGradient );\n        }\n    </style>\n    <div data-id="supermarquee-container"\n         data-instance-id="${instanceId}"    \n         style="width: 100%; display: block;pointer-events: all; overflow: hidden;visibility: hidden;">\n        <div data-id="supermarquee-perspective">\n            <div data-id="supermarquee-outer-wrapper"\n                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;">\n                <div data-id="supermarquee-inner-container"\n                     style="display: flex;flex: 0 0 auto;white-space: nowrap;height: inherit;">\n                    <div data-id="supermarquee-item"\n                         style="display: flex;flex: 0 0 auto;"></div>\n                    <div data-id="supermarquee-item-clone"\n                         style="display: flex;flex: 0 0 auto;"></div>\n                </div>\n            </div>\n        </div>\n    </div>';

function getHorizontal( data )
{
    const ih = interpolate( tmplHori.toString().trim(), data );
    const tmpl = document.createElement( 'template' );
    tmpl.innerHTML = ih;
    return tmpl;
}

// Instruction
// 1. Edit HTML below
// 2. Copy paste it to template string below
templateVertical.innerHTML = `
    <style>
        .fader-top-${instanceId} {
            --faderTop: 0%;
            --faderTopGradient : linear-gradient(180deg, transparent, #ffffff);
        }
        .fader-top-${instanceId}::before {
            display: block;
            content: '';
            height: var(--faderTop);
            top: 0;
            left : 0;
            right: 0;
            position: absolute;
            z-index: 1;
            pointer-events: none;
            background-image: var( --faderTopGradient );
        } 
        .fader-bottom-${instanceId} {
            --faderBottom: 0%;
            --faderBottomGradient : linear-gradient(180deg, transparent, #ffffff);
        }
        .fader-bottom-${instanceId}::after {
            display: block;
            content: '';
            height: var(--faderBottom);
            bottom: 0;
            left : 0;
            right: 0;
            position: absolute;
            z-index: 1;
            pointer-events: none;
            background-image: var( --faderBottomGradient );
        }  
    </style>
    
    <div data-id="supermarquee-container"
         style="width: 100%; display: block;pointer-events: all;height: inherit;overflow: hidden;visibility: hidden;">
        <div data-id="supermarquee-perspective">        
            <div data-id="supermarquee-outer-wrapper"
                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;width: inherit;height: inherit;">
                <div data-id="supermarquee-inner-container"
                     style="display: inline-block;width: inherit;max-height: 100%;height: inherit;">
                    <div data-id="supermarquee-item" style="display: block;"></div>
                    <div data-id="supermarquee-item-clone" style="display: block;"></div>
                </div>
            </div>
        </div>
    </div>
`;

const tmplVert = '<style>\n        .fader-top-${instanceId} {\n            --faderTop: 0%;\n            --faderTopGradient : linear-gradient(180deg, transparent, #ffffff);\n        }\n        .fader-top-${instanceId}::before {\n            display: block;\n            content: \'\';\n            height: var(--faderTop);\n            top: 0;\n            left : 0;\n            right: 0;\n            position: absolute;\n            z-index: 1;\n            pointer-events: none;\n            background-image: var( --faderTopGradient );\n        } \n        .fader-bottom-${instanceId} {\n            --faderBottom: 0%;\n            --faderBottomGradient : linear-gradient(180deg, transparent, #ffffff);\n        }\n        .fader-bottom-${instanceId}::after {\n            display: block;\n            content: \'\';\n            height: var(--faderBottom);\n            bottom: 0;\n            left : 0;\n            right: 0;\n            position: absolute;\n            z-index: 1;\n            pointer-events: none;\n            background-image: var( --faderBottomGradient );\n        }  \n    </style>\n    \n    <div data-id="supermarquee-container"\n         style="width: 100%; display: block;pointer-events: all;height: inherit;overflow: hidden;visibility: hidden;">\n        <div data-id="supermarquee-perspective">        \n            <div data-id="supermarquee-outer-wrapper"\n                 style="transform-style: preserve-3d;-webkit-transform-style: preserve-3d;overflow: hidden;box-sizing: content-box;width: inherit;height: inherit;">\n                <div data-id="supermarquee-inner-container"\n                     style="display: inline-block;width: inherit;max-height: 100%;height: inherit;">\n                    <div data-id="supermarquee-item" style="display: block;"></div>\n                    <div data-id="supermarquee-item-clone" style="display: block;"></div>\n                </div>\n            </div>\n        </div>\n    </div>';
function getVertical( data )
{
    const ih = interpolate( tmplVert.toString().trim(), data );
    const tmpl = document.createElement( 'template' );
    tmpl.innerHTML = ih;
    return tmpl;
}

export { getHorizontal, getVertical };
