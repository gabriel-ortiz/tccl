/**
 *
 * Third Party scripts
 * 
 * Custom JS for manipulating SpringShare pages
 */

( function( window, $ ) {
	'use strict';
	var document = window.document;

    var SpringShare = function(el){
        this.$el = $(el);
        this.init();
    };

    SpringShare.prototype.init = function(){
        //fire everything!
        this.updateBanner();
        this.getLibHours();
        this.prependHome();
    };
    
    SpringShare.prototype.updateBanner = function(){
        //this function updates the title of the page based on the breadcrumb of the page
        var _this = this;
        _this.$serviceBreadCrumb   = _this.$el.find( '.breadcrumb li:nth-of-type(2) a, .breadcrumb li:nth-of-type(2)' ).eq(0);
        _this.$bannerTitle       = _this.$el.find( '.ccl-c-libguide__title div' );
        
        if( _this.$serviceBreadCrumb.length ){
            
           _this.$serviceBreadCrumb = _this.$serviceBreadCrumb.text();

            $( _this.$bannerTitle ).text( _this.$serviceBreadCrumb );         
        }else{
            $( _this.$bannerTitle ).text( 'Library Services' );            
        }
        
    };
    
    SpringShare.prototype.getLibHours = function(){
        //this function updates the library hours with current days hours
        var _this = this;
        _this.$timeElement = _this.$el.find('.ccl-c-libguide__hours');
        
        
        $.ajax({
            url: 'https://api3.libcal.com/api_hours_today.php?iid=333&lid=4816&format=json&systemTime=1',
            dataType: 'jsonp',
            success: function(data){
                var renderedTime = data.locations[0].rendered;
                
                _this.$timeElement.text( renderedTime );
                
            },
            error: function(data){
                _this.$timeElement.text( 'Library Hours' );
            }
        });        
        
        
    };
    
    SpringShare.prototype.prependHome = function(){
        //this function preprends a cute little home icon to be beginning of the library breadcrumb
        var _this = this;
        _this.$libHome      = _this.$el.find( '#s-lib-bc-customer a, .breadcrumb li:first-of-type a' ).eq(0);
        _this.$libHomeText  = _this.$libHome.text();
        _this.homeIcon      = $('<span />').addClass('fa fa-home ccl-u-mr-nudge').attr('aria-hidden', true); 
        
        _this.$libHome.prepend( _this.homeIcon );
        
    };

    $(document).ready(function(){
        $('.s-la-page-public, .s-lg-guide-body, .s-lc-public, .s-lib-public-body').each( function(){
            new SpringShare(this);
        });
    });

} )( this, jQuery );

// ( function( window, $ ) {
// 	'use strict';
// 	var document = window.document;

//     var SpringShare = function(){
//         this.init();
//     };

//     SpringShare.prototype.init = function(){
//         // do something
//     };

//     $(document).ready(function(){
//         new SpringShare();
//     });

// } )( this, jQuery );