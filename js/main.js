// Generated by CoffeeScript 1.6.3
(function() {
  'use strict';
  var Game, Mole;

  Game = (function() {
    function Game(gridDOMElement, lives, newGameDOMElement, hitDOMElement, liveDOMElement, historyDOMElement, popSound, bangSound) {
      var holes, moles, _me;
      this.gridDOMElement = gridDOMElement != null ? gridDOMElement : $('#gameboard');
      if (lives == null) {
        lives = 50;
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
      this.popSound = popSound != null ? popSound : document.getElementById('popSound');
      this.bangSound = bangSound != null ? bangSound : document.getElementById('bangSound');
      _me = this;
      moles = [];
      holes = [];
      this.hits = 0;
      this.misses = lives;
      this.gameTimer = false;
      this.gridDOMElement.children().each(function(index) {
        var oneMole;
        oneMole = new Mole(this);
        moles.push(oneMole);
        holes.push(this);
        return $(this).on('click tap', function(e) {
          if (oneMole.isPopped()) {
            _me.bangSound.load();
            _me.bangSound.play();
            _me.hits = _me.hits + oneMole.unpopMole(false);
            return hitDOMElement.html(_me.hits);
          }
        });
      });
      this.moles = moles;
      newGameDOMElement.click(function(e) {
        e.preventDefault();
        if (_me.gameTimer === false) {
          _me.hits = 0;
          _me.misses = lives;
          return _me.gameTimer = _me.render();
        }
      });
      $(document).on('missed', function(e) {
        if (_me.misses > 0) {
          _me.misses--;
        }
        liveDOMElement.html(_me.misses);
        _me.popSound.load();
        _me.popSound.play();
        if (_me.misses === 0 && _me.gameTimer !== false) {
          return _me.endGame();
        }
      });
      this.liveDOMElement = liveDOMElement;
      this.hitDOMElement = hitDOMElement;
    }

    Game.prototype.endGame = function() {
      var key, mole, _i, _len, _ref;
      clearInterval(this.gameTimer);
      this.gameTimer = false;
      _ref = this.moles;
      for (key = _i = 0, _len = _ref.length; _i < _len; key = ++_i) {
        mole = _ref[key];
        clearTimeout(mole.unpopEvent);
        mole.unpopMole(false);
      }
      alert('Game Over!');
      return this.historyDOMElement.show().append('<li>' + this.hits + '</li>');
    };

    Game.prototype.render = function(delay) {
      var moles, popRandom, _me;
      if (delay == null) {
        delay = 3000;
      }
      this.hitDOMElement.html(this.hits);
      this.liveDOMElement.html(this.misses);
      moles = this.moles;
      _me = this;
      popRandom = function() {
        var key, mole, _i, _len, _results;
        _results = [];
        for (key = _i = 0, _len = moles.length; _i < _len; key = ++_i) {
          mole = moles[key];
          if (mole.isPopped() === false && Math.floor(Math.random() * 10) < 4) {
            _results.push(mole.popMole((Math.random() * 1 * (delay - _me.hits * 2)) + 300));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      };
      popRandom();
      return setInterval(function() {
        return popRandom();
      }, delay);
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
        return this.unpopEvent = window.setTimeout(function() {
          return unpopMole(true);
        }, speed);
      };
      unpopMole = function(missed) {
        if (missed == null) {
          missed = true;
        }
        _popped = false;
        $(moleDOMElement).removeClass('popped');
        if (missed === false) {
          $(moleDOMElement).addClass('popped-hit');
          window.setTimeout(function() {
            return $(moleDOMElement).removeClass('popped-hit');
          }, 100);
          clearTimeout(this.unpopEvent);
          return 1;
        } else {
          $(document).trigger('missed');
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

}).call(this);
