/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const U = globalThis, q = U.ShadowRoot && (U.ShadyCSS === void 0 || U.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, B = Symbol(), K = /* @__PURE__ */ new WeakMap();
let lt = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== B) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (q && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = K.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && K.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const bt = (i) => new lt(typeof i == "string" ? i : i + "", void 0, B), ht = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new lt(e, i, B);
}, $t = (i, t) => {
  if (q) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = U.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, Q = q ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return bt(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: yt, defineProperty: vt, getOwnPropertyDescriptor: wt, getOwnPropertyNames: At, getOwnPropertySymbols: Ct, getPrototypeOf: kt } = Object, I = globalThis, X = I.trustedTypes, Et = X ? X.emptyScript : "", xt = I.reactiveElementPolyfillSupport, E = (i, t) => i, F = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? Et : null;
      break;
    case Object:
    case Array:
      i = i == null ? i : JSON.stringify(i);
  }
  return i;
}, fromAttribute(i, t) {
  let e = i;
  switch (t) {
    case Boolean:
      e = i !== null;
      break;
    case Number:
      e = i === null ? null : Number(i);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(i);
      } catch {
        e = null;
      }
  }
  return e;
} }, ut = (i, t) => !yt(i, t), tt = { attribute: !0, type: String, converter: F, reflect: !1, useDefault: !1, hasChanged: ut };
Symbol.metadata ??= Symbol("metadata"), I.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let v = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = tt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && vt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = wt(this.prototype, t) ?? { get() {
      return this[e];
    }, set(a) {
      this[e] = a;
    } };
    return { get: r, set(a) {
      const l = r?.call(this);
      n?.call(this, a), this.requestUpdate(t, l, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? tt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = kt(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, s = [...At(e), ...Ct(e)];
      for (const r of s) this.createProperty(r, e[r]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0) for (const [s, r] of e) this.elementProperties.set(s, r);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, s] of this.elementProperties) {
      const r = this._$Eu(e, s);
      r !== void 0 && this._$Eh.set(r, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const s = new Set(t.flat(1 / 0).reverse());
      for (const r of s) e.unshift(Q(r));
    } else t !== void 0 && e.push(Q(t));
    return e;
  }
  static _$Eu(t, e) {
    const s = e.attribute;
    return s === !1 ? void 0 : typeof s == "string" ? s : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const s of e.keys()) this.hasOwnProperty(s) && (t.set(s, this[s]), delete this[s]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return $t(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, e, s) {
    this._$AK(t, s);
  }
  _$ET(t, e) {
    const s = this.constructor.elementProperties.get(t), r = this.constructor._$Eu(t, s);
    if (r !== void 0 && s.reflect === !0) {
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : F).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), a = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : F;
      this._$Em = r;
      const l = a.fromAttribute(e, n.type);
      this[r] = l ?? this._$Ej?.get(r) ?? l, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const a = this.constructor;
      if (r === !1 && (n = this[t]), s ??= a.getPropertyOptions(t), !((s.hasChanged ?? ut)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(a._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, a) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, a ?? e ?? this[t]), n !== !0 || a !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
  }
  async _$EP() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [r, n] of this._$Ep) this[r] = n;
        this._$Ep = void 0;
      }
      const s = this.constructor.elementProperties;
      if (s.size > 0) for (const [r, n] of s) {
        const { wrapped: a } = n, l = this[r];
        a !== !0 || this._$AL.has(r) || l === void 0 || this.C(r, void 0, n, l);
      }
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), this._$EO?.forEach((s) => s.hostUpdate?.()), this.update(e)) : this._$EM();
    } catch (s) {
      throw t = !1, this._$EM(), s;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EM() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[E("elementProperties")] = /* @__PURE__ */ new Map(), v[E("finalized")] = /* @__PURE__ */ new Map(), xt?.({ ReactiveElement: v }), (I.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const G = globalThis, et = (i) => i, H = G.trustedTypes, it = H ? H.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, dt = "$lit$", _ = `lit$${Math.random().toFixed(9).slice(2)}$`, pt = "?" + _, St = `<${pt}>`, $ = document, S = () => $.createComment(""), P = (i) => i === null || typeof i != "object" && typeof i != "function", Y = Array.isArray, Pt = (i) => Y(i) || typeof i?.[Symbol.iterator] == "function", z = `[ 	
\f\r]`, k = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, st = /-->/g, rt = />/g, g = RegExp(`>|${z}(?:([^\\s"'>=/]+)(${z}*=${z}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), nt = /'/g, at = /"/g, mt = /^(?:script|style|textarea|title)$/i, Rt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), u = Rt(1), A = Symbol.for("lit-noChange"), c = Symbol.for("lit-nothing"), ot = /* @__PURE__ */ new WeakMap(), b = $.createTreeWalker($, 129);
function ft(i, t) {
  if (!Y(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return it !== void 0 ? it.createHTML(t) : t;
}
const Ot = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = k;
  for (let l = 0; l < e; l++) {
    const o = i[l];
    let d, p, h = -1, m = 0;
    for (; m < o.length && (a.lastIndex = m, p = a.exec(o), p !== null); ) m = a.lastIndex, a === k ? p[1] === "!--" ? a = st : p[1] !== void 0 ? a = rt : p[2] !== void 0 ? (mt.test(p[2]) && (r = RegExp("</" + p[2], "g")), a = g) : p[3] !== void 0 && (a = g) : a === g ? p[0] === ">" ? (a = r ?? k, h = -1) : p[1] === void 0 ? h = -2 : (h = a.lastIndex - p[2].length, d = p[1], a = p[3] === void 0 ? g : p[3] === '"' ? at : nt) : a === at || a === nt ? a = g : a === st || a === rt ? a = k : (a = g, r = void 0);
    const f = a === g && i[l + 1].startsWith("/>") ? " " : "";
    n += a === k ? o + St : h >= 0 ? (s.push(d), o.slice(0, h) + dt + o.slice(h) + _ + f) : o + _ + (h === -2 ? l : f);
  }
  return [ft(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class R {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, a = 0;
    const l = t.length - 1, o = this.parts, [d, p] = Ot(t, e);
    if (this.el = R.createElement(d, s), b.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = b.nextNode()) !== null && o.length < l; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(dt)) {
          const m = p[a++], f = r.getAttribute(h).split(_), T = /([.?@])?(.*)/.exec(m);
          o.push({ type: 1, index: n, name: T[2], strings: f, ctor: T[1] === "." ? Ut : T[1] === "?" ? Ht : T[1] === "@" ? Mt : L }), r.removeAttribute(h);
        } else h.startsWith(_) && (o.push({ type: 6, index: n }), r.removeAttribute(h));
        if (mt.test(r.tagName)) {
          const h = r.textContent.split(_), m = h.length - 1;
          if (m > 0) {
            r.textContent = H ? H.emptyScript : "";
            for (let f = 0; f < m; f++) r.append(h[f], S()), b.nextNode(), o.push({ type: 2, index: ++n });
            r.append(h[m], S());
          }
        }
      } else if (r.nodeType === 8) if (r.data === pt) o.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(_, h + 1)) !== -1; ) o.push({ type: 7, index: n }), h += _.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = $.createElement("template");
    return s.innerHTML = t, s;
  }
}
function C(i, t, e = i, s) {
  if (t === A) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = P(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = C(i, r._$AS(i, t.values), r, s)), t;
}
class Tt {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? $).importNode(e, !0);
    b.currentNode = r;
    let n = b.nextNode(), a = 0, l = 0, o = s[0];
    for (; o !== void 0; ) {
      if (a === o.index) {
        let d;
        o.type === 2 ? d = new O(n, n.nextSibling, this, t) : o.type === 1 ? d = new o.ctor(n, o.name, o.strings, this, t) : o.type === 6 && (d = new Nt(n, this, t)), this._$AV.push(d), o = s[++l];
      }
      a !== o?.index && (n = b.nextNode(), a++);
    }
    return b.currentNode = $, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class O {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = c, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && t?.nodeType === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = C(this, t, e), P(t) ? t === c || t == null || t === "" ? (this._$AH !== c && this._$AR(), this._$AH = c) : t !== this._$AH && t !== A && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : Pt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== c && P(this._$AH) ? this._$AA.nextSibling.data = t : this.T($.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = R.createElement(ft(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Tt(r, this), a = n.u(this.options);
      n.p(e), this.T(a), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = ot.get(t.strings);
    return e === void 0 && ot.set(t.strings, e = new R(t)), e;
  }
  k(t) {
    Y(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new O(this.O(S()), this.O(S()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = et(t).nextSibling;
      et(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class L {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = c, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = c;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let a = !1;
    if (n === void 0) t = C(this, t, e, 0), a = !P(t) || t !== this._$AH && t !== A, a && (this._$AH = t);
    else {
      const l = t;
      let o, d;
      for (t = n[0], o = 0; o < n.length - 1; o++) d = C(this, l[s + o], e, o), d === A && (d = this._$AH[o]), a ||= !P(d) || d !== this._$AH[o], d === c ? t = c : t !== c && (t += (d ?? "") + n[o + 1]), this._$AH[o] = d;
    }
    a && !r && this.j(t);
  }
  j(t) {
    t === c ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ut extends L {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === c ? void 0 : t;
  }
}
class Ht extends L {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== c);
  }
}
class Mt extends L {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = C(this, t, e, 0) ?? c) === A) return;
    const s = this._$AH, r = t === c && s !== c || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== c && (s === c || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Nt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    C(this, t);
  }
}
const It = G.litHtmlPolyfillSupport;
It?.(R, O), (G.litHtmlVersions ??= []).push("3.3.3");
const Lt = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new O(t.insertBefore(S(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Z = globalThis;
class w extends v {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Lt(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return A;
  }
}
w._$litElement$ = !0, w.finalized = !0, Z.litElementHydrateSupport?.({ LitElement: w });
const zt = Z.litElementPolyfillSupport;
zt?.({ LitElement: w });
(Z.litElementVersions ??= []).push("4.2.2");
const jt = ["go2rtc", "entity", "url"], Vt = ["minimal", "native", "none"];
function Dt(i) {
  if (!i || typeof i != "object")
    throw new Error("Card config is required.");
  const t = i.controls ?? "minimal";
  if (!Vt.includes(t))
    throw new Error("controls must be one of: minimal, native, none.");
  return {
    type: i.type,
    cameras: qt(i),
    title: i.title,
    aspectRatio: Bt(i.aspect_ratio ?? "16:9"),
    muted: i.muted ?? !0,
    autoplay: i.autoplay ?? !0,
    controls: t,
    pauseWhenHidden: i.pause_when_hidden ?? !0
  };
}
function Ft(i) {
  if (!i || typeof i != "object")
    throw new Error("Camera entry must be an object.");
  if (!i.source)
    throw new Error("Camera source is required.");
  return {
    title: i.title,
    source: M(i.source),
    fallbacks: (i.fallbacks ?? []).map(M)
  };
}
function M(i) {
  if (!i || typeof i != "object")
    throw new Error("Camera source must be an object.");
  if (!jt.includes(i.type))
    throw new Error("source.type must be one of: go2rtc, entity, url.");
  if (i.type === "go2rtc") {
    if (!i.stream || typeof i.stream != "string")
      throw new Error("go2rtc source requires a stream name.");
    return {
      type: "go2rtc",
      stream: i.stream,
      url: Gt(i.url ?? "/api/go2rtc"),
      mode: i.mode ?? "auto"
    };
  }
  if (i.type === "entity") {
    if (!i.entity || typeof i.entity != "string")
      throw new Error("entity source requires a camera entity.");
    return {
      type: "entity",
      entity: i.entity,
      format: i.format ?? "hls"
    };
  }
  if (!i.url || typeof i.url != "string")
    throw new Error("url source requires a stream URL.");
  return {
    type: "url",
    url: i.url
  };
}
function Wt(i) {
  return i.type === "go2rtc" ? `go2rtc:${i.stream}` : i.type === "entity" ? i.entity : i.url;
}
function qt(i) {
  if (i.cameras !== void 0) {
    if (!Array.isArray(i.cameras) || i.cameras.length === 0)
      throw new Error("cameras must contain at least one camera.");
    return i.cameras.map(Ft);
  }
  if (!i.source)
    throw new Error("Camera source is required.");
  return [
    {
      title: i.title,
      source: M(i.source),
      fallbacks: (i.fallbacks ?? []).map(M)
    }
  ];
}
function Bt(i) {
  const t = i.trim();
  if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(t))
    return t;
  const e = t.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (e)
    return `${e[1]} / ${e[2]}`;
  throw new Error("aspect_ratio must use a format like 16:9 or 16 / 9.");
}
function Gt(i) {
  return i.replace(/\/+$/, "");
}
const Yt = ["entity", "go2rtc", "url"], Zt = ["minimal", "native", "none"], Jt = ["auto", "webrtc", "mse", "hls"];
class Kt extends w {
  constructor() {
    super(...arguments), this._config = _t(), this.addCamera = () => {
      this.commit({
        ...this._config,
        cameras: [
          ...this._config.cameras,
          {
            title: `Camera ${this._config.cameras.length + 1}`,
            source: x("entity")
          }
        ]
      });
    };
  }
  static {
    this.properties = {
      hass: { attribute: !1 },
      _config: { state: !0 }
    };
  }
  setConfig(t) {
    this._config = Qt(t);
  }
  render() {
    const t = this._config;
    return u`
      <div class="editor">
        <section class="section">
          <label>
            <span>Title</span>
            <input
              .value=${t.title ?? ""}
              placeholder="Optional card title"
              @input=${(e) => this.updateRoot("title", y(e) || void 0)}
            />
          </label>

          <div class="grid">
            <label>
              <span>Aspect ratio</span>
              <input
                .value=${t.aspect_ratio ?? "16:9"}
                placeholder="16:9"
                @input=${(e) => this.updateRoot("aspect_ratio", y(e) || "16:9")}
              />
            </label>

            <label>
              <span>Controls</span>
              <select
                .value=${t.controls ?? "minimal"}
                @change=${(e) => this.updateRoot("controls", j(e))}
              >
                ${Zt.map((e) => u`<option value=${e}>${e}</option>`)}
              </select>
            </label>
          </div>

          <div class="toggles">
            <label>
              <input
                type="checkbox"
                .checked=${t.muted ?? !0}
                @change=${(e) => this.updateRoot("muted", V(e))}
              />
              <span>Muted</span>
            </label>
            <label>
              <input
                type="checkbox"
                .checked=${t.autoplay ?? !0}
                @change=${(e) => this.updateRoot("autoplay", V(e))}
              />
              <span>Autoplay</span>
            </label>
            <label>
              <input
                type="checkbox"
                .checked=${t.pause_when_hidden ?? !0}
                @change=${(e) => this.updateRoot("pause_when_hidden", V(e))}
              />
              <span>Pause when hidden</span>
            </label>
          </div>
        </section>

        <section class="section">
          <div class="section-header">
            <h3>Cameras</h3>
            <button type="button" @click=${this.addCamera}>
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>Add</span>
            </button>
          </div>

          <div class="camera-list">
            ${t.cameras.map((e, s) => this.renderCamera(e, s))}
          </div>
        </section>
      </div>
    `;
  }
  renderCamera(t, e) {
    return u`
      <article class="camera">
        <div class="camera-header">
          <h4>${t.title || `Camera ${e + 1}`}</h4>
          <div class="button-row">
            <button type="button" title="Move up" ?disabled=${e === 0} @click=${() => this.moveCamera(e, -1)}>
              <ha-icon icon="mdi:arrow-up"></ha-icon>
            </button>
            <button
              type="button"
              title="Move down"
              ?disabled=${e === this._config.cameras.length - 1}
              @click=${() => this.moveCamera(e, 1)}
            >
              <ha-icon icon="mdi:arrow-down"></ha-icon>
            </button>
            <button
              type="button"
              title="Remove camera"
              ?disabled=${this._config.cameras.length < 2}
              @click=${() => this.removeCamera(e)}
            >
              <ha-icon icon="mdi:delete-outline"></ha-icon>
            </button>
          </div>
        </div>

        <label>
          <span>Camera title</span>
          <input
            .value=${t.title ?? ""}
            placeholder=${`Camera ${e + 1}`}
            @input=${(s) => this.updateCamera(e, { title: y(s) || void 0 })}
          />
        </label>

        ${this.renderSourceEditor(t.source, (s) => this.updateCamera(e, { source: s }))}

        <div class="fallbacks">
          <div class="sub-header">
            <h5>Fallbacks</h5>
            <button type="button" @click=${() => this.addFallback(e)}>
              <ha-icon icon="mdi:plus"></ha-icon>
              <span>Add fallback</span>
            </button>
          </div>

          ${(t.fallbacks ?? []).length ? (t.fallbacks ?? []).map(
      (s, r) => this.renderFallback(t, e, s, r)
    ) : u`<p class="empty-note">No fallbacks configured.</p>`}
        </div>
      </article>
    `;
  }
  renderFallback(t, e, s, r) {
    return u`
      <div class="fallback">
        <div class="fallback-header">
          <span>Fallback ${r + 1}</span>
          <button type="button" title="Remove fallback" @click=${() => this.removeFallback(e, r)}>
            <ha-icon icon="mdi:delete-outline"></ha-icon>
          </button>
        </div>
        ${this.renderSourceEditor(s, (n) => {
      const a = [...t.fallbacks ?? []];
      a[r] = n, this.updateCamera(e, { fallbacks: a });
    })}
      </div>
    `;
  }
  renderSourceEditor(t, e) {
    return u`
      <div class="source-editor">
        <label>
          <span>Source type</span>
          <select
            .value=${t.type}
            @change=${(s) => e(x(j(s)))}
          >
            ${Yt.map((s) => u`<option value=${s}>${s}</option>`)}
          </select>
        </label>

        ${t.type === "entity" ? this.renderEntitySource(t, e) : c}
        ${t.type === "go2rtc" ? this.renderGo2RtcSource(t, e) : c}
        ${t.type === "url" ? this.renderUrlSource(t, e) : c}
      </div>
    `;
  }
  renderEntitySource(t, e) {
    return u`
      <label>
        <span>Camera entity</span>
        <ha-entity-picker
          .hass=${this.hass}
          .value=${t.entity}
          .includeDomains=${["camera"]}
          @value-changed=${(s) => e({ ...t, entity: s.detail.value ?? "" })}
        ></ha-entity-picker>
      </label>
    `;
  }
  renderGo2RtcSource(t, e) {
    return u`
      <div class="grid">
        <label>
          <span>Stream</span>
          <input
            .value=${t.stream}
            placeholder="front_door"
            @input=${(s) => e({ ...t, stream: y(s) })}
          />
        </label>
        <label>
          <span>Mode</span>
          <select
            .value=${t.mode ?? "auto"}
            @change=${(s) => e({ ...t, mode: j(s) })}
          >
            ${Jt.map((s) => u`<option value=${s}>${s}</option>`)}
          </select>
        </label>
      </div>
      <label>
        <span>go2rtc URL</span>
        <input
          .value=${t.url ?? "/api/go2rtc"}
          placeholder="/api/go2rtc"
          @input=${(s) => e({ ...t, url: y(s) || "/api/go2rtc" })}
        />
      </label>
    `;
  }
  renderUrlSource(t, e) {
    return u`
      <label>
        <span>Stream URL</span>
        <input
          .value=${t.url}
          placeholder="https://example.local/stream.m3u8"
          @input=${(s) => e({ ...t, url: y(s) })}
        />
      </label>
    `;
  }
  updateRoot(t, e) {
    this.commit({ ...this._config, [t]: e });
  }
  updateCamera(t, e) {
    const s = [...this._config.cameras];
    s[t] = N({ ...s[t], ...e }), this.commit({ ...this._config, cameras: s });
  }
  removeCamera(t) {
    this._config.cameras.length < 2 || this.commit({
      ...this._config,
      cameras: this._config.cameras.filter((e, s) => s !== t)
    });
  }
  moveCamera(t, e) {
    const s = t + e;
    if (s < 0 || s >= this._config.cameras.length)
      return;
    const r = [...this._config.cameras], [n] = r.splice(t, 1);
    r.splice(s, 0, n), this.commit({ ...this._config, cameras: r });
  }
  addFallback(t) {
    const e = this._config.cameras[t];
    this.updateCamera(t, {
      fallbacks: [...e.fallbacks ?? [], x("entity")]
    });
  }
  removeFallback(t, e) {
    const s = this._config.cameras[t];
    this.updateCamera(t, {
      fallbacks: (s.fallbacks ?? []).filter((r, n) => n !== e)
    });
  }
  commit(t) {
    this._config = W(t), this.dispatchEvent(
      new CustomEvent("config-changed", {
        bubbles: !0,
        composed: !0,
        detail: { config: this._config }
      })
    );
  }
  static {
    this.styles = ht`
    :host {
      display: block;
    }

    .editor {
      display: grid;
      gap: 16px;
    }

    .section,
    .camera,
    .fallback {
      display: grid;
      gap: 12px;
    }

    .section {
      padding: 4px 0;
    }

    .camera,
    .fallback {
      padding: 12px;
      border: 1px solid var(--divider-color, #d8d8d8);
      border-radius: 8px;
      background: var(--card-background-color, #fff);
    }

    .fallback {
      background: var(--secondary-background-color, #f6f6f6);
    }

    .section-header,
    .camera-header,
    .sub-header,
    .fallback-header,
    .button-row,
    .toggles {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .section-header,
    .camera-header,
    .sub-header,
    .fallback-header {
      justify-content: space-between;
    }

    .camera-list,
    .fallbacks,
    .source-editor {
      display: grid;
      gap: 10px;
    }

    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
      gap: 10px;
    }

    label {
      display: grid;
      gap: 6px;
      color: var(--primary-text-color, #1f1f1f);
      font-size: 13px;
      font-weight: 500;
    }

    .toggles label {
      display: inline-flex;
      align-items: center;
      gap: 6px;
    }

    input,
    select,
    ha-entity-picker {
      width: 100%;
      box-sizing: border-box;
    }

    input,
    select {
      min-height: 36px;
      padding: 6px 8px;
      border: 1px solid var(--divider-color, #d8d8d8);
      border-radius: 6px;
      color: var(--primary-text-color, #1f1f1f);
      background: var(--card-background-color, #fff);
      font: inherit;
    }

    button {
      min-height: 32px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 0 10px;
      border: 0;
      border-radius: 6px;
      color: var(--primary-text-color, #1f1f1f);
      background: var(--secondary-background-color, #f1f3f5);
      cursor: pointer;
      font: inherit;
    }

    .button-row button,
    .fallback-header button {
      width: 32px;
      padding: 0;
    }

    button:disabled {
      cursor: default;
      opacity: 0.45;
    }

    h3,
    h4,
    h5,
    p {
      margin: 0;
    }

    h3 {
      font-size: 16px;
    }

    h4 {
      min-width: 0;
      overflow: hidden;
      font-size: 14px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    h5,
    .fallback-header span,
    .empty-note {
      color: var(--secondary-text-color, #666);
      font-size: 13px;
    }

    ha-icon {
      --mdc-icon-size: 18px;
    }
  `;
  }
}
function Qt(i) {
  return i.cameras?.length ? W({
    ...i,
    cameras: i.cameras.map(N)
  }) : W({
    type: i.type,
    title: i.title,
    aspect_ratio: i.aspect_ratio,
    muted: i.muted,
    autoplay: i.autoplay,
    controls: i.controls,
    pause_when_hidden: i.pause_when_hidden,
    cameras: [
      N({
        title: i.title,
        source: i.source ?? x("entity"),
        fallbacks: i.fallbacks
      })
    ]
  });
}
function _t() {
  return {
    type: "custom:ha-camera-live-card",
    controls: "minimal",
    pause_when_hidden: !0,
    cameras: [
      {
        title: "Camera",
        source: x("entity")
      }
    ]
  };
}
function W(i) {
  return gt({
    type: i.type ?? "custom:ha-camera-live-card",
    title: i.title,
    aspect_ratio: i.aspect_ratio,
    muted: i.muted,
    autoplay: i.autoplay,
    controls: i.controls,
    pause_when_hidden: i.pause_when_hidden,
    cameras: i.cameras.length ? i.cameras.map(N) : _t().cameras
  });
}
function N(i) {
  return gt({
    title: i.title,
    source: i.source,
    fallbacks: i.fallbacks?.length ? i.fallbacks : void 0
  });
}
function x(i) {
  return i === "go2rtc" ? {
    type: "go2rtc",
    stream: "",
    url: "/api/go2rtc",
    mode: "auto"
  } : i === "url" ? {
    type: "url",
    url: ""
  } : {
    type: "entity",
    entity: "",
    format: "hls"
  };
}
function y(i) {
  return i.currentTarget.value;
}
function j(i) {
  return i.currentTarget.value;
}
function V(i) {
  return i.currentTarget.checked;
}
function gt(i) {
  return Object.fromEntries(Object.entries(i).filter(([, t]) => t !== void 0));
}
customElements.get("ha-camera-live-card-editor") || customElements.define("ha-camera-live-card-editor", Kt);
class J {
  constructor(t) {
    this.source = t, this.currentStatus = "idle";
  }
  get status() {
    return this.currentStatus;
  }
  get error() {
    return this.currentError;
  }
  mark(t, e) {
    this.currentStatus = t, this.currentError = e;
  }
  resetVideo(t) {
    t && (t.pause(), t.removeAttribute("src"), t.srcObject = null, t.load());
  }
}
const ct = {
  direction: "recvonly"
};
class Xt extends J {
  constructor(t) {
    super(t), this.source = t;
  }
  async connect(t, e) {
    if (this.source.mode === "auto") {
      await this.connectAuto(t, e);
      return;
    }
    if (this.source.mode === "hls") {
      await this.connectHls(t, e);
      return;
    }
    if (this.source.mode === "mse") {
      await this.connectMse(t, e);
      return;
    }
    await this.connectWebRtc(t, e);
  }
  disconnect() {
    this.peer && (this.peer.getSenders().forEach((t) => t.track?.stop()), this.peer.getReceivers().forEach((t) => t.track?.stop()), this.peer.close(), this.peer = void 0), this.mark("idle");
  }
  async connectAuto(t, e) {
    const s = [];
    for (const r of [this.connectWebRtc, this.connectMse, this.connectHls])
      try {
        await r.call(this, t, e);
        return;
      } catch (n) {
        s.push(n instanceof Error ? n.message : String(n)), this.disconnect();
      }
    throw new Error(`go2rtc auto mode failed: ${s.join(" | ")}`);
  }
  async connectWebRtc(t, e) {
    if (!("RTCPeerConnection" in window))
      throw new Error("WebRTC is not available in this browser.");
    this.disconnect(), this.mark("connecting");
    const s = new MediaStream(), r = new RTCPeerConnection({
      iceServers: []
    });
    this.peer = r, r.addTransceiver("video", ct), r.addTransceiver("audio", ct), r.ontrack = (l) => {
      s.addTrack(l.track), t.srcObject = s;
    }, t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0;
    const n = await r.createOffer();
    await r.setLocalDescription(n);
    const a = await this.exchangeOffer(n.sdp ?? "");
    await r.setRemoteDescription({
      type: "answer",
      sdp: a
    }), e.autoplay && await t.play(), this.mark("live");
  }
  async connectHls(t, e) {
    this.mark("connecting"), t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0, t.srcObject = null, t.src = `${this.source.url}/api/stream.m3u8?src=${encodeURIComponent(this.source.stream)}`, e.autoplay && await t.play(), this.mark("live");
  }
  async connectMse(t, e) {
    this.mark("connecting"), t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0, t.srcObject = null, t.src = `${this.source.url}/api/stream.mp4?src=${encodeURIComponent(this.source.stream)}`, e.autoplay && await t.play(), this.mark("live");
  }
  async exchangeOffer(t) {
    const e = await fetch(
      `${this.source.url}/api/webrtc?src=${encodeURIComponent(this.source.stream)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/sdp"
        },
        body: t
      }
    );
    if (!e.ok) {
      const s = await e.text(), r = s.trim() ? `go2rtc WebRTC failed with HTTP ${e.status}: ${s.trim()}` : `go2rtc WebRTC failed with HTTP ${e.status}.`;
      throw new Error(r);
    }
    return e.text();
  }
}
class te extends J {
  constructor(t) {
    super(t), this.source = t;
  }
  async connect(t, e) {
    if (!e.hass)
      throw new Error("Home Assistant context is required for entity sources.");
    this.mark("connecting");
    const s = await e.hass.callWS({
      type: "camera/stream",
      entity_id: this.source.entity,
      format: this.source.format ?? "hls"
    });
    if (!s.url)
      throw new Error(`No stream URL returned for ${this.source.entity}.`);
    const r = e.hass.hassUrl ? e.hass.hassUrl(s.url) : s.url;
    t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0, t.srcObject = null, t.src = r, e.autoplay && await t.play(), this.mark("live");
  }
  disconnect() {
    this.mark("idle");
  }
}
class ee extends J {
  constructor(t) {
    super(t), this.source = t;
  }
  async connect(t, e) {
    this.mark("connecting"), t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0, t.srcObject = null, t.src = this.source.url, e.autoplay && await t.play(), this.mark("live");
  }
  disconnect() {
    this.mark("idle");
  }
}
function ie(i) {
  return i.type === "go2rtc" ? new Xt(i) : i.type === "entity" ? new te(i) : new ee(i);
}
const se = "0.1.1";
let D = 0;
function re() {
  const i = Date.now(), t = Math.max(0, D - i);
  return D = Math.max(i, D) + 180, t === 0 ? Promise.resolve() : new Promise((e) => {
    window.setTimeout(e, t);
  });
}
class ne extends w {
  constructor() {
    super(...arguments), this._connectToken = 0, this._status = "idle", this._error = "", this._activeSource = "", this._cameraIndex = 0, this._sourceIndex = 0, this._muted = !0, this._visible = !0, this._manualPaused = !1, this.handleVisibilityChange = () => {
      if (!(!this.videoElement || !this._config)) {
        if (document.hidden && this._config.pauseWhenHidden) {
          this.disconnectProvider(), this._status = "paused";
          return;
        }
        this._config.autoplay && !this._manualPaused && this.connectFirstAvailable();
      }
    }, this.handlePlaying = () => {
      this._status = this._sourceIndex > 0 ? "fallback" : "live", this._error = "";
    }, this.handleVideoPause = () => {
      !document.hidden && this._status !== "idle" && (this._status = "paused");
    }, this.handleVideoError = () => {
      this._error = "Video playback failed.", this.connectFirstAvailable();
    }, this.togglePlayback = () => {
      const t = this.videoElement;
      if (t) {
        if (t.paused) {
          this._manualPaused = !1, t.play().catch(() => this.connectFirstAvailable());
          return;
        }
        this._manualPaused = !0, t.pause();
      }
    }, this.toggleMute = () => {
      const t = this.videoElement;
      this._muted = !this._muted, t && (t.muted = this._muted);
    }, this.showPreviousCamera = () => {
      this.switchCamera(-1);
    }, this.showNextCamera = () => {
      this.switchCamera(1);
    }, this.enterFullscreen = () => {
      this.renderRoot?.querySelector(".frame")?.requestFullscreen?.();
    };
  }
  static {
    this.properties = {
      _config: { state: !0 },
      _status: { state: !0 },
      _error: { state: !0 },
      _activeSource: { state: !0 },
      _cameraIndex: { state: !0 },
      _sourceIndex: { state: !0 },
      _muted: { state: !0 },
      _visible: { state: !0 }
    };
  }
  set hass(t) {
    this._hass = t;
  }
  setConfig(t) {
    this._config = Dt(t), this._muted = this._config.muted, this._status = "idle", this._error = "", this._activeSource = "", this._cameraIndex = Math.min(this._cameraIndex, this._config.cameras.length - 1), this._sourceIndex = 0, this._manualPaused = !1, this.disconnectProvider(), this.requestUpdate(), this.updateComplete.then(() => this.connectFirstAvailable());
  }
  getCardSize() {
    return 4;
  }
  getGridOptions() {
    return {
      rows: 4,
      columns: 6,
      min_rows: 3,
      min_columns: 3
    };
  }
  static getConfigElement() {
    return document.createElement("ha-camera-live-card-editor");
  }
  static getStubConfig() {
    return {
      cameras: [
        {
          title: "Camera",
          source: {
            type: "entity",
            entity: "camera.example"
          }
        }
      ],
      controls: "minimal",
      pause_when_hidden: !0
    };
  }
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("visibilitychange", this.handleVisibilityChange), this.startVisibilityObserver(), this.updateComplete.then(() => this.connectFirstAvailable());
  }
  disconnectedCallback() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange), this._intersectionObserver?.disconnect(), this._intersectionObserver = void 0, this.disconnectProvider(), super.disconnectedCallback();
  }
  render() {
    return this._config ? u`
      <ha-card>
        <section
          class="frame"
          style=${`aspect-ratio: ${this._config.aspectRatio}`}
          aria-label=${this._config.title ?? "Live camera"}
        >
          <video
            playsinline
            preload="metadata"
            ?muted=${this._muted}
            ?autoplay=${this._config.autoplay}
            ?controls=${this._config.controls === "native"}
            @playing=${this.handlePlaying}
            @pause=${this.handleVideoPause}
            @error=${this.handleVideoError}
          ></video>

          ${this.renderHeader()} ${this.renderNavigation()} ${this.renderStatus()} ${this.renderControls()}
        </section>
      </ha-card>
    ` : u`
        <ha-card>
          <div class="empty">
            <ha-icon icon="mdi:video-off-outline"></ha-icon>
            <span>Camera config missing</span>
          </div>
        </ha-card>
      `;
  }
  renderHeader() {
    if (!this._config)
      return c;
    const t = this._config.title ?? this.currentCamera?.title, e = this.getActiveEntityState(), s = this._config.cameras.length > 1;
    return !t && !s && !e ? c : u`
      <div class="header">
        ${t ? u`
              <span class="title">
                <ha-icon icon="mdi:cctv"></ha-icon>
                <span>${t}</span>
              </span>
            ` : u`<span class="title spacer"></span>`}
        ${s ? u`
              <span class="camera-pill" title=${this.currentCamera?.title ?? this.cameraPositionLabel}>
                <ha-icon icon="mdi:camera-switch"></ha-icon>
                <span>${this.cameraPositionLabel}</span>
              </span>
            ` : c}
        <span class="source-pill">
          <ha-icon icon=${this.sourceIcon(this.currentSource)}></ha-icon>
          <span>${this.sourceLabel(this.currentSource)}</span>
        </span>
        ${e ? u`
              <span class="entity-state">
                <ha-icon icon="mdi:signal"></ha-icon>
                <span>${e}</span>
              </span>
            ` : c}
      </div>
    `;
  }
  renderNavigation() {
    return !this._config || this._config.cameras.length < 2 ? c : u`
      <div class="navigation" aria-label="Camera navigation">
        <button type="button" class="nav-button previous" title="Previous camera" @click=${this.showPreviousCamera}>
          <ha-icon icon="mdi:chevron-left"></ha-icon>
        </button>
        <button type="button" class="nav-button next" title="Next camera" @click=${this.showNextCamera}>
          <ha-icon icon="mdi:chevron-right"></ha-icon>
        </button>
      </div>
    `;
  }
  renderStatus() {
    if (this._status === "live" && !this._error && this._visible)
      return c;
    const t = this.statusLabel();
    return u`
      <div class="status ${this._status}">
        <ha-icon icon=${this.statusIcon()}></ha-icon>
        <span>${t}</span>
      </div>
    `;
  }
  renderControls() {
    if (!this._config || this._config.controls !== "minimal")
      return c;
    const t = this._status === "paused";
    return u`
      <div class="controls">
        <button type="button" title=${t ? "Play" : "Pause"} @click=${this.togglePlayback}>
          <ha-icon icon=${t ? "mdi:play-circle" : "mdi:pause-circle"}></ha-icon>
        </button>
        <button type="button" title=${this._muted ? "Unmute" : "Mute"} @click=${this.toggleMute}>
          <ha-icon icon=${this._muted ? "mdi:volume-variant-off" : "mdi:volume-high"}></ha-icon>
        </button>
        <button type="button" title="Fullscreen" @click=${this.enterFullscreen}>
          <ha-icon icon="mdi:fullscreen"></ha-icon>
        </button>
      </div>
    `;
  }
  async connectFirstAvailable() {
    if (!this.isConnected || !this._config || this._manualPaused || this._config.pauseWhenHidden && (!this._visible || document.hidden))
      return;
    const t = this.videoElement;
    if (!t)
      return;
    const e = ++this._connectToken, s = this.currentSources;
    if (this.disconnectProvider(!1), await re(), !(e !== this._connectToken || !this.isConnected))
      for (const [r, n] of s.entries()) {
        if (e !== this._connectToken)
          return;
        const a = ie(n);
        this._provider = a, this._sourceIndex = r, this._activeSource = Wt(n), this._status = r > 0 ? "fallback" : "connecting", this._error = "";
        try {
          await a.connect(t, {
            hass: this._hass,
            muted: this._muted,
            autoplay: this._config.autoplay
          }), e === this._connectToken && (this._status = r > 0 ? "fallback" : "live", this._error = "");
          return;
        } catch (l) {
          a.disconnect(), this.resetVideo(), this._error = l instanceof Error ? l.message : String(l), this._status = "error";
        }
      }
  }
  disconnectProvider(t = !0) {
    t && this._connectToken++, this._provider?.disconnect(), this._provider = void 0, this.resetVideo();
  }
  resetVideo() {
    const t = this.videoElement;
    t && (t.pause(), t.removeAttribute("src"), t.srcObject = null, t.load());
  }
  getActiveEntityState() {
    const t = this.currentSource;
    return t?.type !== "entity" || !this._hass ? "" : this._hass.states[t.entity]?.state ?? "";
  }
  get currentCamera() {
    return this._config?.cameras[this._cameraIndex];
  }
  get currentSource() {
    return this.currentSources[this._sourceIndex];
  }
  get currentSources() {
    const t = this.currentCamera;
    return t ? [t.source, ...t.fallbacks] : [];
  }
  get cameraPositionLabel() {
    return this._config ? `${this._cameraIndex + 1} / ${this._config.cameras.length}` : "";
  }
  get videoElement() {
    return this.renderRoot?.querySelector("video") ?? null;
  }
  statusLabel() {
    return !this._visible && this._config?.pauseWhenHidden ? "Offscreen" : this._status === "connecting" ? `Connecting ${this._activeSource}` : this._status === "fallback" ? `Fallback ${this._activeSource}` : this._status === "paused" ? "Paused" : this._status === "error" ? this._error || "Stream unavailable" : this._status;
  }
  statusIcon() {
    return !this._visible && this._config?.pauseWhenHidden ? "mdi:eye-off-outline" : this._status === "connecting" ? "mdi:connection" : this._status === "fallback" ? "mdi:source-branch" : this._status === "paused" ? "mdi:pause-circle" : this._status === "error" ? "mdi:alert-circle" : "mdi:video";
  }
  sourceIcon(t) {
    return t?.type === "go2rtc" ? "mdi:webrtc" : t?.type === "entity" ? "mdi:home-assistant" : "mdi:link-variant";
  }
  sourceLabel(t) {
    return t?.type === "go2rtc" ? "go2rtc" : t?.type === "entity" ? "HA" : "URL";
  }
  switchCamera(t) {
    !this._config || this._config.cameras.length < 2 || (this._cameraIndex = (this._cameraIndex + t + this._config.cameras.length) % this._config.cameras.length, this._sourceIndex = 0, this._status = "idle", this._error = "", this._activeSource = "", this._manualPaused = !1, this.disconnectProvider(), this.requestUpdate(), this.updateComplete.then(() => this.connectFirstAvailable()));
  }
  startVisibilityObserver() {
    if (!("IntersectionObserver" in window)) {
      this._visible = !0;
      return;
    }
    this._intersectionObserver?.disconnect(), this._intersectionObserver = new IntersectionObserver(
      (t) => {
        const e = t[0];
        if (this._visible = e.isIntersecting, !!this._config?.pauseWhenHidden) {
          if (!e.isIntersecting) {
            this.disconnectProvider(), this._status = "paused";
            return;
          }
          this.connectFirstAvailable();
        }
      },
      {
        root: null,
        rootMargin: "160px",
        threshold: 0.01
      }
    ), this._intersectionObserver.observe(this);
  }
  static {
    this.styles = ht`
    :host {
      display: block;
    }

    ha-card {
      overflow: hidden;
      background: var(--ha-card-background, var(--card-background-color, #111));
      border-radius: var(--ha-card-border-radius, 8px);
    }

    .frame {
      position: relative;
      width: 100%;
      min-height: 180px;
      overflow: hidden;
      background: #050607;
    }

    video {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: cover;
      background: #050607;
    }

    .header,
    .status,
    .controls,
    .navigation {
      position: absolute;
      z-index: 1;
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      text-shadow: 0 1px 2px rgb(0 0 0 / 80%);
    }

    .header {
      top: 0;
      right: 0;
      left: 0;
      min-width: 0;
      gap: 8px;
      padding: 10px 12px 18px;
      background: linear-gradient(to bottom, rgb(0 0 0 / 65%), transparent);
      pointer-events: none;
    }

    .title {
      flex: 1 1 auto;
      display: flex;
      align-items: center;
      gap: 8px;
      min-width: 0;
      overflow: hidden;
      font-size: 15px;
      font-weight: 600;
      line-height: 20px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .title span {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .title.spacer {
      flex: 1 1 auto;
    }

    .camera-pill,
    .source-pill,
    .entity-state {
      flex: 0 0 auto;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      min-height: 24px;
      padding: 0 8px;
      border-radius: 6px;
      background: rgb(0 0 0 / 38%);
      font-size: 12px;
      line-height: 16px;
      opacity: 0.82;
      text-transform: uppercase;
    }

    .camera-pill ha-icon,
    .source-pill ha-icon,
    .entity-state ha-icon {
      --mdc-icon-size: 15px;
    }

    .status {
      right: 12px;
      bottom: 12px;
      max-width: calc(100% - 24px);
      min-height: 28px;
      padding: 0 10px;
      overflow: hidden;
      border-radius: 6px;
      background: rgb(0 0 0 / 64%);
      font-size: 12px;
      line-height: 16px;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .status.error {
      background: rgb(128 28 28 / 82%);
    }

    .status.connecting ha-icon {
      color: #f5c542;
    }

    .status.fallback ha-icon,
    .status.live ha-icon {
      color: #55d187;
    }

    .status.paused ha-icon {
      color: #d3d8e0;
    }

    .status.error ha-icon {
      color: #ff8a8a;
    }

    .controls {
      bottom: 12px;
      left: 12px;
      padding: 4px;
      border-radius: 8px;
      background: rgb(0 0 0 / 54%);
    }

    .navigation {
      inset: 50% 10px auto;
      justify-content: space-between;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .nav-button {
      width: 38px;
      height: 38px;
      border-radius: 999px;
      background: rgb(0 0 0 / 42%);
      pointer-events: auto;
    }

    .nav-button ha-icon {
      --mdc-icon-size: 28px;
    }

    button {
      width: 34px;
      height: 34px;
      display: inline-grid;
      place-items: center;
      padding: 0;
      border: 0;
      border-radius: 6px;
      color: #fff;
      background: transparent;
      cursor: pointer;
    }

    button:hover,
    button:focus-visible {
      background: rgb(255 255 255 / 14%);
      outline: none;
    }

    ha-icon {
      --mdc-icon-size: 22px;
    }

    .empty {
      display: grid;
      gap: 8px;
      min-height: 120px;
      place-items: center;
      padding: 16px;
      color: var(--secondary-text-color);
    }

    .empty ha-icon {
      --mdc-icon-size: 30px;
    }
  `;
  }
}
customElements.get("ha-camera-live-card") || customElements.define("ha-camera-live-card", ne);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ha-camera-live-card",
  name: "HA Camera Live Card",
  description: "Low-latency live camera card with go2rtc, Home Assistant entity, and URL fallbacks.",
  preview: !0
});
console.info(
  `%c HA Camera Live Card %c ${se} `,
  "color: white; background: #1f6feb; font-weight: 700;",
  "color: white; background: #31343f; font-weight: 700;"
);
export {
  ne as CameraLiveCard
};
//# sourceMappingURL=ha-camera-live-card.js.map
