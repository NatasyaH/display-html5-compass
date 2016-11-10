'use strict';
var RSVP = require('rsvp');

var CSSFontLoader = function() {
  var api = {};
  var startTime = new Date().getTime();
  api.load = function(url, oldFontFamilyName, newFontFamilyName) {
    return new RSVP.Promise(
      function (resolve, reject) {
        console.log('start time:',new Date().getTime() - startTime);
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onreadystatechange = function() {
          if (this.readyState !== 4) return;
          if (this.status !== 200) return;
          console.log('time:',new Date().getTime() - startTime);
          var styleTag = document.createElement('style');
          if(oldFontFamilyName && newFontFamilyName) {
            var regexSingleQuote = new RegExp('\'' + oldFontFamilyName, 'g');
            var regexDoubleQuote = new RegExp('"' + oldFontFamilyName, 'g');
            styleTag.innerHTML = String(this.responseText).replace(regex, '\'' + newFontFamilyName); // replace the font family name.
          } else {
            styleTag.innerHTML = String(this.responseText);
          }

          styleTag.innerHTML = String(styleTag.innerHTML).replace(/ *local\([^)]*\), */g, ""); // remove all local references (IE10 doesn't like it when local references are broken)
          document.body.insertBefore(styleTag, document.body.firstChild);
          
          var fonts = getCSSFonts(styleTag.innerHTML);

          api.waitForWebfonts(fonts, function(){
            console.log('time:',new Date().getTime() - startTime);
           resolve(); 
          });
        }

        xhr.send();

      }
    )
  }

  api.waitForWebfonts = function(fonts, callback) {
    console.log('waitForWebfonts', fonts);
    var loadedFonts = 0;
    console.log('checkFont time:',new Date().getTime() - startTime);
    for(var i = 0, l = fonts.length; i < l; ++i) {
      
        (function(font) {
          console.log('checking font:', font);
            var node = document.createElement('span');
            // Characters that vary significantly among different fonts
            node.innerHTML = 'giItT1WQy@!-/#';
            // Visible - so we can measure it - but not on the screen
            node.style.position      = 'absolute';
            node.style.left          = '-10000px';
            node.style.top           = '-10000px';
            // Large font size makes even subtle changes obvious
            node.style.fontSize      = '300px';
            // Reset any font properties
            node.style.fontFamily    = 'sans-serif';
            node.style.fontVariant   = 'normal';
            node.style.fontStyle     = 'normal';
            node.style.fontWeight    = 'normal';
            node.style.letterSpacing = '0';
            document.body.appendChild(node);

            // Remember width with no applied web font
            var width = node.offsetWidth;

            node.style.fontFamily = font + ', sans-serif';

            var interval;
            function checkFont() {
                console.log('checkFont time:',new Date().getTime() - startTime);
                // Compare current width with original width
                if(node && node.offsetWidth != width) {
                    ++loadedFonts;
                    node.parentNode.removeChild(node);
                    node = null;
                }

                // If all fonts have been loaded
                if(loadedFonts >= fonts.length) {
                    if(interval) {
                        clearInterval(interval);
                    }
                    if(loadedFonts == fonts.length) {
                        callback();
                        return true;
                    }
                }
                
            };

            if(!checkFont()) {
                interval = setInterval(checkFont, 50);
            }
        })(fonts[i]);
    }
  }
  
  function getCSSFonts(cssSource){
    var fontFamilies = getCSSPropertyValues('font-family', cssSource);
    
    fontFamilies = fontFamilies.map(function(elem) { return elem.replace(/["'\s]+/g, ''); });
    fontFamilies = fontFamilies.sort().filter(function(item, pos, ary) { return !pos || item != ary[pos - 1]; });
    
    return fontFamilies;
    
  }

  function getCSSPropertyValues(cssProperty, cssSource) {
    var regex = new RegExp(cssProperty+'\\b[^:]*:([\\s\\S]*?);', 'gm');
    var results = null;
    var match; 
    while (match = regex.exec(cssSource)) {
      if(results) {
        results.push(match[1]);
      } else {
        results = [match[1]];
      }
    }
    return results;
  }

  return api;
}