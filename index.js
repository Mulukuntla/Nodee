function handleFormSubmit(event) {
  event.preventDefault();
  const element = document.getElementById("showAtt");
  
  if (element !== null){
    element.remove();
  }
  const elementt = document.getElementById("markAtt");
  
  if (elementt !== null){
    elementt.remove();
  }
  const elementtt = document.getElementById("showTotall");
  
  if (elementtt !== null){
    elementtt.remove();
  }
  const date=event.target.date.value
  if (date===""){
    return
  }

  axios.get(`http://localhost:4001/user/get-attendance/${date}`)
  .then(response =>{
    if(response.data.getDate !== null){
      gett(date)
    }
    else{
      showNames(event)
    }

    

  })
  .catch(error =>{
    console.log(error)

  })
  
  
    
  }
  function submitt(event){
    event.preventDefault()
    const date=event.target.datee.value
    const Siva=event.target.Siva.value
    const Rajesh=event.target.Rajesh.value
    const Ashok=event.target.Ashok.value
    const Sai=event.target.Sai.value
    const Haritha=event.target.Haritha.value
    const Ram=event.target.Ram.value
    const Krishna=event.target.Krishna.value
    const Anu=event.target.Anu.value
    const Ammu=event.target.Ammu.value
    const Adi=event.target.Adi.value
    const obj={
      date,
      Siva,
      Rajesh,
      Ashok,
      Sai,
      Haritha,
      Ram,
      Krishna,
      Anu,
      Ammu,
      Adi,
    }

    axios.post("http://localhost:4001/user/add-attendance",obj)
    .then(response =>{
      const date=response.data.newDate.date
      gett(date)
      

    })
    .catch(error =>{
      console.log(error)

    })
  }
  function gett(date){
    const element = document.getElementById("showAtt");
  
    if (element !== null){
      element.remove();
    }
    const elementt = document.getElementById("markAtt");
  
    if (elementt !== null){
      elementt.remove();
    }
    const elementtt = document.getElementById("showTotall");
  
    if (elementtt !== null){
      elementtt.remove();
    }
    axios.get(`http://localhost:4001/user/get-attendance/${date}`)
    .then( (response) => {
      const Siva1=response.data.getDate.Siva
      const Rajesh1=response.data.getDate.Rajesh
      const Ashok1=response.data.getDate.Ashok
      const Sai1=response.data.getDate.Sai
      const Haritha1=response.data.getDate.Haritha
      const Ram1=response.data.getDate.Ram
      const Krishna1=response.data.getDate.Krishna
      const Anu1=response.data.getDate.Anu
      const Ammu1=response.data.getDate.Ammu
      const Adi1=response.data.getDate.Adi
      var Siva2;
      let Rajesh2;
      let Ashok2;
      let Sai2;
      let Haritha2;
      let Ram2;
      let Krishna2;
      let Anu2;
      let Ammu2;
      let Adi2;
      if(Siva1 ==="present"){
        Siva2 = "✔️"
      }
      else{
        Siva2="❌"
      }
      if(Rajesh1 ==="present"){
        Rajesh2 = "✔️"
      }
      else{
        Rajesh2="❌"
      }
      if(Ashok1 ==="present"){
        Ashok2 = "✔️"
      }
      else{
        Ashok2="❌"
      }
      if(Sai1 ==="present"){
        Sai2 = "✔️"
      }
      else{
        Sai2="❌"
      }
      if(Haritha1 ==="present"){
        Haritha2 = "✔️"
      }
      else{
        Haritha2="❌"
      }
      if(Ram1 ==="present"){
        Ram2 = "✔️"
      }
      else{
        Ram2="❌"
      }
      if(Krishna1 ==="present"){
        Krishna2 = "✔️"
      }
      else{
        Krishna2="❌"
      }
      if(Anu1 ==="present"){
        Anu2 = "✔️"
      }
      else{
        Anu2="❌"
      }
      if(Ammu1 ==="present"){
        Ammu2 = "✔️"
      }
      else{
        Ammu2="❌"
      }
      if(Adi1 ==="present"){
        Adi2 = "✔️"
      }
      else{
        Adi2="❌"
      }

    const parentNodes = document.getElementById("showAttendance");
    console.log(parentNodes)
    const userItemHtmls = `
      <form id="showAtt">
      Siva :&nbsp&nbsp&nbsp&nbsp&nbsp  <a> ${Siva2} ${Siva1}</a><br><br>
      Rajesh :&nbsp  <a> ${Rajesh2} ${Rajesh1} </a><br><br>
      Ashok :&nbsp  <a> ${Ashok2} ${Ashok1} </a><br><br> 
      Sai :&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp  <a> ${Sai2} ${Sai1} </a><br><br>
      Haritha :  <a> ${Haritha2} ${Haritha1} </a><br><br>
      Ram :&nbsp&nbsp&nbsp&nbsp&nbsp  <a> ${Ram2} ${Ram1} </a><br><br> 
      Krishna :  <a> ${Krishna2} ${Krishna1} </a><br><br>
      Anu :&nbsp&nbsp&nbsp&nbsp&nbsp  <a> ${Anu2} ${Anu1} </a><br><br> 
      Ammu :&nbsp  <a> ${Ammu2} ${Ammu1} </a><br><br> 
      Adi :&nbsp&nbsp&nbsp&nbsp&nbsp  <a> ${Adi2} ${Adi1} </a><br><br> 
      </form>
     
    `
    parentNodes.innerHTML =userItemHtmls

      
      
      
    })
    .catch(error =>{
      console.log(error)
    })
  }

