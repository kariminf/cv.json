# jsonVCard

[![Project](https://img.shields.io/badge/Project-jsonVCard-FDEE00.svg)](https://kariminf.github.io/json-vcard/)
[![License](https://img.shields.io/badge/License-Apache_2.0-FDEE00.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Version](https://img.shields.io/badge/Version-0.5.0-FDEE00.svg)](https://github.com/kariminf/json-vcard/releases)

When you want to create a VCard (CV website), you have to put your information into a static HTML file (if you don't want a server based one).
Then, if you want to change the design, sometimes changing CSS is not enough; you have to change HTML too.

So, this project meant to:
* Create a client side VCard
* Separate information and design.
* Create many themes

As consequences:
* The application can be hosted widely and doesn't need any special
* The page is built locally and dynamically in the user side
* The themes can be changed easily without
* Most importantly, the user doesn't have to program anything


The goal of this project is:
* Generate dynamically a CV from a json file, without being forced to generate static webpages everytime you modify an information.
* Modify the style of your CV using a template and a stylesheet.

See a demo [here](https://kariminf.github.io/json-vcard/)

## How it works

By introducing information inside a json file ("vcard.json"), you can generate a Vcard webpage (CV).
This can be done using javascript ("jsonvcard.js") which is called as follows:
```html
<html>
<head>
  <meta charset="UTF-8">
  <title>Test portfelio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="text/javascript" src="jsonvcard.js" ></script>
</head>
<body>
  <script>JsonVCard.init("./vcard.json");</script>
</body>
</html>
```
The json file ("vcard.json") must be in the same folder as the script ("jsonvcard.js").
It contains information about the one for whom we want to generate a CV.
it is self explanatory and easy to fill.

For API documentation, check [this YuiDoc generated documentation](https://kariminf.github.io/json-vcard/docs/)

## Credits

* Me: for may hair became as white as snow programming this
* [Zlatko Najdenovski](https://www.iconfinder.com/zlaten): for the social media icons called  
[logotypes](https://www.iconfinder.com/iconsets/logotypes), licenced under [CC-BY-3.0](https://creativecommons.org/licenses/by/3.0/)
* https://commons.wikimedia.org/wiki/File:Phone_icon_rotated.svg

## License

Copyright (C) 2016-2017 Abdelkrime Aries

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
