var FILECESSOR_URL = "http://fc.lazy-ants.com";
var filecessorOptions;

$(function(){ 
    $.get('src/templates/UploadImagePopupTemplate.htm', function(template) {
        $.tmpl(template).appendTo('body');
        $('#filecessor-modal').modal(); //TODO: delete this row
    });

    $(document).on('change', '#filecessor-input', function() {
        applyFilecessorOptions(filecessorOptions);

        var input = $(this),
            file = input.get(0).files[0],
            formData = new FormData();
        
        formData.append('file', file);
        $.ajax({
           url: FILECESSOR_URL + '/api/photos/upload',
           method: 'POST',
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
           },
           error: function () {
           }
        });
    });

    function applyFilecessorOptions (options) {
        !options.crop ? $('#crop-btn').css('display', 'none') : applyCropOptions(options.crop);
        !options.rotate ? $('#back-rotate-btn, #forward-rotate-btn').css('display', 'none') : applyRotateOptions(options.rotate);
        !options.resize ? $('#resize-plus-btn, #resize-minus-btn').css('display', 'none') : applyResizeOptions(options.resize);
    };

    function applyCropOptions (cropOtions) {
        if (typeof (cropOtions) === "object") {
            //TODO: apply every crop property
        }
    };

    function applyRotateOptions (rotateOtions) {
        if (typeof (rotateOtions) === "object") {
            //TODO: apply every rotate property
        }
    };

    function applyResizeOptions (resizeOtions) {
        if (typeof (resizeOtions) === "object") {
            //TODO: apply every resize property
        }
    };

});