function showNames(event){
  event.preventDefault()
  const element = document.getElementById("showAtt");
  
  if (element !== null){
    element.remove();
  }
  const elementt = document.getElementById("markAtt");
  
  if (elementt !== null){
    elementt.remove();
  }
  const elementtt = document.getElementById("showTotall");
  
  if (elementtt !== null){
    elementtt.remove();
  }
  
  const date=event.target.date.value
  console.log(date)
  const parentNodes = document.getElementById("login");
  console.log(parentNodes)
    
  userItemHtmls = `
      <form id="markAtt" onsubmit="submitt(event)">
      <input type="hidden" name="datee" value="${date}">
      Siva :<input type="radio" name="Siva" value="present">Present <input type="radio" name="Siva" value="absent">Absent<br><br>
      Rajesh :<input type="radio" name="Rajesh" value="present">Present <input type="radio" name="Rajesh" value="absent">Absent<br><br>
      Ashok :<input type="radio" name="Ashok" value="present">Present <input type="radio" name="Ashok" value="absent">Absent<br><br> 
      Sai :<input type="radio" name="Sai" value="present">Present <input type="radio" name="Sai" value="absent">Absent<br><br> 
      Haritha :<input type="radio" name="Haritha" value="present">Present <input type="radio" name="Haritha" value="absent">Absent<br><br> 
      Ram :<input type="radio" name="Ram" value="present">Present <input type="radio" name="Ram" value="absent">Absent<br><br> 
      Krishna :<input type="radio" name="Krishna" value="present">Present <input type="radio" name="Krishna" value="absent">Absent<br><br> 
      Anu :<input type="radio" name="Anu" value="present">Present <input type="radio" name="Anu" value="absent">Absent<br><br> 
      Ammu :<input type="radio" name="Ammu" value="present">Present <input type="radio" name="Ammu" value="absent">Absent<br><br> 
      Adi :<input type="radio" name="Adi" value="present">Present <input type="radio" name="Adi" value="absent">Absent<br><br>    
      <button style="background-color: rgb(209, 180, 13); color: white; padding: 5px 5px; border: none; border-radius: 5px;" type="submit">Mark Attendance</button>     
      </form>
     
    `
    parentNodes.innerHTML += userItemHtmls
    

}
function handleForm(){
  
  const element = document.getElementById("showAtt");
  
  if (element !== null){
    element.remove();
  }
  const elementt = document.getElementById("markAtt");
  
  if (elementt !== null){
    elementt.remove();
  }
  const elementtt = document.getElementById("showTotall");
  
  if (elementtt !== null){
    elementtt.remove();
  }
  axios.get(`http://localhost:4001/user/get-attendance`)
  .then(response =>{
    var Siva1=0
    let Rajesh1=0
    let Ashok1=0
    let Sai1=0
    let Haritha1=0
    let Ram1=0
    let Krishna1=0
    let Anu1=0
    let Ammu1=0
    let Adi1=0
    let total=0
    response.data.getUsers.forEach(user =>{
      total=total+1
      if(user.Siva=="present"){
        Siva1=Siva1+1
      }
      if(user.Rajesh=="present"){
        Rajesh1=Rajesh1+1
        
      }
      if(user.Ashok=="present"){
        Ashok1=Ashok1+1
        
      }
      if(user.Sai=="present"){
        Sai1=Sai1+1
        
      }
      if(user.Haritha=="present"){
        Haritha1=Haritha1+1
        
      }
      if(user.Ram=="present"){
        Ram1=Ram1+1
        
      }
      if(user.Krishna=="present"){
        Krishna1=Krishna1+1
        
      }
      if(user.Anu=="present"){
        Anu1=Anu1+1
        
      }
      if(user.Ammu=="present"){
        Ammu1=Ammu1+1
        
      }
      if(user.Adi=="present"){
        Adi1=Adi1+1
        
      }
    })
    let Siva2=Math.floor((Siva1/total)*100)
    let Rajesh2=Math.floor((Rajesh1/total)*100)
    let Ashok2=Math.floor((Ashok1/total)*100)
    let Sai2=Math.floor((Sai1/total)*100)
    let Haritha2=Math.floor((Haritha1/total)*100)
    let Ram2=Math.floor((Ram1/total)*100)
    let Krishna2=Math.floor((Krishna1/total)*100)
    let Anu2=Math.floor((Anu1/total)*100)
    let Ammu2=Math.floor((Ammu1/total)*100)
    let Adi2=Math.floor((Adi1/total)*100)
    const parentNodes = document.getElementById("showTotal");
    
    const userItemHtmls = `
      <form id="showTotall">
      Siva:&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp&nbsp <span>${Siva1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Siva2}%</span><br><br>
      Rajesh :&nbsp;&nbsp;&nbsp;&nbsp&nbsp  <span>  ${Rajesh1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${Rajesh2}% </span><br><br>
      Ashok  :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp  <a>  ${Ashok1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Ashok2}% </a><br><br>
      Sai    :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp&nbsp&nbsp  <a>  ${Sai1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Sai2}% </a><br><br>
      Haritha:&nbsp;&nbsp;&nbsp;&nbsp&nbsp  <a>  ${Haritha1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Haritha2}% </a><br><br> 
      Ram    :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp  <a>  ${Ram1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Ram2}%  </a><br><br> 
      Krishna:&nbsp;&nbsp;&nbsp;&nbsp&nbsp  <a>  ${Krishna1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Krishna2}% </a><br><br> 
      Anu    :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp  <a>  ${Anu1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Anu2}%  </a><br><br> 
      Ammu   :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;  <a>  ${Ammu1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Ammu2}%  </a><br><br> 
      Adi    :&nbsp;&nbsp;&nbsp;&nbsp&nbsp;&nbsp;&nbsp;&nbsp&nbsp  <a>  ${Adi1}/${total}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp${Adi2}% </a><br><br> 
      </form>
     
    `
    parentNodes.innerHTML =userItemHtmls
    
  })
  
}

  