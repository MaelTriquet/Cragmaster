// this is a temporary hack at getting an autocomplete working
// it will need complete rework after we have decided how autocomplete is going to work in with bootstrap
// this version of autocomplete includes 
//   autocomplete-text: text field for user inputs
//   autocomplete-dynamic: dynamic dropdown list created from server lookup response
//   autocomplete-hidden-id: hidden field 
//   autocomplete-select: toggle to alternate static selection list
//   autocomplete-clone: when set clones the fields on selection for mulitple entries
//   ac-ok: image saying the selection is successful
//   ac-bad: image saying the selection is not successful
//   ac-delete: triggers deleting a clone
//   ac-trigger-toggle: triggers toggling between user text and static selection list

// only keyboard support is the enter key when there is only one element in the list



function initAutocomplete()   {

  $("img.ac-ok,img.ac-bad,img.ac-delete").hide();

  $(".autocomplete-select").hide();

  function togglePulldown (element)   {
    var p = element.parent();
    var sel = p.find('.autocomplete-select');
    if ( sel.length > 0 )    {
      p.find(".autocomplete-text").val('');
      p.find(".autocomplete-hidden-id").val('');
      p.find('img.ac-ok,img.ac-bad').hide();
      p.parent().find('.autocomplete-toggle').toggle();
    }
  }

  $("img.ac-trigger-toggle").unbind('click').bind('click',function(){
    togglePulldown($(this));
  });

  $("img.ac-delete").unbind('click').bind('click',function(){
    var selectField = $(this).parent().parent().parent().find('.msgTo');
    if ( selectField.length > 1 )    {
      $(this).parent().parent().remove();
    } else if ( selectField.length == 1 )    {
      var toDiv = $(this).parent().parent();
      toDiv.find('.autocomplete-toggle').val('');
      toDiv.find('img.ac-ok,img.ac-bad,img.ac-delete').hide();
      toDiv.find('img.ac-trigger-toggle').show();
    }
  });

  $(".autocomplete-toggle").unbind('dblclick').bind('dblclick',function(){
    if ( !$(this).val() )    {
      togglePulldown($(this));
    }
  });

  var timerInstance = 0;

  $(".autocomplete-text").unbind('blur').bind('blur',function(){
    var inputElement = $(this);
    var inputParent = inputElement.parent();
    window.setTimeout(function() {
      $("#autocomplete-dynamic").remove();
      if ( !inputParent.find(".autocomplete-hidden-id").val() && inputElement.val() )   {
        inputParent.find('img.ac-trigger-toggle,img.ac-bad').show();
        inputParent.find('img.ac-ok').hide();
      }
    },300); // needs time to process pulldown selection in case the blur is processed before the click
  });

  function overrideAutocompleteInputKeystroke(event) {
    var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
    if (keycode==13 || keycode==9) {
      event.preventDefault();
      return false;
    }
  }

  $(".autocomplete-text").unbind('keydown').bind('keydown',function(event){
    return overrideAutocompleteInputKeystroke(event);
  });

  $(".autocomplete-text").unbind('keypress').bind('keypress',function(event){
    return overrideAutocompleteInputKeystroke(event);
  });

  function cloneToFields(inputElement)  {
    var inputParent = inputElement.parent();
    inputParent.find("img.ac-trigger-toggle,img.ac-bad").hide();
    inputParent.find("img.ac-ok,img.ac-delete").show();
    var tofield = inputParent.parent();
    var clonefield = tofield.clone(true).insertAfter(tofield);
    clonefield.find("img.ac-ok,img.ac-bad,img.ac-delete").hide();
    clonefield.find("img.ac-trigger-toggle").show();
    clonefield.find(".autocomplete-hidden-id").val('');
    clonefield.find("input.autocomplete-toggle").val('').focus();
  }

  function assignPulldownElement(cloneFlag,inputElement,element)  {
    var inputParent = inputElement.parent();
    var d = getIDsFromAttr(element,'id',["id"]);
    if ( d.id>0 )   {
      inputElement.val(element.text());
      inputParent.find(".autocomplete-hidden-id").val(d.id).trigger('change');
      inputParent.find('img.ac-trigger-toggle,img.ac-bad').hide();
      inputParent.find('img.ac-ok').show();
    }
    $("#autocomplete-dynamic").remove();
    if ( cloneFlag && (d.id>0 || inputParent.find(".autocomplete-select option:selected").val()) )  {
      cloneToFields(inputElement);
      return true;
    }
    return false;
  }

  function createDynamicPulldown(cloneFlag,inputElement,val,resp)  {
    var inputParent = inputElement.parent();
    $("#autocomplete-dynamic").remove();
    inputParent.find(".autocomplete-hidden-id").val('');
    var recheckVal = inputElement.val();
    if ( recheckVal == val )   {
      if ( resp && resp.length )    {
        var pos = inputElement.position();
        var html = '<ul id="autocomplete-dynamic" class="dropdown-menu">';
        for (var i=0; i<resp.length;i++) {
          var rec=resp[i];
          html += '<li><a id="mn_'+rec.id+'">'+(rec.name ? escapeHTML(rec.name) : '')+(rec.login ? ' ('+rec.login+')' : '')+'</a></li>';
        }
        html += '</ul>';
        $(html).hide().insertAfter(inputElement).css({position:'absolute','z-index':1000,top:pos.top+inputElement.outerHeight()+1,left:pos.left}).show().find("a").bind('click',function(){
          assignPulldownElement(cloneFlag,inputElement,$(this));
        });
      }
    }
  }

  $(".autocomplete-text").unbind('keyup').bind('keyup',function(event){
    var keycode = (event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode));
    var inputElement = $(this);
    var accountFlag = inputElement.hasClass("autocomplete-account");
    var cloneFlag = inputElement.hasClass("autocomplete-clone");
    var inputParent = inputElement.parent();
    var val = inputElement.val();
    var selFavList = $("#autocomplete-dynamic a");
    var refocused = false;
    if (val && (keycode==13 || keycode==9) && selFavList.length==1 ) {
      refocused = assignPulldownElement(cloneFlag,inputElement,selFavList.eq(0));
    } else  {
      inputParent.find(".autocomplete-hidden-id").val('');
      inputParent.find('img.ac-trigger-toggle').show();
      inputParent.find('img.ac-ok,img.ac-bad').hide();
    }
    $("#autocomplete-dynamic").remove();
    var triggerLength = accountFlag ? 3 : 2;
    if ( keycode==13 || keycode==9 ) { 
      if ( !refocused )   {
        $(".msgf_subject").focus();
      }
    // } else if ( keycode==40 ) { 
      // $("#autocomplete-dynamic li:first > a").addClass("active");
    } else if ( val.length >= triggerLength )   {
      timerInstance += 1;
      var timerID = timerInstance;
      window.setTimeout(function() {
        if ( timerID == timerInstance )  {
          if ( accountFlag )  {
            DAO.lookupClimber(val,function(resp){createDynamicPulldown(cloneFlag,inputElement,val,resp);});
          } else  {
            var mode = 'crag';
            if ( inputElement.hasClass("autocomplete-region") )    {
              mode += ',region';
            }
            DAO.lookupCrag(val,mode,function(resp){createDynamicPulldown(cloneFlag,inputElement,val,resp);});
          }
        }
      },300); // average time between keystrokes
    }
  }); 

  $(".autocomplete-account.autocomplete-select.autocomplete-clone").unbind('change').bind('change',function(){
    var inputElement = $(this);
    if ( inputElement.find("option:selected").val() )  {
      cloneToFields(inputElement);
    }
  }); 

}


$(function(){
  initAutocomplete();
});
