

export default function (list) {
    const obj = {};
    list.forEach(list2 => {
        list2.forEach((value ,index) => {
            // 如果是第一个则不进入循环
            if (index == 0) {
                obj[value] = [];
            }else {
                obj[list2[0]].push(value);
            }
        });
    });
    return obj;
}