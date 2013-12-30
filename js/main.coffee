'use strict'
#made with coffee because i wanted to keep practicing it
class Game
  constructor: (@gridDOMElement = $('#gameboard'),lives=40, newGameDOMElement =$('#newGame'), hitDOMElement =  $('#hit'), liveDOMElement = $('#lives'), @historyDOMElement=$('.history'), @popSound=document.getElementById('popSound'), @bangSound=document.getElementById('bangSound')) ->
    #i should read arguments here instead of haveing parameters to the constructor 
    _me = this;
    moles = [];
    holes=[];
    @hits = 0;
    @misses = lives;
    @gameTimer = false;
    @gameTimers = [];
    @gridDOMElement.children().each((index)->
      oneMole =new Mole this
      moles.push(oneMole);
      holes.push(this);
      # $(this).on('touchend', (e)->
        # e.preventDefault();
        # e.stopPropagation();
        # if oneMole.isPopped() 
          # _me.bangSound.play();
          # _me.bangSound.load();
          # _me.hits = _me.hits + oneMole.unpopMole(false)
          # hitDOMElement.html(_me.hits)
        # )
    );
    @moles = moles;
    newGameDOMElement.click((e)->
      e.preventDefault()
      if _me.gameTimer is false
        _me.hits=0;
        _me.misses= lives;
        _me.render();
    )
    $(document).on('missed', (e)->
       _me.misses-- if _me.misses > 0
       liveDOMElement.html(_me.misses)
       _me.popSound.src =  _me.popSound.src;
       _me.popSound.play();
       return _me.endGame() if _me.misses == 0  &&  _me.gameTimer != false
      )
    @liveDOMElement =liveDOMElement;
    @hitDOMElement  =hitDOMElement;
    #more effcient that binding to the elements
    @gridDOMElement.on('mousedown touchstart', (e)->
        e.preventDefault();
        e.stopPropagation();
        clickedMole =moles[holes.indexOf(e.target)];
        if !!clickedMole && clickedMole.isPopped() 
          _me.bangSound.src = _me.bangSound.src
          _me.bangSound.play();
          _me.hits = _me.hits + clickedMole.unpopMole(false)
          hitDOMElement.html(_me.hits)
        )
  endGame: ()->
    clearTimeout(@gameTimer);
    @gameTimer = false;
    for mole, key in @moles
       mole.unpopMole(true)
       clearTimeout(mole.unpopEvent);
    alert('Game Over!')
    @historyDOMElement.show().append('<li>'+@hits+'</li>');       
  render: (delay = 3000) ->
    @hitDOMElement.html(@hits)
    @liveDOMElement.html(@misses)
    _me= this;
    popRandom= ()->
       for mole, key in _me.moles
         mole.popMole((Math.random() * 1 * (delay - _me.hits * 2) )+ 300) if mole.isPopped() is false && Math.floor(Math.random()*10) < 4
    popRandom();
    #should be recrusive setimeout
    invervalTimer = ()->
      delay = 3000 - (_me.hits * 20)
      popRandom()
      _me.gameTimer = setTimeout( invervalTimer
      delay - (_me.hits * 20) )
    _me.gameTimer = setTimeout( invervalTimer
      delay)
      
class Mole
  constructor: (moleDOMElement) ->
    _popped=false;
    @unpopEvent=false;
    @isPopped = ()->  _popped;
    popMole = (speed)-> 
      _popped=true;
      $(moleDOMElement).addClass('popped');
      _popped;
      @unpopEvent = setTimeout(
        ()->
         unpopMole(true)
        , speed);
    unpopMole = (missed = true)-> 
      _popped=false;
      $(moleDOMElement).removeClass('popped');
      if missed==false
        $(moleDOMElement).addClass('popped-hit');
        setTimeout(()->
         $(moleDOMElement).removeClass('popped-hit');
        , 200);
        clearTimeout(@unpopEvent);
        return 1
      else
        $(document).trigger('missed');
        $(moleDOMElement).addClass('popped-missed');
        setTimeout(()->
         $(moleDOMElement).removeClass('popped-missed');
        , 200);
        return 0
    @popMole = popMole;
    @unpopMole = unpopMole;

#create new game
(($) ->
  new Game $('#gameboard');
)(Zepto)


