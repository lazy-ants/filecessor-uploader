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
        $('#back-rotate-btn').click(function () {
            var currentDegree = getRotationDegrees($('#uploaded-image'));
            var newDegree = currentDegree < 90 ? currentDegree + 270 : currentDegree - 90;
            setRotationDegrees($('#uploaded-image'), newDegree);
        });
        $('#forward-rotate-btn').click(function () {
            var currentDegree = getRotationDegrees($('#uploaded-image'));
            var newDegree = currentDegree < 270 ? currentDegree + 90 : currentDegree - 270;
            setRotationDegrees($('#uploaded-image'), newDegree);
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

    function getRotationDegrees(obj) {
        var matrix = obj.css("-webkit-transform") ||
        obj.css("-moz-transform")    ||
        obj.css("-ms-transform")     ||
        obj.css("-o-transform")      ||
        obj.css("transform");
        if(matrix !== 'none') {
            var values = matrix.split('(')[1].split(')')[0].split(',');
            var a = values[0];
            var b = values[1];
            var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));
        } else { var angle = 0; }
        return (angle < 0) ? angle + 360 : angle;
    };

    function setRotationDegrees(obj, degree) {
        var degreeValue = 'rotate(' + degree + 'deg)';
        obj.css('transform', degreeValue);
        obj.css("-webkit-transform", degreeValue);
        obj.css("-moz-transform", degreeValue);
        obj.css("-ms-transform", degreeValue);
        obj.css("-o-transform", degreeValue);
    };

});

