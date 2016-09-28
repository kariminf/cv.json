(function(){

  var mutex = 0;
  var shared_result = "";

  var files = [];

  document.addEventListener('DOMContentLoaded', function () {
    init();
  });

  function init(){
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", "./vcard.json", true);

    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        process(rawFile.responseText);
      }
    }
    rawFile.send(null);
  }

  function process(json){
    var data = JSON.parse(json);

    document.title = data.name + " " + data.family;

    var rawFile = new XMLHttpRequest();
    rawFile.responseType = 'text';
    var stylePath = "./styles/" + data.style + "/";
    addStyleSheet(stylePath + "style.css");
    rawFile.open("GET", stylePath + "template.htm", true);
    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        process2(data, rawFile.responseText);
      }
    }
    rawFile.send(null);

  }

  function process2(data, template){
    shared_result = processObject("", data, template);
    document.body.innerHTML = shared_result;
    processFiles();

  }

  function processObject(key, data, template){
    var result = template;
    var k = (key !== null && key.length>0)? key + ".": "";
    for (var e in data){
      result = processData(k + e, data[e], result);
    }

    return result;

  }

  function processData(key, value, template){

    var key2 = key.replace(/&\d+/gi, "");

    if (Object.prototype.toString.call(value) === '[object Array]'){
      return processArray(key2, value, template);
    }

    if (typeof value === "object"){
      return processObject(key2, value, template);
    }

    var result = template.replace("@{" + key + "}", value);

    var marker = "@{" + key + "%read}";
    if (result.indexOf(marker) >= 0)
      files.push({"marker": marker, "url": value});

    return result;
  }

  function processArray(key, data, template){

    var begin = "@{" + key + "%set_begin}";
    var idx_begin = template.indexOf(begin) + begin.length;
    var end = "@{" + key + "%set_end}";
    var idx_end = template.indexOf(end);

    if (idx_begin < 0 || idx_end < 0) return template;

    //console.log(key);

    var part = template.substring(idx_begin, idx_end);

    //console.log(part);
    var repl = "";

    for (var i = 0; i < data.length; i++){
      var parti = part.replace("@{" + key + "}", "@{" + key + "&" + i + "}");
      parti = processData(key + "&" + i, data[i], parti);
      repl += parti + "\n";
    }

    part = begin + part + end;

    return template.replace(part, repl);

  }

  function processFiles(){
    while((file=files.pop()) != null){
      readFile(file.marker, file.url);
    }
  }

  function readFile(marker, url){
    var rawFile = new XMLHttpRequest();
    rawFile.responseType = 'text';
    rawFile.open("GET", url, true);

    mutex++;

    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        shared_result = shared_result.replace(marker, rawFile.responseText);
        mutex--;
        if (mutex === 0){
          document.body.innerHTML = shared_result;
        }

      }
    }
    rawFile.send(null);
  }


  function embed(html){
    document.body.innerHTML += html;
  }

  function addStyleSheet(url){
    var cssId = 'myCss';  // you could encode the css path itself to generate id..
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
  }


}());
