import{EventEmitter as I}from"node:events";import L from"node:net";import F from"node:tls";var a=class extends Error{code;name;constructor(e,t,s){super(e),typeof t=="string"&&(this.code=t),typeof s=="string"&&(this.name=s)}};var h=class{static toBuffer({payload:e,id:t,command:s}){if(e===void 0)throw new TypeError("The payload must not be undefined!");let o=JSON.stringify(e),n=Buffer.allocUnsafe(o.length+3);return n.writeUInt16LE(t,0),n.writeUInt8(s,2),n.write(o,3),n}static parse(e){if(e.length<3)throw new TypeError(`Token too short! Expected at least 3 bytes, got ${e.length}!`);let t=e.readUInt16LE(0),s=e.readUInt8(2),o=JSON.parse(e.toString("utf8",3));return{id:t,command:s,payload:o}}};import{EventEmitter as O}from"node:events";var l=Buffer.from(`
`)[0],c=Buffer.from("\\")[0],T=Buffer.from("n")[0],f=class{static escape(e){let t=[];for(let s of e)switch(s){case c:t.push(c),t.push(c);break;case l:t.push(c),t.push(T);break;default:t.push(s);break}return t.push(l),Buffer.from(t)}static unescape(e){let t=[];for(let s=0;s<e.length-1;s++){let o=e[s],n=e[s+1];if(o===c)switch(n){case c:t.push(c),s+=1;break;case T:t.push(l),s+=1;break;default:throw new Error("Unescaped backslash detected!")}else t.push(o)}return Buffer.from(t)}};var b=Buffer.from(`\\
`),u=class extends O{duplex;buffer=Buffer.allocUnsafe(0);constructor(e){super(),this.duplex=e,this.applyListeners()}applyListeners(){this.duplex.on("data",e=>{this.buffer=Buffer.concat([this.buffer,e]),this.parse()}),this.duplex.on("close",()=>this.emit("close"))}parse(){for(;this.buffer.length>0;){let e=this.buffer.indexOf(l);if(e===-1)break;let t=this.buffer.subarray(0,e+1);t.equals(b)?this.emit("remoteClose"):this.emit("token",f.unescape(t)),this.buffer=this.buffer.subarray(e+1)}}get isDead(){return!this.duplex.writable||!this.duplex.readable}send(e){return this.isDead?!1:(this.duplex.write(f.escape(e)),!0)}close(){return this.isDead?!1:(this.duplex.end(),!0)}remoteClose(){return this.isDead?!1:(this.duplex.write(b),!0)}};var m=class{static serialize(e){let t={message:e.message,name:e.name,stack:e.stack};return Object.assign(t,e),t}static deserialize(e){let t=this.getFactory(e),s=new t(e.message);return Object.assign(s,e),s}static getFactory(e){let t=e.name;return t.endsWith("Error")&&global[t]?global[t]:Error}};var i;(function(r){r[r.ONLINE=3]="ONLINE",r[r.CONNECTING=2]="CONNECTING",r[r.CLOSED=1]="CLOSED",r[r.OFFLINE=0]="OFFLINE"})(i||(i={}));var d=class{ids=[];index=0;maxIndex;constructor(e=2**16-1){this.maxIndex=e}release(e){if(e<0||e>this.maxIndex)throw new TypeError(`ID must be between 0 and ${this.maxIndex}. Got ${e}.`);this.ids[e]=!1}reserve(){let e=this.index;for(;;){let t=this.index;if(!this.ids[t])return this.ids[t]=!0,t;if(this.index>=this.maxIndex?this.index=0:this.index++,this.index===e)throw new Error("All IDs are reserved. Make sure to release IDs when they are no longer used.")}}};var y=class{value;expiration;constructor(e,t){this.value=e,this.expiration=Date.now()+t}get expiresIn(){return this.expiration-Date.now()}get isExpired(){return Date.now()>this.expiration}},E=class{items=[];add(e,t){this.items.push(new y(e,t))}get isEmpty(){let e=this.items.length;for(;e--;)if(this.items[e].isExpired)this.items.splice(e,1);else return!1;return!0}pop(){for(;this.items.length;){let e=this.items.shift();if(!e.isExpired)return e}return null}};var x=class extends I{options;socket;connection=null;hadError;status;constructor(e){super(),this.options=e,this.connect()}connect(){return this.status>=i.CLOSED?!1:(this.hadError=!1,this.status=i.CONNECTING,this.options.secure?this.socket=F.connect(this.options):this.socket=L.connect(this.options),this.connection=null,this.applyListeners(),!0)}close(){return this.status<=i.CLOSED?!1:(this.status=i.CLOSED,this.socket.end(),this.connection=null,!0)}send(e){return this.connection?this.connection.send(e):!1}applyListeners(){this.socket.on("error",e=>{this.hadError=!0,this.emit("error",e)}),this.socket.on("close",()=>{this.status=i.OFFLINE,this.emit("close",this.hadError)}),this.socket.on("secureConnect",()=>{this.updateConnection(),this.status=i.ONLINE,this.emit("connect")}),this.socket.on("connect",()=>{this.updateConnection(),this.status=i.ONLINE,this.emit("connect")})}updateConnection(){let e=new u(this.socket);e.on("token",t=>{this.emit("token",t,e)}),e.on("remoteClose",()=>{this.emit("remoteClose",e)}),this.connection=e}},k=class extends x{queue=new E;constructor(e){super(e),this.applyEvents()}sendBuffer(e,t){this.send(e)||this.queue.add(e,t)}applyEvents(){this.on("connect",()=>{for(;!this.queue.isEmpty;){let e=this.queue.pop();this.sendBuffer(e.value,e.expiresIn)}})}},p=class extends k{ids=new d(65535);callbacks={};constructor(e){super(e),this.init()}init(){this.on("token",e=>{try{let t=h.parse(e);if(this.callbacks[t.id])if(t.command===255){let s=m.deserialize(t.payload);this.callbacks[t.id](s,void 0)}else this.callbacks[t.id](null,t.payload)}catch(t){this.emit("error",t)}})}async command(e,t,s=3e4,o=void 0){if(e===255)throw new a("Command 255 is reserved.","ERESERVED","CommandError");let n=this.ids.reserve(),v=h.toBuffer({id:n,command:e,payload:t});this.sendBuffer(v,s),(s===0||s===null||s===1/0)&&(s=6e4);let C=this.createResponsePromise(n),N=this.createTimeoutPromise(n,s);if(typeof o=="function")try{let w=await Promise.race([C,N]);try{o(w,void 0)}catch{}}catch(w){o(void 0,w)}else return Promise.race([C,N])}createTimeoutPromise(e,t){return new Promise((s,o)=>{setTimeout(()=>{this.ids.release(e),delete this.callbacks[e],o(new a("Command timed out.","ETIMEOUT","CommandError"))},t)})}createResponsePromise(e){return new Promise((t,s)=>{this.callbacks[e]=(o,n)=>{this.ids.release(e),delete this.callbacks[e],o?s(o):t(n)}})}};var g=class{client;authenticated=!1;username;password;tokens;constructor({host:e,port:t,secure:s,username:o,password:n}){this.client=new p({host:e,port:t,secure:s}),this.username=o,this.password=n}async refresh(){let{accessToken:e,refreshToken:t}=this.tokens,s=await this.client.command(1,{accessToken:e,refreshToken:t});if(s.error)throw new Error("Failed to refresh tokens");this.tokens={accessToken:s.accessToken,refreshToken:s.refreshToken}}async auth(){let e={username:this.username,password:this.password},t=await this.client.command(0,e);if(t.error)throw new Error("Failed to authenticate");this.tokens={accessToken:t.accessToken,refreshToken:t.refreshToken},this.authenticated=!0}async query(e){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}e.accessToken=this.tokens.accessToken;let t;if(t=await this.client.command(2,e),t.error){try{await this.refresh()}catch{throw new Error("Failed to refresh tokens")}return await this.query(e)}return t}};async function D(){let r=new g({host:"localhost",port:3351,secure:!1,username:"root",password:"root"}),e=await r.query({collection:"planets",operation:"drop"});console.log("Drop result",e),e=await r.query({collection:"planets",operation:"insert",data:{query:[{name:"Mercury"},{name:"Venus"},{name:"Earth"},{name:"Mars"}]}}),console.log("Insert result",e),e=await r.query({collection:"planets",operation:"find",data:{query:{name:{$includes:"M"}}}}),console.log("Find result",e)}D();export{g as ArcClient};
//# sourceMappingURL=index.js.map
