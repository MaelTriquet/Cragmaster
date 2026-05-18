// ********   
//  Required route 
//  * id
//  * name
//  * closed
//  * styleStub
//  * gym
//  * context
//  * systems (not included in base atom)
//  * gradeAtom
//  * pitch (not included in base atom)
//  * pitches
//  * maybeMultipitch (not included in base atom)
//  * displayHeight
//  * bolts
//  * stars
// 
// ********   

// ********   START DEFAULT INTERNATIONALISATION ********************
// * default values for translation keys in case they are not loaded
// * also acts as a spec for the translation keys that this file requires
if ( typeof tc_translate === "undefined" ) {
  tc_translate = { lang: 'en', keys:{} };
}
$.each({

    // add the default values here
    "object.day" : "day",
    "object.day.many" : "days",
    "object.tick" : "tick",
    "object.grade" : "grade",
    "object.financial-supporter" : "financial supporter",
    "system.relative-time.today" : "today",
    "system.assigned" : "Assigned",
    "system.downgrade" : "Downgrade",
    "system.upgrade" : "Upgrade",
    "system.become-a-supporter.pay-forward" : "Please consider paying it forward and becoming a {financialSupporter}",
    "template.ascent-modal.logged" : "Ascent logged.",
    "template.ascent-modal.milestone.is-first-ascent.header" : "Yeaaah, you rock!",
    "template.ascent-modal.is-first-ascent" : "Congratulations on logging your first ascent in theCrag. We hope the theCrag logbook enhances your climbing experience for you and your friends.",
    "template.ascent-modal.session-summary" : "For this session you have made {attempts} attempts ({success} successful, {failed} failed) with overall {type} Climber Performance Rating of {cpr}.",
    "template.ascent-modal.approximate-grade-fraction": "(appoximately {deltaGrade} of a grade)",
    "template.ascent-modal.approximate-grade": "(appoximately {deltaGrade} grade)",
    "template.ascent-modal.approximate-grades": "(appoximately {deltaGrade} grades)",
    "template.ascent-modal.prev-area-session-summary" : "This is {deltaCpr} points {approxGradeText} compared to your previous session in the area {daysAgo} ago.",
    "template.ascent-modal.best-area-session-summary.best" : "This is your best performance for the area.",
    "template.ascent-modal.best-area-session-summary.below" : "This is {deltaCpr} points {approxGradeText} below your best session performance for the area on {date}.",
    "template.ascent-modal.best-session-summary.best": "This is your best session performance.",
    "template.ascent-modal.best-session-summary.below": "This is {deltaCpr} points {approxGradeText} below your best session performance on {date} at {area}.",
    "template.ascent-modal.climbed-pitches": "Climbed pitches",
    "template.ascent-modal.pitch-title": "Pitch {pitchNumber}",
    "template.log-ascent.length": "Length",
    "template.log-ascent.lead-by": "Lead by",
    "template.log-ascent.public-comment": "Comment",
    "template.log-ascent.previous-ascents": "You have logged {count} previous ascents of this route.",
    "template.log-ascent.easy-but-fair": "Easy but fair",
    "template.log-ascent.hard-but-fair": "Hard but fair",
    "template.log-ascent.echopoint-description": "Traveled by public transport, cycling or hiking.",

    "dbconfig.tags.tag.ecopoint.label" : "Ecopoint",
    "dbconfig.route-gear-style.aid" : "aid",
    "dbconfig.route-gear-style.alpine" : "alpine",
    "dbconfig.route-gear-style.boulder" : "boulder",
    "dbconfig.route-gear-style.dws" : "deep water solo",
    "dbconfig.route-gear-style.ice" : "ice",
    "dbconfig.route-gear-style.mixed" : "mixed trad",
    "dbconfig.route-gear-style.sport" : "sport",
    "dbconfig.route-gear-style.top-rope" : "top rope",
    "dbconfig.route-gear-style.trad" : "trad",
    "dbconfig.route-gear-style.traverse" : "traverse",
    "dbconfig.route-gear-style.unknown" : "unknown",
    "dbconfig.route-gear-style.via-ferrata" : "via ferrata",
    "dbconfig.route-gear-style.solo" : "free solo",
    "dbconfig.route-gear-style.second" : "second",

    "dbconfig.tick-type.aid" : "Aid",
    "dbconfig.tick-type.aidsolo" : "Aid solo",
    "dbconfig.tick-type.attempt" : "Attempt",
    "dbconfig.tick-type.clean" : "Clean",
    "dbconfig.tick-type.dab" : "Dab",
    "dbconfig.tick-type.repeat" : "Repeat",
    "dbconfig.tick-type.deepwatersolo" : "Deep water solo",
    "dbconfig.tick-type.viaferrata" : "Via ferrata",
    "dbconfig.tick-type.groundupredpoint" : "Ground up red point",
    "dbconfig.tick-type.allfreewithrest" : "All free with rest",
    "dbconfig.tick-type.dog" : "Hang dog",
    "dbconfig.tick-type.firstascent" : "First ascent",
    "dbconfig.tick-type.firstfreeascent" : "First free ascent",
    "dbconfig.tick-type.flash" : "Flash",
    "dbconfig.tick-type.ghost" : "Ghost",
    "dbconfig.tick-type.hit" : "Hit",
    "dbconfig.tick-type.lead" : "Lead",
    "dbconfig.tick-type.leadsolo" : "Lead solo",
    "dbconfig.tick-type.mark" : "Mark",
    "dbconfig.tick-type.onsight" : "Onsight",
    "dbconfig.tick-type.pinkpoint" : "Pink point",
    "dbconfig.tick-type.redpoint" : "Red point",
    "dbconfig.tick-type.greenpoint" : "Green point",
    "dbconfig.tick-type.greenpointflash" : "Green point flash",
    "dbconfig.tick-type.greenpointonsight" : "Green point onsight",
    "dbconfig.tick-type.retreat" : "Retreat",
    "dbconfig.tick-type.ropedsolo" : "Roped Solo",
    "dbconfig.tick-type.second" : "Second",
    "dbconfig.tick-type.secondclean" : "Second clean",
    "dbconfig.tick-type.secondrest" : "Second with rest",
    "dbconfig.tick-type.send" : "Send",
    "dbconfig.tick-type.solo" : "Solo",
    "dbconfig.tick-type.onsightsolo" : "Onsight solo",
    "dbconfig.tick-type.target" : "Target",
    "dbconfig.tick-type.tick" : "Tick",
    "dbconfig.tick-type.toprope" : "Top rope",
    "dbconfig.tick-type.topropeclean" : "Top rope clean",
    "dbconfig.tick-type.topropeflash" : "Top rope flash",
    "dbconfig.tick-type.topropeonsight" : "Top rope onsight",
    "dbconfig.tick-type.toproperest" : "Top rope with rest",
    "dbconfig.tick-type.working" : "Working",

    "dbconfig.quality-rating.average" : "Average",
    "dbconfig.quality-rating.classic" : "Classic",
    "dbconfig.quality-rating.crap" : "Crap",
    "dbconfig.quality-rating.excellent" : "Very Good",
    "dbconfig.quality-rating.good" : "Good",
    "dbconfig.quality-rating.megaclassic" : "Mega Classic",
    "dbconfig.quality-rating.poor" : "Don't Bother",

    "difficulty-feedback-meaning.soft" : "The route is a soft touch for the grade and should be downgraded.",
    "difficulty-feedback-meaning.easy" : "The route is a easy for the grade but graded correctly.",
    "difficulty-feedback-meaning.average" : "The route route grade is correct.",
    "difficulty-feedback-meaning.hard" : "The route is a hard for the grade but graded correctly.",
    "difficulty-feedback-meaning.sand" : "The route is a sand bag for the grade and should be upgraded.",

    "template.log-ascent.climbing-closed.explain": "Logging ascents may be public, please consider implications or local sensitivities before you log these ascents.",
    "template.area.climbing-closed": "Climbing in this area is closed.",

    "process.button.log-ascent.one": "Log ascent",
    "process.button.log-and-clone": "Log and clone",
    "process.button.update-ascent": "Update ascent",
    "process.button.done": "Done",
    "process.button.reload": "Reload",
    "process.button.resave": "Re-save",
    "template.ascent-modal.getting-route-details": "Getting route details",
    "template.ascent-modal.getting-ascent-details": "Getting ascent details",
    "template.ascent-modal.getting-your-route-history": "Getting your route history",
    "template.ascent-modal.getting-translation-text": "Getting translation text",
    "template.ascent-modal.getting-session-summary": "Getting session summary",
    "template.ascent-modal.go-to-session": "Go to session.",

    // pre-load default tick type descriptions, but dynamically load others
    "tick-meaning.tick-type.redpoint" : "I led this route, without falling or resting, but not on my first attempt (incl. repeats).",
    "tick-meaning.tick-type.redpoint.freesoloing" : "I free soloed this route, without falling or resting, but not on my first attempt (incl. repeats).",
    "tick-meaning.tick-type.send" : "I completed this boulder cleanly as described.",
    "tick-meaning.tick-type.clean.top-roping" : "I top-roped this route, without falling or resting, but not on my first attempt (incl. repeats).",
    "tick-meaning.tick-type.clean.seconding" : "I seconded this route, without falling or resting, but not on my first attempt (incl. repeats).",
    "tick-meaning.tick-type.tick" : "I climbed this route. Use for alpine routes, aid climbing, via ferratas or if you don’t remember how you climbed a route.",
    "tick-meaning.tick-type.tick.aid" : "I aided this route, using fixed or placed protection to make upward progress.",

  "x":""}, function(key, val){
  if ( typeof tc_translate.keys[key] == "undefined" ) {
    tc_translate.keys[key] = val
  }
});
// ********   END DEFAULT INTERNATIONALISATION ********************


var RELOAD_ASCENT_TIMEOUT = 30000;
var TRANSLATE_TIMEOUT = 10000;

function getLogAscentPages(modal)  {
  var pagesElement = modal.find('.modal-pagination-pages');
  if (!pagesElement) {
    return undefined;
  }
  var pages = pagesElement.data('pages');
  if (!pages) {
    return undefined;
  }
  return Number(pages);
}

function getLogAscentNextPage(modal,shouldClone)  {
  var pageElement = modal.find('.modal-pagination-page');
  if (!pageElement) {
    return undefined;
  }
  var page = pageElement.data('page');
  if (!page) {
    return undefined;
  }
  var nextPage = page + 1;
  var pagesElement = modal.find('.modal-pagination-pages');
  if (!pagesElement) {
    return undefined;
  }
  var pages = pagesElement.data('pages');
  if (!pages) {
    return undefined;
  }
  if (shouldClone) {
    const routeID = clonePageRouteID(modal);
    if (!routeID) {
      return undefined;
    }
    pages = pages + 1;
    pagesElement.html(pages);
    pagesElement.data('pages',pages);
  }
  if (nextPage > pages) {
    return undefined;
  }
  return nextPage;
}

function getLogAscentPage(modal)  {
  var pageElement = modal.find('.modal-pagination-page');
  if (!pageElement) {
    return undefined;
  }
  var page = pageElement.data('page');
  if (!page) {
    return undefined;
  }
  return Number(page);
}

function updateHistorySummary(modal,routeID,lastDifficultyFeedback)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var routeIDsElem = modal.find('.target-routeIDs');
  if (!routeIDsElem) {
    return undefined;
  }
  var history = routeIDsElem.data('history') || {};
  summary = (history[routeID] || {}).summary || {ascentCount: 0};
  if (lastDifficultyFeedback) {
    summary.lastDifficultyFeedback = lastDifficultyFeedback;
  }
  summary.ascentCount = summary.ascentCount + 1;
  setHistorySummary(modal,routeID,summary);
}

function setHistorySummary(modal,routeID,summary)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var routeIDsElem = modal.find('.target-routeIDs');
  if (!routeIDsElem) {
    return undefined;
  }
  var history = routeIDsElem.data('history') || {};
  history[routeID] = {
    status: 'loaded',
    summary: summary,
  };
  routeIDsElem.data('history',history);
}

function clonePageRouteID(modal)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var routeIDsElem = modal.find('.target-routeIDs');
  if (!routeIDsElem) {
    return undefined;
  }
  var routeIDs = routeIDsElem.data('routeIDs');
  if (!routeIDs) {
    return undefined;
  }
  const routeID = routeIDs[page-1];
  if (!routeID) {
    return undefined;
  }

  var ascentIDsElem = modal.find('.target-ascentIDs');
  if (!ascentIDsElem) {
    return undefined;
  }
  var ascentIDs = ascentIDsElem.data('ascentIDs');
  if (!ascentIDs) {
    return undefined;
  }
  var ascents = ascentIDsElem.data('ascents');
  if (!ascents) {
    return undefined;
  }
  var isUpdated = ascentIDsElem.data('isUpdated');
  if (!isUpdated) {
    return undefined;
  }

  routeIDs.splice(page,0,routeID);
  routeIDsElem.data('routeIDs',routeIDs);

  ascentIDs.splice(page,0,undefined);
  ascentIDsElem.data('ascentIDs',ascentIDs);

  ascents.splice(page,0,undefined);
  ascentIDsElem.data('ascents',ascents);

  isUpdated.splice(page,0,undefined);
  ascentIDsElem.data('isUpdated',isUpdated);

  return routeID;
}

function storeAscentForNavigation(modal,ascentID,ascent,changed)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var ascentIDsElem = modal.find('.target-ascentIDs');
  if (!ascentIDsElem) {
    return undefined;
  }
  if (ascentID)  {
    var ascentIDs = ascentIDsElem.data('ascentIDs');
    if (!ascentIDs) {
      return undefined;
    }
    ascentIDs[page-1] = ascentID;
    ascentIDsElem.data('ascentIDs',ascentIDs);
  }

  if (ascent)  {
    var ascents = ascentIDsElem.data('ascents');
    if (!ascents) {
      return undefined;
    }
    ascents[page-1] = ascent;
    ascentIDsElem.data('ascents',ascents);
  }

  if (changed !== undefined)  {
    var isUpdated = ascentIDsElem.data('isUpdated');
    if (!isUpdated) {
      return undefined;
    }
    isUpdated[page-1] = changed;
    ascentIDsElem.data('isUpdated',isUpdated);
  }
}

function getLogAscentRouteID(modal)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var routeIDsElem = modal.find('.target-routeIDs');
  if (!routeIDsElem) {
    return undefined;
  }
  var routeIDs = routeIDsElem.data('routeIDs');
  if (!routeIDs) {
    return undefined;
  }
  var routeID = routeIDs[page-1];
  var result = {
    routeID: routeID,
  };
  var routes = routeIDsElem.data('routes') || {};
  if (routes[routeID]) {
    result.route = routes[routeID];
  }
  var history = routeIDsElem.data('history') || {};
  if (history[routeID]) {
    result.history = history[routeID];
  }
  return result;
}

function getLogAscentAscentStore(modal)  {
  var page = getLogAscentPage(modal);
  if (!page) {
    return undefined;
  }
  var ascentIDsElem = modal.find('.target-ascentIDs');
  if (!ascentIDsElem) {
    return undefined;
  }
  var ascentIDs = ascentIDsElem.data('ascentIDs')
  if (!ascentIDs) {
    return undefined;
  }
  var ascents = ascentIDsElem.data('ascents')
  if (!ascents) {
    return undefined;
  }
  var isUpdated = ascentIDsElem.data('isUpdated')
  if (!isUpdated) {
    return undefined;
  }
  return {
    ascentID: ascentIDs[page-1],
    ascent: ascents[page-1],
    changed: isUpdated[page-1],
  };
}

