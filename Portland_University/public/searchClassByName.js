function searchClassByName() {
    // get class name
    var name = document.getElementById('sName').value;
    // no entry
    if (name == '') {
        return
    };
    //construct URL and redirect
    window.location = '/classes/byName/' + encodeURI(name)
}