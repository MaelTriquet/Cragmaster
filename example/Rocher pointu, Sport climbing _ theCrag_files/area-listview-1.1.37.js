
// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires
if ( typeof tc_translate == "undefined" ) {
  tc_translate = { keys:{} };
}
$.each({

    // add the default values here
    "process.button.log-ascent": "Log ascent(s)",
    "process.button.log-ascent.one": "Log ascent",
    "process.button.log-ascent.many": "Log {count} ascents",
    "process.button.edit-item": "Edit item(s)",
    "process.button.edit-item.one": "Edit item",
    "process.button.edit-item.many": "Edit {count} items",
    "process.button.remove-list-item": "Remove list item(s)",
    "process.button.remove-list-item.one": "Remove list item",
    "process.button.remove-list-item.many": "Remove {count} list items",
    "process.button.add-area-above": "Add area above",
    "process.button.add-area-below": "Add area below",
    "process.button.add-route-above": "Add route above",
    "process.button.add-route-below": "Add route below",
    "process.button.add-annotation-above": "Add annotation above",
    "process.button.add-annotation-below": "Add annotation below",
    "process.button.archive-item": "Archive item",
    "process.button.unarchive-item": "Unarchive item",
    "process.button.move-item": "Move item(s)",
    "process.button.move-item.one": "Move item",
    "process.button.move-item.many": "Move {count} items",
    "process.button.merge-items": "Merge items",
    "process.button.your-ascent-history": "Your ascent history",
    "process.button.all-ascent-history": "All ascent history",
    "process.button.link-to-this-route": "Link to this route",
    "template.modal.add-to-list.title": "Add to list",
    "template.modal.add-to-list.title.many": "Add {count} items to list",
    "process.button.edit-annotation": "Edit annotation",

  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************



function addDynamicListViewMenu(event,element) {

  if ( element.find('.actionarea').length>0 )   { // bail if already added
    return false;
  }
  var $tr = element;
  var anid     = $('body').data('nid');
  var refParentID = anid;
  var uid      = $('body').data('uid');
  var canEdit  = $('body').data('can-edit');
  var canReparent = $('body').data('can-reparent'); 
  var canMerge = $('body').data('can-merge'); 
  var canArchive = $('body').data('can-archive'); 
  var canList  = $('body').data('can-list');
  var canLog  = $('body').data('can-log');
  var isList  = $('body').data('is-list');
  var isGym = $('body').data('is-gym'); 
  var ntype = '';
  var ret = 'R='+location.pathname;
  var archived = $tr.hasClass('archived'); 
  var collapsed = $tr.data('collapsed'); 
  var archivable = $tr.data('archivable'); 
  var lastUnarchived = $tr.data('last-unarchived'); 
  var useParent = $tr.data('use-parent'); 
  if ( useParent )  {
    refParentID = useParent;
  }
  if ($tr.data('nid')){
    if ($tr.hasClass('route')) {
        ntype = 'route';
    } else if ($tr.hasClass('annotation')) {
        ntype = 'annotation';
    } else {
        ntype = 'area';
    }
    id = $tr.data('nid');
  }

  var $selected = $tr.siblings('[data-nid].selected').add( $tr );
  var selectIDs = $selected.map( function(){ return $(this).data('nid'); }).get();
  var selectRouteIDs = [];
  var selectAnnotationIDs = [];
  var selectAreaIDs = [];
  var selectItemIDs = [];
  var node_type_present = {};
  var parents_selected = {};
  var selectRouteNames = [];
  var selectAreaNames = [];
  var selectRouteTickData = [];
  var selectedRouteTickHistory = [];
  $selected.each(function(){ 
    var s_nid = $(this).data('nid'); 
    var s_iid = $(this).data('iid'); 
    var s_p = $(this).data('use-parent'); 
    if ( !s_p ) {
      s_p = anid;
    }
    parents_selected[s_p] = 1;
    if ( $(this).hasClass('route') )  {
      selectRouteIDs.push(s_nid);
      selectRouteTickData.push($(this).data('route-tick') || {});
      var tickHistory = $(this).data('route-tick-history');
      if (tickHistory) {
        // full history not currently being set, just and indication that the user has an ascent or not
        selectedRouteTickHistory.push(tickHistory);
      } else  {
        selectedRouteTickHistory.push({status: "unknown"});
      }
      selectRouteNames.push($(this).find('.primary-node-name').text());
      node_type_present['route'] = 1;
    } else if ( $(this).hasClass('area') )  {
      selectAreaIDs.push(s_nid);
      selectAreaNames.push($(this).find('.primary-node-name').text());
      node_type_present['area'] = 1;
    } else if ( $(this).hasClass('annotation') )  {
      selectAnnotationIDs.push(s_nid);
      node_type_present['annotation'] = 1;
    }
    if ( $(this).hasClass('list-item') )  {
      selectItemIDs.push(s_iid);
    }
  })
  var numberParents = Object.keys(parents_selected).length;

  var log_ascent_txt = tc_translate.getText('process.button.log-ascent',{count:selectRouteIDs.length},{count:selectRouteIDs.length});
  var $refInp = $('input[name="D:NetworkNodeID"]');
  var old_log_ascent_link = '';
  if ( $refInp.length ) {
   var refNodeID = $refInp.val();
   old_log_ascent_link = '/processmap/logascent_multi/' + selectRouteIDs.join('+') + '?parent='+refNodeID+'&'+ret;
  }

  var use_node_text = false;
  if ( Object.keys(node_type_present).length > 1 )   {
    use_node_text = true;
  }
  var edit_route_txt = tc_translate.getText('process.button.edit-item',{count:selectRouteIDs.length},{count:selectRouteIDs.length});
  var edit_area_txt = tc_translate.getText('process.button.edit-item',{count:selectAreaIDs.length},{count:selectAreaIDs.length});
  var edit_annotation_txt = tc_translate.getText('process.button.edit-item',{count:selectAnnotationIDs.length},{count:selectAnnotationIDs.length});
  var edit_node_txt = tc_translate.getText('process.button.edit-item',{count:selectIDs.length},{count:selectIDs.length});
  var edit_txt = edit_node_txt;
  if ( !use_node_text )  {
    if ( ntype == 'route' )   {
      edit_txt = edit_route_txt;
    } else if ( ntype == 'annotation' ) {
      edit_txt = edit_annotation_txt;
    }
  }

  var cta_fnclass = '';
  var edit_link = '/processmap/bulkedit/' + selectIDs.join('+') + '?select=0&'+ret;
  if ( isList ) {
    cta_fnclass = 'fn-edit-listitem';
    edit_link = '#';
  }

  var logAscentProcessing = false

  var cta_icon = 'pencil';
  var cta_txt = edit_txt;
  var cta_link = edit_link;
  if ( ntype == 'route' )  {
    cta_icon = 'ok';
    cta_txt = log_ascent_txt;
    cta_fnclass = 'fn-log-listview';
    cta_link = '#';
    logAscentProcessing = true
  }

			// make a drop down menu
  var $m = $('<div class="actionarea"><div class="edit"><div class="btn-group"><a class="btn btn-mini '+cta_fnclass+'" href="'+cta_link+'"><i class="icon-'+cta_icon+'"></i> '+cta_txt+'</a>' +
    '<a class="btn btn-mini dropdown-toggle" data-toggle="dropdown"><i class="icon-caret-down"></i></a><ul class="dropdown-menu pull-right"></ul>' +
    '</div></div></div>');

  var $menu = $m.find('.dropdown-menu');
  
  
  if (isList && (ntype == 'annotation' || ntype == 'area')) {
    var $mainB = $m.find('.'+cta_fnclass);
    $mainB.unbind('click').bind('click',function(){
      showEditListItemModal(selectItemIDs[0]);
    });
  }

  if ( ntype == 'route' )  {
    if ( canLog && selectRouteIDs.length > 0) {
      $menu.append('<li><a class="fn-log-listview"><i class="icon-ok"></i> ' + log_ascent_txt + '</a>');

      //if (old_log_ascent_link.length > 0) {
       // $menu.append('<li><a href="'  + old_log_ascent_link + '"><i class="icon-ok"></i> Old log ascent</a>');
      //}

    } else {
      $menu.append('<li class="disabled"><a><i class="icon-ok"></i> '+log_ascent_txt+'</a>');
    }
  }

  if ( isList ) {

    if ( selectItemIDs.length==1 && canEdit )   {
      $menu.append('<li><a class="edit-list-item"><i class="icon-pencil"></i> ' + edit_txt + '</a>').find(".edit-list-item").unbind('click').bind('click',function(){
        showEditListItemModal(selectItemIDs[0]);
      });
      $menu.append('<li><a href="/processmap/createannotation/' + isList + '?D:InsertBefore=' + selectItemIDs[0] + '&D:ListID=' + isList + '&' + ret + '">'+tc_translate.getText('process.button.add-annotation-above')+'</a>');
      if ( ntype == 'annotation' ) {
        $menu.append('<li><a href="/processmap/bulkedit/' + selectIDs.join('+') + '?select=0&D:ListID=' + isList + '&' + ret + '"><i class="icon-pencil"></i> '+tc_translate.getText('process.button.edit-annotation')+'</a>');
      } 
    } else {
      $menu.append('<li class="disabled"><a><i class="icon-pencil"></i> '+edit_txt+'</a>');
    }

    var remove_txt = tc_translate.getText('process.button.remove-list-item',{count:selectItemIDs.length},{count:selectItemIDs.length});
    if ( selectItemIDs.length>0 && canEdit )   {
      $menu.append('<li><a class="fn-remove-list-item" data-wtf="wrf"><i class="icon-trash"></i> ' + remove_txt + '</a>');
    } else {
      $menu.append('<li class="disabled"><a><i class="icon-trash"></i> '+remove_txt+'</a>');
    }

  } else {

    if ( canList ) {
      var add_to_list_txt = tc_translate.getText('template.modal.add-to-list.title',{count:selectRouteIDs.length + selectAreaIDs.length},{count:selectRouteIDs.length + selectAreaIDs.length});
      if ( (ntype == 'route' || ntype == 'area') && (selectRouteIDs.length + selectAreaIDs.length) >= 1){
        $menu.append('<li><a class="listlink"><i class="icon-circle"></i> ' + add_to_list_txt + '</a>').find(".listlink").unbind('click').bind('click',function(){
          showAddToListModal(selectRouteIDs.concat(selectAreaIDs),selectRouteNames.concat(selectAreaNames));
        });
      } else {
        $menu.append('<li class="disabled"><a><i class="icon-circle"></i> '+add_to_list_txt+'</a>');
      }
    }

    $menu.append('<li class="divider">');
  
    if ( canEdit ){
      $menu.append('<li><a href="'  + edit_link + '">' + edit_txt + '</a>');
    } else {
      $menu.append('<li class="disabled"><a>'+edit_txt+'</a>');
    }
  
    if ( ntype == 'area' )  {
      var add_area_above = tc_translate.getText('process.button.add-area-above')
      if ( $selected.length==1 && canEdit )   {
        $menu.append('<li><a href="/processmap/createareanode/'  + refParentID + '?D:InsertBefore=' + id + '&' + ret + '">'+add_area_above+'</a>');
      } else {
        $menu.append('<li class="disabled"><a>'+add_area_above+'</a>');
      }
    } else {
      var add_annotation_above = tc_translate.getText('process.button.add-annotation-above')
      var add_route_above = tc_translate.getText('process.button.add-route-above')
      if ( $selected.length==1 && canEdit )   {
        $menu.append('<li><a href="/processmap/createclimbnode/'  + refParentID + '?D:InsertBefore=' + id + '&' + ret + '">'+add_route_above+'</a>');
        $menu.append('<li><a href="/processmap/createannotation/' + refParentID + '?D:InsertBefore=' + id + '&' + ret + '">'+add_annotation_above+'</a>');
      } else {
        $menu.append('<li class="disabled"><a>'+add_route_above+'</a>');
        $menu.append('<li class="disabled"><a>'+add_annotation_above+'</a>');
      }
    }

			  // if it is the last row 
    if (!$tr.next().length || lastUnarchived){
      if ( ntype == 'area' )  {
        var add_area_below = tc_translate.getText('process.button.add-area-below')
        if ( $selected.length==1 && canEdit )   {
          $menu.append('<li><a href="/processmap/createareanode/'  + refParentID + '?' + ret + '">'+add_area_below+'</a>');
        } else {
          $menu.append('<li class="disabled"><a>'+add_area_below+'</a>');
        }
      } else {
        var add_annotation_below = tc_translate.getText('process.button.add-annotation-below')
        var add_route_below = tc_translate.getText('process.button.add-route-below')
        $menu.append('<li class="divider">');
        if ( $selected.length==1 && canEdit )   {
          $menu.append('<li><a href="/processmap/createclimbnode/'  + refParentID + '?' + ret + '">'+add_route_below+'</a>');
          $menu.append('<li><a href="/processmap/createannotation/' + refParentID + '?' + ret + '">'+add_annotation_below+'</a>');
        } else {
          $menu.append('<li class="disabled"><a>'+add_route_below+'</a>');
          $menu.append('<li class="disabled"><a>'+add_annotation_below+'</a>');
        }
      }
    }

    if ( isGym ){
      if (ntype == 'route'){
        $menu.append('<li class="divider">');
        var archive_route_txt = tc_translate.getText('process.button.archive-item')
        var unarchive_route_txt = tc_translate.getText('process.button.unarchive-item')
        if ( archived ) {
          if (selectRouteIDs.length==1 && canArchive){
            $menu.append('<li><a class="fn-unarchive-route">'+unarchive_route_txt+'</a>');
          } else {
            $menu.append('<li class="disabled"><a>'+unarchive_route_txt+'</a>');
          }
        } else  {
          if (selectRouteIDs.length==1 && canArchive){
            $menu.append('<li><a class="fn-archive-route">'+archive_route_txt+'</a>');
          } else {
            $menu.append('<li class="disabled"><a>'+archive_route_txt+'</a>');
          }
        }
      }
      if (ntype == 'area'){
        $menu.append('<li class="divider">');
        var archive_area_txt = tc_translate.getText('process.button.archive-item')
        var unarchive_area_txt = tc_translate.getText('process.button.unarchive-item')
        if ( archived ) {
          if (selectAreaIDs.length==1 && canArchive){
            $menu.append('<li><a class="fn-unarchive-area">'+unarchive_area_txt+'</a>');
          } else {
            $menu.append('<li class="disabled"><a>'+unarchive_area_txt+'</a>');
          }
        } else  {
          if (selectAreaIDs.length==1 && canArchive && archivable ){
            $menu.append('<li><a class="fn-archive-area">'+archive_area_txt+'</a>');
          } else {
            $menu.append('<li class="disabled"><a>'+archive_area_txt+'</a>');
          }
        }
      }
    }

    if (ntype == 'route'){
      $menu.append('<li class="divider">');
      var move_route_txt = tc_translate.getText('process.button.move-item',{count:selectIDs.length},{count:selectIDs.length});
      var move_route_link = '';
    
      if (canReparent && selectIDs.length>0 && numberParents<=1){
        if ( selectIDs.length==1 ){
          var n1 = selectIDs[0];
          move_route_link = '/processmap/reparentnode/' + n1;
        } else {
          move_route_link = '/processmap/reparentnode/'+anid+'?CHECKBOX:AllChildren=1&D:ID='
                              + selectIDs.join('&D:ID=')
                              + '&D:NetworkNodeID='+anid
                              + '&C:HideNavigation=1&State:7126=Next'
                              + '&C:ReturnURL='+location.pathname;
        }
      }
      if (move_route_link.length>0){
        $menu.append('<li><a href="'+move_route_link+'">'+move_route_txt+'</a>');
      } else {
        $menu.append('<li class="disabled"><a>'+move_route_txt+'</a>');
      }

      var merge_routes_txt = tc_translate.getText('process.button.merge-items')
      if (selectRouteIDs.length==2 && selectIDs.length==2 && canMerge && numberParents<=1){
        var n1 = selectRouteIDs[0];
        var n2 = selectRouteIDs[1];
        var merge_routes_link = '/processmap/mergenode/' + n1 + '?D:NetworkNodeID:' + n1 + 'P=' + anid + '&D:ChildNode=' + n2 + '&D:Action=ClimbMerge';
        $menu.append('<li><a href="'+merge_routes_link+'">'+merge_routes_txt+'</a>');
      } else {
        $menu.append('<li class="disabled"><a>'+merge_routes_txt+'</a>');
      }

      $menu.append('<li class="divider">');

      var your_history_txt = tc_translate.getText('process.button.your-ascent-history')
      var history = $selected.has('.tick > a > span:not(.tick_unticked)').map( function(){ return $(this).data('nid'); }).get();
      if (history.length > 0){
        var your_history_link = '/ascents/at/'+ history.join('+') +'/by/' + uid;
        $menu.append('<li><a href="'+your_history_link+'">'+your_history_txt+'</a>');
      } else {
        $menu.append('<li class="disabled"><a>'+your_history_txt+'</a>');
      }

      var all_history_txt = tc_translate.getText('process.button.all-ascent-history')
      if (selectRouteIDs.length > 0){
        var all_history_link = '/ascents/at/'+ selectRouteIDs.join('+');
        $menu.append('<li><a href="'+all_history_link+'">'+all_history_txt+'</a>');
      } else {
        $menu.append('<li><a class="disabled">'+all_history_txt+'</a>');
      }
      $menu.append('<li class="divider">');
      var link_to_route_txt = tc_translate.getText('process.button.link-to-this-route')
      $menu.append('<li><a href="#n'+ id +'">'+link_to_route_txt+'</a>');
    }

  }

  if (logAscentProcessing) {
    $m.find(".fn-log-listview").unbind('click').bind('click',function(e){
      e.preventDefault();
      var routes = [];
      for (var i = 0; i < selectRouteIDs.length; i++) {
        routes.push({
         routeID: selectRouteIDs[i],
         route: selectRouteTickData[i] || {},
         history: selectedRouteTickHistory[i] || {},
        });
      }
      showLogAscentModal(routes);
    });
  }

  $m.prependTo( $tr );

  $menu.find(".fn-archive-route").unbind('click').bind('click',function(event){
    return archiveRoute(event,$(this));
  }); 

  $menu.find(".fn-unarchive-route").unbind('click').bind('click',function(event){
    return unarchiveRoute(event,$(this));
  }); 

  $menu.find(".fn-archive-area").unbind('click').bind('click',function(event){
    return archiveArea(event,$(this));
  }); 

  $menu.find(".fn-unarchive-area").unbind('click').bind('click',function(event){
    return unarchiveArea(event,$(this));
  }); 

  $menu.find(".fn-remove-list-item").unbind('click').bind('click',function(event){
    return removeSelectedListItems(event,$(this));
  }); 
}

function removeDynamicListViewMenu(event,element) {
  if ( element.find('.actionarea').length<1 )   { // bail if not there
    return false;
  }
  element.find('.actionarea').remove();
  element.removeClass('hover');
}

function updateDynamicListViewMenu(event,element) {
  element.siblings('[data-nid].selected').each(function(){
    removeDynamicListViewMenu(event,$(this));
    // addDynamicListViewMenu(event,$(this));
  });
  if ( element.hasClass('selected') )  {
    addDynamicListViewMenu(event,element);
  } else {
    removeDynamicListViewMenu(event,element);
  }
}

function updateDynamicListViewMenuForTouchscreen(event,element) {
  if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
    updateDynamicListViewMenu(event,element);
  } 
}

(function(){

	// if not logged in then bail
  if ( !$('body').data('uid') ){
    return;
  } 

	// see https://github.com/Modernizr/Modernizr/blob/master/feature-detects/touchevents.js
  if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
  } else {
	// NON touch events
	// cycle through all route and annotation rows in the route table
    $('.routetable, .node-listview').on({
      'mouseenter': function(event){
        addDynamicListViewMenu(event,$(this));
      },
      'mouseleave': function(event){
        removeDynamicListViewMenu(event,$(this));
      }
    }, '.area[data-nid], .route[data-nid], .annotation[data-nid], .list-item[data-iid]');
  }

})();