var logAscentAscentDefaultsKey = '/ascent-defaults';
var logAscentAdvancedOptionKey = '/ascent-advanced-option';

function setMemorizeAscentDefaults(ascent) {
  if ( tcSetLocalStorageMemorize !== undefined) {
    var ttl = 3 * 60 * 60 * 1000; // 3 hours
    var tag = ascent.tag;
    var ecopoint = tag && tag['Journey'] && tag['Journey']['Ecopoint'];
    var tags = ecopoint ? {Journey:{Ecopoint:1}} : undefined;
    tcSetLocalStorageMemorize(
      logAscentAscentDefaultsKey,
      {
        account: ascent.account,
        with: ascent.with,
        date: ascent.date,
        tags: tags,
      },
      ttl
    );
  }
}

function getMemorizeAscentDefaults(acctid) {
  if ( tcGetLocalStorageMemorizeObject !== undefined) {
    var memorizedDefaults = tcGetLocalStorageMemorizeObject(
      logAscentAscentDefaultsKey
    );

    if (!memorizedDefaults || memorizedDefaults.account !== acctid) {
      return undefined;
    }

    return memorizedDefaults;
  }
}

function setMemorizeAscentAdvancedOption(acctid,isSet) {
  if ( tcSetLocalStorageMemorize !== undefined) {
    var ttl = 3 * 60 * 60 * 1000; // 3 hours
    tcSetLocalStorageMemorize(
      logAscentAdvancedOptionKey,
      {
        account: acctid,
        advanced: isSet,
      },
      ttl
    );
  }
}

function getMemorizeAscentAdvancedOption(acctid) {
  if ( tcGetLocalStorageMemorizeObject !== undefined) {
    var memorizedAdvancedOptions = tcGetLocalStorageMemorizeObject(
      logAscentAdvancedOptionKey
    );

    if (!memorizedAdvancedOptions || memorizedAdvancedOptions.account !== acctid) {
      return undefined;
    }

    return memorizedAdvancedOptions.advanced;
  }
}

function completeLogAscentModal_success(modal,data,shouldClone,timeout) {
  $('body').trigger('crag.save.stop');
  if (timeout)  {
    clearTimeout(timeout);
  }
  var ascent = mapReturnedAscentToStoreAscent(data.data);
  var ascentID = data.data.ascent || data.ok.ascentID;
  storeAscentForNavigation(modal,ascentID,ascent,false);
  var nextPage = getLogAscentNextPage(modal,shouldClone);
  if (nextPage) {
    var loadId = generateUUID();
    modal.data('load-id',loadId);
    var clonedAscent = undefined;
    if (shouldClone) {
      clonedAscent = ascent;
      updateHistorySummary(modal,data.data.node,data.data.difficultyFeedback);
    }
    getAscentModalPage(modal, nextPage, clonedAscent, getAscentModalReadyPageCallback);
  } else {
    modal.off('hidden');
    modal.modal('hide');
    showSuccessLogAscentModal(data);
  }
}

function updateTickTypeOnMainPage(nodeID,tick){
  $('[data-nid=' + nodeID + '] .tick').html('<span class="tick_' + tick + '"></span>');
  $('[data-nid=' + nodeID + ']').data('route-tick-history',{status: 'present'}).removeClass('selected').find('input[type=checkbox][name="D:AscentNodeID"]:checked').prop("checked", false);
}

function mapReturnedAscentToStoreAscent(ascent){
  var fields = [
    'date',
    'with',
    'tick',
    'climbedGearStyle',
    'quality',
    'comment',
    'privateComment',
    'label',
    'grade',
    'gradeSystem',
    'altGrade',
    'altGradeSystem',
    'heightText',
    'numberAttempts',
    'tag',
    'pitch',
  ];
  var mapped = {};
  for (var f of fields) {
    if (ascent[f] !== undefined) {
      switch (f) {
        case 'quality':
          mapped['qualityLabel'] = ascent[f];
          break;
        case 'tag':
          mapped['tags'] = ascent[f];
          break;
        case 'comment':
          mapped['markdown'] = ascent[f];
          break;
        case 'privateComment':
          mapped['privateMarkdown'] = ascent[f];
          break;
        case 'tick':
          mapped['tick'] = {label: ascent[f]};
          break;
        case 'pitch':
          for (var pitch of ascent[f]) {
            pitch['tick'] = {label: pitch['tick']};
            if (pitch['heightText']) {
              pitch['height'] = pitch['heightText']
            }
            if (pitch['comment']) {
              pitch['markdown'] = pitch['comment']
            }
          }
          mapped['pitch'] = ascent[f];
          break;
        default: 
          mapped[f] = ascent[f];
      }
    }
  }
  return mapped;
}

function completeLogAscentModal_save(modal,ascent,shouldClone,timeout) {
  var ascentFn = ascent.ascent ? updateAscent : logAscent;
  ascentFn(ascent,function(data){
    updateFeedbackFooter('');
    if (ascent.node && ascent.tick){
      updateTickTypeOnMainPage(ascent.node,ascent.tick);
    }
    completeLogAscentModal_success(modal,data,shouldClone,timeout);
  },function(jqXHR,sts,err){
    updateFeedbackFooter('');
    modal.find('.action-btn').removeClass('disabled');
    var respText = jqXHR.responseText;
    const data = (function(raw) {
      try {
        return JSON.parse(raw);
      } catch (err) {
        return undefined;
      }
    })(respText);
    var error = (data && data.error) || {};
    if (error.externalUuidError && error.externalUuidError.match(/already logged/)) {
      alert("Ascent saved, but networking issue means we need to reload page.");
      location.reload();
    } else {
      alert("api post error: " + err + ":" + sts + ":" + respText);
    }
    $('body').trigger('crag.save.stop');
  });
}



function completeLogAscentModal_nav(modal,button,direction){
  if ( !button.hasClass('disabled') )   {
    var ascent = getAscentModalAscentDetails(modal);
    if (ascent)   {
      var ascentId = modal.find('.target-ascent').data('ascentID');
      const changed = !!ascentId && !modal.find(".fn-complete-log-ascent").hasClass('disabled');
      storeAscentForNavigation(modal,undefined,ascent,changed);
      var page = getLogAscentPage(modal);
      if (direction === 'forward') {
        page = page + 1;
      } else {
        page = page - 1;
      }
      getAscentModalPage(modal, page, undefined ,getAscentModalReadyPageCallback);
    } else {
      alert('Missing form data');
    }
  }
}

function completeLogAscentModal_ajax(modal,button,shouldClone){
  if ( !button.hasClass('disabled') )   {
    modal.find('.action-btn').addClass('disabled');
    var ascent = getAscentModalAscentDetails(modal);
    if (ascent)   {
      if (!ascent.id) {
        setMemorizeAscentDefaults(ascent);
      }
      var timeout = setTimeout(function() {
        if (button.hasClass('disabled')) {
          var feedbackFooter = updateFeedbackFooter('<a href="#" class="btn fn-ascent-modal-reload">'+thecrag.getText('process.button.resave')+'</a>');
          feedbackFooter.find(".fn-ascent-modal-reload").unbind('click').bind('click',function(e){
            e.preventDefault();
            completeLogAscentModal_save(modal,ascent,shouldClone,undefined);
          }); 
        }
      }, RELOAD_ASCENT_TIMEOUT); 
      $('body').trigger('crag.save.start');
      completeLogAscentModal_save(modal,ascent,shouldClone,timeout);
    } else {
      alert('Missing form data');
    }
  }
}

function getAscentModalDifficultyFeedback(modal) {
  var difficultyFeedback = [];
  modal.find('.difficulty-wrapper').each(function(){
    var difficultyElement = $(this);
    var selectedDifficulty = difficultyElement.find('.difficulty-rating-selected');
    var gradeElem = selectedDifficulty.find('.difficulty-rating-item-grade');
    var suggestedGrade = gradeElem.data('grade');
    var feedbackGrade = difficultyElement.data('feedback-grade');
    var difficultyRating = selectedDifficulty.data('difficulty-rating');
    if (difficultyRating && suggestedGrade) {
      difficultyFeedback.push({
        gradeSystem: feedbackGrade.gradeSystem,
        grade: feedbackGrade.grade,
        difficulty: difficultyRating,
        suggestedGrade: suggestedGrade,
      });
    }
  });
  return difficultyFeedback;
}

function getAscentModalAscentDetails(modal) {
  var acctid = $('body').data('uid');
  var routeData = getLogAscentRouteID(modal);
  var nodeid = routeData.routeID;
  if (!acctid || !nodeid) {
    return undefined;
  }

  var ascentId = modal.find('.target-ascent').data('ascentID');

  var date = undefined;
  var dateToday = modal.find('.date-today');
  var dateSelect = modal.find('.date-select');
  var dateInput = modal.find('.date-input');
  if (dateToday.is(":visible"))   {
    date = dateToday.data('date');
  } else if (dateSelect.is(":visible"))   {
    date = dateSelect.val();
  } else if (dateInput.is(":visible"))   {
    date = dateInput.val();
  }

  if (date) {
    modal.find('.date-wrapper').data('default-date', date);
  }

  var whoWith = getAscentModalWhoWithFieldValue(modal,'who-with');

  var quality = modal.find(".quality-selected").data('quality-rating');

  var difficultyFeedback = getAscentModalDifficultyFeedback(modal);

  var comment = modal.find('#ascent-input-public-comment').val();

  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');

  var climbedGearStyle = ascentTickWrapperElem.find('.gear-style-selected').data('gear-style');

  var tick = getAscentModalTickValue(modal);

  var tag = getAscentModalTagsFieldValue(modal);

  var ascent = {
    account: acctid,
    node: nodeid,
    date: date,
    with: whoWith,
    climbedGearStyle: climbedGearStyle,
    tick: tick || 'tick',
    quality: quality,
    difficultyFeedback: difficultyFeedback,
    comment: comment,
    tag: tag || {},
  };

  if (ascentId) {
    ascent.ascent = Number(ascentId);
  } else {
    ascent.externalUuid = modal.data('load-id');
  }

  var logPitchesElement = $("#log-ascent-modal input[type=checkbox][name=log-pitches]");
  if (logPitchesElement) {
    if (logPitchesElement.data('ascent-has-pitches')) {
      ascent.pitch = []; // initialise to delete pitches if not set
    }
    if (logPitchesElement.is(':checked') && logPitchesElement.is(":visible")) {
      var pitches = []
      var multiPitchElement = modal.find(".multi-pitch-wrapper");
      multiPitchElement.find('.ascent-pitch').each(function(){
        var elem = $(this);
        var pitch = getAscentModalPitchFields(elem);
        if (pitch) {
          pitches.push(pitch);
        }
      }); 
      ascent.pitch = pitches;
    }
  }

  var numberAttempts = modal.find('.number-attempts').val();
  if (numberAttempts) {
    ascent.numberAttempts = numberAttempts;
  }

  Object.assign(ascent,getAscentModalAdvancedFields(modal,!ascentId));

  ascent.version = 2;

  return ascent;
}

function getAscentModalTickValue(modal) {
  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');
  var tick = undefined;
  var tickSelector = ascentTickWrapperElem.find('.ascent-tick-selector');
  if (tickSelector.length) {
    tick = ascentTickWrapperElem.find('.tick-selected').data('tick');
  }
  return tick;
}

function getAscentModalTagsFieldValue(modal) {
  var initialTags = modal.find(".ascent-tags-wrapper").data("initial-tags");
  var tagsElem = modal.find('.ascent-tags');
  if (tagsElem.length > 0) {
    var milestone = {};
    var initMilestone = initialTags['Milestone'];
    var journey = {};
    var initJourney = initialTags['Journey'];
    var wearable = {};
    var initWearable = initialTags['Wearable'];
    var protection = {};
    var initProtection = initialTags['Protection'];
    var data = tagsElem.select2('data');
    if (data.length > 0) {
      for (var t of data) {
        var tag = t.id;
        if (tag === 'FA') {
          milestone[tag] = 1;
        } 
        if (tag === 'Ecopoint') {
          journey[tag] = 1;
        } 
        if (tag === 'Gear on') {
          protection[tag] = 1;
        } 
        if (tag === 'Kneepad' || tag === 'Crack glove') {
          wearable[tag] = 1;
        } 
      }
    }
    for (var tag of Object.keys(initMilestone || {})) {
      if (!milestone[tag]) {
        milestone[tag] = 0;
      }
    }
    for (var tag of Object.keys(initJourney || {})) {
      if (!journey[tag]) {
        journey[tag] = 0;
      }
    }
    for (var tag of Object.keys(initWearable || {})) {
      if (!wearable[tag]) {
        wearable[tag] = 0;
      }
    }
    for (var tag of Object.keys(initProtection || {})) {
      if (!protection[tag]) {
        protection[tag] = 0;
      }
    }
    if ( Object.keys(milestone).length > 0 || Object.keys(journey).length > 0 || Object.keys(wearable).length > 0 || Object.keys(protection).length > 0) {
      var tags = {};
      if ( Object.keys(milestone).length > 0) {
        tags = Object.assign(tags, {
          Milestone: milestone,
        });
      }
      if ( Object.keys(journey).length > 0) {
        tags = Object.assign(tags, {
          Journey: journey,
        });
      }
      if ( Object.keys(wearable).length > 0) {
        tags = Object.assign(tags, {
          Wearable: wearable,
        });
      }
      if ( Object.keys(protection).length > 0) {
        tags = Object.assign(tags, {
          Protection: protection,
        });
      }
      return tags;
    }
  }
  return undefined;
}

function getAscentModalWhoWithFieldValue(modal,whoField) {
  var whoWith = modal.find('.'+whoField);
  if (whoWith.length > 0) {
    var who_arr = whoWith.select2('data').map(function(w){
      return w.id;
    });
    var who = [];
    for (var who_elem of who_arr) {
      who_trim = who_elem.trim();
      if (who_trim) {
        who.push(who_trim);
      }
    }
    return who.join(', ');
  }
  return undefined;
}

function getAscentModalAdvancedFields(modal,removeNullFields) {
  var advancedFields = {};

  var privateComment = modal.find('#ascent-input-private-comment').val();
  advancedFields.privateComment = privateComment;

  var gradeWrapper = modal.find('.grade-wrapper');
  if (gradeWrapper.length) {
    var grade = gradeWrapper.find('.grade-override-grade').val();
    var gradeSystem = gradeWrapper.find('.grade-override-grade-system').val();

    advancedFields.gradeSystem = gradeSystem || '';
    advancedFields.grade = grade || '';

    var altGrade = gradeWrapper.find('.grade-override-alt-grade').val();
    var altGradeSystem = gradeWrapper.find('.grade-override-alt-grade-system').val();

    advancedFields.altGradeSystem = altGradeSystem || '';
    advancedFields.altGrade = altGrade || '';
  }

  var label = modal.find('.ascent-label').val() || '';
  advancedFields.label = label;

  var heightText = modal.find('.ascent-height-text').val() || '';
  advancedFields.heightText = heightText;

  if (!removeNullFields) {
    return advancedFields;
  }
  
  var nonNull = {};
  Object.entries(advancedFields)
  for (var entry of Object.entries(advancedFields)) {
    var param = entry[0];
    var value = entry[1];
    if (Array.isArray(value)) {
      if (value.length > 0) {
        nonNull[param] = value;
      }
    } else if (value instanceof Object) {
      if (Object.keys(value).length > 0) {
        nonNull[param] = value;
      }
    } else {
      if (value) {
        nonNull[param] = value;
      }
    }
  }
  return nonNull;
}

