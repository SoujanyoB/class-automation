var acc = document.getElementsByClassName("accordion");
var i;

for (i = 0; i < acc.length; i++) {
    acc[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var icon = this.querySelector('span.icon');
        var routine = this.nextElementSibling;
        if (routine.style.display === "block") {
            routine.style.display = "none";
            icon.innerHTML = '&plus;';
        } else {
            routine.style.display = "block";
            icon.innerHTML = '&minus;';
        }
    });
}



// Script to add a div with class timing and subject name input

var classTimingStart = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
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
    // selectOption.style.background = "none";
    // selectOption.style
    var defaultOption = document.createElement('option');
    defaultOption.setAttribute('value', 'default');
    defaultOption.appendChild(document.createTextNode('Start Time'));
    defaultOption.setAttribute('selected', 'selected');

    selectOption.appendChild(defaultOption);
    for (i = 0; i < classTimingStart.length; i++) {
        selectOption.appendChild(addSelectOptions(classTimingStart[i]));
    }
    // selectOption.appendChild()

    var div = document.createElement('div');
    div.setAttribute('class', 'individualRoutine');
    div.style.borderBottom = "none";
    div.appendChild(selectOption);
    div.appendChild(input);

    routineModule.appendChild(div);

}

function customizeBorder(routineModule) {
    if (routineModule.children.length != 1) {
        // routineModule.children[routineModule.children.length - 1].style.borderBottom = "1px solid black";
    } else {
        // routineModule.firstElementChild.style.border = "1px solid black";
    }
}

for (i = 0; i < addRoutineButtons.length; i++) {
    addRoutineButtons[i].addEventListener('click', e => {
        var routineModule = e.target.parentElement.previousElementSibling;

        addRoutineOption(routineModule);
        customizeBorder(routineModule);

        // console.log(routineModule);
    });
}