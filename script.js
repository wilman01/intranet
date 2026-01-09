function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function filterColabs() {
    const input = document.getElementById('colabSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('colab-card');
    Array.from(cards).forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    });
}

function filterTab(dept) {
    const cards = document.getElementsByClassName('colab-card');
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(t => t.classList.remove('active'));
    event.currentTarget.classList.add('active');

    Array.from(cards).forEach(card => {
        const cardDept = card.getAttribute('data-dept');
        card.style.display = (dept === 'todos' || cardDept === dept) ? "flex" : "none";
    });
}
// Abrir el modal
function openModal(tipo) {
    const modal = document.getElementById('requestModal');
    const title = document.getElementById('modalTitle');
    
    if (tipo === 'constancia') {
        title.innerText = "Solicitud de Constancia de Trabajo";
    }
    
    modal.style.display = 'flex';
}

// Cerrar el modal
function closeModal() {
    document.getElementById('requestModal').style.display = 'none';
}

// Simular envío
function enviarSolicitud() {
    const destinatario = document.getElementById('destinatario').value;
    if (!destinatario) {
        alert("Por favor seleccione un destinatario.");
        return;
    }
    
    alert("Solicitud enviada con éxito. Recibirá un correo cuando esté lista.");
    closeModal();
}

// Cerrar modal si se hace clic fuera de la caja blanca
window.onclick = function(event) {
    const modal = document.getElementById('requestModal');
    if (event.target == modal) {
        closeModal();
    }
}
function sendQuickWish(id) {
    const container = document.getElementById(id);
    const button = container.querySelector('.btn-congratulate');
    
    // Si ya fue enviado, no hacer nada
    if (button.classList.contains('sent')) return;

    // Cambiar estado visual del botón
    button.classList.add('sent');
    button.innerHTML = '<i class="fas fa-check"></i>';
    
    // Opcional: Una notificación pequeña que desaparece
    const toast = document.createElement('div');
    toast.innerHTML = "¡Felicitación enviada!";
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #27ae60; color: white; padding: 10px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000; animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}
function sendQuickClap(id) {
    const container = document.getElementById(id);
    const button = container.querySelector('.btn-clap');
    
    if (button.classList.contains('clapped')) return;

    button.classList.add('clapped');
    // Mantenemos el icono de aplauso pero el botón cambia de color y rebota por el CSS
    
    const toast = document.createElement('div');
    toast.innerHTML = "👏 ¡Reconocimiento enviado!";
    toast.style.cssText = `
        position: fixed; bottom: 20px; right: 20px;
        background: #f39c12; color: white; padding: 10px 20px;
        border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        z-index: 10000; animation: fadeIn 0.3s ease;
    `;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 500);
    }, 2000);
}
// Función para mostrar el perfil en grande
function showColabProfile(nombre, cargo, foto) {
    document.getElementById('profileName').innerText = nombre;
    document.getElementById('profileRole').innerText = cargo;
    document.getElementById('profilePhoto').style.backgroundImage = `url('${foto}')`;
    document.getElementById('profileModal').style.display = 'flex';
}

// Función para cerrar el perfil
function closeProfile() {
    document.getElementById('profileModal').style.display = 'none';
}