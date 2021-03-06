// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  var Game, Mole;

  Game = (function() {
    function Game(gridDOMElement, lives, newGameDOMElement, hitDOMElement, liveDOMElement, historyDOMElement) {
      var holes, moles, _me;
      this.gridDOMElement = gridDOMElement != null ? gridDOMElement : $('#gameboard');
      if (lives == null) {
        lives = 40;
      }
      if (newGameDOMElement == null) {
        newGameDOMElement = $('#newGame');
      }
      if (hitDOMElement == null) {
        hitDOMElement = $('#hit');
      }
      if (liveDOMElement == null) {
        liveDOMElement = $('#lives');
      }
      this.historyDOMElement = historyDOMElement != null ? historyDOMElement : $('.history');
      _me = this;
      moles = [];
      holes = [];
      this.hits = 0;
      this.misses = lives;
      this.gameTimer = false;
      this.gameTimers = [];
      this.gridDOMElement.children().each(function(index) {
        var oneMole;
        oneMole = new Mole(this);
        moles.push(oneMole);
        return holes.push(this);
      });
      this.moles = moles;
      this.liveDOMElement = liveDOMElement;
      this.hitDOMElement = hitDOMElement;
      this.bangSound = new Audio('./files/bang.mp3');
      this.popSound = new Audio('./files/pop.mp3');
      newGameDOMElement.click(function(e) {
        e.preventDefault();
        if (_me.gameTimer === false) {
          _me.hits = 0;
          _me.misses = lives;
          return _me.render();
        }
      });
      $(document).on('missed', function(e) {
        if (_me.misses > 0) {
          _me.misses--;
        }
        liveDOMElement.html(_me.misses);
        _me.popSound.load();
        _me.popSound.play();
        if (Number(_me.misses) <= 0) {
          return _me.endGame();
        }
      });
      this.gridDOMElement.on('mousedown touchstart', function(e) {
        var clickedMole;
        e.preventDefault();
        e.stopPropagation();
        clickedMole = moles[holes.indexOf(e.target)];
        if (!!clickedMole && clickedMole.isPopped()) {
          _me.bangSound.play();
          _me.hits = _me.hits + clickedMole.unpopMole(false);
          return hitDOMElement.html(_me.hits);
        }
      });
    }

    Game.prototype.endGame = function() {
      if (this.gameTimer == false) {
        return;
      }
      var key, mole, _i, _len, _ref;
      clearTimeout(this.gameTimer);
      this.gameTimer = false;
      alert('Game Over!');
      return this.historyDOMElement.show().append('<li>' + this.hits + '</li>');
    };

    Game.prototype.render = function(delay) {
      var invervalTimer, popRandom, _me;
      if (delay == null) {
        delay = 3000;
      }
      this.hitDOMElement.html(this.hits);
      this.liveDOMElement.html(this.misses);
      _me = this;
      popRandom = function() {
        var key, mole, _i, _len, _ref, _results;
        _ref = _me.moles;
        _results = [];
        for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
          mole = _ref[key];
          if (mole.isPopped() === false && Math.floor(Math.random() * 10) < 4) {
            _results.push(mole.popMole(Math.random() * 1 * (delay - _me.hits * 2) + 300));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      popRandom();
      invervalTimer = function() {
        delay = 3000 - _me.hits * 20;
        popRandom();
        return (_me.gameTimer = setTimeout(invervalTimer, delay - _me.hits * 20));
      };
      return (_me.gameTimer = setTimeout(invervalTimer, delay));
    };

    return Game;
  })();

  Mole = (function() {
    function Mole(moleDOMElement) {
      var popMole, unpopMole, _popped;
      _popped = false;
      this.unpopEvent = false;
      this.isPopped = function() {
        return _popped;
      };
      popMole = function(speed) {
        _popped = true;
        $(moleDOMElement).addClass('popped');
        _popped;
        return (this.unpopEvent = setTimeout(function() {
          return unpopMole(true);
        }, speed));
      };
      unpopMole = function(missed) {
        if (missed == null) {
          missed = true;
        }
        _popped = false;
        $(moleDOMElement).removeClass('popped');
        if (missed === false) {
          $(moleDOMElement).addClass('popped-hit');
          setTimeout(function() {
            return $(moleDOMElement).removeClass('popped-hit');
          }, 200);
          clearTimeout(this.unpopEvent);
          return 1;
        } else {
          $(document).trigger('missed');
          $(moleDOMElement).addClass('popped-missed');
          setTimeout(function() {
            return $(moleDOMElement).removeClass('popped-missed');
          }, 200);
          return 0;
        }
      };
      this.popMole = popMole;
      this.unpopMole = unpopMole;
    }

    return Mole;
  })();

  (function($) {
    return new Game($('#gameboard'));
  })(Zepto);
}.call(this));
