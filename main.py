import json
import os

class Peserta:
    def __init__(self, nama, email, hadir=False):
        self.nama = nama
        self.email = email
        self.hadir = hadir

    def keDict(self):
        return {"nama": self.nama,"email": self.email,"hadir": self.hadir}

class Event:
    def __init__(self, judul, waktu, lokasi, kapasitas, deskripsi):
        self.judul = judul
        self.waktu = waktu
        self.lokasi = lokasi
        self.kapasitas = kapasitas
        self.deskripsi = deskripsi
        self.peserta = []

    def status(self):
        if len(self.peserta) >= self.kapasitas:
            return "PENUH"
        else:
            return "TERSEDIA"

    def keDict(self):
        return {
            "judul": self.judul,
            "waktu": self.waktu,
            "lokasi": self.lokasi,
            "kapasitas": self.kapasitas,
            "deskripsi": self.deskripsi,
            "peserta": [p.keDict() for p in self.peserta]
        }

    def info(self):
        print("Judul     :", self.judul)
        print("Waktu     :", self.waktu)
        print("Lokasi    :", self.lokasi)
        print("Kapasitas :", len(self.peserta), "/", self.kapasitas)
        print("Status    :", self.status())
        print("Deskripsi :", self.deskripsi)


class EventManager:
    def __init__(self):
        self.events = []

    # CREATE
    def tambahEvent(self, event):
        self.events.append(event)
        print("Event berhasil ditambahkan")

    # READ
    def tampilkanEvent(self):
        if not self.events:
            print("Belum ada event")
            return

        print("===== DAFTAR EVENT =====")
        for i in range(len(self.events)):
            print("Event ke-", i + 1)
            self.events[i].info()
            print("------------------------")

    # UPDATE
    def ubahEvent(self, index, waktu, lokasi, kapasitas, deskripsi):
        try:
            event = self.events[index]
            if waktu != "":
                event.waktu = waktu
            if lokasi != "":
                event.lokasi = lokasi
            if kapasitas != "":
                event.kapasitas = kapasitas
            if deskripsi != "":
                event.deskripsi = deskripsi
            print("Event berhasil diubah")
        except IndexError:
            print("Event tidak ditemukan")

    # DELETE
    def hapusEvent(self, index):
        try:
            judul = self.events[index].judul
            self.events.pop(index)
            print("Event", judul, "berhasil dihapus")
        except IndexError:
            print("Event tidak ditemukan")

    # PESERTA
    def tambahPeserta(self, index, peserta):
        try:
            event = self.events[index]
            if event.status() == "PENUH":
                print("Event sudah penuh")
                return
            event.peserta.append(peserta)
            print("Peserta berhasil ditambahkan")
        except IndexError:
            print("Event tidak ditemukan")

    # FILTER
    def filterStatus(self, status):
        ada = False
        for event in self.events:
            if event.status() == status:
                event.info()
                print("------------------------")
                ada = True
        if not ada:
            print("Tidak ada event dengan status", status)

    # STATISTIK
    def statistik(self):
        total_event = len(self.events)
        total_peserta = 0
        event_penuh = 0

        for event in self.events:
            total_peserta += len(event.peserta)
            if event.status() == "PENUH":
                event_penuh += 1

        print("===== STATISTIK =====")
        print("Total Event   :", total_event)
        print("Event Penuh   :", event_penuh)
        print("Total Peserta :", total_peserta)

    # FILE
    def simpan(self, namaFile):
        with open(namaFile, "w") as file:
            json.dump([e.keDict() for e in self.events], file)
        print("Data berhasil disimpan")

    def load(self, namaFile):
        if not os.path.exists(namaFile):
            return
        with open(namaFile, "r") as file:
            data = json.load(file)
            self.events = []
            for item in data:
                event = Event(
                    item["judul"],
                    item["waktu"],
                    item["lokasi"],
                    item["kapasitas"],
                    item["deskripsi"]
                )
                for p in item["peserta"]:
                    event.peserta.append(Peserta(p["nama"], p["email"], p["hadir"]))
                self.events.append(event)


def menu():
    manager = EventManager()
    namaFile = "event.json"
    manager.load(namaFile)

    while True:
        print("==============================")
        print("EVENT MANAGEMENT SYSTEM")
        print("1. Tambah Event")
        print("2. Lihat Semua Event")
        print("3. Ubah Event")
        print("4. Hapus Event")
        print("5. Tambah Peserta")
        print("6. Filter Event")
        print("7. Statistik")
        print("8. Simpan dan Keluar")
        print("==============================")

        pilihan = input("Pilih menu (1-8): ")

        if pilihan == "1":
            judul = input("Judul Event: ")
            waktu = input("Tanggal dan Waktu: ")
            lokasi = input("Lokasi atau Platform: ")
            kapasitas = int(input("Kapasitas Peserta: "))
            deskripsi = input("Deskripsi Singkat: ")
            manager.tambahEvent(Event(judul, waktu, lokasi, kapasitas, deskripsi))

        elif pilihan == "2":
            manager.tampilkanEvent()

        elif pilihan == "3":
            manager.tampilkanEvent()
            idx = int(input("Nomor Event: ")) - 1
            waktu = input("Waktu baru (kosong jika tidak diubah): ")
            lokasi = input("Lokasi baru: ")
            kapasitas = input("Kapasitas baru: ")
            deskripsi = input("Deskripsi baru: ")
            if kapasitas != "":
                kapasitas = int(kapasitas)
            manager.ubahEvent(idx, waktu, lokasi, kapasitas, deskripsi)

        elif pilihan == "4":
            manager.tampilkanEvent()
            idx = int(input("Nomor Event: ")) - 1
            manager.hapusEvent(idx)

        elif pilihan == "5":
            manager.tampilkanEvent()
            idx = int(input("Nomor Event: ")) - 1
            nama = input("Nama Peserta: ")
            email = input("Email Peserta: ")
            manager.tambahPeserta(idx, Peserta(nama, email))

        elif pilihan == "6":
            status = input("Status (TERSEDIA / PENUH): ").upper()
            manager.filterStatus(status)

        elif pilihan == "7":
            manager.statistik()

        elif pilihan == "8":
            manager.simpan(namaFile)
            print("Terima kasih telah menggunakan program ini")
            break

        else:
            print("Pilihan tidak valid")


if __name__ == "__main__":
    menu()
