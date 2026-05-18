
function tcFormatGradeAtom(grade) {
  var text = grade.gradeDisplayOverride || grade.grade || grade.label || '?';

  var gradeBand = grade.gradeBand || grade.bandLevel;

  var gb = gradeBand ? 'gb' + gradeBand.toString() : '';

  var swatch = '';

  if (grade.swatchStyle) {
    swatch = 'swatch';

    if (grade.swatchStyle.match(/^[a-z]+$/)) {
      swatch += ' swatch-' + grade.swatchStyle;
    }
  }

  return '<span class="grade ' + gb + ' ' + swatch + '">' + text + '</span>';
}

function tcGradeSystemConfig(systemIdOrLabel) {
  if (tcGrades === undefined)  {
    return undefined
  }

  return tcGrades.filter(function(gradeSystem){
    return systemIdOrLabel === gradeSystem.label || systemIdOrLabel === gradeSystem.id;
  })[0];
}

function tcGradeSystemLabel(systemIdOrLabel) {
  var gradeSystem = tcGradeSystemConfig(systemIdOrLabel);
  if (!gradeSystem) {
    return undefined;
  }

  return gradeSystem.label
}

function tcGradeConfig(systemIdOrLabel,gradeLabel) {
  var gradeSystem = tcGradeSystemConfig(systemIdOrLabel);
  if (!gradeSystem) {
    return undefined;
  }

  return gradeSystem.grade.filter(function(grade){
    return gradeLabel === grade.label;
  })[0];
}

function tcGradeBandLevel(systemIdOrLabel,gradeLabel) {
  var grade = tcGradeConfig(systemIdOrLabel,gradeLabel);
  if (!grade) {
    return undefined;
  }

  return grade.bandLevel;
}

function tcGradePickSelf(systemIdOrLabel,gradeLabel) {
  var gradeSystem = tcGradeSystemConfig(systemIdOrLabel);

  if (!gradeSystem) {
    return undefined;
  }

  for (var grade of gradeSystem.grade) {
    if (gradeLabel === grade.label) {
      return grade;
    }
  }

  return undefined
}

function tcPickGrades(fromGrades,label,length) {
  var matched = false;
  var grades = [];

  for (var grade of fromGrades) {
    if (grade.label === '--') {
      continue;
    }

    if (matched) {
      if (length !== undefined && length >= 0 && grades.length >= length) {
        break;
      }

      grades.push(grade);
    }

    if (label === grade.label) {
      matched = true;
    }
  }

  if (!grades.length) {
    return undefined;
  }

  return grades;
}

function tcGradePickAfter(systemIdOrLabel,gradeLabel,length) {
  var gradeSystem = tcGradeSystemConfig(systemIdOrLabel);

  if (!gradeSystem) {
    return undefined;
  }

  return tcPickGrades(gradeSystem.grade,gradeLabel,length);
}

function tcGradePickBefore(systemIdOrLabel,gradeLabel,length) {
  var gradeSystem = tcGradeSystemConfig(systemIdOrLabel);
  if (!gradeSystem) {
    return undefined;
  }

  var fromGrades = gradeSystem.grade.slice().reverse();

  var selectedGrades = tcPickGrades(fromGrades,gradeLabel,length);

  if (!selectedGrades) {
    return undefined;
  }

  return selectedGrades.reverse();
}
