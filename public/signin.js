async function signin(event){
  try{
    event.preventDefault()
    const email=event.target.email.value
    const password=event.target.password.value
    const obj={
        email:email,
        password:password
    }
    const response=await axios.post("http://51.20.67.98:4000/user/signin",obj)
    alert(response.data.message)
    console.log(response.data)
    document.body.innerHTML+=`<div style="color:green;">${response.data.message}<div>`
    localStorage.setItem("token",response.data.token)
    window.location.href = "./addExpense.html";
  }
  catch(err){
    console.log(err)
    document.body.innerHTML+=`<div style="color:red;">${err.response.data.message}<div>`
  }
}

document.getElementById("forgotPassword").onclick=async function (e){
  console.log("Hi")
  window.location.href = "./forgotPassword.html";

}
  
  