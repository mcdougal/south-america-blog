(function() {
  var namespace,
    __slice = [].slice,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  namespace = function(target, name, block) {
    var item, top, _i, _len, _ref, _ref1;
    if (arguments.length < 3) {
      _ref = [(typeof exports !== 'undefined' ? exports : window)].concat(__slice.call(arguments)), target = _ref[0], name = _ref[1], block = _ref[2];
    }
    top = target;
    _ref1 = name.split('.');
    for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
      item = _ref1[_i];
      target = target[item] || (target[item] = {});
    }
    return block(target, top);
  };

  namespace("SA", function(exports) {
    var Photo;
    Photo = (function() {
      function Photo(img) {
        this.unzoom = __bind(this.unzoom, this);
        this.zoom_fullscreen = __bind(this.zoom_fullscreen, this);
        this.zoom_start = __bind(this.zoom_start, this);
        this.zoom = __bind(this.zoom, this);
        this.init_zoom = __bind(this.init_zoom, this);
        this.preload_full_size = __bind(this.preload_full_size, this);
        this.get_full_src = __bind(this.get_full_src, this);
        this.lazy_load = __bind(this.lazy_load, this);
        this.lazy_sizer = __bind(this.lazy_sizer, this);
        this.init_lazy_load = __bind(this.init_lazy_load, this);
        this.get_lazy_src = __bind(this.get_lazy_src, this);
        this.set_lazy_src = __bind(this.set_lazy_src, this);
        this.calc_src = __bind(this.calc_src, this);
        this.init_src = __bind(this.init_src, this);
        this.elem = $(img);
        this.init_src();
        this.init_lazy_load();
        this.init_zoom();
      }

      Photo.prototype.init_src = function() {
        var base_src, src;
        base_src = this.elem.attr('data-src');
        src = this.calc_src(base_src, 1000);
        return this.set_lazy_src(src);
      };

      Photo.prototype.calc_src = function(base_src, threshold) {
        var i, image_width, image_widths, num, window_width, _i, _len;
        window_width = $(window).width();
        image_widths = (function() {
          var _i, _results;
          _results = [];
          for (num = _i = 1; _i <= 20; num = ++_i) {
            _results.push(num * 100);
          }
          return _results;
        })();
        for (i = _i = 0, _len = image_widths.length; _i < _len; i = ++_i) {
          image_width = image_widths[i];
          if (window_width <= image_width || (threshold && image_width >= threshold)) {
            return "" + base_src + "/" + image_width + ".jpg";
          }
        }
        return "" + base_src + ".jpg";
      };

      Photo.prototype.set_lazy_src = function(src) {
        return this.elem.attr('data-lazy-src', src);
      };

      Photo.prototype.get_lazy_src = function() {
        return this.elem.attr('data-lazy-src');
      };

      Photo.prototype.init_lazy_load = function() {
        this.lazy_sizer(true);
        $(window).resize((function(_this) {
          return function() {
            return _this.lazy_sizer(false);
          };
        })(this));
        return this.elem.waypoint({
          handler: this.lazy_load,
          offset: '150%'
        });
      };

      Photo.prototype.lazy_sizer = function(trigger_window_resize) {
        var aspect;
        aspect = this.elem.attr('data-aspect');
        if (aspect) {
          aspect = parseFloat(aspect);
          this.elem.attr('height', this.elem.outerWidth() * aspect);
          if (trigger_window_resize) {
            console.log(trigger_window_resize);
            return $(window).resize();
          }
        }
      };

      Photo.prototype.lazy_load = function() {
        var aspect, src;
        src = this.elem.attr('src');
        if (!src) {
          aspect = this.elem.attr('data-aspect');
          if (!aspect) {
            this.elem.load((function(_this) {
              return function() {
                console.log(_this.elem[0]);
                return console.log(_this.elem.height() / _this.elem.width());
              };
            })(this));
          }
          this.elem.attr('src', this.get_lazy_src());
          this.preload_full_size();
          return $(window).resize();
        }
      };

      Photo.prototype.get_full_src = function() {
        return this.calc_src(this.elem.attr('data-src'));
      };

      Photo.prototype.preload_full_size = function() {
        return $('<img/>').attr('src', this.get_full_src()).load((function(_this) {
          return function(e) {
            _this.full_width = e.target.width;
            return _this.full_height = e.target.height;
          };
        })(this));
      };

      Photo.prototype.init_zoom = function() {
        this.elem.click(this.zoom);
        $('.zoomed_img_cover').click((function(_this) {
          return function() {
            return _this.unzoom($('.zoomed_img'));
          };
        })(this));
        $(window).scroll((function(_this) {
          return function() {
            return _this.unzoom($('.zoomed_img'), true);
          };
        })(this));
        return $(window).resize((function(_this) {
          return function() {
            return _this.unzoom($('.zoomed_img'), true);
          };
        })(this));
      };

      Photo.prototype.zoom = function() {
        var zoomed_img;
        zoomed_img = $('.zoomed_img');
        zoomed_img.attr('src', '');
        zoomed_img.attr('src', this.get_full_src());
        this.zoom_start(zoomed_img);
        return this.zoom_fullscreen(zoomed_img);
      };

      Photo.prototype.zoom_start = function(zoomed_img) {
        zoomed_img.css({
          top: this.elem.offset().top - $(window).scrollTop(),
          left: this.elem.offset().left,
          width: this.elem.width(),
          height: this.elem.height()
        });
        zoomed_img.show();
        return this.elem.addClass('hidden');
      };

      Photo.prototype.zoom_fullscreen = function(zoomed_img) {
        var aspect_ratio, browser_tag, height, max_height, max_width, scale, translateY, width, _i, _len, _ref;
        $('.sa').addClass('image_zoomed');
        aspect_ratio = this.elem.width() / this.elem.height();
        max_width = $(window).width() - 20;
        if (this.full_width) {
          max_width = Math.min(this.full_width, max_width);
        }
        max_height = $(window).height() - 20;
        if (this.full_height) {
          max_height = Math.min(this.full_height, max_height);
        }
        width = max_width;
        height = width / aspect_ratio;
        if (height > max_height) {
          height = max_height;
          width = height * aspect_ratio;
        }
        scale = width / this.elem.width();
        translateY = (($(window).scrollTop() + (($(window).height() - height) / 2)) - this.elem.offset().top) + ((height - this.elem.height()) / 2);
        _ref = ['-moz-', '-o-', '-webkit-', ''];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          browser_tag = _ref[_i];
          zoomed_img.css("" + browser_tag + "transform", "translateY(" + translateY + "px) scale(" + scale + ")");
        }
        return zoomed_img.click((function(_this) {
          return function() {
            return _this.unzoom(zoomed_img);
          };
        })(this));
      };

      Photo.prototype.unzoom = function(zoomed_img, immediate) {
        var browser_tag, _i, _len, _ref;
        $('.sa').removeClass('image_zoomed');
        if (immediate) {
          zoomed_img.addClass('no_transition');
        }
        _ref = ['-moz-', '-o-', '-webkit-', ''];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          browser_tag = _ref[_i];
          zoomed_img.css("" + browser_tag + "transform", "none");
        }
        zoomed_img.removeClass('no_transition');
        if (immediate) {
          $('.photo img').removeClass('hidden');
          return zoomed_img.hide();
        } else {
          setTimeout((function() {
            return $('.photo img').removeClass('hidden');
          }), 250);
          return setTimeout((function() {
            return zoomed_img.hide();
          }), 300);
        }
      };

      return Photo;

    })();
    return $((function(_this) {
      return function() {
        var recalc_datetimes, set_nav_zone, toggle_nav;
        set_nav_zone = function(is_nav_zone) {
          if (is_nav_zone) {
            return $('.sa').addClass('nav_zone');
          } else {
            return $('.sa').removeClass('nav_zone');
          }
        };
        $('.js-article').waypoint(function(direction) {
          return set_nav_zone(direction === 'down');
        });
        toggle_nav = function() {
          $('.sa').toggleClass('nav_toggled');
          return false;
        };
        $('.js-navToggle').click(toggle_nav);
        $('.js-navCover').click(toggle_nav);
        recalc_datetimes = function() {
          return $(document.body).trigger("sticky_kit:recalc");
        };
        $('.js-datetime').stick_in_parent();
        $(window).resize(recalc_datetimes);
        return $('.js-photo').each(function() {
          return new Photo(this);
        });
      };
    })(this));
  });

}).call(this);
