/*! CCL - v0.1.0
 * http://github.com/ObjectiveSubject/ccl
 * Copyright (c) 2017; * Licensed GPLv2+ */

/**
 * Global Variables. 
 */


(function ( $, window ) {
    'use strict';
    var document = window.document;
    
    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.DURATION = 300;

    CCL.BREAKPOINT_SM = 500;
    CCL.BREAKPOINT_MD = 768;
    CCL.BREAKPOINT_LG = 1000;
    CCL.BREAKPOINT_XL = 1500;

    $(document).ready(function(){
        $('html').toggleClass('no-js js');
    });

})(jQuery, this);
/**
 * Reflow page elements. 
 * 
 * Enables animations/transitions on elements added to the page after the DOM has loaded.
 */


(function () {

    if (!window.CCL) {
        window.CCL = {};
    }

    CCL.reflow = function (element) {
        return element.offsetHeight;
    };

})();
/**
 * Get the Scrollbar width
 * Thanks to david walsh: https://davidwalsh.name/detect-scrollbar-width
 */

( function( window, $ ) {
    'use strict';
    var document = window.document;
    
    function getScrollWidth() {
        
        // Create the measurement node
        var scrollDiv = document.createElement("div");
        
        // position way the hell off screen
        $(scrollDiv).css({
            width: '100px',
            height: '100px',
            overflow: 'scroll',
            position: 'absolute',
            top: '-9999px',
        });

        $('body').append(scrollDiv);

        // Get the scrollbar width
        var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
        // console.warn(scrollbarWidth); // Mac:  15

        // Delete the DIV 
        $(scrollDiv).remove();

        return scrollbarWidth;
    }
    
    if ( ! window.CCL ) {
        window.CCL = {};
    }

    CCL.getScrollWidth = getScrollWidth;
    CCL.SCROLLBARWIDTH = getScrollWidth();

} )( this, jQuery );

/**
 * .debounce() function
 * 
 * Source: https://davidwalsh.name/javascript-debounce-function
 */


(function(window) {

    // Returns a function, that, when invoked, will only be triggered at most once
    // during a given window of time. Normally, the throttled function will run
    // as much as it can, without ever going more than once per `wait` duration;
    // but if you'd like to disable the execution on the leading edge, pass
    // `{leading: false}`. To disable execution on the trailing edge, ditto.
    var throttle = function (func, wait, options) {
        var timeout, context, args, result;
        var previous = 0;
        if (!options) options = {};

        var later = function () {
            previous = options.leading === false ? 0 : new Date().getTime();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };

        var throttled = function () {
            var now = new Date().getTime();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                if (timeout) {
                    clearTimeout(timeout);
                    timeout = null;
                }
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };

        throttled.cancel = function () {
            clearTimeout(timeout);
            previous = 0;
            timeout = context = args = null;
        };

        return throttled;
    };

    if (!window.CCL) {
        window.CCL = {};
    }

    window.CCL.throttle = throttle;

})(this);
/**
 * Accordions
 * 
 * Behavior for accordion components
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Accordion = function(el){
        this.$el = $(el);
        this.$toggle = this.$el.children('.ccl-c-accordion__toggle');
        this.$content = this.$el.children('.ccl-c-accordion__content');
        this.init();
    };

    Accordion.prototype.init = function(){
        var _this = this;

        this.$toggle.on('click', function(e){
            e.preventDefault();
            _this.$content.slideToggle();
            _this.$el.toggleClass('ccl-is-open');
        });

    };

    $(document).ready(function(){
        $('.ccl-c-accordion').each(function(){
            new Accordion(this);
        });
    });

} )( this, jQuery );

/**
 * Alerts
 * 
 * Behavior for alerts
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = CCL.DURATION;

    var AlertDismiss = function($el){
        
        this.$el = $el;
        this.target = $el.parent();
        this.$target = $(this.target);
        
        this.init();
    };

    AlertDismiss.prototype.init = function(){
        
        var _this = this;
        
        _this.$target.animate( { opacity: 0 }, {
            duration: DURATION,
            complete: function(){
                _this.$target.slideUp( DURATION, function(){
                    _this.$target.remove();
                });
            }
        });

    };



    $(document).ready(function(){
        $(document).on( 'click', '[data-dismiss="alert"]', function(e){
            var dismissEl = $(e.target).closest('[data-dismiss="alert"]');
            new AlertDismiss(dismissEl);
        });
    });

})(this, jQuery);
/**
 * Carousels
 * 
 * Initialize and define behavior for carousels. 
 * Uses the Slick Slides jQuery plugin --> http://kenwheeler.github.io/slick/
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Carousel = function(el){

        this.$el = $(el);
        this.globalDefaults = {
            mobileFirst: true,
            dotsClass: 'ccl-c-carousel__paging',
            infinite: false,
            dots: true,
            slidesToScroll: 1,
            variableWidth: true
        };

        this.init();

    };

    Carousel.prototype.init = function() {
        var data = this.$el.data(),
            options = data.options || {};
            
        options.responsive = [];

        if ( data.optionsSm ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_SM, 
                settings: data.optionsSm
            });
        }
        if ( data.optionsMd ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_MD, 
                settings: data.optionsMd
            });
        }
        if ( data.optionsLg ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_LG, 
                settings: data.optionsLg
            });
        }
        if ( data.optionsXl ) {
            options.responsive.push({
                breakpoint: CCL.BREAKPOINT_XL, 
                settings: data.optionsXl
            });
        }

        options = $.extend( this.globalDefaults, options );

        var carousel = this.$el.slick(options),
            _this = this;

        carousel.on('beforeChange', function(event, slick, currentSlide, nextSlide){
            _this.$el.find('.slick-slide').removeClass('ccl-is-past');
            _this.$el.find('.slick-slide[data-slick-index="'+nextSlide+'"]').prevAll().addClass('ccl-is-past');
        });
    };

    $(document).ready(function(){
        $('.js-promo-carousel').each(function(){
            new Carousel(this);
        });
    });

} )( this, jQuery );

/**
 * Dropdowns
 * 
 * Initialize and control behavior for dropdown menus
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        selector = {
            TOGGLE: '[data-toggle="dropdown"]',
        },
        className = {
            ACTIVE: 'ccl-is-active',
            MENU: 'ccl-c-dropdown__menu'
        };

    var DropdownToggle = function(el){
        this.$toggle = $(el);
        this.$parent = this.$toggle.parent();
        
        var target = this.$toggle.data('target');

        this.$menu = $( target );
        
        this.init();
    };

    DropdownToggle.prototype.init = function(){

        var _this = this;

        this.$toggle.click( function(event){
            event.preventDefault();
            event.stopPropagation();
            _this.toggle();
        });

        $(document).on( 'click', function(event){
            var hasActiveMenus = $( '.' + className.MENU + '.' + className.ACTIVE ).length;
            if ( hasActiveMenus ){
                _clearMenus();
            }
        });

    };

    DropdownToggle.prototype.toggle = function(){

        var isActive = this.$toggle.hasClass( className.ACTIVE );

        if ( isActive ) {
            return;
        }

        this.showMenu();

    };

    DropdownToggle.prototype.showMenu = function(){
        this.$toggle.attr('aria-expanded', 'true');
        this.$menu.addClass( className.ACTIVE );
        this.$parent.addClass( className.ACTIVE );
    };

    DropdownToggle.prototype.hideMenu = function(){
        this.$toggle.attr('aria-expanded', 'false');
        this.$menu.removeClass( className.ACTIVE );
        this.$parent.removeClass( className.ACTIVE );
    };

    function _clearMenus() {
        $('.ccl-c-dropdown, .ccl-c-dropdown__menu').removeClass( className.ACTIVE );
        $( selector.TOGGLE ).attr('aria-expanded', 'false');
    }

    $(document).ready(function(){
        $( selector.TOGGLE ).each(function(){
            new DropdownToggle(this);
        });
    });

} )( this, jQuery );

/**
 * Modals
 * 
 * Behavior for modals. Based on Bootstrap's modals: https://getbootstrap.com/docs/4.0/components/modal/
 * 
 * Globals:
 * SCROLLBARWIDTH
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        DURATION = 300;

    var ModalToggle = function(el){
        
        var $el = $(el);
        
        this.$el = $(el);
        this.target = $el.data('target');
        this.$target = $(this.target);
        
        this.init();
    };

    ModalToggle.prototype.init = function(){

        var _this = this; 

        _this.$el.on( 'click', function(e){
            e.preventDefault();

            if ( $(document.body).hasClass('ccl-modal-open') ) {
                _this.closeModal();
            } else {
                _this.showBackdrop(function(){
                    _this.showModal();
                });
            }
        });

    };

    ModalToggle.prototype.showBackdrop = function(callback){

        var backdrop = document.createElement('div');
        var $backdrop = $(backdrop);

        $backdrop.addClass('ccl-c-modal__backdrop');
        $backdrop.appendTo(document.body);
        
        CCL.reflow(backdrop);
        
        $backdrop.addClass('ccl-is-shown');

        $(document.body)
            .addClass('ccl-modal-open')
            .css( 'padding-right', CCL.SCROLLBARWIDTH );

        if ( callback ) {
            setTimeout( callback, DURATION );
        }
    };

    ModalToggle.prototype.showModal = function(){
        var _this = this;
        _this.$target.show( 0, function(){
            _this.$target.addClass('ccl-is-shown');
        });
    };

    ModalToggle.prototype.closeModal = function(){

        $('.ccl-c-modal').removeClass('ccl-is-shown');

        setTimeout( function(){
            
            $('.ccl-c-modal').hide();

            $('.ccl-c-modal__backdrop').removeClass('ccl-is-shown');

            setTimeout(function(){

                $('.ccl-c-modal__backdrop').remove();

                $(document.body)
                    .removeClass('ccl-modal-open')
                    .css( 'padding-right', '' );

            }, DURATION);

        }, DURATION ); 

    };



    $(document).ready(function(){
        $('[data-toggle="modal"]').each(function(){
            new ModalToggle(this);
        });
    });

})(this, jQuery);
/**
 * Stickies
 * 
 * Behaviour for sticky elements.
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        $window = $(window),
        className = {
            isFixed: 'ccl-is-fixed'
        };

    var Sticky = function(el){

        // variables
        var $el = $(el),
            height = $el.outerHeight(),
            offset = $el.offset(),
            options = $el.data('sticky'),
            wrapper = $('<div class="js-sticky-wrapper"></div>').css({ height: height + 'px' });

        var defaultOptions = {
            offset: 0
        };

        options = $.extend( defaultOptions, options );

        // wrap element
        $el.wrap( wrapper );

        // scroll listener
        $window.scroll( CCL.throttle( _onScroll, 100 ) );

        // on scroll
        function _onScroll() {
            
            var scrollTop = $window.scrollTop() + options.offset;
    
            if ( scrollTop >= offset.top ) {
                $el.addClass( className.isFixed );
            } else {
                $el.removeClass( className.isFixed );
            }
    
        }

        return this;

    };

    $(document).ready(function(){
        $('.js-is-sticky').each(function(){
            new Sticky(this);
        });
    });

} )( this, jQuery );

/**
 * Toggle Schools
 * 
 * Behavior for school toggles
 */

