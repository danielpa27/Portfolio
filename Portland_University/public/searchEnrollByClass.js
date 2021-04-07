function searchEnrollByClass() {
    // get class name
    var cName = document.getElementById('sCname').value;
    // no entry
    if (cName == '') {
        return
    };
    //construct URL and redirect
    window.location = '/enrollments/by_class/' + encodeURI(cName)
}