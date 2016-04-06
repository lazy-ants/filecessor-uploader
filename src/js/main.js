$(function(){ 

    var FILECESSOR_URL = "http://fc.lazy-ants.com";

    $(document).on('change', '.btn-file :file', function() {
        var input = $(this),
            file = input.get(0).files[0],
            formData = new FormData();
        
        formData.append('file', file);
        $.ajax({
           url: FILECESSOR_URL + '/api/photos/upload',
           method: 'POST',
           // headers: {
           //     "Authorization": "Bearer " + fileCessorToken
           // },
           data: formData,
           contentType: false,
           processData: false,
           crossDomain: true,
           success: function(data) {
               for (var i = 0; i < data.links.length; i++) {
                   var link = data.links[i];
                   if (link.rel == 'original') {
                       originLink = link.href;
                       $('#uploaded-image').attr("src", originLink);
                   };
               }
               $('#filecessor-modal').modal();

               // $('.loader').hide();
           },
           error: function () {
               // $('.loader').hide();
           }
       });
    });



});