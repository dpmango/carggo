$(document).ready(function() {
  //////////
  // Global variables
  //////////

  var _window = $(window);
  var _document = $(document);

  ////////////
  // READY - triggered when PJAX DONE
  ////////////
  function pageReady() {
    legacySupport();
    updateHeaderActiveClass();
    // initHeaderScroll();

    initScrollMonitor();
    initMasks();
    initSelectric();
    initValidations();

    pagination();
    _window.on("scroll", throttle(pagination, 50));
    _window.on("resize", debounce(pagination, 250));

    initaos();

    // development helper
    _window.on("resize", debounce(setBreakpoint, 200));

  }

  // this is a master function which should have all functionality
  pageReady();

  // some plugins work best with onload triggers
  _window.on("load", function() {
    // your functions
  });

  //////////
  // COMMON
  //////////

  function initaos() {
    AOS.init();
  }

  function legacySupport() {
    // svg support for laggy browsers
    svg4everybody();

    // Viewport units buggyfill
    window.viewportUnitsBuggyfill.init({
      force: false,
      refreshDebounceWait: 150,
      appendToBody: true
    });
  }

  // Prevent # behavior
  _document
    .on("click", '[href="#"]', function(e) {
      e.preventDefault();
    })
    .on("click", 'a[href^="#section"]', function() {
      // section scroll
      var el = $(this).attr("href");
      $("body, html").animate(
        {
          scrollTop: $(el).offset().top - 100
        },
        1000
      );
      return false;
    });

  // HEADER SCROLL
  // add .header-static for .page or body
  // to disable sticky header
  // function initHeaderScroll() {
  //   _window.on(
  //     "scroll",
  //     throttle(function(e) {
  //       var vScroll = _window.scrollTop();
  //       var header = $(".header").not(".header--static");
  //       var headerHeight = header.height();
  //       var firstSection =
  //         _document.find(".page__content div:first-child()").height() -
  //         headerHeight;
  //       var visibleWhen =
  //         Math.round(_document.height() / _window.height()) > 2.5;

  //       if (visibleWhen) {
  //         if (vScroll > headerHeight) {
  //           header.addClass("is-fixed");
  //         } else {
  //           header.removeClass("is-fixed");
  //         }
  //         if (vScroll > firstSection) {
  //           header.addClass("is-fixed-visible");
  //         } else {
  //           header.removeClass("is-fixed-visible");
  //         }
  //       }
  //     }, 10)
  //   );
  // }

  // HAMBURGER TOGGLER
  _document.on("click", "[js-hamburger]", function() {
    $(this).toggleClass("is-active");
    $(".mobile-navi").toggleClass("is-active");
  });

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////
  _document.on("click", "[js-shipper-button]", function() {
    $(".carrier-title").fadeOut(0);
    $(".shipper-title").fadeIn();
  });

  _document.on("click", "[js-carrier-button]", function() {
    $(".shipper-title").fadeOut(0);
    $(".carrier-title").fadeIn();
  });

  ////////////////////
  // CHANGE TITLE LOGIN PAGE
  ////////////////////

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  _document.on("click", "[js-open-lit]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".lit-map").addClass("is-active");
  });

  _document.on("click", "[js-open-usa]", function() {
    $(".contacts__map").removeClass("is-active");
    $(".usa-map").addClass("is-active");
  });

  ////////////////////
  // CHANGE MAPS
  ////////////////////

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  _document.on("click", "[js-show-pass]", function() {
    var x = document.getElementById("l2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  });

  ////////////////////
  // SHOW PASSWORD TOGGLE
  ////////////////////

  ////////////////////
  // FORM TOGGLER
  ////////////////////

  _document.on("click", "[open-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  _document.on("click", "[close-form]", function() {
    $(".form-block-hidden").slideToggle();
  });

  ////////////////////
  // FORM TOGGLER
  ////////////////////

  function closeMobileMenu() {
    $("[js-hamburger]").removeClass("is-active");
    $(".mobile-navi").removeClass("is-active");
  }

  // SET ACTIVE CLASS IN HEADER
  // * could be removed in production and server side rendering when header is inside barba-container
  function updateHeaderActiveClass() {
    $(".header__menu li").each(function(i, val) {
      if (
        $(val)
          .find("a")
          .attr("href") == window.location.pathname.split("/").pop()
      ) {
        $(val).addClass("is-active");
      } else {
        $(val).removeClass("is-active");
      }
    });
  }

  //////////
  // SLIDERS
  //////////

  //////////
  // MODALS
  //////////

  ////////////
  // UI
  ////////////

  // textarea autoExpand
  _document
    .one("focus.autoExpand", ".ui-group textarea", function() {
      var savedValue = this.value;
      this.value = "";
      this.baseScrollHeight = this.scrollHeight;
      this.value = savedValue;
    })
    .on("input.autoExpand", ".ui-group textarea", function() {
      var minRows = this.getAttribute("data-min-rows") | 0,
        rows;
      this.rows = minRows;
      rows = Math.ceil((this.scrollHeight - this.baseScrollHeight) / 17);
      this.rows = minRows + rows;
    });

  // Masked input
  function initMasks() {
    $("[js-dateMask]").mask("99.99.99", { placeholder: "ДД.ММ.ГГ" });
    $("input[type='tel']").mask("+7 (000) 000-0000", {
      placeholder: "+7 (___) ___-____"
    });
  }

  // selectric
  function initSelectric() {
    $("select").selectric({
      maxHeight: 300,
      disableOnMobile: false,
      nativeOnMobile: false
    });
  }

  ////////////
  // SCROLLMONITOR - WOW LIKE
  ////////////
  function initScrollMonitor() {
    $(".wow").each(function(i, el) {
      var elWatcher = scrollMonitor.create($(el));

      var delay;
      if ($(window).width() < 768) {
        delay = 0;
      } else {
        delay = $(el).data("animation-delay");
      }

      var animationClass = $(el).data("animation-class") || "wowFadeUp";

      var animationName = $(el).data("animation-name") || "wowFade";

      elWatcher.enterViewport(
        throttle(
          function() {
            $(el).addClass(animationClass);
            $(el).css({
              "animation-name": animationName,
              "animation-delay": delay,
              visibility: "visible"
            });
          },
          100,
          {
            leading: true
          }
        )
      );
      // elWatcher.exitViewport(throttle(function() {
      //   $(el).removeClass(animationClass);
      //   $(el).css({
      //     'animation-name': 'none',
      //     'animation-delay': 0,
      //     'visibility': 'hidden'
      //   });
      // }, 100));
    });
  }

  ////////////////
  // FORM VALIDATIONS
  ////////////////

  // jQuery validate plugin
  // https://jqueryvalidation.org
  function initValidations() {
    // GENERIC FUNCTIONS
    var validateErrorPlacement = function(error, element) {
      error.addClass("ui-input__validation");
      error.appendTo(element.parent("div"));
    };
    var validateHighlight = function(element) {
      $(element)
        .parent("div")
        .addClass("has-error");
    };
    var validateUnhighlight = function(element) {
      $(element)
        .parent("div")
        .removeClass("has-error");
    };
    var validateSubmitHandler = function(form) {
      $(form).addClass("loading");
      $.ajax({
        type: "POST",
        url: $(form).attr("action"),
        data: $(form).serialize(),
        success: function(response) {
          $(form).removeClass("loading");
          var data = $.parseJSON(response);
          if (data.status == "success") {
            // do something I can't test
          } else {
            $(form)
              .find("[data-error]")
              .html(data.message)
              .show();
          }
        }
      });
    };

    var validatePhone = {
      required: true,
      normalizer: function(value) {
        var PHONE_MASK = "+X (XXX) XXX-XXXX";
        if (!value || value === PHONE_MASK) {
          return value;
        } else {
          return value.replace(/[^\d]/g, "");
        }
      },
      minlength: 11,
      digits: true
    };

    ////////
    // FORMS

    /////////////////////
    // REGISTRATION FORM
    ////////////////////
    $(".js-registration-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        // first_name: "required",
        // phone: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true
          // minlength: 6
        }
        // phone: validatePhone
      }
    });
    $(".js-form").validate({
      errorPlacement: validateErrorPlacement,
      highlight: validateHighlight,
      unhighlight: validateUnhighlight,
      submitHandler: validateSubmitHandler,
      rules: {
        first_name: "required",
        // phone: "required",
        email: {
          required: true,
          email: true
        },
        password: {
          required: true,
          minlength: 6
        }
        // phone: validatePhone
      }
    });
  }

  //////////
  // PAGINATION
  //////////

  function pagination() {
    // Cache selectors
    var paginationAnchors = $(".header__menu .header__menu-link");
    var sections = $(".homepage [data-section]");
    var headerHeight = $(".header").height();
    var vScroll = _window.scrollTop();

    // Get id of current scroll item
    var cur = sections.map(function() {
      if ($(this).offset().top < vScroll + headerHeight) return this;
    });
    // Get current element
    cur = $(cur[cur.length - 1]);
    var id = cur && cur.length ? cur.data("section") : "1";
    var headerClass = cur && cur.length ? cur.data("header") : "";

    // update hash
    setTimeout(function() {
      window.location.hash = id;
    }, 1000);

    // Set/remove active class
    paginationAnchors
      .removeClass("is-active")
      .filter("[data-section='" + id + "']")
      .addClass("is-active");
  }

  //////////
  // BARBA PJAX
  //////////
  var easingSwing = [0.02, 0.01, 0.47, 1]; // default jQuery easing for anime.js

  Barba.Pjax.Dom.containerClass = "page";

  var FadeTransition = Barba.BaseTransition.extend({
    start: function() {
      Promise.all([this.newContainerLoading, this.fadeOut()]).then(
        this.fadeIn.bind(this)
      );
    },

    fadeOut: function() {
      var deferred = Barba.Utils.deferred();

      anime({
        targets: this.oldContainer,
        opacity: 0.5,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          deferred.resolve();
        }
      });

      return deferred.promise;
    },

    fadeIn: function() {
      var _this = this;
      var $el = $(this.newContainer);

      $(this.oldContainer).hide();

      $el.css({
        visibility: "visible",
        opacity: 0.5
      });

      anime({
        targets: "html, body",
        scrollTop: 1,
        easing: easingSwing, // swing
        duration: 150
      });

      anime({
        targets: this.newContainer,
        opacity: 1,
        easing: easingSwing, // swing
        duration: 300,
        complete: function(anim) {
          triggerBody();
          _this.done();
        }
      });

      AOS.refresh();
    }
  });

  // set barba transition
  Barba.Pjax.getTransition = function() {
    return FadeTransition;
  };

  Barba.Prefetch.init();
  Barba.Pjax.start();

  Barba.Dispatcher.on("newPageReady", function(
    currentStatus,
    oldStatus,
    container,
    newPageRawHTML
  ) {
    pageReady();
    closeMobileMenu();
  });

  // some plugins get bindings onNewPage only that way
  function triggerBody() {
    _window.scrollTop(0);
    $(window).scroll();
    $(window).resize();
  }

  //////////
  // MEDIA Condition helper function
  //////////
  function mediaCondition(cond) {
    var disabledBp;
    var conditionMedia = cond.substring(1);
    var conditionPosition = cond.substring(0, 1);

    if (conditionPosition === "<") {
      disabledBp = _window.width() < conditionMedia;
    } else if (conditionPosition === ">") {
      disabledBp = _window.width() > conditionMedia;
    }

    return disabledBp;
  }

  //////////
  // DEVELOPMENT HELPER
  //////////
  function setBreakpoint() {
    var wHost = window.location.host.toLowerCase();
    var displayCondition =
      wHost.indexOf("localhost") >= 0 || wHost.indexOf("surge") >= 0;
    if (displayCondition) {
      var wWidth = _window.width();

      var content = "<div class='dev-bp-debug'>" + wWidth + "</div>";

      $(".page").append(content);
      setTimeout(function() {
        $(".dev-bp-debug").fadeOut();
      }, 1000);
      setTimeout(function() {
        $(".dev-bp-debug").remove();
      }, 1500);
    }
  }
});
