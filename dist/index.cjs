var n=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var d=Object.getOwnPropertyNames;var p=Object.prototype.hasOwnProperty;var u=(o,e)=>{for(var t in e)n(o,t,{get:e[t],enumerable:!0})},k=(o,e,t,r)=>{if(e&&typeof e=="object"||typeof e=="function")for(let s of d(e))!p.call(o,s)&&s!==t&&n(o,s,{get:()=>e[s],enumerable:!(r=h(e,s))||r.enumerable});return o};var l=o=>k(n({},"__esModule",{value:!0}),o);var y={};u(y,{ArcClient:()=>a});module.exports=l(y);var i=require("@prsm/duplex"),a=class{client;authenticated=!1;username;password;tokens;constructor({host:e,port:t,secure:r,username:s,password:c}){this.client=new i.CommandClient({host:e,port:t,secure:r}),this.username=s,this.password=c}async refresh(){let{accessToken:e,refreshToken:t}=this.tokens,r=await this.client.command(1,{accessToken:e,refreshToken:t});if(r.error)throw new Error(r.error);this.tokens={accessToken:r.accessToken,refreshToken:r.refreshToken}}async auth(){let e={username:this.username,password:this.password},t=await this.client.command(0,e);if(t.error)throw new Error("Failed to authenticate");this.tokens={accessToken:t.accessToken,refreshToken:t.refreshToken},this.authenticated=!0}async query(e){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}e.accessToken=this.tokens.accessToken;let t;if(t=await this.client.command(2,e),t.error){try{await this.refresh()}catch(r){throw new Error(`Failed to refresh tokens: ${r.message}`)}return await this.query(e)}return t}async createUser(e,t){let r={username:e,password:t,accessToken:this.tokens.accessToken};return await this.client.command(3,r)}async removeUser(e){let t={username:e,accessToken:this.tokens.accessToken};return await this.client.command(4,t)}collectionWrapper(e){return{find:(t,r)=>this.query({collection:e,operation:"find",data:{query:t,options:r}}),insert:t=>this.query({collection:e,operation:"insert",data:{query:t}}),update:(t,r,s)=>this.query({collection:e,operation:"update",data:{query:t,operations:r,options:s}}),remove:(t,r)=>this.query({collection:e,operation:"remove",data:{query:t,options:r}}),drop:()=>this.query({collection:e,operation:"drop"})}}};0&&(module.exports={ArcClient});
