import {
  Component,
  OnInit
} from '@angular/core';

declare var $: any;

@Component({
  selector: 'app-press',
  templateUrl: './press.component.html',
  styleUrls: ['./press.component.scss']
})

export class PressComponent implements OnInit {

  constructor() {}



  ngOnInit() {
    // Make the class full height (fix for the scrolling problem in safari and chorme with 100vh)
    $('.content-container').css('height', $(window).height());

    //Horizontal Scroll
    var sIndex = 0; // Slide index
    $('#fullpage').fullpage({
      verticalCentered: false,
      scrollingSpeed: 1000,
      easing: 'easeInOutCubic',
      easingcss3: 'ease',
      controlArrows: false,
      scrollOverflow: true,
      lockAnchors: true,
      paddingTop: '0',
      paddingBottom: '0',
      bigSectionsDestination: 'top',
      slidesNavigation: true,
      normalScrollElements: '.cart_modal',
      onLeave: (index, nextIndex, direction) => {
        // Avoid going up if you are in the first slide
        if (direction == 'up' && sIndex == 0)
          return false;

        if (direction == 'down') {
          console.log($.fn.fullpage.moveSlideRight());
          return false;
        }
        // Move to the prev slide
        else if (direction == 'up') {
          $.fn.fullpage.moveSlideLeft();
          return false;
        }
      },
      afterSlideLoad: (anchorLink, index, slideAnchor, slideIndex) => {
        // Save the slide index in a global variable
        sIndex = slideIndex;
      }
    })

	// in mobile we use the slick slider not fullpage
    $('.mobile').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      autoplay: true,
      autoplaySpeed: 2000,
      arrows: false,
    });
  }

  ngOnDestroy() {
    // Destroy the plugin
    $.fn.fullpage.destroy('all');
  }



}
