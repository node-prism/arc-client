var h=Object.create;var o=Object.defineProperty;var d=Object.getOwnPropertyDescriptor;var l=Object.getOwnPropertyNames;var m=Object.getPrototypeOf,y=Object.prototype.hasOwnProperty;var k=(s,t)=>{for(var e in t)o(s,e,{get:t[e],enumerable:!0})},a=(s,t,e,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of l(t))!y.call(s,i)&&i!==e&&o(s,i,{get:()=>t[i],enumerable:!(r=d(t,i))||r.enumerable});return s};var w=(s,t,e)=>(e=s!=null?h(m(s)):{},a(t||!s||!s.__esModule?o(e,"default",{value:s,enumerable:!0}):e,s)),g=s=>a(o({},"__esModule",{value:!0}),s);var T={};k(T,{ArcClient:()=>n});module.exports=g(T);var c=require("@prsm/duplex"),p=w(require("events"),1),n=class{client;authenticated=!1;username;password;tokens;emitter;constructor({host:t,port:e,secure:r,username:i,password:u}){this.client=new c.CommandClient({host:t,port:e,secure:r}),this.username=i,this.password=u,this.emitter=new p.default}close(){this.authenticated=!1,this.client.close()}open(){this.client.connect()}async auth(){let t={username:this.username,password:this.password},e=await this.client.command(0,t);if(e.error){this.emitter.emit("autherror",e.error);return}this.tokens={accessToken:e.accessToken},this.authenticated=!0,this.emitter.emit("authsuccess")}async query(t){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}return t.accessToken=this.tokens.accessToken,await this.client.command(2,t)}async createUser(t,e){let r={username:t,password:e,accessToken:this.tokens.accessToken};return await this.client.command(3,r)}async removeUser(t){let e={username:t,accessToken:this.tokens.accessToken};return await this.client.command(4,e)}collectionWrapper(t){return{find:(e,r)=>this.query({collection:t,operation:"find",data:{query:e,options:r}}),insert:e=>this.query({collection:t,operation:"insert",data:{query:e}}),update:(e,r,i)=>this.query({collection:t,operation:"update",data:{query:e,operations:r,options:i}}),remove:(e,r)=>this.query({collection:t,operation:"remove",data:{query:e,options:r}}),drop:()=>this.query({collection:t,operation:"drop"})}}};0&&(module.exports={ArcClient});
