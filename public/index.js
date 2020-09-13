var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        this.classList.toggle('last');
        var icon = this.querySelector('span.icon');
        var routine = this.nextElementSibling;
        if (routine.style.display === "block") {
            routine.classList.remove('last')
            routine.style.display = "none";
            icon.innerHTML = '&plus;';
        } else {
            routine.classList.add('last');
            routine.style.display = "block";
            icon.innerHTML = '&minus;';
        }
    });
}



// Script to add a div with class timing and subject name input

var classTimingStart = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
var subjectNames = [];
var addRoutineButtons = document.getElementsByClassName('addRoutine');

function addSelectOptions(value) {
    var option = document.createElement('option');
    // option.style.opacity = "0.5";
    option.setAttribute('value', value);
    option.style.fontFamily = "Unisans-Thin";
    option.appendChild(document.createTextNode(value));

    return option;
}


function addRoutineOption(routineModule) {

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'subjectNameInput');
    input.setAttribute('placeholder', 'Subject Name');

    var selectOption = document.createElement('select');
    selectOption.setAttribute('class', 'timeSelection');

    var defaultOption = document.createElement('option');
    defaultOption.setAttribute('value', 'default');
    defaultOption.appendChild(document.createTextNode('Start Time'));
    defaultOption.setAttribute('selected', 'selected');

    selectOption.appendChild(defaultOption);
    for (i = 0; i < classTimingStart.length; i++) {
        selectOption.appendChild(addSelectOptions(classTimingStart[i]));
    }

    var div = document.createElement('div');
    div.setAttribute('class', 'individualRoutine');
    div.style.borderBottom = "none";
    div.appendChild(selectOption);
    div.appendChild(input);

    routineModule.appendChild(div);

}

var subjectSelector = document.querySelector('select#subjectNameSelection');

function findSubjectName(routineModule) {
    var individualRoutines = routineModule.children;
    for (i = 0; i < individualRoutines.length; i++) {
        var value = individualRoutines[i].querySelector('input').value.toUpperCase();
        if (subjectNames.length && !subjectNames.includes(value)) {
            subjectNames.push(value);
            subjectSelector.appendChild(addSelectOptions(value));
        }
        if (!subjectNames.length) {
            subjectNames.push(value);
            subjectSelector.appendChild(addSelectOptions(value));
        }
    }
}






for (i = 0; i < addRoutineButtons.length; i++) {
    addRoutineButtons[i].addEventListener('click', e => {
        var routineModule = e.target.parentElement.previousElementSibling;

        findSubjectName(routineModule);
        addRoutineOption(routineModule);
        // addSubjectSelectionOption();

        // console.log(routineModule);
    });
}



// add Subject classroom link code
var addClassroomLinkButton = document.querySelector('button.addLinkButton');
addClassroomLinkButton.addEventListener('click', (e) => {
    var parentNode = e.target.parentElement;
    var clone = parentNode.cloneNode(true);

    var button = clone.querySelector('button');
    button.classList.remove('addLinkButton');
    button.classList.add('removeLinkButton');
    button.innerHTML = '&minus;';

    button.addEventListener('click', e => {
        e.target.parentElement.remove();
    });

    var grandpaNode = parentNode.parentElement;
    grandpaNode.insertBefore(clone, parentNode);

    parentNode.querySelector('input').value = "";


});