export function _(type, props, ...children) {
    const el = document.createElement(type, props, ...children);
    el.className = props.className || "";
    el.onclick = props.onclick || null;
    el.id = props.id || "";
    children.forEach(child => {
        if (typeof child === "string") {
            el.appendChild(document.createTextNode(child));
        } else {
            el.appendChild(child);
        }
    });
    return el;
}

export function h1(props, ...children) {
    return _("h1", props, ...children);
}

export function div(props, ...children) {
    return _("div", props, ...children);
}

export function span(props, ...children) {
    return _("span", props, ...children);
}

export function p(props, ...children) {
    return _("p", props, ...children);
}

export function button(props, ...children) {
    return _("button", props, ...children);
}

export function $(id) {
    return document.getElementById(id);
}

export function $C(className) {
    return document.getElementsByClassName(className)[0];
}