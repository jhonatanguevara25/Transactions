

function transferir(id) {
    fetch(`http://localhost:5000/api/transaccion/${id}`, { method: "GET" }).then(
      () => {
        location.reload();
      }
    );
  }