$(document).ready(function() {
  var clipboard = new Clipboard('.item_td');

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


// Edit row
function editItemTableRow(e) {
  var row = e.closest( "tr" );
  var values = [];

  $(row).find('td').each (function(column, td) {
    var text = $(td).html();
    values.push(text);
  });

  var modal = '<div class="modal fade show" id="modal-default" tabindex="-1" style="display: block;"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title pull-left">' + values[0] + '</h5></div><div class="modal-body"><div class="col-sm-6" style="display: inline-block;"><div class="form-group"><label>Buy price</label><input class="form-control" id="form-buy-price" placeholder="' + values[2] + '" type="text"><i class="form-group__bar"></i></div></div><div class="col-sm-6" style="display: inline-block;"><div class="form-group"><label>Sell price</label><input class="form-control" id="form-sell-price" placeholder="' + values[3] + '" type="text"><i class="form-group__bar"></i></div></div></div><div class="modal-footer"><button type="button" class="btn btn-link" onclick="modalSave()">Save changes</button><button type="button" class="btn btn-link" onclick="modalClose()">Close</button></div></div></div></div>';

  $('body').append(modal);
}
// /Edit row




function modalSave(){
  var item_name = $('.modal-title').html();
  var item_buy_price = $('#form-buy-price').val();
  var item_sell_price = $('#form-sell-price').val();

  $.ajax({
    url: '/ajax/update_item/',
    data: {
      'item_name': item_name,
      'item_buy_price': item_buy_price,
      'item_sell_price': item_sell_price
    },
    dataType: 'json',
    success: function (data) {

      // Get rid off modal
      $('.modal').remove();

      //Show success message
      swal({
          title: 'Item saved!',
          text: item_name + ' was successfully saved!',
          type: 'success', // 'success', 'info', 'warning', 'question'
          buttonsStyling: false,
          confirmButtonClass: 'btn btn-sm btn-light',
          background: 'rgba(0, 0, 0, 0.96)'
      })

    }
  });

  // // Get rid off modal
  // $('.modal').remove();

  // //Show success message
  // swal({
  //     title: 'Item saved!',
  //     text: item_name + ' was successfully saved!',
  //     type: 'success', // 'success', 'info', 'warning', 'question'
  //     buttonsStyling: false,
  //     confirmButtonClass: 'btn btn-sm btn-light',
  //     background: 'rgba(0, 0, 0, 0.96)'
  // })
}


function modalClose(){
  $('.modal').remove();
}
