function searchClassByMajor() {
    //get the id of the selected major from the filter dropdown
    var major_id = document.getElementById('sMajor').value;

    //construct the URL and redirect to it
    window.location = '/classes/byMajor/' + parseInt(major_id)
}