const EVENT_BAR_ANIMIN_COMPLETE = 'barsAnimatedIn';
const EVENT_BAR_ANIMOUT_COMPLETE = 'barsAnimatedOut';
const SAYHI_TIMEOUT = 3000;
const TEMPLATE_URL = 'templates/';
const CHEAT_MODE = false;

function animateBarsIn() {
  $('.red_bar.right,.red_bar.left').animate({
    height:'100%'
  }, 300);
  $.when($('.red_bar.bottom,.red_bar.top').animate({
    width:'100%'
  }, 300)).then(function() {
    pulse();
    $('.shitpage .divider:nth-child(1)').addClass('fade_to_blue');
    setTimeout(function() {
      $('.shitpage .divider:nth-child(2)').addClass('fade_to_light_blue');
    }, 500);
    setTimeout(function() {
      $('.shitpage .divider:nth-child(3)').addClass('fade_to_dark_blue');
    }, 1000);
    setTimeout(function() {
      $('.shitpage .divider:nth-child(4)').addClass('fade_to_blue');
      setTimeout(function() {
        $('.red_bar.right,.red_bar.left').animate({
          height:'0%'
        }, 300);
        $.when($('.red_bar.bottom,.red_bar.top').animate({
          width:'0%'
        }, 300)).then(function() {
          $(window).trigger(EVENT_BAR_ANIMIN_COMPLETE);
        });
      }, 500);
    }, 1500);
  });
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
  switch(parseInt(number)) {
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
    $('.expandable .details_holder').html(template);
   // $('.project').hide();

    $('.project').fadeTo('fast', 1, function() {
      $(window).trigger('resize');
    });
  });
}

function setupRealPage() {
  $('.slider').css('padding-top', $('.slider > a > img')[0].height);
  $('.slider label').fadeIn('fast');
  $('.expandable header i').hide();

  $('.slider > a').each(function(index, item) {
    $(item).click(function(event) {
      event.preventDefault();
      loadProjectSection($(this).attr('data-slide'));
      
    });
  });
  $('.slider > label').each(function(index, item) {
    $(item).click(function(event) {
      loadProjectSection($(this).attr('data-slide'));
      
    });
  });
  loadProjectSection(1);
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
  setTimeout(function() {
    $('.downarrow').fadeIn(300);
  }, 500);
  $('main > article .downarrow').click(function(event) {
    $(this).remove();
    $('body').scrollTop($('main > section').eq(0).offset().top);
  });
  /*
  $('main > section .downarrow').click(function(event) {
    $('body').scrollTop($('main > section').eq(1).offset().top);
  });*/
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
    //$(div).css('left', 'calc(50% - ' + $(div).width()/2 + 'px');
    $(div).css('top', 'calc(50% - ' + $(div).height()/2 + 'px');
    $('.contact_bg').css('height', $(document).height());
    $('.contact_bg').css('width', $(document).width());
    $(div).fadeTo(300, 1);
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

});

$(document).ready(function(event) {
  console.log('Why are you looking at my code?');

  $(window).on(EVENT_BAR_ANIMIN_COMPLETE, function() {
    setTimeout(function() {
      $('.shitpage').fadeOut(300, function() {
        $('.shitpage').remove();
        setTimeout(function() {
          sayHi();
          setTimeout(function() {
            $('main > article').css('min-height', $(window).height());
            $('main > section').css('min-height', $(window).height());
            $('main > section').fadeIn(300);
            $('main > article .bio').fadeIn('fast', function() {
              $('main > section .mask').eq(0).fadeIn('fast', function() {
                $('main > section .mask').eq(1).fadeIn('fast');
                setupRealPage();
              });
            });
          }, 4000);
        }, 500);
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