'use strict'
class Game
  constructor: (@gridDOMElement = $('#gameboard'),lives=50, newGameDOMElement =$('#newGame'), hitDOMElement =  $('#hit'), liveDOMElement = $('#lives'), @historyDOMElement=$('.history'), @popSound=document.getElementById('popSound'), @bangSound=document.getElementById('bangSound')) ->
    _me = this;
    moles = [];
    holes=[];
    @hits = 0;
    @misses = lives;
    @gameTimer = false;
    @gridDOMElement.children().each((index)->
      oneMole =new Mole this
      moles.push(oneMole);
      holes.push(this);
      $(this).on('click tap', (e)->
        if oneMole.isPopped() 
          _me.bangSound.load();
          _me.bangSound.play();
          _me.hits = _me.hits + oneMole.unpopMole(false)
          hitDOMElement.html(_me.hits)
        )
    );
    @moles = moles;
    newGameDOMElement.click((e)->
      e.preventDefault()
      if _me.gameTimer is false
        _me.hits=0;
        _me.misses= lives;
        _me.gameTimer = _me.render();
     
    )
    $(document).on('missed', (e)->
       _me.misses-- if _me.misses > 0
       liveDOMElement.html(_me.misses)
       _me.popSound.load();
       _me.popSound.play();
       return _me.endGame() if _me.misses == 0  &&  _me.gameTimer != false
      )
    @liveDOMElement =liveDOMElement;
    @hitDOMElement  =hitDOMElement;
    # @gridDOMElement.on('mousedown tap', (e)->
        # clickedMole =moles[holes.indexOf(e.toElement)];
        # if !!clickedMole && clickedMole.isPopped() 
          # _me.bangSound.load();
          # _me.bangSound.play();
          # _me.hits = _me.hits + clickedMole.unpopMole(false)
          # hitDOMElement.html(_me.hits)
        # )
  endGame: ()->
    clearInterval(@gameTimer);
    @gameTimer = false;
    for mole, key in @moles
       clearTimeout(mole.unpopEvent);
       mole.unpopMole(false);
    alert('Game Over!')
    
    @historyDOMElement.show().append('<li>'+@hits+'</li>');       
  render: (delay = 3000) ->
    @hitDOMElement.html(@hits)
    @liveDOMElement.html(@misses)
    moles = @moles;
    _me= this;
    popRandom= ()->
       for mole, key in moles
         mole.popMole((Math.random() * 1 * (delay - _me.hits * 2) )+ 300) if mole.isPopped() is false && Math.floor(Math.random()*10) < 4
    popRandom();
    setInterval(()->
      popRandom()
     delay);
class Mole
  constructor: (moleDOMElement) ->
    _popped=false;
    @unpopEvent=false;
    @isPopped = ()->  _popped;
    popMole = (speed)-> 
      _popped=true;
      $(moleDOMElement).addClass('popped');
      _popped;
      @unpopEvent = window.setTimeout(
        ()->
         unpopMole(true)
        , speed);
    unpopMole = (missed = true)-> 
      _popped=false;
      $(moleDOMElement).removeClass('popped');
      if missed==false
        $(moleDOMElement).addClass('popped-hit');
        window.setTimeout(()->
         $(moleDOMElement).removeClass('popped-hit');
        , 100);
        clearTimeout(@unpopEvent);
        return 1
      else
        $(document).trigger('missed');
        return 0
    @popMole = popMole;
    @unpopMole = unpopMole;

#create new game
(($) ->
  new Game $('#gameboard');
)(Zepto)


