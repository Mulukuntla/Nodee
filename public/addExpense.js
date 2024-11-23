async function handleFormSubmit(event) {
  try{
    const aa=document.getElementById("aa")
    if (aa!=null){
      aa.remove()

    }
    event.preventDefault();
    const expense=event.target.amount.value;
    const description=event.target.text.value;
    const category=event.target.cate.value;
    const obj={
      expense,
      description,
      category
    };
    const token=localStorage.getItem("token")
    const response=await axios.post("http://51.20.67.98:4000/expense/add-expense",obj,{headers :{"Authorization" :token}}) 
    console.log(response.data.newUserDetail)
    console.log("created")
    displayUserOnScreen(response.data.newUserDetail)
    document.getElementById("amount").value = "";
    document.getElementById("text").value = "";
    document.getElementById("cate").value = "";
  }
  catch(error){
    console.log(error)
  }

}
  
  
function displayUserOnScreen(userDetails) {
  if (!userDetails.expense || !userDetails.description || !userDetails.category) {
    alert("Please fill in all fields.");
    return;
  } 
  const parentNode = document.getElementById("a");
  const userItemHtml = `
  <li id="${userDetails.id}">
    ${userDetails.expense} - ${userDetails.description} - ${userDetails.category}
    <button onclick=deleteUser('${userDetails.id}')>Delete Expense</button>
  </li>
  `
  parentNode.innerHTML += userItemHtml
  }


function fetchAndDisplayUsers(allUsers) {
  const token=localStorage.getItem("token")
  const decodeToken=parseJwt(token)
  console.log(decodeToken)
  const ispremiumuser=decodeToken.ispremiumuser
  if(ispremiumuser){
    showpremiumusermessage()
    
  }
  console.log("Hi")
  console.log(allUsers)
  const a = document.getElementById("listOfItems");
  var b;
  
    console.log("Hello")
  b=`<ul id="a"><h4>Expenses</h4>
    <a id="aa">add expenses....</a>
    </ul>
  `
  
  a.innerHTML=b
  allUsers.forEach(user => {
    console.log("HIII")
    displayUserOnScreen(user)
  })
}

function showpremiumusermessage(){
  document.getElementById("rzp-button").style.visibility="hidden"
  document.getElementById("message").innerHTML="you are a premium user"
}

function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return JSON.parse(jsonPayload);
}
  
document.addEventListener('DOMContentLoaded',async function () {
  try{
  const page=1
  const token=localStorage.getItem("token")
  const pages=localStorage.getItem("pages")
  const res=await axios.get(`http://51.20.67.98:4000/expense/get-expense?page=${page}&pages=${pages}`,{headers :{"Authorization" :token}})
  console.log(res.data.products)
  fetchAndDisplayUsers(res.data.products)
  showPagination(res.data)
  const ress=await axios.get(`http://51.20.67.98:4000/income/get-income?page=${page}&pages=${pages}`,{headers :{"Authorization" :token}})
  console.log(ress.data.products)
  fetchAndDisplayUsersIncome(ress.data.products)
  showPaginationIncome(ress.data)
  
  }
  catch(error){
    console.log(error)
  }
  
})

async function deleteUser(userId) {
  try{
  const token=localStorage.getItem("token")
  const response =await axios.delete(`http://51.20.67.98:4000/expense/delete-expense/${userId}`,{headers :{"Authorization" :token}})
  removeUserFromScreen(response.data.ide);
  }
  catch(error){
    console.error('Error deleting user:', error);
  }
}
  
  // Function to remove a user from the screen
function removeUserFromScreen(userId) {
  document.getElementById(`${userId}`).remove()
}

document.getElementById("rzp-button").onclick=async function (e){
  try{
    const token=localStorage.getItem("token")
    const response=await axios.get("http://51.20.67.98:4000/purchase/premiummembership",{headers :{"Authorization" :token}})
    console.log(response)
    var options=
    {
      "key":response.data.key_id,//Enter the key id generated from the dashboard
      "order_id":response.data.order.id,//for on time payment
      //This handler function handles the successful payment
      "handler":async function (response){
        const transactionResponse=await axios.post("http://51.20.67.98:4000/purchase/updatetransactionstatus",{
          order_id:options.order_id,
          payment_id:response.razorpay_payment_id
        },{headers :{"Authorization" :token}})
        alert("you are now a premium user")
        localStorage.setItem("token",transactionResponse.data.token)
        const tokens=localStorage.getItem("token")
        const decodeToken=parseJwt(tokens)
        const ispremiumuser=decodeToken.ispremiumuser
        if(ispremiumuser){
        showpremiumusermessage()
        showLeaderBoard()
        }
      }
    }
    const rzp1=new Razorpay(options)
    rzp1.open()
    e.preventDefault()
    rzp1.on("payment.failed",async function (response){
      const transactionResponses=await axios.post("http://51.20.67.98:4000/purchase/updatetransactionstatusfailed",{
      order_id:options.order_id,
      payment_id:response.error.metadata.payment_id
    },{headers :{"Authorization" :token}});
    
    alert("Something went wrong with the payment")

    })
  }
  catch(error){
    console.log(error)
  }
}