function getAscentModalPitchFields(pitchElem){
  var pitchNumber = pitchElem.data('pitch-number');
  if (!pitchNumber || !pitchElem.data('should-log')) {
    return undefined;
  }

  var pitch = {
    number: pitchNumber
  };

  var climbedGearStyle = pitchElem.find('.gear-style-selected').data('gear-style');
  pitch.climbedGearStyle = climbedGearStyle;

  var tickSelector = pitchElem.find('.pitch-tick-selector');
  if (tickSelector.length) {
    var tick = tickSelector.find('.tick-selected').data('tick');
    if (tick) {
      pitch.tick = tick;
    }
  }

  var pitchHeightText = pitchElem.find('.ascent-pitch-height-text').val() || '';
  if (pitchHeightText !== '') {
    pitch.heightText = pitchHeightText;
  }

  var gradeWrapper = pitchElem.find('.pitch-grade-wrapper');
  if (gradeWrapper.length) {
    var grade = gradeWrapper.find('.grade-override-grade').val();
    var gradeSystem = gradeWrapper.find('.grade-override-grade-system').val();

    if (gradeSystem && grade) {
      pitch.gradeSystem = gradeSystem;
      pitch.grade = grade;
    }

    var altGrade = gradeWrapper.find('.grade-override-alt-grade').val();
    var altGradeSystem = gradeWrapper.find('.grade-override-alt-grade-system').val();

    if (altGradeSystem && altGrade) {
      pitch.altGradeSystem = altGradeSystem;
      pitch.altGrade = altGrade;
    }
  }

  var leadBy = getAscentModalWhoWithFieldValue(pitchElem,'lead-by');
  if (leadBy) {
    pitch.leadby = leadBy;
  }

  var pitchCommentWrapper = pitchElem.find('.pitch-comment-wrapper');
  if (pitchCommentWrapper.length) {
    pitch.comment = pitchCommentWrapper.find('.pitch-comment').val();
  }

  return pitch;
}

function showSuccessLogAscentModal(ascent){
  $("#success-log-ascent-modal").each(function(){
    var showDefaultDone = true
    var modal = $(this);
    modal.modal('show');
    // modal.find('pre').html(JSON.stringify(ascent, null, 2));
    showLogAscentSessionDoneResetSummaries(modal);
    var isFirstAscent = ascent.ok ? ascent.ok.isFirstAscent : 0
    var sessionStats = ascent.ok ? ascent.ok.eventStats : undefined;
    if (!isFirstAscent && sessionStats) {
      var best = sessionBestCPR(sessionStats);
      var cpr = best.bestCpr;
      if (cpr > 0) {
        showDefaultDone = false
        showLogAscentSessionDoneSessionSummary(modal,sessionStats);
        var attempts = sessionStats.attempts || 0
        if (attempts > 1) {
          getSessionAchievement(modal,sessionStats,showLogAscentSessionAchievement);
        }
      }
    }
    if (showDefaultDone) {
      showLogAscentSessionDoneWithoutSessionSummary(modal,isFirstAscent);
    }
  });
}

function sessionBestCPR(stats){
  var bestStat = '';
  var bestCprParam = '';
  var bestSetting = '';
  var bestType = 'unknown';
  var bestCpr = 0;
  if (stats.tradCpr && stats.tradCpr > bestCpr) {
    bestType = 'trad';
    bestCpr = stats.tradCpr;
    bestStat = 'tradCpr';
    bestCprParam = 'trad';
  }
  if (stats.sportCpr && stats.sportCpr > bestCpr) {
    bestType = 'sport';
    bestCpr = stats.sportCpr;
    bestStat = 'sportCpr';
    bestCprParam = 'sport';
  }
  if (stats.boulderCpr && stats.boulderCpr > bestCpr) {
    bestType = 'boulder';
    bestCpr = stats.boulderCpr;
    bestStat = 'boulderCpr';
    bestCprParam = 'boulder';
  }
  if (stats.gymSportCpr && stats.gymSportCpr > bestCpr) {
    bestSetting = 'gym';
    bestType = 'sport';
    bestCpr = stats.gymSportCpr;
    bestStat = 'gymSportCpr';
    bestCprParam = 'gymSport';
  }
  if (stats.gymBoulderCpr && stats.gymBoulderCpr > bestCpr) {
    bestSetting = 'gym';
    bestType = 'boulder';
    bestCpr = stats.gymBoulderCpr;
    bestStat = 'gymBoulderCpr';
    bestCprParam = 'gymBoulder';
  }
  return {
    bestSetting: bestSetting,
    bestType: bestType,
    bestCpr: bestCpr,
    bestStat: bestStat,
    bestCprParam: bestCprParam,
  }
}

function showLogAscentSessionDoneResetSummaries(modal) {
  modal.find('.session-success,.session-achievement,.session-summary').each(function(){
    var component = $(this);
    component.html('');
  });
}

function showLogAscentSessionDoneSessionSummary(modal, sessionStats){
  modal.find('.session-summary').each(function(){
    var component = $(this);
    var attempts = sessionStats.attempts || 0
    var success = sessionStats.success || 0
    var failed = attempts - success
    var best = sessionBestCPR(sessionStats);
    var type = thecrag.getText('dbconfig.route-gear-style.' + best.bestType);
    var cpr = best.bestCpr;
    var html = thecrag.getText('template.ascent-modal.session-summary',{
      attempts: attempts,
      success: success,
      failed: failed,
      type: type,
      cpr: cpr,
    });
    component.html('<p>' + html + '</p>');
  });
}

function showLogAscentSessionDoneWithoutSessionSummary(modal,isFirstAscent){
  modal.find('.session-success').each(function(){
    var component = $(this);
    if (isFirstAscent) {
      var isSupporter = modal.find('input[name=is-supporter]').val();
      showLogAscentSessionMilestone(component,'firstAscentLogged',isSupporter);
    } else {
      component.html('<p>' + thecrag.getText('template.ascent-modal.logged') + '</p>');
    }
  });
}

function showLogAscentSessionMilestone(component,milestoneType,isSupporter) {
  var headerImage = undefined;
  var headerText = undefined;
  var bodyHtmls = [];
  if (milestoneType === 'firstAscentLogged') {
    headerImage = '/static/cids/images/milestone-champion-1.1.0.svg';
    headerText = thecrag.getText('template.ascent-modal.milestone.is-first-ascent.header');
    bodyHtmls = [thecrag.getText('template.ascent-modal.is-first-ascent')];
    if (!isSupporter) {
      link = '<a href="/pay_as_you_feel">' + thecrag.getText('object.financial-supporter') + '</a>';
      bodyHtmls.push(thecrag.getText('system.become-a-supporter.pay-forward',{financialSupporter:link}));
    }
  }
  if (headerText && headerImage) {
    component.html('<div class="ascent-session-milestone"><div class="ascent-session-milestone-header"><img src="' + headerImage + '" /><span>' + headerText + '</span></div><div class="ascent-session-milestone-body"><p>' + bodyHtmls.join('</p><p>') + '</p></div></div>');
  }
}

function readDate(dateStr) {
  var m = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
  if (m) {
    var yy = m[1];
    var mm = m[2] - 1;
    var dd = m[3];
    return new Date(yy,mm,dd);
  }
  return undefined;
}

function daysBetween(d1, d2) {
 var oneDay = 24 * 3600 * 1000;
 return Math.round(Math.abs((d1.getTime() - d2.getTime()) / oneDay));
}

function showLogAscentSessionAchievement(modal,sessionStats,achievement){
  // modal.find('pre').html(JSON.stringify(achievement, null, 2));
  modal.find('.session-achievement').each(function(){
    var component = $(this);
    var sessionBest = sessionBestCPR(sessionStats);
    var sessionCpr = sessionBest.bestCpr;
    var sessionCprParam = sessionBest.bestCprParam;
    var sessionWhen = readDate(sessionStats.when);
    var sa = achievement.session;
    var html = '';
    var deltaTrigger = 300;
    var previousDaysTrigger = 31;
    var components = {};
    if (sa && sessionCpr && sessionCprParam && sessionWhen) {
      var previousId = undefined;
      var area = sa.area;
      if (area) {
        var previous = area.previous;
        if (previous) {
          previousId = previous.id;
          if (previous.cpr) {
            var previousCpr = previous.cpr[sessionCprParam];
            var previousWhen = readDate(previous.when);
            var daysAgo = daysBetween(sessionWhen,previousWhen);
            if (previousCpr && previousWhen && daysAgo <= previousDaysTrigger) {
              var deltaCpr = sessionCpr - previousCpr;
              var daysAgoText = daysAgo.toString() + ' ' + thecrag.getText('object.day',{},{count: daysAgo});
              if (deltaCpr >= -deltaTrigger)  {
                components['areaPrevDelta'] = thecrag.getText('template.ascent-modal.prev-area-session-summary',{
                  deltaCpr: deltaCpr >= 0 ? '+' + deltaCpr : deltaCpr,
                  approxGradeText: convertDeltaCprToGradeText(deltaCpr),
                  daysAgo: daysAgoText,
                });
              }
            }
          }
        }
        var areaBest = area.best;
        if (areaBest && areaBest.cpr && areaBest.id !== previousId) {
          var bestCpr = areaBest.cpr[sessionCprParam];
          var bestWhen = areaBest.when;
          if (sessionCpr >= bestCpr) {
            components['areaBestEver'] = thecrag.getText('template.ascent-modal.best-area-session-summary.best');
          } else {
            var deltaCpr = bestCpr - sessionCpr;
            if (deltaCpr <= deltaTrigger)  {
              components['areaBestDelta'] = thecrag.getText('template.ascent-modal.best-area-session-summary.below',{
                deltaCpr: deltaCpr,
                approxGradeText: convertDeltaCprToGradeText(deltaCpr),
                date: bestWhen,
              });
            }
          }
        }
      }
      var best = sa.best;
      if (best && best.cpr && best.id !== previousId) {
        var bestCpr = best.cpr[sessionCprParam];
        var bestWhen = best.when;
        if (sessionCpr >= bestCpr) {
          components['bestEver'] = thecrag.getText('template.ascent-modal.best-session-summary.best');
        } else {
          var areaName = best.node && best.node.name ? best.node.name : ''
          var deltaCpr = bestCpr - sessionCpr;
          if (deltaCpr <= deltaTrigger)  {
            components['bestDelta'] = thecrag.getText('template.ascent-modal.best-session-summary.below',{
              deltaCpr: deltaCpr,
              approxGradeText: convertDeltaCprToGradeText(deltaCpr),
              date: bestWhen,
              area: escapeHTML(areaName),
            });
          }
        }
      }
      var rules = [
        ['bestEver'],
        ['areaBestEver'],
        ['areaPrevDelta',['bestDelta','areaBestDelta']],
      ]
      for (let tags of rules) {
        for (let item of tags) {
          var content = undefined;
          if (typeof(item) === 'object') {
            for (let tag of item) {
              if (components[tag]) {
                content = components[tag];
                break;
              }
            }
          } else {
            content = components[item];
          }
          if (content) {
            html = html + '<p>' + content + '</p>';
          }
        }
        if (html) {
          break;
        }
      }
    }

    html = html + '<p><a href="/event/' + sessionStats.id + '">' + thecrag.getText('template.ascent-modal.go-to-session') + '</a></p>';
    component.html(html);
  });
}

function convertDeltaCprToGradeText(deltaCpr) {
  var deltaGrade = convertDeltaCprToGrade(deltaCpr);
  if (deltaGrade === 0) {
    return '';
  }
  if (deltaGrade > -1 && deltaGrade < 1) {
    return thecrag.getText('template.ascent-modal.approximate-grade-fraction',{
      deltaGrade: deltaGrade,
    });
  }
  if (deltaGrade === -1 || deltaGrade === 1) {
    return thecrag.getText('template.ascent-modal.approximate-grade',{
      deltaGrade: deltaGrade,
    });
  }
  return thecrag.getText('template.ascent-modal.approximate-grades',{
    deltaGrade: deltaGrade,
  });
}

function convertDeltaCprToGrade(deltaCpr) {
  if (!deltaCpr) {
    return 0;
  }
  var grade100 = Math.round(100 * deltaCpr / 120);
  if (grade100 < 10) {
    return grade100 / 100;
  }
  var grade10 = Math.round(grade100 / 10);
  if (grade10 < 20) {
    return grade10 / 10;
  }

  return Math.round(grade10 / 10);
}

function showLogAscentModal(dataList){
  if (dataList.length < 1) {
    return;
  }
  $("#log-ascent-modal").each(function(){
    var modal = $(this);
    modal.off('hidden');
    modal.on('hidden', function () {
      $('body').trigger('crag.load.stop-all');
    });
    var loadId = generateUUID();
    modal.data('load-id',loadId);
    modal.modal('show');
    modal.find('.action-btn').addClass('disabled');
    var pages = dataList.length;
    var pagesElement = modal.find('.modal-pagination-pages');
    pagesElement.html(pages);
    pagesElement.data('pages', pages);
    var paginationElement = modal.find('.modal-pagination');
    if (pages === 1) {
      paginationElement.hide();
    } else {
      paginationElement.show();
    }
    var ascents = [];
    var isUpdated = [];
    var routes = {};
    var history = {};
    var routeIDs = [];
    var fetchRouteIDs = [];
    var ascentIDs = [];
    for (var i = 0; i < dataList.length ; i++) {
      var item = dataList[i];
      routeIDs.push(item.routeID);
      if (item.route && item.route.id) {
        routes[item.route.id] = item.route;
      } else {
        fetchRouteIDs.push(item.routeID);
      }
      if (item.history && item.history.status === 'none') {
        history[item.route.id] = {status: 'none'};
      }
      if (item.ascentID) {
        ascentIDs.push(item.ascentID);
      }
    }
    if (routeIDs.length > 0 && (!ascentIDs.length || routeIDs.length === ascentIDs.length)) {
      var today = getToday();
      modal.find('.date-wrapper').data('default-date', today);
      var routeIDsElem = modal.find('.target-routeIDs');
      routeIDsElem.data('routeIDs', routeIDs);
      routeIDsElem.data('routes', routes);
      routeIDsElem.data('history', history);
      var ascentIDsElem = modal.find('.target-ascentIDs');
      ascentIDsElem.data('ascentIDs', ascentIDs);
      ascentIDsElem.data('ascents', ascents);
      ascentIDsElem.data('isUpdated', isUpdated);
      if (fetchRouteIDs.length > 0) {
        getAscentModalRoutes(modal, fetchRouteIDs, dataList, function(modal){
          getAscentModalPage(modal, 1, undefined, getAscentModalReadyPageCallback);
        });
      } else {
        getAscentModalPage(modal, 1, undefined, getAscentModalReadyPageCallback);
      }
    }
  });
}

