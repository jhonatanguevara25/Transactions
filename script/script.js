    fetch(`http://localhost:5000/api/read/account1`, { method: "GET" }).then((response)=> {
        response.json().then((data) => {
            const cuenta1 =  document.getElementById("cuenta1");
            cuenta1.value = data.balance;
          });
    })

    fetch(`http://localhost:5000/api/read/account2`, { method: "GET" }).then((response)=> {
        response.json().then((data) => {
            const cuenta1 =  document.getElementById("cuenta2");
            cuenta1.value = data.balance;
            
          });
    })


function transferir(id) {
    fetch(`http://localhost:5000/api/transaccion/${id}`, { method: "GET" }).then((response) => {
        alert(response);
        location.reload();
    })
  }