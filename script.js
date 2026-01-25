const form = document.getElementById("eventForm");
const tableBody = document.getElementById("eventTableBody");
const formTitle = document.getElementById("formTitle");
const resetBtn = document.getElementById("resetBtn");
const searchInput = document.getElementById("searchInput");

let events = JSON.parse(localStorage.getItem("events")) || [];
let editIndex = null;
let searchQuery = "";

renderTable();

// ===== PERBAIKAN FORMAT WAKTU (TAMBAHAN) =====
function formatWaktu(waktu) {
  const d = new Date(waktu);
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
// ============================================

// Render tabel event
function renderTable() {
  tableBody.innerHTML = "";

  // SIMPAN INDEX ASLI EVENT
  const filteredEvents = events
    .map((e, index) => ({ ...e, _index: index }))
    .filter(
      (e) =>
        e.judul.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.lokasi.toLowerCase().includes(searchQuery.toLowerCase()),
    );

  if (filteredEvents.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center">Belum ada event</td></tr>`;
    return;
  }

  filteredEvents.forEach((e) => {
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
            <td>${formatWaktu(e.waktu)}</td>
            <td>${e.lokasi}</td>
            <td>${e.kapasitas}</td>
            <td class="${statusClass}">${status}</td>
            <td>${e.deskripsi}</td>
            <td>
                <button class="btn-edit" onclick="editEvent(${e._index})">Edit</button>
                <button class="btn-delete" onclick="deleteEvent(${e._index})">Hapus</button>
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
    peserta: 0,
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
window.editEvent = function (index) {
  const e = events[index];

  // Isi field form
  form.title.value = e.judul;
  form.location.value = e.lokasi;
  form.capacity.value = e.kapasitas;
  form.description.value = e.deskripsi;

  // Format tanggal agar sesuai dengan input datetime-local (YYYY-MM-DDTHH:mm)
  if (e.waktu) {
    const date = new Date(e.waktu);
    const formattedDate = date.toISOString().slice(0, 16);
    form.date.value = formattedDate;
  }

  editIndex = index;
  formTitle.textContent = "Edit Event";

  // Scroll otomatis ke form agar user tahu sedang mode edit
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// Pastikan deleteEvent juga tersedia secara global
window.deleteEvent = function (index) {
  if (confirm(`Hapus event "${events[index].judul}"?`)) {
    events.splice(index, 1);
    localStorage.setItem("events", JSON.stringify(events));
    renderTable();
  }
};

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