function getToday() {
  var tzoffset = (new Date()).getTimezoneOffset()  * 60000;
  return (new Date(Date.now() - tzoffset)).toISOString().substring(0,10);
}

var cachedAscentModalAscentDefaults = {
};

function getAscentModalDefaultAscent(modal) {
  return jQuery.extend({ 
    tick: {},
  },cachedAscentModalAscentDefaults);
}

function formatStars(stars) {
  return '<span class="star">★</span>'.repeat(stars);
}

function formatRouteInfo(route) {
  var text =  '<span class="attr">';
  var seperator = '';

  if (route.hasOwnProperty('displayHeight')) {
    text += seperator + route.displayHeight[0]+route.displayHeight[1];
    seperator = ', ';
  }

  var pitches = 1;
  if (route.hasOwnProperty('pitches')) pitches = route.pitches;
  if (pitches > 1){
    text += seperator + '<span>' + pitches + '<i class="icon-pitches"></i></span>';
    seperator = ', ';
  }

  if (route.hasOwnProperty('bolts')) {
    text += seperator + '<span class="bolts iblock" >';
    text += '<span class="clip"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 11 18" width="11" height="18"><path d="m8,17 0,-2 c1,0 2,-1 2,-2 l0,-9 c0,-2 -2,-3 -4,-3 -4,0 -5,3 -5,5 0,1 1,1.5 1.5,1.5 0.5,1.5 0.5,2.5 1,4 C2,13.4 5,15.4 6,15.4 l0,2 z M3,6.4 c0,0 0,-3 3,-3 1,0 2,0 2,2 l0,7 c0,1 -1,1 -2,1 -1,0 -2,-2 -2,-2 l -1,-5" style="fill:currentColor"></path></svg></span>';
    text += route.bolts + '</span>';
  }

  text += '</span>'
  return text;
}

function formatGearStyle(styleStub) {
  var stub = styleStub || 'unknown';
  var text = thecrag.getTextUC('dbconfig.route-gear-style.' + stub);
  return '<span class="tags ' + stub + '">' + text + '</span>';
}

function setAscentModalRouteInfo(modal, route) {
  var routeElem = modal.find('.target-route');
  routeElem.data('route', route);
  if (route.name) {
    var titleElem = modal.find('#log-ascent-modal_label');
    titleElem.html(tcFormatGradeAtom(route.gradeAtom || {}) + ' ' + formatStars(route.stars) + ' ' + escapeHTML(route.name) + ' ' + formatGearStyle(route.styleStub) + ' ' + formatRouteInfo(route));
  }
  if (!route.context) {
    alert("no route context grade fields will not function correctly");
  }
  modal.find('#log-ascent-modal__grade-context').val(route.context);
}

function setAscentModalAscentInfo(modal, loadedAscent, route, summary) {
  var ascent = loadedAscent.ascent;
  var ascentElem = modal.find('.target-ascent');
  if (ascent.id) {
    ascentElem.data('ascentID', ascent.id);
  } else {
    ascentElem.removeData('ascentID');
  }
  initializeAscentModal(modal,loadedAscent,route,summary);
}

function getAscentModalReadyPageCallback(modal,loadedAscent,route,summary) {
  var ascent = loadedAscent.ascent;
  setAscentModalRouteInfo(modal, route);
  setAscentModalAscentInfo(modal, loadedAscent, route, summary);
  setAscentModalButtonUpdates(modal, loadedAscent);
}


function setAscentModalNavButtonsStatus(modal) {
  var pages = getLogAscentPages(modal);
  var navButtons = modal.find(".fn-log-ascent-nav-forward,.fn-log-ascent-nav-back");
  if (pages > 1) {
    var page = getLogAscentPage(modal);
    if (page === pages) {
      modal.find(".fn-log-ascent-nav-back").removeClass('disabled');
      modal.find(".fn-log-ascent-nav-forward").addClass('disabled');
    } else if (page === 1) {
      modal.find(".fn-log-ascent-nav-back").addClass('disabled');
      modal.find(".fn-log-ascent-nav-forward").removeClass('disabled');
    } else {
      navButtons.removeClass('disabled');
    }
    navButtons.show();
    var paginationElement = modal.find('.modal-pagination');
    paginationElement.show();
  } else {
    navButtons.addClass('disabled').hide();
  }
}

function setAscentModalButtonUpdates(modal,loadedAscent) {
  setAscentModalNavButtonsStatus(modal);
  if ( loadedAscent.ascent.id ) {
    var btn = modal.find(".fn-complete-log-ascent");
    btn.html(thecrag.getText('process.button.update-ascent'));
    if (loadedAscent.changed) {
      btn.removeClass('disabled');
    } else {
      btn.addClass('disabled');
    }
  } else {
    modal.find(".fn-complete-log-ascent").removeClass('disabled').html(thecrag.getText('process.button.log-ascent.one'));
  }
}

function getSessionAchievement(modal,sessonEventStats,callback) {
  var best = sessionBestCPR(sessonEventStats);
  var statType = best.bestStat;
  if (statType) {
    $('body').trigger('crag.load.start');
    updateFeedbackDetails('session',thecrag.getText('template.ascent-modal.getting-session-summary') + ' ...');
    $.get('/api/stream-event/' + sessonEventStats.id + '/achievement?cookieAuth=1&stat-type=' + statType,null,function(data){
      updateFeedbackDetails('session',thecrag.getText('template.ascent-modal.getting-session-summary') + ' ... ' + thecrag.getText('process.button.done'));
      var summary = data.data;
      callback(modal,sessonEventStats,summary);
      $('body').trigger('crag.load.stop');
    })
  }
}

function getAscentModalSummaryCallback(modal,loadedAscent,route,callback) {
  // modal.find('pre').html(JSON.stringify(route, null, 2));
  var routeData = getLogAscentRouteID(modal);
  var summary = undefined;
  if ( routeData && routeData.history ) {
    if ( routeData.history.status === 'none' ) {
      summary = {};
    } else if ( routeData.history.status === 'loaded') {
      summary = routeData.history.summary;
    }
  }
  if (summary) {
    callback(modal,loadedAscent,route,summary);
  } else {
    var loadId = modal.data('load-id');
    $('body').trigger('crag.load.start');
    updateFeedbackDetails('history',thecrag.getText('template.ascent-modal.getting-your-route-history') + ' ...');
    $.get('/api/node/id/'+route.id+'/mysummary?cookieAuth=1',null,function(data){
      if (loadId !== modal.data('load-id')) {
        return
      }
      updateFeedbackDetails('history',thecrag.getText('template.ascent-modal.getting-your-route-history') + ' ... ' + thecrag.getText('process.button.done'));
      var summary = data.data || {};
      if (data.data) {
        setHistorySummary(modal,route.id,summary);
      }
      callback(modal,loadedAscent,route,summary);
      $('body').trigger('crag.load.stop');
    })
  }
}


function getAscentModalPageAscentCallback(modal,loadedAscent,callback) {
  // modal.find('pre').html(JSON.stringify(loadedAscent, null, 2));
  var routeData = getLogAscentRouteID(modal);
  var routeID = routeData.routeID;
  var route = routeData.route;
  var loadId = modal.data('load-id');
  if (route) {
    getAscentModalSummaryCallback(modal,loadedAscent,route,callback)
  } else {
    $('body').trigger('crag.load.start');
    updateFeedbackDetails('route',thecrag.getText('template.ascent-modal.getting-route-details') + ' ...');
    DAO.getNode(routeID,function(route){
      if (loadId !== modal.data('load-id')) {
        return
      }
      updateFeedbackDetails('route',thecrag.getText('template.ascent-modal.getting-route-details') + ' ... ' + thecrag.getText('process.button.done'));
      getAscentModalSummaryCallback(modal,loadedAscent,route,callback)
      $('body').trigger('crag.load.stop');
    },'pitch');
  }
}

function getAscentModalPage(modal, page, initAscent, callback) {
  setLogAscentPage(modal,page);
  var loadedAscent = {
    ascentID: undefined,
    ascent: initAscent,
    isNew: false,
    changed: false,
  };
  if (!initAscent) {
    var storedAscent = getLogAscentAscentStore(modal);
    if (storedAscent) {
      loadedAscent = {
        ascentID: storedAscent.ascentID,
        ascent: storedAscent.ascent,
        isNew: !storedAscent.ascent,
        changed: storedAscent.changed,
      };
    }
  }
  if (loadedAscent.ascentID && !loadedAscent.ascent) {
    var loadId = modal.data('load-id');
    $('body').trigger('crag.load.start');
    updateFeedbackDetails('ascent',thecrag.getText('template.ascent-modal.getting-ascent-details') + ' ...');
    DAO.getAscent(loadedAscent.ascentID,function(ascent){
      if (loadId !== modal.data('load-id')) {
        return
      }
      updateFeedbackDetails('ascent',thecrag.getText('template.ascent-modal.getting-ascent-details') + ' ... ' + thecrag.getText('process.button.done'));
      loadedAscent = {
        ascentID: loadedAscent.ascentID,
        ascent: ascent,
        isNew: false,
        changed: false,
      };
      getAscentModalPageAscentCallback(modal,loadedAscent,callback);
      $('body').trigger('crag.load.stop');
    });
  } else {
    if (loadedAscent.ascent && loadedAscent.ascentID) {
      loadedAscent.ascent.id = loadedAscent.ascentID;
    }
    if (!loadedAscent.ascent) {
      loadedAscent = {
        ascentID: loadedAscent.ascentID,
        ascent: getAscentModalDefaultAscent(modal),
        isNew: true,
        changed: false,
      };
    }
    getAscentModalPageAscentCallback(modal,loadedAscent,callback);
  }
}

function enableLogAscentToday(isoDate) {
  var elem =  $("#log-ascent-modal .date-today")
  elem.val(thecrag.getTextUC('system.relative-time.today') + ' (' + isoDate + ')').data('date', isoDate).show().unbind('click').bind('click',function(event){
    elem.hide();
    enableSelectDate(isoDate);
  });
}

function enableSelectDate(isoDate) {
  var selectElem = $("#log-ascent-modal .date-select");
  var partialButtonElem = $("#log-ascent-modal .fn-unlock-date-for-partial");
  selectElem.val(isoDate).show();
  partialButtonElem.show().unbind('click').bind('click',function(event){
    selectElem.hide();
    partialButtonElem.hide();
    var curDate = selectElem.val();
    enableInputDate(curDate);
  });
}

function enableInputDate(isoDate) {
  $("#log-ascent-modal .date-input").val(isoDate).show();
}

function initializeAscentModalDates(modal,onUpdateAscent,isNew,ascent,memorizedDate){
  modal.find('.date-today, .date-select, .date-input, .fn-unlock-date-for-partial').hide();
  modal.find('.date-select, .date-input').unbind('change').bind('change',onUpdateAscent);
  var today = getToday();
  var defaultDate = modal.find('.date-wrapper').data('default-date')
  var ascentDate = '';
  if (!isNew && ascent) {
    ascentDate = ascent.date ? ascent.date.substring(0,10) : '';
  } else {
    ascentDate = (memorizedDate || defaultDate).substring(0,10);
    if (ascentDate.match(/^\d\d\d\d$/)) {
      ascentDate = ascentDate + '-00';
    }
    if (ascentDate.match(/^\d\d\d\d-\d\d?$/)) {
      ascentDate = ascentDate + '-00';
    }
  }
  if (today === ascentDate) {
    enableLogAscentToday(today);
  } else if (ascentDate.match(/00$/)) {
    enableInputDate(ascentDate);
  } else {
    enableSelectDate(ascentDate);
  }
}

function initializeAscentModalWhoWith(modal,onUpdateAscent,isNew,ascent,memorizedWith){
  var prevWhoWith = getAscentModalWhoWithFieldValue(modal,'who-with');
  var urole = $('body').data('urole');
  var onlyCom = '';
  if (urole == 'Licensee Community Account Moderator') {
    onlyCom = ' data-only-community="true" ';
    $("#log-ascent-modal .who-with-wrapper").parent().siblings("label").text("For Community Account");
  }
  $("#log-ascent-modal .who-with").remove();
  $("#log-ascent-modal .who-with-wrapper").prepend(`<input type="text" class="who-with" name="who-with" ${onlyCom}  data-without-you="true" />`);
  var withElem = $("#log-ascent-modal .who-with");
  if (!isNew && ascent) {
    withElem.val(ascent.with);
  } else if (memorizedWith) {
    withElem.val(memorizedWith);
  } else {
    withElem.val(prevWhoWith);
  }
  initialiseSelect2ClimberCompletions(withElem);
  withElem.unbind('change').bind('change',onUpdateAscent);
}

function availableTickGearStyles(routeStyleStub) {
  var routeStub = routeStyleStub || 'unknown';
  switch (routeStub) {
    case 'trad':
      return [
        "trad",
        "second",
        "top-rope",
        "solo",
        "aid",
      ];
    case 'sport':
      return [
        "trad",
        "sport",
        "second",
        "top-rope",
        "solo",
        "aid",
      ];
    case 'top-rope':
      return [
        "trad",
        "top-rope",
        "solo",
      ];
    case 'aid':
      return [
        "trad",
        "sport",
        "aid",
        "solo",
      ];
    case 'boulder':
      return [
        "boulder",
        "trad",
        "top-rope",
      ];
    case 'dws':
      return [
        "dws",
        "trad",
        "top-rope",
      ];
    case 'ice':
      return [
        "ice",
        "sport",
        "trad",
        "top-rope",
      ];
    case 'via-ferrata':
      return [
        "via-ferrata",
        "sport",
        "trad",
      ];
    case 'alpine':
      return [
        "alpine",
        "aid",
      ];
  }
  return [
    "trad",
    "sport",
    "second",
    "boulder",
    "dws",
    "top-rope",
    "solo",
    "aid",
    "alpine",
    "ice",
    "via-ferrata",
  ];
}

function availableTickQualityRatings() {
  return [
    "crap",
    "poor",
    "average",
    "good",
    "excellent",
    "classic",
    "megaclassic",
  ];
}

function extraIconTextsForQualityRatings() {
  return {
    crap: '',
    poor: '',
    average: '',
    good: '★',
    excellent: '★★',
    classic: '★★★',
    megaclassic: '★★★➕',
  }
}

function availableDifficultyFeedbackRatings() {
  return [
    "soft",
    "easy",
    "average",
    "hard",
    "sand",
  ];
}

function ascentModalGetDefaultTickType(routeStyleStub) {
  var routeStub = routeStyleStub || 'unknown';
  switch (routeStub) {
    case 'trad':
      return 'redpoint';
    case 'sport':
      return 'redpoint';
    case 'boulder':
      return 'send';
    case 'top-rope':
      return 'clean';
    case 'second':
      return 'clean';
    case 'solo':
      return 'redpoint';
    case 'dws':
      return 'redpoint';
    case 'aid':
      return 'tick';
    case 'ice':
      return 'redpoint';
    case 'alpine':
      return 'tick';
    case 'via-ferrata':
      return 'tick';
  }
  return 'tick';
}

