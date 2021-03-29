export default function (oldNode) {
    const fragment = document.createDocumentFragment();
    while (oldNode.firstChild) {
        fragment.appendChild(oldNode.firstChild);
    };
    // 返回
    return fragment;
}