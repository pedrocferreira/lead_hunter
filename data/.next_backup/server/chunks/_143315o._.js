module.exports=[36632,e=>{"use strict";let t,r,a=new TextEncoder,n=new TextDecoder,o=new TextDecoder("utf-8",{fatal:!0});function i(...e){let t=new Uint8Array(e.reduce((e,{length:t})=>e+t,0)),r=0;for(let a of e)t.set(a,r),r+=a.length;return t}function s(e){let t=new Uint8Array(e.length);for(let r=0;r<e.length;r++){let a=e.charCodeAt(r);if(a>127)throw TypeError("non-ASCII string encountered in encode()");t[r]=a}return t}let c="The input to be decoded is not correctly encoded.";function d(e){if(Uint8Array.fromBase64)try{return Uint8Array.fromBase64("string"==typeof e?e:n.decode(e),{alphabet:"base64url"})}catch(e){throw TypeError(c,{cause:e})}let t=e;if(t instanceof Uint8Array&&(t=n.decode(t)),t.includes("+")||t.includes("/"))throw TypeError(c);t=t.replace(/-/g,"+").replace(/_/g,"/");try{var r=t;if(Uint8Array.fromBase64)return Uint8Array.fromBase64(r);let e=atob(r),a=new Uint8Array(e.length);for(let t=0;t<e.length;t++)a[t]=e.charCodeAt(t);return a}catch{throw TypeError(c)}}function l(e){let t=e;return("string"==typeof t&&(t=a.encode(t)),Uint8Array.prototype.toBase64)?t.toBase64({alphabet:"base64url",omitPadding:!0}):(function(e){if(Uint8Array.prototype.toBase64)return e.toBase64();let t=[];for(let r=0;r<e.length;r+=32768)t.push(String.fromCharCode.apply(null,e.subarray(r,r+32768)));return btoa(t.join(""))})(t).replace(/=/g,"").replace(/\+/g,"-").replace(/\//g,"_")}let f=(e,t="algorithm.name")=>TypeError(`CryptoKey does not support this operation, its ${t} must be ${e}`);async function u(e,t,r){return t instanceof Uint8Array?crypto.subtle.importKey("raw",t,e.subtle,!1,[r]):(!function(e,t,r){let a=e.algorithm;if(a.name!==t.name)throw f(t.name);if(t.hash&&a.hash?.name!==t.hash)throw f(t.hash,"algorithm.hash");if(t.namedCurve&&a.namedCurve!==t.namedCurve)throw f(t.namedCurve,"algorithm.namedCurve");if(void 0!==t.length&&a.length!==t.length)throw f(t.length,"algorithm.length");if(r&&!e.usages.includes(r))throw TypeError(`CryptoKey does not support this operation, its usages must include ${r}.`)}(t,e.subtle,r),e.minRsaBits&&function(e,t){let{modulusLength:r}=t.algorithm;if("number"!=typeof r||r<2048)throw TypeError(`${e} requires key modulusLength to be 2048 bits or larger`)}(e.alg,t),t)}async function x(e,t,r){let a=await u(e,t,"sign");return new Uint8Array(await crypto.subtle.sign(e.signing,a,r))}async function p(e,t,r,a){let n=await u(e,t,"verify");try{return await crypto.subtle.verify(e.signing,n,r,a)}catch{return!1}}class b extends Error{static code="ERR_JOSE_GENERIC";code="ERR_JOSE_GENERIC";constructor(e,t){super(e,t),this.name=this.constructor.name,Error.captureStackTrace?.(this,this.constructor)}}class h extends b{static code="ERR_JWT_CLAIM_VALIDATION_FAILED";code="ERR_JWT_CLAIM_VALIDATION_FAILED";claim;reason;payload;constructor(e,t,r="unspecified",a="unspecified"){super(e,{cause:{claim:r,reason:a,payload:t}}),this.claim=r,this.reason=a,this.payload=t}}class g extends b{static code="ERR_JWT_EXPIRED";code="ERR_JWT_EXPIRED";claim;reason;payload;constructor(e,t,r="unspecified",a="unspecified"){super(e,{cause:{claim:r,reason:a,payload:t}}),this.claim=r,this.reason=a,this.payload=t}}class m extends b{static code="ERR_JOSE_ALG_NOT_ALLOWED";code="ERR_JOSE_ALG_NOT_ALLOWED"}class y extends b{static code="ERR_JOSE_NOT_SUPPORTED";code="ERR_JOSE_NOT_SUPPORTED"}class v extends b{static code="ERR_JWS_INVALID";code="ERR_JWS_INVALID"}class w extends b{static code="ERR_JWT_INVALID";code="ERR_JWT_INVALID"}class $ extends b{static code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED";code="ERR_JWS_SIGNATURE_VERIFICATION_FAILED";constructor(e="signature verification failed",t){super(e,t)}}let k=[["verify"],["sign"]];function E(e){let t={name:"HMAC",hash:`SHA-${e}`};return{kty:["oct"],secret:!0,subtle:t,signing:t,usages:k}}function A(e,t){let r={name:t?"RSA-PSS":"RSASSA-PKCS1-v1_5",hash:`SHA-${e}`};return{kty:["RSA"],subtle:r,signing:t?{...r,saltLength:t}:r,usages:k,minRsaBits:2048}}function S(e,t){return{kty:["EC"],crv:e,subtle:{name:"ECDSA",namedCurve:e},signing:{name:"ECDSA",hash:`SHA-${t}`},usages:k}}function _(){let e={name:"Ed25519"};return{kty:["OKP"],crv:"Ed25519",subtle:e,signing:e,usages:k}}function C(e){let t={name:`ML-DSA-${e}`};return{kty:["AKP"],subtle:t,signing:t,usages:k}}let R=function(e){let t={__proto__:null};for(let r in e)t[r]={...e[r],alg:r};return t}({HS256:E(256),HS384:E(384),HS512:E(512),RS256:A(256),RS384:A(384),RS512:A(512),PS256:A(256,32),PS384:A(384,48),PS512:A(512,64),ES256:S("P-256",256),ES384:S("P-384",384),ES512:S("P-521",512),EdDSA:_(),Ed25519:_(),"ML-DSA-44":C(44),"ML-DSA-65":C(65),"ML-DSA-87":C(87)});function O(e){let t="string"==typeof e?R[e]:void 0;if(!t)throw new y(`alg ${e} is not supported either by JOSE or your javascript runtime`);return t}function T(e){if("object"!=typeof e||null===e||"[object Object]"!==Object.prototype.toString.call(e))return!1;let t=Object.getPrototypeOf(e);return null===t||null===Object.getPrototypeOf(t)}let j={__proto__:null,b64:!0};function D(e,t,r,a,n){if(void 0!==n.crit&&a?.crit===void 0)throw new e('"crit" (Critical) Header Parameter MUST be integrity protected');if(!a||void 0===a.crit)return[];if(!Array.isArray(a.crit)||0===a.crit.length||a.crit.some(e=>"string"!=typeof e||0===e.length))throw new e('"crit" (Critical) Header Parameter MUST be an array of non-empty strings when present');let o=void 0===r?t:{__proto__:null,...r,...t};for(let t of a.crit){if(!(t in o))throw new y(`Extension Header Parameter "${t}" is not recognized`);if(!Object.hasOwn(n,t)||void 0===n[t])throw new e(`Extension Header Parameter "${t}" is missing`);if(o[t]&&(!Object.hasOwn(a,t)||void 0===a[t]))throw new e(`Extension Header Parameter "${t}" MUST be integrity protected`)}return a.crit}function P(e,t){if(t.includes("b64")){let t=e.b64;if("boolean"!=typeof t)throw new v('The "b64" (base64url-encode payload) Header Parameter must be a boolean');return t}return!0}let I=(e,t,...r)=>(function(e,t,...r){if(r.length>2){let t=r.pop();e+=`one of type ${r.join(", ")}, or ${t}.`}else 2===r.length?e+=`one of type ${r[0]} or ${r[1]}.`:e+=`of type ${r[0]}.`;return null==t?e+=` Received ${t}`:"function"==typeof t&&t.name?e+=` Received function ${t.name}`:"object"==typeof t&&null!=t&&t.constructor?.name&&(e+=` Received an instance of ${t.constructor.name}`),e})(`Key for the ${e} algorithm must be `,t,...r),M=e=>{if(e?.[Symbol.toStringTag]==="CryptoKey")return!0;try{return e instanceof CryptoKey}catch{return!1}};async function z(e,t){if("RSA"===t.kty&&"oth"in t&&void 0!==t.oth)throw new y('RSA JWK "oth" (Other Primes Info) Parameter value is not supported');if(!e.kty.includes(t.kty))throw new y('Invalid or unsupported JWK "alg" (Algorithm) Parameter value');let r=e.resolve?.({kty:t.kty,crv:t.crv})??e.subtle,a=!!(t.d||t.priv),n={...t};return"AKP"!==n.kty&&delete n.alg,delete n.use,crypto.subtle.importKey("jwk",n,r,t.ext??!a,t.key_ops??e.usages[+!!a])}let N=e=>e[Symbol.toStringTag],H={__proto__:null,prime256v1:"P-256",secp384r1:"P-384",secp521r1:"P-521"};function L(e,r,a){let n=(t||=new WeakMap).get(e);return a&&(n?n[r]=a:t.set(e,{[r]:a})),a??n?.[r]}let U=async(e,t,r)=>L(e,r.alg)??L(e,r.alg,await z(r,{...t,alg:r.alg}));async function W(e,t,r){let a=function(e,t,r){let{alg:a,secret:n}=e,o="decrypt"===r||"sign"===r;if(n&&t instanceof Uint8Array)return[0,t];if(T(t)){let i=function(e){let t={__proto__:null,...e};if(void 0!==t.ext&&"boolean"!=typeof t.ext)throw TypeError('"ext" (Extractable) Parameter must be a boolean');if(void 0!==t.key_ops){let e=t.key_ops,r=Array.isArray(e)?[...e]:void 0;if(!r||r.some(e=>"string"!=typeof e)||new Set(r).size!==r.length)throw TypeError('"key_ops" (Key Operations) Parameter must be an array of unique strings');t.key_ops=r}return t}(t);if("string"!=typeof i.kty)throw TypeError(n?I(a,t,"CryptoKey","KeyObject","JSON Web Key","Uint8Array"):I(a,t,"CryptoKey","KeyObject","JSON Web Key"));if(!(n?"oct"===i.kty&&"string"==typeof i.k:"oct"!==i.kty&&(o?"AKP"===i.kty&&"string"==typeof i.priv||"string"==typeof i.d:void 0===i.d&&void 0===i.priv)))throw TypeError(n?'JSON Web Key for symmetric algorithms must have JWK "kty" (Key Type) equal to "oct" and the JWK "k" (Key Value) present':`JSON Web Key for this operation must be a ${o?"private":"public"} JWK`);return((e,t,r)=>{let{alg:a}=e;if(void 0!==t.use){let e="sign"===r||"verify"===r?"sig":"enc";if(t.use!==e)throw TypeError(`Invalid key for this operation, its "use" must be "${e}" when present`)}if(void 0!==t.alg&&t.alg!==a)throw TypeError(`Invalid key for this operation, its "alg" must be "${a}" when present`);if(Array.isArray(t.key_ops)){let a="encrypt"===r||"decrypt"===r?e.ops?.[+("encrypt"!==r)]:r;if(a&&!t.key_ops.includes(a))throw TypeError(`Invalid key for this operation, its "key_ops" must include "${a}" when present`)}})(e,i,r),[3,t,i]}if(!(M(t)||t?.[Symbol.toStringTag]==="KeyObject"))throw TypeError(n?I(a,t,"CryptoKey","KeyObject","JSON Web Key","Uint8Array"):I(a,t,"CryptoKey","KeyObject","JSON Web Key"));if(n){if("secret"!==t.type)throw TypeError(`${N(t)} instances for symmetric algorithms must be of type "secret"`)}else{if("secret"===t.type)throw TypeError(`${N(t)} instances for asymmetric algorithms must not be of type "secret"`);let e=o?"private":"public";if(("public"===t.type||"private"===t.type)&&t.type!==e){let a="sign"===r?"signing":"verify"===r?"verifying":`${r.slice(0,-1)}tion`;throw TypeError(`${N(t)} instances for asymmetric algorithm ${a} must be of type "${e}"`)}}return M(t)?[1,t]:[2,t]}(e,t,r);switch(a[0]){case 0:case 1:return a[1];case 3:{let t=a[1],r=a[2];if("oct"===r.kty)return d(r.k);if(!Object.isFrozen(t)){let{key_ops:e}=t;Array.isArray(e)&&Object.freeze(e),Object.freeze(t)}return U(t,r,e)}case 2:{let t=a[1];if("secret"===t.type)return t.export();if("toCryptoKey"in t&&"function"==typeof t.toCryptoKey)return((e,t)=>{let r=L(e,t.alg);if(r)return r;let a="public"===e.type,n=t.usages[+!a],{asymmetricKeyType:o}=e,i=H[e.asymmetricKeyDetails?.namedCurve],s=t.resolve?.({crv:i,asymmetricKeyType:o})??t.subtle;return L(e,t.alg,e.toCryptoKey(s,a,n))})(t,e);return U(t,t.export({format:"jwk"}),e)}}}async function J(e,t,r,a){let n=i(s(e),s("."),t),o=await W(r,a,"sign");return l(await x(r,o,n))}async function q(e,t,r,a,n){let[o,i]=function(e){if(void 0===e)return[void 0,""];let t=function(e,t){let r,a;try{r=JSON.stringify(t),a=JSON.parse(r)}catch(t){throw new e("JOSE Header is not valid JSON",{cause:t})}if(!T(a))throw new e("JOSE Header is not a JSON object");return[a,r]}(v,e);return[t[0],l(t[1])]}(t);if(!o)throw new v("either setProtectedHeader or setUnprotectedHeader must be called before #sign()");(function(e,t){let{crit:r}=t??{};if(Array.isArray(r)&&new Set(r).size!==r.length)throw new e('"crit" (Critical) Header Parameter MUST NOT contain duplicate values')})(v,o),P(o,D(v,j,r,o,o))||n();let c=function(e){let t=e.alg;if("string"!=typeof t||!t)throw new v('JWS "alg" (Algorithm) Header Parameter missing or invalid');return O(t)}(o),d=l(e),f=await J(i,s(d),c,a);return`${i}.${d}.${f}`}let B=e=>Math.floor(e.getTime()/1e3),F={s:1,m:60,h:3600,d:86400,w:604800,y:0x1e187e0},K=/^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)(?: (ago|from now))?$/i,G="check_failed";function X(){throw TypeError("Invalid time period format")}function V(e){"string"!=typeof e&&X();let t=K.exec(e);(!t||t[4]&&t[1])&&X();let r=Math.round(parseFloat(t[2])*F[t[3][0].toLowerCase()]);return(Number.isFinite(r)||X(),"-"===t[1]||"ago"===t[4])?-r:r}function Y(e,t){if(!Number.isFinite(t))throw TypeError(`Invalid ${e} input`);return t}function Q(e,t){if("string"!=typeof t)throw TypeError(`"${e}" claim must be a string`)}function Z(e,t){return"number"==typeof e?Y(t,e):e instanceof Date?Y(t,B(e)):B(new Date)+V(e)}let ee=e=>{let t=e.toLowerCase();return e.includes("/")?t:`application/${t}`};function et(e,t,r=!1){let a=e[t];if(void 0!==a||r){if("number"!=typeof a)throw new h(`"${t}" claim must be a number`,e,t,"invalid");return a}}function er(e,t){throw new h(`unexpected "${t}" claim value`,e,t,G)}function ea(e){return r.get(e)}function en(e,t,r){try{return d(e)}catch{throw new r(`Failed to base64url decode the ${t}`)}}Symbol();let eo=class{constructor(e={}){if(!T(e))throw TypeError("JWT Claims Set MUST be an object");(r||=new WeakMap).set(this,structuredClone(e))}setIssuer(e){return Q("iss",e),ea(this).iss=e,this}setSubject(e){return Q("sub",e),ea(this).sub=e,this}setAudience(e){if("string"!=typeof e&&(!Array.isArray(e)||Array.from(e).some(e=>"string"!=typeof e)))throw TypeError('"aud" claim must be a string or an array of strings');return ea(this).aud=e,this}setJti(e){return Q("jti",e),ea(this).jti=e,this}setNotBefore(e){return ea(this).nbf=Z(e,"setNotBefore"),this}setExpirationTime(e){return ea(this).exp=Z(e,"setExpirationTime"),this}setIssuedAt(e){let t=ea(this);return void 0===e?t.iat=B(new Date):"string"==typeof e?t.iat=Y("setIssuedAt",B(new Date)+V(e)):t.iat=Z(e,"setIssuedAt"),this}};class ei extends eo{#e;setProtectedHeader(e){if(void 0!==this.#e)throw TypeError("setProtectedHeader can only be called once");return this.#e=e,this}async sign(e,t){return q(function(e){let t=ea(e);for(let e of["iat","nbf","exp"]){let r=t[e];if("number"==typeof r&&!Number.isFinite(r))throw TypeError(`"${e}" claim must be a finite number`)}return a.encode(JSON.stringify(t))}(this),this.#e,t?.crit,e,()=>{throw new w("JWTs MUST NOT use unencoded payload")})}}async function es(e,t,r,a,n,o,c){let d=!1;"function"==typeof r&&(r=await r(n,e),d=!0);let l="string"==typeof c,f=O(o),u=i(void 0!==a?s(a):new Uint8Array,s("."),l?t[2]??=function(e,t,r){try{return s(e)}catch{throw new r(`The ${t} is not a valid base64url string`)}}(c,"payload",v):c),x=en(e.signature,"signature",v),b=await W(f,r,"verify");if(!await p(f,b,x,u))throw new $;return[l?en(c,"payload",v):c,n,l,b,d]}async function ec(e,t,r){if(e instanceof Uint8Array&&(e=n.decode(e)),"string"!=typeof e)throw new v("Compact JWS must be a string or Uint8Array");let{0:a,1:i,2:c,length:l}=e.split(".");if(3!==l)throw new v("Invalid Compact JWS");let f=function(e,t=void 0===e?{}:function(e,t,r){let a;try{a=JSON.parse(o.decode(d(e)))}catch{throw new t(r)}if(!T(a))throw new t(r);return a}(e,v,"JWS Protected Header is invalid")){return t}(a),[u,x]=function(e,t,r){let a=P(e,D(v,j,r[1],e,t)),n=t.alg;if("string"!=typeof n||!n)throw new v('JWS "alg" (Algorithm) Header Parameter missing or invalid');if(r[0]&&!r[0].has(n))throw new m('"alg" (Algorithm) Header Parameter value not allowed');return[a,n]}(f,f,t),p=u?i:function(e){try{return s(e)}catch{throw new v("JWS Compact Serialization payload must use only ASCII characters")}}(i);return es({payload:i,protected:a,signature:c},t,r,a,f,x,p)}async function ed(e,t,r){let a=await ec(e,[r&&function(e,t){if(void 0!==t&&(!Array.isArray(t)||t.some(e=>"string"!=typeof e)))throw TypeError(`"${e}" option must be an array of strings`);if(t)return new Set(t)}("algorithms",r.algorithms),r?.crit],t);if(!a[2])throw new w("JWTs MUST NOT use unencoded payload");let n={payload:function(e,t,r={}){var a,n;let i;try{i=JSON.parse(o.decode(t))}catch{}if(!T(i))throw new w("JWT Claims Set must be a top-level JSON object");let{typ:s}=r;if(void 0!==s&&("string"!=typeof e.typ||ee(e.typ)!==ee(s)))throw new h('unexpected "typ" JWT header value',i,"typ",G);let{requiredClaims:c=[],issuer:d,subject:l,audience:f,maxTokenAge:u}=r,x=[...c];for(let e of(void 0!==u&&x.push("iat"),void 0!==f&&x.push("aud"),void 0!==l&&x.push("sub"),void 0!==d&&x.push("iss"),new Set(x.reverse())))if(!Object.hasOwn(i,e))throw new h(`missing required "${e}" claim`,i,e,"missing");void 0===d||(Array.isArray(d)?d:[d]).includes(i.iss)||er(i,"iss"),void 0!==l&&i.sub!==l&&er(i,"sub"),void 0===f||(a=i.aud,n="string"==typeof f?[f]:f,"string"==typeof a?n.includes(a):!!Array.isArray(a)&&n.some(e=>a.includes(e)))||er(i,"aud");let{clockTolerance:p}=r,b=0;if("string"==typeof p)b=V(p);else if(void 0!==p){if("number"!=typeof p)throw TypeError("Invalid clockTolerance option type");b=p}Y("clockTolerance option",b);let{currentDate:m}=r,y=Y("currentDate option",B(void 0===m?new Date:m)),v=et(i,"iat",void 0!==u),$=et(i,"nbf");if(void 0!==$&&$>y+b)throw new h('"nbf" claim timestamp check failed',i,"nbf",G);let k=et(i,"exp");if(void 0!==k&&k<=y-b)throw new g('"exp" claim timestamp check failed',i,"exp",G);if(void 0!==u){let e=y-v;if(e-b>Y("maxTokenAge option","number"==typeof u?u:V(u)))throw new g('"iat" claim timestamp check failed (too far in the past)',i,"iat",G);if(e<-b)throw new h('"iat" claim timestamp check failed (it should be in the past)',i,"iat",G)}return i}(a[1],a[0],r),protectedHeader:a[1]};return"function"==typeof t?{...n,key:a[3]}:n}let el=process.env.JWT_SECRET||"leadhunter-super-secret-production-key-2026-xyz",ef=new TextEncoder().encode(el);async function eu(e){return new ei({...e}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("7d").sign(ef)}async function ex(e){try{let{payload:t}=await ed(e,ef);return{userId:t.userId,email:t.email,name:t.name,role:t.role,plan:t.plan}}catch{return null}}e.s(["signJwt",0,eu,"verifyJwt",0,ex],36632)},25686,e=>{"use strict";var t=e.i(93458),r=e.i(36632),a=e.i(12e3);let n="lh_auth_token";async function o(e){let o;if(e){if(!(o=e.cookies.get(n)?.value)){let t=e.headers.get("authorization");t&&t.startsWith("Bearer ")&&(o=t.substring(7))}}else try{let e=await (0,t.cookies)();o=e.get(n)?.value}catch{}if(!o)return null;let i=await (0,r.verifyJwt)(o);return i&&i.userId?(0,a.findUserById)(i.userId):null}e.s(["AUTH_COOKIE_NAME",0,n,"getSessionUser",0,o])},12e3,49632,e=>{"use strict";var t=e.i(22734),r=e.i(14747),a=e.i(54799),n=null;function o(e,t){if("number"!=typeof(e=e||g))throw Error("Illegal arguments: "+typeof e+", "+typeof t);e<4?e=4:e>31&&(e=31);var r=[];return r.push("$2b$"),e<10&&r.push("0"),r.push(e.toString()),r.push("$"),r.push(p(function(e){try{return crypto.getRandomValues(new Uint8Array(e))}catch{}try{return a.default.randomBytes(e)}catch{}if(!n)throw Error("Neither WebCryptoAPI nor a crypto module is available. Use bcrypt.setRandomFallback to set an alternative");return n(e)}(h),h)),r.join("")}function i(e,t,r){if("function"==typeof t&&(r=t,t=void 0),"function"==typeof e&&(r=e,e=void 0),void 0===e)e=g;else if("number"!=typeof e)throw Error("illegal arguments: "+typeof e);function a(t){l(function(){try{t(null,o(e))}catch(e){t(e)}})}if(!r)return new Promise(function(e,t){a(function(r,a){r?t(r):e(a)})});if("function"!=typeof r)throw Error("Illegal callback: "+typeof r);a(r)}function s(e,t){if(void 0===t&&(t=g),"number"==typeof t&&(t=o(t)),"string"!=typeof e||"string"!=typeof t)throw Error("Illegal arguments: "+typeof e+", "+typeof t);return A(e,t)}function c(e,t,r,a){function n(r){"string"==typeof e&&"number"==typeof t?i(t,function(t,n){A(e,n,r,a)}):"string"==typeof e&&"string"==typeof t?A(e,t,r,a):l(r.bind(this,Error("Illegal arguments: "+typeof e+", "+typeof t)))}if(!r)return new Promise(function(e,t){n(function(r,a){r?t(r):e(a)})});if("function"!=typeof r)throw Error("Illegal callback: "+typeof r);n(r)}function d(e,t){for(var r=e.length^t.length,a=0;a<e.length;++a)r|=e.charCodeAt(a)^t.charCodeAt(a);return 0===r}var l="function"==typeof setImmediate?setImmediate:"object"==typeof scheduler&&"function"==typeof scheduler.postTask?scheduler.postTask.bind(scheduler):setTimeout;function f(e){for(var t=0,r=0,a=0;a<e.length;++a)(r=e.charCodeAt(a))<128?t+=1:r<2048?t+=2:(64512&r)==55296&&(64512&e.charCodeAt(a+1))==56320?(++a,t+=4):t+=3;return t}var u="./ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(""),x=[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,0,1,54,55,56,57,58,59,60,61,62,63,-1,-1,-1,-1,-1,-1,-1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,-1,-1,-1,-1,-1,-1,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,-1,-1,-1,-1,-1];function p(e,t){var r,a,n=0,o=[];if(t<=0||t>e.length)throw Error("Illegal len: "+t);for(;n<t;){if(r=255&e[n++],o.push(u[r>>2&63]),r=(3&r)<<4,n>=t||(r|=(a=255&e[n++])>>4&15,o.push(u[63&r]),r=(15&a)<<2,n>=t)){o.push(u[63&r]);break}r|=(a=255&e[n++])>>6&3,o.push(u[63&r]),o.push(u[63&a])}return o.join("")}function b(e,t){var r,a,n,o,i,s=0,c=e.length,d=0,l=[];if(t<=0)throw Error("Illegal len: "+t);for(;s<c-1&&d<t&&(r=(i=e.charCodeAt(s++))<x.length?x[i]:-1,a=(i=e.charCodeAt(s++))<x.length?x[i]:-1,-1!=r&&-1!=a)&&(o=r<<2>>>0|(48&a)>>4,l.push(String.fromCharCode(o)),!(++d>=t||s>=c||-1==(n=(i=e.charCodeAt(s++))<x.length?x[i]:-1)||(o=(15&a)<<4>>>0|(60&n)>>2,l.push(String.fromCharCode(o)),++d>=t||s>=c)));){;o=(3&n)<<6>>>0|((i=e.charCodeAt(s++))<x.length?x[i]:-1),l.push(String.fromCharCode(o)),++d}var f=[];for(s=0;s<d;s++)f.push(l[s].charCodeAt(0));return f}var h=16,g=10,m=[0x243f6a88,0x85a308d3,0x13198a2e,0x3707344,0xa4093822,0x299f31d0,0x82efa98,0xec4e6c89,0x452821e6,0x38d01377,0xbe5466cf,0x34e90c6c,0xc0ac29b7,0xc97c50dd,0x3f84d5b5,0xb5470917,0x9216d5d9,0x8979fb1b],y=[0xd1310ba6,0x98dfb5ac,0x2ffd72db,0xd01adfb7,0xb8e1afed,0x6a267e96,0xba7c9045,0xf12c7f99,0x24a19947,0xb3916cf7,0x801f2e2,0x858efc16,0x636920d8,0x71574e69,0xa458fea3,0xf4933d7e,0xd95748f,0x728eb658,0x718bcd58,0x82154aee,0x7b54a41d,0xc25a59b5,0x9c30d539,0x2af26013,0xc5d1b023,0x286085f0,0xca417918,0xb8db38ef,0x8e79dcb0,0x603a180e,0x6c9e0e8b,0xb01e8a3e,0xd71577c1,0xbd314b27,0x78af2fda,0x55605c60,0xe65525f3,0xaa55ab94,0x57489862,0x63e81440,0x55ca396a,0x2aab10b6,0xb4cc5c34,0x1141e8ce,0xa15486af,0x7c72e993,0xb3ee1411,0x636fbc2a,0x2ba9c55d,0x741831f6,0xce5c3e16,0x9b87931e,0xafd6ba33,0x6c24cf5c,0x7a325381,0x28958677,0x3b8f4898,0x6b4bb9af,0xc4bfe81b,0x66282193,0x61d809cc,0xfb21a991,0x487cac60,0x5dec8032,0xef845d5d,0xe98575b1,0xdc262302,0xeb651b88,0x23893e81,0xd396acc5,0xf6d6ff3,0x83f44239,0x2e0b4482,0xa4842004,0x69c8f04a,0x9e1f9b5e,0x21c66842,0xf6e96c9a,0x670c9c61,0xabd388f0,0x6a51a0d2,0xd8542f68,0x960fa728,0xab5133a3,0x6eef0b6c,0x137a3be4,0xba3bf050,0x7efb2a98,0xa1f1651d,0x39af0176,0x66ca593e,0x82430e88,0x8cee8619,0x456f9fb4,0x7d84a5c3,0x3b8b5ebe,0xe06f75d8,0x85c12073,0x401a449f,0x56c16aa6,0x4ed3aa62,0x363f7706,0x1bfedf72,0x429b023d,0x37d0d724,0xd00a1248,0xdb0fead3,0x49f1c09b,0x75372c9,0x80991b7b,0x25d479d8,0xf6e8def7,0xe3fe501a,0xb6794c3b,0x976ce0bd,0x4c006ba,0xc1a94fb6,0x409f60c4,0x5e5c9ec2,0x196a2463,0x68fb6faf,0x3e6c53b5,0x1339b2eb,0x3b52ec6f,0x6dfc511f,0x9b30952c,0xcc814544,0xaf5ebd09,0xbee3d004,0xde334afd,0x660f2807,0x192e4bb3,0xc0cba857,0x45c8740f,0xd20b5f39,0xb9d3fbdb,0x5579c0bd,0x1a60320a,0xd6a100c6,0x402c7279,0x679f25fe,0xfb1fa3cc,0x8ea5e9f8,0xdb3222f8,0x3c7516df,0xfd616b15,0x2f501ec8,0xad0552ab,0x323db5fa,0xfd238760,0x53317b48,0x3e00df82,0x9e5c57bb,0xca6f8ca0,0x1a87562e,0xdf1769db,0xd542a8f6,0x287effc3,0xac6732c6,0x8c4f5573,0x695b27b0,0xbbca58c8,0xe1ffa35d,0xb8f011a0,0x10fa3d98,0xfd2183b8,0x4afcb56c,0x2dd1d35b,0x9a53e479,0xb6f84565,0xd28e49bc,0x4bfb9790,0xe1ddf2da,0xa4cb7e33,0x62fb1341,0xcee4c6e8,0xef20cada,0x36774c01,0xd07e9efe,0x2bf11fb4,0x95dbda4d,0xae909198,0xeaad8e71,0x6b93d5a0,0xd08ed1d0,0xafc725e0,0x8e3c5b2f,0x8e7594b7,0x8ff6e2fb,0xf2122b64,0x8888b812,0x900df01c,0x4fad5ea0,0x688fc31c,0xd1cff191,0xb3a8c1ad,0x2f2f2218,0xbe0e1777,0xea752dfe,0x8b021fa1,0xe5a0cc0f,0xb56f74e8,0x18acf3d6,0xce89e299,0xb4a84fe0,0xfd13e0b7,0x7cc43b81,0xd2ada8d9,0x165fa266,0x80957705,0x93cc7314,0x211a1477,0xe6ad2065,0x77b5fa86,0xc75442f5,0xfb9d35cf,0xebcdaf0c,0x7b3e89a0,0xd6411bd3,0xae1e7e49,2428461,0x2071b35e,0x226800bb,0x57b8e0af,0x2464369b,0xf009b91e,0x5563911d,0x59dfa6aa,0x78c14389,0xd95a537f,0x207d5ba2,0x2e5b9c5,0x83260376,0x6295cfa9,0x11c81968,0x4e734a41,0xb3472dca,0x7b14a94a,0x1b510052,0x9a532915,0xd60f573f,0xbc9bc6e4,0x2b60a476,0x81e67400,0x8ba6fb5,0x571be91f,0xf296ec6b,0x2a0dd915,0xb6636521,0xe7b9f9b6,0xff34052e,0xc5855664,0x53b02d5d,0xa99f8fa1,0x8ba4799,0x6e85076a,0x4b7a70e9,0xb5b32944,0xdb75092e,0xc4192623,290971e4,0x49a7df7d,0x9cee60b8,0x8fedb266,0xecaa8c71,0x699a17ff,0x5664526c,0xc2b19ee1,0x193602a5,0x75094c29,0xa0591340,0xe4183a3e,0x3f54989a,0x5b429d65,0x6b8fe4d6,0x99f73fd6,0xa1d29c07,0xefe830f5,0x4d2d38e6,0xf0255dc1,0x4cdd2086,0x8470eb26,0x6382e9c6,0x21ecc5e,0x9686b3f,0x3ebaefc9,0x3c971814,0x6b6a70a1,0x687f3584,0x52a0e286,0xb79c5305,0xaa500737,0x3e07841c,0x7fdeae5c,0x8e7d44ec,0x5716f2b8,0xb03ada37,0xf0500c0d,0xf01c1f04,0x200b3ff,0xae0cf51a,0x3cb574b2,0x25837a58,0xdc0921bd,0xd19113f9,0x7ca92ff6,0x94324773,0x22f54701,0x3ae5e581,0x37c2dadc,0xc8b57634,0x9af3dda7,0xa9446146,0xfd0030e,0xecc8c73e,0xa4751e41,0xe238cd99,0x3bea0e2f,0x3280bba1,0x183eb331,0x4e548b38,0x4f6db908,0x6f420d03,0xf60a04bf,0x2cb81290,0x24977c79,0x5679b072,0xbcaf89af,0xde9a771f,0xd9930810,0xb38bae12,0xdccf3f2e,0x5512721f,0x2e6b7124,0x501adde6,0x9f84cd87,0x7a584718,0x7408da17,0xbc9f9abc,0xe94b7d8c,0xec7aec3a,0xdb851dfa,0x63094366,0xc464c3d2,0xef1c1847,0x3215d908,0xdd433b37,0x24c2ba16,0x12a14d43,0x2a65c451,0x50940002,0x133ae4dd,0x71dff89e,0x10314e55,0x81ac77d6,0x5f11199b,0x43556f1,0xd7a3c76b,0x3c11183b,0x5924a509,0xf28fe6ed,0x97f1fbfa,0x9ebabf2c,0x1e153c6e,0x86e34570,0xeae96fb1,0x860e5e0a,0x5a3e2ab3,0x771fe71c,0x4e3d06fa,0x2965dcb9,0x99e71d0f,0x803e89d6,0x5266c825,0x2e4cc978,0x9c10b36a,0xc6150eba,0x94e2ea78,0xa5fc3c53,0x1e0a2df4,0xf2f74ea7,0x361d2b3d,0x1939260f,0x19c27960,0x5223a708,0xf71312b6,0xebadfe6e,0xeac31f66,0xe3bc4595,0xa67bc883,0xb17f37d1,0x18cff28,0xc332ddef,0xbe6c5aa5,0x65582185,0x68ab9802,0xeecea50f,0xdb2f953b,0x2aef7dad,0x5b6e2f84,0x1521b628,0x29076170,0xecdd4775,0x619f1510,0x13cca830,0xeb61bd96,0x334fe1e,0xaa0363cf,0xb5735c90,0x4c70a239,0xd59e9e0b,0xcbaade14,0xeecc86bc,0x60622ca7,0x9cab5cab,0xb2f3846e,0x648b1eaf,0x19bdf0ca,0xa02369b9,0x655abb50,0x40685a32,0x3c2ab4b3,0x319ee9d5,0xc021b8f7,0x9b540b19,0x875fa099,0x95f7997e,0x623d7da8,0xf837889a,0x97e32d77,0x11ed935f,0x16681281,0xe358829,0xc7e61fd6,0x96dedfa1,0x7858ba99,0x57f584a5,0x1b227263,0x9b83c3ff,0x1ac24696,0xcdb30aeb,0x532e3054,0x8fd948e4,0x6dbc3128,0x58ebf2ef,0x34c6ffea,0xfe28ed61,0xee7c3c73,0x5d4a14d9,0xe864b7e3,0x42105d14,0x203e13e0,0x45eee2b6,0xa3aaabea,0xdb6c4f15,0xfacb4fd0,0xc742f442,0xef6abbb5,0x654f3b1d,0x41cd2105,0xd81e799e,0x86854dc7,0xe44b476a,0x3d816250,0xcf62a1f2,0x5b8d2646,0xfc8883a0,0xc1c7b6a3,0x7f1524c3,0x69cb7492,0x47848a0b,0x5692b285,0x95bbf00,0xad19489d,0x1462b174,0x23820e00,0x58428d2a,0xc55f5ea,0x1dadf43e,0x233f7061,0x3372f092,0x8d937e41,0xd65fecf1,0x6c223bdb,0x7cde3759,0xcbee7460,0x4085f2a7,0xce77326e,0xa6078084,0x19f8509e,0xe8efd855,0x61d99735,0xa969a7aa,0xc50c06c2,0x5a04abfc,0x800bcadc,0x9e447a2e,0xc3453484,0xfdd56705,0xe1e9ec9,0xdb73dbd3,0x105588cd,0x675fda79,0xe3674340,0xc5c43465,0x713e38d8,0x3d28f89e,0xf16dff20,0x153e21e7,0x8fb03d4a,0xe6e39f2b,0xdb83adf7,0xe93d5a68,0x948140f7,0xf64c261c,0x94692934,0x411520f7,0x7602d4f7,0xbcf46b2e,0xd4a20068,0xd4082471,0x3320f46a,0x43b7d4b7,0x500061af,0x1e39f62e,0x97244546,0x14214f74,0xbf8b8840,0x4d95fc1d,0x96b591af,0x70f4ddd3,0x66a02f45,0xbfbc09ec,0x3bd9785,0x7fac6dd0,0x31cb8504,0x96eb27b3,0x55fd3941,0xda2547e6,0xabca0a9a,0x28507825,0x530429f4,0xa2c86da,0xe9b66dfb,0x68dc1462,0xd7486900,0x680ec0a4,0x27a18dee,0x4f3ffea2,0xe887ad8c,0xb58ce006,0x7af4d6b6,0xaace1e7c,0xd3375fec,0xce78a399,0x406b2a42,0x20fe9e35,0xd9f385b9,0xee39d7ab,0x3b124e8b,0x1dc9faf7,0x4b6d1856,0x26a36631,0xeae397b2,0x3a6efa74,0xdd5b4332,0x6841e7f7,0xca7820fb,0xfb0af54e,0xd8feb397,0x454056ac,0xba489527,0x55533a3a,0x20838d87,0xfe6ba9b7,0xd096954b,0x55a867bc,0xa1159a58,0xcca92963,0x99e1db33,0xa62a4a56,0x3f3125f9,0x5ef47e1c,0x9029317c,0xfdf8e802,0x4272f70,0x80bb155c,0x5282ce3,0x95c11548,0xe4c66d22,0x48c1133f,0xc70f86dc,0x7f9c9ee,0x41041f0f,0x404779a4,0x5d886e17,0x325f51eb,0xd59bc0d1,0xf2bcc18f,0x41113564,0x257b7834,0x602a9c60,0xdff8e8a3,0x1f636c1b,0xe12b4c2,0x2e1329e,0xaf664fd1,0xcad18115,0x6b2395e0,0x333e92e1,0x3b240b62,0xeebeb922,0x85b2a20e,0xe6ba0d99,0xde720c8c,0x2da2f728,0xd0127845,0x95b794fd,0x647d0862,0xe7ccf5f0,0x5449a36f,0x877d48fa,0xc39dfd27,0xf33e8d1e,0xa476341,0x992eff74,0x3a6f6eab,0xf4f8fd37,0xa812dc60,0xa1ebddf8,0x991be14c,0xdb6e6b0d,0xc67b5510,0x6d672c37,0x2765d43b,0xdcd0e804,0xf1290dc7,0xcc00ffa3,0xb5390f92,0x690fed0b,0x667b9ffb,0xcedb7d9c,0xa091cf0b,0xd9155ea3,0xbb132f88,0x515bad24,0x7b9479bf,0x763bd6eb,0x37392eb3,0xcc115979,0x8026e297,0xf42e312d,0x6842ada7,0xc66a2b3b,0x12754ccc,0x782ef11c,0x6a124237,0xb79251e7,0x6a1bbe6,0x4bfb6350,0x1a6b1018,0x11caedfa,0x3d25bdd8,0xe2e1c3c9,0x44421659,0xa121386,0xd90cec6e,0xd5abea2a,0x64af674e,0xda86a85f,0xbebfe988,0x64e4c3fe,0x9dbc8057,0xf0f7c086,0x60787bf8,0x6003604d,0xd1fd8346,0xf6381fb0,0x7745ae04,0xd736fccc,0x83426b33,0xf01eab71,0xb0804187,0x3c005e5f,0x77a057be,0xbde8ae24,0x55464299,0xbf582e61,0x4e58f48f,0xf2ddfda2,0xf474ef38,0x8789bdc2,0x5366f9c3,0xc8b38e74,0xb475f255,0x46fcd9b9,0x7aeb2661,0x8b1ddf84,0x846a0e79,0x915f95e2,0x466e598e,0x20b45770,0x8cd55591,0xc902de4c,0xb90bace1,0xbb8205d0,0x11a86248,0x7574a99e,0xb77f19b6,0xe0a9dc09,0x662d09a1,0xc4324633,0xe85a1f02,0x9f0be8c,0x4a99a025,0x1d6efe10,0x1ab93d1d,0xba5a4df,0xa186f20f,0x2868f169,0xdcb7da83,0x573906fe,0xa1e2ce9b,0x4fcd7f52,0x50115e01,0xa70683fa,0xa002b5c4,0xde6d027,0x9af88c27,0x773f8641,0xc3604c06,0x61a806b5,0xf0177a28,0xc0f586e0,6314154,0x30dc7d62,0x11e69ed7,0x2338ea63,0x53c2dd94,0xc2c21634,0xbbcbee56,0x90bcb6de,0xebfc7da1,0xce591d76,0x6f05e409,0x4b7c0188,0x39720a3d,0x7c927c24,0x86e3725f,0x724d9db9,0x1ac15bb4,0xd39eb8fc,0xed545578,0x8fca5b5,0xd83d7cd3,0x4dad0fc4,0x1e50ef5e,0xb161e6f8,0xa28514d9,0x6c51133c,0x6fd5c7e7,0x56e14ec4,0x362abfce,0xddc6c837,0xd79a3234,0x92638212,0x670efa8e,0x406000e0,0x3a39ce37,0xd3faf5cf,0xabc27737,0x5ac52d1b,0x5cb0679e,0x4fa33742,0xd3822740,0x99bc9bbe,0xd5118e9d,0xbf0f7315,0xd62d1c7e,0xc700c47b,0xb78c1b6b,0x21a19045,0xb26eb1be,0x6a366eb4,0x5748ab2f,0xbc946e79,0xc6a376d2,0x6549c2c8,0x530ff8ee,0x468dde7d,0xd5730a1d,0x4cd04dc6,0x2939bbdb,0xa9ba4650,0xac9526e8,0xbe5ee304,0xa1fad5f0,0x6a2d519a,0x63ef8ce2,0x9a86ee22,0xc089c2b8,0x43242ef6,0xa51e03aa,0x9cf2d0a4,0x83c061ba,0x9be96a4d,0x8fe51550,0xba645bd6,0x2826a2f9,0xa73a3ae1,0x4ba99586,0xef5562e9,0xc72fefd3,0xf752f7da,0x3f046f69,0x77fa0a59,0x80e4a915,0x87b08601,0x9b09e6ad,0x3b3ee593,0xe990fd5a,0x9e34d797,0x2cf0b7d9,0x22b8b51,0x96d5ac3a,0x17da67d,0xd1cf3ed6,0x7c7d2d28,0x1f9f25cf,0xadf2b89b,0x5ad6b472,0x5a88f54c,0xe029ac71,0xe019a5e6,0x47b0acfd,0xed93fa9b,0xe8d3c48d,0x283b57cc,0xf8d56629,0x79132e28,0x785f0191,0xed756055,0xf7960e44,0xe3d35e8c,0x15056dd4,0x88f46dba,0x3a16125,0x564f0bd,0xc3eb9e15,0x3c9057a2,0x97271aec,0xa93a072a,0x1b3f6d9b,0x1e6321f5,0xf59c66fb,0x26dcf319,0x7533d928,0xb155fdf5,0x3563482,0x8aba3cbb,0x28517711,0xc20ad9f8,0xabcc5167,0xccad925f,0x4de81751,0x3830dc8e,0x379d5862,0x9320f991,0xea7a90c2,0xfb3e7bce,0x5121ce64,0x774fbe32,0xa8b6e37e,0xc3293d46,0x48de5369,0x6413e680,0xa2ae0810,0xdd6db224,0x69852dfd,0x9072166,0xb39a460a,0x6445c0dd,0x586cdecf,0x1c20c8ae,0x5bbef7dd,0x1b588d40,0xccd2017f,0x6bb4e3bb,0xdda26a7e,0x3a59ff45,0x3e350a44,0xbcb4cdd5,0x72eacea8,0xfa6484bb,0x8d6612ae,0xbf3c6f47,0xd29be463,0x542f5d9e,0xaec2771b,0xf64e6370,0x740e0d8d,0xe75b1357,0xf8721671,0xaf537d5d,0x4040cb08,0x4eb4e2cc,0x34d2466a,0x115af84,3786409e3,0x95983a1d,0x6b89fb4,0xce6ea048,0x6f3f3b82,0x3520ab82,0x11a1d4b,0x277227f8,0x611560b1,0xe7933fdc,0xbb3a792b,0x344525bd,0xa08839e1,0x51ce794b,0x2f32c9b7,0xa01fbac9,0xe01cc87e,0xbcc7d1f6,0xcf0111c3,0xa1e8aac7,0x1a908749,0xd44fbd9a,0xd0dadecb,0xd50ada38,0x339c32a,0xc6913667,0x8df9317c,0xe0b12b4f,0xf79e59b7,0x43f5bb3a,0xf2d519ff,0x27d9459c,0xbf97222c,0x15e6fc2a,0xf91fc71,0x9b941525,0xfae59361,0xceb69ceb,0xc2a86459,0x12baa8d1,0xb6c1075e,0xe3056a0c,0x10d25065,0xcb03a442,0xe0ec6e0e,0x1698db3b,0x4c98a0be,0x3278e964,0x9f1f9532,0xe0d392df,0xd3a0342b,0x8971f21e,0x1b0a7441,0x4ba3348c,0xc5be7120,0xc37632d8,0xdf359f8d,0x9b992f2e,0xe60b6f47,0xfe3f11d,0xe54cda54,0x1edad891,0xce6279cf,0xcd3e7e6f,0x1618b166,0xfd2c1d05,0x848fd2c5,0xf6fb2299,0xf523f357,0xa6327623,0x93a83531,0x56cccd02,0xacf08162,0x5a75ebb5,0x6e163697,0x88d273cc,0xde966292,0x81b949d0,0x4c50901b,0x71c65614,0xe6c6c7bd,0x327a140a,0x45e1d006,0xc3f27b9a,0xc9aa53fd,0x62a80f00,0xbb25bfe2,0x35bdd2f6,0x71126905,0xb2040222,0xb6cbcf7c,0xcd769c2b,0x53113ec0,0x1640e3d3,0x38abbd60,0x2547adf0,0xba38209c,0xf746ce76,0x77afa1c5,0x20756060,0x85cbfe4e,0x8ae88dd8,0x7aaaf9b0,0x4cf9aa7e,0x1948c25c,0x2fb8a8c,0x1c36ae4,0xd6ebe1f9,0x90d4f869,0xa65cdea0,0x3f09252d,0xc208e69f,0xb74e6132,0xce77e25b,0x578fdfe3,0x3ac372e6],v=[0x4f727068,0x65616e42,0x65686f6c,0x64657253,0x63727944,0x6f756274];function w(e,t,r,a){var n=e[t],o=e[t+1];return n^=r[0],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[1],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[2],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[3],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[4],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[5],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[6],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[7],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[8],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[9],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[10],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[11],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[12],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[13],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[14],o^=(a[n>>>24]+a[256|n>>16&255]^a[512|n>>8&255])+a[768|255&n]^r[15],n^=(a[o>>>24]+a[256|o>>16&255]^a[512|o>>8&255])+a[768|255&o]^r[16],e[t]=o^r[17],e[t+1]=n,e}function $(e,t){for(var r=0,a=0;r<4;++r)a=a<<8|255&e[t],t=(t+1)%e.length;return{key:a,offp:t}}function k(e,t,r){for(var a,n=0,o=[0,0],i=t.length,s=r.length,c=0;c<i;c++)n=(a=$(e,n)).offp,t[c]=t[c]^a.key;for(c=0;c<i;c+=2)o=w(o,0,t,r),t[c]=o[0],t[c+1]=o[1];for(c=0;c<s;c+=2)o=w(o,0,t,r),r[c]=o[0],r[c+1]=o[1]}function E(e,t,r,a,n){var o,i,s=v.slice(),c=s.length;if(r<4||r>31){if(i=Error("Illegal number of rounds (4-31): "+r),a)return void l(a.bind(this,i));throw i}if(t.length!==h){if(i=Error("Illegal salt length: "+t.length+" != "+h),a)return void l(a.bind(this,i));throw i}r=1<<r>>>0;var d,f,u,x=0;function p(){if(n&&n(x/r),x<r)for(var o=Date.now();x<r&&(x+=1,k(e,d,f),k(t,d,f),!(Date.now()-o>100)););else{for(x=0;x<64;x++)for(u=0;u<c>>1;u++)w(s,u<<1,d,f);var i=[];for(x=0;x<c;x++)i.push((s[x]>>24&255)>>>0),i.push((s[x]>>16&255)>>>0),i.push((s[x]>>8&255)>>>0),i.push((255&s[x])>>>0);return a?void a(null,i):i}a&&l(p)}if("function"==typeof Int32Array?(d=new Int32Array(m),f=new Int32Array(y)):(d=m.slice(),f=y.slice()),!function(e,t,r,a){for(var n,o=0,i=[0,0],s=r.length,c=a.length,d=0;d<s;d++)o=(n=$(t,o)).offp,r[d]=r[d]^n.key;for(d=0,o=0;d<s;d+=2)o=(n=$(e,o)).offp,i[0]^=n.key,o=(n=$(e,o)).offp,i[1]^=n.key,i=w(i,0,r,a),r[d]=i[0],r[d+1]=i[1];for(d=0;d<c;d+=2)o=(n=$(e,o)).offp,i[0]^=n.key,o=(n=$(e,o)).offp,i[1]^=n.key,i=w(i,0,r,a),a[d]=i[0],a[d+1]=i[1]}(t,e,d,f),void 0!==a)p();else for(;;)if(void 0!==(o=p()))return o||[]}function A(e,t,r,a){if("string"!=typeof e||"string"!=typeof t){if(n=Error("Invalid string / salt: Not a string"),r)return void l(r.bind(this,n));throw n}if("$"!==t.charAt(0)||"2"!==t.charAt(1)){if(n=Error("Invalid salt version: "+t.substring(0,2)),r)return void l(r.bind(this,n));throw n}if("$"===t.charAt(2))o="\0",i=3;else{if("a"!==(o=t.charAt(2))&&"b"!==o&&"y"!==o||"$"!==t.charAt(3)){if(n=Error("Invalid salt revision: "+t.substring(2,4)),r)return void l(r.bind(this,n));throw n}i=4}if(t.charAt(i+2)>"$"){if(n=Error("Missing salt rounds"),r)return void l(r.bind(this,n));throw n}var n,o,i,s=10*parseInt(t.substring(i,i+1),10)+parseInt(t.substring(i+1,i+2),10),c=t.substring(i+3,i+25),d=function(e){for(var t,r,a=0,n=Array(f(e)),o=0,i=e.length;o<i;++o)(t=e.charCodeAt(o))<128?n[a++]=t:(t<2048?n[a++]=t>>6|192:((64512&t)==55296&&(64512&(r=e.charCodeAt(o+1)))==56320?(t=65536+((1023&t)<<10)+(1023&r),++o,n[a++]=t>>18|240,n[a++]=t>>12&63|128):n[a++]=t>>12|224,n[a++]=t>>6&63|128),n[a++]=63&t|128);return n}(e+=o>="a"?"\0":""),u=b(c,h);function x(e){var t=[];return t.push("$2"),o>="a"&&t.push(o),t.push("$"),s<10&&t.push("0"),t.push(s.toString()),t.push("$"),t.push(p(u,u.length)),t.push(p(e,4*v.length-1)),t.join("")}if(void 0===r)return x(E(d,u,s));E(d,u,s,function(e,t){e?r(e,null):r(null,x(t))},a)}let S={setRandomFallback:function(e){n=e},genSaltSync:o,genSalt:i,hashSync:s,hash:c,compareSync:function(e,t){if("string"!=typeof e||"string"!=typeof t)throw Error("Illegal arguments: "+typeof e+", "+typeof t);return 60===t.length&&d(s(e,t.substring(0,t.length-31)),t)},compare:function(e,t,r,a){function n(r){"string"!=typeof e||"string"!=typeof t?l(r.bind(this,Error("Illegal arguments: "+typeof e+", "+typeof t))):60!==t.length?l(r.bind(this,null,!1)):c(e,t.substring(0,29),function(e,a){e?r(e):r(null,d(a,t))},a)}if(!r)return new Promise(function(e,t){n(function(r,a){r?t(r):e(a)})});if("function"!=typeof r)throw Error("Illegal callback: "+typeof r);n(r)},getRounds:function(e){if("string"!=typeof e)throw Error("Illegal arguments: "+typeof e);return parseInt(e.split("$")[2],10)},getSalt:function(e){if("string"!=typeof e)throw Error("Illegal arguments: "+typeof e);if(60!==e.length)throw Error("Illegal hash length: "+e.length+" != 60");return e.substring(0,29)},truncates:function(e){if("string"!=typeof e)throw Error("Illegal arguments: "+typeof e);return f(e)>72},encodeBase64:function(e,t){return p(e,t)},decodeBase64:function(e,t){return b(e,t)}};e.s(["default",0,S],49632);var _=e.i(81702),C=e.i(75753);function R(e){return{title:e.title,category:e.category,brand:{logoUrl:e.logoUrl,logoDominantColor:e.brandColors?.logoDominant,logoHasAlpha:e.logoHasAlpha,logoLuminance:e.logoLuminance,logoAspect:e.logoAspect,primaryColor:e.brandColors?.primary,secondaryColor:e.brandColors?.secondary,typography:e.brandTypography,photoDominantColor:e.brandColors?.photoDominant,photoLuminance:e.photoLuminance,photoCount:e.photos?.length??0}}}var O=e.i(44103),T=e.i(27453),j=e.i(58715);function D(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function P(e){return e.normalize("NFD").replace(/[^\x00-\x7F]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")||"empresa"}let I=96,M=56;function z(e,t,r,a,n,o=!1){return`<g transform="translate(${t} ${r}) scale(${(a/24).toFixed(4)})" ${o?`fill="${n}" stroke="none"`:`fill="none" stroke="${n}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"`}><path d="${({phone:"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z",pin:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zM12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",instagram:"M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.4.6.2 1.1.5 1.6 1s.8 1 1 1.6c.2.6.4 1.3.4 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.7-.4 2.3-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.6.2-1.3.4-2.3.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.4-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.2-.6-.4-1.3-.4-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1 .2-1.7.4-2.3.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.6-.2 1.3-.4 2.3-.4C8.5 2 8.8 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.8 6.9a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",facebook:"M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",star:"M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1L12 2z",globe:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c2.8 3 4.2 6.3 4.2 10S14.8 19 12 22c-2.8-3-4.2-6.3-4.2-10S9.2 5 12 2zM2.5 9h19M2.5 15h19"})[e]}"/></g>`}function N(e,t,r,a,n,o,i){let s=Math.min(n*Math.max(t.logoFit.aspect,1)*1.1,52);if(e.logoUrl){let o=(0,C.needsLogoChip)({logoUrl:e.logoUrl,logoHasAlpha:e.logoHasAlpha,logoLuminance:e.logoLuminance},i),c=(e.logoLuminance??.5)>.72,d=(0,j.isLight)(i)&&c?t.palette.primaryDark:"#ffffff",l=.16*n,f=o?`<rect x="${(r-l).toFixed(1)}" y="${(a-l).toFixed(1)}" width="${(s+2*l).toFixed(1)}" height="${(n+2*l).toFixed(1)}" rx="${(.18*n).toFixed(1)}" fill="${d}"/>`:"";return`${f}<image href="${D(e.logoUrl)}" x="${r}" y="${a}" width="${s.toFixed(1)}" height="${n}" preserveAspectRatio="xMinYMid meet"/>`}let c=e.title.split(/\s+/).filter(e=>e.length>2).slice(0,2).map(e=>e[0]?.toUpperCase()).join("")||e.title.slice(0,2).toUpperCase();return`<g>
      <rect x="${r}" y="${a}" width="${n}" height="${n}" rx="${.22*n}" fill="${o?"rgba(255,255,255,0.2)":t.palette.primary}"/>
      <text x="${r+n/2}" y="${a+.68*n}" text-anchor="middle"
        font-family="${D(t.fonts.heading)}, sans-serif" font-weight="800"
        font-size="${(.44*n).toFixed(1)}" fill="${o?"#ffffff":t.palette.onPrimary}">${D(c)}</text>
    </g>`}function H(e,t){return`<svg xmlns="http://www.w3.org/2000/svg" width="${I}mm" height="${M}mm" viewBox="0 0 ${I} ${M}">
  <rect width="${I}" height="${M}" fill="${t}"/>
  <g transform="translate(3 3)">
${e}
  </g>
</svg>`}let L={whatsapp:"M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.5A10 10 0 1 0 12 2zm5.5 14.4c-.2.6-1.2 1.2-1.7 1.2-.4 0-1 .3-3.3-.7-2.8-1.2-4.5-4-4.6-4.2-.2-.2-1.1-1.4-1.1-2.7s.7-1.9 1-2.2c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.8 2c.1.2.1.4 0 .6l-.4.5-.3.3c-.1.1-.2.3-.1.5.2.3.8 1.3 1.7 2.1 1.1 1 2 1.3 2.3 1.4.2.1.4 0 .5-.1l.8-1c.2-.2.3-.2.5-.1l2 1c.2.1.4.2.4.3 0 .2 0 .7-.3 1.2z",phone:"M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.1 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z",instagram:"M12 2c2.7 0 3 0 4.1.1 1 0 1.7.2 2.3.4.6.2 1.1.5 1.6 1s.8 1 1 1.6c.2.6.4 1.3.4 2.3.1 1.1.1 1.4.1 4.1s0 3-.1 4.1c0 1-.2 1.7-.4 2.3-.2.6-.5 1.1-1 1.6s-1 .8-1.6 1c-.6.2-1.3.4-2.3.4-1.1.1-1.4.1-4.1.1s-3 0-4.1-.1c-1 0-1.7-.2-2.3-.4-.6-.2-1.1-.5-1.6-1s-.8-1-1-1.6c-.2-.6-.4-1.3-.4-2.3C2 15 2 14.7 2 12s0-3 .1-4.1c0-1 .2-1.7.4-2.3.2-.6.5-1.1 1-1.6s1-.8 1.6-1c.6-.2 1.3-.4 2.3-.4C8.5 2 8.8 2 12 2zm0 5a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 8.2a3.2 3.2 0 1 1 0-6.4 3.2 3.2 0 0 1 0 6.4zM17.8 6.9a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0z",facebook:"M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.4v7A10 10 0 0 0 22 12z",website:"M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 0c2.8 3 4.2 6.3 4.2 10S14.8 19 12 22c-2.8-3-4.2-6.3-4.2-10S9.2 5 12 2zM2.5 9h19M2.5 15h19",maps:"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0zm-9 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"},U=["whatsapp","instagram","facebook"];function W(e,t){var r;let a=function(e){var t;let r=[],a=(0,T.resolveContact)(e);if(a.hasWhatsApp){let t=e.whatsappNumber||e.phone;r.push({kind:"whatsapp",label:"Chamar no WhatsApp",sublabel:t,href:`https://wa.me/${a.digits}`,primary:!0})}let n=(t=e.phone,(0,O.sanitizePhone)(t).replace(/\D/g,""));n.length>=10&&r.push({kind:"phone",label:"Ligar agora",sublabel:e.phone,href:`tel:+55${n}`}),e.instagramHandle&&r.push({kind:"instagram",label:"Instagram",sublabel:`@${e.instagramHandle}`,href:`https://instagram.com/${e.instagramHandle}`}),e.facebookHandle&&r.push({kind:"facebook",label:"Facebook",sublabel:`/${e.facebookHandle}`,href:`https://facebook.com/${e.facebookHandle}`});let o=e.originalWebsite;if(o&&!/instagram\.com|facebook\.com|wa\.me|whatsapp\.com|linktr\.ee|beacons\.ai/i.test(o)&&r.push({kind:"website",label:"Site oficial",sublabel:o.replace(/^https?:\/\//,"").replace(/\/$/,""),href:o.startsWith("http")?o:`https://${o}`}),e.address){let t=encodeURIComponent(`${e.title}, ${e.address}, ${e.city}`);r.push({kind:"maps",label:"Como chegar",sublabel:`${e.address}, ${e.city.split(",")[0].trim()}`,href:`https://www.google.com/maps/search/?api=1&query=${t}`})}return r}(e),n=e.city.split(",")[0].trim(),o=e.logoUrl?`<img src="${D(e.logoUrl)}" alt="Logo ${D(e.title)}">`:`<span class="initials">${D((r=e.title).split(/\s+/).filter(e=>e.length>2).slice(0,2).map(e=>e[0]?.toUpperCase()).join("")||r.slice(0,2).toUpperCase())}</span>`,i=Array.from({length:5},(t,r)=>`<svg width="14" height="14" viewBox="0 0 24 24" fill="${r<Math.round(e.rating)?"#fbbf24":"none"}" stroke="${r<Math.round(e.rating)?"#fbbf24":"rgba(255,255,255,.35)"}" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`).join(""),s=a.map((e,t)=>{let r=U.includes(e.kind),a=`<svg viewBox="0 0 24 24" width="22" height="22" fill="${r?"currentColor":"none"}" stroke="${r?"none":"currentColor"}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${L[e.kind]}"/></svg>`;return`      <a class="link${e.primary?" primary":""}" style="--i:${t}"
        href="${D(e.href)}"${e.href.startsWith("tel:")?"":' target="_blank" rel="noopener"'}>
        <span class="link-icon">${a}</span>
        <span class="link-text">
          <strong>${D(e.label)}</strong>
          ${e.sublabel?`<small>${D(e.sublabel)}</small>`:""}
        </span>
      </a>`}).join("\n");return`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${D(e.title)} — Contato</title>
  <meta name="description" content="Fale com a ${D(e.title)}, ${D(e.category)} em ${D(n)}.">
  <meta name="theme-color" content="${t.palette.primary}">
  <meta property="og:title" content="${D(e.title)}">
  <meta property="og:description" content="${D(e.category)} em ${D(n)}">
  ${e.logoUrl?`<link rel="icon" href="${D(e.logoUrl)}">`:""}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${D(t.fonts.googleHref)}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="blob b1"></div>
  <div class="blob b2"></div>
  <div class="blob b3"></div>

  <main>
    <div class="avatar">${o}</div>
    <h1>${D(e.title)}</h1>
    <p class="tagline">${D(e.category)} \xb7 ${D(n)}</p>
    ${e.reviewsCount>0?`<div class="rating">${i}<strong>${e.rating.toFixed(1)}</strong><span>(${e.reviewsCount})</span></div>`:""}

    <nav class="links">
${s}
    </nav>

    <p class="address">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
      ${D(e.address)}, ${D(n)}
    </p>
  </main>
</body>
</html>
`}let J={phone:'<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',pin:'<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>',star:'<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',check:'<path d="M20 6 9 17l-5-5"/>',shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/>',quote:'<path d="M3 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/><path d="M14 21c3 0 7-1 7-8V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h3"/>',chevron:'<path d="m9 18 6-6-6-6"/>',zap:'<path d="M4 14h7l-2 8 9-12h-7l2-8z"/>',badge:'<path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76z"/><path d="m9 12 2 2 4-4"/>'};function q(e,t=20){let r=J[e]??J.badge;return`<svg class="icon" width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${r}</svg>`}function B(e){return`<span class="stars" aria-label="Nota ${e} de 5">${Array.from({length:5},(t,r)=>`<svg width="16" height="16" viewBox="0 0 24 24" fill="${r<Math.round(e)?"currentColor":"none"}" stroke="currentColor" stroke-width="2" aria-hidden="true">${J.star}</svg>`).join("")}</span>`}function F(e,t,r){if(e.logoUrl){let t=r?.logoFit.treatment==="chip"?' class="chip"':"";return`<img${t} src="${D(e.logoUrl)}" alt="Logo ${D(e.title)}">`}let a=e.title.split(/\s+/).filter(e=>e.length>2).slice(0,2).map(e=>e[0]?.toUpperCase()).join("")||e.title.slice(0,2).toUpperCase();return`<span class="lockup" style="width:${t}px;height:${t}px;font-size:${Math.round(.4*t)}px">${D(a)}</span>`}let K=r.default.join(process.cwd(),"data"),G=r.default.join(K,"app_database.json");function X(){t.default.existsSync(K)||t.default.mkdirSync(K,{recursive:!0})}let V={users:[],clients:[],hostedSites:[],userLeads:[]};function Y(){if(X(),!t.default.existsSync(G)){let e={id:"usr_admin_default",name:"Administrador",email:"admin@leadhunter.pro",passwordHash:S.hashSync("admin123",10),role:"admin",plan:"agency",createdAt:new Date().toISOString()},t={...V,users:[e]};return Q(t),t}try{let e=t.default.readFileSync(G,"utf-8"),r=JSON.parse(e);return r.users||(r.users=[]),r.clients||(r.clients=[]),r.hostedSites||(r.hostedSites=[]),r.userLeads||(r.userLeads=[]),r}catch(e){return console.error("Erro ao ler app_database.json:",e),V}}function Q(e){X();try{let r=`${G}.tmp`;t.default.writeFileSync(r,JSON.stringify(e,null,2),"utf-8"),t.default.renameSync(r,G)}catch(e){console.error("Erro ao gravar banco de dados:",e)}}function Z(e){return e.normalize("NFD").replace(/[^\x00-\x7F]/g,"").toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-+|-+$/g,"")}function ee(e){let t=Y(),r=e.trim().toLowerCase();return t.users.find(e=>e.email.toLowerCase()===r)||null}function et(e,t){var r;let a=Y(),n=t.slug||Z(t.companyName),o=n,i=1;for(;a.clients.some(e=>e.slug===o);)o=`${n}-${i++}`;let s=new Date().toISOString(),c=`cli_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,d={...t,id:c,userId:e,slug:o,status:t.status||"active",createdAt:s,updatedAt:s};a.clients.push(d);let l={id:(r=d).id,title:r.companyName,phone:r.phone,whatsappNumber:r.whatsapp,address:r.address,city:r.city,category:r.category,rating:r.rating||5,reviewsCount:r.reviewsCount||1,analyzedStatus:"NO_SITE",analyzedAt:new Date().toISOString(),logoUrl:r.logoUrl,brandColors:r.brandColors,instagramHandle:r.instagramHandle,facebookHandle:r.facebookHandle,originalWebsite:r.originalWebsite,openingHours:r.openingHours,photos:r.photos},f=function(e){var t,r,a,n;let o,i,s,c,d,l,f,u,x,p,b,h,g,m,y,v,w,$,k,E,A,S,j,I,M,L,U,J,K,G,X,V,Y,Q,{blueprint:Z}=(0,_.prepararPreview)(e),ee=(0,C.buildDesignKit)({...R(e),direction:Z.theme.style});return{slug:P(e.title),files:[{name:"index.html",content:(i=ee.palette,c=(s=(0,O.sanitizePhone)(e.phone).replace(/\D/g,"")).length>=10,d=(0,T.resolveContact)(e),l=`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${e.title}, ${e.address}, ${e.city}`)}`,f=d.hasWhatsApp?`https://wa.me/${d.digits}`:l,u=e.city.split(",")[0].trim(),x=e.photos?.[0],p=(e.photos??[]).slice(1,7),b=`${e.title} — ${D(Z.hero.headline)}. ${Z.hero.subheadline}`,h=ee.hasRealLogo?`<div class="hero-logo">${F(e,ee.logoSizes.hero)}</div>`:"",g=t=>`${h}
      <div class="rating-badge${t?"":" on-light"}">${B(e.rating)}<strong>${e.rating.toFixed(1)}</strong><span>(${e.reviewsCount} avalia\xe7\xf5es no Google)</span></div>
      <h1>${D(Z.hero.headline)}</h1>
      <p class="lead">${D(Z.hero.subheadline)}</p>
      <div class="hero-meta"${t?' style="color:rgba(255,255,255,.78)"':""}>
        <span>${q("pin",18)} ${D(e.address)}, ${D(u)}</span>${c?`
        <span>${q("phone",18)} ${D(e.phone)}</span>`:""}
      </div>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${f}" target="_blank" rel="noopener">${q(d.hasWhatsApp?"phone":"pin")} ${d.hasWhatsApp?D(Z.hero.primaryCTA):"Ver no mapa"}</a>${c?`
        <a class="btn ${t?"btn-ghost":"btn-outline"}" href="tel:+55${s}">${D(e.phone)}</a>`:""}
      </div>`,m=x?`<div class="hero-media"><img src="${D(x)}" alt="${D(e.title)}"></div>`:'<div class="hero-fallback"></div>',o="split"===(y=Z.hero.variant)?`<section class="hero hero-split">
      <div class="panel"><div class="container"><div class="hero-content on-dark">${g(!0)}</div></div></div>
      <div class="visual">${m}</div>
    </section>`:"editorial"===y?`<section class="hero hero-editorial">
      <div class="container"><div class="hero-content">${g(!1)}</div></div>
      <div class="container"><div class="frame">${m}</div></div>
    </section>`:`<section class="hero">
      ${m}
      <div class="container"><div class="hero-content on-dark">${g(!0)}</div></div>
    </section>`,v=Z.sections.map(t=>(function(e,t){let{lead:r,cityName:a,gallery:n}=t,o=(e,t)=>e||t?`<div class="section-head reveal">
          ${e?`<h2>${D(e)}</h2>`:""}
          ${t?`<p>${D(t)}</p>`:""}
        </div>`:"";switch(e.kind){case"trust":return`<div class="container" style="margin-top:32px">
    <div class="trust reveal">
      <div class="item">
        <span class="score">${r.rating.toFixed(1)}</span>
        <span>
          <small style="display:block">Avalia\xe7\xe3o no Google</small>
          ${B(r.rating)}
          <small style="display:block">${r.reviewsCount} avalia\xe7\xf5es</small>
        </span>
      </div>
      <div class="item">${q("shield")} Empresa verificada no Google Maps</div>
    </div>
  </div>`;case"services":{let t=e.items??[];if(0===t.length)return`<section>
    <div class="container">
      ${o(e.title,e.subtitle)}
    </div>
  </section>`;let r=t.map((e,t)=>`<div class="service reveal">
          <span class="num">${t+1}</span>
          <span class="label">${D(e.label)}</span>
          <span class="chev">${q("chevron",16)}</span>
        </div>`).join("\n        ");return`<section>
    <div class="container">
      ${o(e.title,e.subtitle)}
      <div class="grid grid-3">
        ${r}
      </div>
    </div>
  </section>`}case"gallery":return n.length>0?`<section class="band">
    <div class="container">
      ${o(e.title)}
      <div class="grid grid-3 gallery">
        ${n.map((e,t)=>`<a class="reveal" data-hide-on-error href="${D(e)}" target="_blank" rel="noopener"><img loading="lazy" src="${D(e)}" alt="${D(r.title)} — foto ${t+1}"></a>`).join("\n        ")}
      </div>
    </div>
  </section>`:"";case"reviews":{let t=e.items??[];if(0===t.length)return"";return`<section>
    <div class="container">
      ${o(e.title,"Avaliações publicadas no Google")}
      <div class="grid grid-3">
        ${t.map(e=>`<figure class="card review reveal">
          <span style="color:var(--brand-text);opacity:.5">${q("quote",20)}</span>
          <blockquote style="color:var(--text);flex:1;margin:0">${D(e.label)}</blockquote>
          ${e.detail?`<figcaption><small>${D(e.detail)}</small></figcaption>`:""}
        </figure>`).join("\n        ")}
      </div>
    </div>
  </section>`}case"about":return`<section class="band">
    <div class="container" style="max-width:760px">
      ${o(e.title)}
      <p style="color:var(--text-muted);font-size:1.05rem">${D(e.subtitle??"")}</p>
    </div>
  </section>`;case"process":{let t=e.items??[];if(0===t.length)return"";return`<section>
    <div class="container">
      ${o(e.title)}
      <ol class="grid grid-3" style="list-style:none;padding:0">
        ${t.map((e,t)=>`<li class="reveal">
          <span class="num">${t+1}</span>
          <h3 style="margin:12px 0 6px">${D(e.label)}</h3>
          ${e.detail?`<p style="color:var(--text-muted);font-size:.93rem">${D(e.detail)}</p>`:""}
        </li>`).join("\n        ")}
      </ol>
    </div>
  </section>`}case"location":return`<section class="band">
    <div class="container">
      <div class="trust reveal">
        <div class="item">${q("pin")} ${D(r.address)}, ${D(a)}</div>
        <a class="btn btn-outline" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${r.title}, ${r.address}, ${r.city}`)}" target="_blank" rel="noopener">Como chegar</a>
      </div>
    </div>
  </section>`;default:return""}})(t,{lead:e,kit:ee,cityName:u,gallery:p})).filter(Boolean).join("\n\n  "),`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${D(e.title)} — ${D(e.category)} em ${D(u)}</title>
  <meta name="description" content="${D(b)}">
  <meta name="theme-color" content="${i.primary}">
  <meta property="og:title" content="${D(e.title)}">
  <meta property="og:description" content="${D(b)}">
  <meta property="og:type" content="website">
  ${e.logoUrl?`<link rel="icon" href="${D(e.logoUrl)}">`:""}
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet" href="${D(ee.fonts.googleHref)}">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <nav class="nav">
    <div class="nav-brand">
      ${F(e,ee.logoSizes.nav,ee)}
      <span class="name">${D(e.title)}</span>
    </div>
    <a class="btn btn-primary" href="${f}" target="_blank" rel="noopener">${q(d.hasWhatsApp?"phone":"pin",18)} <span class="full">${D(d.hasWhatsApp?e.phone:"Como chegar")}</span></a>
  </nav>

  ${o}

    ${v}

  <section class="cta">
    <div class="container reveal">
      <span style="display:inline-flex;margin-bottom:12px">${q("zap",40)}</span>
      <h2>Pronto para come\xe7ar?</h2>
      <p>Entre em contato agora e receba um atendimento personalizado da <strong>${D(e.title)}</strong> em ${D(u)}.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="${f}" target="_blank" rel="noopener">${d.hasWhatsApp?D(Z.hero.primaryCTA):"Ver no mapa"} ${q("chevron",18)}</a>${c?`
        <a class="btn btn-ghost" href="tel:+55${s}">${q("phone",18)} Ligar Agora</a>`:""}
      </div>
    </div>
  </section>

  <footer>
    <div class="container inner">
      <div class="brand">
        ${F(e,ee.logoSizes.footer,ee)}
        <span>${D(e.title)}</span>
      </div>
      <div class="links">
        <span>${q("pin",16)} ${D(e.address)}, ${D(u)}</span>${c?`
        <span>${q("phone",16)} ${D(e.phone)}</span>`:""}${d.hasWhatsApp?`
        <a href="${f}" target="_blank" rel="noopener">WhatsApp</a>`:""}${e.instagramHandle?`
        <a href="https://instagram.com/${D(e.instagramHandle)}" target="_blank" rel="noopener">@${D(e.instagramHandle)}</a>`:""}${e.facebookHandle?`
        <a href="https://facebook.com/${D(e.facebookHandle)}" target="_blank" rel="noopener">Facebook</a>`:""}
      </div>
      <small>\xa9 <span data-year>2026</span> ${D(e.title)} • ${D(u)}</small>
    </div>
  </footer>

${d.hasWhatsApp?`  <a class="fab" href="${f}" target="_blank" rel="noopener" aria-label="Chamar no WhatsApp">
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.117 1.527 5.845L.057 23.882l6.2-1.626A11.934 11.934 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.82 9.82 0 01-5.007-1.37l-.36-.214-3.677.964.981-3.585-.235-.369A9.82 9.82 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/></svg>
    Chamar no WhatsApp
  </a>`:""}

  <script src="script.js"></script>
</body>
</html>
`)},{name:"styles.css",content:(w=ee.palette,`/* ${ee.archetypeLabel} — gerado pelo Maps Lead Hunter
   Paleta e tipografia validadas para contraste WCAG AA. */

:root {
  --primary: ${w.primary};
  --primary-dark: ${w.primaryDark};
  --primary-light: ${w.primaryLight};
  --on-primary: ${w.onPrimary};
  --accent: ${w.accent};
  --on-accent: ${w.onAccent};
  --surface: ${w.surface};
  --surface-alt: ${w.surfaceAlt};
  --card: ${w.card};
  --text: ${w.text};
  --text-muted: ${w.textMuted};
  --border: ${w.border};
  --brand-text: ${w.brandText};

  --radius-sm: ${ee.radius.sm};
  --radius-md: ${ee.radius.md};
  --radius-lg: ${ee.radius.lg};
  --radius-pill: ${ee.radius.pill};

  --font-heading: ${ee.fonts.headingStack};
  --font-body: ${ee.fonts.bodyStack};

  --gradient-hero: ${ee.gradients.hero};
  --gradient-cta: ${ee.gradients.cta};
  --hero-overlay: ${ee.heroOverlay};
}

*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--surface);
  color: var(--text);
  font-family: var(--font-body);
  font-size: 16px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
h1, h2, h3 { font-family: var(--font-heading); letter-spacing: -0.02em; line-height: 1.1; margin: 0; }
img { max-width: 100%; display: block; }
a { color: inherit; text-decoration: none; }
.container { max-width: 1060px; margin: 0 auto; padding: 0 24px; }
.icon { flex-shrink: 0; }
.stars { display: inline-flex; gap: 2px; color: #f59e0b; }

/* Bot\xf5es — alvo de toque m\xednimo de 44px */
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 14px 28px; min-height: 48px;
  border-radius: var(--radius-pill);
  font-weight: 700; font-size: 1rem; cursor: pointer;
  border: 2px solid transparent;
  transition: transform .2s ease, box-shadow .2s ease, background-color .2s ease;
}
.btn:hover { transform: translateY(-2px); }
.btn:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
.btn-primary { background: var(--accent); color: var(--on-accent); box-shadow: 0 10px 30px rgba(0,0,0,.18); }
.btn-ghost { border-color: rgba(255,255,255,.45); color: #fff; background: rgba(255,255,255,.08); }
.btn-outline { border-color: var(--border); color: var(--text); }

/* Navega\xe7\xe3o */
.nav {
  position: sticky; top: 0; z-index: 40;
  display: flex; align-items: center; justify-content: space-between; gap: 16px;
  padding: 12px 24px;
  background: var(--primary); color: var(--on-primary);
}
.nav-brand { display: flex; align-items: center; gap: 12px; min-width: 0; }
.nav-brand img { height: ${ee.logoSizes.nav}px; width: auto; max-width: ${ee.logoFit.maxWidth.nav}px; object-fit: contain; }
/* Pastilha clara para logo com fundo s\xf3lido ou tra\xe7o escuro demais */
.nav-brand img.chip, footer .brand img.chip {
  background: #fff; border-radius: var(--radius-sm);
  padding: 6px 10px; box-shadow: 0 2px 10px rgba(0,0,0,.16);
}
.nav-brand .name { font-family: var(--font-heading); font-weight: 700; font-size: 1.05rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.nav .btn { padding: 10px 18px; font-size: .92rem; }

/* Lockup tipogr\xe1fico quando n\xe3o existe logo */
.lockup {
  display: inline-flex; align-items: center; justify-content: center;
  font-family: var(--font-heading); font-weight: 900;
  background: rgba(255,255,255,.18); color: #fff;
  border-radius: var(--radius-sm);
}

/* Hero */
.hero { position: relative; }
.hero-media { position: absolute; inset: 0; overflow: hidden; }
.hero-media img { width: 100%; height: 100%; object-fit: cover; }
.hero-media::after { content: ""; position: absolute; inset: 0; background: var(--hero-overlay); }
.hero-fallback { position: absolute; inset: 0; background: var(--gradient-hero); }
.hero-content { position: relative; z-index: 2; padding: 88px 0; }
.hero-content.on-dark, .hero-content.on-dark h1 { color: #fff; }
.hero-logo {
  display: inline-flex; padding: 16px 20px; margin-bottom: 24px;
  background: rgba(255,255,255,.94); border-radius: var(--radius-lg);
  box-shadow: 0 14px 40px rgba(15,23,42,.22);
}
.hero-logo img { height: ${ee.logoSizes.hero}px; width: auto; max-width: ${ee.logoFit.maxWidth.hero}px; object-fit: contain; }
footer .brand img { max-width: ${ee.logoFit.maxWidth.footer}px; }
.hero h1 { font-size: clamp(2.1rem, 5.5vw, 3.6rem); margin-bottom: 16px; }
.hero .lead { font-size: clamp(1rem, 2.2vw, 1.25rem); max-width: 34rem; margin: 0 0 28px; }
.hero-content.on-dark .lead { color: rgba(255,255,255,.86); }
.rating-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 14px; border-radius: var(--radius-pill);
  background: rgba(255,255,255,.15); border: 1px solid rgba(255,255,255,.24);
  font-size: .92rem; color: #fff;
}
/* Hero claro: o mesmo selo precisa de fundo s\xf3lido para ser leg\xedvel */
.rating-badge.on-light { background: var(--card); border-color: var(--border); color: var(--text); }
.hero-meta { display: flex; flex-wrap: wrap; gap: 18px; margin-bottom: 30px; font-size: .95rem; }
.hero-meta span { display: inline-flex; align-items: center; gap: 8px; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; }

/* Hero dividido */
.hero-split { display: grid; grid-template-columns: 1fr; }
@media (min-width: 768px) { .hero-split { grid-template-columns: 1fr 1fr; } }
.hero-split .panel { background: var(--gradient-hero); padding: 72px 0; }
.hero-split .visual { min-height: 340px; position: relative; overflow: hidden; }

/* Hero editorial */
.hero-editorial { background: var(--surface); padding-top: 64px; text-align: center; }
.hero-editorial .hero-content { padding-bottom: 40px; }
.hero-editorial .lead, .hero-editorial .hero-meta, .hero-editorial .hero-actions { margin-left: auto; margin-right: auto; justify-content: center; }
.hero-editorial .frame { position: relative; height: 380px; border-radius: var(--radius-lg); overflow: hidden; margin-bottom: -64px; }

/* Barra de confian\xe7a */
.trust {
  position: relative; z-index: 10; display: flex; flex-wrap: wrap;
  gap: 20px 40px; align-items: center;
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 24px;
  box-shadow: 0 18px 50px rgba(15,23,42,.10);
}
.trust .score {
  width: 46px; height: 46px; display: grid; place-items: center;
  border-radius: var(--radius-sm); background: var(--primary-light);
  color: var(--brand-text); font-weight: 800;
}
.trust .item { display: flex; align-items: center; gap: 12px; color: var(--text-muted); font-size: .95rem; }
.trust .item svg { color: var(--brand-text); }

/* Se\xe7\xf5es */
section { padding: 72px 0; }
.section-label { font-size: .78rem; font-weight: 700; letter-spacing: .18em; text-transform: uppercase; color: var(--brand-text); }
.section-head { text-align: center; margin-bottom: 44px; }
.section-head h2 { font-size: clamp(1.7rem, 4vw, 2.4rem); margin: 12px 0; }
.section-head p { color: var(--text-muted); max-width: 34rem; margin: 0 auto; }
.band { background: var(--surface-alt); }

.grid { display: grid; gap: 16px; }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-2 { grid-template-columns: repeat(2, 1fr); }

.service {
  display: flex; align-items: center; gap: 12px; padding: 16px;
  background: var(--card); border: 1px solid var(--border); border-radius: var(--radius-md);
  transition: box-shadow .2s ease, transform .2s ease;
}
.service:hover { box-shadow: 0 10px 26px rgba(15,23,42,.09); transform: translateY(-2px); }
.service .num {
  width: 36px; height: 36px; display: grid; place-items: center; flex-shrink: 0;
  border-radius: var(--radius-sm); background: var(--primary-light);
  color: var(--brand-text); font-weight: 700; font-size: .9rem;
}
.service:first-child { border-color: var(--primary); }
.service:first-child .num { background: var(--primary); color: var(--on-primary); }
.service .label { font-weight: 600; font-size: .95rem; }
.service .chev { margin-left: auto; color: var(--text-muted); opacity: .5; }

.gallery img { aspect-ratio: 1 / 1; object-fit: cover; width: 100%; border-radius: var(--radius-md); transition: transform .5s ease; }
.gallery a:hover img { transform: scale(1.05); }

.card {
  background: var(--card); border: 1px solid var(--border);
  border-radius: var(--radius-lg); padding: 26px; height: 100%;
}
.card .badge {
  width: 48px; height: 48px; display: grid; place-items: center; margin: 0 auto 16px;
  border-radius: var(--radius-sm); background: var(--primary-light); color: var(--brand-text);
}
.card h3 { font-size: 1.1rem; margin-bottom: 8px; }
.card p { color: var(--text-muted); font-size: .93rem; margin: 0; }
.card.center { text-align: center; }

.review { display: flex; flex-direction: column; gap: 12px; }
.review .who { display: flex; align-items: center; gap: 10px; border-top: 1px solid var(--border); padding-top: 12px; }
.review .avatar {
  width: 32px; height: 32px; display: grid; place-items: center; border-radius: var(--radius-pill);
  background: var(--primary); color: var(--on-primary); font-weight: 700; font-size: .8rem;
}
.review .who small { color: var(--text-muted); }

/* CTA final */
.cta { background: var(--gradient-cta); color: #fff; text-align: center; }
.cta h2 { font-size: clamp(1.8rem, 4.5vw, 2.5rem); margin-bottom: 12px; }
.cta p { color: rgba(255,255,255,.86); font-size: 1.1rem; margin: 0 auto 32px; max-width: 32rem; }
.cta .hero-actions { justify-content: center; }

/* Rodap\xe9 */
footer { background: var(--primary-dark); color: rgba(255,255,255,.72); padding: 36px 0; font-size: .9rem; }
footer .inner { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 20px; }
footer .brand { display: flex; align-items: center; gap: 12px; color: #fff; font-family: var(--font-heading); font-weight: 700; }
footer .brand img { height: ${ee.logoSizes.footer}px; width: auto; object-fit: contain; }
footer .links { display: flex; flex-wrap: wrap; gap: 18px; }
footer .links span, footer .links a { display: inline-flex; align-items: center; gap: 8px; }
footer a:hover { color: #fff; }

/* Bot\xe3o flutuante do WhatsApp */
.fab {
  position: fixed; right: 20px; bottom: 20px; z-index: 50;
  display: inline-flex; align-items: center; gap: 10px;
  padding: 14px 22px; min-height: 48px;
  background: #25d366; color: #fff; font-weight: 700;
  border-radius: var(--radius-pill); box-shadow: 0 16px 40px rgba(37,211,102,.36);
  transition: transform .2s ease;
}
.fab:hover { transform: scale(1.05); }

/* Revela\xe7\xe3o no scroll */
.reveal { opacity: 0; transform: translateY(28px); transition: opacity .6s ease, transform .6s ease; }
.reveal.visible { opacity: 1; transform: none; }

@media (max-width: 900px) {
  .grid-3 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .grid-3, .grid-2 { grid-template-columns: 1fr; }
  .gallery.grid-3 { grid-template-columns: repeat(2, 1fr); }
  section { padding: 52px 0; }
  .hero-content { padding: 56px 0; }
  .nav .btn span.full { display: none; }
  .fab { right: 12px; bottom: 12px; padding: 12px 18px; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .reveal { opacity: 1; transform: none; }
}
`)},{name:"script.js",content:`// Comportamento da p\xe1gina — sem depend\xeancias.
(function () {
  "use strict";

  // Ano corrente no rodap\xe9
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  // Logotipo largo (>= 2.2:1) j\xe1 traz o nome escrito — repetir ao lado polui
  var navLogo = document.querySelector(".nav-brand img");
  if (navLogo) {
    var hideDuplicateName = function () {
      if (!navLogo.naturalHeight) return;
      if (navLogo.naturalWidth / navLogo.naturalHeight < 2.2) return;
      document.querySelectorAll(".nav-brand .name, footer .brand span").forEach(function (el) {
        el.style.display = "none";
      });
    };
    if (navLogo.complete) hideDuplicateName();
    else navLogo.addEventListener("load", hideDuplicateName);
  }

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll(".reveal");

  // Sem IntersectionObserver (ou com movimento reduzido) tudo j\xe1 nasce vis\xedvel
  if (reduceMotion || !("IntersectionObserver" in window)) {
    targets.forEach(function (el) { el.classList.add("visible"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { rootMargin: "-60px 0px", threshold: 0.05 });

  targets.forEach(function (el, index) {
    el.style.transitionDelay = Math.min(index % 6, 5) * 60 + "ms";
    observer.observe(el);
  });

  // Imagem quebrada some em vez de virar \xedcone de erro
  document.querySelectorAll("img").forEach(function (img) {
    img.addEventListener("error", function () {
      var wrapper = img.closest("[data-hide-on-error]");
      (wrapper || img).style.display = "none";
    });
  });
})();
`},{name:"LEIA-ME.txt",content:(r=e,a=ee,n=Z,`Site de ${r.title}
${"=".repeat(`Site de ${r.title}`.length)}

Gerado pelo Maps Lead Hunter.

COMO PUBLICAR
-------------
Os tr\xeas arquivos s\xe3o est\xe1ticos: n\xe3o precisam de build, Node nem banco.
1. Suba index.html, styles.css e script.js para qualquer hospedagem
   (Vercel, Netlify, GitHub Pages, Hostinger, cPanel...).
2. Aponte o dom\xednio para a pasta. Pronto.

Para testar no seu computador, \xe9 s\xf3 abrir index.html no navegador.

SISTEMA DE DESIGN APLICADO
--------------------------
Arqu\xe9tipo ..... ${a.archetypeLabel} (${a.mood})
Layout ........ ${n.hero.variant}
Cor prim\xe1ria .. ${a.palette.primary}
Cor de acento . ${a.palette.accent}
Origem da cor . ${"logo"===a.colorSource?"extraída dos pixels do logo da empresa":"site"===a.colorSource?"declarada no site da empresa":"photo"===a.colorSource?"extraída das fotos da empresa":"paleta de referência do segmento"}
Tipografia .... ${a.fonts.heading} (t\xedtulos) / ${a.fonts.body} (corpo)

Todas as combina\xe7\xf5es de texto e fundo passam em contraste WCAG AA (4.5:1).
As cores est\xe3o em vari\xe1veis CSS no topo de styles.css — mudar a marca
inteira \xe9 mudar aquelas linhas.

IMAGENS
-------
As fotos s\xe3o carregadas das URLs originais (Google Maps / Instagram).
Antes de publicar em produ\xe7\xe3o, baixe-as e sirva do seu pr\xf3prio dom\xednio:
essas URLs podem expirar.

CONTATO CONFIGURADO
-------------------
WhatsApp ...... ${r.phone}
Endere\xe7o ...... ${r.address}, ${r.city}
`)},...($=ee??(0,C.buildDesignKit)(R(e)),[{name:"cartao/index.html",content:W(e,$)},{name:"cartao/styles.css",content:(k=$.palette,E="999px"===$.radius.pill?"999px":$.radius.md,`/* Cart\xe3o online de ${$.archetypeLabel} — gerado pelo Maps Lead Hunter */
:root {
  --primary: ${k.primary};
  --accent: ${k.accent};
  --on-accent: ${k.onAccent};
  --font-heading: ${$.fonts.headingStack};
  --font-body: ${$.fonts.bodyStack};
}

*, *::before, *::after { box-sizing: border-box; }
body {
  margin: 0; min-height: 100vh;
  display: flex; align-items: flex-start; justify-content: center;
  padding: 48px 20px;
  background: ${$.gradients.hero};
  font-family: var(--font-body);
  color: #fff;
  overflow-x: hidden;
  position: relative;
}

/* Manchas de luz respirando ao fundo */
.blob {
  position: fixed; border-radius: 50%; filter: blur(70px);
  opacity: .14; pointer-events: none;
  animation: breathe 9s ease-in-out infinite;
}
.b1 { width: 260px; height: 260px; left: 8%;  top: 6%;  background: #fff; }
.b2 { width: 350px; height: 350px; left: 62%; top: 34%; background: var(--accent); animation-delay: -3s; }
.b3 { width: 440px; height: 440px; left: 30%; top: 72%; background: #fff; animation-delay: -6s; }
@keyframes breathe {
  0%, 100% { transform: scale(1);    opacity: .10; }
  50%      { transform: scale(1.18); opacity: .20; }
}

main {
  position: relative; z-index: 1;
  width: 100%; max-width: 460px;
  display: flex; flex-direction: column; align-items: center; text-align: center;
}

.avatar {
  width: 132px; height: 132px;
  display: grid; place-items: center; overflow: hidden;
  border-radius: ${"sharp"===$.shape?$.radius.lg:"50%"};
  background: #fff; border: 4px solid rgba(255,255,255,.55);
  box-shadow: 0 22px 60px rgba(0,0,0,.32);
  animation: rise .6s cubic-bezier(.22,1,.36,1) both;
}
.avatar img { width: 78%; height: 78%; object-fit: contain; }
.avatar .initials { font-family: var(--font-heading); font-weight: 900; font-size: 45px; color: var(--primary); }

h1 {
  font-family: var(--font-heading); font-size: 1.9rem; font-weight: 900;
  margin: 24px 0 0; line-height: 1.15;
  animation: rise .6s .12s cubic-bezier(.22,1,.36,1) both;
}
.tagline {
  margin: 8px 0 0; font-size: .78rem; letter-spacing: .2em; text-transform: uppercase;
  color: rgba(255,255,255,.72);
  animation: rise .6s .18s cubic-bezier(.22,1,.36,1) both;
}
.rating {
  display: inline-flex; align-items: center; gap: 8px; margin-top: 16px;
  padding: 8px 14px; border-radius: 999px; font-size: .88rem;
  background: rgba(255,255,255,.16); border: 1px solid rgba(255,255,255,.24);
  animation: rise .6s .24s cubic-bezier(.22,1,.36,1) both;
}
.rating span { color: rgba(255,255,255,.7); }

.links { width: 100%; display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }
.link {
  display: flex; align-items: center; gap: 12px; text-align: left;
  padding: 14px 20px; min-height: 62px;
  border-radius: ${E};
  background: rgba(255,255,255,.14); border: 1px solid rgba(255,255,255,.22);
  color: #fff; text-decoration: none;
  backdrop-filter: blur(6px);
  transition: transform .22s ease, background-color .22s ease, box-shadow .22s ease;
  animation: rise .55s cubic-bezier(.22,1,.36,1) both;
  animation-delay: calc(.3s + var(--i) * .07s);
}
.link:hover { transform: translateY(-2px) scale(1.03); background: rgba(255,255,255,.22); box-shadow: 0 14px 34px rgba(0,0,0,.24); }
.link:active { transform: scale(.98); }
.link:focus-visible { outline: 3px solid #fff; outline-offset: 3px; }
.link.primary {
  background: var(--accent); color: var(--on-accent); border-color: transparent;
  box-shadow: 0 14px 34px rgba(0,0,0,.26);
}
.link.primary:hover { background: var(--accent); }
.link-icon {
  width: 40px; height: 40px; flex-shrink: 0;
  display: grid; place-items: center; border-radius: 999px;
  background: rgba(255,255,255,.18);
}
.link-text { min-width: 0; }
.link-text strong { display: block; font-size: .95rem; line-height: 1.2; }
.link-text small { display: block; font-size: .75rem; opacity: .75; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.address {
  display: flex; align-items: flex-start; gap: 8px; justify-content: center;
  margin-top: 32px; font-size: .78rem; color: rgba(255,255,255,.65);
  animation: rise .6s .8s cubic-bezier(.22,1,.36,1) both;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(26px); }
  to   { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
  .blob { opacity: .12; }
}
`)}]),...(A=ee??(0,C.buildDesignKit)(R(e)),Y={front:(S=A.palette,j=(t=e.title).length<=14?7.5:t.length<=22?6:t.length<=32?5:4.2,I=e.city.split(",")[0].trim(),H(`    <rect width="90" height="50" fill="url(#brandGradient)"/>
    <defs>
      <linearGradient id="brandGradient" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stop-color="${S.primaryDark}"/>
        <stop offset="60%" stop-color="${S.primary}"/>
        <stop offset="100%" stop-color="${S.primary}"/>
      </linearGradient>
    </defs>
    <circle cx="${84}" cy="${46}" r="16" fill="${S.accent}" opacity="0.18"/>
${N(e,A,5,7,13,!0,S.primary)}
    <text x="5" y="${31}" font-family="${D(A.fonts.heading)}, sans-serif" font-weight="800" font-size="${j}" fill="#ffffff">${D(e.title)}</text>
    <text x="5" y="${37}" font-family="${D(A.fonts.body)}, sans-serif" font-size="3.2" letter-spacing="0.6" fill="#ffffff" opacity="0.82">${D(e.category.toUpperCase())} \xb7 ${D(I.toUpperCase())}</text>
    <rect x="5" y="${38}" width="14" height="1.1" rx="0.55" fill="${S.accent}"/>`,S.primaryDark)),back:(M=A.palette,L=e.city.split(",")[0].trim(),U=function(e,t=2){let r=e.split(/\s+/).filter(Boolean),a=[],n="";for(let e of r){let r=n?`${n} ${e}`:e;if(r.length<=34){n=r;continue}if(n&&a.push(n),n=e,a.length===t-1)break}return(n&&a.length<t&&a.push(n),0===a.length)?[e.slice(0,34)]:(a.join(" ").length<e.length-1&&a.length===t&&(a[t-1]=`${a[t-1].slice(0,33)}…`),a)}(`${e.address}, ${L}`,2),J=[],K=14,G=(e,t,r=!1)=>{J.push(z(e,5,K-3.4,4.2,M.primary,r),`<text x="${11.5}" y="${K}" font-family="${D(A.fonts.body)}, sans-serif" font-size="3.4" fill="${M.text}">${D(t)}</text>`),K+=6.4},(X=(0,O.sanitizePhone)(e.phone))&&G("phone",X),J.push(z("pin",5,K-3.4,4.2,M.primary),...U.map((e,t)=>`<text x="${11.5}" y="${K+4.2*t}" font-family="${D(A.fonts.body)}, sans-serif" font-size="3.4" fill="${M.text}">${D(e)}</text>`)),K+=4.2*U.length+2.2,e.instagramHandle&&G("instagram",`@${e.instagramHandle}`,!0),e.facebookHandle&&G("facebook",`/${e.facebookHandle}`,!0),V=e.reviewsCount>0?`<g transform="translate(${59} ${7})">
      <rect width="26" height="12" rx="2.5" fill="${M.primaryLight}"/>
      ${z("star",2.5,3.2,5,M.accent,!0)}
      <text x="9" y="7.4" font-family="${D(A.fonts.heading)}, sans-serif" font-weight="700" font-size="4.4" fill="${M.brandText}">${e.rating.toFixed(1)}</text>
      <text x="9" y="10.4" font-family="${D(A.fonts.body)}, sans-serif" font-size="2.4" fill="${M.textMuted}">${e.reviewsCount} avalia\xe7\xf5es</text>
    </g>`:"",H(`    <rect width="90" height="50" fill="${M.card}"/>
    <rect width="90" height="2" fill="${M.primary}"/>
${N(e,A,5,36,9,!1,M.card)}
${V}
${J.join("\n")}
    <text x="${85}" y="${44}" text-anchor="end" font-family="${D(A.fonts.body)}, sans-serif" font-size="2.6" fill="${M.textMuted}">Atendimento pelo WhatsApp</text>`,M.card))},Q=P(e.title),[{name:`cartao-${Q}-frente.svg`,content:Y.front},{name:`cartao-${Q}-verso.svg`,content:Y.back}])]}}(l),u=(0,C.buildDesignKit)(R(l)),x=W(l,u),p=`site_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,b=`card_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,h=f.files.find(e=>"index.html"===e.name)?.content||"",g=f.files.find(e=>"styles.css"===e.name)?.content||"",m=f.files.find(e=>"script.js"===e.name)?.content||"",y={id:p,userId:e,clientId:c,type:"site",slug:o,title:d.companyName,htmlContent:h,cssContent:g,jsContent:m,status:d.status,viewsCount:0,clicksCount:0,createdAt:s,updatedAt:s},v={id:b,userId:e,clientId:c,type:"card",slug:o,title:`Cart\xe3o de Visita — ${d.companyName}`,htmlContent:x,cssContent:"",jsContent:"",status:d.status,viewsCount:0,clicksCount:0,createdAt:s,updatedAt:s};return a.hostedSites.push(y,v),Q(a),{client:d,site:y,card:v}}e.s(["convertLeadToClient",0,function(e,t,r){let a=t.title||"Empresa sem Nome",n=Z(a);return et(e,{companyName:a,clientName:"",slug:n,category:t.category||"Geral",phone:t.phone||"",whatsapp:t.whatsappNumber||t.phone||"",address:t.address||"",city:t.city||"",logoUrl:t.logoUrl||"",brandColors:t.brandColors,instagramHandle:t.instagramHandle,facebookHandle:t.facebookHandle,originalWebsite:t.originalWebsite,rating:t.rating||5,reviewsCount:t.reviewsCount||1,openingHours:t.openingHours,photos:t.photos||[],services:[],status:"active",monthlyFee:r?.monthlyFee||99,dueDay:10,notes:r?.notes||"Convertido diretamente do Lead Hunter"})},"createClient",0,et,"createUser",0,function(e){let t=Y();if(ee(e.email))throw Error("Este email já está cadastrado.");let r=S.genSaltSync(10),a=S.hashSync(e.password,r),n={id:`usr_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,name:e.name.trim(),email:e.email.trim().toLowerCase(),passwordHash:a,role:0===t.users.length?"admin":"user",plan:e.plan||"pro",createdAt:new Date().toISOString()};return t.users.push(n),Q(t),n},"deleteClient",0,function(e,t){let r=Y(),a=r.clients.length;return r.clients=r.clients.filter(r=>r.id!==e||r.userId!==t),r.clients.length!==a&&(r.hostedSites=r.hostedSites.filter(t=>t.clientId!==e),Q(r),!0)},"findUserByEmail",0,ee,"findUserById",0,function(e){return Y().users.find(t=>t.id===e)||null},"getClientById",0,function(e,t){let r=Y().clients.find(t=>t.id===e);return!r||t&&r.userId!==t?null:r},"getClientsByUserId",0,function(e){return Y().clients.filter(t=>t.userId===e).sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime())},"getHostedSiteById",0,function(e,t){let r=Y().hostedSites.find(t=>t.id===e);return!r||t&&r.userId!==t?null:r},"getHostedSitesByClientId",0,function(e){return Y().hostedSites.filter(t=>t.clientId===e)},"getHostedSitesByUserId",0,function(e){return Y().hostedSites.filter(t=>t.userId===e).sort((e,t)=>new Date(t.createdAt).getTime()-new Date(e.createdAt).getTime())},"updateClient",0,function(e,t,r){let a=Y(),n=a.clients.findIndex(r=>r.id===e&&r.userId===t);if(-1===n)return null;let o=a.clients[n];o.slug;let i=r.slug?Z(r.slug):o.slug,s={...o,...r,slug:i,updatedAt:new Date().toISOString()};return a.clients[n]=s,a.hostedSites.forEach(t=>{t.clientId===e&&(t.slug=i,r.status&&(t.status=r.status),t.updatedAt=s.updatedAt)}),Q(a),s},"updateHostedSiteCode",0,function(e,t,r){let a=Y(),n=a.hostedSites.find(r=>r.id===e&&r.userId===t);return n?(void 0!==r.htmlContent&&(n.htmlContent=r.htmlContent),void 0!==r.cssContent&&(n.cssContent=r.cssContent),void 0!==r.jsContent&&(n.jsContent=r.jsContent),void 0!==r.slug&&(n.slug=Z(r.slug)),void 0!==r.status&&(n.status=r.status),void 0!==r.customDomain&&(n.customDomain=r.customDomain),n.updatedAt=new Date().toISOString(),Q(a),n):null}],12e3)},13884,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"createDedupedByCallsiteServerErrorLoggerDev",{enumerable:!0,get:function(){return c}});let a=function(e){if(e&&e.__esModule)return e;if(null===e||"object"!=typeof e&&"function"!=typeof e)return{default:e};var t=n(void 0);if(t&&t.has(e))return t.get(e);var r={__proto__:null},a=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in e)if("default"!==o&&Object.prototype.hasOwnProperty.call(e,o)){var i=a?Object.getOwnPropertyDescriptor(e,o):null;i&&(i.get||i.set)?Object.defineProperty(r,o,i):r[o]=e[o]}return r.default=e,t&&t.set(e,r),r}(e.r(47540));function n(e){if("function"!=typeof WeakMap)return null;var t=new WeakMap,r=new WeakMap;return(n=function(e){return e?r:t})(e)}let o={current:null},i="function"==typeof a.cache?a.cache:e=>e,s=console.warn;function c(e){return function(...t){s(e(...t))}}i(e=>{try{s(o.current)}finally{o.current=null}})},7460,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"cookies",{enumerable:!0,get:function(){return x}});let a=e.r(30240),n=e.r(472),o=e.r(56704),i=e.r(32319),s=e.r(68665),c=e.r(97573),d=e.r(4642),l=e.r(13884),f=e.r(43824),u=e.r(76414);function x(){let e="cookies",t=o.workAsyncStorage.getStore(),r=i.workUnitAsyncStorage.getStore();if(t){if(r&&!(0,f.isRequestApiAllowedInCurrentPhase)(r))throw Object.defineProperty(Error(`Route ${t.route} used \`cookies()\` inside \`after()\` while rendering. This is not supported. If you need this data inside an \`after()\` callback, use \`cookies()\` outside of the callback. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E1381",enumerable:!1,configurable:!0});if(t.forceStatic)return b(a.RequestCookiesAdapter.seal(new n.RequestCookies(new Headers({}))));if(t.dynamicShouldError)throw Object.defineProperty(new c.StaticGenBailoutError(`Route ${t.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`cookies()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E849",enumerable:!1,configurable:!0});if(r)switch(r.type){case"cache":let o=Object.defineProperty(Error(`Route ${t.route} used \`cookies()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E831",enumerable:!1,configurable:!0});throw Error.captureStackTrace(o,x),(0,d.applyOwnerStack)(o),t.invalidDynamicUsageError??=o,o;case"unstable-cache":throw Object.defineProperty(Error(`Route ${t.route} used \`cookies()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`cookies()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E846",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(Error(`Route ${t.route} used \`cookies()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1123",enumerable:!1,configurable:!0});case"prerender":var l=t,h=r;let i=p.get(h);if(i)return i;let g=(0,d.makeRuntimeHangingPromise)(h.renderSignal,l.route,"`cookies()`",h);return p.set(h,g),g;case"prerender-client":case"validation-client":let m="`cookies`";throw Object.defineProperty(new u.InvariantError(`${m} must not be used within a Client Component. Next.js should be preventing ${m} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1037",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,s.postponeWithTracking)(t.route,e,r.dynamicTracking);case"prerender-legacy":return(0,s.throwToInterruptStaticGeneration)(e,t,r);case"prerender-runtime":{let{stagedRendering:e}=r;if(e)return e.delayUntilStage(d.RENDER_STAGES_BY_DATA_KIND.sessionData,"cookies",r.cookies);return b(r.cookies)}case"private-cache":return b(r.cookies);case"request":let y;if((0,s.trackDynamicDataInDynamicRender)(r),y=(0,a.areCookiesMutableInCurrentPhase)(r)?r.userspaceMutableCookies:r.cookies,!r.asyncApiPromises)return b(y);if(y===r.mutableCookies)return r.asyncApiPromises.mutableCookies;return r.asyncApiPromises.cookies}}(0,i.throwForMissingRequestStore)(e)}let p=new WeakMap;function b(e){let t=p.get(e);if(t)return t;let r=Promise.resolve(e);return p.set(e,r),r}(0,l.createDedupedByCallsiteServerErrorLoggerDev)(function(e,t){let r=e?`Route "${e}" `:"This route ";return Object.defineProperty(Error(`${r}used ${t}. \`cookies()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E830",enumerable:!1,configurable:!0})})},36052,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={HeadersAdapter:function(){return s},ReadonlyHeadersError:function(){return i}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let o=e.r(30759);class i extends Error{constructor(){super("Headers cannot be modified. Read more: https://nextjs.org/docs/app/api-reference/functions/headers"),Object.defineProperty(this,"__NEXT_ERROR_CODE",{value:"E1176",enumerable:!1,configurable:!0})}static callable(){throw new i}}class s extends Headers{constructor(e){super(),this.headers=new Proxy(e,{get(t,r,a){if("symbol"==typeof r)return o.ReflectAdapter.get(t,r,a);let n=r.toLowerCase(),i=Object.keys(e).find(e=>e.toLowerCase()===n);if(void 0!==i)return o.ReflectAdapter.get(t,i,a)},set(t,r,a,n){if("symbol"==typeof r)return o.ReflectAdapter.set(t,r,a,n);let i=r.toLowerCase(),s=Object.keys(e).find(e=>e.toLowerCase()===i);return o.ReflectAdapter.set(t,s??r,a,n)},has(t,r){if("symbol"==typeof r)return o.ReflectAdapter.has(t,r);let a=r.toLowerCase(),n=Object.keys(e).find(e=>e.toLowerCase()===a);return void 0!==n&&o.ReflectAdapter.has(t,n)},deleteProperty(t,r){if("symbol"==typeof r)return o.ReflectAdapter.deleteProperty(t,r);let a=r.toLowerCase(),n=Object.keys(e).find(e=>e.toLowerCase()===a);return void 0===n||o.ReflectAdapter.deleteProperty(t,n)}})}static seal(e){return new Proxy(e,{get(e,t,r){switch(t){case"append":case"delete":case"set":return i.callable;default:return o.ReflectAdapter.get(e,t,r)}}})}static fresh(e){return new Proxy(e,{get:(e,t,r)=>o.ReflectAdapter.get(e,t,r)})}merge(e){return Array.isArray(e)?e.join(", "):e}static from(e){return e instanceof Headers?e:new s(e)}append(e,t){let r=this.headers[e];"string"==typeof r?this.headers[e]=[r,t]:Array.isArray(r)?r.push(t):this.headers[e]=t}delete(e){delete this.headers[e]}get(e){let t=this.headers[e];return void 0!==t?this.merge(t):null}has(e){return void 0!==this.headers[e]}set(e,t){this.headers[e]=t}forEach(e,t){for(let[r,a]of this.entries())e.call(t,a,r,this)}*entries(){for(let e of Object.keys(this.headers)){let t=e.toLowerCase(),r=this.get(t);yield[t,r]}}*keys(){for(let e of Object.keys(this.headers)){let t=e.toLowerCase();yield t}}*values(){for(let e of Object.keys(this.headers)){let t=this.get(e);yield t}}[Symbol.iterator](){return this.entries()}}},19971,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"headers",{enumerable:!0,get:function(){return u}});let a=e.r(36052),n=e.r(56704),o=e.r(32319),i=e.r(68665),s=e.r(97573),c=e.r(4642),d=e.r(13884),l=e.r(43824),f=e.r(76414);function u(){let e="headers",t=n.workAsyncStorage.getStore(),r=o.workUnitAsyncStorage.getStore();if(t){if(r&&!(0,l.isRequestApiAllowedInCurrentPhase)(r))throw Object.defineProperty(Error(`Route ${t.route} used \`headers()\` inside \`after()\` while rendering. This is not supported. If you need this data inside an \`after()\` callback, use \`headers()\` outside of the callback. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E1378",enumerable:!1,configurable:!0});if(t.forceStatic)return p(a.HeadersAdapter.seal(new Headers({})));if(r)switch(r.type){case"cache":{let e=Object.defineProperty(Error(`Route ${t.route} used \`headers()\` inside "use cache". Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E833",enumerable:!1,configurable:!0});throw Error.captureStackTrace(e,u),(0,c.applyOwnerStack)(e),t.invalidDynamicUsageError??=e,e}case"unstable-cache":throw Object.defineProperty(Error(`Route ${t.route} used \`headers()\` inside a function cached with \`unstable_cache()\`. Accessing Dynamic data sources inside a cache scope is not supported. If you need this data inside a cached function use \`headers()\` outside of the cached function and pass the required dynamic data in as an argument. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E838",enumerable:!1,configurable:!0});case"generate-static-params":throw Object.defineProperty(Error(`Route ${t.route} used \`headers()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1134",enumerable:!1,configurable:!0})}if(t.dynamicShouldError)throw Object.defineProperty(new s.StaticGenBailoutError(`Route ${t.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`headers()\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E828",enumerable:!1,configurable:!0});if(r)switch(r.type){case"prerender":var d=t,b=r;let n=x.get(b);if(n)return n;let o=(0,c.makeRuntimeHangingPromise)(b.renderSignal,d.route,"`headers()`",b);return x.set(b,o),o;case"prerender-client":case"validation-client":let h="`headers`";throw Object.defineProperty(new f.InvariantError(`${h} must not be used within a client component. Next.js should be preventing ${h} from being included in client components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1017",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,i.postponeWithTracking)(t.route,e,r.dynamicTracking);case"prerender-legacy":return(0,i.throwToInterruptStaticGeneration)(e,t,r);case"prerender-runtime":{let{stagedRendering:e}=r;if(e)return e.delayUntilStage(c.RENDER_STAGES_BY_DATA_KIND.sessionData,"headers",r.headers);return p(r.headers)}case"private-cache":return p(r.headers);case"request":if((0,i.trackDynamicDataInDynamicRender)(r),r.asyncApiPromises)return r.asyncApiPromises.headers;return p(r.headers)}}(0,o.throwForMissingRequestStore)(e)}let x=new WeakMap;function p(e){let t=x.get(e);if(t)return t;let r=Promise.resolve(e);return x.set(e,r),r}(0,d.createDedupedByCallsiteServerErrorLoggerDev)(function(e,t){let r=e?`Route "${e}" `:"This route ";return Object.defineProperty(Error(`${r}used ${t}. \`headers()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E836",enumerable:!1,configurable:!0})})},21423,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0}),Object.defineProperty(r,"draftMode",{enumerable:!0,get:function(){return f}});let a=e.r(32319),n=e.r(56704),o=e.r(68665),i=e.r(13884),s=e.r(97573),c=e.r(65252),d=e.r(76414);e.r(30759);let l=e.r(4642);function f(){let e="draftMode",t=n.workAsyncStorage.getStore(),r=a.workUnitAsyncStorage.getStore();switch((!t||!r)&&(0,a.throwForMissingRequestStore)(e),r.type){case"prerender-runtime":{let{stagedRendering:e}=r;if(e)return e.delayUntilStage(l.RENDER_STAGES_BY_DATA_KIND.sessionData,"draftMode",new b(r.draftMode));return u(r.draftMode,t)}case"request":return u(r.draftMode,t);case"cache":case"private-cache":case"unstable-cache":let o=(0,a.getDraftModeProviderForCacheScope)(t,r);if(o)return u(o,t);case"prerender":case"prerender-ppr":case"prerender-legacy":return u(null,t);case"prerender-client":case"validation-client":{let e="`draftMode`";throw Object.defineProperty(new d.InvariantError(`${e} must not be used within a Client Component. Next.js should be preventing ${e} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1046",enumerable:!1,configurable:!0})}case"generate-static-params":throw Object.defineProperty(Error(`Route ${t.route} used \`${e}()\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1132",enumerable:!1,configurable:!0});default:return r}}function u(e,t){let r=p.get(e??x);return r||Promise.resolve(new b(e))}let x={},p=new WeakMap;class b{constructor(e){this._provider=e}get isEnabled(){return null!==this._provider&&this._provider.isEnabled}enable(){h("draftMode().enable()",this.enable),null!==this._provider&&this._provider.enable()}disable(){h("draftMode().disable()",this.disable),null!==this._provider&&this._provider.disable()}}function h(e,t){let r=n.workAsyncStorage.getStore(),i=a.workUnitAsyncStorage.getStore();if(r){if((null==i?void 0:i.phase)==="after")throw Object.defineProperty(Error(`Route ${r.route} used "${e}" inside \`after()\`. The enabled status of \`draftMode()\` can be read inside \`after()\` but you cannot enable or disable \`draftMode()\`. See more info here: https://nextjs.org/docs/app/api-reference/functions/after`),"__NEXT_ERROR_CODE",{value:"E845",enumerable:!1,configurable:!0});if(r.dynamicShouldError)throw Object.defineProperty(new s.StaticGenBailoutError(`Route ${r.route} with \`dynamic = "error"\` couldn't be rendered statically because it used \`${e}\`. See more info here: https://nextjs.org/docs/app/building-your-application/rendering/static-and-dynamic#dynamic-rendering`),"__NEXT_ERROR_CODE",{value:"E553",enumerable:!1,configurable:!0});if(i)switch(i.type){case"cache":case"private-cache":{let a=Object.defineProperty(Error(`Route ${r.route} used "${e}" inside "use cache". The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/messages/next-request-in-use-cache`),"__NEXT_ERROR_CODE",{value:"E829",enumerable:!1,configurable:!0});throw Error.captureStackTrace(a,t),(0,l.applyOwnerStack)(a),r.invalidDynamicUsageError??=a,a}case"unstable-cache":throw Object.defineProperty(Error(`Route ${r.route} used "${e}" inside a function cached with \`unstable_cache()\`. The enabled status of \`draftMode()\` can be read in caches but you must not enable or disable \`draftMode()\` inside a cache. See more info here: https://nextjs.org/docs/app/api-reference/functions/unstable_cache`),"__NEXT_ERROR_CODE",{value:"E844",enumerable:!1,configurable:!0});case"prerender":case"prerender-runtime":{let t=Object.defineProperty(Error(`Route ${r.route} used ${e} without first calling \`await connection()\`. See more info here: https://nextjs.org/docs/messages/next-prerender-sync-headers`),"__NEXT_ERROR_CODE",{value:"E126",enumerable:!1,configurable:!0});return(0,o.abortAndThrowOnSynchronousRequestDataAccess)(r.route,e,t,i)}case"prerender-client":case"validation-client":let a="`draftMode`";throw Object.defineProperty(new d.InvariantError(`${a} must not be used within a Client Component. Next.js should be preventing ${a} from being included in Client Components statically, but did not in this case.`),"__NEXT_ERROR_CODE",{value:"E1046",enumerable:!1,configurable:!0});case"prerender-ppr":return(0,o.postponeWithTracking)(r.route,e,i.dynamicTracking);case"prerender-legacy":i.revalidate=0;let n=Object.defineProperty(new c.DynamicServerError(`Route ${r.route} couldn't be rendered statically because it used \`${e}\`. See more info here: https://nextjs.org/docs/messages/dynamic-server-error`),"__NEXT_ERROR_CODE",{value:"E558",enumerable:!1,configurable:!0});throw r.dynamicUsageDescription=e,r.dynamicUsageStack=n.stack,n;case"request":(0,o.trackDynamicDataInDynamicRender)(i);break;case"generate-static-params":throw Object.defineProperty(Error(`Route ${r.route} used \`${e}\` inside \`generateStaticParams\`. This is not supported because \`generateStaticParams\` runs at build time without an HTTP request. Read more: https://nextjs.org/docs/messages/next-dynamic-api-wrong-context`),"__NEXT_ERROR_CODE",{value:"E1121",enumerable:!1,configurable:!0})}}}(0,i.createDedupedByCallsiteServerErrorLoggerDev)(function(e,t){let r=e?`Route "${e}" `:"This route ";return Object.defineProperty(Error(`${r}used ${t}. \`draftMode()\` returns a Promise and must be unwrapped with \`await\` or \`React.use()\` before accessing its properties. Learn more: https://nextjs.org/docs/messages/sync-dynamic-apis`),"__NEXT_ERROR_CODE",{value:"E835",enumerable:!1,configurable:!0})})},93458,(e,t,r)=>{t.exports.cookies=e.r(7460).cookies,t.exports.headers=e.r(19971).headers,t.exports.draftMode=e.r(21423).draftMode},17374,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={ActionDidNotRevalidate:function(){return o},ActionDidRevalidateDynamicOnly:function(){return s},ActionDidRevalidateStaticAndDynamic:function(){return i}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let o=0,i=1,s=2},30240,(e,t,r)=>{"use strict";Object.defineProperty(r,"__esModule",{value:!0});var a={MutableRequestCookiesAdapter:function(){return p},ReadonlyRequestCookiesError:function(){return d},RequestCookiesAdapter:function(){return l},appendMutableCookies:function(){return x},areCookiesMutableInCurrentPhase:function(){return h},createCookiesWithMutableAccessCheck:function(){return b},getModifiedCookieValues:function(){return u},responseCookiesToRequestCookies:function(){return m}};for(var n in a)Object.defineProperty(r,n,{enumerable:!0,get:a[n]});let o=e.r(472),i=e.r(30759),s=e.r(56704),c=e.r(17374);class d extends Error{constructor(){super("Cookies can only be modified in a Server Action or Route Handler. Read more: https://nextjs.org/docs/app/api-reference/functions/cookies#options"),Object.defineProperty(this,"__NEXT_ERROR_CODE",{value:"E1180",enumerable:!1,configurable:!0})}static callable(){throw new d}}class l{static seal(e){return new Proxy(e,{get(e,t,r){switch(t){case"clear":case"delete":case"set":return d.callable;default:return i.ReflectAdapter.get(e,t,r)}}})}static fresh(e){return new Proxy(e,{get:(e,t,r)=>i.ReflectAdapter.get(e,t,r)})}}let f=Symbol.for("next.mutated.cookies");function u(e){let t=e[f];return t&&Array.isArray(t)&&0!==t.length?t:[]}function x(e,t){let r=u(t);if(0===r.length)return!1;let a=new o.ResponseCookies(e),n=a.getAll();for(let e of r)a.set(e);for(let e of n)a.set(e);return!0}class p{static wrap(e,t){let r=new o.ResponseCookies(new Headers);for(let t of e.getAll())r.set(t);let a=[],n=new Set,d=()=>{let e=s.workAsyncStorage.getStore();if(e&&(e.pathWasRevalidated=c.ActionDidRevalidateStaticAndDynamic),a=r.getAll().filter(e=>n.has(e.name)),t){let e=[];for(let t of a){let r=new o.ResponseCookies(new Headers);r.set(t),e.push(r.toString())}t(e)}},l=new Proxy(r,{get(e,t,r){switch(t){case f:return a;case"delete":return function(...t){n.add("string"==typeof t[0]?t[0]:t[0].name);try{return e.delete(...t),l}finally{d()}};case"set":return function(...t){n.add("string"==typeof t[0]?t[0]:t[0].name);try{return e.set(...t),l}finally{d()}};default:return i.ReflectAdapter.get(e,t,r)}}});return l}}function b(e){let t=new Proxy(e.mutableCookies,{get(r,a,n){switch(a){case"delete":return function(...a){return g(e,"cookies().delete"),r.delete(...a),t};case"set":return function(...a){return g(e,"cookies().set"),r.set(...a),t};default:return i.ReflectAdapter.get(r,a,n)}}});return t}function h(e){return"action"===e.phase}function g(e,t){if(!h(e))throw new d}function m(e){let t=new o.RequestCookies(new Headers);for(let r of e.getAll())t.set(r);return t}}];

//# sourceMappingURL=_143315o._.js.map