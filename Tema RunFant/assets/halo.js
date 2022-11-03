(function ($) {
    var body = $('body'),
        doc = $(document),
        html = $('html'),
        win = $(window),
        wrapperOverlaySlt = '.wrapper-overlay',
        iconNav,
        dropdownCart,
        miniProductList;
  
    var sidebarCart = $('#sidebar-cart'),
        btnRemove = sidebarCart.find('.btn-remove'),
        sidebarCartNoItems = sidebarCart.find('.cart-empty'),
        sidebarCartHasItems = sidebarCart.find('.mini-products-list'),
        sidebarCartFooter = sidebarCart.find('.cart-footer');

    var wishListsArr = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

    localStorage.setItem('items', JSON.stringify(wishListsArr));

    if (wishListsArr.length) {
        wishListsArr = JSON.parse(localStorage.getItem('items'));
    };

    doc.ready(function () {
        iconNav = $('[data-menu-mb-toogle]'),
        dropdownCart = $('#dropdown-cart'),
        miniProductList = dropdownCart.find('.mini-products-list');

        doc.ajaxStart(function () {
            ella.isAjaxLoading = true;
        });

        doc.ajaxStop(function () {
            ella.isAjaxLoading = false;
        });

        ella.init();

        doc
            .on('shopify:section:load', ella.initSlideshow)
            .on('shopify:section:unload', ella.initSlideshow)

            .on('shopify:section:load', ella.initSliderFeaturedProducts)
            .on('shopify:section:unload', ella.initSliderFeaturedProducts)

            .on('shopify:section:load', ella.initBrandsSlider)
            .on('shopify:section:unload', ella.initBrandsSlider)
    });

    var winWidth = win.innerWidth();

    win.off('resize.initMenuMobile').on('resize.initMenuMobile', function() {
        var resizeTimerId;

        clearTimeout(resizeTimerId);

        resizeTimerId = setTimeout(function() {
            var curWinWidth = win.innerWidth();

            if ((curWinWidth < 1200 && winWidth >= 1200) || (curWinWidth >= 1200 && winWidth < 1200)) {
                ella.showHideMenuMobile();
                ella.initToggleMuiltiLangCurrency();
                ella.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
                ella.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
                ella.initDropdownColFooter();
                ella.dropdownCart();
                ella.dropdownCustomer();

                ella.stickyFixedTopMenu();
            };
            winWidth = curWinWidth;
        }, 0);
    });

    win.on('resize', function () {
        ella.setActiveViewModeMediaQuery();
    });

    var ella = {
        ellaTimeout: null,
        isSidebarAjaxClick: false,
        isAjaxLoading: false,
        init: function () {
            this.closeHeaderTop();
            this.showHideMenuMobile();
            this.closeAllOnMobile();
            this.initToggleMuiltiLangCurrency();
            this.addTextMuiltiOptionActive($('#lang-switcher'), $('#lang-switcher [data-value].active'), $('[data-language-label]'));
            this.addTextMuiltiOptionActive($('#currencies'), $('#currencies [data-currency].active'), $('[data-currency-label]'));
            this.initDropdownColFooter();
            this.initScrollTop();
            this.dropdownCart();
            this.initColorSwatchGrid();
            this.initToggleSubMenuMobile();
            this.dropdownCustomer();
            this.initNewsLetterPopup();
            this.addEventShowOptions();
            this.changeQuantityAddToCart();
            this.initAddToCart();
            this.initGroupedAddToCart();
            this.initSliderFeaturedProducts();
            this.addEventLookbookModal();
            this.initPoliciesSlider();
            this.initCountdown();
            this.initCountdownNormal();

            if(body.hasClass('template-index') || body.hasClass('template-page')) {
                this.initSlideshow();
                this.initBrandsSlider();
            };

            if(body.hasClass('template-index')) {
                this.initInfiniteScrollingHomepage();
                this.clickedActiveProductTabs();
                this.initCollectionBannerSlider();
                this.initBlogPostSlider();
                this.handleScrollDown();
            }

            if(body.hasClass('template-collection') || body.hasClass('template-search')) {
                this.historyAdapter();
                this.initInfiniteScrolling();
                this.initPaginationPage();
            }

            if(body.hasClass('template-collection')) {
                this.filterToolbar();
                this.filterSidebar();
                this.toggleVariantsForExpressOrder();
                this.initExpressOrderAddToCart();
              	this.hide_filter();
            }

            this.initSidebar();
            this.initProductMoreview($('[data-more-view-product] .product-img-box'));
            
            this.initCustomerViewProductShop();
            this.initChangeQuantityButtonEvent();
            this.initQuantityInputChangeEvent();
            this.removeCartItem();
            this.initZoom();

            this.initQuickView();

            this.stickyFixedTopMenu();
            this.openSearchForm();

            if(body.hasClass('template-product') ) {
                this.initSoldOutProductShop();
                this.productPageInitProductTabs();
                this.changeSwatch('#add-to-cart-form .swatch :radio');
                this.initStickyForProductFullWidth();
                this.initStickyAddToCart();
                this.wrapTable();
                if($('.frequently-bought-together-block').length > 0){
                    this.initBundleProducts();
                }
            }
            if( body.hasClass('template-cart') ){
                this.checkBundleProducts();
            }
            this.initWishListIcons();
            this.doAddOrRemoveWishlish();

            if(body.hasClass('template-page') && $('.wishlist-page').length) {
                this.initWishLists();
            };
        },

        closeHeaderTop: function () {
            var headerTopEml = $('.header-top'),
                closeHeaderTopElm = headerTopEml.find('[data-close-header-top]');

            if (closeHeaderTopElm.length && closeHeaderTopElm.is(':visible')) {
                if ($.cookie('headerTop') == 'closed') {
                    headerTopEml.remove();
                };

                closeHeaderTopElm.off('click.closeHeaderTop').on('click.closeHeaderTop', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    headerTopEml.remove();
                    $.cookie('headerTop', 'closed', {
                        expires: 1,
                        path: '/'
                    });
                });
            };
        },

        showHideMenuMobile: function () {
            if (iconNav.length && iconNav.is(':visible')) {
                iconNav.off('click.showMenuMobile').on('click.showMenuMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.toggleClass('translate-overlay');
                    $('.close-menu-mb').toggleClass('menu-open');

                    $('.main-menu.jas-mb-style').css({
                        "overflow": ""
                    });
                    $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
                })
            };
        },

        closeAllOnMobile: function () {
            body.off('click.close', wrapperOverlaySlt).on('click.close', wrapperOverlaySlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.removeClass('translate-overlay cart-show customer-show sidebar-open options-show');
                $('.close-menu-mb').removeClass('menu-open');

                $('.main-menu.jas-mb-style').css({
                    "overflow": ""
                });
                $('.site-nav').find('[data-toggle-menu-mb]').parent().next('.sub-menu-mobile').removeClass('sub-menu-open');
            });
        },

        initToggleMuiltiLangCurrency: function () {
            var langCurrencyGroups = $('.lang-currency-groups'),
                dropdownGroup = langCurrencyGroups.find('.btn-group'),
                dropdownLabel = dropdownGroup.find('.dropdown-label');

            if (dropdownLabel.length && dropdownLabel.is(':visible')) {
                dropdownLabel.off('click.toggleMuiltiOption').on('click.toggleMuiltiOption', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    var selfNextDropdown = $(this).next();

                    if (!selfNextDropdown.is(':visible')) {
                        dropdownLabel.next('.dropdown-menu').hide();
                        selfNextDropdown.slideDown(300);
                    } else {
                        selfNextDropdown.slideUp(300);
                    }
                });

                ella.hideMuiltiLangCurrency();
            } else {
                dropdownLabel.next('.dropdown-menu').css({
                    'display': ''
                });
            };
        },

        hideMuiltiLangCurrency: function () {
            doc.off('click.hideMuiltiLangCurrency').on('click.hideMuiltiLangCurrency', function (e) {
                var muiltiDropdown = $('.lang-currency-groups .dropdown-menu');

                if (!muiltiDropdown.is(e.target) && !muiltiDropdown.has(e.target).length) {
                    muiltiDropdown.slideUp(300);
                }
            });
        },

        addTextMuiltiOptionActive: function (SltId, dataSlt, label) {
            if (label.length && label.is(':visible')) {
                var item = dataSlt.html();

                SltId.prev(label).html(item);
            };
        },

        initSlideshow: function () {
            var slickSlideshow = $('[data-init-slideshow]');

            if (slickSlideshow.length) {
                slickSlideshow.each(function () {
                    var self = $(this),
                        auto_playvideo = self.data('auto-video');

                    if(auto_playvideo) {
                        // POST commands to YouTube or Vimeo API
                        function postMessageToPlayer(player, command) {
                            if (player == null || command == null) return;
                            player.contentWindow.postMessage(JSON.stringify(command), "*");
                        }

                        // When the slide is changing
                        function playPauseVideo(slick, control) {
                            var currentSlide, player, video;

                            currentSlide = slick.find('.slick-current');
                            player = currentSlide.find("iframe").get(0);

                            if (currentSlide.hasClass('slide-youtube')) {
                                switch (control) {
                                    case "play":
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "mute"
                                        });
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "playVideo"
                                        });
                                        break;

                                    case "pause":
                                        postMessageToPlayer(player, {
                                            "event": "command",
                                            "func": "pauseVideo"
                                        });
                                        break;
                                }

                            } else if (currentSlide.hasClass('slide-video')) {
                                video = currentSlide.children("video").get(0);

                                if (video != null) {
                                    if (control === "play"){
                                        video.play();
                                    } else {
                                        video.pause();
                                    }
                                }
                            };
                        };

                        self.on('init', function(slick) {
                            slick = $(slick.currentTarget);

                            setTimeout(function(){
                                playPauseVideo(slick,"play");
                            }, 1000);
                        });

                        self.on("beforeChange", function(event, slick) {
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"pause");
                        });

                        self.on("afterChange", function(event, slick) {
                            slick = $(slick.$slider);
                            playPauseVideo(slick,"play");
                        });
                    };

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            dots: self.data('dots'),
                            slidesToScroll: 1,
                            verticalSwiping: false,
                            fade: self.data('fade'),
                            cssEase: "ease",
                            adaptiveHeight: true,
                            autoplay: self.data('autoplay'),
                            autoplaySpeed: self.data('autoplay-speed'),
                            nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "></polygon></g></g></g></svg></button>',
                            prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"></polygon></g></g></g></g></svg></button>',
                            responsive: [{
                                breakpoint: 1280,
                                settings: {
                                    arrows: false,
                                    dots: self.data('dots'),
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    arrows: false,
                                    dots: true
                                }
                            }
                            ]
                        });
                    };
                });
            };
        },

        initInfiniteScrollingHomepage: function () {
            var newArrivalsProduct = $('[data-new-arrivals-product]');

            newArrivalsProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    productsToShow = productGrid.data('products-to-show'),
                    showMorebtn = self.find('.infinite-scrolling-homepage a'),
                    noMoreText = window.inventory_text.no_more_product;

                if (productGrid.find('.grid-item:hidden').length) {
                    showMorebtn.off('click.showMoreProduct').on('click.showMoreProduct', function (e) {
                        e.preventDefault();

                        if (productGrid.find('.grid-item:hidden').length > 0) {
                            productGrid.find('.grid-item:hidden:lt(' + productsToShow + ')').each(function () {
                                $(this).show();
                            });

                            win.scroll();
                        };

                        if (!productGrid.find('.grid-item:hidden').length) {
                            if (window.multi_lang && translator.isLang2())
                                noMoreText = window.lang2.collections.general.no_more_product;
                            showMorebtn.html(noMoreText).addClass('disabled');
                        };

                    });
                } else {
                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;
                    showMorebtn.html(noMoreText).addClass('disabled');
                }
            });
        },

        initSliderFeaturedProducts: function () {
            var featuredProduct = $('[data-featured-products]');

            featuredProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row'),
                    hasRightSidebar = $('.halo-product-content .pro-page [data-has-right-sidebar]');

                if(productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        get slidesToShow() {
                            if (hasRightSidebar.length) {
                                return this.slidesToShow = 5;
                            } else {
                                return this.slidesToShow = productGrid.data('row');
                            }
                        },

                        get vertical() {
                            if(productGrid.hasClass('verticle')) {
                                return this.vertical = true;
                            }else {
                                return this.vertical = false;
                            }
                        },

                        get slidesToScroll() {
                            if(productGrid.hasClass('verticle')) {
                                return this.slidesToScroll = 1;
                            }else {
                                return this.slidesToScroll = productGrid.data('row');
                            }
                        },

                        speed: 1000,
                        infinite: false,

                        get dots() {
                            if(self.hasClass('has-banner')) {
                                return this.dots = true;
                            }else {
                                return this.dots = false;
                            };
                        },

                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [
                            {
                                breakpoint: 1400,
                                settings: {
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            if(gridItemWidth > 5) {
                                                return this.slidesToShow = 5;
                                            }
                                            else {
                                                return this.slidesToShow = productGrid.data('row');
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            if(productGrid.hasClass('verticle')) {
                                                return this.slidesToScroll = 1;
                                            }else {
                                                if(gridItemWidth >= 4) {
                                                    return this.slidesToScroll = 4;
                                                }else if(gridItemWidth = 3) {
                                                    return this.slidesToScroll = 3;
                                                }else {
                                                    return this.slidesToScroll = 2;
                                                }
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(self.hasClass('has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    vertical: false,
                                    get slidesToShow() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToShow = 3;
                                        }else {
                                            return this.slidesToShow = 2
                                        }
                                    },
                                    get slidesToScroll() {
                                        if(gridItemWidth >= 3) {
                                            return this.slidesToScroll = 3;
                                        }else {
                                            return this.slidesToScroll = 2
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    vertical: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                };
            });
        },

        initBrandsSlider: function () {
            this.brandsStyle1();
            this.brandsStyle2();
        },

        brandsStyle1: function() {
            var brandsSlider = $('[data-brands-slider]');

            brandsSlider.each(function () {
                var self = $(this);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: self.data('rows'),
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 4,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1,
                                }
                            }
                        ]
                    });
                }
            });
        },

        brandsStyle2: function() {
            var brandsSlider = $('[data-brands-slider-style2]');

            brandsSlider.each(function () {
                var self = $(this);

                if (self.not('.slick-initialized')) {
                    self.slick({
                        rows: 2,
                        slidesPerRow: self.data('rows'),
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        dots: false,
                        speed: 800,
                        arrows: false,
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesPerRow: 1,
                                    slidesToShow: 4,
                                    rows: 2,
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesPerRow: 1,
                                    slidesToShow: 3,
                                    rows: 2,
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesPerRow: 1,
                                    slidesToShow: 2,
                                    dots: true,
                                    rows: 2,
                                }
                            }
                        ]
                    });
                }
            });
        },

        initDropdownColFooter: function () {
            var footerTitle = $('.site-footer .dropdow-mb');

            if (window.innerWidth < 768) {
                if (footerTitle.length) {
                    footerTitle.off('click.slideToggle').on('click.slideToggle', function () {
                        $(this).next().slideToggle();
                        $(this).toggleClass('open');
                    });
                }
            } else {
                footerTitle.next().css({
                    "display": ""
                });
            }
        },

        initScrollTop: function () {
            var backToTop = $('#back-top');

            win.scroll(function () {
                if ($(this).scrollTop() > 220) {
                    backToTop.fadeIn(400);
                } else {
                    backToTop.fadeOut(400);
                };
            });

            backToTop.off('click.scrollTop').on('click.scrollTop', function (e) {
                e.preventDefault();
                e.stopPropagation();

                $('html, body').animate({
                    scrollTop: 0
                }, 400);
                return false;
            });
        },

        dropdownCustomer: function () {
            this.initDropdownCustomerTranslate($('[data-user-mobile-toggle]'), 'customer-show');

            if (window.innerWidth >= 1200) {
                this.initDropdownCustomerTranslate($('[data-user-pc-translate]'), 'customer-show');
            };

            this.closeDropdownCustomerTranslate();
            this.initDropdownCustomer();
        },

        initDropdownCustomerTranslate: function (iconUser, sltShowUser) {
            if (iconUser.length && iconUser.is(':visible')) {
                iconUser.off('click.dropdownCustomerMobile').on('click.dropdownCustomerMobile', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.addClass(sltShowUser);
                });
            };
        },

        closeTranslate: function (closeElm, classRemove) {
            if ($(closeElm).length) {
                body.off('click.closeCustomer', closeElm).on('click.closeCustomer', closeElm, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    html.removeClass(classRemove);
                });
            };
        },

        closeDropdownCustomerTranslate: function () {
            ella.closeTranslate('#dropdown-customer .close-customer', 'customer-show');
        },

        appendCustomerForPCHeaderDefault: function () {
            var customerLink = $('.header-default .header-panel-bt .customer-links'),
                dropdowCustomer = $('#dropdown-customer');

            if (window.innerWidth >= 1200) {
                dropdowCustomer.appendTo(customerLink);
            } else {
                dropdowCustomer.appendTo(body);
            }
        },

        doDropdownCustomerPCHeaderDefault: function () {
            var customerLoginLink = $('[data-dropdown-user]');

            if(window.innerWidth >= 1200) {
                customerLoginLink.off('click.toogleCustomer').on('click.toogleCustomer', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    $(this).siblings('#dropdown-customer').slideToggle();
                });

            }
        },

        initDropdownCustomer: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                this.appendCustomerForPCHeaderDefault();
                this.doDropdownCustomerPCHeaderDefault();
            }
        },

        dropdownCart: function () {
            this.closeDropdownCartTranslate();
            this.initDropdownCartMobile();
            this.initDropdownCartDesktop();
            this.checkItemsInDropdownCart();
            this.removeItemDropdownCart();
        },

        appendDropdownCartForMobile: function () {
            var wrapperTopCart = $('.wrapper-top-cart');

            if (window.innerWidth < 1200) {
                dropdownCart.appendTo(body);
            } else {
                dropdownCart.appendTo(wrapperTopCart);
            }
        },

        closeDropdownCartTranslate: function () {
            ella.closeTranslate('#dropdown-cart .close-cart', 'cart-show', '#reload_page');
        },

        initDropdownCartMobile: function () {
            var headerMb = $('.header-mb, [data-cart-header-parallax], [data-cart-header-02], [data-cart-header-04], [data-cart-header-supermarket]'),
                cartIcon = headerMb.find('[data-cart-toggle]');

            cartIcon.off('click.initDropdownCartMobile').on('click.initDropdownCartMobile', function (e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('cart-show');
            });
        },

        initDropdownCartDesktop: function () {
            var siteHeader = $('.site-header');

            if (siteHeader.hasClass('header-default')) {
                ella.appendDropdownCartForMobile();
                ella.initDropdownCartForHeaderDefault();
            }
        },

        addEventShowOptions: function() {
            var optionsIconSlt = '[data-show-options]';

            doc.off('click.showOptions', optionsIconSlt).on('click.showOptions', optionsIconSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.toggleClass('options-show');
            });

            ella.closeTranslate('.lang-currency-groups .close-option', 'options-show');
        },

        initDropdownCartForHeaderDefault: function () {
            var wrapperTopCart = $('.wrapper-top-cart'),
                cartIcon = wrapperTopCart.find('[data-cart-toggle]');

            if (cartIcon.length && cartIcon.is(':visible')) {
                if (window.dropdowncart_type == 'click') {
                    cartIcon.off('click.toogleDropdownCart').on('click.toogleDropdownCart', function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        wrapperTopCart.toggleClass('is-open');
                        dropdownCart.slideToggle();
                    });
                } else {
                    cartIcon.hover(function () {
                        var customer = $('#dropdown-customer');

                        if (customer.is(':visible')) {
                            customer.hide();
                        };

                        if (!wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.addClass('is-open');
                            dropdownCart.slideDown();
                        }
                    });

                    wrapperTopCart.mouseleave(function () {
                        if (wrapperTopCart.hasClass('is-open')) {
                            wrapperTopCart.removeClass('is-open');
                            dropdownCart.slideUp();
                        };
                    });
                }
            } else {
                dropdownCart.css("display", "");
            }
        },

        checkItemsInDropdownCart: function () {
            var cartNoItems = dropdownCart.find('.no-items'),
                cartHasItems = dropdownCart.find('.has-items');
          
            

            if (miniProductList.children().length) {
                cartHasItems.show();
                cartNoItems.hide();
              
                sidebarCartNoItems.hide();
                sidebarCartHasItems.show();
                sidebarCartFooter.show();
            } else {
                cartHasItems.hide();
                cartNoItems.show();
              
                sidebarCartNoItems.show();
                sidebarCartHasItems.hide();
                sidebarCartFooter.hide();
            };
        },

        removeItemDropdownCart: function (cart) {
            var btnRemove = dropdownCart.find('.btn-remove');

            btnRemove.off('click.removeCartItem').on('click.removeCartItem', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var productId = $(this).parents('.item').attr('id');
                productId = productId.match(/\d+/g);

                Shopify.removeItem(productId, function (cart) {
                    $("#cart-item-"+productId).remove();
                    $("#sidebar-cart-item-"+productId).remove();
                    ella.doUpdateDropdownCart(cart);
                    ella.checkBundleProducts();
                });
            });
        },

        updateDropdownCart: function () {
            Shopify.getCart(function (cart) {
                ella.doUpdateDropdownCart(cart);
            });
        },

        doUpdateDropdownCart: function (cart) {
            var template = '<li class="item" id="cart-item-{ID}"><a href="{URL}" title="{TITLE}" class="product-image"><img src="{IMAGE}" alt="{TITLE}"></a><div class="product-details"><a href="javascript:void(0)" title="Remove This Item" class="btn-remove"><svg aria-hidden="true" data-prefix="fal" data-icon="times" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg-inline--fa fa-times fa-w-10 fa-2x"><path fill="currentColor" d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z" class=""></path></svg></a><a class="product-name" href="{URL}">{TITLE}</a><div class="option"><small>{VARIANT}</small></div><div class="cart-collateral"><span class="qtt">{QUANTITY} X </span><span class="price">{PRICE}</span></div></div></li>';

            $('[data-cart-count]').text(cart.item_count);
            dropdownCart.find('.summary .price').html(Shopify.formatMoney(cart.total_price, window.money_format));
          	$('#sidebar-cart').find('.cart-footer .notranslate').html(Shopify.formatMoney(cart.total_price, window.money_format));

            miniProductList.html('');

            if (cart.item_count > 0) {
                for (var i = 0; i < cart.items.length; i++) {
                    var item = template;

                    item = item.replace(/\{ID\}/g, cart.items[i].id);
                    item = item.replace(/\{URL\}/g, cart.items[i].url);
                    item = item.replace(/\{TITLE\}/g, ella.translateText(cart.items[i].product_title));
                    item = item.replace(/\{VARIANT\}/g, cart.items[i].variant_title || '');
                    item = item.replace(/\{QUANTITY\}/g, cart.items[i].quantity);
                    item = item.replace(/\{IMAGE\}/g, Shopify.resizeImage(cart.items[i].image, '160x'));
                    item = item.replace(/\{PRICE\}/g, Shopify.formatMoney(cart.items[i].price, window.money_format));

                    miniProductList.append(item);
                }

                ella.removeItemDropdownCart(cart);

                if (ella.checkNeedToConvertCurrency()) {
                  	Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#sidebar-cart span.money', 'money_format');
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '#dropdown-cart span.money', 'money_format');
                }
            }

            ella.checkItemsInDropdownCart();
        },

        translateText: function (str) {
            if (!window.multi_lang || str.indexOf("|") < 0)
                return str;

            if (window.multi_lang) {
                var textArr = str.split("|");

                if (translator.isLang2())
                    return textArr[1];
                return textArr[0];
            };
        },

        checkNeedToConvertCurrency: function () {
            return (window.show_multiple_currencies && Currency.currentCurrency != shopCurrency) || window.show_auto_currency;
        },

        initColorSwatchGrid: function () {
            var itemSwatchSlt = '.item-swatch li label';

            body.off('click.toggleClass').on('click.toggleClass', itemSwatchSlt, function () {
                var self = $(this),
                    productItemElm = self.closest('.grid-item'),
                    sidebarWidgetProduct = productItemElm.closest('.sidebar-widget-product');

                $('.item-swatch li label').removeClass('active');
                self.addClass('active');

                var newImage = self.data('img');

                if (sidebarWidgetProduct.length) {
                    newImage = newImage.replace('800x', 'large');
                }

                if (newImage) {
                    productItemElm.find('.product-grid-image .images-one').attr({
                        src: newImage,
                        "data-src": newImage
                    });

                    return false;
                }
            });
        },

        showLoading: function () {
            $('.loading-modal').show();
        },

        hideLoading: function () {
            $('.loading-modal').hide();
        },

        showModal: function (selector) {
            $(selector).fadeIn(500);

            ella.ellaTimeout = setTimeout(function () {
                $(selector).fadeOut(500);
            }, 5000);
        },

        translateBlock: function (blockSelector) {
            if (window.multi_lang && translator.isLang2()) {
                translator.doTranslate(blockSelector);
            }
        },

        closeLookbookModal: function () {
            $('.ajax-lookbook-modal').fadeOut(500);
        },

        addEventLookbookModal: function () {
            body.off('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]').on('click.addEvenLookbookModal touchstart.addEvenLookbookModal', '[data-lookbook-icon]', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var handle = $(this).data('handle'),
                    position = $(this);

                ella.doAjaxAddLookbookModal(handle, position);

                doc.off('click.closeLookbookModal').on('click.closeLookbookModal', '[data-close-lookbook-modal], .ajax-lookbook-modal .overlay', function () {
                    ella.closeLookbookModal();
                    return false;
                });
            });
        },

        doAjaxAddLookbookModal: function (handle, position) {
            var offSet = $(position).offset(),
                top = offSet.top,
                left = offSet.left,
                iconWidth = position.innerWidth(),
                innerLookbookModal = $('.ajax-lookbook-modal').innerWidth(),
                str3 = iconWidth + "px",
                str4 = innerLookbookModal + "px",
                newtop,
                newleft;

            if (window.innerWidth > 767) {
                if (left > (innerLookbookModal + 31)) {
                    newleft = "calc(" + left + "px" + " - " + str4 + " + " + "2px" + ")";
                } else {
                    newleft = "calc(" + left + "px" + " + " + str3 + " - " + "2px" + ")";
                }

                newtop = top - (innerLookbookModal / 2) + "px";
            } else {
                newleft = 0;
                newtop = top - 30 + "px";
            };

            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: '/products/' + handle + '?view=json',

                success: function (data) {
                    $('.ajax-lookbook-modal').css({
                        'left': newleft,
                        'top': newtop
                    });

                    $('.ajax-lookbook-modal .lookbook-content').html(data);

                    ella.translateBlock('.lookbook-content');
                    $('.ajax-lookbook-modal').fadeIn(500);
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);

                    ella.showModal('.ajax-error-modal');
                }
            });
        },

        clickedActiveProductTabs: function () {
            var productTabsSection = $('[data-home-product-tabs]');

            productTabsSection.each(function () {
                var self = $(this),
                    listTabs = self.find('.list-product-tabs'),
                    tabLink = listTabs.find('[data-product-tabTop]'),
                    tabContent = self.find('[data-product-TabContent]');

                var linkActive = self.find('.list-product-tabs .tab-links.active'),
                    activeTab = self.find('.product-tabs-content .tab-content.active');

                ella.doAjaxProductTabs(linkActive.data('href'), activeTab.find('.loading'), activeTab.find('.products-grid'));

                tabLink.off('click').on('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if($(this).hasClass('active')) {
                        return;
                    }

                    if (!$(this).hasClass('active')) {
                        var curTab = $(this),
                            curTabContent = $(curTab.data('target'));

                        tabLink.removeClass('active');
                        tabContent.removeClass('active');

                        if (!curTabContent.find('.products-grid').hasClass('slick-initialized')) {
                            ella.doAjaxProductTabs(curTab.data('href'), curTabContent.find('.loading'), curTabContent.find('.products-grid'));
                        }

                        curTab.addClass('active');
                        curTabContent.addClass('active');
                    };
                });
            });
        },

        doAjaxProductTabs: function (handle, loadingElm, curTabContent) {
            // if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: handle,

                beforeSend: function () {
                    loadingElm.text('Loading ... please wait ...');
                },

                success: function (data) {
                    loadingElm.hide();

                    if (handle == '/collections/?view=json') {
                        loadingElm.text('Please link to collections').show();
                    } else {
                        curTabContent.html($(data).find('.grid-items').html());

                        if (!curTabContent.hasClass('slick-initialized')) {
                            ella.initProductTabsSlider(curTabContent.parent());
                        };

                        if (ella.checkNeedToConvertCurrency()) {
                            Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                        };

                        ella.translateBlock('[data-home-product-tabs]');
                        ella.initColorSwatchGrid();
                        ella.initWishListIcons();

                        ella.ellaTimeout = setTimeout(function () {
                            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                            };
                        }, 1000);
                    };
                },

                error: function (xhr, text) {
                    loadingElm.text('Sorry, there are no products in this collection').show();
                }
            });
        },

        initProductTabsSlider: function (slt) {
            slt.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid'),
                    gridItemWidth = productGrid.data('row');

                if (productGrid.not('.slick-initialized') && productGrid.find('.grid-item').length) {
                    productGrid.slick({
                        slidesToShow: productGrid.data('row'),
                        slidesToScroll: productGrid.data('row'),
                        dots: false,
                        infinite: false,
                        speed: 1000,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [
                            {
                                breakpoint: 1200,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToShow = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToShow = 3
                                            }else {
                                                return this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 4) {
                                                return this.slidesToScroll = 4;
                                            }else if(gridItemWidth = 3) {
                                                return this.slidesToScroll = 3
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    dots: true,
                                    arrows: false,
                                    get slidesToShow() {
                                        if(self.hasClass('sections-has-banner')) {
                                            return this.slidesToShow = 2;
                                        }else {
                                            if (gridItemWidth >= 3) {
                                                return this.slidesToShow = 3;
                                            } else {
                                                this.slidesToShow = 2
                                            }
                                        }
                                    },
                                    get slidesToScroll() {
                                        if (self.hasClass('sections-has-banner')) {
                                            return this.slidesToScroll = 2;
                                        }else {
                                            if(gridItemWidth >= 3) {
                                                return this.slidesToScroll = 3;
                                            }else {
                                                return this.slidesToScroll = 2
                                            }
                                        };
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2,
                                    arrows: false,
                                    dots: true
                                }
                            }
                        ]
                    });
                }
            });
        },

        initBlogPostSlider: function() {
            var blogBlock = $('[data-blogs-slider]');

            blogBlock.each(function() {
                var self = $(this),
                    rows = self.data('rows');

                if(self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: rows,
                        slidesToScroll: 1,
                        dots: true,
                        speed: 800,
                        autoplay: true,
                        arrows: false,
                        responsive: [
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToScroll: 2,
                                    slidesToShow: 2
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToScroll: 1,
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                };
            });
        },

        initPoliciesSlider: function () {
            var policyBlock = $('[data-policies-slider]');

            policyBlock.each(function () {
                var self = $(this),
                    rows = self.data('row');

                if (self.not('.slick-initialized')) {
                    self.slick({
                        slidesToShow: rows,
                        slidesToScroll: 1,
                        autoplay: true,
                        dots: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [{
                                breakpoint: 1200,
                                settings: {
                                    slidesToScroll: 1,
                                    get slidesToShow() {
                                        if (rows >= 3) {
                                            return this.slidesToShow = 3;
                                        } else if (rows == 2) {
                                            this.slidesToShow = 2
                                        } else {
                                            this.slidesToShow = 1
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 992,
                                settings: {
                                    slidesToScroll: 1,
                                    get slidesToShow() {
                                        if (rows >= 2) {
                                            return this.slidesToShow = 2;
                                        } else {
                                            this.slidesToShow = 1
                                        }
                                    }
                                }
                            },
                            {
                                breakpoint: 768,
                                settings: {
                                    slidesToScroll: 1,
                                    slidesToShow: 1
                                }
                            }
                        ]
                    });
                }
            });
        },

        initCollectionBannerSlider: function () {
            var collectionSlider = $('[data-home-collections-slider]');

            if (window.innerWidth >= 1200) {
                collectionSlider.each(function () {
                    var self = $(this),
                        rows = self.data('rows');

                    if (self.not('.slick-initialized')) {
                        self.slick({
                            slidesToShow: rows,
                            slidesToScroll: rows,
                            infinite: false,
                            speed: 1000,
                            nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                            prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                            responsive: [{
                                breakpoint: 1200,
                                settings: "unslick"
                            }]
                        });
                    }
                });
            };
        },

        initCountdown: function () {
            var countdownElm = $('[data-countdown]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                self.countdown(countdownValue, function (event) {
                    $(this).html(event.strftime('' +
                        '<div class="clock-item"><span class="num">%D</span><span>days</span></div>' +
                        '<div class="clock-item"><span class="num">%H</span><span>hours</span></div>' +
                        '<div class="clock-item"><span class="num">%M</span><span>mins</span></div>' +
                        '<div class="clock-item"><span class="num">%S</span><span>secs</span></div>'));
                });
            });
        },

        initCountdownNormal: function () {
            var countdownElm = $('[data-countdown-normal]');

            countdownElm.each(function () {
                var self = $(this),
                    countdownValue = self.data('countdown-value');

                if(self.hasClass('countdown-suppermarket')) {
                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>d</span></div>' +
                            '<div class="clock-item"><span class="num">%H</span>&nbsp;:</div>' +
                            '<div class="clock-item"><span class="num">%M</span>&nbsp;:</div>' +
                            '<div class="clock-item"><span class="num">%S</span></div>'));
                    });
                } else {
                    self.countdown(countdownValue, function (event) {
                        $(this).html(event.strftime('' +
                            '<div class="clock-item"><span class="num">%D</span><span>D</span>:</div>' +
                            '<div class="clock-item"><span class="num">%H</span><span>H</span>:</div>' +
                            '<div class="clock-item"><span class="num">%M</span><span>M</span>:</div>' +
                            '<div class="clock-item"><span class="num">%S</span><span>S</span></div>'));
                    });
                }
            });
        },

        initToggleSubMenuMobile: function () {
            var mainMenu = $('.main-menu.jas-mb-style'),
                siteNav = $('.site-nav'),
                iconDropdown = siteNav.find('[data-toggle-menu-mb]');

            iconDropdown.off('click.dropdownMenu').on('click.dropdownMenu', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curParent = $(this).parent(),
                    curMenu = curParent.next('.sub-menu-mobile');

                if (curMenu.hasClass('sub-menu-open')) {
                    curMenu.removeClass('sub-menu-open');
                } else {
                    curMenu.addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                };
            });

            ella.linkClickToggleSubMenuMobile(mainMenu);
        },

        linkClickToggleSubMenuMobile: function (mainMenu) {
            var menuMobile = $('.site-nav .dropdown'),
                iconDropdown = menuMobile.find('[data-toggle-menu-mb]'),
                menuMobileLabel = $('.sub-menu-mobile .menu-mb-title');

            if (iconDropdown.length && iconDropdown.is(':visible')) {
                menuMobile.off('click.current').on('click.current', function (e) {
                    e.stopPropagation();

                    $(this).children('.sub-menu-mobile').addClass('sub-menu-open').css({
                        "overflow": ""
                    });
                    mainMenu.animate({
                        scrollTop: 0
                    }, 0);
                    mainMenu.css({
                        "overflow": "hidden"
                    });
                });

                menuMobile.find('.menu__moblie').on('click', function (e) {
                    e.stopPropagation();
                });

                menuMobileLabel.off('click.closeMenu').on('click.closeMenu', function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if($(this).parent().hasClass('bg')) {
                        $(this).parent().parent().removeClass('sub-menu-open');
                    }else {
                        $(this).parent().removeClass('sub-menu-open');
                    };

                    if (!$(this).closest('.menu-lv-2').length) {
                        mainMenu.css({
                            "overflow": ""
                        });
                    };
                })
            };
        },

        openEmailModalWindow: function (newsletterWrapper) {
            newsletterWrapper.fadeIn(1000);
        },

        closeEmailModalWindow: function (newsletterWrapper,expire) {
            newsletterWrapper.fadeOut(1000);
            var inputChecked = newsletterWrapper.find('input[name="dismiss"]').prop('checked');
            if (inputChecked || !newsletterWrapper.find('input[name="dismiss"]').length)
                $.cookie('emailSubcribeModal', 'closed', {
                    expires: expire,
                    path: '/'
                });
        },

        initNewsLetterPopup: function () {
            if (window.newsletter_popup) {
                var newsletterWrapper = $('[data-newsletter]'),
                    closeWindow = newsletterWrapper.find('.close-window'),
                    delay = newsletterWrapper.data('delay'),
                    expire = newsletterWrapper.data('expire'),
                    modalContent = newsletterWrapper.find('.halo-modal-content');

                if ($.cookie('emailSubcribeModal') != 'closed') {
                    ella.ellaTimeout = setTimeout(function () {
                        ella.openEmailModalWindow(newsletterWrapper);
                    }, delay);
                };

                closeWindow.click(function (e) {
                    e.preventDefault();

                    ella.closeEmailModalWindow(newsletterWrapper,expire);
                });

                newsletterWrapper.on('click', function (e) {
                    if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                        ella.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });

                $('#mc_embed_signup form').submit(function () {
                    if ($('#mc_embed_signup .email').val() != '') {
                        ella.closeEmailModalWindow(newsletterWrapper,expire);
                    };
                });
            };
        },

        initSidebarProductSlider: function () {
            var sidebarWidgetProduct = $('[data-sidebar-product]');

            sidebarWidgetProduct.each(function () {
                var self = $(this),
                    productGrid = self.find('.products-grid');

                if (productGrid.not('.slick-initialized')) {
                    productGrid.slick({
                        slidesToShow: 1,
                        slidesToScroll: 1,
                        infinite: false,
                        dots: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>'
                    });
                }
            });
        },

        initOpenSidebar: function () {
            var sidebarLabelSlt = '.sidebar-label',
                sidebarLabelElm = $(sidebarLabelSlt);

            if (sidebarLabelElm.length) {
                body.off('click.openSidebar').on('click.openSidebar', sidebarLabelSlt, function () {
                    html.addClass('sidebar-open');
                })
            }
        },

        closeSidebar: function () {
            ella.closeTranslate('.sidebar .close-sidebar', 'sidebar-open');
        },

        initSidebar: function () {
            this.initSidebarProductSlider();
            this.initOpenSidebar();
            this.closeSidebar();
            this.initDropdownSubCategoriesAtSidebar();
            this.initToggleWidgetTitleSidebarFilter();
        },

        initDropdownSubCategoriesAtSidebar: function () {
            var iconDropdownSlt = '.sidebar-links li.dropdown';
            var linkDropdownSlt = '.sidebar-links li.dropdown a';

            body.off('click.toggleSubCategories').on('click.toggleSubCategories', iconDropdownSlt, function (e) {
                e.stopPropagation();

                var self = $(this),
                    dropdown = self.find('> .dropdown-cat');

                if (self.hasClass('open')) {
                    self.removeClass('open');
                    dropdown.slideUp();
                } else {
                    self.addClass('open');
                    dropdown.slideDown();
                };
            })

            body.off('click.linktoCollection').on('click.linktoCollection', linkDropdownSlt, function (e) {
                e.stopPropagation();
            })
        },

        historyAdapter: function () {
            var collTpl = $('[data-section-type="collection-template"]');

            if (collTpl.length) {
                History.Adapter.bind(window, 'statechange', function () {
                    var State = History.getState();

                    if (!ella.isSidebarAjaxClick) {
                        ella.queryParams();

                        var newurl = ella.ajaxCreateUrl();

                        ella.doAjaxToolbarGetContent(newurl);
                        ella.doAjaxSidebarGetContent(newurl);
                    }

                    ella.isSidebarAjaxClick = false;
                });
            };
        },

        queryParams: function () {
            Shopify.queryParams = {};

            if (location.search.length) {
                for (var aKeyValue, i = 0, aCouples = location.search.substr(1).split('&'); i < aCouples.length; i++) {
                    aKeyValue = aCouples[i].split('=');

                    if (aKeyValue.length > 1) {
                        Shopify.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
                    }
                }
            };
        },

        filterAjaxClick: function (baseLink) {
            delete Shopify.queryParams.page;

            var newurl = ella.ajaxCreateUrl(baseLink);

            ella.isSidebarAjaxClick = true;

            History.pushState({
                param: Shopify.queryParams
            }, newurl, newurl);
        },

        ajaxCreateUrl: function (baseLink) {
            var newQuery = $.param(Shopify.queryParams).replace(/%2B/g, '+');

            if (baseLink) {
                if (newQuery != "")
                    return baseLink + "?" + newQuery;
                else
                    return baseLink;
            }
            return location.pathname + "?" + newQuery;
        },

        filterToolbar: function () {
            this.queryParams();
            this.setTextForSortbyFilter();
            this.setTextForLimitedFilter();
            this.ajaxFilterSortby();
            this.ajaxFilterLimit();
            this.addEventViewModeLayout();
        },

        setTextForSortbyFilter: function () {
            var filterSortby = $('[data-sortby]'),
                labelTab = filterSortby.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                sortbyLinkActive = labelTab.next().find('li.active'),
                text = sortbyLinkActive.text();

            labelText.text(text);

            if (Shopify.queryParams.sort_by) {
                var sortBy = Shopify.queryParams.sort_by,
                    sortByLinkActive = filterSortby.find('span[data-href="' + sortBy + '"]'),
                    sortByText = sortByLinkActive.text();

                labelText.text(sortByText);
                labelTab.next().find('li').removeClass('active');
                sortByLinkActive.parent().addClass('active');
            };
        },

        setTextForLimitedFilter: function () {
            var filterLimited = $('[data-limited-view]'),
                labelTab = filterLimited.find('.label-tab'),
                labelText = labelTab.find('.label-text'),
                limitedLinkActive = labelTab.next().find('li.active'),
                text = limitedLinkActive.text();

            labelText.text(text);

            if (filterLimited.length) {
                var limited = filterLimited.find('li.active span').data('value'),
                    limitedActive = filterLimited.find('span[data-value="' + limited + '"]'),
                    limitedText = limitedActive.text();

                labelText.text(limitedText);
                labelTab.next().find('li').removeClass('active');
                limitedActive.parent().addClass('active');
            };
        },

        ajaxFilterSortby: function () {
            var sortbyFilterSlt = '[data-sortby] li span',
                sortbyFilter = $(sortbyFilterSlt);

            body.off('click.sortBy', sortbyFilterSlt).on('click.sortBy', sortbyFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    Shopify.queryParams.sort_by = $(this).attr('data-href');

                    ella.filterAjaxClick();

                    var newurl = ella.ajaxCreateUrl();

                    ella.doAjaxToolbarGetContent(newurl);
                };

                sortbyFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        ajaxFilterLimit: function () {
            var limitFilterSlt = '[data-limited-view] li span',
                limitFilter = $(limitFilterSlt);

            body.off('click.sortBy', limitFilterSlt).on('click.sortBy', limitFilterSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    parent = self.parent();

                if (!parent.hasClass('active')) {
                    var dataValue = self.data('value'),
                        value = "" + dataValue + "";

                    $('[data-limited-view] .label-tab .label-text').text(value);

                    ella.doAjaxLimitGetContent(value);
                };

                limitFilter.closest('.dropdown-menu').prev().trigger('click');
            });
        },

        doAjaxLimitGetContent: function (value) {
            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "Post",
                url: '/cart.js',
                data: {
                    "attributes[pagination]": value
                },

                success: function (data) {
                    window.location.reload();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },
                dataType: 'json'
            });
        },

        doAjaxToolbarGetContent: function (newurl) {
            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    ella.showLoading();
                },

                success: function (data) {
                    ella.ajaxMapData(data);
                    ella.initColorSwatchGrid();
                    ella.setTextForSortbyFilter();

                    ella.initSidebarProductSlider();
                    ella.initCountdownNormal();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        filterSidebar: function () {
            this.queryParams();
            this.ajaxFilterTags();
            this.ajaxFilterClearTags();
            this.ajaxFilterClearAll();
        },

        ajaxFilterTags: function () {
            body.off('click.filterTags').on('click.filterTags', '.sidebar-tags .list-tags a, .sidebar-tags .list-tags label, .refined .selected-tag', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var newTags = [];

                if (Shopify.queryParams.constraint) {
                    newTags = Shopify.queryParams.constraint.split('+');
                };

                //one selection or multi selection
                if (!window.enable_sidebar_multiple_choice && !$(this).prev().is(':checked')) {
                    //remove other selection first
                    var otherTag = $(this).closest('.sidebar-tags, .refined-widgets').find('input:checked');

                    if (otherTag.length) {
                        var tagName = otherTag.val();

                        if (tagName) {
                            var tagPos = newTags.indexOf(tagName);

                            if (tagPos >= 0) {
                                //remove tag
                                newTags.splice(tagPos, 1);
                            }
                        }
                    };
                };

                var tagName = $(this).prev().val();

                if (tagName) {
                    var tagPos = newTags.indexOf(tagName);

                    if (tagPos >= 0) {
                        newTags.splice(tagPos, 1);
                    } else {
                        newTags.push(tagName);
                    };
                };

                if (newTags.length) {
                    Shopify.queryParams.constraint = newTags.join('+');
                } else {
                    delete Shopify.queryParams.constraint;
                };

                ella.filterAjaxClick();

                var newurl = ella.ajaxCreateUrl();

                ella.doAjaxSidebarGetContent(newurl);
            });
        },

        ajaxFilterClearTags: function () {
            var sidebarTag = $('.sidebar-tags');

            sidebarTag.each(function () {
                var sidebarTag = $(this);

                if (sidebarTag.find('input:checked').length) {
                    //has active tag
                    sidebarTag.find('.clear').show().click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();

                        var currentTags = [];

                        if (Shopify.queryParams.constraint) {
                            currentTags = Shopify.queryParams.constraint.split('+');
                        };

                        sidebarTag.find("input:checked").each(function () {
                            var selectedTag = $(this);
                            var tagName = selectedTag.val();

                            if (tagName) {
                                var tagPos = currentTags.indexOf(tagName);
                                if (tagPos >= 0) {
                                    //remove tag
                                    currentTags.splice(tagPos, 1);
                                };
                            };
                        });

                        if (currentTags.length) {
                            Shopify.queryParams.constraint = currentTags.join('+');
                        } else {
                            delete Shopify.queryParams.constraint;
                        };

                        ella.filterAjaxClick();

                        var newurl = ella.ajaxCreateUrl();

                        ella.doAjaxSidebarGetContent(newurl);
                    });
                }
            });
        },

        ajaxFilterClearAll: function () {
            var clearAllSlt = '.refined-widgets a.clear-all';
            var clearAllElm = $(clearAllSlt);

            body.off('click.clearAllTags', clearAllSlt).on('click.clearAllTags', clearAllSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                delete Shopify.queryParams.constraint;

                ella.filterAjaxClick();

                var newurl = ella.ajaxCreateUrl();

                ella.doAjaxSidebarGetContent(newurl);
            });
        },

        doAjaxSidebarGetContent: function (newurl) {
            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: newurl,

                beforeSend: function () {
                    ella.showLoading();
                },

                success: function (data) {
                    ella.ajaxMapData(data);
                    ella.initColorSwatchGrid();
                    ella.ajaxFilterClearTags();

                    ella.initSidebarProductSlider();
                    ella.initCountdownNormal();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        ajaxMapData: function (data) {
            var curCollTemplate = $('.collection-template'),
                curBreadcrumb = curCollTemplate.find('.breadcrumb'),
                curSidebar = curCollTemplate.find('.sidebar'),
                curCollHeader = curCollTemplate.find('.collection-header'),
                curProColl = curCollTemplate.find('.product-collection'),
                curPadding = curCollTemplate.find('.padding'),

                newCollTemplate = $(data).find('.collection-template'),
                newBreadcrumb = newCollTemplate.find('.breadcrumb'),
                newSidebar = newCollTemplate.find('.sidebar'),
                newCollHeader = newCollTemplate.find('.collection-header'),
                newProColl = newCollTemplate.find('.product-collection'),
                newPadding = newCollTemplate.find('.padding');

            curBreadcrumb.replaceWith(newBreadcrumb);
            curSidebar.replaceWith(newSidebar);
            curCollHeader.replaceWith(newCollHeader);
            curProColl.replaceWith(newProColl);

            if (curPadding.length > 0) {
                curPadding.replaceWith(newPadding);
            } else {
                if(curCollTemplate.find('.col-main').length) {
                    curCollTemplate.find('.col-main').append(newPadding);
                } else {
                    curCollTemplate.find('.col-no-sidebar').append(newPadding);
                }

            };

            ella.translateBlock('.collection-template');
          
          	ella.hide_filter();

            ella.initWishListIcons();

            if ($('[data-view-as]').length) {
                ella.viewModeLayout();
            };

            if (ella.checkNeedToConvertCurrency()) {
                Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
            };

            if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
            };
        },

        initToggleWidgetTitleSidebarFilter: function () {
            var widgetTitleSlt = '[data-has-collapse] .widget-title';

            body.off('click.toggleWidgetContent').on('click.toggleWidgetContent', widgetTitleSlt, function () {
                $(this).toggleClass('open');
                $(this).next().slideToggle();
            });

            var widgetTitleSltCollNoSidebar = '[data-has-collapse-no-sidebar] .widget-title';

            if(win.innerWidth() < 1200) {
                body.off('click.toggleWidgetContent2').on('click.toggleWidgetContent2', widgetTitleSltCollNoSidebar, function () {
                    $(this).toggleClass('open');
                    $(this).next().slideToggle();
                });
            }
        },

        initInfiniteScrolling: function () {
            var infiniteScrolling = $('.infinite-scrolling');
            var infiniteScrollingLinkSlt = '.infinite-scrolling a';

            if (infiniteScrolling.length) {

                body.off('click.initInfiniteScrolling', infiniteScrollingLinkSlt).on('click.initInfiniteScrolling', infiniteScrollingLinkSlt, function (e) {
                    e.preventDefault();
                    e.stopPropagation();

                    if (!$(this).hasClass('disabled')) {
                        var url = $(this).attr('href');

                        ella.doAjaxInfiniteScrollingGetContent(url);
                    };
                });

                if (window.infinity_scroll_feature) {
                    $(window).scroll(function () {
                        if (ella.isAjaxLoading) return;

                        var collectionTplElm = $('[data-section-type="collection-template"]');

                        if (!collectionTplElm.length) {
                            collectionTplElm = $('[data-search-page]');
                        };

                        var collectionTop = collectionTplElm.offset().top;
                        var collectionHeight = collectionTplElm.outerHeight();
                        var posTop = collectionTop + collectionHeight - $(window).height();

                        if ($(this).scrollTop() > posTop && $(this).scrollTop() < (posTop + 200)) {
                            var button = $(infiniteScrollingLinkSlt);

                            if (button.length && !button.hasClass('disabled')) {
                                var url = button.attr('href');

                                ella.doAjaxInfiniteScrollingGetContent(url);
                            };
                        };
                    });
                };
            }
        },

        doAjaxInfiniteScrollingGetContent: function (url) {
            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: url,

                beforeSend: function () {
                    ella.showLoading();
                },

                success: function (data) {
                    ella.ajaxInfiniteScrollingMapData(data);
                    ella.initColorSwatchGrid();
                    if ($('[data-view-as]').length) {
                        ella.viewModeLayout();
                    };
                    ella.initCountdownNormal();
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        ajaxInfiniteScrollingMapData: function (data) {
            var collectionTemplate = $('.collection-template'),
                currentProductColl = collectionTemplate.find('.product-collection'),
                newCollectionTemplate = $(data).find('.collection-template'),
                newProductColl = newCollectionTemplate.find('.product-collection'),
                newProductItem = newProductColl.children('.grid-item').not('.banner-img');

            showMoreButton = $('.infinite-scrolling a');

            if (newProductColl.length) {
                currentProductColl.append(newProductItem);

                if ($('.collection-template .product-collection[data-layout]').length) {
                    ella.ellaTimeout = setTimeout(function () {
                        currentProductColl.isotope('appended', newProductItem).isotope('layout');
                    }, 700);
                }

                ella.translateBlock('.product-collection');

                if ($(data).find('.infinite-scrolling').length > 0) {
                    showMoreButton.attr('href', newCollectionTemplate.find('.infinite-scrolling a').attr('href'));
                } else {
                    //no more products
                    var noMoreText = window.inventory_text.no_more_product;

                    if (window.multi_lang && translator.isLang2())
                        noMoreText = window.lang2.collections.general.no_more_product;

                    showMoreButton.html(noMoreText).addClass('disabled');
                };

                if (ella.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                };

                if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                    return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                };
            };
        },

        addEventViewModeLayout: function () {
            ella.setActiveViewModeMediaQuery();

            body.on('click', '.view-mode .icon-mode', function (e) {
                e.preventDefault();

                var self = $(this),
                    col = self.data('col'),
                    parents = self.closest('[data-view-as]');

                if (!self.hasClass('active')) {
                    parents.find('.icon-mode').removeClass('active');
                    self.addClass('active');

                    ella.viewModeLayout();
                };

            });
        },

        viewModeLayout: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                products = $('.collection-template .product-collection'),
                gridItem = products.find('.grid-item'),
                strClass = 'col-12 col-6 col-md-4 col-lg-3 col5',
                gridClass = 'grid-2 grid-3 grid-4 grid-5 products-grid products-list';

            switch (col) {
                case 1:
                    if(gridItem.hasClass('grid-item-mansory')) {
                        products.removeClass(gridClass).addClass('products-list');
                    } else {
                        products.removeClass('products-grid').addClass('products-list');
                    }

                    gridItem.removeClass(strClass).addClass('col-12');
                    break;

                default:
                    switch (col) {
                        case 2:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-2');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6');
                            break;

                        case 3:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-3');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4');
                            break;

                        case 4:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-4');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3');
                            break;

                        case 5:
                            if(gridItem.hasClass('grid-item-mansory')) {
                                products.removeClass(gridClass).addClass('products-grid grid-5');
                            } else {
                                products.removeClass('products-list').addClass('products-grid');
                            }
                            gridItem.removeClass(strClass).addClass('col-6 col-md-4 col-lg-3 col5');
                            break;
                    }
            };
        },

        setActiveViewModeMediaQuery: function () {
            var viewMode = $('[data-view-as]'),
                viewModeActive = viewMode.find('.icon-mode.active'),
                col = viewModeActive.data('col'),
                windowWidth = window.innerWidth;

            if (windowWidth < 768) {
                if (col === 3 || col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="2"]').addClass('active');
                }
            } else if (windowWidth < 992 && windowWidth >= 768) {
                if (col == 4 || col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="3"]').addClass('active');
                }
            } else if (windowWidth < 1200 && windowWidth >= 992) {
                if (col == 5) {
                    viewModeActive.removeClass('active');
                    $('[data-col="4"]').addClass('active');
                }
            }

            if (viewMode.length) {
                ella.viewModeLayout();
            }
        },

        initPaginationPage: function () {
            var paginationSlt = '.pagination-page a';

            body.off('click', paginationSlt).on('click', paginationSlt, function (e) {
                if(Shopify.queryParams){
                    e.preventDefault();

                var page = $(this).attr('href').match(/page=\d+/g);

                if (page) {
                    Shopify.queryParams.page = parseInt(page[0].match(/\d+/g));

                    if (Shopify.queryParams.page) {
                        var newurl = ella.ajaxCreateUrl();

                        ella.isSidebarAjaxClick = true;

                        History.pushState({
                            param: Shopify.queryParams
                        }, newurl, newurl);

                        ella.doAjaxToolbarGetContent(newurl);

                        var elm = $('[data-section-type="collection-template"] .toolbar');

                        if (!elm.length) {
                            elm = $('[data-search-page]');
                        }

                        var top = elm.offset().top;

                        $('body,html').animate({
                            scrollTop: top
                        }, 600);
                    };
                };
                }


            });
        },

        changeQuantityAddToCart: function () {
            var buttonSlt = '[data-minus-quantity], [data-plus-quantity]',
                buttonElm = $(buttonSlt);

            doc.on('click', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    input = self.siblings('input[name="quantity"]').length > 0 ? self.siblings('input[name="quantity"]') : self.siblings('input[name="group_quantity"]');



                if (input.length < 1) {
                    input = self.siblings('input[name="updates[]"]');
                }

                var val = parseInt(input.val());

                switch (true) {
                    case (self.hasClass('plus')):
                        {
                            val +=1;
                            break;
                        }
                    case (self.hasClass('minus') && val > 0):
                        {
                            val -=1;
                            break;
                        }
                }

                input.val(val);
            });
        },

        toggleVariantsForExpressOrder: function () {
            var toggleVariant = '[data-toggle-variant]';

            doc.on('click', toggleVariant, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this),
                    curVariants = self.data('target');

                if(self.hasClass('show-options-btn')) {
                    self.text(window.inventory_text.hide_options);
                    $(curVariants).slideDown(700, function () {
                        self.addClass('hide-options-btn').removeClass('show-options-btn');
                    });
                }
                else {
                    self.text(window.inventory_text.show_options);
                    $(curVariants).slideUp(700, function () {
                        self.addClass('show-options-btn').removeClass('hide-options-btn');
                    });
                };
            })
        },

        initExpressOrderAddToCart: function() {
            var addToCartSlt = '[data-express-addtocart]';

            doc.off('click.addToCartExpress', addToCartSlt).on('click.addToCartExpress', addToCartSlt, function (e) {
                e.preventDefault();

                var self = $(this);

                if (self.attr('disabled') != 'disabled') {
                    var productItem = self.closest('.product-item');

                    if(productItem.length == 0) {
                        productItem = self.closest('.col-options');
                    }

                    var form = productItem.find('form');
                    var variant_id = form.find('select[name=id]').val();

                    if (!variant_id) {
                        variant_id = form.find('input[name=id]').val();
                    };

                    var quantityElm = productItem.find('input[name=quantity]');

                    if(quantityElm.length == 0) {
                        quantityElm = productItem.siblings('.col-qtt').find('input[name=quantity]');
                    }

                    var quantity = quantityElm.val();
                    if (!quantity) {
                        quantity = 1;
                    };

                    if(parseInt(quantity) !== 0) {
                        if (window.ajax_cart == 'none') {
                            form.submit();
                        } else {
                            ella.expressAjaxAddToCart(variant_id, quantity, self, form);
                            form.next('.feedback-text').show();
                        }
                    }
                    else {
                        form.next('.feedback-text').text('Quantity cannot be blank').show();
                    }
                }
                return false;
            });
        },

        expressAjaxAddToCart: function(variant_id, quantity, cartBtn, form) {
            $.ajax({
                type: "post",
                url: "/cart/add.js",
                data: 'quantity=' + quantity + '&id=' + variant_id,
                dataType: 'json',

                beforeSend: function() {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.adding +"...");
                    }, 100);
                },

                success: function(msg) {
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.thank_you);
                    }, 600);
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_more + "...");
                    }, 1000);

                    ella.updateDropdownCart();

                    cartBtn.addClass('add_more');
                    form.next('.feedback-text').text(window.inventory_text.cart_feedback);
                },

                error: function(xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                    window.setTimeout(function() {
                        cartBtn.text(window.inventory_text.add_to_cart);
                    }, 400);
                }
            });
        },

        initAddToCart: function () {
            var btnAddToCartSlt = '[data-btn-addToCart]';

            doc.off('click.addToCart', btnAddToCartSlt).on('click.addToCart', btnAddToCartSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();
                var self = $(this);
                var thisForm = $(self.data('form-id'));
                
                var data = thisForm.serialize();

                if (self.attr('disabled') !== "disabled") {
                    var productItem = self.closest('.product-item');

                    if (productItem.length < 1) {
                        var sectionsProduct = self.closest('[data-section-type="product"]');

                        if (!sectionsProduct.length) {
                            sectionsProduct = self.closest('.quickview-tpl');
                        }

                        productItem = sectionsProduct.find('.product-shop');
                    };

                    var form = productItem.find('form'),
                        handle = productItem.find('.product-grid-image').data('collections-related') || sectionsProduct.data('collections-related');

                    // var variant_id = form.find('select[name=id]').val();
                    // if (!variant_id) {
                    //     variant_id = form.find('input[name=id]').val();
                    // };

                    // var quantity = form.find('input[name=quantity]').val();
                    // if (!quantity) {
                    //     quantity = 1;
                    // };

                    switch (window.ajax_cart) {
                        case "none":
                            form.submit();
                            break;

                        case "normal":
                            var title = productItem.find('.product-title').html();
                            var image = productItem.find('.product-grid-image img').attr('src');

                            if(!image) {
                                image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                            }

                            ella.doAjaxAddToCartNormal(data, title, image);
                            break;

                        case "upsell":
                            ella.doAjaxAddToCart(data, handle);
                            break;
                    };

                }
                return false;
            });

            ella.closeSuccessModal();
        },

        initGroupedAddToCart: function() {
            var btnAddToCartSlt = '[data-grouped-addToCart]';

            ella.changeVariantSelectOption();

            doc.off('click.GroupedAddToCart', btnAddToCartSlt).on('click.GroupedAddToCart', btnAddToCartSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var self = $(this);
                var formData = $(self.data('form-id'));
                var data = formData.serialize();

                if (self.attr('disabled') !== "disabled") {
                    var sectionsProduct = self.closest('[data-section-type="product"]'),
                        productItem = sectionsProduct.find('.product-shop');

                    var form = productItem.find('form'),
                        handle = sectionsProduct.data('collections-related'),
                        groupedProduct = form.find('.grouped-product');

                    Shopify.queue = [];

                    groupedProduct.each(function() {
                        variantId = $(this).find('input[type=hidden]').attr('value'),
                        quantity = parseInt($(this).find('input[name=group_quantity]').val());

                        if(quantity > 0 && variantId !== '') {
                            Shopify.queue.push( {
                                variantId: variantId,
                                quantity: parseInt(quantity, 10) || 0
                            });
                        };
                    });

                    Shopify.moveAlong = function() {
                        if (Shopify.queue.length) {
                            var request = Shopify.queue.shift();

                            Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
                        }

                        else {
                            // var variant_id = form.find('select[name=id]').val();

                            // if (!variant_id) {
                            //     variant_id = form.find('input[name=id]').val();
                            // };

                            // var quantity = form.find('input[name=quantity]').val();
                            // if (!quantity) {
                            //     quantity = 1;
                            // };

                            switch (window.ajax_cart) {
                                case "none":
                                    ella.doAjaxAddToCart(data, handle, true);
                                    break;

                                case "normal":
                                    var title = productItem.find('.product-title').html();
                                    var image = productItem.find('.product-grid-image img').attr('src');

                                    if(!image) {
                                        image = productItem.siblings('.product-photos').find('.slick-current img[id|="product-featured-image"]').attr('src') || productItem.siblings('.product-photos').find('.slick-current img[id|="qv-product-featured-image"]').attr('src');
                                    }
                                    ella.doAjaxAddToCartNormal(data, title, image);
                                    break;

                                case "upsell":
                                    ella.doAjaxAddToCart(data, handle);
                                    break;
                            };
                            return false;
                        };
                    }

                    Shopify.moveAlong();
                };
            });

            ella.closeSuccessModal();
        },

        changeVariantSelectOption: function() {
            var selectSlt = '[data-select-change-variant]';

            doc.on('change', selectSlt, function() {
                var value = $(this).val(),
                    dataImg = $(this).find('option:selected').data('img'),
                    dataPrice = $(this).find('option:selected').data('price'),
                    parent = $(this).closest('.grouped-product');

                parent.find('input[type=hidden]').val(value);
                parent.find('.product-img img').attr({ src: dataImg });
                parent.find('[data-price-change]').html(Shopify.formatMoney(dataPrice, window.money_format));

                if (ella.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '.grouped-product span.money', 'money_format');
                }
            });
        },

        closeSuccessModal: function () {
            var ajaxCartModal = $('[data-ajax-cart-success], [data-quickview-modal]'),
                closeWindow = ajaxCartModal.find('.close-modal, .continue-shopping'),
                modalContent = ajaxCartModal.find('.halo-modal-content');

            closeWindow.click(function (e) {
                e.preventDefault();

                ajaxCartModal.fadeOut(500, function () {
                    html.removeClass('halo-modal-open');
                    html.css({
                        "overflow": ""
                    });

                    if (body.hasClass('template-cart')) {
                        window.location.reload();
                    }
                });
            });

            ajaxCartModal.on('click', function (e) {
                if (!modalContent.is(e.target) && !modalContent.has(e.target).length) {
                    ajaxCartModal.fadeOut(500, function () {
                        html.removeClass('halo-modal-open');
                        html.css({
                            "overflow": ""
                        });

                        if (body.hasClass('template-cart')) {
                            window.location.reload();
                        }
                    });
                };
            });
        },

        doAjaxAddToCartNormal: function(data, title, image) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",

                beforeSend: function () {
                    ella.showLoading();
                },

                success: function () {
                    var ajaxCartModal = $('[data-ajax-cart-success]'),
                        modalContent = ajaxCartModal.find('.cart-modal-content');

                    modalContent.find('.ajax-product-title').html(ella.translateText(title));
                    modalContent.find('.ajax-product-image').attr('src', image);
                    modalContent.find('.message-added-cart').show();

                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open'); 

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        ella.closeLookbookModal();
                    });
                    ella.updateDropdownCart();
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        doAjaxAddToCart: function (data, handle,nojax) {
            $.ajax({
                type: "POST",
                url: "/cart/add.js",
                data: data,
                dataType: "json",
                async: false,
                beforeSend: function () {
                    ella.showLoading();
                },

                success: function (data) {
                  if(!nojax){
                    ella.getPopupShoppingCart(true,handle);
                  }else{
        
                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                    ella.apply_discount( discount_code );
                    window.location.href = '/cart';
                    ella.showloading();
                    
                  }
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        getPopupShoppingCart: function (shouldShowModel, handle) {
            var ajaxCartModal = $('[data-ajax-cart-success]'),
                modalContent = ajaxCartModal.find('.cart-popup-content'),
                collUpsell = ajaxCartModal.find('.cart-popup-coll-related');

            $.get("/cart?view=json", function (data) {
                modalContent.html(data);

                if (shouldShowModel) {
                    if (handle != '/collections/?view=related') {
                        collUpsell.load('' + handle + '');
                    } else {
                        collUpsell.load('/collections/all?view=related');
                    };
                  	$( document ).ajaxComplete(function( event, xhr, settings ) {
                      if ( settings.url === "/collections/all?view=related" || settings.url === '' + handle + '') {
                        try{
                          if (ella.checkNeedToConvertCurrency()) {
                              Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-ajax-cart-success] span.money', 'money_format');
                          }
                        }
                        catch(e){
                          console.log(e)
                        }
                      }
                    });
                }
            }).always(function () {
                ella.updateDropdownCart();

                ella.ellaTimeout = setTimeout(function () {
                    ella.translateBlock('[data-ajax-cart-success]');

                    if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                        return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                    };
                }, 1000);

                if (ella.checkNeedToConvertCurrency()) {
                    Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), '[data-ajax-cart-success] span.money', 'money_format');
                }

                if (shouldShowModel) {
                    ajaxCartModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-quickview-modal]').is(':visible')) {
                            $('[data-quickview-modal]').hide();
                        }

                        ella.closeLookbookModal();
                    });
                }
            });
        },

        doAjaxUpdatePopupCart: function (quantity, id) {
            $.ajax({
                type: 'POST',
                url: '/cart/change.js',
                data: {
                    id: id,
                    quantity: quantity
                },
                dataType: 'json',

                beforeSend: function () {
                    ella.showLoading();
                },

                success: function (result) {
                    ella.getPopupShoppingCart(false);
                    ella.checkBundleProducts();
                },

                error: function (xhr) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.showModal('.ajax-error-modal');
                },

                complete: function () {
                    ella.hideLoading();
                }
            });
        },

        initChangeQuantityButtonEvent: function () {
            var buttonSlt = '[data-minus-quantity-cart], [data-plus-quantity-cart]',
                buttonElm = $(buttonSlt);

            doc.off('click.updateCart').on('click.updateCart', buttonSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var btn = $(this);
                var id = btn.closest("[data-product-id]").data("product-id");
                var quantity = parseInt(btn.siblings('input[name="quantity"]').val());

                if (btn.hasClass('plus')) {
                    quantity += 1;
                } else {
                    quantity -= 1;
                };

                ella.doAjaxUpdatePopupCart(quantity, id);

            });
        },

        initQuantityInputChangeEvent: function () {
            var quantityIptSlt = '[data-quantity-input]';

            doc.on('change', quantityIptSlt, function () {
                var id = $(this).closest("[data-product-id]").data("product-id"),
                    quantity = parseInt($(this).val());

                ella.doAjaxUpdatePopupCart(quantity, id);
            });
        },

        removeCartItem: function () {
            var removeSlt = '.cart-remove';

            doc.on('click', removeSlt, function (e) {
                e.preventDefault();
                e.stopPropagation();

                var id = $(this).closest("[data-product-id]").data("product-id");

                ella.doAjaxUpdatePopupCart(0, id);
            });
        },

        initSoldOutProductShop: function () {
            var soldProduct = $('.product-shop [data-soldOut-product]');

            if (soldProduct.length) {
                soldProduct.each(function () {
                    var self = $(this);

                    var items = self.data('items').toString().split(","),
                        hours = self.data('hours').toString().split(","),
                        i = Math.floor(Math.random() * items.length),
                        j = Math.floor(Math.random() * hours.length);

                    self.find('.items-count').text(items[i]);
                    self.find('.hours-num').text(hours[j]);
                });
            }
        },

        initCustomerViewProductShop: function () {
            var customerView = $('.product-shop [data-customer-view]');

            if (customerView.length) {
                customerView.each(function () {
                    var self = $(this);

                    setInterval(function () {
                        var views = self.data('customer-view').split(","),
                            i = Math.floor(Math.random() * views.length);

                        self.find('label').text(views[i]);
                    }, 5000);
                });
            }
        },

        initProductMoreview: function (productMoreview) {
            var sliderFor = productMoreview.find('.slider-for'),
                sliderNav = productMoreview.find('.slider-nav'),
                vertical = sliderNav.data('vertical');

            if (!sliderFor.hasClass('slick-initialized') && !sliderNav.hasClass('slick-initialized')) {
                sliderFor.slick({
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    arrows: false,
                    fade: true,
                    asNavFor: sliderNav,
                    adaptiveHeight:true
                });

                sliderNav.slick({
                    infinite: true,
                    slidesToShow: sliderNav.data('rows'),
                    vertical: vertical,
                    slidesToScroll: 1,
                    asNavFor: sliderFor,
                    focusOnSelect: true,
                    nextArrow: '<button type="button" class="slick-next"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 17 33" xml:space="preserve"><g id="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="_x38_e584754-6657-46f1-a9d8-2cfd6623b552"><g><polygon points="14.9,14.5 0,0 0,3.7 11.1,14.5 13.2,16.5 11.1,18.5 0,29.3 0,33 14.9,18.5 17,16.5 "/></g></g></g></svg></button>',
                    prevArrow: '<button type="button" class="slick-prev"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 33"><g id="7f9a1925-e8c7-4614-8787-3c6095a9f6e1" data-name="Layer 2"><g id="c9b7920a-81fa-4bfe-ad13-4da717c6854b" data-name="Layer 1"><g id="c2d982ff-0cf6-4220-b365-47f30d708fea" data-name="e4eb89a6-f885-43b8-9259-0d6b1516fab0"><g id="f51d455e-6b9c-4c4e-96db-a5004582beda" data-name="8e584754-6657-46f1-a9d8-2cfd6623b552"><polygon points="0 16.5 2.1 18.5 17 33 17 29.3 5.9 18.5 3.8 16.5 5.9 14.5 17 3.7 17 0 2.1 14.5 0 16.5"/></g></g></g></g></svg></button>',
                    responsive: [{
                            breakpoint: 1200,
                            settings: {
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 992,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 768,
                            settings: {
                                slidesToShow: 4,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        },
                        {
                            breakpoint: 360,
                            settings: {
                                slidesToShow: 3,
                                slidesToScroll: 1,
                                get dots() {
                                    if (vertical == true) {
                                        return dots = true;
                                    }
                                },
                            }
                        }
                    ]
                });
            };

            if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch) {
                var swatch = productMoreview.closest('[data-more-view-product]').siblings('.product-shop').find('.swatch'),
                    swatchColor = swatch.find('.swatch-element.color'),
                    inputChecked = swatchColor.find(':radio:checked');

                if(inputChecked.length) {
                    var className = inputChecked.data('filter');

                    if(className !== undefined) {
                        sliderNav.slick('slickUnfilter');
                        sliderFor.slick('slickUnfilter');

                        if(sliderNav.find(className).length && sliderFor.find(className).length) {
                            sliderNav.slick('slickFilter', className).slick('refresh');
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    };
                };
            }
        },

        changeSwatch: function (swatchSlt) {
            doc.on('change', swatchSlt, function () {
                var className = $(this).data('filter');
                var optionIndex = $(this).closest('.swatch').attr('data-option-index');
                var optionValue = $(this).val();

                $(this)
                    .closest('form')
                    .find('.single-option-selector')
                    .eq(optionIndex)
                    .val(optionValue)
                    .trigger('change');

                if(window.color_swatch_style === "variant_grouped" && window.use_color_swatch && className !== undefined) {
                    var productShop = $(swatchSlt).closest('.product-shop');

                    if(productShop.closest('.product-slider').length) {
                        var productImgs = productShop.closest('.product-slider').find('[data-moreview-product-slider]'),
                            sliderFor = productImgs.find('.slider-for');

                        sliderFor.slick('slickUnfilter');

                        if(sliderFor.find(className).length) {
                            sliderFor.slick('slickFilter', className).slick('refresh');
                        }
                    }else {
                        var productImgs = productShop.prev('[data-more-view-product]');

                        if(productImgs.length) {
                            var sliderNav = productImgs.find('.slider-nav'),
                                sliderFor = productImgs.find('.slider-for');

                            sliderNav.slick('slickUnfilter');
                            sliderFor.slick('slickUnfilter');

                            if(sliderNav.find(className).length && sliderFor.find(className).length) {
                                sliderNav.slick('slickFilter', className).slick('refresh');
                                sliderFor.slick('slickFilter', className).slick('refresh');
                            }
                        }
                    }

                }
            });
        },

        productPageInitProductTabs: function () {
            var listTabs = $('.tabs__product-page'),
                tabLink = listTabs.find('[data-tapTop]'),
                tabContent = listTabs.find('[data-TabContent]');

            tabLink.off('click').on('click', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var curTab = $(this),
                    curTabContent = $(curTab.data('target')),
                    ulElm = curTab.closest('.list-tabs');

                if (ulElm.length) {
                    if (!$(this).hasClass('active')) {
                        tabLink.removeClass('active');
                        tabContent.removeClass('active');

                        curTab.addClass('active');
                        ulElm.next().find(curTab.data('target')).addClass('active');
                    }
                } else {
                    if($('.product-template-full-width').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');

                            curTabContent.show(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        } else {
                            curTab.removeClass('active');

                            curTabContent.hide(0, function() {
                                $(document.body).trigger("sticky_kit:recalc");
                            });
                        };
                    } else if($('.has-sticky-product-img').length) {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.show();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.hide();
                        };
                    } else {
                        if (!$(this).hasClass('active')) {
                            curTab.addClass('active');
                            curTabContent.slideDown();
                        } else {
                            curTab.removeClass('active');
                            curTabContent.slideUp();
                        };
                    }

                };
            });

            var sprBadge = '.product-shop .spr-badge',
                btnReviewSlt = '.product-template-full-width .spr-summary-actions-newreview';

            doc.on('click.triggerTabsReviews', sprBadge, function () {
                if (listTabs.length) {
                    $('html,body').animate({
                        scrollTop: listTabs.offset().top
                    }, 400);

                    var activeTab = listTabs.find('[data-target="#collapse-tab2"]');

                    if (!activeTab.hasClass('active')) {
                        activeTab.trigger('click');
                    }
                };
            });

            if($('.product-template-full-width').length) {
                doc.on('click', btnReviewSlt, function() {
                    $(document.body).trigger("sticky_kit:recalc");
                });
            };
        },

        initStickyForProductFullWidth: function() {
            var productTplFullWidth = $('.product-template-full-width'),
                winWidth = win.innerWidth(),
                stickyElm1 = productTplFullWidth.find('[data-sticky-1]'),
                stickyElm2 = productTplFullWidth.find('[data-sticky-2]'),
                stickyElm3 = productTplFullWidth.find('[data-sticky-3]'),

                stickyResizeTimerId,

            destroySticky = function() {
                stickyElm1.trigger("sticky_kit:detach");
                stickyElm3.trigger("sticky_kit:detach");
                stickyElm2.trigger("sticky_kit:detach");
            },

            initSticky = function() {
                stickyElm1.stick_in_parent({
                    offset_top: 70,
                    inner_scrolling: false,
                });
                stickyElm3.stick_in_parent({
                    offset_top: 68
                });
                stickyElm2.stick_in_parent({
                    offset_top: 50
                }).on('sticky_kit:bottom', function() {
                        stickyElm2.addClass('sticky-on-bottom');
                    })
                    .on('sticky_kit:unbottom', function() {
                        stickyElm2.removeClass('sticky-on-bottom')
                    });
            };

            if(productTplFullWidth.length) {
                if (winWidth >= 1200) {
                    initSticky();
                }

                win.off('resize.sticky').on('resize.sticky', function() {
                    clearTimeout(stickyResizeTimerId);

                    stickyResizeTimerId = setTimeout(function() {
                        var curWinWidth = win.innerWidth();

                        if (curWinWidth < 1200 && winWidth >= 1200) {
                            destroySticky();
                        }
                        else if(curWinWidth >= 1200 && winWidth < 1200) {
                            initSticky();
                        }

                        winWidth = curWinWidth;
                    }, 0);
                });
            };
        },

        initQuickView: function () {
            body.off('click.initQuickView', '.quickview-button').on('click.initQuickView', '.quickview-button', function (e) {
                e.preventDefault();
                e.stopPropagation();

                var href = $(this).attr('id');

                ella.doAjaxShowQuickView(href);

                ella.closeSuccessModal();
            });
        },

        doAjaxShowQuickView: function (href) {
            if (ella.isAjaxLoading) return;

            $.ajax({
                type: "get",
                url: '/products/' + href + '?view=quickview',

                beforeSend: function () {
                    ella.showLoading();

                    html.css({
                        "overflow": "hidden"
                    });
                },

                success: function (data) {
                    var quickviewModal = $('[data-quickview-modal]'),
                        modalContent = quickviewModal.find('.halo-modal-body');

                    modalContent.html(data);

                    setTimeout(function () {
                        ella.translateBlock('[data-quickview-modal]');
                        ella.initProductMoreview($('[data-more-view-product-qv] .product-img-box'));
                        ella.initSoldOutProductShop();
                        ella.initCustomerViewProductShop();
                        ella.changeSwatch('.quickview-tpl .swatch :radio');
                        ella.initCountdownNormal();
                        ella.initZoom();
                        ella.setAddedForWishlistIcon(href);

                        $.getScript("https://s7.addthis.com/js/300/addthis_widget.js#pubid=ra-595b0ea2fb9c5869")
                            .done(function() {
                                if(typeof addthis !== 'undefined') {
                                    addthis.init();
                                    addthis.layers.refresh();
                                }
                            })

                        if ($('.shopify-product-reviews-badge').length && $('.spr-badge').length) {
                            return window.SPR.registerCallbacks(), window.SPR.initRatingHandler(), window.SPR.initDomEls(), window.SPR.loadProducts(), window.SPR.loadBadges();
                        };
                    }, 500);

                    ella.hideLoading();

                    quickviewModal.fadeIn(600, function () {
                        // html.addClass('halo-modal-open');

                        if ($('[data-ajax-cart-success]').is(':visible')) {
                            $('[data-ajax-cart-success]').hide();
                        }
                    });
                },

                error: function (xhr, text) {
                    $('.ajax-error-message').text($.parseJSON(xhr.responseText).description);
                    ella.hideLoading();
                    ella.showModal('.ajax-error-modal');
                }
            });
        },

        initZoom: function () {
            var zoomElm = $('.product-img-box [data-zoom]');

            if (win.width() >= 1200) {
                zoomElm.zoom();
            } else {
                zoomElm.trigger('zoom.destroy');
            };
        },

        openSearchForm: function () {
            var iconSearchSlt = '[data-search-mobile-toggle]',
                wrapperHeader = $('.wrapper-header'),
                formSearch = wrapperHeader.find('.search-form');

            doc.off('click.toggleSearch', iconSearchSlt).on('click.toggleSearch', iconSearchSlt, function(e) {
                e.preventDefault();
                e.stopPropagation();

                html.addClass('search-open');
            });

            doc.off('click.hideSearch').on('click.hideSearch', function (e) {
                var searchForm = $('.wrapper-header .search-form .search-bar');

                if (!searchForm.is(e.target) && !searchForm.has(e.target).length) {
                    html.removeClass('search-open');

                    $('.quickSearchResultsWrap').hide();
                }
            });
        },

        stickyFixedTopMenu: function() {
            if(window.fixtop_menu) {
                if(window.innerWidth >= 1200) {
                    $('[data-sticky-mb]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-pc]').sticky({
                                zIndex: 3
                            });

                            $('[data-sticky-pc]').on('sticky-start', function() {
                                body.addClass('has_sticky');
                            });

                            $('[data-sticky-pc]').on('sticky-end', function() {
                                body.removeClass('has_sticky');
                            });
                        }, 100
                    );
                } else {
                    $('[data-sticky-pc]').unstick();

                    setTimeout(
                        function() {
                            $('.site-header').css('height', '');
                            $('[data-sticky-mb]').sticky({
                                zIndex: 3
                            });
                        }, 100
                    );
                };
            };
        },

        handleScrollDown: function() {
            var iconSrollDownSlt = '[data-scroll-down]',
                iconSrollDown = $(iconSrollDownSlt);

            iconSrollDown.each(function() {
                var self = $(this);
                var target = self.closest('.shopify-section').next('.shopify-section').attr('id');

                self.attr('href', '#'+ target +'');

                doc.off('click.handleScrollDown', iconSrollDownSlt).on('click.handleScrollDown', iconSrollDownSlt, function(e) {
                    e.preventDefault();

                    var scroll = $(this.getAttribute('href'));

                    if( scroll.length ) {
                        $('html, body').stop().animate({
                            scrollTop: scroll.offset().top
                        }, 500);
                    };
                });
            });
        },

        initStickyAddToCart: function() {
            var blockSticky = $('[data-sticky-add-to-cart]'),
                sltVariantActive = blockSticky.find('.pr-active'),
                variantElm = blockSticky.find('.pr-swatch');

            if(blockSticky.length) {
                var showHideVariantsOptions = function() {
                    sltVariantActive.off('click.showListVariant').on('click.showListVariant', function(e) {
                        e.preventDefault();

                        blockSticky.toggleClass('open-sticky');
                    });

                    doc.off('click.hideVariantsOption').on('click.hideVariantsOption', function(e) {
                        if (!sltVariantActive.is(e.target) && sltVariantActive.has(e.target).length === 0){
                            blockSticky.removeClass('open-sticky');
                        };
                    })
                };

                var handleActiveVariant = function() {
                    variantElm.off('click.activeVar').on('click.activeVar', function(e) {
                        var self = $(this),
                            text = self.text(),
                            value = self.data('value'),
                            newImage = self.data('img');

                        variantElm.removeClass('active');
                        self.addClass('active');
                        blockSticky.toggleClass('open-sticky');

                        blockSticky.find('.action input[type=hidden]').val(value);
                        sltVariantActive.attr('data-value', value).text(text);

                        var swatchNameValue = $('#add-to-cart-form [data-value-sticky="'+value+'"]');

                        swatchNameValue.each(function() {
                            var slt = $(this).data('value');

                            $('[data-value="'+slt+'"]').closest('.swatch').find('#'+slt+'').click();
                        });

                        if(self.hasClass('sold-out')) {
                            blockSticky.find('.sticky-add-to-cart').val(window.inventory_text.sold_out).addClass('disabled').attr('disabled', 'disabled');
                        }else {
                            blockSticky.find('.sticky-add-to-cart').removeClass('disabled').removeAttr('disabled').val(window.inventory_text.add_to_cart);
                        };

                        $('.pr-img img').attr({ src: newImage });

                        return false;
                    });
                };

                var stickyAddToCart = function() {
                    doc.on('click', '[data-sticky-btn-addToCart]', function(e) {
                        e.preventDefault();

                        if($('#add-to-cart-form [data-btn-addToCart]').length) {
                            $('#add-to-cart-form [data-btn-addToCart]').click();
                        } else if($('#add-to-cart-form [data-grouped-addToCart]').length) {
                            $('#add-to-cart-form [data-grouped-addToCart]').click();
                        };

                        return false;
                    });
                };

                var activeVariantSelected = function() {
                    var optionSelected = $('#product-selectors option:selected'),
                        value = optionSelected.val(),
                        stickyActive = blockSticky.find('.pr-swatch[data-value="'+value+'"]'),
                        stickyText = stickyActive.html();

                    sltVariantActive.html(stickyText);
                    stickyActive.addClass('active');

                    var str = stickyActive.data('img');

                    $('.pr-img img').attr({ src: str });

                    $(".swatch .swatch-element").each(function(e) {
                        var idVariant = $(this).find('input:radio').attr('id');

                        $('.swatch input.text[data-value="'+idVariant+'"]').appendTo($(this));
                    });

                    $('.selector-wrapper').change(function() {
                        var n = $("#product-selectors").val();

                        $('.sticky_form .pr-selectors li').each(function(e) {
                            var t = $(this).find('a').data('value');

                            if(t == n){
                                $(this).find('a').addClass('active')
                            } else{
                                $(this).find('a').removeClass('active')
                            }
                        });

                        $("#product-selectors").change(function() {
                            var str = "";

                            $("#product-selectors option:selected").each(function() {
                                str += $(this).data('imge');
                            });

                            $('.pr-img img').attr({ src: str });
                        }).trigger("change");

                        if(variantElm.hasClass('active')) {
                            var h = $('.sticky_form .pr-swatch.active').html();

                            $('.sticky_form .action input[type=hidden]').val(n);
                            sltVariantActive.html(h);
                            sltVariantActive.attr('data-value', n);
                        };
                    });
                };

                var offSetTop = $('#add-to-cart-form .groups-btn').offset().top;

                $(window).scroll(function () {
                    var scrollTop = $(this).scrollTop();

                    if (scrollTop > offSetTop) {
                        body.addClass('show_sticky');
                    }
                    else {
                        body.removeClass('show_sticky');
                    }
                });

                showHideVariantsOptions();
                handleActiveVariant();
                stickyAddToCart();
                activeVariantSelected();
            };
        },

        createWishListTplItem: function(ProductHandle) {
            var wishListCotainer = $('[data-wishlist-container]');

            jQuery.getJSON('/products/'+ProductHandle+'.js', function(product) {
                var productHTML = '',
                    price_min = Shopify.formatMoney(product.price_min, window.money_format);

                productHTML += '<div class="grid-item" data-wishlist-added="wishlist-'+product.id+'">';
                productHTML += '<div class="inner product-item" data-product-id="product-'+product.handle+'">';
                productHTML += '<div class="column col-img"><div class="product-image">';
                productHTML +='<a href="'+product.url+'" class="product-grid-image" data-collections-related="/collections/all?view=related">';
                productHTML += '<img src="'+product.featured_image+'" alt="'+product.featured_image.alt+'">';
                productHTML += '</a></div></div>';
                productHTML += '<div class="column col-prod">';
                productHTML += '<a class="product-title" href="'+product.url+'" title="'+product.title+'">'+product.title+'</a>';
                productHTML += '<div class="product-vendor">';
                productHTML += '<a href="/collections/vendors?q='+product.vendor+'" title="'+product.vendor+'">'+product.vendor+'</a></div></div>';
                productHTML += '<div class="column col-price text-center"><div class="price-box">'+ price_min +'</div></div>';
                productHTML += '<div class="column col-options text-center">';
                productHTML += '<form action="/cart/add" method="post" class="variants" id="wishlist-product-form-' + product.id +'" data-id="product-actions-'+product.id+'" enctype="multipart/form-data">';

                if (product.available) {
                    if (product.variants.length == 1) {
                        productHTML += '<button data-btn-addToCart class="btn add-to-cart-btn" data-form-id="#wishlist-product-form-' + product.id +'" type="submit">'+window.inventory_text.add_to_cart+'</button><input type="hidden" name="id" value="'+ product.variants[0].id +'" />';
                    }
                    if (product.variants.length > 1){
                        productHTML += '<a class="btn" title="'+product.title+'" href="'+product.url +'">'+window.inventory_text.select_options+'</a>';
                    }
                } else {
                    productHTML += '<button class="btn add-to-cart-btn" type="submit" disabled="disabled">'+window.inventory_text.unavailable+'</button>';
                }

                productHTML += '</form></div>';
                productHTML += '<div class="column col-remove text-center"><a class="whislist-added" href="#" data-product-handle="'+ product.handle +'" data-icon-wishlist data-id="'+ product.id +'"><svg class="closemnu" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 357 357" xml:space="preserve"><g><g><polygon points="357,35.7 321.3,0 178.5,142.8 35.7,0 0,35.7 142.8,178.5 0,321.3 35.7,357 178.5,214.2 321.3,357 357,321.3 214.2,178.5"></polygon></g></g></svg></a></div>';
                productHTML += '</div></div>';

                wishListCotainer.append(productHTML);
                var regex = /(<([^>]+)>)/ig;
                var href = $('.wrapper-wishlist a.share').attr("href");
                href += encodeURIComponent( product.title + '\nPrice: ' + price_min.replace(regex, "") + '\nLink: ' + window.location.protocol + '//' + window.location.hostname + product.url +'\n\n');
                $('.wrapper-wishlist a.share').attr("href", href );
            });
        },

        initWishListPagging: function() {
            var data = JSON.parse(localStorage.getItem('items'));

            var wlpaggingContainer = $('#wishlist-paginate');
            var paggingTpl = '<li class="text disabled prev"><a href="#" title="'+window.inventory_text.previous+'"><i class="fa fa-angle-left" aria-hidden="true"></i><span>'+window.inventory_text.previous+'</span></a></li>';
            var wishListCotainer = $('[data-wishlist-container]');

            wlpaggingContainer.children().remove();

            var totalPages = Math.ceil(data.length / 3);

            if (totalPages <= 1) {
                wishListCotainer.children().show();
                return;
            }

            for (var i = 0; i < totalPages; i++) {
                var pageNum = i + 1;
                if (i === 0) paggingTpl += '<li class="active"><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
                else paggingTpl += '<li><a data-page="' + pageNum + '" href="'+ pageNum +'" title="'+ pageNum +'">' + pageNum + '</a></li>'
            }

            paggingTpl += '<li class="text next"><a href="#" title="'+window.inventory_text.next+'"><span>'+window.inventory_text.next+'</span><i class="fa fa-angle-right" aria-hidden="true"></i></a></li>';

            wlpaggingContainer.append(paggingTpl);

            wishListCotainer.children().each(function(idx, elm) {
                if (idx >= 0 && idx < 3) {
                    $(elm).show();
                }
                else {
                    $(elm).hide();
                }
            });

            wlpaggingContainer.off('click.wl-pagging').on('click.wl-pagging', 'li a', function(e) {
                e.preventDefault();

                var isPrev = $(this).parent().hasClass('prev');
                var isNext = $(this).parent().hasClass('next');
                var pageNumber = $(this).data('page');

                if (isPrev) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage - 1;
                }

                if (isNext) {
                    var curPage = parseInt($(this).parent().siblings('.active').children().data('page'));
                    pageNumber = curPage + 1;
                }

                wishListCotainer.children().each(function(idx, elm) {
                    if (idx >= (pageNumber - 1) * 3 && idx < pageNumber * 3) {
                        $(elm).show();
                    }
                    else {
                        $(elm).hide();
                    }
                });

                if (pageNumber === 1) {
                    wlpaggingContainer.find('.prev').addClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }
                else if (pageNumber === totalPages) {
                    wlpaggingContainer.find('.next').addClass('disabled');
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                }
                else {
                    wlpaggingContainer.find('.prev').removeClass('disabled');
                    wlpaggingContainer.find('.next').removeClass('disabled');
                }

                $(this).parent().siblings('.active').removeClass('active');
                wlpaggingContainer.find('[data-page="' + pageNumber + '"]').parent().addClass('active');

            });
        },

        initWishLists: function() {
            if (typeof(Storage) !== 'undefined') {
                var data = JSON.parse(localStorage.getItem('items'));

                if (data.length <= 0) {
                    return;
                }

                data.forEach(function(item) {
                    ella.createWishListTplItem(item);
                });

                this.initWishListPagging();
                this.translateBlock('.wishlist-page');

            } else {
                alert('Sorry! No web storage support..');
            }
        },

        setAddedForWishlistIcon: function(ProductHandle) {
            var wishlistElm = $('[data-product-handle="'+ ProductHandle +'"]'),
                idxArr = wishListsArr.indexOf(ProductHandle);

            if(idxArr >= 0) {
                wishlistElm.addClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            }
            else {
                wishlistElm.removeClass('whislist-added');
                wishlistElm.find('.wishlist-text').text(window.inventory_text.add_wishlist);
            };
        },

        doAddOrRemoveWishlish: function() {
            var iconWishListsSlt = '[data-icon-wishlist]';

            doc.off('click.addOrRemoveWishlist', iconWishListsSlt).on('click.addOrRemoveWishlist', iconWishListsSlt, function(e) {
                e.preventDefault();

                var self = $(this),
                    productId = self.data('id'),
                    ProductHandle = self.data('product-handle'),
                    idxArr = wishListsArr.indexOf(ProductHandle);

                if(!self.hasClass('whislist-added')) {
                    self.addClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.remove_wishlist);

                    if($('[data-wishlist-container]').length) {
                        ella.createWishListTplItem(ProductHandle);
                    };

                    wishListsArr.push(ProductHandle);
                    localStorage.setItem('items', JSON.stringify(wishListsArr));
                } else {
                    self.removeClass('whislist-added');
                    self.find('.wishlist-text').text(window.inventory_text.add_wishlist);

                    if($('[data-wishlist-added="wishlist-'+productId+'"]').length) {
                        $('[data-wishlist-added="wishlist-'+productId+'"]').remove();
                    }

                    wishListsArr.splice(idxArr, 1);
                    localStorage.setItem('items', JSON.stringify(wishListsArr));

                    if($('[data-wishlist-container]').length) {
                        ella.initWishListPagging();
                    };
                };

                ella.setAddedForWishlistIcon(ProductHandle);
            });
        },

        initWishListIcons: function() {
            var wishListItems = localStorage.getItem('items') ? JSON.parse(localStorage.getItem('items')) : [];

            if (!wishListItems.length) {
                return;
            }

            for (var i = 0; i < wishListItems.length; i++) {
                var icon = $('[data-product-handle="'+ wishListItems[i] +'"]');
                icon.addClass('whislist-added');
                icon.find('.wishlist-text').text(window.inventory_text.remove_wishlist);
            };
        },

        wrapTable: function(){
            var table = $('.tab-content').find('table');
            if(table.length){
                table.each(function(){
                    $(this).wrap('<div class="table-wrapper"></div>')
                })
            }
        },

        initBundleProducts: function() {

            var btnAddToCartSlt = '[data-bundle-addToCart]',
                bundleImagesSlide = $('[data-bundle-images-slider]'),
                btnToggleOptionsSlt = '.fbt-toogle-options',
                bundlePrice = $('.products-grouped-action .bundle-price'),
                bundleCheckbox = '.bundle-checkbox';

            var replaceDiscountRate = function(){
                if(bundlePrice.length > 0){
                    var discountRate = bundlePrice.data('discount-rate')*100;
                    var discountText = $('.products-grouped-action .discount-text span');
                    if(discountText.length > 0){
                        discountText.each(function(){
                            $(this).text($(this).text().replace('[discount]',discountRate)).parent().show();
                        })
                    }

                }
            }

            var bundleSlider = function() {
                if(bundleImagesSlide.length && bundleImagesSlide.not('.slick-initialized')) {
                    var images = bundleImagesSlide.data('rows');

                    bundleImagesSlide.slick({
                        get slidesToShow() {
                            if(images >= 5) {
                                return this.slidesToShow = 5;
                            }
                            else {
                                return this.slidesToShow = images;
                            }
                        },
                        slidesToScroll: 1,
                        dots: false,
                        infinite: false,
                        speed: 800,
                        nextArrow: '<button type="button" class="slick-next"><i class="fa fa-angle-right"></i></button>',
                        prevArrow: '<button type="button" class="slick-prev"><i class="fa fa-angle-left"></i></button>',
                        responsive: [{
                                breakpoint: 992,
                                settings: {
                                    get slidesToShow() {
                                        if(images >= 4) {
                                            return this.slidesToShow = 4;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    },
                                }
                            },
                            {
                                breakpoint: 480,
                                settings: {
                                    get slidesToShow() {
                                        if(images > 3) {
                                            return this.slidesToShow = 3;
                                        }
                                        else {
                                            return this.slidesToShow = images;
                                        }
                                    }
                                }
                            }
                        ]
                    });
                }
            };

            var toggleVariantOptions = function() {
                body.off('click.toggleVariantOptions', btnToggleOptionsSlt).on('click.toggleVariantOptions', btnToggleOptionsSlt, function(e) {
                    e.preventDefault();

                    $(this).next().slideToggle();
                })
            };

            var handleCheckedProduct = function() {
                // check all checkbox on loadpage
                $('.fbt-checkbox input').prop('checked',true);

                body.off('click.checkedProduct', bundleCheckbox).on('click.checkedProduct', bundleCheckbox, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        ipt = self.prev(),
                        dataId = self.closest('.fbt-product-item').data('bundle-product-id');

                    if(!ipt.prop('checked')) {
                        ipt.prop('checked', true);
                        $('[data-bundle-product-id="'+ dataId +'"]').addClass('isChecked');
                    } else {
                        ipt.prop('checked', false);

                        $('[data-bundle-product-id="'+ dataId +'"]').removeClass('isChecked');
                    };
                    updateTotalPrice();
                })
            };

            var initSelectedSwatch = function() {
                $('.fbt-product-item').each(function() {
                    var self = $(this);
                    var productId = self.data('bundle-product-id');
                    var selectedVariantId = $(this).find('[name="group_id"]').val();
                    var productOpts = self.find('.swatch');
                    var variantArr = window.productVariants[productId];

                    if (!variantArr) {
                        return;
                    }
                    // Get selected variant
                    var selectedVariant = variantArr.find(function(variant){
                        return variant.id == selectedVariantId
                    });

                    // Check selected swatch
                    productOpts.each(function(index){
                        var optionIndex = 'option' + (index + 1);
                        var selectedSwatch = $(this).find('.swatch-element[data-value="'+selectedVariant[optionIndex]+'"]');

                        selectedSwatch.find('input').prop('checked', true);
                    })

                });

            }

            var updateTotalPrice = function() {
                var bundleProItem = $('.fbt-product-item.isChecked');
                var bundlePrice = $('.products-grouped-action .bundle-price');
                var oldPrice = $('.products-grouped-action .old-price');
                var discountRate = bundlePrice.data('discount-rate');
                var totalPrice = 0;
                var checkedProductLength = $('.fbt-product-item.isChecked').length;
                var maxProduct = $('.fbt-product-item').length;

                bundleProItem.each(function() {
                    var selectElm = $(this).find('select[name=group_id]'),
                        inputElm = $(this).find('input[name=group_id]');

                    if(selectElm.length) {
                        var price = selectElm.find(':selected').data('price');
                    } else {
                      if (inputElm.length) {
                        var price = $(this).find('input[name=group_id]').data('price');
                      } else {
                        var price = $(this).find('input[name=id]').data('price');
                      }
                    }

                    if(price) {
                        totalPrice += price;

                        if(bundlePrice.length > 0 && oldPrice.length > 0){
                            oldPrice.html(Shopify.formatMoney(totalPrice, window.money_format));
                            bundlePrice.html(Shopify.formatMoney(totalPrice*(1 - discountRate), window.money_format));
                             if(checkedProductLength == maxProduct){
                                window.bundleMatch = true;
                                bundlePrice.show();
                                oldPrice.show();
                                $('.products-grouped-action .price').hide();
                            }else{
                                window.bundleMatch = false;
                                bundlePrice.hide();
                                oldPrice.hide();
                                $('.products-grouped-action .price').show();
                            }
                        }

                        $('.products-grouped-action .total .price').html(Shopify.formatMoney(totalPrice, window.money_format));


                    };
                })
                if (ella.checkNeedToConvertCurrency()) {
                  Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                }
            };

            var disableSoldoutSwatchAllBundles = function(){
                var productItem = $('.fbt-product-item');
                productItem.each(function(){
                    var self = $(this);
                    disableSoldoutSwatchBundle(self);
                })
            };

            var disableSoldoutSwatchBundle = function(productItem){
                var productId = productItem.data('bundle-product-id');
                var variantList = window.productVariants[productId];
                var options = productItem.find('[data-option-idx]');
                var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();

                options.each(function(){
                    var optionIndex = $(this).data('option-idx');
                    var swatch = $(this).find('.swatch-element');
                    switch (optionIndex) {
                        case 0:
                        // loop through all swatchs in option 1 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 1:
                        // loop through all swatchs in option 2 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                        case 2:
                        // loop through all swatchs in option 3 anh filter sold out swatch
                        swatch.each(function(){
                            var swatchVal = $(this).data('value');
                            var opt1Soldout = variantList.find(function(variant){
                                return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == swatchVal && variant.available;
                            });
                            if(opt1Soldout == undefined){
                                $(this).addClass('soldout');
                                $(this).find(':radio').prop('disabled',true);
                            }
                        })
                        break;
                    }
                });
            };

            var changeSwatchProductBundle = function() {
                var swatchSlt = '.fbt-product-item .swatch :radio';

                doc.off('change.changeBundleSwatch', swatchSlt).on('change.changeBundleSwatch', swatchSlt, function(e) {
                    var self = $(this);
                    if (self.prop('checked')) {
                        var productItem = $(this).closest('.fbt-product-item');
                        var productId = productItem.data('bundle-product-id');
                        var variantList = window.productVariants[productId];
                        var optionIdx = self.closest('[data-option-idx]').data('option-idx');
                        var swatches = productItem.find('.swatch-element');
                        var thisVal = self.val();
                        var selectedVariant;
                        var fbtPrice = productItem.find('.fbt-prices'),
                            priceSale = fbtPrice.find('.price-sale'),
                            productPrice = fbtPrice.find('[data-fbt-price-change]');
                        var productInput = productItem.find('[name=group_id]');
                        // Get selected swatches
                        var selectedSwatchOpt1 = productItem.find('[data-option-idx="0"]').find('input:checked').val();
                        var selectedSwatchOpt2 = productItem.find('[data-option-idx="1"]').find('input:checked').val();
                        var selectedSwatchOpt3 = productItem.find('[data-option-idx="2"]').find('input:checked').val();
                        // Re-active all swatches
                        swatches.removeClass('soldout');
                        swatches.find(':radio').prop('disabled',false);
                        // Auto get first available variant
                        switch (optionIdx){
                            case 0:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == thisVal && variant.option2 == selectedSwatchOpt2 && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                     // variant was sold out, so auto select other available variant
                                    var altAvailableVariants = variantList.find(function(variant){
                                        return variant.option1 == thisVal && variant.available;
                                    })
                                    selectedVariant =  altAvailableVariants;
                                };
                                break;
                            case 1:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                    selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #2')
                                };
                                break;
                            case 2:
                                var availableVariants = variantList.find(function(variant){
                                    return variant.option1 == selectedSwatchOpt1 && variant.option2 == selectedSwatchOpt2 && variant.option3 == thisVal && variant.available;
                                })
                                if(availableVariants != undefined){
                                   selectedVariant =  availableVariants;
                                }else{
                                    // Something went wrong, if correct, never meet this
                                    console.log('Bundle Error: variant was soldout, on option selection #3')
                                };
                                break;
                        }

                        productInput.val(selectedVariant.id);

                        // Check new swatch input
                        initSelectedSwatch();
                        // Disable sold out swatches base on new checked inputs
                        disableSoldoutSwatchBundle(productItem);

                        // Do select callback function
                         productPrice.html(Shopify.formatMoney(selectedVariant.price, window.money_format));

                         // change variant id of main product for adding to cart
                         productItem.find('input[name=id][type=hidden]').val(selectedVariant.id)

                            if (selectedVariant.compare_at_price > selectedVariant.price) {
                                priceSale.find('[data-fbt-price-change]').addClass('special-price');
                                priceSale.find('.old-price').html(Shopify.formatMoney(selectedVariant.compare_at_price, window.money_format)).show();
                            }
                            else {
                                priceSale.find('.old-price').hide();
                                priceSale.find('[data-fbt-price-change]').removeClass('special-price');
                            }

                            productItem.find('select').val(selectedVariant.id).trigger('change');

                            updateTotalPrice();
		
                      		if (ella.checkNeedToConvertCurrency()) {
                            	Currency.convertAll(window.shop_currency, $('#currencies .active').attr('data-currency'), 'span.money', 'money_format');
                            }

                            // Change product image
                            var newImage = productInput.find('option:selected',this).attr('data-image');
                            if(newImage != undefined){
                                var productImage = $('.fbt-image-item[data-bundle-product-id="'+productId+'"]').find('img');
                                productImage.attr('src',newImage)
                            }

                    }
                });
            };

            var initBundleAddToCart = function() {

                doc.off('click.bundleAddToCart', btnAddToCartSlt).on('click.bundleAddToCart', btnAddToCartSlt, function(e) {
                    e.preventDefault();

                    var self = $(this),
                        form = self.closest('form'),
                        curPro = form.find('[data-collections-related]'),
                        handle = curPro.data('collections-related'),
                        bundleProduct = form.find('[data-grouped-product-item].isChecked'),
                        title = $('h1.product-title').text(),
                        image = $('[id^="product-featured-image"]').first().attr('src');

                    if(self.attr('disabled') !== "disabled") {
                        ella.showLoading();
                        Shopify.queue = [];
                        var i = 0;
                        bundleProduct.each(function() {
                            var variantId = $(this).find('[name=group_id]').val();

                            if(variantId) {
                                Shopify.queue.push( {
                                    variantId: variantId,
                                    quantity: 1
                                });

                            };
                        });

                        Shopify.moveAlong = function() {
                            if (Shopify.queue.length) {
                                var request = Shopify.queue.shift();
                                ella.showLoading();
                                Shopify.addItem(request.variantId, request.quantity, Shopify.moveAlong);
                                ella.ellaTimeout = setTimeout(function(){
                                    ella.hideLoading();
                                },5000)
                            }
                            else {
                                ella.hideLoading();
                                var variant_id = curPro.find('[name=id]').val();
                                var formData = $(self.data('form-id'));
                                var data = formData.serialize();
                                var quantity = 1;
                                switch (window.ajax_cart) {
                                    case "none":
                                        ella.doAjaxAddToCart(data, handle,true);
                                        break;

                                    case "normal":
                                        ella.doAjaxAddToCartNormal(data, title,image);
                                        break;

                                    case "upsell":
                                        ella.doAjaxAddToCart(data, handle);
                                        break;
                                };
                             
                                // add discount code first
                                try{
                                    var discount_code = "FBT-BUNDLE-"+ meta.product.id;
                                    ella.apply_discount( discount_code );
                                }
                                catch(e){
                                    console.log(e)
                                }
                                return false;
                            };
                        }

                        Shopify.moveAlong();

                    }

                });

                 
            };
            replaceDiscountRate();
            bundleSlider();
            toggleVariantOptions();
            handleCheckedProduct();
            initSelectedSwatch();
            disableSoldoutSwatchAllBundles();
            changeSwatchProductBundle();
            updateTotalPrice();
            initBundleAddToCart();
        },
        apply_discount: function( discount_code ){
            if(window.bundleMatch){
                $.ajax({
                    url: "/discount/" + discount_code,
                    success: function(response){
                        console.log('Discount code added');
                    }
                });
            }

        },
        checkBundleProducts: function() {
          var discount_code = $.cookie('discount_code');
          if( discount_code != "" && discount_code != null ){
            var mainProduct = discount_code.replace('FBT-BUNDLE-', '');
            if( mainProduct != '')
                getShoppingCart();
          }

            function getShoppingCart () {

                if( $('ul.cart-list li').length > 0 ) {
                var check = false;
                var cart = [];
                $('ul.cart-list li').each(function(i, el) {
                  var product_id = $(el).data('product_id');
                  if( product_id == mainProduct){
                    check = true;
                  }
                  if(cart.indexOf( product_id ) == -1)
                    cart.push( product_id );
                });

                if( check == true ){
                  $.ajax({
                    url: "/collections/bundle-" + mainProduct + "?view=bundle-json",
                    success: function(response){
                      var myBundle = JSON.parse(response);
                      if(cart.length >= myBundle.results.length) {
                        checkProductInCart(cart, myBundle.results);
                      }
                      else
                        remove_discount();
                    }
                  });
                }
                else 
                  remove_discount();
              }

/*
              $.ajax({
                type: "Post",
                url: '/cart.js',
                dataType: 'json',
                success: function (data) {
                  if(data != null ) {
                    if( data.item_count > 0 ) {
                        var check = false;
                        var cart = [];
                        data.items.forEach(function(el) {
                          if(el.product_id == mainProduct){
                                check = true;
                          }
                          if(cart.indexOf(el.product_id) == -1)
                            cart.push(el.product_id);
                        });
                      if( check == true ){
                        $.ajax({
                          url: "/collections/bundle-" + mainProduct + "?view=json",
                          success: function(response){
                            var myBundle = JSON.parse(response);
                            if(cart.length >= myBundle.results.length) {
                              checkProductInCart(cart, myBundle.results);
                            }
                            else
                              remove_discount();
                          }
                        });
                      }
                      else
                        remove_discount();
                    }
                  }
                },
                error: function (xhr, text) {

                },
            });
             */
          }

          function checkProductInCart(cart, collection){
            var i = 0;
            collection.forEach(function(el) {
              if(cart.indexOf(el.id) != -1) {
                i++;
              }
            });
            if( i != collection.length)
              remove_discount();
          }

          function remove_discount(){
            $.ajax({
              url: "/checkout?discount=%20",
              success: function(response){
                // $.cookie('discount_code', '');
                console.log('Discount code removed')
              }
            });
          }
        },
        hide_filter: function(){
          $(".sidebar-tags .widget-content ul").each(function() {   
            if ($(this).children('li').length > 0) {
              $(this).parents('.sidebar-tags').show();
            } else { 
              $(this).parents('.sidebar-tags').hide();
            }
          });
        }
    };



})(jQuery);
