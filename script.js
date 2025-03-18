// Fungsi untuk memuat data dari localStorage
function loadSavedData() {
    // Memuat data input dari localStorage
    const savedInput = localStorage.getItem('savedInput');
    if (savedInput) {
        document.getElementById('names').value = savedInput;
    }

    // Memuat daftar nama yang sudah terpilih dari localStorage
    const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
    const selectedList = document.getElementById('selected-list');
    selectedList.innerHTML = ''; // Kosongkan daftar sebelum memuat ulang

    selectedNames.forEach((name, index) => {
        const selectedItem = document.createElement('div');
        selectedItem.textContent = `${index + 1}. ${name}`;
        selectedItem.className = 'bg-gray-100 p-2 rounded-lg';
        selectedList.appendChild(selectedItem);
    });
}

// Fungsi untuk menyimpan data ke localStorage
function saveData() {
    // Simpan isi textarea ke localStorage
    const inputValue = document.getElementById('names').value;
    localStorage.setItem('savedInput', inputValue);

    // Simpan daftar nama yang sudah terpilih ke localStorage
    const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
    localStorage.setItem('selectedNames', JSON.stringify(selectedNames));
}

// Fungsi untuk menghapus semua data
function resetData() {
    // Hapus data dari localStorage
    localStorage.removeItem('savedInput');
    localStorage.removeItem('selectedNames');

    // Reset tampilan
    document.getElementById('names').value = ''; // Kosongkan textarea
    document.getElementById('result').textContent = ''; // Kosongkan hasil pemenang
    document.getElementById('selected-list').innerHTML = ''; // Kosongkan daftar nama yang sudah terpilih
}

// Memuat data saat halaman dimuat
document.addEventListener('DOMContentLoaded', loadSavedData);

// Menyimpan data setiap kali textarea diubah
document.getElementById('names').addEventListener('input', saveData);

// Tombol Putar
document.getElementById('spin').addEventListener('click', function () {
    const namesInput = document.getElementById('names').value;
    let namesArray = namesInput.split('\n').map(name => name.trim()).filter(name => name.length > 0);

    // Fitur curang: Hapus "RYSNANTO" dari daftar nama yang bisa dipilih
    namesArray = namesArray.filter(name => name.toUpperCase() !== 'RYSNANTO');

    if (namesArray.length === 0) {
        alert('Tidak ada nama yang tersedia untuk dipilih!');
        return;
    }

    const randomIndex = Math.floor(Math.random() * namesArray.length);
    const winner = namesArray[randomIndex];

    // Tampilkan hasil
    document.getElementById('result').textContent = `Pemenangnya adalah: ${winner}`;

    // Hapus nama yang sudah terpilih dari daftar
    namesArray.splice(randomIndex, 1);
    document.getElementById('names').value = namesArray.join('\n');

    // Simpan perubahan pada textarea ke localStorage
    saveData();

    // Tambahkan nama yang sudah terpilih ke daftar hasil
    const selectedList = document.getElementById('selected-list');
    const selectedItem = document.createElement('div');
    const selectedNames = JSON.parse(localStorage.getItem('selectedNames')) || [];
    selectedNames.push(winner); // Tambahkan nama ke array
    localStorage.setItem('selectedNames', JSON.stringify(selectedNames)); // Simpan ke localStorage

    // Tampilkan nomor urut dan nama yang sudah terpilih
    selectedItem.textContent = `${selectedNames.length}. ${winner}`;
    selectedItem.className = 'bg-gray-100 p-2 rounded-lg';
    selectedList.appendChild(selectedItem);
});

// Tombol Reset
document.getElementById('reset').addEventListener('click', resetData);