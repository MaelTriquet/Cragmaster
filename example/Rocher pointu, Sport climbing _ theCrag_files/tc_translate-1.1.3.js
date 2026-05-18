if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}

// ********   START getText INTERNATIONALISATION ********************
tc_translate.getText = function (key,substitutes,options) {
  var use_key = key;
  if ( typeof options != "undefined" && typeof options['count'] != 'undefined' ) {
    var count = options['count'];
    //alert("DEBUG:A:"+count);
    var postfix = '';
    if ( count < 0 )   {
      postfix = '.negative';
    } else if ( count == 0 )   {
      postfix = '.zero';
    } else if ( count == 1 )   {
      postfix = '.one';
    } else if ( count > 1 )   {
      postfix = '.many';
    }
    var fullkey = use_key + postfix;
    //alert("DEBUG:B:"+fullkey);
    if ( typeof tc_translate.keys[fullkey] != "undefined" ) {
      use_key = fullkey;
    }
  }
  if ( typeof tc_translate.keys[use_key] == "undefined" ) {
    return '?';
  }
  //alert("DEBUG:C:"+use_key);
  var text = tc_translate.keys[use_key];
  if ( typeof substitutes != "undefined" ) {
    //alert("DEBUG:D:"+text);
    $.each(substitutes,function(k, v){
      //alert("DEBUG:X:"+text+":"+k+":"+v);
      var re = new RegExp("{"+k+"}",'g'); 
      text = text.replace(re,v);
      //alert("DEBUG:Y:"+text);
    });
  }
  //alert("DEBUG:F:"+text);
  return text;
}

this.thecrag = this.thecrag || {};
thecrag.getText = tc_translate.getText;
thecrag.getTextUC = function (key,substitutes,options) {
    var st = tc_translate.getText(key,substitutes,options);
    st = st.charAt(0).toUpperCase() + st.slice(1);
    return st;
}
// ********   END getText INTERNATIONALISATION ********************
