function searchProfByName() {
    // get name
    var lName = document.getElementById('sLName').value;
    // no entry
    if (lName == '') {
        return
    };
    //construct URL and redirect
    window.location = '/professors/search/' + encodeURI(lName)
}