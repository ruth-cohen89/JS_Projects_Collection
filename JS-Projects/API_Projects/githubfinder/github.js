class GitHub{
    constructor(){
        //The API key is in case we make more than a 100 requests per hour
        this.client_id='9602210b6cfe538170a3';
        this.client_secret='5bb8db94a14e5a09114f532b2a808f662a2df794';
    }

    async getUser(user){
        const profileResponse=await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);
        
        const profile=await profileResponse.json();
        
        return{
            profile
        }
    }
}