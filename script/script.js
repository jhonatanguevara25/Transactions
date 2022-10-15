

function transferir(id) {
    fetch(`http://localhost:5000/api/transaccion/${id}`, { method: "GET" }).then((response) => {
        alert(response);
        location.reload();
    })
  }