var a=Object.defineProperty;var p=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var u=Object.prototype.hasOwnProperty;var h=(r,t)=>{for(var e in t)a(r,e,{get:t[e],enumerable:!0})},y=(r,t,e,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of d(t))!u.call(r,o)&&o!==e&&a(r,o,{get:()=>t[o],enumerable:!(s=p(t,o))||s.enumerable});return r};var l=r=>y(a({},"__esModule",{value:!0}),r);var m={};h(m,{ArcClient:()=>n});module.exports=l(m);var i=require("@prsm/duplex"),n=class{client;authenticated=!1;username;password;tokens;constructor({host:t,port:e,secure:s,username:o,password:c}){this.client=new i.CommandClient({host:t,port:e,secure:s}),this.username=o,this.password=c}async auth(){let t={username:this.username,password:this.password},e=await this.client.command(0,t);if(e.error)throw new Error("Failed to authenticate");this.tokens={accessToken:e.accessToken},this.authenticated=!0}async query(t){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}return t.accessToken=this.tokens.accessToken,await this.client.command(2,t)}async createUser(t,e){let s={username:t,password:e,accessToken:this.tokens.accessToken};return await this.client.command(3,s)}async removeUser(t){let e={username:t,accessToken:this.tokens.accessToken};return await this.client.command(4,e)}collectionWrapper(t){return{find:(e,s)=>this.query({collection:t,operation:"find",data:{query:e,options:s}}),insert:e=>this.query({collection:t,operation:"insert",data:{query:e}}),update:(e,s,o)=>this.query({collection:t,operation:"update",data:{query:e,operations:s,options:o}}),remove:(e,s)=>this.query({collection:t,operation:"remove",data:{query:e,options:s}}),drop:()=>this.query({collection:t,operation:"drop"})}}};0&&(module.exports={ArcClient});
