export default function (oldNode) {
    const fragment = document.createDocumentFragment();
    while (oldNode.firstElementChild) {
        fragment.appendChild(oldNode.firstElementChild);
    };
    // 返回
    return fragment;
}