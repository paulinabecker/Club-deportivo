$(document).ready(function () {
  getData();
});

function getData() {
  $("#cuerpo").html("");
  axios.get("/deportes").then((data) => {
      let deportes = data.data.deportes;
      deportes.forEach((d, i) => {
        $("#cuerpo").append(`
        <tr>
            <th scope="row">${i + 1}</th>
            <td>${d.id}</td> <!-- Elimina la clase d-none -->
            <td class="text-capitalize">${d.nombre}</td>
            <td>${d.precio}</td>
            <td>
                <button class="btn btn-warning" onclick='preEdit("${d.id}","${d.nombre}","${d.precio}")' data-toggle="modal" data-target="#exampleModal">Editar</button>
                <button class="btn btn-danger" onclick='eliminar("${d.id}","${d.nombre}","${d.precio}")'>Eliminar</button>
            </td>
        </tr>
    `);
    
      });
  });
}

function preEdit(id, nombre, precio) {
  $("#idModal").val(id);
  $("#nombreModal").val(nombre);
  $("#precioModal").val(precio);
}

function agregar() {
  let nombre = $("#nombre").val();
  let precio = $("#precio").val();

  axios.get(`/agregar?nombre=${nombre}&precio=${precio}`).then((data) => {
      alert(data.data);
      getData();
  });
  $("#exampleModal").modal("hide");
}

function edit() {
  let id = $("#idModal").val();
  let nombre = $("#nombreModal").val();
  let precio = $("#precioModal").val();

  axios.get(`/editar?id=${id}&nombre=${nombre}&precio=${precio}`).then((data) => {
      alert(data.data);
      getData();
  });
  $("#exampleModal").modal("hide");
}

function eliminar(id, nombre, precio) {
  axios.get(`/eliminar?id=${id}&nombre=${nombre}&precio=${precio}`).then((data) => {
      alert(data.data);
      getData();
  });
  $("#exampleModal").modal("hide");
}
