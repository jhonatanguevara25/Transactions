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
    const valor =  document.getElementById("cantidad");
    let cantidad = valor.value;

    fetch(`http://localhost:5000/api/transaccion/${id}/${cantidad}`, { method: "GET" }).then((response) => {
        alert("Transacción hecha correctamente.")
        location.reload();
    })
  }