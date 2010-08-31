/*
xmljson v 1.1
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
    parseAttr: function(node) {
        var json = new Object();
        for(i = 0; node.attributes != null && 
                i < node.attributes.length; i++) {
            json[node.attributes[i].localName] = node.attributes[i].nodeValue;
        }
        return json;
    },
    parseNode: function(node) {
       var json = new Object();
       json[node.localName] = new Array();
       if(node.childNodes.length > 0) {
           json[node.localName].push(this.parseAttr(node));

           for(var i = 0; i < node.childNodes.length; i++) {
               json[node.localName].push(this.parseNode(node.childNodes[i]));
           }
       } else {
           json['_value'] = node.nodeValue;
       }
       return json;
    },
    parse:function(xml) {
       if(typeof(xml) == 'string') {
           xml = (new DOMParser()).parseFromString(xml, "text/xml");
       }
       
       var json = new Object();
       json = json.merge(this.parseNode(xml.childNodes[0]));
       return json;
    }
};


if(!Array.prototype.push){
	Array.prototype.push=function(x){
		this[this.length]=x;
		return true
	}
};

if (!Array.prototype.pop){
	Array.prototype.pop=function(){
  		var response = this[this.length-1];
  		this.length--;
  		return response
	}
};

if(!Object.prototype.merge) {
    Object.prototype.merge = function (x) {
        for(var key in x) {
            this[key] = x[key];
        }
        return this;
    }
}
