(function(){

  var mutex = 0;
  var result = "";

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
    result = template;
    for (var e in data){
      if (typeof data[e] !== "string") continue;
      result = result.replace("@{" + e + "}", data[e]);
      if (result.indexOf("@{" + e + "%read}") >= 0)
        readFile(e, data[e]);
    }
    document.body.innerHTML = result;
  }


  function readFile(name, url){
    var rawFile = new XMLHttpRequest();
    rawFile.responseType = 'text';
    rawFile.open("GET", url, true);

    mutex++;

    rawFile.onreadystatechange = function() {
      if (rawFile.readyState === 4 && rawFile.status == "200") {
        result = result.replace("@{" + name + "%read}", rawFile.responseText);
        mutex--;
        if (mutex === 0){
          document.body.innerHTML = result;
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
