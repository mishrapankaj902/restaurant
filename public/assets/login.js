$(document).ready(function () {

    $("#login").on('click', function () {
        
        $.ajax({
            type: 'POST',
            url: '/login',
            data: '',
            success: function (data) {
              
                //do something with the data via front-end framework
                //location.reload();
            }
        });
    })

});