function updateEnroll(cid, sid) {
    console.log('worked')
    $.ajax({
        url: '/enrollments/' + cid + '&' + sid,
        type: 'PUT',
        data: $('#update-enroll').serialize(),
        success: function(result) {
            window.location = "/enrollments"
        }
    })
};