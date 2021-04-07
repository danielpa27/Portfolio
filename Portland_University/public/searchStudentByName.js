function searchStudentByName() {
    // get name
    var lName = document.getElementById('sLName').value;
    // no entry
    console.log(lName)
    if (lName == '') {
        return
    };

    //construct URL and redirect
    window.location = '/students/search/' + encodeURI(lName)
}