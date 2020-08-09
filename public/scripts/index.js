$(function(){
    'use strict';

    var socket = io('/games');
    var availableGames = $('#availableGames');

    socket.on('gameSaved', function(game){
        availableGames.append(
            '<li id="' + game + '"><a href="/games/' + game + '">' +
            game + '</a></li>');
    });

    socket.on('gameRemoved', function(game) {
        $('#' + game).remove();
    });

    $('#createdGames').on('click', '.delete', function(event){
        event.preventDefault();
        var $this = $(this);
        $.ajax($this.attr("href"), {
            method: "DELETE",
        }).done(function(){
            $this.closest('.game').remove();
        });
        event.preventDefault();   
    });

    $('#createGame').submit(function(event){
        event.preventDefault();
        $.post($(this).attr('action'), {
            word: $('#word').val()
        }).done(function(result){
            $('#createdGames').append(result);
        });
    });
});