$(function(){
    var word = $("#word");
    var length = word.data('length');
    var id = word.data('id');
    //Create the placeholder for each letter
    console.log(length)
    for(var i = 0; i < length; i++){
        word.append('<span>_</span>');
    }

    var gessedLetters = [];
    var gessLetter = function(letter){
        $.post('/games/'+ id +'/gesses', {letter: letter})
         .done(function(data){
            if(data.positions.length){
                data.positions.forEach(function(position){
                    word.find('span').eq(position).text(letter);
                });
            } else {
                $("#missedLetters").append('<span>' + letter + '</span>');
            }
         });
    };

   $(document).keydown(function(event){
        // Letter keys have key codes in the range 65-90
        if(!$('.chat #message').is(':focus') && event.which >= 65 && event.which <= 90){
            var letter = String.fromCharCode(event.which);
            if(gessedLetters.indexOf(letter) === -1){
                gessedLetters.push(letter);
                gessLetter(letter);
            }
        }
   });
});