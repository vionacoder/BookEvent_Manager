const form = document.getElementById("eventForm");
const tableBody = document.getElementById("eventTableBody");
const formTitle = document.getElementById("formTitle");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");

let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = null;
let searchQuery = "";

renderTable();

// Render tabel event
function renderTable() {
    tableBody.innerHTML = "";

    const filteredEvents = events.filter(e =>
        e.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.lokasi.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredEvents.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center">Belum ada event</td></tr>`;
        return;
    }

    filteredEvents.forEach((e, index) => {
        const now = new Date();
        const eventTime = new Date(e.waktu);

        let status;
        if (eventTime < now) {
            status = "TIDAK TERSEDIA";
        } else {
            status = e.peserta >= e.kapasitas ? "PENUH" : "TERSEDIA";
        }

        let statusClass;
        if (status === "TERSEDIA") statusClass = "status-teredia";
        else statusClass = "status-penuh";

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${e.judul}</td>
            <td>${e.waktu}</td>
            <td>${e.lokasi}</td>
            <td>${e.kapasitas}</td>
            <td class="${statusClass}">${status}</td>
            <td>${e.deskripsi}</td>
            <td>
                <button class="btn-edit" onclick="editEvent(${events.indexOf(e)})">Edit</button>
                <button class="btn-delete" onclick="deleteEvent(${events.indexOf(e)})">Hapus</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Tambah / Update Event
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const eventData = {
        judul: form.title.value.trim(),
        waktu: form.date.value,
        lokasi: form.location.value.trim(),
        kapasitas: parseInt(form.capacity.value),
        deskripsi: form.description.value.trim(),
        peserta: 0
    };

    if (editIndex !== null) {
        events[editIndex] = { ...events[editIndex], ...eventData };
        editIndex = null;
        formTitle.textContent = "Tambah Event";
    } else {
        events.push(eventData);
    }

    localStorage.setItem("events", JSON.stringify(events));
    renderTable();
    form.reset();
});

// Reset form
resetBtn.addEventListener("click", () => {
    editIndex = null;
    formTitle.textContent = "Tambah Event";
});

// Edit Event
function editEvent(index) {
    const e = events[index];
    form.title.value = e.judul;
    form.date.value = e.waktu;
    form.location.value = e.lokasi;
    form.capacity.value = e.kapasitas;
    form.description.value = e.deskripsi;

    editIndex = index;
    formTitle.textContent = "Edit Event";
}

// Hapus Event
function deleteEvent(index) {
    if (confirm(`Hapus event "${events[index].judul}"?`)) {
        events.splice(index, 1);
        localStorage.setItem("events", JSON.stringify(events));
        renderTable();
        if (editIndex === index) {
            form.reset();
            editIndex = null;
            formTitle.textContent = "Tambah Event";
        }
    }
}

// Search Event
searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderTable();
});
