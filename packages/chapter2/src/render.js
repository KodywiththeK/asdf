export function jsx(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        if (typeof child === 'function') return child()
        return child
      }),
    },
  }
}

function createElement(node) {
  const el = document.createElement(node.type)

  const { children, ...otherProps } = node.props
  if (otherProps !== null) {
    updateAttributes(el, {}, otherProps)
  }

  if (Array.isArray(children)) {
    children.forEach((child) => {
      typeof child === 'string' ? (el.innerHTML = child) : el.appendChild(createElement(child))
    })
  }
  return el
}

function updateAttributes(target, newProps, oldProps) {
  Object.keys(newProps).forEach((prop) => {
    if (prop !== 'children' && newProps[prop] !== oldProps[prop]) {
      target.setAttribute(prop, newProps[prop])
    }
  })
  Object.keys(oldProps).forEach((prop) => {
    if (!(prop in newProps) && prop !== 'children') {
      target.removeAttribute(prop)
    }
  })
  if (Object.keys(newProps).length === 0) {
    Object.keys(oldProps).forEach((prop) => {
      if (prop !== 'children') {
        target.setAttribute(prop, oldProps[prop])
      }
    })
  }
}

export function render(parent, newNode, oldNode, index = 0) {
  if (!oldNode) {
    parent.appendChild(createElement(newNode))
  } else if (!newNode) {
    parent.removeChild(parent.childNodes[index])
  } else if (isChanged(newNode, oldNode)) {
    parent.replaceChild(createElement(newNode), parent.childNodes[index])
  } else if (newNode.type) {
    updateAttributes(parent.childNodes[index], newNode.props, oldNode.props)

    const newLength = newNode.props.children.length
    const oldLength = oldNode.props.children.length

    for (let i = 0; i < newLength || i < oldLength; i++) {
      render(parent.childNodes[index], newNode.props.children[i], oldNode.props.children[i], i)
    }
  }
}

function isChanged(node1, node2) {
  return typeof node1 !== typeof node2 || (typeof node1 === 'string' && node1 !== node2) || node1.type !== node2.type
}
