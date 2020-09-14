//Global variables
var accordion = document.getElementsByClassName("accordion"); //For the vertical expansion menu
var i, subjectNames = [];
var classTimingStart = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]; //For selection options
var addRoutineButtons = document.getElementsByClassName('addRoutine'); //add routine button
var subjectSelector = document.querySelector('select#subjectNameSelection');


//Code to enable the vertical expansion menu for the routines
for (i = 0; i < accordion.length; i++) {
    accordion[i].addEventListener("click", function() {
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



//this code returns a value passed as an option to a select tag
function addSelectOptions(value) {
    var option = document.createElement('option');
    // option.style.opacity = "0.5";
    option.setAttribute('value', value);
    option.style.fontFamily = "Unisans-Thin";
    option.appendChild(document.createTextNode(value));

    return option;
}


//this code adds 
function addRoutineOption(routineModule, individualRoutine) {
    var copy = individualRoutine.cloneNode(true);
    copy.querySelector('select').selectedIndex = individualRoutine.querySelector('select').selectedIndex;

    var button = copy.querySelector('button');
    button.innerHTML = '&minus;';
    button.addEventListener('click', e => {
        e.target.parentElement.parentElement.remove();
    });

    routineModule.insertBefore(copy, individualRoutine);
    individualRoutine.querySelector('select').selectedIndex = "0";
    individualRoutine.querySelector('input').value = "";
}



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





// this code adds a click event listener to each of the addRoutine Buttons
for (i = 0; i < addRoutineButtons.length; i++) {
    addRoutineButtons[i].addEventListener('click', e => {
        var individualRoutine = e.target.parentElement.parentElement;
        var routineModule = individualRoutine.parentElement;

        findSubjectName(routineModule);
        addRoutineOption(routineModule, individualRoutine);
    });
}



// add Subject classroom link code
var addClassroomLinkButton = document.querySelector('button.addLinkButton');
addClassroomLinkButton.addEventListener('click', (e) => {
    var parentNode = e.target.parentElement;
    var clone = parentNode.cloneNode(true);

    clone.querySelector('select').selectedIndex = parentNode.querySelector('select').selectedIndex;

    var button = clone.querySelector('button');
    button.classList.remove('addLinkButton');
    button.classList.add('removeLinkButton');
    button.innerHTML = '&minus;';

    parentNode.querySelector('select').selectedIndex = "0";

    button.addEventListener('click', e => {
        e.target.parentElement.remove();
    });

    var grandpaNode = parentNode.parentElement;
    grandpaNode.insertBefore(clone, parentNode);

    parentNode.querySelector('input').value = "";


});