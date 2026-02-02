function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) sidebar.classList.toggle('active');
}

function toggleSubmenu(element) {
    const parentLi = element.closest('.has-submenu');
    if (parentLi) {
        const isPageActive = parentLi.classList.contains('active') && element.getAttribute('href').endsWith('talento_humano.html');
        if (!isPageActive) {
            parentLi.classList.toggle('active');
        }
    }
}

function filterColabs() {
    const input = document.getElementById('colabSearch').value.toLowerCase();
    const cards = document.getElementsByClassName('colab-card');
    Array.from(cards).forEach(card => {
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(input) ? "flex" : "none";
    });
}

function filterTab(dept, element) {
    const cards = document.getElementsByClassName('colab-card');
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(t => t.classList.remove('active'));
    if (element) {
        element.classList.add('active');
    }

    Array.from(cards).forEach(card => {
        if (dept === 'todos') {
            card.style.display = 'flex';
        } else {
            const cardDept = card.getAttribute('data-dept').toLowerCase();
            const filterDept = dept.toLowerCase();
            
            if (cardDept === filterDept || cardDept.includes(filterDept) || filterDept.includes(cardDept)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        }
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
function sendQuickWish(id, name) {
    const container = document.getElementById(id);
    const button = container.querySelector('.btn-congratulate');
    
    if (button.classList.contains('sent')) return;

    button.classList.add('sent');
    button.innerHTML = '<i class="fas fa-check"></i>';
    
    createConfetti(button);
    showToast(`🎂 Felicitaste a <strong>${name}</strong> por su cumpleaños`, 'success');
}

function sendQuickClap(id, name) {
    const container = document.getElementById(id);
    const button = container.querySelector('.btn-clap');
    
    if (button.classList.contains('clapped')) return;

    button.classList.add('clapped');
    
    createConfetti(button);
    showToast(`👏 Felicitaste por su aniversario a tu compañero <strong>${name}</strong>`, 'anniversary');
}

function createConfetti(element) {
    const rect = element.getBoundingClientRect();
    const colors = ['#800020', '#dc2626', '#f59e0b', '#10b981', '#3b82f6'];
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 8px;
            height: 8px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${rect.left + rect.width / 2}px;
            top: ${rect.top + rect.height / 2}px;
            pointer-events: none;
            z-index: 10001;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
        `;
        document.body.appendChild(confetti);
        
        const angle = (Math.random() * 360) * Math.PI / 180;
        const velocity = 3 + Math.random() * 5;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        let x = 0, y = 0, opacity = 1;
        
        const animate = () => {
            x += vx;
            y += vy + 2;
            opacity -= 0.02;
            confetti.style.transform = `translate(${x}px, ${y}px) rotate(${x * 5}deg)`;
            confetti.style.opacity = opacity;
            
            if (opacity > 0) {
                requestAnimationFrame(animate);
            } else {
                confetti.remove();
            }
        };
        
        requestAnimationFrame(animate);
    }
}

function showToast(message, type) {
    const toast = document.createElement('div');
    toast.innerHTML = message;
    const bgColor = type === 'success' ? '#059669' : '#d97706';
    toast.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%);
        background: ${bgColor};
        color: white;
        padding: 16px 28px;
        border-radius: 12px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        font-size: 0.95rem;
        max-width: 90%;
        text-align: center;
    `;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateX(-50%) translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
}

@keyframes fadeOut {
    to {
        opacity: 0;
        transform: translateX(-50%) translateY(-10px);
    }
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