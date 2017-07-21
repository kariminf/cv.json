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
(function(){

  if ( typeof module === "object" && module && typeof module.exports === "object" ) {
    module.exports = this;
  } else {
    window.jsonVCard = this;
  }

  //========================================================
  //                 INDEX
  //                 =====
  // Topic                                        Line
  // ------------------                           ----------
  // Global variables                             40
  // Initializers                                 53
  // Theme processors                             135
  // Template-data mergers                        193
  // Files processors                             328
  // Special functions
  //========================================================


  //========================================================
  //                 GLOBAL VARIABLES
  //========================================================

  //Mutual exclusion marker:
  //Can't write the content till all the files are processed
  var mutex = 0;
  //Here, we keep the template and push the information into
  var shared_result = "";
  //Here, we keep a list of files to load in the end of parsing
  var files = [];


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
   * @param  {object} data     the data structure recovered from json file
   * @param  {string} template the HTML template used to create the final HTML code
   */
  function cookTemplate(data, template){
    //After processing all
    shared_result = processObject("", data, template);
    document.body.innerHTML = shared_result;
    processFiles();
  }


  //========================================================
  //                 THEME PROCESSORS
  //========================================================

  /**
   * Process a theme element (json) which has a name and a style
   * @param  {object} theme object of two strings: theme name and style name.
   * It's format is as follows:
   * <pre>
   *   {
   *      "name": "",
   *      "style": ""
   *   }
   * </pre>
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
    var marker = "@{" + key + "%s}";

    if (template.indexOf(marker) >= 0){
      var result;
      eval('result = process_' + key + '(value, template);');
      return result;
    }

    //Used with arrays and objects
    //If this object is an element of an array, its key will be
    //coded as <array-key>&<rank-in-the-array>
    //So, if this object is an object or array, it has to be processed
    //without its rank
    var key2 = key.replace(/&\d+/gi, "");

    //console.log("<<" + key + "==>" + key2);

    //-----------------------------------
    //Here, the value is an array object
    //-----------------------------------
    //
    //If the element is an array, we call a special function to process it
    if (Object.prototype.toString.call(value) === '[object Array]'){
      return processArray(key2, value, template);
    }

    //-----------------------------------
    //Here, the value is a nested object
    //-----------------------------------
    //
    //If it is an object, we call another function
    if (typeof value === "object"){
      return processObject(key2, value, template);
    }

    //-----------------------------------
    //Here, the value is a simple element
    //-----------------------------------

    //If the element is meant to be an URL into some other file
    //we add this file to the files list to be processed lately
    marker = "@{" + key + "%r}";
    if (template.indexOf(marker) >= 0) files.push({"marker": marker, "url": value});


    //We create a RegEx element to replace parts of the template
    //with the values specified in the data
    var exp = eval("/\@\{" + key + "\}/g");
    return template.replace(exp, value);

    //There is no if-else between these two, because the template
    //designer can recover the content of a file and show its URL
    //in the same time
  }

  /**
   * Process the data of an array.
   * It recovers the begining and ending of this array in the template.
   * Then, it pushes each element of the array into that area.
   * @param  {string} key      the name or key of the array; for example "skill"
   * @param  {object} data     the value of the data: it may be an object, a list, or a simple element.
   * In our example, it is a simple string: "javascript"
   * @param  {string} template the HTML template used to push the data
   * @return {string}          the HTML content after merging with the data
   */
  function processArray(key, data, template){

    //Searching for the area to be replaced in the template
    var begin = "@{" + key + "%sb}";
    var idx_begin = template.indexOf(begin) + begin.length;
    var end = "@{" + key + "%se}";
    var idx_end = template.indexOf(end);

    //console.log(end + " => " +  idx_end);

    //If there is no area defined for this array, we return the template itself
    if (idx_begin < 0 || idx_end < 0) return template;

    //console.log(key);

    //Extract the arry area from the template
    var array_html = template.substring(idx_begin, idx_end);

    //console.log(part);
    var replacement = ""; // This will

    for (var i = 0; i < data.length; i++){
      //To each element, we attribute a key which is the key of the array
      //combined with its rank in the array
      var element_html = array_html.replace("@{" + key + "}", "@{" + key + "&" + i + "}");
      element_html = processData(key + "&" + i, data[i], element_html);
      replacement += element_html + "\n";
    }

    //We add the begining and ending markers to the to-be-replaced string
    array_html = begin + array_html + end;

    return template.replace(array_html, replacement);

  }


  //========================================================
  //                 FILES PROCESSORS
  //========================================================

  /**
   * Process the files stored in a global variable (files) while processing
   * the json data and the template
   */
  function processFiles(){
    while((file=files.pop()) != null){
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
        shared_result = shared_result.replace(marker, replacement);

        mutex--;
        if (mutex === 0){
          //When all files are being processed: browser!! behold, the code is coming
          document.body.innerHTML = shared_result;
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

}());

// THAT'S ALL!! ... THANK YOU FOR READING
