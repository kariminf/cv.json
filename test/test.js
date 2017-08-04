var page = require('webpage').create();

//page.settings.resourceTimeout = 5000;


page.open('index.html', function(status) {

      //hack for page.open not hooking into phantom.onError
      setTimeout(function() {
          if (status == "success") {
            page.render('examppple.png');
            console.log("success");
          }
          phantom.exit();

      }, 10000);
  });
