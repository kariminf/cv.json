# jsonVCard

[![Project](https://img.shields.io/badge/Project-jsonVCard-FDEE00.svg)](https://kariminf.github.io/json-vcard/)
[![License](https://img.shields.io/badge/License-Apache_2.0-FDEE00.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Version](https://img.shields.io/badge/Version-0.5.0-FDEE00.svg)](https://github.com/kariminf/json-vcard/releases)

When you want to create a VCard (CV website), you have to put your information into a static HTML file (if you don't want a server based one).
Then, if you want to change the design, sometimes changing CSS is not enough; you have to change HTML too.
So, this project meant to:
* Create a CV webpage without needing to configure servers.
* Facilitate the update of informations without breaking the page's structure.
* Make it easy to select and create themes.

Technically speaking:
* Create a client side VCard.
* Separate information and design.
* Create many themes.

As consequences:
* The application can be hosted widely and doesn't need any special server configuration
* The page is built locally and dynamically in the user's side
* The themes can be changed easily without
* Most importantly, the user doesn't have to program anything

See a demo [here](https://kariminf.github.io/json-vcard/)

## How it works

The HTML file doesn't contain anything at all. It just calls for the script which will do the calls.

![GitHub Logo](/docs/img/json-vcard.png)

1. The browser will download the index file
1. Then, it downloads the script
1. The script will download the json file, and wait till it is fully downloaded to pass to the next step.
1. It will looks for the theme template (html) and the style (css) specified in the json file
1. The style is applied to the document
1. The script will then merge the template and the information in the json file
1. If there are some files, the script will download them asynchronously
1. When the script receive response from each wanted file it will merge its content into the template
1. Finaly, when all the wanted files has responded, the script pushed the merged content into the body of the page

# How to use

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

For API documentation, check [this YuiDoc generated documentation](https://kariminf.github.io/json-vcard/docs/docs/)

## Credits

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
