/*
 *  Требоавания: кроссбраузерность, кроссплатформенность,
 *  плавность сопристыковывания стиков
 *
 *  Идея: отлавливать нативный скролл и скроллировать самим в одном хендлере
 *  вместе с позиционировыванием стиков.
 *
 *  Как скроллировать?: в блоке со скроллом ставим распорку по высоте и отлавливаем скролл,
 *  считаем размер скролла и двигаем абсолютно спозиционированный контент
 *
 *  Проблема: прокрутка колеса мыши над абсолютно спозиционированным контентом
 *  не приводит к скроллу родительского блока в браузерах и это очень печально
 *  а именно в декстопных webKit'ах и firefox'е   в IE8 работает (9, 10, 11 не проверял),
 *  в Opera 12 тоже работает.. так что хз, что это - баг или фича?
 *  тачскрины надо тоже тестить..
 *  Тем неменее..
 *
 *  Решение: а сцука нет решения, поэтому...
 *
 *  Варианты предпологаемых решений:
 *       Кастыль 1. Отказатся от этой затеи
 *       Кастыль 2. Пробрасывать события колеса мыши от контента к скроллируемому блоку.
 *                 В вебките можно красиво пробросить событие прокрутки нативным приопретарным API
 *                 только хз что будет с тачевой прокруткой
 *                 в фаерфоксе можно отловить прокрутку колеса и странсферить в скролл (костыльненько)
 *       Кастыль 3. point-events: none контетну и слушаем все мышинные и тачевые события
 *                 над скроллируемым блоком и диспатчем элементу в контенте найденному по координатам мыши.
 *                 Походу не совсем реально.. лес в который всё это может завести оочень дремуч
 *                 чего только стоит тот же диспатч скролла и выделение текста курсором
 *       Кастыль 4. Делаем всю эту лабуду только на главный скролл окна там событие вспывает до главного скролла и короче всё круто
 *
 *  Бляяя не один из костылей оказался работосвособным.. поэтому сдержанно переименовываем этот виджет в window-scroll который по
 *  сути будет являтся стики менеджером без какой либо кастомизации скроллбара
 * *//*


import widget = require("portal/widget");
import Sticker = require("./sticker");
import StickersStack = require("./StickersStack");

class WindowScroll extends widget.Widget {
    constructor(element, config) {
        super(element, config);
        this.initEls();
        this.resize();
        setTimeout($.proxy(this.resize, this), 5000);
        this.els.$window.on('scroll', this.onScroll.bind(this));
        this.els.$window.on('resize', this.resize.bind(this));

        this.stacks = {
            default: new StickersStack('default'),
            bottom: new StickersStack('bottom'),
            scroll: new StickersStack('scroll')
        };
        this.rootNode.on('registerWidget.sticker', this.registerSticker.bind(this));
    }

    sizes;
    els;
    private stacks:{default:StickersStack; bottom:StickersStack; scroll:StickersStack};
    private scrollTop:number = 0;
    private oldScrollTop:number = 0;
    private scrollDirection:string;

    initEls():WindowScroll {
        this.els = {
            $spike: this.getNode('spike'),
            $wrapper: this.getNode('wrapper'),
            $inner: this.getNode('inner'),
            $window: $(window)
        };
        return this;
    }

    resize():WindowScroll {
        var els = this.els;
        this.sizes = {
            innerHeight: els.$inner.outerHeight()
        };
        els.$spike.css({height: this.sizes.innerHeight + 'px'});
        return this;
    }

    onScroll(e) {
        this.scrollTop = this.els.$window.scrollTop();
        this.scrollDirection = this.scrollTop > this.oldScrollTop ? 'down' : 'up';
        this.oldScrollTop = this.scrollTop;

        this.innerScroll();
        this.repositionStickers();
    }

    innerScroll():WindowScroll {
        this.els.$inner.css({top: -this.scrollTop});
        return this;
    }

    repositionStickers():WindowScroll {
        for (var stack in this.stacks) {
            this.stacks[stack].repositionStickers(this.scrollTop);
        }
        return this;
    }

    registerSticker(e:JQueryEventObject, data:{widget:Sticker}) {
        var sticker = data.widget;
        sticker.rootNode.on("remove", this.unregisterSticker.bind(this));

        this.stacks[sticker.behavior].push(sticker);
        this.repositionStickers();
    }


    unregisterSticker(e:JQueryEventObject) {

    }

}
export = WindowScroll;

*/
