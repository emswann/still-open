var yo = 'hi'

function processError (error) {
    $('#err-modal-body').empty();
    
    console.log(error);

    var line = $('<h3>').text(error)

    $('#err-modal-body').append(line);
}

processError(yo)