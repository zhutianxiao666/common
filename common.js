// 一些公共方法

import showSvg from "@/js/common/commons/showSvg";
// 返回数组
const getArr = function (reportName,tdId) {
    return $(`div[widgetname^="${reportName.toUpperCase()}"] td[id^="${tdId.toUpperCase()+'-0-'}"]`).text().split(',');
};

// 返回单元格
const getTd = function(reportName,tdId) {
    return $(`div[widgetname^="${reportName.toUpperCase()}"] td[id^="${tdId.toUpperCase()+'-0-'}"]`);
};
const getData = function (reportName,tdId) {
    return $(`div[widgetname^="${reportName.toUpperCase()}"] td[id^="${tdId.toUpperCase()+'-0-'}"]`).text();
};
const textAlign = function ($ele,type = 'center') {
    setTimeout(function () {
        const list1 = [];
        let num = 0;
        switch (type) {
            case 'center':
                num = -2;
                break;
            case "right":
                num = -1;
                break;
        }
        $ele = $ele.children().length ? $ele.children() : $ele;

        $ele.each((index ,value) => {
            list1.push(value.getBBox().width);

        });

        list1.forEach((value, index) => {
            $ele.eq(index).attr('transform',`translate(${value/num},0)`);
            // $ele.eq(index).attr('x',$ele.eq(index).attr('x') - value / 2)
        });
    },100)
}
// 字体居中
const textCenter = function ($ele) {
    const list1 = []
    $ele = $ele.children().length ? $ele.children() : $ele;
    $ele.each((index ,value) => {
        list1.push(value.getBBox().width);
    });
    list1.forEach((value, index) => {
        // $ele.eq(index).attr('transform',-value/2);
        $ele.eq(index).attr('x',$ele.eq(index).attr('x') - value / 2)
    });
};

const textRight = function ($ele) {
    const list1 = []
    $ele = $ele.children().length ? $ele.children() : $ele;
    $ele.each((index ,value) => {
        list1.push(value.getBBox().width);
    });
    list1.forEach((value, index) => {
        $ele.eq(index).attr('x',$ele.eq(index).attr('x') - value )
    });
};
// 转换数组
const Q_QArr = function (data) {
    const list1 = data.split('-*-,');
    list1[list1.length - 1] = list1[list1.length - 1].replace('-*-','');
    const list2 = [];
    list1.forEach(value => {
        list2.push(value.split('Q_Q'));
    });
    return list2;
};
const Q_QObj = function (data) {
    const obj = {};

    const list1 = Q_QArr(data);
    let max = list1[0][2] * 1;
    let min = list1[0][2] * 1;
    list1.forEach((value, index) => {
        if (value[2] * 1 > max) {
            max = value[2];
        }else {
            min = value[2];
        };
        if (!obj[value[0]]) {
           obj[value[0]] = {}
        };
        obj[value[0]][value[1]] = value[2];
    });
    return {obj,max,min};
};
const getUnitCode = function (defaultCode) {
    const list = window.location.search.substr(1).split('&');
    const unit_code = list.find(value => value.toLowerCase().includes('unit_code') || value.toLowerCase().includes('unit_id'));
    if (typeof unit_code === 'string') {
        return  unit_code.split('=')[1];
    }else {
        return defaultCode ? defaultCode : '';
    }
}
const TipsText = function ({ x,y,isEnter,num,orderby}) {
    const $Tip = $('#TipsText');
    if (isEnter) {
        // 判断是进入还是离开
        // 显示
        $Tip.html('值:'+num + '<br>' + '日期:' + orderby)
            .css({
                'left':x - 30,
                'top':y + 30
            }).stop().fadeToggle(1000)
    }else {
        $Tip.stop().fadeToggle(1000)
    }
}
// 导出
export {
    getTd,
    getArr,
    Q_QArr,
    textCenter,
    textRight,
    getData,
    Q_QObj,
    getUnitCode,
    TipsText,
    showSvg,
    textAlign
};