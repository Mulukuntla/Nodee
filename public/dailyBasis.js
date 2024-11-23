async function dayExpense(event){
    try{
    event.preventDefault()
    const date=event.target.date.value
    const obj={
        date:date
    }
    const token=localStorage.getItem("token")
    const res=await axios.post(`http://51.20.67.98:4000/expense/day-expense`,obj,{ headers: {"Authorization" : token} })
    const incomes=res.data.newUserDetail.income
    const expenses=res.data.newUserDetail.expense
    const day=document.getElementById("tables")
    const b=
        `
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Income</th>
            <th>Expense</th>
          </tr>
        </thead>
        <tbody id="daily">
          
        </tbody>

        `
        day.innerHTML=b
        var totalExpense=0
        var totalIncome=0
        res.data.newUserDetail.forEach(element => {
            if(element.expense){
                totalExpense=totalExpense+element.expense
            }
            if(element.income){
                totalIncome=totalIncome+element.income
            }
            showOnScreen(element)
        });
        ShowTotalOnScreen(totalExpense,totalIncome)
    }
    catch(err){
      console.log(err)
    }
}

function showOnScreen(newUserDetail){
    const date=newUserDetail.date
    const description=newUserDetail.description
    const category=newUserDetail.category
    var income=newUserDetail.income
    var expense=newUserDetail.expense
    
    if(expense){
        income=0
    }
    if(income){
        expense=0
    }
    const dayss=document.getElementById("daily")
    const c=
    `
    <tr>
        <td>${date}</td>
        <td>${description}</td>
        <td>${category}</td>
        <td>${income}</td>
        <td>${expense}</td>
    </tr>

    `
    dayss.innerHTML=dayss.innerHTML+c

}




async function weekExpense(event){
    try{
        event.preventDefault()
        const input=event.target.week.value
        const [year, week] = input.split('-W');
        const obj={
            year:year,
            week:week
        }
        const token=localStorage.getItem("token")
        const res=await axios.post(`http://51.20.67.98:4000/expense/week-expense`,obj,{ headers: {"Authorization" : token} })
        console.log(res.data)
        const day=document.getElementById("tables")
        const b=
        `
        <thead>
            <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Income</th>
            <th>Expense</th>
            </tr>
        </thead>
        <tbody id="daily">
            
        </tbody>

        `
        day.innerHTML=b
        var totalExpense=0
        var totalIncome=0
        res.data.newUserDetail.forEach(element => {
            console.log(element.updatedAt)
            if(element.expense){
                totalExpense=totalExpense+element.expense
            }
            if(element.income){
                totalIncome=totalIncome+element.income
            }
            showOnScreen(element)
            
        });
        ShowTotalOnScreen(totalExpense,totalIncome)
    }
    catch(err){
        console.log(err)
    }
}

async function monthExpense(event){
    try{
        event.preventDefault()
        const input=event.target.month.value
        const [year,month] = input.split('-');
        console.log(year,month)
        const obj={
            year:year,
            month:month
        }
        const token=localStorage.getItem("token")
        const res=await axios.post(`http://51.20.67.98:4000/expense/month-expense`,obj,{ headers: {"Authorization" : token} })
        const day=document.getElementById("tables")
        const b=
        `
        <thead>
        <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th>Income</th>
            <th>Expense</th>
        </tr>
        </thead>
        <tbody id="daily">
        
        </tbody>

        `
        day.innerHTML=b
        var totalExpense=0
        var totalIncome=0
        res.data.newUserDetail.forEach(element => {
            if(element.expense){
                totalExpense=totalExpense+element.expense
            }
            if(element.income){
                totalIncome=totalIncome+element.income
            }
            showOnScreen(element)
        });
        ShowTotalOnScreen(totalExpense,totalIncome)
    }
    catch(err){
        console.log(err)
    }
}

function ShowTotalOnScreen(totalExpense,totalIncome){
    var a=totalIncome-totalExpense
    var d;
    if(a>0){
        d=`<a style="color:green;">Savings</a>`
    }
    if(a<0){
        d=`<a style="color:red;">Deficit</a>`
        a=a*-1
    }
    if(totalIncome===totalExpense){
        d=`<a style="color:Orange;">Income = Expense</a>`
    }
    const dayss=document.getElementById("daily")
    const c=
    `
    <tr>
        
        <td colspan="3"></td>
        <td>total:${totalIncome}</td>
        <td>total:${totalExpense}</td>
    </tr>
    
    <tr>
        
        <td colspan="3"></td>
        <td colspan="2">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${d} : ${a}</td>
    </tr>


    `
    dayss.innerHTML=dayss.innerHTML+c
   

}