document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-agregar-producto');
  const productosContainer = document.querySelector(
    '.productos-container .productos-contenido'
  );
  const noProductosMessage = document.getElementById('no-productos');

  // Obtener productos desde el servidor
  fetch('http://localhost:3001/productos')
    .then((response) => response.json())
    .then((productos) => {
      if (productos && productos.length > 0) {
        noProductosMessage.style.display = 'none';
        renderProductos(productos);
      } else {
        noProductosMessage.style.display = 'block';
      }
    })
    .catch((error) => {
      console.error('Error al obtener productos:', error);
    });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const precio = document.getElementById('precio').value;
    const imagen = document.getElementById('imagen').value;

    const nuevoProducto = {
      nombre: nombre,
      precio: precio,
      imagen: imagen,
    };

    // Enviar producto al servidor
    fetch('http://localhost:3001/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(nuevoProducto),
    })
      .then((response) => response.json())
      .then((productoGuardado) => {
        noProductosMessage.style.display = 'none';
        agregarProducto(productoGuardado);
        form.reset();
      })
      .catch((error) => {
        console.error('Error al agregar producto:', error);
      });
  });

  function agregarProducto(producto) {
    const row = document.querySelector('.productos-contenido .row:last-child');

    if (!row || row.children.length === 3) {
      const newRow = document.createElement('div');
      newRow.classList.add('row');
      productosContainer.appendChild(newRow);
      crearCardProducto(producto, newRow);
    } else {
      crearCardProducto(producto, row);
    }
  }

  function crearCardProducto(producto, row) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.innerHTML = `
              <img src="${producto.imagen}" alt="${producto.nombre}">
              <div class="card-container--info">
                  <p>${producto.nombre}</p>
              </div>
              <div class="card-container--value">
                  <p>$ ${producto.precio}</p>
                  <i class="fas fa-trash-alt" data-id="${producto.id}"></i>
              </div>
          `;

    productCard
      .querySelector('.fas.fa-trash-alt')
      .addEventListener('click', () => {
        const productoId = productCard
          .querySelector('.fas.fa-trash-alt')
          .getAttribute('data-id');
        eliminarProducto(productoId, productCard);
      });

    row.appendChild(productCard);
  }

  function eliminarProducto(id, cardElement) {
    fetch(`http://localhost:3001/productos/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          cardElement.remove();
          if (!document.querySelector('.productos-container .product-card')) {
            noProductosMessage.style.display = 'block';
          }
        } else {
          console.error('Error al eliminar producto');
        }
      })
      .catch((error) => {
        console.error('Error al eliminar producto:', error);
      });
  }

  function renderProductos(productos) {
    productos.forEach((producto, index) => {
      const row =
        Math.floor(index / 3) === index / 3
          ? null
          : document.querySelector('.productos-contenido .row:last-child');

      if (!row || row.children.length === 3) {
        const newRow = document.createElement('div');
        newRow.classList.add('row');
        productosContainer.appendChild(newRow);
        crearCardProducto(producto, newRow);
      } else {
        crearCardProducto(producto, row);
      }
    });
  }
});
