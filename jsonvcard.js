/*
This file is part of jsonVCard project;
a Javascript script which allows you to create simple VCard

Copyright (C) 2017 Abdelkrime Aries <kariminfo0@gmail.com>

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

/**
 * Provides the scripts to generate a CV
 *
 * @module jsonvcard
 */
(function(){

  /**
	* This class doesn't do anything, it is here just to force YuiDoc
	* generating the documentation
	* @class JsonVCard
	* @module jsonvcard
	* @constructor
	*/
	function JsonVCard() {
		//This is just to force YuiDoc generating the documentation
	}

  //========================================================
  //                 GLOBAL VARIABLES
  //========================================================

  //Mutual exclusion marker:
  //Can't write the content till all the files are processed
  var mutex = 0;
  //Here, we keep the template and push the information into
  var sharedResult = "";
  //Here, we keep a list of files to load in the end of parsing
  var files = [];
	//This is used to keep the variables defined in the template
	var vars = {};
	//This is used to keep the functions defined in the template
	var fcts = {};

  //========================================================
  //                      INITIALIZERS
  //========================================================


  //When the document is loaded, we call the init() function
  //This will allow us to create the page locally
  document.addEventListener('DOMContentLoaded', function () {
    init();
  });

  //TODO If I want more configurability, I should delete the listener,
  //then pass the URL of vcard.json as a parameter in init(jsonURL)
  //In HTML page, the user have to add just
  // <script>init(theURLof_json);</script> just before </body>

  /**
  * Initialization of process; this method searches for "vcard.json"
  * in the javascript location "jsonvcard.js".
  * Then when retrieved, it sends its content as a string to process(json)
  * Where it will be processed
  * @method init
  */
  function init(){
    var jsonFile = new XMLHttpRequest();
    jsonFile.overrideMimeType("application/json");
    jsonFile.open("GET", "./vcard.json", true);

    jsonFile.onreadystatechange = function() {
      if (jsonFile.readyState === 4 && jsonFile.status == "200") {
        processJSON(jsonFile.responseText);
      }
    }
    jsonFile.send(null);
  }// end init()



  /**
  * This method parses the json content
  * @method processJSON
  * @param  {string} json The content of JSON file
  */
  function processJSON(json){

    //transform the json text into an object
    var data = JSON.parse(json);

    //Change the title of the webpage
    //TODO may be I should give this to user
    document.title = data.perso.name + " " + data.perso.family;

    //Here, we process the theme specified by user
    //It will link the css to the original HTML
    //and recover the URL of the template on which we work
    var templateURL = processTheme(data.theme);

    var templateFile = new XMLHttpRequest();
    templateFile.responseType = 'text';
    templateFile.open("GET", templateURL, true);
    templateFile.onreadystatechange = function() {
      if (templateFile.readyState === 4 && templateFile.status == "200") {
        cookTemplate(data, templateFile.responseText);
      }
    }
    templateFile.send(null);

  }


  /**
   * This function is used to initiate the process of binding the
   * data with the template
   * @method cookTemplate
   * @param  {object} data     the data structure recovered from json file
   * @param  {string} template the HTML template used to create the final HTML code
   */
  function cookTemplate(data, template){
    //After processing all
    sharedResult = getVariables(template);
		sharedResult = getFunctions(sharedResult);
    sharedResult = processObject("", data, sharedResult);
    document.body.innerHTML = sharedResult;
    processFiles();
  }

	/**
	 * Save all template defined variables in a global variable called vars
	 * @param  {string} template the HTML template used to create the final HTML code
	 * @return {string}          the HTML template after deliting variables
	 */
	function getVariables(template){

		var html = template;

		var regex = /@\{([^%]*)%v:([^\}]*)\}/g;
		var match = regex.exec(template);

    while (match != null){
      var result;
			var rep = "@{" + match[1] + "%v:" + match[2] + "}";
      html = html.replace(rep, "");

			//console.log(">>Before JSON parse: ", rep);

			vars[match[1]] = JSON.parse(match[2].trim());

      match = regex.exec(template);
    }

		//console.log(vars);

		return html;
	}

	function getFunctions(template){
		var html = template;

		var regex = /@\{([^%]+)%f:([^\}]+)\}/g;

		var match = regex.exec(template);

    while (match != null){
      var result;
			var rep = "@{" + match[1] + "%f:" + match[2] + "}";
      html = html.replace(rep, "");

			var fct = /([^\(]+)(.*)/g.exec(match[2]);
			if (fct !== null){
				var fctArgs = "";
				if(fct[2].length>2){
					fctArgs += fct[2].slice(1,-1);
				}
				fcts[match[1]] = {
					name: fct[1],
					args: fctArgs
				};
			}

      match = regex.exec(template);
    }

		//console.log("Defined functions:", fcts);

		return html;
	}


  //========================================================
  //                 THEME PROCESSORS
  //========================================================

  /**
   * Process a theme element (json) which has a name and a style
   * @method processTheme
   * @param  {object} theme object of two strings: theme name and style name.
   * It's format is as follows:
   *
   *   {
   *      "name": "",
   *      "style": ""
   *   }
   *
   * @return {string} path to the template constructed from the theme name, or
   * the dafault one
   */
  function processTheme(theme){

    //Set defaults
    var themePath = "./themes/default/";
    var style = "default.css";

    //Verify if the values are defined by user
    if (typeof theme.name !== 'undefined'){
      themePath = "./themes/" + theme.name + "/";
      if (typeof theme.style !== 'undefined') style = theme.style + ".css";
    }

    //Call a function to link the stylesheet with the HTML content
    addStyleSheet(themePath + style);

    //Return the path to the template featuring this theme
    return themePath + "template.htm";
  }

  /**
   * Link a stylsheet to the current document
   * @method addStyleSheet
   * @param {string} url the URL of the tageted CSS
   */
  function addStyleSheet(url){
    var cssId = 'myCss';
    if (!document.getElementById(cssId))
    {
      var head  = document.getElementsByTagName('head')[0];
      var link  = document.createElement('link');
      link.id   = cssId;
      link.rel  = 'stylesheet';
      link.type = 'text/css';
      link.href = url;
      link.media = 'all';
      head.appendChild(link);
    }
    //TODO if cssId exists; just change the href attribute
    //This will allow the change of CSS directly from user side
  }


  //========================================================
  //                 TEMPLATE-DATA MERGERS
  //========================================================


  /**
   * Process an object which contains many elements in it
   * @method processObject
   * @param  {string} key      the name of this object, for example
   * <pre>
   *   "perso": {
   *      "name": "Karim",
   *      "family": "Aries"
   *   }
   * </pre>
   * "perso" is the key, and the object is the data
   * @param  {object} data     the object to be processed
   * @param  {string} template the HTML templated used to push the data
   * @return {string}          the HTML content after merging with the data
   */
  function processObject(key, data, template){
    var html = template;
    var pkey = (key !== null && key.length > 0)? key + ".": "";//parent key
    for (var ekey in data){ //element key
      html = processData(pkey + ekey, data[ekey], html);
    }

    return html;
  }


  /**
   * Process the data of an object. It detects if the data is
   * an object, a list of elements or a simple element
   * @method processData
   * @param  {string} key      the name or key of the element; for example "perso.name"
   * @param  {object} value    the value of the data: it may be an object, a list, or a simple element.
   * In our example, it is a simple string: "Karim"
   * @param  {string} template the HTML template used to push the data
   * @return {string}          the HTML content after merging with the data
   */
  function processData(key, value, template){

    //Special functions:
    //This can lead to a disfunction if the function doesn't exist
    //The template designer must know what special functions are there
    eval("var marker = /@\{" + key + "%s([^\}]*)\}/gi");

		var match = marker.exec(template);

		var result = template;

    while (match != null){
			var func = key;
			var funcArgs = "";
			if(match[1].length>0){
				var fctM = /\.(.+)/g.exec(match[1]);
				if (fctM === null || ! (fctM[1] in fcts)){
					match = marker.exec(template);
					continue;
				}
				func = fcts[fctM[1]].name;
				funcArgs = ", " + "'@{" + key + "%s" + match[1] + "}', " + fcts[fctM[1]].args;
			}

			//console.log("function:", func, "(", value, ", ",  funcArgs, ")");
			eval('result = process_' + func + '(value, template' + funcArgs + ');');

      match = marker.exec(template);
    }

    /*if (template.indexOf(marker) >= 0){
      var result;
      eval('result = process_' + key + '(value, template);');
      return result;
    }*/

    //-----------------------------------
    //Here, the value is an array object
    //-----------------------------------
    //
    //If the element is an array, we call a special function to process it
    if (Object.prototype.toString.call(value) === '[object Array]'){
      return processArray(key, value, result);
    }

    //-----------------------------------
    //Here, the value is a nested object
    //-----------------------------------
    //
    //If it is an object, we call another function
    if (typeof value === "object"){
      return processObject(key, value, result);
    }

    //-----------------------------------
    //Here, the value is a simple element
    //-----------------------------------

    //If the element is meant to be an URL into some other file
    //we add this file to the files list to be processed lately
    {
			var marker = "@{" + key + "%r}";
			if (result.indexOf(marker) >= 0) files.push({"marker": marker, "url": value});
		}

    //We create a RegEx element to replace parts of the template
    //with the values specified in the data
    var exp = eval("/\@\{" + key + "\}/g");
    return result.replace(exp, value);

    //There is no if-else between these two, because the template
    //designer can recover the content of a file and show its URL
    //in the same time
  }

  /**
   * Process the data of an array.
   * It recovers the begining and ending of this array in the template.
   * Then, it pushes each element of the array into that area.
   * @method processArray
   * @param  {string} key      the name or key of the array; for example "skill"
   * @param  {object} data     the value of the data: it may be an object, a list, or a simple element.
   * In our example, it is a simple string: "javascript"
   * @param  {string} template the HTML template used to push the data
   * @return {string}          the HTML content after merging with the data
   */
  function processArray(key, data, template){

    //Searching for the area to be replaced in the template
    var begin = "@{" + key + "%bb}"; //block begins
    var idx_begin = template.indexOf(begin) + begin.length;
    var end = "@{" + key + "%be}";//block ends
    var idx_end = template.indexOf(end);

    //console.log(end + " => " +  idx_end);

    //If there is no area defined for this array, we return the template itself
    if (idx_begin < 0 || idx_end < 0) return template;

    //console.log(key);

    //Extract the arry area from the template
    var arrayHTML = template.substring(idx_begin, idx_end);

    //console.log(part);
    var replacement = ""; // This will
		var exp = eval("/\@\{" + key + "([^\}]*)\}/gi");
    for (var i = 0; i < data.length; i++){
      //To each element, we attribute a key which is the key of the array
      //combined with its rank in the array
      var elementHTML = arrayHTML.replace(exp, "@{" + key + "&" + i + "$1}");
      elementHTML = processData(key + "&" + i, data[i], elementHTML);
      replacement += elementHTML + "\n";
    }

    //We add the begining and ending markers to the to-be-replaced string
    arrayHTML = begin + arrayHTML + end;

    return template.replace(arrayHTML, replacement);

  }


  //========================================================
  //                 FILES PROCESSORS
  //========================================================

  /**
   * Process the files stored in a global variable (files) while processing
   * the json data and the template
   * @method processFiles
   */
  function processFiles(){
		//console.log("template before adding files\n" + sharedResult);
    while((file=files.pop()) != null){
			//console.log("file marker: ", file.marker, ", url= ", file.url);
      readFile(file.marker, file.url);
    }
  }

  /**
   * Read a file and push the content into its reserved area in the template.
   * Here, the content is pushed into a global variable containing the template.
   * We can't use the template as an argument, nor return the merged html, because
   * the files call is asynchronious. <br>
   * A mutex is used so the html code is pushed into the browser once all the
   * files are being processed
   * @method readFile
   * @param  {string} marker the marker which defines where in the template the content
   * should be pushed
   * @param  {string} url    the URL where to find the file
   */
  function readFile(marker, url){
    var rawFile = new XMLHttpRequest();
    rawFile.responseType = 'text';
    rawFile.open("GET", url, true);

    //Every time we call a file, we increment the mutex
    mutex++; //how much files are in process
    //PS: it's not "Everytime", it's "Every time"
    //(for those who likes to correct others) :) :) :) :)

    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4) {
        var replacement = "";

        if (rawFile.status == "200") replacement = rawFile.responseText;
        //If there is a problem recovering the file, we just replace the marker
        //with nothing
        sharedResult = sharedResult.replace(marker, replacement);

        mutex--;
        if (mutex === 0){
          //When all files are being processed: browser!! behold, the code is coming
          document.body.innerHTML = sharedResult;
        }

      }
    }
    rawFile.send(null);
  }

  //========================================================
  //                 SPECIAL FUNCTIONS
  //========================================================

  /**
   * Special function to process social media links
   * @method process_social
   * @param  {object} data     an object containing the name of the social network as a key and
   * the link as a value
   * @param  {string} template the HTML template to be replaced
   * @return {string}          the HTML content after replacement
   */
  function process_social(data, template){
    var replacement = "";
    for (var ekey in data){ //element key
      replacement += '<a href="' + data[ekey] + '" id="' + ekey;
      replacement += '" target="_blank"></a>';
    }
    return template.replace("@{social%s}", replacement);
  }


	function process_date(date, template, marker, pattern, months){
    //if(date.match(/[\d]{4}/)) return template;

		//console.log(marker + ">>>" + date);

		var match = /([\d]{4})([\d]{2})?([\d]{2})?/g.exec(date);

		if(!match) return template.replace(marker, date);

		var yyyy = match[1];
		var mm = (match[2])? match[2]: "";
		var dd = (match[3])? match[3]: "";

		//Process the month
		if (mm.length > 0){
			var mmInt = parseInt(mm);
			if(mm < 1 || mm > 12){
				mm = "01";
			} else {
				var monthDef = Object.prototype.toString.call(months);
				if (monthDef === '[object Array]' && months.length > 11){
					mm = months[mmInt-1];
				}
			}
		}

		//Process the year
		pattern = pattern.replace("yyyy", yyyy);
		pattern = pattern.replace("yy", yyyy.slice(2));

		pattern = pattern.replace("mm", mm);
		pattern = pattern.replace("dd", dd);

		//console.log("date = ", pattern);

    return template.replace(marker, pattern);
  }

	function process_theme(value, template, marker, type){
		//TODO other types
		var rep = ' <div class="barc">';
		var perc = parseInt(value) * 10; //persontage (scale = 10)
		rep += '<div class="bar" style="width:' + perc + '%">'
		rep += '</div></div>'; //barc

		console.log("theme: " + rep);
		return template.replace(marker, rep);
	}

}());

// THAT'S ALL!! ... THANK YOU FOR READING
