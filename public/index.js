//Global variables
var accordion = document.getElementsByClassName("accordion"); //For the vertical expansion menu
var i, subjectNames = [];
var classTimingStart = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"]; //For selection options
var addRoutineButtons = document.getElementsByClassName('addRoutine'); //add routine button
var subjectSelector = document.querySelector('select#subjectNameSelection');
var doneRoutineButtons = document.getElementsByClassName('doneRoutine');
var addClassroomLinkButton = document.querySelector('button.addLinkButton');


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

    var button = copy.querySelector('button.addRoutine');
    button.innerHTML = '&minus;';
    button.addEventListener('click', e => {


        var flag = true;
        var subjectName = e.target.parentElement.parentElement.querySelector('input').value;
        e.target.parentElement.parentElement.remove();

        var routineSubjects = document.querySelectorAll('input.subjectNameInput');

        for (var j = 0; j < routineSubjects.length; j++) {
            if (routineSubjects[i].value == subjectName && routineSubjects.parentElement.class == 'individualRoutine') {
                flag = false;
                break;
            }
        }

        if (flag) {
            subjectNames.splice(subjectNames.indexOf(copy.querySelector('input').value.toUpperCase()), 1);
        }
        findSubjectName(routineModule);


    });

    copy.querySelector('button.doneRoutine').setAttribute('disabled', 'true');
    copy.querySelector('button.doneRoutine').style.opacity = "0";
    copy.querySelector('button.doneRoutine').addEventListener('mouseover', () => {
        copy.querySelector('button.doneRoutine').style.cursor = "default";
    });

    routineModule.insertBefore(copy, individualRoutine);
    individualRoutine.querySelector('select').selectedIndex = "0";
    individualRoutine.querySelector('input').value = "";
}

function addSubject() {
    if (subjectSelector.children.length > 1) {
        i = 1;
        while (i != subjectSelector.children.length) {
            subjectSelector.children[i].remove();
        }
    }
    for (i = 0; i < subjectNames.length; i++) {
        subjectSelector.appendChild(addSelectOptions(subjectNames[i]));
    }
}

function findSubjectName(routineModule) {
    var individualRoutines = routineModule.children;
    for (i = 0; i < individualRoutines.length; i++) {
        var value = individualRoutines[i].querySelector('input').value.toUpperCase();
        if (subjectNames.length && !subjectNames.includes(value) && value != '') {
            subjectNames.push(value);
        }
        if (!subjectNames.length && value != '') {
            subjectNames.push(value);
        }
    }
    addSubject();
}



//this code adds subject names to select option in classroom links
for (i = 0; i < doneRoutineButtons.length; i++) {
    doneRoutineButtons[i].addEventListener('click', e => {
        findSubjectName(e.target.parentElement.parentElement.parentElement);
    });

}


// this code adds a click event listener to each of the addRoutine Buttons
for (i = 0; i < addRoutineButtons.length; i++) {
    addRoutineButtons[i].addEventListener('click', e => {
        var individualRoutine = e.target.parentElement.parentElement;
        var routineModule = individualRoutine.parentElement;
        // var doneRoutineButton = e.target.previousElementSibling;

        // console.log(individualRoutine.querySelector('input').value, individualRoutine.querySelector('select').value);

        if (individualRoutine.querySelector('input').value != '' && individualRoutine.querySelector('select').value != 'default') {
            addRoutineOption(routineModule, individualRoutine);
            findSubjectName(routineModule);
        }
    });
}



// add Subject classroom link code
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


// This code makes add subject button disabled without filling up both values
// for (i = 0; i < selectionOptions.length; i++) {
//     selectionOptions[i].addEventListener('change', e => {
//         var parent = e.target.parentElement;
//         var input =
//             // console.log(e.target);
//     });
// }