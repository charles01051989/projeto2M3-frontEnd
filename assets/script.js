const baseURL = "http://localhost:3000/paletas";

const msgAlert = document.querySelector(".msg-alert");

async function findAllPaletas() {
  const response = await fetch(`${baseURL}/all-paletas`);

  const paletas = await response.json();

  paletas.forEach(function (paleta) {
    document.querySelector("#paletaList").insertAdjacentHTML(
      "beforeend",
      `
      <div class="PaletaListaItem" id= "PaletaListaItem_${paleta._id}" >
      <div>
        <div class="PaletaListaItem__sabor">${paleta.sabor}</div>
        <div class="PaletaListaItem__preco">R$${paleta.preco}</div>
        <div class="PaletaListaItem__descricao">${paleta.descricao}</div>
        
        <div class="PaletaListaItem__acoes Acoes">
        <button class="editar" onclick="abrirModal('${paleta._id}')">Editar</button>
        <button class="deletar" onclick="abrirModalDelete('${paleta._id}')">Deletar</button>
      </div>

      </div>
        <img class="PaletaListaItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}" />
       
    </div>
    
      `
    );
  });
}

findAllPaletas();

async function findByIdPaletas() {
  const id = document.querySelector("#search-input").value;

  if (id == "") {
    localStorage.setItem("message", "Digite um ID");
    localStorage.setItem("type", "danger");

    msgAlert.innerText = localStorage.getItem("message");
    msgAlert.classList.add(localStorage.getItem("type"));
    closeMsgAlert();
    return;
  }

  const response = await fetch(`${baseURL}/one-paleta/${id}`);
  const paleta = await response.json();

  if (paleta.message != undefined) {
    localStorage.setItem("message", paleta.message);
    localStorage.setItem("type", "danger");

    showMsgAlert();
    return;
  }
  document.querySelector(".list-all").style.display = "block";
  document.querySelector(".PaletaLista").style.display = "none";

  const paletaEscolhidaDiv = document.querySelector("#paletaEscolhida");
  paletaEscolhidaDiv.innerHTML = `
  <div class="PaletaCardItem" id= "PaletaListaItem_${paleta._id}">
  <div>
    <div class="PaletaCardItem__sabor">${paleta.sabor}</div>
    <div class="PaletaCardItem__preco">R$${paleta.preco}</div>
    <div class="PaletaCardItem__descricao">${paleta.descricao}</div>
    
    <div class="PaletaListaItem__acoes Acoes">
        <button class="editar" onclick="abrirModal('${paleta._id}')">Editar</button>
        <button class="deletar" onclick="abrirModalDelete('${paleta._id}')">Deletar</button>
      </div>
  </div>
    <img class="PaletaCardItem__foto" src="${paleta.foto}" alt="Paleta de ${paleta.sabor}" />
</div>

  `;
}

async function abrirModal(id = "") {
  if (id != "") {
    document.querySelector("#title-header-modal").innerText =
      "Atualizar Paleta";
    document.querySelector("#cadastrar").innerText = "Atualizar";

    const response = await fetch(`${baseURL}/one-paleta/${id}`);
    const paleta = await response.json();

    document.querySelector("#sabor").value = paleta.sabor;
    document.querySelector("#preco").value = paleta.preco;
    document.querySelector("#descricao").value = paleta.descricao;
    document.querySelector("#foto").value = paleta.foto;
    document.querySelector("#id").value = paleta._id;
  } else {
    document.querySelector("#title-header-modal").innerText =
      "Cadastrar Paleta";
    document.querySelector("#cadastrar").innerText = "Cadastrar";
  }
  document.querySelector("#overlay").style.display = "flex";
}

function fecharModalCadastro() {
  document.querySelector("#overlay").style.display = "none";

  document.querySelector("#sabor").value = "";
  document.querySelector("#preco").value = 0;
  document.querySelector("#descricao").value = "";
  document.querySelector("#foto").value = "";
}

async function submitPaleta() {
  const id = document.querySelector("#id").value;
  const sabor = document.querySelector("#sabor").value;
  const preco = document.querySelector("#preco").value;
  const descricao = document.querySelector("#descricao").value;
  const foto = document.querySelector("#foto").value;

  const paleta = {
    id,
    sabor,
    preco,
    descricao,
    foto,
  };

  const modoEdicaoAtivado = id != "";

  const endpoint =
    baseURL + (modoEdicaoAtivado ? `/update-paleta/${id}` : `/create-paleta`);

  const response = await fetch(endpoint, {
    method: modoEdicaoAtivado ? "put" : "post",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(paleta),
  });

  const novaPaleta = await response.json();

  if (novaPaleta.message != undefined) {
    localStorage.setItem("message", novaPaleta.message);
    localStorage.setItem("type", "danger");

    showMsgAlert();
    return;
  }

  if (modoEdicaoAtivado) {
    localStorage.setItem("message", "Paleta atualizada!");
    localStorage.setItem("type", "success");
  } else {
    localStorage.setItem("message", "Paleta criada!");
    localStorage.setItem("type", "success");
  }

  document.location.reload(true);
  fecharModalCadastro();
}

function abrirModalDelete(id) {
  document.querySelector("#overlay-delete").style.display = "flex";

  const btnSim = document.querySelector(".btn_delete_yes");
  btnSim.addEventListener("click", function () {
    deletePaleta(id);
  });
}
function fecharModalDelete() {
  document.querySelector("#overlay-delete").style.display = "none";
}

async function deletePaleta(id) {
  const response = await fetch(`${baseURL}/delete-paleta/${id}`, {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
  });
  const result = await response.json();

  localStorage.setItem("message", result.message);
  localStorage.setItem("type", "success");

  document.location.reload(true);

  document.getElementById("paletaList").innerHTML = "";

  fecharModalDelete();
}

function closeMsgAlert() {
  setTimeout(function () {
    msgAlert.innerText = "";
    msgAlert.classList.remove(localStorage.getItem("type"));
    localStorage.clear();
  }, 3000);
}

function showMsgAlert() {
  msgAlert.innerText = localStorage.getItem("message");
  msgAlert.classList.add(localStorage.getItem("type"));
  closeMsgAlert();
}

showMsgAlert();
