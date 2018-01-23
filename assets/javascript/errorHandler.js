function processError(error) {
    $('#err-modal-body').empty();
    $('#info-modal').modal("hide");
    $('#addr-modal').modal("hide");
    $('#err-modal').modal("show");

    console.log(error);

    var errModalLine = $('<h3>').text(error);

    $('#err-modal-body').append(errModalLine);
};