function ascentModalMappedTickTypes(routeStyleStub,climbedStyleStub,tickType) {
  var routeStub = routeStyleStub || 'unknown';
  var climbedStub = climbedStyleStub || routeStub;
  if (routeStub === 'sport' && climbedStub === 'trad') {
    switch (tickType) {
      case 'onsight':
        return 'greenpointonsight';
      case 'flash':
        return 'greenpointflash';
      case 'redpoint':
        return 'greenpoint';
    }
  } else if (climbedStub === 'sport') {
    switch (tickType) {
      case 'greenpointonsight':
        return 'onsight';
      case 'greenpointflash':
        return 'flash';
      case 'greenpoint':
        return 'redpoint';
    }
  } else if (climbedStub === 'boulder') {
    switch (tickType) {
      case 'tick':
        return 'send';
    }
  } else if (climbedStub === 'second') {
    switch (tickType) {
      case 'second':
        return 'tick';
      case 'secondclean':
        return 'clean';
      case 'secondrest':
        return 'dog';
    }
  } else if (climbedStub === 'top-rope') {
    switch (tickType) {
      case 'topropeonsight':
        return 'onsight';
      case 'topropeflash':
        return 'flash';
      case 'topropeclean':
        return 'clean';
      case 'toproperest':
        return 'dog';
      case 'toprope':
        return 'tick';
    }
  } else if (climbedStub === 'solo') {
    switch (tickType) {
      case 'onsightsolo':
        return 'onsight';
      case 'solo':
        return 'redpoint';
    }
  } else {
    switch (tickType) {
      case 'deepwatersolo':
        return 'redpoint';
      case 'aid':
        return 'tick';
      case 'viaferrata':
        return 'tick';
    }
  }
  return tickType
}

function availableTickTypes(routeStyleStub,climbedStyleStub) {
  var routeStub = routeStyleStub || 'unknown';
  var climbedStub = climbedStyleStub || routeStub;
  switch (climbedStub) {
    case 'trad':
      var trad = []
      if (routeStub === 'sport') {
        trad = trad.concat([
          'greenpointonsight',
          'greenpointflash',
          'greenpoint',
        ]);
      } else {
        trad = trad.concat([
          'onsight',
          'flash',
          'redpoint',
        ]);
      }
      return trad.concat([
        'pinkpoint',
        'dog',
        'allfreewithrest',
        'groundupredpoint',
        'leadsolo',
        'working',
        'attempt',
        'retreat',
        'tick',
      ]);
    case 'sport':
      return [
        'onsight',
        'flash',
        'redpoint',
        'pinkpoint',
        'dog',
        'allfreewithrest',
        'groundupredpoint',
        'leadsolo',
        'working',
        'attempt',
        'retreat',
        'tick',
      ];
    case 'boulder':
      return [
        'onsight',
        'flash',
        'send',
        'repeat',
        'dab',
        'working',
        'attempt',
      ];
    case 'top-rope':
      return [
        'onsight',
        'flash',
        'clean',
        'dog',
        'ropedsolo',
        'attempt',
        'tick',
      ];
    case 'second':
      return [
        'onsight',
        'flash',
        'clean',
        'dog',
        'attempt',
        'tick',
      ];
    case 'solo':
      return [
        'onsight',
        'flash',
        'redpoint',
        'attempt',
        'retreat',
        'tick',
      ];
    case 'dws':
      return [
        'onsight',
        'flash',
        'redpoint',
        'working',
        'attempt',
        'tick',
      ];
    case 'aid':
      return [
        'onsight',
        'flash',
        'tick',
        'aidsolo',
        'working',
        'attempt',
        'retreat',
      ];
    case 'ice':
      return [
        'onsight',
        'flash',
        'redpoint',
        'working',
        'attempt',
        'retreat',
        'tick',
      ];
    case 'alpine':
      return [
        'tick',
        'attempt',
        'retreat',
      ];
    case 'via-ferrata':
      return [
        'tick',
        'attempt',
        'retreat',
      ];
  }
  return ['tick', 'attempt'];
}

function buildAscentModalTickMeaningKey(style,tickType){
  var key = 'tick-meaning.tick-type.'+tickType;
  var suffix = undefined;
  switch (style) {
    case 'boulder':
      switch (tickType) {
        case 'onsight':
        case 'flash':
          suffix = 'bouldering';
          break;
      }
      break;
    case 'top-rope':
      switch (tickType) {
        case 'onsight':
        case 'flash':
        case 'clean':
        case 'dog':
          suffix = 'top-roping';
          break;
      }
      break;
    case 'second':
      switch (tickType) {
        case 'onsight':
        case 'flash':
        case 'clean':
        case 'dog':
          suffix = 'seconding';
          break;
      }
      break;
    case 'aid':
      switch (tickType) {
        case 'onsight':
        case 'flash':
        case 'tick':
          suffix = 'aid';
          break;
      }
      break;
    case 'solo':
      switch (tickType) {
        case 'onsight':
        case 'flash':
        case 'redpoint':
          suffix = 'freesoloing';
          break;
      }
      break;
  }
  if (suffix) {
    return key + '.' + suffix
  }
  return key
}

function buildAscentModalTickDescription(modal,elem,climbedGearStyle,selectedTickType){
  var descElem = elem.find(".tick-description-wrapper");
  if (descElem.length > 0){
    descElem.text('');
    var key = buildAscentModalTickMeaningKey(climbedGearStyle,selectedTickType);
    if (tc_translate.keys[key]) {
      descElem.text(thecrag.getText(key));
    } else {
      updateFeedbackDetails('translation',thecrag.getText('template.ascent-modal.getting-translation-text') + ' ...');
      var loadId = modal.data('load-id');
      $('body').trigger('crag.load.start');
      DAO.getTranslation(key,function(text){
        if (loadId !== modal.data('load-id')) {
          return
        }
        updateFeedbackDetails('translation',thecrag.getText('template.ascent-modal.getting-translation-text') + ' ... ' + thecrag.getText('process.button.done'));
        descElem.text(text);
        $('body').trigger('crag.load.stop');
      },TRANSLATE_TIMEOUT);
    }
  }
}

function buildAscentModalTickSelector(modal,tickSelectorName,types,selectedTickType,containerElem,onChange){
  var tickOptions = types.map(function(t){
    var selected = t === selectedTickType;
    var text = thecrag.getTextUC('dbconfig.tick-type.' + t);
    return '<span class="tick-selection ' + (selected ? ' tick-selected' : '') + '" data-tick="' + t + '"><div class="tick-icon-container"><div class="tick-icon"><span class="tick_' + t + '"</span></div></div><div class="tick-text">' + text + '</div><div class="tick-selected-arrow">' + (selected ? '▲' : '') + '</div></span>';
  }).join('');

  var tickElem = $('<div class="tick-selector '+tickSelectorName+'">' + tickOptions + '</div>');


  tickElem.find('.tick-selection').unbind('click').bind('click',function(e){
    e.preventDefault();
    var selectedTickElem = $(this);
    ascentModalChangeTickSelection(modal,selectedTickElem,containerElem,onChange);
  });

  return tickElem;
}

function ascentModalChangeTickSelection(modal,selectedTickElem,containerElem,onChange){
  if (!selectedTickElem.hasClass('tick-selected')) {
    selectedTickElem.parent().find('.tick-selected').each(function(){
      var oldElem = $(this);
      oldElem.removeClass('tick-selected');
      oldElem.find('.tick-selected-arrow').text('');
    });
    selectedTickElem.addClass('tick-selected');
    selectedTickElem.find('.tick-selected-arrow').text('▲');
    if (containerElem) {
      var climbedGearStyle = containerElem.find('.gear-style-selected').data('gear-style');
      buildAscentModalTickDescription(modal,containerElem,climbedGearStyle,selectedTickElem.data('tick'));
    }
  }
  if (onChange) {
    onChange();
  }
}

function buildAscentModalTickType(modal,containerElem,tickSelectorName,routeGearStyle,selectedTickType,onChange){
  var tickTypeWrapperElem = containerElem.find('.tick-type-wrapper');
  tickTypeWrapperElem.html('');
  var climbedGearStyle = containerElem.find('.gear-style-selected').data('gear-style');
  var types = availableTickTypes(routeGearStyle, climbedGearStyle)
  if (selectedTickType && !types.includes(selectedTickType)) {
    var selectedTickType = ascentModalMappedTickTypes(routeGearStyle,climbedGearStyle,selectedTickType);
    if (!types.includes(selectedTickType)) {
      types = types.concat([selectedTickType]);
    }
  }
  buildAscentModalTickSelector(modal,tickSelectorName,types,selectedTickType,containerElem,onChange).prependTo(tickTypeWrapperElem);
  buildAscentModalTickDescription(modal,containerElem,climbedGearStyle,selectedTickType)
}

function initializeAscentModalAscentTick(modal,onUpdateAscent,ascent,route){
  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');
  var routeGearStyle = route.styleStub || 'unknown';
  var climbedGearStyle = ascent.climbedGearStyle || routeGearStyle;
  var tick = typeof ascent.tick === 'object' ? ascent.tick.label : ascent.tick;
  initializeAscentModalTick(modal,ascentTickWrapperElem,'ascent-tick-selector',climbedGearStyle,routeGearStyle,tick,onUpdateAscent);
}

function initializeAscentModalTick(modal,containerElem,tickSelectorName,climbedGearStyle,routeGearStyle,tick,onChange){
  var climbedGearStyleWrapperElem = containerElem.find('.climbed-gear-style-wrapper');
  climbedGearStyleWrapperElem.html('');
  containerElem.find(".climbed-gear-style").val(climbedGearStyle);
  var styles = availableTickGearStyles(routeGearStyle);
  var gearStyleOptions = styles.map(function(s){
    var text = thecrag.getTextUC('dbconfig.route-gear-style.' + s);
    return '<span class="gear-style-selection ' + (s === climbedGearStyle ? ' gear-style-selected' : '') + '" data-gear-style="' + s + '"><span class="gear-style-' + s + '" style="width:12px;height12px"></span>' + text + '</span>'
  }).join('');
  $('<div class="gear-style-selector">' + gearStyleOptions + '</div>').prependTo(climbedGearStyleWrapperElem);
  containerElem.find('.gear-style-selection').unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this);
    if (!elem.hasClass('gear-style-selected')) {
      elem.parent().find('.gear-style-selected').removeClass('gear-style-selected');
      elem.addClass('gear-style-selected');
      var climbedGearStyle = elem.data('gear-style');
      containerElem.find(".climbed-gear-style").val(climbedGearStyle);
      var tickType = ascentModalGetDefaultTickType(climbedGearStyle);
      buildAscentModalTickType(modal,containerElem,tickSelectorName,routeGearStyle,tickType,onChange);
    }
    onChange();
  });
  var selectedTickType = tick || ascentModalGetDefaultTickType(routeGearStyle);
  buildAscentModalTickType(modal,containerElem,tickSelectorName,routeGearStyle,selectedTickType,onChange);
}

function buildAscentModalDifficultyDescription(difficultySelector,selectedDifficultyRating){
  var text = '';
  if (selectedDifficultyRating) {
    text = thecrag.getTextUC('difficulty-feedback-meaning.' + selectedDifficultyRating);
  }
  difficultySelector.find(".difficulty-description-wrapper").html(text);
}

function gradesBeforeOrAfterOffset(grades,gradeText) {
  for (var i = 0; i < grades.length ; i++) {
    if (grades[i].label === gradeText) {
      return i
    }
  }
  return undefined
}

function adjustDifficultySelection(direction,difficultySelector) {
  var selectedDifficulty = difficultySelector.find('.difficulty-rating-selected');
  if (selectedDifficulty.length<=0) {
    difficultySelector.find('[data-reset-grade]').each(function(){
      ascentModalDifficultyFeedbackResetGrade($(this));
    });
    selectedDifficulty = difficultySelector.find('[data-difficulty-rating="average"]');
  }

  var difficultyRating = selectedDifficulty.data('difficulty-rating');
  var resetGrade = selectedDifficulty.find('.difficulty-rating-item').data('reset-grade');
  var gradeElem = selectedDifficulty.find('.difficulty-rating-item-grade');
  var gradeText = gradeElem.text();
  var isDefault = (String(resetGrade) === String(gradeText));
  var difficultyElement = difficultySelector.closest('.difficulty-wrapper');
  var gradesBefore = difficultyElement.data('grades-before');
  var gradesAfter = difficultyElement.data('grades-after');
  var canChangeGrade = (gradeText && gradeElem.length > 0);

  var newDifficultyRating = undefined;
  switch (direction) {
    case 'inc':  {
      switch (difficultyRating) {
        case 'soft': 
          if (isDefault) {
            newDifficultyRating = 'easy';
          } else if (canChangeGrade) {
            var off = gradesBeforeOrAfterOffset(gradesBefore,gradeText);
            if (off !== undefined && off !== (gradesBefore.length-1)) {
              var grade = gradesBefore[off+1].label;
              gradeElem.text(grade);
              gradeElem.data('grade',grade);
            }
          }
          break;
        case 'easy': 
          newDifficultyRating = 'average';
          break;
        case 'average': 
          newDifficultyRating = 'hard';
          break;
        case 'hard': 
          newDifficultyRating = 'sand';
          break;
        case 'sand': 
          if (canChangeGrade) {
            var off = gradesBeforeOrAfterOffset(gradesAfter,gradeText);
            if (off !== undefined && off !== (gradesAfter.length-1)) {
              var grade = gradesAfter[off+1].label;
              gradeElem.text(grade);
              gradeElem.data('grade',grade);
            }
          }
          break;
      }
      break;
    }

    case 'dec':  {
      switch (difficultyRating) {
        case 'soft': 
          if (canChangeGrade) {
            var off = gradesBeforeOrAfterOffset(gradesBefore,gradeText);
            if (off !== undefined && off !== 0) {
              var grade = gradesBefore[off-1].label;
              gradeElem.text(grade);
              gradeElem.data('grade',grade);
            }
          }
          break;
        case 'easy': 
          newDifficultyRating = 'soft';
          break;
        case 'average': 
          newDifficultyRating = 'easy';
          break;
        case 'hard': 
          newDifficultyRating = 'average';
          break;
        case 'sand': 
          if (isDefault) {
            newDifficultyRating = 'hard';
          } else if (canChangeGrade) {
            var off = gradesBeforeOrAfterOffset(gradesAfter,gradeText);
            if (off !== undefined && off !== 0) {
              var grade = gradesAfter[off-1].label;
              gradeElem.text(grade);
              gradeElem.data('grade',grade);
            }
          }
          break;
      }
      break;
    }
  }

  if (!newDifficultyRating) {
    return
  }

  difficultySelector.find('.difficulty-rating-selected').removeClass('difficulty-rating-selected');
  
  difficultySelector.find('[data-difficulty-rating="' + newDifficultyRating + '"]').addClass('difficulty-rating-selected');
}

