var a=Object.defineProperty;var h=Object.getOwnPropertyDescriptor;var k=Object.getOwnPropertyNames;var d=Object.prototype.hasOwnProperty;var l=(r,e)=>{for(var s in e)a(r,s,{get:e[s],enumerable:!0})},u=(r,e,s,t)=>{if(e&&typeof e=="object"||typeof e=="function")for(let n of k(e))!d.call(r,n)&&n!==s&&a(r,n,{get:()=>e[n],enumerable:!(t=h(e,n))||t.enumerable});return r};var T=r=>u(a({},"__esModule",{value:!0}),r);var m={};l(m,{ArcClient:()=>o});module.exports=T(m);var i=require("@prsm/duplex"),o=class{client;authenticated=!1;username;password;tokens;constructor({host:e,port:s,secure:t,username:n,password:c}){this.client=new i.CommandClient({host:e,port:s,secure:t}),this.username=n,this.password=c}async refresh(){let{accessToken:e,refreshToken:s}=this.tokens,t=await this.client.command(1,{accessToken:e,refreshToken:s});if(t.error)throw new Error(t.error);this.tokens={accessToken:t.accessToken,refreshToken:t.refreshToken}}async auth(){let e={username:this.username,password:this.password},s=await this.client.command(0,e);if(s.error)throw new Error("Failed to authenticate");this.tokens={accessToken:s.accessToken,refreshToken:s.refreshToken},this.authenticated=!0}async query(e){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}e.accessToken=this.tokens.accessToken;let s;if(s=await this.client.command(2,e),s.error){try{await this.refresh()}catch(t){throw new Error(`Failed to refresh tokens: ${t.message}`)}return await this.query(e)}return s}async createUser(e,s){let t={username:e,password:s,accessToken:this.tokens.accessToken};return await this.client.command(3,t)}async removeUser(e){let s={username:e,accessToken:this.tokens.accessToken};return await this.client.command(4,s)}};0&&(module.exports={ArcClient});
