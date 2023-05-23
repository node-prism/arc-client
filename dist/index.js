import{CommandClient as i}from"@prsm/duplex";var a=class{client;authenticated=!1;username;password;tokens;constructor({host:e,port:t,secure:s,username:o,password:n}){this.client=new i({host:e,port:t,secure:s}),this.username=o,this.password=n}async auth(){let e={username:this.username,password:this.password},t=await this.client.command(0,e);if(t.error)throw new Error("Failed to authenticate");this.tokens={accessToken:t.accessToken},this.authenticated=!0}async query(e){if(!this.authenticated)try{await this.auth()}catch{throw new Error("Failed to authenticate")}return e.accessToken=this.tokens.accessToken,await this.client.command(2,e)}async createUser(e,t){let s={username:e,password:t,accessToken:this.tokens.accessToken};return await this.client.command(3,s)}async removeUser(e){let t={username:e,accessToken:this.tokens.accessToken};return await this.client.command(4,t)}collectionWrapper(e){return{find:(t,s)=>this.query({collection:e,operation:"find",data:{query:t,options:s}}),insert:t=>this.query({collection:e,operation:"insert",data:{query:t}}),update:(t,s,o)=>this.query({collection:e,operation:"update",data:{query:t,operations:s,options:o}}),remove:(t,s)=>this.query({collection:e,operation:"remove",data:{query:t,options:s}}),drop:()=>this.query({collection:e,operation:"drop"})}}};async function c(){await new a({host:"localhost",port:3351,secure:!1,username:"root",password:"root"}).auth()}c();export{a as ArcClient};
