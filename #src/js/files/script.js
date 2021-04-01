let fullpageLoad = false;

//Собираем все заголовки
let navigationTooltips = [];
$.each($('.sector'), function (i, v) {
   let tooltips = $(v).attr('data-tooltips');
   navigationTooltips.push(tooltips);
});


function fullpageDesktopInit() {
   $('.sectors').fullpage({
      scrollOverflow: true,
      scrollingSpeed: 700,
      verticalCentered: false,
      navigation: true,
      navigationTooltips: navigationTooltips,
      showActiveTooltip: true,
      sectionSelector: '.sector',
      afterLoad: function (origin, destination, direction) {
         fullpageLoad = true;
         activeTooltip();
      },
      afterRender: function () {
         $('#fp-nav').append('<span class="sector__tooltipe"></span>');
         $('#fp-nav').append('<span class="sector__next"></span>');
         activeTooltip();
         $('.sector__next').click(function () {
            fullpage_api.moveSectionDown();
         });
      }
   });
}

function fullpageMobileInit() {
   $('.sectors').fullpage({
      scrollOverflow: true,
      scrollingSpeed: 700,
      navigation: false,
      verticalCentered: false,
      navigationTooltips: navigationTooltips,
      showActiveTooltip: false,
      sectionSelector: '.sector',
      afterLoad: function (origin, destination, direction) {
         activeTooltip();
         fullpageLoad = true;
      }
   });
}

function fullpageDesktop() {
   if (fullpageLoad) {
      let activeSection = fullpage_api.getActiveSection().index + 1;
      fullpage_api.destroy('all');
      fullpageDesktopInit();
      fullpage_api.silentMoveTo(activeSection);
   } else {
      fullpageDesktopInit();
   }
}


function fullpageMobile() {
   if (fullpageLoad) {
      let activeSection = fullpage_api.getActiveSection().index + 1;
      fullpage_api.destroy('all');
      fullpageMobileInit();
      fullpage_api.silentMoveTo(activeSection);
   } else {
      fullpageMobileInit();
   }
}

//Название следующей после активного слайда
function activeTooltip() {
   $.each($('#fp-nav li a.active'), function (i, v) {
      let next = $(v).parent().next().find('.fp-sr-only').text();
      $('.sector__tooltipe').html(next);
   });
}


//ИНИЦИАЛИЗИРУЕМ FULLPAGE НА РАЗНЫХ УСТРОЙСТВАХ
let md2 = window.matchMedia("(max-width: 991.98px)");
let md3 = window.matchMedia("(max-width: 767.98px)");

function mediaQuary(md2) {
   !md2.matches ? fullpageDesktop() : fullpageMobile();
}

mediaQuary(md2);
md2.addListener(mediaQuary);


//БАГ С ОТКРЫТИЕМ МЕНЮ
$('.icon-menu').click(function () {
   if (!$(this).hasClass('_active')) {
      fullpage_api.setResponsive(true);
   } else {
      fullpage_api.setResponsive(false);
   }
});


//КЛИК ВНЕ МЕНЮ
$(document).click(function (e) {
   let
      menuBody = $(".menu__body"),
      menuIcon = $(".menu__icon");
   if ($(e.target).closest(menuBody).length || $(e.target).closest(menuIcon).length) {
      // клик внутри элемента 
      return;
   }
   $(menuBody).removeClass('_active');
   $(menuIcon).removeClass('_active');
   body_lock_remove(500);
   fullpage_api.setResponsive(false);
});

let original = document.querySelector('.submenu-model__container').innerHTML;


//? МОДЕЛЬНИЙ РЯД=================================================================

let modelMenuHover = function () {
   let li = document.querySelectorAll('.menu-model__body li');
   let submenu = document.querySelectorAll('.submenu-model__item');

   for (let index = 0; index < li.length; index++) {
      const liItem = li[index];
      const liAttr = liItem.getAttribute('data-hover');
      liItem.onmouseenter = function () {
         for (let index = 0; index < submenu.length; index++) {
            const submenuItem = submenu[index];
            const submenuAttr = submenuItem.getAttribute('data-hover');
            if (submenuAttr == liAttr) {
               submenuItem.classList.add('_active');
               liItem.classList.add('_hover');
            } else {
               submenuItem.classList.remove('_active');
               for (let index = 0; index < li.length; index++) {
                  const liItem2 = li[index];
                  liItem2.classList.remove('_hover');
               }
            }
         }
      };
   }

   for (let index = 0; index < submenu.length; index++) {
      const delay = 100;
      const submenuItem = submenu[index];
      const submenuAttr = submenuItem.getAttribute('data-hover');
      submenuItem.onmouseenter = function () {
         for (let index = 0; index < li.length; index++) {
            const liItem = li[index];
            const liAttr = liItem.getAttribute('data-hover');

            if (liAttr == submenuAttr) {
               liItem.classList.add('_hover');
               submenuItem.classList.add('_active');
            } else {
               liItem.classList.remove('_hover');
               //submenuItem.classList.remove('_active');
            }
         }
      }

      submenuItem.addEventListener('mouseleave', e => {
         for (let index = 0; index < li.length; index++) {
            const liItem = li[index];
            liItem.classList.remove('_hover');
         }
         for (let index = 0; index < submenu.length; index++) {
            const submenuItem = submenu[index];
            submenuItem.classList.remove('_active');
         }
      });
   }
}

modelMenuHover();

function menuNoClick(md2) {
   let links = document.querySelector('.menu-model__body').querySelectorAll('a');
   if (!md2.matches) {
      for (let index = 0; index < links.length; index++) {
         const link = links[index];
         link.onclick = function () { return false; }
      }
   } else {
      for (let index = 0; index < links.length; index++) {
         const link = links[index];
         link.onclick = function () { return true; }
      }
   }
}

menuNoClick(md2);
md2.addListener(menuNoClick);


//? Замением label возле меню

function replaceLabel() {
   document.addEventListener('wheel', function () {
      let body = document.querySelector('body').classList.value;
      let label = document.querySelector('.menu__icon label');
      let parent = label.parentElement;
      if (body.match('fp-viewing-3')) {
         label.innerHTML = 'Новини';
         label.classList.add('title__main');
      } else {
         label.innerHTML = 'Меню';
         label.classList.remove('title__main');
      }
   })
}
replaceLabel();
