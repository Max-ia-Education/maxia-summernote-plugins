$(document).ready(function () {
  var FontStyleButton = function (context) {
    var ui = $.summernote.ui;
    var options = $.summernote.options;

    const bold = ui.button({
      className: 'note-btn-bold',
      contents: ui.icon(options.icons.bold),
      click: context.createInvokeHandlerAndUpdateState('editor.bold')
    })
    const italic = ui.button({
      className: 'note-btn-italic',
      contents: ui.icon(options.icons.italic),
      click: context.createInvokeHandlerAndUpdateState('editor.italic')
    })
    const underline = ui.button({
      className: 'note-btn-underline',
      contents: ui.icon(options.icons.underline),
      click: context.createInvokeHandlerAndUpdateState('editor.underline')
    })
    const clear = ui.button({
      contents: ui.icon(options.icons.eraser),
      click: context.createInvokeHandler('editor.removeFormat')
    })

    const superscript = ui.button({
      className: 'note-btn-superscript',
      contents: ui.icon(options.icons.superscript),
      click: context.createInvokeHandlerAndUpdateState('editor.superscript')
    })

    const subscript = ui.button({
      className: 'note-btn-subscript',
      contents: ui.icon(options.icons.subscript),
      click: context.createInvokeHandlerAndUpdateState('editor.subscript')
    });

    // create button
    let button = ui.buttonGroup([
      ui.button({
        className: 'dropdown-toggle',
        contents: ui.dropdownButtonContents(ui.icon(options.icons.font), options),
        tooltip: 'Estilo do texto',
        data: {
          toggle: 'dropdown'
        }
      }),
      ui.dropdown([ui.buttonGroup({
        className: 'note-align',
        children: [bold, italic, underline, superscript, subscript, clear]
      })])
    ])

    return button.render();   // return button as jquery object
  }

  $("#summernote").summernote({
    //essa parte é a api que renderiza a barra do summernote
    toolbar: [
      ['style', ['style']],
      ['font', ['fontStyle']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['picture', 'math']],
      ["misc", ["codeview"]]
    ],
    styleTags: [
      { title: 'Título', tag: 'h2' },
      { title: 'Texto', tag: 'p' },
      { title: 'Legenda', tag: 'h6' }
    ],

    buttons: {
      fontStyle: FontStyleButton
    },
    icons: {
      magic: 'note-icon-pencil'
    }
  })
})