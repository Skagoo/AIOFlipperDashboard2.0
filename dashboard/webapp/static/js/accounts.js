$(document).ready(function() {
  var clipboard = new Clipboard('.dropdown-item');

  clipboard.on('success', function(e) {
      console.info('Action:', e.action);
      console.info('Text:', e.text);
      console.info('Trigger:', e.trigger);

      $.notify({
          message: 'Coppied \'' + e.text + '\' to clipboard!'
      },
      {
          type: 'inverse', // 'inverse', 'info', 'success', or 'danger'
          placement: {
              from: 'top', // 'top' or 'bottom'
              align: 'right' // 'left', 'center' or 'right',
          },
          allow_dismiss: true,
          template:   '<div data-notify="container" class="alert alert-dismissible alert-{0} alert--notify" role="alert">' +
                          '<span data-notify="icon"></span> ' +
                          '<span data-notify="title">{1}</span> ' +
                          '<span data-notify="message">{2}</span>' +
                          '<div class="progress" data-notify="progressbar">' +
                              '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                          '</div>' +
                          '<a href="{3}" target="{4}" data-notify="url"></a>' +
                          '<button type="button" aria-hidden="true" data-notify="dismiss" class="close"><span>×</span></button>' +
                      '</div>'
      });

      e.clearSelection();
  });

  clipboard.on('error', function(e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
  });
});
