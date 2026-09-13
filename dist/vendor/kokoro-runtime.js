var JI=Object.create;var Xl=Object.defineProperty;var qI=Object.getOwnPropertyDescriptor;var $I=Object.getOwnPropertyNames;var e6=Object.getPrototypeOf,t6=Object.prototype.hasOwnProperty;var bi=(s=>typeof require<"u"?require:typeof Proxy<"u"?new Proxy(s,{get:(i,o)=>(typeof require<"u"?require:i)[o]}):s)(function(s){if(typeof require<"u")return require.apply(this,arguments);throw Error('Dynamic require of "'+s+'" is not supported')});var jg=(s,i)=>()=>{try{return i||s((i={exports:{}}).exports,i),i.exports}catch(o){throw i=0,o}},Wg=(s,i)=>{for(var o in i)Xl(s,o,{get:i[o],enumerable:!0})},A6=(s,i,o,d)=>{if(i&&typeof i=="object"||typeof i=="function")for(let m of $I(i))!t6.call(s,m)&&m!==o&&Xl(s,m,{get:()=>i[m],enumerable:!(d=qI(i,m))||d.enumerable});return s};var Vg=(s,i,o)=>(o=s!=null?JI(e6(s)):{},A6(i||!s||!s.__esModule?Xl(o,"default",{value:s,enumerable:!0}):o,s));var K8=jg(()=>{});var X8=jg(()=>{});var Jl={};Wg(Jl,{InferenceSession:()=>s6,TRACE:()=>of,TRACE_FUNC_BEGIN:()=>k0,TRACE_FUNC_END:()=>M0,Tensor:()=>wi,env:()=>a6,registerBackend:()=>Yg});var w0=new Map,Ci=[],Yg=(s,i,o)=>{if(i&&typeof i.init=="function"&&typeof i.createInferenceSessionHandler=="function"){let d=w0.get(s);if(d===void 0)w0.set(s,{backend:i,priority:o});else{if(d.priority>o)return;if(d.priority===o&&d.backend!==i)throw new Error(`cannot register backend "${s}" using priority ${o}`)}if(o>=0){let m=Ci.indexOf(s);m!==-1&&Ci.splice(m,1);for(let C=0;C<Ci.length;C++)if(w0.get(Ci[C]).priority<=o){Ci.splice(C,0,s);return}Ci.push(s)}return}throw new TypeError("not a valid backend")},r6=async s=>{let i=w0.get(s);if(!i)return"backend not found.";if(i.initialized)return i.backend;if(i.aborted)return i.error;{let o=!!i.initPromise;try{return o||(i.initPromise=i.backend.init(s)),await i.initPromise,i.initialized=!0,i.backend}catch(d){return o||(i.error=`${d}`,i.aborted=!0),i.error}finally{delete i.initPromise}}},Hg=async s=>{let i=s.executionProviders||[],o=i.map(M=>typeof M=="string"?M:M.name),d=o.length===0?Ci:o,m,C=[],b=new Set;for(let M of d){let x=await r6(M);typeof x=="string"?C.push({name:M,err:x}):(m||(m=x),m===x&&b.add(M))}if(!m)throw new Error(`no available backend found. ERR: ${C.map(M=>`[${M.name}] ${M.err}`).join(", ")}`);for(let{name:M,err:x}of C)o.includes(M)&&console.warn(`removing requested execution provider "${M}" from session options because it is not available: ${x}`);let w=i.filter(M=>b.has(typeof M=="string"?M:M.name));return[m,new Proxy(s,{get:(M,x)=>x==="executionProviders"?w:Reflect.get(M,x)})]};var Ug="1.21.0";var Kg="warning",us={wasm:{},webgl:{},webgpu:{},versions:{common:Ug},set logLevel(s){if(s!==void 0){if(typeof s!="string"||["verbose","info","warning","error","fatal"].indexOf(s)===-1)throw new Error(`Unsupported logging level: ${s}`);Kg=s}},get logLevel(){return Kg}};Object.defineProperty(us,"logLevel",{enumerable:!0});var a6=us;var Xg=(s,i)=>{let o=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);o.width=s.dims[3],o.height=s.dims[2];let d=o.getContext("2d");if(d!=null){let m,C;i?.tensorLayout!==void 0&&i.tensorLayout==="NHWC"?(m=s.dims[2],C=s.dims[3]):(m=s.dims[3],C=s.dims[2]);let b=i?.format!==void 0?i.format:"RGB",w=i?.norm,M,x;w===void 0||w.mean===void 0?M=[255,255,255,255]:typeof w.mean=="number"?M=[w.mean,w.mean,w.mean,w.mean]:(M=[w.mean[0],w.mean[1],w.mean[2],0],w.mean[3]!==void 0&&(M[3]=w.mean[3])),w===void 0||w.bias===void 0?x=[0,0,0,0]:typeof w.bias=="number"?x=[w.bias,w.bias,w.bias,w.bias]:(x=[w.bias[0],w.bias[1],w.bias[2],0],w.bias[3]!==void 0&&(x[3]=w.bias[3]));let D=C*m,_=0,v=D,Q=D*2,F=-1;b==="RGBA"?(_=0,v=D,Q=D*2,F=D*3):b==="RGB"?(_=0,v=D,Q=D*2):b==="RBG"&&(_=0,Q=D,v=D*2);for(let j=0;j<C;j++)for(let X=0;X<m;X++){let R=(s.data[_++]-x[0])*M[0],L=(s.data[v++]-x[1])*M[1],K=(s.data[Q++]-x[2])*M[2],g=F===-1?255:(s.data[F++]-x[3])*M[3];d.fillStyle="rgba("+R+","+L+","+K+","+g+")",d.fillRect(X,j,1,1)}if("toDataURL"in o)return o.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Zg=(s,i)=>{let o=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),d;if(o!=null){let m,C,b;i?.tensorLayout!==void 0&&i.tensorLayout==="NHWC"?(m=s.dims[2],C=s.dims[1],b=s.dims[3]):(m=s.dims[3],C=s.dims[2],b=s.dims[1]);let w=i!==void 0&&i.format!==void 0?i.format:"RGB",M=i?.norm,x,D;M===void 0||M.mean===void 0?x=[255,255,255,255]:typeof M.mean=="number"?x=[M.mean,M.mean,M.mean,M.mean]:(x=[M.mean[0],M.mean[1],M.mean[2],255],M.mean[3]!==void 0&&(x[3]=M.mean[3])),M===void 0||M.bias===void 0?D=[0,0,0,0]:typeof M.bias=="number"?D=[M.bias,M.bias,M.bias,M.bias]:(D=[M.bias[0],M.bias[1],M.bias[2],0],M.bias[3]!==void 0&&(D[3]=M.bias[3]));let _=C*m;if(i!==void 0&&(i.format!==void 0&&b===4&&i.format!=="RGBA"||b===3&&i.format!=="RGB"&&i.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let v=4,Q=0,F=1,j=2,X=3,R=0,L=_,K=_*2,g=-1;w==="RGBA"?(R=0,L=_,K=_*2,g=_*3):w==="RGB"?(R=0,L=_,K=_*2):w==="RBG"&&(R=0,K=_,L=_*2),d=o.createImageData(m,C);for(let k=0;k<C*m;Q+=v,F+=v,j+=v,X+=v,k++)d.data[Q]=(s.data[R++]-D[0])*x[0],d.data[F]=(s.data[L++]-D[1])*x[1],d.data[j]=(s.data[K++]-D[2])*x[2],d.data[X]=g===-1?255:(s.data[g++]-D[3])*x[3]}else throw new Error("Can not access image data");return d};var Zl=(s,i)=>{if(s===void 0)throw new Error("Image buffer must be defined");if(i.height===void 0||i.width===void 0)throw new Error("Image height and width must be defined");if(i.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:o,width:d}=i,m=i.norm??{mean:255,bias:0},C,b;typeof m.mean=="number"?C=[m.mean,m.mean,m.mean,m.mean]:C=[m.mean[0],m.mean[1],m.mean[2],m.mean[3]??255],typeof m.bias=="number"?b=[m.bias,m.bias,m.bias,m.bias]:b=[m.bias[0],m.bias[1],m.bias[2],m.bias[3]??0];let w=i.format!==void 0?i.format:"RGBA",M=i.tensorFormat!==void 0&&i.tensorFormat!==void 0?i.tensorFormat:"RGB",x=o*d,D=M==="RGBA"?new Float32Array(x*4):new Float32Array(x*3),_=4,v=0,Q=1,F=2,j=3,X=0,R=x,L=x*2,K=-1;w==="RGB"&&(_=3,v=0,Q=1,F=2,j=-1),M==="RGBA"?K=x*3:M==="RBG"?(X=0,L=x,R=x*2):M==="BGR"&&(L=0,R=x,X=x*2);for(let k=0;k<x;k++,v+=_,F+=_,Q+=_,j+=_)D[X++]=(s[v]+b[0])/C[0],D[R++]=(s[Q]+b[1])/C[1],D[L++]=(s[F]+b[2])/C[2],K!==-1&&j!==-1&&(D[K++]=(s[j]+b[3])/C[3]);return M==="RGBA"?new ya("float32",D,[1,4,o,d]):new ya("float32",D,[1,3,o,d])},Jg=async(s,i)=>{let o=typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement,d=typeof ImageData<"u"&&s instanceof ImageData,m=typeof ImageBitmap<"u"&&s instanceof ImageBitmap,C=typeof s=="string",b,w=i??{},M=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},x=D=>typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||D instanceof OffscreenCanvas?D.getContext("2d"):null;if(o){let D=M();D.width=s.width,D.height=s.height;let _=x(D);if(_!=null){let v=s.height,Q=s.width;if(i!==void 0&&i.resizedHeight!==void 0&&i.resizedWidth!==void 0&&(v=i.resizedHeight,Q=i.resizedWidth),i!==void 0){if(w=i,i.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");w.tensorFormat="RGBA",w.height=v,w.width=Q}else w.tensorFormat="RGBA",w.height=v,w.width=Q;_.drawImage(s,0,0),b=_.getImageData(0,0,Q,v).data}else throw new Error("Can not access image data")}else if(d){let D,_;if(i!==void 0&&i.resizedWidth!==void 0&&i.resizedHeight!==void 0?(D=i.resizedHeight,_=i.resizedWidth):(D=s.height,_=s.width),i!==void 0&&(w=i),w.format="RGBA",w.height=D,w.width=_,i!==void 0){let v=M();v.width=_,v.height=D;let Q=x(v);if(Q!=null)Q.putImageData(s,0,0),b=Q.getImageData(0,0,_,D).data;else throw new Error("Can not access image data")}else b=s.data}else if(m){if(i===void 0)throw new Error("Please provide image config with format for Imagebitmap");let D=M();D.width=s.width,D.height=s.height;let _=x(D);if(_!=null){let v=s.height,Q=s.width;return _.drawImage(s,0,0,Q,v),b=_.getImageData(0,0,Q,v).data,w.height=v,w.width=Q,Zl(b,w)}else throw new Error("Can not access image data")}else{if(C)return new Promise((D,_)=>{let v=M(),Q=x(v);if(!s||!Q)return _();let F=new Image;F.crossOrigin="Anonymous",F.src=s,F.onload=()=>{v.width=F.width,v.height=F.height,Q.drawImage(F,0,0,v.width,v.height);let j=Q.getImageData(0,0,v.width,v.height);w.height=v.height,w.width=v.width,D(Zl(j.data,w))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(b!==void 0)return Zl(b,w);throw new Error("Input data provided is not supported - aborted tensor creation")},qg=(s,i)=>{let{width:o,height:d,download:m,dispose:C}=i,b=[1,d,o,4];return new ya({location:"texture",type:"float32",texture:s,dims:b,download:m,dispose:C})},$g=(s,i)=>{let{dataType:o,dims:d,download:m,dispose:C}=i;return new ya({location:"gpu-buffer",type:o??"float32",gpuBuffer:s,dims:d,download:m,dispose:C})},ef=(s,i)=>{let{dataType:o,dims:d,download:m,dispose:C}=i;return new ya({location:"ml-tensor",type:o??"float32",mlTensor:s,dims:d,download:m,dispose:C})},tf=(s,i,o)=>new ya({location:"cpu-pinned",type:s,data:i,dims:o??[i.length]});var Ii=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Pn=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Af=!1,rf=()=>{if(!Af){Af=!0;let s=typeof BigInt64Array<"u"&&BigInt64Array.from,i=typeof BigUint64Array<"u"&&BigUint64Array.from,o=globalThis.Float16Array,d=typeof o<"u"&&o.from;s&&(Ii.set("int64",BigInt64Array),Pn.set(BigInt64Array,"int64")),i&&(Ii.set("uint64",BigUint64Array),Pn.set(BigUint64Array,"uint64")),d?(Ii.set("float16",o),Pn.set(o,"float16")):Ii.set("float16",Uint16Array)}};var af=s=>{let i=1;for(let o=0;o<s.length;o++){let d=s[o];if(typeof d!="number"||!Number.isSafeInteger(d))throw new TypeError(`dims[${o}] must be an integer, got: ${d}`);if(d<0)throw new RangeError(`dims[${o}] must be a non-negative integer, got: ${d}`);i*=d}return i},sf=(s,i)=>{switch(s.location){case"cpu":return new ya(s.type,s.data,i);case"cpu-pinned":return new ya({location:"cpu-pinned",data:s.data,type:s.type,dims:i});case"texture":return new ya({location:"texture",texture:s.texture,type:s.type,dims:i});case"gpu-buffer":return new ya({location:"gpu-buffer",gpuBuffer:s.gpuBuffer,type:s.type,dims:i});case"ml-tensor":return new ya({location:"ml-tensor",mlTensor:s.mlTensor,type:s.type,dims:i});default:throw new Error(`tensorReshape: tensor location ${s.location} is not supported`)}};var ya=class{constructor(i,o,d){rf();let m,C;if(typeof i=="object"&&"location"in i)switch(this.dataLocation=i.location,m=i.type,C=i.dims,i.location){case"cpu-pinned":{let w=Ii.get(m);if(!w)throw new TypeError(`unsupported type "${m}" to create tensor from pinned buffer`);if(!(i.data instanceof w))throw new TypeError(`buffer should be of type ${w.name}`);this.cpuData=i.data;break}case"texture":{if(m!=="float32")throw new TypeError(`unsupported type "${m}" to create tensor from texture`);this.gpuTextureData=i.texture,this.downloader=i.download,this.disposer=i.dispose;break}case"gpu-buffer":{if(m!=="float32"&&m!=="float16"&&m!=="int32"&&m!=="int64"&&m!=="uint32"&&m!=="uint8"&&m!=="bool"&&m!=="uint4"&&m!=="int4")throw new TypeError(`unsupported type "${m}" to create tensor from gpu buffer`);this.gpuBufferData=i.gpuBuffer,this.downloader=i.download,this.disposer=i.dispose;break}case"ml-tensor":{if(m!=="float32"&&m!=="float16"&&m!=="int32"&&m!=="int64"&&m!=="uint32"&&m!=="uint64"&&m!=="int8"&&m!=="uint8"&&m!=="bool"&&m!=="uint4"&&m!=="int4")throw new TypeError(`unsupported type "${m}" to create tensor from MLTensor`);this.mlTensorData=i.mlTensor,this.downloader=i.download,this.disposer=i.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let w,M;if(typeof i=="string")if(m=i,M=d,i==="string"){if(!Array.isArray(o))throw new TypeError("A string tensor's data must be a string array.");w=o}else{let x=Ii.get(i);if(x===void 0)throw new TypeError(`Unsupported tensor type: ${i}.`);if(Array.isArray(o)){if(i==="float16"&&x===Uint16Array||i==="uint4"||i==="int4")throw new TypeError(`Creating a ${i} tensor from number array is not supported. Please use ${x.name} as data.`);i==="uint64"||i==="int64"?w=x.from(o,BigInt):w=x.from(o)}else if(o instanceof x)w=o;else if(o instanceof Uint8ClampedArray)if(i==="uint8")w=Uint8Array.from(o);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(i==="float16"&&o instanceof Uint16Array&&x!==Uint16Array)w=new globalThis.Float16Array(o.buffer,o.byteOffset,o.length);else throw new TypeError(`A ${m} tensor's data must be type of ${x}`)}else if(M=o,Array.isArray(i)){if(i.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let x=typeof i[0];if(x==="string")m="string",w=i;else if(x==="boolean")m="bool",w=Uint8Array.from(i);else throw new TypeError(`Invalid element type of data array: ${x}.`)}else if(i instanceof Uint8ClampedArray)m="uint8",w=Uint8Array.from(i);else{let x=Pn.get(i.constructor);if(x===void 0)throw new TypeError(`Unsupported type for tensor data: ${i.constructor}.`);m=x,w=i}if(M===void 0)M=[w.length];else if(!Array.isArray(M))throw new TypeError("A tensor's dims must be a number array");C=M,this.cpuData=w,this.dataLocation="cpu"}let b=af(C);if(this.cpuData&&b!==this.cpuData.length&&!((m==="uint4"||m==="int4")&&Math.ceil(b/2)===this.cpuData.length))throw new Error(`Tensor's size(${b}) does not match data length(${this.cpuData.length}).`);this.type=m,this.dims=C,this.size=b}static async fromImage(i,o){return Jg(i,o)}static fromTexture(i,o){return qg(i,o)}static fromGpuBuffer(i,o){return $g(i,o)}static fromMLTensor(i,o){return ef(i,o)}static fromPinnedBuffer(i,o,d){return tf(i,o,d)}toDataURL(i){return Xg(this,i)}toImageData(i){return Zg(this,i)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(i){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let o=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=o,i&&this.disposer&&(this.disposer(),this.disposer=void 0),o}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(i){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return sf(this,i)}};var wi=ya;var of=(s,i)=>{(typeof us.trace>"u"?!us.wasm.trace:!us.trace)||console.timeStamp(`${s}::ORT::${i}`)},nf=(s,i)=>{let o=new Error().stack?.split(/\r\n|\r|\n/g)||[],d=!1;for(let m=0;m<o.length;m++){if(d&&!o[m].includes("TRACE_FUNC")){let C=`FUNC_${s}::${o[m].trim().split(" ")[1]}`;i&&(C+=`::${i}`),of("CPU",C);return}o[m].includes("TRACE_FUNC")&&(d=!0)}},k0=s=>{(typeof us.trace>"u"?!us.wasm.trace:!us.trace)||nf("BEGIN",s)},M0=s=>{(typeof us.trace>"u"?!us.wasm.trace:!us.trace)||nf("END",s)};var x0=class s{constructor(i){this.handler=i}async run(i,o,d){k0();let m={},C={};if(typeof i!="object"||i===null||i instanceof wi||Array.isArray(i))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let b=!0;if(typeof o=="object"){if(o===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(o instanceof wi)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(o)){if(o.length===0)throw new TypeError("'fetches' cannot be an empty array.");b=!1;for(let x of o){if(typeof x!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(x)===-1)throw new RangeError(`'fetches' contains invalid output name: ${x}.`);m[x]=null}if(typeof d=="object"&&d!==null)C=d;else if(typeof d<"u")throw new TypeError("'options' must be an object.")}else{let x=!1,D=Object.getOwnPropertyNames(o);for(let _ of this.outputNames)if(D.indexOf(_)!==-1){let v=o[_];(v===null||v instanceof wi)&&(x=!0,b=!1,m[_]=v)}if(x){if(typeof d=="object"&&d!==null)C=d;else if(typeof d<"u")throw new TypeError("'options' must be an object.")}else C=o}}else if(typeof o<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let x of this.inputNames)if(typeof i[x]>"u")throw new Error(`input '${x}' is missing in 'feeds'.`);if(b)for(let x of this.outputNames)m[x]=null;let w=await this.handler.run(i,m,C),M={};for(let x in w)if(Object.hasOwnProperty.call(w,x)){let D=w[x];D instanceof wi?M[x]=D:M[x]=new wi(D.type,D.data,D.dims)}return M0(),M}async release(){return this.handler.dispose()}static async create(i,o,d,m){k0();let C,b={};if(typeof i=="string"){if(C=i,typeof o=="object"&&o!==null)b=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(i instanceof Uint8Array){if(C=i,typeof o=="object"&&o!==null)b=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(i instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&i instanceof SharedArrayBuffer){let D=i,_=0,v=i.byteLength;if(typeof o=="object"&&o!==null)b=o;else if(typeof o=="number"){if(_=o,!Number.isSafeInteger(_))throw new RangeError("'byteOffset' must be an integer.");if(_<0||_>=D.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${D.byteLength}).`);if(v=i.byteLength-_,typeof d=="number"){if(v=d,!Number.isSafeInteger(v))throw new RangeError("'byteLength' must be an integer.");if(v<=0||_+v>D.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${D.byteLength-_}].`);if(typeof m=="object"&&m!==null)b=m;else if(typeof m<"u")throw new TypeError("'options' must be an object.")}else if(typeof d<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof o<"u")throw new TypeError("'options' must be an object.");C=new Uint8Array(D,_,v)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[w,M]=await Hg(b),x=await w.createInferenceSessionHandler(C,M);return M0(),new s(x)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}};var s6=x0;var W2={};Wg(W2,{InferenceSession:()=>p2,TRACE:()=>Xn,TRACE_FUNC_BEGIN:()=>js,TRACE_FUNC_END:()=>Es,Tensor:()=>Rs,default:()=>vw,env:()=>kr,registerBackend:()=>Bi});var g2=Object.defineProperty,o6=Object.getOwnPropertyDescriptor,i6=Object.getOwnPropertyNames,n6=Object.prototype.hasOwnProperty,l6=(s=>typeof bi<"u"?bi:typeof Proxy<"u"?new Proxy(s,{get:(i,o)=>(typeof bi<"u"?bi:i)[o]}):s)(function(s){if(typeof bi<"u")return bi.apply(this,arguments);throw Error('Dynamic require of "'+s+'" is not supported')}),Mt=(s,i)=>()=>(s&&(i=s(s=0)),i),nn=(s,i)=>{for(var o in i)g2(s,o,{get:i[o],enumerable:!0})},c6=(s,i,o,d)=>{if(i&&typeof i=="object"||typeof i=="function")for(let m of i6(i))!n6.call(s,m)&&m!==o&&g2(s,m,{get:()=>i[m],enumerable:!(d=o6(i,m))||d.enumerable});return s},Kn=s=>c6(g2({},"__esModule",{value:!0}),s),Gn,Ko,Bi,lf,R4,j4=Mt(()=>{"use strict";Gn=new Map,Ko=[],Bi=(s,i,o)=>{if(i&&typeof i.init=="function"&&typeof i.createInferenceSessionHandler=="function"){let d=Gn.get(s);if(d===void 0)Gn.set(s,{backend:i,priority:o});else{if(d.priority>o)return;if(d.priority===o&&d.backend!==i)throw new Error(`cannot register backend "${s}" using priority ${o}`)}if(o>=0){let m=Ko.indexOf(s);m!==-1&&Ko.splice(m,1);for(let C=0;C<Ko.length;C++)if(Gn.get(Ko[C]).priority<=o){Ko.splice(C,0,s);return}Ko.push(s)}return}throw new TypeError("not a valid backend")},lf=async s=>{let i=Gn.get(s);if(!i)return"backend not found.";if(i.initialized)return i.backend;if(i.aborted)return i.error;{let o=!!i.initPromise;try{return o||(i.initPromise=i.backend.init(s)),await i.initPromise,i.initialized=!0,i.backend}catch(d){return o||(i.error=`${d}`,i.aborted=!0),i.error}finally{delete i.initPromise}}},R4=async s=>{let i=s.executionProviders||[],o=i.map(M=>typeof M=="string"?M:M.name),d=o.length===0?Ko:o,m,C=[],b=new Set;for(let M of d){let x=await lf(M);typeof x=="string"?C.push({name:M,err:x}):(m||(m=x),m===x&&b.add(M))}if(!m)throw new Error(`no available backend found. ERR: ${C.map(M=>`[${M.name}] ${M.err}`).join(", ")}`);for(let{name:M,err:x}of C)o.includes(M)&&console.warn(`removing requested execution provider "${M}" from session options because it is not available: ${x}`);let w=i.filter(M=>b.has(typeof M=="string"?M:M.name));return[m,new Proxy(s,{get:(M,x)=>x==="executionProviders"?w:Reflect.get(M,x)})]}}),u6=Mt(()=>{"use strict";j4()}),W4,d6=Mt(()=>{"use strict";W4="1.22.0-dev.20250409-89f8206ba4"}),ql,vs,V4=Mt(()=>{"use strict";d6(),ql="warning",vs={wasm:{},webgl:{},webgpu:{},versions:{common:W4},set logLevel(s){if(s!==void 0){if(typeof s!="string"||["verbose","info","warning","error","fatal"].indexOf(s)===-1)throw new Error(`Unsupported logging level: ${s}`);ql=s}},get logLevel(){return ql}},Object.defineProperty(vs,"logLevel",{enumerable:!0})}),kr,g6=Mt(()=>{"use strict";V4(),kr=vs}),Y4,H4,f6=Mt(()=>{"use strict";Y4=(s,i)=>{let o=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);o.width=s.dims[3],o.height=s.dims[2];let d=o.getContext("2d");if(d!=null){let m,C;i?.tensorLayout!==void 0&&i.tensorLayout==="NHWC"?(m=s.dims[2],C=s.dims[3]):(m=s.dims[3],C=s.dims[2]);let b=i?.format!==void 0?i.format:"RGB",w=i?.norm,M,x;w===void 0||w.mean===void 0?M=[255,255,255,255]:typeof w.mean=="number"?M=[w.mean,w.mean,w.mean,w.mean]:(M=[w.mean[0],w.mean[1],w.mean[2],0],w.mean[3]!==void 0&&(M[3]=w.mean[3])),w===void 0||w.bias===void 0?x=[0,0,0,0]:typeof w.bias=="number"?x=[w.bias,w.bias,w.bias,w.bias]:(x=[w.bias[0],w.bias[1],w.bias[2],0],w.bias[3]!==void 0&&(x[3]=w.bias[3]));let D=C*m,_=0,v=D,Q=D*2,F=-1;b==="RGBA"?(_=0,v=D,Q=D*2,F=D*3):b==="RGB"?(_=0,v=D,Q=D*2):b==="RBG"&&(_=0,Q=D,v=D*2);for(let j=0;j<C;j++)for(let X=0;X<m;X++){let R=(s.data[_++]-x[0])*M[0],L=(s.data[v++]-x[1])*M[1],K=(s.data[Q++]-x[2])*M[2],g=F===-1?255:(s.data[F++]-x[3])*M[3];d.fillStyle="rgba("+R+","+L+","+K+","+g+")",d.fillRect(X,j,1,1)}if("toDataURL"in o)return o.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},H4=(s,i)=>{let o=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),d;if(o!=null){let m,C,b;i?.tensorLayout!==void 0&&i.tensorLayout==="NHWC"?(m=s.dims[2],C=s.dims[1],b=s.dims[3]):(m=s.dims[3],C=s.dims[2],b=s.dims[1]);let w=i!==void 0&&i.format!==void 0?i.format:"RGB",M=i?.norm,x,D;M===void 0||M.mean===void 0?x=[255,255,255,255]:typeof M.mean=="number"?x=[M.mean,M.mean,M.mean,M.mean]:(x=[M.mean[0],M.mean[1],M.mean[2],255],M.mean[3]!==void 0&&(x[3]=M.mean[3])),M===void 0||M.bias===void 0?D=[0,0,0,0]:typeof M.bias=="number"?D=[M.bias,M.bias,M.bias,M.bias]:(D=[M.bias[0],M.bias[1],M.bias[2],0],M.bias[3]!==void 0&&(D[3]=M.bias[3]));let _=C*m;if(i!==void 0&&(i.format!==void 0&&b===4&&i.format!=="RGBA"||b===3&&i.format!=="RGB"&&i.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let v=4,Q=0,F=1,j=2,X=3,R=0,L=_,K=_*2,g=-1;w==="RGBA"?(R=0,L=_,K=_*2,g=_*3):w==="RGB"?(R=0,L=_,K=_*2):w==="RBG"&&(R=0,K=_,L=_*2),d=o.createImageData(m,C);for(let k=0;k<C*m;Q+=v,F+=v,j+=v,X+=v,k++)d.data[Q]=(s.data[R++]-D[0])*x[0],d.data[F]=(s.data[L++]-D[1])*x[1],d.data[j]=(s.data[K++]-D[2])*x[2],d.data[X]=g===-1?255:(s.data[g++]-D[3])*x[3]}else throw new Error("Can not access image data");return d}}),v0,U4,K4,X4,Z4,J4,p6=Mt(()=>{"use strict";f2(),v0=(s,i)=>{if(s===void 0)throw new Error("Image buffer must be defined");if(i.height===void 0||i.width===void 0)throw new Error("Image height and width must be defined");if(i.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:o,width:d}=i,m=i.norm??{mean:255,bias:0},C,b;typeof m.mean=="number"?C=[m.mean,m.mean,m.mean,m.mean]:C=[m.mean[0],m.mean[1],m.mean[2],m.mean[3]??255],typeof m.bias=="number"?b=[m.bias,m.bias,m.bias,m.bias]:b=[m.bias[0],m.bias[1],m.bias[2],m.bias[3]??0];let w=i.format!==void 0?i.format:"RGBA",M=i.tensorFormat!==void 0&&i.tensorFormat!==void 0?i.tensorFormat:"RGB",x=o*d,D=M==="RGBA"?new Float32Array(x*4):new Float32Array(x*3),_=4,v=0,Q=1,F=2,j=3,X=0,R=x,L=x*2,K=-1;w==="RGB"&&(_=3,v=0,Q=1,F=2,j=-1),M==="RGBA"?K=x*3:M==="RBG"?(X=0,L=x,R=x*2):M==="BGR"&&(L=0,R=x,X=x*2);for(let g=0;g<x;g++,v+=_,F+=_,Q+=_,j+=_)D[X++]=(s[v]+b[0])/C[0],D[R++]=(s[Q]+b[1])/C[1],D[L++]=(s[F]+b[2])/C[2],K!==-1&&j!==-1&&(D[K++]=(s[j]+b[3])/C[3]);return M==="RGBA"?new gs("float32",D,[1,4,o,d]):new gs("float32",D,[1,3,o,d])},U4=async(s,i)=>{let o=typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement,d=typeof ImageData<"u"&&s instanceof ImageData,m=typeof ImageBitmap<"u"&&s instanceof ImageBitmap,C=typeof s=="string",b,w=i??{},M=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},x=D=>typeof HTMLCanvasElement<"u"&&D instanceof HTMLCanvasElement||D instanceof OffscreenCanvas?D.getContext("2d"):null;if(o){let D=M();D.width=s.width,D.height=s.height;let _=x(D);if(_!=null){let v=s.height,Q=s.width;if(i!==void 0&&i.resizedHeight!==void 0&&i.resizedWidth!==void 0&&(v=i.resizedHeight,Q=i.resizedWidth),i!==void 0){if(w=i,i.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");w.tensorFormat="RGBA",w.height=v,w.width=Q}else w.tensorFormat="RGBA",w.height=v,w.width=Q;_.drawImage(s,0,0),b=_.getImageData(0,0,Q,v).data}else throw new Error("Can not access image data")}else if(d){let D,_;if(i!==void 0&&i.resizedWidth!==void 0&&i.resizedHeight!==void 0?(D=i.resizedHeight,_=i.resizedWidth):(D=s.height,_=s.width),i!==void 0&&(w=i),w.format="RGBA",w.height=D,w.width=_,i!==void 0){let v=M();v.width=_,v.height=D;let Q=x(v);if(Q!=null)Q.putImageData(s,0,0),b=Q.getImageData(0,0,_,D).data;else throw new Error("Can not access image data")}else b=s.data}else if(m){if(i===void 0)throw new Error("Please provide image config with format for Imagebitmap");let D=M();D.width=s.width,D.height=s.height;let _=x(D);if(_!=null){let v=s.height,Q=s.width;return _.drawImage(s,0,0,Q,v),b=_.getImageData(0,0,Q,v).data,w.height=v,w.width=Q,v0(b,w)}else throw new Error("Can not access image data")}else{if(C)return new Promise((D,_)=>{let v=M(),Q=x(v);if(!s||!Q)return _();let F=new Image;F.crossOrigin="Anonymous",F.src=s,F.onload=()=>{v.width=F.width,v.height=F.height,Q.drawImage(F,0,0,v.width,v.height);let j=Q.getImageData(0,0,v.width,v.height);w.height=v.height,w.width=v.width,D(v0(j.data,w))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(b!==void 0)return v0(b,w);throw new Error("Input data provided is not supported - aborted tensor creation")},K4=(s,i)=>{let{width:o,height:d,download:m,dispose:C}=i,b=[1,d,o,4];return new gs({location:"texture",type:"float32",texture:s,dims:b,download:m,dispose:C})},X4=(s,i)=>{let{dataType:o,dims:d,download:m,dispose:C}=i;return new gs({location:"gpu-buffer",type:o??"float32",gpuBuffer:s,dims:d,download:m,dispose:C})},Z4=(s,i)=>{let{dataType:o,dims:d,download:m,dispose:C}=i;return new gs({location:"ml-tensor",type:o??"float32",mlTensor:s,dims:d,download:m,dispose:C})},J4=(s,i,o)=>new gs({location:"cpu-pinned",type:s,data:i,dims:o??[i.length]})}),Ei,Wn,$l,q4,m6=Mt(()=>{"use strict";Ei=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Wn=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),$l=!1,q4=()=>{if(!$l){$l=!0;let s=typeof BigInt64Array<"u"&&BigInt64Array.from,i=typeof BigUint64Array<"u"&&BigUint64Array.from,o=globalThis.Float16Array,d=typeof o<"u"&&o.from;s&&(Ei.set("int64",BigInt64Array),Wn.set(BigInt64Array,"int64")),i&&(Ei.set("uint64",BigUint64Array),Wn.set(BigUint64Array,"uint64")),d?(Ei.set("float16",o),Wn.set(o,"float16")):Ei.set("float16",Uint16Array)}}}),$4,eh,h6=Mt(()=>{"use strict";f2(),$4=s=>{let i=1;for(let o=0;o<s.length;o++){let d=s[o];if(typeof d!="number"||!Number.isSafeInteger(d))throw new TypeError(`dims[${o}] must be an integer, got: ${d}`);if(d<0)throw new RangeError(`dims[${o}] must be a non-negative integer, got: ${d}`);i*=d}return i},eh=(s,i)=>{switch(s.location){case"cpu":return new gs(s.type,s.data,i);case"cpu-pinned":return new gs({location:"cpu-pinned",data:s.data,type:s.type,dims:i});case"texture":return new gs({location:"texture",texture:s.texture,type:s.type,dims:i});case"gpu-buffer":return new gs({location:"gpu-buffer",gpuBuffer:s.gpuBuffer,type:s.type,dims:i});case"ml-tensor":return new gs({location:"ml-tensor",mlTensor:s.mlTensor,type:s.type,dims:i});default:throw new Error(`tensorReshape: tensor location ${s.location} is not supported`)}}}),gs,f2=Mt(()=>{"use strict";f6(),p6(),m6(),h6(),gs=class{constructor(s,i,o){q4();let d,m;if(typeof s=="object"&&"location"in s)switch(this.dataLocation=s.location,d=s.type,m=s.dims,s.location){case"cpu-pinned":{let b=Ei.get(d);if(!b)throw new TypeError(`unsupported type "${d}" to create tensor from pinned buffer`);if(!(s.data instanceof b))throw new TypeError(`buffer should be of type ${b.name}`);this.cpuData=s.data;break}case"texture":{if(d!=="float32")throw new TypeError(`unsupported type "${d}" to create tensor from texture`);this.gpuTextureData=s.texture,this.downloader=s.download,this.disposer=s.dispose;break}case"gpu-buffer":{if(d!=="float32"&&d!=="float16"&&d!=="int32"&&d!=="int64"&&d!=="uint32"&&d!=="uint8"&&d!=="bool"&&d!=="uint4"&&d!=="int4")throw new TypeError(`unsupported type "${d}" to create tensor from gpu buffer`);this.gpuBufferData=s.gpuBuffer,this.downloader=s.download,this.disposer=s.dispose;break}case"ml-tensor":{if(d!=="float32"&&d!=="float16"&&d!=="int32"&&d!=="int64"&&d!=="uint32"&&d!=="uint64"&&d!=="int8"&&d!=="uint8"&&d!=="bool"&&d!=="uint4"&&d!=="int4")throw new TypeError(`unsupported type "${d}" to create tensor from MLTensor`);this.mlTensorData=s.mlTensor,this.downloader=s.download,this.disposer=s.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let b,w;if(typeof s=="string")if(d=s,w=o,s==="string"){if(!Array.isArray(i))throw new TypeError("A string tensor's data must be a string array.");b=i}else{let M=Ei.get(s);if(M===void 0)throw new TypeError(`Unsupported tensor type: ${s}.`);if(Array.isArray(i)){if(s==="float16"&&M===Uint16Array||s==="uint4"||s==="int4")throw new TypeError(`Creating a ${s} tensor from number array is not supported. Please use ${M.name} as data.`);s==="uint64"||s==="int64"?b=M.from(i,BigInt):b=M.from(i)}else if(i instanceof M)b=i;else if(i instanceof Uint8ClampedArray)if(s==="uint8")b=Uint8Array.from(i);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(s==="float16"&&i instanceof Uint16Array&&M!==Uint16Array)b=new globalThis.Float16Array(i.buffer,i.byteOffset,i.length);else throw new TypeError(`A ${d} tensor's data must be type of ${M}`)}else if(w=i,Array.isArray(s)){if(s.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let M=typeof s[0];if(M==="string")d="string",b=s;else if(M==="boolean")d="bool",b=Uint8Array.from(s);else throw new TypeError(`Invalid element type of data array: ${M}.`)}else if(s instanceof Uint8ClampedArray)d="uint8",b=Uint8Array.from(s);else{let M=Wn.get(s.constructor);if(M===void 0)throw new TypeError(`Unsupported type for tensor data: ${s.constructor}.`);d=M,b=s}if(w===void 0)w=[b.length];else if(!Array.isArray(w))throw new TypeError("A tensor's dims must be a number array");m=w,this.cpuData=b,this.dataLocation="cpu"}let C=$4(m);if(this.cpuData&&C!==this.cpuData.length&&!((d==="uint4"||d==="int4")&&Math.ceil(C/2)===this.cpuData.length))throw new Error(`Tensor's size(${C}) does not match data length(${this.cpuData.length}).`);this.type=d,this.dims=m,this.size=C}static async fromImage(s,i){return U4(s,i)}static fromTexture(s,i){return K4(s,i)}static fromGpuBuffer(s,i){return X4(s,i)}static fromMLTensor(s,i){return Z4(s,i)}static fromPinnedBuffer(s,i,o){return J4(s,i,o)}toDataURL(s){return Y4(this,s)}toImageData(s){return H4(this,s)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(s){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let i=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=i,s&&this.disposer&&(this.disposer(),this.disposer=void 0),i}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(s){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return eh(this,s)}}}),Rs,th=Mt(()=>{"use strict";f2(),Rs=gs}),Xn,ec,js,Es,Ah=Mt(()=>{"use strict";V4(),Xn=(s,i)=>{(typeof vs.trace>"u"?!vs.wasm.trace:!vs.trace)||console.timeStamp(`${s}::ORT::${i}`)},ec=(s,i)=>{let o=new Error().stack?.split(/\r\n|\r|\n/g)||[],d=!1;for(let m=0;m<o.length;m++){if(d&&!o[m].includes("TRACE_FUNC")){let C=`FUNC_${s}::${o[m].trim().split(" ")[1]}`;i&&(C+=`::${i}`),Xn("CPU",C);return}o[m].includes("TRACE_FUNC")&&(d=!0)}},js=s=>{(typeof vs.trace>"u"?!vs.wasm.trace:!vs.trace)||ec("BEGIN",s)},Es=s=>{(typeof vs.trace>"u"?!vs.wasm.trace:!vs.trace)||ec("END",s)}}),rh,b6=Mt(()=>{"use strict";j4(),th(),Ah(),rh=class ah{constructor(i){this.handler=i}async run(i,o,d){js();let m={},C={};if(typeof i!="object"||i===null||i instanceof Rs||Array.isArray(i))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let b=!0;if(typeof o=="object"){if(o===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(o instanceof Rs)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(o)){if(o.length===0)throw new TypeError("'fetches' cannot be an empty array.");b=!1;for(let x of o){if(typeof x!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(x)===-1)throw new RangeError(`'fetches' contains invalid output name: ${x}.`);m[x]=null}if(typeof d=="object"&&d!==null)C=d;else if(typeof d<"u")throw new TypeError("'options' must be an object.")}else{let x=!1,D=Object.getOwnPropertyNames(o);for(let _ of this.outputNames)if(D.indexOf(_)!==-1){let v=o[_];(v===null||v instanceof Rs)&&(x=!0,b=!1,m[_]=v)}if(x){if(typeof d=="object"&&d!==null)C=d;else if(typeof d<"u")throw new TypeError("'options' must be an object.")}else C=o}}else if(typeof o<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let x of this.inputNames)if(typeof i[x]>"u")throw new Error(`input '${x}' is missing in 'feeds'.`);if(b)for(let x of this.outputNames)m[x]=null;let w=await this.handler.run(i,m,C),M={};for(let x in w)if(Object.hasOwnProperty.call(w,x)){let D=w[x];D instanceof Rs?M[x]=D:M[x]=new Rs(D.type,D.data,D.dims)}return Es(),M}async release(){return this.handler.dispose()}static async create(i,o,d,m){js();let C,b={};if(typeof i=="string"){if(C=i,typeof o=="object"&&o!==null)b=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(i instanceof Uint8Array){if(C=i,typeof o=="object"&&o!==null)b=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(i instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&i instanceof SharedArrayBuffer){let D=i,_=0,v=i.byteLength;if(typeof o=="object"&&o!==null)b=o;else if(typeof o=="number"){if(_=o,!Number.isSafeInteger(_))throw new RangeError("'byteOffset' must be an integer.");if(_<0||_>=D.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${D.byteLength}).`);if(v=i.byteLength-_,typeof d=="number"){if(v=d,!Number.isSafeInteger(v))throw new RangeError("'byteLength' must be an integer.");if(v<=0||_+v>D.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${D.byteLength-_}].`);if(typeof m=="object"&&m!==null)b=m;else if(typeof m<"u")throw new TypeError("'options' must be an object.")}else if(typeof d<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof o<"u")throw new TypeError("'options' must be an object.");C=new Uint8Array(D,_,v)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[w,M]=await R4(b),x=await w.createInferenceSessionHandler(C,M);return Es(),new ah(x)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),p2,C6=Mt(()=>{"use strict";b6(),p2=rh}),I6=Mt(()=>{"use strict"}),w6=Mt(()=>{"use strict"}),k6=Mt(()=>{"use strict"}),M6=Mt(()=>{"use strict"}),sh={};nn(sh,{InferenceSession:()=>p2,TRACE:()=>Xn,TRACE_FUNC_BEGIN:()=>js,TRACE_FUNC_END:()=>Es,Tensor:()=>Rs,env:()=>kr,registerBackend:()=>Bi});var Ws=Mt(()=>{"use strict";u6(),g6(),C6(),th(),I6(),w6(),Ah(),k6(),M6()}),m2=Mt(()=>{"use strict"}),oh={};nn(oh,{default:()=>ih});var tc,Ac,ih,x6=Mt(()=>{"use strict";d3(),Pi(),h2(),tc="ort-wasm-proxy-worker",Ac=globalThis.self?.name===tc,Ac&&(self.onmessage=s=>{let{type:i,in:o}=s.data;try{switch(i){case"init-wasm":b2(o.wasm).then(()=>{S2(o).then(()=>{postMessage({type:i})},d=>{postMessage({type:i,err:d})})},d=>{postMessage({type:i,err:d})});break;case"init-ep":{let{epName:d,env:m}=o;O2(m,d).then(()=>{postMessage({type:i})},C=>{postMessage({type:i,err:C})});break}case"copy-from":{let{buffer:d}=o,m=U0(d);postMessage({type:i,out:m});break}case"create":{let{model:d,options:m}=o;L2(d,m).then(C=>{postMessage({type:i,out:C})},C=>{postMessage({type:i,err:C})});break}case"release":N2(o),postMessage({type:i});break;case"run":{let{sessionId:d,inputIndices:m,inputs:C,outputIndices:b,options:w}=o;z2(d,m,C,b,new Array(b.length).fill(null),w).then(M=>{M.some(x=>x[3]!=="cpu")?postMessage({type:i,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:i,out:M},j2([...C,...M]))},M=>{postMessage({type:i,err:M})});break}case"end-profiling":R2(o),postMessage({type:i});break;default:}}catch(d){postMessage({type:i,err:d})}}),ih=Ac?null:s=>new Worker(s??ds,{type:"module",name:tc})}),nh={};nn(nh,{default:()=>lh});var rc,ac,lh,cf,v6=Mt(()=>{"use strict";ac=(rc=import.meta.url,async function(s={}){var i,o,d=s,m=new Promise((P,W)=>{i=P,o=W}),C=typeof window=="object",b=typeof WorkerGlobalScope<"u",w=b&&self.name?.startsWith("em-pthread");d.mountExternalData=(P,W)=>{P.startsWith("./")&&(P=P.substring(2)),(d.Eb||(d.Eb=new Map)).set(P,W)},d.unmountExternalData=()=>{delete d.Eb};var M=globalThis.SharedArrayBuffer??new WebAssembly.Memory({initial:0,maximum:0,pc:!0}).buffer.constructor;let x=P=>async(...W)=>{try{if(d.Fb)throw Error("Session already started");let $=d.Fb={dc:W[0],errors:[]},se=await P(...W);if(d.Fb!==$)throw Error("Session mismatch");d.Jb?.flush();let fe=$.errors;if(0<fe.length){let Pe=await Promise.all(fe);if(Pe=Pe.filter(Xe=>Xe),0<Pe.length)throw Error(Pe.join(`
`))}return se}finally{d.Fb=null}};d.jsepInit=(P,W)=>{if(P==="webgpu"){[d.Jb,d.Ub,d.Yb,d.Kb,d.Xb,d.jb,d.Zb,d.ac,d.Vb,d.Wb,d.$b]=W;let $=d.Jb;d.jsepRegisterBuffer=(se,fe,Pe,Xe)=>$.registerBuffer(se,fe,Pe,Xe),d.jsepGetBuffer=se=>$.getBuffer(se),d.jsepCreateDownloader=(se,fe,Pe)=>$.createDownloader(se,fe,Pe),d.jsepOnCreateSession=se=>{$.onCreateSession(se)},d.jsepOnReleaseSession=se=>{$.onReleaseSession(se)},d.jsepOnRunStart=se=>$.onRunStart(se),d.bc=(se,fe)=>{$.upload(se,fe)}}else if(P==="webnn"){let $=W[0];[d.nc,d.Nb,d.webnnEnsureTensor,d.Ob,d.webnnDownloadTensor]=W.slice(1),d.webnnReleaseTensorId=d.Nb,d.webnnUploadTensor=d.Ob,d.webnnOnRunStart=se=>$.onRunStart(se),d.webnnOnRunEnd=$.onRunEnd.bind($),d.webnnRegisterMLContext=(se,fe)=>{$.registerMLContext(se,fe)},d.webnnOnReleaseSession=se=>{$.onReleaseSession(se)},d.webnnCreateMLTensorDownloader=(se,fe)=>$.createMLTensorDownloader(se,fe),d.webnnRegisterMLTensor=(se,fe,Pe,Xe)=>$.registerMLTensor(se,fe,Pe,Xe),d.webnnCreateMLContext=se=>$.createMLContext(se),d.webnnRegisterMLConstant=(se,fe,Pe,Xe,gt,yt)=>$.registerMLConstant(se,fe,Pe,Xe,gt,d.Eb,yt),d.webnnRegisterGraphInput=$.registerGraphInput.bind($),d.webnnIsGraphInput=$.isGraphInput.bind($),d.webnnCreateTemporaryTensor=$.createTemporaryTensor.bind($),d.webnnIsInt64Supported=$.isInt64Supported.bind($)}};let D=()=>{let P=(W,$,se)=>(...fe)=>{let Pe=Vr,Xe=$?.();fe=W(...fe);let gt=$?.();return Xe!==gt&&(W=gt,se(Xe),$=se=null),Vr!=Pe?new Promise((yt,Vt)=>{dr={resolve:yt,reject:Vt}}):fe};(()=>{for(let W of["_OrtAppendExecutionProvider","_OrtCreateSession","_OrtRun","_OrtRunWithBinding","_OrtBindInput"])d[W]=P(d[W],()=>d[W],$=>d[W]=$)})(),x!==void 0&&(d._OrtRun=x(d._OrtRun),d._OrtRunWithBinding=x(d._OrtRunWithBinding)),D=void 0};d.asyncInit=()=>{D?.()};var _,v,Q=Object.assign({},d),F=(P,W)=>{throw W},j="";(C||b)&&(b?j=self.location.href:typeof document<"u"&&document.currentScript&&(j=document.currentScript.src),rc&&(j=rc),j=j.startsWith("blob:")?"":j.slice(0,j.replace(/[?#].*/,"").lastIndexOf("/")+1),b&&(v=P=>{var W=new XMLHttpRequest;return W.open("GET",P,!1),W.responseType="arraybuffer",W.send(null),new Uint8Array(W.response)}),_=async P=>{if(Ge(P))return new Promise(($,se)=>{var fe=new XMLHttpRequest;fe.open("GET",P,!0),fe.responseType="arraybuffer",fe.onload=()=>{fe.status==200||fe.status==0&&fe.response?$(fe.response):se(fe.status)},fe.onerror=se,fe.send(null)});var W=await fetch(P,{credentials:"same-origin"});if(W.ok)return W.arrayBuffer();throw Error(W.status+" : "+W.url)});var X=console.log.bind(console),R=console.error.bind(console),L=X,K=R;Object.assign(d,Q),Q=null;var g,k,e,u,B,q,y,S,ge,Ae,me,Me,Ie,_e=d.wasmBinary,ye=!1,Ge=P=>P.startsWith("file://");function qe(){return g.buffer!=u.buffer&&He(),u}function xe(){return g.buffer!=u.buffer&&He(),B}function Ce(){return g.buffer!=u.buffer&&He(),q}function ie(){return g.buffer!=u.buffer&&He(),y}function ae(){return g.buffer!=u.buffer&&He(),S}function Ee(){return g.buffer!=u.buffer&&He(),ge}function Le(){return g.buffer!=u.buffer&&He(),Ae}function At(){return g.buffer!=u.buffer&&He(),Ie}if(w){let P=function(W){try{var $=W.data,se=$.Bb;if(se==="load"){let fe=[];self.onmessage=Pe=>fe.push(Pe),self.startWorker=()=>{postMessage({Bb:"loaded"});for(let Pe of fe)P(Pe);self.onmessage=P};for(let Pe of $.Rb)d[Pe]&&!d[Pe].proxy||(d[Pe]=(...Xe)=>{postMessage({Bb:"callHandler",Qb:Pe,args:Xe})},Pe=="print"&&(L=d[Pe]),Pe=="printErr"&&(K=d[Pe]));g=$.kc,He(),ft($.lc)}else if(se==="run"){ps($.Ab),Ea($.Ab,0,0,1,0,0),uA(),Re($.Ab),St||(Er(),St=!0);try{Da($.fc,$.Hb)}catch(fe){if(fe!="unwind")throw fe}}else $.target!=="setimmediate"&&(se==="checkMailbox"?St&&tt():se&&(K(`worker: received unknown command ${se}`),K($)))}catch(fe){throw lo(),fe}};var at=P,ft,St=!1;K=function(...W){W=W.join(" "),console.error(W)},self.alert=function(...W){postMessage({Bb:"alert",text:W.join(" "),ic:ys()})},self.onunhandledrejection=W=>{throw W.reason||W},self.onmessage=P}function He(){var P=g.buffer;d.HEAP8=u=new Int8Array(P),d.HEAP16=q=new Int16Array(P),d.HEAPU8=B=new Uint8Array(P),d.HEAPU16=y=new Uint16Array(P),d.HEAP32=S=new Int32Array(P),d.HEAPU32=ge=new Uint32Array(P),d.HEAPF32=Ae=new Float32Array(P),d.HEAPF64=Ie=new Float64Array(P),d.HEAP64=me=new BigInt64Array(P),d.HEAPU64=Me=new BigUint64Array(P)}function ee(){w?startWorker(d):Kt.Ca()}w||(g=new WebAssembly.Memory({initial:256,maximum:65536,shared:!0}),He());var Qe,Ve=0,Ue=null;function ot(){if(--Ve==0&&Ue){var P=Ue;Ue=null,P()}}function Ke(P){throw K(P="Aborted("+P+")"),ye=!0,P=new WebAssembly.RuntimeError(P+". Build with -sASSERTIONS for more info."),o(P),P}function H(){return{a:{L:le,Aa:We,b:ta,$:EA,A:Wa,pa:ba,X:Y,Z:de,qa:oe,na:he,ga:ve,ma:Se,J:Ze,Y:Ft,V:Ut,oa:Bt,W:iA,va:_A,E:Va,Q:ms,O:ts,D:Sa,u:Qr,r:dt,P:kt,z:Z,R:pe,ja:we,T:Dt,aa:et,M:xt,F:wA,ia:Re,sa:nA,t:br,Ba:cr,w:xa,o:pr,l:Sr,c:oa,n:rs,j:Bo,v:Ai,p:as,f:Vs,s:Or,m:Gt,e:ga,k:yo,i:ss,g:ri,d:ai,da:si,ea:OA,fa:Po,ba:ro,ca:os,N:Ys,xa:oi,ua:Go,h:ii,C:Qt,G:so,ta:ws,x:oo,ra:Zr,U:ia,q:Oa,y:Hs,K:Us,S:io,za:Ks,ya:Ms,ka:Et,la:Pa,_:Zt,B:Fo,I:Qo,ha:_s,H:So,a:g,wa:It}}}var $e={829644:(P,W,$,se,fe)=>{if(d===void 0||!d.Eb)return 1;if((P=RA(Number(P>>>0))).startsWith("./")&&(P=P.substring(2)),!(P=d.Eb.get(P)))return 2;if(W=Number(W>>>0),$=Number($>>>0),se=Number(se>>>0),W+$>P.byteLength)return 3;try{let Pe=P.subarray(W,W+$);switch(fe){case 0:xe().set(Pe,se>>>0);break;case 1:d.mc?d.mc(se,Pe):d.bc(se,Pe);break;default:return 4}return 0}catch{return 4}},830468:(P,W,$)=>{d.Ob(P,xe().subarray(W>>>0,W+$>>>0))},830532:()=>d.nc(),830574:P=>{d.Nb(P)},830611:()=>{d.Vb()},830642:()=>{d.Wb()},830671:()=>{d.$b()},830696:P=>d.Ub(P),830729:P=>d.Yb(P),830761:(P,W,$)=>{d.Kb(Number(P),Number(W),Number($),!0)},830824:(P,W,$)=>{d.Kb(Number(P),Number(W),Number($))},830881:()=>typeof wasmOffsetConverter<"u",830938:P=>{d.jb("Abs",P,void 0)},830989:P=>{d.jb("Neg",P,void 0)},831040:P=>{d.jb("Floor",P,void 0)},831093:P=>{d.jb("Ceil",P,void 0)},831145:P=>{d.jb("Reciprocal",P,void 0)},831203:P=>{d.jb("Sqrt",P,void 0)},831255:P=>{d.jb("Exp",P,void 0)},831306:P=>{d.jb("Erf",P,void 0)},831357:P=>{d.jb("Sigmoid",P,void 0)},831412:(P,W,$)=>{d.jb("HardSigmoid",P,{alpha:W,beta:$})},831491:P=>{d.jb("Log",P,void 0)},831542:P=>{d.jb("Sin",P,void 0)},831593:P=>{d.jb("Cos",P,void 0)},831644:P=>{d.jb("Tan",P,void 0)},831695:P=>{d.jb("Asin",P,void 0)},831747:P=>{d.jb("Acos",P,void 0)},831799:P=>{d.jb("Atan",P,void 0)},831851:P=>{d.jb("Sinh",P,void 0)},831903:P=>{d.jb("Cosh",P,void 0)},831955:P=>{d.jb("Asinh",P,void 0)},832008:P=>{d.jb("Acosh",P,void 0)},832061:P=>{d.jb("Atanh",P,void 0)},832114:P=>{d.jb("Tanh",P,void 0)},832166:P=>{d.jb("Not",P,void 0)},832217:(P,W,$)=>{d.jb("Clip",P,{min:W,max:$})},832286:P=>{d.jb("Clip",P,void 0)},832338:(P,W)=>{d.jb("Elu",P,{alpha:W})},832396:P=>{d.jb("Gelu",P,void 0)},832448:P=>{d.jb("Relu",P,void 0)},832500:(P,W)=>{d.jb("LeakyRelu",P,{alpha:W})},832564:(P,W)=>{d.jb("ThresholdedRelu",P,{alpha:W})},832634:(P,W)=>{d.jb("Cast",P,{to:W})},832692:P=>{d.jb("Add",P,void 0)},832743:P=>{d.jb("Sub",P,void 0)},832794:P=>{d.jb("Mul",P,void 0)},832845:P=>{d.jb("Div",P,void 0)},832896:P=>{d.jb("Pow",P,void 0)},832947:P=>{d.jb("Equal",P,void 0)},833e3:P=>{d.jb("Greater",P,void 0)},833055:P=>{d.jb("GreaterOrEqual",P,void 0)},833117:P=>{d.jb("Less",P,void 0)},833169:P=>{d.jb("LessOrEqual",P,void 0)},833228:(P,W,$,se,fe)=>{d.jb("ReduceMean",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},833403:(P,W,$,se,fe)=>{d.jb("ReduceMax",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},833577:(P,W,$,se,fe)=>{d.jb("ReduceMin",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},833751:(P,W,$,se,fe)=>{d.jb("ReduceProd",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},833926:(P,W,$,se,fe)=>{d.jb("ReduceSum",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834100:(P,W,$,se,fe)=>{d.jb("ReduceL1",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834273:(P,W,$,se,fe)=>{d.jb("ReduceL2",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834446:(P,W,$,se,fe)=>{d.jb("ReduceLogSum",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834623:(P,W,$,se,fe)=>{d.jb("ReduceSumSquare",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834803:(P,W,$,se,fe)=>{d.jb("ReduceLogSumExp",P,{keepDims:!!W,noopWithEmptyAxes:!!$,axes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},834983:P=>{d.jb("Where",P,void 0)},835036:(P,W,$)=>{d.jb("Transpose",P,{perm:W?Array.from(ae().subarray(Number(W)>>>0,Number($)>>>0)):[]})},835160:(P,W,$,se)=>{d.jb("DepthToSpace",P,{blocksize:W,mode:RA($),format:se?"NHWC":"NCHW"})},835293:(P,W,$,se)=>{d.jb("DepthToSpace",P,{blocksize:W,mode:RA($),format:se?"NHWC":"NCHW"})},835426:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA,is)=>{d.jb("ConvTranspose",P,{format:yt?"NHWC":"NCHW",autoPad:W,dilations:[$],group:se,kernelShape:[fe],pads:[Pe,Xe],strides:[gt],wIsConst:()=>!!qe()[Vt>>>0],outputPadding:cA?Array.from(ae().subarray(Number(cA)>>>0,Number(bA)>>>0)):[],outputShape:QA?Array.from(ae().subarray(Number(QA)>>>0,Number(BA)>>>0)):[],activation:RA(is)})},835859:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("ConvTranspose",P,{format:gt?"NHWC":"NCHW",autoPad:W,dilations:Array.from(ae().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),group:se,kernelShape:Array.from(ae().subarray(Number(fe)>>>0,2+(Number(fe)>>>0)>>>0)),pads:Array.from(ae().subarray(Number(Pe)>>>0,4+(Number(Pe)>>>0)>>>0)),strides:Array.from(ae().subarray(Number(Xe)>>>0,2+(Number(Xe)>>>0)>>>0)),wIsConst:()=>!!qe()[yt>>>0],outputPadding:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],outputShape:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[],activation:RA(BA)})},836520:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA,is)=>{d.jb("ConvTranspose",P,{format:yt?"NHWC":"NCHW",autoPad:W,dilations:[$],group:se,kernelShape:[fe],pads:[Pe,Xe],strides:[gt],wIsConst:()=>!!qe()[Vt>>>0],outputPadding:cA?Array.from(ae().subarray(Number(cA)>>>0,Number(bA)>>>0)):[],outputShape:QA?Array.from(ae().subarray(Number(QA)>>>0,Number(BA)>>>0)):[],activation:RA(is)})},836953:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("ConvTranspose",P,{format:gt?"NHWC":"NCHW",autoPad:W,dilations:Array.from(ae().subarray(Number($)>>>0,2+(Number($)>>>0)>>>0)),group:se,kernelShape:Array.from(ae().subarray(Number(fe)>>>0,2+(Number(fe)>>>0)>>>0)),pads:Array.from(ae().subarray(Number(Pe)>>>0,4+(Number(Pe)>>>0)>>>0)),strides:Array.from(ae().subarray(Number(Xe)>>>0,2+(Number(Xe)>>>0)>>>0)),wIsConst:()=>!!qe()[yt>>>0],outputPadding:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],outputShape:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[],activation:RA(BA)})},837614:(P,W)=>{d.jb("GlobalAveragePool",P,{format:W?"NHWC":"NCHW"})},837705:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("AveragePool",P,{format:BA?"NHWC":"NCHW",auto_pad:W,ceil_mode:$,count_include_pad:se,storage_order:fe,dilations:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[],kernel_shape:gt?Array.from(ae().subarray(Number(gt)>>>0,Number(yt)>>>0)):[],pads:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],strides:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[]})},838184:(P,W)=>{d.jb("GlobalAveragePool",P,{format:W?"NHWC":"NCHW"})},838275:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("AveragePool",P,{format:BA?"NHWC":"NCHW",auto_pad:W,ceil_mode:$,count_include_pad:se,storage_order:fe,dilations:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[],kernel_shape:gt?Array.from(ae().subarray(Number(gt)>>>0,Number(yt)>>>0)):[],pads:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],strides:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[]})},838754:(P,W)=>{d.jb("GlobalMaxPool",P,{format:W?"NHWC":"NCHW"})},838841:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("MaxPool",P,{format:BA?"NHWC":"NCHW",auto_pad:W,ceil_mode:$,count_include_pad:se,storage_order:fe,dilations:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[],kernel_shape:gt?Array.from(ae().subarray(Number(gt)>>>0,Number(yt)>>>0)):[],pads:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],strides:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[]})},839316:(P,W)=>{d.jb("GlobalMaxPool",P,{format:W?"NHWC":"NCHW"})},839403:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA)=>{d.jb("MaxPool",P,{format:BA?"NHWC":"NCHW",auto_pad:W,ceil_mode:$,count_include_pad:se,storage_order:fe,dilations:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[],kernel_shape:gt?Array.from(ae().subarray(Number(gt)>>>0,Number(yt)>>>0)):[],pads:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],strides:bA?Array.from(ae().subarray(Number(bA)>>>0,Number(QA)>>>0)):[]})},839878:(P,W,$,se,fe)=>{d.jb("Gemm",P,{alpha:W,beta:$,transA:se,transB:fe})},839982:P=>{d.jb("MatMul",P,void 0)},840036:(P,W,$,se)=>{d.jb("ArgMax",P,{keepDims:!!W,selectLastIndex:!!$,axis:se})},840144:(P,W,$,se)=>{d.jb("ArgMin",P,{keepDims:!!W,selectLastIndex:!!$,axis:se})},840252:(P,W)=>{d.jb("Softmax",P,{axis:W})},840315:(P,W)=>{d.jb("Concat",P,{axis:W})},840375:(P,W,$,se,fe)=>{d.jb("Split",P,{axis:W,numOutputs:$,splitSizes:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},840531:P=>{d.jb("Expand",P,void 0)},840585:(P,W)=>{d.jb("Gather",P,{axis:Number(W)})},840656:(P,W)=>{d.jb("GatherElements",P,{axis:Number(W)})},840735:(P,W)=>{d.jb("GatherND",P,{batch_dims:Number(W)})},840814:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA)=>{d.jb("Resize",P,{antialias:W,axes:$?Array.from(ae().subarray(Number($)>>>0,Number(se)>>>0)):[],coordinateTransformMode:RA(fe),cubicCoeffA:Pe,excludeOutside:Xe,extrapolationValue:gt,keepAspectRatioPolicy:RA(yt),mode:RA(Vt),nearestMode:RA(cA)})},841176:(P,W,$,se,fe,Pe,Xe)=>{d.jb("Slice",P,{starts:W?Array.from(ae().subarray(Number(W)>>>0,Number($)>>>0)):[],ends:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[],axes:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[]})},841440:P=>{d.jb("Tile",P,void 0)},841492:(P,W,$)=>{d.jb("InstanceNormalization",P,{epsilon:W,format:$?"NHWC":"NCHW"})},841606:(P,W,$)=>{d.jb("InstanceNormalization",P,{epsilon:W,format:$?"NHWC":"NCHW"})},841720:P=>{d.jb("Range",P,void 0)},841773:(P,W)=>{d.jb("Einsum",P,{equation:RA(W)})},841854:(P,W,$,se,fe)=>{d.jb("Pad",P,{mode:W,value:$,pads:se?Array.from(ae().subarray(Number(se)>>>0,Number(fe)>>>0)):[]})},841997:(P,W,$,se,fe,Pe)=>{d.jb("BatchNormalization",P,{epsilon:W,momentum:$,spatial:!!fe,trainingMode:!!se,format:Pe?"NHWC":"NCHW"})},842166:(P,W,$,se,fe,Pe)=>{d.jb("BatchNormalization",P,{epsilon:W,momentum:$,spatial:!!fe,trainingMode:!!se,format:Pe?"NHWC":"NCHW"})},842335:(P,W,$)=>{d.jb("CumSum",P,{exclusive:Number(W),reverse:Number($)})},842432:(P,W,$)=>{d.jb("DequantizeLinear",P,{axis:W,blockSize:$})},842522:(P,W,$,se,fe)=>{d.jb("GridSample",P,{align_corners:W,mode:RA($),padding_mode:RA(se),format:fe?"NHWC":"NCHW"})},842692:(P,W,$,se,fe)=>{d.jb("GridSample",P,{align_corners:W,mode:RA($),padding_mode:RA(se),format:fe?"NHWC":"NCHW"})},842862:(P,W)=>{d.jb("ScatterND",P,{reduction:RA(W)})},842947:(P,W,$,se,fe,Pe,Xe,gt,yt)=>{d.jb("Attention",P,{numHeads:W,isUnidirectional:$,maskFilterValue:se,scale:fe,doRotary:Pe,qkvHiddenSizes:Xe?Array.from(ae().subarray(Number(gt)>>>0,Number(gt)+Xe>>>0)):[],pastPresentShareBuffer:!!yt})},843219:P=>{d.jb("BiasAdd",P,void 0)},843274:P=>{d.jb("BiasSplitGelu",P,void 0)},843335:P=>{d.jb("FastGelu",P,void 0)},843391:(P,W,$,se,fe,Pe,Xe,gt,yt,Vt,cA,bA,QA,BA,is,fo)=>{d.jb("Conv",P,{format:bA?"NHWC":"NCHW",auto_pad:W,dilations:$?Array.from(ae().subarray(Number($)>>>0,Number(se)>>>0)):[],group:fe,kernel_shape:Pe?Array.from(ae().subarray(Number(Pe)>>>0,Number(Xe)>>>0)):[],pads:gt?Array.from(ae().subarray(Number(gt)>>>0,Number(yt)>>>0)):[],strides:Vt?Array.from(ae().subarray(Number(Vt)>>>0,Number(cA)>>>0)):[],w_is_const:()=>!!qe()[Number(QA)>>>0],activation:RA(BA),activation_params:is?Array.from(Le().subarray(Number(is)>>>0,Number(fo)>>>0)):[]})},843975:P=>{d.jb("Gelu",P,void 0)},844027:(P,W,$,se,fe,Pe,Xe,gt,yt)=>{d.jb("GroupQueryAttention",P,{numHeads:W,kvNumHeads:$,scale:se,softcap:fe,doRotary:Pe,rotaryInterleaved:Xe,smoothSoftmax:gt,localWindowSize:yt})},844244:(P,W,$,se)=>{d.jb("LayerNormalization",P,{axis:W,epsilon:$,simplified:!!se})},844355:(P,W,$,se)=>{d.jb("LayerNormalization",P,{axis:W,epsilon:$,simplified:!!se})},844466:(P,W,$,se,fe,Pe)=>{d.jb("MatMulNBits",P,{k:W,n:$,accuracyLevel:se,bits:fe,blockSize:Pe})},844593:(P,W,$,se,fe,Pe)=>{d.jb("MultiHeadAttention",P,{numHeads:W,isUnidirectional:$,maskFilterValue:se,scale:fe,doRotary:Pe})},844752:(P,W)=>{d.jb("QuickGelu",P,{alpha:W})},844816:(P,W,$,se,fe)=>{d.jb("RotaryEmbedding",P,{interleaved:!!W,numHeads:$,rotaryEmbeddingDim:se,scale:fe})},844955:(P,W,$)=>{d.jb("SkipLayerNormalization",P,{epsilon:W,simplified:!!$})},845057:(P,W,$)=>{d.jb("SkipLayerNormalization",P,{epsilon:W,simplified:!!$})},845159:(P,W,$,se)=>{d.jb("GatherBlockQuantized",P,{gatherAxis:W,quantizeAxis:$,blockSize:se})},845280:P=>{d.Zb(P)},845314:(P,W)=>d.ac(Number(P),Number(W),d.Fb.dc,d.Fb.errors)};function We(P,W,$){return Cr(async()=>{await d.Xb(Number(P),Number(W),Number($))})}function le(){return typeof wasmOffsetConverter<"u"}class Ct{name="ExitStatus";constructor(W){this.message=`Program terminated with exit(${W})`,this.status=W}}var it=P=>{P.terminate(),P.onmessage=()=>{}},pt=[],ht=P=>{wt.length==0&&($a(),jr(wt[0]));var W=wt.pop();if(!W)return 6;Tt.push(W),fA[P.Ab]=W,W.Ab=P.Ab;var $={Bb:"run",fc:P.ec,Hb:P.Hb,Ab:P.Ab};return W.postMessage($,P.Mb),0},Lt=0,nt=(P,W,...$)=>{for(var se=2*$.length,fe=uo(),Pe=Ts(8*se),Xe=Pe>>>3,gt=0;gt<$.length;gt++){var yt=$[gt];typeof yt=="bigint"?(me[Xe+2*gt]=1n,me[Xe+2*gt+1]=yt):(me[Xe+2*gt]=0n,At()[Xe+2*gt+1>>>0]=yt)}return P=La(P,0,se,Pe,W),Ds(fe),P};function It(P){if(w)return nt(0,1,P);if(e=P,!(0<Lt)){for(var W of Tt)it(W);for(W of wt)it(W);wt=[],Tt=[],fA={},ye=!0}F(0,new Ct(P))}function ct(P){if(w)return nt(1,0,P);Zt(P)}var Zt=P=>{if(e=P,w)throw ct(P),"unwind";It(P)},wt=[],Tt=[],tA=[],fA={},Dr=P=>{var W=P.Ab;delete fA[W],wt.push(P),Tt.splice(Tt.indexOf(P),1),P.Ab=0,co(W)};function uA(){tA.forEach(P=>P())}var jr=P=>new Promise(W=>{P.onmessage=fe=>{var Pe=(fe=fe.data).Bb;if(fe.Gb&&fe.Gb!=ys()){var Xe=fA[fe.Gb];Xe?Xe.postMessage(fe,fe.Mb):K(`Internal error! Worker sent a message "${Pe}" to target pthread ${fe.Gb}, but that thread no longer exists!`)}else Pe==="checkMailbox"?tt():Pe==="spawnThread"?ht(fe):Pe==="cleanupThread"?Dr(fA[fe.hc]):Pe==="loaded"?(P.loaded=!0,W(P)):Pe==="alert"?alert(`Thread ${fe.ic}: ${fe.text}`):fe.target==="setimmediate"?P.postMessage(fe):Pe==="callHandler"?d[fe.Qb](...fe.args):Pe&&K(`worker sent an unknown command ${Pe}`)},P.onerror=fe=>{throw K(`worker sent an error! ${fe.filename}:${fe.lineno}: ${fe.message}`),fe};var $,se=[];for($ of[])d.propertyIsEnumerable($)&&se.push($);P.postMessage({Bb:"load",Rb:se,kc:g,lc:k})});function $a(){var P=new Worker((()=>{let W=URL;return import.meta.url>"file:"&&import.meta.url<"file;"?new W("ort.bundle.min.mjs",import.meta.url):new URL(import.meta.url)})(),{type:"module",workerData:"em-pthread",name:"em-pthread"});wt.push(P)}var ps=P=>{He();var W=Ee()[P+52>>>2>>>0];P=Ee()[P+56>>>2>>>0],Na(W,W-P),Ds(W)},Da=(P,W)=>{Lt=0,P=go(P,W),0<Lt?e=P:Pr(P)};class hr{constructor(W){this.Ib=W-24}}function ta(P,W,$){var se=new hr(P>>>=0);throw W>>>=0,$>>>=0,Ee()[se.Ib+16>>>2>>>0]=0,Ee()[se.Ib+4>>>2>>>0]=W,Ee()[se.Ib+8>>>2>>>0]=$,P}function Ta(P,W,$,se){return w?nt(2,1,P,W,$,se):EA(P,W,$,se)}function EA(P,W,$,se){if(P>>>=0,$>>>=0,se>>>=0,M===void 0)return 6;var fe=[];return w&&fe.length===0?Ta(P,W>>>=0,$,se):(P={ec:$,Ab:P,Hb:se,Mb:fe},w?(P.Bb="spawnThread",postMessage(P,fe),0):ht(P))}var Ht=typeof TextDecoder<"u"?new TextDecoder:void 0,es=(P,W=0,$=NaN)=>{var se=(W>>>=0)+$;for($=W;P[$]&&!($>=se);)++$;if(16<$-W&&P.buffer&&Ht)return Ht.decode(P.buffer instanceof ArrayBuffer?P.subarray(W,$):P.slice(W,$));for(se="";W<$;){var fe=P[W++];if(128&fe){var Pe=63&P[W++];if((224&fe)==192)se+=String.fromCharCode((31&fe)<<6|Pe);else{var Xe=63&P[W++];65536>(fe=(240&fe)==224?(15&fe)<<12|Pe<<6|Xe:(7&fe)<<18|Pe<<12|Xe<<6|63&P[W++])?se+=String.fromCharCode(fe):(fe-=65536,se+=String.fromCharCode(55296|fe>>10,56320|1023&fe))}}else se+=String.fromCharCode(fe)}return se},RA=(P,W)=>(P>>>=0)?es(xe(),P,W):"";function Wa(P,W,$){return w?nt(3,1,P,W,$):0}function ba(P,W){if(w)return nt(4,1,P,W)}var pA=P=>{for(var W=0,$=0;$<P.length;++$){var se=P.charCodeAt($);127>=se?W++:2047>=se?W+=2:55296<=se&&57343>=se?(W+=4,++$):W+=3}return W},Ca=(P,W,$)=>{var se=xe();if(W>>>=0,0<$){var fe=W;$=W+$-1;for(var Pe=0;Pe<P.length;++Pe){var Xe=P.charCodeAt(Pe);if(55296<=Xe&&57343>=Xe&&(Xe=65536+((1023&Xe)<<10)|1023&P.charCodeAt(++Pe)),127>=Xe){if(W>=$)break;se[W++>>>0]=Xe}else{if(2047>=Xe){if(W+1>=$)break;se[W++>>>0]=192|Xe>>6}else{if(65535>=Xe){if(W+2>=$)break;se[W++>>>0]=224|Xe>>12}else{if(W+3>=$)break;se[W++>>>0]=240|Xe>>18,se[W++>>>0]=128|Xe>>12&63}se[W++>>>0]=128|Xe>>6&63}se[W++>>>0]=128|63&Xe}}se[W>>>0]=0,P=W-fe}else P=0;return P};function Y(P,W){if(w)return nt(5,1,P,W)}function de(P,W,$){if(w)return nt(6,1,P,W,$)}function oe(P,W,$){return w?nt(7,1,P,W,$):0}function he(P,W){if(w)return nt(8,1,P,W)}function ve(P,W,$){if(w)return nt(9,1,P,W,$)}function Se(P,W,$,se){if(w)return nt(10,1,P,W,$,se)}function Ze(P,W,$,se){if(w)return nt(11,1,P,W,$,se)}function Ft(P,W,$,se){if(w)return nt(12,1,P,W,$,se)}function Ut(P){if(w)return nt(13,1,P)}function Bt(P,W){if(w)return nt(14,1,P,W)}function iA(P,W,$){if(w)return nt(15,1,P,W,$)}var Pt,oA,_A=()=>Ke(""),qA=P=>{for(var W="";xe()[P>>>0];)W+=Pt[xe()[P++>>>0]];return W},Mr={},Aa={},xr={};function Xr(P,W,$={}){return(function(se,fe,Pe={}){var Xe=fe.name;if(!se)throw new oA(`type "${Xe}" must have a positive integer typeid pointer`);if(Aa.hasOwnProperty(se)){if(Pe.Sb)return;throw new oA(`Cannot register type '${Xe}' twice`)}Aa[se]=fe,delete xr[se],Mr.hasOwnProperty(se)&&(fe=Mr[se],delete Mr[se],fe.forEach(gt=>gt()))})(P,W,$)}var or=(P,W,$)=>{switch(W){case 1:return $?se=>qe()[se>>>0]:se=>xe()[se>>>0];case 2:return $?se=>Ce()[se>>>1>>>0]:se=>ie()[se>>>1>>>0];case 4:return $?se=>ae()[se>>>2>>>0]:se=>Ee()[se>>>2>>>0];case 8:return $?se=>me[se>>>3]:se=>Me[se>>>3];default:throw new TypeError(`invalid integer width (${W}): ${P}`)}};function Va(P,W,$){$>>>=0,Xr(P>>>=0,{name:W=qA(W>>>0),fromWireType:se=>se,toWireType:function(se,fe){if(typeof fe!="bigint"&&typeof fe!="number")throw fe=fe===null?"null":(se=typeof fe)=="object"||se==="array"||se==="function"?fe.toString():""+fe,new TypeError(`Cannot convert "${fe}" to ${this.name}`);return typeof fe=="number"&&(fe=BigInt(fe)),fe},Cb:vr,readValueFromPointer:or(W,$,W.indexOf("u")==-1),Db:null})}var vr=8;function ms(P,W,$,se){Xr(P>>>=0,{name:W=qA(W>>>0),fromWireType:function(fe){return!!fe},toWireType:function(fe,Pe){return Pe?$:se},Cb:vr,readValueFromPointer:function(fe){return this.fromWireType(xe()[fe>>>0])},Db:null})}var ka=[],sa=[];function oa(P){9<(P>>>=0)&&--sa[P+1]==0&&(sa[P]=void 0,ka.push(P))}var lr=P=>{if(!P)throw new oA("Cannot use deleted val. handle = "+P);return sa[P]},Nt=P=>{switch(P){case void 0:return 2;case null:return 4;case!0:return 6;case!1:return 8;default:let W=ka.pop()||sa.length;return sa[W]=P,sa[W+1]=1,W}};function Wr(P){return this.fromWireType(Ee()[P>>>2>>>0])}var da={name:"emscripten::val",fromWireType:P=>{var W=lr(P);return oa(P),W},toWireType:(P,W)=>Nt(W),Cb:vr,readValueFromPointer:Wr,Db:null};function ts(P){return Xr(P>>>0,da)}var Ya=(P,W)=>{switch(W){case 4:return function($){return this.fromWireType(Le()[$>>>2>>>0])};case 8:return function($){return this.fromWireType(At()[$>>>3>>>0])};default:throw new TypeError(`invalid float width (${W}): ${P}`)}};function Sa(P,W,$){$>>>=0,Xr(P>>>=0,{name:W=qA(W>>>0),fromWireType:se=>se,toWireType:(se,fe)=>fe,Cb:vr,readValueFromPointer:Ya(W,$),Db:null})}function Qr(P,W,$,se,fe){if(P>>>=0,$>>>=0,W=qA(W>>>0),fe===-1&&(fe=4294967295),fe=gt=>gt,se===0){var Pe=32-8*$;fe=gt=>gt<<Pe>>>Pe}var Xe=W.includes("unsigned")?function(gt,yt){return yt>>>0}:function(gt,yt){return yt};Xr(P,{name:W,fromWireType:fe,toWireType:Xe,Cb:vr,readValueFromPointer:or(W,$,se!==0),Db:null})}function dt(P,W,$){function se(Pe){var Xe=Ee()[Pe>>>2>>>0];return Pe=Ee()[Pe+4>>>2>>>0],new fe(qe().buffer,Pe,Xe)}var fe=[Int8Array,Uint8Array,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array,BigInt64Array,BigUint64Array][W];Xr(P>>>=0,{name:$=qA($>>>0),fromWireType:se,Cb:vr,readValueFromPointer:se},{Sb:!0})}function kt(P,W){Xr(P>>>=0,{name:W=qA(W>>>0),fromWireType:function($){for(var se,fe=Ee()[$>>>2>>>0],Pe=$+4,Xe=Pe,gt=0;gt<=fe;++gt){var yt=Pe+gt;gt!=fe&&xe()[yt>>>0]!=0||(Xe=RA(Xe,yt-Xe),se===void 0?se=Xe:(se+="\0",se+=Xe),Xe=yt+1)}return Ga($),se},toWireType:function($,se){se instanceof ArrayBuffer&&(se=new Uint8Array(se));var fe=typeof se=="string";if(!(fe||se instanceof Uint8Array||se instanceof Uint8ClampedArray||se instanceof Int8Array))throw new oA("Cannot pass non-string to std::string");var Pe=fe?pA(se):se.length,Xe=AA(4+Pe+1),gt=Xe+4;if(Ee()[Xe>>>2>>>0]=Pe,fe)Ca(se,gt,Pe+1);else if(fe)for(fe=0;fe<Pe;++fe){var yt=se.charCodeAt(fe);if(255<yt)throw Ga(Xe),new oA("String has UTF-16 code units that do not fit in 8 bits");xe()[gt+fe>>>0]=yt}else for(fe=0;fe<Pe;++fe)xe()[gt+fe>>>0]=se[fe];return $!==null&&$.push(Ga,Xe),Xe},Cb:vr,readValueFromPointer:Wr,Db($){Ga($)}})}var zt=typeof TextDecoder<"u"?new TextDecoder("utf-16le"):void 0,VA=(P,W)=>{for(var $=P>>1,se=$+W/2;!($>=se)&&ie()[$>>>0];)++$;if(32<($<<=1)-P&&zt)return zt.decode(xe().slice(P,$));for($="",se=0;!(se>=W/2);++se){var fe=Ce()[P+2*se>>>1>>>0];if(fe==0)break;$+=String.fromCharCode(fe)}return $},hs=(P,W,$)=>{if($??=2147483647,2>$)return 0;var se=W;$=($-=2)<2*P.length?$/2:P.length;for(var fe=0;fe<$;++fe){var Pe=P.charCodeAt(fe);Ce()[W>>>1>>>0]=Pe,W+=2}return Ce()[W>>>1>>>0]=0,W-se},As=P=>2*P.length,Ha=(P,W)=>{for(var $=0,se="";!($>=W/4);){var fe=ae()[P+4*$>>>2>>>0];if(fe==0)break;++$,65536<=fe?(fe-=65536,se+=String.fromCharCode(55296|fe>>10,56320|1023&fe)):se+=String.fromCharCode(fe)}return se},Ao=(P,W,$)=>{if(W>>>=0,$??=2147483647,4>$)return 0;var se=W;$=se+$-4;for(var fe=0;fe<P.length;++fe){var Pe=P.charCodeAt(fe);if(55296<=Pe&&57343>=Pe&&(Pe=65536+((1023&Pe)<<10)|1023&P.charCodeAt(++fe)),ae()[W>>>2>>>0]=Pe,(W+=4)+4>$)break}return ae()[W>>>2>>>0]=0,W-se},Oe=P=>{for(var W=0,$=0;$<P.length;++$){var se=P.charCodeAt($);55296<=se&&57343>=se&&++$,W+=4}return W};function Z(P,W,$){if(P>>>=0,W>>>=0,$=qA($>>>=0),W===2)var se=VA,fe=hs,Pe=As,Xe=gt=>ie()[gt>>>1>>>0];else W===4&&(se=Ha,fe=Ao,Pe=Oe,Xe=gt=>Ee()[gt>>>2>>>0]);Xr(P,{name:$,fromWireType:gt=>{for(var yt,Vt=Ee()[gt>>>2>>>0],cA=gt+4,bA=0;bA<=Vt;++bA){var QA=gt+4+bA*W;bA!=Vt&&Xe(QA)!=0||(cA=se(cA,QA-cA),yt===void 0?yt=cA:(yt+="\0",yt+=cA),cA=QA+W)}return Ga(gt),yt},toWireType:(gt,yt)=>{if(typeof yt!="string")throw new oA(`Cannot pass non-string to C++ string type ${$}`);var Vt=Pe(yt),cA=AA(4+Vt+W);return Ee()[cA>>>2>>>0]=Vt/W,fe(yt,cA+4,Vt+W),gt!==null&&gt.push(Ga,cA),cA},Cb:vr,readValueFromPointer:Wr,Db(gt){Ga(gt)}})}function pe(P,W){Xr(P>>>=0,{Tb:!0,name:W=qA(W>>>0),Cb:0,fromWireType:()=>{},toWireType:()=>{}})}function we(P){Ea(P>>>0,!b,1,!C,131072,!1),uA()}var Be=P=>{if(!ye)try{if(P(),!(0<Lt))try{w?Pr(e):Zt(e)}catch(W){W instanceof Ct||W=="unwind"||F(0,W)}}catch(W){W instanceof Ct||W=="unwind"||F(0,W)}};function Re(P){P>>>=0,typeof Atomics.jc=="function"&&(Atomics.jc(ae(),P>>>2,P).value.then(tt),P+=128,Atomics.store(ae(),P>>>2,1))}var tt=()=>{var P=ys();P&&(Re(P),Be(Gr))};function Dt(P,W){(P>>>=0)==W>>>0?setTimeout(tt):w?postMessage({Gb:P,Bb:"checkMailbox"}):(P=fA[P])&&P.postMessage({Bb:"checkMailbox"})}var _t=[];function et(P,W,$,se,fe){for(W>>>=0,se/=2,_t.length=se,$=fe>>>0>>>3,fe=0;fe<se;fe++)_t[fe]=me[$+2*fe]?me[$+2*fe+1]:At()[$+2*fe+1>>>0];return(W?$e[W]:ni[P])(..._t)}var xt=()=>{Lt=0};function wA(P){P>>>=0,w?postMessage({Bb:"cleanupThread",hc:P}):Dr(fA[P])}function nA(P){}var $A=(P,W)=>{var $=Aa[P];if($===void 0)throw P=Lo(P),$=qA(P),Ga(P),new oA(`${W} has unknown type ${$}`);return $},Tr=(P,W,$)=>{var se=[];return P=P.toWireType(se,$),se.length&&(Ee()[W>>>2>>>0]=Nt(se)),P};function br(P,W,$){return W>>>=0,$>>>=0,P=lr(P>>>0),W=$A(W,"emval::as"),Tr(W,$,P)}function cr(P,W){return W>>>=0,P=lr(P>>>0),(W=$A(W,"emval::as")).toWireType(null,P)}var UA=P=>{try{P()}catch(W){Ke(W)}},ur=0,Vr=null,er=0,Ma=[],KA={},fr={},TA=0,dr=null,Ua=[];function Cr(P){return(function(W){if(!ye){if(ur===0){var $=!1,se=!1;W((fe=0)=>{if(!ye&&(er=fe,$=!0,se)){ur=2,UA(()=>No(Vr)),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.resume(),fe=!1;try{var Pe=(function(){var yt=ae()[Vr+8>>>2>>>0];return yt=Kt[fr[yt]],--Lt,yt()})()}catch(yt){Pe=yt,fe=!0}var Xe=!1;if(!Vr){var gt=dr;gt&&(dr=null,(fe?gt.reject:gt.resolve)(Pe),Xe=!0)}if(fe&&!Xe)throw Pe}}),se=!0,$||(ur=1,Vr=(function(){var fe=AA(65548),Pe=fe+12;Ee()[fe>>>2>>>0]=Pe,Ee()[fe+4>>>2>>>0]=Pe+65536,Pe=Ma[0];var Xe=KA[Pe];return Xe===void 0&&(Xe=TA++,KA[Pe]=Xe,fr[Xe]=Pe),Pe=Xe,ae()[fe+8>>>2>>>0]=Pe,fe})(),typeof MainLoop<"u"&&MainLoop.Pb&&MainLoop.pause(),UA(()=>tr(Vr)))}else ur===2?(ur=0,UA(Jr),Ga(Vr),Vr=null,Ua.forEach(Be)):Ke(`invalid state: ${ur}`);return er}})(W=>{P().then(W)})}function xa(P){return P>>>=0,Cr(async()=>{var W=await lr(P);return Nt(W)})}var gr=[];function pr(P,W,$,se){return $>>>=0,se>>>=0,(P=gr[P>>>0])(null,W=lr(W>>>0),$,se)}var Wt={},xA=P=>{var W=Wt[P];return W===void 0?qA(P):W};function Sr(P,W,$,se,fe){return $>>>=0,se>>>=0,fe>>>=0,(P=gr[P>>>0])(W=lr(W>>>0),W[$=xA($)],se,fe)}var bs=()=>typeof globalThis=="object"?globalThis:Function("return this")();function rs(P){return(P>>>=0)==0?Nt(bs()):(P=xA(P),Nt(bs()[P]))}var ei=P=>{var W=gr.length;return gr.push(P),W},ti=(P,W)=>{for(var $=Array(P),se=0;se<P;++se)$[se]=$A(Ee()[W+4*se>>>2>>>0],"parameter "+se);return $},Cs=(P,W)=>Object.defineProperty(W,"name",{value:P});function Bo(P,W,$){var se=(W=ti(P,W>>>0)).shift();P--;var fe=`return function (obj, func, destructorsRef, args) {
`,Pe=0,Xe=[];$===0&&Xe.push("obj");for(var gt=["retType"],yt=[se],Vt=0;Vt<P;++Vt)Xe.push("arg"+Vt),gt.push("argType"+Vt),yt.push(W[Vt]),fe+=`  var arg${Vt} = argType${Vt}.readValueFromPointer(args${Pe?"+"+Pe:""});
`,Pe+=W[Vt].Cb;return fe+=`  var rv = ${$===1?"new func":"func.call"}(${Xe.join(", ")});
`,se.Tb||(gt.push("emval_returnValue"),yt.push(Tr),fe+=`  return emval_returnValue(retType, destructorsRef, rv);
`),gt.push(fe+`};
`),P=(function(cA){var bA=Function;if(!(bA instanceof Function))throw new TypeError(`new_ called with constructor type ${typeof bA} which is not a function`);var QA=Cs(bA.name||"unknownFunctionName",function(){});return QA.prototype=bA.prototype,QA=new QA,(cA=bA.apply(QA,cA))instanceof Object?cA:QA})(gt)(...yt),$=`methodCaller<(${W.map(cA=>cA.name).join(", ")}) => ${se.name}>`,ei(Cs($,P))}function Ai(P){return P=xA(P>>>0),Nt(d[P])}function as(P,W){return W>>>=0,P=lr(P>>>0),W=lr(W),Nt(P[W])}function Vs(P){9<(P>>>=0)&&(sa[P+1]+=1)}function Or(){return Nt([])}function Gt(P){P=lr(P>>>0);for(var W=Array(P.length),$=0;$<P.length;$++)W[$]=P[$];return Nt(W)}function ga(P){return Nt(xA(P>>>0))}function yo(){return Nt({})}function ss(P){for(var W=lr(P>>>=0);W.length;){var $=W.pop();W.pop()($)}oa(P)}function ri(P,W,$){W>>>=0,$>>>=0,P=lr(P>>>0),W=lr(W),$=lr($),P[W]=$}function ai(P,W){return W>>>=0,P=(P=$A(P>>>0,"_emval_take_value")).readValueFromPointer(W),Nt(P)}function si(P,W){P=-9007199254740992>P||9007199254740992<P?NaN:Number(P),W>>>=0,P=new Date(1e3*P),ae()[W>>>2>>>0]=P.getUTCSeconds(),ae()[W+4>>>2>>>0]=P.getUTCMinutes(),ae()[W+8>>>2>>>0]=P.getUTCHours(),ae()[W+12>>>2>>>0]=P.getUTCDate(),ae()[W+16>>>2>>>0]=P.getUTCMonth(),ae()[W+20>>>2>>>0]=P.getUTCFullYear()-1900,ae()[W+24>>>2>>>0]=P.getUTCDay(),P=(P.getTime()-Date.UTC(P.getUTCFullYear(),0,1,0,0,0,0))/864e5|0,ae()[W+28>>>2>>>0]=P}var Do=P=>P%4==0&&(P%100!=0||P%400==0),To=[0,31,60,91,121,152,182,213,244,274,305,335],Is=[0,31,59,90,120,151,181,212,243,273,304,334];function OA(P,W){P=-9007199254740992>P||9007199254740992<P?NaN:Number(P),W>>>=0,P=new Date(1e3*P),ae()[W>>>2>>>0]=P.getSeconds(),ae()[W+4>>>2>>>0]=P.getMinutes(),ae()[W+8>>>2>>>0]=P.getHours(),ae()[W+12>>>2>>>0]=P.getDate(),ae()[W+16>>>2>>>0]=P.getMonth(),ae()[W+20>>>2>>>0]=P.getFullYear()-1900,ae()[W+24>>>2>>>0]=P.getDay();var $=(Do(P.getFullYear())?To:Is)[P.getMonth()]+P.getDate()-1|0;ae()[W+28>>>2>>>0]=$,ae()[W+36>>>2>>>0]=-60*P.getTimezoneOffset(),$=new Date(P.getFullYear(),6,1).getTimezoneOffset();var se=new Date(P.getFullYear(),0,1).getTimezoneOffset();P=0|($!=se&&P.getTimezoneOffset()==Math.min(se,$)),ae()[W+32>>>2>>>0]=P}function Po(P){P>>>=0;var W=new Date(ae()[P+20>>>2>>>0]+1900,ae()[P+16>>>2>>>0],ae()[P+12>>>2>>>0],ae()[P+8>>>2>>>0],ae()[P+4>>>2>>>0],ae()[P>>>2>>>0],0),$=ae()[P+32>>>2>>>0],se=W.getTimezoneOffset(),fe=new Date(W.getFullYear(),6,1).getTimezoneOffset(),Pe=new Date(W.getFullYear(),0,1).getTimezoneOffset(),Xe=Math.min(Pe,fe);return 0>$?ae()[P+32>>>2>>>0]=+(fe!=Pe&&Xe==se):0<$!=(Xe==se)&&(fe=Math.max(Pe,fe),W.setTime(W.getTime()+6e4*((0<$?Xe:fe)-se))),ae()[P+24>>>2>>>0]=W.getDay(),$=(Do(W.getFullYear())?To:Is)[W.getMonth()]+W.getDate()-1|0,ae()[P+28>>>2>>>0]=$,ae()[P>>>2>>>0]=W.getSeconds(),ae()[P+4>>>2>>>0]=W.getMinutes(),ae()[P+8>>>2>>>0]=W.getHours(),ae()[P+12>>>2>>>0]=W.getDate(),ae()[P+16>>>2>>>0]=W.getMonth(),ae()[P+20>>>2>>>0]=W.getYear(),P=W.getTime(),BigInt(isNaN(P)?-1:P/1e3)}function ro(P,W,$,se,fe,Pe,Xe){return w?nt(16,1,P,W,$,se,fe,Pe,Xe):-52}function os(P,W,$,se,fe,Pe){if(w)return nt(17,1,P,W,$,se,fe,Pe)}var va={},Oa=()=>performance.timeOrigin+performance.now();function Ys(P,W){if(w)return nt(18,1,P,W);if(va[P]&&(clearTimeout(va[P].id),delete va[P]),!W)return 0;var $=setTimeout(()=>{delete va[P],Be(()=>Za(P,performance.timeOrigin+performance.now()))},W);return va[P]={id:$,qc:W},0}function oi(P,W,$,se){P>>>=0,W>>>=0,$>>>=0,se>>>=0;var fe=new Date().getFullYear(),Pe=new Date(fe,0,1).getTimezoneOffset();fe=new Date(fe,6,1).getTimezoneOffset();var Xe=Math.max(Pe,fe);Ee()[P>>>2>>>0]=60*Xe,ae()[W>>>2>>>0]=+(Pe!=fe),P=(W=gt=>{var yt=Math.abs(gt);return`UTC${0<=gt?"-":"+"}${String(Math.floor(yt/60)).padStart(2,"0")}${String(yt%60).padStart(2,"0")}`})(Pe),W=W(fe),fe<Pe?(Ca(P,$,17),Ca(W,se,17)):(Ca(P,se,17),Ca(W,$,17))}var ws=()=>Date.now(),ao=1;function Go(P,W,$){if(!(0<=P&&3>=P))return 28;if(P===0)P=Date.now();else{if(!ao)return 52;P=performance.timeOrigin+performance.now()}return me[$>>>0>>>3]=BigInt(Math.round(1e6*P)),0}var ks=[],lt=(P,W)=>{ks.length=0;for(var $;$=xe()[P++>>>0];){var se=$!=105;W+=(se&=$!=112)&&W%8?4:0,ks.push($==112?Ee()[W>>>2>>>0]:$==106?me[W>>>3]:$==105?ae()[W>>>2>>>0]:At()[W>>>3>>>0]),W+=se?8:4}return ks};function ii(P,W,$){return P>>>=0,W=lt(W>>>0,$>>>0),$e[P](...W)}function Qt(P,W,$){return P>>>=0,W=lt(W>>>0,$>>>0),$e[P](...W)}var so=()=>{};function oo(P,W){return K(RA(P>>>0,W>>>0))}var Zr=()=>{throw Lt+=1,"unwind"};function ia(){return 4294901760}var Hs=()=>navigator.hardwareConcurrency;function Us(){return Ke("Cannot use emscripten_pc_get_function without -sUSE_OFFSET_CONVERTER"),0}function io(P){P>>>=0;var W=xe().length;if(P<=W||4294901760<P)return!1;for(var $=1;4>=$;$*=2){var se=W*(1+.2/$);se=Math.min(se,P+100663296);e:{se=(Math.min(4294901760,65536*Math.ceil(Math.max(P,se)/65536))-g.buffer.byteLength+65535)/65536|0;try{g.grow(se),He();var fe=1;break e}catch{}fe=void 0}if(fe)return!0}return!1}var ir=()=>(Ke("Cannot use convertFrameToPC (needed by __builtin_return_address) without -sUSE_OFFSET_CONVERTER"),0),Ka={},no=P=>{P.forEach(W=>{var $=ir();$&&(Ka[$]=W)})};function Ks(){var P=Error().stack.toString().split(`
`);return P[0]=="Error"&&P.shift(),no(P),Ka.Lb=ir(),Ka.cc=P,Ka.Lb}function Ms(P,W,$){if(P>>>=0,W>>>=0,Ka.Lb==P)var se=Ka.cc;else(se=Error().stack.toString().split(`
`))[0]=="Error"&&se.shift(),no(se);for(var fe=3;se[fe]&&ir()!=P;)++fe;for(P=0;P<$&&se[P+fe];++P)ae()[W+4*P>>>2>>>0]=ir();return P}var Xa,Xs={},Zs=()=>{if(!Xa){var P,W={USER:"web_user",LOGNAME:"web_user",PATH:"/",PWD:"/",HOME:"/home/web_user",LANG:(typeof navigator=="object"&&navigator.languages&&navigator.languages[0]||"C").replace("-","_")+".UTF-8",_:"./this.program"};for(P in Xs)Xs[P]===void 0?delete W[P]:W[P]=Xs[P];var $=[];for(P in W)$.push(`${P}=${W[P]}`);Xa=$}return Xa};function Et(P,W){if(w)return nt(19,1,P,W);P>>>=0,W>>>=0;var $=0;return Zs().forEach((se,fe)=>{var Pe=W+$;for(fe=Ee()[P+4*fe>>>2>>>0]=Pe,Pe=0;Pe<se.length;++Pe)qe()[fe++>>>0]=se.charCodeAt(Pe);qe()[fe>>>0]=0,$+=se.length+1}),0}function Pa(P,W){if(w)return nt(20,1,P,W);P>>>=0,W>>>=0;var $=Zs();Ee()[P>>>2>>>0]=$.length;var se=0;return $.forEach(fe=>se+=fe.length+1),Ee()[W>>>2>>>0]=se,0}function Fo(P){return w?nt(21,1,P):52}function Qo(P,W,$,se){return w?nt(22,1,P,W,$,se):52}function _s(P,W,$,se){return w?nt(23,1,P,W,$,se):70}var Bs=[null,[],[]];function So(P,W,$,se){if(w)return nt(24,1,P,W,$,se);W>>>=0,$>>>=0,se>>>=0;for(var fe=0,Pe=0;Pe<$;Pe++){var Xe=Ee()[W>>>2>>>0],gt=Ee()[W+4>>>2>>>0];W+=8;for(var yt=0;yt<gt;yt++){var Vt=xe()[Xe+yt>>>0],cA=Bs[P];Vt===0||Vt===10?((P===1?L:K)(es(cA)),cA.length=0):cA.push(Vt)}fe+=gt}return Ee()[se>>>2>>>0]=fe,0}w||(function(){for(var P=d.numThreads-1;P--;)$a();pt.unshift(()=>{Ve++,(function(W){w?W():Promise.all(wt.map(jr)).then(W)})(()=>ot())})})();for(var Oo=Array(256),Js=0;256>Js;++Js)Oo[Js]=String.fromCharCode(Js);Pt=Oo,oA=d.BindingError=class extends Error{constructor(P){super(P),this.name="BindingError"}},d.InternalError=class extends Error{constructor(P){super(P),this.name="InternalError"}},sa.push(0,1,void 0,1,null,1,!0,1,!1,1),d.count_emval_handles=()=>sa.length/2-5-ka.length;var Kt,ni=[It,ct,Ta,Wa,ba,Y,de,oe,he,ve,Se,Ze,Ft,Ut,Bt,iA,ro,os,Ys,Et,Pa,Fo,Qo,_s,So];(async function(){function P(se,fe){return Kt=se.exports,Kt=(function(){var Pe=Kt,Xe={};for(let[gt,yt]of Object.entries(Pe))Xe[gt]=typeof yt=="function"?(...Vt)=>{Ma.push(gt);try{return yt(...Vt)}finally{ye||(Ma.pop(),Vr&&ur===1&&Ma.length===0&&(ur=0,Lt+=1,UA(Ps),typeof Fibers<"u"&&Fibers.rc()))}}:yt;return Xe})(),Kt=(function(){var Pe=Kt,Xe=yt=>Vt=>yt(Vt)>>>0,gt=yt=>()=>yt()>>>0;return(Pe=Object.assign({},Pe)).Da=Xe(Pe.Da),Pe.fb=gt(Pe.fb),Pe.hb=Xe(Pe.hb),Pe.tb=Xe(Pe.tb),Pe.ub=gt(Pe.ub),Pe.__cxa_get_exception_ptr=Xe(Pe.__cxa_get_exception_ptr),Pe})(),tA.push(Kt.ib),k=fe,ot(),Kt}Ve++;var W=H();if(d.instantiateWasm)return new Promise(se=>{d.instantiateWasm(W,(fe,Pe)=>{P(fe,Pe),se(fe.exports)})});if(w)return new Promise(se=>{ft=fe=>{var Pe=new WebAssembly.Instance(fe,H());se(P(Pe,fe))}});Qe??=d.locateFile?d.locateFile?d.locateFile("ort-wasm-simd-threaded.jsep.wasm",j):j+"ort-wasm-simd-threaded.jsep.wasm":new URL("ort-wasm-simd-threaded.jsep.wasm",import.meta.url).href;try{var $=await(async function(se){var fe=Qe;if(!_e&&typeof WebAssembly.instantiateStreaming=="function"&&!Ge(fe))try{var Pe=fetch(fe,{credentials:"same-origin"});return await WebAssembly.instantiateStreaming(Pe,se)}catch(Xe){K(`wasm streaming compile failed: ${Xe}`),K("falling back to ArrayBuffer instantiation")}return(async function(Xe,gt){try{var yt=await(async function(Vt){if(!_e)try{var cA=await _(Vt);return new Uint8Array(cA)}catch{}if(Vt==Qe&&_e)Vt=new Uint8Array(_e);else{if(!v)throw"both async and sync fetching of the wasm failed";Vt=v(Vt)}return Vt})(Xe);return await WebAssembly.instantiate(yt,gt)}catch(Vt){K(`failed to asynchronously prepare wasm: ${Vt}`),Ke(Vt)}})(fe,se)})(W);return P($.instance,$.module)}catch(se){return o(se),Promise.reject(se)}})();var Lo=P=>(Lo=Kt.Da)(P),Er=()=>(Er=Kt.Ea)();d._OrtInit=(P,W)=>(d._OrtInit=Kt.Fa)(P,W),d._OrtGetLastError=(P,W)=>(d._OrtGetLastError=Kt.Ga)(P,W),d._OrtCreateSessionOptions=(P,W,$,se,fe,Pe,Xe,gt,yt,Vt)=>(d._OrtCreateSessionOptions=Kt.Ha)(P,W,$,se,fe,Pe,Xe,gt,yt,Vt),d._OrtAppendExecutionProvider=(P,W,$,se,fe)=>(d._OrtAppendExecutionProvider=Kt.Ia)(P,W,$,se,fe),d._OrtAddFreeDimensionOverride=(P,W,$)=>(d._OrtAddFreeDimensionOverride=Kt.Ja)(P,W,$),d._OrtAddSessionConfigEntry=(P,W,$)=>(d._OrtAddSessionConfigEntry=Kt.Ka)(P,W,$),d._OrtReleaseSessionOptions=P=>(d._OrtReleaseSessionOptions=Kt.La)(P),d._OrtCreateSession=(P,W,$)=>(d._OrtCreateSession=Kt.Ma)(P,W,$),d._OrtReleaseSession=P=>(d._OrtReleaseSession=Kt.Na)(P),d._OrtGetInputOutputCount=(P,W,$)=>(d._OrtGetInputOutputCount=Kt.Oa)(P,W,$),d._OrtGetInputOutputMetadata=(P,W,$,se)=>(d._OrtGetInputOutputMetadata=Kt.Pa)(P,W,$,se),d._OrtFree=P=>(d._OrtFree=Kt.Qa)(P),d._OrtCreateTensor=(P,W,$,se,fe,Pe)=>(d._OrtCreateTensor=Kt.Ra)(P,W,$,se,fe,Pe),d._OrtGetTensorData=(P,W,$,se,fe)=>(d._OrtGetTensorData=Kt.Sa)(P,W,$,se,fe),d._OrtReleaseTensor=P=>(d._OrtReleaseTensor=Kt.Ta)(P),d._OrtCreateRunOptions=(P,W,$,se)=>(d._OrtCreateRunOptions=Kt.Ua)(P,W,$,se),d._OrtAddRunConfigEntry=(P,W,$)=>(d._OrtAddRunConfigEntry=Kt.Va)(P,W,$),d._OrtReleaseRunOptions=P=>(d._OrtReleaseRunOptions=Kt.Wa)(P),d._OrtCreateBinding=P=>(d._OrtCreateBinding=Kt.Xa)(P),d._OrtBindInput=(P,W,$)=>(d._OrtBindInput=Kt.Ya)(P,W,$),d._OrtBindOutput=(P,W,$,se)=>(d._OrtBindOutput=Kt.Za)(P,W,$,se),d._OrtClearBoundOutputs=P=>(d._OrtClearBoundOutputs=Kt._a)(P),d._OrtReleaseBinding=P=>(d._OrtReleaseBinding=Kt.$a)(P),d._OrtRunWithBinding=(P,W,$,se,fe)=>(d._OrtRunWithBinding=Kt.ab)(P,W,$,se,fe),d._OrtRun=(P,W,$,se,fe,Pe,Xe,gt)=>(d._OrtRun=Kt.bb)(P,W,$,se,fe,Pe,Xe,gt),d._OrtEndProfiling=P=>(d._OrtEndProfiling=Kt.cb)(P),d._JsepOutput=(P,W,$)=>(d._JsepOutput=Kt.db)(P,W,$),d._JsepGetNodeName=P=>(d._JsepGetNodeName=Kt.eb)(P);var ys=()=>(ys=Kt.fb)(),Ga=d._free=P=>(Ga=d._free=Kt.gb)(P),AA=d._malloc=P=>(AA=d._malloc=Kt.hb)(P),Ea=(P,W,$,se,fe,Pe)=>(Ea=Kt.kb)(P,W,$,se,fe,Pe),lo=()=>(lo=Kt.lb)(),La=(P,W,$,se,fe)=>(La=Kt.mb)(P,W,$,se,fe),co=P=>(co=Kt.nb)(P),Pr=P=>(Pr=Kt.ob)(P),Za=(P,W)=>(Za=Kt.pb)(P,W),Gr=()=>(Gr=Kt.qb)(),Na=(P,W)=>(Na=Kt.rb)(P,W),Ds=P=>(Ds=Kt.sb)(P),Ts=P=>(Ts=Kt.tb)(P),uo=()=>(uo=Kt.ub)(),go=d.dynCall_ii=(P,W)=>(go=d.dynCall_ii=Kt.vb)(P,W),tr=P=>(tr=Kt.wb)(P),Ps=()=>(Ps=Kt.xb)(),No=P=>(No=Kt.yb)(P),Jr=()=>(Jr=Kt.zb)();return d.stackSave=()=>uo(),d.stackRestore=P=>Ds(P),d.stackAlloc=P=>Ts(P),d.setValue=function(P,W,$="i8"){switch($.endsWith("*")&&($="*"),$){case"i1":case"i8":qe()[P>>>0]=W;break;case"i16":Ce()[P>>>1>>>0]=W;break;case"i32":ae()[P>>>2>>>0]=W;break;case"i64":me[P>>>3]=BigInt(W);break;case"float":Le()[P>>>2>>>0]=W;break;case"double":At()[P>>>3>>>0]=W;break;case"*":Ee()[P>>>2>>>0]=W;break;default:Ke(`invalid type for setValue: ${$}`)}},d.getValue=function(P,W="i8"){switch(W.endsWith("*")&&(W="*"),W){case"i1":case"i8":return qe()[P>>>0];case"i16":return Ce()[P>>>1>>>0];case"i32":return ae()[P>>>2>>>0];case"i64":return me[P>>>3];case"float":return Le()[P>>>2>>>0];case"double":return At()[P>>>3>>>0];case"*":return Ee()[P>>>2>>>0];default:Ke(`invalid type for getValue: ${W}`)}},d.UTF8ToString=RA,d.stringToUTF8=Ca,d.lengthBytesUTF8=pA,(function P(){if(0<Ve)Ue=P;else if(w)i(d),ee();else{for(;0<pt.length;)pt.shift()(d);0<Ve?Ue=P:(d.calledRun=!0,ye||(ee(),i(d)))}})(),d.PTR_SIZE=4,m}),lh=ac,cf=globalThis.self?.name?.startsWith("em-pthread"),cf&&ac()}),sc,Jc,uf,ds,ch,E0,df,gf,oc,ff,ic,uh,nc,dh,h2=Mt(()=>{"use strict";m2(),sc=typeof location>"u"?void 0:location.origin,Jc=import.meta.url>"file:"&&import.meta.url<"file;",uf=()=>{if(Jc){let s=URL;return new URL(new s("ort.bundle.min.mjs",import.meta.url).href,sc).href}return import.meta.url},ds=uf(),ch=()=>{if(ds&&!ds.startsWith("blob:"))return ds.substring(0,ds.lastIndexOf("/")+1)},E0=(s,i)=>{try{let o=i??ds;return(o?new URL(s,o):new URL(s)).origin===sc}catch{return!1}},df=(s,i)=>{let o=i??ds;try{return(o?new URL(s,o):new URL(s)).href}catch{return}},gf=(s,i)=>`${i??"./"}${s}`,oc=async s=>{let i=await(await fetch(s,{credentials:"same-origin"})).blob();return URL.createObjectURL(i)},ff=async s=>(await import(s)).default,ic=(x6(),Kn(oh)).default,uh=async()=>{if(!ds)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(E0(ds))return[void 0,ic()];let s=await oc(ds);return[s,ic(s)]},nc=(v6(),Kn(nh)).default,dh=async(s,i,o)=>{if(!s&&!i&&nc&&ds&&E0(ds))return[void 0,nc];{let d="ort-wasm-simd-threaded.jsep.mjs",m=s??df(d,i),C=o&&m&&!E0(m,i),b=C?await oc(m):m??gf(d,i);return[C?b:void 0,await ff(b)]}}}),lc,_0,Fn,cc,pf,mf,hf,b2,mr,Pi=Mt(()=>{"use strict";h2(),_0=!1,Fn=!1,cc=!1,pf=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},mf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},hf=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},b2=async s=>{if(_0)return Promise.resolve();if(Fn)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(cc)throw new Error("previous call to 'initializeWebAssembly()' failed.");Fn=!0;let i=s.initTimeout,o=s.numThreads;if(s.simd!==!1){if(s.simd==="relaxed"){if(!hf())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!mf())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let d=pf();o>1&&!d&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+o+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),s.numThreads=o=1);let m=s.wasmPaths,C=typeof m=="string"?m:void 0,b=m?.mjs,w=b?.href??b,M=m?.wasm,x=M?.href??M,D=s.wasmBinary,[_,v]=await dh(w,C,o>1),Q=!1,F=[];if(i>0&&F.push(new Promise(j=>{setTimeout(()=>{Q=!0,j()},i)})),F.push(new Promise((j,X)=>{let R={numThreads:o};if(D)R.wasmBinary=D;else if(x||C)R.locateFile=L=>x??C+L;else if(w&&w.indexOf("blob:")!==0)R.locateFile=L=>new URL(L,w).href;else if(_){let L=ch();L&&(R.locateFile=K=>L+K)}v(R).then(L=>{Fn=!1,_0=!0,lc=L,j(),_&&URL.revokeObjectURL(_)},L=>{Fn=!1,cc=!0,X(L)})})),await Promise.race(F),Q)throw new Error(`WebAssembly backend initializing failed due to timeout: ${i}ms`)},mr=()=>{if(_0&&lc)return lc;throw new Error("WebAssembly is not initialized yet.")}}),zs,R0,ar,C2=Mt(()=>{"use strict";Pi(),zs=(s,i)=>{let o=mr(),d=o.lengthBytesUTF8(s)+1,m=o._malloc(d);return o.stringToUTF8(s,m,d),i.push(m),m},R0=(s,i,o,d)=>{if(typeof s=="object"&&s!==null){if(o.has(s))throw new Error("Circular reference in options");o.add(s)}Object.entries(s).forEach(([m,C])=>{let b=i?i+m:m;if(typeof C=="object")R0(C,b+".",o,d);else if(typeof C=="string"||typeof C=="number")d(b,C.toString());else if(typeof C=="boolean")d(b,C?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof C}`)})},ar=s=>{let i=mr(),o=i.stackSave();try{let d=i.PTR_SIZE,m=i.stackAlloc(2*d);i._OrtGetLastError(m,m+d);let C=Number(i.getValue(m,d===4?"i32":"i64")),b=i.getValue(m+d,"*"),w=b?i.UTF8ToString(b):"";throw new Error(`${s} ERROR_CODE: ${C}, ERROR_MESSAGE: ${w}`)}finally{i.stackRestore(o)}}}),gh,E6=Mt(()=>{"use strict";Pi(),C2(),gh=s=>{let i=mr(),o=0,d=[],m=s||{};try{if(s?.logSeverityLevel===void 0)m.logSeverityLevel=2;else if(typeof s.logSeverityLevel!="number"||!Number.isInteger(s.logSeverityLevel)||s.logSeverityLevel<0||s.logSeverityLevel>4)throw new Error(`log serverity level is not valid: ${s.logSeverityLevel}`);if(s?.logVerbosityLevel===void 0)m.logVerbosityLevel=0;else if(typeof s.logVerbosityLevel!="number"||!Number.isInteger(s.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${s.logVerbosityLevel}`);s?.terminate===void 0&&(m.terminate=!1);let C=0;return s?.tag!==void 0&&(C=zs(s.tag,d)),o=i._OrtCreateRunOptions(m.logSeverityLevel,m.logVerbosityLevel,!!m.terminate,C),o===0&&ar("Can't create run options."),s?.extra!==void 0&&R0(s.extra,"",new WeakSet,(b,w)=>{let M=zs(b,d),x=zs(w,d);i._OrtAddRunConfigEntry(o,M,x)!==0&&ar(`Can't set a run config entry: ${b} - ${w}.`)}),[o,d]}catch(C){throw o!==0&&i._OrtReleaseRunOptions(o),d.forEach(b=>i._free(b)),C}}}),bf,Cf,If,Qn,wf,fh,_6=Mt(()=>{"use strict";Pi(),C2(),bf=s=>{switch(s){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${s}`)}},Cf=s=>{switch(s){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${s}`)}},If=s=>{s.extra||(s.extra={}),s.extra.session||(s.extra.session={});let i=s.extra.session;i.use_ort_model_bytes_directly||(i.use_ort_model_bytes_directly="1"),s.executionProviders&&s.executionProviders.some(o=>(typeof o=="string"?o:o.name)==="webgpu")&&(s.enableMemPattern=!1)},Qn=(s,i,o,d)=>{let m=zs(i,d),C=zs(o,d);mr()._OrtAddSessionConfigEntry(s,m,C)!==0&&ar(`Can't set a session config entry: ${i} - ${o}.`)},wf=async(s,i,o)=>{for(let d of i){let m=typeof d=="string"?d:d.name,C=[];switch(m){case"webnn":if(m="WEBNN",typeof d!="string"){let D=d?.deviceType;D&&Qn(s,"deviceType",D,o)}break;case"webgpu":if(m="JS",typeof d!="string"){let D=d;if(D?.preferredLayout){if(D.preferredLayout!=="NCHW"&&D.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${D.preferredLayout}`);Qn(s,"preferredLayout",D.preferredLayout,o)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${m}`)}let b=zs(m,o),w=C.length,M=0,x=0;if(w>0){M=mr()._malloc(w*mr().PTR_SIZE),o.push(M),x=mr()._malloc(w*mr().PTR_SIZE),o.push(x);for(let D=0;D<w;D++)mr().setValue(M+D*mr().PTR_SIZE,C[D][0],"*"),mr().setValue(x+D*mr().PTR_SIZE,C[D][1],"*")}await mr()._OrtAppendExecutionProvider(s,b,M,x,w)!==0&&ar(`Can't append execution provider: ${m}.`)}},fh=async s=>{let i=mr(),o=0,d=[],m=s||{};If(m);try{let C=bf(m.graphOptimizationLevel??"all"),b=Cf(m.executionMode??"sequential"),w=typeof m.logId=="string"?zs(m.logId,d):0,M=m.logSeverityLevel??2;if(!Number.isInteger(M)||M<0||M>4)throw new Error(`log serverity level is not valid: ${M}`);let x=m.logVerbosityLevel??0;if(!Number.isInteger(x)||x<0||x>4)throw new Error(`log verbosity level is not valid: ${x}`);let D=typeof m.optimizedModelFilePath=="string"?zs(m.optimizedModelFilePath,d):0;if(o=i._OrtCreateSessionOptions(C,!!m.enableCpuMemArena,!!m.enableMemPattern,b,!!m.enableProfiling,0,w,M,x,D),o===0&&ar("Can't create session options."),m.executionProviders&&await wf(o,m.executionProviders,d),m.enableGraphCapture!==void 0){if(typeof m.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${m.enableGraphCapture}`);Qn(o,"enableGraphCapture",m.enableGraphCapture.toString(),d)}if(m.freeDimensionOverrides)for(let[_,v]of Object.entries(m.freeDimensionOverrides)){if(typeof _!="string")throw new Error(`free dimension override name must be a string: ${_}`);if(typeof v!="number"||!Number.isInteger(v)||v<0)throw new Error(`free dimension override value must be a non-negative integer: ${v}`);let Q=zs(_,d);i._OrtAddFreeDimensionOverride(o,Q,v)!==0&&ar(`Can't set a free dimension override: ${_} - ${v}.`)}return m.extra!==void 0&&R0(m.extra,"",new WeakSet,(_,v)=>{Qn(o,_,v,d)}),[o,d]}catch(C){throw o!==0&&i._OrtReleaseSessionOptions(o)!==0&&ar("Can't release session options."),d.forEach(b=>i._free(b)),C}}}),rn,Mo,_i,I2,j0,w2,k2,qc,lA=Mt(()=>{"use strict";rn=s=>{switch(s){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${s}`)}},Mo=s=>{switch(s){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${s}`)}},_i=(s,i)=>{let o=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][s],d=typeof i=="number"?i:i.reduce((m,C)=>m*C,1);return o>0?Math.ceil(d*o):void 0},I2=s=>{switch(s){case"float16":return typeof Float16Array<"u"&&Float16Array.from?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${s}`)}},j0=s=>{switch(s){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${s}`)}},w2=s=>s==="float32"||s==="float16"||s==="int32"||s==="int64"||s==="uint32"||s==="uint8"||s==="bool"||s==="uint4"||s==="int4",k2=s=>s==="float32"||s==="float16"||s==="int32"||s==="int64"||s==="uint32"||s==="uint64"||s==="int8"||s==="uint8"||s==="bool"||s==="uint4"||s==="int4",qc=s=>{switch(s){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${s}`)}}}),M2,ph=Mt(()=>{"use strict";m2(),M2=async s=>{if(typeof s=="string"){let i=await fetch(s);if(!i.ok)throw new Error(`failed to load external data file: ${s}`);let o=i.headers.get("Content-Length"),d=o?parseInt(o,10):0;if(d<1073741824)return new Uint8Array(await i.arrayBuffer());{if(!i.body)throw new Error(`failed to load external data file: ${s}, no response body.`);let m=i.body.getReader(),C;try{C=new ArrayBuffer(d)}catch(w){if(w instanceof RangeError){let M=Math.ceil(d/65536);C=new WebAssembly.Memory({initial:M,maximum:M}).buffer}else throw w}let b=0;for(;;){let{done:w,value:M}=await m.read();if(w)break;let x=M.byteLength;new Uint8Array(C,b,x).set(M),b+=x}return new Uint8Array(C,0,d)}}else return s instanceof Blob?new Uint8Array(await s.arrayBuffer()):s instanceof Uint8Array?s:new Uint8Array(s)}}),kf,Mf,xf,vf,x2,Ef,SA,xo=Mt(()=>{"use strict";lA(),kf=["V","I","W","E","F"],Mf=(s,i)=>{console.log(`[${kf[s]},${new Date().toISOString()}]${i}`)},x2=(s,i)=>{xf=s,vf=i},Ef=(s,i)=>{let o=j0(s),d=j0(xf);o>=d&&Mf(o,typeof i=="function"?i():i)},SA=(...s)=>{vf&&Ef(...s)}}),_f,sn,Ye,W0,mh,hh,bh,IA=Mt(()=>{"use strict";_f=class{static calcMatMulShape(s,i){return s[1]!==i[0]?void 0:[s[0],i[1]]}},sn=class{static calcShape(s,i,o=!1){let d=s.length,m=i.length;if(d===0)return i;if(m===0)return s;let C=Math.max(s.length,i.length),b=new Array(C);if(o){if(d<2||m<2)return;let w=_f.calcMatMulShape([s[d-2],s[d-1]],[i[m-2],i[m-1]]);if(w===void 0)return;[b[C-2],b[C-1]]=w}for(let w=o?3:1;w<=C;w++){let M=d-w<0?1:s[d-w],x=m-w<0?1:i[m-w];if(M!==x&&M>1&&x>1)return;let D=Math.max(M,x);if(M&&x)b[C-w]=Math.max(M,x);else{if(D>1)return;b[C-w]=0}}return b}static isValidBroadcast(s,i){let o=s.length,d=i.length;if(o>d)return!1;for(let m=1;m<=o;m++)if(s[o-m]!==1&&s[o-m]!==i[d-m])return!1;return!0}},Ye=class N0{static size(i){return N0.getSizeFromDimensionRange(i,0,i.length)}static convertShape(i,o=4){let d=i.length;if(d===0)return[];let m=new Array(d),C=d-1;for(;C>=0;){if(i[C]%o===0){m[C]=i[C]/o;break}if(o%i[C]!==0)throw new Error("cannot convert shape");m[C]=1,o/=i[C],C--}for(C--;C>=0;C--)m[C]=i[C];return m}static sizeFromDimension(i,o){if(o<0||o>i.length)throw new Error(`invalid dimension of ${o} for sizeFromDimension as Tensor has ${i.length} dimensions.`);return N0.getSizeFromDimensionRange(i,o,i.length)}static sizeToDimension(i,o){if(o<0||o>i.length)throw new Error(`invalid dimension of ${o} for sizeToDimension as Tensor has ${i.length} dimensions.`);return N0.getSizeFromDimensionRange(i,0,o)}static getSizeFromDimensionRange(i,o,d){let m=1;for(let C=o;C<d;C++){if(i[C]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");m*=Number(i[C])}return m}static computeStrides(i){let o=i.length;if(o===0)return[];if(o===1)return[1];let d=new Array(o);d[o-1]=1,d[o-2]=i[o-1];for(let m=o-3;m>=0;--m)d[m]=d[m+1]*i[m+1];return d}static normalizeAxis(i,o){if(i<-o&&i>=o)throw new Error("unsupported axis for this operation.");return i<0?i+o:i}static normalizeAxes(i,o){return i.map(d=>this.normalizeAxis(d,o??i.length))}static sortBasedOnPerm(i,o){return o?o.map(d=>i[d]):i.slice().reverse()}static padShape(i,o){let d=i.length;return i.map((m,C)=>m+o[C]+o[C+d])}static areEqual(i,o){return i.length!==o.length?!1:i.every((d,m)=>d===o[m])}},W0=class Vn{static adjustPoolAttributes(i,o,d,m,C,b){if(!i&&d.length!==o.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(i)for(let w=0;w<o.length-2;w++)w>=d.length?d.push(o[w+2]):d[w]=o[w+2];for(let w=0;w<d.length;w++)if(w<m.length){if(m[w]<0)throw new Error("strides should be greater than or equal to 1")}else m.push(1);for(let w=0;w<d.length;w++)if(w<C.length){if(C[w]<0)throw new Error("dilations should be greater than or equal to 1")}else C.push(1);for(let w=0;w<d.length*2;w++)if(w<b.length){if(b[w]<0)throw new Error("pad should be greater than or equal to 1")}else b.push(0);for(let w=0;w<d.length;w++){if(d[w]<=0)throw new Error("kernel shapes need to be greater than 0");if(b[w]>=d[w]||b[w+d.length]>=d[w])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(i,o,d,m,C,b,w){if(w){if(C.length!==2*(i.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(o.length!==i.length-2)throw new Error("length of strides should be the length of data dimensions");if(m.length!==i.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let M=0;M<i.length-2;M++)Vn.adjustPadAndReturnShape(i[M+(b?1:2)],o[M],d[M],m[M],C,M,M+i.length-2,w)}}static computePoolOutputShape(i,o,d,m,C,b,w){if(o.length<=0)throw new Error("input shape must be of size greater than 0");let M=[o[0],o[1]];return Vn.computeShapeHelper(i,o,M,d,m,C,b,w),M}static computeConvOutputShape(i,o,d,m,C,b,w){if(i.length<=0||o.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let M=[i[0],o[0]];return Vn.computeShapeHelper(!1,i,M,d,m,C,b,w),M}static computeShapeHelper(i,o,d,m,C,b,w,M){if(i)for(let x=0;x<o.length-2;x++)d.push(1);else for(let x=0;x<o.length-2;x++)d.push(Vn.adjustPadAndReturnShape(o[x+2],m[x],C[x],b[x],w,x,x+o.length-2,M))}static adjustPadAndReturnShape(i,o,d,m,C,b,w,M){let x=d*(m-1)+1;if(M&&M!=="NOTSET")switch(M){case"VALID":return C[b]=0,C[w]=0,Math.floor((i-x)/o+1);case"SAME_LOWER":case"SAME_UPPER":if(d!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let D=((i+o-1)/o-1)*o+m-i;return C[b]=Math.floor(M==="SAME_LOWER"?(D+1)/2:D/2),C[w]=D-C[b],Math.floor((i+D-m)/o+1)}default:throw new Error("Unsupported AutoPad type")}else return Math.floor((i+C[b]+C[w]-x)/o+1)}},mh=class{static getShapeOfGemmResult(s,i,o,d,m){if(s.length!==2||o.length!==2)throw new Error("shape need to be of size 2");let C,b,w;i?(C=s[1],b=s[0]):(C=s[0],b=s[1]);let M=-1;if(d?(w=o[0],M=1):(w=o[1],M=0),o[M]!==b)throw new Error("dimension mismatch");if(C<=0||w<=0||b<=0)throw new Error("invalid shape specified");if(m&&!sn.isValidBroadcast(m,[C,w]))throw new Error("gemm: invalid bias shape for broadcast");return[C,w,b]}},hh=-34028234663852886e22,bh=34028234663852886e22}),v2,Ch=Mt(()=>{"use strict";lA(),v2=(s,i)=>new(I2(i))(s)}),$c,uc,Bf,dc,yf,gc,fc,pc,Df,Ih,B6=Mt(()=>{"use strict";xo(),$c=(s,i=!0)=>{if(s.byteLength%8!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 8 (BigInt).");let o=s.byteLength/8,d=new BigInt64Array(s.buffer,s.byteOffset,o),m=new Int32Array(o);for(let C=0;C<o;C++){let b=d[C];if(b>2147483647n||b<-2147483648n)throw new Error(`Overflow occurred when converting BigInt to Int32 at index ${C}: ${b}`);m[C]=Number(b)}return i?new Uint8Array(m.buffer):m},uc=(s,i=!0)=>{if(s.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (Int32).");let o=s.byteLength/4,d=new Int32Array(s.buffer,s.byteOffset,o),m=BigInt64Array.from(d,BigInt);return i?new Uint8Array(m.buffer):m},Bf=1,dc=()=>Bf++,yf=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),gc=(s,i)=>{let o=yf.get(s);if(!o)throw new Error("Unsupported data type.");return i.length>0?Math.ceil(i.reduce((d,m)=>d*m)*o/8):0},fc=class{constructor(s){this.shouldConvertInt64toInt32=!1,this.isInt64ToInt32Converted=!1;let{sessionId:i,context:o,tensor:d,dataType:m,shape:C,shouldConvertInt64toInt32:b=!1}=s;this.sessionId=i,this.mlContext=o,this.mlTensor=d,this.dataType=m,this.tensorShape=C,this.shouldConvertInt64toInt32=b}get tensor(){return this.mlTensor}get type(){return this.dataType}get shape(){return this.tensorShape}get byteLength(){return gc(this.dataType,this.tensorShape)}destroy(){SA("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(s){this.mlContext.writeTensor(this.mlTensor,s)}async read(s,i){if(s){let o=await this.mlContext.readTensor(this.mlTensor),d=uc(new Uint8Array(o));if(i){(i instanceof ArrayBuffer?new Uint8Array(i):new Uint8Array(i.buffer,i.byteOffset,i.byteLength)).set(d);return}else return d.buffer}else return i?this.mlContext.readTensor(this.mlTensor,i):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(s,i,o){return this.mlContext===s&&this.dataType===i&&this.tensorShape.length===o.length&&this.tensorShape.every((d,m)=>d===o[m])}setIsInt64ToInt32Converted(s){this.isInt64ToInt32Converted=s}},pc=class{constructor(s,i){this.tensorManager=s,this.wrapper=i}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(s,i,o,d){let m=i,C=this.tensorManager.getMLContext(s),b=m==="int64"&&!C.opSupportLimits().input.dataTypes.includes("int64");if(b&&(m="int32",SA("verbose",()=>"[WebNN] TensorIdTracker.ensureTensor: convert dataType from int64 to int32")),this.wrapper){if(this.wrapper.canReuseTensor(C,m,o))return this.wrapper.tensor;if(d){if(this.wrapper.byteLength!==gc(m,o))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let w=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(s,m,o,w,!0,!0,b),d&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(s){let i=s;if(this.wrapper)if(this.wrapper.shouldConvertInt64toInt32&&(i=$c(s,!0),this.wrapper.setIsInt64ToInt32Converted(!0)),i.byteLength===this.wrapper.byteLength){this.wrapper.write(i);return}else SA("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor();this.activeUpload?this.activeUpload.set(i):this.activeUpload=new Uint8Array(i)}async download(s){if(this.activeUpload){let i=this.wrapper?.isInt64ToInt32Converted?uc(this.activeUpload):this.activeUpload;if(s){s instanceof ArrayBuffer?new Uint8Array(s).set(i):new Uint8Array(s.buffer,s.byteOffset,s.byteLength).set(i);return}else return i.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return s?this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32,s):this.wrapper.read(this.wrapper?.shouldConvertInt64toInt32)}},Df=class{constructor(s){this.backend=s,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(s){let i=this.backend.getMLContext(s);if(!i)throw new Error("MLContext not found for session.");return i}reserveTensorId(){let s=dc();return this.tensorTrackersById.set(s,new pc(this)),s}releaseTensorId(s){let i=this.tensorTrackersById.get(s);i&&(this.tensorTrackersById.delete(s),i.tensorWrapper&&this.releaseTensor(i.tensorWrapper))}async ensureTensor(s,i,o,d,m){SA("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${i}, dataType: ${o}, shape: ${d}, copyOld: ${m}}`);let C=this.tensorTrackersById.get(i);if(!C)throw new Error("Tensor not found.");return C.ensureTensor(s,o,d,m)}upload(s,i){let o=this.tensorTrackersById.get(s);if(!o)throw new Error("Tensor not found.");o.upload(i)}async download(s,i){SA("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${s}, dstBuffer: ${i?.byteLength}}`);let o=this.tensorTrackersById.get(s);if(!o)throw new Error("Tensor not found.");return o.download(i)}releaseTensorsForSession(s){for(let i of this.freeTensors)i.sessionId===s&&i.destroy();this.freeTensors=this.freeTensors.filter(i=>i.sessionId!==s)}registerTensor(s,i,o,d){let m=this.getMLContext(s),C=dc(),b=new fc({sessionId:s,context:m,tensor:i,dataType:o,shape:d});return this.tensorTrackersById.set(C,new pc(this,b)),this.externalTensors.add(b),C}async getCachedTensor(s,i,o,d,m,C,b=!1){let w=this.getMLContext(s);for(let[x,D]of this.freeTensors.entries())if(D.canReuseTensor(w,i,o)){SA("verbose",()=>`[WebNN] Reusing tensor {dataType: ${i}, shape: ${o}}`);let _=this.freeTensors.splice(x,1)[0];return _.sessionId=s,_}SA("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${i}, shape: ${o}}`);let M=await w.createTensor({dataType:i,shape:o,dimensions:o,usage:d,writable:m,readable:C});return new fc({sessionId:s,context:w,tensor:M,dataType:i,shape:o,shouldConvertInt64toInt32:b})}releaseTensor(s){this.externalTensors.has(s)&&this.externalTensors.delete(s),this.freeTensors.push(s)}},Ih=(...s)=>new Df(...s)}),B0,Tf,wh,y6=Mt(()=>{"use strict";lA(),Pi(),Ch(),B6(),xo(),B0=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Tf=(s,i)=>{if(s===i)return!0;if(s===void 0||i===void 0)return!1;let o=Object.keys(s).sort(),d=Object.keys(i).sort();return o.length===d.length&&o.every((m,C)=>m===d[C]&&s[m]===i[m])},wh=class{constructor(s){this.tensorManager=Ih(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.temporaryGraphInputs=[],this.temporarySessionTensorIds=new Map,x2(s.logLevel,!!s.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(s){SA("verbose",()=>`[WebNN] onRunStart {sessionId: ${s}}`),this.activeSessionId=s}onRunEnd(s){SA("verbose",()=>`[WebNN] onRunEnd {sessionId: ${s}}`);let i=this.temporarySessionTensorIds.get(s);if(i){for(let o of i)SA("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${o}}`),this.tensorManager.releaseTensorId(o);this.temporarySessionTensorIds.delete(s),this.activeSessionId=void 0}}async createMLContext(s){if(s instanceof GPUDevice){let o=this.mlContextCache.findIndex(d=>d.gpuDevice===s);if(o!==-1)return this.mlContextCache[o].mlContext;{let d=await navigator.ml.createContext(s);return this.mlContextCache.push({gpuDevice:s,mlContext:d}),d}}else if(s===void 0){let o=this.mlContextCache.findIndex(d=>d.options===void 0&&d.gpuDevice===void 0);if(o!==-1)return this.mlContextCache[o].mlContext;{let d=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:d}),d}}let i=this.mlContextCache.findIndex(o=>Tf(o.options,s));if(i!==-1)return this.mlContextCache[i].mlContext;{let o=await navigator.ml.createContext(s);return this.mlContextCache.push({options:s,mlContext:o}),o}}registerMLContext(s,i){this.mlContextBySessionId.set(s,i);let o=this.sessionIdsByMLContext.get(i);o||(o=new Set,this.sessionIdsByMLContext.set(i,o)),o.add(s),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(s,this.temporaryGraphInputs),this.temporaryGraphInputs=[])}onReleaseSession(s){this.sessionGraphInputs.delete(s);let i=this.mlContextBySessionId.get(s);if(!i)return;this.tensorManager.releaseTensorsForSession(s),this.mlContextBySessionId.delete(s);let o=this.sessionIdsByMLContext.get(i);if(o.delete(s),o.size===0){this.sessionIdsByMLContext.delete(i);let d=this.mlContextCache.findIndex(m=>m.mlContext===i);d!==-1&&this.mlContextCache.splice(d,1)}}getMLContext(s){return this.mlContextBySessionId.get(s)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(s){SA("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${s}}`),this.tensorManager.releaseTensorId(s)}async ensureTensor(s,i,o,d,m){let C=B0.get(o);if(!C)throw new Error(`Unsupported ONNX data type: ${o}`);return this.tensorManager.ensureTensor(s??this.currentSessionId,i,C,d,m)}async createTemporaryTensor(s,i,o){SA("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${i}, shape: ${o}}`);let d=B0.get(i);if(!d)throw new Error(`Unsupported ONNX data type: ${i}`);let m=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(s,m,d,o,!1);let C=this.temporarySessionTensorIds.get(s);return C?C.push(m):this.temporarySessionTensorIds.set(s,[m]),m}uploadTensor(s,i){if(!mr().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");SA("verbose",()=>`[WebNN] uploadTensor {tensorId: ${s}, data: ${i.byteLength}}`),this.tensorManager.upload(s,i)}async downloadTensor(s,i){return this.tensorManager.download(s,i)}createMLTensorDownloader(s,i){return async()=>{let o=await this.tensorManager.download(s);return v2(o,i)}}registerMLTensor(s,i,o,d){let m=B0.get(o);if(!m)throw new Error(`Unsupported ONNX data type: ${o}`);let C=this.tensorManager.registerTensor(s,i,m,d);return SA("verbose",()=>`[WebNN] registerMLTensor {tensor: ${i}, dataType: ${m}, dimensions: ${d}} -> {tensorId: ${C}}`),C}registerMLConstant(s,i,o,d,m,C,b=!1){if(!C)throw new Error("External mounted files are not available.");let w=s;s.startsWith("./")&&(w=s.substring(2));let M=C.get(w);if(!M)throw new Error(`File with name ${w} not found in preloaded files.`);if(i+o>M.byteLength)throw new Error("Out of bounds: data offset and length exceed the external file data size.");let x=M.slice(i,i+o).buffer,D;switch(m.dataType){case"float32":D=new Float32Array(x);break;case"float16":D=typeof Float16Array<"u"&&Float16Array.from?new Float16Array(x):new Uint16Array(x);break;case"int32":D=new Int32Array(x);break;case"uint32":D=new Uint32Array(x);break;case"int64":b?(D=$c(new Uint8Array(x),!1),m.dataType="int32"):D=new BigInt64Array(x);break;case"uint64":D=new BigUint64Array(x);break;case"int8":D=new Int8Array(x);break;case"int4":case"uint4":case"uint8":D=new Uint8Array(x);break;default:throw new Error(`Unsupported data type: ${m.dataType} in creating WebNN Constant from external data.`)}return SA("verbose",()=>`[WebNN] registerMLConstant {dataType: ${m.dataType}, shape: ${m.shape}}} ${b?"(Note: it was int64 data type and registered to int32 as workaround)":""}`),d.constant(m,D)}registerGraphInput(s){this.temporaryGraphInputs.push(s)}isGraphInput(s,i){let o=this.sessionGraphInputs.get(s);return o?o.includes(i):!1}isInt64Supported(s){return!!this.mlContextBySessionId.get(s)?.opSupportLimits().input.dataTypes.includes("int64")}flush(){}}}),E2=Mt(()=>{"use strict"}),mc,y0,D0,Pf,Gf,hc,e2,Ff,kh,D6=Mt(()=>{"use strict";xo(),E2(),mc=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),y0=[],D0=s=>Math.ceil(Number(s)/16)*16,Pf=s=>{for(let i=0;i<y0.length;i++){let o=y0[i];if(s<=o)return o}return Math.ceil(s/16)*16},Gf=1,hc=()=>Gf++,e2=async(s,i,o,d)=>{let m=D0(o),C=s.device.createBuffer({size:m,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let b=s.getCommandEncoder();s.endComputePass(),b.copyBufferToBuffer(i,0,C,0,m),s.flush(),await C.mapAsync(GPUMapMode.READ);let w=C.getMappedRange();if(d){let M=d();return M.set(new Uint8Array(w,0,o)),M}else return new Uint8Array(w.slice(0,o))}finally{C.destroy()}},Ff=class{constructor(s){this.backend=s,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[i]of mc)y0.push(i),this.freeBuffers.set(i,[]),this.freeUniformBuffers.set(i,[]);this.sessionCount=0}upload(s,i){let o=i.buffer,d=i.byteOffset,m=i.byteLength,C=D0(m),b=this.storageCache.get(s);if(!b)throw new Error("gpu data for uploading does not exist");if(Number(b.originalSize)!==m)throw new Error(`inconsistent data size. gpu data size=${b.originalSize}, data size=${m}`);let w=this.backend.device.createBuffer({mappedAtCreation:!0,size:C,usage:GPUBufferUsage.MAP_WRITE|GPUBufferUsage.COPY_SRC}),M=w.getMappedRange();new Uint8Array(M).set(new Uint8Array(o,d,m)),w.unmap();let x=this.backend.device.createCommandEncoder();x.copyBufferToBuffer(w,0,b.gpuData.buffer,0,C),this.backend.device.queue.submit([x.finish()]),w.destroy(),SA("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${s})`)}memcpy(s,i){let o=this.storageCache.get(s);if(!o)throw new Error("source gpu data for memcpy does not exist");let d=this.storageCache.get(i);if(!d)throw new Error("destination gpu data for memcpy does not exist");if(o.originalSize!==d.originalSize)throw new Error("inconsistent source and destination gpu data size");let m=D0(o.originalSize),C=this.backend.getCommandEncoder();this.backend.endComputePass(),C.copyBufferToBuffer(o.gpuData.buffer,0,d.gpuData.buffer,0,m)}registerExternalBuffer(s,i,o){let d;if(o){if(d=o[0],s===o[1])return SA("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${i}) => id=${d}, buffer is the same, skip.`),d;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else d=hc();return this.storageCache.set(d,{gpuData:{id:d,type:0,buffer:s},originalSize:i}),SA("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${i}) => id=${d}, registered.`),d}unregisterExternalBuffer(s){s!==void 0&&(this.storageCache.delete(s),SA("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${s}`))}create(s,i=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let o=Pf(s),d,m=(i&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,C=(i&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(m||C){let w=(m?this.freeBuffers:this.freeUniformBuffers).get(o);w?w.length>0?d=w.pop():d=this.backend.device.createBuffer({size:o,usage:i}):d=this.backend.device.createBuffer({size:o,usage:i})}else d=this.backend.device.createBuffer({size:o,usage:i});let b={id:hc(),type:0,buffer:d};return this.storageCache.set(b.id,{gpuData:b,originalSize:Number(s)}),SA("verbose",()=>`[WebGPU] GpuDataManager.create(size=${s}) => id=${b.id}`),b}get(s){return this.storageCache.get(s)?.gpuData}release(s){let i=typeof s=="bigint"?Number(s):s,o=this.storageCache.get(i);if(!o){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return SA("verbose",()=>`[WebGPU] GpuDataManager.release(id=${i}), gpuDataId=${o.gpuData.id}`),this.storageCache.delete(i),this.buffersPending.push(o.gpuData.buffer),o.originalSize}async download(s,i){let o=this.storageCache.get(Number(s));if(!o)throw new Error("data does not exist");await e2(this.backend,o.gpuData.buffer,o.originalSize,i)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let s of this.buffersPending){let i=mc.get(s.size);if((s.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let o=this.freeBuffers.get(s.size)||[];i===void 0||o.length>=i?s.destroy():o.push(s)}else if((s.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let o=this.freeUniformBuffers.get(s.size)||[];i===void 0||o.length>=i?s.destroy():o.push(s)}else s.destroy()}this.buffersPending=[]}else{let s=this.capturedPendingBuffers.get(this.backend.currentSessionId);s||(s=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,s));for(let i of this.buffersPending)s.push(i);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(s=>{s.forEach(i=>{i.destroy()})}),this.freeUniformBuffers.forEach(s=>{s.forEach(i=>{i.destroy()})}),this.storageCache.forEach(s=>{s.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(s=>{s.forEach(i=>{i.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(s){let i=this.capturedPendingBuffers.get(s);i&&(i.forEach(o=>{o.destroy()}),this.capturedPendingBuffers.delete(s)),this.sessionCount-=1,this.sessionCount===0&&(SA("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(o=>{o.gpuData.buffer.destroy()}),this.storageCache=new Map)}},kh=(...s)=>new Ff(...s)}),Qf,YA,Kr=Mt(()=>{"use strict";Qf=class{constructor(s){Object.assign(this,s)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(s=>`${this[s]}`).join(";")),this.key}},YA=s=>new Qf(s)}),on,T0,ha,Fa,$t,zr,t2,an,Jo,Jt,Sn,st,Xt,Mh,_2,Sf,xh,kA=Mt(()=>{"use strict";lA(),IA(),on=64,T0=(s,i)=>{if(i===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(s)){case 10:return i>1?`vec${i}<f16>`:"f16";case 1:return i>1?`vec${i}<f32>`:"f32";case 6:return i>1?`vec${i}<i32>`:"i32";case 12:return i>1?`vec${i}<u32>`:"u32";case 7:if(i>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(i>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(i!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${s}`)}},ha=(s,i=1)=>{let o=T0(s,i);return typeof o=="string"?o:o[0]},Fa=(s,i=1)=>{let o=T0(s,i);return typeof o=="string"?o:o[1]},$t=(...s)=>{let i=[];return s.forEach(o=>{o.length!==0&&i.push({type:12,data:o},{type:12,data:Ye.computeStrides(o)})}),i},zr=s=>s%4===0?4:s%2===0?2:1,t2=(s="f32",i,o="0")=>!i||i===1?`${s}(${o})`:`vec${i}<${s}>(${o})`,an=(s,i,o)=>s==="f32"?o:i===1?`f32(${o})`:`vec${i}<f32>(${o})`,Jo=(s,i)=>i===4?`(${s}.x + ${s}.y + ${s}.z + ${s}.w)`:i===2?`(${s}.x + ${s}.y)`:i===3?`(${s}.x + ${s}.y + ${s}.z)`:s,Jt=(s,i,o,d)=>s.startsWith("uniforms.")&&o>4?typeof i=="string"?d==="f16"?`${s}[(${i}) / 8][(${i}) % 8 / 4][(${i}) % 8 % 4]`:`${s}[(${i}) / 4][(${i}) % 4]`:d==="f16"?`${s}[${Math.floor(i/8)}][${Math.floor(i%8/4)}][${i%8%4}]`:`${s}[${Math.floor(i/4)}][${i%4}]`:o>1?`${s}[${i}]`:s,Sn=(s,i,o,d,m)=>{let C=typeof o=="number",b=C?o:o.length,w=[...new Array(b).keys()],M=b<2?"u32":b<=4?`vec${b}<u32>`:`array<u32, ${b}>`,x=T0(i,m),D=typeof x=="string"?x:x[1],_=typeof x=="string"?x:x[0],v={indices:M,value:D,storage:_,tensor:i},Q=xe=>typeof xe=="string"?xe:`${xe}u`,F={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},j=C?"uniforms.":"",X=`${j}${s}_shape`,R=`${j}${s}_strides`,L="";for(let xe=0;xe<b-1;xe++)L+=`
    let dim${xe} = current / ${Jt(R,xe,b)};
    let rest${xe} = current % ${Jt(R,xe,b)};
    indices[${xe}] = dim${xe};
    current = rest${xe};
    `;L+=`indices[${b-1}] = current;`;let K=b<2?"":`
  fn o2i_${s}(offset: u32) -> ${v.indices} {
    var indices: ${v.indices};
    var current = offset;
    ${L}
    return indices;
  }`,g=xe=>(F.offsetToIndices=!0,b<2?xe:`o2i_${s}(${xe})`),k=[];if(b>=2)for(let xe=b-1;xe>=0;xe--)k.push(`${Jt(R,xe,b)} * (indices[${xe}])`);let e=b<2?"":`
  fn i2o_${s}(indices: ${v.indices}) -> u32 {
    return ${k.join("+")};
  }`,u=xe=>(F.indicesToOffset=!0,b<2?xe:`i2o_${s}(${xe})`),B=(...xe)=>b===0?"0u":`${v.indices}(${xe.map(Q).join(",")})`,q=(xe,Ce)=>b<2?`${xe}`:`${Jt(xe,Ce,b)}`,y=(xe,Ce,ie)=>b<2?`${xe}=${ie};`:`${Jt(xe,Ce,b)}=${ie};`,S={},ge=(xe,Ce)=>{F.broadcastedIndicesToOffset=!0;let ie=`${Ce.name}broadcastedIndicesTo${s}Offset`;if(ie in S)return`${ie}(${xe})`;let ae=[];for(let Ee=b-1;Ee>=0;Ee--){let Le=Ce.indicesGet("outputIndices",Ee+Ce.rank-b);ae.push(`${q(R,Ee)} * (${Le} % ${q(X,Ee)})`)}return S[ie]=`fn ${ie}(outputIndices: ${Ce.type.indices}) -> u32 {
             return ${ae.length>0?ae.join("+"):"0u"};
           }`,`${ie}(${xe})`},Ae=(xe,Ce)=>(()=>{if(v.storage===v.value)return`${s}[${xe}]=${Ce};`;if(v.storage==="vec2<u32>"&&v.value==="i32")return`${s}[${xe}]=vec2<u32>(u32(${Ce}), select(0u, 0xFFFFFFFFu, ${Ce} < 0));`;if(v.storage==="vec2<u32>"&&v.value==="u32")return`${s}[${xe}]=vec2<u32>(u32(${Ce}), 0u);`;if(v.storage==="u32"&&v.value==="vec4<bool>")return`${s}[${xe}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${Ce}));`;throw new Error(`not supported combination of storage type ${v.storage} and value type ${v.value} yet`)})(),me=xe=>(()=>{if(v.storage===v.value)return`${s}[${xe}]`;if(v.storage==="vec2<u32>"&&v.value==="i32")return`i32(${s}[${xe}].x)`;if(v.storage==="vec2<u32>"&&v.value==="u32")return`u32(${s}[${xe}].x)`;if(v.storage==="u32"&&v.value==="vec4<bool>")return`vec4<bool>(bool(${s}[${xe}] & 0xFFu), bool(${s}[${xe}] & 0xFF00u), bool(${s}[${xe}] & 0xFF0000u), bool(${s}[${xe}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${v.storage} and value type ${v.value} yet`)})(),Me=b<2?"":`
  fn get_${s}ByIndices(indices: ${v.indices}) -> ${D} {
    return ${me(`i2o_${s}(indices)`)};
  }`,Ie=b<2?"":(()=>{let xe=w.map(ie=>`d${ie}: u32`).join(", "),Ce=w.map(ie=>`d${ie}`).join(", ");return`
  fn get_${s}(${xe}) -> ${D} {
    return get_${s}ByIndices(${B(Ce)});
  }`})(),_e=(...xe)=>{if(xe.length!==b)throw new Error(`indices length must be ${b}`);let Ce=xe.map(Q).join(",");return b===0?me("0u"):b===1?me(Ce[0]):(F.get=!0,F.getByIndices=!0,F.indicesToOffset=!0,`get_${s}(${Ce})`)},ye=xe=>b<2?me(xe):(F.getByIndices=!0,F.indicesToOffset=!0,`get_${s}ByIndices(${xe})`),Ge=b<2?"":`
  fn set_${s}ByIndices(indices: ${v.indices}, value: ${D}) {
    ${Ae(`i2o_${s}(indices)`,"value")}
  }`,qe=b<2?"":(()=>{let xe=w.map(ie=>`d${ie}: u32`).join(", "),Ce=w.map(ie=>`d${ie}`).join(", ");return`
  fn set_${s}(${xe}, value: ${D}) {
    set_${s}ByIndices(${B(Ce)}, value);
  }`})();return{impl:()=>{let xe=[],Ce=!1;return F.offsetToIndices&&(xe.push(K),Ce=!0),F.indicesToOffset&&(xe.push(e),Ce=!0),F.broadcastedIndicesToOffset&&(Object.values(S).forEach(ie=>xe.push(ie)),Ce=!0),F.set&&(xe.push(qe),Ce=!0),F.setByIndices&&(xe.push(Ge),Ce=!0),F.get&&(xe.push(Ie),Ce=!0),F.getByIndices&&(xe.push(Me),Ce=!0),!C&&Ce&&xe.unshift(`const ${X} = ${v.indices}(${o.join(",")});`,`const ${R} = ${v.indices}(${Ye.computeStrides(o).join(",")});`),xe.join(`
`)},type:v,offsetToIndices:g,indicesToOffset:u,broadcastedIndicesToOffset:ge,indices:B,indicesGet:q,indicesSet:y,set:(...xe)=>{if(xe.length!==b+1)throw new Error(`indices length must be ${b}`);let Ce=xe[b];if(typeof Ce!="string")throw new Error("value must be string");let ie=xe.slice(0,b).map(Q).join(",");return b===0?Ae("0u",Ce):b===1?Ae(ie[0],Ce):(F.set=!0,F.setByIndices=!0,F.indicesToOffset=!0,`set_${s}(${ie}, ${Ce})`)},setByOffset:Ae,setByIndices:(xe,Ce)=>b<2?Ae(xe,Ce):(F.setByIndices=!0,F.indicesToOffset=!0,`set_${s}ByIndices(${xe}, ${Ce});`),get:_e,getByOffset:me,getByIndices:ye,usage:d,name:s,strides:R,shape:X,rank:b}},st=(s,i,o,d=1)=>Sn(s,i,o,"input",d),Xt=(s,i,o,d=1)=>Sn(s,i,o,"output",d),Mh=(s,i,o)=>Sn(s,i,o,"atomicOutput",1),_2=(s,i,o,d=1)=>Sn(s,i,o,"internal",d),Sf=class{constructor(s,i){this.normalizedDispatchGroup=s,this.limits=i,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(s){return`if (global_idx >= ${typeof s=="number"?`${s}u`:s}) { return; }`}mainStart(s=on){let i=typeof s=="number"?s:s[0],o=typeof s=="number"?1:s[1],d=typeof s=="number"?1:s[2];if(i>this.limits.maxComputeWorkgroupSizeX||o>this.limits.maxComputeWorkgroupSizeY||d>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${i}, ${o}, ${d}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(i*o*d>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${i}, ${o}, ${d}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let m=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,C=m?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,b=m?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${i*o*d}u + local_idx;`;return`@compute @workgroup_size(${i}, ${o}, ${d})
  fn main(${C}) {
    ${b}
  `}appendVariableUniforms(s){s.rank!==0&&(s.shape.startsWith("uniforms.")&&this.uniforms.push({name:s.shape.replace("uniforms.",""),type:"u32",length:s.rank}),s.strides.startsWith("uniforms.")&&this.uniforms.push({name:s.strides.replace("uniforms.",""),type:"u32",length:s.rank}))}declareVariable(s,i){if(s.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(s),this.appendVariableUniforms(s);let o=s.usage==="input"?"read":"read_write",d=s.usage==="atomicOutput"?"atomic<i32>":s.type.storage;return`@group(0) @binding(${i}) var<storage, ${o}> ${s.name}: array<${d}>;`}declareVariables(...s){return s.map(i=>this.declareVariable(i,this.variableIndex++)).join(`
`)}registerInternalVariable(s){if(s.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(s),this.appendVariableUniforms(s)}registerInternalVariables(...s){return s.forEach(i=>this.registerInternalVariable(i)),this}registerUniform(s,i,o=1){return this.uniforms.push({name:s,type:i,length:o}),this}registerUniforms(s){return this.uniforms=this.uniforms.concat(s),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let s=[];for(let{name:i,type:o,length:d}of this.uniforms)if(d&&d>4)o==="f16"?s.push(`@align(16) ${i}:array<mat2x4<${o}>, ${Math.ceil(d/8)}>`):s.push(`${i}:array<vec4<${o}>, ${Math.ceil(d/4)}>`);else{let m=d==null||d===1?o:`vec${d}<${o}>`;s.push(`${i}:${m}`)}return`
      struct Uniforms { ${s.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(s=>s.impl()).join(`
`)+this.internalVariables.map(s=>s.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let s=i=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(i)];return this.uniforms.map(i=>[s(i.type),i.length??1])}},xh=(s,i)=>new Sf(s,i)}),Of,bc,Lf,Nf,zf,Rf,fs,vh,Eh,qo=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Of=(s,i)=>{if(!s||s.length!==1)throw new Error("Transpose requires 1 input.");if(i.length!==0&&i.length!==s[0].dims.length)throw new Error(`perm size ${i.length} does not match input rank ${s[0].dims.length}`)},bc=(s,i)=>i.length!==0?i:[...new Array(s).keys()].reverse(),Lf=(s,i)=>Ye.sortBasedOnPerm(s,bc(s.length,i)),Nf=(s,i,o,d)=>{let m=`fn perm(i: ${d.type.indices}) -> ${o.type.indices} {
    var a: ${o.type.indices};`;for(let C=0;C<i;++C)m+=`a[${s[C]}]=i[${C}];`;return m+="return a;}"},zf=(s,i)=>{let o=[],d=[];for(let m=0;m<s.length;++m)s[m]!==1&&o.push(s[m]),s[i[m]]!==1&&d.push(i[m]);return{newShape:o,newPerm:d}},Rf=(s,i)=>{let o=0;for(let d=0;d<s.length;++d)if(i[s[d]]!==1){if(s[d]<o)return!1;o=s[d]}return!0},fs=(s,i)=>{let o=s.dataType,d=s.dims.length,m=bc(d,i),C=Lf(s.dims,m),b=s.dims,w=C,M=d<2||Rf(m,s.dims),x;if(M)return x=F=>{let j=st("input",o,b,4),X=Xt("output",o,w,4);return`
  ${F.registerUniform("output_size","u32").declareVariables(j,X)}
  ${F.mainStart()}
    ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let F=Ye.size(C);return{outputs:[{dims:C,dataType:s.dataType}],dispatchGroup:{x:Math.ceil(F/64/4)},programUniforms:[{type:12,data:Math.ceil(F/4)}]}},getShaderSource:x};let{newShape:D,newPerm:_}=zf(s.dims,m),v=Ye.areEqual(_,[2,3,1]),Q=Ye.areEqual(_,[3,1,2]);if(D.length===2||v||Q){b=v?[D[0],D[1]*D[2]]:Q?[D[0]*D[1],D[2]]:D,w=[b[1],b[0]];let F=16;return x=j=>{let X=st("a",o,b.length),R=Xt("output",o,w.length);return`
  ${j.registerUniform("output_size","u32").declareVariables(X,R)}
  var<workgroup> tile : array<array<${R.type.value}, ${F+1}>, ${F}>;
  ${j.mainStart([F,F,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${F} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${F}u + local_id.x;
    let input_row = workgroup_id_x * ${F}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${X.getByIndices(`${X.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${F}u + local_id.x;
    let output_row = workgroup_id_y * ${F}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${R.setByIndices(`${R.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let j=Ye.size(C);return{outputs:[{dims:C,dataType:s.dataType}],dispatchGroup:{x:Math.ceil(w[1]/F),y:Math.ceil(w[0]/F)},programUniforms:[{type:12,data:j},...$t(b,w)]}},getShaderSource:x}}return x=F=>{let j=st("a",o,b.length),X=Xt("output",o,w.length);return`
  ${F.registerUniform("output_size","u32").declareVariables(j,X)}

  ${Nf(m,d,j,X)}

  ${F.mainStart()}
    ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${X.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${X.setByOffset("global_idx",j.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${i}`,inputDependencies:["rank"]},getRunData:()=>{let F=Ye.size(C);return{outputs:[{dims:C,dataType:s.dataType}],dispatchGroup:{x:Math.ceil(F/64)},programUniforms:[{type:12,data:F},...$t(b,w)]}},getShaderSource:x}},vh=(s,i)=>{Of(s.inputs,i.perm),s.compute(fs(s.inputs[0],i.perm))},Eh=s=>YA({perm:s.perm})}),jf,Wf,Vf,Yf,Hf,Uf,Kf,Xf,Zf,Jf,Qs,_h,Bh,yh,Dh,Th,Ph,Gh,Fh,Qh,Sh,T6=Mt(()=>{"use strict";lA(),IA(),kA(),B2(),qo(),jf={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Wf={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Vf={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Yf={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},Hf=(s,i)=>{let o=[];for(let d=i-s;d<i;++d)o.push(d);return o},Uf=(s,i)=>{let o=[],d=s.length;for(let C=0;C<d;C++)i.indexOf(C)===-1&&o.push(s[C]);let m=i.map(C=>s[C]);return[o,m]},Kf=(s,i)=>{let o=s.length+i.length,d=[],m=0;for(let C=0;C<o;C++)i.indexOf(C)===-1?d.push(s[m++]):d.push(1);return d},Xf=(s,i)=>{for(let o=0;o<s.length;++o)if(s[s.length-o-1]!==i-1-o)return!1;return!0},Zf=(s,i)=>{let o=[];if(!Xf(s,i)){for(let d=0;d<i;++d)s.indexOf(d)===-1&&o.push(d);s.forEach(d=>o.push(d))}return o},Jf=(s,i,o,d,m,C,b)=>{let w=o[0].dims,M=Ye.size(C),x=Ye.size(b),D=st("_A",o[0].dataType,w),_=Xt("output",m,C),v=64;M===1&&(v=256);let Q=`
          var<workgroup> aBestValues : array<f32, ${v}>;
       `,F=j=>`
        ${j.registerUniform("reduceSize","u32").declareVariables(D,_)}
        ${Q}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${j.mainStart(v)}

          let outputIndex = global_idx / ${v};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Vf[d]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${v}) {
           let candidate = f32(${D.getByOffset("offset + k")});
           bestValue = ${jf[d]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${v}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Wf[d]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${_.setByOffset("outputIndex",`${d==="mean"?`${_.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${_.type.storage}(${Yf[d]})`}`)};
         }
        }`;return{name:s,shaderCache:{hint:`${i};${v}`,inputDependencies:["type"]},getShaderSource:F,getRunData:()=>({outputs:[{dims:C,dataType:m}],dispatchGroup:{x:M},programUniforms:[{type:12,data:x}]})}},Qs=(s,i,o,d)=>{let m=s.inputs.length===1?o:A2(s.inputs,o),C=m.axes;C.length===0&&!m.noopWithEmptyAxes&&(C=s.inputs[0].dims.map((Q,F)=>F));let b=Ye.normalizeAxes(C,s.inputs[0].dims.length),w=b,M=s.inputs[0],x=Zf(w,s.inputs[0].dims.length);x.length>0&&(M=s.compute(fs(s.inputs[0],x),{inputs:[0],outputs:[-1]})[0],w=Hf(w.length,M.dims.length));let[D,_]=Uf(M.dims,w),v=D;m.keepDims&&(v=Kf(D,b)),s.compute(Jf(i,m.cacheKey,[M],d,s.inputs[0].dataType,v,_),{inputs:[M]})},_h=(s,i)=>{Qs(s,"ReduceMeanShared",i,"mean")},Bh=(s,i)=>{Qs(s,"ReduceL1Shared",i,"l1")},yh=(s,i)=>{Qs(s,"ReduceL2Shared",i,"l2")},Dh=(s,i)=>{Qs(s,"ReduceLogSumExpShared",i,"logSumExp")},Th=(s,i)=>{Qs(s,"ReduceMaxShared",i,"max")},Ph=(s,i)=>{Qs(s,"ReduceMinShared",i,"min")},Gh=(s,i)=>{Qs(s,"ReduceProdShared",i,"prod")},Fh=(s,i)=>{Qs(s,"ReduceSumShared",i,"sum")},Qh=(s,i)=>{Qs(s,"ReduceSumSquareShared",i,"sumSquare")},Sh=(s,i)=>{Qs(s,"ReduceLogSumShared",i,"logSum")}}),Ss,qf,V0,A2,Os,$f,ep,tp,Ap,rp,ap,sp,op,ip,np,Ls,Oh,Lh,Nh,zh,Rh,jh,Wh,Vh,Yh,Hh,B2=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),T6(),Ss=s=>{if(!s||s.length===0||s.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(s.length===2&&s[1].dims.length!==1)throw new Error("Invalid axes input dims.")},qf=s=>["","",`var value = ${s.getByIndices("input_indices")};`,""],V0=(s,i,o,d,m,C,b=!1,w=!1)=>{let M=[],x=o[0].dims,D=x.length,_=Ye.normalizeAxes(m,D),v=!w&&_.length===0;x.forEach((j,X)=>{v||_.indexOf(X)>=0?b&&M.push(1):M.push(j)});let Q=M.length,F=Ye.size(M);return{name:s,shaderCache:i,getShaderSource:j=>{let X=[],R=st("_A",o[0].dataType,D),L=Xt("output",C,Q),K=d(R,L,_),g=K[2];for(let k=0,e=0;k<D;k++)v||_.indexOf(k)>=0?(b&&e++,g=`for(var j${k}: u32 = 0; j${k} < ${x[k]}; j${k}++) {
                  ${K[2].includes("last_index")?`let last_index = j${k};`:""}
                  ${R.indicesSet("input_indices",k,`j${k}`)}
                  ${g}
                }`):(X.push(`${R.indicesSet("input_indices",k,L.indicesGet("output_indices",e))};`),e++);return`

        ${j.registerUniform("output_size","u32").declareVariables(R,L)}

        ${j.mainStart()}
          ${j.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${R.type.indices};
          let output_indices = ${L.offsetToIndices("global_idx")};

          ${X.join(`
`)}
          ${K[0]}       // init ops for reduce max/min
          ${K[1]}
          ${g}
          ${K[3]}
          ${K.length===4?L.setByOffset("global_idx","value"):K.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:M,dataType:C}],dispatchGroup:{x:Math.ceil(F/64)},programUniforms:[{type:12,data:F},...$t(x,M)]})}},A2=(s,i)=>{let o=[];return s[1].dims[0]>0&&s[1].getBigInt64Array().forEach(d=>o.push(Number(d))),YA({axes:o,keepDims:i.keepDims,noopWithEmptyAxes:i.noopWithEmptyAxes})},Os=(s,i,o,d)=>{let m=s.inputs,C=m.length===1?o:A2(m,o);s.compute(V0(i,{hint:C.cacheKey,inputDependencies:["rank"]},[m[0]],C.noopWithEmptyAxes&&C.axes.length===0?qf:d,C.axes,m[0].dataType,C.keepDims,C.noopWithEmptyAxes),{inputs:[0]})},$f=(s,i)=>{Ss(s.inputs),Os(s,"ReduceLogSum",i,(o,d)=>[`var value = ${d.type.storage}(0);`,"",`value += ${o.getByIndices("input_indices")};`,"value = log(value);"])},ep=(s,i)=>{Ss(s.inputs),Os(s,"ReduceL1",i,(o,d)=>[`var value = ${d.type.storage}(0);`,"",`value += abs(${o.getByIndices("input_indices")});`,""])},tp=(s,i)=>{Ss(s.inputs),Os(s,"ReduceL2",i,(o,d)=>[`var t = ${d.type.value}(0); var value = ${d.type.value}(0);`,"",`t = ${o.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ap=(s,i)=>{Ss(s.inputs),Os(s,"ReduceLogSumExp",i,(o,d)=>[`var value = ${d.type.storage}(0);`,"",`value += exp(${o.getByIndices("input_indices")});`,"value = log(value);"])},rp=(s,i)=>{Ss(s.inputs),Os(s,"ReduceMax",i,(o,d,m)=>{let C=[];for(let b=0;b<o.rank;b++)(m.indexOf(b)>=0||m.length===0)&&C.push(o.indicesSet("input_indices",b,0));return[`${C.join(`
`)}`,`var value = ${o.getByIndices("input_indices")};`,`value = max(value, ${o.getByIndices("input_indices")});`,""]})},ap=(s,i)=>{Ss(s.inputs),Os(s,"ReduceMean",i,(o,d,m)=>{let C=1;for(let b=0;b<o.rank;b++)(m.indexOf(b)>=0||m.length===0)&&(C*=s.inputs[0].dims[b]);return["var sum = f32(0);","",`sum += f32(${o.getByIndices("input_indices")});`,`let value = ${d.type.value}(sum / ${C});`]})},sp=(s,i)=>{Ss(s.inputs),Os(s,"ReduceMin",i,(o,d,m)=>{let C=[];for(let b=0;b<o.rank;b++)(m.indexOf(b)>=0||m.length===0)&&C.push(`input_indices[${b}] = 0;`);return[`${C.join(`
`)}`,`var value = ${o.getByIndices("input_indices")};`,`value = min(value, ${o.getByIndices("input_indices")});`,""]})},op=(s,i)=>{Ss(s.inputs),Os(s,"ReduceProd",i,(o,d)=>[`var value = ${d.type.storage}(1);`,"",`value *= ${o.getByIndices("input_indices")};`,""])},ip=(s,i)=>{Ss(s.inputs),Os(s,"ReduceSum",i,(o,d)=>[`var value = ${d.type.storage}(0);`,"",`value += ${o.getByIndices("input_indices")};`,""])},np=(s,i)=>{Ss(s.inputs),Os(s,"ReduceSumSquare",i,(o,d)=>[`var t = ${d.type.value}(0); var value = ${d.type.value}(0);`,"",`t = ${o.getByIndices("input_indices")}; value += t * t;`,""])},Ls=(s,i,o)=>{if(i.length===0)return o;let d=1,m=1;for(let C=0;C<i.length;C++)i.indexOf(C)===-1?d*=s[C]:m*=s[C];return m<32&&d>1024},Oh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?ap(s,i):_h(s,i)},Lh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?ep(s,i):Bh(s,i)},Nh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?tp(s,i):yh(s,i)},zh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?Ap(s,i):Dh(s,i)},Rh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?rp(s,i):Th(s,i)},jh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?sp(s,i):Ph(s,i)},Wh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?op(s,i):Gh(s,i)},Vh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?ip(s,i):Fh(s,i)},Yh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?np(s,i):Qh(s,i)},Hh=(s,i)=>{Ls(s.inputs[0].dims,i.axes,i.noopWithEmptyAxes)?$f(s,i):Sh(s,i)}}),Cc,Uh,Kh,r2,P6=Mt(()=>{"use strict";lA(),Kr(),B2(),Cc=s=>{if(!s||s.length===0||s.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(s[0].dataType!==1)throw new Error("Invalid input type.")},Uh=(s,i)=>{Cc(s.inputs);let o=(d,m,C)=>{let b=[];for(let w=0;w<d.rank;w++)(C.indexOf(w)>=0||C.length===0)&&b.push(`input_indices[${w}] = 0;`);return[`${b.join(`
`)}`,`var value = ${d.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${d.getByIndices("input_indices")} ${i.selectLastIndex>0?"<=":"<"} value) {
         value = ${d.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",m.setByOffset("global_idx","best_index")]};s.compute(V0("ArgMin",{hint:i.cacheKey,inputDependencies:["rank"]},[s.inputs[0]],o,[i.axis],7,i.keepDims),{inputs:[0]})},Kh=(s,i)=>{Cc(s.inputs);let o=(d,m,C)=>{let b=[];for(let w=0;w<d.rank;w++)(C.indexOf(w)>=0||C.length===0)&&b.push(`input_indices[${w}] = 0;`);return[`${b.join(`
`)}`,`var value = ${d.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${d.getByIndices("input_indices")} ${i.selectLastIndex>0?">=":">"} value) {
         value = ${d.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",m.setByOffset("global_idx","best_index")]};s.compute(V0("argMax",{hint:i.cacheKey,inputDependencies:["rank"]},[s.inputs[0]],o,[i.axis],7,i.keepDims),{inputs:[0]})},r2=s=>YA(s)}),lp,P0,cp,up,dp,Zn,gp,Xh,y2=Mt(()=>{"use strict";lA(),IA(),E2(),kA(),lp=(s,i)=>{let o=s[0],d=s[1],m=s[2],C=s[3],b=s[4],w=s[5];if(b&&w)throw new Error("Attention cannot have both past and attention_bias");if(o.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let M=o.dims[0],x=o.dims[1],D=o.dims[2];if(m.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(d.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(d.dims[0]!==D)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(m.dims[0]!==d.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let _=m.dims[0]/3,v=_,Q=v;if(i.qkvHiddenSizes.length>0){if(i.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let K of i.qkvHiddenSizes)if(K%i.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");_=i.qkvHiddenSizes[0],v=i.qkvHiddenSizes[1],Q=i.qkvHiddenSizes[2]}let F=x;if(_!==v)throw new Error("qkv_hidden_sizes first element should be same as the second");if(m.dims[0]!==_+v+Q)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let j=0;if(b){if(v!==Q)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(b.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(b.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(b.dims[1]!==M)throw new Error('Input "past" second dimension must be batch_size');if(b.dims[2]!==i.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(b.dims[4]!==v/i.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');i.pastPresentShareBuffer||(j=b.dims[3])}let X=F+j,R=-1,L=0;if(C)throw new Error("Mask not supported");if(b)throw new Error("past is not supported");if(w){if(w.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(w.dims[0]!==M||w.dims[1]!==i.numHeads||w.dims[2]!==x||w.dims[3]!==X)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:M,sequenceLength:x,pastSequenceLength:j,kvSequenceLength:F,totalSequenceLength:X,maxSequenceLength:R,inputHiddenSize:D,hiddenSize:_,vHiddenSize:Q,headSize:Math.floor(_/i.numHeads),vHeadSize:Math.floor(Q/i.numHeads),numHeads:i.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:i.maskFilterValue,maskType:L,scale:i.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},P0=(s,i,o)=>i&&s?`
      let total_sequence_length_input = u32(${i.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${s?.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${o?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,cp=(s,i,o,d,m,C,b,w)=>{let M=zr(b?1:C),x=64,D=C/M;D<x&&(x=32);let _=Math.ceil(C/M/x),v=[{type:12,data:i},{type:12,data:o},{type:12,data:d},{type:12,data:m},{type:12,data:D},{type:12,data:_}],Q=ha(s.dataType,M),F=Fa(1,M),j=["type"];b&&j.push("type"),w&&j.push("type");let X=R=>{let L=Xt("x",s.dataType,s.dims,M),K=[L],g=b?st("seq_lens",b.dataType,b.dims):void 0;g&&K.push(g);let k=w?st("total_sequence_length_input",w.dataType,w.dims):void 0;k&&K.push(k);let e=Fa(s.dataType),u=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${x}>;
  var<workgroup> thread_sum: array<f32, ${x}>;
  ${R.registerUniforms(u).declareVariables(...K)}
  ${R.mainStart([x,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${P0(g,k,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${x}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${b?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${F}(-3.402823e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${F}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(M){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${M}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.402823e+38f);
    for (var i = 0u; i < ${x}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${F}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${F}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(M){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${M}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${x}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${L.type.value}(${e}(1.0) / ${e}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${F}(x[offset + i]);
        x[offset + i] = ${L.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${b?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${L.type.value}(${e}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${x};${Q};${M}`,inputDependencies:j},getShaderSource:X,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:m,z:i*o},programUniforms:v})}},up=(s,i,o,d,m,C,b,w,M)=>{let x=b+C.kvSequenceLength,D=[C.batchSize,C.numHeads,C.sequenceLength,x],_=s>1&&d,v=C.kvNumHeads?C.kvNumHeads:C.numHeads,Q=_?[C.batchSize,v,x,C.headSize]:void 0,F=C.nReps?C.nReps:1,j=C.scale===0?1/Math.sqrt(C.headSize):C.scale,X=zr(C.headSize),R=C.headSize/X,L=12,K={x:Math.ceil(x/L),y:Math.ceil(C.sequenceLength/L),z:C.batchSize*C.numHeads},g=[{type:12,data:C.sequenceLength},{type:12,data:R},{type:12,data:x},{type:12,data:C.numHeads},{type:12,data:C.headSize},{type:1,data:j},{type:12,data:b},{type:12,data:C.kvSequenceLength},{type:12,data:F}],k=_&&d&&Ye.size(d.dims)>0,e=["type","type"];k&&e.push("type"),m&&e.push("type"),w&&e.push("type"),M&&e.push("type");let u=[{dims:D,dataType:i.dataType,gpuDataType:0}];_&&u.push({dims:Q,dataType:i.dataType,gpuDataType:0});let B=q=>{let y=st("q",i.dataType,i.dims,X),S=st("key",o.dataType,o.dims,X),ge=[y,S];if(k){let Ge=st("past_key",d.dataType,d.dims,X);ge.push(Ge)}m&&ge.push(st("attention_bias",m.dataType,m.dims));let Ae=w?st("seq_lens",w.dataType,w.dims):void 0;Ae&&ge.push(Ae);let me=M?st("total_sequence_length_input",M.dataType,M.dims):void 0;me&&ge.push(me);let Me=Xt("output",i.dataType,D),Ie=[Me];_&&Ie.push(Xt("present_key",i.dataType,Q,X));let _e=Fa(1,X),ye=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${L}u;

  var<workgroup> tileQ: array<${y.type.storage}, ${L*L}>;
  var<workgroup> tileK: array<${y.type.storage}, ${L*L}>;
  ${q.registerUniforms(ye).declareVariables(...ge,...Ie)}
  ${q.mainStart([L,L,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${F===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${F===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${P0(Ae,me,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${k&&_?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${_?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${_e}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${k&&_?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${_?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${_e}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(X){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${X}`)}})()};
        output[outputIdx] = ${Me.type.value} (sum * uniforms.alpha) + ${m?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${X};${m!==void 0};${d!==void 0};${s}`,inputDependencies:e},getRunData:()=>({outputs:u,dispatchGroup:K,programUniforms:g}),getShaderSource:B}},dp=(s,i,o,d,m,C,b=void 0,w=void 0)=>{let M=C+m.kvSequenceLength,x=m.nReps?m.nReps:1,D=m.vHiddenSize*x,_=s>1&&d,v=m.kvNumHeads?m.kvNumHeads:m.numHeads,Q=_?[m.batchSize,v,M,m.headSize]:void 0,F=[m.batchSize,m.sequenceLength,D],j=12,X={x:Math.ceil(m.vHeadSize/j),y:Math.ceil(m.sequenceLength/j),z:m.batchSize*m.numHeads},R=[{type:12,data:m.sequenceLength},{type:12,data:M},{type:12,data:m.vHeadSize},{type:12,data:m.numHeads},{type:12,data:m.headSize},{type:12,data:D},{type:12,data:C},{type:12,data:m.kvSequenceLength},{type:12,data:x}],L=_&&d&&Ye.size(d.dims)>0,K=["type","type"];L&&K.push("type"),b&&K.push("type"),w&&K.push("type");let g=[{dims:F,dataType:i.dataType,gpuDataType:0}];_&&g.push({dims:Q,dataType:i.dataType,gpuDataType:0});let k=e=>{let u=st("probs",i.dataType,i.dims),B=st("v",o.dataType,o.dims),q=[u,B];L&&q.push(st("past_value",d.dataType,d.dims));let y=b?st("seq_lens",b.dataType,b.dims):void 0;b&&q.push(y);let S=w?st("total_sequence_length_input",w.dataType,w.dims):void 0;w&&q.push(S);let ge=[Xt("output",i.dataType,F)];_&&ge.push(Xt("present_value",i.dataType,Q));let Ae=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${j}u;
  var<workgroup> tileQ: array<${u.type.value}, ${j*j}>;
  var<workgroup> tileV: array<${u.type.value}, ${j*j}>;
  ${e.registerUniforms(Ae).declareVariables(...q,...ge)}
  ${e.mainStart([j,j,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${x===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${x===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${P0(y,S,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${L&&_?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${_?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${u.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${L&&_?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${_?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${d!==void 0};${s}`,inputDependencies:K},getRunData:()=>({outputs:g,dispatchGroup:X,programUniforms:R}),getShaderSource:k}},Zn=(s,i,o,d,m,C,b,w,M,x,D=void 0,_=void 0)=>{let v=Math.min(s.outputCount,1+(b?1:0)+(w?1:0)),Q=v>1?x.pastSequenceLength:0,F=Q+x.kvSequenceLength,j=M&&Ye.size(M.dims)>0?M:void 0,X=[i,o];v>1&&b&&Ye.size(b.dims)>0&&X.push(b),j&&X.push(j),D&&X.push(D),_&&X.push(_);let R=s.compute(up(v,i,o,b,j,x,Q,D,_),{inputs:X,outputs:v>1?[-1,1]:[-1]})[0];s.compute(cp(R,x.batchSize,x.numHeads,Q,x.sequenceLength,F,D,_),{inputs:D&&_?[R,D,_]:[R],outputs:[]});let L=[R,d];v>1&&w&&Ye.size(w.dims)>0&&L.push(w),D&&L.push(D),_&&L.push(_),s.compute(dp(v,R,d,w,x,Q,D,_),{inputs:L,outputs:v>1?[0,2]:[0]})},gp=(s,i)=>{let o=[i.batchSize,i.numHeads,i.sequenceLength,i.headSize],d=i.sequenceLength,m=i.inputHiddenSize,C=i.headSize,b=12,w={x:Math.ceil(i.headSize/b),y:Math.ceil(i.sequenceLength/b),z:i.batchSize*i.numHeads},M=[s.inputs[0],s.inputs[1],s.inputs[2]],x=[{type:12,data:d},{type:12,data:m},{type:12,data:C},{type:12,data:i.numHeads},{type:12,data:i.headSize},{type:12,data:i.hiddenSize},{type:12,data:i.hiddenSize+i.hiddenSize+i.vHiddenSize}],D=_=>{let v=Xt("output_q",M[0].dataType,o),Q=Xt("output_k",M[0].dataType,o),F=Xt("output_v",M[0].dataType,o),j=st("input",M[0].dataType,M[0].dims),X=st("weight",M[1].dataType,M[1].dims),R=st("bias",M[2].dataType,M[2].dims),L=j.type.storage,K=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${b}u;
  var<workgroup> tileInput: array<${L}, ${b*b}>;
  var<workgroup> tileWeightQ: array<${L}, ${b*b}>;
  var<workgroup> tileWeightK: array<${L}, ${b*b}>;
  var<workgroup> tileWeightV: array<${L}, ${b*b}>;
  ${_.registerUniforms(K).declareVariables(j,X,R,v,Q,F)}
  ${_.mainStart([b,b,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${L}(0);
    var valueK = ${L}(0);
    var valueV = ${L}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return s.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:o,dataType:s.inputs[0].dataType,gpuDataType:0},{dims:o,dataType:s.inputs[0].dataType,gpuDataType:0},{dims:o,dataType:s.inputs[0].dataType,gpuDataType:0}],dispatchGroup:w,programUniforms:x}),getShaderSource:D},{inputs:M,outputs:[-1,-1,-1]})},Xh=(s,i)=>{let o=lp(s.inputs,i),[d,m,C]=gp(s,o);return Zn(s,d,m,C,s.inputs[4],void 0,void 0,void 0,s.inputs[5],o)}}),fp,pp,mp,Zh,G6=Mt(()=>{"use strict";Ws(),lA(),IA(),Kr(),kA(),fp=(s,i)=>{if(!s||s.length!==5)throw new Error("BatchNormalization requires 5 inputs");let o=(d,m,C)=>{let b=m.length;if(b!==d.length)throw new Error(`${C}: num dimensions != ${b}`);m.forEach((w,M)=>{if(w!==d[M])throw new Error(`${C}: dim[${M}] do not match`)})};if(s[0].dims.length>1){let d=i.format==="NHWC"?i.spatial?s[0].dims.slice(-1):s[0].dims.slice(-1).concat(s[0].dims.slice(1,s[0].dims.length-1)):s[0].dims.slice(1,i.spatial?2:void 0);o(s[1].dims,d,"Invalid input scale"),o(s[2].dims,d,"Invalid input B"),o(s[3].dims,d,"Invalid input mean"),o(s[4].dims,d,"Invalid input var")}else o(s[1].dims,[1],"Invalid input scale"),o(s[2].dims,[1],"Invalid input B"),o(s[3].dims,[1],"Invalid input mean"),o(s[4].dims,[1],"Invalid input var")},pp=(s,i)=>{let{epsilon:o,spatial:d,format:m}=i,C=s[0].dims,b=d?zr(C[C.length-1]):1,w=m==="NHWC"&&C.length>1?b:1,M=Ye.size(C)/b,x=d,D=x?C.length:C,_=st("x",s[0].dataType,s[0].dims,b),v=st("scale",s[1].dataType,s[1].dims,w),Q=st("bias",s[2].dataType,s[2].dims,w),F=st("inputMean",s[3].dataType,s[3].dims,w),j=st("inputVar",s[4].dataType,s[4].dims,w),X=Xt("y",s[0].dataType,D,b),R=()=>{let K="";if(d)K=`let cOffset = ${C.length===1?"0u":m==="NHWC"?`outputIndices[${C.length-1}] / ${b}`:"outputIndices[1]"};`;else if(m==="NCHW")K=`
            ${X.indicesSet("outputIndices","0","0")}
            let cOffset = ${X.indicesToOffset("outputIndices")};`;else{K=`var cIndices = ${v.type.indices}(0);
                       cIndices[0] = outputIndices[${C.length-1}];`;for(let g=1;g<v.rank;g++)K+=`cIndices[${g}] = outputIndices[${g}];`;K+=`let cOffset = ${v.indicesToOffset("cIndices")};`}return K},L=K=>`
  const epsilon = ${o};
  ${K.registerUniform("outputSize","u32").declareVariables(_,v,Q,F,j,X)}
  ${K.mainStart()}
  ${K.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${X.offsetToIndices(`global_idx * ${b}`)};
    ${R()}
    let scale = ${v.getByOffset("cOffset")};
    let bias = ${Q.getByOffset("cOffset")};
    let inputMean = ${F.getByOffset("cOffset")};
    let inputVar = ${j.getByOffset("cOffset")};
    let x = ${_.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${X.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${i.epsilon}_${i.format}_${d}_${b}`,inputDependencies:x?["rank","type","type","type","type"]:void 0},getShaderSource:L,getRunData:()=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(M/64)},programUniforms:x?[{type:12,data:M},...$t(C)]:[{type:12,data:M}]})}},mp=s=>YA(s),Zh=(s,i)=>{let{inputs:o,outputCount:d}=s,m=mp({...i,outputCount:d});if(kr.webgpu.validateInputContent&&fp(o,m),i.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");s.compute(pp(o,m))}}),hp,bp,Jh,F6=Mt(()=>{"use strict";IA(),kA(),hp=s=>{if(s[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(s[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(s[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(s[0].dims[2]!==s[1].dims[0])throw new Error("last dimension of input and bias are not the same")},bp=s=>{let i=s[0].dims,o=s[0].dims[2],d=Ye.size(i)/4,m=s[0].dataType,C=st("input",m,i,4),b=st("bias",m,[o],4),w=st("residual",m,i,4),M=Xt("output",m,i,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:i,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)}}),getShaderSource:x=>`
  const channels = ${o}u / 4;
  ${x.declareVariables(C,b,w,M)}

  ${x.mainStart()}
    ${x.guardAgainstOutOfBoundsWorkgroupSizes(d)}
    let value = ${C.getByOffset("global_idx")}
      + ${b.getByOffset("global_idx % channels")} + ${w.getByOffset("global_idx")};
    ${M.setByOffset("global_idx","value")}
  }`}},Jh=s=>{hp(s.inputs),s.compute(bp(s.inputs))}}),Cp,jA,qh,$h,eb,tb,Ab,rb,ab,sb,ob,Ip,ib,nb,lb,cb,Yn,ub,z0,db,gb,fb,pb,mb,hb,bb,Cb,Ib,wb,kb,Mb,xb,vb,Eb,_b,Ic,Bb,a2,s2,yb,Db,Tb,wp,kp,Pb,D2=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Cp=(s,i,o,d,m,C,b)=>{let w=Math.ceil(i/4),M="";typeof m=="string"?M=`${m}(a)`:M=m("a");let x=st("inputData",o,[w],4),D=Xt("outputData",d,[w],4),_=[{name:"vec_size",type:"u32"}];return b&&_.push(...b),`
      ${s.registerUniforms(_).declareVariables(x,D)}

  ${C??""}

  ${s.mainStart()}
    ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${x.getByOffset("global_idx")};
    ${D.setByOffset("global_idx",M)}
  }`},jA=(s,i,o,d,m,C=s.dataType,b,w)=>{let M=[{type:12,data:Math.ceil(Ye.size(s.dims)/4)}];return b&&M.push(...b),{name:i,shaderCache:{hint:m,inputDependencies:["type"]},getShaderSource:x=>Cp(x,Ye.size(s.dims),s.dataType,C,o,d,w),getRunData:x=>({outputs:[{dims:s.dims,dataType:C}],dispatchGroup:{x:Math.ceil(Ye.size(x[0].dims)/64/4)},programUniforms:M})}},qh=s=>{s.compute(jA(s.inputs[0],"Abs","abs"))},$h=s=>{s.compute(jA(s.inputs[0],"Acos","acos"))},eb=s=>{s.compute(jA(s.inputs[0],"Acosh","acosh"))},tb=s=>{s.compute(jA(s.inputs[0],"Asin","asin"))},Ab=s=>{s.compute(jA(s.inputs[0],"Asinh","asinh"))},rb=s=>{s.compute(jA(s.inputs[0],"Atan","atan"))},ab=s=>{s.compute(jA(s.inputs[0],"Atanh","atanh"))},sb=s=>YA(s),ob=(s,i)=>{let o;switch(i.to){case 10:o="vec4<f16>";break;case 1:o="vec4<f32>";break;case 12:o="vec4<u32>";break;case 6:o="vec4<i32>";break;case 9:o="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${i.to}`)}s.compute(jA(s.inputs[0],"Cast",o,void 0,i.cacheKey,i.to))},Ip=s=>{let i,o,d=s.length>=2&&s[1].data!==0,m=s.length>=3&&s[2].data!==0;switch(s[0].dataType){case 1:i=d?s[1].getFloat32Array()[0]:-34028234663852886e22,o=m?s[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:i=d?s[1].getUint16Array()[0]:64511,o=m?s[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return YA({min:i,max:o})},ib=(s,i)=>{let o=i||Ip(s.inputs),d=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"Clip",m=>`clamp(${m}, vec4<${d}>(uniforms.min), vec4<${d}>(uniforms.max))`,void 0,o.cacheKey,void 0,[{type:s.inputs[0].dataType,data:o.min},{type:s.inputs[0].dataType,data:o.max}],[{name:"min",type:d},{name:"max",type:d}]),{inputs:[0]})},nb=s=>{s.compute(jA(s.inputs[0],"Ceil","ceil"))},lb=s=>{s.compute(jA(s.inputs[0],"Cos","cos"))},cb=s=>{s.compute(jA(s.inputs[0],"Cosh","cosh"))},Yn=s=>YA(s),ub=(s,i)=>{let o=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"Elu",d=>`elu_vf32(${d})`,`
  const elu_alpha_ = ${o}(${i.alpha});

  fn elu_f32(a: ${o}) -> ${o} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${o}>) -> vec4<${o}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,i.cacheKey))},z0=(s="f32")=>`
const r0: ${s} = 0.3275911;
const r1: ${s} = 0.254829592;
const r2: ${s} = -0.284496736;
const r3: ${s} = 1.421413741;
const r4: ${s} = -1.453152027;
const r5: ${s} = 1.061405429;

fn erf_vf32(v: vec4<${s}>) -> vec4<${s}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,db=s=>{let i=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"Erf",o=>`erf_vf32(${o})`,z0(i)))},gb=s=>{s.compute(jA(s.inputs[0],"Exp","exp"))},fb=s=>{s.compute(jA(s.inputs[0],"Floor","floor"))},pb=s=>{let i=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"Gelu",o=>`0.5 * ${o} * (1.0 + erf_vf32(${o} * 0.7071067811865475))`,z0(i)))},mb=(s,i)=>{let o=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"LeakyRelu",d=>`select(leaky_relu_alpha_ * ${d}, ${d}, ${d} >= vec4<${o}>(0.0))`,`const leaky_relu_alpha_ = ${o}(${i.alpha});`,i.cacheKey))},hb=s=>{s.compute(jA(s.inputs[0],"Not",i=>`!${i}`))},bb=s=>{s.compute(jA(s.inputs[0],"Neg",i=>`-${i}`))},Cb=s=>{s.compute(jA(s.inputs[0],"Reciprocal",i=>`1.0/${i}`))},Ib=s=>{let i=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"Relu",o=>`select(vec4<${i}>(0.0), ${o}, ${o} > vec4<${i}>(0.0))`))},wb=s=>{s.compute(jA(s.inputs[0],"Sigmoid",i=>`(1.0 / (1.0 + exp(-${i})))`))},kb=s=>YA(s),Mb=(s,i)=>{let o=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"HardSigmoid",d=>`max(vec4<${o}>(0.0), min(vec4<${o}>(1.0), ${i.alpha} * ${d} + vec4<${o}>(${i.beta})))`,void 0,i.cacheKey))},xb=s=>{s.compute(jA(s.inputs[0],"Sin","sin"))},vb=s=>{s.compute(jA(s.inputs[0],"Sinh","sinh"))},Eb=s=>{s.compute(jA(s.inputs[0],"Sqrt","sqrt"))},_b=s=>{s.compute(jA(s.inputs[0],"Tan","tan"))},Ic=s=>`sign(${s}) * (1 - exp(-2 * abs(${s}))) / (1 + exp(-2 * abs(${s})))`,Bb=s=>{s.compute(jA(s.inputs[0],"Tanh",Ic))},a2=(s="f32")=>`
const fast_gelu_a: ${s} = 0.5;
const fast_gelu_b: ${s} = 0.7978845608028654;
const fast_gelu_c: ${s} = 0.035677408136300125;

fn tanh_v(v: vec4<${s}>) -> vec4<${s}> {
  return ${Ic("v")};
}
`,s2=s=>`(fast_gelu_a + fast_gelu_a * tanh_v(${s} * (fast_gelu_c * ${s} * ${s} + fast_gelu_b))) * ${s}`,yb=s=>{let i=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"FastGelu",s2,a2(i),void 0,s.inputs[0].dataType))},Db=(s,i)=>{let o=Fa(s.inputs[0].dataType);return s.compute(jA(s.inputs[0],"ThresholdedRelu",d=>`select(vec4<${o}>(0.0), ${d}, ${d} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${o}>(${i.alpha});`,i.cacheKey)),0},Tb=s=>{s.compute(jA(s.inputs[0],"Log","log"))},wp=(s,i)=>`
const alpha = vec4<${s}>(${i});
const one = ${s}(1.0);
const zero = ${s}(0.0);

fn quick_gelu_impl(x: vec4<${s}>) -> vec4<${s}> {
  let v = x *alpha;
  var x1 : vec4<${s}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,kp=s=>`quick_gelu_impl(${s})`,Pb=(s,i)=>{let o=Fa(s.inputs[0].dataType);s.compute(jA(s.inputs[0],"QuickGelu",kp,wp(o,i.alpha),i.cacheKey,s.inputs[0].dataType))}}),Mp,xp,Gb,Q6=Mt(()=>{"use strict";IA(),kA(),D2(),Mp=s=>{if(s[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(s[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(s[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(s[0].dims[2]!==s[1].dims[0])throw new Error("last dimension of input and bias are not the same")},xp=s=>{let i=s[0].dims.slice();i[2]=i[2]/2;let o=st("input",s[0].dataType,s[0].dims,4),d=st("bias",s[0].dataType,[s[0].dims[2]],4),m=Xt("output",s[0].dataType,i,4),C=Ye.size(i)/4,b=ha(s[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:i,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(C/64)}}),getShaderSource:w=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${s[0].dims[2]/4/2}u;

  ${w.declareVariables(o,d,m)}

  ${z0(b)}

  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes(C)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${m.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Gb=s=>{Mp(s.inputs),s.compute(xp(s.inputs))}}),vp,Ep,Ns,Fb,Qb,Sb,Ob,Lb,Nb,zb,Rb,jb,Wb,S6=Mt(()=>{"use strict";lA(),IA(),kA(),vp=(s,i,o,d,m,C,b,w,M,x,D,_)=>{let v,Q;typeof w=="string"?v=Q=(L,K)=>`${w}((${L}),(${K}))`:typeof w=="function"?v=Q=w:(v=w.scalar,Q=w.vector);let F=Xt("outputData",D,d.length,4),j=st("aData",M,i.length,4),X=st("bData",x,o.length,4),R;if(m)if(C){let L=Ye.size(i)===1,K=Ye.size(o)===1,g=i.length>0&&i[i.length-1]%4===0,k=o.length>0&&o[o.length-1]%4===0;L||K?R=F.setByOffset("global_idx",Q(L?`${j.type.value}(${j.getByOffset("0")}.x)`:j.getByOffset("global_idx"),K?`${X.type.value}(${X.getByOffset("0")}.x)`:X.getByOffset("global_idx"))):R=`
            let outputIndices = ${F.offsetToIndices("global_idx * 4u")};
            let offsetA = ${j.broadcastedIndicesToOffset("outputIndices",F)};
            let offsetB = ${X.broadcastedIndicesToOffset("outputIndices",F)};
            ${F.setByOffset("global_idx",Q(b||g?j.getByOffset("offsetA / 4u"):`${j.type.value}(${j.getByOffset("offsetA / 4u")}[offsetA % 4u])`,b||k?X.getByOffset("offsetB / 4u"):`${X.type.value}(${X.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else R=F.setByOffset("global_idx",Q(j.getByOffset("global_idx"),X.getByOffset("global_idx")));else{if(!C)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let L=(K,g,k="")=>{let e=`aData[indexA${g}][componentA${g}]`,u=`bData[indexB${g}][componentB${g}]`;return`
            let outputIndices${g} = ${F.offsetToIndices(`global_idx * 4u + ${g}u`)};
            let offsetA${g} = ${j.broadcastedIndicesToOffset(`outputIndices${g}`,F)};
            let offsetB${g} = ${X.broadcastedIndicesToOffset(`outputIndices${g}`,F)};
            let indexA${g} = offsetA${g} / 4u;
            let indexB${g} = offsetB${g} / 4u;
            let componentA${g} = offsetA${g} % 4u;
            let componentB${g} = offsetB${g} % 4u;
            ${K}[${g}] = ${k}(${v(e,u)});
          `};D===9?R=`
            var data = vec4<u32>(0);
            ${L("data",0,"u32")}
            ${L("data",1,"u32")}
            ${L("data",2,"u32")}
            ${L("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:R=`
            ${L("outputData[global_idx]",0)}
            ${L("outputData[global_idx]",1)}
            ${L("outputData[global_idx]",2)}
            ${L("outputData[global_idx]",3)}
          `}return`
        ${s.registerUniform("vec_size","u32").declareVariables(j,X,F)}

        ${_??""}

        ${s.mainStart()}
        ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${R}
      }`},Ep=(s,i,o,d,m,C,b=o.dataType)=>{let w=o.dims.map(j=>Number(j)??1),M=d.dims.map(j=>Number(j)??1),x=!Ye.areEqual(w,M),D=w,_=Ye.size(w),v=!1,Q=!1,F=[x];if(x){let j=sn.calcShape(w,M,!1);if(!j)throw new Error("Can't perform binary op on the given tensors");D=j.slice(),_=Ye.size(D);let X=Ye.size(w)===1,R=Ye.size(M)===1,L=w.length>0&&w[w.length-1]%4===0,K=M.length>0&&M[M.length-1]%4===0;F.push(X),F.push(R),F.push(L),F.push(K);let g=1;for(let k=1;k<D.length;k++){let e=w[w.length-k],u=M[M.length-k];if(e===u)g*=e;else break}g%4===0?(Q=!0,v=!0):(X||R||L||K)&&(v=!0)}else v=!0;return F.push(v),{name:s,shaderCache:{hint:i+F.map(j=>j.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:j=>vp(j,w,M,D,v,x,Q,m,o.dataType,d.dataType,b,C),getRunData:()=>({outputs:[{dims:D,dataType:b}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(Ye.size(D)/4)},...$t(w,M,D)]})}},Ns=(s,i,o,d,m,C)=>{s.compute(Ep(i,m??"",s.inputs[0],s.inputs[1],o,d,C))},Fb=s=>{Ns(s,"Add",(i,o)=>`${i}+${o}`)},Qb=s=>{Ns(s,"Div",(i,o)=>`${i}/${o}`)},Sb=s=>{Ns(s,"Equal",{scalar:(i,o)=>`u32(${i}==${o})`,vector:(i,o)=>`vec4<u32>(${i}==${o})`},void 0,void 0,9)},Ob=s=>{Ns(s,"Mul",(i,o)=>`${i}*${o}`)},Lb=s=>{let i=st("input",s.inputs[0].dataType,s.inputs[0].dims).type.value;Ns(s,"Pow",{scalar:(o,d)=>`pow_custom(${o},${d})`,vector:(o,d)=>`pow_vector_custom(${o},${d})`},`
    fn pow_custom(a : ${i}, b : ${i}) -> ${i} {
      if (b == ${i}(0.0)) {
        return ${i}(1.0);
      } else if (a < ${i}(0.0) && f32(b) != floor(f32(b))) {
        return ${i}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${i}(1.0), round(f32(abs(b) % ${i}(2.0))) != 1.0) * ${i}(${i==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${i}>, b : vec4<${i}>) -> vec4<${i}> {
      // TODO: implement vectorized pow
      return vec4<${i}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Nb=s=>{Ns(s,"Sub",(i,o)=>`${i}-${o}`)},zb=s=>{Ns(s,"Greater",{scalar:(i,o)=>`u32(${i}>${o})`,vector:(i,o)=>`vec4<u32>(${i}>${o})`},void 0,void 0,9)},Rb=s=>{Ns(s,"Less",{scalar:(i,o)=>`u32(${i}<${o})`,vector:(i,o)=>`vec4<u32>(${i}<${o})`},void 0,void 0,9)},jb=s=>{Ns(s,"GreaterOrEqual",{scalar:(i,o)=>`u32(${i}>=${o})`,vector:(i,o)=>`vec4<u32>(${i}>=${o})`},void 0,void 0,9)},Wb=s=>{Ns(s,"LessOrEqual",{scalar:(i,o)=>`u32(${i}<=${o})`,vector:(i,o)=>`vec4<u32>(${i}<=${o})`},void 0,void 0,9)}}),_p,Bp,yp,Dp,Vb,Yb,O6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),_p=(s,i)=>{if(!s||s.length<1)throw new Error("too few inputs");let o=0,d=s[o],m=d.dataType,C=d.dims.length;s.forEach((b,w)=>{if(w!==o){if(b.dataType!==m)throw new Error("input tensors should be one type");if(b.dims.length!==C)throw new Error("input tensors should have the same shape");b.dims.forEach((M,x)=>{if(x!==i&&M!==d.dims[x])throw new Error("non concat dimensions must match")})}})},Bp=(s,i)=>`
  fn calculateInputIndex(index: u32) -> u32 {
    let sizeInConcatAxis = array<u32, ${s}u>(${i});
    for (var i: u32 = 0u; i < ${s}; i += 1u ) {
      if (index < sizeInConcatAxis[i]) {
        return i;
      }
    }
    return ${s}u;
  }`,yp=(s,i)=>{let o=s.length,d=[];for(let m=0;m<o;++m){let C=i.setByOffset("global_idx",s[m].getByIndices("indices"));o===1?d.push(C):m===0?d.push(`if (inputIndex == ${m}u) { ${C} }`):m===o-1?d.push(`else { ${C} }`):d.push(`else if (inputIndex == ${m}) { ${C} }`)}return d.join(`
`)},Dp=(s,i,o,d)=>{let m=Ye.size(o),C=new Array(s.length),b=new Array(s.length),w=0,M=[],x=[],D=[{type:12,data:m}];for(let j=0;j<s.length;++j)w+=s[j].dims[i],C[j]=w,x.push(s[j].dims.length),b[j]=st(`input${j}`,d,x[j]),M.push("rank"),D.push({type:12,data:C[j]});for(let j=0;j<s.length;++j)D.push(...$t(s[j].dims));D.push(...$t(o));let _=Xt("output",d,o.length),v=_.indicesGet("indices",i),Q=Array.from(Array(C.length).keys()).map(j=>`uniforms.sizeInConcatAxis${j}`).join(","),F=j=>`

  ${(()=>{j.registerUniform("outputSize","u32");for(let X=0;X<s.length;X++)j.registerUniform(`sizeInConcatAxis${X}`,"u32");return j.declareVariables(...b,_)})()}

  ${Bp(C.length,Q)}

  ${j.mainStart()}
    ${j.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    var indices = ${_.offsetToIndices("global_idx")};

    let inputIndex = calculateInputIndex(${v});
    if (inputIndex != 0u) {
      let sizeInConcatAxis = array<u32, ${C.length}u>(${Q});
      ${v} -= sizeInConcatAxis[inputIndex - 1u];
    }

    ${yp(b,_)}
  }`;return{name:"Concat",shaderCache:{hint:`${i}`,inputDependencies:M},getRunData:()=>({outputs:[{dims:o,dataType:d}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:D}),getShaderSource:F}},Vb=(s,i)=>{let o=s.inputs,d=o[0].dims,m=Ye.normalizeAxis(i.axis,d.length);_p(o,m);let C=d.slice();C[m]=o.reduce((w,M)=>w+(M.dims.length>m?M.dims[m]:0),0);let b=o.filter(w=>Ye.size(w.dims)>0);s.compute(Dp(b,m,C,o[0].dataType),{inputs:b})},Yb=s=>YA({axis:s.axis})}),yi,Di,Ti,T2,Gi=Mt(()=>{"use strict";lA(),IA(),yi=(s,i,o="f32")=>{switch(s.activation){case"Relu":return`value = max(value, ${i}(0.0));`;case"Sigmoid":return`value = (${i}(1.0) / (${i}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${i}(${o}(uniforms.clip_min)), ${i}(${o}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${i}(0.0), min(${i}(1.0), ${o}(uniforms.alpha) * value + ${o}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${o}(uniforms.alpha) * value, value, value >= ${i}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${s.activation}`)}},Di=(s,i)=>{s.activation==="Clip"?i.push({type:1,data:s.clipMax},{type:1,data:s.clipMin}):s.activation==="HardSigmoid"?i.push({type:1,data:s.alpha},{type:1,data:s.beta}):s.activation==="LeakyRelu"&&i.push({type:1,data:s.alpha})},Ti=(s,i)=>{s.activation==="Clip"?i.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):s.activation==="HardSigmoid"?i.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):s.activation==="LeakyRelu"&&i.push({name:"alpha",type:"f32"})},T2=s=>{let i=s?.activation||"";if(i==="HardSigmoid"){let[o,d]=s?.activation_params||[.2,.5];return{activation:i,alpha:o,beta:d}}else if(i==="Clip"){let[o,d]=s?.activation_params||[hh,bh];return{activation:i,clipMax:d,clipMin:o}}else if(i==="LeakyRelu"){let[o]=s?.activation_params||[.01];return{activation:i,alpha:o}}return{activation:i}}}),wa,Hb,P2=Mt(()=>{"use strict";wa=(s,i)=>{switch(s){case 1:return i;case 2:return`vec2<${i}>`;case 3:return`vec3<${i}>`;case 4:return`vec4<${i}>`;default:throw new Error(`${s}-component is not supported.`)}},Hb=s=>`
      ${s?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Ub,L6=Mt(()=>{"use strict";Ub=s=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${s}.x), i32(${s}.y), i32(${s}.z), 1));
}
`}),Un,G2,F2=Mt(()=>{"use strict";lA(),IA(),kA(),Gi(),Un=(s,i,o,d,m)=>{let C=d-o;return`
      ${Array.from({length:o}).map((b,w)=>`
      if (${Jt(i.shape,w,i.rank)} != 1) {
        ${i.indicesSet(s,w,Jt(m,w+C,d))}
      } else {
        ${i.indicesSet(s,w,0)}
      }`).join("")}
`},G2=(s,i,o,d,m=!1,C)=>{let b=s[0].dims,w=s[1].dims,M=b[b.length-2],x=w[w.length-1],D=b[b.length-1],_=zr(x),v=zr(D),Q=zr(M),F=Ye.size(o)/_/Q,j=s.length>2,X=d?d.slice(0,-2):o.slice(0,-2),R=[Ye.size(X),M,x],L=[{type:12,data:F},{type:12,data:M},{type:12,data:x},{type:12,data:D}];Di(i,L),L.push(...$t(X,b,w)),j&&L.push(...$t(s[2].dims)),L.push(...$t(R));let K=g=>{let k=_2("batch_dims",s[0].dataType,X.length),e=st("a",s[0].dataType,b.length,v),u=st("b",s[1].dataType,w.length,_),B=Xt("output",s[0].dataType,R.length,_),q=ha(B.type.tensor),y=yi(i,B.type.value,q),S=[e,u],ge="";if(j){let Me=m?_:1;S.push(st("bias",s[2].dataType,s[2].dims.length,Me)),ge=`${m?`value += bias[col / ${Me}];`:`value += ${B.type.value}(bias[row + i]);`}`}let Ae=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Ti(i,Ae);let me=()=>{let Me=`var a_data: ${e.type.value};`;for(let Ie=0;Ie<v;Ie++)Me+=`
              let b_data${Ie} = b[(b_offset + (k + ${Ie}) * uniforms.N + col) / ${_}];`;for(let Ie=0;Ie<Q;Ie++){Me+=`a_data = a[(a_offset + (row + ${Ie}) * uniforms.K + k) / ${v}];`;for(let _e=0;_e<v;_e++)Me+=`
            values[${Ie}] = fma(${u.type.value}(a_data${v===1?"":`[${_e}]`}), b_data${_e}, values[${Ie}]);
`}return Me};return`
  ${g.registerUniforms(Ae).registerInternalVariables(k).declareVariables(...S,B)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${_})) * ${_};
    var index1 = global_idx / (uniforms.N / ${_});
    let stride1 = uniforms.M / ${Q};
    let row = (index1 % stride1) * ${Q};
    let batch = index1 / stride1;

    ${o.length===2?"":`let batch_indices = ${k.offsetToIndices("batch")};`}

    var a_indices: ${e.type.indices};
    ${Un("a_indices",e,e.rank-2,k.rank,"batch_indices")}
    ${e.indicesSet("a_indices",e.rank-2,0)}
    ${e.indicesSet("a_indices",e.rank-1,0)}
    let a_offset = ${e.indicesToOffset("a_indices")};

    var b_indices: ${u.type.indices};
    ${Un("b_indices",u,u.rank-2,k.rank,"batch_indices")}
    ${u.indicesSet("b_indices",u.rank-2,0)}
    ${u.indicesSet("b_indices",u.rank-1,0)}
    let b_offset = ${u.indicesToOffset("b_indices")};
    var values: array<${B.type.value}, ${Q}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${v}) {
      ${me()}
    }
    for (var i = 0u; i < ${Q}u; i++) {
      var value = values[i];
      ${ge}
      ${y}
      let cur_indices = ${B.type.indices}(batch, row + i, col);
      let offset = ${B.indicesToOffset("cur_indices")};
      ${B.setByOffset(`offset / ${_}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${i.activation};${_};${v};${Q};${m}`,inputDependencies:j?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:C?C(o):o,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(F/64)},programUniforms:L}),getShaderSource:K}}}),Tp,Pp,o2,wc,Gp,i2,Fp,Y0,Q2=Mt(()=>{"use strict";lA(),IA(),kA(),Gi(),F2(),P2(),Tp=(s,i)=>s?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${i?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${i?", batchIndices":""});
        `,Pp=(s,i)=>s?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${i===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${i===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${i===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,o2=(s,i,o="f32",d,m=!1,C=32,b=!1,w=32)=>{let M=i[1]*s[1],x=i[0]*s[0],D=m?M:C,_=m?C:M,v=D/i[0],Q=C/i[1];if(!((m&&v===4&&s[1]===4||!m&&(v===3||v===4))&&D%i[0]===0&&C%i[1]===0&&s[0]===4))throw new Error(`If transposeA ${m} is true, innerElementSize ${v} and workPerThread[1] ${s[1]} must be 4.
      Otherwise, innerElementSize ${v} must be 3 or 4.
  tileAWidth ${D} must be divisible by workgroupSize[0]${i[0]}. tileInner ${C} must be divisible by workgroupSize[1] ${i[1]}. colPerThread ${s[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${v}<${o}>, ${D/v}>, ${_}>;
var<workgroup> mm_Bsub: array<array<vec4<${o}>, ${x/s[0]}>, ${C}>;

const rowPerThread = ${s[1]};
const colPerThread = ${s[0]};
const innerElementSize = ${v};
const tileInner = ${C};

@compute @workgroup_size(${i[0]}, ${i[1]}, ${i[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${b?"0":"i32(globalId.z)"};
  ${d?`let batchIndices = ${d.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${M};

  let num_tiles = ${b?`${Math.ceil(w/C)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${b?`i32(globalId.z) * ${w}`:"0"};

  var acc: array<vec4<${o}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${Q};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Tp(m,d)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${Q}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${d?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${v===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Pp(m,v)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},wc=(s,i)=>s?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${i?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${i?", batchIndices":""});
            `,Gp=s=>s?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",i2=(s,i,o="f32",d,m=!1,C=32,b=!1,w=32,M=!1)=>{let x=s[1]*i[1],D=s[0]*i[0],_=m?x:C,v=m?C:x;if(!(v%i[1]===0&&_%i[0]===0&&C%i[1]===0))throw new Error(`tileAHight ${v} must be divisible by workgroupSize[1]${i[1]}, tileAWidth ${_} must be divisible by workgroupSize[0]${i[0]}, tileInner ${C} must be divisible by workgroupSize[1]${i[1]}`);let Q=v/i[1],F=_/i[0],j=C/i[1],X=M?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${x};
    let globalColStart = i32(workgroupId.x) * ${D};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${v}; inputRow = inputRow + ${i[1]}) {
        for (var inputCol = localCol; inputCol < ${_}; inputCol = inputCol + ${i[0]}) {
          ${wc(m,d)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${C}; inputRow = inputRow + ${i[1]}) {
            for (var inputCol = localCol; inputCol < ${D}; inputCol = inputCol + ${i[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${d?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${o}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${i[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${m?`mm_Asub[k][localRow + innerRow * ${i[1]}];`:`mm_Asub[localRow + innerRow * ${i[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${i[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${i[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${x};

let tileRowA = i32(localId.y) * ${Q};
let tileColA = i32(localId.x) * ${F};
let tileRowB = i32(localId.y) * ${j};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${Q}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${F}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${wc(m,d)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${j}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${d?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${o}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Gp(m)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${o}, ${_}>, ${v}>;
  var<workgroup> mm_Bsub : array<array<${o}, ${D}>, ${C}>;
  const rowPerThread = ${s[1]};
  const colPerThread = ${s[0]};
  const tileInner = ${C};

@compute @workgroup_size(${i[0]}, ${i[1]}, ${i[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${b?"0":"i32(globalId.z)"};
    ${d?`let batchIndices = ${d.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${b?`${Math.ceil(w/C)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${b?`i32(globalId.z) * ${w}`:"0"};

    var acc : array<array<${o}, colPerThread>, rowPerThread>;
    ${X}
  }
`},Fp=(s,i,o,d,m=!1)=>{let[C,b,w,M]=d,x=ha(d[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${C.type.indices}) -> ${wa(s,x)} {
      var value = ${wa(s,x)}(0.0);
      let col = colIn * ${s};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${b.type.indices};
        ${Un("aIndices",b,b.rank-2,C.rank,"batchIndices")}
        ${b.indicesSet("aIndices",b.rank-2,"u32(row)")}
        ${b.indicesSet("aIndices",b.rank-1,"u32(colIn)")}
        value = ${b.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${C.type.indices}) -> ${wa(s,x)} {
      var value = ${wa(s,x)}(0.0);
      let col = colIn * ${s};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${w.type.indices};
        ${Un("bIndices",w,w.rank-2,C.rank,"batchIndices")}
        ${w.indicesSet("bIndices",w.rank-2,"u32(row)")}
        ${w.indicesSet("bIndices",w.rank-1,"u32(colIn)")}
        value = ${w.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${wa(s,x)}) {
      let col = colIn * ${s};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${i?`value = value + ${m?"bias[colIn]":`${wa(s,x)}(bias[row])`};`:""}
        ${o}
        ${M.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},Y0=(s,i,o,d,m=!1,C)=>{let b=s[0].dims,w=s[1].dims,M=b.slice(0,-2),x=w.slice(0,-2),D=d?d.slice(0,-2):o.slice(0,-2),_=Ye.size(D),v=b[b.length-2],Q=b[b.length-1],F=w[w.length-1],j=Q%4===0&&F%4===0,X=v<=8?[4,1,1]:[4,4,1],R=[8,8,1],L=[Math.ceil(F/R[0]/X[0]),Math.ceil(v/R[1]/X[1]),Math.ceil(_/R[2]/X[2])],K=j?4:1,g=[...M,v,Q/K],k=g.length,e=[...x,Q,F/K],u=e.length,B=[_,v,F/K],q=[{type:6,data:v},{type:6,data:F},{type:6,data:Q}];Di(i,q),q.push(...$t(D,g,e));let y=["rank","rank"],S=s.length>2;S&&(q.push(...$t(s[2].dims)),y.push("rank")),q.push(...$t(B));let ge=Ae=>{let me=D.length,Me=_2("batchDims",s[0].dataType,me,1),Ie=ha(s[0].dataType),_e=st("a",s[0].dataType,k,K),ye=st("b",s[1].dataType,u,K),Ge=Xt("result",s[0].dataType,B.length,K),qe=[_e,ye];if(S){let Ee=m?K:1;qe.push(st("bias",s[2].dataType,s[2].dims.length,Ee))}let xe=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Ti(i,xe);let Ce=ha(Ge.type.tensor),ie=yi(i,Ge.type.value,Ce),ae=Fp(K,S,ie,[Me,_e,ye,Ge],m);return`
  ${Ae.registerUniforms(xe).registerInternalVariables(Me).declareVariables(...qe,Ge)}
  ${ae}
  ${j?o2(X,R,Ie,Me):i2(X,R,Ie,Me)}
                   `};return{name:"MatMul",shaderCache:{hint:`${X};${i.activation};${j};${m}`,inputDependencies:y},getRunData:()=>({outputs:[{dims:C?C(o):o,dataType:s[0].dataType}],dispatchGroup:{x:L[0],y:L[1],z:L[2]},programUniforms:q}),getShaderSource:ge}}}),Qp,Kb,N6=Mt(()=>{"use strict";lA(),xo(),kA(),Gi(),P2(),L6(),Q2(),Qp=(s,i,o,d,m=!1,C,b=4,w=4,M=4,x="f32")=>{let D=q=>{switch(q){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${x}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${q} is not supported.`)}},_=q=>{switch(q){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${q} is not supported.`)}},v=s?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,Q=s?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,F=s?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",j=s?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",X=s?"row":"col",R=s?"col":"row",L=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${s?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${X} / outWidth;
    let outCol = ${X} % outWidth;

    let WRow = ${R} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${R} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${R} % inChannels;
    var resData = ${wa(b,x)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${F} && xCol >= 0 && xCol < ${j}) {
      ${v}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${D(b)}
    }
    return resData;`,K=s?i&&d?`
    let col = colIn * ${b};
    ${L}`:`
    let col = colIn * ${b};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${L}
    }
    return ${wa(b,x)}(0.0);`:d&&o?`
    let col = colIn * ${b};
    ${L}`:`
    let col = colIn * ${b};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${L}
    }
    return ${wa(b,x)}(0.0);`,g=s?d&&o?_(w):`
    let col = colIn * ${w};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_(w)}
    }
    return ${wa(w,x)}(0.0);`:`
    let col = colIn * ${w};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${_(w)}
    }
    return ${wa(w,x)}(0.0);`,k=wa(M,x),e=wa(s?b:w,x),u=wa(s?w:b,x),B=yi(C,k,x);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${e} {
      ${s?K:g}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${u} {
      ${s?g:K}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${k}) {
      let col = colIn * ${M};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${s?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${Q}
      ${Hb(m)}
      ${B}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Kb=(s,i,o,d,m,C,b,w,M)=>{let x=i.format==="NHWC",D=x?s[0].dims[3]:s[0].dims[1],_=o[0],v=x?o[2]:o[3],Q=x?o[1]:o[2],F=x?o[3]:o[1],j=x&&(D%4===0||D%3===0)&&F%4===0,X=x?F:v*Q,R=x?v*Q:F,L=[8,8,1],K=d<=8?[4,1,1]:[4,4,1],g=[Math.ceil(X/L[0]/K[0]),Math.ceil(R/L[1]/K[1]),Math.ceil(_/L[2]/K[2])];SA("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${g}`);let k=j?x&&D%4!==0?3:4:1,e=L[1]*K[1],u=L[0]*K[0],B=Math.max(L[0]*k,L[1]),q=d%e===0,y=m%u===0,S=C%B===0,ge=j?[k,4,4]:[1,1,1],Ae=[{type:6,data:d},{type:6,data:m},{type:6,data:C},{type:6,data:[i.pads[0],i.pads[1]]},{type:6,data:i.strides},{type:6,data:i.dilations}];Di(i,Ae),Ae.push(...$t(s[0].dims,s[1].dims));let me=["rank","rank"];b&&(Ae.push(...$t(s[2].dims)),me.push("rank")),Ae.push(...$t(o));let Me=Ie=>{let _e=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Ti(i,_e);let ye=j?4:1,Ge=ha(s[0].dataType),qe=`
      fn setOutputAtIndex(flatIndex : i32, value : ${j?`vec4<${Ge}>`:Ge}) {
        result[flatIndex] = ${j?`vec4<${Ge}>`:Ge}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${j?`vec4<${Ge}>`:Ge}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${j?"/ 4":""}, value);
      }`,xe=st("x",s[0].dataType,s[0].dims.length,k===3?1:k),Ce=st("w",s[1].dataType,s[1].dims.length,ye),ie=[xe,Ce],ae=Xt("result",s[0].dataType,o.length,ye);if(b){let Ee=st("bias",s[2].dataType,s[2].dims.length,ye);ie.push(Ee),qe+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${j?`vec4<${Ge}>`:Ge} {
          return bias[coords.${x?"w":"y"}${j?"/ 4":""}];
        }`}return`
        ${Ub("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${Ie.registerUniforms(_e).declareVariables(...ie,ae)}
        ${qe}
        ${Qp(x,q,y,S,b,i,ge[0],ge[1],ge[2],Ge)}
        ${j?o2(K,L,Ge,void 0,!x,B):i2(K,L,Ge,void 0,!x,B,!1,void 0,w)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${i.cacheKey};${k};${j};${q};${y};${S};${e};${u};${B}`,inputDependencies:me},getRunData:()=>({outputs:[{dims:M?M(o):o,dataType:s[0].dataType}],dispatchGroup:{x:g[0],y:g[1],z:g[2]},programUniforms:Ae}),getShaderSource:Me}}}),Sp,kc,On,Op,Mc,Lp,Xb,Zb,z6=Mt(()=>{"use strict";lA(),xo(),IA(),kA(),Gi(),P2(),Sp=s=>{let i=1;for(let o=0;o<s.length;o++)i*=s[o];return i},kc=s=>typeof s=="number"?[s,s,s]:s,On=(s,i)=>i<=1?s:s+(s-1)*(i-1),Op=(s,i,o,d=1)=>{let m=On(i,d);return Math.floor((s[0]*(o-1)-o+m)/2)},Mc=(s,i,o,d,m)=>{m==null&&(m=Op(s,i[0],d[0]));let C=[0,0,0,o];for(let b=0;b<3;b++)s[b]+2*m>=i[b]&&(C[b]=Math.trunc((s[b]-i[b]+2*m)/d[b]+1));return C},Lp=(s,i,o,d,m,C,b,w,M,x)=>{let D,_,v,Q;if(s==="VALID"&&(s=0),typeof s=="number"){D={top:s,bottom:s,left:s,right:s,front:s,back:s};let F=Mc([i,o,d,1],[w,M,x],1,[m,C,b],s);_=F[0],v=F[1],Q=F[2]}else if(Array.isArray(s)){if(!s.every((j,X,R)=>j===R[0]))throw Error(`Unsupported padding parameter: ${s}`);D={top:s[0],bottom:s[1],left:s[2],right:s[3],front:s[4],back:s[5]};let F=Mc([i,o,d,1],[w,M,x],1,[m,C,b],s[0]);_=F[0],v=F[1],Q=F[2]}else if(s==="SAME_UPPER"){_=Math.ceil(i/m),v=Math.ceil(o/C),Q=Math.ceil(d/b);let F=(_-1)*m+w-i,j=(v-1)*C+M-o,X=(Q-1)*b+x-d,R=Math.floor(F/2),L=F-R,K=Math.floor(j/2),g=j-K,k=Math.floor(X/2),e=X-k;D={top:K,bottom:g,left:k,right:e,front:R,back:L}}else throw Error(`Unknown padding parameter: ${s}`);return{padInfo:D,outDepth:_,outHeight:v,outWidth:Q}},Xb=(s,i,o,d,m,C=!1,b="channelsLast")=>{let w,M,x,D,_;if(b==="channelsLast")[w,M,x,D,_]=s;else if(b==="channelsFirst")[w,_,M,x,D]=s;else throw new Error(`Unknown dataFormat ${b}`);let[v,,Q,F,j]=i,[X,R,L]=kc(o),[K,g,k]=kc(d),e=On(Q,K),u=On(F,g),B=On(j,k),{padInfo:q,outDepth:y,outHeight:S,outWidth:ge}=Lp(m,M,x,D,X,R,L,e,u,B),Ae=C?v*_:v,me=[0,0,0,0,0];return b==="channelsFirst"?me=[w,Ae,y,S,ge]:b==="channelsLast"&&(me=[w,y,S,ge,Ae]),{batchSize:w,dataFormat:b,inDepth:M,inHeight:x,inWidth:D,inChannels:_,outDepth:y,outHeight:S,outWidth:ge,outChannels:Ae,padInfo:q,strideDepth:X,strideHeight:R,strideWidth:L,filterDepth:Q,filterHeight:F,filterWidth:j,effectiveFilterDepth:e,effectiveFilterHeight:u,effectiveFilterWidth:B,dilationDepth:K,dilationHeight:g,dilationWidth:k,inShape:s,outShape:me,filterShape:i}},Zb=(s,i,o,d,m,C)=>{let b=C==="channelsLast",w=b?s[0].dims[3]:s[0].dims[1],M=!1,x=[64,1,1],D={x:o.map((L,K)=>K)},_=[Math.ceil(Sp(D.x.map(L=>o[L]))/x[0]),1,1];SA("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${_}`);let v=M?b&&w%4!==0?3:4:1,Q=Ye.size(o),F=[{type:12,data:Q},{type:12,data:d},{type:12,data:m},{type:12,data:i.strides},{type:12,data:i.dilations}];Di(i,F),F.push(...$t(s[0].dims,s[1].dims));let j=["rank","rank"],X=s.length===3;X&&(F.push(...$t(s[2].dims)),j.push("rank")),F.push(...$t(o));let R=L=>{let K=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:d.length},{name:"pads",type:"u32",length:m.length},{name:"strides",type:"u32",length:i.strides.length},{name:"dilations",type:"u32",length:i.dilations.length}];Ti(i,K);let g=M?4:1,k=ha(s[0].dataType),e=st("x",s[0].dataType,s[0].dims.length,v===3?1:v),u=st("W",s[1].dataType,s[1].dims.length,g),B=[e,u],q=Xt("result",s[0].dataType,o.length,g),y="";if(X){let Ae=st("bias",s[2].dataType,s[2].dims.length,g);B.push(Ae),y+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${M?`vec4<${k}>`:k} {
          return bias[${b?Jt("coords",4,5):Jt("coords",1,5)}${M?"/ 4":""}];
        }`}let S=wa(v,k),ge=yi(i,S,k);return`
            ${y}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${e.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> f32 {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${u.getByIndices("aIndices")};
            }
          ${L.registerUniforms(K).declareVariables(...B,q)}
          ${L.mainStart()}
          ${L.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${q.offsetToIndices("global_idx")};
              let batch = ${Jt("coords",0,e.rank)};
              let d2 = ${b?Jt("coords",e.rank-1,e.rank):Jt("coords",1,e.rank)};
              let xFRCCorner = vec3<u32>(${b?Jt("coords",1,e.rank):Jt("coords",2,e.rank)},
              ${b?Jt("coords",2,e.rank):Jt("coords",3,e.rank)},
              ${b?Jt("coords",3,e.rank):Jt("coords",4,e.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${b?Jt("uniforms.x_shape",1,e.rank):Jt("uniforms.x_shape",2,e.rank)};
              let xShapeZ = ${b?Jt("uniforms.x_shape",2,e.rank):Jt("uniforms.x_shape",3,e.rank)};
              let xShapeW = ${b?Jt("uniforms.x_shape",3,e.rank):Jt("uniforms.x_shape",4,e.rank)};
              let xShapeU = ${b?Jt("uniforms.x_shape",4,e.rank):Jt("uniforms.x_shape",1,e.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = 0.0;
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${b?`let xValues = vec4<f32>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<f32>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<f32>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${b?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${b?`let xValues = vec2<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${b?`let xValues = vec3<f32>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<f32>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<f32>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${X?"value = value + getBiasByOutputCoords(coords)":""};
              ${ge}
              result[global_idx] = f32(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${i.cacheKey};${b};${v};${X}`,inputDependencies:j},getRunData:()=>({outputs:[{dims:o,dataType:s[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:F}),getShaderSource:R}}}),Jb,qb,R6=Mt(()=>{"use strict";lA(),IA(),kA(),Gi(),Jb=(s,i,o,d)=>{let m=s.length>2,C=m?"value += b[output_channel];":"",b=s[0].dims,w=s[1].dims,M=i.format==="NHWC",x=M?o[3]:o[1],D=x/i.group,_=M&&D>=4?zr(x):1,v=Ye.size(o)/_,Q=[{type:12,data:v},{type:12,data:i.dilations},{type:12,data:[i.strides[0],i.strides[1]]},{type:12,data:[i.pads[0],i.pads[1]]},{type:12,data:D}];Di(i,Q),Q.push(...$t(b,[w[0],w[1],w[2],w[3]/_]));let F=m?["rank","rank","rank"]:["rank","rank"];Q.push(...$t([o[0],o[1],o[2],o[3]/_]));let j=X=>{let R=Xt("output",s[0].dataType,o.length,_),L=ha(R.type.tensor),K=yi(i,R.type.value,L),g=st("x",s[0].dataType,b.length),k=st("w",s[1].dataType,w.length,_),e=[g,k];m&&e.push(st("b",s[2].dataType,s[2].dims,_));let u=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:i.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Ti(i,u);let B=M?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${g.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${k.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${g.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${k.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${X.registerUniforms(u).declareVariables(...e,R)}

  ${X.mainStart()}
    ${X.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${R.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${M?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${M?1:2}], outputIndices[${M?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${_} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${M?2:1}];

    var value: ${R.type.value} = ${R.type.value}(0);
    ${B}
    ${C}
    ${K}
    ${R.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${i.cacheKey}_${_}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:d?d(o):o,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:Q}),getShaderSource:j}},qb=(s,i,o,d)=>{let m=s.length>2,C=zr(o[3]),b=zr(o[2]),w=Ye.size(o)/C/b,M=[s[0].dims[0],s[0].dims[1],s[0].dims[2],s[0].dims[3]/C],x=[s[1].dims[0],s[1].dims[1],s[1].dims[2],s[1].dims[3]/C],D=[o[0],o[1],o[2],o[3]/C],_=[{type:12,data:w},{type:6,data:[i.strides[0],i.strides[1]]},{type:6,data:[i.pads[0],i.pads[1]]}];Di(i,_),_.push(...$t(M,x,D));let v=(b-1)*i.strides[1]+x[1],Q=F=>{let j=Xt("output",s[0].dataType,D.length,C),X=ha(j.type.tensor),R=yi(i,j.type.value,X),L=st("x",s[0].dataType,M.length,C),K=st("w",s[1].dataType,x.length,C),g=[L,K];m&&g.push(st("b",s[2].dataType,s[2].dims,C));let k=m?"value += b[output_channel];":"",e=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Ti(i,e),`
  ${F.registerUniforms(e).declareVariables(...g,j)}
  ${F.mainStart()}
    ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${b}u;
    let col = (index1 % width1) * ${b}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${L.type.value}, ${v}>;
    var values: array<${j.type.value}, ${b}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${x[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${v}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${L.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${L.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${x[1]}; w_width++) {
          let w_val = ${K.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${b}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${b}u; i++) {
      var value = values[i];
      ${k}
      ${R}
      ${j.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${i.cacheKey};${C};${b};${v};${x[0]};${x[1]}`,inputDependencies:m?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:d?d(o):o,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:_}),getShaderSource:Q}}}),Np,G0,zp,F0,n2,xc,Rp,jp,l2,j6=Mt(()=>{"use strict";IA(),N6(),z6(),Q2(),R6(),Gi(),F2(),qo(),Np=(s,i,o,d,m,C)=>{let b=s[0],w=s.slice(C?1:2,C?3:4),M=w.length,x=i[0],D=i.slice(2).map((v,Q)=>v+(v-1)*(o[Q]-1)),_=w.map((v,Q)=>v+d[Q]+d[Q+M]).map((v,Q)=>Math.floor((v-D[Q]+m[Q])/m[Q]));return _.splice(0,0,b),_.splice(C?3:1,0,x),_},G0=[2,3,1,0],zp=(s,i)=>{if(!s||s.length!==2&&s.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(s[0].dims.length>5)throw new Error("greater than 5D is not supported");if(s[0].dims.length!==s[1].dims.length)throw new Error("filter does not have same dimension as input");let o=s[0].dims[i.format==="NHWC"?s[0].dims.length-1:1],d=s[1].dims[1]*i.group;if(o!==d)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(s.length===3&&(s[2].dims.length!==1||s[1].dims[0]!==s[2].dims[0]))throw new Error("invalid bias");let m=s[0].dims.length-2;if(i.dilations.length!==m)throw new Error(`dilations should be ${m}D`);if(i.strides.length!==m)throw new Error(`strides should be ${m}D`);if(i.pads.length!==m*2)throw new Error(`pads should be ${m*2}D`);if(i.kernelShape.length!==0&&i.kernelShape.length!==s[1].dims.length-2)throw new Error("invalid kernel shape")},F0=(s,i)=>{let o=s.kernelShape.slice();o.length<i[1].dims.length-2&&o.push(...Array(i[1].dims.length-2-o.length).fill(0));for(let C=2;C<i[1].dims.length;++C)o[C-2]===0&&(o[C-2]=i[1].dims[C]);let d=s.pads.slice();W0.adjustPadsBasedOnAutoPad(i[0].dims,s.strides,s.dilations,o,d,s.format==="NHWC",s.autoPad);let m=Object.assign({},s);return Object.assign(m,{kernelShape:o,pads:d}),m},n2=s=>{let i=T2(s),o=s.format,d=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][s.auto_pad],m=s.dilations,C=s.group,b=s.kernel_shape,w=s.pads,M=s.strides,x=s.w_is_const();return{autoPad:d,format:o,dilations:m,group:C,kernelShape:b,pads:w,strides:M,wIsConst:x,...i,cacheKey:`${s.format};${i.activation};`}},xc=(s,i,o,d)=>{let m=o.format==="NHWC",C=Np(i[0].dims,i[1].dims,o.dilations,o.pads,o.strides,m);if(o.group!==1){let e=[i[0]];if(m){let u=s.kernelCustomData.wT??s.compute(fs(i[1],G0),{inputs:[1],outputs:[o.wIsConst?-2:-1]})[0];o.wIsConst&&!s.kernelCustomData.wT&&(s.kernelCustomData.wT=u),e.push(u)}else e.push(i[1]);i.length===3&&e.push(i[2]),!s.adapterInfo.isArchitecture("ampere")&&m&&i[1].dims[0]===o.group&&i[1].dims[1]===1&&o.dilations[0]===1&&o.dilations[1]===1?s.compute(qb(e,o,C,d),{inputs:e}):s.compute(Jb(e,o,C,d),{inputs:e});return}let b=i.length===3,w=i[0].dims[m?1:2],M=i[0].dims[m?2:3],x=i[0].dims[m?3:1],D=i[1].dims[2],_=i[1].dims[3],v=C[m?1:2],Q=C[m?2:3],F=C[m?3:1],j=m&&D===w&&_===M&&o.pads[0]===0&&o.pads[1]===0;if(j||D===1&&_===1&&o.dilations[0]===1&&o.dilations[1]===1&&o.strides[0]===1&&o.strides[1]===1&&o.pads[0]===0&&o.pads[1]===0){let e=C[0],u,B,q,y=[];if(m){let Ae=s.kernelCustomData.wT??s.compute(fs(i[1],G0),{inputs:[1],outputs:[o.wIsConst?-2:-1]})[0];if(o.wIsConst&&!s.kernelCustomData.wT&&(s.kernelCustomData.wT=Ae),j){let me=w*M*x;u=i[0].reshape([1,e,me]),B=Ae.reshape([1,me,F]),q=[1,e,F]}else u=i[0].reshape([e,w*M,x]),B=Ae.reshape([1,x,F]),q=[e,v*Q,F];y.push(u),y.push(B)}else u=i[0].reshape([e,x,w*M]),B=i[1].reshape([1,F,x]),q=[e,F,v*Q],y.push(B),y.push(u);b&&y.push(i[2]);let S=q[2],ge=y[0].dims[y[0].dims.length-1];S<8&&ge<8?s.compute(G2(y,o,C,q,m,d),{inputs:y}):s.compute(Y0(y,o,C,q,m,d),{inputs:y});return}let X=!0,R=s.kernelCustomData.wT??s.compute(fs(i[1],G0),{inputs:[1],outputs:[o.wIsConst?-2:-1]})[0];o.wIsConst&&!s.kernelCustomData.wT&&(s.kernelCustomData.wT=R);let L=[i[0],R];b&&L.push(i[2]);let K=m?v*Q:F,g=m?F:v*Q,k=D*_*x;s.compute(Kb(L,o,C,K,g,k,b,X,d),{inputs:L})},Rp=(s,i)=>{let o=i.format==="NHWC",d=[s.inputs[0].reshape(o?[s.inputs[0].dims[0],1,s.inputs[0].dims[1],s.inputs[0].dims[2]]:[s.inputs[0].dims[0],s.inputs[0].dims[1],1,s.inputs[0].dims[2]]),s.inputs[1].reshape([s.inputs[1].dims[0],s.inputs[1].dims[1],1,s.inputs[1].dims[2]])];s.inputs.length===3&&d.push(s.inputs[2]);let m=[0,i.pads[0],0,i.pads[1]],C=[1].concat(i.strides),b=[1].concat(i.dilations),w=[1].concat(i.kernelShape),M=F0({...i,pads:m,strides:C,dilations:b,kernelShape:w},d);xc(s,d,M,x=>o?[x[0],x[2],x[3]]:[x[0],x[1],x[3]])},jp=(s,i,o)=>{let d=o.format==="NHWC"?"channelsLast":"channelsFirst",m=F0(o,i),C=o.autoPad==="NOTSET"?o.pads:o.autoPad,b=Xb(i[0].dims,i[1].dims,o.strides,o.dilations,C,!1,d);s.compute(Zb(i,m,b.outShape,[b.filterDepth,b.filterHeight,b.filterWidth],[b.padInfo.front,b.padInfo.top,b.padInfo.left],d))},l2=(s,i)=>{if(zp(s.inputs,i),s.inputs[0].dims.length===3)Rp(s,i);else if(s.inputs[0].dims.length===5)jp(s,s.inputs,i);else{let o=F0(i,s.inputs);xc(s,s.inputs,o)}}}),$b,W6=Mt(()=>{"use strict";lA(),xo(),IA(),kA(),$b=(s,i,o)=>{let d=s.length>2,m=i.outputShape,C=i.format==="NHWC",b=i.group,w=s[1].dims,M=w[2]/b,x=w[3],D=C?zr(M):1,_=C&&x===1&&M>=4,v=_?Math.floor(M/4)*4:Math.floor(M/D)*D,Q=M-v,F=C?zr(x):1,j=C?x===1?D:F:1,X=Ye.size(m)/F,R=[Math.ceil(X/64),1,1];SA("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${R}`);let L=["rank","rank"],K=[i.strides[0],i.strides[1]],g=[i.kernelShape[C?1:2],i.kernelShape[C?2:3]],k=[i.dilations[0],i.dilations[1]],e=[g[0]+(i.dilations[0]<=1?0:(i.kernelShape[C?1:2]-1)*(i.dilations[0]-1)),g[1]+(i.dilations[1]<=1?0:(i.kernelShape[C?2:3]-1)*(i.dilations[1]-1))],u=[e[0]-1-Math.floor((i.pads[0]+i.pads[2])/2),e[1]-1-Math.floor((i.pads[1]+i.pads[3])/2)],B=[{type:12,data:X},{type:12,data:K},{type:12,data:g},{type:12,data:k},{type:12,data:e},{type:6,data:u},{type:12,data:v},{type:12,data:M},{type:12,data:x},...$t(s[0].dims,s[1].dims)];d&&(B.push(...$t(s[2].dims)),L.push("rank")),B.push(...$t(m));let q=y=>{let S=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:K.length},{name:"filter_dims",type:"u32",length:g.length},{name:"dilations",type:"u32",length:g.length},{name:"effective_filter_dims",type:"u32",length:e.length},{name:"pads",type:"i32",length:u.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],ge=ha(s[0].dataType),Ae=C?1:2,me=C?2:3,Me=C?3:1,Ie=st("W",s[1].dataType,s[1].dims.length,j),_e=st("Dy",s[0].dataType,s[0].dims.length,D),ye=[_e,Ie];d&&ye.push(st("bias",s[2].dataType,[m[Me]].length,F));let Ge=Xt("result",s[0].dataType,m.length,F),qe=()=>{let ie="";if(_)D===4?ie+=`
        let xValue = ${_e.getByOffset("x_offset")};
        let wValue = ${Ie.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:D===2?ie+=`
          dotProd = dotProd + dot(vec4<${ge}>(${_e.getByOffset("x_offset")}, ${_e.getByOffset("x_offset + 1u")}), vec4<${ge}>(${Ie.getByOffset("w_offset")}, ${Ie.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:D===1&&(ie+=`
          dotProd = dotProd + dot(vec4<${ge}>(${_e.getByOffset("x_offset")}, ${_e.getByOffset("x_offset + 1u")}, ${_e.getByOffset("x_offset + 2u")}, ${_e.getByOffset("x_offset + 3u")}), vec4<${ge}>(${Ie.getByOffset("w_offset")}, ${Ie.getByOffset("w_offset + 1u")}, ${Ie.getByOffset("w_offset + 2u")}, ${Ie.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(ie+=`
                  let xValue = ${C?_e.getByOffset(`${_e.indicesToOffset(`${_e.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${D}`):_e.get("batch","inputChannel","idyR","idyC")};
        `,D===1)ie+=`
          let w_offset = ${Ie.indicesToOffset(`${Ie.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${Ie.getByOffset(`w_offset / ${j}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let ae=0;ae<D;ae++)ie+=`
            let wValue${ae} = ${Ie.getByOffset(`${Ie.indicesToOffset(`${Ie.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${ae}, wOutChannel)`)} / ${j}`)};
            dotProd = dotProd + xValue[${ae}] * wValue${ae};`;return ie},xe=()=>{if(Q===0)return"";if(!_)throw new Error(`packInputAs4 ${_} is not true.`);let ie="";if(D===1){ie+="dotProd = dotProd";for(let ae=0;ae<Q;ae++)ie+=`
            + ${_e.getByOffset(`x_offset + ${ae}`)} * ${Ie.getByOffset(`w_offset + ${ae}`)}`;ie+=";"}else if(D===2){if(Q!==2)throw new Error(`Invalid inputChannelsRemainder ${Q}.`);ie+=`
          let xValue = ${_e.getByOffset("x_offset")};
          let wValue = ${Ie.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return ie},Ce=`
            let outputIndices = ${Ge.offsetToIndices(`global_idx * ${F}`)};
            let batch = ${Ge.indicesGet("outputIndices",0)};
            let d1 = ${Ge.indicesGet("outputIndices",Me)};
            let r = ${Ge.indicesGet("outputIndices",Ae)};
            let c = ${Ge.indicesGet("outputIndices",me)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${Ge.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${ge}(dyRCorner) + ${ge}(wR)) / ${ge}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${ge}(uniforms.Dy_shape[${Ae}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${ge}(dyCCorner) + ${ge}(wC)) / ${ge}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${ge}(uniforms.Dy_shape[${me}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${_?`
                var x_offset = ${_e.indicesToOffset(`${_e.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${D};
                var w_offset = ${Ie.indicesToOffset(`${Ie.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${j};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${_?4:D}) {
                  ${qe()}
                  inputChannel = inputChannel + ${_?4:D};
                }
                ${xe()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${d?` + bias[d1 / ${F}]`:""};
            ${Ge.setByOffset("global_idx","value")};
          `;return`
    ${y.registerUniforms(S).declareVariables(...ye,Ge)}
      ${y.mainStart()}
      ${y.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${Ce}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${i.cacheKey};${D}${j}${F}${_}${Q}`,inputDependencies:L},getRunData:()=>({dispatchGroup:{x:R[0],y:R[1],z:R[2]},outputs:[{dims:o?o(m):m,dataType:s[0].dataType}],programUniforms:B}),getShaderSource:q}}}),Wp,Vp,Yp,vc,eC,Hp,Ec,Up,tC,V6=Mt(()=>{"use strict";W6(),Gi(),qo(),Wp=(s,i,o,d,m,C)=>(s-1)*i+o+(d-1)*m+1-C,Vp=(s,i,o,d,m)=>{let C=Math.floor(s/2);i==="SAME_UPPER"?(o[d]=C,o[m]=s-C):i==="SAME_LOWER"&&(o[d]=s-C,o[m]=C)},Yp=(s,i,o,d,m,C,b,w,M,x)=>{let D=s.length-2,_=x.length===0;M.length<D&&M.push(...Array(D-M.length).fill(0));let v=s[0],Q=i[w?3:1]*m;for(let F=0,j=s.length-D-(w?1:0);F<D;++F,++j){let X=s[j],R=_?X*b[F]:x[F],L=Wp(X,b[F],C[F],i[j],o[F],R);Vp(L,d,C,F,F+D),_&&x.push(b[F]*(X-1)+M[F]+(i[j]-1)*o[F]+1-C[F]-C[F+D])}x.splice(0,0,v),x.splice(w?3:1,0,Q)},vc=(s,i)=>{let o=s.kernelShape.slice();if(s.kernelShape.length===0||s.kernelShape.reduce((_,v)=>_*v,1)===0){o.length=0;for(let _=2;_<i[1].dims.length;++_)o.push(i[1].dims[_])}let d=s.format==="NHWC";o.splice(0,0,i[1].dims[0]),o.splice(d?3:1,0,i[1].dims[1]);let m=s.pads.slice(),C=s.outputShape.slice(),b=s.outputPadding.slice(),w=i[0].dims,M=s.dilations.slice();if(M.reduce((_,v)=>_+v,0)===0){let _=i[0].dims.length-2;M=new Array(_).fill(1)}let x=s.strides.slice();if(x.reduce((_,v)=>_+v,0)===0){let _=i[0].dims.length-2;x=new Array(_).fill(1)}Yp(w,o,M,s.autoPad,s.group,m,x,d,b,C);let D=Object.assign({},s);return Object.assign(D,{kernelShape:o,pads:m,outputPadding:b,outputShape:C,dilations:M,strides:x}),D},eC=s=>{let i=T2(s),o=s.format,d=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof s.autoPad>"u"?0:s.autoPad],m=s.dilations,C=s.group,b=s.kernelShape,w=s.pads,M=s.strides,x=s.wIsConst(),D=s.outputPadding,_=s.outputShape;return{autoPad:d,format:o,dilations:m,group:C,kernelShape:b,outputPadding:D,outputShape:_,pads:w,strides:M,wIsConst:x,...i,cacheKey:`${s.format};${i.activation};`}},Hp=(s,i)=>{if(!s||s.length!==2&&s.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(s[0].dims.length!==4&&s[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(s[0].dims.length!==s[1].dims.length)throw new Error("filter does not have same dimension as input");let o=s[0].dims[i.format==="NHWC"?s[0].dims.length-1:1],d=s[1].dims[0];if(o!==d)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let m=s[1].dims[1]*i.group;if(s.length===3&&(s[2].dims.length!==1||s[2].dims[0]!==m))throw new Error("invalid bias");let C=s[0].dims.length-2;if(i.dilations.reduce((b,w)=>b+w,0)>0&&i.dilations.length!==C)throw new Error(`dilations should be ${C}D`);if(i.strides.reduce((b,w)=>b+w,0)>0&&i.strides.length!==C)throw new Error(`strides should be ${C}D`);if(i.pads.reduce((b,w)=>b+w,0)>0&&i.pads.length!==C*2)throw new Error(`pads should be ${C*2}D`);if(i.outputPadding.length!==C&&i.outputPadding.length!==0)throw new Error(`output_padding should be ${C}D`);if(i.kernelShape.reduce((b,w)=>b+w,0)>0&&i.kernelShape.length!==0&&i.kernelShape.length!==s[1].dims.length-2)throw new Error("invalid kernel shape");if(i.outputShape.length!==0&&i.outputShape.length!==s[0].dims.length-2)throw new Error("invalid output shape")},Ec=(s,i,o,d)=>{let m=s.kernelCustomData.wT??s.compute(fs(i[1],[2,3,0,1]),{inputs:[1],outputs:[o.wIsConst?-2:-1]})[0];o.wIsConst&&!s.kernelCustomData.wT&&(s.kernelCustomData.wT=m);let C=[i[0],m];i.length===3&&C.push(i[2]),s.compute($b(C,o,d),{inputs:C})},Up=(s,i)=>{let o=i.format==="NHWC",d=[s.inputs[0].reshape(o?[s.inputs[0].dims[0],1,s.inputs[0].dims[1],s.inputs[0].dims[2]]:[s.inputs[0].dims[0],s.inputs[0].dims[1],1,s.inputs[0].dims[2]]),s.inputs[1].reshape([s.inputs[1].dims[0],s.inputs[1].dims[1],1,s.inputs[1].dims[2]])];s.inputs.length===3&&d.push(s.inputs[2]);let m=i.kernelShape;(m.length===0||m[0]===0)&&(m=[s.inputs[1].dims[2]]);let C=i.dilations;(C.length===0||C[0]===0)&&(C=[1]);let b=i.strides;(b.length===0||b[0]===0)&&(b=[1]);let w=i.pads;w.length===0&&(w=[0,0]),w=[0,w[0],0,w[1]],b=[1].concat(b),C=[1].concat(C),m=[1].concat(m);let M=i.outputPadding;M=[0].concat(M);let x=vc({...i,pads:w,strides:b,dilations:C,kernelShape:m,outputPadding:M},d);Ec(s,d,x,D=>o?[D[0],D[2],D[3]]:[D[0],D[1],D[3]])},tC=(s,i)=>{if(Hp(s.inputs,i),s.inputs[0].dims.length===3)Up(s,i);else{let o=vc(i,s.inputs);Ec(s,s.inputs,o)}}}),Kp,AC,rC,Y6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Kp=(s,i,o,d)=>{let m=Ye.size(i),C=i.length,b=st("input",s,C),w=Xt("output",s,C),M=o.dataType===6?o.getInt32Array()[0]:Number(o.getBigInt64Array()[0]),x=Ye.normalizeAxis(M,C),D=_=>{let v=` i32(${b.indicesGet("inputIndices","uniforms.axis")}) `,Q=Jt("uniforms.input_shape","uniforms.axis",C),F=d.reverse?v+(d.exclusive?" + 1":""):"0",j=d.reverse?Q:v+(d.exclusive?"":" + 1");return`
                ${_.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(b,w)}
                ${_.mainStart()}
                  ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${w.offsetToIndices("global_idx")};
                  var sum = ${w.type.value}(0);
                  let first : i32 = ${F};
                  let last : i32 = ${j};
                  for (var i : i32 = first; i < last; i++) {
                    ${b.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${b.getByIndices("inputIndices")};
                  }
                  ${w.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:d.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:i,dataType:s}],dispatchGroup:{x:Math.ceil(m/64)},programUniforms:[{type:12,data:m},{type:12,data:x},...$t(i,i)]}),getShaderSource:D}},AC=(s,i)=>{let o=s.inputs[0].dims,d=s.inputs[0].dataType,m=s.inputs[1];s.compute(Kp(d,o,m,i),{inputs:[0]})},rC=s=>{let i=s.exclusive===1,o=s.reverse===1;return YA({exclusive:i,reverse:o})}}),Xp,Zp,Jp,aC,sC,H6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Xp=s=>{if(!s||s.length!==1)throw new Error("DepthToSpace requires 1 input.");if(s[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},Zp=(s,i,o,d)=>{let m=[];m.push(`fn perm(i: ${d.type.indices}) -> ${o.type.indices} {
    var a: ${o.type.indices};`);for(let C=0;C<i;++C)m.push(o.indicesSet("a",s[C],`i[${C}]`));return m.push("return a;}"),m.join(`
`)},Jp=(s,i)=>{let o,d,m,C,b,w,M=i.format==="NHWC",x=i.blocksize,D=i.mode==="DCR";M?([o,d,m,C]=s.dims,b=D?[o,d,m,x,x,C/x**2]:[o,d,m,C/x**2,x,x],w=D?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([o,d,m,C]=[s.dims[0],s.dims[2],s.dims[3],s.dims[1]],b=D?[o,x,x,C/x**2,d,m]:[o,C/x**2,x,x,d,m],w=D?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let _=s.reshape(b),v=_.dims.length,Q=s.dataType,F=st("a",Q,v),j=Xt("output",Q,v),X=R=>`
  ${R.registerUniform("output_size","u32").declareVariables(F,j)}

  ${Zp(w,v,F,j)}

  ${R.mainStart()}
    ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${j.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${j.setByOffset("global_idx",F.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${s.dims};${i.blocksize};${i.mode}`,inputDependencies:["rank"]},getRunData:R=>{let L=M?[o,d*x,m*x,C/x**2]:[o,C/x**2,d*x,m*x],K=Ye.size(L),g=_.dims,k=Ye.sortBasedOnPerm(g,w);return{outputs:[{dims:L,dataType:R[0].dataType}],dispatchGroup:{x:Math.ceil(K/64)},programUniforms:[{type:12,data:K},...$t(g,k)]}},getShaderSource:X}},aC=(s,i)=>{Xp(s.inputs),s.compute(Jp(s.inputs[0],i))},sC=s=>YA({blocksize:s.blocksize,mode:s.mode,format:s.format})}),Q0,Ln,_c,qp,$p,em,tm,Bc,Am,oC,iC,U6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Q0="[a-zA-Z]|\\.\\.\\.",Ln="("+Q0+")+",_c="^"+Ln+"$",qp="("+Ln+",)*"+Ln,$p="^"+qp+"$",em=class{constructor(s=-1){this.symbolToIndices=new Map,this.inputIndex=s}addSymbol(s,i){let o=this.symbolToIndices.get(s);o===void 0?o=[i]:o.push(i),this.symbolToIndices.set(s,o)}},tm=class{constructor(s,i){this.equation=i,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[o,d]=i.includes("->")?i.split("->",2):[i,""];if(!o.match(RegExp($p)))throw new Error("Invalid LHS term");if(o.split(",").forEach((m,C)=>{let b=s[C].dims.slice();if(!m.match(RegExp(_c)))throw new Error("Invalid LHS term");let w=this.processTerm(m,!0,b,C);this.lhs.push(w)}),d==="")d+=[...this.symbolToInfo.entries()].filter(([m,C])=>C.count===1||m==="...").map(([m])=>m).join("");else if(!d.match(RegExp(Ln)))throw new Error("Invalid RHS");d.match(RegExp(Q0,"g"))?.forEach(m=>{if(m==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let C=this.symbolToInfo.get(m);if(C===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(C.dimValue)}}),this.rhs=this.processTerm(d,!1,this.outputDims)}addSymbol(s,i,o){let d=this.symbolToInfo.get(s);if(d!==void 0){if(d.dimValue!==i&&d.count!==1)throw new Error("Dimension mismatch");d.count++,d.inputIndices.push(o)}else d={count:1,dimValue:i,inputIndices:[o]};this.symbolToInfo.set(s,d)}processTerm(s,i,o,d=-1){let m=o.length,C=!1,b=[],w=0;if(!s.match(RegExp(_c))&&!i&&s!=="")throw new Error("Invalid LHS term");let M=s.match(RegExp(Q0,"g")),x=new em(d);return M?.forEach((D,_)=>{if(D==="..."){if(C)throw new Error("Only one ellipsis is allowed per input term");C=!0;let v=m-M.length+1;if(v<0)throw new Error("Ellipsis out of bounds");if(b=o.slice(w,w+v),this.hasEllipsis){if(this.ellipsisDims.length!==b.length||this.ellipsisDims.toString()!==b.toString())throw new Error("Ellipsis dimensions mismatch")}else if(i)this.hasEllipsis=!0,this.ellipsisDims=b;else throw new Error("Ellipsis must be specified in the LHS");for(let Q=0;Q<b.length;Q++){let F=String.fromCharCode(48+Q);x.addSymbol(F,_+Q),this.addSymbol(F,o[w++],d)}}else x.addSymbol(D,_+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(D,o[w++],d)}),x}},Bc=s=>s+"_max",Am=(s,i,o,d)=>{let m=s.map(x=>x.length).map((x,D)=>st(`input${D}`,i,x)),C=Ye.size(d),b=Xt("output",i,d.length),w=[...o.symbolToInfo.keys()].filter(x=>!o.rhs.symbolToIndices.has(x)),M=x=>{let D=[],_="var prod = 1.0;",v="var sum = 0.0;",Q="sum += prod;",F=[],j=[],X=[],R=[],L=o.symbolToInfo.size===o.rhs.symbolToIndices.size;o.symbolToInfo.forEach((g,k)=>{if(o.rhs.symbolToIndices.has(k)){let e=o.rhs.symbolToIndices.get(k)?.[0];e!==void 0&&o.lhs.forEach((u,B)=>{if(g.inputIndices.includes(B)){let q=u.symbolToIndices.get(k);if(q===void 0)throw new Error("Invalid symbol error");q.forEach(y=>{D.push(`${m[B].indicesSet(`input${B}Indices`,y,b.indicesGet("outputIndices",e))}`)})}})}else o.lhs.forEach((e,u)=>{if(g.inputIndices.includes(u)){let B=e.symbolToIndices.get(k);if(B===void 0)throw new Error("Invalid symbol error");B.forEach(q=>{F.push(`${m[u].indicesSet(`input${u}Indices`,q,`${k}`)}`)}),R.push(`prod *= ${m[u].getByIndices(`input${u}Indices`)};`)}}),j.push(`for(var ${k}: u32 = 0; ${k} < uniforms.${Bc(k)}; ${k}++) {`),X.push("}")});let K=L?[...D,`let sum = ${m.map((g,k)=>g.getByIndices(`input${k}Indices`)).join(" * ")};`]:[...D,v,...j,...F,_,...R,Q,...X];return`
            ${x.registerUniforms(w.map(g=>({name:`${Bc(g)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...m,b)}

            ${x.mainStart()}
            ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${b.offsetToIndices("global_idx")};
            ${m.map((g,k)=>`var input${k}Indices: ${m[k].type.indices};`).join(`
`)}
            ${K.join(`
`)};
            ${b.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:o.equation,inputDependencies:s.map(()=>"rank")},getRunData:()=>{let x=w.filter(_=>o.symbolToInfo.has(_)).map(_=>({type:12,data:o.symbolToInfo.get(_)?.dimValue||0}));x.push({type:12,data:C});let D=s.map((_,v)=>[...$t(_)]).reduce((_,v)=>_.concat(v),x);return D.push(...$t(d)),{outputs:[{dims:d,dataType:i}],dispatchGroup:{x:Math.ceil(C/64)},programUniforms:D}},getShaderSource:M}},oC=(s,i)=>{let o=new tm(s.inputs,i.equation),d=o.outputDims,m=s.inputs.map((C,b)=>C.dims);s.compute(Am(m,s.inputs[0].dataType,o,d))},iC=s=>{let i=s.equation.replace(/\s+/g,"");return YA({equation:i})}}),rm,yc,am,sm,nC,K6=Mt(()=>{"use strict";lA(),IA(),kA(),rm=s=>{if(!s||s.length!==2)throw new Error("Expand requires 2 input.");let i=s[0].dims,o=Array.from(s[1].getBigInt64Array(),Number),d=o.length<i.length?0:o.length-i.length,m=i.length<o.length?0:i.length-o.length;for(;d<o.length&&m<i.length;++d,++m)if(o[d]!==i[m]&&o[d]!==1&&i[m]!==1)throw new Error("Expand requires shape to be broadcastable to input")},yc=(s,i)=>{let o=s.length-i.length,d=[];for(let m=0;m<o;++m)d.push(s[m]);for(let m=0;m<i.length;++m)d.push(i[m]===1?s[m+o]:i[m]);return d},am=(s,i)=>s.length>i.length?yc(s,i):yc(i,s),sm=s=>{let i=s[0].dims,o=Array.from(s[1].getBigInt64Array(),Number),d=am(i,o),m=s[0].dataType,C=m===9||Ye.size(i)===1,b=m===9||i.length>0&&i[i.length-1]%4===0?4:1,w=C||d.length>0&&d[d.length-1]%4===0?4:1,M=Math.ceil(Ye.size(d)/w),x=_=>{let v=st("input",m,i.length,b),Q=Xt("output",m,d.length,w),F;if(m===9){let j=(X,R,L="")=>`
          let outputIndices${R} = ${Q.offsetToIndices(`outputOffset + ${R}u`)};
          let offset${R} = ${v.broadcastedIndicesToOffset(`outputIndices${R}`,Q)};
          let index${R} = offset${R} / 4u;
          let component${R} = offset${R} % 4u;
          ${X}[${R}] = ${L}(${v.getByOffset(`index${R}`)}[component${R}]);
        `;F=`
        let outputOffset = global_idx * ${w};
        var data = vec4<u32>(0);
        ${j("data",0,"u32")}
        ${j("data",1,"u32")}
        ${j("data",2,"u32")}
        ${j("data",3,"u32")}
        ${Q.setByOffset("global_idx","data")}
      }`}else F=`
        let outputIndices = ${Q.offsetToIndices(`global_idx * ${w}`)};
        let inputOffset = ${v.broadcastedIndicesToOffset("outputIndices",Q)};
        let data = ${Q.type.value}(${v.getByOffset(`inputOffset / ${b}`)});
        ${Q.setByOffset("global_idx","data")}
      }`;return`
    ${_.registerUniform("vec_size","u32").declareVariables(v,Q)}
    ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${F}`},D=[{type:12,data:M},...$t(i,d)];return{name:"Expand",shaderCache:{hint:`${d.length};${b}${w}`,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:[{dims:d,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(M/64)},programUniforms:D})}},nC=s=>{rm(s.inputs),s.compute(sm(s.inputs),{inputs:[0]})}}),om,lC,X6=Mt(()=>{"use strict";lA(),IA(),kA(),D2(),om=s=>{let i=s[0].dataType,o=Ye.size(s[0].dims),d=Ye.size(s[1].dims),m=d%4===0,C=b=>{let w=st("x",i,[1],4),M=st("bias",i,[1],4),x=Xt("y",i,[1],4),D=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],_=Q=>`
      let bias${Q}_offset: u32 = (global_idx * 4 + ${Q}) % uniforms.bias_size;
      let bias${Q} = ${M.getByOffset(`bias${Q}_offset / 4`)}[bias${Q}_offset % 4];`,v=m?`
      let bias = ${M.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${_(0)}${_(1)}${_(2)}${_(3)}
      let bias = ${w.type.value}(bias0, bias1, bias2, bias3);`;return`${b.registerUniforms(D).declareVariables(w,M,x)}

    ${a2(Fa(i))}

    ${b.mainStart(on)}
      ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${w.getByOffset("global_idx")};
      ${v}
      let x_in = x + bias;
      ${x.setByOffset("global_idx",s2("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${m}`,inputDependencies:["type","type"]},getShaderSource:C,getRunData:b=>({outputs:[{dims:b[0].dims,dataType:b[0].dataType}],programUniforms:[{type:12,data:Math.ceil(o/4)},{type:12,data:d}],dispatchGroup:{x:Math.ceil(o/on/4)}})}},lC=s=>{s.inputs.length<2||Ye.size(s.inputs[1].dims)===0?yb(s):s.compute(om(s.inputs))}}),im,nm,cC,uC,Z6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),im=s=>{if(!s||s.length!==2)throw new Error("Gather requires 2 inputs.")},nm=(s,i)=>{let o=s[0].dims,d=s[1].dims,m=o.length,C=Ye.normalizeAxis(i.axis,m),b=o.slice(0);b.splice(C,1,...d);let w=o[C],M=s[0].dataType===9?4:1,x=Math.ceil(Ye.size(b)/M),D=[{type:12,data:x},{type:6,data:w},{type:12,data:C},...$t(s[0].dims,s[1].dims,b)],_=v=>{let Q=st("data",s[0].dataType,s[0].dims.length,M),F=st("inputIndices",s[1].dataType,s[1].dims.length),j=Xt("output",s[0].dataType,b.length,M),X=L=>{let K=d.length,g=`var indicesIndices${L}  = ${F.type.indices}(0);`;for(let k=0;k<K;k++)g+=`${K>1?`indicesIndices${L}[${k}]`:`indicesIndices${L}`} = ${b.length>1?`outputIndices${L}[uniforms.axis + ${k}]`:`outputIndices${L}`};`;g+=`
          var idx${L} = ${F.getByIndices(`indicesIndices${L}`)};
          if (idx${L} < 0) {
            idx${L} = idx${L} + uniforms.axisDimLimit;
          }
          var dataIndices${L} : ${Q.type.indices};
        `;for(let k=0,e=0;k<m;k++)k===C?(g+=`${m>1?`dataIndices${L}[${k}]`:`dataIndices${L}`} = u32(idx${L});`,e+=K):(g+=`${m>1?`dataIndices${L}[${k}]`:`dataIndices${L}`} = ${b.length>1?`outputIndices${L}[${e}]`:`outputIndices${L}`};`,e++);return g},R;if(s[0].dataType===9){let L=(K,g,k="")=>`
          let outputIndices${g} = ${j.offsetToIndices(`outputOffset + ${g}u`)};
          ${X(g)};
          let offset${g} = ${Q.indicesToOffset(`dataIndices${g}`)};
          let index${g} = offset${g} / 4u;
          let component${g} = offset${g} % 4u;
          ${K}[${g}] = ${k}(${Q.getByOffset(`index${g}`)}[component${g}]);
        `;R=`
        let outputOffset = global_idx * ${M};
        var value = vec4<u32>(0);
        ${L("value",0,"u32")}
        ${L("value",1,"u32")}
        ${L("value",2,"u32")}
        ${L("value",3,"u32")}
        ${j.setByOffset("global_idx","value")}
      `}else R=`
      let outputIndices = ${j.offsetToIndices("global_idx")};
      ${X("")};
      let value = ${Q.getByIndices("dataIndices")};
      ${j.setByOffset("global_idx","value")};
      `;return`
      ${v.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(Q,F,j)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${R}
      }`};return{name:"Gather",shaderCache:{hint:i.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:b,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:D}),getShaderSource:_}},cC=s=>YA({axis:s.axis}),uC=(s,i)=>{let o=s.inputs;im(o),s.compute(nm(s.inputs,i))}}),lm,dC,gC,J6=Mt(()=>{"use strict";lA(),IA(),kA(),lm=(s,i,o,d,m,C,b,w,M)=>{let x=[{type:12,data:C},{type:12,data:d},{type:12,data:m},{type:12,data:o},{type:12,data:b},{type:12,data:w},{type:12,data:M}],D=[C];x.push(...$t(i.dims,D));let _=v=>{let Q=st("indices_data",i.dataType,i.dims.length),F=Xt("input_slice_offsets_data",12,1,1),j=[Q,F],X=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:m.length},{name:"sizes_from_slice_dims_data",type:"u32",length:o.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${v.registerUniforms(X).declareVariables(...j)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${m.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${o.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return s.compute({name:"computeSliceOffsets",shaderCache:{hint:`${m.length}_${o.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:D,dataType:s.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(C/64)},programUniforms:x}),getShaderSource:_},{inputs:[i],outputs:[-1]})[0]},dC=(s,i)=>{let o=s.inputs,d=o[0].dims,m=o[0].dataType,C=o[1].dims,b=C[C.length-1],w=Ye.sizeToDimension(C,C.length-1),M=Ye.sizeFromDimension(d,i.batchDims+b),x=Ye.sizeToDimension(d,i.batchDims),D=Ye.sizeFromDimension(d,i.batchDims),_=w/x,v=new Array(b),Q=M;for(let g=0;g<b;++g)v[b-1-g]=Q,Q*=d[i.batchDims+b-1-g];let F=lm(s,o[1],v,i.batchDims,d,w,_,D,b),j=i.batchDims+b;if(j>d.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let X=C.slice(0,-1).concat(d.slice(j)),R=Ye.size(X),L=[{type:12,data:R},{type:12,data:M},...$t(o[0].dims,F.dims,X)],K=g=>{let k=st("data",o[0].dataType,o[0].dims.length),e=st("slice_offsets",12,F.dims.length),u=Xt("output",o[0].dataType,X.length);return`
          ${g.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(k,e,u)}
            ${g.mainStart()}
            ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};s.compute({name:"GatherND",shaderCache:{hint:i.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:X,dataType:m}],dispatchGroup:{x:Math.ceil(R/64)},programUniforms:L}),getShaderSource:K},{inputs:[o[0],F]})},gC=s=>({batchDims:s.batch_dims,cacheKey:""})}),cm,um,fC,pC,q6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),cm=(s,i)=>{if(s.length<3||s.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let o=Ye.normalizeAxis(i.quantizeAxis,s[0].dims.length),d=i.blockSize,m=s[0],C=s[2],b=s.length===4?s[3]:void 0;if(C.dims.length!==m.dims.length||!m.dims.map((w,M)=>M===o?Math.ceil(w/d)===C.dims[M]:w===C.dims[M]).reduce((w,M)=>w&&M,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(b){if(b.dataType!==m.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(b.dims.length!==C.dims.length||!b.dims.map((w,M)=>w===C.dims[M]).reduce((w,M)=>w&&M,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},um=(s,i)=>{let o=s[0].dims,d=s[1].dims,m=o.length,C=Ye.normalizeAxis(i.gatherAxis,m),b=Ye.normalizeAxis(i.quantizeAxis,m),w=o.slice(0);w.splice(C,1,...d);let M=Ye.size(w),x=s[2].dataType,D=s[0].dataType===22,_=[{type:12,data:M},{type:12,data:b},{type:12,data:C},{type:12,data:i.blockSize},...$t(...s.map((Q,F)=>Q.dims),w)],v=Q=>{let F=st("data",s[0].dataType,s[0].dims.length),j=st("inputIndices",s[1].dataType,s[1].dims.length),X=st("scales",s[2].dataType,s[2].dims.length),R=s.length>3?st("zeroPoint",s[3].dataType,s[3].dims.length):void 0,L=Xt("output",x,w.length),K=[F,j,X];R&&K.push(R);let g=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${Q.registerUniforms(g).declareVariables(...K,L)}
        ${Q.mainStart()}
        let output_indices = ${L.offsetToIndices("global_idx")};
        var indices_indices = ${j.type.indices}(0);
        ${d.length>1?`
          for (var i: u32 = 0; i < ${d.length}; i++) {
            let index = ${L.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${j.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${L.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${F.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${L.indicesGet("output_indices","i")};
          ${F.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${j.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${o[C]};
        }
        ${F.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${w.length}; i++) {
          let index = ${L.indicesGet("output_indices",`i + ${d.length} - 1`)};
          ${F.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${F.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${F.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${D?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${X.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${X.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${X.getByIndices("scale_indices")};
        ${R?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${R.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${R.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${D?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Fa(x)}(quantized_data - zero_point) * scale;
        ${L.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${i.cacheKey};${s.filter((Q,F)=>F!==1).map(Q=>Q.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:s.length},(Q,F)=>"rank")},getRunData:()=>({outputs:[{dims:w,dataType:x}],dispatchGroup:{x:Math.ceil(M/64)},programUniforms:_}),getShaderSource:v}},fC=(s,i)=>{let o=s.inputs;cm(o,i),s.compute(um(s.inputs,i))},pC=s=>YA({blockSize:s.blockSize,gatherAxis:s.gatherAxis,quantizeAxis:s.quantizeAxis})}),dm,gm,mC,hC,$6=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),dm=s=>{if(!s||s.length!==2)throw new Error("GatherElements requires 2 inputs.");if(s[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(s[0].dims.length!==s[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},gm=(s,i)=>{let o=s[0].dims,d=s[0].dataType,m=o.length,C=s[1].dims,b=s[1].dataType,w=Ye.normalizeAxis(i.axis,m),M=o[w],x=C.slice(0),D=Ye.size(x),_=st("input",d,m),v=st("indicesInput",b,C.length),Q=Xt("output",d,x.length),F=[{type:12,data:D},{type:6,data:M},{type:12,data:w}];return F.push(...$t(o,C,x)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:x,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(D/64)},programUniforms:F}),getShaderSource:j=>`
      ${j.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,v,Q)}
      ${j.mainStart()}
      ${j.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${Q.offsetToIndices("global_idx")};

      var idx = ${v.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${_.type.indices}(outputIndices);
      ${_.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${_.getByIndices("inputIndices")};

      ${Q.setByOffset("global_idx","value")};
  }`}},mC=s=>YA({axis:s.axis}),hC=(s,i)=>{let o=s.inputs;dm(o),s.compute(gm(s.inputs,i))}}),fm,pm,bC,CC,ew=Mt(()=>{"use strict";lA(),IA(),kA(),fm=s=>{if(!s)throw new Error("Input is missing");if(s.length<2||s.length>3)throw new Error("Invaid input number.");if(s.length===3&&s[2].dims.length>2)throw new Error("Invalid input shape of C");if(s[0].dataType!==s[1].dataType||s.length===3&&s[0].dataType!==s[2].dataType)throw new Error("Input types are mismatched")},pm=(s,i)=>{let o=s[0].dims.slice(),d=s[1].dims.slice(),[m,C,b]=mh.getShapeOfGemmResult(o,i.transA,d,i.transB,s.length===3?s[2].dims:void 0),w=[m,C];if(!w)throw new Error("Can't use gemm on the given tensors");let M=16,x=Math.ceil(C/M),D=Math.ceil(m/M),_=!0,v=Ye.size(w),Q=[{type:12,data:_?x:v},{type:12,data:m},{type:12,data:C},{type:12,data:b},{type:1,data:i.alpha},{type:1,data:i.beta}],F=["type","type"];s.length===3&&(Q.push(...$t(s[2].dims)),F.push("rank")),Q.push(...$t(w));let j=R=>{let L="";i.transA&&i.transB?L="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":i.transA&&!i.transB?L="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!i.transA&&i.transB?L="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!i.transA&&!i.transB&&(L="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let K=i.alpha===1?"":"value *= uniforms.alpha;",g=st("a",s[0].dataType,s[0].dims),k=st("b",s[1].dataType,s[1].dims),e=g.type.value,u=null,B=[g,k];s.length===3&&(u=st("c",s[2].dataType,s[2].dims.length),B.push(u));let q=Xt("output",s[0].dataType,w.length);B.push(q);let y=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${R.registerUniforms(y).declareVariables(...B)}

  ${R.mainStart()}
    ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${e}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${L}
    }

    ${K}
    ${u!=null?`let cOffset = ${u.broadcastedIndicesToOffset("vec2(m, n)",q)}; value += ${e}(uniforms.beta) * ${u.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},X=R=>{let L=st("a",s[0].dataType,s[0].dims),K=st("b",s[1].dataType,s[1].dims),g=null,k=[L,K];s.length===3&&(g=st("c",s[2].dataType,s[2].dims.length),k.push(g));let e=Xt("output",s[0].dataType,w.length);k.push(e);let u=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],B="",q="";i.transA&&i.transB?(q=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${L.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${K.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):i.transA&&!i.transB?(q=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${L.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${K.type.value}(0);
      }
      `,B="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!i.transA&&i.transB?(q=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${L.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${K.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!i.transA&&!i.transB&&(q=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${L.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${K.type.value}(0);
      }
      `,B="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let y=i.alpha===1?"":"value *= uniforms.alpha;";return`
  ${R.registerUniforms(u).declareVariables(...k)}
  var<workgroup> tile_a: array<array<${L.type.storage}, ${M}>, ${M}>;
  var<workgroup> tile_b: array<array<${K.type.storage}, ${M}>, ${M}>;
  ${R.mainStart([M,M,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${M};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${M};
    let num_tiles = (uniforms.K - 1) / ${M} + 1;
    var k_start = 0u;
    var value = ${e.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${q}
      k_start = k_start + ${M};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${M}; k++) {
        ${B}
      }
      workgroupBarrier();
    }

    ${y}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${g!=null?`let cOffset = ${g.broadcastedIndicesToOffset("vec2(m, n)",e)}; value += ${e.type.value}(uniforms.beta) * ${g.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return _?{name:"GemmShared",shaderCache:{hint:`${i.cacheKey}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:w,dataType:s[0].dataType}],dispatchGroup:{x:x*D},programUniforms:Q}),getShaderSource:X}:{name:"Gemm",shaderCache:{hint:`${i.cacheKey}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:w,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:Q}),getShaderSource:j}},bC=s=>{let i=s.transA,o=s.transB,d=s.alpha,m=s.beta;return{transA:i,transB:o,alpha:d,beta:m,cacheKey:`${s.transA};${s.transB};${s.alpha===1}`}},CC=(s,i)=>{fm(s.inputs),s.compute(pm(s.inputs,i))}}),to,ko,ki,Mi,mm,hm,bm,Cm,Im,wm,km,Mm,IC,wC,tw=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),[to,ko,ki,Mi]=[0,1,2,3],mm=s=>{if(s[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(s[0].dims.length!==s[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(s[0].dims.length-2!==s[1].dims[s[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${s[0].dims.length-2}`);if(s[0].dims[0]!==s[1].dims[0])throw new Error("grid batch size must match input batch size")},hm=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,bm=s=>`
  fn gs_bicubic_interpolate(p: mat4x4<${s}>, x: f32, y: f32) -> ${s} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${s}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,Cm=s=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${s.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Im=s=>`
  ${s.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,wm=(s,i,o)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${i} {
     var pixel = ${i}(0);
     var indices = vec4<u32>(0);
     indices[${to}] = batch;
     indices[${ko}] = channel;`+(()=>{switch(o.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${ki}] = u32(r);
            indices[${Mi}] = u32(c);
          } else {
            return ${i}(0);
          }
        `;case"border":return`
          indices[${ki}] = u32(clamp(r, 0, H - 1));
          indices[${Mi}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${ki}] = gs_reflect(r, border[1], border[3]);
          indices[${Mi}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${o.paddingMode} is not supported`)}})()+`
    return ${s.getByIndices("indices")};
  }
`,km=(s,i,o)=>(()=>{switch(o.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${to}], indices[${ko}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${to}], indices[${ko}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${to}], indices[${ko}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${to}], indices[${ko}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${to}], indices[${ko}], border);

          let dx2 = ${i}(f32(x2) - x);
          let dx1 = ${i}(x - f32(x1));
          let dy2 = ${i}(f32(y2) - y);
          let dy1 = ${i}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${i}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${to}], indices[${ko}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${o.mode} is not supported`)}})()+`${s.setByOffset("global_idx","result")}`,Mm=(s,i)=>{let o=st("x",s[0].dataType,s[0].dims.length),d=[s[1].dims[0],s[1].dims[1],s[1].dims[2]],m=st("grid",s[1].dataType,d.length,2),C=[s[0].dims[0],s[0].dims[1],s[1].dims[1],s[1].dims[2]];i.format==="NHWC"&&(C=[s[0].dims[0],s[1].dims[1],s[1].dims[2],s[0].dims[3]],[to,ko,ki,Mi]=[0,3,1,2]);let b=Xt("output",s[0].dataType,C.length),w=o.type.value,M=Ye.size(C),x=[{type:12,data:M},...$t(s[0].dims,d,C)],D=_=>`
  ${_.registerUniform("output_size","u32").declareVariables(o,m,b)}
  ${hm}
  ${bm(w)}
  ${Cm(i)}
  ${Im(i)}
  ${wm(o,w,i)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${ki}]);
      let W_in = i32(uniforms.x_shape[${Mi}]);

      ${i.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${b.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${to}], indices[${ki}], indices[${Mi}]);
      let nxy = ${m.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${km(b,w,i)}
  }`;return{name:"GridSample",shaderCache:{hint:`${i.cacheKey}`,inputDependencies:["type","type"]},getRunData:_=>{let v=Ye.size(C);return{outputs:[{dims:C,dataType:_[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:x}},getShaderSource:D}},IC=(s,i)=>{mm(s.inputs),s.compute(Mm(s.inputs,i))},wC=s=>YA({alignCorners:s.align_corners,mode:s.mode,paddingMode:s.padding_mode,format:s.format})}),ja,xm,kC,Dc,vm,Hn,MC,xC=Mt(()=>{"use strict";lA(),IA(),Kr(),E2(),y2(),kA(),qo(),ja=(s,i)=>s.length>i&&s[i].dims.length>0?s[i]:void 0,xm=(s,i)=>{let o=s[0],d=ja(s,1),m=ja(s,2),C=ja(s,3),b=ja(s,4),w=ja(s,5),M=ja(s,6),x=ja(s,7);if(o.dims.length!==3&&o.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let D=o.dims[0],_=o.dims[1],v=o.dims.length===3?o.dims[2]:i.numHeads*o.dims[4],Q=_,F=0,j=0,X=Math.floor(v/i.numHeads);if(M&&x&&Ye.size(M.dims)&&Ye.size(x.dims)){if(M.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(M.dims[0]!==D||M.dims[1]!==i.numHeads||M.dims[3]!==X)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(x.dims[0]!==D||x.dims[1]!==i.numHeads||x.dims[3]!==X)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(M.dims[2]!==x.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(x.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');F=M.dims[2],j=M.dims[2]}else if(M&&Ye.size(M.dims)||x&&Ye.size(x.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let R;if(d&&Ye.size(d.dims)>0){if(o.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(d.dims.length<3||d.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(o.dims[0]!==d.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(d.dims.length===3){if(d.dims[2]!==o.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');R=2,Q=d.dims[1]}else if(d.dims.length===5){if(d.dims[2]!==i.numHeads||d.dims[3]!==2||d.dims[4]!==X)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(m)throw new Error('Expect "value" be none when "key" has packed kv format.');R=5,Q=d.dims[1]}else{if(d.dims[1]!==i.numHeads||d.dims[3]!==X)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');R=0,Q=d.dims[2]}}else{if(o.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(o.dims[2]!==i.numHeads||o.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');R=3}if(C&&Ye.size(C.dims)>0){if(C.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(d&&d.dims.length===5&&d.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let L=F+Q,K=0;if(b&&Ye.size(b.dims)>0){K=8;let u=b.dims;throw u.length===1?u[0]===D?K=1:u[0]===3*D+2&&(K=3):u.length===2&&u[0]===D&&u[1]===L&&(K=5),K===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let g=!1,k=v;if(m&&Ye.size(m.dims)>0){if(m.dims.length!==3&&m.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(o.dims[0]!==m.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(m.dims.length===3){if(Q!==m.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');k=m.dims[2]}else{if(Q!==m.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');k=m.dims[1]*m.dims[3],g=!0}}let e=!1;if(b&&Ye.size(b.dims)>0)throw new Error("Key padding mask is not supported");if(w&&Ye.size(w.dims)>0){if(w.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(w.dims[0]!==D||w.dims[1]!==i.numHeads||w.dims[2]!==_||w.dims[3]!==L)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:D,sequenceLength:_,pastSequenceLength:F,kvSequenceLength:Q,totalSequenceLength:L,maxSequenceLength:j,inputHiddenSize:0,hiddenSize:v,vHiddenSize:k,headSize:X,vHeadSize:Math.floor(k/i.numHeads),numHeads:i.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:i.maskFilterValue,maskType:K,scale:i.scale,broadcastResPosBias:e,passPastInKv:g,qkvFormat:R}},kC=s=>YA({...s}),Dc=YA({perm:[0,2,1,3]}),vm=(s,i,o,d,m,C,b)=>{let w=[d,m,C],M=Ye.size(w),x=[{type:12,data:M},{type:12,data:b},{type:12,data:C}],D=_=>{let v=Xt("qkv_with_bias",i.dataType,w),Q=st("qkv",i.dataType,w),F=st("bias",o.dataType,w),j=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${_.registerUniforms(j).declareVariables(Q,F,v)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return s.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:w,dataType:i.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(M/64)},programUniforms:x}),getShaderSource:D},{inputs:[i,o],outputs:[-1]})[0]},Hn=(s,i,o,d,m,C,b,w)=>{let M=C;if(b&&Ye.size(b.dims)>0){if(d===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return M=vm(s,C,b,i,d,o*m,w),M=M.reshape([i,d,o,m]),o===1||d===1?M:s.compute(fs(M,Dc.perm),{inputs:[M],outputs:[-1]})[0]}else return C.dims.length===3&&(M=C.reshape([i,d,o,m])),o===1||d===1?M:s.compute(fs(M,Dc.perm),{inputs:[M],outputs:[-1]})[0]},MC=(s,i)=>{let o=xm(s.inputs,i),d=s.inputs[0],m=ja(s.inputs,1),C=ja(s.inputs,2),b=ja(s.inputs,3),w=ja(s.inputs,4),M=ja(s.inputs,5),x=ja(s.inputs,6),D=ja(s.inputs,7);if(d.dims.length===5)throw new Error("Packed QKV is not implemented");if(m?.dims.length===5)throw new Error("Packed KV is not implemented");let _=m&&C&&m.dims.length===4&&C.dims.length===4,v=Hn(s,o.batchSize,o.numHeads,o.sequenceLength,o.headSize,d,b,0);if(_)return Zn(s,v,m,C,w,void 0,x,D,M,o);if(!m||!C)throw new Error("key and value must be provided");let Q=Hn(s,o.batchSize,o.numHeads,o.kvSequenceLength,o.headSize,m,b,o.hiddenSize),F=Hn(s,o.batchSize,o.numHeads,o.kvSequenceLength,o.vHeadSize,C,b,2*o.hiddenSize);Zn(s,v,Q,F,w,void 0,x,D,M,o)}}),Em,_m,Bm,ym,c2,vC,EC,_C=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Em=s=>{if(!s||s.length<1)throw new Error("too few inputs")},_m=(s,i)=>{let o=[],d=i.numOutputs;return s[1].dims[0]>0&&(s[1].getBigInt64Array().forEach(m=>o.push(Number(m))),d=o.length),YA({numOutputs:d,axis:i.axis,splitSizes:o})},Bm=s=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${s}u; i += 1u ) {
    if (index < ${Jt("uniforms.size_in_split_axis","i",s)}) {
        return i;
    }
    }
    return ${s}u;
}`,ym=s=>{let i=s.length,o=[];for(let d=0;d<i;++d){let m=s[d].setByIndices("indices","input[global_idx]");i===1?o.push(m):d===0?o.push(`if (output_number == ${d}u) { ${m} }`):d===i-1?o.push(`else { ${m} }`):o.push(`else if (output_number == ${d}) { ${m} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${s[0].type.indices}, global_idx: u32) {
        ${o.join(`
`)}
      }`},c2=(s,i)=>{let o=s[0].dims,d=Ye.size(o),m=s[0].dataType,C=Ye.normalizeAxis(i.axis,o.length),b=new Array(i.numOutputs),w=st("input",m,o.length),M=new Array(i.numOutputs),x=[],D=[],_=0,v=[{type:12,data:d}];for(let F=0;F<i.numOutputs;F++){_+=i.splitSizes[F],M[F]=_;let j=o.slice();j[C]=i.splitSizes[F],D.push(j),b[F]=Xt(`output${F}`,m,j.length),x.push({dims:D[F],dataType:s[0].dataType})}v.push({type:12,data:M},...$t(o,...D));let Q=F=>`
  ${F.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",M.length).declareVariables(w,...b)}
  ${Bm(M.length)}
  ${ym(b)}

  ${F.mainStart()}
    ${F.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${w.offsetToIndices("global_idx")};
    var index = ${w.indicesGet("indices",C)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Jt("uniforms.size_in_split_axis","output_number - 1u",M.length)};
      ${w.indicesSet("indices",C,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:i.cacheKey,inputDependencies:["rank"]},getShaderSource:Q,getRunData:()=>({outputs:x,dispatchGroup:{x:Math.ceil(d/64)},programUniforms:v})}},vC=(s,i)=>{Em(s.inputs);let o=s.inputs.length===1?i:_m(s.inputs,i);s.compute(c2(s.inputs,o),{inputs:[0]})},EC=s=>{let i=s.axis,o=s.splitSizes,d=s.numOutputs<0?o.length:s.numOutputs;if(d!==o.length)throw new Error("numOutputs and splitSizes lengh must be equal");return YA({axis:i,numOutputs:d,splitSizes:o})}}),Dm,H0,BC,yC=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Dm=(s,i)=>{let[o,d,m,C]=s,{numHeads:b,rotaryEmbeddingDim:w}=i;if(o.dims.length!==3&&o.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${o.dims.length}`);if(!Ye.areEqual(d.dims,[])&&!Ye.areEqual(d.dims,[1])&&d.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${d.dims.length}`);if(m.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${m.dims.length}`);if(C.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${C.dims.length}`);if(!Ye.areEqual(m.dims,C.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(w>0&&b===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let M=o.dims[0],x=o.dims[o.dims.length-2],D=m.dims[0],_=Ye.sizeFromDimension(o.dims,1)/x,v=w===0?m.dims[1]*2:_/b;if(w>v)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(d.dims.length===2){if(M!==d.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${d.dims[0]}`);if(x!==d.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${d.dims[1]}`)}if(v/2!==m.dims[1]&&w/2!==m.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${m.dims[1]}`);if(x>D)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported")},H0=(s,i)=>{let{interleaved:o,numHeads:d,rotaryEmbeddingDim:m,scale:C}=i,b=s[0].dims[0],w=Ye.sizeFromDimension(s[0].dims,1),M=s[0].dims[s[0].dims.length-2],x=w/M,D=s[2].dims[1],_=m===0?D*2:x/d,v=new Array(b,M,x/_,_-D),Q=Ye.computeStrides(v),F=[{type:1,data:C},{type:12,data:v},{type:12,data:Q},...s[0].dims.length===3?new Array({type:12,data:[w,x,_,1]}):[],...s[0].dims.length===4?new Array({type:12,data:[w,_,M*_,1]}):[],...$t(s[0].dims,s[1].dims,s[2].dims,s[3].dims,s[0].dims)],j=X=>{let R=st("input",s[0].dataType,s[0].dims.length),L=st("position_ids",s[1].dataType,s[1].dims.length),K=st("cos_cache",s[2].dataType,s[2].dims.length),g=st("sin_cache",s[3].dataType,s[3].dims.length),k=Xt("output",s[0].dataType,s[0].dims.length);return X.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:v.length},{name:"global_strides",type:"u32",length:Q.length},{name:"input_output_strides",type:"u32",length:Q.length}]),`
        ${X.declareVariables(R,L,K,g,k)}

        ${X.mainStart(on)}
          let half_rotary_emb_dim = uniforms.${K.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${X.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${L.broadcastedIndicesToOffset("bsnh.xy",Xt("",L.type.tensor,2))};
            let position_id =
                u32(${L.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${o});
            let j = i + select(half_rotary_emb_dim, 1, ${o});
            let re = ${R.getByOffset("i")} * ${K.get("position_id","bsnh[3]")} -
                ${R.getByOffset("j")} * ${g.get("position_id","bsnh[3]")};
            ${k.setByOffset("i","re")}
            let im = ${R.getByOffset("i")} * ${g.get("position_id","bsnh[3]")} +
                ${R.getByOffset("j")} * ${K.get("position_id","bsnh[3]")};
            ${k.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${k.setByOffset("k",R.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:YA({interleaved:o}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:j,getRunData:()=>({outputs:[{dims:s[0].dims,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(Ye.size(v)/on)},programUniforms:F})}},BC=(s,i)=>{Dm(s.inputs,i),s.compute(H0(s.inputs,i))}}),Tm,Pm,Tc,Gm,DC,Aw=Mt(()=>{"use strict";Kr(),lA(),y2(),xC(),_C(),qo(),yC(),kA(),Tm=(s,i)=>{if(i.doRotary&&s.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let o=s[0],d=s[1],m=s[2],C=s[3],b=s[4];if(i.doRotary!==0&&s.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(i.localWindowSize!==-1)throw new Error("Local attention is not supported");if(i.softcap!==0)throw new Error("Softcap is not supported");if(i.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(i.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(o.dims.length!==3&&o.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let w=!1,M=o.dims[0],x=o.dims[1],D=o.dims.length===3?w?o.dims[2]/3:o.dims[2]:i.numHeads*o.dims[4],_=x,v=0,Q=!d||d.dims.length===0,F=Math.floor(Q?D/(i.numHeads+2*i.kvNumHeads):D/i.numHeads);Q&&(D=F*i.numHeads);let j=C&&C.dims.length!==0,X=b&&b.dims.length!==0;if(j&&C.dims.length===4&&C.dims[0]===M&&C.dims[1]!==i.kvNumHeads&&C.dims[2]===i.kvNumHeads&&C.dims[3]===F)throw new Error("BSNH pastKey/pastValue is not supported");if(j&&X){if(C.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(b.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=C.dims[2]}else if(j||X)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let R=1;if(d&&d.dims.length>0){if(o.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(d.dims.length<3||d.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(o.dims[0]!==d.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(d.dims.length===3){if(o.dims[2]%d.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');_=d.dims[1]}else if(d.dims.length===5){if(d.dims[2]!==i.numHeads||d.dims[3]!==2||d.dims[4]!==F)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(m)throw new Error('Expect "value" be none when "key" has packed kv format.');_=d.dims[1]}else{if(d.dims[1]!==i.numHeads||d.dims[3]!==F)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');_=d.dims[2]}}else{if(o.dims.length!==3&&o.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(o.dims.length===5&&(o.dims[2]!==i.numHeads||o.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');R=3}let L=0,K=!1,g=i.kvNumHeads?F*i.kvNumHeads:D;if(m&&m.dims.length>0){if(m.dims.length!==3&&m.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(o.dims[0]!==m.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(m.dims.length===3){if(_!==m.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');g=m.dims[2]}else{if(_!==m.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');g=m.dims[1]*m.dims[3],K=!0}}let k=s.length>4?s[5]:void 0;if(k&&k.dims.length!==1&&k.dims[0]!==M)throw new Error('Input "seqlens" is expected to have 1 dimension and the same dim 0 as batch_size');return{batchSize:M,sequenceLength:x,pastSequenceLength:v,kvSequenceLength:_,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:D,vHiddenSize:g,headSize:F,vHeadSize:Math.floor(g/i.kvNumHeads),numHeads:i.numHeads,kvNumHeads:i.kvNumHeads,nReps:i.numHeads/i.kvNumHeads,pastPresentShareBuffer:!1,maskType:L,scale:i.scale,broadcastResPosBias:!1,passPastInKv:K,qkvFormat:R}},Pm=YA({perm:[0,2,1,3]}),Tc=(s,i,o)=>{let d=i,m=o.kvNumHeads;return i.dims.length===3&&o.kvSequenceLength!==0&&(d=i.reshape([o.batchSize,o.kvSequenceLength,m,o.headSize]),d=s.compute(fs(d,Pm.perm),{inputs:[d],outputs:[-1]})[0]),d},Gm=(s,i,o,d)=>{let m=7,C=["type","type"],b=[s*i],w=s*i,M=[{type:12,data:w},{type:12,data:i},{type:12,data:s}],x=D=>{let _=st("seq_lens",o.dataType,o.dims),v=st("total_seq_lens",d.dataType,d.dims),Q=Xt("pos_ids",m,b),F=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${D.registerUniforms(F).declareVariables(_,v,Q)}
  ${D.mainStart()}
    ${D.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${v.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${_.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${Q.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${Q.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${Q.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${s};${i}`,inputDependencies:C},getRunData:()=>({outputs:[{dims:b,dataType:m}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:M}),getShaderSource:x}},DC=(s,i)=>{let o=Tm(s.inputs,i);if(s.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(s.inputs[1]?.dims.length===5)throw new Error("Packed KV is not implemented");let d=s.inputs[0],m=s.inputs[1]&&s.inputs[1].dims.length>0?s.inputs[1]:void 0,C=s.inputs[2]&&s.inputs[2].dims.length>0?s.inputs[2]:void 0,b=s.inputs[3]&&s.inputs[3].dims.length!==0?s.inputs[3]:void 0,w=s.inputs[4]&&s.inputs[4].dims.length!==0?s.inputs[4]:void 0,M=s.inputs.length>4?s.inputs[5]:void 0,x=s.inputs.length>5?s.inputs[6]:void 0,D=o.kvNumHeads?o.kvNumHeads:o.numHeads,_=YA({axis:2,numOutputs:3,splitSizes:[o.numHeads*o.headSize,D*o.headSize,D*o.headSize]}),[v,Q,F]=!m&&!C?s.compute(c2([d],_),{inputs:[d],outputs:[-1,-1,-1]}):[d,m,C],j,X;if(i.doRotary){let g=s.compute(Gm(o.batchSize,o.sequenceLength,M,x),{inputs:[M,x],outputs:[-1]})[0],k=s.inputs[7],e=s.inputs[8],u=YA({interleaved:i.rotaryInterleaved!==0,numHeads:o.numHeads,rotaryEmbeddingDim:0,scale:i.scale}),B=[v,g,k,e],q=[-1];j=s.compute(H0(B,u),{inputs:B,outputs:q})[0],B.splice(0,1,Q);let y=YA({interleaved:i.rotaryInterleaved!==0,numHeads:o.kvNumHeads,rotaryEmbeddingDim:0,scale:i.scale});X=s.compute(H0(B,y),{inputs:B,outputs:q})[0]}let R=Hn(s,o.batchSize,o.numHeads,o.sequenceLength,o.headSize,i.doRotary?j:v,void 0,0),L=Tc(s,i.doRotary?X:Q,o),K=Tc(s,F,o);Zn(s,R,L,K,void 0,void 0,b,w,void 0,o,M,x)}}),Pc,Fm,Qm,TC,rw=Mt(()=>{"use strict";lA(),IA(),qo(),kA(),Pc=(s,i,o,d,m,C,b,w)=>{let M=zr(C),x=M===1?"f32":`vec${M}f`,D=M===1?"vec2f":`mat2x${M}f`,_=m*b,v=64;_===1&&(v=256);let Q=[m,b,C/M],F=[m,b,2],j=["rank","type","type"],X=[];X.push(...$t(Q,F));let R=L=>{let K=st("x",i.dataType,3,M),g=st("scale",o.dataType,o.dims),k=st("bias",d.dataType,d.dims),e=Xt("output",1,3,2),u=[K,g,k,e];return`
  var<workgroup> workgroup_shared : array<${D}, ${v}>;
  const workgroup_size = ${v}u;
  ${L.declareVariables(...u)}
  ${L.mainStart(v)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${x}(0);
    var squared_sum = ${x}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${x}(${K.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${D}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Jo("workgroup_shared[0][0]",M)} / f32(hight * ${M});
      let squared_sum_final = ${Jo("workgroup_shared[0][1]",M)} / f32(hight * ${M});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${w}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return s.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${M};${w};${v}`,inputDependencies:j},getRunData:()=>({outputs:[{dims:F,dataType:1}],dispatchGroup:{x:_},programUniforms:X}),getShaderSource:R},{inputs:[i,o,d],outputs:[-1]})[0]},Fm=(s,i,o)=>{let d=i[0].dims,m=d,C=2,b=d[0],w=d[1],M=Ye.sizeFromDimension(d,C),x=zr(M),D=Ye.size(m)/x,_=Pc(s,i[0],i[1],i[2],b,M,w,o.epsilon),v=[b,w,M/x],Q=[b,w],F=["type","none"],j=X=>{let R=st("x",i[0].dataType,v.length,x),L=st("scale_shift",1,Q.length,2),K=Xt("output",i[0].dataType,v.length,x),g=[R,L,K];return`
  ${X.registerUniform("output_size","u32").declareVariables(...g)}
  ${X.mainStart()}
  ${X.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${K.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${L.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${R.getByOffset("global_idx")} * ${K.type.value}(scale_shift.x) + ${K.type.value}(scale_shift.y);
      ${K.setByOffset("global_idx","value")};
  }`};s.compute({name:"InstanceNormalization",shaderCache:{hint:`${x}`,inputDependencies:F},getRunData:()=>({outputs:[{dims:m,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(D/64)},programUniforms:[{type:12,data:D},...$t(v,Q,v)]}),getShaderSource:j},{inputs:[i[0],_]})},Qm=(s,i,o)=>{let d=i[0].dims,m=d,C=d[0],b=d[d.length-1],w=Ye.sizeFromDimension(d,1)/b,M=zr(b),x=Ye.size(m)/M,D=[{type:12,data:w},{type:12,data:Math.floor(b/M)}],_=["type","type"],v=!1,Q=[0,d.length-1];for(let R=0;R<d.length-2;R++)v=v||d[R+1]!==1,Q.push(R+1);v=v&&d[d.length-1]!==1;let F=v?s.compute(fs(s.inputs[0],Q),{inputs:[s.inputs[0]],outputs:[-1]})[0]:s.inputs[0].reshape(Array.from({length:d.length},(R,L)=>d[Q[L]])),j=Pc(s,F,i[1],i[2],C,w,b,o.epsilon),X=R=>{let L=ha(i[0].dataType),K=M===1?"vec2f":`mat${M}x2f`,g=u=>{let B=u===0?"x":"y",q=M===1?"f32":`vec${M}f`;switch(M){case 1:return`${L}(${q}(scale.${B}))`;case 2:return`vec2<${L}>(${q}(scale[0].${B}, scale[1].${B}))`;case 4:return`vec4<${L}>(${q}(scale[0].${B}, scale[1].${B}, scale[2].${B}, scale[3].${B}))`;default:throw new Error(`Not supported compoents ${M}`)}},k=st("input",i[0].dataType,i[0].dims,M),e=Xt("output",i[0].dataType,m,M);return`
  @group(0) @binding(0) var<storage, read> input : array<${k.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${K}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${e.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${R.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${g(0)}, ${g(1)});
  }`};s.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${M}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:m,dataType:i[0].dataType}],dispatchGroup:{x:Math.ceil(x/64)},programUniforms:D}),getShaderSource:X},{inputs:[i[0],j]})},TC=(s,i)=>{i.format==="NHWC"?Qm(s,s.inputs,i):Fm(s,s.inputs,i)}}),Sm,Om,PC,aw=Mt(()=>{"use strict";lA(),IA(),kA(),Sm=s=>{if(!s||s.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Om=(s,i,o)=>{let d=i.simplified,m=s[0].dims,C=s[1],b=!d&&s[2],w=m,M=Ye.normalizeAxis(i.axis,m.length),x=Ye.sizeToDimension(m,M),D=Ye.sizeFromDimension(m,M),_=Ye.size(C.dims),v=b?Ye.size(b.dims):0;if(_!==D||b&&v!==D)throw new Error(`Size of X.shape()[axis:] == ${D}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${_} and bias size of ${v}`);let Q=[];for(let k=0;k<m.length;++k)k<M?Q.push(m[k]):Q.push(1);let F=zr(D),j=["type","type"],X=[{type:12,data:x},{type:1,data:D},{type:12,data:Math.floor(D/F)},{type:1,data:i.epsilon}];b&&j.push("type");let R=o>1,L=o>2,K=k=>{let e=ha(s[0].dataType),u=[st("x",s[0].dataType,s[0].dims,F),st("scale",C.dataType,C.dims,F)];b&&u.push(st("bias",b.dataType,b.dims,F)),u.push(Xt("output",s[0].dataType,w,F)),R&&u.push(Xt("mean_data_output",1,Q)),L&&u.push(Xt("inv_std_output",1,Q));let B=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${k.registerUniforms(B).declareVariables(...u)}
  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${t2("f32",F)};
    var mean_square_vector = ${t2("f32",F)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${an(e,F,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Jo("mean_vector",F)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Jo("mean_square_vector",F)} / uniforms.norm_size ${d?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${an(e,F,"x[j + offset]")};
      let f32scale = ${an(e,F,"scale[j]")};
      output[j + offset] = ${u[0].type.value}((f32input ${d?"":"- mean"}) * inv_std_dev * f32scale
        ${b?`+ ${an(e,F,"bias[j]")}`:""}
      );
    }

    ${R?"mean_data_output[global_idx] = mean":""};
    ${L?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},g=[{dims:w,dataType:s[0].dataType}];return R&&g.push({dims:Q,dataType:1}),L&&g.push({dims:Q,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${F};${o};${d}`,inputDependencies:j},getRunData:()=>({outputs:g,dispatchGroup:{x:Math.ceil(x/64)},programUniforms:X}),getShaderSource:K}},PC=(s,i)=>{Sm(s.inputs),s.compute(Om(s.inputs,i,s.outputCount))}}),Lm,GC,sw=Mt(()=>{"use strict";IA(),F2(),Q2(),Lm=s=>{if(!s||s.length!==2)throw new Error("MatMul requires 2 inputs.");if(s[0].dims[s[0].dims.length-1]!==s[1].dims[s[1].dims.length-2])throw new Error("shared dimension does not match.")},GC=s=>{Lm(s.inputs);let i=sn.calcShape(s.inputs[0].dims,s.inputs[1].dims,!0);if(!i)throw new Error("Can't use matmul on the given tensors");let o=i[i.length-1],d=s.inputs[0].dims[s.inputs[0].dims.length-1];if(o<8&&d<8)s.compute(G2(s.inputs,{activation:""},i));else{let m=i[i.length-2],C=Ye.size(s.inputs[0].dims.slice(0,-2)),b=Ye.size(s.inputs[1].dims.slice(0,-2));if(C!==1&&m===1&&b===1){let w=s.inputs[0].reshape([1,C,d]),M=s.inputs[1].reshape([1,d,o]),x=[1,C,o],D=[w,M];s.compute(Y0(D,{activation:""},i,x),{inputs:D})}else s.compute(Y0(s.inputs,{activation:""},i))}}}),Nm,zm,Rm,FC,QC,ow=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),Nm=(s,i)=>{if(s.length<3||s.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let o=s[0],d=o.dims.length;if(o.dims[d-1]!==i.k)throw new Error("The last dim of input shape does not match the k value");let m=Math.floor((i.k+i.blockSize-1)/i.blockSize),C=i.blockSize/8*i.bits,b=s[1];if(!Ye.areEqual(b.dims,[i.n,m,C]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let w=s[2].dims;if(Ye.size(w)!==i.n*m)throw new Error("scales input size error.");if(s.length===4){let M=s[3].dims,x=i.bits>4?i.n*m:i.n*Math.floor((m+1)/2);if(Ye.size(M)!==x)throw new Error("zeroPoints input size error.")}},zm=(s,i)=>{let o=s[0].dims,d=o.length,m=o[d-2],C=i.k,b=i.n,w=o.slice(0,d-2),M=Ye.size(w),x=s[1].dims[2]/4,D=s[0].dataType,_=zr(i.k),v=zr(x),Q=zr(b),F=w.concat([m,b]),j=m>1&&b/Q%2===0?2:1,X=Ye.size(F)/Q/j,R=64,L=[],K=[M,m,C/_],g=Ye.convertShape(s[1].dims).slice();g.splice(-1,1,x/v),L.push(...$t(K)),L.push(...$t(g)),L.push(...$t(s[2].dims)),s.length===4&&L.push(...$t(Ye.convertShape(s[3].dims)));let k=[M,m,b/Q];L.push(...$t(k));let e=u=>{let B=K.length,q=st("a",s[0].dataType,B,_),y=st("b",12,g.length,v),S=st("scales",s[2].dataType,s[2].dims.length),ge=[q,y,S],Ae=s.length===4?st("zero_points",12,s[3].dims.length):void 0;Ae&&ge.push(Ae);let me=k.length,Me=Xt("output",s[0].dataType,me,Q),Ie=ha(s[0].dataType),_e=(()=>{switch(_){case 1:return`array<${Ie}, 8>`;case 2:return`mat4x2<${Ie}>`;case 4:return`mat2x4<${Ie}>`;default:throw new Error(`${_}-component is not supported.`)}})(),ye=()=>{let xe=`
          // reuse a data
            var input_offset = ${q.indicesToOffset(`${q.type.indices}(batch, row, word_offset)`)};
            var a_data: ${_e};
            for (var j: u32 = 0; j < ${8/_}; j++) {
              a_data[j] = ${q.getByOffset("input_offset")};
              input_offset++;
            }
          `;for(let Ce=0;Ce<Q*j;Ce++)xe+=`
            b_value = ${v===1?`b${Ce}_data`:`b${Ce}_data[i]`};
            b_value_lower = unpack4xU8(b_value & b_mask);
            b_value_upper = unpack4xU8((b_value >> 4) & b_mask);
            b_quantized_values = ${_e}(${Array.from({length:4},(ie,ae)=>`${Ie}(b_value_lower[${ae}]), ${Ie}(b_value_upper[${ae}])`).join(", ")});
            b_dequantized_values = ${_===1?`${_e}(${Array.from({length:8},(ie,ae)=>`(b_quantized_values[${ae}] - ${Ae?`zero_point${Ce}`:"zero_point"}) * scale${Ce}`).join(", ")});`:`(b_quantized_values - ${_e}(${Array(8).fill(`${Ae?`zero_point${Ce}`:"zero_point"}`).join(",")})) * scale${Ce};`};
            workgroup_shared[local_id.x * ${j} + ${Math.floor(Ce/Q)}]${Q>1?`[${Ce%Q}]`:""} += ${Array.from({length:8/_},(ie,ae)=>`${_===1?`a_data[${ae}] * b_dequantized_values[${ae}]`:`dot(a_data[${ae}], b_dequantized_values[${ae}])`}`).join(" + ")};
          `;return xe},Ge=()=>{let xe=`
            var col_index = col * ${Q};
            ${Ae?`
            let zero_point_bytes_per_col = (nBlocksPerCol + 1) / 2;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Ie}(8);`}
            `;for(let Ce=0;Ce<Q*j;Ce++)xe+=`
            let scale${Ce} = ${S.getByOffset("col_index * nBlocksPerCol + block")};
            ${Ae?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block >> 0x1u);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            zero_point_word = ${Ae.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${Ce} = ${Ie}((zero_point_word) & 0xFu);`:""}
            col_index += 1;`;return xe},qe=()=>{let xe=`col_index = col * ${Q};`;for(let Ce=0;Ce<Q*j;Ce++)xe+=`
            let b${Ce}_data = ${y.getByIndices(`${y.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return xe+=`
            var b_value: u32;
            let b_mask: u32 = 0x0F0F0F0Fu;
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${_e};
            var b_dequantized_values: ${_e};`,xe};return`
        var<workgroup> workgroup_shared: array<${Me.type.value}, ${j*R}>;
        ${u.declareVariables(...ge,Me)}
        ${u.mainStart([R,1,1])}
          let output_indices = ${Me.offsetToIndices(`(global_idx / ${R}) * ${j}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${R}) {
            //process one block
            var word_offset: u32 = block * ${i.blockSize/_};
            ${Ge()}
            for (var word: u32 = 0; word < ${x}; word += ${v}) {
              ${qe()}
              for (var i: u32 = 0; i < ${v}; i++) {
                ${ye()}
                word_offset += ${8/_};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${j}) {
            var output_value: ${Me.type.value} = ${Me.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${R}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${j};
            }
            ${Me.setByIndices(`${Me.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${i.blockSize};${i.bits};${_};${v};${Q};${j};${R}`,inputDependencies:Array(s.length).fill("rank")},getRunData:()=>({outputs:[{dims:F,dataType:D}],dispatchGroup:{x:X},programUniforms:L}),getShaderSource:e}},Rm=(s,i)=>{let o=s[0].dims,d=o.length,m=o[d-2],C=i.k,b=i.n,w=o.slice(0,d-2),M=Ye.size(w),x=s[1].dims[2]/4,D=s[0].dataType,_=zr(i.k),v=zr(x),Q=w.concat([m,b]),F=128,j=b%8===0?8:b%4===0?4:1,X=F/j,R=X*v*8,L=R/_,K=R/i.blockSize,g=Ye.size(Q)/j,k=[],e=[M,m,C/_],u=Ye.convertShape(s[1].dims).slice();u.splice(-1,1,x/v),k.push(...$t(e)),k.push(...$t(u)),k.push(...$t(s[2].dims)),s.length===4&&k.push(...$t(Ye.convertShape(s[3].dims)));let B=[M,m,b];k.push(...$t(B));let q=y=>{let S=e.length,ge=st("a",s[0].dataType,S,_),Ae=st("b",12,u.length,v),me=st("scales",s[2].dataType,s[2].dims.length),Me=[ge,Ae,me],Ie=s.length===4?st("zero_points",12,s[3].dims.length):void 0;Ie&&Me.push(Ie);let _e=B.length,ye=Xt("output",s[0].dataType,_e),Ge=ha(s[0].dataType),qe=()=>{switch(_){case 1:return`
          let a_data0 = vec4<${Ge}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${Ge}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${Ge}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${Ge}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${_}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${ge.type.value}, ${L}>;
        var<workgroup> inter_results: array<array<${ye.type.value}, ${X}>, ${j}>;
        ${y.declareVariables(...Me,ye)}
        ${y.mainStart([X,j,1])}
          let output_indices = ${ye.offsetToIndices(`workgroup_index * ${j}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${K} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${L};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${L}; a_offset += ${F})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${ge.getByIndices(`${ge.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${ge.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${K} + local_id.x;
            ${Ie?`
            let zero_point_bytes_per_col = (n_blocks_per_col + 1) / 2;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block >> 0x1u);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_nibble_offset: u32 = block & 0x1u;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_nibble_offset << 2);
            let zero_point_word = ${Ie.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${Ge}((zero_point_word) & 0xFu);`:`
            // The default zero point is 8 for unsigned 4-bit quantization.
            let zero_point = ${Ge}(8);`}
            let scale = ${me.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${Ae.getByIndices(`${Ae.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${i.blockSize/_};
            for (var i: u32 = 0; i < ${v}; i++) {
              ${qe()}
              let b_value = ${v===1?"b_data":"b_data[i]"};
              let b_value_lower = unpack4xU8(b_value & 0x0F0F0F0Fu);
              let b_value_upper = unpack4xU8((b_value >> 4) & 0x0F0F0F0Fu);
              let b_quantized_values = mat2x4<${Ge}>(${Array.from({length:4},(xe,Ce)=>`${Ge}(b_value_lower[${Ce}]), ${Ge}(b_value_upper[${Ce}])`).join(", ")});
              let b_dequantized_values = (b_quantized_values - mat2x4<${Ge}>(${Array(8).fill("zero_point").join(",")})) * scale;
              inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(xe,Ce)=>`${`dot(a_data${Ce}, b_dequantized_values[${Ce}])`}`).join(" + ")};
              word_offset += ${8/_};
            }
            workgroupBarrier();
          }

          if (local_idx < ${j}) {
            var output_value: ${ye.type.value} = ${ye.type.value}(0);
            for (var b = 0u; b < ${X}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ye.setByIndices(`${ye.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${i.blockSize};${_};${v};${X};${j}`,inputDependencies:Array(s.length).fill("rank")},getRunData:()=>({outputs:[{dims:Q,dataType:D}],dispatchGroup:{x:g},programUniforms:k}),getShaderSource:q}},FC=(s,i)=>{Nm(s.inputs,i),i.blockSize===32&&s.adapterInfo.isVendor("intel")&&s.adapterInfo.isArchitecture("gen-12lp")?s.compute(Rm(s.inputs,i)):s.compute(zm(s.inputs,i))},QC=s=>YA(s)}),jm,Wm,Vm,Ym,Hm,Um,Km,Xm,SC,iw=Mt(()=>{"use strict";lA(),IA(),kA(),jm=s=>{if(!s||s.length<1)throw new Error("Too few inputs");if(s[0].dataType!==1&&s[0].dataType!==10)throw new Error("Input type must be float or float16.");if(s.length>=2){let i=s[0].dims.length*2===s[1].dims[0];if(s.length===4&&(i=s[3].dims[0]*2===s[1].dims[0]),!i)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},Wm=(s,i,o)=>{let d="";for(let m=i-1;m>=0;--m)d+=`
            k = i32(${s.indicesGet("indices",m)}) - ${Jt("uniforms.pads",m,o)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Jt("uniforms.x_shape",m,i)})) {
              break;
            }
            offset += k * i32(${Jt("uniforms.x_strides",m,i)});
        `;return`
          value = ${s.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${d}
            value = x[offset];
          }
      `},Vm=(s,i,o)=>{let d="";for(let m=i-1;m>=0;--m)d+=`
                k = i32(${s.indicesGet("indices",m)}) - ${Jt("uniforms.pads",m,o)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Jt("uniforms.x_shape",m,i)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Jt("uniforms.x_shape",m,i)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Jt("uniforms.x_strides",m,i)});
            `;return`
              var offset = 0;
              var k = 0;
              ${d}
              value = x[offset];
          `},Ym=(s,i,o)=>{let d="";for(let m=i-1;m>=0;--m)d+=`
                k = i32(${s.indicesGet("indices",m)}) - ${Jt("uniforms.pads",m,o)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Jt("uniforms.x_shape",m,i)})) {
                  k = i32(${Jt("uniforms.x_shape",m,i)}) - 1;
                }
                offset += k * i32(${Jt("uniforms.x_strides",m,i)});
            `;return`
              var offset = 0;
              var k = 0;
              ${d}
              value = x[offset];
          `},Hm=(s,i,o)=>{let d="";for(let m=i-1;m>=0;--m)d+=`
                k = i32(${s.indicesGet("indices",m)}) - ${Jt("uniforms.pads",m,o)};
                if (k < 0)  {
                  k += i32(${Jt("uniforms.x_shape",m,i)}]);
                }
                if (k >= i32(${Jt("uniforms.x_shape",m,i)})) {
                  k -= i32(${Jt("uniforms.x_shape",m,i)});
                }
                offset += k * i32(${Jt("uniforms.x_strides",m,i)});
            `;return`
              var offset = 0;
              var k = 0;
              ${d}
              value = x[offset];
          `},Um=(s,i,o)=>{switch(o.mode){case 0:return Wm(s,i,o.pads.length);case 1:return Vm(s,i,o.pads.length);case 2:return Ym(s,i,o.pads.length);case 3:return Hm(s,i,o.pads.length);default:throw new Error("Invalid mode")}},Km=(s,i)=>{let o=Ye.padShape(s[0].dims.slice(),i.pads),d=s[0].dims,m=Ye.size(o),C=[{type:12,data:m},{type:6,data:i.pads}],b=s.length>=3&&s[2].data;i.mode===0&&C.push({type:b?s[2].dataType:1,data:i.value}),C.push(...$t(s[0].dims,o));let w=["rank"],M=x=>{let D=Xt("output",s[0].dataType,o.length),_=st("x",s[0].dataType,d.length),v=_.type.value,Q=Um(D,d.length,i),F=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:i.pads.length}];return i.mode===0&&F.push({name:"constant_value",type:b?v:"f32"}),`
            ${x.registerUniforms(F).declareVariables(_,D)}
            ${x.mainStart()}
            ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${D.offsetToIndices("global_idx")};

            var value = ${v}(0);
            ${Q}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${i.mode}${b}`,inputDependencies:w},getRunData:()=>({outputs:[{dims:o,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(Ye.size(o)/64)},programUniforms:C}),getShaderSource:M}},Xm=(s,i)=>{if(s.length>1){let o=s[1].getBigInt64Array(),d=s.length>=3&&s[2].data?s[2].dataType===10?s[2].getUint16Array()[0]:s[2].getFloat32Array()[0]:0,m=s[0].dims.length,C=new Int32Array(2*m).fill(0);if(s.length>=4){let w=s[3].getBigInt64Array();for(let M=0;M<w.length;M++)C[Number(w[M])]=Number(o[M]),C[Number(w[M])+m]=Number(o[M+w.length])}else o.forEach((w,M)=>C[Number(M)]=Number(w));let b=[];return C.forEach(w=>b.push(w)),{mode:i.mode,value:d,pads:b}}else return i},SC=(s,i)=>{jm(s.inputs);let o=Xm(s.inputs,i);s.compute(Km(s.inputs,o),{inputs:[0]})}}),Nn,Gc,Fc,Qc,Sc,Zm,Jm,Oc,Lc,OC,LC,Nc,NC,zC,zc,RC,jC,WC,VC,nw=Mt(()=>{"use strict";Ws(),lA(),IA(),kA(),Nn=s=>{if(kr.webgpu.validateInputContent&&(!s||s.length!==1))throw new Error("Pool ops requires 1 input.")},Gc=(s,i,o)=>{let d=i.format==="NHWC",m=s.dims.slice();d&&m.splice(1,0,m.pop());let C=Object.hasOwnProperty.call(i,"dilations"),b=i.kernelShape.slice(),w=i.strides.slice(),M=C?i.dilations.slice():[],x=i.pads.slice();W0.adjustPoolAttributes(o,m,b,w,M,x);let D=W0.computePoolOutputShape(o,m,w,M,b,x,i.autoPad),_=Object.assign({},i);C?Object.assign(_,{kernelShape:b,strides:w,pads:x,dilations:M,cacheKey:i.cacheKey}):Object.assign(_,{kernelShape:b,strides:w,pads:x,cacheKey:i.cacheKey});let v=D.slice();return v.push(v.splice(1,1)[0]),[_,d?v:D]},Fc=(s,i)=>{let o=i.format==="NHWC",d=Ye.size(s),m=Ye.size(i.kernelShape),C=[{type:12,data:d},{type:12,data:m}],b=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(i.kernelShape.length<=2){let w=i.kernelShape[i.kernelShape.length-1],M=i.strides[i.strides.length-1],x=i.pads[i.pads.length/2-1],D=i.pads[i.pads.length-1],_=!!(x+D);C.push({type:12,data:w},{type:12,data:M},{type:12,data:x},{type:12,data:D}),b.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let v=!1;if(i.kernelShape.length===2){let Q=i.kernelShape[i.kernelShape.length-2],F=i.strides[i.strides.length-2],j=i.pads[i.pads.length/2-2],X=i.pads[i.pads.length-2];v=!!(j+X),C.push({type:12,data:Q},{type:12,data:F},{type:12,data:j},{type:12,data:X}),b.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[C,b,!0,_,v]}else{if(o)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let w=Ye.computeStrides(i.kernelShape);C.push({type:12,data:w},{type:12,data:i.pads},{type:12,data:i.strides}),b.push({name:"kernelStrides",type:"u32",length:w.length},{name:"pads",type:"u32",length:i.pads.length},{name:"strides",type:"u32",length:i.strides.length});let M=i.pads.reduce((x,D)=>x+D);return[C,b,!!M,!1,!1]}},Qc=(s,i,o,d,m,C,b,w,M,x,D,_)=>{let v=m.format==="NHWC",Q=i.type.value,F=Xt("output",i.type.tensor,d);if(m.kernelShape.length<=2){let j="",X="",R="",L=o-(v?2:1);if(D?j=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${L}] = indices[${L}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${L}] < 0 || xIndices[${L}]
                      >= uniforms.x_shape[${L}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${i.indicesToOffset("xIndices")}];
                  ${C}
                }`:j=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${L}] = indices[${L}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${i.indicesToOffset("xIndices")}];
                  ${C}
                }`,m.kernelShape.length===2){let K=o-(v?3:2);_?X=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${K}] = indices[${K}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${K}] < 0 || xIndices[${K}] >= uniforms.x_shape[${K}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:X=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${K}] = indices[${K}] * uniforms.sh - uniforms.phStart + j;
                `,R=`
              }
            `}return`
            ${s.registerUniforms(M).declareVariables(i,F)}

            ${s.mainStart()}
              ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${F.offsetToIndices("global_idx")};
              var xIndices = ${F.offsetToIndices("global_idx")};

              var value = ${Q}(${w});
              var pad = 0;
              ${X}
              ${j}
              ${R}
              ${b}

              output[global_idx] = value;
            }`}else{if(v)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let j=m.kernelShape.length,X=m.pads.length,R="";return x?R=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${i.indicesToOffset("xIndices")}];
                ${C}
              }`:R=`
              }
              let x_val = x[${i.indicesToOffset("xIndices")}];
              ${C}
            `,`
            ${s.registerUniforms(M).declareVariables(i,F)}

            ${s.mainStart()}
              ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${F.offsetToIndices("global_idx")};
              var xIndices = ${F.offsetToIndices("global_idx")};

              var offsets: array<u32, ${j}>;

              var value = ${Q}(${w});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${j-1}u; j++) {
                  offsets[j] = offset / ${Jt("uniforms.kernelStrides","j",j)};
                  offset -= offsets[j] * ${Jt("uniforms.kernelStrides","j",j)};
                }
                offsets[${j-1}] = offset;

                isPad = false;
                for (var j = ${o-j}u; j < ${o}u; j++) {
                  xIndices[j] = indices[j] * ${Jt("uniforms.strides",`j - ${o-j}u`,j)}
                    + offsets[j - ${o-j}u] - ${Jt("uniforms.pads","j - 2u",X)};
                  ${R}
              }
              ${b}

              output[global_idx] = value;
            }`}},Sc=s=>`${s.format};${s.ceilMode};${s.autoPad};${s.kernelShape.length}`,Zm=s=>`${Sc(s)};${s.countIncludePad}`,Jm=s=>`${Sc(s)};${s.storageOrder};${s.dilations}`,Oc=s=>({format:s.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][s.auto_pad],ceilMode:s.ceil_mode,kernelShape:s.kernel_shape,strides:s.strides,pads:s.pads}),Lc=(s,i,o,d)=>{let[m,C]=Gc(i,d,o),b=st("x",i.dataType,i.dims.length),w=b.type.value,M="value += x_val;",x="";m.countIncludePad?x+=`value /= ${w}(uniforms.kernelSize);`:x+=`value /= ${w}(i32(uniforms.kernelSize) - pad);`;let[D,_,v,Q,F]=Fc(C,m);D.push(...$t(i.dims,C));let j=["rank"];return{name:s,shaderCache:{hint:`${d.cacheKey};${v};${Q};${F}`,inputDependencies:j},getRunData:()=>({outputs:[{dims:C,dataType:i.dataType}],dispatchGroup:{x:Math.ceil(Ye.size(C)/64)},programUniforms:D}),getShaderSource:X=>Qc(X,b,i.dims.length,C.length,m,M,x,0,_,v,Q,F)}},OC=s=>{let i=s.count_include_pad!==0,o=Oc(s);if(o.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for AveragePool");let d={countIncludePad:i,...o,cacheKey:""};return{...d,cacheKey:Zm(d)}},LC=(s,i)=>{Nn(s.inputs),s.compute(Lc("AveragePool",s.inputs[0],!1,i))},Nc={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},NC=s=>{let i=s.format;return{format:i,...Nc,cacheKey:i}},zC=(s,i)=>{Nn(s.inputs),s.compute(Lc("GlobalAveragePool",s.inputs[0],!0,i))},zc=(s,i,o,d)=>{let[m,C]=Gc(i,d,o),b=`
      value = max(x_val, value);
    `,w="",M=st("x",i.dataType,i.dims.length),x=["rank"],[D,_,v,Q,F]=Fc(C,m);return D.push(...$t(i.dims,C)),{name:s,shaderCache:{hint:`${d.cacheKey};${v};${Q};${F}`,inputDependencies:x},getRunData:()=>({outputs:[{dims:C,dataType:i.dataType}],dispatchGroup:{x:Math.ceil(Ye.size(C)/64)},programUniforms:D}),getShaderSource:j=>Qc(j,M,i.dims.length,C.length,m,b,w,i.dataType===10?-65504:-1e5,_,v,Q,F)}},RC=(s,i)=>{Nn(s.inputs),s.compute(zc("MaxPool",s.inputs[0],!1,i))},jC=s=>{let i=s.storage_order,o=s.dilations,d=Oc(s);if(i!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(d.ceilMode!==0)throw new Error("using ceil() in shape computation is not yet supported for MaxPool");let m={storageOrder:i,dilations:o,...d,cacheKey:""};return{...m,cacheKey:Jm(m)}},WC=s=>{let i=s.format;return{format:i,...Nc,cacheKey:i}},VC=(s,i)=>{Nn(s.inputs),s.compute(zc("GlobalMaxPool",s.inputs[0],!0,i))}}),qm,$m,YC,HC,lw=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),qm=(s,i)=>{if(s.length<2||s.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(s.length===3&&s[1].dims===s[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(s.length===3&&s[0].dataType!==s[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(s[0].dataType===6&&s.length>2)throw new Error("In the case of dequantizing int32 there is no zero point.");if(s[1].dims.length!==0&&s[1].dims.length!==1&&s[1].dims.length!==s[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(s.length>2){if(s[0].dataType!==s[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(s[1].dims.length!==s[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!s[1].dims.map((o,d)=>o===s[2].dims[d]).reduce((o,d)=>o&&d,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(i.blockSize>0){if(s[1].dims.length===0||s[1].dims.length===1&&s[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!s[1].dims.map((m,C)=>C===i.axis||m===s[0].dims[C]).reduce((m,C)=>m&&C,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(s[1].dims.length!==s[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let o=s[0].dims[i.axis],d=s[1].dims[i.axis];if(i.blockSize<Math.ceil(o/d)||i.blockSize>Math.ceil(o/(d-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},$m=(s,i)=>{let o=Ye.normalizeAxis(i.axis,s[0].dims.length),d=s[0].dataType,m=d===3,C=s[0].dims,b=s[1].dataType,w=Ye.size(C),M=d===3||d===2,x=M?[Math.ceil(Ye.size(s[0].dims)/4)]:s[0].dims,D=s[1].dims,_=s.length>2?s[2]:void 0,v=_?M?[Math.ceil(Ye.size(_.dims)/4)]:_.dims:void 0,Q=D.length===0||D.length===1&&D[0]===1,F=Q===!1&&D.length===1,j=zr(w),X=Q&&(!M||j===4),R=X?j:1,L=X&&!M?j:1,K=st("input",M?12:d,x.length,L),g=st("scale",b,D.length),k=_?st("zero_point",M?12:d,v.length):void 0,e=Xt("output",b,C.length,R),u=[K,g];k&&u.push(k);let B=[x,D];_&&B.push(v);let q=[{type:12,data:w/R},{type:12,data:o},{type:12,data:i.blockSize},...$t(...B,C)],y=S=>{let ge=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${S.registerUniforms(ge).declareVariables(...u,e)}
      ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${e.offsetToIndices("global_idx")};

          // Set input x
          ${M?`
            let input = ${K.getByOffset("global_idx / 4")};
            let x_vec = ${m?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${R===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${K.getByOffset("global_idx")};`};

          // Set scale input
          ${Q?`let scale_value= ${g.getByOffset("0")}`:F?`
            let scale_index = ${e.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${g.getByOffset("scale_index")};`:`
            var scale_indices: ${g.type.indices} = output_indices;
            let index = ${g.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${g.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${g.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${k?Q?M?`
                let zero_point_input = ${k.getByOffset("0")};
                let zero_point_vec =  ${m?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${k.getByOffset("0")}`:F?M?`
                let zero_point_index = ${e.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${k.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${m?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${e.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${k.getByOffset("zero_point_index")};`:M?`
                let zero_point_offset = ${g.indicesToOffset("scale_indices")};
                let zero_point_input = ${k.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${m?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${k.getByIndices("scale_indices")};`:`let zero_point_value = ${M?m?"i32":"u32":K.type.value}(0);`};
      // Compute and write output
      ${e.setByOffset("global_idx",`${e.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:i.cacheKey,inputDependencies:k?["rank","rank","rank"]:["rank","rank"]},getShaderSource:y,getRunData:()=>({outputs:[{dims:C,dataType:b}],dispatchGroup:{x:Math.ceil(w/R/64),y:1,z:1},programUniforms:q})}},YC=(s,i)=>{qm(s.inputs,i),s.compute($m(s.inputs,i))},HC=s=>YA({axis:s.axis,blockSize:s.blockSize})}),e4,t4,UC,cw=Mt(()=>{"use strict";Ws(),lA(),kA(),e4=(s,i,o)=>{let d=s===i,m=s<i&&o<0,C=s>i&&o>0;if(d||m||C)throw new Error("Range these inputs' contents are invalid.")},t4=(s,i,o,d)=>{let m=Math.abs(Math.ceil((i-s)/o)),C=[m],b=m,w=[{type:12,data:b},{type:d,data:s},{type:d,data:o},...$t(C)],M=x=>{let D=Xt("output",d,C.length),_=D.type.value,v=[{name:"outputSize",type:"u32"},{name:"start",type:_},{name:"delta",type:_}];return`
        ${x.registerUniforms(v).declareVariables(D)}
        ${x.mainStart()}
        ${x.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${_}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${d}`},getShaderSource:M,getRunData:()=>({outputs:[{dims:C,dataType:d}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:w})}},UC=s=>{let i=0,o=0,d=0;s.inputs[0].dataType===6?(i=s.inputs[0].getInt32Array()[0],o=s.inputs[1].getInt32Array()[0],d=s.inputs[2].getInt32Array()[0]):s.inputs[0].dataType===1&&(i=s.inputs[0].getFloat32Array()[0],o=s.inputs[1].getFloat32Array()[0],d=s.inputs[2].getFloat32Array()[0]),kr.webgpu.validateInputContent&&e4(i,o,d),s.compute(t4(i,o,d,s.inputs[0].dataType),{inputs:[]})}}),A4,Rc,jc,r4,KC,XC,uw=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),A4=(s,i,o,d)=>{if(s!=="none"&&d!=="i32"&&d!=="u32"&&d!=="f32")throw new Error(`Input ${d} is not supported with reduction ${s}.`);let m=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,C=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${i}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(s){case"none":return`${i}=${o};`;case"add":return d==="i32"||d==="u32"?`atomicAdd(&${i}, bitcast<${d}>(${o}));`:`
              ${m}bitcast<${d}>(oldValue) + (${o})${C}`;case"max":return d==="i32"||d==="u32"?`atomicMax(&${i}, bitcast<${d}>(${o}));`:`
                ${m}max(bitcast<f32>(oldValue), (${o}))${C}`;case"min":return d==="i32"||d==="u32"?`atomicMin(&${i}, bitcast<${d}>(${o}));`:`${m}min(bitcast<${d}>(oldValue), (${o}))${C}`;case"mul":return`${m}(bitcast<${d}>(oldValue) * (${o}))${C}`;default:throw new Error(`Reduction ${s} is not supported.`)}},Rc=(s,i)=>`${s===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[${i?"i - indices_start":"i"}];
    let dim_value = uniforms.output_shape[${i?"i - indices_start":"i"} + uniforms.last_index_dimension];`}
    
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));`,jc=(s,i,o)=>`for (var i = 0u; i < uniforms.num_updates_elements; i++) {
        let value = updates[uniforms.num_updates_elements * ${o?"global_idx":"idx"} + i];
        ${A4(s.reduction,"output[data_offset + i]","value",i)}
      }`,r4=(s,i)=>{let o=s[0].dims,d=s[1].dims,m=o,C=1,b=Math.ceil(Ye.size(d)/C),w=d[d.length-1],M=Ye.sizeFromDimension(o,w),x=Ye.sizeFromDimension(d,0)/w,D=[{type:12,data:b},{type:12,data:w},{type:12,data:M},...$t(s[1].dims,s[2].dims,m)],_=v=>{let Q=st("indices",s[1].dataType,s[1].dims.length),F=st("updates",s[2].dataType,s[2].dims.length,C),j=i.reduction!=="none"&&i.reduction!==""?Mh("output",s[0].dataType,m.length):Xt("output",s[0].dataType,m.length,C);return`
      ${v.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(Q,F,j)}
      ${v.mainStart()}
        ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var hasDuplicates = false;
  if (${i.reduction==="none"}) {
    for (var i = 0; i < ${x}; i = i + 1) {
      for (var j = i + 1; j < ${x}; j = j + 1) {
        var index_i = i32(indices[i].x);
        var index_j = i32(indices[j].x);
        if (index_i == index_j) {
          hasDuplicates = true;
          break;
        }
      }
      if (hasDuplicates) {
        break;
      }
    }
  }

  if (${i.reduction==="none"} && hasDuplicates) {
    if (global_idx != 0u) {
      return;
    }
    // Process each index-update pair individually when duplicates exist
    for (var idx = 0u; idx < ${x}u; idx++) {
      var data_offset = 0u;
      for (var i = 0u; i < uniforms.last_index_dimension; i++) {
        var index = i32(indices[idx * uniforms.last_index_dimension + i].x);
        ${Rc(o.length,!1)}
      }
      ${jc(i,j.type.value,!1)}
    }
    return;
  }

  var data_offset = 0u;
  var indices_start = uniforms.last_index_dimension * global_idx;
  var indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${Rc(o.length,!0)}
  }
  ${jc(i,j.type.value,!0)}
  }`};return{name:"ScatterND",shaderCache:{hint:`${i.cacheKey}_${i.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:m,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:D}),getShaderSource:_}},KC=s=>YA({reduction:s.reduction}),XC=(s,i)=>{s.compute(r4(s.inputs,i),{inputs:[s.inputs[1],s.inputs[2]],outputs:[]})}}),a4,s4,o4,Wc,i4,n4,l4,c4,u4,d4,g4,f4,Vc,p4,m4,h4,b4,C4,ZC,JC,dw=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),a4=(s,i)=>{if(s.every(o=>o>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),s.length>0){if(i.mode==="linear"){if(!(s.length===2||s.length===3||s.length===4&&s[0]===1&&s[1]===1||s.length===4&&s[0]===1&&s[3]===1||s.length===5&&s[0]===1&&s[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(i.mode==="cubic"&&!(s.length===2||s.length===4&&s[0]===1&&s[1]===1||s.length===4&&s[0]===1&&s[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},s4=(s,i,o)=>{i.every(m=>m>=0&&m<o||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let d=new Array(o).fill(1);return i.forEach((m,C)=>d[m]=s[C]),d},o4=(s,i,o,d,m,C)=>{let[b,w,M]=o>10?[1,2,3]:[-1,s.length>1?1:-1,-1],x=s[0].dims.length;if(b>0&&s.length>b&&s[b].dims.length>0)s[b].getFloat32Array().forEach(D=>C.push(D));else if(i.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(w>0&&s.length>w&&s[w].dims.length===1&&s[w].dims[0]>0){if(s[w].getFloat32Array().forEach(D=>d.push(D)),d.length!==0&&d.length!==x&&o>=18&&d.length!==i.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");a4(d,i),i.axes.length>0&&s4(d,i.axes,x).forEach((D,_)=>d[_]=D)}if(M>0&&s.length>M&&s[M].dims.length===1&&s[M].dims[0]>0&&(s[M].getBigInt64Array().forEach(D=>m.push(Number(D))),m.length!==0&&m.length!==x&&o>=18&&m.length!==i.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(i.axes.length>0){if(d.length!==0&&d.length!==i.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(m.length!==0&&m.length!==i.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof d<"u"&&typeof m<"u"&&d.length>0&&m.length>x)throw new Error("Resize requires only of scales or sizes to be specified")},Wc=(s,i,o,d)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${s}) * (${i});
  let whole = ${d}(big / (${o}));
  let fract = ${d}(big % (${o})) / ${d}(${o});
  return whole + fract;
`,i4=(s,i)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${i} { `+(()=>{switch(s){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${i}(xResized) / ${i}(xScale);
          } else {
            ${Wc("xResized","lengthOriginal","lengthResized",i)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${i}(xResized) + 0.5) / ${i}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${i}(xResized) + 0.5) / ${i}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Wc("xResized","lengthOriginal - 1","lengthResized - 1",i)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${i}(roiStart) * ${i}(lengthOriginal - 1) +
                        (${i}(xResized) * ${i}(roiEnd - roiStart) * ${i}(lengthOriginal - 1)) /
                        ${i}(lengthResized - 1);
                  } else {
                    return 0.5 * ${i}(roiStart + roiEnd) * ${i}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${i}xScale * ${i}(lengthResized);
                  const adjustment = ${i}(lengthResized) / outputWidth;
                  const center = ${i}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${i}(xResized) + 0.5) / ${i}(xScale)) - 0.5;`;case"half_pixel":return`return ((${i}(xResized) + 0.5) / ${i}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${s} is not supported`)}})()+"}",n4=(s,i,o)=>`fn getNearestPixelFromOriginal(xOriginal: ${o}, isDownSample: bool) -> ${o} {`+(()=>{switch(s){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(i<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${s} is not supported`)}})()+"}",l4=(s,i,o)=>{let d=new Array(o).fill(0).concat(new Array(o).fill(1)),m=s.length===0?d:s.slice();return i.length>0?(i.forEach((C,b)=>{d[C]=m[b],d[b+o]=m[i.length+b]}),d):m},c4=(s,i,o,d)=>{let m=[];if(o.length>0)if(d.length>0){if(s.forEach(C=>m.push(C)),Math.max(...d)>s.length)throw new Error("axes is out of bound");d.forEach((C,b)=>m[C]=o[b])}else o.forEach(C=>m.push(C));else{if(i.length===0)throw new Error("Resize requires either scales or sizes.");m=s.map((C,b)=>Math.round(C*i[b]))}return m},u4=(s,i,o)=>{let d=(()=>{switch(o.keepAspectRatioPolicy){case"not_larger":return o.axes.length>0?Math.min(...o.axes.map(C=>i[C]),Number.MAX_VALUE):Math.min(...i,Number.MAX_VALUE);case"not_smaller":return o.axes.length>0?Math.max(...o.axes.map(C=>i[C]),Number.MIN_VALUE):Math.max(...i,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${o.keepAspectRatioPolicy} is not supported`)}})();i.fill(1,0,i.length);let m=s.slice();return o.axes.length>0?(o.axes.forEach(C=>i[C]=d),o.axes.forEach(C=>m[C]=Math.round(s[C]*i[C]))):(i.fill(d,0,i.length),m.forEach((C,b)=>m[b]=Math.round(C*i[b]))),m},d4=(s,i,o,d,m)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${s.type.indices}) -> array<${s.type.value}, ${o.length}> {
      var original_indices: array<${s.type.value}, ${o.length}>;
      for (var i:u32 = 0; i < ${o.length}; i++) {
        var output_index = ${s.indicesGet("output_indices","i")};
        var scale = ${Jt("uniforms.scales","i",d)};
        var roi_low = ${Jt("uniforms.roi","i",m)};
        var roi_hi = ${Jt("uniforms.roi",`i + ${i.length}`,m)};
        if (scale == 1.0) {
          original_indices[i] = ${s.type.value}(output_index);
        } else {
          var input_shape_i = ${Jt("uniforms.input_shape","i",i.length)};
          var output_shape_i = ${Jt("uniforms.output_shape","i",o.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,g4=(s,i,o,d,m,C,b)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${i.type.indices}) -> ${s.type.indices} {
      var input_indices: ${s.type.indices};
      for (var i:u32 = 0; i < ${d.length}; i++) {
        var output_index = ${i.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Jt("uniforms.scales","i",m)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Jt("uniforms.roi","i",C)};
          var roi_hi = ${Jt("uniforms.roi",`i + ${o.length}`,C)};
          var input_shape_i = ${Jt("uniforms.input_shape","i",o.length)};
          var output_shape_i = ${Jt("uniforms.output_shape","i",d.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${b} || (original_idx >= 0 && original_idx < ${i.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${i.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${s.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,f4=(s,i)=>`
    fn checkInputIndices(input_indices: ${s.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${i.length}; i++) {
        var input_index = ${s.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Jt("uniforms.input_shape","i",i.length)}) {
          return false;
        }
      }
      return true;
    }`,Vc=(s,i,o,d)=>s.rank>d?`
    ${s.indicesSet("input_indices",i,"channel")};
    ${s.indicesSet("input_indices",o,"batch")};
`:"",p4=(s,i,o,d,m)=>{let[C,b,w,M]=o.length===2?[-1,0,1,-1]:[0,2,3,1],x=s.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${x} {
      var input_indices: ${s.type.indices};
      ${s.indicesSet("input_indices",b,`max(0, min(row, ${o[b]} - 1))`)};
      ${s.indicesSet("input_indices",w,`max(0, min(col, ${o[w]} - 1))`)};
      ${Vc(s,M,C,2)}
      return ${s.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${i.type.indices}) -> ${x} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${x} = originalIndices[${b}];
      var col:${x} = originalIndices[${w}];
      ${d?`if (row < 0 || row > (${o[b]} - 1) || col < 0 || col > (${o[w]} - 1)) {
        return ${m};
      }`:""};
      row = max(0, min(row, ${o[b]} - 1));
      col = max(0, min(col, ${o[w]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${o.length>2?`u32(originalIndices[${M}])`:"0"};
      var batch: u32 =  ${o.length>2?`u32(originalIndices[${C}])`:"0"};
      var x11: ${x} = getInputValue(batch, channel, row1, col1);
      var x12: ${x} = getInputValue(batch, channel, row1, col2);
      var x21: ${x} = getInputValue(batch, channel, row2, col1);
      var x22: ${x} = getInputValue(batch, channel, row2, col2);
      var dx1: ${x} = abs(row - ${x}(row1));
      var dx2: ${x} = abs(${x}(row2) - row);
      var dy1: ${x} = abs(col - ${x}(col1));
      var dy2: ${x} = abs(${x}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},m4=(s,i,o,d,m,C,b,w,M,x)=>{let D=o.length===2,_=!0,[v,Q]=D?[0,1]:_?[2,3]:[1,2],F=s.type.value,j=X=>{let R=X===v?"row":"col";return`
      fn ${R}CubicInterpolation(input_indices: ${s.type.indices}, output_indices: ${i.type.indices}) -> ${F} {
        var output_index = ${i.indicesGet("output_indices",X)};
        var originalIdx: ${F} = getOriginalCoordinateFromResizedCoordinate(output_index, ${m[X]},
        ${d[X]}, ${o[X]}, ${C[X]}, ${C[X]} + ${o.length});
        var fractOriginalIdx: ${F} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${w} && (originalIdx < 0 || originalIdx > (${o[X]} - 1))) {
          return ${M};
        }
        var data: array<${F}, 4> = array<${F}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${R}: ${F} = originalIdx + ${F}(i);
          if (${R} < 0 || ${R} >= ${o[X]}) {
            ${x?`coefs[i + 1] = 0.0;
                        continue;`:w?`return ${M};`:`${R} = max(0, min(${R}, ${o[X]} - 1));`};
          }
        var input_indices_copy: ${s.type.indices} = input_indices;
          ${s.indicesSet("input_indices_copy",X,`u32(${R})`)};
          data[i + 1] = ${X===v?s.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${j(v)};
    ${j(Q)};
  fn getCubicInterpolationCoefs(s: ${F}) -> array<${F}, 4> {
    var absS = abs(s);
    var coeffs: array<${F}, 4> = array<${F}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${F} = 1.0 - absS;
    var twoMinusAbsS: ${F} = 2.0 - absS;
    var onePlusAbsS: ${F} = 1.0 + absS;
    coeffs[0] = ((${b} * onePlusAbsS - 5 * ${b}) * onePlusAbsS + 8 * ${b}) * onePlusAbsS - 4 * ${b};
    coeffs[1] = ((${b} + 2) * absS - (${b} + 3)) * absS * absS + 1;
    coeffs[2] = ((${b} + 2) * oneMinusAbsS - (${b} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${b} * twoMinusAbsS - 5 * ${b}) * twoMinusAbsS + 8 * ${b}) * twoMinusAbsS - 4 * ${b};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${F}, 4>, coefs: array<${F}, 4>) -> ${F} {
    var coefsSum: ${F} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${i.type.indices}) -> ${F} {
    var input_indices: ${s.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},h4=(s,i,o,d,m)=>{let[C,b,w,M,x]=o.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],D=s.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${D} {
      var input_indices: ${s.type.indices};
      ${s.indicesSet("input_indices",b,`max(0, min(depth, ${o[b]} - 1))`)};
      ${s.indicesSet("input_indices",w,`max(0, min(height, ${o[w]} - 1))`)};
      ${s.indicesSet("input_indices",M,`max(0, min(width, ${o[M]} - 1))`)};
      ${Vc(s,x,C,3)}
      return ${s.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${i.type.indices}) -> ${D} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${D} = originalIndices[${b}];
      var height:${D} = originalIndices[${w}];
      var width:${D} = originalIndices[${M}];
      ${d?`if (depth < 0 || depth > (${o[b]} - 1) || height < 0 || height > (${o[w]} - 1) || width < 0 || (width > ${o[M]} - 1)) {
      return ${m};
        }`:""};

    depth = max(0, min(depth, ${o[b]} - 1));
      height = max(0, min(height, ${o[w]} - 1));
      width = max(0, min(width, ${o[M]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${o.length>3?`u32(originalIndices[${x}])`:"0"};
      var batch: u32 =  ${o.length>3?`u32(originalIndices[${C}])`:"0"};

      var x111: ${D} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${D} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${D} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${D} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${D} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${D} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${D} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${D} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${D} = abs(depth - ${D}(depth1));
      var dx2: ${D} = abs(${D}(depth2) - depth);
      var dy1: ${D} = abs(height - ${D}(height1));
      var dy2: ${D} = abs(${D}(height2) - height);
      var dz1: ${D} = abs(width - ${D}(width1));
      var dz2: ${D} = abs(${D}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},b4=(s,i,o,d,m,C)=>{let b=s.dims,w=l4(C,i.axes,b.length),M=c4(b,d,m,i.axes),x=d.slice();d.length===0&&(x=b.map((L,K)=>L===0?1:M[K]/L),i.keepAspectRatioPolicy!=="stretch"&&(M=u4(b,x,i)));let D=Xt("output",s.dataType,M.length),_=st("input",s.dataType,b.length),v=Ye.size(M),Q=b.length===M.length&&b.every((L,K)=>L===M[K]),F=i.coordinateTransformMode==="tf_crop_and_resize",j=i.extrapolationValue,X=_.type.value,R=L=>`
      ${Q?"":`
      ${i4(i.coordinateTransformMode,X)};
      ${(()=>{switch(i.mode){case"nearest":return`
              ${f4(_,b)};
              ${n4(i.nearestMode,o,X)};
              ${g4(_,D,b,M,x.length,w.length,F)};
              `;case"linear":return`
              ${d4(D,b,M,x.length,w.length)};
              ${(()=>{if(b.length===2||b.length===4)return`${p4(_,D,b,F,j)}`;if(b.length===3||b.length===5)return`${h4(_,D,b,F,j)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(b.length===2||b.length===4)return`${m4(_,D,b,M,x,w,i.cubicCoeffA,F,i.extrapolationValue,i.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${L.registerUniform("output_size","u32").registerUniform("scales","f32",x.length).registerUniform("roi","f32",w.length).declareVariables(_,D)}
      ${L.mainStart()}
        ${L.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${Q?"output[global_idx] = input[global_idx];":`
        let output_indices = ${D.offsetToIndices("global_idx")};
        var input_indices: ${_.type.indices};
        ${(()=>{switch(i.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${_.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${i.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${b.length===2||b.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${i.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${i.cacheKey}|${o}|${x.length>0?i.mode==="cubic"?x:x.length:""}|${m.length>0?m:""}|${w.length>0?w:""}|${Q}|${i.mode==="nearest"?b.length:b}`,inputDependencies:["rank"]},getShaderSource:R,getRunData:()=>({outputs:[{dims:M,dataType:s.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},{type:1,data:x},{type:1,data:w},...$t(b,M)]})}},C4=s=>{let i=s.customDataBuffer;return new Uint32Array(i,i.byteOffset,1)[0]},ZC=(s,i)=>{let o=[],d=[],m=[],C=C4(s);if(i.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");o4(s.inputs,i,C,o,d,m),s.compute(b4(s.inputs[0],i,C,o,d,m),{inputs:[0]})},JC=s=>{let i=s.antialias,o=s.axes,d=s.coordinateTransformMode,m=s.cubicCoeffA,C=s.excludeOutside!==0,b=s.extrapolationValue,w=s.keepAspectRatioPolicy,M=s.mode,x=s.nearestMode===""?"simple":s.nearestMode;return YA({antialias:i,axes:o,coordinateTransformMode:d,cubicCoeffA:m,excludeOutside:C,extrapolationValue:b,keepAspectRatioPolicy:w,mode:M,nearestMode:x})}}),I4,w4,qC,gw=Mt(()=>{"use strict";lA(),IA(),kA(),I4=s=>{if(!s||s.length<3)throw new Error("layerNorm requires at least 3 inputs.");let i=s[0],o=s[1],d=s[2];if(i.dataType!==o.dataType||i.dataType!==d.dataType)throw new Error("All inputs must have the same data type");if(i.dims.length!==3&&i.dims.length!==2)throw new Error("Input must be 2D or 3D");if(o.dims.length!==3&&o.dims.length!==2)throw new Error("Skip must be 2D or 3D");let m=i.dims[i.dims.length-1],C=i.dims[i.dims.length-2];if(o.dims[o.dims.length-1]!==m)throw new Error("Skip must have the same hidden size as input");if(o.dims[o.dims.length-2]!==C)throw new Error("Skip must have the same sequence length as input");if(d.dims.length!==1)throw new Error("Gamma must be 1D");if(d.dims[d.dims.length-1]!==m)throw new Error("Gamma must have the same hidden size as input");if(s.length>3){let b=s[3];if(b.dims.length!==1)throw new Error("Beta must be 1D");if(b.dims[b.dims.length-1]!==m)throw new Error("Beta must have the same hidden size as input")}if(s.length>4){let b=s[4];if(b.dims.length!==1)throw new Error("Bias must be 1D");if(b.dims[b.dims.length-1]!==m)throw new Error("Bias must have the same hidden size as input")}},w4=(s,i,o,d)=>{let m=i.simplified,C=s[0].dims,b=Ye.size(C),w=C,M=b,x=C.slice(-1)[0],D=d?C.slice(0,-1).concat(1):[],_=!m&&s.length>3,v=s.length>4,Q=d&&o>1,F=d&&o>2,j=o>3,X=64,R=zr(x),L=[{type:12,data:M},{type:12,data:R},{type:12,data:x},{type:1,data:i.epsilon}],K=k=>{let e=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],u=[st("x",s[0].dataType,s[0].dims,R),st("skip",s[1].dataType,s[1].dims,R),st("gamma",s[2].dataType,s[2].dims,R)];_&&u.push(st("beta",s[3].dataType,s[3].dims,R)),v&&u.push(st("bias",s[4].dataType,s[4].dims,R)),u.push(Xt("output",s[0].dataType,w,R)),Q&&u.push(Xt("mean_output",1,D)),F&&u.push(Xt("inv_std_output",1,D)),j&&u.push(Xt("input_skip_bias_sum",s[0].dataType,w,R));let B=ha(s[0].dataType),q=ha(1,R);return`

      ${k.registerUniforms(e).declareVariables(...u)}
      var<workgroup> sum_shared : array<${q}, ${X}>;
      var<workgroup> sum_squared_shared : array<${q}, ${X}>;

      ${k.mainStart([X,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${X};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${X};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${X-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${v?"bias[offset1d + i]":B+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${j?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${an(B,R,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${X};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Jo("sum",R)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Jo("square_sum",R)} / f32(uniforms.hidden_size) ${m?"":"- mean * mean"} + uniforms.epsilon);
        ${Q?"mean_output[global_idx] = mean;":""}
        ${F?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${m?"":`- ${B}(mean)`}) *
            ${B}(inv_std_dev) * gamma[offset1d + i]
            ${_?"+ beta[offset1d + i]":""};
        }
      }`},g=[{dims:w,dataType:s[0].dataType}];return o>1&&g.push({dims:D,dataType:1}),o>2&&g.push({dims:D,dataType:1}),o>3&&g.push({dims:C,dataType:s[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${R};${Q};${F};${j}`,inputDependencies:s.map((k,e)=>"type")},getShaderSource:K,getRunData:()=>({outputs:g,dispatchGroup:{x:Math.ceil(M/x)},programUniforms:L})}},qC=(s,i)=>{I4(s.inputs);let o=[0];s.outputCount>1&&o.push(-3),s.outputCount>2&&o.push(-3),s.outputCount>3&&o.push(3),s.compute(w4(s.inputs,i,s.outputCount,!1),{outputs:o})}}),k4,zn,M4,Yc,x4,v4,$C,e3,fw=Mt(()=>{"use strict";lA(),IA(),Kr(),kA(),k4=(s,i)=>{if(!s||s.length<1)throw new Error("too few inputs");if(i.axes.length!==0){if(i.axes.length!==i.starts.length||i.axes.length!==i.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(i.starts.length!==i.ends.length)throw new Error("starts and ends must have the same length");s.slice(1).forEach((o,d)=>{if(s[d+1].dataType!==6&&s[d+1].dataType!==7)throw new Error(`Input ${d} must be an array of int32 or int64`)})},zn=(s,i)=>{let o=[];if(s.length>i)if(s[i].dataType===7)s[i].getBigInt64Array().forEach(d=>o.push(Number(d)));else if(s[i].dataType===6)s[i].getInt32Array().forEach(d=>o.push(Number(d)));else throw new Error(`Input ${i} must be an array of int32 or int64`);return o},M4=(s,i)=>{if(s.length>1){let o=zn(s,1),d=zn(s,2),m=zn(s,3);return m.length===0&&(m=[...Array(s[0].dims.length).keys()]),YA({starts:o,ends:d,axes:m})}else return i},Yc=(s,i,o,d,m)=>{let C=s;return s<0&&(C+=o[d[i]]),m[i]<0?Math.max(0,Math.min(C,o[d[i]]-1)):Math.max(0,Math.min(C,o[d[i]]))},x4=(s,i,o)=>`fn calculateInputIndices(output_indices: ${i.type.indices}) -> ${s.type.indices} {
          var input_indices: ${s.type.indices};
          var carry = 0u;
          for (var i = ${o.length}; i >= 0; i--) {
            let input_shape_i = ${Jt("uniforms.input_shape","i",o.length)};
            let steps_i = ${Jt("uniforms.steps","i",o.length)};
            let signs_i = ${Jt("uniforms.signs","i",o.length)};
            let starts_i = ${Jt("uniforms.starts","i",o.length)};
            var output_index = ${i.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${s.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,v4=(s,i)=>{let o=s[0].dims,d=Ye.size(o),m=i.axes.length>0?Ye.normalizeAxes(i.axes,o.length):[...Array(o.length).keys()],C=zn(s,4);C.forEach(R=>R!==0||(()=>{throw new Error("step cannot be 0")})),C.length===0&&(C=Array(m.length).fill(1));let b=i.starts.map((R,L)=>Yc(R,L,o,m,C)),w=i.ends.map((R,L)=>Yc(R,L,o,m,C));if(m.length!==b.length||m.length!==w.length)throw new Error("start, ends and axes should have the same number of elements");if(m.length!==o.length)for(let R=0;R<o.length;++R)m.includes(R)||(b.splice(R,0,0),w.splice(R,0,o[R]),C.splice(R,0,1));let M=C.map(R=>Math.sign(R));C.forEach((R,L,K)=>{if(R<0){let g=(w[L]-b[L])/R,k=b[L],e=k+g*C[L];b[L]=e,w[L]=k,K[L]=-R}});let x=o.slice(0);m.forEach((R,L)=>{x[R]=Math.ceil((w[R]-b[R])/C[R])});let D={dims:x,dataType:s[0].dataType},_=Xt("output",s[0].dataType,x.length),v=st("input",s[0].dataType,s[0].dims.length),Q=Ye.size(x),F=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:b.length},{name:"signs",type:"i32",length:M.length},{name:"steps",type:"u32",length:C.length}],j=[{type:12,data:Q},{type:12,data:b},{type:6,data:M},{type:12,data:C},...$t(s[0].dims,x)],X=R=>`
      ${R.registerUniforms(F).declareVariables(v,_)}
        ${x4(v,_,o)}
        ${R.mainStart()}
          ${R.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${_.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${_.setByOffset("global_idx",v.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${M.length}_${b.length}_${C.length}`,inputDependencies:["rank"]},getShaderSource:X,getRunData:()=>({outputs:[D],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:j})}},$C=(s,i)=>{k4(s.inputs,i);let o=M4(s.inputs,i);s.compute(v4(s.inputs,o),{inputs:[0]})},e3=s=>{let i=s.starts,o=s.ends,d=s.axes;return YA({starts:i,ends:o,axes:d})}}),E4,_4,t3,A3,pw=Mt(()=>{"use strict";lA(),IA(),Kr(),qo(),kA(),E4=s=>{if(!s||s.length!==1)throw new Error("Softmax op requires 1 input.")},_4=(s,i)=>{let o=s.inputs[0],d=o.dims,m=Ye.size(d),C=d.length,b=Ye.normalizeAxis(i.axis,C),w=b<d.length-1,M,x=[];w?(x=Array.from({length:C},(u,B)=>B),x[b]=C-1,x[C-1]=b,M=s.compute(fs(o,x),{inputs:[o],outputs:[-1]})[0]):M=o;let D=M.dims,_=D[C-1],v=m/_,Q=zr(_),F=_/Q,j=64;v===1&&(j=256);let X=(u,B)=>B===4?`max(max(${u}.x, ${u}.y), max(${u}.z, ${u}.w))`:B===2?`max(${u}.x, ${u}.y)`:B===3?`max(max(${u}.x, ${u}.y), ${u}.z)`:u,R=st("x",M.dataType,M.dims,Q),L=Xt("result",M.dataType,M.dims,Q),K=R.type.value,g=ha(M.dataType)==="f32"?`var threadMax = ${K}(-3.402823e+38f);`:`var threadMax = ${K}(-65504.0h);`,k=u=>`
      var<workgroup> rowMaxShared : ${K};
      var<workgroup> rowSumShared : ${K};
      var<workgroup> threadShared : array<${K}, ${j}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${K} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${K}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${u.registerUniform("packedCols","i32").declareVariables(R,L)}
      ${u.mainStart(j)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${j};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${g}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${K}(${X("threadShared[0]",Q)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${K}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${K}(${Jo("threadShared[0]",Q)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          let value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          setValue(row, col, row_stride, value);
        }
      }`,e=s.compute({name:"Softmax",shaderCache:{hint:`${Q};${j}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:D,dataType:M.dataType}],dispatchGroup:{x:v},programUniforms:[{type:6,data:F}]}),getShaderSource:k},{inputs:[M],outputs:[w?-1:0]})[0];w&&s.compute(fs(e,x),{inputs:[e]})},t3=(s,i)=>{E4(s.inputs),_4(s,i)},A3=s=>YA({axis:s.axis})}),Hc,B4,y4,D4,r3,mw=Mt(()=>{"use strict";lA(),IA(),kA(),Hc=s=>Array.from(s.getBigInt64Array(),Number),B4=s=>{if(!s||s.length!==2)throw new Error("Tile requires 2 inputs.");if(s[0].dataType!==1&&s[0].dataType!==10&&s[0].dataType!==6&&s[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(s[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(s[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(Hc(s[1]).length!==s[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},y4=(s,i)=>{let o=[];for(let d=0;d<s.length;++d)o.push(s[d]*i[d]);return o},D4=(s,i)=>{let o=s[0].dims,d=i??Hc(s[1]),m=y4(o,d),C=Ye.size(m),b=s[0].dataType,w=st("input",b,o.length),M=Xt("output",b,m.length),x=D=>`
      const inputShape = ${w.indices(...o)};
      ${D.registerUniform("output_size","u32").declareVariables(w,M)}
      ${D.mainStart()}
      ${D.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${M.offsetToIndices("global_idx")};
      var input_indices: ${w.type.indices};
      for (var i = 0; i < ${o.length}; i++) {
        let input_dim_i = ${w.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${M.indicesGet("output_indices","i")}  % input_dim_i;

        ${w.indicesSet("input_indices","i","input_dim_value")}
      }
      ${M.setByOffset("global_idx",w.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${d}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:m,dataType:s[0].dataType}],dispatchGroup:{x:Math.ceil(C/64)},programUniforms:[{type:12,data:C},...$t(s[0].dims,m)]}),getShaderSource:x}},r3=s=>{B4(s.inputs),s.compute(D4(s.inputs),{inputs:[0]})}}),T4,P4,a3,hw=Mt(()=>{"use strict";lA(),IA(),kA(),T4=(s,i,o,d,m)=>{let C=Xt("output_data",m,o.length,4),b=st("a_data",i[1].dataType,i[1].dims.length,4),w=st("b_data",i[2].dataType,i[2].dims.length,4),M=st("c_data",i[0].dataType,i[0].dims.length,4),x,D=(_,v,Q)=>`select(${v}, ${_}, ${Q})`;if(!d)x=C.setByOffset("global_idx",D(b.getByOffset("global_idx"),w.getByOffset("global_idx"),M.getByOffset("global_idx")));else{let _=(v,Q,F="")=>{let j=`a_data[index_a${Q}][component_a${Q}]`,X=`b_data[index_b${Q}][component_b${Q}]`,R=`bool(c_data[index_c${Q}] & (0xffu << (component_c${Q} * 8)))`;return`
            let output_indices${Q} = ${C.offsetToIndices(`global_idx * 4u + ${Q}u`)};
            let offset_a${Q} = ${b.broadcastedIndicesToOffset(`output_indices${Q}`,C)};
            let offset_b${Q} = ${w.broadcastedIndicesToOffset(`output_indices${Q}`,C)};
            let offset_c${Q} = ${M.broadcastedIndicesToOffset(`output_indices${Q}`,C)};
            let index_a${Q} = offset_a${Q} / 4u;
            let index_b${Q} = offset_b${Q} / 4u;
            let index_c${Q} = offset_c${Q} / 4u;
            let component_a${Q} = offset_a${Q} % 4u;
            let component_b${Q} = offset_b${Q} % 4u;
            let component_c${Q} = offset_c${Q} % 4u;
            ${v}[${Q}] = ${F}(${D(j,X,R)});
          `};m===9?x=`
            var data = vec4<u32>(0);
            ${_("data",0,"u32")}
            ${_("data",1,"u32")}
            ${_("data",2,"u32")}
            ${_("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:x=`
            ${_("output_data[global_idx]",0)}
            ${_("output_data[global_idx]",1)}
            ${_("output_data[global_idx]",2)}
            ${_("output_data[global_idx]",3)}
          `}return`
        ${s.registerUniform("vec_size","u32").declareVariables(M,b,w,C)}
        ${s.mainStart()}
        ${s.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${x}
      }`},P4=s=>{let i=s[1].dims,o=s[2].dims,d=s[0].dims,m=s[1].dataType,C=!(Ye.areEqual(i,o)&&Ye.areEqual(o,d)),b=i,w=Ye.size(i);if(C){let x=sn.calcShape(sn.calcShape(i,o,!1),d,!1);if(!x)throw new Error("Can't perform where op on the given tensors");b=x,w=Ye.size(b)}let M=Math.ceil(w/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:x=>T4(x,s,b,C,m),getRunData:()=>({outputs:[{dims:b,dataType:m}],dispatchGroup:{x:Math.ceil(w/64/4)},programUniforms:[{type:12,data:M},...$t(d,i,o,b)]})}},a3=s=>{s.compute(P4(s.inputs))}}),s3,bw=Mt(()=>{"use strict";P6(),y2(),G6(),F6(),Q6(),S6(),O6(),j6(),V6(),Y6(),H6(),U6(),K6(),X6(),Z6(),J6(),q6(),$6(),ew(),tw(),Aw(),rw(),aw(),sw(),ow(),xC(),iw(),nw(),lw(),cw(),uw(),B2(),dw(),yC(),gw(),fw(),pw(),_C(),mw(),qo(),D2(),hw(),s3=new Map([["Abs",[qh]],["Acos",[$h]],["Acosh",[eb]],["Add",[Fb]],["ArgMax",[Kh,r2]],["ArgMin",[Uh,r2]],["Asin",[tb]],["Asinh",[Ab]],["Atan",[rb]],["Atanh",[ab]],["Attention",[Xh]],["AveragePool",[LC,OC]],["BatchNormalization",[Zh]],["BiasAdd",[Jh]],["BiasSplitGelu",[Gb]],["Cast",[ob,sb]],["Ceil",[nb]],["Clip",[ib]],["Concat",[Vb,Yb]],["Conv",[l2,n2]],["ConvTranspose",[tC,eC]],["Cos",[lb]],["Cosh",[cb]],["CumSum",[AC,rC]],["DepthToSpace",[aC,sC]],["DequantizeLinear",[YC,HC]],["Div",[Qb]],["Einsum",[oC,iC]],["Elu",[ub,Yn]],["Equal",[Sb]],["Erf",[db]],["Exp",[gb]],["Expand",[nC]],["FastGelu",[lC]],["Floor",[fb]],["FusedConv",[l2,n2]],["Gather",[uC,cC]],["GatherElements",[hC,mC]],["GatherBlockQuantized",[fC,pC]],["GatherND",[dC,gC]],["Gelu",[pb]],["Gemm",[CC,bC]],["GlobalAveragePool",[zC,NC]],["GlobalMaxPool",[VC,WC]],["Greater",[zb]],["GreaterOrEqual",[jb]],["GridSample",[IC,wC]],["GroupQueryAttention",[DC]],["HardSigmoid",[Mb,kb]],["InstanceNormalization",[TC]],["LayerNormalization",[PC]],["LeakyRelu",[mb,Yn]],["Less",[Rb]],["LessOrEqual",[Wb]],["Log",[Tb]],["MatMul",[GC]],["MatMulNBits",[FC,QC]],["MaxPool",[RC,jC]],["Mul",[Ob]],["MultiHeadAttention",[MC,kC]],["Neg",[bb]],["Not",[hb]],["Pad",[SC]],["Pow",[Lb]],["QuickGelu",[Pb,Yn]],["Range",[UC]],["Reciprocal",[Cb]],["ReduceMin",[jh]],["ReduceMean",[Oh]],["ReduceMax",[Rh]],["ReduceSum",[Vh]],["ReduceProd",[Wh]],["ReduceL1",[Lh]],["ReduceL2",[Nh]],["ReduceLogSum",[Hh]],["ReduceLogSumExp",[zh]],["ReduceSumSquare",[Yh]],["Relu",[Ib]],["Resize",[ZC,JC]],["RotaryEmbedding",[BC]],["ScatterND",[XC,KC]],["Sigmoid",[wb]],["Sin",[xb]],["Sinh",[vb]],["Slice",[$C,e3]],["SkipLayerNormalization",[qC]],["Split",[vC,EC]],["Sqrt",[Eb]],["Softmax",[t3,A3]],["Sub",[Nb]],["Tan",[_b]],["Tanh",[Bb]],["ThresholdedRelu",[Db,Yn]],["Tile",[r3]],["Transpose",[vh,Eh]],["Where",[a3]]])}),o3,Cw=Mt(()=>{"use strict";Ws(),xo(),kA(),o3=class{constructor(s){this.backend=s,this.repo=new Map,this.attributesBound=!1}getArtifact(s){return this.repo.get(s)}setArtifact(s,i){this.repo.set(s,i)}run(s,i,o,d,m){js(s.programInfo.name);let C=this.backend.device,b=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let w=[];for(let x of i)w.push({binding:w.length,resource:{buffer:x.buffer}});for(let x of o)w.push({binding:w.length,resource:{buffer:x.buffer}});m&&w.push({binding:w.length,resource:m});let M=C.createBindGroup({layout:s.computePipeline.getBindGroupLayout(0),entries:w,label:s.programInfo.name});if(this.backend.sessionStatus==="capturing"){let x={kernelId:this.backend.currentKernelId,computePipeline:s.computePipeline,bindGroup:M,dispatchGroup:d};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(x)}b.setPipeline(s.computePipeline),b.setBindGroup(0,M),b.dispatchWorkgroups(...d),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Es(s.programInfo.name)}dispose(){}build(s,i){js(s.name);let o=this.backend.device,d=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(x=>{o.features.has(x.feature)&&d.push(`enable ${x.extension};`)});let m=xh(i,this.backend.device.limits),C=s.getShaderSource(m),b=`${d.join(`
`)}
${m.additionalImplementations}
${C}`,w=o.createShaderModule({code:b,label:s.name});SA("verbose",()=>`[WebGPU] ${s.name} shader code: ${b}`);let M=o.createComputePipeline({compute:{module:w,entryPoint:"main"},layout:"auto",label:s.name});return Es(s.name),{programInfo:s,computePipeline:M,uniformVariablesInfo:m.variablesInfo}}normalizeDispatchGroupSize(s){let i=typeof s=="number"?s:s.x,o=typeof s=="number"?1:s.y||1,d=typeof s=="number"?1:s.z||1,m=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(i<=m&&o<=m&&d<=m)return[i,o,d];let C=i*o*d,b=Math.ceil(Math.sqrt(C));if(b>m){if(b=Math.ceil(Math.cbrt(C)),b>m)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[b,b,b]}else return[b,b,1]}}}),i3={};nn(i3,{WebGpuBackend:()=>n3});var G4,F4,Q4,n3,Iw=Mt(()=>{"use strict";Ws(),lA(),xo(),Ch(),D6(),bw(),Cw(),G4=(s,i)=>{if(i.length!==s.length)throw new Error(`inputDependencies length ${i.length} is not equal to inputTensors length ${s.length}.`);let o=[];for(let d=0;d<s.length;++d){let m=s[d].dataType;switch(i[d]){case"none":{o.push("");break}case"type":{o.push(`${m}`);break}case"rank":{let C=s[d].dims.length;o.push(`${m};${C}`);break}case"dims":{let C=s[d].dims.join(",");o.push(`${m};${C}`);break}default:throw new Error(`unsupported input dependency: ${i[d]}`)}}return o.join("|")},F4=(s,i,o)=>{let d=s.name;return s.shaderCache?.hint&&(d+="["+s.shaderCache.hint+"]"),d+=":"+o+`:${G4(i,s.shaderCache?.inputDependencies??new Array(i.length).fill("dims"))}`,d},Q4=class{constructor(s){s&&(this.architecture=s.architecture,this.vendor=s.vendor)}isArchitecture(s){return this.architecture===s}isVendor(s){return this.vendor===s}},n3=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let s=this.kernelCustomData.get(this.currentKernelId);return s||(s={},this.kernelCustomData.set(this.currentKernelId,s)),s}async initialize(s,i){this.env=s;let o=[],d={requiredLimits:{maxComputeWorkgroupStorageSize:i.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:i.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:i.limits.maxStorageBufferBindingSize,maxBufferSize:i.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:i.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:i.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:i.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:i.limits.maxComputeWorkgroupSizeZ},requiredFeatures:o},m=C=>i.features.has(C)&&o.push(C)&&!0;m("chromium-experimental-timestamp-query-inside-passes")||m("timestamp-query"),m("shader-f16"),m("subgroups"),this.device=await i.requestDevice(d),this.adapterInfo=new Q4(i.info||await i.requestAdapterInfo()),this.gpuDataManager=kh(this),this.programManager=new o3(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,x2(s.logLevel,!!s.debug),this.device.onuncapturederror=C=>{C.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${C.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!1}),Object.defineProperty(this.env.webgpu,"adapter",{value:i,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose()}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let s=this.getCommandEncoder(),i={};this.queryType==="at-passes"&&(i.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=s.beginComputePass(i)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;js(),this.endComputePass();let s;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),s=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(s,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,s,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&s.mapAsync(GPUMapMode.READ).then(()=>{let i=new BigUint64Array(s.getMappedRange()),o=this.pendingQueries.get(s);for(let d=0;d<i.length/2;d++){let m=o[d],C=m.kernelId,b=this.kernels.get(C),w=b.kernelType,M=b.kernelName,x=m.programName,D=m.inputTensorViews,_=m.outputTensorViews,v=i[d*2],Q=i[d*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=v);let F=Number(v-this.queryTimeBase),j=Number(Q-this.queryTimeBase);if(!Number.isSafeInteger(F)||!Number.isSafeInteger(j))throw new RangeError("incorrect timestamp range");if(this.env.webgpu.profiling?.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:D.map(X=>({dims:X.dims,dataType:Mo(X.dataType)})),outputsMetadata:_.map(X=>({dims:X.dims,dataType:Mo(X.dataType)})),kernelId:C,kernelType:w,kernelName:M,programName:x,startTime:F,endTime:j});else{let X="";D.forEach((L,K)=>{X+=`input[${K}]: [${L.dims}] | ${Mo(L.dataType)}, `});let R="";_.forEach((L,K)=>{R+=`output[${K}]: [${L.dims}] | ${Mo(L.dataType)}, `}),console.log(`[profiling] kernel "${C}|${w}|${M}|${x}" ${X}${R}execution time: ${j-F} ns`)}Xn("GPU",`${x}::${v}::${Q}`)}s.unmap(),this.pendingQueries.delete(s)}),Es()}run(s,i,o,d,m,C){js(s.name);let b=[];for(let L=0;L<i.length;++L){let K=i[L].data;if(K===0)continue;let g=this.gpuDataManager.get(K);if(!g)throw new Error(`no GPU data for input: ${K}`);b.push(g)}let{outputs:w,dispatchGroup:M,programUniforms:x}=s.getRunData(i),D=o.length===0?w.map((L,K)=>K):o;if(D.length!==w.length)throw new Error(`Output size ${D.length} must be equal to ${w.length}.`);let _=[],v=[];for(let L=0;L<w.length;++L){if(!Number.isInteger(D[L])||D[L]<-3||D[L]>=C)throw new Error(`Invalid output index: ${D[L]}`);if(D[L]===-3)continue;let K=D[L]===-1,g=D[L]===-2,k=K||g?m(w[L].dataType,w[L].dims):d(D[L],w[L].dataType,w[L].dims);if(_.push(k),k.data===0)continue;let e=this.gpuDataManager.get(k.data);if(!e)throw new Error(`no GPU data for output: ${k.data}`);if(K&&this.temporaryData.push(e),g){let u=this.kernelPersistentData.get(this.currentKernelId);u||(u=[],this.kernelPersistentData.set(this.currentKernelId,u)),u.push(e)}v.push(e)}if(b.length!==i.length||v.length!==_.length){if(v.length===0)return Es(s.name),_;throw new Error(`Program ${s.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let Q;if(x){let L=0,K=[];x.forEach(u=>{let B=typeof u.data=="number"?[u.data]:u.data;if(B.length===0)return;let q=u.type===10?2:4,y,S;u.type===10?(S=B.length>4?16:B.length>2?8:B.length*q,y=B.length>4?16:q*B.length):(S=B.length<=2?B.length*q:16,y=16),L=Math.ceil(L/S)*S,K.push(L);let ge=u.type===10?8:4;L+=B.length>4?Math.ceil(B.length/ge)*y:B.length*q});let g=16;L=Math.ceil(L/g)*g;let k=new ArrayBuffer(L);x.forEach((u,B)=>{let q=K[B],y=typeof u.data=="number"?[u.data]:u.data;if(u.type===6)new Int32Array(k,q,y.length).set(y);else if(u.type===12)new Uint32Array(k,q,y.length).set(y);else if(u.type===10)new Uint16Array(k,q,y.length).set(y);else if(u.type===1)new Float32Array(k,q,y.length).set(y);else throw new Error(`Unsupported uniform type: ${Mo(u.type)}`)});let e=this.gpuDataManager.create(L,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(e.buffer,0,k,0,L),this.gpuDataManager.release(e.id),Q={offset:0,size:L,buffer:e.buffer}}let F=this.programManager.normalizeDispatchGroupSize(M),j=F[1]===1&&F[2]===1,X=F4(s,i,j),R=this.programManager.getArtifact(X);if(R||(R=this.programManager.build(s,F),this.programManager.setArtifact(X,R),SA("info",()=>`[artifact] key: ${X}, programName: ${s.name}`)),x&&R.uniformVariablesInfo){if(x.length!==R.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${R.uniformVariablesInfo.length}, got ${x.length} in program "${R.programInfo.name}".`);for(let L=0;L<x.length;L++){let K=x[L],g=K.type,k=typeof K.data=="number"?1:K.data.length,[e,u]=R.uniformVariablesInfo[L];if(g!==e||k!==u)throw new Error(`Uniform variable ${L} mismatch: expect type ${e} with size ${u}, got type ${g} with size ${k} in program "${R.programInfo.name}".`)}}if(SA("info",()=>`[ProgramManager] run "${s.name}" (key=${X}) with ${F[0]}x${F[1]}x${F[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let L={kernelId:this.currentKernelId,programName:R.programInfo.name,inputTensorViews:i,outputTensorViews:_};this.pendingKernels.push(L),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(L)}return this.programManager.run(R,b,v,F,Q),Es(s.name),_}upload(s,i){this.gpuDataManager.upload(s,i)}memcpy(s,i){this.gpuDataManager.memcpy(s,i)}async download(s,i){await this.gpuDataManager.download(s,i)}alloc(s){return this.gpuDataManager.create(s).id}free(s){return this.gpuDataManager.release(s)}createKernel(s,i,o,d){let m=s3.get(s);if(!m)throw new Error(`kernel not implemented: ${s}`);let C={kernelType:s,kernelName:d,kernelEntry:m[0],attributes:[m[1],o]};this.kernels.set(i,C)}releaseKernel(s){let i=this.kernelPersistentData.get(s);if(i){for(let o of i)this.gpuDataManager.release(o.id);this.kernelPersistentData.delete(s)}this.kernelCustomData.delete(s),this.kernels.delete(s)}computeKernel(s,i,o){let d=this.kernels.get(s);if(!d)throw new Error(`kernel not created: ${s}`);let m=d.kernelType,C=d.kernelName,b=d.kernelEntry,w=d.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${m}] ${C}" is not allowed to be called recursively`);this.currentKernelId=s,w[0]&&(w[1]=w[0](w[1]),w[0]=void 0),SA("info",()=>`[WebGPU] Start to run kernel "[${m}] ${C}"...`);let M=this.env.debug;this.temporaryData=[];try{return M&&this.device.pushErrorScope("validation"),b(i,w[1]),0}catch(x){return o.push(Promise.resolve(`[WebGPU] Kernel "[${m}] ${C}" failed. ${x}`)),1}finally{M&&o×Ï{ï¾›Ê×¬¢h­µç[
ÌÍŽ_
UM‰VÝ
ÌLŸI‰ŠVÛ
ÌMŒ—OLM	‘K
[
ÍLŸLŒM‹
ÌM
K]
‹
ÌÍŽ
KJJILŒ
JKÖÛ
ÌÌOLOY‹
ŠOL
Y\Ù[Ù^ÚYŠÉ‰ŠYVÌÌÌÌ×KVÌ—JJ^ÑÝ

ÌÌŠKÖÛ
ÍÌŸOLOZØœ™XZÈZYŠOL	˜I‰ŠVÛ
ÌLŽŒ—OQK
O[
ÍLŸLLÌM
ÌLŽ
KOT]
K
ÌÌ
JKZM‰VÝ
ÌL_
VÛ
ÌLMŒ—OSËVÛ
ÌLLŒ—OQK
O[
ÍLŸLLÎ
ÌLLŸ
KJOT]
K
ÌÌ
JOÌNœ
K\RJ^ÜÎžÚYŠXßJI™VÌÌÌÍJJ^ÚYŠJM‰VÝ
ÌLJI‰˜ÊXœ™XZÈÎÜYVÝ
ÌLŒ—KVÛ
ÎMŒ—OQK
O[
ÍLŸ
ŠOLÎLMÌŠŒŒM	œ
OŒNÎLMLÍŽLMÌ
ÎMŸ
KT]
K
ÌÌ
_Y[ÙHVÛ
ÎŒ—OQK
[
ÍLŸLMN
Î
KT]
‹
ÌÌ
NÚYŠŠXœ™XZÈŸYVÛ
ÍŒ—OQK
[
ÍLŸLMÍ‹HM
K]
‹
ÌÌ
___ROZVÛ
ÍÌŸ_ŸZ

JOŒ
M‰VÝ
ÌLOÌ•
_
]
LŒMŒ‹
ÍÌŸ
KOLK]VÛ
ÍÌŸJJI‰Š]
LŒŒK
ÍÌŸ
KOLJ_ZYŠJJYÖÛ
ÌÌJ_J	ŠOYVÝ
ÌLŒ—JJ_]VÛ
ÌÍŽJJ^ÚYŠ]
L
ÌŽLŸ
KR_J	VÝ
ÌL_J_
ÖÛ
ÌŽLŸOL
KM‰VÝ
ÌLJ^ÙVÛ
ÌŽŒ—O[
ÍÌ‹VÛ
ÌŒ—O[
ÌÍŽVÛ
ÌŒŒ—O[
ÌŽL‹VÛ
ÌMŒ—O[
ÌÌ
‹LLNK
ÌMŸ
KOLNØœ™XZÈ_YVÛ
ÌLŒ—O[
ÍÌ‹VÛ
ÎŒ—O[
ÌÌVÛ
ÍŒ—O[
ÌŽL‹VÛŒ—O[
ÌÍŽ
‹LLNK
KOLNØœ™XZÈ_MLL‰I‰Š\Ÿ

OQ]

ÌÍŽ
KL_
JO
]VÙVÌM
ÊÖÌ
OPJÊ
ÌÍŽ
_
WOŠOŒ—JÌL_HOL‹

O]VÙVÌM
ÊŠOŒ—JÌL_JJOOLI‰ŠO]VÙVÌM
ÊÖÛ
ÌÌ_OŠOŒ—JÌL_JKŸ
MI˜JHOLŸ
ÖÌWOL
JJKJ	VÝ
ÌLLJ_]VÛ
ÍÌŸOÊVÛ
ÍMŒ—O[
ÍÌ‹VÛ
ÍLŒ—O[
ÌÌVÛ
ÍŒ—O[
ÌÍŽ
‹LŒŽ‹
Í
JNŠVÛ
ÌÍŒ—O[
ÌÌVÛ
ÌÌŒ—O[
ÌÍŽ

O[
‹LÍŽ
ÌÌŸ
JJOŒ	‰ŠO]VÙVÌM
ÊVÊPKL_
JÛŸOŠOŒ—JÌL_OOLÜŽJKÝ
JÛŸ
ÍÌŸ
J_Y[ÙHÝ
‹ŠNØOLYNšYŠŽÍMM‰ŠYVÝ
ÌLŒ—JJ^ÚYŠ
]
ŠJOL
Xœ™XZÈNÙ›ÜŠOLLÝVÌ
]
ÛŸ
WOOM‰‰ŠI‰ŠÖÌ—OMJKOLJK]
Ì_
]
ŠJOŠ
NÊNßY[ÙHYŠM‰	‰ŠOLJ

JQ]
ŠJKL_
JO
JJ^ÚYŠ
Y›ÜŠKL‰šLÝVÌ
]
ÛŸ
WOOMÊLKI‰ŠÖÌOMJJNœPKVÌ
\L_
WOOMÊOLK‰‰ŠÖÌOMJJNO\‹]LŸ

HOJ
YŠÌŸ
JNÊNÌIš	‰ŠP_VÌ
]
ÛŸ
WHOMŸ
ÖÌOMJJ_\™]\›ˆ[
Í_Y[˜Ý[ÛˆØJK‹J^Ý˜\ˆ‹ÏLLLOLLOLLÚYŠ[RLÍLŸÖÛŠÌÌOLÖÛŠÌŒOLÖÛŠÍOLYVÙVÍÌNL—JÌŽLŒ—KUÝ
ŠÌÍJK
LÌŒ	ŠÏYVÛŠÌÍŒ—JJOOMMÌÍ	‰ŠÉLMKVÛŠÌÍŒ—OXÊK‰˜I‰“˜JÊI‰”]
MÍËŠÌÌ
KÏT›ÊVÛŠÌÍŒ—K
KVÛŠÌÍŒ—OXËOLI˜KÝ
ËÖÌ
PJÕ
WKŠÌŒJKJO]VÛŠÌŒJJ^ÙNšYŠ
OQØJVÛŠÌÍŒ—JJI‰ŠVÛŠÌÍŒ—OLMŒÎÉK	˜JJ^ÝœÝÚ]Ú
LÌÍÍNŒÉŠOLM
J^ØØ\ÙH˜Ø\ÙHÎ˜œ™XZÈNÙY˜][˜œ™XZÈT]
OYVÌLÌLŒÌŠÊOŠOŒ—KŠÌÌ
KVÛŠÌÌ_
ÖÛŠÌÌŸOZ›ÊÍ
KPKO[ŠÌÌË]
VÍÌNMKJKVÛŠÌÌßI‰ŠÖÛŠÌÌŒWOMLÎKOQ]
JJÊŠÌÌ
_ÖÐJÍ_OLÖÐJÍO\ÖÐJÌßOLŒJJ_WÝ
VÛŠÌÍŒ—KÖÌKŠÌŒJKO]VÛŠÌŒ_YNžÝžÚYŠILMJ^ÚYŠ
JHOLŒJXœ™XZÈÑÝ
‹ŠÌŒ
KLØœ™XZÈ_ZYŠOLMŒÌ‹J

ÏYVÛŠÌÍŒ—JJOMŒÌŠJ^Ù›ÜŠOLLÌÍŒÎÊ^ÚYŠ
ÊOJJÌL
J^ÚYŠJOYVÊORJÍ
OŒ—JJXœ™XZÈÚYŠ
JOJÊJXÛÛ[YNØœ™XZÈXœ™XZßJ
OM
ÊËP_
_
JOLÝ
KŠÌŒJ__]žÜŽžÜÎžÛÎžÚYŠOY
VÛŠÌÍŒ—JJ^ÚYŠÏYVÐJÍŒ—KP_IŠOYVÐJÌMŒ—J_
YVÍÌNL—KVÙŠÍŒŒ—OOJÊ_VÙŠÌNŒ—OOJÊ_VÙŠÌNŒ—OOJÊ_
ÖÛŠÌMOL]
‹VÐOŒ—K‹HM
OÊ
YVÍÌNL—JJHOJ
I‰ŠYVÝ
ÌŽLŒ—KÝ
ŠÌM‹HM
KÖÛŠÍŸOYVÙŠÌŽLŒ—JNŠÖÛŠÍŸOZ›ÊÍ
K]
VÍÌNMKVÐOŒ—KŠÌM
JKVÛŠÌMI‰ŠÖÛŠÍŒWOMLÎKÝ
ß
[‹HM
K[ŠÌM
KQ]

JÙŸÖÙŠÍ_OLÖÙŠÍO\ÖÙŠÌßOLŒJJJKVÛŠÌŒJXœ™XZÈÚYŠXß
YVÍÌNL—KVÜ
ÌNŒ—HOJÊJJXœ™XZÈÎÐOYVÜ
ÌNLŒ—NØœ™XZÈŸZYŠVÛŠÌŒJXœ™XZÈÒOLÏLØœ™XZÈßZYŠ
OYVÐJÌLŒ—JI‰ˆJ‰’JJXœ™XZÈŸPOLNMŸZYŠ
VÝ
ÌŒLŒ—OOJJIŠJHOLÍLß
ÖÛŠÌŒŸOZ›Ê	
ŠÍßJJK
OYVÍÌNMJI‰Š

YVÛŠÌÍŒ—JJOMLŒM_

\MÌŸ
JO×Ý
KÖÌKŠÌŒËJNŠÖÛŠÍLŸOLÌ‹OZ[ŠÍLßMLLŒMN	‰ŠOZ\ŠÍLŠÊ
Œ
KÍN
_
JÚ
K\ŠJÊ

JŒ
KÌŽ
OŒ
ILŒ_
_JK\ŠLNJÊ‹TÊŽ
_
_JÌß
KÖÐJÍŸOLÌ‹ÖÐJÍßOLÖÛŠÌŒßOLO[ŠÌŒË
VÍÌNMKKÍË
KJVÍÌNMKKLK
JKO[ŠÌŒËVÛŠÌŒßOOLŒI‰ŠÖÛŠÌŒŸOZ›ÊŠÌŒ
KÝ
VÍÌNMKVÛŠÌÍŒ—KÖÌKKJJK˜JVÙVÌÌŽMÌ—JÍŒŒ—JKVÛŠÌŒßI‰ŠÖÛŠÌŒŒWOMLÎKOQ]
JJÊŠÌŒ
_ÖÐJÌßOLŒKOYVÝ
ÌŽLŒ—KÖÐJÍ_OLÖÐJÍOQJJK]VÛŠÌŒJJI‰ŠM‰’_
JVÛŠÌÍŒ—JI‰”]
VÍÌNL—KMŽËŠÌŒ
KVÛŠÌŒ_
\ŠVÛŠÌÍŒ—J_]
VÍÌNL—KMÍÎŠÌŒ
KVÛŠÌŒ_œŠNNL‹ŠÌŒ
JJKJ	’J_	˜JJ^ÚYŠOYVÛŠÌÍŒ—K
ÊHOLLÊVÛŠÌÌŒ—OPK
ŠÍLŸŒLËŠÌÌŸ
JNŠÏ[ŠÍLŸII‰ŠÖÛŠÍLŸOMKÏ[ŠÍLß
K‰I‰ŠÖÌ×OMLÏXÊÌ_
K	I‰ŠÖÌ×OMLKÏXÊÌ_OYVÛŠÌÍŒ—JK	I‰ŠÖÌ×OML‹ÏXÊÌ_OYVÛŠÌÍŒ—JKM‰I‰ŠÖÌ×OMLËÏXÊÌ_OYVÛŠÌÍŒ—JKÌ‰I‰ŠÖÌ×OMMÏXÊÌ_OYVÛŠÌÍŒ—JK	I‰ŠÖÌ×OMMKÏXÊÌ_OYVÛŠÌÍŒ—JKLŽ	I‰ŠÖÌ×OMM‹ÏXÊÌ_
KÖÌ×OL
KO[ŠÌŒO]VÛŠÍLŸJY›ÜŠÏ[ŠÍLŸÐOQ]
JJÐ_ÖÌWOLŒËOPJÌ_Ý
VÍÌNL—KOŒKJK
O]VÌWJI‰ŠJHOLŒ_

OYÖÌ×JJOMßœŠVÌLÌŒ
Ê
MI˜JOŠOŒ—KK
KO]VÌ
ÏXÊÌ_
WNÊNÐOQ]
JJÐ_ÖÌWONKÖÐJÌ_OL_POQ]
ŠK‰VÝ
ÌMOÊVÛŠÌMŒ—OLMKVÛŠÌŽŒ—O[ŠÌÌVÛŠÌŒ—O[ŠÌŒVÛŠÌŒŒ—O[‹HM
ŠÌMŒŒLŠÌMŸ
JNŠVÛŒ—OLMKVÛŠÌLŒ—O[ŠÌŒVÛŠÎŒ—O[ŠÌÌVÛŠÍŒ—O[‹HM
ŠÌMŒŒLŠJK]
ŠÌM
JÐOŒŒNN_Ý
JÜŸŠÌM
_\™]\›ˆ[ŠÌÍLŸY[˜Ý[Ûˆ˜JK‹K‹Ê^Ý˜\ˆ‹LOLLOLLÏLLOLL™OLÙOL™OLÙOLOL™OL™OL™OL]LLÝLLPOLÒYRMLŽ™OXÏÙVØÏŒ—NŒ™OYVÛŠÍŒ—NÙNžÝžÚYŠVÝ
ÌŒŒŒ—OŒ
^ÓJOYŠÌÍLŸKMŒ
KSÏRLMÍŸOLKJYVÝ
ÌŒŒŒ—J_YVÝ
ÌŒŒ—KÙOYVÝ
ÌŒMŒ—KORNÜŽžÜÎžÙ›ÜŠÎÊ^ÚYŠ™OUÝ
ÊÌMÌŸJKYVÓÊÌMÌŒ—J^ÚYŠ

O
Š_

OŠÙJJXœ™XZÈÎÚYŠŠ^ÚYŠ

YÖÒŠÊUŸ
_JJOL
Xœ™XZÈßY[ÙH\
Õ_ÚYŠOQJØ™_ÖÕ
ÓßO\LMŒ

U
Ì_
JHOLMŒ
XÛÛ[Y_Y[ÙHUØœ™XZßZYŠLÖÜ
ÓßOLOYÖÌ×KVÓÊÌMÌŒ—OUKJ^Ù›ÜŠ™OLŠÊÙKUŸ
_\SÎÎÊ^ØÙO\
Ì_ÛÎžÚYŠ
™OYVÝ
ÎNŒ—JI‰ŠLJ

OZÖØ™OŒWJJOŠ
OJÖÌÙWO
JÕ_
JJJJY›ÜŠÎÊ^ÚYŠ
JOOJJJ^ÕOU
Ò™_VÓÊÌMÌŒ—OUK\
ÌŸØœ™XZÈßZYŠJ
JOJ
OZÖØ™JÊ
U
Ì_
OJOŒWJJJJXœ™XZß\XÙ_ZYŠÙOMŒÉ•_ÙO‹

RŠÍŸ
JOÒUŠR‹LŸÖÌ—OZÙO’‹UŠÌ_
KOYÖÌKVÓÊÌMÌŒ—OUKUJXœ™XZßJŠOL
ÖÌ—OZÙOR‹UŠÌ_
_Y[ÙHSÎÙÖÌ—OL
KËU‹Sß
KMØœ™XZÈŸUQ]
J_RSÊÌMÍŸÏR_Y[ÙHQ]
JKÏPNÚYŠO]VÌ×J^Ù›ÜŠLSÎÚLLŒÉŠJÊJÒ_
WšŽ\
Ì_O]VÌ
U
Ì_
WNÊNÜ\
Ú	ŒLŒßY[ÙHLÚYŠYVÍŽLŠÊ
ŠJÝ
OŒ—J^ÚYŠ]VÌJXœ™XZÈÜLØœ™XZÈ_ZYŠL[ŠXœ™XZÈNÙVÛŒ—OLØœ™XZÈ_Y›ÜŠ™OLLÌÍÍN	“™KOLŒ	›™OMLL‰œ™K™OMMLÍ‰œ™K]LIœ™KL‰œ™K™ON	›ÝLL	›ÙOM	›MŒÉ•‹PO]
ÎŒÌßÎÊ^ÛJMIœ
JÚÝžÜŽšYŠ
LÉŠ]VÚ
Ì_JJOOJŠI‰ˆVœŠË
ÌŸ
J^ÚLŠÊ
ŒÉœ
JÚ
_ÜÎžÚYŠŒ
RLÖÌWOLÙ[Ù^ÚYŠ

Q]

JJOLMŒ
Xœ™XZÈÎÑÝ
K
KLJÊ
ÒŸ
_ZYŠOLŒZŒ
\\‹OLÙ[Ù^ÕLOLÛÎžÙ›ÜŠÎÊ^ÚJZ
JÌ_ÛŽšYŠ
]VÌJOŒLL
^ÚYŠOYVÝ
ÌÌŒŒ—KŒLLÌŠ^ÕUOœLLÌ‰ŒNØœ™XZÈŸUHJOœLL	ŒJ_Y[Ù^ÚYŠŒNJ^ÕO\NÙO[ZØÎšYŠÊY›ÜŠLÎÊ^ÚYŠ™OTÊLŠJØß]VÑ™JÌLJXœ™XZÈÎÚYŠHHJL‰VÑ™JÌ_J_™OJ
HOJJK\
Ì_Q™JXœ™XZßZYŠœÊ‹ÙJ_I•
Xœ™XZÈŽÙVÌÌÌOUK\ŠÚÙ__LLŽ[Øœ™XZÈß\ŒMOÊOLMIœLM‰‘KOLL‰ŸœÑNLLŸJNœŒLÌÒ_LOLÌŽ‘_LOZYŠJŒšŒ
JXœ™XZßZYŠ\‹I•
Xœ™XZÈZYŠMLÍ‰’I‰ˆXÙ_Ý	‰LML‰’JXœ™XZÈZYŠÙI‰ŠMŒÎ	’_\™I‰ŒÌÍŽ	’J_
ÌLL‰’J_
]ÌŒL	’J_
™OÌŒÌÍMMÌ‰‘J_JJLÌLÌ‰’J_VÙVÍÌNL—JÎŒŒ—O\Œ™J_
™OÌŒŒŒM	’J_
	VÙVÍÌNL—JÎŸOÌŽNL‰’J_M‰’I‰ŠYVÝ
ÎNŒ—IŠ\™_YVÝ
ÎNLŒ—J_J\™_VÝ
ÌŒLŒ—HOLNMŠI‰ŒŒMÌML‰™VÝ
ÎŒÌŒ—J_
VÝ
ÎNŒ—OÌ	’J_
YVÝ
ÎNMŒ—_OÌÌ‰’NŒ
_JJMLÍ‰‘J_VÝ
ÌŒLŒ—HOLÍ_LŽ	VÌPWJ_
VÍÌNL—HOJ
OÍLŽ	’NŒ
JXœ™XZÈÛÎžÛŽžØÎžÚYŠ[Š^ÚYŠRŠXœ™XZÈÎØœ™XZÈßZYŠVÛŠÍŒ—ORKVÛŒ—OLLÌÍÍNKŠXœ™XZÈŸZYŠLJ	VÌNÎJJXœ™XZÈNÑÊ‹YŠÌÌŸ
KVÙŒ—OPKVÙŠÍŒ—O]JVÍÌNMWKLÌÌŠNØœ™XZÈ_YVÛŒ—OKLLÌÍÍN_ZYŠ	VÌNÎI‰Š\ŠK‹HM
KVÙVÍÌNL—JÌMÌŸOOJOŒŽIŒJI‰ŠXßJLŽ	‘JOÊVÙŠÍŒ—OPKJVÍÌNMWKM‹ŠÍ
JNŠ
YŠÌÍLŸO\‹\\Ÿ
KÖÌÍLJÊŠÙŸ
_OLVÙŠÌÌŒ—OPKVÙŠÌÍŒ—O]JVÍÌNMWKLÎMËŠÌÌŸ
JKÊ‹YŠÌÌŸ
KOYVÍÌNMWKVÙŠÌMŒ—OY‹HMVÙŠÌŒŒ—O]JKMLÍŠÌMŸ
JJKVÕÝ
‹HMÊJÓß_[ŸÐJVÙŠÍŒ—JJXœ™XZÈNÙVÛŒ—OLLÍŒMÍÌŽVÛŒ—NØœ™XZÈ_ZYJLŒÍ‹ŒÍËMŠKŠ
_Z[ZYŠJ]VÌJJXœ™XZß\L\™]\›ˆYŠÍLŽY[˜Ý[ÛˆJK‹KŠ^Ý˜\ˆÏLLÒ[RLÌÖÛ
ÌÎOLÙNžÚYŠ
JOŒ	‰ŠI˜I‰Š‰˜I‰ŠVÛ
ÌMŒ—O\‹VÛ
ÌMŒŒ—OPK
Ï[
ÌŽLMÌK
ÌMŒ
KÏT]
Ë
ÌŒ
J_I™ÖÌLÌÌM—I‰ŠVÛ
ÌMŒ—O\‹VÛ
ÌMŒ—OPK
Ï[
ÌŽLMÍMË
ÌM
KÏT]
Ë
ÌŒ
J_
VÛ
ÌLÌŒ—O\‹VÛ
ÌLŽŒ—OPK
Ï[
ÌŽLNM
ÌLŽ
KÏT]
Ë
ÌŒ
JJ_
VÛ
ÌLMŒ—O\‹VÛ
ÌLLŒ—OPK
Ï[
ÌŽLNMÍ
ÌLLŸ
KÏT]
Ë
ÌŒ
JJJXœ™XZÈNÚYŠ

JJILL
JOLŒ	‰”]
LŒ‹
ÌÎ
KI˜J^ÚYŠ‰˜J^ØÏY‹LL_ÝžÜŽžÜÎœÝÚ]Ú

	™VÙVÍÌNL—JÌLŒ—JKMŸ
^ØØ\ÙHšYŠÏŒJXœ™XZÈŽÚYŠONLN

ÏJJILL
JOOLJXœ™XZÈÚYŠËLŒLÊXœ™XZÈŽØONLLÎØœ™XZÈØØ\ÙHNšYŠKLŒLÊXœ™XZÈŽØONLLÎØœ™XZÈØØ\ÙHŽšYŠÏŒ_

JILL
KLŒLÊXœ™XZÈŽØONLLÎØœ™XZÈØØ\ÙHÎšYŠONLLÏŒJXœ™XZÈØOJOJJILL
OÊJOOLOÎLLÎŽLNŽŽLLØœ™XZÈØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈŸZYŠJÏŒJJ^ÚYŠONLLÍË

ÏJJILL
JOOLJXœ™XZÈÚYŠJËLŒLÊJ^ØONLLÎØœ™XZÈ__XONLNŸZYŠVÛ
ÌLŒ—O\‹VÛ
ÎMŒ—OXK
O[
ÌŽLLN
ÎMŸ
KÏL]
K
ÌŒ
JXœ™XZÈ_ZYŠOY‹LL_I™ÖÌLÌÌM—J^ÝžÜŽžÜÎœÝÚ]Ú

	™VÙVÍÌNL—JÌLŒ—JKMŸ
^ØØ\ÙHšYŠOŒJXœ™XZÈŽÚYŠÏNLN

JJILL
JOOLJXœ™XZÈÚYŠ‹LŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHNšYŠKLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHŽšYŠOŒ_

JILL
KLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHÎšYŠÏNLLOŒJXœ™XZÈØÏJÏJJILL
OÊÊOOLOÎLLÎŽLNŽŽLLØœ™XZÈØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈŸZYŠJOŒJJ^ÚYŠÏNLLÍË

JJILL
JOOLJXœ™XZÈÚYŠJ‹LŒLÊJ^ØÏNLLÎØœ™XZÈ__XÏNLNŸZYŠVÛ
ÎŒ—O\‹VÛ
ÎŒ—OXË
[
ÌŽLLLL
Î
KÏL]
‹
ÌŒ
JXœ™XZÈ_]žÜŽžÜÎœÝÚ]Ú

	™VÙVÍÌNL—JÌLŒ—JKMŸ
^ØØ\ÙHšYŠOŒJXœ™XZÈŽÚYŠÏNLN

JJILL
JOOLJXœ™XZÈÚYŠ‹LŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHNšYŠKLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHŽšYŠOŒ_

JILL
KLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHÎšYŠÏNLLOŒJXœ™XZÈØÏJÏJJILL
OÊÊOOLOÎLLÎŽLNŽŽLLØœ™XZÈØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈŸZYŠJOŒJJ^ÚYŠÏNLLÍË

JJILL
JOOLJXœ™XZÈÚYŠJ‹LŒLÊJ^ØÏNLLÎØœ™XZÈ__XÏNLNŸZYŠVÛ
ÍŽŒ—O\‹VÛ
ÍŒ—OXË
[
ÌŽLLLÎKHM
KÏL]
‹
ÌŒ
JXœ™XZÈ_Y[ÙHOY‹LL_ÝžÜŽžÜÎœÝÚ]Ú

	™VÙVÍÌNL—JÌLŒ—JKMŸ
^ØØ\ÙHšYŠOŒJXœ™XZÈŽÚYŠÏNLN

OJJILL
JOOLJXœ™XZÈÚYŠKLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHNšYŠKLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHŽšYŠOŒ_

JILL
KLŒLÊXœ™XZÈŽØÏNLLÎØœ™XZÈØØ\ÙHÎšYŠÏNLLOŒJXœ™XZÈØÏJOJJILL
OÊJOOLOÎLLÎŽLNŽŽLLØœ™XZÈØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈŸZYŠJOŒJJ^ÚYŠÏNLLÍË

OJJILL
JOOLJXœ™XZÈÚYŠJKLŒLÊJ^ØÏNLLÎØœ™XZÈ__XÏNLNŸYVÛ
ÍLŒ—O\‹VÛ
ÍŒ—OXË
O[
ÌŽLLŒN
Í
KÏL]
K
ÌŒ
_

ŠO
VÛ
ÌÌŒ—O\‹LK
O[
ÌŽLL‹
ÌÌŸ
K]
K
ÌMÍŸ
_
]
LÌË
ÌŒ
KVÌÌÌÍWOLÊJKVÛ
ÌŒ_
VÛ
ÌMŒ—OPK
O[
ÌŽLLÌË
ÌMŸ
K
ÏT]
K
ÌŒ
J_]
LÍË
ÌŒ
KVÌÌÌÍWOLŠJ_\™]\›ˆVÛ
ÍŒ—O[
ÌŒVÛŒ—O[
ÌÎ
‹LÍŽ
K[
ÌÌJ
JHOL_
ŠHOLJI‰ŠOLKÌ‰VÝ
ÌLŸJ_
OXÊK_Y[˜Ý[ÛˆØJK‹J^Ý˜\ˆ‹LÏLLLOLLOLÒ[R
ËMÖÛŠÍŒWOLVÛŠÍŒ—OLVÛŠÍŒ—OLVÛŠÌÌŒ—OLVÛŠÌÍŒ—OLVÛŠÌŒ—OLVÛŠÌŽŒ—OLVÛŠÌMŒ—OLVÛŠÌŒŒ—OLVÛŠÎŒ—OLVÛŠÌLŒ—OLVÛŒ—OLVÛŠÍŒ—OLPNÙNžÙ›ÜŠÎÊ^ÝžÜŽžÚYŠ

Ï]VÌJJHOMŽJ^ÚYŠ
ÊHOLÌŠXœ™XZÈŽÚYŠI‰ŠÖÓ
ÏXKKOJ
O[P_
JOLMNOÌMNN˜JJØ_OL
KOMŒÉœŠXœ™XZÈØœ™XZÈ_YÖÌOLL_[[
Ì_ØÛÛ[Y_Xœ™XZßZYŠIœŠ^ÝšYŠ
[L_
OŒOŒ
XÏXNÙ[ÙH›ÜŠÏXNÎÊ^ÚYŠ
NL‰VÌJHOLLŽ
Xœ™XZÈÚYŠÏXÊÌ_J
[L_
OŒPOŒ
JXœ™XZßYXKL_Y[ÙHXKÏXNÚYŠ
JHOLJY›ÜŠÎÊ^ØOYŽÝšYŠJ
[L_
OŒOŒ
JY›ÜŠÎÊ^ÚYŠ
NL‰VÌJHOLLŽ
Xœ™XZÈÚYŠÏXÊÌ_J
[L_
OŒPOŒ
JXœ™XZß]šYŠJ
[L_
OŒOŒ
JY›ÜŠÎÊ^ÚYŠ
NL‰VÌJHOLLŽ
Xœ™XZÈÚYŠÏXÊÌ_J
[L_
OŒPOŒ
JXœ™XZßZYŠXKLŸJ
JOŒŠJXœ™XZßZYŠ
ÊOL
YLÙ[Ù^ÚYŠLÉŠJOJOXËL_
OŒMÍJJÌ_
KOLÏLOŒLÊY›ÜŠOKM	™‹OLÒO[
ØßÖØÊÛŸO]VÌWKÖÌWOLÌ‹OJL_ÊJÛÖÛŠÚO]VÌWKÖÌWOLÌ‹OJLŸÊJÛÖÛŠÚO]VÌWKÖÌWOLÌ‹OJLßÊJÛÖÛŠÚO]VÌWKÖÌWOLÌ‹ÏXÊÍ
JHOJ
OXJÍ
JNÊNÚYŠ
Y›ÜŠØO[
ØßÖØÊÛŸO]VÌWKÖÌWOLÌ‹ÏXÊÌ_

HOJ
OPJÌ_
JNÊNß_ZYŠÖÛŠÙŸOLMMLŒ	œ‹JLL‰œŠ_VÌ
O[L_
WHOLL_
ÖÌWOLLŒJKÏMM‰œŠ^ÙNžÝžÜŽžÚYŠ

OYVÝ
ÌŒLŒ—JJHOLNMŠ^ÚYŠ
JHOLŽŽ
Xœ™XZÈŽÚYŠÖÌWOLŽ	ŠOYÖÌ
[LŸ
WJJXœ™XZÈNÚYŠYVÝ
ÍŒÌŒ—JPOHHJJJJNÙ[Ù^ÚYŠ

YVÝ
ÍŒŒ—JJOŒ	‰ŠOPK\
KLOŒŒM
Xœ™XZÈNÐOLLŽ	VÌÍ
Ê
Ð_
__ZYŠPJXœ™XZÈNÚYŠOYÖÌWKYVÝ
ÍŒLŒ—JPOHHJJJJNÙ[Ù^ÜÎžÚYŠ

YVÝ
ÍŒŒ—JJOŒ
^ÚYŠ
OPK\
KLOŒMJXœ™XZÈÎØœ™XZÈ_ZYŠ
JO
Xœ™XZÈ_POM	VÌÍ
Ê
Ð_
__ZYŠPJXœ™XZÈNÐOYÖÛLßNÜÎžÚYŠYVÝ
ÍŒÌŒ—JPOHHJJJJNÙ[Ù^ÛÎžÚYŠ

YVÝ
ÍŒŒ—JJOŒ
^ÚYŠ
OPK\
KLOŒMJXœ™XZÈÎØœ™XZÈßZYŠ
JO
Xœ™XZÈßPOLLŽ	VÌÍ
Ê
Ð_
__ZYŠJXœ™XZÈ_YÖÌO]VÌWKÖÌWO]VÌ—KÖÛ
Ì_OLÌŽØœ™XZÈ_ZYŠYÖÛLŸKOYVÝ
ÍŒÌŒ—JPOHHJJKŠJNÙ[Ù^ÜÎžÚYŠ

OYVÝ
ÍŒŒ—JJOŒ
^ÚYŠ
Y‹P_
KLOŒMJXœ™XZÈÎØœ™XZÈZYŠ
ŠO
Xœ™XZÈPOLLŽ	VÌÍ
Ê
ÙŸ
__ZYŠPJXœ™XZÈÚYŠYÖÌWKOYVÝ
ÍŒŒ—JPOHHJJKŠJNÙ[Ù^ÚYŠ

OYVÝ
ÍŒŒ—JJOŒ
^ÚYŠ
Y‹P_
KLOŒLMJXœ™XZÈY[ÙHYŠ
ŠO
Xœ™XZÈÐOL‰VÌÍ
Ê
ÙŸ
__ZYŠPJXœ™XZÈØÏVœŠÍÍÌKLßÊOÌŒ˜ÎØœ™XZÈ_XÏYVÝ
ÌŒŒ—OÌŒ˜ÎØœ™XZÈ_JVÌWOONN_
]VÊO[LŸ
JÌ_O
VÌW_ŠOOLŽMMM
ŸVÌWJOOLŽLŽ_
VÌ
O[LŸ
W_VÐJÌ_O
OOLŽLÌ_VœŠLMKLßÊ_
VÌ
O[LŸ
W_VÐJÌ_O
OOLŽMMLVÌWOOLLMßVœŠÎM_J_
VÌ
O[M
W_VÐJÌ_OVÐJÌŸOMŸVÐJÌßO
OOLMÌÍLŽÌMM
VÌW_VÐJÌ_OVÐJÌŸOMŸVÐJÌßO
OOLMÌÍMMLŽLŠJI‰ŠÏLŒ
_LM‰˜É‰Š\ŠVÝ
ÌŒŒ—K
K	VÌNÎI‰žšJŽË‹VÍÌNMWJJ_\™]\›ˆVÝ
ÎNŒ—_JŒ	œŠ_
VÝ
ÎNŒ—OLJK–ÛŒWHOLLMI‰–œŠ‹LÊ_
ßN
K[‹HMVÌ—OOLÎOÍMLÌI˜Î˜ßY[˜Ý[ÛˆJK‹K‹Ë‹
^Ý˜\ˆKLOLLÏLLOLL™OLÙOL™OLÒRORLLLŸLŒMÍÍÉœÙNžÚYŠHJ_ŠK
_
OLŒMÍÍÉ›ŠOÑKLŒMÍNLLŒŒMÍMLN•
_JY‰Š
ZLŒMÍNLLŸ
JOOKLŒMÍNLLÛÎŠŠOOKLŒMÍNLL‰ˆHJŠ_ŒŒŒMÍMLN
J^ÚYŠJXIŠJOOLŒMÍNLLÕ‘OŒŒMÍNLLŠJ^ÙXKLÌÍŽ‹PKÏ\ŽØœ™XZÈ_ZYŠJY‰Š
OOLŒMÍNLLÈJÊNšŒŒMÍNLLŠJ^ÜLÌÍŽØœ™XZÈ_ZYŠJ__ŒMÍNLL—‘_ŠJ^ÓÏXKJOHJW›W™Ÿ—˜ß—œ‹LŒMÍÍ
JOÌ“ËXOÌŒMÍL›‹XOÌKÏXOÌœŽØœ™XZÈ_ZYŠJŸŒMÍNLL—šÊJXœ™XZÈNÚYŠJ__ŸJJ^ÚYŠŸß
Xœ™XZÈNÛ	PKÉ\‹‰XK	[ŽØœ™XZÈ_ZYŠJŸß
J^ÛPKÏ\‹XK[ŽØœ™XZÈ__QOJ\™OJÏJ
OOJJJIŠJOOJŠOÊŠOOJÊIOŒŒŒÏŒ“É˜OŒŒŒ‘OŒ
OÛKUØÎœ‹ÙOSÏUÜ›‹UÙŽ˜KMMLÍI“ËO\™OØN™‹™O[\™OÛŽœÏ[ŒM‰ŒÌÍË
OXÙOŒM‰ŒÌÍÊ_
[HJŠK[ÑN•[M‹JJÎMŸK‹‹
[ŠÊ

[YJÕŽ’ŠJJOOLÌÛYJ
JÌÌŸœ
_
KLM_
KYVÒJÌLŒ—KYVÒJÌLŒ—KYVÒJÌLŒ—KOLM‹[ŸOYVÒJÎMŒ—JK\™OÐN›Ï\™OÜŽ˜ËXKMMLÍI˜™Kß
POHJŸ
KPOÛ™‹POM‹JJÎË‹
OPJÊ

[YJØÎœ
JJOOLÌÛYJ
JÌÌŸ›Š_
KLM_
KÏLM‹P_YVÒJÎŒ—KYVÒJÎLŒ—KÏYVÒJÎŒ—KYVÒJÎŒ—JK\ßŒŽKOYßÏŒŽKŸMLŽUßŒŽKRßŒŽK™OXÙW˜™KXÏßŒŽKO[Ë
ÊHOJJI‰Š
UKSß
OŒŒLÏÊOLLLOLJNŠJKHMK‹K‹LŽ[
KÜŠJÍK‹K‹
KOYVÒJÍMŒ—KYVÒJÍŒŒ—KYVÒJÍLŒ—KOYVÒJÍŒ—_HJVÒJÍŒ—_VÒJÍÌŒ—_VÒJÍŽŒ—_VÒJÍÍŒ—JJJKXK[‹ÏY‹MLŽUßOŒŽKQOËO[ŽÝšYŠ
™JO
^ÚYŠLÏLLLJ•ŸW“ß‘_—’ŠJXœ™XZÈNÚYŠOU‹UQKJ
Œ•Œ
JÚ
_JSËP_
KJÏJ
OOJJI•Œ•ŒŒ‘OŒ
_POJ‹J
OŒ“ÏŒ
JÜŸ
_
KJŒÏŒ
_OŒLŽÊXœ™XZÈÛPOHJŸ
KÏPOØN™‹POM‹JJÌÌŸK‹‹OJOPJÊ

[YJÛŽœ
JJOOLÌÛYJÊJÌÌŸ›
_
KLLŸ
KOUKP_YVÒJÍŒ—KYVÒJÍŒ—KOYVÒJÌÌŒ—KYVÒJÌÍŒ—_Y[ÙHZ
Ñ_J
OOJ
JOU
ÕŸ
OŒŒÛŠÌ_›ŠJI˜OŒŒŒŒ\ŠÒŸJOPJÓß
OŒÏŒÚ
Ì_šLMÍ‰ŠJPJÛ
OŒOŒÚ
Ì_š
I‰ŠOLI•
I›ŠOÌ_OŒKYÌ_ŒKOUJÌ_JIœ
OÌ_ŒK\Œ_
NÚYŠLOKLŒMÍÍ	˜ÙK
JOLÌÍÊY\‹LŒMÍNLLŸKLÏLÙ[ÙHYŠÏL
JOŒÓÏUNŠJJÌMŸK‹‹JÌLß
KÜŠKK‹‹KU_
KOYVÒOŒ—_HJVÒJÌMŒ—_VÒJÌŒ—_VÒJÌŒŒ—_VÒJÌŽŒ—JKYVÒJÍŒ—KYVÒJÎŒ—KYVÒJÌLŒ—JKMÉ˜KOJ
OYŽ_ŒÊJOOJ
ÏJOJÉ›ŠOŽ_OŒÊOŒŠJŒ
JØ_
OŒÐJÌ_JJI˜OŒ›ŒOŒ˜ÏŒO\Ÿ
Éœ
OŽ_ŒËQ_ŒÉMLÍ_ÏM‹POŒŠXJÐ_
OŒÜ
Ì_œ
ŠHOM
^ÚYŠUŠXœ™XZÈ_Y[ÙHXÊÊOL
_JOJJOOJ
ÏJO[
OŒŠ[
ÊLI›
_
OŒÚ
Ì_š
JIœŒ›ŒOŒ˜ÏŒ
OŒŠPJÙŸ
OŒÜ
Ì_œYVÝŒ—O[VÝ
ÍŒ—OXËVÝ
ÎŒ—OY‹VÝ
ÌLŒ—O\RJÌLLŸY[˜Ý[ÛˆJ
^Ý˜\ˆOLLOLLLÏLLÙNšYŠL
^ÛJO]N
JÊKN	ŠOYVÝMŒ—JJ_ÝšYŠJIJJ^ÚYŠJÉJ_
OXKJOYVØOŒ—J_
OŒVÍMÌMM—JXœ™XZÈNÚYŠ]
Ð_VÍMÌMM×OOJJJ^ÚYŠJÉŸŠOYVÛ
ÍŒ—JJJ\™]\›ˆVÍMÌMMO]VÛ
ÍŒ—OKL‰KVØJÍŒ—OL_›ÚY
VÝ
ØOŒ—O]
_Y[Ù^ÚYŠOŒLMJ^ÚYŠYVØJÎŒ—KOPOŒß

YVØJÌLŒ—JJOOJŠJ^ÙVÍMÌML—OYVÍMÌML—Iœ˜JL‹JNØœ™XZÈYVÛŠÌLŒ—O\‹VÜŠÎŒ—O[ŽØœ™XZÈZYŠYVØJÌŒ—K
JOOJ
OYVØJÌLŒ—JJJZYŠ
YVÊXJÌŒ
OŒ—J_
YVÊXJÌMŸ
OŒ—JJ^Ù›ÜŠØÏ[‹
YVÊJO\ŠJÌŒ
OŒ—J_
PJÌMŸYVÐJÌMŒ—JNÊNÙVØÏŒ—OLY[ÙHOLÙ[ÙHYVØJÎŒ—KVÜŠÌLŒ—OPKVÐJÎŒ—O\ŽÚYŠYŠXœ™XZÈÛYVØJÌŽŒ—NÜŽžÚYŠVÊLŒŽLLŠÊŠ_
OŒ—OOJJJ^ÚYŠVÜŒ—OPKJXœ™XZÈŽÙVÍMÌML×OYVÍMÌML×Iœ˜JL‹ŠNØœ™XZÈZYŠVÙŠÊVÙŠÌMŒ—OOJJOÌMŽŒŒ
OŒ—OPKPJXœ™XZÈZYŠVÐJÌŒ—OY‹
YVØJÌMŒ—JI‰ŠVÐJÌMŒ—O\‹VÜŠÌŒ—OPJKJYVØJÌŒŒ—JJXœ™XZÈÙVÐJÌŒŒ—O\‹VÜŠÌŒ—OP__ZYŠJOŒ[Œ
I‰ŒIŠOYVÛ
ÍŒ—JJ^ÝžÚYŠJ‰JJ^ÚYŠVÍMÌMNOOJ
J^ÚYŠVÍMÌMNOXKYVÍMÌMMWJÝVÍMÌMMWO]VØJÍŒ—OL_VÍMÌMM×HOJJJXœ™XZÈNÜ™]\›ˆVÍMÌMMOL›ÚY
VÍMÌMM×OL
_ZYŠVÍMÌMM×OOJ
J\™]\›ˆVÍMÌMM×OXKYVÍMÌMMJÝVÍMÌMMO]VØJÍŒ—OL_›ÚY
VÝ
ØOŒ—O]
NÝJN	JJÝÜŽšYŠOŒLMJ^ÚYŠYVÛ
ÎŒ—KOPOŒß

YVÛ
ÌLŒ—JJOOJŠJ^ÙVÍMÌML—OYVÍMÌML—Iœ˜JL‹JNØœ™XZÈŸYVÛŠÌLŒ—O\‹VÜŠÎŒ—O[ŸY[Ù^ÚYŠYVÛ
ÌŒ—K

OOJ
OYVÛ
ÌLŒ—JJJZYŠ
YVÊ[
ÌŒ
OŒ—J_
YVÊ[
ÌMŸ
OŒ—JJ^Ù›ÜŠØÏ[‹
YVÊJO\ŠJÌŒ
OŒ—J_
PJÌMŸYVÐJÌMŒ—JNÊNÙVØÏŒ—OLY[ÙHOLÙ[ÙHYVÛ
ÎŒ—KVÜŠÌLŒ—OPKVÐJÎŒ—O\ŽÚYŠŠ^ÛYVÛ
ÌŽŒ—NÜÎžÚYŠVÊLŒŽLLŠÊŠ_
OŒ—OOJ
J^ÚYŠVÜŒ—OPKJXœ™XZÈÎÙVÍMÌML×OYVÍMÌML×Iœ˜JL‹ŠNØœ™XZÈŸZYŠVÙŠÊVÙŠÌMŒ—OOJ
OÌMŽŒŒ
OŒ—OPKPJXœ™XZÈŸYVÐJÌŒ—OY‹
YVÛ
ÌMŒ—JI‰ŠVÐJÌMŒ—O\‹VÜŠÌŒ—OPJK
YVÛ
ÌŒŒ—JI‰ŠVÐJÌŒŒ—O\‹VÜŠÌŒ—OPJ__ZYŠVØJÍŒ—OL_VÝ
ØOŒ—O]VÍMÌMM×HOJJJXœ™XZÈÜ™]\›ˆ›ÚY
VÍMÌMMO]
_YVÛ
ÍŒ—OKL‰KVØJÍŒ—OL_VÝ
ØOŒ—O]ZYŠŒLMJ\™]\›ˆOLŒŽ
ÊN	
_
YVÍMÌML—JIŠLO
ŒÊJOÝYVÐJÎŒ—NŠVÍMÌML—O]‹PJKVÐJÎŒ—OXKVÝ
ÌLŒ—OXKVØJÌLŒ—OPK›ÚY
VØJÎŒ—O]
NÛLÌKŒLMÍÍÌŒMI‰ŠMŒŠÊ
ŒÎJO[YJŽ
JIŒJKJOJ_
_
KVØJÌŽŒ—O[‹VØJÌMŒ—OLVØJÌŒŒ—OLÏLŒŽLLŠÊŠ_ÝžÜŽžÚYŠ
YVÍMÌML×JIŠOLOŠJ^Ù›ÜŠ]

ŠHOLÌOÌKJŒ_
NŒ
KOYVØÏŒ—NÎÊ^ÚYŠPK
N	™VÐJÍŒ—JOOJ
JXœ™XZÈŽÚYŠO[ŒŽ_LKJOYVÊÏ\ŠÊ	J_
JÌMŒ—JJXœ™XZßYVØÊÌMŒ—OXKVØJÌŒ—O\ŸY[ÙHVÍMÌML×OP_‹VØÏŒ—OXKVØJÌŒ—OXÎÙVØJÌLŒ—OXKVØJÎŒ—OXNØœ™XZÈ]YVÜŠÎŒ—KVÝ
ÌLŒ—OXKVÜŠÎŒ—OXKVØJÌŒ—OLVØJÌLŒ—O\‹VØJÎŒ—O]]YVÍMÌMŒKL_VÍMÌMŒO]L___Y[˜Ý[ÛˆÙJKŠ^Ý˜\ˆKLLÏLLLOLLOLLÏLLOLÒXORLMÍŸÙNžÚYŠÌ‰JSÏ\‹J
ŠOŒJ_Ù[Ù^ÛUJLÌÌŠNÝžÜŽžÜÎžÚYŠ
JHOLŠ^ÚYŠ
Xœ™XZÈÎÐOLØœ™XZÈ_ZYŠÏ\ŠÌ_OJTÊ‹ÍŠJÌLÌÌMLŸ
JÍMŸUJLÍŒ
KÏUJLÌÌN
KUJLÍŠKUJLÍNJK
Xœ™XZÈŽØœ™XZÈSÏ\ŠÌ_OJTÊ‹ÍŠJÌLÌÌMLŸ
JÍMŸLY›ÜŠLOJ
YVÛMŒ—JJHOLÍÊŠOOLÎOÛŽŒ›‹OTÊ‹ÍŠJÌLÌÌŒÎÊ^ÚYŠ]JYVÛŒ—JJXœ™XZÈÜŽžÚYŠRJ^ÚYŠ

OOLÌŸNOŒJXœ™XZÈÚYŠ

HOMÊXœ™XZÈŽØœ™XZÈZYŠ
ŠHONL‰‰Š
OOJJJXœ™XZÈZYŠ[
ÍJ

Z\Š
Õ_
JÚ
JOMŠJXœ™XZß_ROLÖÚ
Ñ_OLTÊ‹ÍŠJÌLÌÌMŽLÝšYŠ
Y›ÜŠLOJ
YVÕMŒ—JJHOLÍÊŠOOLÎOÛŽŒ›ŽÎÊ^ÚYŠ]JYVÕŒ—JJXœ™XZÈÜŽžÚYŠQJ^ÚYŠ

OOLÌŸNOŒJXœ™XZÈÚYŠ

HOMÊXœ™XZÈŽØœ™XZÈZYŠ
ŠHONL‰‰Š
OOJJJXœ™XZÈZYŠU
ÍJ

Z\Š
Ú
JÛ
JOÍŠJXœ™XZßZYŠÖÛ
ÚOLJXßVØÏŒ—KMŒLL
J^Ù›ÜŠÒOJVØÏŒ—JÔÊKL
_
KMVÊÏXÊÍ
OŒ—KMŒLÊNÊJOL
ORKL_
_ZYŠTÊ‹ÍŠJÌLÌÌMLŸVÛŠÍŒ—ORKLLJYŸVÙŒ—KMŒLL
JY›ÜŠÛJVÙŒ—JÔÊL
_
KMVÊYŠÍ
OŒ—KMŒLÊNÙVÛŠÌLŒ—O[TÊ‹ÍŠJÌLÌÌMLŸÝžÜŽšYŠ
^Ù›ÜŠÜYÖÝ
ÎLÌN_K
YVÊŠJÜŒ—JI‰Š]
Ì_
ŠOOJŠJNÊNÜÎžÛÎœÝÚ]Ú
‹LÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈÎÙY˜][˜œ™XZÈßZYŠ\Š^ÝLØœ™XZÈ_Y›ÜŠLÜYÖÝ
ÎLÌLMŸK
YVÊŠJÜŒ—JI‰Š]
Ì_
ŠOOJŠJNÊNÜÎžÛÎœÝÚ]Ú
‹LÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈÎÙY˜][˜œ™XZÈßZYŠ\Š^ÝLNØœ™XZÈ_Y›ÜŠLÜYÖÝ
ÎLÌNMßK
YVÊŠJÜŒ—JI‰Š]
Ì_
ŠOOJŠJNÊNÜÎœÝÚ]Ú
‹LÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈÎÙY˜][˜œ™XZÈŸZYŠ\Š^ÝLŽØœ™XZÈ_]LßYVÛ
ÎŒ—OYVÌLÌLMMŠÊÊOŒ—KVÕŒ—OP_ZYŠÝ
LÍÍÍÍ‹LÌÌMŽ
KQÝ
JÎMŸLÌÌŒ
KÖØJÌMMßOYVÌÌÌŽLWKÖØJÌMMŸOYVÌÌÌŽLKYVÌÌÌŽWKVØJÌMLŒ—OLÖØJÌMNO]
ÊOŒ
Y›ÜŠÏLÎÊ^ÚYŠLKOTÊËÍŠJÌLÌÌMLŸVÌ
PJÌMŸ
WI‰•œŠ
I‰ŠÝ
LÍÍÍÍ‹
KLÖÌ—OLÖØJÌMNOLÖØJÌMMŒWOL
KVÌ
PJÍMŸ
WJ^ÜQÝ
‹
KYVÌÌÍÎWNÝšYŠVÌ
[ŠWJY›ÜŠÎÊ^ÚYŠ]Š]
Ì_
J^ÑÝ
ŠÌ_
NØœ™XZÈZYŠLJÊ]

JÝ
_]VÌJXœ™XZßY‰‰ŠÖÌLÍÍÍÍ—OL
_ZYŠ
YVÐJÎŒ—JI‰ŠÖØJÌMMŸO]
K
YVÐJÌLŒ—JI‰ŠÖØJÌMMßO]
K
YVÐJÍŒ—JI‰ŠÖØJÌMNO]
K
ÊOOJ
ÏXÊÌ_
JJXœ™XZßYVØJÌMŒ—O\‹VØJÌMŒ—OLLÍÍÍÍ‹
Y\ÊJÌMJÌMÌŸ
JOÞ˜JÊ_
O]VØJÌMMŸK]VÌLÍÌ—_

JHO]VÌLÍÌOÐNŒ
_
VØOŒ—O]VØJÍŒ—OLLÍÌ‹
OXJÌMŸLÍLÌËJKLLÍÍÍÍ‹JLÍÍÍÍ‹K
JJNNLŒËOLŠLÍÎ
I‰ŠÝ
LÍÎ
KOLLÌLÌŠ_\™]\›ˆXJÌMÍŸ_Y[˜Ý[ÛˆJJ^Ý˜\ˆ‹OLLLÏLLÜ]
Ð_ÙNžÝšYŠJIŠOYVÝ
ÍŒ—JJJ^ÚYŠJÉ˜JJXœ™XZÈNÐOJOYVÝŒ—JJÐ_ÜŽžÚYŠ

]X_
JHOYVÍMÌMM×J^ÚYŠOŒLMJ^ÚYŠYVÝ
ÎŒ—KOXOŒß

YVÝ
ÌLŒ—JJHOJ
JXœ™XZÈŽÙVÍMÌML—OYVÍMÌML—Iœ˜JL‹JNØœ™XZÈZYŠYVÝ
ÌŒ—K

OYVÝ
ÌLŒ—JJOOJ
JZYŠ
YVÊ]
ÌŒ
OŒ—J_
YVÊ]
ÌMŸ
OŒ—JJ^Ù›ÜŠØÏ[
YVÊJO[ŠJÌŒ
OŒ—J_
XJÌMŸYVØJÌMŒ—JNÊNÙVØÏŒ—OLY[ÙHOLÙ[ÙHYVÝ
ÎŒ—KVÛŠÌLŒ—OXKVØJÎŒ—O[ŽÚYŠYŠXœ™XZÈÛYVÝ
ÌŽŒ—NÜÎžÚYŠVÊLŒŽLLŠÊŠ_
OŒ—OOJ
J^ÚYŠVÛŒ—OXKJXœ™XZÈÎÙVÍMÌML×OYVÍMÌML×Iœ˜JL‹
NØœ™XZÈZYŠVÙŠÊVÙŠÌMŒ—OOJ
OÌMŽŒŒ
OŒ—OXKXJXœ™XZÈZYŠVØJÌŒ—OY‹
YVÝ
ÌMŒ—JI‰ŠVØJÌMŒ—O[‹VÛŠÌŒ—OXJKJYVÝ
ÌŒŒ—JJXœ™XZÈÙVØJÌŒŒ—O[‹VÛŠÌŒ—OXNØœ™XZÈZYŠÉŸŠOYVÜŠÍŒ—JJXœ™XZÈÜ™]\›ˆVÍMÌMMOPKVÜŠÍŒ—OKL‰˜KVÝ
ÍŒ—OL_K›ÚY
VÜŒ—OPJ_YVÛ
ÌLŒ—O[‹VÛŠÎŒ—O[]žÚYŠJ‰ŠOYVÜŠÍŒ—JJJ^ÚYŠVÍMÌMNOOJŠJ^ÚYŠVÍMÌMNO]OYVÍMÌMMWJÐ_VÍMÌMMWOPKVÝ
ÍŒ—OL_KVÍMÌMM×HOJ
JXœ™XZÈNÜ™]\›ˆVÍMÌMMOL›ÚY
VÍMÌMM×OL
_ZYŠVÍMÌMM×OOJŠJ\™]\›ˆVÍMÌMM×O]OYVÍMÌMMJÐ_VÍMÌMMOPKVÝ
ÍŒ—OL_K›ÚY
VÝ
ÐOŒ—OPJNÐOJN	˜JJÐ_ÜŽšYŠOŒLMJ^ÚYŠYVÜŠÎŒ—KOXOŒß

YVÜŠÌLŒ—JJOOJ
J^ÙVÍMÌML—OYVÍMÌML—Iœ˜JL‹JNØœ™XZÈŸYVÛ
ÌLŒ—O[‹VÛŠÎŒ—O[Y[Ù^ÚYŠYVÜŠÌŒ—K
ŠOOJ
OYVÜŠÌLŒ—JJJZYŠ
YVÊ\ŠÌŒ
OŒ—J_
YVÊ\ŠÌMŸ
OŒ—JJ^Ù›ÜŠØÏ[‹
YVÊJO[
JÌŒ
OŒ—J_
XJÌMŸYVØJÌMŒ—JNÊNÙVØÏŒ—OLY[ÙHOLÙ[ÙHYVÜŠÎŒ—KVÛŠÌLŒ—OXKVØJÎŒ—O[ŽÚYŠŠ^ÛYVÜŠÌŽŒ—NÜÎžÚYŠVÊLŒŽLLŠÊŠ_
OŒ—OOJŠJ^ÚYŠVÛŒ—OXKJXœ™XZÈÎÙVÍMÌML×OYVÍMÌML×Iœ˜JL‹
NØœ™XZÈŸZYŠVÙŠÊVÙŠÌMŒ—OOJŠOÌMŽŒŒ
OŒ—OXKXJXœ™XZÈŸYVØJÌŒ—OY‹
YVÜŠÌMŒ—JI‰ŠVØJÌMŒ—O[‹VÛŠÌŒ—OXJK
YVÜŠÌŒŒ—JI‰ŠVØJÌŒŒ—O[‹VÛŠÌŒ—OXJ__ZYŠVÝ
ÍŒ—OL_KVÝ
ÐOŒ—OPKVÍMÌMM×HOJ
JXœ™XZÈÜ™]\›ˆ›ÚY
VÍMÌMMOPJ_YVÜŠÍŒ—OKL‰˜KVÝ
ÍŒ—OL_KVÝ
ÐOŒ—OP_ZYŠOŒLMJ\™]\›ˆOLŒŽ
ÊN	J_
YVÍMÌML—JIŠOLO
OŒÊJOÐOYVØJÎŒ—NŠVÍMÌML—OP_‹OXJKVØJÎŒ—O]VÐJÌLŒ—O]VÝ
ÌLŒ—OXK›ÚY
VÝ
ÎŒ—OPJNÛLÌKOŒLMÍÍÌŒMI‰ŠMŒŠÊ
OŒÎJO[YJOŽ
JIŒJKJOJ_
_
KVÝ
ÌŽŒ—O[VÝ
ÌMŒ—OLVÝ
ÌŒŒ—OLÏLŒŽLLŠÊŠ_ÝžÚYŠ
YVÍMÌML×JIŠOLO
J^Ù›ÜŠPO


HOLÌOÌKJŒ_
NŒ
KOYVØÏŒ—NÎÊ^ÚYŠXK
N	™VØJÍŒ—JOOJJJXœ™XZÈÚYŠO[ŒŽ_LKJOYVÊÏ[ŠÊ	˜J_
JÌMŒ—JJXœ™XZßYVØÊÌMŒ—O]VÝ
ÌŒ—O[ŸY[ÙHVÍMÌML×OX_‹VØÏŒ—O]VÝ
ÌŒ—OXÎÜ™]\›ˆVÝ
ÌLŒ—O]›ÚY
VÝ
ÎŒ—O]
_POYVÛŠÎŒ—KVÐJÌLŒ—O]VÛŠÎŒ—O]VÝ
ÌŒ—OLVÝ
ÌLŒ—O[‹VÝ
ÎŒ—OP__Y[˜Ý[Ûˆ™J
^Ý˜\ˆOLLOLLLÏLLLOLLOLLÏLÚYŠJOYÖÎLWJJ\™]\›ˆÚYŠ^˜JJJ^ÚYŠ]VÎL—J\™]\›ˆÚYŠVÝ
Ì_J^ÚYŠ]VÎL×J^ÛHHJ
]VÝ
Ì_JJNÙNšYŠ‰‰Š
O\ŸVÌO
JHOJ
]VÎL—_VÎLWO
JJY›ÜŠ]
Ì_ÎÊ^ÚYŠHHJ
O]VÊ\ŠJÌ_JJKXJXœ™XZÈNÚYŠ]
Ì_
ŠOOJ
OX_O	LŽ
JJXœ™XZß\™]\›ˆÝŒZYŠVÝ
ÌŸJ^ÚYŠ]VÎLJ^Ü]
ÌŸHHJ
O]VÝ
ÌŸJJNÙNšYŠI‰Š
O]VÝ
Ì_OMŸVÌOO
JHOJ
]VÎL—OMŸVÎLWOVÎL×O
JJY›ÜŠÎÊ^ÚYŠ\ŠÌ_HHJ
O]VÜŠÌ_JJKXJXœ™XZÈNÚYŠ]
ŠOOJ
OJ_JO
JJXœ™XZßY[ÙH\ŽÜ™]\›ˆÝLŸŒZYŠVÝ
ÌßJ^ÚYŠ]VÎLWJ^Ü]
ÌßHHJ
O]VÝ
ÌßJJNÙNšYŠI‰Š
OP_VÝ
Ì_OMŸVÌOVÝ
ÌŸO
JHOJ
J]VÎLW_VÎL—OVÎL×OMŸVÎLO
O
LŽ	
OŽ	LŽŒ
JJY›ÜŠÎÊ^ÚYŠ\ŠÌ_HHJ
O]VÜŠÌ_JJKXJXœ™XZÈNÚYŠ]
ŠOOJ
OX_O
JJXœ™XZßY[ÙH\ŽÜ™]\›ˆÝLßŒY]\RLLMŸVÊ\
ÌL
OŒ—OLVÝ
ÍŒ—OLVÊ\
ÌL
OŒ—OLVÝ
ÍŒ—OLVÜ
ÌLÌŒ—OLVÜ
ÌLÍŒ—OLVÜ
ÌLŒ—OLVÜ
ÌLŽŒ—OLÙNžÝžÜŽžÜÎžÚYŠO]VÎLWJ^Ù›ÜŠÎÊ^ÚYŠ]VÛ
ÙŸJXœ™XZÈÚYŠ[
Ì_VÊ
MIJOŠJÜŒ—O[VÊJ
ÌL
JÊOŒÉŒŽ
_
OŒ—OYVÝŒ—_OKJO]VÛ
ÎL_JJXœ™XZßZYŠLKOKLKŒŒJXœ™XZÈßY[ÙHOKLKLNØÏKLKLNØœ™XZÈŸY›ÜŠOLKOLNÎÊ^ÜÎšYŠ

Ï]VÎLJÊJÒ_
_JJHOJ
]VÝ
ÎL_JJJ[ŒÏŒÊO]R_]OLJNŠO\‹\ŠÌ_OLKOLJNÙ[Ù^ÚYŠ
JOOJJJ^Ü\ŠØ_OLNØœ™XZÈßPOPJÌ_ZYŠJŒŠ\ŠÐ_
OŒ
JXœ™XZßZYŠLKÏKLKŒLJ]XNÙ[Ù^Ù›ÜŠLLKOLNÎÊ^ÜÎšYŠ

O]VÎLJÊJØß
_JJHOJ
]VÜŠÎL_JJJZŒ‘OŒÊ\‹Xß\‹OLJNŠÏ]]
Ì_LKOLJNÙ[Ù^ÚYŠ
JOOJŠJ^Ý]
ÛŸOLNØœ™XZÈßPOPJÌ_ZYŠJŒŠ]
Ð_
OŒ
JXœ™XZß]XK[Ÿ_Y›ÜŠO]œŠLK
OJXÊÌOŒ’JÌOŒ
OÜŽJJÎL_OJ]ØÎ’JJÌ_
OÊOJ
_š
Û
OŒŒÚ
JÌ_L
N›[X_Ï[L_MŒßÏLYŽÎÊ^ÚYŠJ‹]Œ[Œ
JZYŠPÜÊ‹
J^ÚYŠ\‹‹]ŒŒ
Xœ™XZÈY[ÙHYŠÕÜ]VÝ
ÓßKO[ÜŽžÚYŠVÊ
ÌL
JÊŒÉŒŽ
OŒ—Oœ‰ŒJZYŠ

YVÊŠJÜŒ—JJOOJ
J^ÜÎžÚYŠO]VÊJOQJOŒ˜ÏŒÐN˜ÊJÎL_JY›ÜŠÎÊ^ÚYŠVÝ
ÜŸHOJMI’JJXœ™XZÈÎÚYŠJO]VÊ\ŠÌ_
JÎL_JJXœ™XZßY›ÜŠÎÊ^ÚYŠOŒXÏŒ
Xœ™XZÈNÚYŠVÊOPKL_
JÎL_HO]VÝ
Ð_JXœ™XZßPOXKÏ[ŽØœ™XZÈŸPO\‹ZY[ÙHOJ[\Ÿ
OŒ˜ÏŒÜŽ˜ÎØÏL]]
Ð__]LR\
ÌLMŸ]___\™]\›ˆŸY[˜Ý[ÛˆÙJK‹K‹
^Ý˜\ˆË‹KLOLLÚYŠXÏRMMŒÖØÊÍOLÖØÊÌMOLÖØÊÌLŒOLLÍ	›PKTÊOJJKÌLL
_IŠOM	VÝ
ÌLŸOÊJOŽNN_Œ
_
JOŽNJ^ÙNžÝžÜŽžÚYŠJ\ŠJ^ÚYŠT]
LŒ‹ÊÌÌ
JXœ™XZÈŽØœ™XZÈ_ZYŠŠXœ™XZÈZYŠ]
LŽLKÊÌÌ
JXœ™XZÈ_T]
LÌKÊÌÌ
_Z[
JOYLß
[J	VÝ
ÌL_J_KL™LÏŒŽMMÌNM‰‰ŠÖØÊÌŒOLJJOŒ
KÌLOLMŒÎ	™VÝ
ÌLŒ—OÌ›ŠÌ_J
OŒ
ILYLß
_ÊÌÌŸ
_J‹VÝ
ÌŒLŒ—OOLŽLÍLŒŠJOÊVÝ
ÌLŒ—O˜IŒJOÎŒÊÌŒ
K‰VÝ
ÌL_OÊVØÊÌLŒ—OLMKVØÊÌLŒ—OLMKVØÊÌLŒ—OXÊÌŒVØÊÎMŒ—OXÊÌÌ‹
ÊÌMLÍŒKÊÎMŸ
JNŠVØÊÎLŒ—OLMKVØÊÎŒ—OLMKVØÊÎŒ—OXÊÌÌ‹VØÊÎŒ—OXÊÌŒ
ÊÌMLÍŒKÊÎ
JKOLKIŠHJ
OQKTÊL
_
J_J_
ÖØÊÌÌOL
KL_
JKÖØÊÌŒOLÙNšYŠJ’IŠJOL
JZYŠJ	VÝ
ÌLŸJ_JIšVØÊÌMJ_]
LÊÌLŒ
K\
M‰VÝ
ÌL_OÌ™Š_
VØÊÍŒ—OQK
OXÊÍMLÍKËHM
KT]
KÊÌŒ
KJM‰™VÝ
ÌLŒ—J_
ŠOLXJÊÌŒLÌÌL
JKOLKIŠ’_HJJJJ^ÝžÜŽžÜÎžÛÎžÚYŠJLÌLÌ‰™VÝ
ÌLŒ—J_Iš
JHOLJ^ÚYŠŸ
VØÊÍŒ—OQK
OXÊÍMLNKÊÍ
KT]
KÊÌŒ
JK
VØÊÌÌŒ—OQK
OXÊÍMLLËÊÌÌŸ
K]
KÊÌŒ
JJXœ™XZÈÎÚYŠ
JHOLJXœ™XZÈŽØœ™XZÈßZYŠU
Xœ™XZÈßYÖØÊÌÌOLØœ™XZÈZYŠOLK	VÝ
ÌL_JXœ™XZÈ_TJK‹ÊÌŒ
_XOL_Y[ÙH]
ÍKÊÌŒ
NÙVØÊÌŽŒ—OXÊÌÌVØÊÌŒ—OXÊÌŒVØÊÌŒŒ—OXÊÌLŒVØÊÌMŒ—OXÊÌM
ÊÍLLNKÊÌMŸ
_Y[ÙH[ÙÖØÊÌLÌŸOLÙNžÝžÚYŠ
ŠOŒ
LM‰VÝ
ÌL_I‰Œ‰š
JIš
_‰‰ŠJOLLJ	ŠOYVÝ
ÌLŒ—JJIŠJÎŒ	˜J_ŒŽJ_]
LÊÌLÌŸ
KJIšVØÊÌMJ_JLŽ	™VÝ
ÌLŒ—J__]
LÊÌLÌŸ
JKÖØÊÌÌÍŸOLÙ[ÙHYŠÖØÊÌÌÍŸOLY‰˜JXœ™XZÈÚYŠÊYVÝ
ÌLŒ—KOJŠOÊ›‰ŒJOÎŒ
NŠO\ÌÎŒ‹OLÌ‰›

JOLÌIšØNN˜JKYVÝ
ÌLŒ—JKOJŠOOLI‰™VÝ
ÌŒLŒ—OOLŽLÍLŒNKLMÍ‰›	‰ŠOLMŸKOJJOŒIšØNJKTJ‹‹M‰šKÊÌÌÍŸ
_JLŽ	VÝ
ÌLJJXœ™XZÈNÙÖØÊÌLÌŸOLØœ™XZÈ_]VÌLÌÌLI‰Š

Q]
ÊÍ
JJOLVÊ]
Øß
JÍßOOLL	‰ŠÖÝ
ÍßOL
KÝ
ÊÌÌÍŸLÌÌL
J_YVØÊÎŒ—OLMKVØÊÌLŒ—OXÊÌÌÍ‹VØÊÍŒ—OXÊÌLÌ‹VØÏŒ—OXÊÍ
‹LLLKÊKXÊÍMŒY[˜Ý[Ûˆ™J
^Ý˜\ˆK‹KLLÏLLLOLLOLLÏLLOLÙ›ÜŠYVÌÌŽMÌ—KVÛŠÍŒ—OLŽLM‹VÛŠÍŽŒ—OMLVÛŠÎMŒ—OLVÛŠÌLŒ—OLVÛŠÌLŒŒ—ONLVÛŠÌLŒ—OLLVÛŠÌLLŒ—OMVÛŠÌLMŒ—OLM‹VÛŠÌLŒ—OMKVÛŠÌLŒ—OLVÛŠÎŒ—OLLVÛŠÎŒ—OMYVÍLÍMKVÛŠÌLÌŒ—OLVÛŠÌLÍŒ—OLVÛŠÌLŽŒ—O[VÛŠÌMŒ—OLVÛŠÌMŒ—OLVÛŠÌMŒ—OLVÛŠÌMLŒ—OLVÛŠÌMMŒ—OLVÛŠÌMŒŒ—OLVÌÍÍWOMLVÛŠÎLŒ—OL‹VÍLÌOLVÍLÌWOLVÍLÌ—OLVÍLÌ×OLVÍLOLVÍLWOLVÍL—OLVÍL×OLVÍLLOLVÍLLWOLVÍLL—OLVÍLL×OLÏKLËŒMMNLLÍNMÎLËÊÙVÍLÍMKVÌMŽWOXËKLŠ˜ËVÌMÌO\OJÏUÜŠŒ
˜ÊJJ‹XËVÌMÍOPKVÌMÎWOPKVÌMOPKÏJXÊ™ØJ™LÊœ
JJÜVÌMÌ×OXËVÌMÎOXËVÌM×OXËLKXËPKVÌMÌ—O\VÌMÍ×O\VÌM—O\VÍLL—OLVÍLL×OLVÍLLOLVÍLLWOLVÌMWOPKVÌMOXËVÍLLL—OLVÍLLL×OLVÌM×O\VÍLLLOLVÍLLLWOLVÌMMOPKVÌML×OXËVÍLLŒ—OLVÍLLŒ×OLVÌML—O\VÍLLŒOLVÍLLŒWOLVÌMNWOPKVÌMNOXËVÍLLÌ—OLVÍLLÌ×OLVÌMM×O\VÍLLÌOLVÍLLÌWOLVÌMOPKVÌMŒ×OXËVÌMŒ—O\VÍLM—OLVÍLM×OLVÍLMOLVÍLMWOLVÌMŽWOPKVÌMŽOXËVÌM×O\VÍLML—OLVÍLML×OLVÍLMLOLVÍLMLWOLVÌMÍOPKVÌMÌ×OXËVÌMÌ—O\YVÌÌŽMÌ—KLÚÖÊOJJJÜŸ
JÌŒÍŒWOLM‹ÖÒJÌMŒWOLM‹]VÛ
ÌLLÍÍŸOKÖÒJÌMŒWO[‹ÖÒJÌNŒWO[‹ÖÒJÌŒŒWO]VÛ
ÌLLÎ_OKVÊJ[ŠJÜŸ
JÌÌŒ—OYVÙŠÌLMŒ—KVÛŠÌÌŒ—OLÖÒJÌŒNŒWOLVÙŠÌŒMŒ—OJÊVÙŠÌLMMŒ—KŒŒL
JKÙVÍLÍMK

[
Ì_
JHONNÊNÙ›ÜŠÏYVÌÌŽMŒWKLO\ŠÌÍÎÊ^ÚYŠZOSËO[

YVÊJ[ŠJÌLÌN
OŒ—JJOOKLI‰ŠNLËVÛŒ—ONLËI‰ŠVÌLÌN
ÊŠOŒ—OYVÙŠÌLÌNÍŒ—JJKÏYVÌLÌN
ÊŠOŒ—KJ
ŠOJ
J
KÎ
J_

Z[Ÿ
JOL
[ŠÌ_[‹I•	‰ŠÖÌÍ
ÊŠÜŸ
_OJJOLMOÌMN‘KYŠK
ŠOOJ
JJJY›ÜŠSËQ_ÙJ
Ê[ŸŠJKÊ
_
JÑ_ÖÛ
Ø_OJŠOLMOÌMN™‹OJ
Ê
[
Ì_
K[ŸŠJKÊ
_
JÑ_ÖÙŠØ_OJJOLMOÌMN•K

HOJ
[
ÌŸ
JNÊNÚYŠRJÌŸJOŒL
JXœ™XZß[YVÌÌŽMÌ—KVÛ
ÎŒ—OLŒÌ‹VÛ
ÍÌŒ—OLM‹VÛ
ÍÍŒ—OLŒÎ
VÍNOL
KÖÛ
ÌŒŒWOJÊÖÛ
ÌŒŒWKLJJKÌLY[˜Ý[Ûˆ
KŠ^Ý˜\ˆKLLÏLLLOLLOLÒXORLŽ
JHOLLÌŽ	‰“XJLÌŽK
K

]
ÌŒŽ
JHOJJI‰“XJ‹K
KVØJÎŒ—OPKVØJÎŒ—OMËVØJÎŒ—OLLÍÍN
XJÎMŸKJÎ
KSJŠK
YVÝ
ÍŽŒ—JI‰ŠJŠKVÝ
ÍŽŒ—OL
KYJJÎMŸMÍÊNÙNšYŠ

OŒ	‰›ŠZYŠ]J
KVÝ
ÍŽŒ—O\‹ŠZYŠO[ÚJ‹ŠKÜŠŠKOŒLLÌŠYVØJÌMŒ—OXJÎM‹JVÌÌLKLMJÌMŸ
KLŽÙ[ÙHYŠYVÝ
ÍŽŒ—KYVÛŠÍŒ—KJ

YVÛŒ—JJHOLL
ŠOL
IŠŠOLÍŒMÍÌŽJ^Û\ŠÛŸVÝ
ÍŽŒ—O[‹OY]

ÍLMŽL
K]

ÍÍŒ
K]

ÍÎLMKMŠK]

ÍÎÎ
K]

ÍŒNLŸLLŠNÝšYŠ

]VÌ—JJHOMÊY›ÜŠÎÊ^ÚYŠ

LMIœŠJHOMŠ^ÚYŠ[
Xœ™XZÈÛYVÝ
ÍŽŒ—KVØJÍÌŒ—O\ŒVØJÍŒ—OLLÌŽVØJÍŽŒ—O[‹[JVÌÌLKMLKHM
NØœ™XZß\ŽžÜÎžÛÎžÛŽžØÎœÝÚ]Ú

]VÌ
[ŠÌ_
WJKLN
^ØØ\ÙH˜œ™XZÈŽØØ\ÙHŽ˜œ™XZÈÎÙY˜][˜œ™XZÈßY›ÜŠM
ÊM	œŠ_VÝ
ÌNŒ—O\ŽÜJ\ŠJÌ_YÚJŠNÊNÙ›ÜŠÛ]VÌ—K[‹[ŠÌ_

HOMÎÊNØœ™XZÈŸZYŠ[ŠÌß

J

YÖÛŠÌŸJJOOÌNLN‹MJJÛŸ
JOŽM
Xœ™XZÈÎÙVÍÎ
Ê
ŠJÝ
OŒ—O\ŽØœ™XZÈß\LJÊ
Q]
ŠJJÜŸ
_ÛÎœÝÚ]Ú
Š^ØØ\ÙHN™VÍLMŽ
Ê
ŠJÝ
OŒ—O\ŽØœ™XZÈÎØØ\ÙH™VÑOŒ—O\ŽØœ™XZÈÎÙY˜][˜œ™XZÈßY]VÛŠÌŸK

HOLOÊYVÝ
ÍÍŒ—KVÌ
JÏ]
Û
JÍÎL
WOOLMI‰ŠÖÌO[ŠKÖÌ
ÏXÊÍÍŽ
WO]VÌ×JÌKVÊÏJŠJÝ
JÍÌŒ—O\‹VÝ
ÍÍŒ—O[ŠÌKVØÊÍÌNŒ—O[
N™VÍŒN
Ê
ŠJÝ
OŒ—O\ŸZYŠVÌ—HOMÊY›ÜŠÜLJÊ]
ŠJÜŸ
_VÌ—HOMÎÊNß\]VÌ
\ŠÌ_
W_Y›ÜŠYVÝ
ÍŽŒ—JÎÎÊ^Ù›ÜŠVÍŽLŠÊ
\ŠJÝ
OŒ—O[ŽÛ]VÌ—NÊ[[ŠÛÙ›ÜŠ[ŠÌ_VÍŽLŠÊ
ŠJÝ
OŒ—O[ŽÜ]VÌ—NÊ[\ŠÛŸÚYŠ[ŠÌ_

\
ÌŸ
JOOLL
Xœ™XZß\L

YVÝ
ÌÌŒ—JJOLŒROŒ
VØJÍŒ—OPKJVÌÌLKMLNKJÍ
J_Y[ÙHVØJÍŒ—O\‹VØJÌÍŒ—O[VØJÌÌŒ—OXJÎM‹JVÌÌLKLÍKJÌÌŸ
KLŽÙ[ÙHÜŠŠKLÎÙ[Ù^ÚYŠŸ
VØOŒ—OXJÎM‹JVÌÌLKMŒËJJKLK[ŠXœ™XZÈNÑÜŠŠ_\™]\›ˆXJÌŽŸY[˜Ý[Ûˆ]

^Ý˜\ˆKLOLÙ›ÜŠOY]

ÌÍMŠKÖÝ
ÌÍOLKÖÝ
ÌÍMŸOLKÖÝ
ÌÍMßOLKÖÝ
ÌÍNOLKÖÝ
ÌÍN_OLKÖÝ
ÌÍŒOLKÖÝ
ÌÍŒ_OLKÖÝ
ÌÍŒŸOLKÖÝ
ÌÍŒßOLKÖÝ
ÌÍOLKÖÝ
ÌÍ_OLKÖÝ
ÌÍLOLKÖÝ
ÌÍL_OLKÖÝ
ÌÍLŸOLKÖÝ
ÌÍLßOLKÖÝ
ÌÍMOLKÖÝ
ÌÍM_OLKÖÝ
ÍÌ_OLËÖÝ
ÍŽ_OLËÖÝ
ÍÌOLËÖÝ
ÍŸOLËÖÝ
ÍßOLËÖÝ
ÍOLËÖÝ
Í_OLËÖÝ
ÍLOLËÖÝ
ÍL_OLËÖÝ
ÍLŸOLËÖÝ
ÍLßOLËÖÝ
ÍMOLËÖÝ
ÍM_OLËÖÝ
ÍMŸOLËÖÝ
ÍMßOLËÖÝ
ÍNOLËÖÝ
ÍN_OLËÖÝ
ÍŒOLËÖÝ
ÍŒ_OLËÖÝ
ÍOLËÖÝ
Í_OLËÖÝ
ÍŸOLËÖÝ
ÍßOLËOLŒNÙÖÊ]
Ø_
JÌÍOMVÜŠÌÍK

XJÌ_
JHOMNÊYÖÌ
\ŠÐ_
WOMVÌ—KÖÊXJÐ_
JÌŸOMVÜŠÌŸKÖÜŠÌßOMVÜŠÌßKOXJÍÙÖÝ
ÌÍŸOMVÝ
ÌÍŸKÖÝ
ÌÍßOMVÝ
ÌÍßKÖÝ
ÍÌŸOMVÝ
ÍÌŸKÖÝ
ÍÌßOMVÝ
ÍÌßKÖÝ
ÍÍOMVÝ
ÍÍKÖÝ
ÍÍ_OMVÝ
ÍÍ_KÖÝ
ÍÍŸOMVÝ
ÍÍŸKÖÝ
ÍÍßOMVÝ
ÍÍßKÖÝ
ÍÎOMVÝ
ÍÎKÖÝ
ÍÎ_OMVÝ
ÍÎ_KÖÝ
ÍßOMVÝ
ÍßKÖÝ
ÍŽOMVÝ
ÍŽKÖÝ
ÍÌOMVÝ
ÍÌKÖÝ
ÍÌ_OMVÝ
ÍÌ_KÖÝ
ÌÍOMVÝ
ÌÍKÖÝ
ÌÍ_OMVÝ
ÌÍ_KÖÝ
ÌÍLOMVÝ
ÌÍLKÖÝ
ÌÍL_OMVÝ
ÌÍL_KÖÝ
ÌÍLŸOMVÝ
ÌÍLŸKÖÝ
ÌÍLßOMVÝ
ÌÍLßKÖÝ
ÌÍMOMVÝ
ÌÍMKÖÝ
ÌÍM_OMVÝ
ÌÍM_KÖÝ
ÌÍMŸOMVÝ
ÌÍMŸKÖÝ
ÌÍMßOMVÝ
ÌÍMßKÖÝ
ÌÍNOMVÝ
ÌÍNKÖÝ
ÌÍN_OMVÝ
ÌÍN_KÖÝ
ÌÍŒOMVÝ
ÌÍŒKÖÝ
ÌÍŒ_OMVÝ
ÌÍŒ_KÖÝ
ÌÍŒŸOMVÝ
ÌÍŒŸKÖÝ
ÌÍŒßOMVÝ
ÌÍŒßKÖÝ
ÌÍOMVÝ
ÌÍKÖÝ
ÍŸOMVÝ
ÍŸKÖÝ
ÍßOMVÝ
ÍßKÖÝ
ÍOMVÝ
ÍKÖÝ
Í_OMVÝ
Í_KÖÝ
ÍLOMVÝ
ÍLKÖÝ
ÍL_OMVÝ
ÍL_KÖÝ
ÍLŸOMVÝ
ÍLŸKÖÝ
ÍLßOMVÝ
ÍLßKÖÝ
ÍMOMVÝ
ÍMKÖÝ
ÍM_OMVÝ
ÍM_KÖÝ
ÍMŸOMVÝ
ÍMŸKÖÝ
ÍMßOMVÝ
ÍMßKÖÝ
ÍNOMVÝ
ÍNKÖÝ
ÍN_OMVÝ
ÍN_KÖÝ
ÍŒOMVÝ
ÍŒKÖÝ
ÍOMVÝ
ÍKÖÝ
Í_OMVÝ
Í_KÖÝ
ÍŽ_OMVÝ
ÍŽ_KÖÝ
ÍÌOMVÝ
ÍÌKÖÝ
ÍÌ_OMVÝ
ÍÌ_KÖÝ
ÍŸOMVÝ
ÍŸKÖÝ
ÍßOMVÝ
ÍßKVÝ
ÍŒ—OLKVÝ
ÌŒŒ—OYVÝ
ÍŒŒ—JÍÍßY[˜Ý[Ûˆ
K‹K‹Ë‹
^Ý˜\ˆKLOLLÏLLOLL™OLÙOL™OLÒRORLLŽÙNžÝžÚYŠPJË‹
J^ÑOMMLÍIœÜŽœÎžÚYŠ

Ï\ŒM‰ŒÌÍÊJHOLÌÍÊ^ÚYŠMÊXœ™XZÈÎÚ[ŸßOÌÎŒŽØœ™XZÈŸZHJŸßJ_ZYŠ

LÌÍÉŠÙO[ŒMŸ
JJHOLÌÍÉ‰š
Xœ™XZÈQPJJÌMŸK‹K‹Ë‹
KŠKOYVÒJÌMŒ—KOYVÒJÌŒŒ—KYVÒJÌŒ—KYVÒJÌŽŒ—KKK‹ŠKOYVÒJÎŒ—KYVÒJÌLŒ—KYVÒOŒ—KYVÒJÍŒ—NØœ™XZÈ_ZYŠÏY‹
PJK‹XKOLŒMÍÍÉ›‹Ë‹LŒMÍÍÉœ
JOL
^ÚYŠPJK‹KËË
J^ÙPK\ŽØœ™XZÈ_QPJJÌLLŸK‹K‹
KOYVÒJÌLŒŒ—KYVÒJÌLŒ—KYVÒJÌLLŒ—KYVÒJÌLMŒ—_Y[Ù^ÚYŠ\ŒM‰ŒÌÍËÊ\‹PJNŠPJJÎMŸK‹KLMMŒ
KYVÒJÌLŒ—KOYYVÒJÌLŒ—KJŒMŸ
KLLŒYVÒJÌLŒ—KYVÒJÎMŒ—JKŸ
PJJÎËËLMMŒ
KÏYVÒJÎŒ—K[YVÒJÎLŒ—KJŒMŸ
KLLŒÏYVÒJÎŒ—KYVÒJÎŒ—JK™OSË™OMMLÍI•MLÍ‹OMMLÍI•_MLÍ‹
ŠOŠŠJ^Ù›ÜŠÎÊ^ÚYŠÏJZ\™_
KJOJÊOOJ
I›Œ™ŒÏŒœŒ
_

OJKJ
Œ™OŒ
JØ™_
_
KJOŒ•Œ
_
JOŒ
JOL
^ÚYŠY‹J
Y‹[
_ß
\J
ŒšŒ
JØß
_
_JJ^ÑPJJÌÌŸK‹K‹
KOYVÒJÍŒ—KYVÒJÍŒ—KYVÒJÌÌŒ—KYVÒJÌÍŒ—NØœ™XZÈ_QOQO_ÏŒÌKSÏ_ŒÌ_Y[ÙHOUO_ŒÌKZ_ŒÌNÚYŠOQKO\_ŒÌKLKQKJ

U‹L_
JOŠŠJJXœ™XZßURŸZYŠÏJZ\™_
KJOJÊOOJ
I›Œ™ŒÏŒœŒ
_QOJKJ
Œ™OŒ
JØ™_
_
KJOŒ•Œ
_
JO
SÏZUNÙ[ÙHYŠY‹J
Y‹[
_ß
\J
ŒšŒ
JØß
_
_
J^ÑPJJÍK‹K‹
KOYVÒJÍMŒ—KYVÒJÍŒŒ—KYVÒJÍŒ—KYVÒJÍLŒ—NØœ™XZÈ_ZYŠ

OOMMLÍ_ŒMLÍJY›ÜŠÐO\ŒÌ_U‹L_O\_ŒÌKLKUKPKOU_ÏŒÌKÏ\ŸÏKPKOŒMLÍŽÊNÐOLÌÍŽ	˜ÙK
ŠOLÊPJKHM‹ËMLÍI•
_ŠÌLŒ
OM‹LNLNMŽ
KOYVÒJÍÌŒ—KYVÒJÍÍŒ—KYVÒJÍŒ—KYVÒJÍŽŒ—JNŠOSËMMLÍI•
_ŠOMŠ__YVÝŒ—OY‹VÝ
ÍŒ—O\VÝ
ÎŒ—OXKVÝ
ÌLŒ—O[‹RJÌLŽY[˜Ý[ÛˆPJKŠ^Ý˜\ˆK‹LÏLLLOLLOLLÏLÚYŠXORLL

ÏSÛÊNN
JJOL	‰Š
^]
KŒÌŠJOÙVÛ
ÎŒ—OXÎŠYJÊKL
JK[
^ÙNšYŠRØJŠJY›ÜŠÏYVÌÌLKJJÎMŸ
JÐ_ÎÊ^ÚYŠ

ÏYVÍLÌ×JJOLÍ
^ÙVØJÍŒ—OLÍLVØOŒ—OXÊÌKJËLNŒJNØœ™XZÈ_ZYŠVÛ
ÌN_HOMŠZYŠVØJÎŒ—O[
ÌNKVØJÎŒ—OMËVØJÎŒ—O]
XJÎMŸLNLJÎ
K

SJ
JJHOKLÌJ^ÚYŠJ

OL
I‰ŠOYJJÎMŸMÌLŠJJ^ÙLÖØJÎÌŸOLÖØJÍÍLŸOLVØJÌÍŒŒ—OLVØJÌÍMŒ—OMOLÝ™›ÜŠÎÊ^Ù›ÜŠLŽNKR_ÝÐJJÎLLŸLŒJNÊ^ÛXJÎLLŸÜŽžÚYŠVØJÎLLŸHOLÍJ^ÜÎšYŠJ

Q]
JÎLLŸ
KL_
JOL
JY›ÜŠÎÊ^ÚYŠJ

ÏYÖÌ
JJÎLLŸ
JÛ
WJJOOLÌŸËNOŒJJXœ™XZÈÎÚYŠÖÌOLJ

[L_
JOŒ
JXœ™XZßZYŠJ]™JJÎLLŸ
JJXœ™XZÈŸYÖÌOL[XJÎLLŸÜŽšYŠÏ]VØJÎLLŸJY›ÜŠÎÊ^ÚYŠ\ŠÏŒ
JXœ™XZÈŽÚYŠJÏ]VÌ
[
Ì_
WJJXœ™XZßZYŠÖÌOLVØJÎLLŸJ^Û[
Ì_ÜŽœÝÚ]Ú
JLÌNLJÎLLŸ
KL_
^ØØ\ÙH™›ÜŠØÏ[[
Ì_

YÖÌ×JJOOLÌŸNOŒNÊNÓJJÎÌŸË
NØÛÛ[YNØØ\ÙHNšYŠÖØJÍÌŸOLVØJÌÍŒ—OMKÏXJÍÌŸVØJÌMŒ—OXËVØJÌŒŒ—OXJÌÍ
ŒŒÍËJÌMŸ
K
ÏQ]
ÊJÌŸ
OŒZŒ
XÛÛ[YNÙÖÌ
JJÌÍŽ
JÒ_
WOYVØJÌÍŒ—KÝ

Ì_JÍÌŸ
KYŠÌ_OXÊÒ_ØÛÛ[YHØØ\ÙHŽšYŠVØJÍLŒ—OXJÌÍŒVØJÍŒ—OXJÍÍL‹
ŒŒÍËJÍ
K\ŠXÛÛ[YNÙVØJÌÌŒ—OUJËLŒ‹JÌÌŸ
NØÛÛ[YNØØ\ÙHN˜œ™XZÈŽÙY˜][˜ÛÛ[Y_YVØJÍŒ—OXJÌÍM‹
ÌŽKHM
__Xœ™XZßYÖÊJÌÍŽ
JÒ_OLÏXJLÌŒLL‹JÍÍLŸ
KÊQ]

JÒ_S

^]
Ž
Ê]
JÎÌŸ
JÜ
_JJJÌJÌÍŽRJÌ_
KVÙŠÍŒ—OZQÝ

Ú
KVÙŒ—O[VÙŠÎŒ—O[VØJÎÌŸI‰ŠVÙŒ—OQÝ
ŠÊ
Ú
_JÎÌŸ
JKYVØJÌÍŒŒ—KÖÙŠÌMOLÖÙŠÌLŸOXËÖÙŠÌLßO[ÖÙŠÌM_OYVØJÌÍMŒ—KÜŠJKYVÍLÌ×KVÍLÌ×O[
ÌKVÌŒLŒMŠÊŠOŒ—OYŠN‘ÜŠJ__Y[ÙHPJJÎMŸKŠNÚYŠJRØJŠJJXœ™XZß]ÛŠVÛŠÎŒ—JKJŠ_RXJÌLY[˜Ý[Ûˆ
J^Ý˜\ˆ‹OLLLÏLLLOLLOLÒ\RLÍLŸÙNšYŠ
YVÌLÍŒŽ
ÊO
OŒ—JJ^ÝVÌHOMÉ‰ŠVÜŠÌLŒ—O]VÜŠÍŒ—OMËVÜŠÎŒ—OMËVÜŒ—OLLÍÍN
\ŠÌMŸLMŠJKÖÜŠÌOLÝžÜŽžÚYŠOYJMÍÊJ^ÚYŠ
šJKŒ
JOOKLJXœ™XZÈÚYŠSJJKSJJKSJJKJ

HOMMLÍß
ŠHOYVÍLÍMJIŠŠOO[JXœ™XZÈŽÑÜŠJKÖÜŠÌMŒWO]VÎ_VÎWO]VÎL—_VÎL×OVÎMOMŸVÎMWOVÜŠÌŒ—O]VÎ_VÎWOVÎLOMŸVÎLWOVÜŠÌŒ—O]]VÎŒ_VÎŒWOVÎŒ—OMŸVÎŒ×OVÜŠÌŒ—O]VÎM—_VÎM×OVÎNOMŸVÎNWOVÜŠÌLŒ—O][RLMŸÜÎžÚYŠ
OQ]
\ŠÌ
JOŒM‰‰ˆVœŠJ
Ø_
KMŸÍŠJ^Ù›ÜŠOLLÎÊ^Ù›ÜŠLXORLMŸVÌŒÌNM—_
ÖÌŒÌNM×OQYJ
KÖÌŒÌNM—OLJKOJÐÙJ
KYJÏQKÌYLÊOLŒŒÌÍÌŒÍŽMÍÍ™LÏÊPYJÊOLOßŸŠÏŒÓYJYJŒÌŽÌÍLÎŽMŒÙKLŠ˜ÊKŽMMÌŽMJN—ÙJŒÌŽÌÍLÎŽMŒÙKLŠŠËJÊŸ˜ÏŒŒ
JJJOŒŒ_Ÿ˜ÏŒ
NŠKLŒMÍÍL
KVØOŒ—O[‹VØJÍŒ—OZÏLYLÊŠKJ
ÊPJ‹YLË
OŒ
JÍŽMMÌŽMŠŠÊJJJJŒYLËPYJÊOŒMÍÍßŸ˜Î‹LŒMÍÍVØJÎŒ—O[‹YŠÊO
W”ÊVØJÎŒ—KMLÍÊNÙÖÙŠÜOMJÊMI›ŸIŒÌŠK[_

\
Ì_
JHOMŽÊNÚYŠXJÌMŸVÛŒ—OLÎ

OSÛÊNM
JJOL
Xœ™XZÈÎÚYŠORKL_VÍMÎNHOLŒRJXœ™XZßS
‹ÍŠ_Y[ÙHVÍMÎNOLŽØOKL_R[
ÌMŸ
JOÛŠJ_ZYŠJOYJMÍÊJJ^ÝV˜JVÍMÎNK
NØœ™XZÈ__ZYŠ

SJ
JJO
^ÑÜŠJKV˜J[
NØœ™XZÈ_ZYŠ
šJK
JOOKLJ^ÐOYVÍMÎNKÜŠJKV˜JK
NØœ™XZÈ_ZYŠJWÐJVÊLLÍŒŽ
ÊO
_
OŒ—K
JJ^ÑÜŠJKMØœ™XZÈ_ZYŠ
ÚJ‹JJHOJ
J^ÐOYVÍMÎNKÜŠJKVÜŠÌI‰œŠŠÌ
KJŠKV˜JK
NØœ™XZÈ_QÜŠJKVÜŠÌI‰œŠŠÌ
KVÌLÍŒÍŠÊO
OŒ—OJVÛŠÍ_VÛŠÍ_OVÛŠÍŸOMŸVÛŠÍßO
KÌ‹VÙŒ—O[‹LØœ™XZÈ_POYVÍMÎNKÜŠJKV˜JK
_Y[ÙHLŽÜ™]\›ˆ\ŠÌÍLŸY[˜Ý[ÛˆÐJK‹K‹
^Ý˜\ˆËLLOLLOLLÏLLOLL™OLÙOL™OLÙOLÙ›ÜŠÖÌ—OLKÏLI›™OLKOKLKKLKLKPNÎÊ^ÚÙOXÙKLŸ™OQKÏRŽÙNžÝžÙ›ÜŠÎÊ^ÚYŠJ]VÌJJ^ÒSËO\™NØœ™XZÈ_ZYŠ[
Ì_YVÌM
ÊŠOŒ—J^ÜŽžÚYŠ

]VÕŠÌL_JJHOLJ^ÚYŠM‰VÕŠÍŸ_
ŠHOLŠXœ™XZÈŽÙÖÌ
O\ŠÚ
WOUKJJO
ÊOŠJKJ‰VÕŠÍJ_Xß
JOL
ÖÌWOLJKOYÜ™NšYÓÎ•KOKLKZ
Ì_Øœ™XZÈZYŠP–ÕŠÎŒWJ^ÙLOZÜÎšYŠ

HON
Y]VÕŠÌMKVÛŒ—I‰™ŒM
ÏJŠO
ÊOÓÎ™‹OYŠNÙ[Ù^Ù›ÜŠÎÊ^ÚYŠY‹ORKL_VÛŒ—_
JOL

YÖÌ
\ŠÒ_
WJJOŒÊXœ™XZÈÎÚYŠU
Ì_JŒŠJXœ™XZßZYŠÖÌOM™OJÊOÒNœ™KÏJÊOMÍ“ËOŒŠXœ™XZÈÎÚYŠLÉŠO_•
ØÙ_
KLKÙKUŒLÊY›ÜŠKM	’KOLÝVÌ
\ŠÙŸ
WOOM	‰ŠÖÌOLÊKVÜ
Ì_OOM	‰ŠÖÜ
Ì_OLÊKVÜ
ÌŸOOM	‰ŠÖÜ
ÌŸOLÊKVÜ
ÌßOOM	‰ŠÖÜ
ÌßOLÊKYŠÍ

HOJ
ORJÍ
JNÊNÚYŠLUŠXœ™XZÈÎÙ›ÜŠÝVÌ
\ŠÙŸ
WOOM	‰ŠÖÌOLÊKYŠÌ_
ŠHOJ
\
Ì_
JNÊNßZYŠ™JXÛÛ[YNØœ™XZÈ__Xœ™XZß_RSËO\™K

OOLŒ	‰ŠÖÜŠÚOXÉ‰ŠJOÌN•KZ
Ì_
_ZYŠÖÌWOUÙOZL_OPJÌ_™OJ
ONJXÛÛ[Y_Xœ™XZßYÖÜŠÚOLKÖÌWOLÙNšYŠ

OYVÛŒ—JJOŒ
RM
JOJ
I‰ŠVÛŒ—OXÙKOXÙJKÖÐJÜŸOMOYVÛŒ—NÙ[ÙHYŠ
ŠOOMI‰ŠMJ

OŠJJ^ÚYŠLKÏLIŠOZL_
K

HOLŠY›ÜŠ™OKL‰KOLÎÊ^ÜMÝžÜŽžÜÎœÝÚ]Ú
VÌ
OJ[
JÜŸ
WKM
^ØØ\ÙHN˜œ™XZÈŽØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈ\L‰VÝ
ÌMOÌNŒËQ_YÖÌWO\OYŸ\MÝžÜŽžÜÎœÝÚ]Ú
VÌ
OJ[
Ì_
JÜŸ
WKM
^ØØ\ÙHN˜œ™XZÈŽØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈ\L‰VÝ
ÌMOÌNŒËQ_YÖÌWO\OYŸZYŠ[
ÌŸ
™JOOJ
ORJÌŸ
JJXœ™XZßZYŠÊ^ÜMÝžÜŽœÝÚ]Ú
VÌ
O\ŠÛ
WKM
^ØØ\ÙHN˜œ™XZÈØØ\ÙH˜œ™XZÈŽÙY˜][˜œ™XZÈ_\L‰VÝ
ÌMOÌNŒËQ_YÖÌWO\O[_\™]\›ˆVÛŒ—OQKVØOŒ—OZŸY[˜Ý[ÛˆÐJJ^Ý˜\ˆ‹KLLÏLLLOLLOLLÚYŠ]
\™]\›ˆJJNÚYŠOŒMŽMMÌŒÌŠ\™]\›ˆVÍMÎNOMÜPOŒLOÌMŽJÌLI‹NÏKN	ŠOYVÊ]N
JÍŒ—JNÙNšYŠÉ˜J^ÜXÊÙŸÝšYŠÏŒ\Œ
^ÚYŠ
XË\Ÿ
OŒMŠXœ™XZÈÙVÙŠÍŒ—OLI˜_Ÿ‹VÊYŠÜŸ
JÍŒ—OLßVÜ
ÍŒ—OL_VÜ
ÍŒ—KJ‹
_Y[ÙHYŠVÍMÌMNHOJ
JZYŠVÍMÌMM×HOJ
J^ÚYŠ‰ŠYVÜ
ÍŒ—J_
XÊÊN	›
_
OŒŒ
Xœ™XZÈNÕZ\ŸÜŽšYŠŒLMJ^ÚYŠÏYVÜ
ÎŒ—K[Œß

YVÜ
ÌLŒ—JJOOJÊJ^ÙVÍMÌML—OYVÍMÌML—Iœ˜JL‹ŠNØœ™XZÈŸYVØÊÌLŒ—O[VÛ
ÎŒ—OXßY[Ù^ÚYŠOYVÜ
ÌŒ—K

OYVÜ
ÌLŒ—JJOOJ
JZYŠ
YVÊÏ\
ÌŒ
OŒ—J_
YVÊÏ\
ÌMŸ
OŒ—JJ^Ù›ÜŠÛXËO[‹
YVÊÏ[ŠÌŒ
OŒ—J_
ÏRJÌMŸYVÒJÌMŒ—JNÊNÙVÛŒ—OLY[ÙHOLÙ[ÙHYVÜ
ÎŒ—KVÛŠÌLŒ—ORKVÒJÎŒ—O[ŽÚYŠJ^ÛYVÜ
ÌŽŒ—NÜÎžÚYŠVÊLŒŽLLŠÊŠ_
OŒ—OOJ
J^ÚYŠVÛŒ—ORKJXœ™XZÈÎÙVÍMÌML×OYVÍMÌML×Iœ˜JL‹
NØœ™XZÈŸZYŠVÊVÑJÌMŒ—OOJ
OÌMŽŒŒ
JÑOŒ—ORKRJXœ™XZÈŸYVÒJÌŒ—OQK
YVÜ
ÌMŒ—JI‰ŠVÒJÌMŒ—O[‹VÛŠÌŒ—ORJK
YVÜ
ÌŒŒ—JI‰ŠVÒJÌŒŒ—O[‹VÛŠÌŒ—ORJ__UŒLMOÊVÙŠÍŒ—OLI˜_‹VÊYŠÚ
JÍŒ—OL_VÛŠÍŒ—JNŠVÙŠÍŒ—OLI˜_Ÿ‹VÊYŠÜŸ
JÍŒ—OLßVÊYŠÚ
JÍŒ—OL_VÛŠÍŒ—KJ
J_Y[Ù^ÚYŠ
XÊÙVÍMÌMM_
OŒŒ
Xœ™XZÈNÊ[\Ÿ
OŒLMÊVÙŠÍŒ—OLI˜_Ÿ‹VÊÏYŠÜŸ
JÍŒ—OL_‹VÊ[
ÙŸ
OŒ—O[‹VÛ
ÍŒ—OKL‰™VÛ
ÍŒ—JNŠVÙŠÍŒ—O[I˜_‹VÊ[
ÙŸ
JÍŒ—OL_VÛŠÍŒ—KLÏL
KVÍMÌMM×OXËVÍMÌMMO[ŸY[Ù^ÚYŠ
ÏXÊÙVÍMÌMMW_
OŒ\Œ
Xœ™XZÈNÙVÙŠÍŒ—OLI˜_Ÿ‹XË\ŸVÊYŠÜŸ
JÍŒ—OL_‹VÍMÌMMWO[‹VÍMÌMNO[[YŸY[Ù^ÚYŠŒMŸÏŒ\ŠÍŒ	‰ŠY‹Ë\ŒYVÍMÌÌ—OOŒ
JXœ™XZÈNÛL\™]\›ˆÛŠÎŠ]JJJOÊ
‹OŒŠJÉŠYVÝMŒ—JOËM‹N
JÊN	›Š_
OŒÛŽJKJ
KŠNŒY[˜Ý[ÛˆPJ
^Ý˜\ˆKLOLÜ™]\›ˆWØJLŠKVÝŒ—OLŒŒLOWØJÌŠKVÊOPJJÍŒ—OLVØJÎŒ—OLVØOŒ—OLLÌŒÌVØJÌÌŒ—OLVØJÌLŒ—OLVØJÌMŒ—OLVØJÌŒŒ—OLVØJÌŒ—OL]
JÍÍÍŠKVØJÍŒŒ—OLVØJÍŒ—OKLKÖØJÍMŸOLKY]
ØJ
K
KVØJÌŽŒ—O\‹ÖÜŠÎOLKVÝ
ÍŒ—OXKWØJLMŠKVÜŠÎŒ—OLŒŒLVÜŠÍŒ—OLŒŒLVÜŒ—OLLÌŒÍL‹VÜŠÍŒ—OLŒŒLVÜŠÍMŒ—OLVÜŠÍŒŒ—OLVÜŠÌÌŒ—OLVÜŠÌÍŒ—OLVÜŠÌŒ—OLŒŒLVÜŠÌMŒ—OLVÜŠÌŒŒ—OLVÜŠÍŒ—OLVÜŠÍŒ—OLÖÜŠÍOLVÜŠÌLŽŒ—OLVÜŠÌLÌŒ—OLÖÜŠÎMŒWOLVÜŠÍÌŒ—OLŒŒLVÜŠÌLÍŒ—OLVÜŠÌMŒ—OLÖÜŠÌMŽŒWOLVÜŠÌMŒ—OLŒŒLVÜŠÌŒŒ—OLVÜŠÌŒŒ—OLVÜŠÌŒŒ—OLVÜŠÌŒLŒ—OLVÜŠÌŒMŒ—OLŒŒLÖÜŠÌŒWOLVÜŠÌŽŒ—OLVÜŠÌŽŒ—OLVÜŠÌÌŒ—OLVÜŠÌÍŒ—OLVÜŠÌŽŒ—OLŒŒLÖÜŠÌÌLŒWOLVÜŠÌÍŒ—OLVÜŠÌÍŒ—OLVÜŠÌÍLŒ—OLVÜŠÌÍMŒ—OLVÜŠÌÍŒŒ—OLŒŒLÖÜŠÌÎŒWOLVÜŠÍMŒ—OLVÜŠÍŒŒ—OLVÜŠÍŒ—OLVÜŠÍŽŒ—OLVÜŠÍÌŒ—OLŒŒLÖÜŠÍMŒWOLVÜŠÍŒ—OLVÜŠÍLŒ—OLVÜŠÍMŒ—OLVÜŠÍLŒ—OLVÜŠÍLŒ—OLŒŒLÖÜŠÍLŽŒWOLKVÜŠÍMŒŒ—OLVÜŠÍMŒ—OLVÜŠÍMŽŒ—OLVÜŠÍMÌŒ—OLÖÜŠÍŒŒWOLVÜŠÍMÍŒ—OLŒŒLVÜŠÍŒ—OLVÜŠÍŒ—OLVÜŠÍŒÌŒ—OLVÜŠÍŒÍŒ—OLÖÜŠÍŽŒWOLVÜŠÍMŒ—OLŒŒLVÜŠÍŒ—OLŒŒLVÜŠÍÌŒŒ—OLVÜŠÍÌŒ—OLVÜŠÍÌLŒ—OLVÜŠÍÌMŒ—OLÖÜŠÍÍLŒWOLVÜŠÍÌŽŒ—OLŒŒLVÜŠÍÎLŒ—OLVÜŠÍÎMŒ—OLVÜŠÍÎŒ—OLVÜŠÍÎŒ—OLÖÜŠÎŒWOLVÜŠÎŒ—OLŒŒLVÜŠÎŒ—OLVÜŠÎŽŒ—OLVÜŠÎMŒ—OLVÜŠÎŒŒ—OLVÜŠÎÌŒ—OLŒŒLÖÜŠÎMŒWOLVÜŠÎLÍŒ—OLVÜŠÎMŒ—OLVÜŠÎLŽŒ—OLVÜŠÎLÌŒ—OLÖÜŠÎMŽŒWOLVÜŠÎMŒ—OLŒŒLVÜŠÌLŒ—OLVÜŠÌLLŒ—OLVÜŠÌYLÏŒ—OLVÜŠÌLŒ—OLÖÜŠÌLŒWOLVÜŠÌLMŒ—OLŒŒLVÜŠÌLŒ—OLVÊO\ŠÌL
OŒ—OLVØJÍŒ—OLVÊO\ŠÌLÌŸ
OŒ—OLVØJÍŒ—OLVÝ
ÎŒ—O\‹]ÙVÙVÜŒ—JÍŒ—WJ‹JKY[˜Ý[Ûˆ\ŠKŠ^Ý˜\ˆOLLLÏLLLOLLOLLÏLÙNšYŠOYVÍLÍNWJ^ÚYŠOYVÍLNKTÊK
JÌŒŒŒMÍŸ

J
J
JVÛŠÌLŒ—JÙVÛŒ—_
KÊ
_
JO

J
ÊVÍLÍMKNJJKÍMŠKÊ
_
JOÛŽš
JOLÎNOÌÎNN›ŠJOL	‰Š]
K
ÊŠ_
KOYVÍLNJK
JOL
Y›ÜŠYVÍLWNÎÊ^ÚYŠTÊË
JÌŒŒŒMÍŸVÛ
ÍŒ—I‰ŠYVÛŒ—JJ^ÚYŠÏYŠÙVÛ
ÌLŒ—_OLJÊ
‹YVÛ
ÎŒ—_
KÊ
_
_
ŠOŠ
OTÊJJOLOÌN˜K
JJJY›ÜŠÙVÊOJŠJÐ_
OŒ—OYVÒOŒ—JÔÊVÛ
ÍŒ—KVÊ
‹X_
KÊVÛ
ÎŒ—OŽ
_
JÕJK[ŠÌ_
ŠOŠ
O]
Ø_
JNÊNÚYŠJ
JOJÊJJY›ÜŠÙVÊOJŠJÐ_
OŒ—OYVÒOŒ—JÔÊVÛ
ÍŒ—KVÊ
KYŸ
KÊVÛ
ÌLŒ—OŽ
_
JÕJK[ŠÌ_
ÊOŠ
O]
Ø_
JNÊNßZYŠJ

ÏXÊÌ_
JOYVÍLNJJXœ™XZßZYŠLKJ

MMLÍ™LËÊ
_
JOL

OTÊVÍMMMWKL
JJOL
JY›ÜŠJJKÊ
_ÙVÊJŠJÐ_
OŒ—OYVÙŒ—JØK[ŠÌ_

OXK[
JOŒÊNÚYŠ
ÊON
Y›ÜŠÛJOXÏŠJÌŒÌŒMŸTÊË
JÌŒŒŒMÍŸYVÛ
ÍŒ—OŒMVÛŒ—OJÊÊ‹ŠKJJKÌ‹ØOYVØJÌŒÌŒ—NŠXJÌŒÌOYVÛŒ—KÊ
_VÙŒ—OXJK
JOJ
I‰ŠVÛŒ—OL
K

ÏXÊÌ_
JHONNÊNÚYŠL

OL
Y›ÜŠOLÛYVÊÏJOŠJÐ_
OŒ—OŒMKTÊ
OŽVØÏŒ—O[
ŠOMLŽÎNNI‰ŠVØÏŒ—OTÊVÌÍ
Ê
ŒNJJÑ_
_JOŒLÊK]
ÛŸÏJJHOJ
KOXJÌ_ÎÊNÚYŠVÐJÍŒ—OJÊVÐJÍŒ—KVÌŒÌÌOÍŽŒL
JKÎIœŠY›ÜŠYVÍL—KOLNÎÊ^ÚYŠVÊXOŠJÌŒÌÌLŒ—OYVÐJÜŒ—KYVÝ
ÜŒ—OŒË

XJÌ_
JOOLÌ
Xœ™XZÈNÙVÊLŠJÌŒÌÌLŒ—OYVÐJÜŒ—KYVÝ
ÜŒ—OŒËOXJÌŸ_Y[ÙHLNÜ™]\›ˆY[˜Ý[ÛˆXJK‹J^Ý˜\ˆ‹LÏLÒ[RLMÍŸÖÌOLÖÛŠÎŒWOLÌŒVÛŠÌLŒ—OLVÛŠÌLŒ—OLÖÎŠÊ\Š‹[ŠÎŠJÛŸ
_OLÙNžÝžÚYŠXJ^ÚYŠO[ŠÎKVÛŠÌLŒ—OXKÜŠKŠÌLŸŠÌMŸŠÌL
_
VÛŠÌLŒ—O[ÜŠKŠÌLŸŠÌMŸŠÌL
_
ÖÛŠÎ_OLÌ‹
KŠÌMŸŒ
JJK
]VÛŠÌMŸJI‰ŠŠHOLŒJXœ™XZÈÜŽžÚYŠVÐJÌŒLŒ—HOLNMŠ^ÚYŠÛÊMÌNKNÍÌ‹NLŽMŠKÖÛŠÎ_ONMKVÛŠÌLŒ—OXKÜŠVÍÌNL×KŠÌLŸŠÌMŸŠÌL
_
VÛŠÌLŒ—O[ÜŠVÍÌNL×KŠÌLŸŠÌMŸŠÌL
JKVÛŠÌMŸJXœ™XZÈŽÛ˜JVÙVÌÌŽMÌ—JÍŒŒ—JK]VÛŠÌMŸ_ZYŠMIœŠXœ™XZÈÐO]VÎÌL_VÎÌLWOVÎÌL—OMŸVÎÌL×O]VÎÌLŒ_VÎÌLŒWOVÎÌLŒ—OMŸVÎÌLŒ×OÖÌO\‹ÖÝ
Ì_O\ŽÖÝ
ÌŸO\ŒM‹ÖÝ
ÌßO\ŒÖÝ
ÍOPKÖÝ
Í_OPOŽÖÝ
ÍŸOPOŒM‹ÖÝ
ÍßOPOŒÖÝ
ÌMŸO]VÎÌLÍ—KO]VÎÌLÌ—_VÎÌLÌ×OVÎÌLÍOMŸVÎÌLÍWO]VÎÌLŽ_VÎÌLŽWOVÎÌLÌOMŸVÎÌLÌWOÖÝ
ÎO\‹ÖÝ
Î_O\ŽÖÝ
ÌLO\ŒM‹ÖÝ
ÌL_O\ŒÖÝ
ÌLŸOPKÖÝ
ÌLßOPOŽÖÝ
ÌMOPOŒM‹ÖÝ
ÌM_OPOŒØœ™XZÈ_XO[ŠÌMŸ[ŠÌL\RLLLŸ
ÏYVÍÌNL×JOÊJËKLK
K\ŠXKO\ŠÍ
KOYVÐJÌŒLŒ—KÖÜŠÍßOPOŒÖÌ
ÏJ\ŠÍß
JÊOŒŒMÍÍÌŒMJ_
WOPOŒM‹ÖÌ
ÏXÊÈHJMÌLMŽ	J_
WOPOŽÖÌ
ÏXÊÈHJLŽ	J_
WOPKÖØÊÈHJMIJ_OLVÜŠÌMŒ—ONMÌNKVÜŠÌŒ—O[VÜŠÌŒŒ—OXK
MŒ‹ŠÌMŸ
JNŠJKKLK
K\ŠKO\ŠÍ
KVÜŒ—OPK
MLKŠJK\ŠÌLLŸ˜JVÙVÌÌŽMÌ—JÍŒŒ—JNØœ™XZÈ_ZYŠVÛŠÌLŒ—O[ÜŠKŠÌLŸŠÌMŸŠÌL
K]VÛŠÌMŸJXœ™XZÈ_YJPKO[ŠÌMŸŠÌLLK
K\ŠPKO[ŠÌLLŸ
KVÛŒ—OPK
MLKŠ_\™]\›ˆ[ŠÌMÍŸY[˜Ý[ÛˆŠJ^Ý˜\ˆ‹OLLLÏLLLOLLOLLÏLLOLL™OLÙOL™OLÙOLÚYŠ\RLLLŸVÜŠÍÌŒ—OKLKVÊO\‹HM
OŒ—OKLKVØJÍŒ—OKLKVÜŠÍMŒ—OKLKVÜŠÍŒŒ—OKLKVÜŠÍŒ—OKLKVÜŠÍLŒ—OKLKVÜŠÍŒ—OKLKVÜŠÍŒ—OKLKVÜŠÌÌŒ—OKLKVÜŠÌÍŒ—OKLKVÜŠÌŒ—OKLKVÜŠÌŽŒ—OKLKVÜŠÌMŒ—OKLKVÜŠÌŒŒ—OKLK
JOŒ
^Ù›ÜŠYVÜŠÍÌŒ—KÏYVÜŠÍŽŒ—KYVÜŠÍŒ—KYVÜŠÍŒŒ—KOYVÜŠÍMŒ—KYVÜŠÍLŒ—KOYVÜŠÍŒ—KYVÜŠÍŒ—KÏYVÜŠÍŒ—KYVÜŠÌÍŒ—KOYVÜŠÌÌŒ—KYVÜŠÌŽŒ—K™OYVÜŠÌŒ—KÙOYVÜŠÌŒŒ—K™OYVÜŠÌMŒ—NÛ[J
YVÊOLLÍLLŠÊÙOŠ_
JÍŒŒ—JJOÛŽ›XËÏJ
ÏYVØJÍMŒ—JJOÛŽ˜ËY‹J
YVØJÍLŒ—JJOÛŽ™‹\J
YVØJÍŒ—JJOÛŽœRKOJ
OYVØJÍŒ—JJOÛŽ’KZJ
YVØJÍŒ—JJOÛŽšQKOJ
OYVØJÌÍŒ—JJOÛŽ‘KUJ
YVØJÌÌŒ—JJOÛŽ•SËÏJ
ÏYVØJÌŽŒ—JJOÛŽ“ËU‹J
YVØJÌŒ—JJOÛŽ•‹UKOJ
OYVØJÌŒŒ—JJOÛŽ•KR‹J
YVØJÌMŒ—JJOÛŽ’‹\™K™OJ
™OYVØJÌLŒ—JJOÛŽœ™KXÙKÙOJ
ÙOYVØJÎŒ—JJOÛŽ˜ÙK™OJ
OYVØJÍŒ—JJOØ™N˜K

ÙOZÙJÌ_
JHOJJNÊNÙVÜŠÍÌŒ—O[VÜŠÍŽŒ—OXËVÜŠÍŒ—OY‹VÜŠÍŒŒ—O\VÜŠÍMŒ—ORKVÜŠÍLŒ—OZVÜŠÍŒ—OQKVÜŠÍŒ—OUVÜŠÍŒ—OSËVÜŠÌÍŒ—OU‹VÜŠÌÌŒ—OUKVÜŠÌŽŒ—OR‹VÜŠÌŒ—O\™KVÜŠÌŒŒ—OXÙKVÜŠÌMŒ—OX™_Y›ÜŠOLÎÊ^ÚYŠ

OYVÊPOŠJÊŠÌMŸ
OŒ—JJHOYVÊ[
ÌLÍ
OŒ—J^ÙÖÜŠÎOLÙNžÝœÝÚ]Ú
KL_
^ØØ\ÙH™VÍÌŒWOXKLNØœ™XZÈNØØ\ÙHN™VÍÌŒOXNØœ™XZÈNØØ\ÙH˜Ø\ÙHN˜Ø\ÙHŽ˜Ø\ÙHÎ˜Ø\ÙHLN˜œ™XZÈÙY˜][˜œ™XZÈ_YVÜŠÍŒ—OXKVÜŒ—OLKVÜŠÎŒ—OYÖÐJÌLŽLŸK
ŠÎLNM‹Š_YVÛŒ—OXKO\ŠÎÝ
VÝŒ—JÌNMJKVÝŒ—OYVÝŒ—JÑ]
J_ZYŠ

OPJÌ_
JOOLMJXœ™XZßR\ŠÌLLŸY[˜Ý[ÛˆŠ
^Ý˜\ˆK‹KLLÏLLÙ›ÜŠLMËVÝ
ÌÌŽŒ—OLMËVÝ
ÌŒŒ—OLVÝ
ÌŒMŒ—OLLLKVÝ
ÌŒŒŒ—OLLÌ‹VÝ
ÍŒŒ—OLLM‹VÝ
ÎNŒ—OLLLŽM‹ÏY]

ÌÍMŠKÖÝ
ÌÎLßOLKÖÝ
ÌÍ_OLKÖÝ
ÌÍŒOLKÖÝ
ÍM_OLKÖÝ
ÍLŽ_OLKÖÝ
ÌÎL_OLKÖÝ
ÌÍÎ_OLKÖÝ
ÌÍÍOLKÖÝ
Í_OLKÖÝ
ÍßOLKÖÝ
ÌÎNOLKÖÝ
ÌÎßOLKÖÝ
ÌÎOL‹ÖÝ
ÌÎ_OLKÖÝ
ÌÎLOLKÖÝ
ÌÎ_OL‹ÖÝ
ÌÎßOL‹ÖÝ
ÌÍŽOLKÖÝ
ÌÍŽ_OL‹LLŒÙÖÌ
[ŠØß
WOMVÌ—KXÊÝVÛ
Ì__ÖÌ—OMVÌ—KXÊÝVÛ
ÌŸ_ÖÌ—OMVÌ—K]VÌ
[
Ìß
WK

HOLLLNÊNÙÖÝ
ÌÎŸONVÝ
ÌÎŸKÖÝ
ÌÎŸONVÝ
ÌÎŸKÖÝ
ÌÎONVÝ
ÌÎKÖÝ
ÌÍŽ_OLMŸVÝ
ÌÍŽ_KÖÝ
ÌÍÌOLMŸVÝ
ÌÍÌKÖÝ
ÌÍÌ_OLMŸVÝ
ÌÍÌ_K]VÝ
ÌÍŒ_KÏ]VÝ
ÌÍŒŸK]VÝ
ÌÍŒßK]VÝ
ÌÍKO]VÝ
ÌÍŸK]VÝ
ÌÍßKÖÝ
ÌÍÌŸOLMŸVÝ
ÌÍÌŸKÖÝ
ÌÍÌßOLMŸVÝ
ÌÍÌßKÖÝ
ÌÍÍ_OLMŸVÝ
ÌÍÍ_KÖÝ
ÌÍÍŸOLMŸVÝ
ÌÍÍŸKÖÝ
ÌÍÍßOLMŸVÝ
ÌÍÍßKÖÝ
ÌÍÎOLMŸVÝ
ÌÍÎKÖÝ
ÌÎOLMŸVÝ
ÌÎKÖÝ
ÌÎ_OLMŸVÝ
ÌÎ_KÖÝ
ÌÎßOLMŸVÝ
ÌÎßKÖÝ
ÌÎ_OLMŸVÝ
ÌÎ_KO]VÝ
ÌÎKÖÝ
ÌÍßOM‹ÖÝ
ÌÍŸOMKÖÝ
ÌÍOM‹ÖÝ
ÌÍŒßOM‹ÖÝ
ÌÍŒŸOMËÖÝ
ÌÍŒ_OMÖÝ
ÌÎONK]VÝ
ÌÎLKÏ]VÝ
ÌÎL_K]VÝ
ÌÎLßKÖÝ
ÌÍŒOLLŽVÝ
ÌÍŒK]VÝ
ÌÍ_KÖÝ
ÌÎLßOLNLŸ‹ÖÝ
ÌÍ_OLLŽ‹ÖÝ
ÌÍŽOLLŽVÝ
ÌÍŽKÖÝ
ÌÍÍOLLŽVÝ
ÌÍÍKÖÝ
ÌÍÎ_OLLŽVÝ
ÌÍÎ_KÖÝ
ÌÎßOLLŽVÝ
ÌÎßK]VÝ
ÌÎ_KÖÝ
ÌÎL_OLNLŸËÖÝ
ÌÎLOLNLŸÖÝ
ÌÎ_OLLŽ‹ÖÝ
ÍLŽ_OLLŽVÝ
ÍLŽ_KÖÝ
ÍM_OLLŽVÝ
ÍM_KÖÝ
Í_OLLŽVÝ
Í_KÖÝ
ÍßOLLŽVÝ
ÍßKÖÝ
ÌÎNOLLŽVÝ
ÌÎN_Y[˜Ý[ÛˆÜŠK‹K‹
^Ý˜\ˆËLLOLLOLLÒXÏRLNLŸQOYVÐOŒ—NÙNžÝžÙ›ÜŠÜLK

OYÖÌ—JJOL
L‹OŒŽMMÌ
ROŒŽMMÌŽÌÎ
JKJVÌ
O\
ÙŸ
WHOLÌŸVÒJÌ_HOMŠNÊ^ÚYŠLMŒŒŽMMÌLÍJXœ™XZÈÓ

XÊÌÌŸ
JÚ‹
KÖÊ\
Ú
JÕOM‹RJÌß\
Ì_ZYŠ
^Ù›ÜŠLÒO\\
Ì_ŒŒÉVÙŠÒ_NÊNÚYŠJ
RJÚ
JÌOŒŒMŒ
I‰Š

XÊÌÌŸ
JÚ‹JKÖÜ
ÕOL˜J‹‹K‹
JJ^ÙVØOŒ—OLLŽVØOŒ—KVÌÌÌOZLNØœ™XZÈ___Y›ÜŠLÎÊ^ÚYŠOJQJJÌ_ŒŒÉŠ]VÌJJZYŠYŸ

HOMŸÖÌÌJÊŠØß
_KMŒLL
^ÚYŠÖÊÊÌÌŸ
JÙŸO\LMNK

YŠÌ_
JHOLMNJXÛÛ[Y_Y[ÙHYŽÙ[ÙHYŽØœ™XZßYÖÊXÊÌÌŸ
JÜOLX˜J‹K‹K‹
NÝšYŠ	VØJÌßJ^ÚYŠ]Š‹O]
ÌŽ
J^ÚYŠOYVÝ
ÌŽŒ—JÌ_VÝ
ÌŽŒ—ORK
JO
Xœ™XZÈÙÖÌ—OLØœ™XZÈSJK‹Œ
KVÝ
ÌŽŒ—OL_Y[ÙHVÝ
ÌŽŒ—OLÝžÚYŠYŠ^ÚYŠL	VØJÍ_I‰ŠOUÝ
ÊÌŽXÊÌÌŸVØÊÌÌŸOONMJKÝ
VØÊÌŽŒ—KŠKYŠÒ_
KJŒŸŠJ^ÚYŠÖÌ—OLJM‰›‰‰VÌ
LÌJÊ
Øß
_
WOOLLJI‰ŠJM‰›Š_VÌ
JJÊÌÌŸ
JÜ
KL_
WHO]VÜLŸJJXœ™XZÈÙÖÌ—OLX˜JÊÌÌŸK‹K‹
_ZYŠYŠXœ™XZÈZYŠYVØOŒ—KVÝ
ÌMÌŸI‰ŠMLÍŽÌLL‹VØOŒ—OZ
KLKJLÍŽÌLL‰š
JXœ™XZÈNÌ‰›‰‰ŠÖÍONNL‹VØÊÌMŒ—O\‹
LÌŽNÍÌÊÌMŸ
KYVÐOŒ—KVÐOŒ—OLLÌŽN	VÌNÎI‰Š
OXÊÌÌŸO]Y‹]
KÖÝ
Ð_OLVØÊÍŒ—OLLÌŽNYVÍÌNMWKVØÏŒ—OPKJÍL‹ÊJJ_YÖÌ—OLL\™]\›ˆXÊÌNLŸY[˜Ý[Ûˆ˜JJ^Ý˜\ˆLOLLÜLÌIÙNžÝžÜŽžÚYŠ

	NMŠJOONMŠ]KLNÙ[Ù^ÚYŠ

HOM
Xœ™XZÈŽÝL_ZYŠŒLMJXœ™XZÈNÐOYVÌŒÌLÍŠÊŠOŒ—JÔÊJ_Øœ™XZÈZYŠŒLMJXœ™XZÈ_]YVÊO\ŠJÌLMŒMŒ—KVØJÌŒÌLÍŒ—OJJOLÊ
OŠJOÐNŒYNžÝžÜŽžÜÎžÛÎœÝÚ]Ú
‹L_
^ØØ\ÙHNšYŠJYVÍLÍNWJJXœ™XZÈÙVÍMÌŽOYVÍLN—KOYVÍLMÎWKYVÍLMÎK]
ŒLNLYLÊKVÍLLŽL×OLOJJJ
OYVÍLÎWJJOŒ
OÌLÌŠŠOMMNOÍMNNœŠOÛØNŠJOLLÌLNŒVÍLÍMWOPKJÊ‹VÍLÍMJJKÌYLßVÍLLŽL—O\‹VÍMÌŽWOJJOŒŒÜNOÜŽŒVÌÌÌÍ×OJÊLP_
ÊVÙVÍLÎM×JÌLMNMŸK
ÊVÍLÎ×KMJJKÌL
JKÌMŸ
JKÍLØœ™XZÈÎØØ\ÙH˜œ™XZÈÎØØ\ÙHŽ˜Ø\ÙHLŽ˜œ™XZÈNØØ\ÙH˜œ™XZÈŽÙY˜][˜œ™XZÈZYŠJYVÍLÍNWJJXœ™XZÈ\™]\›ˆOLM‹

J
YVÍLÎWJJOLLOÌLNœŠJOMLI‰ŠOLMŠÊ

Ê‹JKLLL	MLÍJOŒ
KÍL
_
KÖÝ
ÌMŒWOJÊÖÝ
ÌŒÍŒWKJJKÌM‹ÖÝ
ÌMŒWOJÊÖÝ
ÌŒÎŒWKJJKÌM‹ÖÝ
ÌMŽŒWOJÊÖÝ
ÌŒWKJJKÌM‹ÖÝ
ÌMÌŒWOJÊÖÝ
ÌŒWKJJKÌM‹ÖÝ
ÌMÌŒWOJÊÖÝ
ÌŒWKJJKÌM‹ÖÝ
ÌMÍŒWOJÊÖÝ
ÌŒWKJJKÌM‹YVÍLÎLKÖÌL™L×OJÊÖÌLŒÍ—KÊLÊJÌMŸ
JKÌM‹›ÚY
ÖÌLNNNWOJÊÖÌLŒÍWKÊMŠJÌMŸ
JKÌMŠ_YVÍLÍNWI‰ŠVÍMÌŽOYVÍLN—KYVÍLMÎWKOYVÍLMÎK]
ŒLNLYLÊKVÍLLŽL×OLJOJOJ
YVÍLÎWJJOŒ
OÌLÌŠJOMMNOÍMNNJOØOÜŽŠ
OLLÌLŒVÍLÍMWO]OJÊKVÍLÍMJJKÌYLßVÍLLŽL—OPKVÍMÌŽWOJ
OŒŒÐONÐNŒVÌÌÌÍ×OJÊL]
ÊVÙVÍLÎM×JÌLMNMŸK
ÊVÍLÎ×KMJJKÌL
JKÌMŸ
JKÍL
_\™]\›ŸYVÌÌÌÍ×OJÊVÙVÍLÎM×JÌLMNMŸK
ÊVÍLÎ×KMJJKÌL
JKÌMŸY[˜Ý[ÛˆœŠKŠ^Ý˜\ˆOLLLÏLLLOLLOLLÜ‰‰ŠVÜŒ—OL
NÙNžÝšYŠJ

OYÖÌJJO
J^Ù›ÜŠÎÊ^ÚYŠ

LMI˜JJOOLÌŸNOŒJ^ÚYŠ

OYÖÌ
]
Ì_
WJJOL
XÛÛ[YNØœ™XZÈXœ™XZßZYŠJMI˜JJXœ™XZÈ_Y›ÜŠÎÊ^ÚYŠ

O\LMI˜JJOOLÌŸKNOŒJXœ™XZÈNÚYŠ

HOLL

O]VÌ
]
Ì_
WJJOOLL
^ÝžÚYŠ

OYVÌÍŒLMWJJOLŠ^Ù›ÜŠOLKKLKOLÎÊ^ÜŽšYŠJJYVÌM
ÊOŠOŒ—J_VÚ
ÌL_OOLMJJ^ÙYVÚŒ—NÜÎžÛÎžÚYŠŒLÌÊ^ÚYŠLÏL
MI™ŠOOJ
I‰ŠÏLK
]VÝ
Ì_JOŒÌß
ŠHOJŽ	ŒMJ_
ÏL‹
]VÝ
ÌŸJOŒÌß
ŠHOJŒM‰ŒMJ_
ÏJJ]VÝ
ÌßJOŒŒÌ‰ŠŠOOJŒ
JOÍŒËL[Ÿ
JJK

OJÊJXœ™XZÈŽÚYŠMJI•
JXœ™XZÈÎØœ™XZÈßZYŠÏL

OL
Xœ™XZÈŸZYŠŠ
XÊOÊIŒMJXœ™XZÈŸRO]VÚ
ÌLK[ŸZYŠ
JOOJ
OXJÌ_
JJXœ™XZßZYŠJXœ™XZÈ\™]\›ˆ‰‰•Ý
‹
K›ÚY
ÖÌWOL
_YÖÌWORKJ

OLOÌN›
JÝO[PJÌ_ÝšYŠ
JOOLŒJ^ÜŽšYŠ

]VÌJJOOLÌŸ‹NOŒJXO[Ù[ÙHYŠO[ŠY›ÜŠÎÊ^ÚYŠÖÌWOQXJŠKOXJÌ_

]VÌ
]
Ì_
WJJOOLÌŸ‹NOŒJXœ™XZÈŽÚYŠ[ŠXœ™XZßZYŠÖÌWOL[Š^ÚYŠOXKŠMNLÊJXœ™XZÈÜ™]\›ˆ›ÚY
ÖÌOL
_YÖÌWOLLOXJÌ_XO]VÌ_Y[ÙH[ÚYŠJMI˜JJXœ™XZß_YÖÌWOLY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆLOLLLÏLÙNžÝžÜŽžÜÎžÛÎœÝÚ]Ú


YVÝ
ÍŒ—JJOOYVÝ
ÌLŒ—OÜ]ÙJ
NŠVÝ
ÍŒ—O\ŠÌK]VÌ—JK‹Mß
^ØØ\ÙH˜Ø\ÙHŽ˜œ™XZÈÎÙY˜][˜œ™XZÈßZYŠJŠOOMKÏHPK

YVÝ
ÍŒ—JJOOYVÝ
ÌLŒ—OÜ]ÙJ
NŠVÝ
ÍŒ—O\ŠÌK]VÌ—JKß
O\‹MN
OŒŽMMÌŽJXœ™XZÈŽÚYŠVÝ
ÌLMŒ—O
Xœ™XZÈÙVÝ
ÍŒ—OYVÝ
ÍŒ—KLNØœ™XZÈPO\‹MNZYŠJOŒŽMMÌŽŠJ^ÚYŠ
O\‹M
OŒL
^Ù›ÜŠÛJ
OJOTÊKL
JÜŸ
KM
JOŒMÍÍ

OYVÝ
ÍŒ—JJOOYVÝ
ÌLŒ—OÜ]ÙJ
NŠVÝ
ÍŒ—OPJÌK]VÌWJK‰ŠO\‹M
OŒNNÊNÛXOŒÌ_\ŽšYŠJOŒLL
JY›ÜŠÎÊ^ÚYŠOJOPPJK‹L
JJÜŸ[KPOŒOŒÜŠÌ_œ‹OPKM\‹JOŒ
_

OYVÝ
ÍŒ—JJOOYVÝ
ÌLŒ—OÜ]ÙJ
NŠVÝ
ÍŒ—OPJÌK]VÌWJK
O\‹M
OŒŽJXœ™XZÈŽÚYŠJOŒŒŒMNÌ‰ŠŠOLŒMÍÍŸ
ŠOŒMÍÍŠJXœ™XZßZYŠOŒL
Y›ÜŠÊ
OYVÝ
ÍŒ—JJOOYVÝ
ÌLŒ—OÐO]ÙJ
NŠVÝ
ÍŒ—OPJÌKO]VÌWJKKMŒLÊNÊ
OYVÝ
ÌLMŒ—JJOŒ
JOL	‰ŠVÝ
ÍŒ—OYVÝ
ÍŒ—KLJKXKO[Ì][ÌJHJ
JÛŸ
_›ŽØœ™XZÈ__ZYŠKLŒMÍÍJVÝ
ÌLMŒ—O
J\™]\›ˆVÝ
ÍŒ—OYVÝ
ÍŒ—KLKOKLŒMÍÍ\™]\›ˆO[‹_Y[˜Ý[ÛˆØJ
^Ý˜\ˆOLLOLLÚYŠVÌÍÌ—OLLLVÌÍÌ×OLLVÌÍÍOMLVÌÍÌOMKOYVÌŒÌLÍŠÊ

OOLÌÌŽŽ
OŒ—KOYVÌÌŽMÌ—K

YVØJÎŒ—JJOŒ	‰ŠOJÊKŠJKÌL
KJJOLÍNOÌÍNNKJ
OJJOMLÍLJJOŒÎNOÍŽŠJOŒÍÎOÍÎVÊ
ŠONÎœŠJÌLNMŸKI	‰ŠVÌÌL—OJÊ‹VØJÍÌŒ—JJKÌM‹VÌÌL×OJÊ‹VØJÍÍŒ—JJKÌM‹VÌÌLŽOJÊ‹VØJÎŒ—JJKÌM‹Œß
\‹L_VÌÌLŽO[‹VÌÌL—O\‹VÌÌL×O[ŠJK‰
^ÝYVØJÍÌŒ—NÙNžÝžÜŽžÜÎžÛÎžÛŽžØÎžÝNžÚYŠ
JOLÍLJXOPKLÍLVÌÍÌ—ONKJ

MI˜JOŒ
KÌß
IŒMKOMŒJOŒß
_Ù[Ù^ÚYŠ
JOLJXœ™XZÈNØOPKLLVÌÍÌ—OLLLJOŒŸ
KOLLLJOŒ_
_ZYŠVÌÍÌ×OXKJÊŠJKÌMŸVÌÍÌWOLLL
Ê
ÊML
JKÌLŽ
KOŒLÍJXœ™XZÈÎÚYŠPKLÍLVÌÍÌWO]VÜŠÌLŒŒKOŒÎL
Xœ™XZÈÎÚYŠVÌÍÍOML
Ê
JÌLLŒ
KËLŒ
KOŒJXœ™XZÈŽÙVÌÍÍONŒPKLLŽØœ™XZÈ]JÊŠJKÌMŸVÌÍÌWOJJOLMÌÌLL
Ê
ÊML
JKÌLŽ
_ŒLŽ
Ê
ÊKÌLÌ
_]J
KÌLM_Øœ™XZÈZYŠLL‹OŒÌ
Xœ™XZÈÚYŠLLËOŒM
Xœ™XZÈÎØœ™XZÈZYŠJ
KÌLM_VÌÍŽO]OŒÍÍJXœ™XZÈŸ]LMØœ™XZÈZYŠ
JOÍLJXœ™XZÈNÝ]VÜŠÌLŒÌÍŸ_YVÌÍŽO]YVÌÍŽWOJ
OLMÌMŽ_Y[˜Ý[ÛˆØJKŠ^Ý˜\ˆK‹ÎØOKŒMŒJŠÙVÍLÍ×KVÜŒ×OXKVÜŠÍŒ×OKŒMMŒJŠÙVÝ
ÌLLŒ—KVÜŠÍŒ×OKŒMMŒJŠÙVÝ
ÌÍŒ—KVÜŠÍMŒ×OKŒÎLŒJŠÊÊÖÝ
ÌMŒWKÖÐJÍŒWJJJÈ
ÚÖÝ
ÌŒŒŒWKVÜŠÍŒ×OKŒÎLŒJŠÊÊÖÝ
ÌMŽŒWKÖÐJÍŒWJJJÈ
ÚÖÝ
ÌŒŒŒWKVÜŠÍÌŒ×OKŒÎLŒJŠÊÊÖÝ
ÌMÌŒWKÖÐJÎŒWJJJÈ
ÚÖÝ
ÌŒŒWKVÜŠÎŒ×OKŒÎLŒJŠÊÊÖÝ
ÌMÌŒWKÖÐJÌLŒWJJJÈ
ÚÖÝ
ÌŒŒWKVÜŠÎŒ×OKŒÎLŒJŠÊÊÖÝ
ÌMÍŒWKÖÐJÌLŒWJJJÈ
ÚÖÝ
ÌŒŽŒWKZÖÝ
ÌŒÌŒWKZÖÝ
ÌMÍŒWKÏZÖÐJÌMŒWKVÜŠÌLLŒ—OLVÜŠÌLMŒ—OLLŒŒÌLVÜŠÌLŒ—OLVÜŠÌLŒ—OLLLÌÌVÜŠÎMŒ×OKŒÎLŒJŠÊÊÊJJÈ
ÊŠKVÐJÍOÊVÜŠÌNŒ—OLVÜŠÌNŒ—OLLÌŽLÌVÜŠÌLŒ×O]VÐJÍOJNŠVÜŠÌNŒ—OLVÜŠÌNŒ—OL
KVÜŠÌLŒŒ×OKŒÎLŒJŠÚÖÝ
ÌŒŒWJŠÊVÐJÌÍ_OJKVÜŠÌLŽŒ×OKŒÎLŒJŠÚÖÝ
ÌŒŒWJŠÊVÐJÌÍŸOJKVÜŠÌLÍŒ×OKŒÎLŒJŠÚÖÝ
ÌŒŒWJŠÊVÐJÌÍßOJKO]VÐJÌÎKZÖÝ
ÌŒŒWKVÜŠÌMÍŒ—OLVÜŠÌNŒ—OLLÎMMÍLŽVÜŠÌMŒŒ—OLVÜŠÌMŒ—OLLÌLŽNM‹VÜŠÌMLŒ—OLVÜŠÌMMŒ—OLLÌLŽNM‹VÜŠÌÍLŒ—OLVÜŠÌÍMŒ—OLLÌŽLÌVÜŠÌMŽŒ—OLVÜŠÌMÌŒ—OLLÎMMÍLŽVÜŠÌMŒ×OKŒÎLŒJŠÊ
JŠÊOJKYVÍLÍÎWKVÜŠÌÍŽŒ×OXKVÜŠÌÍŒŒ×OJÊ
KÌL
ŒßY[˜Ý[ÛˆØJ
^Ý˜\ˆOLÚ]
ÜŠ
JNÙNžÝžÜŽžÜÎžÛÎžÛŽžØÎžÝNžÛžÚNžÚYŠ

KLLMÍ‰›JJOŽÍMM_

OLŽÍMMJ^ÜžØŽžÚYŠ

OÌÍMMÌ_

OLÌÍMMÌJ^ÚYŠ

OÎŒß

ONÎŒÊ^ÚYŠOMLÌŽL	Š
OOKLŒMÍÍ
Xœ™XZÈNÚYŠ

HOKLŒMÌŽLÍ
Xœ™XZÈÜ™]\›ˆMMÌMŸZYŠL	Š
OONÎŒ
Xœ™XZÈŽÚYŠ

HOLMÍÍÌŒMŠXœ™XZÈÜ™]\›ˆLÍNZYŠ

OÌLÌÌMÊXœ™XZÈÚYŠL	Š
OOLÌÍMMÌŠXœ™XZÈŽÚYŠ

HOMÌL
Xœ™XZÈ\™]\›ˆŒÌZYŠL	Š
OOMÌLÌÌMŽ
Xœ™XZÈNÚYŠL	Š
OOLLÍŒMÍÌŽ
Xœ™XZÈÎÚYŠ

HOLLÎLŒÌŠXœ™XZÈÜ™]\›ˆŽMMŸZYŠ

OMŒLLÍÎL_

OMMŒLLÍÎLJ^ÚYŠ

OLÍŽÌLL_

OMLÍŽÌLLJ^ÚYŠL	Š
OOLŽÍMMŠXœ™XZÈÎÚYŠ

HOLÌŒŽMÍŒ
Xœ™XZÈÜ™]\›ˆŽNLŽZYŠL	Š
OOMLÍŽÌLLŠXœ™XZÈÎÚYŠL	Š
OOMLÎMŽ
Xœ™XZÈŽÚYŠ

HOMMLLŒMŠXœ™XZÈÜ™]\›ˆMŽLÎ_ZYŠ

OLÍNÎMÍ_

OLLÍNÎMÍJ^ÚYŠL	Š
OOMMŒLLÍÎLŠXœ™XZÈNÚYŠ

HOLLÌÍÍN
Xœ™XZÈÜ™]\›ˆLÌLŒZYŠL	Š
OOLLÍNÎMÍŠXœ™XZÈNÚYŠL	Š
OOLLÍÎLÍŒLŽ
Xœ™XZÈÚYŠ

HOLLÎNÌ
Xœ™XZÈ\™]\›ˆŽNLÎ\™]\›ˆMLŽ\™]\›ˆMNLMŸ\™]\›ˆLÍŒŒ_\™]\›ˆMNLNMß\™]\›ˆŒŒ\™]\›ˆŒŒMÍ\™]\›ˆŒÎMŒNLPOLMŒÎ\™]\›ˆ_Y[˜Ý[ÛˆŠK‹K‹
^Ý˜\ˆË‹LOLLOLÚYŠNÎŒÉOYVÌÍM—K]VÌ
YŠÒ_
W_VÝ
Ì_O
^ØÏHJ]VÝ
ÌŸJKYVÌÍÍOË
ŠOLÜ\ŠJÊVÍLÍMKŠJKÌYLÏËJ
O

OJÊ‹
JKÊ
_
JOÑN
KJŠOŒÊÊ‹ŠJKÌMŸœ‹JÊ‹VÌÍÌWJJKÌMŸJ
O

J	˜JOŒŸ	‰ŠŠOŠŠOÛŽœŠJOÜŽ
\Œ_JŠKÌŸ
NÙNšYŠJ

O
J^ÚYŠOYŠÍM‰J]YVÍLÍNKVÌÍÎWO]VÊOLŒMŒNLŠÊ
_
OŒ—OMËVÐJÎŒ—OXJÒKVÐJÍŒ—O\MŸ‹ZÙ[Ù^ÚYŠYVÍLÍNKVÌÍÎWO]VÊLŒMŒNLŠÊ
_
OŒ—OM‹ZVÝ
ÌLŒ—O[VÝ
ÎŒ—OXJÒKO]TÊO\ŒŸÊKJŠOŠ
KVÒJÍŒ—O[Ýœ‹OYVÍLÍNJÌ_VÍLÍNOJJOLMŽOÒNŒ

O

[Ü‹]Œ
JJY›ÜŠPOKXJÊÐN›Š_ÐOYVÍLÍNKVÌÍÎWOPKVÊOLŒMŒNLŠÊO
_
OŒ—OM‹VÐJÍŒ—O[‹VÐJÌLŒ—O[VÐJÎŒ—OZ
ÙVÌÍM—KOYVÍLÍNJÌ_VÍLÍNOJJOLMŽOÐNŒ

O

\‹[Ÿ
JNÊNÚYŠ
ŠOL
Xœ™XZÈNÝYVÍLÍNKVÌÍÎWO]VÊOLŒMŒNLŠÊ
_
OŒ—OM‹VÐJÍŒ—O\‹VÐJÎŒ—OYVÌÍM—JÊJÊ\Ê_
_YVÌLŠÊŒMŒNLŠÊ
_
OŒ—O[YVÍLÍNJÌ_VÍLÍNOJ
OLMŽOÝŒ__Y[˜Ý[Ûˆ
KŠ^Ý˜\ˆKLLÚYŠŒMLLŠ\™]\›ˆJKŠKØO]
ÜŸÙNšYŠÉŠJJZYŠOŒ
\]Ù[ÙHYŠ
XKM
OŒŒ
\]Ù[ÙH›ÜŠ]ÙÖÌ—O]VÌWKÖÜŠÌ_O]VÐJÌ_KÖÜŠÌŸO]VÐJÌŸKÖÜŠÌßO]VÐJÌßKOPJÍŒJ\ŠÍ
OŒÊNÙ[Ù^ÝšYŠÉ
ZYŠŠY›ÜŠ]ÎÊ^ÚYŠÖÌ—O]VÌWKOPJÌ_JÉŠ\ŠÌ_
JJXœ™XZÈÚYŠJŒOŒ
JXœ™XZßY[ÙH]Ù[ÙH]ÚYŠJ
KM	˜JOŒ
[ŠËM
OŒŒ
JY›ÜŠÙVÜŒ—OYVÐOŒ—KVÜŠÍŒ—OYVÐJÍŒ—KVÜŠÎŒ—OYVÐJÎŒ—KVÜŠÌLŒ—OYVÐJÌLŒ—KVÜŠÌMŒ—OYVÐJÌMŒ—KVÜŠÌŒŒ—OYVÐJÌŒŒ—KVÜŠÌŒ—OYVÐJÌŒ—KVÜŠÌŽŒ—OYVÐJÌŽŒ—KVÜŠÌÌŒ—OYVÐJÌÌŒ—KVÜŠÌÍŒ—OYVÐJÌÍŒ—KVÜŠÍŒ—OYVÐJÍŒ—KVÜŠÍŒ—OYVÐJÍŒ—KVÜŠÍŒ—OYVÐJÍŒ—KVÜŠÍLŒ—OYVÐJÍLŒ—KVÜŠÍMŒ—OYVÐJÍMŒ—KVÜŠÍŒŒ—OYVÐJÍŒŒ—KOPKHMŒJ\‹HM
OŒÊNÚYŠŒ[Œ
Xœ™XZÈNÙ›ÜŠÙVÜŒ—OYVÐOŒ—KOPJÍŒŠ\ŠÍ
OŒÊNßZYŠŒOŒ
Y›ÜŠÙÖÌ—O]VÌWKOPJÌ_
JHOJ
\ŠÌ_
JNÊNÜ™]\›ˆY[˜Ý[ÛˆÜŠ
^Ý˜\ˆOLLOLLLÏLLLÑŠ
Ý
KOLÊJKÊ
NÙNžÚYŠ
OJOPOŒŒ	ŒŒÊKNMŽ_
OŒŒÊ\PNÙ[Ù^ÚYŠ
JO
\™]\›ˆ
ÌNÚYŠJOŒLÌÊJ^ÚYŠŠ
Ý
KOLÊJKLJÊ
JIŠJOOKLLMÍŠXœ™XZÈNÜ™]\›ˆOŒLŒÏÝ
ÌNŠJOÊVÊORLMŸ
JÎŒ×OLLŽŒŽMÍLÎLNMÙKLËLŽŒŽMÍLÎLNMÙKLÊžVÐJÎŒ×JNŠVÊORLMŸ
JÎŒ×OLÌLLÍŒNŒMNLŒM‹ÌLLÍŒNŒMNLŒMŠžVÐJÎŒ×J__ZYŠ^VÌMWKJJJJ^VÌMJ
ÜŠK\ŠJžVÌMLWJÊŠžVÌMLJÝ
JJ
JœŠŠ
žVÌMMWJÞVÌMMJKŠ]
žVÌML×JÞVÌML—KŠ
ÛŠKÊJKLÊ
K[
ÊŠÊVÊOY	ŒŒÌŠJÌLMLÍÍŒ×JÝ
JKÏYVÊOXJÌLMLÎ
OŒ—KOJLÊJÊOYVØJÍŒ—J_OJOJOXÊJÊÏL
_
OŒÏŒÐJÌ_K\
\™]\›‹LŒMÍÍ	™ÊŠJKŠKJÌLÌMÌŸ
K
JJJÔJ
JJ
JÜŠOI‰ŠVÊORLMŸ
JÎŒ—OLVÐJÌLŒ—OLLMÍ‹VÐJÎŒ×OLŒŒLÌÎNLÌŒMKLÌ
žVÐJÎŒ×KJJ]
ÌJJÊŠÊ‹]
JÊ
ÊK[
JJJËLJOOLÌ
K
LŒŒLÌÎNLÌŒMKLÌ
NŠŠJKŠKKLLNLÌN
KMMŒLŽÎLÍŽYLŽ
Š
JÔJ
JJ
ÜŠJKÝŠJKŠKJKJJÔJ
JJ
ÜŸ\™]\›ˆŸY[˜Ý[ÛˆJJ^Ý˜\ˆ‹OLLLÏLÒ\RLMŸÙNžÚYŠ˜JÌÖÌWJJ^ÚYŠL‹˜JKÊ_
]VÌWHOLLM
K^˜JKLŒ
OÌLŽŽ›‹[^˜JKLJOÍLŽŽ›‹ÏM‹J
]VÌWJJOOLLMÛ˜ËJŠOOLLNOÍLLŸ›VÜŒ—OMÎVÜŠÍŒ—OL
LJLLÌÍŽ

ŠOONMÏÌL›
KŠJOŒMŽMMŒÌŒI‰ŠVÍMÎNOL]KLJK

O
Xœ™XZÈNÒ[RLÌŸÝžÜŽžÚYŠ˜JÌÖÌWJJ^ÚYŠO]JLMÍŠJXœ™XZÈŸY[ÙHVÍMÎNOLŽÐOLØœ™XZÈY]
KM
K˜JKÊ_
VØOŒ—O]VÌWOOLLMÎ
KVÌWOONMÏÊL	ŠOLYJË
J_
_LLVÛŠÌMŒ—OPKVÛŠÌŒŒ—OPOŒÌKYJŠÌMŸ
JKOLLŽVØOŒ—KVØOŒ—OPJNOYVØOŒ—KVØJÎŒ—OKLKVØJÍŒ—OLLVØJÍŒŒ—O]VØJÍŒ—OXJÌML‹	_
VÛŒ—O[ŠÌVÛŠÍŒ—OLYJŒMLŒËŠ_
VØJÎŒ—OLL
JKVØJÍŒ—OLLVØJÌÍŒ—OLLKVØJÌÌŒ—OLL‹VØJÌLŒ—OLLËVÌŒÌŒW_
VØJÍÍŒ—OKLJKVØJÍMŒ—OYVÍMŽM—K
OYVÍMŽM—JI‰ŠVÐJÍLŒ—OXJKVÍMŽM—OXKOX_ZYŠ[ŠÌÌŸOPJXœ™XZÈNÞYJ
_Y[ÙHVÍMÎNOLŽØOL\™]\›ˆ\ŠÌMŸ_Y[˜Ý[ÛˆÊKŠ^Ý˜\ˆKLLÏLLLÚYŠÏ]XORLŒVØJÎŒ—OLKVØJÌLŒ—OLPOŠ^Ù›ÜŠVØJÌMŒ—OMVØJÌŒŒ—OMOMMLŽÝPKOJŠÍ
JÐ_VÊJÌMŸ
JÊŠOŒ—OPK[
Ì_]OŒŒÊNÚYŠ
JÊÙŸ
KM
OŒXÏŒ
[LOLKLÙ[Ù^Ù›ÜŠLKOLNÌÉŸ›ÊVÊJÌMŸ
JÊ
PKL_
OŠOŒ—O]XÏŒÒÐJË‹JÎKJÌMŸ
NšÜÊË‹KJÌMŸ
K
JHOLOÊ›ÊJÎŠKOLJNŠ›ÊJÎJKOL
JNŠÜÊË‹KJÌMŸ
K›ÊJÎŠKOPJÌŸ
KL_
YVØJÎŒ—JKVØJÎŒ—O[ŒŠÏXÊÍ
OŒÊNÛ[ŒŒKYVØJÌLŒ—HOLZYŠÐJË‹JÎKJÌMŸ
K
JHOL_
Y›ÜŠÊJOLOÊ›ÊXJÎY™JŠJKYVØJÎŒ—K]
Ð_
NŠ›ÊXJÎŠKVØJÎŒ—OM×™VØJÎŒ—K›Ê‹JKÐJ
XËM
KYVÊXJÌMŸ
JÊ
PKLŸ
OŠOŒ—_‹‹KL_KŠK›Ê‹JKL_VØJÎŒ—KVØJÎŒ—O[ÐJ‹‹KŠJKO]ÏXËMVØJÌLŒ—_
JHOL_

HOLNÊNßRXJÌŒY[˜Ý[ÛˆXJK‹J^Ý˜\ˆ‹LÏLLÒ[RLÌŸ[LŒMÍÍÉ˜KÏ[LLŽNMŸÙNšYŠ
[LLMÎLMLŸ
OŒ˜ÏŒ
^ÚYŠ\OŒŽXOŒŽ

ILŽÍMMJJOOLLÍŒMÍÌŽ	ˆHJ
_OŒŒLÍŒMÍÌŽ
^ØÏ\ŠÌLÌÍÍNÏJ[
Ì_
OØÎ˜ÊÌ_Øœ™XZÈ_ZYŠÏ\ŠÌLÌÍÍN
JHOLLÍŒMÍÌŽ
Xœ™XZÈNØÏJLI›
OŒŠ]
Û
OŒØÊÌ_˜ßY[ÙJ\‰ŠŠOOLŒMÍNLLÈJJN™ŒŒMÍNLLŠOÊLÏLŒMÍLÌ‹ŒŒLMÎLML_
ÏL
YŒMŸ
OŒML_
JŠÌMŸK‹MMLÍI˜_MLÍ‹‹LMLŒÌß
KÜŠ‹K‹MLÍŒKYŸ
KJOYVÛŠÎŒ—JOOYVÛŠÌLŒ—OOŒŽYVÛŒ—KXÏYVÛŠÍŒ—KXÏŒŽÏPK

LŽÍMMI™ŠJOOLLÍŒMÍÌŽ	ˆHJ
O\ŸHJVÛŠÌMŒ—_VÛŠÌŒ—_VÛŠÌŒŒ—_VÛŠÌŽŒ—JJJ_ŒŒLÍŒMÍÌŽØÏJ[
Ì_
OØÎ˜ÊÌ__

HOLLÍŒMÍÌŽ
ÏJ[
OŒŠ[
ÊI›
_
OŒØÊÌ_˜ÊJJJNŠ\OŒŽÏMLŽÉŠXOŒŽ
_ŒMŽMNLÍŒ
NÜ™]\›ˆ[ŠÌÌŸŠ
KŠKLŒMÍÍ	˜_ÊK
ÔJ
_Y[˜Ý[ÛˆØJ
^Ý˜\ˆKLOLLLÏLÚYŠŠ
Ý
KÏLÊJKLÊ
K

XÏŒŒ	ŒŒÊJOOLŒÊ\™]\›Š
LJKÝÚYŠJO[JIŠ
XÏ_ŒÌJJOOLŒMLÎMŸŒŒMLÎMŠ\™]\›ˆXIŠŠOOLŒMLÎMÌ
ÚYŠ
\LLMÍI˜ßLMÍŽÙ[Ù^ÚYŠLO[L‹

XÏLŸŒŒ
JOŒ
ŠOL
Y›ÜŠÛ[L_\_OŒÌKOLK
ŠOŒ
ŠOLÊNØOLÌIŠLK[
K
ŒÉœŠOŒLÌÊ[KL
NŠJOJKLI›ŒÌ‹X_ÏKXJ_ZYŠO[‹

OŒLŒÊ^Ù›ÜŠÎÊ^ÚYŠJ

\ŠËLLMÍŸ
JO
[Š_JJ\™]\›ˆ
ÚYŠ\_OŒÌKOLKJ

[L_
JOŒLŒÊJXœ™XZß[LLŒßZYŠJ

\ŠËLLMÍŸ
JO
[Š_JJ\™]\›ˆ
ÚYŠ
ŠOOLLMÍ_ŒLMÍJY›ÜŠÛ[L_\ŒLŽ\_OŒÌKOLKŽÊNÜ™]\›ˆOKLŒMÍÍ	˜Ë

OŒÜ\ŠËLLMÍŸŒŠLK[Ï\‹XKOLÌI›‹
ŒÉ›ŠOŒLÌÊLOXÏ˜_
NŠXÏ˜_OJ
OJKLI˜ÊOÌ‹X_˜JJKŠJKŠKŸJK
ÔJ
_Y[˜Ý[Ûˆ\ŠK‹KŠ^Ý˜\ˆÏLLÒ[RLMŒÙNžÝžÜŽžÜÎœÝÚ]Ú

Ï]VÐJÌLJKLM_
^ØØ\ÙHŽ˜œ™XZÈŽØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈYÖÌOLØœ™XZÈ_YVÛŒ—OTÊVÜŠÍßK
JÌLÍÎM‹
Œ‹
KQ]

JÝØœ™XZÈ_ZYŠJ^ÚYŠÖÛ
ÌMOLÝPJ‹
Î
N’Ý
Ë
Î
K[
ÌMÏ]VÛ
ÌMJ^ÚYŠ
ÊOOLÌŠ^ÙÖÌOLØœ™XZÈ_LŒ	ŠÏXÏŒ
_
‰‰ŠVÛŒ—OXÊK[
ÌM_
_ZYŠJ

Q]
ŠJJOL
J^ÝQÝ
ŠJÛŸÖÌOLØœ™XZÈ__[LÝšYŠJJLMIŠÏYVÐOŒ—JJ_
ŠOOMÊJ^ÚYŠJ^ÚYŠ

LMI˜ÊJOONMJXœ™XZÈÜŽžÜÎžÚYŠ
ŠOOLÍJ^ÚYŠLËVÐJÌL_HOLŠXœ™XZÈÎØœ™XZÈZYŠ
\‹LÌŸ
OŒŽMJXœ™XZÈŸ\P–ÎLÎMLŠÊJOŒW_[Z\Š‹
_Y[ÙHÖÌOXËLNÙ›ÜŠÎÊ^ÚYŠJLMIŠÏN
J_
ŠOOMÊXœ™XZÈÚYŠJ^ÚYŠ
ŠOOLÍIVÐJÌL_OOLŠXœ™XZÈÚYŠ‹MŒL
XÛÛ[YNÊ\‹LÌŸ
OŒNMI‰ŠP–ÎLÎMLŠÊJOŒWJKZ\Š‹
ÛŸ
JÛŸY[ÙHÖÝ
ÛŸOXË[ŠÌ__YÖÌ
]
ÛŸ
WOL\™]\›ˆ[
ÌMŒY[˜Ý[Ûˆ

^Ý˜\ˆKLÐO]LLÌLŽÙNžÝžÚYŠJ

OLLŒß
LLÌLÌŒLÌŽ
LLÌLÌŒŒM
LLÌLÍŒMLÍŸ
LLÌLÍŒŒMÎLŸ
LLÌLÎŒNÌŸ
LLÌMŒÌŸ
LLÌMŒŒMŒ
LLÌMŒŽ
LLÌMŒŒŽMŸ
LLÌMŒŽM
LLÌMLŒÌÌŸ
LLÌMLŒŒÌŒ
LLÌMMŒÌÌŽ
LLÌMMŒŒÍMŸ
LLÌMNŒÍN
LLÌMŒŒÍÌLŸ
LLÌMŒŒŒÎ
LLÌMŒMŸ
LLÌMŒŒMŸ
LLÌMŽŒÍLŸ
LLÌMÌŒŒ
LLÌMÌŒŒL
LLÌMÍŒLMŸ
LLÌMÍŒŒLM
LLÌMÎŒMŒ
JJJJJJJJJJJJJJJJJJJJJJJJJJ^ÚYŠŒMMLŽMŠXœ™XZÈÜLLÌNZYŠ
JOP–Ê\ŠJÎŒWJXœ™XZÈ_]L\™]\›ˆY[˜Ý[ÛˆÝ
KŠ^Ý˜\ˆKLLÏLLÒXORLŒÖØJÎOLÙNžÚYŠ
PKLŒ
OŒLMN
POLLLÌŠÊJ_Ù[Ù^ÚYŠ
OPKMNLŸ
OŒŽ
Xœ™XZÈNÐOLLLÎLŠÊOJ_ZYŠOP–ÐOŒWJ^ÚYŠÏPOMŒM‹JMŒÉJOŒŒÍÏÛŠÍN_šÖÌLMN
ÊJOŒWKPOŸ
ÊO
[MNJÊŒÉ›Š_OPOŒL‰ÎÙ[Ù^ÚYŠJLÌI›ŠJXœ™XZÈNÛLOPOŒLIŒM_JT]
VÌLŽNLŒ
ÊÊOŒ—KJÌLLŸ
JI‰ž\Ê‹JÌMÍŸ
I‰ŠI‰M‰”]
VÌLŽNLŒ
ÊOÊOŒ—KJÎ
I‰ŠQ]
OQÝ
‹JÎ
JKÖØJÎOLPJÜŸ
KÊ\ÊO]‹XJÌM
KVØJÍŽŒ—OXJÎVØKHMŒ—O]VØJÍŒŒ—OM‹VØJÍLŒ—OLŒËVØJÍMŒ—OXJÌMÍ‹VØJÍŒ—OXJÌLL‹
‹LKJÍ
JNŠÊOÑÝ
‹JÌMÍŸ
NŒI™VÝ
ÌMŒ—_M‰›ÊVØJÌÍŒ—OLŒËVØJÍŒ—OM‹VØJÍŒ—OXJÌMÍ‹VØJÌÌŒ—OXJÌLL‹
‹ÌJÌÌŸ
JNŠVØJÌMŒ—OLŒËVØJÎŒ—OLŒËVØOŒ—OMVØJÌLŒ—OXJÌLL‹VØJÍŒ—OXJÌMÍ‹
‹‹JJJ__RXJÌŒY[˜Ý[Ûˆ

^ÙÝ

KVÍMNLŽOLVÍMNL—OLVÍMNL×OLVÍMNLOLVÍMŒOLVÍMŒWOLVÍMŒ—OLVÍMŒ×OLVÍMŒŒOLVÍMŒŒWOLVÍMŒŒ—OLVÍMŒŒ×OLVÍMŒÍ—OLVÍMŒÍ×OLVÍMŒÎOLVÍMŒÎWOLVÍMNMÍOLVÍMNMÍWOLVÍMNMÌ—OLVÍMNMÌ×OLVÍMNNOLVÍMNNWOLVÍMNNLOLVÍMNNLWOLVÍMŒOLVÍMŒWOLVÍMŒ—OLVÍMŒ×OLVÍMŒŒOLVÍMŒŒWOLVÍMŒŒ—OLVÍMŒŒ×OLVÍMŒÍ—OLVÍMŒÍ×OLVÍMŒÎOLVÍMŒÎWOLVÍMŒL—OLVÍMŒL×OLVÍMŒMOLVÍMŒMWOLVÍMŒŽOLVÍMŒŽWOLVÍMŒÌOLVÍMŒÌWOLVÍMŒ—OLVÍMŒ×OLVÍMŒOLVÍMŒWOLVÍMŒL—OLVÍMŒL×OLVÍMŒLOLVÍMŒLWOLVÍMŒLNOLVÍMŒLNWOLVÍMŒLM—OLVÍMŒLM×OLVÍMŒLÍOLVÍMŒLÍWOLVÍMŒLÌ—OLVÍMŒLÌ×OLVÍMŒMLOLVÍMŒMLWOLVÍMŒMOLVÍMŒMWOLVÍMŒM—OLVÍMŒM×OLVÍMŒMOLVÍMŒMWOLVÍMŒN—OLVÍMŒN×OLVÍMŒNOLVÍMŒNWOLVÍMŒNNOLVÍMŒNNWOLVÍMŒNM—OLVÍMŒNM×OLVÍMŒŒMOLVÍMŒŒMWOLVÍMŒŒL—OLVÍMŒŒL×OLVÍMŒŒÌOLVÍMŒŒÌWOLVÍMŒŒŽOLVÍMŒŒŽWOLY[˜Ý[ÛˆJJ^Ý˜\ˆLOLLLÏLLLOLLOLÙNžÚYŠ

YVÝ
ÍŒ—JJOOYVÝŒ—JZYŠ
ÏYVÝ
ÎŒ—JOŒ
YVÝ
ÌLŒ—JOŒ
\JJJÊ‹XÏŒŠ_
KÌŠJØß

HOJÊI‰Š™J\‹JOXË[
_JKYVÝ
ÎŒ—JKVÝ
ÍŒ—O\‹VÝ
ÎŒ—O[ŠÛÙ[Ù^ÚYŠ
OJŠOOJ
OÌNœ‹[ŒJOŒLLÌÍÍN
Xœ™XZÈNÚYŠJWØJXOŠJJÜŸ\JJÌÉ‹M
JÜ

HOJÊJ^ÚYŠOKM	ŠÏXË[
K\‹O[ÏLJÊ
OXËM
OŒŸ
IÊY›ÜŠLÙVÛŒ—OYVØOŒ—KOXJÍ[ŠÍ
ÊHOJ
YŠÌ_
JNÊNÚYŠ\ŠÑ_JOŒŽ
JY›ÜŠÙVÛŒ—OYVØOŒ—KVÛŠÍŒ—OYVØJÍŒ—KVÛŠÎŒ—OYVØJÎŒ—KVÛŠÌLŒ—OYVØJÌLŒ—KVÛŠÌMŒ—OYVØJÌMŒ—KVÛŠÌŒŒ—OYVØJÌŒŒ—KVÛŠÌŒ—OYVØJÌŒ—KVÛŠÌŽŒ—OYVØJÌŽŒ—KOXJÌÌŸ
ŠHOJ
[ŠÌÌŸ
JNÊNßYVÝ
ÌLŒ—OZVÝ
ÎŒ—OY‹VÝ
ÍŒ—O\‹VÝŒ—O\	‰ŠJ
KYVÝ
ÍŒ—J_Y[ÙH[Ü™]\›ˆVÜ‹MŒ—OYVÐOŒ—K›ÚY
VÝ
ÍŒ—OYVÝ
ÍŒ—KM
_XÚJ
KŠ
_Y[˜Ý[ÛˆÊKŠ^Ý˜\ˆOLLLÏLLLOLLOLÙNžÝžÜŽžÜÎžÛÎžÛŽžØÎžÝNžÛžÚYŠJ^ÚYŠ\ŠXœ™XZÈØœ™XZÈ_\™]\›ˆ	OJO]
KTÊJŒ
KÊŒ
_Š_ÙOLOLZYŠ]
Xœ™XZÈÎØœ™XZÈŸZYŠJ
O\‹L_
IœŠJXœ™XZÈÎÛLJÏJYJŠJÌÌß
K[YJJ_
_Øœ™XZÈŸ\™]\›ˆ	OLÙOPKTÊJOŒ
KÌ
_OLZYŠ
OLÌ‹[YJJ_
OŒÌJXœ™XZÈÎØœ™XZÈZYŠ	O]	˜KÙOL
ŠOOLJXœ™XZÈNÜ™]\›ˆLÌIŠOYšJŠJK
ŒÉ˜JOŒLÌÝPOœŸŠPOœŸJ
OŠKLIJOÌ‹\ŸœŠKO[‹XÏXJÌ_MŒËX_ZYŠOLÌIŠMŒÉ˜ÊKŒLÌÊLPO˜_
NŠPO˜_J
OJKLIJOÌ‹X_˜JKOLÌIŠ	MŒÊKŒLÌÊO]KL
NŠOJOJKLIŒÌ‹X_OKXJKÊY›ÜŠJ
O\‹L_
JOOKLOËLNŒÜ[_ŒÌKJY_OŒÌJKJO\‰ŠZJ
ÊŒ˜OŒ
_
OŒÌJJ_\JŒOŒ
_OPO_ŒÌKQ_KO\LI›ÏXËL_ÊNÜ™]\›ˆ	OY‹ÙO[‹OPO_ŒÌK_IO]ÙOPKLOL\™]\›ˆOPKY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆLOLLLÏLLLOLLOLÙNžÚYŠ

YVÝ
ÎŒ—JJOOYVÝ
ÌLŒ—JZYŠ
OYVÝ
ÍŒ—JOŒŠÏYVÝŒ—JOŒ
[P™J
JJÊKXÏŒŠ_
KËLŠJØ_K\‹X_
JÜŸVÝ
ÎŒ—O[‹VÝ
ÍŒ—O[
ÙVÝ
ÍŒ—NÙ[Ù^ÚYŠ
JŠOOJÊOÌNœ‹XÏŒJOŒLLÌÍÍN
Xœ™XZÈNÚYŠJWØJ[ŠJJÛŸ[JM	›
JÙŸ
ŠHOJJJ^ÚYŠOKM	Š\‹X_
KOLJÊ
\‹M
OŒŸ
IÊY›ÜŠL[ÙVÜŒ—OYVØOŒ—KOXJÍ\ŠÍ
JHOJ
[ŠÌ_
JNÊNÙ[ÙH[ÚYŠ[
Ñ_JŒŽ
JY›ÜŠÙVÜŒ—OYVØOŒ—KVÜŠÍŒ—OYVØJÍŒ—KVÜŠÎŒ—OYVØJÎŒ—KVÜŠÌLŒ—OYVØJÌLŒ—KVÜŠÌMŒ—OYVØJÌMŒ—KVÜŠÌŒŒ—OYVØJÌŒŒ—KVÜŠÌŒ—OYVØJÌŒ—KVÜŠÌŽŒ—OYVØJÌŽŒ—KOXJÌÌŸ
ŠHOJ
\ŠÌÌŸ
JNÊNßYVÝ
ÌLŒ—OZVÝ
ÎŒ—O[‹VÝ
ÍŒ—O[VÝŒ—OY‹É‰ŠJÊKYVÝ
ÎŒ—J_Y[ÙH\ŽÜ™]\›ˆVÛŒ—OYVÐOŒ—K›ÚY
VÝ
ÎŒ—OYVÝ
ÎŒ—JÍ
_XÚJ
KŠ
_Y[˜Ý[ÛˆJJ^Ý˜\ˆ‹OLLLÏLLÛLNL\RLÌŒVÜŠÌÌLŒ—OL[ÐJÏQÝ
ŠÌLLŸNL
K‹ŠÌÌMŸŠÌÌLŸ
KOYVÜŠÌÌMŒ—NÙNšYŠ
JOLÊ^ÚYŠ
JOŠXœ™XZÈNÚYŠLÉŠOXKL_
KLKKLŒLÊY›ÜŠKM	KOLÙÖÌ
O]
ÜŸ
WOM	‰ŠÖÌWOLÊKÖÊO]
ÜŸ
JÌ_OM	‰ŠÖØJÌ_OLÊKÖØJÌŸOM	‰ŠÖØJÌŸOLÊKÖØJÌßOM	‰ŠÖØJÌßOLÊK]
Í
ŠHOJ
OPJÍ
JNÊNÚYŠ[
Xœ™XZÈNÙ›ÜŠOLÙÖÌ
O]
ÜŸ
WOM	‰ŠÖÌWOLÊK]
Ì_

HOJ
OPJÌ_
JNÊNßY[ÙHYŠLKJ
JOLJJ^Ù›ÜŠÎÊ^ÚYŠ

O™ÖÌ
]
ÜŸ
WJ^ÚYŠ
JHOJ
]
Ì_
JJXÛÛ[YNØœ™XZÈ_Xœ™XZßYÖÌ—OP_ZYŠ]VÌ×JY›ÜŠOLNØOYVÌM
Ê
MI
OŠOŒ—KVØJÌL_HOLŸM‰VØJÍŸ_
LMIŠOYÖÐJÜŸJK
JO‰‰›
ÖÌ—O]VÛ
ÎMML_K[ŠÌ_]VÌ×JKOPJÌ_
KÖÌ—O][ŠÌ_]VÌ
ÏXÊÌ_
WNÊNÙÖÌ—OL\ŠÌÌŒY[˜Ý[Ûˆ[Ê
^Ý˜\ˆOLLOLLLÏLÜPOYVÊL
OŒ—KVÝŒ—OPJÌNÙNžÝžÜŽžÜÎžÛÎžÛŽžØÎœÝÚ]Ú


]VÌWJO
KN
^ØØ\ÙH˜Ø\ÙHN˜Ø\ÙHŽ˜Ø\ÙHÎ˜œ™XZÈØØ\ÙHÎ˜œ™XZÈÎØØ\ÙHŽ˜œ™XZÈŽØØ\ÙH˜Ø\ÙHN˜œ™XZÈÎÙY˜][˜œ™XZÈ_ZYŠ
OPJÌŸ
OŒJYVÝ
ÍŒ—JOŒ
Xœ™XZÈÎÚYŠVÝŒ—OXK
NL‰Š]VÜŠÌ_JJHOLLŽ
Xœ™XZÈŽÜ™]\›ˆŒÉœŸ‰ŒNNZYŠ
OPJÌß
OŒJYVÝ
ÍŒ—JOŒ
Xœ™XZÈÎÚYŠPJÌŸVÝŒ—O\‹
NL‰ŠO]VÐJÌ_JJHOLLŽ
^ØO\ŽØœ™XZÈŸZYŠVÝŒ—OXK
NL‰Š]VÌ—JJHOLLŽ
Xœ™XZÈŽÜ™]\›ˆŒÉœŸ
ŒÉ_‰ŽMŒ
OŸZYŠJ
YVÝ
ÍŒ—JOŒJPJÍ
OŒ
J^ÚYŠOPJÌŸVÝŒ—OXK
NL‰Š]VÐJÌ_JJHOLLŽ
OPJÌßVÝŒ—OXK
NL‰ŠÏ]VÐJÌŸJJHOLLŽ
_
VÝŒ—O\‹O]VÌWKO\‹
NL‰JHOLLŽ
JXœ™XZÈŽÜ™]\›ˆ

MŒÉ_Ï‰ÌŸ
ŒÉ›Ÿ‰ŽMŒ
OLŠOŒLLLMLLÍMLÌÎ
__YVÝŒ—O[ŽØœ™XZÈYVÝŒ—OXKL_[MMLÌß\™]\›ˆY[˜Ý[ÛˆÙJK‹J^Ý˜\ˆ‹ÏLLLOLLOLÚYŠ[RMÌŸJX_JLÍŽÌLL‰ŠXÝ
K‹JJJJI‰ŠÖÛŠÍŒWONNL‹OQÝ
ŠÍ‹JKVÌWJJ^Ù›ÜŠ[ŠÌŒÏLKOLŒÎÊ^ÚYŠÝ
ŠÍJKOS˜JVÛŠÍŒ—JKYVÜŒ—KOÊVÜŒ—OLŸ‹\ŠXJVÛŠÍŒ—JKJJN™VÜŒ—OKLÉ™‹OYVÌÌÌKÝ
K‹
KI˜ÏÊVÛŠÌMŒ—OLNLSØJKLÌŠÌMŸ
JNŠVÛŠÌÌŒ—OLMKVÛŠÌÍŒ—OLNLSØJKÍŠÌÌŸ
JKÏJOYVÌÌÌJJÌ_VÌÌÌOXËOŒLŒMÍÍŠ^Ù›ÜŠÎÊZYŠOXKOXJÌ_

YÖÌWJJOOLÌŸNOŒJ^Ù›ÜŠÐOJOPJJÌ_

YÖÌWJJOOLÌŸNOŒNÊNÚYŠÏXËL_VÌÌÌOXËJ
ÊOŒ
JXœ™XZß_ZYŠ\
ÙŸVÌÌÌOQKJVÌWI‰ŠÏL

ORKYŸ
JOŒJJJXœ™XZßJŠÌŒ
HOJ
I‰ŠVÛŒ—O[ŠÌŒØJNLŒLÌŠJ_\™]\›ˆ[ŠÍÌŸY[˜Ý[ÛˆŠK‹K‹ËŠ^Ý˜\ˆNÜYVÌÌŽMÌ—KOYVÜ
ÌLMŒ—KÖÝ
ÎŒWOP–Ý
ÎŒWJÛLÌ‰™Ì[›ÖÝ
ÌLŒWO[
Ð–Ý
ÌLŒWKÖÝ
ÌLŒWO[
Ð–Ý
ÌLŒWKOJJOŠ
J
JÊKJJKÌMŸ
KJOZÖÝ
ÍŒWJ_
KÌŸ
JOÛ˜KÖÝ
ÍŒWOJ
ŠO
JOØNœŠJÐNÙNžÝœÝÚ]Ú
‹L_
^ØØ\ÙHOJ
OLŒÍKJZÖÝ
ÍŒWJ_
JOKLLËLLKÖÝ
ÍŒWOJ
JOKMŒËMŒJJÜŽØœ™XZÈNØØ\ÙHNOJ
OJ
OLŒÍKJZÖÝ
ÍŒWJ_
JOKLÌËLÌJJOKLMLËLMLKÖÝ
ÍŒWOPJÜ‹ÖÝ
ÌŒWOPJÐ–Ý
ÌŒWNØœ™XZÈNØØ\ÙHŽ˜œ™XZÈÙY˜][˜œ™XZÈ_POJ
OJ
OLLJZÖÝ
ÍŒWJ_
JOKMËMJJO‹LÌËMKÖÝ
ÍŒWOPJÜ‹ÖÝ
ÌŒWOPJÐ–Ý
ÌŒW_YVÜ
ÌLÌŒ—_
ÖÝ
ÌŒOJÊVÝ
ÌŒKÊOŒ
KÌLÖÝ
ÌŒ_OJÊVÝ
ÌŒ_KÊOŒ
KÌLÖÝ
ÌŒŸOJÊVÝ
ÌŒŸKÊOŒ
KÌLÖÝ
ÌŒßOJÊVÝ
ÌŒßKÊOŒ
KÌLÖÝ
ÌOJÊVÝ
ÌKÊOŒ
KÌLÖÝ
Ì_OJÊVÝ
Ì_KÊOŒ
KÌL
_Y[˜Ý[ÛˆJ
^Ý˜\ˆKLOLLLÒPORMÙNžÚYŠ
^ÝVÌ_
RÊŽJKVÌI‰
RÊLŒMŽMŠKVÌI‰
RÊŒM
KVÌI‰
NLJJJJNÝžÙ›ÜŠÎÊ^ÚYŠJJO]VÝ
ÜŸJ_
JOOMÊJ^ÚYŠLŒË

\ŠÌ_
JHOLŒÊXÛÛ[YNØœ™XZÈXœ™XZß[\ŸXONLNÝžÜŽžÚYŠ]VÌK
VÝ
ÛŸ_
ŠOOMŸ
O]
ŠOOMÊJI‰ˆ]VØJÌ__]ŠKLJ_]ŠKLLÍŠJ^ÚYŠLLŒML‹VØJÌ_OOMŠXœ™XZÈŽÝLØœ™XZÈZYŠYVÍMŽLWJY›ÜŠÎÊ^ÚYŠ]ŠKŠÎ
JXœ™XZÈŽÚYŠJYVÜŠÌÌŒ—JJXœ™XZßJ]JÍŠJI‰ŠYVÌÌMKVÝŒ—OYVÌÌL×KVÝ
ÍŒ—O\‹
]
ÎKŠKÖÜŠÛŸOLVÝ
ÌÌŒ—OYVÍMŽLWKVÍMŽLWO]
K]LŒMLŸ]\ŸZYŠ

OOKLJXœ™XZÈNÙVÍMŽWO]Y[ÙHYVÍMŽWNÛ]Ý
ÎŽÌ_\™]\›ˆPJÍY[˜Ý[ÛˆÙJ
^Ý˜\ˆOLLOLLLÏLLLOLÜHHJ
OYVÝ
ÌLLŒ—J_
OYVÝ
ÌLMŒ—JJKPKÏPOJYVÝ
ÍŒ—JKJYVÝ
ÍŒ—J_PJÙVÝ
ÌLŒŒ—_OYVÝ
ÌLŒ—JÊOŒÌJ_ÙNžÚYŠJ


O\ŒÏŒÐJÌ_JJOJJIœŒ[Œ
JOŠJJIœ
J^ÚYŠ

TPJ
JJOL
Xœ™XZÈNÛYVÝ
ÍŒ—KYVÝ
ÍŒ—_\™]\›ˆVÝ
ÌLLŒ—OKLKVÝ
ÌLMŒ—OKLKVÝ
ÌLŒ—O[OJÏ\ŠJÊY‹[
_OJŒÌJJÐ_VÝ
ÌLŒŒ—OXKVÝ
ÌLŒ—O\Œ˜OŒÐJÌ_KL_\™]\›ˆOJO\ŠÌ_
OÐNJÌ_YVÝ
ÍŒ—KYVÝ
ÎŒ—KÏ[YVÝ
ÌLMŒ—KŸ
YVÝ
ÌLLŒ—JI‰Š\‹X_

XËJJÊŒOŒ
_
_
JOJ
ÏJOY‹[
OŒÌJJI›ŒROŒ
ŠOŠÊ_
[ŠÛ
JKVÝ
ÌLŒ—OY‹OJJYVÝ
ÍŒ—JK[
JØ_OJŒÌJJÐ_VÝ
ÌLŒŒ—OXKVÝ
ÌLŒ—OXOŒŒÐJÌ_KŒ[Œ	‰ŠÖÛL_O\
KY[˜Ý[Ûˆ™JKŠ^Ý˜\ˆOLLÙNšYŠ

HOJJJ^ÚYŠKJ]
ÜŸ
OŒLJJOŒ
\™]\›ˆ
KŠNÚYŠOLÉŠJKŒOŒ
^ÚYŠJXO]Ù[Ù^ÚYŠÉ
Y›ÜŠO]ÎÊ^ÚYŠ\ŠXœ™XZÈNÚYŠÖÌWO]VÌWKOPJÌ_\‹L_JÉŠOXJÌ_
JJXœ™XZßY[ÙHO]ÚYŠJŒLÊJY›ÜŠÙVØOŒ—OYVÐOŒ—KOPJÍOXJÍ
\‹M
OŒŒÎÊNßZYŠŠY›ÜŠÙÖÌWO]VÌWKOXJÌ_OPJÌ_\‹L_ÊNßY[Ù^ÚYŠXJ^ÚYŠÉ›ŠY›ÜŠÎÊ^ÚYŠ\ŠXœ™XZÈNÚYŠÖÌ
OJ\‹L_
JÝ
WO]VÐJÜŸKJÉ˜JJXœ™XZßZYŠJŒLÊJY›ÜŠÙVÊ\‹M
JÝŒ—OYVÐJÜŒ—KŒŒÎÊNßZYŠ\ŠXœ™XZÈNÙ›ÜŠÙÖÊ\‹L_
JÝO]VÐJÜŸKŽÊNß_\™]\›ˆY[˜Ý[Ûˆ™JK‹J^ÙNœÝÚ]Ú
KN_
^ØØ\ÙHœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍ›ÚY
VÝŒ—OYVÐOŒ—JNØØ\ÙHŽœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍOZÖÐOŒWKVÝŒ—OPK›ÚY
VÝ
ÍŒ—OPOŒÌJNØØ\ÙHÎœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍVÝŒ—OP–ÐOŒWK›ÚY
VÝ
ÍŒ—OL
NØØ\ÙHœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍOYÖÌWKVÝŒ—OPK›ÚY
VÝ
ÍŒ—OPOŒÌJNØØ\ÙHNœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍVÝŒ—O]VÌWK›ÚY
VÝ
ÍŒ—OL
NØØ\ÙHMŽœ™]\›ˆOYVÜŒ—JÍÉ‹NVÜŒ—OPJÎ›ÚY
VÝŒ×O^VÐOŒ×JNØØ\ÙHMÎœ]ÌWJŠNÙY˜][œ™]\›ŽØØ\ÙHN˜Ø\ÙH˜Ø\ÙHMœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍOYVÐOŒ—KVÝŒ—OPK›ÚY
VÝ
ÍŒ—OPOŒÌJNØØ\ÙHŽ˜Ø\ÙHN˜Ø\ÙHLN˜Ø\ÙHMNœ™]\›ˆOYVÜŒ—KVÜŒ—OPJÍVÝŒ—OYVÐOŒ—K›ÚY
VÝ
ÍŒ—OL
NØØ\ÙHÎ˜Ø\ÙHL˜Ø\ÙHLŽ˜Ø\ÙHLÎ˜œ™XZÈ_POYVÜŒ—JÍÉ‹NVÜŒ—OPJÎYVÐJÍŒ—KVÝŒ—OYVÐOŒ—KVÝ
ÍŒ—O\ŸY[˜Ý[Ûˆ
K‹K‹
^Ý˜\ˆÎÒXÏRNÙNšYŠ

OLMŒÎ
^ÚYŠPJÊÌÌŸK‹K‹ŒMÌÍLMÍŠKOYVØÊÍŒ—KYVØÊÍŒ—KOYVØÊÌÌŒ—KYVØÊÌÍŒ—KŒÌÍÊ^Û[LMŒÎßØœ™XZÈ_QPJÊÌMŸK‹K‹ŒMÌÍLMÍŠKJ

OMLMOÍLMN›
KLÌÍŸOYVØÊÌŒ—KYVØÊÌŽŒ—KOYVØÊÌMŒ—KYVØÊÌŒŒ—_Y[ÙJ
O‹LMŒÎß
PJËHMK‹K‹ÍÌLL
KOYVØÊÍÌŒ—KYVØÊÍÍŒ—KOYVØÊÍŒ—KYVØÊÍŽŒ—KŒŽMLÍÛ[
ÌMŒŽ_ŠPJÊÍK‹K‹ÍÌLL
KJ

OKMLŒËMLŒ›
JÌÌLÎOYVØÊÍMŒ—KYVØÊÍŒŒ—KOYVØÊÍŒ—KYVØÊÍLŒ—JJNÑPJËK‹K‹
ÌMŒÎÏMŠKOYVØÊÌLŒ—KVÝ
ÎŒ—OYVØÊÎŒ—KVÝ
ÌLŒ—OPKOYVØÊÍŒ—KVÝŒ—OYVØÏŒ—KVÝ
ÍŒ—OPKXÊÎY[˜Ý[Ûˆ
J^Ý˜\ˆ‹KLÒ\R
ËMYVÝŒ—KOYVÛ‹MŒ—KYVÛ‹NŒ—KVÜŠÌÌŒ—OLVÜŠÌÍŒ—OLVÜŠÍŒ—OLVÜŠÍŒ—OLVÜŠÍŒ—OLVÜŠÍLŒ—OLÖÜŠÍM_OLÖÜŠÍMŸOLÖÜŠÍMßOLÖÜŠÍNOLÖÜŠÍN_OLÖÜŠÍŒOLÖÜŠÍŒ_OLÖÜŠÍŒŸOLVÜŠÌŒ—OLVÜŠÌŽŒ—OLVÜŠÌŒŒ—OLVÜŠÌMŒ—OLLLVÜŠÌLŒ—O]VÜŠÎŒ—OPK]
ÛŸLÙNšYŠœÊKK
JYVÜŠÍMŒ—OLK]ÙVÙVØOŒ—JÌŒŒ—WJKŠÎK
KYVÜŠÌÌŒ—OOLOÝŒÙ[Ù^Ü]ÙVÙVØOŒ—JÌŒ—WJKŠÎK
NÝœÝÚ]Ú
VÜŠÍŒ—J^ØØ\ÙH›YVÜŠÍŒ—OOLI‰™VÜŠÌÍŒ—OOLI‰™VÜŠÍŒ—OOLOÙVÜŠÌŽŒ—NŒØœ™XZÈNØØ\ÙHN˜œ™XZÈÙY˜][˜œ™XZÈ_YVÜŠÌÌŒ—HOLI‰™VÜŠÍŒ—_VÜŠÌÍŒ—HOL_VÜŠÍŒ—HOL_
YVÜŠÌŒ—J_\™]\›ˆ\‹HMŸY[˜Ý[ÛˆÝ
K‹KŠ^Ý˜\ˆËLÒ[RNÖÛ
ÍÌŒWOLVÛ
ÍŒ—OLVÛ
ÍŽŒ—OLÖÌWOLZ\ŠKÏLŸ
[HM
JJÙŸÖÙŠÌŸOLÌŽÙNšYŠ
ŠHOKLJPOŒLÌÉ‰ˆQ\ŠJOÊÖÙŠÌßOJŠOOLÌÌÌŽŒÌKÖÛ
Í_ONMK]
HMK
ÌMŸ
_
ÖÛ
Í_OLÌ‹]
Ë
ÌMŸ
_
Ë
ÌMŸŽÍMM‹
JKVÛ
ÌMŸ_Ý
K
ÌMŸ
KOQÝ
K
ÌMŸ
KJ]VÌWJ_
ŠOOLŒ_
VÛ
ÍMŒ—OLVÛ
ÍŒŒ—OLJK
ÍMŸLKI›ŠJJNŠVÛŒ—OPK
O[HMKMK
K]
KJJNÙ[Ù^ÚYŠ]
ËJ_
ÖÛ
Í_ONMK]
HMK
ÌMŸ
_VÝ
ÌŒLŒ—OOLNMŠJXœ™XZÈNÚ›ÊLMJK]
VÍÌNMKË
ÌMŸ
I‰ŠÖÌWOLŒKÖØJÌ_OL
K˜JVÙVÌÌŽMÌ—JÍŒŒ—J_R[
ÎY[˜Ý[Ûˆ]
KŠ^Ý˜\ˆOLLLÏLÚYŠ‰‰ŠÖÌOPKÖÊO]
ÜŸ
KL_OPKJŒß
ÖÝ
ÌŸOPKÖÝ
Ì_OPKÖØKLßOPKÖØKLŸOPKŒß
ÖÝ
ÌßOPKÖØKMOPKŒ_
JOL]	ŒÊJÝOTÊMIKMŽÌJKVÛŒ—OPKVÊJO\‹XI‹M
JÛŸ
KMŒ—OPKOŒ_
VÛŠÎŒ—OPKVÛŠÍŒ—OPKVÜ‹NŒ—OPKVÜ‹LLŒ—OPKOŒ_
VÛŠÌŒ—OPKVÛŠÌŒŒ—OPKVÛŠÌMŒ—OPKVÛŠÌLŒ—OPKVÜ‹LMŒ—OPKVÜ‹LŒŒ—OPKVÜ‹LŒ—OPKVÜ‹LŽŒ—OPK
XKJÏM	›Ÿ
_
OŒÌŠJJJJJJJY›ÜŠOPPJKKJK[KO[ŠØßÙVÐJÌŒ—OXKVÐJÌŽŒ—O[VÐJÌMŒ—OXKVÐJÌŒŒ—O[VÐJÎŒ—OXKVÐJÌLŒ—O[VÐOŒ—OXKVÐJÍŒ—O[OPJÌÌŸ
\‹LÌŸ
OŒŒÌNÊNÜ™]\›ˆY[˜Ý[Ûˆ

^Ý˜\ˆOLLOLLLÚYŠ]RLŒ

OYVÍLÌ×JJOŒ
Y›ÜŠÊYVÊLŒLŒMŠÊOŠ_
OŒ—JI‰ŠJŠKVÜŒ—OL
K
JHOJ
OPJÌ_
JNÊNÚYŠVÍLÌ×OLVÝ
ÌMŒ—OLLÍÍNVÝ
ÌŒŒ—OMË
O]
ÌÌŸÎË
ÌMŸ
KPJK]
JJÌ_
KVÝ
ÍŒ—OMËVÝŒ—OLLÍÍN
KÎLÌË
KPJK]
JJÌ_JKOYVÍLÌ×KVÊPOŠJÌŒLŒMŒ—OLWÐJOYVÍLÍWKŠÍ
J^ÚYŠVÍLÍWO\‹ÊŒLŒM‹KÊKOYVÍLÍWKLOYVÍLÌJY›ÜŠLÛYVÐJÍŒ—KVÌI‰Š
Ì_NJI‰–œŠVÐJÎŒ—KÌ‹ÊI‰ŠVÊŠJØOŒ—OPK\ŠÌ_
KOYVÌŒLŒMŠÊ
[ŠÌ_
OŠOŒ—NÊNÙVÊŠJØOŒ—OL\™]\›ˆ]
ÌŒ_Y[˜Ý[ÛˆÐJKŠ^Ý˜\ˆOLLLÏLÚYŠPKL_
JOLŠ^ÐO]ÙNžÙ›ÜŠÎÊ^ÝžÜŽžÚYŠ

OYVÜŠÍŒ—JJHOJ
YVÜŠÎŒ—JJJ^ÚYŠ
ÏPÜÊKL‹X_
JOÛLJÊËJOYVÜŠÍŒ—J_
_ŠOYVÜŠÍŒ—KYVÜŠÎŒ—KX_
K
KKO[ŒŒÛŽ›
KXJÙVÜŠÍŒ—_VÜŠÍŒ—O[‹OPJØ_ßJ[X_
JXœ™XZÈÚYŠ
ŠHOYVÜŠÎŒ—J^ÙVÜŠÍŒ—O[ŠÌKO]VÌ—NØœ™XZÈŸ_ZYŠJ

OTPJŠJJOL
J^ÚYŠOL

OOJJJXœ™XZÈNÚYŠM‰VÌ—JXœ™XZÈØœ™XZÈ__ZYŠÖÌWOXKOPJÌ_
MI˜JHOLL	‰Š[L_
JXÛÛ[Y_Xœ™XZß]ÊÖÌWOLO]
N˜OL_Y[ÙHYŠOYVÜŠÍÌŒ—KVÜŠÍÌŒ—OPKL_K[
\™]\›ˆÖÌOLÜ™]\›ˆ_Y[˜Ý[ÛˆJ
^Ý˜\ˆOLLOLLLÏLLLÚYŠOTÊ
K

YVÐJÌLÍÎMŒ—JJOŒ	‰›JL_
KYVÌÍŒLMWKJ

OYVÊPJÌLÍÎMŸ
JÌÍŒ—JJOL
J^ÚYŠYVÜŠÌÌŒ—KLIK
JHOLJY›ÜŠKL‰KLÐO]VÊJO\
JÛŸ
JÌLKVÌM
ÊOŠOŒ—O[

OJJOÐO]™]
M
Ê
]
Ì_
OŠ_K]ŠK]VÊOJMŸJJÛŸ
JÌLKVÌM
ÊŠOŒ—OXK

OJJOÝPN™]
M
Ê
OPJÌ_
OŠ_POŠK\ŠÌŸ

HOJ
ÏXÊÌŸ
JNÊNÙ[ÙHLÙ‰‰ŠO]VÊJ
JÛŸ
JÌLKVÌM
ÊOŠOŒ—O\‹

OJJ_
]
M
Ê
]
Ì_
OŠ_K]ŠKPJJ_YVÌÍŒLMWO]Y[˜Ý[Ûˆ	JK‹KŠ^Ý˜\ˆÏLLLÒ[RLMŸÙNšYŠI™ÖÝ
ÌLŸI‰ŠÏ]VÌ—KJJI™ÖØJÌŸJIŠÊHOMŸM‰ŠYVØJÌLŒ—J_JJ‰œ
_Š_
Ý

ÌLŸ
ÊHOMÜŽœŠÌŸ
KJÏ]VÌ—J_]VÜŠÌ_JJJJ^ÚYŠJJYVÛ
ÌLŒ—J_‰VØJÌŸJJ^ÚYŠSÐJ
JXœ™XZÈNØÏ]VÌ—_JÊOOM‰‰ŠÖÌ—OLÌŠKL‹VÝ
ÌŒLŒ—HOLÍ_Ÿ
SÐJVÛ
ÌLŒ—JOÓÙJŠÌŸ
NŒLŽ	VÝ
ÎŒÌßI‰ŠJJYVÛ
ÌLŒ—J_‰VØJÌŸJI›‹MŒLL
L
JKLÌÍŽ	œÌ™‹LÌLÌ‰œ‰‰ŠLMŒÎ	™VÝ
ÎŒÌŒ—OÌÍVÐKLŸHOMOÙŽŒ
J_\™]\›ˆ[
ÌMŸŸY[˜Ý[ÛˆŠK‹KŠ^Ý˜\ˆÏLLÚYŠ[RLŒVÛ
ÌŒŒ—O\‹]
[
ÌMŒ
KVÛ
ÌŒŒ—OYVÛ
ÌŒŒ—K
JK
ÌŒ
Î‹KŠJO
[KLNÙ[Ù^ÙVÝ
ÍÍŒ—OLÏYVÝŒ—KVÝ
ÍÌŒ—OL	‰ŠVÝŒ—OKLÌÉ˜ÊNÙNžÝžÚYŠVÝ
ÍŒ—J^ÚYŠVÝ
ÌMŒ—JXœ™XZÈY[ÙHVÝ
ÍŒ—ONVÝ
ÌŽŒ—OLVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OLYVÝ
ÍŒ—KVÝ
ÍŒ—O[ÚYŠKLKÊ
JXœ™XZÈ_\UJK
ÌŒ
Î
ÌMŒKŠ_Y‰‰Š]ÙVÝ
ÌÍŒ—WJ
KVÝ
ÍŒ—OLVÝ
ÍŒ—OY‹VÝ
ÌŽŒ—OLOYVÝ
ÌŒŒ—KVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OLPOÜŽ‹LJKO]YVÝŒ—KVÐOŒ—O]Ì‰˜ËLÌ‰ËLNœŸ\™]\›ˆ[
ÌŒŸY[˜Ý[ÛˆœŠK‹J^Ý˜\ˆ‹LÏLLLOLLOLÚYŠ[RLŒÏ]VÌWJY›ÜŠÙÖÛ
ÛŸOXËJ
MI˜ÊOOM‰ŠŠHOLŒJJÜXÏŒÏ]VÊ[
Ì_
JÐ_NÊNÚYŠÖÛ
ÛŸOL]VÌ—JY›ÜŠ\LŸLOJJO‹ÏLÎÊ^ÙNžÝšYŠ
MI›
HOMŸ_
ÊOOLŒJ^ÚYŠ

OLMI›
JOOLMJ^ÚYŠR_
ŠOŠXœ™XZÈNØO\ŒŒÌLNŠŠILßÌŒÎŒL_XÏXKOYŸY[Ù^ÚYŠYŠÌ_VÝ
ÌMŽ_J^ØÏJ
OŒOÍN‹O[Øœ™XZÈZYŠÏM‹O\

OOJ
JXœ™XZÈØÏJ
ILß
ŠOOJ
OÍN‹O[YXKÖÌWOXËOPJÌ_ZYŠJ]VÊORJÌ_
JÛŸJJXœ™XZßJŠOL‰‰ŠÖÌWOLLKOPJÌ_
KÖÌWOL[ŠÌŒY[˜Ý[ÛˆÜŠJ^Ý˜\ˆLÜL	‰ŠYVÍLÍMKJJJÊVÌMMÌLŠÊOÌLŽŠ

OŒNNJOŠOŒ—K
JKÌMŸ
OŒŠOYVÌÍÌJOŒÝJOŒNNNNOÊÊŠOŒ
KÌYLßŠÊ
ŠKÌ_
OŒ
KÍ
K

YVÌÍJJOL

OYVÌÍJJO
VÊOLŒMŒNLŠÊO
_
JÍŒ—_
VÐJÍŒ—O]
KVÌÍOL
KVÌÍ—OLVÌÍÎWOKLKVÌÍMWOYVÍLÍNKJ
KVÌÍ×OKLKLŒMŒNLŠÊVÍLÍNO
_VÝŒ—OMKVÝ
ÍŒ—O\‹YVÍLÍNJÌ_VÍLÍNOJ
OLMŽOÝŒVÌÍ—OLVÌÍÎI‰ŠVÌÍÎOLLŒMŒNLŠÊVÍLÍNO
_VÝŒ—OLMVÝ
ÍŒ—OLYVÍLÍNJÌ_VÍLÍNOJ
OLMŽOÝŒ
_Y[˜Ý[ÛˆPJK‹K‹ËŠ^Ý˜\ˆOLLOLÒOLKZLŒMÍÍÉ˜NÙNšYŠJ
OJ
OOLŒMÍNLLŠIˆ\ÝN‘IˆHJŠ_ŒŒŒMÍNLLŠI‰ˆJ
OJ
LŒMÍÍÉ™ŠJOOLŒMÍNLLŠIˆXÏÛŸ‘IˆHJÊ_ŒŒŒMÍNLLŠJ^ÚYŠJŸŸß_
J\™]\›ˆÚYŠ

OXI™ŠJOŒ
JOL
^ÚYŠOKLK
ŠOOJÊIŠJOOJŠOÊJOOJ
IŒŒOŒŒœŒÏŒ	ŠJOJŠ_
JO
ŠJXœ™XZÈNÜ™]\›ˆHJ›Ÿ—˜ßW›W™Š_ROKLK

ŠOOJÊIŠJOOJŠOÊJOOJ
IŒ›ŒOŒ›ŒœŒ˜ÏŒ	ŠJOJŠ_
JOŠŠJ_
OHHJ›Ÿ—˜ßW›W™ŠJ_\™]\›ˆ_Y[˜Ý[Ûˆ\ŠJ^Ý˜\ˆLOLLLÙ›ÜŠ]VÎNÍ—_VÎNÍ×OÖÌWO\‹ÖÐJÌ_O\ŽÖÐJÌŸO]VÎNÎNÎÊZYŠ]VÌK\]
Ì_
ŠHOLMJ^ÚYŠ[ŠXœ™XZÎÚYŠJOYVÌM
ÊŠOŒ—JJXÛÛ[YNÚYŠVØJÌL_OOLI‰Š]VØJÌMKJ–ØJÎŒW_Œ
JJ^ÚYŠŒŠXÛÛ[YNÙÖÌWO]VÛ
ÎLÎMßKOPJÌ_ØÛÛ[Y_ZYŠMIŠYVØOŒ—JJY›ÜŠÙÖÌWO]OPJÌ_OMLŽ	]ŽNÊNÚYŠ\‹
ŠHOLŒ_
ÌŸ
YÖÌJJKNMÏŒLŠXÛÛ[YNÙ›ÜŠÙÖÌWO\‹OPJÌ_
ÌŸ
YÖÌ
]
Ì_
WJJKNMÏŒŽÊNßYÖÌWOLY[˜Ý[ÛˆœŠJ^Ý˜\ˆ‹KLLÏLÒ\RLLLŸ
VÍLÌ×_

KLŒLŒMŠKJ\ŠÌMŸK
KVÜŒ—OMËVÜŠÍŒ—O[‹
O\‹HMÍNNKŠKOQ]
JKÏKLNÙNžÝžÜŽžÚYŠYVÝŒ—J^ÐOLKLNÜÎžÙ›ÜŠÎÊ^ÚYŠ\ÊŠÌMŸVÛŒ—JJ^ÚYŠ\ÊŠÌMŸYVÛ
ÎŒ—JOØÏV\Ê‹HM
Ê]

KX_
_
OØÎN›PKYVÊ
OPJÌ_
OŠJÝŒ—JXÛÛ[YNØœ™XZÈßXœ™XZßZYŠ
JOL
Xœ™XZÈÐOJŠOØÎ›ŽØœ™XZÈŸZYŠ

O[ŠJOL
Xœ™XZÈŸPOXßZYŠL
JO
Xœ™XZÈ_[YVÊOŠJÝŒ—_\™]\›ˆ\ŠÌLLŸŸY[˜Ý[Ûˆ\ŠJ^Ý˜\ˆ‹KLLÏLLLÒ\RLMŸŠ
ÐJKOLÊJKLÊ
K

ÏJLŒMÍÍÉ˜JJËLLMÍŸ
JOOLŒMLÎM_ÏŒŒMLÎMOÊ[ŽÏ[JMI›ŠOŽXÊÌLŒÌŽMŒ
NŠŠOOLŒMÍLÌŸŒŒŒMÍLÌÊ[ŽJMI˜JOŽXOŒMÍNLLŠN›ŸÊJ‹Ï[‹
[ÛYJŠN›YJ
JÌÌŸ
JÍ_
KYVÜŒ—KYVÜŠÍŒ—KÏLMLÍÌ‹[M‹YVÜŠÎŒ—KXßMLÍ—™VÜŠÌLŒ—JNŠLL
KVÝŒ—O\VÝ
ÍŒ—OY‹VÝ
ÎŒ—O[‹VÝ
ÌLŒ—OKLŒMÍÍ	˜_\ŠÌMŸY[˜Ý[ÛˆXJKŠ^Ý˜\ˆOLLÙNžÝžÜŽžÚYŠJÉŠ
]
WJJJ^ØOHHJŠNÜÎšYŠJJÉJ_\ŠJY›ÜŠÎÊ^ÚYŠO]VÌWKÖÌ—OXKXJXœ™XZÈNÚYŠ[ŠÌ_OHHJ
\‹L_
JKJÉŠOPJÌ_
JJXœ™XZÈÎÚYŠ\ŠXœ™XZßZYŠXJXœ™XZÈÚYŠ]VÌWJXœ™XZÈNÚYŠJŒ
JY›ÜŠÎÊ^ÚYŠŠOYVÐOŒ—JI˜KLMŽÌI‹LŒLÎLŒŒM
Xœ™XZÈŽÚYŠVÛŒ—OXK[ŠÍOPJÍJ
\‹M
OŒŒÊJXœ™XZß_ZYŠ\ŠXœ™XZÈY›ÜŠÎÊ^ÚYŠO]VÌWKÖÌ—OXKXJXœ™XZÈNÚYŠ[ŠÌ_OPJÌ_J\‹L_
JXœ™XZß_\L\™]\›ˆ]
‹ŠKY[˜Ý[ÛˆÐJK‹K‹
^Ý˜\ˆËLLOLÒXÏRLYVÜŒ—KVØÊÌŒÌŒ—OY‹YVÜŠÍŒ—KVØÏŒ—O]VØÊÌŒÍŒ—O\‹OLNÙNžÝžÜŽžÚYŠŸ
ŠHOLJ^Ù›ÜŠ]ÎÊ^ÚYŠ
[ÊY‹YVÊJOŠJÛ
OŒ—_JJOL
^ÜYŽØœ™XZÈŸ\ÎžÚYŠJ
JOŸŠI‰ŠYVÜNŒ—K
[ÊY‹M‹JJOL
[Ê[Ÿ‹JJOL
JXœ™XZÈÎÚYŠVÊOŠJØÏŒ—O\‹›ÊXÊÌŒÌŸY™JŠJKORJÌ_OXJÛŸL\‹VØÊÌŒÍŒ—_VØÊÌŒÌŒ—HOLJXÛÛ[YNØœ™XZÈXœ™XZß\YŽØœ™XZÈ\]ZYŠŠXœ™XZÈ_ZZJËJKÜÊ‹KK
_RXÊÌY[˜Ý[ÛˆœŠJ^Ý˜\ˆLÙVÍ
Ê
]ŠJÌLÍLLŸ
OŒ—OPKVÜŠÌLÍŒNLŒ—OPKLŽÙNžÝžÜŽœÝÚ]Ú
L_
^ØØ\ÙH™VÍLÎL—OPKVÍLÎ—OPKØJÊNØœ™XZÈØØ\ÙHN™VÍLÎ×OPKVÌÌÌÍ×OJÊVÙVÍLÎM×JÌLMNMŸK
ÊVÍLÎ×KMJJKÌL
JKÌMŽØœ™XZÈØØ\ÙHŽJJONNOÎNNKVÍLÎWOJ
OŒÝŒØœ™XZÈØØ\ÙHÎ™VÍLÎOJJONNOÎNNNØœ™XZÈØØ\ÙHLŽ™VÍÌŽOPNØœ™XZÈØØ\ÙHŽ™VÍÌŒWOPNØœ™XZÈØØ\ÙHN˜œ™XZÈØØ\ÙH˜œ™XZÈŽÙY˜][˜œ™XZÈ_JLMIJI‰ŠVÙVÍÌNL—JÌMLŒ—O]
KVÍÌNM—OP_\L\™]\›ˆŸY[˜Ý[ÛˆJJ^Ý˜\ˆLOLLÙNšYŠVÝŒ—JY›ÜŠÎÊ^ÚYŠ\ŠVÝMŒ—JJ^ÚYŠOL

YÖÌWJJOOYVÝŒ—JY›ÜŠÊ
YÖÊOXJÌ_
JÐ_JJOOYVÊ]
Í
OŒ—NÊNÚYŠ\Š^Ù›ÜŠÐO]]
Í\ŠVÐOŒ—JNÊNÙ›ÜŠPJÊ
VÐOŒ—OOMŒJOŠ_ÛJ[ŠJÍ\ŠVÝŒ—JNÊNÝœÝÚ]Ú

OYVÝŒ—JKLÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈNÙY˜][˜œ™XZÈ\™]\›ˆ\ŠJ_VÝŒ—OOMÏÌLŽ_ZYŠYVÊ]
Í
OŒ—JXœ™XZß\™]\›ˆŸY[˜Ý[ÛˆŠK‹J^Ý˜\ˆ‹ÏLLLÜ™]\›ˆ]VÝ
Ì__VÝ
ÎŒ×HO\ŸVÝ
ÌMŒ×HOXOÊVÝ
ÌMŒ×OXKVÝ
ÎŒ×O\‹OJÏUÜŠLËŒMMNLLÍNMÎLËÊJÙVÝŒ—JJ˜JJJ‹XËVÝ
ÍŒ×OXKÊYØJM‹ŒŽÌNLÌÌMÎMN‹ÙŠœŠKÊÏXËVÝ
ÍŒ×OXËLKXËXKVÝ
ÌÌŒ×OY‹J]VÝ
ÌJ_OL
LKÙ‹VÝ
ÌÌŒ×OY‹J\KY‹VÝ
ÍŒ×OXKÊ\‹VÝ
ÍŒ×OXËLJJNŠ]VÝ
ÌKO^VÝ
ÍŒ×KÏ^VÝ
ÍŒ×K^VÝ
ÌÌŒ×JKÖÝ
Ì_OLK^VÝ
ÍŒ×K^VÝ
ÍMŒ×KVÝ
ÍŒ×O[‹PKOXJœŠÊŠJØÊ›ŠKVÝ
ÍMŒ×O\ÛK_Y[˜Ý[ÛˆXJK‹KŠ^Ý˜\ˆLÏLLLOLÚYŠ
YVÌÍÎJI‰ˆJ

ÏYVÌÍÍ—JJOJVÌÍÎL×KLŸ
JJ^ÚYŠVÌÍÍ—OXÊÌKTÊËÍŠJÙŸVÛŒ—O]VÛ
ÍŒ—OYVÌÍÍ×KOYVÌÍÎKVÛ
ÌLŒ—OPOŒVÛ
ÎŒ—OLMÍÍÌŒMIKVÛ
ÌŒ—ORKOYVÍLÍMKYVÌÍÎWJÊ
‹YVÌÍÎL—_
KÌŸ
_VÛ
ÌŒŒ—O[‹OPYJLYLÊŠÊŠKÊÊJJOŒMÍÍßŸœ‹LŒMÍÍVÛ
ÌMŒ—OPKLÏŒLJ\™]\›ˆ›ÚY
VÌŽ
ÊÊËÍŠJÙŸ
OŒ—OYVÌÌÌŽ—JÜŠNÐOLŽ
ÊÊËÍŠJÙŸ
_VÐOŒ—O\‹

OOMÉ‰ŠVÐJÍŒ—OXJ__Y[˜Ý[ÛˆÜŠK‹K‹
^Ý˜\ˆÏLLLOLÍ	›ÊOLÌIŠ[
ËM
K
ŒÉœŠOŒLÌÊLO[_
NŠ[_OJ
OJKLI›ŠOÌ‹P_OJKOLL
N›	‰ŠXKÏLÌIŠM[
K
ŒÉ™ŠOŒLÌÊ\ËOL
NŠJOÊKLIœŒÌ‹XßËO\ÊKPKOLÌI›
ŒÉ›
OŒLÌÊÏLO\_
NŠÏ\_OJ
OJKLIœŠOÌ‹P_JK_RKXß‹ÏXKOLÌI›
ŒÉ›
OŒLÌÊLO[˜_
NŠ[˜_OJ
OJKLI›ŠOÌ‹X_Ï˜JKYŠKVÝŒ—OPKVÝ
ÍŒ—O\‹VÝ
ÎŒ—OXKVÝ
ÌLŒ—O[ŸY[˜Ý[ÛˆJ
^Ý˜\ˆOLLÚYŠ]
^ÚYŠVÌÌÌMÍI‰ŠO^JVÌÌÌMÍJJKVÌÌÌLÍ—I‰ŠO^JVÌÌÌLÍ—J_JKYVÍMŽM—JY›ÜŠÙVÝ
ÌŒŒ—HOYVÝ
ÌŽŒ—I‰ŠO^J
_JKYVÝ
ÍMŒ—NÊNÜ™]\›ˆ_\™]\›ˆVÝ
ÍÍŒ—OLVÝ
ÌŒŒ—OOYVÝ
ÌŽŒ—_
]ÙVÝ
ÌÍŒ—WJ
KVÝ
ÌŒŒ—JOÊ

OYVÝ
ÎŒ—JJHOJ
YVÝ
ÍŒ—JJI‰ŠO\‹P_]ÙVÝ
ÍŒ—WJKOŒÌKJJKOLVÝ
ÌŽŒ—OLVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OLVÝ
ÍŒ—OLVÝ
ÎŒ—OL
NOKLK_Y[˜Ý[ÛˆÜŠJ^Ý˜\ˆLOLLLÏLÚYŠ
NL‰Š]VÌWJJOOLLŽ
Y›ÜŠÊNL‰Š]VÌ
OPKL_
WJJOOLLŽÊNÙNšYŠLŽ	Š\Œ
J^ÚYŠOLK

LŒ	œŠJHOLNLŠZYŠ
	œŠHOLŒ
^ÚYŠOLË
	œŠHOL
^Ü‰LMKOLØœ™XZÈ__Y[ÙHOL‹ÏLNÜ]VØJÎLÎŸIœ‹
]VÐJÌ_JOÊMŒÉ›‹
ŠHOLNL‰‰Š
]VÐJÌŸJOÊMŒÉ›Ÿ‹ß

O]VÐJÌßJOÜMŒÉ_Ž˜OLŠJN˜OLJJN˜OL\™]\›ˆVÝŒ—O\‹JÌ_Y[˜Ý[ÛˆŠK‹J^Ý˜\ˆ‹LÏLÜ™]\›ˆ[RLŒÊVÛŒ—OLLÍÍNVÛŠÍŒ—OMËVÛŠÎŒ—OPK
O[ŠÌMŸMÌŠK

SJJJJOÐOV˜JK[ŠÌMŸ
NŠOYJŠÌMŸMNJJOÊ
ÏYVÝŒ—JI‰™JÊKÊÏ]J
KVÝŒ—OXËÏÊÚJËJJOOJ
OÊÜŠJKOL‰‰ŠVÜŒ—O[
JNŠYVÍMÎNKÜŠJKJVÝŒ—JKVÝŒ—OLOV˜JK‹ŠÌMŸ
JNŠÜŠJKOM
JNŠOLVÝŒ—OL
JNOV˜JKVÍMÎNKŠÌMŸ
JNOLŽ[ŠÌŒ_Y[˜Ý[ÛˆÝ
J^Ý˜\ˆLOLLLÏLÚYŠ
NL‰Š]VÌWJJOOLLŽ
Y›ÜŠÊNL‰Š]VÌ
OPJÌ_
WJJOOLLŽÊNÙNšYŠLŽ	Š\Œ
J^ÚYŠOLK

LŒ	œŠJHOLNLŠZYŠ
	œŠHOLŒ
^ÚYŠOLË
	œŠHOL
^Ü‰LMKOLØœ™XZÈ__Y[ÙHOL‹ÏLNÜ]VØJÎLÎŸIœ‹
]VÐJÌ_JOÊMŒÉ›‹
ŠHOLNL‰‰Š
]VÐJÌŸJOÊMŒÉ›Ÿ‹ß

O]VÐJÌßJOÜMŒÉ_Ž˜OLŠJN˜OLJJN˜OL\™]\›ˆVÝŒ—O\‹JÌ_Y[˜Ý[ÛˆJK‹K‹
^Ý˜\ˆÏLLLÍ	›ÊOPKOLÌIŠ[
ËM
K
ŒÉ›ŠOŒLÌÊXOKOL
NŠJOJKLI˜OŒÌ‹P_KOPJKOLL
N›	‰ŠÏXKOLÌI›
ŒÉ›
OŒLÌÊXÏKL
NŠJOJKLI˜ÏŒÌ‹X_KXÏJKÏPKOLÌIŠM[
K
ŒÉ›ŠOŒLÌÊLO\˜_
NŠ\˜_OJ
OJKLIœŠOÌ‹X_Ï˜JKO\KŸY‹OLÌI›
ŒÉ›
OŒLÌÊXÏKOL
NŠJOJKLI˜ÏŒÌ‹P_KOXÏJKYŠKVÝŒ—OPKVÝ
ÍŒ—O\‹VÝ
ÎŒ—OXKVÝ
ÌLŒ—O[ŸY[˜Ý[ÛˆÜŠ
^Ý˜\ˆOLÜ™]\›ˆŒMMLŽMOÐO]VÙVÌLMMLŠÊ‰ÌLŒ
OŒ—JÊMI
_NŠOMŒMÌÍ
ŒŒÍÐOLÎŒLNMLÌÏÐO]VÙVÌLMŠÊMŒÍ‰ÌLŒ
OŒ—JÊMI
_NŠOL‹ŒLMÍL
ŒNLNMOÐO]VÙVÌLŽÍŠÊNLMÍL‰ÌLŒ
OŒ—JÊMI
_NŒNÌ
ŒLMÍÐOLÎŒLMÍŸ
OLËŒLLMLL
O]ŒLLMLLÌŽJJJJJJJKMI_Y[˜Ý[ÛˆœÊJ^Ý˜\ˆLOLLLÏLLLOLLÚYŠJ

YVÌÌÍÌWJJOL
J^ÚYŠJ
OŒÌOÝLÌŸLŒM
Y›ÜŠKM	œŽÙLŸL_OYVÌLÍLLŠÊ
ÏLß
OŠOŒ—OOJŠOØÎ™VÌLÍLLŠÊŠOŒ—OOJŠOÙŽ™VÌLÍLLŠÊŠOŒ—OOJŠOÜ™VÌLÍLLŠÊŠOŒ—OOJŠOÝ˜K]
Í

HOJ
[
Í
JNÊNÚYŠLÉœŠY›ÜŠØOYVÌLÍLLŠÊŠOŒ—OOJŠOÝ˜K]
Ì_

HOJ
ORJÌ_
JNÊNÊJOL
VÌÌÍÌWOXKXJ_^ŠKŠ_Y[˜Ý[ÛˆœÊ
^Ý˜\ˆKLOLLÙ›ÜŠPORNMŸJKŒ
K\ÊKJNÛQXJÖÌ
OPJÜŸ
WJKÖÌWO[‹\ŠÌ_MI›ŽÊNÙVÐJÎLŒ—OLVÐJÎŒ—OLVÐJÎŒ—OLVÐJÍÍŒ—OLVÐJÎŒ—OLVÐJÍÌŒ—O]ÙNžÝžÜŽžÚYŠÝ
KJJ^ÚYŠVÌŒŽMÍ—JXœ™XZÈŽØœ™XZÈZYŠVÍLÌ×_

KLŽÍÌËJUœŠŒLŒM‹JJ_]Ý
VÝ
ÎŒ—K
JXœ™XZÈNÚYŠ]VÌŒŽMÍ—JXœ™XZÈ]Ý
ŒŽMÍ‹Š_XÐJVÌÌŽMÌ—JKVÐJÍÍŒ—OYVÌÌŽMÌ—JÍÊJÍÌŸŒŽMÍŠKL\™]\›ˆPJÎMŸŸY[˜Ý[ÛˆZJJ^ÚYŠ]
\™]\›ˆÙNžÝžÚYŠ
^ÚYŠOŒLLÊXœ™XZÈÚYŠVÙVÍMŽWOŒ—J^ÚYŠOŒLŒÊ^ÙÖÝ
Ì_OMŒÉ_LŽÖÌOPOŸNL‹LŽØœ™XZÈ_ZYŠJ
NNL‰JHOMMÌÍ	OŒMMLŽMŠJ^ÙÖÝ
ÌŸOMŒÉ_LŽÖÌOPOŒLŸŒÖÝ
Ì_OPO‰ŒßLŽLÎØœ™XZÈ_ZYŠKMMLÍŒLLMÍJ^ÙÖÝ
ÌßOMŒÉ_LŽÖÌOPOŒNÖÝ
ÌŸOPO‰ŒßLŽÖÝ
Ì_OPOŒL‰ŒßLŽMØœ™XZÈ__Y[ÙHYŠ
LLŽ	JOOMMÌŒMŠXœ™XZÈÙVÍMÎNOLKKL_Y[ÙHLNØœ™XZÈ_YÖÌOPKL_\™]\›ˆY[˜Ý[ÛˆJ
^Ý˜\ˆOLLOLLÚYŠVÝ
ÌŒŒ—OL
OJYVÝ
ÎŒ—JKJOYVÝ
ÍŒ—J_
OŒNJY›ÜŠÙJVÐOŒ—JKOYVÝ
ÍŒ—JÍVÝ
ÍŒ—OPK
OJYVÝ
ÎŒ—JKP_
OŒŽÊNÛMLLŽÙNœÝÚ]Ú

OŒŸ
KL_
^ØØ\ÙHN›LLØØ\ÙH™VÝ
ÌMŒ—O[ŽØœ™XZÎÙY˜][˜œ™XZÈ_ZYŠ
JHOJŠJ^Ù›ÜŠÙJVÐOŒ—JK
ŠHOJ
OPJÍ
JNÊNÊ
OYVÝ
ÎŒ—JJHOJ
YVÝ
ÍŒ—JJI‰ŠVÝ
ÎŒ—OPJÊÊÊ‹P_
I‹M
J_JYVÝŒ—JI‰™J
_Y[˜Ý[ÛˆÜÊKŠ^Ý˜\ˆOLLØOHHJŠNÙNžÝžÜŽšYŠJJÉ
_\ŠJY›ÜŠLMINÎÊ^ÚYŠ
ŠOO]VÌJXœ™XZÈÚYŠOHHJ
\‹L_
JKJÉŠ]
Ì_
JJXœ™XZÈŽÚYŠ\ŠXœ™XZßZYŠXJXœ™XZÈNÚYŠJVÌOOJMIJ_Œ
JY›ÜŠOTÊMIKMŽÌJNÎÊ^ÚYŠŠXW™VÝŒ—JI›‹LMŽÌI‹LŒLÎLŒŒM
Xœ™XZÈÚYŠ]
ÍJ
\‹M
OŒŒÊJXœ™XZßZYŠ\ŠXœ™XZÈ_Y›ÜŠILMNÎÊ^ÚYŠ
JOO]VÌJ\™]\›ˆÚYŠ]
Ì_J\‹L_
JXœ™XZß_\™]\›ˆY[˜Ý[Ûˆ›ÊJ^Ý˜\ˆLOLÙNžÚYŠOLMIJ^ÚYŠÉ
Y›ÜŠÎÊ^ÚYŠJ]VÌJ_
ŠOOJMIJJXœ™XZÈNÚYŠJÉŠ]
Ì_
JJXœ™XZß]šYŠJŠYVÝŒ—JIœ‹LMŽÌI‹LŒLÎLŒŒM
JY›ÜŠOTÊKMŽÌJNÎÊ^ÚYŠŠ—XJIœ‹LMŽÌI‹LŒLÎLŒŒM
Xœ™XZÈÚYŠYVÝ
ÍŒ—K]
Í‹LMŽÌIŸœ‰‹LŒLÎLŒŒM
Xœ™XZßY›ÜŠÊO]VÌ
]
WJI‰Š\ŠÌ_
JHOJMIJJNÊNÜ™]\›ˆŸ\™]\›ˆ]

JÝ\™]\›ˆY[˜Ý[ÛˆZJK‹KŠ^Ý˜\ˆÏLLÙKLNÙNšYŠJ

ÏJ
LŒMÍÍÉ˜JJOOLŒMÍNLLŠIˆ\ÝN˜ÉˆHJŠ_ŒŒŒMÍNLLŠ_
ÏLŒMÍÍÉ›ŠOŒŒŒMÍNLL‰ŠÊHOLŒMÍNLLŠJ^ÚYŠJŸßJJ\™]\›ˆÚYŠ

ÏXI›ŠJOŒ
ÊOL
^ÚYŠ
HJŠ_
JHOJŠJIŠJO
ŠJXœ™XZÈNÜ™]\›ˆHJŸW›ŸJ_J\‰ŠJOOJŠOÝNˆHJŠIŠJOJŠ_
JOŠŠJ_
HHJŸW›ŸJJ_\™]\›ˆŸY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆ‹OLÒ\R
ËMÖÌŒŽMÍ—OLVÜŠÍŒ—OMË
ŠÍN_LLÍLKŠÍ
K_
ÖÜŠÍN_OL
NÙNžÝžÚYŠ	‰Š^˜JÊJJ^ÚYŠÖÌOLÖÌ
]
Ì_
WKMŒLL
Xœ™XZÈØO]ÜÊ
_ZYŠ
JOL
Xœ™XZÈNÚYŠOŒNJ^ÙVÜŠÍŒ—OXKVÜŒ—O\ŠÍNK
ŒŽMÍ‹LLÍÎŠNØœ™XZÈ_YVÜŠÌŒŒ—OXKLLVÜŠÌMŒ—O\ŠÍNK
ŒŽMÍ‹LMLËŠÌMŸ
NØœ™XZÈ_YVÜŠÌÍŒ—O]VÜŠÌÌŒ—O\ŠÍNK
ŒŽMÍ‹MKŠÌÌŸ
_R\‹HMY[˜Ý[ÛˆœÊ
^Ý˜\ˆKLOLLÒPORNY\ÊJÌLŸ
KVÐJÌLŒ—OÊJOPJÌMŸ‹Œ
KL\ÊKJK]Ý
K
_]VÌŒŽMÍ—_Ý
ŒŽMÍ‹ŠKÐJVÌÌŽMÌ—JKÊŒLŠJNœLŽÍÌËPJÎÙNžÝžÜŽžÜÎžÚYŠ
ŠOLŽÍÍLŠ^ÚYŠ\ŠXœ™XZÈNÚYŠ
ŠOOLŽÍÎJXœ™XZÈÚYŠ
ŠHOLŽÍÌÊXœ™XZÈÎÜ™]\›ˆŸZYŠ
ŠOOLŽÍÍLß
ŠOOLŽÍÍÍNJXœ™XZÈŽÚYŠ
ŠOOLŽÎLŽMJXœ™XZÈ_\™]\›‹L_\™]\›ˆŸ[L_\™]\›ˆŸY[˜Ý[ÛˆÜŠK‹K‹Ë‹
^Ý˜\ˆKNÜPPJK‹‹
K[KPPJK‹ÊKO[JÙŸ[ŒŠ[ŠÜ
OŒØJÌ_˜KOXË\‹ÏJPPJËL‹OL
JJÜ[JÙŸOXË\Œ˜ÏŒÜ
Ì_œÏPPJK
K[KOPPJLJK[JÜXOŒŠYŠØ_
OŒÛ
Ì_›O\‹[ŒŠ[
Ñ_
OŒØJÌ_˜KPPJKKŠJÙŸ[KJ\ŒŒÛŠÌ_›ŠJÜ[VÝ
ÎŒ—OY‹VÝ
ÌLŒ—O[Œ™ŒÜ
Ì_œVÝŒ—OXËVÝ
ÍŒ—O\ŸY[˜Ý[ÛˆÝ
J^Ý˜\ˆLOLÙNžÚYŠÉŠ
O]
WJJ\]VÌWNÙ[Ù^ÚYŠÉJY›ÜŠÎÊ^ÚYŠ]VÌWKÖÌWO\‹\ŠXœ™XZÈNÚYŠOXJÌ_JÉŠOPJÌ_
JJXœ™XZßZYŠJŠYVÐOŒ—JIœ‹LMŽÌI‹LŒLÎLŒŒM
JY›ÜŠÙVØOŒ—O\‹YVÐJÍŒ—KOXJÍOPJÍJ‹LMŽÌIŸœ‰‹LŒLÎLŒŒM
NÊNßZYŠÖÌWO\‹MIœŠY›ÜŠÜ]VÐJÌ_KÖØJÌ_O\‹OXJÌ_OPJÌ_ŽÊNß\™]\›ˆY[˜Ý[ÛˆØJ
^Ý˜\ˆKLOLÒPORLMŸŠ
Ý
KOLÊJKÊ
NÙNšYŠ
ILŒMÍÍÊOŒLLÌŒÌNMJ^ÚYŠLKOŒLMŒÌ
Xœ™XZÈNÜWÜÊ
_Y[ÙHYŠ]]JOŒLŒMÍLÌŠJ^ÝœÝÚ]Ú
ÉšŠJJ^ØØ\ÙHœWÜÊVÐOŒ×KVÐJÎŒ×JNØœ™XZÈNØØ\ÙHNœKRÜÊVÐOŒ×KVÐJÎŒ×KJNØœ™XZÈNØØ\ÙHŽœKWÜÊVÐOŒ×KVÐJÎŒ×JNØœ™XZÈNÙY˜][˜œ™XZÈ\RÜÊVÐOŒ×KVÐJÎŒ×KJ_\™]\›ˆPJÌMŸ\ŸY[˜Ý[Ûˆ[ÊK‹J^Ý˜\ˆLLÏLÚYŠJ
]
JJÑ]
J_
OJŠJJ^Ù›ÜŠÏYVÌÍŒLMWKXNÛ]VÌ—NÊZYŠ\ŠÌ_J
ŠOJÊJJ^ÙNžÝœÝÚ]Ú
YVÌM
ÊŠOŒ—KVÛŠÌL_KL_
^ØØ\ÙHN˜œ™XZÈNØØ\ÙH˜œ™XZÈÙY˜][˜ÛÛ[Y_[]VÛŠÌMOØÛÛ[Y_LIŠVÛŠÍOŒ_
_
VÝ
ÎŒLŒ—OYVÝ
ÎŒLŒ—JÌJKVÝ
ÎŒŒ—OYVÝ
ÎŒŒ—JÌKLPI‰˜XJKJ__Y[˜Ý[ÛˆÜÊ
^Ý˜\ˆKLÒPORLMŸŠ
Ý
KLÊJKÊ
NÙNšYŠ
‰LŒMÍÍÊOŒLLÌŒÌNMJ^ÚYŠŒLMÌÌŠXœ™XZÈNÝRÜÊ
_Y[ÙHYŠŒLŒMÍLÌŠ]O]Ù[Ù^ÝœÝÚ]Ú
ÉšŠJJ^ØØ\ÙHRÜÊVÐOŒ×KVÐJÎŒ×KJNØœ™XZÈNØØ\ÙHNWÜÊVÐOŒ×KVÐJÎŒ×JNØœ™XZÈNØØ\ÙHŽKRÜÊVÐOŒ×KVÐJÎŒ×KJNØœ™XZÈNÙY˜][˜œ™XZÈ]KWÜÊVÐOŒ×KVÐJÎŒ×J_\™]\›ˆPJÌMŸY[˜Ý[ÛˆšJ
^Ý˜\ˆOLÙVÝ
ÌŽMŒ—OLÌÌMÌÍVÝ
ÌÌŒ—OLÍÌÍÍÎOYVÌŒÍWKVÝ
ÌÌŒ—OYVÌŒÍKVÝ
ÌÌŒ—OPKOYVÌŒÍ×KVÝ
ÌÌLŒ—OYVÌŒÍ—KVÝ
ÌÌMŒ—OPKŠ
KVÝ
ÍMŒ—OL‹VÝ
ÌÍŒ—OLËVÝ
ÍŒ—OLLÍÖÝ
ÌMŽOMKVÝ
ÌLÌŒ—OLÌ‹VÝ
ÌLŒ—OLLÌ‹VÝ
ÌLŒ—OM‹VÝ
ÎŒ—OMKVÝ
ÌLŒ—OLÌ‹ÖÝ
ÌÍ_OMVÝ
ÌÍ_KÖÝ
ÌÍŽOMVÝ
ÌÍŽKÖÝ
ÌÎMŸOMVÝ
ÌÎMŸKÖÝ
ÌÎN_OMVÝ
ÌÎN__Y[˜Ý[ÛˆZJKŠ^Ý˜\ˆOLLLÙNžÚYŠJOYVÜŠÌMŒ—JJ^ÚYŠÊŠJXœ™XZÈNØOYVÜŠÌMŒ—_ZYŠKJYVÜŠÌŒŒ—JOŒOŒ
\™]\›ˆ]ÙVÜŠÌÍŒ—WJ‹JNÝšYŠVÜŠÎŒ—O
XOLÙ[Ù^Ù›ÜŠPNÎÊ^ÚYŠJO[ŠJ^ØOLØœ™XZÈZYŠVÊXKL_
JÝOOLL
Xœ™XZßZYŠ
L]ÙVÜŠÌÍŒ—WJ‹JJOŒOŒ
Xœ™XZÈNÝ]
Ø_OPKX_YVÜŠÌŒŒ—_S
JKVÜŠÌŒŒ—OYVÜŠÌŒŒ—JÐKPJØ_\™]\›ˆŸY[˜Ý[ÛˆÚJ
^Ý˜\ˆKLOLÙNžÚYŠ

OYVÌÍJJOŒ
Y›ÜŠÎÊ^ÚYŠ
OYVÌLÍŒŽ
Ê
OŒ—JI‰ˆ]ŠJJ^ÚYŠVÌLÍŒÍŠÊ
OŒ—J\™]\›ˆŽÚYŠOKLK
ŠJXœ™XZÈNÜ™]\›ˆŸZYŠ
JOOJ
\ŠÌ_
JJXœ™XZßXOKLK
J_
WÐJVÌLŠÊLÍŒÌŠÊVÌÍO
_
OŒ—K]

JÌ_
KOYVÌÍKVÌLŠÊLÍŒÌŠÊO
_
OŒ—O\‹Ý
‹
KVÌÍOXJÌJ_\™]\›ˆ_Y[˜Ý[ÛˆÊJ^Ý˜\ˆ‹OLLLÏLÙ›ÜŠ\RLMŸÖÌWOL
OLMI™VÝŒ—JI‰ŠOJQ]
OQÝ
KÊLŽM‹JJJJJÐ_
KONÎÊ^ÙNžÝžÚYŠOŒLŽJ^ÚYŠVÝŒ—O˜IŒJXœ™XZÈØœ™XZÈ_ZYŠJVÝ
ÍŒ—O˜KLÌ‰ŒJ_OŒÌŠXœ™XZÈ_J
JÏQ]
TÊLŽM‹JJJÌ_
JÛŸ
JON
VÜŒ—O[
KÎKŠKOPJØß
_ZYŠ

OXJÌ_
JOOM
Xœ™XZßR\ŠÌMŸY[˜Ý[ÛˆÊKŠ^Ý˜\ˆKLLÏLÚYŠXORLMŸVÌJ^Ù›ÜŠÏYVÌÌLNÎÊZYŠ]]
Ì_J

YÖÌJJOOLÌŸ‹NOŒJJ^Ù›ÜŠ

]ÜÊ
JJOŒ	‰Š
ŠOÌÙVÐOŒ—OYVÐOŒ—_OŽŠTÊLŽMMŽŠKVØJÍŒ—O[‹VØOŒ—O[JËL‹JJK]
NÛJ[
JÌ_
YÖÌJKMŒL
ÌŸŠKNMÏŒŽÊNÚYŠ[ŠXœ™XZß_RXJÌMŸY[˜Ý[Ûˆ\ÊKŠ^Ý˜\ˆOLLLÏLÙNšYŠI‰ˆJ

\‹M
JOL
JY›ÜŠJ
YVÐKMŒ—JJHOLÍÊŠOOLÎOÜŽŒœ‹LÎÊ^ÚYŠÏ\‹JYVÐOŒ—JJXœ™XZÈNÝžÚYŠ[
^ÚYŠ
ŠOOLÌŸ‹NOŒJXœ™XZÈNÚYŠ
ŠHOMÊXœ™XZÈØœ™XZÈ_ZYŠ
ÊHONL‰‰ŠŠOOJ
JXœ™XZÈ_ZYŠOPJÍJ
ŠOŠ
OZ\Š‹
Ø_
JØ_
JJJXœ™XZß\™]\›ˆÖÝ
Ø_OL_Y[˜Ý[ÛˆÐJ
^Ý˜\ˆOLÙNšYŠVJ
J^ÐOLÝšYŠJŒÍŽ
J^ÚYŠLŒÌOŒLLÌ
^ÚYŠ
L	
OŒL
Xœ™XZÈNÚYŠOLK\ÊLÎL
JXœ™XZÈÜ™]\›ˆLÍLŒŸZYŠ

OOLMM_LMMŒN_

OOLM

OKLM‰
JOOLL
JOOMÍLŸLÎLŒL_Œ
Xœ™XZÈNÐOLKLMŒLOŒŒ
O]LLŒÍLÏŒÌ
_\™]\›ˆ_\™]\›ˆ_Y[˜Ý[ÛˆÊJ^Ý˜\ˆLÝÊ
YVÝ
ÍŒ—JI‰‘Ý
LÌÌŒŠK
YVÝŒ—JI‰“JLÌÌMŽ‹
KVÌÌÌŽWO]VÝ
ÌMKVÌÌÌŽLWO]VÝ
ÌLßKVÌÌÌŽLO]VÝ
ÌLŸKJLÍÌ‹VÌWHOLÌßVÐJÌ_HOLLNÐNŠVÐJÌŸOOMÏÌÎŒ
JÐ_
KYVÍLŽNKVÌÌÍÎOYVÍLŽM×KVÌÌÍÎWO]YVÍLÌ—KVÌÌÍŽ—OYVÍLÌWKVÌÌÍŽ×O]YVÍLÌKVÌÌÍŽOYVÍLŽNWKVÌÌÍŽWO]
N™]
LÌÌML‹ÍŠ_Y[˜Ý[Ûˆ›ÊK‹J^ÙÖÝ
ÍLßOLNÙNšYŠVÝ
ÍŒ—OOJŠJ^ÙÖÝ
ÍLŸOLNÝžÚYŠJYVÝ
ÌMŒ—JJ^ÚYŠVÝ
ÌÍŒ—OLKVÝ
ÌŒ—OXKVÝ
ÌMŒ—OPK
JHOLJXœ™XZÈNÚYŠVÝ
ÍŒ—OOLJXœ™XZÈØœ™XZÈ_ZYŠ
JOOJŠJ^ÚYŠ

YVÝ
ÌŒ—JJOOL‰‰ŠVÝ
ÌŒ—OXKXJKVÝ
ÍŒ—HOLJXœ™XZÈNÚYŠ
ŠOOLJXœ™XZÈØœ™XZÈ_YVÝ
ÌÍŒ—OYVÝ
ÌÍŒ—JÌ_YÖÝ
ÍMOL__Y[˜Ý[ÛˆÜÊJ^Ý˜\ˆLOLLLÏLÙNšYŠYVÐOŒ—JY›ÜŠÎÊ^ØOLÝšYŠ
^Ù›ÜŠØÏYÖØJÜŸK
YVÊOŠJÝŒ—JI‰ŠOXJÌ_
ÊOOJŠJNÊNÜŽœÝÚ]Ú
‹LÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈŽÙY˜][˜œ™XZÈZYŠXÊXœ™XZÈ_ZYŠJYVÊ
[
Ì_
OÊJÐOŒ—JJXœ™XZß\™]\›ˆVÍ
Ê
ÊJÐ_
OŒ—_Y[˜Ý[Ûˆ˜JJ^ÙNšYŠ
JOLL
^ÚYŠ
NNMÍÌLMNLŽLËOŒŒÊ^ÐOPKLLŒßØœ™XZÈ_]
NNMÍÌLMNLŽLËOJ
JOLÌŽOÌÌŽNJKLŒŸY[ÙJJO‹LLŒß

LŒMŽÍŒMÌÙKLÌËOŒŽMMLÌÐOPJÎMŽ_Š
LŒMŽÍŒMÌÙKLÌËOJ
JOKLŽMŒËLŽMŒJJÌNLÎ
JNÜ™]\›ˆŠ
KŠKJÌLŒÏŒ
K
ŠÔJ
_Y[˜Ý[ÛˆØJK‹J^Ý˜\ˆ‹ËLÜ™]\›ˆ[RLMŸVÛ
ÌLŒ—OXK[RLMŒÏPOÝ›ŠÌMNVÛŠÌMŒ—OXËKLKPKL_VÛŠÌMŒ—O]ŒPOŒÝŒY]
‹M
KVÝ
ÍÍŒ—OKLKVÝ
ÌÍŒ—OLMËVÝ
ÎŒ—OKLKVÝ
ÍŒ—O]
ÌMNKVÝ
ÎŒ—O]
ÌM
JOÙVÍMÎNOMŒNŠÖÌ×OLUŠ‹KMKMŠJK]
ÌMŒ[
ÌMŸŸY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆLOLLÙNšYŠ]VÌJY›ÜŠÎÊ^ÚYŠJO]VÌWJJ^Û\ŽØœ™XZÈ_ZYŠ
ŠHOJJI‰Š
O\‹MOŒÌÌŸŽœŠJHOJ

]VÌWJKMOŒÌÌŸŽœŠJJ^Û]VÌNØœ™XZÈ_ZYŠOPJÌ_]VÝ
Ì_K]
Ì_\ŠXœ™XZß\™]\›ŠJLMI›ŠKMOŒÌÌŸ
KJ
]VÌWJKMOŒÌÌŸ
_Y[˜Ý[ÛˆÚJKŠ^Ý˜\ˆOLLÚYŠOYVÜŠÍÌŒ—KVÜŠÍÌŒ—OXKL_K

OYVÜŠÍŒ—JJOOJ
YVÜŠÎŒ—JJOØOPNŠ
KOPOŒŠO[‹X_
OŒØNJKVÜŠÍŒ—OXJÙVÜŠÍŒ—K]
Ø_OPKX_
KJY›ÜŠÎÊ^ÚYŠÊŠ_JL]ÙVÜŠÌÌŒ—WJ‹JJJ\™]\›ˆKX_ÚYŠ]
ÛŸJOXK[Ÿ
JXœ™XZß\™]\›ˆ_Y[˜Ý[ÛˆÜÊ
^Ù›ÜŠ˜\ˆOLLOLLÝJO]
JÌ_

YÖÌWJJOOLÌŸ‹NOŒNÊNÙNžÝžÜŽœÝÚ]Ú

YÖÌWJKMß
^ØØ\ÙH˜œ™XZÈØØ\ÙHŽ˜œ™XZÈŽÙY˜][˜œ™XZÈ_[L_\YÖÌKO]ZYŠ‹MŒL
Y›ÜŠØOM
ÊÊKL
KYÖÌW_
_YÖÐJÌ_KOPJÌ_MŒLÊNÜ™]\›ˆØNŒX_Y[˜Ý[Ûˆ[ÊJ^Ý˜\ˆ‹K‹LÜ™]\›ˆ\RLÌŸVÐOŒ—OLVÐJÍŒ—OLVÊXOPJÌ
OŒ—OLVÛ
ÍŒ—OLVÊ[PJÌMŸ
OŒ—OLVÛ
ÍŒ—OLVÊPJÎ
OŒ—OLVÛ
ÍŒ—OLVÜŠÌŽŒ—OPJÌŽVÜŠÌŒ—OXKVÜŠÌŒŒ—OPJÌŒVÜŠÌMŒ—O[‹VÜŠÌLŒ—OPJÌL‹VÜŠÎŒ—O[VÜŠÍŒ—OPJÍVÜŒ—OPKU
MLËŠK\ŠÌÌŸY[˜Ý[ÛˆÛÊ
^Ý˜\ˆOLLOLÚYŠ
O]VÌJI‰Š
]VÝ
Ì_JOÊP_
O]VÝ
ÌŸJI‰ŠŸPOM‹
]VÝ
ÌßJI‰ŠŸ]
JJNœPJK

OYVÌÍŒLMWJJOŒ
Y›ÜŠLÎÊ^ÚYŠJJOYVÌM
ÊŠOŒ—J_VØOŒ—HOJŠJJ\™]\›ˆVØJÌLNÚYŠ
JOOJ
]
Ì_
JJXœ™XZß\™]\›ˆY[˜Ý[ÛˆÜÊK‹J^Ý˜\ˆ‹LÏLLLOLÒ[RLVÛŒ—O]LNÙNšYŠJ
ŠOŠJY›ÜŠ]ÎÊ^ÚYŠ
[ÊÏJ[M
KYVÊ
\‹LŸ
OŠJØOŒ—_JJOL	‰Š[ÊJJOL
Xœ™XZÈNÚYŠOXËJÏJ[ÊËJJOL
OÒN›VÊŠJÛŒ—O[YŠÌ_J

XÏÜ‹L_œ
JOŒJJXœ™XZßZZJ‹ŠK[ŠÌY[˜Ý[Ûˆ
KŠ^Ý˜\ˆK‹ÏLÜ™]\›ˆ[RLMŸVÛŠÌLŒ—O\‹XORLMŒ
XJÎLLŽM
KVØJÍLŒ—O]VØJÌŽŒ—O]ÏJÏKL‹]
OŒŒŒMÍÍÏÌŒMÍÍÎ˜ËVØJÍMŒ—OXË]
ØßVØJÌÍŒ—O]VØJÌŒ—O]UÚJKŠKÉ‰ŠOYVØJÌŽŒ—KÖÐKJ
JOOYVØJÌŒ—J_OL
KXJÌMŒ[ŠÌMŸY[˜Ý[ÛˆZJJ^Ý˜\ˆ‹OLLLÏLLÚYŠOM\RLMŸ
JOLŠY›ÜŠVÊJOŠJÝ
OŒ—O\ŽÎÊ^Ù›ÜŠXOŒLMÌMŽ˜K
VÙŒ—KVÝŒ—K
KLØÏJŠJÝ[ŠÌ_
VØÏŒ—KVÊŠJÝŒ—K
KVØÏŒ—OYVØÏŒ—JÛ
JHOJŠNÊNÚYŠJOXK[
JXœ™XZßR\ŠÌMŸY[˜Ý[Ûˆ]
KŠ^Ý˜\ˆKLÜ™]\›ˆXORNMŸVØJÎŒ—OLVØJÎLŒ—OLLÌÍÍNVØJÎŒ—OPKO[ÜŠJÎ‹JÎ‹
KLÍŽÌLL‰ŠYVØJÎŒ—JOÊOYVÍÌŒ—KVÍÌŒ—OLÖØJÌŸOLÌ‹ÖØOŒWONNL‹JLßKVØJÎŒ—KÍÊKSÙJ‹
KÝ
‹NL
KVÍÌŒ—OPJNPOÛŽŒXJÎMŸY[˜Ý[ÛˆÛÊKŠ^Ý˜\ˆOLLLÛU\Ê
KOYVÐOŒ—NÙNžÝšYŠ
ŠOL
^ÚYŠJ^ÚYŠ]ŠŠJXœ™XZÈÊYVØJÍŽŒ—JI‰™J
KJJKVÐOŒ—OLYVÐOŒ—O\

KQÝ
‹
K
YVÐOŒ—KŠÌŒŽ
I‰Š˜JVÙVÌÌŽMÌ—JÍŒŒ—JKÖÌOLKLJKOYVÐOŒ—KVØJÌŽLŒ—O[ŸY[ÙHYŠXJXœ™XZÈNÙÖØJÌŽOL\™]\›ˆŸY[˜Ý[ÛˆÛÊ
^Ý˜\ˆOLLÜ™]\›Š
OYVÝ
ÍÍŒ—JJOL	ŠP_VÍMŽŒ×HOJLLÌÍÍNIJJOÊYVÊO]
ÍÍŸ
OŒ—KVÐOŒ—O\ŸLÌÍÍNŒË

YVÝ
ÍŒ—JJOOYVÝ
ÎŒ—OÝTPJ
NŠVÝ
ÍŒ—O\ŠÌK]VÌ—JKVÐOŒ—OL
NŠ
OYVÝ
ÍŒ—JJHOYVÝ
ÎŒ—OÊVÝ
ÍŒ—OPJÌKVÌWJN”PJ
_Y[˜Ý[ÛˆœŠKŠ^Ý˜\ˆOLLÙNžÝžÚYŠŒM
^ÚYŠÉŠJJXœ™XZÈÙ›ÜŠÎÊ^ÚYŠVÝŒ—HOYVÐOŒ—JXœ™XZÈÚYŠOPJÍ]
ÍJ
\‹M
OŒŒÊJXœ™XZß_ZYŠ\ŠXœ™XZÈ_Y›ÜŠÎÊ^ÚYŠ

O]VÌJJOOJ
]VÌWJJJ^ÚYŠOPJÌ_]
Ì_\‹L_
XÛÛ[YNØœ™XZÈ_Xœ™XZß\™]\›ˆK[Ÿ\™]\›ˆY[˜Ý[ÛˆXJJ^Ý˜\ˆ‹OLLLÒ\RLMŸOÊJ‹J
OPOŒÌJWJKX_
O[YJŠJJÎ_
KL
ÙVÜŠÎŒ—_OJMLÍ—™VÜŠÌLŒ—JJÊMMXOMŠ_KLŒMÍÍ	_
O[ŒŒØJÌ_˜JKOYVÜŠÍŒ—KOYVÜŒ—JNOLVÝŒ—OPKVÝ
ÍŒ—OXKVÝ
ÎŒ—O[‹VÝ
ÌLŒ—O[\ŠÌMŸY[˜Ý[ÛˆÊ
^Ý˜\ˆKLOLLÚYŠ

P›ÊŒJJJOOJ
J\™]\›ˆÙNšYŠ]VÊO\‹]
JÝI‰ŠYVÍMŽJI‰ŠOYVÜŒ—JJ^Ù›ÜŠÎÊ^ÚYŠœÊKJ_
OYVÜŒ—JÐ_VÌWHOMŒJJ^ÚYŠOYVÜŠÍŒ—K\ŠÍJXÛÛ[YNØœ™XZÈ_Xœ™XZß[XJÌ_\™]\›ˆŸY[˜Ý[Ûˆ\Ê
^Ý˜\ˆOLLÙNšYŠJ

YVÌÍŒWJJOL
J^Ù›ÜŠÎÊ^ÚYŠ]ŠÊK
JÌLÍÎMŸ
J^ÙVÌÍM×OPNØœ™XZÈ_ZYŠ
ŠOOJ
OPJÌ_
JJXœ™XZß\™]\›‹L_\™]\›ŠJJOOJŠJOËLNŠ

]ËLNJJHOYVÌÍŒLMI‰ŠVÌÍŒLMWOLJ
KVÌÍŒLMO]VÌÍŒLMWOYVÌÍŒLMWJÌJKJ_Y[˜Ý[Ûˆ[ÊK‹J^Ý˜\ˆLLÙNšYŠ
ÌŸVÌWJHOLÌŠ^ÚYŠJ
JOŒŠOKUØJK‹JJOŒOÍŽ›ŠKVÌ—HOLŒJY›ÜŠŸLKOPJÛLNÎÊ^ÚYŠ
ÌŸVÌWJOOLÌŠXœ™XZÈNÚYŠOUØJK‹ŠJÐ_[
Ì_VÌ—OOLŒJXœ™XZß\™]\›ˆÝ
NLŠK\™]\›ˆœŠ‹K
K_Y[˜Ý[Ûˆ\ŠJ^Ý˜\ˆ‹OLLLÚYŠŒLLÊ\™]\›ˆÖÌWO]NÚYŠŒLLLMLLŠ\™]\›ˆÖÌWOLÌ‹NÙ›ÜŠOTÊ]ŒŒÌNŒMLÍÌŽŒËŠKÖÌWO]VÜŠÎLÎŸ_˜NØOXKMŸÖÊ[ŠÌ_
JÐ_O]˜IŒßLŽ

[
Ì_
JHOJŠNÊNÜ™]\›ˆŠÌ_Y[˜Ý[ÛˆØJ
^Ý˜\ˆOLLÙNžÚYŠ

OYVÝ
ÌLŒ—JJOYVÝ
ÌMŒ—J^ÚYŠOL

LYJVÝ
ÎŒ—K
ÌŒ
JJOL
^ÚYŠ\Ÿ
ŠOOKM
Xœ™XZÈNÜ™]\›ˆVÍMÎNOL\‹YVÝ
ÌMŒ—O\Ÿ\PKO]
Ð_VÝ
ÌLŒ—O\ŠÐ–ÐJÍŒWKYVÐJÌÍŒ—KVÝŒ—OYVÐJÌÌŒ—KVÝ
ÍŒ—O\‹OPJÌ\™]\›ˆ_Y[˜Ý[Ûˆ›ÊJ^Ý˜\ˆ‹OLÚYŠOYVÝ
ÍŒÌŒ—J\™]\›ˆHJJKJJNÙNžÝžÚYŠ

YVÝ
ÍŒŒ—JJOŒ
^ÚYŠOL
OPK\Ÿ
KLOŒMJXœ™XZÈØœ™XZÈ_ZYŠ
OPKLNLŸ
OŒMLÊ\™]\›ˆLŽ	VÌÍ
ÊVØJÎMJÝ
_NÚYŠOLOŒŒMJXœ™XZÈ_XOLLŽ	VÌÍ
Ê
Ð_
__\™]\›ˆ_Y[˜Ý[ÛˆÜÊKŠ^Ý˜\ˆK‹Ü™]\›ˆJO]

JŠJ˜JJŠMNMŽLNMLŒLMMYKL
˜KLLLÍŒLÍŽŒÙKL
JÊJŠÍMMÌÌLÍÌÌÌŽKLŒŠ˜KKŒNNLŽNŽNMÎMJJËŒÌÌÌÌÌÌÌÌÌÌŒJKXJÝJJŠJK[
›ŠKPJËŒMŒÌŠ›ŠN›ŠŠJ›KŒMŒÌŠJÝY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆ‹OLLLÒ\RLMŸOÊJ‹OPK
O[YJJJJÎ_
KOL
ÙVÜŠÎŒ—_OJMLÍ—™VÜŠÌLŒ—JJÊMMPOMŠ_[Œ˜OŒÐJÌ_KYVÜŠÍŒ—KOYVÜŒ—JNOLVÝŒ—OPKVÝ
ÍŒ—O[‹VÝ
ÎŒ—OXKVÝ
ÌLŒ—O[\ŠÌMŸY[˜Ý[ÛˆJ
^Ý˜\ˆKLÒPORLMŸÖÐJÌM_OLLÙNžÚYŠJYVÝ
ÌMŒ—JJ^ÚYŠÊ
JXœ™XZÈNÜYVÝ
ÌMŒ—_JŠOOJ
YVÝ
ÌŒŒ—JJ_VÝ
ÎŒ—OOLLÜ]ÙVÝ
ÌÍŒ—WJJÌM_JNŠVÝ
ÌŒŒ—O\ŠÌKÖÌ—OLL
_RPJÌMŸY[˜Ý[ÛˆÊ
^Ý˜\ˆKLÜ™]\›ˆYVÝ
ÍÌŒ—KVÝ
ÍÌŒ—O\‹L_‹VÝ
ÌŒŒ—HOYVÝ
ÌŽŒ—I‰œ]ÙVÝ
ÌÍŒ—WJ
KVÝ
ÌŽŒ—OLVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OL	ŠYVÝŒ—JOÊVÝŒ—OLÌŸ‹LJNŠOYVÝ
ÍŒ—JÙVÝ
ÍŒ—_VÝ
ÎŒ—OPKVÝ
ÍŒ—OPKÏŒÌJ_Y[˜Ý[ÛˆœÊ
^Ý˜\ˆOLÙNžÝžÜŽžÜÎžÚYŠ

\œÊ
JJOLŽÍÍLŠ^ÚYŠ]
Xœ™XZÈNÚYŠ

OOLŽÍÎJXœ™XZÈÚYŠ

HOLŽÍÌÊXœ™XZÈÎÜ™]\›ˆŸZYŠ

OOLŽÍÍLß

OOLŽÍÍÍNJXœ™XZÈŽÚYŠ

OOLŽÎLŽMJXœ™XZÈ_\™]\›‹L_\™]\›ˆŸPOL_\™]\›ˆ_Y[˜Ý[Ûˆ]

^Ý˜\ˆOLLOLÙNžÚYŠÉŠO]
JY›ÜŠÎÊ^ÚYŠ]VÌWJXœ™XZÈNÚYŠJÉŠOPJÌ_
JJXœ™XZßY›ÜŠÜPKOPJÍJŠOYVÜŒ—JI˜KLMŽÌI‹LŒLÎLŒŒM
NÊNÙ›ÜŠÜJO\ŠJÌ_VÌWNÊNß\™]\›ˆK]Y[˜Ý[ÛˆJKŠ^Ý˜\ˆKLLÏLÙVÝ
ÌLLŒ—OPKVÝ
ÌLMŒ—O\‹OYVÝ
ÍŒ—KYVÝ
ÍŒ—KX_VÝ
ÌLŒŒ—O[‹VÝ
ÌLŒ—O[ŒÌKYVÝ
ÎŒ—K_‰‰Š
ŠOJ
ÏJ[‹X_
OŒÌJJIOŒ[Œ
ŠOŠÊ_
PJØ_
JKVÝ
ÌLŒ—O[ŸY[˜Ý[Ûˆ›ÊJ^Ý˜\ˆ‹KLÚYŠŠ
Ý
KLÊJKOLÊ
K

\ŒŒ	ŒŒÊJHOLŒÊ^ÚYŠ[Š\™]\›ˆOLÛLŠQ›ÊNÍÌÍÌMML™LÊJKYVÐOŒ—JËM
KVÐOŒ—O[‹ÙVÐOŒ—O[‹LLŒ‹ŠJKŠKLŒMÍLÌÉœŸLÌMÌŠKJÔJ
_\™]\›ˆY[˜Ý[Ûˆ[ÊKŠ^Ü™]\›ˆVÝ
ÌŒŒ—HOYVÝ
ÌŽŒ—I‰Š]ÙVÝ
ÌÍŒ—WJ
KYVÝ
ÌŒŒ—J_
VÝ
ÌŽŒ—OLVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OL]ÙVÝ
ÍŒ—WJK‹
K
JO
OËLNŠVÝ
ÍŒ—OLVÝ
ÎŒ—OLVÝŒ—OKLMÉ™VÝŒ—K
_Y[˜Ý[ÛˆÜÊJ^Ý˜\ˆ‹KLÜ™]\›ŠOLKJKJŠ]

JJJÊKXK[ŠÊŠŠŠŠŠŠMNÌŽMÍÌÙKLŒ
œ‹KŒLÎÍLJJËŒMŠJÊ\ŠœŠJ›ŠŠŠŠLLLÍNMÍMMÍÎNMYKLÊœŠÌŒÍMÌŒÌŒLŽNMÍYKL
KLÍMMÌÌMÍLLÎLŒÙKLŒÊJK]
JJ_Y[˜Ý[ÛˆœÊKŠ^Ý˜\ˆOLLÚYŠJY›ÜŠÜ\‹L_]UZJKL
KO[KÖÌ—O[‹PPJKL
_POŒŽKOXKŽÊNÚYŠ
Y›ÜŠÐOJŒ
KÌLÖÌ
\‹L_
WO]TÊKL
_O]ŒŽKPKNÊNÜ™]\›ˆŸY[˜Ý[ÛˆÛÊJ^Ý˜\ˆLOLLÙNšYŠ
^Ù›ÜŠÛYÖÐJÜŸK
OYVÊŠJÝŒ—JI‰Š\ŠÌ_
ŠOOJJJNÊNÝœÝÚ]Ú
KLÍ
^ØØ\ÙH˜Ø\ÙHN˜œ™XZÈÙY˜][˜œ™XZÈ_ZYŠ[Š\™]\›ˆ\™]\›ˆ_Y[˜Ý[ÛˆÛÊKŠ^Ý˜\ˆKLÜ™]\›ˆXORLMŸJ	JI‰ŠLNN	ŸJ_
VØJÌLŒ—O\ŠÍYVÜŒ—JKVØOŒ—O[‹VØJÍŒ—OL
LJLLÌÍŽKJJOŒMŽMMŒÌŒI‰ŠVÍMÎNOL]KLJKXJÌMŸY[˜Ý[ÛˆœÊKŠ^Ý˜\ˆOLLLÚYŠ\Š\™]\›ˆÙNšYŠO]VÌJ^Ù›ÜŠÎÊ^ÚYŠ
]VÌWJI‰ˆJJ\‹L_
_
JHOJŠJJ^ÚYŠOPJÌ_O]VÝ
Ì_K]
Ì_JXÛÛ[YNØœ™XZÈ_Xœ™XZß[X_\™]\›ŠMI›
K]VÌW_Y[˜Ý[ÛˆÝ
J^Ý˜\ˆ‹OLÒXORLLŽOY]
KLŽ
KÖØJÎNONKÖØJÍŸONKÖØJÌÍO]ÖØJÍŽŒWOLKYVÌÍŒLWKVØJÌLŒ—O\‹VØJÍÌŒ—O\‹VØJÍŒ—OYVÌM
ÊŠOŒ—KÖØJÌŸONKVØJÎŒ—O\‹PJJÌÌŸK
KXJÌLŽY[˜Ý[ÛˆšJ
^Ý˜\ˆOLLOLÚYŠÖÙVÝŒ—WKMŒLL
\™]\›ˆÙ›ÜŠØOYVÝŒ—KKLKOŒLŒMÍÍ	‰ŠJ
YÖÌWKM
JOŠŒMÍÍ×ŠOTÊKL
JJOËLNœŠÐ_
KVÝŒ—OXJÌKO\‹ÖØJÌ_KMŒLÊNÜ™]\›ˆ_Y[˜Ý[ÛˆÊJ^Ý˜\ˆLÚYŠJ]VÝŒ—KMŒLL
J^ÚYŠVÝŒ—KMŒL
Y›ÜŠÜJVÝŒ—JÔÊ‹L
_
KMVÊ]
Í
OŒ—KMŒLÊNÊJOOLI‰ŠJXJVÝŒ—JJOOLLMOÔÊ‹YLÊNœŠ_\™]\›ˆŸY[˜Ý[Ûˆ\Š
^Ý˜\ˆOLÐOLNÙNžÝœÝÚ]Ú
ÜŠ
J^ØØ\ÙHÌšYŠOL

OOLMŒ

OONNN_

OONŒÎJXœ™XZÈNÜ™]\›ˆNØØ\ÙHšYŠNOŒJ\™]\›ˆNÚYŠ

OOLLÌÊXœ™XZÈNØœ™XZÎØØ\ÙHŽ˜Ø\ÙHŽN˜œ™XZÈNÙY˜][˜œ™XZÈPOL\™]\›ˆ_Y[˜Ý[Ûˆ\ÊKŠ^Ý˜\ˆKLÜ™]\›ˆXORLMŸÖØJÍŸOLÖØJÍßONMKZ\ŠPKOXJÎ
JØ_ÖÛŠÎOLÌ‹ÖÛŠÎ_OL]
JÍßŠ_
ÖØJÍßOLÌ‹]
KŠ_
K‹Œ
JKXJÌMŸÖÌ—_Y[˜Ý[ÛˆØJ
^Ý˜\ˆOLLÜLMÌÙNšYŠJ

OMÌ
JY›ÜŠÎÊ^ÚYŠ

OOJŠJ\™]\›ˆ–ÌLMŒMŠÊO_ŠOŒWNÚYŠ
ŒMÍÍ‰ŠOPJÌŸ
JOOLL
Xœ™XZÈNÚYŠJ

P–ÌLMŒMŠÊOJOŒWJJOJ
JJXœ™XZß\™]\›ˆY[˜Ý[ÛˆPJK‹J^Ý˜\ˆ‹Ë‹LOLÜ™]\›ˆTÊ\ŒMŸO]ŒMŸ
KJMLÍIŠOJ
ÏTÊMMLÍIœ‹MMLÍI
JOŒMŸ
JÔÊKŠ_
JJÔÊ
_OJÊKŠJÙŸ
JÔÊJJÊOŒMŠJÊŒMŠ_MLÍI˜ßMŸY[˜Ý[ÛˆXJ
^Ý˜\ˆOLLOLLÙ›ÜŠOLÍÎÎÊ^ÚYŠ

YVÌL
Ê
OJJÛŸ
KÌŸ
O
OŒ—JJOOJ
J\™]\›ŠOYVÌL
ÊO
OŒ—J_ÚYŠJ

J]ŒœŒ
OØJÌ_›ŠJOJ
O\ÐN˜KL_
JJJXœ™XZß\™]\›ˆY[˜Ý[ÛˆÊ
^Ý˜\ˆOLLOLLÙ›ÜŠOLÍÎÎÊ^ÚYŠ

YVÌL
Ê
OJJÛŸ
KÌŸ
O
OŒ—JJOOJ
J\™]\›ŠOYVÌL
ÊO
OŒ—J_ÚYŠJ

J]ŒœŒ
OØJÌ_›ŠJOJ
O\ÐN˜KL_
JJJXœ™XZß\™]\›ˆY[˜Ý[ÛˆJ
^Ý˜\ˆKLÜ™]\›ˆPORLLLŸ
LÝ
JJOŒMŽMMŒÌŒI‰ŠVÍMÎNOL]KLJKLYVÍMÎN_
KLÌK
ŒM	™VÐJÌLŒ—JHOLMŒÎ	‰ŠYVÐJÍŒ—JJKPJÌLLŸ\ŸY[˜Ý[ÛˆÛÊKŠ^Ý˜\ˆNÚYŠJOYVÝ
ÌMŒ—JJ\™]\›ˆVÝ
ÌÍŒ—OLKVÝ
ÌŒ—O\‹›ÚY
VÝ
ÌMŒ—OPJNÙNžÚYŠ
JOOJJJ^ÚYŠVÝ
ÌŒ—HOLŠXœ™XZÈNÜ™]\›ˆ›ÚY
VÝ
ÌŒ—O\Š_YÖÝ
ÍMOLKVÝ
ÌŒ—OL‹VÝ
ÌÍŒ—OYVÝ
ÌÍŒ—JÌ__Y[˜Ý[ÛˆŠK‹KŠ^Ý˜\ˆÚYŠ[RLMŸJÌÍÌŽ	›Ÿ
ŠOJJJJ^ÚYŠ]
MIK
JO\‹X_
OŒMŠOØNŒMŠK\ŠY›ÜŠÖ\ŠMŠK
OXKLMŸ
OŒŒMNÊNÖ\ŠJ_R[
ÌMŸY[˜Ý[Ûˆ˜JKŠ^Ý˜\ˆOLÙNžÚYŠ
^ÚYŠOYVÝŒ—J^ÙJVØJÍŒ—JKOYVÝŒ—NØœ™XZÈ_ZYŠO]JMŠKVÝŒ—OXKJXœ™XZÈNÐOM\™]\›ˆ_\™]\›ˆVØOŒ—OLVØJÍŒ—OYJŠKYVÝŒ—KVÝ
ÎŒ—OLVÝ
ÌLŒ—OL_Y[˜Ý[ÛˆÜŠ
^Ý˜\ˆOLLÞJ
K]ÙVÝ
ÌLŒ—WJ
KI™ÖÌ_

OYVÝ
ÍLŒ—JI‰ŠVÐJÍMŒ—OYVÝ
ÍMŒ—JK
YVÝ
ÍMŒ—JI‰ŠVÜŠÍLŒ—OPJKVÍMŽM—OOJ
I‰ŠVÍMŽM—O\ŠKJVÝ
ÎMŒ—JKJ
J_Y[˜Ý[Ûˆ˜J
^Ý˜\ˆOLLÐOLNÙNžÝžÜŽžÜÎœÝÚ]Ú

TÜŠ
JKN_
^ØØ\ÙHN˜œ™XZÈNØØ\ÙHŽ˜Ø\ÙHN˜œ™XZÈŽØØ\ÙH˜œ™XZÈÎÙY˜][˜œ™XZÈ\™]\›ŠXJ
JHOJ
_\™]\›ˆ]
ŠOŒMIŒ_POL\™]\›ˆ_Y[˜Ý[ÛˆÊ
^Ý˜\ˆK‹KLLÚYŠOQ]

JÌ_YVÌÌÌŽ—K

JOYVÌÌÌŽ×JJØ_
JOYVÌÌÌŽ—J^ÚYŠJWÐJ‹\ŠÌYLß
JJ\™]\›‹LNÙVÌÌÌŽ—O[VÌÌÌŽ—O[Ÿ\™]\›ˆ
ŠÐ_JKVÌÌÌŽ×O\‹_Y[˜Ý[ÛˆÊ
^Ý˜\ˆOLÜ™]\›ˆOYVÝ
ÍÌŒ—KVÝ
ÍÌŒ—OPKL_K	ŠOYVÝŒ—JOÊVÝŒ—OLÌŸKLJNŠVÝ
ÍŒ—OLVÝ
ÎŒ—OLOYVÝ
ÍŒ—KVÝ
ÌŽŒ—OPKVÝ
ÌŒŒ—OPKVÝ
ÌMŒ—OPJÙVÝ
ÍŒ—K
_Y[˜Ý[Ûˆ[ÊK‹J^ÙNšYŠ
^ÝœÝÚ]Ú
JÌŸ
^ØØ\ÙHœ™]\›ˆ›ÚY
ÖÌO\ŠNØØ\ÙHNœ™]\›ˆ›ÚY
ÖÝŒWO\ŠNØØ\ÙHŽ˜Ø\ÙHÎœ™]\›ˆ›ÚY
VÝŒ—O\ŠNØØ\ÙHN˜œ™XZÈÙY˜][˜œ™XZÈ_YVÝŒ—O\‹VÝ
ÍŒ—OX__Y[˜Ý[ÛˆÛÊK‹K‹Ë‹
^Ý˜\ˆNÒRORLMŸJKK‹K‹Ë‹LŒMÍÍœ
KOYVÒOŒ—KYVÒJÍŒ—KOYVÒJÌLŒ—KVÝ
ÎŒ—OYVÒJÎŒ—KVÝ
ÌLŒ—OPKVÝŒ—OXKVÝ
ÍŒ—O\‹RJÌMŸY[˜Ý[ÛˆŠJ^Ý˜\ˆLOLÙNšYŠJJ]VÌJ_
ŠHOJ
O]VÌWJJJJY›ÜŠÎÊ^ÚYŠO]VÐJÌ_KJ]VÝ
Ì_JJXœ™XZÈNÚYŠOPJÌ_]
Ì_
ŠHOJJJXœ™XZß\™]\›ˆ‹X_Y[˜Ý[ÛˆÊJ^Ý˜\ˆLOLLÚYŠJYVÝŒ—JJ\™]\›ˆÎNNÚYŠVÝ
ÍŒ—HOJJJY›ÜŠÎÊ^ÚYŠJYVÊO]
Î
OŒ—JJ\™]\›ˆÎNNÚYŠ]XKVÛŠÌLŒ—OOJJJXœ™XZß\™]\›ˆŸY[˜Ý[Ûˆ›ÊKŠ^Ý˜\ˆOLLLÙNšYŠŠ^Ù›ÜŠÎÊ^ÚYŠJJOYVÐOŒ—J_JYVÝŒ—J_
JHOJŠJJ^ÚYŠOPJÍ]
Í\‹L_
XÛÛ[YNØœ™XZÈ_Xœ™XZß[[‹X_\™]\›ˆY[˜Ý[ÛˆœŠ
^Ý˜\ˆKLOLÚYŠ

OYVÌÍŒLMWJJOŒ
Y›ÜŠÎÊ^ÚYŠJJOYVÌM
ÊŠOŒ—J_VØOŒ—HOJ
JJ\™]\›ˆVØJÌLNÚYŠ
JOOJ
\ŠÌ_
JJXœ™XZß\™]\›ˆY[˜Ý[Ûˆ

^Ý˜\ˆKŽÜ™]\›ŠJOYVÌÌÌMÍWJJÊ]
ÍÉ‹N
_
OŒPOŒ	‰œŸŒ’Ë˜ž]S[™ÝÍMLÍMŒ	‰ˆJ

JOÊVÍMÎNOMLJNŠVÌÌÌMÍWO]J_Y[˜Ý[ÛˆÊ
^Ý˜\ˆOLÙNšYŠJ
OTÜŠ
JOŒŒÊJ^ÚYŠJOIŒLÍNLÌŠJ^ÚYŠ
JOOMŠ\™]\›ˆNÚYŠ
JHONJXœ™XZÈNÜ™]\›ŠÊ
JHOJ
_\™]\›ˆ]
JOŒM	Œ_\™]\›ˆY[˜Ý[Ûˆ	
J^Ý˜\ˆLÜ™]\›ˆÖÌOPOŒÖÌ
JOŒŒMÍÍÌŒMJJÝ
WOPOŒM‹ÖÌ
\ŠÈHJMÌLMŽ	J_
WOPOŽÖÌ
\ŠÈHJLŽ	J_
WOPKÖÜŠÈHJMIJ_OLY[˜Ý[ÛˆÙJJ^ÙNšYŠ

YœŠJJJOLŽÍÍLŠ^ÚYŠ]

OOLŽÍÎ_

HOLŽÍÌÊXœ™XZÈNÜ™]\›Ÿ_Y[˜Ý[Ûˆ™J
^Ý˜\ˆOLÜ™]\›ˆOYVÝŒ—KL_
OYÖÌLŒMŒ
ÊÊPIKLLLMÎJOŒß
_J_
YVÝ
ÍŒ—KOJYÖÌLŒMŒ
ÊÊ]	LLLMÎJOŒß
_JOÝ
ÌÌŸŒ
K_Y[˜Ý[ÛˆJ
^Ý˜\ˆOLLOLÙNžÚYŠJ
OTÜŠ
JOŒŒÊJ^ÚYŠLKLMÌ‰ŠOLOJJXœ™XZÈNÚYŠLÍŒÎMŽ	˜J\™]\›ˆ]
JOŒL	Œ_\L\™]\›ˆŸY[˜Ý[ÛˆJ
^Ý˜\ˆOLLOLÙNžÚYŠJ
OTÜŠ
JOŒŒÊJ^ÚYŠLKÍÍL‰ŠOLOJJXœ™XZÈNÚYŠLÍŒÎMŽ	˜J\™]\›ˆ]
JOŒL	Œ_\L\™]\›ˆŸY[˜Ý[ÛˆÝ

^Ý˜\ˆOLÊYVÍMÎM×JI‰Š
OYVÝ
ÎŒ—JI‰œ]ÙVÙVÐOŒ—JÌLŒ—WJJK
OYVÝ
ÍŒ—JI‰œ]ÙVÙVÐOŒ—JÌMŒ—WJJKJ
JKVÍMÎM×OLVÍMÎM×O\PJ
_Y[˜Ý[Ûˆ]
J^Ý˜\ˆLÜ™]\›ˆ	‰ŠPPJK
K
JOŒMLÍŸ
[OËLNœŠJKJ]JŠJ_JÉVÝMJ_]
ŠKY[˜Ý[Ûˆ
J^Ý˜\ˆ‹NØOYVÌLÌLŽ
ÊKTÊJJKÌLL
OŠOŒ—KVÝ
ÌLŒ—OXKVÝ
ÎMŒ—OXKJÎNOŒLNNI‰ŠVÝ
ÌLŒ—OYVÌLÌLŽ
ÊŠOŒ—J_Y[˜Ý[ÛˆÐJ
^Ý˜\ˆOLÊO]JLÍ
JI‰ŠS
KLÍ
KOLŒMŒNLŠÊVÍLÍNO
_VÐOŒ—OLLKVÐJÎŒ—O]YVÍLÍNJÌ_VÍLÍNOJ
OLMŽOÝŒ
_Y[˜Ý[ÛˆJJ^Ý˜\ˆLÙNšYŠYVÝŒ—JY›ÜŠÎÊ^ÚYŠI‰ˆ]ŠKŠJXœ™XZÈNÚYŠJYVÊ]
Î
OŒ—JJXœ™XZß\™]\›ˆVÝ
ÍŒ—_Y[˜Ý[ÛˆPJ
^Ý˜\ˆKLÜ™]\›ˆPORLMŸKLKÊ
_
]ÙVÝ
ÌÌŒ—WJJÌM_JJOOLI‰Š]VÐJÌM_JKPJÌMŸŸY[˜Ý[ÛˆJJ^Ý˜\ˆLOLÚYŠJ^Ù›ÜŠØO]
YVÝŒ—JI‰ŠXJÍ
JHOJŠJNÊNÜ™]\›ˆØNŒ\™]\›Š[Š
OŠJÝY[˜Ý[Ûˆ\ÊJ^Ý˜\ˆLOLÚYŠP–ÝŒWJY›ÜŠÎÊ^ÚYŠOXJÌ_
JOOJŠJ\™]\›ˆNÚYŠJP–ÊOJJÝŒWJJXœ™XZß\™]\›ˆY[˜Ý[Ûˆ›ÊJ^Ý˜\ˆLOLÐOŒLÌOÊOYVÝŒ—K]
Í
NŠOPKLÌŸ]
KYVÜŒ—KVÝŒ—OXOKVÝ
ÍŒ—O\_OŒÌ‹P_Y[˜Ý[Ûˆ›ÊJ^Ý˜\ˆLOLÜYVÝ
ÍŒ—KOŒLÌOØOYVÝŒ—NŠOPKLÌŸO\‹L
KVÝ
ÍŒ—O\KVÝŒ—O\Ì‹P_O_Y[˜Ý[ÛˆØJ
^Ý˜\ˆOLÝ]NÙNžÙ›ÜŠÎÊ^ÚYŠO]J
JXœ™XZÈNÚYŠJOYVÍMÌÍ—JJXœ™XZÎÜ]ÌWJ
_X]

KŠ
_\™]\›ˆ_Y[˜Ý[ÛˆJ
^Ü™]\›ˆŒLLÌLÌOÝVÌLMÍ
ÊŒÉŒÌ_VÌLMÍ
ÊŽ
_OJ_OŠÉ
IŒNŒNMŒŸY[˜Ý[ÛˆÚJK‹K‹Ë‹
^ÙVÝŒ—OPKVÝ
ÍŒ—O\‹VÝ
ÎŒ—OXKVÝ
ÌLŒ—OMMLÍI›Ÿ
ŒM‰ŒÌÍŽŒM‰ŒÌÍÊOMŸY[˜Ý[ÛˆœÊKŠ^Ü™]\›ˆÊ
OOJJOÌNˆ]ŠVÝ
ÍŒ—KVÐJÍŒ—JN™VÝ
ÍŒ—OOYVÐJÍŒ—_Y[˜Ý[ÛˆŠ
^Ý˜\ˆOLÊ
OLYJLL
JJOOKLÌI‰ŠOLJ
JKOŒMŽMMŒÌŒI‰ŠVÍMÎNOLPJ_Y[˜Ý[ÛˆÚJ
^Ý˜\ˆÝ]J
JÎVÝŒ—OLLMŒVÝŒ—OLLLÎVÝŒ—OLLMÙJLMLL‹JKŠ
_Y[˜Ý[ÛˆJ
^Ý˜\ˆKŽÜ™]\›ˆO[ÛÊ
K[ÛÊ
KÛÊ
OM‰ŒMÌLMŽ	LŽMI_ÛÊ
OY[˜Ý[ÛˆÊ
^Ý˜\ˆOLÜ™]\›ˆÊOLKNMÌŒMŒMMLŽOŒß
OQ\Š
JKJNŒY[˜Ý[ÛˆšJJ^Ý˜\ˆŽÜ™]\›ˆPOŒÌKJVÝ
ÍÍŒ—K[ÊKŠJ_Y[˜Ý[Ûˆ[Š
^Ý˜\ˆOLLÙ›ÜŠ]ÜJO\ŠJÍVÐOŒ—NÊNÜ™]\›ˆK]ŒŸY[˜Ý[ÛˆŠJ^Ü™]\›ˆÖÌOPKÖÝ
ÍOLÖÝ
ÌßOPOŒÖÝ
ÌŸOPOŒM‹ÖÝ
Ì_OPOŽY[˜Ý[Ûˆ˜JJ^Ý˜\ˆLÜ™]\›ŠLOŠLÌIJI
OŸ

]
I‹LO
LPIŒÌJJOY[˜Ý[Ûˆ›ÊJ^Ý˜\ˆLÜ™]\›Š
OOMÌÉ‰ŠLÌKVÐJÌMÌßJ_
QXJ
JKŸY[˜Ý[Ûˆ˜J
^ÙVÌÍŒLMHOJ
I‰ŠVÌÍŒLMWOLJ
KVÌÍŒLMO]VÌÍŒLMWOYVÌÍŒLMWJÌJ_Y[˜Ý[ÛˆZJ
^Ü™]\›ˆÙVÌÍŒJÝŠšJLÌŽŒVÌÌLJKVÌÌŒÌŒJ_Y[˜Ý[ÛˆJ
^Ý˜\ˆKŽÜ™]\›Š]JOQ]

JÌ_
JOÓ
‹JNŒY[˜Ý[Ûˆ›Š
^Ý˜\ˆÙVÌÌÌŽ×OL
YVÌÌÌŽ—JI‰ŠJ
KVÌÌÌŽ—OLVÌÌÌŽ—OL
_Y[˜Ý[ÛˆJKŠ^Ý˜\ˆNÒXORLMŸVØJÌLŒ—O\‹ÚJKŠKXJÌMŸY[˜Ý[ÛˆšJKŠ^ÝJVÜŠÍÍŒ—KZJKŠJ_Y[˜Ý[Ûˆ\ÊJ^Ü™]\›ˆOÝ
LŽ	
OŽ	LŽŒY[˜Ý[Ûˆ	Ê
^Ü™]\›ˆ]NŒLŒLLÚ\ÊLÎM‹
NŒ_Y[˜Ý[ÛˆÛŠ
^Ý˜\ˆOLÝ	‰Š
OYVÝ
ÍŽŒ—JI‰™JJKJ
J_Y[˜Ý[Ûˆ[Š
^Ü™]\›ˆJ
OLLÏÞ˜JÍÌL‹
NŒY[˜Ý[ÛˆÚJ
^Ü™]\›ˆJ]VÌOÌN–œŠ
Ì_ÊJ_Y[˜Ý[ÛˆÛŠ
^ÊJ
LYJ
JJHOLÏÝŒ
I‰ŠVÍMÎNO]
_Y[˜Ý[Ûˆ[ÊKŠ^Ü™]\›ˆL_L]Ì
ŸL
WJJ_Y[˜Ý[Ûˆ˜JJ^Ü™]\›ˆP›ÊJKVÌOOJMIJOÝŒY[˜Ý[ÛˆšJJ^Ü™]\›ˆÊKŒMÍÍÊKOUÙK	_Y[˜Ý[ÛˆšJ
^Ü™]\›ˆÌÌK[YJLW
_ŒÌŸY[˜Ý[Ûˆ\ŠKŠ^ÌÌ‰VÌ_ZJK‹
_Y[˜Ý[ÛˆJKŠ^ÙÖÊXJKŠJÜŸ
KL_OLY[˜Ý[Ûˆ›Ê
^Ü™]\›ˆÛÊNÍÍ‹NLÌŽ
_Y[˜Ý[ÛˆšJJ^Ð_LVÊL
JÎŒ—OP_Y[˜Ý[ÛˆÚJKŠ^Ü™]\›ˆŠK‹
_Y[˜Ý[ÛˆÛŠ
^Ü™]\›ˆVÊL
JÌLŒ—_Y[˜Ý[ÛˆšJ
^Ü™]\›ˆVÊL
JÌMŒ—_Y[˜Ý[Ûˆ[Š
^Ü™]\›ˆVÊL
JÌŒŒ—_Y[˜Ý[ÛˆZJ
^Ü™]\›ˆVÊL
JÎŒ—_Y[˜Ý[ÛˆJ
^Ü™]\›ˆVÊL
JÍŒ—_Y[˜Ý[ÛˆŠ
^Ü™]\›ˆVÊL
OŒ—_Y[˜Ý[ÛˆZJKŠ^Ü™]\›ˆÊKŠ_Y[˜Ý[ÛˆÛÊ
^ÊL
I‰™J
_Y[˜Ý[ÛˆXJJ^ÑÝ
]

JÝJ_Y[˜Ý[ÛˆÚJ
^Ü™]\›ˆ
L
_Y[˜Ý[ÛˆJ
^Ü™]\›ˆY[˜Ý[Ûˆ[Ê
^ÙJL
_Y[˜Ý[Ûˆ›Š
^ßXŠ]KL–‘Õ›VVœÙPŒÖYÐPPPPPPQQPPPPPPPPPVTPPPPPPPPPÐPPPPPPPPQÒPPPPPPPPPT]ÐPPPPPPPPšPPPPPPPPQTPPPPPPPPPVPPPPPPPPP‘PPPPPPPPQÕPPPPPPPPPT™ÐPPPPPPPP›PPPPPPPPPQXÐPPPPPPPPVÐPPPPPPPP’PPPPPPPPPQÙÐPPPPPPPPTÔPPPPPPPPPœPPPPPPPPQ[ÐPPPPPPPPXYÐPPPPPPPP“PPPPPPPPQÜÐPPPPPPPPUPPPPPPPPPœÐPPPPPPPPQLPPPPPPPPX”PPPPPPPPP“ÐPPPPPPPPQÍPPPPPPPPUÐPPPPPPPPPPPPPPPPQPPPPPPPPPXÐPPPPPPPPP”PPPPPPPPRPPPPPPPPPUYÐPPPPPPPPžPPPPPPPPPQ“PPPPPPPPPXÝÐPPPPPPPP•PPPPPPPPPRPPPPPPPPPU”PPPPPPPPPŒPPPPPPPPPQ–PPPPPPPPPYÐPPPPPPPP–PPPPPPPPRÐPPPPPPPPUÐPPPPPPPPPPPPPPPPPQšÐPPPPPPPPYTPPPPPPPPP˜PPPPPPPPPRÐPPPPPPPPVTPPPQQPPPPPPPPPTTPPPQÒPPPPÐPPPPPPPPQRPPPPšPPPT]ÐPPPPPPPP‘PPPVPPPQTPPPPPPPPPTPPPQÕPPPP‘PPPPPPPPQUPPPP›PPPPT™ÐPPPPPPPP‘ÐPPPVÐPPQXÐPPPPPPPPTÐPPQÙÐPPP’PPPPPPPPPQYÐPPPœPPPTÔPPPPPPPPP’PPPXYÐPPQ[ÐPPPPPPPPTÙÐPPQÜÐPPP“PPPPPPPPQ\ÐPPPœÐPPPUPPPPPPPPP“PPPPX”PPPQLPPPPPPPPUPPPQÍPPP“ÐPPPPPPPPQMPPPPPPUÐPPPPPPPP”PPPXÐPPPQPPPPPPPPPUPPPPRPPPP”PPPPPPPPQ‘PPPPžPPPPUYÐPPPPPPPP”ÐPPPXÝÐPPQ“PPPPPPPPPU]ÐPPRPPPP•PPPPPPPPPQ”PPPPŒPPPPU”PPPPPPPPP•PPPYÐPPQ–PPPPPPPPPU™ÐPPRÐPPP–PPPPPPPPQ˜ÐPPPPPPUÐPPPPPPPPP–PPPPYTPPPQšÐPPPPPPPPUÔPPPRÐPPP˜PPPPPPPPPQ›ÐPPPÌPPPP[SPPPPPPPPØÐ]ÐP]ÐPPPPPPPPQÐPPPPPPPPSQPPPPPPPPPMPPPPPPPPQÐPPPPPPPPSÒPPPPPPPPP]ÝÐPPPPPPPQPPPPPPPPSTPPPPPPPPPMPPPPPPPPPQPPPPPPPPSÕPPPPPPPPP^ÐPPPPPPPQPPPPPPPPPSXÐPPPPPPPPM]ÐPPPPPPPQPPPPPPPPPSÙÐPPPPPPPP^TPPPPPPPPQPPPPPPPPS[ÐPPPPPPPPM™ÐPPPPPPPQPPPPPPPPSÜÐPPPPPPPP^PPPPPPPPQÐPPPPPPPPSLPPPPPPPPMÔPPPPPPPPQÐPPPPPPPPSÍPPPPPPPP^ÐPPPPPPPQPPPPPPPPSPPPPPPPPPNPPPPPPPPQPPPPPPPPTPPPPPPPPPLÐPPPPPPPQPPPPPPPPPS“PPPPPPPPPNÐPPPPPPPQPPPPPPPPPTPPPPPPPPPLTPPPPPPPPQPPPPPPPPPS–PPPPPPPPPNYÐPPPPPPPQPPPPPPPPPTÐPPPPPPPPL”PPPPPPPPQPPPPPPPPPS›ÐPPPPPPPPJÙÐPPPPPPPQPPPPPPPPTÐPPPPPPPPLÐPPPPPPPPQPPPPPPPPSŒPPPPPPPPKÔPPPPPPPPQPPPPPPPPPTPPPPPPPPMPPPSPPPPPPPPPP]ÐPPPSÑPPPQPPPPPPPPSQPPPQPPPP]ÙÐPPPPPPPQÐPPPMÐPPSSPPPPPPPPP]ÝÐPPSÔPPPQPPPPPPPPPSTPPPQPPP^PPPPPPPPQPPPMYÐPPSVPPPPPPPPP^ÐPPSØÐPPQPPPPPPPPSXÐPPQÐPPP^PPPPPPPPPQPPPPM”PPPSZÐPPPPPPPP^TPPPSÛÐPPQÐPPPPPPPPS[ÐPPQPPP^]ÐPPPPPPPQPPPMÐPPPS]ÐPPPPPPPP^PPPSÌPPQPPPPPPPPSLPPQPPPP^™ÐPPPPPPPQÐPPPMÝÐPPSNPPPPPPPP^ÐPPTPPPQPPPPPPPPPSPPPQPPPLPPPPPPPPQPPPNÐPPS’PPPPPPPPPLÐPPTPPPQPPPPPPPPS“PPPQPPPLPPPPPPPPPQPPPPNTPPPS•PPPPPPPPPLTPPPTPPPQÐPPPPPPPPS–PPPQPPPLPPPPPPPPQPPPPJÔPPPSšÐPPPPPPPPL”PPPTÐPPQPPPPPPPPPS›ÐPPQÐPPPLÐPPPPPPPQPPPKÐPPPSÐPPPPPPPPLÐPPPTPPQPPPPPPPPSŒPPQ
ÐPPPLÙÐPPPPPPPQPPPPKÝÐPPRÐPPPPPPPYPQPPPPPPPPPPPPPTQPPPPPPPPPTPPPPQPPPPPPPPPPTPPPYÑPPPPPPPPQTPPPPPPPPSPPPPÐTPPPPPPPPRPPPQPTPPPPPPPPUPPPPPPPPP”QPPPTPPPPPPPPPQPPPVPPPPPPPPPÑPPPPPPPPRTPPP™ÑPPPPPPPPQÐTPPPÐQPPPPPPPPRTPPPPPPPPZÐPPRPTPPPPPPPPYÐPPRÐTPPPPPPPP\ÐPPPPPPPPÝÑPPP[ÐPPPPPPPPÙÑPPP]ÐPPPPPPPQQPPPPPPPPSTPPQQPPPPPPPPSPTPPQÑPPPPPPPPTTPPPPPPPPNPPSÐTPPPPPPPPMPPTPTPPPPPPPP‘PPPPPPPPQTQPPPPPPPPPPPQPQPPP’PPPPPPPPQ]ÑPPPPPPPPUTPPQYÑPPPPPPPPTÐTPPQQPPPPPPPPUTPPPPPPPP•PPPUPTPPPPPPPP”PPPUÐTPPPPPPPP˜ÐPPPPPPPQÑPPP–PPPPPPPPQ™ÑPPP™ÐPPPPPPPQÔQPPPPPPPPVTPPQÐQPPPPPPPPVPTPPQÙÑPPPPPPPPXTPPPPPPPPœÐPPXPTPPPPPPPP›ÐPPXÐTPPPPPPPPŒPPPPPPPRQPPPÐPPPPPPPRQPPPPPPPPPPRÑPPPPPPPPYTPPRÑPPPPPPPPYPTPPRPQPPPPPPPPZTPPPPPPPPÑPPPYÐTPPPPPPPPÐPPPZPTPPPPPPPPÓPPPPPPPPR]ÑPPPÒPPPPPPPPRYÑPPPÔPPPPPPPPR”QPPPPPPPP[TPPRQPPPPPPPPZÐTPPR™ÑPPPPPPPP[TPPPPPPPPØÐPP[PTPPPPPPPPÖPPP[ÐTPPPPPPPPÚÐPPPPPPPRÔQPPPÙÐPPPPPPPRÐQPPPÛÐPPPPPPPRÝÑPPPPPPPP\TPPRÙÑPPPPPPPP\PTPPSQPPPPPPPP]TPPPPPPPPÌPP\ÐTPPPPPPPPÝÐPP]PTPPPPPPPPÎPPPPPPPSÑPPPÍPPPPPPPSÑPPQPPPPPPPPXTPPPPPPPPP^TPPTÔPPPPPPPPP’PPPSYÑPPPPPPPP^TPPPPPPPQPPP^PTPPPPPPPQPPPLTPPPPPPPQPPPPPPPPS”QPPQPPPPPPPPSQPPQPPPPPPPPSÑPPPPPPPPLÐTPPS™ÑPPPPPPPPLTPPSÔQPPPPPPPPMTPPPPPPPQÐPPMPTPPPPPPPQÐPPMÐTPPPPPPPQÐPPPPPPPTQPPQÐPPPPPPPSÝÑPPQPPPPPPPTÑPPPPPPPPJÐTPPTQPPPPPPPPNPTPPTÑPPPPPPPPPTPPPPPPPQPPPPKÐTPPPPPPPQPPTPPPPPPPQRPPPPPPPPTYÑPPQQPPPPPPPPTTQPPQSPPPPPPPPTQPPPPPPPP‘PTPPT]ÑPPPPPPPP‘TPPT”QPPPPPPPP‘ÐTPPPPPPPQVPPP‘TPPPPPPPQUPPP’TPPPPPPPQYÐPPPPPPPTÐQPPQXÐPPPPPPPTÑPPQ[ÐPPPPPPPTÝÑPPPPPPPP“TPPTÙÑPPPPPPPP’ÐTPPUQPPPPPPPP“TPPPPPPPQLPP“PTPPPPPPPQ]ÐPP“ÐTPPPPPPPQNPPPPPPPUÑPPQMPPPPPPPUÑPPQPPPPPPPPUTQPPPPPPPP”TPPUPQPPPPPPPP”PTPPUYÑPPPPPPPP•TPPPPPPPQ“PPP”ÐTPPPPPPPQ’PPP•PTPPPPPPPQ•PPPPPPPPU”QPPQ”PPPPPPPPUQPPQ–PPPPPPPPUÑPPPPPPPP–TPPU™ÑPPPPPPPP•ÐTPPUÐQPPPPPPPP–TPPPPPPPQšÐPP–PTPPPPPPPQ™ÐPP˜PTPPPPPPPQœÐPPPPPPPUÝÑPPQ›ÐPPPPPPPUÙÑPPQÐPPPPPPPVQPPPPPPPP™TPPVQPPPPPPPP˜ÐTPPVÑPPPPPPPP™TPPPPPPPQŽPP™PTPPPPPPPQPP™ÐTPPPPPPPQÑPPPPPPPPVTQPPQÐPPPPPPPPVPQPPQÒPPPPPPPPV]ÑPPPPPPPPšTPPVYÑPPPPPPPPšPTPPVQPPPPPPPP›TPPPPPPPQÕPPPšÐTPPPPPPPQÔPPP›PTPPPPPPPQØÐPPPPPPPVÑPPQÖPPPPPPPPV™ÑPPQÙÐPPPPPPPXTQPPPPPPPPœTPPXPQPPPPPPPP›ÐTPPXYÑPPPPPPPPœTPPPPPPPQÜÐPPœPTPPPPPPPQÛÐPPœÐTPPPPPPPQÌPPPPPPPX”QPPQÝÐPPPPPPPXQPPQÍPPPPPPPXÑPPPPPPPPTPPX™ÑPPPPPPPPPTPPXÐQPPPPPPPPžTPPPPPPPRPPPÐTPPPPPPPRPPPžPTPPPPPPPRPPPPPPPPXÝÑPPRPPPPPPPPXÙÑPPRPPPPPPPPYQPPPPPPPPŒPTPPYQPPPPPPPPŒTPPYÑPPPPPPPPŒÐTPPPPPPPRÐPPŒTPPPPPPPRPPPTPPPPPPPTPPPPPPPPYTQPPPPPPPPTPPPPPPPRÐPPPTPPPPPPPRÐPPÐTPPPPPPPRÐPPPPPPPYQPPRÐPPPPPPPY]ÑPPRPPPPPPPY™ÑPPPPPPPPŠÐTPPY”QPPPPPPPPŽPTPPYÑPPQ“PPPPPPPPPU]ÐPPRPPPP‘YÐPPPPPPQSPÐPPÐTPPPPPPPQ“PÐPPPPPPPYÙÑPPPPPPPPÑTPPPPPPPRSPPPÐÐTPPPPPPPRRPPPÑPTPPPPPPPRUPPPPPPPPZQPPRTPPPPPPPPZQPPRVPPPPPPPPURPPPPPPPPÒTPPPPPPPRYÐPPPPPPPZPQPPRXÐPPPPPPPZÑPPRZÐPPPPPPPU™ÒPPPPPPPPÒÐTPPPPPPPQ˜ÐÐPPPPPPPZ]ÑPPPPPPPPÓPTPPPPPPPR]ÐPPÓTPPPPPPPR\ÐPPÓÐTPPPPPPPSŒPPPPPPPZÑPPPPPPPP–YÐPPPPPPRPPPPPPPPUÝÒPPPPPPPPÔTPPPPPPPR’PPPPPPPPZÙÑPPR‘PPPPPPPPZÔQPPR“PPPPPPPPVPRPPPPPPPPÕPTPPPPPPPQÓPÐPPPPPPP[QPPTPPPPPPPPNYÑPPR–PPPPPPPPXTRPPPPPPPPÖTPPPPPPPQÙÐÐPPPPPPP[PQPPPPPPPPÖTPPPPPPPRšÐPPÖPTPPPPPPPR™ÐPPØPTPPTRPPPPPPPPNPYÐP[QPPPPPPPPYÐPPPPPPRŒPPPPPPPXÙÒPPPPPPPPÙPTPPRPRPPPPPPPPYÐYÐP[ÑPPPPPPPPŒPYÐPPPPPPRÐPPPPPPPP[ÔQPPPPPPPPÚTPP[ÐQPPPPPPPPÙÐTPP[ÙÑPPPPPPPPÚTPPPPPPPRÓPPPÚPTPPPPPPPRÒPPPÚÐTPPPPPPPRÕPPPPPPPP\QPPRÔPPPPPPPP\QPPRÖPPPPPPPPYÐRPPPPPPPPÛTPPPPPPPRÙÐPPPPPPP\PQPPRØÐPPPPPPP\ÑPPRÚÐPPPPPPPYÝÒPPPPPPPPÜÐTPPPPPPPRÌPPPPPPP\”QPPRÝÐPPPPPPP\QPPRÍPPPPPPPZPRPPPPPPPPÝTPPPPPPPSPPPPPPPP\ÐQPPRÎPPPPPPP\ÑPPSPPPPPPPPZYÒPPPPPPPPÞPTPPPPPPPR\ÐÐPPPPPPP\ÝÑPPPPPPPPÌTPPPPPPPSPPPÞTPPPPPPPSPPPÌPTPPPPPPPSPPPPPPPP]ÑPPSPPPPPPPP]QPPSÐPPPPPPPZÙÒPPPPPPPPÍTPPPPPPPSÐPPPPPPP]TQPPSÐPPPPPPP]PQPPSÐPPPPPPP]”QPPPPPPPPÎPTPP]QPPPPPPPPÎTPP]ÑPPTÐPPPPPPPN]ÑPPSTPPPPPPPP^ÑPPSUPPQTPP^QPPSVPPQTPP^ÑPPSTPPPPPPPP^QPPSXÐPPPPPPP^TQPPSYÐPQPTPP^ÑPPSZÐPQPTPP^TQPPSXÐPPPPPPP^PQPPS[ÐPPPPPPP^QPPS\ÐPQTPP^YÑPPS]ÐPQTPP^QPPS[ÐPPPPPPP^]ÑPPSLPPPPPPP^™ÑPPPPPPPQÐTPP^”QPPPPPPPQTPP^ÑPPPPPPPQPTPPPPPPPSPPQTPPPPPPPSNPQTPPPPPPPS’PPPPPPPPLÑPPS‘PPPPPPPPLQPPS“PPPPPPPPLPQPPPPPPPQPTPPLÑPPPPPPPQTPPLTQPPPPPPPQÐTPPPPPPPS–PPQTPPPPPPPS•PPQTPPPPPPPS™ÐPPPPPPPLQPPS˜ÐPPPPPPPL]ÑPPSšÐPPPPPPPL™ÑPPPPPPPQPTPPL”QPPPPPPPQTPPLÑPPPPPPPQÐTPPPPPPPSÐPQTPPPPPPPSœÐPQTPPZ™ÑPPPPPPPPÓÐTPPLÙÑPPPPPPPQTPPPPPPPSŽPQPTPPPPPPPSPQÐTPPPPPPPSÑPPPPPPPPMQPPSÐPPPPPPPPMQPPSÒPPPPPPPPMÑPPPPPPPQTPPMÑPPPPPPPQPTPPMPQPPPPPPPQTPPPPPPPSÕPPQÐTPPPPPPPSÔPPQPTPPPPPPPSØÐPPPPPPPM]ÑPPSÖPPPPPPPPMYÑPPSÙÐPPPPPPPM”QPPPPPPPQTPPMQPPPPPPPQÐTPPM™ÑPPPPPPPQTPPPPPPPSÜÐPQPTPPPPPPPSÛÐPQÐTPPPPPPPSÌPPPPPPPMÔQPPSÝÐPPPPPPPMÐQPPSÍPPPPPPPMÝÑPPPPPPPQTPPMÙÑPPPPPPPQPTPPNQPPPPPPPQTPPNÑPPTPPQTPPNÑPPTPPQTPPNQPPPPPPPQPTPPNPQPPPPPPPQPTPPPPPPPTPPQTPPPPPPPTPPQTPPPPPPPR•PPPPPPPPN]ÑPPPPPPPPËÐTPPPPPPPTÐPPPPPPPJÔQPPPPPPPQPTPPJÐQPPPPPPPQTPPJÙÑPPPPPPPQÐTPPPPPPPTÐPQTPPPPPPPTÐPQTPPPPPPPTPPPPPPPKÔQPPTÐPPPPPPPKÐQPPTPPPPPPPKÝÑPPPPPPPQÐTPPKÙÑPPPPPPPQ
ÐTPPPPRPPPPPPPPPYÐPPPPPPPQPÐPPPPYÐPPPPPPPPPÐPPPÐYÐPPPPPPPSPÐPPPPPPPP]ÒPPPRPÐPPPPPPPPYÒPPPTPÐPPPPPPPP”RPPPPPPPPQYÐPPRPPPPPPPPQPYÐPP™ÒPPPPPPPPRYÐPPPPPPPXÐÐPPQÐYÐPPPPPPPVPÐPPRPYÐPPPPPPPZÐÐPPPPPPPPÔRPPPYÐÐPPPPPPPPÐRPPP[ÐÐPPPPPPPPÝÒPPPPPPPPSYÐPPÙÒPPPPPPPPRÐYÐPQRPPPPPPPPSYÐPPPPPPPLÐPPSPYÐPPPPPPP]ÐÐPPSÐYÐPPPPPPPNÐPPPPPPPQÒPPPMÐPPPPPPPQÒPPPPÐPPPPPPPQTRPPPPPPPPTYÐPQPRPPPPPPPPTPYÐPQYÒPPPPPPPPUYÐPPPPPPP“PÐPPTÐYÐPPPPPPP’PÐPPUPYÐPPPPPPP•PÐPPPPPPPQ”RPPP”PÐPPPPPPPQRPPP–PÐPPPPPPPQÒPPPPPPPPVYÐPQ™ÒPPPPPPPPUÐYÐPQÐRPPPPPPPPVYÐPPPPPPPšÐÐPPVPYÐPPPPPPP™ÐÐPPXPYÐPPPPPPPœÐÐPPPPPPPQÝÒPPP›ÐÐPPPPPPPQÙÒPPPÐÐPPPPPPPRRPPPPPPPPYYÐPRRPPPPPPPPXÐYÐPRÒPPPPPPPPYYÐPPPPPPPŽÐPPYPYÐPPPPPPPÐPPYÐYÐPPPPPPRPPPPPPPRYÒPPPPPPPPZYÐPPPPPPPÓPÐPPZPYÐPPPPPPPÒPÐPPZÐYÐPPPPPPPÕPÐPPPPPPPR”RPPPÔPÐPPPPPPPRRPPPÖPÐPPPPPPPRÒPPPPPPPP[YÐPR™ÒPPPPPPPP[PYÐPRÐRPPPPPPPP\YÐPPPPPPPÚÐÐPP[ÐYÐPPPPPPPÙÐÐPP\PYÐPPPPPPPÜÐÐPPPPPPPRÝÒPPPÛÐÐPPPPPPPRÙÒPPPÝÐÐPPPPPPPSRPPPPPPPP]YÐPSRPPPPPPPP\ÐYÐPSÒPPPPPPPP]YÐPPPPPPPÎÐPP]PYÐPPPPPPPÍÐPP]ÐYÐPPPPPPQPÐPPPPPPPSTRPPQPÐPPPPPPPSPRPPQPÐPPPPPPPS]ÒPPPPPPPP^YÐPSYÒPPPPPPPP^PYÐPSÙÒPPPPPPPP›PPPPPPPQÐÐPPPPPPPTRPPPPPPPPNYÐPSÝÒPPPPPPPPMÐYÐPTRPPPPPPPPØPTPPPPPPPQÐPPPPPPPVš]ÐPPPPPPPKÐYÐPYš]ÐPPPPPPPŠÓPPTPRPPRÐPPPPPPPYž]ÐPQQPÐPPPPPPPTYÒPPPPPPPPÐYÐPTTRPPPPPPPPYÐPT]ÒPPPPPPPPÐPTPPPPPPPQTPÐPPPPPPPZTRPPPPPPPP‘YÐPPPPPPR]ÐÐPPPPPPPT™ÒPPPPPPPP’YÐPPPPPPQXÐÐPP‘ÐYÐPPPPPPQVPÐPP’PYÐPPPPPPQZÐÐPPPPPPPTÔRPPQYÐÐPPPPPPPTÐRPPQ[ÐÐPPPPPPPTÝÒPPPPPPPP“YÐPTÙÒPPPPPPPP’ÐYÐPURPPPPPPPP“YÐPPPPPPQLÐPP“PYÐPPPPPPQ]ÐÐPP“ÐYÐPPPPPPQNÐPPPPPPPUÒPPQMÐPPPPPPPUÒPPQPÐPP“PPPPPPPQÎÐPP”YÐPX”ÝÐPPPPPPPPPUYÒPPR\ÐPPPPPPPXÐÝÐPQ“PÐPPÐTPPPPPPPRQPPP•PYÐPZÑPPPPPPPPÑÐTPPU™ÒPPRZÐPPPPPPPZTQPPQ˜ÐÐPPÒÐTPPPPPPPR[ÐPP–YÐPZÑPPPPPPPPÔTPPUÝÒPPRPPPPPPPPZÐQPPQÐÐPPÜœÐPPPPPPRÝ[PP™ÐYÐPZÝÑPPPPPPPPÕTPPVTRPPRÞ[PPPPPPP\’ØÐPQÓPÐPPÕPTPPPPPPPR”PPP›YÐPZ˜XÐPPPPPPPÓœÐPV™ÒPPRÜ[PPPPPPP\\XÐPQÙÐÐPPÖTPPPPPPPR˜ÐPPœYÐP[ÑPPPPPPPPÕÐTPPXYÒPPRÍ›PPPPPPP\œXÐPQÜÐÐPPšSPPPPPPPQÒ\ÐPPœÐYÐP\˜XÐPPPPPPPÝÐPXÒPPRÐPPPPPPP[QPPRPÐPPSPPPPPPPQÍÐPPžPYÐP[”QPPPPPPPPÙTPPYRPPRŽPPPPPPP[ÑPPRÐPPšÓPPPPPPPQÔ\ÐPPÐPYÐP\ÑPPPPPPPPÛPTPPYÝÒPPRÚÐPPPPPPP\TQPPRXÐÐPPÞÐPPPPPPSÛPPÒPYÐP\™ÑPPPPPPPPÝPTPPZTRPPQTPÐPPPPPPPTRPPR[ÐÐPPÞTPPPPPPPSPPPÓYÐP\ÙÑPPPPPPPPÞPTPPZRPPQUPÐPPPPPPPT”RPPR’PÐPPÌÐTPPPPPPPSÐPPÙYÐP\ÜXÐPPPPPPPÞ\ÐP[™ÒPPSÛPPPPPPP\ÒØÐPQUQPPÖ]ÐPPPPPPRšÑPPÐ]ÐPPPPPPRQPPPPPPPXÔSPPRQPPPPPPPXÐSPPRQPPPPPPPXÝÓPPPPPPPPž]ÐPXÙÓPPPPPPPPžP]ÐPYÓPPPPPPPPŒÐ]ÐPPPPPPRÑPPŒ]ÐPPPPPPRQPPÐ]ÐPKÔSPPPPPPPQP]ÐPYSPPTPPPPPPPKÙÓPPRPQÐ]ÐPPPPPPTPP‹Ð]ÐPPPPPPTQPPPPPPPZÓPPPPPPPPÜÐ]ÐPPPPPPRYÑPPPPPPP\”SPPPPPPPPÒ]ÐPPPPPPRÍPPPPPPPZYÓPPPPPPPPÝ]ÐPPPPPPR]ÑPPPPPPP^SPPPPPPPPÓÐ]ÐPPPPPPSLPPPPPPPZÓPPPPPPPQÐ]ÐPPPPPPR‘QPPPPPPP\ÔSPPPPPPPPÔÐ]ÐPPPPPPSQPPPPPPPZÝÓPPPPPPPPÞ]ÐPPPPPPR”QPPPPPPP]SPPPPPPPPÕ]ÐPPPPPPSQPPPPPPP[ÓPPPPPPPPÌ]ÐPPPPPPR˜ÑPPPPPPP]ÓPPPPPPPPÖP]ÐPPPPPPSÑPPPPPPP[TSPPPPPPPPÍP]ÐPPPPPPR›ÑPPPPPPP]YÓPPPPPPPPØ]ÐPPPPPPSÑPPPPPPP[SPPPPPPPPÎ]ÐPPPPPPRŒPPPPPPP]”SPPPPPPPPÙP]ÐPPPPPPSPPPPPPP[ÓPPPPPPPPËÐ]ÐPPPPPPRÐQPPPPPPP]ÐSPPPPPPPPÚ]ÐPPPPPPSQQPPPPPPP[ÝÓPPPPPPPQ]ÐPPPPPPRÔQPPPPPPP^SPPPPPPPPÛ]ÐPPPPPPSUQPPPPPPP\ÓPPPPPPPQÐ]ÐPPPPPPRØÑPPPPPPP^ÓPPPPPPPPÛÐ]ÐPPPPPPSYÑPPPPPPP\TSPPPPPPPQ]ÐPPPPPPRÛÑPPPPPPP^YÓPPPPPPPPÜ]ÐPPPPPPS\ÑPPPPPPP\SPPRVQPPPPPPPZÓPPRÌPPÒP]ÐPPPPPPRYÑPPÝP]ÐPZTSPPPPPPPPÒ]ÐP\ÓPPR[ÑPPPPPPPZYÓPPSQPPÔ]ÐPPPPPPR‘QPPÞP]ÐPZÙÓPPPPPPPPÔÐ]ÐP\ÝÓPPR“QPPPPPPPZÝÓPPSQPPÕP]ÐPPPPPPR”QPPÌP]ÐP[SPPPPPPPPÕ]ÐP]ÓPPR–QPPPPPPP[ÓPPSÑPPÖ]ÐPPPPPPR˜ÑPPÍ]ÐP[PSPPPPPPPPÖP]ÐP]TSPPRšÑPPPPPPP[TSPPSÑPPØP]ÐPPPPPPR›ÑPPÍÐ]ÐP[]ÓPPPPPPPPØ]ÐP]SPPRÑPPPPPPP[SPPSPPÙ]ÐPPPPPPRŒPPÊÐ]ÐP[™ÓPPPPPPPPÙP]ÐP]ÓPPRŽPPPPPPP[ÓPPSPQPPÙÐ]ÐPPPPPPRÐQPQ]ÐP[ÔSPPPPPPPPÚ]ÐP]ÙÓPPRÓQPPPPPPP[ÝÓPPSSQPPÚ]ÐPPPPPPRÓQPQP]ÐP\SPPPPPPPPÚÐ]ÐP^SPPRÕQPPPPPPP\SPPSVQPPÛP]ÐPPPPPPRÖQPQ]ÐP\ÓPPPPPPPPÛ]ÐP^PSPPRÙÑPPPPPPP\PSPPSZÑPPÜ]ÐPPPPPPRÚÑPQÐ]ÐP\YÓPPPPPPPPÜP]ÐP^]ÓPPRÜÑPPPPPPP\]ÓPPS]ÑPPÓP]ÐPPPPPPR]ÑPQ]ÐPZ™ÓPPPPPPPPÓÐ]ÐP^™ÓPPRNPPPPPPPZÓPPSNPPPPPPPL]ÓPPPPPPPQP]ÐPZÙÓPPPPPPPPÔÐ]ÐPLSPPR™ÑPPPPPPP[PSPPS•QPPÛP]ÐPPPPPPRÖQPQÐ]ÐP[ÐSPPPPPPPPÙÐ]ÐPL]ÓPPSNPPPPPPP^ÓPPS™ÑPPPPPPPL”SPPPPPPPQ]ÐPLSPPPPPPPQP]ÐPL™ÓPPPPPPPQ]ÐPPPPPPSœÑPQP]ÐPPPPPPS›ÑPQÐ]ÐPPPPPPSŒPPPPPPPLÔSPPSÑPPPPPPPLÐSPPSPPPPPPPLÝÓPPPPPPPQ]ÐPLÙÓPPPPPPPQP]ÐPMSPPPPPPPQ]ÐPPPPPPSÑQPQÐ]ÐPPPPPPSÐQPQP]ÐPPPPPPSÓQPPPPPPPMÓPPSÒQPPPPPPPMÓPPSÔQPPPPPPPMTSPPPPPPPQ]ÐPMPSPPPPPPPQÐ]ÐPMYÓPPPPPPPQ]ÐPPPPPPSØÑPQP]ÐPPPPPPSÖQPQÐ]ÐPPPPPPSÚÑPPPPPPPM”SPPSÙÑPPPPPPPMSPPSÛÑPPPPPPPMÓPPPPPPPQ]ÐPM™ÓPPPPPPPQP]ÐPMÐSPPPPPPPQ]ÐPPPPPPSÌPQÐ]ÐPPPPPPSÝÑPQP]ÐPPPPPPSÎPPPPPPPMÝÓPPSÍPPPPPPPMÙÓPPTQPPØP]ÐPPPPPPR›ÑPQ]ÐP[ÔSPPPPPPPPÚ]ÐPNÓPPTÑPPPPPPPJÔSPPTQPP‹Ð]ÐPPPPPPRPQ]ÐPPPPPPSÑPPPPPPPNTSPPR•QPPPPPPP[SPPTÑPPPPPPPJÐSPPPPPPPQ]ÐPN]ÓPPPPPPPQÐ]ÐPJÔSPPPPPPPQP]ÐPPPPPPTÑPPPPPPPJÝÓPPPPPPPQÐ]ÐPJÙÓPPPPPPPQ]ÐPKÔSPPPPPPPPÐ]ÐPPPPPPTPPPPPPPYSPPPPPPPQÐ]ÐPPPPPPRPPPPPPPPPTPPPPPPPP”PPPPPPPPPQQPPPPPPPPUTTPPPPPPPPPÐPPPPPPPQ’QPPPPPPPPP]ÔPPPPPPPP•PPPPPPPPTQPPPPPPPPUTPPPPPPPPQPPPPPPPQ•QPPPPPPPPP™ÔPPPPPPPP•ÐPPPPPPPPXÑPPPPPPPPUÔPPPPPPPPRPPPPPPPPQ™ÑPPPPPPPPPÔTPPPPPPPP–PPPPPPPP[ÑPPPPPPPPUÙÔPPPPPPPPSPPPPPPPQœÑPPPPPPPPQTPPPPPPPP˜ÐPPPPPPPPLPPPPPPPPVTPPPPPPPPSÐPPPPPPPQPPPPPPPPQÔPPPPPPPP™PPPPPPPPQPPPPPPPPSPTPPPPPPPPTPPPPPPPQQPPPPPPPPQYÔPPPPPPPP^PPPPPPPPP“QPPPPPPPPS]ÔPPPPPPPPUPPPPPPPPQQPPPPPPPPQ”TPPPPPPPPLPPPPPPPPP–QPPPPPPPPS™ÔPPPPPPPPVPPPPPPPQÑPPPPPPPPQÐTPPPPPPPPMPPPPPPPPšÑPPPPPPPPSÔTPPPPPPPPXPPPPPPPPQÑPPPPPPPPQÝÔPPPPPPPPMÐPPPPPPPPÑPPPPPPPPTTPPPPPPPPYPPPPPPPQPPPPPPPPRÔPPPPPPPPJÐPPPPPPPPŽPPPPPPPPTÔPPPPPPPPYÐPPPPPPPQPQPPPPPPPPRTTPPPPPPPPPPPPPPPPÒQPPPPPPPPTYÔPPPPPPPPZPPPPPPPQSQPPPPPPPPRTPPPPPPPP‘PPPPPPPPPÕQPPPPPPPPT”TPPPPPPPP[PPPPPPPPQVQPPPPPPPPRÔPPPPPPPP’PPPPPPPPÙÑPPPPPPPPTÐTPPPPPPPP\PPPPPPPQZÑPPPPPPPPRÙÔPPPPPPPP’ÐPPPPPPPPÜÑPPPPPPPPTÝÔPPPPPPPP\ÐPPPPPPPQ]ÑPPPPPPPPSTPPPPPPPP“PPPPPPPPÍPPPPPPPPUÔPPPPPPPP]PPPPPPPQNPPPPPPPPSPTPPPQPPPPPPPPQPTPPQQPPPTPPPPPPPP‘QPPP^PPPQYÔPPPPPPPPTÐPPS]ÔPPP“QPPPPPPPPQ]ÔPPQQPPPUPPPPPPPPP”QPPPLPPPQ”TPPPPPPPPUPPS™ÔPPP–QPPPPPPPPQ™ÔPPQÑPPPVPPPPPPPP˜ÑPPPMPPQÐTPPPPPPPPVPPPSÔTPPPšÑPPPPPPPPQÔTPPQÑPPPXPPPPPPPPP›ÑPPPMÐPPQÝÔPPPPPPPPXPPTTPPPÑPPPPPPPPRTPPQPPPYPPPPPPPPŒPPPJÐPPRÔPPPPPPPPYPPPTÔPPPŽPPPPPPPPRÔPPQPQPPPYÐPPPPPPPPÐQPPPPPRTTPPPPPPPPZPPTYÔPPPÒQPPPPPPPPRYÔPPQSQPPPZPPPPPPPPÓQPPP‘PPPRTPPPPPPPPZÐPPT”TPPPÕQPPPPPPPPR”TPPQVQPPP[PPPPPPPPPÖQPPP’PPRÔPPPPPPPP[PPTÐTPPPÙÑPPPPPPPPRÐTPPQZÑPPP\PPPPPPPPÚÑPPP’ÐPPRÙÔPPPPPPPP\PPPTÝÔPPPÜÑPPPPPPPPRÝÔPPQ]ÑPPP\ÐPPPPPPPPÝÑPPP“PPSTPPPPPPPP]PPUÔPPPÍPPPPPPPPSÔPPQNPPP]PPPPPPPPÎPPP”PPPPPTPPPPPPPPPPPPUTTPPPQQPPPPPPPPPTTPPQ’QPPPPÐPPPPPPPPRQPPP•PPP]ÔPPPPPPPPQPPUTPPPTQPPPPPPPPPTPPQ•QPPPQPPPPPPPPUQPPP•ÐPPP™ÔPPPPPPPPQÐPPUÔPPPXÑPPPPPPPPPÔPPQ™ÑPPPRPPPPPPPPPYÑPPP–PPPÔTPPPPPPPPRPPUÙÔPPP[ÑPPPPPPPPPÙÔPPQœÑPPPSPPPPPPPP\ÑPPP˜ÐPPQTPPPPPPPPSPPPVTPPPLPPPPPPPPQTPPQPPPSÐPPPPPPPPMPPP™PPQÔPPPPPPPPTPPVPTPPPPPPPPšPPPPPPPQÑQPPP™ÐPPPPPPPQÐQPPPšPPPPPPPPQÓQPPPPPPPPV]ÔPPQÒQPPPPPPPPVYÔPPQÔQPPPPPPPPV”TPPPPPPPP›PPVTPPPPPPPPšÐPPV™ÔPPPPPPPP›PPPPPPPQØÑPPP›PPPPPPPPQÖQPPP›ÐPPPPPPPQÚÑPPPPPPPPXTTPPQÙÑPPPPPPPPXPTPPQÛÑPPPPPPPPX]ÔPPPPPPPPœPPXYÔPPPPPPPPœPPPXTPPPPPPPPPPPPPPPQÌPPPœÐPPPPPPPQÝÑPPPPPPPPPPPQÎPPPPPPPPXÔPPQÍPPPPPPPPX™ÔPPRQPPPPPPPPXÔTPPPPPPPPžPPXÐTPPPPPPPPÐPPXÙÔPPPPPPPPžPPPPPPPRQPPPžPPPPPPPPRQPPPŒPPPPPPPRQPPPPPPPPYTPPRQPPPPPPPPYTPPRQPPPPPPPPYÔPPPPPPPPŒÐPPYÔPPPPPPPPŒPPYPTPPPPPPPPPPPPPPPPRÑPPPPPPPPPPRÑPPPPPPPPPPRÑPPPPPPPPY]ÔPPRÑPPPPPPPPYYÔPPRÑPPPPPPPPY”TPPPPPPPPŽPPPYTPPPPPPPPŽPPY™ÔPPPPPPPP‹ÐPPPPPPPRPPPŠÐPPPPPPPRPPPÐPPPPPPPPRQQPPPPPPPPYÔTPPRPQPPPPPPPPYÐTPPR[ÑPPPPPPPPZ]ÔPPPPPPPPÓPPZYÔPPPPPPPPÒÐPPZTPPPPPPPPÓPPPPPPPRLPPPÓPPPPPPPPR]ÑPPPÓÐPPPPPPPRNPPPPPPPPZÔPPRMPPPPPPPPZ™ÔPPRQPPPPPPPPZÔTPPPPPPPPÔPPZÐTPPPPPPPPÔPPPZÙÔPPPPPPPPÕPPPPPPPR“QPPPÔÐPPPPPPPR’QPPPÕPPPPPPPPR•QPPPPPPPP[TPPR”QPPPPPPPP[TPPR–QPPPPPPPP[ÔPPPPPPPPÖPP[ÔPPPPPPPPÕÐPP[PTPPPPPPPPÖPPPPPPPRšÑPPPÖPPPPPPPPR™ÑPPPØPPPPPPPPRœÑPPPPPPPP[]ÔPPR›ÑPPPPPPPP[YÔPPRÑPPPPPPPP[”TPPPPPPPPÙPP[TPPPPPPPPØÐPP[™ÔPPPPPPPPÙPPPPPPPRŽPPPÙPPPPPPPPRPPPÙÐPPPPPPPRÑQPPPPPPPP[ÔTPPRÐQPPPPPPPP[ÐTPPRÒQPPPPPPPP[ÝÔPPPPPPPPÚPP[ÙÔPPPPPPPPÚPPP\TPPPPPPPPÛPPPPPPPRÕQPPPÚÐPPPPPPPRÔQPPPÛPPPPPPPPRØÑPPPPPPPP\ÔPPRÖQPPPPPPPP\ÔPPRÙÑPPPPPPPP\TTPPPPPPPPÜPP\PTPPPPPPPPÛÐPP\YÔPPPPPPPPÜPPPPPPPRÜÑPPPÜPPPPPPPPRÛÑPPPÜÐPPPPPPPRÌPPPPPPPP\”TPPRÝÑPPPPPPPP\TPPRÍPPPPPPPP\ÔPPPPPPPPÝPP\™ÔPPPPPPPPÝPPP\ÐTPPPPPPPPÞPPPPPPPSQPPPÝÐPPPPPPPSQPPPÞPPPPPPPPSQPPPPPPPP\ÝÔPPSQPPPPPPPP\ÙÔPPSQPPPPPPPP]TPPPPPPPPÌPPP]TPPPPPPPPÌPP]ÔPPPPPPPPÌÐPPPPPPPSÑPPPÌPPPPPPPSQPPPÍPPPPPPPSÑPPPPPPPP]TTPPSÑPPPPPPPP]PTPPSÑPPPPPPPP]]ÔPPPPPPPPÍÐPP]YÔPPPPPPPPÍPP]TPPPPPPPPÎPPPPPPPPSPPPÎPPPPPPPSÑPPPÊÐPPPPPPPSPPPPPPPP]ÔPPSPPPPPPPP]™ÔPPSPQPPPPPPPP^ÔPPPPPPPQPPPPPPPSRQPPPPPPPP]ÙÔPPSQQPPPPPPPP]ÔTPPSSQPPPPPPPP^TPPPPPPPQPPP]ÝÔPPPPPPPQPP^TPPPPPPPQÐPPPPPPPSVQPPQPPPPPPPSUQPPQPPPPPPPSYÑPPPPPPPP^PTPPSXÑPPPPPPPP^ÔPPSZÑPPPPPPPP^YÔPPPPPPPQÐPP^TTPPPPPPPQPP^]ÔPPPPPPPQPPPPPPPPS]ÑPPQPPPPPPPS\ÑPPQPPPPPPPSMPPPPPPPP^™ÔPPSLPPPPPPPP^”TPPSNPPQPPPPPPPPSPQPPQPPPPPPPPS‘QPPPPPPPPLTPPSQPPPPPPPPLTPPS’QPPPPPPPPLÔPPPPPPPQPPLÔPPPPPPPQÐPPLPTPPPPPPPQPPPPPPPS•QPPQPPPPPPPPS”QPPQÐPPPPPPPS˜ÑPPPPPPPPL]ÔPPS–QPPPPPPPPLYÔPPS™ÑPPPPPPPPL”TPPPPPPPQPPLTPPPPPPPQPPPL™ÔPPPPPPPQPPPPPPPSœÑPPQPPPPPPPPS›ÑPPQÐPPPPPPPSŒPPPPPPPPLÔTPPSÑPPPPPPPPLÐTPPSPPPPPPPPLÝÔPPPPPPPQPPLÙÔPPPPPPPQPPPMTPPPPPPPQPPPPPPPSÑQPPQÐPPPPPPPSÐQPPQPPPPPPPPSÓQPPPPPPPPMÔPPSÒQPPPPPPPPMÔPPSÔQPPPPPPPPMTTPPPPPPPQPPMPTPPPPPPPQÐPPMYÔPPPPPPPQPPPPPPPSØÑPPQPPPPPPPPSÖQPPQÐPPPPPPPSÚÑPPPPPPPPM”TPPSÙÑPPPPPPPPMTPPSÛÑPPPPPPPPMÔPPPPPPPQPPM™ÔPPPPPPPQPPPMÐTPPPPPPPQPPPPPPPSÌPPQÐPPPPPPPSÝÑPPQPPPPPPPPSÎPPPPPPPPMÝÔPPSÍPPPPPPPPMÙÔPPTQPPPPPPPPNTPPPPPPPQPPNTPPPPPPPQÐPPNÔPPPPPPPQPPPPPPPTQPPQPPPPPPPPTQPPQPPPPPPPTQPPPPPPPPNTTPPTQPPPPPPPPNPTPPTQPPPPPPPPN]ÔPPPPPPPQÐPPNYÔPPPPPPPQPPJÐTPPPPPPPQPPPPPPPPTÑPPQPPPPPPPTÑPPQPPPPPPPTÑPPPPPPPPJÝÔPPTÑPPPPPPPPJÙÔPPTÑPPPPPPPPKÔTPPPPPPPQPPPKÐTPPPPPPPQPPKÙÔPPPPPPPQÐPPPPPPPTPPQ
ÐPPPPPPPTPPPPP”PPPPPPPPQQPPPPPPPPTUPPPPQPPPPPPPPPUPPPRQPPPPPPPP]ÕPPPPPPPPQ”PPPYÕPPPPPPPPPÐ”PPPUPPPPPPPPQ”PPPPPPPPUQPPQP”PPPPPPPPTQPPQÐ”PPPPPPPPXÑPPPPPPPPÕPPPVQPPPPPPPP™ÕPPPYÑPPPPPPPPÔUPPPPPPPPR”PPPÐUPPPPPPPPRP”PPPÙÕPPPPPPPPS”PPPPPPPP\ÑPPRÐ”PPPPPPPP[ÑPPSP”PPPPPPPPLPPPPPPPQUPPP]ÑPPPPPPPQUPPPMPPPPPPPQÕPPPPPPPPT”PPQÕPPPPPPPPSÐ”PPQPUPPPPPPPPT”PPPPPPPP‘QPPTP”PPPPPPPPQPPTÐ”PPPPPPPP“QPPPPPPPQ]ÕPPP’QPPPPPPPQYÕPPP”QPPPPPPPQ”UPPPPPPPPU”PPQUPPPPPPPPUP”PPQ™ÕPPPPPPPPV”PPPPPPPP˜ÑPPUÐ”PPPPPPPP–QPPVP”PPPPPPPPšÑPPPPPPPQÔUPPP™ÑPPPPPPPQÐUPPP›ÑPPPPPPPQÝÕPPPPPPPPX”PPQÙÕPPPPPPPPXP”PPRUPPPPPPPPY”PPPPPPPPŒPPXÐ”PPPPPPPPÑPPYP”PPPPPPPPŽPPPPPPPRÕPPPPPPPPPPRÕPPPÐQPPPPPPPRTUPPPPPPPPZ”PPRPUPPPPPPPPYÐ”PPRYÕPPPPPPPPZ”PPPPPPPPÓQPPZP”PPPPPPPPÒQPPZÐ”PPPPPPPPÕQPPPPPPPR”UPPPÔQPPPPPPPRUPPPÖQPPPPPPPRÕPPPPPPPP[”PPR™ÕPPPPPPPP[P”PPRÐUPPPPPPPP\”PPPPPPPPÚÑPP[Ð”PPPPPPPPÙÑPP\P”PPPPPPPPÜÑPPPPPPPRÝÕPPPÛÑPPPPPPPRÙÕPPPÝÑPPPPPPPSUPPPPPPPP]”PPSUPPPPPPPP\Ð”PPSÕPPPPPPPP]”PPPPPPPPÎPP]P”PPPPPPPPÍPP^”PPPPPPPQÑQPPPPPPPSYÕPPPPPPPPšP”PPPPPPPQQPPPPPPPV]ÕPPPPPPPPL”PPPPPPPQÔQPPPPPPPS”UPPPPPPPP›”PPPPPPPQQPPPPPPPV™ÕPPPPPPPPLÐ”PPPPPPPQØÑPPPPPPPSÐUPPPPPPPP›Ð”PPPPPPPQÑPPPPPPPXTUPPPPPPPPM”PPPPPPPQÛÑPPPPPPPSÝÕPPPPPPPPœ”PPPPPPPQÑPPPPPPPXUPPPPPPPPNP”PPPPPPPQÌPPPPPPPTÕPPPPPPPPP”PPPPPPPQPPPPPPPXÕPPPPPPPPP”PPPPPPPRQPPPPPPPTTUPPPPPPPPž”PPPPPPPQRQPPPPPPPXÙÕPPPPPPPP‘”PPPPPPPRQPPPPPPPTUPPPPPPPPŒ”PPPPPPPQUQPPPPPPPYUPPPPPPPP‘Ð”PPPPPPPRQPPPPPPPTÕPPPPPPPPŒÐ”PPPPPPPQYÑPPPPPPPYPUPPPPPPPP’”PPPPPPPRÑPPPPPPPTÙÕPPPPPPPP”PPPPPPPQ\ÑPPPPPPPY]ÕPPPPPPPP“P”PPPPPPPRÑPPPPPPPUUPPPPPPPPŽP”PPPPPPPQMPPPPPPPY™ÕPPPPPPPP””PPPPPPPRPPPPPPPUPUPPPPPPPPÐP”PPPPPPPQ‘QPPPPPPPYÔUPPPPPPPP”Ð”PPPPPPPRRQPPPPPPPU]ÕPPPPPPPPÑ”PPPPPPPQ”QPPPPPPPZUPPPPPPPP•”PPPPPPPRUQPPPPPPPU™ÕPPPPPPPPÑÐ”PPPPPPPQÑQPP^”PPPPPPPQQPPšP”PPSYÕPPPPPPPP^P”PPV]ÕPPQQPPPPPPPS]ÕPPQÔQPPL”PPPPPPPQQPP›”PPS”UPPPPPPPPLP”PPV™ÕPPQQPPPPPPPS™ÕPPQØÑPPLÐ”PPPPPPPQÑPP›Ð”PPSÐUPPPPPPPPM”PPXTUPPQÑPPPPPPPSÔUPPQÛÑPPM”PPPPPPPQÑPPœ”PPSÝÕPPPPPPPPMÐ”PPXUPPQÑPPPPPPPTUPPQÌPPNP”PPPPPPPQPPP”PPTÕPPPPPPPPJÐ”PPXÕPPQPPPPPPPTÕPPRQPPP”PPPPPPPQPQPPž”PPTTUPPPPPPPP”PPXÙÕPPQRQPPPPPPPTYÕPPRQPP‘”PPPPPPPQSQPPŒ”PPTUPPPPPPPP‘P”PPYUPPQUQPPPPPPPT”UPPRQPP‘Ð”PPPPPPPQVQPPŒÐ”PPTÕPPPPPPPP’”PPYPUPPQYÑPPPPPPPTÐUPPRÑPP’”PPPPPPPQZÑPP”PPTÙÕPPPPPPPP’Ð”PPY]ÕPPQ\ÑPPPPPPPTÝÕPPRÑPP“P”PPPPPPPQ]ÑPPŽP”PPUUPPPPPPPP“”PPY™ÕPPQMPPPPPPPUÕPPRPP””PPPPPPPQNPPÐP”PPUPUPPPPPPPP”P”PPYÔUPPQ‘QPPPPPPPUTUPPRRQPP”Ð”PPPPPPPQ’QPPÑ”PPU]ÕPPPPPPPP•”PPZUPPQ”QPPPPPPPUUPPRUQPP•”PPPPPPPQ•QPPÑÐ”PPU™ÕPPPPPPPP•Ð”PP[ÐPPPPPPPPPSPPPPPPPRÑTPPPPPPPPPTÌPPPPPPPÚQPPPPPPPPPR]PPPPPPP[ÞPPPPPPPPQPPPPPPPRÔTPPPPPPPPPÌPPPPPPPÛPPPPPPPPPU]PPPPPPP\PPPPPPPPQÓPPPPPPPRØÔPPPPPPPPPžLPPPPPPPÛÑPPPPPPPPPYÝPPPPPPP\TPPPPPPPPR“PPPPPPPRÛÔPPPPPPPPPÚLPPPPPPPÜ‘PPPPPPPPP\ÝPPPPPPP\PPPPPPPPSSPPPPPPPRÌPPPPPPPPQÌPPPPPPPÝQPPPPPPPPPMPPPPPPP\žPPPPPPPPTPPPPPPPSTPPPPPPPPQPÌPPPPPPPÞPPPPPPPPP‘]PPPPPPP\ÚPPPPPPPPTÓPPPPPPPSTPPPPPPPPQ^LPPPPPPPÌPPPPPPPPP”]PPPPPPP]PPPPPPPPU“PPPPPPPSTPPPPPPPPQšLPPPPPPPÌÑPPPPPPPPP˜ÝPPPPPPP]PPPPPPPPPVSPPPPPPPSÔPPPPPPPPQÔÌPPPPPPPÍ‘PPPPPPPPP›ÝPPPPPPP]^PPPPPPPPX“PPPPPPPSÔPPPPPPPPRÌPPPPPPPÎQPPPPPPPPPŒPPPPPPP]šPPPPPPPPYSPPPPPPPSPPPPPPPPRLPPPPPPQQPPPPPPPPPÐ]PPPPPPP]ÔPPPPPPPPZPPPPPPPSRTPPPPPPPPRZLPPPPPPQPPPPPPPPPÓ]PPPPPPP^PPPPPPPPZÓPPPPPPPSUTPPPPPPPPR”ÌPPPPPPQPPPPPPPPPØÝPPPPPPP^”PPPPPPPP]PPPPPPPSTPPPÔRPPPPPPPSTPPQ‘PPPZÔÐPPPPPPQ‘PPPLPPR’XÐPPPPPPPLPPS“TPPPÕPPPPPPPS“TPPQQPPP[ÐPPPPPPQQPPPLTPPR•XÐPPPPPPPLTPPS–TPPPÕÒPPPPPPPS–TPPQPPP[ÐPPPPPPQPPPLPPR™ØÐPPPPPPPLPPSšÔPPPÖ’PPPPPPPSšÔPPQQPPP[ZÐPPPPPPQQPPPLžPPRœØÐPPPPPPPLžPPSÔPPPØÒPPPPPPPSÔPPQPPP[”ÐPPPPPPQPPPLÚPPRÐPPPPPPPLÚPPSŽPPPÙ’PPPPPPPSŽPPQÑPPP[ÐÐPPPPPPQÑPPPMPPRÑXÐPPPPPPPMPPSÒTPPPÚRPPPPPPPSÒTPPQ‘PPP[ÞÐPPPPPPQ‘PPPMPPPRÔXÐPPPPPPPMPPPSÕTPPPÛPPPPPPPSÕTPPQQPPP\ÐPPPPPPQQPPPM^PPRØØÐPPPPPPPM^PPSÙÔPPPÛÒPPPPPPPSÙÔPPQPPP\TÐPPPPPPQPPPMšPPRÛØÐPPPPPPPMšPPSÜÔPPPÜ’PPPPPPPSÜÔPPQÑPPP\ÐPPPPPPQÑPPPMÔPPRÌÐPPPPPPPMÔPPSÍPPPÝRPPPPPPPSÍPPQ‘PPP\žÐPPPPPPQ‘PPPNPPSXÐPPPPPPPNPPTTPPPÞPPPPPPPTTPPQQPPP\ÚÐPPPPPPQQPPPNPPSXÐPPPPPPPNPPTTPPPÌPPPPPPPTTPPQQPPP]ÐPPPPPPQQPPPNZPPSXÐPPPPPPPNZPPTÔPPPÌÒPPPPPPPTÔPPQPPP]PÐPPPPPPQPPPJÔPPSØÐPPPPPPPJÔPPTÔPPPÍ’PPPPPPPTÔPPQQPPP]”ÐPPPPPPQQPPPKÚPPSÐPPPPPPPKÚPPTPPPËÒPPPPPPPTPPPÙÑ]ÐPPPPPPRÜPPPPPPP[Ô“PPPPPPPPž]ÐPPPPPPRÒUPPPPPPPXÜ\ÐPPPPPPPÚ‘]ÐPPPPPPRÜPPPPPPP\“PPPPPPPPŒ]ÐPPPPPPRÕUPPPPPPPY\ÐPPPPPPPÛQ]ÐPPPPPPR\PPPPPPP\PPPPPPPPŒÜ]ÐPPPPPPRÙÕPPPPPPPYRÜÐPPPPPPPÜ]ÐPPPPPPR\PPPPPPP\ZPPPPPPPPœ]ÐPPPPPPRÜÕPPPPPPPYMœÐPPPPPPPÜÑ]ÐPPPPPPR\PPPPPPP\”“PPPPPPPPŽ\]ÐPPPPPPRÍPPPPPPPYœ\ÐPPPPPPPÝ‘]ÐPPPPPPR
ÜPPPPPPP\Ð“PPPPPPPPÐ\]ÐPPPPPPSUPPPPPPPYØ\ÐPPPPPPPÞQ]ÐPPPPPPRRÜPPPPPPP\ÞPPPPPPPPÑ]ÐPPPPPPSUPPPPPPPZÜÐPPPPPPPÌQ]ÐPPPPPPRUÜPPPPPPP]PPPPPPPPÑÜ]ÐPPPPPPSÕPPPPPPPZœÐPPPPPPPÍ]ÐPPPPPPRZ\PPPPPPP]T“PPPPPPPPÒœ]ÐPPPPPPSÕPPPPPPPZ\\ÐPPPPPPPÍÑ]ÐPPPPPPR]\PPPPPPP]“PPPPPPPPÓ\]ÐPPPPPPSPPPPPPPZ˜\ÐPPPPPPPÊÑ]ÐPPPPPPRMœPPPPPPP]žPPPPPPPPÔ]ÐPPPPPPSPUPPPPPPPZÒÜÐPPPPPPQ‘]ÐPPPPPPR‘ÜPPPPPPP]ÚPPPPPPPPÔÜ]ÐPPPPPPSSUPPPPPPPZÍœÐPPPPPPQQ]ÐPPPPPPR”ÜPPPPPPP^“PPPPPPPPÕœ]ÐPPPPPPSVUPPPPPPP[\ÐPPPPPPQ]ÐPPPPPPR™\PPPPPPP^P“PPPPPPPPÖ\]ÐPPPPPPSZÕPPPPPPP[X\ÐPPPPPPQÑ]ÐPPPPPPRœ\PPPPPPP^^PPPPPPPPØœ]ÐPPPPPPS]ÕPPPPPPP[’ÜÐPPPPPPQ‘]ÐPPPPPPRŒœPPPPPPP^šPPPPPPPPÙ\]ÐPPPPPPSNPPPPPPP[œÐPPPPPPQQ]ÐPPPPPPRÐÜPPPPPPPL“PPPPPPPPÚ]ÐPPPPPPS’UPPPPPPP[Ü\ÐPPPPPPQ]ÐPPPPPPRÓÜPPPPPPPLP“PPPPPPPPÚÜ]ÐPPPPPPS•UPPPPPPP\\ÐPPPPPPQÑ]ÐPPPPPPRØ\PPPPPPPL^PPPPPPPPÛœ]ÐPPPPPPS™ÕPPPPPPP\RÜÐPPPPPPQ‘]ÐPPPPPPRÛ\PPPPPPPLšPPPPPPPPÜ\]ÐPPPPPPSœÕPPPPPPP\MœÐPPPPPPQÑ]ÐPPPPPPRÞ\PPPPPPPLÔ“PPPPPPPPÝ]ÐPPPPPPSPPPPPPP\œ\ÐPPPPPPQ‘]ÐPPPPPPRÊÜPPPPPPPM“PPPPPPPPÝÜ]ÐPPPPPPSÑUPPPPPPP\Ø\ÐPPPPPPQQ]ÐPPPPPPSÜPPPPPPPMPPPPPPPPÞœ]ÐPPPPPPSÔUPPPPPPP]ÜÐPPPPPPQ]ÐPPPPPPSÜPPPPPPPMZPPPPPPPPÌœ]ÐPPPPPPSØÕPPPPPPP]œÐPPPPPPQÑ]ÐPPPPPPS\PPPPPPPM”“PPPPPPPPÍ\]ÐPPPPPPSÛÕPPPPPPP]\\ÐPPPPPPQ‘]ÐPPPPPPS\PPPPPPPMÐ“PPPPPPPPÎ]ÐPPPPPPSÌPPPPPPP]˜\ÐPPPPPPQQ]ÐPPPPPPSœPPPPPPPMÞPPPPPPPPËÜ]ÐPPPPPPTUPPPPPPPJÐ“PPPPPPPQ]ÐPPPPPPTÕPPPPPPPNPPPPPPPQ‘]ÐPPPPPPTUPPPPPPPJÞPPPPPPPQ]ÐPPPPPPTÕPPPPPPPNT“PPPPPPPQQ]ÐPPPPPPTÕPQÑ]ÐPPPPPPTUPQQ]ÐPN“PPPPPPPQ]ÐPJÚPPTUPPPPPPPNPPTÕPQ‘]ÐPPPPPPTUPQ]ÐPNP“PPPPPPPQ]ÐPKÔ“PPTUPPPPPPPNT“PPRPXÐPPTÐPPPPPPPP’QPPPÐ’PPQTPPPPPPPPUPPPYÚÐPPPPPPPPPPRÔPPRSXÐPPZPPPPPPPPÑQPPPÑRPPRYÔPPPPPPPPZPPPZÐPPÒQPPPPPPPPRYÔPPRVXÐPP\PPPPPPPPPÛÑPPPÒPPVYÔPPPPPPPPšPPPZPÐPQ\[PPPPPPPPTÜVPPRXÐPPPPPPPLPPPPPPPPÔ’PPPPPPPS‘TPPPPPPPPZÚÐPPPPPPQÑPPPPPPPPR“XÐPPPPPPPLPPPPPPPPÕRPPPPPPPS”TPPPPPPPP[ÐPPPPPPQ‘PPPPPPPPR–XÐPPPPPPPLZPPPPPPPPÖPPPPPPPS˜ÔPPPPPPPP[PÐPPPPPPQQPPPPPPPPRšØÐPPPPPPPL”PPPPPPPPØRPPPPPPPS›ÔPPPPPPPP[^ÐPPPPPPQ‘PPPPPPPPRØÐPPPPPPPLÐPPPPPPPPÙPPPPPPPSŒPPPPPPPP[šÐPPPPPPQQPPPPPPPPRŽÐPPPPPPPLÞPPPPPPPPÙÒPPPPPPPSÐTPPPPPPPP[ÔÐPPPPPPQPPPPPPPPRÒXÐPPPPPPPMPPPPPPPPÚ’PPPPPPPSÓTPPPPPPPP\ÐPPPPPPQÑPPPPPPPPRÕXÐPPPPPPPMTPPPPPPPPÛRPPPPPPPSÖTPPPPPPPP\ÐPPPPPPQ‘PPPPPPPPRÙØÐPPPPPPPMPPPPPPPPÜPPPPPPPSÚÔPPPPPPPP\ZÐPPPPPPQQPPPPPPPPRÜØÐPPPPPPPMžPPPPPPPPÜÒPPPPPPPSÝÔPPPPPPPP\”ÐPPPPPPQPPPPPPPPRÍÐPPPPPPPMÚPPPPPPPPÝ’PPPPPPPSÎPPPPPPPP\ÐÐPPPPPPQÑPPPPPPPPSXÐPPPPPPPNPPPPPPPPÞRPPPPPPPTTPPPPPPPP\ÞÐPPPPPPQ‘PPPPPPPPSXÐPPPPPPPNPPPPPPPPPÌRPPPPPPPTTPPPPPPPP]ÐPPPPPPQ‘PPPPPPPPSØÐPPPPPPPN^PPPPPPPPÍPPPPPPPTÔPPPPPPPP]TÐPPPPPPQQPPPPPPPPSØÐPPPPPPPJÚPPPPPPPPÎRPPPPPPPTPPPPPPPP]šÐPPPPPPQ
ÑPPPPPPPPSÐPPPPPPPKÞPPPPPPPPRPPY˜XÐPPPPPPPŽ\ÐPY”ŒPQÓ\ÐPPPPPPPV^]ÐPPPYPPPPPPPPPTPPPPPPPP’ÐPPPPPPPPPPPRÐPPZPPPPPPPQÐPPPPPPPSYPPPPÒÐPPPPPPPRYPPPQRÐPPPPPPPUYPPPPPPPPP”PPTYPPPPPPPPPPPVYPPPPPPPPPžPPPPPPPRÐPPšPPPPPPPQÒÐPPÐPPPPPPPR’ÐPPPPPPPZÙPPPRRÐPPPPPPPYÙPPPRÒÐPPPPPPP\ÙPPPPPPPPPÞPP[ÙPPPPPPPPPÚPP]ÙPPPPPPPPQPPPPPPPS’ÐPQPPPPPPPSRÐPQPPPPPPPTÐPPPPPPPNPPPSÒÐPPPPPPPMPPPTRÐPPPPPPP‘YPPPPPPPPQTPPYPPPPPPPPQPPP’YPPPPPPPPQ^PPPPPPPUÐPQZPPPPPPPTÒÐPQPPPPPPPU’ÐPPPPPPP•YPPPURÐPPPPPPP”YPPPUÒÐPPPPPPP˜ÙPPPPPPPPQžPP–YPPPPPPPPQšPP™ÙPPPPPPPPQÔPPPPPPPV’ÐPQÐPPPPPPPVRÐPQÚPPPPPPPX’ÐPPPPPPPœÙPPPXRÐPPPPPPP›ÙPPPXÒÐPPPPPPPŒPPPPPPPPRPPÙPPPPPPPPRPPPPPPPPPPRPPPPPPPY’ÐPRPPPPPPPYRÐPRPPPPPPPPZÐPPPPPPPÑYPPPYÒÐPPPPPPPÐYPPPZRÐPPPPPPPÓYPPPPPPPPR^PPÒYPPPPPPPPRZPPÔYPPPPPPPPR”PPPPPPP[ÐPRPPPPPPPZÒÐPRšPPPPPPP[’ÐPPPPPPPØÙPPP[RÐPPPPPPPÖYPPP[ÒÐPPPPPPPÚÙPPPPPPPPRÔPPÙÙPPPPPPPPRÐPPÛÙPPPPPPPPRÞPPPPPPP\’ÐPRÚPPPPPPP\RÐPSPPPPPPP]ÐPPPPPPPÌPPP\ÒÐPPPPPPPÝÙPPP]RÐPPPPPPPÎPPPPPPPPSPPÍPPPPPPPPSPQYPPPPPPPPSTPPPPPPP^ÐPSPPPPPPPP]ÒÐPSZPPPPPPP^’ÐPPPPPPQYPPP^RÐPPPPPPQYPPPLÐPPPPPPQYPPPPPPPPS”PQYPPPPPPPPSPQYPPPPPPPPSžPPPPPPPLÒÐPSšPPPPPPPL’ÐPSÐPPPPPPPMRÐPPPPPPQÙPPPMÐPPPPPPQÙPPPM’ÐPPPPPPQÙPPPPPPPPSÞPQÙPPPPPPPPSÚPQÙPPPPPPPPTPPPPPPPNRÐPTPPPPPPPNÐPTPPPPPPPKÒÐPPPPPPQPPPJÒÐPPPPPPQPPPRÐPPPPPPQQYPPPPPPPPTTPQPYPPPPPPPPTPPQRYPPPPPPPPT^PPPPPPP‘ÐPTZPPPPPPPÒÐPTPPPPPPP‘’ÐPPPPPPQUYPPP‘RÐPPPPPPQTYPPP‘ÒÐPPPPPPQXÙPPPPPPPPTžPQVYPPPPPPPPTšPQYÙPPPPPPPPTÔPPPPPPP’’ÐPTÐPPPPPPP’RÐPTÚPPPPPPP“ÐPPPPPPQ\ÙPPP’ÒÐPPPPPPQ[ÙPPP“RÐPPPPPPQLPPPPPPPPUPQ]ÙPPPPPPPPUPQMPPPPPPPPUPPPPPPP”ÐPUPPPPPPP“ÒÐPUPPPPPPPP”’ÐPPPPPPQ‘YPPP”RÐPPPPPPQYPPP”ÒÐPPPPPPQ“YPPPPPPPPU^PQ’YPPPPPPPPUZPQ”YPPPPPPPPU”PPPPPPP•’ÐPUPPPPPPP•RÐPUšPPPPPPP–ÐPPPPPPQ˜ÙPPP•ÒÐPPPPPPQ–YPPP–RÐPPPPPPQšÙPPPPPPPPUÔPQ™ÙPPPPPPPPUÐPQ›ÙPPPPPPPPUÞPPPPPPP˜’ÐPUÚPPPPPPP˜RÐPVPPPPPPP™ÐPPPPPPQŒPPP˜ÒÐPPPPPPQÙPPP™RÐPPPPPPQŽPPPPPPPPVPQPPPPPPPPVPQÐYPPPPPPPPVTPPPPPPPšÐPVPPPPPPPP™ÒÐPVZPPPPPPPš’ÐPPPPPPQÓYPPPšRÐPPPPPPQÒYPPPšÒÐPPPPPPQÕYPPPPPPPPV”PQÔYPPPPPPPPVPQÖYPPPPPPPPVžPPPPPPP›’ÐPVšPPPPPPP›RÐPXPPPPPPPPœÐPPPPPPQÚÙPPP›ÒÐPPPPPPQÙÙPPPœRÐPPPPPPQÜÙPPPPPPPPX^PQÛÙPPPPPPPPXZPQÝÙPPPPPPPPX”PPPPPPPÐPXPPPPPPPœÒÐPXšPPPPPPP’ÐPPPPPPQÎPPPRÐPPPPPPQÍPPPÒÐPPPPPPRYPPPPPPPPXÔPRYPPPPPPPPXÐPRYPPPPPPPPXÞPPPPPPPž’ÐPXÚPPPPPPPžRÐPYPPPPPPPŒRÐPPPPPPRYPPPŒÐPPPPPPRYPPPŒ’ÐPPPPPPRÙPPPPPPPPYPRYPPPPPPPPYPRÙPPPPPPPPYTPPPPPPPRÐPYPPPPPPPPÐPYZPPPPPPPÒÐPPPPPPRÙPPP’ÐPPPPPPRÙPPPŽÐPPPPPPRPPPPPPPPY”PRÙPPPPPPPPYPRPPPPPPPPYžPPPPPPP‹ÒÐPYšPPPPPPPŠÒÐPYÐPPPPPPPÐ’ÐPPPPPPRQYPPPÐRÐPPPPPPRPYPPPÐÒÐPPPPPPRSYPPPPPPPPYÞPRRYPPPPPPPPYÚPRTYPPPPPPPPZPPPPPPPÑ’ÐPZPPPPPPPÑRÐPZPPPPPPPÒÐPPPPPPRXÙPPPÑÒÐPPPPPPRVYPPPÒRÐPPPPPPRZÙPPPPPPPPZTPRYÙPPPPPPPPZPPR[ÙPPPPPPPPZ^PPPPPPPÓÐPZZPPPPPPPÒÒÐPZPPPPPPPÓ’ÐPPPPPPRLPPPÓRÐPPPPPPR]ÙPPPÓÒÐPPPPPPRNPPPPPPPPZžPRMPPPPPPPPZšPRYPPPPPPPPZÔPPPPPPPÔ’ÐPZÐPPPPPPPÔRÐPZÚPPPPPPPÕÐPPPPPPR“YPPPÔÒÐPPPPPPR’YPPPÕRÐPPPPPPR•YPPPPPPPP[PR”YPPPPPPPP[PRœÙPPP™ÒÐPPPPPPQÐYPPPÙRÐPPPPPPSŽPPPPPPPP[ÐPPPPPPPÚÐPPPPPPRÑYPPPÙÒÐPPPPPPRÐYPPPÚRÐPPPPPPRÓYPPPPPPPP[ÞPRÒYPPPPPPPP[ÚPRÔYPPPPPPPP\PPPPPPPÛÐP\PPPPPPPÚÒÐP\PPPPPPPÛ’ÐPPPPPPRØÙPPPÛRÐPPPPPPRÖYPPPÛÒÐPPPPPPRÚÙPPPPPPPP\TPRÙÙPPPPPPPP\PPRÛÙPPPPPPPP\^PPPPPPPÜ’ÐP\ZPPPPPPPÜRÐP\PPPPPPPÝÐPPPPPPRÌPPPÜÒÐPPPPPPRÝÙPPPÝRÐPPPPPPRÎPPPPPPPP\žPRÍPPPPPPPP\šPSYPPPPPPPP\ÔPPPPPPPÞÐP\ÐPPPPPPPÝÒÐP\ÚPPPPPPPÞ’ÐPPPPPPSYPPPÞRÐPPPPPPSYPPPÌÐPPPPPPSYPPPPPPPP]PSYPPPPPPPP]PSYPPPPPPPP]PPPPPPPÌÒÐP]PPPPPPPÌ’ÐP]PPPPPPPPÍRÐPPPPPPSÙPPPÍÐPPPPPPSÙPPPÍ’ÐPPPPPPSÙPPPPPPPP]^PSÙPPPPPPPP]ZPSÙPPPPPPPP]”PPPPPPPÎRÐP]PPPPPPPÎÐP]šPPPPPPPËÒÐPPPPPPSPPPÊÒÐPPPPPPSPPQRÐPPPPPPSQYPPPPPPPP]ÔPSPYPPPPPPPP]ÐPSRYPPPPPPPP]ÞPPPPPPQÐP]ÚPPPPPPQÒÐP^PPPPPPQ’ÐPPPPPPSUYPPQRÐPPPPPPSTYPPQÒÐPPPPPPSXÙPPPPPPPP^PSVYPPPPPPPP^PSYÙPPPPPPPP^TPPPPPPQ’ÐP^PPPPPPPQRÐP^ZPPPPPPQÐPPPPPPS\ÙPPQÒÐPPPPPPS[ÙPPQRÐPPPPPPSLPPPPPPPP^”PS]ÙPPPPPPPP^PSMPPPPPPPP^žPPPPPPQÐP^šPPPPPPQÒÐPLPPPPPPQ’ÐPPPPPPS‘YPPQRÐPPPPPPSYPPQÒÐPPPPPPS“YPPPPPPPPLPS’YPPPPPPPPLPS”YPPPPPPPPLTPPPPPPQ’ÐPLPPPPPPPQRÐPLZPPPPPPQÐPPPPPPS˜ÙPPQÒÐPPPPPPS–YPPQRÐPPPPPPSšÙPPPPPPPPL”PS™ÙPPPPPPPPLPS›ÙPPPPPPPPLžPPPPPPQ’ÐPLšPPPPPPQRÐPLÐPPPPPPQÐPPPPPPSŒPPQÒÐPPPPPPSÙPPQRÐPPPPPPSŽPPPPPPPPLÞPSPPPPPPPPLÚPSÐYPPPPPPPPMPPPPPPQÐPMPPPPPPQÒÐPMPPPPPPQ’ÐPPPPPPSÓYPPQRÐPPPPPPSÒYPPQÒÐPPPPPPSÕYPPPPPPPPMTPSÔYPPPPPPPPMPPSÖYPPPPPPPPM^PPPPPPQ’ÐPMZPPPPPPQRÐPMPPPPPPQÐPPPPPPSÚÙPPQÒÐPPPPPPSÙÙPPQRÐPPPPPPSÜÙPPPPPPPPMžPSÛÙPPPPPPPPMšPSÝÙPPPPPPPPMÔPPPPPPQÐPMÐPPPPPPQÒÐPMÚPPPPPPQ’ÐPPPPPPSÎPPQRÐPPPPPPSÍPPQÒÐPPPPPPTYPPPPPPPPNPTYPPPPPPPPNPTYPPPPPPPPNPPPPPPQ’ÐPNPPPPPPQRÐPNPPPPPPPQRÐPPPPPPTYPPQÐPPPPPPTYPPQ’ÐPPPPPPTÙPPPPPPPPN^PTYPPPPPPPPNZPTÙPPPPPPPPJÔPPPPPPQRÐPJÐPPPPPPQÐPJÚPPPPPPQÒÐPPPPPPTÙPPQ’ÐPPPPPPTÙPPQÐPPPPPPTPPPPPPPPKÔPTÙPPPPPPPPKÐPTPPPPPPPPKÞPPPPPPQÒÐPKÚPPPPPPQ
ÒÐPPPŽPPYÙPPPPPPPPÐŽPPQYPPR’ÐPPPPPPPZÙPPPÒÐPPÚPPPPPPPRÒÐPP^PP\ÙPPPPPPPPÞPPTYPPSRÐPPPPPPP]ÙPPQ’ÐPQŽPPPPPPPS’ÐPPšPPMPPPPPPPQPPXÙPPTÐPPPPPPPNPPRRÐPPPPPPPPYPPPPPPPPÔŽPPPPPPPP’ÐPPPPPPP[ÙPPPPPPPPZPPPPPPPSÐPPPPPPPSYPPPPPPPQŽPPPPPPPQRÐPPPPPPPLPPPPPPPP”ŽPPPPPPPSÒÐPPPPPPPVYPPPPPPPQPPPPPPPRÐPPPPPPPYPPVRÐPPPPPPP™ÙPPT’ÐPQÔŽPPPPPPPV’ÐPQZPP›ÙPPPPPPPQÚPP“YPPX’ÐPPPPPPPœÙPPURÐPRŽPPPPPPPXÒÐPQ”ŽPPŒPPPPPPPRŽPP™ÙPPPPPPPQPŽPPPPPPPV’ÐPPPPPPP‘YPPPPPPPQÚPPPPPPPTÒÐPPPPPPPœÙPPPPPPPQ^PPPPPPPXÒÐPPPPPPP”YPPPPPPPRŽPPPPPPPU’ÐPPPPPPPÐYPP[ÒÐPPPPPPPÙÙPPZÐPRÔŽPPPPPPP\ÐPRZPPÛÙPPPPPPPRÚPPÓYPP\’ÐPPPPPPPÜÙPPZÒÐPSŽPPPPPPP\ÒÐPR”ŽPPÌPPPPPPPSŽPPÖYPP]RÐPPPPPPPÍPP[’ÐPSPPPPPPP]’ÐPRÐŽPPPPPPPYÒÐPPPPPPPÚÙPPPPPPPRTŽPPPPPPP\RÐPPPPPPPÒYPPPPPPPRÞPPPPPPPZ’ÐPPPPPPPÝÙPPPPPPPRŽPPPPPPP]ÐPPPPPPPÕYPPPPPPPSPPPPPPP[RÐPPPPPPPÎPPPPPPPRžPPPPPPP]ÒÐPSÐŽPPPPPPPMÐPSTŽPQÙPPPPPPPSÔŽPQYPPM’ÐPPPPPPQÙPP^’ÐPSÞPPPPPPPMÒÐPSŽPQÙPPPPPPPTŽPQYPPNRÐPPPPPPQPPL’ÐPTPPPPPPPJÒÐPSžPQPPPPPPPTPQÙPPPPPPPSPŽPPPPPPPMRÐPPPPPPQYPPPPPPPSÚPPPPPPP^RÐPPPPPPQÙPPPPPPPS^PPPPPPPNÐPPPPPPQYPPPPPPPTŽPPPPPPPLRÐPPPPPPQPPPPPPPSšPPPPPPPKÒÐPPPPPPQÙPPPPPPPTPŽPQYÙPPPPPPPTÐŽPQQYPP’’ÐPPPPPPQZÙPPÒÐPTÚPPPPPPP’ÒÐPT^PQ\ÙPPPPPPPTÞPQTYPP“RÐPPPPPPQ]ÙPP‘’ÐPUŽPPPPPPP“’ÐPTÐŽPPPPPPPRÐPPPPPPQZÙPPPPPPPTTŽPPPPPPP’ÒÐPPPPPPQRYPPPPPPPTÞPPPPPPP‘ÐPPPPPPQ]ÙPPPPPPPTŽPPPPPPP“’ÐPPPPPPQUYPPPPPPPUTŽPQšÙPPPPPPPUÔŽPQ“YPP˜’ÐPPPPPPQœÙPP•’ÐPVŽPPPPPPP™ÐPUžPQŽPPPPPPPVPQšÙPPPPPPPUTŽPPPPPPP˜’ÐPPPPPPQ“YPPPPPPPVŽPPPPPPP•’ÐPPPPPPQŽPPPPPPPUžPPPPPPP™ÒÐPXPŽPPPPPPP›ÒÐPVTŽPQÚÙPPPPPPPXTŽPQÒYPPœRÐPPPPPPQÛÙPPš’ÐPX^PPPPPPPœ’ÐPVŽPQÝÙPPPPPPPXŽPQÕYPPÐPPPPPPQÌPP›RÐPXšPPPPPPPRÐPVžPQÎPPPPPPPXžPQÙÙPPPPPPPVPŽPPPPPPPœÐPPPPPPQÑYPPPPPPPXZPPPPPPPšRÐPPPPPPQÜÙPPPPPPPV^PPPPPPPœÒÐPPPPPPQÔYPPPPPPPX”ŽPPPPPPP›ÐPPPPPPQÍPPPPPPPVšPPPPPPP’ÐPPPPPPQØÙPPPPPPPXÐŽPSÙPPPPPPP]ZPRYPPÍÒÐPPPPPPSÙPPžRÐP^PŽPPPPPPQRÐPXÞPSZÙPPPPPPP^TŽPRYPQÒÐPPPPPPS[ÙPPŒRÐP^^PPPPPPQÐPYPS›ÙPPPPPPPLšPRÙPQ’ÐPPPPPPSœÙPPÐPJÐŽPPPPPPQÐPYTŽPTÙPPPPPPPJÔŽPRÙPQRÐPPPPPPSÛÙPPÒÐPMžPPPPPPQ’ÐPYŽPTÙPPPPPPPJÚPRPQÒÐPPPPPPTÙPPÐRÐPZPŽPPPPPPPÒRÐPYÔŽPRZÙPPPPPPPZTŽPRRYPPÒÒÐPPPPPPR[ÙPPÑÐPZ^PPPPPPPÓÐPZŽPR]ÙPPPPPPPZŽPRUYPPÓ’ÐPPPPPPRLPPÑÒÐPZšPPPPPPPÓÒÐPZPRNPPPPPPPZžPRYÙPPPPPPPYÐŽPPPPPPPÒ’ÐPPPPPPRQYPPPPPPPZZPPPPPPPÐÒÐPPPPPPR\ÙPPPPPPPYÞPPPPPPPÓRÐPPPPPPRTYPPPPPPPZ”ŽPPPPPPPÑ’ÐPPPPPPRMPPPPPPPZPPPPPPPÔÐPPPPPPRXÙPPPPPPPZÐŽPR™ÙPPPPPPP[PŽPR‘YPPÖ’ÐPPPPPPRšÙPPÔÒÐP[ZPPPPPPPØRÐPZÞPRœÙPPPPPPP[^PR”YPPØÒÐPPPPPPRÙPPÕ’ÐP[”ŽPPPPPPPÙÐP[PRPPPPPPP[šPR˜ÙPPÙ’ÐPPPPPPRŽPPÖRÐPPPPPPRYPPPPPPP[TŽPPPPPPPÔ’ÐPPPPPPR›ÙPPPPPPPZÚPPPPPPPØ’ÐPPPPPPR“YPPPPPPP[ŽPPPPPPPÕRÐPPPPPPRŒPPPPPPP[ŽPPPPPPPÙRÐPPPPPPR–YPPPPPPP[žPPPPPPPÖÐPPPPPPRÐYPPÛÒÐPPPPPPRÙÙPPÚÐP\TŽPPPPPPPÜÐP[ÚPRÛÙPPPPPPP\ZPRÓYPPÜ’ÐPPPPPPRÜÙPPÚÒÐP\ŽPPPPPPPÜÒÐP\ŽPRÌPPPPPPP\”ŽPRÖYPPÝRÐPPPPPPRÍPPÛ’ÐP\žPPPPPPPÝ’ÐP\PŽPPPPPPPÙÒÐPPPPPPRÚÙPPPPPPP[ÔŽPPPPPPPÜRÐPPPPPPRÒYPPPPPPP\^PPPPPPPÚ’ÐPPPPPPRÝÙPPPPPPP\ŽPPPPPPPÝÐPPPPPPRÕYPPPPPPP\šPPPPPPPÛRÐPPPPPPRÎPPPPPPP\PPPPPPPÝÒÐP]PŽPPPPPPPÍÐP\ÔŽPSÙPPPPPPP]TŽPSYPPÎÐPPPPPPSÙPPÍÐPPPPPPSYPPPPPPP]TŽPPPPPPPÞÐPPPPPPSÙPPPPPPPXÐŽPPPPPPPÍÒÐPPPPPPRYPPPPPPP]ŽPPPPPPPÞ’ÐPPPPPPSPPÖ]ÐPPPPPPRšÑPQÐP^ŽPPPPPPQRÐP^PŽPPPPPPPžRÐPPPPPPSZÙPPPPPPPXÞPPPPPPQÒÐPPPPPPRYPPPPPPP^^PPPPPPPŒRÐPPPPPPS]ÙPPPPPPP]ÞPPPPPPQRÐPLŽPPPPPPQRÐPLŽPSšÙPPPPPPPL”ŽPS™ÙPPPPPPPLŽPPPPPPQ’ÐPPPPPPS‘YPPPPPPPLšPPPPPPPŒ’ÐPPPPPPSœÙPPPPPPPYPPPPPPQÒÐPMŽPPPPPPQÒÐPMŽPSÚÙPPPPPPPM”ŽPSÕYPQÒÐPPPPPPSÝÙPQÒÐPPPPPPSÐYPPPPPPPM”ŽPPPPPPQÐPPPPPPSÛÙPPPPPPPYZPPPPPPQ’ÐPPPPPPRÙPPPPPPPMÐŽPPPPPPQÐPPPPPPTYPQÐPPPPPPTÙPQÐPPPPPPRÙPPPPPPPJÔŽPPPPPPPRÐPPPPPPTÙPPPPPPPYŽPPPPPPQÒÐPPPPPPRPPPPPPPKÐŽPPPPPPQ’ÐPPPPPPPÖZPPPPPPP^TSPPPPPPPP\RTPPPPPPPQÜÐPPPPPPPPRÞQPPPPPPPQPPPPPPPPQZPPPPPPPUQPPPPPPPP“ÒTPPSZQPPPPPPPP^RTPPVPÑPPPPPPPPÒTPPPPPPPQÑZPPPPPPPXÔÑPPPPPPPPšRTPPPPPPPRZPPPPPPPV^QPPPPPPPPž’TPPPPPPPQÔZPPPPPPPYÑPPPPPPPP›TPPPPPPPRZPPPPPPPVšQPPPPPPPPŒ’TPPPPPPPQØÚPPPPPPPYQPPPPPPPP›ÒTPPPPPPPRÚPPPPPPPXTÑPPPPPPPPRTPPPPPPPQÛÚPPPPPPPYZQPPPPPPPPœ’TPPPPPPPRÚPPPPPPPXÑPPPPPPPPŽTPPPPPPPQÌPPPPPPPY”ÑPPPPPPPPRTPPPPPPPRPPPPPPPXžQPPPPPPPP‹ÒTPPPPPPPRZPP™ÒTPPPPPPPQÐZPPžTPPVTÑPPPPPPPPšTPPXÚQPPQÒZPPPPPPPVZQPPRZPPš’TPPPPPPPQÓZPPŒTPPVÑPPPPPPPPšÒTPPYÑPPQÕZPPPPPPPV”ÑPPRZPP›RTPPPPPPPQÖZPPŒÒTPPVžQPPPPPPPP›’TPPYPÑPPQÙÚPPPPPPPXPÑPPRÚPPœTPPPPPPPQÚÚPP’TPPXZQPPPPPPPPœRTPPY^QPPQÜÚPPPPPPPX^QPPRÚPPœÒTPPPPPPPQÝÚPPŽRTPPX”ÑPPPPPPPPTPPYšQPPQÍPPPPPPPXšQPPRPP’TPPPPPPPQÎPPÑTPPPPPPPRTZPPPPPPPZÑPPRSZPPPPPPPYÞQPPSZÐPPPPPPPLÔPPPPPPPPÌÒPPPPPPPS‘ZÐPPPPPPP]PÔPPPPPPPQÒPPPPPPPSÚÐPPPPPPPLTPPPPPPPPÍ’PPPPPPPS”ZÐPPPPPPP]^TPPPPPPPQ’PPPPPPPSÚÐPPPPPPPLZTPPPPPPPPÎRPPPPPPPS˜ÚÐPPPPPPP]šTPPPPPPPQRPPPPPPPSÐPPPPPPPL”ÔPPPPPPPQRPPPPPPPS›ÚÐPPPPPPP]ÔÔPPPPPPPQ’PPPPPPPSRZÐPPPPPPPLÐÔPPPPPPPQPPPPPPPSŒÐPPPPPPP^ÔPPPPPPPQRPPPPPPPSUZÐPPPPPPPLÞTPPPPPPPQÒPPPPPPPSÐZÐPPPPPPP^TPPPPPPPQPPPPPPPSYÚÐPPPPPPPMTPPPPPPPQ’PPPPPPPSÓZÐPPPPPPP^ZTPPPPPPPQÒPPPPPPPS\ÚÐPPPPPPPMTÔPPPPPPPQRPPPPPPPSÖZÐPPPPPPP^”ÔPPPPPPPQ’PPPPPPPSMÐPPPPPPPMÔPPPPPPPQPPPPPPPSÚÚÐPPPPPPPLÔPPSZÐPPPPPPP]TPPS‘ZÐPPÌÒPPPPPPPSÚÐPQÒPP]PÔPPPPPPPPÍPPLTPPSÚÐPPPPPPP]TÔPPS”ZÐPPÍ’PPPPPPPSÚÐPQ’PP]^TPPPPPPPPÍÒPPLZTPPSÚÐPPPPPPP]ÔPPS˜ÚÐPPÎRPPPPPPPSÐPQRPP]šTPPPPPPPPÊÒPPL”ÔPPSÐPPPPPPP]žTPPS›ÚÐPQRPPPPPPPSPZÐPQ’PP]ÔÔPPPPPPPQ’PPLÐÔPPSRZÐPPPPPPP]ÚTPPSŒÐPQPPPPPPPSSZÐPQRPP^ÔPPPPPPPQRPPLÞTPPSUZÐPPPPPPP^ÔPPSÐZÐPQÒPPPPPPPSVZÐPQPP^TPPPPPPPQPPMTPPSYÚÐPPPPPPP^PÔPPSÓZÐPQ’PPPPPPPSZÚÐPQÒPP^ZTPPPPPPPQÒPPMTÔPPS\ÚÐPPPPPPP^^TPPSÖZÐPQRPPPPPPPS]ÚÐPQ’PP^”ÔPPPPPPPQ’PPMÔPPSMÐPPPPPPP^šTPPSÚÚÐPQPPPPPPPSNÐPPPSPPPPPPPQ\ÐPPPPPPPPTÝÐPPPPPPP^PPPPPPPPR\ÐPPPPPPPSZ]ÐPPPPPPPQPPPPPPPQ\ÐPPPPPPPPÝÐPPPPPPPLPPPPPPPPU\ÐPPPPPPPS”ÝÐPPPPPPPQÓPPPPPPPQ\ÐPPPPPPPPž]ÐPPPPPPPLÓPPPPPPPPYÜÐPPPPPPPSÐÝÐPPPPPPPR“PPPPPPPQÜÐPPPPPPPPÚ]ÐPPPPPPPM“PPPPPPPP\ÜÐPPPPPPPSÞ]ÐPPPPPPPSSPPPPPPPQÜÐPPPPPPPQÝÐPPPPPPPNSPPPPPPPPMÐPPPPPPPT]ÐPPPPPPPTPPPPPPPQÐPPPPPPPQPÝÐPPPPPPPSPPPPPPPP‘\ÐPPPPPPPTTÝÐPPPPPPPTÓPPPPPPPQR\ÐPPPPPPPQ^]ÐPPPPPPP‘PPPPPPPP”\ÐPPPPPPPTÝÐPPPPPPPU“PPPPPPPQU\ÐPPPPPPPQš]ÐPPPPPPP‘ÓPPPPPPPP˜ÜÐPPPPPPPTž]ÐPPPPPPPVSPPPPPPPQYÜÐPPPPPPPQÔÝÐPPPPPPP’“PPPPPPPP›ÜÐPPPPPPPTÚ]ÐPPPPPPPX“PPPPPPPQ\ÜÐPPPPPPPRÝÐPPPPPPP“SPPPPPPPPŒÐPPPPPPPUÝÐPPPPPPPYSPPPPPPPQMÐPPPPPPPR]ÐPPPPPPP”PPPPPPPPÐ\ÐPPPPPPPUPÝÐPPPPPPPZPPPPPPPQ‘\ÐPPPPPPPRZ]ÐPPPPPPP”ÓPPPPPPPPÓ\ÐPPPPPPPU^]ÐPPPPPPPZÓPPPPPPPQ”\ÐPPPPPPPR”ÝÐPPPPPPP•“PPPPPPPPÖ\ÐPPPPPPPUš]ÐPPPPPPP[“PPPPPPPQ˜ÜÐPPPPPPPRÐÝÐPPPPPPP–SPPPPPPPPÚÜÐPPPPPPPUÔÝÐPPPPPPP\SPPPPPPPQ›ÜÐPPPPPPPRÞ]ÐPPPPPPP˜“PPPPPPPPÝÜÐPPPPPPPVÝÐPPPPPPP]PPPPPPPQŒÐPPPPPPPS]ÐPPPPPPP™SPPPPPPPQ\ÐPPPSPPPPPPPPP\ÐPP^PPPTÝÐPPPPPPPP“PPSZ]ÐPPR\ÐPPPPPPPPZ]ÐPQ\ÐPPQPPPPPPPPS\ÐPPLPPPÝÐPPPPPPPQSPPS”ÝÐPPU\ÐPPPPPPPP”ÝÐPQ\ÐPPQÓPPPPPPPPV\ÐPPLÓPPPž]ÐPPPPPPPRPPSÐÝÐPPYÜÐPPPPPPPPÐÝÐPQÜÐPPR“PPPPPPPPZÜÐPPM“PPPÚ]ÐPPPPPPPRÓPPSÞ]ÐPP\ÜÐPPPPPPPPÞ]ÐPQÜÐPPSSPPPPPPPP]ÜÐPPNSPPQÝÐPPPPPPPS“PPT]ÐPPMÐPPPPPPPQ]ÐPQÐPPTPPPPPPPPNÐPPSPPQPÝÐPPPPPPPTSPPTTÝÐPP‘\ÐPPPPPPPQTÝÐPQR\ÐPPTÓPPPPPPPP’\ÐPP‘PPQ^]ÐPPPPPPPUPPTÝÐPP”\ÐPPPPPPPQÝÐPQU\ÐPPU“PPPPPPPP•\ÐPP‘ÓPPQš]ÐPPPPPPPUÓPPTž]ÐPP˜ÜÐPPPPPPPQž]ÐPQYÜÐPPVSPPPPPPPP™ÜÐPP’“PPQÔÝÐPPPPPPPV“PPTÚ]ÐPP›ÜÐPPPPPPPQÚ]ÐPQ\ÜÐPPX“PPPPPPPPœÜÐPP“SPPRÝÐPPPPPPPXÓPPUÝÐPPŒÐPPPPPPPRÝÐPQMÐPPYSPPPPPPPPÐPP”PPR]ÐPPPPPPPY“PPUPÝÐPPÐ\ÐPPPPPPPRPÝÐPQ‘\ÐPPZPPPPPPPPÑ\ÐPP”ÓPPRZ]ÐPPPPPPPZSPPU^]ÐPPÓ\ÐPPPPPPPR^]ÐPQ”\ÐPPZÓPPPPPPPPÔ\ÐPP•“PPR”ÝÐPPPPPPP[PPUš]ÐPPÖ\ÐPPPPPPPRš]ÐPQ˜ÜÐPP[“PPPPPPPPØÜÐPP–SPPRÐÝÐPPPPPPP[ÓPPUÔÝÐPPÚÜÐPPPPPPPRÔÝÐPQ›ÜÐPP\SPPPPPPPPÛÜÐPP˜“PPRÞ]ÐPPPPPPP\“PPVÝÐPPÝÜÐPPPPPPPSÝÐPQŒÐPP]PPPPPPPPÌÐPP™SPPS]ÐPPPPPPP]SPPVPÝÐPPPPPPPšPPPPPPPQÑ\ÐPP™ÓPPPPPPPQÐ\ÐPPšSPPPPPPPQÜÐÐPPPPPPPV^]ÐPPPPPPPŽRPPPPPPPQÔ\ÐPPPPPPPY”RPPPPPPPP›PPSÙÒPPPPPPPPMYÐPVš]ÐPQÐPPPPPPPTÒPPQØÜÐPPPPPPPXPÝÐPPPPPPP›ÓPPVž]ÐPPPPPPP›“PPXTÝÐPPPPPPPœSPPPPPPPQÛÜÐPPœPPPPPPPQÚÜÐPPœ“PPPPPPPQÝÜÐPPPPPPPXÝÐPQÜÜÐPPPPPPPX^]ÐPQÌÐPPPPPPPUTRPPPPPPPPSPPPPPPPRPÐPPPPPPPXž]ÐPPPPPPP”PYÐPPPPPPR\ÐPPPPPPPUYÒPPPPPPPPžSPPPPPPPR\ÐPPPPPPPXÞ]ÐPR\ÐPPPPPPPXÚ]ÐPR\ÐPPPPPPPY]ÐPPPPPPPŒ“PPYÝÐPPPPPPPŒSPPYš]ÐPPPPPPPKÐYÐPPPPPPRÐPPPPPPPTPRPPPPPPPPÐSPPPPPPPRQ\ÐPPPPPPPYÔÝÐPRP\ÐPPPPPPPYÐÝÐPRR\ÐPPPPPPPYÞ]ÐPPPPPPPÑPPYÚ]ÐPPPPPPPÐÓPPZÝÐPPPPPPPÑ“PPPPPPPRU\ÐPPÑSPPPPPPPRT\ÐPPÑÓPPPPPPPRXÜÐPPPPPPPZ]ÐPRV\ÐPPPPPPPZ]ÐPRYÜÐPPPPPPPZTÝÐPPPPPPPÒ“PPZPÝÐPPPPPPPÒSPPZZ]ÐPPPPPPPÓPPPPPPPR\ÜÐPPÒÓPPPPPPPR[ÜÐPPÓSPPPPPPPRLÐPPPPPPPZ”ÝÐPR]ÜÐPPPPPPPZÝÐPRMÐPPPPPPPZž]ÐPPPPPPPÔPPZš]ÐPPPPPPPÓÓPPZÐÝÐPPPPPPPÔ“PPPPPPPR‘\ÐPPÔSPPPPPPPR\ÐPPÔÓPPPPPPPR“\ÐPPPPPPPZÞ]ÐPR’\ÐPPPPPPPZÚ]ÐPR”\ÐPPPPPPP[ÝÐPPPPPPPÕ“PP[ÝÐPPPPPPPÕSPP[]ÐPPPPPPPÖPPPPPPPR˜ÜÐPPÕÓPPPPPPPR–\ÐPPÖSPPPPPPPRšÜÐPPPPPPP[TÝÐPR™ÜÐPPPPPPP[PÝÐPR›ÜÐPPPPPPP[^]ÐPPPPPPPØ“PP[Z]ÐPPPPPPPØSPP[ÝÐPPPPPPPÙPPPPPPPRŒÐPPØÓPPPPPPPRÜÐPPÙSPPPPPPPRŽÐPPPPPPP[ž]ÐPRÐPPPPPPP[š]ÐPRÐ\ÐPPPPPPP[ÔÝÐPPPPPPPÚPP[ÐÝÐPPPPPPPÙÓPP[Ú]ÐPPPPPPPÚ“PPPPPPPRÓ\ÐPPÚSPPPPPPPRÒ\ÐPPÚÓPPPPPPPRÕ\ÐPPPPPPP\ÝÐPRÔ\ÐPPPPPPP\ÝÐPRÖ\ÐPPPPPPP\]ÐPPPPPPPÛ“PP\]ÐPPPPPPPÛSPP\PÝÐPPPPPPPÜPPPPPPPRÚÜÐPPÛÓPPPPPPPRÙÜÐPPÜSPPPPPPPRÜÜÐPPPPPPP\^]ÐPRÛÜÐPPPPPPP\Z]ÐPRÝÜÐPPPPPPP\”ÝÐPPPPPPPÝPP\ÝÐPPPPPPPÜÓPP\š]ÐPPPPPPPÝ“PPPPPPPRÎÐPPÝSPPPPPPPRÍÐPPÝÓPPPPPPPS\ÐPPPPPPP\ÔÝÐPS\ÐPPPPPPP\ÐÝÐPS\ÐPPPPPPP\Þ]ÐPPPPPPPÞ“PP\Ú]ÐPPPPPPPÞSPP]ÝÐPPPPPPPÌSPPPPPPPS\ÐPPÌPPPPPPPS\ÐPPÌ“PPPPPPPSÜÐPPPPPPP]]ÐPS\ÐPPPPPPP]]ÐPSÜÐPPPPPPP]TÝÐPPPPPPPÍSPP]PÝÐPPPPPPPÍPP]Z]ÐPPPPPPPÍÓPPPPPPPSÜÐPPÍ“PPPPPPPSÜÐPPÎPPPPPPPSÐPPPPPPP]”ÝÐPSÜÐPPPPPPP]ÝÐPSÐPPPPPPP]ž]ÐPPPPPPPËÓPP]š]ÐPPPPPPPÊÓPP]ÐÝÐPPPPPPQ“PPPPPPPSQ\ÐPQSPPPPPPPSP\ÐPQÓPPPPPPPSS\ÐPPPPPPP]Þ]ÐPSR\ÐPPPPPPP]Ú]ÐPST\ÐPPPPPPP^ÝÐPPPPPPQ“PP^ÝÐPPPPPPQSPP^]ÐPPPPPPQPPPPPPPSXÜÐPQÓPPPPPPPSV\ÐPQSPPPPPPPSZÜÐPPPPPPP^TÝÐPSYÜÐPPPPPPP^PÝÐPS[ÜÐPPPPPPP^^]ÐPPPPPPQPP^Z]ÐPPPPPPQÓPP^ÝÐPPPPPPQ“PPPPPPPSLÐPQSPPPPPPPS]ÜÐPQÓPPPPPPPSNÐPPPPPPP^ž]ÐPSMÐPPPPPPP^š]ÐPS\ÐPPPPPPPLÝÐPPPPPPQ“PPLÝÐPPPPPPQSPPL]ÐPPPPPPQPPPPPPPS“\ÐPQÓPPPPPPPS’\ÐPQSPPPPPPPS•\ÐPPPPPPPLTÝÐPS”\ÐPPPPPPPLPÝÐPS–\ÐPPPPPPPL^]ÐPPPPPPQPPLZ]ÐPPPPPPQÓPPLÝÐPPPPPPQ“PPPPPPPSšÜÐPQSPPPPPPPS™ÜÐPQSPPPPPPPSœÜÐPPPPPPPLž]ÐPS›ÜÐPPPPPPPLš]ÐPSÜÐPPPPPPPLÔÝÐPPPPPPQPPLÐÝÐPPPPPPQÓPPLÚ]ÐPPPPPPQ“PPPPPPPSŽÐPQSPPPPPPPSÐPQÓPPPPPPPSÑ\ÐPPPPPPPMÝÐPSÐ\ÐPPPPPPPMÝÐPSÒ\ÐPPPPPPPM]ÐPPPPPPQ“PPM]ÐPPPPPPQSPPMž]ÐPPPPPPQÓPPPPPPPSÝÜÐPQ“PPPPPPPSÜÜÐPQPPPPPPPSÍÐPPPPPPPMÚ]ÐPSÌÐPPPPPPPMÔÝÐPT\ÐPPPPPPPN]ÐPPPPPPQ“PPN]ÐPPPPPPQSPPPPÌPRÐTPPPPPPPP[ÐPPPQ]PPÚPPPPPPPPRÑTPPPPÓPP[ÚPPPPPPPPÚQPPPP^LPRÓTPPPPPPPP[ÞPPPT]PPÚÑPPPPPPPPRÔTPPPQ“PP\PPPPPPPPÛPPPPšLPRÖTPPPPPPPP\PPPXÝPPÛ‘PPPPPPPPRØÔPPPRSPP\PPPPPPPPPÛÑPPPPÔÌPRÚÔPPPPPPPP\TPPP[ÝPPÜQPPPPPPPPRÛÔPPPSPP\^PPPPPPPPÜ‘PPPQÌPRÝÔPPPPPPPP\PPPLPPÝPPPPPPPPRÌPPPSÓPP\šPPPPPPPPÝQPPPQLPRÎPPPPPPPP\žPPP]PPÝÑPPPPPPPPSTPPPT“PP\ÔPPPPPPPPÞPPPQZLPSTPPPPPPPP\ÚPPP“]PPÞ‘PPPPPPPPSTPPPUSPP]PPPPPPPPÌPPPQ”ÌPSTPPPPPPPP]PPP–]PPÌ‘PPPPPPPPSTPPPVPP]PPPPPPPPÌÑPPPQÐÌPSÔPPPPPPPP]PPPPšÝPPÍQPPPPPPPPSÔPPPXSPP]ZPPPPPPPPÍ‘PPPQÞLPSÔPPPPPPPP]^PPPÝPPÎPPPPPPPPSÔPPPYPP]”PPPPPPPPÎQPPPRLPSPPPPPPPP]šPPPŽPPËÑPPPPPPPPSPPPYÓPP]ÐPPPPPPPQQPPPRTÌPSQTPPPPPPPP]ÔPPPÒ]PQÑPPPPPPPPSRTPPPZ“PP]ÞPPPPPPPQPPPRÌPSTTPPPPPPPP^PPPÕ]PQ‘PPPPPPPPSUTPPP[“PP^PPPPPPPQPPPSÌPSLPPPPPPPP^”PPQPÛPPPPPPPPTXVPPPPPPPPœÐPTRÖPPPPPPPP\ÐPT\VPPPPPPPP‘ÐPPPPPPQSÛPPPÜÐPPPPPPQRÛPPP‘\ÐPPPPPPQUÛPPPPPPPPT˜VPPQTÛPPPPPPPPT’ÖPPQX[PPPPPPPPT–PPPPPPPP’ÐPTœVPPPPPPPP‘ÜÐPTÒÖPPPPPPPP’œÐPPPPPPQ[[PPP’\ÐPPPPPPQZ[PPP’ÜÐPPPPPPQ][PPPPPPPPTÍ–PPQ\[PPPPPPPPTÜVPPQ^[PPPPPPPPUVPPPPPPPP“œÐPUÖPPPPPPPP“\ÐPUVPPPPPPPP”ÐPPPPPPQJÛPPP“ÜÐPPPPPPQM›PPP”\ÐPPPPPPQ‘ÛPPPPPPPPUXVPPQÛPPPPPPPPURÖPPQ’ÛPPPPPPPPUM–PPPPPPPP•ÐPU\VPPPPPPPP”ÜÐPU’ÖPPPPPPPP•œÐPPPPPPQ•ÛPPP•\ÐPPPPPPQ”ÛPPP•ÜÐPPPPPPQ™[PPPPPPPPU–PPQ˜[PPPPPPPPUœVPPQš[PPPPPPPPUØVPPPPPPPP–œÐPUÒÖPPPPPPPP–\ÐPUÜVPPPPPPPP˜œÐPPPPPPQ[PPP˜\ÐPPPPPPQœ[PPP˜ÜÐPPPPPPQŒ›PPPPPPPPVVPPQž[PPPPPPPPVÖPPQ›PPPPPPPPV–PPPPPPPP™œÐPVVPPPPPPPP™\ÐPVRÖPPPPPPPPšÐPPPPPPQÑÛPPP™ÜÐPPPPPPQÐÛPPPš\ÐPPPPPPQÓÛPPPPPPPPVM–PPQÒÛPPPPPPPPV\VPPQÔÛPPPPPPPPV˜VPPPPPPPP›ÐPV’ÖPPPPPPPPšÜÐPVœVPPPPPPPP›œÐPPPPPPQÙ[PPP›\ÐPPPPPPQØ[PPP›ÜÐPPPPPPQÛ[PPPPPPPPXXVPPQÚ[PPPPPPPPXRÖPPQÜ[PPPPPPPPXM–PPPPPPPPœœÐPX\VPPPPPPPPœ\ÐPX’ÖPPPPPPPPÐPPPPPPQÌ›PPPœÜÐPPPPPPQÞ[PPPÐ\ÐPPPPPPRQÛPPPPPPPPYØVPPRPÛPPPPPPPPYÒÖPPRRÛPPPPPPPPYÍ–PPPPPPPPÑÐPYÜVPPPPPPPPÐÜÐPZÖPPPPPPPPÑœÐPPPPPPRUÛPPPÑ\ÐPPPPPPRTÛPPPÑÜÐPPPPPPRY[PPPPPPPPZ–PPRX[PPPPPPPPZVPPRZ[PPPPPPPPZXVPPPPPPPPÒœÐPZRÖPPPPPPPPÒ\ÐPZ\VPPPPPPPPÓÐPPPPPPR][PPPÒÜÐPPPPPPR\[PPPÓ\ÐPPPPPPRL›PPPPPPPPZ˜VPPR^[PPPPPPPPZ’ÖPPRM›PPPPPPPPZ–PPPPPPPPÔÐPZœVPPPPPPPPÓÜÐPZÒÖPPPPPPPPÔœÐPPPPPPR‘ÛPPPÔ\ÐPPPPPPRÛPPPÔÜÐPPPPPPR“ÛPPPPPPPPZÍ–PPR’ÛPPPPPPPPZÜVPPR”ÛPPPPPPPP[VPPPPPPPPÕœÐP[ÖPPPPPPPPÕ\ÐP[VPPPPPPPPÖÐPPPPPPR™[PPPÕÜÐPPPPPPR˜[PPPÖ\ÐPPPPPPR›[PPPPPPPP[XVPPRš[PPPPPPPP[RÖPPRœ[PPPPPPPP[M–PPPPPPPPØœÐP[\VPPPPPPPPØ\ÐPR\XÐPPPPPPPZœÐPPPPPPPÓÛPPZ\ÐPPPPPPPÒÛPPZÜÐPPPPPPPÕÛPPPPPPPR˜XÐPPÔÛPPPPPPPR’ØÐPPØ[PPPPPPPR˜ÐPPPPPPP[œÐPRœXÐPPPPPPP[\ÐPRÒØÐPPPPPPP\ÐPPPPPPPÛ[PP[ÜÐPPPPPPPÚ[PP\\ÐPPPPPPPÝ[PPPPPPPRÍ˜ÐPPÜ[PPPPPPPRÜXÐPPÞ[PPPPPPPSXÐPPPPPPP]ÐPSØÐPPPPPPP\ÜÐPSXÐPPPPPPP]œÐPPPPPPPÊÛPP]\ÐPPPPPPPÍ›PP^\ÐPPPPPPQÛPPPPPPPSM˜ÐPQÛPPPPPPPS\XÐPQÛPPPPPPPS˜XÐPPPPPPPL\ÐPS’ØÐPPPPPPPLÐPSœXÐPPPPPPPLÜÐPPPPPPQ[PPLœÐPPPPPPQ[PPMÐPPPPPPQ[PPPPPPPSØXÐPQ[PPPPPPPSÒØÐPQ[PPPPPPPSÍ˜ÐPPPPPPPMÜÐPSÜXÐPPPPPPPMœÐPTØÐPPPPPPPN\ÐPPPPPPQ›PPNÐPPPPPPQ[PPJÜÐPPPPPPQ
ÛPPPPPPPT˜ÐPQ›PPPPPPPTXÐPQPÛPPPPPPPTXXÐPPPPPPPœÐPTRØÐPPPPPPP\ÐPT\XÐPPPPPPP‘ÐPPPPPPQSÛPPÜÐPPPPPPQRÛPP‘\ÐPPPPPPQUÛPPPPPPPT˜XÐPQTÛPPPPPPPT’ØÐPQX[PPPPPPPT˜ÐPPPPPPP’ÐPTœXÐPPPPPPP‘ÜÐPTÒØÐPPPPPPP’œÐPPPPPPQ[[PP’\ÐPPPPPPQZ[PP’ÜÐPPPPPPQ][PPPPPPPTÍ˜ÐPQ\[PPPPPPPTÜXÐPQ^[PPPPPPPUXÐPPPPPPP“œÐPUØÐPPPPPPP“\ÐPUXÐPPPPPPP”ÐPPPPPPQJÛPP“ÜÐPPPPPPQM›PP”\ÐPPPPPPQ‘ÛPPPPPPPUXXÐPQÛPPPPPPPURØÐPQ’ÛPPPPPPPUM˜ÐPPPPPPP•ÐPU\XÐPPPPPPP”ÜÐPU’ØÐPPPPPPP•œÐPPPPPPQ•ÛPP•\ÐPPPPPPQ”ÛPP•ÜÐPPPPPPQ™[PPPPPPPU˜ÐPQ˜[PPPPPPPUœXÐPQš[PPPPPPPUØXÐPPPPPPP–œÐPUÒØÐPPPPPPP–\ÐPUÜXÐPPPPPPP˜œÐPPPPPPQ[PP˜\ÐPPPPPPQœ[PP˜ÜÐPPPPPPQŒ›PPPPPPPVXÐPQž[PPPPPPPVØÐPQ›PPPPPPPV˜ÐPPPPPPP™œÐPVXÐPPPPPPP™\ÐPVRØÐPPPPPPPšÐPPPPPPQÑÛPP™ÜÐPPPPPPQÐÛPPš\ÐPPPPPPQÓÛPPPPPPPVM˜ÐPQÒÛPPPPPPPV\XÐPQÔÛPPPPPPPV˜XÐPPPPPPP›ÐPV’ØÐPPPPPPPšÜÐPVœXÐPPPPPPP›œÐPPPPPPQÙ[PP›\ÐPPPPPPQØ[PP›ÜÐPPPPPPQÛ[PPPPPPPXXXÐPQÚ[PPPPPPPXRØÐPQÜ[PPPPPPPXM˜ÐPPPPPPPœœÐPX\XÐPPPPPPPœ\ÐPX’ØÐPPPPPPPÐPPPPPPQÌ›PPœÜÐPPPPPPQÞ[PP\ÐPPPPPPQÊÛPPPPPPPX˜ÐPQÍ›PPPPPPPXœXÐPR[PPPPPPPY\XÐPPPPPPPœÐPYXXÐPPPPPPP\ÐPYM˜ÐPPPPPPPŽÐPPPPPPR[PPÜÐPPPPPPR[PPŽ\ÐPPPPPPRÙPPPPPPPYœXÐPPPPPPP‹ÜÐPPPPPPR
ÛPPŠÜÐPPPPPPR›PPÐ\ÐPPPPPPRQÛPPPPPPPYØXÐPRPÛPPPPPPPYÒØÐPRRÛPPPPPPPYÍ˜ÐPPPPPPPÑÐPYÜXÐPPPPPPPÐÜÐPZØÐPPPPPPPÑœÐPPPPPPRUÛPPÑ\ÐPPPPPPRTÛPPÑÜÐPPPPPPRY[PPPPPPPZ˜ÐPRX[PPPPPPPZXÐPR][PPPPPPPZ’ØÐPPPPPPPÓ\ÐPZM˜ÐPPPPPPPÓÐPZ˜XÐPPPPPPP›YÐPPPPPPRÛPPPPPPPZØXÐPPPPPPPÔœÐPZÒØÐPPPPPPPÔ\ÐPZÜXÐPPPPPPPÕÐPPPPPPR“ÛPPÔÜÐPPPPPPR’ÛPPÕÜÐPPPPPPR™[PPPPPPP[˜ÐPR˜[PPPPPPP[XÐPRš[PPPPPPP[XXÐPPPPPPPÖœÐP[RØÐPPPPPPPÖ\ÐP[\XÐPPPPPPPØœÐPPPPPPR[PPØ\ÐPPPPPPRœ[PPØÜÐPPPPPPRŒ›PPPPPPP[˜XÐPRž[PPPPPPP[’ØÐPR›PPPPPPP[˜ÐPPPPPPPÙœÐP[œXÐPPPPPPPÙ\ÐP[ÒØÐPPPPPPPÚÐPPPPPPRÑÛPPÙÜÐPPPPPPRÐÛPPÚ\ÐPPPPPPRÓÛPPPPPPP[Í˜ÐPRÒÛPPPPPPP[ÜXÐPRÔÛPPPPPPP\XÐPPPPPPPÛÐP\ØÐPPPPPPPÚÜÐP\XÐPPPPPPPÛœÐPPPPPPRÙ[PPÛ\ÐPPPPPPRØ[PPÛÜÐPPPPPPRÛ[PPPPPPP\XXÐPRÚ[PPPPPPP\RØÐPRÜ[PPPPPPPV™ÒPPPPPPPPÜœÐPPPPPPQÐÐPPPPPPP\’ØÐPPPPPPPšYÐPPPPPPRÌ›PPPPPPPXRPPPPPPPPÝ\ÐPPPPPPQÛÐÐPPPPPPP\ÒØÐPPPPPPPÙPYÐPPPPPPSÛPPPPPPPZÒPPPPPPPPÞ\ÐPPPPPPRŒÐPPPPPPP\Í˜ÐPPPPPPP•]ÐPPPPPPSÛPPPPPPP]XÐPPPPPPPÌ\ÐP]ØÐPPPPPPPÌÐP]XÐPPPPPPPÌÜÐPPPPPPS[PPÌœÐPPPPPPS[PPÍÐPPPPPPS[PPPPPPP]XXÐPS[PPPPPPP]RØÐPQ“ÜPPÞœÐPPPPPPSÛPPÜ]ÐP[Ð“PPPPPPPPÙÑ]ÐPXØ\ÐPRÑUPPPPPPP[Ô“PPRÜPPÚQ]ÐPPPPPPRÒUPPžœ]ÐP[ÞPPPPPPPPÚ‘]ÐPYÜÐPRÔUPPPPPPP\“PPRÜPPÛ]ÐPPPPPPRÕUPPŒœ]ÐP\PPPPPPPPÛQ]ÐPYœÐPRØÕPPPPPPP\PPR\PPÛÑ]ÐPPPPPPRÙÕPP\]ÐP\T“PPPPPPPPÜ]ÐPY\\ÐPRÛÕPPPPPPP\ZPPR\PPÜ‘]ÐPPPPPPRÜÕPPŽ]ÐP\“PPPPPPPPÜÑ]ÐPY˜\ÐPRÌPPPPPPP\”“PPRœPPÝQ]ÐPPPPPPRÍPP‹Ü]ÐP\žPPPPPPPPÝ‘]ÐPYÒÜÐPSUPPPPPPP\Ð“PPRQÜPPÞ]ÐPPPPPPSUPPÐÜ]ÐP\ÚPPPPPPPPÞQ]ÐPYÍœÐPSUPPPPPPP\ÞPPRTÜPPÌ]ÐPPPPPPSUPPÑœ]ÐP]“PPPPPPPPÌQ]ÐPZ\ÐPSUPPPPPPP]PPRY\PPÌÑ]ÐPPPPPPSÕPPÒ\]ÐP]P“PPPPPPPPÍ]ÐPZX\ÐPSÕPPPPPPP]T“PPR\\PPÍ‘]ÐPPPPPPSÕPPÓ]ÐP]^PPPPPPPPÍÑ]ÐPZ’ÜÐPSÕPPPPPPP]“PPRLœPPÎQ]ÐPPPPPPSPPÓÜ]ÐP]šPPPPPPPPÊÑ]ÐPZœÐPSPPPPPPP]žPPRÜPQQ]ÐPPPPPPSPUPPÔœ]ÐP]Ô“PPPPPPPQ‘]ÐPZÜ\ÐPSRUPPPPPPP]ÚPPR“ÜPQ]ÐPPPPPPSSUPPÕ\]ÐP^“PPPPPPPQQ]ÐP[\ÐPSUUPPPPPPP^“PPR˜\PQÑ]ÐPPPPPPSVUPPÖ]ÐP^PPPPPPPQ]ÐP[RÜÐPSYÕPPPPPPP^P“PPR›\PQ‘]ÐPPPPPPSZÕPPØ\]ÐP^ZPPPPPPPQÑ]ÐP[MœÐPS\ÕPPPPPPP^^PPRž\PQQ]ÐPPPPPPS]ÕPPÙ]ÐP^”“PPPPPPPQ‘]ÐP[œ\ÐPSMPPPPPPP^šPPRŠÜPQ]ÐPPPPPPSNPPÙÜ]ÐPL“PPPPPPPQQ]ÐP[Ø\ÐPS‘UPPPPPPPL“PPRÒÜPQÑ]ÐPPPPPPS’UPPÚœ]ÐPLPPPPPPPQ]ÐP\ÜÐPS”UPPPPPPPLP“PPRÕÜPQ‘]ÐPPPPPPS•UPPÛ\]ÐPLZPPPPPPPQÑ]ÐP\œÐPS˜ÕPPPPPPPL^PPRÚ\PQQ]ÐPPPPPPS™ÕPPÜ]ÐPL”“PPPPPPPQ‘]ÐP\\\ÐPS›ÕPPPPPPPLšPPRÝ\PQ‘]ÐPPPPPPSœÕPPÜÜ]ÐPLÐ“PPPPPPPQÑ]ÐP\˜\ÐPSŒPPPPPPPLÔ“PPRÍœPQQ]ÐPPPPPPSPPÝœ]ÐPLÞPPPPPPPQ‘]ÐP\ÒÜÐPSÐUPPPPPPPM“PPSÜPQ]ÐPPPPPPSÑUPPÞ\]ÐPMPPPPPPPQQ]ÐP\ÍœÐPSÓUPPPPPPPMPPSÜPQÑ]ÐPPPPPPSÔUPPÌ\]ÐPMT“PPPPPPPQ]ÐP]\ÐPSÖUPPPPPPPMZPPS\PQ‘]ÐPPPPPPSØÕPPÍ]ÐPM“PPPPPPPQÑ]ÐP]X\ÐPSÚÕPPPPPPPM”“PPS\PQQ]ÐPPPPPPSÛÕPPÍÜ]ÐPMžPPPPPPPQ‘]ÐP]’ÜÐPSÝÕPPPPPPPMÐ“PPSœPQ]ÐPPPPPPSÌPPÊÜ]ÐPMÚPPPPPPPQQ]ÐP]œÐPSÎPPPPPPPMÞPPPÒÐPPPPPPPTYŽPPPPPPPZKÝÐPPPPPPQSÐPPPPPPPRKÎPPPPPPP‘ÝÐPPPPPPPÕÐPPPPPPPT”PPPPPPP[ÝÐPPPPPPQVÐPPPPPPPRŽPPPPPPP‘ËÝÐPPPPPPPÙ‹ÐPPPPPPPT‹ÎPPPPPPP[ËÝÐPPPPPPQZ‹ÐPPPPPPPRÙŽPPPPPPP’‹ÝÐPPPPPPPÜ‹ÐPPPPPPPTÝŽPPPPPPP\‹ÝÐPPPPPPQ]‹ÐPPPPPPPSPPPPPPP“KÝÐPPPPPPPÌËÐPPPPPPPUŽPPPPPPP]KÝÐPPPPPPQMËÐPPPPPPPSÎPPPPPPP”ÝÐPPPPPPQÐPPPPPPPUTPPPPPPP^ÝÐPPPPPPQ’ÐPPPPPPPS]ŽPPPPPPP”ËÝÐPPPPPPQÐPPPPPPPUKÎPPPPPPPLÝÐPPPPPPQ•ÐPPPPPPPS™ŽPPPPPPP•‹ÝÐPPPPPPQ‹ÐPPPPPPPUŽPPPPPPPLËÝÐPPPPPPQ™‹ÐPPPPPPPSÔPPPPPPP–KÝÐPPPPPPQ‹ÐPPPPPPPUÙŽPPPPPPPM‹ÝÐPPPPPPQœ‹ÐPPPPPPPTYŽPPÒÐPPPPPPPRYŽPQSÐPPZKÝÐPPPPPPPÓÐPP‘ÝÐPRKÎPPPPPPPZ‹ÝÐPT”PPÕÐPPPPPPPR”PQVÐPP[ÝÐPPPPPPPÖÐPP‘ËÝÐPRŽPPPPPPP[KÝÐPT‹ÎPPÙ‹ÐPPPPPPPR‹ÎPQZ‹ÐPP[ËÝÐPPPPPPPÚ‹ÐPP’‹ÝÐPRÙŽPPPPPPP\ÝÐPTÝŽPPÜ‹ÐPPPPPPPRÝŽPQ]‹ÐPP\‹ÝÐPPPPPPPÝ‹ÐPP“KÝÐPSPPPPPPP\ËÝÐPUŽPPÌËÐPPPPPPPSŽPQMËÐPP]KÝÐPPPPPPPÍËÐPP”ÝÐPSÎPPPPPPP]‹ÝÐPUTPQÐPPPPPPPSTPQ’ÐPP^ÝÐPPPPPPQÐPP”ËÝÐPS]ŽPPPPPPP^KÝÐPUKÎPQÐPPPPPPPSKÎPQ•ÐPPLÝÐPPPPPPQÐPP•‹ÝÐPS™ŽPPPPPPPLKÝÐPUŽPQ‹ÐPPPPPPPSŽPQ™‹ÐPPLËÝÐPPPPPPQ‹ÐPP–KÝÐPSÔPPPPPPPMÝÐPUÙŽPQ‹ÐPPPPPPPSÙŽPQœ‹ÐPPM‹ÝÐPPPPPPQ‹ÐPPPPQPPPPPPPÙÑPTPPPPPPPTTPPPPPPP\QPPPPPPPRQPTPPPPPPRÙÔPPPPPPPQQPPPPPPPÜÑPTPPPPPPPTPPPPPPP\ÐQPPPPPPPUQPTPPPPPPSTPPPPPPPQÐQPPPPPPPÍPTPPPPPPPÔPPPPPPP]QPPPPPPPYÑPTPPPPPPSPTPPPPPPPRQPPPPPPQQPTPPPPPPPÙÔPPPPPPP^PQPPPPPPP\ÑPTPPPPPPS]ÔPPPPPPPSPQPPPPPPQQPTPPPPPPQTPPPPPPPLPQPPPPPPPMPTPPPPPPS™ÔPPPPPPPTQPPPPPPQÑPTPPPPPPQPTPPPPPPPMQPPPPPPP‘QPTPPPPPPSÔTPPPPPPPTÐQPPPPPPQÑPTPPPPPPQ]ÔPPPPPPPMÐQPPPPPPP”QPTPPPPPPTTPPPPPPPUQPPPPPPQPTPPPPPPQ™ÔPPPPPPPJÐQPPPPPPP˜ÑPTPPPPPPTÔPPPPPPPVPQPPPPPPQPQPTPPPPPPQÔTPPPPPPPQPPPPPPP›ÑPTPPPPPPTYÔPPPPPPPXQPPPPPPQSQPTPPPPPPRTPPPPPPP‘PQPPPPPPPŒPTPPPPPPT”TPPPPPPPYPQPPPPPPQVQPTPPPPPPRÔPPPPPPP’QPPPPPPPÐQPTPPPPPPTÐTPPPPPPPZQPPPPPPQZÑPTPPPPPPRYÔPPPPPPP’ÐQPPPPPPPÓQPTPPPPPPTÝÔPPPPPPPZÐQPPPPPPQ]ÑPTPPPPPPR”TPPPPPPP“QPPPPPPPÖQPTPPPPPPUÔPPPPPPP[QPPPPPPQNPTPPPPPPRÐTPPPQPTPPPPPPPPTPPÚÑPTPPQPPPPPPPQQPTP\PQPPYÔPPPPPPPPÐQPRÝÔPPSQPTPPPPPPP]ÔPPÝÑPTPQPQPPPPPPPTQPTP]QPP”TPPPPPPPQQPSÔPPVQPTPPPPPPP™ÔPPÎPTPRQPPPPPPPXÑPTP]ÐQPPÐTPPPPPPPRPQPSTTPPZÑPTPPPPPPPÔTPQQPTPRÐQPPPPPPP[ÑPTP^QPPÝÔPPPPPPPSQPSTPP]ÑPTPPPPPPQTPQQPTPSQPPPPPPPLPTPLQPQÔPPPPPPPSÐQPSÔPPNPTPPPPPPQÔPQÑPTPTPQPPPPPPPQPTPMPQPQTTPPPPPPPTQPSÙÔPP’QPTPPPPPPQYÔPQÑPTPUQPPPPPPP“QPTPNQPQTPPPPPPPUPQPTTPP•QPTPPPPPPQ”TPQPTPUÐQPPPPPPP–QPTPKÐQPQÔPPPPPPPVQPTPTPP™ÑPTPPPPPPQÐTPQQQPTPVQPPPPPPPšÑPTPÐQPQÙÔPPPPPPPXPQPT]ÔPPœÑPTPPPPPPQÝÔPQTQPTPXÐQPPPPPPPÑPTP‘QPRTPPPPPPPYQPT™ÔPPPTPPPPPPRÔPQXÑPTPYQPPPPPPPŽPTP’PQPRPTPPPPPPPYÐQPTÔTPPÑQPTPPPPPPRTTPQ[ÑPTPZPQPPPPPPPÒQPTP“QPR]ÔPPPPPPPZQPUTPPÔQPTPPPPPPRTPQLPTP[QPPPPPPPÕQPTP“ÐQPR™ÔPPPPPPP[PQPUÔPPØÑPTPPPPPPRÔPSQPTPPPPPPLTPPPPPPPÞQPPPPPPSšÑPTPPPPPP\ÙÔPPPPPPQPQPPPPPPSQPTPPPPPPLÔPPPPPPPÌQPPPPPPSÑPTPPPPPP]TPPPPPPQQPPPPPPSQPTPPPPPPLÙÔPPPPPPPÌÐQPPPPPPSŽPTPPPPPP]PTPPPPPPQÐQPPPPPPSÑPTPPPPPPMTPPPPPPPÍQPPPPPPSÒQPTPPPPPP]]ÔPPPPPPQQPPPPPPSÑPTPPPPPPMPTPPPPPPPÎPQPPPPPPSÕQPTPPPPPP]™ÔPPPPPPQPQPPPPPPSPTPPPPPPM]ÔPPPPPPQPQPPPPPPSÙÑPTPPPPPP]ÔTPPPPPPQQPPPPPPSRQPTPPPPPPM™ÔPPPPPPQQPPPPPPSÜÑPTPPPPPP^TPPPPPPQÐQPPPPPPSUQPTPPPPPPMÔTPPPPPPQÐQPPPPPPSÍPTPPPPPP^ÔPPPPPPQQPPPPPPSYÑPTPPPPPPNTPPPPPPQQPPPPPPTQPTPPPPPP^YÔPPPPPPQPQPPPPPPS\ÑPTPPPPPPNÔPPPPPPQPQPPPPPPTQPTPPPPPP^”TPPPPPPQPQPPPPPPSMPTPPPPPPNYÔPPPPPPQQPPPPPPTÑPTPPPPPPLTPPPPPPQQPPPPPPS‘QPTPPPPPPJÔTPPPPPPQÐQPPPPPPTÑPTPPPPPPLÔPPPPPPQÐQPPPPPPS™ÑPTPÝÐQPPPPPPSQPTQQP\ÔTPPPPPPPÞQPL™ÔPSQPTPPPPPP\ÙÔPSœÑPTPÞQPPPPPPSQPTQÐQP]TPPPPPPPÌQPLÔTPSQPTPPPPPP]TPSPTPÌQPPPPPPSQPTQQP]ÔPPPPPPPÌÐQPMTPSÑPTPPPPPP]PTPSÑQPTPÍPQPPPPPPSÑPTQPQP]YÔPPPPPPPÍQPMÔPSÑPTPPPPPP]]ÔPSÔQPTPÎQPPPPPPSÑPTQQP]”TPPPPPPPÎPQPMYÔPSPTPPPPPP]™ÔPSØÑPTPËÐQPPPPPPSPTQÐQP]ÐTPPPPPPQPQPM”TPSQQPTPPPPPP]ÔTPSÛÑPTQÐQPPPPPPSRQPTQQP]ÝÔPPPPPPQQPMÐTPSTQPTPPPPPP^TPSÌPTQQPPPPPPSUQPTQPQP^ÔPPPPPPQÐQPMÝÔPSXÑPTPPPPPP^ÔPTQPTQPQPPPPPPSYÑPTQQP^TTPPPPPPQQPNÔPS[ÑPTPPPPPP^YÔPTQPTQQPPPPPPS\ÑPTQQP^TPPPPPPQPQPNTTPSLPTPPPPPP^”TPTQPTQÐQPPPPPPSMPTQÐQP^ÔPPPPPPQQPJÐTPSQPTPPPPPPLTPTÑPTQQPPPPPPS‘QPTQQPLÔPPPPPPQÐQPJÝÔPS“QPTPPPPPPLÔPRPSPTPPPPPP]Ð]ÐPPPPPPÐ‘QPPPPPPSQSPTPPPPPPYÙÝÐPPPPPQÑQPPPPPPRSSPTPPPPPP]ÝÝÐPPPPPPÑQQPPPPPPSTSPTPPPPPPZ]ÐPPPPPQ‘QPPPPPPRVSPTPPPPPP^ÝÐPPPPPPÒQPPPPPPSXÓPTPPPPPPZP]ÐPPPPPQQQPPPPPPRZÓPTPPPPPP^T]ÐPPPPPPÒÑQPPPPPPS[ÓPTPPPPPPZ]ÝÐPPPPPQQPPPPPPR]ÓPTPPPPPP^]ÐPPPPPPÓ‘QPPPPPPSLPTPPPPPPZ™ÝÐPPPPPQÑQPPPPPPRNPTPPPPPP^ÝÐPPPPPPÔQQPPPPPPSSPTPPPPPPZÔ]ÐPPPPPQ‘QPPPPPPR’SPTPPPPPPLÝÐPPPPPPÕQPPPPPPS“SPTPPPPPP[]ÐPPPPPQQQPPPPPPR•SPTPPPPPPLT]ÐPPPPPPÕÑQPPPPPPS–SPTPPPPPP[ÝÐPPPPPQQPPPPPPR™ÓPTPPPPPPL]ÐPPPPPPÖ‘QPPPPPPSšÓPTPPPPPP[YÝÐPPPPPQQQPPPPPPRœÓPTPPPPPPLÝÐPPPPPPØÑQPPPPPPSÓPTPPPPPP[”]ÐPPPPPQQPPPPPPRPTPPPPPPLÙÝÐPPPPPPÙ‘QPPPPPPSŽPTPPPPPP[Ð]ÐPPPPPQÑQPPPPPPRÑSPTPPPPPPM]ÐPPPPPPÚQQPPPPPPSÒSPTPPPPPP[ÝÝÐPPPPPQ‘QPPPPPPRÔSPTPPPPPPMP]ÐPPPPPPÛQPPPPPPSÕSPTPPPPPP\ÝÐPPPPPQQQPPPPPPRØÓPTPPPPPPM]ÝÐPPPPPPÛÑQPPPPPPSÙÓPTPPPPPP\T]ÐPPPPPQQPPPPPPRÛÓPTPPPPPPM™ÝÐPPPPPPÜ‘QPPPPPPSÜÓPTPPPPPP\]ÐPPPPPQÑQPPPPPPRÌPTPPPPPPMÔ]ÐPPPPPPÝQQPPPPPPSÍPTPPPPPP\ÝÐPPPPPQ‘QPPPPPPSSPTPPPPPPN]ÐPPPPPPÞQPPPPPPTSPTPPPPPP\ÙÝÐPPPPPQQQPPPPPPSPSPTPÐQQPPPPPPRPSPTQ‘QPYÔ]ÐPPPPPPÐ‘QP]ÙÝÐRRSPTPPPPPPYÙÝÐSSSPTPÑQPPPPPPRSSPTQQQPZ]ÐPPPPPPÑQQP^]ÐRUSPTPPPPPPZ]ÐSVSPTPÑÑQPPPPPPRVSPTQQPZÝÐPPPPPPÒQP^P]ÐRYÓPTPPPPPPZP]ÐSZÓPTPÒ‘QPPPPPPRZÓPTQÑQPZYÝÐPPPPPPÒÑQP^]ÝÐR\ÓPTPPPPPPZ]ÝÐS]ÓPTPÓQQPPPPPPR]ÓPTQ‘QPZ”]ÐPPPPPPÓ‘QP^™ÝÐRMPTPPPPPPZ™ÝÐSNPTPÔQPPPPPPRNPTQQQPZÐ]ÐPPPPPPÔQQPL]ÐR‘SPTPPPPPPZÔ]ÐS’SPTPÔÑQPPPPPPR’SPTQQPZÝÝÐPPPPPPÕQPLP]ÐR”SPTPPPPPP[]ÐS•SPTPÕ‘QPPPPPPR•SPTQÑQP[ÝÐPPPPPPÕÑQPL]ÝÐR˜ÓPTPPPPPP[ÝÐS™ÓPTPÖQQPPPPPPR™ÓPTQ‘QP[T]ÐPPPPPPÖ‘QPL™ÝÐR›ÓPTPPPPPP[YÝÐSœÓPTPØ‘QPPPPPPRœÓPTQÑQP[]ÐPPPPPPØÑQPLÔ]ÐRŒPTPPPPPP[”]ÐSPTPÙQQPPPPPPRPTQ‘QP[ÝÐPPPPPPÙ‘QPM]ÐRÐSPTPPPPPP[Ð]ÐSÑSPTPÚQPPPPPPRÑSPTQQQP[ÙÝÐPPPPPPÚQQPMÝÐRÓSPTPPPPPP[ÝÝÐSÔSPTPÚÑQPPPPPPRÔSPTQQP\]ÐPPPPPPÛQPMYÝÐRÖSPTPPPPPP\ÝÐSØÓPTPÛ‘QPPPPPPRØÓPTQÑQP\P]ÐPPPPPPÛÑQPM”]ÐRÚÓPTPPPPPP\T]ÐSÛÓPTPÜQQPPPPPPRÛÓPTQ‘QP\]ÝÐPPPPPPÜ‘QPMÐ]ÐRÝÓPTPPPPPP\]ÐSÌPTPÝQPPPPPPRÌPTQQQP\™ÝÐPPPPPPÝQQPMÝÝÐRÎPTPPPPPP\ÝÐTSPTPÝÑQPPPPPPSSPTQQP\Ô]ÐPPPPPPÞQPNÝÐSSPTPPPPPP\ÙÝÐRÐVPTPPPPPP]Ð™ÐPPPPPPÚÐQPPPPPPSQVPTPPPPPP[ÚÐPPPPPQÑÐQPPPPPPRÓVPTPPPPPP]ÞÐPPPPPPÚÑÐQPPPPPPSTVPTPPPPPP\™ÐPPPPPQ‘ÐQPPPPPPRÖVPTPPPPPP^ÐPPPPPPÛ‘ÐQPPPPPPSXÖPTPPPPPP\P™ÐPPPPPQQÐQPPPPPPRÚÖPTPPPPPP^T™ÐPPPPPPÜQÐQPPPPPPS[ÖPTPPPPPP\^ÐPPPPPQÐQPPPPPPRÝÖPTPPPPPP^™ÐPPPPPPÝÐQPPPPPPSLPTPPPPPP\šÐPPPPPQÑÐQPPPPPPRÎPTPPPPPP^žÐPPPPPPÝÑÐQPPPPPPSVPTPPPPPP\Ô™ÐPPPPPQ‘ÐQPPPPPPSVPTPPPPPPLÐPPPPPPÞ‘ÐQPPPPPPS“VPTPPPPPP]™ÐPPPPPQQÐQPPPPPPSVPTPPPPPPLT™ÐPPPPPPÌ‘ÐQPPPPPPS–VPTPPPPPP]ÐPPPPPQÐQPPPPPPSÖPTPPPPPPL™ÐPPPPPPÍQÐQPPPPPPSšÖPTPPPPPP]ZÐPPPPPQQÐQPPPPPPSÖPTPPPPPPLžÐPPPPPPÎÐQPPPPPPSÖPTPPPPPP]”™ÐPPPPPQÐQPPPPPPSPTPPPPPPLÚÐPPPPPPËÑÐQPPPPPPSŽPTPPPPPP]Ð™ÐRÐVPTPPPPPP[Ð™ÐSQVPTPÚÐQPPPPPPRÑVPTQÑÐQP[ÚÐPPPPPPÚQÐQP]ÞÐRÓVPTPPPPPP[ÞÐSTVPTPÚÑÐQPPPPPPRÔVPTQ‘ÐQP\™ÐPPPPPPÛÐQP^ÐRÖVPTPPPPPP\ÐSXÖPTPÛ‘ÐQPPPPPPRØÖPTQQÐQP\P™ÐPPPPPPÛÑÐQP^T™ÐRÚÖPTPPPPPP\T™ÐS[ÖPTPÜQÐQPPPPPPRÛÖPTQÐQP\^ÐPPPPPPÜ‘ÐQP^™ÐRÝÖPTPPPPPP\™ÐSLPTPÝÐQPPPPPPRÌPTQÑÐQP\šÐPPPPPPÝQÐQP^žÐRÎPTPPPPPP\žÐSVPTPÝÑÐQPPPPPPSVPTQ‘ÐQP\Ô™ÐPPPPPPÞÐQPLÐSVPTPPPPPP\ÚÐS“VPTPÞ‘ÐQPPPPPPSVPTQQÐQP]™ÐPPPPPPÌÐQPLT™ÐSVPTPPPPPP]™ÐS–VPTPÌ‘ÐQPPPPPPSVPTQÐQP]ÐPPPPPPÌÑÐQPL™ÐSÖPTPPPPPP]P™ÐSšÖPTPÍQÐQPPPPPPSÖPTQQÐQP]ZÐPPPPPPÍ‘ÐQPLžÐSÖPTPPPPPP]^ÐSÖPTPÎÐQPPPPPPSÖPTQÐQP]”™ÐPPPPPPÎQÐQPLÚÐSPTPPPPPP]šÐSŽPTPËÑÐQPPPPPPSPTPX™ÑPPPPPPQÐPTPPPPPPTUÍPPPPPPš™ÑPPPPPPQRPTPPPPPPV[MPPPPPP‘™ÑPPPPPPQÓPTPPPPPPT‘ÍPPPPPPšØ™ÑPPPPPPQUPTPPPPPPV•ÍPPPPPP‘Ø™ÑPPPPPPQÖPTPPPPPPTŒPPPPPP›˜™ÑPPPPPPQZPTPPPPPPXQÍPPPPPP’˜™ÑPPPPPPQÛPTPPPPPPTÛMPPPPPPœX™ÑPPPPPPQ]PTPPPPPPXLPPPPPP“X™ÑPPPPPPQÞPTPPPPPPUÍPPPPPP™ÑPPPPPPQM]PTPPPPPPX›MPPPPPP”™ÑPPPPPPQÎ]PTPPPPPPUQÍPPPPPPØ™ÑPPPPPPQ‘PTPPPPPPXÕÍPPPPPP”Ø™ÑPPPPPPRPTPPPPPPULPPPPPPž˜™ÑPPPPPPQ”PTPPPPPPYÍPPPPPP•˜™ÑPPPPPPRPTPPPPPPU›MPPPPPPŒ˜™ÑPPPPPPQ™PTPPPPPPYPPPPPP–X™ÑPPPPPPRPTPPPPPPUÕÍPPPPPPX™ÑPPPPPPQœPTPPPPPPY[MPPPPPP˜˜™ÑPPPPPPRPTPPPPPPVÍPPPPPPŽ™ÑPPPPPPQŒ]PTPPPPPPY•ÍPPPPPP™X™ÑPPPPPPR]PTPPPPPPVPPPPPP‹Ø™ÑPPPPPPQÐPTPX™ÑPPPPPPQPPTPš™ÑPTUÍPPPPPP˜™ÑPV[MQRPTPPPPPPT[MQÓPTP‘™ÑPPPPPPQSPTPšØ™ÑPT‘ÍPPPPPP‘X™ÑPV•ÍQUPTPPPPPPT•ÍQÖPTP‘Ø™ÑPPPPPPQVPTP›˜™ÑPTŒPPPPPP’™ÑPXQÍQZPTPPPPPPTÑÍQÛPTP’˜™ÑPPPPPPQ[PTPœX™ÑPTÛMPPPPPP’Ø™ÑPXLQ]PTPPPPPPTÌQÞPTP“X™ÑPPPPPPQ^PTP™ÑPUÍPPPPPP“˜™ÑPX›MQM]PTPPPPPPUMQÎ]PTP”™ÑPPPPPPQN]PTPØ™ÑPUQÍPPPPPP”X™ÑPXÕÍQ‘PTPPPPPPUUÍRPTP”Ø™ÑPPPPPPQ’PTPž˜™ÑPULPPPPPP•™ÑPYÍQ”PTPPPPPPU‘ÍRPTP•˜™ÑPPPPPPQ•PTPŒ˜™ÑPU›MPPPPPP•Ø™ÑPYQ™PTPPPPPPUŒRPTP–X™ÑPPPPPPQšPTPX™ÑPUÕÍPPPPPP–˜™ÑPY[MQœPTPPPPPPUÛMRPTP˜˜™ÑPPPPPPQPTPŽ™ÑPVÍPPPPPP˜Ø™ÑPY•ÍQŒ]PTPPPPPPVÍR]PTP™X™ÑPPPPPPQ]PTP‹Ø™ÑPVPPPPPP™˜™ÑPPSÚÐPPPPPPZM”QPPPPPPPRTPPPPPPRJÚÐPPPPPPPÍ”QPPPPPPPÕTPPPPPPPJÚÐPPPPPP[”QPPPPPPPUTPPPPPPRZÐPPPPPPQ”QPPPPPPPÙœTPPPPPPPZÐPPPPPP[Í”QPPPPPPPYœTPPPPPPRÙZÐPPPPPPRM”QPPPPPPPÜœTPPPPPPPÙZÐPPPPPP\”QPPPPPPP\œTPPPPPPSÚÐPPPPPPS”QPPPPPPPÌÜTPPPPPPQÚÐPPPPPP]M”QPPPPPPPLÜTPPPPPPS
ÚÐPPPPPPSÍ”QPPPPPPQTPPPPPPQ
ÚÐPPPPPP^”QPPPPPPP‘TPPPPPPS]ZÐPPPPPPT”QPPPPPPQTPPPPPPQ]ZÐPPPPPPL”QPPPPPPP”TPPPPPPS™ZÐPPPPPPUM”QPPPPPPQœTPPPPPPQ™ZÐPPPPPPLÍ”QPPPPPPP˜œTPPPPPPSÓÚÐPPPPPPV”QPPPPPPQœTPPPPPPQÓÚÐPPPPPPM”QPPPPPPP›œTPPPPPPSÊÚÐPPPPPPXM”QPPPPPPQœTPPPPPPQÊÚÐPPPPPPNM”QPPPPPPPžœTPPPPPPTZÐPPPPPPY”QPPPPPPQÜTPPPPPPRZÐPPPPPPM”QPPPPPPP‹ÜTPPPPPPTYZÐPPPPPPYÍ”QPPPPPPQSTPPPPPPRYZÐPPPPPP‘”QPPPPPPPÓTPPM”QPPPPPPPQTPZ”QPPYZÐPPPPPPP”QPR“ÚÐPSTPPPPPPP]ZÐPÖTPQ”QPPPPPPPTTP[M”QPP“ÚÐPPPPPPQM”QPRŠÚÐPVTPPPPPPP™ZÐPÚœTPQÍ”QPPPPPPPXœTP\”QPPŠÚÐPPPPPPR”QPRÝZÐPZœTPPPPPPPÓÚÐPÝœTPR”QPPPPPPP[œTP\Í”QPPÝZÐPPPPPPRÍ”QPSZÐP]œTPPPPPPPÊÚÐPÍÜTPSM”QPPPPPPP^œTP]”QPQZÐPPPPPPS”QPSSÚÐPMÜTPPPPPPQZÐQTPT”QPPPPPPPKÜTP^M”QPQSÚÐPPPPPPTM”QPSJÚÐP’TPPPPPPQYZÐQTPTÍ”QPPPPPPP“TPLM”QPQJÚÐPPPPPPU”QPSZÐP•TPPPPPPQ“ÚÐQœTPU”QPPPPPPP–TPM”QPQZÐPPPPPPUÍ”QPSÙZÐP™œTPPPPPPQŠÚÐQœTPVM”QPPPPPPPšœTPMÍ”QPQÙZÐPPPPPPV”QPTÚÐPœœTPPPPPPQÝZÐQÜTPX”QPPPPPPPœTPJÍ”QPRÚÐPPPPPPXÍ”QPT
ÚÐPŒÜTPPPPPPRZÐQQTPYM”QPPPPPPPÜTP”QPR
ÚÐPPPPPPY”QPT]ZÐPÑTPPPPPPRSÚÐQTTPZ”QPPPPPPPÒTOOHŠKŠMLÍ‹’UÑšÕÑšV^XQšUÑ™ÍÑÍÑÍÑÍÑšØQÚUÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÖšV‘TšÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐšØQ^ÏHŠKŠM’VQÐ™ÖQÞV‘ÝÙÕ‘ÙÑX‘ÔœØQPVšUÑÔRQTQP–RÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÚÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÑÙÖQÐ™ÖQÐ™ÖQÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÛÑÐÙÖRÐ™ÖQÐÙÛÑÐÙÖRÐÙÖRÐÙÛÑÐ™ÛÒÐÙÛÑÐÙÛÑÐÙÛÒÐ™ÖQÐÙÛÑÐÙÛÑÐÙÖRÐ™ÛÒÐ™ÛÑÐ™ÛÑÐÙÛÑÐÙÛÒÐ™ÛÑÐÙÛÑÐ™ÙÒÐ™ÖQÐÐYÒPÐ[Ò™ÛÒ™ÛÒ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐ™ÛÒ™ÛÑÐÙÛÒÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐ™ÖQÐ™ÖRÐÙÖRÐÙÖQÐÙÖRÐÙÛÒÐ™ÛÑÐÙÖRÐ™ÛÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRP™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐØÒØÒØÒØÒØÒØÒÔšÖ‘ÔXÒØÒØÒØÒžÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖØÒØÖ‘ÔšÖ‘ÔšÖžÒÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÓ‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘LÙÖRÐ™ØÖÙÖPÐYØÑÐ™ÖUÐÙÒPÐYÒV‘Ô[ÕÐÙÛÒÐYÛÐÐÙÛÑÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÐÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRÐ™ÖRÐÙÛÑÐ™ÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐ™ÖQÐÙÖXPÙÖRÐÙÖQÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐšÓ‘L‘]ÓPÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÒPÐžUÑšUÑ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÑšPÐZØ‘ÐRS‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘LÑ–S‘–S‘–SYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐÐYÒPÐ–UÐYÒPÐYÒPÐYÒPÐYÒPTQPTQXQÚÕÑšÕÑšØ‘L‘L‘L‘LÐTRUÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÙÒPÐYÒPÐYÒPÐYÓ‘L‘L‘L‘L‘L‘L‘LÑÍÑÍÑÍÑšUÑ™ÙÒQYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ–RQL‘L‘QX‘L‘LØÓ‘œÓ‘LÐYÓÑÍÑÍÑÍÐÐYÒQÞÒQšUÑšUÑšUÑšUÑšPÐTYÓÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘L‘L‘L‘L‘L‘L‘L‘LYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐL‘L‘L‘LÐRPÐYÒPÐYÒPÐYÒPÐYÒPÑÍÑÍÑÍÑÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐL‘L‘L‘XÒÞUÑ™ØÐÐYÌQÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘LÌ‘L‘L‘XÓ‘LL‘LÐZUÑšUÑšUÑšUÑšUÑ™ÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQLYÒUÐYÙÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒS‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘LÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQ\ÓÐ\ÓÝÌ‘L‘LÝÜÓÝÌÝÙÓ‘L‘LÐYÒPÐYÒPÐYÒPÐL‘šSÑÍÑÍÑÍÑ™ØÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÐÐÐYÒPÐYÒPÐYÐÐYÙÒPYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPÐYÒPÐYÐÐÐRPÐYÙÒPÐYÐÐYÌPÝÜÓL‘RPÐÝÜÐÐYÜÓYÐÐYÒPÐYÒPÐYÜÐÐYÒPÐÐYÐÐÐYÒQLÐYÍÑÍÑÍÑÍPÐ™ÖQPTQPTQÞÒQ™ÌÐYÌÝÒRPÐYÒPÐYÐÐYÒPÐÐYÐÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐRRPÐRRPÐRRPÐRPÑRSÝÜÓ‘RPÐYÒS‘RPÑLYÒPÑRPÐYÒPÐYÒRPÐYÒPYÙÐÐYÒPÐYÒPÑÍÑÍÑÍÑÌÐYÒQ–PÐYÒPÐYÒPÐYÒPÑLYÙÒPÐYÒPÐYÒPÐRRPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPYÙÒPYÙÒPÐYÒPYÒSÐ\ÓÝÌ‘LYÌÝÒSÝÌÐYÙÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐLYÒSÑÍÑÍÑÍÑšÐÐYÒPÐYÒPÐÐL‘L‘RSÝÜÐÐÐYÒPÐYÒPÐYÐÐYÙÒPYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPÐYÒPÐYÐÐÐYÐÐÐYÒPÐYÐÐYÌPÝÌL‘RPÐÝÜÐÐYÜÓRPÐYÒPÐYÒPÑ\ÐÐYÒPÐÐYÐÐÐYÒQLÐYÍÑÍÑÍÑÍÐTQPTQPRPÐYÒPÐYÒPÐYÒSÐRRPÐYÒPÐYÐÐYÒRPÐYÐÐÐYÒPÐRPÐYÙÒPYÙÐÐÐYÐÐYÒRPÐRPÐYÙÒPÐRPÐYÙÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒSÝÌÝÒPÐYÜÓÝÒSÝÜÓYÒRPYÒPÐYÒPÐÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÑÍÑÍÑÍÑTQPœØ‘ÞØ‘ÞØYÒPÐYÒSÝÜÓYÒPÐYÒPÐYÒPYÙÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐÐL‘\ÓÝÜÐÑLYÌ‘LÐYÒPÐYÒPÑLÐÐYÒPYÒPÐYÒRPÐLYÒSÑÍÑÍÑÍÐYÒPÐYÒPÐYÒTQPTQPTQÝÙÓÝÜÕÐÐYÒPÐYÒPÐYÐÐÐYÒPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÐÐYÌPÝÌÝÜÓÝÒSÝÜÐÐÝÜÓ‘RPÐYÒPÐYÒSÝÒPÐYÒPÐYÒRPYÙÒQLÐYÍÑÍÑÍÑÍÐÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÑLÝÒRPÐYÒPÐYÒPÐRRPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘YÓÝÜÓ‘LYÜÓÝÒSÝÜÓÐœÐÐYÒPÐÐYÒPÞTQPTQPRPÐYÓ‘RPÑÍÑÍÑÍÑTQPTQPTQPœÒPÐYÒPÐYÐÐYÜÓYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÐÐÐRPÐÐYÒPÐYÒPÐRPÐYÌÐYÒPÐÝÜÓLYÌÐÝÜÓÝÜÓÝÜÐÐYÒPÐYÒSÑÍÑÍÑÍÐYÒSÞPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÐYÓ‘L‘LYÒPÐZÒPÐYÒPÐYÒL‘L‘LÑÍÑÍÑÍÑUÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPYÙÐÐYÙÒPYÙÐÐYÙÐÐYÒPÐYÒRPÐYÒPYÙÒPÐYÒPÐYÐÐÐYÒPYÙÐÐÐRPÐÐYÐÐÐYÒPÐLPÐL‘L‘RS‘YÐÐYÙÒPÐYÒPYØÐÑL‘LYÒSÑÍÑÍÑÍÐYÒRPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRQÞØ‘šUÑšUÑšUÑšUÑšUÑÞX‘ÞÓ‘œØ‘ÞØ‘ÝÍÑÍÑÍÑÍQPTQPTQPTQÝÌ‘œÓ‘žV]ÜÓÐYÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÌ‘L‘L‘L‘LÝÌ‘L‘™ÌÐYÒPÐYÓ‘L‘L‘L‘RS‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘LÑÞØ‘ÞØ‘ÞÓ‘ÞØ‘ÞØZØ‘šUÑšX‘ÞØ‘šPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ\ÓL‘\Ó‘L‘LLÝÌÐMÑÍÑÍÑÍÑšUÑšRPÐYÒPÐYÓÝÌÐYÒPÐL‘YÓÝÜÒPÐ\ÓÝÜÓÝÜÒPÐYÓ‘LÐYÒPÐYÒPÐYÒPÐYÒPÐLÝÌÝÜÓÝÜÓYÓÍÑÍÑÍÑÜÓÝÌ‘ÝÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐYÛÐÐYÒPÐYÛÐÐYÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖUÐÖQÐ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPÐYÐÐYÙÒPÐYÒPÐYÐÐÐRRPÐYÒPYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐRPÐÐYÒPÐYÒPÐRRPYÙÒPÐYÐÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐRPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÑL‘šUÑšUÑšUÑPTQPTQPTQPTQPTQPTQPPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐYÒQÐ™ÖQÐ™ÖPÐZRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQšRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ˜ÕYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQšUÑÎÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒQLYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘LÑ™ÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐLYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÐÑLÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQLL‘L‘\ÓÝÜÓÝÜÓ\ÓL‘L‘L‘LÑšRšUÑÐYÓYÒSÑÍÑÍÑÍÐYÒPÐYÒPÑPTQPTQPTQPRPÐYÒPÐZUÑšUÑšUÑšUÑLTRSÑÍÑÍÑÍÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐÐYÒPÐYÓ‘YÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÐRPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÌ‘\ÓÝÜÓ‘\ÓÝÒPÐYÒSÝÌÝÜÓÝÜÓ‘LÐYÒPÑÝÒPÐZUÑÍÑÍÑÍÑÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÑÍÑÍÑÍÑPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘\ÓRPÑšRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ\ÓÝÌ‘L‘LÑ\ÓÝÜÓ‘L‘L‘\ÓÝÜÓÝÌ‘L‘L‘LÐYÌÑÍÑÍÑÍÐYÒPÐYÒPÑÍÑÍÑÍÑÒPÐYÒPÐZUÑšUÑšRšUÑšUÐYÒS‘L‘L‘L‘L‘]ÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÌ‘LÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÌ‘LÝÌÝÜÓÝÌÝÙÒPÐYÒPÐYÐÐYÒPÑÍÑÍÑÍÑUÑšUÑšX‘ÞØ‘ÞØ‘ÞØ‘L‘L‘L‘ÞØ‘ÞØ‘ÞØYÒPÑLÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÝÌ‘LÝÌÝÌ‘YÒQÍÑÍÑÍÑÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQ\Ó‘\ÓÝÌLÝÜÐÐYÒPÐYÒPÐZUÑšRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓÝÜÓÝÌ‘L‘LÝÜÓ‘RPÐZUÑšUÑÍÑÍÑÍÑÒPÐYÙÒPÐMÑÍÑÍÑÍPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒØÒØÕÑ™ÖQÐ™ÖQÐ™ÖQÐ™ÒPÐYÒPÐYÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐYÒRÐÙÛÕÑšUÑšUÑ™ÒPÐYÒPÐYÒPÑL‘™Ì‘L‘L‘L‘LL‘L‘YÒPÐYÓÐYÒPÐ\ÓYÒPÝÌYÒPÐYÒPÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒØÒL‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘RS‘L‘[ÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÖQÐ™ÖQÐ™ÖQÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐ™ÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐYÒRÐÙÛÒÐÙÛÐÐYÖQÐ™ÖQÐ™ÖQÐÙÛÒÐÙÛÒÐÙÛÑÐ™ÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐYÒRÐÙÛÒÐÙÛÐÐYÖQÐ™ÖQÐ™ÖQÐYÛÐÐÙÒRÐYÛÑÐ™ÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖPÐYÖQÐ™ÖQÐ™ÖQÐÔZÒÔZÒÔZÑÐ™ÖQÐ™ÖQÐ™ÚÒÔZÒÔZÒ™ÖQÐ™ÖQÐ™ÖRÔZÒÔZÒÔVQÐ™ÖQÐYÖQÐÙÛÒÐÙÚÖšÖ‘ÔVQÐ™ÒQÐ™ÛÒÐÙÛÒ‘ÔšÖ™ÖQÐ™ÒPÐ™ÖRÐÙÛÒÐZÖ‘ÔVQÐ™ÖQÐ™ÖQÐÙÛÒÐÙÛÖ‘ÔšÐÐYÖQÐ™ÒQÐ™ÛÒÐÙÛÒ‘ÔšÐÒRRRTQPT’TÑZTÑZUÑ””V”•UQžUÑšUÑšUÑšÙTQPTQYQšUÑšUÑšUÑ””UÑšUÑT‘UÑšXQžUÑšUÑšUÑšUÑšÕÑT–UÑšUÑšUÑšYPTQPTQPÐTQPTQPTQPTRYÒTQPTQPXQÚÖ]ØÔQPTQPTQPTQÚØQžPÐØÒØÒØÒØÒÒPÐZÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÌ‘L‘L‘L‘LQ]ÓQ]ÓQL‘L‘L‘L‘RPÐYÒPÐYÒPÐYÒPÐYÒPÐZØÚØ‘ÞÒÑÞÑÐÙÛÒÐ™ÖRÐÙÛÑÑÝÛØ‘ÞÒÐÙÛÒÐÚØ‘ÞØ‘ÝÛØÚÒÑÝÛÒÐÙÛØ™ÛÒÐÙÛÑÐÐYÒPÐVX‘ÝÖQÐÙÛØQÚØQÙÛÑÐ™ÖQÑÞØ‘ÝÖX‘PTQPTQPTQPTQPTQPNÎÎÎÎÎÎÎÎÎÎÎÙÖTÎPœØYÒPÐZØQÚØQÞØ‘ÞØQÚØ‘ÞØQÞØQÞØQÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÚØ‘ÞØ‘ÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÞØ‘ÞØ‘ÞÖ^ÕÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØ‘ÞØ‘ÞÖ^Ø‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐZTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPœØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞTQPTQPTQPTQPTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÞØ‘ÞØ‘ÞØ‘ÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQÚØQÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘žV^ÕžV^ÕžTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQžXQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQžV^ÕžV^ØQÚØQÚØQÚØQÚØQÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚÖ^ÕžV^ÕžV^ÕžV^ÕÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQžV^ØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQÚØQžXQÚØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØQÚØQÚØQÚØQÚØQÚØQÚØQÚØ‘ÚØQÚØQÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÒQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÒRÐ™ÛÒÐÙÖQÐÙÖRÐ™ÛÑÐÙÛÒÐÙÖRÐ™ÖRÐ™ÖQÐ™ÖQÐØÒÐÙÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÑÞØ‘ÞØÙÖRÐ™Ì‘[ÑÐYÒPÐYÒUÑšUÑP–UÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖPÐ™ÒPÐYÒPÐ™ÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐžPÐYÒPÐYÒPÐYÒPÐYÒPÐYÌPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐRRPÐYÒPÐYÒPYÙÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐRRPÐYÒPÐYÒPYÙÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐRS‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘–UÑ””U‘–UÑšUQšUQšUÑšUÑšUÑZUÑZU‘–UÑ””V^ÕžV^UÑšUÐžUÑšUÑšUÑšTÑZUÑšTÑšÕÑšUÑšUÑšUÑšPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÒUÑšÒÐN^ÕžV^ÕÞÖ^ÕžV^V^X‘ÎÎÎL‘\ÓYØÒØÒÞÔÎÐ–X‘ÝÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÑL‘ÔXÒÐ’RPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÕÐØÒÐRPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPZØ‘PTQPœØ‘ÞØ‘ÞØ‘ÞÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØZTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÔQPTQPTQPœÔQPTQPTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÔQPTQPTQPTQPTQPX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒØÒØÕÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐXÕÑšRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQÍÑÍÑÍÑÙÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÐLQ]ÕÑL‘L‘L‘–RÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ØÒLPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQÎÎÎÌ‘šUÑšUÐYÒPÐYÒPÐYÒV‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔXÒØÒØÒžÖÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖQÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÖQÐ™ÖQÐ™ÖQÐÙÖRÐ™ÛÒÐ™ÛÑÐÙÖRÐ™ÛÑÐžÖÙÖRÐ™ÙÒÐ™ÛÑÐ™ÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÑÐÙÖRÐ™ÛÒÐÙÛÒÐ™ÛÒÐÙÛÒÐ™ÛÑÐÙÖPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐXÒ™ÙÒPÐYÒPÐYÓÐYÒQYÒPÐYÓÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÌÞØ‘ÞÐÐYÒPÑPTQPTQÞÖQÝÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÕÑšUÐYÒPÐYÒPÐYÒSÝÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÌYÒPÐYÒPÐYÒUÑ™ÍÑÍÑÍÑÍÐYÒPÐYÒS‘L‘L‘L‘L‘L‘LPÐYÒPÐYÕÑšRQ™ÙÒQMÑÍÑÍÑÍPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘L‘LÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘L‘L‘LÝÒPÐYÒPÐYÒPÐYÒPÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÑLÝÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQ\ÓL‘\Ó\ÓÝÜÕÑšUÑšUÑšUÑšUÐYØÓÑÍÑÍÑÍÐYÒPÐZUÐÐYÒPÐYÓÙÒPÐYÒPÐYÒPÐMÑÍÑÍÑÍPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐL‘L‘\ÓLÝÌYÒPÐYÒPÐYÒPÐÐYÒQYÒPÐYÒPÐYÒQ\ÐÐYÍÑÍÑÍÑÍÐZUÑšRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÙÒPÐYÒPÐœØ‘ÝÙÓ\ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐLQLÐYÓ‘YÒPÐYÒQLQYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐXÕÑ™ÙÒPÐYÒPÐYÒPÐYÒPÝÌÝÜÕÑ™ÙÒÜÓYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐRPÐÐYÒPÐYÒPYÒRPÐYÒPÐYÐÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPYÙÒPÐYÒPÐYÐÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐšÒØÒ™ÖQÐ™ÖQÐYÒPÐYÒPÐYÒPÐYÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÌÝÌÞSRPÑÍÑÍÑÍÑÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQ]ÓQÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÖQÐ™ÖQÐ™ÖPÐYÒPÐYÒPÐYÒPÐYÒQÐ™ÖQÐ™ÒPÐYÒPÐÐLPÐYÒPÐYÒPÐYÒQÙÙÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÐÐÐRRPÐRRPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖ‘ÔšÖYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ“VYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÖQÝÒPÑL‘L‘L‘L‘L‘–UÑšUÑšV^PÐYÒPÐYÒS‘L‘L‘L‘L‘L‘šTÑT‘V^ÕžV^ÕžV^ÕšV^UÑšT‘T‘UÑšPÑšUÑšV^ÕžUÑšXQZØQÙÒUÑÐ–UÐYÒPÐYÙÒPÐYÒPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐTRUÑšVQšUÑžUÑÚTÑšSÑÍÑÍÑÍÑšXQÚÕÑ™ÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÑžUÔ‘V™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖVÚXQžUÑžUÑ™ÙÒPÐYÒPÐYÒPÐYÒÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPØÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐÐYÒPÐYÒPYÒRPÐYÒPÐYÐÐYÙÒPÐYÒPÐRPÐÐYÒPYÒPÑÐ™ØQÔœÖQÐRX‘ÚØQÚØYÒPÐYÒPÐYÒPÐYÑPTœØYÒRPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÑšUÐYÒPÐZTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPRPÐZØ‘ÞØ‘ÞØ‘ÝÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎPTQPœØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘PX‘ÞÐÑÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐZÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÌÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑTQPTQPTQPTQPTQPTQPTQPTQPTQPRPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐTQPPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐNPÐYÒPÐYÒPÐNÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘LÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRUÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÙÒPÐYÒPÐYÒQ™ÎÎYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÍÑÍÑÍÑÍÐYÒPÐYÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÐÐYÒPÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐZPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPYÒRPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPYÒPÐÐRPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÑšTQPTQPTPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYØ‘ÞTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒTQPTQPTQPPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPYÒPÐYÒTQPTQPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÔQPTQPPÐYÒUÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐZPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÑPRPÐTQPTQPTQPTQPTQPPÐZTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPRQLYÌYÒPÐYÒS‘LÐYÒPÐRRPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÌ‘RPÐYÒS‘PTQPTQPTPYÒPÐYÒPÐZUÑšUÑšUÑ™ÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐTQ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQPTPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐœÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQLÐYÒPÑPTQPUÑšUÑšUÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÑšUÑšUÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐZTQPTQPTPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÑPTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÑšUÑ™ÒPÐYÒPÐYÒPÐYÒPÐZTQPTQPPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐYÒPÐYÒPÐYÒPÐYÒPÐYÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÒPÐYÒPÐYÒTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘LYÒPÐYÒPÐYÒSÑÍÑÍÑÍÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQPTQPTQPTQPYÐÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓ‘L‘L‘L‘TQPUÑšUÑ™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒS\ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐL‘L‘L‘L‘L‘–UÑšUÑšPÐYÒPÑPTQPTQPTQPTQPTQPTQPSÑÍÑÍÑÍÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑLÝÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ\ÓÝÌ‘LÝÌ‘šP‘šUÑ™ÒPÐYÒPÐYÒPÐYÒPÐTRPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒSÑÍÑÍÑÍÐYÒPÐYÒPÑLÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘LL‘L‘LÑÍÑÍÑÍÑUÑšRPÝÜÐÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐLÑ™ÙÐÐYÒPÐYÒPÐYÒS‘\ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓ‘L‘L‘LÝÙÒPÐYÕÑšUÑL‘–PÐYÍÑÍÑÍÑÍQ™ÙÕÑšPÑPTQPTQPTQPTQPTQPTQPPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÝÜÓLÝÜÓÝÌ‘šUÑšUÑRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐRRPYÙÒPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPÐYÒPÐYÒPÐYÕÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓL‘L‘LÐYÒPÐYÍÑÍÑÍÑÍÐYÒPÐYÒS‘\ÓYÙÒPÐYÒPÐYÒPYÒRPÐRPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPYÙÒPYÙÒPÐYÒPYÌÐ\Ó\ÓÝÜÐÐYÜÓYÒSÝÜÐÐYÙÐÐYÒPÐYÒSYÒPÐYÒRPÐYÒPÐ\ÓYÒS‘L‘LYÒPÑL‘LÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓ‘L‘L‘\ÓLÝÌPÐYÒQšUÑšSÑÍÑÍÑÍÐZPÑ™ÌÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓ‘L‘L\ÓÝÜÓ‘\Ó‘YÒQ™ÙÐÐYÒPÐYÒPÐYÍÑÍÑÍÑÍÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓ‘LYÒSÝÜÓLLÑšUÑšUÑšUÑšUÑšUÑšUÑšUÑ™ÙÒPÐYÓ‘RPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓ‘L‘L‘\Ó\Ó‘–UÑ™ÙÐÐYÒPÐYÒPÐYÒPÐYÍÑÍÑÍÑÍÐYÒPÐYÒUÑšUÑšUÑšUÑšUÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÌÝÌ‘L‘\ÓYÒPÐYÒPÐYÒSÑÍÑÍÑÍÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒS‘LÝÌ‘LL‘LÐYÒPÑÍÑÍÑÍÑTQšUÑÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÝÜÓL‘L‘LÝÌ‘™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÑÍÑÍÑÍÑTQPTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÙÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐL‘L‘L‘LPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘LÝÙÓ‘L‘šUÑšUÑšSYÒPÐYÒPÐYÒRQL‘LÝÜÓ‘LPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒRPÐYÒQL‘L‘L‘L‘\Ó‘–UÑ™ÙÕÑšUÑ™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÝÌ‘L‘LÑL‘LÝÌQšUÑšPÐYÒPÐYÒPÐYÒPÑÍÑÍÑÍÑTQPTQPTQPTQPTQPTQPPÐYÒUÑ™ÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÑL‘L‘L‘L‘L‘L‘L‘RSL‘L‘\Ó‘\Ó‘RPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPYÙÒPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQL‘LYÒPÑRS‘RS‘L‘LÐLÐYÒPÐYÒPÐYÍÑÍÑÍÑÍÐYÒPÐYÒRPÐYÒPÐYÐÐÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÓÝÜÓÝÒS‘RSÝÌYÐÐYÒPÐYÒPÑÍÑÍÑÍÑÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒQLÞUÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒTÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÎÑšUÑšPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÑÍÑÍÑÍÑÒPÐYÒUÑ™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÑL‘LÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐL‘L‘LÑšUÑšØ‘ÞÒØÒšÐÐYÒPÐYÒPÐYÒPÑÍÑÍÑÍÑÒTQPTQPTPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐšTQPTQPTQPTQPTQPTQPTQPTQšUÑ™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒRPÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÜÓÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒS‘LØÒØÒØÒØÒÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÙÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPYÒX‘LÐTQPTRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØÝÜÓ‘L‘ÞÓÝÜÓÝÜÐTQPTQPTL‘L‘L‘ÞÓ‘L‘L‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘L‘œØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÓ‘LYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐZTQPTQPTQPTQPTQPTQPTPYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÑPTQPTQPTQPTQPTQPTQPTQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖPÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÛÐÐÙÛÐÐYÛÐÐYÛÒÐYÒRÐÙÛÒÐYÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÒQÐYÖQÐ™ÖQÐ™ÖPÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÙÛÐÐÙÛÒÐÙÒPÐÙÛÒÐÙÛÒÐÙÛÐÐÙÛÒÐÙÛÒÐÙÒQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÛÒÐYÛÒÐÙÛÐÐÙÛÒÐÙÛÐÐÙÒPÐYÛÒÐÙÛÒÐÙÛÐÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÒPÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÚÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÑÙÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛØP™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐšÑÐ™ÖQÐ™ÖRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÑÙÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖXP™ÖQÐ™ÖQÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÚÑÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÑÙÖQÐ™ÖQÐ™ÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛØP™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐšÑÐ™ÖQÐ™ÖRÐ™ÒPÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍÑÍ‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘ÞØ‘ÝÌ‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘ÞØ‘ÞØ‘ÞÓ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÓ‘ÞÕÑšUÑ™ÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÌ‘LYÌ‘L‘L‘L‘L‘RPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑL‘L‘RS‘L‘L‘L‘L‘L‘RPÑL‘L‘RS‘RS‘L‘RPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒTQPTQPTQPS‘L‘LYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐÙÛÒÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™ÖQÐ™Ì‘L‘LÐYÒPÐYÍÑÍÑÍÑÍÐYÒPÑšPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPœÔQPVQPTQPRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÐÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÙÒPYÙÐÐYÙÐÐÐYÒPÐYÒPÐYÒPÐRRPÐYÒPYÙÐÐÐRPÐYÒPÐYÙÐÐYÒPÐÐRRPYÙÐÐÐYÒPYÙÒPYÙÐÐYÙÐÐÐRRPYÙÐÐÐRRPÐRRPYÒRPÐYÒPYÙÒPÐYÒPÐYÐÐÐYÒPÐRRPÐYÒPYÙÐÐÐYÒPÐYÒPÐYÒPÐRRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐÐYÒPYÙÒPÐYÒPYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐZØPYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐYÒPÑPTQPTQPTQPTQPRPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒX‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÑÞÐÐYÒPÐYÒPÐYÒPÐYÒPÐZØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÖ‘ÔšÖ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÑÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞÐÐZØ‘ÞÐÐYÒXZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒX‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÑÞØYÒPÐYÒPÐYÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÞØ‘ÝÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐZØ‘ÞØ‘ÞØ‘ÞØ‘ÞØYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÐÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÙÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐTRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÑPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTRPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐYÒPÑL‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘L‘LYÒPÐYÒPÐYÒPÐYÒPÐYÒPÐ[ÐPPPPPPPPPYÐPPPPPPPPPÐPPPPPPPPPRPPPPPPPPPPYÐPPPPPPPPPÐPPPPPPPPPRPPPPPPPPPPYÐPPPPPPPPPÐPPPPPPPPPRPOHŠKŠMŽ™ÙÐPPPPPPPRPPPPPPPPPPYÐPPPPPPPPPÈŠKŠMÍKYÐPPPPPPPÐPPPPPPPPPRPOOHŠKŠML‹’POOHŠKŠMLŒ‹’PPPPPPPPPPYÈŠKŠMŒN’POOHŠKŠMŒÍ’POOHŠKŠML’PPPPPPPPPPYÈŠKŠMŽ‹’PPPPPPPPPPYÐPPPPPPPPPÐPPPPPPRPPPPPPPPPPYÐOOHŠKŠMÌŽ™ÐPPPPPPPPPÐPPPPPPPPPRPOHŠKŠMÍŒ™ÐPPPPPPPPPÐHŠKŠNL™ÐPPPPPPPPPÐPPPPPPPPPRPPPPPPPPPPYÐPPPPPPPPPÐPPPPPPPPPPPUHŠKŠNMŒK‘PPPPPPPPPUHŠKŠNNK‘PPPPPPPPPQHŠKŠŒKPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOHŠKŠŒMË‘PPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOHŠKŠŒMŽK‘PPPPPPPPPPTPPPPPPPPPPPPPPPPPPÐHŠKŠŒŒ™ÐPPPPPPPPPÐHŠKŠŒÌ‹™ÐPPPPPPPPPÐPPPPPPPPPRPPPPPPPPPPYÐPPPPPPPPPÐPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOOHŠKŠŒÍLËPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOOHŠKŠŒÎLËPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPTPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOOHŠKŠŒKPPPPPPPPPQHŠKŠKPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPTPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOOHŠKŠÌÌËPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPOOHŠKŠÌMËPPPPPPPPPQHŠKŠÌLŒKPPPPPPPPPQPPPPPPPPPPTPPPPPPPPPPPPPPPPPPPQPPPPPPPPTPPPQPPPPPQPPPTPPPPYÑPPPPPPPPTTPPPPPPPPPÐPPPPPPPPYÑPPPPPPPPPPTPPPPPPPPPPPPPTPPPPYÑPPPPPPPPPTTPPPPPPPPPTPPPPPPPPPQPPPPPPPPPPTPOOHŠKŠÌŽ”POOHŠKŠÌÌËZÐPPPPPPPPTTPPPQPPPPRPPPPPPPPPPÑPOHŠKŠÌÍL‹”PPPPPPPPPPPPTPPPPYÐPYÈŠKŠÌÍÎK™ÐPPPPPPPPÔYÙÐPRQPPPRPPPPPPPPPYÐPPPPPPPPÔYÙÐPRQPPPRÐÐPPYÐPPPYÐPPPPPPPPPÐPPPPPPPPPRPPPPPPTPPPZÒRPPPÐPPPÔYÙÐPRQPPPRÐÐPPYÔPPPZÐPPPQPPPPÔPPPPVQPPPRÐÐPP™ÔPPPZÒRPPPÐPPPÔYÙÐPRQPPPRÐÐPPYÔPPPZÒRPPPÐPPPÔYÙÐPRPPPPRPPPPPQPPPPPPPPPRPPPPPPPPPPPÐPPPPPPPPPQPPPPPPPPPPÐPPPPPPPPPTPPPPPPPPPPÐPPPPPPPPPRPPPPPPPPPPPZÐPPPPPPPPTTPPPQPPPPRPPPPPPPPPP‘PPPPPPPPPRPPPPYÒRPPPPPPPPÐYÐPPPPPPPRPPPPPPPPPPYÒVPPPPPPPPÐZÐPPPPPPRPÐPPPPPPPPYÒPPPPPPPPPÐYÙÐPPPPPPRPÐPPPPPPPPYÒPPPPPPPPPÐYÐPPPPPPPRPÐPPPPPPPPYÒ’PPPPÐPPPÐYÙÐPPRPPPRPÐÐPPPPPPPYÒRPPPPPPPPÐYÙÐPPRPPPRPÐÐPPPPPPPYÒRPPPPPPPPÐYÙÐPPPPPPRPÐPPPPPPPPYÒPPPPPPPPPÐYÙÐPPPPPPRPÑÐPPPPPPPYÒRPPPPPPPPÐZÐPPPPPPRPÐÐPPPPPPPYÒRPPPPPPPPÐYÙÐPPPPPPRPÐÐPPPPPPPYÒPPPPPPPPPÐYÙÐPPPPPPRPÐPPPPPPPPYÒRPPPPPPPPÐYÙÐPPPPPPRPÐÐPPPPPPPYÒPPPPPPPPPÐYÙÐPPPPPPRPÑÐPPPPPPPYÒ’PPPPPPPPÐZÐPPPPPPRPÐPPPPPPPPYÒPPPPPPPPPÐZÏOHŠKŠÎNNK’PPPPPPÐÐPPYÐPPPPRRPPPPPPPPPYÙÐPPPPPPPPÑÐPPPPPPPPRRPPPPPPPPPYÙÐPPPPPPPPÐÐPPPXUÍ[XUÍ\ÐSÜÙÒPÐ]ÕÑRŒ‘Í–[QšÖ“šÌÔPR–[^Už–”œLÔPR–[^Už’•Ó[ÞUžPÕž’•Óž˜ŒÕV‘Û˜Œ^’•Ó[ÝÐ‘ŒŒ]ØUÞQÕžXÛN^PRŒ‘Í––––ŒUÎ]PR›ÛL\›QŒUÍ[QŽØ‘ÑVÐŒX›UÑÕš™ÕšÖš›TœÖ–YÙÍ[R›LÔ›‘ÞRR›žX›UšÐPÕšÒPÕšÒPÕšÒPÕšÒPÕšÒPÕšÒPÕšÒPÕšÒPÕšÒPÕšÐPÕž’•Ó[]ÐžVYÐØQÎ]YÑšPRŒÖTP–UÑšUÑ™ÐTŒUPQ^“UP‘•LP‘”U]”‘Q•TUŽTTU”’PQSPTUMUÕŽVS^MMSš™ÐS^M“]ÐPÑ]P”Y›RœÛ”ŒVUÝÙÖ›•VLÔœŒÖL‘œØ‘ÕšÒTP[ÝÛÐV–Ö•Ñœ“ÚPÖUÔYØUÍLŒZÛ˜šPšÖVšÙÐPPTRQPÓQÐ”PPPPPPPPPPPPPPR›ØŒ\›T›PP[ÞUš’•Ó[ÝÐYÒ–PXÌÔšÓÚœVUÔ™––––ŒUÎ]PQUÌ“žXVŒ•ÍX›QPQM•ÝÐR–]“M˜ÑÚ˜ŒÕžVL•PXÌÔšÓÚœVUÔ™™Ö•ÛÐR›ÛL\›QŒ•Ž[ÖUÍZØ‘ÕžRRV–Ö•ÓŒ•ÔœÙTÐžV–ŒXÛM[P[Ð[Ð[Ð[Ð[Ð[Ð[Ð[PžVYÐ–ÛN]VžPŒ––ž˜UÎ]RQÎ[RQÕž˜ÑÕš^L]VžLZÖVšQZÐUQ“ÔÐ’UQQQ“ÕL•Ñ]SÌÕÌPÚYÞÒÔP‘ÖUÛÖ•ÔYÙÎØŒÐ›š›ÙÒžUž’Ð‘V•ÞÕšÒRœÛ”ŒVUÝÙÖ›•VLÔœŒÖL‘œØ‘ÕšÒTPYÌZV–ž“ÚPÖUÔYØŒÐŒUÎ]RQÍLX•Ò›ÚP[[ÐV“šÐP›–š˜Û[ÙÕPQ”›Ö”Ð‘ÔÕV”QÒŒV›V›ÚPœÞP›YÞÐQÕž˜ÑÕš]Ð[Ð[Ð[Pž™ÔM“ÛRš‘ŽZ‘Þ–]Ð[^Už’•Ó[ÞUšR›ØŒZÖVšPÎLXÌÒ]˜ÌšÛU]––Ö•Ñœ“Í[“ÔšÑPSÔÐÎ[ÌÐ›UÝUÑšUÑ™ÐUP”UL”ÔÑ”’•›••R‘ÐQQ•NžMQS]U•”‘ÓÐRPÙÐR–M’QRšÐ˜ÒœŒØ›•[UžRPÕšÐÙÐ•˜›“ŒXÒ˜Û”›Ðž˜ÑÕš™šÐ›XUÞQÖ˜ÛLZÍÐQSššYR›UÔYÖ‘Û™Û˜›QžYTÐ›XUÞÚP[’–[ÙÐ]Q™Ü“Q™ÙÓQ™ÝRÜ“RÙÓRÐXUÍLŒZÛ˜›“PXÑÚ˜›U–PR–YÒ–YÒ–YÒ–YÒ–YÒ–PV•ÍV[QšÖ‘žXÛQV[N\Ö•Í[™ÙÐX›N]V”P•XQÕYÖ–Ö•Ñœ“Í[’QÞ[’šÛšÙØQÑž’QÍ]™ÐšV•ÕRQÛXVœUÞ[UšÐPÕš’•ÔPUQNUÕ™ÐUP‘•TšLQU‘Q]ULPÓ^QUÒRQŽZØUÓŒQÖœ‘ÕM’PØÛÝÛÐU[UØ‘Ñš–•ÙÒ–YÔP[ÝÛÐRPÐž™Ö›XVÙÕÞUž–[ÒÐPÕž“Ð›ØŒ[•ÕžPÕž’–[ÝÐšXÐPš‘ÝÐXUÍ[PQSš›M]™Ðœ›[UÑœØVR›Ö”ÐšÔœžPšÖ–œL•PR–[LÖ˜UÓ›ÞUšQMU“UP‘”LP“^ÐP••‘V]ÐPŒÖV^’PV–Ö•Ñœ“ÚP“ØžP››–›‘Î]Ö”[ÐT[QšÒQÔšÑM’PØÛÞXÙÒÐÕQÞ›YQPÚÒÐQ”›Ö”Ðž˜ÑÕš˜UÖœ•ÔYÖ–Ö•Ñœ“Í[’R˜UÓ›QÔ––YØ›NLQÕVŒPÕž’–PR–[^UžQŽZ–VPV[ZPR˜•ÕPUÝÒ[ÌLYQPTÕMQÐQU“UT™“ÕMQÕVU••TšLQŽ’•ÔYÐQS˜–œ‘ÛVžPØQÎ]V•Ì[QÔšÑM’PÕžÙÐ‘ÙÞÒQÔœLÔœŒZÛšÙØVYØ›NLQÛXÌÔš‘ÞÐ›XŒÒYÒžUž’ÛÐU•Í\˜›NLØšPŒÍ[PØÛÞXÒÐPÕLV‘ÒQÔŒQÍ]QÕPQÍZ™Ð™˜ÛN]UÍTLŽLX‘ÔYØ›NLQÞ–UÔYÙÚQÌZXÛN\ÖTÍZØ‘ÝÙÖ›[Ö”P[Ð[P[ÞUš˜‘ÑVžUšRšPQœÐÖMY’–YÒ–YÖMY’–™P•QŽÔTP’”ZÌ“š˜ÐTUšÒPP[ÞUš’–PR–]’–PXÙÐœLŽ]PQÕPQS™ÞÒQÍ]™ÐœØŒ‘šÒR›Ö”Ðž˜ÑÕš˜UÖœ•ÔYØ•ÒžXŒžR˜UÓ›QÖœ‘ÕPVŒ“PUÙÐ“ÔUMVŽÐQ–VÝVYØUÍL–ØÛUŒÑž”ÒŒM–LšÚRJÒšS[‘ÎÓšTÌZÞTÕR““ÑMPPÛÙÐPÐYÒ•ÔYÒ–YÒPÐYÐQ[YQœØUÔYØUÍ^™ŒVLÔœŒÒ”ÍPÐ›XŒÒYØÑÚ˜›U”Ð[’–[ÙÐPXÑÚ˜›TšÑ]•ÑXUÖ›ÌÔPU‘ÚQÕŒ–•ÍLQÒŒV›V›ÚPœÞP›YÞÐRÖ•ÞØUÍ[QŽ\ØUØÐVLŽ]V›[PÕž“•ž˜ÑÕš^L]VžLZÖVšPÕž’–™Q[LQÚQÝÛ––PPÍSP[Ò–\PQ[‘ZÙÐPÕRÐR–žYÞÞMLRPRÞUžRPVM]ÐRœÓ›ÐQ”›Ö”ÐžV–ŒV–Œ•ÔYÖ›•VLÔœŒZ‘ÛTÐ›ÖVYØ›NLQÒ›•ÍÖ[•œ’YØUÍLžP›ÌÐ›UÜÝ›XÐVÓ]Ð‘]ÐYÐ’•LY“š”L“[Y›ÞÕÞRYÔÙNLÖ•Þ–LŽLX›”PU‘ÚR›ØŒ[•ÕYÖ›[Ö”ÐœÞPXŒÔYØUÍÖTÐž™ØŒÒŒ•ÔYÖ›N^X•ÑŒQÓ›ÖVšLÔ›Û“PR•Ó[ÞUž’–PRPÕžQŽLPV•ÍTL–PX›TPR–YÒ•ÔPTÕ“”™Í•ÝTPZ’Q”›ØVYÖ›[Ö”ÐœØVŒÞPŒQÕYÙÖ”Ð–šPšÖVšR›ÖVYØQÑž’QÒ›•ÍÖLŽ]ÑÛÖ•ÔYØUÍLžPŒQÕRÒ^PØQÎ]V‘ÑŒTÐ›XUÞÚSRÒ^P•XQÕYÖ›[XÌÔYÖLšÛQš™ÕžRQÎ[RQÑYØ‘ÛV”Ðœ›TœL‘Œ–YÙÚRXÑÕYØŒ–YÖ‘ÑŒUÒÒ^PYÒQ“YÓÐ’Q“”T•S•VS‘•TÐž™ŒVLÔŒXÛURÒ^PYÒQ˜ÙÓÐ’RU›XUÞR›ŒŒ[›”RÒ^PYÒQUYÓÐ˜šP››–›‘Î]Ö”[ÚÚSYÔUÔšØÛUž˜ÞPœÞPŒQÕYÖ‘Û˜ÑÞL••ÍLRÚšPØQÎ]V‘ÑŒTÐ–šPŒQÛ’QÛ•ÌÒ]ÛÚ’PÐ–‘ÔžV–ž’PÐ‘VVšQÖœ‘ÕRÒ^PYÓÌÌÐYÓÌÌÌÙÐ™˜ÛUŒRšÛ[›”PR–žYÞÝÐŒM–LšÙÐž˜ŒÕV‘Û˜ŒTLV•œÐQÍ[RžV^N\ØUÒ›ÌÐ›UÜÝ›XÝ–‘Û™Û˜›QžYTÍZQŽ^™ÒPXÑÚ˜›TšÑPU‘ÚRÖ•ÓŒÛQœÒQÖœ‘ÕYÖ‘Î[ÞPXŒÔYÖLŽ]YÑœšPš›šÙÖ›’š•ÕYÖ‘ÑŒTPP’Þ‘]Õ]Ð’•LY“ÑÌSÔÌÚ‘MSÑÐYž“Û]TP[ÞUš’–™–‘Û™PŒÝÐ•XQÕYØÑÚ˜›U”ÐUÍ\›Už™Ð›XUÞQÔ––YØ›NLQÓ˜›”šUÍÖUÍMRR›ØŒ[•ÕžQŽ^P[ÝÐ™–LÛPQŽ^™PTLŽV“žXPŒÖYÐYÐTÌQ“PTÕ“”™Í•ÝYÐ]Q•XÒ˜›NLX›Sš[^P[’–[ÙÐ™˜RÐXÑÚ˜›[V‘ÕQŽZLÕPYž“ÛTœŒ›ÝÐ‘ÝÐYÒ–YÒ•ÔYÒ–PRŒ•M˜YÐšÑÎ^™˜ÑÚQ”›Ö”ÐØQÎ]V•Ì[QÖ›VŒXÛUYØVYØ›NLR›LŽ[˜›[–•ÔPYQPTÕ“”™Í•ÝZ›ÞÕÌÐRRÝÐ•XÛQXÌžÕYÒžUž’ÛÐV’žYÐšXÛQš˜L•ŒÝÐ[L•PQ[R›‘ÕØQÎ]V”P™˜QÕPU‘ÚR›RYÖ•ÍZ˜Œ”œ›XÙØVYØ›NLRŒXÒ˜Û”›P[Ð[PØQÎ]YÑšPQœÐÒÑ™ÞÔÚSTÚÛÕÑ\ŒXšÑPVZYÙÐ’•LY“ÑÌSÔÌQ•ž˜UÍ[’R›ØŒ[•ÕŒUÒœÖ•ÙÒžUž’ÛÐU•Í^˜ÑÕš˜UÖœ•ÔYÖ–žXŒÒYÓRÛPPžXŒŽLÝÐ›˜’ØRPR•Ó[ÝÐ™–VPUÝÐR–]–LŽ]ÑÛÖ•Ž]ØÛN[–ž–ÐšXÛQš˜L•ŒÌX›NLX›S›P[P™˜QÑšQŽYVÐž’ŒšÍQ[NÑMSM“UÍÐPœØVŒQÔœLÔ™˜•ÛPQÕPQ^RÝ•š]ÐšVV›QŽZ–•ÔPVÓV]ÐšÒŒšÍQ[NÑMSPT[QšÒR˜UÓ›QÑŒœ[•Œ•ÙÒ–RÐQUžXÛN^RRžXŒ“›ÌÓœ›XÙÖ›[Ö”Ð[’–[“ÚP[ÞMÐQÞÌÔQÔœLÔžYÞÝÐ™–L›PQ^RUÜÐVšPÙÙÐ’•LY“ÑÌSÔÌÚ‘MSÑÐR–YÐQ[YQœØUÔYØÑÚ˜›U”Ðš˜Œ”›PÕšÐÙÐRÕ[U›XÞP[ÝÙÒQ’››Ð[[ÐT–žXŒÒM’PÕž’QÑŒPØÛÞXÙÒÑÕÑÕš™ÕšÒQ–ÜÒQÙ™Ð]ÙPÕÔÍÐQ•XL]™ØÑÚ˜›U”ÐŒUÒœÖ•ÙÒžUž’ÛÐUPR•Ó[ÝÐœ›”˜›QŒUÎ]PQŽZX™Ð•ÔœÌV•Ì]˜[ZÐRŒ•›PQŽZØUÑPTÕ“”™Í•Ý”P”Ö–œÖUÓ›ÚP[ÞPYÒ–RÐQS˜–œ‘ÕšÒR›ØŒ[•Õž“ÚP[Ð›Û’˜Û“]PÙÐ‘˜Û’˜Ú›ÙÒ–]PÙÐ›ØÌÙÐUPR–]“M˜ÑÚ˜ŒÕžVL•]˜UÍLŒZÛ˜šMLRPX‘ŽZØUÕžV–œÝÐ[Þ\ÛÝÐ™–ŒÕžPQÛ˜™Ðž™˜›XÐV–ÛQPTÕ“”™Í•Ý•ÞÕÍQŽZ^’PX‘Ž]ØÛU›XVÐV™PQŽZØŒÔPR–[LÖ˜UÓ›ÝÐžPRÝÌÔžXŒ[QLZQ[NÑMSPTLŽ]ÑÛØUÍ[“ÚP[’–[ÙÐ™–ŒÒŒQÞ˜ÛU›˜ÛUž˜Ì›–•ŽLRžQŽ]˜ÙÐ[ÞNSN]ØR™š–”Î\›”˜›QŒUÎ]PPÕž’•ÓœÖUÍ[QL[R›’š–•ÔPTÕ“”™Í•Ýš›ÞÕÌÐPÔ^QÛPQŽ]LUÍX•ÎZÖ–šÕPYV”PœÖÕXÒ˜›NLX›Sš[^QŽLTP’•LY“ÑÌSÔÌÐPÔ^PQÌZSÐ[ÞN\›”˜›QŒUÎ]XÝÐŒXÙÐ™˜Œ™QÞ˜ÌŽ]XŒÒš›”™˜•ÛPRšÕPVÔ›QMZÐQ[NÑMSÍ“UÍÐZÓ]Ð]“Ð™˜LU]ÐVV›ÐQŽ^X›XÐYN\ÙÌ[QÑØŒÓŒÛN]ØQÕPX‘ÎLÖ–š–V›L•YÕVL•PTÕ“”™Í•ÝÐPZÓP‘YœØUÓšÕYÙV”ÐVUÌ[ÚP[’–[QÒžVUÓœ––žQÍLX•Ò›Û“PX›“PUNVŒ\ÐQŽ^™ÜÐXÛQVŒ•PT[QšÒRŒX›UYØ›Q•ÙÒžUž“ÝÐ’•LY“ÑÌSÔÌÚ‘MSÑÐR‘PXÌÐ›‘Þ›Y›ÌÓPVÓœQŽL‘ÔPV›[‘ÔPV[’šL˜›M]™ÍZ–•ÔPUQÓPTÕ“”™Í•ÝÔPZÓ™ÐÖUÔYÖ•ÍL–•Þ˜ÑÕYØ›Q•ÙÒžUž’Ð™–[QžPQÔœLÔ™˜•ÛPQŽLPPž˜ÑÎ]VÐŒ”›Q”ŒX›UYÒžUž’žPXŒÔYÖ›NLX›TPXÌÔžV–ž”UÔšÐQšÐQ[NÑMSÍ“UÍÔPZÓÐ™˜ÛVPÔŒPQÔœLÔžYÞÝÐž™›ÌÓ˜–PVžRŒX›SŒÑŒUÎ]PRš›XÐUQÕPTÕ“”™Í•ÝUPU•Í[R›LÔ›‘ÙÒžUž’Ðš–VœÑœÖž›Û“PXUÍLŒZÛ˜™Ð™˜QÎ\QŽLTPž™›ÌÓ“V•Í[™ÙÐX‘ÑžVÐ”V™Ð•YÍ[PØÛÞXÙØ›NLQÔ››[V•ÔPTÕ“”™Í•ÝUM“UÍSYÐZÙPVŒMPRŒÛUž˜Ì]ÙPœÖ”œ–›Ì›QŽ’–PX‘ÕŒ–•ÝÐUQÚÐTÕ“”™Í•ÝUPR’^PQÑšÖÐ›ÙÐ‘ŒŒ]ØUÞÐ[Ðœ›”˜›QŒUÎ]RRŒX›Už“ÚP[Ð›Û’˜Û“]PÙÐœÖÐžV•ÖœPPš’›ÖUÒ›P•XŒŽØ•ÑYTÐØQÎ]V•Ì[ÑšX‘ÕžQŽM^UžQRŒÛUž˜ÌRŒX‘ÕPVQ[NÑMSLÚ‘MSÕÐR’^QNLYÐ–šP•Ì]˜ÛšÐX‘Ž^V•ÙV–ž˜V›ÖPYV–PURPVR›ÐQ[NÑMSLPQŽÐPÔŒRÝÐ™–’ŒR˜ÛTžQÛYÕžXÒ›ÌZÝÐ™––›ÐQÞ™Í]ØÛN]XŒÕVL‘šX‘ÕPUL“PVÐ’•LY“ÑÌSÔÌ™ÐZÙ\QRšÐžYÞÞPšÖVšQÛRPØÛÌNZØUÓŒžPšÐ]ÙPÕPÙÛ^ZÒÐQÖ˜ÛLZPœÖÓ˜›N^VUÍLŒ\™Ð•]Ð™–[’šUÞÖ”P™“QLP’•LY“ÑÌSÔÌš›ÞSQ^PÔŒSZ\ÐTL‘RŒÔYÖ›[VÐšVV›R›ØŒ[•ÕŒUÒœÖ”Ð[’–[PÕ^–ZÛÞP˜’–™ÙÐ‘UÍ]XŒÔYØÌ•ŒPÕž“ÚPœÖUÍ[™Ñ›–”ÐXŒÔYØÌ•ŒÐ˜ÚPœÞPœ›–š‘ÛÓÛÐULŒV‘ÕŒUÛÐQÞ™•žVL‘ž–•“››”››S›QŽ\VTP’•L“‘]•“PVMR’^’ÝÐ™TPYÌZV–žQ“QŽ‘ÍVÜÐPÔÖVž–”P[^UšÕÔPØQÎ]V•Ì[žšPNQMY•QZÕ“”•ŽPÕÕ”‘•]Ð’•LUL“‘]•S•PR”Pž˜ÑÕœØ‘ÛVŒSŒÛUž˜ÝÐš‘ÛÝÐ˜XPZØÌÔžV•ÍZÐQ[LÑMSPR”ÕPT›^ŒÓM’PÐ[ÞPYÒ–RÐPÕž’–[^Už’–PUÛPX›Q”Pž™›ÌÓ–‘ÔPR’ŒÛUV‘PTÕ“”Í•ÝYÐ\ÐQV™ÍZÓÚP[’–YÒ–RÐQœPÕž’–[ÞUš’–PT›NLX›TM’PØÛÝÐž™›ÌÓ˜–PR’XÌÔžV–ž–•ÍZÐPÕš’•Ô“Q[LÑMSPSÝÐXÌÔžV–ž•ÕVŒÔ›ÐPÔšL“››”™–[U›XŒÒ›QŽÕÚUšÐRžV]Ð’•LÑÌSÔÌPÌPØÐRžP˜’–™PÐ[ÝÛÐR‘ÑšV[’›Ðž™›ÌÓ”ÒPR–]’–PTUÔœØ”P™’•ÓšÐQ[LÑMSPRžXÐR•Ó[ÝÐ–›QœRŒÛUž˜ÌRŒX‘ÕPR‘Ô™ÒœÖ”P[^UšÔÔPNPQ[LÑMSPR‘ÑœÙPŒÍ[ÝÐ–ŒšPPÕš’•Ô•QŽQ[LÑMSÐV”ÙPL–MÒS›TPÑšÐPŒØŒÒšØÝÐ™’•Ô“’•ÔQQ›ØŒŒXÌÔžV•Í[™ÙÐTÕ“”Í•ÝÐPZÖUÞTP™’TQ\QšPÑšYÐVUÌ[QŽ‘L‘ÕPTVšYÐ[^UšÔYÐMQ[LÑMSÐR‘ÑœÙPL’ÙÙÌ˜Ì’ÛÙÌ’ÚÙÌ’ÜÙÌ’ÝÙÌ’ÌÌ’ÍÌ’ÎÌ“YÌ“YÌ“YÌ“YÌ“YÌ“YÌ“YÌ“ÙÌ“ÙÌ“ÙÌ“ÙÌ–QYÌ–RYÌ–SYÌ–TYÌ–UYÌ–VYÌ’ÖYÌ’ÔYÌ’ÑYÌ’ÓYÌ’ÒYÌ’ÕYÌ–XÐVUšÕÕšÙPP˜ÛL\Rœ•ÕPX‘ÑVŒÕšŒ•PTPPZÖUÞ]Ð’•LÑÌSÔÌPQ]Ñ]Q]Q]PP›–•ÍZÖ–PTV™Ð•ÝÍ–[Qž–”P™’•Ô“’•ÔPR‘ÑœÙPTÕ“”Í•ÝUPTPÌY’ÐR–ÐTVž™PŒ–VœUÍLÝÐ™“QÎ[PPÔš’LPQ[LÑMS^PÑšÔÐPV›N^X•ÑYP™’–[‘ÎT[QœØTP[PZÖUÞ™Ð’•LÑÌSÔÌP^QRš–PXÌÐ›UÜÐXÑÛL™ÐVUž’•Ô›PÔš’LÐQ[LÑMSLPPÓ–STP™’–[’ÐT[Qž˜ÝÐØQÎ]V•Ì[ÝÐZÖLŽ][[V”PŒ˜Œ›–”PKÐQ[LÑMSLQÔœLÔœŒZÛšÐXÒ˜ÌŽZÙTPZÖ‘ÎLQRšÜÐVUž’•ÔPTÌR“ÐÌTÐPÌR‘ÚÌ”™Pž–VÝVPT[UVÐžV–œÖUÓ›QŽYVÐ“VVœšLPQŽÕPT[Z˜ÝÐ›LšQÌZÛ\ÐR‘ÌZQPVYÞQŽ‘LQ”’•^L“ZPVÝÐT[^ÝÐ›X’ŒÕžPPÔšXÛ\ÐU•“]U“‘ÕZÐV““TPZÙÕPžXŒÕ›˜QÍ[ÌÓPR–[ÝÐÐQR˜ÑÎV›ÍQ••TšLQÓœÖVœÐT[’šPPZÙUžV[VPXÑÚ˜›U”P^QPVLÐ^“š˜ÐYÓPT[’šTPZÙUžV[“›PR˜›UPXÌÕšPQ“”TPš˜ÑÞÔP[’TPÙÙR˜UÓœ›XÐR‘Í]™Í[PRŒÞœ™Ö”P™“ÌNVLÓ•L’”ÔP]ÕRPVVšØUÎV[’›V›ÐPÔÖVŒ™ÐÙÚÐQ“PÓPQÓž”Õ“”ÑÌSÕ^QÒžV•ÑŒRÐV•Ì]ØQÑž˜VPTL‘œ˜”PZÙUžVYÐZ–TP]ÕPš˜Ì™Í•ÞP‘UÍ^QŽÔLŽR‘Í]™ÍV[’›UÜÐRL•PX•ÒžXŒžQÓž”Õ“”ÑÌSÕLPPÔÖVŒQÓ˜›“˜›QYPTL‘žXTPZ˜TP–š‘ÑŒTPš˜Ì™Í•Þ™Ð™“QS]ÐQÝÖVŒQÒžPPÓQS›ÖUÌR’›ÛR›R››TPV‘QÓž”Õ“”ÑŒUÍPÓŒPQS›Ö–PR‘ÓšÑÛUÝÐX‘ÚÐR–[^Už’•ÓPV›Qž™ŽL–ŒYÐš˜ÌÛSYÐ‘VŒPÔš‘Þ–VžQL\ÌÓœ›XÙÖ›[Ö•ÙÒ–PVš›TPXÌÐ›•ÔPV‘ÔPVLÓ’•LSVVœš“PTLŽ]ÙPZÖUÓš–•ÍLQÌZUÍLUÛV–PVUšÔLŽXÑÚ˜›U–š[^QÛ’QÌ\ÌÓœ›XÐXUÌ[QÓž”Õ“”ÑŒUÍQSØÛ”PXÌÔšžPÔž–•ÍL•ÍZ–”PŒP“–ØŒÒšÒPÙØQÎ]V•Ì[žP›R›LÔ›Pš˜ÌÛS”P™’•Ô‘PPZØŒ\ÙTP•XŒŽØ•ÑYTÐØÛNZ–•ÔŒXÛUžQSXÛ]ÐX•ÑœÖ”P™’•Ô‘QÓž”Õ“”ÑŒUÍQÙÞPÔ˜›^XÝÐ‘VžPÕž’–[ÞUžQÖ›•ÑœÖ”Pš˜ÌÛTVš[[PÕ]SL””PQÙÞPPÕž’–[^UžPÔž™ÕQL\ÌÓœ›XÙÒŒ•V’›ØŒ[•Õ[’QÒ››N^V”Ð››T]Œ–]›[Ö”P[Ð[Ð[Ð[Ð[Pš˜ÌÛTLÛXUÞØUÓPT‘ÕŒ–TP›Ó]Ð™’•Ô›YPP“˜ŒÒ›R›ÖUÍØŒ[R›ØŒ[•ÕYÙÖ•ÙÒ–PT‘Î[˜ÙÐš˜ÌÛTŒÒ›•ÜÐR‘ÑŒ•ÍZÐQMU•]ÐXQPVLÓ’•LSVVœšÚ[’›Ð‘XÌÒŒPÔšŒVŒPÕšÒPÕž’PÕžQÚPQŽ‘ÖPU“UP™’•Ô[LÙÐXÌ“žXVŒQTŒXÑÝÐR‘ÍZÛ–”PZUšQÓž”ÌR“Ñ’PR–ÐXÌÔX‘ÕPT•ÙVP[ÌŒP™’•Ô[]ÐZÔÐš˜ÌT’•^–^SPP›XŒLQU›™UÙÐVTÐØQÎ]V•Ì[RXÑÕYØŒÒYØ•ÑX›UžRQÎ[RQÑžYÛ™ÞÛ˜šPŒQÒ›RÖ•Óœ›[ÐšV•Ö˜ÛUYØÌÔšÛ”ŒV›PÔŒ–•ÎZÖ”P™’•Ô›PÕž–šUšÐQÓž••”‘ÓÐP[ÞNL˜Œ›––]’–PT•ÙXÐP™’•ÔQÑYØÑÚ˜›U”ÐŒV›QÎ^RQÌZ›M[ÚP–šPšÛ”œLÕœÖVœŒØ–ž™ÐšV”Ðž˜ÑÕš˜UÖœ•ÔYÖ[U›XŒÒ›QÕV’XÑÕPR’›ØŒ[•ÕŒ”›QÓž••Í\LŽZÖ”PšPQÕV’XÑÕYØ–ž™Ð›ÖšÐž™ÑžYXÑÕYÖ›N^RQÓ˜›“˜›QYPYÍ]ØÙÐš‘ÝÐXTPšÛQšXUÓPVUšÖTP‘˜‘ÒšQÍ]˜Ò››[R˜UÓœ›Y™›L™ÙÖL‘X›NLQÒ›Rž–•ÔYØŒÙNLÖ•ÞQÕQUŒQÚÐVUšÐQÓXÛ[Ø‘ÛRŒÛUž˜ÞPØQÎ]V•Ì[ÞPš–UÍ™Ðš˜ŒLUÛRRžXŒ™VUÌØUÍ^™ŒVLÔœŒ^QYŒœÐVŒÒ›•ÜÐVLŽZÖ”P™’•Ô–R•ÓPYNZ’^Q™ÛM\›XÍ’QÌZQÛÌØ›•[UžRPÕšÒQÎ[RPÚÖV”ÕS‘•LNSTÕ“•RQÒ•ÔYÓÐ^ÔÐžV•Ñš˜QÕšÐÙÐ[ÞUš’–PTŒ•˜ÙÐ™’•Ô–V™Ð[^UšÒ•ÓPVŒÒ›•ÜÍR–UÞYÐ“˜Vž˜UÍ[’PÙ›TØQÎ]V•Ì[žPšV•Ö˜ÛUYÒžUž’Ð›Ö•ÒžV–ÐV‘Õ›VVœÙP’‘Ñ›QŽ‘™ÐUÛ˜Ì›VžP‘•Ô’”™ÐŒÖ‘œÙPT–žXŒÒYÒÐÕž’ÕÙÖŒ•V‘ÕžRQÑŒœ[•Œ”Ðž˜ÑÕš˜UÖœ•ÔYØŒÖTÐœÖUÍ[™Ñ›–”Ð›XUÞÙÐž˜UÞ›”PTŒŽ]VÐ[–•ÍZØÑÚ˜›U”ØÙØ›NLQÕÑÕš™ÕšÒQÚÛUPXV“Ó›’œ]ÐŒÖ‘œÙPVŽ^V‘]ÐRÝÌŽ[YP’Œ]Q›ØŒ[•ÕYÙÖ”ÐœÞPVž˜UÍ[QŽ]˜ÛTPXV“ÛSPYNZ’LPR–›”PTŒŽLPPŒÖ‘œÙPXV“ÛS]ÓPPÖUÔYØÑÚ˜›U”ÐVUÌ[PØÛÞXÐYNZ’PR–[ÞUžQYVUÍX‘ÎLVPœÌŽV]U^PÕž“ÚP[’–[“Ð’ÛUœRÝ‘ÎLVPœÌŽV]UMPR™–UÞTPœØŒØÐTŒÕœXÙÐÖ‘œÙPXV“ÛS^PP‘™R›LÔ›Ð[’ÐØÐXÌž™Ð’ŒPQÛ˜žL\ÚLZ–PXÑŽZ’^QUÑÕš™ÕšÒPØÜÐ›VVŒQZ›XÐU›QœÙÕYÒ•ÔYØVYÖŒÒ›V›ÚPŒQÑRQÌZQÛÌÒ•ÔPXV“ÛS^SÐÖ‘œÙPYPÌ[VVŒQZ›ZÐXV“ÛS^“ÐPÖ‘œÙPTL‘X›NLQÖœ›TYØÑÚ˜›U”Ð[’–[’R’QÛÑÎ^YÍYPÌ\ØŒØÐTÑÑXÐÖ‘œÙPXV“ÛSLP”XQÎ]V•Ì[QÛÑÎ^YÐŒØUÞÒQÎL––žXUÔ›R›ÐØÛN]Ö–ŒUÕž“ÐœØŒØÐXÑŽZ’PTÑÑXÝÐœÌŽV]UMQ›ØŒ[•ÕYØÛU›V–››S›QÍ]™Ð›XŒÕV‘ÙÒžUž’Ð[ÞUž“”P’VUÍLQÚŒ™ÐXV“ÛSLSÐš˜ŒŒ]ØUÞÚPŒX›]XŒÙRR›ØŒ[•ÕYÙÑšX‘ÕM’PØÛÞXÐR–[ÝÐ’VVžPRÝQÛ˜PP”XQÎ]V•Ì[RžXŒ™VUÌÙÎ]’QÞÛYQÛ˜žL\ÚLÕÐTÑÕšXÙÐœÌŽV]Z’LQUÑÕš™ÕšÒQÑYÖLŽ]V‘ÛUÎ]SÐXŒÔYÒžUž’Ðž˜ÑÑš–”ÐPTL‘RŒÔYÖUÞØŒ“šÕYØ•ÕŒÒPÙÐ‘™R›LÔ›ÐœØVŒQÎ[RRŒÛUž˜ÞPœÖ–›’PTÑÛVTPœÖVœš‘PYÑšRPPR’•ÔYÖ•ÍLÛ[ÝÛÐTÑÞYÐœÖVœš’PU•Í[R›LÔ›Ðœ––ØŒÒšÒPØÛÞXÐYÍZÖ–ž–LŽ^V”ÐPR•šÓÚP•˜›]XŒÙRQÝV˜ÛTM’PÕžÙÐ’X•Í[R›ØŒ[•ÕPX‘ÑŒUÍQÔ™ÒœÖ”Ì^ÎL”ÐPR•šÓÚP“˜Vž˜UÍ[’PØÛÒÛÐTÒœ™P››TØQÎ]V•Ì[QÌZ‘ÕPX‘ÑŒUÍQZX›XÐV›UUÞQUÑÕš™ÕšÒQQ“ÔÝÙÕR\ÒQ”’T•MX‘ÑŒUÍPPÕLV‘ÙÕU›ÐŒžPš˜ŒŒ]ØUÞQÔœLÔœŒZÛšÙÖUÙUÍÐQ[V’PX›UŒYšP‘•“‘’QÍ]™Ð›R›LÔ›PœÖVœš–PR•šÓÚPÖUÔYØÑÚ˜›U”Ð˜’–™PÚ’ÞUÔÐœš›ÙÒ–YÒPÕžÙÐ•’ÞUQ[UÝÐTÕVYÖ[^–LœÙØVYÙÎ]’QÞ˜›XÐYQÌ\ÓÛ^›XÐX‘ÑŒUÍRšÛ[›”PT•^”šPXŒÔYÖ–Ö•ÓŒ•ÔPTÛQŒ–TPœÖVœš‘]ÐPÕLV‘ÙÔ‘Û™Û˜›QžYTÐœØUÍ[QÞ›YPÐŒØŒÕœÖÐ™UžV›^™PŒQÕYÖ‘ÑŒTÐšYÖ›V–M’PÕšÐÙÐ’ØÑÑPQÑ›–”P‘•Ô’”šPXŒÔYÖ–Ö•ÓŒ•ÔPX‘PR•šÓÚP•YŽØ•ÑYTÐÖVŒÞPœšPšQÌLX’œ˜ÛTYÖ•ÍLÛšÍ’PÕšÐÙÐ›–•ÍZÖ–PTÛ•žV]Ð”VVš•ÕŒ–YÔP^Z˜ÐX‘PSNR–\’–PTÌ‘œØTP]UP”VVš•ÕŒ–YÔÐ]UMQÝÞQÙPÍ^V–œÖUÓ›Q]›QPUQÑžVUÌ[ÕžRQÓZ•LPQÝÌQÞQ]ÖVPSYXŒÕÐQT‘ÕPœÓ”P]ÙPÕPÕž“Už“™Ð“QÌ^PQÑÐPœÓ™ÐžÎLQSššYR›UÔYÖ›[Ö•ÙÒ–PTÌš˜YÐœÓÐP[•ÔM’QYXŒÕÒQÍZ•ÕYØ‘Î]VŒ•žRR›ÖUÍÓZPšYV›ÞP[Õ•”‘ÓÐÚÐT›[Ö”ÐXŒÔYÕLP‘”^P˜ÚP”ÔÕV‘ÓÚP[ÝÐV[“ÐQ]V‘ÑPX‘]ÐP\™QÓ›•Ô›ÐœØUÌ\Ð–šPžYÞÞP[Ò•Ô\QÛRQÙXŒÕÒPØÛÞXÒÐRžQÑØŒÓPTÌŽ^V”P[^PYÓRÛ•PÐ[ÝÛÐPSQÎ‘ÙÐÛ‘RÐPP[ÐPÚÐUÝÐ™RÐY”PNQRYÐ[QÐP\]ÐÍÐP[ÝÐÞNOOHŠKŠLÎL’PÐYÒPÐYÒPÐYÒPÖ[ÞS•‘œ•ÑYÔQRÕÝÔT–TY”ZÓ’TšÙ”ÓØÜRPÐPRPPZPÒP\ÐRZÐPÕPMYÑPZYÐRÔPŠÐZ\Ð^R]PÍSÐ”ÐZ‘PSYÐ˜ÐZ”PS”PLQÐYRMPSPÜÙÒNQTÐÕP[ÐÕTRÞPJØÐNP˜ZÖPVYÒ[UÛÐÖÒ“QÜÐØÔR“U”PÜÓš[ÐPÙÝÒÍMÐÚR•XØÑ
ÐPÔÐZ[ÑP™QVÐ™ÐQÑPVYÐšQÔPV”P›PQÑPØPPœQÛÐX]ÐœÐQÌX™ÐRPXÔPžPRPYPŒPRPYÐRÐYYÐÐRÐY”PQLÎTÓØÛPSPÐUQÐžÐPPPPPTQPÐ]ÓQP”VRÙÒÙÜÐPPQPYÒQ]ÔQ™ØÒÐZÒÐPPPYÓQ]ÔQ™ØÒÙÒÛ›™˜ÛT•›ÌÓPMPQSÎNYÑTPPPPPPPPVUÑšUÑšUÓ›•Õ›UÛUÔXŒŽ]˜ŒŽXŒÕŒYYšUÑšUÑšL•›•ÕœUÛ‘Í]˜ŒŽ]˜Ð™ŒYUÑšUÑšUÓš–L“š–L“š–‘ÔšÖ‘Õ›•Õ›•Õ›•Õ›–Œ™–Œ™–ŒšØQÚUÛUÛUÛUÛX[]˜LžØ‘ÞØ‘ÞØ‘ÞX›M]X›M]X›M]˜ŒŽ]˜ŒŽ]˜ŒÒžXÛ’žXÛ“ž˜ÌÓž˜ÌÓž™ŒŒŒYŒYŒYŒYÙYV™[œ™[œ–[RšVYÐPXŒ“š–‘ÔšÖ‘Ô›•Õ›V›Y˜QÛLØ‘Ì]X›N]˜ŒŽ]˜ÒPPPž˜ÌÔŒŒYŒ™V™[œ™[œPPPYÔŒÝÖ‘ÔœØ‘ÞX›MZUÛŒŽLYŒYŒYŒV•ÑšUÑšUÙ–Œ™˜LŽ]˜ŒŽM™[\Ö‘Ô›–ŒÙØ›MZUÑšŒŽZUÑš•Õ›•ÛUÛ˜ŒŽ]˜Û’žXÛ•ŒYž˜ÌÔŒVØQÍZØŒŽM™[Qš•Õ˜ŒŽ]˜ŒŽ]˜ŒÛX‘ÍL[TžUÓš˜’ž™YÐPV[•Œ–•ÕœX[‘žÛ’YUÑšUÒ–L”šÖ•Õ›•Õ›ŠKŠM‹•Î]˜LÕÔ‘Û™PPPPPPPPPYÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐP[ÔPÚPRÓP\PÛRÖP\ÐÛÐRÚÐ\YÐÜRÝÐ\”PÝPRÎ\ÐPÞSP\ÝÐÌSP]ÐÌÐSÐ]TPÍSÐ]PÎPS]ÑPSQP]ÙÑSTP^QÐSXÐ^PQS[Ð^]ÑPSL^™ÑSPLQÐS“PLPQS–PL]ÑPSšÐL™ÑSÐLÔQPSŽMQSÒPMÑÐSÕPMYÑSÙÐM”QPSÜÐMÐQSÍMÝÑÐTPNÑTPNTQTÐJÐQPTÐJÝÑTKÙÑÐRPPYÔPÐÐRSPZPÑRVPZÐÒPRZÐZYÐÓR]ÐZ”PÓÐRNZÐPÔR’PZÝÐÕPR•P[ÐÖR™Ð[TPØPRœÐ[PÙR[ÐÙÐPTPŒRXTPTQ˜PXXÐ\PP™ÐU–QPXLY”QÐXPP”RZÒPPJÐUœÐžÒÍQÑP–Ñ›VÐŒÔRŠÐVÐ•RSRPPYÒPQÐ™ÒP]ÐžTPVPXÜÐQÙÒSMQÑTPUSP”ÒS”PUPRÐS˜ÐUÐQPYÐXÐRÐSŒVYÒQ•PQPPSPPPMTXÐ]ÐSYZÐQÔRPœÐÔQPPN‘TQ‘PUYÐŽÑQ‘PŽYÑÐQšÐ˜ÒRP‹ÐQPQÓPŒ”RÐPRQPYÙÐÑRTPZPÑÐRXÐZPPÒR[ÐZ]ÐÓPRLZ™ÐÔRPZÔPÔÐR“P[PÕR–P[ÐÖPRšÐ[YÐØRÐ[”PÙPRŽ[ÐP[PYÐÛÝÐÚÐTËÒQÛRÙÐSPQ™PT“QÝTËÙ]ÑÝÐPØÐœÙÐÞSP]P[X˜Ð]PP^UŽ’ÑLPXŒKÙŽNXÐP]ÔQÐTËÞPRÐTYÐžÑPSZÐ^YÑS]Ð^”QÐSNKÙ‹ÔS’PLÑPPÐPŒYÑPÐŒ”QPSœÐLÐPœÐUÐŒÝÑÐSÑPMÑKÊÔPPÝÑRYXÐMQSÛÐMÑÐSÌMÙÑTËÎQPTPNPPZY–PN]ÐYYšÐJÙÑÐTÐX”Q™YÐÙÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐPPQMU–PœP[ÐUÐœÐÛÐQÐP‘YÑZPUÖPœ”PŽPXN\ÐPQYÐÕÑÌPÚÐ”R\™ÐVTQUTÓP–Ñ’ÐV”ÝÑPPXÑP]ÙÑSTP^QÐPÍ‘RP™Ðž]ÐUÐXÌ^™Ð\PTP””Q“PUPŒPQS–PL]ÑPRPŒ™ÑSÐXPQœPYPTRSÒPMÑÐSÕPMYÐ]TL”PVY\ÐQÒSÍRÝÑTUVP•QLÐY”PNTQTÐJÐPžY›ÐJÝÑQÚÐ˜]Ò[ÐPYÔPÐÐRSPZPÑRVPZÐÒPRZÐZYÐÓR]ÐZ”PÓÐRNZÐPÔR’PZÝÐÕPR•P[ÐÖR™Ð[TPØPRœÐ[PÙR[ÐÙÐPQQPYÔQTQP”TQÐXÑPÐTR[ÑPÝÔSP’ÌQÔTQQTTTÐ“QQTU–QQÔVPšÑQÙÔXÑRTYPŽRPTZÒQR]ÔZÐÕQR™Ô[ÙÑRÔT\PÜÑST]ÍSÔ]Ð‘QSYÔ^‘QS”TL‘ÑSÐTMP‘ÑSÝÔN‘TÔKÐ‘PQTTTÐ‘SQTT‘‘VQTÔ’P‘ZÑTÙÔ“‘]ÑUT“Ð‘NQšQ”‘’QU]Ô•P‘•QU™Ô–‘™ÑUÔT˜P‘œÑVTÛQVÔÐPRQPYÙÐÑRTPZPÑÐRXÐZPPÒR[ÐZ]ÐÓPRLZ™ÐÔRPZÔPÔÐR“P[PÕR–P[ÐÖPRšÐ[YÐØRÐ[”PÙPRŽ[ÐQKËÌËËÙŠÚÐTËËÙ‹ÎKËÌËËÙ‹ÎKËÌËÑX]TËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËÑÝØŽKËÌËËÙŽŒËÒTVZPšSQÒV[šVQÒÖ[ÐšZÑÒÙÖ\š]ÑÓV]PšNÓPV^š’QÓ]ÖLš•QÓ™ÖLÐš™ÑÓÔVMŒËËÙ‹ÎKËÌËËÙŽPPšÑQÔYÖ‘šÔQÔ”V‘ÐšØÑÔÐV’šÛÑÔÝÖ“PšÌÕÖ”›QÕTV”ÐŒËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËÙÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐPQÐÐV’RÓP\ÐÝ’RÖP\ÐÛÐRÚÐYYÓÜRÝÐ\”QKÞYÜÐPÞSP\ÝÐÑPMQÓÌÐRYÑTSÒÐMÜÐZSÎPRMÓÔPMQQÙÓÕMTQSÕÐMXÑPSÖM[Ñ]ÓØÐML™ÓÙMQÔTKÍ“QSÛM–QÓÛÐMšÑYÓÜMÑ”SÝPMŽÐSÞMÒQÝÓÌMÕQÓÌÐMÙÑTSÍMÜÑSÎPMÍÔPNQÙÔNQTÐNÑPTNÑ]ÔPN™ÔKÍPYÔPÐÐRSPZPÑRVPZÐÒPRZÐZYÐÓR]ÐZ”PÓÐRNZÐPÔR’PZÝÐÕPR•P[ÐÖR™Ð[TPØPRœÐ[PÙR[ÐÙÐTËÛÙÐÚRÔP\PÛPRØÐ\PPÜS˜Ð\]ÐÜÐRÌ\™ÐÝSP\ÔPÞPSP]PÌPSP]ÐÍSÐN]ÐÍÐSÐ]”PÊÐTËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙŽSQŒVÐ™QŒPV™QŒ]ÖP™ÑŒ™Ö™ÑŒÔVP™V™RQÖÐ™UQYÖ™YÑ”VP™ŒËËÙŽÒPNËÙŠÐPRQPYÙÐÑRTPZPÑÐRXÐZPPÒR[ÐZ]ÐÓPRLZ™ÐÔRPZÔPÔÐR“P[PÕR–P[ÐÖPRšÐ[YÐØRÐ[”PÙPRŽ[ÐPÚRÒP[ÝÐÚÐRÕP\ÐÛRÙÐ\TPÜPRÜÐ\PÝRÍ\ÐÝÐSP\ÙÐÞSP]PÌSÐ]PPÍPSÐ]]ÐÎS]™ÐËÐSPP]ÔQÐSSP^QSVP^ÑPSZÐ^YÑS]Ð^”QÐSNRÒS’PLÑPS•PLYÑS™ÐL”QPSœÐLÐP]ÐUŒÝÑÐSÑPMÑSÔPMTQPSØÐMQSÛÐMÑÐSÌMÙÑPŽŽQPTPNPQPTPN]ÑTÐJÙÑÐTÐSTQ™YŽYÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐPPQTÐTÒP’ÙÑ[ÐUPœÐMÐTP–PQ›PVœ”PœPU[ÐœÐPQT“P’]Ñ\TÚÐ“ÑÌÐQÐ‘TQšUØÐ™™ÑU’QÜÐ”ÝÑPPXÑP]ÙÑSTP^QÐPÍ‘RP™Ðž]ÐUÐXÌ^™ÑSPT”Q“PYPLPQS–PXPRPRPŒ™ÑSÐLÔQPSŽPTRSÒPMÑÐSÕPMYÐ]TL”PVY\ÐQÒSÍMÝÑÐQVP•RTPNTQQÚÐŠÐPžY›ÐJÝÑTKÙÐMVPPYÔPÐÐRSPZPÑRVPZÐÒPRZÐZYÐÓR]ÐZ”PÓÐRNZÐPÔR’PZÝÐÕPR•P[ÐÖR™Ð[TPØPRœÐ[PÙR[ÐÙÐPQSÐYÍÔSÐ”MÑØÓÐÐM‘ÛÓÐÝÍQÌÑÍSÑTMÑSÑM‘SÑÍQÓÑÙÍ‘ÓÒMQÒPMRSÒ]ÍÑUSÒ™Í‘YÓÒÔMQ\ÓÓMMÓÍÑ‘SÓYÍ‘”SÓ”M‘˜ÓÓÐMQ›ÓËÙ‹ÎKËÌËËÙŽÑÐSÔTMPÑÓSÔMQ‘ÖSÔÍRQÚÓÔÙÍSÝÓÕMSÑÎÕPMT‘SÕ]ÍUQSÕ™ÍVÓÕÔMXQÓËÙ‹ÎKËÌËËÙŠÐPRQPYÙÐÑRTPZPÑÐRXÐZPPÒR[ÐZ]ÐÓPRLZ™ÐÔRPZÔPÔÐR“P[PÕR–P[ÐÖPRšÐ[YÐØRÐ[”PÙPRŽ[ÐPYRÒP[ÝÐÚÐPÜÐÛS™Ð\TP•ÐX\Ð\PÝRÍ^ÐÝÐSP\ÙÐÞPÙÝPÌSÐJÐPÍPQ˜Ð]ÐÎS]™ÑPPTP“ÑPPTVPžQP™Ð‘YÑSPXÚÐYTQUÐTÒP“™Ñ\PUÐ–PQ‘UUPŒÐ“PYPLYÑRP”TQ˜PUÛÐŒÐPÐVŒÝÐQTÎTQRYTPMTPVT“P‘RRÐ‘ÑZUÐ’ÝÑNUÑP”Q‘ÐY“PURPTPN]ÐžURP•ÝÑœYÐYQŠÐTšÙÙÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐPPZSPPÙÑST[Ù\ÐÐRZÐYÚ’Y\”PÝPRÐ’’PP’TQRÑY]Ð•ÒÑYUž‘PYN‘RÕYVTÐPSQP]ÙÑSTP^QÐSXÐ^PQS[Ð^]ÑPSL^™ÑRPŒQÐS“PLPQS–PXZÖPSšÐL™ÑSÐLÔPŒYMQSÒPMÑÐSÕPMYÑSÙÐM”QPSÜÐMÐQSÍMÝÐŒPY‘PNÑTPNTQQÜÙJÐQPTÐJÝÑTYÒÐRPPYÔPÐÐRSPZPÑRVPZÐÒPRZÐZYÐÓR]ÐZ”PÓÐRNZÐPÔR’PZÝÐÕPR•P[ÐÖR™Ð[TPØPRœÐ[PÙR[ÐÙÐRÑP[ÙÐÚRÝÙÜP™ÐXXÐVTQÜRÛÐ\]ÐÜÐRÌ\™ÐÝSP\ÔPÞPSPY”QÌPSP]ÐŠÐXšÐ]YÐÍÐQ’P•]ÑXŽ]ÐQSRP]ÝÑPSUP^ÑSYÐ^TQÐS\Ð^QSM^ÑPS‘PLÑS”PLTQÐS˜ÐLQS›ÐLÑÐSŒLÙÑSÐPMQPSÓPMPQSÖPM]ÑÐSÚÐM™ÑSÝÐMÔQPSÎNQTPNÑTPNYÑÐTÐJÔQTÐKÐQPTKÝÐÐPRQPYÙÐÑRTPZPÑÐRXÐZPPÒR[ÐZ]ÐÓPRLZ™ÐÔRPZÔPÔÐR“P[PÕR–P[ÐÖPRšÐ[YÐØRÐ[”PÙPRŽ[ÐPQPTUP”TQÜÒPÖPQÛQÑPœTPVP\\ÐYTQÝRÐ™]ÑÝÐSPQQÐV’ÐÌSÐY™ÑSTšÐÝ]Ð”ÐU“P™PQŽXÐP]ÔQÐPRPžPQÐXÖP^ÑPSZÐ^YÑS]Ð^”QÐSNQPQ‘YPLÑPQPŒYÐ˜PVPŒ”QPSœÐLÐPVPT›ÐÌÝÑÐSÑPMÐQYTPPÒPSØÐMQSÛÐMÑÐSÌMÙÑP‘P”RPTPNPP”Y–PUÝÑžYšÐJÙÑÐTÐQÔQX]ŽYÐPÐRRPYÝÐÑPRUPZÐÒRYÐZTPÒÐR\ÐZPÓRMZÐÔPR‘PZÙÐÕR”P[PÕÐR˜Ð[PPÖR›Ð[]ÐØÐRŒ[™ÐÙRÐPPQQUQPœÐYRQÐPœÐšXZÐQÐRÜRÐœ”PVÐœÐPÞP]Ð”YÑŽPTŒÝÐÌÐR‘QV\œÐUYÑ•VÐ™RPSQP]ÙÐPÐXÔPP™ÒÐSXÐ^PQS[Ð^]ÑPSL^™ÑPP”]ÒÐS“PLPP”PYPUÙÑÐYÐL™ÑSÐQÐQXP]MQSÒPP]ÒÐPXÐYÑSÙÐM”QPSÜÐMÐQSÍMÝÐTUTPŽÑTPUTRQœÐ˜ÔRPTÐJÝÑPšÐ‘ÝÓÐTËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKËÌËËÙ‹ÎKÝÑRYÚÑÔUR™ÚÒÔYÒÔZÒÐÔ\Ò‘ÚÔÔR‘ZÔÐÔ“R‘ZÔÔ•R‘™ÚÖÔ™Ò‘ÔZØPÔœÒ’ZÙÔ’ÚÙÐÔÑR’YÚÚÔÔR’”ZÛPÔØÒ’ÐZÜÔÛÒ’ÝÚÜÐÔÌ“ÚÝÕŽ“PZÞÕR“]ÚÌÕR“™ÚÌÐÕÒ“ÔZÙÐQ”ÛPÕQR”YÛÕVR”ÛPÕUR”ÙÛÕ]Ò”Ô[ÕÒ–[ŽKËÌËËÙ‹ÎKËÌËÒPP]ÐQPSYÐ^QPS”PLQÐSÐPMPTËËÙ‹ÎKËÌËËÙŽÐPPPPPPPPPQPPPPQPPPKËÌÍŠÔŒ‘MÓÜ›Í]UMØÌ•ÌS“^œÞ’ÞSX‘]ÜÐÊÝ“M”Þ\ÒÍœÜ\Z[\ÒÙÛœX[R˜UZÜÓÚ’\RZÔÐÙÒN[š™Ø›^XQÖšÖ[P™VœU›”ÕQMSTÚÚÔ‘RTÍ“ÑLZ]SÛÛÒšTZRPÑÚÕÑ’TQÝÒÐÐVQPYÐPPYÔQÐÐ[ÓQTÑ–VQÚÙRPÒZÒšYÜSÍÓZ”L“ÑÎÐÔ‘V’TÚÞÕQ’•U›VYÖ[T›XQÜØ›žY[ž
ÙÒRÑZÚRÚ’M”ZÜÕÛRœXÛœPÚ\Ø[Ü\^]\ÓÌšM“Ð]ÜÕÞS\“^ÌS˜–L™MÓÍ]ZœMÓÍÝÎ•ŠÔŽKËËÌQÞ“SÍœØZY›
ÒŒÚ[S˜Õ›’Ô‘SÎ’šRYQÚÕPLÐVQPYÑPPPPPPPPPPTRQURÐ[ÓQU”˜ØRŽR”ÙÜÓ^S‘MSÞŒPTZÕ’ÚÞU”–ÛY–[U›ØL^Ù›ÑÑšR]TÜV›˜PÚÜRÞ]œÍÙMÝŽNÕN]™ÞŽ’žÔ]˜›LÒÝ[›ÜVÛÞQÙÖXŒ›–™TÚÔJÓÑ]žRXÑžSÐTPÐYÑPPPPPPPQPYÓQP”XÒPÙÝÓ‘UQšØ’QZÒž[ÝQL“ÑÎ‘šÚ”Õ•šVÐš–›[ØŒÒŒYR
ÙÖUÒZM
ÔÛYÒÔÛÜ’ÊÞÝKÝÎ“ŽTŠÑÊÙ•M™UŒ^N˜š^œœ[[ÖŒ–›ÓZRTÐY–XÕÍ\VŒ“™Ö›ÕLP“”ÚÙTUÕÌZNÞYÛRÒYÒØQÔ˜Õ‘’T‘Í‘[ÒÐXÑÐ”UQP]ÒPÐTQOHŠKŠNNKTQPÐYÓQPUQÐÙÒÙÜÓQÎQZU‘žØRÌMÓž“\’^ØÐÎ]MÚL\ÍÐÝ\YZ›ÒŒ–›ÔMQYÒUÕš›•ULRÔšÒJÓÞ˜ÌTÎÚYÛRÒYÒØQÔ˜Õ‘’T‘Í‘[ÒÐXÑÐ”UQP]ÒPÐTQOHŠKŠNNMÌËTQPÐYÓQPUQÐÙÒÙÜÓQÎQZU‘žØRÛR›V›\Y‘ÚÜ›\ÜÓÌ\ÐžÛ“ŒLÓ‹Ú]\NKÛËÔÊËÝ‹ËËËËËËËÍÎJËÜ]”Ý^œ]UÌÙ–Q^SU]“LÒÞ[›ÍJØ[ÓšRT‹ÙLÖžX•ÛQžU‘“TÑTTÌSZN’ÐÖZ’PŒQžTÑÌÐÐXÑ]ÒPPPPPPQ
ËËËËËËËÊËÙžŠÔŒMÜ“ÖÝ•ÌÌÒž
ÍÜœQØÛÓÐÙÎ\V‘ŽV•‘NR”‘“•\’šRYÔ•T‘[ÒSPPPPPPPPPPPPTRQP”XÒÝÌQZVQÞR”ÚÝUM”Ó’U‘–ÌMZV•Ú˜›‘ŒšÙ’YÖRÑÍÑYÍÐÙÖžXÖØŒŒ\Ø[ZV‘Ñ™–œ‘‘“ÔÌ”ZŽÓÑ^S]ÜšSYÒœÖQšTÑPMPÝÛÒÐXÒØÒ™ÕQ”UQ”UQ”VRÙÒÙÝÓ‘TÑ–VQÞÒ^V\Î“žœËÔLUU–˜–QÕœXŒÔYÒšUØ›ØY]ÍÜ^ÕŒÓÔN–ÊÝžŽKÝ‹ËËÝÎKÙžÊËÜŠÙšKÙŒŽ]–TŽ“ÝMÝÓÝœM[›ÍJØ›SÔMQLÙ˜Œ™•ÌYÌMÓ^N’Ô]œžM]ÕÞ\Œœ\”ÚœVÓšVUÐ™–XÕÌ[Ö‘Ñ™UÌYUULRÔšÓTÌSZMRžSY’™ÕQTLÔXÑSPÐTPPPPPPPPPPPTQPYÒQ]ÔQP”VQÐÙÒPÔ[Ó]Ó‘ÎQT’U–VÐšØ’Œ’PÒZ’”Ö[ÒÔÜÝ^S‘MÚÊÔQR‘TŒ”Õ•™VŽZV•ÙX–ž™›ÑÚV^TZÍXX[˜PÚœ[\ÜÒÌ]SJÝØÕ\ÌÔLX–ŒÓ‹ÚMSÙœÓÍÝÎ•ŠÔËÖKÙÐ™ÍÒV^TÜV›˜QÛ\Mž]Ý^Û“Œ˜LÝSMLÝÎÖ
ÝŽÙÊËÙžÊÙ™ŒÞ›•žœØN]ÛYZÛÚPÙ–X‘Ö™ÕÛ“ÔÕRNž’]ÐÔY‘ÞÕQTMPÔXÑÐ”TQPTQ™ÙÒÑUQÐŒ’ÔÎÔÙUÛTÙ’SÑšR\SZ›ÊÔšÜÕQPRPQVTÐPPPPPPPQÐ]ÐPPT”QYÖ“Ñ™ÐPPPPPPPÒLPPQUÐ–QÕZPPPPPPPPZTPPPPQÒPQžPPPPPPPPUYÐPP•ÐP™TYÐPPPPPPPÒRÐPPPTÛÐTPPPPPPPPXÑPPPP‘TTÐšÔUÐPPPPPPPR]ÐPPVQPPÒPPPPPPPPPÐTÐPPPÔÍRÚPPPPPPPPP]SÙÐPP‘MPšÙÕÐPPPPPPPRÚ”PPPT–RYÐRPPPPPPPPPÍTÐPPPSÐ]ÐSÐ”PPPPPPPPVQPPPQVTÐQVVPPPPPPPPRP”PPPZÐPPPRPPPQPPPPPPPPPTPPPPQÐPPQÐPPPYÐPPPPPÙÖPÐPRÓÐUPÙÖ[QÐMPPVPPPPRPPPPÔPPPPZÐPPPUPPPPQPPPP”PPPPVPPPMZPUPÐOOHŠKŠLLÌ‹–™Ó›PUÖPÜÔÛPZVQ\ÛÛÐ[[ÑYÑœP\[ÐØ™ÓPUÍÜ™Ò\SQYSŒVPÝTÌYÐPYTLÛÐ™YÒÍ[“ÔPÊÐYÐP\ÓPPRÖPPQP]ÐPXPQPPQÙÐÐPP[Ð]ÐPMQPPSÚÐPPœPP\YÓPPRÛÐPP\P]ÐPM™ÓPPSÛÐPPœÐYÐP\QPPPÝÑPP\ÐYÐPX”RPPQÌPPPÝPPP\™ÓPPRÍPQP]ÐPSÐPPSÍ“PPYÐPSPR]ÐPPPXÔQPPQPÐPQTPPSTSPPRQPPPžTPPS]ÒPPTP“]ÐPPQPPPPÌ]ÐP]QPPTPÐPPÌYÐPYÑPPQÐÐPQÐTPPYPQPPRÐÐPPMYÐPJÐQPPQÐÐPQPTPPYTTPPSÑPPPÍ]ÐP]YÑPPQÑPPQYÐPJÙÓPPRÐÐPPŠÐYÐPPPP‹ÐTPPTÓPPT“ÐPÛPPQPYÔP›”PPRÐQ\•ÚÑ™ÐPPQRQPQQSYPQ‘ÝÑ“PœÐPTPPPPÝQÌPQPUPX™ÐÞ”QSTVÒPPPPžP”PPS]ÕžTQ]›ÐPPYÐ]ÐÓÐQÕPPLÐ”PP^”PŒÐSÒSÐUPPQÎžTPRXšÐSÔV[ÐY]ÕÍÐSÐ]™ÐŠÐQ”ÑPPP\ÐPQPR]ÐPPPPPQØÐPPPœÑÌSÑÝÐRPYÕ“P‘]ØÍ–NPSÛ”ÖMPQ“ÈŠKŠLMN‹œÔS–[ÐÜÝÓÍPLSPžTTÐMPÞSÔÐ\PÙ™ÒŽYÐP\YÐšÓPS[ÐÞQÐ]TP^ÓÐXÝÐ[ZP\ÔR›YÜ’PØ[ÐÞ[’Ð]RYÜ•PÙMÌ[ÑÐÝÒŒÙÓÐÙVQP\ÐÝÔRÕ™ÝPPÖM[^PMÒž™ÓÓPÙRPÒQÐXÔÐœÒYÓ’PŒRQÐYPL™ÒÙÓQPYTÐMYÒÙÒÍÒPÌYÐNYÒÒÒPŠÒPÛPYžPYÒPYÓQPÐ’QYÚP^TRSYÓLÑRQZÐLTRVYÓšÐÒQZPÐMRZÙÓÕPÒÒPÝZ^P]R]ÙÔPÓ’PÚZšP\RYÖUPÔ’QÕZÚP”R“YÙQPÕRQ›ÛÐ›ÔR–YØLÖQÞ[PÐRšÙØšÐØRR[^Pž”RÙÙPPPPPPXV˜–œÖOOHŠKŠLNTPPPP[ÐPPPšÐPPPMSPPPUPPPP^PPPPNPQPPPPVÙÚÖQ^ÖHŠKŠLNLÍ‹‹ËËËËËËÎJÙ–MÝ]›ÍSÒL•ŒËÓ^XØ‘]ØŠÎ\™L\ÍÐÝ\’Û[ÜSÚM˜›VšUÛ’Ôš“VZRSÐÙÖJÙ’™R™žXÖ˜›L\˜[[ÖŒ–›‘ÓšVUÐ™–XÕÌ\•Õš›•ULR”ÕU”US•^Ì”ÑYšÕ‘”‘S‘ZÒ”QPKÔTÍÓÞ›Í“ÕÍÑÌ“š•LS‘L^’^SU]ÓPÎ“MSÌÓÝÜ’Þ[ÜÐÙÛÒžXÛ’šV[R”Õ[ÔZ’^SZ’ZRZRTÑZPÐY’RŒØ‘ÞØ‘ÚØQÚÖ‘Ô™ÖQÐ™ÖžÖšUÑ”•U‘””UQ”U^TÑZT‘TTQPTQPNÎÑÍ‘LQ]ÓPÝÜÓÝÛÒÐÙÚÒÔYÒPÐPPPPPPPPPPYRÙ™•ŒžXÖØŒŽ]X•Þ˜[\ÖŒ™V›V›•ÓšV[Q™ÖQŽYVUÌ\•Ñ–••›••‘’”•QNS•ÍSU]ÚÛÑV‘”•U‘UPKÔŽTÍÓÞ›ÍÕÍš•L‘L‘]ÓNLHŠKŠLŒÌÍ‹‘šUÑšUÑšU‘”•UQ“UZTQÎÎÐPPPPPPPPšÙQÔœ‘Í]V‘ŽZØV›ŒÚÓŽV‘ÛÌ”“V”Ì”œQ•œÓ‘ŽZØ›š˜UÔž™QÔšÖ‘Û‘Û˜ÌÚV”œQÔœVX›[ØVØUÛ™•Í\‘Û›ØÌÚV‘ÔšÙQÔšÖ‘ÔšÖ‘ÔšÈŠKŠL–’–šØUÍ^˜›M]V‘ÛUØUÍNZš”œÛœR‘œØV–šØUÔš”šÖ‘ÛUÖ‘ÛÍXUÔœTœVPÙRZØV–šØUÍM™–V‘ÛUÖ‘Û[ÙUÔœTœVÒ›[Ö‘ÔšÖ‘ÔšÖ‘ÔšÖOOHŠKŠLNL‹˜›šØ›M]X›M]X›MM‘Í]X›M]X›M]YQÔV‘Í]X›TX›šØ›M]X›M]X›MM‘Í]X›M]X›M]YQÔX›M]X›M]X›šØ›M]X›M]X›MM‘Í]X›M]X›M]YQÔX›M]X›M]X›šØ›M]X›M]X™ÏOHŠKŠLÌœÐPPQÔPPPP^PPPPSYÏOHŠKŠLÍ–OOHŠKŠLÍ“Z’[Ô›Ö‘Ô‘Ø›ÙUÖ‘Ô“’UÐPPPPPPPPÐPPPMPPPUPPPRÐPPPQPPPPPPPPPPQ“•Q’PT]ÐPPPPPT™ÐPPPPPPPPPPPPPYÐPPPTPPPPTPPPPPQPPPQPPQPYÔPPPPPPTPQPQPPTPPPQPPTPPŽQÐTOHŠKŠLŽN”PP˜PQÍYÐPÔRÐ\TPÌPSPP^YÑPSŒMYÑTÐPPQRTN‘™ÑYPTÕP“Q^PUÐ”PQ‘ÐU]Ð•YÑ–PU–QœPUÎ™QVPPšQÒÐVN›QÖV›ÝÑÛÐXLœÙÑÌXœÐÐRPXÚÐž”RYPŒ™ÒPYSP]ÒYNŽÒÐYœÐPRQYØÐÐÝÒTZPÑÒXZÒYÒ[PZ[ÐÓR^Z•PÓÐRNZÐPÔ]Ò’ZÛÐÕÒ”[PÕÐR˜[ÖYÒ›[ZÐØR[“PÙÒP[ÐÙÐRÑ[ÖPÚTRÓP[ÎÚÙÒÕÐ\ÐÛRÙ\RPÜRÛÐ\\ÐÜ™ÒÞ\”PÝÒÍ\ŒÝÐSÐ\ÕPÞPS\ÍÌSP]PÌ”SÐ]ÍÓÐ]XÐÍ™Ó]NÎÓP]˜ÐÊÙÓPYÐQYÓQ]ØÑÙÓS]ÎYÓU^ÑÙÓXÐ^TSZÐ^XÑÔS\Ð^MTS^^–QÐSMÐ^ŒPSÐLQÓ’LÑÓ”LSQ”S–PL[ÑS™L‘QS›PL™Ñ]ÓLŽÙÓŒLÖQTSÐLÌÐSÐÐMQÓPPPQÜP\^]]ÔQœÓÞ\ÍÔÌÖRÓÒÜÓQMP‘TÖUÒš–‘Õ›VŒš[]Ø•Í]˜ÒžXÌÔŒHŠKŠLÌÍŒ–PVPPTQÐPP›PÔPPMYÚÐPQÖRÐPQPÙÐPV™ÜÐPSÖSPP›QPPMYÝÐPQÖSPP”QÐPLMPPÐTPPQPPPZÐOHŠKŠLÍYÑPSÖPMYÐPPPPPMYÑPS\YÐÊÐSYÐPPPPPSNPÊÐSLÑÐPPPPPQÐS’P^PQPS’PLÐPPPPPMYÑPSÖPMYÑÐTPPPPPPPTPQÜPR]ÐLÐQÐPPPPPQPM›ÐPÓPSYÐZPPPPPPNPÙÐSP]QÐS’PPPPPPSÖPNPÜPSÐ]PÌPPPPPQPM›ÐÐÐSYÐ^PPPPPPPQÑSÐX–PZQÐSÐPPPPPTÐQ]ÑØSPLÑÐPPPPPPSÐTÝÐÝÓPPPPPPPPœÐPPPPPPPPRÐPZÔPØR–PPPPPPSYÐNTP[PPP]ÐPPPPPPPQÝYÐP^PQPSYÐ^PPPPPPPLÑPPPPYÓQP”VRÐZÒÐÝÝÓ‘ÎQT’U•UÑžÖ‘ÙÐPPPPPPPœØÒ’PÑZR^T[šXÛÒÔÛÜPP\ÈŠKŠLÍÎL“PPPPPPPPP]HŠKŠLÎM‹“ÏOHŠKŠLÎÌË“PPPPPPPSTOOHŠKŠLÎM‹“YÏOHŠKŠLÎŽ“]ÐPPRÌPTPP™ÑPQÐ]PPPPPPÊÐSLÑÐPPPPPQPTÐ[ÐPÕÐSYÐ^PPPPPPPJÙÐQPXšÐ]ÝÑSPPPPPS’PLÐQSYÐJÙÑPPPPPQTÐSZ“LššÍ”
Ô”ZÓ‘TšÙ”ÚÝUMTQ‘”ÕLT•ÐPPÕÐR]Ð]PÌPPPPPQPSYÐXOOHŠKŠLM‹›ÐQPSP]PPPPPPLÐQÐSP[ÐQPSYÐPPPPPTPJÙÐšPPPV™ÐPPQÙÐPPPœPPPXÐPPPRPPPPPPPKÙÏOHŠKŠLM‹›ÐPÓPR–P\PPPPPPL™Ð^V‘PZÔPÜPRÐPPPPPPQ[Ð–Ñ]PPPPSPPPPØÐPPQPYÏOHŠKŠLMŒ“U^“•LÓÕÍÔÔQQÔ‘U‘ÔŒ”ÚÝUMTQ‘”ÕLT•ÈŠKŠLŒ™ÐÌSÖPMYÐPPPPPJÙÑP‘TÑ^UÑžØQÞÙPZZT[šXÛÒÔÛÜØÌÝQ]ÐPPPPP]PÌS]PPPPPPMYÑÐSP]PÌRÐPPPPPPSÖP]PPPPSPTPPQQPPPMPPSÔTPPQPPP‘PPTÝÔPPQLPPP“ÐPPUÔPPQQPPP”PPU™ÔPPQ˜ÑPPP™PPVÔOHŠKŠLÍŽPÙÐSYÐ^PPPPPPPLÐQPRÐPZÑÐS’PPPPPPPTP‘ÐQÙÐR]Ð^PQPPPPPPQÐSÖP^PQPSYÐ^PPPPPPP^PQPRÐP]™ÐÝRÎPPPPPSYÐLÐÜPRPLÑÐPPPPPPQPT™ÐœYÐÜPSP]PPPPPPNPQPV–P]QPSYÐPPPPPS’PJÙÐÕÐR–P]PÌPPPPPP\ÐTÝÐ›ÐPÒSÐLÐPPPPPPJÙÐVPXPP\YÑPSYÐPPPPPQPP•QÌRÐPNQÐPPPPPPQPTTP™ÐÌSYÐMYÐPPPPPNQR–P[ÐÌSPLÑPSÖPNPšPPPMPPPSÑPPPPÚ’ÐPMÐPPRÑYPPPQTPP\ÔPRÎPPPÞ’ÐP]PSÙPPQPPPP\PRÕYPPPÜÐP\^PRÌPPP›PPPMPPPSÚÐPPPÍÒÐP]”PSÙPPQPPPP]ÔPSPPQÐP^PSXÙPPPœPPPMÐPPPSÌPPQ’ÐPRÔQPPS\ÙPPPPPPNÐPPTPPPQÐPNTPPPSLPPQPPPLPS‘YPPQ’ÐPL^PSšÙPPPÚTPPLÔPSœÙPPQ’ÐPMPSÓYPPPŒPPPPJÔPPPTÐPPQ’ÐPXTQPPSÕYPPPÝÐTPPMžPSÚÙPPQÐPMÞPTYPPPPPPPNPTPPQÒÐPJÔPTYHŠKŠLM‹YÐÕÐSÖPMYÑPPPPNQPPPPPP[PPPPPPPPPPPYÓOHŠKŠLMKTRQUQÐÙÒÙÜÓQMP‘TÑ^U‘šÖQÔ›ÏHŠKŠLLÌ‹‘ÞÙPPYRPZZSZÐPÕ[PPPPPPØÐPPÙÐRÔP\PPÜÐPPPPPPP\ÐPÌSÐPPPPPSÐPPQPPPPPPPPPSTOOHŠKŠLLMÌ“YÐ^ˆŠKŠLLNMK“PPPPPPS”PLˆŠKŠLLŒ‹“ÐMQÐ\”PPP]ÙÐTOOHŠKŠLLKTRQPTPPTRQPTQ™ÒQPTQÑQPTRPÔ[ÑPPRPÐ[ÑPPSÝÜÓPPSQ]ÓPPPSPTM‘]ÑP]ÎÖT™ÓRT\ÔÝÑSPÔ]Ð‘ÖSÐÔMÑÎÒMTYÎP‘TPT‘QÑTZÔ‘UZPTËÌÎPPPP[ÐÓPSÐLÐPPPPPPPQVPVRÐYRšÖ’PÐYÒ^PYÒÐÜœMÐYÐOOHŠKŠLML‹žPPPPSYÐPPPÔPTPPZÐQPPRPPP–PYÐPUÐRPPQ™ÐÈŠKŠLMM‹ŽPPPRÛÐPPPÜPPPP\YÐPPRÛÐPPPÜPPPP\YÐPPRÛÐPPPÜPPPPPTRSP]ÌQÕSPPPPTRQUQÐPPPPPPPPÝÝÓ‘ÏOHŠKŠLMM“YÐPPRÎPPPšÐPPPSYÏOHŠKŠLMMŽœÏOHŠKŠLMNM‹‘PRÑP–OHŠKŠLMŒŒ‹ÌÎPSRPP\ÐTPPV]ÐPPQÓPPPPšPPPPPPPPSRŠKŠLMŽOOHŠKŠLMŽ”QQÔL‘”šÙTÕ\LSÕP”•[•U›UÕÖYÖUÒšÖ•ÙØUÝØ›N^ÌÔŒ™ÛÙ’YÛÔÑšS–JÔšÍUÖVY[ÒÒÚÜ›\œœÞšM˜‹ÐÞÙ’Þ™]˜ÌÊÓ“ÞŽ˜KÔËÈŠKŠLMÎL‹‹ËÍÊËÝÊËÝÊËÝŒÎKÙŒÎÔÊËÝŠÝ›JÔŒÎKØŒNY•ŽÓÊÌÜ™Y›
ÒŒÙ–LY^˜Ý’^ÒËÝMÚL\ÜMœœ“ÙÛ’šUZÒ^RZMÙÒXUÔ™ÖU›”•ÞÔŒÔQÕÌS^‘]“ÛÛÒšTZRPÞÖ”“TÑPMPÝÚÒ™ÔQTOOHŠKŠLŒ‹ËÍÊËÝÊËÙŒÎ
ËÝŠÙšŒÎ]–’Ý^œM™Y›
ÒŒÓœ–LYžŽÓXÙ‘ÎËÝ˜M]ÔÞ\ÒÌœœXXZÛÖŠØÛ\UZÛÊÓZ[ÙQYÖMÙRž˜ÑÞ›S™ÖLX•ÛÕ•“”ÕQNS•\”ÑV‘”‘SÔQ
ÔÍÓÚšÍž˜Ì“•L^’^SU]ÓNSMÌÓÝÜÓÝÜÒÞ\Ü’Þ]Ü’Ú[ÜÐÙÛ’šV[ÔZ’^RZTÐYÒRŒÒœØQÚÖ‘Ð™ÖžUÑ”•UQ“UZTÑT‘TQPNÍÑL‘]ÓÝÜÒÐÙÛÒÔZÒPÐYÒØÒ™ÖQÐ”UQ”TQPTQP]ÓQ]ÒPÐYÒPÐYÑPTQPTOOHŠKŠLŒÍK”’\PÎSÐ‘ŽZÐSÐ]PQVRÐP]PPÌS”[ÐPÌPLYÐRÞ\ÜQRÐP\RÚ[ÐS”[ÐPÚÜÔPLYÐPSÙ‹ÞŠÌKÍ^‹ÙËÎ\KÌRÓ‹ÎKÝÖÍÔÕÜœŠÛÙ’KÛKÊÕ™ÚT
ÐÝÞÙŽ]‹Ì›KÖLÎYX‹ÕSRÙŒKÙ™ŽÝž‘‹ÒÞŽËÞ‹ÑÒÔÝ‹Ð˜ŽÙšÊÎÜÝVŠÍÖ‹Ý
Þ˜ÒœÑJÊÝŒœMŠÜRšTŠÛ”›Û
ÙÌÍŽT˜ŠØÔ\]›TŠÖVT
ÔËÍQ›ŠÊÓÖ™šL
ÒžËÚŠÑ”Ý™ÚJÐ\™–ŽNÜTTNLÚŒÖT^KÌÑ‹Ù‹Î]YŒž‹ØLÎ\ÌšÖŽ[Œ”Ö[ŽYËÌŽKÖŽXÙŒ\ÔÖNVQXT”ŽUŒRY•RÎY“‹ÕRÞŒŽNQÖ”LŽP‹ÌÔÎ[žÝ“ÜŽU™”›Þ“‹ÓYÎÛžŽ“ŽÕ\’ÖÑXY’”ÎžžR™’SÎšž’•‘ÒËÑ‘NÍÞÔPŽ]ÌYËÎÛÚËÐŽNÙÕYMÎÖÑTÊÕžJÍMÍ”š™NMÌ“•NÞS‘KÍÝS^™MÜTZMMMÛUU
ÍÚVQSÍÍÍÙYLŽMØ[ÌMÕÝŠÌPÍÔÍÝÝLÙ’ÌÙ^’ÓÛÙ^SÒœÖ™^ÑÜÒÝ]ÕÍÐSÍÊÝ˜ŽœÝZÜ™]]ŒU”Y\ÝžœŠÝŒS^ŠÜNœ[œ[\QM›’V
ÜMšœœRŠÛÕ™ÔNÛ™M˜Þœ][[Í–˜œÛM•Ò
ÚÎM”ÞœÝZÒM™™›Í]Z•M“TÜÝZYÍ’KÛÙZ‘ž›ÔÊÙÍÍÜ›ÑÙYÒM”›JÙ–N›Y[MVšYML–•™Y^–’™XÕ]ÖŽ]X›M]›^
ØM\Z›[YXRÍ[›XJÖ˜ÍZÌÛTV]ÍZRQ]VQ]–]VMXÛ›JÕÝVÛÓÕÐÍVU–MU\›Õ]TÒJÕQÍYššÍŠÕMS‘ÝÊÔÌRÛšÛ“ÔÔRSÙT›ÍQžšÕ
Ô‘QšÒÝTYP’Ð™UM
ÌÚTš™SÞ–›]SÓÍ™
ÓœÍ’•S“‹Ú““Ó\MÚ‘“ÓRËÚNSÓMÚLYSÍÑ]RÜÍS[SÒÓÍÕYJÒžYšVR•MÝšT]RMMKÚRRYQÒQœšRQ“ÒMÙšŠÑÌÍKÚ
ÑÙ™šŠÑÒMQSÑžÜš]Q˜•Q‘ÍÚÓÑ^Üš“ÑY˜šSÑRÍTÙQÍÍŠÑ‹ÙÌ™QMMÙÞYQÙÝSÐÞÍÙÜYPÚÍ‹ÙÛ]PÕ’Ú“ÐÒTÙP™ØÝPMÜ™ÖPšMÙÕÝP–”Õ
Ð“M[™Ô™PÍÙÔÐMM™ÓJÐ^ÍÙÒÊÐ\Ù™Ò“ÐZMÑÒPXÍœ™ÑÓÐUÍ•Ñ]PTKÙÑPS]™ÐÝPRZ™ÐŠÐQÍVÐ™PQMTÐJÐPÍSÐ]PPÍSÐYPPÍSÐ]PPÍSÐJÐQUÐ™PQX™ÐŠÐRM[™ÐÝPSLÙÑPT’Ñ]PUM˜™ÑÓÐXMž™ÒPYÍÓÒ“Ð[Û™ÒÊÐ]MÓJÐL™ÔÐKÍSÔ™P’^™Õ
Ð•™™ÕÝP™MÓÖPœMÍÙØÝPŒ™ÙPÑY™Ú“ÐÔ–Û]PÙÕÜYPÝMÝSÐÊÍTÞYQÍ•Ì™QÖÍŠÑ™ËÙPQ\šSÑUÍŒÚ“Ñ\MÓÑKÍXšQ•Mš]QœMSÑÐMZšŠÑÖ‹Ú
ÑÝ™šŠÒ“ÒÍ[šRTQÒUMÚRR]›šT]R“VR›’YJÒÑMÍÚ[SÒÚM^š]SMÜšLYS\šNSÓÍÛš‘“ÓY\š““ÓKÍš•Sšžš™
ÓÑÚ›]SÛÒ™TVTÛš™TTPŒÚÒÝTLQTÕ
Ô˜ÍQÚšÙTÐÍRKÚÛ“ÔÜSšÝÊÕMSÚÍŠÕPX›JÕZTËÛÕ’ÍUš›UŒVSÓÕÙMXLÛJÖY›]VMTTQ]VZZ‘TV“[›XJÖÍ[Ü›[YX[Í\š›^
Ø–]X›N]VQ^’™XÌML•™YLÖšYUM–Y‘ÍNY›JÙ]Ú›ÑÙYÜM‘›ÔÊÚÍ‘ÌÛÙZT’ÑÜÝZ‘“•Í]ZŒÍZœÝZÜÍ•Ü
Û–ÛUÍ˜Zœ][“M™ÜÚÑšRŠÛÍšÞœV
Ü›Õ[\\œžœ^ŠÜšM•PŠÜØMžLÜ”Y]MŒ™œ™]]S’Ý’MŽ]œÊÜÐÍÐ˜œÒÝ]ÎMÑ’Ö™^MÒLÜÛÙ^LMÓ[œÌÙ^žÐVÝLMÕSŠÌ\ÖQÌœØŒÝLÛÙSÍÚœU
ÍZÍÛ›ZMšÜš^™MÚMÝšQNMÞš•NZMÌÚš™JÚÍÛžKÚÍËÜ‘T[ÕY›ŽÝÚËÐÜÝÌY‘ŽRÔ]NUËÑžYž‘ÌÝž’MÞR™’NXY’ÐNž\“NžN’RŽQ“‹Ó“Î–™”ÕNžÝ”ŽÑÔYŽQŒ”›RÌÜÎST‹ÕNP\ŒRY•MNU’XTÐNVšŒ\ÔYÌNKÕTZYŒ”Ö–[KÌšØYŽ\™Œž‹Ø›Ž]‹Ì‘‹ØÝŽLŒÖTMQÜTŽN[ŒÎ˜ÒÊÐÓÝš
ÑÝËÚXÊÓ™š›
ÔÍšÝŠÕYVTJÖ’\]›‘
ÙNTÓŠÚV”œ
ÛKÍšTZ
ÜœŒœœŠÙÕÒœÌŠÌÍÖ‹ÝPJÍ[ÜÝ“
ÊÕËÙœÕËÐËÎÔÒŽËÞ\ËÓVÝžŒËÐ‘RÙŒPËÕŽY“‹ØXŽ]‹ÌÖKÙ’PÝ‹ÚžŠÕ™]‹ÛÚŠÛÙ‹Ý
ÍÔ‹ÞËÓ‹ÎT‹Ìœ‹ÙËÊØËÍÖÞ‹Û‹ÝÐPQÔP^PQ\ÐVPŽPR–P\ÑSÒPJÝÐUPTÌ”™Ñ™VÐšÔQÜXÔPŒÔRTNÒÐR[ÐØÝÒÓP\UPÝ™Ó]PÐÔSZP^œÑSMQÓÍNQQ™ÓQÑS”T“Ð‘ØÑYÐTÖ“Q^YÕ”ÑQ”U]P•VQ–Õ–‘QœTVÐ™ÑŽÕSPšUQÔV•Ð›NÚØYÐœšÑÌXœP™ÒRÝØÞŒÒYPUR”Y‘ÐŽMYØÔÐØÒTÚPÒRZPZYÐÓÒLZœÐQR‘ÔZÞÕZÒ–T[PÖ‘RœT[ÙÒŽZÒÚQRÓÔ\PÛYÒÙÐ\VPÜNÞÜ™Ý–RÑÜÛÞŒ]ÐÍS]Ý^PÎÓ]ÞSRÝÊÑ•SX^QQœÓ\ÙÞ’‘ÐSN]ÝÓÑÕS”LTÑÚÓ™ÐL–MžLØ‘’SÐM‘•SÕMZQšÓÚÍ›ÓÌÍÛÑŽÑ”N‘TÎ]TTJÝ‘TËÝÑÖTR^QQXÔVž‘RYÔ[šÞ‘SYÔLÚ‘PYÔ’^‘UYÔ–‘žQVXÔ›‘ÞXÖTŒžÑTUTÑÔ’]QZÓTÕžœÑ[ÐTÛ’Ü\ÌQ]œÔÑZ‘^˜ÕÞ™‘LÓUØ‘MŽÞÑJÛÕÚT‘ÕUSÐ”“Q‘ŽXÞÑÑ’šÕ\”ËÑ““UMZQ]Õ’^•TU•žœQ–ÕšžÚ˜”Už‘™\Õ‹Ô•TQšRUÓ–‘Ñ›ÕØZŽ›ÍÛž^œÓUÌP˜›Q™ÕÐÔ˜ØQž]Ö™ÑŒVÔ™PÑSV™LQŽVZ›‘‹ÙÖÐ™Ö‘ÐÚÖSÚÑÑœÖX^ÑÒ\Ö[^\‘ÓÖ^^˜‘ÓÜÖJÞÒÑÔ›Ö’ÔšÍQÕYÖ•Ð›‘ÖVš›U‘ØTVœÞÑÙVŒÞQÙŒÞØQÚYØSž‘ÛXVZÑÛZœXQÜYØ]‘QÝXLÞÝ›ØPÐœÕ‘ÞRX“PœÎQÌØ•žÑÌÑX™šSÍYØœ^ÍÌžZ•ÑÊÓXÞÑÝØØÑ^Ù’ÜØÓžNÕÞRXÙ”žR’”XÛž\RXÝÔž“R–XÍžœÒØÐTŒR–YTŒ’YPŒRÒ”Y[ÒYŒ‘’NTŒšR]ÙŒŠÒØÙŒØRSYÐŒÌŒšÙRPÒYSÔP’ÚÙUTV’QYXT^™ÙYÐ’RÎ[™RUY\ž’›Ù]ÔÒRÎLZØÒSYMšÝÒ–YKÔÚÙ‘’Ù’TŽ’]Ù“ZÒŒ”ZRR•ZV]Ù–TŽ[RœÙ˜žLÚÙ™”ŠÐÒYšZ
ÓÒRY›
ØRM›Ú
ÛRšÙœ”ŠÞÔY
ÍÒÍÔ‹ÑRÙžZÓ’ŒÕ’XÙŒ”‹ØÒM‹ÚR
ÔYZÛÒ
ÛÙÐ‹ÝR
ÎŽ‹ÞRÓYŽT‹Ì’ØÙŠÐ‹ÍRÛÙŠÞÍÒÝÙ‹Ô‹ÎRÍ‹ÚÊÒÍ‹ÚËÒÍ‹ÚÊÒÍ‹ÚÎRÌ‹Ð‹ÍÒÜÙŠÚÍRÙÙŽ^Ì’ÕYŽÞRÑYÞÝR
ÝÙšÛÒ
ÖYP‹ÚR
ÐYŒÚØÒZÙŒ^Õ’RYžžÓ’ÙžÑRYš
ÍÒØÙŠÞŒœTŠÛR’Y›š
ØRVYšÚ
ÓÒÙš
ÐÒÌ™TŽLŽ˜^[R‘Y–ŽVRY•ŽRRY”ŽÒ’Y“Ž’QY‘Þ’ÎÔŽÌNZÝÒ[ÙMØÒY^žÒRÑY]Zž’]Ù\™RYZž’RÐYYP^ZÙVTV’YTÔP’šÙSPÒPYQžÖYKÔŒÌ]ÙØRYŠÒ•YŒšRšÙž‘’ÙÚ[ÒŒRÒPYš’ÑYšRQY^œÒÑXÌZ“RQXÝž\RŽÛžR’ØÚRœØÕØÒÞÙ’“XÐžÑÊÎ•ÑÎØ”^Í”X›PSÌÍ˜ÔÑÌXØ”ÚÎQÞX’ZÕ‘ÝÙØŠÚÝLœ‘QÜ–X\PœXQÛÝØYšÑÛRXU^‘Ú˜ØRÐ›ØQÙÜØKÔ›QÙŒ›ÑØ“Vœ›U‘ÖUV™‘Õ™Ö”ÐšÍQÔÚÖ‘ÚÒÑÙœÖMž˜‘Ó\Ö]^\‘ÒœÖZ^ÑÑÜÖUÞÑÑÖRÔ™Ö‘ÐYÖJÐ™›‘ŽVV™LQ”VÞPÑŒÑVP™ÑžŒ˜ØQÚÖ
Ð˜›QUÝÞ^œÚšŽ›[ÕÕÐ–‘Ñš”UÒZTQŒž‘˜ÖU•Ú–N™•œQ•˜Õ”•^”‘–Q“ÖULËÑ’ÝÕ[T”ÑÑ’UV“Q‘ÕR””T‘”šÑNUžØ‘MÕÞ™‘LÕžZ‘]Î
ÞQ]TÝšÜ\TÙÐ’œÑ[ÔÔ^]QZÔÐ”“ÑYÔžÞVÔšžQUŒ”Ð‘^‘TÐ’‘S^PÞ‘RZPž‘QŒTž^QPÔPšÑ\ÔJÝ‘ZÔÝÎ]XÔTN‘TÝÍÛÑSÝM›ÎÙTMZQÝÓÓ”M‘ÙÓÎÌØ‘ÔSœ™Ì–PS˜TLTÑÓ’”LÑ˜ÓM^’‘S[]ÞQQÝÓU”]ÊÑØÓQP^ÊÑSYÝ^PÍ\ÓÝÝÐÌTS\ÛÝÍYÜ™ÜØÒÜÜVPÛÐRØP\PÚšÒÒT[ÒÝ‘RŒ”[ØZÒšÔ[PÕÑR”ÔZÞÔšÒT[œÓ‘R]TZYÐÒYÒXÐZPÑRÙÔÔRÙÙ‘ÐŒYPŒ”RXÞžÒYÙœPQÝTXYÐ›ØÑØÖ•ÐšŒÒ”VSP“QŒÖÐ˜ZÑšÔU•Ž”™Õ]P”•Q‹ÐU“[Ñ\ÔTÖ’PQVÔ“Ð‘QRTQ“ÛÑSÍMNÓLTQÝÓZP]ÚÑS\ÜRÓP[“PÕÙÒZYÐÑÓYžQÜV‘P™PQ™UVP“QUPYœÐMÑRÎ[ÐŽPQÔPTÝÐ^PPšÐSPPPPQPPPPPPPPUPPPPRPPPPÙÐPPP\ÐPPPSPPPPPÐ[MÖÓÚÓØ˜ÞœŠÝÛÍZTZ’]SZRÕ[’ÓYÌÚÕZÎTÛÜ‘U›[ZJÜ\Ø’Ý˜RQÛÕLT•\™[ÚUÛÜ]]ÜØM›ÛÒšTšMRš–”ÙSÍÝÓQÎ]ÕÔÙ‘Ó’ÓZÐ”RQ‘Ô‘›UÛ’ŠÙ›–V›VžZX“ËÞ]ÍÖ^“[ZŒÙÔÞ›ÝRÐÚÝ“ÚÚ˜[œQÚÒ”ÕšÖ[PYÝVœÖUÛÒ\U[\™RÑÙ’›Ö[Pš˜LÚR[M‹ÐÌÛMJÓ’ØÚÎX”ÌMSž™ÎTLU‘–••ZÌRTZŽ
ÔU[ÖŒÞUN˜Ž
ËÕŒXÐÜ[Pž‘ŒXVÑ›ØÒYŒÎMÙÝŒRTšÚÕÕÖŒZ“Ùœ\\›SLœ•Ö‘•LXXLÊÔÜš‘žŽTÞ˜ÔÍ\˜QÕÚ›ÛRSšÖ’Ôš’TQ•“ÓÐ”QQ‘ÚP›\‘ž™ZKÝ]ZÛ^YÒÕÜ\œ‘ÝÜM“ÕÚÖš•URL“LÚÚ˜LÍ“Û’Ø\\XSÖZ[Ö’’ÔÑ\UÛYYÚLPPP[PPPPSPPPPÌPPPLÐPPPSOOHŠKŠLLLŽž]]ËÚPÖRÐQšÐQÑ‹Î‹ÎÓU˜ÐÑÐRÎPYÒQSXÌ“PRÕPUÍMPÑQÙÐ[‹ÊØP–P–Ž^ŠÍœŽMRŽPSRÔPSP[‹Î]ŽPQÐUPQKÚØÐ\ÑËÌÛÐM”PÚS–Ñ™ÒYUP›ÑRÐV[ÐÚÐ”PSÝÐTPQPTLœÝÐLPR]ÐQ]Ñ[TÙÐ˜PPPV™ÐSÑÌPXÐŽTPŽPQÐšP\ÐS\ÐMYÐU‹ÊÓ
ÑÐœQÐ\ŽPSP]ÑÝÐQÒPNŽ\Í‹ÝJÕ\›TÕ
ÌŽŒHŠKŠLLLMŒ‹™ÐRPYÐPÔPRÐP\ÐQPSÐPPQYÐUPP–PQÔPXÐPÐPR]Ð[ÐPÌS]ÐMPQPPTÐ”PQ›ÐV”PžPRPPZ™ÐÙSP^YÑPPP’QJÐUØÐ›RTPPÓÐRŠÐ\ÎØÔSÔ]ÐQXÔU’•™ÖYÐRMZÕÓ]ÎQÐT]ÞÑLØÕÕÐ›ÒPYÚÔ’ŠÍÜÑ“ÐP\šÙZÕRU˜–›V^˜ËÎKÈŠKŠLLLÌœS]ÔTPPPPPÛÞLšPPPPPPPPPPVÝRšÙÛPÔNž™ÚTÑNQ]Ú•[ÒYØÛÐ‹ÓQÝ™ØS›ÑÒÝØŽP™QœTUÐ•Ñ“ÐUUÐ™˜ÑL]ÔÍÐ’ÐQZÔP‘˜ÑTTT]šÑPÕPJÔQPTMÖQPSÖMÓžL•QÓ“^YÓZÐ^ÑÝÔ
Ð]’PÍPSP\ÜÐÝ™ÒÞ\TPÛÒÓ[ŒØÙÒšÐ[ÐÕRPZ”PÒÐRXÐZPÐ”SÐYPTRYPžÑÍÐX’PœPQÙPV”PšYÑÐVÐ˜™ÑšUœÐ•PQ’PU“Q\TÐP‘ÐQSTTPŠÙÑÐSØÐLÐQPSYÐ]ÐPÌPRÝÐ[ÔPÖPRMZPÐRPXTP™PQ–PUP‘QÐSTP[PQ™ÐSPTPJËËÞKÊÛ‹ÍÖÎËÞ
ÍËÍÓÜYŠÙËÍVÚ™ŠÐËÌÜ‹ØÔ[KÌ^‹Õ]ŽR‹Þ‹ËÓ™Ž‹ÞSÑ‹ÎËÝÕÊÝÞÝYŠÌÙÕÜÜŠÝÔŒ‹ÜLÊÛËÍ˜‹Ü
ÚÍNKÛ”
Ø]Y‹ÛŠÕPËÚšŠÓ‹ÚŠÑÝ™ŽMÔÚÙ^YŒŽKØ’\Œ–KÖ^ŽY‹Ì^‹ÕØŽUÙŒSKÕÎSKÌËÔ›ŽPÝŒËËÔYž–KÓ^Žž^‹ÒÕTSÒÎÙžKÑ–™ÍÐØŽÙÑËÔÍ”JÍÜÜSÊÌØÖŠÞUÐ›
ÜÕ›‹ÜJÛ’ÔŠÊÙ[Ù›ÊÕPÙ›”ŠÒœTÛJÓÚŒÜKÙÎ^^ŒÍ‹Ø\N[ZŒ’˜šŽXQYÔPMLÝÓÌMÑ”S^PTP\ÖPÜ]ÒÔÐ[›ÐÖR“ÐZ›ÐÒÒUYÓPÎÒYPžÑÍX\Ð›ÑÕVXÐ™QžPUÙÐ–Ñ•U]Ð”]ÑMÐUP“QZÐTŒ‘™ÑTPTZÐ]ÒPTÐNÑSØÐMÑSšÐLPQPS]Ð^ÑSPP]PÍSP\ÔPÝPRÛÐ\ÐÚÐRÑP[™ÐØRšÐ[ÐÕR‘PZ™ÐÓPRZÐZÐÑRSPYÐPŠÐRÐYYÐRÐYPžRPXÐPQÝÐXYÐœQØÐV™ÐšÐQÓPVTP™ÐQŽVP˜ÐQœÐUÙÐ–PQ˜ÐU™Ð•Q”PU]Ð”ÐQPUÐ“ÐQLUP“Q\ÐTÙÐ’QYÐTÐ‘ÐQUPTP‘PQSPTYÐQPPTPPKÐQTPNPQÐSÝÐMÐQÐSÔPMPQÐSÐPLÐQÐS™ÐLQPS”PLQPS]Ð^QPSYÐ^QPSPP]ÐPÎSÐ]PPÍSP]PÝÐSP\PÜÐRÙÐ\PPÚÐRÔP\PÚÐRÐP[ÐPØÐRÐ[PPÖPR™Ð[PPÕPR”PZÐPÔPRPZÐPÓPR]ÐZPÓPRYÐZPPÑPRTPZPÑPRPPYÐPÐPRPPYPŽRÐYPRÐYPPRPYPŒRPXÐPÐRPXÐPœÐQÝÐ^šÖžVUÌ[ÑVUÙÚÛÑÝÐSU‘ØÛQ•LZ›Q›––PSZ“•ÑÕ›LšV›Œ•V–šÎ^TÕÌ]ØP^Õ“Ö•Õš˜Q™U’•Í[ÛQŒŒÒPSU–V›Œ•V–šÎ^HŠKŠLLM‹]ÐPPPTPPPPQPPPPP™ÐPPRT[ÙÐ‘UMKÐÚÕS‘–Ñ”PV]PQV›PšÑSPVLR
ÐS™\]ÐÌÖXÕPSÛMÐS’“”YÐ’PPPÙ[ÝPPžTÌQ’RØ‘XÐSÙÊÜÑS–RPT“ÝPRžœPÌ›PTVYS˜T“ÔP•ÞšÐ[”MPR]šP[ÊØŒJÐŽÐSËÛÐTPUPQTËÝP\Z]ÐŒ^ŒÍP[“Ð‘ÕØÐ[›VKÐPÌÜVÐÍ’ŒÕPMY]’QMÎQÓÔXÐZÛÒÐT™ÐYœÕŽPÑŒ“QQ™ÐËÑVPNÝPÐÎÐLŽR›ÐMšÙQZÔPRQÊÖPZ›RÐUVÐÓ”QÙÐYÓš‹ÐPÙ•PQÐš‘P^[US[[ØÝÐÍPPXMPP›‘TÑ–ŽPPÙZ˜ÐQ›QÙÐÓÔP\UÐQTÝŒÔPV•ŽQP\PURÝÐ^™šŽ]Ú“ÐRšÙÐÍÙ•PRšŒÑP\ÝÐÙŠÑS”ŽRÞ^YÑY’ZQÛÚÙQ˜›ÐSPÌLÐP•MÔ]ÐÌQ“VP]ÞYRÌÑ]ÙÐ\ÕQPQP™RVŽT™Ñ˜ÔÌ[NXPQšPPPÌÐ]ÙVQŒTQ–P[ÞVPQLL‹ÐPšÛ”ÛÐXÓ™\QÓŽ
ÐPœÑ˜ÐQžSP’•™ÐMÌ]Ð\MPÔZž]ÑÚ[˜ÐUÛZPPYTQÚÐQØÍÙRŽÝÐ›R[Ð[U™RÞÔÐŠÙŽYÐR[UÌÐQÚTQ]ŒPMÎQÝÌÔP™TPQÖQ™ÍÌÙÑ[MRPLR[ÐPÚQÍQUÑL^ÛÞPPZš‘™ÑÙ˜ÜÐQŽ”PTYÐVMœÐSLRSTÖYÐÑÐQPNVMXRÌÙÐYM™’PTÑ\P›ŒÐÜLÙÐ\›PÐQÜ™ÐRÒÒÔPL[LPX[NÐ˜ÙÎ[ÎÑQÑNPPÒØÌÙÐ\PQËÖ”P]SPNSÓRLÝÐ[]ÕØÐU˜ÜS\–“™Ð[ÜS’P]ÛQÓP“™ÐQRšPQZØXST–žQ^TPU’ÔPPVÑTMŒRÕ[›TÕ‘PPP]ÐRPRÍÙÐU•PMÔÐPSÝÑ
ÐÙÐZÝÕÕPSQžÐ]PØ“PPÌRYÔÛPÜ’RÐS•ÙQYTÝÙÐÓZNQ•RÛšÐPœ^SXÝUÐRÕÔÙÐ™YRPNSŠÒSÚU[ÑM[ÔP[UÖRZ]Ð™––P]KÌÐQZX]P›œÝÐXÖÐRLYYÐÙ‘˜™Ð]“ÕRRL”QÙÐSPUXÐPLPTP“ÑÙÐSÍVPQY\ZÐPŒ]ÒP]™ZÐT\ÐTÒP[žRM•\ÐÌÙ–PL“”SNÎÐYÛQPNU]
ÐSš˜PQTQŒRUÒ™Ð••ZZÐSŒ•PQÌÖQPP^TÑPUÌPQM^PP‘•‘ÍPÝÛPÜŒXTPUVPRÙYQŒUPPÌÎ\ÐM›˜‘RYQÐ’˜LÌRÙMR–œÔQÞ’ÝÐ\””•PR‘XYÐÒL–ZÐS”PPTÚÝ™ÐŒÐTPNÐPQÑXØYÐVœÒ’QÕÔPÖÖSP[ÞŠÖQSÕKÔPSšÝÐSURPR’M[”QÒ]ÐQÙ›PZ™“ÝÐU“ž\ÐVPÙÐQœPZÝÐTQV’PQ
Ú–PQÞP\Ñ‹ÌÐSÒTQšÖYÐš\•PVXÝMÐSYRTPTTSL’QPQ[RÑ–PLžRÍÐP[Õ\YÐÒ’šNV’SŒPZÍÓ]ÐSÛ›ÐUU\PPŒšÙÐÝØMVÖTÐQÌÐÕP]\Ð]Ñ˜VPSKÙÝÐRŽPRÌÓPQÌTPM]XÐQÐUSš‘ÝÑZÜÔP^LSQMÒÜPÛ“ŽM\ZÌRÝTÛQ[YÐQÕÔPRSMÝÐ›ÚLRPKÓœÌÐRÍš]Ñ‘•PPRÍšP^Ì™ÐšÕÖPMÔUÌÐPÛPP–œŽT‹ÎQÜ]TPŒ]“PRÒ”RÝPSPP›Z”PP“\ÕTÚP™ÑPŒT“ÚÐQ˜ØšÐLž”ZÐUÓP“ÊÜP^’MÕPNÛØPQN[PQÝØUPPÞŽQ”PZŠÖPYMÑPRZÖÙÑÜPXŒÚPSËÜPPØ”ÛÐ^œLÐRÜ]YÐŒžŽLRYSPÓ[XÑP]ÍŒLÐRV’L™ÑÖPP^ÑRÞÓÑÒ›ÐT^NS‘X”PÔ^RÝLRÓ[ÙÐP\[Ð\•“ÕS–P\”PTÍŠÐS›ÒÐŒœYÍYL[ZP–TÒÙÑÝLJÝVPR[˜‹ÙÐÒŒMRœÐPX\ÐPJÙÒPZÍT’ÝÐ[ÔØÐVUØÞPÛÖZÐ“™[Ð\ÊÙ]RN]™ÐÕ–žšÐSXŽXRUÐP]ÌÞP^LQPÕš”Q˜ÓMSS]MS\ËÔPÚÐRÒPP•ÞšÐQœ™ÐPZŒÐVZÐSÚPÖUZÐXLX™ÐR›ÐTP”U•ÐRÌÐQPU›VÐRU]\TPYÜÓP[ÕLPZLÜQ\ÙPQ˜ÚRN\PP[‹ÌØÐQSÐPRLPSP”˜PPRRÕÖSÚLÐ]–[Ð]ÐP’^]ÐŽ]P[N]RÜÖ”QÛÛÑPPÑÜÐPÍU‘Ð[Q•PYžÐSÑRÐUPÌ”P[ÑÓRYJÌÙÑKÔÛÐX^UÌRR“PQŽÍ]XŠÙPQÚUÐ’ÒÜYÐU˜PPÌÍQÜÐNSYUPLSš”PYÓÜVP\™P”KÜÔPÐSÒ•P^ÐPRÑŒÜ–P]Œ‘PQL[TPPŒœÐZ“ÜÐSLP”••YÐRœÓÐR•ž]ÝÐÚšœÐ]ÑPLPPX˜Ù]ÑÔ˜ÝÐU[S˜’ÞPQÎPY‘ÕPRÌQš‘P\™‘RLPPœPN›ÕSÍ”P‘ÑÑVPU–™S’ÎNTPZÜÖP\ÍYPMQMÔPXÔÒPVXÔÒPÛŽM”QŒ]“PR[ž’ÐQÊÔ“”PRMUPKÎYSQÍ\MÐÝËØÖPZÝÚRPœœ˜’P^•Í™Q^Y]ÑÑUÛÐNN
ÜPÛŒÝÐÌ^X›Ð]Ð”SÒÞQPŒZTPMVYÐRZYÐS‘”ÝÐYÔ™ÓPR[[PP’Ô–P[ŒÜTÎ]™Ð•Ô™NL–SÞ–‘]ÐÓ\šÐ^™ŽQÛÒÑœÓP[ULSš[Õ™ÐÌSP^ŽÓÐP’Ò“P•ž”PS˜RR›“ÍÑÒSÐXLMœPQ[PT–ÐKÔ]ÐSÒ
ÝÐÓÓÌŒMÖ\ÐSÛ•ZQÚÐMÊÍÔPÍ^TP]“ÕÑPSÐÑ‘PP–žPPÐ‹Ð[ÐJÌPPÎÌP•TPUSPQ”Z^P\U™Ð]ÓX•ÐP\Ö›ÐXXÓÐXV•šÐPÖ˜VPPKÕ]MYžTTÌQTQKÕPS“ÝQÎÙÑÖÝÐLÕYÐQÙSÛ]ÐÔÓJÎ^T™MQÑ–[]ÑÝÐUVTÐS™ÊÑPQÕYÐSž™RÎ[ÔPZVPUÙ”S››PPÙU“PPUQ–QËÐQXMZTÒLQ]YÐ›šÎ]ÐU™Z\PRR[SÐQÍM\ÐUTLšÐRšÞœÔPÜ]ÍXTU’PQÕÞNP‹ÚRØÐZQ^VT”“™ÐZÜ“PYM’ÐRš”TP[Ž]ÐLÑYSÑŒÙÐ›ŒPKÜÙQÕVÐÖ”P]\^Q–›ÙÐ\šPÓPTXœQ›PÐPZÛÖPSÕYQR[šYÑPTÙPTUÍ”PXÑÐ^›RÐR•’ÝÑØÕPQS\™Ð’VPZSšPPÑÑÓÝÐ\ÙV”PQQÑÒPÜY]ÐÐS›ÐTMÎÐRYÛZÐPZÐ\SUÐSÖ™]ÑSÜÒPR•PTšYÐSšÜŽV˜S\Q•ÔPÎY\Ð\’ÐPÙ™]Ðœ[\VRÙÜP›ÞšYÐPÙLŒQTÙ’PP“ÛS[ÐXÒRšRN]ÐTUP\ÕÓÐP”•Í]ÐZYÐ]ŒPQÎJÕPÛÕ‘P]›\RSŒYÐÕÌÕÑPQš–PÐSTM›ÐÑÜQPXÝL]QS™YÐÐÝRÚÐX^’˜ÐQV[•ÝÐPS“ÌLÐŒÐTŒ”PP•ÕLMÐHŠKŠLMLŒË”TÚ
ÕPPPPSTŒÐPPRPÖT™ÎPPPVQ’YQÐPPPÐYÞÓÔPPPQPYÒ–ÍPPPYÐÒÐÍ–PPPPPR“œ™ÒÌ•’•ÙPPPPPPPPSÑSPPTŠÔZMLž›ÍÛœžXN]ÞN]™ŒËËËËËÌÞŽ‘••••–”Q\‘ŽU•˜UKÑŽPÚÖžT™ÕPPPPPPQT]NJÝPÓVKÒ“TÐËÍÌ‹ÞšŠÌNP^–ÑÝ\ÔTÜœÛÓKÚÛJÑ•HŠKŠLMLÎLŽ]]ØUX”^ŠÍšÎN]NÖ–[“™ØØžÒÊÛ]^”Q›Z–Î]M–ÞŽ[XÌU]ÓTÑ‘™ÝÌ™NÊÛÍÍRMÚMÞ™N]NQ”’M[Q“ÎLNRQÑVÞŠÖŒ“˜RÓÔTTžÛÊÝNØ–QXX[ÔY›ÕÓ”Þ‹Ö’X]MLRÍRÜÍÞ‹Ô›Î]Ô
ÔÓŒ“ÛÊÎÐÌ”ZUQ\ØŒÍ–œ”ÍŽS\ÕœÎUœÔÌQÕÞŽUšÍ“MÍ”]“]Þ“PÎZ]NÑ•TÔšØž™Ó[][[Ó”ŽU–ÛšŒNVM›RšÞŽRZÍ–Q”P]’™•MÝNÔU™YšÞœZ–]Í
ÕÜ”ÎU^ŠÓZV\ÎÝŒ]ÞŽMžŒ›“›UÝ“”˜Ð’UÕÊÎÖPÎ”™œÛZž\]UÙÞU”LÝPÍM
ÎŽ[“ÞŠÓÍ–‘TUÊÒÔ˜SV[ÙÍÔNÙ”UÜÐU™ÑUÌÒ””ÕÝ”TÛÜSÔZœNÑÒŒX››ÍÞŽNTÒQÑ’
Û\ÚËÓÓYNÎXÙ›PÝÑ™“Ò›”Ý”MXÕMÝR˜NÕÔMÍÞŽ]Û™PÔÒRÕÙNÊÜŽ]‘ÜÚžTL™”Yž”ÔRÑÐÓÎÝÔÜÕTÍÞŠÔN’šÚT–]”[]‘ÎÝ]]Õ“™ÞÕ‘RËÙØ”“ÒP”[ÖNYKÒPÞŽRÊÓ“™Ù”Ö“RKÓÍÐ‘SÓÍÚšžžR™ž˜TšTÎÜÎMšÍ“™žÚŠÓÓ‘XŠÐYV‘Ø–P•ÌMÓÍÌ˜UTZ”˜ØžŒÛŠÕLŠÙTXžœ“V‘Ö›NXYÕÞLÚÚŽ]Ü[”ÒŠÑ”ÒLZÞ[LÝMÚ[ZÛÙ[PTÚÍÝØÙÒÝÑT™T]R‘ŒTZNÚMÌÒT\•ÍÚŽ›ZÛ›^^’™[ÕS›ŒLMÑX^ÖSÌZ”^ÝUÑ™ÐÓMÝT
ÎZÐšœÒ–œNÐYÕRÍÚŽMPM’MÞTNØ•Ú^MÓP’TËÚÞž™LYÒÜÔTÐÝ™\“ÚÒNž[ÌŒYKÍÚŽLÍ•”Œ•LÙÖ›^]“ÍÚœSžQÕZÞ[“ŒLœÜ›TZšÎ^“LÛÙN[X”ÝLÚŽY“ÐJÎ^M’R”•–\ÍÎ[ÍÑVTÚÔÛÒÜTÖÔ™Ñ“–“NšYLSšÙ]ÚŽ›MÝZÔÒTTÜ™MÐÕ”XÍQššÑÜ‘Z™T
Ü‘ÑÕÑž”N–šZX\ÚŽ]ÑÔ\Z’ÕTYÚ”•œ
ÍÛŒØV–U\šÚ“ÒŒÒMMVTšÞ‘“MN•MœÒšÍÚŠÝM”ÝR™Q“Ñ]Ñ‘‘ÛÊÍÕÑšÙSŒÓÚÍÝÛ[ÐÓÒÓT”V™›ÐÜQQ˜ÎÍ›LQ•ÚÚŽÒ[‹ÍÍÓÕ“LÙŒ˜Y[ÓÍÙÜšÌŒØ\žKÌ™ÝQ\QT
Íœ˜š–Œ“ÎÙÚŽTšSÐ•TP]’TÕUY›[ŠÍÞžXY›TY™S
Þ›Ù‹ÝTÐŽZN’ÍÛØNQÛÒœYÚŠÒÍ[YSZQÝ“[”[œ›ŠÍÌTR–ÝXÚÑËÖTXQT››˜Ó[NÒ˜ÞÚÚŽ\ÑÙKÙ^UT“PRÙMÕ•Þ•ÜJÒ–•UÎŽ“TÞKÑ›ÖZNZÊÕÙZÍÚŽžž[U”Õ›RœMÒŽ“ÛÔ™YÓ]S‘ÑÜYTVÝLR”ÎÖ’‘[N[[ÍÚŽZYÍX–Œ”T›Z]’]MÝÜÝÔÊÌÚ•˜›ÐÜÍX^TËÛžžÝUÎ‘TÌQš’ÝÚŽQVÓ–™ËÖÔŒÑ–›]\ÙMÙÞŒ\šÍÞ‘ËÍQSÍÕTZÙX’]MUŒŽXÖœÑLÍÚŽVVŽ
ÔÓœÝNTÞS]]]MÜ]›ŒZÓ‘ÜžU™™ÜŒÝTSÖÞ[ÕÎYÙ’ØÔMÚŽžœ\‹ÒÎ^‘ÛÍÔžÍÝLÓRÍØ•Ú’JÓV–NT“ZVZRQ^YN™U™L˜“MÚ‹Õ“YSšS]Ý^XŒÍÑ˜NQÍÚØž•žPNVTR^ÜÞ’NÓ]ÑMMÖÚŠÞ•Û“ZÛQTÎYU•œŒÝMÝŒ“ÛÙ™ÜžŽSËØJÔTÞžMRŒÑÛÝÎ™˜[V‹ÛÍÚ‹ÍŒ™’ÚŒÝT]‘ØLš”ÚÒÝMÝ\MØÕ‘˜žÑ•JÍÝ”TœŒÜÎÛ›–MÚŽÍŒS–›Ý‘YJËÒŒ‹ÊÍÓ–\XJÓZØžÐœQ]ÜÐV”ÙÜ–ÌÔNÑ“ÐMÞŠÜÛR“ŠÍÌ”ZÙLL]Ñ]NÜÝÞ]“RÍ]XÞžXÕ[Ö^”U[Œ]ÞM]ÖœÙÍÞŠÜÕÔ[”šŠÐÑT]”•žMÞŠÎÖžÓÒËÓ–^žLM]ØUX”ËÝ”™ÖšÛ]ÜØL˜ÎV‘ŒÐÐLÍÞ‹ÔÝÞQÒ\P]”‘•S
ÎØ‹Ü‹ÔLÞTYÓY”\]QÎÚÓÒYÞŠÛžŒ›ZSŒYZÊÎ]ÖUÓÎÑRRR”™ÜžVYÎÕÍ‘”žTÝÙ”UÛÍJÖœÞŽS]ÑÜÕÕQTÐÌY“ZÊÎÒŒžR™Üž›LÜÞ›Þ”Ó”žMRÛÛNØRQ‘XQÍÞ‹ÕQÐ“ŒKÚJØÝZÓÎØÖÙY^‘™ÞžQYÕVœ”ÐÔŒÎM
ÎœÚÛÜJÚÍÞŽNYÔ[RÍ“”›ššLR\ŠÎÐÐÐÜTXž‘šÛ•ÛRQÍÜ”“œXÓÕRÍNÜ“ž]‘Þ‹ÝZ^UÔÒÔP‘˜›ŒÎÍÙSMÍSÌÚœÕ]œ]Ù”LÓšÕLÚVÎ’ÙYØÒÞŠÒž‘ÐÔU•žž]Î
ÎÑZU•UÑžÖ‘ÚØÒ’PÑT’ZSZÑTÕ[RžYÜÚ\ÜÑTÌSTSPTQPTQP^Z“TS‘TQP‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘L‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T“žT‘T‘MUÍ“ÞÎTT‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘KÑPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQUP‘UR‘‘U‘ÔŒ”Ú“LSÕP”‘Q’•‘••ÕŒZ•ÛÖ™VTQT‘T–UÒš‘PTQPTQPTQP‘T‘T‘šÑPTQPTQPTQPTQPTQT‘›PTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQT‘›VžTXQÚÔ‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘T‘UÛÔ‘UÜÔQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQPTQUÞPTQPTQPTXšTQPTQPTQPTQPTQPTQPTQPTXŒÐžÚTQPTQPTXÌÔŒQPTQPŒ™TQPPQPTQPTQPTQPTQPOHŠKŠLMÎMŽ‹ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÎPPPPPPPPPTËËÝÙŠËËÎPPPPPPQRPUËÌËËËËÎKËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÎÐ]ÐY•POOHŠKŠLNÌ‹’PPPPPPPLÍÞLKËËÊËËËËËËËËËËËËÍËËËËËËËËËËËËËËËËËËËËËËËÝÔËËËËËËËËËËËËËËËËËËËËËËËËËËÊËËËËÙÓËËËËËÝÑPPPPPKÍÊÌTËËÍÒPPPKÝÙ‹ËËËËËËËËËÝ‹ÑËËËËËËËËËËËËËËËÍÞÊÍŠÙPQËËËËËËÎMËËËËËËËËËËËËËËÝÓPKËËËËËÎPUËËËÎÞPTËËÝÒÐÐPPPPPPTËÌÞŽPTÊÐTËËËËËËËËËËËÝ‹ÎKÚÎËËÝ‹Ý›‹Û‹ËËÌÑNV™ÓÝÓTMÛÙKËËÎX˜ÓÒÔR™]ÔÐSÍ‹ÊËËËËÙLÚžÐSKËÐPÝ[‹Û‹ËËÌÝNÓÝÒPMÓXÎLZ’ÎQP]ÔPSËÙ‹Ù‹ËËÙ‹ÚŒÞYÐŽËÐPQŒËÌËËËÌÝNQQÝÖPMÎKÎKËËËËÊÙ™–Ð^‹ÎKÓÞ‹Ù‹Þ‹ËËÜÝ™™‹ÎÑQ
ËËËËËÌËËÐžŽËÝÓPPPPPL]™‹ËÍ‹ËËÞ’TÞPPPPPQPPPQÐ]ÐPKËÍËËËÎ‹ÝŽËËÊËËËËÒÐPPPPPPPPPKËËËËËËËÙ‹Û‹ÐKËËËËËËËËËËËÞ‹ËËËËËÝžQËËËËËËÙ‹ËËËËËËËËËËÎYžŒËËËËËËÞŒËËËËËÔKÌËËËËËËËËËËÔ‹ËËËËËËËËËÐÐPPPQËÝÐPKËËËËËËËËËËËËÞŽËÝ‹ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÛ‹ËËËÝ‹ËÐ‹ËËËËËËËËËËËÎ‹ÐY‹Ù‘ÑËÝÎKËÎTÙ‘QËËËËËËËÔËÎ™Ð‘Ð]ÐPPPQÐKËËËËËËËËËËËËËËÐY‹ËËËËËÐ‹ËËËËËËËËËËÔÑËËÎKËÝËËÐXÑËËËËÔKËËËËËÎËËËÐKÎPPPPTËËÝËËËËËËËËËËÙ‹ÍËÒÑÐKÎÐOOHŠKŠLNÍŽ‹ËËËËËËËÍËËÝ‘ÎPPPPTËËËËËÎËËËËËËËÍËËÐ]ÑËËËËËËÎKÐTÚ‹ËËËËËÎËÝÒËËËËËÊØÐPPPPPS]”ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÝÐPPPPÐKÞKËÎÔËËËËÎÔÊÜKËËËÔËËËËËËËÎNYŒÐ‹ÔÎŒÐŽHŠKŠLNLL[ÐPPTˆŠKŠLNLŽšÝ”ÎKËÔÔ]ÐPKËËËËËÎˆŠKŠLNN‹ÔËËËËËËÝÓPPTËËËËËÙ‹ËËËËËËÙ‹ËËËËËËËËËËËËËËËËËËËËÎ™P]ÐKËËËËÍÎËËËËËËËËËÍPPTËÙÐ‹ÙŒÎKÙŒÎKÙ‹ËËËËÎPPPPPRPOHŠKŠLNLPPPTÊËËËËËËËËËËËËÙŠÑ
ËËËËËËËËËËËËËËÙ™ËËËËËËËÊËËËËËËËËËËËËËÌÎPTËËÝØÐPPPPPPQËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÎÈŠKŠLNLN‹ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÐPQËËËËËËËËËËËËËËËËËËËËËÞPPPPPPPPPTËËËËËÔÎ‹ËËËÑÐPKËËËËËÎKÎKËËËËËËËËËËËËËËËËËËÝÐPPPPÐKËÞ‹ËËËËËËËËËËËËËËËÍKËËËËËËËÙPPPPPPYÔ
ËËËËËËÝÐPPTËËËËËËÝÎKËËËËËËËËËÎTPQ”ËËËËËÐ‹ËËËËÎTËËÞËËËËËËËËÌËÝÐÐKÝÔËËÎKËËËËËËËËÙÑÔÎËÎKËÔËËËËËËËÎKÐ”PPSÔËÔPŠÙ›YŒËËËËËËËËÙ‹ÐTËËËËËËËËËËËËËËËËËËÝÙ‹ÐKËËËËËËËËËËËËËËËËËËËËËËËËËËÑÑËÌËÍËËËËËÎËËËËËËËËËËËËËËËËÞ‹ËËËËËËËËËËËËËËËËËÐ]ÐPPPP‹ÐT™ËËÌKÖ]‹ËËËËËËËËËËËËËËËËÐ]ÐPPT‹ËËËËËËËËËËËËËËÎÐPQËËËËËËËËËËÞ‹ËËËËËËÎPPPPPTŠKŠLNMN‹ŒËËËËËËËËËËËËËËËËËËËËËÎPQÐKÍËËÝÙŠËËÎÔËËËËËËËËËËËÎKËÔŽPPPPQÍËËËÙ‹ËËÝÎËÞŽPPPPKËËËËËËËËËËËËËËËËËËËÐÐPPPPPPPPPKËËËËËËËÒÏOHŠKŠLNMÌL‹‹ËËËÒËËËËËËËÝÑPPPPPPTËËËÎMËËÝÙ‹ËËËËËÝÙ‹ËËÎËËËËËÝËËÔÐPPPPPKËËËËËËËËËËËËËËËËËËËËËËËËÞ‹ËÐKËËËËÎËËËËÝËËËËËËËÝÑËËËËËËÎŠKŠLNN‹ËËËËËËËÙÑËÞŽKÝÏOHŠKŠLNNM‹”ÌËËËËËÝRËÞŽKËÎKÐTËËÌÎPPPPPPPPPTËÓÑËÞŽKËËËÐ]ÐPPPPPPPPPKËËËËËËËËÎPPPPPPPPPPQËÝÍËÍËËÞŽPPPPPTËËÞËËËÎPPPPTÊËËÎPPPKËËËËËËËÔÑËÞŽKËÎTËÐ]ÏOHŠKŠLNNN‹ËËËËËËËËËËËÐTPPPPPPPTËËËËËËÝØÐKËËËËËËËÐÑËËËËËÝÑÐ]ÏOHŠKŠLŒ‹ËËËÒPKËÎÈŠKŠLŒÍ‹‹ËÎKÐTËËËËËËËËËÔÐPPSQÐPQËËËËËËËÐTPPKËËËÐYŽËËËËËËËÞÎ]ÐTËËËÎRTËËËËËËËËËÒÑÑÐPPPQËËÝ‹ËËÊÙ”PPPPPPPPPPPYÌËÝ‹Î‹ËËËËËËËËÝÒÐJÊÙŠÙ‹ËËÙLÚ›žPNHŠKŠLŒŒ‹ËËËËËËËËËÊÍÐ‹ÊÑPPPPTËËËËËËËËËÜÝÑÐ]ÏOHŠKŠLŒM‹‹ËËËËËËËÔÎPPPKÐPPPPTËËËËËËËÎKÑTQÐ]ÐPPPQËËËËËËÎÐYŽPPPPPPPKËËËÍKÎÝÓOHŠKŠLŒÌÍ‹‹ËËËËËËËËÝÑOHŠKŠLŒÍM‹‹ËËËËËËËËËËËÐ]ÐÐHŠKŠLŒÎ‹ËÞ‹ËËËËËËÝØPPPPKËËËËËËËÍLÎPTËËËËËËËËËËÞPPPPPPKËËËËËËËËÝÒËÙ‹ËËËÎKÙÑPKÝÓPPT‹ËËËÎËËÊÙÏOHŠKŠLŒ™‹Ý‹ËËËËÙÕT‹ÌËËËÎKÙ]ÒÐ]ÏOHŠKŠLŒL‹ËÎKÐTËËËËËËËËËËËËËËËËËËËËËËËÎŠKŠLŒMŒ‹ËËËËËËËËËËËËËËËËÌÎPTËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÝÎHŠKŠLŒŒ‹ËËËËËÎKÈŠKŠLŒM‹‹ËËËËËËËËËÎKÈŠKŠLŒŽ‹ËËËËËËËËÝÒËËÎKËÝÓOHŠKŠLŒÌM‹ËËËÔÐPKËËËËËËËÐPPTT
ÔËÍËÈŠKŠLŒÍŒ‹ËËËËËËËËËÎHŠKŠLŒÎ‹ËËËËËËËËËËËÚËËËËËËËËÊÐKËÎPPPPPPPPPP\ÐPPQËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÐTËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÝØÐKËËËÙÐPPPPPPPXÐNQËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÑËËËËËËËËËËËËËËËËÎÞËÐYŽQŠKŠLŒMÍ‹‹ËËËËËËËËËËËËÎKËËËËËËËËËËÎNZÌÝ‹ÜËËËËËËËËËÊËÍNKÙ‹ËËËÙLKÎÙ‹ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÔËËËËÌËËËÙ‹ËËËÌËËËÙ‹ËËËÌËËËÙ‹ËËËÌËËËËËÎKËËËËÙ‹ËÎNËËËËËËËÎKËËËÍLØÏHŠKŠLŒLLÍ‹‹ËËËËËÎ™ÑËÔ]ÏOHŠKŠLŒLNL‹‹ËËËËËÎÝÔËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÎPPPPPPPPTËËËËËËËËËÚÚ‹Ð]ÏOHŠKŠLŒLËËËËÍXŠÎ]ÜQMœ\[™ŒÖ‹ÍËÝËÝJËÎŠKŠLŒLÌ‹‹ËËËÐKËËËÝÔËËÎŠKŠLŒLÌŽ‹ËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÝÐPYÓQP”VRÐ[‹ËËËËËËËËÐÙÜÓQMP‘TÑ^U‘šÖQÔ›Ø’ŒRPZZTËËËËËËÎÐÝÝÓ‘ÎQT’U•UÑžÖ‘ÚØÒ’PÑZRKËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËËÎHŠKŠLŒMŒKT˜ÐÒ™Õ^‘Ô\ÕPÐTS’XÑZÒÐÝÕ‘TZÑÑPUTÐ’•PPPPPKËËËËËËËËËËËËËËËÒSœÐP”PPPP‘•TšLŠKŠLŒMŽM‹•S™”LT–•QUPPPPPUS™•“”•’’”]ÐPUS™•‘[””PPPPPPUS™”LSUQ•T”PPUS™•NSÔ•”•[ÐUS™•U•L’•“OHŠKŠLŒMÍÍ‹”^MU•‘V]ÐOOHŠKŠLŒN“PUPÐQM]’QÕžXÛN^RQÛV›N^X•ÑŒUÎ]PQ[Ø‘Õ›–UÝÙÖ[›”Ðž––ŒV•ÍZ–”P‘XŒŒZUÍÖ–žXŒÒPU[Už™ÞQÍ]™ÐžV–žV–››”š[^QM]™ÐšRŒTP”V–Vž˜UÎ]RQÔ››[P”ÑÕžVVœŒØ›NLR›ÛL\›P“ØžPž™Ó›ÒQÖœ‘ÕYØŒÒYÖ‘ÛV•ÓŒŒÒPQM]’RŒVL™ÙØÒ–L•ž˜ÝÐ‘ØUÞQÕVŒÝÐ•ÖUÞV”ÐŒŒŽØ‘ÑžVŒ•YÖ›N^RQÔšÑYÙÖ”P“ØžPž˜ÑÑš–”ÐœÖ•ÖŒQÎ]RQÔ›[–”P”YØŒ–YØ•ÕŒÒPQ’›ÌŽLXÛS›QÒŒXÌÚÐTÕÍL–žYŒ•ÔYØÌÛ™ÕQÓš‘ÝÐU[Už˜ŒÕžVL•YÙÕÑÎ^VVœ’ÙÙÍZQœ‘ÑšX‘ÕPTÕÍL–UÞÐž–•ÕœQSžXŒÓž“Ô›[–”ÐœØUÍ\Q’›UÔ]Œ\ÙTÐ›XUÞRXÌÔ›”P‘XV›LÔ˜ÛšÙØ›NLQÕÒPQS˜›M[LÔœŒØÛUž––YÖ[šÙØÑÕ›ÙÐ”ÑÕžVVœŒÙÛ•ÔYØŒÕŒQS˜›M[LÔœŒØÛU›Y›P’XŒÓŒQÛ’QÔ™TÑÎ^™ÐœÞPŒX›’›UÓ›ÖUÒœÖ”P–‘ÔžV–ž’QÛRRž–”PØÛN\–•ÍØÑÛÖ”P’“Ö–žXŒÒPUNØÌÕš˜PÐšÖ–œL•YØŒÒYÖUÔšØÛUž˜ÝÐØ‘ÎZ˜^PšÖ–œL•YØÛUžÛV•ÔPUNØÌÕš˜PÐšÖ–œL•PUNLQÑYÖ‘ÛV•ÓŒŒÒPQ[’QÑYÖ‘ÛV•ÓŒŒÒPQ”›RYÖ›[Ö”ÐšYPQU•ÓYÖ›N^X•ÑŒQÕžXÛN^PQ[YQœØUÔYÖV›™Ì[›”PTV›™Ì[›”YØ‘Û™ÐŒŒŽØ‘Î]VÐ•UÌZXŒž^PœØUÍ\’QÞ˜ŒÐPT›[Ö•ÍZ•ÕYÙÎ]’QÞ˜›XÐU‘Î]’QÌZ›šÙØŒÐ›šP›XUÞÞPœšPž™VŒ•ÌUNÖ›[Ö”ÐšÖ–š˜Û[ÙÎ^XÞPšQœ‘ÑšX‘ÕPT[QšÒQÖœ‘ÕYÖ‘Õž–LÒœÒ˜ÙÐ“ØžPš˜QÛÖÐØÛNZ––žQRšÐš‘ÔžV–žQVœ‘ÕYÙÎ]’QÞÛYQ”˜žPUÍMRQÞ›]QM]’QÞ–L’QÑŒ–UÛÖUÒœÖ”P”Ö–™š–”ÐšÖ•ÑšØ‘ÎZ˜^PŒØŒÕœÖÐ–L“ŒXÙÐ•ÑŒ”ÐXŒÔYØÛUš˜ŒÖ›ÛQšX‘ÕPUR›[™YØŒÙV–YÖ‘ÛP”ÑÕžVVœŒÖL‘VL•œÖ•ÔPT›•VLÔœŒØ›NLQÛÑÞ•ÕYÕšÐQM]’QÌ[ÌÓšŒ•YØŒ–YÖ‘Õž˜V›ÐŒV›Q[Ö•ÍLUÖœ–YØÛUŒÖ›P‘V–œL•YØ›NLQÑYØÌÔžV•ÑQM]’QÔšÑYÖVšUÞ[^QT›[–”ÐŒUÌ[ŒÕŒQNLYÐ–šPž™›UÌ^’R›ÌŽLXÛS›ÝÐ“XUÍ\’QÚÞPšV•ÕRR›UžV•ÔPUR™ÎZ˜ŒÙÖ–žXŒÒPT[QšÒQÌ[ÌÓšŒ•PT›[Ö”ÐšÖ–š˜Û[ÙÎ^RQÛRQÒšÐž™ÑŒ”P“ØŒÔYÖTÐž˜Œ“œ––PT‘Õž™ÛVVœŒÖUÔšØÛUž˜ÞPžV–ŒXV›P“––ž–UÙR˜žPœÖV›–”P”XÛNLŒ“˜ÐŒØÛN]VžPŒV›QÖ˜ÚPž˜Œ“œ––PUR™ÎZ˜ŒÙØ›NLQÑŒ–UÛÖUÒœÖ”P”XÛNLŒ“˜ÐXŒÔYØÌÕØÑÎ^YÕšÐQ“–LÐŒV›QÍ]™Ðž™ØŒÒŒ•ÔPUNLRŒXÒ˜Û”›P”XÛNLŒ“˜Ð›VUÌ\’ÙØ›NLRŒXÒ˜Û”›P–‘ÔžV–ž’QÖš•ÛÙTÐXŒÔYØÌÕØÑÎ^YÕšÒQÒRRžXŒÔ–LŽ\ÐQQšÖ’›ÌÓYØ›NLQÑŒ–UÛÖUÒœÖ”P“Ö–ŒØŒÒœ’QÛ’QÔ™UUŒŽ^X^PŒX›’›UÓ›ÖUÒœÖ”P‘Œ]V•ÓŒUÎ]RR›Ì•ŒQÒRQÍ[˜Û\ÐTLŽ]X›Uš™Û˜šPš[N^YÕšÐQM]’QÒŒV›V›ÚPž˜ÑÑš–”ÐšQœ‘ÑšX‘ÕPULŽZ˜L•ŒQÛ’QÓ˜›M[LÔ›P•Œ“œ––YØ›NLQÓ˜›M[LÔ›P‘UÍ]XŒÔYØÌ•VÐš›”›ÚPž˜Œ“œ––YØÌšYÔ™UÐ›ÛQŒUÎ]RQÑœØÛUš’ÙØUÍØÒ–ŒÒ›ÌÓPUÐ›ÛQŒUÎ]RQÛRRžXŒ™V–žQ“ŒUÞQÖœ‘ÕYØQÑV‘ÞQ’›•ÎL”Ð’“Ö–žXŒÒPUV™ÑYÖ––•ÕšÖ•ÔPUNØ•ÕšØVQÖ™ÍZÐQ™XŒ[’QÌ[‘ÛX”ÐŒV›QLLX’œQÎ]ÒQÑŒÕÒ›P”Ö–ŒXV›Ðœ––ÙØ›NLQÑŒ–UÛÖUÒœÖ”P“–ÙØQÑž’QÕÑÛV•ÔPTÌ•RQÚÞPšV•ÕRR›N\–•ÔPTÌ•RRÞPžV•ÜLÔ›ÐšYTÐž––Œ˜UÓ›ŠKŠLŒÍÌÌœR˜TPUÓP”ÕP™ÝÖYMTQKÝÑ^‘QÝØNVN™ÔÐÜÐL™Ø]QRQÔÐTMQ”PÚ™Ì›RSZ™ÑÖRÎ]ŽÖT\ÒÓ™NŒÖZÔ”RÑRRPØS”PNÓVP™ÐL™Ó“P›PÙ]ÑÙMÌPPP”P•PÝ]ÐÞLŒKÝÑÑÎŠÔTMQÕP”™ÑÙSÑÜPQž[PˆŠKŠLŒÎLŽ’TTPPPPPPPPPPPÎÈŠKŠLŒÎMŒ“”T’‘–QHŠKŠLŒÎN‹›ÐTOHŠKŠL‹”™Õ™Ð•Í–TVPPSNPPPPPPPPPQZÑÊÔVYPžšÒÔYPÏOHŠKŠL‘ÔPRÐPšÖ‘ÔPPPPPQPPPPPPPPÔPPPPPSPPPPPPPPPPVP‘RÑÔšÖ]ÛÒPQPPÔ\ÖPPPR™ÜÐPP\ÐPšÐPPPV‘ÔšÏHŠKŠLLŽK‘ÐPPPPPPPPPQÔPRÑšÖ‘ÔPSPPPÐPZÓÐPPPPÔPSÐPPSÈŠKŠLNË‘OOHŠKŠLNNK‘]ÐPPPPUPPPPPZÓPPPPPPPSPPPSHŠKŠLK‘POOHŠKŠLMË‘ÐPPPTTPPPPPZÔPPPPPPPTPPPTHŠKŠLÌË‘YÏOHŠKŠLÌMK‘TPPPPPTPPPPPZÔÐPPPPPPTÐPPTÐPPXPPPPQÚØHŠKŠLÍÌ‘ÙÐPPP›ØQÙÐPPPPPPPZÏHŠKŠLNK‘OOHŠKŠLÌK‘ÐPPPPVPPPPPZÕPPPPPPPUPPPUHŠKŠLÍË‘™ÏOHŠKŠLK‘”PPPPPUPPPPPZÕÐPPPPPPUÐPPUÐPP]ÓU^“‘L“ž™ÍTUR‘‘U‘ÈŠKŠLM‘TOOHŠKŠLŒ‹ËËËËËËËËËÎHŠKŠLÌ‹ŒÙPQ™Y”ÜPXÑ’TËÎ
ÒÛÐPPPšÐPPPMSPPP[PPÙÚÑPTQRTRPÕÛPPPM•Q‘ÐPPPQPPPPžPPPXKËËËÎÍËËÊÔÝ‹ËËÐPPPPPPPPPPPÐPQP]ÐP]ÐTPPSPQPQP™ÐP]ÐXÐPSPRPPQPÔPP]Ð[ÐPSPSPQQPP]ÐLPSPSÐPQQÐP]ÐPPSPTPQQYÐP]Ð“PPSPUPPQQ”PP]Ð–PPSPVPQQÐPP]ÐšÐPSPXPPQQÝÐP]ÐÐPSPYPQRÐP]ÐŽPSPPPPPÞTPP]ÝÒPPSSQPQPP]ÝÕPPSSQÐPQÐP]ÝÙÐPSSRPQÙÐP]ÝÜÐPSSSPPQPPLÍPSSTPQPPS]]ÑPQSPÐP^‘]ÐS]ÝÔPQœÐPPPPRPPPPPZÐPPPRÐPPPQPPPP\ÐPPPSPPPPZPPPPPYÐPPP’PPPPZPPPPSYÐPPQRPPPP”ÐPPPVYÐPPRRPPPPÔÐPPP[ÙÐPP[ÒPPPRÔÐPPQŽÐPPPSPPPPPPPPQMQŽY–LÚUÒœ‘^›Y˜Ìš•ŽLV››V›NQPPPPQÚœTPQPV“ÛÐQMQŽY–LÚUÒœ‘^ŒNY–LžÌÓ™™Ö•Ž\›V””PPPQÚœTPÛÍQP[“ÙÐQMQŽY–LÚUÒœ‘^ŒNY˜ÑÒšÌ•™™Ö•Ž\›V””PPPQÚœTQMQP[“ÙÐQMQŽY–LÚUÒœ‘^ÕŽY˜ÑÎ\›”›ÛLV››V›NQQÚœTPRM”QPKÓÙÐPPPPPQMQPQPPPP•PPPPUÐPPPQÐPPP™ÐPPPVPPPQÙÐPPPœÐPPPPPPPP\ÓÚÐP”PPPPXÐPPPQ™ÐPPP˜ÐPPPVPPPPRPPPPPPPYPPPU‘]ÖNZ™R[[“U]ÖN^˜UŽZ˜‘Ñž˜ÌNLV››V›NQPPPPQÚœTPÒM”QP^“ÙÐPPPPPPYÍ™ÑPPÔPPPPÐPPPPZPPPPPPPPQZœPTPRPPPRYÐPPPÓPPPPPPPPPPÓÛÐPZÐPPPZÐPPPR”PPPQ“ŒÕÕL•ÙÛ˜™ÐPPPPM”QPJÓÚÐQ“ŒÕÒš‘ŽZ‘Þ–]ÐPPPP›Í”QPQSÛÐPZœPTP•]Ö[QšÖ‘žXÛQV[N\Ö•Í[™ÙÐPPPPXSÚÐPÞœPTPYÍ™ÑPULÔMYÖ•Ž\›VPPPPQQTP•M™ÑOHŠKŠLMML‹ÓPPSPÞPPQ\ÝÐP]ÓPPSPÌPPQ]ÐP]ÓÐPSPÍPQ]TPP]ÓÐPSPÍÐPQ]PP]ÓPSPÊÐPQ]ÐP]ÓPPPSQPQ]ÙÐP]ÓSPPSQPPQ^PP]ÓRPPSQÐPQ^ÐP]ÓYÐPSQPQ^YÐP]Ó\ÐPSQPPQ^”PP]ÓMPSQPQLPP]Ó‘PPSQÐPQLÐP]Ó”PPSQPQLYÐP]Ó˜ÐPSQPPQL”PP]Ó’PPSQPPQLÐP]ÓÐPSQPQLÙÐP]ÓŽPSQÐPQMPP]Ó™ÐPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQMÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓÓPPSQÐPQ]ÙÐP]ÓRPPSQÐPQMTPP]ÓRPPSQPPQM]ÐP]ÓÙÐPSQPQM™ÐP]ÓÜÐPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQMÐPP]ÓÌPSQÐPQMÙÐP]ÓÎPSQÐPQNPP]ÔPPSQPPQNÐP]ÔPPSQPPQNYÐP]ÔÐPSQPQ]ÙÐP]ÔÐPSQPQJÝÐP]ÔÐPSQPPQKÙÐP]ÔPSPPPTQPTQP]ÐRPSPQTQPQP]ÐUPSPQÐTQPÑP]ÐYÐSPRTQPÙÑP]Ð\ÐSPSPTQPÝÑP]ÐLSPSÐTQQÑP]Ð\ÐSQÐPQ]ÙÐP]ÓRPPSPTPTQQTQP]Ð’PSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]Ð“PSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSQÐPQ]ÙÐP]Ð”PSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSQÐPQ]ÙÐP]Ð•PSPUÐTQPÝÑP]Ð\ÐSPVTQQÐQP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQQÔQP]ÓRPPSQÐPQQÙÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSQÐPQQÝÑP]ÐÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPYTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]ÐSPYTQRPQP]ÐÑPSPZPTQR]ÑP]ÐÔPSP[TQLPP]Ó™ÐPSP[PTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSP[TQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]ÐÙÐSP\TQPÝÑP]Ð\ÐSP\PTQPÝÑP]ÐÜÐSPSTQSQP]ÐÌSP]PTQSÑP]Ó™ÐPSQPPQSPQP]ÑPSP^PTQS]ÑP]ÑPSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSPLPTQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÑPSPLÐTQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQSÐQP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSQÐPQ]ÙÐP]ÓRPPSPMPTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQPÝÑP]Ð\ÐSPSTQ]ÙÐP]ÓRPPSPMTQSÝÑP]ÑÐˆŠKŠLŽM‹›Õ˜ÐQQPPPQÑPTYÐPPPÖ–PTP‘PPPXLYÐQTPPPQÕÐQPT”PPPP“–TP‘ÐPPPY‘šÐQXÐPPPÑUÔQPTÐPPPQ˜PTP’PPPVŒ[ÐQ[ÐPPQUÙÑPTÝÐPPPÍXTP“PPPPXÕœÐQLPPQ•ÝÑPUÐPPQÝÐTP”PPPZ]ÐPYÐPPQÖQPPÔPPPPŽYTPRÐPPPVŒLP\ÐPPPÕ–QPQPPPS\TPSPPPQMPMPPP\VÑPQÐPPRV™PTPTPPP]•PPPPP‘ÑPQTPPPRYTPTÐPPP\LNP“PPPQ–ÑPQPPPPU™ÐTPUPPPSQÐPP˜ÐPPP™ÖPQPQÐPPPRÐTPVPPP]ÐPPœÐPPQPQPRPPPT™ÐTPYPPPRL‘PPÐPPPP‘VTQPRTPPPQÎZTPZPPPP[•ÑPPÓPPPQ–TQPRPPPTšTP[PPPQ•ÒPPÖPPPP––YÑPRÐPPPRZPTP\PPP\›RPPÛÐPPQÖYÑPRÝÐPPQšTP]PPPXŒ“PPÍPPPÛ–]ÑPSÐPPSÖšTP]ÐPPPYQÔPQPPPPÙQPSYÐPPSNZÐTP^PPPKÛTPQÔPPPP™Ö”QP^PPPPSŒ[TQPPPPPPPPTËËËÎV™ÑPPTPPPQ[PTPPÐPPPP••PPSPPPQ–™ÑPQTPPPQ›TPTÐPPPYÌ˜ÐP“PPPQÖÑPQPPPQÐTPUPPPUÙÐP–PPPPŒPQPQTPPPSÐTPZPPP^[YÐPÒPPPQ
ØPQPR]ÐPPQ]TPZÐPPPXUÚÐPÕPPPPÙ˜TQPR™ÐPPSÒœTPZPPPPPPPPTËËËÎPPPPPPPPPPÖPPPPPPPPPPTPPPRžPTPPPPPZÒPPQPPPPÔYQPPTPPPRŒPTPPPPPZÒPPQPPPPÔYÑPPTPPPRTPPPPPZÒÐPQPPPPÔYYÑPPTPPPRÐTPPPPPZÒÐPQPPPPÔY”QPPTPPPRŠÐTPPPPPZÒPQPPPPÔYÐQPPTPPPRÐTPPPPPZÒRPPUPPPPPPPPPP™ÏOHŠKŠLŽLŽ›ÒSPRÐÑTPYÚQPRRTPRÐÑPTPYÚQP[ÒUPPÐÑÐTPÙÚÑP[ÒVPPÐÒTPYÚÑP[ÒXÐRÐÒTPYÚPQPRRYÐRÐÒPTPÙÚPQPRRZÐPÐÒTP]SÕMXÒ[ÐPSR”PÔZYÑPS›ÓÒÐTPQÕPZÒ[ÐPÍUM]ÚYÑPP]ØÑRÒÐTP]SÕ›ÞXÒ[ÐPSR”PÕšYÑPS›Ó[ÒÐTPQÕPZÒ[ÐPÍTÚ™ÚYÑPPXÑRœRÐTP]SÕ[ÌØÒ[ÐPTR”PØZYÑPS›ÓŒÐÒÐTPQPÕP[[ÛÐPÍU’ÚYÑPP]ØÑRÒÐTP]SÕMXÒ[ÐPSR”PÔZYÑPS›Ó[ÒÐTPQÕPZÒ[ÐPÒ\ÔÐÚYÑPP]ØÑRœRÐTP]SÕÞXÒ[ÐPSR”PØZYÑP[ÌSPPPPPPUQPQQPPS’•PTPTTPPPÛPPÓPPPP‹Õ”QPQÝÐPPQ•ÐTPUPPP^–PPPPPPP•ÑPPYÑPPQLVTPQTPP]•˜ÐPTPPQÕÑPP”QPPQMVPTPUPPPZÕ™ÐPPPQ•ÐQPQÐPPQŽVTPXPPPPZÕšÐPšÐPPQÔQPQÐPPPQPTPYPPP^›ÐPÐPPPTÝÑPQ™ÐPPQTPUHŠKŠLŽMÍ”LYÐPPPPÒUÐQPQQPPT–PTPTTPPSLZÐPÓPPPPÒÔQPQÝÐPPSÐ–TPUPPPT[ÐPPPPPØÕÙÑPPYÑPPPP˜TPQTPPU\ÐPTPPPÛ•ÝÑPP”QPPQZÐTPUPPPXÌ]ÐPPPQVQPQÐPPP•™TPXPPPPVŒPšÐPPPÒVQPQÐPPPS’™TPYPPPP‘PÐPPP]–ÑPQ™ÐPPQŽYPTPUHŠKŠLŽNLŒLPQPPPP˜ÕPQPPPPPPSNTPTPPPPPPSÑ’PPPPPPP•]ÑPPPPPPRQ•TPPPPPPJÌSPPPPPPQ•QPPPPPPPÕ•TPPPPPPZU•PPPPPPP•U™ÑPPPPPPTÐTPPPPPPQÐPPPPPP’UÑPPPPPPRÙTPPPPPPN[ÐPPPPPPLÕÐQPPPPPPRÓ–PTPPPPPPM‘™ÐPPPPPP]UÔQPPPPPPRVTPPPPPPMŒZÐPPPPPQËËËËÙÌRRPPPPPPPPYÏOHŠKŠLÌLŽNSÐÔTP”ZÐQP]ÒPSPÔPTQZÐQPPTPPPS”RÐ]ÐÓPÙÓPT“ØÐÈŠKŠLÌMÍ‹’LÐPQPPPPPPPPPKËËËËÌYPTPPPPPJÌÐPRPPPQÕQPP]ÐPPPPPPPQËËËËÕšÍPPPPPQÕÑPPTPPPS”TPPÐPPPQÑPP”PPPPPPPPPKËËËËÝÐPPPPPPPPP]PPP’PPPP“•YÑPQPPPSTÐTPZÐPPPZPQPPPPPT•QP]ÔPPPPPPPPQËËËËÜLTPPQPPPPPPPPPKËËËËÌYPTPPPPPPQÕ•PPQPPPPÔ•”QPPYÐPPQS•ÐTPQPPPLÌVPPTPPPPYÕÑPP”PPPPPPPPQËËËËÐPPPPPPPPPP–QPPTPPPR[TPPÐPPP\ŒXÐPSPPPQ•™ÑPPPPPPÐ–TPQPPPPPPPPTËËËÎPPPPPÛÐQPTPVUPQP\Q™ÐˆŠKŠLÌŽPQPPPPMVPQPPYÐPPQšÐTPQPPPYÕÐPPTPPPPÝÖPQPP”PPPS“™ÐTPQÐPPPP•ÑPPXÐPPP\VTQPPÐPPPQ‘šTPRPPPYQPP[ÐPPPÔVTQPPÝÐPPSSšTPSPPPPJÕÑPPLPPP]VYÑPQÐPPQMZPTPTPPPZRPPNPPQVYÑPQÐPPP›TPTPPPT“PPNPPPÚÖ]ÑPPÐPPSœTPRPPPSÌ”PPXÐPPPÑVQPPÐPPRÎZÐTPRPPP]Ì”PPMPPQ–QPQÐPPP\TPTPPPPNQÕPPPPPP\–™ÑPQPPPPSŽUÐTPTPPPPX›VPPPPPQ–™ÑPQPOOHŠKŠLÌÍL‹™ŒŒQPPPÚ˜”QPTÐPPSL]TP[PPPPLQÌPÒPPPPM˜™ÑPRPPPPRPTP[PPPPPPPPTËËËÎPPPPPPPPPQÓ›TPšÐPPP^ØÐPPPPPPR˜PQPRÐPPQR›ÐTPPPPTLVPQÔPPPPÑØPQP[ÐPPRÕ›ÐTQPPPPPPPPPTËËËÎZ–ÑPVPPPS[ÐTPNPPPM•ÙÐQPPPP‘™ÑPVPPPP’œTPŽPPPPU[ZÐRÐPPPPPPPPPKËËËËÝÐPPPPPPPPPVL˜ÐQÔPPPPÕXTQPT™ÐPPS\TP•PPPTLVPQÔPPPP[ØYÑPX™ÐPPQÙPTPPPPPPPPPTËËËÎPPPPPPPPPQÓ›TPšÐPPP[ÚÐP”PPPQXTQPSYÐPPQS•ÐTPšÐPPPRÑÛÐR]ÐPPP›˜YÑP]PPPPPPPPQËËËËÈŠKŠLÌLÍ‹”TPQÐTPÐKÝÑP]ÔˆŠKŠLÌLLÛ[ÐPÑÐPPS]ÑPPÙPPPQQœTP™PPYLœÐPÒOHŠKŠLÌLML‹œLœÐPQPPPPÎ]ÑPPYÐPPPL\ÐTPQŠKŠLÌLNŠÑ]ÐSR“TP•ÑPPÕNSÕ”TPšÕPQPL›PQÙÐTQUYÑPLQ“PQÑ•PTOOHŠKŠLÌLŒÍ‹šQ’PQTPPPPPP[›PQÔ•PTQÕQPSUPRœTP”U™ÑOHŠKŠLÌLŽ–LRPRPQPPÐPKÎ‘ÕPPPXÐPPPL]ÑPRPTPPPPQSÕPPPPPPPPPPR•TP]Ð”PPSPUÔ–ÐPPQPPPPQÌTPRQPPÔP™ŽPPPPPPPPPPÌÕQPPPVPPPPQËÝÖPPPPPPPPPPPÜTPPPÐPPPYÐPPPPPPPPP[PPPRPPPPÖ˜UÙÐPPTPPPPKÕ™ÑPYÐZÐPRPR‹ÝÛVYÐPPPPPS–•ÐTPPPÙÐPPP\ÐÛQÐPPQPPPPPÛÐRPRÐPPÐPÝŽÙØÐPPTPPPP™•ÑPPP\ÐPPPSÜÐPPPPPPPPPSMVTPÐPÝÐPYÐ]‹ÐÌ‘ŒPPQPPPPQYÐPPSPPPPQV–PPPPPPPP\ÕÐQPYÐ]ÐPRPSKÝÞX]ÐPPPPPRŽVPTPPQPPPPLKÑÞPPQPPPPMQ™ÐRPSPPÐQŽ˜VPPPTPPPPNÔQPPPMPPPSÙÍPPPPPPPPPRTPÐQÐPYÐMËÑÐPPPPPPPPPNšÐPPTPPPQÎPPPPPPPPPPLÙÑPPPPPPPT[žPPPPPPPPPPS›PTPÙÑPPP[Ð‘ÑQÑœPPQPPPPQÑœÐPPTPPPQYŽ˜ŒœÐPPTPPPP’ÕÝÑPPP’PPPPTÛžPPPPPPPPPPSTPPRÐPPPPÚ‹ÒÐPPPPPTPPPPUÛÐQP]ÐPPSTÐPPPPPYÐPPPÑQPPQPPPP^ÍNPPPPPÐPPPPšTPP\ÐPPRÙ‹ÌLŽ\PPSHŠKŠLÌN•ÐRPPRÛÐPPPÝÐPPZÐPPSRPPPPPP]P\ÐPQÍPPQËËËËÈŠKŠLÌNœP\ÑŠKŠLÌNL›QPQPPPPMÑPPYÐPPQÑ™TPQPPP[•ŽPVPPPQÖÑPPÔPPPTTPRÐPPPRŒPPTPPPP“–PQPP”PPPRLYÐTPZÐPPP\LPP\ÐPPQ–PQPQPPPT™ÐTPSPPPQ›QPPMPPP“VTQPQÐPPQÙTPTPPPP[QPP‘PPPPÍÖTQPQYÐPPPRšPTPYPPPQÌ’PPÕPPPP’VYÑPRPPPPR’šPTPZPPP^›RPPÒPPPQÖYÑPPÐPPPÍZTPRHŠKŠLÌŒLL‹š›SPPQPPPPÎ]ÑPPYÐPPPPPPPPPPPPQ’ÐPÐØÐTP\ÛQPTPPPP›ÏHŠKŠLÌŒMŒËYÓQÐ\ÓÑZX’PÕ\“UÊÔ•^ÛRœÖPZRÖ[˜]]žÞXËÕŒQÍ™LÝÎTJËÞŽKÙŒÎKÔN]•ÍÙ[šÍœ•žŽÝ“Ý\
ÖZÒZPYVœ[UJÓž‘\’”ÐX‘šSÐÝÙÑ]ÒOHŠKŠLÌŒŽ”PPPPPPPPPPPPPPMÐTPÐPØÐPPP[ÐPPPRÔPPPPÛÐPPP\PPPTSÚÐSSÌTP›Í”QP\ÓPSÔQPYÐPPPPPRUPÐPÝÐPPP]PPPSÐPPPÎPPPM”QPP\˜ÐQÚœTQÝÑPQPUPÐQÚœTQÝÑPQÐUPÐPUOHŠKŠLÌL‹‘OOHŠKŠLÌÍ‹ÝÐPPP[ÐPPQÙPSOHŠKŠLÌŒYÏOHŠKŠLÌÍ‹‹ËËËËËËËËËÎHŠKŠLÌM“PUPÐPPPPPPQˆŠKŠLÌM“POOHŠKŠLÌNÝÐPPQPPPQPSPPPTOHŠKŠLÌŒL‹TOOHŠKŠLÌŒŽ‹ËËËËÝÛÏHŠKŠLÌŽM‹žPUPÐPP‹ÐOOHŠNÝ˜\ˆË]JÏVÛ[[˜Ý[ÛŠ
^Ý˜\ˆKLÜ™]\›ˆYVÊL
OŒ—KVÝŒ—O\ŠÌKLMIŠOYÖÌ—JK
JO	‰ŠP–ÊVÝ
ÌLŒ—JÊJ_
KLMŒWJKŸKK[˜Ý[ÛŠ
^Ý˜\ˆKŽÜ™]\›ˆOYVÊL
OŒ—KYVÐOŒ—KVÝŒ—OPJÍŸK[˜Ý[ÛŠ
^Ý˜\ˆOLLÜ™]\›ˆOYVÊL
OŒ—K

P[Ê
JJOOMMLÌÉ‰ŠVÝŒ—OPJÌKVÝ
ÎŒ—OLKLMIŠOYÖÌWJK
JOL
P–ÊVÝ
ÌLŒ—JÊJ_
KLMŒWJJKŸK[Ë[˜Ý[ÛŠ
^Ý˜\ˆK‹OLÜ™]\›ŠOYVÍ
ÊL
OŒ—JOŒJJOYVÝŒ—JJÌ_
OŒÊVÝŒ—OXKMLÌÊNŠVÝŒ—O\‹O]VÌWKVÝŒ—OPJÌ‹_VÐJÌ_O
_K[˜Ý[ÛŠJ^Ý˜\ˆ‹KŽÜ™]\›ˆ_LYVÊL
OŒ—KYVÝ
ÍŒ—KOYVÐOŒ—K
O]ŠŠÌ_
YVØJÍŒ—JJÌ_
J_
OYÖÌ—KYÖÌ—_
_
O]ŠVÝŒ—KVØOŒ—JJK_K[˜Ý[ÛŠJ^Ý˜\ˆŽÜ™]\›ˆLOYVÊ_L
OŒ—KYVÝŒ—K
YVÐJÌMŒ—KYVÜŠÌMŒ—_
_
]ŠVÜŒ—KVÐOŒ—JJKKÚK[˜Ý[ÛŠK‹J^Ý˜\ˆŽÜ™]\›ˆ_LŸL_L[RLMŸ
L]
VÍŒ
ÊL
OŒ—KK‹MI˜KŠÎ
JOÊVÍMÎNO]KLJNL[ŠÌMŸO]ËLN™VÛŠÌLŒ—K
ËLN™VÛŠÎŒ—J_K[˜Ý[ÛŠKŠ^Ð_LŸLÝ˜\ˆKLLÏLLLOLÒXORLÌŸYVÌŽ
ÊL
OŒ—KVØJÌMŒ—O[‹ÏYVÝ
ÌŒŒ—KVØJÌŽŒ—O\‹VØJÌŒ—OPKOXË[ŸVØJÌŒŒ—OPKÏPJÜŸLŽÙNžÝžÐOXJÌMŸ
LÙJVÝ
ÍŒŒ—KK‹JÌLŸ
JOÊVÍMÎNO[‹KLJN›LÜŽžÚYŠŠ[PNÙ[ÙH›ÜŠÎÊ^ÚYŠ

YVØJÌLŒ—JJOOJÊJXœ™XZÈŽÚYŠ

O
^ÛPNØœ™XZÈZYŠ[J
OJYVÐJÍŒ—JOŒŒ
OÙŽŒ
_VÊJOÊJÐ_
OŒ—OYŠÙVÛŒ—KVÊOJOÌLŽ
JÐ_
OŒ—OYVÐOŒ—KY‹ÏXË[O[‹\R_
LÙJVÝ
ÍŒŒ—KKJÌLŸ
JOÊVÍMÎNO[KLJN›L
Xœ™XZßZYŠ
ÊHOKLJXœ™XZÈPOYVÝ
ÍŒ—KVÝ
ÌŽŒ—OPKVÝ
ÌŒŒ—OPKVÝ
ÌMŒ—OPJÙVÝ
ÍŒ—K\ŽØœ™XZÈ_YVÝ
ÌŽŒ—OLVÝ
ÌMŒ—OLVÝ
ÌŒŒ—OLVÝŒ—OLÌŸVÝŒ—KL

HOL‰‰Š\‹YVÛŠÍŒ—_
_\™]\›ˆXJÌÌŸK[˜Ý[ÛŠKŠ^ÝL_LŸLÝ˜\ˆKLLÏLÒXORLÌŸVØJÌMŒ—OPKYVÝ
ÍŒ—KVØJÌŒŒ—O\‹HHJŠKYVÝ
ÍŒ—KVØJÌŽŒ—O[‹VØJÌŒ—O[ÙNžÝžÚYŠ
LÝ
VÝ
ÍŒŒ—KJÌMŸ‹JÌLŸ
JOÊVÍMÎNO[‹KLJN›LŠPOLÌŽÙ[Ù^ÚYŠ

YVØJÌLŒ—JJOŒ
Xœ™XZÈÐO[ÌÌŽŒMŸYVÝŒ—OP_VÝŒ—NØœ™XZÈ_XÏ[‹
YVØJÌŒŒ—JOŒ[Œ
YVÝ
ÍŒ—KVÝ
ÍŒ—O[‹VÝ
ÎŒ—O[ŠÊË[
KVÝ
ÍŒ—I‰ŠVÝ
ÍŒ—O[ŠÌKÖÊJÜŸ
KL_O]VÌ—JKÏ\Š_\™]\›ˆXJÌÌŸßK[˜Ý[ÛŠ
^Ü™]\›ˆYJVÍŒ
ÊL
OŒ—J_K[Ë[˜Ý[ÛŠK‹K‹
^ÝLOJÐKŸL_LŸLLÝ˜\ˆËLLOLLOLLÏLLOLL™OLÙOL™OLÙOLOL™OL™OL™OLÒXÏRMMŒVØÊÍŒ—OLŠ
ÐJKLÊJKÊ
K
ŠOÊÙOLK™ONNMËŠ
ÊOKPJJKLÊJKÊ
JNŒŒ	›ÊÙOLK™ONYLÊNŠ™OJÙOLI›ŠOÎLÎŽNN™OHXÙJNÙNšYŠŒMÍLÌ‰Ÿ™Š^ÚÙOXÊÌMŸÝžÜŽžÜÎžÚYŠOQ›ÊKÊÍ
K
JÏPJHOL
^ÚYŠYVØÊÍŒ—KVØÊÍŒ—OY‹LK

OLÌŸ
JHONMÊXœ™XZÈÎØœ™XZÈZYŠ

OLÌŸ
JOONMÊXœ™XZÈÑOYVØÊÍŒ—KJJOÍŽ˜NØœ™XZÈŸQOY‹LŽ_VØÊÍŒ—OQKJLŽÍMM‹JJOÍŽ˜_Y›ÜŠRJÊÍ
JÊ
JOLÌŽŒ
_ØOPOŽMMÌŽM‰OLßŸOŒŒVÜŒ—OXK\
Í
OLYNJŠKJÊOŒ
JJHOLÊNÚYŠ
JOL
XOQK\ORŽÙ[ÙH›ÜŠOR‹OQNÎÊ^ÚYŠJJOLŽOÌŽN˜KJOŒŠ\M
OŒ
J^Ù›ÜŠOLÚYVÙŒ—K™OXKOLÌI•‹
ŒÉ•ŠOŒLÌÊÏZKOL
NŠÏJOJKLIšŒÌ‹XKOZJKSÊÕ_OUZJ™OQ™JØ_OŒ‘™OŒÚ
Ì_šYNJKVÙŒ—OQ™KPPJKKYNK
KOŒJY‹M
OŒÊNØI‰ŠVÊORKM
OŒ—OXJ_Y›ÜŠÒOŒ
\
OŒ	‰ˆYVÊY‹M
OŒ—NÊNÚYŠOYVØÊÍŒ—KUŸVØÊÍŒ—OXKY‹J
JOŒ
JXœ™XZßZYŠ
JO
Y›ÜŠ™OLJÊ

ÌOŒ
KÎ_
_OJJOOLLŽÎÊ^ÚYŠÏJ
OLX_
JONOÎN˜KŒROŒ
\YVÒOŒ—NÙ[Ù^Ù›ÜŠLYNO“ß_ŠLOÊKOLRNÑ™OXKOYVÜŒ—KVÜŒ—OQ™JÊO“ß
KOTÊ‹Iš
K
\
Í
OŒŒÊNÜYVÒOŒ—KI‰ŠVÙŒ—OXKYŠÍ
_ZYŠOSÊÙVØÊÍŒ—_VØÊÍŒ—OXKOJ\ŠJÒ_Y‹JUOÒŽ’JOŒŠ™JOÜ
Ê™OŠ_™‹J
JO
JXœ™XZßZYŠOLJŒROŒ
OTÊ‹ROŒ‹JKLL
YVÒOŒ—JOŒL
JJY›ÜŠØOXJÌ_ŒJTÊL
JOŒÊNÚYŠ

JJ
JHOLLØNŒ
_
KJ
JOOLLÉˆHJ
J_
JO
Ê‹RŒ‹JKN_
J^ÚYŠOJ


JOÍŒŽLŠJØß
JÊ
J
\
ÎLŒMŸ
JKÎ_
OŠ_
KMLL

ÏU‹TÊJ_
JOMÊY›ÜŠÜTÊL
K

ÏSÊÌ_
JHONÊNÚYŠJJOJYVÑOŒ—JKTÊ™OJŒ
KÊŒ
_
_
IŠ
QJÍ
JOOJŠJI‰ŠJI˜™JI‰ŠONLÌNNLMÍNL‹JI™ÖÑKMJ_

HOLYN_OŒQOŒ
_
ONLÌNNLMÍNM
K™OJŠOOJ
OÌNŒKK™OJ\Œ_
OŒ•OŒËNŠ
OOJJOÜ™NŒKKVÌ™WHOM_™_
™OK\™KOKPJKU‹U_VÑOŒ—OZJÜ™HOPJJ^ÚYŠO\
ÚVÑOŒ—OXKOŒLYNJY›ÜŠÙVÑOŒ—OL
OQKM
OŒOŒ	‰ŠVÊORKM
OŒ—OL
KOYVÑOŒ—JÌ_VÑOŒ—OXKOŒŽNNNNNNNNNÊNÚYŠOTÊ‹ROŒ‹JKLLJ
YVÒOŒ—JOŒL
JY›ÜŠØOXJÌ_ŒJTÊL
JOŒÊNßYYŒŠQJÍ
OŒÜ™ŸY›ÜŠÚY‹JYŒROŒ
I‰ˆYVÊZM
OŒ—NÊNÚYŠ
JOOLLÊ^ÚYŠJ
J
UJJOŠJIŠJO‹MJOß˜N‹LJJÜJËLN‹LŠJÛJON	›ŠJ^ÚYŠKNKU‰‰ŠOYVÚMŒ—JI‰ŠÏLLLJ
OŒ
ILL
JJ^Ù›ÜŠÜY‹YŠÌ_J
OŒ
IJ
ÏTÊËL
JOŒ
_
NÊNÙ_œ\TÊRŒ‹JK
LÌÉ›
HOMÌÊOLJ
J
J
JÜ
JÙŸ
KN_
JOŒÙŽŒ
JOŠ
OÕ™ŠNŠOLJ
J
JŠÜ
KN_
JOŒÙŽŒ
JOŠ
OÕ™Š__Y[ÙHON	›ŽÚYŠÏKLK


Q_
OÌŒMÍÍNŒŒMÍÍŠJO

JXœ™XZÈNÚYŠOLJÊHJŠJÕ
_

KLÌÉ›
JHOMÌ
^ÚYŠ
ÙKJPœÊ

XOŒÌJW˜JKYŸÙJJ_
OLJY›ÜŠÙÖÌ
Y‹L_
WOM
ÙKYŸ
OŽÊNÚYŠÖÌ
™OY‹LŸ
WO[ÖÙ‹L_OJJOÍNË

ZÙKX™_
JOŠŒMÍÍ×•JJXœ™XZÈ_Y[Ù^ÚYŠ
ŒMÍÍ×•JO
JJXœ™XZÈNÙJJOŒØNŒZYŠ

OYŠÕ_
JOŠŒMÍÍ×˜ÙJJXœ™XZÈNÔŠÌ‹‹OXJØÙ_ŠK\Š™KÙJKŠ‹KMLÍ—›ŠNÜŽžÜÎžÛÎžÚYŠ

OOMÌ
^Ù›ÜŠON
XÊÌMŸ
KON_O\ROŒ’ŒÒŽ’NÎÊ^ÙPœÊVÒOŒ—KJNÛŽšYŠ

OOJJJJŠOOJJI‰ŠÖØÊÌOMXJNÙ[Ù^ÚYŠÊÌMŒYŒ
Xœ™XZÈŽÙ›ÜŠÙÖÌ
Y‹L_
WOMÊÌMŒŒÊNßZYŠ\Š‹KYŸ
KJŒJORJÍ
OŒ
JXœ™XZßZYŠ‰‰–\ŠNNNJK

OLOŒZŒ
Xœ™XZÈÎÙ›ÜŠÎÊ^ÚYŠ
PœÊVÒOŒ—KJJOŒ˜ÊÌMŒ
Y›ÜŠÙÖÌ
Y‹L_
WOMÊÌMŒŒÊNÚYŠ\Š‹

ONOÎN•
KUN_ŒJORJÍ
OŒ
Xœ™XZÈÎÚYŠOJ
OŽKY‹XJXœ™XZßXœ™XZÈß[ŽšYŠJ

O
JY›ÜŠROŒŒÚ’JÍON
XÊÌMŸ
KN_RNÎÊ^Ê
OOJ
PœÊVÜŒ—K
JJI‰ŠÖØÊÌOMXJNØÎšYŠ

OOJJJV\Š‹JKYŠÌ__	‰–\ŠNNNJNÙ[Ù^ÚYŠÊÌMŒYŒ
Xœ™XZÈÎÙ›ÜŠÙÖÌ
Y‹L_
WOMÊÌMŒŒÊNßZYŠ\Š‹

ZYŸ
JOŠ
OÕ›
KU[ŒJ\
Í
OŒ
Xœ™XZÈŽÚYŠJ

OL
JXœ™XZßTŠ
ÌNN
K\Š™KÙKX™_
NØœ™XZÈŸYUTŠŠÎ_K
_TŠÌ‹‹KNL—›ŠKÏJŠO
JOÕNœŽØœ™XZÈ_ZYŠOJŒÌIŽJJÓ™_JOŒŒLJJ^Ù›ÜŠLL‹X_™OLMŽÜ™JLM‹Y‹L_ÊNÐO]VÌWHOMOÐJÜ™K\™N‹J™JÊPK\™JJ_Y›ÜŠ
ÙJOOJ
PœÊ

YVØÊÍŒ—JWŠYŒÌJJK\ÙJJJI‰ŠÖØÊÌM_OMXÊÌM_
KLŸÙKOLÌ‰›YVØÊÍŒ—KÖÌ
Y‹LŸ
WO[
ÌMKÖÙ‹L_OJ
OÍNËN	›‹XÊÌMŸÛ\PYJJOŒMÍÍßŸN‹LŒMÍÍÖÌOR_VÚ
ÌLLLŸKJ
JOŒŠIŠOLMŠŠKJÊ
JJOOL

[
Ì_
KJÊÌMŸ
_
HOL_
ÖÛ
Ì_OM‹[
ÌŸ
KHOLÊNÓÏKLK
ŒMÍÍKJJZÙKU
JÒŸ
_
O
J_
ŠÌ‹‹JOHX_

O\JÊÌMŸ
_
KLŸ
OJJOÒO\JÊÌMŸ
_˜JÌŸ
JÛŠK\ŠKŠKŠ‹MLÍ—›ŠK\ŠÊÌMŸJKŠKR_
K\ŠŠKŠÌ‹‹NL—›ŠKÏJŠO

OÛœŠ_Y[ÙHŠÌ‹‹XÙJÌßMMLÍÉ›ŠK\Š™KÙJKOLÌ‰›\ŠHOPOØOÎMNMŽŽMÍÍ˜OÎLÎŽMŒÊKŠÌ‹‹‹NL—›ŠKÏJŠO
ŠOÙŽœŽÜ™]\›ˆXÊÍMŒßK[˜Ý[ÛŠJ^Ý˜\ˆŽÝLP_LOYVÐOŒ—JÍÉ‹NVÜŒ—OPJÌM‹VÝŒ×OVXJVÐOŒ—KVÐJÍŒ—KVÐJÎŒ—KVÐJÌLŒ—J_K[˜Ý[ÛŠKŠ^Ð_LŸLÝ˜\ˆK‹LÏLÜ™]\›ˆOYVÎ
ÊL
OŒ—KÏYVØJÍŒ—KYVÝ
ÌŽŒ—K
JYVÝ
ÌŒŒ—K[Ÿ
OŒ˜ÏŒØÎ›
I‰Š
VØOŒ—K‹
KVØOŒ—O[
ÙVØOŒ—KÏYVØJÍŒ—K[VØJÍŒ—OXÊKYVØOŒ—K
Ï\Œ˜ÏŒØÎœŠI‰Š
KÊKXÊÙVØOŒ—_VØOŒ—O[VØJÍŒ—OYVØJÍŒ—KXÊKÖÌOLOYVÝ
ÍŒ—KVÝ
ÌŽŒ—OPKVÝ
ÌŒŒ—OPKŸK[˜Ý[ÛŠKŠ^ÜŸLÝ˜\ˆK‹LÜ™]\›ˆ
_LOYVÎ
ÊL
OŒ—K\ŒŠJPÜÊK\ŠÌMŸ
JOÛ‹X_›
OŒÛœŠKOXJÛVÝ
ÎŒ—OPKVÝ
ÎŒ—OPKVÝ
ÍŒ—O\ŠØKŸK[˜Ý[ÛŠKŠ^Ð_LŸLÝ˜\ˆKLLÏLÛYVÎ
ÊL
OŒ—KOYVÛŒ—OÛŽŽL‹LÙNšYŠVÝ
ÍŒ—JY›ÜŠÎÊ^ÚYŠJYVÊŠJØOŒ—JJXœ™XZÈNÚYŠÖÙVÝ
ÍŒ—JÛŸOJ
OLLŽÍ›J
[ŠÌ_
OŒVÝ
ÍŒ—JJXœ™XZß\™]\›ˆYVÝ
ÍŒ—KVÝ
ÍŒ—O[VÝ
ÎŒ—OJŠJØKVÝ
ÎŒ—O[ŠÛ\Ÿ[Ÿ
VÝ
ÍŒ—O[
ÌKÖÌWO]VÌKÏLJKßKÚK[Ë›‹›‹[˜Ý[ÛŠKŠ^ÜŸLÝ˜\ˆKLÜ™]\›ˆXOR
ËMLKœÊL_L
_
LI‰ŠL
OQ
KLLLÌŠJI‰Š]

XJÎ
KLŠKVØJÍMŒ—OLKVØJÌŒŒ—OKLKVØJÌMŒ—O]VØJÎŒ—OPK]ÙVÙVÐOŒ—JÌŽŒ—WJK‹VÜŒ—KJK

YVØJÌÌŒ—JJOOLI‰ŠVÜŒ—OYVØJÌŒ—JKJ
OOLJJJKXKHMŸK[˜Ý[ÛŠK‹K‹
^ÜŸL_LŸLLœÊLVÎ
Ê_L
OŒ—K
I‰œ›ÊK‹KŠ_K[˜Ý[ÛŠK‹KŠ^ÚYŠŸL_LŸLœÊLVÎ
Ê_L
OŒ—KŠJYVÐJÌŽŒ—OOL_VÐJÍŒ—HOJŠ_
VÐJÌŽŒ—OXJNÙ[ÙHNšYŠœÊVÐOŒ—KŠJ^ÚYŠJVÐJÌMŒ—HOJŠI™VÐJÌŒŒ—HOJŠJJ^ÚYŠ
JHOLJXœ™XZÈNÜ™]\›ˆ›ÚY
VÐJÌÌŒ—OLJ_YVÐJÌŒŒ—O\‹VÐJÌÌŒ—OXKVÐJÍŒ—OYVÐJÍŒ—JÌKVÐJÌÍŒ—HOL_VÐJÌŒ—HOLŸ
ÖÐJÍMOLJKVÐJÍŒ—OM_K[˜Ý[ÛŠK‹J^ÜŸL_LœÊLVÎ
Ê_L
OŒ—K
I‰˜ÛÊK‹J_K[Ë[˜Ý[ÛŠK‹K‹
^ÜŸL_LŸLLœÊLVÎ
Ê_L
OŒ—K
OÜ›ÊK‹KŠNŠYVÝ
ÎŒ—K]ÙVÙVÝŒ—JÌŒŒ—WJK‹K‹
J_K[˜Ý[ÛŠK‹KŠ^ÚYŠŸL_LŸLœÊLVÎ
Ê_L
OŒ—KŠJYVÐJÌŽŒ—OOL_VÐJÍŒ—HOJŠ_
VÐJÌŽŒ—OXJNÙ[ÙHNžÚYŠœÊVÐOŒ—KŠJ^ÚYŠJVÐJÌMŒ—HOJŠI™VÐJÌŒŒ—HOJŠJJ^ÚYŠ
JHOLJXœ™XZÈNÜ™]\›ˆ›ÚY
VÐJÌÌŒ—OLJ_YVÐJÌÌŒ—OXNÝšYŠVÐJÍŒ—HOM
^ÚYŠÖÐJÍLŒWOLYVÝ
ÎŒ—K]ÙVÙVÝŒ—JÌŒŒ—WJK‹‹KŠKVÐJÍLßJ^ÚYŠVÐJÍŒ—OLË]VÐJÍLŸJXœ™XZÈØœ™XZÈ_YVÐJÍŒ—OMZYŠVÐJÌŒŒ—O\‹VÐJÍŒ—OYVÐJÍŒ—JÌKVÐJÌÍŒ—HOL_VÐJÌŒ—HOLŠXœ™XZÈNÜ™]\›ˆ›ÚY
ÖÐJÍMOLJ_]YVÝ
ÎŒ—K]ÙVÙVÝŒ—JÌŒ—WJK‹KŠ__K[˜Ý[ÛŠK‹J^ÜŸL_LœÊLVÎ
Ê_L
OŒ—K
OØÛÊK‹JNŠYVÝ
ÎŒ—K]ÙVÙVÝŒ—JÌŽŒ—WJK‹JJ_K[Ë[˜Ý[ÛŠ
^Ü™]\›ˆÎßK[Ë[˜Ý[ÛŠ
^Ü™]\›ˆLNK[Ë[˜Ý[ÛŠ
^Ü™]\›ˆMßK[˜Ý[ÛŠ
^Ý˜\ˆNÜ™]\›ˆO]LYVÝŒ—KVÐOŒ—O]
ÌK


YÖÌJJOÍMLÌÎŒMI
_K[˜Ý[ÛŠK‹K‹
^ÝL_LŸL_LŸLLÝ˜\ˆËLLOLLOLLÏLLÚYŠÏWØJ
KVØÊÍŒ—OXKVØÏŒ—O\‹OÊ
ÊÌMŸKÍÍŠKVØÊÌÎLŒ×OJVÐJÌÍŽŒ×K^VÐOŒ×JKÊÊŒ
KOL
NOLKVØÊÍŒ—O[‹ÖØÊÎOPK
^ÚYŠYVÝ
ÌŒ—JY›ÜŠOYVÝ
ÌŒŒ—KOYVÝ
ÎŒ—NÊYVÙVÊOŽ	ŒMÍÍÌŒLŠJØOŒ—JÊ
LŒÉJOŠOŒ—JI‰ŠJŠKYVÝ
ÌŒ—KOYVÝ
ÎŒ—KOYVÝ
ÌŒŒ—JKOPJÌ_VÝ
ÌŒŒ—OPK\‹L_VÝ
ÌŒ—O\‹OŒLŒ	‰ŠJVØOŒ—JKOYVÝ
ÎŒ—JÍVÝ
ÎŒ—OXKOYVÝ
ÌŒŒ—KLLVÝ
ÌŒŒ—OPKYVÝ
ÌŒ—JKŽÊNÐOYVÝ
ÌŽŒ—KVÝ
ÍŒŒ—OYVÐOŒ—K
YVÝ
ÌÌŒ—JI‰ŠÖÐJÎO]VÜŠÎK
JÌMŸ
ÍÍÍŠK
OYVÝ
ÌÌŒ—JI‰™JJKVÝ
ÌÌŒ—OL
_ZYŠJOYVÝ
ÌŒ—JJÙVÝ
ÌŒŒ—_YVÝ
ÌLŒ—K
ŠOOJ


OYVÝ
ÎŒ—JJHOJŠOÊ‹PO
KLNŒ
JJ^ÒYRLÌŸÙNžÝžÜŽžÜÎžÚYŠ
OYVÌMŠÊ]
Í
OŒ—JOŒLL
^ÚYŠVÛ
ÌMŒ—OPKLLOYVÛ
ÍŒ—KYVÐOŒ—KPJÍVÛ
ÍŒ—O[‹

OYVÛ
ÎŒ—JJOOYVÛ
ÌLŒ—JZYŠ
YVÛŒ—JOŒŒ
\P™J
OJJÊ‹\ŒŠ_
KËLŠJÛŸ‹OPK[Ÿ
JÐ_VÛ
ÎŒ—O\‹VÛ
ÍŒ—OXJÙVÛ
ÍŒ—NÙ[Ù^ÚYŠ
JJOOJ
OÌNK\ŒJOŒLLÌÍÍN
Xœ™XZÈÎÚYŠÏJO\ŠJÊOWØJJJ_XORJÊM	œŠ_
JHOJŠJ^ÚYŠKM	ŠOPK[Ÿ
KOLJÊ
PKM
OŒŸ
IÊY›ÜŠLOXNÙVÐOŒ—OYVÛŒ—K[ŠÍOPJÍ
JHOJ
\ŠÌ_
JNÊNÙ[ÙHOXNÚYŠXJÕŸJŒŽ
JY›ÜŠÙVÐOŒ—OYVÛŒ—KVÐJÍŒ—OYVÛŠÍŒ—KVÐJÎŒ—OYVÛŠÎŒ—KVÐJÌLŒ—OYVÛŠÌLŒ—KVÐJÌMŒ—OYVÛŠÌMŒ—KVÐJÌŒŒ—OYVÛŠÌŒŒ—KVÐJÌŒ—OYVÛŠÌŒ—KVÐJÌŽŒ—OYVÛŠÌŽŒ—K[ŠÌÌŸ
ŠHOJ
OPJÌÌŸ
JNÊNßYVÛ
ÌLŒ—OSËVÛ
ÎŒ—O\‹VÛ
ÍŒ—OXKVÛŒ—ORK	‰ŠJ
KYVÛ
ÎŒ—J_Y[ÙHPNÙVÜŒ—OUVÛ
ÎŒ—OYVÛ
ÎŒ—JÍØœ™XZÈ_ZYŠ
JYVÛ
ÎŒ—JKYVÛ
ÍŒ—OŒŠOŒ
OJOYVÛ
ÌLŒ—JKJYVÛŒ—J_
OŒŒ
^ÚYŠ
JHOJŠJ^ÙVÙŠÎŒ—OWØJMŠK\ÊŠÎ
NØœ™XZÈ_ZYŠVÙŠÎŒ—OWØJMŠKJŠÎ
KOYVÛ
ÍŒ—KYVÐOŒ—KPJÍVÛ
ÍŒ—O[‹

OYVÛ
ÎŒ—JJOOYVÛ
ÌLŒ—JZYŠ
YVÛŒ—JOŒŒ
\P™J
OJJÊ‹\ŒŠ_
KËLŠJÛŸ‹OPK[Ÿ
JÐ_VÛ
ÎŒ—O\‹VÛ
ÍŒ—OXJÙVÛ
ÍŒ—NÙ[Ù^ÚYŠ
JJOOJ
OÌNK\ŒJOŒLLÌÍÍN
Xœ™XZÈÎÚYŠÏJO\ŠJÊOWØJJJ_XORJÊM	œŠ_
JHOJŠJ^ÚYŠKM	ŠOPK[Ÿ
KOLJÊ
PKM
OŒŸ
IÊY›ÜŠLOXNÙVÐOŒ—OYVÛŒ—K[ŠÍOPJÍ
JHOJ
\ŠÌ_
JNÊNÙ[ÙHOXNÚYŠXJÕŸJŒŽ
JY›ÜŠÙVÐOŒ—OYVÛŒ—KVÐJÍŒ—OYVÛŠÍŒ—KVÐJÎŒ—OYVÛŠÎŒ—KVÐJÌLŒ—OYVÛŠÌLŒ—KVÐJÌMŒ—OYVÛŠÌMŒ—KVÐJÌŒŒ—OYVÛŠÌŒŒ—KVÐJÌŒ—OYVÛŠÌŒ—KVÐJÌŽŒ—OYVÛŠÌŽŒ—K[ŠÌÌŸ
ŠHOJ
OPJÌÌŸ
JNÊNßYVÛ
ÌLŒ—OSËVÛ
ÎŒ—O\‹VÛ
ÍŒ—OXKVÛŒ—ORK	‰ŠJ
KYVÛ
ÎŒ—J_Y[ÙHPNÙVÜŒ—OUVÛ
ÎŒ—OYVÛ
ÎŒ—JÍØœ™XZÈ_ZYŠVÙŠÌŒ—O[
ÌL‹J
OJJOOJŠOÌN˜OŒJOŒLLÌÍÍN
J^ÚYŠOWØJPOŠKVÙŠÎŒ—OPKOPJÊŠ_VÙŠÌMŒ—OXKVÙŠÌŒŒ—OPJÜ‹VÙŠÌLŒ—OXKVÙŠÍŒ—OWØJMŠK\ÊŠÎŠÍ
K

YVÛ
ÎŒ—JJOOYVÛ
ÍŒ—J^ÐO[ŽØœ™XZÈY›ÜŠÕJŠÎ[‹M
KVÛ
ÍŒ—HOJŠNÊNØœ™XZÈŸ_XÚJ
KŠ
_POYVÛ
ÎŒ—_\YVÛŒ—KVÛŒ—OYVÙŠÎŒ—KVÙŠÎŒ—O\‹VÛ
ÍŒ—OYVÙŠÌLŒ—KVÙŠÌLŒ—O[‹VÛ
ÎŒ—OYVÙŠÌMŒ—KVÙŠÌMŒ—OPKOYVÛ
ÌLŒ—KVÛ
ÌLŒ—OYVÙŠÌŒŒ—KVÙŠÌŒŒ—OXK
JHOJŠI‰ŠVÙŠÌMŒ—OPJÊÊÊ‹P_
I‹M
JK‰‰™JŠ_RYŠÌÌŸJOYVÝ
ÌŒ—JJÙVÝ
ÌŒŒ—_OYVÝ
ÎŒ—_YVÙVÐJÊŽ	ŒMÍÍÌŒLŠOŒ—JÊ
LŒÉœŠOŠOŒ—OXËVÝ
ÌŒ—OXJÌ_K[˜Ý[ÛŠ
^Ý˜\ˆOLLOLLLÏLLLOLÜYVÍŒ
ÊL
OŒ—JÌ_VÝ
ÍŒŒ—O\ŽÙNžÚYŠOYVÝ
ÌÌŒ—J^ÚYŠŒŠYVÐJÍŒ—JOŒ
^ÊYVÝ
ÌŽŒ—JI‰ŠJŠKOYVÝ
ÌÌŒ—JKVÝ
ÌÌŒ—OLVÝ
ÌŽŒ—OPNØœ™XZÈ_Y›ÜŠ]
ÍÏPJÌMŸYVÝ
ÌŽŒ—JÌMŸOJÊŒ
KÊÊŒ
KOLÎÊ^ÚYŠO^VÊPOÊJØÏŒ×K^VÜŠÜŒ×KVÜŠÛŒ×OXOOXOÊK[ŠJ’JÛŽ›‹

L_JJOOMÊXœ™XZÈNØO^VÊLÊJØÏŒ×K^VÜŠÜŒ×KVÜŠÛŒ×OXOOXOÊK[ŠJ’JÛŽ›‹OPJÌŸ_ZYŠOYVÝ
ÌŽŒ—KŒœVÐOŒ—J^ÚYŠYVÝ
ÌŒ—J^ÚYŠÖÝ
ÍMŸOLÏYVÝ
ÎŒ—KYVÝ
ÌŒŒ—KOYVÙVØÊÊŽ	ŒMÍÍÌŒLŠOŒ—JÊ
LŒÉœŠOŠOŒ—KVÝ
ÌÌŒ—OPKVÝ
ÌŒ—O[LK\ŠÌ_VÝ
ÌŒŒ—O\‹ŒLŒ	‰ŠJVØÏŒ—JKVÝ
ÎŒ—OYVÝ
ÎŒ—JÍVÝ
ÌŒŒ—OYVÝ
ÌŒŒ—KLLOYVÝ
ÌÌŒ—JKVÐJÎJS
JÌMŸVÝ
ÌŽŒ—JÌMŸÍÍŠKOYVÝ
ÌÌŒ—KVÐJÌÍŽŒ—OLVÐJÌÍÌŒ—OLO^VÝ
ÍŒ×KVÐJÌÎLŒ—OLVÐJÌÎMŒ—OLVÐJÌMŒ×OXNÙ[ÙHYŠYVÝ
ÌŽŒ—KVÜŠÎI‰Š
ŠÌMŸJÌMŸÍÍŠKOYVÝ
ÌŽŒ—KVÐJÌÍŽŒ—OLVÐJÌÍÌŒ—OLJOYVÝ
ÌÌŒ—JJJXœ™XZÈNÊ
YVÐJÍŒ—JJHOKLI‰ŠVÝ
ÍŒ—O\ŠKVÝ
ÍŒŒ—OLVÐJÌMŒ×O^VÐJÌÎLŒ×JŠÜVÐJÍŒ—JÞVÐJÌMŒ×NØœ™XZÈ_YÖÝ
ÍMŸOL_Y[ÙHO^VÐJÌÎLŒ×JÞVÝ
ÍŒ×KVÝ
ÍŒ×OXKVÐJÌMŒ×OX_\™]\›ˆ
VÝ
ÍMŸOÌ
Í
_K[˜Ý[ÛŠ
^Ü™]\›ˆVÍ
ÊL
OŒ—_K[˜Ý[ÛŠ
^Ý˜\ˆOLÜ™]\›ˆVÊL
OŒ—OLLÌŒÌ
OYVÝ
ÌŽŒ—JI‰™JJK
OYVÝ
ÌÌŒ—JI‰™JJKJ
Í
KK[˜Ý[ÛŠ
^Ý˜\ˆOLÙVÊL
OŒ—OLLÌŒÌ
OYVÝ
ÌŽŒ—JI‰™JJK
OYVÝ
ÌÌŒ—JI‰™JJKJ
Í
KJ
_K[˜Ý[ÛŠKŠ^Ð_LŸLÝ˜\ˆOLLLÏLLLOLLOLLÏLLOLL™OLÙOL™OLÙOLOLÚYŠYVÌL
ÊL
OŒ—J\™]\›ˆÙNšYŠJ^Ù›ÜŠO]
Í]HMÎÊ^ÚYŠOYVÝ
ÌLŒ—KJOL]ÙVÙVØOŒ—JÍŒ—WJJJJXœ™XZÈNÚYŠTØJVÝ
ÌÌŒ×JÞVØJÌMŒ×KÊÙVÝ
ÌŒ—JKVÝ
ÌÌŒ×O[‹\ÜÊ‹ŒŽÌNLÌÌMÎMNŠ›ŠKTØJVÝ
ÌMŒ×JÞVØOŒ×JŠŒŠ›ŠžVØJÎŒ×JÌJKÊÙVÝ
ÎŒ—JKVÝ
ÌMŒ×O[‹PPJVÍMŽKVÍMŽWKLŽNÍËMMÍNLÌÊK[KJYŠÌ_
OÛ›
Ì_VÍMŽOY‹VÍMŽWO[ÏKÍJžVÝ
ÍŒ×JÈ
ÊŒ_
KÌŒMÍÍËVÝ
ÍŒ×OXË^VØJÌŒ×K[^VØJÌÌŒ×KÖÝ
ÍO[ÏJZ
JŠKŒŠ˜ÊKÏYŠ
ÍLLŸŠ
Í^VØJÌÍLŒ×JŠ
žVØJÍŒ×JÞVØJÍŒ×JŠŠÛŠËLJÊØÎ‹ŒJ˜ÊJJJ‹KVØJÌLŒ×KVØJÌMŽŒ×JKVØJÌLLŒ×KVØJÌMÍŒ×JKÏYŠ
ÎŠ
ÎŠ
ÌMLŸŠ
ÌŒŠ
ÌŽMŸŠ
ÌÍŽÏOXÏÊË[ŠJžVØJÌNŒ×JÛŽ›‹VØJÎMŒ×KVØJÌMŒŒ×JKVØJÎŒ×KVØJÌMLŒ×JKVØJÎŒ×KVØJÌMŒ×JKVØJÍÌŒ×KVØJÌLÍŒ×JKVØJÍŒ×KVØJÌLŽŒ×JKVØJÍMŒ×KVØJÌLŒŒ×JKPPJVÍMŽKVÍMŽWKLŽNÍËMMÍNLÌÊK[KJYŠÌ_
OÛ›
Ì_VÍMŽOY‹VÍMŽWO[KÍJžVÝ
ÍMŒ×JÈ
ÊŒ_
KÌŒMÍÍËVÝ
ÍMŒ×O[‹JOJJÜŸYŠJÎ^VØJÌÍLŒ×JŠVØJÌNLŒ×JŠŒÊ›ŠJJ‹KVØJÌŒŒ×KVØJÌŒ×JKÏ^VØJÌŽMŒ×KYŠJÎ‹VØJÌŒŒ×KVØJÌMŒ×JKO^VØJÌÌŒ×KYŠJÌMLŸ‹VØJÌŒMŒ×KVØJÌŒ×JK™O^VØJÌÌLŒ×KÙOYŠJÌŒ‹VØJÌŒŒ×KVØJÌÌŒ×JK™O^VØJÌÌŒŒ×KÙOYŠJÌŽMŸ‹VØJÌŒÌŒ×KVØJÌŽŒ×JKO^VØJÌÌŽŒ×KXËÏJŠJÌÍŽ‹VØJÌŒ×KVØJÌŽŒ×JK[ŠJžVØJÌÌÍŒ×JÊJŠÙK[ŠJÊ™JŠÙK[ŠJÊ™JŠ‹[ŠJÊJŠ‹[ŠJÊÊŠ[ŠJÌ
JJJJKJ
ÊO[Ê‹XÊJžVØJÌÍŒ×JØÎ˜ÊJJžVØJÌÍŒŒ×JLËOJ
OPYJŠOŒMÍÍßŸ›Ž‹LŒMÍÍ
JOLÌ™LÏÌÌ™LÎ˜KÖÛŒWOJJOKLÌ™LÏËLÌ™LÎ˜K

OQJÌ_
JOOJJJXœ™XZßQOP_\™]\›ˆ
OŒ‘OŒÑNJ_K[˜Ý[ÛŠJ^Ð_LVÌL
ÊL
OŒ—OP_KÚK[ËK[˜Ý[ÛŠK‹J^Ü™]\›ˆOLWKË™Ü›ÝÏY[˜Ý[ÛŠ
^Ý˜\ˆO]\Ë›[™ÝÜ™]\›ˆ\Ë›[™Ý]\Ë›[™Ý
Ý_KËœÙ]Y[˜Ý[ÛŠJ^Ý\ÖÝOP_KË™Ù]Y[˜Ý[ÛŠ
^Ü™]\›ˆ\ÖÝ_KÊNÜ™]\›žÝŽ™[˜Ý[ÛŠ
^Ý˜\ˆOLÒ]RLMŸYJ
ÌLŸ
Î
_
O]J
ÊVÝ
ÌLŒ—OŠ_
KVÍMŽOPKI‰ŠJO]JVÝ
ÎŒ—JJ_
VÙVÍMŽJÊVÝ
ÌLŒ—OŠOŒ—OL™JVÍMŽKJJJI‰ŠVÍMŽOL
JK]
ÌMŸVÍMŽWOLŒÌŒÍ‹VÍMŽŒ×OMŸKÎ•ÛËž‹N™[˜Ý[ÛŠJ^Ð_LVÊL
OŒ—OP_KŽ™[˜Ý[ÛŠJ^Ü™]\›ˆ_LÖÙVÊL
JÍŒ—JÐ__KN–ZKŽššKÎ™[˜Ý[ÛŠ
^Ü™]\›ˆVÊL
JÌLŸ_K™[˜Ý[ÛŠJ^Ð_LÖÊL
JÌLŸOP_KN™[˜Ý[ÛŠ
^Ü™]\›ˆVÊL
JÌLß_KŽ™[˜Ý[ÛŠJ^Ð_LÖÊL
JÌLßOP_KÎ™[˜Ý[ÛŠ
^Ü™]\›ˆVÊL
JÌM_K™[˜Ý[ÛŠJ^Ð_LÖÊL
JÌMOP_KN™[˜Ý[ÛŠ
^Ü™]\›ˆVÊL
JÌM__KŽ™[˜Ý[ÛŠJ^Ð_LÖÊL
JÌM_OP_KÎ•šK™[˜Ý[ÛŠJ^Ð_LVÊL
JÌMŒ—OP_KN“[‹Ž™[˜Ý[ÛŠJ^Ð_LVÊL
JÌŒŒ—OP_KÎ•ÛËž‹N’KŽ–ZKÎšÛ‹•šKN“[‹Ž™[˜Ý[ÛŠ
^Ü™]\›ˆVÊL
JÌŒ—_KÎ•ÛË™[˜Ý[ÛŠ
^Ý˜\ˆOLLOLLLÏLLLOLLOLLÏLLOLL™OLÙOL™OLÙOLOL™OL™OLÚYŠWØJŒ
KVÝ
ÌMŒ—OLVÝ
ÎŒ—OLMÍKVÝ
ÌLŒ—OMLJOYVÌÌÌŒJJ^ÒPOJX™ORLMŸ
KNÙNžÚYŠ
RÊŽLŠJI‰ŠVÐJÌÌŒ—O\‹ØJLÍÍNMŒNMNKJÌÌŸ
K
JLÍÍN
JOOKLÌ_
VÐJÌMŒ—O\‹ØJLÍÍNMŒŒÌKJÌMŸ
K
JLÍÍN
JOOKLÌJJJXœ™XZÈNÊRÊŒNJJI‰ŠVÐOŒ—O\‹ØJLÍÍNMŒNMNKJK
JLÍÍN
JOOKLÌJ_
]VÎ—_VÎ×OVÎŽOMŸVÎŽWOVÌÍÎM—O]VÎŒ—_VÎŒ×OVÎOMŸVÎWOVÌÍÎM×O\‹ÖÍŽO]VÎ—_VÎ×O]VÎ—_VÎ×OVÎOMŸVÎWOVÌÍO]VÎÎ_VÎÎWOVÎOMŸVÎWOVÌÍWO\‹]VÎÍ_VÎÍWOVÎÍ—OMŸVÎÍ×OVÌÍÎNO]VÎÌ_VÎÌWOVÎÌ—OMŸVÎÌ×OVÌÍÎNWO\Š_ZYŠPJÎVØ™JÌLŒ—OLX™JÌLŸYRLMŸVÙŠÌLŒ—OLŒŒLJLM
_JLÌMJ_JMÌÊ_JMŽN
KOYŠÌLŸ[RLMŸVÛ
ÌLŒ—OLJ
O\ŠLÍÎÌ‹Œ‹ŠJ_
O\ŠLÍÎÍ‹ŒŠJ_
O\ŠLÍÎLËŠJ_
O\ŠLÍÎŒLM‹
ÌLŸŠJJJZYŠVÌÍMO\VÛ
ÌLŒ—KÍŽYVÌÍŒKVÌÍM—O\‹‰‰Š
O]VÌ—_VÜŠÌ_OVÜŠÌŸOMŸVÜŠÌßO
JOONÎMŽJ^ÚYŠ]VÜŠÍ_VÜŠÍ_OVÜŠÍŸOMŸVÜŠÍßOYVÌÍNK]VÌ—KVÌÍŒWOU‹ŠY›ÜŠO\ŠÍOLØOTÊK
JÌLÍÎMŸ]VÌWKVØJÌÍŒ—O[‹VØJÍŒ—O]VÐJÌ_KÏ]VÐJÎ_VÐJÎ_OVÐJÌLOMŸVÐJÌL_O]VÐJÍ_VÐJÍ_OVÐJÍŸOMŸVÐJÍßOÖÌWO\‹ÖØJÌ_O\ŽÖØJÌŸO\ŒM‹ÖØJÌßO\ŒÖØJÍOXËÖØJÍ_OXÏŽÖØJÍŸOXÏŒM‹ÖØJÍßOXÏŒÏ]VÐJÌMŸ_VÐJÌMßOVÐJÌNOMŸVÐJÌN_O]VÐJÌLŸ_VÐJÌLßOVÐJÌMOMŸVÐJÌM_OÖØJÎO\‹ÖØJÎ_O\ŽÖØJÌLO\ŒM‹ÖØJÌL_O\ŒÖØJÌLŸOXËÖØJÌLßOXÏŽÖØJÌMOXÏŒM‹ÖØJÌM_OXÏŒÏ]VÐJÌ_VÐJÌ_OVÐJÌŸOMŸVÐJÌßO]VÐJÌŒ_VÐJÌŒ_OVÐJÌŒŸOMŸVÐJÌŒßOÖØJÌMŸO\‹ÖØJÌMßO\ŽÖØJÌNO\ŒM‹ÖØJÌN_O\ŒÖØJÌŒOXËÖØJÌŒ_OXÏŽÖØJÌŒŸOXÏŒM‹ÖØJÌŒßOXÏŒÏ]VÐJÌÌŸ_VÐJÌÌßOVÐJÌÍOMŸVÐJÌÍ_O]VÐJÌŽ_VÐJÌŽ_OVÐJÌÌOMŸVÐJÌÌ_OÖØJÌO\‹ÖØJÌ_O\ŽÖØJÌŸO\ŒM‹ÖØJÌßO\ŒÖØJÌŽOXËÖØJÌŽ_OXÏŽÖØJÌÌOXÏŒM‹ÖØJÌÌ_OXÏŒPJÌÍŸVØJÌÌŒ—O\‹O\ŠÊ
_
ŠHOJ
ORJÌ_
JNÊNÊŠOYVÌÍM×I‰ŠVÌÍM×OL
KOLI‰ŠVÑOŒ—OU
_Y[ÙHNžÝžÚYŠŠ^ÚYŠYVÛŒ—J^ÙJVÜŠÍŒ—JKOYVÛŒ—NØœ™XZÈZYŠO]JMŠKVÛŒ—OPKJXœ™XZÈÐOMY[ÙHOLŽÍŒŒŒÎØœ™XZÈ_YVÐOŒ—OLKVÐJÍŒ—OYJLÍÍN
KYVÛŒ—KVÜŠÌLŒ—ONÎMŽKVÜŠÎŒ—ORKOLŽÍŒŒŒßZYŠ[
ÌMŸPKPJ^ÚYŠOYVÙŠÌLŒ—KVÍLÍMOQKVÍLÍNWOLVÍLÍŒOLLÍŒMÍÌŽÊJKVÍLÍŒ—OLVÍLÍŒ×OLVÍLÍWOLŒMÍÍËVÍLÎWOLLVÍLÍÎWOLÌ‹VÍLÍŒWOJOŠKÊJKOYVÌŒÎWKVÍLÎOYVÌŒÎKVÍLÎWOPKOYVÌŒÎ×KVÍLÎ—OYVÌŒÎ—KVÍLÎ×OPKOYVÌŒÎWKVÍLÎOYVÌŒÎKVÍLÎWOPKOYVÌŒÎLWKVÍLÎLOYVÌŒÎLKVÍLÎLWOPKOYVÌŒÎL×KVÍLÎL—OYVÌŒÎL—KVÍLÎL×OPKOYVÌŒÎMWKVÍLÎMOYVÌŒÎMKVÍLÎMWOPKOYVÌŒÎM×KVÍLÎM—OYVÌŒÎM—KVÍLÎM×OPKVÍLÎNOYVÌŒÎNKJ
OJ
TÊKŒ
JJKÌLŽ
JOLLŽÌLŽKVÍLÎNWOUVÍLOJ
KÌ‹J
JOOLŒŒL
ŠOLŽ
J^ÚYŠOLIŠOJ
OLOÌN•
K™OJÊ
KOL

OLŠY›ÜŠLŒMÍÍ‰KOLÕORJÌLÌŒMŒLLÊŠKYØJ‹ŒŽÌNLÌÌMÎMNŠŠÊJKÜ™JJKÏPYJ
OŒMÍÍßŸœ‹LŒMÍÍÖÌWOSËOJL_JJÌLÌŒMŒLLÊŠKYØJ‹ŒŽÌNLÌÌMÎMNŠŠÊŠKÜ™JJKÏPYJ
OŒMÍÍßŸœ‹LŒMÍÍÖÌWOSËORJÌŸ

HOJ
OPJÌŸ
JNÊNÑI‰ŠORJÌLÌŒMŒLLÊŠKYØJ‹ŒŽÌNLÌÌMÎMNŠŠÊJKÜ™JJKOPYJ
OŒMÍÍßŸœ‹LŒMÍÍÖÌWOUJ_ZYŠVÍLWOLLMÎL‹VÍMÎM×O\PJ
KVÍMNMOLÎVÍMNLŒWOLKVÍMNLNOLŒŒLVÍMŒ—OLVÍMNMŒOLLLLŽVÍMNMNOLVÍMNMNWOLLÍŒLL‹VÍMNMM—OLLVÍMNLŒ—OLŒVÍMNLŒ×OLŒŒVÍMNLM—OLKVÍMNLM×OLÝ

KVÍMŒOLVÍMŒWOLVÍMNLŽOLVÍMNL—OLVÍMNL×OLVÍMNLOLVÍMŒ—OLVÍMŒ×OLVÍMŒŒOLVÍMŒŒWOLVÍMŒŒ—OLVÍMŒŒ×OLVÍMŒÍ—OLVÍMŒÍ×OLVÍMŒÎOLVÍMŒÎWOLVÍMNMÍOLVÍMNMÍWOLVÍMNMÌ—OLVÍMNMÌ×OL™OKLËŒMMNLLÍNMÎLËÊÊ
OYVÍMNLNJJKVÌÎM×O\™KJÊKŒÌ
JKÌYMVÍMNLŒO[‹OJÊKML
JKÌYMVÍMNLNWOPKKLŠœ™KVÌÎMŽO\™OJ™OUÜŠ™JŠÊŠJJJ‹Q™KVÌŽLŽWO\™KQ™J™ØJ
ŠÊJJK
Ï\VÌŽLŽO\VÌŽL×OLK\\™KVÍMNNLOLVÍMNNLWOLVÍMNNOLVÍMNNWOLVÍMŒ—OLVÍMŒ×OLVÍMŒOLVÍMŒWOLVÍMŒŒ—OLVÍMŒŒ×OLVÍMŒŒOLVÍMŒŒWOLVÍMŒÎOLVÍMŒÎWOLVÍMŒÍ—OLVÍMŒÍ×OLVÍMŒMOLVÍMŒMWOLVÍMŒL—OLVÍMŒL×OLVÍMŒÌOLVÍMŒÌWOLVÍMŒŽOLVÍMŒŽWOLVÍMŒ—OLVÍMŒ×OLVÍMŒOLVÍMŒWOLVÍMŒL—OLVÍMŒL×OLVÍMŒLOLVÍMŒLWOLVÍMŒLNOLVÍMŒLNWOLVÍMŒLM—OLVÍMŒLM×OLVÍMŒLÍOLVÍMŒLÍWOLVÍMŒLÌ—OLVÍMŒLÌ×OLVÍMŒMLOLVÍMŒMLWOLVÍMŒMOLVÍMŒMWOLVÍMŒM—OLVÍMŒM×OLVÍMŒMOLVÍMŒMWOLVÍMŒN—OLVÍMŒN×OLVÍMŒNOLVÍMŒNWOLVÍMŒNNOLVÍMŒNNWOLVÍMŒNM—OLVÍMŒNM×OLVÍMŒŒMOLVÍMŒŒMWOLVÍMŒŒL—OLVÍMŒŒL×OLVÍMŒŒÌOLVÍMŒŒÌWOLVÍMŒŒŽOLVÍMŒŒŽWOLVÍMŒÎWOMNKVÍMOMNKVÍMŒŽWOLVÍMŒÌOMNKVÍMŒNWONKVÍMŒŒOLMŒVÍMŒWOLŽVÍMŒLOMŽVÍMŒLWOLLVÍMŒŒWOMÌVÍMŒÌWOMNKVÍMŒL—OLŽ‹VÍMŒL×OLÌŒVÍMŒŒ—OLMŒVÍMŒŒ×OLŒVÍMŒÌ—OMNKVÍMŒÌ×OMNKVÍMWONKVÍM—OLMKVÍM×OLŒVÍMOLŒVÍMŒÍOMNKVÍMŒÍWOMNKVÍMŒOLŒVÍMŒWOMLVÍMŒMOLÍÌVÍMŒMWOMLVÍMWOMLVÍM—OLVÍMŒM—OMÙLËVÍMŒ—OMLVÍMŒÍ—OLVÍM×OLVÍMŒÍ×OLVÍMŒ×OMLVÍMŒM×ONLËVÍMŽWONKVÍMOLVÍMŒÎOLVÍMŒŽONKVÍMŒNOLŽVÍMM×OMŒ‹VÍMMWOLVÍMM—OLVÍML×OMLVÍMMOLVÍMLWOLVÍML—OLVÍMWOLVÍMLOMVÍMŒ×OLYLËVÍMŒOMNK[RMMŸVÛ
ÌMŒ—OLLÍÍNVÛ
ÌŒŒ—OMËVÛ
ÌŒ—ONNML‹
O[
ÌMŽNK
ÌMŸ
KÏYJKŒÍ
J^ÚYŠÐJ
ÌMÌÊJY›ÜŠOM_
O[
Ì
KLLNÝVÛ
ÌHOMÉ‰ŠVÛ
ÌŒ—HOLMÌMÌÍŒÌÖœŠ
ÌŒMJ_
VÛ
ÍŒ—O[
ÌÌ‹VÛŒ—O[
ÌŒÎK

ŽŽK
JOOL‰‰ŠYVÌÍKVÊLLÍŒÌŠÊ
_
OŒ—OYÖÛ
ÌŒÎ_KOYJ
ÌÌŸ
KVÌÍO[ŠÌKVÕŠÌLŒ—OPKVÕŠÍŒ—OL
JNŠPORMVÌÌŽMŒOKLKVÌÌŽMŒWOKLKVÌÌŽMÌOKLKVÌÌŽMÌWOKLKVÌÌŽMŽOKLKVÌÌŽMŽWOKLKVÌÌŽM—OKLKVÌÌŽM×OKLKVÌÌŽMOKLKVÌÌŽMWOKLKVÌÌŽMŒ—OKLKVÌÌŽMŒ×OKLKVÐJÌÍŒ—OLLÌNÍ‹VÐJÌÌŒ—OLLÌNÌ‹VÐJÌŽŒ—OLLÌNŽVÐJÌŒ—OLLÌNVÐJÌŒŒ—OLLÌNŒVÐJÌMŒ—OLLÌNM‹VÐJÌLŒ—OLLÌNL‹VÐJÎŒ—OLLÌNVÐJÍŒ—OLLÌNVÐOŒ—OLLÌN
KŒŒ‹JKPJÍ
JKÐJ
ÌMÌÊNÊNÑÜŠÊ_R[
ÍMŸVÍLŽM×OLVÍLŽNOLVÍLÌWOLVÍLÌ—OLVÍLŽNWOLVÍLÌOLÊMŽN
KVÌÍWOLVÌÍOLVÌÍ—OLVÌÍ×OKLK›Š
K™J
KOYVÌMŽLKVÌÍŒ—OXKYVÌMŽWKYVÌMŽKVÌÍŒO[VÌÍŒWOZYVÌMŽ×KÏYVÌMŽ—KVÌÍNOXËVÌÍNWOR‹ÙOYVÌMŽWKYVÌMŽKVÌÍM—OU‹VÌÍM×OXÙKÙOYVÌMŽ×KOYVÌMŽ—KVÌÍMOQKVÌÍMWOZÙKOYVÌMŽWKYVÌMŽKVÌÍL—OUVÌÍL×OQKÏYVÌMÎWKYVÌMÎKVÌÍLO[‹VÌÍLWOSËOYVÌMÍ×KOYVÌMÍ—KVÌÍOPKVÌÍWOUKVÌÌÍÌŽWOPKVÌÌÍÌÌOUKVÌÌÍÌÌWO[‹VÌÌÍÌÌ—OSËVÌÌÍÌÌ×OUVÌÌÍÌÍOQKVÌÌÍÌÍWOQKVÌÌÍÌÍ—OZÙKVÌÌÍÌÍ×OU‹VÌÌÍÌÎOXÙKVÌÌÍÌÎWOXËVÌÌÍÍOR‹VÌÌÍÍWO[VÌÌÍÍ—OZVÌÌÍÍ×OXKœŠKMÍJKœŠ‹L
KœŠ‹VÍÌŒJKœŠKVÍÌŒWJKœŠË
KVÍÌNNOLVÍÌNM×OLJÐÙJ
KÌYLËPPJOPYJ
OLŒŒÌÍÌŒÍŽMÍÍ™LÏßŸœŒŒLLÍLMLK
KO[KOJ[ŠÌLŒÍ_
OŒLŒÍOÐJÌ_KVÌÌÌŒWOTšJ‹J_ZYŠYŠÌMŸŠ^ÕOYVÌÌLKÙOYVØ™JÌLŒ—KJRMMŒ
JÍXOJZ
KLMŸÙNžÝœÝÚ]Ú
˜J‹LŽÍNMß
J^ØØ\ÙH“J‹LÌËLLŠNØœ™XZÈNØØ\ÙHN“J‹NLLŠNØœ™XZÈNØØ\ÙHŽ“J‹ÍËLLŠNØœ™XZÈNØØ\ÙHÎ“J‹LLLŠNØœ™XZÈNØØ\ÙH“J‹LLKLLŠNØœ™XZÈNØØ\ÙHN“J‹LÎLLŠNØœ™XZÈNØØ\ÙHŽ“J‹MŒËLLŠNØœ™XZÈNØØ\ÙHÎ“J‹MÌŒ‹LLŠNØœ™XZÈNØØ\ÙH“J‹NLLËLLŠNØœ™XZÈNØØ\ÙHN“J‹Œ‹LLŠNØœ™XZÈNØØ\ÙHL“J‹ŒMLËLLŠNØœ™XZÈNØØ\ÙHLN“J‹ÎLLŠNØœ™XZÈNØØ\ÙHLŽ“J‹ÍÌËLLŠNØœ™XZÈNØØ\ÙHM“J‹ŽMNLLŠNØœ™XZÈNØØ\ÙHMN“J‹ÌÌKLLŠNØœ™XZÈNÙY˜][˜œ™XZÈZYŠNÎLNL‰œŠYVØOŒ—O\‹ØJ‹LL‹ÌN‹JNÙ[Ù^ÚYŠOLP–ÌLŒÍÌŽ
Ê
ŒLMLÏÜŽŒ
OJOŒWJÌLŒNYVÙVÍMŽWJÌŒŒ—J^ÑOYVÜŠÍŒ—KYVÜŒ—KÙOYVÒŒ—JÌMÎMMLLÎÏ\\ÊVÒŠÎŒ—KÙJK\\ÊVÒŠÌLŒ—KÙJKO\\ÊVÒŠÌMŒ—KÙJNÝšYŠJOŒŒSÏŒÉŠ_Š_
QKJÏŠ_
OŒ[ŒOŒ\Œ
JY›ÜŠOPOŒŸ[ŒŸÎÊ^ÚYŠ\\ÊVÊJ
OJJÏSÏŒ_
JÓ™_
OJJÕŠJÒŸ
OŒ—KÙJK
\\ÊVÜŠÍŒ—KÙJJOŒQOŒŒQK\ŒVÊŠÕŸ
JÒŸJXœ™XZÈÚYŠJ]ŠŠÒŸ
JJ^ÚYŠO\\ÊVÊJJÑOŠJÒŸ
OŒ—KÙJK
\\ÊVÜŠÍŒ—KÙJJOŒQOŒOŒQK\Œ
Xœ™XZÈÒO]VÊJÜŸ
JÒŸOÌœŠÒŸØœ™XZÈZYŠ
ÊOOLJXœ™XZÈÓÏJJŠO
OØÎ“ËXß™O\Ó™N›Ÿ_ZYŠ
Q]
OR_
JOŒMLLŠ^Ó
‹KLLJKÖÙŠÍLL_OLØœ™XZÈ_S
‹KŠÌ_
__RXJÌMŸÙNšYŠÙJ^ÝœÝÚ]Ú
VÚÙOŒ—J^ØØ\ÙH™VÚ
ÌMŒ—OYVÚÙJÍŒ—KVÚ
ÌŒŒ—OZ
ÍJKÌÎ
ÌMŸ
NØœ™XZÈNØØ\ÙHN˜œ™XZÈÙY˜][˜œ™XZÈ_POYVÚÙJÌLŒ—KYVÚÙJÎŒ—KVÚ
ÌÍŒ—OYVÚÙJÍŒ—KO\‹VÚ
ÍŒ—OPKVÚ
ÍŒ—O[KVÚ
ÌÌŒ—OZ
ÍJKÍLŒK
ÌÌŸ
_Y[ÙHVÚŒ—OZ
ÍJKÍÌ
NÒZ
ÍMŒ
™JHOKLL‰‰ŠYVØ™JÌLŒ—JI‰ŠJVÜŠÍŒ—JKJVØ™JÌLŒ—JKVØ™JÌLŒ—OL
_\YVÌ—KVÌÍÎWOLVÌÌLÎO\‹JYLÊÊ
TÊVÍLÍMKL
JKJ
ŠILYLß
_
_
KÍLVÌÍÎLO\‹WÐJVÌÍÎLWKŠKVÌÍÎL—O\‹‰‰ŠVÌÍÎLWO\‹VÌÍÎL×OM
WÐJVÌÍÎKM
JI‰ŠVÌÍÎO\ŠJKVÍÌNNOLX™JÌMŸOYVÍLÍMKVÌÌÌŒOP_\™]\›ˆVÝ
ÍŒ—OPKVÝŒ—O^

KKN™[˜Ý[ÛŠKŠ^ÝL_LŸLVÌÍO\‹ÙJËVÝ
ÌLŒ—JKÙJKVÝ
ÎŒ—JK
YVÝ
ÌMŒ—JOÕœÊ
N–œÊL
K
JKVÌÍOLKŽ™[˜Ý[ÛŠKŠ^Ü™]\›ˆL_LŸLVÌÍOL
YJ‹LÌŠJOÊVÍÌNMWO]VÍÌNM×OLLÌ
VÍÌNMWOYVÌÌLJK
JKVÍÌNMWOLVÍÌNM×OLVÍÌNMWOYVÌÌLKÜŠ
K
N‹L_KÎ™[˜Ý[ÛŠ
^Ü™]\›ˆÍŸK	™[˜Ý[ÛŠKŠ^Ý˜\ˆNÜ™]\›ˆL_LXORLÌŸ
ŸL
OÊVØJÌŒ—OLVØJÌŽŒ—OLVØJÌMŒ—OLVØJÌŒŒ—OLVØJÌLŒ—O\‹VØJÎŒ—OPKÖØJÌŒ_OLOUœÊJÎ
JNOVœÊJKVÝ
ÌMŒ—OLŒLNXJÌÌŸ_KXN™[˜Ý[ÛŠK‹J^Ý˜\ˆŽÜ™]\›ˆL_L[RLÌŸ
ŸL
_
_L
OÊVÛŠÌŒ—OLVÛŠÌŽŒ—OLVÛŠÌMŒ—OLVÛŠÌŒŒ—OLVÛŠÌLŒ—O\‹VÛŠÎŒ—OPKÖÛŠÌŒŸOLÖÛŠÌŒOXKOUœÊŠÎ
JNOVœÊJKVÝ
ÌMŒ—OLŒLN[ŠÌÌŸ_K˜N™[˜Ý[ÛŠK‹KŠ^Ý˜\ˆÜ™]\›ˆL_L[RLÌŸ
_L
_
ŸL
_
ŸL
OÊVÛ
ÌŒ—OLVÛ
ÌŽŒ—OLVÛ
ÌMŒ—OLVÛ
ÌŒŒ—OLVÛ
ÌLŒ—O\‹VÛ
ÎŒ—OPKÖÛ
ÌŒ_O[‹ÖÛ
ÌŒOXKOUœÊ
Î
JNOVœÊJKVÝ
ÌMŒ—OLŒLN[
ÌÌŸ_KØN™[˜Ý[ÛŠK‹K‹
^Ý˜\ˆÎÜ™]\›ˆL_LXÏRLÌŸ
_L
_
ŸL
_
L
_
ŸL
OÊVØÊÌŒ—OLVØÊÌŽŒ—OLVØÊÌMŒ—OLVØÊÌŒŒ—OLVØÊÌLŒ—O\‹VØÊÎŒ—OPKÖØÊÌŒŸO[ÖØÊÌŒ_O[‹ÖØÊÌŒOXKOUœÊÊÎ
JNOVœÊJKVÝ
ÌMŒ—OLŒLNXÊÌÌŸ_KN™[˜Ý[ÛŠJ^Ü™]\›ˆ_LVÙVÊL
OŒ—JÊOŠOŒ—_KXN™[˜Ý[ÛŠKŠ^Ð_LŸLVÙVÊL
OŒ—JÊOŠOŒ—O\ŸK˜N’KØN–ZKNššKXNšÛ‹˜N™[˜Ý[ÛŠJ^Ð_LVÊL
JÌLŒ—OP_KØN•ÛËN™[˜Ý[ÛŠ
^Ü™]\›ˆKXN™[˜Ý[ÛŠ
^Ü™]\›ˆ_K˜N™[˜Ý[ÛŠ
^Ü™]\›ˆŸKØN™[˜Ý[ÛŠ
^Ü™]\›ˆßKN™[˜Ý[ÛŠ
^Ü™]\›ˆKXN™[˜Ý[ÛŠ
^Ü™]\›ˆ_K˜N™[˜Ý[ÛŠ
^Ü™]\›ˆŸKØN™[˜Ý[ÛŠ
^Ü™]\›ˆßKN™[˜Ý[ÛŠ
^Ü™]\›ˆKXNœ]˜N™[˜Ý[ÛŠ
^Ü™]\›ˆŒÌNLŸKØN™KNKXN™[˜Ý[ÛŠ
^Ü™]\›ŠL
OÌHJ
LLŒŽ
JNŒ__JJÊ_JJJ_K[œÝ[X]N™[˜Ý[ÛŠËJ^Ü™]\›žÝ[Ž™[˜Ý[ÛŠÊ^Ý˜\ˆ[™]È›‹“[Ù[JÊNÛÊÚ[œÝ[˜ÙN›™]È›‹’[œÝ[˜ÙJJ_J___K[[YQ\œ›ÜŽ‘\œ›ÜŸNÝ\[Ùˆ›ˆOH›Øš™XÝ‰‰—ÛÊ››È˜]]™HØ\ÛHÝ\Ü]XÝYŠNÝ˜\ˆŒÏHLNÙ[˜Ý[ÛˆŠËJ^ÜßÛÊJ_]˜\ˆXKÛ‹ŒÐKXKLËÌËÏ]\[Ùˆ^XÛÙ\HÛ™]È^XÛÙ\Š]ŽŠN›ÚYÙ[˜Ý[ÛˆŠËKÊ^Ù›ÜŠ˜\ˆZJÛËOZNÜÖÛWI‰ˆJOY
NÊJÊÛNÚYŠKZOŒM‰‰œË˜Y™™\‰‰‘Ê\™]\›ˆË™XÛÙJËœÝX˜\œ˜^JKJJNÙ›ÜŠ˜\ˆÏHˆŽÚONÊ^Ý˜\ˆ\ÖÚJÊ×NÚYŠLŽ	˜Š^Ý˜\ˆÏMŒÉœÖÚJÊ×NÚYŠ
Œ	˜ŠHOLNLŠ^Ý˜\ˆOMŒÉœÖÚJÊ×NÚYŠ
J	˜ŠOOLŒÊMI˜ŠOLŸÏŸNŠÉ˜ŠONÏLŸOŸŒÉœÖÚJÊ×JOMLÍŠPÊÏTÝš[™Ë™œ›ÛPÚ\ÛÙJŠNÙ[Ù^Ý˜\ˆX‹MMLÍŽÐÊÏTÝš[™Ë™œ›ÛPÚ\ÛÙJMLŽMŸŒLMŒÌŒLŒÉž
__Y[ÙHÊÏTÝš[™Ë™œ›ÛPÚ\ÛÙJ
ÌI˜ŠOŸÊ_Y[ÙHÊÏTÝš[™Ë™œ›ÛPÚ\ÛÙJŠ_\™]\›ˆßY[˜Ý[Ûˆ[ŠËJ^Ü™]\›ˆÏÛŠÛ‹ËJNˆˆŸY[˜Ý[ÛˆŒŠËKË
^ÚYŠJŒ
J\™]\›ˆÙ›ÜŠ˜\ˆO[ËÏ[ÊÙLKLØË›[™ÝÊÊØŠ^Ý˜\ˆÏ\Ë˜Ú\ÛÙP]
ŠNÚYŠÏMMLŽM‰‰ÏMMÌÍÉ‰ŠÏMMLÍŠÊ
LŒÉÊOL
_LŒÉœË˜Ú\ÛÙP]

ÊØŠJKÏLLÊ^ÚYŠÏPÊXœ™XZÎÚVÛÊÊ×O]ßY[ÙHYŠÏLŒÊ^ÚYŠÊÌOPÊXœ™XZÎÚVÛÊÊ×OLNLŸÏ‹VÛÊÊ×OLLŽŒÉßY[ÙHYŠÏMMLÍJ^ÚYŠÊÌPÊXœ™XZÎÚVÛÊÊ×OLŒÏŒL‹VÛÊÊ×OLLŽÏ‰ŒËVÛÊÊ×OLLŽŒÉßY[Ù^ÚYŠÊÌÏPÊXœ™XZÎÚVÛÊÊ×OLÏŒNVÛÊÊ×OLLŽÏŒL‰ŒËVÛÊÊ×OLLŽÏ‰ŒËVÛÊÊ×OLLŽŒÉß_\™]\›ˆVÛ×OLË[_Y[˜Ý[ÛˆÌÊÊ^Ù›ÜŠ˜\ˆOLÏLÛÏË›[™ÝÊÊÛÊ^Ý˜\ˆ\Ë˜Ú\ÛÙP]
ÊNÙLLÏÚJÊÎ™LŒÏÚJÏLŽ™MMLŽM‰‰™MMÌÍÏÊJÏM
ÊÛÊNšJÏLß\™]\›ˆ_]˜\ˆ›ËL[™K’S’UPSÓQSSÔ–_MÍÍÌŒMŽÖ[™KØ\ÛSY[[ÜžOÛ™KØ\ÛSY[[ÜžN›™]È›‹“Y[[ÜžJÚ[š]X[•L‹ÍMLÍ‹X^[][N•L‹ÍMLÍŸJK›ÏV˜Y™™\‹™K’PTTXO[™]È[\œ˜^J›ÊK™K’PTMRŒ[™]È[M\œ˜^J›ÊK™K’PTÌUÐO[™]È[Ì\œ˜^J›ÊK™K’PTNXÛ[™]ÈZ[\œ˜^J›ÊK™K’PTLM[™]ÈZ[M\œ˜^J›ÊK™K’PTLÌYXO[™]ÈZ[Ì\œ˜^J›ÊK™K’PTŒÌTLÏ[™]È›Ø]Ì\œ˜^J›ÊK™K’PTTÌÏ[™]È›Ø]\œ˜^J›ÊKLV˜Y™™\‹˜ž]S[™ÝÝ˜\ˆÏV×KÏV×KÏV×KŒÏHLNÙ[˜Ý[ÛˆŒÊÊ^ÓË[œÚY
Ê_]˜\ˆKœ‹ÚOL›[[Ù[˜Ý[ÛˆŒÊÊ^ÔÚJÊË™K›[Ûš]Ü”[‘\[™[˜ÚY\É‰›™K›[Ûš]Ü”[‘\[™[˜ÚY\ÊÚJ_Y[˜Ý[ÛˆŒÊÊ^ÚYŠÚKKK™K›[Ûš]Ü”[‘\[™[˜ÚY\É‰›™K›[Ûš]Ü”[‘\[™[˜ÚY\ÊÚJKÚOOL	‰’›Š^Ý˜\ˆOR›ŽÒ›[[J
__Y[˜Ý[ÛˆÛÊÊ^Ý›ÝÈ™K›ÛX›Ü	‰›™K›ÛX›Ü
ÊKÛŠÏHX›ÜY
ŠÜÊÈŠHŠKŒÏHLÊÏH‹ˆZ[Ú]\ÐTÔÑT•SÓ”È›Üˆ[Ü™H[™›Ëˆ‹™]È›‹”[[YQ\œ›ÜŠÊ_Y[˜Ý[ÛˆÊÊ^Ý\Ë›˜[YOH‘^]Ý]\È‹\Ë›Y\ÜØYÙOH”›ÙÜ˜[H\›Z[˜]YÚ]^]
ŠÜÊÈŠH‹\ËœÝ]\Ï\ßY[˜Ý[ÛˆÌŠÊ^Ù›ÜŠÜË›[™ÝŒÊ\ËœÚY

J™J_Y[˜Ý[Ûˆ]ÊËOHšNŠ^ÜÝÚ]Ú
K™[™ÕÚ]
ŠˆŠI‰ŠOHŠˆŠKJ^ØØ\ÙHšLHŽ˜Ø\ÙHšNŽœ™]\›ˆXVÜßNØØ\ÙHšLMˆŽœ™]\›ˆŒÜÏŒWNØØ\ÙHšLÌˆŽ˜Ø\ÙHšMŽœ™]\›ˆÐVÜÏŒ—NØØ\ÙH™›Ø]Žœ™]\›ˆLÖÜÏŒ—NØØ\ÙH™ÝX›HŽœ™]\›ˆÌÖÜÏŒ×NØØ\ÙHŠˆŽœ™]\›ˆXVÜÏŒ—NÙY˜][—ÛÊš[˜[Y\H›ÜˆÙ]˜[YNˆŠÚJ_\™]\›ˆ[Y[˜Ý[ÛˆÊÊ^Ý\Ë™^Ô\Ë\Ëœ\ËL\ËœÙ]Ý\OY[˜Ý[ÛŠJ^ÙXVÝ\ËœŠÍŒ—OZ_K\Ë™Ù]Ý\OY[˜Ý[ÛŠ
^Ü™]\›ˆXVÝ\ËœŠÍŒ—_K\ËœÙ]Ù\ÝXÝÜY[˜Ý[ÛŠJ^ÙXVÝ\ËœŠÎŒ—OZ_K\Ë™Ù]Ù\ÝXÝÜY[˜Ý[ÛŠ
^Ü™]\›ˆXVÝ\ËœŠÎŒ—_K\ËœÙ]Ü™Y˜ÛÝ[Y[˜Ý[ÛŠJ^ÕÐVÝ\ËœŒ—OZ_K\ËœÙ]ØØ]YÚY[˜Ý[ÛŠJ^ÚOZOÌNŒXVÝ\ËœŠÌLŸOZ_K\Ë™Ù]ØØ]YÚY[˜Ý[ÛŠ
^Ü™]\›ˆXVÝ\ËœŠÌLŸHOLK\ËœÙ]Ü™]›ÝÛY[˜Ý[ÛŠJ^ÚOZOÌNŒXVÝ\ËœŠÌLßOZ_K\Ë™Ù]Ü™]›ÝÛY[˜Ý[ÛŠ
^Ü™]\›ˆXVÝ\ËœŠÌLßHOLK\Ëš[š]Y[˜Ý[ÛŠKÊ^Ý\ËœÙ]ØY\ÝYÜŠ
K\ËœÙ]Ý\JJK\ËœÙ]Ù\ÝXÝÜŠÊK\ËœÙ]Ü™Y˜ÛÝ[

K\ËœÙ]ØØ]YÚ
LJK\ËœÙ]Ü™]›ÝÛŠLJ_K\Ë˜YÜ™YY[˜Ý[ÛŠ
^Ý˜\ˆOUÐVÝ\ËœŒ—NÕÐVÝ\ËœŒ—OZJÌ_K\Ëœ™[X\ÙWÜ™YY[˜Ý[ÛŠ
^Ý˜\ˆOUÐVÝ\ËœŒ—NÜ™]\›ˆÐVÝ\ËœŒ—OZKLKOOOL_K\ËœÙ]ØY\ÝYÜY[˜Ý[ÛŠJ^ÙXVÝ\ËœŠÌMŒ—OZ_K\Ë™Ù]ØY\ÝYÜY[˜Ý[ÛŠ
^Ü™]\›ˆXVÝ\ËœŠÌMŒ—_K\Ë™Ù]Ù^Ù\[Û—ÜY[˜Ý[ÛŠ
^ÚYŠŽ
\Ë™Ù]Ý\J
JJ\™]\›ˆXVÝ\Ë™^ÔŒ—NÝ˜\ˆO]\Ë™Ù]ØY\ÝYÜŠ
NÜ™]\›ˆHOOLÚN\Ë™^ÔŸ_]˜\ˆœ^Ú\ÐXœÎœÏOœË˜Ú\]

OOOH‹È‹Ü]]œÏO‹×ŠÏß
J×××JÊJ
Î—žÌKŸ_×—×JÏß
J–×‹—×JŸ
JJÎ–××JŠIË™^XÊÊKœÛXÙJJK›Ü›X[^™P\œ˜^NŠËJOOžÙ›ÜŠ˜\ˆÏL\Ë›[™ÝLNÙLÙKJ^Ý˜\ˆO\ÖÙNÛOOOH‹ˆÜËœÜXÙJJN›OOOH‹‹ˆÊËœÜXÙJJKÊÊÊN›É‰ŠËœÜXÙJJKËKJ_ZYŠJY›ÜŠÛÎÛËKJ\Ë[œÚY
‹‹ˆŠNÜ™]\›ˆßK›Ü›X[^™NœÏOžÝ˜\ˆO[œ‹š\ÐXœÊÊKÏ\ËœÝXœÝŠLJOOOH‹ÈŽÜ™]\›ŠÏ[œ‹››Ü›X[^™P\œ˜^JËœÜ]
‹ÈŠK™š[\Š
OˆHY
JKZJKš›Ú[Š‹ÈŠJ__
ÏH‹ˆŠKÉ‰›É‰ŠÊÏH‹ÈŠK
OÈ‹ÈŽˆˆŠJÜßK\›˜[YNœÏOžÝ˜\ˆO[œ‹œÜ]]
ÊKÏZVÌKZVÌWNÜ™]\›ˆßÊ	‰ŠYœÝXœÝŠ›[™ÝLJJKÊÙ
Nˆ‹ˆŸK˜\Ù[˜[YNœÏOžÚYŠÏOOH‹ÈŠ\™]\›ˆ‹ÈŽÝ˜\ˆOJÏJÏ[œ‹››Ü›X[^™JÊJKœ™\XÙJ×ÉËˆŠJK›\Ý[™^ÙŠ‹ÈŠNÜ™]\›ˆOOOKLOÜÎœËœÝXœÝŠJÌJ_K›Ú[Ž™[˜Ý[ÛŠ
^Ý˜\ˆÏP\œ˜^Kœ›ÝÝ\KœÛXÙK˜Ø[
\™Ý[Y[ÊNÜ™]\›ˆœ‹››Ü›X[^™JËš›Ú[Š‹ÈŠJ_K›Ú[ŒŽŠËJOO›œ‹››Ü›X[^™JÊÈ‹ÈŠÚJ_K	Ï^Ü™\ÛÛ™N™[˜Ý[ÛŠ
^Ù›ÜŠ˜\ˆÏHˆ‹OHLKÏX\™Ý[Y[Ë›[™ÝLNÛÏKLI‰ˆZNÛËKJ^Ý˜\ˆ[ÏLØ\™Ý[Y[ÖÛ×NK˜ÝÙ

NÚYŠ\[ÙˆOHœÝš[™ÈŠ]›ÝÈ™]È\Q\œ›ÜŠ\™Ý[Y[ÈÈ]œ™\ÛÛ™H]\Ý™HÝš[™ÜÈŠNÚYŠY
\™]\›ˆˆŽÜÏY
È‹ÈŠÜËO[œ‹š\ÐXœÊ
_\™]\›ŠOÈ‹ÈŽˆˆŠJÊÏ[œ‹››Ü›X[^™P\œ˜^JËœÜ]
‹ÈŠK™š[\Š
OOˆH[JJKZJKš›Ú[Š‹ÈŠJ_‹ˆŸK™[]]™NŠËJOOžÙ[˜Ý[ÛˆÊ
^Ù›ÜŠ˜\ˆLÑ›[™Ý	‰žÑOOOHˆŽÑ
ÊÊNÙ›ÜŠ˜\ˆÏ^›[™ÝLN×ÏL	‰ž××OOOHˆŽ×ËKJNÜ™]\›ˆ—ÏÖ×NžœÛXÙJËQ
ÌJ_\ÏIËœ™\ÛÛ™JÊKœÝXœÝŠJKOIËœ™\ÛÛ™JJKœÝXœÝŠJNÙ›ÜŠ˜\ˆ[ÊËœÜ]
‹ÈŠJKO[ÊKœÜ]
‹ÈŠJKÏSX]›Z[Š›[™ÝK›[™Ý
KPËÏLÝÏÎÝÊÊÊZYŠÝ×HOO[VÝ×J^Ø]ÎØœ™XZß]˜\ˆOV×NÙ›ÜŠÏXŽÝÏ›[™ÝÝÊÊÊSKœ\Ú
‹‹ˆŠNÜ™]\›ŠOSK˜ÛÛ˜Ø]
KœÛXÙJŠJJKš›Ú[Š‹ÈŠ__NÙ[˜Ý[ÛˆÌÊËKÊ^Ý˜\ˆSÌÊÊJÌKO[™]È\œ˜^J
KÏRŒŠËKK›[™Ý
NÜ™]\›ˆI‰ŠK›[™ÝPÊK_]˜\ˆZO^Ý\Î–×K[š]™[˜Ý[ÛŠ
^ßKÚ]ÝÛŽ™[˜Ý[ÛŠ
^ßK™YÚ\Ý\Ž™[˜Ý[ÛŠËJ^ÔZK\ÖÜ×O^Ú[œ]–×KÝ]]–×KÜÎš_KKœ™YÚ\Ý\‘]šXÙJËZKœÝ™X[WÛÜÊ_KÝ™X[WÛÜÎžÛÜ[Ž™[˜Ý[ÛŠÊ^Ý˜\ˆOTZK\ÖÜË››ÙKœ™]—NÚYŠZJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÜËOZKËœÙYZØX›OHL_KÛÜÙN™[˜Ý[ÛŠÊ^ÜËK›ÜË™œÞ[˜ÊËJ_KœÞ[˜Î™[˜Ý[ÛŠÊ^ÜËK›ÜË™œÞ[˜ÊËJ_K™XY™[˜Ý[ÛŠËKËJ^ÚYŠ\Ë_\ËK›ÜË™Ù]ØÚ\Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒ
NÙ›ÜŠ˜\ˆÏLLØØŠÊÊ^Ý˜\ˆÎÝž^ÝÏ\ËK›ÜË™Ù]ØÚ\ŠËJ_XØ]ÚÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽJ_ZYŠÏOO]›ÚY	‰ÏOOL
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠÏO[[
Xœ™XZÎÐÊÊËVÛÊØ—O]ß\™]\›ˆÉ‰ŠË››ÙK[Y\Ý[\Q]K››ÝÊ
JKßKÜš]N™[˜Ý[ÛŠËKËJ^ÚYŠ\Ë_\ËK›ÜËœ]ØÚ\Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒ
NÝž^Ù›ÜŠ˜\ˆÏLÐÏÐÊÊÊ\ËK›ÜËœ]ØÚ\ŠËKVÛÊÐ×J_XØ]ÚÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽJ_\™]\›ˆ	‰ŠË››ÙK[Y\Ý[\Q]K››ÝÊ
JKß_KY˜][ÝWÛÜÎžÜ]ØÚ\Ž™[˜Ý[ÛŠËJ^ÚOOO[[OOOLLÊŒ
ŠË›Ý]]
JKË›Ý]]V×JNšHOL	‰œË›Ý]]œ\Ú
J_KœÞ[˜Î™[˜Ý[ÛŠÊ^ÜË›Ý]]	‰œË›Ý]]›[™ÝŒ	‰ŠŒ
ŠË›Ý]]
JKË›Ý]]V×J__KY˜][ÝLWÛÜÎžÜ]ØÚ\Ž™[˜Ý[ÛŠËJ^ÚOOO[[OOOLLÊÛŠŠË›Ý]]
JKË›Ý]]V×JNšHOL	‰œË›Ý]]œ\Ú
J_KœÞ[˜Î™[˜Ý[ÛŠÊ^ÜË›Ý]]	‰œË›Ý]]›[™ÝŒ	‰ŠÛŠŠË›Ý]]
JKË›Ý]]V×J___NÙ[˜Ý[ÛˆŒÊÊ^×ÛÊ
_]˜\ˆO^ÛÜ×ÝX›N›[[Ý[™[˜Ý[ÛŠÊ^Ü™]\›ˆK˜Ü™X]S›ÙJ[‹È‹MŽMK
_KÜ™X]S›ÙN™[˜Ý[ÛŠËKË
^ÚYŠKš\Ð›Ù]ŠÊ_Kš\Ñ’Q“ÊÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÑK›Ü×ÝX›_
K›Ü×ÝX›O^Ù\ŽžÛ›ÙNžÙÙ]]Ž‘K››ÙWÛÜË™Ù]]‹Ù]]Ž‘K››ÙWÛÜËœÙ]]‹ÛÚÝ\‘K››ÙWÛÜË›ÛÚÝ\ZÛ›Ù‘K››ÙWÛÜË›ZÛ›Ù™[˜[YN‘K››ÙWÛÜËœ™[˜[YK[›[šÎ‘K››ÙWÛÜË[›[šË›Y\Ž‘K››ÙWÛÜËœ›Y\‹™XY\Ž‘K››ÙWÛÜËœ™XY\‹Þ[[[šÎ‘K››ÙWÛÜËœÞ[[[šßKÝ™X[NžÛÙYZÎ‘KœÝ™X[WÛÜË›ÙYZß_Kš[NžÛ›ÙNžÙÙ]]Ž‘K››ÙWÛÜË™Ù]]‹Ù]]Ž‘K››ÙWÛÜËœÙ]]ŸKÝ™X[NžÛÙYZÎ‘KœÝ™X[WÛÜË›ÙYZË™XY‘KœÝ™X[WÛÜËœ™XYÜš]N‘KœÝ™X[WÛÜËÜš]K[ØØ]N‘KœÝ™X[WÛÜË˜[ØØ]K[X\‘KœÝ™X[WÛÜË›[X\\Þ[˜Î‘KœÝ™X[WÛÜË›\Þ[˜ß_K[šÎžÛ›ÙNžÙÙ]]Ž‘K››ÙWÛÜË™Ù]]‹Ù]]Ž‘K››ÙWÛÜËœÙ]]‹™XY[šÎ‘K››ÙWÛÜËœ™XY[šßKÝ™X[Nžß_KÚ™]ŽžÛ›ÙNžÙÙ]]Ž‘K››ÙWÛÜË™Ù]]‹Ù]]Ž‘K››ÙWÛÜËœÙ]]ŸKÝ™X[NK˜Ú™]—ÜÝ™X[WÛÜß_JNÝ˜\ˆO]K˜Ü™X]S›ÙJËKË
NÜ™]\›ˆKš\Ñ\ŠK›[ÙJOÊK››ÙWÛÜÏQK›Ü×ÝX›K™\‹››ÙKKœÝ™X[WÛÜÏQK›Ü×ÝX›K™\‹œÝ™X[KK˜ÛÛ[Ï^ßJNKš\Ñš[JK›[ÙJOÊK››ÙWÛÜÏQK›Ü×ÝX›K™š[K››ÙKKœÝ™X[WÛÜÏQK›Ü×ÝX›K™š[KœÝ™X[KK\ÙYž]\ÏLK˜ÛÛ[Ï[[
NKš\Ó[šÊK›[ÙJOÊK››ÙWÛÜÏQK›Ü×ÝX›K›[šË››ÙKKœÝ™X[WÛÜÏQK›Ü×ÝX›K›[šËœÝ™X[JNKš\ÐÚ™]ŠK›[ÙJI‰ŠK››ÙWÛÜÏQK›Ü×ÝX›K˜Ú™]‹››ÙKKœÝ™X[WÛÜÏQK›Ü×ÝX›K˜Ú™]‹œÝ™X[JKK[Y\Ý[\Q]K››ÝÊ
KÉ‰ŠË˜ÛÛ[ÖÚWO[KË[Y\Ý[\[K[Y\Ý[\
K_KÙ]š[Q]P\Õ\Y\œ˜^N™[˜Ý[ÛŠÊ^Ü™]\›ˆË˜ÛÛ[ÏÜË˜ÛÛ[ËœÝX˜\œ˜^OÜË˜ÛÛ[ËœÝX˜\œ˜^JË\ÙYž]\ÊN›™]ÈZ[\œ˜^JË˜ÛÛ[ÊN›™]ÈZ[\œ˜^J
_K^[™š[TÝÜ˜YÙN™[˜Ý[ÛŠËJ^Ý˜\ˆÏ\Ë˜ÛÛ[ÏÜË˜ÛÛ[Ë›[™ÝŒÚYŠJÏZJJ^ÚOSX]›X^
KÊŠÏLMÍÌŽŒKŒLJOŒ
KÈOL	‰ŠOSX]›X^
KMŠJNÝ˜\ˆ\Ë˜ÛÛ[ÎÜË˜ÛÛ[Ï[™]ÈZ[\œ˜^JJKË\ÙYž]\ÏŒ	‰œË˜ÛÛ[ËœÙ]
œÝX˜\œ˜^JË\ÙYž]\ÊK
__K™\Ú^™Qš[TÝÜ˜YÙN™[˜Ý[ÛŠËJ^ÚYŠË\ÙYž]\ÈOZJZYŠOOL
\Ë˜ÛÛ[Ï[[Ë\ÙYž]\ÏLÙ[Ù^Ý˜\ˆÏ\Ë˜ÛÛ[ÎÜË˜ÛÛ[Ï[™]ÈZ[\œ˜^JJKÉ‰œË˜ÛÛ[ËœÙ]
ËœÝX˜\œ˜^JX]›Z[ŠKË\ÙYž]\ÊJJKË\ÙYž]\ÏZ__K›ÙWÛÜÎžÙÙ]]Ž™[˜Ý[ÛŠÊ^Ý˜\ˆO^ßNÜ™]\›ˆK™]]Kš\ÐÚ™]ŠË›[ÙJOÜËšYŒKKš[›Ï\ËšYK›[ÙO\Ë›[ÙKK››[šÏLKKZYLK™ÚYLKœ™]\Ëœ™]‹Kš\Ñ\ŠË›[ÙJOÚKœÚ^™OMMŽKš\Ñš[JË›[ÙJOÚKœÚ^™O\Ë\ÙYž]\ÎKš\Ó[šÊË›[ÙJOÚKœÚ^™O\Ë›[šË›[™ÝšKœÚ^™OLK˜][YO[™]È]JË[Y\Ý[\
KK›][YO[™]È]JË[Y\Ý[\
KK˜Ý[YO[™]È]JË[Y\Ý[\
KK˜›ÜÚ^™OMM‹K˜›ØÚÜÏSX]˜ÙZ[
KœÚ^™KÚK˜›ÜÚ^™JK_KÙ]]Ž™[˜Ý[ÛŠËJ^ÚK›[ÙHOO]›ÚY	‰ŠË›[ÙOZK›[ÙJKK[Y\Ý[\OO]›ÚY	‰ŠË[Y\Ý[\ZK[Y\Ý[\
KKœÚ^™HOO]›ÚY	‰‘Kœ™\Ú^™Qš[TÝÜ˜YÙJËKœÚ^™J_KÛÚÝ\™[˜Ý[ÛŠËJ^Ý›ÝÈK™Ù[™\šXÑ\œ›ÜœÖÍ_KZÛ›Ù™[˜Ý[ÛŠËKË
^Ü™]\›ˆK˜Ü™X]S›ÙJËKË
_K™[˜[YN™[˜Ý[ÛŠËKÊ^ÚYŠKš\Ñ\ŠË›[ÙJJ^Ý˜\ˆÝž^Ù]K›ÛÚÝ\›ÙJKÊ_XØ]ÚßZYŠ
Y›ÜŠ˜\ˆH[ˆ˜ÛÛ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠMJ_Y[]HËœ\™[˜ÛÛ[ÖÜË›˜[YWKËœ\™[[Y\Ý[\Q]K››ÝÊ
KË›˜[YO[ËK˜ÛÛ[ÖÛ×O\ËK[Y\Ý[\\Ëœ\™[[Y\Ý[\Ëœ\™[Z_K[›[šÎ™[˜Ý[ÛŠËJ^Ù[]HË˜ÛÛ[ÖÚWKË[Y\Ý[\Q]K››ÝÊ
_K›Y\Ž™[˜Ý[ÛŠËJ^Ý˜\ˆÏ]K›ÛÚÝ\›ÙJËJNÙ›ÜŠ˜\ˆ[ˆË˜ÛÛ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠMJNÙ[]HË˜ÛÛ[ÖÚWKË[Y\Ý[\Q]K››ÝÊ
_K™XY\Ž™[˜Ý[ÛŠÊ^Ý˜\ˆOVÈ‹ˆ‹‹‹ˆ—NÙ›ÜŠ˜\ˆÈ[ˆË˜ÛÛ[Ê\Ë˜ÛÛ[Ëš\ÓÝÛ”›Ü\JÊI‰šKœ\Ú
ÊNÜ™]\›ˆ_KÞ[[[šÎ™[˜Ý[ÛŠËKÊ^Ý˜\ˆQK˜Ü™X]S›ÙJËKMÌK
NÜ™]\›ˆ›[šÏ[ËK™XY[šÎ™[˜Ý[ÛŠÊ^ÚYŠ]Kš\Ó[šÊË›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÜ™]\›ˆË›[šß_KÝ™X[WÛÜÎžÜ™XY™[˜Ý[ÛŠËKËJ^Ý˜\ˆÏ\Ë››ÙK˜ÛÛ[ÎÚYŠO\Ë››ÙK\ÙYž]\Ê\™]\›ˆÝ˜\ˆSX]›Z[ŠË››ÙK\ÙYž]\Ë[K
NÚYŠŽ	‰ËœÝX˜\œ˜^JZKœÙ]
ËœÝX˜\œ˜^JKJØŠKÊNÙ[ÙH›ÜŠ˜\ˆÏLÝÏŽÝÊÊÊZVÛÊÝ×OPÖÛJÝ×NÜ™]\›ˆŸKÜš]N™[˜Ý[ÛŠËKËKÊ^ÚYŠY
\™]\›ˆÝ˜\ˆ\Ë››ÙNÚYŠ‹[Y\Ý[\Q]K››ÝÊ
KKœÝX˜\œ˜^I‰ŠX‹˜ÛÛ[ß‹˜ÛÛ[ËœÝX˜\œ˜^JJ^ÚYŠÊ\™]\›ˆ‹˜ÛÛ[ÏZKœÝX˜\œ˜^JËÊÙ
K‹\ÙYž]\ÏYÚYŠ‹\ÙYž]\ÏOOL	‰›OOOL
\™]\›ˆ‹˜ÛÛ[ÏZKœÛXÙJËÊÙ
K‹\ÙYž]\ÏYÚYŠJÙX‹\ÙYž]\Ê\™]\›ˆ‹˜ÛÛ[ËœÙ]
KœÝX˜\œ˜^JËÊÙ
KJKZYŠK™^[™š[TÝÜ˜YÙJ‹JÙ
K‹˜ÛÛ[ËœÝX˜\œ˜^I‰šKœÝX˜\œ˜^JX‹˜ÛÛ[ËœÙ]
KœÝX˜\œ˜^JËÊÙ
KJNÙ[ÙH›ÜŠ˜\ˆÏLÝÏÝÊÊÊX‹˜ÛÛ[ÖÛJÝ×OZVÛÊÝ×NÜ™]\›ˆ‹\ÙYž]\ÏSX]›X^
‹\ÙYž]\ËJÙ
KKÙYZÎ™[˜Ý[ÛŠËKÊ^Ý˜\ˆZNÚYŠÏOOLOÙ
Ï\ËœÜÚ][ÛŽ›ÏOOL‰‰Kš\Ñš[JË››ÙK›[ÙJI‰Š
Ï\Ë››ÙK\ÙYž]\ÊK
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÜ™]\›ˆK[ØØ]N™[˜Ý[ÛŠËKÊ^ÑK™^[™š[TÝÜ˜YÙJË››ÙKJÛÊKË››ÙK\ÙYž]\ÏSX]›X^
Ë››ÙK\ÙYž]\ËJÛÊ_K[X\™[˜Ý[ÛŠËKËJ^ÚYŠ]Kš\Ñš[JË››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÝ˜\ˆË‹Ï\Ë››ÙK˜ÛÛ[ÎÚYŠ‰›_Ë˜Y™™\ˆOOTXK˜Y™™\Š^ÚYŠ
ÏŒÊÚOË›[™Ý
I‰ŠÏ]ËœÝX˜\œ˜^OÝËœÝX˜\œ˜^JËÊÚJN\œ˜^Kœ›ÝÝ\KœÛXÙK˜Ø[
ËËÊÚJJKHLJÏUŒÊ
JJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÔXKœÙ]
ËÊ_Y[ÙHHLKÏ]Ë˜ž]SÙ™œÙ]Ü™]\›žÜŽË[ØØ]Y˜Ÿ_K\Þ[˜Î™[˜Ý[ÛŠËKËJ^Ü™]\›ˆKœÝ™X[WÛÜËÜš]JËKËLJK__KO^Ü›ÛÝ›[[Ý[Î–×K]šXÙ\ÎžßKÝ™X[\Î–×K™^[›ÙNŒK˜[YUX›N›[Ý\œ™[]ˆ‹È‹[š]X[^™YˆLKYÛ›Ü™T\›Z\ÜÚ[ÛœÎˆL\œ››Ñ\œ›ÜŽ›[Ù[™\šXÑ\œ›ÜœÎžßKš[\Þ\Ý[\Î›[Þ[˜Ñ”Ô™\]Y\ÝÎŒÛÚÝ\]ŠËO^ßJOOžÚYŠJÏIËœ™\ÛÛ™JÊJJ\™]\›žÜ]ˆˆ‹›ÙN›[NÚYŠ
OSØš™XÝ˜\ÜÚYÛŠÙ›ÛÝ×Û[Ý[ˆL™XÝ\œÙWØÛÝ[ŒKJJKœ™XÝ\œÙWØÛÝ[Ž
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌŠNÙ›ÜŠ˜\ˆÏ\ËœÜ]
‹ÈŠK™š[\Š
OˆH^
JK]Kœ›ÛÝOH‹È‹ÏLÐÏË›[™ÝÐÊÊÊ^Ý˜\ˆPÏOO[Ë›[™ÝLNÚYŠ‰‰šKœ\™[
Xœ™XZÎÚYŠ]K›ÛÚÝ\›ÙJÖÐ×JKO[œ‹š›Ú[ŒŠKÖÐ×JKKš\Ó[Ý[Ú[

I‰ŠXŸ‰‰šK™›ÛÝ×Û[Ý[
I‰ŠY›[Ý[Yœ›ÛÝ
KXŸK™›ÛÝÊY›ÜŠ˜\ˆÏLÝKš\Ó[šÊ›[ÙJNÊ^Ý˜\ˆO]Kœ™XY[šÊJNÚYŠOIËœ™\ÛÛ™Jœ‹™\›˜[YJJKJK]K›ÛÚÝ\]
KÜ™XÝ\œÙWØÛÝ[šKœ™XÝ\œÙWØÛÝ[
Ì_JK››ÙKÊÊÏ
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌŠ__\™]\›žÜ]›K›ÙN™_KÙ]]œÏOžÙ›ÜŠ˜\ˆNÎÊ^ÚYŠKš\Ô›ÛÝ
ÊJ^Ý˜\ˆÏ\Ë›[Ý[›[Ý[Ú[Ü™]\›ˆOÛÖÛË›[™ÝLWHOOH‹ÈÛÊÈ‹ÈŠÚN›ÊÚN›ßZOZOÜË›˜[YJÈ‹ÈŠÚNœË›˜[YKÏ\Ëœ\™[_K\Ú˜[YNŠËJOOžÙ›ÜŠ˜\ˆÏLLÙK›[™ÝÙ
ÊÊ[ÏJÏJK[ÊÚK˜Ú\ÛÙP]

_Ü™]\›ŠÊÛÏŒ
I]K›˜[YUX›K›[™ÝK\ÚY›ÙNœÏOžÝ˜\ˆO]Kš\Ú˜[YJËœ\™[šYË›˜[YJNÜË›˜[YWÛ™^]K›˜[YUX›VÚWKK›˜[YUX›VÚWO\ßK\Ú™[[Ý™S›ÙNœÏOžÝ˜\ˆO]Kš\Ú˜[YJËœ\™[šYË›˜[YJNÚYŠK›˜[YUX›VÚWOOO\Ê]K›˜[YUX›VÚWO\Ë›˜[YWÛ™^Ù[ÙH›ÜŠ˜\ˆÏ]K›˜[YUX›VÚWNÛÎÊ^ÚYŠË›˜[YWÛ™^OO\Ê^ÛË›˜[YWÛ™^\Ë›˜[YWÛ™^Øœ™XZß[Ï[Ë›˜[YWÛ™^_KÛÚÝ\›ÙNŠËJOOžÝ˜\ˆÏ]K›X^SÛÚÝ\
ÊNÚYŠÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠËÊNÙ›ÜŠ˜\ˆ]Kš\Ú˜[YJËšYJKO]K›˜[YUX›VÙNÛNÛO[K›˜[YWÛ™^
^Ý˜\ˆÏ[K›˜[YNÚYŠKœ\™[šYOO\ËšY	‰ÏOOZJ\™]\›ˆ_\™]\›ˆK›ÛÚÝ\
ËJ_KÜ™X]S›ÙNŠËKË
OOžÝ˜\ˆO[™]ÈK‘”Ó›ÙJËKË
NÜ™]\›ˆKš\ÚY›ÙJJK_K\Ý›ÞS›ÙNœÏOžÝKš\Ú™[[Ý™S›ÙJÊ_K\Ô›ÛÝœÏOœÏOO\Ëœ\™[\Ó[Ý[Ú[œÏOˆH\Ë›[Ý[Y\Ñš[NœÏOŠŒM	œÊOOLÌÍŽ\Ñ\ŽœÏOŠŒM	œÊOOLMŒÎ\Ó[šÎœÏOŠŒM	œÊOOMMŒ\ÐÚ™]ŽœÏOŠŒM	œÊOONNL‹\Ð›Ù]ŽœÏOŠŒM	œÊOOLMÍ‹\Ñ’Q“ÎœÏOŠŒM	œÊOOMM‹\ÔÛØÚÙ]œÏOˆJLML‰ŸœÊK›YÓ[Ù\ÎžÜŽŒœŠÈŽŒ‹ÎMÍËÊÈŽMÎNŒLK˜JÈŽŒLLK[ÙTÝš[™ÕÑ›YÜÎœÏOžÝ˜\ˆO]K™›YÓ[Ù\ÖÜ×NÚYŠOOO]›ÚY
]›ÝÈ™]È\œ›ÜŠ•[šÛ›ÝÛˆš[HÜ[ˆ[ÙNˆŠÜÊNÜ™]\›ˆ_K›YÜÕÔ\›Z\ÜÚ[Û”Ýš[™ÎœÏOžÝ˜\ˆOVÈœˆ‹È‹œÈ—VÌÉœ×NÜ™]\›ˆLL‰œÉ‰ŠJÏHÈŠK_K›ÙT\›Z\ÜÚ[ÛœÎŠËJOOKšYÛ›Ü™T\›Z\ÜÚ[Ûœß
ZKš[˜ÛY\ÊœˆŠ_ŽL‰œË›[ÙJI‰ŠZKš[˜ÛY\ÊÈŠ_M‰œË›[ÙJI‰ŠZKš[˜ÛY\ÊžŠ_ÌÉœË›[ÙJOÌŒ‹X^SÛÚÝ\œÏOžÝ˜\ˆO]K››ÙT\›Z\ÜÚ[ÛœÊËžŠNÜ™]\›ˆ_
Ë››ÙWÛÜË›ÛÚÝ\ÌŒŠ_KX^PÜ™X]NŠËJOOžÝž^Ü™]\›ˆK›ÛÚÝ\›ÙJËJKŒXØ]Úß\™]\›ˆK››ÙT\›Z\ÜÚ[ÛœÊËÞŠ_KX^Q[]NŠËKÊOOžÝ˜\ˆÝž^Ù]K›ÛÚÝ\›ÙJËJ_XØ]Ú
Ê^Ü™]\›ˆË™\œ››ß]˜\ˆO]K››ÙT\›Z\ÜÚ[ÛœÊËÞŠNÚYŠJ\™]\›ˆNÚYŠÊ^ÚYŠ]Kš\Ñ\Š›[ÙJJ\™]\›ˆMÚYŠKš\Ô›ÛÝ

_K™Ù]]

OOO]K˜ÝÙ

J\™]\›ˆLY[ÙHYŠKš\Ñ\Š›[ÙJJ\™]\›ˆÌNÜ™]\›ˆKX^SÜ[ŽŠËJOOœÏÝKš\Ó[šÊË›[ÙJOÌÌŽKš\Ñ\ŠË›[ÙJI‰ŠK™›YÜÕÔ\›Z\ÜÚ[Û”Ýš[™ÊJHOOHœˆŸLL‰šJOÌÌNK››ÙT\›Z\ÜÚ[ÛœÊËK™›YÜÕÔ\›Z\ÜÚ[Û”Ýš[™ÊJJNPVÓÔS—Ñ‘ÎM‹™^™ŠÏLO]K“PVÓÔS—Ñ‘ÊOOžÙ›ÜŠ˜\ˆÏ\ÎÛÏZNÛÊÊÊZYŠ]KœÝ™X[\ÖÛ×J\™]\›ˆÎÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌÊ_KÙ]Ý™X[NœÏOKœÝ™X[\ÖÜ×KÜ™X]TÝ™X[NŠËKÊOOžÝK‘”ÔÝ™X[_
K‘”ÔÝ™X[OY[˜Ý[ÛŠ
^Ý\ËœÚ\™Y^ß_KK‘”ÔÝ™X[Kœ›ÝÝ\O^ßKØš™XÝ™Yš[™T›Ü\Y\ÊK‘”ÔÝ™X[Kœ›ÝÝ\KÛØš™XÝžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\Ë››Ù_KÙ]™[˜Ý[ÛŠJ^Ý\Ë››ÙO[__K\Ô™XYžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ŠŒMÌMMI\Ë™›YÜÊHOL__K\ÕÜš]NžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆHJŒMÌMMI\Ë™›YÜÊ__K\Ð\[™žÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆL	\Ë™›YÜß_K›YÜÎžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\ËœÚ\™Y™›YÜßKÙ]™[˜Ý[ÛŠJ^Ý\ËœÚ\™Y™›YÜÏ[__KÜÚ][ÛŽžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\ËœÚ\™YœÜÚ][ÛŸKÙ]™[˜Ý[ÛŠJ^Ý\ËœÚ\™YœÜÚ][Û[___JJKÏSØš™XÝ˜\ÜÚYÛŠ™]ÈK‘”ÔÝ™X[KÊNÝ˜\ˆ]K›™^™
KÊNÜ™]\›ˆË™™YKœÝ™X[\ÖÙO\ËßKÛÜÙTÝ™X[NœÏOžÝKœÝ™X[\ÖÜ×O[[KÚ™]—ÜÝ™X[WÛÜÎžÛÜ[ŽœÏOžÝ˜\ˆO]K™Ù]]šXÙJË››ÙKœ™]ŠNÜËœÝ™X[WÛÜÏZKœÝ™X[WÛÜËËœÝ™X[WÛÜË›Ü[‰‰œËœÝ™X[WÛÜË›Ü[ŠÊ_KÙYZÎŠ
OOžÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌ
__KXZ›ÜŽœÏOœÏŽZ[›ÜŽœÏOŒMIœËXZÙY]ŽŠËJOOœÏK™YÚ\Ý\‘]šXÙNŠËJOOžÝK™]šXÙ\ÖÜ×O^ÜÝ™X[WÛÜÎš__KÙ]]šXÙNœÏOK™]šXÙ\ÖÜ×KÙ][Ý[ÎœÏOžÙ›ÜŠ˜\ˆOV×KÏVÜ×NÛË›[™ÝÊ^Ý˜\ˆ[ËœÜ

NÚKœ\Ú

KËœ\Ú˜\JË›[Ý[Ê_\™]\›ˆ_KÞ[˜ÙœÎŠËJOOžÝ\[ÙˆÏOH™[˜Ý[Ûˆ‰‰ŠO\ËÏHLJKKœÞ[˜Ñ”Ô™\]Y\ÝÊÊËKœÞ[˜Ñ”Ô™\]Y\ÝÏŒI‰™ÛŠØ\›š[™ÎˆŠÝKœÞ[˜Ñ”Ô™\]Y\ÝÊÈˆ”ËœÞ[˜ÙœÈÜ\˜][ÛœÈ[ˆ›YÚ]Û˜ÙK›Ø˜X›H\ÝÚ[™È^˜HÛÜšÈŠNÝ˜\ˆÏ]K™Ù][Ý[ÊKœ›ÛÝ›[Ý[
KLÙ[˜Ý[ÛˆJŠ^Ü™]\›ˆKœÞ[˜Ñ”Ô™\]Y\ÝËKKJŠ_Y[˜Ý[ÛˆÊŠ^ÚYŠŠ\™]\›ˆË™\œ›Ü™YÝ›ÚYŠË™\œ›Ü™YHLJŠJNÊÊÙ[Ë›[™Ý	‰›J[
_[Ë™›Ü‘XXÚ

OžÚYŠX‹\KœÞ[˜ÙœÊ\™]\›ˆÊ[
NØ‹\KœÞ[˜ÙœÊ‹ËÊ_JJ_K[Ý[ŠËKÊOOžÝ˜\ˆO[ÏOOH‹È‹ÏH[ÎÚYŠI‰Kœ›ÛÝ
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠL
NÚYŠ[I‰ˆPÊ^Ý˜\ˆ]K›ÛÚÝ\]
ËÙ›ÛÝ×Û[Ý[ˆL_JNÚYŠÏX‹œ]X‹››ÙKKš\Ó[Ý[Ú[

J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠL
NÚYŠ]Kš\Ñ\Š›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠM
_]˜\ˆÏ^Ý\NœËÜÎšK[Ý[Ú[›Ë[Ý[Î–×_KO\Ë›[Ý[
ÊNÜ™]\›ˆK›[Ý[]ËËœ›ÛÝSKOÝKœ›ÛÝSN™	‰Š›[Ý[Y]Ë›[Ý[	‰™›[Ý[›[Ý[Ëœ\Ú
ÊJK_K[›[Ý[œÏOžÝ˜\ˆO]K›ÛÚÝ\]
ËÙ›ÛÝ×Û[Ý[ˆL_JNÚYŠ]Kš\Ó[Ý[Ú[
K››ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝ˜\ˆÏZK››ÙK[Ë›[Ý[YO]K™Ù][Ý[Ê
NÓØš™XÝšÙ^\ÊK›˜[YUX›JK™›Ü‘XXÚ

OžÙ›ÜŠ˜\ˆÏ]K›˜[YUX›VØ—NÝÎÊ^Ý˜\ˆO]Ë›˜[YWÛ™^ÛKš[˜ÛY\ÊË›[Ý[
I‰K™\Ý›ÞS›ÙJÊKÏS__JJKË›[Ý[Y[[Ý˜\ˆÏ[Ë›[Ý[›[Ý[Ëš[™^ÙŠ
NÛË›[Ý[›[Ý[ËœÜXÙJËJ_KÛÚÝ\ŠËJOOœË››ÙWÛÜË›ÛÚÝ\
ËJKZÛ›ÙŠËKÊOOžÝ˜\ˆ]K›ÛÚÝ\]
ËÜ\™[ˆLJK››ÙKO[œ‹˜˜\Ù[˜[YJÊNÚYŠ[_OOOH‹ˆŸOOOH‹‹ˆŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝ˜\ˆÏ]K›X^PÜ™X]JJNÚYŠÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÚYŠY››ÙWÛÜË›ZÛ›Ù
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÜ™]\›ˆ››ÙWÛÜË›ZÛ›Ù
KKÊ_KÜ™X]NŠËJOOŠOZHOO]›ÚYÚNÎIMMK_LÌÍŽK›ZÛ›Ù
ËK
JKZÙ\ŽŠËJOOŠOZHOO]›ÚYÚNLLKILLŒË_LMŒÎK›ZÛ›Ù
ËK
JKZÙ\•™YNŠËJOOžÙ›ÜŠ˜\ˆÏ\ËœÜ]
‹ÈŠKHˆ‹OLÛOË›[™ÝÊÊÛJZYŠÖÛWJ^Ù
ÏH‹ÈŠÛÖÛWNÝž^ÝK›ZÙ\ŠJ_XØ]Ú
Ê^ÚYŠË™\œ››ÈOLŒ
]›ÝÈß__KZÙ]ŽŠËKÊOOŠÏOO]›ÚY	‰ŠÏZKOMÎ
K_NNL‹K›ZÛ›Ù
ËKÊJKÞ[[[šÎŠËJOOžÚYŠIËœ™\ÛÛ™JÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝ˜\ˆÏ]K›ÛÚÝ\]
KÜ\™[ˆLJK››ÙNÚYŠ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝ˜\ˆ[œ‹˜˜\Ù[˜[YJJKO]K›X^PÜ™X]JË
NÚYŠJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠJNÚYŠ[Ë››ÙWÛÜËœÞ[[[šÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÜ™]\›ˆË››ÙWÛÜËœÞ[[[šÊËÊ_K™[˜[YNŠËJOOžÝ˜\ˆËO[œ‹™\›˜[YJÊKÏ[œ‹™\›˜[YJJK[œ‹˜˜\Ù[˜[YJÊKÏ[œ‹˜˜\Ù[˜[YJJNÚYŠÏ]K›ÛÚÝ\]
ËÜ\™[ˆLJK››ÙK]K›ÛÚÝ\]
KÜ\™[ˆLJK››ÙK[ßY
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠË›[Ý[OOY›[Ý[
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÍJNÝ˜\ˆK]K›ÛÚÝ\›ÙJËŠKIËœ™[]]™JËÊNÚYŠ˜Ú\]

HOOH‹ˆŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÚYŠ
IËœ™[]]™JKJJK˜Ú\]

HOOH‹ˆŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠMJNÝž^ÓO]K›ÛÚÝ\›ÙJÊ_XØ]ÚßZYŠOOSJ^Ý˜\ˆÏ]Kš\Ñ\Š›[ÙJK]K›X^Q[]JË‹ÊNÚYŠŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠSOÝK›X^Q[]JËÊNK›X^PÜ™X]JÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠ[Ë››ÙWÛÜËœ™[˜[YJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÚYŠKš\Ó[Ý[Ú[

_I‰Kš\Ó[Ý[Ú[
JJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠL
NÚYŠOO[É‰Š]K››ÙT\›Z\ÜÚ[ÛœÊËÈŠJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÝKš\Ú™[[Ý™S›ÙJ
NÝž^ÛË››ÙWÛÜËœ™[˜[YJÊ_XØ]Ú
J^Ý›ÝÈ_Yš[˜[^ÝKš\ÚY›ÙJ
___K›Y\ŽœÏOžÝ˜\ˆO]K›ÛÚÝ\]
ËÜ\™[ˆLJK››ÙKÏ[œ‹˜˜\Ù[˜[YJÊK]K›ÛÚÝ\›ÙJKÊKO]K›X^Q[]JKËL
NÚYŠJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠJNÚYŠZK››ÙWÛÜËœ›Y\Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÚYŠKš\Ó[Ý[Ú[

J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠL
NÚK››ÙWÛÜËœ›Y\ŠKÊKK™\Ý›ÞS›ÙJ
_K™XY\ŽœÏOžÝ˜\ˆO]K›ÛÚÝ\]
ËÙ›ÛÝÎˆLJK››ÙNÚYŠZK››ÙWÛÜËœ™XY\Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠM
NÜ™]\›ˆK››ÙWÛÜËœ™XY\ŠJ_K[›[šÎœÏOžÝ˜\ˆO]K›ÛÚÝ\]
ËÜ\™[ˆLJK››ÙNÚYŠZJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝ˜\ˆÏ[œ‹˜˜\Ù[˜[YJÊK]K›ÛÚÝ\›ÙJKÊKO]K›X^Q[]JKËLJNÚYŠJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠJNÚYŠZK››ÙWÛÜË[›[šÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÚYŠKš\Ó[Ý[Ú[

J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠL
NÚK››ÙWÛÜË[›[šÊKÊKK™\Ý›ÞS›ÙJ
_K™XY[šÎœÏOžÝ˜\ˆO]K›ÛÚÝ\]
ÊK››ÙNÚYŠZJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠZK››ÙWÛÜËœ™XY[šÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÜ™]\›ˆ	Ëœ™\ÛÛ™JK™Ù]]
Kœ\™[
KK››ÙWÛÜËœ™XY[šÊJJ_KÝ]ŠËJOOžÝ˜\ˆÏ]K›ÛÚÝ\]
ËÙ›ÛÝÎˆZ_JK››ÙNÚYŠ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠ[Ë››ÙWÛÜË™Ù]]Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÜ™]\›ˆË››ÙWÛÜË™Ù]]ŠÊ_KÝ]œÏOKœÝ]
ËL
KÚ[ÙŠËKÊOOžÝ˜\ˆÚYŠ\[ÙˆÏOHœÝš[™ÈÙ]K›ÛÚÝ\]
ËÙ›ÛÝÎˆ[ßJK››ÙN™\ËY››ÙWÛÜËœÙ]]Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÙ››ÙWÛÜËœÙ]]ŠÛ[ÙNMIš_MM‰™›[ÙK[Y\Ý[\‘]K››ÝÊ
_J_KÚ[ÙŠËJOOžÝK˜Ú[Ù
ËKL
_K˜Ú[ÙŠËJOOžÝ˜\ˆÏ]K™Ù]Ý™X[JÊNÚYŠ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝK˜Ú[Ù
Ë››ÙKJ_KÚÝÛŽŠËKË
OOžÝ˜\ˆNÚYŠ\[ÙˆÏOHœÝš[™ÈÛO]K›ÛÚÝ\]
ËÙ›ÛÝÎˆYJK››ÙN›O\Ë[K››ÙWÛÜËœÙ]]Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÛK››ÙWÛÜËœÙ]]ŠKÝ[Y\Ý[\‘]K››ÝÊ
_J_KÚÝÛŽŠËKÊOOžÝK˜ÚÝÛŠËKËL
_K˜ÚÝÛŽŠËKÊOOžÝ˜\ˆ]K™Ù]Ý™X[JÊNÚYŠY
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝK˜ÚÝÛŠ››ÙKKÊ_K[˜Ø]NŠËJOOžÚYŠO
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝ˜\ˆÎÚYŠ\[ÙˆÏOHœÝš[™ÈÛÏ]K›ÛÚÝ\]
ËÙ›ÛÝÎˆLJK››ÙN›Ï\Ë[Ë››ÙWÛÜËœÙ]]Š]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒÊNÚYŠKš\Ñ\ŠË›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌJNÚYŠ]Kš\Ñš[JË›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝ˜\ˆ]K››ÙT\›Z\ÜÚ[ÛœÊËÈŠNÚYŠ
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÛË››ÙWÛÜËœÙ]]ŠËÜÚ^™NšK[Y\Ý[\‘]K››ÝÊ
_J_K[˜Ø]NŠËJOOžÝ˜\ˆÏ]K™Ù]Ý™X[JÊNÚYŠ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠJŒMÌMMI›Ë™›YÜÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝK[˜Ø]JË››ÙKJ_K][YNŠËKÊOOžÝ˜\ˆ]K›ÛÚÝ\]
ËÙ›ÛÝÎˆLJK››ÙNÙ››ÙWÛÜËœÙ]]ŠÝ[Y\Ý[\“X]›X^
KÊ_J_KÜ[ŽŠËKÊOOžÚYŠÏOOHˆŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝ˜\ˆÚYŠÏ[ÏOO]›ÚYÍÎ›ËÏM	ŠO]\[ÙˆOOHœÝš[™ÈÝK›[ÙTÝš[™ÕÑ›YÜÊJNšJOÍMI›ßÌÍŽŒ\[ÙˆÏOH›Øš™XÝŠY\ÎÙ[Ù^ÜÏ[œ‹››Ü›X[^™JÊNÝž^Ù]K›ÛÚÝ\]
ËÙ›ÛÝÎˆJLÌLÌ‰šJ_JK››Ù_XØ]Úß_]˜\ˆOHLNÚYŠ	šJZYŠ
^ÚYŠLŽ	šJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŒ
_Y[ÙH]K›ZÛ›Ù
ËË
KOHLÚYŠY
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠKš\ÐÚ™]Š›[ÙJI‰ŠIKMLLÊKMLÍ‰šI‰ˆ]Kš\Ñ\Š›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠM
NÚYŠ[J^Ý˜\ˆÏ]K›X^SÜ[ŠJNÚYŠÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊ_MLL‰šI‰ˆ[I‰K[˜Ø]J
KIKLLÌMÌLÎÝ˜\ˆ]K˜Ü™X]TÝ™X[JÛ›ÙN™]K™Ù]]

K›YÜÎšKÙYZØX›NˆLÜÚ][ÛŽŒÝ™X[WÛÜÎ™œÝ™X[WÛÜË[™ÛÝ[Ž–×K\œ›ÜŽˆL_JNÜ™]\›ˆ‹œÝ™X[WÛÜË›Ü[‰‰˜‹œÝ™X[WÛÜË›Ü[ŠŠK[™K›ÙÔ™XYš[\ßIš_
Kœ™XYš[\ß
Kœ™XYš[\Ï^ßJKÈ[ˆKœ™XYš[\ß
Kœ™XYš[\ÖÜ×OLJJKŸKÛÜÙNœÏOžÚYŠKš\ÐÛÜÙY
ÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÜË™Ù][É‰ŠË™Ù][Ï[[
NÝž^ÜËœÝ™X[WÛÜË˜ÛÜÙI‰œËœÝ™X[WÛÜË˜ÛÜÙJÊ_XØ]Ú
J^Ý›ÝÈ_Yš[˜[^ÝK˜ÛÜÙTÝ™X[JË™™
_\Ë™™[[K\ÐÛÜÙYœÏOœË™™OO[[ÙYZÎŠËKÊOOžÚYŠKš\ÐÛÜÙY
ÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠ\ËœÙYZØX›_\ËœÝ™X[WÛÜË›ÙYZÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌ
NÚYŠÈOL	‰›ÈOLI‰›ÈOLŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÜ™]\›ˆËœÜÚ][Û\ËœÝ™X[WÛÜË›ÙYZÊËKÊKË[™ÛÝ[V×KËœÜÚ][ÛŸK™XYŠËKËJOOžÚYŠO
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÚYŠKš\ÐÛÜÙY
ÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠ
ŒMÌMMIœË™›YÜÊOOLJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠKš\Ñ\ŠË››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌJNÚYŠ\ËœÝ™X[WÛÜËœ™XY
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÝ˜\ˆÏ[HOO]›ÚYÚYŠÊ^ÚYŠ\ËœÙYZØX›J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌ
_Y[ÙHO\ËœÜÚ][ÛŽÝ˜\ˆ\ËœÝ™X[WÛÜËœ™XY
ËKËJNÜ™]\›ˆß
ËœÜÚ][ÛŠÏXŠKŸKÜš]NŠËKËKÊOOžÚYŠO
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÚYŠKš\ÐÛÜÙY
ÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠJŒMÌMMIœË™›YÜÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠKš\Ñ\ŠË››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌJNÚYŠ\ËœÝ™X[WÛÜËÜš]J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÜËœÙYZØX›I‰ŒL	œË™›YÜÉ‰K›ÙYZÊËŠNÝ˜\ˆ[HOO]›ÚYÚYŠŠ^ÚYŠ\ËœÙYZØX›J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÌ
_Y[ÙHO\ËœÜÚ][ÛŽÝ˜\ˆÏ\ËœÝ™X[WÛÜËÜš]JËKËKÊNÜ™]\›ˆŸ
ËœÜÚ][ÛŠÏ]ÊKßK[ØØ]NŠËKÊOOžÚYŠKš\ÐÛÜÙY
ÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠOÏL
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽ
NÚYŠJŒMÌMMIœË™›YÜÊJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠ]Kš\Ñš[JË››ÙK›[ÙJI‰ˆ]Kš\Ñ\ŠË››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÚYŠ\ËœÝ™X[WÛÜË˜[ØØ]J]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠLÎ
NÜËœÝ™X[WÛÜË˜[ØØ]JËKÊ_K[X\ŠËKËJOOžÚYŠ‰™	‰ˆJ‰›JI‰ŠŒMÌMMIœË™›YÜÊHOLŠ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠ
ŒMÌMMIœË™›YÜÊOOLJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠ\ËœÝ™X[WÛÜË›[X\
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÜ™]\›ˆËœÝ™X[WÛÜË›[X\
ËKËJ_K\Þ[˜ÎŠËKËJOOœËœÝ™X[WÛÜË›\Þ[˜ÏÜËœÝ™X[WÛÜË›\Þ[˜ÊËKËJNŒ][›X\œÏOŒ[ØÝŠËKÊOOžÚYŠ\ËœÝ™X[WÛÜËš[ØÝ
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠNJNÜ™]\›ˆËœÝ™X[WÛÜËš[ØÝ
ËKÊ_K™XYš[NŠËO^ßJOOžÚYŠK™›YÜÏZK™›YÜßK™[˜ÛÙ[™ÏZK™[˜ÛÙ[™ß˜š[˜\žH‹K™[˜ÛÙ[™ÈOOH]Ž‰‰šK™[˜ÛÙ[™ÈOOH˜š[˜\žHŠ]›ÝÈ™]È\œ›ÜŠ	Ò[˜[Y[˜ÛÙ[™È\H‰ÊÚK™[˜ÛÙ[™ÊÉÈ‰ÊNÝ˜\ˆË]K›Ü[ŠËK™›YÜÊKO]KœÝ]
ÊKœÚ^™KÏ[™]ÈZ[\œ˜^JJNÜ™]\›ˆKœ™XY
ËK
KK™[˜ÛÙ[™ÏOOH]ŽÛÏ[ŠË
NšK™[˜ÛÙ[™ÏOOH˜š[˜\žH‰‰ŠÏPÊKK˜ÛÜÙJ
KßKÜš]Qš[NŠËKÏ^ßJOOžÛË™›YÜÏ[Ë™›YÜßMÍÎÝ˜\ˆ]K›Ü[ŠËË™›YÜËË›[ÙJNÚYŠ\[ÙˆOOHœÝš[™ÈŠ^Ý˜\ˆO[™]ÈZ[\œ˜^JÌÊJJÌJKÏRŒŠKKK›[™Ý
NÝKÜš]JKË›ÚYË˜Ø[“ÝÛŠ_Y[Ù^ÚYŠP\œ˜^PY™™\‹š\ÕšY]ÊJJ]›ÝÈ™]È\œ›ÜŠ•[œÝ\ÜY]H\HŠNÝKÜš]JKK˜ž]S[™Ý›ÚYË˜Ø[“ÝÛŠ_]K˜ÛÜÙJ
_KÝÙŠ
OOK˜Ý\œ™[]Ú\ŽœÏOžÝ˜\ˆO]K›ÛÚÝ\]
ËÙ›ÛÝÎˆLJNÚYŠK››ÙOOO[[
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÚYŠ]Kš\Ñ\ŠK››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠM
NÝ˜\ˆÏ]K››ÙT\›Z\ÜÚ[ÛœÊK››ÙKžŠNÚYŠÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÝK˜Ý\œ™[]ZKœ]KÜ™X]QY˜][\™XÝÜšY\ÎŠ
OOžÝK›ZÙ\Š‹Ý\ŠKK›ZÙ\Š‹ÚÛYHŠKK›ZÙ\Š‹ÚÛYKÝÙX—Ý\Ù\ˆŠ_KÜ™X]QY˜][]šXÙ\ÎŠ
OOžÝK›ZÙ\Š‹Ù]ˆŠKKœ™YÚ\Ý\‘]šXÙJK›XZÙY]ŠKÊKÜ™XYŠ
OOŒÜš]NŠËKËJOO™JKK›ZÙ]Š‹Ù]‹Û[‹K›XZÙY]ŠKÊJKZKœ™YÚ\Ý\ŠK›XZÙY]ŠK
KZK™Y˜][ÝWÛÜÊKZKœ™YÚ\Ý\ŠK›XZÙY]Š‹
KZK™Y˜][ÝLWÛÜÊKK›ZÙ]Š‹Ù]‹ÝH‹K›XZÙY]ŠK
JKK›ZÙ]Š‹Ù]‹ÝLH‹K›XZÙY]Š‹
JKK›ZÙ\Š‹Ù]‹ÜÚHŠKK›ZÙ\Š‹Ù]‹ÜÚKÝ\Š_KÜ™X]TÜXÚX[\™XÝÜšY\ÎŠ
OOžÝK›ZÙ\Š‹Ü›ØÈŠNÝ˜\ˆÏ]K›ZÙ\Š‹Ü›ØËÜÙ[ˆŠNÝK›ZÙ\Š‹Ü›ØËÜÙ[‹Ù™ŠKK›[Ý[
Û[Ý[Š
OOžÝ˜\ˆO]K˜Ü™X]S›ÙJË™™‹MŽMKÌÊNÜ™]\›ˆK››ÙWÛÜÏ^ÛÛÚÝ\ŠË
OOžÝ˜\ˆOJÙÏ]K™Ù]Ý™X[JJNÚYŠPÊ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÝ˜\ˆ^Ü\™[›[[Ý[žÛ[Ý[Ú[ˆ™˜ZÙHŸK›ÙWÛÜÎžÜ™XY[šÎŠ
OOËœ]_NÜ™]\›ˆ‹œ\™[X‹Ÿ_K__KßK‹Ü›ØËÜÙ[‹Ù™Š_KÜ™X]TÝ[™\™Ý™X[\ÎŠ
OOžÛ™KœÝ[ÝK˜Ü™X]Q]šXÙJ‹Ù]ˆ‹œÝ[ˆ‹™KœÝ[ŠNKœÞ[[[šÊ‹Ù]‹ÝH‹‹Ù]‹ÜÝ[ˆŠK™KœÝÝ]ÝK˜Ü™X]Q]šXÙJ‹Ù]ˆ‹œÝÝ]‹[™KœÝÝ]
NKœÞ[[[šÊ‹Ù]‹ÝH‹‹Ù]‹ÜÝÝ]ŠK™KœÝ\œÝK˜Ü™X]Q]šXÙJ‹Ù]ˆ‹œÝ\œˆ‹[™KœÝ\œŠNKœÞ[[[šÊ‹Ù]‹ÝLH‹‹Ù]‹ÜÝ\œˆŠKK›Ü[Š‹Ù]‹ÜÝ[ˆ‹
KK›Ü[Š‹Ù]‹ÜÝÝ]‹JKK›Ü[Š‹Ù]‹ÜÝ\œˆ‹J_K[œÝ\™Q\œ››Ñ\œ›ÜŽŠ
OOžÝK‘\œ››Ñ\œ›ÜŸ
K‘\œ››Ñ\œ›ÜY[˜Ý[ÛŠËJ^Ý\Ë››ÙOZK\ËœÙ]\œ››ÏY[˜Ý[ÛŠÊ^Ý\Ë™\œ››Ï[ßK\ËœÙ]\œ››ÊÊK\Ë›Y\ÜØYÙOH‘”È\œ›ÜˆŸKK‘\œ››Ñ\œ›Ü‹œ›ÝÝ\O[™]È\œ›Ü‹K‘\œ››Ñ\œ›Ü‹œ›ÝÝ\K˜ÛÛœÝXÝÜ]K‘\œ››Ñ\œ›Ü‹ÍK™›Ü‘XXÚ

ÏOžÝK™Ù[™\šXÑ\œ›ÜœÖÜ×O[™]ÈK‘\œ››Ñ\œ›ÜŠÊKK™Ù[™\šXÑ\œ›ÜœÖÜ×KœÝXÚÏHÙ[™\šXÈ\œ›Ü‹›ÈÝXÚÏˆŸJJJ_KÝ]XÒ[š]Š
OOžÝK™[œÝ\™Q\œ››Ñ\œ›ÜŠ
KK›˜[YUX›O[™]È\œ˜^JMŠKK›[Ý[
KßK‹ÈŠKK˜Ü™X]QY˜][\™XÝÜšY\Ê
KK˜Ü™X]QY˜][]šXÙ\Ê
KK˜Ü™X]TÜXÚX[\™XÝÜšY\Ê
KK™š[\Þ\Ý[\Ï^ÓQSQ”Î‘__K[š]ŠËKÊOOžÝKš[š]š[š]X[^™YHLK™[œÝ\™Q\œ››Ñ\œ›ÜŠ
K™KœÝ[\ß™KœÝ[‹™KœÝÝ]Z_™KœÝÝ]™KœÝ\œ[ß™KœÝ\œ‹K˜Ü™X]TÝ[™\™Ý™X[\Ê
_K]Z]Š
OOžÝKš[š]š[š]X[^™YHLNÙ›ÜŠ˜\ˆÏLÜÏKœÝ™X[\Ë›[™ÝÜÊÊÊ^Ý˜\ˆO]KœÝ™X[\ÖÜ×NÚI‰K˜ÛÜÙJJ__KÙ][ÙNŠËJOOžÝ˜\ˆÏLÜ™]\›ˆÉ‰ŠßLÍJKI‰ŠßLMŠKßKš[™Øš™XÝŠËJOOžÝ˜\ˆÏ]K˜[˜[^™T]
ËJNÜ™]\›ˆË™^\ÝÏÛË›Øš™XÝ›[K[˜[^™T]ŠËJOOžÝž^ÜÏJ]K›ÛÚÝ\]
ËÙ›ÛÝÎˆZ_JJKœ]XØ]Úß]˜\ˆÏ^Ú\Ô›ÛÝˆLK^\ÝÎˆLK\œ›ÜŽŒ˜[YN›[]›[Øš™XÝ›[\™[^\ÝÎˆLK\™[]›[\™[Øš™XÝ›[NÝž^Ý˜\ˆ]K›ÛÚÝ\]
ËÜ\™[ˆLJNÛËœ\™[^\ÝÏHLËœ\™[]Yœ]Ëœ\™[Øš™XÝY››ÙKË›˜[YO[œ‹˜˜\Ù[˜[YJÊK]K›ÛÚÝ\]
ËÙ›ÛÝÎˆZ_JKË™^\ÝÏHLËœ]Yœ]Ë›Øš™XÝY››ÙKË›˜[YOY››ÙK›˜[YKËš\Ô›ÛÝYœ]OOH‹ÈŸXØ]Ú
J^ÛË™\œ›Ü[K™\œ››ß\™]\›ˆßKÜ™X]T]ŠËKË
OOžÜÏ]\[ÙˆÏOHœÝš[™ÈÜÎK™Ù]]
ÊNÙ›ÜŠ˜\ˆOZKœÜ]
‹ÈŠKœ™]™\œÙJ
NÛK›[™ÝÊ^Ý˜\ˆÏ[KœÜ

NÚYŠÊ^Ý˜\ˆ[œ‹š›Ú[ŒŠËÊNÝž^ÝK›ZÙ\ŠŠ_XØ]Úß\ÏXŸ_\™]\›ˆŸKÜ™X]Qš[NŠËKËJOOžÝ˜\ˆÏ[œ‹š›Ú[ŒŠ\[ÙˆÏOHœÝš[™ÈÜÎK™Ù]]
ÊKJK]K™Ù][ÙJJNÜ™]\›ˆK˜Ü™X]JËŠ_KÜ™X]Q]Qš[NŠËKËKÊOOžÝ˜\ˆZNÜÉ‰ŠÏ]\[ÙˆÏOHœÝš[™ÈÜÎK™Ù]]
ÊKZOÛœ‹š›Ú[ŒŠËJNœÊNÝ˜\ˆÏ]K™Ù][ÙJJKO]K˜Ü™X]J‹ÊNÚYŠÊ^ÚYŠ\[ÙˆÏOHœÝš[™ÈŠ^Ù›ÜŠ˜\ˆ[™]È\œ˜^JË›[™Ý
KLÏ[Ë›[™ÝÑÎÊÊÑ
^ÑO[Ë˜Ú\ÛÙP]

NÛÏ^]K˜Ú[Ù
KMŸÊNÝ˜\ˆ]K›Ü[ŠKMÍÊNÝKÜš]J‹ËË›[™ÝÊKK˜ÛÜÙJŠKK˜Ú[Ù
KÊ_\™]\›ˆ_KÜ™X]Q]šXÙNŠËKË
OOžÝ˜\ˆO[œ‹š›Ú[ŒŠ\[ÙˆÏOHœÝš[™ÈÜÎK™Ù]]
ÊKJKÏ]K™Ù][ÙJH[ËHY
NÝK˜Ü™X]Q]šXÙK›XZ›ÜŸ
K˜Ü™X]Q]šXÙK›XZ›ÜM
NÝ˜\ˆ]K›XZÙY]ŠK˜Ü™X]Q]šXÙK›XZ›ÜŠÊË
NÜ™]\›ˆKœ™YÚ\Ý\‘]šXÙJ‹ÛÜ[ŽÏOžÝËœÙYZØX›OHL_KÛÜÙNÏOžÙ	‰™˜Y™™\‰‰™˜Y™™\‹›[™Ý	‰™
L
_K™XYŠËKÊOOžÙ›ÜŠ˜\ˆLOLÔOÔJÊÊ^Ý˜\ˆŽÝž^Ñ[Ê
_XØ]ÚÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽJ_ZYŠOO]›ÚY	‰OOL
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŠNÚYŠO[[
Xœ™XZÎÝŠÊËVÞ
ÔWOQŸ\™]\›ˆ‰‰ŠË››ÙK[Y\Ý[\Q]K››ÝÊ
JKŸKÜš]NŠËKÊOOžÙ›ÜŠ˜\ˆLÝÝŠÊÊ]ž^Ù
VÞ
Ý—J_XØ]ÚÝ›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠŽJ_\™]\›ˆ	‰ŠË››ÙK[Y\Ý[\Q]K››ÝÊ
JKŸ_JKK›ZÙ]ŠKËŠ_K›Ü˜ÙSØYš[NœÏOžÚYŠËš\Ñ]šXÙ_Ëš\Ñ›Û\ŸË›[šßË˜ÛÛ[Ê\™]\›ˆLÝ›ÝÈ\[ÙˆS™\]Y\ÝHÛ™]È\œ›ÜŠ“^žHØY[™ÈÚÝ[]™H™Y[ˆ\™›Ü›YY
ÛÛ[ÈÙ]
H[ˆÜ™X]S^žQš[K]]Ø\È›Ýˆ^žHØY[™ÈÛ›HÛÜšÜÈ[ˆÙXˆÛÜšÙ\œËˆ\ÙHKY[X™YYš[HÜˆK\™[ØYYš[H[ˆ[XØÈÛˆHXZ[ˆ™XYˆŠN›™]È\œ›ÜŠØ[››ÝØYÚ]Ý]™XY

HÜˆS™\]Y\ÝˆŠ_KÜ™X]S^žQš[NŠËKËJOOžÙ[˜Ý[ÛˆÊ
^Ý\Ë›[™ÝÛ›ÝÛHLK\Ë˜Ú[šÜÏV×_ZYŠËœ›ÝÝ\K™Ù]Y[˜Ý[ÛŠÊ^ÚYŠJÏ\Ë›[™ÝL_Ï
J^Ý˜\ˆWÉ]\Ë˜Ú[šÔÚ^™KOWËÝ\Ë˜Ú[šÔÚ^™_Ü™]\›ˆ\Ë™Ù]\ŠJVÝ—__KËœ›ÝÝ\KœÙ]]QÙ]\Y[˜Ý[ÛŠÊ^Ý\Ë™Ù]\WßKËœ›ÝÝ\K˜ØXÚS[™ÝY[˜Ý[ÛŠ
^Ý˜\ˆÏ[™]ÈS™\]Y\ÝÚYŠË›Ü[Š’PQ‹ËLJKËœÙ[™
[
KJËœÝ]\ÏLŒ	‰—ËœÝ]\ÏÌËœÝ]\ÏOOLÌ
J]›ÝÈ™]È\œ›ÜŠÛÝ[‰ÝØYŠÛÊÈ‹ˆÝ]\ÎˆŠ×ËœÝ]\ÊNÝ˜\ˆ‹OS[X™\ŠË™Ù]™\ÜÛœÙRXY\ŠÛÛ[[[™ÝŠJKJWË™Ù]™\ÜÛœÙRXY\ŠXØÙ\T˜[™Ù\ÈŠJI‰OOH˜ž]\È‹JWË™Ù]™\ÜÛœÙRXY\ŠÛÛ[Q[˜ÛÙ[™ÈŠJI‰OOH™Þš\‹LLMÍŽÑŸ
TJNÝ˜\ˆ]\ÎÔ‹œÙ]]QÙ]\Š
OžÝ˜\ˆÏS
–ÏJ
ÌJJ–LNÚYŠÏSX]›Z[ŠËKLJK‹˜Ú[šÜÖÓOOO]›ÚY	‰Š‹˜Ú[šÜÖÓOJ
ËJOOžÚYŠÏ™J]›ÝÈ™]È\œ›ÜŠš[˜[Y˜[™ÙH
ŠÚÊÈ‹ŠÙJÈŠHÜˆ›Èž]\È™\]Y\ÝYHŠNÚYŠO”KLJ]›ÝÈ™]È\œ›ÜŠ›Û›HŠÔJÈˆž]\È]˜Z[X›HH›ÙÜ˜[[Y\ˆ\œ›ÜˆHŠNÝ˜\ˆO[™]ÈS™\]Y\ÝÚYŠK›Ü[Š‘ÑU‹ËLJKHOOV	‰KœÙ]™\]Y\ÝXY\Š”˜[™ÙH‹˜ž]\ÏHŠÚÊÈ‹HŠÙJKKœ™\ÜÛœÙU\OH˜\œ˜^XY™™\ˆ‹K›Ý™\œšYSZ[YU\I‰K›Ý™\œšYSZ[YU\J^ÜZ[ŽÈÚ\œÙ]^]\Ù\‹YYš[™YŠKKœÙ[™
[
KJKœÝ]\ÏLŒ	‰KœÝ]\ÏÌKœÝ]\ÏOOLÌ
J]›ÝÈ™]È\œ›ÜŠÛÝ[‰ÝØYŠÛÊÈ‹ˆÝ]\ÎˆŠÝKœÝ]\ÊNÜ™]\›ˆKœ™\ÜÛœÙHOO]›ÚYÛ™]ÈZ[\œ˜^JKœ™\ÜÛœÙ_×JN•ÌÊKœ™\ÜÛœÙU^ˆ‹L
_JJËÊJK‹˜Ú[šÜÖÓOOO]›ÚY
]›ÝÈ™]È\œ›ÜŠ™Öˆ˜Z[YHŠNÜ™]\›ˆ‹˜Ú[šÜÖÓ_JJKZ‰‰”_
TOLKO]\Ë™Ù]\Š
K›[™ÝTKŒ
“^žQš[\ÈÛˆÞš\›Ü˜Ù\ÈÝÛ›ØYÙˆHÚÛHš[HÚ[ˆ[™Ý\ÈXØÙ\ÜÙYŠJK\Ë—Û[™ÝTK\Ë—ØÚ[šÔÚ^™OV\Ë›[™ÝÛ›ÝÛHLK\[ÙˆS™\]Y\ÝHŠ^ÚYŠWÝÊ]›ÝÈØ[››ÝÈÞ[˜Ú›Û›Ý\Èš[˜\žHœÈÝ]ÚYHÙXÛÜšÙ\œÈ[ˆ[Ù\›ˆœ›ÝÜÙ\œËˆ\ÙHKY[X™YYš[HÜˆK\™[ØYYš[H[ˆ[XØÈŽÝ˜\ˆ[™]ÈÎÓØš™XÝ™Yš[™T›Ü\Y\Ê‹Û[™ÝžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\Ë›[™ÝÛ›ÝÛŸ\Ë˜ØXÚS[™Ý

K\Ë—Û[™Ý_KÚ[šÔÚ^™NžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\Ë›[™ÝÛ›ÝÛŸ\Ë˜ØXÚS[™Ý

K\Ë—ØÚ[šÔÚ^™___JNÝ˜\ˆÏ^Ú\Ñ]šXÙNˆLKÛÛ[Î˜Ÿ_Y[ÙHÏ^Ú\Ñ]šXÙNˆLK\››ßNÝ˜\ˆO]K˜Ü™X]Qš[JËKËJNÝË˜ÛÛ[ÏÓK˜ÛÛ[Ï]Ë˜ÛÛ[ÎË\›	‰ŠK˜ÛÛ[Ï[[K\›]Ë\›
KØš™XÝ™Yš[™T›Ü\Y\ÊKÝ\ÙYž]\ÎžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\Ë˜ÛÛ[Ë›[™Ý__JNÝ˜\ˆ^ßNÙ[˜Ý[Ûˆ
Ë‹K‹Š^Ý˜\ˆWË››ÙK˜ÛÛ[ÎÚYŠV›[™Ý
\™]\›ˆÝ˜\ˆSX]›Z[Š›[™ÝZ‹ŠNÚYŠœÛXÙJY›ÜŠ˜\ˆLÓŽÓ
ÊÊ]–ÔJÓOVÚŠÓNÙ[ÙH›ÜŠLÓŽÓ
ÊÊ]–ÔJÓOV™Ù]
ŠÓ
NÜ™]\›ˆŸ\™]\›ˆØš™XÝšÙ^\ÊKœÝ™X[WÛÜÊK™›Ü‘XXÚ

ÏOžÝ˜\ˆSKœÝ™X[WÛÜÖ××NÞ××OY[˜Ý[ÛŠ
^Ü™]\›ˆK™›Ü˜ÙSØYš[JJK‹˜\J[\™Ý[Y[Ê__JJKœ™XYJË‹K‹ŠOOŠK™›Ü˜ÙSØYš[JJK
Ë‹K‹ŠJK›[X\JË‹K‹ŠOOžÝK™›Ü˜ÙSØYš[JJNÝ˜\ˆUŒÊ
NÚYŠV
]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÜ™]\›ˆ
ËXK‹JKÜŽ–[ØØ]YˆL_KKœÝ™X[WÛÜÏ^_K[™^YŽŠ
OOÚ[™ÝËš[™^YŸÚ[™ÝË›[Þ’[™^YŸÚ[™ÝËÙXšÚ][™^YŸÚ[™ÝË›\Ò[™^Y‹—ÓSQNŠ
OOˆ‘SWÑ”×ÈŠÝÚ[™ÝË›ØØ][Û‹œ]˜[YK—Õ‘T”ÒSÓŽŒŒ—ÔÕÔ‘WÓSQNˆ‘’SWÑUH‹Ø]™Qš[\ÕÑŽŠËKÊOOžÚOZ_


OOžßJKÏ[ß


OOžßJNÝ˜\ˆ]Kš[™^YŠ
NÝž^Ý˜\ˆOY›Ü[ŠK‘—ÓSQJ
KK‘—Õ‘T”ÒSÓŠ_XØ]Ú
Ê^Ü™]\›ˆÊÊ_[K›Û\Ü˜Y[™YYYJ
OOžÖŒ
˜Ü™X][™ÈˆŠKKœ™\Ý[˜Ü™X]SØš™XÝÝÜ™JK‘—ÔÕÔ‘WÓSQJ_KK›ÛœÝXØÙ\ÜÏJ
OOžÝ˜\ˆÏ[Kœ™\Ý[˜[œØXÝ[ÛŠÝK‘—ÔÕÔ‘WÓSQWKœ™XYÜš]HŠKPË›Øš™XÝÝÜ™JK‘—ÔÕÔ‘WÓSQJKÏLOL\Ë›[™ÝÙ[˜Ý[Ûˆ

^ÓOOLÚJ
N›Ê
_\Ë™›Ü‘XXÚ

ÏOžÝ˜\ˆX‹œ]
K˜[˜[^™T]
ÊK›Øš™XÝ˜ÛÛ[ËÊNÝ‹›ÛœÝXØÙ\ÜÏJ
OOžÊÊÝÊÓOO^	‰‘

_K‹›Û™\œ›ÜJ
OOžÓJÊËÊÓOO^	‰‘

__JJKË›Û™\œ›Ü[ßKK›Û™\œ›Ü[ßKØYš[\Ñœ›ÛQŽŠËKÊOOžÚOZ_


OOžßJKÏ[ß


OOžßJNÝ˜\ˆ]Kš[™^YŠ
NÝž^Ý˜\ˆOY›Ü[ŠK‘—ÓSQJ
KK‘—Õ‘T”ÒSÓŠ_XØ]Ú
Ê^Ü™]\›ˆÊÊ_[K›Û\Ü˜Y[™YYY[ËK›ÛœÝXØÙ\ÜÏJ
OOžÝ˜\ˆÏ[Kœ™\Ý[Ýž^Ý˜\ˆPË˜[œØXÝ[ÛŠÝK‘—ÔÕÔ‘WÓSQWKœ™XYÛ›HŠ_XØ]Ú
Š^Ü™]\›ˆ›ÚYÊŠ_]˜\ˆÏX‹›Øš™XÝÝÜ™JK‘—ÔÕÔ‘WÓSQJKOLL\Ë›[™ÝÙ[˜Ý[ÛˆÊ
^ÞOLÚJ
N›Ê
_\Ë™›Ü‘XXÚ

OžÝ˜\ˆO]Ë™Ù]
ŠNÔK›ÛœÝXØÙ\ÜÏJ
OOžÝK˜[˜[^™T]
ŠK™^\ÝÉ‰K[›[šÊŠKK˜Ü™X]Q]Qš[Jœ‹™\›˜[YJŠKœ‹˜˜\Ù[˜[YJŠKKœ™\Ý[LLL
K
ÊÓJÞOQ	‰—Ê
_KK›Û™\œ›ÜJ
OOžÞ
ÊËJÞOQ	‰—Ê
__JJK‹›Û™\œ›Ü[ßKK›Û™\œ›Ü[ß_K\^ÑQUSÔÓPTÒÎKØ[Ý[]P]™[˜Ý[ÛŠËKÊ^ÚYŠœ‹š\ÐXœÊJJ\™]\›ˆNÝ˜\ˆÚYŠÏOOKLLÙ]K˜ÝÙ

N™^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊKœ]K›[™ÝOL
^ÚYŠ[Ê]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÜ™]\›ˆ\™]\›ˆœ‹š›Ú[ŒŠJ_KÔÝ]™[˜Ý[ÛŠËKÊ^Ýž^Ý˜\ˆ\ÊJ_XØ]Ú
Ê^ÚYŠÉ‰Ë››ÙI‰›œ‹››Ü›X[^™JJHOO[œ‹››Ü›X[^™JK™Ù]]
Ë››ÙJJJ\™]\›‹MMÝ›ÝÈßUÐVÛÏŒ—OY™]‹ÐVÛÊÎŒ—OYš[›ËÐVÛÊÌLŒ—OY›[ÙKXVÛÊÌMŒ—OY››[šËÐVÛÊÌŒŒ—OYZYÐVÛÊÌŒ—OY™ÚYÐVÛÊÌŽŒ—OYœ™]‹œVÙœÚ^™OŒ
OYœÚ^™K
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛÊÍŒ—OTœ–ÌKÐVÛÊÍŒ—OTœ–ÌWKÐVÛÊÍŒ—OMM‹ÐVÛÊÍLŒ—OY˜›ØÚÜÎÝ˜\ˆOY˜][YK™Ù][YJ
KÏY›][YK™Ù][YJ
KY˜Ý[YK™Ù][YJ
NÜ™]\›ˆœVÓX]™›ÛÜŠKÌYLÊOŒ
OSX]™›ÛÜŠKÌYLÊK
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛÊÍMŒ—OTœ–ÌKÐVÛÊÍŒŒ—OTœ–ÌWKXVÛÊÍŒ—O[ILYLÊŒYLËœVÓX]™›ÛÜŠËÌYLÊOŒ
OSX]™›ÛÜŠËÌYLÊK
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛÊÍÌŒ—OTœ–ÌKÐVÛÊÍÍŒ—OTœ–ÌWKXVÛÊÎŒ—OPÉLYLÊŒYLËœVÓX]™›ÛÜŠ‹ÌYLÊOŒ
OSX]™›ÛÜŠ‹ÌYLÊK
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛÊÎŒ—OTœ–ÌKÐVÛÊÎLŒ—OTœ–ÌWKXVÛÊÎMŒ—OX‰LYLÊŒYLËœVÙš[›ÏŒ
OYš[›Ë
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛÊÌLŒ—OTœ–ÌKÐVÛÊÌLŒ—OTœ–ÌWKKÓ\Þ[˜Î™[˜Ý[ÛŠËKËJ^ÚYŠ]Kš\Ñš[JK››ÙK›[ÙJJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠÊNÚYŠ‰™
\™]\›ˆÝ˜\ˆÏXÛ‹œÛXÙJËÊÛÊNÝK›\Þ[˜ÊKËKË
_K˜\˜\™ÜÎ›ÚYÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆ\‹˜\˜\™ÜÊÏMÐVÞ\‹˜\˜\™ÜËMŒ—_KÙ]ÝŽ™[˜Ý[ÛŠÊ^Ü™]\›ˆ[ŠÊ_KÙ]Ý™X[Qœ›ÛQ‘™[˜Ý[ÛŠÊ^Ý˜\ˆO]K™Ù]Ý™X[JÊNÚYŠZJ]›ÝÈ™]ÈK‘\œ››Ñ\œ›ÜŠ
NÜ™]\›ˆ__K^ßNÙ[˜Ý[Ûˆ[Š
^ÚYŠ\[‹œÝš[™ÜÊ^Ý˜\ˆÏ^ÕTÑTŽˆÙX—Ý\Ù\ˆ‹ÑÓSQNˆÙX—Ý\Ù\ˆ‹Uˆ‹È‹Ñˆ‹È‹ÓQNˆ‹ÚÛYKÝÙX—Ý\Ù\ˆ‹S‘ÎŠ\[Ùˆ˜]šYØ]ÜOH›Øš™XÝ‰‰›˜]šYØ]Ü‹›[™ÝXYÙ\É‰›˜]šYØ]Ü‹›[™ÝXYÙ\ÖÌ_ÈŠKœ™\XÙJ‹H‹—ÈŠJÈ‹•U‹N‹Î–ŒŸ‹‹Ý\Ëœ›ÙÜ˜[HŸNÙ›ÜŠ˜\ˆH[ˆŠV–ÚWOOO]›ÚYÙ[]HÖÚWNœÖÚWOV–ÚWNÝ˜\ˆÏV×NÙ›ÜŠ˜\ˆH[ˆÊ[Ëœ\Ú
JÈHŠÜÖÚWJNÜ[‹œÝš[™ÜÏ[ß\™]\›ˆ[‹œÝš[™Üß]˜\ˆÌÏY[˜Ý[ÛŠËKË
^Üß
Ï]\ÊK\Ëœ\™[\Ë\Ë›[Ý[\Ë›[Ý[\Ë›[Ý[Y[[\ËšY]K›™^[›ÙJÊË\Ë›˜[YOZK\Ë›[ÙO[Ë\Ë››ÙWÛÜÏ^ßK\ËœÝ™X[WÛÜÏ^ßK\Ëœ™]YNÓØš™XÝ™Yš[™T›Ü\Y\ÊÌËœ›ÝÝ\KÜ™XYžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆJÍIŸ\Ë›[ÙJ_KÙ]™[˜Ý[ÛŠÊ^ÜÏÝ\Ë›[Ù_LÍN\Ë›[ÙIKLÍŸ_KÜš]NžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆJM‰Ÿ\Ë›[ÙJ_KÙ]™[˜Ý[ÛŠÊ^ÜÏÝ\Ë›[Ù_LMŽ\Ë›[ÙIKLMß_K\Ñ›Û\ŽžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆKš\Ñ\Š\Ë›[ÙJ__K\Ñ]šXÙNžÙÙ]™[˜Ý[ÛŠ
^Ü™]\›ˆKš\ÐÚ™]Š\Ë›[ÙJ___JKK‘”Ó›ÙOQÌËKœÝ]XÒ[š]

K™K‘”×ØÜ™X]T]]K˜Ü™X]T]™K‘”×ØÜ™X]Q]Qš[O]K˜Ü™X]Q]Qš[K™K‘”×Ý[›[šÏ]K[›[šË™K‘”×ØÜ™X]S^žQš[O]K˜Ü™X]S^žQš[K™K‘”×ØÜ™X]Q]šXÙO]K˜Ü™X]Q]šXÙNÝ˜\ˆÏ^ÙÎ™[˜Ý[ÛŠËKË
^×ÛÊ\ÜÙ\[Ûˆ˜Z[YˆŠÝ[ŠÊJÈ‹]ˆŠÖÚOÝ[ŠJNˆ[šÛ›ÝÛˆš[[˜[YH‹ËÝ[Š
Nˆ[šÛ›ÝÛˆ[˜Ý[Ûˆ—J_KN™[˜Ý[ÛŠËKÊ^Ý›ÝÈ™]ÈÊÊKš[š]
KÊKßK™[˜Ý[ÛŠËKÊ^Þ\‹˜\˜\™ÜÏ[ÎÝž^Ý˜\ˆ^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊNÜÝÚ]Ú
J^ØØ\ÙHœ™]\›ŠO^\‹™Ù]

JOËLŽK˜Ü™X]TÝ™X[JJK™™ØØ\ÙHN˜Ø\ÙHŽ˜Ø\ÙHŽ˜Ø\ÙHÎœ™]\›ˆØØ\ÙHÎœ™]\›ˆ™›YÜÎØØ\ÙH˜\ˆO^\‹™Ù]

NÜ™]\›ˆ™›YÜß[KØØ\ÙHNœ™]\›ˆO^\‹™Ù]

KŒÛJÌŒWOL‹ØØ\ÙHMŽ˜Ø\ÙH™Y˜][œ™]\›‹LŽØØ\ÙHNœ™]\›ˆÏLŽÐVÕÎ

OŒ—OPËL__XØ]Ú
Š^ÚYŠOOO]›ÚYJˆ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈŽÜ™]\›‹X‹™\œ››ß]˜\ˆßKN™[˜Ý[ÛŠËKÊ^Ýž^Ý˜\ˆ^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊNÙ™Ù][ß
™Ù][Ï]Kœ™XY\Šœ]
JNÙ›ÜŠ˜\ˆOLŽÏL]K›ÙYZÊJKÏSX]™›ÛÜŠ‹ÛJNÝÏ™Ù][Ë›[™Ý	‰ÊÛO[ÎÊ^Ý˜\ˆKY™Ù][ÖÝ×NÚYŠOOH‹ˆŠSOY››ÙKšYMÙ[ÙHYŠOOH‹‹ˆŠSO]K›ÛÚÝ\]
œ]Ü\™[ˆLJK››ÙKšYMÙ[Ù^Ý˜\ˆÏ]K›ÛÚÝ\›ÙJ››ÙK
NÓOWËšY]Kš\ÐÚ™]ŠË›[ÙJOÌŽKš\Ñ\ŠË›[ÙJOÍKš\Ó[šÊË›[ÙJOÌLŽTœVÓOŒ
OSK
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÚJÐÏŒ—OTœ–ÌKÐVÚJÐÊÍŒ—OTœ–ÌWKœVÊÊÌJJ›OŒ
OJÊÌJJ›K
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÚJÐÊÎŒ—OTœ–ÌKÐVÚJÐÊÌLŒ—OTœ–ÌWKŒÚJÐÊÌMŒWOLŽXVÚJÐÊÌNO^ŒŠÛ‹JÐÊÌNKMŠKÊÏ[KÊÏL_\™]\›ˆK›ÙYZÊÊ›K
KßXØ]Ú
Š^ÚYŠOOO]›ÚYJˆ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈŽÜ™]\›‹]‹™\œ››ß_K™[˜Ý[ÛŠËKÊ^Þ\‹˜\˜\™ÜÏ[ÎÝž^Ý˜\ˆ^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊNÜÝÚ]Ú
J^ØØ\ÙHŒMLN˜Ø\ÙHŒMLN˜Ø\ÙHŒMLL˜Ø\ÙHŒMLLN˜Ø\ÙHŒMLLŽ˜Ø\ÙHŒMLŽ˜Ø\ÙHŒMLÎ˜Ø\ÙHŒML˜Ø\ÙHŒMLŒÎ˜Ø\ÙHŒMLœ™]\›ˆOÌ‹MNNØØ\ÙHŒMLNNšYŠYJ\™]\›‹MNNÝ˜\ˆO^\‹™Ù]

NÜ™]\›ˆÐVÛOŒ—OLØØ\ÙHŒMLŒœ™]\›ˆOËLŽ‹MNNØØ\ÙHŒMLÌNœ™]\›ˆO^\‹™Ù]

KKš[ØÝ
KJNÙY˜][œ™]\›‹LŽ_XØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›‹PË™\œ››ß_KN™[˜Ý[ÛŠËKË
^Þ\‹˜\˜\™ÜÏYÝž^ÚO^\‹™Ù]ÝŠJKO^\‹˜Ø[Ý[]P]
ËJNÝ˜\ˆOYÞ\‹™Ù]

NŒÜ™]\›ˆK›Ü[ŠKËJK™™XØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›‹PË™\œ››ß_KÎ™[˜Ý[ÛŠÊ^Ýž^Ü™]\›ˆÏ^\‹™Ù]ÝŠÊKKœ›Y\ŠÊKXØ]Ú
J^ÚYŠOOO]›ÚYJH[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈNÜ™]\›‹ZK™\œ››ß_KŽ™[˜Ý[ÛŠËJ^Ýž^Ü™]\›ˆÏ^\‹™Ù]ÝŠÊK\‹™ÔÝ]
KœÝ]ËJ_XØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›‹[Ë™\œ››ß_K™[˜Ý[ÛŠËKÊ^Ýž^Ü™]\›ˆO^\‹™Ù]ÝŠJKO^\‹˜Ø[Ý[]P]
ËJKÏOOLÝK[›[šÊJN›ÏOOMLLÝKœ›Y\ŠJN—ÛÊ’[˜[Y›YÜÈ\ÜÙYÈ[›[šØ]ŠKXØ]Ú

^ÚYŠOOO]›ÚYJ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÜ™]\›‹Y™\œ››ß_KN™[˜Ý[ÛŠ
^Ü™]\›ˆLK™[˜Ý[ÛŠ
^×ÛÊˆŠ_KŽ™[˜Ý[ÛŠ
^Ü™]\›ˆ]K››ÝÊ
_KŽ™[˜Ý[ÛŠËKÊ^ØÛ‹˜ÛÜUÚ][ŠËKJÛÊ_KN™[˜Ý[ÛŠÊ^ØÛ‹›[™ÝÛÊ“ÓÓHŠ_KŽ™[˜Ý[ÛŠËJ^Ý˜\ˆÏLÜ™]\›ˆ[Š
K™›Ü‘XXÚ

[˜Ý[ÛŠJ^Ý˜\ˆÏZJÛÎÙXVÜÊÍ
›OŒ—OPË
[˜Ý[ÛŠ‹Ê^Ù›ÜŠ˜\ˆOLÓO‹›[™ÝÊÊÓJTXVÌÊÊ×OX‹˜Ú\ÛÙP]
JNÔXVÌ×OLJJÊKÊÏY›[™Ý
Ì_JJKKÎ™[˜Ý[ÛŠËJ^Ý˜\ˆÏ\[Š
NÙXVÜÏŒ—O[Ë›[™ÝÝ˜\ˆLÜ™]\›ˆË™›Ü‘XXÚ

[˜Ý[ÛŠJ^Ù
Ï[K›[™Ý
Ì_JJKXVÚOŒ—OYKŽ™[˜Ý[ÛŠÊ^Ýž^Ý˜\ˆO^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊNÜ™]\›ˆK˜ÛÜÙJJKXØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›ˆË™\œ››ß_K™[˜Ý[ÛŠËKË
^Ýž^Ý˜\ˆOJ[˜Ý[ÛŠË‹ËJ^Ù›ÜŠ˜\ˆLLÑÎÑ
ÊÊ^Ý˜\ˆÏYXVØŒ—KYXVØŠÍŒ—NØŠÏNÝ˜\ˆO]Kœ™XY
ËXKË‹JNÚYŠO
\™]\›‹LNÚYŠ
ÏTKOŠXœ™XZß\™]\›ˆJJ\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊKKÊNÜ™]\›ˆXVÙŒ—O[KXØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›ˆË™\œ››ß_KÎ™[˜Ý[ÛŠËKËJ^Ýž^Ý˜\ˆÏJO[ÊJÌŒMÌMLŒNMÌKHHJÏZJOÊÏŒ
JÍŽMMÌŽMŠ“N“˜SŽÚYŠ\Ó˜SŠÊJ\™]\›ˆŒNÝ˜\ˆ^\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊNÜ™]\›ˆK›ÙYZÊ‹Ë
KœVØ‹œÜÚ][ÛŒ
OX‹œÜÚ][Û‹
ÓX]˜XœÊJOLOÚOŒÊX]›Z[Š
ÓX]™›ÛÜŠKÍŽMMÌŽMŠKŽMMÌŽMJJOŒŸŸŠÓX]˜ÙZ[

KJÊŸšOŒ
JKÍŽMMÌŽMŠOŒŒ
WKÐVÛOŒ—OTœ–ÌKÐVÛJÍŒ—OTœ–ÌWK‹™Ù][É‰ÏOOL	‰™OOL	‰Š‹™Ù][Ï[[
KXØ]Ú

^ÚYŠOOO]›ÚYJ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÜ™]\›ˆ™\œ››ß]˜\ˆË_KÎ™[˜Ý[ÛŠËKË
^Ýž^Ý˜\ˆOJ[˜Ý[ÛŠË‹ËJ^Ù›ÜŠ˜\ˆLLÑÎÑ
ÊÊ^Ý˜\ˆÏYXVØŒ—KYXVØŠÍŒ—NØŠÏNÝ˜\ˆO]KÜš]JËXKË‹JNÚYŠO
\™]\›‹LNÞ
ÏT_\™]\›ˆJJ\‹™Ù]Ý™X[Qœ›ÛQ‘
ÊKKÊNÜ™]\›ˆXVÙŒ—O[KXØ]Ú
Ê^ÚYŠOOO]›ÚYJÈ[œÝ[˜Ù[ÙˆK‘\œ››Ñ\œ›ÜŠJ]›ÝÈÎÜ™]\›ˆË™\œ››ß_KN–NÊ[˜Ý[ÛŠ
^Ý˜\ˆËO^ØN•ßNÙ[˜Ý[ÛˆÊKÊ^Ý˜\ˆ[K™^ÜÎÛ™K˜\ÛOX‹™K˜\ÛKXKŒÊ™K˜\ÛKŠKŒÊ
_Y[˜Ý[Ûˆ
J^ÛÊKš[œÝ[˜ÙJ_ZYŠŒÊ
K™Kš[œÝ[X]UØ\ÛJ]ž^Ü™]\›ˆ™Kš[œÝ[X]UØ\ÛJKÊ_XØ]Ú
J^Ü™]\›ˆÛŠ“[Ù[Kš[œÝ[X]UØ\ÛHØ[˜XÚÈ˜Z[YÚ]\œ›ÜŽˆŠÛJKL_\ÏY
\Þ[˜È[˜Ý[ÛŠ
^Ü™]\›–×_JJ
K[Š
[˜Ý[ÛŠJ^Ü™]\›ˆ›‹š[œÝ[X]JKJ_JJK[Š
[˜Ý[ÛŠJ^Ü™]\›ˆ_JJK[ŠË
[˜Ý[ÛŠJ^ÙÛŠ™˜Z[YÈ\Þ[˜Ú›Û›Ý\ÛH™\\™HØ\ÛNˆŠÛJKÛÊJ_JJ_JJ
K™K—××ÝØ\ÛWØØ[ØÝÜœÏY[˜Ý[ÛŠ
^Ü™]\›Š™K—××ÝØ\ÛWØØ[ØÝÜœÏ[™K˜\ÛKŠK˜\J[\™Ý[Y[Ê_NÝ˜\ˆLÏ[™K—Ù[\ØÜš\[—Øš[™Õ›ÚY—××Ù\Ý›ÞW××ÌY[˜Ý[ÛŠ
^Ü™]\›ŠLÏ[™K—Ù[\ØÜš\[—Øš[™Õ›ÚY—××Ù\Ý›ÞW××Ì[™K˜\ÛKÊK˜\J[\™Ý[Y[Ê_KÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Û˜[YWÌY[˜Ý[ÛŠ
^Ü™]\›ŠÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Û˜[YWÌ[™K˜\ÛKž
K˜\J[\™Ý[Y[Ê_KLÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]Û˜[YWÌOY[˜Ý[ÛŠ
^Ü™]\›ŠLÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]Û˜[YWÌO[™K˜\ÛKžJK˜\J[\™Ý[Y[Ê_KÌÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Û[™ÝXYÙ\×ÌOY[˜Ý[ÛŠ
^Ü™]\›ŠÌÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Û[™ÝXYÙ\×ÌO[™K˜\ÛKžŠK˜\J[\™Ý[Y[Ê_KÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÚY[YšY\—ÌY[˜Ý[ÛŠ
^Ü™]\›ŠÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÚY[YšY\—Ì[™K˜\ÛKJK˜\J[\™Ý[Y[Ê_KŒÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÚY[YšY\—ÌOY[˜Ý[ÛŠ
^Ü™]\›ŠŒÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÚY[YšY\—ÌO[™K˜\ÛKŠK˜\J[\™Ý[Y[Ê_KŒÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÙÙ[™\—ÌY[˜Ý[ÛŠ
^Ü™]\›ŠŒÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÙÙ[™\—Ì[™K˜\ÛKÊK˜\J[\™Ý[Y[Ê_KLÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÙÙ[™\—ÌOY[˜Ý[ÛŠ
^Ü™]\›ŠLÏ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÙÙ[™\—ÌO[™K˜\ÛK‘
K˜\J[\™Ý[Y[Ê_K	Ï[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ØYÙWÌY[˜Ý[ÛŠ
^Ü™]\›Š	Ï[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ØYÙWÌ[™K˜\ÛK‘JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ØYÙWÌOY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ØYÙWÌO[™K˜\ÛK‘ŠK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Ý˜\šX[ÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]Ý˜\šX[Ì[™K˜\ÛK‘ÊK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]Ý˜\šX[ÌOY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]Ý˜\šX[ÌO[™K˜\ÛK’
K˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÞWÌY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÞWÌ[™K˜\ÛK’JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÞWÌOY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÞWÌO[™K˜\ÛK’ŠK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÜØÛÜ™WÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÜØÛÜ™WÌ[™K˜\ÛK’ÊK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÜØÛÜ™WÌOY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÜØÛÜ™WÌO[™K˜\ÛK“
K˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÜÜ\™WÌY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÙÙ]ÜÜ\™WÌ[™K˜\ÛK“JK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÜÜ\™WÌOY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑWÜÙ]ÜÜ\™WÌO[™K˜\ÛK“ŠK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑW××Ù\Ý›ÞW××ÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×Õ“ÒPÑW××Ù\Ý›ÞW××Ì[™K˜\ÛK“ÊK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý\WÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý\WÌ[™K˜\ÛK”
K˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý[š\]YWÚY[YšY\—ÌY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý[š\]YWÚY[YšY\—Ì[™K˜\ÛK”JK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý^ÜÜÚ][Û—ÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý^ÜÜÚ][Û—Ì[™K˜\ÛK”ŠK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Û[™ÝÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Û[™ÝÌ[™K˜\ÛK”ÊK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ø]Y[×ÜÜÚ][Û—ÌY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ø]Y[×ÜÜÚ][Û—Ì[™K˜\ÛK•
K˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]ÜØ[\WÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]ÜØ[\WÌ[™K˜\ÛK•JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý\Ù\—Ù]WÌY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•ÙÙ]Ý\Ù\—Ù]WÌ[™K˜\ÛK•ŠK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•××Ù\Ý›ÞW××ÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™Ù\ÜXZ×ÑU‘S•××Ù\Ý›ÞW××Ì[™K˜\ÛK•ÊK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙTÜXZÓ‘ÕÛÜšÙ\—ÌY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙTÜXZÓ‘ÕÛÜšÙ\—Ì[™K˜\ÛK–
K˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÞ[×ÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÞ[×Ì[™K˜\ÛK–JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÞ[Ú\W×ÌY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÞ[Ú\W×Ì[™K˜\ÛK–ŠK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ú^™SÙ‘]™[ÝXÝ×ÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ú^™SÙ‘]™[ÝXÝ×Ì[™K˜\ÛK—ÊK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÌ[™K˜\ÛK‰
K˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÌÏY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÌÏ[™K˜\ÛK˜XJK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÍY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÍ[™K˜\ÛK˜˜JK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÍOY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙWÍO[™K˜\ÛK˜ØJK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ý›ÚXÙ\×ÌOY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ý›ÚXÙ\×ÌO[™K˜\ÛK™JK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙ\×ÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ý›ÚXÙ\×Ì[™K˜\ÛK™XJK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]ÜØ[\\˜]WÌY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]ÜØ[\\˜]WÌ[™K˜\ÛK™˜JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ü˜]WÌY[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ü˜]WÌ[™K˜\ÛK™ØJK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ü˜]WÌOY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ü˜]WÌO[™K˜\ÛKšJK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ü]ÚÌY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÙÙ]Ü]ÚÌ[™K˜\ÛKšXJK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ü]ÚÌOY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—ÜÙ]Ü]ÚÌO[™K˜\ÛKš˜JK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—××Ù\Ý›ÞW××ÌY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Øš[™ÙTÜXZÓ‘ÕÛÜšÙ\—××Ù\Ý›ÞW××Ì[™K˜\ÛKšØJK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓTÕÕT“RSUQY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓTÕÕT“RSUQ[™K˜\ÛK›JK˜\J[\™Ý[Y[Ê_KN[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÕÓÔ‘Y[˜Ý[ÛŠ
^Ü™]\›ŠN[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÕÓÔ‘[™K˜\ÛK›XJK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÑS•SÑOY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÑS•SÑO[™K˜\ÛK›˜JK˜\J[\™Ý[Y[Ê_KÎ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓPT’ÏY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓPT’Ï[™K˜\ÛK›ØJK˜\J[\™Ý[Y[Ê_K[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔVOY[˜Ý[ÛŠ
^Ü™]\›Š[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔVO[™K˜\ÛKœJK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÑS‘Y[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÑS‘[™K˜\ÛKœXJK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓTÑ×ÕT“RSUQY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÓTÑ×ÕT“RSUQ[™K˜\ÛKœ˜JK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÓ‘SQOY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÓ‘SQO[™K˜\ÛKœØJK˜\J[\™Ý[Y[Ê_KŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÐSTTUOY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—Ù[\ØÜš\[—Ù[[WÙ\ÜXZ×ÑU‘S•ÕTWÙ\ÜXZÑU‘S•ÔÐSTTUO[™K˜\ÛKJK˜\J[\™Ý[Y[Ê_KÎ[™K—××Ù\œ››×ÛØØ][ÛY[˜Ý[ÛŠ
^Ü™]\›ŠÎ[™K—××Ù\œ››×ÛØØ][Û[™K˜\ÛK˜JK˜\J[\™Ý[Y[Ê_NÛ™K—Ùœ™YOY[˜Ý[ÛŠ
^Ü™]\›Š™K—Ùœ™YO[™K˜\ÛKØJK˜\J[\™Ý[Y[Ê_K™K—ÛX[ØÏY[˜Ý[ÛŠ
^Ü™]\›Š™K—ÛX[ØÏ[™K˜\ÛKžJK˜\J[\™Ý[Y[Ê_NÝ˜\ˆLŽ[™K—××ØÞWÚ\×ÜÚ[\—Ý\OY[˜Ý[ÛŠ
^Ü™]\›ŠŽ[™K—××ØÞWÚ\×ÜÚ[\—Ý\O[™K˜\ÛKžXJK˜\J[\™Ý[Y[Ê_NÙ[˜Ý[ÛˆN
Ê^Ù[˜Ý[ÛˆJ
^ÜL
LHL™K˜Ø[Y[HLŒß
ŒÏHL™K››Ñ”Ò[š]Kš[š]š[š]X[^™YKš[š]

KKšYÛ›Ü™T\›Z\ÜÚ[ÛœÏHLKÌŠÊK™K›Û”[[YR[š]X[^™Y	‰›™K›Û”[[YR[š]X[^™Y

K
[˜Ý[ÛŠ
^ÚYŠ™KœÜÝ[ŠY›ÜŠ\[Ùˆ™KœÜÝ[OH™[˜Ý[Ûˆ‰‰Š™KœÜÝ[VÛ™KœÜÝ[—JNÛ™KœÜÝ[‹›[™ÝÊ[Ï[™KœÜÝ[‹œÚY

KË[œÚY
ÊNÝ˜\ˆÎÒÌŠÊ_JJ
JJ_TÚOŒ

[˜Ý[ÛŠ
^ÚYŠ™Kœ™T[ŠY›ÜŠ\[Ùˆ™Kœ™T[OH™[˜Ý[Ûˆ‰‰Š™Kœ™T[VÛ™Kœ™T[—JNÛ™Kœ™T[‹›[™ÝÊ[Ï[™Kœ™T[‹œÚY

KË[œÚY
ÊNÝ˜\ˆÎÒÌŠÊ_JJ
KÚOŒ
™KœÙ]Ý]\ÏÊ™KœÙ]Ý]\Ê”[›š[™Ë‹‹ˆŠKÙ][Y[Ý]

[˜Ý[ÛŠ
^ÜÙ][Y[Ý]

[˜Ý[ÛŠ
^Û™KœÙ]Ý]\ÊˆŠ_JKJKJ
_JKJJNšJ
JJ_ZYŠ™K—××ÜÝ\Ù[WÚœÏLLÌÌ™K—××ÜÝÜÙ[WÚœÏLLÌŽŒ‹™K˜Y[‘\[™[˜ÞOTŒË™Kœ™[[Ý™T[‘\[™[˜ÞOZŒË™K‘”×ØÜ™X]T]]K˜Ü™X]T]™K‘”×ØÜ™X]Q]Qš[O]K˜Ü™X]Q]Qš[K™K‘”×ØÜ™X]S^žQš[O]K˜Ü™X]S^žQš[K™K‘”×ØÜ™X]Q]šXÙO]K˜Ü™X]Q]šXÙK™K‘”×Ý[›[šÏ]K[›[šË›Y[˜Ý[ÛˆÊ
^ÜLN

KL
›\Ê_K™Kœ™R[š]
Y›ÜŠ\[Ùˆ™Kœ™R[š]OH™[˜Ý[Ûˆ‰‰Š™Kœ™R[š]VÛ™Kœ™R[š]JNÛ™Kœ™R[š]›[™ÝŒÊ[™Kœ™R[š]œÜ

J
NÙ[˜Ý[ÛˆXJ
^ßY[˜Ý[Ûˆ	
Ê^Ü™]\›ŠßXJK—×ØØXÚW×ßY[˜Ý[ÛˆŠËJ^Ý˜\ˆÏI
JK[ÖÜ×NÜ™]\›ˆ

SØš™XÝ˜Ü™X]J
_XJKœ›ÝÝ\JJKœ\ËÖÜ×OY
_VN

KXKœ›ÝÝ\OSØš™XÝ˜Ü™X]JXKœ›ÝÝ\JKXKœ›ÝÝ\K˜ÛÛœÝXÝÜ\XKXKœ›ÝÝ\K—×ØÛ\Ü××Ï\XKXK—×ØØXÚW×Ï^ßK™K•Ü˜\\“Øš™XÝ\XK™K™Ù]ØXÚOI™KÜ˜\Ú[\Y‹™K˜Ø\ÝØš™XÝY[˜Ý[ÛŠËJ^Ü™]\›ˆŠËœ‹J_K™K“•SYŠ
K™K™\Ý›ÞOY[˜Ý[ÛŠÊ^ÚYŠ\Ë—×Ù\Ý›ÞW×Ê]›ÝÈ‘\œ›ÜŽˆØ[››Ý\Ý›ÞHØš™XÝˆ
Y[ÝHÜ™X]H][Ý\œÙ[ÊHŽÜË—×Ù\Ý›ÞW×Ê
K[]H	
Ë—×ØÛ\Ü××ÊVÜËœ—_K™K˜ÛÛ\\™OY[˜Ý[ÛŠËJ^Ü™]\›ˆËœOOZKœŸK™K™Ù]Ú[\Y[˜Ý[ÛŠÊ^Ü™]\›ˆËœŸK™K™Ù]Û\ÜÏY[˜Ý[ÛŠÊ^Ü™]\›ˆË—×ØÛ\Ü××ßNÝ˜\ˆÜ^ØY™™\ŽŒÚ^™NŒÜÎŒ[\Î–×K™YYYŒ™\\™N™[˜Ý[ÛŠ
^ÚYŠÜ‹›™YYY
^Ù›ÜŠ˜\ˆÏLÜÏÜ‹[\Ë›[™ÝÜÊÊÊ[™K—Ùœ™YJÜ‹[\ÖÜ×JNÜÜ‹[\Ë›[™ÝL™K—Ùœ™YJÜ‹˜Y™™\ŠKÜ‹˜Y™™\LÜ‹œÚ^™JÏ\Ü‹›™YYYÜ‹›™YYYL\Ü‹˜Y™™\Ÿ
Ü‹œÚ^™JÏLLŽÜ‹˜Y™™\[™K—ÛX[ØÊÜ‹œÚ^™JKŠÜ‹˜Y™™\ŠJKÜ‹œÜÏLK[ØÎ™[˜Ý[ÛŠËJ^ÒŠÜ‹˜Y™™\ŠNÝ˜\ˆËZK–UT×ÔT—ÑSSQS•O\Ë›[™Ý
™Ü™]\›ˆO[JÍÉ‹NÜ‹œÜÊÛO\Ü‹œÚ^™OÊŠOŒ
KÜ‹›™YYY
Ï[KÏ[™K—ÛX[ØÊJKÜ‹[\Ëœ\Ú
ÊJNŠÏ\Ü‹˜Y™™\ŠÜÜ‹œÜËÜ‹œÜÊÏ[JKßKÛÜN™[˜Ý[ÛŠËKÊ^ÜÝÚ]Ú
ÏLK–UT×ÔT—ÑSSQS•
^ØØ\ÙHŽ›ÏLNØœ™XZÎØØ\ÙH›ÏLŽØœ™XZÎØØ\ÙH›ÏLßY›ÜŠ˜\ˆLÙË›[™ÝÙ
ÊÊZVÛÊÙO\ÖÙ__NÙ[˜Ý[ÛˆšJÊ^ÚYŠ\[ÙˆÏOHœÝš[™ÈŠ^Ý˜\ˆOUÌÊÊKÏ\Ü‹˜[ØÊKXJNÜ™]\›ˆÜ‹˜ÛÜJKXKÊKß\™]\›ˆßY[˜Ý[Ûˆ[Ê
^Ý›ÝÈ˜Ø[››ÝÛÛœÝXÝH›ÚY‹›ÈÛÛœÝXÝÜˆ[ˆQŸY[˜Ý[Ûˆ]

^Ý›ÝÈ˜Ø[››ÝÛÛœÝXÝH\ÜXZ×Õ“ÒPÑK›ÈÛÛœÝXÝÜˆ[ˆQŸY[˜Ý[ÛˆÐJ
^Ý›ÝÈ˜Ø[››ÝÛÛœÝXÝH\ÜXZ×ÑU‘S•›ÈÛÛœÝXÝÜˆ[ˆQŸY[˜Ý[ÛˆPJ
^Ý\ËœXŽ

K	
PJVÝ\Ëœ—O]\ßQ[Ëœ›ÝÝ\OSØš™XÝ˜Ü™X]JXKœ›ÝÝ\JK[Ëœ›ÝÝ\K˜ÛÛœÝXÝÜQ[Ë[Ëœ›ÝÝ\K—×ØÛ\Ü××ÏQ[Ë[Ë—×ØØXÚW×Ï^ßK™K•›ÚYQ[Ë[Ëœ›ÝÝ\K—×Ù\Ý›ÞW×ÏQ[Ëœ›ÝÝ\K—×Ù\Ý›ÞW×ÏY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÖLÊÊ_K]œ›ÝÝ\OSØš™XÝ˜Ü™X]JXKœ›ÝÝ\JK]œ›ÝÝ\K˜ÛÛœÝXÝÜV]]œ›ÝÝ\K—×ØÛ\Ü××ÏV]]—×ØØXÚW×Ï^ßK™K™\ÜXZ×Õ“ÒPÑOV]]œ›ÝÝ\K™Ù]Û˜[YOV]œ›ÝÝ\K™Ù]Û˜[YOY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ[ŠÊÊJ_K]œ›ÝÝ\KœÙ]Û˜[YOV]œ›ÝÝ\KœÙ]Û˜[YOY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÜ‹œ™\\™J
KÏ\É‰\[ÙˆÏOH›Øš™XÝÜËœŽ‘šJÊKLÊKÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\K›˜[YH‹ÙÙ]–]œ›ÝÝ\K™Ù]Û˜[YKÙ]–]œ›ÝÝ\KœÙ]Û˜[Y_JK]œ›ÝÝ\K™Ù]Û[™ÝXYÙ\ÏV]œ›ÝÝ\K™Ù]Û[™ÝXYÙ\ÏY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜ™]\›ˆÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKÌÊKÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\K›[™ÝXYÙ\È‹ÙÙ]–]œ›ÝÝ\K™Ù]Û[™ÝXYÙ\ßJK]œ›ÝÝ\K™Ù]ÚY[YšY\V]œ›ÝÝ\K™Ù]ÚY[YšY\Y[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ[ŠÊÊJ_K]œ›ÝÝ\KœÙ]ÚY[YšY\V]œ›ÝÝ\KœÙ]ÚY[YšY\Y[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÜ‹œ™\\™J
KÏ\É‰\[ÙˆÏOH›Øš™XÝÜËœŽ‘šJÊKŒÊKÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\KšY[YšY\ˆ‹ÙÙ]–]œ›ÝÝ\K™Ù]ÚY[YšY\‹Ù]–]œ›ÝÝ\KœÙ]ÚY[YšY\ŸJK]œ›ÝÝ\K™Ù]ÙÙ[™\V]œ›ÝÝ\K™Ù]ÙÙ[™\Y[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆŒÊÊ_K]œ›ÝÝ\KœÙ]ÙÙ[™\V]œ›ÝÝ\KœÙ]ÙÙ[™\Y[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKLÊKÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\K™Ù[™\ˆ‹ÙÙ]–]œ›ÝÝ\K™Ù]ÙÙ[™\‹Ù]–]œ›ÝÝ\KœÙ]ÙÙ[™\ŸJK]œ›ÝÝ\K™Ù]ØYÙOV]œ›ÝÝ\K™Ù]ØYÙOY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ	ÊÊ_K]œ›ÝÝ\KœÙ]ØYÙOV]œ›ÝÝ\KœÙ]ØYÙOY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKN
KÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\K˜YÙH‹ÙÙ]–]œ›ÝÝ\K™Ù]ØYÙKÙ]–]œ›ÝÝ\KœÙ]ØYÙ_JK]œ›ÝÝ\K™Ù]Ý˜\šX[V]œ›ÝÝ\K™Ù]Ý˜\šX[Y[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ
Ê_K]œ›ÝÝ\KœÙ]Ý˜\šX[V]œ›ÝÝ\KœÙ]Ý˜\šX[Y[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKN
KÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\K˜\šX[‹ÙÙ]–]œ›ÝÝ\K™Ù]Ý˜\šX[Ù]–]œ›ÝÝ\KœÙ]Ý˜\šX[JK]œ›ÝÝ\K™Ù]ÞOV]œ›ÝÝ\K™Ù]ÞOY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆŽ
Ê_K]œ›ÝÝ\KœÙ]ÞOV]œ›ÝÝ\KœÙ]ÞOY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKN
KÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\KžH‹ÙÙ]–]œ›ÝÝ\K™Ù]ÞKÙ]–]œ›ÝÝ\KœÙ]Þ_JK]œ›ÝÝ\K™Ù]ÜØÛÜ™OV]œ›ÝÝ\K™Ù]ÜØÛÜ™OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÎ
Ê_K]œ›ÝÝ\KœÙ]ÜØÛÜ™OV]œ›ÝÝ\KœÙ]ÜØÛÜ™OY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKÎ
KÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\KœØÛÜ™H‹ÙÙ]–]œ›ÝÝ\K™Ù]ÜØÛÜ™KÙ]–]œ›ÝÝ\KœÙ]ÜØÛÜ™_JK]œ›ÝÝ\K™Ù]ÜÜ\™OV]œ›ÝÝ\K™Ù]ÜÜ\™OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆN
Ê_K]œ›ÝÝ\KœÙ]ÜÜ\™OV]œ›ÝÝ\KœÙ]ÜÜ\™OY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKŽ
KÊ_KØš™XÝ™Yš[™T›Ü\J]œ›ÝÝ\KœÜ\™H‹ÙÙ]–]œ›ÝÝ\K™Ù]ÜÜ\™KÙ]–]œ›ÝÝ\KœÙ]ÜÜ\™_JK]œ›ÝÝ\K—×Ù\Ý›ÞW×ÏV]œ›ÝÝ\K—×Ù\Ý›ÞW×ÏY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÛ
Ê_KÐKœ›ÝÝ\OSØš™XÝ˜Ü™X]JXKœ›ÝÝ\JKÐKœ›ÝÝ\K˜ÛÛœÝXÝÜQÐKÐKœ›ÝÝ\K—×ØÛ\Ü××ÏQÐKÐK—×ØØXÚW×Ï^ßK™K™\ÜXZ×ÑU‘S•QÐKÐKœ›ÝÝ\K™Ù]Ý\OQÐKœ›ÝÝ\K™Ù]Ý\OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÎ
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K\H‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Ý\_JKÐKœ›ÝÝ\K™Ù]Ý[š\]YWÚY[YšY\QÐKœ›ÝÝ\K™Ù]Ý[š\]YWÚY[YšY\Y[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆN
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K[š\]YWÚY[YšY\ˆ‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Ý[š\]YWÚY[YšY\ŸJKÐKœ›ÝÝ\K™Ù]Ý^ÜÜÚ][ÛQÐKœ›ÝÝ\K™Ù]Ý^ÜÜÚ][ÛY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K^ÜÜÚ][Ûˆ‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Ý^ÜÜÚ][ÛŸJKÐKœ›ÝÝ\K™Ù]Û[™ÝQÐKœ›ÝÝ\K™Ù]Û[™ÝY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÎ
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K›[™Ý‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Û[™ÝJKÐKœ›ÝÝ\K™Ù]Ø]Y[×ÜÜÚ][ÛQÐKœ›ÝÝ\K™Ù]Ø]Y[×ÜÜÚ][ÛY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆŽ
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K˜]Y[×ÜÜÚ][Ûˆ‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Ø]Y[×ÜÜÚ][ÛŸJKÐKœ›ÝÝ\K™Ù]ÜØ[\OQÐKœ›ÝÝ\K™Ù]ÜØ[\OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\KœØ[\H‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]ÜØ[\_JKÐKœ›ÝÝ\K™Ù]Ý\Ù\—Ù]OQÐKœ›ÝÝ\K™Ù]Ý\Ù\—Ù]OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆN
Ê_KØš™XÝ™Yš[™T›Ü\JÐKœ›ÝÝ\K\Ù\—Ù]H‹ÙÙ]‘ÐKœ›ÝÝ\K™Ù]Ý\Ù\—Ù]_JKÐKœ›ÝÝ\K—×Ù\Ý›ÞW×ÏQÐKœ›ÝÝ\K—×Ù\Ý›ÞW×ÏY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÚ
Ê_KPKœ›ÝÝ\OSØš™XÝ˜Ü™X]JXKœ›ÝÝ\JKPKœ›ÝÝ\K˜ÛÛœÝXÝÜSPKPKœ›ÝÝ\K—×ØÛ\Ü××ÏSPKPK—×ØØXÚW×Ï^ßK™K™TÜXZÓ‘ÕÛÜšÙ\SPKPKœ›ÝÝ\KœÞ[ÏSPKœ›ÝÝ\KœÞ[ÏY[˜Ý[ÛŠËJ^Ý˜\ˆÏ]\ËœŽÜÜ‹œ™\\™J
KÏ\É‰\[ÙˆÏOH›Øš™XÝÜËœŽ‘šJÊKI‰\[ÙˆOOH›Øš™XÝ‰‰ŠOZKœŠKÎ
ËËJ_KPKœ›ÝÝ\KœÞ[Ú\WÏSPKœ›ÝÝ\KœÞ[Ú\WÏY[˜Ý[ÛŠËJ^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÜ‹œ™\\™J
KÏ\É‰\[ÙˆÏOH›Øš™XÝÜËœŽ‘šJÊKOZI‰\[ÙˆOOH›Øš™XÝÚKœŽ‘šJJKN
ËËJ_KPKœ›ÝÝ\K™Ù]Ú^™SÙ‘]™[ÝXÝÏSPKœ›ÝÝ\K™Ù]Ú^™SÙ‘]™[ÝXÝÏY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÎ
Ê_KPKœ›ÝÝ\KœÙ]Ý›ÚXÙOSPKœ›ÝÝ\KœÙ]Ý›ÚXÙOY[˜Ý[ÛŠËKËJ^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆÜ‹œ™\\™J
KÏ\É‰\[ÙˆÏOH›Øš™XÝÜËœŽ‘šJÊKOZI‰\[ÙˆOOH›Øš™XÝÚKœŽ‘šJJKÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ[ËœŠK	‰\[ÙˆOH›Øš™XÝ‰‰ŠYœŠKI‰\[ÙˆOOH›Øš™XÝ‰‰ŠO[KœŠKÏOO]›ÚYÚÎ
ËËJN™OO]›ÚYÓN
ËËKÊN›OOO]›ÚYÞ
ËËKË
NŽ
ËËKËJ_KPKœ›ÝÝ\K™Ù]Ý›ÚXÙ\ÏSPKœ›ÝÝ\K™Ù]Ý›ÚXÙ\ÏY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜ™]\›ˆÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKŠN
KÊK]
_KPKœ›ÝÝ\KœÙ]Ý›ÚXÙ\ÏSPKœ›ÝÝ\KœÙ]Ý›ÚXÙ\ÏY[˜Ý[ÛŠËJ^Ý˜\ˆÏ]\ËœŽÜÜ‹œ™\\™J
KÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠKI‰\[ÙˆOOH›Øš™XÝ‰‰ŠOZKœŠKÎ
ËËJ_KØš™XÝ™Yš[™T›Ü\JPKœ›ÝÝ\K›ÚXÙ\È‹ÙÙ]“PKœ›ÝÝ\K™Ù]Ý›ÚXÙ\ËÙ]“PKœ›ÝÝ\KœÙ]Ý›ÚXÙ\ßJKPKœ›ÝÝ\K™Ù]ÜØ[\\˜]OSPKœ›ÝÝ\K™Ù]ÜØ[\\˜]OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆŽ
Ê_KØš™XÝ™Yš[™T›Ü\JPKœ›ÝÝ\KœØ[\\˜]H‹ÙÙ]“PKœ›ÝÝ\K™Ù]ÜØ[\\˜]_JKPKœ›ÝÝ\K™Ù]Ü˜]OSPKœ›ÝÝ\K™Ù]Ü˜]OY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆN
Ê_KPKœ›ÝÝ\KœÙ]Ü˜]OSPKœ›ÝÝ\KœÙ]Ü˜]OY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠK
KÊ_KØš™XÝ™Yš[™T›Ü\JPKœ›ÝÝ\Kœ˜]H‹ÙÙ]“PKœ›ÝÝ\K™Ù]Ü˜]KÙ]“PKœ›ÝÝ\KœÙ]Ü˜]_JKPKœ›ÝÝ\K™Ù]Ü]ÚSPKœ›ÝÝ\K™Ù]Ü]ÚY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÜ™]\›ˆ
Ê_KPKœ›ÝÝ\KœÙ]Ü]ÚSPKœ›ÝÝ\KœÙ]Ü]ÚY[˜Ý[ÛŠÊ^Ý˜\ˆO]\ËœŽÜÉ‰\[ÙˆÏOH›Øš™XÝ‰‰ŠÏ\ËœŠK
KÊ_KØš™XÝ™Yš[™T›Ü\JPKœ›ÝÝ\Kœ]Ú‹ÙÙ]“PKœ›ÝÝ\K™Ù]Ü]ÚÙ]“PKœ›ÝÝ\KœÙ]Ü]ÚJKPKœ›ÝÝ\K—×Ù\Ý›ÞW×ÏSPKœ›ÝÝ\K—×Ù\Ý›ÞW×ÏY[˜Ý[ÛŠ
^Ý˜\ˆÏ]\ËœŽÑÎ
Ê_K
[˜Ý[ÛŠ
^Ù[˜Ý[ÛˆÊ
^Û™K™\ÜXZÑU‘S•ÓTÕÕT“RSUQQŽ

K™K™\ÜXZÑU‘S•ÕÓÔ‘TN

K™K™\ÜXZÑU‘S•ÔÑS•SÑOTÎ

K™K™\ÜXZÑU‘S•ÓPT’ÏSÎ

K™K™\ÜXZÑU‘S•ÔVOS

K™K™\ÜXZÑU‘S•ÑS‘SŽ

K™K™\ÜXZÑU‘S•ÓTÑ×ÕT“RSUQ^Ž

K™K™\ÜXZÑU‘S•ÔÓ‘SQOTŽ

K™K™\ÜXZÑU‘S•ÔÐSTTUOZŽ

_SŒÏÜÊ
NžŒÊÊ_JJ
KPKœ›ÝÝ\K›\ÝÝ›ÚXÙ\ÏY[˜Ý[ÛŠ
^Ù›ÜŠ˜\ˆËOV×KÏ]\Ë™Ù]Ý›ÚXÙ\ÊÏL
NÛËœˆOLÛÏ]\Ë™Ù]Ý›ÚXÙ\Ê
ÊÜÊJ^Û]ÏY[˜Ý[ÛŠJ^Ù›ÜŠ˜\ˆHˆ‹SKÏ[Ë™Ù]Û[™ÝXYÙ\Ê
ÊÊN×ÈOLÊ^
ÏTÝš[™Ë™œ›ÛPÚ\ÛÙJÊKÏ[Ë™Ù]Û[™ÝXYÙ\Ê
ÊÊNÜ™]\›ˆNÙ›ÜŠ˜\ˆ^Û˜[YN›Ë™Ù]Û˜[YJ
KY[YšY\Ž›Ë™Ù]ÚY[YšY\Š
K[™ÝXYÙ\Î–×_KOLÏ[Ë™Ù]Û[™ÝXYÙ\ÊJNÐÈOLÊ^Ý˜\ˆ^Üš[Üš]NË˜[YNÊ
ÊÛJ_NÙ›[™ÝXYÙ\Ëœ\Ú
ŠKJÏX‹›˜[YK›[™Ý
ÌKÏ[Ë™Ù]Û[™ÝXYÙ\ÊJ_ZKœ\Ú

_\™]\›ˆ_NÝ˜\ˆÏVÈ›\ÝÝ\›Z[˜]Y‹ÛÜ™‹œÙ[[˜ÙH‹›X\šÈ‹œ^H‹™[™‹›\Ù×Ý\›Z[˜]Y‹œÛ™[YH‹œØ[\\˜]H—NÓPKœ›ÝÝ\KœÞ[\Ú^™OY[˜Ý[ÛŠËJ^Ý˜\ˆÏ]\Ë™Ù]Ú^™SÙ‘]™[ÝXÝÊ
KXY[˜Ý[ÛŠ
[˜Ý[ÛŠKËŠ^Ù›ÜŠ˜\ˆÏ[™]È›Ø]Ì\œ˜^JŠÊKOLÓOÎÓJÊÊ]ÖÌŠ“WOSX]›X^
LKX]›Z[ŠK]ÊJÌŠ“KšLMˆŠKÌÌÍŽ
JKÖÌŠ“JÌWO]ÖÌŠ“WNÝ˜\ˆV×NÙ›ÜŠOX‹]YŠKÐJNÙ]‹™Ù]Ý\J
HO[™K™\ÜXZÑU‘S•ÓTÕÕT“RSUQÙ]YŠJÏ[ËÐJJ^œ\Ú
Ý\N”ÖÙ]‹™Ù]Ý\J
WK^ÜÜÚ][ÛŽ™]‹™Ù]Ý^ÜÜÚ][ÛŠ
KÛÜ™Û[™Ý™]‹™Ù]Û[™Ý

K]Y[×ÜÜÚ][ÛŽ™]‹™Ù]Ø]Y[×ÜÜÚ][ÛŠ
_JNÜ™]\›ˆJË
OÌNŒJJNÝ\ËœÞ[ÊË
K™[[Ý™Q[˜Ý[ÛŠ
_KPKœ›ÝÝ\KœÞ[\Ú^™WÚ\OY[˜Ý[ÛŠËJ^Ý˜\ˆÏH™\ÜXZË[™ËZ\K]\HŠÓX]œ˜[™ÛJ
KÔÝš[™Ê
KœÝXœÝš[™ÊŠKHˆ‹O]\ËœÞ[Ú\WÊËÊNÜ™]\›ˆOOL	‰Š]Kœ™XYš[JËÙ[˜ÛÙ[™Îˆ]ŽŸJJKK[›[šÊÊKØÛÙN›K\N™_NÝ˜\ˆ[™]È›ÛZ\ÙJ
ÏOžÛ™K˜Ø[Y[ÜÊ™]È™K™TÜXZÓ‘ÕÛÜšÙ\ŠN›™K›Û”[[YR[š]X[^™YJ
OOœÊ™]È™K™TÜXZÓ‘ÕÛÜšÙ\Š_JJKÝÏVÈ™[ˆ—KÏR[Š
ÏOžÛ]O\Ë›\ÝÝ›ÚXÙ\Ê
K›X\


Û˜[YN™Y[YšY\Ž›K[™ÝXYÙ\ÎßJOOŠÛ˜[YN™Y[YšY\Ž›K[™ÝXYÙ\ÎË™š[\Š
O‘ÝËš[˜ÛY\Ê‹›˜[YKœÜ]
‹HŠVÌJJJ_JJJK™š[\Š
O™›[™ÝXYÙ\Ë›[™ÝŒ
JKÏ[™]ÈÙ]Ù›ÜŠ]ÙˆJ^ÛË˜Y
šY[YšY\ŠNÙ›ÜŠ]HÙˆ›[™ÝXYÙ\Ê[Ë˜Y
K›˜[YJ_\™]\›žÝ›ÚXÙ\ÎšKY[YšY\œÎ›ß_JJNÝ˜\ˆNX\Þ[˜ÊËOH™[‹]\ÈŠOOžÛ]ÏX]ØZ]ÚY[YšY\œÎ™OX]ØZ]ÎÚYŠYš\ÊJJ]›ÝÈ™]È\œ›ÜŠ[˜[Y[™ÝXYÙHY[YšY\Žˆ‰Ú_H‹ˆÚÝ[™HÛ™HÙŽˆ	Ð\œ˜^K™œ›ÛJ
KÔÛÜY

Kš›Ú[Š‹Š_K˜
NÜ™]\›ˆËœÙ]Ý›ÚXÙJJKËœÞ[\Ú^™WÚ\JÊKš\OËœÜ]
˜
K™š[\Š
OO›K›[™ÝŒ
JOÏÖ×_NÝ˜\ˆNU™ÊÎ

KJK[U™Ê

KJNÙ[˜Ý[Ûˆ]ÊÊ^ÚYŠËš[˜ÛY\Ê‹ˆŠJ\™]\›ˆÎÚYŠËš[˜ÛY\ÊŽˆŠJ^Û]ÐË—O\ËœÜ]
ŽˆŠK›X\
[X™\ŠNÜ™]\›ˆOOLØ	ÐßHÉØÛØÚØ˜LØ	ÐßHÚ	ØŸX˜	ÐßH	ØŸX[]O\\œÙR[
ËœÛXÙJ
KL
NÚYŠOLLILYLÏL
\™]\›ˆÎÛ]Ï\ËœÛXÙJŠK\\œÙR[
ËœÛXÙJ‹
KL
KO\Ë™[™ÕÚ]
œÈŠOÈœÈŽˆˆŽÚYŠILYLÏLL	‰šILYLÏNNNJ^ÚYŠOOL
\™]\›˜	ÛßH[™™Y	Û_XÚYŠL
\™]\›˜	ÛßHÚ	ÙIÛ_X\™]\›˜	ÛßH	ÙIÛ_XY[˜Ý[ÛˆÝÊÊ^Û]O\ÖÌOOOH‰È™Û\ˆŽˆœÝ[™ŽÚYŠ\Ó˜SŠ[X™\ŠËœÛXÙJJJJJ\™]\›˜	ÜËœÛXÙJJ_H	Ú_\ØÚYŠ\Ëš[˜ÛY\Ê‹ˆŠJ^Û]Ï\ËœÛXÙJJOOOHŒHÈˆŽˆœÈŽÜ™]\›˜	ÜËœÛXÙJJ_H	Ú_IÐßX[]ÛËO\ËœÛXÙJJKœÜ]
‹ˆŠKO\\œÙR[
œY[™
‹ŒŠKL
NÜ™]\›˜	ÛßH	Ú_IÛÏOOHŒHÈˆŽˆœÈŸH[™	Û_H	ÜÖÌOOOH‰ÛOOOLOÈ˜Ù[Žˆ˜Ù[ÈŽ›OOOLOÈœ[›žHŽˆœ[˜ÙHŸXY[˜Ý[ÛˆÝÊÊ^Û]ÚK×O\ËœÜ]
‹ˆŠNÜ™]\›˜	Ú_HÚ[	ÛËœÜ]
ˆŠKš›Ú[ŠˆŠ_X]˜\ˆÏ[™]È™YÑ^

Ê–ÉÖŽIÎÎ‹ˆO×LW‘—LŒMLŒˆ—P——LŒP×LŒQ

^ßV×IËŽœ™\XÙJÖËŠŠÏ×‰ßJ
_×WKÙË—		ˆŠ_WJ×ÊŠJØ™ÈŠKŽØ\Þ[˜È[˜Ý[ÛˆŽ
ËOH˜H‹ÏHL
^ÛÉ‰ŠÏJ[˜Ý[ÛŠÊ^Ü™]\›ˆËœ™\XÙJÖø &8 &WKÙË‰ÈŠKœ™\XÙJðªËÙË—LŒPÈŠKœ™\XÙJð®ËÙË—LŒQŠKœ™\XÙJÖø '8 'WKÙË	È‰ÊKœ™\XÙJ×
ÙË—PˆŠKœ™\XÙJ×
KÙË—ˆŠKœ™\XÙJøà KÙË‹ŠKœ™\XÙJøà ‹ÙË‹ˆŠKœ™\XÙJûï KÙËˆHŠKœ™\XÙJûï#ÙË‹ŠKœ™\XÙJûï&‹ÙËŽˆŠKœ™\XÙJûï&ËÙËŽÈŠKœ™\XÙJûï'ËÙËÈŠKœ™\XÙJÖ×—È—KÙËˆŠKœ™\XÙJÈ
ËËˆŠKœ™\XÙJÊÏWŠH
ÊÏWŠKÙËˆŠKœ™\XÙJ×‘Ôœ—WŠÏHÐKV—JKÙË‘ØÝÜˆŠKœ™\XÙJ×ŠÎ“\—ŸT—ŠÏHÐKV—JJKÙË“Z\Ý\ˆŠKœ™\XÙJ×ŠÎ“\×ŸT×ŠÏHÐKV—JJKÙË“Z\ÜÈŠKœ™\XÙJ×ŠÎ“\œ×ŸT”×ŠÏHÐKV—JJKÙË“\œÈŠKœ™\XÙJ×™]×ŠÈHÐKV—JKÙÚK™]ÈŠKœ™\XÙJ×ŠJYXZ×‹ÙÚK‰YIØHŠKœ™\XÙJ×
——
ß—Í\Ï×Ÿ
ÏNŠWŠÎ–ÌKNW_VÌL—JN–ÌMWWŠÈNŠKÙË]ÊKœ™\XÙJÊÏW
K
ÏW
KÙËˆŠKœ™\XÙJÖÉ0¨×W
ÊÎ——
ÊOÊÎˆ[™™YÝ\Ø[™
Î–Ø›W_ŠZ[[ÛŠJ—ŸÉ0¨×W
×—×‹ÙÚKÝÊKœ™\XÙJ×
——
ËÙËÝÊKœ™\XÙJÊÏW
KJÏW
KÙËˆÈŠKœ™\XÙJÊÏW
TËÙËˆÈŠKœ™\XÙJÊÏVÐÑ‘Ò‹S”U‹V—JIÏÜ×‹ÙË‰ÔÈŠKœ™\XÙJÊÏV	ÊT×‹ÙËœÈŠKœ™\XÙJÊÎ–ÐKV˜K^—WŠ^Ì‹HØK^—KÙË
OO“Kœ™\XÙJ×‹ÙË‹HŠJJKœ™\XÙJÊÏVÐKV—JWŠÏVÐKV—JKÙÚK‹HŠKš[J
_JJÊJNÛ]J[˜Ý[ÛŠËJ^Û]V×KLÙ›ÜŠ]ÈÙˆË›X]Ú[
JJ^Û]WÖÌNÑËš[™^	‰žœ\Ú
ÛX]ÚˆLK^ËœÛXÙJËš[™^
_JK‹›[™ÝŒ	‰žœ\Ú
ÛX]ÚˆL^ŸJKWËš[™^
Ý‹›[™Ý\™]\›ˆË›[™Ý	‰žœ\Ú
ÛX]ÚˆLK^ËœÛXÙJ
_JKJJËÊKOZOOOH˜HÈ™[‹]\ÈŽˆ™[ˆ‹J]ØZ]›ÛZ\ÙK˜[
›X\

\Þ[˜ÊÛX]ÚË^“_JOOÏÓNŠ]ØZ]N
KJJKš›Ú[ŠˆŠJJJJKš›Ú[ŠˆŠKœ™\XÙJÚòfZòâòä2n[ò¢‹ÙËš×LÎ×LŽZ×LNWLÎ[×LŽHŠKœ™\XÙJÚòfZòâ2e2ä2nrfr¢‹ÙËš×LÎLNWLŽZ×LNWLÎWLNWLŽHŠKœ™\XÙJò¬‹ÙËšˆŠKœ™\XÙJÜ‹ÙË—LÎHŠKœ™\XÙJÞÙËšÈŠKœ™\XÙJòkÙË›ŠKœ™\XÙJÊÏVØK^²nräJJÏZ2â2£™2nrj™
KÙËˆŠKœ™\XÙJÈŠÏVÎÎ‹ˆOð¨p¯ø %8 )ˆ°ªð®ø '8 'H_	
KÙËžˆŠNÜ™]\›ˆOOOH˜H‰‰ŠX‹œ™\XÙJÊÏ[²ârj›Š]JÈrä
KÙË™HŠJK‹š[J
_Y[˜Ý[ÛˆLŠËOHL
^Ü™]\›ˆ‹ˆO×LŒ—LÌ—Q‘ŒQ—Q‘ŒH‹š[˜ÛY\ÊÊ_I‰œÏOOX˜Y[˜Ý[ÛˆÊËJ^Û]ÏZNÙ›ÜŠÛÏË›[™Ý	‰ˆK×ËË\Ý
ÖÛ×JNÊJÊÛÎÜ™]\›ˆËœÝXœÝš[™ÊKÊ_]˜\ˆÏ[™]ÈÙ]
È›\ˆ‹›\œÈ‹›\È‹™ˆ‹œ›Ùˆ‹œÜˆ‹šœˆ‹œÙÝ‹˜ÛÛ‹™Ù[ˆ‹œ™\‹œÙ[ˆ‹™ÛÝˆ‹›‹›XZˆ‹˜Ø\‹œÝ‹›]‹™]È‹˜ÛÈ‹š[˜È‹›‹™\‹œÈ‹œ‹œÈ‹š˜[ˆ‹™™Xˆ‹›X\ˆ‹˜\ˆ‹š[ˆ‹š[‹˜]YÈ‹œÙ\‹œÙ\‹›ØÝ‹››Ýˆ‹™XÈ‹œÝ[ˆ‹›[Ûˆ‹H‹YH‹Y\È‹ÙY‹‹H‹\ˆ‹\œÈ‹™œšH‹œØ]—JNÙ[˜Ý[ÛˆÊÊ^Ü™]\›ˆÏ\Ëœ™\XÙJÖÉø &W\ÉÚKˆŠKœ™\XÙJ×ŠÉËˆŠKËš\ÊËÓÝÙ\Ø\ÙJ
J_]˜\ˆ	[™]ÈX\
ÖÈŠH‹Š—KÈ—H‹–È—KÈŸH‹žÈ—KÈ—LÌˆ‹—LÌH—KÈ—LÌH‹—LÌ—KÈ—LŒÐH‹—LŒÎH—KÈ—ˆ‹—Pˆ—KÈ—LŒÌH‹—LŒÌŽH—KÈ—LÌ‹—LÌÈ—KÈ—LÌˆ‹—LÌH—KÈ—LÌMH‹—LÌM—KÈ—LÌLH‹—LÌL—WJKÏ[™]ÈÙ]
	˜[Y\Ê
JNÙ[˜Ý[ÛˆÝÊËKË
^ÚYŠÏOOIÈ‰ßÏOOH‰ÈŠ\™]\›ˆÏOOH‰È‰‰›ÏŒ	‰›Ï›[™ÝLI‰‹ÖÐKV˜K^—KË\Ý
ÛËLWJI‰‹ÖÐKV˜K^—KË\Ý
ÛÊÌWJOÝ›ÚY›ÚY
K›[™Ý	‰šK˜]
LJOOO\ÏÚKœÜ

NšKœ\Ú
ÊJNÚYŠËš\ÊÊJ\™]\›ˆ›ÚYKœ\Ú
ÊNÛ]OI™Ù]
ÊNÛI‰šK›[™Ý	‰šK˜]
LJOOO[I‰šKœÜ

_]˜\ˆLXÛ\ÜÞØÛÛœÝXÝÜŠ
^Ý\Ë—ØY™™\Hˆ‹\Ë—ÜÙ[[˜Ù\ÏV×K\Ë—Ü™\ÛÛ™\[[\Ë—ØÛÜÙYHL_\\Ú
‹‹šJ^Ù›ÜŠ]ÈÙˆJ]\Ë—ØY™™\ŠÏ[Ë\Ë—Ü›ØÙ\ÜÊ
_XÛÜÙJ
^ÚYŠ\Ë—ØÛÜÙY
]›ÝÈ™]È\œ›ÜŠ”Ý™X[H\È[™XYHÛÜÙYˆŠNÝ\Ë—ØÛÜÙYHL\Ë™›\Ú

_Y›\Ú

^Û]O]\Ë—ØY™™\‹š[J
NÚK›[™ÝŒ	‰\Ë—ÜÙ[[˜Ù\Ëœ\Ú
JK\Ë—ØY™™\Hˆ‹\Ë—Ü™\ÛÛ™J
_WÜ™\ÛÛ™J
^Ý\Ë—Ü™\ÛÛ™\‰‰Š\Ë—Ü™\ÛÛ™\Š
K\Ë—Ü™\ÛÛ™\[[
_WÜ›ØÙ\ÜÊ
^Û]OLÏ]\Ë—ØY™™\‹[Ë›[™ÝOLÏV×K]ÏOžÛ]O]ÎÙ›ÜŠÓJÌO	‰œLŠÖÓJÌWKLJNÊJÊÓNÙ›ÜŠÓJÌO	‰Š[ÖÓJÌWK‰ÊW_WLÌLÌ˜š[˜ÛY\Ê
JNÊJÊÓNÝ˜\ˆÛ]SJÌNÙ›ÜŠÑ	‰‹×ËË\Ý
ÖÑJNÊJÊÑÜ™]\›žÙ[™“K™^›Û”ÜXÙN‘_NÙ›ÜŠÛOÊ^Û]Ï[ÖÛWNÚYŠÝÊËËKÊKË›[™ÝOOL	‰œLŠÊJ^Û]O[ËœÛXÙJKJNÚYŠÊŸŠW
ÉË\Ý
JJ^ÊÊÛNØÛÛ[Y_[]Ù[™ž™^›Û”ÜXÙN‘OXŠJNÚYŠOOOQLI‰ÈOOX˜
^ÊÊÛNØÛÛ[Y_ZYŠOOY
Xœ™XZÎÛ]Ï[KLNÙ›ÜŠ×ÏL	‰‹×ËË\Ý
Ö××JNÊWËKN×ÏSX]›X^
KÊÌJNÛ]SÊËÊNÚYŠ]Š^ÊÊÛNØÛÛ[Y_ZYŠ
ÚÏÖË—W×ËË\Ý
Š_‹š[˜ÛY\ÊŠJI‰ˆ\LŠ‹˜]
LJJJ^ÛOWÊÝ‹›[™ÝØÛÛ[Y_ZYŠÊŠJ^ÊÊÛNØÛÛ[Y_ZYŠ×ŠÐKV˜K^—WŠJÉË\Ý
ŠI‰‘	‰‹ÖÐKV—KË\Ý
ÖÑJJ^ÊÊÛNØÛÛ[Y_ZYŠÏOOH‹ˆ‰‰‘	‰‹ÖØK^—KË\Ý
ÖÑJJ^ÊÊÛNØÛÛ[Y_[]O[ËœÝXœÝš[™ÊK
ÌJKš[J
NÚYŠOOOH‹‹‹ˆŸOOOH—LŒˆŠ^ÊÊÛNØÛÛ[Y_TI‰\Ë—ÜÙ[[˜Ù\Ëœ\Ú
JKOZO^
Ì_Y[ÙJÊÛ_]\Ë—ØY™™\[ËœÝXœÝš[™ÊJK\Ë—ÜÙ[[˜Ù\Ë›[™ÝŒ	‰\Ë—Ü™\ÛÛ™J
_X\Þ[˜Ê–ÔÞ[X›Û˜\Þ[˜Ò]\˜]Ü—J
^ÚYŠ\Ë—Ü™\ÛÛ™\Š]›ÝÈ™]È\œ›ÜŠ[›Ý\ˆ]\˜]Üˆ\È[™XYHXÝ]™KˆŠNÙ›ÜŠÎÊZYŠ\Ë—ÜÙ[[˜Ù\Ë›[™ÝŒ
^ZY[\Ë—ÜÙ[[˜Ù\ËœÚY

NÙ[Ù^ÚYŠ\Ë—ØÛÜÙY
Xœ™XZÎØ]ØZ]™]È›ÛZ\ÙJ
OOžÝ\Ë—Ü™\ÛÛ™\Z_JJ__VÔÞ[X›Ûš]\˜]Ü—J
^Ý\Ë™›\Ú

NÛ]O]\Ë—ÜÙ[[˜Ù\ÖÔÞ[X›Ûš]\˜]Ü—J
NÜ™]\›ˆ\Ë—ÜÙ[[˜Ù\ÏV×K_YÙ]Ù[[˜Ù\Ê
^Ü™]\›ˆ\Ë—ÜÙ[[˜Ù\ß_K	SØš™XÝ™œ™Y^™JØY—ÚX\žÛ˜[YNˆ’X\‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—LÍQ‘Lˆ‹\™Ù]]X[]NˆH‹Ý™\˜[Ü˜YNˆHŸKY—Ø[ÞNžÛ˜[YNˆ[ÞH‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÈŸKY—Ø[ÙYNžÛ˜[YNˆ[ÙYH‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸKY—Ø™[NžÛ˜[YNˆ™[H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—^ÌQL_H‹\™Ù]]X[]NˆH‹Ý™\˜[Ü˜YNˆKHŸKY—Ú™\ÜÚXØNžÛ˜[YNˆ’™\ÜÚXØH‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸKY—ÚÛÜ™NžÛ˜[YNˆ’ÛÜ™H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸKY—ÛšXÛÛNžÛ˜[YNˆ“šXÛÛH‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—^ÌQŒÐMßH‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆ‹HŸKY—Û›Ý˜NžÛ˜[YNˆ“›Ý˜H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÈŸKY—Üš]™\ŽžÛ˜[YNˆ”š]™\ˆ‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸKY—ÜØ\˜ZžÛ˜[YNˆ”Ø\˜Z‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸKY—ÜÚÞNžÛ˜[YNˆ”ÚÞH‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆËHŸK[WØY[NžÛ˜[YNˆY[H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]Nˆ‘‹Ý™\˜[Ü˜YNˆ‘ŠÈŸK[WÙXÚÎžÛ˜[YNˆ‘XÚÈ‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK[WÙ\šXÎžÛ˜[YNˆ‘\šXÈ‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK[WÙ™[œš\ŽžÛ˜[YNˆ‘™[œš\ˆ‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸK[WÛX[NžÛ˜[YNˆ“X[H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK[WÛZXÚY[žÛ˜[YNˆ“ZXÚY[‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸK[WÛÛž^žÛ˜[YNˆ“Ûž^‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK[WÜXÚÎžÛ˜[YNˆ”XÚÈ‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÊÈŸK[WÜØ[NžÛ˜[YNˆ”Ø[H‹[™ÝXYÙNˆ™[‹]\È‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘HŸK™—Ù[[XNžÛ˜[YNˆ‘[[XH‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—^ÌQ_H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆ‹HŸK™—Ú\ØX™[NžÛ˜[YNˆ’\ØX™[H‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ‘™[X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÈŸK›WÙÙ[Ü™ÙNžÛ˜[YNˆ‘Ù[Ü™ÙH‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ“X[H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÈŸK›WÛ]Ú\ÎžÛ˜[YNˆ“]Ú\È‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ“X[H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘
ÈŸK™—Ø[XÙNžÛ˜[YNˆ[XÙH‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—^ÌQ_H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK™—Û[NžÛ˜[YNˆ“[H‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ‘™[X[H‹˜Z]Îˆ—^ÌQ_H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK›WÙ[šY[žÛ˜[YNˆ‘[šY[‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ“X[H‹˜Z]Îˆ—^ÌQŽ_H‹\™Ù]]X[]NˆÈ‹Ý™\˜[Ü˜YNˆ‘ŸK›WÙ˜X›NžÛ˜[YNˆ‘˜X›H‹[™ÝXYÙNˆ™[‹YØˆ‹Ù[™\Žˆ“X[H‹˜Z]Îˆ—^ÌQŽ_H‹\™Ù]]X[]Nˆˆ‹Ý™\˜[Ü˜YNˆÈŸ_JK	[™]ÈX\Ø\Þ[˜È[˜Ý[ÛˆÊÊ^ÚYŠ	‹š\ÊÊJ\™]\›ˆ	‹™Ù]
ÊNÛ]O[™]È›Ø]Ì\œ˜^J]ØZ]
\Þ[˜È[˜Ý[ÛŠÊ^ÚYŠ[™Y˜][	‰“Øš™XÝš\ÓÝÛŠ[™Y˜][œ™XYš[HŠJ^Û]Ï]\[Ùˆ×Ù\›˜[YOH××Ù\›˜[YNš[\Ü›Y]K™\›˜[YKO\N™Y˜][œ™\ÛÛ™JË‹‹Ý›ÚXÙ\ËÉÛßK˜š[˜
KØY™™\ŽžOX]ØZ][™Y˜][œ™XYš[JJNÜ™]\›ˆ[]XÎ‹ËÚYÙÚ[™Ù˜XÙK˜ÛËÛÛ›žXÛÛ[][š]KÒÛÚÛÜ›ËN“K]ŒKŒSÓ“–Ü™\ÛÛ™KÛXZ[‹Ý›ÚXÙ\ËÉÛßK˜š[˜NÝž^ÛOX]ØZ]ØXÚ\Ë›Ü[ŠšÛÚÛÜ›Ë]›ÚXÙ\ÈŠNÛ]ÏX]ØZ]K›X]Ú

NÚYŠÊ\™]\›ˆ]ØZ]Ë˜\œ˜^PY™™\Š
_XØ]Ú
Ê^ØÛÛœÛÛKØ\›Š•[˜X›HÈÜ[ˆØXÚH‹Ê_[]ÏX]ØZ]™]Ú

KX]ØZ]Ë˜\œ˜^PY™™\Š
NÚYŠJ]ž^Ø]ØZ]Kœ]
™]È™\ÜÛœÙJ‹ÚXY\œÎËšXY\œßJJ_XØ]Ú
Ê^ØÛÛœÛÛKØ\›Š•[˜X›HÈØXÚHš[H‹Ê_\™]\›ˆŸJJÊJNÜ™]\›ˆ	‹œÙ]
ËJK_]˜\ˆ]OXÛ\ÜÈÞØÛÛœÝXÝÜŠKÊ^Ý\Ë›[Ù[ZK\ËÚÙ[š^™\[ß\Ý]XÈ\Þ[˜Èœ›ÛWÜ™]˜Z[™Y
KÙ\N›ÏH™œÌˆ‹]šXÙN™[[›ÙÜ™\Ü×ØØ[˜XÚÎ›O[[O^ßJ^Û]ÏWÌË™œ›ÛWÜ™]˜Z[™Y
KÜ›ÙÜ™\Ü×ØØ[˜XÚÎ›K\N›Ë]šXÙN™JK]ŒË™œ›ÛWÜ™]˜Z[™Y
KÜ›ÙÜ™\Ü×ØØ[˜XÚÎ›_JKÏX]ØZ]›ÛZ\ÙK˜[
ÐË—JNÜ™]\›ˆ™]ÈÊ‹‹Ê_YÙ]›ÚXÙ\Ê
^Ü™]\›ˆ	Ÿ[\ÝÝ›ÚXÙ\Ê
^ØÛÛœÛÛKX›J	Š_WÝ˜[Y]WÝ›ÚXÙJJ^ÚYŠI‹š\ÓÝÛ”›Ü\JJJ]›ÝÈÛÛœÛÛK™\œ›ÜŠ›ÚXÙH‰Ú_Hˆ›Ý›Ý[™ˆ]˜Z[X›H›ÚXÙ\Î˜
KÛÛœÛÛKX›J	ŠK™]È\œ›ÜŠ›ÚXÙH‰Ú_Hˆ›Ý›Ý[™ˆÚÝ[™HÛ™HÙŽˆ	ÓØš™XÝšÙ^\Ê	ŠKš›Ú[Š‹Š_K˜
NÜ™]\›ˆK˜]

_X\Þ[˜ÈÙ[™\˜]JKÝ›ÚXÙN›ÏH˜Y—ÚX\‹ÜYY™L_O^ßJ^Û]O]\Ë—Ý˜[Y]WÝ›ÚXÙJÊKÏX]ØZ]Ž
KJKÚ[œ]ÚYÎ˜ŸO]\ËÚÙ[š^™\ŠËÝ[˜Ø][ÛŽˆLJNÜ™]\›ˆ\Ë™Ù[™\˜]WÙœ›ÛWÚYÊ‹Ý›ÚXÙN›ËÜYY™J_X\Þ[˜ÈÙ[™\˜]WÙœ›ÛWÚYÊKÝ›ÚXÙN›ÏH˜Y—ÚX\‹ÜYY™L_O^ßJ^Û]OLMŠ“X]›Z[ŠX]›X^
K™[\Ë˜]
LJKL‹
KLJKÏJ]ØZ]ÊÊJKœÛXÙJKJÌMŠK^Ú[œ]ÚYÎšKÝ[N›™]ÈŒŠ™›Ø]Ìˆ‹ËÌKM—JKÜYY›™]ÈŒŠ™›Ø]Ìˆ‹ÙKÌWJ_KÝØ]™Y›Ü›NßOX]ØZ]\Ë›[Ù[
ŠNÜ™]\›ˆ™]ÈLÊË™]KLÊ_X\Þ[˜ÊœÝ™X[JKÝ›ÚXÙN›ÏH˜Y—ÚX\‹ÜYY™LKÜ]Ü]\›Ž›O[[O^ßJ^Û]Ï]\Ë—Ý˜[Y]WÝ›ÚXÙJÊKŽÚYŠH[œÝ[˜Ù[ÙˆL
XZNÙ[Ù^ÚYŠ\[ÙˆHOHœÝš[™ÈŠ]›ÝÈ™]È\œ›ÜŠ’[˜[Y[œ]\Kˆ^XÝYÝš[™ÈÜˆ^Ü]\”Ý™X[KˆŠNÞØ[™]ÈLÛ]Ï[OÚKœÜ]
JK›X\

OO“Kš[J
JJK™š[\Š
OO“K›[™ÝŒ
JN–ÚWNØ‹œ\Ú
‹‹Ê__Y›Üˆ]ØZ]
]ÈÙˆŠ^Û]OX]ØZ]Ž
ËÊKÚ[œ]ÚYÎžO]\ËÚÙ[š^™\ŠKÝ[˜Ø][ÛŽˆLJKX]ØZ]\Ë™Ù[™\˜]WÙœ›ÛWÚYÊÝ›ÚXÙN›ËÜYY™JNÞZY[Ý^ËÛ™[Y\Î“K]Y[Î‘___NÒÌ˜˜XÚÙ[™Ë›Û›žØ\ÛK›[U™XYÏLNÒÌ˜˜XÚÙ[™Ë›Û›žØ\ÛKœ›ÞOHLNÙ^ÜÙ]H\ÈÛÚÛÜ›ÕËL\È^Ü]\”Ý™X[_NÂ