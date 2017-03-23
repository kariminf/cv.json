# jsonVCard

[![Project](https://img.shields.io/badge/Project-jsonVCard-FDEE00.svg)](https://kariminf.github.io/jsonVCard/)
[![Version](https://img.shields.io/badge/Version-0.0.1-FDEE00.svg)](https://github.com/kariminf/jsonVCard/releases)
[![License](https://img.shields.io/badge/License-Apache_2.0-FDEE00.svg)](http://www.apache.org/licenses/LICENSE-2.0)

By introducing information inside a json file, you can generate a Vcard webpage (CV).
The goal of this project is:
* Generate dynamically a CV from a json file, without being forced to generate static webpages everytime you modify an information.
* Modify the style of your CV using a template and a stylesheet.

## How it works

All you have to do is creating an HTML page such:
```html
<html>
<head>
  <meta charset="UTF-8">
  <title>Test portfelio</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <script type="text/javascript" src="jsonvcard.js" ></script>
</head>
<body>
</body>
</html>
```
The json file *jsoncard.js* must be in the same folder as *jsonvcard.js*. It contains information about the one for whom we want to generate a CV.
This is an enumeration of the different entries:
```json
{
  "style": "the style name",
  "name":"first name",
  "family":"family name ()",
  "photo": "a link to the profile picture",
  "birthday": "the birthday, must be: yyyymmdd",
  "address": "The address ",
  "tel": ["phone number 1", "phone number 2"],
  "email": ["email1", "email2"],
  "title": "The title of the CV owner",
  "bio": "a link to a file containing the biography",
  "social": {
    "facebook": "fb-acc",
    "twitter": "twit-acc",
    "linkedin": "lin-acc",
    "gplus": "gp-acc"
  },
  "exp": [ // a table of experiences
    {
      "from": "yyyymmdd",
      "to": "yyyymmdd",
      "job": "exp1-job",
      "org": "organization",
      "resp": [
        "responsability 1",
        "responsability 2"
      ],
      "desc": "url-description"
    },
    {
      "from": "yyyymmdd",
      "to": "yyyymmdd",
      "job": "exp2-job",
      "org": "organization2",
      "resp": [
        "responsability 2_1",
        "responsability 2_2"
      ],
      "desc": "url-description2"
    }
  ],
  "educ": [ //a table of education
    {
      "from": "educ1-from",
      "to": "educ1-to",
      "inst": "Institution1",
      "desc": "url-description1"
    }
  ],
  "pub": [ // a table of publications
    {
      "title": "publication1 title",
      "publisher": "publisher1",
      "date": "yyyymmdd",
      "url": "url1",
      "authors": [
        "author 1-1",
        "author 1-2"
      ],
      "desc": "url-description1"
    }

  ],
  "skill": [ // a table of skills
    {
      "title": "skill1",
      "mark": 10
    }
  ],
  "lang": [ // a table of languages
    {
      "name": "lang-name",
      "prof": 5
    }
  ]

}
```

Try it [here](https://kariminf.github.io/jsonVCard/)

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
