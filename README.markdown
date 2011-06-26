
```javascript
var obj = XML2JSON.parse('
  <root>
    <withattr id="10" name="5">
      text
    </withattr>
    <nodes>1</nodes>
    <nodes x="y">2</nodes>
    <nodes><num n="3">3</num></nodes>
    <nodes>
      <num n="3">
        <i>hello</i>
      </num>
    </nodes>
    <nodes>
      <num>3</num>
      hi
    </nodes>                                                                      
  </root>
');
console.log(JSON.stringify(obj));
/*
{"root": 
  {
    "withattr": {"@attributes": {"id": "10", "name": "5"}, "@text": "text"},
    "nodes": [
      "1", 
      {"@attributes": {"x": "y"}, "@text": "2"}, 
      {"num": {"@attributes": {"n": "3"}, "@text": "3"}},
      {"num": {"@attributes": {"n": "3"}, {"i": "hello"}}}
      {"num": {"@attributes": {"n": "3"}, {"i": "hello"}}, "@text": "hi"}
      ]
  }
}
*/
```