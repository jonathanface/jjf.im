const EVENT_BAR_ANIMIN_COMPLETE = 'barsAnimatedIn';
const EVENT_BAR_ANIMOUT_COMPLETE = 'barsAnimatedOut';
const SAYHI_TIMEOUT = 3000;
const TEMPLATE_URL = 'templates/';
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
    $('main > article').append('<div class="pulser"></div>');
    
  });
}

function sayHi() {
  var div = $('<div class="hi">Kidding.</div>');
  $('main > article').prepend(div);
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

function loadProjectSection(number) {
  var url = TEMPLATE_URL;
  switch(number) {
    case 1:
      url += 'clinicianportal.html';
      break;
    case 2:
      url += 'questlog.html';
      break;
    case 3:
      url += 'fish.html';
      break;
    case 4:
      url += 'socknit.html';
      break;
    case 5:
      url += 'dictumhealth.html';
      break;
  }
  $.get(url, function(template) {
    template = $(template);
    $('.expandable article').append(template);
   // $('.project').hide();
    if (number == 1) {
      var carousel = $(".carousel"),
      currdeg  = 0;

      $(".project .controls .next").on("click", { d: "n" }, rotate);
      $(".project .controls .prev").on("click", { d: "p" }, rotate);

      function rotate(e){
        if(e.data.d=="n"){
          currdeg = currdeg - 60;
        }
        if(e.data.d=="p"){
          currdeg = currdeg + 60;
        }
        carousel.css({
          "-webkit-transform": "rotateY("+currdeg+"deg)",
          "-moz-transform": "rotateY("+currdeg+"deg)",
          "-o-transform": "rotateY("+currdeg+"deg)",
          "transform": "rotateY("+currdeg+"deg)"
        });
      }
    }
    
    $('.project').fadeTo('fast', 1, function() {
      $(window).trigger('resize');
    });
  });
}

function setupRealPage() {
  $('.slider').css('padding-top', $('.slider > img')[0].height);
  $('.slider label').fadeIn('fast');
  $('.expandable header i').hide();

  $('.slider > img').each(function(index, item) {
    $(item).click(function(event) {
      event.preventDefault();
      $('.slider').fadeOut('fast', function() {
        //car.destroy();
      });
      if ($('.expandable').attr('data-expanded') == 'false') {
        $('main > article').animate({
          width:0
        }, 300);
        $('.expandable').parent().animate({
          width:'100%'
        }, 300, function() {
          $('.hi').remove();
        });
        $('.expandable').parent().children('section').eq(1).animate({
          height:0
        }, 300, function() {
          $(this).hide();
        });
        $('.expandable').animate({
          height:'100%'
        }, 300, function() {
          $('.expandable header h3').html('<i class="fa fa-undo fa-lg"></i>Return');
          $('.expandable header h3').off('click').click(function(event) {
            event.preventDefault();
            if ($('.expandable').attr('data-expanded') == 'true') {
              $('.expandable header i').fadeOut('fast');
              $('.expandable header h3').text('Click a project for details');
              dissolve($('.project')[0], true);
              $('.expandable').parent().children('section').show();
              $('.expandable').parent().children('section').eq(1).animate({
                height:'37.5%'
              }, 300);
              $('.expandable').animate({
                height:'62.5%'
              }, 300);
              $('.expandable').parent().animate({
                width:'37.5%'
              }, 300, function() {
                $('main > article').animate({
                  width:'62.5%'
                }, 300, function() {
                  $('.slider > label').hide();
                  $('.slider').fadeIn('fast', function() {
                    $('.slider').css('padding-top', $('.slider > img')[0].height);
                    $('.slider > label').fadeIn('fast');
                  });
                  
                });
              });
              $('.expandable').attr('data-expanded', false);
            }
          });
          loadProjectSection(parseInt($(item).attr('data-slide')));
        });
        $('.expandable').attr('data-expanded', true);
      }
      
    });
  });
  $('.menu_tree > div').click(function() {
    var clicked = this;
    $('.menu_tree > div').each(function(index, item) {
      if ($(item).attr('data-isopen') == 'true' && item != clicked) {
        $(item).attr('data-isopen', false);
        $(item).trigger('click');
      }
    });
    if ($(this).find('.fa').hasClass('fa-angle-right')) {
      $(this).attr('data-isopen', true);
      $(this).find('.fa').removeClass('fa-angle-right');
      $(this).find('.fa').addClass('fa-angle-down');
      $(this).next('ul li').find('div').hide();
      $(this).next('ul').fadeIn('fast', function() {
        hoverCode(this);
      });
    } else {
      $(this).attr('data-isopen', false);
      $(this).find('.fa').removeClass('fa-angle-down');
      $(this).find('.fa').addClass('fa-angle-right');
      $(this).next('ul').hide();
    }
  });
  
  $('#contacter').click(function(event) {
    event.preventDefault();
    event.stopPropagation();
    renderContactForm();
  });
}

function removeContactForm() {
  dissolve($('.contact'), true);
  dissolve($('.contact_bg'), true);
}

function successContactMessage() {
  $('.contact').find('form').remove();
  $('.contact > section').text('Thanks for the message.');
  setTimeout(removeContactForm, 3000);
}

function sendMail() {
  if ($.trim($('.contact').find('textarea').val()).length && $.trim($('.contact').find('input[type="email"]').val()).length) {
    if ($.trim($('.contact').find('textarea').val()) != 'Your message' && $.trim($('.contact').find('input[type="email"]').val()) != 'Your email address') {
      var data = {email: $.trim($('.contact').find('input[type="email"]').val()), message: $.trim($('.contact').find('textarea').val())};
      $.ajax({
        type: 'POST',
        url: 'php/send_email.php',
        data: data,
        success: function() {
          successContactMessage();
        },
        error: function() {
          successContactMessage();
        }
      });
    }
  }
}

function renderContactForm() {
  var bg = $('<div class="contact_bg"></div>');
  $(document.body).append(bg);
  $(bg).click(function() {
    removeContactForm();
  });
  $(bg).fadeTo('fast', 0.8, function() {
    var div = $('<div class="contact"></div>');
    $(div).append('<header><i class="fa fa-2x fa-times-circle-o"></i></header>');
    var content = $('<section></section>');
    $(content).append('<p><h3>Drop me a line.</h3></p>');
    var form = $('<form method="post" action="php/sendmail.php"></form>');
    $(form).append('<p><input type="email" value="Your email address"></p>');
    $(form).find('input[type="email"]').focusin(function() {
      if ($.trim($(this).val()) == 'Your email address') {
        $(this).val('');
        $(this).css('color', '#000');
      }
    });
    $(form).find('input[type="email"]').focusout(function() {
      if ($.trim($(this).val()) == '') {
        $(this).val('Your email address');
        $(this).css('color', 'gray');
      }
    });
    $(form).append('<p><textarea>Your message</textarea></p>');
    $(form).find('textarea').focusin(function() {
      if ($.trim($(this).val()) == 'Your message') {
        $(this).val('');
        $(this).css('color', '#000');
      }
    });
    $(form).find('textarea').focusout(function() {
      if ($.trim($(this).val()) == '') {
        $(this).val('Your message');
        $(this).css('color', 'gray');
      }
    });
    
    $(form).append('<p style="text-align:right;"><input type="submit" value="send"></p>');
    $(content).append(form);
    $(div).append(content);
    $(form).on('submit', function(event) {
      event.preventDefault();
      event.stopPropagation();
      sendMail();
    });
    $(div).find('header i').click(function() {
      removeContactForm();
    });
    $(document.body).append(div);
    $(div).fadeIn('fast');
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

$(window).resize(function() {
  if ($('.expandable').attr('data-expanded') == 'true') {
    $('.expandable').css('height', document.body.scrollHeight);
  }
  $('.slider').css('padding-top', $('.slider > img')[0].height);
});

$(document).ready(function(event) {
  console.log('Why are you looking at my code?');
  
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
    window.location = 'https://jjf.im/mobile';
    return;
  }
  $('.shitpage').show();

  $(window).on(EVENT_BAR_ANIMIN_COMPLETE, function() {
    setTimeout(function() {
      $('aside section:nth-child(1)').addClass('fade_to_light_blue');
      
      $('.bar_right_bottom').slideToggle(1500, function() {
        pulse();
        setTimeout(function() {
          $('aside section:nth-child(2)').addClass('fade_to_dark_blue');
          
        }, 500);
        setTimeout(function() {
          $('main > article').addClass('fade_to_blue');
          
          setTimeout(function() {
            $('.shitpage').remove();
            sayHi();
            setTimeout(function() {
              $('main > article .bio').fadeIn('fast', function() {
                $('aside section .mask').eq(0).fadeIn('fast', function() {
                  $('aside section .mask').eq(1).fadeIn('fast');
                  setupRealPage();
                });
              });
              
            }, 4000);
            
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
    materialize($('aside section:nth-child(1)').find('article'));
    materialize($('aside section:nth-child(2)').find('article'));
    $('main > article .bio').fadeIn('fast');
    $('main > article').addClass('fade_to_blue');
    setupRealPage();
  } else {
    setTimeout(function() {
      animateBarsIn();
    }, 3000);
  }
});