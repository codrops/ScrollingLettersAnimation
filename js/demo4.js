/**
 * demo1.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    class Entry {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.image = this.DOM.el.querySelector('.content__img');
            this.DOM.title = {word: this.DOM.el.querySelector('.content__text')};
            charming(this.DOM.title.word);
            this.DOM.title.letters = Array.from(this.DOM.title.word.querySelectorAll('span'));
            this.DOM.title.letters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            this.lettersTotal = this.DOM.title.letters.length;
            observer.observe(this.DOM.el);
        }
        enter(direction = 'down') {
            this.DOM.title.word.style.opacity = 1;
            
            this.DOM.title.letters.forEach((letter,pos) => {
                anime.remove(letter);
                let letterAnim = {
                    targets: letter,
                    duration: 500,
                    delay: () => pos*80,
                    easing: 'easeOutQuint',
                    opacity: {
                        value: [0,1],
                        duration: 400,
                        easing: 'linear'
                    }
                };
                if ( anime.random(0,1) > 0.5 ) {
                    letterAnim.translateX = [anime.random(0,1) > 0.5 ? -window.innerWidth :  window.innerWidth, 0];
                }
                else {
                    letterAnim.translateY = [anime.random(0,1) > 0.5 ? -window.innerHeight :  window.innerHeight, 0];
                }
                anime(letterAnim);
            });

            anime.remove(this.DOM.image);
            anime({
                targets: this.DOM.image,
                duration: 800,
                easing: 'easeOutQuad',
                rotate: () => direction === 'down' ? 5 : -5
            });
        }
        exit(direction = 'down') {
            this.DOM.title.letters.forEach((letter,pos) => {
                anime.remove(letter);
                let letterAnim = {
                    targets: letter,
                    duration: 500,
                    delay: () => pos*80,
                    easing: 'easeOutQuint',
                    opacity: {
                        value: 0,
                        duration: 200,
                        easing: 'linear'
                    }
                };
                if ( anime.random(0,1) > 0.5 ) {
                    letterAnim.translateX = [0,anime.random(0,1) > 0.5 ? -window.innerWidth :  window.innerWidth];
                }
                else {
                    letterAnim.translateY = [0,anime.random(0,1) > 0.5 ? -window.innerHeight :  window.innerHeight];
                }
                anime(letterAnim);
            });
            
            anime.remove(this.DOM.image);
            anime({
                targets: this.DOM.image,
                duration: 800,
                easing: 'easeOutQuad',
                rotate: 0
            });
        }
    }

    let observer;
    let current = -1;
    let allentries = [];
    const sections = Array.from(document.querySelectorAll('.content__section'));
    // Preload all the images in the page..
	imagesLoaded(document.querySelectorAll('.content__img'), () => {
        document.body.classList.remove('loading');
        if ('IntersectionObserver' in window) {
            document.body.classList.add('ioapi');

            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if ( entry.intersectionRatio > 0.5 ) {
                        const newcurrent = sections.indexOf(entry.target);
                        if ( newcurrent === current ) return;
                        const direction = newcurrent > current;
                        if (current >= 0 ) {
                            allentries[current].exit(direction ? 'down' : 'up');
                        }
                        allentries[newcurrent].enter(direction ? 'down' : 'up');
                        current = newcurrent;
                    }
                });
            }, { threshold: 0.5 });
            
            sections.forEach(section => allentries.push(new Entry(section)));
        }
    });
}