function ascentModalFilterFeedbackGrades(systems,lastKeyedDifficultyFeedback) {
  if (tcGradeBandLevel === undefined || tcGradeSystemLabel === undefined) {
    return [];
  }
  var feedbackGrades = [];
  var found = {};
  for (var sysEnt of Object.entries(systems || {})) {
    var gradeSystem = sysEnt[0] ? tcGradeSystemLabel(parseInt(sysEnt[0],10)) : undefined;
    var grade = sysEnt[1] && sysEnt[1][0];
    if (gradeSystem && grade) {
      var band = tcGradeBandLevel(gradeSystem,grade);
      if (band) {
        var dfKey = ascentModalDifficultyFeedbackKey({gradeSystem:gradeSystem,grade:grade});
        found[dfKey] = true;
        feedbackGrades.push({
          gradeSystem: gradeSystem,
          grade: grade,
          gradeBand: band,
        });
      }
    }
  }
  if (lastKeyedDifficultyFeedback) {
    for (var item of Object.values(lastKeyedDifficultyFeedback)) {
      var gradeSystem = item.gradeSystem;
      var grade = item.grade;
      var dfKey = ascentModalDifficultyFeedbackKey(item);
      if (item.difficulty && gradeSystem && grade && !found[dfKey]) {
        var band = tcGradeBandLevel(gradeSystem,grade);
        feedbackGrades.push({
          gradeSystem: gradeSystem,
          grade: grade,
          gradeBand: band,
        });
      }
    }
  }
  return feedbackGrades;
}

function ascentModalDifficultyFeedbackKey(item) {
  if (!item.gradeSystem || !item.grade) {
    return undefined
  }
  return item.gradeSystem + '-' + item.grade;
}

function ascentModalBuildKeyedDifficultyFeedback(difficultyFeedback) {
  var keyedLastDifficultyFeedback = {};
  for (var item of difficultyFeedback) {
    var dfKey = ascentModalDifficultyFeedbackKey(item);
    if (dfKey) {
      keyedLastDifficultyFeedback[dfKey] = item;
    }
  }
  return keyedLastDifficultyFeedback;
}

function buildDifficultyFeedbackItemCard(isCommon,isMain,grade,resetGrade,gradeHtml,text) {
  var displayGrade = gradeHtml || grade;
  return '<div class="difficulty-rating-item' + (isCommon ? ' difficulty-rating-item-common' : '') + '"' + (resetGrade ? ' data-reset-grade="' + resetGrade + '"' : '') + '><div class="difficulty-rating-item-grade" data-grade="' + grade + '">' + displayGrade + '</div>' + (text ? '<div class="difficulty-rating-item-text' + (isMain ? ' difficulty-rating-item-text-main' : '' ) + '">' + text + '</div>' : '') + '</div>'
}

function buildDifficulyFeedbackItemDisplay(difficultyFeedback,feedbackGrade,gradesBefore,gradesAfter,suggestedGrade) {
  var grade = feedbackGrade.grade
  switch (difficultyFeedback) {
    case 'soft': 
      var resetGrade = (gradesBefore[gradesBefore.length-1] || {}).label || '';
      var showGrade = resetGrade;
      if (suggestedGrade) {
        for (var g of gradesBefore) {
          if (suggestedGrade === g.label) {
            showGrade = suggestedGrade;
          }
        }
      }
      return buildDifficultyFeedbackItemCard(false,false,showGrade,resetGrade,showGrade,thecrag.getText('system.downgrade'));

    case 'easy': 
      return buildDifficultyFeedbackItemCard(true,false,grade,'',grade,thecrag.getText('template.log-ascent.easy-but-fair'));

    case 'average': 
      return buildDifficultyFeedbackItemCard(true,true,grade,'',tcFormatGradeAtom(feedbackGrade),thecrag.getText('system.assigned'));

    case 'hard': 
      return buildDifficultyFeedbackItemCard(true,false,grade,'',grade,thecrag.getText('template.log-ascent.hard-but-fair'));

    case 'sand': 
      var resetGrade = (gradesAfter[0] || {}).label || '';
      var showGrade = resetGrade;
      if (suggestedGrade) {
        for (var g of gradesAfter) {
          if (suggestedGrade === g.label) {
            showGrade = suggestedGrade;
          }
        }
      }
      return buildDifficultyFeedbackItemCard(false,false,showGrade,resetGrade,showGrade,thecrag.getText('system.upgrade'));
  }
}

function ecoPointImg() {
  return '<img src="/static/cids/images/tag-ecopoint-1.1.0.svg" />';
}

function ecoPointBWImg() {
  return '<img src="/static/cids/images/tag-ecopoint-bw-1.1.0.svg" />';
}

function difficultyFeedbackLeftArrow() {
  return '<img src="/static/cids/images/arrow_left-1.1.0.svg" />';
}

function difficultyFeedbackRightArrow() {
  return '<img src="/static/cids/images/arrow_right-1.1.0.svg" />';
}

function ascentModalDifficultyFeedbackResetGrade(elem){
  var gradeElem = elem.find('.difficulty-rating-item-grade');
  var grade = elem.data('reset-grade');
  gradeElem.text(grade);
  gradeElem.data('grade',grade);
}

function initializeAscentModalDifficultyFeedback(modal,onUpdateAscent,ascent,route,summary){
  var gradeAtom = route.gradeAtom || {};
  var systems = route.systems;
  var difficultyFeedback = ascent.difficultyFeedback || (summary && summary.lastDifficultyFeedback) || [];
  var lastKeyedDifficultyFeedback = ascentModalBuildKeyedDifficultyFeedback(difficultyFeedback);
  var feedbackGrades = ascentModalFilterFeedbackGrades(systems,lastKeyedDifficultyFeedback);
  var difficultyFeedbackEnabled = gradeAtom.gradeDisplayOverride === undefined && feedbackGrades.length > 0;
  displayAscentDifficultyFeedback(modal, difficultyFeedbackEnabled);
  var difficultiesElement = $("#log-ascent-modal .difficulties-wrapper");
  difficultiesElement.html('');
  if (difficultyFeedbackEnabled) {
    for (var feedbackGrade of feedbackGrades) {
      var difficultyElement = $('<div class="difficulty-wrapper"><div class="difficulty-controls-wrapper"><div class="difficulty-adjustor difficulty-adjustor-left">' + difficultyFeedbackLeftArrow() + '</div><div class="difficulty-select-wrapper"></div><div class="difficulty-adjustor difficulty-adjustor-right">' + difficultyFeedbackRightArrow() + '</div></div><div class="difficulty-description-wrapper"></div></div>');
      var gradeSystem = feedbackGrade.gradeSystem;
      var grade = feedbackGrade.grade;
      var gradesBefore = tcGradePickBefore(feedbackGrade.gradeSystem,grade,10) || [tcGradePickSelf(feedbackGrade.gradeSystem,grade)];
      var gradesAfter = tcGradePickAfter(feedbackGrade.gradeSystem,grade,10) || [tcGradePickSelf(feedbackGrade.gradeSystem,grade)];
      difficultyElement.data('feedback-grade',feedbackGrade);
      difficultyElement.data('grades-after',gradesAfter);
      difficultyElement.data('grades-before',gradesBefore);
      difficultyElement.appendTo(difficultiesElement);
      var difficultSelectWrapper = difficultyElement.find('.difficulty-select-wrapper');
      var ratings = availableDifficultyFeedbackRatings();
      var dfKey = ascentModalDifficultyFeedbackKey(feedbackGrade);
      var difficulty = lastKeyedDifficultyFeedback[dfKey];
      var difficultyRating = (difficulty && difficulty.difficulty) || '';
      var suggestedGrade = (difficulty && difficulty.suggestedGrade) || '';
      var difficultySelectOptions = ratings.map(function(q){
        return '<span class="difficulty-rating-selection ' + (q === difficultyRating ? ' difficulty-rating-selected' : '') + '" data-difficulty-rating="' + q + '">' + buildDifficulyFeedbackItemDisplay(q,feedbackGrade,gradesBefore,gradesAfter,suggestedGrade) + '</span>'
      }).join('');
      var difficultySelector = $('<div class="difficulty-rating-selector">' + difficultySelectOptions + '</div>');

      difficultySelector.find('.difficulty-rating-selection').unbind('click').bind('click',function(e){
        e.preventDefault();
        var elem = $(this);
        if (elem.hasClass('difficulty-rating-selected')) {
          elem.removeClass('difficulty-rating-selected');
        } else {
          elem.parent().find('.difficulty-rating-selected').removeClass('difficulty-rating-selected');
          elem.addClass('difficulty-rating-selected');
        }
        elem.siblings().find('[data-reset-grade]').each(function(){
          ascentModalDifficultyFeedbackResetGrade($(this));
        });
        var baseElement = elem.closest('.difficulty-wrapper');
        var difficultyRating = baseElement.find(".difficulty-rating-selected").data('difficulty-rating');
        buildAscentModalDifficultyDescription(baseElement,difficultyRating);
        onUpdateAscent();
      });

      difficultyElement.find('.difficulty-adjustor-left').unbind('click').bind('click',function(e){
        e.preventDefault();
        var elem = $(this);
        var baseElement = elem.closest('.difficulty-wrapper');
        var dsElem = baseElement.find('.difficulty-rating-selector');
        adjustDifficultySelection('dec',dsElem)
        var difficultyRating = baseElement.find(".difficulty-rating-selected").data('difficulty-rating');
        buildAscentModalDifficultyDescription(difficultyElement,difficultyRating);
        onUpdateAscent();
      });

      difficultyElement.find('.difficulty-adjustor-right').unbind('click').bind('click',function(e){
        e.preventDefault();
        var elem = $(this);
        var baseElement = elem.closest('.difficulty-wrapper');
        var dsElem = baseElement.find('.difficulty-rating-selector');
        adjustDifficultySelection('inc',dsElem)
        var difficultyRating = baseElement.find(".difficulty-rating-selected").data('difficulty-rating');
        buildAscentModalDifficultyDescription(difficultyElement,difficultyRating);
        onUpdateAscent();
      });
      
      difficultySelector.appendTo(difficultSelectWrapper);
      buildAscentModalDifficultyDescription(difficultyElement,difficultyRating);
    }
  }
}

function buildAscentModalQualityDescription(modal,selectedQuality){
  var text = '';
  if (selectedQuality) {
    var extraTexts = extraIconTextsForQualityRatings();
    text = thecrag.getTextUC('dbconfig.quality-rating.' + selectedQuality);
    if (extraTexts[selectedQuality]) {
      text = extraTexts[selectedQuality] + ' ' + text;
    }
  }
  $("#log-ascent-modal .quality-description-wrapper").html(text);
}

function initializeAscentModalQuality(modal,onUpdateAscent,isNew,ascent,summary){
  $("#log-ascent-modal .quality-select-wrapper").html('');
  var ratings = availableTickQualityRatings();
  var summaryQuality = isNew && summary.lastQuality;
  var quality = ascent.qualityLabel || ascent.quality || summaryQuality || '';
  var qualitySelectOptions = ratings.map(function(q){
    return '<span class="quality-selection ' + (q === quality ? ' quality-selected' : '') + '" data-quality-rating="' + q + '"><div class="quality-icon-container"><div class="quality-icon"><span class="quality-selector quality-' + q + '" /></div></div></span>'
  }).join('');
  $('<div class="quality-selector">' + qualitySelectOptions + '</div>').prependTo("#log-ascent-modal .quality-select-wrapper");
  buildAscentModalQualityDescription(modal,quality);
  modal.find('.quality-selection').unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this);
    if (elem.hasClass('quality-selected')) {
      elem.removeClass('quality-selected');
    } else {
      elem.parent().find('.quality-selected').removeClass('quality-selected');
      elem.addClass('quality-selected');
    }
    var quality = modal.find(".quality-selected").data('quality-rating');
    buildAscentModalQualityDescription(modal,quality);
    onUpdateAscent();
  });
}

function initializeAscentModalComment(modal,onUpdateAscent,ascent){
  var publicComment = ascent.markdown || ascent.comment || '';
  modal.find('#ascent-input-public-comment').val(publicComment).parent().find('.markedup').html('');
  modal.find('#ascent-input-public-comment').unbind('change').bind('change',onUpdateAscent);

  var privateComment = ascent.privateMarkdown || ascent.privateComment || '';
  modal.find('#ascent-input-private-comment').val(privateComment).parent().find('.markedup').html('');
  modal.find('#ascent-input-private-comment').unbind('change').bind('change',onUpdateAscent);
}

function setAscentModalGradeOverride(gradeOverrideWrapper,systemName,gradeName,component) {
  if (component && component.grade && component.systemLabel && component.grade !== '--') {
    $('<input type="hidden" class="' + systemName + '" name="' + systemName + '" value="' + component.systemLabel + '"><input type="hidden" class="' + gradeName + '" name="' + gradeName + '" value="' + component.grade + '">')
      .prependTo(gradeOverrideWrapper);
  }
}

function buildAscentModalGrade(gradeWrapper,hideAndReset,defaultGradeText) {
  var gradeInput = gradeWrapper.find('.grade-override');
  var gradeOutput = gradeWrapper.find('.route-grade-output');
  var gradeOverrideWrapper = gradeWrapper.find('.grade-override-wrapper');
  if (hideAndReset) {
    gradeWrapper.hide();
    gradeInput.val('');
    gradeOverrideWrapper.html('');
  } else {
    gradeWrapper.show();
    gradeInput.val(defaultGradeText);
  }
  gradeOutput.html('');
}

function buildAscentModalGradeCalulatedFields(gradeOverrideWrapper,grade) {
  gradeOverrideWrapper.html('');
  if (grade && grade.components) {
    var components = Object.values(grade.components)
    setAscentModalGradeOverride(gradeOverrideWrapper,'grade-override-grade-system','grade-override-grade',components[0]);
    if (components[1]) {
      setAscentModalGradeOverride(gradeOverrideWrapper,'grade-override-alt-grade-system','grade-override-alt-grade',components[1]);
    }
  }
}

function initializeAscentModalGradeOverride(modal,onUpdateAscent,ascent){
  var gradeWrapper = $("#log-ascent-modal .grade-wrapper");
  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');
  var styleElement = ascentTickWrapperElem.find(".climbed-gear-style");
  var hideAndResetGrade = initializeAscentModalGrade(gradeWrapper,styleElement,ascent,false,false,true,onUpdateAscent);
  var gradeOverride = modal.find("input[type=checkbox][name=use-route-grade]");
  gradeOverride.prop('checked',hideAndResetGrade).unbind('change').bind('change',function(e){
    var hideAndReset= $(this).is(':checked');
    buildAscentModalGrade(gradeWrapper,hideAndReset,'');
    onUpdateAscent();
  }); 
}

function initializeAscentModalGrade(gradeWrapper,styleElement,ascentOrPitch,initOutput,useRouteFields,hidable,onChange){
  var gradeOverrideWrapper = gradeWrapper.find('.grade-override-wrapper');
  var inputText = '';
  if (ascentOrPitch.grade && ascentOrPitch.gradeSystem) {
    setAscentModalGradeOverride(gradeOverrideWrapper,'grade-override-grade-system','grade-override-grade',{grade: ascentOrPitch.grade, systemLabel: ascentOrPitch.gradeSystem});
    inputText = ascentOrPitch.grade;
  }
  if (ascentOrPitch.altGrade && ascentOrPitch.altGradeSystem) {
    setAscentModalGradeOverride(gradeOverrideWrapper,'grade-override-alt-grade-system','grade-override-alt-grade',{grade: ascentOrPitch.altGrade, systemLabel: ascentOrPitch.altGradeSystem});
    inputText = inputText + ' ' + ascentOrPitch.altGrade;
  }
  if (useRouteFields && inputText.length === 0 && ascentOrPitch.grade && ascentOrPitch.grade.display)  {
    inputText = ascentOrPitch.grade.display;
  }
  var hideAndResetGrade = hidable && inputText.length === 0;
  buildAscentModalGrade(gradeWrapper,hideAndResetGrade,inputText);
  var gradeInput = gradeWrapper.find(".grade-override");
  gradeInput.unbind('change').bind('change',onChange);
  var gradeOutput = gradeWrapper.find(".route-grade-output");
  var converter = new theCragAPIGradeConverter({
    contextElement: $("#log-ascent-modal__grade-context"),
    styleElement: styleElement,
    gradeElement: gradeInput,
    outputElement: gradeOutput,
    convert: {},
    ascentMode: true,
    callback: function ( grade ) {
      buildAscentModalGradeCalulatedFields(gradeOverrideWrapper,grade);
    },
  });
  if (inputText && initOutput) {
    converter.inputChange();
  }
  return hideAndResetGrade;
}

