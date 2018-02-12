/**
 * demo2.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2018, Codrops
 * http://www.codrops.com
 */
{
    const chars = ['$','%','#','@','&','(',')','=','*','/'];
    const charsTotal = chars.length;
    const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    class Entry {
        constructor(el) {
            this.DOM = {el: el};
            this.DOM.image = this.DOM.el.querySelector('.content__img');
            this.DOM.title = {word: this.DOM.el.querySelector('.content__text')};
            charming(this.DOM.title.word);
            this.DOM.title.letters = Array.from(this.DOM.title.word.querySelectorAll('span')).sort(() => 0.5 - Math.random());
            this.DOM.title.letters.forEach(letter => letter.dataset.initial = letter.innerHTML);
            this.lettersTotal = this.DOM.title.letters.length;
            observer.observe(this.DOM.el);
        }
        enter(direction = 'down') {
            this.DOM.title.word.style.opacity = 1;

            this.timeouts = [];
            this.complete = false;
            let cnt = 0;
            this.DOM.title.letters.forEach((letter, pos) => { 
                let loopTimeout;
                const loop = () => {
                    letter.innerHTML = chars[getRandomInt(0,charsTotal-1)];
                    letter.style.color = ['#2c0baf','#03a9f4','#062d86'][getRandomInt(0,2)];
                    loopTimeout = setTimeout(loop, getRandomInt(75,150));
                    this.timeouts.push(loopTimeout);
                };
                loop();

                const timeout = setTimeout(() => {
                    clearTimeout(loopTimeout);
                    letter.innerHTML = letter.dataset.initial;
                    letter.style.color = '#934ae8';
                    ++cnt;
                    if ( cnt === this.lettersTotal ) {
                        this.complete = true;
                    }
                }, pos*80+400);

                this.timeouts.push(timeout);
            });
        }
        exit(direction = 'down') {
            this.DOM.title.word.style.opacity = 0;
            if ( this.complete ) return;
            for ( let i = 0, len = this.timeouts.length; i <= len - 1; ++i ) {
                clearTimeout(this.timeouts[i]);
            }
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