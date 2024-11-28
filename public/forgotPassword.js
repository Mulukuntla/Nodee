async function forgotpassword(event) {
    try{
    event.preventDefault();
    const email=event.target.email.value
    console.log(email)
    const userDetails={
        email:email
    }
    console.log(userDetails)
    const response=await axios.post('http://51.20.190.3:4000/password/forgotpassword',userDetails)
    console.log(response)
    if(response.status == 200){
        document.body.innerHTML += '<div style="color:red;">Mail Successfuly sent <div>'
    } 
    else {
        throw new Error('Something went wrong!!!')
    }
    }
    catch(err){
        document.body.innerHTML += `<div style="color:red;">${err.response.data.message} <div>`;
    }
}