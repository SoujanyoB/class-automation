var inputs = document.querySelectorAll('input');

function checkForm() {
    if (document.loginForm.email.value == '' || document.loginForm.password.value == '') {
        document.getElementById('error').style.opacity = '1';
        return false;
    }


    return true;
}


for (var i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener('click', () => {
        document.getElementById('error').style.opacity = '0';
    });
}