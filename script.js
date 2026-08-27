"use strict";

const ADMIN_PASSWORD = "1234";

const STORAGE_KEY = "barberHouseServices";


const DEFAULT_SERVICES = [

    {
        id: 1,
        name: "Мужская стрижка",
        description: "Стрижка машинкой и ножницами с учётом твоего стиля.",
        price: 25
    },

    {
        id: 2,
        name: "Стрижка + борода",
        description: "Полный уход за волосами и оформление бороды.",
        price: 40
    },

    {
        id: 3,
        name: "Оформление бороды",
        description: "Форма, контуры и аккуратный уход за бородой.",
        price: 20
    }

];


function getServices() {

    const saved =
        localStorage.getItem(STORAGE_KEY);

    if (!saved) {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_SERVICES)
        );

        return [...DEFAULT_SERVICES];
    }

    try {

        const services =
            JSON.parse(saved);

        if (!Array.isArray(services)) {
            throw new Error();
        }

        return services;

    } catch {

        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(DEFAULT_SERVICES)
        );

        return [...DEFAULT_SERVICES];
    }
}


function saveServices(services) {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(services)
    );

}


function escapeHTML(value) {

    return String(value)

        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function renderWebsiteServices() {

    const container =
        document.getElementById("servicesList");

    if (!container) {
        return;
    }

    const services =
        getServices();

    container.innerHTML = "";


    services.forEach(
        (service, index) => {

            const card =
                document.createElement("div");

            card.className = "card";


            card.innerHTML = `

                <span class="service-number">
                    ${String(index + 1).padStart(2, "0")}
                </span>

                <h3>
                    ${escapeHTML(service.name)}
                </h3>

                <p>
                    ${escapeHTML(service.description)}
                </p>

                <strong>
                    $${service.price}
                </strong>

            `;


            container.appendChild(card);

        }
    );

}


const loginElement =
    document.getElementById("login");

const panelElement =
    document.getElementById("panel");

const passwordElement =
    document.getElementById("password");

const loginButton =
    document.getElementById("loginButton");

const logoutButton =
    document.getElementById("logoutButton");

const adminServicesElement =
    document.getElementById("adminServices");

const addServiceButton =
    document.getElementById("addServiceButton");

const serviceModal =
    document.getElementById("serviceModal");

const closeModalButton =
    document.getElementById("closeModalButton");

const cancelButton =
    document.getElementById("cancelButton");

const saveButton =
    document.getElementById("saveButton");

const modalTitle =
    document.getElementById("modalTitle");

const editingId =
    document.getElementById("editingId");

const serviceName =
    document.getElementById("serviceName");

const serviceDescription =
    document.getElementById("serviceDescription");

const servicePrice =
    document.getElementById("servicePrice");


function login() {

    if (!passwordElement) {
        return;
    }

    const password =
        passwordElement.value;


    if (password === ADMIN_PASSWORD) {

        localStorage.setItem(
            "barberHouseAdmin",
            "true"
        );

        showAdmin();

    } else {

        alert("Неверный пароль.");

        passwordElement.value = "";

        passwordElement.focus();
    }

}


function showAdmin() {

    if (!loginElement || !panelElement) {
        return;
    }

    loginElement.style.display = "none";

    panelElement.style.display = "flex";

    renderAdminServices();

}


function logout() {

    localStorage.removeItem(
        "barberHouseAdmin"
    );

    window.location.reload();

}


function renderAdminServices() {

    if (!adminServicesElement) {
        return;
    }

    const services =
        getServices();

    adminServicesElement.innerHTML = "";


    if (services.length === 0) {

        adminServicesElement.innerHTML = `

            <div class="admin-service">

                <div class="admin-service-info">

                    <span class="service-number">
                        —
                    </span>

                    <div>

                        <h3>
                            Услуг пока нет
                        </h3>

                        <p>
                            Добавьте первую услугу.
                        </p>

                    </div>

                </div>

            </div>

        `;

        return;
    }


    services.forEach(
        (service, index) => {

            const item =
                document.createElement("div");

            item.className =
                "admin-service";


            item.innerHTML = `

                <div class="admin-service-info">

                    <span class="service-number">
                        ${String(index + 1).padStart(2, "0")}
                    </span>

                    <div>

                        <h3>
                            ${escapeHTML(service.name)}
                        </h3>

                        <p>
                            ${escapeHTML(service.description)}
                        </p>

                    </div>

                </div>


                <div class="admin-price">
                    $${service.price}
                </div>


                <div class="admin-actions">

                    <button
                        class="edit-service"
                        data-id="${service.id}"
                    >
                        Изменить
                    </button>

                    <button
                        class="delete delete-service"
                        data-id="${service.id}"
                    >
                        Удалить
                    </button>

                </div>

            `;


            adminServicesElement.appendChild(item);

        }
    );

}


function openAddService() {

    if (!serviceModal) {
        return;
    }

    editingId.value = "";

    serviceName.value = "";

    serviceDescription.value = "";

    servicePrice.value = "";

    modalTitle.textContent =
        "Новая услуга";

    serviceModal.classList.add("active");

    serviceName.focus();

}


function openEditService(id) {

    const services =
        getServices();

    const service =
        services.find(
            item => item.id === id
        );


    if (!service) {
        return;
    }


    editingId.value =
        service.id;

    serviceName.value =
        service.name;

    serviceDescription.value =
        service.description;

    servicePrice.value =
        service.price;

    modalTitle.textContent =
        "Изменить услугу";

    serviceModal.classList.add("active");

    serviceName.focus();

}


function saveService() {

    const name =
        serviceName.value.trim();

    const description =
        serviceDescription.value.trim();

    const price =
        Number(servicePrice.value);

    const id =
        editingId.value;


    if (!name) {

        alert("Введите название услуги.");

        serviceName.focus();

        return;
    }


    if (
        servicePrice.value === "" ||
        !Number.isFinite(price) ||
        price < 0
    ) {

        alert("Введите корректную цену.");

        servicePrice.focus();

        return;
    }


    const services =
        getServices();


    if (id !== "") {

        const service =
            services.find(
                item => item.id === Number(id)
            );


        if (service) {

            service.name =
                name;

            service.description =
                description;

            service.price =
                price;

        }

    }

    else {

        services.push({

            id: Date.now(),

            name: name,

            description: description,

            price: price

        });

    }


    saveServices(services);

    closeModal();

    renderAdminServices();

}


function removeService(id) {

    const services =
        getServices();

    const service =
        services.find(
            item => item.id === id
        );


    if (!service) {
        return;
    }


    const confirmed =
        confirm(
            `Удалить услугу "${service.name}"?`
        );


    if (!confirmed) {
        return;
    }


    const newServices =
        services.filter(
            item => item.id !== id
        );


    saveServices(newServices);

    renderAdminServices();

}


function closeModal() {

    if (!serviceModal) {
        return;
    }

    serviceModal.classList.remove("active");

}


if (loginButton) {

    loginButton.addEventListener(
        "click",
        login
    );

}


if (passwordElement) {

    passwordElement.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                login();
            }

        }
    );

}


if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        logout
    );

}


if (addServiceButton) {

    addServiceButton.addEventListener(
        "click",
        openAddService
    );

}


if (closeModalButton) {

    closeModalButton.addEventListener(
        "click",
        closeModal
    );

}


if (cancelButton) {

    cancelButton.addEventListener(
        "click",
        closeModal
    );

}


if (saveButton) {

    saveButton.addEventListener(
        "click",
        saveService
    );

}


if (adminServicesElement) {

    adminServicesElement.addEventListener(
        "click",
        event => {

            const editButton =
                event.target.closest(
                    ".edit-service"
                );


            const deleteButton =
                event.target.closest(
                    ".delete-service"
                );


            if (editButton) {

                const id =
                    Number(
                        editButton.dataset.id
                    );

                openEditService(id);

            }


            if (deleteButton) {

                const id =
                    Number(
                        deleteButton.dataset.id
                    );

                removeService(id);

            }

        }
    );

}


if (serviceModal) {

    serviceModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                serviceModal
            ) {

                closeModal();

            }

        }
    );

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        renderWebsiteServices();


        if (
            panelElement &&
            localStorage.getItem(
                "barberHouseAdmin"
            ) === "true"
        ) {

            showAdmin();

        }

    }
);