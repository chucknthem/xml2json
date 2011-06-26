/*
   xmljson v 2.0
   Copyright (c) 2010 Charles Ma 

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
   THE SOFTWARE.

*/

XML2JSON={
  parse: function(xml, options) {
    /**
     * @param options:
     *  - attr2child - Convert attributes to children.
     */
    if (!options)
      options = {}

    if(typeof(xml) == "string") {
      xml = (new DOMParser()).parseFromString(xml, "text/xml");
    }

    var json = {}
    if (xml.nodeType == 9) { // Root document.
      name = xml.childNodes[0].localName;
      json[name] = this.parse(xml.childNodes[0], options);
      return json;
    } else if (xml.nodeType == 1) { // Element.
      if (xml.hasAttributes()) {
        if (options["attr2child"] == true) {
          for (var i = 0; i < xml.attributes.length; i++) {
            json[xml.attributes[i].nodeName] = xml.attributes[i].nodeValue;
          }
        } else {
          json["@attributes"] = {};
          for (var i = 0; i < xml.attributes.length; i++) {
            json["@attributes"][xml.attributes[i].nodeName] = xml.attributes[i].nodeValue;
          }
        }
      }
    } else if (xml.nodeType == 3) { // Text.
      json = xml.nodeValue;
      return json;
    }

    // Parse Children.
    if (xml.hasChildNodes()) {
      for (var i = 0; i < xml.childNodes.length; i++) {
        var child = this.parse(xml.childNodes[i], options);
        if (xml.childNodes[i].nodeType == 1) {
          // Child nodes.
          var name = xml.childNodes[i].localName;
          if (json[name]) {
            // Duplicate name, so we make it an array.
            if (!(json[name] instanceof Array)) {
              var tmp = json[name];
              json[name] = [tmp];
            }
            json[name].push(child);
          } else {
            json[name] = child;
          }
        } else if (xml.childNodes[i].nodeType == 3) {
          // Child text. We should check if it's empty and discard empty text.
          var name = "@text";
          var text = child.replace(/^\s+/, '').replace(/\s+$/, '');
          if (text != "")
            json[name] = text;
        }
      }
      // We treat the child node of a root node with no attributes and only a 
      // text child node to be just the text itself.
      if (!xml.hasAttributes() && xml.childNodes.length == 1 && 
          json["@text"])
        json = json["@text"];
    }
    return json;
  }
}


if(!Array.prototype.push){
  Array.prototype.push=function(x){
    this[this.length] = x
      return true;
  }
}

if (!Array.prototype.pop){
  Array.prototype.pop=function(){
    var response = this[this.length-1]
      this.length--;
      return response;
  }
}

if(!Object.prototype.merge) {
  Object.prototype.merge = function (x) {
    for(var key in x) {
      this[key] = x[key];
    }
    return this;
  }
}
