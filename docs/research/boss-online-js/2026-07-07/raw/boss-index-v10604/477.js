(self.webpackChunkindex=self.webpackChunkindex||[]).push([[477],{73477:function(M,e,t){t.r(e),t.d(e,{BzlAvatar:function(){return Kr},BzlBadge:function(){return Yr},BzlButton:function(){return Nr},BzlCascader:function(){return Hr},BzlCascaderPanel:function(){return Br},BzlCheckbox:function(){return Ir},BzlCheckboxGroup:function(){return Ur},BzlCopyButton:function(){return _r},BzlDialog:function(){return Lr},BzlDivider:function(){return Uo},BzlForm:function(){return jo},BzlFormItem:function(){return zr},BzlIcon:function(){return Io},BzlInput:function(){return Ro},BzlLayout:function(){return Vo},BzlLink:function(){return Bo},BzlLogo:function(){return Lo},BzlOption:function(){return Mo},BzlPagination:function(){return Oo},BzlPopover:function(){return Po},BzlPopup:function(){return Fo},BzlRadio:function(){return ko},BzlRadioGroup:function(){return Co},BzlSelect:function(){return Do},BzlSpin:function(){return xo},BzlStep:function(){return wo},BzlSteps:function(){return yo},BzlSwitch:function(){return zo},BzlTag:function(){return _o},BzlTextarea:function(){return ao},BzlTimePicker:function(){return fo},BzlToast:function(){return $t},BzlTooltip:function(){return io},BzlUpload:function(){return bt},Dialog:function(){return Vr},DialogManager:function(){return Mr},Toast:function(){return vo},ToastManager:function(){return go},getBasePath:function(){return Wr},getFormControls:function(){return wt},registerIconLibrary:function(){return Le},serialize:function(){return xt},setBasePath:function(){return jr},unregisterIconLibrary:function(){return Me},v2BzlModelDirective:function(){return kt}});var t=globalThis,R=t.trustedTypes,V=R?R.createPolicy("lit-html",{createHTML:e=>e}):void 0,B="$lit$",I=`lit$${Math.random().toFixed(9).slice(2)}$`,U="?"+I,N=`<${U}>`,H=document,q=()=>H.createComment(""),j=e=>null===e||"object"!=typeof e&&"function"!=typeof e,W=Array.isArray,K=e=>W(e)||"function"==typeof(null==e?void 0:e[Symbol.iterator]),e="[ \t\n\f\r]",Y=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Z=/-->/g,X=/>/g,Q=RegExp(`>|${e}(?:([^\\s"'>=/]+)(${e}*=${e}*(?:[^ 	
\r"'\`<>=]|("|')|))|$)`,"g"),J=/'/g,G=/"/g,ee=/^(?:script|style|textarea|title)$/i,e=i=>(e,...t)=>({_$litType$:i,strings:e,values:t}),h=e(1),i=e(2),e=e(3),c=Symbol.for("lit-noChange"),l=Symbol.for("lit-nothing"),te=new WeakMap,ie=H.createTreeWalker(H,129);function oe(e,t){if(W(e)&&e.hasOwnProperty("raw"))return void 0!==V?V.createHTML(t):t;throw Error("invalid template strings array")}var re=(a,e)=>{var t=a.length-1,n=[];let s,l=2===e?"<svg>":3===e?"<math>":"",c=Y;for(let r=0;r<t;r++){var d=a[r];let e,t,i=-1,o=0;for(;o<d.length&&(c.lastIndex=o,null!==(t=c.exec(d)));)o=c.lastIndex,c===Y?"!--"===t[1]?c=Z:void 0!==t[1]?c=X:void 0!==t[2]?(ee.test(t[2])&&(s=RegExp("</"+t[2],"g")),c=Q):void 0!==t[3]&&(c=Q):c===Q?">"===t[0]?(c=null!=s?s:Y,i=-1):void 0===t[1]?i=-2:(i=c.lastIndex-t[2].length,e=t[1],c=void 0===t[3]?Q:'"'===t[3]?G:J):c===G||c===J?c=Q:c===Z||c===X?c=Y:(c=Q,s=void 0);var h=c===Q&&a[r+1].startsWith("/>")?" ":"";l+=c===Y?d+N:0<=i?(n.push(e),d.slice(0,i)+B+d.slice(i)+I+h):d+I+(-2===i?r:h)}return[oe(a,l+(a[t]||"<?>")+(2===e?"</svg>":3===e?"</math>":"")),n]},ae=class Zr{constructor({strings:e,_$litType$:t},i){var o;this.parts=[];let r=0,a=0;var n,s,l=e.length-1,c=this.parts,[e,d]=re(e,t);for(this.el=Zr.createElement(e,i),ie.currentNode=this.el.content,2!==t&&3!==t||(e=this.el.content.firstChild).replaceWith(...e.childNodes);null!==(o=ie.nextNode())&&c.length<l;){if(1===o.nodeType){if(o.hasAttributes())for(var h of o.getAttributeNames())h.endsWith(B)?(s=d[a++],n=o.getAttribute(h).split(I),s=/([.?@])?(.*)/.exec(s),c.push({type:1,index:r,name:s[2],strings:n,ctor:"."===s[1]?de:"?"===s[1]?he:"@"===s[1]?pe:ce}),o.removeAttribute(h)):h.startsWith(I)&&(c.push({type:6,index:r}),o.removeAttribute(h));if(ee.test(o.tagName)){var p=o.textContent.split(I),u=p.length-1;if(0<u){o.textContent=R?R.emptyScript:"";for(let e=0;e<u;e++)o.append(p[e],q()),ie.nextNode(),c.push({type:2,index:++r});o.append(p[u],q())}}}else if(8===o.nodeType)if(o.data===U)c.push({type:2,index:r});else{let e=-1;for(;-1!==(e=o.data.indexOf(I,e+1));)c.push({type:7,index:r}),e+=I.length-1}r++}}static createElement(e,t){var i=H.createElement("template");return i.innerHTML=e,i}};function ne(t,i,o=t,r){var a;if(i!==c){let e=void 0!==r?null==(n=o._$Co)?void 0:n[r]:o._$Cl;var n=j(i)?void 0:i._$litDirective$;(null==e?void 0:e.constructor)!==n&&(null!=(a=null==e?void 0:e._$AO)&&a.call(e,!1),void 0===n?e=void 0:(e=new n(t))._$AT(t,o,r),void 0!==r?(null!=(a=o._$Co)?a:o._$Co=[])[r]=e:o._$Cl=e),void 0!==e&&(i=ne(t,e._$AS(t,i.values),e,r))}return i}var se=class{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){var{el:{content:e},parts:i}=this._$AD,o=(null!=(o=null==t?void 0:t.creationScope)?o:H).importNode(e,!0);ie.currentNode=o;let r=ie.nextNode(),a=0,n=0,s=i[0];for(;void 0!==s;){if(a===s.index){let e;2===s.type?e=new le(r,r.nextSibling,this,t):1===s.type?e=new s.ctor(r,s.name,s.strings,this,t):6===s.type&&(e=new ue(r,this,t)),this._$AV.push(e),s=i[++n]}a!==(null==s?void 0:s.index)&&(r=ie.nextNode(),a++)}return ie.currentNode=H,o}p(e){let t=0;for(var i of this._$AV)void 0!==i&&(void 0!==i.strings?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}},le=class Xr{get _$AU(){var e;return null!=(e=null==(e=this._$AM)?void 0:e._$AU)?e:this._$Cv}constructor(e,t,i,o){this.type=2,this._$AH=l,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=o,this._$Cv=null==(e=null==o?void 0:o.isConnected)||e}get parentNode(){let e=this._$AA.parentNode;var t=this._$AM;return e=void 0!==t&&11===(null==e?void 0:e.nodeType)?t.parentNode:e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=ne(this,e,t),j(e)?e===l||null==e||""===e?(this._$AH!==l&&this._$AR(),this._$AH=l):e!==this._$AH&&e!==c&&this._(e):void 0!==e._$litType$?this.$(e):void 0!==e.nodeType?this.T(e):K(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==l&&j(this._$AH)?this._$AA.nextSibling.data=e:this.T(H.createTextNode(e)),this._$AH=e}$(e){var{values:t,_$litType$:i}=e,e="number"==typeof i?this._$AC(e):(void 0===i.el&&(i.el=ae.createElement(oe(i.h,i.h[0]),this.options)),i);(null==(i=this._$AH)?void 0:i._$AD)===e?this._$AH.p(t):(e=(i=new se(e,this)).u(this.options),i.p(t),this.T(e),this._$AH=i)}_$AC(e){let t=te.get(e.strings);return void 0===t&&te.set(e.strings,t=new ae(e)),t}k(e){W(this._$AH)||(this._$AH=[],this._$AR());var t,i=this._$AH;let o,r=0;for(t of e)r===i.length?i.push(o=new Xr(this.O(q()),this.O(q()),this,this.options)):o=i[r],o._$AI(t),r++;r<i.length&&(this._$AR(o&&o._$AB.nextSibling,r),i.length=r)}_$AR(e=this._$AA.nextSibling,t){var i;for(null==(i=this._$AP)||i.call(this,!1,!0,t);e!==this._$AB;){var o=e.nextSibling;e.remove(),e=o}}setConnected(e){var t;void 0===this._$AM&&(this._$Cv=e,null!=(t=this._$AP))&&t.call(this,e)}},ce=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,o,r){this.type=1,this._$AH=l,this._$AN=void 0,this.element=e,this.name=t,this._$AM=o,this.options=r,2<i.length||""!==i[0]||""!==i[1]?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=l}_$AI(i,o=this,r,e){var a=this.strings;let n=!1;if(void 0===a)i=ne(this,i,o,0),(n=!j(i)||i!==this._$AH&&i!==c)&&(this._$AH=i);else{var s=i;let e,t;for(i=a[0],e=0;e<a.length-1;e++)(t=ne(this,s[r+e],o,e))===c&&(t=this._$AH[e]),n=n||!j(t)||t!==this._$AH[e],t===l?i=l:i!==l&&(i+=(null!=t?t:"")+a[e+1]),this._$AH[e]=t}n&&!e&&this.j(i)}j(e){e===l?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,null!=e?e:"")}},de=class extends ce{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===l?void 0:e}},he=class extends ce{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==l)}},pe=class extends ce{constructor(e,t,i,o,r){super(e,t,i,o,r),this.type=5}_$AI(e,t=this){var i,o;(e=null!=(t=ne(this,e,t,0))?t:l)!==c&&(t=this._$AH,i=e===l&&t!==l||e.capture!==t.capture||e.once!==t.once||e.passive!==t.passive,o=e!==l&&(t===l||i),i&&this.element.removeEventListener(this.name,this,t),o&&this.element.addEventListener(this.name,this,e),this._$AH=e)}handleEvent(e){var t;"function"==typeof this._$AH?this._$AH.call(null!=(t=null==(t=this.options)?void 0:t.host)?t:this.element,e):this._$AH.handleEvent(e)}},ue=class{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){ne(this,e)}},o=t.litHtmlPolyfillSupport,be=(null!=o&&o(ae,le),(null!=(o=t.litHtmlVersions)?o:t.litHtmlVersions=[]).push("3.3.1"),globalThis),fe=be.ShadowRoot&&(void 0===be.ShadyCSS||be.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ge=Symbol(),me=new WeakMap,ve=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ge)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;var t,i=this.t;return fe&&void 0===e&&(t=void 0!==i&&1===i.length,void 0===(e=t?me.get(i):e))&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),t)&&me.set(i,e),e}toString(){return this.cssText}},o=(o,...e)=>{e=1===o.length?o[0]:e.reduce((e,t,i)=>e+(()=>{if(!0===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})()+o[i+1],o[0]);return new ve(e,o,ge)},ye=fe?e=>e:t=>{if(!(t instanceof CSSStyleSheet))return t;{let e="";for(var i of t.cssRules)e+=i.cssText;return t=e,new ve("string"==typeof t?t:t+"",void 0,ge)}},{is:ze,defineProperty:_e,getOwnPropertyDescriptor:xe,getOwnPropertyNames:we,getOwnPropertySymbols:ke,getPrototypeOf:Ce}=Object,t=globalThis,r=t.trustedTypes,$e=r?r.emptyScript:"",r=t.reactiveElementPolyfillSupport,Se={toAttribute(e,t){switch(t){case Boolean:e=e?$e:null;break;case Object:case Array:e=null==e?e:JSON.stringify(e)}return e},fromAttribute(e,t){let i=e;switch(t){case Boolean:i=null!==e;break;case Number:i=null===e?null:Number(e);break;case Object:case Array:try{i=JSON.parse(e)}catch(e){i=null}}return i}},Ee=(e,t)=>!ze(e,t),Ae={attribute:!0,type:String,converter:Se,reflect:!1,useDefault:!1,hasChanged:Ee},a=(null==Symbol.metadata&&(Symbol.metadata=Symbol("metadata")),null!=t.litPropertyMetadata||(t.litPropertyMetadata=new WeakMap),class extends HTMLElement{static addInitializer(e){var t;this._$Ei(),(null!=(t=this.l)?t:this.l=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ae){var i;t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),t.noAccessor||(i=Symbol(),void 0!==(i=this.getPropertyDescriptor(e,i,t))&&_e(this.prototype,e,i))}static getPropertyDescriptor(i,t,o){let e,{get:r,set:a}=null!=(e=xe(this.prototype,i))?e:{get(){return this[t]},set(e){this[t]=e}};return{get:r,set(e){var t=null==r?void 0:r.call(this);null!=a&&a.call(this,e),this.requestUpdate(i,t,o)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return null!=(e=this.elementProperties.get(e))?e:Ae}static _$Ei(){var e;this.hasOwnProperty("elementProperties")||((e=Ce(this)).finalize(),void 0!==e.l&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties))}static finalize(){if(!this.hasOwnProperty("finalized")){if(this.finalized=!0,this._$Ei(),this.hasOwnProperty("properties")){var e,t=this.properties;for(e of[...we(t),...ke(t)])this.createProperty(e,t[e])}var i,o,r=this[Symbol.metadata];if(null!==r){r=litPropertyMetadata.get(r);if(void 0!==r)for(var[a,n]of r)this.elementProperties.set(a,n)}this._$Eh=new Map;for([i,o]of this.elementProperties){var s=this._$Eu(i,o);void 0!==s&&this._$Eh.set(s,i)}this.elementStyles=this.finalizeStyles(this.styles)}}static finalizeStyles(e){var t,i=[];if(Array.isArray(e))for(t of new Set(e.flat(1/0).reverse()))i.unshift(ye(t));else void 0!==e&&i.push(ye(e));return i}static _$Eu(e,t){t=t.attribute;return!1===t?void 0:"string"==typeof t?t:"string"==typeof e?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var e;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),null!=(e=this.constructor.l)&&e.forEach(e=>e(this))}addController(e){var t;(null!=(t=this._$EO)?t:this._$EO=new Set).add(e),void 0!==this.renderRoot&&this.isConnected&&null!=(t=e.hostConnected)&&t.call(e)}removeController(e){var t;null!=(t=this._$EO)&&t.delete(e)}_$E_(){var e,t=new Map;for(e of this.constructor.elementProperties.keys())this.hasOwnProperty(e)&&(t.set(e,this[e]),delete this[e]);0<t.size&&(this._$Ep=t)}createRenderRoot(){var e=null!=(e=this.shadowRoot)?e:this.attachShadow(this.constructor.shadowRootOptions);return((e,t)=>{if(fe)e.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(var i of t){var o=document.createElement("style"),r=be.litNonce;void 0!==r&&o.setAttribute("nonce",r),o.textContent=i.cssText,e.appendChild(o)}})(e,this.constructor.elementStyles),e}connectedCallback(){var e;null==this.renderRoot&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),null!=(e=this._$EO)&&e.forEach(e=>{var t;return null==(t=e.hostConnected)?void 0:t.call(e)})}enableUpdating(e){}disconnectedCallback(){var e;null!=(e=this._$EO)&&e.forEach(e=>{var t;return null==(t=e.hostDisconnected)?void 0:t.call(e)})}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){var i,o=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,o);void 0!==r&&!0===o.reflect&&(i=(void 0!==(null==(i=o.converter)?void 0:i.toAttribute)?o.converter:Se).toAttribute(t,o.type),this._$Em=e,null==i?this.removeAttribute(r):this.setAttribute(r,i),this._$Em=null)}_$AK(e,t){var i,o=this.constructor,e=o._$Eh.get(e);void 0!==e&&this._$Em!==e&&(i="function"==typeof(o=o.getPropertyOptions(e)).converter?{fromAttribute:o.converter}:void 0!==(null==(i=o.converter)?void 0:i.fromAttribute)?o.converter:Se,this._$Em=e,i=i.fromAttribute(t,o.type),this[e]=null!=(o=null!=i?i:null==(t=this._$Ej)?void 0:t.get(e))?o:i,this._$Em=null)}requestUpdate(e,t,i){var o;if(void 0!==e){var r=this.constructor,a=this[e];if(!((null!=(o=(i=null!=i?i:r.getPropertyOptions(e)).hasChanged)?o:Ee)(a,t)||i.useDefault&&i.reflect&&a===(null==(o=this._$Ej)?void 0:o.get(e))&&!this.hasAttribute(r._$Eu(e,i))))return;this.C(e,t,i)}!1===this.isUpdatePending&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:o,wrapped:r},a){var n;i&&!(null!=(n=this._$Ej)?n:this._$Ej=new Map).has(e)&&(this._$Ej.set(e,null!=(n=null!=a?a:t)?n:this[e]),!0!==r||void 0!==a)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),!0===o&&this._$Em!==e&&(null!=(n=this._$Eq)?n:this._$Eq=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}var e=this.scheduleUpdate();return null!=e&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var e;if(this.isUpdatePending){if(!this.hasUpdated){if(null!=this.renderRoot||(this.renderRoot=this.createRenderRoot()),this._$Ep){for(var[i,o]of this._$Ep)this[i]=o;this._$Ep=void 0}var r=this.constructor.elementProperties;if(0<r.size)for(var[a,n]of r){var s=n.wrapped,l=this[a];!0!==s||this._$AL.has(a)||void 0===l||this.C(a,void 0,n,l)}}let t=!1;r=this._$AL;try{(t=this.shouldUpdate(r))?(this.willUpdate(r),null!=(e=this._$EO)&&e.forEach(e=>{var t;return null==(t=e.hostUpdate)?void 0:t.call(e)}),this.update(r)):this._$EM()}catch(e){throw t=!1,this._$EM(),e}t&&this._$AE(r)}}willUpdate(e){}_$AE(e){var t;null!=(t=this._$EO)&&t.forEach(e=>{var t;return null==(t=e.hostUpdated)?void 0:t.call(e)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&(this._$Eq=this._$Eq.forEach(e=>this._$ET(e,this[e]))),this._$EM()}updated(e){}firstUpdated(e){}}),r=(a.elementStyles=[],a.shadowRootOptions={mode:"open"},a.elementProperties=new Map,a.finalized=new Map,null!=r&&r({ReactiveElement:a}),(null!=(r=t.reactiveElementVersions)?r:t.reactiveElementVersions=[]).push("2.1.1"),globalThis),t=class extends a{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e,t=super.createRenderRoot();return null!=(e=this.renderOptions).renderBefore||(e.renderBefore=t.firstChild),t}update(e){var t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=((e,t,i)=>{var o,r=null!=(r=null==i?void 0:i.renderBefore)?r:t;let a=r._$litPart$;return void 0===a&&(o=null!=(o=null==i?void 0:i.renderBefore)?o:null,r._$litPart$=a=new le(t.insertBefore(q(),o),o,void 0,null!=i?i:{})),a._$AI(e),a})(t,this.renderRoot,this.renderOptions)}connectedCallback(){var e;super.connectedCallback(),null!=(e=this._$Do)&&e.setConnected(!0)}disconnectedCallback(){var e;super.disconnectedCallback(),null!=(e=this._$Do)&&e.setConnected(!1)}render(){return c}},a=(t._$litElement$=!0,t.finalized=!0,null!=(a=r.litElementHydrateSupport)&&a.call(r,{LitElement:t}),r.litElementPolyfillSupport),a=(null!=a&&a({LitElement:t}),(null!=(a=r.litElementVersions)?a:r.litElementVersions=[]).push("4.2.1"),o`
  :host {
    display: block;
    --bzl-upload-list-picture-icon-size: 34px;
  }

  .upload {
    display: block;
  }

  .upload__content {
    text-align: center;
    cursor: pointer;
    display: inline-block;
  }

  .upload__content:hover {
    color: var(--bzl-color-primary);
  }

  .upload__content:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .upload__dropzone {
    box-sizing: border-box;
    padding: var(--bzl-spacing-8) 0;
    border: 1px dashed var(--bzl-color-neutral-400);
    border-radius: var(--bzl-border-radius-medium);
    color: var(--bzl-color-neutral-900);
    background-color: var(--bzl-color-neutral-100);
    cursor: pointer;
    text-align: center;
    transition: all var(--bzl-transition-fast);
  }

  .upload__dropzone:hover {
    border-color: var(--bzl-color-boss-600);
    background-color: #e1f5f599;
  }

  .upload__dropzone:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .upload__dropzone--drag-over {
    border-color: var(--bzl-color-primary-600);
    background-color: #e1f5f599;
  }

  .upload__dropzone--disabled {
    color: var(--bzl-color-text-caption);
    background-color: var(--bzl-color-neutral-fill-1);
    border-color: var(--bzl-color-border);
    cursor: not-allowed;
  }

  .upload__dropzone--disabled:hover {
    border-color: var(--bzl-color-border);
  }

  .upload__content--disabled {
    color: var(--bzl-color-text-caption);
    background-color: var(--bzl-color-neutral-fill-1);
    cursor: not-allowed;
  }

  .upload__content--disabled:hover {
    color: var(--bzl-color-text-caption);
  }

  .upload__input {
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  .upload__file-list {
    list-style: none;
    margin: var(--bzl-spacing-3) 0 0;
    padding: 0;
  }

  .upload__file-item {
    box-sizing: border-box;
    position: relative;
    margin-top: var(--bzl-spacing-4);
    height: 32px;
    padding: 0 var(--bzl-spacing-5);
    display: flex;
    align-items: center;
    gap: var(--bzl-spacing-2);
    border-radius: var(--bzl-border-radius-regular);
    transition: background-color var(--bzl-transition-fast);
  }

  .upload__file-item:hover {
    background-color: var(--bzl-color-neutral-100);
  }

  .upload__file-item:first-child {
    margin-top: 0;
  }

  .upload__file-size-progress-track.upload__file-item-text-progress {
    position: absolute;
    bottom: 0;
    left: 30px;
    width: calc(100% - 30px - 8px);
  }

  .upload__file-item-left {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--bzl-spacing-2);
  }

  .upload__file-item-icon {
    flex-shrink: 0;
    color: var(--bzl-color-neutral-800);
    font-size: var(--bzl-font-size-medium);
  }

  .upload__file-item-actions {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: var(--bzl-spacing-5);
  }

  .upload__file-meta {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }

  .upload__file-name {
    color: var(--bzl-color-neutral-900);
    font-size: 13px;
    line-height: 22px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  .upload__file-name--error {
    color: var(--bzl-color-danger-700);
  }

  .upload__file-size {
    color: var(--bzl-color-text-caption);
    font-size: 12px;
    line-height: 20px;
  }

  .upload__file-size--error {
    color: var(--bzl-color-danger-700);
  }

  .upload__default {
    display: inline-block;
  }

  .upload__file-size-progress-track {
    box-sizing: border-box;
    height: 2px;
    background-color: var(--bzl-color-gray-400);
    border-radius: var(--bzl-border-radius-pill);
    overflow: hidden;
  }

  .upload__file-item--picture .upload__file-size-progress-track {
    margin-top: 9px;
    margin-bottom: 9px;
  }

  .upload__file-size-progress-bar {
    display: block;
    height: 100%;
    background-color: var(--bzl-color-boss-600);
    transition: var(--bzl-transition-fast) width;
  }

  .upload__reload,
  .upload__remove {
    border: none;
    background-color: transparent;
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-normal);
    padding: 0;
    cursor: pointer;
  }

  .upload__reload:hover,
  .upload__remove:hover {
    color: var(--bzl-color-danger);
  }

  .upload__reload:focus-visible,
  .upload__remove:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .upload__reload[disabled],
  .upload__remove[disabled] {
    color: var(--bzl-color-text-caption);
    cursor: not-allowed;
  }

  .upload__file-item--picture {
    height: 58px;
    border: 1px solid var(--bzl-color-neutral-400);
    transition: background-color var(--bzl-transition-fast);
  }

  .upload__file-item--picture.upload__file-item--error {
    border-color: var(--bzl-color-danger-600);
  }

  .upload__file-item--picture .upload__file-item-left {
    gap: var(--bzl-spacing-5);
  }

  .upload__file-item-icon-picture {
    box-sizing: border-box;
    flex-shrink: 0;
    width: var(--bzl-upload-list-picture-icon-size);
    height: var(--bzl-upload-list-picture-icon-size);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .upload__file-item-thumb {
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .upload__file-item--picture .upload__file-item-icon {
    color: var(--bzl-color-neutral-800);
    font-size: var(--bzl-upload-list-picture-icon-size);
  }

  .upload__file-item--picture .upload__reload,
  .upload__file-item--picture .upload__remove {
    font-size: var(--bzl-font-size-x-large);
  }

  .upload__file-item-icon--error {
    color: var(--bzl-color-danger-700);
  }
`),Te={},r=o`

  .bzl-design-icon-pure {
    font-family: "bzl-design-icon-pure" !important;
    font-size: inherit;
    font-style: normal;
    font-weight: normal;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    vertical-align: top;
  }

  .bzl-design-icon-pure.checkpart-outline:before {
    content: "\\e1dd";
  }
  .bzl-design-icon-pure.checkall-outline:before {
    content: "\\e1dc";
  }
  .bzl-design-icon-pure.pin-to-top-outline:before {
    content: "\\e1db";
  }
  .bzl-design-icon-pure.add-group-outline:before {
    content: "\\e1d9";
  }
  .bzl-design-icon-pure.dual-card-display-outline:before {
    content: "\\e1da";
  }
  .bzl-design-icon-pure.loading:before {
    content: "\\e1d8";
  }
  .bzl-design-icon-pure.portfolio-pic-outline:before {
    content: "\\e1d7";
  }
  .bzl-design-icon-pure.expert-analyzer-outline:before {
    content: "\\e1d6";
  }
  .bzl-design-icon-pure.communication-progress-outline:before {
    content: "\\e1d5";
  }
  .bzl-design-icon-pure.close-face1:before {
    content: "\\e1d4";
  }
  .bzl-design-icon-pure.car-outline1:before {
    content: "\\e1d3";
  }
  .bzl-design-icon-pure.bus-outline1:before {
    content: "\\e1d2";
  }
  .bzl-design-icon-pure.bike-outline1:before {
    content: "\\e1d1";
  }
  .bzl-design-icon-pure.hightlight-face1:before {
    content: "\\e1d0";
  }
  .bzl-design-icon-pure.image-broke-outline1:before {
    content: "\\e1cf";
  }
  .bzl-design-icon-pure.interview-outline1:before {
    content: "\\e1ce";
  }
  .bzl-design-icon-pure.ing-outline1:before {
    content: "\\e1cd";
  }
  .bzl-design-icon-pure.interview-face1:before {
    content: "\\e1cc";
  }
  .bzl-design-icon-pure.purpose-outline1:before {
    content: "\\e1cb";
  }
  .bzl-design-icon-pure.pic-outline1:before {
    content: "\\e1c9";
  }
  .bzl-design-icon-pure.input-face:before {
    content: "\\e1c7";
  }
  .bzl-design-icon-pure.input-outline:before {
    content: "\\e1c8";
  }
  .bzl-design-icon-pure.remove-face1:before {
    content: "\\e1be";
  }
  .bzl-design-icon-pure.tip-face2:before {
    content: "\\e1c1";
  }
  .bzl-design-icon-pure.walk-outline1:before {
    content: "\\e1c5";
  }
  .bzl-design-icon-pure.uploadcloud-face1:before {
    content: "\\e1c3";
  }
  .bzl-design-icon-pure.v-face1:before {
    content: "\\e1c4";
  }
  .bzl-design-icon-pure.setting-face1:before {
    content: "\\e1c0";
  }
  .bzl-design-icon-pure.report-face1:before {
    content: "\\e1bf";
  }
  .bzl-design-icon-pure.top-outline1:before {
    content: "\\e1c2";
  }
  .bzl-design-icon-pure.pic-face1:before {
    content: "\\e1bd";
  }
  .bzl-design-icon-pure.view-phone-outline:before {
    content: "\\e1b6";
  }
  .bzl-design-icon-pure.view-wechat-outline:before {
    content: "\\e1b8";
  }
  .bzl-design-icon-pure.chat-message:before {
    content: "\\e1b9";
  }
  .bzl-design-icon-pure.view-resume-outline:before {
    content: "\\e1b7";
  }
  .bzl-design-icon-pure.copy-outline1:before {
    content: "\\e1ba";
  }
  .bzl-design-icon-pure.interview-completed-outline:before {
    content: "\\e1b2";
  }
  .bzl-design-icon-pure.refuse-outline:before {
    content: "\\e1b3";
  }
  .bzl-design-icon-pure.retract-outline:before {
    content: "\\e1b4";
  }
  .bzl-design-icon-pure.transfer-outline:before {
    content: "\\e1b5";
  }
  .bzl-design-icon-pure.change-phone-number-outline:before {
    content: "\\e1b1";
  }
  .bzl-design-icon-pure.accessibility-outline:before {
    content: "\\e1a2";
  }
  .bzl-design-icon-pure.hearing-aid-outline:before {
    content: "\\e1a4";
  }
  .bzl-design-icon-pure.crutch-outline:before {
    content: "\\e1a3";
  }
  .bzl-design-icon-pure.hearing-impairment-outline:before {
    content: "\\e1a5";
  }
  .bzl-design-icon-pure.mental-disability-outline:before {
    content: "\\e1a7";
  }
  .bzl-design-icon-pure.physical-disability-outline:before {
    content: "\\e1a9";
  }
  .bzl-design-icon-pure.visual-impairment-outline:before {
    content: "\\e1ac";
  }
  .bzl-design-icon-pure.visual-aiddevice-outline:before {
    content: "\\e1ab";
  }
  .bzl-design-icon-pure.intellectual-disability-outline:before {
    content: "\\e1a6";
  }
  .bzl-design-icon-pure.walker-outline:before {
    content: "\\e1ad";
  }
  .bzl-design-icon-pure.lower-prosthesis-outline:before {
    content: "\\e1af";
  }
  .bzl-design-icon-pure.wear-prosthesis-outline:before {
    content: "\\e1ae";
  }
  .bzl-design-icon-pure.other-tools-outline:before {
    content: "\\e1a8";
  }
  .bzl-design-icon-pure.speech-impairment-outline:before {
    content: "\\e1aa";
  }
  .bzl-design-icon-pure.search-outline:before {
    content: "\\e18a";
  }
  .bzl-design-icon-pure.send-outline:before {
    content: "\\e18c";
  }
  .bzl-design-icon-pure.send-face:before {
    content: "\\e18b";
  }
  .bzl-design-icon-pure.setting-outline:before {
    content: "\\e18e";
  }
  .bzl-design-icon-pure.time-outline:before {
    content: "\\e190";
  }
  .bzl-design-icon-pure.tip-outline:before {
    content: "\\e193";
  }
  .bzl-design-icon-pure.tip-face:before {
    content: "\\e191";
  }
  .bzl-design-icon-pure.up-outline:before {
    content: "\\e195";
  }
  .bzl-design-icon-pure.upload-outline:before {
    content: "\\e196";
  }
  .bzl-design-icon-pure.switch-outline:before {
    content: "\\e18f";
  }
  .bzl-design-icon-pure.volumeoff-face:before {
    content: "\\e199";
  }
  .bzl-design-icon-pure.volumeon-face:before {
    content: "\\e19b";
  }
  .bzl-design-icon-pure.zoomout-outline:before {
    content: "\\e1a1";
  }
  .bzl-design-icon-pure.volumeon-outline:before {
    content: "\\e19c";
  }
  .bzl-design-icon-pure.volumeoff-outline:before {
    content: "\\e19a";
  }
  .bzl-design-icon-pure.work-face:before {
    content: "\\e19e";
  }
  .bzl-design-icon-pure.work-outline:before {
    content: "\\e19f";
  }
  .bzl-design-icon-pure.zoomin-outline:before {
    content: "\\e1a0";
  }
  .bzl-design-icon-pure.report-outline:before {
    content: "\\e17f";
  }
  .bzl-design-icon-pure.retransmission-outline:before {
    content: "\\e180";
  }
  .bzl-design-icon-pure.rightback-medium-outline:before {
    content: "\\e182";
  }
  .bzl-design-icon-pure.rightback-small-outline1:before {
    content: "\\e184";
  }
  .bzl-design-icon-pure.rightback-small-outline2:before {
    content: "\\e185";
  }
  .bzl-design-icon-pure.round-outline:before {
    content: "\\e186";
  }
  .bzl-design-icon-pure.save-face:before {
    content: "\\e187";
  }
  .bzl-design-icon-pure.save-outline:before {
    content: "\\e188";
  }
  .bzl-design-icon-pure.right-outline:before {
    content: "\\e181";
  }
  .bzl-design-icon-pure.remove-outline:before {
    content: "\\e17d";
  }
  .bzl-design-icon-pure.scan-outline:before {
    content: "\\e189";
  }
  .bzl-design-icon-pure.photo-face:before {
    content: "\\e171";
  }
  .bzl-design-icon-pure.photo:before {
    content: "\\e172";
  }
  .bzl-design-icon-pure.place-outline:before {
    content: "\\e176";
  }
  .bzl-design-icon-pure.rate-outline:before {
    content: "\\e17b";
  }
  .bzl-design-icon-pure.radio-face:before {
    content: "\\e17a";
  }
  .bzl-design-icon-pure.pass-face:before {
    content: "\\e16f";
  }
  .bzl-design-icon-pure.purpose-face:before {
    content: "\\e178";
  }
  .bzl-design-icon-pure.pass-outline:before {
    content: "\\e170";
  }
  .bzl-design-icon-pure.place-face:before {
    content: "\\e175";
  }
  .bzl-design-icon-pure.increase-outline:before {
    content: "\\e161";
  }
  .bzl-design-icon-pure.lights-outline:before {
    content: "\\e168";
  }
  .bzl-design-icon-pure.message-outline:before {
    content: "\\e16d";
  }
  .bzl-design-icon-pure.load-outline:before {
    content: "\\e16a";
  }
  .bzl-design-icon-pure.ing-face:before {
    content: "\\e162";
  }
  .bzl-design-icon-pure.message-face:before {
    content: "\\e16c";
  }
  .bzl-design-icon-pure.modify-outline:before {
    content: "\\e16e";
  }
  .bzl-design-icon-pure.leftback-outline:before {
    content: "\\e166";
  }
  .bzl-design-icon-pure.lights-face:before {
    content: "\\e167";
  }
  .bzl-design-icon-pure.menu-outline:before {
    content: "\\e16b";
  }
  .bzl-design-icon-pure.link-outline:before {
    content: "\\e169";
  }
  .bzl-design-icon-pure.collection-outline:before {
    content: "\\e154";
  }
  .bzl-design-icon-pure.collection-outline1:before {
    content: "\\e155";
  }
  .bzl-design-icon-pure.delete-outline:before {
    content: "\\e158";
  }
  .bzl-design-icon-pure.down-outline:before {
    content: "\\e159";
  }
  .bzl-design-icon-pure.educational-background-face:before {
    content: "\\e15a";
  }
  .bzl-design-icon-pure.educational-background-outline:before {
    content: "\\e15b";
  }
  .bzl-design-icon-pure.explain-outline:before {
    content: "\\e15c";
  }
  .bzl-design-icon-pure.image-broke-face:before {
    content: "\\e15e";
  }
  .bzl-design-icon-pure.copy-face:before {
    content: "\\e156";
  }
  .bzl-design-icon-pure.copy-outline:before {
    content: "\\e157";
  }
  .bzl-design-icon-pure.improper-outline:before {
    content: "\\e160";
  }
  .bzl-design-icon-pure.ban-outline:before {
    content: "\\e14d";
  }
  .bzl-design-icon-pure.ban-face:before {
    content: "\\e14c";
  }
  .bzl-design-icon-pure.close-outline:before {
    content: "\\e153";
  }
  .bzl-design-icon-pure.change-outline:before {
    content: "\\e151";
  }
  .bzl-design-icon-pure.add-face:before {
    content: "\\e149";
  }
  .bzl-design-icon-pure.add-outline1:before {
    content: "\\e14a";
  }
  .bzl-design-icon-pure.ai-face1:before {
    content: "\\e14b";
  }
  .bzl-design-icon-pure.recruitment-data-face:before {
    content: "\\e136";
  }
  .bzl-design-icon-pure.referral-face:before {
    content: "\\e138";
  }
  .bzl-design-icon-pure.recruitment-data-outline:before {
    content: "\\e137";
  }
  .bzl-design-icon-pure.referral-outline:before {
    content: "\\e139";
  }
  .bzl-design-icon-pure.rights-face:before {
    content: "\\e13a";
  }
  .bzl-design-icon-pure.rule-center-outline:before {
    content: "\\e13d";
  }
  .bzl-design-icon-pure.hunt-face:before {
    content: "\\e13e";
  }
  .bzl-design-icon-pure.target-outline:before {
    content: "\\e141";
  }
  .bzl-design-icon-pure.hunt-outline:before {
    content: "\\e13f";
  }
  .bzl-design-icon-pure.tools-box-face:before {
    content: "\\e142";
  }
  .bzl-design-icon-pure.tools-box-outline:before {
    content: "\\e143";
  }
  .bzl-design-icon-pure.tools-face:before {
    content: "\\e144";
  }
  .bzl-design-icon-pure.rights-outline:before {
    content: "\\e13b";
  }
  .bzl-design-icon-pure.rule-center-face:before {
    content: "\\e13c";
  }
  .bzl-design-icon-pure.target-face:before {
    content: "\\e140";
  }
  .bzl-design-icon-pure.tools-outline:before {
    content: "\\e145";
  }
  .bzl-design-icon-pure.job-subscription-face:before {
    content: "\\e126";
  }
  .bzl-design-icon-pure.job-subscription-outline:before {
    content: "\\e127";
  }
  .bzl-design-icon-pure.live-recruitment-outline:before {
    content: "\\e129";
  }
  .bzl-design-icon-pure.live-recruitment-face:before {
    content: "\\e128";
  }
  .bzl-design-icon-pure.more2-outline:before {
    content: "\\e12d";
  }
  .bzl-design-icon-pure.outsourcing-face:before {
    content: "\\e12e";
  }
  .bzl-design-icon-pure.precise-call-outline:before {
    content: "\\e131";
  }
  .bzl-design-icon-pure.outsourcing-outline:before {
    content: "\\e12f";
  }
  .bzl-design-icon-pure.more2-face:before {
    content: "\\e12c";
  }
  .bzl-design-icon-pure.premium-management-face:before {
    content: "\\e132";
  }
  .bzl-design-icon-pure.purple-face:before {
    content: "\\e134";
  }
  .bzl-design-icon-pure.me-outline:before {
    content: "\\e12b";
  }
  .bzl-design-icon-pure.purple-outline:before {
    content: "\\e135";
  }
  .bzl-design-icon-pure.precise-call-face:before {
    content: "\\e130";
  }
  .bzl-design-icon-pure.me-face:before {
    content: "\\e12a";
  }
  .bzl-design-icon-pure.premium-management-outline:before {
    content: "\\e133";
  }
  .bzl-design-icon-pure.human-face:before {
    content: "\\e114";
  }
  .bzl-design-icon-pure.human-outline:before {
    content: "\\e115";
  }
  .bzl-design-icon-pure.inspiration-outline:before {
    content: "\\e117";
  }
  .bzl-design-icon-pure.intelligent-interview-outline:before {
    content: "\\e119";
  }
  .bzl-design-icon-pure.inspiration-face:before {
    content: "\\e116";
  }
  .bzl-design-icon-pure.intention-communication-outline:before {
    content: "\\e11b";
  }
  .bzl-design-icon-pure.intention-leads-face:before {
    content: "\\e11c";
  }
  .bzl-design-icon-pure.intention-leads-outline:before {
    content: "\\e11d";
  }
  .bzl-design-icon-pure.interview-management-face:before {
    content: "\\e120";
  }
  .bzl-design-icon-pure.intention-communication-face:before {
    content: "\\e11a";
  }
  .bzl-design-icon-pure.interview-pelple-face:before {
    content: "\\e122";
  }
  .bzl-design-icon-pure.interaction-outline:before {
    content: "\\e11f";
  }
  .bzl-design-icon-pure.job-management-face:before {
    content: "\\e124";
  }
  .bzl-design-icon-pure.interview-management-outiine:before {
    content: "\\e121";
  }
  .bzl-design-icon-pure.job-management-outline:before {
    content: "\\e125";
  }
  .bzl-design-icon-pure.interview-pelple-outline:before {
    content: "\\e123";
  }
  .bzl-design-icon-pure.intelligent-interview-face:before {
    content: "\\e118";
  }
  .bzl-design-icon-pure.interaction-face:before {
    content: "\\e11e";
  }
  .bzl-design-icon-pure.ai-recruitment-outline:before {
    content: "\\e101";
  }
  .bzl-design-icon-pure.city-face:before {
    content: "\\e106";
  }
  .bzl-design-icon-pure.city-outline:before {
    content: "\\e107";
  }
  .bzl-design-icon-pure.filter-face:before {
    content: "\\e112";
  }
  .bzl-design-icon-pure.bidding-platform-face:before {
    content: "\\e102";
  }
  .bzl-design-icon-pure.company-homepage-outline:before {
    content: "\\e109";
  }
  .bzl-design-icon-pure.company-management-outline:before {
    content: "\\e10b";
  }
  .bzl-design-icon-pure.control-face:before {
    content: "\\e10c";
  }
  .bzl-design-icon-pure.creation-center-outline:before {
    content: "\\e111";
  }
  .bzl-design-icon-pure.company-management-face:before {
    content: "\\e10a";
  }
  .bzl-design-icon-pure.creation-center-face:before {
    content: "\\e110";
  }
  .bzl-design-icon-pure.chat-outline:before {
    content: "\\e105";
  }
  .bzl-design-icon-pure.control-outline:before {
    content: "\\e10d";
  }
  .bzl-design-icon-pure.filter-outline:before {
    content: "\\e113";
  }
  .bzl-design-icon-pure.chat-face:before {
    content: "\\e104";
  }
  .bzl-design-icon-pure.bidding-platform-outline:before {
    content: "\\e103";
  }
  .bzl-design-icon-pure.company-homepage-face:before {
    content: "\\e108";
  }
  .bzl-design-icon-pure.ai-recruitment-face:before {
    content: "\\e100";
  }
`,De=o`
  :host {
    display: inline-block;
    width: 1em;
    height: 1em;
    box-sizing: content-box !important;
    line-height: 1;
  }

  svg {
    display: block;
    height: 100%;
    width: 100%;
  }

  /* 更多 */
`,Oe=[{name:"color",resolver:e=>`https://static.zhipin.com/assets/bzl-design/icons/colorful/${e}.svg`}],Pe=[];function Fe(t){return Oe.find(e=>e.name===t)}function Le(t,e){Me(t),Oe.push({name:t,resolver:e.resolver,mutator:e.mutator,spriteSheet:e.spriteSheet}),Pe.forEach(e=>{e.library===t&&e.setIcon()})}function Me(t){Oe=Oe.filter(e=>e.name!==t)}var Re=Object.create,Ve=Object.defineProperty,Be=Object.defineProperties,Ie=Object.getOwnPropertyDescriptor,Ue=Object.getOwnPropertyDescriptors,Ne=Object.getOwnPropertyNames,He=Object.getOwnPropertySymbols,qe=Object.getPrototypeOf,je=Object.prototype.hasOwnProperty,We=Object.prototype.propertyIsEnumerable,Ke=(e,t)=>Symbol[e]||Symbol.for("Symbol."+e),Ye=e=>{throw TypeError(e)},Ze=(e,t,i)=>t in e?Ve(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i,y=(e,t)=>{for(var i in t=t||{})je.call(t,i)&&Ze(e,i,t[i]);if(He)for(var i of He(t))We.call(t,i)&&Ze(e,i,t[i]);return e},z=(e,t)=>Be(e,Ue(t)),Xe=(e,t)=>{var i={};for(o in e)je.call(e,o)&&t.indexOf(o)<0&&(i[o]=e[o]);if(null!=e&&He)for(var o of He(e))t.indexOf(o)<0&&We.call(e,o)&&(i[o]=e[o]);return i},n=(e,t)=>function(){return t||(0,e[Ne(e)[0]])((t={exports:{}}).exports,t),t.exports},s=(e,t,i)=>(i=null!=e?Re(qe(e)):{},((t,i,o,r)=>{if(i&&"object"==typeof i||"function"==typeof i)for(let e of Ne(i))je.call(t,e)||e===o||Ve(t,e,{get:()=>i[e],enumerable:!(r=Ie(i,e))||r.enumerable});return t})(!t&&e&&e.__esModule?i:Ve(i,"default",{value:e,enumerable:!0}),e)),d=(e,t,i,o)=>{for(var r,a=1<o?void 0:o?Ie(t,i):t,n=e.length-1;0<=n;n--)(r=e[n])&&(a=(o?r(t,i,a):r(a))||a);return o&&a&&Ve(t,i,a),a},Qe=(e,t,i)=>t.has(e)||Ye("Cannot "+i),Je=function(e,t){this[0]=e,this[1]=t},Ge=e=>{var r=e[Ke("asyncIterator")],t=!1,i={},e=null==r?(r=e[Ke("iterator")](),t=>i[t]=e=>r[t](e)):(r=r.call(e),o=>i[o]=i=>{if(t){if(t=!1,"throw"===o)throw i;return i}return{done:!(t=!0),value:new Je(new Promise(e=>{var t=r[o](i);t instanceof Object||Ye("Object expected"),e(t)}),1)}});return i[Ke("iterator")]=()=>i,e("next"),"throw"in r?e("throw"):i.throw=e=>{throw e},"return"in r&&e("return"),i};function p(i,e){let a=y({waitUntilFirstUpdate:!1},e);return(e,o)=>{let t=e.update,r=Array.isArray(i)?i:[i];e.update=function(i){r.forEach(e=>{var t;!i.has(e)||(t=i.get(e))===(e=this[e])||a.waitUntilFirstUpdate&&!this.hasUpdated||this[o](t,e)}),t.call(this,i)}}}var u=o`
  :host {
    box-sizing: border-box;
  }

  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }

  [hidden] {
    display: none !important;
  }

  /*
  * 细滚动条（4px 宽/高），适用于可滚动容器（如 div）。需配合 overflow: auto / scroll 使用。
  * Firefox 使用 scrollbar-width: thin，宽度由浏览器决定；WebKit 系列为精确的 4px。
  */
  .bzl-scrollbar {
    scrollbar-width: thin;
    scrollbar-color: var(--bzl-color-gray-400) transparent;
  }

  .bzl-scrollbar::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  .bzl-scrollbar::-webkit-scrollbar-track {
    background: transparent;
  }

  .bzl-scrollbar::-webkit-scrollbar-thumb {
    background-color: var(--bzl-color-gray-400);
  }

  .bzl-scrollbar::-webkit-scrollbar-thumb:hover {
    background-color: var(--bzl-color-gray-500);
  }
`,et={attribute:!0,type:String,converter:Se,reflect:!1,hasChanged:Ee};function b(r){return(e,t)=>{return"object"==typeof t?((o=et,r,e)=>{var{kind:t,metadata:i}=e;let a=globalThis.litPropertyMetadata.get(i);if(void 0===a&&globalThis.litPropertyMetadata.set(i,a=new Map),"setter"===t&&((o=Object.create(o)).wrapped=!0),a.set(e.name,o),"accessor"===t){let i=e.name;return{set(e){var t=r.get.call(this);r.set.call(this,e),this.requestUpdate(i,t,o)},init(e){return void 0!==e&&this.C(i,void 0,o,e),e}}}if("setter"!==t)throw Error("Unsupported decorator location: "+t);{let i=e.name;return function(e){var t=this[i];r.call(this,e),this.requestUpdate(i,t,o)}}})(r,e,t):(i=r,t=t,o=(e=e).hasOwnProperty(t),e.constructor.createProperty(t,i),o?Object.getOwnPropertyDescriptor(e,t):void 0);var i,o}}function f(e){return b(z(y({},e),{state:!0,attribute:!1}))}var tt=(e,t,i)=>(i.configurable=!0,i.enumerable=!0,Reflect.decorate&&"object"!=typeof t&&Object.defineProperty(e,t,i),i);function g(t,i){return(e,o,r)=>{let a=e=>null!=(e=null==(e=e.renderRoot)?void 0:e.querySelector(t))?e:null;if(i){let{get:t,set:i}="object"==typeof o?e:null!=r?r:(()=>{let t=Symbol();return{get(){return this[t]},set(e){this[t]=e}}})();return tt(e,o,{get(){let e=t.call(this);return void 0===e&&(null!==(e=a(this))||this.hasUpdated)&&i.call(this,e),e}})}return tt(e,o,{get(){return a(this)}})}}var it,t=class extends t{constructor(){var e,t,i;super(),e=this,i=!1,(t=ot).has(e)?Ye("Cannot add the same private member more than once"):t instanceof WeakSet?t.add(e):t.set(e,i),this.initialReflectedProperties=new Map,Object.entries(this.constructor.dependencies).forEach(([e,t])=>{this.constructor.define(e,t)})}emit(e,t){e=new CustomEvent(e,y({bubbles:!0,cancelable:!1,composed:!0,detail:{}},t));return this.dispatchEvent(e),e}static define(i,o=this,t={}){var r=customElements.get(i);if(r){let e=" (unknown version)",t=e;"version"in o&&o.version&&(e=" v"+o.version),"version"in r&&r.version&&(t=" v"+r.version),e&&t&&e===t||console.warn(`Attempted to register <${i}>${e}, but <${i}>${t} has already been registered.`)}else try{customElements.define(i,o,t)}catch(e){customElements.define(i,class extends o{},t)}}attributeChangedCallback(e,t,i){var o,r,a,n;Qe(r=this,a=ot,"read from private field"),(n?n.call(r):a.get(r))||(this.constructor.elementProperties.forEach((e,t)=>{e.reflect&&null!=this[t]&&this.initialReflectedProperties.set(t,this[t])}),n=!0,Qe(a=this,r=ot,"write to private field"),o?o.call(a,n):r.set(a,n)),super.attributeChangedCallback(e,t,i)}willUpdate(i){super.willUpdate(i),this.initialReflectedProperties.forEach((e,t)=>{i.has(t)&&null==this[t]&&(this[t]=e)})}},ot=new WeakMap,rt=(t.version="0.0.19",t.dependencies={},d([b()],t.prototype,"dir",2),d([b()],t.prototype,"lang",2),Symbol()),at=Symbol(),nt=new Map,m=class extends t{constructor(){super(...arguments),this.initialRender=!1,this.svg=null,this.library="color",this.type="font"}async resolveIcon(e,t){let i,o;if(null!=t&&t.spriteSheet)return this.svg=h`<svg part="svg">
        <use part="use" href="${e}"></use>
      </svg>`,this.svg;try{if(!(o=await fetch(e,{mode:"cors"})).ok)return 410===o.status?rt:at}catch(e){return at}try{var r,a=document.createElement("div"),n=(a.innerHTML=await o.text(),a.firstElementChild);return"svg"!==(null==(i=null==n?void 0:n.tagName)?void 0:i.toLowerCase())?rt:(r=(it=it||new DOMParser).parseFromString(n.outerHTML,"text/html").body.querySelector("svg"))?(r.part.add("svg"),document.adoptNode(r)):rt}catch(e){return rt}}connectedCallback(){super.connectedCallback(),Pe.push(this)}firstUpdated(){this.initialRender=!0,this.setIcon()}disconnectedCallback(){var t;super.disconnectedCallback(),t=this,Pe=Pe.filter(e=>e!==t)}getIconSource(){var e=Fe(this.library);return this.name&&e?{url:e.resolver(this.name),fromLibrary:!0}:{url:void 0,fromLibrary:!1}}async setIcon(){var t;if("font"===this.type)this.svg=null;else{var{url:i,fromLibrary:o}=this.getIconSource(),r=o?Fe(this.library):void 0;if(i){let e=nt.get(i);if(e||(e=this.resolveIcon(i,r),nt.set(i,e)),this.initialRender){var a,n=await e;if(n===at&&nt.delete(i),i===this.getIconSource().url)if(o=n,void 0===a?void 0!==(null==o?void 0:o._$litType$):(null==o?void 0:o._$litType$)===a)this.svg=n,r&&(await this.updateComplete,i=this.shadowRoot.querySelector("[part='svg']"),"function"==typeof r.mutator)&&i&&r.mutator(i);else switch(n){case at:case rt:this.svg=null,this.emit("bzl-error");break;default:this.svg=n.cloneNode(!0),null!=(t=null==r?void 0:r.mutator)&&t.call(r,this.svg),this.emit("bzl-load")}}}else this.svg=null}}render(){return"font"===this.type&&this.name?h`<i class="bzl-design-icon-pure ${this.name}" style="font-size: inherit;"></i>`:this.svg}};m.styles=[u,De,r],d([f()],m.prototype,"svg",2),d([b({reflect:!0})],m.prototype,"name",2),d([b({reflect:!0})],m.prototype,"library",2),d([b({reflect:!0})],m.prototype,"type",2),d([p(["name","library","type"])],m.prototype,"setIcon",1);var st=1,lt=2,ct=3,dt=4,De=t=>(...e)=>({_$litDirective$:t,values:e}),r=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}},v=De(class extends r{constructor(e){if(super(e),e.type!==st||"class"!==e.name||2<(null==(e=e.strings)?void 0:e.length))throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(t){return" "+Object.keys(t).filter(e=>t[e]).join(" ")+" "}update(e,[t]){var i,o;if(void 0===this.st){for(var r in this.st=new Set,void 0!==e.strings&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(e=>""!==e))),t)!t[r]||null!=(i=this.nt)&&i.has(r)||this.st.add(r);return this.render(t)}var a,n,s=e.element.classList;for(a of this.st)a in t||(s.remove(a),this.st.delete(a));for(n in t){var l=!!t[n];l===this.st.has(n)||null!=(o=this.nt)&&o.has(n)||(l?(s.add(n),this.st.add(n)):(s.remove(n),this.st.delete(n)))}return c}}),ht=new Set(["application/msword","application/vnd.openxmlformats-officedocument.wordprocessingml.document","application/vnd.ms-word.document.macroEnabled.12","application/vnd.openxmlformats-officedocument.wordprocessingml.template","application/vnd.ms-word.template.macroEnabled.12"]),pt=new Set(["jpg","jpeg","png","gif","webp","svg","bmp","ico","avif","heic","heif"]),ut=new Set(["doc","docx","docm","dot","dotx","dotm"]),_=class _ extends t{constructor(){super(...arguments),this.fileList=[],this.dragOver=!1,this.hasTriggerSlot=!1,this.action="",this.headers={},this.name="file",this.withCredentials=!1,this.multiple=!1,this.accept="",this.disabled=!1,this.hideFileList=!1,this.listType="text",this.drag=!1,this.manualUpload=!1,this.requestMap=new Map,this.uploadTaskTokenByUid=new Map,this.cancelledUploadUids=new Set,this.uploadTaskSeed=0,this.pictureThumbUrlByUid=new Map}connectedCallback(){super.connectedCallback(),this.syncHasTriggerSlot()}willUpdate(e){super.willUpdate(e),e.has("listType")&&("picture"===this.listType?this.fileList.forEach(e=>this.ensurePictureThumbUrl(e)):this.revokeAllPictureThumbUrls())}disconnectedCallback(){this.revokeAllPictureThumbUrls(),super.disconnectedCallback()}syncHasTriggerSlot(){var e=null!==this.querySelector('[slot="trigger"]');e!==this.hasTriggerSlot&&(this.hasTriggerSlot=e)}submit(){this.fileList.filter(e=>"ready"===e.status).forEach(e=>{this.upload(e)})}abort(e){if(e)return(e=this.resolveUid(e))?void this.abortRequest(e):void 0;this.fileList.forEach(e=>{"uploading"===e.status&&this.abortRequest(e.uid)})}clearFiles(){this.abort(),this.revokeAllPictureThumbUrls(),this.fileList=[]}resolveUid(t){var e;return"uid"in t?t.uid:null==(e=this.fileList.find(e=>e.raw===t))?void 0:e.uid}getFileExtension(e){var t=e.lastIndexOf(".");return t<0||t===e.length-1?"":e.slice(t+1).toLowerCase()}isPictureListImageFile(e){var t=e.raw.type.toLowerCase(),e=this.getFileExtension(e.name);return t.startsWith("image/")||pt.has(e)}getPictureListFileIconName(e){var t=e.raw.type.toLowerCase(),e=this.getFileExtension(e.name);return"application/pdf"===t?"pdf-face":ht.has(t)?"word-face":"pdf"===e?"pdf-face":ut.has(e)?"word-face":"document-face"}formatFileSize(e){var t,i;return!Number.isFinite(e)||e<0?"":0===e?"0 B":(t=["B","KB","MB","GB","TB"],i=e/1024**(e=Math.min(Math.floor(Math.log(e)/Math.log(1024)),t.length-1)),0===e?Math.round(i)+" "+t[e]:(0==(10<=i||Number.isInteger(i)?0:1)?String(Math.round(i)):i.toFixed(1))+" "+t[e])}revokePictureThumbUrl(e){var t=this.pictureThumbUrlByUid.get(e);t&&(URL.revokeObjectURL(t),this.pictureThumbUrlByUid.delete(e))}ensurePictureThumbUrl(e){"picture"===this.listType&&this.isPictureListImageFile(e)&&!this.pictureThumbUrlByUid.has(e.uid)&&this.pictureThumbUrlByUid.set(e.uid,URL.createObjectURL(e.raw))}revokeAllPictureThumbUrls(){[...this.pictureThumbUrlByUid.keys()].forEach(e=>this.revokePictureThumbUrl(e))}startUploadTask(e){this.uploadTaskSeed+=1;var t=this.uploadTaskSeed;return this.uploadTaskTokenByUid.set(e,t),this.cancelledUploadUids.delete(e),t}endUploadTask(e,t){this.uploadTaskTokenByUid.get(e)===t&&this.uploadTaskTokenByUid.delete(e)}isUploadTaskValid(t,e){return this.uploadTaskTokenByUid.get(t)===e&&this.fileList.some(e=>e.uid===t)}cancelUploadTask(e){this.cancelledUploadUids.add(e),this.uploadTaskTokenByUid.delete(e)}abortRequest(e){this.cancelUploadTask(e);var t,i=this.requestMap.get(e);null!=(t=null==i?void 0:i.abort)&&t.call(i),this.requestMap.delete(e),this.updateFileAndGet(e,e=>z(y({},e),{status:"ready",percentage:0}))}createUid(){return _.uid+=1,`bzl-upload-${Date.now()}-`+_.uid}updateFileAndGet(t,i){let o;return this.fileList=this.fileList.map(e=>e.uid!==t?e:o=i(e)),o}emitChange(e){var t;e&&null!=(t=this.onChange)&&t.call(this,e,this.fileList)}handleSlotChange(){this.syncHasTriggerSlot()}openFilePicker(){this.disabled||this.inputEl.click()}handleTriggerClick(){this.openFilePicker()}handleTriggerKeyDown(e){"Enter"!==e.key&&" "!==e.key||(e.preventDefault(),this.openFilePicker())}handleInputChange(e){var e=e.target,t=[...null!=(t=e.files)?t:[]];this.handleSelectedFiles(t),e.value=""}handleDragOver(e){this.drag&&!this.disabled&&(e.preventDefault(),this.dragOver=!0)}handleDragLeave(e){this.drag&&!this.disabled&&(e.preventDefault(),this.dragOver=!1)}handleDrop(e){this.drag&&!this.disabled&&(e.preventDefault(),this.dragOver=!1,e=[...null!=(e=null==(e=e.dataTransfer)?void 0:e.files)?e:[]],this.handleSelectedFiles(e))}isFileAccepted(e){if(!this.accept.trim())return!0;var t=this.accept.split(",").map(e=>e.trim().toLowerCase()).filter(Boolean);let i=e.name.toLowerCase(),o=e.type.toLowerCase();return t.some(e=>{var t;return"*/*"===e||(e.startsWith(".")?i.endsWith(e):e.endsWith("/*")?([t]=e.split("/"),o.startsWith(t+"/")):o===e)})}handleSelectedFiles(t){if(t.length&&!this.disabled){var i,t=t.filter(e=>this.isFileAccepted(e)),o=[];let e=t;"number"==typeof this.limit&&((i=this.limit-this.fileList.length)<=0?(o.push(...t),e=[]):t.length>i&&(e=t.slice(0,i),o.push(...t.slice(i)))),o.length&&null!=(t=this.onExceed)&&t.call(this,o,this.fileList),e.length&&(i=e.map(e=>({uid:this.createUid(),name:e.name,size:e.size,type:e.type,raw:e,status:"ready",percentage:0})),this.fileList=[...this.fileList,...i],i.forEach(e=>this.ensurePictureThumbUrl(e)),i.forEach(e=>this.emitChange(e)),this.manualUpload||i.forEach(e=>{this.upload(e)}))}}async runBeforeUpload(e){if(!this.beforeUpload)return e.raw;try{var t=await this.beforeUpload(e.raw,this.fileList);return!1===t?null:t instanceof File||t instanceof Blob?t:e.raw}catch(e){return null}}createDefaultRequest(o){let e,r=new XMLHttpRequest,i=(r.upload.onprogress=e=>{e.total&&o.onProgress(Math.min(100,e.loaded/e.total*100),e)},r.onerror=()=>{o.onError(new Error("Upload failed"))},r.onabort=()=>{o.onError(new Error("Upload aborted"))},r.onreadystatechange=()=>{if(r.readyState===XMLHttpRequest.DONE)if(200<=r.status&&r.status<300){var i=r.responseText;let t=i;if(i)try{t=JSON.parse(i)}catch(e){t=i}void o.onSuccess(t)}else o.onError(new Error("Upload failed with status "+r.status))},r.open("POST",o.action,!0),r.withCredentials=o.withCredentials,Object.entries(o.headers).forEach(([e,t])=>{r.setRequestHeader(e,t)}),new FormData);return Object.entries(null!=(e=o.data)?e:{}).forEach(([e,t])=>{null!=t&&(t instanceof Blob?i.append(e,t):i.append(e,String(t)))}),i.append(o.filename,o.file),r.send(i),{abort:()=>r.abort()}}async upload(t){var e;if(!this.disabled&&"uploading"!==t.status){let r=this.startUploadTask(t.uid);var i=()=>{if(this.isUploadTaskValid(t.uid,r))return this.fileList.find(e=>e.uid===t.uid)},a=i();if(a){a=await this.runBeforeUpload(a);let o=i();if(a&&o){var i=a instanceof File?a:new File([a],o.name,{type:o.type});if(this.action||this.httpRequest){a=this.updateFileAndGet(o.uid,e=>z(y({},e),{status:"uploading",percentage:0,error:void 0})),a=(this.emitChange(a),{action:this.action,file:i,filename:this.name,data:this.data,headers:this.headers,withCredentials:this.withCredentials,onProgress:t=>{var e,i;this.isUploadTaskValid(o.uid,r)&&(i=this.updateFileAndGet(o.uid,e=>z(y({},e),{status:"uploading",percentage:t})))&&null!=(e=this.onProgress)&&e.call(this,i,this.fileList)},onSuccess:t=>{var e,i;this.isUploadTaskValid(o.uid,r)&&(this.requestMap.delete(o.uid),i=this.updateFileAndGet(o.uid,e=>z(y({},e),{status:"success",percentage:100,response:t,error:void 0})))&&(this.endUploadTask(o.uid,r),null!=(e=this.onSuccess)&&e.call(this,i,this.fileList),this.emitChange(i))},onError:e=>{this.requestMap.delete(o.uid),this.cancelledUploadUids.has(o.uid)?(this.cancelledUploadUids.delete(o.uid),this.endUploadTask(o.uid,r)):this.isUploadTaskValid(o.uid,r)&&(e=e instanceof Error?e:new Error("Upload failed"),this.endUploadTask(o.uid,r),this.handleUploadError(o,e))}}),i=null!=(i=this.httpRequest)?i:e=>this.createDefaultRequest(e);try{var n=i(a),s=n instanceof Promise?await n:n;this.isUploadTaskValid(o.uid,r)?this.requestMap.set(o.uid,null!=s?s:{}):null!=(e=null==s?void 0:s.abort)&&e.call(s)}catch(e){this.isUploadTaskValid(o.uid,r)&&(this.endUploadTask(o.uid,r),i=e instanceof Error?e:new Error("Upload failed"),this.handleUploadError(o,i))}}else this.endUploadTask(t.uid,r),this.handleUploadError(o,new Error('Missing required "action"'))}else this.endUploadTask(t.uid,r)}else this.endUploadTask(t.uid,r)}}handleUploadError(e,t){var i,e=this.updateFileAndGet(e.uid,e=>z(y({},e),{status:"error",error:t}));e&&(null!=(i=this.onError)&&i.call(this,e,this.fileList),this.emitChange(e))}retryUpload(e){this.disabled||this.upload(e)}async removeFile(t){var e;if(this.beforeRemove)try{if(!await this.beforeRemove(t,this.fileList))return}catch(e){return}"uploading"===t.status&&this.abort(t),this.fileList=this.fileList.filter(e=>e.uid!==t.uid),this.revokePictureThumbUrl(t.uid),this.cancelledUploadUids.delete(t.uid),this.uploadTaskTokenByUid.delete(t.uid),null!=(e=this.onRemove)&&e.call(this,t,this.fileList),this.emitChange(t)}renderFileListItemMeta(e){var t="uploading"===e.status||"picture"===this.listType;return h`
      <div part="file-meta" class="upload__file-meta">
        <div
          part="file-name"
          class=${v({"upload__file-name":!0,"upload__file-name--error":"text"===this.listType&&"error"===e.status})}
          title=${e.name}
        >
          ${e.name}
        </div>
        ${t?"uploading"===e.status?h`
                <div
                  part="file-size-progress-track"
                  class=${v({"upload__file-size-progress-track":!0,"upload__file-item-text-progress":"text"===this.listType})}
                >
                  <span
                    part="file-size-progress-bar"
                    class="upload__file-size-progress-bar"
                    style=${`width: ${e.percentage}%`}
                  ></span>
                </div>
              `:"error"===e.status?h` <div part="file-size" class="upload__file-size upload__file-size--error">上传失败</div> `:h` <div part="file-size" class="upload__file-size">${this.formatFileSize(e.size)}</div> `:""}
      </div>
    `}renderFileListItemActions(e){return h`
      <div part="file-item-actions" class="upload__file-item-actions">
        ${"error"===e.status?h`
              <button
                part="reload-button"
                class="upload__reload"
                type="button"
                ?disabled=${this.disabled}
                @click=${()=>this.retryUpload(e)}
              >
                <bzl-icon name="change-outline"></bzl-icon>
              </button>
            `:""}
        <button
          part="remove-button"
          class="upload__remove"
          type="button"
          ?disabled=${this.disabled}
          @click=${()=>this.removeFile(e)}
        >
          <bzl-icon name="delete-outline"></bzl-icon>
        </button>
      </div>
    `}renderPictureListFileItem(e){var t;return h`
      <li
        part="file-item"
        class=${v({"upload__file-item":!0,"upload__file-item--picture":!0,"upload__file-item--uploading":"uploading"===e.status,"upload__file-item--success":"success"===e.status,"upload__file-item--error":"error"===e.status})}
      >
        <div part="file-item-left" class="upload__file-item-left">
          <span class="upload__file-item-icon-picture">
            ${this.isPictureListImageFile(e)?h`
                  <img class="upload__file-item-thumb" src=${null!=(t=this.pictureThumbUrlByUid.get(e.uid))?t:""} alt="" />
                `:h`
                  <bzl-icon
                    type="library"
                    class="upload__file-item-icon"
                    name=${this.getPictureListFileIconName(e)}
                  ></bzl-icon>
                `}
          </span>
          ${this.renderFileListItemMeta(e)}
        </div>
        ${this.renderFileListItemActions(e)}
      </li>
    `}renderTextListFileItem(e){return h`
      <li
        part="file-item"
        class=${v({"upload__file-item":!0,"upload__file-item--uploading":"uploading"===e.status,"upload__file-item--success":"success"===e.status,"upload__file-item--error":"error"===e.status})}
      >
        <div part="file-item-left" class="upload__file-item-left">
          <bzl-icon
            class=${v({"upload__file-item-icon":!0,"upload__file-item-icon--error":"error"===e.status})}
            name="link-outline"
          ></bzl-icon>
          ${this.renderFileListItemMeta(e)}
        </div>
        ${this.renderFileListItemActions(e)}
      </li>
    `}renderFileList(){if(this.hideFileList)return"";let t="picture"===this.listType?e=>this.renderPictureListFileItem(e):e=>this.renderTextListFileItem(e);return h`
      <ul part="file-list" class="upload__file-list">
        ${this.fileList.map(e=>t(e))}
      </ul>
    `}renderTriggerSurface(){var e=h`<slot name="trigger" @slotchange=${this.handleSlotChange}></slot>`,t=h`<slot @slotchange=${this.handleSlotChange}></slot>`,e=this.hasTriggerSlot?e:t;return this.drag?h`
          <div
            part="dropzone"
            class=${v({upload__dropzone:!0,"upload__dropzone--disabled":this.disabled,"upload__dropzone--drag-over":this.dragOver})}
            tabindex=${this.disabled?-1:0}
            @click=${this.handleTriggerClick}
            @keydown=${this.handleTriggerKeyDown}
            @dragover=${this.handleDragOver}
            @dragleave=${this.handleDragLeave}
            @drop=${this.handleDrop}
          >
            <div part="trigger" class="upload__trigger">${e}</div>
          </div>
        `:h`
          <div
            part="content"
            class=${v({upload__content:!0,"upload__content--disabled":this.disabled})}
            tabindex=${this.disabled?-1:0}
            role="button"
            aria-disabled=${this.disabled?"true":"false"}
            @click=${this.handleTriggerClick}
            @keydown=${this.handleTriggerKeyDown}
          >
            <div part="trigger" class="upload__trigger">${e}</div>
          </div>
        `}render(){return h`
      <div part="base" class="upload">
        ${this.renderTriggerSurface()}
        ${this.hasTriggerSlot?h`
              <div part="default" class="upload__default">
                <slot @slotchange=${this.handleSlotChange}></slot>
              </div>
            `:""}

        <input
          part="input"
          class="upload__input"
          type="file"
          ?multiple=${this.multiple}
          ?disabled=${this.disabled}
          accept=${this.accept}
          @change=${this.handleInputChange}
        />

        ${this.renderFileList()}
      </div>
    `}};_.styles=[u,a],_.dependencies={"bzl-icon":m},_.uid=0,d([g(".upload__input")],_.prototype,"inputEl",2),d([f()],_.prototype,"fileList",2),d([f()],_.prototype,"dragOver",2),d([f()],_.prototype,"hasTriggerSlot",2),d([b()],_.prototype,"action",2),d([b({attribute:!1})],_.prototype,"headers",2),d([b({attribute:!1})],_.prototype,"data",2),d([b()],_.prototype,"name",2),d([b({type:Boolean,attribute:"with-credentials"})],_.prototype,"withCredentials",2),d([b({type:Boolean})],_.prototype,"multiple",2),d([b()],_.prototype,"accept",2),d([b({type:Boolean,reflect:!0})],_.prototype,"disabled",2),d([b({type:Boolean,reflect:!0,attribute:"hide-file-list"})],_.prototype,"hideFileList",2),d([b({attribute:"list-type",reflect:!0,converter:{fromAttribute:e=>"picture"===e?"picture":"text",toAttribute:e=>e}})],_.prototype,"listType",2),d([b({type:Boolean,reflect:!0})],_.prototype,"drag",2),d([b({type:Boolean,reflect:!0,attribute:"manual-upload"})],_.prototype,"manualUpload",2),d([b({type:Number})],_.prototype,"limit",2),d([b({attribute:!1})],_.prototype,"httpRequest",2),d([b({attribute:!1})],_.prototype,"beforeUpload",2),d([b({attribute:!1})],_.prototype,"beforeRemove",2),d([b({attribute:!1})],_.prototype,"onChange",2),d([b({attribute:!1})],_.prototype,"onProgress",2),d([b({attribute:!1})],_.prototype,"onSuccess",2),d([b({attribute:!1})],_.prototype,"onError",2),d([b({attribute:!1})],_.prototype,"onExceed",2),d([b({attribute:!1})],_.prototype,"onRemove",2);var bt=_,ft=(_.define("bzl-upload"),new WeakMap),gt=new WeakMap,mt=new WeakMap,vt=new WeakSet,yt=new WeakMap,zt=class{constructor(e,t){this.handleFormData=t=>{var e=this.options.disabled(this.host);let i=this.options.name(this.host);var o=this.options.value(this.host),r="bzl-button"===this.host.tagName.toLowerCase();this.host.isConnected&&!e&&!r&&"string"==typeof i&&0<i.length&&void 0!==o&&(Array.isArray(o)?o.forEach(e=>{t.formData.append(i,e.toString())}):t.formData.append(i,o.toString()))},this.handleFormSubmit=e=>{var t,i=this.options.disabled(this.host),o=this.options.reportValidity;this.form&&!this.form.noValidate&&null!=(t=ft.get(this.form))&&t.forEach(e=>{this.setUserInteracted(e,!0)}),!this.form||this.form.noValidate||i||o(this.host)||(e.preventDefault(),e.stopImmediatePropagation())},this.handleFormReset=()=>{this.options.setValue(this.host,this.options.defaultValue(this.host)),this.setUserInteracted(this.host,!1),yt.set(this.host,[])},this.handleInteraction=e=>{var t=yt.get(this.host);t.includes(e.type)||t.push(e.type),t.length===this.options.assumeInteractionOn.length&&this.setUserInteracted(this.host,!0)},this.checkFormValidity=()=>{var e;if(this.form&&!this.form.noValidate)for(e of this.form.querySelectorAll("*"))if("function"==typeof e.checkValidity&&!e.checkValidity())return!1;return!0},this.reportFormValidity=()=>{var e;if(this.form&&!this.form.noValidate)for(e of this.form.querySelectorAll("*"))if("function"==typeof e.reportValidity&&!e.reportValidity())return!1;return!0},(this.host=e).addController(this),this.options=y({form:e=>{var t=e.form;if(t){t=e.getRootNode().querySelector("#"+t);if(t)return t}return e.closest("form")},name:e=>e.name,value:e=>e.value,defaultValue:e=>e.defaultValue,disabled:e=>null!=(e=e.disabled)&&e,reportValidity:e=>"function"!=typeof e.reportValidity||e.reportValidity(),checkValidity:e=>"function"!=typeof e.checkValidity||e.checkValidity(),setValue:(e,t)=>e.value=t,assumeInteractionOn:["bzl-input"]},t)}hostConnected(){var e=this.options.form(this.host);e&&this.attachForm(e),yt.set(this.host,[]),this.options.assumeInteractionOn.forEach(e=>{this.host.addEventListener(e,this.handleInteraction)})}hostDisconnected(){this.detachForm(),yt.delete(this.host),this.options.assumeInteractionOn.forEach(e=>{this.host.removeEventListener(e,this.handleInteraction)})}hostUpdated(){var e=this.options.form(this.host);e||this.detachForm(),e&&this.form!==e&&(this.detachForm(),this.attachForm(e)),this.host.hasUpdated&&this.setValidity(this.host.validity.valid)}attachForm(e){e?(this.form=e,ft.has(this.form)?ft.get(this.form).add(this.host):ft.set(this.form,new Set([this.host])),this.form.addEventListener("formdata",this.handleFormData),this.form.addEventListener("submit",this.handleFormSubmit),this.form.addEventListener("reset",this.handleFormReset),gt.has(this.form)||(gt.set(this.form,this.form.reportValidity),this.form.reportValidity=()=>this.reportFormValidity()),mt.has(this.form)||(mt.set(this.form,this.form.checkValidity),this.form.checkValidity=()=>this.checkFormValidity())):this.form=void 0}detachForm(){var e;this.form&&(e=ft.get(this.form))&&(e.delete(this.host),e.size<=0)&&(this.form.removeEventListener("formdata",this.handleFormData),this.form.removeEventListener("submit",this.handleFormSubmit),this.form.removeEventListener("reset",this.handleFormReset),gt.has(this.form)&&(this.form.reportValidity=gt.get(this.form),gt.delete(this.form)),mt.has(this.form)&&(this.form.checkValidity=mt.get(this.form),mt.delete(this.form)),this.form=void 0)}setUserInteracted(e,t){t?vt.add(e):vt.delete(e),e.requestUpdate()}doAction(e,i){var t;if(this.form)if("reset"===e)t=new Event("reset",{bubbles:!0,cancelable:!0}),this.form.dispatchEvent(t);else{let t=document.createElement("button");t.type=e,t.style.position="absolute",t.style.width="0",t.style.height="0",t.style.clipPath="inset(50%)",t.style.overflow="hidden",t.style.whiteSpace="nowrap",i&&(t.name=i.name,t.value=i.value,["formaction","formenctype","formmethod","formnovalidate","formtarget"].forEach(e=>{i.hasAttribute(e)&&t.setAttribute(e,i.getAttribute(e))})),this.form.append(t),t.click(),t.remove()}}getForm(){var e;return null!=(e=this.form)?e:null}reset(e){this.doAction("reset",e)}submit(e){this.doAction("submit",e)}setValidity(e){var t=this.host,i=Boolean(vt.has(t)),o=Boolean(t.required);t.toggleAttribute("data-required",o),t.toggleAttribute("data-optional",!o),t.toggleAttribute("data-invalid",!e),t.toggleAttribute("data-valid",e),t.toggleAttribute("data-user-invalid",!e&&i),t.toggleAttribute("data-user-valid",e&&i)}updateValidity(){var e=this.host;this.setValidity(e.validity.valid)}emitInvalidEvent(e){var t=new CustomEvent("bzl-invalid",{bubbles:!1,composed:!1,cancelable:!0,detail:{}});e||t.preventDefault(),this.host.dispatchEvent(t)||null!=e&&e.preventDefault()}},_t=Object.freeze({badInput:!1,customError:!1,patternMismatch:!1,rangeOverflow:!1,rangeUnderflow:!1,stepMismatch:!1,tooLong:!1,tooShort:!1,typeMismatch:!1,valid:!0,valueMissing:!1});Object.freeze(z(y({},_t),{valid:!1,valueMissing:!0})),Object.freeze(z(y({},_t),{valid:!1,customError:!0}));function xt(e){e=new FormData(e);let o={};return e.forEach((e,t)=>{var i;Reflect.has(o,t)?(i=o[t],Array.isArray(i)?i.push(e):o[t]=[o[t],e]):o[t]=e}),o}function wt(e){let i=[...e.getRootNode().querySelectorAll("*")];var t=[...e.elements],e=ft.get(e),e=e?Array.from(e):[];return[...t,...e].sort((e,t)=>i.indexOf(e)<i.indexOf(t)?-1:i.indexOf(e)>i.indexOf(t)?1:0)}var kt={install(s,e){let r=new WeakMap;s.directive("bzl-model",{bind(e,a,n){var t,i="BZL-SELECT"===e.tagName?"bzl-change":"input",o=e=>{var t,i,o,r=n.context;r&&(t=s,r=r,i=a.expression,e=e.target.value,1===(o=i.split(".")).length?t.set(r,i,e):(i=o.pop(),o=o.reduce((e,t)=>e[t],r),t.set(o,i,e)))};r.set(e,o),e.value=null!=(t=a.value)?t:void 0,e.addEventListener(i,o)},update(e,t){e.value=null!=(e=t.value)?e:void 0},unbind(e){var t,i=r.get(e);i&&(t="BZL-SELECT"===e.tagName?"bzl-change":"input",e.removeEventListener(t,i))}})}},a=o`
  :host {
    display: block;
    position: fixed;
    top: 32px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 9999;
    pointer-events: auto;
  }

  .toast {
    display: flex;
    align-items: center;
    gap: 0;
    height: 40px;
    padding: 9px 16px;
    border-radius: 12px;
    box-shadow: 0px 4px 16px 0px rgba(0, 0, 0, 0.1);
    font-size: 14px;
    line-height: 20px;
    color: #fff;
    opacity: 0;
    transform: translateY(-20px);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    pointer-events: auto;
    white-space: nowrap;
  }

  /* 当既有icon又有文本内容时显示4px间距 */
  .toast--has-icon-and-content {
    gap: 4px;
  }

  .toast--animate.toast--visible {
    opacity: 1;
    transform: translateY(0);
  }

  .toast--visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* 成功状态样式 */
  .toast--success {
    background-color: var(--bzl-color-boss-600);
  }

  .toast--success .toast__icon {
    color: #fff;
  }

  /* 信息状态样式 */
  .toast--info {
    background-color: var(--bzl-color-boss-600);
  }

  .toast--info .toast__icon {
    color: #fff;
  }

  /* 警告状态样式 */
  .toast--warning {
    background-color: var(--bzl-color-orange-600);
  }

  .toast--warning .toast__icon {
    color: #fff;
  }

  /* 错误状态样式 */
  .toast--error {
    background-color: var(--bzl-color-red-600);
  }

  .toast--error .toast__icon {
    color: #fff;
  }

  /* loading状态样式 */
  .toast--loading .toast__icon {
    color: #fff;
  }

  .toast__icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
  }

  .toast__icon bzl-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    font-size: 20px;
  }

  .toast__icon bzl-spin {
    --indicator-color: #fff;
  }

  .toast__icon bzl-icon[name='loading'] {
    background: conic-gradient(from -190deg, #fff 0deg, #23b7b7 290deg);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
  }

  .toast__message {
    flex: 1;
    color: #fff;
    font-weight: 400;
  }

  .toast__suffix {
    flex-shrink: 0;
    margin-left: 12px;
    color: #fff;
    font-weight: 400;
    cursor: pointer;
    transition: text-decoration 0.2s ease;
  }

  .toast__suffix:hover {
    text-decoration: underline;
  }

  /* 响应式设计 */
  @media (max-width: 640px) {
    :host {
      left: 16px;
      right: 16px;
      transform: none;
    }

    .toast {
      white-space: normal;
      min-height: 40px;
      height: auto;
    }
  }

  /* 动画效果 */
  @keyframes toast-enter {
    from {
      opacity: 0;
      transform: translateY(-20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes toast-exit {
    from {
      opacity: 1;
      transform: translateY(0);
    }
    to {
      opacity: 0;
      transform: translateY(-20px);
    }
  }

  .toast--animate {
    animation: toast-enter 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .toast--animate:not(.toast--visible) {
    animation: toast-exit 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`,_=o`
  :host {
    --spin-color: var(--bzl-color-primary-600);
    --internal-spin-speed: var(--spin-speed, 1s);
    --spin-font-size: 16px;

    display: inline-flex;
    flex: none;
    font-family: 'PingFang SC';
    font-size: var(--spin-font-size);
  }

  .spin {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .spin--overlay {
    position: relative;
    display: block;
  }

  .spin__content {
    position: relative;
  }

  .spin__overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    z-index: 1;
  }

  .spin__icon {
    display: flex;
    align-items: center;
    justify-content: center;
    animation: spin var(--internal-spin-speed) linear infinite;
  }

  .spin__loading-icon {
    color: var(--spin-color);
  }

  .spin__text {
    color: var(--bzl-color-gray-700);
    text-align: center;
    white-space: nowrap;
    margin-top: 4px;
  }

  /* Size variants */
  .spin--xsmall .spin__loading-icon,
  .spin--xsmall .spin__icon ::slotted(bzl-icon) {
    font-size: 1em;
  }

  .spin--xsmall .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--small .spin__loading-icon,
  .spin--small .spin__icon ::slotted(bzl-icon) {
    font-size: 1.25em;
  }

  .spin--small .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--default .spin__loading-icon,
  .spin--default .spin__icon ::slotted(bzl-icon) {
    font-size: 1.5em;
  }

  .spin--default .spin__text {
    font-size: var(--bzl-font-size-2x-small);
  }

  .spin--large .spin__loading-icon,
  .spin--large .spin__icon ::slotted(bzl-icon) {
    font-size: 2em;
  }

  .spin--large .spin__text {
    font-size: var(--bzl-font-size-small);
  }

  .spin--xlarge .spin__loading-icon,
  .spin--xlarge .spin__icon ::slotted(bzl-icon) {
    font-size: 2.5em;
  }

  .spin--xlarge .spin__text {
    font-size: var(--bzl-font-size-medium);
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`,Ct=class{constructor(e,...t){this.slotNames=[],this.handleSlotChange=e=>{e=e.target;(this.slotNames.includes("[default]")&&!e.name||e.name&&this.slotNames.includes(e.name))&&this.host.requestUpdate()},(this.host=e).addController(this),this.slotNames=t}hasDefaultSlot(){return[...this.host.childNodes].some(e=>{if(e.nodeType===e.TEXT_NODE&&""!==e.textContent.trim())return!0;if(e.nodeType===e.ELEMENT_NODE){if("bzl-visually-hidden"===e.tagName.toLowerCase())return!1;if(!e.hasAttribute("slot"))return!0}return!1})}hasNamedSlot(e){return null!==this.host.querySelector(`:scope > [slot="${e}"]`)}test(e){return"[default]"===e?this.hasDefaultSlot():this.hasNamedSlot(e)}hostConnected(){this.host.shadowRoot.addEventListener("slotchange",this.handleSlotChange)}hostDisconnected(){this.host.shadowRoot.removeEventListener("slotchange",this.handleSlotChange)}},x=class extends t{constructor(){super(...arguments),this.hasSlotController=new Ct(this,"[default]","icon","text"),this.text="",this.size="default"}render(){return this.hasSlotController.test("[default]")?h`
        <div part="base" class="spin spin--${this.size} spin--overlay">
          <div part="content" class="spin__content">
            <slot></slot>
          </div>
          <div class="spin__overlay">
            <div part="icon" class="spin__icon">
              <slot name="icon">
                <bzl-icon type="library" name="loading-face" class="spin__loading-icon"></bzl-icon>
              </slot>
            </div>
            ${this.text||this.hasSlotController.test("text")?h`
                  <div part="text" class="spin__text">
                    <slot name="text">${this.text}</slot>
                  </div>
                `:""}
          </div>
        </div>
      `:h`
      <div part="base" class="spin spin--${this.size}">
        <div part="icon" class="spin__icon">
          <slot name="icon">
            <bzl-icon type="library" name="loading-face" class="spin__loading-icon"></bzl-icon>
          </slot>
        </div>
        ${this.text||this.hasSlotController.test("text")?h`
              <div part="text" class="spin__text">
                <slot name="text">${this.text}</slot>
              </div>
            `:""}
      </div>
    `}},w=(x.styles=[u,_],x.dependencies={"bzl-icon":m},d([b()],x.prototype,"text",2),d([b()],x.prototype,"size",2),class extends t{constructor(){super(...arguments),this.isVisible=!1,this.hasSlotContent=!1,this.hasSuffixContent=!1,this.type="info",this.content="",this.duration=3e3,this.loading=!1}connectedCallback(){super.connectedCallback(),this.show()}firstUpdated(){this.checkSlotContent()}checkSlotContent(){var e=this.shadowRoot.querySelector("slot:not([name])"),e=(e&&(e=e.assignedNodes(),this.hasSlotContent=e.some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent.trim()||e.nodeType===Node.ELEMENT_NODE)),this.shadowRoot.querySelector('slot[name="suffix"]'));e&&(e=e.assignedNodes(),this.hasSuffixContent=e.some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent.trim()||e.nodeType===Node.ELEMENT_NODE))}disconnectedCallback(){super.disconnectedCallback(),this.clearHideTimer()}getDefaultIcon(){return{success:"pass-face",info:"info-circle",warning:"tip-face2",error:"close-face1"}[this.type]}shouldShowIcon(){return!!this.loading||!("info"===this.type&&!this.icon)}clearHideTimer(){this.hideTimer&&(clearTimeout(this.hideTimer),this.hideTimer=void 0)}setHideTimer(){this.clearHideTimer(),0<this.duration&&(this.hideTimer=setTimeout(()=>{this.hide()},this.duration))}show(){this.isVisible||(this.isVisible=!0,this.emit("bzl-show"),this.setHideTimer())}hide(){this.isVisible&&(this.isVisible=!1,this.clearHideTimer(),this.emit("bzl-hide"),setTimeout(()=>{this.remove(),this.emit("bzl-close")},300))}handleMouseEnter(){this.clearHideTimer()}handleMouseLeave(){this.setHideTimer()}handleSlotChange(){this.checkSlotContent()}handleSuffixSlotChange(){this.checkSlotContent()}handleSuffixClick(){this.emit("bzl-suffix-click")}handleDurationChange(){this.isVisible&&this.setHideTimer()}render(){var e=this.loading?"loading":this.icon||this.getDefaultIcon(),t=this.shouldShowIcon(),i=Boolean(this.content)||this.hasSlotContent;return h`
      <div
        part="base"
        class=${v({toast:!0,"toast--success":"success"===this.type,"toast--info":"info"===this.type,"toast--warning":"warning"===this.type,"toast--error":"error"===this.type,"toast--visible":this.isVisible,"toast--animate":!0,"toast--loading":this.loading,"toast--has-icon-and-content":t&&i})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        ${this.shouldShowIcon()?h`
              <div part="icon" class="toast__icon">
                <slot name="icon">
                  ${this.loading?h`<bzl-spin size="small"><bzl-icon slot="icon" name="loading"></bzl-icon></bzl-spin>`:h`<bzl-icon name=${e}></bzl-icon>`}
                </slot>
              </div>
            `:""}

        <div part="message" class="toast__message">
          <slot @slotchange=${this.handleSlotChange}>${this.content}</slot>
        </div>

        <div
          part="suffix"
          class="toast__suffix"
          style="display: ${this.hasSuffixContent?"block":"none"}"
          @click=${this.handleSuffixClick}
        >
          <slot name="suffix" @slotchange=${this.handleSuffixSlotChange}></slot>
        </div>
      </div>
    `}}),$t=(w.styles=[u,a],w.dependencies={"bzl-icon":m,"bzl-spin":x},d([f()],w.prototype,"isVisible",2),d([f()],w.prototype,"hasSlotContent",2),d([f()],w.prototype,"hasSuffixContent",2),d([b({reflect:!0})],w.prototype,"type",2),d([b()],w.prototype,"content",2),d([b({type:Number})],w.prototype,"duration",2),d([b()],w.prototype,"icon",2),d([b({type:Boolean})],w.prototype,"loading",2),d([p("duration")],w.prototype,"handleDurationChange",1),w),_=(w.define("bzl-toast"),o`
  :host {
    --max-width: 284px;
    --hide-delay: 0ms;
    --show-delay: 150ms;

    display: contents;
  }

  .tooltip {
    --arrow-size: var(--bzl-tooltip-arrow-size);
    --arrow-color: #141414cc;
  }

  .tooltip::part(popup) {
    z-index: var(--bzl-z-index-tooltip);
  }

  .tooltip[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .tooltip[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .tooltip[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .tooltip[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .tooltip__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--bzl-tooltip-border-radius);
    background-color: var(--bzl-tooltip-background-color);
    font-family: var(--bzl-tooltip-font-family);
    font-size: var(--bzl-tooltip-font-size);
    font-weight: var(--bzl-tooltip-font-weight);
    line-height: var(--bzl-tooltip-line-height);
    text-align: start;
    white-space: normal;
    color: var(--bzl-tooltip-color);
    padding: var(--bzl-tooltip-padding);
    pointer-events: none;
    user-select: none;
    -webkit-user-select: none;
  }
`),a=o`
  :host {
    --arrow-color: var(--bzl-color-neutral-1000);
    --arrow-size: 8px; /* 使用 SVG 的高度作为箭头尺寸 */
    --arrow-height: var(--arrow-size);
    --arrow-width: calc(var(--arrow-size) * 2.5);
    --arrow-size-diagonal: 8px;
    --arrow-size-diagonal-horizontal: calc(var(--arrow-size-diagonal) * 1.75);
    --arrow-padding-offset: calc(var(--arrow-size-diagonal) - var(--arrow-size));

    display: contents;
  }

  .popup {
    position: absolute;
    isolation: isolate;
    max-width: var(--auto-size-available-width, none);
    max-height: var(--auto-size-available-height, none);
  }

  .popup--fixed {
    position: fixed;
  }

  .popup:not(.popup--active) {
    display: none;
  }

  .popup__arrow {
    position: absolute;
    width: var(--arrow-width);
    height: var(--arrow-height);
    color: var(--arrow-color);
  }

  /* 根据位置调整箭头方向 */
  .popup[data-current-placement*='bottom'] .popup__arrow {
    transform: rotate(180deg);
  }

  .popup[data-current-placement*='left'] .popup__arrow {
    transform: rotate(-90deg);
  }

  .popup[data-current-placement*='right'] .popup__arrow {
    transform: rotate(90deg);
  }

  /* Hover bridge */
  .popup-hover-bridge:not(.popup-hover-bridge--visible) {
    display: none;
  }

  .popup-hover-bridge {
    position: fixed;
    z-index: calc(var(--bzl-z-index-dropdown) - 1);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    clip-path: polygon(
      var(--hover-bridge-top-left-x, 0) var(--hover-bridge-top-left-y, 0),
      var(--hover-bridge-top-right-x, 0) var(--hover-bridge-top-right-y, 0),
      var(--hover-bridge-bottom-right-x, 0) var(--hover-bridge-bottom-right-y, 0),
      var(--hover-bridge-bottom-left-x, 0) var(--hover-bridge-bottom-left-y, 0)
    );
  }
`,St=Math.min,k=Math.max,Et=Math.round,At=Math.floor,Tt=e=>({x:e,y:e}),Dt={left:"right",right:"left",bottom:"top",top:"bottom"},Ot={start:"end",end:"start"};function Pt(e,t,i){return k(e,St(t,i))}function Ft(e,t){return"function"==typeof e?e(t):e}function Lt(e){return e.split("-")[0]}function Mt(e){return e.split("-")[1]}function Rt(e){return"x"===e?"y":"x"}function Vt(e){return"y"===e?"height":"width"}var Bt=new Set(["top","bottom"]);function It(e){return Bt.has(Lt(e))?"y":"x"}function Ut(e){return Rt(It(e))}function Nt(e){return e.replace(/start|end/g,e=>Ot[e])}var Ht=["left","right"],qt=["right","left"],jt=["top","bottom"],Wt=["bottom","top"];function Kt(e,t,i,o){let r=Mt(e),a=((e,t,i)=>{switch(e){case"top":case"bottom":return i?t?qt:Ht:t?Ht:qt;case"left":case"right":return t?jt:Wt;default:return[]}})(Lt(e),"start"===i,o);return a=r&&(a=a.map(e=>e+"-"+r),t)?a.concat(a.map(Nt)):a}function Yt(e){return e.replace(/left|right|bottom|top/g,e=>Dt[e])}function Zt(e){return"number"!=typeof e?y({top:0,right:0,bottom:0,left:0},e):{top:e,right:e,bottom:e,left:e}}function Xt(e){var{x:e,y:t,width:i,height:o}=e;return{width:i,height:o,top:t,left:e,right:e+i,bottom:t+o,x:e,y:t}}function Qt(e,t,i){var{reference:o,floating:r}=e,e=It(t),a=Ut(t),n=Vt(a),s=Lt(t),l="y"===e,c=o.x+o.width/2-r.width/2,d=o.y+o.height/2-r.height/2,h=o[n]/2-r[n]/2;let p;switch(s){case"top":p={x:c,y:o.y-r.height};break;case"bottom":p={x:c,y:o.y+o.height};break;case"right":p={x:o.x+o.width,y:d};break;case"left":p={x:o.x-r.width,y:d};break;default:p={x:o.x,y:o.y}}switch(Mt(t)){case"start":p[a]-=h*(i&&l?-1:1);break;case"end":p[a]+=h*(i&&l?-1:1)}return p}async function Jt(e,t){var{x:i,y:o,platform:r,rects:a,elements:n,strategy:s}=e,{boundary:t="clippingAncestors",rootBoundary:e="viewport",elementContext:l="floating",altBoundary:c=!1,padding:d=0}=Ft(t=void 0===t?{}:t,e),d=Zt(d),c=n[c?"floating"===l?"reference":"floating":l],h=Xt(await r.getClippingRect({element:null==(h=await(null==r.isElement?void 0:r.isElement(c)))||h?c:c.contextElement||await(null==r.getDocumentElement?void 0:r.getDocumentElement(n.floating)),boundary:t,rootBoundary:e,strategy:s})),c="floating"===l?{x:i,y:o,width:a.floating.width,height:a.floating.height}:a.reference,t=await(null==r.getOffsetParent?void 0:r.getOffsetParent(n.floating)),e=await(null==r.isElement?void 0:r.isElement(t))&&await(null==r.getScale?void 0:r.getScale(t))||{x:1,y:1},l=Xt(r.convertOffsetParentRelativeRectToViewportRelativeRect?await r.convertOffsetParentRelativeRectToViewportRelativeRect({elements:n,rect:c,offsetParent:t,strategy:s}):c);return{top:(h.top-l.top+d.top)/e.y,bottom:(l.bottom-h.bottom+d.bottom)/e.y,left:(h.left-l.left+d.left)/e.x,right:(l.right-h.right+d.right)/e.x}}var Gt=new Set(["left","top"]);function ei(){return"undefined"!=typeof window}function ti(e){return oi(e)?(e.nodeName||"").toLowerCase():"#document"}function C(e){return(null==e||null==(e=e.ownerDocument)?void 0:e.defaultView)||window}function ii(e){return null==(e=(oi(e)?e.ownerDocument:e.document)||window.document)?void 0:e.documentElement}function oi(e){return ei()&&(e instanceof Node||e instanceof C(e).Node)}function ri(e){return!!ei()&&(e instanceof Element||e instanceof C(e).Element)}function ai(e){return!!ei()&&(e instanceof HTMLElement||e instanceof C(e).HTMLElement)}function ni(e){return!(!ei()||"undefined"==typeof ShadowRoot)&&(e instanceof ShadowRoot||e instanceof C(e).ShadowRoot)}var si=new Set(["inline","contents"]);function li(e){var{overflow:e,overflowX:t,overflowY:i,display:o}=yi(e);return/auto|scroll|overlay|hidden|clip/.test(e+i+t)&&!si.has(o)}var ci=new Set(["table","td","th"]);var di=[":popover-open",":modal"];function hi(t){return di.some(e=>{try{return t.matches(e)}catch(e){return!1}})}var pi=["transform","translate","scale","rotate","perspective"],ui=["transform","translate","scale","rotate","perspective","filter"],bi=["paint","layout","strict","content"];function fi(e){var t=gi();let i=ri(e)?yi(e):e;return pi.some(e=>!!i[e]&&"none"!==i[e])||!!i.containerType&&"normal"!==i.containerType||!t&&!!i.backdropFilter&&"none"!==i.backdropFilter||!t&&!!i.filter&&"none"!==i.filter||ui.some(e=>(i.willChange||"").includes(e))||bi.some(e=>(i.contain||"").includes(e))}function gi(){return!("undefined"==typeof CSS||!CSS.supports)&&CSS.supports("-webkit-backdrop-filter","none")}var mi=new Set(["html","body","#document"]);function vi(e){return mi.has(ti(e))}function yi(e){return C(e).getComputedStyle(e)}function zi(e){return ri(e)?{scrollLeft:e.scrollLeft,scrollTop:e.scrollTop}:{scrollLeft:e.scrollX,scrollTop:e.scrollY}}function _i(e){return"html"!==ti(e)&&(e=e.assignedSlot||e.parentNode||ni(e)&&e.host||ii(e),ni(e))?e.host:e}function xi(e,t,i){void 0===t&&(t=[]),void 0===i&&(i=!0);var o=function e(t){var i=_i(t);return vi(i)?(t.ownerDocument||t).body:ai(i)&&li(i)?i:e(i)}(e),e=o===(null==(e=e.ownerDocument)?void 0:e.body),r=C(o);return e?(e=wi(r),t.concat(r,r.visualViewport||[],li(o)?o:[],e&&i?xi(e):[])):t.concat(o,xi(o,[],i))}function wi(e){return e.parent&&Object.getPrototypeOf(e.parent)?e.frameElement:null}function ki(e){var t=yi(e);let i=parseFloat(t.width)||0,o=parseFloat(t.height)||0;var t=ai(e),r=t?e.offsetWidth:i,t=t?e.offsetHeight:o,e=Et(i)!==r||Et(o)!==t;return e&&(i=r,o=t),{width:i,height:o,$:e}}function Ci(e){return ri(e)?e:e.contextElement}function $i(e){e=Ci(e);if(!ai(e))return Tt(1);var t=e.getBoundingClientRect(),{width:e,height:i,$:o}=ki(e);let r=(o?Et(t.width):t.width)/e,a=(o?Et(t.height):t.height)/i;return r&&Number.isFinite(r)||(r=1),a&&Number.isFinite(a)||(a=1),{x:r,y:a}}var Si=Tt(0);function Ei(e){e=C(e);return gi()&&e.visualViewport?{x:e.visualViewport.offsetLeft,y:e.visualViewport.offsetTop}:Si}function Ai(e,i,t,o){void 0===i&&(i=!1),void 0===t&&(t=!1);var r=e.getBoundingClientRect(),a=Ci(e);let n=Tt(1);i&&(o?ri(o)&&(n=$i(o)):n=$i(e));i=a,void 0===(e=t)&&(e=!1);t=!(t=o)||e&&t!==C(i)||!e?Tt(0):Ei(a);let s=(r.left+t.x)/n.x,l=(r.top+t.y)/n.y,c=r.width/n.x,d=r.height/n.y;if(a){var i=C(a),h=o&&ri(o)?C(o):o;let e=i,t=wi(e);for(;t&&o&&h!==e;){var p=$i(t),u=t.getBoundingClientRect(),b=yi(t),f=u.left+(t.clientLeft+parseFloat(b.paddingLeft))*p.x,u=u.top+(t.clientTop+parseFloat(b.paddingTop))*p.y;s*=p.x,l*=p.y,c*=p.x,d*=p.y,s+=f,l+=u,e=C(t),t=wi(e)}}return Xt({width:c,height:d,x:s,y:l})}function Ti(e,t){var i=zi(e).scrollLeft;return t?t.left+i:Ai(ii(e)).left+i}function Di(e,t,i){void 0===i&&(i=!1);var o=e.getBoundingClientRect();return{x:o.left+t.scrollLeft-(i?0:Ti(e,o)),y:o.top+t.scrollTop}}var Oi=new Set(["absolute","fixed"]);function Pi(e,t,i){let o;var r,a,n;return Xt(o="viewport"===t?((e,t)=>{var i=C(e),e=ii(e),i=i.visualViewport;let o=e.clientWidth,r=e.clientHeight,a=0,n=0;return i&&(o=i.width,r=i.height,gi()&&"fixed"!==t||(a=i.offsetLeft,n=i.offsetTop)),{width:o,height:r,x:a,y:n}})(e,i):"document"===t?(e=>{var t=ii(e),i=zi(e),o=e.ownerDocument.body,r=k(t.scrollWidth,t.clientWidth,o.scrollWidth,o.clientWidth),a=k(t.scrollHeight,t.clientHeight,o.scrollHeight,o.clientHeight);let n=-i.scrollLeft+Ti(e);return e=-i.scrollTop,"rtl"===yi(o).direction&&(n+=k(t.clientWidth,o.clientWidth)-r),{width:r,height:a,x:n,y:e}})(ii(e)):ri(t)?(a=(i=Ai(r=t,!0,"fixed"===(i=i))).top+r.clientTop,i=i.left+r.clientLeft,n=ai(r)?$i(r):Tt(1),{width:r.clientWidth*n.x,height:r.clientHeight*n.y,x:i*n.x,y:a*n.y}):(r=Ei(e),{x:t.x-r.x,y:t.y-r.y,width:t.width,height:t.height}))}function Fi(e,t){var i=t.get(e);if(i)return i;let o=xi(e,[],!1).filter(e=>ri(e)&&"body"!==ti(e)),r=null;var a="fixed"===yi(e).position;let n=a?_i(e):e;for(;ri(n)&&!vi(n);){var s=yi(n),l=fi(n),l=(l||"fixed"!==s.position||(r=null),a?!l&&!r:!l&&"static"===s.position&&!!r&&Oi.has(r.position)||li(n)&&!l&&function e(t,i){t=_i(t);return!(t===i||!ri(t)||vi(t))&&("fixed"===yi(t).position||e(t,i))}(e,n));l?o=o.filter(e=>e!==n):r=s,n=_i(n)}return t.set(e,o),o}function Li(e){return"static"===yi(e).position}function Mi(e,t){if(!ai(e)||"fixed"===yi(e).position)return null;if(t)return t(e);let i=e.offsetParent;return i=ii(e)===i?i.ownerDocument.body:i}function Ri(t,e){var i,o=C(t);if(hi(t))return o;if(!ai(t)){let e=_i(t);for(;e&&!vi(e);){if(ri(e)&&!Li(e))return e;e=_i(e)}return o}let r=Mi(t,e);for(;r&&(i=r,ci.has(ti(i)))&&Li(r);)r=Mi(r,e);return(!(r&&vi(r)&&Li(r))||fi(r))&&(r||(e=>{let t=_i(e);for(;ai(t)&&!vi(t);){if(fi(t))return t;if(hi(t))return null;t=_i(t)}return null})(t))||o}var Vi={convertOffsetParentRelativeRectToViewportRelativeRect:function(e){var{elements:e,rect:t,offsetParent:i,strategy:o}=e,o="fixed"===o,r=ii(i),e=!!e&&hi(e.floating);if(i===r||e&&o)return t;let a={scrollLeft:0,scrollTop:0},n=Tt(1);var e=Tt(0),s=ai(i),l=((s||!s&&!o)&&("body"===ti(i)&&!li(r)||(a=zi(i)),ai(i))&&(l=Ai(i),n=$i(i),e.x=l.x+i.clientLeft,e.y=l.y+i.clientTop),!r||s||o?Tt(0):Di(r,a,!0));return{width:t.width*n.x,height:t.height*n.y,x:t.x*n.x-a.scrollLeft*n.x+e.x+l.x,y:t.y*n.y-a.scrollTop*n.y+e.y+l.y}},getDocumentElement:ii,getClippingRect:function(e){let{element:i,boundary:t,rootBoundary:o,strategy:r}=e;var a=(e=[..."clippingAncestors"===t?hi(i)?[]:Fi(i,this._c):[].concat(t),o])[0];return{width:(e=e.reduce((e,t)=>{t=Pi(i,t,r);return e.top=k(t.top,e.top),e.right=St(t.right,e.right),e.bottom=St(t.bottom,e.bottom),e.left=k(t.left,e.left),e},Pi(i,a,r))).right-e.left,height:e.bottom-e.top,x:e.left,y:e.top}},getOffsetParent:Ri,getElementRects:async function(e){var t=this.getOffsetParent||Ri,i=await(0,this.getDimensions)(e.floating);return{reference:((e,t,i)=>{var o=ai(t);let r=ii(t),a=(e=Ai(e,!0,i="fixed"===i,t),{scrollLeft:0,scrollTop:0}),n=Tt(0);function s(){n.x=Ti(r)}!o&&i||("body"===ti(t)&&!li(r)||(a=zi(t)),o?(l=Ai(t,!0,i,t),n.x=l.x+t.clientLeft,n.y=l.y+t.clientTop):r&&s()),i&&!o&&r&&s();var l=!r||o||i?Tt(0):Di(r,a);return{x:e.left+a.scrollLeft-n.x-l.x,y:e.top+a.scrollTop-n.y-l.y,width:e.width,height:e.height}})(e.reference,await t(e.floating),e.strategy),floating:{x:0,y:0,width:i.width,height:i.height}}},getClientRects:function(e){return Array.from(e.getClientRects())},getDimensions:function(e){var{width:e,height:t}=ki(e);return{width:e,height:t}},getScale:$i,isElement:ri,isRTL:function(e){return"rtl"===yi(e).direction}};function Bi(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height}function Ii(d,t){let h=null,p,u=ii(d);function b(){var e;clearTimeout(p),null!=(e=h)&&e.disconnect(),h=null}return function i(o,r){void 0===o&&(o=!1),void 0===r&&(r=1),b();let a=d.getBoundingClientRect();var{left:e,top:n,width:s,height:l}=a;if(o||t(),s&&l){o={rootMargin:-At(n)+"px "+-At(u.clientWidth-(e+s))+"px "+-At(u.clientHeight-(n+l))+"px "+-At(e)+"px",threshold:k(0,St(1,r))||1};let t=!0;try{h=new IntersectionObserver(c,z(y({},o),{root:u.ownerDocument}))}catch(e){h=new IntersectionObserver(c,o)}function c(e){if((e=e[0].intersectionRatio)!==r){if(!t)return i();e?i(!1,e):p=setTimeout(()=>{i(!1,1e-7)},1e3)}1!==e||Bi(a,d.getBoundingClientRect())||i(),t=!1}h.observe(d)}}(!0),b}function Ui(i,t,o,e){void 0===e&&(e={});let{ancestorScroll:r=!0,ancestorResize:a=!0,elementResize:n="function"==typeof ResizeObserver,layoutShift:s="function"==typeof IntersectionObserver,animationFrame:l=!1}=e,c=Ci(i),d=r||a?[...c?xi(c):[],...xi(t)]:[],h=(d.forEach(e=>{r&&e.addEventListener("scroll",o,{passive:!0}),a&&e.addEventListener("resize",o)}),c&&s?Ii(c,o):null),p=-1,u=null;n&&(u=new ResizeObserver(e=>{var[e]=e;e&&e.target===c&&u&&(u.unobserve(t),cancelAnimationFrame(p),p=requestAnimationFrame(()=>{var e;null!=(e=u)&&e.observe(t)})),o()}),c&&!l&&u.observe(c),u.observe(t));let b,f=l?Ai(i):null;return l&&function e(){let t=Ai(i);f&&!Bi(f,t)&&o();f=t;b=requestAnimationFrame(e)}(),o(),()=>{var e;d.forEach(e=>{r&&e.removeEventListener("scroll",o),a&&e.removeEventListener("resize",o)}),null!=h&&h(),null!=(e=u)&&e.disconnect(),u=null,l&&cancelAnimationFrame(b)}}var Ni=function(n){return{name:"offset",options:n=void 0===n?0:n,async fn(e){var t,{x:i,y:o,placement:r,middlewareData:a}=e,e=await(async(e,t)=>{var{placement:i,platform:o,elements:r}=e,o=await(null==o.isRTL?void 0:o.isRTL(r.floating)),r=Lt(i),a=Mt(i),i="y"===It(i),r=Gt.has(r)?-1:1,o=o&&i?-1:1;let{mainAxis:n,crossAxis:s,alignmentAxis:l}="number"==typeof(t=Ft(t,e))?{mainAxis:t,crossAxis:0,alignmentAxis:null}:{mainAxis:t.mainAxis||0,crossAxis:t.crossAxis||0,alignmentAxis:t.alignmentAxis};return a&&"number"==typeof l&&(s="end"===a?-1*l:l),i?{x:s*o,y:n*r}:{x:n*r,y:s*o}})(e,n);return r===(null==(t=a.offset)?void 0:t.placement)&&null!=(t=a.arrow)&&t.alignmentOffset?{}:{x:i+e.x,y:o+e.y,data:z(y({},e),{placement:r})}}}},Hi=function(u){return{name:"shift",options:u=void 0===u?{}:u,async fn(e){var t,{x:i,y:o,placement:r}=e,a=Ft(u,e),{mainAxis:n=!0,crossAxis:s=!1,limiter:l={fn:e=>{var{x:e,y:t}=e;return{x:e,y:t}}}}=a,c={x:i,y:o},a=await Jt(e,Xe(a,["mainAxis","crossAxis","limiter"])),r=It(Lt(r)),d=Rt(r);let h=c[d],p=c[r];n&&(c=h+a["y"===d?"top":"left"],t=h-a["y"===d?"bottom":"right"],h=Pt(c,h,t)),s&&(c=p+a["y"===r?"top":"left"],t=p-a["y"===r?"bottom":"right"],p=Pt(c,p,t));a=l.fn(z(y({},e),{[d]:h,[r]:p}));return z(y({},a),{data:{x:a.x-i,y:a.y-o,enabled:{[d]:n,[r]:s}}})}}},qi=function(t){return{name:"flip",options:t=void 0===t?{}:t,async fn(o){var{placement:r,middlewareData:a,rects:e,initialPlacement:n,platform:s,elements:l}=o,c=Ft(t,o),{mainAxis:d=!0,crossAxis:h=!0,fallbackPlacements:p,fallbackStrategy:u="bestFit",fallbackAxisSideDirection:b="none",flipAlignment:f=!0}=c,c=Xe(c,["mainAxis","crossAxis","fallbackPlacements","fallbackStrategy","fallbackAxisSideDirection","flipAlignment"]);if(null==(g=a.arrow)||!g.alignmentOffset){var g=Lt(r);let t=It(n);var m=Lt(n)===n,s=await(null==s.isRTL?void 0:s.isRTL(l.floating)),l=p||(m||!f?[Yt(n)]:(m=Yt(l=n),[Nt(l),m,Nt(m)]));let i="none"!==b;!p&&i&&l.push(...Kt(n,f,b,s));var m=[n,...l],p=await Jt(o,c),f=[],v=(null==(b=a.flip)?void 0:b.overflows)||[];if(d&&f.push(p[g]),h&&(l=((e,t,i)=>{void 0===i&&(i=!1);var o=Mt(e),r=Vt(e=Ut(e));let a="x"===e?o===(i?"end":"start")?"right":"left":"start"===o?"bottom":"top";return[a=t.reference[r]>t.floating[r]?Yt(a):a,Yt(a)]})(r,e,s),f.push(p[l[0]],p[l[1]])),v=[...v,{placement:r,overflows:f}],!f.every(e=>e<=0)){c=((null==(o=a.flip)?void 0:o.index)||0)+1,b=m[c];if(b)if(!("alignment"===h&&t!==It(b))||v.every(e=>0<e.overflows[0]&&It(e.placement)===t))return{data:{index:c,overflows:v},reset:{placement:b}};let e=null==(d=v.filter(e=>e.overflows[0]<=0).sort((e,t)=>e.overflows[1]-t.overflows[1])[0])?void 0:d.placement;if(!e)switch(u){case"bestFit":var y=null==(y=v.filter(e=>!i||(e=It(e.placement))===t||"y"===e).map(e=>[e.placement,e.overflows.filter(e=>0<e).reduce((e,t)=>e+t,0)]).sort((e,t)=>e[1]-t[1])[0])?void 0:y[0];y&&(e=y);break;case"initialPlacement":e=n}if(r!==e)return{reset:{placement:e}}}}return{}}}},ji=function(v){return{name:"size",options:v=void 0===v?{}:v,async fn(e){var{placement:t,rects:i,platform:o,elements:r}=e,a=Ft(v,e),{apply:n=()=>{}}=a,a=await Jt(e,Xe(a,["apply"])),s=Lt(t),l=Mt(t),t="y"===It(t),{width:i,height:c}=i.floating;let d,h;"top"===s||"bottom"===s?(d=s,h=l===(await(null==o.isRTL?void 0:o.isRTL(r.floating))?"start":"end")?"left":"right"):(h=s,d="end"===l?"top":"bottom");var s=c-a.top-a.bottom,p=i-a.left-a.right,u=St(c-a[d],s),b=St(i-a[h],p),f=!e.middlewareData.shift;let g=u,m=b;null!=(u=e.middlewareData.shift)&&u.enabled.x&&(m=p),null!=(b=e.middlewareData.shift)&&b.enabled.y&&(g=s),f&&!l&&(u=k(a.left,0),p=k(a.right,0),b=k(a.top,0),s=k(a.bottom,0),t?m=i-2*(0!==u||0!==p?u+p:k(a.left,a.right)):g=c-2*(0!==b||0!==s?b+s:k(a.top,a.bottom))),await n(z(y({},e),{availableWidth:m,availableHeight:g}));f=await o.getDimensions(r.floating);return i!==f.width||c!==f.height?{reset:{rects:!0}}:{}}}},Wi=m=>({name:"arrow",options:m,async fn(e){var{x:t,y:i,placement:o,rects:r,platform:a,elements:n,middlewareData:s}=e,{element:e,padding:l=0}=Ft(m,e)||{};if(null==e)return{};var l=Zt(l),t={x:t,y:i},i=Ut(o),c=Vt(i),d=await a.getDimensions(e),h="y"===i,p=h?"top":"left",u=h?"bottom":"right",h=h?"clientHeight":"clientWidth",b=r.reference[c]+r.reference[i]-t[i]-r.floating[c],f=t[i]-r.reference[i],e=await(null==a.getOffsetParent?void 0:a.getOffsetParent(e));let g=e?e[h]:0;b=b/2-f/2,f=(g=g&&await(null==a.isElement?void 0:a.isElement(e))?g:n.floating[h]||r.floating[c])/2-d[c]/2-1,a=St(l[p],f),e=St(l[u],f),n=a,h=g-d[c]-e,p=g/2-d[c]/2+b,l=Pt(n,p,h),u=!s.arrow&&null!=Mt(o)&&p!==l&&r.reference[c]/2-(p<n?a:e)-d[c]/2<0,f=u?p<n?p-n:p-h:0;return{[i]:t[i]+f,data:y({[i]:l,centerOffset:p-l-f},u&&{alignmentOffset:f}),reset:u}}}),Ki=(e,t,i)=>{var o=new Map,i=y({platform:Vi},i),o=z(y({},i.platform),{_c:o});return(async(t,i,e)=>{var{placement:o="bottom",strategy:r="absolute",middleware:e=[],platform:a}=e,n=e.filter(Boolean),s=await(null==a.isRTL?void 0:a.isRTL(i));let l=await a.getElementRects({reference:t,floating:i,strategy:r}),{x:c,y:d}=Qt(l,o,s),h=o,p={},u=0;for(let e=0;e<n.length;e++){var{name:b,fn:f}=n[e],{x:f,y:g,data:m,reset:v}=await f({x:c,y:d,initialPlacement:o,placement:h,strategy:r,middlewareData:p,rects:l,platform:a,elements:{reference:t,floating:i}});c=null!=f?f:c,d=null!=g?g:d,p=z(y({},p),{[b]:y(y({},p[b]),m)}),v&&u<=50&&(u++,"object"==typeof v&&(v.placement&&(h=v.placement),v.rects&&(l=!0===v.rects?await a.getElementRects({reference:t,floating:i,strategy:r}):v.rects),{x:c,y:d}=Qt(l,h,s)),e=-1)}return{x:c,y:d,placement:h,strategy:r,middlewareData:p}})(e,t,z(y({},i),{platform:o}))};function Yi(t){for(let e=t;e;e=Zi(e))if(e instanceof Element&&"none"===getComputedStyle(e).display)return null;for(let e=Zi(t);e;e=Zi(e))if(e instanceof Element){var i=getComputedStyle(e);if("contents"!==i.display){if("static"!==i.position||fi(i))return e;if("BODY"===e.tagName)return e}}return null}function Zi(e){return e.assignedSlot||(e.parentNode instanceof ShadowRoot?e.parentNode.host:e.parentNode)}var $=class extends t{constructor(){super(...arguments),this.currentPlacement="",this.active=!1,this.placement="top",this.strategy="absolute",this.distance=0,this.skidding=0,this.arrow=!1,this.arrowPlacement="anchor",this.arrowPadding=12,this.flip=!1,this.flipFallbackPlacements="",this.flipFallbackStrategy="best-fit",this.flipPadding=0,this.shift=!1,this.shiftPadding=0,this.autoSizePadding=0,this.hoverBridge=!1,this.updateHoverBridge=()=>{if(this.hoverBridge&&this.anchorEl){var l=this.anchorEl.getBoundingClientRect(),c=this.popup.getBoundingClientRect(),d=this.currentPlacement||this.placement,d=d.includes("top")||d.includes("bottom");let e=0,t=0,i=0,o=0,r=0,a=0,n=0,s=0;s=d?(l.top<c.top?(e=l.left,t=l.bottom,i=l.right,o=l.bottom,r=c.left,a=c.top,n=c.right,c):(e=c.left,t=c.bottom,i=c.right,o=c.bottom,r=l.left,a=l.top,n=l.right,l)).top:(l.left<c.left?(e=l.right,t=l.top,i=c.left,o=c.top,r=l.right,a=l.bottom,n=c.left,c):(e=c.right,t=c.top,i=l.left,o=l.top,r=c.right,a=c.bottom,n=l.left,l)).bottom,this.style.setProperty("--hover-bridge-top-left-x",e+"px"),this.style.setProperty("--hover-bridge-top-left-y",t+"px"),this.style.setProperty("--hover-bridge-top-right-x",i+"px"),this.style.setProperty("--hover-bridge-top-right-y",o+"px"),this.style.setProperty("--hover-bridge-bottom-left-x",r+"px"),this.style.setProperty("--hover-bridge-bottom-left-y",a+"px"),this.style.setProperty("--hover-bridge-bottom-right-x",n+"px"),this.style.setProperty("--hover-bridge-bottom-right-y",s+"px")}}}async connectedCallback(){super.connectedCallback(),await this.updateComplete,this.start()}disconnectedCallback(){super.disconnectedCallback(),this.stop()}async updated(e){super.updated(e),e.has("active")&&(this.active?this.start():this.stop()),e.has("anchor")&&this.handleAnchorChange(),this.active&&(await this.updateComplete,this.reposition())}async handleAnchorChange(){var e;await this.stop(),this.anchor&&"string"==typeof this.anchor?(e=this.getRootNode(),this.anchorEl=e.getElementById(this.anchor)):this.anchor instanceof Element||null!==(e=this.anchor)&&"object"==typeof e&&"getBoundingClientRect"in e&&(!("contextElement"in e)||e.contextElement instanceof Element)?this.anchorEl=this.anchor:this.anchorEl=this.querySelector('[slot="anchor"]'),this.anchorEl instanceof HTMLSlotElement&&(this.anchorEl=this.anchorEl.assignedElements({flatten:!0})[0]),this.anchorEl&&this.active&&this.start()}start(){this.anchorEl&&this.active&&(this.cleanup=Ui(this.anchorEl,this.popup,()=>{this.reposition()}))}async stop(){return new Promise(e=>{this.cleanup?(this.cleanup(),this.cleanup=void 0,this.currentPlacement="",this.removeAttribute("data-current-placement"),this.popup.removeAttribute("data-current-placement"),this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height"),requestAnimationFrame(()=>e())):e()})}reposition(){var e,t;this.active&&this.anchorEl&&(e=[Ni({mainAxis:this.distance,crossAxis:this.skidding})],this.sync?e.push(ji({apply:({rects:e})=>{var t="width"===this.sync||"both"===this.sync,i="height"===this.sync||"both"===this.sync;this.popup.style.width=t?e.reference.width+"px":"",this.popup.style.height=i?e.reference.height+"px":""}})):(this.popup.style.width="",this.popup.style.height=""),this.flip&&e.push(qi({boundary:this.flipBoundary,fallbackPlacements:this.flipFallbackPlacements,fallbackStrategy:"best-fit"===this.flipFallbackStrategy?"bestFit":"initialPlacement",padding:this.flipPadding})),this.shift&&e.push(Hi({boundary:this.shiftBoundary,padding:this.shiftPadding})),this.autoSize?e.push(ji({boundary:this.autoSizeBoundary,padding:this.autoSizePadding,apply:({availableWidth:e,availableHeight:t})=>{"vertical"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-height",t+"px"):this.style.removeProperty("--auto-size-available-height"),"horizontal"===this.autoSize||"both"===this.autoSize?this.style.setProperty("--auto-size-available-width",e+"px"):this.style.removeProperty("--auto-size-available-width")}})):(this.style.removeProperty("--auto-size-available-width"),this.style.removeProperty("--auto-size-available-height")),this.arrow&&e.push(Wi({element:this.arrowEl,padding:this.arrowPadding})),t="absolute"===this.strategy?e=>Vi.getOffsetParent(e,Yi):Vi.getOffsetParent,Ki(this.anchorEl,this.popup,{placement:this.placement,middleware:e,strategy:this.strategy,platform:z(y({},Vi),{getOffsetParent:t})}).then(({x:r,y:a,middlewareData:n,placement:s})=>{var l={top:"bottom",right:"left",bottom:"top",left:"right"}[s.split("-")[0]];if(this.currentPlacement=s,this.setAttribute("data-current-placement",s),this.popup.setAttribute("data-current-placement",s),Object.assign(this.popup.style,{left:r+"px",top:a+"px"}),this.arrow){s=n.arrow.x,r=n.arrow.y;let e="",t="",i="",o="";"start"===this.arrowPlacement?(a="number"==typeof s?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",e="number"==typeof r?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",o=a):"end"===this.arrowPlacement?(n="number"==typeof s?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:"",t=n,i="number"==typeof r?`calc(${this.arrowPadding}px - var(--arrow-padding-offset))`:""):e="center"===this.arrowPlacement?(o="number"==typeof s?"calc(50% - var(--arrow-size-diagonal))":"","number"==typeof r?"calc(50% - var(--arrow-size-diagonal))":""):(o="number"==typeof s?s+"px":"","number"==typeof r?r+"px":""),Object.assign(this.arrowEl.style,{top:e,right:t,bottom:i,left:o,[l]:["left","right"].includes(l)?"calc(var(--arrow-size-diagonal-horizontal) * -1)":"calc(var(--arrow-size-diagonal) * -1)"})}}),requestAnimationFrame(()=>this.updateHoverBridge()),this.emit("bzl-reposition"))}render(){return h`
      <slot name="anchor" @slotchange=${this.handleAnchorChange}></slot>

      <span
        part="hover-bridge"
        class=${v({"popup-hover-bridge":!0,"popup-hover-bridge--visible":this.hoverBridge&&this.active})}
      ></span>

      <div
        part="popup"
        class=${v({popup:!0,"popup--active":this.active,"popup--fixed":"fixed"===this.strategy,"popup--has-arrow":this.arrow})}
        data-placement=${this.placement}
      >
        <slot></slot>
        ${this.arrow?h`<svg
              part="arrow"
              class="popup__arrow"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              width="20"
              height="8"
              viewBox="0 0 20 8"
            >
              <g opacity="1">
                <path
                  d="M20 8L0 8C1.90646 8 3.72011 7.17702 4.97551 5.74227L8.49485 1.72018C9.29167 0.809521 10.7083 0.809521 11.5052 1.72018L15.0245 5.74227C16.2799 7.17702 18.0935 8 20 8Z"
                  fill-rule="nonzero"
                  transform="matrix(-1 0 0 -1 20 8)"
                  fill="var(--arrow-color)"
                />
              </g>
            </svg> `:""}
      </div>
    `}};function Xi(o,r){return new Promise(i=>{o.addEventListener(r,function e(t){t.target===o&&(o.removeEventListener(r,e),i())})})}function S(i,o,r){return new Promise(e=>{if((null==r?void 0:r.duration)===1/0)throw new Error("Promise-based animations must be finite.");var t=i.animate(o,z(y({},r),{duration:window.matchMedia("(prefers-reduced-motion: reduce)").matches?0:r.duration}));t.addEventListener("cancel",e,{once:!0}),t.addEventListener("finish",e,{once:!0})})}function Qi(e){return!(-1<(e=e.toString().toLowerCase()).indexOf("ms"))&&-1<e.indexOf("s")?1e3*parseFloat(e):parseFloat(e)}function E(e){return Promise.all(e.getAnimations().map(t=>new Promise(e=>{t.cancel(),requestAnimationFrame(e)})))}$.styles=[u,a],d([g(".popup")],$.prototype,"popup",2),d([g(".popup__arrow")],$.prototype,"arrowEl",2),d([b()],$.prototype,"anchor",2),d([b({type:Boolean,reflect:!0})],$.prototype,"active",2),d([b({reflect:!0})],$.prototype,"placement",2),d([b({reflect:!0})],$.prototype,"strategy",2),d([b({type:Number})],$.prototype,"distance",2),d([b({type:Number})],$.prototype,"skidding",2),d([b({type:Boolean})],$.prototype,"arrow",2),d([b({attribute:"arrow-placement"})],$.prototype,"arrowPlacement",2),d([b({attribute:"arrow-padding",type:Number})],$.prototype,"arrowPadding",2),d([b({type:Boolean})],$.prototype,"flip",2),d([b({attribute:"flip-fallback-placements",converter:{fromAttribute:e=>e.split(" ").map(e=>e.trim()).filter(e=>""!==e),toAttribute:e=>e.join(" ")}})],$.prototype,"flipFallbackPlacements",2),d([b({attribute:"flip-fallback-strategy"})],$.prototype,"flipFallbackStrategy",2),d([b({type:Object})],$.prototype,"flipBoundary",2),d([b({attribute:"flip-padding",type:Number})],$.prototype,"flipPadding",2),d([b({type:Boolean})],$.prototype,"shift",2),d([b({type:Object})],$.prototype,"shiftBoundary",2),d([b({attribute:"shift-padding",type:Number})],$.prototype,"shiftPadding",2),d([b({attribute:"auto-size"})],$.prototype,"autoSize",2),d([b()],$.prototype,"sync",2),d([b({type:Object})],$.prototype,"autoSizeBoundary",2),d([b({attribute:"auto-size-padding",type:Number})],$.prototype,"autoSizePadding",2),d([b({attribute:"hover-bridge",type:Boolean})],$.prototype,"hoverBridge",2);var Ji=new Map,Gi=new WeakMap;function eo(e){return null!=e?e:{keyframes:[],options:{duration:0}}}function to(e,t){return"rtl"===t.toLowerCase()?{keyframes:e.rtlKeyframes||e.keyframes,options:e.options}:e}function A(e,t){Ji.set(e,eo(t))}function T(e,t,i){var e=Gi.get(e);return null!=e&&e[t]?to(e[t],i.dir):(e=Ji.get(t))?to(e,i.dir):{keyframes:[],options:{duration:0}}}var a=class extends t{constructor(){super(),this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="hover focus",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.hide()},this.handleClick=()=>{this.hasTrigger("click")&&(this.open?this.hide():this.show())},this.handleFocus=()=>{this.hasTrigger("focus")&&this.show()},this.handleDocumentKeyDown=e=>{"Escape"===e.key&&(e.stopPropagation(),this.hide())},this.handleMouseOver=()=>{var e;this.hasTrigger("hover")&&(e=Qi(getComputedStyle(this).getPropertyValue("--show-delay")),clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e))},this.handleMouseOut=()=>{var e;this.hasTrigger("hover")&&(e=Qi(getComputedStyle(this).getPropertyValue("--hide-delay")),clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e))},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}get computedDistance(){var e=getComputedStyle(this).getPropertyValue("--bzl-tooltip-arrow-size");return e&&"0px"!==e&&"0"!==e?this.distance+8:this.distance}disconnectedCallback(){var e;super.disconnectedCallback(),null!=(e=this.closeWatcher)&&e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition())}hasTrigger(e){return this.trigger.split(" ").includes(e)}async handleOpenChange(){var e,t;this.open?this.disabled||(this.emit("bzl-show"),"CloseWatcher"in window?(null!=(t=this.closeWatcher)&&t.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()}):document.addEventListener("keydown",this.handleDocumentKeyDown),await E(this.body),this.body.hidden=!1,this.popup.active=!0,{keyframes:t,options:e}=T(this,"tooltip.show",{dir:"ltr"}),await S(this.popup.popup,t,e),this.popup.reposition(),this.emit("bzl-after-show")):(this.emit("bzl-hide"),null!=(t=this.closeWatcher)&&t.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown),await E(this.body),{keyframes:e,options:t}=T(this,"tooltip.hide",{dir:"ltr"}),await S(this.popup.popup,e,t),this.popup.active=!1,this.body.hidden=!0,this.emit("bzl-after-hide"))}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Xi(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Xi(this,"bzl-after-hide")}render(){return h`
      <bzl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${v({tooltip:!0,"tooltip--open":this.open})}
        placement=${this.placement}
        arrow-placement=${this.placement.includes("start")?"start":this.placement.includes("end")?"end":void 0}
        distance=${this.computedDistance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-describedby="tooltip"></slot>

        ${""}
        <div part="body" id="tooltip" class="tooltip__body" role="tooltip" aria-live=${this.open?"polite":"off"}>
          <slot name="content">${this.content}</slot>
        </div>
      </bzl-popup>
    `}},io=(a.styles=[u,_],a.dependencies={"bzl-popup":$},d([g("slot:not([name])")],a.prototype,"defaultSlot",2),d([g(".tooltip__body")],a.prototype,"body",2),d([g("bzl-popup")],a.prototype,"popup",2),d([b()],a.prototype,"content",2),d([b()],a.prototype,"placement",2),d([b({type:Boolean,reflect:!0})],a.prototype,"disabled",2),d([b({type:Number})],a.prototype,"distance",2),d([b({type:Boolean,reflect:!0})],a.prototype,"open",2),d([b({type:Number})],a.prototype,"skidding",2),d([b()],a.prototype,"trigger",2),d([b({type:Boolean})],a.prototype,"hoist",2),d([p("open",{waitUntilFirstUpdate:!0})],a.prototype,"handleOpenChange",1),d([p(["content","distance","hoist","placement","skidding"])],a.prototype,"handleOptionsChange",1),d([p("disabled")],a.prototype,"handleDisabledChange",1),A("tooltip.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:150,easing:"ease"}}),A("tooltip.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:150,easing:"ease"}}),a),_=(a.define("bzl-tooltip"),o`
  :host {
    display: block;
  }

  .textarea {
    display: grid;
    align-items: center;
    position: relative;
    width: 100%;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    line-height: var(--bzl-line-height-dense);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    cursor: text;
  }

  /* Standard textareas */
  .textarea--standard {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-medium);
  }

  .textarea--standard:hover:not(.textarea--disabled) {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }
  .textarea--standard:hover:not(.textarea--disabled) .textarea__control {
    color: var(--bzl-input-color-hover);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    color: var(--bzl-input-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .textarea--standard.textarea--focused:not(.textarea--disabled) .textarea__control {
    color: var(--bzl-input-color-focus);
  }

  .textarea--standard.textarea--disabled {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    cursor: not-allowed;
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .textarea--standard {
    border-color: var(--bzl-color-danger-600);
  }

  :host([data-user-invalid]) .textarea--standard.textarea--focused:not(.textarea--disabled) {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }

  .textarea__control,
  .textarea__size-adjuster {
    grid-area: 1 / 1 / 2 / 2;
  }

  /* Inline word counter inside the textarea */
  .textarea__count {
    grid-area: 1 / 1 / 2 / 2;
    justify-self: end;
    align-self: end;
    margin-right: var(--bzl-input-spacing-medium);
    margin-bottom: var(--bzl-spacing-1);
    color: var(--bzl-input-placeholder-color);
    font-variant-numeric: tabular-nums;
    pointer-events: none;
    font-size: var(--bzl-font-size-2x-small);
  }

  .textarea__size-adjuster {
    visibility: hidden;
    pointer-events: none;
    opacity: 0;
  }

  .textarea--standard.textarea--disabled .textarea__control {
    color: var(--bzl-input-color-disabled);
  }

  .textarea--standard.textarea--disabled .textarea__control::placeholder {
    color: var(--bzl-input-placeholder-color-disabled);
  }

  .textarea__control {
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    line-height: var(--bzl-line-height-dense);
    color: var(--bzl-input-color);
    border: none;
    background: none;
    box-shadow: none;
    cursor: inherit;
    -webkit-appearance: none;
    padding: var(--bzl-input-padding-updown) var(--bzl-input-padding-leftright);
  }

  .textarea__control::-webkit-search-decoration,
  .textarea__control::-webkit-search-cancel-button,
  .textarea__control::-webkit-search-results-button,
  .textarea__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .textarea__control::placeholder {
    color: var(--bzl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .textarea__control:focus {
    outline: none;
  }

  /*
   * Resize types
   */

  .textarea--resize-none .textarea__control {
    resize: none;
  }

  .textarea--resize-vertical .textarea__control {
    resize: vertical;
  }

  .textarea--resize-auto .textarea__control {
    height: auto;
    resize: none;
    overflow-y: hidden;
  }
`),oo=(l="value")=>(e,a)=>{let n=e.constructor,s=n.prototype.attributeChangedCallback;n.prototype.attributeChangedCallback=function(e,t,i){var o,r=n.getPropertyOptions(l);e===("string"==typeof r.attribute?r.attribute:l)&&(o=("function"==typeof(o=r.converter||Se)?o:null!=(o=null==o?void 0:o.fromAttribute)?o:Se.fromAttribute)(i,r.type),this[l]!==o)&&(this[a]=o),s.call(this,e,t,i)}},ro=De(class extends r{constructor(e){if(super(e),e.type!==ct&&e.type!==st&&e.type!==dt)throw Error("The `live` directive is not allowed on child or event bindings");if(void 0!==e.strings)throw Error("`live` bindings can only contain a single expression")}render(e){return e}update(e,[t]){if(t!==c&&t!==l){var i=e.element,o=e.name;if(e.type===ct){if(t===i[o])return c}else if(e.type===dt){if(!!t===i.hasAttribute(o))return c}else if(e.type===st&&i.getAttribute(o)===t+"")return c;e._$AH=Te}return t}}),D=e=>null!=e?e:l,O=class extends t{constructor(){super(...arguments),this.hasFocus=!1,this.title="",this.name="",this.value="",this.showWordLimit=!1,this.placeholder="",this.rows=3,this.resize="vertical",this.disabled=!1,this.readonly=!1,this.autocomplete="off",this.defaultValue=""}connectedCallback(){super.connectedCallback(),this.resizeObserver=new ResizeObserver(()=>this.setTextareaHeight()),this.updateComplete.then(()=>{this.setTextareaHeight(!0),this.resizeObserver.observe(this.input)})}disconnectedCallback(){var e;super.disconnectedCallback(),this.input&&null!=(e=this.resizeObserver)&&e.unobserve(this.input)}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleChange(){this.value=this.input.value,this.setTextareaHeight(),this.emit("bzl-change")}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleInput(){this.value=this.input.value,this.emit("bzl-input")}handleInvalid(){}setTextareaHeight(e){"auto"===this.resize?(this.sizeAdjuster.style.height=this.input.clientHeight+"px",this.input.style.height="auto",this.input.style.height=this.input.scrollHeight+"px"):e&&(this.input.style.height="")}handleDisabledChange(){}handleRowsChange(){this.setTextareaHeight(!0)}async handleValueChange(){await this.updateComplete,this.setTextareaHeight()}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}render(){return h`
      <div
        part="base"
        class=${v({textarea:!0,"textarea--standard":!0,"textarea--disabled":this.disabled,"textarea--focused":this.hasFocus,"textarea--empty":!this.value,"textarea--resize-none":"none"===this.resize,"textarea--resize-vertical":"vertical"===this.resize,"textarea--resize-auto":"auto"===this.resize})}
      >
        <textarea
          part="textarea"
          id="input"
          class="textarea__control"
          title=${this.title}
          name=${D(this.name)}
          .value=${ro(this.value)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          placeholder=${D(this.placeholder)}
          rows=${D(this.rows)}
          minlength=${D(this.minlength)}
          maxlength=${D(this.maxlength)}
          ?autofocus=${this.autofocus}
          @change=${this.handleChange}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        ></textarea>
        <div part="textarea-adjuster" class="textarea__size-adjuster" ?hidden=${"auto"!==this.resize}></div>

        ${this.showWordLimit?h`
              <span class="textarea__count" aria-hidden="true">
                ${""+("string"==typeof this.value?this.value.length:0)+(this.maxlength?"/"+this.maxlength:"")}
              </span>
            `:""}
      </div>
    `}},ao=(O.styles=[u,_],d([g(".textarea__control")],O.prototype,"input",2),d([g(".textarea__size-adjuster")],O.prototype,"sizeAdjuster",2),d([f()],O.prototype,"hasFocus",2),d([b()],O.prototype,"title",2),d([b()],O.prototype,"name",2),d([b()],O.prototype,"value",2),d([b({type:Boolean,attribute:"show-word-limit"})],O.prototype,"showWordLimit",2),d([b()],O.prototype,"placeholder",2),d([b({type:Number})],O.prototype,"rows",2),d([b()],O.prototype,"resize",2),d([b({type:Boolean,reflect:!0})],O.prototype,"disabled",2),d([b({type:Boolean,reflect:!0})],O.prototype,"readonly",2),d([b({type:Number})],O.prototype,"minlength",2),d([b({type:Number})],O.prototype,"maxlength",2),d([b()],O.prototype,"autocomplete",2),d([b({type:Boolean})],O.prototype,"autofocus",2),d([oo()],O.prototype,"defaultValue",2),d([p("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1),d([p("rows",{waitUntilFirstUpdate:!0})],O.prototype,"handleRowsChange",1),d([p("value",{waitUntilFirstUpdate:!0})],O.prototype,"handleValueChange",1),O),_=(O.define("bzl-textarea"),o`
  :host {
    display: inline-block;
    --combobox-width: 200px;
  }

  :host([type='time-range']) {
    width: var(--combobox-width);
  }

  .time-picker {
    display: inline-flex;
    position: relative;
    vertical-align: middle;
  }

  .time-picker::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .time-picker.time-picker--range.time-picker--open::part(popup) {
    transition: var(--bzl-transition-fast) left;
  }

  .time-picker[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .time-picker[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .time-picker__combobox {
    position: relative;
    display: flex;
    width: var(--combobox-width);
    align-items: center;
    border-radius: var(--bzl-input-border-radius);
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
    padding-inline: var(--bzl-input-spacing-medium);
    min-height: var(--bzl-input-height-medium);
    padding-block: 0;
    box-sizing: border-box;
    cursor: pointer;
    transition:
      var(--bzl-transition-fast) border-color,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
  }

  .time-picker:not(.time-picker--disabled):hover .time-picker__combobox {
    border-color: var(--bzl-input-border-color-hover);
  }

  .time-picker.time-picker--focused .time-picker__combobox,
  .time-picker.time-picker--open .time-picker__combobox {
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: var(--bzl-shadow-focus);
    background-color: var(--bzl-input-background-color-focus);
  }

  .time-picker.time-picker--disabled .time-picker__combobox {
    cursor: not-allowed;
    border-color: var(--bzl-input-border-color-disabled);
    background-color: var(--bzl-input-background-color-disabled);
    opacity: 0.5;
  }

  .time-picker.time-picker--readonly .time-picker__combobox {
    cursor: default;
  }

  /* 验证失败样式（与 bzl-select 等一致，由 bzl-form-item 设置 data-user-invalid） */
  :host([data-user-invalid]) .time-picker .time-picker__combobox {
    border-color: var(--bzl-color-danger-600);
  }
  :host([data-user-invalid]) .time-picker.time-picker--focused:not(.time-picker--disabled) .time-picker__combobox,
  :host([data-user-invalid]) .time-picker.time-picker--open:not(.time-picker--disabled) .time-picker__combobox {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }
  :host([data-user-invalid]) .time-picker:not(.time-picker--disabled):hover .time-picker__time-icon {
    color: var(--bzl-color-danger-600);
  }

  :host([data-user-invalid]) .time-picker.time-picker--open:not(.time-picker--disabled) .time-picker__time-icon {
    color: var(--bzl-color-danger-600);
  }

  .time-picker__display-input {
    width: 100%;
    border: none;
    background: none;
    color: var(--bzl-input-color);
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-input-font-size-small);
    line-height: var(--bzl-line-height-2x-loose);
    cursor: inherit;
    padding: 0;
    margin: 0;
  }

  .time-picker__display-input:focus {
    outline: none;
  }

  .time-picker__display-input::placeholder {
    color: var(--bzl-input-placeholder-color);
  }

  .time-picker__range-display {
    position: relative;
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    flex: 1;
    min-width: 0;
    gap: var(--bzl-spacing-4);
    padding-block-end: var(--bzl-spacing-1);
  }

  .time-picker__range-field {
    border: none;
    background: none;
    color: var(--bzl-input-color);
    cursor: text;
    padding: 0;
    margin: 0;
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-input-font-size-small);
    line-height: var(--bzl-line-height-2x-loose);
    text-align: left;
    flex: 1 1 0;
    min-width: 0;
  }

  .time-picker__range-field:focus-visible {
    outline: none;
  }

  .time-picker__range-field::placeholder {
    color: var(--bzl-input-placeholder-color);
  }

  .time-picker--readonly .time-picker__range-field {
    cursor: default;
  }

  .time-picker__range-field--placeholder {
    color: var(--bzl-input-placeholder-color);
  }

  .time-picker__range-separator {
    color: var(--bzl-color-neutral-700);
  }

  .time-picker__range-indicator {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 60px;
    height: 2px;
    background-color: var(--bzl-color-boss-700);
    transition: var(--bzl-transition-fast) transform;
    pointer-events: none;
  }

  .time-picker__clear {
    border: none;
    background: none;
    color: var(--bzl-input-icon-color);
    cursor: pointer;
    padding: 0;
    margin: 0;
    align-items: center;
    justify-content: center;
    margin-inline-start: var(--bzl-spacing-5);
    display: none;
    pointer-events: none;
    transition: var(--bzl-transition-fast) color;
  }

  .time-picker__combobox:hover .time-picker__clear {
    display: inline-flex;
    pointer-events: auto;
  }

  .time-picker__clear:hover {
    color: var(--bzl-color-gray-800);
  }

  .time-picker__combobox:hover .time-picker__clear ~ .time-picker__time-icon {
    display: none;
  }

  .time-picker__time-icon {
    display: flex;
    align-items: center;
    color: var(--bzl-color-neutral-600);
    margin-inline-start: var(--bzl-spacing-5);
  }

  .time-picker__panel {
    box-sizing: border-box;
    width: fit-content;
    background: var(--bzl-panel-background-color);
    border: solid var(--bzl-panel-border-width) var(--bzl-color-neutral-300);
    border-radius: var(--bzl-border-radius-regular);
    box-shadow: var(--bzl-shadow-neutral-light);
    display: flex;
    flex-direction: column;
  }

  .time-picker__columns {
    display: grid;
    grid-template-columns: repeat(2, 60px);
    gap: 0;
    width: fit-content;
  }

  .time-picker__columns--with-second {
    grid-template-columns: repeat(3, 60px);
  }

  .time-picker__column {
    box-sizing: border-box;
    width: 60px;
    padding: var(--bzl-spacing-2);
    max-height: 180px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--bzl-spacing-1);
  }

  .time-picker__column + .time-picker__column {
    border-inline-start: solid 1px var(--bzl-color-gray-300);
  }

  .time-picker__column:focus {
    outline: none;
  }

  .time-picker__column:focus-visible {
    outline: solid 2px var(--bzl-color-primary-700);
    outline-offset: 2px;
    border-radius: var(--bzl-border-radius-small);
  }

  .time-picker__option {
    border: none;
    border-radius: var(--bzl-border-radius-small);
    background: none;
    color: var(--bzl-color-neutral-700);
    line-height: var(--bzl-input-height-small);
    padding-block: 0;
    padding-inline: var(--bzl-spacing-2);
    cursor: pointer;
    text-align: center;
  }

  .time-picker__option:hover {
    background: var(--bzl-color-neutral-100);
  }

  .time-picker__option--selected {
    background: var(--bzl-color-neutral-100);
    color: var(--bzl-color-primary-700);
  }

  .time-picker__option:disabled,
  .time-picker__option--disabled {
    color: var(--bzl-color-neutral-400);
    cursor: not-allowed;
  }

  .time-picker__option:disabled:hover,
  .time-picker__option--disabled:hover {
    background: none;
  }

  .time-picker__value-input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
    width: 0;
    height: 0;
  }
`),O=n({"node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/dayjs.min.js"(e,t){var i;i=function(){function o(e,t,i){var o=String(e);return!o||o.length>=t?e:""+Array(t+1-o.length).join(i)+e}function i(e){return e instanceof w||!(!e||!e[_])}function a(e,t,i){var o;if(!e)return l;if("string"==typeof e){var r=e.toLowerCase(),t=(z[r]&&(o=r),t&&(z[r]=t,o=r),e.split("-"));if(!o&&1<t.length)return a(t[0])}else{r=e.name;z[r]=e,o=r}return!i&&o&&(l=o),o||!i&&l}function c(e,t){return i(e)?e.clone():((t="object"==typeof t?t:{}).date=e,t.args=arguments,new w(t))}var r="millisecond",h="second",p="minute",u="hour",b="day",f="week",g="month",d="quarter",m="year",v="date",t="Invalid Date",n=/^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/,y=/\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g,e={name:"en",weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),ordinal:function(e){var t=["th","st","nd","rd"],i=e%100;return"["+e+(t[(i-20)%10]||t[i]||t[0])+"]"}},s={s:o,z:function(e){var e=-e.utcOffset(),t=Math.abs(e),i=Math.floor(t/60),t=t%60;return(e<=0?"+":"-")+o(i,2,"0")+":"+o(t,2,"0")},m:function e(t,i){var o,r,a;return t.date()<i.date()?-e(i,t):(o=12*(i.year()-t.year())+(i.month()-t.month()),a=i-(r=t.clone().add(o,g))<0,t=t.clone().add(o+(a?-1:1),g),+(-(o+(i-r)/(a?r-t:t-r))||0))},a:function(e){return e<0?Math.ceil(e)||0:Math.floor(e)},p:function(e){return{M:g,y:m,w:f,d:b,D:v,h:u,m:p,s:h,ms:r,Q:d}[e]||String(e||"").toLowerCase().replace(/s$/,"")},u:function(e){return void 0===e}},l="en",z={},_=(z[l]=e,"$isDayjsObject"),x=s,w=(x.l=a,x.i=i,x.w=function(e,t){return c(e,{locale:t.$L,utc:t.$u,x:t.$x,$offset:t.$offset})},(e=C.prototype).parse=function(a){this.$d=(()=>{var e=a.date,t=a.utc;if(null===e)return new Date(NaN);if(x.u(e))return new Date;if(!(e instanceof Date||"string"!=typeof e||/Z$/i.test(e))){var i,o,r=e.match(n);if(r)return i=r[2]-1||0,o=(r[7]||"0").substring(0,3),t?new Date(Date.UTC(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,o)):new Date(r[1],i,r[3]||1,r[4]||0,r[5]||0,r[6]||0,o)}return new Date(e)})(),this.init()},e.init=function(){var e=this.$d;this.$y=e.getFullYear(),this.$M=e.getMonth(),this.$D=e.getDate(),this.$W=e.getDay(),this.$H=e.getHours(),this.$m=e.getMinutes(),this.$s=e.getSeconds(),this.$ms=e.getMilliseconds()},e.$utils=function(){return x},e.isValid=function(){return!(this.$d.toString()===t)},e.isSame=function(e,t){e=c(e);return this.startOf(t)<=e&&e<=this.endOf(t)},e.isAfter=function(e,t){return c(e)<this.startOf(t)},e.isBefore=function(e,t){return this.endOf(t)<c(e)},e.$g=function(e,t,i){return x.u(e)?this[t]:this.set(i,e)},e.unix=function(){return Math.floor(this.valueOf()/1e3)},e.valueOf=function(){return this.$d.getTime()},e.startOf=function(e,t){function i(e,t){return t=x.w(r.$u?Date.UTC(r.$y,t,e):new Date(r.$y,t,e),r),a?t:t.endOf(b)}function o(e,t){return x.w(r.toDate()[e].apply(r.toDate("s"),(a?[0,0,0,0]:[23,59,59,999]).slice(t)),r)}var r=this,a=!!x.u(t)||t,t=x.p(e),n=this.$W,s=this.$M,l=this.$D,c="set"+(this.$u?"UTC":"");switch(t){case m:return a?i(1,0):i(31,11);case g:return a?i(1,s):i(0,s+1);case f:var d=this.$locale().weekStart||0,d=(n<d?n+7:n)-d;return i(a?l-d:l+(6-d),s);case b:case v:return o(c+"Hours",0);case u:return o(c+"Minutes",1);case p:return o(c+"Seconds",2);case h:return o(c+"Milliseconds",3);default:return this.clone()}},e.endOf=function(e){return this.startOf(e,!1)},e.$set=function(e,t){var e=x.p(e),i="set"+(this.$u?"UTC":""),i=((o={}).day=i+"Date",o[v]=i+"Date",o[g]=i+"Month",o[m]=i+"FullYear",o[u]=i+"Hours",o[p]=i+"Minutes",o[h]=i+"Seconds",o[r]=i+"Milliseconds",o[e]),o=e===b?this.$D+(t-this.$W):t;return e===g||e===m?((t=this.clone().set(v,1)).$d[i](o),t.init(),this.$d=t.set(v,Math.min(this.$D,t.daysInMonth())).$d):i&&this.$d[i](o),this.init(),this},e.set=function(e,t){return this.clone().$set(e,t)},e.get=function(e){return this[x.p(e)]()},e.add=function(i,e){function t(e){var t=c(o);return x.w(t.date(t.date()+Math.round(e*i)),o)}var o=this,e=(i=Number(i),x.p(e));return e===g?this.set(g,this.$M+i):e===m?this.set(m,this.$y+i):e===b?t(1):e===f?t(7):(e={minute:6e4,hour:36e5,second:1e3}[e]||1,e=this.$d.getTime()+i*e,x.w(e,this))},e.subtract=function(e,t){return this.add(-1*e,t)},e.format=function(e){var r,i,o,a,n,s,l,c,d,h,p=this,u=this.$locale();return this.isValid()?(r=e||"YYYY-MM-DDTHH:mm:ssZ",i=x.z(this),o=this.$H,a=this.$m,n=this.$M,s=u.weekdays,l=u.months,e=u.meridiem,c=function(e,t,i,o){return e&&(e[t]||e(p,r))||i[t].slice(0,o)},d=function(e){return x.s(o%12||12,e,"0")},h=e||function(e,t,i){e=e<12?"AM":"PM";return i?e.toLowerCase():e},r.replace(y,function(e,t){return t||(()=>{switch(e){case"YY":return String(p.$y).slice(-2);case"YYYY":return x.s(p.$y,4,"0");case"M":return n+1;case"MM":return x.s(n+1,2,"0");case"MMM":return c(u.monthsShort,n,l,3);case"MMMM":return c(l,n);case"D":return p.$D;case"DD":return x.s(p.$D,2,"0");case"d":return String(p.$W);case"dd":return c(u.weekdaysMin,p.$W,s,2);case"ddd":return c(u.weekdaysShort,p.$W,s,3);case"dddd":return s[p.$W];case"H":return String(o);case"HH":return x.s(o,2,"0");case"h":return d(1);case"hh":return d(2);case"a":return h(o,a,!0);case"A":return h(o,a,!1);case"m":return String(a);case"mm":return x.s(a,2,"0");case"s":return String(p.$s);case"ss":return x.s(p.$s,2,"0");case"SSS":return x.s(p.$ms,3,"0");case"Z":return i}return null})()||i.replace(":","")})):u.invalidDate||t},e.utcOffset=function(){return 15*-Math.round(this.$d.getTimezoneOffset()/15)},e.diff=function(e,t,i){function o(){return x.m(a,n)}var r,a=this,t=x.p(t),n=c(e),s=6e4*(n.utcOffset()-this.utcOffset()),l=this-n;switch(t){case m:r=o()/12;break;case g:r=o();break;case d:r=o()/3;break;case f:r=(l-s)/6048e5;break;case b:r=(l-s)/864e5;break;case u:r=l/36e5;break;case p:r=l/6e4;break;case h:r=l/1e3;break;default:r=l}return i?r:x.a(r)},e.daysInMonth=function(){return this.endOf(g).$D},e.$locale=function(){return z[this.$L]},e.locale=function(e,t){var i;return e?(i=this.clone(),(e=a(e,t,!0))&&(i.$L=e),i):this.$L},e.clone=function(){return x.w(this.$d,this)},e.toDate=function(){return new Date(this.valueOf())},e.toJSON=function(){return this.isValid()?this.toISOString():null},e.toISOString=function(){return this.$d.toISOString()},e.toString=function(){return this.$d.toUTCString()},C),k=w.prototype;function C(e){this.$L=a(e.locale,null,!0),this.parse(e),this.$x=this.$x||e.x||{},this[_]=!0}return c.prototype=k,[["$ms",r],["$s",h],["$m",p],["$H",u],["$W",b],["$M",g],["$y",m],["$D",v]].forEach(function(t){k[t[1]]=function(e){return this.$g(e,t[0],t[1])}}),c.extend=function(e,t){return e.$i||(e(t,w,c),e.$i=!0),c},c.locale=a,c.isDayjs=i,c.unix=function(e){return c(1e3*e)},c.en=z[l],c.Ls=z,c.p={},c},"object"==typeof(e=e)&&void 0!==t?t.exports=i():"function"==typeof define&&define.amd?define(i):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs=i()}}),n=s(n({"node_modules/.pnpm/dayjs@1.11.13/node_modules/dayjs/plugin/customParseFormat.js"(e,t){var i;i=function(){function e(t){return function(e){this[t]=+e}}function i(e){return(e=b[e])&&(e.indexOf?e:e.s.concat(e.f))}function t(e,t){var i,o=b.meridiem;if(o){for(var r=1;r<=24;r+=1)if(-1<e.indexOf(o(r,0,t))){i=12<r;break}}else i=e===(t?"pm":"PM");return i}var s={LTS:"h:mm:ss A",LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D, YYYY",LLL:"MMMM D, YYYY h:mm A",LLLL:"dddd, MMMM D, YYYY h:mm A"},l=/(\[[^[]*\])|([-_:/.,()\s]+)|(A|a|Q|YYYY|YY?|ww?|MM?M?M?|Do|DD?|hh?|HH?|mm?|ss?|S{1,3}|z|ZZ?)/g,o=/\d/,r=/\d\d/,a=/\d\d?/,n=/\d*[^-_:/,()\s\d]+/,b={},c=function(e){return(e=+e)+(68<e?1900:2e3)},d=[/[+-]\d\d:?(\d\d)?|Z/,function(e){var t;(this.zone||(this.zone={})).offset=!e||"Z"===e||0===(t=60*(e=e.match(/([+-]|\d\d)/g))[1]+(+e[2]||0))?0:"+"===e[0]?-t:t}],p={A:[n,function(e){this.afternoon=t(e,!1)}],a:[n,function(e){this.afternoon=t(e,!0)}],Q:[o,function(e){this.month=3*(e-1)+1}],S:[o,function(e){this.milliseconds=100*+e}],SS:[r,function(e){this.milliseconds=10*+e}],SSS:[/\d{3}/,function(e){this.milliseconds=+e}],s:[a,e("seconds")],ss:[a,e("seconds")],m:[a,e("minutes")],mm:[a,e("minutes")],H:[a,e("hours")],h:[a,e("hours")],HH:[a,e("hours")],hh:[a,e("hours")],D:[a,e("day")],DD:[r,e("day")],Do:[n,function(e){var t=b.ordinal,i=e.match(/\d+/);if(this.day=i[0],t)for(var o=1;o<=31;o+=1)t(o).replace(/\[|\]/g,"")===e&&(this.day=o)}],w:[a,e("week")],ww:[r,e("week")],M:[a,e("month")],MM:[r,e("month")],MMM:[n,function(e){var t=i("months"),t=(i("monthsShort")||t.map(function(e){return e.slice(0,3)})).indexOf(e)+1;if(t<1)throw new Error;this.month=t%12||t}],MMMM:[n,function(e){e=i("months").indexOf(e)+1;if(e<1)throw new Error;this.month=e%12||e}],Y:[/[+-]?\d+/,e("year")],YY:[r,function(e){this.year=c(e)}],YYYY:[/\d{4}/,e("year")],Z:d,ZZ:d};function x(e){for(var t=e,r=b&&b.formats,d=(e=t.replace(/(\[[^\]]+])|(LTS?|l{1,4}|L{1,4})/g,function(e,t,i){var o=i&&i.toUpperCase();return t||r[i]||s[i]||r[o].replace(/(\[[^\]]+])|(MMMM|MM|DD|dddd)/g,function(e,t,i){return t||i.slice(1)})})).match(l),h=d.length,i=0;i<h;i+=1){var o=d[i],a=p[o],n=a&&a[0],a=a&&a[1];d[i]=a?{regex:n,parser:a}:o.replace(/^\[|\]$/g,"")}return function(e){for(var t,i,o,r={},a=0,n=0;a<h;a+=1){var s,l,c=d[a];"string"==typeof c?n+=c.length:(l=c.regex,c=c.parser,s=e.slice(n),l=l.exec(s)[0],c.call(r,l),e=e.replace(l,""))}return void 0!==(o=(t=r).afternoon)&&(i=t.hours,o?i<12&&(t.hours+=12):12===i&&(t.hours=0),delete t.afternoon),r}}return function(e,t,p){p.p.customParseFormat=!0,e&&e.parseTwoDigitYear&&(c=e.parseTwoDigitYear);var e=t.prototype,u=e.parse;e.parse=function(e){var t=e.date,i=e.utc,o=e.args,r=(this.$u=i,o[1]);if("string"==typeof r){var a=!0===o[2],n=!0===o[3],s=a||n,l=o[2];n&&(l=o[2]),b=this.$locale(),!a&&l&&(b=p.Ls[l]),this.$d=((e,t,i,o)=>{try{if(-1<["x","X"].indexOf(t))return new Date(("X"===t?1e3:1)*e);var r=x(t)(e),a=r.year,n=r.month,s=r.hours,l=r.minutes,c=r.seconds,d=r.milliseconds,h=r.zone,p=r.week,u=new Date,b=r.day||(a||n?1:u.getDate()),f=a||u.getFullYear(),g=0;a&&!n||(g=0<n?n-1:u.getMonth());var m,v=s||0,y=l||0,z=c||0,_=d||0;return h?new Date(Date.UTC(f,g,b,v,y,z,_+60*h.offset*1e3)):i?new Date(Date.UTC(f,g,b,v,y,z,_)):(m=new Date(f,g,b,v,y,z,_),m=p?o(m).week(p).toDate():m)}catch(e){return new Date("")}})(t,r,i,p),this.init(),l&&!0!==l&&(this.$L=this.locale(l).$L),s&&t!=this.format(r)&&(this.$d=new Date("")),b={}}else if(r instanceof Array)for(var c=r.length,d=1;d<=c;d+=1){o[1]=r[d-1];var h=p.apply(this,o);if(h.isValid()){this.$d=h.$d,this.$L=h.$L,this.init();break}d===c&&(this.$d=new Date(""))}else u.call(this,e)}}},"object"==typeof(e=e)&&void 0!==t?t.exports=i():"function"==typeof define&&define.amd?define(i):(e="undefined"!=typeof globalThis?globalThis:e||self).dayjs_plugin_customParseFormat=i()}})(),1),no=s(O(),1),so=(no.default.extend(n.default),/^(H|HH):(m|mm)(:(s|ss))?$/);function lo(e){return e&&so.test(e)?{source:e,hasSecond:e.includes("s")}:{source:"HH:mm",hasSecond:!1}}function co(e,t){var i=(0,no.default)(e,t,!0);return i.isValid()&&i.format(t)===e}function ho(e,t){var i;if(null!=e&&""!==e)return e instanceof Date?(i=(0,no.default)(e)).isValid()?i.format(t):void 0:"string"==typeof e&&(i=t,t=e)&&(e=(0,no.default)(t,i,!0)).isValid()&&(e=e.format(i))===t?e:void 0}function po(e,t,i){if(!Array.isArray(e))return[];var o,r=new Set;for(o of e){var a="number"==typeof o?o:Number.NaN;!Number.isInteger(a)||a<t||i<a||r.add(a)}return[...r]}var uo=s(O(),1),bo=["开始时间","结束时间"],n=class extends t{constructor(){super(...arguments),this.closeWatcher=null,this.suppressChangeEvent=!1,this.skipNextValueWatch=!1,this.suppressOpenOnFocus=!1,this.open=!1,this.hasFocus=!1,this.activeRangePart="start",this.panelSingleValue=void 0,this.draftRangeStart=void 0,this.draftRangeEnd=void 0,this.singleInputValue=void 0,this.rangeInputStart=void 0,this.rangeInputEnd=void 0,this.rangeIndicatorOffset=0,this.popupSkidding=0,this.type="time",this.format="HH:mm",this.value=void 0,this.previousValueKey=this.serializeValue(this.value),this.placeholder="",this.startPlaceholder="",this.endPlaceholder="",this.clearable=!1,this.disabled=!1,this.readonly=!1,this.hideDisabledOptions=!1,this.name="",this.hoist=!1,this.placement="bottom",this.handleFocus=()=>{this.hasFocus=!0,this.emit("bzl-focus")},this.handleBlur=()=>{this.hasFocus=!1,this.emit("bzl-blur")},this.handleComboboxMouseDown=e=>{var t;this.triggerDisabled||(e=e.target,this.isRange?((t=null==e?void 0:e.closest(".time-picker__range-field"))instanceof HTMLElement&&(this.activeRangePart="end"===t.dataset.part?"end":"start"),this.open=!0):e instanceof HTMLElement&&e.closest(".time-picker__display-input")?this.open=!0:this.open=!this.open)},this.handleSingleInputFocus=()=>{this.triggerDisabled||(this.suppressOpenOnFocus?this.suppressOpenOnFocus=!1:this.open=!0)},this.handleSingleInput=e=>{this.triggerDisabled||(e=e.target.value,this.singleInputValue=e,this.open||(this.panelSingleValue="string"==typeof this.computedValue?this.computedValue:void 0,this.open=!0),co(e,this.formatMeta.source)&&(e=(0,uo.default)(e,this.formatMeta.source,!0).format(this.formatMeta.source),this.isDisabledTime(e)||(this.panelSingleValue=e,this.scrollAllColumnsToSelected())))},this.handleRangeInputFocus=e=>{this.triggerDisabled||(this.activeRangePart=e,this.suppressOpenOnFocus?this.suppressOpenOnFocus=!1:this.open=!0)},this.handleRangeInput=(e,t)=>{var i;this.triggerDisabled||(t=t.target.value,"start"===(this.activeRangePart=e)?this.rangeInputStart=t:this.rangeInputEnd=t,this.open||(i=this.computedValue,Array.isArray(i)&&2===i.length?(this.draftRangeStart=i[0],this.draftRangeEnd=i[1]):(this.draftRangeStart=void 0,this.draftRangeEnd=void 0),this.open=!0),co(t,this.formatMeta.source)&&(i=(0,uo.default)(t,this.formatMeta.source,!0).format(this.formatMeta.source),this.isDisabledTime(i)||("start"===e?this.draftRangeStart=i:this.draftRangeEnd=i,this.scrollAllColumnsToSelected())))},this.handleInputKeyDown=e=>{"Enter"!==e.key||this.triggerDisabled||(e.preventDefault(),e.stopPropagation(),this.open?this.handleEnterCommit():this.open=!0)},this.handleClearMouseDown=e=>{e.preventDefault(),e.stopPropagation()},this.handleClearClick=e=>{e.preventDefault(),e.stopPropagation(),!this.triggerDisabled&&this.hasValue&&(this.confirm(this.isRange?[]:void 0,this.open),this.emit("bzl-clear"))},this.handleDocumentFocusIn=e=>{e.composedPath().includes(this)||this.closePanel()},this.handleDocumentMouseDown=e=>{e.composedPath().includes(this)||this.redirectFocusToMissingRangePart()||this.closePanel()},this.handleDocumentKeyDown=e=>{"Enter"===e.key&&this.open?(e.preventDefault(),e.stopPropagation(),this.handleEnterCommit()):"Escape"===e.key&&this.open&&(e.preventDefault(),e.stopPropagation(),this.closePanel(),this.focusTriggerAfterClose())}}connectedCallback(){super.connectedCallback(),this.normalizeValueForCurrentMode(!0)}firstUpdated(){this.previousValueKey=this.serializeValue(this.value),this.suppressChangeEvent=!1}get formatMeta(){return lo(this.format)}get isRange(){return"time-range"===this.type}get triggerDisabled(){return this.disabled||this.readonly}get computedValue(){return this.normalizeValueByType(this.value,this.type,this.formatMeta.source)}formatPieceForDisplay(e){return"string"==typeof e?e:e instanceof Date&&(e=(0,uo.default)(e)).isValid()?e.format(this.formatMeta.source):""}get displayValueRange(){return Array.isArray(this.value)&&2===this.value.length?[this.formatPieceForDisplay(this.value[0]),this.formatPieceForDisplay(this.value[1])]:["",""]}get singleEntryDisplay(){var e,t=this.formatPieceForDisplay(this.value);return this.open&&null!=(e=null!=(e=this.singleInputValue)?e:this.panelSingleValue)?e:t}get rangeEntryDisplay(){var e,[t,i]=this.displayValueRange;return this.open&&this.isRange?[null!=(e=null!=(e=this.rangeInputStart)?e:this.draftRangeStart)?e:t,null!=(e=null!=(e=this.rangeInputEnd)?e:this.draftRangeEnd)?e:i]:[t,i]}get resolvedRangePlaceholder(){return[this.startPlaceholder||bo[0],this.endPlaceholder||bo[1]]}get resolvedSinglePlaceholder(){return this.placeholder}get hasValue(){return this.isRange?Array.isArray(this.value)&&2===this.value.length:"string"==typeof this.value?0<this.value.length:this.value instanceof Date&&(0,uo.default)(this.value).isValid()}getDisabledHours(){var e;return po(null==(e=this.disabledHours)?void 0:e.call(this),0,23)}getDisabledMinutes(e){var t;return po(null==(t=this.disabledMinutes)?void 0:t.call(this,e),0,59)}getDisabledSeconds(e,t){var i;return po(null==(i=this.disabledSeconds)?void 0:i.call(this,e,t),0,59)}isDisabledTime(e){var t,i,o,r,a;return!(!e||!co(e,this.formatMeta.source)||!(e=(0,uo.default)(e,this.formatMeta.source,!0)).isValid())&&(t=Number(e.format("H")),i=Number(e.format("m")),e=Number(e.format("s")),o=this.getDisabledHours(),r=this.getDisabledMinutes(t),a=this.getDisabledSeconds(t,i),o.includes(t)||r.includes(i)||a.includes(e))}serializeValue(e){return void 0===e?"single-empty":Array.isArray(e)?2===e.length?"range:"+e.map(e=>String(e)).join("|"):"range-empty":"single:"+String(e)}normalizeValueForCurrentMode(e){var t=this.normalizeValueByType(this.value,this.type,this.formatMeta.source);this.serializeValue(t)!==this.serializeValue(this.value)&&(this.suppressChangeEvent=e,this.value=t)}normalizeValueByType(e,t,i){var o;return"time-range"===t?Array.isArray(e)&&2===e.length&&(t=ho(e[0],i),o=ho(e[1],i),t)&&o?[t,o]:[]:ho(e,i)}normalizeValueToFormat(e,i,t){var o,r,a=e=>{var t;return e instanceof Date?(t=(0,uo.default)(e)).isValid()?t:null:"string"==typeof e&&(t=(0,uo.default)(e,i,!0)).isValid()?t:null};return Array.isArray(e)?2===e.length&&(r=a(e[0]),o=a(e[1]),r)&&o?[r.format(t),o.format(t)]:[]:(r=a(void 0===e?null:e))?r.format(t):void 0}getEditableValue(){var e;return this.isRange?"start"===this.activeRangePart?this.draftRangeStart:this.draftRangeEnd:(e=this.open?this.panelSingleValue:"string"==typeof this.computedValue?this.computedValue:void 0)&&co(e,this.formatMeta.source)?e:void 0}setEditableValue(e){"start"===this.activeRangePart?(this.draftRangeStart=e,this.rangeInputStart=void 0):(this.draftRangeEnd=e,this.rangeInputEnd=void 0)}toNumericMap(e){var t=this.formatMeta,e=e&&co(e,t.source)?(0,uo.default)(e,t.source,!0):(0,uo.default)("00:00:00","HH:mm:ss",!0);return{hour:Number(e.format("H")),minute:Number(e.format("m")),second:Number(e.format("s"))}}getEditableNumericMap(){var e=this.getEditableValue();if(e&&co(e,this.formatMeta.source))return this.toNumericMap(e)}hasEditableTimeBase(){var e=this.getEditableValue();return!(!e||!co(e,this.formatMeta.source))}buildValueWithUnit(e,t){var i=this.toNumericMap(this.getEditableValue());return i[e]=t,(0,uo.default)().hour(i.hour).minute(i.minute).second(i.second).millisecond(0).format(this.formatMeta.source)}getSelectedNumber(e){return this.hasEditableTimeBase()?this.toNumericMap(this.getEditableValue())[e]:null}buildUnitOptions(e,t){let i=this.getSelectedNumber(e);var o=this.getEditableNumericMap();let r=new Set;r="hour"===e?new Set(this.getDisabledHours()):"minute"===e?new Set(this.getDisabledMinutes(null==o?void 0:o.hour)):new Set(this.getDisabledSeconds(null==o?void 0:o.hour,null==o?void 0:o.minute));e=Array.from({length:t+1},(e,t)=>t);return(this.hideDisabledOptions?e.filter(e=>!r.has(e)):e).map(e=>({value:e,label:String(e).padStart(2,"0"),selected:null!==i&&e===i,disabled:r.has(e)}))}syncRangeIndicatorOffset(){var e,t;this.isRange?(e=null==(t=null==(t=this.shadowRoot)?void 0:t.querySelector(".time-picker__range-display"))?void 0:t.querySelector(`.time-picker__range-field[data-part="${this.activeRangePart}"]`),t&&e&&(t=e.offsetLeft,this.rangeIndicatorOffset!==t)&&(this.rangeIndicatorOffset=t)):0!==this.rangeIndicatorOffset&&(this.rangeIndicatorOffset=0)}syncPopupSkidding(){var e;this.isRange&&"end"===this.activeRangePart?(e=null!=(e=this.rangeFieldEnd)?e:null==(e=this.shadowRoot)?void 0:e.querySelector('.time-picker__range-field[data-part="end"]'))&&(e=Math.max(0,e.offsetLeft),this.popupSkidding!==e)&&(this.popupSkidding=e):0!==this.popupSkidding&&(this.popupSkidding=0)}addOpenListeners(){var e;document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("mousedown",this.handleDocumentMouseDown),document.addEventListener("keydown",this.handleDocumentKeyDown),this.getRootNode()!==document&&this.getRootNode().addEventListener("focusin",this.handleDocumentFocusIn),"CloseWatcher"in window&&(null!=(e=this.closeWatcher)&&e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.open&&(this.closePanel(),this.focusTriggerAfterClose())})}closePanel(){this.open&&(this.open=!1)}focusTriggerInput(e){var t;this.isRange?null!=(t="end"===this.activeRangePart?this.rangeFieldEnd:this.rangeFieldStart)&&t.focus(e):null!=(t=this.displayInput)&&t.focus(e)}removeOpenListeners(){var e;document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("mousedown",this.handleDocumentMouseDown),document.removeEventListener("keydown",this.handleDocumentKeyDown),this.getRootNode()!==document&&this.getRootNode().removeEventListener("focusin",this.handleDocumentFocusIn),null!=(e=this.closeWatcher)&&e.destroy(),this.closeWatcher=null}syncPanelFromComputedValue(){var e;this.isRange?(e=this.computedValue,Array.isArray(e)&&2===e.length?(this.draftRangeStart=(e=e)[0],this.draftRangeEnd=e[1],this.rangeInputStart=e[0],this.rangeInputEnd=e[1]):(this.draftRangeStart=void 0,this.draftRangeEnd=void 0,this.rangeInputStart=void 0,this.rangeInputEnd=void 0)):(this.panelSingleValue="string"==typeof this.computedValue?this.computedValue:void 0,this.singleInputValue=this.panelSingleValue)}clearInputValue(){this.singleInputValue=void 0,this.rangeInputStart=void 0,this.rangeInputEnd=void 0}getSortedRangeValue(e,t){e=(0,uo.default)(e,this.formatMeta.source,!0),t=(0,uo.default)(t,this.formatMeta.source,!0);if(e.isValid()&&t.isValid())return t.isBefore(e)?[t.format(this.formatMeta.source),e.format(this.formatMeta.source)]:[e.format(this.formatMeta.source),t.format(this.formatMeta.source)]}focusTriggerAfterClose(){this.suppressOpenOnFocus=!0,this.focusTriggerInput({preventScroll:!0})}resolveSingleCommitValue(){var e,t="string"==typeof this.computedValue?this.computedValue:void 0;return void 0===this.singleInputValue?null!=(e=this.panelSingleValue)?e:t:""!==this.singleInputValue?!co(this.singleInputValue,this.formatMeta.source)||(e=(0,uo.default)(this.singleInputValue,this.formatMeta.source,!0).format(this.formatMeta.source),this.isDisabledTime(e))?t:e:void 0}confirm(e,t){e=this.normalizeValueByType(e,this.type,this.formatMeta.source);if("string"==typeof e&&this.isDisabledTime(e))this.syncPanelFromComputedValue();else{if(Array.isArray(e)&&2===e.length){var[i,o]=e;if(this.isDisabledTime(i)||this.isDisabledTime(o))return void this.syncPanelFromComputedValue()}this.serializeValue(e)!==this.serializeValue(this.value)&&(this.skipNextValueWatch=!0,this.value=e),this.clearInputValue(),this.open!==t&&(this.open=t),this.syncPanelFromComputedValue(),this.flushValueSideEffects()}}commitPanelOnClose(){var e;if(this.isRange)return!this.draftRangeStart||!this.draftRangeEnd||!(e=this.getSortedRangeValue(this.draftRangeStart,this.draftRangeEnd))||this.isDisabledTime(e[0])||this.isDisabledTime(e[1])?(this.syncPanelFromComputedValue(),void this.clearInputValue()):void this.confirm(e,!1);this.confirm(this.resolveSingleCommitValue(),!1)}focusRangeField(e){var t=null==(t=this.shadowRoot)?void 0:t.querySelector(`.time-picker__range-field[data-part="${e}"]`);null!=t&&t.focus()}redirectFocusToMissingRangePart(){if(!this.isRange||this.triggerDisabled)return!1;var e=!!this.draftRangeStart;if(e==!!this.draftRangeEnd)return!1;let t=e?"end":"start";return this.activeRangePart!==t&&(this.activeRangePart=t,this.open=!0,("function"==typeof queueMicrotask?queueMicrotask:e=>{Promise.resolve().then(e)})(()=>{this.focusRangeField(t)}),!0)}handleEnterCommit(){var e,t;this.open&&!this.triggerDisabled&&(this.isRange?this.draftRangeStart&&this.draftRangeEnd?!(e=this.getSortedRangeValue(this.draftRangeStart,this.draftRangeEnd))||this.isDisabledTime(e[0])||this.isDisabledTime(e[1])?(t="start"===this.activeRangePart?"end":"start",this.activeRangePart=t,this.focusRangeField(t)):this.confirm(e,!1):(t="start"===this.activeRangePart?"end":"start",this.activeRangePart=t,this.focusRangeField(t)):this.confirm(this.resolveSingleCommitValue(),!1))}flushValueSideEffects(){var e=this.normalizeValueByType(this.value,this.type,this.formatMeta.source);this.serializeValue(e)!==this.serializeValue(this.value)?this.value=e:(e=this.serializeValue(this.value),this.hasUpdated&&e!==this.previousValueKey&&(this.suppressChangeEvent||this.emit("bzl-change"),this.previousValueKey=e),this.suppressChangeEvent=!1),this.open&&this.syncPanelFromComputedValue()}handleUnitClick(e,t){var i,o;this.triggerDisabled||(i=this.hasEditableTimeBase(),o=this.buildValueWithUnit(e,t),this.isDisabledTime(o)?this.syncPanelFromComputedValue():(this.isRange?this.setEditableValue(o):this.confirm(o,!0),i?this.scrollColumnOptionToTop(e,t):this.scrollAllColumnsToSelected()))}async scrollAllColumnsToSelected(t="smooth"){let i=this.getEditableNumericMap();var e;i&&(e=this.formatMeta.hasSecond?["hour","minute","second"]:["hour","minute"],await Promise.all(e.map(e=>this.scrollColumnOptionToTop(e,i[e],t))))}async scrollColumnOptionToTop(e,t,i="smooth"){await this.updateComplete;var o=null==(o=this.shadowRoot)?void 0:o.querySelector(`.time-picker__column[data-unit="${e}"]`),e=null==o?void 0:o.querySelector(`button.time-picker__option[data-value="${t}"]`);o&&e&&(t=e.getBoundingClientRect().top-o.getBoundingClientRect().top,e="undefined"!=typeof window&&"function"==typeof window.getComputedStyle&&parseFloat(getComputedStyle(o).paddingTop)||0,t=o.scrollTop+t-e,e=Math.max(0,o.scrollHeight-o.clientHeight),t=Math.max(0,Math.min(t,e)),e="function"==typeof window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches,o.scrollTo({top:t,behavior:e?"auto":i}))}handleColumnKeyDown(e,i){if(!this.triggerDisabled&&this.open)if("Enter"===i.key)i.preventDefault(),i.stopPropagation(),this.handleEnterCommit();else if("ArrowUp"===i.key||"ArrowDown"===i.key){i.preventDefault(),i.stopPropagation();var i="ArrowDown"===i.key?1:-1,o=this.buildUnitOptions(e,"hour"===e?23:59).filter(e=>!e.disabled);if(0!==o.length){let t=this.getSelectedNumber(e);var r=o.findIndex(e=>e.value===t),a=1==i?0:o.length-1,a=o[-1===r?a:(r+i+o.length)%o.length].value;this.handleUnitClick(e,a)}}}renderColumn(t,e){e=this.buildUnitOptions(t,e);return h`
      <div
        part="column"
        class="time-picker__column bzl-scrollbar"
        data-unit=${t}
        role="listbox"
        aria-label=${t}
        @keydown=${e=>this.handleColumnKeyDown(t,e)}
        tabindex="0"
      >
        ${e.map(e=>h`
            <button
              part="column-option"
              class=${v({"time-picker__option":!0,"time-picker__option--selected":e.selected,"time-picker__option--disabled":e.disabled})}
              data-value=${String(e.value)}
              role="option"
              aria-selected=${e.selected?"true":"false"}
              type="button"
              .disabled=${e.disabled}
              @click=${()=>this.handleUnitClick(t,e.value)}
            >
              ${e.label}
            </button>
          `)}
      </div>
    `}renderColumns(){var e=[];return e.push(this.renderColumn("hour",23)),e.push(this.renderColumn("minute",59)),this.formatMeta.hasSecond&&e.push(this.renderColumn("second",59)),e}renderFormValueInputs(){return this.name&&this.hasValue?this.isRange&&Array.isArray(this.value)&&2===this.value.length?h`
        <input class="time-picker__value-input" type="hidden" .name=${this.name} .value=${this.value[0]} />
        <input class="time-picker__value-input" type="hidden" .name=${this.name} .value=${this.value[1]} />
      `:"string"==typeof this.value?h`<input class="time-picker__value-input" type="hidden" .name=${this.name} .value=${this.value} />`:"":""}handleTypeChange(){this.normalizeValueForCurrentMode(!0),this.syncPanelFromComputedValue()}handleFormatChange(e){var e=lo(e),t=this.formatMeta;t.source!==this.format?this.format=t.source:(e=this.normalizeValueToFormat(this.value,e.source,t.source),this.value=this.normalizeValueByType(e,this.type,t.source),this.syncPanelFromComputedValue())}handleDisabledChange(){this.triggerDisabled&&(this.open=!1)}handleReadonlyChange(){this.triggerDisabled&&(this.open=!1)}handleValueChange(){this.skipNextValueWatch?this.skipNextValueWatch=!1:this.flushValueSideEffects()}async handleOpenChange(){var e,t;this.open&&!this.triggerDisabled?(void 0===this.singleInputValue&&void 0===this.rangeInputStart&&void 0===this.rangeInputEnd&&this.syncPanelFromComputedValue(),this.emit("bzl-show"),this.addOpenListeners(),await E(this),this.panel.hidden=!1,this.popup.active=!0,await this.updateComplete,await this.scrollAllColumnsToSelected("auto"),{keyframes:e,options:t}=T(this,"time-picker.show",{dir:"ltr"}),await S(this.popup.popup,e,t),this.emit("bzl-after-show")):(this.commitPanelOnClose(),this.emit("bzl-hide"),this.removeOpenListeners(),await E(this),{keyframes:e,options:t}=T(this,"time-picker.hide",{dir:"ltr"}),await S(this.popup.popup,e,t),this.panel.hidden=!0,this.popup.active=!1,await this.updateComplete,this.clearInputValue(),this.emit("bzl-after-hide"))}updated(e){super.updated(e),(e.has("type")||e.has("activeRangePart")||e.has("open"))&&(this.syncRangeIndicatorOffset(),this.syncPopupSkidding()),e.has("activeRangePart")&&this.open&&this.scrollAllColumnsToSelected("auto")}render(){var[e,t]=this.rangeEntryDisplay,[i,o]=this.resolvedRangePlaceholder,r=this.clearable&&!this.triggerDisabled&&this.hasValue;return h`
      <bzl-popup
        class=${v({"time-picker":!0,"time-picker--open":this.open,"time-picker--disabled":this.disabled,"time-picker--readonly":this.readonly,"time-picker--focused":this.hasFocus,"time-picker--range":this.isRange})}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        distance=${2}
        skidding=${this.popupSkidding}
        placement=${"top"===this.placement?"top-start":"bottom-start"}
      >
        <div
          part="combobox"
          class="time-picker__combobox"
          slot="anchor"
          @mousedown=${this.handleComboboxMouseDown}
          @focusin=${this.handleFocus}
          @focusout=${this.handleBlur}
        >
          ${this.isRange?h`
                <div part="range-display" class="time-picker__range-display" role="group">
                  <input
                    part="range-field"
                    class=${v({"time-picker__range-field":!0,"time-picker__range-field--placeholder":!e})}
                    data-part="start"
                    type="text"
                    .value=${e}
                    placeholder=${i}
                    .disabled=${this.disabled}
                    .readOnly=${this.readonly}
                    @focus=${()=>this.handleRangeInputFocus("start")}
                    @input=${e=>this.handleRangeInput("start",e)}
                    @keydown=${this.handleInputKeyDown}
                  />
                  <span class="time-picker__range-separator">-</span>
                  <input
                    part="range-field"
                    class=${v({"time-picker__range-field":!0,"time-picker__range-field--placeholder":!t})}
                    data-part="end"
                    type="text"
                    .value=${t}
                    placeholder=${o}
                    .disabled=${this.disabled}
                    .readOnly=${this.readonly}
                    @focus=${()=>this.handleRangeInputFocus("end")}
                    @input=${e=>this.handleRangeInput("end",e)}
                    @keydown=${this.handleInputKeyDown}
                  />
                  ${this.open?h`
                        <span
                          class="time-picker__range-indicator"
                          style=${`transform: translateX(${this.rangeIndicatorOffset}px);`}
                          aria-hidden="true"
                        ></span>
                      `:""}
                </div>
              `:h`
                <input
                  part="display-input"
                  class="time-picker__display-input"
                  type="text"
                  .value=${this.singleEntryDisplay}
                  placeholder=${this.resolvedSinglePlaceholder}
                  .disabled=${this.disabled}
                  .readOnly=${this.readonly}
                  aria-controls="time-panel"
                  aria-expanded=${this.open?"true":"false"}
                  tabindex="0"
                  @focus=${this.handleSingleInputFocus}
                  @input=${this.handleSingleInput}
                  @keydown=${this.handleInputKeyDown}
                />
              `}
          ${r?h`
                <button
                  part="clear-button"
                  class="time-picker__clear"
                  type="button"
                  tabindex="-1"
                  @mousedown=${this.handleClearMouseDown}
                  @click=${this.handleClearClick}
                >
                  <bzl-icon name="close-face1"></bzl-icon>
                </button>
              `:""}

          <span part="time-icon" class="time-picker__time-icon">
            <bzl-icon name="ing-outline1"></bzl-icon>
          </span>

          ${this.renderFormValueInputs()}
        </div>

        <div
          id="time-panel"
          part="panel"
          class="time-picker__panel"
          role="dialog"
          aria-label="time-picker"
          aria-modal="false"
          hidden
        >
          <div
            part="columns"
            class=${v({"time-picker__columns":!0,"time-picker__columns--with-second":this.formatMeta.hasSecond})}
          >
            ${this.renderColumns()}
          </div>
        </div>
      </bzl-popup>
    `}},fo=(n.styles=[u,_],n.dependencies={"bzl-icon":m,"bzl-popup":$},d([g(".time-picker")],n.prototype,"popup",2),d([g(".time-picker__panel")],n.prototype,"panel",2),d([g(".time-picker__display-input")],n.prototype,"displayInput",2),d([g('.time-picker__range-field[data-part="start"]')],n.prototype,"rangeFieldStart",2),d([g('.time-picker__range-field[data-part="end"]')],n.prototype,"rangeFieldEnd",2),d([g(".time-picker__combobox")],n.prototype,"combobox",2),d([f()],n.prototype,"open",2),d([f()],n.prototype,"hasFocus",2),d([f()],n.prototype,"activeRangePart",2),d([f()],n.prototype,"panelSingleValue",2),d([f()],n.prototype,"draftRangeStart",2),d([f()],n.prototype,"draftRangeEnd",2),d([f()],n.prototype,"singleInputValue",2),d([f()],n.prototype,"rangeInputStart",2),d([f()],n.prototype,"rangeInputEnd",2),d([f()],n.prototype,"rangeIndicatorOffset",2),d([f()],n.prototype,"popupSkidding",2),d([b({reflect:!0})],n.prototype,"type",2),d([b()],n.prototype,"format",2),d([b({attribute:"value"})],n.prototype,"value",2),d([b()],n.prototype,"placeholder",2),d([b({attribute:"start-placeholder"})],n.prototype,"startPlaceholder",2),d([b({attribute:"end-placeholder"})],n.prototype,"endPlaceholder",2),d([b({type:Boolean})],n.prototype,"clearable",2),d([b({type:Boolean,reflect:!0})],n.prototype,"disabled",2),d([b({type:Boolean,reflect:!0})],n.prototype,"readonly",2),d([b({attribute:!1})],n.prototype,"disabledHours",2),d([b({attribute:!1})],n.prototype,"disabledMinutes",2),d([b({attribute:!1})],n.prototype,"disabledSeconds",2),d([b({type:Boolean,attribute:"hide-disabled-options"})],n.prototype,"hideDisabledOptions",2),d([b()],n.prototype,"name",2),d([b({type:Boolean})],n.prototype,"hoist",2),d([b({reflect:!0})],n.prototype,"placement",2),d([p("type",{waitUntilFirstUpdate:!0})],n.prototype,"handleTypeChange",1),d([p("format",{waitUntilFirstUpdate:!0})],n.prototype,"handleFormatChange",1),d([p("disabled",{waitUntilFirstUpdate:!0})],n.prototype,"handleDisabledChange",1),d([p("readonly",{waitUntilFirstUpdate:!0})],n.prototype,"handleReadonlyChange",1),d([p("value",{waitUntilFirstUpdate:!0})],n.prototype,"handleValueChange",1),d([p("open",{waitUntilFirstUpdate:!0})],n.prototype,"handleOpenChange",1),A("time-picker.show",{keyframes:[{opacity:0,transform:"scale(0.96)"},{opacity:1,transform:"scale(1)"}],options:{duration:180,easing:"ease"}}),A("time-picker.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.96)"}],options:{duration:180,easing:"ease"}}),n),go=(n.define("bzl-time-picker"),class Qr{constructor(){this.toasts=[],this.loadingToasts=[],this.defaultOptions={type:"info",duration:3e3,loading:!1,offset:32},customElements.get("bzl-toast")||w.define("bzl-toast")}static getInstance(){return Qr.instance||(Qr.instance=new Qr),Qr.instance}createToast(e){let t=document.createElement("bzl-toast");var i,e=y(y({},this.defaultOptions),e);return e.type&&(t.type=e.type),void 0!==e.duration&&(t.duration=e.duration),e.icon&&(t.icon=e.icon),void 0!==e.loading&&(t.loading=e.loading),e.html?t.innerHTML=e.html:e.content&&(t.content=e.content),e.suffix&&((i=document.createElement("span")).innerHTML=e.suffix,i.setAttribute("slot","suffix"),t.appendChild(i),setTimeout(()=>{var e;t.shadowRoot&&null!=(e=t.shadowRoot.querySelector('slot[name="suffix"]'))&&e.dispatchEvent(new Event("slotchange"))},0)),t.addEventListener("bzl-close",()=>{this.removeToast(t)}),e.onSuffixClick&&t.addEventListener("bzl-suffix-click",e.onSuffixClick),t}show(e){var e="string"==typeof e?{content:e}:e,t=this.createToast(e);return document.body.appendChild(t),(e.loading?this.loadingToasts:this.toasts).push(t),this.updateToastPositions(),t}success(e){return this.show(z(y({},"string"==typeof e?{content:e}:e),{type:"success"}))}info(e){return this.show(z(y({},"string"==typeof e?{content:e}:e),{type:"info"}))}warning(e){return this.show(z(y({},"string"==typeof e?{content:e}:e),{type:"warning"}))}error(e){return this.show(z(y({},"string"==typeof e?{content:e}:e),{type:"error"}))}loading(e){return this.show(z(y({},"string"==typeof e?{content:e}:e),{loading:!0,duration:0}))}removeToast(e){var t=this.toasts.indexOf(e);-1<t?(this.toasts.splice(t,1),this.updateToastPositions()):-1<(t=this.loadingToasts.indexOf(e))&&(this.loadingToasts.splice(t,1),this.updateToastPositions())}updateToastPositions(){let i=this.defaultOptions.offset||32;this.toasts.forEach((e,t)=>{e.style.position="fixed",e.style.top=i+60*t+"px",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex=""+(2e3+t),e.style.transition="all 0.3s ease"}),this.loadingToasts.forEach((e,t)=>{e.style.position="fixed",e.style.top=i+60*t+"px",e.style.left="50%",e.style.transform="translateX(-50%)",e.style.zIndex=""+(3e3+t),e.style.transition="all 0.3s ease"})}closeAllLoading(){this.loadingToasts.forEach(e=>{e.hide()}),this.loadingToasts=[]}closeAllNormal(){this.toasts.forEach(e=>{e.hide()}),this.toasts=[]}closeAll(){this.closeAllNormal(),this.closeAllLoading()}setDefaults(e){this.defaultOptions=y(y({},this.defaultOptions),e)}}),mo=go.getInstance(),vo={show:e=>mo.show(e),success:e=>mo.success(e),info:e=>mo.info(e),warning:e=>mo.warning(e),error:e=>mo.error(e),loading:e=>mo.loading(e),closeAll:()=>mo.closeAll(),closeAllNormal:()=>mo.closeAllNormal(),closeAllLoading:()=>mo.closeAllLoading(),setDefaults:e=>mo.setDefaults(e)},s=o`
  :host {
    display: block;
  }

  .steps {
    width: 100%;
    display: flex;
    gap: var(--bzl-spacing-5);
  }

  .steps--vertical {
    flex-direction: column;
  }

  .steps--horizontal > slot::slotted(bzl-step:not([data-last='true'])) {
    flex: 1;
    min-width: 0;
  }

  .steps--horizontal > slot::slotted(bzl-step[data-last='true']) {
    flex: none;
  }

  .steps--vertical > slot::slotted(bzl-step) {
    width: 100%;
  }
`,O=o`
  :host {
    display: flex;
    flex-direction: column;
    flex: 1 1 0%;
    min-width: 0;
    box-sizing: border-box;
    --bzl-step-marker-box: 24px;
    --bzl-step-marker-icon-size: 21px;
    --bzl-step-label-inline-row-width: 196px;
  }

  :host([data-last='true']) {
    flex: none;
  }

  .step {
    display: flex;
    position: relative;
    color: var(--bzl-color-neutral-900);
    box-sizing: border-box;
  }

  .step--horizontal {
    flex-direction: column;
    align-items: stretch;
    min-width: 0;
    width: 100%;
  }

  .step--vertical {
    flex-direction: row;
    align-items: stretch;
    width: 100%;
  }

  .step--vertical:not(.step--last) {
    min-height: 74px;
  }

  .step__track {
    display: flex;
    flex-shrink: 0;
    box-sizing: border-box;
  }

  .step--horizontal .step__track {
    flex-direction: row;
    align-items: center;
    width: 100%;
  }

  /*
   * 横向 + 标题在上：第 1 列固定为图标宽度，保证连线始终从图标后开始；
   * 文案放在第 2 行并相对图标中心对齐，不再影响第 1 行连线起点。
   */
  .step--horizontal.step--label-vertical {
    position: relative;
  }
  .step--horizontal.step--label-vertical .step__label-line-row {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: var(--bzl-step-label-inline-row-width);
  }

  .step--horizontal.step--label-vertical > .step__connector {
    position: absolute;
    top: 11.5px;
    left: calc(var(--bzl-step-label-inline-row-width) / 2 + var(--bzl-step-marker-box) / 2);
    width: calc(100% - var(--bzl-step-marker-box) - var(--bzl-spacing-5));
  }

  .step--horizontal.step--label-vertical .step__label-line-row > .step__body--label-block {
    margin-top: var(--bzl-spacing-2);
    text-align: center;
  }

  .step--vertical .step__track {
    flex-direction: column;
    align-items: center;
    width: var(--bzl-step-marker-box);
    align-self: stretch;
  }

  .step--vertical .step__marker {
    margin-right: 0;
  }

  .step__marker {
    flex-shrink: 0;
    width: var(--bzl-step-marker-box);
    height: var(--bzl-step-marker-box);
    line-height: var(--bzl-step-marker-box);
    text-align: center;
    box-sizing: border-box;
    margin-right: var(--bzl-spacing-3);
  }

  .step__index-circle {
    display: inline-block;
    width: var(--bzl-step-marker-icon-size);
    height: var(--bzl-step-marker-icon-size);
    line-height: var(--bzl-step-marker-icon-size);
    text-align: center;
    border-radius: var(--bzl-border-radius-circle);
    color: var(--bzl-color-neutral-0);
    font-size: var(--bzl-font-size-2x-small);
  }

  .step--process .step__index-circle {
    background-color: var(--bzl-color-primary-600);
  }

  .step--wait .step__index-circle {
    background-color: var(--bzl-color-neutral-600);
  }

  .step__index {
    display: inline;
    vertical-align: baseline;
  }

  .step__icon {
    display: block;
    font-size: 23px;
    color: var(--bzl-color-primary-600);
  }

  .step--danger .step__icon {
    color: var(--bzl-color-danger-600);
  }

  .step--dot .step__dot {
    display: inline-block;
    width: var(--bzl-badge-dot-size);
    height: var(--bzl-badge-dot-size);
    border-radius: var(--bzl-border-radius-circle);
    vertical-align: middle;
    box-sizing: border-box;
  }

  .step--dot.step--process .step__dot,
  .step--dot.step--finish .step__dot {
    background-color: var(--bzl-color-primary-600);
  }

  .step--dot.step--wait .step__dot {
    background-color: var(--bzl-color-neutral-600);
  }

  .step--dot.step--danger .step__dot {
    background-color: var(--bzl-color-danger-600);
  }

  .step__connector {
    flex-shrink: 0;
    background-color: var(--bzl-panel-divider-color);
    box-sizing: border-box;
  }

  .step--finish .step__connector {
    background-color: var(--bzl-color-boss-600);
  }

  .step--horizontal .step__connector {
    height: 1px;
  }

  .step--horizontal:not(.step--label-inline) .step__connector,
  .step--horizontal.step--label-inline .step__inline-title-row .step__connector {
    flex: 1 1 auto;
    align-self: center;
    min-width: var(--bzl-spacing-4);
    margin-inline-start: var(--bzl-spacing-4);
  }

  .step--horizontal.step--label-inline .step__inline-title-row {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
  }

  .step--vertical .step__connector {
    flex: 1 1 auto;
    width: 1px;
    min-height: var(--bzl-spacing-5);
    margin-top: var(--bzl-spacing-2);
  }

  .step--last .step__connector {
    display: none;
  }

  .step__body {
    flex: 1 1 auto;
    min-width: 0;
    box-sizing: border-box;
  }

  .step--horizontal .step__body {
    margin-top: var(--bzl-spacing-2);
    width: 100%;
  }

  .step__inline-row {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
  }

  .step--horizontal.step--label-inline .step__marker {
    margin-inline-end: var(--bzl-spacing-3);
  }

  .step--horizontal.step--label-inline .step__body {
    flex: 1 1 auto;
    margin-top: 0;
    width: auto;
  }

  .step--vertical .step__body {
    margin-inline-start: var(--bzl-spacing-3);
  }

  .step__title {
    font-size: var(--bzl-font-size-medium);
    line-height: var(--bzl-line-height-normal);
    font-weight: var(--bzl-font-weight-bold);
    white-space: nowrap;
  }

  .step__description {
    margin-top: var(--bzl-spacing-1);
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-line-height-x-dense);
  }
`,_=class extends t{constructor(){super(...arguments),this.title="",this.description="",this.status=void 0,this._context={index:0,isCurrent:!1,effectiveStatus:"wait",stepsType:"default",direction:"horizontal",labelPlacement:"horizontal",isLast:!1}}applyContextFromParent(e){(this._context=e).isLast?this.setAttribute("data-last","true"):this.removeAttribute("data-last")}get hasUserStatusOverride(){return null!=this.status}get effectiveStatus(){return this._context.effectiveStatus}renderMarker(){var e=this._context,t=e.effectiveStatus;return"dot"===e.stepsType?h`<span class="step__dot"></span>`:"finish"===t?h`<bzl-icon class="step__icon" name="pass-face"></bzl-icon>`:"danger"===t?h`<bzl-icon class="step__icon" name="close-face1"></bzl-icon>`:h`<span class="step__index-circle"><span class="step__index">${e.index+1}</span></span>`}renderTitleDescription(){return h`
      ${this.title?h`<div part="title" class="step__title">${this.title}</div>`:null}
      ${this.description?h`<div part="description" class="step__description">${this.description}</div>`:null}
    `}renderInlineBody(e){var t=Boolean(this.title||e);return h`
      ${t?h`
            <div class="step__inline-title-row">
              ${this.title?h`<div part="title" class="step__title">${this.title}</div>`:null}
              ${e?h`<div part="connector" class="step__connector"></div>`:null}
            </div>
          `:null}
      ${this.description?h`<div part="description" class="step__description">${this.description}</div>`:null}
    `}renderBase(e,t){var i=this._context,o=i.effectiveStatus;return h`
      <div
        part="base"
        class=${v(e)}
        data-step-index=${String(i.index)}
        data-effective-status=${o}
        data-current=${i.isCurrent?"true":"false"}
        data-last=${i.isLast?"true":"false"}
      >
        ${t}
      </div>
    `}render(){var e=this._context,t=e.effectiveStatus,i="dot"===e.stepsType,o=!e.isLast,r="horizontal"===e.direction&&"horizontal"===e.labelPlacement,i={step:!0,"step--horizontal":"horizontal"===e.direction,"step--vertical":"vertical"===e.direction,"step--label-inline":r,"step--label-vertical":"horizontal"===e.direction&&"vertical"===e.labelPlacement,"step--dot":i,"step--default":!i,["step--"+t]:!0,"step--current":e.isCurrent,"step--last":e.isLast};return r?this.renderBase(i,h`
          <div class="step__inline-row">
            <div part="marker" class="step__marker">${this.renderMarker()}</div>
            <div part="body" class="step__body">${this.renderInlineBody(o)}</div>
          </div>
        `):"horizontal"===e.direction&&"vertical"===e.labelPlacement?(t=Boolean(this.title||this.description),this.renderBase(i,h`
          <div class="step__label-line-row">
            <div part="marker" class="step__marker">${this.renderMarker()}</div>
            ${t?h`<div part="body" class="step__body step__body--label-block">${this.renderTitleDescription()}</div>`:null}
          </div>
          ${o?h`<div part="connector" class="step__connector"></div>`:null}
        `)):this.renderBase(i,h`
        <div class="step__track">
          <div part="marker" class="step__marker">${this.renderMarker()}</div>
          ${o?h`<div part="connector" class="step__connector"></div>`:null}
        </div>
        <div part="body" class="step__body">${this.renderTitleDescription()}</div>
      `)}},n=(_.styles=[u,O],_.dependencies={"bzl-icon":m},d([b()],_.prototype,"title",2),d([b()],_.prototype,"description",2),d([b({reflect:!0})],_.prototype,"status",2),d([f()],_.prototype,"_context",2),class extends t{constructor(){super(...arguments),this._previousClampedCurrentIndex=void 0,this._stepsLightDomObserver=void 0,this.type="default",this.direction="horizontal",this.labelPlacement="horizontal",this.current=0,this.status="process",this.handleSlotChange=()=>{this.syncToSteps()}}get stepElements(){return[...this.querySelectorAll(":scope > bzl-step")]}get stepCount(){return this.stepElements.length}normalizeCurrentStep(){var e=Number(this.current);return Number.isFinite(e)?Math.floor(e):1}get clampedCurrentIndex(){return this.getClampedCurrentIndex(this.stepCount)}getClampedCurrentIndex(e){var t;return 0===e||(t=this.normalizeCurrentStep())<=0?-1:e<t?e:t-1}computeEffectiveStatus(e,t,i,o){return e.hasUserStatusOverride?e.status:t<i?"finish":i<t?"wait":o}buildContext(e,t,i,o,r,a,n,s){return{index:e,isCurrent:0<=t&&t<i&&e===t,effectiveStatus:o,stepsType:r,direction:a,labelPlacement:n,isLast:s}}connectedCallback(){super.connectedCallback(),this._stepsLightDomObserver=new MutationObserver(()=>{this.syncToSteps()}),this._stepsLightDomObserver.observe(this,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["status"]})}disconnectedCallback(){var e;null!=(e=this._stepsLightDomObserver)&&e.disconnect(),this._stepsLightDomObserver=void 0,this._previousClampedCurrentIndex=void 0,super.disconnectedCallback()}notifyCurrentStepChangeIfNeeded(){var e=this.clampedCurrentIndex;void 0===this._previousClampedCurrentIndex?this._previousClampedCurrentIndex=e:this._previousClampedCurrentIndex!==e&&(this._previousClampedCurrentIndex=e,this.emit("bzl-change"))}syncToSteps(){var t=this.stepElements,i=t.length,o=this.getClampedCurrentIndex(i),r=this.type,a=this.direction,n=this.labelPlacement,s=this.status,l=i-1;for(let e=0;e<i;e+=1){var c=t[e],d=this.computeEffectiveStatus(c,e,o,s),d=this.buildContext(e,o,i,d,r,a,n,e===l);c.applyContextFromParent(d)}this.notifyCurrentStepChangeIfNeeded()}updated(e){super.updated(e),(e.has("current")||e.has("status")||e.has("direction")||e.has("type")||e.has("labelPlacement"))&&this.syncToSteps()}render(){return h`
      <div
        part="base"
        class=${v({steps:!0,"steps--horizontal":"horizontal"===this.direction,"steps--vertical":"vertical"===this.direction,"steps--default":"default"===this.type,"steps--dot":"dot"===this.type})}
        data-current-index=${0<this.stepCount?String(this.clampedCurrentIndex):""}
      >
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}}),yo=(n.styles=[u,s],n.dependencies={"bzl-step":_},d([b({reflect:!0})],n.prototype,"type",2),d([b({reflect:!0})],n.prototype,"direction",2),d([b({reflect:!0,attribute:"label-placement"})],n.prototype,"labelPlacement",2),d([b({type:Number,reflect:!0})],n.prototype,"current",2),d([b({reflect:!0})],n.prototype,"status",2),n),O=(n.define("bzl-steps"),o`
  :host([size='small']) {
    --height: 16px;
    --thumb-size: 12px;
    --width: 28px;
    font-size: var(--bzl-input-font-size-small);
  }

  :host([size='medium']) {
    --height: 20px;
    --thumb-size: 16px;
    --width: 36px;
    font-size: var(--bzl-input-font-size-medium);
  }

  :host {
    display: inline-block;
    vertical-align: middle;
    line-height: 0;
  }

  .switch {
    position: relative;
    display: inline-flex;
    align-items: center;
    cursor: pointer;
  }

  .switch__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--width);
    height: var(--height);
    background-color: var(--bzl-color-neutral-500);
    border-radius: var(--height);
    transition: var(--bzl-transition-fast) background-color;
  }

  .switch__control .switch__thumb {
    width: var(--thumb-size);
    height: var(--thumb-size);
    line-height: var(--thumb-size);
    font-size: var(--thumb-size);
    background-color: var(--bzl-color-neutral-0);
    border-radius: 50%;
    translate: calc((var(--width) - var(--height)) / -2);
    transition:
      var(--bzl-transition-fast) translate ease,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) box-shadow;
  }

  .switch__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Checked */
  .switch--checked .switch__control {
    background-color: var(--bzl-color-primary-600);
  }

  .switch--checked .switch__control .switch__thumb {
    background-color: var(--bzl-color-neutral-0);
    translate: calc((var(--width) - var(--height)) / 2);
  }

  /* Checked + hover */
  .switch.switch--checked:not(.switch--disabled) .switch__control:hover {
    background-color: var(--bzl-color-primary-600);
  }

  .switch.switch--checked:not(.switch--disabled) .switch__control:hover .switch__thumb {
    background-color: var(--bzl-color-neutral-0);
  }

  /* Checked + focus */
  .switch.switch--checked:not(.switch--disabled) .switch__input:focus-visible ~ .switch__control {
    background-color: var(--bzl-color-primary-600);
  }

  /* Disabled */
  .switch--disabled {
    cursor: not-allowed;
  }

  .switch--disabled .switch__control {
    background-color: var(--bzl-color-neutral-300);
  }

  .switch--disabled.switch--checked .switch__control {
    background-color: var(--bzl-color-primary-300);
  }
`),s=class extends t{constructor(){super(...arguments),this.title="",this.name="",this.size="medium",this.disabled=!1,this.loading=!1,this.checked=!1}handleBlur(){this.emit("bzl-blur")}handleInput(){this.emit("bzl-input")}handleClick(){this.disabled||this.loading||(this.checked=!this.checked,this.emit("bzl-change"))}handleFocus(){this.emit("bzl-focus")}handleKeyDown(e){this.disabled||this.loading||("ArrowLeft"===e.key&&(e.preventDefault(),this.checked=!1,this.emit("bzl-change"),this.emit("bzl-input")),"ArrowRight"===e.key&&(e.preventDefault(),this.checked=!0,this.emit("bzl-change"),this.emit("bzl-input")))}handleCheckedChange(){this.input.checked=this.checked}click(){this.input.click()}focus(e){this.input.focus(e)}blur(){this.input.blur()}render(){return h`
      <label
        part="base"
        class=${v({switch:!0,"switch--checked":this.checked,"switch--disabled":this.disabled||this.loading,"switch--small":"small"===this.size,"switch--medium":"medium"===this.size})}
      >
        <input
          class="switch__input"
          type="checkbox"
          title=${this.title}
          name=${this.name}
          value=${D(this.value)}
          .checked=${ro(this.checked)}
          .disabled=${this.disabled||this.loading}
          role="switch"
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
          @keydown=${this.handleKeyDown}
        />

        <span part="control" class="switch__control">
          <span part="thumb" class="switch__thumb">
            ${this.loading?h`<bzl-spin size="xsmall" style="--spin-font-size: var(--thumb-size)">
                  ${this.checked?null:h`<bzl-icon slot="icon" type="library" name="gray-loading-face"></bzl-icon>`}
                </bzl-spin>`:null}
          </span>
        </span>
      </label>
    `}},zo=(s.styles=[u,O],s.dependencies={"bzl-spin":x},d([g('input[type="checkbox"]')],s.prototype,"input",2),d([b()],s.prototype,"title",2),d([b()],s.prototype,"name",2),d([b()],s.prototype,"value",2),d([b({reflect:!0})],s.prototype,"size",2),d([b({type:Boolean,reflect:!0})],s.prototype,"disabled",2),d([b({type:Boolean,reflect:!0})],s.prototype,"loading",2),d([b({type:Boolean,reflect:!0})],s.prototype,"checked",2),d([p("checked",{waitUntilFirstUpdate:!0})],s.prototype,"handleCheckedChange",1),s),n=(s.define("bzl-switch"),o`
  :host {
    display: inline-block;
    --bzl-tag-height-large: 28px;
    --bzl-tag-height-medium: 24px;
    --bzl-tag-height-small: 20px;
    --bzl-tag-height-xsmall: 16px;
  }

  .tag {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    border: solid 1px;
    white-space: nowrap;
    user-select: none;
    -webkit-user-select: none;
  }

  .tag__prefix {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }

  .tag__prefix bzl-icon {
    font-size: 1em;
  }

  .tag--has-prefix .tag__prefix {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .tag__remove {
    margin-inline-start: var(--bzl-spacing-2);
    cursor: pointer;
  }

  .tag--xsmall .tag__remove {
    margin-inline-start: var(--bzl-spacing-1);
  }

  .tag__remove::part(base) {
    padding: 0;
  }

  /*
   * Variant default: 600 底、白字（color default 为中性灰）
   */

  .tag--boss.tag--variant-default {
    background-color: var(--bzl-color-boss-600);
    border-color: var(--bzl-color-boss-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--red.tag--variant-default {
    background-color: var(--bzl-color-red-600);
    border-color: var(--bzl-color-red-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--orange.tag--variant-default {
    background-color: var(--bzl-color-orange-600);
    border-color: var(--bzl-color-orange-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--green.tag--variant-default {
    background-color: var(--bzl-color-green-600);
    border-color: var(--bzl-color-green-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--blue.tag--variant-default {
    background-color: var(--bzl-color-blue-600);
    border-color: var(--bzl-color-blue-600);
    color: var(--bzl-color-neutral-0);
  }

  .tag--default.tag--variant-default {
    background-color: var(--bzl-color-neutral-200);
    border-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Variant filled: 100 底、700 字
   */

  .tag--boss.tag--variant-filled {
    background-color: var(--bzl-color-boss-100);
    border-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
  }

  .tag--red.tag--variant-filled {
    background-color: var(--bzl-color-red-100);
    border-color: var(--bzl-color-red-100);
    color: var(--bzl-color-red-700);
  }

  .tag--orange.tag--variant-filled {
    background-color: var(--bzl-color-orange-100);
    border-color: var(--bzl-color-orange-100);
    color: var(--bzl-color-orange-700);
  }

  .tag--green.tag--variant-filled {
    background-color: var(--bzl-color-green-100);
    border-color: var(--bzl-color-green-100);
    color: var(--bzl-color-green-700);
  }

  .tag--blue.tag--variant-filled {
    background-color: var(--bzl-color-blue-100);
    border-color: var(--bzl-color-blue-100);
    color: var(--bzl-color-blue-700);
  }

  .tag--default.tag--variant-filled {
    background-color: var(--bzl-color-neutral-200);
    border-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Variant lined: 白底、700 字、1px 500 边框（color default 为中性灰）
   */

  .tag--boss.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-boss-500);
    color: var(--bzl-color-boss-700);
  }

  .tag--red.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-red-500);
    color: var(--bzl-color-red-700);
  }

  .tag--orange.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-orange-500);
    color: var(--bzl-color-orange-700);
  }

  .tag--green.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-green-500);
    color: var(--bzl-color-green-700);
  }

  .tag--blue.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-blue-500);
    color: var(--bzl-color-blue-700);
  }

  .tag--default.tag--variant-lined {
    background-color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-neutral-500);
    color: var(--bzl-color-neutral-800);
  }

  /*
   * Removable icon: 500 默认、900 hover（color default 为中性色阶）
   */

  .tag--removable .tag__remove {
    color: var(--bzl-color-boss-700);
  }

  .tag--removable.tag--boss .tag__remove:hover {
    color: var(--bzl-color-boss-900);
  }

  .tag--removable.tag--red .tag__remove {
    color: var(--bzl-color-red-700);
  }

  .tag--removable.tag--red .tag__remove:hover {
    color: var(--bzl-color-red-900);
  }

  .tag--removable.tag--orange .tag__remove {
    color: var(--bzl-color-orange-700);
  }

  .tag--removable.tag--orange .tag__remove:hover {
    color: var(--bzl-color-orange-900);
  }

  .tag--removable.tag--green .tag__remove {
    color: var(--bzl-color-green-700);
  }

  .tag--removable.tag--green .tag__remove:hover {
    color: var(--bzl-color-green-900);
  }

  .tag--removable.tag--blue .tag__remove {
    color: var(--bzl-color-blue-700);
  }

  .tag--removable.tag--blue .tag__remove:hover {
    color: var(--bzl-color-blue-900);
  }

  .tag--removable.tag--default .tag__remove {
    color: var(--bzl-color-neutral-700);
  }

  .tag--removable.tag--default .tag__remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  /*
   * 当默认色为白色时，hover 不切换到 900。
   */
  .tag--removable.tag--variant-default.tag--boss .tag__remove,
  .tag--removable.tag--variant-default.tag--red .tag__remove,
  .tag--removable.tag--variant-default.tag--orange .tag__remove,
  .tag--removable.tag--variant-default.tag--green .tag__remove,
  .tag--removable.tag--variant-default.tag--blue .tag__remove,
  .tag--removable.tag--variant-default.tag--boss .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--red .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--orange .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--green .tag__remove:hover,
  .tag--removable.tag--variant-default.tag--blue .tag__remove:hover {
    color: var(--bzl-color-neutral-0);
  }

  /*
   * Size modifiers（高度/行高/字号/水平内边距）
   */

  .tag--large {
    border-radius: var(--bzl-border-radius-small);
    font-size: var(--bzl-font-size-small);
    height: var(--bzl-tag-height-large);
    line-height: var(--bzl-tag-height-large);
    padding: 0 var(--bzl-spacing-4);
  }

  .tag--medium,
  .tag--small,
  .tag--xsmall {
    border-radius: var(--bzl-border-radius-x-small);
  }

  .tag--medium {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-medium);
    line-height: var(--bzl-tag-height-medium);
    padding: 0 var(--bzl-spacing-4);
  }

  .tag--small {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-small);
    line-height: var(--bzl-tag-height-small);
    padding: 0 var(--bzl-spacing-3);
  }

  .tag--xsmall {
    font-size: var(--bzl-font-size-2x-small);
    height: var(--bzl-tag-height-xsmall);
    line-height: var(--bzl-tag-height-xsmall);
    padding: 0 var(--bzl-spacing-3);
  }

  /*
   * Pill modifier
   */

  .tag--pill {
    border-radius: var(--bzl-border-radius-pill);
  }
`),O=class extends t{constructor(){super(...arguments),this.color="default",this.size="medium",this.variant="default",this.pill=!1,this.removable=!1,this.handlePrefixSlotChange=()=>this.requestUpdate()}firstUpdated(e){super.firstUpdated(e),null!=(e=this.prefixSlot)&&e.addEventListener("slotchange",this.handlePrefixSlotChange),this.requestUpdate()}disconnectedCallback(){var e;null!=(e=this.prefixSlot)&&e.removeEventListener("slotchange",this.handlePrefixSlotChange),super.disconnectedCallback()}get hasPrefixContent(){var e=this.prefixSlot;return!!e&&e.assignedNodes({flatten:!0}).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&Boolean(null==(e=e.textContent)?void 0:e.trim()))}handleRemoveClick(){this.emit("bzl-remove")}render(){return h`
      <span
        part="base"
        class=${v({tag:!0,["tag--"+this.color]:!0,["tag--"+this.size]:!0,["tag--variant-"+this.variant]:!0,"tag--has-prefix":this.hasPrefixContent,"tag--pill":this.pill,"tag--removable":this.removable})}
      >
        <span part="prefix" class="tag__prefix">
          <slot name="prefix"></slot>
        </span>
        <slot part="content" class="tag__content"></slot>

        ${this.removable?h`
              <bzl-icon
                part="remove-button"
                class="tag__remove"
                name="improper-outline"
                tabindex="-1"
                @click=${this.handleRemoveClick}
              ></bzl-icon>
            `:""}
      </span>
    `}},_o=(O.styles=[u,n],O.dependencies={"bzl-icon":m},d([b({reflect:!0})],O.prototype,"color",2),d([b({reflect:!0})],O.prototype,"size",2),d([b({reflect:!0})],O.prototype,"variant",2),d([b({type:Boolean,reflect:!0})],O.prototype,"pill",2),d([b({type:Boolean})],O.prototype,"removable",2),d([g('slot[name="prefix"]')],O.prototype,"prefixSlot",2),O),xo=(O.define("bzl-tag"),x),wo=(x.define("bzl-spin"),_),s=(_.define("bzl-step"),o`
  :host {
    display: inline-block;
    line-height: 0;
  }

  :host(:focus-visible) {
    outline: 0px;
  }

  .radio {
    display: inline-flex;
    align-items: center;
    --toggle-size: var(--bzl-toggle-size-medium);
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-input-font-size-medium);
    font-weight: var(--bzl-input-font-weight);
    color: var(--bzl-input-label-color);
    vertical-align: middle;
    cursor: pointer;
  }

  .radio__checked-icon {
    display: block;
    width: var(--bzl-spacing-3);
    height: var(--bzl-spacing-3);
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-neutral-0);
  }

  .radio__control {
    flex: 0 0 auto;
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    border: solid var(--bzl-toggle-border-width) var(--bzl-color-neutral-400);
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-neutral-0);
    box-sizing: border-box;
    color: transparent;
    transition:
      var(--bzl-transition-fast) border-color,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) box-shadow;
  }

  .radio__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  /* Hover (unchecked: border only) */
  .radio:not(.radio--checked):not(.radio--disabled) .radio__control:hover {
    border-color: var(--bzl-color-primary-700);
  }

  /* Checked */
  .radio--checked .radio__control {
    color: var(--bzl-color-neutral-0);
    border-color: var(--bzl-color-primary-600);
    background-color: var(--bzl-color-primary-600);
  }

  /* Checked + hover */
  .radio.radio--checked:not(.radio--disabled) .radio__control:hover {
    border-color: var(--bzl-color-primary-700);
    background-color: var(--bzl-color-primary-700);
  }

  /* Checked + focus */
  :host(:focus-visible) .radio__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Disabled */
  .radio--disabled {
    cursor: not-allowed;
  }

  .radio--disabled .radio__control {
    border-color: var(--bzl-color-neutral-400);
    background-color: var(--bzl-color-neutral-200);
  }

  .radio--disabled.radio--checked .radio__control {
    background-color: var(--bzl-color-neutral-400);
  }

  .radio--disabled .radio__label {
    color: var(--bzl-color-neutral-600);
  }

  .radio__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    line-height: var(--bzl-line-height-dense);
    margin-inline-start: var(--bzl-spacing-4);
    user-select: none;
    -webkit-user-select: none;
  }
`),n=class extends t{constructor(){super(),this.checked=!1,this.hasFocus=!1,this.disabled=!1,this.handleBlur=()=>{this.hasFocus=!1,this.emit("bzl-blur")},this.handleClick=()=>{this.disabled||(this.checked=!0)},this.handleFocus=()=>{this.hasFocus=!0,this.emit("bzl-focus")},this.addEventListener("blur",this.handleBlur),this.addEventListener("click",this.handleClick),this.addEventListener("focus",this.handleFocus)}connectedCallback(){super.connectedCallback(),this.setInitialAttributes()}setInitialAttributes(){this.setAttribute("role","radio"),this.setAttribute("tabindex","-1"),this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleCheckedChange(){this.setAttribute("aria-checked",this.checked?"true":"false"),this.setAttribute("tabindex",this.checked?"0":"-1")}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}render(){return h`
      <span
        part="base"
        class=${v({radio:!0,"radio--checked":this.checked,"radio--disabled":this.disabled,"radio--focused":this.hasFocus})}
      >
        <span part="${"control"+(this.checked?" control--checked":"")}" class="radio__control">
          ${this.checked?h`<span part="checked-icon" class="radio__checked-icon"></span>`:""}
        </span>

        <slot part="label" class="radio__label"></slot>
      </span>
    `}},ko=(n.styles=[u,s],d([f()],n.prototype,"checked",2),d([f()],n.prototype,"hasFocus",2),d([b()],n.prototype,"value",2),d([b({type:Boolean,reflect:!0})],n.prototype,"disabled",2),d([p("checked")],n.prototype,"handleCheckedChange",1),d([p("disabled",{waitUntilFirstUpdate:!0})],n.prototype,"handleDisabledChange",1),n),O=(n.define("bzl-radio"),o`
  :host {
    display: inline-block;
  }

  .radio-group {
    display: inline-flex;
    gap: var(--bzl-spacing-8);
  }
`),_=o`
  .form-control .form-control__label {
    display: none;
  }

  .form-control .form-control__help-text {
    display: none;
  }

  /* Label */
  .form-control--has-label .form-control__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    margin-bottom: var(--bzl-spacing-1);
  }

  .form-control--has-label.form-control--small .form-control__label {
    font-size: var(--bzl-input-label-font-size-small);
  }

  .form-control--has-label.form-control--medium .form-control__label {
    font-size: var(--bzl-input-label-font-size-medium);
  }

  .form-control--has-label.form-control--large .form-control__label {
    font-size: var(--bzl-input-label-font-size-large);
  }

  :host([required]) .form-control--has-label .form-control__label::after {
    content: var(--bzl-input-required-content);
    margin-inline-start: var(--bzl-input-required-content-offset);
    color: var(--bzl-input-required-content-color);
  }

  /* Help text */
  .form-control--has-help-text .form-control__help-text {
    display: block;
    color: var(--bzl-input-help-text-color);
    margin-top: var(--bzl-spacing-1);
    line-height: var(--bzl-input-help-text-line-height);
    padding-left: var(--bzl-spacing-4);
  }

  .form-control--has-help-text.form-control--small .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-small);
  }

  .form-control--has-help-text.form-control--medium .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-medium);
  }

  .form-control--has-help-text.form-control--large .form-control__help-text {
    font-size: var(--bzl-input-help-text-font-size-large);
  }

  .form-control--has-help-text.form-control--radio-group .form-control__help-text {
    margin-top: var(--bzl-spacing-2);
  }
`,s=class extends t{constructor(){super(...arguments),this.name="option",this.value=""}getAllRadios(){return[...this.querySelectorAll("bzl-radio")]}handleRadioClick(e){let t=e.target.closest("bzl-radio");var e=this.getAllRadios(),i=this.value;t&&!t.disabled&&(this.value=t.value,e.forEach(e=>e.checked=e===t),this.value!==i)&&(this.emit("bzl-change"),this.emit("bzl-input"))}handleKeyDown(t){if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(t.key)){var i=this.getAllRadios().filter(e=>!e.disabled),o=null!=(o=i.find(e=>e.checked))?o:i[0],r=" "===t.key?0:["ArrowUp","ArrowLeft"].includes(t.key)?-1:1,a=this.value;let e=i.indexOf(o)+r;(e=e<0?i.length-1:e)>i.length-1&&(e=0),this.getAllRadios().forEach(e=>{e.checked=!1,e.setAttribute("tabindex","-1")}),this.value=i[e].value,i[e].checked=!0,i[e].setAttribute("tabindex","0"),i[e].focus(),this.value!==a&&(this.emit("bzl-change"),this.emit("bzl-input")),t.preventDefault()}}async syncRadioElements(){var e=this.getAllRadios();await Promise.all(e.map(async e=>{await e.updateComplete,e.checked=e.value===this.value})),0<e.length&&!e.some(e=>e.checked)&&e[0].setAttribute("tabindex","0")}syncRadios(){customElements.get("bzl-radio")?this.syncRadioElements():customElements.whenDefined("bzl-radio").then(()=>this.syncRadios())}updateCheckedRadio(){this.getAllRadios().forEach(e=>e.checked=e.value===this.value)}handleValueChange(){this.hasUpdated&&this.updateCheckedRadio()}render(){return h`
      <div part="base" class="radio-group">
        <slot @slotchange=${this.syncRadios} @click=${this.handleRadioClick} @keydown=${this.handleKeyDown}></slot>
      </div>
    `}},Co=(s.styles=[u,_,O],d([g("slot:not([name])")],s.prototype,"defaultSlot",2),d([b()],s.prototype,"name",2),d([b({reflect:!0})],s.prototype,"value",2),d([p("value")],s.prototype,"handleValueChange",1),s),n=(s.define("bzl-radio-group"),o`
  :host {
    display: block;
  }

  /** The popup */
  .select {
    flex: 1 1 0;
    display: inline-flex;
    width: 100%;
    position: relative;
    vertical-align: middle;
  }

  .select::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .select[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .select[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox */
  .select__combobox {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    line-height: var(--bzl-line-height-2x-loose);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    /* Medium size styles (default) - previously .select--medium */
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-small);
    box-sizing: border-box;
    min-height: var(--bzl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--bzl-input-spacing-medium);
  }

  .select__display-input {
    position: relative;
    width: 100%;
    font: inherit;
    border: none;
    background: none;
    color: var(--bzl-input-color);
    cursor: inherit;
    overflow: hidden;
    padding: 0;
    margin: 0;
    -webkit-appearance: none;
  }

  :host([filterable]) .select__combobox {
    cursor: text;
  }

  .select__display-input::placeholder {
    color: var(--bzl-input-placeholder-color);
  }

  .select:not(.select--disabled):hover .select__display-input {
    color: var(--bzl-input-color-hover);
  }

  .select__display-input:focus {
    outline: none;
  }

  /* Visually hide the display input when multiple is enabled */
  .select--multiple:not(.select--placeholder-visible) .select__display-input {
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  }

  :host([filterable]) .select--multiple .select__display-input {
    position: relative;
    z-index: auto;
    top: auto;
    left: auto;
    width: 0;
    min-width: var(--bzl-select-filter-input-min-width, 24px);
    flex: 1 1 0;
    opacity: 1;
  }

  :host([filterable]) .select--multiple .select__tags--with-input {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
  }

  /* 多选 + 可搜索：未选任何项时仅有输入框，无 tag，去掉与 .select__tags 一致的左侧 margin 避免错位 */
  :host([filterable]) .select--multiple .select__tags--with-input:not(:has(.select__tag)) {
    margin-inline-start: 0;
  }

  .select__value-input {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    opacity: 0;
    z-index: -1;
  }

  .select__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--bzl-input-padding-leftright);
    gap: 4px;
    /* padding-block: 5px; */
  }

  .select__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-1);
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-900);
    border: none;
    border-radius: var(--bzl-border-radius-small);
    padding-inline: var(--bzl-spacing-4);
    padding-block: var(--bzl-spacing-1);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-spacing-7);
    cursor: pointer;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color;
  }

  .select__tag:hover {
    background-color: var(--bzl-color-neutral-300);
  }

  /* “+n” 汇总 Tag，仅展示不可移除 */
  .select__tag--collapse {
    cursor: default;
  }

  .select__tag--collapse:hover {
    background-color: var(--bzl-color-neutral-200);
  }

  .select--disabled .select__tag {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .select__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    padding: 0;
    margin: 0;
    cursor: pointer;
    color: var(--bzl-color-neutral-700);
    width: 12px;
    height: 12px;
    transition: var(--bzl-transition-fast) color;
  }

  .select__tag-remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  .select__tag-remove:focus {
    outline: none;
  }

  /* NOTE: Size-specific tag styles removed - currently only supports medium size.
     To re-enable size support:
     - Restore .select__tag--small, .select__tag--medium, .select__tag--large classes
     - Apply them conditionally in select.component.ts render() method */

  /* Standard selects */
  .select--standard .select__combobox {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .select--standard:not(.select--disabled) .select__combobox:hover {
    border-color: var(--bzl-color-primary-700);
  }

  .select--standard:not(.select--disabled) .select__combobox:hover .select__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .select--standard:not(.select--disabled).select--open .select__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .select--standard.select--disabled .select__combobox {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    color: var(--bzl-input-color-disabled);
    opacity: 0.5;
    cursor: not-allowed;
    outline: none;
  }

  .select--standard:not(.select--disabled).select--open .select__combobox,
  .select--standard:not(.select--disabled).select--focused .select__combobox {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: var(--bzl-shadow-focus);
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .select--standard .select__combobox {
    border-color: var(--bzl-color-danger-600);
  }
  :host([data-user-invalid]) .select--standard.select--focused:not(.select--disabled) .select__combobox,
  :host([data-user-invalid]) .select--standard.select--open:not(.select--disabled) .select__combobox {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }
  :host([data-user-invalid]) .select--standard:not(.select--disabled):hover .select__expand-icon {
    color: var(--bzl-color-danger-600);
  }

  :host([data-user-invalid]) .select--standard.select--open:not(.select--disabled) .select__expand-icon {
    color: var(--bzl-color-danger-600);
  }

  /* Size styles - currently only medium size is supported (applied as default above).
     To re-enable size support:
     1. Restore .select--small, .select--medium, .select--large classes below
     2. Move medium styles from .select__combobox to .select--medium .select__combobox
     3. Add size property back to select.component.ts
     4. Add size classes to classMap in render() method */

  /* Medium size spacing for prefix and multiple mode */
  .select__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .select--multiple:not(.select--placeholder-visible) .select__prefix::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .select--multiple:not(.select--placeholder-visible) .select__combobox {
    padding-inline-start: 0;
    /* 使用较小 padding 兼顾：1) 选择后高度不突变 2) tag 换行时与边框有间距 */
    padding-block: 5px;
  }

  /* Prefix */
  .select__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
  }

  /* NOTE: Suffix styles removed. To re-enable:
     - Restore .select__suffix styles (same as .select__prefix)
     - Restore .select__suffix::slotted(*) with margin-inline-start: var(--bzl-spacing-small)
     - Add suffix slot back to select.component.ts render() method */

  /* Clear button */
  .select__clear {
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
    display: none;
    /* Medium size spacing */
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .select__combobox:hover .select__clear {
    display: inline-flex;
  }

  .select__combobox:hover .select__clear ~ .select__expand-icon {
    display: none;
  }

  .select__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .select__clear:focus {
    outline: none;
  }

  /* Expand icon */
  .select__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--bzl-color-neutral-600);
    transition: var(--bzl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .select--open .select__expand-icon {
    rotate: -180deg;
  }

  /* Listbox */
  .select__listbox {
    display: block;
    position: relative;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-medium);
    font-weight: var(--bzl-font-weight-normal);
    box-shadow: var(--bzl-shadow-neutral-light);
    background: var(--bzl-panel-background-color);
    border: solid var(--bzl-panel-border-width) var(--bzl-color-neutral-300);
    border-radius: var(--bzl-border-radius-regular);
    padding: var(--bzl-spacing-2);
    overflow: auto;
    overscroll-behavior: none;

    /* Make sure it adheres to the popup's auto size */
    max-width: var(--auto-size-available-width);
    /* 默认最大高度约 5.5 个选项，选项高度 = line-height + padding-block */
    max-height: min(
      var(--auto-size-available-height),
      calc((var(--bzl-line-height-dense) + var(--bzl-spacing-5) * 2) * 5.5 + var(--bzl-spacing-2) * 2)
    );
  }

  /* 兼容存在 bzl-divider 的场景，实际上以后不再需要 */
  .select__listbox ::slotted(bzl-divider) {
    --spacing: var(--bzl-spacing-4);
  }

  .select__empty {
    font-size: var(--bzl-font-size-x-small);
    color: var(--bzl-color-neutral-700);
    line-height: var(--bzl-line-height-dense);
    padding-block: var(--bzl-spacing-5);
    text-align: center;
  }

  .select__loading {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--bzl-spacing-2);
    font-size: var(--bzl-font-size-x-small);
    color: var(--bzl-color-neutral-700);
    line-height: var(--bzl-line-height-dense);
    padding-block: var(--bzl-spacing-5);
  }

  .select__loading-icon {
    flex: none;
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-neutral-600);
    --internal-spin-speed: var(--spin-speed, 1s);
    animation: spin var(--internal-spin-speed) linear infinite;
  }

  /* 与 bzl-option 内 .option 基准样式对齐（见 option.styles.ts） */
  .select__create {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    font-weight: var(--bzl-font-weight-normal);
    line-height: var(--bzl-line-height-dense);
    letter-spacing: var(--bzl-letter-spacing-normal);
    color: var(--bzl-color-neutral-1000);
    background-color: var(--bzl-color-neutral-100);
    padding: var(--bzl-spacing-5) var(--bzl-scene-padding-11);
    border: none;
    border-radius: var(--bzl-border-radius-small);
    cursor: pointer;
    text-align: start;
    margin-block-end: var(--bzl-spacing-1);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) background-color;
  }

  .select__create:hover {
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-1000);
  }

  .select__listbox ::slotted(small) {
    display: block;
    font-size: var(--bzl-font-size-small);
    font-weight: var(--bzl-font-weight-semibold);
    color: var(--bzl-color-neutral-500);
    padding-block: var(--bzl-spacing-2);
    padding-inline: var(--bzl-spacing-8);
  }

  .select__listbox ::slotted(bzl-option:not(:last-of-type)) {
    margin-block-end: var(--bzl-spacing-1);
  }

  .select__listbox ::slotted(bzl-option[hidden]) {
    display: none !important;
  }

  /* 加载中仅展示加载行，避免远程模式下旧列表仍全部可见 */
  .select__listbox--loading ::slotted(bzl-option),
  .select__listbox--loading ::slotted(bzl-divider),
  .select__listbox--loading ::slotted(small) {
    display: none !important;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`);var $o=new Set;function So(t){if($o.add(t),!document.documentElement.classList.contains("bzl-scroll-lock")){t=document.documentElement.clientWidth;t=Math.abs(window.innerWidth-t)+(t=Number(getComputedStyle(document.body).paddingRight.replace(/px/,"")),isNaN(t)||!t?0:t);let e=getComputedStyle(document.documentElement).scrollbarGutter;e&&"auto"!==e||(e="stable"),t<2&&(e=""),document.documentElement.style.setProperty("--bzl-scroll-lock-gutter",e),document.documentElement.classList.add("bzl-scroll-lock"),document.documentElement.style.setProperty("--bzl-scroll-lock-size",t+"px")}}function Eo(e){$o.delete(e),0===$o.size&&(document.documentElement.classList.remove("bzl-scroll-lock"),document.documentElement.style.removeProperty("--bzl-scroll-lock-size"))}function Ao(e,t,i="vertical",o="smooth"){r=e,a=t;var r={top:Math.round(r.getBoundingClientRect().top-a.getBoundingClientRect().top),left:Math.round(r.getBoundingClientRect().left-a.getBoundingClientRect().left)},a=r.top+t.scrollTop,r=r.left+t.scrollLeft,n=t.scrollLeft+t.offsetWidth,s=t.scrollTop,l=t.scrollTop+t.offsetHeight;"horizontal"!==i&&"both"!==i||(r<t.scrollLeft?t.scrollTo({left:r,behavior:o}):r+e.clientWidth>n&&t.scrollTo({left:r-t.offsetWidth+e.clientWidth,behavior:o})),"vertical"!==i&&"both"!==i||(a<s?t.scrollTo({top:a,behavior:o}):a+e.clientHeight>l&&t.scrollTo({top:a-t.offsetHeight+e.clientHeight,behavior:o}))}var O=class extends r{constructor(e){if(super(e),this.it=l,e.type!==lt)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(e){if(e===l||null==e)return this._t=void 0,this.it=e;if(e===c)return e;if("string"!=typeof e)throw Error(this.constructor.directiveName+"() called with a non-string value");return e===this.it?this._t:(e=[this.it=e],this._t={_$litType$:this.constructor.resultType,strings:e.raw=e,values:[]})}},To=(O.directiveName="unsafeHTML",O.resultType=1,De(O)),s=class extends t{constructor(){super(...arguments),this.typeToSelectString="",this.hasReachedBottom=!1,this.hasFocus=!1,this.displayLabel="",this.selectedOptions=[],this.query="",this.filterComposing=!1,this.filterComposingBuffer="",this.hasOptions=!1,this.hasVisibleOptions=!1,this.name="",this.value="",this.placeholder="",this.multiple=!1,this.maxOptionsVisible=2,this.collapseTags=!1,this.disabled=!1,this.clearable=!1,this.filterable=!1,this.remote=!1,this.loading=!1,this.loadingText="搜索中",this.allowCreate=!1,this.open=!1,this.hoist=!1,this.placement="bottom",this.getTag=e=>h`
    <span part="tag__content" class="select__tag-content">${e.getTextLabel()}</span>
  `,this.handleDocumentFocusIn=e=>{e=e.composedPath();this&&!e.includes(this)&&this.hide()},this.handleDocumentKeyDown=t=>{var i=t.target,o=null!==i.closest(".select__clear"),r=null!==i.closest("bzl-icon-button"),i=null!==i.closest(".select__tag-remove");if(!(o||r||i)&&("Escape"===t.key&&this.open&&!this.closeWatcher&&(t.preventDefault(),t.stopPropagation(),this.hide(),this.displayInput.focus({preventScroll:!0})),!this.filterable||!t.isComposing&&!this.filterComposing||"Enter"!==t.key&&!["ArrowUp","ArrowDown","Home","End"].includes(t.key))){if("Enter"===t.key||!this.filterable&&" "===t.key&&""===this.typeToSelectString)return t.preventDefault(),t.stopImmediatePropagation(),this.open?void(this.currentOption&&!this.currentOption.disabled?this.selectOption(this.currentOption):"Enter"===t.key&&this.shouldShowCreateOption()&&(o=this.createOptionFromQuery())&&!o.disabled&&this.selectOption(o)):void this.show();if(["ArrowUp","ArrowDown","Home","End"].includes(t.key)){r=this.getNavigableOptions(),i=this.currentOption?r.indexOf(this.currentOption):-1;let e=Math.max(0,i);if(t.preventDefault(),!this.open&&(this.show(),this.currentOption))return;"ArrowDown"===t.key?(e=i+1)>r.length-1&&(e=0):"ArrowUp"===t.key?(e=i-1)<0&&(e=r.length-1):"Home"===t.key?e=0:"End"===t.key&&(e=r.length-1),this.setCurrentOption(null!=(o=r[e])?o:null)}if(!this.filterable&&(t.key&&1===t.key.length||"Backspace"===t.key)){i=this.getAllOptions();if(!(t.metaKey||t.ctrlKey||t.altKey)){if(!this.open){if("Backspace"===t.key)return;this.show()}t.stopPropagation(),t.preventDefault(),clearTimeout(this.typeToSelectTimeout),this.typeToSelectTimeout=window.setTimeout(()=>this.typeToSelectString="",1e3),"Backspace"===t.key?this.typeToSelectString=this.typeToSelectString.slice(0,-1):this.typeToSelectString+=t.key.toLowerCase();for(var e of i)if(e.getTextLabel().toLowerCase().startsWith(this.typeToSelectString)){this.setCurrentOption(e);break}}}}},this.handleDocumentMouseDown=e=>{e=e.composedPath();this&&!e.includes(this)&&this.hide()}}connectedCallback(){super.connectedCallback(),setTimeout(()=>{this.handleDefaultSlotChange()})}disconnectedCallback(){super.disconnectedCallback(),this.cancelScheduledRemoteSearch()}addOpenListeners(){var e;document.addEventListener("focusin",this.handleDocumentFocusIn),document.addEventListener("keydown",this.handleDocumentKeyDown),document.addEventListener("mousedown",this.handleDocumentMouseDown),this.getRootNode()!==document&&this.getRootNode().addEventListener("focusin",this.handleDocumentFocusIn),"CloseWatcher"in window&&(null!=(e=this.closeWatcher)&&e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.open&&(this.hide(),this.displayInput.focus({preventScroll:!0}))})}removeOpenListeners(){var e;document.removeEventListener("focusin",this.handleDocumentFocusIn),document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),this.getRootNode()!==document&&this.getRootNode().removeEventListener("focusin",this.handleDocumentFocusIn),null!=(e=this.closeWatcher)&&e.destroy()}handleFocus(){this.hasFocus=!0,this.displayInput.setSelectionRange(0,0),this.emit("bzl-focus")}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}normalizeQuery(e){return e.trim()}isRemoteFilterActive(){return this.filterable&&this.remote&&"function"==typeof this.remoteMethod}cancelScheduledRemoteSearch(){void 0!==this.remoteSearchTimer&&(clearTimeout(this.remoteSearchTimer),this.remoteSearchTimer=void 0)}scheduleRemoteSearch(){if(this.cancelScheduledRemoteSearch(),this.isRemoteFilterActive()){let e=this.remoteMethod;this.remoteSearchTimer=window.setTimeout(()=>{this.remoteSearchTimer=void 0,e(this.normalizeQuery(this.query))},300)}}normalizeCreatedOptionValue(e){return e.replace(/ /g,"_")}syncCreatedOptionsFromValue(){if(this.allowCreate){let t=Array.isArray(this.value)?this.value:[this.value];this.getAllOptions().forEach(e=>{e.hasAttribute("data-created-option")&&!t.includes(e.value)&&e.remove()});let i=this.getAllOptions();t.forEach(t=>{var e;t&&!i.some(e=>e.value===t)&&((e=document.createElement("bzl-option")).value=t,e.textContent=t,e.setAttribute("data-created-option","true"),this.append(e))})}}getNavigableOptions(){return this.open&&this.loading?[]:this.getAllOptions().filter(e=>!e.hidden)}applyFilter(){var e=this.getAllOptions();let i=this.normalizeQuery(this.query),o=this.filterable&&""!==i&&!this.isRemoteFilterActive();this.hasOptions=0<e.length,e.forEach(e=>{var t;this.filterable&&o?(t=this.filterMethod?this.filterMethod(i,e):e.getTextLabel().toLowerCase().includes(i.toLowerCase()),e.hidden=!t):e.hidden=!1}),this.hasVisibleOptions=e.some(e=>!e.hidden),null!=(e=this.currentOption)&&e.hidden&&this.setCurrentOption(null)}clearQuery(){(this.query||this.filterComposing)&&(this.cancelScheduledRemoteSearch(),this.query="",this.filterComposing=!1,this.filterComposingBuffer="",this.applyFilter())}shouldShowCreateOption(){if(!this.filterable||!this.allowCreate)return!1;if(this.open&&this.loading)return!1;let t=this.normalizeQuery(this.query);var e;return!!t&&!(e=this.getAllOptions()).some(e=>e.getTextLabel().toLowerCase()===t.toLowerCase())&&!e.some(e=>e.value===t)}createOptionFromQuery(){var e=this.normalizeQuery(this.query);if(!e)return null;let t=this.normalizeCreatedOptionValue(e);var i=this.getAllOptions().find(e=>e.value===t);return i||((i=document.createElement("bzl-option")).value=t,i.textContent=e,i.setAttribute("data-created-option","true"),this.append(i),i)}selectOption(e){this.multiple?(this.toggleOptionSelection(e),this.clearQuery(),this.applyFilter(),this.setCurrentOption(null),this.displayInput.focus({preventScroll:!0})):(this.setSelectedOptions(e),this.clearQuery(),this.hide(),this.hasFocus=!1,this.displayInput.blur()),this.updateComplete.then(()=>{this.emit("bzl-input"),this.emit("bzl-change")})}syncFilterAfterQueryChange(){var e;this.applyFilter(),this.isRemoteFilterActive()?this.scheduleRemoteSearch():this.cancelScheduledRemoteSearch(),this.open?this.shouldShowCreateOption()?this.setCurrentOption(null):(e=this.getNavigableOptions()[0],this.setCurrentOption(null!=e?e:null)):this.show()}handleCompositionStart(){this.filterable&&!this.disabled&&(this.filterComposing=!0,this.filterComposingBuffer=this.displayInput.value)}handleCompositionEnd(){this.filterable&&!this.disabled&&(this.filterComposing=!1,this.filterComposingBuffer="",this.query=this.displayInput.value,this.syncFilterAfterQueryChange())}handleDisplayInput(e){var t;this.filterable&&!this.disabled&&(t=e.target,this.filterComposing||e.isComposing?(e.isComposing&&!this.filterComposing&&(this.filterComposing=!0),this.filterComposingBuffer=t.value):(this.query=t.value,this.syncFilterAfterQueryChange()))}handleCreateMouseDown(e){e.preventDefault(),e.stopPropagation()}handleCreateClick(e){e.preventDefault(),e.stopPropagation();e=this.createOptionFromQuery();e&&!e.disabled&&(this.applyFilter(),this.selectOption(e))}handleComboboxMouseDown(e){var t=e.composedPath(),i=t.some(e=>e instanceof Element&&"bzl-icon-button"===e.tagName.toLowerCase()),t=t.some(e=>e instanceof Element&&(null==(e=e.classList)?void 0:e.contains("select__tag-remove")));this.disabled||i||t||(e.preventDefault(),this.displayInput.focus({preventScroll:!0}),this.open=!this.open)}handleComboboxKeyDown(e){if(this.filterable&&e.target===this.displayInput){if("Tab"===e.key)return;if(!["Enter","Escape","ArrowUp","ArrowDown","Home","End"].includes(e.key))return}"Tab"!==e.key&&(e.stopPropagation(),this.handleDocumentKeyDown(e))}handleClearClick(e){e.stopPropagation(),""!==this.value&&(this.setSelectedOptions([]),this.displayInput.focus({preventScroll:!0}),this.updateComplete.then(()=>{this.emit("bzl-clear"),this.emit("bzl-input"),this.emit("bzl-change")}))}handleClearMouseDown(e){e.stopPropagation(),e.preventDefault()}handleOptionClick(e){e=e.target.closest("bzl-option");!e||this.disabled||e.disabled||e.hidden||this.selectOption(e)}handleListboxScroll(){var e=this.listbox.scrollTop+this.listbox.clientHeight>=this.listbox.scrollHeight-1;e&&!this.hasReachedBottom?(this.hasReachedBottom=!0,this.emit("bzl-reach-bottom")):e||(this.hasReachedBottom=!1)}handleDefaultSlotChange(){customElements.get("bzl-option")||customElements.whenDefined("bzl-option").then(()=>this.handleDefaultSlotChange()),this.syncCreatedOptionsFromValue();var e=this.getAllOptions();let t=Array.isArray(this.value)?this.value:[this.value],i=[];e.forEach(e=>i.push(e.value)),this.setSelectedOptions(e.filter(e=>t.includes(e.value))),this.applyFilter()}handleTagRemove(e,t){e&&"function"==typeof e.stopPropagation&&e.stopPropagation(),this.disabled||(this.toggleOptionSelection(t,!1),this.updateComplete.then(()=>{this.emit("bzl-input"),this.emit("bzl-change")}))}getAllOptions(){return[...this.querySelectorAll("bzl-option")]}setCurrentOption(e){this.getAllOptions().forEach(e=>{e.current=!1,e.tabIndex=-1}),e?((this.currentOption=e).current=!0,this.filterable?e.tabIndex=-1:(e.tabIndex=0,e.focus())):this.currentOption=void 0}setSelectedOptions(e){var t=this.getAllOptions(),e=Array.isArray(e)?e:[e];t.forEach(e=>e.selected=!1),e.length&&e.forEach(e=>e.selected=!0),this.selectionChanged()}toggleOptionSelection(e,t){e.selected=!0===t||!1===t?t:!e.selected,this.selectionChanged()}selectionChanged(){var e,t=this.getAllOptions();this.selectedOptions=t.filter(e=>e.selected),this.multiple?(this.value=this.selectedOptions.map(e=>e.value),this.displayLabel=""):(t=this.selectedOptions[0],this.value=null!=(e=null==t?void 0:t.value)?e:"",this.displayLabel=null!=(e=null==(e=null==t?void 0:t.getTextLabel)?void 0:e.call(t))?e:"")}get tags(){if(!this.multiple)return[];var e=this.selectedOptions.length,t=this.collapseTags&&0<this.maxOptionsVisible?this.maxOptionsVisible:e,i=Math.min(t,e),o=[];for(let e=0;e<i&&e<this.selectedOptions.length;e++){let t=this.selectedOptions[e];var r=this.getTag(t,e),r="string"==typeof r?h`${To(r)}`:r;o.push(h`
        <div part="tag" class="select__tag">
          ${r}
          <button
            part="tag__remove-button"
            class="select__tag-remove"
            type="button"
            aria-label="Remove"
            @click=${e=>{e.stopPropagation(),this.handleTagRemove(e,t)}}
          >
            <bzl-icon name="improper-outline" aria-hidden="true"></bzl-icon>
          </button>
        </div>
      `)}return this.collapseTags&&0<this.maxOptionsVisible&&e>this.maxOptionsVisible&&o.push(h`
        <div part="tag" class="select__tag select__tag--collapse">
          <span part="tag__content" class="select__tag-content">+${e-this.maxOptionsVisible}</span>
        </div>
      `),o}handleInvalid(){}handleDisabledChange(){this.disabled&&(this.open=!1,this.handleOpenChange(),this.clearQuery())}handleValueChange(){this.syncCreatedOptionsFromValue();var e=this.getAllOptions();let t=Array.isArray(this.value)?this.value:[this.value];this.setSelectedOptions(e.filter(e=>t.includes(e.value)))}handleFilterableChange(){this.typeToSelectString="",this.clearQuery(),this.applyFilter()}handleRemoteChange(){this.cancelScheduledRemoteSearch(),this.applyFilter()}async handleOpenChange(){var e,t;this.hasReachedBottom=!1,this.open&&!this.disabled?(this.setCurrentOption(null),this.emit("bzl-show"),this.addOpenListeners(),await E(this),this.listbox.hidden=!1,this.popup.active=!0,{keyframes:e,options:t}=T(this,"select.show",{dir:"ltr"}),await S(this.popup.popup,e,t),this.currentOption&&Ao(this.currentOption,this.listbox,"vertical","auto"),this.applyFilter(),this.filterable&&this.displayInput.focus({preventScroll:!0}),this.emit("bzl-after-show")):(this.emit("bzl-hide"),this.removeOpenListeners(),await E(this),{keyframes:e,options:t}=T(this,"select.hide",{dir:"ltr"}),await S(this.popup.popup,e,t),this.listbox.hidden=!0,this.popup.active=!1,this.clearQuery(),this.emit("bzl-after-hide"))}async show(){if(!this.open&&!this.disabled)return this.open=!0,Xi(this,"bzl-after-show");this.open=!1}async hide(){if(this.open&&!this.disabled)return this.open=!1,Xi(this,"bzl-after-hide");this.open=!1}focus(e){this.displayInput.focus(e)}blur(){this.displayInput.blur()}render(){var e=this.clearable&&!this.disabled&&0<this.value.length,t=this.multiple?0<this.selectedOptions.length:!!this.value,i=!!this.placeholder&&!t,o=this.open&&this.loading,r=this.shouldShowCreateOption(),a=!(o||this.hasOptions&&(this.hasVisibleOptions||r)),n=this.filterable&&this.open?this.filterComposing?this.filterComposingBuffer:this.query:this.displayLabel,t=this.multiple&&this.filterable&&t?"":this.placeholder,t=h`
      <input
        part="display-input"
        class="select__display-input"
        type="text"
        placeholder=${t}
        .disabled=${this.disabled}
        .value=${n}
        autocomplete="off"
        spellcheck="false"
        autocapitalize="off"
        ?readonly=${!this.filterable}
        aria-controls="listbox"
        aria-expanded=${this.open?"true":"false"}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex="0"
        @input=${this.handleDisplayInput}
        @compositionstart=${this.handleCompositionStart}
        @compositionend=${this.handleCompositionEnd}
        @focus=${this.handleFocus}
        @blur=${this.handleBlur}
      />
    `,n=this.multiple?h`<div part="tags" class="select__tags">${this.tags}</div>`:l,n=this.multiple?this.filterable?h`<div part="tags" class="select__tags select__tags--with-input">${this.tags}${t}</div>`:h`${t}${n}`:h`${t}`;return h`
      <bzl-popup
        class=${v({select:!0,"select--standard":!0,"select--open":this.open,"select--disabled":this.disabled,"select--multiple":this.multiple,"select--focused":this.hasFocus,"select--placeholder-visible":i,"select--top":"top"===this.placement,"select--bottom":"bottom"===this.placement})}
        placement=${this.placement}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        distance=${2}
        sync="width"
        auto-size="vertical"
        auto-size-padding="10"
      >
        <div
          part="combobox"
          class="select__combobox"
          slot="anchor"
          @keydown=${this.handleComboboxKeyDown}
          @mousedown=${this.handleComboboxMouseDown}
        >
          <slot part="prefix" name="prefix" class="select__prefix"></slot>

          ${n}

          <input
            class="select__value-input"
            type="text"
            ?disabled=${this.disabled}
            .value=${Array.isArray(this.value)?this.value.join(", "):this.value}
            tabindex="-1"
            aria-hidden="true"
            @focus=${()=>this.focus()}
            @invalid=${this.handleInvalid}
          />

          ${e?h`
                <button
                  part="clear-button"
                  class="select__clear"
                  type="button"
                  aria-label="Clear"
                  @mousedown=${this.handleClearMouseDown}
                  @click=${this.handleClearClick}
                  tabindex="-1"
                >
                  <slot name="clear-icon">
                    <bzl-icon name="close-face1"></bzl-icon>
                  </slot>
                </button>
              `:""}

          <!-- NOTE: Suffix slot removed. To re-enable:
               - Add back: <slot name="suffix" part="suffix" class="select__suffix"></slot>
               - Restore @slot suffix and @csspart suffix in JSDoc
               - Restore .select__suffix styles in select.styles.ts -->

          <slot name="expand-icon" part="expand-icon" class="select__expand-icon">
            <bzl-icon name="down-outline"></bzl-icon>
          </slot>
        </div>

        <div
          id="listbox"
          aria-expanded=${this.open?"true":"false"}
          part="listbox"
          class=${v({select__listbox:!0,"select__listbox--loading":o})}
          tabindex="-1"
          @mouseup=${this.handleOptionClick}
          @scroll=${this.handleListboxScroll}
          @slotchange=${this.handleDefaultSlotChange}
        >
          ${r?h`
                <button
                  class="select__create"
                  type="button"
                  @mousedown=${this.handleCreateMouseDown}
                  @click=${this.handleCreateClick}
                >
                  ${this.normalizeQuery(this.query)}
                </button>
              `:""}
          ${o?h`
                <div class="select__loading" aria-busy="true" aria-live="polite">
                  <bzl-icon name="loading" class="select__loading-icon"></bzl-icon>
                  <span>${this.loadingText}</span>
                </div>
              `:""}
          ${a?h`<div class="select__empty">暂无数据</div>`:""}
          <slot></slot>
        </div>
      </bzl-popup>
    `}},Do=(s.styles=[u,n],s.dependencies={"bzl-icon":m,"bzl-popup":$},d([g(".select")],s.prototype,"popup",2),d([g(".select__combobox")],s.prototype,"combobox",2),d([g(".select__display-input")],s.prototype,"displayInput",2),d([g(".select__value-input")],s.prototype,"valueInput",2),d([g(".select__listbox")],s.prototype,"listbox",2),d([f()],s.prototype,"hasFocus",2),d([f()],s.prototype,"displayLabel",2),d([f()],s.prototype,"currentOption",2),d([f()],s.prototype,"selectedOptions",2),d([f()],s.prototype,"query",2),d([f()],s.prototype,"filterComposing",2),d([f()],s.prototype,"filterComposingBuffer",2),d([f()],s.prototype,"hasOptions",2),d([f()],s.prototype,"hasVisibleOptions",2),d([b()],s.prototype,"name",2),d([b({attribute:"value"})],s.prototype,"value",2),d([b()],s.prototype,"placeholder",2),d([b({type:Boolean,reflect:!0})],s.prototype,"multiple",2),d([b({attribute:"max-options-visible",type:Number})],s.prototype,"maxOptionsVisible",2),d([b({type:Boolean,attribute:"collapse-tags"})],s.prototype,"collapseTags",2),d([b({type:Boolean,reflect:!0})],s.prototype,"disabled",2),d([b({type:Boolean})],s.prototype,"clearable",2),d([b({type:Boolean,reflect:!0})],s.prototype,"filterable",2),d([b({type:Boolean,reflect:!0})],s.prototype,"remote",2),d([b({attribute:!1})],s.prototype,"remoteMethod",2),d([b({type:Boolean,reflect:!0})],s.prototype,"loading",2),d([b({attribute:"loading-text"})],s.prototype,"loadingText",2),d([b({attribute:!1})],s.prototype,"filterMethod",2),d([b({type:Boolean,attribute:"allow-create",reflect:!0})],s.prototype,"allowCreate",2),d([f()],s.prototype,"open",2),d([b({type:Boolean})],s.prototype,"hoist",2),d([b({reflect:!0})],s.prototype,"placement",2),d([b({attribute:!1})],s.prototype,"getTag",2),d([p("disabled",{waitUntilFirstUpdate:!0})],s.prototype,"handleDisabledChange",1),d([p("value",{waitUntilFirstUpdate:!0})],s.prototype,"handleValueChange",1),d([p("filterable",{waitUntilFirstUpdate:!0})],s.prototype,"handleFilterableChange",1),d([p("remote",{waitUntilFirstUpdate:!0})],s.prototype,"handleRemoteChange",1),d([p("open",{waitUntilFirstUpdate:!0})],s.prototype,"handleOpenChange",1),A("select.show",{keyframes:[{opacity:0,transform:"scale(0.9, 0)"},{opacity:1,transform:"scale(1, 1)"}],options:{duration:250,easing:"ease"}}),A("select.hide",{keyframes:[{opacity:1,transform:"scale(1, 1)"},{opacity:0,transform:"scale(0.9, 0)"}],options:{duration:250,easing:"ease"}}),s),O=(s.define("bzl-select"),o`
  :host {
    display: inline-block;
  }

  .pagination {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
    font-family: var(--bzl-input-font-family);
    color: var(--bzl-color-gray-700);
  }

  .pagination__list {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
  }

  .pagination__arrow {
    width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    border-radius: var(--bzl-border-radius-regular);
    border: none;
    background-color: transparent;
    padding: 0;
    cursor: pointer;
    color: var(--bzl-color-gray-700);
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .pagination__arrow-icon {
    font-size: var(--bzl-font-size-medium);
  }

  .pagination__arrow-icon.prev-icon {
    transform: translate(var(--bzl-spacing-1), -1px);
  }
  .pagination__arrow-icon.next-icon {
    transform: translate(calc(var(--bzl-spacing-1) * -1), -1px);
  }

  .pagination__arrow:hover:not(.pagination__arrow--disabled) {
    background-color: var(--bzl-color-gray-100);
  }

  .pagination__arrow--gray-bg:hover:not(.pagination__arrow--disabled) {
    background-color: var(--bzl-color-neutral-0);
  }

  .pagination__arrow--disabled {
    cursor: not-allowed;
    color: var(--bzl-color-gray-500);
  }

  .pagination__item {
    min-width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    padding: 0 var(--bzl-spacing-2);
    border-radius: var(--bzl-border-radius-regular);
    border: none;
    background-color: transparent;
    cursor: pointer;
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-2x-loose);
    text-align: center;
  }

  .pagination__item:hover:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-gray-200);
  }

  .pagination__item--bg:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-neutral-0);
  }

  .pagination__item--bg:hover:not(.pagination__item--active):not(:disabled) {
    background-color: var(--bzl-color-gray-300);
  }

  .pagination__item--active {
    background-color: var(--bzl-color-boss-600);
    color: var(--bzl-color-neutral-0);
  }

  .pagination__ellipsis {
    min-width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-9);
    padding: 0 var(--bzl-spacing-2);
    border-radius: var(--bzl-border-radius-regular);
    background-color: transparent;
    color: var(--bzl-color-gray-700);
    font-size: var(--bzl-font-size-large);
    line-height: var(--bzl-line-height-2x-loose);
    text-align: center;
  }

  .pagination--simple {
    gap: var(--bzl-spacing-2);
  }

  .pagination__simple-center {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-4);
    color: var(--bzl-color-gray-600);
  }

  .pagination--simple .pagination__arrow-icon {
    font-size: var(--bzl-font-size-small);
  }

  .pagination__simple-input {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-family: var(--bzl-input-font-family);
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-gray-800);
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-input-border-radius);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
  }

  .pagination__simple-input:hover {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }

  .pagination__simple-input:focus-within {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .pagination__simple-input--medium {
    width: var(--bzl-spacing-9);
    height: var(--bzl-spacing-8);
  }

  .pagination__simple-input--large {
    width: calc(var(--bzl-spacing-10) + var(--bzl-spacing-1));
    height: var(--bzl-spacing-9);
  }

  .pagination__simple-input-control {
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
    border: none;
    background: transparent;
    font-family: inherit;
    font-size: inherit;
    color: inherit;
    text-align: center;
    -webkit-appearance: none;
  }

  .pagination__simple-input-control:focus {
    outline: none;
  }

  .pagination__simple-total {
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-gray-800);
  }

  .pagination__simple-total-number {
    margin-left: var(--bzl-spacing-2);
  }

  :host([size='large']) .pagination--simple .pagination__arrow-icon {
    font-size: var(--bzl-font-size-medium);
  }
`),n=class extends t{constructor(){super(...arguments),this.page=1,this.total=1,this.pageSize=10,this.pagerCount=7,this.simple=!1,this.size="default",this.background=!1,this.inputValue=""}connectedCallback(){super.connectedCallback(),this.syncInputValue()}updated(e){(e.has("page")||e.has("total")||e.has("pageSize")||e.has("pageCount"))&&(this.normalizeState(),this.syncInputValue())}normalizeState(){var e=this.getPageCount();let t=0<this.page?Math.floor(this.page):1;(t=t>e?e:t)!==this.page&&(this.page=t)}syncInputValue(){this.inputValue=String(this.page||1)}emitChange(e,t){e!==this.page&&(this.page=e,this.emit("bzl-page-change",{detail:{page:e}}),"prev"===t?this.emit("bzl-prev-click",{detail:{page:e}}):"next"===t&&this.emit("bzl-next-click",{detail:{page:e}}))}getPageCount(){var e,t;return"number"==typeof this.pageCount&&0<this.pageCount?Math.floor(this.pageCount):(e=0<this.pageSize?Math.floor(this.pageSize):10,t=0<this.total?Math.floor(this.total):1,Math.max(1,Math.ceil(t/e)))}getEffectivePagerCount(){let e=this.pagerCount||7;return(e=21<(e=e<5?5:e)?21:e)%2==0&&(e+=1),e}handlePrevClick(){this.page<=1||this.emitChange(this.page-1,"prev")}handleNextClick(){this.page>=this.getPageCount()||this.emitChange(this.page+1,"next")}handleItemClick(e){this.emitChange(e)}handleInputChange(){var e=this.input.value.replace(/[^\d]/g,"");this.inputValue=e,this.input.value=e}normalizeInputPage(){var e=Number(this.inputValue),t=this.getPageCount();return!this.inputValue||Number.isNaN(e)||e<1?1:t<(e=Math.floor(e))?t:e}handleInputKeydown(e){"Enter"===e.key&&this.commitInputPage()}handleInputBlur(){this.commitInputPage()}commitInputPage(){var e=this.normalizeInputPage();this.inputValue=String(e),this.emitChange(e)}get isPrevDisabled(){return this.page<=1}get isNextDisabled(){return this.page>=this.getPageCount()}getVisiblePages(){var e=this.getPageCount(),t=this.page,i=this.getEffectivePagerCount();if(e<=i)return Array.from({length:e},(e,t)=>t+1);let o=[];var r=e=>{o[o.length-1]!==e&&o.push(e)},i=(r(1),i-2),a=Math.floor(i/2);let n=t-a,s=t+a;n<=2&&(n=2,s=n+i-1),2<(n=s>=e-1&&(s=e-1,(n=s-i+1)<2)?2:n)&&r("ellipsis");for(let e=n;e<=s;e+=1)r(e);return s<e-1&&r("ellipsis"),r(e),o}renderPrev(){return h`
      <button
        part="prev"
        class=${v({pagination__arrow:!0,"pagination__arrow--disabled":this.isPrevDisabled,"pagination__arrow--gray-bg":this.background})}
        ?disabled=${this.isPrevDisabled}
        @click=${this.handlePrevClick}
      >
        <bzl-icon class="pagination__arrow-icon prev-icon" name="leftback-outline"></bzl-icon>
      </button>
    `}renderNext(){return h`
      <button
        part="next"
        class=${v({pagination__arrow:!0,"pagination__arrow--disabled":this.isNextDisabled,"pagination__arrow--gray-bg":this.background})}
        ?disabled=${this.isNextDisabled}
        @click=${this.handleNextClick}
      >
        <bzl-icon class="pagination__arrow-icon next-icon" name="rightback-medium-outline"></bzl-icon>
      </button>
    `}renderSimple(){return h`
      <div part="base" class="pagination pagination--simple">
        ${this.renderPrev()}
        <div class="pagination__simple-center">
          <div
            part="simple-input"
            class=${v({"pagination__simple-input":!0,"pagination__simple-input--medium":"large"!==this.size,"pagination__simple-input--large":"large"===this.size})}
          >
            <input
              type="text"
              class="pagination__simple-input-control"
              .value=${ro(this.inputValue)}
              @input=${this.handleInputChange}
              @keydown=${this.handleInputKeydown}
              @blur=${this.handleInputBlur}
            />
          </div>
          <span part="simple-total" class="pagination__simple-total">
            /
            <span class="pagination__simple-total-number">${this.getPageCount()}</span>
          </span>
        </div>
        ${this.renderNext()}
      </div>
    `}renderDefault(){var e=this.getVisiblePages();return h`
      <div part="base" class="pagination">
        ${this.renderPrev()}
        <div class="pagination__list">
          ${e.map(e=>{if("ellipsis"===e)return h`<span class="pagination__ellipsis">···</span>`;let t=e;e=t===this.page;return h`
              <button
                part=${e?"item item-active":"item"}
                class=${v({pagination__item:!0,"pagination__item--active":e,"pagination__item--bg":this.background})}
                @click=${()=>this.handleItemClick(t)}
              >
                ${t}
              </button>
            `})}
        </div>
        ${this.renderNext()}
      </div>
    `}render(){return this.simple?this.renderSimple():this.renderDefault()}},Oo=(n.styles=[u,O],n.dependencies={"bzl-icon":m},d([g(".pagination__simple-input-control")],n.prototype,"input",2),d([b({type:Number,reflect:!0})],n.prototype,"page",2),d([b({type:Number})],n.prototype,"total",2),d([b({attribute:"page-size",type:Number})],n.prototype,"pageSize",2),d([b({attribute:"page-count",type:Number})],n.prototype,"pageCount",2),d([b({attribute:"pager-count",type:Number})],n.prototype,"pagerCount",2),d([b({type:Boolean,reflect:!0})],n.prototype,"simple",2),d([b({reflect:!0})],n.prototype,"size",2),d([b({attribute:"background",type:Boolean,reflect:!0})],n.prototype,"background",2),d([f()],n.prototype,"inputValue",2),n),s=(n.define("bzl-pagination"),o`
  :host {
    --max-width: 320px;
    --hide-delay: 100ms;
    --show-delay: 100ms;

    display: contents;
  }

  .popover {
    --arrow-size: var(--bzl-popover-arrow-size);
    --arrow-color: var(--bzl-popover-background-color);
  }

  .popover::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .popover[placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .popover[placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  .popover[placement^='left']::part(popup) {
    transform-origin: right;
  }

  .popover[placement^='right']::part(popup) {
    transform-origin: left;
  }

  .popover__body {
    display: block;
    width: max-content;
    max-width: var(--max-width);
    border-radius: var(--bzl-popover-border-radius);
    background-color: var(--bzl-popover-background-color);
    box-shadow: var(--bzl-popover-shadow);
    color: var(--bzl-popover-color);
    font-family: var(--bzl-popover-font-family);
    font-size: var(--bzl-popover-font-size);
    font-weight: var(--bzl-popover-font-weight);
    line-height: var(--bzl-popover-line-height);
    padding: var(--bzl-popover-padding);
    box-sizing: border-box;
  }
`),O=class extends t{constructor(){super(),this.hoverTimeout=0,this.content="",this.placement="top",this.disabled=!1,this.distance=8,this.open=!1,this.skidding=0,this.trigger="click",this.hoist=!1,this.handleBlur=()=>{this.hasTrigger("focus")&&this.shouldHandleAutoTrigger()&&this.hide()},this.handleFocus=()=>{this.hasTrigger("focus")&&this.shouldHandleAutoTrigger()&&this.show()},this.handleClick=e=>{this.hasTrigger("click")&&this.shouldHandleAutoTrigger()&&(e.composedPath().includes(this.body)||(this.open?this.hide():this.show()))},this.handleMouseOver=()=>{var e;this.hasTrigger("hover")&&this.shouldHandleAutoTrigger()&&(e=Qi(getComputedStyle(this).getPropertyValue("--show-delay")),clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.show(),e))},this.handleMouseOut=()=>{var e;this.hasTrigger("hover")&&this.shouldHandleAutoTrigger()&&(e=Qi(getComputedStyle(this).getPropertyValue("--hide-delay")),clearTimeout(this.hoverTimeout),this.hoverTimeout=window.setTimeout(()=>this.hide(),e))},this.handleDocumentMouseDown=e=>{e.composedPath().includes(this)||this.hide()},this.handleDocumentKeyDown=e=>{"Escape"===e.key&&this.open&&!this.closeWatcher&&(e.stopPropagation(),this.hide())},this.addEventListener("blur",this.handleBlur,!0),this.addEventListener("focus",this.handleFocus,!0),this.addEventListener("click",this.handleClick),this.addEventListener("mouseover",this.handleMouseOver),this.addEventListener("mouseout",this.handleMouseOut)}get computedDistance(){var e=getComputedStyle(this).getPropertyValue("--bzl-popover-arrow-size");return e&&"0px"!==e&&"0"!==e?this.distance+8:this.distance}disconnectedCallback(){super.disconnectedCallback(),this.removeOpenListeners()}firstUpdated(){this.body.hidden=!this.open,this.open&&(this.popup.active=!0,this.popup.reposition(),this.disabled||this.addOpenListeners())}hasTrigger(e){return this.trigger.trim()===e}shouldHandleAutoTrigger(){return!this.hasTrigger("manual")}addOpenListeners(){var e;document.addEventListener("keydown",this.handleDocumentKeyDown),this.hasTrigger("click")&&document.addEventListener("mousedown",this.handleDocumentMouseDown),"CloseWatcher"in window&&(null!=(e=this.closeWatcher)&&e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.hide()})}removeOpenListeners(){var e;document.removeEventListener("keydown",this.handleDocumentKeyDown),document.removeEventListener("mousedown",this.handleDocumentMouseDown),null!=(e=this.closeWatcher)&&e.destroy()}async handleOpenChange(){var e,t;this.open?this.disabled?this.open=!1:(this.emit("bzl-show"),this.addOpenListeners(),await E(this.body),this.body.hidden=!1,this.popup.active=!0,{keyframes:e,options:t}=T(this,"popover.show",{dir:"ltr"}),await S(this.popup.popup,e,t),this.popup.reposition(),this.emit("bzl-after-show")):(this.emit("bzl-hide"),this.removeOpenListeners(),await E(this.body),{keyframes:e,options:t}=T(this,"popover.hide",{dir:"ltr"}),await S(this.popup.popup,e,t),this.popup.active=!1,this.body.hidden=!0,this.emit("bzl-after-hide"))}async handleOptionsChange(){this.hasUpdated&&(await this.updateComplete,this.popup.reposition())}handleDisabledChange(){this.disabled&&this.open&&this.hide()}async show(){if(!this.open)return this.open=!0,Xi(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Xi(this,"bzl-after-hide")}render(){return h`
      <bzl-popup
        part="base"
        exportparts="
          popup:base__popup,
          arrow:base__arrow
        "
        class=${v({popover:!0,"popover--open":this.open})}
        placement=${this.placement}
        arrow-placement=${this.placement.includes("start")?"start":this.placement.includes("end")?"end":void 0}
        distance=${this.computedDistance}
        skidding=${this.skidding}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        arrow
        hover-bridge
      >
        ${""}
        <slot slot="anchor" aria-haspopup="dialog" aria-expanded=${this.open?"true":"false"}></slot>

        ${""}
        <div part="body" class="popover__body" role="dialog">
          <slot name="content">${this.content}</slot>
        </div>
      </bzl-popup>
    `}},Po=(O.styles=[u,s],O.dependencies={"bzl-popup":$},d([g("slot:not([name])")],O.prototype,"defaultSlot",2),d([g(".popover__body")],O.prototype,"body",2),d([g("bzl-popup")],O.prototype,"popup",2),d([b()],O.prototype,"content",2),d([b()],O.prototype,"placement",2),d([b({type:Boolean,reflect:!0})],O.prototype,"disabled",2),d([b({type:Number})],O.prototype,"distance",2),d([b({type:Boolean,reflect:!0})],O.prototype,"open",2),d([b({type:Number})],O.prototype,"skidding",2),d([b()],O.prototype,"trigger",2),d([b({type:Boolean})],O.prototype,"hoist",2),d([p("open",{waitUntilFirstUpdate:!0})],O.prototype,"handleOpenChange",1),d([p(["content","distance","hoist","placement","skidding"])],O.prototype,"handleOptionsChange",1),d([p("disabled")],O.prototype,"handleDisabledChange",1),A("popover.show",{keyframes:[{opacity:0,transform:"scale(0.95)"},{opacity:1,transform:"scale(1)"}],options:{duration:150,easing:"ease"}}),A("popover.hide",{keyframes:[{opacity:1,transform:"scale(1)"},{opacity:0,transform:"scale(0.95)"}],options:{duration:100,easing:"ease"}}),O),Fo=(O.define("bzl-popover"),$),n=($.define("bzl-popup"),o`
  :host {
    display: inline-block;
  }

  .logo-container {
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    transition: all 0.2s ease;
  }

  /* 支持不同的 logo 类型样式 */
  :host([type='fill']) .logo-container {
    /* fill 类型的特殊样式 */
  }

  :host([type='line']) .logo-container {
    /* line 类型的特殊样式 */
  }

  :host([type='text']) .logo-container {
    /* text 类型的特殊样式 */
    padding-top: calc(124 / 700 * 100%);
  }

  /* 支持不同的主题样式 */
  :host([theme='dark']) .logo-container {
    /* dark 主题的特殊样式 */
  }

  :host([theme='light']) .logo-container {
    /* light 主题的特殊样式 */
  }
`),s=class extends t{constructor(){super(...arguments),this.type="fill",this.theme="default",this.size=40}get backgroundImage(){return`https://static.zhipin.com/assets/bzl-design/components/logo/${this.type}-${this.theme}.svg`}get height(){return"text"===this.type?"auto":this.size+"px"}render(){return h`
      <div
        part="base"
        class="logo-container"
        style="width: ${this.size}px; height: ${this.height}; background-image: url('${this.backgroundImage}')"
      ></div>
    `}},Lo=(s.styles=[u,n],d([b({reflect:!0})],s.prototype,"type",2),d([b({reflect:!0})],s.prototype,"theme",2),d([b({type:Number,reflect:!0})],s.prototype,"size",2),s),O=(s.define("bzl-logo"),o`
  :host {
    display: block;
    user-select: none;
    -webkit-user-select: none;
  }

  /* 确保筛选隐藏与原生 hidden 语义一致（避免仅依赖 UA 的全局 [hidden] 对自定义元素的覆盖差异） */
  :host([hidden]) {
    display: none;
  }

  :host(:focus) {
    outline: none;
  }

  .option {
    position: relative;
    display: flex;
    align-items: center;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    font-weight: var(--bzl-font-weight-normal);
    line-height: var(--bzl-line-height-dense);
    letter-spacing: var(--bzl-letter-spacing-normal);
    color: var(--bzl-color-neutral-900);
    background-color: var(--bzl-color-neutral-0);
    padding: var(--bzl-spacing-5) var(--bzl-scene-padding-11);
    border-radius: var(--bzl-border-radius-small);
    transition: var(--bzl-transition-fast) fill;
    cursor: pointer;
  }

  .option--hover:not(.option--current):not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
    color: var(--bzl-color-neutral-1000);
  }

  .option--current:not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
  }

  .option--current.option--disabled {
    background-color: var(--bzl-color-primary-600);
    color: var(--bzl-color-neutral-0);
    opacity: 1;
  }

  .option--selected:not(.option--current):not(.option--disabled) {
    background-color: var(--bzl-color-neutral-100);
  }

  .option--disabled {
    outline: none;
    opacity: 0.5;
    cursor: not-allowed;
  }

  .option__label {
    flex: 1 1 auto;
    display: inline-block;
    line-height: var(--bzl-line-height-dense);
  }

  .option--selected:not(.option--disabled) .option__label {
    color: var(--bzl-color-primary-600);
  }

  .option .option__check {
    flex: 0 0 auto;
    visibility: hidden;
    color: var(--bzl-color-primary-600);
  }

  .option--selected .option__check {
    visibility: visible;
  }

  .option__prefix {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
  }

  .option--selected:not(.option--disabled) .option__prefix {
    color: var(--bzl-color-primary-600);
  }

  .option__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-4);
  }

  @media (forced-colors: active) {
    :host(:hover:not([aria-disabled='true'])) .option {
      outline: dashed 1px SelectedItem;
      outline-offset: -1px;
    }
  }
`),n=class extends t{constructor(){super(...arguments),this.isInitialized=!1,this.current=!1,this.selected=!1,this.hasHover=!1,this.value="",this.disabled=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","option"),this.setAttribute("aria-selected","false")}handleDefaultSlotChange(){this.isInitialized?customElements.whenDefined("bzl-select").then(()=>{var e=this.closest("bzl-select");e&&e.handleDefaultSlotChange()}):this.isInitialized=!0}handleMouseEnter(){this.hasHover=!0}handleMouseLeave(){this.hasHover=!1}handleDisabledChange(){this.setAttribute("aria-disabled",this.disabled?"true":"false")}handleSelectedChange(){this.setAttribute("aria-selected",this.selected?"true":"false")}handleValueChange(){"string"!=typeof this.value&&(this.value=String(this.value)),this.value.includes(" ")&&(console.error("选项的值不能包含空格。所有空格已被替换为下划线。",this),this.value=this.value.replace(/ /g,"_"))}getTextLabel(){var e=this.childNodes;let t="";return[...e].forEach(e=>{e.nodeType!==Node.ELEMENT_NODE||e.hasAttribute("slot")||(t+=e.textContent),e.nodeType===Node.TEXT_NODE&&(t+=e.textContent)}),t.trim()}isMultipleSelect(){var e=this.closest("bzl-select");return null==e?void 0:e.multiple}render(){var e=this.isMultipleSelect();return h`
      <div
        part="base"
        class=${v({option:!0,"option--current":this.current,"option--disabled":this.disabled,"option--selected":this.selected,"option--hover":this.hasHover})}
        @mouseenter=${this.handleMouseEnter}
        @mouseleave=${this.handleMouseLeave}
      >
        <slot part="prefix" name="prefix" class="option__prefix"></slot>
        <slot part="label" class="option__label" @slotchange=${this.handleDefaultSlotChange}></slot>
        ${e?h`<bzl-icon class="option__check" name="right-outline"></bzl-icon>`:""}
      </div>
    `}},Mo=(n.styles=[u,O],n.dependencies={"bzl-icon":m},d([g(".option__label")],n.prototype,"defaultSlot",2),d([f()],n.prototype,"current",2),d([f()],n.prototype,"selected",2),d([f()],n.prototype,"hasHover",2),d([b({reflect:!0})],n.prototype,"value",2),d([b({type:Boolean,reflect:!0})],n.prototype,"disabled",2),d([p("disabled")],n.prototype,"handleDisabledChange",1),d([p("selected")],n.prototype,"handleSelectedChange",1),d([p("value")],n.prototype,"handleValueChange",1),n),s=(n.define("bzl-option"),o`
  :host {
    display: block;
  }

  .input {
    flex: 1 1 auto;
    display: inline-flex;
    align-items: stretch;
    justify-content: start;
    position: relative;
    width: 100%;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: text;
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
  }

  /* Standard inputs */
  .input--standard {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .input--standard:hover:not(.input--disabled) {
    background-color: var(--bzl-input-background-color-hover);
    border-color: var(--bzl-input-border-color-hover);
  }

  .input--standard.input--focused:not(.input--disabled) {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-input-focus-ring-color);
  }

  .input--standard.input--focused:not(.input--disabled) .input__control {
    color: var(--bzl-input-color-focus);
  }

  .input--standard.input--disabled {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    cursor: not-allowed;
  }

  .input--standard.input--disabled .input__control {
    color: var(--bzl-input-color-disabled);
  }

  .input--standard.input--disabled .input__control::placeholder {
    color: var(--bzl-input-placeholder-color-disabled);
  }

  /* 验证失败样式 */
  :host([data-user-invalid]) .input--standard {
    border-color: var(--bzl-color-danger-600);
  }
  :host([data-user-invalid]) .input--standard.input--focused:not(.input--disabled) {
    box-shadow: 0 0 0 var(--bzl-focus-ring-width) var(--bzl-color-danger-100);
  }

  .input__control {
    flex: 1 1 auto;
    font-family: inherit;
    font-size: inherit;
    font-weight: inherit;
    min-width: 0;
    height: 100%;
    color: var(--bzl-input-color);
    border: none;
    background: inherit;
    box-shadow: none;
    padding: 0;
    margin: 0;
    cursor: inherit;
    -webkit-appearance: none;
  }

  .input__control::-webkit-search-decoration,
  .input__control::-webkit-search-cancel-button,
  .input__control::-webkit-search-results-button,
  .input__control::-webkit-search-results-decoration {
    -webkit-appearance: none;
  }

  .input__control:-webkit-autofill,
  .input__control:-webkit-autofill:hover,
  .input__control:-webkit-autofill:focus,
  .input__control:-webkit-autofill:active {
    box-shadow: 0 0 0 var(--bzl-input-height-large) var(--bzl-input-background-color-hover) inset !important;
    -webkit-text-fill-color: var(--bzl-color-neutral-900);
    caret-color: var(--bzl-input-color);
  }

  .input__control::placeholder {
    color: var(--bzl-input-placeholder-color);
    user-select: none;
    -webkit-user-select: none;
  }

  .input:hover:not(.input--disabled) .input__control {
    color: var(--bzl-input-color-hover);
  }

  .input__control:focus {
    outline: none;
  }

  .input__prefix,
  .input__suffix {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    cursor: default;
  }

  /* Inline word counter inside the input */
  .input__count {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
    font-variant-numeric: tabular-nums;
    margin-inline-end: var(--bzl-input-spacing-medium);
    font-size: var(--bzl-font-size-2x-small);
  }

  .input__prefix ::slotted(bzl-icon),
  .input__suffix ::slotted(bzl-icon) {
    color: var(--bzl-input-icon-color);
  }

  /*
   * Size modifiers
   */

  .input--medium {
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-medium);
    height: var(--bzl-input-height-medium);
  }

  .input--medium .input__control {
    height: calc(var(--bzl-input-height-medium) - var(--bzl-input-border-width) * 2);
    padding: 0 var(--bzl-input-padding-leftright);
  }

  .input--medium .input__clear {
    width: calc(1em + var(--bzl-input-spacing-medium) * 2);
  }

  .input--medium .input__count {
    margin-inline-end: var(--bzl-input-spacing-medium);
  }

  .input--medium .input__prefix ::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-medium);
  }

  .input--medium .input__suffix ::slotted(*) {
    margin-inline-end: var(--bzl-input-spacing-medium);
  }

  .input--large {
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-large);
    height: var(--bzl-input-height-large);
  }

  .input--large .input__control {
    height: calc(var(--bzl-input-height-large) - var(--bzl-input-border-width) * 2);
    padding: 0 var(--bzl-input-padding-leftright);
  }

  .input--large .input__clear {
    width: calc(1em + var(--bzl-input-spacing-large) * 2);
  }

  .input--large .input__count {
    margin-inline-end: var(--bzl-input-spacing-large);
  }

  .input--large .input__prefix ::slotted(*) {
    margin-inline-start: var(--bzl-input-spacing-large);
  }

  .input--large .input__suffix ::slotted(*) {
    margin-inline-end: var(--bzl-input-spacing-large);
  }

  /*
   * Clearable
   */

  .input__clear {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
  }

  .input__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .input__clear:focus {
    outline: none;
  }
`),O=class extends t{constructor(){super(...arguments),this.hasFocus=!1,this.title="",this.type="text",this.name="",this.value="",this.defaultValue="",this.size="medium",this.showWordLimit=!1,this.clearable=!1,this.disabled=!1,this.placeholder="",this.readonly=!1,this.autocomplete="off"}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleChange(){this.value=this.input.value,this.emit("bzl-change")}handleClearClick(e){e.preventDefault(),""!==this.value&&(this.value="",this.emit("bzl-clear"),this.emit("bzl-input"),this.emit("bzl-change")),this.input.focus()}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleInput(){this.value=this.input.value,this.emit("bzl-input")}handleInvalid(){}handleKeyDown(e){e.metaKey||e.ctrlKey||e.shiftKey||e.altKey}handleDisabledChange(){}handleStepChange(){this.input.step=String(this.step)}async handleValueChange(){await this.updateComplete}focus(e){this.input.focus(e)}blur(){this.input.blur()}select(){this.input.select()}render(){var e=this.clearable&&!this.disabled&&!this.readonly&&("number"==typeof this.value||0<this.value.length);return h`
      <div
        part="base"
        class=${v({input:!0,"input--medium":"medium"===this.size,"input--large":"large"===this.size,"input--standard":!0,"input--disabled":this.disabled,"input--focused":this.hasFocus,"input--empty":!this.value})}
      >
        <span part="prefix" class="input__prefix">
          <slot name="prefix"></slot>
        </span>

        <input
          part="input"
          id="input"
          class="input__control"
          type=${this.type}
          title=${this.title}
          name=${D(this.name)}
          ?disabled=${this.disabled}
          ?readonly=${this.readonly}
          placeholder=${D(this.placeholder)}
          minlength=${D(this.minlength)}
          maxlength=${D(this.maxlength)}
          min=${D(this.min)}
          max=${D(this.max)}
          step=${D(this.step)}
          .value=${ro(this.value)}
          ?autofocus=${this.autofocus}
          autocomplete=${this.autocomplete}
          @change=${this.handleChange}
          @input=${this.handleInput}
          @invalid=${this.handleInvalid}
          @keydown=${this.handleKeyDown}
          @focus=${this.handleFocus}
          @blur=${this.handleBlur}
        />

        ${e?h`
              <button
                part="clear-button"
                class="input__clear"
                type="button"
                aria-label="清空"
                @click=${this.handleClearClick}
                tabindex="-1"
              >
                <slot name="clear-icon">
                  <bzl-icon name="close-face1" library="system"></bzl-icon>
                </slot>
              </button>
            `:""}
        ${this.showWordLimit?h`
              <span class="input__count" aria-hidden="true">
                ${""+("string"==typeof this.value?this.value.length:0)+(this.maxlength?"/"+this.maxlength:"")}
              </span>
            `:""}

        <span part="suffix" class="input__suffix">
          <slot name="suffix"></slot>
        </span>
      </div>
    `}},Ro=(O.styles=[u,s],O.dependencies={"bzl-icon":m},d([g(".input__control")],O.prototype,"input",2),d([f()],O.prototype,"hasFocus",2),d([b()],O.prototype,"title",2),d([b({reflect:!0})],O.prototype,"type",2),d([b()],O.prototype,"name",2),d([b()],O.prototype,"value",2),d([oo()],O.prototype,"defaultValue",2),d([b({reflect:!0})],O.prototype,"size",2),d([b({type:Boolean,attribute:"show-word-limit"})],O.prototype,"showWordLimit",2),d([b({type:Boolean})],O.prototype,"clearable",2),d([b({type:Boolean,reflect:!0})],O.prototype,"disabled",2),d([b()],O.prototype,"placeholder",2),d([b({type:Boolean,reflect:!0})],O.prototype,"readonly",2),d([b({type:Number})],O.prototype,"minlength",2),d([b({type:Number})],O.prototype,"maxlength",2),d([b()],O.prototype,"min",2),d([b()],O.prototype,"max",2),d([b()],O.prototype,"step",2),d([b({type:Boolean})],O.prototype,"autofocus",2),d([b()],O.prototype,"autocomplete",2),d([p("disabled",{waitUntilFirstUpdate:!0})],O.prototype,"handleDisabledChange",1),d([p("step",{waitUntilFirstUpdate:!0})],O.prototype,"handleStepChange",1),d([p("value",{waitUntilFirstUpdate:!0})],O.prototype,"handleValueChange",1),O),n=(O.define("bzl-input"),o`
  /* 确保 bzl-layout 元素为块级元素 */
  :host {
    display: block;
  }

  /* 默认布局容器样式 */
  .layout {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: var(--bzl-color-neutral-0);
  }

  /* 当Layout内部只有Sider和Content时，调整flex-direction为row */
  :host([data-sider-only]) .layout {
    flex-direction: row;
  }

  /* Header 类型样式 - 应用到 :host */
  :host([type='header']) {
    flex: 0 0 auto;
    height: var(--bzl-layout-header-height);
    line-height: var(--bzl-layout-header-height);
    display: flex;
    align-items: center;
  }

  /* Footer 类型样式 - 应用到 :host */
  :host([type='footer']) {
    flex: 0 0 auto;
    height: var(--bzl-layout-header-height);
    line-height: var(--bzl-layout-header-height);
    text-align: center;
    display: flex;
    align-items: center;
  }

  /* Content 类型样式 - 应用到 :host */
  :host([type='content']) {
    flex: 1 1 auto;
    padding: var(--bzl-spacing-6);
    overflow: auto;
    display: flex;
    flex-direction: column;
  }

  /* Sider 类型样式 - 应用到 :host */
  :host([type='sider']) {
    position: relative;
    transition: all var(--bzl-transition-fast) ease;
    flex: 0 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* 侧边栏内容区域 - 可滚动 */
  :host([type='sider']) ::slotted(*) {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
  }

  /* 侧边栏内容容器 */
  .layout-sider__content {
    flex: 1 1 auto;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }

  .layout-sider__trigger {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: var(--bzl-layout-trigger-height);
    line-height: var(--bzl-layout-trigger-height);
    text-align: center;
    cursor: pointer;
    color: var(--bzl-color-neutral-600);
    border-top: 1px solid var(--bzl-color-neutral-200);
    transition: all var(--bzl-transition-fast) ease;
    user-select: none;
    flex: 0 0 auto;
  }
`),s=class extends t{constructor(){super(...arguments),this.type="",this.collapsed=!1,this.collapsedWidth="80px",this.collapsible=!1,this.defaultCollapsed=!1,this.width="192px"}handleCollapsedChange(){"sider"===this.type&&this.emit("bzl-collapse",{detail:{collapsed:this.collapsed}})}handleTriggerClick(){"sider"===this.type&&this.collapsible&&(this.collapsed=!this.collapsed,this.dispatchEvent(new CustomEvent("bzl-collapse",{detail:{collapsed:this.collapsed},bubbles:!0,composed:!0})),this.notifyChildrenCollapseState())}notifyChildrenCollapseState(){var e=null==(e=this.shadowRoot)?void 0:e.querySelector(".layout-sider__content");e&&e.dispatchEvent(new CustomEvent("sider-collapse",{detail:{collapsed:this.collapsed},bubbles:!0,composed:!0}))}connectedCallback(){super.connectedCallback(),"sider"===this.type?(this.defaultCollapsed&&!this.hasAttribute("collapsed")&&(this.collapsed=!0),this.updateSiderStyles()):""===this.type&&this.checkHasSider()}disconnectedCallback(){super.disconnectedCallback()}updated(e){super.updated(e),e.has("collapsed")||e.has("width")||e.has("collapsedWidth")?"sider"===this.type&&this.updateSiderStyles():""===this.type&&this.checkHasSider()}checkHasSider(){var e,t;""===this.type&&(e=null!==this.querySelector('bzl-layout[type="sider"]'),t=Array.from(this.children).filter(e=>"BZL-LAYOUT"===e.tagName),this.toggleAttribute("data-has-sider",e),t=2===t.length&&e,this.toggleAttribute("data-sider-only",t))}updateSiderStyles(){var e;"sider"===this.type&&(e=this.collapsed?`width: ${this.collapsedWidth};`:`width: ${this.width};`,this.style.cssText=e)}render(){switch(this.type){case"header":case"footer":case"content":return h`<slot></slot>`;case"sider":return h`
          <div part="content" class="layout-sider__content" ?data-collapsed=${this.collapsed}>
            <slot></slot>
          </div>
          ${this.collapsible?h`
                <div part="trigger" class="layout-sider__trigger" @click=${this.handleTriggerClick}>
                  <slot name="trigger"> ${this.collapsed?"»":"«"} </slot>
                </div>
              `:""}
        `;default:return h`
          <div part="base" class="layout">
            <slot></slot>
          </div>
        `}}},Vo=(s.styles=[u,n],d([b()],s.prototype,"type",2),d([b({type:Boolean,reflect:!0})],s.prototype,"collapsed",2),d([b({attribute:"collapsed-width"})],s.prototype,"collapsedWidth",2),d([b({type:Boolean})],s.prototype,"collapsible",2),d([b({attribute:"default-collapsed",type:Boolean})],s.prototype,"defaultCollapsed",2),d([b()],s.prototype,"width",2),d([p("collapsed")],s.prototype,"handleCollapsedChange",1),s),oo=(s.define("bzl-layout"),o`
  :host {
    display: inline-block;
  }

  .link {
    display: inline-flex;
    align-items: center;
    text-decoration: none;
    color: var(--bzl-color-neutral-900);
    transition: all var(--bzl-transition-fast);
    cursor: pointer;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-dense);
  }

  /* 默认状态 */
  .link--default {
    color: var(--bzl-color-neutral-900);
  }

  .link--default:not(.link--underline):hover {
    color: var(--bzl-color-primary-600);
  }

  /* 主要状态 */
  .link--primary {
    color: var(--bzl-color-primary-700);
  }

  .link--primary:not(.link--underline):hover {
    color: var(--bzl-color-primary-600);
  }

  /* 下划线样式 */
  .link--underline {
    text-decoration: none;
  }

  .link--underline:hover {
    text-decoration: underline;
  }

  /* 禁用状态 */
  .link--disabled {
    cursor: not-allowed;
    text-decoration: none !important;
    pointer-events: none;
  }

  .link--primary.link--disabled {
    color: var(--bzl-color-primary-400) !important;
  }

  .link--default.link--disabled {
    color: var(--bzl-color-neutral-600) !important;
  }

  /* 箭头图标样式 */
  .link__suffix {
    font-size: var(--bzl-font-size-2x-small);
  }
`),O=class extends t{constructor(){super(...arguments),this.status="default",this.underline=!1,this.href="",this.target="",this.disabled=!1}render(){var e={link:!0,"link--default":"default"===this.status,"link--primary":"primary"===this.status,"link--underline":this.underline,"link--disabled":this.disabled};return h`
      <a
        part="base"
        class=${v(e)}
        href=${this.disabled?null:this.href}
        target=${this.target}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
      >
        <slot></slot>
        <slot name="suffix" part="suffix" class="link__suffix"></slot>
      </a>
    `}handleClick(e){this.disabled&&(e.preventDefault(),e.stopPropagation())}},Bo=(O.styles=[u,oo],O.dependencies={},d([b({reflect:!0})],O.prototype,"status",2),d([b({type:Boolean,reflect:!0})],O.prototype,"underline",2),d([b()],O.prototype,"href",2),d([b()],O.prototype,"target",2),d([b({type:Boolean,reflect:!0})],O.prototype,"disabled",2),O),Io=(O.define("bzl-link"),m),n=(m.define("bzl-icon"),o`
  :host {
    --color: var(--bzl-panel-divider-color);
    --width: var(--bzl-panel-border-width);
    --spacing: var(--bzl-spacing-5);
  }

  :host(:not([vertical])) {
    display: block;
    border-top: solid var(--width) var(--color);
    margin: var(--spacing) 0;
  }

  :host(:not([vertical])[dashed]) {
    border-top-style: dashed;
  }

  :host([vertical]) {
    display: inline-block;
    height: 100%;
    border-left: solid var(--width) var(--color);
    margin: 0 var(--spacing);
  }

  :host([vertical][dashed]) {
    border-left-style: dashed;
  }
`),s=class extends t{constructor(){super(...arguments),this.vertical=!1,this.dashed=!1}connectedCallback(){super.connectedCallback(),this.setAttribute("role","separator")}handleVerticalChange(){this.setAttribute("aria-orientation",this.vertical?"vertical":"horizontal")}},Uo=(s.styles=[u,n],d([b({type:Boolean,reflect:!0})],s.prototype,"vertical",2),d([b({type:Boolean,reflect:!0})],s.prototype,"dashed",2),d([p("vertical")],s.prototype,"handleVerticalChange",1),s),oo=(s.define("bzl-divider"),o`
  :host {
    display: block;
  }

  .bzl-form {
  }

  ::slotted(bzl-form-item) {
    display: block;
  }
`);function No(e,t,i){let o=e;var r=(t=t.replace(/\[(\w+)\]/g,".$1").replace(/^\./,"")).split(".");let a=0;for(var n=r.length;a<n-1&&(o||i);++a){var s=r[a];if(!(s in o)){if(i)throw new Error("please transfer a valid prop path to form item!");break}o=o[s]}e=o||{},t=r[a];return{o:e,k:t,v:o?o[t]:null}}var Ho=new Set(["BZL-INPUT","BZL-TEXTAREA","BZL-SELECT","BZL-TIME-PICKER","INPUT","TEXTAREA","SELECT"]),qo=new Set(["BZL-INPUT","BZL-TEXTAREA","BZL-SELECT","INPUT","TEXTAREA"]),O=class extends t{constructor(){super(...arguments),this.name="",this.labelPosition="right",this.labelWidth="",this.labelSuffix="",this.hideMessage=!1,this.hideAsterisk=!1,this.model=null,this.rules=null,this.formItems=[],this._onSlotChange=()=>{var e=this._getAssignedFormItems().filter(e=>!!e.prop);this.formItems=e,this._applyFormPropsToItems(),this._syncModelToItems(),this._syncRulesToItems()}}willUpdate(t){super.willUpdate(t),t.has("model")&&this._syncModelToItems(),t.has("rules")&&this._syncRulesToItems();["labelPosition","labelWidth","hideMessage","hideAsterisk","labelSuffix"].some(e=>t.has(e))&&this._applyFormPropsToItems()}_getAssignedFormItems(){var e=this.slotRef;return e?(e=(null!=(e=e.assignedElements({flatten:!0}))?e:[]).flatMap(e=>{var t=Array.from(e.querySelectorAll("bzl-form-item"));return"BZL-FORM-ITEM"===e.tagName?[e,...t]:t}),Array.from(new Set(e))):[]}_applyFormPropsToItems(){var e=this._getAssignedFormItems();let t={hideMessage:this.hideMessage,labelWidth:this.labelWidth,hideAsterisk:this.hideAsterisk,labelSuffix:this.labelSuffix,labelPosition:this.labelPosition};e.forEach(e=>e.setFormProps(t))}_syncModelToItems(){this.model&&this.formItems.forEach(e=>e.setFormModel(this.model))}_syncRulesToItems(){this.rules&&this.formItems.forEach(e=>{var t,i;e.prop&&(i=No(this.rules,t=e.prop,!1).v,i)&&e.setRule({[t]:i})})}validate(r){let e;"function"!=typeof r&&(e=new Promise((i,o)=>{r=(e,t)=>{e?i(e):o(null!=t?t:{})}})),0===this.formItems.length&&r(!0);if((async()=>{let e=!0;var t,i={};for(t of await Promise.all(this.formItems.map(e=>new Promise(i=>{e.validate((e,t)=>i({message:e,invalidFields:null!=t?t:{}}))}))))t.message&&(e=!1),t.invalidFields&&Object.assign(i,t.invalidFields);r(e,e?void 0:i)})(),e)return e}validateField(e,t){let i=Array.isArray(e)?e:[e];e=this.formItems.filter(e=>i.includes(e.prop));e.length?e.forEach(e=>e.validate(t)):console.warn("[BzlForm] please pass correct props!")}clearValidate(e){let i=this.formItems;if(e){let t=Array.isArray(e)?e:[e];i=this.formItems.filter(e=>t.includes(e.prop))}i.forEach(e=>e.clearValidate())}resetFields(){this.model?this.formItems.forEach(e=>e.resetField()):console.warn("[BzlForm] please set model (form.model or setModel)!")}getValues(){if(this.model)return this.formItems.forEach(e=>e.getValue()),this.model;console.warn("[BzlForm] please set model (form.model or setModel)!")}render(){return h`
      <form class="bzl-form" part="base">
        <slot @slotchange=${this._onSlotChange}></slot>
      </form>
    `}},jo=(O.styles=[oo],d([b()],O.prototype,"name",2),d([b({attribute:"label-position",reflect:!0})],O.prototype,"labelPosition",2),d([b({attribute:"label-width"})],O.prototype,"labelWidth",2),d([b({attribute:"label-suffix"})],O.prototype,"labelSuffix",2),d([b({type:Boolean,attribute:"hide-message"})],O.prototype,"hideMessage",2),d([b({type:Boolean,attribute:"hide-asterisk"})],O.prototype,"hideAsterisk",2),d([b({type:Object,attribute:!1})],O.prototype,"model",2),d([b({type:Object,attribute:!1})],O.prototype,"rules",2),d([g("form slot")],O.prototype,"slotRef",2),d([f()],O.prototype,"formItems",2),O),n=(O.define("bzl-form"),o`
  :host {
    display: block;
    position: relative;
  }

  .form-item__wrapper {
    display: flex;
    margin-bottom: var(--bzl-spacing-7);
  }

  .form-item__label-wrapper {
    flex-shrink: 0;
    margin-right: var(--bzl-spacing-7);
    font-size: var(--bzl-font-size-small);
    color: var(--bzl-color-neutral-700);
    line-height: var(--bzl-line-height-normal);
  }

  .form-item__label-wrapper .form-item__label {
    display: inline-block;
    width: 100%;
    line-height: var(--bzl-line-height-3x-loose);
  }

  .form-item--required .form-item__label::before {
    content: '*';
    color: var(--bzl-color-danger-600);
    margin-right: var(--bzl-spacing-2);
  }

  .form-item--no-asterisk .form-item__label::before {
    display: none;
  }

  .form-item--label-top .form-item__wrapper {
    flex-direction: column;
    align-items: stretch;
  }

  .form-item--label-top .form-item__label-wrapper {
    margin-right: 0;
    margin-bottom: var(--bzl-spacing-4);
  }

  .form-item--label-top .form-item__label-wrapper .form-item__label {
    line-height: var(--bzl-line-height-normal);
  }

  .form-item--no-label .form-item__label-wrapper {
    display: none;
  }

  .form-item__main {
    flex: 1;
  }

  .form-item__main-content {
    min-height: var(--bzl-line-height-3x-loose);
    line-height: var(--bzl-line-height-3x-loose);
    /* font-size: 0; */
  }

  .form-item__error-msg {
    color: var(--bzl-color-danger-600);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-line-height-normal);
    display: inline-block;
  }

  .form-item--success .form-item__error-msg,
  .form-item--validating .form-item__error-msg {
    display: none;
  }

  .form-item--validating {
    /* opacity: 0.8; */
  }
`),Wo="important",Ko=De(class extends r{constructor(e){if(super(e),e.type!==st||"style"!==e.name||2<(null==(e=e.strings)?void 0:e.length))throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(o){return Object.keys(o).reduce((e,t)=>{var i=o[t];return null==i?e:e+`${t=t.includes("-")?t:t.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(e,[t]){var i,o,r=e.element.style;if(void 0===this.ft)return this.ft=new Set(Object.keys(t)),this.render(t);for(i of this.ft)null==t[i]&&(this.ft.delete(i),i.includes("-")?r.removeProperty(i):r[i]=null);for(o in t){var a,n=t[o];null!=n&&(this.ft.add(o),a="string"==typeof n&&n.endsWith(" !important"),o.includes("-")||a?r.setProperty(o,a?n.slice(0,-11):n,a?Wo:""):r[o]=n)}return c}});function Yo(){return(Yo=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var i,o=arguments[t];for(i in o)Object.prototype.hasOwnProperty.call(o,i)&&(e[i]=o[i])}return e}).apply(this,arguments)}function Zo(e){return(Zo=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)})(e)}function Xo(e,t){return(Xo=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e})(e,t)}function Qo(e,t,i){return(Qo=(()=>{if("undefined"!=typeof Reflect&&Reflect.construct&&!Reflect.construct.sham){if("function"==typeof Proxy)return 1;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],function(){})),1}catch(e){}}})()?Reflect.construct.bind():function(e,t,i){var o=[null];o.push.apply(o,t);t=new(Function.bind.apply(e,o));return i&&Xo(t,i.prototype),t}).apply(null,arguments)}function Jo(e){var i="function"==typeof Map?new Map:void 0;return function(e){if(null===e||-1===Function.toString.call(e).indexOf("[native code]"))return e;if("function"!=typeof e)throw new TypeError("Super expression must either be null or a function");if(void 0!==i){if(i.has(e))return i.get(e);i.set(e,t)}function t(){return Qo(e,arguments,Zo(this).constructor)}return t.prototype=Object.create(e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),Xo(t,e)}(e)}var Go=/%[sdj%]/g;function er(e){var i;return e&&e.length?(i={},e.forEach(function(e){var t=e.field;i[t]=i[t]||[],i[t].push(e)}),i):null}function tr(e){for(var t=arguments.length,i=new Array(1<t?t-1:0),o=1;o<t;o++)i[o-1]=arguments[o];var r=0,a=i.length;return"function"==typeof e?e.apply(null,i):"string"==typeof e?e.replace(Go,function(e){if("%%"===e)return"%";if(a<=r)return e;switch(e){case"%s":return String(i[r++]);case"%d":return Number(i[r++]);case"%j":try{return JSON.stringify(i[r++])}catch(e){return"[Circular]"}default:return e}}):e}function P(e,t){return null==e||"array"===t&&Array.isArray(e)&&!e.length||!("string"!==(t=t)&&"url"!==t&&"hex"!==t&&"email"!==t&&"date"!==t&&"pattern"!==t||"string"!=typeof e||e)}function ir(i,o,r){var a=0,n=i.length;!function e(t){t&&t.length?r(t):(t=a,a+=1,t<n?o(i[t],e):r([]))}([])}var or=(o=>{var e,t;function i(e,t){var i=o.call(this,"Async Validation Error")||this;return i.errors=e,i.fields=t,i}return t=o,(e=i).prototype=Object.create(t.prototype),Xo(e.prototype.constructor=e,t),i})(Jo(Error));function rr(c,e,d,a,n){var h,o,r,s,p,t;return e.first?(t=new Promise(function(t,i){var o,r;o=c,r=[],Object.keys(o).forEach(function(e){r.push.apply(r,o[e]||[])}),ir(r,d,function(e){return a(e),e.length?i(new or(e,er(e))):t(n)})})).catch(function(e){return e}):(h=!0===e.firstFields?Object.keys(c):e.firstFields||[],o=Object.keys(c),r=o.length,s=0,p=[],(t=new Promise(function(t,i){function l(e){if(p.push.apply(p,e),++s===r)return a(p),p.length?i(new or(p,er(p))):t(n)}o.length||(a(p),t(n)),o.forEach(function(e){var t,i,o,r,a,n=c[e];function s(e){o.push.apply(o,e||[]),++r===a&&i(o)}-1!==h.indexOf(e)?ir(n,d,l):(t=d,i=l,o=[],r=0,a=n.length,n.forEach(function(e){t(e,s)}))})})).catch(function(e){return e})),t}function ar(o,r){return function(e){var t,i=o.fullFields?((e,t)=>{for(var i=e,o=0;o<t.length;o++){if(null==i)return i;i=i[t[o]]}return i})(r,o.fullFields):r[e.field||o.fullField];return(t=e)&&void 0!==t.message?(e.field=e.field||o.fullField,e.fieldValue=i,e):{message:"function"==typeof e?e():e,fieldValue:i,field:e.field||o.fullField}}}function nr(e,t){if(t)for(var i in t){var o;t.hasOwnProperty(i)&&("object"==typeof(o=t[i])&&"object"==typeof e[i]?e[i]=Yo({},e[i],o):e[i]=o)}return e}function sr(e,t,i,o,r,a){!e.required||i.hasOwnProperty(e.field)&&!P(t,a||e.type)||o.push(tr(r.messages.required,e.fullField))}function lr(e,t,i,o,r){var a=e.type,n=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t,a)&&!e.required)return i();F.required(e,t,o,n,r,a),P(t,a)||F.type(e,t,o,n,r)}i(n)}var cr,dr=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+\.)+[a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]{2,}))$/,hr=/^#?([a-f0-9]{6}|[a-f0-9]{3})$/i,pr={integer:function(e){return pr.number(e)&&parseInt(e,10)===e},float:function(e){return pr.number(e)&&!pr.integer(e)},array:function(e){return Array.isArray(e)},regexp:function(e){if(e instanceof RegExp)return!0;try{return!!new RegExp(e)}catch(e){return!1}},date:function(e){return"function"==typeof e.getTime&&"function"==typeof e.getMonth&&"function"==typeof e.getYear&&!isNaN(e.getTime())},number:function(e){return!isNaN(e)&&"number"==typeof e},object:function(e){return"object"==typeof e&&!pr.array(e)},method:function(e){return"function"==typeof e},email:function(e){return"string"==typeof e&&e.length<=320&&!!e.match(dr)},url:function(e){return"string"==typeof e&&e.length<=2048&&!!e.match((cr||(t="[a-fA-F\\d:]",i=function(e){return e&&e.includeBoundaries?"(?:(?<=\\s|^)(?="+t+")|(?<="+t+")(?=\\s|$))":""},r=("\n(?:\n(?:"+(e="[a-fA-F\\d]{1,4}")+":){7}(?:"+e+"|:)|                                    // 1:2:3:4:5:6:7::  1:2:3:4:5:6:7:8\n(?:"+e+":){6}(?:"+(o="(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)(?:\\.(?:25[0-5]|2[0-4]\\d|1\\d\\d|[1-9]\\d|\\d)){3}")+"|:"+e+"|:)|                             // 1:2:3:4:5:6::    1:2:3:4:5:6::8   1:2:3:4:5:6::8  1:2:3:4:5:6::1.2.3.4\n(?:"+e+":){5}(?::"+o+"|(?::"+e+"){1,2}|:)|                   // 1:2:3:4:5::      1:2:3:4:5::7:8   1:2:3:4:5::8    1:2:3:4:5::7:1.2.3.4\n(?:"+e+":){4}(?:(?::"+e+"){0,1}:"+o+"|(?::"+e+"){1,3}|:)| // 1:2:3:4::        1:2:3:4::6:7:8   1:2:3:4::8      1:2:3:4::6:7:1.2.3.4\n(?:"+e+":){3}(?:(?::"+e+"){0,2}:"+o+"|(?::"+e+"){1,4}|:)| // 1:2:3::          1:2:3::5:6:7:8   1:2:3::8        1:2:3::5:6:7:1.2.3.4\n(?:"+e+":){2}(?:(?::"+e+"){0,3}:"+o+"|(?::"+e+"){1,5}|:)| // 1:2::            1:2::4:5:6:7:8   1:2::8          1:2::4:5:6:7:1.2.3.4\n(?:"+e+":){1}(?:(?::"+e+"){0,4}:"+o+"|(?::"+e+"){1,6}|:)| // 1::              1::3:4:5:6:7:8   1::8            1::3:4:5:6:7:1.2.3.4\n(?::(?:(?::"+e+"){0,5}:"+o+"|(?::"+e+"){1,7}|:))             // ::2:3:4:5:6:7:8  ::2:3:4:5:6:7:8  ::8             ::1.2.3.4\n)(?:%[0-9a-zA-Z]{1,})?                                             // %eth0            %1\n").replace(/\s*\/\/.*$/gm,"").replace(/\n/g,"").trim(),a=new RegExp("(?:^"+o+"$)|(?:^"+r+"$)"),n=new RegExp("^"+o+"$"),s=new RegExp("^"+r+"$"),(e=function(e){return e&&e.exact?a:new RegExp("(?:"+i(e)+o+i(e)+")|(?:"+i(e)+r+i(e)+")","g")}).v4=function(e){return e&&e.exact?n:new RegExp(i(e)+o+i(e),"g")},e.v6=function(e){return e&&e.exact?s:new RegExp(""+i(e)+r+i(e),"g")},l=e.v4().source,e=e.v6().source,cr=new RegExp("(?:^"+("(?:(?:(?:[a-z]+:)?//)|www\\.)(?:\\S+(?::\\S*)?@)?(?:localhost|"+l+"|"+e+'|(?:(?:[a-z\\u00a1-\\uffff0-9][-_]*)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))(?::\\d{2,5})?(?:[/?#][^\\s"]*)?')+"$)","i")),cr));var t,i,o,r,a,n,s,l},hex:function(e){return"string"==typeof e&&!!e.match(hr)}},ur="enum",F={required:sr,whitespace:function(e,t,i,o,r){!/^\s+$/.test(t)&&""!==t||o.push(tr(r.messages.whitespace,e.fullField))},type:function(e,t,i,o,r){e.required&&void 0===t?sr(e,t,i,o,r):-1<["integer","float","array","regexp","object","method","email","number","date","url","hex"].indexOf(i=e.type)?pr[i](t)||o.push(tr(r.messages.types[i],e.fullField,e.type)):i&&typeof t!==e.type&&o.push(tr(r.messages.types[i],e.fullField,e.type))},range:function(e,t,i,o,r){var a="number"==typeof e.len,n="number"==typeof e.min,s="number"==typeof e.max,l=t,c=null,d="number"==typeof t,h="string"==typeof t,p=Array.isArray(t);if(d?c="number":h?c="string":p&&(c="array"),!c)return!1;p&&(l=t.length),h&&(l=t.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g,"_").length),a?l!==e.len&&o.push(tr(r.messages[c].len,e.fullField,e.len)):n&&!s&&l<e.min?o.push(tr(r.messages[c].min,e.fullField,e.min)):s&&!n&&l>e.max?o.push(tr(r.messages[c].max,e.fullField,e.max)):n&&s&&(l<e.min||l>e.max)&&o.push(tr(r.messages[c].range,e.fullField,e.min,e.max))},enum:function(e,t,i,o,r){e[ur]=Array.isArray(e[ur])?e[ur]:[],-1===e[ur].indexOf(t)&&o.push(tr(r.messages[ur],e.fullField,e[ur].join(", ")))},pattern:function(e,t,i,o,r){e.pattern&&(e.pattern instanceof RegExp?(e.pattern.lastIndex=0,e.pattern.test(t)||o.push(tr(r.messages.pattern.mismatch,e.fullField,t,e.pattern))):"string"!=typeof e.pattern||new RegExp(e.pattern).test(t)||o.push(tr(r.messages.pattern.mismatch,e.fullField,t,e.pattern)))}},br={string:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t,"string")&&!e.required)return i();F.required(e,t,o,a,r,"string"),P(t,"string")||(F.type(e,t,o,a,r),F.range(e,t,o,a,r),F.pattern(e,t,o,a,r),!0===e.whitespace&&F.whitespace(e,t,o,a,r))}i(a)},method:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&F.type(e,t,o,a,r)}i(a)},number:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t=""===t?void 0:t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&(F.type(e,t,o,a,r),F.range(e,t,o,a,r))}i(a)},boolean:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&F.type(e,t,o,a,r)}i(a)},regexp:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),P(t)||F.type(e,t,o,a,r)}i(a)},integer:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&(F.type(e,t,o,a,r),F.range(e,t,o,a,r))}i(a)},float:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&(F.type(e,t,o,a,r),F.range(e,t,o,a,r))}i(a)},array:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(null==t&&!e.required)return i();F.required(e,t,o,a,r,"array"),null!=t&&(F.type(e,t,o,a,r),F.range(e,t,o,a,r))}i(a)},object:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&F.type(e,t,o,a,r)}i(a)},enum:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r),void 0!==t&&F.enum(e,t,o,a,r)}i(a)},pattern:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t,"string")&&!e.required)return i();F.required(e,t,o,a,r),P(t,"string")||F.pattern(e,t,o,a,r)}i(a)},date:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t,"date")&&!e.required)return i();F.required(e,t,o,a,r),P(t,"date")||(t=t instanceof Date?t:new Date(t),F.type(e,t,o,a,r),t&&F.range(e,t.getTime(),o,a,r))}i(a)},url:lr,hex:lr,email:lr,required:function(e,t,i,o,r){var a=[],n=Array.isArray(t)?"array":typeof t;F.required(e,t,o,a,r,n),i(a)},any:function(e,t,i,o,r){var a=[];if(e.required||!e.required&&o.hasOwnProperty(e.field)){if(P(t)&&!e.required)return i();F.required(e,t,o,a,r)}i(a)}};function fr(){return{default:"Validation error on field %s",required:"%s is required",enum:"%s must be one of %s",whitespace:"%s cannot be empty",date:{format:"%s date %s is invalid for format %s",parse:"%s date could not be parsed, %s is invalid ",invalid:"%s date %s is invalid"},types:{string:"%s is not a %s",method:"%s is not a %s (function)",array:"%s is not an %s",object:"%s is not an %s",number:"%s is not a %s",date:"%s is not a %s",boolean:"%s is not a %s",integer:"%s is not an %s",float:"%s is not a %s",regexp:"%s is not a valid %s",email:"%s is not a valid %s",url:"%s is not a valid %s",hex:"%s is not a valid %s"},string:{len:"%s must be exactly %s characters",min:"%s must be at least %s characters",max:"%s cannot be longer than %s characters",range:"%s must be between %s and %s characters"},number:{len:"%s must equal %s",min:"%s cannot be less than %s",max:"%s cannot be greater than %s",range:"%s must be between %s and %s"},array:{len:"%s must be exactly %s in length",min:"%s cannot be less than %s in length",max:"%s cannot be greater than %s in length",range:"%s must be between %s and %s in length"},pattern:{mismatch:"%s value %s does not match pattern %s"},clone:function(){var e=JSON.parse(JSON.stringify(this));return e.clone=this.clone,e}}}var gr=fr(),mr=(()=>{function d(e){this.rules=null,this._messages=gr,this.define(e)}var e=d.prototype;return e.define=function(i){var o=this;if(!i)throw new Error("Cannot configure a schema with no rules");if("object"!=typeof i||Array.isArray(i))throw new Error("Rules must be an object");this.rules={},Object.keys(i).forEach(function(e){var t=i[e];o.rules[e]=Array.isArray(t)?t:[t]})},e.messages=function(e){return e&&(this._messages=nr(fr(),e)),this._messages},e.validate=function(o,e,t){var r=this,l=o,c=e=void 0===e?{}:e,a=t=void 0===t?function(){}:t;if("function"==typeof c&&(a=c,c={}),!this.rules||0===Object.keys(this.rules).length)return a&&a(null,l),Promise.resolve(l);function i(e){var t,i=[];for(var o,r=0;r<e.length;r++)o=e[r],Array.isArray(o)?i=i.concat.apply(i,o):i.push(o);i.length?(t=er(i),a(i,t)):a(null,l)}c.messages?(nr(e=(e=this.messages())===gr?fr():e,c.messages),c.messages=e):c.messages=this.messages();var n={};(c.keys||Object.keys(this.rules)).forEach(function(t){var e=r.rules[t],i=l[t];e.forEach(function(e){"function"==typeof e.transform&&(l===o&&(l=Yo({},l)),i=l[t]=e.transform(i)),(e="function"==typeof e?{validator:e}:Yo({},e)).validator=r.getValidationMethod(e),e.validator&&(e.field=t,e.fullField=e.fullField||t,e.type=r.getType(e),n[t]=n[t]||[],n[t].push({rule:e,value:i,source:l,field:t}))})});return rr(n,c,function(t,a){var n,e,s=t.rule;function i(e){void 0===e&&(e=[]);var e=Array.isArray(e)?e:[e],i=(!c.suppressWarning&&e.length&&d.warning("async-validator:",e),(e=e.length&&void 0!==s.message?[].concat(s.message):e).map(ar(s,l)));if(c.first&&i.length)return s.field,a(i);if(n){if(s.required&&!t.value)return void 0!==s.message?i=[].concat(s.message).map(ar(s,l)):c.error&&(i=[c.error(s,tr(c.messages.required,s.field))]),a(i);var o={},r=(s.defaultField&&Object.keys(t.value).map(function(e){o[e]=s.defaultField}),o=Yo({},o,t.rule.fields),{}),e=(Object.keys(o).forEach(function(e){var t=o[e],t=Array.isArray(t)?t:[t];r[e]=t.map(function(e,t){return Yo({},t,{fullField:s.fullField+"."+e,fullFields:s.fullFields?[].concat(s.fullFields,[e]):[e]})}.bind(null,e))}),new d(r));e.messages(c.messages),t.rule.options&&(t.rule.options.messages=c.messages,t.rule.options.error=c.error),e.validate(t.value,t.rule.options||c,function(e){var t=[];i&&i.length&&t.push.apply(t,i),e&&e.length&&t.push.apply(t,e),a(t.length?t:null)})}else a(i)}if(n=!("object"!==s.type&&"array"!==s.type||"object"!=typeof s.fields&&"object"!=typeof s.defaultField)&&(s.required||!s.required&&t.value),s.field=t.field,s.asyncValidator)e=s.asyncValidator(s,t.value,i,t.source,c);else if(s.validator){try{e=s.validator(s,t.value,i,t.source,c)}catch(e){null!=console.error&&console.error(e),c.suppressValidatorError||setTimeout(function(){throw e},0),i(e.message)}!0===e?i():!1===e?i("function"==typeof s.message?s.message(s.fullField||s.field):s.message||(s.fullField||s.field)+" fails"):e instanceof Array?i(e):e instanceof Error&&i(e.message)}e&&e.then&&e.then(function(){return i()},i)},function(e){i(e)},l)},e.getType=function(e){if(void 0===e.type&&e.pattern instanceof RegExp&&(e.type="pattern"),"function"!=typeof e.validator&&e.type&&!br.hasOwnProperty(e.type))throw new Error(tr("Unknown rule type %s",e.type));return e.type||"string"},e.getValidationMethod=function(e){var t,i;return"function"==typeof e.validator?e.validator:(-1!==(i=(t=Object.keys(e)).indexOf("message"))&&t.splice(i,1),1===t.length&&"required"===t[0]?br.required:br[this.getType(e)]||void 0)},d})();function vr(e){return qo.has(e.tagName)}function yr(e){for(var t of e){if(i=t,o=void 0,o=i.tagName,Ho.has(o)||"value"in i||"checked"in i&&"boolean"==typeof i.checked)return t;o=yr(Array.from(t.children));if(o)return o}var i,o;return null}mr.register=function(e,t){if("function"!=typeof t)throw new Error("Cannot register a validator by type, validator is not a function");br[e]=t},mr.warning=function(){},mr.messages=gr,mr.validators=br;var s=class extends t{constructor(){super(...arguments),this.prop="",this.label="",this.labelWidth="",this.hideMessage=!1,this.hideAsterisk=!1,this.rules=[],this.validateState="",this.validateMessage="",this.validateDisabled=!1,this.itemNode=null,this.formRules=null,this.formProps={hideAsterisk:!1,hideMessage:!1,labelWidth:"",labelSuffix:"",labelPosition:"left"},this.formModel=null,this.initialValue=null,this._labelSlotHasContent=!1,this._changeHandler=()=>this.onFieldChange(),this._blurHandler=()=>this.onFieldBlur(),this._hasUserChanged=!1,this._debouncedChange=((t,i)=>{let o=0;return function(...e){clearTimeout(o),o=setTimeout(()=>{t.apply(this,e)},i)}})(()=>{this.validateDisabled||this.validate()},200),this._contentSlotChange=()=>{var e=this.contentSlot;e&&(e=yr(e.assignedElements({flatten:!0})),this.itemNode&&(this.itemNode.removeEventListener("change",this._changeHandler),this.itemNode.removeEventListener("bzl-change",this._changeHandler),vr(this.itemNode)&&(this.itemNode.removeEventListener("blur",this._blurHandler),this.itemNode.removeEventListener("bzl-blur",this._blurHandler)),this.itemNode=null),e)&&(this.itemNode=e,this._syncControlInvalid("error"===this.validateState),e.addEventListener("change",this._changeHandler),e.addEventListener("bzl-change",this._changeHandler),vr(e))&&(e.addEventListener("blur",this._blurHandler),e.addEventListener("bzl-blur",this._blurHandler))},this._syncLabelSlotState=()=>{this._labelSlotHasContent=this._hasLabelSlotContent(this.labelSlot)},this._labelSlotChange=()=>{this._syncLabelSlotState()}}setFormProps(e){this.formProps=e}setFormModel(e){e&&this.prop&&(e=No(this.formModel=e,this.prop,!0).v,this.initialValue=e)}setRule(e){this.formRules=e}getRules(){var e=Array.isArray(this.rules)?this.rules:this.rules?[this.rules]:[],t=null==(t=this.formRules)?void 0:t[this.prop],t=Array.isArray(t)?t:t?[t]:[],e=e.length?e:t;return[].concat(e)}_syncControlInvalid(e){this.itemNode&&(e?this.itemNode.setAttribute("data-user-invalid",""):this.itemNode.removeAttribute("data-user-invalid"))}validate(i=function(){}){this.validateDisabled=!1;var e=this.getRules();e&&0!==e.length?(this.validateState="validating",new mr({[this.prop]:e}).validate({[this.prop]:this.getValue()},{firstFields:!0},(e,t)=>{this.validateState=e?"error":"success",this.validateMessage=e?e[0].message:"",this._syncControlInvalid("error"===this.validateState),i(this.validateMessage||void 0,t)})):(this._syncControlInvalid(!1),i())}clearValidate(){this.validateState="",this.validateMessage="",this.validateDisabled=!1,this._syncControlInvalid(!1)}resetField(){var e;this.validateState="",this.validateMessage="",this._hasUserChanged=!1,this._syncControlInvalid(!1),this.formModel&&this.prop&&(e=No(this.formModel,this.prop,!0),this.validateDisabled=!0,Array.isArray(this.initialValue)?e.o[e.k]=[].concat(this.initialValue):e.o[e.k]=this.initialValue,this.validateDisabled=!1)}getValue(){var e;if(this.prop&&this.formModel)return e=No(this.formModel,this.prop,!0).v,e}onFieldChange(){this._hasUserChanged=!0,this._debouncedChange()}onFieldBlur(){this.validateDisabled||this._hasUserChanged&&this.validate()}isRequired(){var e=this.getRules();return!!(this.prop&&e&&e.some(e=>e.required))}_hasLabelSlotContent(e){return!!e&&e.assignedNodes().some(e=>e.nodeType===Node.TEXT_NODE&&e.textContent.trim()||e.nodeType===Node.ELEMENT_NODE)}firstUpdated(){this._contentSlotChange(),this._syncLabelSlotState()}disconnectedCallback(){this.itemNode&&(this.itemNode.removeEventListener("change",this._changeHandler),this.itemNode.removeEventListener("bzl-change",this._changeHandler),vr(this.itemNode)&&(this.itemNode.removeEventListener("blur",this._blurHandler),this.itemNode.removeEventListener("bzl-blur",this._blurHandler)),this.itemNode=null),super.disconnectedCallback()}_itemClass(){var e=["form-item"],t=this.formProps.labelPosition,i=0<this.label.trim().length,o=0<(this.formProps.labelSuffix||"").trim().length,i=i||o||this._labelSlotHasContent,o=0<(this.labelWidth||this.formProps.labelWidth||"").trim().length,i=i||"top"!==t&&o;return"success"===this.validateState&&e.push("form-item--success"),"validating"===this.validateState&&e.push("form-item--validating"),(this.hideAsterisk||this.formProps.hideAsterisk)&&e.push("form-item--no-asterisk"),this.isRequired()&&e.push("form-item--required"),"top"===t&&e.push("form-item--label-top"),i||e.push("form-item--no-label"),e.join(" ")}_labelStyle(){var e={},t=this.labelWidth||this.formProps.labelWidth,t=(t&&(e.width=t),this.formProps.labelPosition);return"left"!==t&&"right"!==t||(e.textAlign=t),e}render(){var e=!this.formProps.hideMessage&&!this.hideMessage&&"error"===this.validateState&&!!this.validateMessage;return h`
      <div class=${this._itemClass()} part="base">
        <div class="form-item__wrapper" part="wrapper">
          <div class="form-item__label-wrapper" style=${Ko(this._labelStyle())}>
            <div class="form-item__label">
              <slot name="label" @slotchange=${this._labelSlotChange}>
                ${this.label}<span>${this.formProps.labelSuffix||""}</span>
              </slot>
            </div>
          </div>
          <div class="form-item__main">
            <div class="form-item__main-content">
              <slot @slotchange=${this._contentSlotChange}></slot>
            </div>
            ${e?h`<div class="form-item__error-msg">${this.validateMessage}</div>`:""}
          </div>
        </div>
      </div>
    `}},zr=(s.styles=[n],d([g(".form-item__main-content slot")],s.prototype,"contentSlot",2),d([g('slot[name="label"]')],s.prototype,"labelSlot",2),d([b()],s.prototype,"prop",2),d([b()],s.prototype,"label",2),d([b({attribute:"label-width"})],s.prototype,"labelWidth",2),d([b({type:Boolean,attribute:"hide-message"})],s.prototype,"hideMessage",2),d([b({type:Boolean,attribute:"hide-asterisk"})],s.prototype,"hideAsterisk",2),d([b({type:Array})],s.prototype,"rules",2),d([f()],s.prototype,"validateState",2),d([f()],s.prototype,"validateMessage",2),d([f()],s.prototype,"validateDisabled",2),d([f()],s.prototype,"itemNode",2),d([f()],s.prototype,"formRules",2),d([f()],s.prototype,"formProps",2),d([f()],s.prototype,"formModel",2),d([f()],s.prototype,"initialValue",2),d([f()],s.prototype,"_labelSlotHasContent",2),s),oo=(s.define("bzl-form-item"),o`
  :host {
    --error-color: var(--bzl-color-danger-600);
    --success-color: var(--bzl-color-success-600);

    display: inline-block;
  }

  .copy-button__button {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    background: none;
    border: none;
    border-radius: var(--bzl-border-radius-medium);
    font-size: inherit;
    color: inherit;
    padding: var(--bzl-spacing-4);
    cursor: pointer;
    transition: var(--bzl-transition-x-fast) color;
  }

  .copy-button--success .copy-button__button {
    color: var(--success-color);
  }

  .copy-button--error .copy-button__button {
    color: var(--error-color);
  }

  .copy-button__button:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .copy-button__button[disabled] {
    opacity: 0.5;
    cursor: not-allowed !important;
  }

  slot {
    display: inline-flex;
  }
`),O=class extends t{constructor(){super(...arguments),this.isCopying=!1,this.status="rest",this.value="",this.from="",this.disabled=!1,this.copyLabel="",this.successLabel="",this.errorLabel="",this.feedbackDuration=1e3,this.tooltipPlacement="top",this.hoist=!1}async handleCopy(){if(!this.disabled&&!this.isCopying){this.isCopying=!0;let i=this.value;if(this.from){var o=this.getRootNode(),r=this.from.includes("."),a=this.from.includes("[")&&this.from.includes("]");let e=this.from,t="";r?[e,t]=this.from.trim().split("."):a&&([e,t]=this.from.trim().replace(/\]$/,"").split("["));o="getElementById"in o?o.getElementById(e):null;o?i=a?o.getAttribute(t)||"":r?o[t]||"":o.textContent||"":(this.showStatus("error"),this.emit("bzl-error"))}if(i)try{await navigator.clipboard.writeText(i),this.showStatus("success"),this.emit("bzl-copy",{detail:{value:i}})}catch(e){this.showStatus("error"),this.emit("bzl-error")}else this.showStatus("error"),this.emit("bzl-error")}}async showStatus(e){let t=this.copyLabel||"复制";var i=this.successLabel||"已复制",o=this.errorLabel||"错误";let r="success"===e?this.successIcon:this.errorIcon,a=T(this,"copy.in",{dir:"ltr"}),n=T(this,"copy.out",{dir:"ltr"});this.tooltip.content="success"===e?i:o,await this.copyIcon.animate(n.keyframes,n.options).finished,this.copyIcon.hidden=!0,this.status=e,r.hidden=!1,await r.animate(a.keyframes,a.options).finished,setTimeout(async()=>{await r.animate(n.keyframes,n.options).finished,r.hidden=!0,this.status="rest",this.copyIcon.hidden=!1,await this.copyIcon.animate(a.keyframes,a.options).finished,this.tooltip.content=t,this.isCopying=!1},this.feedbackDuration)}render(){var e=this.copyLabel||"复制";return h`
      <bzl-tooltip
        class=${v({"copy-button":!0,"copy-button--success":"success"===this.status,"copy-button--error":"error"===this.status})}
        content=${e}
        placement=${this.tooltipPlacement}
        ?disabled=${this.disabled}
        ?hoist=${this.hoist}
        exportparts="
          base:tooltip__base,
          base__popup:tooltip__base__popup,
          base__arrow:tooltip__base__arrow,
          body:tooltip__body
        "
      >
        <button
          class="copy-button__button"
          part="button"
          type="button"
          ?disabled=${this.disabled}
          @click=${this.handleCopy}
        >
          <slot part="copy-icon" name="copy-icon">
            <bzl-icon name="copy-outline"></bzl-icon>
          </slot>
          <slot part="success-icon" name="success-icon" hidden>
            <bzl-icon name="right-outline"></bzl-icon>
          </slot>
          <slot part="error-icon" name="error-icon" hidden>
            <bzl-icon name="improper-outline"></bzl-icon>
          </slot>
        </button>
      </bzl-tooltip>
    `}},_r=(O.styles=[u,oo],O.dependencies={"bzl-icon":m,"bzl-tooltip":a},d([g('slot[name="copy-icon"]')],O.prototype,"copyIcon",2),d([g('slot[name="success-icon"]')],O.prototype,"successIcon",2),d([g('slot[name="error-icon"]')],O.prototype,"errorIcon",2),d([g("bzl-tooltip")],O.prototype,"tooltip",2),d([f()],O.prototype,"isCopying",2),d([f()],O.prototype,"status",2),d([b()],O.prototype,"value",2),d([b()],O.prototype,"from",2),d([b({type:Boolean,reflect:!0})],O.prototype,"disabled",2),d([b({attribute:"copy-label"})],O.prototype,"copyLabel",2),d([b({attribute:"success-label"})],O.prototype,"successLabel",2),d([b({attribute:"error-label"})],O.prototype,"errorLabel",2),d([b({attribute:"feedback-duration",type:Number})],O.prototype,"feedbackDuration",2),d([b({attribute:"tooltip-placement"})],O.prototype,"tooltipPlacement",2),d([b({type:Boolean})],O.prototype,"hoist",2),A("copy.in",{keyframes:[{scale:".25",opacity:".25"},{scale:"1",opacity:"1"}],options:{duration:100}}),A("copy.out",{keyframes:[{scale:"1",opacity:"1"},{scale:".25",opacity:"0"}],options:{duration:100}}),O),De=(O.define("bzl-copy-button"),o`
  :host {
    --width: 784px;
    --header-spacing: 24px 32px 16px;
    --body-spacing: 8px 32px;
    --footer-spacing: 24px 32px;

    display: contents;
  }

  .dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: var(--bzl-z-index-dialog);
  }

  .dialog__panel {
    position: relative;
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: var(--width);
    max-width: calc(100% - var(--bzl-spacing-9));
    max-height: calc(100% - var(--bzl-spacing-9));
    background-color: var(--bzl-panel-background-color);
    border-radius: var(--bzl-border-radius-large);
    box-shadow: var(--bzl-shadow-neutral-ultra);
  }

  .dialog__panel:focus {
    outline: none;
  }

  .dialog--no-header .dialog__panel {
    padding-top: 24px;
  }

  .dialog--no-header .dialog__body {
    padding-top: 0;
  }

  .dialog--no-footer .dialog__panel {
    padding-bottom: 24px;
  }

  .dialog--no-footer .dialog__body {
    padding-bottom: 0;
  }

  .dialog--open .dialog__panel {
    display: flex;
    opacity: 1;
  }

  .dialog__header {
    flex: 0 0 auto;
    padding: var(--header-spacing);
    border-radius: var(--bzl-border-radius-large) var(--bzl-border-radius-large) 0 0;
    background: linear-gradient(179.99998deg, #ddf5f5 0%, rgba(221, 245, 245, 0) 100%), #ffffff;
    border: 1px solid var(--bzl-color-neutral-0);
  }

  .dialog__header-main {
    flex: 1 1 auto;
    min-width: 0;
  }

  .dialog__title-row {
    display: flex;
    align-items: center;
    min-width: 0;
  }

  .dialog__status-icon {
    flex: 0 0 auto;
    font-size: 20px;
    margin-inline-end: 8px;
  }

  .dialog--type-success .dialog__status-icon {
    color: var(--bzl-color-success-600);
  }

  .dialog--type-warning .dialog__status-icon {
    color: var(--bzl-color-warning-600);
  }

  .dialog--type-danger .dialog__status-icon {
    color: var(--bzl-color-danger-600);
  }

  .dialog__header-text {
    flex: 1 1 auto;
    min-width: 0;
  }

  .dialog__title {
    flex: 1 1 auto;
    min-width: 0;
    font: inherit;
    font-size: var(--bzl-font-size-large);
    line-height: var(--bzl-line-height-x-loose);
    color: var(--bzl-color-neutral-1000);
    font-weight: var(--bzl-font-weight-bold);
    margin: 0;
  }

  .dialog__sub-title {
    margin: var(--bzl-spacing-2) 0 0;
    color: var(--bzl-color-neutral-700);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-line-height-normal);
  }

  .dialog__header-actions {
    position: absolute;
    top: var(--bzl-spacing-6);
    right: var(--bzl-spacing-6);
    z-index: 1;
    display: flex;
    flex-wrap: wrap;
    justify-content: end;
    gap: var(--bzl-spacing-2);
  }

  .dialog .dialog__header-actions .dialog__close::part(base) {
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    min-width: 24px;
    padding: 0;
    line-height: var(--bzl-line-height-normal);
    border-radius: var(--bzl-border-radius-small);
    color: var(--bzl-color-neutral-700);
    background-color: transparent;
    border: none;
  }

  .dialog .dialog__header-actions .dialog__close:not([disabled]):hover::part(base) {
    background-color: #85858514;
    color: var(--bzl-color-neutral-700);
    border: none;
  }

  .dialog .dialog__header-actions .dialog__close::part(base):focus-visible {
    outline: none;
  }

  .dialog__body {
    flex: 1 1 auto;
    display: block;
    padding: var(--body-spacing);
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    color: var(--bzl-color-neutral-800);
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    font-style: normal;
    font-weight: var(--bzl-font-weight-normal);
    line-height: var(--bzl-line-height-dense);
  }

  .dialog__footer {
    flex: 0 0 auto;
    text-align: right;
    padding: var(--footer-spacing);
  }

  .dialog__footer-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: var(--bzl-spacing-5);
  }

  .dialog:not(.dialog--has-footer) .dialog__footer {
    display: none;
  }

  .dialog__overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: var(--bzl-overlay-background-color);
  }

  .dialog--no-overlay .dialog__overlay {
    display: none;
  }

  @media (forced-colors: active) {
    .dialog__panel {
      border: solid 1px var(--bzl-color-neutral-0);
    }
  }
`),r=o`
  :host {
    display: inline-block;
    position: relative;
    width: auto;
    cursor: pointer;
  }

  /*
   * CSS Custom Properties for Button Sizing
   * These can be overridden externally to customize button dimensions
   */
  :host {
    /* XSmall size variables */
    --bzl-button-height-xsmall: 24px;

    /* Small size variables */
    --bzl-button-height-small: 28px;

    /* Default size variables */
    --bzl-button-height-default: 32px;

    /* Large size variables */
    --bzl-button-height-large: 36px;

    /* XLarge size variables */
    --bzl-button-height-xlarge: 40px;

    /* 各尺寸按钮最小宽度 */
    --bzl-button-min-width-xsmall: 52px;
    --bzl-button-min-width-small: 62px;
    --bzl-button-min-width-medium: 66px;
    --bzl-button-min-width-large: 74px;
    --bzl-button-min-width-xlarge: 82px;

    /* 带图标按钮的尺寸变量 */
    --bzl-button-height-small-with-icon: 32px;
    --bzl-button-height-default-with-icon: 36px;
    --bzl-button-height-large-with-icon: 40px;
  }

  .button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border-style: solid;
    border-width: 1px;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-font-weight-semibold);
    text-decoration: none;
    user-select: none;
    -webkit-user-select: none;
    white-space: nowrap;
    vertical-align: middle;
    box-sizing: border-box;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow;
    cursor: inherit;
  }

  .button::-moz-focus-inner {
    border: 0;
  }

  .button:focus {
    outline: none;
  }

  .button:focus-visible {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  .button--disabled {
    cursor: not-allowed;
  }

  /* When disabled, prevent mouse events from bubbling up from children */
  .button--disabled * {
    pointer-events: none;
  }

  .button__icon {
    pointer-events: none;
  }

  .button--has-icon.button--has-label .button__icon::slotted(*) {
    margin-right: 4px;
  }

  /* Margin for spinner when loading */
  .button--has-icon.button--has-label .button__icon bzl-spin {
    margin-right: 4px;
  }

  /* Icon sizing for buttons with text */
  .button--has-icon.button--has-label .button__icon::slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Icon sizing for icon-only buttons */
  .button--has-icon:not(.button--has-label) .button__icon::slotted(*) {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Icon sizing for different icon-only button sizes */
  .button--has-icon:not(.button--has-label).button--small .button__icon::slotted(*) {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .button--has-icon:not(.button--has-label).button--default .button__icon::slotted(*) {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .button--has-icon:not(.button--has-label).button--large .button__icon::slotted(*) {
    font-size: 22px;
    width: 22px;
    height: 22px;
  }

  /* Icon-only buttons - 确保宽高相同 */
  .button--has-icon:not(.button--has-label) {
    padding: 0;
    width: var(--bzl-button-height-small);
    height: var(--bzl-button-height-small);
    min-width: var(--bzl-button-height-small);
  }

  /* Icon-only buttons 不同尺寸的宽高 */
  .button--has-icon:not(.button--has-label).button--small {
    width: var(--bzl-button-height-small-with-icon);
    height: var(--bzl-button-height-small-with-icon);
    min-width: var(--bzl-button-height-small-with-icon);
  }

  .button--has-icon:not(.button--has-label).button--default {
    width: var(--bzl-button-height-default-with-icon);
    height: var(--bzl-button-height-default-with-icon);
    min-width: var(--bzl-button-height-default-with-icon);
  }

  .button--has-icon:not(.button--has-label).button--large {
    width: var(--bzl-button-height-large-with-icon);
    height: var(--bzl-button-height-large-with-icon);
    min-width: var(--bzl-button-height-large-with-icon);
  }

  .button__label::slotted(bzl-icon) {
    vertical-align: -2px;
  }

  /*
   * Primary variant styles
   */

  /* Primary - Default theme (对应原来brand) */
  .button--primary.button--theme-default {
    background-color: var(--bzl-color-boss-600);
    color: #fff;
    border: none;
  }

  .button--primary.button--theme-default:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-700);
    color: #fff;
    border: none;
  }

  .button--primary.button--theme-default.button--disabled {
    background-color: var(--bzl-color-boss-300);
    color: #fff;
    border: none;
  }

  /* Primary - Brand theme (对应原来brand-light) */
  .button--primary.button--theme-brand {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--primary.button--theme-brand:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-200);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--primary.button--theme-brand.button--disabled {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-400);
    border: none;
  }

  /* Primary - Neutral theme */
  .button--primary.button--theme-neutral {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-800);
    border: none;
  }

  .button--primary.button--theme-neutral:hover:not(.button--disabled) {
    background-color: var(--bzl-color-gray-300);
    color: var(--bzl-color-gray-800);
    border: none;
  }

  .button--primary.button--theme-neutral.button--disabled {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-600);
    border: none;
  }

  /*
   * Outline variant styles
   */

  /* Outline - Default theme (对应原来brand-light) */
  .button--outline.button--theme-default {
    border-color: var(--bzl-color-boss-500);
    background-color: transparent;
    color: var(--bzl-color-boss-700);
  }

  .button--outline.button--theme-default:hover:not(.button--disabled) {
    border-color: var(--bzl-color-boss-500);
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
  }

  .button--outline.button--theme-default.button--disabled {
    border-color: var(--bzl-color-boss-400);
    background-color: transparent;
    color: var(--bzl-color-boss-400);
  }

  /* Outline - Neutral theme */
  .button--outline.button--theme-neutral {
    border-color: var(--bzl-color-gray-400);
    background-color: transparent;
    color: var(--bzl-color-gray-800);
  }

  .button--outline.button--theme-neutral:hover:not(.button--disabled) {
    border-color: var(--bzl-color-gray-400);
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-800);
  }

  .button--outline.button--theme-neutral.button--disabled {
    border-color: var(--bzl-color-gray-400);
    background-color: transparent;
    color: var(--bzl-color-gray-600);
  }

  /*
   * Text variant styles
   */

  /* Text - Default theme (对应原来brand-light) */
  .button--text.button--theme-default {
    background-color: transparent;
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--text.button--theme-default:hover:not(.button--disabled) {
    background-color: var(--bzl-color-boss-100);
    color: var(--bzl-color-boss-700);
    border: none;
  }

  .button--text.button--theme-default.button--disabled {
    background-color: transparent;
    color: var(--bzl-color-boss-400);
    border: none;
  }

  /* Text - Neutral theme */
  .button--text.button--theme-neutral {
    background-color: transparent;
    color: var(--bzl-color-gray-900);
    border: none;
  }

  .button--text.button--theme-neutral:hover:not(.button--disabled) {
    background-color: var(--bzl-color-gray-200);
    color: var(--bzl-color-gray-900);
    border: none;
  }

  .button--text.button--theme-neutral.button--disabled {
    background-color: transparent;
    color: var(--bzl-color-gray-600);
    border: none;
  }

  /*
   * Size modifiers
   */

  .button--xsmall {
    height: var(--bzl-button-height-xsmall);
    min-width: var(--bzl-button-min-width-xsmall);
    padding: 4px 8px;
    font-size: 12px;
    line-height: var(--bzl-button-height-xsmall);
    border-radius: 6px;
  }

  .button--small {
    height: var(--bzl-button-height-small);
    min-width: var(--bzl-button-min-width-small);
    padding: 4px 10px;
    font-size: 14px;
    line-height: var(--bzl-button-height-small);
    border-radius: 8px;
  }

  /* 带图标的small按钮使用特殊高度 */
  .button--small.button--has-icon {
    height: var(--bzl-button-height-small-with-icon);
    line-height: var(--bzl-button-height-small-with-icon);
  }

  .button--default {
    height: var(--bzl-button-height-default);
    min-width: var(--bzl-button-min-width-medium);
    padding: 4px 12px;
    font-size: 14px;
    line-height: var(--bzl-button-height-default);
    border-radius: 8px;
  }

  /* 带图标的default按钮使用特殊高度 */
  .button--default.button--has-icon {
    height: var(--bzl-button-height-default-with-icon);
    line-height: var(--bzl-button-height-default-with-icon);
  }

  .button--large {
    height: var(--bzl-button-height-large);
    min-width: var(--bzl-button-min-width-large);
    padding: 6px 16px;
    font-size: 14px;
    line-height: var(--bzl-button-height-large);
    border-radius: 8px;
  }

  /* 带图标的large按钮使用特殊高度 */
  .button--large.button--has-icon {
    height: var(--bzl-button-height-large-with-icon);
    line-height: var(--bzl-button-height-large-with-icon);
  }

  .button--xlarge {
    height: var(--bzl-button-height-xlarge);
    min-width: var(--bzl-button-min-width-xlarge);
    padding: 8px 20px;
    font-size: 14px;
    line-height: var(--bzl-button-height-xlarge);
    border-radius: 8px;
  }

  /*
   * Shape variants
   */

  /* Default shape with size-specific border radius */
  .button--shape-default.button--xsmall {
    border-radius: 6px;
  }

  .button--shape-default.button--small,
  .button--shape-default.button--default,
  .button--shape-default.button--large,
  .button--shape-default.button--xlarge {
    border-radius: 8px;
  }

  /* Round */
  .button--round {
    border-radius: 100px;
  }

  /* Circle */
  .button--circle {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    min-width: auto;
    padding: 0px;
  }

  .button--circle .button__label {
    display: none;
  }

  /* Hide user-provided icon content when loading */
  .button--loading .button__icon::slotted(*) {
    display: none;
  }

  .button--loading bzl-spin {
    --indicator-color: currentColor;
  }

  /* For icon-only buttons, use larger spinner */
  .button--loading.button--has-icon:not(.button--has-label) bzl-spin {
    font-size: 16px;
    width: 16px;
    height: 16px;
  }

  /* Loading spinner for different icon-only button sizes */
  .button--loading.button--has-icon:not(.button--has-label).button--small bzl-spin {
    font-size: 18px;
    width: 18px;
    height: 18px;
  }

  .button--loading.button--has-icon:not(.button--has-label).button--default bzl-spin {
    font-size: 20px;
    width: 20px;
    height: 20px;
  }

  .button--loading.button--has-icon:not(.button--has-label).button--large bzl-spin {
    font-size: 22px;
    width: 22px;
    height: 22px;
  }

  /*
   * Button spacing - No padding, elements are centered
   */

  /*
   * Button groups support
   */

  :host([data-bzl-button-group__button--first]:not([data-bzl-button-group__button--last])) .button {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
  }

  :host([data-bzl-button-group__button--inner]) .button {
    border-radius: 0;
  }

  :host([data-bzl-button-group__button--last]:not([data-bzl-button-group__button--first])) .button {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
  }

  /* All except the first */
  :host([data-bzl-button-group__button]:not([data-bzl-button-group__button--first])) {
    margin-inline-start: calc(-1 * 1px);
  }

  /* Bump hovered, focused, and checked buttons up so their focus ring isn't clipped */
  :host([data-bzl-button-group__button--hover]) {
    z-index: 1;
  }

  /* Focus and checked are always on top */
  :host([data-bzl-button-group__button--focus]),
  :host([data-bzl-button-group__button][checked]) {
    z-index: 2;
  }
`,xr=Symbol.for(""),wr=(o,...e)=>({_$litStatic$:e.reduce((e,t,i)=>e+(()=>{if(void 0!==t._$litStatic$)return t._$litStatic$;throw Error(`Value passed to 'literal' function must be a 'literal' result: ${t}. Use 'unsafeStatic' to pass non-literal values, but
            take care to ensure page security.`)})()+o[i+1],o[0]),r:xr}),kr=new Map,n=p=>(e,...t)=>{var i=t.length;let o,r;var a,n,s=[],l=[];let c,d=0,h=!1;for(;d<i;){for(c=e[d];d<i&&void 0!==(r=t[d],o=(null==(a=r)?void 0:a.r)!==xr||null==a?void 0:a._$litStatic$);)c+=o+e[++d],h=!0;d!==i&&l.push(r),s.push(c),d++}return d===i&&s.push(e[i]),h&&(n=s.join("$$lit$$"),void 0===(e=kr.get(n))&&kr.set(n,e=s.raw=s),t=l),p(e,...t)},Cr=n(h),s=(n(i),n(e),class extends t{constructor(){super(...arguments),this.formControlController=new zt(this,{assumeInteractionOn:["click"]}),this.hasSlotController=new Ct(this,"[default]","icon"),this.invalid=!1,this.title="",this.size="default",this.variant="primary",this.shape="default",this.disabled=!1,this.loading=!1,this.type="button",this.name="",this.value="",this.href="",this.rel="noreferrer noopener"}get effectiveSize(){return!(this.hasSlotController.test("icon")||this.loading)||"xsmall"!==this.size&&"xlarge"!==this.size?this.size:"default"}get validity(){return this.isButton()?this.button.validity:_t}get validationMessage(){return this.isButton()?this.button.validationMessage:""}firstUpdated(){this.isButton()&&this.formControlController.updateValidity()}handleClick(e){var t;this.disabled||this.loading?e.preventDefault():this.isButton()&&("submit"===this.type&&this.formControlController.submit(this),"reset"===this.type)&&(e=this.formControlController.getForm()||this.closest("form"))&&(t=new Event("reset",{bubbles:!0,cancelable:!0}),e.dispatchEvent(t))}isButton(){return!this.href}isLink(){return!!this.href}handleDisabledChange(){this.isButton()&&this.formControlController.setValidity(this.disabled)}checkValidity(){var e;return!this.isButton()||"button"===this.type||((e=this.button.checkValidity())||this.disabled||this.emit("bzl-invalid",{bubbles:!1,cancelable:!0,composed:!1}),e)}getForm(){return this.formControlController.getForm()}reportValidity(){var e;return!this.isButton()||"button"===this.type||((e=this.button.reportValidity())||this.disabled||this.emit("bzl-invalid",{bubbles:!1,cancelable:!0,composed:!1}),e)}setCustomValidity(e){this.isButton()&&(this.button.setCustomValidity(e),this.formControlController.updateValidity())}render(){var e=this.isLink(),t=e?wr`a`:wr`button`;return Cr`
      <${t}
        part="base"
        class=${v({button:!0,"button--primary":"primary"===this.variant,"button--outline":"outline"===this.variant,"button--text":"text"===this.variant,"button--xsmall":"xsmall"===this.effectiveSize,"button--small":"small"===this.effectiveSize,"button--default":"default"===this.effectiveSize,"button--large":"large"===this.effectiveSize,"button--xlarge":"xlarge"===this.effectiveSize,"button--theme-default":"default"===(this.theme||"default"),"button--theme-brand":"brand"===(this.theme||"default"),"button--theme-neutral":"neutral"===(this.theme||"default"),"button--shape-default":"default"===this.shape,"button--round":"round"===this.shape,"button--circle":"circle"===this.shape,"button--disabled":this.disabled,"button--loading":this.loading,"button--rtl":!1,"button--has-label":this.hasSlotController.test("[default]"),"button--has-icon":this.hasSlotController.test("icon")||this.loading})}
        ?disabled=${D(e?void 0:this.disabled)}
        type=${D(e?void 0:this.type)}
        title=${this.title}
        name=${D(e?void 0:this.name)}
        value=${D(e?void 0:this.value)}
        href=${D(e&&!this.disabled?this.href:void 0)}
        target=${D(e?this.target:void 0)}
        download=${D(e?this.download:void 0)}
        rel=${D(e?this.rel:void 0)}
        role=${D(e?void 0:"button")}
        aria-disabled=${this.disabled?"true":"false"}
        tabindex=${this.disabled?"-1":"0"}
        @click=${this.handleClick}
      >
        <slot name="icon" part="icon" class="button__icon">
          ${this.loading?Cr`<bzl-spin size="xsmall"></bzl-spin>`:""}
        </slot>
        <slot part="label" class="button__label"></slot>
      </${t}>
    `}});s.styles=[u,r],s.dependencies={"bzl-icon":m,"bzl-spin":x},d([g(".button")],s.prototype,"button",2),d([f()],s.prototype,"invalid",2),d([b()],s.prototype,"title",2),d([b({reflect:!0})],s.prototype,"size",2),d([b({reflect:!0})],s.prototype,"variant",2),d([b({reflect:!0})],s.prototype,"theme",2),d([b({reflect:!0})],s.prototype,"shape",2),d([b({type:Boolean,reflect:!0})],s.prototype,"disabled",2),d([b({type:Boolean,reflect:!0})],s.prototype,"loading",2),d([b()],s.prototype,"type",2),d([b()],s.prototype,"name",2),d([b()],s.prototype,"value",2),d([b()],s.prototype,"href",2),d([b()],s.prototype,"target",2),d([b()],s.prototype,"rel",2),d([b()],s.prototype,"download",2),d([b()],s.prototype,"form",2),d([b({attribute:"formaction"})],s.prototype,"formAction",2),d([b({attribute:"formenctype"})],s.prototype,"formEnctype",2),d([b({attribute:"formmethod"})],s.prototype,"formMethod",2),d([b({attribute:"formnovalidate",type:Boolean})],s.prototype,"formNoValidate",2),d([b({attribute:"formtarget"})],s.prototype,"formTarget",2),d([p("disabled",{waitUntilFirstUpdate:!0})],s.prototype,"handleDisabledChange",1);function*$r(e=document.activeElement){null!=e&&(yield e,"shadowRoot"in e)&&e.shadowRoot&&"closed"!==e.shadowRoot.mode&&(yield*Ge($r(e.shadowRoot.activeElement)))}var Sr=new WeakMap;function Er(e){let t=Sr.get(e);return t||(t=window.getComputedStyle(e,null),Sr.set(e,t)),t}function Ar(e){var t,i,o=e.tagName.toLowerCase(),r=Number(e.getAttribute("tabindex"));return!(e.hasAttribute("tabindex")&&(isNaN(r)||r<=-1)||e.hasAttribute("disabled")||e.closest("[inert]"))&&("input"===o&&"radio"===e.getAttribute("type")?(r=e.getRootNode(),i=`input[type='radio'][name="${e.getAttribute("name")}"]`,(t=r.querySelector(i+":checked"))?t===e:r.querySelector(i)===e):!("function"==typeof(t=e).checkVisibility?!t.checkVisibility({checkOpacity:!1,checkVisibilityCSS:!0}):"hidden"===(t=Er(t)).visibility||"none"===t.display)&&(("audio"===o||"video"===o)&&e.hasAttribute("controls")||e.hasAttribute("tabindex")||e.hasAttribute("contenteditable")&&"false"!==e.getAttribute("contenteditable")||["button","input","select","textarea","a","audio","video","summary","iframe"].includes(o)||({overflowY:i,overflowX:o}=Er(r=e),"scroll"===i)||"scroll"===o||"auto"===i&&"auto"===o&&(r.scrollHeight>r.clientHeight&&"auto"===i||r.clientWidth<r.scrollWidth&&"auto"===o)))}function Tr(a){let n=new WeakMap,s=[];return function t(e){if(e instanceof Element){if(e.hasAttribute("inert")||e.closest("[inert]"))return;if(n.has(e))return;n.set(e,!0),!s.includes(e)&&Ar(e)&&s.push(e),e instanceof HTMLSlotElement&&(o=a,(null==(i=(i=e).getRootNode({composed:!0}))?void 0:i.host)!==o)&&e.assignedElements({flatten:!0}).forEach(e=>{t(e)}),null!==e.shadowRoot&&"open"===e.shadowRoot.mode&&t(e.shadowRoot)}var i,o,r;for(r of e.children)t(r)}(a),s.sort((e,t)=>{e=Number(e.getAttribute("tabindex"))||0;return(Number(t.getAttribute("tabindex"))||0)-e})}var Dr=[],Or=class{constructor(e){this.tabDirection="forward",this.handleFocusIn=()=>{this.isActive()&&this.checkFocus()},this.handleKeyDown=i=>{if("Tab"===i.key&&!this.isExternalActivated&&this.isActive()){let t=[...$r()].pop();if(this.previousFocus=t,!this.previousFocus||!this.possiblyHasTabbableChildren(this.previousFocus)){i.shiftKey?this.tabDirection="backward":this.tabDirection="forward";var o=Tr(this.element);let e=o.findIndex(e=>e===t);this.previousFocus=this.currentFocus;for(var r="forward"===this.tabDirection?1:-1;;){e+r>=o.length?e=0:e+r<0?e=o.length-1:e+=r,this.previousFocus=this.currentFocus;var a=o[e];if("backward"===this.tabDirection&&this.previousFocus&&this.possiblyHasTabbableChildren(this.previousFocus))return;if(a&&this.possiblyHasTabbableChildren(a))return;i.preventDefault(),this.currentFocus=a,null!=(a=this.currentFocus)&&a.focus({preventScroll:!1});a=[...$r()];if(a.includes(this.currentFocus)||!a.includes(this.previousFocus))break}setTimeout(()=>this.checkFocus())}}},this.handleKeyUp=()=>{this.tabDirection="forward"},this.element=e,this.elementsWithTabbableControls=["iframe"]}activate(){Dr.push(this.element),document.addEventListener("focusin",this.handleFocusIn),document.addEventListener("keydown",this.handleKeyDown),document.addEventListener("keyup",this.handleKeyUp)}deactivate(){Dr=Dr.filter(e=>e!==this.element),this.currentFocus=null,document.removeEventListener("focusin",this.handleFocusIn),document.removeEventListener("keydown",this.handleKeyDown),document.removeEventListener("keyup",this.handleKeyUp)}isActive(){return Dr[Dr.length-1]===this.element}activateExternal(){this.isExternalActivated=!0}deactivateExternal(){this.isExternalActivated=!1}checkFocus(){var e,t;this.isActive()&&!this.isExternalActivated&&(e=Tr(this.element),this.element.matches(":focus-within")||(t=e[0],e=e[e.length-1],"function"==typeof(null==(t="forward"===this.tabDirection?t:e)?void 0:t.focus)&&(this.currentFocus=t).focus({preventScroll:!1})))}possiblyHasTabbableChildren(e){return this.elementsWithTabbableControls.includes(e.tagName.toLowerCase())||e.hasAttribute("controls")}},Pr={success:"pass-face",warning:"tip-face2",danger:"close-face1"},Fr=new Set(["default","success","warning","danger"]),L=class extends t{constructor(){super(...arguments),this.hasSlotController=new Ct(this,"footer"),this.modal=new Or(this),this.open=!1,this.title="",this.subTitle="",this.type="default",this.noHeader=!1,this.noFooter=!1,this.noClose=!1,this.noOverlay=!1,this.noCloseOnOverlay=!1,this.noCancel=!1,this.cancelText="取消",this.noConfirm=!1,this.confirmText="确定",this.handleDocumentKeyDown=e=>{"Escape"===e.key&&this.modal.isActive()&&this.open&&(e.stopPropagation(),this.requestClose("keyboard"))},this.handleOverlayClick=()=>{this.noCloseOnOverlay||this.requestClose("overlay")}}get hasFooterSlot(){return this.hasSlotController.test("footer")}get showDefaultFooterActions(){return!(this.hasFooterSlot||this.noCancel&&this.noConfirm)}get hasVisibleFooter(){return!this.noFooter&&(this.hasFooterSlot||this.showDefaultFooterActions)}getAnimationDir(){return"rtl"===(this.dir||document.documentElement.getAttribute("dir")||"ltr").toLowerCase()?"rtl":"ltr"}firstUpdated(){this.dialog.hidden=!this.open,this.open&&(this.addOpenListeners(),this.modal.activate(),So(this))}disconnectedCallback(){super.disconnectedCallback(),this.modal.deactivate(),Eo(this),this.removeOpenListeners()}async runBeforeHook(e){return!e||await e()}async runBeforeCancel(e){return!this.beforeCancel||await this.beforeCancel(e)}async dispatchCancel(e){return!!await this.runBeforeCancel(e)&&!this.emit("bzl-cancel",{cancelable:!0}).defaultPrevented}async handleDefaultConfirm(){await this.runBeforeHook(this.beforeConfirm)&&!this.emit("bzl-confirm",{cancelable:!0}).defaultPrevented&&this.hide()}async handleDefaultCancel(){await this.runBeforeHook(this.beforeBtnCancel)&&!this.emit("bzl-btn-cancel",{cancelable:!0}).defaultPrevented&&await this.hideAfterCancel("cancel-button")}async hideAfterCancel(e){await this.dispatchCancel(e)&&this.hide()}async requestClose(e){var t;this.emit("bzl-request-close",{cancelable:!0,detail:{source:e}}).defaultPrevented?(t=T(this,"dialog.denyClose",{dir:this.getAnimationDir()}),S(this.panel,t.keyframes,t.options)):await this.hideAfterCancel(e)}addOpenListeners(){var e;"CloseWatcher"in window?(null!=(e=this.closeWatcher)&&e.destroy(),this.closeWatcher=new CloseWatcher,this.closeWatcher.onclose=()=>{this.requestClose("keyboard")}):document.addEventListener("keydown",this.handleDocumentKeyDown)}removeOpenListeners(){var e;null!=(e=this.closeWatcher)&&e.destroy(),document.removeEventListener("keydown",this.handleDocumentKeyDown)}async handleOpenChange(){var t=this.getAnimationDir();if(this.open){this.emit("bzl-show"),this.addOpenListeners(),this.originalTrigger=document.activeElement,this.modal.activate(),So(this);let e=this.querySelector("[autofocus]");e&&e.removeAttribute("autofocus"),await Promise.all([E(this.dialog),E(this.overlay)]),this.dialog.hidden=!1,requestAnimationFrame(()=>{this.emit("bzl-initial-focus",{cancelable:!0}).defaultPrevented||(e||this.panel).focus({preventScroll:!0}),e&&e.setAttribute("autofocus","")});var i,o=T(this,"dialog.show",{dir:t}),o=S(this.panel,o.keyframes,o.options);this.noOverlay?await o:(i=T(this,"dialog.overlay.show",{dir:t}),await Promise.all([o,S(this.overlay,i.keyframes,i.options)])),this.emit("bzl-after-show")}else{o=this,(i=document.activeElement)&&o.contains(i)&&null!=(o=document.activeElement)&&o.blur(),this.emit("bzl-hide"),this.removeOpenListeners(),this.modal.deactivate(),await Promise.all([E(this.dialog),E(this.overlay)]);var r=T(this,"dialog.hide",{dir:t}),r=S(this.panel,r.keyframes,r.options).then(()=>{this.panel.hidden=!0});this.noOverlay?await r:(t=T(this,"dialog.overlay.hide",{dir:t}),await Promise.all([S(this.overlay,t.keyframes,t.options).then(()=>{this.overlay.hidden=!0}),r])),this.dialog.hidden=!0,this.overlay.hidden=!1,this.panel.hidden=!1,Eo(this);let e=this.originalTrigger;"function"==typeof(null==e?void 0:e.focus)&&setTimeout(()=>e.focus()),this.emit("bzl-after-hide")}}handleTypeChange(){Fr.has(this.type)||(this.type="default")}getStatusIcon(){if("default"!==this.type)return Pr[this.type]}async show(){if(!this.open)return this.open=!0,Xi(this,"bzl-after-show")}async hide(){if(this.open)return this.open=!1,Xi(this,"bzl-after-hide")}render(){var e=this.getStatusIcon();return h`
      <div
        part="base"
        class=${v({dialog:!0,"dialog--open":this.open,"dialog--no-header":this.noHeader,"dialog--no-footer":this.noFooter,"dialog--has-footer":this.hasVisibleFooter,"dialog--type-success":"success"===this.type,"dialog--type-warning":"warning"===this.type,"dialog--type-danger":"danger"===this.type,"dialog--no-overlay":this.noOverlay})}
      >
        <div part="overlay" class="dialog__overlay" @click=${this.handleOverlayClick} tabindex="-1"></div>

        <div
          part="panel"
          class="dialog__panel"
          role="dialog"
          aria-modal="true"
          aria-hidden=${this.open?"false":"true"}
          aria-label=${D(this.noHeader?this.title:void 0)}
          aria-labelledby=${D(this.noHeader?void 0:"title")}
          tabindex="-1"
        >
          ${this.noHeader?"":h`
                <header part="header" class="dialog__header">
                  <div part="header-main" class="dialog__header-main">
                    <div class="dialog__header-text">
                      <div class="dialog__title-row">
                        ${e?h`<bzl-icon
                              part="status-icon"
                              class="dialog__status-icon"
                              name=${e}
                            ></bzl-icon>`:""}
                        <h2 part="title" class="dialog__title" id="title">
                          ${0<this.title.length?this.title:String.fromCharCode(65279)}
                        </h2>
                      </div>
                      ${this.subTitle?h`<p part="sub-title" class="dialog__sub-title">${this.subTitle}</p>`:""}
                    </div>
                  </div>
                </header>
              `}
          ${this.noClose?"":h`
                <div class="dialog__header-actions">
                  <bzl-button
                    part="close-button"
                    exportparts="base:close-button__base"
                    class="dialog__close"
                    variant="text"
                    size="small"
                    shape="circle"
                    title="关闭"
                    @click="${()=>{this.requestClose("close-button")}}"
                  >
                    <bzl-icon slot="icon" name="improper-outline"></bzl-icon>
                  </bzl-button>
                </div>
              `}
          <div part="body" class="dialog__body" tabindex="-1"><slot></slot></div>

          <footer part="footer" class="dialog__footer">
            <slot name="footer"></slot>
            ${this.showDefaultFooterActions?h`
                  <div class="dialog__footer-actions">
                    ${this.noCancel?"":h`
                          <bzl-button
                            part="cancel-button"
                            exportparts="base:cancel-button__base"
                            class="dialog__footer-cancel"
                            variant="outline"
                            theme="neutral"
                            @click=${()=>{this.handleDefaultCancel()}}
                          >
                            ${this.cancelText}
                          </bzl-button>
                        `}
                    ${this.noConfirm?"":h`
                          <bzl-button
                            part="confirm-button"
                            exportparts="base:confirm-button__base"
                            class="dialog__footer-confirm"
                            variant="primary"
                            @click=${()=>{this.handleDefaultConfirm()}}
                          >
                            ${this.confirmText}
                          </bzl-button>
                        `}
                  </div>
                `:""}
          </footer>
        </div>
      </div>
    `}},Lr=(L.styles=[u,De],L.dependencies={"bzl-button":s,"bzl-icon":m},d([g(".dialog")],L.prototype,"dialog",2),d([g(".dialog__panel")],L.prototype,"panel",2),d([g(".dialog__overlay")],L.prototype,"overlay",2),d([b({type:Boolean,reflect:!0})],L.prototype,"open",2),d([b({reflect:!0})],L.prototype,"title",2),d([b({attribute:"sub-title",reflect:!0})],L.prototype,"subTitle",2),d([b({reflect:!0})],L.prototype,"type",2),d([b({attribute:"no-header",type:Boolean,reflect:!0})],L.prototype,"noHeader",2),d([b({attribute:"no-footer",type:Boolean,reflect:!0})],L.prototype,"noFooter",2),d([b({attribute:"no-close",type:Boolean,reflect:!0})],L.prototype,"noClose",2),d([b({attribute:"no-overlay",type:Boolean,reflect:!0})],L.prototype,"noOverlay",2),d([b({attribute:"no-close-on-overlay",type:Boolean,reflect:!0})],L.prototype,"noCloseOnOverlay",2),d([b({attribute:"no-cancel",type:Boolean,reflect:!0})],L.prototype,"noCancel",2),d([b({attribute:"cancel-text",reflect:!0})],L.prototype,"cancelText",2),d([b({attribute:"no-confirm",type:Boolean,reflect:!0})],L.prototype,"noConfirm",2),d([b({attribute:"confirm-text",reflect:!0})],L.prototype,"confirmText",2),d([b({attribute:!1})],L.prototype,"beforeConfirm",2),d([b({attribute:!1})],L.prototype,"beforeCancel",2),d([b({attribute:!1})],L.prototype,"beforeBtnCancel",2),d([p("open",{waitUntilFirstUpdate:!0})],L.prototype,"handleOpenChange",1),d([p("type")],L.prototype,"handleTypeChange",1),A("dialog.show",{keyframes:[{opacity:0,scale:.8},{opacity:1,scale:1}],options:{duration:250,easing:"ease"}}),A("dialog.hide",{keyframes:[{opacity:1,scale:1},{opacity:0,scale:.8}],options:{duration:250,easing:"ease"}}),A("dialog.denyClose",{keyframes:[{scale:1},{scale:1.02},{scale:1}],options:{duration:250}}),A("dialog.overlay.show",{keyframes:[{opacity:0},{opacity:1}],options:{duration:250}}),A("dialog.overlay.hide",{keyframes:[{opacity:1},{opacity:0}],options:{duration:250}}),L),Mr=(L.define("bzl-dialog"),class Jr{static getInstance(){return Jr.instance||(Jr.instance=new Jr),Jr.instance}constructor(){customElements.get("bzl-dialog")||L.define("bzl-dialog")}open(t){let i=document.createElement("bzl-dialog");if(void 0!==t.title&&(i.title=t.title),void 0!==t.subTitle&&(i.subTitle=t.subTitle),void 0!==t.type&&(i.type=t.type),void 0!==t.noHeader&&(i.noHeader=t.noHeader),void 0!==t.noClose&&(i.noClose=t.noClose),void 0!==t.noOverlay&&(i.noOverlay=t.noOverlay),void 0!==t.noCloseOnOverlay&&(i.noCloseOnOverlay=t.noCloseOnOverlay),void 0!==t.noCancel&&(i.noCancel=t.noCancel),void 0!==t.noConfirm&&(i.noConfirm=t.noConfirm),void 0!==t.noFooter&&(i.noFooter=t.noFooter),void 0!==t.cancelText&&(i.cancelText=t.cancelText),void 0!==t.confirmText&&(i.confirmText=t.confirmText),void 0!==t.dialogClass){var e=t.dialogClass.trim();if(e)for(var o of e.split(/\s+/))o&&i.classList.add(o)}void 0!==t.width&&(e="number"==typeof t.width?t.width+"px":t.width,i.style.setProperty("--width",e)),void 0!==t.beforeConfirm&&(i.beforeConfirm=t.beforeConfirm),void 0!==t.beforeCancel&&(i.beforeCancel=t.beforeCancel),void 0!==t.beforeBtnCancel&&(i.beforeBtnCancel=t.beforeBtnCancel),t.btnCancel&&i.addEventListener("bzl-btn-cancel",()=>t.btnCancel()),t.cancel&&i.addEventListener("bzl-cancel",()=>t.cancel()),t.confirm&&i.addEventListener("bzl-confirm",()=>t.confirm()),t.open&&i.addEventListener("bzl-after-show",()=>t.open());var r,e=document.createElement("div");let a,n=!1,s=()=>{if(!n&&(n=!0,a))try{a()}catch(e){}};void 0!==t.renderContent?("function"==typeof(r=t.renderContent(e))&&(a=r),i.appendChild(e)):t.content&&i.appendChild(document.createTextNode(t.content));i.addEventListener("bzl-after-hide",()=>{var e;null!=(e=t.close)&&e.call(t),s(),i.parentNode&&i.parentNode.removeChild(i)}),document.body.appendChild(i),setTimeout(()=>{i.show()},0);let l=!1;return{close:()=>{l||(l=!0,i.isConnected?i.hide():s())}}}}),Rr=Mr.getInstance(),Vr={open:e=>Rr.open(e)},oo=o`
  :host {
    display: inline-block;
    line-height: 0;
  }

  .checkbox {
    position: relative;
    display: inline-flex;
    align-items: center;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    color: var(--bzl-input-label-color);
    cursor: pointer;
    --toggle-size: var(--bzl-toggle-size-medium);
    font-size: var(--bzl-input-font-size-medium);
    vertical-align: middle;
  }

  .checkbox__control {
    flex: 0 0 auto;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: var(--toggle-size);
    height: var(--toggle-size);
    box-sizing: border-box;
    border: solid var(--bzl-toggle-border-width) var(--bzl-input-border-color);
    border-radius: var(--bzl-border-radius-x-small);
    background-color: var(--bzl-input-background-color);
    color: var(--bzl-color-neutral-0);
    transition:
      var(--bzl-transition-fast) border-color,
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) box-shadow;
  }

  .checkbox__input {
    position: absolute;
    opacity: 0;
    padding: 0;
    margin: 0;
    pointer-events: none;
  }

  .checkbox__checked-icon,
  .checkbox__indeterminate-icon {
    display: inline-flex;
    font-size: var(--toggle-size);
  }

  /* Hover */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--bzl-input-border-color-hover);
    background-color: var(--bzl-input-background-color-hover);
  }

  /* Focus */
  .checkbox:not(.checkbox--checked):not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Checked/indeterminate */
  .checkbox--checked .checkbox__control,
  .checkbox--indeterminate .checkbox__control {
    border-color: var(--bzl-color-primary-600);
    background-color: var(--bzl-color-primary-600);
  }

  /* Checked/indeterminate + hover */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__control:hover,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__control:hover {
    border-color: var(--bzl-color-primary-700);
    background-color: var(--bzl-color-primary-700);
  }

  /* Checked/indeterminate + focus */
  .checkbox.checkbox--checked:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control,
  .checkbox.checkbox--indeterminate:not(.checkbox--disabled) .checkbox__input:focus-visible ~ .checkbox__control {
    outline: var(--bzl-focus-ring);
    outline-offset: var(--bzl-focus-ring-offset);
  }

  /* Disabled */
  .checkbox--disabled {
    /* opacity: 0.5; */
    cursor: not-allowed;
  }

  .checkbox.checkbox--disabled .checkbox__control {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color);
    color: var(--bzl-color-neutral-500);
  }

  .checkbox.checkbox--disabled .checkbox__label {
    color: var(--bzl-input-color-disabled);
  }

  .checkbox__label {
    display: inline-block;
    color: var(--bzl-input-label-color);
    line-height: var(--bzl-line-height-dense);
    margin-inline-start: var(--bzl-spacing-4);
    user-select: none;
    -webkit-user-select: none;
  }
`,a=class extends t{constructor(){super(...arguments),this.hasFocus=!1,this.name="",this.disabled=!1,this.checked=!1,this.indeterminate=!1}handleClick(){this.checked=!this.checked,this.indeterminate=!1,this.emit("bzl-change")}handleBlur(){this.hasFocus=!1,this.emit("bzl-blur")}handleInput(){this.emit("bzl-input")}handleFocus(){this.hasFocus=!0,this.emit("bzl-focus")}handleStateChange(){this.input.checked=this.checked,this.input.indeterminate=this.indeterminate}render(){return h`
      <label
        part="base"
        class=${v({checkbox:!0,"checkbox--checked":this.checked,"checkbox--disabled":this.disabled,"checkbox--focused":this.hasFocus,"checkbox--indeterminate":this.indeterminate})}
      >
        <input
          class="checkbox__input"
          type="checkbox"
          name=${this.name}
          value=${D(this.value)}
          .indeterminate=${ro(this.indeterminate)}
          .checked=${ro(this.checked)}
          .disabled=${this.disabled}
          aria-checked=${this.checked?"true":"false"}
          @click=${this.handleClick}
          @input=${this.handleInput}
          @blur=${this.handleBlur}
          @focus=${this.handleFocus}
        />

        <span
          part="control${this.checked?" control--checked":""}${this.indeterminate?" control--indeterminate":""}"
          class="checkbox__control"
        >
          ${this.checked?h` <bzl-icon part="checked-icon" class="checkbox__checked-icon" name="checkall-outline"></bzl-icon> `:""}
          ${!this.checked&&this.indeterminate?h`
                <bzl-icon
                  part="indeterminate-icon"
                  class="checkbox__indeterminate-icon"
                  name="checkpart-outline"
                ></bzl-icon>
              `:""}
        </span>

        <div part="label" class="checkbox__label">
          <slot></slot>
        </div>
      </label>
    `}},O=(a.styles=[u,_,oo],a.dependencies={"bzl-icon":m},d([g('input[type="checkbox"]')],a.prototype,"input",2),d([f()],a.prototype,"hasFocus",2),d([b()],a.prototype,"name",2),d([b()],a.prototype,"value",2),d([b({type:Boolean,reflect:!0})],a.prototype,"disabled",2),d([b({type:Boolean,reflect:!0})],a.prototype,"checked",2),d([b({type:Boolean,reflect:!0})],a.prototype,"indeterminate",2),d([p(["checked","indeterminate"],{waitUntilFirstUpdate:!0})],a.prototype,"handleStateChange",1),o`
  :host {
    display: inline-block;
    --bzl-cascader-panel-column-width: 180px;
    --bzl-cascader-panel-option-height: 36px;
    font-size: var(--bzl-font-size-small);
  }

  .cascader__panel {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    box-sizing: border-box;
    max-height: calc(var(--bzl-cascader-panel-option-height) * 5.5 + var(--bzl-spacing-2) * 2);
    border-radius: var(--bzl-border-radius-regular);
    background-color: var(--bzl-color-neutral-0);
    box-shadow: var(--bzl-shadow-neutral-light);
    border: var(--bzl-input-border-width) solid var(--bzl-color-neutral-300);
    overflow: hidden;
  }

  .cascader__columns {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
    overflow-x: auto;
  }

  .cascader__column {
    flex: 0 0 var(--bzl-cascader-panel-column-width);
    width: var(--bzl-cascader-panel-column-width);
    border-right: var(--bzl-input-border-width) solid var(--bzl-color-gray-100);
    overflow-y: auto;
    padding: var(--bzl-spacing-2);
    box-sizing: border-box;
  }

  .cascader__column:last-child {
    border-right: none;
  }

  .cascader__option:not(:last-child) {
    margin-block-end: var(--bzl-spacing-1);
  }

  .cascader__option {
    display: flex;
    align-items: center;
    box-sizing: border-box;
    width: 100%;
    min-height: var(--bzl-cascader-panel-option-height);
    padding: 0 var(--bzl-scene-padding-11);
    cursor: pointer;
    font-family: var(--bzl-font-sans);
    font-size: var(--bzl-font-size-small);
    line-height: var(--bzl-cascader-panel-option-height);
    color: var(--bzl-color-neutral-900);
    background-color: var(--bzl-color-neutral-0);
    border-radius: var(--bzl-border-radius-small);
    transition:
      background-color var(--bzl-transition-fast) ease,
      color var(--bzl-transition-fast) ease;
  }

  .cascader__option-label {
    flex: 1;
    min-width: 0;
    line-height: var(--bzl-cascader-panel-option-height);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cascader__option-expand-icon {
    margin-left: var(--bzl-spacing-2);
    color: var(--bzl-color-neutral-500);
  }

  .cascader__option:hover:not(.cascader__option--disabled) {
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-1000);
  }

  .cascader__option--in-selected-path:not(.cascader__option--disabled) {
    color: var(--bzl-color-primary-700);
  }

  .cascader__option--in-selected-path:not(.cascader__option--disabled) .cascader__option-label {
    color: var(--bzl-color-primary-700);
  }

  .cascader__option--disabled {
    cursor: not-allowed;
    color: var(--bzl-color-neutral-500);
  }

  .cascader__option--disabled:hover {
    background-color: transparent;
  }
`),i=class extends t{constructor(){super(...arguments),this.options=[],this.value=[],this.multiple=!1,this.defaultExpandAllColumns=!1,this.checkStrategy="parent",this.activePath=[],this.flattened=[]}get normalizedValue(){return this.multiple?this.value||[]:[this.value||[]]}setNormalizedValue(e){this.multiple?this.value=e:this.value=e[0]||[]}connectedCallback(){super.connectedCallback(),this.flattened=this.flattenOptions(this.options),this.ensureInitialActivePath()}updated(e){e.has("options")&&(this.flattened=this.flattenOptions(this.options)),(e.has("options")||e.has("value"))&&this.ensureInitialActivePath()}ensureInitialActivePath(){if(this.options&&0!==this.options.length&&!(0<this.activePath.length)){let i=this.normalizedValue.find(e=>Array.isArray(e)&&0<e.length);if(i&&0<this.flattened.length){var e=this.flattened.find(e=>e.values.length===i.length&&e.values.every((e,t)=>e===i[t]));if(e)return void(this.activePath=e.path)}if(this.defaultExpandAllColumns){var t=[];let e=this.getChildren(null);for(;0<e.length;){var o=e[0];t.push(o),e=this.getChildren(o)}this.activePath=t}}}getChildren(e){return e?(e=e.children,Array.isArray(e)?e:[]):this.options||[]}isLeaf(e){return 0===this.getChildren(e).length}getLabel(e){return(null==e?void 0:e.label)||""}getValue(e){return(null==e?void 0:e.value)||""}isDisabled(e){return Boolean(e&&e.disabled)}flattenOptions(e){let a=[],n=(e,r)=>{e.forEach(e=>{var t=[...r,e],i=t.map(e=>this.getLabel(e)),o=t.map(e=>this.getValue(e)),i=(a.push({path:t,labels:i,values:o}),this.getChildren(e));i.length&&n(i,t)})};return n(e||[],[]),a}isPathSelected(i){return this.normalizedValue.some(e=>e.length===i.length&&e.every((e,t)=>e===i[t]))}getLeafDescendantPaths(t){return this.flattened.filter(i=>{var e;return!(i.values.length<=t.length||!t.every((e,t)=>i.values[t]===e))&&(e=i.path[i.path.length-1],this.isLeaf(e))})}serializePath(e){return JSON.stringify(e)}isStringArray(e){return Array.isArray(e)&&e.every(e=>"string"==typeof e)}deserializePath(e){try{var t=JSON.parse(e);return this.isStringArray(t)?t:[]}catch(e){return[]}}getCheckState(e){var t=this.getLeafDescendantPaths(e);if(0===t.length)return{checked:this.isPathSelected(e),indeterminate:!1};let i=new Set(this.normalizedValue.map(e=>this.serializePath(e)));e=t.filter(e=>i.has(this.serializePath(e.values))).length;return 0===e?{checked:!1,indeterminate:!1}:e===t.length?{checked:!0,indeterminate:!1}:{checked:!1,indeterminate:!0}}isPathOnActivePath(e){let i=this.activePath.map(e=>this.getValue(e));return e.length<=i.length&&e.every((e,t)=>e===i[t])}toggleOption(e,t){var i;this.isDisabled(e)||(i=(t=[...this.activePath.slice(0,t),e]).map(e=>this.getValue(e)),e=this.isLeaf(e),this.multiple?e||(this.activePath=t):e?this.selectPath(i):this.activePath=t)}handleCheckboxToggle(e,t){this.isDisabled(e)||(e=(t=[...this.activePath.slice(0,t),e]).map(e=>this.getValue(e)),"parent"===this.checkStrategy?this.toggleWithDescendants(t):this.toggleSinglePath(e))}selectPath(e){this.multiple?this.toggleSinglePath(e):(this.setNormalizedValue([e]),this.emit("bzl-change"))}toggleSinglePath(i){var e=this.normalizedValue,e=e.some(e=>e.length===i.length&&e.every((e,t)=>e===i[t]))?e.filter(e=>!(e.length===i.length&&e.every((e,t)=>e===i[t]))):[...e,i];this.setNormalizedValue(e),this.emit("bzl-change")}toggleWithDescendants(e){var e=e.map(e=>this.getValue(e)),t=this.getLeafDescendantPaths(e),e=0===t.length?[e]:t.map(e=>e.values);let i=new Set(this.normalizedValue.map(e=>this.serializePath(e)));t=e.every(e=>i.has(this.serializePath(e)));let o=new Set(i);t?e.forEach(e=>{o.delete(this.serializePath(e))}):e.forEach(e=>{o.add(this.serializePath(e))});t=Array.from(o).map(e=>this.deserializePath(e));this.setNormalizedValue(t),this.emit("bzl-change")}renderColumns(){let t=[];var e=this.getChildren(null);return t.push(e),this.activePath.forEach(e=>{e=this.getChildren(e);e.length&&t.push(e)}),h`
      <div class="cascader__columns">
        ${t.map((e,t)=>h`
            <div class="cascader__column">${e.map(e=>this.renderOption(e,t))}</div>
          `)}
      </div>
    `}renderOption(t,i){var e=this.getLabel(t),o=this.isLeaf(t),r=[...this.activePath.slice(0,i),t].map(e=>this.getValue(e)),a=this.isPathSelected(r),n=this.isPathOnActivePath(r),s=this.isDisabled(t),l=this.multiple,r=this.multiple&&"parent"===this.checkStrategy&&l?this.getCheckState(r):null,c=r?r.checked:a,r=!!r&&r.indeterminate,d=c||r||a,a=this.multiple?!o&&n||d:a||n;return h`
      <div
        class=${v({cascader__option:!0,"cascader__option--selected":d,"cascader__option--in-selected-path":a,"cascader__option--disabled":s})}
        @click=${()=>this.toggleOption(t,i)}
      >
        ${l?h`
              <bzl-checkbox
                .checked=${c}
                .indeterminate=${r}
                .disabled=${s}
                @bzl-change=${e=>{e.stopPropagation(),this.handleCheckboxToggle(t,i)}}
              >
              </bzl-checkbox>
            `:null}

        <div class="cascader__option-label">${e}</div>

        ${o?null:h` <bzl-icon class="cascader__option-expand-icon" name="rightback-small-outline2"></bzl-icon> `}
      </div>
    `}render(){return h` <div class="cascader__panel">${this.renderColumns()}</div> `}},Br=(i.styles=[u,O],d([b({attribute:!(i.dependencies={"bzl-checkbox":a,"bzl-icon":m})})],i.prototype,"options",2),d([b({attribute:!1})],i.prototype,"value",2),d([b({type:Boolean,reflect:!0})],i.prototype,"multiple",2),d([b({type:Boolean,attribute:"default-expand-all-columns"})],i.prototype,"defaultExpandAllColumns",2),d([b({attribute:"check-strategy"})],i.prototype,"checkStrategy",2),d([f()],i.prototype,"activePath",2),d([f()],i.prototype,"flattened",2),i),Ir=(i.define("bzl-cascader-panel"),a),n=(a.define("bzl-checkbox"),o`
  :host {
    display: inline-block;
  }

  .checkbox-group {
    display: inline-flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--bzl-group-gap-medium);
  }
`),e=class extends t{constructor(){super(...arguments),this.checkboxElements=[],this.name="",this.value=[],this.disabled=!1,this.handleCheckboxChange=e=>{e.stopPropagation();e=this.checkboxElements.filter(e=>e.checked).map(e=>e.value);this.value=e,this.emit("bzl-change")}}getAllCheckboxes(){return[...this.querySelectorAll("bzl-checkbox")]}handleSlotChange(){this.checkboxElements.forEach(e=>{e.removeEventListener("bzl-change",this.handleCheckboxChange)});var e=this.getAllCheckboxes();this.checkboxElements=e,this.checkboxElements.forEach(e=>{e.addEventListener("bzl-change",this.handleCheckboxChange)}),this.syncCheckboxesFromValue(!0),this.syncDisabledToChildren(!0)}syncCheckboxesFromValue(e){let i=Array.isArray(this.value)?this.value:null==this.value?[]:[String(this.value)];e&&0===i.length||this.checkboxElements.forEach(e=>{var t=null!=(t=e.value)?t:"";e.checked=i.includes(t)})}syncDisabledToChildren(e){e&&!this.disabled||this.checkboxElements.forEach(e=>{e.disabled=this.disabled})}handleValueChange(){this.syncCheckboxesFromValue()}handleDisabledChange(){this.syncDisabledToChildren()}render(){return h`
      <div class="checkbox-group" part="base">
        <slot @slotchange=${this.handleSlotChange}></slot>
      </div>
    `}},Ur=(e.styles=[u,n],e.dependencies={"bzl-checkbox":a},d([g("slot")],e.prototype,"defaultSlot",2),d([f()],e.prototype,"checkboxElements",2),d([b()],e.prototype,"name",2),d([b({attribute:"value"})],e.prototype,"value",2),d([b({type:Boolean,reflect:!0})],e.prototype,"disabled",2),d([p("value",{waitUntilFirstUpdate:!0})],e.prototype,"handleValueChange",1),d([p("disabled",{waitUntilFirstUpdate:!0})],e.prototype,"handleDisabledChange",1),e),Nr=(e.define("bzl-checkbox-group"),s),r=(s.define("bzl-button"),o`
  :host {
    display: block;
  }

  .cascader {
    display: flex;
  }

  .cascader-popup::part(popup) {
    z-index: var(--bzl-z-index-dropdown);
  }

  .cascader-popup[data-current-placement^='top']::part(popup) {
    transform-origin: bottom;
  }

  .cascader-popup[data-current-placement^='bottom']::part(popup) {
    transform-origin: top;
  }

  /* Combobox - 与 select 入口样式一致 */
  .cascader__anchor {
    flex: 1;
    display: flex;
    width: 100%;
    min-width: 0;
    position: relative;
    align-items: center;
    justify-content: start;
    font-family: var(--bzl-input-font-family);
    font-weight: var(--bzl-input-font-weight);
    letter-spacing: var(--bzl-input-letter-spacing);
    vertical-align: middle;
    overflow: hidden;
    cursor: pointer;
    line-height: var(--bzl-line-height-2x-loose);
    transition:
      var(--bzl-transition-fast) color,
      var(--bzl-transition-fast) border,
      var(--bzl-transition-fast) box-shadow,
      var(--bzl-transition-fast) background-color;
    border-radius: var(--bzl-input-border-radius);
    font-size: var(--bzl-input-font-size-small);
    box-sizing: border-box;
    min-height: var(--bzl-input-height-medium);
    padding-block: 0;
    padding-inline: var(--bzl-spacing-5);
  }

  .cascader--standard .cascader__anchor {
    background-color: var(--bzl-input-background-color);
    border: solid var(--bzl-input-border-width) var(--bzl-input-border-color);
  }

  .cascader--standard:not(.cascader--disabled):hover .cascader__anchor {
    border-color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled):hover .cascader__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled).cascader--open .cascader__expand-icon {
    color: var(--bzl-color-primary-700);
  }

  .cascader--standard:not(.cascader--disabled).cascader--open .cascader__anchor,
  .cascader--standard:not(.cascader--disabled).cascader--focused .cascader__anchor {
    background-color: var(--bzl-input-background-color-focus);
    border-color: var(--bzl-input-border-color-focus);
    box-shadow: var(--bzl-shadow-focus);
  }

  .cascader--standard.cascader--disabled .cascader__anchor {
    background-color: var(--bzl-input-background-color-disabled);
    border-color: var(--bzl-input-border-color-disabled);
    color: var(--bzl-input-color-disabled);
    cursor: not-allowed;
    outline: none;
  }

  .cascader__prefix {
    flex: 0;
    display: inline-flex;
    align-items: center;
    color: var(--bzl-input-placeholder-color);
  }

  .cascader__prefix::slotted(*) {
    margin-inline-end: var(--bzl-spacing-2);
  }

  .cascader--multiple:not(.cascader--placeholder-visible) .cascader__prefix::slotted(*) {
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader--multiple:not(.cascader--placeholder-visible) .cascader__anchor {
    padding-inline-start: 0;
    padding-block: 5px;
  }

  .cascader--multiple.cascader--custom-label:not(.cascader--placeholder-visible) .cascader__anchor {
    padding-block: 0;
  }

  .cascader__label {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    gap: var(--bzl-spacing-2);
  }

  .cascader__placeholder {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--bzl-input-placeholder-color);
  }

  .cascader__single-text {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: var(--bzl-input-color);
  }

  .cascader:not(.cascader--disabled):hover .cascader__single-text {
    color: var(--bzl-input-color-hover);
  }

  .cascader__tags {
    display: flex;
    flex: 1;
    align-items: center;
    flex-wrap: wrap;
    margin-inline-start: var(--bzl-input-padding-leftright);
    gap: var(--bzl-spacing-2);
  }

  .cascader__tag {
    display: inline-flex;
    align-items: center;
    gap: var(--bzl-spacing-1);
    max-width: 120px;
    background-color: var(--bzl-color-neutral-200);
    color: var(--bzl-color-neutral-900);
    border: none;
    border-radius: var(--bzl-border-radius-small);
    padding-inline: var(--bzl-spacing-4);
    padding-block: var(--bzl-spacing-1);
    font-size: var(--bzl-font-size-2x-small);
    line-height: var(--bzl-spacing-7);
    cursor: pointer;
    transition:
      var(--bzl-transition-fast) background-color,
      var(--bzl-transition-fast) color;
  }

  .cascader__tag:hover {
    background-color: var(--bzl-color-neutral-300);
  }

  .cascader__tag--collapse {
    cursor: default;
  }

  .cascader__tag--collapse:hover {
    background-color: var(--bzl-color-neutral-200);
  }

  .cascader--disabled .cascader__tag {
    cursor: not-allowed;
  }

  .cascader__tag-text {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .cascader__tag-remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    margin-left: var(--bzl-spacing-1);
    border: none;
    padding: 0;
    background: none;
    cursor: pointer;
    color: var(--bzl-color-neutral-700);
    width: 12px;
    height: 12px;
    transition: var(--bzl-transition-fast) color;
  }

  .cascader__tag-remove:hover {
    color: var(--bzl-color-neutral-900);
  }

  .cascader__tag-remove bzl-icon {
    font-size: var(--bzl-font-size-2x-small);
  }

  .cascader__suffix {
    display: inline-flex;
    align-items: center;
  }

  .cascader__clear {
    align-items: center;
    justify-content: center;
    font-size: inherit;
    color: var(--bzl-input-icon-color);
    border: none;
    background: none;
    padding: 0;
    transition: var(--bzl-transition-fast) color;
    cursor: pointer;
    display: none;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader__anchor:hover .cascader__clear {
    display: inline-flex;
  }

  .cascader__anchor:hover .cascader__clear ~ .cascader__expand-icon {
    display: none;
  }

  .cascader__clear:hover {
    color: var(--bzl-input-icon-color-hover);
  }

  .cascader__expand-icon {
    flex: 0 0 auto;
    display: flex;
    align-items: center;
    color: var(--bzl-color-neutral-600);
    transition: var(--bzl-transition-medium) rotate ease;
    rotate: 0;
    margin-inline-start: var(--bzl-spacing-5);
  }

  .cascader--open .cascader__expand-icon {
    rotate: -180deg;
  }
`),x=class extends t{constructor(){super(...arguments),this.options=[],this.value=[],this.placeholder="",this.separator="/",this.multiple=!1,this.defaultExpandAllColumns=!1,this.checkStrategy="parent",this.disabled=!1,this.clearable=!1,this.placement="bottom",this.hoist=!1,this.maxTagsVisible=1,this.collapseTags=!1,this.open=!1,this.hasCustomLabel=!1,this.handleDocumentMouseDown=e=>{e.composedPath().includes(this)||this.hide()}}get hasValue(){return this.multiple,0<(this.value||[]).length}getDisplayLabelForPath(e,t=this.options){if(!Array.isArray(e)||0===e.length||null==t||!t.length)return"";var i=[];let o=t;for(let t of e){var r=o.find(e=>(null!=(e=e.value)?e:"")===t);if(!r)break;i.push(String(null!=(a=r.label)?a:""));var a=Array.isArray(r.children)?r.children:[];if(0===a.length)break;o=a}return i.join(this.separator)}handleLabelSlotChange(){var e;this.labelSlot?(e=this.labelSlot.assignedNodes({flatten:!0}),this.hasCustomLabel=!!e&&0<e.length):this.hasCustomLabel=!1}async show(){if(!this.open&&!this.disabled)return this.open=!0,this.handleOpenChange(),Xi(this,"bzl-after-show")}async hide(){if(this.open&&!this.disabled)return this.open=!1,this.handleOpenChange(),Xi(this,"bzl-after-hide")}handleAnchorMouseDown(e){this.disabled||(e.preventDefault(),this.open=!this.open,this.handleOpenChange())}handleClearMouseDown(e){e.stopPropagation(),e.preventDefault()}handleClearClick(e){e.stopPropagation(),this.hasValue&&(this.value=[],this.emit("bzl-clear"),this.emit("bzl-change"))}handleOpenChange(){this.open&&!this.disabled?(this.emit("bzl-show"),document.addEventListener("mousedown",this.handleDocumentMouseDown),this.updateComplete.then(async()=>{await E(this),this.popup.active=!0;var{keyframes:e,options:t}=T(this,"cascader.show",{dir:"ltr"});await S(this.popup.popup,e,t),this.emit("bzl-after-show")})):(this.emit("bzl-hide"),document.removeEventListener("mousedown",this.handleDocumentMouseDown),this.updateComplete.then(async()=>{await E(this);var{keyframes:e,options:t}=T(this,"cascader.hide",{dir:"ltr"});await S(this.popup.popup,e,t),this.popup.active=!1,this.emit("bzl-after-hide")}))}get displayText(){var e;return!this.multiple&&(e=this.value,Array.isArray(e))&&e.length?this.getDisplayLabelForPath(e):""}get visibleTags(){var e=this.value||[],t=e.length;if(!this.multiple)return{tags:[],restCount:0};let i=t;return this.collapseTags&&0<this.maxTagsVisible&&(i=Math.min(this.maxTagsVisible,t)),{tags:e.slice(0,i).map(e=>({pathValues:e,label:this.getDisplayLabelForPath(e)})),restCount:this.collapseTags&&0<this.maxTagsVisible&&t>this.maxTagsVisible?t-this.maxTagsVisible:0}}handleTagRemoveClick(i,e){e.stopPropagation(),this.panel&&(e=(this.panel.value||[]).filter(e=>!(e.length===i.length&&e.every((e,t)=>e===i[t]))),this.panel.value=e,this.value=e,this.emit("bzl-change"))}handlePanelChange(e){e.stopPropagation(),this.panel&&(this.value=(this.multiple,this.panel.value||[]),this.emit("bzl-change"),this.multiple||this.hide())}renderAnchorContent(){var e,t,i=this.clearable&&!this.disabled&&this.hasValue;return this.hasValue?({tags:e,restCount:t}=this.visibleTags,h`
      <slot part="prefix" name="prefix" class="cascader__prefix"></slot>
      <div class="cascader__label">
        <slot name="label" @slotchange=${this.handleLabelSlotChange}>
          ${this.multiple?h`
                <div class="cascader__tags">
                  ${e.map(t=>h`
                      <div class="cascader__tag">
                        <span class="cascader__tag-text">${t.label}</span>
                        <button
                          class="cascader__tag-remove"
                          type="button"
                          aria-label="Remove"
                          @click=${e=>this.handleTagRemoveClick(t.pathValues,e)}
                        >
                          <bzl-icon name="improper-outline"></bzl-icon>
                        </button>
                      </div>
                    `)}
                  ${0<t?h`
                        <div class="cascader__tag cascader__tag--collapse">
                          <span class="cascader__tag-text">+${t}</span>
                        </div>
                      `:null}
                </div>
              `:h` <span class="cascader__single-text">${this.displayText}</span> `}
        </slot>
      </div>

      <div class="cascader__suffix">
        ${i?h`
              <button
                class="cascader__clear"
                type="button"
                aria-label="Clear"
                @mousedown=${this.handleClearMouseDown}
                @click=${this.handleClearClick}
              >
                <bzl-icon name="close-face1"></bzl-icon>
              </button>
            `:null}
        <slot name="expand-icon" part="expand-icon" class="cascader__expand-icon">
          <bzl-icon name="down-outline"></bzl-icon>
        </slot>
      </div>
    `):h`
        <slot part="prefix" name="prefix" class="cascader__prefix"></slot>
        <div class="cascader__label">
          <span class="cascader__placeholder">${this.placeholder}</span>
        </div>
        <div class="cascader__suffix">
          ${i?h`
                <button
                  class="cascader__clear"
                  type="button"
                  aria-label="Clear"
                  @mousedown=${this.handleClearMouseDown}
                  @click=${this.handleClearClick}
                >
                  <bzl-icon name="close-face1"></bzl-icon>
                </button>
              `:null}
          <slot name="expand-icon" part="expand-icon" class="cascader__expand-icon">
            <bzl-icon name="down-outline"></bzl-icon>
          </slot>
        </div>
      `}render(){var e=!!this.placeholder&&!this.hasValue;return h`
      <bzl-popup
        class=${v({"cascader-popup":!0,cascader:!0,"cascader--standard":!0,"cascader--open":this.open,"cascader--disabled":this.disabled,"cascader--multiple":this.multiple,"cascader--placeholder-visible":e,"cascader--custom-label":this.hasCustomLabel})}
        placement=${this.placement}
        strategy=${this.hoist?"fixed":"absolute"}
        flip
        shift
        distance=${2}
        sync="width"
      >
        <div class="cascader__anchor" slot="anchor" @mousedown=${this.handleAnchorMouseDown}>
          ${this.renderAnchorContent()}
        </div>

        <bzl-cascader-panel
          .options=${this.options}
          .value=${this.value}
          .multiple=${this.multiple}
          .checkStrategy=${this.checkStrategy}
          .defaultExpandAllColumns=${this.defaultExpandAllColumns}
          @bzl-change=${this.handlePanelChange}
        >
        </bzl-cascader-panel>
      </bzl-popup>
    `}},Hr=(x.styles=[u,r],x.dependencies={"bzl-cascader-panel":i,"bzl-popup":$,"bzl-checkbox":a,"bzl-icon":m},d([g(".cascader-popup")],x.prototype,"popup",2),d([g("bzl-cascader-panel")],x.prototype,"panel",2),d([g('slot[name="label"]')],x.prototype,"labelSlot",2),d([b({attribute:!1})],x.prototype,"options",2),d([b({attribute:!1})],x.prototype,"value",2),d([b()],x.prototype,"placeholder",2),d([b()],x.prototype,"separator",2),d([b({type:Boolean,reflect:!0})],x.prototype,"multiple",2),d([b({type:Boolean,attribute:"default-expand-all-columns"})],x.prototype,"defaultExpandAllColumns",2),d([b({attribute:"check-strategy"})],x.prototype,"checkStrategy",2),d([b({type:Boolean,reflect:!0})],x.prototype,"disabled",2),d([b({type:Boolean})],x.prototype,"clearable",2),d([b({reflect:!0})],x.prototype,"placement",2),d([b({type:Boolean})],x.prototype,"hoist",2),d([b({attribute:"max-tags-visible",type:Number})],x.prototype,"maxTagsVisible",2),d([b({attribute:"collapse-tags",type:Boolean})],x.prototype,"collapseTags",2),d([f()],x.prototype,"open",2),d([f()],x.prototype,"hasCustomLabel",2),A("cascader.show",{keyframes:[{opacity:0,transform:"scale(0.9, 0.9)"},{opacity:1,transform:"scale(1, 1)"}],options:{duration:200,easing:"ease"}}),A("cascader.hide",{keyframes:[{opacity:1,transform:"scale(1, 1)"},{opacity:0,transform:"scale(0.9, 0.9)"}],options:{duration:150,easing:"ease"}}),x),qr=(x.define("bzl-cascader"),"");function jr(e){qr=e}function Wr(e=""){if(!qr){var t=[...document.getElementsByTagName("script")],i=t.find(e=>e.hasAttribute("data-bzl-design"));if(i)jr(i.getAttribute("data-bzl-design"));else{i=t.find(e=>/bzl-design(\.min)?\.js($|\?)/.test(e.src)||/bzl-design-autoloader(\.min)?\.js($|\?)/.test(e.src));let e="";jr((e=i?i.getAttribute("src"):e).split("/").slice(0,-1).join("/"))}}return qr.replace(/\/$/,"")+(e?"/"+e.replace(/^\//,""):"")}var De=o`
  :host {
    display: inline-block;
  }

  .avatar {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background-color: var(--bzl-color-neutral-400);
    user-select: none;
    -webkit-user-select: none;
    vertical-align: middle;
  }

  .avatar--circle,
  .avatar--circle .avatar__image {
    border-radius: var(--bzl-border-radius-circle);
  }

  .avatar__default {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }

  .avatar__default .avatar__default-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }

  .avatar__badge {
    position: absolute;
    top: -2px;
    right: -2px;
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 16px;
    min-height: 16px;
    font-size: 12px;
    line-height: 1;
    z-index: 1;
  }

  .avatar__image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
  }
`,_=class extends t{constructor(){super(...arguments),this.hasError=!1,this.image="",this.loading="eager",this.size=48}handleImageChange(){this.hasError=!1}handleImageLoadError(){this.hasError=!0,this.emit("bzl-error")}render(){var e=h`
      <img
        part="image"
        class="avatar__image"
        src="${this.image}"
        loading="${this.loading}"
        alt=""
        @error="${this.handleImageLoadError}"
      />
    `,t=h`
      <div part="default" class="avatar__default" aria-hidden="true">
        <img
          class="avatar__default-image"
          src="https://static.zhipin.com/assets/bzl-design/components/avatar/default-avatar.svg"
          alt=""
        />
      </div>
    `,i=h`
      <div part="badge" class="avatar__badge">
        <slot name="badge"></slot>
      </div>
    `;return h`
      <div
        part="base"
        class=${v({avatar:!0,"avatar--circle":!0})}
        style="width: ${this.size}px; height: ${this.size}px;"
      >
        ${this.image&&!this.hasError?e:t} ${i}
      </div>
    `}},Kr=(_.styles=[u,De],d([f()],_.prototype,"hasError",2),d([b()],_.prototype,"image",2),d([b()],_.prototype,"loading",2),d([b({type:Number})],_.prototype,"size",2),d([p("image")],_.prototype,"handleImageChange",1),_),oo=(_.define("bzl-avatar"),o`
  :host {
    display: inline-flex;
  }

  .badge-container {
    position: relative;
    display: inline-block;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: max(12px, var(--bzl-font-size-2x-small));
    font-weight: var(--bzl-font-weight-semibold);
    letter-spacing: var(--bzl-letter-spacing-normal);
    border-radius: var(--bzl-border-radius-small);
    white-space: nowrap;
    padding: 0 var(--bzl-spacing-2);
    user-select: none;
    cursor: inherit;
    background-color: var(--bzl-color-danger-600);
    color: var(--bzl-color-neutral-0);
    box-sizing: border-box;
    min-width: var(--bzl-line-height-x-dense);
    height: var(--bzl-line-height-x-dense);
    line-height: var(--bzl-line-height-x-dense);
  }

  /* Pill modifier */
  .badge--pill {
    border-radius: var(--bzl-border-radius-pill);
  }

  /* Dot modifier */
  .badge--dot {
    padding: 0;
    border-radius: var(--bzl-border-radius-circle);
    background-color: var(--bzl-color-danger-600);
    min-width: var(--bzl-badge-dot-size);
    min-height: var(--bzl-badge-dot-size);
    width: var(--bzl-badge-dot-size);
    height: var(--bzl-badge-dot-size);
  }

  /* Positioned badge (右上角定位) */
  .badge--positioned {
    position: absolute;
    top: 0;
    right: 0;
    transform: translate(50%, -50%);
    z-index: 1;
  }
`),O=class extends t{constructor(){super(...arguments),this.color="",this.cn=!1,this.dot=!1,this.text="",this.offset=[0,0]}hasSlotContent(){return Array.from(this.childNodes).some(e=>e.nodeType===Node.ELEMENT_NODE||e.nodeType===Node.TEXT_NODE&&(null==(e=e.textContent)?void 0:e.trim()))}getColorStyle(){return this.color?`background-color: ${this.color};`:""}getOffsetStyle(){var[e,t]=this.offset;return`transform: translate(calc(50% + ${e}px), calc(-50% + ${t}px));`}mergeStyles(...e){return e.filter(e=>e).join(" ")}renderDotBadge(e){var t=this.getColorStyle();return e?(e=this.getOffsetStyle(),h`
        <div class="badge-container">
          <slot></slot>
          <span
            part="base"
            class=${v({badge:!0,"badge--dot":!0,"badge--positioned":!0})}
            style=${this.mergeStyles(t,e)}
            role="status"
          ></span>
        </div>
      `):h`
      <span
        part="base"
        class=${v({badge:!0,"badge--dot":!0})}
        style=${t}
        role="status"
      ></span>
    `}renderTextBadge(e){var t=this.getColorStyle();return e?this.text?(e=this.getOffsetStyle(),h`
        <div class="badge-container">
          <slot></slot>
          <span
            part="base"
            class=${v({badge:!0,"badge--pill":!this.cn,"badge--positioned":!0})}
            style=${this.mergeStyles(t,e)}
            role="status"
          >
            ${this.text}
          </span>
        </div>
      `):h`
          <div class="badge-container">
            <slot></slot>
          </div>
        `:this.text?h`
      <span
        part="base"
        class=${v({badge:!0,"badge--pill":!this.cn})}
        style=${t}
        role="status"
      >
        ${this.text}
      </span>
    `:h`<slot></slot>`}render(){var e=this.hasSlotContent();return this.dot?this.renderDotBadge(e):this.renderTextBadge(e)}},Yr=(O.styles=[u,oo],d([b({type:String})],O.prototype,"color",2),d([b({type:Boolean,reflect:!0})],O.prototype,"cn",2),d([b({type:Boolean,reflect:!0})],O.prototype,"dot",2),d([b({type:String})],O.prototype,"text",2),d([b({type:Array})],O.prototype,"offset",2),O);O.define("bzl-badge")}}]);