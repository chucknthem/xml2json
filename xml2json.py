#/usr/bin/env python
"""
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
"""

from xml.dom import minidom
import re


def parse(xml, attr2child=False):
  """Parse.

  @param xml - minidom Document or an xml string.
  @param attr2child - Convert attributes to children.
  """
    
  if type(xml) is str:
    xml = minidom.parseString(xml)

  json = {}
  if xml.nodeType == xml.DOCUMENT_NODE: # Root document.
    name = xml.childNodes[0].localName
    json[name] = parse(xml.childNodes[0], attr2child=attr2child)
    return json
  elif xml.nodeType == xml.ELEMENT_NODE: # Element.
    if attr2child:
      for attr in xml.attributes.keys():
        json[attr] = xml.getAttribute(attr)
    else:
      json["@attributes"] = {}
      for attr in xml.attributes.keys():
        json["@attributes"][attr] = xml.getAttribute(attr)
  elif xml.nodeType == xml.TEXT_NODE: # Text.
    json = xml.nodeValue
    return json

  # Parse Children.
  if xml.hasChildNodes():
    for node in xml.childNodes:
      child = parse(node, attr2child=attr2child)
      if node.nodeType == node.ELEMENT_NODE:
        name = node.localName
        if name in json:
          if type(json[name]) is not list:
            json[name] = [json[name]]
          json[name].append(child)
        else:
          json[name] = child
      elif node.nodeType == node.TEXT_NODE:
        name = "@text"
        text = re.sub(r"^\s+", "", child)
        text = re.sub(r"\s+$", "", text)
        if text != "":
          json[name] = text

  if len(xml.attributes.keys()) == 0 and len(xml.childNodes) == 1 and "@text" in json:
    json = json["@text"]

  return json
