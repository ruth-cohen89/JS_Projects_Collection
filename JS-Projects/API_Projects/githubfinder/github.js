class GitHub{
    constructor(){
        //The API key is in case we make more than a 100 requests per hour
        this.client_id='9602210b6cfe538170a3';
        this.client_secret='e55734006135e123d000208e36c63e3dfd3605b2';
        this.repos_count=5;
        this.repos_sort='created:asc';

    }
//async await with fetch
// async function fetchUsers(){
//     const res=await fetch('https://jsonplaceholder.typicode.com/users');
//     console.log(res)
//     const data=await res.json();

//     console.log(data)
// }
// fetchUsers();
    async getUser(user){
       
        const profileResponse= await fetch(`https://api.github.com/users/${user}?client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const repoResponse= await fetch(`https://api.github.com/users/${user}/
        repos?per_page=${this.repos_count}&sort=${this.repos_sort}&client_id=${this.client_id}&client_secret=${this.client_secret}`);

        const profile=await profileResponse.json();
        const repos=await repoResponse.json();
        return{
            profile,
            repos
        }
    }
}