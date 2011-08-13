XML2JSON =
  parse: (xml, attr2child = false) ->
    ###
    @param attr2child - Convert attributes to children.
    ###
    if typeof xml == "string"
      xml = new DOMParser().parseFromString xml, "text/xml"

    json = {}
    console.log attr2child
    if xml.nodeType == 9  # Root document.
      name = xml.childNodes[0].localName
      json[name] = this.parse xml.childNodes[0], attr2child
      return json
    else if xml.nodeType == 1  # Element.
      if xml.hasAttributes()
        if attr2child
          json[attr.nodeName] = attr.nodeValue for attr in xml.attributes
        else
          json["@attributes"] = {}
          json["@attributes"][attr.nodeName] = attr.nodeValue for attr in xml.attributes
    else if xml.nodeType == 3 # Text.
      json = xml.nodeValue
      return json

    # Parse Children.
    if xml.hasChildNodes()
      for childNode in xml.childNodes
        child = this.parse childNode, attr2child
        if childNode.nodeType == 1
          # Child nodes.
          name = childNode.localName
          if json[name]
            # Duplicate name, so we make it an array.
            if !(json[name] instanceof Array)
              json[name] = [json[name]]
            json[name][json[name].length] = child
          else
            json[name] = child
        else if childNode.nodeType == 3
          # Child text. We should check if it's empty and discard empty text.
          name = "@text"
          text = child.replace(/^\s+/, '').replace(/\s+$/, '')
          if text != ""
            json[name] = text

      # We treat the child node of a root node with no attributes and only a 
      # text child node to be just the text itself.
      if !xml.hasAttributes() && xml.childNodes.length == 1 && json["@text"]
        json = json["@text"]
    return json