function buildAscentModalLabel(modal,onUpdateAscent,useRoute,defaultName) {
  modal.find(".ascent-label").remove();
  if (!useRoute) {
    var elem = $('<input type="text" class="ascent-label" name="ascent-label" />');
    elem.val(defaultName).appendTo($("#log-ascent-modal .label-override-wrapper"));
    elem.unbind('change').bind('change',onUpdateAscent);
  }
}

function initializeAscentModalAscentLabelOverride(modal,onUpdateAscent,route,ascent){
  var label = ascent.label || '';
  var labelOverride = modal.find("input[type=checkbox][name=use-route-name]");
  labelOverride.data('route-name',route.name);
  var useRoute = label.length === 0;
  buildAscentModalLabel(modal,onUpdateAscent,useRoute,label);
  labelOverride.prop('checked',useRoute).unbind('change').bind('change',function(e){
    var useRoute = $(this).is(':checked');
    buildAscentModalLabel(modal,onUpdateAscent,useRoute,route.name);
    onUpdateAscent();
  }); 
}

function buildAscentModalLength(modal,onUpdateAscent,useRoute,defaultText) {
  var elem = modal.find(".ascent-height-text");
  elem.remove();
  if (!useRoute) {
    var elem = $('<input type="text" class="ascent-height-text" name="ascent-height-text" />');
    elem.val(defaultText).appendTo($("#log-ascent-modal .length-override-wrapper"));
    elem.unbind('change').bind('change',onUpdateAscent);
  }
}

function ascentModalRenderEcopoint(elem,ecopoint) {
  if (ecopoint){
    elem.html(ecoPointImg()).addClass('log-ascent-ecopoint-selected');
  } else {
    elem.html(ecoPointBWImg()).removeClass('log-ascent-ecopoint-selected');
  }
}

function ascentModalRemoveEcopoint(modal,onUpdateAscent) {
  var tags = getAscentModalTagsFieldValue(modal) || {};
  if (tags['Journey'] && tags['Journey']['Ecopoint']) {
    delete tags['Journey']['Ecopoint'];
  }
  ascentModalRenderTags(modal,onUpdateAscent,tags);
  onUpdateAscent();
}

function ascentModalAddEcopoint(modal,onUpdateAscent) {
  var tags = getAscentModalTagsFieldValue(modal) || {};
  var journey = tags['Journey'] || {};
  journey['Ecopoint'] = 1;
  tags['Journey'] = journey;
  ascentModalRenderTags(modal,onUpdateAscent,tags);
  onUpdateAscent();
}

function ascentModalSyncEcopoint(modal){
  var ecopointElem = modal.find('.log-ascent-ecopoint');
  var ecopoint = ((getAscentModalTagsFieldValue(modal) || {})['Journey'] || {})['Ecopoint'];
  ascentModalRenderEcopoint(ecopointElem,ecopoint);
}

function initializeAscentModalEcopoint(modal,onUpdateAscent){
  ascentModalSyncEcopoint(modal);

  modal.find('.log-ascent-ecopoint').unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this);
    var ecopointElem = elem.closest('.log-ascent-ecopoint');
    if (ecopointElem.hasClass('log-ascent-ecopoint-selected')){
      ascentModalRenderEcopoint(ecopointElem,false);
      ascentModalRemoveEcopoint(modal,onUpdateAscent);
    } else {
      var confirmText = thecrag.getText('dbconfig.tags.tag.ecopoint.label') + ' - ' + thecrag.getText('template.log-ascent.echopoint-description');
      if (confirm(confirmText)) {
        ascentModalRenderEcopoint(ecopointElem,true);
        ascentModalAddEcopoint(modal,onUpdateAscent);
      }
    }
  });
}

function initializeAscentModalTags(modal,onUpdateAscent,isNew,ascent,memorizedTags){
  var ascentTags = isNew ? (memorizedTags || {}) : (ascent.tags || ascent.tag || {});
  ascentModalRenderTags(modal,onUpdateAscent,ascentTags);
  modal.find(".ascent-tags-wrapper").data("initial-tags",ascentTags);
}

function ascentModalRenderTags(modal,onUpdateAscent,ascentTags){
  modal.find(".ascent-tags-wrapper .select2-container").remove();
  var tags = [];
  for (var types of Object.values(ascentTags)) {
    for (var tag of Object.keys(types)) {
      tags.push(tag);
    }
  }
  modal.find(".ascent-tags-wrapper .taggable").each(function(){
    var elem = $(this);
    elem.val(tags);
    elem.select2({
      closeOnSelect: false,
      formatResult: formatTagItem,
      formatSelection: formatTagItem,
    }).on('change',function (e){
      onUpdateAscent();
      ascentModalSyncEcopoint(modal);
    });
  }); 
}

function initializeAscentModalPitchesSelection(modal,onUpdateAscent,ascent,route){
  var logPitchesSelected = !!ascent.pitch;
  var logPitchesElement = $("#log-ascent-modal input[type=checkbox][name=log-pitches]");
  logPitchesElement.prop('checked', logPitchesSelected);
  if (logPitchesSelected) {
    logPitchesElement.data('ascent-has-pitches', true);
  }
  var defaultTickLabel = getAscentModalTickValue(modal);
  var defaultTick = defaultTickLabel ? {label: defaultTickLabel} : undefined;
  function debouceChangedPitches(){
    _.debounce(function(){changedPitchesAscentModalUpdateSummary(modal,onUpdateAscent)},300,false)();
    onUpdateAscent();
  }
  initializeAscentModalPitches(modal,ascent,route,logPitchesSelected,debouceChangedPitches,defaultTick);
  changedPitchesAscentModalUpdateSummary(modal,onUpdateAscent);
  logPitchesElement.unbind('change').bind('change',function(e){
    var checkbox = $(this);
    ascentModalPitchSelectionChanged(modal,checkbox,debouceChangedPitches);
    onUpdateAscent();
  })
}

function ascentModalPitchSelectionChanged(modal,checkbox,onUpdatePitch) {
  var multiPitchElement = modal.find(".multi-pitch-wrapper");
  if (checkbox.is(':checked')) {
    var ascentTickLabel = getAscentModalTickValue(modal);
    if (ascentTickLabel) {
      multiPitchElement.find('.pitch-tick-selector').each(function(){
        var tickSelector = $(this);
        var tick = tickSelector.find('.tick-selected').data('tick');
        if (tick !== ascentTickLabel) {
          var selectedTickElem = multiPitchElement.find('.tick-selection[data-tick="'+ascentTickLabel+'"]');
          ascentModalChangeTickSelection(modal,selectedTickElem,undefined,onUpdatePitch);
        }
      });
    }
    multiPitchElement.show();
  } else { 
    multiPitchElement.hide();
  }
}

function changedPitchesAscentModalUpdateSummary(modal,onUpdateAscent) {
  var pitchElements = modal.find(".ascent-pitch");
  var logPitchCount = 0;
  var lastPitchNumber = undefined;

  pitchElements.each(function(){
    var elem = $(this);
    var pitch = getAscentModalPitchFields(elem);

    if (pitch) {
      logPitchCount = logPitchCount + 1;
      lastPitchNumber = pitch.number;

      elem.find(".ascent-pitch-summary-length").text(pitch.heightText || '');

      var gradeSummaryElem = elem.find(".ascent-pitch-summary-grade");
      gradeSummaryElem.html('');

      elem.find(".route-grade-output").clone().appendTo(gradeSummaryElem);

      var tickSummaryElem = elem.find(".ascent-pitch-summary-tick");
      tickSummaryElem.html('');
      if (pitch.tick) {
        tickSummaryElem.html('<span class="tick_'+pitch.tick+'"></span>');
      }

      var leadBySummaryElem = elem.find(".ascent-pitch-summary-lead-by");
      leadBySummaryElem.text(pitch.leadby || '');
    }
  })

  if (pitchElements.length > 1) {
    var labelOverride = modal.find("input[type=checkbox][name=use-route-name]");
    var autoNamed = labelOverride.data('auto-named');
    if (logPitchCount === 1) {
      if (labelOverride.is(':checked') && !autoNamed) {
        var routeName = labelOverride.data('route-name') + ' P' + lastPitchNumber;
        modal.find("input[type=checkbox][name=show-advanced-fields]").prop('checked', true);
        displayAscentAdvancedFields(modal);
        labelOverride.data('auto-named', true);
        labelOverride.prop('checked', false);
        buildAscentModalLabel(modal,onUpdateAscent,false,routeName);
      }
    } else if (autoNamed) {
      labelOverride.data('auto-named', false);
      labelOverride.prop('checked', true);
      buildAscentModalLabel(modal,onUpdateAscent,true,'');
    }
  }
}

function initializeAscentModalPitches(modal,ascent,route,isOpen,onUpdatePitch,defaultTick){
  // modal.find('pre').html(JSON.stringify(route, null, 2));
  var multiPitchElement = modal.find(".multi-pitch-wrapper");
  multiPitchElement.html('');

  if (!isOpen) {
    multiPitchElement.hide();
  }

  var isAscentWithPitches = (ascent.pitch && ascent.pitch.length > 0);
  var pitchStart = undefined;
  var pitchEnd = undefined;
  if (isAscentWithPitches) {
    for (var p of ascent.pitch) {
      if (!pitchEnd || p.number > pitchEnd) {
        pitchEnd = p.number;
      }
      if (!pitchStart || p.number < pitchStart) {
        pitchStart = p.number;
      }
    }
  }
  if (!pitchStart || !pitchEnd || pitchStart < 1 || pitchEnd > 99 || pitchStart > pitchEnd) {
    pitchStart = undefined;
    pitchEnd = undefined;
  }

  var pitchOffset = pitchStart ? pitchStart - 1 : 0
  var ascentPitches = (ascent.pitch && (ascent.pitch.length + pitchOffset)) || 1;
  var routePitches = (route.pitch && route.pitch.length) || route.pitches || 1;
  var maxPitches = ascentPitches > routePitches ? ascentPitches : routePitches;
  var pitches = ascent.pitch || route.pitch || [];

  var initStart = pitchStart || 1;
  var initEnd = pitchEnd || maxPitches;

  for(var i = 1; i < initStart; i++){
    pitches.unshift({});
  }

  for(var i = pitches.length; i < maxPitches; i++){
    pitches.push({});
  }

  var slider = pitchesSelectSlider({
    title: thecrag.getText('template.ascent-modal.climbed-pitches'),
    max: maxPitches,
    initStart: initStart,
    initEnd: initEnd,
    startElem: modal.find(".pitch-start"),
    endElem: modal.find(".pitch-end"),
    onChange: function(startValue,endValue){
      multiPitchElement.find('.ascent-pitch').each(function(){
        var elem = $(this);
        var pitchNumber = elem.data('pitch-number');
        if (pitchNumber) {
          if (pitchNumber < startValue || pitchNumber > endValue) {
            elem.data('should-log', false);
            elem.hide();
          } else {
            elem.data('should-log', true);
            elem.show();
          }
        }
        if (onUpdatePitch) {
          onUpdatePitch();
        }
      }); 
    },
    onExtend: function(pitchNumber){
      var elem = initializeAscentModalPitchInfo(modal,route,pitchNumber,{},false,onUpdatePitch,defaultTick,false).appendTo(multiPitchElement);
      initTextAreaMarkdown();
      elem.data('should-log', false);
      elem.hide();
    },
  });

  slider.appendTo(multiPitchElement);

  for(var i = 0; i < pitches.length; i++){
    var pitchNumber = i+1;
    var pitch = pitches[i];
    var shouldLog = pitchNumber >= initStart && pitchNumber <= initEnd;
    initializeAscentModalPitchInfo(modal,route,pitchNumber,pitch,isAscentWithPitches,onUpdatePitch,defaultTick,shouldLog).appendTo(multiPitchElement);
  }
  initTextAreaMarkdown();
}