(function (window, $) {
    'use strict';

    var document = window.document,
        initSchool = $('html').data('school');

    var SchoolSelect = function(el){
        
        this.$select = $(el);
        
        this.init();
    };

    SchoolSelect.prototype.init = function(){
        
        if ( initSchool ) {

            this.$select
                .find( 'option[value="' + initSchool + '"]' )
                .attr( 'selected', 'selected' );   

        }

        this.$select.change(function(event){
            $('html').attr(  'data-school', event.target.value );
        });
    };

    $(document).ready(function(){
        $('[data-toggle="school"]').each(function(){
            new SchoolSelect(this);
        });
    });

})(this, jQuery);
/**
 * Tooltips
 * 
 * Behavior for tooltips
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var Tooltip = function(el){
        this.$el = $(el);
        this.content = this.$el.attr('title');
        this.$tooltip = $('<div id="ccl-current-tooltip" class="ccl-c-tooltip ccl-is-top" role="tooltip">'+
                            '<div class="ccl-c-tooltip__arrow"></div>'+
                            '<div class="ccl-c-tooltip__inner">'+
                                this.content +
                            '</div>'+
                          '</div>');
        
        this.init();
    };

    Tooltip.prototype.init = function(){
        
        var _this = this;

        this.$el.hover(function(e){

            // mouseover

            _this.$el.attr('title', '');
            _this.$el.attr('aria-describedby', 'ccl-current-tooltip');
            _this.$tooltip.appendTo(document.body);

            CCL.reflow(_this.$tooltip[0]);

            var offset = _this.$el.offset(),
                width  = _this.$el.outerWidth(),
                tooltipHeight = _this.$tooltip.outerHeight();

            _this.$tooltip.css({
                top: (offset.top - tooltipHeight) + 'px',
                left: (offset.left + (width/2)) + 'px'
            });

            _this.$tooltip.addClass('ccl-is-shown');

        }, function(e){ 

            //mouseout

            _this.$el.attr('title', _this.content);
            _this.$el.attr('aria-describedby', '');
            _this.$tooltip.removeClass('ccl-is-shown');
            _this.$tooltip.remove();

        });

    };

    $(document).ready(function(){
        $('[data-toggle="tooltip"]').each(function(){
            new Tooltip(this);
        });
    });

} )( this, jQuery );

/**
 * Wayfinding
 * 
 * Controls interface for looking up call number locations
 */

