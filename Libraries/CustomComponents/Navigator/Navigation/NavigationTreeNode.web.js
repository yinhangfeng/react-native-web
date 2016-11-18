/**
 * Copyright (c) 2015, Facebook, Inc.  All rights reserved.
 *
 * @providesModule NavigationTreeNode
 * @flow
 * @typechecks
 */

'use strict';

var invariant = require('fbjs/lib/invariant');
// var immutable = require('immutable');
//
// var {List} = immutable;

/**
 * RW 为了减小包体积 修改去除immutable引用
 */

/**
 * Utility to build a tree of nodes.
 * Note that this tree does not perform cyclic redundancy check
 * while appending child node.
 */
class NavigationTreeNode {
  __parent: ?NavigationTreeNode;

  //_children: List<NavigationTreeNode>;

  _value: any;

  constructor(value: any) {
    this.__parent = null;
    this._children = [];
    this._value = value;
  }

  getValue(): any {
    return this._value;
  }

  getParent(): ?NavigationTreeNode {
    return this.__parent;
  }

  getChildrenCount(): number {
    return this._children.length;
  }

  getChildAt(index: number): ?NavigationTreeNode {
    return index > -1 && index < this._children.length ?
      this._children[index] :
      null;
  }

  appendChild(child: NavigationTreeNode): void {
    if (child.__parent) {
      child.__parent.removeChild(child);
    }
    child.__parent = this;
    this._children = this._children.concat(child);
  }

  removeChild(child: NavigationTreeNode): void {
    var index = this._children.indexOf(child);

    invariant(
      index > -1,
      'The node to be removed is not a child of this node.'
    );

    child.__parent = null;

    this._children = this._children.slice();
    this._children.splice(index, 1);
  }

  indexOf(child: NavigationTreeNode): number {
    return this._children.indexOf(child);
  }

  forEach(callback: Function, context: any): void {
    this._children.forEach(callback, context);
  }

  map(callback: Function, context: any): Array<NavigationTreeNode> {
    return this._children.map(callback, context);
  }

  some(callback: Function, context: any): boolean {
    return this._children.some(callback, context);
  }
}


module.exports = NavigationTreeNode;
