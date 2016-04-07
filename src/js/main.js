var FILECESSOR_URL = "http://fc.lazy-ants.com";
var filecessorOptions;

$(function(){ 
    $.get('src/templates/UploadImagePopupTemplate.htm', function(template) {
        $.tmpl(template).appendTo('body');
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

                       var img = $("<img>", {id: "uploaded-image", class: "uploaded-image"});
                       var canvas = $("<canvas>", {id: "canvas-image"});
                       $("#editor-container").append(img);
                       $("#editor-container").append(canvas);

                       img = $('#uploaded-image')[0];
                       $('#filecessor-modal').modal();
                       img.addEventListener("load", function() {
                            setTimeout(function () {
                                drawImageInCanvas(img);
                            }, 100);
                       }, false);
                       $('#uploaded-image').attr("src", originLink);

                       $('#close-modal')[0].addEventListener("click", function() {
                           $( "#uploaded-image" ).remove();
                           $( "#canvas-image" ).remove();
                           $("#filecessor-input").get(0).value = "";
                           $('#back-rotate-btn').off("click");
                           $('#forward-rotate-btn').off("click");
                       }, false);
                   };
               }
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
        $('#back-rotate-btn').click(function () {
            var currentDegree = parseInt($('#canvas-image').attr('rotate'));
            var newDegree = currentDegree < 90 ? currentDegree + 270 : currentDegree - 90;
            rotateImageInCanvas ($('#uploaded-image')[0], newDegree);
        });

        $('#forward-rotate-btn').click(function () {
            var currentDegree = parseInt($('#canvas-image').attr('rotate'));
            var newDegree = currentDegree < 270 ? currentDegree + 90 : currentDegree - 270;
            rotateImageInCanvas ($('#uploaded-image')[0], newDegree);
        });

        if (typeof (rotateOtions) === "object") {
            //TODO: apply every rotate property
        }
    };

    function applyResizeOptions (resizeOtions) {
        if (typeof (resizeOtions) === "object") {
            //TODO: apply every resize property
        }
    };

    function drawImageInCanvas (img) {
        var canvas = $('#canvas-image')[0];
        var cContext = canvas.getContext('2d');
        var cw = img.width, ch = img.height, cx = 0, cy = 0;
        canvas.setAttribute('width', cw);
        canvas.setAttribute('height', ch);
        cContext.drawImage(img, cx, cy, cw, ch);
        $('#canvas-image').attr("rotate", 0);
    }

    function rotateImageInCanvas (img, rotateDegree) {
        var canvas = $('#canvas-image')[0];
        var cContext = canvas.getContext('2d');

        var cw = img.width, ch = img.height, scaleW = cw, scaleH = ch, cx = 0, cy = 0;
        //   Calculate new canvas size and x/y coorditates for image
        switch(rotateDegree){
            case 90:
                cw = img.width;
                ch = img.width * img.width / img.height;
                scaleW = ch;
                scaleH = cw;
                cy = img.width * (-1);
                break;
            case 180:
                cx = img.width * (-1);
                cy = img.height * (-1);
                break;
            case 270:
                cw = img.width;
                ch = img.width * img.width / img.height;
                scaleW = ch;
                scaleH = cw;
                cx = ch * (-1);
                break;
        }

        canvas.setAttribute('width', cw);
        canvas.setAttribute('height', ch);
        cContext.rotate(rotateDegree * Math.PI / 180);
        cContext.drawImage(img, cx, cy, scaleW, scaleH);
        $('#canvas-image').attr("rotate", rotateDegree);
    }

});

