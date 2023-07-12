/* Summernote-cleaner BOOSTED by MAXIA.EDUCATION  */
/* Version: 2.0 */

convert = function (input) {
    // DEPRECATED (ONLY USED IF WE PASS ('<mml:math') as TEXT/PLAIN)
    //  Get the MathML input string, and clear any previous output
    input = input.trim();
    // Get the svg inline element
    var svgElement = MathJax.mathml2svg(input).querySelector('svg')
    // create an image
    var img = document.createElement('img')
    // Serialize the svg to string
    var svgString = new XMLSerializer().serializeToString(svgElement);
    // Remove any characters outside the Latin1 range
    var decoded = decodeURIComponent(encodeURIComponent(svgString));
    // Now we can use btoa to convert the svg to base64
    var base64 = btoa(decoded);
    var imgSource = `data:image/svg+xml;base64,${base64}`;
    img.setAttribute('src', imgSource);
    img.className = 'equation-img-maxia'
    return img.outerHTML
};

// Functions extract images from RTF
RtfImgExtract = function (arr2) {
    const getAllIndexes = function (arr, val) {
        var indexes = [], i = -1;
        while ((i = arr.indexOf(val, i + 1)) != -1) {
            indexes.push(i);
        }
        return indexes;
    };
    
    const findPictLastBracketPosition = function (arr, initial) {
        openBrackets = 1;
        var i = 1;
        // Iterate over string until openBrackets is zero
        while (openBrackets > 0) {
            if (arr[initial+i] === '{'){
                openBrackets++;
            }
            else if (arr[initial+i] === '}'){
                openBrackets--;
            }
            i++;
        }
        // Return the closing Bracket
        return initial+i;
    };
    
    const extractHexFromPict = function(arrPict) {
        // A '\pict' element is composed by tags {} that can be nested, followed by the HEX code
        // We must get the blipuid position and find the closing bracket
        blipuidIndex = arrPict.indexOf('blipuid');
        // Find the closing bracket
        beforeLastClosingBracket = arrPict.indexOf('}', blipuidIndex);
    
        return arrPict.slice(beforeLastClosingBracket+1, -1);
    };
    
    const hexToBase64 = function (hexstring) {
        return btoa(hexstring.match(/\w{2}/g).map(function(a) {
            return String.fromCharCode(parseInt(a, 16));
        }).join(""));
    };

    // First, get all initial index
    allPictures = [];
    pictFormats = [];
    all_initial = getAllIndexes(arr2, `{\\pict`);
    all_initial.forEach((initial, i) => {
        // get last
        var final = findPictLastBracketPosition(arr2, initial);
        var foundPict = arr2.slice(initial, final);
        var pictFormat = null;
        if (foundPict.indexOf('pngblip') > -1){
            pictFormat = 'data:image/png;base64';
        }
        else if (foundPict.indexOf('jpegblip') > -1){
            pictFormat = 'data:image/jpeg;base64';
        }
        if (pictFormat !== null){
            // Get format
            pictFormats.push(pictFormat);
            allPictures.push(foundPict);
        }
    });
    return allPictures.map(function(el, i) {
        return pictFormats[i] + ',' + hexToBase64(extractHexFromPict(el));
    });
};

const recursivelyCleanOutBadTags = function(input) {
    allowed_tags = [
        'a',
        'b',
        'br',
        'div',
        'em',
        'figcaption',
        'figure',
        'font',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'hr',
        'i',
        'img',
        'label',
        'm',
        'mark',
        'p',
        'picture',
        'q',
        's',
        'span',
        'strong',
        'sub',
        'sup',
        'svg',
        'table',
        'tbody',
        'td',
        'tfoot',
        'th',
        'thead',
        'tr',
        'u'
    ];

    for (var i= input.children.length; i-->0;) {
        child = input.children[i];
        if (child.tagName.toLowerCase() === 'img') {
            if (child.className !== 'equation-img-maxia') {
                child.outerHTML = '<div class="img-div">' + child.outerHTML + '</div>'
                // child.removeAttribute('class')
                // child.outerHTML = '<div class="img-div equationImg">' + child.outerHTML + '</div>'
            }
            // else {
            //     child.outerHTML = '<div class="img-div">' + child.outerHTML + '</div>'
            // }
            // child.outerHTML = '<div class="img-div">' + child.outerHTML + '</div>'
        }

        if (allowed_tags.includes(child.tagName.toLowerCase())) {
            recursivelyCleanOutBadTags(child);
        } else {
            child.parentNode.removeChild(child);
        }
    };
};

