function pitchesSelectSlider(config) {
  var title = config.title;
  var onChange = config.onChange;
  var onExtend = config.onExtend;
  var min = config.min || "1";
  var max = config.max || "1";
  var startElem = config.startElem;
  var endElem = config.endElem;
  var initStart = config.initStart || min;
  var initEnd = config.initEnd || max;

  var settings = {
    min: min,
    max: max,
  }

  if (startElem) {
    startElem.html(initStart);
  }

  if (endElem) {
    endElem.html(initEnd);
  }

  var startSlider = $('<input type="range" class="start-pitch-select-slider" min="'+settings.min+'" max="'+settings.max+'" value="'+initStart+'">');
  var endSlider = $('<input type="range" class="end-pitch-select-slider" min="'+settings.min+'" max="'+settings.max+'" value="'+initEnd+'">');
  var dualSlider = $('<div class="dual-slider"></div>');

  var slider = $('<div class="pitches-select-slider"></div>');
  if (config.title !== undefined) {
    $('<div class="pitches-select-slider-title">' + config.title + '</div>').appendTo(slider);
  }
  startSlider.appendTo(dualSlider);
  endSlider.appendTo(dualSlider);
  dualSlider.appendTo(slider);

  var extendSlider = $('<div class="pitches-extend-slider">➕</div>');
  extendSlider.appendTo(slider);

  function orderDivsForStacking(dualSlider,startValue,endValue) {
    if (startValue !== endValue) {
      return;
    }
    if (Number(startValue) === Number(settings.min)) {
      if (dualSlider.find(":first-child").hasClass("end-pitch-select-slider")) {
        dualSlider.append(dualSlider.children().detach().get().reverse());
      }
      
    } else if (Number(endValue) === Number(settings.max)) {
      if (dualSlider.find(":first-child").hasClass("start-pitch-select-slider")) {
        dualSlider.append(dualSlider.children().detach().get().reverse());
      }
    }
  }

  startSlider.on("input change",function(e){
    var elem = $(e.target);
    var startValue = e.target.value;
    var dualSlider = elem.parent();
    endSlider = dualSlider.find('.end-pitch-select-slider');
    endValue = endSlider.val();
    if (Number(startValue) > Number(endValue)) {
      startValue = endValue;
      elem.val(startValue);
    }
    if (startElem) {
      startElem.html(startValue);
    }
    orderDivsForStacking(dualSlider,startValue,endValue);
    if (onChange) {
      onChange(startValue,endValue);
    }
  });

  endSlider.on("input change",function(e){
    var elem = $(e.target);
    var endValue = e.target.value;
    var dualSlider = elem.parent();
    startSlider = dualSlider.find('.start-pitch-select-slider');
    startValue = startSlider.val();
    if (Number(endValue) < Number(startValue)) {
      endValue = startValue;
      elem.val(endValue);
    }
    if (endElem) {
      endElem.html(endValue);
    }
    orderDivsForStacking(dualSlider,startValue,endValue);
    if (onChange) {
      onChange(startValue,endValue);
    }
  });

  extendSlider.on("click",function(e){
    var elem = $(e.target);
    var slider = elem.parent();
    settings.max = settings.max + 1;
    var startSlider = slider.find('.start-pitch-select-slider');
    startSlider.get(0).setAttribute("max",settings.max);
    var endSlider = slider.find('.end-pitch-select-slider');
    endSlider.get(0).setAttribute("max",settings.max);
    if (onExtend) {
      onExtend(settings.max);
    }
  });

  return slider;
}

