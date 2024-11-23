async function signup(event){
  try{
    event.preventDefault()
    const name=event.target.name.value
    const email=event.target.email.value
    const password=event.target.password.value
    const obj={
      name:name,
      email:email,
      password:password
    }
    console.log(obj)
    const response=await axios.post("http://51.20.67.98:4000/user/signup",obj)
    console.log("created")
    console.log(response.data)
    window.location.href = "./signin.html";
  }
  catch(err){
    console.log(err)
    document.body.innerHTML+=`<div style="color:red;">${err}<div>`
  }
}