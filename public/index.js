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


var addRoutineButtons = document.getElementsByClassName('addRoutine');

var classTimingStart = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM"];
// var classTimingEnd = ["9 AM", "10 AM", "11 AM", "12 PM", "1 PM", "2 PM", "3 PM", "4 PM", "5 PM"]


function addSelectOptions(value) {
    var option = document.createElement('option');
    option.setAttribute('value', value);
    option.appendChild(document.createTextNode(value));

    return option;
}

function addRoutineOption(routineModule) {

    var input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('class', 'subjectNameInput');

    var selectOption = document.createElement('select');
    selectOption.setAttribute('class', 'timeSelection');

    for (i = 0; i < classTimingStart.length; i++) {
        selectOption.appendChild(addSelectOptions(classTimingStart[i]));
    }
    // selectOption.appendChild()

    routineModule.appendChild(selectOption);
    routineModule.appendChild(input);

}


for (i = 0; i < addRoutineButtons.length; i++) {
    addRoutineButtons[i].addEventListener('click', e => {
        var routineModule = e.target.parentElement.previousElementSibling;

        addRoutineOption(routineModule);

        // console.log(routineModule);
    });
}

console.log('hello world');
