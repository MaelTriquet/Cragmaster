function gradeSelectSlider(config) {
  var grades = config.grades || [];
  var max = grades.length;

  var outputPosition = config.outputPosition || 'left';
  var gradeElement = config.gradeElement;

  var defaultSliderValue = tcGradeSliderGetValue(grades,config.defaultGrade);

  var value = defaultSliderValue 
    ? defaultSliderValue
    : outputPosition === 'right' 
    ? max
    : 1;
    
  var slider = $('<div class="grade-select-slider"><input type="range" min="1" max="'+max+'" value="'+value+'"></div>');

  if (config.inactive) {
    slider.find('input').addClass('disabled').prop( "disabled", true );
  } else {
    slider.on("input change",function(e){
      var elem = $(e.target);

      var grade = tcGradeSliderGetGrade(grades,e.target.value);
      var outputText = grade ? tcFormatGradeAtom(grade) : '';

      if (gradeElement) {
        gradeElement.html(outputText);
      } else {
        elem.parent().find('.grade-select-slider-output').html(outputText);
      }
    });

    var output = undefined;

    if (gradeElement) {
      output = gradeElement;

    } else {
      output = $('<div class="grade-select-slider-output"></div>');
  
      if (outputPosition === 'right') {
        output.appendTo(slider);
      } else {
        output.prependTo(slider);
      }
    }

    var grade = tcGradeSliderGetGrade(grades,value);

    if (grade) {
      output.html(tcFormatGradeAtom(grade));
    }
  }

  return slider;
}

function tcGradeSliderGetValue(grades,gradeLabel) {
  if (!grades || !gradeLabel) {
    return undefined;
  }

  for (let i = 0; i < grades.length; i++) {
    if (gradeLabel === grades[i].label) {
      return i + 1;
    }
  }

  return undefined;
}

function tcGradeSliderGetGrade(grades,value) {
  return grades[value-1];
}
