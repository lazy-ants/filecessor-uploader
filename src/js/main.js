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
                        createDOMimgAndCnvs (originLink);
                        $('.close-modal').click(function() {
                            resetFilecessorModal();
                        });
                    };
                }
            },
            error: function () {
            }
        });
    });
    
    var ias;

    //applying config options start _______________________________________________________________
    function applyFilecessorOptions (options) {
        !options.crop ? $('#crop-btn').css('display', 'none') : applyCropOptions(options.crop);
        !options.rotate ? $('#back-rotate-btn, #forward-rotate-btn').css('display', 'none') : applyRotateOptions(options.rotate);
        !options.resize ? $('#resize-plus-btn, #resize-minus-btn').css('display', 'none') : applyResizeOptions(options.resize);
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

    function applyCropOptions (cropOtions) {
        var cropBtn = $('#crop-btn');
        cropBtn.click(function () {
            ias = $('#canvas-image').imgAreaSelect({
                handles: true,
                parent: '.modal-body',
                instance: true,
                disable: true,
                onSelectEnd: function (img, selection) {
                }
            });
            $('#canvas-image').panzoom("disable");
            ias.setOptions({ enable: true });
        });
        if (typeof (cropOtions) === "object") {
            //TODO: apply every crop property
        }
    };

    function applyResizeOptions (resizeOtions) {

        // $("#resize-plus-btn").click(function () {
        //     if (ias) {
        //         ias.setOptions({ enable: false });
        //     }
        //     $('#canvas-image').panzoom("enable");
        //     changeSizeCanvasElToCanvasImg ();
        // });
        // $("#resize-minus-btn").click(function () {
        //     if (ias) {
        //         ias.setOptions({ enable: false });
        //     }
        //     $('#canvas-image').panzoom("enable");
        //     changeSizeCanvasElToCanvasImg ();
        // });
        if (typeof (resizeOtions) === "object") {
            //TODO: apply every resize property
        }
    };
    //applying config options end _______________________________________________________________

    function createDOMimgAndCnvs (imgSrc) {
        var img = $("<img>", {id: "uploaded-image", class: "uploaded-image resizeble"});
        var canvas = $("<canvas>", {id: "canvas-image", class: "resizeble"});
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

        $('#uploaded-image').panzoom({
            $zoomIn: $("#resize-plus-btn"),
            $zoomOut: $("#resize-minus-btn"),
            disablePan: true,
            $set: $('.modal-body').find('.resizeble'),
            onZoom: function (e) {
                var coefWidth = +$('#uploaded-image').panzoom("getMatrix")[0];
                var coefHeight = +$('#uploaded-image').panzoom("getMatrix")[3];
/*                var canvas = $('#canvas-image')[0];
                console.log(canvas.width, coefWidth);
                canvas.setAttribute('width', canvas.width * coefWidth);
                canvas.setAttribute('height', canvas.height * coefHeight);*/
                
            }
        });
    };

    //operations with image start _____________________________________________________
    function drawImageInCanvas (img) {
        var canvas = $('#canvas-image')[0];
        var cContext = canvas.getContext('2d');
        var cw = img.width, ch = img.height, cx = 0, cy = 0;
        canvas.setAttribute('width', cw);
        canvas.setAttribute('height', ch);
        cContext.drawImage(img, cx, cy, cw, ch);
        console.log(cContext);
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

    function changeSizeCanvasElToCanvasImg () {
        console.log($('#canvas-image')[0].getContext('2d'));
    }

    //operations with image end _____________________________________________________

    function resetFilecessorModal () {
        $( "#uploaded-image" ).remove();
        $( "#canvas-image" ).remove();
        $("#filecessor-input").get(0).value = "";
        $('#back-rotate-btn').off("click");
        $('#forward-rotate-btn').off("click");
    };

});

