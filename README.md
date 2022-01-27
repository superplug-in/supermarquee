![SuperMarquee](./res/github/SuperMarqueeLogoWhiteBg.png)

**SuperMarquee** is the super smooth marquee web component for your web applications. 

[![npm](https://img.shields.io/npm/dt/sp-supermarquee.svg)](https://npmjs.com/package/sp-supermarquee)
[![npm](https://img.shields.io/npm/dm/sp-supermarquee.svg)](https://npmjs.com/package/sp-supermarquee)
[![jsDelivr Hits](https://data.jsdelivr.com/v1/package/npm/sp-supermarquee/badge?style=rounded)](https://www.jsdelivr.com/package/npm/sp-supermarquee)

## Showcase

Get some inspiration of what is possible with the following showcase demos.

- [Newsticker](https://superplug.in/supermarquee/showcase/breakingnews)
- [eCommere](https://superplug.in/supermarquee/showcase/ecommerce)
- [3D Hero](https://superplug.in/supermarquee/showcase/starwars)

## Features

The most popular features of SuperMarquee:

&nbsp;&nbsp;✓&nbsp; Fully Responsive. Perfect for every resolution <br>
&nbsp;&nbsp;✓&nbsp; Easily customizable via CSS <br>
&nbsp;&nbsp;✓&nbsp; Zero dependencies <br>
&nbsp;&nbsp;✓&nbsp; Includes a vanilla Javascript version as well as a jQuery plugin  <br>
&nbsp;&nbsp;✓&nbsp; Lightweight, simple yet powerful with no additional dependencies <br>
&nbsp;&nbsp;✓&nbsp; Hardware accelerated for high performance <br>
&nbsp;&nbsp;✓&nbsp; Extremely flexible. Endless possibilities <br>
&nbsp;&nbsp;✓&nbsp; Works on every modern device <br>
&nbsp;&nbsp;✓&nbsp; Supports 3D transformations <br>

## Examples

List of single feature examples

- [Horizontal Scrolling](https://superplug.in/supermarquee/demo/1)
- [Vertical Scrolling](https://superplug.in/supermarquee/demo/2)
- [Ping Pong](https://superplug.in/supermarquee/demo/3)
- [Perspective X axis](https://superplug.in/supermarquee/demo/4)
- [Perspective dynamic](https://superplug.in/supermarquee/demo/5)
- [Styling](https://superplug.in/supermarquee/demo/6)
- [Dynamic Scroll Speed](https://superplug.in/supermarquee/demo/7)
- [Mixed Content](https://superplug.in/supermarquee/demo/8)
- [Position](https://superplug.in/supermarquee/demo/9)
- [Live Updates](https://superplug.in/supermarquee/demo/10)
- [Performance](https://superplug.in/supermarquee/demo/11)
- [Right-To-Left](https://superplug.in/supermarquee/demo/12)

## Documentation

- [Getting Started with Javascript](https://superplug.in/supermarquee/docs#start-javascript)
- [Getting Started with jQuery](https://superplug.in/supermarquee/docs#start-jquery)
- [API Reference](https://superplug.in/supermarquee/docs#instantiation)
- [Changelog](https://superplug.in/supermarquee/docs#changelog)
- [Examples](https://superplug.in/supermarquee#demos)

## Get Started
### Install with npm

Run the following command in your terminal
```
npm install sp-supermarquee
```

You can also load the bundle directly from [jsDelivr](https://www.jsdelivr.com/package/npm/sp-supermarquee).

### Create a placeholder

Create an HTML placeholder

```html
<div id="supermarquee"></div>
```

### Import SuperMarquee
```js
import SuperMarquee from "sp-supermarquee";
```

### Initialize 

Now turn your placeholder into a SuperMarquee instance and let the magic begin.
```js
const container = document.getElementById('example');
const sm = new SuperMarquee(container, {
  content : "SuperMarquee by SuperPlug.in is Super!!!"
});
```

## Support

We provide support for developers working with commercial version by email. Please write an email to [support@superplug.in](mailto://support@superplug.in) _(please include your license key for verification)_.

If you use a non-commercial version then please ask your tagged question on [StackOverflow](https://stackoverflow.com/questions/tagged/supermarquee).

## License

SuperMarquee is a commercial software with two licenses available:

- Free for non-commercial purposes such as teaching, academic research, and evaluation. [Read it here](https://superplug.in/supermarquee#pricing).
- Commercial license with support and maintenance included. See [pricing plans](https://superplug.in/supermarquee#pricing).
