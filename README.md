# json-vcard

[![NPM](https://nodei.co/npm/json-vcard.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/json-vcard/)

[![Project](https://img.shields.io/badge/Project-jsonVCard-FDEE00.svg)](https://kariminf.github.io/json-vcard/)
[![License](https://img.shields.io/badge/License-Apache_2.0-FDEE00.svg)](http://www.apache.org/licenses/LICENSE-2.0)
[![Version](https://img.shields.io/npm/v/json-vcard.svg)](https://www.npmjs.com/package/json-vcard)
[![Travis](https://img.shields.io/travis/kariminf/json-vcard.svg)](https://travis-ci.org/kariminf/json-vcard)
[![npm](https://img.shields.io/npm/dt/json-vcard.svg)](https://www.npmjs.com/package/json-vcard)

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
1. The script will download the css specified in the index file and apply it to the documznt
1. It will download the template into a shared string
1. The script will then merge the template and the information in the json file
1. If there are some files, the script will download them asynchronously
1. When the script receive response from a file it will merge its content into the template
1. Finally, when all the wanted files has responded, the script pushed the merged content into the body of the page

Check [the API](https://kariminf.github.io/json-vcard/docs/docs)

## How to use

By introducing information inside a json file ("vcard.json"), you can generate a Vcard webpage (CV).
This can be done using javascript ("jsonvcard.js") which is called as follows:
```html
<html>
<head>
  <meta charset="UTF-8">
  <title>Test portfelio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="text/javascript" src="<link/to/jsonvcard.js>" ></script>
</head>
<body>
  <script>
    JsonVCard.setStyleName("violet")
      .setRelativePath("link/to/helper/files")
      .setThemesPath("link/to/the/theme")/*Not affected by setRelativePath*/
      .setThemeName("theme-name")/*must come after setThemesPath*/
      .setFooter("link/to/footer.htm") /*Not affected by setRelativePath*/
      .process("link/to/vcard.json");/*Not affected by setRelativePath*/
  </script>
</body>
</html>
```
The json file ("vcard.json") contains information about the one for whom we want to generate a CV.
it is self explanatory and easy to fill.

For API documentation, check [this YuiDoc generated documentation](https://kariminf.github.io/json-vcard/docs/docs/)

### Download from Github

* Download the last release [HERE](/releases/latest)
* Extract the files in your project
* Modify index.html
* Modify vcard.json

### Download from Npm

In your project tree, tape this command line to download the latest version to "node_modules":
```bash
npm install json-vcard
node node_modules/json-vcard/install.js
```
All needed files will be copied to the root (where the shell is positioned)
* Modify index.html
* Modify vcard.json

## Community

All the C's are here:

* [CODE_OF_CONDUCT](./CONTRIBUTING.md) : How to contribute to this project
* [CODE_OF_CONDUCT.md](./CODE_OF_CONDUCT.md) : Some recommendations must be followed for a healthy development environment.
* Changelog: [CHANGELOG.md](./CHANGELOG.md) : Changes in every version
* Credits: [CREDITS.md](./CREDITS.md) : List of contributors

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
