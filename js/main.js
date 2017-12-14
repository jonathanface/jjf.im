const EVENT_BAR_ANIMIN_COMPLETE = 'barsAnimatedIn';
const EVENT_BAR_ANIMOUT_COMPLETE = 'barsAnimatedOut';
const SAYHI_TIMEOUT = 3000;
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
  $('main > content').prepend(div);
  $(div).fadeTo('fast',0.8, function() {
    setTimeout(function() {
      dissolve(div, true);
    }, SAYHI_TIMEOUT);
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

function hoverCode(element) {
  $(element).children('li').off('mouseenter mouseleave').hover(function() {
    $(this).children('div').slideToggle('fast');
  },
  function() {
    $(this).children('div').slideToggle('fast');
  });
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
  $('.menu_tree > div').click(function() {
    if ($(this).find('.fa').hasClass('fa-angle-right')) {
      $(this).find('.fa').removeClass('fa-angle-right');
      $(this).find('.fa').addClass('fa-angle-down');
      $(this).next('ul li').find('div').hide();
      $(this).next('ul').fadeIn('fast', function() {
        hoverCode(this);
      });
    } else {
      $(this).find('.fa').removeClass('fa-angle-down');
      $(this).find('.fa').addClass('fa-angle-right');
      $(this).next('ul').fadeOut('fast');;
    }
  });
}

function dissolve(element, remove) {
  $(element).addClass('dissolve');
  if (remove) {
    setTimeout(function() {
      $(element).remove();
    }, 500);
  }
}

function materialize(element) {
  $(element).addClass('fadeIn');
}

$(document).ready(function(event) {
  $('main > content .bio').hide();
  $(window).on(EVENT_BAR_ANIMIN_COMPLETE, function() {
    setTimeout(function() {
      $('aside section:nth-child(1)').addClass('fade_to_light_blue');
      materialize($('aside section:nth-child(1)').find('content'));
      $('.bar_right_bottom').slideToggle(1500, function() {
        pulse();
        setTimeout(function() {
          $('aside section:nth-child(2)').addClass('fade_to_dark_blue');
          materialize($('aside section:nth-child(2)').find('content'));
        }, 500);
        setTimeout(function() {
          $('main > content').addClass('fade_to_blue');
          setTimeout(function() {
            $('.shitpage').remove();
            sayHi();
            setTimeout(function() {
              $('main > content .bio').fadeIn('fast');
            }, 4000);
            setupRealPage();
          }, 3000);
        }, 500);
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
    materialize($('aside section:nth-child(1)').find('content'));
    materialize($('aside section:nth-child(2)').find('content'));
    $('main > content .bio').fadeIn('fast');
    $('main > content').addClass('fade_to_blue');
    sayHi();
    setupRealPage();
  } else {
    setTimeout(function() {
      animateBarsIn();
    }, 3000);
  }
});