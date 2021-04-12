import {Q_QArr,textRight,textCenter,TipsText} from "../common";
import {$svg} from "@/js/common/init";
// 有n条折线图
// data 为字符串 结构 日期Q_Q分类一Q_Q分类二
// order 为数组[‘分类一’，‘分类二’]
export default function ({$ele,data,order,x,y,width,height,colors}) {
    const obj = {};
    // 处理数据
    data = typeof data == 'string' ? Q_QArr(data) : data;
    height = height || 100;
    // 处理$ele
    $ele = typeof $ele == 'string' ? $svg.find($ele) : $ele;
    if (!$ele[0]) {
        console.log('元素查询失败，请重新检查$ele',$ele);
        return;
    };
    // 求最大值最小值
    let min = Number(data[0][1]);
    let max = Number(data[0][1]);
    const widthSmall = width / (data.length - 1);
    data.forEach(value => {
        value.slice(1).forEach(value1 => {
            if (min > value1) {
                min = Number(value1);
            }else if (max < value1) {
                max = Number(value1);
            };
        });
    });
    if(max < 0) max = 0;
    if(min > 0 ) min = 0;
    const min_max = max - min;
    // 渲染path
    const pathArr = [];
    const pathFillArr = [];
    const XlineArr = [];
    const YlineArr = [];
    const circleArr = [];
    const DIFF_index = order.indexOf('DIFF');
    order.forEach(() => {
        pathArr.push([]);
        pathFillArr.push([]);
        circleArr.push([]);
    })
    data.forEach((value,index) => {
        // X轴标签
        // XlineArr.push(`<tspan x="${index * widthSmall}" fill="#727171" font-family="'ArialMT'" font-size="22.8231">${value[0]}</tspan>`);
        XlineArr.push(`<text x="${x + index * widthSmall}" y="${y + 27}" fill="#727171" font-family="'ArialMT'" font-size="22.8231">${value[0]}</text>`);
        value.slice(1).forEach((value1,index1) => {
            // 首个
            if (index == 0) {
                pathArr[index1].push(`M${x},${y - (value1 - min) / min_max * height} L`);
                pathFillArr[index1].push(`M${x},${y - (0 - min) / min_max * height} L ${x},${y - (value1 - min) / min_max * height}`);
                // 小圆点
                circleArr[index1].push(`<circle r="4" cx="${x}" cy="${y - (value1 - min) / min_max * height}" stroke="rgba(0,0,0,0)" stroke-width="50" fill="${(index1 == DIFF_index && value1 >= 3 &&  value1 <= 5)?"red":colors[index1]}" order="${index1 + 1}" data-index="${index}"></circle>`);
            } else {
                pathArr[index1].push(` ${x + widthSmall * index},${y - (value1 - min) / min_max * height}`);
                // 小圆点
                circleArr[index1].push(`<circle r="4" cx="${x + widthSmall * index}" cy="${y - (value1 - min) / min_max * height}" stroke="rgba(0,0,0,0)" stroke-width="50" fill="${(index1 == DIFF_index && value1 >= 3 &&  value1 <= 5)?"red":colors[index1]}" order="${index1 + 1}" data-index="${index}"></circle>`);
                if (index == data.length - 1) {
                    pathFillArr[index1].push(` ${x + widthSmall * index},${y - (value1 - min) / min_max * height}  ${x + width},${y - (0 - min) / min_max * height} z`);
                }else {
                    pathFillArr[index1].push(` ${x + widthSmall * index},${y - (value1 - min) / min_max * height}`);
                }
            };
        });
    });
    // Y轴标签
    const Ynum = 6;    //Y轴数字个数
    const YSmall = Math.floor(min_max/(Ynum - 1));
    let Ysum = Math.ceil(min);
    for(var i = 0; i < Ynum; i++){
        YlineArr.push(`<tspan x="0" y="${- (Ysum - min)* height / min_max}" fill="#727171" font-family="'ArialMT'" font-size="22.8231">${Ysum}</tspan>`);
        Ysum += YSmall;
    }
    if(data != ''){
        textRight($ele.find('.Yline').html(YlineArr.join('')));
        textCenter($ele.find('.Xline').html(XlineArr.join('')));
        // Y=0轴线
        $ele.find('.Y0').attr({
            'y1':y + min / min_max * height,
            'y2':y + min / min_max * height
        })
    }
    let paths = [];
    let pathFills = [];
    // 拼接数组，产生path路径(这里面是d属性的数据 还需要你自己拼接到path中)
    order.forEach((value,index) => {
        let path = '';
        let pathFill = '';
        pathArr[index].join(' ')
        pathArr[index].forEach((value1,index1) =>{
            path += pathArr[index][index1];
        });
        pathFillArr[index].forEach((value1,index1) =>{
            pathFill += pathFillArr[index][index1];
        });
        paths.push(path);
        pathFills.push(pathFill)
        pathFillArr[index].join('')

    });
    order.forEach((value,index) => {'d',pathFills[index]
        $ele.find(`.path[data-index="${index}"]`).attr({
            'd':paths[index],
            'stroke': colors[index]
        });
        $ele.find(`.pathFill[data-index="${index}"]`).attr({
            'd': pathFills[index],
            'fill': colors[index]
        });
    });

    $ele.find('#littleCircle').html(circleArr.join(' '));
    $('#littleCircle circle').mouseenter(function (e) {
        const data_index = $(this).attr('data-index');
        const order = $(this).attr('order');
        $(this).attr('r','8');
        TipsText({
            x:e.clientX,
            y:e.clientY,
            isEnter:true,
            num:data[data_index][order],
            orderby:data[data_index][0]
        });
    }).mouseleave(function () {
        $(this).attr('r','4');
        TipsText({
            isEnter:false
        });
    })
};