const EVENT_BAR_ANIMIN_COMPLETE = 'barsAnimatedIn';
const EVENT_BAR_ANIMOUT_COMPLETE = 'barsAnimatedOut';
const CHEAT_MODE = false;

function animateBarsIn() {
  $('.bar_right_top').slideToggle(1000);
  /**/
  setTimeout(function() {
    $('.bar_bottom').animate({
      width: '100%'
    }, 500, function() {
      pulse();
    $(window).trigger(EVENT_BAR_ANIMIN_COMPLETE);
    });
  }, 500);
}

function pulse() {
  $('.pulser').show();
  $('.pulser').animate({
    width:'40px',
    height:'40px',
    left: '-=10px',
    top: '-=10px',
    opacity:0
  }, 300, function() {
    $('.pulser').remove();
    $('main > content').append('<div class="pulser"></div>');
    
  });
}

function sayHi() {
  var div = $('<div class="hi">Kidding.</div>');
  $('main > content').append(div);
  $(div).fadeTo('fast',0.8, function() {
    setTimeout(function() {
      $(div).fadeOut('fast', function() {
        $(div).remove();
      });
    }, 6000);
  });
}

function animateBarsOut() {
  var w = $('section .bar_bottom').width();
  $('section .bar_bottom').animate({
    width: 0,
    left: w
  }, 1000);
  setTimeout(function() {
    $('.bar_right_top').slideToggle(500, function() {
      
    });
  }, 500);
  setTimeout(function() {
    $('.bar_right_bottom').slideToggle(500, function() {
      $(window).trigger(EVENT_BAR_ANIMOUT_COMPLETE);
    });
  }, 1000);
}

function setupRealPage() {
  $('.expandable').click(function() {
    if ($(this).attr('data-expanded') == 'false') {
      $(this).removeClass('has-hover');
      $('main > content').animate({
        width:0
      }, 300);
      $(this).parent().animate({
        width:'100%'
      }, 300, function() {
        $('.hi').remove();
      });

      $(this).parent().children('section').eq(1).animate({
        height:0
      }, 300);
      $(this).animate({
        height:'100%'
      }, 300);
      $(this).attr('data-expanded', true);
    } else {
       $(this).addClass('has-hover');
      $(this).parent().children('section').eq(1).animate({
        height:'37.5%'
      }, 300);
      $(this).animate({
        height:'62.5%'
      }, 300);
      $(this).parent().animate({
        width:'37.5%'
      }, '300', function() {
      $('main > content').animate({
        width:'62.5%'
      }, 300);
      });
      
      $(this).attr('data-expanded', false);
    }
  });
}

$(document).ready(function(event) {
  $(window).on(EVENT_BAR_ANIMIN_COMPLETE, function() {
    setTimeout(function() {
      $('aside section:nth-child(1)').addClass('fade_to_light_blue');
      $('.bar_right_bottom').slideToggle(1500, function() {
        pulse();
        setTimeout(function() {
          $('aside section:nth-child(2)').addClass('fade_to_dark_blue');
        }, 500);
        setTimeout(function() {
          setTimeout(function() {
            $('main > content').css('z-index', 100);
          }, 100);
          $('main > content').addClass('fade_to_blue');
          setTimeout(function() {
            $('.shitpage').remove();
            sayHi();
            setupRealPage();
          }, 3000);
        }, 1000);
        setTimeout(animateBarsOut, 1500);
      });
    }, 500);
  });
  $(window).on(EVENT_BAR_ANIMOUT_COMPLETE, function() {
    
  });
  
  if (CHEAT_MODE) {
    $('.shitpage').remove();
    $('aside section:nth-child(1)').addClass('fade_to_light_blue');
    $('aside section:nth-child(2)').addClass('fade_to_dark_blue');
    $('main > content').addClass('fade_to_blue');
    sayHi();
    setupRealPage();
  } else {
    setTimeout(function() {
      animateBarsIn();
    }, 3000);
  }
});