const swapElements = (body, old_tag, new_tag) => {
    const old_tags = body.getElementsByTagName(old_tag);
    for (var i= old_tags.length; i-->0;) {
        old_tags[i].outerHTML = `<${new_tag}>` + old_tags[i].innerHTML + `</${new_tag}>`
    };
};


(function (factory) {
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = factory(require('jquery'));
    } else {
        factory(window.jQuery);
    }
}
    (function ($) {
        $.extend(true, $.summernote.lang, {
            'en-US': {
                cleaner: {
                    tooltip: 'Cleaner',
                    not: 'Text has been cleaned!',
                    limitText: 'Text',
                    limitHTML: 'HTML'
                }
            },
            'de-DE': {
                cleaner: {
                    tooltip: 'Reinigungskraft',
                    not: 'Inhalt wurde bereinigt!',
                    limitText: 'Text',
                    limitHTML: 'HTML'
                }
            },
        });
        $.extend($.summernote.options, {
            // MAXIA MODIFICATION: CHANGED SOME DEFAULT
            cleaner: {
                action: 'both', // both|button|paste 'button' only cleans via toolbar button, 'paste' only clean when pasting content, both does both options.
                icon: '<i class="note-icon"><svg xmlns="http://www.w3.org/2000/svg" id="libre-paintbrush" viewBox="0 0 14 14" width="14" height="14"><path d="m 11.821425,1 q 0.46875,0 0.82031,0.311384 0.35157,0.311384 0.35157,0.780134 0,0.421875 -0.30134,1.01116 -2.22322,4.212054 -3.11384,5.035715 -0.64956,0.609375 -1.45982,0.609375 -0.84375,0 -1.44978,-0.61942 -0.60603,-0.61942 -0.60603,-1.469866 0,-0.857143 0.61608,-1.419643 l 4.27232,-3.877232 Q 11.345985,1 11.821425,1 z m -6.08705,6.924107 q 0.26116,0.508928 0.71317,0.870536 0.45201,0.361607 1.00781,0.508928 l 0.007,0.475447 q 0.0268,1.426339 -0.86719,2.32366 Q 5.700895,13 4.261155,13 q -0.82366,0 -1.45982,-0.311384 -0.63616,-0.311384 -1.0212,-0.853795 -0.38505,-0.54241 -0.57924,-1.225446 -0.1942,-0.683036 -0.1942,-1.473214 0.0469,0.03348 0.27455,0.200893 0.22768,0.16741 0.41518,0.29799 0.1875,0.130581 0.39509,0.24442 0.20759,0.113839 0.30804,0.113839 0.27455,0 0.3683,-0.247767 0.16741,-0.441965 0.38505,-0.753349 0.21763,-0.311383 0.4654,-0.508928 0.24776,-0.197545 0.58928,-0.31808 0.34152,-0.120536 0.68974,-0.170759 0.34821,-0.05022 0.83705,-0.07031 z"/></svg></i>',
                keepHtml: true,
                keepTagContents: ['span'], //Remove tags and keep the contents
                badTags: ['applet', 'col', 'colgroup', 'embed', 'noframes', 'noscript', 'script', 'style', 'title', 'meta', 'link', 'head'], //Remove full tags with contents
                badAttributes: ['bgcolor', 'border', 'height', 'cellpadding', 'cellspacing', 'lang', 'start', 'style', 'valign', 'width'], //Remove attributes from remaining tags
                limitChars: 0, // 0|# 0 disables option
                limitDisplay: 'both', // none|text|html|both
                limitStop: false, // true/false
                notTimeOut: 850, //time before status message is hidden in miliseconds
                imagePlaceholder: 'https://via.placeholder.com/200'
            }
        });
        $.extend($.summernote.plugins, {
            'cleaner': function (context) {
                var self = this,
                    ui = $.summernote.ui,
                    $note = context.layoutInfo.note,
                    $editor = context.layoutInfo.editor,
                    options = context.options,
                    lang = options.langInfo;
                if (options.cleaner.action == 'both' || options.cleaner.action == 'button') {
                    context.memo('button.cleaner', function () {
                        var button = ui.button({
                            contents: options.cleaner.icon,
                            container: options.container,
                            tooltip: lang.cleaner.tooltip,
                            placement: options.placement,
                            click: function () {
                                if ($note.summernote('createRange').toString())
                                    $note.summernote('pasteHTML', $note.summernote('createRange').toString());
                                else
                                    $note.summernote('code', cleanPaste($note.summernote('code'), options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, options.cleaner.imagePlaceholder), true);
                                if ($editor.find('.note-status-output').length > 0)
                                    $editor.find('.note-status-output').html(lang.cleaner.not);
                            }
                        });
                        return button.render();
                    });
                }
                this.events = {
                    'summernote.init': function () {
                        if (options.cleaner.limitChars != 0 || options.cleaner.limitDisplay != 'none') {
                            var textLength = $editor.find(".note-editable").text().replace(/(<([^>]+)>)/ig, "").replace(/( )/, " ");
                            var codeLength = $editor.find('.note-editable').html();
                            var lengthStatus = '';
                            if (textLength.length > options.cleaner.limitChars && options.cleaner.limitChars > 0)
                                lengthStatus += 'note-text-danger">';
                            else
                                lengthStatus += '">';
                            if (options.cleaner.limitDisplay == 'text' || options.cleaner.limitDisplay == 'both')
                                lengthStatus += lang.cleaner.limitText + ': ' + textLength.length;
                            if (options.cleaner.limitDisplay == 'both')
                                lengthStatus += ' / ';
                            if (options.cleaner.limitDisplay == 'html' || options.cleaner.limitDisplay == 'both')
                                lengthStatus += lang.cleaner.limitHTML + ': ' + codeLength.length;
                            
                            // MAXIA MODIFICATION
                            // $editor.find('.note-status-output').html('<small class="note-pull-right ' + lengthStatus + '&nbsp;</small>');
                        }
                    },
                    // 'summernote.keydown': function (we, event) {
                    //     if (options.cleaner.limitChars != 0 || options.cleaner.limitDisplay != 'none') {
                    //         var textLength = $editor.find(".note-editable").text().replace(/(<([^>]+)>)/ig, "").replace(/( )/, " ");
                    //         var codeLength = $editor.find('.note-editable').html();
                    //         var lengthStatus = '';
                    //         if (options.cleaner.limitStop == true && textLength.length >= options.cleaner.limitChars) {
                    //             var key = event.keyCode;
                    //             allowed_keys = [8, 37, 38, 39, 40, 46];
                    //             if ($.inArray(key, allowed_keys) != -1) {
                    //                 $editor.find('.cleanerLimit').removeClass('note-text-danger');
                    //                 return true;
                    //             } else {
                    //                 $editor.find('.cleanerLimit').addClass('note-text-danger');
                    //                 event.preventDefault();
                    //                 event.stopPropagation();
                    //             }
                    //         } else {
                    //             if (textLength.length > options.cleaner.limitChars && options.cleaner.limitChars > 0)
                    //                 lengthStatus += 'note-text-danger">';
                    //             else
                    //                 lengthStatus += '">';
                    //             if (options.cleaner.limitDisplay == 'text' || options.cleaner.limitDisplay == 'both')
                    //                 lengthStatus += lang.cleaner.limitText + ': ' + textLength.length;
                    //             if (options.cleaner.limitDisplay == 'both')
                    //                 lengthStatus += ' / ';
                    //             if (options.cleaner.limitDisplay == 'html' || options.cleaner.limitDisplay == 'both')
                    //                 lengthStatus += lang.cleaner.limitHTML + ': ' + codeLength.length;
                    //             $editor.find('.note-status-output').html('<small class="cleanerLimit note-pull-right ' + lengthStatus + '&nbsp;</small>');
                    //         }
                    //     }
                    // },
                    'summernote.paste': function (we, event) {
                        if (options.cleaner.action == 'both' || options.cleaner.action == 'paste') {
                            event.preventDefault();
                            var ua = window.navigator.userAgent;
                            var msie = ua.indexOf("MSIE ");
                            msie = msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./);
                            var ffox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
                            var text; var isHtmlData = false;
                            var rtfContent = event.originalEvent.clipboardData.getData('text/rtf');

                            // Extract images from rtfContent
                            var images = RtfImgExtract(rtfContent);

                            if (msie)
                                text = window.clipboardData.getData("Text");
                            else {
                                var dataType = 'text/plain';
                                /*only get the html data if its avaialble else use plain text*/
                                if (options.cleaner.keepHtml && event.originalEvent.clipboardData.types.indexOf('text/html') > -1 || event.originalEvent.clipboardData.getData('text/plain').indexOf('<mml:math') > -1) {
                                    dataType = 'text/html';
                                    isHtmlData = true;
                                }
                                text = event.originalEvent.clipboardData.getData(dataType);
                            }
                            if (text) {
                                if (msie || ffox) {
                                    setTimeout(function () {
                                        $note.summernote('pasteHTML', cleanPaste(text, options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, images, isHtmlData));
                                    }, 1);
                                } else
                                    $note.summernote('pasteHTML', cleanPaste(text, options.cleaner.badTags, options.cleaner.keepTagContents, options.cleaner.badAttributes, images, isHtmlData));
                                if ($editor.find('.note-status-output').length > 0) {
                                    $editor.find('.note-status-output').html(lang.cleaner.not);
                                    /*now set a timeout to clear out the message */
                                    setTimeout(function () {
                                        if ($editor.find('.note-status-output').html() == lang.cleaner.not) {
                                            /*lets fade out the text, then clear it and show the control ready for next time */
                                            $editor.find('.note-status-output').fadeOut(function () {
                                                $(this).html("");
                                                $(this).fadeIn();
                                            });
                                        }
                                    }, options.cleaner.notTimeOut)
                                }
                            }
                        }
                    }
                }
                var cleanPaste = function (input, badTags, keepTagContents, badAttributes, imagesBase64, isHtmlData) {

                    if (isHtmlData) {
                        return cleanHtmlPaste(input, badTags, keepTagContents, badAttributes, imagesBase64);
                    } else {
                        return cleanTextPaste(input);
                    }
                };

                var cleanTextPaste = function (input) {
                    // Check if it is an equation
                    isEq = input.indexOf('<mml:math') > -1

                    if (isEq){
                        // Call MathJax v3
                        return convert(input)
                    }
                    else{
                        var newLines = /(\r\n|\r|\n)/g;
                        var parsedInput = input.split(newLines);
                        if (parsedInput.length === 1) { return input; }
                        var output = "";
                        /*for larger blocks of text (such as multiple paragraphs) match summernote markup */
                        for (let contentIndex = 0; contentIndex < parsedInput.length; contentIndex++) {
                            const element = parsedInput[contentIndex];
                            if (!newLines.test(element)) {
                                var line = element == '' ? '<br>' : element;
                                output += '<p>' + line + '</p>'
                            }
                        }
                        return output;
                    }


                    
                }

                var cleanHtmlPaste = function (input, badTags, keepTagContents, badAttributes, imagesBase64) {
                    
                    // outputElement.innerHTML = output;
                    // const eqs = [...outputElement.getElementsByTagName('m:oMathPara')];
                    // console.log(eqs.length);
                    // eqs.forEach((element, i) => {
                    //     console.log(i)
                    // })

                    var stringStripper = /( class=(")?Mso[a-zA-Z]+(")?)/gmi;
                    /*remove MS office class crud*/
                    var output = input.replace(stringStripper, '');
                    var commentStripper = new RegExp('<!--(.*?)-->', 'gmi');
                    output = output.replace(commentStripper, '');
                    /*remove MS office comment if else crud */
                    var commentIfStripper = new RegExp('<![^>\v]*>', 'gmi');
                    output = output.replace(commentIfStripper, '');
                    var tagStripper = new RegExp('<(/)*(\\?xml:|st1:|o:|v:)[^>\v]*>', 'gmi');
                    // output = output.replace(/ src="(.*?)"/gmi, ' src="' + imagePlaceholder + '"');
                    output = output.replace(/ name="(.*?)"/gmi, ' data-title="$1" alt="$1"');
                    /*remove MS office tag crud*/
                    output = output.replace(tagStripper, '');
                    for (var i = 0; i < badTags.length; i++) {
                        const badTag = badTags[i];
                        /*remove the tag and its contents*/
                        tagStripper = new RegExp('<' + badTag + '(.|\r|\n)*</' + badTag + '[^>\v]*>', 'gmi');
                        output = output.replace(tagStripper, '');
                        /*remove tags with no ending tag or rogue ending tags*/
                        var singletonTagStripper = new RegExp('</?' + badTag + '[^>\v]*>', 'gmi');
                        output = output.replace(singletonTagStripper, '');
                    }
                    for (var i = 0; i < keepTagContents.length; i++) {
                        /*remove tags only*/
                        tagStripper = new RegExp('</?' + keepTagContents[i] + '[^>\v]*>', 'gmi');
                        output = output.replace(tagStripper, ' ');
                    }
                    for (var i = 0; i < badAttributes.length; i++) {
                        const badAttribute = badAttributes[i];
                        /*for attribute matching ensure we match a new line or some kind of space to prevents partial matching for attributes 
                        (e.g. color would modify bgcolor tag to be just bg) */
                        var attributeWithSpeechMarksStripper = new RegExp('(\s|\r\n|\r|\n| )' + badAttribute + '="[^"\v]*"', 'gmi');
                        output = output.replace(attributeWithSpeechMarksStripper, '');
                        var attributeWithApostropheStripper = new RegExp('(\s|\r\n|\r|\n| )' + badAttribute + "='[^'\v]*'", 'gmi');
                        output = output.replace(attributeWithApostropheStripper, '');
                    }
                    output = output.replace(/ align="(.*?)"/gi, ' class="text-$1"');
                    output = output.replace(/ class="western"/gi, '');
                    output = output.replace(/ class=""/gi, '');
                    output = output.replace(/<b>(.*?)<\/b>/gi, '<strong>$1</strong>');
                    output = output.replace(/<i>(.*?)<\/i>/gi, '<em>$1</em>');
                    output = output.replace(/\s{2,}/g, ' ').trim();
                    
                    // Check if any equation OMML is present, if so, remove omathpara, leave image (placeholder)
                    var outputElement = document.createElement('div');
                    outputElement.innerHTML = output;
                    // if(mathEl.length > 0){
                    //     parent = mathEl[0].parentNode;
                    //     console.log(mathEl[0].nextSibling.cloneNode(true))
                    //     parent.removeChild(mathEl[0]);
                    //     output = outputElement.innerHTML;
                    // }
                    // Replace the images sources
                    if (imagesBase64.length > 0){
                        const imgElements = [...outputElement.getElementsByTagName('img')];
                        imgElements.forEach((element, i) => {
                            element.src = imagesBase64[i]
                            // element.className = 'equation-img-maxia'
                        });
                        output = outputElement.innerHTML;
                    }

                    // Good tags keeper
                    let parser = new DOMParser();
                    const doc = parser.parseFromString(output, 'text/html');
                    let bodies = doc.getElementsByTagName('body');
                    let body = bodies[bodies.length - 1];
                    recursivelyCleanOutBadTags(body);

                    // Elements swapper
                    swapElements(body, 'h1', 'h2');
                    swapElements(body, 'h3', 'h4');
                    swapElements(body, 'h4', 'p');
                    swapElements(body, 'h5', 'h6');
                    swapElements(body, 'label', 'p');
                    swapElements(body, 'font', 'span');
                    swapElements(body, 'a', 'span');
                    swapElements(body, 'table', 'tr');

                    return body.innerHTML;
                }
            }
        });
    }));