( function( window, $ ) {
	'use strict';
    var document = window.document,
        tabs, wayfinder;
    
    var Tabs = function(el) {

        var _this = this;

        this.$el = $(el);
        this.$tabs = this.$el.find('.ccl-c-tab');
        this.$tabContents = $('.ccl-c-tab__content');
        

        this.$tabs.each(function(){
            var $tab = $(this);
            $tab.click(function(e){
                e.preventDefault();
                var target = $tab.data('target');
                // _this.$tabContents.removeClass('ccl-is-active');
                // _this.$tabContents.filter(target).addClass('ccl-is-active');
                _this.setActive(target);
            });
        });

        return this;
    };

    Tabs.prototype.setActive = function(target){
        this.$tabs.removeClass('ccl-is-active');
        this.$tabs.filter('[href="'+target+'"]').addClass('ccl-is-active');
        this.$tabContents.removeClass('ccl-is-active');
        this.$tabContents.filter(target).addClass('ccl-is-active');
    };

    var Wayfinder = function(el){
        this.$el = $(el);
        this.callNumbers = {};
        this.$form = this.$el.find('#call-number-search');
        this.$input = this.$el.find('#call-num-input');
        this.$submit = this.$el.find('#call-num-submit');
        this.$marquee = this.$el.find('.ccl-c-wayfinder__marquee');
        this.$callNum = this.$el.find('.ccl-c-wayfinder__call-num');
        this.$wing = this.$el.find('.ccl-c-wayfinder__wing');
        this.$floor = this.$el.find('.ccl-c-wayfinder__floor');
        this.$subject = this.$el.find('.ccl-c-wayfinder__subject');
        this.error = {
            get: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon-alert" aria-hidden="true"></i> There was an error fetching call numbers.</div>',
            find: '<div class="ccl-c-alert ccl-is-error ccl-wayfinder__error"><button type="button" class="ccl-b-close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><i class="ccl-b-icon-alert" aria-hidden="true"></i> Could not find that call number. Please try again.</div>'
        };
        this.$errorBox = $('.ccl-error-box');

        var _this = this;

        $.getJSON( CCL.assets + 'js/call-numbers.json' )
            .done(function(data){
                _this.callNumbers = data;
                _this.init();
            })
            .fail(function(err){
                console.log(err);
                this.$errorBox.append( this.error.get );
            });

        return this;
    };

    Wayfinder.prototype.init = function() {
        
        var _this = this;

        this.$el.addClass('ccl-app-active');

        this.$input
            .keyup(function () {
                var query = $(this).val();
                
                if ( query === "" ) {
                    _this.$submit.attr('disabled', true);
                    _this.$marquee.hide();
                    _this.reset();                
                } else {
                    _this.$submit.attr('disabled', false);
                }

            });

        this.$form.submit(function(e){
            e.preventDefault();

            var query = _this.$input.val();

            $('.ccl-wayfinder__error').remove();
            _this.$marquee.show();
            _this.$callNum.text(query);
            _this.findRoom( query );
        });

    };

    Wayfinder.prototype.getCallKey = function(callNum) {
        var key,
            callKeys = Object.keys(this.callNumbers);

        if ( callKeys.length === 0 ){
            return;
        }

        callKeys.forEach(function(k){
          if ( callNum >= k ) {
            key = k;
          }
        });

        return key;
    };

    Wayfinder.prototype.findRoom = function(query) {

        query = query.toUpperCase();
        
        var callKey = this.getCallKey(query),
            callData = {},
            room;

        if ( ! callKey ) {
            this.throwFindError();
            return;
        }

        $('html, body').animate({ scrollTop: $('.ccl-c-search').offset().top });
        
        callData = this.callNumbers[callKey];

        this.$floor.text( callData.floor );
        this.$wing.text( callData.wing );
        this.$subject.text( callData.subject );

        /* TODO:
         * set ACTUAL room, not just the floor. still waiting on client 
         * to provide data for which call numbers belong to which rooms
         * ----------------------------------------------------------------- */

        room = callData.floor_int;

        /* ----------------------------------------------------------------- */

        this.$el.find('a[href="#floor-'+room+'"]').addClass('ccl-is-active');
        this.$el.find('#room-'+room+'-1').addClass('ccl-is-active');

        tabs.setActive( '#floor-' + room );
        
    };

    Wayfinder.prototype.reset = function() {
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
    };

    Wayfinder.prototype.throwFindError = function(){
        this.$el.find('a[href*="#floor-"]').removeClass('ccl-is-active');
        this.$el.find('.ccl-c-floor__room').removeClass('ccl-is-active');
        this.$floor.text( '' );
        this.$wing.text( '' );
        this.$subject.text( '' );
        this.$errorBox.append( this.error.find );
    };

    $(document).ready(function(){
        $('.ccl-js-tabs').each(function(){
            tabs = new Tabs(this);
        });
        $('.ccl-js-wayfinder').each(function(){
            wayfinder = new Wayfinder(this);
        });
    });

} )( this, jQuery );

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9pbml0LmpzIiwicmVmbG93LmpzIiwic2Nyb2xsYmFyd2lkdGguanMiLCJ0aHJvdHRsZS5qcyIsImFjY29yZGlvbnMuanMiLCJhbGVydHMuanMiLCJjYXJvdXNlbHMuanMiLCJkcm9wZG93bnMuanMiLCJtb2RhbHMuanMiLCJzdGlja2llcy5qcyIsInRvZ2dsZS1zY2hvb2xzLmpzIiwidG9vbHRpcHMuanMiLCJ3YXlmaW5kaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ2pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM3REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDN0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUM1RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FDbkZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQ3hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUNwRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBHbG9iYWwgVmFyaWFibGVzLiBcbiAqL1xuXG5cbihmdW5jdGlvbiAoICQsIHdpbmRvdyApIHtcbiAgICAndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuICAgIFxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgQ0NMLkRVUkFUSU9OID0gMzAwO1xuXG4gICAgQ0NMLkJSRUFLUE9JTlRfU00gPSA1MDA7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTUQgPSA3Njg7XG4gICAgQ0NMLkJSRUFLUE9JTlRfTEcgPSAxMDAwO1xuICAgIENDTC5CUkVBS1BPSU5UX1hMID0gMTUwMDtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJ2h0bWwnKS50b2dnbGVDbGFzcygnbm8tanMganMnKTtcbiAgICB9KTtcblxufSkoalF1ZXJ5LCB0aGlzKTsiLCIvKipcbiAqIFJlZmxvdyBwYWdlIGVsZW1lbnRzLiBcbiAqIFxuICogRW5hYmxlcyBhbmltYXRpb25zL3RyYW5zaXRpb25zIG9uIGVsZW1lbnRzIGFkZGVkIHRvIHRoZSBwYWdlIGFmdGVyIHRoZSBET00gaGFzIGxvYWRlZC5cbiAqL1xuXG5cbihmdW5jdGlvbiAoKSB7XG5cbiAgICBpZiAoIXdpbmRvdy5DQ0wpIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5yZWZsb3cgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICByZXR1cm4gZWxlbWVudC5vZmZzZXRIZWlnaHQ7XG4gICAgfTtcblxufSkoKTsiLCIvKipcbiAqIEdldCB0aGUgU2Nyb2xsYmFyIHdpZHRoXG4gKiBUaGFua3MgdG8gZGF2aWQgd2Fsc2g6IGh0dHBzOi8vZGF2aWR3YWxzaC5uYW1lL2RldGVjdC1zY3JvbGxiYXItd2lkdGhcbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG4gICAgJ3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcbiAgICBcbiAgICBmdW5jdGlvbiBnZXRTY3JvbGxXaWR0aCgpIHtcbiAgICAgICAgXG4gICAgICAgIC8vIENyZWF0ZSB0aGUgbWVhc3VyZW1lbnQgbm9kZVxuICAgICAgICB2YXIgc2Nyb2xsRGl2ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgXG4gICAgICAgIC8vIHBvc2l0aW9uIHdheSB0aGUgaGVsbCBvZmYgc2NyZWVuXG4gICAgICAgICQoc2Nyb2xsRGl2KS5jc3Moe1xuICAgICAgICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICAgICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICAgICAgICBvdmVyZmxvdzogJ3Njcm9sbCcsXG4gICAgICAgICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgICAgICAgIHRvcDogJy05OTk5cHgnLFxuICAgICAgICB9KTtcblxuICAgICAgICAkKCdib2R5JykuYXBwZW5kKHNjcm9sbERpdik7XG5cbiAgICAgICAgLy8gR2V0IHRoZSBzY3JvbGxiYXIgd2lkdGhcbiAgICAgICAgdmFyIHNjcm9sbGJhcldpZHRoID0gc2Nyb2xsRGl2Lm9mZnNldFdpZHRoIC0gc2Nyb2xsRGl2LmNsaWVudFdpZHRoO1xuICAgICAgICAvLyBjb25zb2xlLndhcm4oc2Nyb2xsYmFyV2lkdGgpOyAvLyBNYWM6ICAxNVxuXG4gICAgICAgIC8vIERlbGV0ZSB0aGUgRElWIFxuICAgICAgICAkKHNjcm9sbERpdikucmVtb3ZlKCk7XG5cbiAgICAgICAgcmV0dXJuIHNjcm9sbGJhcldpZHRoO1xuICAgIH1cbiAgICBcbiAgICBpZiAoICEgd2luZG93LkNDTCApIHtcbiAgICAgICAgd2luZG93LkNDTCA9IHt9O1xuICAgIH1cblxuICAgIENDTC5nZXRTY3JvbGxXaWR0aCA9IGdldFNjcm9sbFdpZHRoO1xuICAgIENDTC5TQ1JPTExCQVJXSURUSCA9IGdldFNjcm9sbFdpZHRoKCk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIC5kZWJvdW5jZSgpIGZ1bmN0aW9uXG4gKiBcbiAqIFNvdXJjZTogaHR0cHM6Ly9kYXZpZHdhbHNoLm5hbWUvamF2YXNjcmlwdC1kZWJvdW5jZS1mdW5jdGlvblxuICovXG5cblxuKGZ1bmN0aW9uKHdpbmRvdykge1xuXG4gICAgLy8gUmV0dXJucyBhIGZ1bmN0aW9uLCB0aGF0LCB3aGVuIGludm9rZWQsIHdpbGwgb25seSBiZSB0cmlnZ2VyZWQgYXQgbW9zdCBvbmNlXG4gICAgLy8gZHVyaW5nIGEgZ2l2ZW4gd2luZG93IG9mIHRpbWUuIE5vcm1hbGx5LCB0aGUgdGhyb3R0bGVkIGZ1bmN0aW9uIHdpbGwgcnVuXG4gICAgLy8gYXMgbXVjaCBhcyBpdCBjYW4sIHdpdGhvdXQgZXZlciBnb2luZyBtb3JlIHRoYW4gb25jZSBwZXIgYHdhaXRgIGR1cmF0aW9uO1xuICAgIC8vIGJ1dCBpZiB5b3UnZCBsaWtlIHRvIGRpc2FibGUgdGhlIGV4ZWN1dGlvbiBvbiB0aGUgbGVhZGluZyBlZGdlLCBwYXNzXG4gICAgLy8gYHtsZWFkaW5nOiBmYWxzZX1gLiBUbyBkaXNhYmxlIGV4ZWN1dGlvbiBvbiB0aGUgdHJhaWxpbmcgZWRnZSwgZGl0dG8uXG4gICAgdmFyIHRocm90dGxlID0gZnVuY3Rpb24gKGZ1bmMsIHdhaXQsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHRpbWVvdXQsIGNvbnRleHQsIGFyZ3MsIHJlc3VsdDtcbiAgICAgICAgdmFyIHByZXZpb3VzID0gMDtcbiAgICAgICAgaWYgKCFvcHRpb25zKSBvcHRpb25zID0ge307XG5cbiAgICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcHJldmlvdXMgPSBvcHRpb25zLmxlYWRpbmcgPT09IGZhbHNlID8gMCA6IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICByZXN1bHQgPSBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgIH07XG5cbiAgICAgICAgdmFyIHRocm90dGxlZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHZhciBub3cgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICAgICAgICAgIGlmICghcHJldmlvdXMgJiYgb3B0aW9ucy5sZWFkaW5nID09PSBmYWxzZSkgcHJldmlvdXMgPSBub3c7XG4gICAgICAgICAgICB2YXIgcmVtYWluaW5nID0gd2FpdCAtIChub3cgLSBwcmV2aW91cyk7XG4gICAgICAgICAgICBjb250ZXh0ID0gdGhpcztcbiAgICAgICAgICAgIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICAgICAgICBpZiAocmVtYWluaW5nIDw9IDAgfHwgcmVtYWluaW5nID4gd2FpdCkge1xuICAgICAgICAgICAgICAgIGlmICh0aW1lb3V0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgICAgICAgICAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHByZXZpb3VzID0gbm93O1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IGZ1bmMuYXBwbHkoY29udGV4dCwgYXJncyk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aW1lb3V0KSBjb250ZXh0ID0gYXJncyA9IG51bGw7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCF0aW1lb3V0ICYmIG9wdGlvbnMudHJhaWxpbmcgIT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHJlbWFpbmluZyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgICB9O1xuXG4gICAgICAgIHRocm90dGxlZC5jYW5jZWwgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBjbGVhclRpbWVvdXQodGltZW91dCk7XG4gICAgICAgICAgICBwcmV2aW91cyA9IDA7XG4gICAgICAgICAgICB0aW1lb3V0ID0gY29udGV4dCA9IGFyZ3MgPSBudWxsO1xuICAgICAgICB9O1xuXG4gICAgICAgIHJldHVybiB0aHJvdHRsZWQ7XG4gICAgfTtcblxuICAgIGlmICghd2luZG93LkNDTCkge1xuICAgICAgICB3aW5kb3cuQ0NMID0ge307XG4gICAgfVxuXG4gICAgd2luZG93LkNDTC50aHJvdHRsZSA9IHRocm90dGxlO1xuXG59KSh0aGlzKTsiLCIvKipcbiAqIEFjY29yZGlvbnNcbiAqIFxuICogQmVoYXZpb3IgZm9yIGFjY29yZGlvbiBjb21wb25lbnRzXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG5cdHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudDtcblxuICAgIHZhciBBY2NvcmRpb24gPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuJHRvZ2dsZSA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX190b2dnbGUnKTtcbiAgICAgICAgdGhpcy4kY29udGVudCA9IHRoaXMuJGVsLmNoaWxkcmVuKCcuY2NsLWMtYWNjb3JkaW9uX19jb250ZW50Jyk7XG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBBY2NvcmRpb24ucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgIHRoaXMuJHRvZ2dsZS5vbignY2xpY2snLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIF90aGlzLiRjb250ZW50LnNsaWRlVG9nZ2xlKCk7XG4gICAgICAgICAgICBfdGhpcy4kZWwudG9nZ2xlQ2xhc3MoJ2NjbC1pcy1vcGVuJyk7XG4gICAgICAgIH0pO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5jY2wtYy1hY2NvcmRpb24nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgQWNjb3JkaW9uKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogQWxlcnRzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciBhbGVydHNcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSBDQ0wuRFVSQVRJT047XG5cbiAgICB2YXIgQWxlcnREaXNtaXNzID0gZnVuY3Rpb24oJGVsKXtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuJGVsID0gJGVsO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5wYXJlbnQoKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgQWxlcnREaXNtaXNzLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIFxuICAgICAgICBfdGhpcy4kdGFyZ2V0LmFuaW1hdGUoIHsgb3BhY2l0eTogMCB9LCB7XG4gICAgICAgICAgICBkdXJhdGlvbjogRFVSQVRJT04sXG4gICAgICAgICAgICBjb21wbGV0ZTogZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnNsaWRlVXAoIERVUkFUSU9OLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsICdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgIHZhciBkaXNtaXNzRWwgPSAkKGUudGFyZ2V0KS5jbG9zZXN0KCdbZGF0YS1kaXNtaXNzPVwiYWxlcnRcIl0nKTtcbiAgICAgICAgICAgIG5ldyBBbGVydERpc21pc3MoZGlzbWlzc0VsKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0pKHRoaXMsIGpRdWVyeSk7IiwiLyoqXG4gKiBDYXJvdXNlbHNcbiAqIFxuICogSW5pdGlhbGl6ZSBhbmQgZGVmaW5lIGJlaGF2aW9yIGZvciBjYXJvdXNlbHMuIFxuICogVXNlcyB0aGUgU2xpY2sgU2xpZGVzIGpRdWVyeSBwbHVnaW4gLS0+IGh0dHA6Ly9rZW53aGVlbGVyLmdpdGh1Yi5pby9zbGljay9cbiAqL1xuXG4oIGZ1bmN0aW9uKCB3aW5kb3csICQgKSB7XG5cdCd1c2Ugc3RyaWN0Jztcblx0dmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50O1xuXG4gICAgdmFyIENhcm91c2VsID0gZnVuY3Rpb24oZWwpe1xuXG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuZ2xvYmFsRGVmYXVsdHMgPSB7XG4gICAgICAgICAgICBtb2JpbGVGaXJzdDogdHJ1ZSxcbiAgICAgICAgICAgIGRvdHNDbGFzczogJ2NjbC1jLWNhcm91c2VsX19wYWdpbmcnLFxuICAgICAgICAgICAgaW5maW5pdGU6IGZhbHNlLFxuICAgICAgICAgICAgZG90czogdHJ1ZSxcbiAgICAgICAgICAgIHNsaWRlc1RvU2Nyb2xsOiAxLFxuICAgICAgICAgICAgdmFyaWFibGVXaWR0aDogdHJ1ZVxuICAgICAgICB9O1xuXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuXG4gICAgfTtcblxuICAgIENhcm91c2VsLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy4kZWwuZGF0YSgpLFxuICAgICAgICAgICAgb3B0aW9ucyA9IGRhdGEub3B0aW9ucyB8fCB7fTtcbiAgICAgICAgICAgIFxuICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUgPSBbXTtcblxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1NtICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1NNLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zU21cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICggZGF0YS5vcHRpb25zTWQgKSB7XG4gICAgICAgICAgICBvcHRpb25zLnJlc3BvbnNpdmUucHVzaCh7XG4gICAgICAgICAgICAgICAgYnJlYWtwb2ludDogQ0NMLkJSRUFLUE9JTlRfTUQsIFxuICAgICAgICAgICAgICAgIHNldHRpbmdzOiBkYXRhLm9wdGlvbnNNZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCBkYXRhLm9wdGlvbnNMZyApIHtcbiAgICAgICAgICAgIG9wdGlvbnMucmVzcG9uc2l2ZS5wdXNoKHtcbiAgICAgICAgICAgICAgICBicmVha3BvaW50OiBDQ0wuQlJFQUtQT0lOVF9MRywgXG4gICAgICAgICAgICAgICAgc2V0dGluZ3M6IGRhdGEub3B0aW9uc0xnXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIGRhdGEub3B0aW9uc1hsICkge1xuICAgICAgICAgICAgb3B0aW9ucy5yZXNwb25zaXZlLnB1c2goe1xuICAgICAgICAgICAgICAgIGJyZWFrcG9pbnQ6IENDTC5CUkVBS1BPSU5UX1hMLCBcbiAgICAgICAgICAgICAgICBzZXR0aW5nczogZGF0YS5vcHRpb25zWGxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgb3B0aW9ucyA9ICQuZXh0ZW5kKCB0aGlzLmdsb2JhbERlZmF1bHRzLCBvcHRpb25zICk7XG5cbiAgICAgICAgdmFyIGNhcm91c2VsID0gdGhpcy4kZWwuc2xpY2sob3B0aW9ucyksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgY2Fyb3VzZWwub24oJ2JlZm9yZUNoYW5nZScsIGZ1bmN0aW9uKGV2ZW50LCBzbGljaywgY3VycmVudFNsaWRlLCBuZXh0U2xpZGUpe1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtcGFzdCcpO1xuICAgICAgICAgICAgX3RoaXMuJGVsLmZpbmQoJy5zbGljay1zbGlkZVtkYXRhLXNsaWNrLWluZGV4PVwiJytuZXh0U2xpZGUrJ1wiXScpLnByZXZBbGwoKS5hZGRDbGFzcygnY2NsLWlzLXBhc3QnKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1wcm9tby1jYXJvdXNlbCcpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBDYXJvdXNlbCh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIERyb3Bkb3duc1xuICogXG4gKiBJbml0aWFsaXplIGFuZCBjb250cm9sIGJlaGF2aW9yIGZvciBkcm9wZG93biBtZW51c1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgc2VsZWN0b3IgPSB7XG4gICAgICAgICAgICBUT0dHTEU6ICdbZGF0YS10b2dnbGU9XCJkcm9wZG93blwiXScsXG4gICAgICAgIH0sXG4gICAgICAgIGNsYXNzTmFtZSA9IHtcbiAgICAgICAgICAgIEFDVElWRTogJ2NjbC1pcy1hY3RpdmUnLFxuICAgICAgICAgICAgTUVOVTogJ2NjbC1jLWRyb3Bkb3duX19tZW51J1xuICAgICAgICB9O1xuXG4gICAgdmFyIERyb3Bkb3duVG9nZ2xlID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICB0aGlzLiR0b2dnbGUgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kcGFyZW50ID0gdGhpcy4kdG9nZ2xlLnBhcmVudCgpO1xuICAgICAgICBcbiAgICAgICAgdmFyIHRhcmdldCA9IHRoaXMuJHRvZ2dsZS5kYXRhKCd0YXJnZXQnKTtcblxuICAgICAgICB0aGlzLiRtZW51ID0gJCggdGFyZ2V0ICk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kdG9nZ2xlLmNsaWNrKCBmdW5jdGlvbihldmVudCl7XG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICBfdGhpcy50b2dnbGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJChkb2N1bWVudCkub24oICdjbGljaycsIGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgIHZhciBoYXNBY3RpdmVNZW51cyA9ICQoICcuJyArIGNsYXNzTmFtZS5NRU5VICsgJy4nICsgY2xhc3NOYW1lLkFDVElWRSApLmxlbmd0aDtcbiAgICAgICAgICAgIGlmICggaGFzQWN0aXZlTWVudXMgKXtcbiAgICAgICAgICAgICAgICBfY2xlYXJNZW51cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgIH07XG5cbiAgICBEcm9wZG93blRvZ2dsZS5wcm90b3R5cGUudG9nZ2xlID0gZnVuY3Rpb24oKXtcblxuICAgICAgICB2YXIgaXNBY3RpdmUgPSB0aGlzLiR0b2dnbGUuaGFzQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcblxuICAgICAgICBpZiAoIGlzQWN0aXZlICkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5zaG93TWVudSgpO1xuXG4gICAgfTtcblxuICAgIERyb3Bkb3duVG9nZ2xlLnByb3RvdHlwZS5zaG93TWVudSA9IGZ1bmN0aW9uKCl7XG4gICAgICAgIHRoaXMuJHRvZ2dsZS5hdHRyKCdhcmlhLWV4cGFuZGVkJywgJ3RydWUnKTtcbiAgICAgICAgdGhpcy4kbWVudS5hZGRDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQuYWRkQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgRHJvcGRvd25Ub2dnbGUucHJvdG90eXBlLmhpZGVNZW51ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdGhpcy4kdG9nZ2xlLmF0dHIoJ2FyaWEtZXhwYW5kZWQnLCAnZmFsc2UnKTtcbiAgICAgICAgdGhpcy4kbWVudS5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLkFDVElWRSApO1xuICAgICAgICB0aGlzLiRwYXJlbnQucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gX2NsZWFyTWVudXMoKSB7XG4gICAgICAgICQoJy5jY2wtYy1kcm9wZG93biwgLmNjbC1jLWRyb3Bkb3duX19tZW51JykucmVtb3ZlQ2xhc3MoIGNsYXNzTmFtZS5BQ1RJVkUgKTtcbiAgICAgICAgJCggc2VsZWN0b3IuVE9HR0xFICkuYXR0cignYXJpYS1leHBhbmRlZCcsICdmYWxzZScpO1xuICAgIH1cblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoIHNlbGVjdG9yLlRPR0dMRSApLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBEcm9wZG93blRvZ2dsZSh0aGlzKTtcbiAgICAgICAgfSk7XG4gICAgfSk7XG5cbn0gKSggdGhpcywgalF1ZXJ5ICk7XG4iLCIvKipcbiAqIE1vZGFsc1xuICogXG4gKiBCZWhhdmlvciBmb3IgbW9kYWxzLiBCYXNlZCBvbiBCb290c3RyYXAncyBtb2RhbHM6IGh0dHBzOi8vZ2V0Ym9vdHN0cmFwLmNvbS9kb2NzLzQuMC9jb21wb25lbnRzL21vZGFsL1xuICogXG4gKiBHbG9iYWxzOlxuICogU0NST0xMQkFSV0lEVEhcbiAqL1xuXG4oZnVuY3Rpb24gKHdpbmRvdywgJCkge1xuICAgICd1c2Ugc3RyaWN0JztcblxuICAgIHZhciBkb2N1bWVudCA9IHdpbmRvdy5kb2N1bWVudCxcbiAgICAgICAgRFVSQVRJT04gPSAzMDA7XG5cbiAgICB2YXIgTW9kYWxUb2dnbGUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIFxuICAgICAgICB2YXIgJGVsID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLiRlbCA9ICQoZWwpO1xuICAgICAgICB0aGlzLnRhcmdldCA9ICRlbC5kYXRhKCd0YXJnZXQnKTtcbiAgICAgICAgdGhpcy4kdGFyZ2V0ID0gJCh0aGlzLnRhcmdldCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpe1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7IFxuXG4gICAgICAgIF90aGlzLiRlbC5vbiggJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGlmICggJChkb2N1bWVudC5ib2R5KS5oYXNDbGFzcygnY2NsLW1vZGFsLW9wZW4nKSApIHtcbiAgICAgICAgICAgICAgICBfdGhpcy5jbG9zZU1vZGFsKCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIF90aGlzLnNob3dCYWNrZHJvcChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5zaG93TW9kYWwoKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgTW9kYWxUb2dnbGUucHJvdG90eXBlLnNob3dCYWNrZHJvcCA9IGZ1bmN0aW9uKGNhbGxiYWNrKXtcblxuICAgICAgICB2YXIgYmFja2Ryb3AgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICAgICAgdmFyICRiYWNrZHJvcCA9ICQoYmFja2Ryb3ApO1xuXG4gICAgICAgICRiYWNrZHJvcC5hZGRDbGFzcygnY2NsLWMtbW9kYWxfX2JhY2tkcm9wJyk7XG4gICAgICAgICRiYWNrZHJvcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcbiAgICAgICAgXG4gICAgICAgIENDTC5yZWZsb3coYmFja2Ryb3ApO1xuICAgICAgICBcbiAgICAgICAgJGJhY2tkcm9wLmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcblxuICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAuYWRkQ2xhc3MoJ2NjbC1tb2RhbC1vcGVuJylcbiAgICAgICAgICAgIC5jc3MoICdwYWRkaW5nLXJpZ2h0JywgQ0NMLlNDUk9MTEJBUldJRFRIICk7XG5cbiAgICAgICAgaWYgKCBjYWxsYmFjayApIHtcbiAgICAgICAgICAgIHNldFRpbWVvdXQoIGNhbGxiYWNrLCBEVVJBVElPTiApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5zaG93TW9kYWwgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICBfdGhpcy4kdGFyZ2V0LnNob3coIDAsIGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBfdGhpcy4kdGFyZ2V0LmFkZENsYXNzKCdjY2wtaXMtc2hvd24nKTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgIE1vZGFsVG9nZ2xlLnByb3RvdHlwZS5jbG9zZU1vZGFsID0gZnVuY3Rpb24oKXtcblxuICAgICAgICAkKCcuY2NsLWMtbW9kYWwnKS5yZW1vdmVDbGFzcygnY2NsLWlzLXNob3duJyk7XG5cbiAgICAgICAgc2V0VGltZW91dCggZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnLmNjbC1jLW1vZGFsJykuaGlkZSgpO1xuXG4gICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cbiAgICAgICAgICAgICAgICAkKCcuY2NsLWMtbW9kYWxfX2JhY2tkcm9wJykucmVtb3ZlKCk7XG5cbiAgICAgICAgICAgICAgICAkKGRvY3VtZW50LmJvZHkpXG4gICAgICAgICAgICAgICAgICAgIC5yZW1vdmVDbGFzcygnY2NsLW1vZGFsLW9wZW4nKVxuICAgICAgICAgICAgICAgICAgICAuY3NzKCAncGFkZGluZy1yaWdodCcsICcnICk7XG5cbiAgICAgICAgICAgIH0sIERVUkFUSU9OKTtcblxuICAgICAgICB9LCBEVVJBVElPTiApOyBcblxuICAgIH07XG5cblxuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwibW9kYWxcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgTW9kYWxUb2dnbGUodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59KSh0aGlzLCBqUXVlcnkpOyIsIi8qKlxuICogU3RpY2tpZXNcbiAqIFxuICogQmVoYXZpb3VyIGZvciBzdGlja3kgZWxlbWVudHMuXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICAkd2luZG93ID0gJCh3aW5kb3cpLFxuICAgICAgICBjbGFzc05hbWUgPSB7XG4gICAgICAgICAgICBpc0ZpeGVkOiAnY2NsLWlzLWZpeGVkJ1xuICAgICAgICB9O1xuXG4gICAgdmFyIFN0aWNreSA9IGZ1bmN0aW9uKGVsKXtcblxuICAgICAgICAvLyB2YXJpYWJsZXNcbiAgICAgICAgdmFyICRlbCA9ICQoZWwpLFxuICAgICAgICAgICAgaGVpZ2h0ID0gJGVsLm91dGVySGVpZ2h0KCksXG4gICAgICAgICAgICBvZmZzZXQgPSAkZWwub2Zmc2V0KCksXG4gICAgICAgICAgICBvcHRpb25zID0gJGVsLmRhdGEoJ3N0aWNreScpLFxuICAgICAgICAgICAgd3JhcHBlciA9ICQoJzxkaXYgY2xhc3M9XCJqcy1zdGlja3ktd3JhcHBlclwiPjwvZGl2PicpLmNzcyh7IGhlaWdodDogaGVpZ2h0ICsgJ3B4JyB9KTtcblxuICAgICAgICB2YXIgZGVmYXVsdE9wdGlvbnMgPSB7XG4gICAgICAgICAgICBvZmZzZXQ6IDBcbiAgICAgICAgfTtcblxuICAgICAgICBvcHRpb25zID0gJC5leHRlbmQoIGRlZmF1bHRPcHRpb25zLCBvcHRpb25zICk7XG5cbiAgICAgICAgLy8gd3JhcCBlbGVtZW50XG4gICAgICAgICRlbC53cmFwKCB3cmFwcGVyICk7XG5cbiAgICAgICAgLy8gc2Nyb2xsIGxpc3RlbmVyXG4gICAgICAgICR3aW5kb3cuc2Nyb2xsKCBDQ0wudGhyb3R0bGUoIF9vblNjcm9sbCwgMTAwICkgKTtcblxuICAgICAgICAvLyBvbiBzY3JvbGxcbiAgICAgICAgZnVuY3Rpb24gX29uU2Nyb2xsKCkge1xuICAgICAgICAgICAgXG4gICAgICAgICAgICB2YXIgc2Nyb2xsVG9wID0gJHdpbmRvdy5zY3JvbGxUb3AoKSArIG9wdGlvbnMub2Zmc2V0O1xuICAgIFxuICAgICAgICAgICAgaWYgKCBzY3JvbGxUb3AgPj0gb2Zmc2V0LnRvcCApIHtcbiAgICAgICAgICAgICAgICAkZWwuYWRkQ2xhc3MoIGNsYXNzTmFtZS5pc0ZpeGVkICk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICRlbC5yZW1vdmVDbGFzcyggY2xhc3NOYW1lLmlzRml4ZWQgKTtcbiAgICAgICAgICAgIH1cbiAgICBcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgfTtcblxuICAgICQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCl7XG4gICAgICAgICQoJy5qcy1pcy1zdGlja3knKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU3RpY2t5KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogVG9nZ2xlIFNjaG9vbHNcbiAqIFxuICogQmVoYXZpb3IgZm9yIHNjaG9vbCB0b2dnbGVzXG4gKi9cblxuKGZ1bmN0aW9uICh3aW5kb3csICQpIHtcbiAgICAndXNlIHN0cmljdCc7XG5cbiAgICB2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQsXG4gICAgICAgIGluaXRTY2hvb2wgPSAkKCdodG1sJykuZGF0YSgnc2Nob29sJyk7XG5cbiAgICB2YXIgU2Nob29sU2VsZWN0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBcbiAgICAgICAgdGhpcy4kc2VsZWN0ID0gJChlbCk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLmluaXQoKTtcbiAgICB9O1xuXG4gICAgU2Nob29sU2VsZWN0LnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIGlmICggaW5pdFNjaG9vbCApIHtcblxuICAgICAgICAgICAgdGhpcy4kc2VsZWN0XG4gICAgICAgICAgICAgICAgLmZpbmQoICdvcHRpb25bdmFsdWU9XCInICsgaW5pdFNjaG9vbCArICdcIl0nIClcbiAgICAgICAgICAgICAgICAuYXR0ciggJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyApOyAgIFxuXG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLiRzZWxlY3QuY2hhbmdlKGZ1bmN0aW9uKGV2ZW50KXtcbiAgICAgICAgICAgICQoJ2h0bWwnKS5hdHRyKCAgJ2RhdGEtc2Nob29sJywgZXZlbnQudGFyZ2V0LnZhbHVlICk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCdbZGF0YS10b2dnbGU9XCJzY2hvb2xcIl0nKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICBuZXcgU2Nob29sU2VsZWN0KHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSkodGhpcywgalF1ZXJ5KTsiLCIvKipcbiAqIFRvb2x0aXBzXG4gKiBcbiAqIEJlaGF2aW9yIGZvciB0b29sdGlwc1xuICovXG5cbiggZnVuY3Rpb24oIHdpbmRvdywgJCApIHtcblx0J3VzZSBzdHJpY3QnO1xuXHR2YXIgZG9jdW1lbnQgPSB3aW5kb3cuZG9jdW1lbnQ7XG5cbiAgICB2YXIgVG9vbHRpcCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy5jb250ZW50ID0gdGhpcy4kZWwuYXR0cigndGl0bGUnKTtcbiAgICAgICAgdGhpcy4kdG9vbHRpcCA9ICQoJzxkaXYgaWQ9XCJjY2wtY3VycmVudC10b29sdGlwXCIgY2xhc3M9XCJjY2wtYy10b29sdGlwIGNjbC1pcy10b3BcIiByb2xlPVwidG9vbHRpcFwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19hcnJvd1wiPjwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJjY2wtYy10b29sdGlwX19pbm5lclwiPicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY29udGVudCArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicrXG4gICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nKTtcbiAgICAgICAgXG4gICAgICAgIHRoaXMuaW5pdCgpO1xuICAgIH07XG5cbiAgICBUb29sdGlwLnByb3RvdHlwZS5pbml0ID0gZnVuY3Rpb24oKXtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuaG92ZXIoZnVuY3Rpb24oZSl7XG5cbiAgICAgICAgICAgIC8vIG1vdXNlb3ZlclxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCAnJyk7XG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cignYXJpYS1kZXNjcmliZWRieScsICdjY2wtY3VycmVudC10b29sdGlwJyk7XG4gICAgICAgICAgICBfdGhpcy4kdG9vbHRpcC5hcHBlbmRUbyhkb2N1bWVudC5ib2R5KTtcblxuICAgICAgICAgICAgQ0NMLnJlZmxvdyhfdGhpcy4kdG9vbHRpcFswXSk7XG5cbiAgICAgICAgICAgIHZhciBvZmZzZXQgPSBfdGhpcy4kZWwub2Zmc2V0KCksXG4gICAgICAgICAgICAgICAgd2lkdGggID0gX3RoaXMuJGVsLm91dGVyV2lkdGgoKSxcbiAgICAgICAgICAgICAgICB0b29sdGlwSGVpZ2h0ID0gX3RoaXMuJHRvb2x0aXAub3V0ZXJIZWlnaHQoKTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuY3NzKHtcbiAgICAgICAgICAgICAgICB0b3A6IChvZmZzZXQudG9wIC0gdG9vbHRpcEhlaWdodCkgKyAncHgnLFxuICAgICAgICAgICAgICAgIGxlZnQ6IChvZmZzZXQubGVmdCArICh3aWR0aC8yKSkgKyAncHgnXG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAuYWRkQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuXG4gICAgICAgIH0sIGZ1bmN0aW9uKGUpeyBcblxuICAgICAgICAgICAgLy9tb3VzZW91dFxuXG4gICAgICAgICAgICBfdGhpcy4kZWwuYXR0cigndGl0bGUnLCBfdGhpcy5jb250ZW50KTtcbiAgICAgICAgICAgIF90aGlzLiRlbC5hdHRyKCdhcmlhLWRlc2NyaWJlZGJ5JywgJycpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1zaG93bicpO1xuICAgICAgICAgICAgX3RoaXMuJHRvb2x0aXAucmVtb3ZlKCk7XG5cbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXScpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIG5ldyBUb29sdGlwKHRoaXMpO1xuICAgICAgICB9KTtcbiAgICB9KTtcblxufSApKCB0aGlzLCBqUXVlcnkgKTtcbiIsIi8qKlxuICogV2F5ZmluZGluZ1xuICogXG4gKiBDb250cm9scyBpbnRlcmZhY2UgZm9yIGxvb2tpbmcgdXAgY2FsbCBudW1iZXIgbG9jYXRpb25zXG4gKi9cblxuKCBmdW5jdGlvbiggd2luZG93LCAkICkge1xuXHQndXNlIHN0cmljdCc7XG4gICAgdmFyIGRvY3VtZW50ID0gd2luZG93LmRvY3VtZW50LFxuICAgICAgICB0YWJzLCB3YXlmaW5kZXI7XG4gICAgXG4gICAgdmFyIFRhYnMgPSBmdW5jdGlvbihlbCkge1xuXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwgPSAkKGVsKTtcbiAgICAgICAgdGhpcy4kdGFicyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy10YWInKTtcbiAgICAgICAgdGhpcy4kdGFiQ29udGVudHMgPSAkKCcuY2NsLWMtdGFiX19jb250ZW50Jyk7XG4gICAgICAgIFxuXG4gICAgICAgIHRoaXMuJHRhYnMuZWFjaChmdW5jdGlvbigpe1xuICAgICAgICAgICAgdmFyICR0YWIgPSAkKHRoaXMpO1xuICAgICAgICAgICAgJHRhYi5jbGljayhmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgdmFyIHRhcmdldCA9ICR0YWIuZGF0YSgndGFyZ2V0Jyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgLy8gX3RoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2V0QWN0aXZlKHRhcmdldCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIFRhYnMucHJvdG90eXBlLnNldEFjdGl2ZSA9IGZ1bmN0aW9uKHRhcmdldCl7XG4gICAgICAgIHRoaXMuJHRhYnMucmVtb3ZlQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcbiAgICAgICAgdGhpcy4kdGFicy5maWx0ZXIoJ1tocmVmPVwiJyt0YXJnZXQrJ1wiXScpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJHRhYkNvbnRlbnRzLmZpbHRlcih0YXJnZXQpLmFkZENsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIHZhciBXYXlmaW5kZXIgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIHRoaXMuJGVsID0gJChlbCk7XG4gICAgICAgIHRoaXMuY2FsbE51bWJlcnMgPSB7fTtcbiAgICAgICAgdGhpcy4kZm9ybSA9IHRoaXMuJGVsLmZpbmQoJyNjYWxsLW51bWJlci1zZWFyY2gnKTtcbiAgICAgICAgdGhpcy4kaW5wdXQgPSB0aGlzLiRlbC5maW5kKCcjY2FsbC1udW0taW5wdXQnKTtcbiAgICAgICAgdGhpcy4kc3VibWl0ID0gdGhpcy4kZWwuZmluZCgnI2NhbGwtbnVtLXN1Ym1pdCcpO1xuICAgICAgICB0aGlzLiRtYXJxdWVlID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fbWFycXVlZScpO1xuICAgICAgICB0aGlzLiRjYWxsTnVtID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fY2FsbC1udW0nKTtcbiAgICAgICAgdGhpcy4kd2luZyA9IHRoaXMuJGVsLmZpbmQoJy5jY2wtYy13YXlmaW5kZXJfX3dpbmcnKTtcbiAgICAgICAgdGhpcy4kZmxvb3IgPSB0aGlzLiRlbC5maW5kKCcuY2NsLWMtd2F5ZmluZGVyX19mbG9vcicpO1xuICAgICAgICB0aGlzLiRzdWJqZWN0ID0gdGhpcy4kZWwuZmluZCgnLmNjbC1jLXdheWZpbmRlcl9fc3ViamVjdCcpO1xuICAgICAgICB0aGlzLmVycm9yID0ge1xuICAgICAgICAgICAgZ2V0OiAnPGRpdiBjbGFzcz1cImNjbC1jLWFsZXJ0IGNjbC1pcy1lcnJvciBjY2wtd2F5ZmluZGVyX19lcnJvclwiPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2NsLWItY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJhbGVydFwiIGFyaWEtbGFiZWw9XCJDbG9zZVwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPsOXPC9zcGFuPjwvYnV0dG9uPjxpIGNsYXNzPVwiY2NsLWItaWNvbi1hbGVydFwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvaT4gVGhlcmUgd2FzIGFuIGVycm9yIGZldGNoaW5nIGNhbGwgbnVtYmVycy48L2Rpdj4nLFxuICAgICAgICAgICAgZmluZDogJzxkaXYgY2xhc3M9XCJjY2wtYy1hbGVydCBjY2wtaXMtZXJyb3IgY2NsLXdheWZpbmRlcl9fZXJyb3JcIj48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNjbC1iLWNsb3NlXCIgZGF0YS1kaXNtaXNzPVwiYWxlcnRcIiBhcmlhLWxhYmVsPVwiQ2xvc2VcIj48c3BhbiBhcmlhLWhpZGRlbj1cInRydWVcIj7Dlzwvc3Bhbj48L2J1dHRvbj48aSBjbGFzcz1cImNjbC1iLWljb24tYWxlcnRcIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L2k+IENvdWxkIG5vdCBmaW5kIHRoYXQgY2FsbCBudW1iZXIuIFBsZWFzZSB0cnkgYWdhaW4uPC9kaXY+J1xuICAgICAgICB9O1xuICAgICAgICB0aGlzLiRlcnJvckJveCA9ICQoJy5jY2wtZXJyb3ItYm94Jyk7XG5cbiAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAkLmdldEpTT04oIENDTC5hc3NldHMgKyAnanMvY2FsbC1udW1iZXJzLmpzb24nIClcbiAgICAgICAgICAgIC5kb25lKGZ1bmN0aW9uKGRhdGEpe1xuICAgICAgICAgICAgICAgIF90aGlzLmNhbGxOdW1iZXJzID0gZGF0YTtcbiAgICAgICAgICAgICAgICBfdGhpcy5pbml0KCk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICAgLmZhaWwoZnVuY3Rpb24oZXJyKXtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgICAgIHRoaXMuJGVycm9yQm94LmFwcGVuZCggdGhpcy5lcnJvci5nZXQgKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmluaXQgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgdGhpcy4kZWwuYWRkQ2xhc3MoJ2NjbC1hcHAtYWN0aXZlJyk7XG5cbiAgICAgICAgdGhpcy4kaW5wdXRcbiAgICAgICAgICAgIC5rZXl1cChmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgdmFyIHF1ZXJ5ID0gJCh0aGlzKS52YWwoKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBpZiAoIHF1ZXJ5ID09PSBcIlwiICkge1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy4kc3VibWl0LmF0dHIoJ2Rpc2FibGVkJywgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLiRtYXJxdWVlLmhpZGUoKTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMucmVzZXQoKTsgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuJHN1Ym1pdC5hdHRyKCdkaXNhYmxlZCcsIGZhbHNlKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgIHRoaXMuJGZvcm0uc3VibWl0KGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICB2YXIgcXVlcnkgPSBfdGhpcy4kaW5wdXQudmFsKCk7XG5cbiAgICAgICAgICAgICQoJy5jY2wtd2F5ZmluZGVyX19lcnJvcicpLnJlbW92ZSgpO1xuICAgICAgICAgICAgX3RoaXMuJG1hcnF1ZWUuc2hvdygpO1xuICAgICAgICAgICAgX3RoaXMuJGNhbGxOdW0udGV4dChxdWVyeSk7XG4gICAgICAgICAgICBfdGhpcy5maW5kUm9vbSggcXVlcnkgKTtcbiAgICAgICAgfSk7XG5cbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5nZXRDYWxsS2V5ID0gZnVuY3Rpb24oY2FsbE51bSkge1xuICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgY2FsbEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmNhbGxOdW1iZXJzKTtcblxuICAgICAgICBpZiAoIGNhbGxLZXlzLmxlbmd0aCA9PT0gMCApe1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgY2FsbEtleXMuZm9yRWFjaChmdW5jdGlvbihrKXtcbiAgICAgICAgICBpZiAoIGNhbGxOdW0gPj0gayApIHtcbiAgICAgICAgICAgIGtleSA9IGs7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICByZXR1cm4ga2V5O1xuICAgIH07XG5cbiAgICBXYXlmaW5kZXIucHJvdG90eXBlLmZpbmRSb29tID0gZnVuY3Rpb24ocXVlcnkpIHtcblxuICAgICAgICBxdWVyeSA9IHF1ZXJ5LnRvVXBwZXJDYXNlKCk7XG4gICAgICAgIFxuICAgICAgICB2YXIgY2FsbEtleSA9IHRoaXMuZ2V0Q2FsbEtleShxdWVyeSksXG4gICAgICAgICAgICBjYWxsRGF0YSA9IHt9LFxuICAgICAgICAgICAgcm9vbTtcblxuICAgICAgICBpZiAoICEgY2FsbEtleSApIHtcbiAgICAgICAgICAgIHRoaXMudGhyb3dGaW5kRXJyb3IoKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKCcuY2NsLWMtc2VhcmNoJykub2Zmc2V0KCkudG9wIH0pO1xuICAgICAgICBcbiAgICAgICAgY2FsbERhdGEgPSB0aGlzLmNhbGxOdW1iZXJzW2NhbGxLZXldO1xuXG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoIGNhbGxEYXRhLmZsb29yICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggY2FsbERhdGEud2luZyApO1xuICAgICAgICB0aGlzLiRzdWJqZWN0LnRleHQoIGNhbGxEYXRhLnN1YmplY3QgKTtcblxuICAgICAgICAvKiBUT0RPOlxuICAgICAgICAgKiBzZXQgQUNUVUFMIHJvb20sIG5vdCBqdXN0IHRoZSBmbG9vci4gc3RpbGwgd2FpdGluZyBvbiBjbGllbnQgXG4gICAgICAgICAqIHRvIHByb3ZpZGUgZGF0YSBmb3Igd2hpY2ggY2FsbCBudW1iZXJzIGJlbG9uZyB0byB3aGljaCByb29tc1xuICAgICAgICAgKiAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSAqL1xuXG4gICAgICAgIHJvb20gPSBjYWxsRGF0YS5mbG9vcl9pbnQ7XG5cbiAgICAgICAgLyogLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gKi9cblxuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWY9XCIjZmxvb3ItJytyb29tKydcIl0nKS5hZGRDbGFzcygnY2NsLWlzLWFjdGl2ZScpO1xuICAgICAgICB0aGlzLiRlbC5maW5kKCcjcm9vbS0nK3Jvb20rJy0xJykuYWRkQ2xhc3MoJ2NjbC1pcy1hY3RpdmUnKTtcblxuICAgICAgICB0YWJzLnNldEFjdGl2ZSggJyNmbG9vci0nICsgcm9vbSApO1xuICAgICAgICBcbiAgICB9O1xuXG4gICAgV2F5ZmluZGVyLnByb3RvdHlwZS5yZXNldCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgfTtcblxuICAgIFdheWZpbmRlci5wcm90b3R5cGUudGhyb3dGaW5kRXJyb3IgPSBmdW5jdGlvbigpe1xuICAgICAgICB0aGlzLiRlbC5maW5kKCdhW2hyZWYqPVwiI2Zsb29yLVwiXScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGVsLmZpbmQoJy5jY2wtYy1mbG9vcl9fcm9vbScpLnJlbW92ZUNsYXNzKCdjY2wtaXMtYWN0aXZlJyk7XG4gICAgICAgIHRoaXMuJGZsb29yLnRleHQoICcnICk7XG4gICAgICAgIHRoaXMuJHdpbmcudGV4dCggJycgKTtcbiAgICAgICAgdGhpcy4kc3ViamVjdC50ZXh0KCAnJyApO1xuICAgICAgICB0aGlzLiRlcnJvckJveC5hcHBlbmQoIHRoaXMuZXJyb3IuZmluZCApO1xuICAgIH07XG5cbiAgICAkKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpe1xuICAgICAgICAkKCcuY2NsLWpzLXRhYnMnKS5lYWNoKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICB0YWJzID0gbmV3IFRhYnModGhpcyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCcuY2NsLWpzLXdheWZpbmRlcicpLmVhY2goZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIHdheWZpbmRlciA9IG5ldyBXYXlmaW5kZXIodGhpcyk7XG4gICAgICAgIH0pO1xuICAgIH0pO1xuXG59ICkoIHRoaXMsIGpRdWVyeSApO1xuIl19