async function showLeaderBoard(){
  try{
    const totaldownload=document.getElementById("total")
    if(totaldownload!==null){
      totaldownload.remove()
    }
    const token=localStorage.getItem("token")
    const userLeaderBoardArray=await axios.get("http://51.20.67.98:4000/premium/showLeaderboard",{headers :{"Authorization" :token}})
    console.log(userLeaderBoardArray.data.userLeaderBoardDetails)
    const leaderboardElem=document.getElementById("leaderboard")
    const b=`<ul id=leader></ul>`
    leaderboardElem.innerHTML=b
    const leaderboard=document.getElementById("leader")
    leaderboard.innerHTML="<h1>Leader Board</h1>"
    userLeaderBoardArray.data.userLeaderBoardDetails.forEach((userDetails)=>{
    leaderboard.innerHTML +=`<li>Name-${userDetails.userName} Total Expense-${userDetails.totalExpenses} `
    })
  }
  catch(error){
    document.getElementById("message1").innerHTML=`<a>${error.response.data.message}</a>`
    console.log(error)
  }

}



async function download(){
  try{
  const leaderboard=document.getElementById("leader")
  if(leaderboard!==null){
    leaderboard.remove()
  
  }
  const totaldownload=document.getElementById("total")
  if(totaldownload!==null){
    totaldownload.remove()
  }
  const token=localStorage.getItem("token")
  const response=await axios.get('http://51.20.67.98:4000/user/download', { headers: {"Authorization" : token} })
  if(response.status === 200){
    console.log(response)
    const a=document.getElementById("showUrl")
    a.href=response.data.fileUrl
    a.textContent="click to download"
    } 
    else {
      throw new Error(response.data.message)
    }
  }
  catch(err){
      document.getElementById("message2").innerHTML=`<a>${err.response.data.message}</a>`
  }
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}


async function totaldownload(){
  try{
    const leaderboard=document.getElementById("leader")
    if(leaderboard!==null){
      leaderboard.remove()
    }
    const token=localStorage.getItem("token")
    const response=await axios.get('http://51.20.67.98:4000/user/totaldownloads', { headers: {"Authorization" : token} })
    if(response.status === 200){
    console.log(response.data)
    if(response.data.totallinks.length===0){
      const a=document.getElementById("totaldownloads")
      return a.innerHTML=`<h4 id="total">Not downloaded yet</h4>`
    }
    const a=document.getElementById("totaldownloads")
    b=`<ul id="total">List of downloaded files</ul>`
    a.innerHTML=b
    response.data.totallinks.forEach(user => {
      links(user)
    })
    }
    else {
      throw new Error(response.data.message)
    }
  }
  catch(err){
    console.log(err)
    document.getElementById("message3").innerHTML=`<a>${err.response.data.message}</a>`
  };
}

function showError(err){
  document.body.innerHTML += `<div style="color:red;"> ${err}</div>`
}
function links(user){
  console.log(user)
  const parentNode = document.getElementById("total");
  const userItemHtml = `
  <li >
  <a href="${user.links}">${user.date}</a>
  </li>
  `
  parentNode.innerHTML += userItemHtml
}


function showPagination({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
})
{
  console.log("currentPage"+currentPage)
  console.log("hasNextPage"+hasNextPage)
  console.log("nextPage"+nextPage)
  console.log("hasPreviousPage"+hasPreviousPage)
  console.log("previousPage"+previousPage)
  console.log("lastPage"+lastPage)
  const pagination =document.getElementById("pagination")
  pagination.innerHTML=" ";
  if(hasPreviousPage){
    const btn2=document.createElement("button")
    btn2.innerHTML=previousPage
    btn2.addEventListener("click",()=>getProducts(previousPage))
    pagination.appendChild(btn2)
  }
  if(currentPage){
    const btn1=document.createElement("button")
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener("click",()=>getProducts(currentPage))
    pagination.appendChild(btn1)

  }
  
  if(hasNextPage){
    const btn3=document.createElement("button")
    btn3.innerHTML=nextPage
    btn3.addEventListener("click",()=>getProducts(nextPage))
    pagination.appendChild(btn3)

  }
  if(lastPage!==nextPage && lastPage!==currentPage && lastPage!=0){
    const btn4=document.createElement("button")
    btn4.innerHTML=lastPage
    btn4.addEventListener("click",()=>getProducts(lastPage))
    pagination.appendChild(btn4)

  }
}

async function getProducts(page){
  try{
  const token=localStorage.getItem("token")
  const pages=localStorage.getItem("pages")
  const res=await axios.get(`http://51.20.67.98:4000/expense/get-expense?page=${page}&pages=${pages}`,{ headers: {"Authorization" : token} })
  fetchAndDisplayUsers(res.data.products)
  showPagination(res.data)
  }
  catch(err){
      console.log(err)
  }
}

function userPages(event){
  event.preventDefault()
  const pages=event.target.pagess.value
  localStorage.setItem("pages",pages)
  console.log("Hi")
}

