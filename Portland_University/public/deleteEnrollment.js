function deleteEnroll(cid, sid) {
    console.log("delete enroll")
    $.ajax({
        url: '/enrollments/cid/' + cid + '/sid/' + sid,
        type: 'DELETE',
        success: function(result) {
            if (result.responseText != undefined) {
                alert(result.responseText)
            } else {
                window.location.reload(true)
            }
        }
    })
};