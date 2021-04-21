// order 分组依据， data 数据 type 数据展示形式（如：百分比形式，保留几位小数等等）
/*
* 数据结构
*  {
*    分类名1: [num1,num2],
*    分类名2: [num1,num2]
* }
* */
import {sum, arr2obj, textAlign, Q_QArr} from "@/js/common/common";

export default function ({ele,x,y,rOut,rIn,data,type='100%',color,backgroundColor,title,label}) {

    if (data instanceof  Array) {
        data = arr2obj(data);
    }else if (typeof data == 'string') {
        data = arr2obj(Q_QArr(data));
    }
    ele = typeof ele == 'string' ? document.querySelector(ele) : ele;
    color = color || ['yellow','blue','green','orange'];
    backgroundColor = backgroundColor || '#050d50';

    const newTitle = {'fontSize':'30', 'color':'white'};
    const newLabel = {fontSize:25,color:'white'};

    Object.assign(newTitle,title);
    Object.assign(newLabel,label);

    const numArr = [];
    const angleArr = []; // 角度

    for (let k in data) {
        let num = 0;
        // 求出各分类的数据
        data[k].forEach(value => {
            num += Number(value);
        });
        numArr.push(num);
    };

    // 将数组求和
    const total = sum(numArr);
    if (Number(total) === 0) {
        return false
    };
    // 得到各角度的列表
    numArr.forEach((value,index) => {
        angleArr.push({
            start: Math.PI * 2 * (sum(numArr.slice(0,index)) / total),
            end: Math.PI * 2 * (sum(numArr.slice(0,index + 1)) / total),

        });
    });


    // 圆心x y 点
    const rx = x - rOut;
    const ry = y;

    // 渲染svg
    const pathArr = [];
    const textArr = [];
    const rCenter = (rOut + rIn) / 2;
    angleArr.forEach((value, index) => {
        let str = ''
        if (numArr[index] / total == 1) {
            str = `<circle cx="${rx}" cy="${ry}" r="${rOut}" fill="${color[index]}"></circle>`;
        } else if (numArr[index] / total > 0.5) {
            str = `<path d="M${rx},${ry} l${Math.cos(value.start) * rOut},${ - Math.sin(value.start) * rOut} A${rOut},${rOut} 0,1,0 ${rx + Math.cos(value.end) * rOut},${ry - Math.sin(value.end) * rOut} Z" fill="${color[index]}"  ></path>`;
        } else {
            str = `<path d="M${rx},${ry} l${Math.cos(value.start) * rOut},${ - Math.sin(value.start) * rOut} A${rOut},${rOut} 0,0,0 ${rx + Math.cos(value.end) * rOut},${ry - Math.sin(value.end) * rOut} Z" fill="${color[index]}"  ></path>`;
        };
        // 标记
        if (numArr[index] / total > 0 ) {
            textArr.push(`<text x="${rx + Math.cos((value.start + value.end)/2) * rCenter}" y="${ry - Math.sin((value.start + value.end) / 2 * rCenter) + newLabel.fontSize / 2}" font-size="${newLabel.fontSize}" fill="${newLabel.color}" class="label">${numArr[index] / total * 100 + '%'}</text>`)
        }
        pathArr.push(str);

    });

    // 添加背景颜色
    rIn && pathArr.push(`<circle r="${rIn}" fill="${backgroundColor}" cx="${rx}" cy="${ry}"></circle>`);
    // 添加title
    title && textArr.push(`<text x="${rx}" y="${ry + newTitle.fontSize / 2}" font-size="30" class="title" fill="${newTitle.color}">${newTitle.text}</text>`);


    ele.innerHTML = pathArr.join('') + textArr.join('');
    textAlign($(ele.querySelector('.title')));

    Array.from(ele.querySelectorAll('.label')).forEach(value => {
        textAlign($(value));
    });

}