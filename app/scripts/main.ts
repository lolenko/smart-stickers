///<reference path="vendor/jquery.d.ts" />

import jquery = require('vendor/jquery');
import SmartStickers = require('SmartStickers');
import Sticker = require('Sticker');

if (jquery) $.noop();

/*
 Чего вообще я требую:
   1. Стикеры должны стыковаться друг с другом:
        а) Верхом к нижему краю вышележащего стикера либо верхней границы окна
        б) Низом за нижнюю границу родительского элемента
        в) Дочерний стикер не должен стыковаться с родительским
        г) не понятно как брать начальное положение: возможно считать положение и сортировать по оси ординат,
        точно: проверку на возможность межстыковывания
        д) не понятно как их распределять по z-index'у: интуитивней вего по порядку - верхние ближе нижних: но судя по
        всему возникнут проблемы с элементами  имеющие разные контексты позиционирования
    2. Хорошо бы было иметь разныме типы стикеров:
        а) Стикеры стэкающиеся к верху
        б) Стикеры стэкающиеся к нижу
        в) смешанный тип - меняющий тип стика в зависимости от направления скрола
    3. Можно создавать множество контекстов стыковывания которые сами могут являтся стикерами
    (например таким контекстов может быть элементы с оверфлоу: скролл или ифрэйм)
    4. Решить технические проблеммы скачющих стиков в браузерах с большим шагом скролла*/

var ss = new SmartStickers(window);
$('.sticker').each(function(i, el) {
    new Sticker(el);
});