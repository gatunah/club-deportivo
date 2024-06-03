$(document).ready(function () {
  getData();
});

function getData() {
  $("#cuerpo").html("");
  axios.get("/deportes").then((response) => {
    const deportes = response.data.deportes;
    //console.log(deportes);
    deportes.forEach((d, i) => {
      $("#cuerpo").append(`
        <tr>
          <th scope="row">${i + 1}</th>
          <td>${d.nombre}</td>
          <td>${d.precio}</td>
          <td>
            <button class="btn btn-warning" onclick='preEdit("${d.nombre}","${
        d.precio
      }")' data-toggle="modal" data-target="#exampleModal">Editar</button>
            <td>
            <button class="btn btn-danger" onclick='eliminar("${
              d.nombre
            }")'>Eliminar</button>
          </td>
          </td>
        </tr>
        `);
    });
  });
}

function preEdit(nombre, precio) {
  $("#nombreModal").val(nombre);
  $("#precioModal").val(precio);
}

function agregar() {
  let nombre = $('#nombre').val().trim().toLowerCase();
  let precio = $('#precio').val().trim();
  
  if (!nombre || !precio) {
    tastAlert("Debes ingresar ambos valores");
  } else if (isNaN(precio)) {
    tastAlert("Solo debes ingresar números");
  } else {
    axios.get(`/agregar?nombre=${nombre}&precio=${precio}`)
      .then((response) => {
        if (response.status === 200) {
          tastAlert('Deporte agregado');
          getData();
        }
      })
      .catch((error) => {
        if (error.response.status === 400) {
          tastAlert('Deporte ya existe');
        } else {
          tastAlert('Error al enviar solicitud');
        }
      });
  }
  
  $('#exampleModal').modal('hide');
}

function edit() {
  let nombre = $("#nombreModal").val();
  let precio = $("#precioModal").val();
  axios
    .get(`/editar?nombre=${nombre}&precio=${precio}`)
    .then((data) => {
      tastAlert("Deporte editado");
      getData();
    })
    .catch(() => {
      tastAlert("Error al editar");
    });
  $("#exampleModal").modal("hide");
}

function eliminar(nombre) {
  $("#toastContainer").empty();
  const toast = `
    <div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
      <div class="toast-header">
        <strong class="mr-auto">Eliminar Deporte</strong>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="toast-body">
        ¿Estás seguro de que deseas eliminar el deporte: ${nombre}?
        <button type="button" class="btn btn-danger btn-sm ml-2" onclick="confirmarEliminar('${nombre}')">Eliminar</button>
      </div>
    </div>
  `;

  $("#toastContainer").append(toast);
  $(".toast").toast("show");
  $("#exampleModal").modal("hide");
}

function confirmarEliminar(nombre) {
  $(".toast").toast("hide");
  axios
    .get(`/eliminar?nombre=${nombre}`)
    .then((response) => {
      if (response.status === 200) {
        tastAlert("Deporte eliminado");
        getData();
      } else {
        tastAlert("Error al eliminar deporte");
      }
    })
    .catch((error) => {
      tastAlert("Error al enviar solicitud");
    });
}
function tastAlert(message) {
  $("#toastContainer").empty();
  const toast = `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true" data-delay="5000">
    <div class="toast-header">
      <strong class="me-auto">Alert</strong>
      <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>  </div>
    <div class="toast-body">
      ${message}
    </div>
    </div>`;
  $("#toastContainer").append(toast);
  $(".toast").toast("show");
  $("#exampleModal").modal("hide");
}
