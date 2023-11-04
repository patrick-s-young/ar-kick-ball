# ar-kick-ball
AR Kick Ball - WebXR ARCore-enabled game for mobile browser.

## Status Update:
 Having to switch to my Google Pixel every time I want to test an update is a cumbersome process. So I am working on a 'emulation mode' that allows for faster iteration.

[https://github.com/patrick-s-young/ar-kick-ball/assets/42591798/fc09dadb-8e27-4741-9691-b2d438fb7600](https://github.com/patrick-s-young/ar-kick-ball/assets/42591798/7af9d692-98da-4129-8a50-611520651758)


Project created with [webxr-arcore-boilerplate](https://github.com/patrick-s-young/webxr-arcore-boilerplate)
## Running Locally

Make sure you have [Node.js](http://nodejs.org/) installed.

```sh
git clone https://github.com/patrick-s-young/ar-kick-ball.git # or clone your own fork
cd ar-kick-ball
yarn
yarn start
```
## Device Requirements
See Google's [ARCore supported devices](https://developers.google.com/ar/devices).

- Set your ARCore-supported Android device to developer mode.
- Plug your device into your workstation via USB
- On your workstation, open a Chrome broswe and set the location to: `chrome://inspect/#devices`
- Find your device and click the link to launch the dev console
  
## Built With

* [Three.js](https://www.npmjs.com/package/three) - An easy to use, lightweight, cross-browser, general purpose 3D library.
* [webpack](https://webpack.js.org/) - static module builder.
* [maximo](https://www.mixamo.com/) - 3D characters, skeletal rigs, and animations.

## Authors

* **Patrick Young** - [Patrick Young](https://github.com/patrick-s-young)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

