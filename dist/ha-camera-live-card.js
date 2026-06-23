/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const R = globalThis, L = R.ShadowRoot && (R.ShadyCSS === void 0 || R.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, j = Symbol(), q = /* @__PURE__ */ new WeakMap();
let it = class {
  constructor(t, e, s) {
    if (this._$cssResult$ = !0, s !== j) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (L && t === void 0) {
      const s = e !== void 0 && e.length === 1;
      s && (t = q.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), s && q.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const ht = (i) => new it(typeof i == "string" ? i : i + "", void 0, j), lt = (i, ...t) => {
  const e = i.length === 1 ? i[0] : t.reduce((s, r, n) => s + ((o) => {
    if (o._$cssResult$ === !0) return o.cssText;
    if (typeof o == "number") return o;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + o + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(r) + i[n + 1], i[0]);
  return new it(e, i, j);
}, ut = (i, t) => {
  if (L) i.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else for (const e of t) {
    const s = document.createElement("style"), r = R.litNonce;
    r !== void 0 && s.setAttribute("nonce", r), s.textContent = e.cssText, i.appendChild(s);
  }
}, B = L ? (i) => i : (i) => i instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const s of t.cssRules) e += s.cssText;
  return ht(e);
})(i) : i;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: dt, defineProperty: pt, getOwnPropertyDescriptor: ft, getOwnPropertyNames: mt, getOwnPropertySymbols: _t, getPrototypeOf: $t } = Object, H = globalThis, F = H.trustedTypes, gt = F ? F.emptyScript : "", yt = H.reactiveElementPolyfillSupport, E = (i, t) => i, I = { toAttribute(i, t) {
  switch (t) {
    case Boolean:
      i = i ? gt : null;
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
} }, rt = (i, t) => !dt(i, t), Z = { attribute: !0, type: String, converter: I, reflect: !1, useDefault: !1, hasChanged: rt };
Symbol.metadata ??= Symbol("metadata"), H.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let v = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Z) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(t) && ((e = Object.create(e)).wrapped = !0), this.elementProperties.set(t, e), !e.noAccessor) {
      const s = Symbol(), r = this.getPropertyDescriptor(t, s, e);
      r !== void 0 && pt(this.prototype, t, r);
    }
  }
  static getPropertyDescriptor(t, e, s) {
    const { get: r, set: n } = ft(this.prototype, t) ?? { get() {
      return this[e];
    }, set(o) {
      this[e] = o;
    } };
    return { get: r, set(o) {
      const c = r?.call(this);
      n?.call(this, o), this.requestUpdate(t, c, s);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Z;
  }
  static _$Ei() {
    if (this.hasOwnProperty(E("elementProperties"))) return;
    const t = $t(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(E("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(E("properties"))) {
      const e = this.properties, s = [...mt(e), ..._t(e)];
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
      for (const r of s) e.unshift(B(r));
    } else t !== void 0 && e.push(B(t));
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
    return ut(t, this.constructor.elementStyles), t;
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
      const n = (s.converter?.toAttribute !== void 0 ? s.converter : I).toAttribute(e, s.type);
      this._$Em = t, n == null ? this.removeAttribute(r) : this.setAttribute(r, n), this._$Em = null;
    }
  }
  _$AK(t, e) {
    const s = this.constructor, r = s._$Eh.get(t);
    if (r !== void 0 && this._$Em !== r) {
      const n = s.getPropertyOptions(r), o = typeof n.converter == "function" ? { fromAttribute: n.converter } : n.converter?.fromAttribute !== void 0 ? n.converter : I;
      this._$Em = r;
      const c = o.fromAttribute(e, n.type);
      this[r] = c ?? this._$Ej?.get(r) ?? c, this._$Em = null;
    }
  }
  requestUpdate(t, e, s, r = !1, n) {
    if (t !== void 0) {
      const o = this.constructor;
      if (r === !1 && (n = this[t]), s ??= o.getPropertyOptions(t), !((s.hasChanged ?? rt)(n, e) || s.useDefault && s.reflect && n === this._$Ej?.get(t) && !this.hasAttribute(o._$Eu(t, s)))) return;
      this.C(t, e, s);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$EP());
  }
  C(t, e, { useDefault: s, reflect: r, wrapped: n }, o) {
    s && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(t) && (this._$Ej.set(t, o ?? e ?? this[t]), n !== !0 || o !== void 0) || (this._$AL.has(t) || (this.hasUpdated || s || (e = void 0), this._$AL.set(t, e)), r === !0 && this._$Em !== t && (this._$Eq ??= /* @__PURE__ */ new Set()).add(t));
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
        const { wrapped: o } = n, c = this[r];
        o !== !0 || this._$AL.has(r) || c === void 0 || this.C(r, void 0, n, c);
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
v.elementStyles = [], v.shadowRootOptions = { mode: "open" }, v[E("elementProperties")] = /* @__PURE__ */ new Map(), v[E("finalized")] = /* @__PURE__ */ new Map(), yt?.({ ReactiveElement: v }), (H.reactiveElementVersions ??= []).push("2.1.2");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const z = globalThis, G = (i) => i, T = z.trustedTypes, J = T ? T.createPolicy("lit-html", { createHTML: (i) => i }) : void 0, nt = "$lit$", m = `lit$${Math.random().toFixed(9).slice(2)}$`, ot = "?" + m, vt = `<${ot}>`, g = document, C = () => g.createComment(""), x = (i) => i === null || typeof i != "object" && typeof i != "function", V = Array.isArray, bt = (i) => V(i) || typeof i?.[Symbol.iterator] == "function", M = `[ 	
\f\r]`, A = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, K = /-->/g, Y = />/g, _ = RegExp(`>|${M}(?:([^\\s"'>=/]+)(${M}*=${M}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), Q = /'/g, X = /"/g, at = /^(?:script|style|textarea|title)$/i, wt = (i) => (t, ...e) => ({ _$litType$: i, strings: t, values: e }), y = wt(1), b = Symbol.for("lit-noChange"), l = Symbol.for("lit-nothing"), tt = /* @__PURE__ */ new WeakMap(), $ = g.createTreeWalker(g, 129);
function ct(i, t) {
  if (!V(i) || !i.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return J !== void 0 ? J.createHTML(t) : t;
}
const At = (i, t) => {
  const e = i.length - 1, s = [];
  let r, n = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = A;
  for (let c = 0; c < e; c++) {
    const a = i[c];
    let u, d, h = -1, p = 0;
    for (; p < a.length && (o.lastIndex = p, d = o.exec(a), d !== null); ) p = o.lastIndex, o === A ? d[1] === "!--" ? o = K : d[1] !== void 0 ? o = Y : d[2] !== void 0 ? (at.test(d[2]) && (r = RegExp("</" + d[2], "g")), o = _) : d[3] !== void 0 && (o = _) : o === _ ? d[0] === ">" ? (o = r ?? A, h = -1) : d[1] === void 0 ? h = -2 : (h = o.lastIndex - d[2].length, u = d[1], o = d[3] === void 0 ? _ : d[3] === '"' ? X : Q) : o === X || o === Q ? o = _ : o === K || o === Y ? o = A : (o = _, r = void 0);
    const f = o === _ && i[c + 1].startsWith("/>") ? " " : "";
    n += o === A ? a + vt : h >= 0 ? (s.push(u), a.slice(0, h) + nt + a.slice(h) + m + f) : a + m + (h === -2 ? c : f);
  }
  return [ct(i, n + (i[e] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), s];
};
class k {
  constructor({ strings: t, _$litType$: e }, s) {
    let r;
    this.parts = [];
    let n = 0, o = 0;
    const c = t.length - 1, a = this.parts, [u, d] = At(t, e);
    if (this.el = k.createElement(u, s), $.currentNode = this.el.content, e === 2 || e === 3) {
      const h = this.el.content.firstChild;
      h.replaceWith(...h.childNodes);
    }
    for (; (r = $.nextNode()) !== null && a.length < c; ) {
      if (r.nodeType === 1) {
        if (r.hasAttributes()) for (const h of r.getAttributeNames()) if (h.endsWith(nt)) {
          const p = d[o++], f = r.getAttribute(h).split(m), O = /([.?@])?(.*)/.exec(p);
          a.push({ type: 1, index: n, name: O[2], strings: f, ctor: O[1] === "." ? St : O[1] === "?" ? Ct : O[1] === "@" ? xt : U }), r.removeAttribute(h);
        } else h.startsWith(m) && (a.push({ type: 6, index: n }), r.removeAttribute(h));
        if (at.test(r.tagName)) {
          const h = r.textContent.split(m), p = h.length - 1;
          if (p > 0) {
            r.textContent = T ? T.emptyScript : "";
            for (let f = 0; f < p; f++) r.append(h[f], C()), $.nextNode(), a.push({ type: 2, index: ++n });
            r.append(h[p], C());
          }
        }
      } else if (r.nodeType === 8) if (r.data === ot) a.push({ type: 2, index: n });
      else {
        let h = -1;
        for (; (h = r.data.indexOf(m, h + 1)) !== -1; ) a.push({ type: 7, index: n }), h += m.length - 1;
      }
      n++;
    }
  }
  static createElement(t, e) {
    const s = g.createElement("template");
    return s.innerHTML = t, s;
  }
}
function w(i, t, e = i, s) {
  if (t === b) return t;
  let r = s !== void 0 ? e._$Co?.[s] : e._$Cl;
  const n = x(t) ? void 0 : t._$litDirective$;
  return r?.constructor !== n && (r?._$AO?.(!1), n === void 0 ? r = void 0 : (r = new n(i), r._$AT(i, e, s)), s !== void 0 ? (e._$Co ??= [])[s] = r : e._$Cl = r), r !== void 0 && (t = w(i, r._$AS(i, t.values), r, s)), t;
}
class Et {
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
    const { el: { content: e }, parts: s } = this._$AD, r = (t?.creationScope ?? g).importNode(e, !0);
    $.currentNode = r;
    let n = $.nextNode(), o = 0, c = 0, a = s[0];
    for (; a !== void 0; ) {
      if (o === a.index) {
        let u;
        a.type === 2 ? u = new P(n, n.nextSibling, this, t) : a.type === 1 ? u = new a.ctor(n, a.name, a.strings, this, t) : a.type === 6 && (u = new kt(n, this, t)), this._$AV.push(u), a = s[++c];
      }
      o !== a?.index && (n = $.nextNode(), o++);
    }
    return $.currentNode = g, r;
  }
  p(t) {
    let e = 0;
    for (const s of this._$AV) s !== void 0 && (s.strings !== void 0 ? (s._$AI(t, s, e), e += s.strings.length - 2) : s._$AI(t[e])), e++;
  }
}
class P {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, e, s, r) {
    this.type = 2, this._$AH = l, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = s, this.options = r, this._$Cv = r?.isConnected ?? !0;
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
    t = w(this, t, e), x(t) ? t === l || t == null || t === "" ? (this._$AH !== l && this._$AR(), this._$AH = l) : t !== this._$AH && t !== b && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : bt(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== l && x(this._$AH) ? this._$AA.nextSibling.data = t : this.T(g.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: e, _$litType$: s } = t, r = typeof s == "number" ? this._$AC(t) : (s.el === void 0 && (s.el = k.createElement(ct(s.h, s.h[0]), this.options)), s);
    if (this._$AH?._$AD === r) this._$AH.p(e);
    else {
      const n = new Et(r, this), o = n.u(this.options);
      n.p(e), this.T(o), this._$AH = n;
    }
  }
  _$AC(t) {
    let e = tt.get(t.strings);
    return e === void 0 && tt.set(t.strings, e = new k(t)), e;
  }
  k(t) {
    V(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let s, r = 0;
    for (const n of t) r === e.length ? e.push(s = new P(this.O(C()), this.O(C()), this, this.options)) : s = e[r], s._$AI(n), r++;
    r < e.length && (this._$AR(s && s._$AB.nextSibling, r), e.length = r);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    for (this._$AP?.(!1, !0, e); t !== this._$AB; ) {
      const s = G(t).nextSibling;
      G(t).remove(), t = s;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class U {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, s, r, n) {
    this.type = 1, this._$AH = l, this._$AN = void 0, this.element = t, this.name = e, this._$AM = r, this.options = n, s.length > 2 || s[0] !== "" || s[1] !== "" ? (this._$AH = Array(s.length - 1).fill(new String()), this.strings = s) : this._$AH = l;
  }
  _$AI(t, e = this, s, r) {
    const n = this.strings;
    let o = !1;
    if (n === void 0) t = w(this, t, e, 0), o = !x(t) || t !== this._$AH && t !== b, o && (this._$AH = t);
    else {
      const c = t;
      let a, u;
      for (t = n[0], a = 0; a < n.length - 1; a++) u = w(this, c[s + a], e, a), u === b && (u = this._$AH[a]), o ||= !x(u) || u !== this._$AH[a], u === l ? t = l : t !== l && (t += (u ?? "") + n[a + 1]), this._$AH[a] = u;
    }
    o && !r && this.j(t);
  }
  j(t) {
    t === l ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class St extends U {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === l ? void 0 : t;
  }
}
class Ct extends U {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== l);
  }
}
class xt extends U {
  constructor(t, e, s, r, n) {
    super(t, e, s, r, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = w(this, t, e, 0) ?? l) === b) return;
    const s = this._$AH, r = t === l && s !== l || t.capture !== s.capture || t.once !== s.once || t.passive !== s.passive, n = t !== l && (s === l || r);
    r && this.element.removeEventListener(this.name, this, s), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class kt {
  constructor(t, e, s) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = s;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    w(this, t);
  }
}
const Pt = z.litHtmlPolyfillSupport;
Pt?.(k, P), (z.litHtmlVersions ??= []).push("3.3.3");
const Ot = (i, t, e) => {
  const s = e?.renderBefore ?? t;
  let r = s._$litPart$;
  if (r === void 0) {
    const n = e?.renderBefore ?? null;
    s._$litPart$ = r = new P(t.insertBefore(C(), n), n, void 0, e ?? {});
  }
  return r._$AI(i), r;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const D = globalThis;
class S extends v {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Ot(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return b;
  }
}
S._$litElement$ = !0, S.finalized = !0, D.litElementHydrateSupport?.({ LitElement: S });
const Rt = D.litElementPolyfillSupport;
Rt?.({ LitElement: S });
(D.litElementVersions ??= []).push("4.2.2");
const Tt = ["go2rtc", "entity", "url"], Ht = ["minimal", "native", "none"];
function Ut(i) {
  if (!i || typeof i != "object")
    throw new Error("Card config is required.");
  if (!i.source)
    throw new Error("Camera source is required.");
  const t = et(i.source), e = (i.fallbacks ?? []).map(et), s = i.controls ?? "minimal";
  if (!Ht.includes(s))
    throw new Error("controls must be one of: minimal, native, none.");
  return {
    type: i.type,
    source: t,
    fallbacks: e,
    title: i.title,
    aspectRatio: Nt(i.aspect_ratio ?? "16:9"),
    muted: i.muted ?? !0,
    autoplay: i.autoplay ?? !0,
    controls: s,
    pauseWhenHidden: i.pause_when_hidden ?? !0
  };
}
function et(i) {
  if (!i || typeof i != "object")
    throw new Error("Camera source must be an object.");
  if (!Tt.includes(i.type))
    throw new Error("source.type must be one of: go2rtc, entity, url.");
  if (i.type === "go2rtc") {
    if (!i.stream || typeof i.stream != "string")
      throw new Error("go2rtc source requires a stream name.");
    return {
      type: "go2rtc",
      stream: i.stream,
      url: It(i.url ?? "/api/go2rtc"),
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
function Mt(i) {
  return i.type === "go2rtc" ? `go2rtc:${i.stream}` : i.type === "entity" ? i.entity : i.url;
}
function Nt(i) {
  const t = i.trim();
  if (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(t))
    return t;
  const e = t.match(/^(\d+(?:\.\d+)?):(\d+(?:\.\d+)?)$/);
  if (e)
    return `${e[1]} / ${e[2]}`;
  throw new Error("aspect_ratio must use a format like 16:9 or 16 / 9.");
}
function It(i) {
  return i.replace(/\/+$/, "");
}
class W {
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
const st = {
  direction: "recvonly"
};
class Lt extends W {
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
    this.peer = r, r.addTransceiver("video", st), r.addTransceiver("audio", st), r.ontrack = (c) => {
      s.addTrack(c.track), t.srcObject = s;
    }, t.muted = e.muted, t.autoplay = e.autoplay, t.playsInline = !0;
    const n = await r.createOffer();
    await r.setLocalDescription(n);
    const o = await this.exchangeOffer(n.sdp ?? "");
    await r.setRemoteDescription({
      type: "answer",
      sdp: o
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
class jt extends W {
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
class zt extends W {
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
function Vt(i) {
  return i.type === "go2rtc" ? new Lt(i) : i.type === "entity" ? new jt(i) : new zt(i);
}
const Dt = "0.1.0";
let N = 0;
function Wt() {
  const i = Date.now(), t = Math.max(0, N - i);
  return N = Math.max(i, N) + 180, t === 0 ? Promise.resolve() : new Promise((e) => {
    window.setTimeout(e, t);
  });
}
class qt extends S {
  constructor() {
    super(...arguments), this._connectToken = 0, this._status = "idle", this._error = "", this._activeSource = "", this._sourceIndex = 0, this._muted = !0, this._visible = !0, this._manualPaused = !1, this.handleVisibilityChange = () => {
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
      _sourceIndex: { state: !0 },
      _muted: { state: !0 },
      _visible: { state: !0 }
    };
  }
  set hass(t) {
    this._hass = t;
  }
  setConfig(t) {
    this._config = Ut(t), this._muted = this._config.muted, this._status = "idle", this._error = "", this._activeSource = "", this._manualPaused = !1, this.disconnectProvider(), this.requestUpdate(), this.updateComplete.then(() => this.connectFirstAvailable());
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
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("visibilitychange", this.handleVisibilityChange), this.startVisibilityObserver(), this.updateComplete.then(() => this.connectFirstAvailable());
  }
  disconnectedCallback() {
    document.removeEventListener("visibilitychange", this.handleVisibilityChange), this._intersectionObserver?.disconnect(), this._intersectionObserver = void 0, this.disconnectProvider(), super.disconnectedCallback();
  }
  render() {
    return this._config ? y`
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

          ${this.renderHeader()} ${this.renderStatus()} ${this.renderControls()}
        </section>
      </ha-card>
    ` : y`
        <ha-card>
          <div class="empty">
            <ha-icon icon="mdi:video-off-outline"></ha-icon>
            <span>Camera config missing</span>
          </div>
        </ha-card>
      `;
  }
  renderHeader() {
    if (!this._config?.title)
      return l;
    const t = this.getActiveEntityState();
    return y`
      <div class="header">
        <span class="title">
          <ha-icon icon="mdi:cctv"></ha-icon>
          <span>${this._config.title}</span>
        </span>
        <span class="source-pill">
          <ha-icon icon=${this.sourceIcon(this.currentSource)}></ha-icon>
          <span>${this.sourceLabel(this.currentSource)}</span>
        </span>
        ${t ? y`
              <span class="entity-state">
                <ha-icon icon="mdi:signal"></ha-icon>
                <span>${t}</span>
              </span>
            ` : l}
      </div>
    `;
  }
  renderStatus() {
    if (this._status === "live" && !this._error && this._visible)
      return l;
    const t = this.statusLabel();
    return y`
      <div class="status ${this._status}">
        <ha-icon icon=${this.statusIcon()}></ha-icon>
        <span>${t}</span>
      </div>
    `;
  }
  renderControls() {
    if (!this._config || this._config.controls !== "minimal")
      return l;
    const t = this._status === "paused";
    return y`
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
    const e = ++this._connectToken, s = [this._config.source, ...this._config.fallbacks];
    if (this.disconnectProvider(!1), await Wt(), !(e !== this._connectToken || !this.isConnected))
      for (const [r, n] of s.entries()) {
        if (e !== this._connectToken)
          return;
        const o = Vt(n);
        this._provider = o, this._sourceIndex = r, this._activeSource = Mt(n), this._status = r > 0 ? "fallback" : "connecting", this._error = "";
        try {
          await o.connect(t, {
            hass: this._hass,
            muted: this._muted,
            autoplay: this._config.autoplay
          }), e === this._connectToken && (this._status = r > 0 ? "fallback" : "live", this._error = "");
          return;
        } catch (c) {
          o.disconnect(), this.resetVideo(), this._error = c instanceof Error ? c.message : String(c), this._status = "error";
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
  get currentSource() {
    if (this._config)
      return [this._config.source, ...this._config.fallbacks][this._sourceIndex];
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
    this.styles = lt`
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
    .controls {
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
customElements.get("ha-camera-live-card") || customElements.define("ha-camera-live-card", qt);
window.customCards = window.customCards ?? [];
window.customCards.push({
  type: "ha-camera-live-card",
  name: "HA Camera Live Card",
  description: "Low-latency live camera card with go2rtc, Home Assistant entity, and URL fallbacks.",
  preview: !0
});
console.info(
  `%c HA Camera Live Card %c ${Dt} `,
  "color: white; background: #1f6feb; font-weight: 700;",
  "color: white; background: #31343f; font-weight: 700;"
);
export {
  qt as CameraLiveCard
};
//# sourceMappingURL=ha-camera-live-card.js.map
