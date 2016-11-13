'use strict';
var RSVP = require('rsvp');

var CSSFontLoader = function() {

  var api = {};

  var startTime = new Date().getTime();
  api.load = function(url, oldFontFamilyName, newFontFamilyName) {
    return new RSVP.Promise(
      function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);

        xhr.onreadystatechange = function() {
          if (this.readyState !== 4) return;
          if (this.status !== 200) return;
          
          var styleTag = document.createElement('style');
          var cssSource = '';
          var cssOriginalFonts = '';
          
          cssSource = String(this.responseText).replace(/ *local\([^)]*\), */g, ""); // remove all local references to force remote font file to be downloaded and used
          cssOriginalFonts = cssSource;
          var originalFonts = getCSSFonts(cssSource);
          var fontWeights = getCSSFontWeights(cssSource);
          console.log('originalFonts',originalFonts);
          
          for(var i in originalFonts) {
            var font = originalFonts[i];
            console.log('font?',font);
            var regex = new RegExp('[\'|"]' + font + '[\'|"]'   , 'g');
            var id = String(new Date().getTime());
            cssSource = String(cssSource).replace(regex, '\'' + font + id + '\''); // replace the font family name.
          }
          
          // console.log(fontWeights);
          console.log(cssSource);
          
          styleTag.innerHTML = cssSource;
          document.body.insertBefore(styleTag, document.body.firstChild);
          
          var fonts = getCSSFonts(styleTag.innerHTML);
          //console.log(getCSSUrls(styleTag.innerHTML))

          api.waitForWebfonts(fonts, fontWeights, function() {
            styleTag.innerHTML = cssOriginalFonts;
            resolve(); 
          });
        }

        xhr.send();

      }
    )
  }

  api.waitForWebfonts = function(fonts, weights, callback) {
    console.log('waitForWebfonts', fonts);
    var loadedFonts = 0;
    var testNodes = [];
    for(var i = 0, l = fonts.length; i < l; ++i) {
      for(var w = 0; w < weights.length; w++) {
        var font = fonts[i];
        var weight = weights[w];
        
        console.log('build font test for:', font, weight);
        
        var testNode = createFontTestNode(font, weight);
        testNodes.push({elem:testNode,width:testNode.offsetWidth});
        testNode.style.fontFamily = '\'' + font + '\', sans-serif';          
      }
    }
    setTimeout(function(){
      checkFonts(testNodes, callback);
    },0);
  }
  
  function checkFonts(nodes, callback) {
    // Compare current width with original width
    console.log('nodes???',nodes);
    var pass = true;
    for(var n in nodes){
      var node = nodes[n];
      console.log(n,'node.width',node.width, 'node.elem.offsetWidth',node.elem.offsetWidth)
      if(node.width == node.elem.offsetWidth){
        pass = false;
      }
    }
    if(pass){
      console.log('nodes?',nodes, container);
      for(var n in nodes){
        var node = nodes[n];
        node.elem.parentNode.removeChild(node.elem);
      }
      nodes = [];
      callback();
    } else {
      console.log('loop?', pass);
      setTimeout(function(){
        checkFonts(nodes, callback);
      },50);
    }
  };

  function createFontTestNode(font, weight){
    var node = document.createElement('span');
    node.innerHTML = 'giItT1WQy@!-/#'; // Characters that vary significantly among different fonts
    node.style.position      = 'absolute'; // Visible - so we can measure it - but not on the screen
    // node.style.display = 'block'; // for debug
    // node.style.float = 'left'; // for debug
    node.style.left          = '-10000px';
    node.style.top           = '-10000px';
    node.style.fontSize      = '300px'; // Large font size makes even subtle changes obvious
    // Reset any font properties
    node.style.fontFamily    = 'sans-serif';
    node.style.fontVariant   = 'normal';
    node.style.fontStyle     = 'normal';
    node.style.fontWeight    = weight;
    node.style.letterSpacing = '0';
    document.body.appendChild(node);
    
    return node;
  }
  
  function getCSSFonts(cssSource){
    var fontFamilies = getCSSPropertyValues('font-family', cssSource);
    
    fontFamilies = fontFamilies.map(function(elem) { return elem.replace(/["'\s]+/g, ''); });
    fontFamilies = fontFamilies.sort().filter(function(item, pos, ary) { return !pos || item != ary[pos - 1]; });
    
    return fontFamilies;
    
  }
  
  function getCSSFontWeights(cssSource){
    var weights = removeDuplicates(getCSSPropertyValues('font-weight', cssSource));
    
    return weights.map(function(elem) { return elem.replace(/["'\s]+/g, ''); });
  }
  
  function getCSSUrls(cssSource){
    var regex = new RegExp('url\\b[^\\(]*\\(([\\s\\S]*?)\\)', 'gm');
    var results = null;
    var match; 
    while (match = regex.exec(cssSource)) {
      if(results) {
        results.push(match[1]);
      } else {
        results = [match[1]];
      }
    }
    
    results = results.map(function(elem) { return elem.replace(/["'\s]+/g, ''); });
    results = results.sort().filter(function(item, pos, ary) { return !pos || item != ary[pos - 1]; });
    
    return results;
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
  
  function removeDuplicates(object) {
    return object.sort().filter(function(item, pos, ary) { return !pos || item != ary[pos - 1]; });
  }

  return api;
}

module.exports = CSSFontLoader;