async function dailyBasis(){
  try{
  const token=localStorage.getItem("token")
  const ispremiumuser=await axios.get(`http://51.20.67.98:4000/user/ispremiumuser`,{ headers: {"Authorization" : token} })
  if(ispremiumuser){
    console.log("hai")
  window.location.href = "./dailyBasis.html";
  }
  }
  catch(err){
    console.log(err)
    document.getElementById("message4").innerHTML=`<a>${err.response.data.message}</a>`
  }
}



async function handleFormIncomeSubmit(event) {
  try{
    const bb=document.getElementById("bb")
    if(bb!=null){
      bb.remove()
    }
    event.preventDefault();
    const income=event.target.amount.value;
    const description=event.target.text.value;
    const category=event.target.cate.value;
    const obj={
      income,
      description,
      category
    };
    console.log(income,description,category)
    const token=localStorage.getItem("token")
    const response=await axios.post("http://51.20.67.98:4000/income/add-income",obj,{headers :{"Authorization" :token}}) 
    console.log(response)
    displayUserOnScreenIncome(response.data.newUserIncome)
    document.getElementById("income").value = "";
    document.getElementById("textIncome").value = "";
    document.getElementById("cateIncome").value = "";
  }
  catch(error){
    console.log(error)
    console.log("Something went wrong")
  }
}

function fetchAndDisplayUsersIncome(allUsers){
  const token=localStorage.getItem("token")
  const decodeToken=parseJwt(token)
  console.log(decodeToken)
  const ispremiumuser=decodeToken.ispremiumuser
  if(ispremiumuser){
    showpremiumusermessage()
  }
  console.log("Hi")
  console.log(allUsers)
  const a = document.getElementById("listOfIncomes");
  
  var b=`<ul id="b"><h4>Incomes</h4></ul>
    <a id="bb">add incomess...</a>`
  
  
  a.innerHTML=b
  allUsers.forEach(user => {
    console.log("HIII")
    displayUserOnScreenIncome(user)
  })
}

function displayUserOnScreenIncome(userDetails) {
  console.log("income----------->",userDetails)
  if (!userDetails.income || !userDetails.description || !userDetails.category) {
    alert("Please fill in all fields.");
    return;
  }
  const parentNode = document.getElementById("b");
  const userItemHtml = `
  <li id="${userDetails.id}">
    ${userDetails.income} - ${userDetails.description} - ${userDetails.category}
    <button onclick=deleteUserIncome('${userDetails.id}')>Delete Expense</button>
  </li>
  `
  parentNode.innerHTML += userItemHtml
}

  
function showPaginationIncome({
  currentPage,
  hasNextPage,
  nextPage,
  hasPreviousPage,
  previousPage,
  lastPage
})
{
  console.log("currentPage"+currentPage)
  console.log("hasNextPage"+hasNextPage)
  console.log("nextPage"+nextPage)
  console.log("hasPreviousPage"+hasPreviousPage)
  console.log("previousPage"+previousPage)
  console.log("lastPage"+lastPage)
  const pagination =document.getElementById("paginationIncome")
  pagination.innerHTML=" ";
  if(hasPreviousPage){
    const btn2=document.createElement("button")
    btn2.innerHTML=previousPage
    btn2.addEventListener("click",()=>getproductsIncome(previousPage))
    pagination.appendChild(btn2)
  }
  if(currentPage){
    const btn1=document.createElement("button")
    btn1.innerHTML=`<h3>${currentPage}</h3>`
    btn1.addEventListener("click",()=>getproductsIncome(currentPage))
    pagination.appendChild(btn1)

  }
  
  if(hasNextPage){
    const btn3=document.createElement("button")
    btn3.innerHTML=nextPage
    btn3.addEventListener("click",()=>getproductsIncome(nextPage))
    pagination.appendChild(btn3)

  }
  if(lastPage!==nextPage && lastPage!==currentPage && lastPage!==0){
    const btn4=document.createElement("button")
    btn4.innerHTML=lastPage
    btn4.addEventListener("click",()=>getproductsIncome(lastPage))
    pagination.appendChild(btn4)

  }

}

async function getproductsIncome(page){
  try{
  const token=localStorage.getItem("token")
  const pages=localStorage.getItem("pages")
  const res=await axios.get(`http://51.20.67.98:4000/income/get-income?page=${page}&pages=${pages}`,{ headers: {"Authorization" : token} })
  fetchAndDisplayUsersIncome(res.data.products)
  showPaginationIncome(res.data)
  }
  catch(err){
    console.log(err)
  }
}


async function deleteUserIncome(userId) {
  try{
  const token=localStorage.getItem("token")
  const response=await axios.delete(`http://51.20.67.98:4000/income/delete-income/${userId}`,{headers :{"Authorization" :token}})
  removeUserFromScreenIncome(response.data.ide);
  }
  catch(error){
    console.error('Error deleting user:', error);
  }
}
function removeUserFromScreenIncome(userId) {
  var child=document.getElementById(userId)
  document.getElementById("b").removeChild(child)
}




  
  