function initializeAscentModalPitchInfo(modal,route,pitchNumber,pitch,isAscentWithPitches,onUpdatePitch,defaultTick,shouldLog){
  var pitchElement = $('<div class="ascent-pitch '+(shouldLog ? '' : 'hide')+'" data-should-log="'+(shouldLog ? 'true' : 'false')+'" data-pitch-number="' + pitchNumber + '"></div>');

  var hasData = Object.keys(pitch).length > 0;
  var isOpen = (isAscentWithPitches && hasData) ? true : false;

  var title = thecrag.getText('template.ascent-modal.pitch-title', {
    pitchNumber: pitchNumber,
  });

  $('<div class="ascent-pitch-title"><a href="#" class="ascent-pitch-toggle" data-is-open="' + isOpen + '"><i class="icon-caret-' + (isOpen ? 'down' : 'right') + '"></i>' + title + '</a><span class="ascent-pitch-summary"><span class="ascent-pitch-summary-tick"></span><span class="ascent-pitch-summary-length"></span><span class="ascent-pitch-summary-grade"></span><span class="ascent-pitch-summary-lead-by"></span></span></div>').appendTo(pitchElement);

  var detailsElement = $('<div class="ascent-pitch-details' + (isOpen ? '' : ' hide') + '"></div>');

  var routeGearStyle = route.styleStub || 'unknown';

  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');
  var ascentClimbedGearStyle = ascentTickWrapperElem.find('.gear-style-selected').data('gear-style');

  var climbedGearStyle = pitch.climbedGearStyle || ascentClimbedGearStyle;

  var tick = typeof pitch.tick === 'object' ? pitch.tick.label : pitch.tick;
  if (!tick) {
    tick = typeof defaultTick === 'object' ? defaultTick.label : defaultTick;
  }
  $('<div><label class="tc-modal__form-label">'+thecrag.getTextUC('object.tick')+'</label></div>').appendTo(detailsElement);

  var pitchTickWrapperElem = $('<div class="pitch-tick-wrapper"><input type="hidden" class="climbed-gear-style" name="climbed-gear-style" /><div class="climbed-gear-style-wrapper"></div><div class="tick-type-wrapper"></div></div>');
  pitchTickWrapperElem.appendTo(detailsElement);

  initializeAscentModalTick(modal,pitchTickWrapperElem,'pitch-tick-selector',climbedGearStyle,routeGearStyle,tick,onUpdatePitch);

  $('<div><label class="tc-modal__form-label">'+thecrag.getText('template.log-ascent.length')+'</label></div>').appendTo(detailsElement);
  var pitchHeighElem = $('<input type="text" class="ascent-pitch-height-text" />');
  pitchHeighElem.val(pitch.height||pitch.heightText||'').appendTo(detailsElement);
  pitchHeighElem.unbind('change').bind('change',onUpdatePitch);

  $('<div><label class="tc-modal__form-label">'+thecrag.getTextUC('object.grade')+'</label></div>').appendTo(detailsElement);
  var pitchGradeWrapper = $('<div class="pitch-grade-wrapper"><input type="text" class="grade-override" name="grade-override" /><span class="route-grade-output"></span><div class="grade-override-wrapper"></div></div>');
  pitchGradeWrapper.appendTo(detailsElement);
  var ascentTickWrapperElem = modal.find('.ascent-tick-wrapper');
  var styleElement = ascentTickWrapperElem.find(".climbed-gear-style");
  initializeAscentModalGrade(pitchGradeWrapper,styleElement,pitch,true,!isAscentWithPitches,false,onUpdatePitch);

  $('<div><label class="tc-modal__form-label">'+thecrag.getText('template.log-ascent.lead-by')+'</label></div>').appendTo(detailsElement);
  var leadByWrapper = $('<div class="lead-by-wrapper"><input type="text" class="lead-by" name="lead-by" value="'+(pitch.leadby || '')+'" data-inheritwith="who-with" data-override-mode="you" /></div>');
  leadByWrapper.appendTo(detailsElement);
  var leadBy = leadByWrapper.find('.lead-by');
  initialiseSelect2ClimberCompletions(leadBy);
  leadBy.on('change',function (e){
    onUpdatePitch();
  });

  $('<div><label class="tc-modal__form-label">'+thecrag.getText('template.log-ascent.public-comment')+'</label></div>').appendTo(detailsElement);
  var pitchComment = $('<div class="pitch-comment-wrapper"><textarea name="pitch-comment" class="pitch-comment markdown completions-mention completions-hashtag completions-quote completions-emoji">' + escapeHTML(pitch.markdown || pitch.comment || '') + '</textarea></div>');
  pitchComment.appendTo(detailsElement);
   var commentElem = pitchComment.find(".pitch-comment");
  commentElem.unbind('change').bind('change',onUpdatePitch);

  detailsElement.appendTo(pitchElement);

  pitchElement.find(".ascent-pitch-toggle").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this);
    var pitchElem = elem.closest('.ascent-pitch');
    if (elem.data('is-open')) {
      elem.data('is-open',false);
      pitchElem.find('.icon-caret-down').removeClass('icon-caret-down').addClass('icon-caret-right');
      pitchElem.find('.ascent-pitch-details').hide();
    } else {
      elem.data('is-open',true);
      pitchElem.find('.icon-caret-right').removeClass('icon-caret-right').addClass('icon-caret-down');
      pitchElem.find('.ascent-pitch-details').show();
    }
  });
  
  return pitchElement;
}

function setAscentModalNumberAttempts(modal,numberAttempts,shouldUpdateInput) {
  var n = parseInt(numberAttempts,10);

  modal.find('.attempt-button').each(function(){
    var elem = $(this);
    var val = elem.data("val");
    if (n === val) {
      elem.addClass('selected');
    } else {
      elem.removeClass('selected');
    }
  });

  if (shouldUpdateInput) {
    modal.find('.number-attempts').val(n);
  }
}

function initializeAscentModalNumberAttempts(modal,onUpdateAscent,ascent){
  var numberAttempts = ascent.numberAttempts || '';

  var n = parseInt(numberAttempts,10);
  var buttonsContainer = modal.find('.attempts-buttons');
  var buttons = '';
  for (var i=1; i<=9; i++) {
    buttons = buttons + '<div class="attempt-button' + (n===i ? ' selected' : '') + '" data-val="' + i + '">' + i + '</div>';
  }
  buttonsContainer.html(buttons);

  modal.find('.number-attempts').val(numberAttempts);

  modal.find(".attempt-button").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this)
    var val = elem.data("val");
    setAscentModalNumberAttempts(modal,val,true);
    onUpdateAscent();
  }); 

  modal.find(".number-attempts").unbind('change').bind('change',function(e){
    e.preventDefault();
    var elem = $(this)
    setAscentModalNumberAttempts(modal,elem.val());
    onUpdateAscent();
  });
}

function initializeAscentModalLengthOverride(modal,onUpdateAscent,ascent){
  var heightText = ascent.heightText || '';
  var lengthOverride = modal.find("input[type=checkbox][name=use-route-length]");
  var useRoute = heightText.length === 0;
  buildAscentModalLength(modal,onUpdateAscent,useRoute,heightText);
  lengthOverride.prop('checked',useRoute).unbind('change').bind('change',function(e){
    var useRoute = $(this).is(':checked');
    buildAscentModalLength(modal,onUpdateAscent,useRoute,'');
    onUpdateAscent();
  }); 
}

function initializeAscentAdvancedFields(modal,acctid){
  var advancedFields = getAscentModalAdvancedFields(modal,true);
  var isSet = Object.keys(advancedFields).length > 0;
  if (!isSet && acctid) {
    var memorizedIsSet = getMemorizeAscentAdvancedOption(acctid);
    if (memorizedIsSet !== undefined) {
      isSet = memorizedIsSet;
    }
  }
  $("#log-ascent-modal input[type=checkbox][name=show-advanced-fields]").prop('checked', isSet);
  displayAscentAdvancedFields(modal);
}

function displayAscentDifficultyFeedback(modal, difficultyFeedbackEnabled){
  if (difficultyFeedbackEnabled) {
    modal.find('.hide-unless-difficulty-feedback').show();
  } else {
    modal.find('.hide-unless-difficulty-feedback').hide();
  }
}

function displayMultiPitchFields(modal){
  var isMultiPitch = $("#log-ascent-modal__is-multi-pitch").val();
  if (isMultiPitch) {
    modal.find('.hide-unless-multi-pitch').show();
  } else {
    modal.find('.hide-unless-multi-pitch').hide();
  }
}

function displayAscentAdvancedFields(modal){
  var isGym = $("#log-ascent-modal__is-gym").val();
  if ($("#log-ascent-modal input[type=checkbox][name=show-advanced-fields]").is(':checked')) {
    modal.find('.hide-unless-advanced').each(function(){
      var elem = $(this);
      if ( !isGym || !elem.hasClass('hide-if-gym') ) {
        elem.show();
      }
    });
  } else {
    modal.find('.hide-unless-advanced').hide();
  }
}

function buildWarning(titleKey, messageKey, icon) {
  return '<div class="alert alert-error"><b><i class="icon-' + icon + '"></i>' + thecrag.getText(titleKey) + '</b>&nbsp;' + thecrag.getText(messageKey) + '</div>';
}

function initializeAscentModalWarning(modal, route) {
  var warningHtml = "";
  if (route.closed) {
    warningHtml = buildWarning('template.area.climbing-closed','template.log-ascent.climbing-closed.explain','ban-circle');
  }
  var warningElem = modal.find(".log-ascent-warning");
  warningElem.html(warningHtml);
}

function initializeAscentModalPreviousAscents(modal, ascent, summary) {
  var summaryHtml = "";
  var previousAscents = summary && summary.ascentCount;
  if (!ascent.id && previousAscents) {
    summaryHtml = '<div class="alert alert-info">' + thecrag.getText('template.log-ascent.previous-ascents',{count: previousAscents}) + '</div>'
  }
  var summaryElem = modal.find(".log-ascent-previous-ascents");
  summaryElem.html(summaryHtml);
}

function initializeAscentModal(modal, loadedAscent, route, summary){
  var ascent = loadedAscent.ascent;
  var isNew = loadedAscent.isNew;

  var acctid = $('body').data('uid');

  var isGym = route.gym ? '1' : '';
  $("#log-ascent-modal__is-gym").val(isGym);

  var isMultiPitch = route.maybeMultipitch || ascent.pitch ? '1' : '';
  $("#log-ascent-modal__is-multi-pitch").val(isMultiPitch);

  var memorizedDefaults = ascent.id ? {} : getMemorizeAscentDefaults(acctid) || {};

  function onUpdateAscent(){
    modal.find('.action-btn').removeClass('disabled');
    setAscentModalNavButtonsStatus(modal);
  }

  initializeAscentModalWarning(modal,route);
  initializeAscentModalPreviousAscents(modal,ascent,summary);
  initializeAscentModalDates(modal,onUpdateAscent,isNew,ascent,memorizedDefaults.date);
  initializeAscentModalWhoWith(modal,onUpdateAscent,isNew,ascent,memorizedDefaults.with);
  initializeAscentModalAscentTick(modal,onUpdateAscent,ascent,route);
  initializeAscentModalQuality(modal,onUpdateAscent,isNew,ascent,summary);
  initializeAscentModalDifficultyFeedback(modal,onUpdateAscent,ascent,route,summary);
  initializeAscentModalComment(modal,onUpdateAscent,ascent);
  initializeAscentModalAscentLabelOverride(modal,onUpdateAscent,route,ascent);
  initializeAscentModalGradeOverride(modal,onUpdateAscent,ascent);
  initializeAscentModalLengthOverride(modal,onUpdateAscent,ascent);
  initializeAscentModalNumberAttempts(modal,onUpdateAscent,ascent);
  initializeAscentModalTags(modal,onUpdateAscent,isNew,ascent,memorizedDefaults.tags);
  initializeAscentModalEcopoint(modal,onUpdateAscent);

  var isMultiPitch = $("#log-ascent-modal__is-multi-pitch").val();
  if (isMultiPitch) {
    initializeAscentModalPitchesSelection(modal,onUpdateAscent,ascent,route);
  }
  displayMultiPitchFields(modal);

  // last step, inialize if advanced fields are enabled
  initializeAscentAdvancedFields(modal,acctid);

  if (isGym) {
    modal.find('.hide-if-gym').each(function(){
      var elem = $(this);
      elem.hide();
    });
  }

  if (!ascent.id) {
    onUpdateAscent();
  }
}

function getAscentModalRoutes(modal,routeIDs,reloadDataList,modalCallback){
  // after 30 seconds of not loading allow user to reload manually
  setTimeout(function() {
    if (modal.find('.action-btn').hasClass('disabled')) {
      var feedbackFooter = updateFeedbackFooter('<a href="#" class="btn fn-ascent-modal-reload">'+thecrag.getText('process.button.reload')+'</a>');
      feedbackFooter.find(".fn-ascent-modal-reload").unbind('click').bind('click',function(e){
        e.preventDefault();
        $('body').trigger('crag.load.stop-all');
        showLogAscentModal(reloadDataList);
      }); 
    }
  }, RELOAD_ASCENT_TIMEOUT); 
  var loadId = modal.data('load-id');
  $('body').trigger('crag.load.start');
  updateFeedbackDetails('route',thecrag.getText('template.ascent-modal.getting-route-details') + ' ...');
  // TODO BUG WITH loading count when cancelling because theCrag helper also does a load
  DAO.getNodes(routeIDs,function(routes){
    if (loadId !== modal.data('load-id')) {
      return
    }
    updateFeedbackDetails('route',thecrag.getText('template.ascent-modal.getting-route-details') + ' ... ' + thecrag.getText('process.button.done'));
    modalCallback(modal);
    $('body').trigger('crag.load.stop');
  },'pitch');
}

function setLogAscentPage(modal, page){
  var pageElement = modal.find('.modal-pagination-page');
  pageElement.html(page);
  pageElement.data('page', page);
}

function logAscent(ascent,successFn,failFn) {
  var url = "/api/ascent/create?markupType=html";
  var data={data:ascent};
  var urole = $('body').data('urole');
  if (urole) {
    data.role = urole;
  }
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function updateAscent(ascent,successFn,failFn) {
  var url = "/api/ascent/update?markupType=html";
  var data={data:ascent};
  var json=JSON.stringify(data);
  postAPI(url,json,successFn,failFn);
  return true;
}

function formatTagItem(item) {
  if (!item.id){
    return item.text;
  }
  var id = '#tag-'+item.id.toLowerCase().replace(/\s/,'-');
  var el = $(id);
  var icon = el.data('icon');
  if (!icon){
    return item.text;
  }
  return '<img class="icontag" src="'+icon+'" width="19" height="19" /> ' + item.text;
}


function initalizeAscentModalBindings(bindElem) {
  bindElem.find(".fn-log-ascent").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-log-ascent');
    var modal = elem.closest('.modal');
    modal.find('.action-btn').addClass('disabled');
    var routeID = elem.data("route-id");
    if (routeID) {
      showLogAscentModal([{routeID: routeID}]);
    }
  }); 
  bindElem.find(".fn-edit-ascent").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-edit-ascent');
    var modal = elem.closest('.modal');
    modal.find('.action-btn').addClass('disabled');
    var ascentID = elem.data("ascent-id");
    var routeID = elem.data("route-id");
    if (ascentID && routeID) {
      showLogAscentModal([{routeID: routeID, ascentID: ascentID}]);
    }
  }); 
  bindElem.find(".fn-complete-log-ascent").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-complete-log-ascent');
    var modal = elem.closest('.modal');
    return completeLogAscentModal_ajax(modal,elem,false);
  }); 
  bindElem.find(".fn-clone-log-ascent").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-clone-log-ascent');
    var modal = elem.closest('.modal');
    return completeLogAscentModal_ajax(modal,elem,true);
  }); 
  bindElem.find(".fn-log-ascent-nav-back").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-log-ascent-nav-back');
    var modal = elem.closest('.modal');
    return completeLogAscentModal_nav(modal,elem,'back');
  }); 
  bindElem.find(".fn-log-ascent-nav-forward").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-log-ascent-nav-forward');
    var modal = elem.closest('.modal');
    return completeLogAscentModal_nav(modal,elem,'forward');
  }); 
  bindElem.find(".fn-success-log-ascent").unbind('click').bind('click',function(e){
    e.preventDefault();
    var elem = $(this).closest('.fn-success-log-ascent');
    var modal = elem.closest('.modal');
    var reload = modal.find('input[name=reload-after-update]').val();
    if ( reload ) {
      location.reload();
    } else {
      // unselect node list view routes
      $('.node-listview .route.selected').each(function(){
        var route = $(this);
        route.removeClass('selected');
        route.find('input[type=checkbox][name="D:AscentNodeID"]:checked').prop("checked", false);
      });
      modal.modal('hide');
    }
  }); 
  bindElem.find(".fn-validate-integer").unbind('change').bind('change',function(e){
    e.preventDefault();
    var val = $(this).val();
    var parsedVal = parseInt(val,10);
    if (isNaN(parsedVal) ) {
      parsedVal = '';
    }
    if (val !== parsedVal) {
      $(this).val(parsedVal);
    }
  }); 
}

(function(){
  initalizeAscentModalBindings($("body"));

  $("#log-ascent-modal input[type=checkbox][name=show-advanced-fields]").unbind('change').bind('change',function(e){
    var modal = $("#log-ascent-modal");
    displayAscentAdvancedFields(modal);
    var acctid = $('body').data('uid');
    if (acctid) {
      var isSet = $("#log-ascent-modal input[type=checkbox][name=show-advanced-fields]").is(':checked');
      setMemorizeAscentAdvancedOption(acctid,isSet);
    }
  }); 
})();
